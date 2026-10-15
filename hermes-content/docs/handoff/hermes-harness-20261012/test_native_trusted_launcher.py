"""Offline launcher and one-shot Telegram delivery checks; no network/provider."""
import asyncio
from concurrent.futures import ThreadPoolExecutor
from dataclasses import replace
import hashlib
import importlib
import json
from pathlib import Path
from types import SimpleNamespace
import tempfile
import unittest
from unittest.mock import patch

from native_cloud_cli import CloudTaskPlan, NativeCloudCLI
from native_receipt_bridge import NativeReceiptBridge, NativeWorkRequest
from native_result_store import FileResultSink
from native_telegram_authority import TelegramNativeWorkAuthority, _FACTORY_CAPABILITY
from native_trusted_launcher import install_native_trusted_runtime_before_connect
from native_trusted_runtime import NativeResultDeliveryContract, NativeTrustedRuntime
from native_receipt_bridge import NativeObservation
from sqlite_pilot import SQLiteQueue, TaskSpec


NOW = 200
TASK = "task_e_" + "1" * 32
OP = "00000000-0000-0000-0000-000000000099"


class Adapter:
    """Fixture exposing only the exact callback seam required by the runtime."""
    __module__ = "fixture_telegram_adapter"

    def __init__(self):
        self._app = None
        self._bot = None
        self.sent = []
        self.config = SimpleNamespace(extra={"allow_from": {"42"}})
        self.command_allowed = True

    def _callback_ctx(self, query):
        return query

    async def _callback_authorized(self, query, context, message):
        return True

    async def _handle_callback_query(self, update, context):
        return "legacy"

    async def _handle_command(self, update, context):
        return "legacy-command"

    def _is_callback_user_authorized(self, user_id, **kwargs):
        self.last_auth = (str(user_id), kwargs)
        return self.command_allowed

    def _should_process_message(self, message, *, is_command):
        return is_command

    def _log_blocked_user(self, message):
        self.blocked = True


class FakeButton:
    def __init__(self, text, *, callback_data):
        self.text = text
        self.callback_data = callback_data


class FakeMarkup:
    def __init__(self, rows):
        self.inline_keyboard = rows


class FakeBot:
    def __init__(self, *, fail=False, chat_id="42", chat_type="private"):
        self.calls = []
        self.fail = fail
        self.chat_id = chat_id
        self.chat_type = chat_type
        self.base_url = "https://api.telegram.org/botfixture"
        self._request = None
        self.document_calls = []

    async def send_message(self, **kwargs):
        self.calls.append(kwargs)
        if self.fail:
            raise TimeoutError("ambiguous fixture send")
        return SimpleNamespace(
            chat=SimpleNamespace(id=self.chat_id, type=self.chat_type),
            message_id=91,
        )

    async def send_document(self, **kwargs):
        document = kwargs.get("document")
        self.document_calls.append({**kwargs, "bytes": document.getvalue()})
        if self.fail:
            raise TimeoutError("ambiguous fixture document send")
        return SimpleNamespace(
            chat=SimpleNamespace(id=self.chat_id, type=self.chat_type),
            message_id=92,
        )


class FakeMessage:
    def __init__(self, text, *, actor="42", chat="42", chat_type="private", message_id=92):
        self.text = text
        self.from_user = SimpleNamespace(id=actor, is_bot=False, username="fixture")
        self.chat = SimpleNamespace(id=chat, type=chat_type)
        self.message_id = message_id
        self.replies = []
        self.forward_origin = None
        self.sender_chat = None
        self.via_bot = None

    async def reply_text(self, text):
        self.replies.append(text)


class NativeTrustedLauncherTests(unittest.TestCase):
    def setUp(self):
        self.area = tempfile.TemporaryDirectory()
        self.addCleanup(self.area.cleanup)
        self.root = Path(self.area.name)
        (self.root / ".git").mkdir()
        executable = self.root / "codex.exe"
        executable.write_bytes(b"fixture executable")
        prompt = self.root / "reviewed.md"
        prompt.write_text("ONIA_PURPOSE: Offline reviewed prompt\n", encoding="utf-8")
        self.plan = CloudTaskPlan(
            executable, self.root, "a" * 32, "codex/native-test", prompt,
            hashlib.sha256(prompt.read_bytes()).hexdigest(),
            hashlib.sha256(executable.read_bytes()).hexdigest(), "b" * 40,
        )
        self.plan_sha = self.plan.request()[2]
        self.queue = SQLiteQueue(self.root / "fixture.sqlite3")
        NativeReceiptBridge.bootstrap_guard(self.queue, "test:reviewed", self.plan_sha, 100)
        self.bridge = NativeReceiptBridge(self.queue)
        self.request = NativeWorkRequest(
            task_id=TASK, worker_id="worker", contract_id="contract",
            repo="onia-hermes", ref="codex/native-test", head="b" * 40,
            input_sha=self.plan_sha, operation_id=OP, nonce="fixture-nonce",
            plan_sha=self.plan_sha, approval_claim_ref="fixture-claim",
            predecessor_task_id="task_e_" + "2" * 32,
            result_paths=("result.json",), max_status_events=2,
            max_result_events=1,
        )
        self.queue.enqueue(TaskSpec(TASK, "worker", "onia-hermes", "codex/native-test",
                                    "b" * 40, "contract", self.plan_sha), 101)
        self.claim = self.queue.claim("worker", "fixture-owner", 102, 300).claim
        self.transport = NativeCloudCLI(self.bridge)
        sink_area = tempfile.TemporaryDirectory()
        self.addCleanup(sink_area.cleanup)
        self.sink = FileResultSink(Path(sink_area.name),
                                   _fixture_dir_fsync=lambda _path: None)
        self.adapter = Adapter()
        self.authority = TelegramNativeWorkAuthority(self.adapter, _capability=_FACTORY_CAPABILITY)
        self.adapter_module = SimpleNamespace(
            TelegramAdapter=Adapter, InlineKeyboardButton=FakeButton,
            InlineKeyboardMarkup=FakeMarkup,
            _coerce_allow_set=lambda value: set(value),
            _scoped_gate_env=lambda _name: "",
        )
        self.factory_patch = patch.object(
            TelegramNativeWorkAuthority, "_from_trusted_launcher",
            return_value=self.authority,
        )
        self.factory_patch.start()
        self.addCleanup(self.factory_patch.stop)

    def install(self, result_delivery_contract=None):
        return install_native_trusted_runtime_before_connect(
            self.adapter, queue=self.queue, bridge=self.bridge,
            transport=self.transport, request=self.request, plan=self.plan,
            claim=self.claim, result_sink=self.sink,
            result_delivery_contract=result_delivery_contract, now_fn=lambda: NOW,
        )

    def connect_fixture(self):
        self.adapter._bot = FakeBot()
        self.adapter._app = SimpleNamespace(
            running=True, bot=self.adapter._bot,
        )  # PTB app captures handler at connect.

    def test_launcher_uses_existing_objects_and_rejects_late_install(self):
        runtime = self.install()
        self.assertIs(runtime.queue, self.queue)
        self.assertIs(runtime.result_sink, self.sink)
        self.assertIs(getattr(self.adapter._handle_callback_query,
                              "_native_trusted_runtime", None), runtime)
        self.assertIs(getattr(self.adapter._handle_command,
                              "_native_trusted_runtime", None), runtime)
        with self.queue._connection() as conn:
            self.assertEqual(conn.execute("SELECT status FROM tasks WHERE task_id=?",
                                           (TASK,)).fetchone()["status"], "running")
        self.assertEqual(self.authority._pending, {})
        self.assertEqual(self.adapter.sent, [])
        late = Adapter()
        late._app = object()
        with self.assertRaisesRegex(RuntimeError, "before TelegramAdapter.connect"):
            install_native_trusted_runtime_before_connect(
                late, queue=self.queue, bridge=self.bridge, transport=self.transport,
                request=self.request, plan=self.plan, result_sink=self.sink,
            )
        self.assertIsNone(getattr(late._handle_callback_query,
                                  "_native_trusted_runtime", None))

    def test_connected_private_prompt_binds_actual_returned_message(self):
        runtime = self.install()
        self.adapter._bot = FakeBot()
        self.adapter._app = SimpleNamespace(running=False, bot=self.adapter._bot)
        with patch("native_trusted_runtime.importlib.import_module",
                   return_value=self.adapter_module):
            early = asyncio.run(runtime.send_approval_prompt(
                actor_id="42", private_chat_id="42", now=NOW, ttl=30,
            ))
        self.assertEqual(early["code"], "approval_context_unavailable")
        self.assertEqual(self.adapter._bot.calls, [])
        self.connect_fixture()
        with patch("native_trusted_runtime.importlib.import_module",
                   return_value=self.adapter_module):
            result = asyncio.run(runtime.send_approval_prompt(
                actor_id="42", private_chat_id="42", now=NOW, ttl=30,
            ))
        self.assertEqual(result["state"], "awaiting_telegram_approval")
        self.assertEqual(len(self.adapter._bot.calls), 1)
        sent_text = self.adapter._bot.calls[0]["text"]
        for bound_scope in ("enviar una tarea Codex Cloud", "Contrato: contract",
                            "Propósito revisado", "Offline reviewed prompt",
                            self.plan.prompt_sha256,
                            self.request.digest(), self.request.input_sha,
                            "result.json", "1 envío", "2/2 eventos de estado",
                            "1/1 evento de resultado"):
            self.assertIn(bound_scope, sent_text)
        callback_data = self.adapter._bot.calls[0]["reply_markup"].inline_keyboard[0][0].callback_data
        query = SimpleNamespace(
            data=callback_data, from_user=SimpleNamespace(id="42"),
            message=SimpleNamespace(chat=SimpleNamespace(type="private"),
                                    chat_id="42", message_id=91),
        )
        self.assertEqual(asyncio.run(runtime.handle_callback(query, now=NOW)), "approved")
        self.assertEqual(self.authority.verify(self.request, NOW).request_sha,
                         self.request.digest())

    def test_ambiguous_send_holds_and_same_request_never_sends_again(self):
        runtime = self.install()
        self.connect_fixture()
        self.adapter._bot = FakeBot(fail=True)
        self.adapter._app.bot = self.adapter._bot
        with patch("native_trusted_runtime.importlib.import_module",
                   return_value=self.adapter_module):
            first = asyncio.run(runtime.send_approval_prompt(
                actor_id="42", private_chat_id="42", now=NOW, ttl=30,
            ))
            second = asyncio.run(runtime.send_approval_prompt(
                actor_id="42", private_chat_id="42", now=NOW, ttl=30,
            ))
        self.assertEqual(first["code"], "approval_delivery_unknown")
        self.assertEqual(second["code"], "approval_preflight_failed")
        self.assertEqual(len(self.adapter._bot.calls), 1)
        pending = next(iter(self.authority._pending.values()))
        self.assertIsNone(pending.message_id)
        with self.assertRaises(RuntimeError):
            self.authority.verify(self.request, NOW)

    def test_wrong_private_identity_or_returned_chat_holds_without_grant(self):
        runtime = self.install()
        self.connect_fixture()
        self.adapter._bot = FakeBot(chat_id="777")
        self.adapter._app.bot = self.adapter._bot
        with patch("native_trusted_runtime.importlib.import_module",
                   return_value=self.adapter_module):
            mismatch = asyncio.run(runtime.send_approval_prompt(
                actor_id="42", private_chat_id="43", now=NOW, ttl=30,
            ))
            self.assertEqual(mismatch["code"], "approval_context_unavailable")
            wrong_return = asyncio.run(runtime.send_approval_prompt(
                actor_id="42", private_chat_id="42", now=NOW, ttl=30,
            ))
        self.assertEqual(wrong_return["code"], "approval_delivery_unknown")
        self.assertEqual(len(self.adapter._bot.calls), 1)
        pending = next(iter(self.authority._pending.values()))
        self.assertIsNone(pending.message_id)

    def test_bot_identity_and_keyboard_build_failure_hold_without_send(self):
        runtime = self.install()
        self.connect_fixture()
        self.adapter._app.bot = FakeBot()
        with patch("native_trusted_runtime.importlib.import_module",
                   return_value=self.adapter_module):
            wrong_bot = asyncio.run(runtime.send_approval_prompt(
                actor_id="42", private_chat_id="42", now=NOW, ttl=30,
            ))
        self.assertEqual(wrong_bot["code"], "approval_context_unavailable")
        self.assertEqual(self.adapter._bot.calls, [])

        self.adapter._app.bot = self.adapter._bot
        def broken_button(*_args, **_kwargs):
            raise RuntimeError("fixture keyboard construction failed")
        bad_module = SimpleNamespace(
            TelegramAdapter=Adapter, InlineKeyboardButton=broken_button,
            InlineKeyboardMarkup=FakeMarkup,
        )
        with patch("native_trusted_runtime.importlib.import_module",
                   return_value=bad_module):
            failed = asyncio.run(runtime.send_approval_prompt(
                actor_id="42", private_chat_id="42", now=NOW, ttl=30,
            ))
            repeated = asyncio.run(runtime.send_approval_prompt(
                actor_id="42", private_chat_id="42", now=NOW, ttl=30,
            ))
        self.assertEqual(failed["code"], "approval_delivery_unknown")
        self.assertEqual(repeated["code"], "approval_preflight_failed")
        self.assertEqual(self.adapter._bot.calls, [])
        self.assertIsNone(next(iter(self.authority._pending.values())).message_id)

    def test_missing_marked_purpose_holds_before_challenge(self):
        runtime = self.install()
        self.connect_fixture()
        prompt = self.root / "reviewed.md"
        prompt.write_text("A purpose line is required.\n", encoding="utf-8")
        object.__setattr__(self.plan, "prompt_sha256",
                           hashlib.sha256(prompt.read_bytes()).hexdigest())
        new_plan_sha = self.plan.request()[2]
        request = replace(self.request, input_sha=new_plan_sha, plan_sha=new_plan_sha)
        object.__setattr__(runtime.native_runtime, "request", request)
        with self.queue._connection() as conn:
            conn.execute("UPDATE tasks SET input_sha=? WHERE task_id=?",
                         (new_plan_sha, TASK))
        with patch("native_trusted_runtime.importlib.import_module",
                   return_value=self.adapter_module):
            result = asyncio.run(runtime.send_approval_prompt(
                actor_id="42", private_chat_id="42", now=NOW, ttl=30,
            ))
        self.assertEqual(result["code"], "approval_context_unavailable")
        self.assertEqual(self.adapter._bot.calls, [])
        self.assertEqual(self.authority._pending, {})

    def test_uninstall_is_only_allowed_before_connect_and_while_owned(self):
        runtime = self.install()
        runtime.uninstall_before_connect()
        self.assertIsNone(getattr(self.adapter._handle_callback_query,
                                  "_native_trusted_runtime", None))
        self.assertIsNone(getattr(self.adapter._handle_command,
                                  "_native_trusted_runtime", None))
        runtime = self.install()
        self.connect_fixture()
        with self.assertRaisesRegex(RuntimeError, "after TelegramAdapter.connect"):
            runtime.uninstall_before_connect()

    def test_launcher_fails_closed_when_command_seam_is_missing(self):
        adapter = Adapter()
        adapter._handle_command = None
        original_callback = adapter._handle_callback_query
        with self.assertRaisesRegex(TypeError, "command dispatcher unavailable"):
            install_native_trusted_runtime_before_connect(
                adapter, queue=self.queue, bridge=self.bridge, transport=self.transport,
                request=self.request, plan=self.plan, result_sink=self.sink,
            )
        self.assertEqual(adapter._handle_callback_query, original_callback)

    def _approve_request(self, runtime):
        self.connect_fixture()
        with patch("native_trusted_runtime.importlib.import_module",
                   return_value=self.adapter_module):
            sent = asyncio.run(runtime.send_approval_prompt(
                actor_id="42", private_chat_id="42", now=NOW, ttl=30,
            ))
        self.assertEqual(sent["state"], "awaiting_telegram_approval")
        data = self.adapter._bot.calls[0]["reply_markup"].inline_keyboard[0][0].callback_data
        query = SimpleNamespace(
            data=data, from_user=SimpleNamespace(id="42"),
            message=SimpleNamespace(chat=SimpleNamespace(type="private"),
                                    chat_id="42", message_id=91),
            answer=lambda **_kwargs: asyncio.sleep(0),
        )
        asyncio.run(self.adapter._handle_callback_query(
            SimpleNamespace(callback_query=query), object()))
        self.assertEqual(self.authority.verify(self.request, NOW).actor, "42")

    def _prepare_predecessor(self):
        prior_id = self.request.predecessor_task_id
        prior = TaskSpec(prior_id, "prior-worker", self.request.repo, self.request.ref,
                         self.request.head, self.request.contract_id, self.request.input_sha)
        self.queue.enqueue(prior, 99)
        prior_claim = self.queue.claim("prior-worker", "prior-owner", 100, 60).claim
        prior_op = "00000000-0000-0000-0000-000000000098"
        self.bridge.reserve(prior_claim, prior_op, "prior-nonce", "test:reviewed", 101,
                            self.request.plan_sha)
        self.bridge.ingest(NativeObservation(prior_op, "cloud_cli_task", "task_e_" + "2" * 32,
                                             self.request.input_sha, "completed", 102,
                                             "fixture:prior", "c" * 64), 102)
        self.queue.resolve_reconciliation(prior_id, "applied", "fixture:prior-qa", 103)

    def _invoke_command(self, update):
        with patch("native_trusted_runtime.importlib.import_module",
                   return_value=self.adapter_module):
            return asyncio.run(self.adapter._handle_command(update, object()))

    def test_explicit_private_command_calls_bound_submit_once_off_loop(self):
        runtime = self.install()
        self._prepare_predecessor()
        self._approve_request(runtime)
        submits = []

        def fake_submit(operation_id, plan):
            submits.append((operation_id, plan))
            with self.assertRaises(RuntimeError):
                asyncio.get_running_loop()
            return {"operation_id": operation_id, "state": "submitted",
                    "remote_id": TASK, "client_attempt_count": 1}

        update = SimpleNamespace(update_id=7001, message=FakeMessage("/onia_native_submit"))
        with patch.object(self.transport, "submit", side_effect=fake_submit):
            self._invoke_command(update)
            self._invoke_command(update)
        self.assertEqual(len(submits), 1)
        self.assertIs(submits[0][1], self.plan)
        self.assertEqual(update.message.replies[0], "Native event: submitted")
        self.assertEqual(update.message.replies[1], "Native event: needs_reconcile")
        self.assertIsNotNone(self.bridge.read(OP))

    def test_command_requires_exact_private_allowlisted_approved_update(self):
        runtime = self.install()
        self._approve_request(runtime)
        submits = []
        variants = (
            FakeMessage("/onia_native_submit", actor="99"),
            FakeMessage("/onia_native_submit", chat="99"),
            FakeMessage("/onia_native_submit", chat_type="group"),
            FakeMessage("/onia_native_submit argument"),
        )
        self.adapter.command_allowed = False
        variants += (FakeMessage("/onia_native_submit"),)
        with patch.object(self.transport, "submit", side_effect=lambda *args: submits.append(args)):
            for index, message in enumerate(variants):
                self._invoke_command(SimpleNamespace(update_id=8000 + index, message=message))
        self.assertEqual(submits, [])
        self.assertIsNone(self.bridge.read(OP))

    def test_explicit_command_honors_controller_stop_before_transport(self):
        runtime = self.install()
        self._prepare_predecessor()
        self._approve_request(runtime)
        with self.queue._connection() as conn:
            conn.execute("UPDATE controller_guard_state SET stopped=1,epoch=epoch+1 WHERE singleton=1")
        submits = []
        message = FakeMessage("/onia_native_submit")
        with patch.object(self.transport, "submit", side_effect=lambda *args: submits.append(args)):
            self._invoke_command(SimpleNamespace(update_id=9001, message=message))
        self.assertEqual(submits, [])
        self.assertEqual(message.replies, ["Native event: hold_stop"])

    def test_durable_actor_allows_bounded_status_after_ttl_and_runtime_restart(self):
        runtime = self.install()
        self._prepare_predecessor()
        self._approve_request(runtime)
        def fake_submit(operation_id, plan):
            self.bridge.ingest(NativeObservation(
                operation_id, "cloud_cli_task", TASK, self.request.input_sha,
                "submitted", NOW + 1, "fixture:submit"), NOW + 1)
            return {"operation_id": operation_id, "state": "submitted",
                    "remote_id": TASK, "client_attempt_count": 1}

        submit_message = FakeMessage("/onia_native_submit")
        with patch.object(self.transport, "submit", side_effect=fake_submit):
            self._invoke_command(SimpleNamespace(update_id=7100, message=submit_message))
        self.assertEqual(submit_message.replies, ["Native event: submitted"])

        # A process restart loses the in-memory grant. The persisted exact
        # authority receipt still binds the authenticated owner for later reads.
        runtime.authority = TelegramNativeWorkAuthority(
            self.adapter, _capability=_FACTORY_CAPABILITY)
        runtime._now_fn = lambda: NOW + 500
        status_calls = []

        def fake_status(operation_id, executable):
            status_calls.append((operation_id, executable))
            return {"state": "running", "remote_id": TASK,
                    "provider_status": "running"}

        stranger = FakeMessage("/onia_native_status", actor="99", chat="99")
        with patch.object(self.transport, "status", side_effect=fake_status):
            self._invoke_command(SimpleNamespace(update_id=7101, message=stranger))
            with self.queue._connection() as conn:
                events_before = conn.execute(
                    "SELECT work_events_json FROM native_operations WHERE operation_id=?",
                    (OP,)).fetchone()["work_events_json"]
            self.assertIn(events_before, (None, "{}"))

            owner_update = SimpleNamespace(
                update_id=7102, message=FakeMessage("/onia_native_status"))
            self._invoke_command(owner_update)
            self._invoke_command(owner_update)

        self.assertEqual(len(status_calls), 1, owner_update.message.replies)
        self.assertEqual(status_calls[0], (OP, self.plan.executable))
        self.assertEqual(stranger.replies, ["Native event: hold"])
        self.assertEqual(owner_update.message.replies,
                         ["Native event: running", "Native event: needs_reconcile"])

    def test_later_event_rejects_mutated_request_against_durable_receipt(self):
        runtime = self.install()
        self._prepare_predecessor()
        self._approve_request(runtime)

        def fake_submit(operation_id, plan):
            self.bridge.ingest(NativeObservation(
                operation_id, "cloud_cli_task", TASK, self.request.input_sha,
                "submitted", NOW + 1, "fixture:submit"), NOW + 1)
            return {"operation_id": operation_id, "state": "submitted",
                    "remote_id": TASK, "client_attempt_count": 1}

        with patch.object(self.transport, "submit", side_effect=fake_submit):
            self._invoke_command(SimpleNamespace(
                update_id=7200, message=FakeMessage("/onia_native_submit")))
        runtime.authority = TelegramNativeWorkAuthority(
            self.adapter, _capability=_FACTORY_CAPABILITY)
        runtime._now_fn = lambda: NOW + 500
        changed = replace(self.request, nonce="changed-nonce")
        object.__setattr__(runtime.native_runtime, "request", changed)
        status_calls = []
        with patch.object(self.transport, "status", side_effect=lambda *args: status_calls.append(args)):
            message = FakeMessage("/onia_native_status")
            self._invoke_command(SimpleNamespace(update_id=7201, message=message))
        with self.queue._connection() as conn:
            events = conn.execute(
                "SELECT work_events_json FROM native_operations WHERE operation_id=?",
                (OP,)).fetchone()["work_events_json"]
        self.assertEqual(status_calls, [])
        self.assertIn(events, (None, "{}"))
        self.assertEqual(message.replies, ["Native event: hold"])

    def _prepare_delivery_state(self, runtime):
        """Reach QA closure through the existing local event path, no provider."""
        self._prepare_predecessor()
        self._approve_request(runtime)
        self.bridge.authorize_and_reserve_work(
            self.claim, self.request, self.authority, NOW)
        with patch("native_receipt_bridge.time.time", return_value=NOW):
            self.bridge.begin_dispatch(OP, self.plan_sha)
        self.bridge.ingest(NativeObservation(
            OP, "cloud_cli_task", TASK, self.request.input_sha, "submitted",
            NOW + 1, "fixture:submitted"), NOW + 1)
        artifact = {
            "operation_id": OP, "input_sha": self.request.input_sha,
            "repository": {"expected_head": self.request.head,
                           "observed_head": self.request.head},
            "result": "revisión – ONIA",
        }
        bundle = {
            "state": "awaiting_independent_qa", "operation_id": OP,
            "remote_id": TASK, "input_sha": self.request.input_sha,
            "files": {"result.json": {
                "sha256": "d" * 64,
                "bytes": len(json.dumps(artifact, sort_keys=True, separators=(",", ":"),
                                 ensure_ascii=False, allow_nan=False).encode("utf-8")),
                "json": artifact,
            }},
        }
        raw = json.dumps(bundle, sort_keys=True, separators=(",", ":"),
                         ensure_ascii=False, allow_nan=False).encode("utf-8")
        qa_ref = "fixture:independent-qa"
        with patch.object(self.transport, "collect_result", return_value=bundle):
            result_output = runtime.handle_event(json.dumps({
                "schema": 1, "event": "result", "event_id": "fixture-result-event",
                "operation_id": OP, "request_sha": self.request.digest(),
            }), now=NOW + 2)
        self.assertEqual(result_output["state"], "awaiting_independent_qa")

        class BoundFixtureReviewer:
            def verify(_self, request, qa_bundle, _now):
                from controller_pilot import digest
                return {
                    "verified": True, "request_sha": request.digest(),
                    "bundle_sha": digest(qa_bundle), "remote_id": TASK,
                    "reviewer_id": "fixture-independent-reviewer",
                    "goal_outcome": "completed",
                    "authority_source": "fixture:independent-review",
                    "evidence_ref": qa_ref,
                }

        object.__setattr__(runtime.native_runtime, "qa_verifier", BoundFixtureReviewer())
        qa_output = runtime.handle_event(json.dumps({
            "schema": 1, "event": "qa", "event_id": "fixture-qa-event",
            "operation_id": OP, "request_sha": self.request.digest(),
        }), now=NOW + 3)
        self.assertEqual(qa_output["state"], "closure_resolved")
        receipt = self.bridge.read_result_bundle_receipt(self.request)
        operation = self.bridge.read(OP)
        result_sha = operation["observation"]["result_sha"]
        contract = NativeResultDeliveryContract(
            OP, self.request.digest(), receipt["sha256"], result_sha,
            "42", "42", operation["stop_epoch"],
        )
        loaded_raw = self.sink.load(receipt["ref"], OP, self.request.digest(),
                                    receipt["sha256"])
        from controller_pilot import digest
        qa_bundle_sha = digest(json.loads(loaded_raw.decode("utf-8")))
        self.assertNotEqual(receipt["sha256"], qa_bundle_sha)
        runtime.result_delivery_contract = contract
        return runtime, contract, loaded_raw, qa_bundle_sha

    def _invoke_delivery(self, runtime, *, update_id=9901, actor="42", chat="42"):
        update = SimpleNamespace(
            update_id=update_id,
            message=FakeMessage("/onia_native_deliver", actor=actor, chat=chat),
        )
        self._invoke_command(update)
        return update.message.replies[-1], update.message

    def test_explicit_delivery_sends_bound_bundle_once_after_restart(self):
        runtime = self.install()
        runtime, _contract, raw, _qa_bundle_sha = self._prepare_delivery_state(runtime)
        with patch.object(NativeTrustedRuntime, "_single_call_document_transport_ready",
                          return_value=True):
            first, first_message = self._invoke_delivery(runtime)
            object.__setattr__(runtime.native_runtime, "bridge",
                               NativeReceiptBridge(self.queue))
            second, second_message = self._invoke_delivery(runtime, update_id=9902)
        self.assertEqual(first, "Native event: ack")
        self.assertEqual(second, "Native event: needs_reconcile")
        self.assertEqual(first_message.replies, ["Native event: ack"])
        self.assertEqual(second_message.replies, ["Native event: needs_reconcile"])
        self.assertEqual(len(self.adapter._bot.document_calls), 1)
        self.assertEqual(self.adapter._bot.document_calls[0]["bytes"], raw)
        events = json.loads(self.bridge.read(OP)["work_events_json"])
        delivery = [item for item in events.values() if item["event"] == "delivery"]
        self.assertEqual(len(delivery), 1)
        self.assertEqual(delivery[0]["state"], "ack")

    def test_delivery_unknown_transport_or_missing_optin_has_zero_bot_calls(self):
        runtime = self.install()
        runtime, contract, _raw, _qa_bundle_sha = self._prepare_delivery_state(runtime)
        runtime.result_delivery_contract = None
        missing, _ = self._invoke_delivery(runtime)
        self.assertEqual(missing, "Native event: hold")
        self.assertEqual(self.adapter._bot.document_calls, [])
        runtime.result_delivery_contract = contract
        with patch.object(NativeTrustedRuntime, "_single_call_document_transport_ready",
                          return_value=False):
            unknown, _ = self._invoke_delivery(runtime, update_id=9902)
        self.assertEqual(unknown, "Native event: hold")
        self.assertEqual(self.adapter._bot.document_calls, [])
        events = json.loads(self.bridge.read(OP)["work_events_json"])
        self.assertFalse(any(item.get("event") == "delivery" for item in events.values()))

    def test_delivery_wrong_actor_contract_and_stop_fail_before_send(self):
        runtime = self.install()
        runtime, contract, _raw, qa_bundle_sha = self._prepare_delivery_state(runtime)
        with patch.object(NativeTrustedRuntime, "_single_call_document_transport_ready",
                          return_value=True):
            wrong_actor, _ = self._invoke_delivery(runtime, actor="99", chat="99")
            self.assertEqual(wrong_actor, "Native event: hold")
            runtime.result_delivery_contract = replace(contract, bundle_sha256="e" * 64)
            bad_contract, _ = self._invoke_delivery(runtime, update_id=9902)
            self.assertEqual(bad_contract, "Native event: hold")
            runtime.result_delivery_contract = replace(contract, bundle_sha256=qa_bundle_sha)
            crossed_digest, _ = self._invoke_delivery(runtime, update_id=9903)
            self.assertEqual(crossed_digest, "Native event: hold")
            runtime.result_delivery_contract = contract
            runtime.result_delivery_contract = replace(contract, result_sha="f" * 64)
            bad_qa_digest, _ = self._invoke_delivery(runtime, update_id=9904)
            self.assertEqual(bad_qa_digest, "Native event: hold")
            runtime.result_delivery_contract = contract
            with self.queue._connection() as conn:
                conn.execute("UPDATE controller_guard_state SET stopped=1,epoch=epoch+1 "
                             "WHERE singleton=1")
            stopped, _ = self._invoke_delivery(runtime, update_id=9905)
        self.assertEqual(stopped, "Native event: hold")
        self.assertEqual(self.adapter._bot.document_calls, [])
        events = json.loads(self.bridge.read(OP)["work_events_json"])
        self.assertFalse(any(item.get("event") == "delivery" for item in events.values()))

    def test_ambiguous_delivery_is_permanently_maybe_without_retry(self):
        runtime = self.install()
        runtime, _contract, _raw, _qa_bundle_sha = self._prepare_delivery_state(runtime)
        self.adapter._bot.fail = True
        with patch.object(NativeTrustedRuntime, "_single_call_document_transport_ready",
                          return_value=True):
            first, _ = self._invoke_delivery(runtime)
            second, _ = self._invoke_delivery(runtime, update_id=9902)
        self.assertEqual(first, "Native event: maybe")
        self.assertEqual(second, "Native event: needs_reconcile")
        self.assertEqual(len(self.adapter._bot.document_calls), 1)
        events = json.loads(self.bridge.read(OP)["work_events_json"])
        delivery = [item for item in events.values() if item["event"] == "delivery"]
        self.assertEqual(len(delivery), 1)
        self.assertEqual(delivery[0]["state"], "maybe")

    def test_concurrent_delivery_reservations_consume_one_attempt(self):
        runtime = self.install()
        runtime, contract, _raw, qa_bundle_sha = self._prepare_delivery_state(runtime)
        bridge_one = NativeReceiptBridge(self.queue)
        bridge_two = NativeReceiptBridge(self.queue)
        with ThreadPoolExecutor(max_workers=2) as pool:
            outcomes = list(pool.map(
                lambda args: args[0].begin_result_delivery_once(
                    self.request, args[1], contract.as_record(), qa_bundle_sha, NOW + 4),
                ((bridge_one, "concurrent-a"), (bridge_two, "concurrent-b")),
            ))
        self.assertEqual(sorted(outcomes), [False, True])
        self.assertEqual(self.adapter._bot.document_calls, [])
        events = json.loads(self.bridge.read(OP)["work_events_json"])
        self.assertEqual(sum(item.get("event") == "delivery" for item in events.values()), 1)

    def test_ack_persistence_failure_stays_maybe_and_never_retries(self):
        runtime = self.install()
        runtime, _contract, _raw, _qa_bundle_sha = self._prepare_delivery_state(runtime)
        bridge = runtime.native_runtime.bridge
        finish = bridge.finish_result_delivery
        def fail_ack_once(*args, **kwargs):
            if args[2] == "ack":
                raise OSError("fixture ACK persistence loss")
            return finish(*args, **kwargs)
        with patch.object(NativeTrustedRuntime, "_single_call_document_transport_ready",
                          return_value=True), \
                patch.object(bridge, "finish_result_delivery", side_effect=fail_ack_once):
            first, _ = self._invoke_delivery(runtime)
            second, _ = self._invoke_delivery(runtime, update_id=9902)
        self.assertEqual(first, "Native event: maybe")
        self.assertEqual(second, "Native event: needs_reconcile")
        self.assertEqual(len(self.adapter._bot.document_calls), 1)
        events = json.loads(self.bridge.read(OP)["work_events_json"])
        delivery = [item for item in events.values() if item["event"] == "delivery"]
        self.assertEqual(len(delivery), 1)
        self.assertEqual(delivery[0]["state"], "maybe")

    def test_private_transport_guard_accepts_only_inspected_httpx_shape(self):
        import httpx

        client = httpx.AsyncClient(
            trust_env=False, transport=httpx.AsyncHTTPTransport(retries=0))
        self.addCleanup(lambda: asyncio.run(client.aclose()))
        class ExactRequest:
            def __init__(self, value):
                self._client = value

        class ExactBot(FakeBot):
            @property
            def request(self):
                return self._request[1]

        class ExactExtBot(ExactBot):
            pass

        bot = ExactExtBot()
        bot.rate_limiter = None
        # PTB's first request serves getUpdates; send_document uses bot.request
        # (the second entry), so deliberately give polling an unsafe shape.
        bot._request = (ExactRequest(object()), ExactRequest(client))
        modules = {
            "telegram._bot": SimpleNamespace(Bot=ExactBot),
            "telegram.ext": SimpleNamespace(ExtBot=ExactExtBot),
            "telegram.request": SimpleNamespace(HTTPXRequest=ExactRequest),
        }
        original_import = importlib.import_module
        def import_fixture(name):
            return modules[name] if name in modules else original_import(name)
        versions = {"python-telegram-bot": "22.8", "httpx": "0.28.1",
                    "httpcore": "1.0.9"}
        with patch("native_trusted_runtime.importlib.import_module", side_effect=import_fixture), \
                patch("native_trusted_runtime.importlib.metadata.version",
                      side_effect=lambda name: versions[name]):
            self.assertTrue(NativeTrustedRuntime._single_call_document_transport_ready(bot))
        fallback = httpx.AsyncClient(
            trust_env=False, transport=httpx.MockTransport(lambda _request: None))
        self.addCleanup(lambda: asyncio.run(fallback.aclose()))
        bot._request = (ExactRequest(object()), ExactRequest(fallback))
        with patch("native_trusted_runtime.importlib.import_module", side_effect=import_fixture), \
                patch("native_trusted_runtime.importlib.metadata.version",
                      side_effect=lambda name: versions[name]):
            self.assertFalse(NativeTrustedRuntime._single_call_document_transport_ready(bot))


if __name__ == "__main__":
    unittest.main(verbosity=2)
