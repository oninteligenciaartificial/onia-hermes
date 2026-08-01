#!/usr/bin/env bash
# ONIA — levanta el SERVIDOR DE WEBHOOK del chatbot dentro del contenedor onia-center.
#
# Reemplaza el camino `Chatwoot -> n8n -> SSH -> docker exec -> node (arranque en frio)` por un
# proceso CALIENTE que Chatwoot llama directo. n8n deja de estar en el camino de la respuesta:
# recibe un evento redactado despues, y si esta caido el bot contesta igual.
#
# LO MEJOR DE CORRERLO ACA ADENTRO: Chatwoot y onia-center comparten la red de docker
# "easypanel", asi que el webhook viaja por `http://onia-center:3020/...` y NUNCA SALE A
# INTERNET. No hace falta exponer un puerto, ni TLS, ni un dominio.
#
#   ./webhook-server.sh start|stop|restart|status|logs
#
# SECRETOS: NINGUNO vive en el repo.
#   - Secreto del webhook y config de n8n -> /opt/onia/bot/webhook.env (chmod 600, FUERA de git).
#     Plantilla: webhook.env.example. El plan VPS de n8n no soporta $env, por eso el secreto de
#     n8n viaja como header desde el server y en n8n se valida con una credencial "Header Auth".
#   - Token de la API de Chatwoot -> se lee de SU PROPIA base en cada arranque (igual que
#     chatwoot-adapter.sh). Si rota desde la UI, se levanta solo al reiniciar.
#   - Master key de LiteLLM -> se lee de su propio contenedor.
set -uo pipefail

CONTAINER="${ONIA_BOT_CONTAINER:-onia-center}"
DEST="/tmp/onia-bot"
PORT="${ONIA_WEBHOOK_PORT:-3020}"
PIDFILE="$DEST/webhook-server.pid"
LOGFILE="$DEST/webhook-server.log"
ACTION="${1:-start}"

BOT_DIR="$(cd "$(dirname "$0")" 2>/dev/null && pwd)"
[ -f "$BOT_DIR/webhook-server.mjs" ] || BOT_DIR="/opt/onia/bot"
if [ ! -f "$BOT_DIR/webhook-server.mjs" ]; then
  echo "ERROR: no se encontro webhook-server.mjs (esperado en /opt/onia/bot)" >&2
  exit 1
fi

# ---------------------------------------------------------------------------
# Acciones que no necesitan sincronizar codigo
# ---------------------------------------------------------------------------

case "$ACTION" in
  status)
    docker exec "$CONTAINER" sh -c "wget -qO- http://127.0.0.1:$PORT/health 2>/dev/null || echo '{\"ok\":false,\"reason\":\"no responde\"}'"
    echo
    exit 0
    ;;
  logs)
    docker exec "$CONTAINER" sh -c "tail -n ${2:-50} $LOGFILE 2>/dev/null || echo '(sin log todavia)'"
    exit 0
    ;;
  stop|restart)
    docker exec "$CONTAINER" sh -c "[ -f $PIDFILE ] && kill \$(cat $PIDFILE) 2>/dev/null; rm -f $PIDFILE" >/dev/null 2>&1
    echo "servidor detenido"
    [ "$ACTION" = "stop" ] && exit 0
    ;;
  start) ;;
  *)
    echo "uso: $0 start|stop|restart|status|logs [n]" >&2
    exit 2
    ;;
esac

# ---------------------------------------------------------------------------
# Sincronizar el codigo (mismo stamp que usan run-turn.sh / chatwoot-adapter.sh)
# ---------------------------------------------------------------------------

STAMP="$(cat "$BOT_DIR"/*.mjs 2>/dev/null | md5sum | cut -c1-12)"
CURRENT="$(docker exec "$CONTAINER" cat "$DEST/.stamp" 2>/dev/null || true)"
if [ "$CURRENT" != "$STAMP" ]; then
  docker exec "$CONTAINER" rm -rf "$DEST" >/dev/null 2>&1
  if ! docker cp "$BOT_DIR" "$CONTAINER:$DEST" >/dev/null 2>&1; then
    echo "ERROR: no se pudo copiar el bot al contenedor" >&2
    exit 1
  fi
  docker exec "$CONTAINER" sh -c "printf '%s' '$STAMP' > $DEST/.stamp" >/dev/null 2>&1
fi

# ---------------------------------------------------------------------------
# Secretos — del archivo fuera de git y de los propios contenedores
# ---------------------------------------------------------------------------

ENV_FILE="${ONIA_WEBHOOK_ENV_FILE:-/opt/onia/bot/webhook.env}"
if [ -f "$ENV_FILE" ]; then
  # shellcheck disable=SC1090
  set -a; . "$ENV_FILE"; set +a
else
  echo "AVISO: no existe $ENV_FILE — sin secreto el webhook responde 503 a TODO." >&2
  echo "       Copia webhook.env.example, completalo y chmod 600." >&2
fi

MK="$(docker exec onia_selfhosted-litellm-1 printenv LITELLM_MASTER_KEY 2>/dev/null || true)"

CWDB="$(docker ps -qf name=onia-chatbot_chatwoot-db | head -n1)"
CW_TOKEN=""
if [ -n "$CWDB" ]; then
  CW_TOKEN="$(docker exec "$CWDB" psql -U postgres -d 'onia-chatbot' -tAc \
    "select token from access_tokens where owner_id=2 order by created_at desc limit 1" 2>/dev/null | tr -d ' \t\n' || true)"
fi

# ---------------------------------------------------------------------------
# Arranque (desatendido, con el log adentro del contenedor)
# ---------------------------------------------------------------------------

docker exec -d \
  -e ONIA_WEBHOOK_PORT="$PORT" \
  -e ONIA_CHATWOOT_WEBHOOK_SECRET="${ONIA_CHATWOOT_WEBHOOK_SECRET:-}" \
  -e ONIA_CHATWOOT_WEBHOOK_PATH_SECRET="${ONIA_CHATWOOT_WEBHOOK_PATH_SECRET:-}" \
  -e ONIA_CHATWOOT_SIGNATURE_TOLERANCE_SECONDS="${ONIA_CHATWOOT_SIGNATURE_TOLERANCE_SECONDS:-300}" \
  -e ONIA_CHATWOOT_ALLOW_UNSIGNED="${ONIA_CHATWOOT_ALLOW_UNSIGNED:-false}" \
  -e ONIA_N8N_ENABLED="${ONIA_N8N_ENABLED:-false}" \
  -e ONIA_N8N_EVENT_URL="${ONIA_N8N_EVENT_URL:-}" \
  -e ONIA_N8N_EVENT_SECRET="${ONIA_N8N_EVENT_SECRET:-}" \
  -e LITELLM_BASE="${LITELLM_BASE:-http://onia_selfhosted-litellm-1:4000/v1}" \
  -e LITELLM_KEY="$MK" \
  -e ONIA_BOT_MODEL="${ONIA_BOT_MODEL:-gpt-4o-mini}" \
  -e ONIA_BOT_DRY_RUN="${ONIA_BOT_DRY_RUN:-true}" \
  -e ONIA_BOT_SLOTS="${ONIA_BOT_SLOTS:-}" \
  -e CALCOM_BASE_URL="${CALCOM_BASE_URL:-http://calcom:3000}" \
  -e CALCOM_EVENT_TYPE_SLUG="${CALCOM_EVENT_TYPE_SLUG:-demo-onia}" \
  -e CALCOM_USERNAME="${CALCOM_USERNAME:-onia}" \
  -e CALCOM_BOT_EVENT_TYPE_ID="${CALCOM_BOT_EVENT_TYPE_ID:-}" \
  -e CALCOM_BOT_DURATION_MINUTES="${CALCOM_BOT_DURATION_MINUTES:-45}" \
  -e CALCOM_TIMEZONE="${CALCOM_TIMEZONE:-America/La_Paz}" \
  -e CHATWOOT_BASE_URL="${CHATWOOT_BASE_URL:-http://onia-chatbot_chatwoot:3000}" \
  -e CHATWOOT_ACCOUNT_ID="${CHATWOOT_ACCOUNT_ID:-2}" \
  -e CHATWOOT_API_TOKEN="$CW_TOKEN" \
  "$CONTAINER" sh -c "node $DEST/webhook-server.mjs >> $LOGFILE 2>&1 & echo \$! > $PIDFILE"

sleep 1
echo "servidor levantado en el contenedor $CONTAINER, puerto $PORT"
docker exec "$CONTAINER" sh -c "wget -qO- http://127.0.0.1:$PORT/health 2>/dev/null || echo '{\"ok\":false,\"reason\":\"todavia no responde, mira los logs\"}'"
echo
exit 0
