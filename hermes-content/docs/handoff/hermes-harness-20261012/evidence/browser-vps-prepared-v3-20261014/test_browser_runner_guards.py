import importlib.util
import json
import tempfile
import unittest
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import Mock, patch


ROOT = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location("browser_runner", ROOT / "browser-runner.py")
runner = importlib.util.module_from_spec(spec)
spec.loader.exec_module(runner)


class FakeDocker:
    def __init__(self, labels=None, image_id="sha256:good"):
        self.calls = []
        self.labels = labels or {}
        self.image_id = image_id

    def __call__(self, args, **kwargs):
        self.calls.append(args)
        if args[:2] == ["container", "inspect"]:
            return SimpleNamespace(returncode=0, stdout=json.dumps(self.labels))
        if args[:2] == ["image", "inspect"]:
            labels = {"org.onia.playwright.base-digest": runner.BASE_DIGEST,
                "org.onia.playwright.requirements-sha256": runner.LOCK_SHA256}
            return SimpleNamespace(returncode=0, stdout=self.image_id + "|" + json.dumps(labels))
        return SimpleNamespace(returncode=0, stdout="")


class BrowserRunnerGuardTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)
        self.control = self.root / "control"
        self.control.mkdir(mode=0o700)
        self.out = self.root / "out"
        self.out.mkdir(mode=0o700)
        self.nonce = "a" * 32
        runner.EXPECTED_IMAGE_ID = "sha256:" + "a" * 64
        runner.LOCK_SHA256 = "b" * 64
        runner.APPROVED_NONCE_SHA256 = __import__("hashlib").sha256(self.nonce.encode()).hexdigest()

    def tearDown(self):
        runner.EXPECTED_IMAGE_ID = ""
        runner.LOCK_SHA256 = "52e857275e075417fa9e5b934f3b41d0366a55fc25187b7f40dbb3df34ed6a4e"
        runner.APPROVED_NONCE_SHA256 = ""
        self.temp.cleanup()

    def test_replay_is_rejected_before_any_docker_preflight(self):
        with patch.object(runner, "control_directory_is_private", return_value=True):
            runner.reserve_nonce(self.control, self.nonce)
        docker = FakeDocker()
        with patch.object(runner, "check_inputs", side_effect=AssertionError("Docker preflight reached")):
            with patch.object(runner, "control_directory_is_private", return_value=True):
                with self.assertRaises(FileExistsError):
                    runner.execute(self.nonce, control_root=self.control, docker_call=docker)
        self.assertEqual(docker.calls, [])

    def test_unbound_approval_nonce_is_rejected_without_reservation(self):
        runner.APPROVED_NONCE_SHA256 = ""
        with self.assertRaisesRegex(RuntimeError, "approval nonce is not configured"):
            runner.reserve_nonce(self.control, self.nonce)
        self.assertEqual(list(self.control.iterdir()), [])

    def test_cidfile_is_outside_child_writable_mount(self):
        cid = self.control / "run" / "container.cid"
        cid.parent.mkdir(mode=0o700)
        args = runner.argv(self.out, cid, "c" * 32, self.nonce)
        self.assertNotIn(str(self.out), str(cid))
        self.assertTrue(cid.resolve().is_relative_to(self.control.resolve()))
        self.assertIn("--label=org.onia.browser.run-id=" + "c" * 32, args)
        with self.assertRaises(RuntimeError):
            runner.argv(self.out, self.out / "poisoned.cid", "c" * 32, self.nonce)

    def test_mismatched_labels_never_reach_docker_kill(self):
        cidfile = self.control / "cid"
        cidfile.write_text("d" * 64, encoding="ascii")
        docker = FakeDocker({"org.onia.browser.owner": "other", "org.onia.browser.run-id": "c" * 32,
            "org.onia.browser.nonce-sha256": __import__("hashlib").sha256(self.nonce.encode()).hexdigest()})
        proc = SimpleNamespace(pid=123, poll=lambda: 0)
        self.assertEqual(runner.stop_owned(cidfile, proc, "c" * 32, self.nonce, docker_call=docker), "UNKNOWN")
        self.assertEqual([call[:2] for call in docker.calls], [["container", "inspect"]])

    def test_matching_labels_only_kills_verified_container_id(self):
        cidfile = self.control / "cid"
        cidfile.write_text("d" * 64, encoding="ascii")
        labels = {"org.onia.browser.owner": "onia-browser-runner", "org.onia.browser.run-id": "c" * 32,
            "org.onia.browser.nonce-sha256": __import__("hashlib").sha256(self.nonce.encode()).hexdigest()}
        docker = FakeDocker(labels)
        proc = SimpleNamespace(pid=123, poll=lambda: 0)
        self.assertEqual(runner.stop_owned(cidfile, proc, "c" * 32, self.nonce, docker_call=docker), "UNKNOWN")
        self.assertEqual(docker.calls[-1][:4], ["container", "kill", "--signal", "KILL"])
        self.assertEqual(docker.calls[-1][-1], "d" * 64)

    def test_unconfigured_or_mismatched_image_blocks_before_launch(self):
        docker = FakeDocker(image_id="sha256:" + "b" * 64)
        with self.assertRaises(RuntimeError):
            runner.verify_image(docker_call=docker)
        self.assertEqual(len(docker.calls), 1)
        self.assertEqual(docker.calls[0][:3], ["image", "inspect", "--format"])
        runner.EXPECTED_IMAGE_ID = ""
        with self.assertRaises(RuntimeError):
            runner.argv(self.out, self.control / "cid", "c" * 32, self.nonce)

    def test_matching_immutable_image_id_and_labels_pass_inspection(self):
        docker = FakeDocker(image_id="sha256:" + "a" * 64)
        runner.verify_image(docker_call=docker)
        self.assertEqual(len(docker.calls), 1)

    def test_timeout_cleanup_is_unknown_and_needs_reconcile(self):
        cidfile = self.control / "cid"
        cidfile.write_text("d" * 64, encoding="ascii")
        docker = FakeDocker({})
        proc = SimpleNamespace(pid=123, poll=lambda: 0)
        state = runner.stop_owned(cidfile, proc, "c" * 32, self.nonce, docker_call=docker)
        self.assertEqual(state, "UNKNOWN")

    def test_execute_timeout_is_needs_reconcile_without_retry(self):
        class TimeoutProcess:
            pid = 123
            returncode = None
            def communicate(self, timeout):
                raise runner.subprocess.TimeoutExpired("fake-container", timeout)
            def poll(self):
                return None

        with patch.object(runner, "OUTPUT_ROOT", self.root), \
             patch.object(runner, "check_inputs", return_value=None), \
             patch.object(runner, "control_directory_is_private", return_value=True), \
             patch.object(runner, "stop_owned", return_value="UNKNOWN") as stop:
            with self.assertRaisesRegex(RuntimeError, "cleanup=UNKNOWN; needs_reconcile; no retry"):
                launch = Mock(return_value=TimeoutProcess())
                runner.execute(self.nonce, control_root=self.control, popen=launch)
        launch.assert_called_once()
        stop.assert_called_once()


if __name__ == "__main__":
    unittest.main()
