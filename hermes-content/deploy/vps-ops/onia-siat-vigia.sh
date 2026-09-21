#!/bin/sh
# ONIA - vigia SIAT runner (F1.5). Arma el estado del runner Fase 1 del HOST
# (pgrep + tail del log + casos ok del ndjson) y lo POSTea al webhook del
# workflow n8n "ONIA - Vigia SIAT runner (F1.5)" (j7orHCgVd92AOcfa), que lo
# reenvia a Sergio por Telegram. n8n corre en contenedor y no ve el host:
# por eso el dato lo arma este cron y viaja por webhook.
# Cron: 0 11,21 * * *   Log: /var/log/onia-siat-vigia.log

NDJSON=/opt/onia-siat/fase1-log.ndjson
WEBHOOK=https://n8n-sergio-n8n.hqdqgh.easypanel.host/webhook/onia-siat-vigia

if pgrep -f "fase1-runner.mjs" >/dev/null 2>&1; then ESTADO=corriendo; else ESTADO=detenido; fi
CASOS=$(grep -c '"ok":true' "$NDJSON" 2>/dev/null)
LOG=$(ls -t /var/log/onia-siat-runner-*.log 2>/dev/null | head -1)
ULTIMA=""
[ -n "$LOG" ] && ULTIMA=$(tail -n 1 "$LOG" 2>/dev/null | tr -d '"\\' | tr -d '\000-\037' | cut -c1-200)
TS=$(date -u +%FT%TZ)

printf '{"estado":"%s","ultimaLinea":"%s","casosOk":%s,"timestamp":"%s"}' \
  "$ESTADO" "$ULTIMA" "${CASOS:-0}" "$TS" \
  | curl -fsS -m 20 -X POST -H "Content-Type: application/json" -d @- "$WEBHOOK" \
  || { echo "$TS FALLO: no pude POSTear al webhook n8n"; exit 1; }
echo ""
echo "$TS ok estado=$ESTADO casos=${CASOS:-0}"
