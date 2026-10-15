"""Render the exact setup-only wrapper locally; never execute it or approve anything."""
import argparse
import base64
import hashlib
from pathlib import Path


def build_wrapper(recipe, manifest):
    recipe_b64 = base64.b64encode(recipe).decode('ascii')
    manifest_b64 = base64.b64encode(manifest).decode('ascii')
    recipe_sha = hashlib.sha256(recipe).hexdigest()
    payload = '''import base64, hashlib, json, os, stat, subprocess, tempfile
from pathlib import Path
RECIPE = base64.b64decode("RECIPE_BASE64", validate=True)
MANIFEST = base64.b64decode("MANIFEST_BASE64", validate=True)
EXPECTED_RECIPE = "RECIPE_DIGEST"
TRIAL = "9fc238a7-aa41-433c-8681-a9bf6ec6a340"
PARENT = "f90f55bc-48d8-406f-a11e-05ddd2683014"

def blocked(phase, reason, code=1):
    print(json.dumps({"state":"BLOCKED", "phase":phase, "reason":reason}), flush=True)
    raise SystemExit(code)

manifest = json.loads(MANIFEST)
if (manifest.get("state") != "APPROVED_FOR_SETUP_ONLY"
        or manifest.get("downloads_and_install_approved") is not True
        or not manifest.get("human_approval_reference")
        or not manifest.get("operation_authorization_reference")):
    blocked("approval", "setup-only trial remains pending explicit human approval")
if (manifest.get("operation_id") != TRIAL or manifest.get("parent_operation_id") != PARENT
        or manifest.get("operation_scope") != "SETUP_ONLY_SNAPSHOT_TRIAL"
        or manifest.get("recipe_sha256") != EXPECTED_RECIPE
        or hashlib.sha256(RECIPE).hexdigest() != EXPECTED_RECIPE):
    blocked("payload_validation", "exact setup-only operation/recipe binding missing")
if os.name != "posix" or os.getuid() != 0:
    blocked("bootstrap", "existing root Ubuntu setup interpreter required")
with tempfile.TemporaryDirectory(prefix="onia-setup-trial-") as staging:
    paths = []
    for name, data in (("setup_recipe.py", RECIPE), ("manifest.json", MANIFEST)):
        path = Path(staging) / name
        fd = os.open(path, os.O_WRONLY | os.O_CREAT | os.O_EXCL | os.O_NOFOLLOW, 0o444)
        with os.fdopen(fd, "wb") as stream:
            stream.write(data)
        paths.append(path)
    try:
        result = subprocess.run(["/usr/bin/python3", "-I", "-B", str(paths[0]),
                                 "--apply-reviewed-manifest", str(paths[1])],
                                stdin=subprocess.DEVNULL, stdout=subprocess.PIPE,
                                stderr=subprocess.DEVNULL, timeout=2400, check=False)
    except (OSError, subprocess.TimeoutExpired):
        blocked("recipe", "setup process unavailable or timed out; no automatic retry")
    if len(result.stdout) > 262144:
        blocked("recipe", "setup output exceeds recovery limit")
    # Recipe stdout is controlled JSON; do not export arbitrary output/stderr.
    records = []
    try:
        for line in result.stdout.decode("utf-8").splitlines():
            if line.strip():
                records.append(json.loads(line))
    except (ValueError, UnicodeError):
        blocked("recipe", "setup returned non-JSON output")
    if result.returncode:
        for record in records:
            if (isinstance(record, dict) and record.get("state") == "BLOCKED"
                    and isinstance(record.get("phase"), str)):
                print(json.dumps(record), flush=True)
        blocked("recipe", "setup failed; reconcile partial state without retry",
                result.returncode if 1 <= result.returncode <= 125 else 1)
    if len(records) != 1 or not isinstance(records[0], dict):
        blocked("receipt", "one actual setup receipt required before completion marker")
    receipt = records[0]
    expected = {"schema":1, "state":"INSTALLED_METADATA_ONLY", "browser_launched":False,
                "operation_id":TRIAL, "parent_operation_id":PARENT,
                "operation_scope":"SETUP_ONLY_SNAPSHOT_TRIAL", "recipe_sha256":EXPECTED_RECIPE,
                "environment_id":manifest.get("environment_id"),
                "operation_authorization_reference":manifest.get("operation_authorization_reference"),
                "setup_manifest_sha256":hashlib.sha256(MANIFEST).hexdigest()}
    if any(receipt.get(key) != value for key, value in expected.items()):
        blocked("receipt", "setup receipt binding mismatch")
    canonical = Path("/opt/onia-public-browser-1.64.0/setup-receipt.json")
    try:
        fd = os.open(canonical, os.O_RDONLY | os.O_NOFOLLOW)
    except OSError:
        blocked("receipt", "actual root-owned setup receipt unavailable")
    with os.fdopen(fd, "rb") as stream:
        meta = os.fstat(stream.fileno())
        if not stat.S_ISREG(meta.st_mode) or meta.st_uid != 0 or meta.st_mode & 0o022 or meta.st_size > 12288:
            blocked("receipt", "canonical actual receipt is not bounded root-owned protected data")
        actual = stream.read(12289)
    if len(actual) > 12288 or json.loads(actual) != receipt:
        blocked("receipt", "actual root-owned setup receipt differs from process receipt")
    print(json.dumps(receipt, sort_keys=True), flush=True)
'''
    payload = payload.replace('RECIPE_BASE64', recipe_b64).replace('MANIFEST_BASE64', manifest_b64).replace('RECIPE_DIGEST', recipe_sha)
    return ('#!/bin/sh\nset -e\n# Pending setup-only package; no browser or task agent.\n'
            "/usr/bin/python3 -I -B - <<'ONIA_SETUP_TRIAL_BOOTSTRAP'\n" + payload
            + "ONIA_SETUP_TRIAL_BOOTSTRAP\nprintf '%s\\n' ONIA_SETUP_TRIAL_COMPLETED\nexit 42\n")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    base = Path(__file__).parent
    args.output.write_bytes(build_wrapper((base / 'setup_recipe.py').read_bytes(),
                                         (base / 'reviewed-install-manifest-candidate.json').read_bytes()).encode())


if __name__ == '__main__':
    main()
