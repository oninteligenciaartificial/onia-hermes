#!/usr/bin/env bash
# ONIA — corre el motor de scoring Nuvia DENTRO del contenedor onia-center (que tiene
# acceso a Supabase onia_center). Recibe el JSON de candidatos en base64 como $1 y lo
# inyecta. Imprime el resumen JSON en stdout. Llamado por n8n vía SSH.
set -uo pipefail

B64="${1:-}"
if [ -z "$B64" ]; then echo '{"ok":false,"fatal":"no candidates b64"}'; exit 0; fi

docker exec -e NUVIA_CANDIDATES_B64="$B64" -i onia-center node - < /opt/onia/nuvia-score.mjs
