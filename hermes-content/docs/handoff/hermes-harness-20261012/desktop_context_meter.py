#!/usr/bin/env python3
"""Read one explicitly selected Codex JSONL file and emit token-count metadata only.

This is a local diagnostic, not a Cloud telemetry API or an active-context meter.
It never reads message text into the output and never writes the source transcript.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import stat
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any

SCHEMA_VERSION = 1
MAX_SOURCE_BYTES = 64 * 1024 * 1024
MAX_CALIBRATION_BYTES = 64 * 1024
MAX_LINE_BYTES = 8 * 1024 * 1024
MAX_ROWS = 250_000
MAX_SAMPLE_AGE_SECONDS = 300
MAX_FUTURE_SKEW_SECONDS = 30
MAX_CALIBRATION_LAG_SECONDS = 300


def _positive_int(value: Any) -> bool:
    return type(value) is int and value > 0


def _nonnegative_int(value: Any) -> bool:
    return type(value) is int and value >= 0


def _utc_datetime(value: Any) -> datetime | None:
    if not isinstance(value, str) or len(value) > 80:
        return None
    try:
        parsed = datetime.fromisoformat(value[:-1] + "+00:00" if value.endswith("Z") else value)
    except ValueError:
        return None
    if parsed.tzinfo is None or parsed.utcoffset() is None:
        return None
    return parsed.astimezone(timezone.utc)


def _file_identity(info: os.stat_result) -> tuple[int, int]:
    return (info.st_dev, info.st_ino)


def _file_version(info: os.stat_result) -> tuple[int, int, int]:
    return (info.st_size, info.st_mtime_ns, info.st_ctime_ns)


def _is_reparse_or_link(info: os.stat_result) -> bool:
    return stat.S_ISLNK(info.st_mode) or bool(getattr(info, "st_file_attributes", 0) & 0x400)


def _validate_local_file(
    path_value: str | os.PathLike[str], *, max_bytes: int, suffix: str
) -> tuple[Path | None, tuple[int, int] | None, str | None]:
    try:
        raw_path = os.fspath(path_value)
        if not isinstance(raw_path, str) or not raw_path or "\x00" in raw_path:
            return None, None, "invalid_path"
        path = Path(raw_path)
        if not path.is_absolute() or ".." in path.parts or raw_path.startswith(("\\\\", "//")):
            return None, None, "path_not_allowed"
        if path.suffix.lower() != suffix:
            return None, None, "path_extension"
        before = path.lstat()
        if _is_reparse_or_link(before):
            return None, None, "reparse_point"
        for parent in path.parents:
            parent_stat = parent.lstat()
            if _is_reparse_or_link(parent_stat):
                return None, None, "reparse_point"
        if not stat.S_ISREG(before.st_mode):
            return None, None, "not_regular_file"
        if before.st_size < 0 or before.st_size > max_bytes:
            return None, None, "source_too_large"
        return path, _file_identity(before), None
    except (OSError, TypeError, ValueError):
        return None, None, "source_unavailable"


def _read_bounded_stable(
    path: Path, *, expected_identity: tuple[int, int], max_bytes: int
) -> tuple[bytes | None, str | None]:
    """Read one validated file identity through one descriptor; fail closed on replacement."""
    fd: int | None = None
    try:
        flags = os.O_RDONLY | getattr(os, "O_BINARY", 0)
        flags |= getattr(os, "O_NOFOLLOW", 0)
        flags |= getattr(os, "O_NONBLOCK", 0)
        fd = os.open(path, flags)
        before = os.fstat(fd)
        if _is_reparse_or_link(before) or not stat.S_ISREG(before.st_mode):
            return None, "not_regular_file"
        if _file_identity(before) != expected_identity:
            return None, "source_replaced_before_read"
        # Compare the opened descriptor with the current non-following path entry.
        # Reading remains bound to fd even if the pathname changes afterwards.
        path_info = path.lstat()
        if _is_reparse_or_link(path_info):
            return None, "reparse_point"
        if not stat.S_ISREG(path_info.st_mode) or _file_identity(path_info) != expected_identity:
            return None, "source_replaced_before_read"
        if before.st_size > max_bytes:
            return None, "source_too_large"
        before_version = _file_version(before)
        chunks: list[bytes] = []
        total_read = 0
        remaining = before.st_size
        with os.fdopen(fd, "rb", closefd=True) as stream:
            fd = None
            while remaining:
                chunk = stream.readline(min(remaining, MAX_LINE_BYTES + 1))
                if not chunk:
                    return None, "source_changed_during_read"
                if len(chunk) > MAX_LINE_BYTES:
                    return None, "line_too_large"
                chunks.append(chunk)
                total_read += len(chunk)
                remaining -= len(chunk)
                if total_read > max_bytes:
                    return None, "source_too_large"
            after = os.fstat(stream.fileno())
        if (
            _is_reparse_or_link(after)
            or not stat.S_ISREG(after.st_mode)
            or _file_identity(after) != expected_identity
            or _file_version(after) != before_version
        ):
            return None, "source_changed_during_read"
        return b"".join(chunks), None
    except (OSError, ValueError):
        return None, "source_unavailable"
    finally:
        if fd is not None:
            os.close(fd)


def _unknown(reason: str) -> dict[str, Any]:
    result: dict[str, Any] = {
        "schema_version": SCHEMA_VERSION,
        "status": "unknown",
        "reason": reason,
        "session_binding": "unknown",
        "sample_freshness": "unknown",
        "sample": None,
        "desktop_calibration": {"status": "unknown", "scope": "single_sample_only"},
        "compaction_signal": {"status": "unknown", "event_count": 0, "last_event_timestamp_utc": None, "last_event_key": None, "checkpoint_requested": False},
        "active_context_usage_tokens": None,
        "utilization_percent": None,
        "remaining_tokens": None,
        "usage_semantics": "unvalidated; no active-context equivalence asserted",
    }
    result["source"] = {"kind": "explicit_local_jsonl", "path_included": False}
    return result


def _unknown_with_compaction(reason: str, signal: dict[str, Any]) -> dict[str, Any]:
    result = _unknown(reason)
    result["compaction_signal"] = signal
    return result


def _parse_compaction_event(record: dict[str, Any], row_index: int) -> dict[str, Any] | None:
    if record.get("type") != "compacted":
        return None
    timestamp = _utc_datetime(record.get("timestamp"))
    if timestamp is None:
        return {"invalid": True, "row_index": row_index}
    return {"timestamp": timestamp, "row_index": row_index}


def _compaction_event_key(session_id: str, timestamp: datetime) -> str:
    canonical_timestamp = timestamp.astimezone(timezone.utc).isoformat().replace("+00:00", "Z")
    return hashlib.sha256(f"{session_id}\n{canonical_timestamp}".encode("utf-8")).hexdigest()


def _parse_usage_event(record: dict[str, Any], row_index: int) -> dict[str, Any] | None:
    if record.get("type") != "event_msg":
        return None
    payload = record.get("payload")
    if not isinstance(payload, dict) or payload.get("type") != "token_count":
        return None
    info = payload.get("info")
    if not isinstance(info, dict):
        return None
    usage = info.get("last_token_usage")
    if not isinstance(usage, dict):
        return None
    metrics = {key: usage.get(key) for key in ("input_tokens", "cached_input_tokens", "output_tokens", "total_tokens")}
    if not all(_nonnegative_int(value) for value in metrics.values()):
        return None
    if metrics["cached_input_tokens"] > metrics["input_tokens"]:
        return None
    timestamp = _utc_datetime(record.get("timestamp"))
    window = info.get("model_context_window")
    if timestamp is None or not _positive_int(window):
        return None
    return {"timestamp": timestamp, "row_index": row_index, "window_tokens": window, **metrics}


def _normalize_calibration(data: Any) -> dict[str, Any] | None:
    if not isinstance(data, dict):
        return None
    # Supported one-shot shape from the sanitized native UI contrast artifact.
    if {"session", "ui_reported_used", "ui_reported_window", "captured_at_utc"}.issubset(data):
        candidate = {
            "source": "desktop_status",
            "session_id": data.get("session"),
            "used_tokens": data.get("ui_reported_used"),
            "window_tokens": data.get("ui_reported_window"),
            "captured_at_utc": data.get("captured_at_utc"),
        }
    else:
        candidate = {key: data.get(key) for key in ("source", "session_id", "used_tokens", "window_tokens", "captured_at_utc")}
    if candidate["source"] != "desktop_status":
        return None
    if not isinstance(candidate["session_id"], str) or not candidate["session_id"].strip() or len(candidate["session_id"]) > 128:
        return None
    if not _nonnegative_int(candidate["used_tokens"]) or not _positive_int(candidate["window_tokens"]):
        return None
    captured = _utc_datetime(candidate["captured_at_utc"])
    if captured is None:
        return None
    candidate["captured_at"] = captured
    return candidate


def load_calibration(path_value: str | os.PathLike[str]) -> tuple[dict[str, Any] | None, str | None]:
    path, identity, error = _validate_local_file(path_value, max_bytes=MAX_CALIBRATION_BYTES, suffix=".json")
    if error:
        return None, error
    assert path is not None
    assert identity is not None
    raw, error = _read_bounded_stable(path, expected_identity=identity, max_bytes=MAX_CALIBRATION_BYTES)
    if error or raw is None:
        return None, error or "calibration_unavailable"
    try:
        data = json.loads(raw.decode("utf-8"))
    except (UnicodeDecodeError, json.JSONDecodeError):
        return None, "calibration_invalid"
    value = _normalize_calibration(data)
    return (value, None) if value is not None else (None, "calibration_invalid")


def _age_seconds(now: datetime, sample: datetime) -> float:
    return (now - sample).total_seconds()


def read_context_snapshot(
    source_path: str | os.PathLike[str],
    *,
    expected_session_id: str,
    expected_window_tokens: int,
    calibration: dict[str, Any] | None = None,
    acknowledged_compaction_event_key: str | None = None,
    now: datetime | None = None,
) -> dict[str, Any]:
    """Read one local JSONL snapshot and return an allowlisted, sanitized result."""
    path, identity, error = _validate_local_file(source_path, max_bytes=MAX_SOURCE_BYTES, suffix=".jsonl")
    if error:
        return _unknown(error)
    assert path is not None
    assert identity is not None
    if not isinstance(expected_session_id, str) or not expected_session_id.strip() or len(expected_session_id) > 128:
        return _unknown("expected_session_invalid")
    if not _positive_int(expected_window_tokens):
        return _unknown("expected_window_invalid")
    now_utc = now.astimezone(timezone.utc) if isinstance(now, datetime) and now.tzinfo else datetime.now(timezone.utc)
    raw, error = _read_bounded_stable(path, expected_identity=identity, max_bytes=MAX_SOURCE_BYTES)
    if error or raw is None:
        return _unknown(error or "source_unavailable")

    lines = raw.splitlines(keepends=True)
    if len(lines) > MAX_ROWS:
        return _unknown("too_many_rows")
    session_ids: list[str] = []
    events: list[dict[str, Any]] = []
    compaction_events: list[dict[str, Any]] = []
    partial_trailing_ignored = False
    invalid_token_rows = 0
    for index, line in enumerate(lines):
        if not line.strip():
            continue
        try:
            record = json.loads(line.decode("utf-8"))
        except (UnicodeDecodeError, json.JSONDecodeError, RecursionError):
            if index == len(lines) - 1 and not line.endswith((b"\n", b"\r")):
                partial_trailing_ignored = True
                continue
            return _unknown("malformed_record")
        if not isinstance(record, dict):
            return _unknown("malformed_record")
        if record.get("type") == "session_meta":
            payload = record.get("payload")
            session_id = payload.get("id") if isinstance(payload, dict) else None
            if not isinstance(session_id, str) or not session_id:
                return _unknown("session_meta_invalid")
            session_ids.append(session_id)
        elif record.get("type") == "event_msg" and isinstance(record.get("payload"), dict) and record["payload"].get("type") == "token_count":
            event = _parse_usage_event(record, index)
            if event is None:
                invalid_token_rows += 1
            else:
                events.append(event)
        elif record.get("type") == "compacted":
            event = _parse_compaction_event(record, index)
            if event is None or event.get("invalid"):
                return _unknown("compaction_event_timestamp_invalid")
            compaction_events.append(event)

    if len(session_ids) != 1:
        return _unknown("session_meta_missing_or_ambiguous")
    if session_ids[0] != expected_session_id:
        return _unknown("session_mismatch")
    compaction_events.sort(key=lambda item: (item["timestamp"], item["row_index"]))
    for event in compaction_events:
        if _age_seconds(now_utc, event["timestamp"]) < -MAX_FUTURE_SKEW_SECONDS:
            return _unknown("compaction_event_timestamp_in_future")
    unique_compactions: dict[str, datetime] = {}
    for event in compaction_events:
        key = _compaction_event_key(expected_session_id, event["timestamp"])
        unique_compactions[key] = event["timestamp"]
    last_compaction_key = next(reversed(unique_compactions), None)
    compaction_signal = {
        "status": "detected" if last_compaction_key is not None else "none",
        "event_count": len(unique_compactions),
        "last_event_timestamp_utc": unique_compactions[last_compaction_key].isoformat().replace("+00:00", "Z") if last_compaction_key else None,
        "last_event_key": last_compaction_key,
        "checkpoint_requested": last_compaction_key is not None and last_compaction_key != acknowledged_compaction_event_key,
    }
    if not events:
        return _unknown_with_compaction("token_count_missing_or_invalid", compaction_signal)

    events.sort(key=lambda item: (item["timestamp"], item["row_index"]))
    latest = events[-1]
    age = _age_seconds(now_utc, latest["timestamp"])
    if age < -MAX_FUTURE_SKEW_SECONDS:
        return _unknown_with_compaction("sample_timestamp_in_future", compaction_signal)
    freshness = "fresh" if age <= MAX_SAMPLE_AGE_SECONDS else "stale"
    window_matches = latest["window_tokens"] == expected_window_tokens
    sample_status = "fresh" if freshness == "fresh" and window_matches else ("stale" if freshness == "stale" else "window_mismatch")

    calibration_result: dict[str, Any] = {"status": "unknown", "scope": "single_sample_only", "current_sample_matches": False, "reason": "not_supplied"}
    if calibration is not None:
        normalized = _normalize_calibration(calibration)
        if normalized is None:
            calibration_result["reason"] = "calibration_invalid"
        elif normalized["session_id"] != expected_session_id:
            calibration_result["reason"] = "session_mismatch"
        elif normalized["window_tokens"] != expected_window_tokens or latest["window_tokens"] != normalized["window_tokens"]:
            calibration_result["reason"] = "window_mismatch"
        else:
            ui_age = _age_seconds(now_utc, normalized["captured_at"])
            if ui_age < -MAX_FUTURE_SKEW_SECONDS:
                calibration_result["reason"] = "calibration_timestamp_in_future"
            elif ui_age > MAX_SAMPLE_AGE_SECONDS:
                calibration_result["reason"] = "calibration_stale"
            elif freshness != "fresh":
                calibration_result["reason"] = "sample_stale"
            elif not window_matches:
                calibration_result["reason"] = "window_mismatch"
            else:
                matches = [
                    item for item in events
                    if item["window_tokens"] == normalized["window_tokens"]
                    and item["total_tokens"] == normalized["used_tokens"]
                    and -MAX_FUTURE_SKEW_SECONDS <= (normalized["captured_at"] - item["timestamp"]).total_seconds() <= MAX_CALIBRATION_LAG_SECONDS
                ]
                if matches:
                    matched = matches[-1]
                    changed_window_after_anchor = any(
                        item["timestamp"] >= matched["timestamp"] and item["window_tokens"] != normalized["window_tokens"]
                        for item in events
                    )
                    if changed_window_after_anchor:
                        calibration_result["reason"] = "window_changed_since_anchor"
                    else:
                        lag = (normalized["captured_at"] - matched["timestamp"]).total_seconds()
                        calibration_result = {
                            "status": "desktop_status_correlated",
                            "scope": "single_sample_only",
                            "match_timestamp_utc": matched["timestamp"].isoformat().replace("+00:00", "Z"),
                            "calibration_lag_seconds": round(lag, 3),
                            "current_sample_matches": latest["timestamp"] == matched["timestamp"] and latest["total_tokens"] == normalized["used_tokens"],
                            "compaction_detection": "not_available_from_token_count_alone",
                        }
                else:
                    calibration_result["reason"] = "no_exact_fresh_sample_match"

    sample = {
        "timestamp_utc": latest["timestamp"].isoformat().replace("+00:00", "Z"),
        "age_seconds": round(max(0.0, age), 3),
        "window_tokens": latest["window_tokens"],
        "last_token_usage": {
            "total_tokens": latest["total_tokens"],
            "input_tokens": latest["input_tokens"],
            "cached_input_tokens": latest["cached_input_tokens"],
            "output_tokens": latest["output_tokens"],
        },
    }
    calibrated = calibration_result["status"] == "desktop_status_correlated"
    return {
        "schema_version": SCHEMA_VERSION,
        "status": "desktop_status_correlated" if calibrated else "unknown",
        "reason": None if calibrated else calibration_result.get("reason", "no_valid_calibration"),
        "source": {"kind": "explicit_local_jsonl", "path_included": False},
        "source_size_bytes": len(raw),
        "session_binding": "matched",
        "sample_freshness": freshness,
        "sample_status": sample_status,
        "sample": sample,
        "invalid_token_count_rows": invalid_token_rows,
        "partial_trailing_row_ignored": partial_trailing_ignored,
        "desktop_calibration": calibration_result,
        "compaction_signal": compaction_signal,
        "active_context_usage_tokens": None,
        "utilization_percent": None,
        "remaining_tokens": None,
        "usage_semantics": "unvalidated last_token_usage values; cached input is separate; no active-context or Cloud equivalence asserted",
    }


def _load_cli_calibration(path_value: str | None) -> tuple[dict[str, Any] | None, str | None]:
    if path_value is None:
        return None, None
    return load_calibration(path_value)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="One-shot, local, allowlisted Codex context sample reader")
    parser.add_argument("--events", required=True, help="explicit local Codex JSONL path")
    parser.add_argument("--calibration-json", help="explicit desktop-status calibration JSON")
    parser.add_argument("--expected-session-id", help="required unless supplied by calibration JSON")
    parser.add_argument("--expected-window-tokens", type=int, help="required unless supplied by calibration JSON")
    parser.add_argument("--acknowledged-compaction-event-key", help="informational key already acknowledged by the caller")
    args = parser.parse_args(argv)
    calibration, error = _load_cli_calibration(args.calibration_json)
    if error:
        print(json.dumps(_unknown(error), separators=(",", ":")))
        return 0
    expected_session_id = args.expected_session_id if args.expected_session_id is not None else (calibration.get("session_id") if calibration else None)
    expected_window = args.expected_window_tokens if args.expected_window_tokens is not None else (calibration.get("window_tokens") if calibration else None)
    if not isinstance(expected_session_id, str) or not _positive_int(expected_window):
        print(json.dumps(_unknown("expected_session_or_window_missing"), separators=(",", ":")))
        return 0
    result = read_context_snapshot(
        args.events,
        expected_session_id=expected_session_id,
        expected_window_tokens=expected_window,
        calibration=calibration,
        acknowledged_compaction_event_key=args.acknowledged_compaction_event_key,
    )
    print(json.dumps(result, separators=(",", ":"), ensure_ascii=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
