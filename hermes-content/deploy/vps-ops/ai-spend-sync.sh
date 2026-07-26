#!/usr/bin/env bash
# ONIA - Sincroniza el gasto REAL de IA (LiteLLM) al panel. Lee el gasto del mes en curso de la
# base de LiteLLM (LiteLLM_SpendLogs) y lo escribe en onia_center.cost_items (item_key=openai_api)
# para que la vista Finanzas muestre "gasto IA del mes" en vivo. READ-ONLY sobre LiteLLM; solo
# actualiza esa fila del panel. Llamado por n8n (cron) via SSH. Sin costo, sin LLM.
set -uo pipefail

MONTH_START="$(date -u +%Y-%m-01)"

# Gasto del mes en curso (USD) desde la DB de LiteLLM. Si falla, 0 (no rompe).
SPEND="$(docker exec onia_selfhosted-litellm-db-1 psql -U litellm -d litellm -At \
  -c "select coalesce(round(sum(spend)::numeric,5),0) from \"LiteLLM_SpendLogs\" where \"startTime\" >= '${MONTH_START}';" 2>/dev/null)"
REQS="$(docker exec onia_selfhosted-litellm-db-1 psql -U litellm -d litellm -At \
  -c "select coalesce(count(*),0) from \"LiteLLM_SpendLogs\" where \"startTime\" >= '${MONTH_START}';" 2>/dev/null)"

# Validar que SPEND sea numerico; si no, abortar sin tocar el panel.
case "${SPEND:-}" in
  ''|*[!0-9.]*) echo "{\"ok\":false,\"error\":\"spend no numerico: ${SPEND:-vacio}\"}"; exit 0;;
esac
REQS="${REQS:-0}"

# Actualizar la fila del panel (merge en raw, no pisa notes/otros campos).
docker exec supabase-db psql -U postgres -d postgres -c \
  "update onia_center.cost_items set amount=${SPEND}, currency='USD', cycle='usage', updated_at=now(), \
   raw = coalesce(raw,'{}'::jsonb) || jsonb_build_object('spend_usd_mtd', ${SPEND}, 'requests_mtd', ${REQS}, 'month', '${MONTH_START}', 'updated', now()::text, 'source_db', 'litellm') \
   where item_key='openai_api';" >/dev/null 2>&1 \
  && echo "{\"ok\":true,\"ai_spend_mtd_usd\":${SPEND},\"requests_mtd\":${REQS}}" \
  || echo "{\"ok\":false,\"error\":\"no se pudo actualizar cost_items\"}"
