#!/usr/bin/env python3
"""Fail-closed prepared runner. Default invocation only prints a plan."""
import argparse
import hashlib
import json
import os
import re
import signal
import subprocess
import sys
import tempfile
import time
import uuid
from pathlib import Path

BASE_DIGEST = "sha256:aa81288e738725378becba5b3e06cb0f3a7f012a610e87e8d767a090ea3f740d"
IMAGE = "onia/playwright-python:1.62.0-noble-lock-52e857275e07"
EXPECTED_IMAGE_ID = ""  # Must be replaced only after approved build and independent image-ID review.
LOCK_SHA256 = "52e857275e075417fa9e5b934f3b41d0366a55fc25187b7f40dbb3df34ed6a4e"
SECCOMP_SHA256 = "cc3e61cabda6bbc1e53e54d27ba4d55a9d3be829b6dd1a596f4a7b31b1cc7849"
PARENT_SOURCE_SHA256 = "0C5650791E83831D11445B26FC715A7A931016E20A7F3C3EC6E423DB550A8D6B"
PUBLIC_ENABLED = False
APPROVED_NONCE_SHA256 = ""  # Empty until a fresh offline approval is explicitly bound.
ENV = {"PATH": "/usr/bin:/bin", "HOME": "/nonexistent", "LANG": "C.UTF-8"}
HERE = Path(__file__).resolve().parent
PROFILE = HERE / "seccomp-profile-v1.62.0.json"
PROBE = HERE / "browser_probe.py"
CONTROL_ROOT = Path("/var/lib/onia-browser-control")
OUTPUT_ROOT = Path("/tmp")


def _safe_token(value):
    return bool(re.fullmatch(r"[a-f0-9]{32}", value or ""))


def control_directory_is_private(path):
    if os.name == "nt":
        return True  # Host-only unit tests; runtime target is POSIX and fails closed there.
    st = Path(path).stat()
    return (st.st_mode & 0o077) == 0 and st.st_uid == os.geteuid()


def reserve_nonce(control_root, nonce):
    """Durably reserve one invocation before any Docker inspection or launch."""
    if not _safe_token(nonce):
        raise RuntimeError("nonce format rejected")
    nonce_hash = hashlib.sha256(nonce.encode("ascii")).hexdigest()
    if not APPROVED_NONCE_SHA256 or nonce_hash != APPROVED_NONCE_SHA256:
        raise RuntimeError("fresh offline approval nonce is not configured")
    control_root = Path(control_root)
    if control_root.is_symlink() or not control_root.is_dir():
        raise RuntimeError("private control directory missing or unsafe")
    if not control_directory_is_private(control_root):
        raise RuntimeError("control directory permissions are not private")
    reservation = control_root / ("nonce-sha256-" + nonce_hash + ".reserved")
    flags = os.O_WRONLY | os.O_CREAT | os.O_EXCL
    if hasattr(os, "O_NOFOLLOW"):
        flags |= os.O_NOFOLLOW
    fd = os.open(str(reservation), flags, 0o600)
    try:
        os.write(fd, (nonce_hash + "\n").encode("ascii"))
        os.fsync(fd)
    finally:
        os.close(fd)
    if os.name != "nt":
        dirfd = os.open(str(control_root), os.O_RDONLY)
        try:
            os.fsync(dirfd)
        finally:
            os.close(dirfd)
    return reservation


def _docker_call(args, *, run=subprocess.run, timeout=3):
    return run(["docker", "--context", "default", *args], stdin=subprocess.DEVNULL,
               stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, text=True,
               timeout=timeout, env=ENV, check=False)


def verify_image(*, docker_call=_docker_call):
    if not re.fullmatch(r"sha256:[0-9a-f]{64}", EXPECTED_IMAGE_ID or ""):
        raise RuntimeError("exact derived image ID has not been reviewed")
    result = docker_call(["image", "inspect", "--format", "{{.Id}}|{{json .Config.Labels}}", IMAGE])
    if result.returncode:
        raise RuntimeError("derived image unavailable; pull is disabled")
    try:
        image_id, labels_json = result.stdout.split("|", 1)
        labels = json.loads(labels_json)
    except (ValueError, KeyError, TypeError, IndexError):
        raise RuntimeError("image metadata malformed") from None
    if not isinstance(labels, dict):
        raise RuntimeError("image labels malformed")
    if image_id != EXPECTED_IMAGE_ID:
        raise RuntimeError("derived image ID mismatch")
    if labels.get("org.onia.playwright.base-digest") != BASE_DIGEST or labels.get("org.onia.playwright.requirements-sha256") != LOCK_SHA256:
        raise RuntimeError("derived image labels mismatch")


def check_inputs(*, docker_call=_docker_call):
    if not PROFILE.is_file() or PROFILE.is_symlink() or hashlib.sha256(PROFILE.read_bytes()).hexdigest() != SECCOMP_SHA256:
        raise RuntimeError("seccomp profile missing or hash mismatch")
    if PROBE.is_symlink() or not PROBE.is_file():
        raise RuntimeError("probe missing or unsafe")
    verify_image(docker_call=docker_call)


def container_labels(run_id, nonce):
    return ["--label=org.onia.browser.owner=onia-browser-runner",
            "--label=org.onia.browser.run-id=" + run_id,
            "--label=org.onia.browser.nonce-sha256=" + hashlib.sha256(nonce.encode("ascii")).hexdigest()]


def argv(out, cid_path, run_id, nonce, *, image_id=None):
    if image_id is None:
        image_id = EXPECTED_IMAGE_ID
    if not re.fullmatch(r"sha256:[0-9a-f]{64}", image_id or "") or image_id != EXPECTED_IMAGE_ID:
        raise RuntimeError("exact derived image ID missing or mismatched")
    if Path(cid_path).resolve().is_relative_to(Path(out).resolve()):
        raise RuntimeError("container control file must be outside writable output mount")
    return ["docker", "--context", "default", "run", "--pull=never", "--init", "-i",
        "--cidfile", str(cid_path), *container_labels(run_id, nonce), "--network=none", "--user=pwuser",
        "--cap-drop=ALL", "--security-opt=no-new-privileges=true", "--security-opt=seccomp=" + str(PROFILE),
        "--cpus=0.50", "--memory=768m", "--memory-swap=768m", "--pids-limit=256", "--read-only",
        "--shm-size=128m", "--tmpfs=/tmp:rw,nosuid,nodev,size=512m,mode=1777",
        "--mount", "type=bind,src=" + str(out) + ",dst=/out,rw", "--env=HOME=/tmp/home",
        "--env=XDG_CONFIG_HOME=/tmp/home/.config", "--env=XDG_CACHE_HOME=/tmp/home/.cache",
        "--env=PLAYWRIGHT_BROWSERS_PATH=/ms-playwright", "--workdir=/tmp", image_id, "offline"]


def owned_cid(cid_path, run_id, nonce, *, docker_call=_docker_call, timeout=0.5):
    """Return CID only when the exact owned labels match; otherwise fail closed."""
    try:
        cid = Path(cid_path).read_text(encoding="ascii").strip()
    except OSError:
        return None
    if not re.fullmatch(r"[0-9a-f]{64}", cid):
        return None
    result = docker_call(["container", "inspect", "--format", "{{json .Config.Labels}}", cid], timeout=timeout)
    if result.returncode:
        return None
    try:
        labels = json.loads(result.stdout)
    except (ValueError, KeyError, TypeError):
        return None
    if not isinstance(labels, dict):
        return None
    expected = {"org.onia.browser.owner": "onia-browser-runner",
                "org.onia.browser.run-id": run_id,
                "org.onia.browser.nonce-sha256": hashlib.sha256(nonce.encode("ascii")).hexdigest()}
    if any(labels.get(key) != value for key, value in expected.items()):
        return None
    return cid


def stop_owned(cid_path, proc, run_id, nonce, *, docker_call=_docker_call, killpg=None):
    deadline = time.monotonic() + 2
    if killpg is None:
        killpg = getattr(os, "killpg", None)
    cid = owned_cid(cid_path, run_id, nonce, docker_call=docker_call,
                    timeout=max(0.05, min(0.5, deadline - time.monotonic())))
    if cid and time.monotonic() < deadline:
        docker_call(["container", "kill", "--signal", "KILL", cid],
                    timeout=max(0.05, min(0.5, deadline - time.monotonic())))
    if proc.poll() is None and killpg is not None:
        try:
            killpg(proc.pid, signal.SIGTERM)
            proc.wait(timeout=max(0.05, deadline - time.monotonic()))
        except (ProcessLookupError, PermissionError, subprocess.TimeoutExpired):
            pass
    return "UNKNOWN"  # A kill request does not prove exit or absence of effects.


def execute(nonce, *, control_root=CONTROL_ROOT, docker_call=_docker_call, popen=subprocess.Popen):
    reservation = reserve_nonce(control_root, nonce)
    run_id = uuid.uuid4().hex
    # A consumed nonce is never released, including preflight or ambiguous failures.
    if PUBLIC_ENABLED:
        raise RuntimeError("public mode is disabled")
    check_inputs(docker_call=docker_call)
    if not EXPECTED_IMAGE_ID:
        raise RuntimeError("exact derived image ID unavailable")
    out = Path(tempfile.mkdtemp(prefix="onia-pw-offline-", dir=str(OUTPUT_ROOT)))
    os.chmod(out, 0o700)
    if not control_directory_is_private(out):
        raise RuntimeError("fresh output directory is not private")
    control = Path(control_root) / ("run-" + run_id)
    control.mkdir(mode=0o700)
    if not control_directory_is_private(control):
        raise RuntimeError("fresh control directory is not private")
    if control.resolve().is_relative_to(out.resolve()):
        raise RuntimeError("control state overlaps output mount")
    cid_path = control / "container.cid"
    start = time.monotonic()
    with PROBE.open("rb") as src:
        proc = popen(argv(out, cid_path, run_id, nonce), stdin=src, stdout=subprocess.PIPE,
                     stderr=subprocess.DEVNULL, start_new_session=True, env=ENV)
        try:
            raw, _ = proc.communicate(timeout=75)
        except subprocess.TimeoutExpired:
            cleanup = stop_owned(cid_path, proc, run_id, nonce, docker_call=docker_call)
            raise RuntimeError("timeout; cleanup=" + cleanup + "; needs_reconcile; no retry") from None
    elapsed = int((time.monotonic() - start) * 1000)
    if proc.returncode:
        raise RuntimeError("container exited; needs_reconcile; no retry")
    child = json.loads(raw.decode("utf-8"))
    shot = out / "offline-fixture.jpg"
    if child.get("phase") != "offline-synthetic" or child.get("sandbox_enabled") is not True:
        raise RuntimeError("fixture receipt mismatch; needs_reconcile")
    if shot.is_symlink() or not shot.is_file() or shot.stat().st_size > 2_000_000:
        raise RuntimeError("screenshot absent, unsafe, or oversized; needs_reconcile")
    digest = hashlib.sha256(shot.read_bytes()).hexdigest()
    if child.get("artifact_sha256") != digest:
        raise RuntimeError("screenshot digest mismatch; needs_reconcile")
    receipt = {"captured_at_utc": child.get("captured_at_utc"), "phase": "offline-synthetic",
        "execution_host": "VPS", "source_parent_session_id": "UNKNOWN",
        "image_id": EXPECTED_IMAGE_ID, "base_manifest_digest": BASE_DIGEST,
        "requirements_lock_sha256": LOCK_SHA256, "seccomp_profile_sha256": SECCOMP_SHA256,
        "chromium_sandbox": True, "network_mode": "none", "elapsed_ms": elapsed,
        "screenshot_bytes": shot.stat().st_size, "screenshot_sha256": digest,
        "nonce_sha256": hashlib.sha256(nonce.encode("ascii")).hexdigest(), "nonce_state": "consumed"}
    receipt_path = out / "receipt.json"
    fd = os.open(str(receipt_path), os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
    with os.fdopen(fd, "w", encoding="utf-8") as f:
        f.write(json.dumps(receipt, indent=2) + "\n")
        f.flush()
        os.fsync(f.fileno())
    print(json.dumps({"result": "offline_fixture_pass", "receipt": str(receipt_path),
        "receipt_sha256": hashlib.sha256(receipt_path.read_bytes()).hexdigest(), "elapsed_ms": elapsed}))
    return 0


def main(argv_in=None):
    ap = argparse.ArgumentParser()
    ap.add_argument("--execute-offline", action="store_true")
    ap.add_argument("--execute-public", action="store_true")
    ap.add_argument("--nonce", default="")
    a = ap.parse_args(argv_in)
    if a.execute_public:
        print("blocked: public mode disabled", file=sys.stderr)
        return 3
    if a.execute_offline:
        try:
            return execute(a.nonce)
        except (OSError, RuntimeError, subprocess.TimeoutExpired, json.JSONDecodeError) as exc:
            print("blocked: " + str(exc), file=sys.stderr)
            return 2
    print(json.dumps({"mode": "plan-only", "image": IMAGE, "expected_image_id": EXPECTED_IMAGE_ID or "UNCONFIGURED",
        "base_digest": BASE_DIGEST, "network": "none", "public_phase": "disabled",
        "nonce_reservation": "durable O_EXCL before Docker", "cid_control": "private host directory outside /out",
        "timeout_cleanup": "UNKNOWN / needs_reconcile", "execution_host": "VPS",
        "parent_session": "explicit environment field or UNKNOWN", "side_effects": "none"}, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
