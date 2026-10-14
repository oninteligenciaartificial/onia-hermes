import importlib.util
import json
import sys
import tempfile
import types
import unittest
from pathlib import Path
from unittest import mock


RUNNER = Path(__file__).with_name("browser-runner.py")
stub = types.ModuleType("run_result")
stub.success_summary = lambda *args, **kwargs: {}
sys.modules.setdefault("run_result", stub)
spec = importlib.util.spec_from_file_location("browser_runner_diagnostic_v2", RUNNER)
runner = importlib.util.module_from_spec(spec)
spec.loader.exec_module(runner)


class DiagnosticReceiptTests(unittest.TestCase):
    def test_receipt_is_allowlisted_and_durable_without_raw_output(self):
        with tempfile.TemporaryDirectory() as directory:
            runner.CONTROL_ROOT = Path(directory)
            runner._DIAGNOSTIC_CONTROL_ROOT = None
            runner._DIAGNOSTIC_JOURNAL_FAILED = False
            runner.diagnostic_stage("docker_run_invocation", "consumed", "needs_reconcile")
            runner.diagnostic_event("docker_run_invocation", "blocked_runtime_error", stdout_bytes=37,
                                   reservation_state="consumed", reconciliation_state="needs_reconcile")
            path = Path(directory) / "browser-diagnostic-v2.jsonl"
            rows = [json.loads(line) for line in path.read_text(encoding="ascii").splitlines()]
            self.assertEqual([row["stage"] for row in rows], ["docker_run_invocation"] * 2)
            self.assertEqual(rows[0]["code"], "stage_started")
            self.assertFalse(rows[1]["stderr_saved"])
            self.assertEqual(rows[1]["stdout_bytes"], 37)
            self.assertEqual(rows[1]["reconciliation_state"], "needs_reconcile")
            self.assertFalse(rows[1]["retry_allowed"])
            self.assertNotIn("raw", path.read_text(encoding="ascii").lower())

    def test_main_sanitizes_exception_and_does_not_retry(self):
        secret = "nonce-secret-marker"
        calls = []

        def fail_once(_nonce):
            calls.append(1)
            raise RuntimeError(secret)

        with tempfile.TemporaryDirectory() as directory:
            runner.CONTROL_ROOT = Path(directory)
            runner._DIAGNOSTIC_CONTROL_ROOT = Path(directory)
            runner._DIAGNOSTIC_STAGE = "docker_run_invocation"
            runner._DIAGNOSTIC_RESERVATION = "consumed"
            runner._DIAGNOSTIC_RECONCILIATION = "needs_reconcile"
            with mock.patch.object(runner, "execute", side_effect=fail_once), \
                 mock.patch.object(runner, "sys") as mocked_sys:
                mocked_sys.stderr = tempfile.TemporaryFile(mode="w+t")
                code = runner.main(["--execute-offline"])
                mocked_sys.stderr.seek(0)
                stderr = mocked_sys.stderr.read()
                mocked_sys.stderr.close()
            receipt = Path(directory, "browser-diagnostic-v2.jsonl").read_text(encoding="ascii")
            self.assertEqual(code, 2)
            self.assertEqual(len(calls), 1)
            self.assertNotIn(secret, stderr)
            self.assertNotIn(secret, receipt)
            self.assertIn('"retry_allowed":false', receipt)
            self.assertIn('"reconciliation_state":"needs_reconcile"', receipt)

    def test_journal_initialization_failure_precedes_reservation_and_docker(self):
        reserve_calls = []
        docker_calls = []
        custom_control = Path(tempfile.gettempdir()) / "diagnostic-control-parameter-test"
        with mock.patch.object(runner, "diagnostic_initialize", side_effect=OSError("private marker")), \
             mock.patch.object(runner, "reserve_nonce", side_effect=lambda *a, **k: reserve_calls.append(1)), \
             mock.patch.object(runner, "_docker_call", side_effect=lambda *a, **k: docker_calls.append(1)):
            with self.assertRaises(OSError):
                runner.execute("unused", control_root=custom_control)
        self.assertEqual(reserve_calls, [])
        self.assertEqual(docker_calls, [])

    def test_journal_initialization_uses_explicit_control_root(self):
        with tempfile.TemporaryDirectory() as default_dir, tempfile.TemporaryDirectory() as explicit_dir:
            runner.CONTROL_ROOT = Path(default_dir)
            runner.diagnostic_initialize(Path(explicit_dir))
            self.assertTrue(Path(explicit_dir, "browser-diagnostic-v2.jsonl").is_file())
            self.assertFalse(Path(default_dir, "browser-diagnostic-v2.jsonl").exists())

    def test_post_run_journal_failure_is_hold_and_never_retry(self):
        with tempfile.TemporaryDirectory() as directory:
            runner.CONTROL_ROOT = Path(directory)
            runner._DIAGNOSTIC_CONTROL_ROOT = Path(directory)
            runner._DIAGNOSTIC_STAGE = "docker_run_invocation"
            runner._DIAGNOSTIC_RESERVATION = "consumed"
            runner._DIAGNOSTIC_RECONCILIATION = "needs_reconcile"
            runner._DIAGNOSTIC_JOURNAL_FAILED = True
            with mock.patch.object(runner, "execute", side_effect=RuntimeError("private marker")) as execute_mock, \
                 mock.patch.object(runner, "sys") as mocked_sys:
                mocked_sys.stderr = tempfile.TemporaryFile(mode="w+t")
                self.assertEqual(runner.main(["--execute-offline"]), 2)
                mocked_sys.stderr.seek(0)
                stderr = mocked_sys.stderr.read()
                mocked_sys.stderr.close()
            self.assertEqual(execute_mock.call_count, 1)
            receipt = Path(directory, "browser-diagnostic-v2.jsonl").read_text(encoding="ascii")
            self.assertIn("blocked_journal_failure", stderr)
            self.assertIn('"reconciliation_state":"needs_reconcile"', receipt)
            self.assertIn('"retry_allowed":false', receipt)
            self.assertNotIn("private marker", receipt)


if __name__ == "__main__":
    unittest.main()
