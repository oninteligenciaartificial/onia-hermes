"""Offline boundary and temporary queue/sink recovery tests; no provider is used."""
import builtins
from dataclasses import replace
import hashlib
import io
import json
from pathlib import Path
import tempfile
import time
import unittest
from unittest.mock import patch

from native_receipt_bridge import (
    NativeObservation,
    NativeReceiptBridge,
    NativeWorkAuthorization,
    NativeWorkRequest,
)
from native_result_store import FileResultSink
from native_work_entrypoint import (
    MAX_INPUT_BYTES,
    NativeWorkRuntime,
    handle_native_event,
)
from controller_pilot import digest
from sqlite_pilot import SQLiteQueue, TaskSpec


OPERATION_ID = "12345678-1234-1234-1234-123456789abc"
PLAN_SHA = "a" * 64


def make_request(status_cap=2, result_cap=1):
    return NativeWorkRequest(
        task_id="task_e_" + "1" * 32,
        worker_id="worker-test",
        contract_id="contract-test",
        repo="onia-hermes",
        ref="codex/native-event-intake-20261014",
        head="b" * 40,
        input_sha=PLAN_SHA,
        operation_id=OPERATION_ID,
        nonce="nonce-test",
        plan_sha=PLAN_SHA,
        approval_claim_ref="claim-test",
        predecessor_task_id="task_e_" + "2" * 32,
        result_paths=("result.json",),
        max_status_events=status_cap,
        max_result_events=result_cap,
    )


def payload(event="status", request=None, **changes):
    request = request or make_request()
    value = {
        "schema": 1,
        "event": event,
        "event_id": "event-001",
        "operation_id": request.operation_id,
        "request_sha": request.digest(),
    }
    value.update(changes)
    return json.dumps(value, separators=(",", ":")).encode("utf-8")


def runtime(request=None, **changes):
    values = {
        "queue": object(),
        "bridge": object(),
        "transport": object(),
        "request": request or make_request(),
        "plan": object(),
    }
    values.update(changes)
    return NativeWorkRuntime(**values)


def result_output(request=None, **changes):
    request = request or make_request()
    value = {
        "state": "awaiting_independent_qa",
        "operation_id": request.operation_id,
        "remote_id": "task_e_" + "3" * 32,
        "input_sha": request.input_sha,
        "files": {
            request.result_paths[0]: {
                "sha256": "d" * 64,
                "bytes": 14,
                "json": {"outcome": "candidate", "value": 7},
            },
        },
        "provider_read_attempt_count": 1,
        "cost": "UNKNOWN",
    }
    value.update(changes)
    return value


class TempFileResultSink:
    """Fixture sink that persists bytes to a real temporary file."""

    def __init__(self, path):
        self.path = Path(path)
        self.calls = 0

    def store(self, operation_id, request_sha, bundle_bytes):
        self.calls += 1
        self.operation_id = operation_id
        self.request_sha = request_sha
        self.path.write_bytes(bundle_bytes)
        return {
            "ref": "bundle-fixture-001",
            "sha256": hashlib.sha256(bundle_bytes).hexdigest(),
            "bytes_written": len(bundle_bytes),
        }


class ResultReceiptBridge:
    def __init__(self):
        self.receipt = None

    def record_result_bundle_receipt(self, request, event_id, receipt, now):
        self.receipt = (request.digest(), event_id, dict(receipt), now)
        return dict(receipt)

    def read_result_bundle_receipt(self, request):
        if self.receipt is None or self.receipt[0] != request.digest():
            return None
        return dict(self.receipt[2])


class NativeWorkEntrypointTests(unittest.TestCase):
    def invoke_once(self, raw=None, runtime_value=None, now=123, output=None):
        import controller_pilot

        step = unittest.mock.Mock(return_value=output or {"state": "running"})
        with patch.object(controller_pilot, "step_native_work", step):
            result = handle_native_event(raw or payload(), runtime_value or runtime(), now)
        return result, step

    def test_bad_json_and_oversize_hold(self):
        self.assertEqual(handle_native_event(b"{"), {"state": "hold", "code": "input_invalid"})
        self.assertEqual(handle_native_event(payload()[:-1] + b",\"unused\":NaN}" )["code"],
                         "input_invalid")
        self.assertEqual(handle_native_event(b" " * (MAX_INPUT_BYTES + 1)),
                         {"state": "hold", "code": "input_invalid"})

    def test_duplicate_keys_rejected(self):
        raw = (b'{"schema":1,"schema":1,"event":"status","event_id":"x",'
               b'"operation_id":"' + OPERATION_ID.encode() + b'","request_sha":"' +
               b"a" * 64 + b'"}')
        self.assertEqual(handle_native_event(raw)["code"], "input_invalid")

    def test_extra_fields_and_injected_authority_rejected(self):
        req = make_request()
        self.assertEqual(handle_native_event(payload(request=req, extra="x"))["code"], "input_invalid")
        raw = payload(request=req, authority={"verified": True})
        self.assertEqual(handle_native_event(raw)["code"], "input_invalid")

    def test_path_values_rejected_at_boundary(self):
        self.assertEqual(handle_native_event(payload(event_id="../secret"))["code"], "input_invalid")
        self.assertEqual(handle_native_event(payload(operation_id="C:\\secret"))["code"], "input_invalid")

    def test_runtime_none_holds_without_importing_dispatch_modules(self):
        raw = payload()
        original_import = builtins.__import__

        def guarded_import(name, *args, **kwargs):
            if name in {"controller_pilot", "native_cloud_cli"}:
                raise AssertionError("dispatch module imported without trusted runtime")
            return original_import(name, *args, **kwargs)

        with patch("builtins.__import__", guarded_import):
            result = handle_native_event(raw, runtime=None)
        self.assertEqual(result["code"], "runtime_unbound")

    def test_cli_stdin_only_validates_then_holds(self):
        import native_work_entrypoint
        stdin = type("Input", (), {"buffer": io.BytesIO(payload())})()
        stdout = io.StringIO()
        with patch.object(native_work_entrypoint.sys, "stdin", stdin), \
                patch.object(native_work_entrypoint.sys, "stdout", stdout):
            self.assertEqual(native_work_entrypoint.main(), 0)
        self.assertEqual(json.loads(stdout.getvalue())["code"], "runtime_unbound")

    def test_unknown_runtime_holds(self):
        result = handle_native_event(payload(), runtime={"request": make_request()}, now=123)
        self.assertEqual(result["code"], "runtime_invalid")

    def test_operation_or_digest_mismatch_never_dispatches(self):
        req = make_request()
        raw = payload(request=req, request_sha="c" * 64)
        result, step = self.invoke_once(raw=raw, runtime_value=runtime(req))
        self.assertEqual(result["code"], "request_mismatch")
        step.assert_not_called()

    def test_submit_without_claim_and_external_authority_never_delegates(self):
        req = make_request()
        result, step = self.invoke_once(raw=payload("submit", req), runtime_value=runtime(req))
        self.assertEqual(result["code"], "claim_and_authority_required")
        step.assert_not_called()

    def test_compatibility_caps_two_status_one_result_dispatch_once(self):
        req = make_request(status_cap=2, result_cap=1)
        result, step = self.invoke_once(raw=payload(request=req), runtime_value=runtime(req))
        self.assertEqual(result["state"], "running")
        step.assert_called_once()
        self.assertEqual(step.call_args.args[3], "status")
        self.assertEqual(step.call_args.kwargs["event_id"], "event-001")

    def test_status_provider_ready_is_preserved_without_implying_qa(self):
        req = make_request()
        result, step = self.invoke_once(
            raw=payload(request=req), runtime_value=runtime(req),
            output={"state": "needs_reconcile", "operation_id": req.operation_id,
                    "provider_status": "READY", "retry": "forbidden"},
        )
        self.assertEqual(result["provider_status"], "ready")
        self.assertEqual(result["state"], "needs_reconcile")
        self.assertEqual(result["retry"], "forbidden")
        self.assertNotIn("goal_outcome", result)
        step.assert_called_once()

    def test_result_bundle_is_written_once_and_response_only_has_digest_and_ref(self):
        req = make_request()
        bundle = result_output(req)
        with tempfile.TemporaryDirectory() as temp_dir:
            sink = TempFileResultSink(Path(temp_dir) / "bundle.bin")
            bridge = ResultReceiptBridge()
            result, step = self.invoke_once(
                raw=payload("result", req),
                runtime_value=runtime(req, result_sink=sink, bridge=bridge),
                output=bundle,
            )
            expected = json.dumps(bundle, sort_keys=True, separators=(",", ":"),
                                  ensure_ascii=False, allow_nan=False).encode("utf-8")
            self.assertEqual(sink.path.read_bytes(), expected)
            self.assertEqual(result["result_bundle_sha256"], hashlib.sha256(expected).hexdigest())
            self.assertEqual(result["result_bundle_ref"], "bundle-fixture-001")
            self.assertEqual(sink.calls, 1)
            self.assertEqual(sink.operation_id, req.operation_id)
            self.assertEqual(sink.request_sha, req.digest())
            self.assertEqual(bridge.receipt[0], req.digest())
            self.assertEqual(bridge.receipt[1], "event-001")
            self.assertNotIn("files", result)
            step.assert_called_once()

    def test_missing_result_sink_holds_before_step_or_provider_read(self):
        req = make_request()
        result, step = self.invoke_once(raw=payload("result", req), runtime_value=runtime(req))
        self.assertEqual(result["code"], "result_sink_required")
        step.assert_not_called()

    def test_sink_failure_is_ambiguous_and_never_retried(self):
        req = make_request()

        class FailingSink:
            def __init__(self):
                self.calls = 0

            def store(self, *_args):
                self.calls += 1
                raise OSError("private sink path")

        sink = FailingSink()
        result, step = self.invoke_once(raw=payload("result", req),
                                        runtime_value=runtime(req, result_sink=sink),
                                        output=result_output(req))
        self.assertEqual(result, {"state": "needs_reconcile", "code": "sink_outcome_unknown",
                                  "retry": "forbidden", "operation_id": req.operation_id})
        self.assertEqual(sink.calls, 1)
        step.assert_called_once()

    def test_result_binding_mismatch_is_not_stored_or_rebound(self):
        req = make_request()
        with tempfile.TemporaryDirectory() as temp_dir:
            sink = TempFileResultSink(Path(temp_dir) / "bundle.bin")
            result, step = self.invoke_once(
                raw=payload("result", req), runtime_value=runtime(req, result_sink=sink),
                output=result_output(req, operation_id="87654321-4321-4321-4321-cba987654321"),
            )
            self.assertEqual(result["code"], "unsafe_step_output")
            self.assertEqual(result["state"], "needs_reconcile")
            self.assertEqual(result["retry"], "forbidden")
            self.assertEqual(sink.calls, 0)
            step.assert_called_once()

    def test_step_output_allowlist_drops_raw_text_and_secrets(self):
        req = make_request()
        raw_output = {
            "state": "running",
            "operation_id": req.operation_id,
            "remote_id": "task_e_" + "3" * 32,
            "provider_read_attempt_count": 1,
            "message": "arbitrary text",
            "stdout": "provider output",
            "stderr": "provider error",
            "auth": "secret",
            "path": "C:\\private\\file",
            "token_payload": "secret-token",
            "independent_qa_ref": "private/path",
        }
        result, step = self.invoke_once(raw=payload(request=req), runtime_value=runtime(req),
                                        output=raw_output)
        self.assertEqual(result["state"], "running")
        self.assertEqual(result["remote_id"], "task_e_" + "3" * 32)
        self.assertEqual(result["provider_read_attempt_count"], 1)
        for forbidden in ("message", "stdout", "stderr", "auth", "path", "token_payload",
                          "independent_qa_ref"):
            self.assertNotIn(forbidden, result)
        step.assert_called_once()

    def test_exception_after_possible_effect_requires_reconciliation_without_retry(self):
        import controller_pilot
        req = make_request()
        effect_marker = []

        def fail(*_args, **_kwargs):
            effect_marker.append("may-have-dispatched")
            raise RuntimeError("private path C:\\vault\\token=secret")

        with patch.object(controller_pilot, "step_native_work", fail):
            result = handle_native_event(payload(request=req), runtime(req), 123)
        self.assertEqual(result, {"state": "needs_reconcile", "code": "dispatch_outcome_unknown",
                                  "retry": "forbidden",
                                  "operation_id": req.operation_id})
        self.assertEqual(effect_marker, ["may-have-dispatched"])

    def test_missing_or_invalid_step_state_is_ambiguous(self):
        req = make_request()
        for output in ({"operation_id": req.operation_id},
                       {"state": "running", "operation_id": "87654321-4321-4321-4321-cba987654321"}):
            result, step = self.invoke_once(raw=payload(request=req), runtime_value=runtime(req),
                                            output=output)
            self.assertEqual(result["state"], "needs_reconcile")
            self.assertEqual(result["retry"], "forbidden")
            step.assert_called_once()


class NativeResultRecoveryTests(unittest.TestCase):
    """Real local queue/sink checkpoint recovery; provider and browser are fakes."""

    def setUp(self):
        self.area = tempfile.TemporaryDirectory()
        self.addCleanup(self.area.cleanup)
        self.root = Path(self.area.name)
        self.db_path = self.root / "queue.sqlite3"
        self.sink_path = self.root / "results"
        self.now = int(time.time())
        self.request = make_request()
        self.sink_path.mkdir(mode=0o700)
        self.plan = type("Plan", (), {
            "request": lambda _self: (None, None, PLAN_SHA),
            "branch": self.request.ref,
            "expected_remote_head": self.request.head,
            "executable": self.root / "codex.exe",
        })()
        self.bundle = result_output(self.request, files={
            self.request.result_paths[0]: {
                "sha256": "d" * 64,
                "bytes": 14,
                "json": {
                    "operation_id": self.request.operation_id,
                    "input_sha": self.request.input_sha,
                    "repository": {"expected_head": self.request.head,
                                   "observed_head": self.request.head},
                    "result": "candidate",
                },
            },
        })
        self.queue, self.bridge = self._build_bridge()
        self.sink = FileResultSink(self.sink_path, _fixture_dir_fsync=lambda _path: None)
        self.transport = self.FakeTransport(self.bridge, self.bundle)
        self.runtime = NativeWorkRuntime(
            queue=self.queue, bridge=self.bridge, transport=self.transport,
            request=self.request, plan=self.plan, result_sink=self.sink,
        )

    class FakeTransport:
        def __init__(self, bridge, bundle):
            self.bridge = bridge
            self.bundle = bundle
            self.collect_calls = 0
            self.status_calls = 0

        def collect_result(self, operation_id, executable, paths):
            self.collect_calls += 1
            return self.bundle

        def status(self, *_args):
            self.status_calls += 1
            return {"state": "running"}

    class SyntheticAuthority:
        def __init__(self, expires_at):
            self.expires_at = expires_at

        def verify(self, request, _now):
            return NativeWorkAuthorization(
                True, request.digest(), request.nonce, "fixture-actor",
                "test:synthetic-offline-authority", "test:result-recovery", self.expires_at,
            )

    def _build_bridge(self):
        queue = SQLiteQueue(self.db_path)
        NativeReceiptBridge.bootstrap_guard(queue, "test:result-recovery", PLAN_SHA, self.now)
        bridge = NativeReceiptBridge(queue)

        predecessor = TaskSpec(
            self.request.predecessor_task_id, "prior-worker", self.request.repo,
            self.request.ref, self.request.head, self.request.contract_id,
            self.request.input_sha,
        )
        queue.enqueue(predecessor, self.now + 1)
        prior_claim = queue.claim("prior-worker", "prior-owner", self.now + 2, 60).claim
        prior_operation = "87654321-4321-4321-4321-cba987654321"
        bridge.reserve(prior_claim, prior_operation, "prior-nonce", "test:result-recovery",
                       self.now + 3, PLAN_SHA)
        bridge.begin_dispatch(prior_operation, PLAN_SHA)
        bridge.ingest(NativeObservation(
            prior_operation, "cloud_cli_task", "task_e_" + "2" * 32,
            self.request.input_sha, "completed", self.now + 4,
            "fixture:prior", "e" * 64,
        ), self.now + 4)
        queue.resolve_reconciliation(self.request.predecessor_task_id, "applied",
                                     "fixture:prior-qa", self.now + 5)

        current = TaskSpec(
            self.request.task_id, self.request.worker_id, self.request.repo,
            self.request.ref, self.request.head, self.request.contract_id,
            self.request.input_sha,
        )
        queue.enqueue(current, self.now + 6)
        claim = queue.claim(self.request.worker_id, "current-owner", self.now + 7, 60).claim
        bridge.authorize_and_reserve_work(
            claim, self.request, self.SyntheticAuthority(self.now + 3600), self.now + 8,
        )
        bridge.begin_dispatch(self.request.operation_id, PLAN_SHA)
        bridge.ingest(NativeObservation(
            self.request.operation_id, "cloud_cli_task", "task_e_" + "3" * 32,
            self.request.input_sha, "submitted", self.now + 9,
            "fixture:submit",
        ), self.now + 9)
        return queue, bridge

    def _event(self, kind, event_id, runtime=None, now=None):
        raw = payload(kind, self.request, event_id=event_id)
        return handle_native_event(raw, runtime or self.runtime,
                                   self.now + 20 if now is None else now)

    def _reopened_runtime(self, verifier=None, *, request=None):
        queue = SQLiteQueue(self.db_path)
        bridge = NativeReceiptBridge(queue)
        sink = FileResultSink(self.sink_path, _fixture_dir_fsync=lambda _path: None)
        transport = self.FakeTransport(bridge, self.bundle)
        runtime = NativeWorkRuntime(
            queue=queue, bridge=bridge, transport=transport,
            request=request or self.request, plan=self.plan,
            result_bundle=None, qa_verifier=verifier, result_sink=sink,
        )
        return runtime

    def _persist_result(self):
        result = self._event("result", "result-event-1")
        self.assertEqual(result["state"], "awaiting_independent_qa")
        self.assertEqual(self.transport.collect_calls, 1)
        receipt = self.bridge.read_result_bundle_receipt(self.request)
        self.assertEqual(receipt["sha256"], result["result_bundle_sha256"])
        return result

    def test_result_receipt_survives_reopen_and_qa_uses_exact_persisted_bytes_once(self):
        result = self._persist_result()
        before = self.bridge.read_result_bundle_receipt(self.request)

        class OfflineVerifier:
            def __init__(self):
                self.calls = []

            def verify(self, request, bundle, now):
                self.calls.append((request.digest(), bundle, now))
                return {"verified": False}

        verifier = OfflineVerifier()
        reopened = self._reopened_runtime(verifier)
        self.assertIsNone(reopened.result_bundle)
        first = self._event("qa", "qa-event-1", reopened)
        second = self._event("qa", "qa-event-1", reopened)
        self.assertEqual(first["state"], "awaiting_independent_qa")
        self.assertEqual(second["reason"], "event_already_consumed_no_reexecution")
        self.assertEqual(len(verifier.calls), 1)
        self.assertEqual(verifier.calls[0][0], self.request.digest())
        persisted_bytes = self.sink.load(
            before["ref"], self.request.operation_id, self.request.digest(), before["sha256"])
        self.assertEqual(verifier.calls[0][1], json.loads(persisted_bytes.decode("utf-8")))
        self.assertEqual(reopened.transport.collect_calls, 0)
        self.assertEqual(reopened.transport.status_calls, 0)
        self.assertEqual(self.bridge.read_result_bundle_receipt(self.request), before)
        self.assertNotIn("goal_outcome", first)
        self.assertEqual(result["result_bundle_ref"], before["ref"])

    def test_valid_recovered_bundle_closes_once_with_bound_review_after_restart(self):
        result = self._persist_result()
        receipt = self.bridge.read_result_bundle_receipt(self.request)

        class BoundOfflineVerifier:
            def __init__(self):
                self.calls = []

            def verify(self, request, bundle, now):
                self.calls.append((request.digest(), bundle, now))
                return {
                    "verified": True,
                    "request_sha": request.digest(),
                    "bundle_sha": digest(bundle),
                    "remote_id": bundle["remote_id"],
                    "reviewer_id": "independent-reviewer",
                    "goal_outcome": "completed",
                    "authority_source": "fixture:offline-independent-review",
                    "evidence_ref": "fixture:qa-review-1",
                }

        verifier = BoundOfflineVerifier()
        reopened = self._reopened_runtime(verifier)
        self.assertIsNone(reopened.result_bundle)
        first = self._event("qa", "qa-event-valid", reopened)
        duplicate = self._event("qa", "qa-event-valid", reopened)

        persisted_bytes = self.sink.load(
            receipt["ref"], self.request.operation_id, self.request.digest(), receipt["sha256"])
        recovered = json.loads(persisted_bytes.decode("utf-8"))
        expected_result_sha = digest({
            path: item["sha256"] for path, item in recovered["files"].items()
        })
        self.assertEqual(result["result_bundle_sha256"], receipt["sha256"])
        self.assertEqual(first["state"], "closure_resolved")
        self.assertEqual(first["goal_outcome"], "completed")
        self.assertEqual(first["result_digest"], self.queue.read_result(self.request.task_id)["digest"])
        self.assertEqual(duplicate["reason"], "event_already_consumed_no_reexecution")
        self.assertEqual(len(verifier.calls), 1)
        self.assertEqual(verifier.calls[0][1], recovered)
        native = self.bridge.read(self.request.operation_id)
        self.assertEqual(native["state"], "completed")
        self.assertEqual(native["observation"]["result_sha"], expected_result_sha)
        with self.queue._connection() as conn:
            task = conn.execute("SELECT status FROM tasks WHERE task_id=?",
                                (self.request.task_id,)).fetchone()
            closure = conn.execute("SELECT evidence_json FROM task_results WHERE task_id=?",
                                   (self.request.task_id,)).fetchone()
        self.assertEqual(task["status"], "done")
        closure_evidence = json.loads(closure["evidence_json"])
        closure_note = closure_evidence["evidence_ref"]
        self.assertIn("independent_qa=fixture:qa-review-1", closure_note)
        self.assertIn("bundle_sha=" + digest(recovered), closure_note)
        self.assertEqual(reopened.transport.collect_calls, 0)
        self.assertEqual(reopened.transport.status_calls, 0)

    def test_missing_receipt_or_verifier_holds_before_consuming_qa(self):
        self._persist_result()
        with self.queue._connection() as conn:
            row = conn.execute("SELECT work_events_json FROM native_operations WHERE operation_id=?",
                               (self.request.operation_id,)).fetchone()
            events = json.loads(row["work_events_json"])
            entry = next(value for value in events.values() if value["event"] == "result")
            entry.pop("result_bundle_receipt")
            entry["state"] = "consumed_outcome_requires_event_receipt"
            conn.execute("UPDATE native_operations SET work_events_json=? WHERE operation_id=?",
                         (json.dumps(events, sort_keys=True, separators=(",", ":")),
                          self.request.operation_id))
        class NoOpVerifier:
            def verify(self, *_args):
                raise AssertionError("missing receipt must hold before QA verifier")

        reopened = self._reopened_runtime(verifier=NoOpVerifier())
        result = self._event("qa", "qa-event-missing", reopened)
        self.assertEqual(result["code"], "result_bundle_recovery_failed")
        with self.queue._connection() as conn:
            events = json.loads(conn.execute(
                "SELECT work_events_json FROM native_operations WHERE operation_id=?",
                (self.request.operation_id,)).fetchone()[0])
        self.assertEqual(sum(item["event"] == "qa" for item in events.values()), 0)

        no_verifier = self._reopened_runtime()
        result = self._event("qa", "qa-event-no-verifier", no_verifier)
        self.assertEqual(result["code"], "qa_verifier_required")

    def test_corrupt_sink_and_changed_request_hold_before_verifier(self):
        self._persist_result()
        result_file = next(self.sink_path.glob("bundle-*.json"))
        result_file.write_bytes(b"corrupt")

        class OfflineVerifier:
            def __init__(self):
                self.calls = 0

            def verify(self, *_args):
                self.calls += 1
                return {"verified": False}

        verifier = OfflineVerifier()
        reopened = self._reopened_runtime(verifier)
        result = self._event("qa", "qa-event-corrupt", reopened)
        self.assertEqual(result["code"], "result_bundle_recovery_failed")
        self.assertEqual(verifier.calls, 0)

        altered_request = replace(self.request, nonce="different-nonce")
        altered = self._reopened_runtime(verifier, request=altered_request)
        result = self._event("qa", "qa-event-altered", altered)
        self.assertEqual(result["code"], "request_mismatch")
        self.assertEqual(verifier.calls, 0)
        with self.queue._connection() as conn:
            events = json.loads(conn.execute(
                "SELECT work_events_json FROM native_operations WHERE operation_id=?",
                (self.request.operation_id,)).fetchone()[0])
        self.assertEqual(sum(item["event"] == "qa" for item in events.values()), 0)

    def test_sink_store_without_checkpoint_never_recollects_or_recovers_by_filename(self):
        original = self.bridge.record_result_bundle_receipt
        self.bridge.record_result_bundle_receipt = lambda *_args: (_ for _ in ()).throw(
            RuntimeError("fixture checkpoint interruption"))
        result = self._event("result", "result-event-gap")
        self.bridge.record_result_bundle_receipt = original
        self.assertEqual(result["code"], "result_receipt_outcome_unknown")
        self.assertEqual(self.transport.collect_calls, 1)
        self.assertEqual(self.bridge.read_result_bundle_receipt(self.request), None)

        class OfflineVerifier:
            def __init__(self):
                self.calls = 0

            def verify(self, *_args):
                self.calls += 1
                return {"verified": False}

        verifier = OfflineVerifier()
        reopened = self._reopened_runtime(verifier)
        qa = self._event("qa", "qa-event-gap", reopened)
        self.assertEqual(qa["code"], "result_bundle_recovery_failed")
        self.assertEqual(verifier.calls, 0)
        retry = self._event("result", "result-event-gap", reopened)
        self.assertEqual(retry["reason"], "event_already_consumed_no_reexecution")
        self.assertEqual(reopened.transport.collect_calls, 0)

    def test_receipt_conflict_is_immutable(self):
        self._persist_result()
        receipt = self.bridge.read_result_bundle_receipt(self.request)
        altered = dict(receipt, sha256="f" * 64)
        with self.assertRaisesRegex(RuntimeError, "receipt conflict"):
            self.bridge.record_result_bundle_receipt(
                self.request, "result-event-1", altered, self.now + 30)
        self.assertEqual(self.bridge.read_result_bundle_receipt(self.request), receipt)


if __name__ == "__main__":
    unittest.main()
