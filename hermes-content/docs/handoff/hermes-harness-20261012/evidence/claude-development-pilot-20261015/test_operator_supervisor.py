"""Offline operator-glue tests: no provider executable is launched."""
import contextlib
import io
import json
import tempfile
import unittest
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import Mock, patch
import operator_supervisor as operator


class OperatorTests(unittest.TestCase):
    def invoke(self, module, *, execute=True):
        with tempfile.TemporaryDirectory() as directory:
            folder = Path(directory)
            packet = folder / "packet.json"
            packet.write_text(json.dumps({"task_id": "offline", "workspace": directory,
                "argv": [r"C:\Users\PC\AppData\Roaming\npm\node_modules\@anthropic-ai\claude-code\bin\claude.exe"]}))
            receipt = folder / "receipt.json"
            argv = ["operator_supervisor", "--packet", str(packet), "--receipt", str(receipt)]
            if execute:
                argv.append("--execute")
            with patch.object(operator.sys, "argv", argv), \
                    patch.object(operator.importlib.util, "spec_from_file_location") as spec, \
                    patch.object(operator.importlib.util, "module_from_spec", return_value=module), \
                    contextlib.redirect_stdout(io.StringIO()):
                operator.main()
            return json.loads(receipt.with_suffix(".result.json").read_text()) if receipt.exists() else None

    def test_dry_run_never_loads_or_launches_provider(self):
        launch = Mock()
        self.assertIsNone(self.invoke(SimpleNamespace(launch=launch), execute=False))
        launch.assert_not_called()

    def test_launch_failure_persists_sanitized_reconciliation(self):
        result = self.invoke(SimpleNamespace(launch=Mock(side_effect=OSError("private error"))))
        self.assertEqual(result["state"], "needs_reconcile")
        self.assertFalse(result["windows_job_closed"])
        self.assertNotIn("private error", json.dumps(result))

    def test_success_closes_job_reaps_parent_and_pipes(self):
        process = SimpleNamespace(returncode=0, stdout=io.StringIO(), stderr=io.StringIO(),
                                  communicate=Mock(return_value=('{"state":"process_finished","provider_exit":0}', "")),
                                  wait=Mock(return_value=0))
        job = SimpleNamespace(close=Mock())
        result = self.invoke(SimpleNamespace(launch=Mock(return_value=(process, job))))
        job.close.assert_called_once()
        process.wait.assert_called_once_with(timeout=2)
        self.assertTrue(result["parent_reaped"])
        self.assertTrue(process.stdout.closed)
        self.assertTrue(process.stderr.closed)


if __name__ == "__main__":
    unittest.main()
