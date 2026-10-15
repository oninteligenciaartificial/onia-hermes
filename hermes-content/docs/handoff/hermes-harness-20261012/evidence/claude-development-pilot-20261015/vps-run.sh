#!/usr/bin/env bash
# Trusted operator procedure; prepared only. No model/provider work by default.
set -Eeuo pipefail
phase=${1:-}
case "$phase" in probe|provider) ;; tests) [[ ${2:-} == --reviewed ]] || exit 2 ;; *) echo 'usage: vps-run.sh probe|provider|tests --reviewed'; exit 2 ;; esac
BASE=/var/lib/onia-development/pilot-20261015
INPUT=$BASE/input
STATE=$BASE/receipts/onia-vps-development-20261015-1
mkdir -p -m 700 "$STATE"
receipt=$STATE/$phase
mkdir -m 700 "$receipt" || { echo 'reserved: STOP, no replay'; exit 3; }
cid=''
cleanup() {
  rc=$?
  trap - EXIT INT TERM
  # Never adopt/remove an existing container merely because its name matches.
  if [[ -z $cid ]]; then
    cid=$(cat "$receipt/cid" 2>/dev/null) || cid=''
  fi
  if [[ $cid =~ ^[a-f0-9]{64}$ ]]; then
    printf '%s\n' "$cid" > "$receipt/cid"
    timeout 15 docker stop --time 5 "$cid" >/dev/null 2>&1 || true
    running=$(timeout 10 docker inspect --format '{{.State.Running}}' "$cid" 2>/dev/null) || running=UNKNOWN
    if [[ $running == true ]]; then
      timeout 10 docker kill "$cid" >/dev/null 2>&1 || true
      running=$(timeout 10 docker inspect --format '{{.State.Running}}' "$cid" 2>/dev/null) || running=UNKNOWN
    fi
    if [[ $running == false ]] && timeout 10 docker inspect --format '{{json .State}}' "$cid" > "$receipt/container-state.json"; then
      timeout 10 docker rm "$cid" > "$receipt/removed.txt" || rc=4
    else
      rc=4
    fi
  elif [[ -f $receipt/create_started ]]; then
    rc=4
  fi
  if [[ $rc == 0 ]]; then printf 'PASS\n' > "$receipt/PASS"; else printf 'needs_reconcile exit=%s\n' "$rc" > "$receipt/needs_reconcile"; fi
  exit "$rc"
}
trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM
if [[ $phase != probe ]]; then [[ -f $STATE/probe/PASS ]] || { echo 'probe PASS required'; exit 4; }; fi
if [[ $phase == tests ]]; then [[ -f $STATE/provider/PASS ]] || { echo 'provider PASS required'; exit 4; }; fi
# JSON argv is fixed, reviewed operator input. Never eval shell strings.
python3 - "$INPUT" "$phase" "$receipt/argv.nul" <<'PY'
import hashlib,json,pathlib,sys
p=pathlib.Path(sys.argv[1]); phase=sys.argv[2]
d=json.loads((p/'vps-command.json').read_text())
assert hashlib.sha256((p/'development_job.py').read_bytes()).hexdigest()==d['source_sha256']
assert hashlib.sha256((p/'vps-prompt.txt').read_bytes()).hexdigest()==d['prompt_sha256']
for name,h in d['config_sha256'].items():
 assert hashlib.sha256((p/name).read_bytes()).hexdigest()==h
key={'probe':'probe_create_argv','provider':'docker_create_argv','tests':'tests_create_argv'}[phase]
a=d[key]
assert a[:2]==['docker','create'] and '--pull=never' in a and d['image_id'] in a
assert a[a.index('--name')+1]=='onia-dev-20261015-1-'+phase
assert '--privileged' not in a and '--rm' not in a
pathlib.Path(sys.argv[3]).write_bytes(b'\0'.join(x.encode() for x in a)+b'\0')
PY
mapfile -d '' -t argv < "$receipt/argv.nul"
touch "$receipt/create_started"
timeout 30 "${argv[@]}" > "$receipt/cid" 2> "$receipt/create.stderr"
cid=$(cat "$receipt/cid")
[[ $cid =~ ^[a-f0-9]{64}$ ]] || exit 4
# Whitelisted configuration evidence only, never inspect environment values.
timeout 10 docker inspect --format '{"memory":{{.HostConfig.Memory}},"memorySwap":{{.HostConfig.MemorySwap}},"nanoCpus":{{.HostConfig.NanoCpus}},"pidsLimit":{{.HostConfig.PidsLimit}},"capDrop":{{json .HostConfig.CapDrop}},"securityOpt":{{json .HostConfig.SecurityOpt}},"readOnlyRootfs":{{.HostConfig.ReadonlyRootfs}},"networkMode":{{json .HostConfig.NetworkMode}}}' "$cid" > "$receipt/host-config.json"
if [[ $phase == provider ]]; then
  touch "$receipt/dispatch_started"
  timeout --signal=TERM --kill-after=5 300 docker start --attach --interactive "$cid" < "$INPUT/vps-prompt.txt" > "$receipt/stdout.private" 2> "$receipt/stderr.private"
else
  timeout --signal=TERM --kill-after=5 120 docker start --attach "$cid" > "$receipt/stdout.private" 2> "$receipt/stderr.private"
fi
# Attached client success is insufficient: confirm the actual container exit.
code=$(timeout 10 docker inspect --format '{{.State.ExitCode}}' "$cid")
oom=$(timeout 10 docker inspect --format '{{.State.OOMKilled}}' "$cid")
[[ $code == 0 && $oom == false ]] || exit 4
