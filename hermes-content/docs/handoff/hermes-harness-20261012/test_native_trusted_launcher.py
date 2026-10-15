"""Offline launcher and one-shot Telegram delivery checks; no network/provider."""
import asyncio
from dataclasses import replace
import hashlib
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
from native_trusted_runtime import NativeTrustedRuntime
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

    def _callback_ctx(self, query):
        return query

    async def _callback_authorized(self, query, context, message):
        return True

    async def _handle_callback_query(self, update, context):
        return "legacy"


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

    async def send_message(self, **kwargs):
        self.calls.append(kwargs)
        if self.fail:
            raise TimeoutError("ambiguous fixture send")
        return SimpleNamespace(
            chat=SimpleNamespace(id=self.chat_id, type=self.chat_type),
            message_id=91,
        )


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
        )
        self.factory_patch = patch.object(
            TelegramNativeWorkAuthority, "_from_trusted_launcher",
            return_value=self.authority,
        )
        self.factory_patch.start()
        self.addCleanup(self.factory_patch.stop)

    def install(self):
        return install_native_trusted_runtime_before_connect(
            self.adapter, queue=self.queue, bridge=self.bridge,
            transport=self.transport, request=self.request, plan=self.plan,
            claim=self.claim, result_sink=self.sink, now_fn=lambda: NOW,
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
        runtime = self.install()
        self.connect_fixture()
        with self.assertRaisesRegex(RuntimeError, "after TelegramAdapter.connect"):
            runtime.uninstall_before_connect()


if __name__ == "__main__":
    unittest.main(verbosity=2)
