#!/usr/bin/env python3
"""Create a one-use binding only after a separately recorded root GO."""
import argparse
import hashlib
import json
import os
import re
import secrets
import stat
import subprocess
import sys
from pathlib import Path

BASE_DIGEST = "sha256:aa81288e738725378becba5b3e06cb0f3a7f012a610e87e8d767a090ea3f740d"
BASE_IMAGE = "mcr.microsoft.com/playwright/python:v1.62.0-noble@" + BASE_DIGEST
IMAGE_TAG = "onia/playwright-python:1.62.0-noble-lock-52e857275e07"
DERIVED_IMAGE_ID = "sha256:5b1051bc16e1214877af33b8bf453c3d9fec29479632847f534c44afba35f4f2"
LOCK_SHA256 = "52e857275e075417fa9e5b934f3b41d0366a55fc25187b7f40dbb3df34ed6a4e"
SECCOMP_SHA256 = "cc3e61cabda6bbc1e53e54d27ba4d55a9d3be829b6dd1a596f4a7b31b1cc7849"
UPSTREAM_MANIFEST_SHA256 = "f1b7b1dfa9c60330fc9d2184a2a266efbfcdfc3b4733ee0fd9dd5f372906f78b"
PARENT_SOURCE_MANIFEST_SHA256 = "eca709d70bda1576223f508ab4501111687ca0103f33bf0816e9be16dff7bf2c"
INSTALL_RECEIPT_SHA256 = "4caf3c228525615922879f7a3c9444bf135450cb3b5e930bd6c22be2f79779a0"
IMAGE_REVIEW_SHA256 = "2a346e2a4d3adb6eae2bc6b1f9337255855d899bbd561ed322a7de276dac0850"
TARGET_ID = "offline-synthetic"
HARD_TIMEOUT_SECONDS = 75
TIMEOUT_GRACE_SECONDS = 2
CONTROL_ROOT = Path("/var/lib/onia-browser-control")
HERE = Path(__file__).resolve().parent
CONTRACT_NAME = "diagnostic-trial-contract-20261014.md"
CONTRACT_START = "<!-- HERMES_DIAGNOSTIC_BINDING_START -->"
CONTRACT_END = "<!-- HERMES_DIAGNOSTIC_BINDING_END -->"


def effective_uid():
    getuid = getattr(os, "geteuid", None)
    return getuid() if getuid is not None else -1


def sha256_file(path):
    path = Path(path)
    if path.is_symlink() or not path.is_file():
        raise RuntimeError("required bundle file missing or unsafe")
    return hashlib.sha256(path.read_bytes()).hexdigest()


def read_contract_spec(bundle_root):
    text = (Path(bundle_root) / CONTRACT_NAME).read_text(encoding="utf-8")
    if text.count(CONTRACT_START) != 1 or text.count(CONTRACT_END) != 1:
        raise RuntimeError("contract binding block missing or ambiguous")
    block = text.split(CONTRACT_START, 1)[1].split(CONTRACT_END, 1)[0].strip()
    lines = block.splitlines()
    if len(lines) >= 3 and lines[0].startswith("```") and lines[-1].strip() == "```":
        block = "\n".join(lines[1:-1]).strip()
    spec = json.loads(block)
    expected_keys = {"runner_sha256", "target_id", "hard_timeout_seconds",
                     "timeout_grace_seconds", "derived_image_id"}
    if set(spec) != expected_keys:
        raise RuntimeError("contract binding fields malformed")
    return spec


def validate_bundle(bundle_root):
    root = Path(bundle_root)
    manifest_path = root / "manifest.json"
    source_path = root / "source-manifest.json"
    if sha256_file(source_path) != PARENT_SOURCE_MANIFEST_SHA256:
        raise RuntimeError("parent source manifest hash mismatch")
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    if manifest.get("parent", {}).get("source_manifest_sha256") != PARENT_SOURCE_MANIFEST_SHA256:
        raise RuntimeError("bundle manifest parent mismatch")
    if manifest.get("parent", {}).get("derived_image_id") != DERIVED_IMAGE_ID:
        raise RuntimeError("bundle manifest image mismatch")
    if manifest.get("parent", {}).get("run_once_wrapper_v2_sha256") != sha256_file(root / "run-once.sh"):
        raise RuntimeError("bundle wrapper hash mismatch")
    declared = {entry.get("name"): entry for entry in manifest.get("files", [])}
    if not declared:
        raise RuntimeError("bundle file inventory missing")
    for name, entry in declared.items():
        if not isinstance(name, str) or Path(name).name != name:
            raise RuntimeError("bundle file inventory malformed")
        path = root / name
        actual = sha256_file(path)
        if actual != entry.get("sha256") or path.stat().st_size != entry.get("size_bytes"):
            raise RuntimeError("bundle file hash mismatch")
    parent_manifest = json.loads(source_path.read_text(encoding="utf-8"))
    parent_hashes = {entry["name"]: entry["sha256"] for entry in parent_manifest.get("files", [])}
    if len(parent_hashes) != 16:
        raise RuntimeError("parent source inventory malformed")
    overrides = {name: declared[name]["sha256"] for name in
                 ("bind-approval.py", "browser-runner.py", "run-once.sh")}
    if manifest.get("bundle", {}).get("parent_source_overrides_v2") != overrides:
        raise RuntimeError("manifest v2 override inventory mismatch")
    for name, parent_hash in parent_hashes.items():
        expected = overrides.get(name, parent_hash)
        if name not in declared or sha256_file(root / name) != expected:
            raise RuntimeError("parent sibling changed outside explicit v2 overrides")
    runner_hash = sha256_file(root / "browser-runner.py")
    wrapper_hash = sha256_file(root / "run-once.sh")
    binder_hash = sha256_file(root / "bind-approval.py")
    contract_hash = sha256_file(root / CONTRACT_NAME)
    spec = read_contract_spec(root)
    if spec != {"runner_sha256": runner_hash, "target_id": TARGET_ID,
                "hard_timeout_seconds": HARD_TIMEOUT_SECONDS,
                "timeout_grace_seconds": TIMEOUT_GRACE_SECONDS,
                "derived_image_id": DERIVED_IMAGE_ID}:
        raise RuntimeError("contract parameters do not match exact v2 runtime")
    if manifest.get("bundle", {}).get("parent_siblings_exact_hash_count") != 13:
        raise RuntimeError("parent sibling identity count mismatch")
    if sha256_file(root / "install-receipt.json") != INSTALL_RECEIPT_SHA256:
        raise RuntimeError("installation receipt hash mismatch")
    if sha256_file(root / "image-identity-review.json") != IMAGE_REVIEW_SHA256:
        raise RuntimeError("image review receipt hash mismatch")
    return {"manifest": manifest, "bundle_manifest_sha256": sha256_file(manifest_path),
            "runner_sha256": runner_hash,
            "wrapper_sha256": wrapper_hash, "binder_sha256": binder_hash,
            "contract_sha256": contract_hash, "source_manifest_sha256": PARENT_SOURCE_MANIFEST_SHA256,
            "install_receipt_sha256": INSTALL_RECEIPT_SHA256,
            "image_review_report_sha256": IMAGE_REVIEW_SHA256, "contract_spec": spec}


def private_owned(path):
    p = Path(path)
    st = p.lstat()
    return not p.is_symlink() and st.st_uid == os.geteuid() and (st.st_mode & 0o077) == 0


def exclusive_private(path, content):
    flags = os.O_WRONLY | os.O_CREAT | os.O_EXCL
    if hasattr(os, "O_NOFOLLOW"):
        flags |= os.O_NOFOLLOW
    fd = os.open(str(path), flags, 0o600)
    with os.fdopen(fd, "w", encoding="utf-8") as stream:
        stream.write(content)
        stream.flush()
        os.fsync(stream.fileno())


def fsync_directory(path):
    fd = os.open(str(path), os.O_RDONLY)
    try:
        os.fsync(fd)
    finally:
        os.close(fd)


def inspect_image(image_id):
    result = subprocess.run(["docker", "--context", "default", "image", "inspect", "--format",
        "{{.Id}}|{{.Config.User}}|{{json .Config.Labels}}", IMAGE_TAG], stdin=subprocess.DEVNULL,
        stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, text=True, timeout=3, check=False,
        env={"PATH": "/usr/bin:/bin", "HOME": "/root", "LANG": "C.UTF-8"})
    if result.returncode:
        raise RuntimeError("derived image unavailable")
    try:
        actual_id, configured_user, labels_json = result.stdout.strip().split("|", 2)
        labels = json.loads(labels_json)
    except (ValueError, TypeError):
        raise RuntimeError("image inspection metadata malformed") from None
    return actual_id, configured_user, labels


def validate_root_go(root, values):
    gate = root / "root-go.json"
    if gate.is_symlink() or not gate.is_file() or not private_owned(gate):
        raise RuntimeError("explicit post-QA root GO receipt missing or unsafe")
    data = json.loads(gate.read_text(encoding="utf-8"))
    expected = {"status": "approved", "scope": "single_offline_synthetic_trial",
        "bundle_manifest_sha256": values["bundle_manifest_sha256"],
        "runner_sha256": values["runner_sha256"], "contract_sha256": values["contract_sha256"],
        "target_id": TARGET_ID, "hard_timeout_seconds": HARD_TIMEOUT_SECONDS,
        "timeout_grace_seconds": TIMEOUT_GRACE_SECONDS, "derived_image_id": DERIVED_IMAGE_ID}
    if any(data.get(key) != value for key, value in expected.items()):
        raise RuntimeError("root GO does not match exact offline contract")
    if not isinstance(data.get("root_go_reference"), str) or not data["root_go_reference"].strip():
        raise RuntimeError("root GO reference missing")
    return data["root_go_reference"], sha256_file(gate)


def create_binding(*, image_id, pwuser_uid, pwuser_gid, image_review_sha256,
                   control_root=CONTROL_ROOT, bundle_root=HERE, image_inspector=inspect_image,
                   nonce_factory=secrets.token_hex):
    root = Path(control_root)
    bundle = Path(bundle_root)
    if effective_uid() != 0 or root.is_symlink() or not root.is_dir() or not private_owned(root):
        raise RuntimeError("pre-existing root-owned private control directory missing or unsafe")
    values = validate_bundle(bundle)
    root_go_reference, root_go_sha256 = validate_root_go(root, values)
    if image_id != DERIVED_IMAGE_ID or pwuser_uid <= 0 or pwuser_gid <= 0:
        raise RuntimeError("reviewed image or numeric identity mismatch")
    if image_review_sha256 != IMAGE_REVIEW_SHA256:
        raise RuntimeError("independent image review digest mismatch")
    install = json.loads((bundle / "install-receipt.json").read_text(encoding="utf-8"))
    review = json.loads((bundle / "image-identity-review.json").read_text(encoding="utf-8"))
    if (install.get("status") != "built" or install.get("stage") != "image" or
            install.get("image_id") != DERIVED_IMAGE_ID or
            install.get("source_manifest_sha256") != PARENT_SOURCE_MANIFEST_SHA256 or
            install.get("upstream_bundle_manifest_sha256", "").lower() != UPSTREAM_MANIFEST_SHA256):
        raise RuntimeError("installation receipt provenance mismatch")
    if (review.get("result") != "image_identity_review_pass" or review.get("image_id") != DERIVED_IMAGE_ID or
            review.get("pwuser_uid") != pwuser_uid or review.get("pwuser_gid") != pwuser_gid or
            review.get("container_started") is not False or review.get("container_cleanup") != "verified_absent"):
        raise RuntimeError("read-only image review mismatch")
    actual_id, configured_user, labels = image_inspector(image_id)
    if actual_id != DERIVED_IMAGE_ID or configured_user != "pwuser":
        raise RuntimeError("reviewed image ID or configured user mismatch")
    if labels.get("org.onia.playwright.base-digest") != BASE_DIGEST or labels.get("org.onia.playwright.requirements-sha256") != LOCK_SHA256:
        raise RuntimeError("image provenance labels mismatch")
    binding_path = root / "approval-binding.json"
    nonce_path = root / "approval-nonce.txt"
    if binding_path.exists() or nonce_path.exists() or list(root.glob("nonce-sha256-*.reserved")):
        raise RuntimeError("approval state already exists; no overwrite or nonce replacement")
    nonce = nonce_factory(16)
    if not re.fullmatch(r"[a-f0-9]{32}", nonce or ""):
        raise RuntimeError("nonce generator returned malformed value")
    nonce_hash = hashlib.sha256(nonce.encode("ascii")).hexdigest()
    exclusive_private(nonce_path, nonce + "\n")
    fsync_directory(root)
    binding = {
        "human_authorization": "Autorizar instalación y prueba aisladas.",
        "authorization_reference": "Sergio14Oct",
        "approval_nonce_reference": "sergio:20261014-vps-browser-offline-r1",
        "root_go_reference": root_go_reference,
        "root_go_receipt_sha256": root_go_sha256,
        "nonce_sha256": nonce_hash,
        "upstream_bundle_manifest_sha256": UPSTREAM_MANIFEST_SHA256,
        "source_manifest_sha256": values["source_manifest_sha256"],
        "bundle_manifest_sha256": values["bundle_manifest_sha256"],
        "runner_sha256": values["runner_sha256"],
        "binder_sha256": values["binder_sha256"],
        "wrapper_sha256": values["wrapper_sha256"],
        "contract_sha256": values["contract_sha256"],
        "target_id": TARGET_ID,
        "hard_timeout_seconds": HARD_TIMEOUT_SECONDS,
        "timeout_grace_seconds": TIMEOUT_GRACE_SECONDS,
        "base_image": BASE_IMAGE,
        "derived_image_id": DERIVED_IMAGE_ID,
        "install_receipt_sha256": values["install_receipt_sha256"],
        "requirements_lock_sha256": LOCK_SHA256,
        "seccomp_profile_sha256": SECCOMP_SHA256,
        "pwuser_uid": pwuser_uid,
        "pwuser_gid": pwuser_gid,
        "image_review_status": "independent_read_only_review_pass",
        "image_review_report_sha256": values["image_review_report_sha256"],
        "public_mode_enabled": False,
        "runtime_invocation_limit": 1,
    }
    exclusive_private(binding_path, json.dumps(binding, sort_keys=True, separators=(",", ":")) + "\n")
    fsync_directory(root)
    return {"result": "approval_bound", "bundle_manifest_sha256": binding["bundle_manifest_sha256"],
            "runner_sha256": binding["runner_sha256"], "contract_sha256": binding["contract_sha256"],
            "runtime_invocations_remaining": 1}


def main(argv=None):
    parser = argparse.ArgumentParser()
    parser.add_argument("--image-id", required=True)
    parser.add_argument("--pwuser-uid", required=True, type=int)
    parser.add_argument("--pwuser-gid", required=True, type=int)
    parser.add_argument("--image-review-sha256", required=True)
    args = parser.parse_args(argv)
    result = create_binding(image_id=args.image_id, pwuser_uid=args.pwuser_uid,
                            pwuser_gid=args.pwuser_gid, image_review_sha256=args.image_review_sha256)
    print(json.dumps(result, sort_keys=True, separators=(",", ":")))
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (OSError, RuntimeError, subprocess.TimeoutExpired, json.JSONDecodeError):
        print('{"result":"blocked_or_needs_reconcile"}', file=sys.stderr)
        raise SystemExit(2)
