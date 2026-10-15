#!/usr/bin/env python3
"""Read-only APT source classification. No shell, network, install, or raw URLs.

Only --execute reads the bounded standard APT source files. Unknown hosts, paths,
credentials and field values are never exported. This is not a trust verdict.
"""
import argparse
import json
from pathlib import Path
import re
from urllib.parse import urlsplit


PUBLIC_HOSTS = frozenset({
    "archive.ubuntu.com", "security.ubuntu.com", "azure.archive.ubuntu.com",
    "ports.ubuntu.com", "old-releases.ubuntu.com", "mirror.azureedge.net",
    "mirrors.edge.kernel.org", "mirror.math.princeton.edu",
})


def classify_uri(value):
    try:
        uri = urlsplit(value)
        host = uri.hostname or ""
        official = host in {"archive.ubuntu.com", "security.ubuntu.com"} or host.endswith(".archive.ubuntu.com")
        return {
            "host": host if host in PUBLIC_HOSTS else "REDACTED_OTHER_HOST",
            "recipe_host_eligible": official,
            "http_or_https": uri.scheme in {"http", "https"},
            "ubuntu_path": uri.path in {"/ubuntu", "/ubuntu/"},
            "credentials_present": bool(uri.username or uri.password),
            "query_or_fragment_present": bool(uri.query or uri.fragment),
        }
    except ValueError:
        return {"parse_error": "INVALID_URI"}


def classify_text(text, deb822):
    entries = []
    if deb822:
        for block in re.split(r"\n[ \t]*\n", text):
            fields, current, malformed = {}, None, False
            for line in block.splitlines():
                if not line.strip() or line.startswith("#"):
                    continue
                if line[0].isspace() and current:
                    fields[current] += " " + line.strip()
                elif ":" in line and not line[0].isspace():
                    key, value = line.split(":", 1)
                    key = key.lower()
                    if key in fields:
                        malformed = True
                    fields[key], current = value.strip(), key
                else:
                    malformed = True
            if fields or malformed:
                entries.append({
                    "malformed": malformed,
                    "enabled": fields.get("enabled", "yes").lower() == "yes",
                    "binary": "deb" in fields.get("types", "").split(),
                    "recipe_exact_type": fields.get("types") == "deb",
                    "uris": [classify_uri(v) for v in fields.get("uris", "").split()],
                    "ubuntu_keyring_explicit": fields.get("signed-by") == "/usr/share/keyrings/ubuntu-archive-keyring.gpg",
                    "noble_suites_only": bool(fields.get("suites")) and set(fields.get("suites", "").split()) <= {"noble", "noble-updates", "noble-security", "noble-backports"},
                })
    else:
        for line in text.splitlines():
            line = line.split("#", 1)[0].strip()
            if not line:
                continue
            match = re.fullmatch(r"(deb|deb-src)\s+(?:\[[^\]]*\]\s+)?(\S+)\s+(\S+)\s+(.+)", line)
            if not match:
                entries.append({"malformed": True})
            else:
                entries.append({"binary": match[1] == "deb", "uris": [classify_uri(match[2])], "noble_suite": match[3] in {"noble", "noble-updates", "noble-security", "noble-backports"}})
    return entries


def inspect():
    paths = [Path("/etc/apt/sources.list")]
    parts = Path("/etc/apt/sources.list.d")
    try:
        if parts.is_dir() and not parts.is_symlink():
            discovered = []
            for p in parts.iterdir():
                if len(discovered) >= 128:
                    return {"status": "SOURCE_COUNT_EXCEEDED", "writes": 0}
                discovered.append(p)
            paths += sorted(p for p in discovered if p.suffix in {".list", ".sources"} and re.fullmatch(r"[a-zA-Z0-9_.-]+", p.name))
    except OSError:
        return {"status": "SOURCE_DIRECTORY_UNREADABLE", "writes": 0}
    report = []
    for index, path in enumerate(paths):
        item = {"source_ordinal": index, "format": "deb822" if path.suffix == ".sources" else "one_line"}
        try:
            if path.is_symlink() or not path.is_file():
                item["status"] = "MISSING_OR_NONREGULAR"
            elif path.stat().st_size > 65536:
                item["status"] = "OVERSIZE"
            else:
                item["entries"] = classify_text(path.read_text(encoding="utf-8"), path.suffix == ".sources")
                item["status"] = "CLASSIFIED"
        except (OSError, UnicodeError):
            item["status"] = "UNREADABLE"
        report.append(item)
    return {"schema": 1, "kind": "APT_SOURCE_CLASSIFICATION_READ_ONLY", "source_files": report,
            "network_requests": 0, "writes": 0, "installs": 0, "subprocesses": 0,
            "signature_verification": "NOT_RUN", "unknown_hosts_and_values": "REDACTED"}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--execute", action="store_true")
    args = parser.parse_args()
    print(json.dumps(inspect() if args.execute else {"status": "DRY_RUN", "effects": 0}, sort_keys=True))


if __name__ == "__main__":
    main()
