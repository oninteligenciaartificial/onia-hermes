#!/usr/bin/env python3
"""Frozen R3 supervisor: parent-bound admission, private claim, 75+2 own-child guard."""
import argparse
import base64
import hashlib
import json
import os
from pathlib import Path
import re
import signal
import stat
import subprocess
import tempfile
import time
from datetime import datetime, timezone

PYTHON = "/opt/onia-public-browser-1.64.0/venv/bin/python"
CHILD = Path(__file__).resolve().parent / "browser_check.py"
CHILD_SHA = "aac64bb8ebc82441141787838458767125b7cdb01b28d75c0bdf2b5f46201ebb"
CACHE = "/opt/onia-public-browser-1.64.0/browsers"
OUTPUTS = ("preflight.json", "execution-receipt.json", "supervisor-receipt.json", "screenshot-artifact.json")


def utc():
    return datetime.now(timezone.utc).isoformat()


def write_claim(fd, value):
    raw = (json.dumps(value, sort_keys=True) + "\n").encode()
    os.lseek(fd, 0, os.SEEK_SET)
    os.ftruncate(fd, 0)
    view = memoryview(raw)
    while view:
        written = os.write(fd, view)
        if written <= 0:
            raise OSError("short claim write")
        view = view[written:]
    os.fsync(fd)


def write_once(path, value):
    fd = os.open(path, os.O_WRONLY | os.O_CREAT | os.O_EXCL | os.O_NOFOLLOW, 0o600)
    with os.fdopen(fd, "w") as stream:
        stream.write(json.dumps(value, indent=2, sort_keys=True) + "\n")
        stream.flush()
        os.fsync(stream.fileno())


def lineage(c):
    return {"operation_id": c["operation_id"], "input_sha": c["input_sha"], "agent_id": "UNKNOWN", "served_model": "UNKNOWN",
            "repository": {"name": c["repository"], "requested_ref": c["requested_ref"],
                           "expected_head": c["expected_head"],
                           "observed_head": c["checkout_head_observed_before_uid_switch"],
                           "observed_head_provenance": "parent_task_observation_before_UID_switch"}}


def blocked_outputs(out, c, reason, consumed=False, launches=0):
    identity = lineage(c)
    for name in OUTPUTS:
        path = out / name
        if path.exists() or path.is_symlink():
            continue
        state = "NOT_PRODUCED" if name == "screenshot-artifact.json" or consumed else "NOT_STARTED"
        write_once(path, dict(identity, status=state, reason=reason, image_produced=False,
                             base64=None, browser_nonce_consumed=consumed, browser_launches=launches,
                             served_model="UNKNOWN", at_utc=utc()))


def run_child(argv, env):
    started = time.monotonic()
    result = {"status": "needs_reconcile", "deadline_seconds": 75, "grace_seconds": 2,
              "remote_helper_cleanup": "UNKNOWN", "external_cancellation": "UNKNOWN"}
    # No raw child stdout/stderr survives this private temporary capture.
    with tempfile.TemporaryFile() as child_out, tempfile.TemporaryFile() as child_err:
        child = subprocess.Popen(argv, env=env, start_new_session=True, stdout=child_out, stderr=child_err)
        try:
            code = child.wait(timeout=max(0, 75 - (time.monotonic() - started)))
            result.update(status="PASS" if code == 0 else "child_failed_needs_reconcile", exit_code=code,
                          direct_child_reaped=True)
        except subprocess.TimeoutExpired:
            pgid = os.getpgid(child.pid)
            if child.pid <= 1 or child.pid == os.getpid() or pgid != child.pid or pgid == os.getpgrp():
                raise RuntimeError("refused non-child or own process group")
            result["status"] = "timeout_needs_reconcile"
            try:
                os.killpg(pgid, signal.SIGKILL)
                result["own_group_kill_sent"] = True
            except ProcessLookupError:
                result["own_group_kill_sent"] = False
            try:
                result["exit_code"] = child.wait(timeout=2)
                result["direct_child_reaped"] = True
            except subprocess.TimeoutExpired:
                result["direct_child_reaped"] = False
        finally:
            result["elapsed_seconds"] = round(time.monotonic() - started, 6)
    return result


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--contract", required=True)
    parser.add_argument("--contract-sha256", required=True)
    parser.add_argument("--output-dir", required=True)
    args = parser.parse_args()
    out = Path(args.output_dir)
    c = None
    safe_output = False
    try:
        if os.getuid() != 1000 or str(Path(PYTHON)) != os.environ.get("ONIA_PINNED_BROWSER_PYTHON", PYTHON):
            raise ValueError("UID1000 pinned runtime required")
        directory = out.lstat()
        if (not stat.S_ISDIR(directory.st_mode) or directory.st_uid != 1000
                or stat.S_IMODE(directory.st_mode) != 0o700 or not str(out.resolve()).startswith("/workspace/")):
            raise ValueError("private workspace required")
        safe_output = True
        raw_contract = Path(args.contract).read_bytes()
        if hashlib.sha256(raw_contract).hexdigest() != args.contract_sha256:
            raise ValueError("contract hash mismatch")
        c = json.loads(raw_contract)
        if (not isinstance(c.get("operation_id"), str) or not c["operation_id"] or len(c["operation_id"]) > 256
                or not re.fullmatch(r"[0-9a-f]{64}", c.get("input_sha", ""))
                or not re.fullmatch(r"[0-9a-f]{40}", c.get("expected_head", ""))
                or c.get("checkout_head_observed_before_uid_switch") != c["expected_head"]):
            raise ValueError("literal operation/input admission missing")
        child_hash = hashlib.sha256(CHILD.read_bytes()).hexdigest()
        if child_hash != CHILD_SHA:
            raise ValueError("frozen child source mismatch")
        own_sha = hashlib.sha256(Path(__file__).read_bytes()).hexdigest()
        if c.get("child_source_sha256") != child_hash or c.get("supervisor_source_sha256") != own_sha:
            raise ValueError("parent source admission mismatch")
        if any((out / name).exists() or (out / name).is_symlink() for name in OUTPUTS + (".browser-cloud-attempt.claim", "iana-example-domains.jpg")):
            raise ValueError("output or claim collision")
        env = dict(os.environ)
        env["PLAYWRIGHT_BROWSERS_PATH"] = CACHE
        argv = [PYTHON, str(CHILD), "--contract", str(Path(args.contract)),
                "--contract-sha256", args.contract_sha256, "--output-dir", str(out)]
        # Separate bounded metadata/namespace preflight: zero Chromium and no claim.
        with tempfile.TemporaryFile() as pre_out, tempfile.TemporaryFile() as pre_err:
            preflight = subprocess.run(argv + ["--preflight"], env=env, stdout=pre_out, stderr=pre_err, timeout=10)
        if preflight.returncode:
            blocked_outputs(out, c, "preflight_blocked")
            print(json.dumps({"status": "BLOCKED_PREFLIGHT", "claim_created": False, "child_browser_dispatched": False}))
            return 2
        if hashlib.sha256(CHILD.read_bytes()).hexdigest() != child_hash or Path(args.contract).read_bytes() != raw_contract:
            raise ValueError("source/contract changed after preflight")
    except Exception as error:
        if safe_output and c is not None:
            try:
                blocked_outputs(out, c, "preclaim_blocked")
            except Exception:
                pass
        print(json.dumps({"status": "BLOCKED_PRECLAIM", "error_type": type(error).__name__,
                          "claim_created": False, "child_browser_dispatched": False}))
        return 2
    claim_path = out / ".browser-cloud-attempt.claim"
    try:
        claim_fd = os.open(claim_path, os.O_WRONLY | os.O_CREAT | os.O_EXCL | os.O_NOFOLLOW, 0o600)
    except OSError:
        blocked_outputs(out, c, "claim_collision_no_launch")
        print(json.dumps({"status": "BLOCKED_CLAIM_COLLISION", "claim_created": False}))
        return 2
    claim = {"schema": 1, "state": "reserved", "operation_nonce": c["operation_nonce"], "uid": 1000,
             "contract_sha256": args.contract_sha256, "source_sha256": child_hash,
             "supervisor_sha256": own_sha, "authorization_reference": c["authorization_reference"],
             "submission_reference": c["submission_reference"], "started_at_utc": utc(),
             "environment_id_provenance": "parent_external_binding", "task_id_observed_in_child": "UNKNOWN"}
    receipt = dict(lineage(c), **{"status": "needs_reconcile", "operation_nonce": c["operation_nonce"], "contract_sha256": args.contract_sha256,
               "child_source_sha256": child_hash, "supervisor_source_sha256": own_sha, "retries": 0,
               "served_model": "UNKNOWN", "started_at_utc": utc(), "browser_nonce_consumed": True})
    try:
        write_claim(claim_fd, claim)
        directory_fd = os.open(out, os.O_RDONLY | os.O_DIRECTORY)
        try:
            os.fsync(directory_fd)
        finally:
            os.close(directory_fd)
        claim["state"] = "running"
        write_claim(claim_fd, claim)
        receipt.update(run_child(argv + ["--claim", str(claim_path)], env))
        child_receipt = json.loads((out / "execution-receipt.json").read_text()) if (out / "execution-receipt.json").is_file() else {}
        receipt["child_status"] = child_receipt.get("status", "UNKNOWN")
        receipt["browser_launches"] = child_receipt.get("browser_launches", "UNKNOWN")
        receipt["child_error_type"] = child_receipt.get("error_type", "UNKNOWN")
        if receipt["status"] == "PASS":
            image_meta = child_receipt.get("screenshot", {})
            image_file = out / "iana-example-domains.jpg"
            image_artifact = json.loads((out / "screenshot-artifact.json").read_text())
            jpeg = image_file.read_bytes()
            digest = hashlib.sha256(jpeg).hexdigest()
            if (child_receipt.get("status") != "PASS" or image_file.is_symlink()
                    or image_meta.get("sha256") != digest or image_meta.get("bytes") != len(jpeg)
                    or image_artifact.get("sha256") != digest or len(jpeg) > 90 * 1024
                    or len(image_artifact.get("base64", "")) > 120 * 1024
                    or base64.b64decode(image_artifact.get("base64", ""), validate=True) != jpeg):
                raise ValueError("JPEG receipt mismatch")
            receipt["screenshot_sha256"] = digest
        text_bundle_size = sum((out / name).stat().st_size for name in OUTPUTS if (out / name).is_file())
        if text_bundle_size > 256 * 1024:
            raise ValueError("receipt bundle transport cap exceeded")
        receipt["public_text_bundle_bytes_before_supervisor"] = text_bundle_size
        receipt["git_allowlist_outputs"] = list(OUTPUTS)
    except BaseException as error:
        receipt.update(status="needs_reconcile", supervisor_error_type=type(error).__name__)
    finally:
        claim.update(state="terminal" if receipt["status"] == "PASS" else "needs_reconcile", finished_at_utc=utc())
        try:
            write_claim(claim_fd, claim)
            receipt.update(claim_state=claim["state"], finished_at_utc=utc())
            write_once(out / "supervisor-receipt.json", receipt)
            blocked_outputs(out, c, "browser_failed_or_output_not_produced", consumed=True,
                            launches=receipt.get("browser_launches", "UNKNOWN"))
        finally:
            os.close(claim_fd)
    # Never print image payload, contract values, raw diagnostics or environment.
    print(json.dumps({k: receipt[k] for k in ("status", "claim_state", "browser_nonce_consumed", "elapsed_seconds",
                                             "direct_child_reaped", "browser_launches", "screenshot_sha256") if k in receipt}))
    return 0 if receipt["status"] == "PASS" else 1


if __name__ == "__main__":
    raise SystemExit(main())
