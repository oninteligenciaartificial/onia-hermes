"""Shared one-line runner result contract and receipt validator."""
import argparse
import hashlib
import json
from pathlib import Path

RESULT_KEYS = {"result", "receipt", "receipt_sha256", "screenshot_sha256", "container_cleanup", "elapsed_ms"}


def success_summary(receipt_path, receipt_sha256, screenshot_sha256, elapsed_ms):
    return {"result": "offline_fixture_pass", "receipt": str(receipt_path),
        "receipt_sha256": receipt_sha256, "screenshot_sha256": screenshot_sha256,
        "container_cleanup": "verified_absent", "elapsed_ms": elapsed_ms}


def validate_stdout(path, root=Path("/tmp")):
    raw_path = Path(path)
    if raw_path.is_symlink() or not raw_path.is_file() or raw_path.stat().st_size > 65536:
        raise ValueError("runner output missing, unsafe, or oversized")
    data = json.loads(raw_path.read_text(encoding="utf-8"))
    if not isinstance(data, dict) or set(data) != RESULT_KEYS or data.get("result") != "offline_fixture_pass":
        raise ValueError("runner output schema mismatch")
    if data.get("container_cleanup") != "verified_absent" or not isinstance(data.get("elapsed_ms"), int) or data["elapsed_ms"] < 0:
        raise ValueError("runner lifecycle result is incomplete")
    allowed_root = Path(root).resolve(strict=True)
    receipt = Path(data["receipt"]).resolve(strict=True)
    if receipt.parent.parent != allowed_root or not receipt.parent.name.startswith("onia-pw-offline-") or receipt.name != "receipt.json":
        raise ValueError("receipt path escaped the one-use output directory")
    if receipt.is_symlink() or not receipt.is_file() or receipt.stat().st_size > 65536:
        raise ValueError("receipt file missing, unsafe, or oversized")
    receipt_bytes = receipt.read_bytes()
    if hashlib.sha256(receipt_bytes).hexdigest() != data["receipt_sha256"]:
        raise ValueError("receipt hash mismatch")
    detail = json.loads(receipt_bytes.decode("utf-8"))
    if detail.get("status") != "PASS" or detail.get("phase") != "offline-synthetic":
        raise ValueError("execution receipt is not a successful offline smoke")
    if detail.get("container_cleanup") != "verified_absent" or detail.get("network_mode") != "none" or detail.get("chromium_sandbox") is not True:
        raise ValueError("execution receipt isolation or cleanup proof is incomplete")
    if detail.get("runtime_invocations") != 1 or detail.get("browser_launches") != 1 or detail.get("fixture_pages") != 1 or detail.get("remote_urls_requested") != 0:
        raise ValueError("execution receipt lifecycle counters mismatch")
    shot = receipt.parent / "offline-fixture.jpg"
    if shot.is_symlink() or not shot.is_file() or shot.stat().st_size <= 0 or shot.stat().st_size > 2_000_000:
        raise ValueError("JPEG artifact missing, unsafe, or oversized")
    content = shot.read_bytes()
    if content[:2] != b"\xff\xd8" or content[-2:] != b"\xff\xd9":
        raise ValueError("artifact is not a complete JPEG")
    if hashlib.sha256(content).hexdigest() != data["screenshot_sha256"] or data["screenshot_sha256"] != detail.get("screenshot_sha256"):
        raise ValueError("JPEG hash mismatch")
    return data


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("output")
    ap.add_argument("--root", default="/tmp")
    a = ap.parse_args()
    result = validate_stdout(a.output, Path(a.root))
    print(json.dumps(result, sort_keys=True, separators=(",", ":")))


if __name__ == "__main__":
    main()
