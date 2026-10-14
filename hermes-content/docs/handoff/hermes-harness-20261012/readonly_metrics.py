"""Read-only aggregate snapshot for the existing Hermes pilot queue.

Reads task/operation state and timestamps only. It never reads payload or
evidence columns and never opens the database in a mode that can initialize it.
"""
import argparse
from collections import Counter
from datetime import datetime, timezone
import json
import math
from pathlib import Path
import re
import sqlite3
import time


def utc_now():
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def _same_path(a, b):
    a_resolved, b_resolved = a.resolve(), b.resolve()
    if a_resolved == b_resolved:
        return True
    return a_resolved.exists() and b_resolved.exists() and a_resolved.samefile(b_resolved)


def validate_paths(queue, receipt, output):
    queue = Path(queue).resolve(strict=True)
    output = Path(output).resolve(strict=False)
    receipt = Path(receipt).resolve(strict=True) if receipt else None
    protected = [queue, *(Path(str(queue) + suffix) for suffix in ("-wal", "-shm", "-journal"))]
    for candidate in protected:
        if _same_path(output, candidate):
            raise ValueError("output path aliases the queue database or a SQLite sidecar")
    if receipt and _same_path(output, receipt):
        raise ValueError("output path aliases the receipt input")
    return queue, receipt, output


def read_queue(path):
    uri = Path(path).as_uri() + "?mode=ro"
    conn = sqlite3.connect(uri, uri=True, timeout=5)
    try:
        conn.execute("PRAGMA query_only=ON")
        conn.execute("BEGIN")
        tables = {r[0] for r in conn.execute(
            "SELECT name FROM sqlite_master WHERE type='table'")}
        if "tasks" not in tables:
            raise RuntimeError("read-only queue has no tasks table")
        task_rows = conn.execute(
            "SELECT status, effect_state, created_at, updated_at FROM tasks").fetchall()
        task_states = Counter(r[0] for r in task_rows)
        effect_states = Counter(r[1] for r in task_rows)
        lifecycle_spans = [max(0, int(r[3]) - int(r[2])) for r in task_rows]
        operation_states = {}
        if "native_operations" in tables:
            operation_states = dict(Counter(r[0] for r in conn.execute(
                "SELECT state FROM native_operations").fetchall()))
        guard = "UNKNOWN"
        if "controller_guard_state" in tables:
            row = conn.execute("SELECT stopped FROM controller_guard_state WHERE singleton=1").fetchone()
            if row is not None:
                guard = bool(row[0])
        return {
            "task_count": len(task_rows),
            "task_states": dict(task_states),
            "effect_states": dict(effect_states),
            "native_operation_count": sum(operation_states.values()),
            "native_operation_states": operation_states,
            "guard_stopped": guard,
            "task_lifecycle_span_seconds_min": min(lifecycle_spans) if lifecycle_spans else None,
            "task_lifecycle_span_seconds_max": max(lifecycle_spans) if lifecycle_spans else None,
            "phase_durations": "UNKNOWN: queue schema has no phase transition timestamps",
            "schema_version": conn.execute("PRAGMA user_version").fetchone()[0],
            "source_tables": sorted(tables),
        }
    finally:
        try:
            if conn.in_transaction:
                conn.rollback()
        finally:
            conn.close()


def read_receipt(path):
    if not path:
        return "UNKNOWN"
    data = json.loads(Path(path).read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        raise ValueError("receipt must be a JSON object")
    # Explicit field and value validation; no nested or caller-defined fields pass through.
    result = {}
    for key in ("state", "platform"):
        value = data.get(key)
        if value is not None:
            allowed = {"state": {"pass", "fail", "unknown"},
                       "platform": {"linux", "windows", "darwin"}}[key]
            if type(value) is not str or value not in allowed:
                raise ValueError(f"invalid receipt {key}")
            result[key] = value
    for key in ("tests", "errors", "failures", "skips", "file_fsync_successes",
                "directory_fsync_successes"):
        value = data.get(key)
        if value is not None:
            if type(value) is not int or value < 0:
                raise ValueError(f"invalid receipt {key}")
            result[key] = value
    value = data.get("duration_seconds")
    if value is not None:
        if type(value) not in (int, float) or not math.isfinite(value) or value < 0:
            raise ValueError("invalid receipt duration_seconds")
        result["duration_seconds"] = value
    for key in ("real_provider", "real_queue"):
        value = data.get(key)
        if value is not None:
            if type(value) is not bool:
                raise ValueError(f"invalid receipt {key}")
            result[key] = value
    return result


def build_snapshot(queue, receipt_path=None):
    started = time.monotonic()
    snapshot_started_at = utc_now()
    data = read_queue(queue)
    receipt = read_receipt(receipt_path)
    snapshot_ended_at = utc_now()
    data.update({
        "snapshot_started_at_utc": snapshot_started_at,
        "snapshot_ended_at_utc": snapshot_ended_at,
        "implementation_model_configured": "gpt-6-luna low (author contract)",
        "run_model": "UNKNOWN",
        "served_model": "UNKNOWN",
        "token_usage": "UNKNOWN",
        "cost_usd": "UNKNOWN",
        "active_context": "UNKNOWN",
        "receipt": receipt,
        "measurement_elapsed_seconds": round(time.monotonic() - started, 6),
        "interpretation": "task done/applied is a queue state, not proof that the business objective was achieved",
    })
    return data


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--queue", required=True, help="existing SQLite queue")
    parser.add_argument("--receipt", help="optional public JSON receipt")
    parser.add_argument("--output", required=True, help="JSON snapshot output path")
    args = parser.parse_args()
    queue, receipt, output = validate_paths(args.queue, args.receipt, args.output)
    snapshot = build_snapshot(queue, receipt)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(snapshot, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    print(json.dumps({"output": str(output), "task_count": snapshot["task_count"],
                      "task_states": snapshot["task_states"],
                      "native_operation_states": snapshot["native_operation_states"],
                      "measurement_elapsed_seconds": snapshot["measurement_elapsed_seconds"]},
                     sort_keys=True))


if __name__ == "__main__":
    main()
