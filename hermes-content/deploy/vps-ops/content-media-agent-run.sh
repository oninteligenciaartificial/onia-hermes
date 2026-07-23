#!/usr/bin/env bash
# ONIA — corre el Agente Contenido y Media Lab DENTRO del contenedor onia-center (que tiene
# acceso a Supabase onia_center y a la red de LiteLLM). Lee la master key de LiteLLM de su
# contenedor y la inyecta. Solo produce TEXTO (guiones/carruseles), sin generacion pesada.
# Imprime el resumen JSON del agente en stdout. Llamado por n8n via SSH.
#
# Vars opcionales (env): CONTENT_AGENT_MODEL, CONTENT_AGENT_DRY_RUN.
set -uo pipefail

MODEL="${CONTENT_AGENT_MODEL:-gpt-4.1-mini}"
DRY="${CONTENT_AGENT_DRY_RUN:-false}"

MK=$(docker exec onia_selfhosted-litellm-1 printenv LITELLM_MASTER_KEY 2>/dev/null)
if [ -z "$MK" ]; then echo '{"ok":false,"notify":true,"fatal":"no litellm master key"}'; exit 0; fi

docker exec \
  -e LITELLM_BASE="http://onia_selfhosted-litellm-1:4000/v1" \
  -e LITELLM_KEY="$MK" \
  -e CONTENT_AGENT_MODEL="$MODEL" \
  -e CONTENT_AGENT_DRY_RUN="$DRY" \
  -i onia-center node - < /opt/onia/content-media-agent.mjs
