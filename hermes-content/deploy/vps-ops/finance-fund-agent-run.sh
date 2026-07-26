#!/usr/bin/env bash
# ONIA — corre el Agente Finanzas y Fondo ONIA DENTRO del contenedor onia-center (que tiene la
# key de Supabase onia_center en su env). Determinista, SIN LLM, READ-ONLY sobre la plata.
# Escribe onia_center.finance_summary + status del agente y imprime el JSON en stdout.
# Llamado por n8n via SSH.
set -uo pipefail

docker exec -i onia-center node - < /opt/onia/finance-fund-agent.mjs
