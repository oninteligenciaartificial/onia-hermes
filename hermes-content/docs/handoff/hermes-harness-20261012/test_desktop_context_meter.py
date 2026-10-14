from __future__ import annotations

import json
import os
import subprocess
import sys
import tempfile
import unittest
from datetime import datetime, timedelta, timezone
from pathlib import Path
from unittest.mock import patch

from desktop_context_meter import read_context_snapshot


SESSION = "fixture-session-001"
WINDOW = 475_000


def event(timestamp: datetime, *, window: int = WINDOW, total: int = 777) -> dict:
    return {
        "type": "event_msg",
        "timestamp": timestamp.astimezone(timezone.utc).isoformat().replace("+00:00", "Z"),
        "payload": {
            "type": "token_count",
            "info": {
                "model_context_window": window,
                "last_token_usage": {
                    "input_tokens": 100,
                    "cached_input_tokens": 80,
                    "output_tokens": 7,
                    "total_tokens": total,
                },
            },
        },
    }


def compacted(timestamp: datetime) -> dict:
    return {
        "type": "compacted",
        "timestamp": timestamp.astimezone(timezone.utc).isoformat().replace("+00:00", "Z"),
        "payload": {"opaque": "CANARY_SECRET"},
    }


def write_jsonl(path: Path, *, session: str = SESSION, rows: list[dict] | None = None, partial: bytes = b"") -> None:
    records = [{"type": "session_meta", "payload": {"id": session}}]
    records.extend(rows or [])
    path.write_bytes(b"".join(json.dumps(row).encode("utf-8") + b"\n" for row in records) + partial)


def calibration(*, session: str = SESSION, window: int = WINDOW, used: int = 777, captured: datetime) -> dict:
    return {
        "source": "desktop_status",
        "session_id": session,
        "window_tokens": window,
        "used_tokens": used,
        "captured_at_utc": captured.astimezone(timezone.utc).isoformat().replace("+00:00", "Z"),
    }


class DesktopContextMeterTests(unittest.TestCase):
    def test_wrong_session_fails_closed_without_returning_usage(self):
        now = datetime.now(timezone.utc)
        with tempfile.TemporaryDirectory() as temp:
            source = Path(temp) / "events.jsonl"
            write_jsonl(source, session="different-session", rows=[event(now)])
            result = read_context_snapshot(source, expected_session_id=SESSION, expected_window_tokens=WINDOW, now=now)
        self.assertEqual(result["status"], "unknown")
        self.assertEqual(result["reason"], "session_mismatch")
        self.assertIsNone(result["sample"])

    def test_compaction_emits_deduplicable_metadata_without_session_or_content(self):
        now = datetime.now(timezone.utc)
        compacted_at = now - timedelta(seconds=1)
        with tempfile.TemporaryDirectory() as temp:
            source = Path(temp) / "events.jsonl"
            write_jsonl(source, rows=[event(now), compacted(compacted_at)])
            result = read_context_snapshot(source, expected_session_id=SESSION, expected_window_tokens=WINDOW, now=now)
        signal = result["compaction_signal"]
        self.assertEqual(signal["event_count"], 1)
        self.assertEqual(signal["last_event_timestamp_utc"], compacted_at.isoformat().replace("+00:00", "Z"))
        self.assertRegex(signal["last_event_key"], r"^[0-9a-f]{64}$")
        self.assertTrue(signal["checkpoint_requested"])
        self.assertNotIn(SESSION, json.dumps(result))
        self.assertNotIn("CANARY_SECRET", json.dumps(result))
        self.assertIsNone(result["active_context_usage_tokens"])

    def test_acknowledged_compaction_key_is_idempotent(self):
        now = datetime.now(timezone.utc)
        with tempfile.TemporaryDirectory() as temp:
            source = Path(temp) / "events.jsonl"
            write_jsonl(source, rows=[event(now), compacted(now - timedelta(seconds=1))])
            first = read_context_snapshot(source, expected_session_id=SESSION, expected_window_tokens=WINDOW, now=now)
            second = read_context_snapshot(
                source,
                expected_session_id=SESSION,
                expected_window_tokens=WINDOW,
                acknowledged_compaction_event_key=first["compaction_signal"]["last_event_key"],
                now=now,
            )
        self.assertTrue(first["compaction_signal"]["checkpoint_requested"])
        self.assertFalse(second["compaction_signal"]["checkpoint_requested"])
        self.assertEqual(first["compaction_signal"]["last_event_key"], second["compaction_signal"]["last_event_key"])

    def test_compaction_signal_is_bound_to_the_expected_session(self):
        now = datetime.now(timezone.utc)
        with tempfile.TemporaryDirectory() as temp:
            source = Path(temp) / "events.jsonl"
            write_jsonl(source, session="foreign-session", rows=[event(now), compacted(now - timedelta(seconds=1))])
            result = read_context_snapshot(source, expected_session_id=SESSION, expected_window_tokens=WINDOW, now=now)
        self.assertEqual(result["status"], "unknown")
        self.assertEqual(result["reason"], "session_mismatch")
        self.assertIsNone(result["sample"])

    def test_partial_trailing_row_does_not_hide_confirmed_compaction(self):
        now = datetime.now(timezone.utc)
        compacted_at = now - timedelta(seconds=1)
        with tempfile.TemporaryDirectory() as temp:
            source = Path(temp) / "events.jsonl"
            write_jsonl(source, rows=[event(now), compacted(compacted_at)], partial=b'{"type":"event_msg","payload":')
            result = read_context_snapshot(source, expected_session_id=SESSION, expected_window_tokens=WINDOW, now=now)
        self.assertTrue(result["partial_trailing_row_ignored"])
        self.assertEqual(result["compaction_signal"]["last_event_timestamp_utc"], compacted_at.isoformat().replace("+00:00", "Z"))

    def test_future_compaction_event_fails_closed(self):
        now = datetime.now(timezone.utc)
        with tempfile.TemporaryDirectory() as temp:
            source = Path(temp) / "events.jsonl"
            write_jsonl(source, rows=[event(now), compacted(now + timedelta(seconds=31))])
            result = read_context_snapshot(source, expected_session_id=SESSION, expected_window_tokens=WINDOW, now=now)
        self.assertEqual(result["status"], "unknown")
        self.assertEqual(result["reason"], "compaction_event_timestamp_in_future")
        self.assertIsNone(result["sample"])

    def test_stale_latest_sample_is_unknown_even_if_numbers_match(self):
        now = datetime.now(timezone.utc)
        old = now - timedelta(seconds=301)
        with tempfile.TemporaryDirectory() as temp:
            source = Path(temp) / "events.jsonl"
            write_jsonl(source, rows=[event(old)])
            result = read_context_snapshot(source, expected_session_id=SESSION, expected_window_tokens=WINDOW, calibration=calibration(used=777, captured=now), now=now)
        self.assertEqual(result["status"], "unknown")
        self.assertEqual(result["sample_freshness"], "stale")
        self.assertEqual(result["desktop_calibration"]["reason"], "sample_stale")

    def test_stale_ui_anchor_does_not_correlate_a_fresh_sample(self):
        now = datetime.now(timezone.utc)
        with tempfile.TemporaryDirectory() as temp:
            source = Path(temp) / "events.jsonl"
            write_jsonl(source, rows=[event(now - timedelta(seconds=2))])
            result = read_context_snapshot(source, expected_session_id=SESSION, expected_window_tokens=WINDOW, calibration=calibration(used=777, captured=now - timedelta(seconds=301)), now=now)
        self.assertEqual(result["sample_freshness"], "fresh")
        self.assertEqual(result["status"], "unknown")
        self.assertEqual(result["desktop_calibration"]["reason"], "calibration_stale")

    def test_window_mismatch_invalidates_ui_correlation(self):
        now = datetime.now(timezone.utc)
        with tempfile.TemporaryDirectory() as temp:
            source = Path(temp) / "events.jsonl"
            write_jsonl(source, rows=[event(now - timedelta(seconds=1), window=400_000)])
            result = read_context_snapshot(source, expected_session_id=SESSION, expected_window_tokens=WINDOW, calibration=calibration(captured=now), now=now)
        self.assertEqual(result["status"], "unknown")
        self.assertEqual(result["sample_status"], "window_mismatch")
        self.assertEqual(result["desktop_calibration"]["reason"], "window_mismatch")

    def test_trailing_partial_row_is_ignored_but_last_valid_row_is_returned(self):
        now = datetime.now(timezone.utc)
        with tempfile.TemporaryDirectory() as temp:
            source = Path(temp) / "events.jsonl"
            write_jsonl(source, rows=[event(now - timedelta(seconds=2), total=700)], partial=b'{"type":"event_msg","payload":')
            result = read_context_snapshot(source, expected_session_id=SESSION, expected_window_tokens=WINDOW, now=now)
        self.assertEqual(result["sample"]["last_token_usage"]["total_tokens"], 700)
        self.assertTrue(result["partial_trailing_row_ignored"])

    def test_total_is_reported_verbatim_not_derived_or_augmented_with_cache(self):
        now = datetime.now(timezone.utc)
        with tempfile.TemporaryDirectory() as temp:
            source = Path(temp) / "events.jsonl"
            write_jsonl(source, rows=[event(now - timedelta(seconds=1), total=999)])
            result = read_context_snapshot(source, expected_session_id=SESSION, expected_window_tokens=WINDOW, now=now)
        usage = result["sample"]["last_token_usage"]
        self.assertEqual(usage, {"total_tokens": 999, "input_tokens": 100, "cached_input_tokens": 80, "output_tokens": 7})
        self.assertIsNone(result["active_context_usage_tokens"])
        self.assertIsNone(result["utilization_percent"])

    def test_ui_correlation_is_single_sample_and_never_claims_active_usage(self):
        now = datetime.now(timezone.utc)
        sample_time = now - timedelta(seconds=5)
        ui_time = now - timedelta(seconds=2)
        with tempfile.TemporaryDirectory() as temp:
            source = Path(temp) / "events.jsonl"
            write_jsonl(source, rows=[event(sample_time, total=777)])
            result = read_context_snapshot(source, expected_session_id=SESSION, expected_window_tokens=WINDOW, calibration=calibration(used=777, captured=ui_time), now=now)
        self.assertEqual(result["status"], "desktop_status_correlated")
        self.assertEqual(result["desktop_calibration"]["scope"], "single_sample_only")
        self.assertTrue(result["desktop_calibration"]["current_sample_matches"])
        self.assertIsNone(result["active_context_usage_tokens"])
        self.assertIn("no active-context or Cloud equivalence asserted", result["usage_semantics"])
        self.assertNotIn(SESSION, json.dumps(result))

    def test_later_sample_does_not_inherit_the_older_ui_calibration(self):
        now = datetime.now(timezone.utc)
        matched_time = now - timedelta(seconds=12)
        ui_time = now - timedelta(seconds=10)
        latest_time = now - timedelta(seconds=4)
        with tempfile.TemporaryDirectory() as temp:
            source = Path(temp) / "events.jsonl"
            write_jsonl(source, rows=[event(matched_time, total=777), event(latest_time, total=888)])
            result = read_context_snapshot(source, expected_session_id=SESSION, expected_window_tokens=WINDOW, calibration=calibration(used=777, captured=ui_time), now=now)
        self.assertEqual(result["status"], "desktop_status_correlated")
        self.assertEqual(result["sample"]["last_token_usage"]["total_tokens"], 888)
        self.assertFalse(result["desktop_calibration"]["current_sample_matches"])
        self.assertEqual(result["desktop_calibration"]["compaction_detection"], "not_available_from_token_count_alone")

    def test_window_change_after_calibration_anchor_invalidates_it_even_if_it_returns(self):
        now = datetime.now(timezone.utc)
        anchor_time = now - timedelta(seconds=10)
        ui_time = now - timedelta(seconds=8)
        with tempfile.TemporaryDirectory() as temp:
            source = Path(temp) / "events.jsonl"
            write_jsonl(source, rows=[event(anchor_time, total=777), event(now - timedelta(seconds=5), window=400_000, total=888), event(now - timedelta(seconds=3), window=WINDOW, total=900)])
            result = read_context_snapshot(source, expected_session_id=SESSION, expected_window_tokens=WINDOW, calibration=calibration(used=777, captured=ui_time), now=now)
        self.assertEqual(result["status"], "unknown")
        self.assertEqual(result["desktop_calibration"]["reason"], "window_changed_since_anchor")

    def test_cli_reads_explicit_jsonl_and_calibration_without_emitting_session_or_message(self):
        now = datetime.now(timezone.utc)
        sample_time = now - timedelta(seconds=4)
        ui_time = now - timedelta(seconds=2)
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            source = root / "events.jsonl"
            cal_path = root / "calibration.json"
            write_jsonl(source, rows=[event(sample_time, total=777), {"type": "response_item", "payload": {"content": "NEVER_LEAK_THIS"}}])
            cal_path.write_text(json.dumps(calibration(used=777, captured=ui_time)), encoding="utf-8")
            script = Path(__file__).with_name("desktop_context_meter.py")
            proc = subprocess.run([sys.executable, str(script), "--events", str(source), "--calibration-json", str(cal_path)], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, check=False, timeout=10)
        self.assertEqual(proc.returncode, 0)
        result = json.loads(proc.stdout)
        self.assertEqual(result["status"], "desktop_status_correlated")
        self.assertNotIn(SESSION, proc.stdout)
        self.assertNotIn("NEVER_LEAK_THIS", proc.stdout)
        self.assertEqual(result["sample"]["last_token_usage"]["total_tokens"], 777)

    def test_partial_or_boolean_metrics_are_not_valid_samples(self):
        now = datetime.now(timezone.utc)
        invalid = event(now)
        invalid["payload"]["info"]["last_token_usage"]["total_tokens"] = True
        with tempfile.TemporaryDirectory() as temp:
            source = Path(temp) / "events.jsonl"
            write_jsonl(source, rows=[invalid])
            result = read_context_snapshot(source, expected_session_id=SESSION, expected_window_tokens=WINDOW, now=now)
        self.assertEqual(result["status"], "unknown")
        self.assertEqual(result["reason"], "token_count_missing_or_invalid")

    def test_replacement_between_validation_and_open_is_rejected_before_read(self):
        now = datetime.now(timezone.utc)
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            source = root / "events.jsonl"
            held = root / "held.jsonl"
            replacement = root / "replacement.jsonl"
            write_jsonl(source, rows=[event(now - timedelta(seconds=1), total=700)])
            write_jsonl(replacement, rows=[event(now - timedelta(seconds=1), total=999)])
            real_open = os.open
            real_fdopen = os.fdopen
            opened_streams = 0

            def replace_then_open(path, flags, *args, **kwargs):
                os.replace(source, held)
                os.replace(replacement, source)
                return real_open(path, flags, *args, **kwargs)

            def count_fdopen(*args, **kwargs):
                nonlocal opened_streams
                opened_streams += 1
                return real_fdopen(*args, **kwargs)

            with patch("desktop_context_meter.os.open", side_effect=replace_then_open), patch(
                "desktop_context_meter.os.fdopen", side_effect=count_fdopen
            ):
                result = read_context_snapshot(source, expected_session_id=SESSION, expected_window_tokens=WINDOW, now=now)

        self.assertEqual(result["status"], "unknown")
        self.assertEqual(result["reason"], "source_replaced_before_read")
        self.assertEqual(opened_streams, 0)
        self.assertIsNone(result["sample"])

    def test_append_after_initial_prefix_read_is_accepted_and_prefix_revalidated(self):
        now = datetime.now(timezone.utc)
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            source = root / "events.jsonl"
            appended = json.dumps(event(now, total=888)).encode("utf-8") + b"\n"
            write_jsonl(source, rows=[event(now - timedelta(seconds=1), total=700)])
            real_fstat = os.fstat
            calls = 0

            def append_after_read(fd):
                nonlocal calls
                calls += 1
                if calls == 2:
                    with source.open("ab") as stream:
                        stream.write(appended)
                return real_fstat(fd)

            with patch("desktop_context_meter.os.fstat", side_effect=append_after_read):
                result = read_context_snapshot(source, expected_session_id=SESSION, expected_window_tokens=WINDOW, now=now)

        self.assertEqual(result["sample_status"], "fresh", result)
        self.assertEqual(result["sample"]["last_token_usage"]["total_tokens"], 700)
        self.assertIsNone(result["active_context_usage_tokens"])

    def test_mutated_prefix_after_initial_read_is_rejected(self):
        now = datetime.now(timezone.utc)
        with tempfile.TemporaryDirectory() as temp:
            source = Path(temp) / "events.jsonl"
            write_jsonl(source, rows=[event(now - timedelta(seconds=1), total=700)])
            real_fstat = os.fstat
            calls = 0

            def mutate_after_read(fd):
                nonlocal calls
                calls += 1
                if calls == 2:
                    with source.open("r+b") as stream:
                        stream.seek(0)
                        stream.write(b" " * 10)
                return real_fstat(fd)

            with patch("desktop_context_meter.os.fstat", side_effect=mutate_after_read):
                result = read_context_snapshot(source, expected_session_id=SESSION, expected_window_tokens=WINDOW, now=now)

        self.assertEqual(result["status"], "unknown")
        self.assertEqual(result["reason"], "source_changed_during_read")

    def test_truncation_after_initial_read_is_rejected(self):
        now = datetime.now(timezone.utc)
        with tempfile.TemporaryDirectory() as temp:
            source = Path(temp) / "events.jsonl"
            write_jsonl(source, rows=[event(now - timedelta(seconds=1), total=700)])
            real_fstat = os.fstat
            calls = 0

            def truncate_after_read(fd):
                nonlocal calls
                calls += 1
                if calls == 2:
                    source.write_bytes(b"")
                return real_fstat(fd)

            with patch("desktop_context_meter.os.fstat", side_effect=truncate_after_read):
                result = read_context_snapshot(source, expected_session_id=SESSION, expected_window_tokens=WINDOW, now=now)

        self.assertEqual(result["status"], "unknown")
        self.assertEqual(result["reason"], "source_changed_during_read")

    def test_path_replacement_after_initial_read_is_rejected(self):
        now = datetime.now(timezone.utc)
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            source = root / "events.jsonl"
            replacement = root / "replacement.jsonl"
            write_jsonl(source, rows=[event(now - timedelta(seconds=1), total=700)])
            write_jsonl(replacement, rows=[event(now - timedelta(seconds=1), total=999)])
            real_lstat = Path.lstat
            source_lstat_calls = 0

            def replaced_path_lstat(path):
                nonlocal source_lstat_calls
                if path == source:
                    source_lstat_calls += 1
                    if source_lstat_calls == 3:
                        return real_lstat(replacement)
                return real_lstat(path)

            with patch.object(Path, "lstat", replaced_path_lstat):
                result = read_context_snapshot(source, expected_session_id=SESSION, expected_window_tokens=WINDOW, now=now)

        self.assertEqual(result["status"], "unknown")
        self.assertEqual(result["reason"], "source_changed_during_read")

    def test_future_token_timestamp_is_rejected(self):
        now = datetime.now(timezone.utc)
        with tempfile.TemporaryDirectory() as temp:
            source = Path(temp) / "events.jsonl"
            write_jsonl(source, rows=[event(now + timedelta(seconds=31))])
            result = read_context_snapshot(source, expected_session_id=SESSION, expected_window_tokens=WINDOW, now=now)
        self.assertEqual(result["status"], "unknown")
        self.assertEqual(result["reason"], "sample_timestamp_in_future")

    def test_valid_compaction_signal_survives_invalid_future_token_sample(self):
        now = datetime.now(timezone.utc)
        compacted_at = now - timedelta(seconds=1)
        with tempfile.TemporaryDirectory() as temp:
            source = Path(temp) / "events.jsonl"
            write_jsonl(source, rows=[compacted(compacted_at), event(now + timedelta(seconds=31))])
            result = read_context_snapshot(source, expected_session_id=SESSION, expected_window_tokens=WINDOW, now=now)
        self.assertEqual(result["status"], "unknown")
        self.assertEqual(result["reason"], "sample_timestamp_in_future")
        self.assertIsNone(result["active_context_usage_tokens"])
        self.assertEqual(result["compaction_signal"]["status"], "detected")
        self.assertEqual(result["compaction_signal"]["event_count"], 1)
        self.assertEqual(result["compaction_signal"]["last_event_timestamp_utc"], compacted_at.isoformat().replace("+00:00", "Z"))
        self.assertTrue(result["compaction_signal"]["checkpoint_requested"])

    def test_malformed_nontrailing_row_fails_closed(self):
        now = datetime.now(timezone.utc)
        with tempfile.TemporaryDirectory() as temp:
            source = Path(temp) / "events.jsonl"
            write_jsonl(source, rows=[event(now - timedelta(seconds=2))])
            source.write_bytes(source.read_bytes() + b'{"type":\n' + json.dumps(event(now - timedelta(seconds=1))).encode("utf-8") + b"\n")
            result = read_context_snapshot(source, expected_session_id=SESSION, expected_window_tokens=WINDOW, now=now)
        self.assertEqual(result["status"], "unknown")
        self.assertEqual(result["reason"], "malformed_record")


if __name__ == "__main__":
    unittest.main()
