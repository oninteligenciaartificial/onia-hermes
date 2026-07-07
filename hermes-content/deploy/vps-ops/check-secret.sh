#!/usr/bin/env bash
# Valida un secret contra ONIA_CENTER_INTERNAL_API_KEY leida del contenedor onia-center
# (server-side). Devuelve SOLO {"authorized":true} o {"authorized":false} — NUNCA expone
# la key. Reemplaza el uso de $env en los webhooks n8n (regla: no $env en este plan
# Easypanel, las vars se pueden perder en un redeploy). Llamado por el nodo SSH previo
# al IF de autorizacion.
#
# Uso: check-secret.sh "<secret>"
set -uo pipefail

SECRET="${1:-}"
REAL=$(docker exec onia-center printenv ONIA_CENTER_INTERNAL_API_KEY 2>/dev/null)

if [ -n "$SECRET" ] && [ -n "$REAL" ] && [ "$SECRET" = "$REAL" ]; then
  echo '{"authorized":true}'
else
  echo '{"authorized":false}'
fi
