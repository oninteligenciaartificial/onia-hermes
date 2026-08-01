#!/usr/bin/env bash
# backup-dentalgest.sh — backup diario del stack DentalGest self-host (Fase 1 del runbook).
# Instala en /root/bin/ (chmod 700). Cron: 07:30 UTC diario (= 03:30 America/La_Paz).
#
# Hace: roles (globals) + pg_dump -Fc (dentalgest+auth+storage) + tar del volumen Storage
#       + sha256 + rclone a R2 + poda local 7 dias + ping Kuma / alerta Telegram.
# Retencion R2 (14 diarios / 8 semanales / 12 mensuales): configurar lifecycle rules en el
# bucket R2; este script solo poda lo LOCAL.
set -euo pipefail

# ── Config ────────────────────────────────────────────────────────────
STACK_DIR="/opt/dentalgest-supabase/supabase/docker"
BACKUP_ROOT="/root/backups/dentalgest"
R2_REMOTE="r2:onia-backups/dentalgest"
LOCAL_RETENTION_DAYS=7
ALERT_ENV="/root/.config/onia/backup.env"   # KUMA_PUSH_URL, TG_BOT_TOKEN, TG_CHAT_ID (chmod 600)

[ -f "$ALERT_ENV" ] && . "$ALERT_ENV"

notify_fail() {
  local msg="BACKUP DentalGest FALLO $(date -u +%FT%TZ): ${1:-error}"
  echo "$msg" >&2
  if [ -n "${TG_BOT_TOKEN:-}" ] && [ -n "${TG_CHAT_ID:-}" ]; then
    curl -sf -X POST "https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage" \
      -d chat_id="${TG_CHAT_ID}" -d parse_mode=HTML \
      --data-urlencode text="<b>BACKUP DentalGest FALLO</b> ${1:-error}" >/dev/null || true
  fi
}
trap 'notify_fail "linea $LINENO"' ERR

# ── Localizar contenedor db ───────────────────────────────────────────
DB_CONTAINER="$(docker ps --format '{{.Names}}' | grep -E 'dentalgest.*supabase.*db|supabase.*db.*dentalgest' | head -1)"
[ -n "$DB_CONTAINER" ] || { notify_fail "contenedor db no encontrado"; exit 1; }

TS="$(date -u +%Y%m%d_%H%M%S)"
DEST="$BACKUP_ROOT/$TS"
mkdir -p "$DEST"

# ── 1. Roles (globals) ────────────────────────────────────────────────
docker exec "$DB_CONTAINER" pg_dumpall -U postgres --globals-only > "$DEST/globals.sql"

# ── 2. Dump de datos: schemas dentalgest + auth + storage ────────────
docker exec "$DB_CONTAINER" pg_dump -U postgres -Fc -d postgres \
  -n dentalgest -n auth -n storage > "$DEST/db.dump"

# ── 3. Archivos de Storage (volumen) ─────────────────────────────────
STORAGE_DIR="$STACK_DIR/volumes/storage"
if [ -d "$STORAGE_DIR" ]; then
  tar -I 'zstd -3' -cf "$DEST/storage.tar.zst" -C "$(dirname "$STORAGE_DIR")" "$(basename "$STORAGE_DIR")"
fi

# ── 4. Checksums ──────────────────────────────────────────────────────
( cd "$DEST" && sha256sum ./* > SHA256SUMS )

# ── 5. Off-site R2 ────────────────────────────────────────────────────
rclone copy "$DEST" "$R2_REMOTE/$TS" --transfers 4 --checksum

# ── 6. Poda local ─────────────────────────────────────────────────────
find "$BACKUP_ROOT" -maxdepth 1 -type d -name '2*' -mtime +"$LOCAL_RETENTION_DAYS" -exec rm -rf {} +

# ── 7. Heartbeat ──────────────────────────────────────────────────────
SIZE="$(du -sh "$DEST" | cut -f1)"
[ -n "${KUMA_PUSH_URL:-}" ] && curl -sf "${KUMA_PUSH_URL}?status=up&msg=ok_${SIZE}" >/dev/null || true
echo "backup OK $TS ($SIZE) → $R2_REMOTE/$TS"
