#!/usr/bin/env python3
"""Dry-run by default. Merge one Hermes MCP entry; never starts a service."""
import argparse
import hashlib
import json
import os
import stat
import tempfile
from datetime import datetime, timezone
from pathlib import Path

SERVER = "onia_claude_text"
CONFIG = {
    "command": "python3",
    "args": ["/opt/onia/claude-text/20261015/evidence/cli-integration-prep-20261015/claude_mcp.py",
             "--repo", "/opt/onia/claude-text/20261015/policy", "--store", "/var/lib/onia/claude-text/receipts",
             "--claude", "/opt/onia/claude-cli/2.1.288/claude", "--execute"],
    "enabled": True, "trust": "untrusted", "tools": {"include": ["review_text", "status"]},
}


def sha(data):
    return hashlib.sha256(data).hexdigest()


def exclusive(path, raw):
    descriptor = os.open(path, os.O_CREAT | os.O_EXCL | os.O_WRONLY, 0o600)
    with os.fdopen(descriptor, "wb") as handle:
        handle.write(raw)
        handle.flush()
        os.fsync(handle.fileno())


def replace_private(path, raw, mode):
    descriptor, temp = tempfile.mkstemp(prefix=".onia-config-", dir=path.parent)
    try:
        with os.fdopen(descriptor, "wb") as handle:
            handle.write(raw)
            handle.flush()
            os.fsync(handle.fileno())
        os.chmod(temp, mode)
        os.replace(temp, path)
    finally:
        if os.path.exists(temp):
            os.unlink(temp)


def merge(path, backups, *, apply=False):
    # Use the YAML dependency already installed in the Hermes runtime, never install it here.
    import yaml
    if path.is_symlink() or not path.is_file():
        raise ValueError("config_not_regular_file")
    before = path.read_bytes()
    original = yaml.safe_load(before)
    if not isinstance(original, dict):
        raise ValueError("invalid_config")
    servers = original.get("mcp_servers", {})
    if not isinstance(servers, dict) or SERVER in servers:
        raise ValueError("server_exists_or_invalid_config")
    updated = {**original, "mcp_servers": {**servers, SERVER: CONFIG}}
    after = yaml.safe_dump(updated, allow_unicode=True, sort_keys=False).encode("utf-8")
    if yaml.safe_load(after) != updated:
        raise ValueError("yaml_roundtrip_failed")
    evidence = {"server": SERVER, "config_path": str(path), "before_sha256": sha(before), "after_sha256": sha(after),
                "mode": stat.S_IMODE(path.stat().st_mode), "state": "dry_run", "service_changed": False}
    if not apply:
        return evidence
    backups.mkdir(mode=0o700, parents=True, exist_ok=True)
    if backups.is_symlink():
        raise ValueError("backup_not_private_directory")
    os.chmod(backups, 0o700)
    tag = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%S%fZ")
    backup = backups / (tag + ".config.yaml")
    exclusive(backup, before)
    receipt = backups / (tag + ".receipt.json")
    evidence.update({"backup": str(backup), "state": "prepared"})
    exclusive(receipt, json.dumps(evidence, sort_keys=True).encode())
    if path.read_bytes() != before:
        raise ValueError("config_changed_during_prepare")
    replace_private(path, after, evidence["mode"])
    return {**evidence, "state": "applied", "receipt": str(receipt)}


def rollback(receipt, *, apply=False):
    evidence = json.loads(receipt.read_text(encoding="utf-8"))
    path, backup = Path(evidence["config_path"]), Path(evidence["backup"])
    if path.is_symlink() or backup.is_symlink():
        raise ValueError("rollback_symlink_rejected")
    raw = backup.read_bytes()
    if sha(raw) != evidence["before_sha256"]:
        raise ValueError("backup_hash_mismatch")
    current = sha(path.read_bytes())
    if current == evidence["before_sha256"]:
        return {"state": "already_restored", "service_changed": False}
    if current != evidence["after_sha256"]:
        raise ValueError("config_changed_after_merge")
    if apply:
        replace_private(path, raw, evidence["mode"])
    return {"state": "restored" if apply else "rollback_dry_run", "service_changed": False}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--config", type=Path, default=Path("/root/.hermes/config.yaml"))
    parser.add_argument("--backups", type=Path, default=Path("/root/.hermes/onia-claude-text-backups"))
    parser.add_argument("--rollback", type=Path)
    parser.add_argument("--apply-approved", action="store_true")
    args = parser.parse_args()
    try:
        output = rollback(args.rollback, apply=args.apply_approved) if args.rollback else merge(args.config, args.backups, apply=args.apply_approved)
    except Exception:
        # Config contains secrets. Never serialize loader/OS exceptions or YAML snippets.
        output = {"state": "blocked", "error": "config_validation_or_storage_failed", "service_changed": False}
    print(json.dumps(output, sort_keys=True))
    return 1 if output["state"] == "blocked" else 0


if __name__ == "__main__":
    raise SystemExit(main())
