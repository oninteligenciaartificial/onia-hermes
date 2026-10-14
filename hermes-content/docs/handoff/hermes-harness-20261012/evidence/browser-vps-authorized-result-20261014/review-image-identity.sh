#!/usr/bin/env bash
set -Eeuo pipefail
umask 077

# Read /etc/passwd from the exact built image without starting a container.
# This helper creates one stopped container object, copies one file, then removes
# only that exact object after its review label is verified.
if [[ "$(id -u)" != 0 || -L . || ! -d . || -L install-receipt.json || ! -f install-receipt.json ]]; then
  echo '{"result":"blocked","reason":"image review workspace gate failed"}' >&2
  exit 2
fi
python3 - <<'PY'
import pathlib, sys
p = pathlib.Path.cwd().resolve(strict=True); s = p.stat()
if p.is_symlink() or s.st_uid != 0 or (s.st_mode & 0o077): sys.exit(2)
PY
read -r status stage image_id < <(python3 - <<'PY'
import json
x = json.load(open("install-receipt.json", encoding="utf-8"))
print(x.get("status", ""), x.get("stage", ""), x.get("image_id", ""))
PY
)
if [[ "$status" != built || "$stage" != image || ! "$image_id" =~ ^sha256:[a-f0-9]{64}$ ]]; then
  echo '{"result":"blocked","reason":"built image receipt does not provide an immutable ID"}' >&2
  exit 2
fi
review_id="$(python3 -c 'import uuid; print(uuid.uuid4().hex)')"
name="onia-browser-image-review-$review_id"
label="org.onia.browser.review-id=$review_id"
tmp="$(mktemp -d /tmp/onia-browser-image-review-XXXXXX)"
chmod 700 "$tmp"

# No start command is issued. The created object is inspected as created, then one file is copied.
cid="$(timeout --signal=TERM --kill-after=2s 8s env -i PATH=/usr/bin:/bin HOME=/root LANG=C.UTF-8 \
  docker --context default create --pull=never --network=none --name "$name" --label "$label" "$image_id" 2>/dev/null)" || {
  echo '{"result":"needs_reconcile","stage":"container_create","started":false}' >&2
  exit 2
}
if [[ ! "$cid" =~ ^[a-f0-9]{64}$ ]]; then
  echo '{"result":"needs_reconcile","stage":"container_id","started":false}' >&2
  exit 2
fi
metadata="$(timeout --signal=TERM --kill-after=1s 4s env -i PATH=/usr/bin:/bin HOME=/root LANG=C.UTF-8 \
  docker --context default inspect --format '{{json .}}' "$cid" 2>/dev/null)" || {
  echo '{"result":"needs_reconcile","stage":"container_inspect","started":false}' >&2
  exit 2
}
if ! python3 - "$metadata" "$review_id" <<'PY'
import json, sys
try:
    obj = json.loads(sys.argv[1])
    labels = obj["Config"]["Labels"] or {}
except Exception:
    raise SystemExit(2)
if obj.get("State", {}).get("Status") != "created" or labels.get("org.onia.browser.review-id") != sys.argv[2]:
    raise SystemExit(2)
PY
then
  echo '{"result":"needs_reconcile","stage":"container_identity","started":false}' >&2
  exit 2
fi
timeout --signal=TERM --kill-after=1s 5s env -i PATH=/usr/bin:/bin HOME=/root LANG=C.UTF-8 \
  docker --context default cp "$cid:/etc/passwd" "$tmp/passwd" >/dev/null 2>/dev/null || {
    echo '{"result":"needs_reconcile","stage":"passwd_copy","started":false}' >&2
    exit 2
  }
identity="$(python3 - "$tmp/passwd" <<'PY'
import pathlib, sys
for line in pathlib.Path(sys.argv[1]).read_text(encoding="utf-8").splitlines():
    fields = line.split(":")
    if len(fields) >= 4 and fields[0] == "pwuser":
        uid, gid = int(fields[2]), int(fields[3])
        if uid > 0 and gid > 0:
            print(f"{uid}:{gid}"); raise SystemExit(0)
raise SystemExit(2)
PY
)" || {
  echo '{"result":"needs_reconcile","stage":"pwuser_identity","started":false}' >&2
  exit 2
}
timeout --signal=TERM --kill-after=1s 5s env -i PATH=/usr/bin:/bin HOME=/root LANG=C.UTF-8 \
  docker --context default rm "$cid" >/dev/null 2>/dev/null || {
    echo '{"result":"needs_reconcile","stage":"container_remove","started":false}' >&2
    exit 2
  }
remaining="$(timeout --signal=TERM --kill-after=1s 4s env -i PATH=/usr/bin:/bin HOME=/root LANG=C.UTF-8 \
  docker --context default ps -aq --no-trunc --filter "id=$cid" 2>/dev/null)" || {
  echo '{"result":"needs_reconcile","stage":"cleanup_check","started":false}' >&2
  exit 2
}
if [[ -n "$remaining" ]]; then
  echo '{"result":"needs_reconcile","stage":"cleanup_check","started":false}' >&2
  exit 2
fi
IFS=: read -r uid gid <<<"$identity"
python3 - "$uid" "$gid" "$image_id" "$review_id" <<'PY'
import json, os, sys
uid, gid, image, review = sys.argv[1:]
report = {"result": "image_identity_review_pass", "image_id": image, "pwuser_uid": int(uid),
    "pwuser_gid": int(gid), "container_started": False, "container_cleanup": "verified_absent",
    "review_id": review, "source": "read-only /etc/passwd copied from exact image ID"}
fd = os.open("image-identity-review.json", os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
with os.fdopen(fd, "w", encoding="utf-8") as f:
    json.dump(report, f, sort_keys=True, separators=(",", ":")); f.write("\n"); f.flush(); os.fsync(f.fileno())
print(json.dumps(report, sort_keys=True, separators=(",", ":")))
PY
