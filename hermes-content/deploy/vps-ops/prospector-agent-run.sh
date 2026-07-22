#!/usr/bin/env bash
# ONIA — corre el Agente Prospector DENTRO del contenedor onia-center (que tiene acceso a
# Supabase onia_center y a la red de LiteLLM). Descubre negocios reales por rubro+ciudad desde
# OpenStreetMap y los deja como prospectos en el CRM. Lee la master key de LiteLLM del contenedor
# litellm y la inyecta (enriquecimiento opcional). Imprime el resumen JSON en stdout. Llamado por
# n8n vía SSH (cron semanal) o a mano.
#
# Vars (env): PROSPECTOR_CITY, PROSPECTOR_CATEGORY, PROSPECTOR_LIMIT, PROSPECTOR_DRY_RUN,
#             PROSPECTOR_ONLY_NO_WEB, PROSPECTOR_MODEL.
set -uo pipefail

CITY="${PROSPECTOR_CITY:-santa_cruz}"
CATEGORY="${PROSPECTOR_CATEGORY:-dental}"
LIMIT="${PROSPECTOR_LIMIT:-8}"
DRY="${PROSPECTOR_DRY_RUN:-false}"
ONLY_NO_WEB="${PROSPECTOR_ONLY_NO_WEB:-true}"
MODEL="${PROSPECTOR_MODEL:-gpt-4o-mini}"

# LiteLLM master key (opcional: si no está, el agente cae a heurística sin LLM).
MK=$(docker exec onia_selfhosted-litellm-1 printenv LITELLM_MASTER_KEY 2>/dev/null || true)

docker exec \
  -e LITELLM_BASE="http://onia_selfhosted-litellm-1:4000/v1" \
  -e LITELLM_KEY="$MK" \
  -e PROSPECTOR_MODEL="$MODEL" \
  -e PROSPECTOR_CITY="$CITY" \
  -e PROSPECTOR_CATEGORY="$CATEGORY" \
  -e PROSPECTOR_LIMIT="$LIMIT" \
  -e PROSPECTOR_DRY_RUN="$DRY" \
  -e PROSPECTOR_ONLY_NO_WEB="$ONLY_NO_WEB" \
  -i onia-center node - < /opt/onia/prospector-agent.mjs
