"""R4 admission only; no browser/provider/install calls in this module."""
import argparse
import base64
import hashlib
import json
import os
from pathlib import Path
import re
import stat
from datetime import datetime, timezone

OPERATION = "f90f55bc-48d8-406f-a11e-05ddd2683014"
RECIPE_SHA = "369f5ddd83e43a102a713baa109dc38bf717107fc341d07d420a2abf67495519"
ENVIRONMENT = "6abad782eba0819196ca234dc3abc327"
OLD_AUTH = "user:20261014-call_8e68f4ea274f44519647395ec9a62425-arreglo-prueba-unica"
OLD_RECEIPT = "8b75fbe34fb0ea88c06cba760213899088eaaa71954eba7cb8e4d30e7ca6ae32"
OLD_SAVED_AT = "2026-10-14T18:05:55.372Z"

def protected_bytes(path, limit):
    meta = path.lstat()
    if not stat.S_ISREG(meta.st_mode) or meta.st_mode & 0o022 or meta.st_size > limit:
        raise ValueError("unprotected or oversized admission/source")
    return path.read_bytes()

def digest(value):
    return hashlib.sha256(value).hexdigest()

def unique_object(pairs):
    result = {}
    for key, value in pairs:
        if key in result:
            raise ValueError("duplicate JSON field")
        result[key] = value
    return result

def strict_json(raw):
    value = json.loads(raw, object_pairs_hook=unique_object)
    if not isinstance(value, dict):
        raise ValueError("JSON object required")
    return value

def admission():
    parser = argparse.ArgumentParser(add_help=False)
    parser.add_argument("--contract", required=True)
    parser.add_argument("--contract-sha256", required=True)
    args, _ = parser.parse_known_args()
    raw = protected_bytes(Path(args.contract), 65536)
    if not re.fullmatch(r"[0-9a-f]{64}", args.contract_sha256) or digest(raw) != args.contract_sha256:
        raise ValueError("contract digest mismatch")
    c = strict_json(raw)
    if (c.get("schema") != 1 or c.get("operation_generation") != "R4"
            or c.get("operation_id") != OPERATION or c.get("repository") != "onia-hermes"
            or c.get("requested_ref") != "codex/orquestacion-subagentes-20261013"
            or c.get("environment_id") != ENVIRONMENT or c.get("root_authorization_verified") is not True
            or c.get("legacy_provider_configuration_accepted") is not True
            or c.get("approved_recipe_sha256") != RECIPE_SHA):
        raise ValueError("fresh root R4 admission missing")
    for key in ("authorization_reference", "submission_reference", "operation_nonce", "submit_nonce"):
        value = c.get(key)
        if not isinstance(value, str) or not 1 <= len(value) <= 256 or "PLANNED" in value or "PENDING" in value:
            raise ValueError("actual fresh reference/nonce required")
    if (c["operation_nonce"] != "planned-browser-009625eb-36ea-47cc-830c-7957aa96a4d4"
            or c["submit_nonce"] != "planned-submit-d6b5544f-84de-494b-9db1-417727a727fa"):
        raise ValueError("root planned nonce binding mismatch")
    if c["authorization_reference"] == OLD_AUTH or not c["authorization_reference"].startswith("user:"):
        raise ValueError("fresh human grant reference required")
    for key in ("input_sha", "configuration_receipt_sha256", "setup_receipt_sha256", "child_source_sha256", "supervisor_source_sha256", "admission_source_sha256"):
        if not isinstance(c.get(key), str) or not re.fullmatch(r"[0-9a-f]{64}", c[key]):
            raise ValueError("exact digest required")
    if c["admission_source_sha256"] != digest(protected_bytes(Path(__file__), 32768)):
        raise ValueError("admission source mismatch")
    if c["configuration_receipt_sha256"] == OLD_RECEIPT:
        raise ValueError("old R3 receipt rejected")
    receipts = {}
    for key in ("configuration", "setup"):
        encoded = c.get(key + "_receipt_base64")
        if not isinstance(encoded, str) or len(encoded) > 16384:
            raise ValueError("bounded actual public receipt required")
        raw_receipt = base64.b64decode(encoded, validate=True)
        if digest(raw_receipt) != c[key + "_receipt_sha256"]:
            raise ValueError("receipt digest mismatch")
        receipts[key] = strict_json(raw_receipt)
    config = receipts["configuration"]
    provider = config.get("provider_saved_configuration")
    if (config.get("environment_id") != ENVIRONMENT or config.get("recipe_sha256") != RECIPE_SHA
            or config.get("approval_reference") != c["authorization_reference"] or not isinstance(provider, dict)
            or provider.get("saved_at_utc") == OLD_SAVED_AT
            or provider.get("saved_at_utc") != c.get("configuration_saved_at_utc")):
        raise ValueError("fresh configuration receipt binding failed")
    if (not isinstance(c.get("configuration_saved_at_utc"), str)
            or not re.fullmatch(r"\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|\+00:00)", c["configuration_saved_at_utc"])
            or provider.get("surface") != "codex-cloud-legacy-ui" or not provider.get("evidence_reference")
            or provider.get("cache_enabled") is not True or provider.get("network_access") != "limited"
            or provider.get("preset") != "None" or set(provider.get("domains", [])) != {"example.com", "iana.org", "www.iana.org"}
            or set(provider.get("methods", [])) != {"GET", "HEAD", "OPTIONS"}
            or strict_json(os.environ.get("ONIA_BROWSER_PROVIDER_SAVED_CONFIGURATION_JSON", "null")) != provider):
        raise ValueError("actual provider guard/receipt mismatch")
    actual_setup_path = Path("/opt/onia-public-browser-1.64.0/setup-receipt.json")
    if actual_setup_path.lstat().st_uid != 0:
        raise ValueError("actual setup receipt must remain root-owned")
    actual_setup_bytes = protected_bytes(actual_setup_path, 12288)
    if digest(actual_setup_bytes) != c["setup_receipt_sha256"]:
        raise ValueError("contract setup receipt does not match actual pinned cache record")
    setup = receipts["setup"]
    if (setup.get("state") != "INSTALLED_METADATA_ONLY" or setup.get("browser_uid_required") != 1000
            or setup.get("python") != "/opt/onia-public-browser-1.64.0/venv/bin/python"
            or setup.get("browser_launched") is not False):
        raise ValueError("actual installed setup receipt missing")
    if (setup.get("schema") != 1 or setup.get("environment_id") != ENVIRONMENT
            or setup.get("operation_id") != OPERATION or setup.get("recipe_sha256") != RECIPE_SHA
            or setup.get("operation_authorization_reference") != c["authorization_reference"]
            or setup.get("receipt_provenance") != "pinned_installer_actual_success_after_component_validation"):
        raise ValueError("actual fresh setup lineage mismatch")
    start = datetime.fromisoformat(setup["started_at_utc"].replace("Z", "+00:00"))
    finish = datetime.fromisoformat(setup["finished_at_utc"].replace("Z", "+00:00"))
    saved = datetime.fromisoformat(c["configuration_saved_at_utc"].replace("Z", "+00:00"))
    if any(value.utcoffset() != timezone.utc.utcoffset(value) for value in (start, finish, saved)):
        raise ValueError("actual setup/config timestamps must be UTC")
    if not saved <= start <= finish <= datetime.now(timezone.utc):
        raise ValueError("actual setup freshness mismatch")
    return c

def historical_source(name, expected_sha):
    source = Path(__file__).resolve().parent.parent / "r3" / name
    raw = protected_bytes(source, 65536)
    if digest(raw) != expected_sha:
        raise ValueError("historical R3 source changed")
    return raw.decode("utf-8")

def replace_once(source, old, new):
    if source.count(old) != 1:
        raise ValueError("unsupported historical admission layout")
    return source.replace(old, new, 1)
