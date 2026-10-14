"""Fixed synthetic-only offline smoke test."""
from datetime import datetime,timezone
import hashlib,json,os,sys
from pathlib import Path

def main():
    if sys.argv[1:]!=["offline"]: raise SystemExit("offline fixture only")
    os.umask(0o077)
    os.makedirs("/tmp/home/.config",mode=0o700,exist_ok=True)
    os.makedirs("/tmp/home/.cache",mode=0o700,exist_ok=True)
    shot=Path("/out/offline-fixture.jpg")
    if not Path("/out").is_dir() or shot.exists() or shot.is_symlink(): raise SystemExit("invalid output")
    if not os.access("/out",os.W_OK|os.X_OK): raise SystemExit("output mount is not writable by pwuser; stop before browser launch")
    from importlib.metadata import version
    if version("playwright")!="1.62.0": raise SystemExit("Playwright version mismatch")
    from playwright.sync_api import sync_playwright
    html='<!doctype html><meta charset="utf-8"><title>ONIA Offline Browser Fixture</title><main><h1>Offline sandbox fixture</h1><p>synthetic-only</p></main>'
    with sync_playwright() as p:
        browser=p.chromium.launch(headless=True,chromium_sandbox=True)
        context=browser.new_context(accept_downloads=False,service_workers="block",viewport={"width":1280,"height":720})
        page=context.new_page(); page.set_content(html,wait_until="domcontentloaded")
        assert page.title()=="ONIA Offline Browser Fixture"
        assert page.locator("main h1").inner_text()=="Offline sandbox fixture"
        page.screenshot(path=str(shot),type="jpeg",quality=80)
        context.close(); browser.close()
    print(json.dumps({"captured_at_utc":datetime.now(timezone.utc).isoformat(),"phase":"offline-synthetic",
        "playwright_version":version("playwright"),"sandbox_enabled":True,"network_mode":"none",
        "remote_urls_requested":0,"artifact":shot.name,"artifact_bytes":shot.stat().st_size,
        "artifact_sha256":hashlib.sha256(shot.read_bytes()).hexdigest()},separators=(",",":")))
    return 0
if __name__=="__main__": raise SystemExit(main())
