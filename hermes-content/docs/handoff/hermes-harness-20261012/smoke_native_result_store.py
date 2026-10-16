"""Offline POSIX sink smoke: real fsync, store and reopen in distinct processes."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile

from native_result_store import FileResultSink


OPERATION = "11111111-1111-4111-8111-111111111111"
REQUEST_SHA = hashlib.sha256(b"hermes-ci-synthetic-request-v1").hexdigest()
BUNDLE = b"hermes-ci-synthetic-result-v1\x00\xff\n"
DIGEST = hashlib.sha256(BUNDLE).hexdigest()


def child(mode, root):
    sink = FileResultSink(Path(root))
    if mode == "store":
        receipt = sink.store(OPERATION, REQUEST_SHA, BUNDLE)
        print(json.dumps(receipt, sort_keys=True))
        return
    receipt = json.loads(sys.stdin.read(4097))
    if receipt["sha256"] != DIGEST or receipt["bytes_written"] != len(BUNDLE):
        raise ValueError("synthetic receipt mismatch")
    loaded = sink.load(receipt["ref"], OPERATION, REQUEST_SHA, DIGEST)
    if loaded != BUNDLE or hashlib.sha256(loaded).hexdigest() != DIGEST:
        raise ValueError("synthetic result mismatch")
    print("PASS: separate-process exact bytes and SHA-256; real directory fsync")


def smoke(parent):
    parent = Path(parent).resolve(strict=True)
    with tempfile.TemporaryDirectory(prefix="hermes-sink-smoke-", dir=parent) as root:
        if (os.stat(root).st_mode & 0o777) != 0o700:
            raise ValueError("private smoke root required")
        child_code = ("import sys; sys.path.insert(0, sys.argv[1]); "
                      "from smoke_native_result_store import child; "
                      "child(sys.argv[2], sys.argv[3])")
        command = [sys.executable, "-B", "-c", child_code, str(Path(__file__).parent)]
        stored = subprocess.run(command + ["store", root],
                                capture_output=True, text=True, timeout=15)
        if stored.returncode != 0 or len(stored.stdout) > 4096:
            raise RuntimeError("sink store process failed")
        loaded = subprocess.run(command + ["load", root],
                                input=stored.stdout, capture_output=True,
                                text=True, timeout=15)
        if loaded.returncode != 0:
            raise RuntimeError("sink reopen process failed")
    print("PASS: synthetic sink smoke; exact bytes/hash; two processes; owned root cleaned")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--temp-parent", required=True)
    args = parser.parse_args()
    smoke(args.temp_parent)


if __name__ == "__main__":
    main()
