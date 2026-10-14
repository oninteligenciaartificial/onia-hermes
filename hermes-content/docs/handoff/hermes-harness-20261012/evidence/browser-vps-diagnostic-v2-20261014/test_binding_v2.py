import importlib.util
import json
import os
import stat
import sys
import tempfile
import types
import unittest
from pathlib import Path
from unittest import mock


HERE = Path(__file__).parent
result_spec = importlib.util.spec_from_file_location("run_result", HERE / "run_result.py")
result_module = importlib.util.module_from_spec(result_spec)
result_spec.loader.exec_module(result_module)
sys.modules["run_result"] = result_module


def load_module(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


binder = load_module("bind_approval_v2_test", HERE / "bind-approval.py")
runner = load_module("browser_runner_binding_v2_test", HERE / "browser-runner.py")


def test_binding_values():
    values = binder.validate_bundle(HERE)
    root_go = {
        "status": "approved",
        "scope": "single_offline_synthetic_trial",
        "bundle_manifest_sha256": values["bundle_manifest_sha256"],
        "runner_sha256": values["runner_sha256"],
        "contract_sha256": values["contract_sha256"],
        "target_id": binder.TARGET_ID,
        "hard_timeout_seconds": binder.HARD_TIMEOUT_SECONDS,
        "timeout_grace_seconds": binder.TIMEOUT_GRACE_SECONDS,
        "derived_image_id": binder.DERIVED_IMAGE_ID,
        "root_go_reference": "QA-approved-test",
    }
    root_go_bytes = json.dumps(root_go).encode("utf-8")
    import hashlib
    return {
        "human_authorization": "Autorizar instalación y prueba aisladas.",
        "authorization_reference": "Sergio14Oct",
        "approval_nonce_reference": "sergio:20261014-vps-browser-offline-r1",
        "root_go_reference": "QA-approved-test",
        "root_go_receipt_sha256": hashlib.sha256(root_go_bytes).hexdigest(),
        "nonce_sha256": "a" * 64,
        "upstream_bundle_manifest_sha256": binder.UPSTREAM_MANIFEST_SHA256,
        "source_manifest_sha256": values["source_manifest_sha256"],
        "bundle_manifest_sha256": binder.sha256_file(HERE / "manifest.json"),
        "runner_sha256": values["runner_sha256"],
        "binder_sha256": values["binder_sha256"],
        "wrapper_sha256": values["wrapper_sha256"],
        "contract_sha256": values["contract_sha256"],
        "target_id": binder.TARGET_ID,
        "hard_timeout_seconds": binder.HARD_TIMEOUT_SECONDS,
        "timeout_grace_seconds": binder.TIMEOUT_GRACE_SECONDS,
        "base_image": binder.BASE_IMAGE,
        "derived_image_id": binder.DERIVED_IMAGE_ID,
        "install_receipt_sha256": values["install_receipt_sha256"],
        "requirements_lock_sha256": binder.LOCK_SHA256,
        "seccomp_profile_sha256": binder.SECCOMP_SHA256,
        "pwuser_uid": 1001,
        "pwuser_gid": 1001,
        "image_review_status": "independent_read_only_review_pass",
        "image_review_report_sha256": values["image_review_report_sha256"],
        "public_mode_enabled": False,
        "runtime_invocation_limit": 1,
    }


class BindingTests(unittest.TestCase):
    def _root_go(self, root):
        values = binder.validate_bundle(HERE)
        receipt = {
            "status": "approved",
            "scope": "single_offline_synthetic_trial",
            "bundle_manifest_sha256": values["bundle_manifest_sha256"],
            "runner_sha256": values["runner_sha256"],
            "contract_sha256": values["contract_sha256"],
            "target_id": binder.TARGET_ID,
            "hard_timeout_seconds": binder.HARD_TIMEOUT_SECONDS,
            "timeout_grace_seconds": binder.TIMEOUT_GRACE_SECONDS,
            "derived_image_id": binder.DERIVED_IMAGE_ID,
            "root_go_reference": "QA-approved-test",
        }
        path = Path(root) / "root-go.json"
        path.write_text(json.dumps(receipt), encoding="utf-8")
        os.chmod(path, 0o600)
        return path

    def _fake_image(self, image_id):
        return image_id, "pwuser", {
            "org.onia.playwright.base-digest": binder.BASE_DIGEST,
            "org.onia.playwright.requirements-sha256": binder.LOCK_SHA256,
        }

    def test_binder_writes_private_bound_files_and_never_discloses_raw_nonce(self):
        raw_nonce = "0123456789abcdef0123456789abcdef"
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            self._root_go(root)
            sync_calls = []
            file_sync_calls = []
            opened_modes = []
            real_open = os.open

            def tracked_open(path, flags, mode=0o777):
                if Path(path).name in {"approval-nonce.txt", "approval-binding.json"}:
                    opened_modes.append((Path(path).name, mode))
                return real_open(path, flags, mode)

            with mock.patch.object(binder, "effective_uid", return_value=0), \
                 mock.patch.object(binder, "private_owned", return_value=True), \
                 mock.patch.object(binder, "fsync_directory", side_effect=lambda path: sync_calls.append(Path(path))), \
                 mock.patch.object(binder.os, "open", side_effect=tracked_open), \
                 mock.patch.object(binder.os, "fsync", side_effect=lambda fd: file_sync_calls.append(fd)):
                result = binder.create_binding(image_id=binder.DERIVED_IMAGE_ID, pwuser_uid=1001,
                    pwuser_gid=1001, image_review_sha256=binder.IMAGE_REVIEW_SHA256,
                    control_root=root, bundle_root=HERE, image_inspector=self._fake_image,
                    nonce_factory=lambda _size: raw_nonce)
            nonce_path = root / "approval-nonce.txt"
            binding_path = root / "approval-binding.json"
            binding = json.loads(binding_path.read_text(encoding="utf-8"))
            self.assertEqual(nonce_path.read_text(encoding="ascii").strip(), raw_nonce)
            self.assertEqual(binding["nonce_sha256"], __import__("hashlib").sha256(raw_nonce.encode()).hexdigest())
            self.assertNotIn(raw_nonce, json.dumps(result))
            self.assertNotIn(raw_nonce, binding_path.read_text(encoding="utf-8"))
            self.assertEqual(opened_modes, [("approval-nonce.txt", 0o600), ("approval-binding.json", 0o600)])
            self.assertEqual(len(file_sync_calls), 2)
            self.assertEqual(len(sync_calls), 2)
            if os.name != "nt":
                self.assertEqual(stat.S_IMODE(nonce_path.stat().st_mode), 0o600)
                self.assertEqual(stat.S_IMODE(binding_path.stat().st_mode), 0o600)
            self.assertEqual(runner.load_binding(root)["target_id"], "offline-synthetic")

    def test_absent_root_go_fails_before_nonce_creation_or_image_inspection(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            inspect = mock.Mock(side_effect=self._fake_image)
            with mock.patch.object(binder, "effective_uid", return_value=0), \
                 mock.patch.object(binder, "private_owned", return_value=True):
                with self.assertRaisesRegex(RuntimeError, "root GO"):
                    binder.create_binding(image_id=binder.DERIVED_IMAGE_ID, pwuser_uid=1001,
                        pwuser_gid=1001, image_review_sha256=binder.IMAGE_REVIEW_SHA256,
                        control_root=root, bundle_root=HERE, image_inspector=inspect,
                        nonce_factory=lambda _size: "f" * 32)
            self.assertFalse((root / "approval-nonce.txt").exists())
            inspect.assert_not_called()

    def test_each_binding_mismatch_stops_before_reservation_and_docker(self):
        fields = ["runner_sha256", "contract_sha256", "target_id", "hard_timeout_seconds",
            "timeout_grace_seconds", "derived_image_id", "install_receipt_sha256",
            "image_review_report_sha256", "bundle_manifest_sha256", "source_manifest_sha256",
            "wrapper_sha256", "binder_sha256", "nonce_sha256", "root_go_reference",
            "root_go_receipt_sha256"]
        for field in fields:
            with self.subTest(field=field), tempfile.TemporaryDirectory() as directory:
                root = Path(directory)
                binding = test_binding_values()
                self._root_go(root)
                binding[field] = "mismatch" if not isinstance(binding[field], int) else binding[field] + 1
                (root / "approval-binding.json").write_text(json.dumps(binding), encoding="utf-8")
                (root / "approval-nonce.txt").write_text("f" * 32, encoding="ascii")
                reserve = mock.Mock(side_effect=AssertionError("reservation called"))
                docker = mock.Mock(side_effect=AssertionError("docker called"))
                with mock.patch.object(runner, "reserve_nonce", reserve), \
                     mock.patch.object(runner, "_docker_call", docker):
                    with self.assertRaises((RuntimeError, OSError, json.JSONDecodeError)):
                        runner.execute("unused", control_root=root, docker_call=docker)
                reserve.assert_not_called()
                docker.assert_not_called()
                self.assertEqual(list(root.glob("nonce-sha256-*.reserved")), [])


if __name__ == "__main__":
    unittest.main()
