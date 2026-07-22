#!/usr/bin/env bash
# ONIA — corre el Digest semanal DENTRO del contenedor onia-center (tiene acceso a Supabase
# onia_center). READ-ONLY, sin LiteLLM. Imprime el resumen JSON en stdout. Llamado por n8n
# (cron domingo) que manda el .text por Telegram a Sergio.
set -uo pipefail
docker exec -i onia-center node - < /opt/onia/weekly-digest.mjs
