#!/usr/bin/env bash
set -Eeuo pipefail
umask 077
output_tmp=''

cleanup_output() {
  if [[ -n "$output_tmp" ]]; then
    rm -f -- "$output_tmp" >/dev/null 2>&1 || true
  fi
}
trap cleanup_output EXIT
trap 'exit 129' HUP
trap 'exit 130' INT
trap 'exit 143' TERM

if [[ "$#" -ne 2 || "$1" != "--control-root" || -z "$2" ]]; then
  echo '{"result":"blocked","reason":"explicit private control root required"}' >&2
  exit 2
fi
control_root="$(python3 - "$2" <<'PY'
import pathlib, stat, sys
p = pathlib.Path(sys.argv[1])
try:
    if p.is_symlink() or not p.is_dir(): sys.exit(2)
    resolved = p.resolve(strict=True)
    s = resolved.stat()
    if s.st_uid != 0 or stat.S_IMODE(s.st_mode) != 0o700: sys.exit(2)
    print(resolved)
except OSError:
    sys.exit(2)
PY
)" || {
  echo '{"result":"blocked","reason":"private control root validation failed"}' >&2
  exit 2
}

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
if [[ -e run-once.guard || -e run-once-receipt.json || -e run-once-receipt.json.tmp || -e run-once-output.tmp ]]; then
  echo '{"result":"blocked","reason":"one-shot guard already exists; no retry"}' >&2
  exit 2
fi
for stale_output in .run-once-output.*; do
  if [[ -e "$stale_output" ]]; then
    echo '{"result":"blocked","reason":"stale private output exists; no retry"}' >&2
    exit 2
  fi
done
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
output_tmp="$(mktemp --tmpdir=. .run-once-output.XXXXXXXXXX)"
chmod 600 -- "$output_tmp"
set +e
timeout --signal=TERM --kill-after=2s 75s env -i PATH=/usr/bin:/bin HOME=/root LANG=C.UTF-8 \
  bash -c 'ulimit -f 128; exec python3 browser-runner.py --execute-offline --control-root "$1"' _ "$control_root" \
  >"$output_tmp" 2>/dev/null
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

python3 run_result.py "$output_tmp" --root /tmp >run-once-receipt.json.tmp
python3 - <<'PY'
import json, os, pathlib
summary = json.loads(pathlib.Path("run-once-receipt.json.tmp").read_text(encoding="utf-8"))
if summary.get("result") != "offline_fixture_pass": raise SystemExit(2)
fd = os.open("run-once-receipt.json", os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
with os.fdopen(fd, "w", encoding="utf-8") as f:
    json.dump(summary, f, sort_keys=True, separators=(",", ":")); f.write("\n"); f.flush(); os.fsync(f.fileno())
print(json.dumps(summary, sort_keys=True, separators=(",", ":")))
PY
