#!/usr/bin/env python3
"""PENDING APPROVAL, NOT EXECUTED. Snapshot source selection candidate.
No browser launch, account creation, security or network-policy modification.
"""
import argparse
import hashlib
import importlib.util
import json
import os
from pathlib import Path
import pwd
import re
import shutil
import shlex
import subprocess
import sys
import tempfile
from urllib.parse import urlparse
from datetime import datetime, timezone

ENVIRONMENT = "6abad782eba0819196ca234dc3abc327"
SETUP_TRIAL_OPERATION = "9fc238a7-aa41-433c-8681-a9bf6ec6a340"
PARENT_R4_OPERATION = "f90f55bc-48d8-406f-a11e-05ddd2683014"
ROOT = Path("/opt/onia-public-browser-1.64.0")
PYTHON = "/usr/bin/python3"
PACKAGES = ("playwright==1.64.0", "greenlet==3.5.6", "pyee==13.0.1", "typing-extensions==4.16.0")
# Official Playwright v1.64.0 nativeDeps ubuntu24.04-x64 Chromium+tools list.
APT_NAMES = frozenset((
    "xvfb", "fonts-noto-color-emoji", "fonts-unifont", "libfontconfig1", "libfreetype6",
    "xfonts-cyrillic", "xfonts-scalable", "fonts-liberation", "fonts-ipafont-gothic",
    "fonts-wqy-zenhei", "fonts-tlwg-loma-otf", "fonts-freefont-ttf", "libasound2t64",
    "libatk-bridge2.0-0t64", "libatk1.0-0t64", "libatspi2.0-0t64", "libcairo2",
    "libcups2t64", "libdbus-1-3", "libdrm2", "libgbm1", "libglib2.0-0t64", "libnspr4",
    "libnss3", "libpango-1.0-0", "libx11-6", "libxcb1", "libxcomposite1", "libxdamage1",
    "libxext6", "libxfixes3", "libxkbcommon0", "libxrandr2",
))


PHASE = "preflight"


def stop(reason, *, unresolved_packages=()):
    print(json.dumps({"state": "BLOCKED", "phase": PHASE, "reason": reason,
                      "unresolved_packages": sorted(set(unresolved_packages) & APT_NAMES)}, sort_keys=True))
    raise SystemExit("BLOCKED: " + reason)


def command(argv, *, env=None, timeout=600):
    # Never shell/eval; inherit proxy/CA environment, do not dump output or secrets.
    try:
        result = subprocess.run(argv, env=env, stdout=subprocess.DEVNULL,
                                stderr=subprocess.DEVNULL, timeout=timeout, check=False)
    except (OSError, subprocess.TimeoutExpired):
        stop("command unavailable or timed out; reconcile without automatic retry")
    if result.returncode:
        stop("command failed; installation may be partial; reconcile without automatic retry")


def public_url(value, hosts):
    url = urlparse(value)
    return (url.scheme == "https" and url.hostname in hosts and url.port in (None, 443)
            and not url.username and not url.password and not url.query and not url.fragment)


def ubuntu_uri(value):
    try:
        url = urlparse(value)
        host = url.hostname or ""
        if host == "snapshot.ubuntu.com":
            match = re.fullmatch(r"/ubuntu/([0-9]{8}T[0-9]{6}Z)/?", url.path)
            if match is None:
                return False
            # Reject impossible dates/times, not just a string shaped like a timestamp.
            datetime.strptime(match[1], "%Y%m%dT%H%M%SZ").replace(tzinfo=timezone.utc)
            return (url.scheme == "https" and url.port in (None, 443)
                    and url.username is None and url.password is None and not url.params
                    and "?" not in value and "#" not in value)
        return bool(url.scheme in {"http", "https"} and (host in {"archive.ubuntu.com", "security.ubuntu.com"}
                or re.fullmatch(r"[a-z0-9-]+\.archive\.ubuntu\.com", host))
                and url.port in (None, 80 if url.scheme == "http" else 443)
                and url.path in {"/ubuntu", "/ubuntu/"} and not url.username and not url.password
                and not url.query and not url.fragment)
    except ValueError:
        return False


def controlled_download_env():
    forbidden = {"PLAYWRIGHT_DOWNLOAD_HOST", "PLAYWRIGHT_CHROMIUM_DOWNLOAD_HOST",
                 "PLAYWRIGHT_FIREFOX_DOWNLOAD_HOST", "PLAYWRIGHT_WEBKIT_DOWNLOAD_HOST",
                 "PIP_FIND_LINKS", "PIP_CLIENT_CERT", "APT_CONFIG"}
    if forbidden.intersection(os.environ) or any(k.startswith("PW_TEST_") for k in os.environ):
        stop("download/trust override present; variable values not inspected or recorded")
    if (os.environ.get("NODE_TLS_REJECT_UNAUTHORIZED") == "0"
            or os.environ.get("PYTHONHTTPSVERIFY") == "0"
            or os.environ.get("GIT_SSL_NO_VERIFY", "").lower() in {"1", "true", "yes"}):
        stop("TLS validation bypass indicator present")
    controlled = {k: v for k, v in os.environ.items() if not k.startswith("PIP_") or k == "PIP_CERT"}
    controlled.update(PIP_CONFIG_FILE="/dev/null", PIP_INDEX_URL="https://pypi.org/simple",
                      PIP_EXTRA_INDEX_URL="", PIP_TRUSTED_HOST="", PIP_DISABLE_PIP_VERSION_CHECK="1")
    return controlled


APT_KEYRING = "/usr/share/keyrings/ubuntu-archive-keyring.gpg"
APT_SUITES = {"noble", "noble-updates", "noble-security", "noble-backports"}
APT_COMPONENTS = {"main", "restricted", "universe", "multiverse"}


def protected_existing(path, *, directory=False):
    # Do not follow mutable/symlinked source paths or install/download a keyring.
    for item in (path, *path.parents):
        metadata = item.lstat()
        if (item.is_symlink() or metadata.st_uid != 0 or metadata.st_mode & 0o022
                or (item == path and not (item.is_dir() if directory else item.is_file()))
                or (item != path and not item.is_dir())):
            stop("existing APT source/keyring path is not root-owned, regular and protected")


def source_entries(text, *, deb822):
    if deb822:
        for section in re.split(r"\n[ \t]*\n", text.strip("\n")):
            fields, current = {}, None
            for line in section.splitlines():
                if not line.strip() or line.startswith("#"):
                    continue
                if line[0].isspace():
                    if current is None:
                        stop("unsupported deb822 continuation")
                    fields[current] += " " + line.strip()
                    continue
                if ":" not in line:
                    stop("unsupported deb822 source line")
                key, value = line.split(":", 1)
                key = key.lower()
                if not re.fullmatch(r"[a-z][a-z0-9-]*", key) or key in fields:
                    stop("ambiguous deb822 source fields")
                fields[key], current = value.strip(), key
            if fields:
                yield fields
    else:
        for line in text.splitlines():
            line = line.split("#", 1)[0].strip()
            if not line:
                continue
            match = re.fullmatch(r"(deb|deb-src)\s+(?:\[([^\]]*)\]\s+)?(\S+)\s+(\S+)\s+(.+)", line)
            if match is None:
                stop("unsupported one-line APT source")
            kind, options, uri, suite, components = match.groups()
            fields = {"types": kind, "uris": uri, "suites": suite, "components": components}
            for option in (options or "").split():
                if "=" not in option:
                    stop("unsupported one-line APT option")
                key, value = option.split("=", 1)
                key = {"arch": "architectures"}.get(key, key)
                if key in fields:
                    stop("ambiguous one-line APT option")
                fields[key] = value
            yield fields


def existing_ubuntu_sources():
    parts = Path("/etc/apt/sources.list.d")
    legacy = Path("/etc/apt/sources.list")
    paths = [legacy] if legacy.exists() or legacy.is_symlink() else []
    if parts.exists() or parts.is_symlink():
        protected_existing(parts, directory=True)
        paths += sorted(p for p in parts.iterdir() if p.suffix in {".list", ".sources"}
                        and re.fullmatch(r"[a-zA-Z0-9_.-]+", p.name))
    keyring = Path(APT_KEYRING)
    if not keyring.exists() or keyring.is_symlink():
        stop("existing Ubuntu archive keyring missing; no key/repository creation")
    protected_existing(keyring)
    records, evidence, suites = [], [], set()
    allowed = {"types", "uris", "suites", "components", "signed-by", "architectures", "enabled"}
    for source in paths:
        protected_existing(source)
        if source.stat().st_size > 65536:
            stop("APT source file exceeds bounded inspection size")
        raw = source.read_bytes()
        try:
            entries = source_entries(raw.decode("utf-8"), deb822=source.suffix == ".sources")
            count = 0
            for fields in entries:
                enabled = fields.get("enabled", "yes").lower()
                if enabled == "no":
                    continue
                uris = fields.get("uris", "").split()
                if not uris:
                    stop("active APT source has no URI")
                # Unrelated configured repositories are never copied/used/reported.
                archive_hosts = [urlparse(u).hostname or "" for u in uris]
                if not any(h in {"archive.ubuntu.com", "security.ubuntu.com", "snapshot.ubuntu.com"}
                           or h.endswith(".archive.ubuntu.com") for h in archive_hosts):
                    continue
                if fields.get("types") == "deb-src":
                    continue  # Existing source-code indexes are not installation input.
                requested_suites = fields.get("suites", "").split()
                components = fields.get("components", "").split()
                if (set(fields) - allowed or enabled != "yes" or fields.get("types") != "deb"
                        or not all(ubuntu_uri(u) for u in uris)
                        or not requested_suites or not set(requested_suites) <= APT_SUITES
                        or not components or not set(components) <= APT_COMPONENTS
                        or fields.get("architectures", "amd64") != "amd64"
                        or fields.get("signed-by", APT_KEYRING) != APT_KEYRING
                        or (source.suffix == ".sources" and fields.get("signed-by") != APT_KEYRING)):
                    stop("unsupported existing Ubuntu source/trust configuration; no fallback")
                # Same existing URI/suite/components; restrict implicit .list trust to Ubuntu's existing keyring.
                record = ("Types: deb\nURIs: " + " ".join(uris) + "\nSuites: " + " ".join(requested_suites)
                          + "\nComponents: " + " ".join(components) + "\nArchitectures: amd64"
                          + "\nSigned-By: " + APT_KEYRING)
                if record not in records:
                    records.append(record)
                suites.update(requested_suites)
                count += 1
            if count:
                evidence.append({"path": str(source), "sha256": hashlib.sha256(raw).hexdigest(),
                                 "selected_binary_entries": count})
        except (UnicodeError, ValueError):
            stop("APT source is not a supported bounded UTF-8 definition")
    if not records:
        stop("no supported existing official Ubuntu binary source; no new repository")
    return "\n\n".join(records) + "\n", evidence, suites


def require_supported_ubuntu():
    if os.name != "posix":
        stop("recipe supports existing Ubuntu24.04 amd64 only")
    fields = {}
    for line in Path("/etc/os-release").read_text().splitlines():
        if not line.strip() or line.startswith("#"):
            continue
        match = re.fullmatch(r"([A-Z_][A-Z0-9_]*)=(.*)", line)
        if match is None:
            stop("unsupported os-release definition")
        key, raw_value = match.groups()
        if key in fields:
            stop("duplicate os-release field")
        try:
            value = shlex.split(raw_value, posix=True)
        except ValueError:
            stop("unsupported os-release quoting")
        if len(value) > 1:
            stop("ambiguous os-release value")
        fields[key] = value[0] if value else ""
    if (fields.get("ID") != "ubuntu" or fields.get("VERSION_ID") != "24.04"
            or any(fields.get(k, "noble") != "noble" for k in ("VERSION_CODENAME", "UBUNTU_CODENAME"))
            or os.uname().machine != "x86_64"):
        stop("recipe supports observed Ubuntu24.04 amd64 only")
    architecture = subprocess.run(["/usr/bin/dpkg", "--print-architecture"], capture_output=True,
                                  text=True, timeout=10, check=False)
    if architecture.returncode or architecture.stdout.strip() != "amd64":
        stop("existing Debian userland architecture is not amd64")


def isolated_apt_configuration(source_text, env):
    # Read effective config privately; apt-config dump does not invoke update/install hooks.
    result = subprocess.run(["/usr/bin/apt-config", "dump"], env=env, capture_output=True,
                            text=True, timeout=10, check=False)
    if result.returncode or len(result.stdout) > 1048576:
        stop("bounded effective APT configuration inspection failed")
    hosts = {urlparse(u).hostname for line in source_text.splitlines() if line.startswith("URIs: ")
             for u in line[6:].split()}
    selected = {}
    for line in result.stdout.splitlines():
        prefix = re.match(r"(\S+)[ \t]+", line)
        if prefix is None:
            stop("unsupported effective APT configuration dump")
        key = prefix[1].lower()
        if (("proxy-auto-detect" in key or "proxyautodetect" in key
             or key.endswith(("::sslcert", "::sslkey")))
                or (key.startswith("binary::") and "::acquire::" in key)):
            stop("unsupported dynamic proxy/client certificate/binary transport configuration")
        match = re.fullmatch(r'acquire::(http|https)::(proxy|cainfo)(?:::(.+))?', key)
        host_ca = re.fullmatch(r'acquire::https::([^:]+)::cainfo', key)
        if match:
            option, host = match[2], match[3]
            if host is not None and host not in hosts:
                continue
        elif host_ca and host_ca[1] in hosts:
            option = "cainfo"
        else:
            continue  # No global hooks, trust/transport bypass, method override or binary settings copied.
        value_match = re.fullmatch(r'\S+[ \t]+"([^"\\\r\n]*)";', line)
        if value_match is None or key in selected:
            stop("unsupported/ambiguous existing APT proxy/CA value; values not recorded")
        value = value_match[1]
        if option == "cainfo" and value:
            ca = Path(value)
            if not ca.is_absolute() or not ca.exists():
                stop("existing APT CA file is missing or unsupported")
            protected_existing(ca)
        selected[key] = value
    # Loaded first via APT_CONFIG, so global config fragments/main/hooks never load.
    empty = ROOT / "apt-empty"
    lines = ['Dir::Etc::Parts "' + str(empty) + '";', 'Dir::Etc::main "/dev/null";',
             'Dir::Etc::netrc "/dev/null";', 'Dir::Etc::netrcparts "' + str(empty) + '";',
             'Dir::Etc::preferences "/dev/null";', 'Dir::Etc::preferencesparts "' + str(empty) + '";',
             'Dir::Bin::Methods "/usr/lib/apt/methods";', 'Dir::Bin::dpkg "/usr/bin/dpkg";',
             'APT::Architecture "amd64";', '#clear APT::Architectures;',
             'APT::Architectures { "amd64"; };', 'Acquire::EnableSrvRecords "false";',
             'Acquire::Retries "0";']
    lines += [key + ' "' + value + '";' for key, value in sorted(selected.items())]
    return "\n".join(lines) + "\n"


def resolve_apt_candidates(apt_options, apt_env):
    apt = {}
    unresolved = []
    for name in sorted(APT_NAMES):
        try:
            result = subprocess.run(["/usr/bin/apt-cache", *apt_options, "policy", name], capture_output=True,
                                    text=True, env=apt_env, timeout=10, check=False)
        except (OSError, subprocess.TimeoutExpired):
            unresolved.append(name)
            continue
        if result.returncode or len(result.stdout) > 1048576:
            unresolved.append(name)
            continue
        candidates = [line.strip().split(": ", 1)[1] for line in result.stdout.splitlines()
                      if line.strip().startswith("Candidate: ")]
        if len(candidates) != 1 or candidates[0] == "(none)":
            unresolved.append(name)
            continue
        if not re.fullmatch(r"[0-9A-Za-z.+:~_-]{1,160}", candidates[0]):
            unresolved.append(name)
            continue
        candidate_lines = []
        in_candidate = False
        for line in result.stdout.splitlines():
            words = line.strip().split()
            if words and words[0] == "***":
                words = words[1:]
            if len(words) == 2 and words[1].isdigit() and not words[0].isdigit():
                in_candidate = words[0] == candidates[0]
            elif in_candidate:
                candidate_lines.append(line)
        repository_uris = re.findall(r"https?://\S+", "\n".join(candidate_lines))
        if not repository_uris or not all(ubuntu_uri(uri) for uri in repository_uris):
            unresolved.append(name)
            continue
        apt[name] = candidates[0]
    if unresolved:
        stop("approved dependencies unresolved or origin unverified; no substitution or automatic retry",
             unresolved_packages=unresolved)
    return apt


def verify_ubuntu_releases(apt_lists, expected_suites):
    releases = list(apt_lists.glob("*_InRelease"))
    observed_suites = set()
    for release in releases:
        text = release.read_text()
        pairs = re.findall(r"^(Origin|Label|Suite|Codename):[ \t]*(.+)$", text, re.MULTILINE)
        fields = dict(pairs)
        if (not text.startswith("-----BEGIN PGP SIGNED MESSAGE-----")
                or "\n-----BEGIN PGP SIGNATURE-----" not in text
                or len(fields) != len(pairs) or fields.get("Origin") != "Ubuntu"
                or fields.get("Label") != "Ubuntu" or fields.get("Codename") != "noble"
                or fields.get("Suite") not in expected_suites):
            stop("authenticated Ubuntu Release origin/codename/suite is unsupported")
        observed_suites.add(fields["Suite"])
    if not releases or observed_suites != expected_suites:
        stop("authenticated Ubuntu Release set is incomplete; no automatic retry")


def main():
    global PHASE
    PHASE = "preflight"
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply-reviewed-manifest", type=Path)
    parser.add_argument("--inspect-existing-apt-sources", action="store_true")
    args = parser.parse_args()
    if args.inspect_existing_apt_sources:
        if args.apply_reviewed_manifest is not None:
            stop("inspection cannot be combined with installation")
        if os.name != "posix" or os.getuid() != 0 or sys.executable != PYTHON:
            stop("source inspection requires existing /usr/bin/python3 as root")
        require_supported_ubuntu()
        source_text, source_evidence, expected_suites = existing_ubuntu_sources()
        isolated_apt_configuration(source_text, controlled_download_env())
        print(json.dumps({"state": "EXISTING_SOURCE_PREFLIGHT_ONLY", "writes": False, "network": False,
                          "install": False, "browser_launched": False, "sources": source_evidence,
                          "scoped_source_sha256": hashlib.sha256(source_text.encode()).hexdigest(),
                          "expected_suites": sorted(expected_suites), "userland_architecture": "amd64",
                          "apt_configuration": "PRIVATE_ISOLATION_TEMPLATE_ONLY_NOT_APPLIED",
                          "signature_verification": "NOT_RUN"}))
        return
    if args.apply_reviewed_manifest is None:
        print(json.dumps({"state": "PREPARED_NOT_APPLIED", "environment_id": ENVIRONMENT,
                          "python_packages": PACKAGES, "cache": str(ROOT),
                          "apt_package_names": sorted(APT_NAMES),
                          "chromium": "156.0.8078.4", "revision": "1248",
                          "needs": ["explicit component/download/setup approval", "saved provider policy/cache evidence",
                                    "existing UID1000", "Ubuntu24.04 x86_64", "approved bounded official APT package list"],
                          "launch": False, "network_changes": False}))
        return
    if os.name != "posix" or os.getuid() != 0 or sys.executable != PYTHON:
        stop("approved setup must use existing /usr/bin/python3 as root; browser still UID1000 only")
    manifest_bytes = args.apply_reviewed_manifest.read_bytes()
    manifest = json.loads(manifest_bytes)
    if manifest.get("schema") != 1 or manifest.get("environment_id") != ENVIRONMENT:
        stop("wrong or unsupported review manifest")
    if (manifest.get("state") != "APPROVED_FOR_SETUP_ONLY"
            or not manifest.get("human_approval_reference")
            or manifest.get("downloads_and_install_approved") is not True):
        stop("new installation approval missing; r2 navigation approval does not cover it")
    historical_refs = {
        "user:01a13cc1-12e9-79a0-97e8-4899f05a5c95:R4-20261014",
        "user:01a13cc1-12e9-79a0-97e8-4899f05a5c95:setup-R4-autonomia-20261014",
    }
    for key in ("human_approval_reference", "operation_authorization_reference"):
        ref = manifest.get(key)
        if (not isinstance(ref, str) or not ref.startswith("user:") or len(ref) > 256
                or ref in historical_refs or "PENDING" in ref or "PLANNED" in ref):
            stop("specific new setup-only human approval reference missing")
    recipe_sha = hashlib.sha256(Path(__file__).read_bytes()).hexdigest()
    if (manifest.get("recipe_sha256") != recipe_sha
            or manifest.get("operation_id") != SETUP_TRIAL_OPERATION
            or manifest.get("parent_operation_id") != PARENT_R4_OPERATION
            or manifest.get("operation_scope") != "SETUP_ONLY_SNAPSHOT_TRIAL"
            or not isinstance(manifest.get("operation_authorization_reference"), str)
            or not manifest["operation_authorization_reference"].startswith("user:")
            or manifest["operation_authorization_reference"] == "user:20261014-call_8e68f4ea274f44519647395ec9a62425-arreglo-prueba-unica"
            or "PENDING" in manifest["operation_authorization_reference"]):
        stop("fresh exact operation/recipe admission missing")
    setup_started_at_utc = datetime.now(timezone.utc).isoformat()
    provider = manifest.get("provider_saved_configuration", {})
    if (provider.get("surface") != "codex-cloud-legacy-ui" or not provider.get("evidence_reference")
            or not provider.get("saved_at_utc") or provider.get("cache_enabled") is not True
            or provider.get("network_access") != "limited" or provider.get("preset") != "None"
            or set(provider.get("domains", [])) != {"example.com", "iana.org", "www.iana.org"}
            or set(provider.get("methods", [])) != {"GET", "HEAD", "OPTIONS"}):
        stop("provider saved policy/cache proof absent or unsupported; no fake /etc policy")
    require_supported_ubuntu()
    try:
        account = pwd.getpwuid(1000)
    except KeyError:
        stop("no existing UID1000; no account creation authorized")
    runuser = shutil.which("runuser")
    unshare = shutil.which("unshare")
    if not runuser or not unshare or not importlib.util.find_spec("ensurepip"):
        stop("existing runuser/unshare/system Python venv unavailable")
    command([runuser, "-u", account.pw_name, "--", PYTHON, "-c",
             "import os; assert os.getuid()==1000"], timeout=10)
    command([runuser, "-u", account.pw_name, "--", unshare, "--user", "--map-root-user", "true"], timeout=10)
    if set(manifest.get("apt_package_names_approved", [])) != APT_NAMES:
        stop("bounded official Ubuntu package list approval missing")
    if ROOT.exists() or ROOT.is_symlink():
        stop("cache collision: verify previous state; do not overwrite/reinstall")
    download_env = controlled_download_env()
    source_text, source_evidence, expected_suites = existing_ubuntu_sources()
    apt_configuration = isolated_apt_configuration(source_text, download_env)
    # Every gate above precedes writes/downloads. Cache is root-owned, UID1000-readable.
    os.umask(0o022)
    ROOT.mkdir(mode=0o755)
    apt_lists = ROOT / "apt-lists"
    (apt_lists / "partial").mkdir(parents=True, mode=0o755)
    ubuntu_source = ROOT / "apt-existing.sources"
    ubuntu_source.write_text(source_text)
    (ROOT / "apt-empty").mkdir(mode=0o755)
    apt_options = ["-o", "Dir::Etc::sourcelist=" + str(ubuntu_source), "-o", "Dir::Etc::sourceparts=-",
                   "-o", "Dir::State::lists=" + str(apt_lists), "-o", "Dir::Cache::pkgcache=",
                   "-o", "Dir::Cache::srcpkgcache=", "-o", "Acquire::AllowInsecureRepositories=false",
                   "-o", "Acquire::AllowDowngradeToInsecureRepositories=false",
                   "-o", "APT::Get::AllowUnauthenticated=false", "-o", "Acquire::Check-Date=true",
                   "-o", "Acquire::Check-Valid-Until=true", "-o", "Acquire::https::Verify-Peer=true",
                   "-o", "Acquire::https::Verify-Host=true", "-o", "Acquire::http::AllowRedirect=false",
                   "-o", "Acquire::https::AllowRedirect=false"]
    # Existing proxy credentials, if any, are ephemeral: private outside cache and cleaned on every exit.
    with tempfile.TemporaryDirectory(prefix="onia-apt-config-") as private_apt_config:
        apt_config = Path(private_apt_config) / "apt.conf"
        descriptor = os.open(apt_config, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
        with os.fdopen(descriptor, "w") as stream:
            stream.write(apt_configuration)
        apt_configuration = None
        apt_env = dict(download_env, APT_CONFIG=str(apt_config))
        # Only a scoped representation of existing approved entries; global sources/config unchanged.
        PHASE = "apt_authenticated_update"
        command(["/usr/bin/apt-get", *apt_options, "update"], env=apt_env)
        PHASE = "apt_release_metadata_validation"
        verify_ubuntu_releases(apt_lists, expected_suites)
        PHASE = "apt_candidate_resolution"
        apt = resolve_apt_candidates(apt_options, apt_env)
        apt_bytes = (json.dumps(apt, sort_keys=True, separators=(",", ":")) + "\n").encode()
        (ROOT / "apt-resolved-versions.json").write_bytes(apt_bytes)
        apt_sha = hashlib.sha256(apt_bytes).hexdigest()
        apt_selection = [name + "=" + apt[name] for name in sorted(APT_NAMES)]
        PHASE = "apt_install_exact_resolved_versions"
        command(["/usr/bin/apt-get", *apt_options, "install", "-y", "--no-install-recommends", *apt_selection], env=apt_env)
    PHASE = "python_venv_and_wheels"
    command([PYTHON, "-m", "venv", "--copies", str(ROOT / "venv")])
    vpython = str(ROOT / "venv/bin/python")
    # Raw pip report stays private/ephemeral; persist only validated public fields.
    with tempfile.TemporaryDirectory(prefix="onia-pip-report-") as private_report:
        report_path = Path(private_report) / "report.json"
        command([vpython, "-m", "pip", "install", "--only-binary=:all:", "--no-cache-dir",
                 "--index-url", "https://pypi.org/simple", "--report", str(report_path), *PACKAGES], env=download_env)
        report = json.loads(report_path.read_text())
        safe_installs = []
        allowed_wheels = {"playwright": "1.64.0", "greenlet": "3.5.6", "pyee": "13.0.1", "typing_extensions": "4.16.0"}
        for item in report.get("install", []):
            url = item["download_info"]["url"]
            name = item["metadata"]["name"].lower().replace("-", "_")
            version = item["metadata"]["version"]
            if (not public_url(url, {"pypi.org", "files.pythonhosted.org"})
                    or allowed_wheels.get(name) != version or not url.endswith(".whl")):
                stop("unexpected pip origin/component; raw report not persisted")
            safe_installs.append({"name": name, "version": version, "url": url,
                                  "sha256": item["download_info"]["archive_info"]["hashes"]["sha256"]})
        if {i["name"] for i in safe_installs} != set(allowed_wheels):
            stop("missing expected wheel receipts")
        (ROOT / "pip-install-report.json").write_text(json.dumps(safe_installs, sort_keys=True) + "\n")
    child_env = download_env
    child_env["PLAYWRIGHT_BROWSERS_PATH"] = str(ROOT / "browsers")
    PHASE = "chromium_install_metadata_only"
    command([vpython, "-m", "playwright", "install", "--no-shell", "chromium"], env=child_env)
    installed = subprocess.run(["dpkg-query", "-W", "-f=${Package}=${Version}\n", *sorted(APT_NAMES)],
                               capture_output=True, text=True, timeout=15, check=True)
    (ROOT / "apt-installed-versions.txt").write_text(installed.stdout)
    binaries = {}
    for executable in sorted((ROOT / "browsers").glob("chromium-*/chrome-linux64/chrome")):
        if executable.is_symlink() or not executable.is_file():
            stop("browser executable is not a regular file")
        digest = hashlib.sha256()
        with executable.open("rb") as stream:
            for chunk in iter(lambda: stream.read(1024 * 1024), b""):
                digest.update(chunk)
        binaries[str(executable)] = digest.hexdigest()
    if len(binaries) != 1:
        stop("expected exactly one full Chromium executable in the fresh cache")
    (ROOT / "browser-executable-hashes.json").write_text(json.dumps(binaries, sort_keys=True) + "\n")
    # Starting Playwright's metadata API spawns its driver, never Chromium.
    command([runuser, "-u", account.pw_name, "--", vpython, "-c",
             "import os,json,importlib.metadata,playwright; from pathlib import Path; from playwright.sync_api import sync_playwright; "
             "assert os.getuid()==1000; "
             "assert importlib.metadata.version('playwright')=='1.64.0'; "
             "m=json.loads((Path(playwright.__file__).parent/'driver/package/browsers.json').read_text()); "
             "c=next(b for b in m['browsers'] if b['name']=='chromium'); "
             "assert c['revision']=='1248' and c['browserVersion']=='156.0.8078.4'; "
             "p=sync_playwright().start(); e=Path(p.chromium.executable_path); "
             "assert e.is_file() and os.access(e,os.R_OK|os.X_OK) and not os.access(e,os.W_OK); p.stop()"],
            env=child_env, timeout=15)
    # Own writable execution directories must be created by UID1000 at task time,
    # with mkdtemp 0700 under /tmp; no profile/cookie copying or persisted HOME override.
    setup_receipt = {"state": "INSTALLED_METADATA_ONLY", "browser_launched": False,
                      "schema": 1, "environment_id": ENVIRONMENT, "operation_id": manifest["operation_id"],
                      "parent_operation_id": PARENT_R4_OPERATION,
                      "operation_scope": "SETUP_ONLY_SNAPSHOT_TRIAL",
                      "setup_manifest_sha256": hashlib.sha256(manifest_bytes).hexdigest(),
                      "operation_authorization_reference": manifest["operation_authorization_reference"],
                      "recipe_sha256": recipe_sha, "started_at_utc": setup_started_at_utc,
                      "finished_at_utc": datetime.now(timezone.utc).isoformat(),
                      "receipt_provenance": "pinned_installer_actual_success_after_component_validation",
                      "python": vpython, "PLAYWRIGHT_BROWSERS_PATH": child_env["PLAYWRIGHT_BROWSERS_PATH"],
                      "browser_uid_required": 1000, "provider_policy_enforcement": "UNKNOWN",
                      "apt_resolved_versions_sha256": apt_sha,
                      "apt_existing_source_evidence": source_evidence,
                      "apt_scoped_source_sha256": hashlib.sha256(source_text.encode()).hexdigest(),
                      "browser_executable_sha256": binaries,
                      "renderer_sandbox": "UNKNOWN", "cache_resume_readiness": "UNKNOWN",
                      "next": "separately admitted single browser operation"}
    record = ROOT / "setup-receipt.json"
    descriptor = os.open(record, os.O_WRONLY | os.O_CREAT | os.O_EXCL | os.O_NOFOLLOW, 0o444)
    with os.fdopen(descriptor, "w") as stream:
        stream.write(json.dumps(setup_receipt, sort_keys=True) + "\n")
        stream.flush()
        os.fsync(stream.fileno())
    print(json.dumps(setup_receipt))


if __name__ == "__main__":
    main()
