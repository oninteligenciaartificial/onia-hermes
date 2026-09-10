#!/usr/bin/env bash
# Renueva los horarios de demo del bot si caducaron. Idempotente: si los que hay
# siguen siendo futuros, no toca nada y sale.
set -uo pipefail
cd /opt/onia/bot || exit 1
set -a; . /opt/onia/bot/webhook.env 2>/dev/null; set +a
exec node /opt/onia/bot/slots-rodantes.mjs --escribir
