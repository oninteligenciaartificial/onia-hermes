#!/usr/bin/env bash
# ONIA — corre el Agente Integraciones self-hosted DENTRO del contenedor onia-center (que tiene
# acceso a Supabase onia_center y a la red interna docker de los servicios self-hosted). Chequea la
# salud de Supabase privado, LiteLLM y Speaches STT y refleja el estado real en integration_connectors.
# Imprime el resumen JSON en stdout. Llamado por n8n via SSH (cron cada 6h); manda .text por Telegram
# solo si notify=true. READ-ONLY sobre la infra: no reinicia ni cambia nada.
#
# Inyecta la master key de LiteLLM si su contenedor esta; si no, el agente igual chequea LiteLLM por
# su /health publico (sin auth) y el resto de servicios normalmente.
set -uo pipefail

MK=$(docker exec onia_selfhosted-litellm-1 printenv LITELLM_MASTER_KEY 2>/dev/null || true)

docker exec \
  -e LITELLM_BASE="http://onia_selfhosted-litellm-1:4000/v1" \
  -e LITELLM_KEY="$MK" \
  -e SPEACHES_BASE_URL="http://speaches:8000" \
  -i onia-center node - < /opt/onia/selfhosted-health-agent.mjs
