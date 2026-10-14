import hashlib
from pathlib import Path
root=Path(__file__).resolve().parent
base=root/'browser_check.py'
dest=root/'browser_check_vps_public.py'
expected='0C5650791E83831D11445B26FC715A7A931016E20A7F3C3EC6E423DB550A8D6B'
raw=base.read_bytes()
assert hashlib.sha256(raw).hexdigest().upper()==expected, 'frozen source hash mismatch'
s=raw.decode('utf-8')
s=s.replace('import signal\n','import signal\nimport stat\n',1)
lines=s.splitlines()
for i, line in enumerate(lines):
    if line.startswith('SESSION_ID = '):
        lines[i]='SESSION_ID = os.environ.get("ONIA_BROWSER_SESSION_ID", "UNKNOWN")'
        lines.insert(i+1, 'V2_BASE_SHA256 = "0C5650791E83831D11445B26FC715A7A931016E20A7F3C3EC6E423DB550A8D6B"')
        lines.insert(i+2, 'BROWSER_ROOT = Path("/ms-playwright")')
        break
s='\n'.join(lines)+'\n'
s=s.replace('"session_id": SESSION_ID, "session_id_provenance": "contract-provided",','"execution_host": "VPS", "session_id": SESSION_ID, "session_id_provenance": "explicit-runtime-value-or-UNKNOWN",',1)
helper='''def resolve_bundled_chromium(pw):
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


'''
s=s.replace('def route_request(route, receipt):',helper+'def route_request(route, receipt):',1)
s=s.replace('"chromium_executable": "/usr/bin/chromium",','"chromium_executable": "resolved from Playwright registry at runtime",\n        "derived_from_sha256": V2_BASE_SHA256,',1)
s=s.replace('"playwright": importlib.metadata.version("playwright"),','"playwright": "validated before launch",',1)
old='''        version = subprocess.run(["/usr/bin/chromium", "--version"],
                                 capture_output=True, text=True, timeout=5, check=True)
        receipt["chromium"] = version.stdout.strip()
        with sync_playwright() as pw:
            browser = pw.chromium.launch(
                executable_path="/usr/bin/chromium", headless=True,
'''
new='''        with sync_playwright() as pw:
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
'''
assert old in s, 'fixed-path launch block not found'
s=s.replace(old,new,1)
dest.write_text(s,encoding='utf-8',newline='\n')
assert hashlib.sha256(base.read_bytes()).hexdigest().upper()==expected, 'frozen source changed'
print('derived source regenerated from frozen parent; parent remains unchanged')
