import io
import json
import tempfile
import unittest
import os
import subprocess
import sys
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import Mock

import claude_task as task


class ContractTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name) / "repo"
        self.root.mkdir()
        self.policy = self.root / ".claude/skills/review/SKILL.md"
        self.policy.parent.mkdir(parents=True)
        self.policy.write_text("Text review only. Do not execute anything.", encoding="utf-8")
        self.store = Path(self.tmp.name) / "state"
        self.contract = {"schema_version": 1, "task_id": "task-1", "attempt_id": "attempt-1",
                         "operation": "review_text", "goal": "review", "proof": "list findings", "stop": "one response",
                         "input": "untrusted source", "instructions": [{"path": ".claude/skills/review/SKILL.md", "sha256": task.digest(self.policy.read_bytes())}]}
        self.adapter = SimpleNamespace(MODEL="observed-test-model", receipt=lambda x: x,
                                       run_once=Mock(return_value={"state": "ok", "error": None, "response": "checked"}))

    def run_task(self, **kwargs):
        return task.execute(self.contract, self.root, self.store, adapter=self.adapter, executable="claude-test", check_cli=lambda _: {"ok": True}, **kwargs)

    def test_unverified_cli_blocks_before_reserve_or_provider(self):
        result = task.execute(self.contract, self.root, self.store, adapter=self.adapter, executable="old-claude", perform=True,
                              check_cli=lambda _: {"ok": False, "error": "cli_version_unverified"})
        self.assertEqual(result["state"], "preflight_blocked")
        self.assertTrue(result["fallback_eligible"])
        self.assertFalse(self.store.exists())
        self.adapter.run_once.assert_not_called()

    def test_dry_run_has_no_effect_or_provider(self):
        self.assertEqual(self.run_task()["state"], "dry_run")
        self.assertFalse(self.store.exists())
        self.adapter.run_once.assert_not_called()

    def test_hash_mismatch_stops_before_provider(self):
        self.policy.write_text("changed")
        with self.assertRaisesRegex(ValueError, "hash_mismatch"):
            self.run_task(perform=True)
        self.adapter.run_once.assert_not_called()

    def test_path_traversal_rejected(self):
        self.contract["instructions"][0]["path"] = "../outside.md"
        with self.assertRaisesRegex(ValueError, "outside_root"):
            self.run_task()

    def test_nonpolicy_markdown_rejected(self):
        self.contract["instructions"][0]["path"] = "private.md"
        (self.root / "private.md").write_text("private")
        with self.assertRaisesRegex(ValueError, "instruction_not_policy"):
            self.run_task()

    def test_dispatch_reserved_before_provider_and_restart_does_not_replay(self):
        def provider(*args, **kwargs):
            self.assertEqual(task.status(self.store, "task-1")["state"], "needs_reconcile")
            return {"state": "ok", "error": None}
        self.adapter.run_once.side_effect = provider
        self.assertEqual(self.run_task(perform=True)["state"], "ok")
        self.contract["attempt_id"] = "attempt-2"
        self.assertEqual(self.run_task(perform=True)["error"], "task_already_reserved")
        self.assertEqual(self.adapter.run_once.call_count, 1)

    def test_timeout_remains_consumed(self):
        self.adapter.run_once.return_value = {"state": "error", "error": "timeout"}
        result = self.run_task(perform=True)
        self.assertEqual(result["state"], "needs_reconcile")
        self.assertFalse(result["fallback_eligible"])
        self.assertFalse(task.status(self.store, "task-1")["replay_allowed"])

    def test_auth_failure_cannot_fallback(self):
        self.adapter.run_once.return_value = {"state": "error", "error": "auth_expired"}
        self.assertFalse(self.run_task(perform=True)["fallback_eligible"])

    def test_reserved_without_result_is_recoverable_unknown(self):
        folder = self.store / "task-1"
        folder.mkdir(parents=True)
        task.write_once(folder / "dispatch.json", {"task_id": "task-1"})
        self.assertEqual(task.status(self.store, "task-1")["state"], "needs_reconcile")

    def test_size_limit_applies_after_assembly(self):
        self.contract["input"] = "x" * task.MAX_BYTES
        with self.assertRaisesRegex(ValueError, "assembled_input_too_large"):
            self.run_task()

    def test_effect_operation_cannot_run(self):
        self.contract["operation"] = "terminal"
        with self.assertRaisesRegex(ValueError, "unsupported_operation"):
            self.run_task()

    def test_prompt_preserves_policy_provenance_and_boundary(self):
        prompt, provenance = task.build_prompt(self.contract, self.root)
        payload = json.loads(prompt)
        self.assertEqual(payload["instructions"][0]["text"], self.policy.read_text())
        self.assertEqual(provenance, self.contract["instructions"])
        self.assertIn("No tools", payload["boundary"])

    def test_real_cli_entrypoint_dry_run_loads_pinned_adapter(self):
        adapter = Path(os.environ.get("ONIA_TEST_ADAPTER_PATH", str(task.ADAPTER)))
        self.assertTrue(adapter.is_file(), "Set ONIA_TEST_ADAPTER_PATH during isolated prep; final package uses sibling canonical adapter")
        proc = subprocess.run([sys.executable, task.__file__, "--repo", str(self.root), "--store", str(self.store), "--adapter", str(adapter)],
                              input=json.dumps(self.contract).encode(), capture_output=True, timeout=10)
        self.assertEqual(proc.returncode, 0, proc.stderr)
        self.assertEqual(json.loads(proc.stdout)["state"], "dry_run")
        self.assertFalse(self.store.exists())


if __name__ == "__main__":
    unittest.main()
