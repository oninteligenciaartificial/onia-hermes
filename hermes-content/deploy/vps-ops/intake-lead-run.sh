#!/usr/bin/env bash
# ONIA — corre el Agente Nuevo Lead DENTRO de onia-center (acceso a Supabase + LiteLLM).
# Recibe el lead inbound en base64 como $1 e inyecta la master key de LiteLLM.
# Imprime el resumen JSON. Llamado por n8n vía SSH.
set -uo pipefail

B64="${1:-}"
[ -n "$B64" ] || { echo '{"ok":false,"error":"no lead b64"}'; exit 0; }
MK=$(docker exec onia_selfhosted-litellm-1 printenv LITELLM_MASTER_KEY 2>/dev/null)
[ -n "$MK" ] || { echo '{"ok":false,"error":"no litellm master key"}'; exit 0; }

docker exec \
  -e LITELLM_BASE="http://onia_selfhosted-litellm-1:4000/v1" \
  -e LITELLM_KEY="$MK" \
  -e LEAD_B64="$B64" \
  -i onia-center node - < /opt/onia/intake-lead.mjs
