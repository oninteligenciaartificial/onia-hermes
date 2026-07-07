#!/usr/bin/env bash
# ONIA — corre el briefing diario DENTRO del contenedor onia-center (que tiene la
# ONIA_CENTER_INTERNAL_API_KEY en su env). Imprime el JSON del endpoint en stdout.
# Llamado por n8n vía SSH (sin $env en n8n; la key nunca sale del contenedor).
# BRIEFING_COMMIT=false para dry-run (no escribe tareas).
set -uo pipefail

COMMIT="${BRIEFING_COMMIT:-true}"

docker exec -e BRIEFING_COMMIT="$COMMIT" -i onia-center node - < /opt/onia/briefing-run.mjs
