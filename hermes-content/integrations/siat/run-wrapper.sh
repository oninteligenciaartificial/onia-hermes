#!/usr/bin/env bash
# Arranque del wrapper HTTP del emisor SIAT (VPS). NO deployar desde aca:
# el deploy lo hace la sesion de control (ver README, seccion "Wrapper HTTP").
set -euo pipefail
cd "$(dirname "$0")"
ENV_FILE="${SIAT_WRAPPER_ENV_FILE:-/opt/onia-siat/siat-wrapper.env}"
if [ ! -f "$ENV_FILE" ]; then
  echo "[siat-wrapper] no existe $ENV_FILE (ver .env.example, bloque del wrapper)" >&2
  exit 1
fi
set -a
# shellcheck disable=SC1090
. "$ENV_FILE"
set +a
exec node src/http-wrapper.mjs
