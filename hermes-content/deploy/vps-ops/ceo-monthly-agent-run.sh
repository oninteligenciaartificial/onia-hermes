#!/usr/bin/env bash
# ONIA — corre el Agente CEO Mensual DENTRO del contenedor onia-center (que tiene acceso a
# Supabase onia_center y a la red de LiteLLM). Lee la master key de LiteLLM de su contenedor y
# la inyecta para que el informe se redacte con el LLM barato; si el LLM no esta, el .mjs cae a
# un fallback determinista igual. READ-ONLY: no mueve plata ni aprueba nada. Imprime el JSON del
# informe en stdout. Llamado por n8n via SSH (cron mensual, dia 1) que manda el .text por Telegram.
#
# Vars opcionales (env): CEO_AGENT_MODEL.
set -uo pipefail

MODEL="${CEO_AGENT_MODEL:-gpt-4.1-mini}"

MK=$(docker exec onia_selfhosted-litellm-1 printenv LITELLM_MASTER_KEY 2>/dev/null)

docker exec \
  -e LITELLM_BASE="http://onia_selfhosted-litellm-1:4000/v1" \
  -e LITELLM_KEY="$MK" \
  -e CEO_AGENT_MODEL="$MODEL" \
  -i onia-center node - < /opt/onia/ceo-monthly-agent.mjs
