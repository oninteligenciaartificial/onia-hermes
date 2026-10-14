#!/usr/bin/env python3
"""Execute only after explicit approval of this Playwright/Chromium method."""
import hashlib
import html
import importlib.metadata
import json
import os
from pathlib import Path
import signal
import stat
import subprocess
import sys
from datetime import datetime, timezone
from urllib.parse import urlparse, urljoin

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent
TIMEOUT_MS = 20000
ALLOWED_HOSTS = frozenset(("example.com", "iana.org", "www.iana.org"))
SESSION_ID = os.environ.get("ONIA_BROWSER_SESSION_ID", "UNKNOWN")
V2_BASE_SHA256 = "0C5650791E83831D11445B26FC715A7A931016E20A7F3C3EC6E423DB550A8D6B"
BROWSER_ROOT = Path("/ms-playwright")


def allowed_url(url):
    try:
        u = urlparse(url)
        return (u.scheme == "https" and u.hostname in ALLOWED_HOSTS
                and u.port in (None, 443) and not u.username and not u.password)
    except ValueError:
        return False


def example_url_ok(url):
    return allowed_url(url) and urlparse(url).hostname == "example.com" and urlparse(url).path in ("", "/")


def final_url_ok(url):
    u = urlparse(url)
    return allowed_url(url) and u.hostname in ("iana.org", "www.iana.org") and u.path.rstrip("/") == "/help/example-domains"


def resolve_bundled_chromium(pw):
    root = BROWSER_ROOT.resolve(strict=True)
    candidate = Path(pw.chromium.executable_path)
    executable = candidate.resolve(strict=True)
    try:
        executable.relative_to(root)
    except ValueError as exc:
        raise RuntimeError("Playwright Chromium executable is outside /ms-playwright") from exc
    info = executable.stat()
    if not stat.S_ISREG(info.st_mode) or not os.access(executable, os.X_OK):
        raise RuntimeError("Playwright Chromium executable is not a runnable regular file")
    return executable


def route_request(route, receipt):
    # Never route.continue(): fetch exactly one allowlisted HTTPS response.
    # Native redirects are never fulfilled as 3xx (Playwright routing does not
    # reliably intercept subsequent native redirect requests).
    url = route.request.url
    if not allowed_url(url):
        receipt["blocked_requests"].append(url)
        route.abort("blockedbyclient")
        return
    response = route.fetch(max_redirects=0, max_retries=0, timeout=TIMEOUT_MS)
    if 300 <= response.status < 400:
        location = response.headers.get("location")
        target = urljoin(url, location) if location else ""
        if not allowed_url(target) or len(receipt["redirects"]) >= 5:
            receipt["blocked_requests"].append(target)
            route.abort("blockedbyclient")
            return
        receipt["redirects"].append({"from": url, "to": target, "status": response.status})
        if not route.request.is_navigation_request():
            route.abort("blockedbyclient")
            return
        # A controlled HTML refresh creates a NEW routed navigation, avoiding
        # a native redirect bypass. Target is checked before any target traffic.
        body = '<!doctype html><meta http-equiv="refresh" content="0;url=' + html.escape(target, quote=True) + '">'
        route.fulfill(status=200, content_type="text/html", body=body)
        return
    route.fulfill(response=response)



def utc():
    return datetime.now(timezone.utc).isoformat()


def deadline(_signum, _frame):
    raise TimeoutError("Nominal 75-second alarm fired; cleanup bound UNKNOWN")


def main():
    if sys.argv[1:] != ["--method-approved"]:
        print("BLOCKED: explicit method approval required; no browser started.", file=sys.stderr)
        return 2
    receipt = {
        "started_at_utc": utc(), "agent_id": "/root",
        "execution_host": "VPS", "session_id": SESSION_ID,
        "session_id_provenance": "explicit-runtime-value-or-UNKNOWN",
        "execution_turn_id": "UNKNOWN", "human_method_approval": "pending external gate",
        "blocked_requests": [], "redirects": [],
        "configured_model": "Sol Ligero (user-declared)",
        "served_model": "UNKNOWN", "U": "UNKNOWN", "W": "UNKNOWN",
        "source_sha256": hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
        "sourceSHA_kind": "script SHA-256; not a product Git commit",
        "uid": os.getuid(), "python": sys.version,
        "playwright": "validated before launch",
        "chromium_executable": "resolved from Playwright registry at runtime",
        "derived_from_sha256": V2_BASE_SHA256,
        "chromium_sandbox": True, "retries": 0,
        "nominal_alarm_seconds": 75, "cleanup_bound": "UNKNOWN", "method_state": "HOLD", "operation_timeout_ms": TIMEOUT_MS,
        "requested_url": "https://example.com", "status": "FAIL",
    }
    signal.signal(signal.SIGALRM, deadline)
    signal.alarm(75)
    try:
        if os.getuid() == 0:
            raise RuntimeError("BLOCKED: root UID is unsupported for this sandboxed method")
        with sync_playwright() as pw:
            installed_playwright = importlib.metadata.version("playwright")
            receipt["playwright"] = installed_playwright
            if installed_playwright != "1.62.0":
                raise RuntimeError("Playwright package version mismatch")
            executable = resolve_bundled_chromium(pw)
            receipt["chromium_executable"] = str(executable)
            version = subprocess.run([str(executable), "--version"],
                                     capture_output=True, text=True, timeout=5, check=True)
            receipt["chromium"] = version.stdout.strip()
            browser = pw.chromium.launch(
                executable_path=str(executable), headless=True,
                chromium_sandbox=True, timeout=TIMEOUT_MS,
            )
            receipt["browser_version"] = browser.version
            context = browser.new_context(viewport={"width": 1280, "height": 800}, service_workers="block")
            context.route("**/*", lambda route: route_request(route, receipt))
            context.route_web_socket("**/*", lambda websocket: websocket.close())
            page = context.new_page()
            page.set_default_timeout(TIMEOUT_MS)
            page.set_default_navigation_timeout(TIMEOUT_MS)
            page.goto(receipt["requested_url"], wait_until="domcontentloaded")
            receipt["example_url"] = page.url
            if not example_url_ok(page.url):
                raise AssertionError("Unexpected initial Example Domain URL")
            receipt["example_title"] = page.title()
            if receipt["example_title"] != "Example Domain":
                raise AssertionError("Unexpected Example Domain title")
            page.get_by_role("heading", name="Example Domain", exact=True).wait_for(state="visible")
            example_text = page.locator("body").inner_text()
            if "Example Domain" not in example_text:
                raise AssertionError("Example Domain text missing")
            receipt["example_text_sha256"] = hashlib.sha256(example_text.encode()).hexdigest()
            link = page.locator('a[href="https://iana.org/domains/example"], a[href="https://www.iana.org/domains/example"]')
            if link.count() != 1:
                raise AssertionError("Expected exactly one IANA example-domains link")
            receipt["link_href"] = link.get_attribute("href")
            link.click()
            page.wait_for_url(lambda u: final_url_ok(u.geturl()), wait_until="domcontentloaded", timeout=TIMEOUT_MS)
            receipt["final_url"] = page.url
            receipt["final_title"] = page.title()
            final = urlparse(page.url)
            if not final_url_ok(page.url):
                raise AssertionError("Unexpected final IANA URL")
            if receipt["final_title"] != "IANA — Example Domains":
                raise AssertionError("Unexpected final IANA title")
            page.get_by_role("heading", name="Example Domains", exact=True).wait_for(state="visible")
            final_text = page.locator("body").inner_text()
            receipt["final_text_sha256"] = hashlib.sha256(final_text.encode()).hexdigest()
            screenshot = ROOT / "iana-example-domains.jpg"
            page.screenshot(path=str(screenshot), type="jpeg", quality=85,
                            full_page=True, timeout=TIMEOUT_MS)
            jpeg = screenshot.read_bytes()
            receipt["screenshot"] = {"filename": screenshot.name, "bytes": len(jpeg),
                "sha256": hashlib.sha256(jpeg).hexdigest(), "format": "JPEG",
                "quality": 85, "post_recompression": False}
            context.close()
            browser.close()
        if receipt["blocked_requests"]:
            raise AssertionError("Blocked request: allowlist gate failed")
        receipt["status"] = "PASS"
    except Exception as error:
        receipt["error_type"] = type(error).__name__
        receipt["error"] = str(error)
    finally:
        signal.alarm(0)
        receipt["finished_at_utc"] = utc()
        (ROOT / "execution-receipt.json").write_text(json.dumps(receipt, indent=2) + "\n")
        print(json.dumps(receipt, indent=2))
    return 0 if receipt["status"] == "PASS" else 1


if __name__ == "__main__":
    raise SystemExit(main())
