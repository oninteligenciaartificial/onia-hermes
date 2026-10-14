#!/usr/bin/env python3
"""Bind Sergio's one-off approval to the independently reviewed image and source."""
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
LOCK_SHA256 = "52e857275e075417fa9e5b934f3b41d0366a55fc25187b7f40dbb3df34ed6a4e"
SECCOMP_SHA256 = "cc3e61cabda6bbc1e53e54d27ba4d55a9d3be829b6dd1a596f4a7b31b1cc7849"
UPSTREAM_MANIFEST_SHA256 = "F1B7B1DFA9C60330FC9D2184A2A266EFBFCDFC3B4733EE0FD9DD5F372906F78B"
CONTROL_ROOT = Path("/var/lib/onia-browser-control")
HERE = Path(__file__).resolve().parent


def private_owned(path):
    p = Path(path)
    st = p.lstat()
    return not p.is_symlink() and st.st_uid == os.geteuid() and (st.st_mode & 0o077) == 0


def exclusive_private(path, content):
    flags = os.O_WRONLY | os.O_CREAT | os.O_EXCL
    if hasattr(os, "O_NOFOLLOW"):
        flags |= os.O_NOFOLLOW
    fd = os.open(str(path), flags, 0o600)
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as f:
            f.write(content)
            f.flush()
            os.fsync(f.fileno())
    except Exception:
        raise


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--image-id", required=True)
    ap.add_argument("--pwuser-uid", required=True, type=int)
    ap.add_argument("--pwuser-gid", required=True, type=int)
    ap.add_argument("--image-review-sha256", required=True)
    a = ap.parse_args()
    root = CONTROL_ROOT
    if os.geteuid() != 0 or root.is_symlink() or not root.is_dir() or not private_owned(root):
        raise RuntimeError("pre-existing root-owned private control directory missing or unsafe")
    if not re.fullmatch(r"sha256:[a-f0-9]{64}", a.image_id) or a.pwuser_uid <= 0 or a.pwuser_gid <= 0:
        raise RuntimeError("reviewed image or numeric pwuser identity is malformed")
    if not re.fullmatch(r"[a-f0-9]{64}", a.image_review_sha256):
        raise RuntimeError("independent image identity review digest is required")
    source_manifest = HERE / "source-manifest.json"
    data = json.loads(source_manifest.read_text(encoding="utf-8"))
    if data.get("upstream_bundle_manifest_sha256") != UPSTREAM_MANIFEST_SHA256:
        raise RuntimeError("source manifest does not bind the frozen V3 bundle")
    source_hash = hashlib.sha256(source_manifest.read_bytes()).hexdigest()
    install_receipt = HERE / "install-receipt.json"
    if install_receipt.is_symlink() or not install_receipt.is_file():
        raise RuntimeError("completed installation receipt missing or unsafe")
    install_hash = hashlib.sha256(install_receipt.read_bytes()).hexdigest()
    install = json.loads(install_receipt.read_text(encoding="utf-8"))
    if install.get("status") != "built" or install.get("stage") != "image" or install.get("image_id") != a.image_id:
        raise RuntimeError("installation receipt does not bind the reviewed image ID")
    if install.get("upstream_bundle_manifest_sha256") != UPSTREAM_MANIFEST_SHA256 or install.get("source_manifest_sha256") != source_hash:
        raise RuntimeError("installation receipt source provenance mismatch")
    image_review_path = HERE / "image-identity-review.json"
    if image_review_path.is_symlink() or not image_review_path.is_file():
        raise RuntimeError("read-only image identity review receipt missing")
    image_review_hash = hashlib.sha256(image_review_path.read_bytes()).hexdigest()
    if image_review_hash != a.image_review_sha256:
        raise RuntimeError("image identity review receipt hash mismatch")
    image_review = json.loads(image_review_path.read_text(encoding="utf-8"))
    if image_review.get("result") != "image_identity_review_pass" or image_review.get("image_id") != a.image_id:
        raise RuntimeError("image identity review does not bind this image ID")
    if image_review.get("pwuser_uid") != a.pwuser_uid or image_review.get("pwuser_gid") != a.pwuser_gid:
        raise RuntimeError("pwuser identity differs from the read-only image review")
    if image_review.get("container_started") is not False or image_review.get("container_cleanup") != "verified_absent":
        raise RuntimeError("image review container lifecycle is not verified")
    result = subprocess.run(["docker", "--context", "default", "image", "inspect", "--format",
        "{{.Id}}|{{.Config.User}}|{{json .Config.Labels}}", IMAGE_TAG], stdin=subprocess.DEVNULL,
        stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, text=True, timeout=3, check=False,
        env={"PATH": "/usr/bin:/bin", "HOME": "/root", "LANG": "C.UTF-8"})
    if result.returncode:
        raise RuntimeError("derived image unavailable")
    try:
        image_id, configured_user, labels_json = result.stdout.strip().split("|", 2)
        labels = json.loads(labels_json)
    except (ValueError, TypeError):
        raise RuntimeError("image inspection metadata malformed") from None
    if image_id != a.image_id or configured_user != "pwuser":
        raise RuntimeError("reviewed image ID or configured user mismatch")
    if labels.get("org.onia.playwright.base-digest") != BASE_DIGEST or labels.get("org.onia.playwright.requirements-sha256") != LOCK_SHA256:
        raise RuntimeError("image provenance labels mismatch")
    binding_path = root / "approval-binding.json"
    nonce_path = root / "approval-nonce.txt"
    reservation_glob = list(root.glob("nonce-sha256-*.reserved"))
    if binding_path.exists() or nonce_path.exists() or reservation_glob:
        raise RuntimeError("approval state already exists; no overwrite or nonce replacement")
    nonce = secrets.token_hex(16)
    nonce_hash = hashlib.sha256(nonce.encode("ascii")).hexdigest()
    # Persist the nonce before its binding. A partial write is retained for manual reconciliation.
    exclusive_private(nonce_path, nonce + "\n")
    dfd = os.open(str(root), os.O_RDONLY)
    try:
        os.fsync(dfd)
    finally:
        os.close(dfd)
    binding = {
        "human_authorization": "Autorizar instalación y prueba aisladas.",
        "authorization_reference": "Sergio14Oct",
        "approval_nonce_reference": "sergio:20261014-vps-browser-offline-r1",
        "nonce_sha256": nonce_hash,
        "upstream_bundle_manifest_sha256": UPSTREAM_MANIFEST_SHA256,
        "source_manifest_sha256": source_hash,
        "base_image": BASE_IMAGE,
        "derived_image_id": a.image_id,
        "install_receipt_sha256": install_hash,
        "requirements_lock_sha256": LOCK_SHA256,
        "seccomp_profile_sha256": SECCOMP_SHA256,
        "pwuser_uid": a.pwuser_uid,
        "pwuser_gid": a.pwuser_gid,
        "image_review_status": "independent_read_only_review_pass",
        "image_review_report_sha256": image_review_hash,
        "public_mode_enabled": False,
        "runtime_invocation_limit": 1,
    }
    exclusive_private(binding_path, json.dumps(binding, sort_keys=True, separators=(",", ":")) + "\n")
    dfd = os.open(str(root), os.O_RDONLY)
    try:
        os.fsync(dfd)
    finally:
        os.close(dfd)
    print(json.dumps({"result": "approval_bound", "nonce_sha256": nonce_hash,
        "source_manifest_sha256": source_hash, "image_id": a.image_id,
        "runtime_invocations_remaining": 1}, separators=(",", ":")))
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (OSError, RuntimeError, subprocess.TimeoutExpired, json.JSONDecodeError) as exc:
        print(json.dumps({"result": "blocked_or_needs_reconcile", "reason": str(exc)[:200]}, file=sys.stderr))
        raise SystemExit(2)
