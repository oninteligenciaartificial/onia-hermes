"""Offline tests for the minimal R4 builder against unchanged admission.py."""
import base64
import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import patch
from types import SimpleNamespace

from native_cloud_lineage import (
    AdmissionBuildError, OPERATION, ENVIRONMENT, RECIPE_SHA256, UI_RECEIPT_SHA256,
    UI_RECEIPT_GIT_LF_SHA256,
    OPERATION_NONCE, SUBMIT_NONCE, append_intent_to_prompt, build_admission_contract,
    derive_configuration_receipt, materialize_and_admit_before_browser,
    prepare_controller_intent, write_controller_intent_once,
)
import native_cloud_lineage as lineage
from native_cloud_cli import CloudTaskPlan, NativeCloudCLI

DOCS = Path(r"E:\onia-wt\orquestacion-subagentes-20261013\hermes-content\docs\handoff\hermes-harness-20261012\evidence\cloud-browser-prepared-20261014\r4")
DOCS_ROOT = Path(r"E:\onia-wt\orquestacion-subagentes-20261013")
ADMISSION_PATH = DOCS / "admission.py"
CHILD_PATH = DOCS / "browser_check.py"
SUPERVISOR_PATH = DOCS / "supervisor.py"
UI_PATH = DOCS / "r4-save-readback-receipt-20261015.json"
OP_AUTH = "user:01a13cc1-12e9-79a0-97e8-4899f05a5c95:R4-20261014"
SETUP_AUTH = "user:01a13cc1-12e9-79a0-97e8-4899f05a5c95:setup-R4-autonomia-20261014"


def read_reviewed_source(path):
    if path.is_file():
        return path.read_bytes()
    relative = path.relative_to(DOCS_ROOT).as_posix()
    return subprocess.run(
        ["git", "-C", str(DOCS_ROOT), "show", "HEAD:" + relative],
        check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
    ).stdout


def intent_bytes(**changes):
    kwargs = {
        "request_sha": "c" * 64, "input_sha": "b" * 64,
        "prompt_sha256": "d" * 64, "expected_head": "a" * 40,
        "submission_reference": "controller-dispatch:" + OPERATION,
    }
    kwargs.update(changes)
    return prepare_controller_intent(**kwargs)


def setup_receipt():
    return json.dumps({
        "state": "INSTALLED_METADATA_ONLY", "browser_launched": False,
        "schema": 1, "environment_id": ENVIRONMENT, "operation_id": OPERATION,
        "operation_authorization_reference": OP_AUTH, "recipe_sha256": RECIPE_SHA256,
        "started_at_utc": "2026-10-15T01:00:00Z", "finished_at_utc": "2026-10-15T01:01:00Z",
        "receipt_provenance": "pinned_installer_actual_success_after_component_validation",
        "python": "/opt/onia-public-browser-1.64.0/venv/bin/python",
        "browser_uid_required": 1000,
    }, sort_keys=True, separators=(",", ":")).encode()


class AdmissionTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.ui = read_reviewed_source(UI_PATH)
        cls.admission_raw = read_reviewed_source(ADMISSION_PATH)
        cls.child_raw = read_reviewed_source(CHILD_PATH)
        cls.supervisor_raw = read_reviewed_source(SUPERVISOR_PATH)
        cls.setup = setup_receipt()
        cls.admission = compile(cls.admission_raw, str(ADMISSION_PATH), "exec")

    def setUp(self):
        self._old_intent_pin = os.environ.get(lineage.INTENT_SHA256_ENV)
        _, digest = intent_bytes()
        os.environ[lineage.INTENT_SHA256_ENV] = digest

    def tearDown(self):
        if self._old_intent_pin is None:
            os.environ.pop(lineage.INTENT_SHA256_ENV, None)
        else:
            os.environ[lineage.INTENT_SHA256_ENV] = self._old_intent_pin

    def contract(self, **intent_changes):
        raw, digest = intent_bytes(**intent_changes)
        return build_admission_contract(
            raw, expected_intent_sha256=digest, ui_receipt=self.ui,
            setup_receipt=self.setup, checkout_head_observed_before_uid_switch="a" * 40,
            child_source=self.child_raw,
            supervisor_source=self.supervisor_raw, admission_source=self.admission_raw)

    def run_original_admission(self, contract):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            contract_path = root / "contract.json"
            contract_bytes = json.dumps(contract, sort_keys=True, separators=(",", ":")).encode()
            contract_path.write_bytes(contract_bytes)
            contract_path.chmod(0o600)
            setup_path = root / "setup-receipt.json"
            setup_path.write_bytes(self.setup)
            setup_path.chmod(0o444)
            admission_path = root / "admission.py"
            admission_path.write_bytes(self.admission_raw)
            admission_path.chmod(0o444)
            class FakePath:
                def __init__(self, path): self.path = Path(path)
                def __str__(self): return str(self.path)
                def lstat(self):
                    data = self.path.lstat()
                    class Meta:
                        st_mode = data.st_mode & ~0o022
                        st_size = data.st_size
                        st_uid = 0 if str(self.path) == "/opt/onia-public-browser-1.64.0/setup-receipt.json" else getattr(data, "st_uid", 0)
                    return Meta()
                def read_bytes(self): return self.path.read_bytes()
            real_path = Path
            def path_factory(value):
                if str(value) == "/opt/onia-public-browser-1.64.0/setup-receipt.json":
                    return FakePath(setup_path)
                if str(value) == str(ADMISSION_PATH):
                    return FakePath(admission_path)
                return FakePath(real_path(value))
            class FixedDateTime:
                @staticmethod
                def fromisoformat(value):
                    from datetime import datetime
                    return datetime.fromisoformat(value)
                @staticmethod
                def now(tz):
                    from datetime import datetime
                    return datetime.fromisoformat("2026-10-15T02:00:00+00:00")
            namespace = {"__name__": "r4_admission_test", "__file__": str(ADMISSION_PATH)}
            with patch.object(sys, "argv", ["admission.py", "--contract", str(contract_path),
                                              "--contract-sha256", hashlib.sha256(contract_bytes).hexdigest()]), \
                 patch.dict("os.environ", {"ONIA_BROWSER_PROVIDER_SAVED_CONFIGURATION_JSON": json.dumps(
                     json.loads(base64.b64decode(contract["configuration_receipt_base64"])
                                )["provider_saved_configuration"])}), \
                 patch("pathlib.Path", path_factory):
                # `from pathlib import Path` happened at module compile time, so provide
                # the local path factory in this isolated namespace before execution.
                namespace["Path"] = path_factory
                namespace["datetime"] = FixedDateTime
                exec(self.admission, namespace)
                return namespace["admission"]()

    def run_materialize(self, *, actual_setup=None, setup_reader=None,
                        provider_env="expected", intent_pin="expected"):
        temp = tempfile.TemporaryDirectory()
        root = Path(temp.name)
        contract_path = root / "private-contract.json"
        actual_setup_path = root / "actual-setup.json"
        actual_setup_path.write_bytes(self.setup if actual_setup is None else actual_setup)
        actual_setup_path.chmod(0o444)
        actual_admission_path = root / "actual-admission.py"
        actual_admission_path.write_bytes(self.admission_raw)
        actual_admission_path.chmod(0o444)
        real_path = Path
        class FakePath:
            def __init__(self, path): self.path = real_path(path)
            def __str__(self): return str(self.path)
            def lstat(self):
                data = self.path.lstat()
                class Meta:
                    st_mode = data.st_mode & ~0o022
                    st_size = data.st_size
                    st_uid = 0
                return Meta()
            def is_file(self): return self.path.is_file()
            def is_symlink(self): return self.path.is_symlink()
            def is_absolute(self): return self.path.is_absolute()
            def read_bytes(self): return self.path.read_bytes()
        def path_factory(value):
            if str(value) == "/opt/onia-public-browser-1.64.0/setup-receipt.json":
                return FakePath(actual_setup_path)
            if str(value) == str(ADMISSION_PATH):
                return FakePath(actual_admission_path)
            return FakePath(real_path(value))
        def local_write(path, contract):
            raw = json.dumps(contract, sort_keys=True, separators=(",", ":")).encode()
            Path(path).write_bytes(raw)
            Path(path).chmod(0o600)
            return raw.decode(), hashlib.sha256(raw).hexdigest()
        raw, digest = intent_bytes()
        reader = setup_reader or (lambda: self.setup)
        if provider_env == "expected":
            config = json.loads(derive_configuration_receipt(
                self.ui, authorization_reference=OP_AUTH,
                configuration_grant_reference=SETUP_AUTH))["provider_saved_configuration"]
            env_value = json.dumps(config, sort_keys=True, separators=(",", ":"))
        else:
            env_value = provider_env
        old_env = os.environ.get("ONIA_BROWSER_PROVIDER_SAVED_CONFIGURATION_JSON")
        if env_value is None:
            os.environ.pop("ONIA_BROWSER_PROVIDER_SAVED_CONFIGURATION_JSON", None)
        else:
            os.environ["ONIA_BROWSER_PROVIDER_SAVED_CONFIGURATION_JSON"] = env_value
        old_pin = os.environ.get(lineage.INTENT_SHA256_ENV)
        if intent_pin is None:
            os.environ.pop(lineage.INTENT_SHA256_ENV, None)
        elif intent_pin == "expected":
            os.environ[lineage.INTENT_SHA256_ENV] = digest
        else:
            os.environ[lineage.INTENT_SHA256_ENV] = intent_pin
        try:
            with patch.object(lineage, "read_root_owned_setup_receipt", reader), \
                 patch.object(lineage, "_write_contract_once", local_write), \
                 patch("pathlib.Path", path_factory), \
                 patch.object(lineage, "Path", path_factory):
                result = materialize_and_admit_before_browser(
                    intent_bytes=raw, expected_intent_sha256=digest, ui_receipt=self.ui,
                    checkout_head_observed_before_uid_switch="a" * 40,
                    child_source=self.child_raw, supervisor_source=self.supervisor_raw,
                    admission_source=self.admission_raw, admission_path=str(ADMISSION_PATH),
                    contract_path=str(contract_path))
        except Exception:
            temp.cleanup()
            raise
        finally:
            if old_env is None:
                os.environ.pop("ONIA_BROWSER_PROVIDER_SAVED_CONFIGURATION_JSON", None)
            else:
                os.environ["ONIA_BROWSER_PROVIDER_SAVED_CONFIGURATION_JSON"] = old_env
            if old_pin is None:
                os.environ.pop(lineage.INTENT_SHA256_ENV, None)
            else:
                os.environ[lineage.INTENT_SHA256_ENV] = old_pin
        return temp, contract_path, result

    def test_derives_canonical_config_from_real_ui_readback_not_raw_artifact(self):
        raw_sha = hashlib.sha256(self.ui).hexdigest()
        self.assertIn(raw_sha, (UI_RECEIPT_SHA256, UI_RECEIPT_GIT_LF_SHA256))
        derived = json.loads(derive_configuration_receipt(
            self.ui, authorization_reference=OP_AUTH,
            configuration_grant_reference=SETUP_AUTH))
        self.assertEqual(derived["approval_reference"], OP_AUTH)
        self.assertEqual(derived["source_ui_grant_reference"], SETUP_AUTH)
        self.assertEqual(derived["source_ui_receipt_sha256"], raw_sha)
        self.assertEqual(derived["source_ui_receipt_canonical_sha256"], UI_RECEIPT_GIT_LF_SHA256)
        expected_serialization = ("git-lf" if raw_sha == UI_RECEIPT_GIT_LF_SHA256
                                  else "windows-crlf-canonicalized-to-git-lf")
        self.assertEqual(derived["source_ui_receipt_serialization"], expected_serialization)
        self.assertIn("not an exact provider-side save timestamp", derived["saved_at_utc_semantics"])
        self.assertEqual(derived["provider_saved_configuration"]["saved_at_utc"], "2026-10-15T00:45:58Z")
        raw_ui = json.loads(self.ui)
        self.assertNotIn("approval_reference", raw_ui)
        self.assertNotIn("recipe_sha256", raw_ui)

    def test_ui_receipt_accepts_only_the_two_proven_eol_serializations(self):
        git_lf = self.ui.replace(b"\r\n", b"\n")
        windows_crlf = git_lf.replace(b"\n", b"\r\n")
        self.assertEqual(hashlib.sha256(git_lf).hexdigest(), UI_RECEIPT_GIT_LF_SHA256)
        self.assertEqual(hashlib.sha256(windows_crlf).hexdigest(), UI_RECEIPT_SHA256)
        for raw, representation in ((git_lf, "git-lf"),
                                    (windows_crlf, "windows-crlf-canonicalized-to-git-lf")):
            with self.subTest(representation=representation):
                value = json.loads(derive_configuration_receipt(
                    raw, authorization_reference=OP_AUTH,
                    configuration_grant_reference=SETUP_AUTH))
                self.assertEqual(value["source_ui_receipt_sha256"], hashlib.sha256(raw).hexdigest())
                self.assertEqual(value["source_ui_receipt_canonical_sha256"], UI_RECEIPT_GIT_LF_SHA256)
                self.assertEqual(value["source_ui_receipt_serialization"], representation)
        changed = bytearray(git_lf)
        changed[0] ^= 1
        with self.assertRaisesRegex(AdmissionBuildError, "digest mismatch"):
            derive_configuration_receipt(bytes(changed), authorization_reference=OP_AUTH,
                                          configuration_grant_reference=SETUP_AUTH)

    def test_builder_output_passes_real_unchanged_admission(self):
        contract = self.contract()
        self.assertEqual(hashlib.sha256(self.admission_raw).hexdigest(), contract["admission_source_sha256"])
        admitted = self.run_original_admission(contract)
        self.assertEqual(admitted["operation_id"], OPERATION)
        self.assertEqual(admitted["authorization_reference"], OP_AUTH)
        self.assertEqual(admitted["submission_reference"], "controller-dispatch:" + OPERATION)

    def test_raw_ui_receipt_is_not_an_admission_configuration_receipt(self):
        contract = self.contract()
        contract["configuration_receipt_base64"] = base64.b64encode(self.ui).decode("ascii")
        contract["configuration_receipt_sha256"] = hashlib.sha256(self.ui).hexdigest()
        contract["configuration_saved_at_utc"] = json.loads(self.ui)["provider_saved_configuration"]["saved_at_utc"]
        with self.assertRaisesRegex(ValueError, "configuration receipt binding failed"):
            self.run_original_admission(contract)

    def test_rejects_wrong_operation_or_cross_grant_pair(self):
        raw, digest = intent_bytes()
        value = json.loads(raw)
        value["operation_nonce"] = "forged-nonce"
        altered = json.dumps(value, sort_keys=True, separators=(",", ":")).encode()
        with self.assertRaisesRegex(AdmissionBuildError, "hash mismatch"):
            build_admission_contract(altered, expected_intent_sha256=digest,
                                     ui_receipt=self.ui, setup_receipt=self.setup,
                                     checkout_head_observed_before_uid_switch="a" * 40,
                                     child_source=self.child_raw, supervisor_source=self.supervisor_raw,
                                     admission_source=self.admission_raw)
        value["operation_nonce"] = OPERATION_NONCE
        value["configuration_grant_reference"] = OP_AUTH
        altered = json.dumps(value, sort_keys=True, separators=(",", ":")).encode()
        with self.assertRaisesRegex(AdmissionBuildError, "unexpected pins"):
            build_admission_contract(altered, expected_intent_sha256=hashlib.sha256(altered).hexdigest(),
                                     ui_receipt=self.ui, setup_receipt=self.setup,
                                     checkout_head_observed_before_uid_switch="a" * 40,
                                     child_source=self.child_raw, supervisor_source=self.supervisor_raw,
                                     admission_source=self.admission_raw)

    def test_rejects_task_id_as_pre_submit_reference_and_bad_receipts(self):
        with self.assertRaisesRegex(AdmissionBuildError, "dispatch"):
            intent_bytes(submission_reference="task_e_" + "1" * 32)
        with self.assertRaisesRegex(AdmissionBuildError, "bytes required"):
            raw, digest = intent_bytes()
            build_admission_contract(raw, expected_intent_sha256=digest, ui_receipt=self.ui,
                                     setup_receipt=None, checkout_head_observed_before_uid_switch="a" * 40,
                                     child_source=self.child_raw,
                                     supervisor_source=self.supervisor_raw,
                                     admission_source=self.admission_raw)
        altered = self.setup.replace(RECIPE_SHA256.encode(), b"0" * 64)
        with self.assertRaisesRegex(AdmissionBuildError, "setup receipt"):
            raw, digest = intent_bytes()
            build_admission_contract(raw, expected_intent_sha256=digest, ui_receipt=self.ui,
                                     setup_receipt=altered, checkout_head_observed_before_uid_switch="a" * 40,
                                     child_source=self.child_raw,
                                     supervisor_source=self.supervisor_raw,
                                     admission_source=self.admission_raw)

    def test_frozen_intent_bytes_are_hash_bound_and_persist_once_outside_checkout(self):
        raw, digest = intent_bytes()
        wire, wire_sha = append_intent_to_prompt(b"Reviewed R4 request\n", raw, digest)
        self.assertEqual(wire_sha, hashlib.sha256(wire).hexdigest())
        self.assertIn(b"ONIA_R4_INTENT_SHA256=" + digest.encode(), wire)
        self.assertNotIn(b"wire_prompt_sha256", wire)
        with tempfile.TemporaryDirectory() as temp:
            outside = Path(temp) / "r4-intent.json"
            self.assertEqual(write_controller_intent_once(str(outside), checkout_root=str(Path.cwd()),
                                                          intent_bytes=raw, intent_sha256=digest), digest)
            self.assertEqual(outside.read_bytes(), raw)
            with self.assertRaisesRegex(AdmissionBuildError, "already exists"):
                write_controller_intent_once(str(outside), checkout_root=str(Path.cwd()),
                                             intent_bytes=raw, intent_sha256=digest)

    def test_bootstrap_reads_setup_and_calls_admission_before_returning(self):
        temp, contract_path, admitted = self.run_materialize()
        try:
            self.assertEqual(admitted["operation_id"], OPERATION)
            self.assertTrue(contract_path.exists())
            self.assertEqual(json.loads(contract_path.read_bytes())["setup_receipt_sha256"],
                             hashlib.sha256(self.setup).hexdigest())
        finally:
            temp.cleanup()

    def test_bootstrap_preserves_real_provider_environment_and_rejects_mismatch_or_absence(self):
        for supplied in ("{}", None):
            with self.subTest(provider_env=supplied), self.assertRaisesRegex(
                    AdmissionBuildError, "original admission.py rejected"):
                self.run_materialize(provider_env=supplied)

    def test_bootstrap_requires_independent_root_intent_pin_before_contract_or_browser(self):
        for supplied in (None, "0" * 64):
            with self.subTest(intent_pin=supplied), self.assertRaisesRegex(
                    AdmissionBuildError, "independent Root intent environment pin"):
                self.run_materialize(intent_pin=supplied)

    def test_source_path_and_observed_head_are_checked_before_contract_use(self):
        raw, digest = intent_bytes()
        with self.assertRaisesRegex(AdmissionBuildError, "observed checkout HEAD"):
            build_admission_contract(
                raw, expected_intent_sha256=digest, ui_receipt=self.ui,
                setup_receipt=self.setup, checkout_head_observed_before_uid_switch="f" * 40,
                child_source=self.child_raw, supervisor_source=self.supervisor_raw,
                admission_source=self.admission_raw)
        with tempfile.TemporaryDirectory() as temp:
            contract_path = Path(temp) / "must-not-exist.json"
            with self.assertRaisesRegex(AdmissionBuildError, "admission source mismatch"):
                materialize_and_admit_before_browser(
                    intent_bytes=raw, expected_intent_sha256=digest, ui_receipt=self.ui,
                    checkout_head_observed_before_uid_switch="a" * 40,
                    child_source=self.child_raw, supervisor_source=self.supervisor_raw,
                    admission_source=self.admission_raw, admission_path=str(UI_PATH),
                    contract_path=str(contract_path))
            self.assertFalse(contract_path.exists())

    def test_missing_setup_or_admission_mismatch_returns_no_contract(self):
        raw, digest = intent_bytes()
        with tempfile.TemporaryDirectory() as temp:
            contract_path = Path(temp) / "private-contract.json"
            pinned_admission_path = Path(temp) / "admission.py"
            pinned_admission_path.write_bytes(self.admission_raw)
            pinned_admission_path.chmod(0o444)
            with patch.object(lineage, "read_root_owned_setup_receipt",
                              side_effect=AdmissionBuildError("actual setup receipt unavailable")):
                with self.assertRaisesRegex(AdmissionBuildError, "setup receipt unavailable"):
                    materialize_and_admit_before_browser(
                        intent_bytes=raw, expected_intent_sha256=digest, ui_receipt=self.ui,
                        checkout_head_observed_before_uid_switch="a" * 40,
                        child_source=self.child_raw, supervisor_source=self.supervisor_raw,
                        admission_source=self.admission_raw, admission_path=str(pinned_admission_path),
                        contract_path=str(contract_path))
            self.assertFalse(contract_path.exists())
        bad_actual = self.setup.replace(RECIPE_SHA256.encode(), b"0" * 64)
        temp, contract_path, _ = None, None, None
        with self.assertRaisesRegex(AdmissionBuildError, "original admission.py rejected"):
            temp, contract_path, _ = self.run_materialize(actual_setup=bad_actual)
        if temp is not None:
            self.assertTrue(contract_path.exists())
            temp.cleanup()

    def make_r4_dispatch(self, temp_root, input_sha="b" * 64,
                         prompt_bytes=b"Reviewed one-task R4 prompt\n"):
        checkout = temp_root / "checkout"
        checkout.mkdir()
        (checkout / ".git").mkdir()
        executable = temp_root / "codex"
        executable.write_bytes(b"offline executable fixture")
        prompt_path = checkout / "reviewed-prompt.txt"
        prompt_path.write_bytes(prompt_bytes)
        plan = CloudTaskPlan(
            executable=executable, cwd=checkout, environment_id=ENVIRONMENT,
            branch="codex/orquestacion-subagentes-20261013",
            public_prompt_file=prompt_path,
            prompt_sha256=hashlib.sha256(prompt_path.read_bytes()).hexdigest(),
            executable_sha256=hashlib.sha256(executable.read_bytes()).hexdigest(),
            expected_remote_head="a" * 40, timeout_seconds=10)
        _, _, request_sha = plan.request()
        raw, digest = prepare_controller_intent(
            request_sha=request_sha, input_sha=input_sha,
            prompt_sha256=plan.prompt_sha256, expected_head=plan.expected_remote_head,
            submission_reference="controller-dispatch:" + OPERATION)
        intent_path = temp_root / "frozen-intent.json"
        write_controller_intent_once(str(intent_path), checkout_root=str(checkout),
                                     intent_bytes=raw, intent_sha256=digest)
        class Bridge:
            def __init__(self):
                self.dispatches = 0; self.observations = []
                self.reserved = {"state": "reserved", "dispatch_contract_sha": request_sha,
                                 "input_sha": input_sha}
            def read(self, operation_id): return dict(self.reserved)
            def begin_dispatch(self, operation_id, contract_sha):
                self.dispatches += 1
                return {"input_sha": input_sha}
            def ingest(self, observation, now): self.observations.append(observation)
        bridge = Bridge()
        return plan, bridge, raw, digest, intent_path

    def test_r4_caller_consumes_one_slot_and_sends_exact_frozen_wire_once(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            plan, bridge, raw, digest, intent_path = self.make_r4_dispatch(root)
            cli = NativeCloudCLI(bridge)
            mocked = SimpleNamespace(returncode=0,
                                     stdout=b"created task_e_0123456789abcdef0123456789abcdef\n")
            with patch("native_cloud_cli.subprocess.run", return_value=mocked) as run:
                result = cli.submit_r4(OPERATION, plan, intent_bytes=raw,
                                       intent_sha256=digest, intent_record_path=intent_path)
            self.assertEqual(result["state"], "submitted")
            self.assertEqual(bridge.dispatches, 1)
            self.assertEqual(len(bridge.observations), 1)
            self.assertEqual(run.call_count, 1)
            wire = run.call_args.kwargs["input"]
            self.assertIn(b"ONIA_R4_INTENT_SHA256=" + digest.encode(), wire)
            self.assertIn(b"ONIA_R4_INTENT_JSON=" + raw, wire)
            self.assertEqual(result["wire_prompt_sha256"], hashlib.sha256(wire).hexdigest())
            self.assertEqual(result["wire_prompt_sha_semantics"], "exact_utf8_stdin_bytes")

    def test_r4_caller_rejects_changed_frozen_bytes_before_dispatch(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            plan, bridge, raw, digest, intent_path = self.make_r4_dispatch(root)
            with patch("native_cloud_cli.subprocess.run") as run:
                with self.assertRaisesRegex(ValueError, "record differs"):
                    NativeCloudCLI(bridge).submit_r4(
                        OPERATION, plan, intent_bytes=raw + b" ",
                        intent_sha256=digest, intent_record_path=intent_path)
            self.assertEqual(bridge.dispatches, 0)
            run.assert_not_called()

    def test_r4_caller_reconciles_reserved_input_mismatch_without_cli_call(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            plan, bridge, raw, digest, intent_path = self.make_r4_dispatch(
                root, input_sha="b" * 64)
            bridge.begin_dispatch = lambda operation_id, contract_sha: (
                setattr(bridge, "dispatches", bridge.dispatches + 1) or {"input_sha": "c" * 64})
            with patch("native_cloud_cli.subprocess.run") as run:
                result = NativeCloudCLI(bridge).submit_r4(
                    OPERATION, plan, intent_bytes=raw, intent_sha256=digest,
                    intent_record_path=intent_path)
            self.assertEqual(result["state"], "needs_reconcile")
            self.assertEqual(result["reason"], "reserved_input_sha_mismatch")
            self.assertEqual(bridge.dispatches, 1)
            run.assert_not_called()

    def test_r4_caller_rejects_old_bootstrap_reservation_before_consuming_slot(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            plan, bridge, raw, digest, intent_path = self.make_r4_dispatch(root)
            bridge.reserved["dispatch_contract_sha"] = "0" * 64
            with patch("native_cloud_cli.subprocess.run") as run:
                with self.assertRaisesRegex(RuntimeError, "reservation does not match"):
                    NativeCloudCLI(bridge).submit_r4(
                        OPERATION, plan, intent_bytes=raw, intent_sha256=digest,
                        intent_record_path=intent_path)
            self.assertEqual(bridge.dispatches, 0)
            run.assert_not_called()

    def test_r4_caller_rejects_prompt_with_existing_marker_before_consuming_slot(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            plan, bridge, raw, digest, intent_path = self.make_r4_dispatch(
                root, prompt_bytes=b"reviewed prompt already contains ONIA_R4_INTENT\n")
            with patch("native_cloud_cli.subprocess.run") as run:
                with self.assertRaisesRegex(ValueError, "clean reviewed prompt"):
                    NativeCloudCLI(bridge).submit_r4(
                        OPERATION, plan, intent_bytes=raw, intent_sha256=digest,
                        intent_record_path=intent_path)
            self.assertEqual(bridge.dispatches, 0)
            run.assert_not_called()


if __name__ == "__main__":
    unittest.main()
