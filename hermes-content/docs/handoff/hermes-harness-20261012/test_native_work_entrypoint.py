"""Offline boundary tests for native_work_entrypoint; no DB/provider is used."""
import builtins
import hashlib
import io
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

from native_receipt_bridge import NativeWorkRequest
from native_work_entrypoint import (
    MAX_INPUT_BYTES,
    NativeWorkRuntime,
    handle_native_event,
)


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
            result, step = self.invoke_once(
                raw=payload("result", req),
                runtime_value=runtime(req, result_sink=sink),
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


if __name__ == "__main__":
    unittest.main()
