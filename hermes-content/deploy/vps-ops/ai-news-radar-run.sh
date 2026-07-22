#!/usr/bin/env bash
# ONIA — corre el Agente Radar de Novedades IA DENTRO del contenedor onia-center (que tiene acceso a
# Supabase onia_center y a la red de LiteLLM). Los feeds RSS/Atom los baja el propio agente con fetch
# (a diferencia de radar-yt, que necesita yt-dlp en el host). Este script solo inyecta la master key
# de LiteLLM (para clasificar) y pipea el .mjs al contenedor. Imprime el resumen JSON en stdout.
# Llamado por n8n via SSH (nodo Execute Command) o a mano.
#
# NO fatal si falta la key de LiteLLM: el agente igual baja los feeds e inserta las novedades, y cae
# al fallback de clasificacion (importance='notable', sin alerta major) para no crashear.
#
# Vars opcionales (env): AI_RADAR_MODEL (def gpt-4o-mini), AI_RADAR_MAX_NEW (def 40).
set -uo pipefail

MODEL="${AI_RADAR_MODEL:-gpt-4o-mini}"
MAX_NEW="${AI_RADAR_MAX_NEW:-40}"

# LiteLLM master key (best-effort). Si el contenedor no responde, LLM_KEY queda vacio y el agente
# usa el fallback sin LLM (no aborta).
MK=$(docker exec onia_selfhosted-litellm-1 printenv LITELLM_MASTER_KEY 2>/dev/null || true)

docker exec \
  -e LITELLM_BASE="http://onia_selfhosted-litellm-1:4000/v1" \
  -e LITELLM_KEY="$MK" \
  -e AI_RADAR_MODEL="$MODEL" \
  -e AI_RADAR_MAX_NEW="$MAX_NEW" \
  -i onia-center node - < /opt/onia/ai-news-radar.mjs
