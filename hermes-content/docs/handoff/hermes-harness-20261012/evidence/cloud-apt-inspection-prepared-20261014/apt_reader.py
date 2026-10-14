"""Read-only public APT/OS metadata; stdlib, no apt/install/network/browser.

Execute once only after root's exact diagnostic contract/profile review. This
reader never runs source/config hooks and never exports source URLs or values.
"""
import hashlib
import itertools
import json
import os
from pathlib import Path
import re
import shlex
import signal
import selectors
import stat
import subprocess
import tempfile
import time


MAX_FILE = 1048576
MAX_JSON = 65536
MAX_ENTRIES = 128
PRIVATE_NAME = re.compile(r"private|secret|token|credential|password|customer|client|proxy", re.I)
PRIVATE_BYTES = re.compile(rb"://[^\s/]+@|(?:password|access[_-]?token|client[_-]?secret|credential)\s*[:=]", re.I)
PUBLIC_OS_KEYS = {"NAME", "ID", "ID_LIKE", "PRETTY_NAME", "VERSION", "VERSION_ID", "VERSION_CODENAME",
                  "UBUNTU_CODENAME", "BUILD_ID", "VARIANT", "VARIANT_ID", "IMAGE_ID", "IMAGE_VERSION"}
DANGER_NAMES = {"Acquire::http::Proxy", "Acquire::https::Proxy", "Acquire::ftp::Proxy",
    "Acquire::http::Proxy-Auto-Detect", "Acquire::https::Proxy-Auto-Detect",
    "Acquire::AllowInsecureRepositories", "Acquire::AllowDowngradeToInsecureRepositories",
    "Acquire::https::Verify-Peer", "Acquire::https::Verify-Host", "APT::Get::AllowUnauthenticated",
    "DPkg::Pre-Invoke", "DPkg::Post-Invoke", "DPkg::Pre-Install-Pkgs",
    "APT::Update::Pre-Invoke", "APT::Update::Post-Invoke"}


PUBLIC_PATHS = {"/etc/apt/sources.list", "/etc/apt/sources.list.d/ubuntu.sources",
    "/etc/apt/sources.list.d/ubuntu.list", "/etc/apt/apt.conf", "/usr/bin/dpkg",
    "/etc/os-release", "/usr/lib/os-release", "/usr/share/keyrings/ubuntu-archive-keyring.gpg",
    "/usr/share/keyrings/ubuntu-archive-removed-keys.gpg"}


class ReaderDeadlineExpired(Exception):
    """Total reader deadline: abort without further serialization or output."""


def public_metadata(path, *, inspect_names=False, config_names_only=False, alias=None):
    public = str(path) in PUBLIC_PATHS
    result = {"path": str(path) if public else alias or "UNKNOWN_FILE"}
    try:
        info = path.lstat()
    except FileNotFoundError:
        return {**result, "status": "MISSING"}, None
    except OSError as exc:
        return {**result, "status": type(exc).__name__}, None
    result.update(uid=info.st_uid, gid=info.st_gid, mode=oct(stat.S_IMODE(info.st_mode)), bytes=info.st_size)
    if not stat.S_ISREG(info.st_mode):
        return {**result, "status": "NONREGULAR_NOT_FOLLOWED"}, None
    if info.st_uid != 0 or info.st_mode & 0o022 or info.st_size > MAX_FILE:
        return {**result, "status": "UNTRUSTED_OR_OVERSIZE_NOT_READ"}, None
    if not public and not config_names_only:
        return {**result, "status": "METADATA_ONLY_UNKNOWN_PATH", "sha256": "WITHHELD"}, None
    descriptor = None
    try:
        descriptor = os.open(path, os.O_RDONLY | os.O_NOFOLLOW)
        opened = os.fstat(descriptor)
        if (opened.st_dev, opened.st_ino, opened.st_uid, opened.st_mode) != (info.st_dev, info.st_ino, info.st_uid, info.st_mode):
            return {**result, "status": "CHANGED_DURING_READ"}, None
        with os.fdopen(descriptor, "rb") as source:
            descriptor = None
            raw = source.read(MAX_FILE + 1)
        if len(raw) > MAX_FILE:
            return {**result, "status": "OVERSIZE_NOT_EXPORTED"}, None
        if config_names_only:
            return {**result, "status": "METADATA_AND_CONSTANT_CATEGORIES_ONLY"}, raw
        if PRIVATE_BYTES.search(raw):
            return {**result, "status": "POSSIBLE_PRIVATE_CONTENT_HASH_WITHHELD"}, raw if config_names_only else None
        result.update(status="OBSERVED_PUBLIC_METADATA", sha256=hashlib.sha256(raw).hexdigest())
        return result, raw if inspect_names else None
    except (OSError, ValueError) as exc:
        return {**result, "status": type(exc).__name__}, None
    finally:
        if descriptor is not None:
            os.close(descriptor)


def entries(directory, suffixes):
    info = directory.lstat() if directory.exists() else None
    if info is None:
        return [], {"path": str(directory), "status": "MISSING", "coverage_complete": True}
    if not stat.S_ISDIR(info.st_mode) or info.st_uid != 0 or info.st_mode & 0o022:
        return [], {"path": str(directory), "status": "UNTRUSTED_DIRECTORY_NOT_TRAVERSED", "coverage_complete": False}
    # Bound ALL directory entries before filtering/sorting or accumulating.
    with os.scandir(directory) as iterator:
        candidates = list(itertools.islice(iterator, MAX_ENTRIES + 1))
    if len(candidates) > MAX_ENTRIES:
        return [], {"path": str(directory), "status": "ENTRY_CAP_EXCEEDED", "count_lower_bound": MAX_ENTRIES + 1, "coverage_complete": False}
    paths = sorted(Path(entry.path) for entry in candidates if entry.name.endswith(suffixes))
    return paths, {"path": str(directory), "status": "READ_ONLY_ENUMERATION", "count": len(paths),
                   "unknown_names_exported_as_ordinal_aliases": True, "coverage_complete": True}


def dangerous_option_names(raw):
    # Mask all quoted VALUE strings before lexing names/braces. This is name
    # presence, not effective APT config or a verdict that the option is enabled.
    text = raw.decode("utf-8", errors="strict")
    text = re.sub(r'"(?:\\.|[^"\\])*"', '""', text)
    text = re.sub(r"/\*.*?\*/", "", text, flags=re.S)
    text = re.sub(r"(?m)//.*$|#.*$", "", text)
    stack, found = [], set()
    for match in re.finditer(r'([A-Za-z0-9_.:+-]+)\s*(\{|"")|(\})', text):
        if match[3]:
            if stack:
                stack.pop()
            continue
        key, kind = match[1], match[2]
        name = "::".join(stack + [key])
        lowered = name.lower()
        if lowered.startswith("binary::"):
            parts = lowered.split("::", 2)
            lowered = parts[2] if len(parts) == 3 else ""
        for known in DANGER_NAMES:
            canonical = known.lower()
            match_name = lowered == canonical or lowered.startswith(canonical + "::")
            parts = canonical.split("::")
            if len(parts) == 3 and parts[0] == "acquire":
                # Both protocol::option::host and protocol::host::option.
                match_name |= lowered.startswith("::".join(parts[:2]) + "::") and lowered.endswith("::" + parts[2])
            if match_name:
                found.add(known)  # host-specific suffixes/values NEVER emitted
        if kind == "{":
            stack.append(key)
    return {"categories": sorted(found), "scan_completeness": "UNKNOWN_LEXICAL_ONLY_NOT_FULL_APT_PARSER"}


def inspect_os_release():
    path = Path("/etc/os-release")
    if path.is_symlink():
        if path.resolve() != Path("/usr/lib/os-release"):
            return {"path": str(path), "status": "NONSTANDARD_OS_RELEASE_TARGET_NOT_READ"}
        path = Path("/usr/lib/os-release")
    metadata, raw = public_metadata(path, inspect_names=True)
    if raw is None:
        return metadata
    exact = {}
    for line in raw.decode("utf-8", errors="strict").splitlines():
        if "=" not in line or line.startswith("#"):
            continue
        key, value = line.split("=", 1)
        if key not in PUBLIC_OS_KEYS:
            continue
        parts = shlex.split(value, posix=True)
        value = parts[0] if len(parts) == 1 else "UNKNOWN_INVALID_STANDARD_FIELD"
        if len(value) > 256 or "://" in value or "@" in value or PRIVATE_NAME.search(value):
            exact[key] = "WITHHELD_NONPUBLIC_OR_NONSTANDARD_VALUE"
        else:
            exact[key] = value
    return {**metadata, "public_standard_fields_exact": exact,
            "raw_os_release_content_not_exported": True, "unlisted_fields_and_URL_values": "NOT_EXPORTED"}


def architecture():
    executable = Path("/usr/bin/dpkg")
    metadata, _ = public_metadata(executable)
    if metadata["status"] != "OBSERVED_PUBLIC_METADATA":
        return {"status": "EXISTING_DPKG_UNAVAILABLE", "executable_metadata": metadata}
    child = subprocess.Popen([str(executable), "--print-architecture"], stdin=subprocess.DEVNULL,
        stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, shell=False)
    raw = bytearray()
    deadline = time.monotonic() + 3
    try:
        with selectors.DefaultSelector() as selector:
            os.set_blocking(child.stdout.fileno(), False)
            selector.register(child.stdout, selectors.EVENT_READ)
            while len(raw) <= 128:
                remaining = deadline - time.monotonic()
                if remaining <= 0 or not selector.select(remaining):
                    raise TimeoutError("bounded dpkg capture")
                chunk = os.read(child.stdout.fileno(), 129 - len(raw))
                if not chunk:
                    break
                raw.extend(chunk)
            if len(raw) > 128:
                raise ValueError("dpkg output cap")
            returncode = child.wait(timeout=max(0.001, deadline-time.monotonic()))
    finally:
        if child.poll() is None:
            child.kill()
        child.wait(timeout=1)
        child.stdout.close()
    raw = bytes(raw)
    if returncode != 0 or not re.fullmatch(rb"[a-z0-9][a-z0-9-]{0,31}\n?", raw):
        return {"status": "ARCHITECTURE_QUERY_NONDEFINITIVE", "raw_output_not_exported": True}
    return {"status": "OBSERVED", "exact_architecture": raw.decode("ascii").strip(),
            "command": "/usr/bin/dpkg --print-architecture", "packages_modified": False}


def build_report():
    started = time.monotonic()
    source_paths, source_directory = entries(Path("/etc/apt/sources.list.d"), (".list", ".sources"))
    source_paths.insert(0, Path("/etc/apt/sources.list"))
    sources = [public_metadata(path, alias="SOURCE_UNKNOWN_%03d" % index)[0] for index, path in enumerate(source_paths)]
    config_paths, config_directory = entries(Path("/etc/apt/apt.conf.d"), ("",))
    config_paths.insert(0, Path("/etc/apt/apt.conf"))
    configs = []
    for index, path in enumerate(config_paths):
        metadata, raw = public_metadata(path, config_names_only=True, alias="APT_CONFIG_UNKNOWN_%03d" % index)
        if raw is not None:
            try:
                metadata["dangerous_names_present"] = dangerous_option_names(raw)
            except UnicodeError:
                metadata["names_scan"] = "UNKNOWN_ENCODING"
        configs.append(metadata)
    report = {"schema": 1, "inspection_kind": "APT_OS_METADATA_READ_ONLY",
        "recorded_at_epoch": int(time.time()), "uid": os.getuid(), "gid": os.getgid(),
        "os_release": inspect_os_release(), "dpkg_architecture": architecture(),
        "source_directory": source_directory, "source_files": sources,
        "ubuntu_keyrings": [public_metadata(Path(path))[0] for path in (
            "/usr/share/keyrings/ubuntu-archive-keyring.gpg", "/usr/share/keyrings/ubuntu-archive-removed-keys.gpg")],
        "apt_config_directory": config_directory, "apt_config_files": configs,
        "option_names_semantics": "NAME_PRESENCE_ONLY_NOT_VALUES_OR_ENABLED_STATE; read-only lexical scan, not effective apt-config evaluation",
        "third_party_sources": "ORDINAL_ALIAS_AND_METADATA_ONLY; NO_HASH_CONTENT_URL_OR_HOST_EXPORTED",
        "package_downloads": 0, "package_installs": 0, "public_network_requests": 0,
        "browser_launches": 0, "unshare_or_tests": 0,
        "task_id": {"value": "UNKNOWN", "provenance": "setup reader has no authoritative provider task handle"},
        "environment_id": {"value": "UNKNOWN", "provenance": "no runtime environment_status queried"},
        "source_or_config_hooks_executed": False, "process_environment_or_auth_files_read": False,
        "duration_seconds": round(time.monotonic()-started, 6)}
    return report


if __name__ == "__main__":
    def deadline(signum, frame):
        raise ReaderDeadlineExpired("read deadline reached")
    signal.signal(signal.SIGALRM, deadline)
    signal.alarm(15)
    try:
        report = build_report()
    except ReaderDeadlineExpired:
        raise
    except Exception as exc:
        report = {"schema": 1, "inspection_kind": "APT_OS_METADATA_READ_ONLY", "status": "BLOCKED",
                  "error_class": type(exc).__name__, "private_error_message_not_exported": True}
    payload = json.dumps(report, sort_keys=True, separators=(",", ":")).encode("utf-8")
    if len(payload) > MAX_JSON:
        payload = b'{"schema":1,"status":"BLOCKED_OUTPUT_CAP","inspection_kind":"APT_OS_METADATA_READ_ONLY"}'
    directory = Path(tempfile.mkdtemp(prefix="onia-apt-public-inspection-"))
    target = directory / "report.json"
    with target.open("xb") as output:
        output.write(payload)
    os.chmod(target, 0o600)
    # Setup fallback is the SAME sanitized public JSON, not raw config/log data.
    print("ONIA_APT_INSPECTION_JSON " + payload.decode("utf-8"))
    print("ONIA_APT_INSPECTION_OUTPUT " + json.dumps({"path": str(target), "sha256": hashlib.sha256(payload).hexdigest(),
          "bytes": len(payload), "instance_epoch": report.get("recorded_at_epoch", "UNKNOWN")}, separators=(",", ":")))
    # Deadline covers reads, serialization, output-file write and stdout too.
    signal.alarm(0)
