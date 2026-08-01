#!/usr/bin/env bash
# ONIA — escribe el balance REAL de créditos Higgsfield en el panel, corriendo el sync DENTRO del
# contenedor onia-center (usa su env Supabase). El NÚMERO lo trae una sesión Claude Code con el MCP
# de Higgsfield y se pasa por CREDITS/PLAN. Idempotente (UPSERT). Sin costo, sin LLM.
#   CREDITS=2354.22 PLAN=ultra ./higgsfield-balance-sync-run.sh
set -uo pipefail

CREDITS="${CREDITS:-${1:-}}"
PLAN="${PLAN:-${2:-ultra}}"

if [ -z "$CREDITS" ]; then
  echo '{"ok":false,"error":"falta CREDITS (env o arg 1)"}'
  exit 0
fi

docker exec -e CREDITS="$CREDITS" -e PLAN="$PLAN" -i onia-center node - "$CREDITS" "$PLAN" \
  < /opt/onia/higgsfield-balance-sync.mjs
