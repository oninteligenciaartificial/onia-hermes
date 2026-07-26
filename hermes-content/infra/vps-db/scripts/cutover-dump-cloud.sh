#!/usr/bin/env bash
# cutover-dump-cloud.sh — dump final desde Supabase CLOUD (Fases 3.1 y 5 del runbook).
# SOLO LECTURA sobre cloud. Guard: exige GO=SI. Cliente pg17 en docker (server cloud = 17.6).
#
# En Fase 5 (corte): correr SOLO con las escrituras congeladas (freeze Vercel activo).
# La URL de cloud se pasa por env efimera y NO se persiste en disco (patron de junio).
#
# Uso:
#   GO=SI CLOUD_DB_URL='postgresql://postgres.<ref>:<pass>@<host>:5432/postgres' bash cutover-dump-cloud.sh
set -euo pipefail

[ "${GO:-}" = "SI" ] || { echo "ABORTADO: falta GO=SI (regla del runbook — nada sin GO de Sergio)" >&2; exit 1; }
[ -n "${CLOUD_DB_URL:-}" ] || { echo "falta CLOUD_DB_URL (session mode 5432, no transaction pooler)" >&2; exit 1; }

PG_IMAGE="postgres:17-alpine"
TS="$(date -u +%Y%m%d_%H%M%S)"
DEST="/root/backups/dentalgest-cutover/$TS"
mkdir -p "$DEST"

run_pg() {
  # -i sin -t: stdout limpio para redirigir. La URL viaja solo por env del contenedor efimero.
  docker run --rm -i -e PGURL="$CLOUD_DB_URL" "$PG_IMAGE" sh -c "$1"
}

echo "== 1/3 schema public completo (34 tablas: negocio + onia_core_* + prospect_leads + _prisma_migrations) =="
run_pg 'pg_dump "$PGURL" -n public --no-owner --no-privileges --format=plain' > "$DEST/source_public_full.sql"

echo "== 2/3 auth: SOLO users + identities (sin sesiones/refresh/flow/one-time) =="
run_pg 'pg_dump "$PGURL" --data-only --column-inserts -t auth.users -t auth.identities' > "$DEST/source_auth_users_identities.sql"

echo "== 3/3 checksums =="
( cd "$DEST" && sha256sum ./* > SHA256SUMS )

# Storage NO va por pg_dump aqui: los ARCHIVOS se copian con storage-migrate.mjs (API);
# los metadatos (storage.buckets/objects) los recrea ese mismo script.

echo "OK → $DEST"
echo "SIGUIENTE: revisar tamanios + diff contra el dump del ensayo, luego cutover-restore-selfhost.sh"
unset CLOUD_DB_URL
