#!/usr/bin/env bash
set -Eeuo pipefail
umask 077

BASE_IMAGE='mcr.microsoft.com/playwright/python:v1.62.0-noble@sha256:aa81288e738725378becba5b3e06cb0f3a7f012a610e87e8d767a090ea3f740d'
IMAGE_TAG='onia/playwright-python:1.62.0-noble-lock-52e857275e07'
BASE_DIGEST='sha256:aa81288e738725378becba5b3e06cb0f3a7f012a610e87e8d767a090ea3f740d'
LOCK_SHA256='52e857275e075417fa9e5b934f3b41d0366a55fc25187b7f40dbb3df34ed6a4e'
RECEIPT='install-receipt.json'

write_receipt() {
  local status="$1" stage="$2" image_id="${3:-}" started="$4" finished
  finished="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
python3 - "$RECEIPT" "$status" "$stage" "$image_id" "$started" "$finished" <<'PY'
import json, os, sys
p, status, stage, image_id, started, finished = sys.argv[1:]
fd = os.open(p, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
with os.fdopen(fd, "w", encoding="utf-8") as f:
    json.dump({"status": status, "stage": stage, "image_id": image_id or None,
        "human_authorization": "Autorizar instalación y prueba aisladas.",
        "authorization_reference": "Sergio14Oct",
        "upstream_bundle_manifest_sha256": "F1B7B1DFA9C60330FC9D2184A2A266EFBFCDFC3B4733EE0FD9DD5F372906F78B",
        "source_manifest_sha256": __import__("hashlib").sha256(open("source-manifest.json", "rb").read()).hexdigest(),
        "base_image_digest": "sha256:aa81288e738725378becba5b3e06cb0f3a7f012a610e87e8d767a090ea3f740d",
        "requirements_lock_sha256": "52e857275e075417fa9e5b934f3b41d0366a55fc25187b7f40dbb3df34ed6a4e",
        "started_at_utc": started, "finished_at_utc": finished,
  "network_scope": "image pull from MCR; build uses default Docker egress and pip is configured for official PyPI plus its wheel host; egress is not kernel-allowlisted",
        "runtime_trial_performed": False}, f, sort_keys=True, separators=(",", ":"))
    f.write("\n"); f.flush(); os.fsync(f.fileno())
dfd = os.open(".", os.O_RDONLY)
try: os.fsync(dfd)
finally: os.close(dfd)
PY
}

if [[ "$(id -u)" != 0 || -L . || ! -d . || -e "$RECEIPT" ]]; then
  echo '{"result":"blocked","reason":"install directory or receipt gate failed"}' >&2
  exit 2
fi
python3 - <<'PY'
import os, pathlib, stat, sys
p = pathlib.Path.cwd().resolve(strict=True)
s = p.stat()
if p.is_symlink() or s.st_uid != 0 or (s.st_mode & 0o077): sys.exit(2)
PY
python3 - <<'PY'
import hashlib, json, pathlib, stat, sys
root = pathlib.Path.cwd()
m = root / "source-manifest.json"
if m.is_symlink() or not m.is_file(): sys.exit(2)
data = json.loads(m.read_text(encoding="utf-8"))
if data.get("upstream_bundle_manifest_sha256") != "F1B7B1DFA9C60330FC9D2184A2A266EFBFCDFC3B4733EE0FD9DD5F372906F78B": sys.exit(2)
for item in data["files"]:
    p = root / item["name"]
    if p.parent != root or p.is_symlink() or not p.is_file() or hashlib.sha256(p.read_bytes()).hexdigest() != item["sha256"]: sys.exit(2)
PY
docker_root="$(timeout --signal=TERM --kill-after=1s 10s env -i PATH=/usr/bin:/bin HOME=/root LANG=C.UTF-8 \
  docker --context default info --format '{{.DockerRootDir}}' 2>/dev/null)" || {
  echo '{"result":"blocked","reason":"bounded Docker preflight failed"}' >&2
  exit 2
}
python3 - "$docker_root" <<'PY'
import os, pathlib, sys
p = pathlib.Path(sys.argv[1]).resolve(strict=True)
v = os.statvfs(p)
free = v.f_bavail * v.f_frsize
mem = 0
for line in pathlib.Path("/proc/meminfo").read_text().splitlines():
    if line.startswith("MemAvailable:"):
        mem = int(line.split()[1]) * 1024
        break
load = os.getloadavg()[0]
if free < 4 * 1024**3 or mem < int(1.5 * 1024**3) or load > 3.0:
    print('{"result":"blocked","reason":"VPS resource margin below install threshold"}', file=sys.stderr)
    sys.exit(2)
print('{"result":"preflight_pass","free_disk_bytes":%d,"available_memory_bytes":%d,"load_1m":%.2f}' % (free, mem, load))
PY
tag_ids="$(timeout --signal=TERM --kill-after=1s 10s env -i PATH=/usr/bin:/bin HOME=/root LANG=C.UTF-8 \
  docker --context default image ls --quiet "$IMAGE_TAG" 2>/dev/null)" || {
  echo '{"result":"blocked","reason":"bounded existing-image check failed"}' >&2
  exit 2
}
if [[ -n "$tag_ids" ]]; then
  echo '{"result":"blocked","reason":"derived image tag already exists; no overwrite"}' >&2
  exit 2
fi
started="$(date -u +%Y-%m-%dT%H:%M:%SZ)"

# One bounded pull and one bounded build. No retries, login, global install, or service mutation.
if ! timeout --signal=TERM --kill-after=5s 180s env -i PATH=/usr/bin:/bin HOME=/root LANG=C.UTF-8 \
    docker --context default pull "$BASE_IMAGE" >/dev/null 2>/dev/null; then
  write_receipt needs_reconcile pull '' "$started"
  echo '{"result":"needs_reconcile","stage":"pull","retry":false}' >&2
  exit 2
fi
if ! timeout --signal=TERM --kill-after=5s 300s env -i PATH=/usr/bin:/bin HOME=/root LANG=C.UTF-8 \
    docker --context default build --pull=false --network=default --tag "$IMAGE_TAG" --file Dockerfile . >/dev/null 2>/dev/null; then
  write_receipt needs_reconcile build '' "$started"
  echo '{"result":"needs_reconcile","stage":"build","retry":false}' >&2
  exit 2
fi

metadata="$(timeout --signal=TERM --kill-after=1s 5s env -i PATH=/usr/bin:/bin HOME=/root LANG=C.UTF-8 \
  docker --context default image inspect --format '{{.Id}}|{{.Config.User}}|{{json .Config.Labels}}' "$IMAGE_TAG" 2>/dev/null)" || {
  write_receipt needs_reconcile image_inspect '' "$started"
  echo '{"result":"needs_reconcile","stage":"image_inspect","retry":false}' >&2
  exit 2
}
image_id="$(python3 - "$metadata" <<'PY'
import json, re, sys
try:
    image_id, user, labels_raw = sys.argv[1].split("|", 2)
    labels = json.loads(labels_raw)
except Exception:
    sys.exit(2)
if not re.fullmatch(r"sha256:[a-f0-9]{64}", image_id) or user != "pwuser": sys.exit(2)
if labels.get("org.onia.playwright.base-digest") != "sha256:aa81288e738725378becba5b3e06cb0f3a7f012a610e87e8d767a090ea3f740d": sys.exit(2)
if labels.get("org.onia.playwright.requirements-sha256") != "52e857275e075417fa9e5b934f3b41d0366a55fc25187b7f40dbb3df34ed6a4e": sys.exit(2)
print(image_id)
PY
)" || image_id=''
if [[ -z "$image_id" ]]; then
  write_receipt needs_reconcile image_identity "$image_id" "$started"
  echo '{"result":"needs_reconcile","stage":"image_identity","retry":false}' >&2
  exit 2
fi
write_receipt built image "$image_id" "$started"
cat "$RECEIPT"
