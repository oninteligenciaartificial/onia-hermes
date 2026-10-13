"""Deterministic tests only: fake JSONL and local Python child processes, no model."""

import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import time
import unittest
from unittest.mock import patch

from codex_cli_experimental import (
    EXPECTED_ANSWER, ExperimentBlocked, Plan, _kill_process_tree, parse_events,
    record_experimental_attempt, run_claimed_process, run_process,
)
from sqlite_pilot import SQLiteQueue, TaskSpec


THREAD = "01a136d9-7153-7b52-ab7b-be24d33112cb"


def assert_process_terminated(testcase, pid: int):
    if os.name != "nt":
        deadline = time.monotonic() + 2
        while time.monotonic() < deadline:
            stat = Path(f"/proc/{pid}/stat")
            if not stat.exists() or stat.read_text().split(") ", 1)[1][0] == "Z":
                return
            time.sleep(0.05)
        testcase.fail(f"owned child {pid} remained active after cancellation")
        return
    import ctypes
    from ctypes import wintypes
    kernel = ctypes.WinDLL("kernel32", use_last_error=True)
    kernel.OpenProcess.argtypes = (wintypes.DWORD, wintypes.BOOL, wintypes.DWORD)
    kernel.OpenProcess.restype = wintypes.HANDLE
    kernel.WaitForSingleObject.argtypes = (wintypes.HANDLE, wintypes.DWORD)
    kernel.WaitForSingleObject.restype = wintypes.DWORD
    kernel.CloseHandle.argtypes = (wintypes.HANDLE,)
    handle = kernel.OpenProcess(0x00100000, False, pid)  # SYNCHRONIZE
    if not handle:
        testcase.assertEqual(ctypes.get_last_error(), 87)  # process already gone
        return
    try:
        testcase.assertEqual(kernel.WaitForSingleObject(handle, 1000), 0)
    finally:
        kernel.CloseHandle(handle)


def success_lines():
    return [json.dumps(event) + "\n" for event in (
        {"type": "thread.started", "thread_id": THREAD},
        {"type": "turn.started"},
        {"type": "item.completed", "item": {"type": "agent_message", "text": EXPECTED_ANSWER}},
        {"type": "turn.completed", "usage": {"input_tokens": 47016, "output_tokens": 26}},
    )]


class CodexCliExperimentalTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        root = Path(self.tmp.name)
        self.cwd = root / "synthetic-cwd"
        self.sqlite_home = root / "sqlite"
        self.log_dir = root / "logs"
        for path in (self.cwd, self.sqlite_home, self.log_dir):
            path.mkdir()
        self.plan = Plan(self.cwd, self.sqlite_home, self.log_dir)

    def tearDown(self):
        self.tmp.cleanup()

    def test_command_is_new_session_and_separates_sqlite_without_copying_auth(self):
        argv = self.plan.argv()
        self.assertEqual(argv[:2], ("codex", "exec"))
        self.assertIn("--ignore-user-config", argv)
        self.assertIn("read-only", argv)
        self.assertNotIn("resume", argv)
        self.assertNotIn("--last", argv)
        self.assertNotIn("--dangerously-bypass-approvals-and-sandbox", argv)
        self.assertIn(f"sqlite_home={json.dumps(str(self.sqlite_home))}", argv)
        self.assertIn(f"log_dir={json.dumps(str(self.log_dir))}", argv)
        (self.cwd / "unexpected").write_text("x")
        with self.assertRaises(ExperimentBlocked):
            self.plan.argv()

    def test_receipt_keeps_usage_cumulative_semantics_and_unknown_context(self):
        receipt = parse_events(success_lines())
        self.assertEqual(receipt["thread_id"], THREAD)
        self.assertTrue(receipt["answer_exact_match"])
        self.assertEqual(receipt["usage_reported"]["input_tokens"], 47016)
        self.assertEqual(receipt["active_context_used"], "UNKNOWN")
        self.assertEqual(receipt["observed_served_model"], "UNKNOWN")
        with self.assertRaises(ExperimentBlocked):
            parse_events(success_lines(), expected_thread_id="01a136d9-7153-7b52-ab7b-be24d33112cc")

    def test_malformed_unknown_tool_and_partial_json_fail_closed(self):
        bad_events = (
            ["{bad\n"],
            success_lines()[:2] + [json.dumps({"type": "mystery"}) + "\n"],
            success_lines()[:2] + [json.dumps({"type": "item.started", "item": {"type": "command_execution"}}) + "\n"],
            success_lines()[:2] + ['{"type":"turn.completed"'],
            success_lines()[:1] + success_lines()[2:],
            success_lines()[:2] + success_lines()[1:],
            [success_lines()[2], *success_lines()[:2], *success_lines()[3:]],
            success_lines()[:2] + [json.dumps({"type": "item.completed", "item": {"type": "agent_message", "text": "WRONG"}}) + "\n", success_lines()[3]],
        )
        for lines in bad_events:
            with self.subTest(lines=lines), self.assertRaises(ExperimentBlocked):
                parse_events(lines)

    def test_core_records_ambiguous_effect_and_refuses_replay(self):
        db = Path(self.tmp.name) / "queue.sqlite3"
        queue = SQLiteQueue(db)
        queue.enqueue(TaskSpec("task-a", "worker-a", "public/synthetic", "codex/test",
                               "a" * 40, "synthetic-1", "b" * 64), now=100)
        claim = queue.claim("worker-a", "owner-a", now=101, lease_seconds=20).claim
        result = record_experimental_attempt(queue, claim, success_lines(), now=102)
        self.assertEqual(result["core_status"], "needs_reconcile")
        self.assertTrue(result["receipt"]["answer_exact_match"])
        self.assertEqual(queue.claim("worker-a", "owner-b", now=103, lease_seconds=20).status,
                         "needs_reconcile")
        with self.assertRaises(Exception):
            record_experimental_attempt(queue, claim, success_lines(), now=104)

    def _run_fake_script(self, source: str, timeout: int = 2):
        script = Path(self.tmp.name) / "fake_cli.py"
        script.write_text(source, encoding="utf-8")
        with patch.object(Plan, "argv", return_value=(sys.executable, str(script))):
            return run_process(Plan(self.cwd, self.sqlite_home, self.log_dir,
                                    timeout_seconds=timeout), "sergio:synthetic-test", sys.executable)

    def test_local_process_watchdog_cancels_only_own_child(self):
        pid_file = Path(self.tmp.name) / "timeout-child.pid"
        source = (
            "import os,subprocess,sys,tempfile,time\n"
            "child=subprocess.Popen([sys.executable,'-c','import time;time.sleep(30)'], "
            "stdout=sys.stdout, stderr=subprocess.DEVNULL, cwd=tempfile.gettempdir())\n"
            f"open({str(pid_file)!r},'w').write(str(child.pid))\n"
            "time.sleep(5)\n"
        )
        start = time.monotonic()
        with self.assertRaises(ExperimentBlocked):
            self._run_fake_script(source, timeout=1)
        self.assertLess(time.monotonic() - start, 4)
        self.assertTrue(pid_file.exists())
        assert_process_terminated(self, int(pid_file.read_text()))

    def test_root_exit_with_descendant_holding_pipe_fails_promptly(self):
        pid_file = Path(self.tmp.name) / "early-exit-child.pid"
        source = (
            "import os,subprocess,sys,tempfile\n"
            "child=subprocess.Popen([sys.executable,'-c','import time;time.sleep(30)'], "
            "stdout=sys.stdout, stderr=subprocess.DEVNULL, cwd=tempfile.gettempdir())\n"
            f"open({str(pid_file)!r},'w').write(str(child.pid))\n"
        )
        start = time.monotonic()
        with self.assertRaises(ExperimentBlocked):
            self._run_fake_script(source, timeout=3)
        self.assertLess(time.monotonic() - start, 2)
        self.assertTrue(pid_file.exists())
        assert_process_terminated(self, int(pid_file.read_text()))

    def test_tool_event_cancels_canary_without_terminating_unrelated_process(self):
        pid_file = Path(self.tmp.name) / "tool-child.pid"
        witness = subprocess.Popen((sys.executable, "-c", "import time;time.sleep(1)"),
                                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        source = (
            "import json,subprocess,sys,tempfile,time\n"
            "child=subprocess.Popen([sys.executable,'-c','import time;time.sleep(30)'], "
            "stdout=sys.stdout, stderr=subprocess.DEVNULL, cwd=tempfile.gettempdir())\n"
            f"open({str(pid_file)!r},'w').write(str(child.pid))\n"
            f"print(json.dumps({{'type':'thread.started','thread_id':'{THREAD}'}}),flush=True)\n"
            "print(json.dumps({'type':'item.started','item':{'type':'command_execution'}}),flush=True)\n"
            "time.sleep(5)\n"
        )
        try:
            start = time.monotonic()
            with self.assertRaises(ExperimentBlocked):
                self._run_fake_script(source, timeout=3)
            self.assertLess(time.monotonic() - start, 2)
            self.assertTrue(pid_file.exists())
            assert_process_terminated(self, int(pid_file.read_text()))
            self.assertEqual(witness.wait(timeout=2), 0)
        finally:
            if witness.poll() is None:
                witness.kill()
                witness.wait(timeout=2)

    def test_launch_needs_specific_reference_even_with_synthetic_plan(self):
        with self.assertRaises(ExperimentBlocked):
            run_process(self.plan, "", sys.executable)

    def test_success_closes_private_group_and_own_descendant(self):
        pid_file = Path(self.tmp.name) / "success-child.pid"
        source = (
            "import subprocess,sys,tempfile\n"
            "child=subprocess.Popen([sys.executable,'-c','import time;time.sleep(30)'], "
            "stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, cwd=tempfile.gettempdir())\n"
            f"open({str(pid_file)!r},'w').write(str(child.pid))\n"
            f"sys.stdout.writelines({success_lines()!r})\n"
            "sys.stdout.flush()\n"
        )
        result = self._run_fake_script(source, timeout=3)
        self.assertTrue(result["answer_exact_match"])
        assert_process_terminated(self, int(pid_file.read_text()))

    def test_exited_root_pid_is_never_sent_to_taskkill(self):
        root = subprocess.Popen((sys.executable, "-c", "pass"),
                                stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        self.assertEqual(root.wait(timeout=2), 0)
        with patch("codex_cli_experimental.subprocess.run") as taskkill:
            _kill_process_tree(root)
        taskkill.assert_not_called()

    @unittest.skipUnless(os.name == "nt", "Windows Job Object test")
    def test_job_assignment_failure_never_runs_suspended_child(self):
        import windows_job
        marker = Path(self.tmp.name) / "should-not-run.txt"
        script = Path(self.tmp.name) / "suspended.py"
        script.write_text(f"open({str(marker)!r},'w').write('ran')\n", encoding="utf-8")
        with patch("windows_job._assign", side_effect=OSError("simulated assignment failure")):
            with self.assertRaises(OSError):
                windows_job.launch((sys.executable, str(script)), self.cwd)
        self.assertFalse(marker.exists())

    def test_claimed_bridge_checkpoints_then_blocks_replay_even_on_success(self):
        now = int(time.time())
        queue = SQLiteQueue(Path(self.tmp.name) / "bridge.sqlite3")
        spec = TaskSpec("task-b", "worker-b", "public/synthetic", "codex/test",
                        "a" * 40, "synthetic-2", "b" * 64)
        queue.enqueue(spec, now)
        claim = queue.claim("worker-b", "owner-b", now + 1, 90).claim
        checkpoint = {"schema": 1, "repo": spec.repo, "ref": spec.ref,
                      "sha": spec.sha, "contract_id": spec.contract_id,
                      "input_sha": spec.input_sha, "step": "synthetic-cli",
                      "status": "running", "evidence": {"scope": "public synthetic"}}
        with patch("codex_cli_experimental.run_process", return_value=parse_events(success_lines())) as fake:
            result = run_claimed_process(queue, claim, checkpoint, self.plan,
                                         "sergio:reviewed-synthetic", now + 2, sys.executable)
        fake.assert_called_once()
        self.assertEqual(result["core_status"], "needs_reconcile")
        self.assertEqual(len(result["checkpoint_digest"]), 64)
        self.assertEqual(queue.claim("worker-b", "owner-c", now + 3, 90).status,
                         "needs_reconcile")


if __name__ == "__main__":
    unittest.main()
