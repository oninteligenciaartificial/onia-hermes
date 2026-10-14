#!/usr/bin/env bash
# PROPOSED exact legacy setup payload; never execute before direct approval.
set -eu
if [ -z "${ONIA_BROWSER_SETUP_APPROVAL_REFERENCE:-}" ]; then
  printf '%s\n' 'PENDING_APPROVAL: no setup, downloads or browser action executed'
  exit 0
fi
# Nonsecret guards do not create authorization; parent must bind human approval
# externally to this payload hash plus recipe and pending-manifest hashes.
if [ "${ONIA_BROWSER_SETUP_APPROVED_RECIPE_SHA256:-}" != "a041af91f0e51209490ecd80b5a10e2d7a78d5e668e29139f6de09135c387322" ] ||
   [ "${ONIA_BROWSER_SETUP_APPROVED_PENDING_MANIFEST_SHA256:-}" != "705ffb88b7569ff50cfb4ff21aaca7f8bf59d292817776b92f6560ec838ef022" ] ||
   [ -z "${ONIA_BROWSER_PROVIDER_SAVED_CONFIGURATION_JSON:-}" ]; then
  printf '%s\n' 'BLOCKED: reviewed binding or saved legacy configuration evidence missing'
  exit 2
fi
ONIA_BROWSER_SETUP_TMP="$(mktemp -d /tmp/onia-browser-setup.XXXXXXXX)"
export ONIA_BROWSER_SETUP_TMP
cat > "$ONIA_BROWSER_SETUP_TMP/recipe.py" <<'ONIA_REVIEWED_RECIPE'
#!/usr/bin/env python3
"""PROPOSED, NOT EXECUTED. Install-only legacy setup after reviewed manifest/approval.
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
import subprocess
import sys
import tempfile
from urllib.parse import urlparse

ENVIRONMENT = "6abad782eba0819196ca234dc3abc327"
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


def stop(reason):
    raise SystemExit("BLOCKED: " + reason)


def command(argv, *, env=None, timeout=600):
    # Never shell/eval; inherit proxy/CA environment, do not dump output or secrets.
    result = subprocess.run(argv, env=env, stdout=subprocess.DEVNULL,
                            stderr=subprocess.DEVNULL, timeout=timeout, check=False)
    if result.returncode:
        stop("command failed; installation may be partial; reconcile without automatic retry")


def public_url(value, hosts):
    url = urlparse(value)
    return (url.scheme == "https" and url.hostname in hosts and url.port in (None, 443)
            and not url.username and not url.password and not url.query and not url.fragment)


def ubuntu_uri(value):
    url = urlparse(value)
    host = url.hostname or ""
    return (url.scheme in {"http", "https"} and (host == "archive.ubuntu.com"
            or host.endswith(".archive.ubuntu.com") or host == "security.ubuntu.com")
            and url.port in (None, 80, 443) and not url.username and not url.password
            and not url.query and not url.fragment)


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


def existing_ubuntu_source():
    source = Path("/etc/apt/sources.list.d/ubuntu.sources")
    if source.is_symlink() or not source.is_file():
        stop("supported existing Ubuntu deb822 source missing; no new repository")
    metadata = source.stat()
    if metadata.st_uid != 0 or metadata.st_mode & 0o022:
        stop("Ubuntu source is not root-owned and protected from other-user writes")
    for section in re.split(r"\n\s*\n", source.read_text().strip()):
        fields = {}
        for line in section.splitlines():
            if not line or line.startswith("#"):
                continue
            if line[0].isspace() or ":" not in line:
                stop("unsupported Ubuntu source format")
            key, value = line.split(":", 1)
            if key in fields:
                stop("ambiguous Ubuntu source fields")
            fields[key] = value.strip()
        if fields.get("Enabled", "yes") == "no":
            continue
        if (set(fields) - {"Types", "URIs", "Suites", "Components", "Signed-By", "Architectures", "Enabled"}
                or fields.get("Types") != "deb" or not fields.get("URIs")
                or not all(ubuntu_uri(u) for u in fields["URIs"].split())
                or not set(fields.get("Suites", "").split()) <= {"noble", "noble-updates", "noble-security", "noble-backports"}
                or not fields.get("Suites") or fields.get("Signed-By") != "/usr/share/keyrings/ubuntu-archive-keyring.gpg"):
            stop("unsupported/nonofficial Ubuntu source or trust configuration")
    return source


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply-reviewed-manifest", type=Path)
    args = parser.parse_args()
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
    manifest = json.loads(args.apply_reviewed_manifest.read_text())
    if manifest.get("schema") != 1 or manifest.get("environment_id") != ENVIRONMENT:
        stop("wrong or unsupported review manifest")
    if not manifest.get("human_approval_reference") or manifest.get("downloads_and_install_approved") is not True:
        stop("new installation approval missing; r2 navigation approval does not cover it")
    provider = manifest.get("provider_saved_configuration", {})
    if (provider.get("surface") != "codex-cloud-legacy-ui" or not provider.get("evidence_reference")
            or not provider.get("saved_at_utc") or provider.get("cache_enabled") is not True
            or provider.get("network_access") != "limited" or provider.get("preset") != "None"
            or set(provider.get("domains", [])) != {"example.com", "iana.org", "www.iana.org"}
            or set(provider.get("methods", [])) != {"GET", "HEAD", "OPTIONS"}):
        stop("provider saved policy/cache proof absent or unsupported; no fake /etc policy")
    os_release = Path("/etc/os-release").read_text()
    if 'ID=ubuntu' not in os_release or 'VERSION_ID="24.04"' not in os_release or os.uname().machine != "x86_64":
        stop("recipe supports observed Ubuntu24.04 x86_64 only")
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
    ubuntu_source = existing_ubuntu_source()
    # Every gate above precedes writes/downloads. Cache is root-owned, UID1000-readable.
    os.umask(0o022)
    ROOT.mkdir(mode=0o755)
    apt_lists = ROOT / "apt-lists"
    (apt_lists / "partial").mkdir(parents=True, mode=0o755)
    apt_options = ["-o", "Dir::Etc::sourcelist=" + str(ubuntu_source), "-o", "Dir::Etc::sourceparts=-",
                   "-o", "Dir::State::lists=" + str(apt_lists), "-o", "Dir::Cache::pkgcache=",
                   "-o", "Dir::Cache::srcpkgcache="]
    # Scope to existing official source, with fresh lists; global sources/config unchanged.
    command(["apt-get", *apt_options, "update"], env=download_env)
    releases = list(apt_lists.glob("*_InRelease"))
    if not releases or any("Origin: Ubuntu\n" not in release.read_text() for release in releases):
        stop("authenticated Release Origin is not Ubuntu")
    apt = {}
    for name in sorted(APT_NAMES):
        result = subprocess.run(["apt-cache", *apt_options, "policy", name], capture_output=True,
                                text=True, env=download_env, timeout=10, check=True)
        candidates = [line.strip().split(": ", 1)[1] for line in result.stdout.splitlines()
                      if line.strip().startswith("Candidate: ")]
        if len(candidates) != 1 or candidates[0] == "(none)":
            stop("approved Ubuntu dependency has no candidate; do not add repositories or substitute")
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
            stop("candidate origin URI is missing or not official Ubuntu")
        apt[name] = candidates[0]
    apt_bytes = (json.dumps(apt, sort_keys=True, separators=(",", ":")) + "\n").encode()
    (ROOT / "apt-resolved-versions.json").write_bytes(apt_bytes)
    apt_sha = hashlib.sha256(apt_bytes).hexdigest()
    apt_selection = [name + "=" + apt[name] for name in sorted(APT_NAMES)]
    command(["apt-get", *apt_options, "install", "-y", "--no-install-recommends", *apt_selection], env=download_env)
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
    print(json.dumps({"state": "INSTALLED_METADATA_ONLY", "browser_launched": False,
                      "python": vpython, "PLAYWRIGHT_BROWSERS_PATH": child_env["PLAYWRIGHT_BROWSERS_PATH"],
                      "browser_uid_required": 1000, "provider_policy_enforcement": "UNKNOWN",
                      "apt_resolved_versions_sha256": apt_sha,
                      "browser_executable_sha256": binaries,
                      "renderer_sandbox": "UNKNOWN", "cache_resume_readiness": "UNKNOWN",
                      "next": "read-only maintenance verification then separately gated single browser operation"}))


if __name__ == "__main__":
    main()
ONIA_REVIEWED_RECIPE
cat > "$ONIA_BROWSER_SETUP_TMP/pending-manifest.json" <<'ONIA_PENDING_MANIFEST'
{
  "apt_package_names_approved": [
    "fonts-freefont-ttf",
    "fonts-ipafont-gothic",
    "fonts-liberation",
    "fonts-noto-color-emoji",
    "fonts-tlwg-loma-otf",
    "fonts-unifont",
    "fonts-wqy-zenhei",
    "libasound2t64",
    "libatk-bridge2.0-0t64",
    "libatk1.0-0t64",
    "libatspi2.0-0t64",
    "libcairo2",
    "libcups2t64",
    "libdbus-1-3",
    "libdrm2",
    "libfontconfig1",
    "libfreetype6",
    "libgbm1",
    "libglib2.0-0t64",
    "libnspr4",
    "libnss3",
    "libpango-1.0-0",
    "libx11-6",
    "libxcb1",
    "libxcomposite1",
    "libxdamage1",
    "libxext6",
    "libxfixes3",
    "libxkbcommon0",
    "libxrandr2",
    "xfonts-cyrillic",
    "xfonts-scalable",
    "xvfb"
  ],
  "browser": {
    "headless_shell": false,
    "name": "chromium",
    "possible_support_utility": "ffmpeg1013",
    "revision": "1248",
    "version": "156.0.8078.4"
  },
  "browser_launch": false,
  "browser_uid_required": 1000,
  "cost_duration_storage": "UNKNOWN",
  "create_accounts": false,
  "downloads_and_install_approved": false,
  "environment_id": "6abad782eba0819196ca234dc3abc327",
  "human_approval_reference": null,
  "new_api_billing": false,
  "provider_saved_configuration": {
    "cache_enabled": true,
    "domains": [
      "example.com",
      "iana.org",
      "www.iana.org"
    ],
    "evidence_reference": null,
    "methods": [
      "GET",
      "HEAD",
      "OPTIONS"
    ],
    "network_access": "limited",
    "preset": "None",
    "saved_at_utc": null,
    "surface": "codex-cloud-legacy-ui"
  },
  "python_packages": [
    "playwright==1.64.0",
    "greenlet==3.5.6",
    "pyee==13.0.1",
    "typing-extensions==4.16.0"
  ],
  "recipe_sha256": "a041af91f0e51209490ecd80b5a10e2d7a78d5e668e29139f6de09135c387322",
  "sandbox_weakening": false,
  "schema": 1,
  "state": "PENDING_APPROVAL"
}
ONIA_PENDING_MANIFEST
/usr/bin/python3 - <<'ONIA_BIND_REVIEW'
import hashlib,json,os
from pathlib import Path
root=Path(os.environ['ONIA_BROWSER_SETUP_TMP'])
recipe=root/'recipe.py'
pending=root/'pending-manifest.json'
assert hashlib.sha256(recipe.read_bytes()).hexdigest()==os.environ['ONIA_BROWSER_SETUP_APPROVED_RECIPE_SHA256']
assert hashlib.sha256(pending.read_bytes()).hexdigest()==os.environ['ONIA_BROWSER_SETUP_APPROVED_PENDING_MANIFEST_SHA256']
m=json.loads(pending.read_text())
assert m['state']=='PENDING_APPROVAL' and m['downloads_and_install_approved'] is False
provider=json.loads(os.environ['ONIA_BROWSER_PROVIDER_SAVED_CONFIGURATION_JSON'])
expected=m['provider_saved_configuration']
assert set(provider)==set(expected)
assert all(provider[k]==expected[k] for k in expected if k not in {'evidence_reference','saved_at_utc'})
assert provider['evidence_reference'] and provider['saved_at_utc']
m.update(state='APPROVED_FOR_SETUP_ONLY',human_approval_reference=os.environ['ONIA_BROWSER_SETUP_APPROVAL_REFERENCE'],downloads_and_install_approved=True,provider_saved_configuration=provider)
(root/'applied-manifest.json').write_text(json.dumps(m,sort_keys=True)+'\n')
ONIA_BIND_REVIEW
# Existing setup, preserved exactly and in original order:
export NEXT_TELEMETRY_DISABLED=1
node --version
corepack enable
corepack prepare pnpm@10.33.3 --activate
cd web-factory
pnpm install --frozen-lockfile
# Approved bounded install-only addition; candidate enforces UID1000/platform gates.
/usr/bin/python3 "$ONIA_BROWSER_SETUP_TMP/recipe.py" --apply-reviewed-manifest "$ONIA_BROWSER_SETUP_TMP/applied-manifest.json"
# Private scratch kept for reconciliation; do not replay after partial installation.
