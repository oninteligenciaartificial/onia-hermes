#!/usr/bin/env bash
# Opt-in PostgreSQL export only; integrity is not SQL/restore verification.
set +x
set -euo pipefail
umask 077
exec 3>&2 2>/dev/null
stage=arguments
lock_owned=0
finish() {
  local code=$?
  trap - EXIT
  if ((lock_owned)) && ! rmdir -- "$lock"; then code=1; stage=lock_cleanup; fi
  if ((code)); then
    printf '{"status":"postgres_export_failed","restoreVerified":false,"fullRecoveryVerified":false,"stage":"%s"}\n' "$stage" >&3
    exit 1
  fi
  printf '{"status":"postgres_export_complete","restoreVerified":false,"fullRecoveryVerified":false}\n'
}
trap finish EXIT
trap 'exit 1' HUP INT TERM

execute=0; seen=' '; cid=''; database=''; username=''; port=''; output=''; max_bytes=268435456; dump_timeout=300
while (($#)); do
  case "$1" in
    --execute) ((execute == 0)); execute=1; shift ;;
    --container-id|--database|--username|--port|--output-dir|--max-bytes|--dump-timeout-seconds)
      (($# >= 2)); [[ "$seen" != *" $1 "* ]]; seen+="$1 "
      case "$1" in
        --container-id) cid=$2 ;; --database) database=$2 ;; --username) username=$2 ;;
        --port) port=$2 ;; --output-dir) output=$2 ;; --max-bytes) max_bytes=$2 ;;
        --dump-timeout-seconds) dump_timeout=$2 ;;
      esac
      shift 2 ;;
    *) exit 1 ;;
  esac
done
((execute == 1))
[[ "$cid" =~ ^[a-f0-9]{64}$ ]]
[[ "$database" =~ ^[a-zA-Z_][a-zA-Z0-9_]{0,62}$ && "$username" =~ ^[a-zA-Z_][a-zA-Z0-9_]{0,62}$ ]]
[[ "$port" =~ ^[1-9][0-9]{0,4}$ ]]
((port <= 65535))
[[ "$max_bytes" =~ ^[1-9][0-9]{0,15}$ ]]
((max_bytes <= 9007199254740991))
[[ "$dump_timeout" =~ ^[1-9][0-9]{0,3}$ ]]
((dump_timeout <= 3600))
while [[ "$output" == */ && "$output" != / ]]; do output=${output%/}; done
[[ "$output" == /* && "$output" != / && -d "$output" && ! -L "$output" && "$output" != */. && "$output" != */.. ]]
[[ ! "$output" -ef "$output/.." ]]
output=$(cd -- "$output" && pwd -P)
stage=preflight
verifier=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)/verify-backup-gzip.mjs
[[ -f "$verifier" ]]
for required in docker gzip node mktemp mv date mkdir rmdir stat id; do command -v "$required" >/dev/null; done
stage=output_permissions
# Refuse a shared-writable destination; umask only protects newly created files.
permissions=$(stat -c '%u %a' -- "$output")
[[ "$permissions" =~ ^([0-9]+)\ ([0-7]{3,4})$ ]]
directory_uid=${BASH_REMATCH[1]}; directory_mode=${BASH_REMATCH[2]}
[[ "$directory_uid" == "$(id -u)" ]]
(( (8#$directory_mode & 0022) == 0 ))

stage=lock
lock="$output/.onia-postgres-export.lock"
mkdir -- "$lock"
lock_owned=1
stage=inspect
identity=$(docker --host unix:///var/run/docker.sock inspect --format '{{.Id}} {{.State.Running}}' "$cid")
[[ "$identity" == "$cid true" ]]
stage=staging
staging=$(mktemp -d "$output/.onia-postgres-partial-XXXXXXXX")
timestamp=$(date -u +%Y%m%dT%H%M%SZ)
[[ "$timestamp" =~ ^[0-9]{8}T[0-9]{6}Z$ ]]
destination="$output/onia-postgres-$database-$timestamp"

# Password stays inside the container. All dynamic values are separate argv,
# never interpolated into shell code. Ignore libpq remote/service overrides.
wrapper='unset PGHOSTADDR PGSERVICE PGSERVICEFILE PGOPTIONS; export PGCONNECT_TIMEOUT=10 PGPASSWORD="${PGPASSWORD:-${POSTGRES_PASSWORD:-}}"; exec "$@"'
connection=(--host=127.0.0.1 "--port=$port" "--username=$username" --no-password)
# Bound the process INSIDE the container; killing only docker exec is insufficient.
bounded=(timeout --signal=TERM --kill-after=5s "${dump_timeout}s")
stage=database_dump
docker --host unix:///var/run/docker.sock exec "$cid" sh -c "$wrapper" onia-backup \
  "${bounded[@]}" pg_dump "${connection[@]}" --format=plain "--dbname=$database" | gzip -c > "$staging/database.sql.gz"
stage=database_integrity
node "$verifier" "$staging/database.sql.gz" --max-bytes "$max_bytes" > "$staging/database.integrity.json"
stage=globals_dump
docker --host unix:///var/run/docker.sock exec "$cid" sh -c "$wrapper" onia-backup \
  "${bounded[@]}" pg_dumpall "${connection[@]}" --globals-only "--database=$database" | gzip -c > "$staging/globals.sql.gz"
stage=globals_integrity
node "$verifier" "$staging/globals.sql.gz" --max-bytes "$max_bytes" > "$staging/globals.integrity.json"
stage=manifest
printf '{"sourceContainerId":"%s","database":"%s","port":%s,"createdAtUtc":"%s","restoreVerified":false,"fullRecoveryVerified":false}\n' \
  "$cid" "$database" "$port" "$timestamp" > "$staging/manifest.json"

# No overwrite, nesting, pruning or latest pointer. A collision preserves the
# private staging directory, without a completion marker, for manual diagnosis.
stage=publish
mv -T -n -- "$staging" "$destination"
[[ ! -e "$staging" && ! -L "$staging" && -d "$destination" && ! -L "$destination" ]]
stage=completion_marker
(set -o noclobber; : > "$destination/EXPORT_COMPLETE")
