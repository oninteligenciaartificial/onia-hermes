#!/usr/bin/env bash
# ONIA — corre el Sync del roster de agentes DENTRO del contenedor onia-center (env Supabase
# onia_center). Restaura el contrato de "vivo 24/7" (status/live/cadence_label/channel) preservando
# last_run. Idempotente y barato. Cablear en n8n para correr frecuente (post-agente o cada hora).
# AGENTS_SYNC_DRY_RUN=true para previsualizar sin escribir.
set -uo pipefail

DRY="${AGENTS_SYNC_DRY_RUN:-false}"

docker exec -e AGENTS_SYNC_DRY_RUN="$DRY" -i onia-center node - < /opt/onia/operating-agents-sync.mjs
