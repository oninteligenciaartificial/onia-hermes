#!/usr/bin/env python3
"""Frozen R3: installed full Chromium, local sandbox proof, one public JPEG."""
import argparse
import base64
import hashlib
import html
import importlib.metadata
import json
import os
from pathlib import Path
import re
import shutil
import stat
import subprocess
import sys
import tempfile
from datetime import datetime, timezone
from urllib.parse import urljoin, urlparse

ALLOWED_HOSTS = frozenset(("example.com", "iana.org", "www.iana.org"))
ALLOWED_METHODS = frozenset(("GET", "HEAD", "OPTIONS"))
CACHE = Path("/opt/onia-public-browser-1.64.0/browsers")
CONFIG_RECEIPT_SHA = "8b75fbe34fb0ea88c06cba760213899088eaaa71954eba7cb8e4d30e7ca6ae32"
ENVIRONMENT = "6abad782eba0819196ca234dc3abc327"
PYTHON = "/opt/onia-public-browser-1.64.0/venv/bin/python"
AUTHORIZATION = "user:20261014-call_8e68f4ea274f44519647395ec9a62425-arreglo-prueba-unica"


def utc():
    return datetime.now(timezone.utc).isoformat()


def allowed_url(url):
    try:
        u = urlparse(url)
        return (u.scheme == "https" and u.hostname in ALLOWED_HOSTS and u.port in (None, 443)
                and not u.username and not u.password)
    except ValueError:
        return False


def final_url_ok(url):
    u = urlparse(url)
    return allowed_url(url) and u.hostname in {"iana.org", "www.iana.org"} and u.path.rstrip("/") == "/help/example-domains"


def public_request_summary(url):
    try:
        u = urlparse(url)
        return {"host": u.hostname or "", "path": u.path[:160]}
    except ValueError:
        return {"host": "INVALID", "path": ""}


def write_once(path, value):
    fd = os.open(path, os.O_WRONLY | os.O_CREAT | os.O_EXCL | os.O_NOFOLLOW, 0o600)
    with os.fdopen(fd, "w") as stream:
        stream.write(json.dumps(value, sort_keys=True, indent=2) + "\n")
        stream.flush()
        os.fsync(stream.fileno())


def lineage(c):
    return {"operation_id": c["operation_id"], "input_sha": c["input_sha"], "agent_id": "UNKNOWN", "served_model": "UNKNOWN",
            "repository": {"name": c["repository"], "requested_ref": c["requested_ref"],
                           "expected_head": c["expected_head"],
                           "observed_head": c["checkout_head_observed_before_uid_switch"],
                           "observed_head_provenance": "parent_task_observation_before_UID_switch"}}


def not_produced(out, c, reason):
    identity = lineage(c)
    for name, state in (("execution-receipt.json", "NOT_STARTED"),
                        ("supervisor-receipt.json", "NOT_STARTED"),
                        ("screenshot-artifact.json", "NOT_PRODUCED")):
        if not (out / name).exists():
            write_once(out / name, dict(identity, status=state, reason=reason,
                       browser_launches=0, browser_nonce_consumed=False,
                       image_produced=False, base64=None, served_model="UNKNOWN", at_utc=utc()))


def validate_inputs(args):
    source = Path(args.contract)
    meta = source.lstat()
    if not stat.S_ISREG(meta.st_mode) or meta.st_mode & 0o022:
        raise ValueError("contract must be protected regular file")
    raw = source.read_bytes()
    if hashlib.sha256(raw).hexdigest() != args.contract_sha256:
        raise ValueError("contract hash mismatch")
    c = json.loads(raw)
    if (c.get("schema") != 1 or c.get("repository") != "onia-hermes"
            or c.get("requested_ref") != "codex/orquestacion-subagentes-20261013"
            or c.get("environment_id") != ENVIRONMENT or c.get("operation_generation") != "R3"
            or not c.get("operation_nonce") or not c.get("submission_reference")
            or c.get("authorization_reference") != AUTHORIZATION
            or c.get("legacy_provider_configuration_accepted") is not True
            or c.get("configuration_receipt_sha256") != CONFIG_RECEIPT_SHA):
        raise ValueError("contract admission missing")
    nonce = c["operation_nonce"]
    if not isinstance(nonce, str) or len(nonce) > 256 or "one-r1" in nonce or "one-r2" in nonce:
        raise ValueError("fresh parent R3 nonce required")
    if not re.fullmatch(r"[0-9a-f]{40}", c.get("expected_head", "")):
        raise ValueError("literal checkout SHA required")
    if (not isinstance(c.get("operation_id"), str) or not c["operation_id"] or len(c["operation_id"]) > 256
            or not re.fullmatch(r"[0-9a-f]{64}", c.get("input_sha", ""))):
        raise ValueError("literal operation/input admission required")
    # Parent task checks Git HEAD before switching UID; no ownership-trust bypass
    # for UID1000 reading a root-owned checkout. Source hashes remain checked here.
    if c.get("checkout_head_observed_before_uid_switch") != c["expected_head"]:
        raise ValueError("external checkout binding mismatch")
    output = Path(args.output_dir)
    output_meta = output.lstat()
    if (os.getuid() != 1000 or not stat.S_ISDIR(output_meta.st_mode)
            or output_meta.st_uid != 1000 or stat.S_IMODE(output_meta.st_mode) != 0o700
            or not str(output.resolve()).startswith("/workspace/")):
        raise ValueError("private task workspace UID1000 output required")
    provider = json.loads(os.environ.get("ONIA_BROWSER_PROVIDER_SAVED_CONFIGURATION_JSON", "null"))
    if (not isinstance(provider, dict) or provider.get("surface") != "codex-cloud-legacy-ui"
            or provider.get("saved_at_utc") != "2026-10-14T18:05:55.372Z"
            or not provider.get("evidence_reference") or provider.get("preset") != "None"
            or provider.get("network_access") != "limited" or provider.get("cache_enabled") is not True
            or set(provider.get("domains", [])) != ALLOWED_HOSTS
            or set(provider.get("methods", [])) != ALLOWED_METHODS):
        raise ValueError("saved provider configuration guard mismatch")
    # Optional supported current policy may deny/contradict, never fabricated here.
    if c.get("supported_runtime_policy_contradiction") is not False:
        raise ValueError("parent policy contradiction review required")
    return c, output


def preflight(args):
    c, out = validate_inputs(args)
    if sys.executable != PYTHON or importlib.metadata.version("playwright") != "1.64.0":
        raise ValueError("pinned installed Python/Playwright required")
    import playwright
    m = json.loads((Path(playwright.__file__).parent / "driver/package/browsers.json").read_text())
    browser = next(b for b in m["browsers"] if b["name"] == "chromium")
    if browser["revision"] != "1248" or browser["browserVersion"] != "156.0.8078.4":
        raise ValueError("pinned browser metadata mismatch")
    executables = list(CACHE.glob("chromium-*/chrome-linux64/chrome"))
    if len(executables) != 1 or executables[0].is_symlink() or not executables[0].is_file():
        raise ValueError("installed full Chromium missing")
    exe = executables[0]
    if not os.access(exe, os.R_OK | os.X_OK) or os.access(exe, os.W_OK):
        raise ValueError("browser must be readable executable and not UID1000-writable")
    if any(name in os.environ for name in ("PLAYWRIGHT_DOWNLOAD_HOST", "PLAYWRIGHT_CHROMIUM_DOWNLOAD_HOST")):
        raise ValueError("unexpected download override")
    unshare = shutil.which("unshare")
    if not unshare or subprocess.run([unshare, "--user", "--map-root-user", "true"],
                                    stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=5).returncode:
        raise ValueError("UID1000 namespace diagnostic failed")
    if os.environ.get("PLAYWRIGHT_BROWSERS_PATH") != str(CACHE):
        raise ValueError("pinned cache selector missing")
    for name in ("execution-receipt.json", "supervisor-receipt.json", "screenshot-artifact.json", "iana-example-domains.jpg", ".browser-cloud-attempt.claim"):
        if (out / name).exists() or (out / name).is_symlink():
            raise ValueError("output/claim collision")
    return c, out, exe


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--contract", required=True)
    parser.add_argument("--contract-sha256", required=True)
    parser.add_argument("--output-dir", required=True)
    parser.add_argument("--preflight", action="store_true")
    parser.add_argument("--claim")
    args = parser.parse_args()
    if args.preflight:
        try:
            c, out, exe = preflight(args)
            write_once(out / "preflight.json", dict(lineage(c), **{"status": "PASS_METADATA", "uid": 1000, "at_utc": utc(),
                "configuration_receipt_sha256": CONFIG_RECEIPT_SHA, "environment_id_provenance": "parent_external_binding",
                "environment_id_observed_inside_child": "UNKNOWN", "task_id_observed_inside_child": "UNKNOWN",
                "checkout_head_provenance": "parent_task_observation_before_UID_switch",
                "runtime_policy_enforcement_independently_measured": "UNKNOWN", "managed_policy_file_surface": "UNSUPPORTED_OR_NOT_INSPECTED",
                "uid1000_unshare": "PASS", "renderer_sandbox": "NOT_YET_PROBED", "browser_launches": 0,
                "browser_nonce_consumed": False, "executable": str(exe), "contract_sha256": args.contract_sha256}))
            return 0
        except Exception as error:
            try:
                c = json.loads(Path(args.contract).read_bytes())
                identity = lineage(c)
                write_once(Path(args.output_dir) / "preflight.json", dict(identity, status="BLOCKED", error_type=type(error).__name__,
                    browser_launches=0, browser_nonce_consumed=False, at_utc=utc()))
                not_produced(Path(args.output_dir), c, "preflight_blocked")
            except Exception:
                pass
            return 2
    c, out = validate_inputs(args)
    claim_path = Path(args.claim or "")
    if claim_path != out / ".browser-cloud-attempt.claim":
        raise ValueError("claim path mismatch")
    claim_meta = claim_path.lstat()
    claim = json.loads(claim_path.read_text())
    if (not stat.S_ISREG(claim_meta.st_mode) or claim_meta.st_uid != 1000 or stat.S_IMODE(claim_meta.st_mode) != 0o600
            or claim.get("state") != "running" or claim.get("contract_sha256") != args.contract_sha256
            or claim.get("source_sha256") != hashlib.sha256(Path(__file__).read_bytes()).hexdigest()
            or claim.get("operation_nonce") != c["operation_nonce"]):
        raise ValueError("claim binding mismatch")
    receipt = dict(lineage(c), **{"status": "FAIL", "started_at_utc": utc(), "uid": 1000, "retries": 0, "browser_launches": 0,
               "operation_nonce": c["operation_nonce"], "contract_sha256": args.contract_sha256,
               "blocked_requests": [], "redirects": [], "blocked_websockets": 0,
               "runtime_policy_enforcement_independently_measured": "UNKNOWN", "served_model": "UNKNOWN"})
    try:
        from playwright.sync_api import sync_playwright
        # Own writable HOME/XDG/TMP only; inherited proxy and CA unchanged.
        for key in ("HOME", "XDG_CONFIG_HOME", "XDG_CACHE_HOME", "XDG_RUNTIME_DIR", "TMPDIR"):
            os.environ[key] = tempfile.mkdtemp(prefix=key.lower() + "-", dir=out)
        os.environ["PLAYWRIGHT_BROWSERS_PATH"] = str(CACHE)
        with sync_playwright() as pw:
            receipt["browser_launches"] = 1
            browser = pw.chromium.launch(channel="chromium", headless=True, chromium_sandbox=True,
                timeout=15000, args=["--disable-background-networking", "--disable-component-update", "--disable-sync"])
            probe_context = browser.new_context()
            probe = probe_context.new_page()
            probe.goto("chrome://sandbox", timeout=10000)
            sandbox = probe.locator("body").inner_text(timeout=5000)
            receipt["sandbox_status_text"] = sandbox[:3000]
            if not (re.search(r"Namespace sandbox\s+Yes", sandbox, re.I)
                    and re.search(r"PID namespaces\s+Yes", sandbox, re.I)
                    and re.search(r"Seccomp-BPF sandbox\s+Yes", sandbox, re.I)):
                raise AssertionError("local renderer sandbox proof missing")
            receipt["renderer_sandbox"] = "PASS_LOCAL_STATUS"
            probe_context.close()
            context = browser.new_context(viewport={"width": 1280, "height": 720}, device_scale_factor=1, service_workers="block")
            def route_request(route):
                req = route.request
                if not allowed_url(req.url) or req.method not in ALLOWED_METHODS:
                    receipt["blocked_requests"].append(public_request_summary(req.url))
                    route.abort("blockedbyclient")
                    return
                response = route.fetch(max_redirects=0, max_retries=0, timeout=15000)
                if 300 <= response.status < 400:
                    target = urljoin(req.url, response.headers.get("location", ""))
                    if (not response.headers.get("location") or not allowed_url(target)
                            or len(receipt["redirects"]) >= 5 or not req.is_navigation_request()):
                        receipt["blocked_requests"].append(public_request_summary(target))
                        route.abort("blockedbyclient")
                        return
                    receipt["redirects"].append({"from": public_request_summary(req.url), "to": public_request_summary(target), "status": response.status})
                    body = '<!doctype html><meta http-equiv="refresh" content="0;url=' + html.escape(target, quote=True) + '">'
                    route.fulfill(status=200, content_type="text/html", body=body)
                    return
                route.fulfill(response=response)
            context.route("**/*", route_request)
            def block_ws(ws):
                receipt["blocked_websockets"] += 1
                ws.close(code=1008, reason="public browser contract")
            context.route_web_socket("**/*", block_ws)
            page = context.new_page()
            page.goto("https://example.com/", wait_until="domcontentloaded", timeout=15000)
            if (page.title() != "Example Domain" or not allowed_url(page.url)
                    or urlparse(page.url).hostname != "example.com" or urlparse(page.url).path not in {"", "/"}):
                raise AssertionError("unexpected Example Domain page")
            page.get_by_role("heading", name="Example Domain", exact=True).wait_for(state="visible", timeout=5000)
            link = page.locator('a[href="https://iana.org/domains/example"],a[href="https://www.iana.org/domains/example"],a[href="https://iana.org/help/example-domains"],a[href="https://www.iana.org/help/example-domains"]')
            if link.count() != 1:
                raise AssertionError("expected single IANA information link")
            link.click(timeout=10000)
            page.wait_for_url(lambda u: final_url_ok(u.geturl()), wait_until="domcontentloaded", timeout=15000)
            receipt.update(final_url=page.url, final_title=page.title())
            if not final_url_ok(page.url) or page.title() != "IANA — Example Domains":
                raise AssertionError("unexpected IANA page")
            page.get_by_role("heading", name="Example Domains", exact=True).wait_for(state="visible", timeout=5000)
            image_path = out / "iana-example-domains.jpg"
            fd = os.open(image_path, os.O_CREAT | os.O_EXCL | os.O_NOFOLLOW | os.O_WRONLY, 0o600)
            os.close(fd)
            page.screenshot(path=str(image_path), type="jpeg", quality=50, full_page=False, timeout=10000)
            jpeg = image_path.read_bytes()
            if len(jpeg) > 90 * 1024 or not jpeg.startswith(b"\xff\xd8") or not jpeg.endswith(b"\xff\xd9"):
                raise ValueError("single JPEG exceeds bounded transport or invalid signature")
            encoded = base64.b64encode(jpeg).decode("ascii")
            if len(encoded) > 120 * 1024:
                raise ValueError("encoded screenshot transport bound exceeded")
            image = {"filename": image_path.name, "format": "JPEG", "bytes": len(jpeg), "width": 1280,
                     "height": 720, "quality": 50, "sha256": hashlib.sha256(jpeg).hexdigest(),
                     "utc": utc(), "final_url": page.url, "final_title": page.title(),
                     "source": "one actual final-page screenshot, no recompression", "operation_nonce": c["operation_nonce"]}
            write_once(out / "screenshot-artifact.json", dict(lineage(c), **image, status="PRODUCED", image_produced=True, base64=encoded))
            receipt["screenshot"] = image
            context.close()
            browser.close()
        if receipt["blocked_requests"] or receipt["blocked_websockets"]:
            raise AssertionError("unexpected request or WebSocket")
        receipt["status"] = "PASS"
    except Exception as error:
        # Raw diagnostics/URLs/profile/process args never leave the process.
        receipt["error_type"] = type(error).__name__
    finally:
        receipt["finished_at_utc"] = utc()
        write_once(out / "execution-receipt.json", receipt)
    return 0 if receipt["status"] == "PASS" else 1


if __name__ == "__main__":
    raise SystemExit(main())
