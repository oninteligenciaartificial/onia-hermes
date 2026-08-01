#!/usr/bin/env bash
# ONIA — corre el Agente Vendedor DENTRO del contenedor onia-center (que tiene acceso a
# Supabase onia_center y a la red de LiteLLM). Lee la master key de LiteLLM de su contenedor
# y la inyecta. Imprime el resumen JSON del agente en stdout. Llamado por n8n vía SSH.
#
# Vars opcionales (env): SALES_AGENT_MODEL, SALES_AGENT_LIMIT, SALES_AGENT_DRY_RUN,
#                        SALES_AGENT_TEST_LEAD (JSON de un lead sintetico, solo dry-run).
set -uo pipefail

MODEL="${SALES_AGENT_MODEL:-gpt-4.1-mini}"
LIMIT="${SALES_AGENT_LIMIT:-8}"
DRY="${SALES_AGENT_DRY_RUN:-false}"
TESTLEAD="${SALES_AGENT_TEST_LEAD:-}"

MK=$(docker exec onia_selfhosted-litellm-1 printenv LITELLM_MASTER_KEY 2>/dev/null)
if [ -z "$MK" ]; then echo '{"ok":false,"fatal":"no litellm master key"}'; exit 0; fi

docker exec \
  -e LITELLM_BASE="http://onia_selfhosted-litellm-1:4000/v1" \
  -e LITELLM_KEY="$MK" \
  -e SALES_AGENT_MODEL="$MODEL" \
  -e SALES_AGENT_LIMIT="$LIMIT" \
  -e SALES_AGENT_DRY_RUN="$DRY" \
  -e SALES_AGENT_TEST_LEAD="$TESTLEAD" \
  -i onia-center node - < /opt/onia/sales-agent.mjs
