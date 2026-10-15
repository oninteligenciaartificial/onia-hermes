"""Offline linkage tests for prompt footer -> R4 admission -> supervisor ordering."""
import hashlib
from pathlib import Path
import tempfile
import unittest
from types import SimpleNamespace
from unittest.mock import patch

import native_cloud_r4_bootstrap as bootstrap
from native_cloud_lineage import append_intent_to_prompt, prepare_controller_intent


class BootstrapTests(unittest.TestCase):
    def intent_wire(self):
        intent, digest = prepare_controller_intent(
            request_sha="c" * 64, input_sha="b" * 64, prompt_sha256="d" * 64,
            expected_head="a" * 40,
            submission_reference="controller-dispatch:f90f55bc-48d8-406f-a11e-05ddd2683014")
        return append_intent_to_prompt(b"Reviewed R4 prompt\n", intent, digest)[0], intent, digest

    def test_extracts_exact_terminal_footer_and_rejects_changed_or_duplicate(self):
        wire, intent, digest = self.intent_wire()
        footer = b"\n".join(wire.splitlines()[-2:]) + b"\n"
        self.assertEqual(bootstrap.extract_intent_footer(footer), (intent, digest))
        with self.assertRaisesRegex(ValueError, "footer digest mismatch"):
            bootstrap.extract_intent_footer(footer.replace(digest.encode(), b"0" * 64, 1))
        with self.assertRaisesRegex(ValueError, "exact two-line"):
            bootstrap.extract_intent_footer(footer + b"ONIA_R4_INTENT_SHA256=" + digest.encode() + b"\n")

    def files(self, root):
        wire, intent, digest = self.intent_wire()
        wire_file = root / "intent-footer.txt"
        wire_file.write_bytes(b"\n".join(wire.splitlines()[-2:]) + b"\n")
        checkout = root / "checkout"; checkout.mkdir()
        source_dir = root / "r4"; source_dir.mkdir()
        for name in ("admission.py", "browser_check.py", "supervisor.py"):
            (source_dir / name).write_text("pinned fixture", encoding="utf-8")
        ui_file = root / "ui.json"; ui_file.write_text("{}", encoding="utf-8")
        contract = root / "contract.json"
        output = root / "out"; output.mkdir()
        args = SimpleNamespace(intent_footer_file=str(wire_file), checkout=str(checkout),
                               r4_source_dir=str(source_dir), ui_readback=str(ui_file),
                               contract=str(contract), output_dir=str(output))
        return args, contract, intent, digest

    def test_bootstrap_calls_materializer_before_exact_uid1000_supervisor(self):
        with tempfile.TemporaryDirectory() as tmp:
            args, contract, intent, digest = self.files(Path(tmp))
            git = SimpleNamespace(returncode=0, stdout="a" * 40 + "\n")
            supervisor = SimpleNamespace(returncode=0)
            def materialize(**kwargs):
                self.assertEqual(kwargs["intent_bytes"], intent)
                self.assertEqual(kwargs["expected_intent_sha256"], digest)
                contract.write_bytes(b"admitted contract")
                return {"operation_id": "f90f55bc-48d8-406f-a11e-05ddd2683014"}
            with patch.object(bootstrap, "_private_output_dir"), \
                 patch.object(bootstrap, "materialize_and_admit_before_browser", side_effect=materialize) as admit, \
                 patch.object(bootstrap.subprocess, "run", side_effect=[git, supervisor]) as run, \
                 patch.dict("os.environ", {"ONIA_R4_ROOT_INTENT_SHA256": digest}):
                self.assertEqual(bootstrap.run(args), 0)
            self.assertEqual(admit.call_count, 1)
            self.assertEqual(run.call_count, 2)
            self.assertEqual(run.call_args_list[0].args[0][:4], ["git", "-C", str(Path(args.checkout).resolve()), "rev-parse"])
            supervisor_argv = run.call_args_list[1].args[0]
            self.assertEqual(supervisor_argv[:4], ["/usr/sbin/runuser", "-u", "#1000", "--"])
            self.assertIn("--contract-sha256", supervisor_argv)
            self.assertEqual(run.call_args_list[1].kwargs["shell"], False)

    def test_failed_admission_never_starts_supervisor(self):
        with tempfile.TemporaryDirectory() as tmp:
            args, _, _, digest = self.files(Path(tmp))
            git = SimpleNamespace(returncode=0, stdout="a" * 40 + "\n")
            with patch.object(bootstrap, "_private_output_dir"), \
                 patch.object(bootstrap, "materialize_and_admit_before_browser",
                              side_effect=ValueError("guard rejected")), \
                 patch.object(bootstrap.subprocess, "run", return_value=git) as run, \
                 patch.dict("os.environ", {"ONIA_R4_ROOT_INTENT_SHA256": digest}):
                with self.assertRaisesRegex(ValueError, "guard rejected"):
                    bootstrap.run(args)
            self.assertEqual(run.call_count, 1)
            self.assertFalse(any(call.args[0][0] == "/usr/sbin/runuser" for call in run.call_args_list))


if __name__ == "__main__":
    unittest.main()
