#!/usr/bin/env bash
# cutover-restore-selfhost.sh — transforma (pg17→pg15, public→dentalgest) y restaura en el
# stack self-host (Fases 3.2/3.3 y 5 del runbook). DESTRUCTIVO sobre el schema dentalgest
# del VPS (cloud NO se toca). Guard: exige GO=SI + backup del dia.
#
# Receta de transformacion PROBADA 2026-06-30 — referencia viva en el VPS:
#   /root/backups/dentalgest-staging/20260630_152019/restore_dentalgest_full.sql
#   /root/backups/dentalgest-staging/20260630_152019/source_auth_users_identities.pg15.sql
# OBLIGATORIO (runbook 3.2): diff del SQL transformado contra esa referencia antes de aplicar
# — desde junio se crearon ~10 tablas nuevas; cualquier patron no cubierto se revisa a mano.
#
# Uso: GO=SI DUMP_DIR=/root/backups/dentalgest-cutover/<ts> bash cutover-restore-selfhost.sh
set -euo pipefail

[ "${GO:-}" = "SI" ] || { echo "ABORTADO: falta GO=SI" >&2; exit 1; }
[ -n "${DUMP_DIR:-}" ] && [ -f "$DUMP_DIR/source_public_full.sql" ] || { echo "falta DUMP_DIR valido" >&2; exit 1; }

DB_CONTAINER="$(docker ps --format '{{.Names}}' | grep -E 'dentalgest.*supabase.*db|supabase.*db.*dentalgest' | head -1)"
[ -n "$DB_CONTAINER" ] || { echo "contenedor db no encontrado" >&2; exit 1; }

# Guard: backup local del dia debe existir (Fase 1 verde)
TODAY="$(date -u +%Y%m%d)"
ls -d /root/backups/dentalgest/${TODAY}_* >/dev/null 2>&1 || {
  echo "ABORTADO: no hay backup de hoy en /root/backups/dentalgest/ — correr backup-dentalgest.sh primero" >&2; exit 1; }

( cd "$DUMP_DIR" && sha256sum -c SHA256SUMS --quiet )

echo "== 1/6 transformar public→dentalgest + strip pg17-only =="
# Cobertura minima probada en junio; el diff manual del paso previo es el que valida.
sed -e 's/\bSET transaction_timeout = 0;//' \
    -e 's/^CREATE SCHEMA public;/CREATE SCHEMA dentalgest;/' \
    -e "s/^SET search_path = public\b/SET search_path = dentalgest/" \
    -e "s/pg_catalog.set_config('search_path', ''/pg_catalog.set_config('search_path', ''/" \
    -e 's/\bpublic\./dentalgest./g' \
    -e 's/ SCHEMA public;/ SCHEMA dentalgest;/g' \
    "$DUMP_DIR/source_public_full.sql" > "$DUMP_DIR/restore_dentalgest_full.sql"
sed -e 's/\bSET transaction_timeout = 0;//' \
    "$DUMP_DIR/source_auth_users_identities.sql" > "$DUMP_DIR/source_auth_users_identities.pg15.sql"
echo "   → DIFF MANUAL AHORA contra la referencia de junio antes de seguir (Ctrl-C si difiere raro)"
read -r -p "   diff revisado y OK? escribir SI: " CONF
[ "$CONF" = "SI" ] || { echo "ABORTADO por operador" >&2; exit 1; }

echo "== 2/6 bajar app (si corre) =="
docker stop dentalgest-app >/dev/null 2>&1 || true

echo "== 3/6 drop + restore schema dentalgest =="
docker exec "$DB_CONTAINER" psql -U postgres -c 'DROP SCHEMA IF EXISTS dentalgest CASCADE;'
docker exec -i "$DB_CONTAINER" psql -U postgres -v ON_ERROR_STOP=1 -q -f - < "$DUMP_DIR/restore_dentalgest_full.sql"

echo "== 4/6 auth: users + identities =="
docker exec "$DB_CONTAINER" psql -U postgres -c 'TRUNCATE auth.identities, auth.users CASCADE;'
docker exec -i "$DB_CONTAINER" psql -U postgres -v ON_ERROR_STOP=1 -q -f - < "$DUMP_DIR/source_auth_users_identities.pg15.sql"

echo "== 5/6 grants + realtime =="
docker exec "$DB_CONTAINER" psql -U postgres -v ON_ERROR_STOP=1 <<'SQL'
GRANT USAGE ON SCHEMA dentalgest TO postgres, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA dentalgest TO postgres, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA dentalgest TO postgres, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA dentalgest GRANT ALL ON TABLES TO service_role;
-- dentalgest NO se agrega a PGRST_DB_SCHEMAS (la app usa Prisma; runbook 3.3.6)
-- realtime para las suscripciones del browser (revisar hooks de la app por tablas extra):
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE dentalgest.appointments;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE dentalgest.notifications;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
ANALYZE;
SQL

echo "== 6/6 counts rapidos =="
docker exec "$DB_CONTAINER" psql -U postgres -Atc \
  "select 'tables='||count(*) from pg_tables where schemaname='dentalgest'
   union all select 'rls_on='||count(*) from pg_tables where schemaname='dentalgest' and rowsecurity
   union all select 'auth_users='||count(*) from auth.users;"

echo "OK. SIGUIENTE: rowcount-compare.sh, storage-migrate.mjs, luego Fase 4 (arbol de migraciones)."
