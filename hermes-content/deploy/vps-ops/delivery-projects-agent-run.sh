#!/usr/bin/env bash
# ONIA — corre el Agente Entrega de proyectos DENTRO del contenedor onia-center (que tiene la env
# de Supabase onia_center). READ-ONLY salvo su propia fila en operating_agents; SIN LiteLLM.
# Imprime el resumen JSON en stdout. Llamado por n8n (cron lunes) que manda el .text por Telegram
# a Sergio solo si notify=true.
set -uo pipefail
docker exec -i onia-center node - < /opt/onia/delivery-projects-agent.mjs
