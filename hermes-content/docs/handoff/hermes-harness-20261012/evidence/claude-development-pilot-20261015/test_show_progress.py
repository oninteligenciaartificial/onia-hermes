"""Offline passive viewer tests; no auth, provider or workflow is invoked."""
import contextlib
from datetime import datetime, timezone
import io
import json
from pathlib import Path
import socket
import subprocess
import tempfile
import unittest
from unittest.mock import patch

import show_progress as viewer


NOW = datetime(2026, 10, 16, 14, 0, tzinfo=timezone.utc)


def snapshot(**changes):
    return {"schema": 1, "source": "fixture exported receipt", "timestamp": "2026-10-16T09:59:00-04:00",
            "goal": "Hermes", "task": "contract10", "owner": "worker", "provider": "Codex",
            "model_configured": "fixture-model", "model_observed": "UNKNOWN", "phase": "review",
            "tests": {"pass": 77, "fail": 0, "skip": 6},
            "links": ["https://github.com/oninteligenciaartificial/onia-hermes/commit/abc"],
            "blocker": "offline fixture", "next_action": "read existing receipt", **changes}


class PassiveViewerTests(unittest.TestCase):
    def setUp(self):
        self.area = tempfile.TemporaryDirectory()
        self.addCleanup(self.area.cleanup)
        self.path = Path(self.area.name) / "snapshot.json"

    def write(self, value=None, raw=None):
        self.path.write_bytes(raw if raw is not None else json.dumps(value or snapshot()).encode())

    def invoke(self, args):
        out = io.StringIO()
        with contextlib.redirect_stdout(out):
            code = viewer.main(args)
        return code, out.getvalue()

    def test_schema_renders_metadata_utc_minus_four_and_no_live_claim(self):
        self.write()
        record = viewer.load_snapshot(self.path)
        out = viewer.render(record, now=NOW)
        self.assertIn("2026-10-16T09:59:00-04:00", out)
        self.assertIn("RECENT_SNAPSHOT", out)
        self.assertIn("NO LIVE", out)
        self.assertIn("configured: fixture-model | observed: UNKNOWN", out)
        self.assertIn("77/0/6", out)
        self.assertIn("Phase (de fuente): review", out)

    def test_missing_fields_stay_unknown_not_inferred_from_file_or_clock(self):
        self.write({"schema": 1})
        out = viewer.render(viewer.load_snapshot(self.path), now=NOW)
        for label in ["Fuente", "Fecha fuente UTC-4", "Goal", "Owner", "Provider", "Blocker", "Links"]:
            self.assertIn(label + ": UNKNOWN", out)
        self.assertIn("stale: UNKNOWN", out)
        self.assertIn("UNKNOWN/UNKNOWN/UNKNOWN", out)
        self.assertNotIn("fixture-model", out)

    def test_stale_and_future_timestamps_never_imply_live_freshness(self):
        stale = viewer.normalize(snapshot(timestamp="2026-10-15T10:00:00-04:00"))
        self.assertIn("stale: STALE", viewer.render(stale, now=NOW))
        future = viewer.normalize(snapshot(timestamp="2026-10-17T10:00:00-04:00"))
        self.assertIn("stale: CLOCK_SKEW", viewer.render(future, now=NOW))

    def test_bad_json_utf8_duplicates_nonfinite_and_oversize_rejected(self):
        for raw in (b'{', b'[]', b'\xff', b'{"schema":1,"schema":1}', b'{"schema":1,"tests":NaN}',
                    b' ' * (viewer.MAX_BYTES + 1), b'[' * 2000):
            with self.subTest(raw=raw[:20]):
                self.write(raw=raw)
                with self.assertRaises(viewer.InvalidSnapshot):viewer.load_snapshot(self.path)

    def test_unknown_fields_and_nested_payload_not_displayed(self):
        for value in (snapshot(extra="raw secret"), snapshot(prompt="agent transcript"),
                      snapshot(owner={"raw": "secret"}), {"schema": True}, {"schema": 2}):
            self.write(value)
            with self.assertRaises(viewer.InvalidSnapshot):viewer.load_snapshot(self.path)

    def test_terminal_escapes_controls_bidi_and_common_secrets_rejected(self):
        for text in ("\x1b[2J", "\x1b]8;;https://evil.example\x07", "two\nlines", "\u202eabc", "x\u200b",
                     "Bearer private", "sk-1234567890abcdef", "ghp_abcdefghijklmn", "password=private"):
            for field in viewer.TEXT_FIELDS:
                with self.subTest(field=field, text=repr(text)):
                    self.write(snapshot(**{field:text}))
                    with self.assertRaises(viewer.InvalidSnapshot):viewer.load_snapshot(self.path)

    def test_cli_invalid_input_emits_only_fixed_code_not_payload_or_path(self):
        self.write(snapshot(blocker="\x1b]52;c;PRIVATE\x07"))
        code, out = self.invoke(["--snapshot", str(self.path)])
        self.assertEqual(code, 2)
        self.assertIn("unsafe_text", out)
        self.assertNotIn("PRIVATE", out)
        self.assertNotIn("\x1b", out)
        self.assertNotIn(str(self.path), out)

    def test_link_allowlist_no_credentials_queries_encoded_escapes_or_local_files(self):
        for link in ("file:///etc/passwd", "javascript:alert(1)", "http://github.com/a", "https://evil.example/a",
                     "https://user:secret@github.com/a", "https://github.com/a?token=private",
                     "https://github.com/a%1b", "https://github.com:443/a", "https://github.com/a#private",
                     "https://github.com/\x1b[2J"):
            with self.subTest(link=link), self.assertRaises(viewer.InvalidSnapshot):
                viewer.normalize(snapshot(links=[link]))
        with self.assertRaises(viewer.InvalidSnapshot):viewer.normalize(snapshot(links=["https://github.com/a"]*9))
        self.assertEqual(viewer.normalize(snapshot(links=["https://github.com/a#L2"]))["links"],
                         ("https://github.com/a#L2",))

    def test_counts_types_limits_and_untrusted_phase_rejected(self):
        for tests in ({"pass": True}, {"fail": -1}, {"skip": 10000001}, {"pass": "77"},
                      {"raw_transcript": "private"}, []):
            with self.assertRaises(viewer.InvalidSnapshot):viewer.normalize(snapshot(tests=tests))
        for phase in ("live on VPS", ["running"], "\x1b[2J"):
            with self.assertRaises(viewer.InvalidSnapshot):viewer.normalize(snapshot(phase=phase))

    def test_aware_timestamp_required(self):
        for timestamp in ("2026-10-16T10:00:00", "not a date", 123, "2026-99-99", "0001-01-01T00:00:00Z"):
            with self.assertRaises(viewer.InvalidSnapshot):viewer.normalize(snapshot(timestamp=timestamp))

    def test_once_default_and_explicit_once_do_not_sleep_or_start_effects(self):
        self.write()
        for mode in ([], ["--once"]):
            with patch.object(viewer.time, "sleep", side_effect=AssertionError("must not poll")), \
                 patch.object(subprocess, "run", side_effect=AssertionError("no subprocess")), \
                 patch.object(socket, "socket", side_effect=AssertionError("no socket")), \
                 patch.object(Path, "write_text", side_effect=AssertionError("no write")), \
                 patch.object(viewer.os, "system", side_effect=AssertionError("no effects")):
                code, out = self.invoke(["--snapshot", str(self.path)] + mode)
            self.assertEqual(code, 0)
            self.assertIn("SNAPSHOT PASIVO", out)

    def test_help_reads_no_files_and_starts_nothing(self):
        with patch.object(viewer, "load_snapshot", side_effect=AssertionError("help read source")), \
             contextlib.redirect_stdout(io.StringIO()), self.assertRaises(SystemExit) as raised:
            viewer.main(["--help"])
        self.assertEqual(raised.exception.code, 0)

    def test_unknown_cli_arg_is_not_reflected_with_control_bytes(self):
        err = io.StringIO()
        with contextlib.redirect_stderr(err), self.assertRaises(SystemExit):
            viewer.main(["--bad\x1b[2JPRIVATE"])
        self.assertNotIn("PRIVATE", err.getvalue())
        self.assertNotIn("\x1b", err.getvalue())

    def test_watch_opt_in_refresh_intervals_and_clean_interrupt(self):
        for phase, interval in (("running",30), ("qa",30), ("idle",120), ("completed",120), ("UNKNOWN",120)):
            self.write(snapshot(phase=phase))
            with patch.object(viewer.time, "sleep", side_effect=KeyboardInterrupt) as sleep:
                code, out = self.invoke(["--snapshot",str(self.path),"--watch"])
            sleep.assert_called_once_with(interval)
            self.assertEqual(code, 0)
            self.assertIn("Visor cerrado", out)

    def test_auth_config_files_and_symlink_or_non_regular_sources_rejected_before_open(self):
        for name in ("auth.json", "credentials.json", "config.json", "snapshot.txt"):
            with patch.object(viewer.os, "open", side_effect=AssertionError("must not read credential source")):
                with self.assertRaises(viewer.InvalidSnapshot):viewer.load_snapshot(self.path.parent/name)
        self.write()
        link = self.path.parent / "link.json"
        link.symlink_to(self.path)
        with self.assertRaises(viewer.InvalidSnapshot):viewer.load_snapshot(link)
        folder = self.path.parent / "directory.json"
        folder.mkdir()
        with self.assertRaises(viewer.InvalidSnapshot):viewer.load_snapshot(folder)

    def test_legacy_receipts_project_only_safe_metadata(self):
        self.write({"state":"completed", "observed_init_model":"fixture-model",
                    "raw_response":"PRIVATE", "tools_observed":[{"input":"PRIVATE"}],
                    "tests":{"raw":"PRIVATE"}})
        out = viewer.render(viewer.load_snapshot(self.path,legacy=True),now=NOW)
        self.assertIn("legacy receipt",out)
        self.assertIn("fixture-model",out)
        self.assertNotIn("PRIVATE",out)
        self.assertIn("UNKNOWN/UNKNOWN/UNKNOWN",out)
        self.write({"phase":"unknown", "state":[]})
        with self.assertRaises(viewer.InvalidSnapshot):viewer.load_snapshot(self.path,legacy=True)

    def test_missing_file_returns_sanitized_error_without_create(self):
        self.assertFalse(self.path.exists())
        code,out=self.invoke(["--snapshot",str(self.path)])
        self.assertEqual(code,2)
        self.assertFalse(self.path.exists())
        self.assertNotIn(str(self.path),out)


if __name__ == "__main__":
    unittest.main()
