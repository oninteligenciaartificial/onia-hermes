#!/usr/bin/env bash
# ONIA — corre el Agente del Día (tareas reales del CRM) DENTRO del contenedor onia-center
# (que tiene la env de Supabase onia_center). Determinista, READ del CRM + upsert de tareas.
# Imprime el resumen JSON en stdout. Llamado por n8n (cron diario, Lun-Sáb) o a mano.
# DAILY_TASKS_DRY_RUN=true para no escribir (solo previsualizar).
set -uo pipefail

DRY="${DAILY_TASKS_DRY_RUN:-false}"

docker exec -e DAILY_TASKS_DRY_RUN="$DRY" -i onia-center node - < /opt/onia/daily-tasks-agent.mjs
