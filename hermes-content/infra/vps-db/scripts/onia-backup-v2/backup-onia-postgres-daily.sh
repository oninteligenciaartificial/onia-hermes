#!/usr/bin/env bash
# Root cron entrypoint for the bounded local PostgreSQL export only.
# On failure: exactly one Telegram alert, then the job's own exit code.
# No n8n, Storage or offsite claim.
set -euo pipefail
JOB=/root/bin/onia-backup-v2/backup-onia-postgres-job.py
OUTPUT_DIR=/root/backups/onia-postgres-v1
STATUS="$OUTPUT_DIR/postgres-export-job.status.json"
# Test-only overrides; cron never sets them.
ALERT_ENV=${ONIA_BACKUP_ALERT_ENV:-/root/.config/onia/backup.env}
CURL=${ONIA_BACKUP_CURL:-curl}

# write_status replaces the file (new inode), so inode+mtime tells this run's write.
status_id() { stat -c '%i %y' -- "$STATUS" 2>/dev/null || true; }

tg_error() {
  # xtrace off before the token exists: `bash -x` debugging must not log it.
  { set +x; } 2>/dev/null
  # stderr muted: bash echoes a malformed env line, which may hold the token.
  [ -f "$ALERT_ENV" ] && . "$ALERT_ENV" 2>/dev/null
  [ -n "${TG_BOT_TOKEN:-}" ] && [ -n "${TG_CHAT_ID:-}" ] || return 0
  command -v "$CURL" >/dev/null 2>&1 || return 0
  "$CURL" -sf -m 20 -X POST "https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage" \
    -d chat_id="${TG_CHAT_ID}" -d parse_mode=HTML --data-urlencode text="$1" >/dev/null 2>&1 || true
}

alert() {
  local code=$1 before=$2 stage=""
  if [ "$(status_id)" != "$before" ]; then
    # Fixed [a-z_] stage names only: HTML-safe, never raw file content.
    stage=$(head -c 16384 -- "$STATUS" 2>/dev/null \
      | sed -n 's/.*"stage":"\([a-z_]\{1,64\}\)".*/\1/p' | head -n 1)
  fi
  tg_error "<b>ONIA: respaldo diario de Postgres FALLÓ</b>
Código de salida: ${code}
Etapa: ${stage:-sin estado de esta ejecución}
Carpeta: ${OUTPUT_DIR##*/}
Hora UTC: $(date -u '+%Y-%m-%d %H:%M:%S')"
}

before=$(status_id)
code=0
/usr/bin/python3 "$JOB" \
  --execute \
  --container-name supabase-db \
  --expected-image-repo supabase/postgres \
  --database postgres --username postgres --port 54329 \
  --output-dir "$OUTPUT_DIR" \
  --max-bytes 268435456 --storage-budget-bytes 2147483648 \
  --min-free-bytes 5368709120 --dump-timeout-seconds 300 \
  --stale-lock-seconds 7200 || code=$?
if ((code != 0)); then
  # Subshell: nothing in the env file or the alert can exit or change $code.
  (alert "$code" "$before") || true
elif [ "$(status_id)" != "$before" ] && head -c 16384 -- "$STATUS" 2>/dev/null     | grep -qE '"stale(Exporter)?LockRecovered":true'; then
  # A reboot SIGTERMs the cron group: bash dies before alerting, the lock stays,
  # and today's run reclaims it and succeeds. Say that a day was lost.
  (tg_error "<b>ONIA: el respaldo anterior se interrumpió</b>
Hoy se recuperó el candado y el respaldo terminó bien, pero falta la copia del día anterior.
Carpeta: ${OUTPUT_DIR##*/}
Hora UTC: $(date -u '+%Y-%m-%d %H:%M:%S')") || true
fi
exit "$code"
