"""Mock transport only; these tests never invoke the installed Codex CLI."""
from pathlib import Path
from dataclasses import replace
import hashlib
import json
import subprocess
import unittest
from unittest.mock import patch

from native_cloud_cli import CloudTaskPlan, NativeCloudCLI
import test_native_receipt_bridge as fixtures
from test_native_receipt_bridge import OP, REMOTE


class NativeTransportTests(unittest.TestCase):
    observation = fixtures.NativeReceiptTests.observation

    def reserve(self):
        return self.bridge.reserve(self.claim, OP, "nonce-1", "test:authorization", 102,
                                  self.plan.request()[2])

    def setUp(self):
        fixtures.NativeReceiptTests.setUp(self)
        root = Path(self.area.name)
        (root / ".git").mkdir()
        binary = root / "codex.exe"
        binary.touch()
        prompt = root / "public-task.md"
        prompt.write_text("Read the public README and return a receipt; no writes.", encoding="utf-8")
        self.plan = CloudTaskPlan(binary, root, "a" * 32, "codex/test", prompt,
                                  hashlib.sha256(prompt.read_bytes()).hexdigest(),
                                  hashlib.sha256(binary.read_bytes()).hexdigest(), "a" * 40)
        self.transport = NativeCloudCLI(self.bridge)

    @patch("native_cloud_cli.subprocess.run")
    def test_transport_calls_exec_once_structured_and_binds_returned_id(self, run):
        self.reserve()
        run.return_value = subprocess.CompletedProcess([], 0, "https://chatgpt.com/remote/" + REMOTE, "")
        result = self.transport.submit(OP, self.plan)
        self.assertEqual(result["remote_id"], REMOTE)
        self.assertEqual(run.call_args.args[0][-4:], ["--attempts", "1", "--branch", "codex/test"])
        self.assertFalse(run.call_args.kwargs["shell"])
        self.assertIn(OP, run.call_args.kwargs["input"])
        wire_prompt = run.call_args.kwargs["input"]
        checkout = json.loads(wire_prompt.split("\nONIA_CHECKOUT_CONTRACT\n", 1)[1].splitlines()[0])
        self.assertEqual(checkout, {"expected_head": self.plan.expected_remote_head,
                                    "expected_repo": "onia-hermes", "requested_ref": "codex/test"})
        self.assertEqual(result["wire_prompt_sha256"], hashlib.sha256(wire_prompt.encode("utf-8")).hexdigest())
        with self.assertRaises(RuntimeError):
            self.transport.submit(OP, self.plan)
        run.assert_called_once()

    @patch("native_cloud_cli.subprocess.run")
    def test_transport_timeout_retains_slot_without_replay(self, run):
        self.reserve()
        run.side_effect = subprocess.TimeoutExpired("mock", 45)
        self.assertEqual(self.transport.submit(OP, self.plan)["state"], "needs_reconcile")
        self.assertEqual(self.bridge.read(OP)["state"], "dispatching")
        with self.assertRaises(RuntimeError):
            self.transport.submit(OP, self.plan)
        run.assert_called_once()

    @patch("native_cloud_cli.subprocess.run")
    def test_transport_stop_epoch_prevents_call(self, run):
        self.reserve()
        with self.queue._connection() as conn:
            conn.execute("UPDATE controller_guard_state SET epoch=epoch+1")
        with self.assertRaises(RuntimeError):
            self.transport.submit(OP, self.plan)
        run.assert_not_called()

    @patch("native_cloud_cli.subprocess.run")
    def test_transport_prompt_change_fails_before_consuming_slot(self, run):
        self.reserve()
        self.plan.public_prompt_file.write_text("changed", encoding="utf-8")
        with self.assertRaises(ValueError):
            self.transport.submit(OP, self.plan)
        self.assertEqual(self.bridge.read(OP)["state"], "reserved")
        run.assert_not_called()

    @patch("native_cloud_cli.subprocess.run")
    def test_transport_ready_is_observation_not_success(self, run):
        self.reserve()
        self.bridge.ingest(self.observation(), 103)
        run.return_value = subprocess.CompletedProcess([], 0, '{"tasks":[{"id":"' + REMOTE + '","status":"READY"}]}', "")
        result = self.transport.status(OP, self.plan.executable)
        self.assertEqual(result["provider_status"], "READY")
        self.assertEqual(result["state"], "needs_reconcile")
        self.assertIsNone(self.queue.read_result("task"))

    @patch("native_cloud_cli.subprocess.run")
    def test_transport_ambiguous_response_never_binds(self, run):
        self.reserve()
        run.return_value = subprocess.CompletedProcess([], 0, "no definitive task identifier", "")
        self.assertEqual(self.transport.submit(OP, self.plan)["state"], "needs_reconcile")
        self.assertIsNone(self.bridge.read(OP)["remote_id"])

    @patch("native_cloud_cli.subprocess.run")
    def test_replacement_plan_cannot_use_reviewed_reservation(self, run):
        self.reserve()
        alternative_prompt = self.plan.cwd / "alternative.md"
        alternative_prompt.write_text("Different public task", encoding="utf-8")
        other_binary = self.plan.cwd / "other.exe"
        other_binary.write_bytes(b"different binary")
        other_root = self.plan.cwd / "other-checkout"
        other_root.mkdir()
        (other_root / ".git").mkdir()
        other_prompt = other_root / "public-task.md"
        other_prompt.write_bytes(self.plan.public_prompt_file.read_bytes())
        alternatives = [replace(self.plan, environment_id="b" * 32),
                        replace(self.plan, branch="codex/other"),
                        replace(self.plan, expected_remote_head="b" * 40),
                        replace(self.plan, public_prompt_file=alternative_prompt,
                                prompt_sha256=hashlib.sha256(alternative_prompt.read_bytes()).hexdigest()),
                        replace(self.plan, executable=other_binary,
                                executable_sha256=hashlib.sha256(other_binary.read_bytes()).hexdigest()),
                        replace(self.plan, cwd=other_root, public_prompt_file=other_prompt)]
        for plan in alternatives:
            with self.subTest(plan=plan), self.assertRaises(RuntimeError):
                self.transport.submit(OP, plan)
            self.assertEqual(self.bridge.read(OP)["state"], "reserved")
        run.assert_not_called()

    @patch("native_cloud_cli.subprocess.run")
    def test_executable_mutation_fails_before_transport(self, run):
        self.reserve()
        self.plan.executable.write_bytes(b"mutated executable")
        with self.assertRaises(ValueError):
            self.transport.submit(OP, self.plan)
        self.assertEqual(self.bridge.read(OP)["state"], "reserved")
        run.assert_not_called()

    def test_shell_wrapper_forbidden(self):
        wrapper = self.plan.cwd / "codex.ps1"
        wrapper.touch()
        with self.assertRaises(ValueError):
            replace(self.plan, executable=wrapper).request()

    def test_generated_metadata_does_not_rewrite_versioned_template(self):
        original = self.plan.public_prompt_file.read_bytes()
        _, first_wire, first_contract = self.plan.request()
        _, next_wire, next_contract = replace(self.plan, expected_remote_head="b" * 40).request()
        self.assertEqual(self.plan.public_prompt_file.read_bytes(), original)
        self.assertIn('"expected_head":"' + "a" * 40 + '"', first_wire)
        self.assertIn('"expected_head":"' + "b" * 40 + '"', next_wire)
        self.assertNotEqual(first_contract, next_contract)

    @patch("native_cloud_cli.subprocess.run")
    def test_lowercase_status_schema_and_invalid_types(self, run):
        self.reserve()
        self.bridge.ingest(self.observation("submitted"), 103)
        for index, (status, expected) in enumerate((("pending", "submitted"), ("running", "running"), ("ready", "unknown"))):
            run.return_value = subprocess.CompletedProcess([], 0, '{"tasks":[{"id":"' + REMOTE + '","status":"' + status + '"}]}', "")
            with patch("native_cloud_cli.time.time", return_value=104 + index):
                result = self.transport.status(OP, self.plan.executable)
            self.assertEqual(result["provider_status"], status)
            self.assertEqual(self.bridge.read(OP)["state"], expected)
        run.return_value = subprocess.CompletedProcess([], 0, '{"tasks":[{"id":"' + REMOTE + '","status":7}]}', "")
        self.assertEqual(self.transport.status(OP, self.plan.executable)["provider_status"], "UNKNOWN")
        self.assertEqual(self.bridge.read(OP)["state"], "unknown")
