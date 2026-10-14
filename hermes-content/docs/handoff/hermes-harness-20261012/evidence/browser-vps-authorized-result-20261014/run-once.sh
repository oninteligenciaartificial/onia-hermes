#!/usr/bin/env bash
set -Eeuo pipefail
umask 077

if [[ "$(id -u)" != 0 || -L . || ! -d . || ! -f browser-runner.py || ! -f bind-approval.py ]]; then
  echo '{"result":"blocked","reason":"owned runtime workspace gate failed"}' >&2
  exit 2
fi
python3 - <<'PY'
import pathlib, sys
p = pathlib.Path.cwd().resolve(strict=True)
s = p.stat()
if p.is_symlink() or s.st_uid != 0 or (s.st_mode & 0o077): sys.exit(2)
PY
if [[ -e run-once.guard || -e run-once-receipt.json || -e run-once-output.tmp ]]; then
  echo '{"result":"blocked","reason":"one-shot guard already exists; no retry"}' >&2
  exit 2
fi
python3 - <<'PY'
import os
fd = os.open("run-once.guard", os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
with os.fdopen(fd, "w", encoding="ascii") as f:
    f.write("one invocation reserved\n"); f.flush(); os.fsync(f.fileno())
dfd = os.open(".", os.O_RDONLY)
try: os.fsync(dfd)
finally: os.close(dfd)
PY

# Python runner enforces 75 seconds plus one shared 2-second cleanup deadline.
# The outer limit only prevents a lost SSH supervisor from waiting indefinitely.
set +e
timeout --signal=TERM --kill-after=3s 82s env -i PATH=/usr/bin:/bin HOME=/root LANG=C.UTF-8 \
  bash -c 'ulimit -f 128; exec python3 browser-runner.py --execute-offline' \
  >run-once-output.tmp 2>/dev/null
rc=$?
set -e
if [[ "$rc" -ne 0 ]]; then
  python3 - "$rc" <<'PY'
import json, os, sys
rc = int(sys.argv[1])
p = "run-once-receipt.json"
fd = os.open(p, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
with os.fdopen(fd, "w", encoding="utf-8") as f:
    json.dump({"result": "needs_reconcile", "exit_code": rc, "retry": False,
        "raw_output_saved": False}, f, sort_keys=True, separators=(",", ":")); f.write("\n"); f.flush(); os.fsync(f.fileno())
PY
  echo '{"result":"needs_reconcile","retry":false,"raw_output_saved":false}' >&2
  exit 2
fi

python3 run_result.py run-once-output.tmp --root /tmp >run-once-receipt.json.tmp
python3 - <<'PY'
import json, os, pathlib
summary = json.loads(pathlib.Path("run-once-receipt.json.tmp").read_text(encoding="utf-8"))
if summary.get("result") != "offline_fixture_pass": raise SystemExit(2)
fd = os.open("run-once-receipt.json", os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
with os.fdopen(fd, "w", encoding="utf-8") as f:
    json.dump(summary, f, sort_keys=True, separators=(",", ":")); f.write("\n"); f.flush(); os.fsync(f.fileno())
print(json.dumps(summary, sort_keys=True, separators=(",", ":")))
PY
