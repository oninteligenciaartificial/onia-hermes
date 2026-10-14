"""Bounded JSON event adapter for the existing finite native-work harness.

This module does not create work, authority, a queue, a transport, or QA.  The
only objects used for those purposes arrive through the trusted runtime binding.
"""
from dataclasses import dataclass
import hashlib
import json
import math
import re
import sys


MAX_INPUT_BYTES = 16 * 1024
MAX_RESULT_BUNDLE_BYTES = 1024 * 1024
_EVENTS = frozenset(("submit", "status", "result", "qa"))
_OPERATION_ID = re.compile(r"[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}\Z")
_SHA256 = re.compile(r"[0-9a-f]{64}\Z")
_EVENT_ID = re.compile(r"[A-Za-z0-9][A-Za-z0-9._:-]{0,127}\Z")
_SINK_REF = re.compile(r"[A-Za-z0-9][A-Za-z0-9._:-]{0,127}\Z")
_FIELDS = frozenset(("schema", "event", "event_id", "operation_id", "request_sha"))

_REASONS = frozenset((
    "existing_task_and_guard_required",
    "operation_already_exists_no_replay",
    "lease_and_external_authority_required",
    "original_bound_operation_required",
    "unique_event_id_required",
    "event_already_consumed_no_reexecution",
    "external_qa_and_recovered_bundle_required",
    "QA_identity_or_result_binding_unverified",
))
_STATES = frozenset((
    "hold", "hold_stop", "needs_reconcile", "submitted", "running", "unknown",
    "completed", "failed", "cancelled", "awaiting_independent_qa",
    "terminal_awaiting_resolution", "closure_resolved",
))
_NATIVE_STATES = frozenset(("submitted", "running", "unknown", "completed", "failed", "cancelled"))
_OUT_FIELDS = frozenset((
    "state", "reason", "operation_id", "remote_id", "native_state", "goal_outcome",
    "client_attempt_count", "provider_read_attempt_count", "read_started_at_epoch",
    "read_finished_at_epoch", "read_duration_seconds", "cost", "tokens",
    "remote_execution_duration_seconds", "active_context_used", "effective_window",
    "handoff_capability", "result_digest", "next_candidate_task_id", "next_action",
    "global_goal_not_closed", "provider_status", "retry",
))


@dataclass(frozen=True)
class NativeWorkRuntime:
    """Trusted in-process bindings supplied by the authorized connector.

    A result sink must durably write the exact bytes before acknowledging them.
    This adapter checks its receipt but cannot prove sink durability; no real
    connector sink is implemented by the harness.
    """

    queue: object
    bridge: object
    transport: object
    request: object
    plan: object
    claim: object = None
    authority: object = None
    result_bundle: object = None
    qa_verifier: object = None
    result_sink: object = None


def _pairs_no_duplicates(pairs):
    value = {}
    for key, item in pairs:
        if key in value:
            raise ValueError("duplicate key")
        value[key] = item
    return value


def _reject_constant(_constant):
    raise ValueError("non-finite JSON number")


def _nonnegative_number(value):
    return ((type(value) is int and value >= 0)
            or (type(value) is float and math.isfinite(value) and value >= 0))


def _parse_input(raw_input):
    if isinstance(raw_input, bytes):
        raw = raw_input
    elif isinstance(raw_input, str):
        try:
            raw = raw_input.encode("utf-8", errors="strict")
        except UnicodeError:
            return None
    else:
        return None
    if len(raw) > MAX_INPUT_BYTES:
        return None
    try:
        text = raw.decode("utf-8", errors="strict")
        value = json.loads(text, object_pairs_hook=_pairs_no_duplicates,
                           parse_constant=_reject_constant)
    except (UnicodeError, ValueError, TypeError, RecursionError):
        return None
    if type(value) is not dict or set(value) != _FIELDS:
        return None
    if type(value["schema"]) is not int or value["schema"] != 1:
        return None
    if type(value["event"]) is not str or value["event"] not in _EVENTS:
        return None
    if (type(value["event_id"]) is not str or not _EVENT_ID.fullmatch(value["event_id"])
            or ".." in value["event_id"]):
        return None
    if type(value["operation_id"]) is not str or not _OPERATION_ID.fullmatch(value["operation_id"]):
        return None
    if type(value["request_sha"]) is not str or not _SHA256.fullmatch(value["request_sha"]):
        return None
    return value


def _safe_output(step_result, operation_id):
    if type(step_result) is not dict:
        return _ambiguous_output(operation_id, "unsafe_step_output")
    if step_result.get("operation_id") not in (None, operation_id):
        return _ambiguous_output(operation_id, "unsafe_step_output")
    if type(step_result.get("state")) is not str or step_result["state"] not in _STATES:
        return _ambiguous_output(operation_id, "unsafe_step_output")
    result = {"state": step_result["state"], "code": "ok", "operation_id": operation_id}
    for key in _OUT_FIELDS:
        if key not in step_result:
            continue
        value = step_result[key]
        if key == "operation_id":
            continue
        if key == "state" and type(value) is str and value in _STATES:
            result[key] = value
        elif key == "reason" and type(value) is str and value in _REASONS:
            result[key] = value
        elif key == "remote_id" and (value == "UNKNOWN" or
                                     (type(value) is str and re.fullmatch(r"task_e_[0-9a-f]{32}", value))):
            result[key] = value
        elif key == "native_state" and type(value) is str and value in _NATIVE_STATES:
            result[key] = value
        elif key == "provider_status" and type(value) is str and value.lower() in (
                "pending", "running", "ready", "failed", "cancelled", "unknown"):
            result[key] = value.lower()
        elif key == "goal_outcome" and type(value) is str and value in ("completed", "failed"):
            result[key] = value
        elif key in ("client_attempt_count", "provider_read_attempt_count",
                     "read_started_at_epoch", "read_finished_at_epoch") and type(value) is int and value >= 0:
            result[key] = value
        elif key == "read_duration_seconds" and _nonnegative_number(value):
            result[key] = value
        elif key in ("cost", "tokens", "remote_execution_duration_seconds", "active_context_used",
                     "effective_window", "handoff_capability") and (
                value == "UNKNOWN" or _nonnegative_number(value)):
            result[key] = value
        elif key == "result_digest" and type(value) is str and _SHA256.fullmatch(value):
            result[key] = value
        elif key == "next_candidate_task_id" and (
                value is None or (type(value) is str and re.fullmatch(r"task_e_[0-9a-f]{32}", value))):
            result[key] = value
        elif key == "next_action" and type(value) is str and value in (
                "hold_stop", "require_external_authority_for_next_candidate"):
            result[key] = value
        elif key == "global_goal_not_closed" and type(value) is bool:
            result[key] = value
        elif key == "retry" and value == "forbidden":
            result[key] = "forbidden"
    return result


def _ambiguous_output(operation_id, code):
    return {"state": "needs_reconcile", "code": code, "retry": "forbidden",
            "operation_id": operation_id}


def _valid_result_bundle(bundle, request, operation_id):
    if (type(bundle) is not dict or bundle.get("state") != "awaiting_independent_qa"
            or bundle.get("operation_id") != operation_id or bundle.get("input_sha") != request.input_sha
            or type(bundle.get("files")) is not dict
            or set(bundle["files"]) != set(request.result_paths)):
        return False
    for item in bundle["files"].values():
        if (type(item) is not dict or type(item.get("sha256")) is not str
                or not _SHA256.fullmatch(item["sha256"])
                or type(item.get("bytes")) is not int or item["bytes"] < 0
                or type(item.get("json")) is not dict):
            return False
    return True


def _persist_result_bundle(sink, bundle_bytes, operation_id, request_sha):
    """Call one trusted sink; its contract is durable write before acknowledgement."""
    digest = hashlib.sha256(bundle_bytes).hexdigest()
    receipt = sink.store(operation_id, request_sha, bundle_bytes)
    if type(receipt) is not dict:
        raise ValueError("invalid result sink receipt")
    ref = receipt.get("ref")
    if (type(ref) is not str or not _SINK_REF.fullmatch(ref) or ".." in ref
            or receipt.get("sha256") != digest
            or type(receipt.get("bytes_written")) is not int
            or receipt["bytes_written"] != len(bundle_bytes)):
        raise ValueError("unverified result sink acknowledgement")
    return digest, ref


def handle_native_event(raw_input, runtime=None, now=None):
    """Validate and dispatch exactly one event through the existing harness."""
    event = _parse_input(raw_input)
    if event is None:
        return {"state": "hold", "code": "input_invalid"}
    if runtime is None:
        return {"state": "hold", "code": "runtime_unbound",
                "operation_id": event["operation_id"]}
    if type(runtime) is not NativeWorkRuntime:
        return {"state": "hold", "code": "runtime_invalid",
                "operation_id": event["operation_id"]}
    if type(now) is not int or now < 0:
        return {"state": "hold", "code": "runtime_invalid",
                "operation_id": event["operation_id"]}

    # Import harness types only after raw input and the trusted runtime bind pass.
    try:
        from native_receipt_bridge import NativeWorkRequest
        if type(runtime.request) is not NativeWorkRequest:
            return {"state": "hold", "code": "runtime_invalid",
                    "operation_id": event["operation_id"]}
        request = runtime.request
        if (request.operation_id != event["operation_id"] or request.digest() != event["request_sha"]
                or type(request.max_status_events) is not int or not 0 <= request.max_status_events <= 2
                or type(request.max_result_events) is not int or not 0 <= request.max_result_events <= 1):
            return {"state": "hold", "code": "request_mismatch",
                    "operation_id": event["operation_id"]}
    except Exception:
        return {"state": "hold", "code": "runtime_invalid",
                "operation_id": event["operation_id"]}

    if event["event"] == "submit" and (runtime.claim is None or runtime.authority is None):
        return {"state": "hold", "code": "claim_and_authority_required",
                "operation_id": event["operation_id"]}
    try:
        from controller_pilot import step_native_work
    except Exception:
        return {"state": "hold", "code": "dispatch_unavailable",
                "operation_id": event["operation_id"]}

    if event["event"] == "result" and (
            runtime.result_sink is None or not callable(getattr(runtime.result_sink, "store", None))):
        return {"state": "hold", "code": "result_sink_required",
                "operation_id": event["operation_id"]}
    try:
        output = step_native_work(
            runtime.queue, runtime.bridge, runtime.transport, event["event"], request,
            runtime.plan, now, claim=runtime.claim, authority=runtime.authority,
            result_bundle=runtime.result_bundle, qa_verifier=runtime.qa_verifier,
            event_id=event["event_id"],
        )
    except Exception:
        return _ambiguous_output(event["operation_id"], "dispatch_outcome_unknown")

    sanitized = _safe_output(output, event["operation_id"])
    if sanitized["state"] == "needs_reconcile" and sanitized["code"] != "ok":
        return sanitized
    if event["event"] != "result" or sanitized["state"] != "awaiting_independent_qa":
        return sanitized
    if not _valid_result_bundle(output, request, event["operation_id"]):
        return _ambiguous_output(event["operation_id"], "result_bundle_binding_invalid")
    try:
        bundle_bytes = json.dumps(output, sort_keys=True, separators=(",", ":"),
                                  ensure_ascii=False, allow_nan=False).encode("utf-8")
        if len(bundle_bytes) > MAX_RESULT_BUNDLE_BYTES:
            return _ambiguous_output(event["operation_id"], "result_bundle_too_large")
        digest, ref = _persist_result_bundle(
            runtime.result_sink, bundle_bytes, event["operation_id"], request.digest())
    except Exception:
        return _ambiguous_output(event["operation_id"], "sink_outcome_unknown")
    sanitized["result_bundle_sha256"] = digest
    sanitized["result_bundle_ref"] = ref
    return sanitized


def main():
    """CLI intake validates stdin and holds because no trusted runtime is bound."""
    raw = sys.stdin.buffer.read(MAX_INPUT_BYTES + 1)
    response = handle_native_event(raw)
    sys.stdout.write(json.dumps(response, sort_keys=True, separators=(",", ":")) + "\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
