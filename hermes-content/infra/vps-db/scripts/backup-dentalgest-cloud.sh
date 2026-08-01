#!/usr/bin/env bash
# backup-dentalgest-cloud.sh — Fase 1 del runbook (PRE-CORTE): backup diario de la DB CLOUD
# de DentalGest (Supabase kvepqgikokjlacxngkiw) — SOLO LECTURA (pg_dump) — a disco local del VPS.
#
# Destino local: /opt/backups/dentalgest/<TS>/   (retencion local 7 dias, runbook Fase 1.2.6)
# Off-site R2:  BLOQUE COMENTADO listo-para-activar (requiere rclone.conf + bucket onia-backups, D4).
# Cliente pg17 en contenedor EFIMERO postgres:17-alpine (metodo runbook Fase 3.1) — no levanta servicios.
# Instalar en /root/bin/ (chmod 700). Cron: 07:30 UTC = 03:30 America/La_Paz (ver cron.example).
# Post-corte este script se reemplaza por backup-dentalgest.sh (backup del stack self-host).
set -euo pipefail

# ── Config ────────────────────────────────────────────────────────────
BACKUP_ROOT="/opt/backups/dentalgest"
PG_IMAGE="postgres:17-alpine"
LOCAL_RETENTION_DAYS=7
CLOUD_ENV="/root/.config/onia/backup-cloud.env"   # CLOUD_DB_URL=postgresql://... (chmod 600)
ALERT_ENV="/root/.config/onia/backup.env"         # KUMA_PUSH_URL, TG_BOT_TOKEN, TG_CHAT_ID (opcional)
# R2_REMOTE="r2:onia-backups/dentalgest"          # ← descomentar al activar R2 (bloque 5)

[ -f "$ALERT_ENV" ] && . "$ALERT_ENV"

notify_fail() {
  local msg="BACKUP DentalGest CLOUD FALLO $(date -u +%FT%TZ): ${1:-error}"
  echo "$msg" >&2
  if [ -n "${TG_BOT_TOKEN:-}" ] && [ -n "${TG_CHAT_ID:-}" ]; then
    curl -sf -X POST "https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage" \
      -d chat_id="${TG_CHAT_ID}" -d parse_mode=HTML \
      --data-urlencode text="<b>BACKUP DentalGest CLOUD FALLO</b> ${1:-error}" >/dev/null || true
  fi
}
trap 'notify_fail "linea $LINENO"' ERR

[ -f "$CLOUD_ENV" ] || { notify_fail "falta $CLOUD_ENV"; exit 1; }
. "$CLOUD_ENV"
[ -n "${CLOUD_DB_URL:-}" ] || { notify_fail "CLOUD_DB_URL vacia"; exit 1; }

TS="$(date -u +%Y%m%d_%H%M%S)"
DEST="$BACKUP_ROOT/$TS"
mkdir -p "$DEST"

pgc() {  # corre un comando del cliente pg17 contra la cloud (solo lectura)
  docker run --rm -e PGURL="$CLOUD_DB_URL" "$PG_IMAGE" sh -c "$1"
}

# ── 1. Roles (sin passwords: la cloud no expone pg_authid) ────────────
pgc 'pg_dumpall -d "$PGURL" --globals-only --no-role-passwords' > "$DEST/globals.sql"

# ── 2. Dump -Fc: schemas public + auth + storage ─────────────────────
# (owner/ACL se filtran al restaurar con --no-owner --no-privileges si hace falta)
pgc 'pg_dump -d "$PGURL" -Fc -n public -n auth -n storage' > "$DEST/db.dump"

# ── 3. Artefacto de la receta probada de junio: auth.users + identities (data-only, plain)
pgc 'pg_dump -d "$PGURL" --data-only --no-owner --no-privileges -t auth.users -t auth.identities' \
  > "$DEST/source_auth_users_identities.sql"

# ── 4. Checksums ──────────────────────────────────────────────────────
( cd "$DEST" && sha256sum ./* > SHA256SUMS )

# ── 5. Off-site R2 — LISTO PARA ACTIVAR ───────────────────────────────
# Descomentar R2_REMOTE (arriba) y la linea rclone. Requiere /root/.config/rclone/rclone.conf
# con credenciales del bucket onia-backups (decision D4 del runbook).
# Retencion R2 (runbook Fase 1.2.6): 14 diarios + 8 semanales + 12 mensuales via lifecycle rules del bucket.
# rclone copy "$DEST" "$R2_REMOTE/$TS" --transfers 4 --checksum

# ── 6. Poda local (7 dias) ────────────────────────────────────────────
find "$BACKUP_ROOT" -maxdepth 1 -type d -name '2*' -mtime +"$LOCAL_RETENTION_DAYS" -exec rm -rf {} +

# ── 7. Heartbeat ──────────────────────────────────────────────────────
SIZE="$(du -sh "$DEST" | cut -f1)"
[ -n "${KUMA_PUSH_URL:-}" ] && curl -sf "${KUMA_PUSH_URL}?status=up&msg=ok_${SIZE}" >/dev/null || true
echo "backup OK $TS ($SIZE) -> $DEST"
