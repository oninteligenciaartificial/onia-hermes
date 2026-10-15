#!/usr/bin/env python3
"""Bind a successful GPG manifest verification to the reviewed signing key."""
import sys
from pathlib import Path


def verified_signer(status, expected):
    signatures = []
    for line in status.splitlines():
        fields = line.split()
        if len(fields) >= 3 and fields[:2] == ["[GNUPG:]", "VALIDSIG"]:
            signatures.append(fields[2])
    return signatures == [expected]


if __name__ == "__main__":
    valid = verified_signer(Path(sys.argv[1]).read_text(encoding="ascii"), sys.argv[2])
    if not valid:
        print("Manifest signer fingerprint mismatch", file=sys.stderr)
    raise SystemExit(0 if valid else 1)
