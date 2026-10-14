import hashlib
import importlib.util
import json
import os
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import Mock, patch
import run_result

HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location("authorized_runner", HERE / "browser-runner.py")
runner = importlib.util.module_from_spec(spec)
spec.loader.exec_module(runner)


class AuthorizedRunnerFocalTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name)
        self.control = self.root / "control"
        self.control.mkdir(mode=0o700)
        self.out = self.root / "out"
        self.out.mkdir(mode=0o700)
        self.nonce = "1234567890abcdef1234567890abcdef"
        runner.EXPECTED_IMAGE_ID = "sha256:" + "a" * 64
        runner.APPROVED_NONCE_SHA256 = hashlib.sha256(self.nonce.encode()).hexdigest()

    def tearDown(self):
        runner.EXPECTED_IMAGE_ID = ""
        runner.APPROVED_NONCE_SHA256 = ""
        self.tmp.cleanup()

    def test_runtime_argv_has_rm_and_isolated_limits(self):
        cid = self.control / "container.cid"
        args = runner.argv(self.out, cid, "b" * 32, self.nonce)
        self.assertIn("--rm", args)
        self.assertIn("--network=none", args)
        self.assertIn("--pull=never", args)
        self.assertIn("--cap-drop=ALL", args)
        self.assertIn("--security-opt=no-new-privileges=true", args)
        self.assertIn("--cpus=0.50", args)
        self.assertIn("--memory=768m", args)
        self.assertIn("--memory-swap=768m", args)
        self.assertIn("--pids-limit=256", args)
        self.assertFalse(any(x in ("-p", "--publish") or x.startswith("-p=") for x in args))

    def test_container_control_path_cannot_be_inside_output_mount(self):
        with self.assertRaisesRegex(RuntimeError, "outside writable output mount"):
            runner.argv(self.out, self.out / "container.cid", "b" * 32, self.nonce)

    def test_nonce_hash_is_bound_and_reservation_is_one_use(self):
        nonce = self.control / "approval-nonce.txt"
        nonce.write_text(self.nonce + "\n", encoding="ascii")
        with patch.object(runner, "control_directory_is_private", return_value=True):
            reservation = runner.reserve_nonce(self.control, self.nonce)
        self.assertTrue(reservation.is_file())
        with patch.object(runner, "control_directory_is_private", return_value=True):
            with self.assertRaises(FileExistsError):
                runner.reserve_nonce(self.control, self.nonce)

    def test_human_string_nonce_rejected_before_reservation(self):
        runner.APPROVED_NONCE_SHA256 = hashlib.sha256(b"sergio:20261014-vps-browser-offline-r1").hexdigest()
        with patch.object(runner, "control_directory_is_private", return_value=True):
            with self.assertRaisesRegex(RuntimeError, "nonce format rejected"):
                runner.reserve_nonce(self.control, "sergio:20261014-vps-browser-offline-r1")
        self.assertFalse(list(self.control.glob("*.reserved")))

    def test_cleanup_kills_only_owned_container_then_verifies_absence(self):
        nonce_hash = hashlib.sha256(self.nonce.encode()).hexdigest()
        cidfile = self.control / "cid"
        cidfile.write_text("c" * 64, encoding="ascii")
        labels = {"org.onia.browser.owner": "onia-browser-runner", "org.onia.browser.run-id": "b" * 32,
            "org.onia.browser.nonce-sha256": nonce_hash}
        calls = []
        def docker(args, **kwargs):
            calls.append(args)
            if args[:2] == ["container", "inspect"]:
                return SimpleNamespace(returncode=0, stdout=json.dumps(labels))
            if args[:2] == ["container", "ls"]:
                return SimpleNamespace(returncode=0, stdout="")
            return SimpleNamespace(returncode=0, stdout="")
        proc = SimpleNamespace(pid=123, poll=lambda: 0)
        binding = {"nonce_sha256": nonce_hash}
        self.assertEqual(runner.stop_owned(cidfile, proc, "b" * 32, self.nonce, docker_call=docker), "verified_absent")
        self.assertEqual([c[:2] for c in calls], [["container", "inspect"], ["container", "kill"], ["container", "ls"]])

    def test_mismatched_owner_cannot_be_killed(self):
        cidfile = self.control / "cid"
        cidfile.write_text("c" * 64, encoding="ascii")
        fake = Mock(return_value=SimpleNamespace(returncode=0, stdout=json.dumps({"org.onia.browser.owner": "other"})))
        proc = SimpleNamespace(pid=123, poll=lambda: 0)
        self.assertEqual(runner.stop_owned(cidfile, proc, "b" * 32, self.nonce, docker_call=fake), "needs_reconcile")
        self.assertEqual(fake.call_args_list[0].args[0][:2], ["container", "inspect"])
        self.assertEqual(len(fake.call_args_list), 1)

    @unittest.skipIf(os.name == "nt", "selectors cannot monitor Windows subprocess pipes")
    def test_probe_stdout_has_a_fixed_memory_cap(self):
        proc = subprocess.Popen([sys.executable, "-c", "import sys; sys.stdout.write('x'*2000)"],
            stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, start_new_session=True)
        with self.assertRaisesRegex(RuntimeError, "stdout exceeded fixed limit"):
            runner.bounded_communicate(proc, timeout=3, limit=100)
        try:
            os.killpg(proc.pid, runner.signal.SIGKILL)
        except (ProcessLookupError, PermissionError):
            pass
        proc.wait(timeout=2)

    def test_install_and_trial_are_separate_bounded_no_retry_stages(self):
        install = (HERE / "install-image.sh").read_text(encoding="utf-8")
        trial = (HERE / "run-once.sh").read_text(encoding="utf-8")
        self.assertIn("180s", install)
        self.assertIn("300s", install)
        self.assertIn("--pull=false --network=default", install)
        self.assertIn("one-shot guard already exists; no retry", trial)
        self.assertIn("--execute-offline", trial)
        self.assertNotIn("--execute-public", trial)

    def test_successful_runner_stdout_contract_validates_in_wrapper(self):
        out = Path(tempfile.mkdtemp(prefix="onia-pw-offline-", dir=str(self.root)))
        shot_bytes = b"\xff\xd8offline-jpeg\xff\xd9"
        shot = out / "offline-fixture.jpg"
        shot.write_bytes(shot_bytes)
        shot_hash = hashlib.sha256(shot_bytes).hexdigest()
        detail = {"status": "PASS", "phase": "offline-synthetic", "container_cleanup": "verified_absent",
            "network_mode": "none", "chromium_sandbox": True, "runtime_invocations": 1,
            "browser_launches": 1, "fixture_pages": 1, "remote_urls_requested": 0,
            "screenshot_sha256": shot_hash}
        receipt = out / "receipt.json"
        receipt.write_text(json.dumps(detail), encoding="utf-8")
        receipt_hash = hashlib.sha256(receipt.read_bytes()).hexdigest()
        # Same helper the runner uses: this is the exact single-line stdout contract.
        output = self.root / "runner.stdout"
        output.write_text(json.dumps(run_result.success_summary(str(receipt), receipt_hash, shot_hash, 42),
            sort_keys=True, separators=(",", ":")), encoding="utf-8")
        accepted = run_result.validate_stdout(output, self.root)
        self.assertEqual(accepted["result"], "offline_fixture_pass")
        self.assertEqual(accepted["container_cleanup"], "verified_absent")

    def test_source_manifest_files_are_revalidated_before_nonce_use(self):
        source = self.root / "locked-source.py"
        source.write_text("approved", encoding="utf-8")
        manifest = self.root / "source-manifest.json"
        data = {"upstream_bundle_manifest_sha256": "F1B7B1DFA9C60330FC9D2184A2A266EFBFCDFC3B4733EE0FD9DD5F372906F78B",
            "files": [{"name": source.name, "sha256": hashlib.sha256(source.read_bytes()).hexdigest()}]}
        manifest.write_text(json.dumps(data), encoding="utf-8")
        runner.verify_source_manifest(manifest)
        source.write_text("changed", encoding="utf-8")
        with self.assertRaisesRegex(RuntimeError, "source file changed"):
            runner.verify_source_manifest(manifest)


if __name__ == "__main__":
    unittest.main()
