#!/usr/bin/env bash
# rowcount-compare.sh — compara counts por tabla: cloud public vs self-host dentalgest
# (Fases 3.5, 5 y 6 del runbook). SOLO LECTURA en ambos lados.
#
# Uso:
#   SRC_URL='postgresql://...cloud...' bash rowcount-compare.sh
#   (el destino se resuelve solo: contenedor db del stack en el VPS)
# La lista de tablas se saca DINAMICA del origen (no lista fija: hoy 34, manana mas).
set -euo pipefail

[ -n "${SRC_URL:-}" ] || { echo "falta SRC_URL (cloud, session mode)" >&2; exit 1; }
PG_IMAGE="postgres:17-alpine"
DB_CONTAINER="$(docker ps --format '{{.Names}}' | grep -E 'dentalgest.*supabase.*db|supabase.*db.*dentalgest' | head -1)"
[ -n "$DB_CONTAINER" ] || { echo "contenedor db no encontrado" >&2; exit 1; }

src_q() { docker run --rm -i -e PGURL="$SRC_URL" "$PG_IMAGE" sh -c 'psql "$PGURL" -Atc "$0"' "$1"; }
dst_q() { docker exec "$DB_CONTAINER" psql -U postgres -Atc "$1"; }

TABLES="$(src_q "select tablename from pg_tables where schemaname='public' order by 1")"
FAIL=0
printf '%-45s %10s %10s  %s\n' TABLA CLOUD SELFHOST ESTADO
for t in $TABLES; do
  SRC_N="$(src_q "select count(*) from public.\"$t\"")"
  DST_N="$(dst_q "select count(*) from dentalgest.\"$t\"" 2>/dev/null || echo 'AUSENTE')"
  if [ "$SRC_N" = "$DST_N" ]; then ST=OK; else ST='<<< DIFERENCIA'; FAIL=1; fi
  printf '%-45s %10s %10s  %s\n' "$t" "$SRC_N" "$DST_N" "$ST"
done

# extras que solo existen en destino (dormidas + C1/C2 de la Fase 4) — informativo, no error
echo '--- tablas solo en self-host (esperadas tras Fase 4: onia_commerce/invoicing/accounting/dental_alerts/entitlements/agents) ---'
SRC_REGEX="^($(echo "$TABLES" | tr '\n' '|' | sed 's/|$//'))$"
dst_q "select tablename from pg_tables where schemaname='dentalgest' order by 1" \
  | grep -Ev "$SRC_REGEX" || echo '(ninguna)'

if [ "$FAIL" = 1 ]; then echo 'RESULTADO: HAY DIFERENCIAS — NO avanzar de fase'; exit 1; fi
echo 'RESULTADO: counts identicos'
