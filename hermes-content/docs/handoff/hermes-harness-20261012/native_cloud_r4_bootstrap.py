"""One-task R4 bootstrap: consume the prompt footer, admit, then call supervisor."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import stat
import subprocess
import sys

from native_cloud_lineage import AdmissionBuildError, materialize_and_admit_before_browser


def extract_intent_footer(footer_bytes: bytes) -> tuple[bytes, str]:
    """Validate the two copied footer lines; this is not the full wire prompt."""
    if not isinstance(footer_bytes, bytes) or not footer_bytes or len(footer_bytes) > 16384:
        raise AdmissionBuildError("bounded intent footer bytes required")
    lines = footer_bytes.splitlines()
    hash_lines = [line for line in lines if line.startswith(b"ONIA_R4_INTENT_SHA256=")]
    json_lines = [line for line in lines if line.startswith(b"ONIA_R4_INTENT_JSON=")]
    if (len(hash_lines) != 1 or len(json_lines) != 1 or len(lines) != 2
            or lines[-2] != hash_lines[0] or lines[-1] != json_lines[0]):
        raise AdmissionBuildError("exact two-line R4 intent footer required")
    try:
        digest = hash_lines[0].split(b"=", 1)[1].decode("ascii", "strict")
        intent = json_lines[0].split(b"=", 1)[1]
    except UnicodeError as exc:
        raise AdmissionBuildError("R4 footer encoding invalid") from exc
    if hashlib.sha256(intent).hexdigest() != digest:
        raise AdmissionBuildError("R4 prompt footer digest mismatch")
    return intent, digest


def _private_output_dir(path: Path) -> None:
    info = path.lstat()
    if (not stat.S_ISDIR(info.st_mode) or info.st_uid != 1000
            or stat.S_IMODE(info.st_mode) != 0o700
            or not str(path.resolve()).startswith("/workspace/")):
        raise AdmissionBuildError("precreated UID1000 private output directory required")


def run(args) -> int:
    checkout = Path(args.checkout).resolve(strict=True)
    source_dir = Path(args.r4_source_dir).resolve(strict=True)
    ui_path = Path(args.ui_readback).resolve(strict=True)
    contract_path = Path(args.contract)
    out_dir = Path(args.output_dir).resolve(strict=True)
    _private_output_dir(out_dir)
    if contract_path.exists() or contract_path.is_symlink():
        raise AdmissionBuildError("contract path already exists; no replacement/replay")
    if not ui_path.is_file() or ui_path.is_symlink() or ui_path.stat().st_size > 32768:
        raise AdmissionBuildError("bounded pinned UI readback file required")

    footer_bytes = Path(args.intent_footer_file).read_bytes()
    intent_bytes, intent_sha256 = extract_intent_footer(footer_bytes)
    head_result = subprocess.run(["git", "-C", str(checkout), "rev-parse", "HEAD"],
                                 shell=False, capture_output=True, text=True,
                                 timeout=10, check=False)
    if head_result.returncode != 0:
        raise AdmissionBuildError("cannot observe checkout HEAD before UID switch")
    observed_head = head_result.stdout.strip()

    admission_path = source_dir / "admission.py"
    child_path = source_dir / "browser_check.py"
    supervisor_path = source_dir / "supervisor.py"
    admitted = materialize_and_admit_before_browser(
        intent_bytes=intent_bytes, expected_intent_sha256=intent_sha256,
        ui_receipt=ui_path.read_bytes(),
        checkout_head_observed_before_uid_switch=observed_head,
        child_source=child_path.read_bytes(), supervisor_source=supervisor_path.read_bytes(),
        admission_source=admission_path.read_bytes(), admission_path=str(admission_path),
        contract_path=str(contract_path))
    if not isinstance(admitted, dict):
        raise AdmissionBuildError("original R4 admission returned no contract")
    contract_raw = contract_path.read_bytes()
    contract_sha256 = hashlib.sha256(contract_raw).hexdigest()

    # This is the first possible browser-capable command. Every previous check
    # must have succeeded; no shell and no retry are used.
    result = subprocess.run([
        "/usr/sbin/runuser", "-u", "#1000", "--",
        "/opt/onia-public-browser-1.64.0/venv/bin/python", str(supervisor_path),
        "--contract", str(contract_path), "--contract-sha256", contract_sha256,
        "--output-dir", str(out_dir)], shell=False, timeout=240, check=False)
    return result.returncode


def main(argv=None) -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--intent-footer-file", required=True)
    parser.add_argument("--checkout", required=True)
    parser.add_argument("--r4-source-dir", required=True)
    parser.add_argument("--ui-readback", required=True)
    parser.add_argument("--contract", required=True)
    parser.add_argument("--output-dir", required=True)
    args = parser.parse_args(argv)
    try:
        return run(args)
    except (AdmissionBuildError, OSError, ValueError, subprocess.TimeoutExpired) as exc:
        # Do not leak source content/environment into the task log.
        print(json.dumps({"state": "HOLD", "reason": str(exc)[:240]}), file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
