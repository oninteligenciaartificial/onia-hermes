#!/usr/bin/env bash
# ONIA — corre el Agente Building in Public DENTRO del contenedor onia-center. Inyecta el
# repo-pulse (commits por carril, generado por la Action repo-pulse.yml) y la master key de
# LiteLLM. Escribe onia_center.dev_pulse (visibilidad de desarrollo) y deja contenido
# building-in-public (sanitizado) en review_queue. Imprime el JSON en stdout. Llamado por n8n.
#
# Vars opcionales (env): BUILDING_PUBLIC_MODEL, BUILDING_PUBLIC_DRY_RUN.
set -uo pipefail

PULSE_FILE="/opt/onia/state/repo-pulse-latest.json"
PULSE_B64=""
if [ -f "$PULSE_FILE" ]; then
  PULSE_B64=$(base64 -w0 "$PULSE_FILE" 2>/dev/null || base64 "$PULSE_FILE" | tr -d '\n')
fi

MODEL="${BUILDING_PUBLIC_MODEL:-gpt-4o-mini}"
DRY="${BUILDING_PUBLIC_DRY_RUN:-false}"
MK=$(docker exec onia_selfhosted-litellm-1 printenv LITELLM_MASTER_KEY 2>/dev/null)

docker exec \
  -e REPO_PULSE_B64="$PULSE_B64" \
  -e LITELLM_BASE="http://onia_selfhosted-litellm-1:4000/v1" \
  -e LITELLM_KEY="$MK" \
  -e BUILDING_PUBLIC_MODEL="$MODEL" \
  -e BUILDING_PUBLIC_DRY_RUN="$DRY" \
  -i onia-center node - < /opt/onia/building-public-agent.mjs
