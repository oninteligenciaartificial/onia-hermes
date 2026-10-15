"""Adversarial offline checks across the native callback, entrypoint and sink.

No provider, network, Telegram session, or operational queue is used.
"""
import asyncio
from dataclasses import replace
import hashlib
import json
from pathlib import Path
from types import SimpleNamespace
import tempfile
import unittest
from unittest.mock import patch

import controller_pilot
from native_result_store import FileResultSink, ResultStoreConflictError
from native_telegram_authority import TelegramNativeWorkAuthority, _FACTORY_CAPABILITY
from native_trusted_runtime import NativeTrustedRuntime
from native_work_entrypoint import NativeWorkRuntime, handle_native_event
from test_native_result_store import make_bundle, make_request
from native_cloud_cli import CloudTaskPlan, NativeCloudCLI
from native_receipt_bridge import NativeObservation, NativeReceiptBridge
from sqlite_pilot import SQLiteQueue, TaskSpec


class Gate:
    def __init__(self):
        self.allowed = True

    def _callback_ctx(self, query):
        return query

    async def _callback_authorized(self, query, context, message):
        return self.allowed


def callback(data, *, actor="1", chat="2", message="3", chat_type="private"):
    return SimpleNamespace(
        data=data, from_user=SimpleNamespace(id=actor),
        message=SimpleNamespace(chat=SimpleNamespace(type=chat_type),
                                chat_id=chat, message_id=message),
    )


class NativeIntegrationAdversarialTests(unittest.TestCase):
    def setUp(self):
        self.area = tempfile.TemporaryDirectory()
        self.addCleanup(self.area.cleanup)
        self.root = Path(self.area.name)
        self.request = make_request()

    def sink(self):
        return FileResultSink(self.root, _fixture_dir_fsync=lambda path: None)

    def authority(self):
        gate = Gate()
        return TelegramNativeWorkAuthority(gate, _capability=_FACTORY_CAPABILITY), gate

    def test_callback_forgery_other_session_replay_and_expiration(self):
        authority, gate = self.authority()
        buttons = authority.issue(self.request, actor_id="1", private_chat_id="2", now=100, ttl=10)
        authority.bind_sent_message(buttons["approve"], "3")
        check = lambda query, now=101: asyncio.run(authority.handle_callback(query, now=now))
        self.assertEqual(check(callback("na:a:forged")), "hold_expired_or_consumed")
        for kwargs in ({"actor": "9"}, {"chat": "9"}, {"message": "9"},
                       {"chat_type": "group"}):
            self.assertEqual(check(callback(buttons["approve"], **kwargs)),
                             "hold_callback_binding_mismatch")
        gate.allowed = False
        self.assertEqual(check(callback(buttons["approve"])), "hold_unauthorized")
        gate.allowed = True
        self.assertEqual(check(callback(buttons["approve"])), "approved")
        self.assertEqual(check(callback(buttons["approve"])), "hold_expired_or_consumed")
        self.assertEqual(authority.verify(self.request, 109).request_sha, self.request.digest())
        with self.assertRaises(RuntimeError):
            authority.verify(self.request, 110)

    def test_expired_callback_never_grants(self):
        authority, _ = self.authority()
        buttons = authority.issue(self.request, actor_id="1", private_chat_id="2", now=100, ttl=1)
        authority.bind_sent_message(buttons["approve"], "3")
        self.assertEqual(asyncio.run(authority.handle_callback(
            callback(buttons["approve"]), now=101)), "hold_expired_or_consumed")
        with self.assertRaises(RuntimeError):
            authority.verify(self.request, 101)

    def test_invalid_entrypoint_never_dispatches_and_result_persists(self):
        bundle = make_bundle(self.request)
        sink = self.sink()
        runtime = NativeWorkRuntime(queue=object(), bridge=object(), transport=object(),
                                    request=self.request, plan=object(), result_sink=sink)
        event = {"schema": 1, "event": "result", "event_id": "r1",
                 "operation_id": self.request.operation_id,
                 "request_sha": self.request.digest()}
        with patch.object(controller_pilot, "step_native_work", return_value=bundle) as step:
            duplicate = json.dumps(event)[:-1] + ',"event":"result"}'
            self.assertEqual(handle_native_event(duplicate, runtime, now=101)["code"], "input_invalid")
            wrong = dict(event, request_sha="f" * 64)
            self.assertEqual(handle_native_event(json.dumps(wrong), runtime, now=101)["code"],
                             "request_mismatch")
            step.assert_not_called()
            response = handle_native_event(json.dumps(event), runtime, now=101)
            step.assert_called_once()
        self.assertEqual(response["state"], "awaiting_independent_qa")
        expected = json.dumps(bundle, sort_keys=True, separators=(",", ":"),
                              ensure_ascii=False, allow_nan=False).encode()
        self.assertEqual(response["result_bundle_sha256"], hashlib.sha256(expected).hexdigest())
        self.assertEqual(self.sink().load(response["result_bundle_ref"], self.request.operation_id,
                                          self.request.digest(), response["result_bundle_sha256"]), expected)
        with self.assertRaises(ResultStoreConflictError):
            self.sink().store(self.request.operation_id, self.request.digest(), b"different")
        with self.assertRaises(ValueError):
            self.sink().store("../wrong", self.request.digest(), b"bytes")

    def test_wiring_routes_only_na_and_stop_holds_without_provider(self):
        work_root = Path(self.area.name)
        (work_root / ".git").mkdir()
        executable = work_root / "codex.exe"
        executable.touch()
        prompt = work_root / "reviewed.md"
        prompt.write_text("fixture", encoding="utf-8")
        plan = CloudTaskPlan(executable, work_root, "a" * 32, "codex/test", prompt,
                             hashlib.sha256(prompt.read_bytes()).hexdigest(),
                             hashlib.sha256(executable.read_bytes()).hexdigest(), "a" * 40)
        plan_sha = plan.request()[2]
        queue = SQLiteQueue(work_root / "fixture-queue.sqlite3")
        NativeReceiptBridge.bootstrap_guard(queue, "test:reviewed", plan_sha, 100)
        bridge = NativeReceiptBridge(queue)
        prior = TaskSpec("prior", "prior-worker", "onia-hermes", "codex/test", "a" * 40,
                         "contract", plan_sha)
        queue.enqueue(prior, 101)
        prior_claim = queue.claim("prior-worker", "prior-owner", 102, 60).claim
        prior_op = "00000000-0000-0000-0000-000000000098"
        bridge.reserve(prior_claim, prior_op, "prior-nonce", "test:reviewed", 103, plan_sha)
        bridge.ingest(NativeObservation(prior_op, "cloud_cli_task", "task_e_" + "a" * 32,
                                        plan_sha, "completed", 104, "test:prior-result", "b" * 64), 104)
        queue.resolve_reconciliation("prior", "applied", "test:prior-qa", 105)
        spec = TaskSpec("stop-task", "worker", "onia-hermes", "codex/test", "a" * 40,
                        "contract", plan_sha)
        queue.enqueue(spec, 106)
        claim = queue.claim("worker", "owner", 107, 60).claim
        request = replace(self.request, task_id="stop-task", worker_id="worker",
                          contract_id="contract", repo="onia-hermes", ref="codex/test",
                          head="a" * 40, input_sha=plan_sha, plan_sha=plan_sha,
                          predecessor_task_id="prior",
                          operation_id="00000000-0000-0000-0000-000000000099")
        transport = NativeCloudCLI(bridge)
        sink_area = tempfile.TemporaryDirectory()
        self.addCleanup(sink_area.cleanup)
        sink = FileResultSink(Path(sink_area.name), _fixture_dir_fsync=lambda path: None)
        calls = []

        class Adapter(Gate):
            _app = None

            async def _handle_callback_query(self, update, context):
                calls.append("legacy")

            async def _handle_command(self, update, context):
                calls.append("legacy-command")

        adapter = Adapter()
        authority = TelegramNativeWorkAuthority(adapter, _capability=_FACTORY_CAPABILITY)
        with patch.object(TelegramNativeWorkAuthority, "_from_trusted_launcher", return_value=authority):
            runtime = NativeTrustedRuntime.bind(
                adapter, queue=queue, bridge=bridge, transport=transport,
                request=request, plan=plan, claim=claim, result_sink=sink,
                now_fn=lambda: 109)
        self.assertIs(runtime.queue, queue)
        self.assertIs(runtime.result_sink, sink)
        runtime.install().install()
        other_adapter = Adapter()
        other_adapter._app = object()  # Existing PTB handler has captured old method.
        late = NativeTrustedRuntime(other_adapter, runtime.native_runtime, authority)
        with self.assertRaisesRegex(RuntimeError, "connect"):
            late.install()
        async def answer(**kwargs):
            calls.append(kwargs.get("text"))
        async def dispatch(data):
            query = callback(data)
            query.answer = answer
            await adapter._handle_callback_query(SimpleNamespace(callback_query=query), object())
        asyncio.run(dispatch("ea:legacy"))
        self.assertEqual(calls, ["legacy"])
        asyncio.run(dispatch("na:a:forged"))
        self.assertEqual(len(calls), 2)
        self.assertIn("expired", calls[-1].lower())
        self.assertIsNone(bridge.read(request.operation_id))
        with queue._connection() as conn:
            conn.execute("UPDATE controller_guard_state SET stopped=1,epoch=epoch+1")
        with self.assertRaisesRegex(RuntimeError, "STOP"):
            runtime.issue_approval(request, actor_id="1", private_chat_id="2", now=109)
        with patch.object(transport, "submit") as submit:
            raw = json.dumps({"schema": 1, "event": "submit", "event_id": "s1",
                              "operation_id": request.operation_id,
                              "request_sha": request.digest()})
            result = runtime.handle_event(raw, now=109)
            self.assertEqual(result["state"], "hold_stop")
            submit.assert_not_called()
        with queue._connection() as conn:
            conn.execute("UPDATE controller_guard_state SET stopped=0,epoch=epoch+1")
        buttons = runtime.issue_approval(request, actor_id="1", private_chat_id="1", now=109)
        runtime.bind_sent_message(buttons["approve"], "3")
        self.assertEqual(asyncio.run(runtime.handle_callback(callback(buttons["approve"], chat="1"), now=109)),
                         "approved")
        with patch.object(transport, "submit", return_value={"state": "submitted",
                                                             "client_attempt_count": 1}) as submit:
            result = runtime.handle_event(raw.replace('"event_id": "s1"', '"event_id": "s2"'), now=109)
            self.assertEqual(result["state"], "submitted", result)
            submit.assert_called_once()
        with self.assertRaises(RuntimeError):
            TelegramNativeWorkAuthority(adapter, _capability=_FACTORY_CAPABILITY).verify(
                request, 109)


if __name__ == "__main__":
    unittest.main()
