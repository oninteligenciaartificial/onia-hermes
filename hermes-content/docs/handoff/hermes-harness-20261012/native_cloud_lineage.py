"""Small R4 admission-contract builder; no Cloud/provider side effects.

The trusted controller supplies the already-reviewed pre-submit intent. This
module materializes the original admission.py contract after setup has
produced its receipt. It validates receipt contents, not filesystem ownership;
the unchanged admission.py verifies bytes against the root-owned runtime file.
It does not attest to provider behavior or authorize a new operation.
"""
import base64
import hashlib
import json
import os
from pathlib import Path
import re

OPERATION = "f90f55bc-48d8-406f-a11e-05ddd2683014"
ENVIRONMENT = "6abad782eba0819196ca234dc3abc327"
RECIPE_SHA256 = "369f5ddd83e43a102a713baa109dc38bf717107fc341d07d420a2abf67495519"
UI_RECEIPT_SHA256 = "08908c94ae0f162f79caaeffc37936920084a4c7ff408c77bd4e05bd00cb2895"
CHILD_SHA256 = "bd87c4c34307ca6ada693bb11486d1c38fc5d3ab996665a8a2e633185ff20c14"
SUPERVISOR_SHA256 = "f4797c248dcfacd040f504bc0769cd6a26d7f03e539e8274c8696664d3b2461b"
ADMISSION_SHA256 = "9921253f9d510883c598d83a485eeb3768a27e185dbb857f58455fdad8dc2fb3"
SETUP_RECEIPT_PATH = "/opt/onia-public-browser-1.64.0/setup-receipt.json"
INTENT_SHA256_ENV = "ONIA_R4_ROOT_INTENT_SHA256"
OPERATION_NONCE = "planned-browser-009625eb-36ea-47cc-830c-7957aa96a4d4"
SUBMIT_NONCE = "planned-submit-d6b5544f-84de-494b-9db1-417727a727fa"
OPERATION_AUTH_REFERENCE = "user:01a13cc1-12e9-79a0-97e8-4899f05a5c95:R4-20261014"
SETUP_AUTH_REFERENCE = "user:01a13cc1-12e9-79a0-97e8-4899f05a5c95:setup-R4-autonomia-20261014"
_SHA = re.compile(r"[0-9a-f]{64}\Z")


class AdmissionBuildError(ValueError):
    pass


def _json_object(raw: bytes, label: str) -> dict:
    def unique(pairs):
        obj = {}
        for key, value in pairs:
            if key in obj:
                raise AdmissionBuildError(f"duplicate {label} field")
            obj[key] = value
        return obj
    try:
        value = json.loads(raw.decode("utf-8", "strict"), object_pairs_hook=unique)
    except (UnicodeError, ValueError, TypeError) as exc:
        raise AdmissionBuildError(f"invalid {label} JSON") from exc
    if type(value) is not dict:
        raise AdmissionBuildError(f"{label} must be an object")
    return value


def _utc(value: object) -> bool:
    return (isinstance(value, str) and bool(re.fullmatch(
        r"\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z", value)))


def prepare_controller_intent(*, request_sha: str, input_sha: str, prompt_sha256: str,
                              expected_head: str,
                              submission_reference: str) -> tuple[bytes, str]:
    """Freeze Root-reviewed, one-operation intent bytes before transport.

    Dynamic hashes/HEAD come from the controller's reviewed CloudTaskPlan and
    the pre-dispatch queue reservation. All authority and effect limits are
    pinned here to the already reviewed R4 grants; no task JSON can widen them.
    """
    for name, value in (("request_sha", request_sha), ("input_sha", input_sha),
                        ("prompt_sha256", prompt_sha256)):
        if not isinstance(value, str) or not _SHA.fullmatch(value):
            raise AdmissionBuildError(f"{name} must be a controller-computed SHA-256")
    if not isinstance(expected_head, str) or not re.fullmatch(r"[0-9a-f]{40}", expected_head):
        raise AdmissionBuildError("full reviewed 40-character expected HEAD required")
    if (not isinstance(submission_reference, str) or not submission_reference.startswith("controller-dispatch:")
            or len(submission_reference) > 256):
        raise AdmissionBuildError("local pre-submit dispatch reference required")
    intent = {
        "schema": 1, "operation_generation": "R4", "operation_id": OPERATION,
        "request_sha": request_sha, "input_sha": input_sha,
        "prompt_sha256": prompt_sha256, "repository": "onia-hermes",
        "requested_ref": "codex/orquestacion-subagentes-20261013",
        "expected_head": expected_head, "environment_id": ENVIRONMENT,
        "operation_nonce": OPERATION_NONCE, "submit_nonce": SUBMIT_NONCE,
        "authorization_reference": OPERATION_AUTH_REFERENCE,
        "configuration_grant_reference": SETUP_AUTH_REFERENCE,
        "approved_recipe_sha256": RECIPE_SHA256,
        "legacy_provider_configuration_accepted": True,
        "submission_reference": submission_reference,
        "limits": {"submit": 1, "status": 2, "collect": 1},
    }
    raw = json.dumps(intent, sort_keys=True, separators=(",", ":")).encode("ascii")
    return raw, hashlib.sha256(raw).hexdigest()


def append_intent_to_prompt(prompt_bytes: bytes, intent_bytes: bytes,
                            expected_intent_sha256: str) -> tuple[bytes, str]:
    """Return exact stdin bytes plus local wire SHA; intent excludes wire SHA."""
    if not isinstance(prompt_bytes, bytes) or not prompt_bytes.strip() or b"ONIA_R4_INTENT" in prompt_bytes:
        raise AdmissionBuildError("clean reviewed prompt bytes required")
    if hashlib.sha256(intent_bytes).hexdigest() != expected_intent_sha256:
        raise AdmissionBuildError("frozen pre-submit intent digest mismatch")
    _parse_controller_intent(intent_bytes, expected_intent_sha256)
    wire = (prompt_bytes + b"\nONIA_R4_INTENT_SHA256=" + expected_intent_sha256.encode("ascii")
            + b"\nONIA_R4_INTENT_JSON=" + intent_bytes + b"\n")
    return wire, hashlib.sha256(wire).hexdigest()


def write_controller_intent_once(path: str, *, checkout_root: str,
                                 intent_bytes: bytes, intent_sha256: str) -> str:
    """Persist exact intent outside checkout, refusing overwrite/replay."""
    if hashlib.sha256(intent_bytes).hexdigest() != intent_sha256:
        raise AdmissionBuildError("intent bytes do not match frozen digest")
    target = Path(path).resolve()
    checkout = Path(checkout_root).resolve()
    if not target.is_absolute() or target.is_relative_to(checkout):
        raise AdmissionBuildError("intent record must live outside the source checkout")
    flags = os.O_WRONLY | os.O_CREAT | os.O_EXCL | getattr(os, "O_NOFOLLOW", 0)
    try:
        fd = os.open(str(target), flags, 0o600)
        with os.fdopen(fd, "wb") as stream:
            stream.write(intent_bytes)
            stream.flush()
            os.fsync(stream.fileno())
    except OSError as exc:
        raise AdmissionBuildError("intent record already exists or cannot be safely created") from exc
    return intent_sha256


def _parse_controller_intent(intent_bytes: bytes, expected_sha256: str) -> dict:
    if (not isinstance(intent_bytes, bytes) or not _SHA.fullmatch(str(expected_sha256))
            or hashlib.sha256(intent_bytes).hexdigest() != expected_sha256):
        raise AdmissionBuildError("Root/controller-frozen intent hash mismatch")
    value = _json_object(intent_bytes, "controller intent")
    if (value.get("schema") != 1 or value.get("operation_generation") != "R4"
            or value.get("operation_id") != OPERATION
            or value.get("repository") != "onia-hermes"
            or value.get("requested_ref") != "codex/orquestacion-subagentes-20261013"
            or value.get("environment_id") != ENVIRONMENT
            or value.get("authorization_reference") != OPERATION_AUTH_REFERENCE
            or value.get("configuration_grant_reference") != SETUP_AUTH_REFERENCE
            or value.get("operation_nonce") != OPERATION_NONCE
            or value.get("submit_nonce") != SUBMIT_NONCE
            or value.get("approved_recipe_sha256") != RECIPE_SHA256
            or value.get("legacy_provider_configuration_accepted") is not True
            or value.get("limits") != {"submit": 1, "status": 2, "collect": 1}
            or not isinstance(value.get("input_sha"), str) or not _SHA.fullmatch(value["input_sha"])
            or not isinstance(value.get("request_sha"), str) or not _SHA.fullmatch(value["request_sha"])
            or not isinstance(value.get("prompt_sha256"), str) or not _SHA.fullmatch(value["prompt_sha256"])
            or not isinstance(value.get("expected_head"), str)
            or not re.fullmatch(r"[0-9a-f]{40}", value["expected_head"])
            or not isinstance(value.get("submission_reference"), str)
            or not value["submission_reference"].startswith("controller-dispatch:")
            or len(value["submission_reference"]) > 256):
        raise AdmissionBuildError("frozen R4 controller intent has unexpected pins or limits")
    return value


def read_root_owned_setup_receipt(path: str = SETUP_RECEIPT_PATH,
                                  *, max_bytes: int = 12288) -> bytes:
    """Read the one canonical setup receipt as an actual root-owned file."""
    if path != SETUP_RECEIPT_PATH or type(max_bytes) is not int or not 1 <= max_bytes <= 12288:
        raise AdmissionBuildError("canonical setup receipt path and bounded size required")
    nofollow = getattr(os, "O_NOFOLLOW", None)
    if nofollow is None:
        raise AdmissionBuildError("no-follow file access unavailable")
    try:
        fd = os.open(path, os.O_RDONLY | nofollow | getattr(os, "O_CLOEXEC", 0))
        try:
            meta = os.fstat(fd)
            import stat
            if (not stat.S_ISREG(meta.st_mode) or meta.st_uid != 0
                    or meta.st_mode & 0o022 or meta.st_size > max_bytes):
                raise AdmissionBuildError("setup receipt is not protected root-owned file")
            chunks, total = [], 0
            while True:
                block = os.read(fd, min(4096, max_bytes + 1 - total))
                if not block:
                    break
                total += len(block)
                if total > max_bytes:
                    raise AdmissionBuildError("setup receipt exceeds size limit")
                chunks.append(block)
            return b"".join(chunks)
        finally:
            os.close(fd)
    except OSError as exc:
        raise AdmissionBuildError("actual setup receipt unavailable") from exc


def _write_contract_once(path: str, contract: dict) -> tuple[str, str]:
    target = Path(path).resolve()
    if (not target.is_absolute() or not str(target).startswith("/workspace/")
            or not hasattr(os, "getuid") or os.getuid() != 0):
        raise AdmissionBuildError("root bootstrap and private UID1000 workspace path required")
    try:
        parent = target.parent.lstat()
    except OSError as exc:
        raise AdmissionBuildError("precreated private workspace directory required") from exc
    import stat
    if (not stat.S_ISDIR(parent.st_mode) or parent.st_uid != 1000
            or stat.S_IMODE(parent.st_mode) != 0o700):
        raise AdmissionBuildError("contract parent must be UID1000-owned mode 0700")
    raw = json.dumps(contract, sort_keys=True, separators=(",", ":")).encode("utf-8")
    flags = os.O_WRONLY | os.O_CREAT | os.O_EXCL | getattr(os, "O_NOFOLLOW", 0)
    try:
        fd = os.open(str(target), flags, 0o600)
        with os.fdopen(fd, "wb") as stream:
            stream.write(raw)
            stream.flush()
            os.fsync(stream.fileno())
            os.fchown(stream.fileno(), 1000, parent.st_gid)
            os.fchmod(stream.fileno(), 0o600)
            saved = os.fstat(stream.fileno())
            if saved.st_uid != 1000 or stat.S_IMODE(saved.st_mode) != 0o600:
                raise AdmissionBuildError("contract ownership/mode handoff failed")
            os.fsync(stream.fileno())
    except OSError as exc:
        raise AdmissionBuildError("private contract already exists or cannot be created") from exc
    return raw.decode("utf-8"), hashlib.sha256(raw).hexdigest()


def derive_configuration_receipt(ui_receipt: bytes, *, authorization_reference: str,
                                 configuration_grant_reference: str) -> bytes:
    """Derive admission's canonical config receipt from pinned saved-UI evidence.

    The UI artifact is source evidence, not itself an admission receipt. Its
    `saved_at_utc` value remains explicitly described as a local observation.
    """
    if hashlib.sha256(ui_receipt).hexdigest() != UI_RECEIPT_SHA256:
        raise AdmissionBuildError("UI readback digest mismatch")
    source = _json_object(ui_receipt, "UI readback")
    provider = source.get("provider_saved_configuration")
    if (source.get("receipt_type") != "codex_cloud_environment_save_readback"
            or source.get("r4_operation") != OPERATION
            or source.get("environment_id") != ENVIRONMENT
            or authorization_reference != OPERATION_AUTH_REFERENCE
            or configuration_grant_reference != SETUP_AUTH_REFERENCE
            or source.get("grant_reference") != configuration_grant_reference
            or source.get("provider_json_readback_exact_match") is not True
            or not isinstance(source.get("save_confirmation"), str)
            or not source["save_confirmation"].strip()
            or not isinstance(source.get("provider_saved_at_semantics"), str)
            or "not an exact provider-side save timestamp" not in source["provider_saved_at_semantics"]
            or type(provider) is not dict):
        raise AdmissionBuildError("UI evidence does not bind exact R4 grant/readback")
    expected = {
        "surface": "codex-cloud-legacy-ui", "cache_enabled": True,
        "network_access": "limited", "preset": "None",
        "domains": ["example.com", "iana.org", "www.iana.org"],
        "methods": ["GET", "HEAD", "OPTIONS"],
    }
    if provider != {**expected, "evidence_reference": provider.get("evidence_reference"),
                    "saved_at_utc": provider.get("saved_at_utc")}:
        raise AdmissionBuildError("saved provider configuration differs from reviewed values")
    if (not isinstance(provider.get("evidence_reference"), str)
            or not provider["evidence_reference"] or not _utc(provider.get("saved_at_utc"))):
        raise AdmissionBuildError("provider config evidence/timestamp malformed")
    canonical = {
        "schema": 1,
        "environment_id": ENVIRONMENT,
        "recipe_sha256": RECIPE_SHA256,
        "approval_reference": authorization_reference,
        "source_ui_grant_reference": configuration_grant_reference,
        "source_ui_receipt_sha256": UI_RECEIPT_SHA256,
        "source_ui_readback_exact_match": True,
        "source_ui_observed_at_utc": source.get("observed_at_utc"),
        "saved_at_utc_semantics": source["provider_saved_at_semantics"],
        "provider_saved_configuration": provider,
    }
    if not _utc(canonical["source_ui_observed_at_utc"]):
        raise AdmissionBuildError("UI observation timestamp malformed")
    return json.dumps(canonical, sort_keys=True, separators=(",", ":")).encode("utf-8")


def build_admission_contract(intent_bytes: bytes, *, expected_intent_sha256: str,
                             ui_receipt: bytes,
                             setup_receipt: bytes,
                             checkout_head_observed_before_uid_switch: str,
                             child_source: bytes, supervisor_source: bytes,
                             admission_source: bytes) -> dict:
    """Complete the original admission schema from fixed intent + actual receipts.

    `intent_bytes` and its expected hash are frozen before transport by the
    Root-reviewed caller. Do not take them from task-produced result JSON.
    Runtime receipt fields are evidence only; this function makes no
    cryptographic/provider attestation claim.
    """
    intent = _parse_controller_intent(intent_bytes, expected_intent_sha256)
    if checkout_head_observed_before_uid_switch != intent["expected_head"]:
        raise AdmissionBuildError("observed checkout HEAD differs from Root-bound expected HEAD")
    if hashlib.sha256(child_source).hexdigest() != CHILD_SHA256:
        raise AdmissionBuildError("pinned browser child source mismatch")
    if hashlib.sha256(supervisor_source).hexdigest() != SUPERVISOR_SHA256:
        raise AdmissionBuildError("pinned supervisor source mismatch")
    if hashlib.sha256(admission_source).hexdigest() != ADMISSION_SHA256:
        raise AdmissionBuildError("pinned admission source mismatch")
    auth = intent.get("authorization_reference")
    config_grant = intent.get("configuration_grant_reference")
    if not isinstance(setup_receipt, bytes) or not setup_receipt:
        raise AdmissionBuildError("setup receipt bytes required; ownership is checked by admission.py")
    config_bytes = derive_configuration_receipt(
        ui_receipt, authorization_reference=auth,
        configuration_grant_reference=config_grant)
    setup = _json_object(setup_receipt, "setup receipt")
    if (setup.get("schema") != 1 or setup.get("environment_id") != ENVIRONMENT
            or setup.get("operation_id") != OPERATION
            or setup.get("recipe_sha256") != RECIPE_SHA256
            or setup.get("operation_authorization_reference") != auth
            or setup.get("state") != "INSTALLED_METADATA_ONLY"
            or setup.get("browser_launched") is not False
            or setup.get("receipt_provenance") != "pinned_installer_actual_success_after_component_validation"
            or setup.get("browser_uid_required") != 1000
            or setup.get("python") != "/opt/onia-public-browser-1.64.0/venv/bin/python"
            or not _utc(setup.get("started_at_utc")) or not _utc(setup.get("finished_at_utc"))):
        raise AdmissionBuildError("actual install-only setup receipt mismatch")
    config = _json_object(config_bytes, "canonical configuration receipt")
    return {
        "schema": 1, "operation_generation": "R4", "operation_id": OPERATION,
        "repository": "onia-hermes", "requested_ref": "codex/orquestacion-subagentes-20261013",
        "expected_head": intent["expected_head"],
        "checkout_head_observed_before_uid_switch": checkout_head_observed_before_uid_switch,
        "checkout_directory": intent.get("checkout_directory", ""),
        "environment_id": ENVIRONMENT, "root_authorization_verified": True,
        "authorization_reference": auth,
        "submission_reference": intent["submission_reference"],
        "input_sha": intent["input_sha"], "operation_nonce": OPERATION_NONCE,
        "submit_nonce": SUBMIT_NONCE, "approved_recipe_sha256": RECIPE_SHA256,
        "legacy_provider_configuration_accepted": True,
        "supported_runtime_policy_contradiction": False,
        "configuration_receipt_sha256": hashlib.sha256(config_bytes).hexdigest(),
        "configuration_saved_at_utc": config["provider_saved_configuration"]["saved_at_utc"],
        "configuration_receipt_base64": base64.b64encode(config_bytes).decode("ascii"),
        "setup_receipt_sha256": hashlib.sha256(setup_receipt).hexdigest(),
        "setup_receipt_base64": base64.b64encode(setup_receipt).decode("ascii"),
        "child_source_sha256": CHILD_SHA256, "supervisor_source_sha256": SUPERVISOR_SHA256,
        "admission_source_sha256": hashlib.sha256(admission_source).hexdigest(),
    }


def materialize_and_admit_before_browser(*, intent_bytes: bytes,
                                         expected_intent_sha256: str,
                                         ui_receipt: bytes,
                                         checkout_head_observed_before_uid_switch: str,
                                         child_source: bytes,
                                         supervisor_source: bytes,
                                         admission_source: bytes,
                                         admission_path: str,
                                         contract_path: str) -> dict:
    """Build private contract from the real setup receipt and run original guard.

    The caller must invoke this before supervisor/browser entry. A failed
    admission raises and returns no contract, so the caller has no admitted
    object to pass to either stage. The caller still owns the execution order.
    """
    # Root/transport stores this public pin in the Cloud environment and
    # verifies its saved value in the UI before the sole submit. Do not set it
    # here: comparing a task-provided value to one it just wrote is tautological.
    pinned_intent_sha256 = os.environ.get(INTENT_SHA256_ENV)
    if (not isinstance(pinned_intent_sha256, str)
            or pinned_intent_sha256 != expected_intent_sha256
            or not _SHA.fullmatch(pinned_intent_sha256)
            or hashlib.sha256(intent_bytes).hexdigest() != pinned_intent_sha256):
        raise AdmissionBuildError("independent Root intent environment pin missing or mismatched")
    source_path = Path(admission_path)
    try:
        source_meta = source_path.lstat()
        source_is_protected = (source_path.is_file() and not source_path.is_symlink()
                               and (os.name == "nt" or not source_meta.st_mode & 0o022)
                               and source_meta.st_size <= 32768)
    except OSError:
        source_is_protected = False
    if (not source_path.is_absolute() or not source_is_protected
            or source_path.read_bytes() != admission_source
            or hashlib.sha256(admission_source).hexdigest() != ADMISSION_SHA256):
        raise AdmissionBuildError("pinned admission source mismatch")
    setup_bytes = read_root_owned_setup_receipt()
    contract = build_admission_contract(
        intent_bytes, expected_intent_sha256=expected_intent_sha256,
        ui_receipt=ui_receipt, setup_receipt=setup_bytes,
        checkout_head_observed_before_uid_switch=checkout_head_observed_before_uid_switch,
        child_source=child_source, supervisor_source=supervisor_source,
        admission_source=admission_source)
    raw, digest = _write_contract_once(contract_path, contract)
    previous_argv = list(__import__("sys").argv)
    try:
        __import__("sys").argv = ["admission.py", "--contract", contract_path,
                                 "--contract-sha256", digest]
        namespace = {"__name__": "r4_original_admission", "__file__": str(source_path)}
        exec(compile(admission_source, namespace["__file__"], "exec"), namespace)
        admitted = namespace["admission"]()
    except Exception as exc:
        raise AdmissionBuildError("original admission.py rejected contract; browser must remain blocked") from exc
    finally:
        __import__("sys").argv = previous_argv
    return admitted
