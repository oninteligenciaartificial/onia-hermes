#!/usr/bin/env bash
# verify-restore.sh — prueba de restore del ultimo backup (Fase 1.3 del runbook).
# "Backup que no se restaura = no existe." Cron: mensual (dia 1, 08:30 UTC) + a demanda.
#
# Restaura el ultimo db.dump en un Postgres 15 EFIMERO (misma imagen del stack para que
# las extensiones existan), cuenta 5 tablas testigo y compara contra el stack vivo.
# Reporta a Telegram. No toca el stack de produccion.
set -euo pipefail

BACKUP_ROOT="/root/backups/dentalgest"
PG_IMAGE="supabase/postgres:15.8.1.060"   # alinear con la imagen REAL del stack (docker ps)
WITNESS_TABLES="organizations profiles patients appointments invoices"
ALERT_ENV="/root/.config/onia/backup.env"
EPHEMERAL="dentalgest-restore-test"

[ -f "$ALERT_ENV" ] && . "$ALERT_ENV"

tg() {
  [ -n "${TG_BOT_TOKEN:-}" ] && [ -n "${TG_CHAT_ID:-}" ] || { echo "$1"; return 0; }
  curl -sf -X POST "https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage" \
    -d chat_id="${TG_CHAT_ID}" -d parse_mode=HTML --data-urlencode text="$1" >/dev/null || true
}
cleanup() { docker rm -f "$EPHEMERAL" >/dev/null 2>&1 || true; }
trap 'tg "<b>VERIFY-RESTORE FALLO</b> linea $LINENO"; cleanup' ERR

LATEST="$(ls -1d "$BACKUP_ROOT"/2* 2>/dev/null | sort | tail -1)"
[ -n "$LATEST" ] || { tg "<b>VERIFY-RESTORE</b> sin backups en $BACKUP_ROOT"; exit 1; }

( cd "$LATEST" && sha256sum -c SHA256SUMS --quiet )

# ── Postgres efimero (sin puertos publicados) ─────────────────────────
cleanup
docker run -d --name "$EPHEMERAL" -e POSTGRES_PASSWORD=restoretest "$PG_IMAGE" >/dev/null
for i in $(seq 1 30); do
  docker exec "$EPHEMERAL" pg_isready -U postgres >/dev/null 2>&1 && break
  sleep 2
done

# roles primero (ignorar errores de roles ya existentes), luego el dump
docker exec -i "$EPHEMERAL" psql -U postgres -q -f - < "$LATEST/globals.sql" >/dev/null 2>&1 || true
docker exec -i "$EPHEMERAL" pg_restore -U postgres -d postgres --no-owner --no-privileges < "$LATEST/db.dump"

# ── Comparar counts testigo contra el stack vivo ──────────────────────
LIVE_DB="$(docker ps --format '{{.Names}}' | grep -E 'dentalgest.*supabase.*db|supabase.*db.*dentalgest' | head -1)"
REPORT="restore test $(basename "$LATEST")"
FAIL=0
for t in $WITNESS_TABLES; do
  RESTORED="$(docker exec "$EPHEMERAL" psql -U postgres -Atc "select count(*) from dentalgest.\"$t\"")"
  LIVE="$(docker exec "$LIVE_DB" psql -U postgres -Atc "select count(*) from dentalgest.\"$t\"")"
  if [ "$RESTORED" = "$LIVE" ]; then
    REPORT="$REPORT
$t: $RESTORED OK"
  else
    REPORT="$REPORT
$t: restored=$RESTORED live=$LIVE MISMATCH"
    FAIL=1
  fi
done

cleanup
if [ "$FAIL" = 0 ]; then
  tg "<b>VERIFY-RESTORE OK</b>
$REPORT"
else
  tg "<b>VERIFY-RESTORE MISMATCH</b> (puede ser drift del dia; revisar)
$REPORT"
fi
echo "$REPORT"
