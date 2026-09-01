#!/usr/bin/env bash
# Token de Instagram para el flujo comentario -> DM. Multi-cuenta desde 2026-08-20.
#
#   ig-dm-token.sh peek [integration_id]
#   ig-dm-token.sh consume <from_id> [integration_id]
#
# El integration_id es la fila de la tabla Integration de Postiz; sin argumento
# se usa @oniahq (compatibilidad con lo que ya corria).
# El freno de 24 h es por PERSONA, global entre cuentas: Meta 2026 permite
# 1 DM automatico por usuario cada 24 h desde disparadores de comentario, y
# ser conservador aca es gratis.
set -euo pipefail

DEFAULT_INTEG='cmsw091nx0001lq9c8kr6dsg8'   # @oniahq

leer_token() {
  local integ="$1"
  docker exec postiz-postgres psql -U postiz-user -d postiz-db-local -t -A \
    -c "SELECT token FROM \"Integration\" WHERE id='${integ}' AND \"deletedAt\" IS NULL;" | tr -d '[:space:]'
}

MODO="${1:-peek}"

if [ "$MODO" = "peek" ]; then
  INTEG="${2:-$DEFAULT_INTEG}"
  case "$INTEG" in *[!a-z0-9]*) echo '{"ok":false,"motivo":"integ_invalido"}'; exit 0;; esac
  TOKEN=$(leer_token "$INTEG")
  [ -n "$TOKEN" ] || { echo '{"ok":false,"motivo":"sin_token"}'; exit 0; }
  printf '{"ok":true,"token":"%s"}\n' "$TOKEN"
  exit 0
fi

# `release <from_id>`: libera el freno cuando el envio NO salio.
# Lo llama n8n en la rama de error, despues de leer la respuesta de Meta.
# Idempotente: si el archivo no esta, no pasa nada.
if [ "$MODO" = "release" ]; then
  FROM="${2:-}"
  [ -n "$FROM" ] || { echo '{"liberado":false,"motivo":"sin_from_id"}'; exit 0; }
  case "$FROM" in *[!0-9]*) echo '{"liberado":false,"motivo":"from_id_invalido"}'; exit 0;; esac
  F="/opt/onia/ig-dm-sent/$FROM"
  if [ -f "$F" ]; then
    rm -f "$F"
    echo '{"liberado":true}'
  else
    echo '{"liberado":false,"motivo":"no_estaba_frenado"}'
  fi
  exit 0
fi

FROM="${2:-}"
INTEG="${3:-$DEFAULT_INTEG}"
[ -n "$FROM" ] || { echo '{"enviar":false,"motivo":"sin_from_id"}'; exit 0; }
case "$FROM" in *[!0-9]*) echo '{"enviar":false,"motivo":"from_id_invalido"}'; exit 0;; esac
case "$INTEG" in *[!a-z0-9]*) echo '{"enviar":false,"motivo":"integ_invalido"}'; exit 0;; esac

D=/opt/onia/ig-dm-sent
mkdir -p "$D"
find "$D" -type f -mtime +2 -delete 2>/dev/null || true

F="$D/$FROM"
if [ -f "$F" ] && [ $(( $(date +%s) - $(stat -c %Y "$F") )) -lt 86400 ]; then
  echo '{"enviar":false,"motivo":"ya_recibio_dm_24h"}'
  exit 0
fi

TOKEN=$(leer_token "$INTEG")
[ -n "$TOKEN" ] || { echo '{"enviar":false,"motivo":"sin_token"}'; exit 0; }

# El freno se pone ANTES de enviar a proposito: protege contra DMs duplicados,
# que es el fallo caro. Si el envio despues falla, n8n llama a `release` y lo
# libera. Ver H2 en hermes-content/docs/ONIA_CIRCUITO_COMENTARIO_DM.md
touch "$F"
printf '{"enviar":true,"token":"%s"}\n' "$TOKEN"
