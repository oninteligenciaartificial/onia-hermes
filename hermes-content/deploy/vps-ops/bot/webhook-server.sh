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
#   ./webhook-server.sh start|stop|restart|status|logs|knowledge
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
# El PID y el log viven FUERA de $DEST a proposito: el sync hace `rm -rf $DEST` y se los llevaba
# puestos. Sin PID, `stop` no mataba nada, el proceso viejo se quedaba con el puerto, el `node`
# nuevo moria al no poder escuchar... y el servidor seguia contestando /health con el CODIGO VIEJO.
# Un despliegue que no surte efecto y encima responde ok:true. (Diagnosticado 2026-08-06.)
PIDFILE="/tmp/onia-bot-webhook.pid"
LOGFILE="/tmp/onia-bot-webhook.log"
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
  knowledge)
    # Aplica SOLO el archivo de conocimiento, SIN reiniciar el proceso: el cargador lo toma al
    # vencer el TTL (<= 5 min). Asi editar un hecho no corta la atencion de nadie.
    #
    # La compuerta de PUBLICACION esta aca: se copia a un temporal, se VALIDA adentro del
    # contenedor (mismo validador que usa el bot al cargar) y recien si pasa se mueve al lugar
    # definitivo. Un archivo con un precio, una clave desconocida o un JSON roto NUNCA llega a
    # ser el archivo vivo, y el editor ve el error exacto en vez de descubrirlo por el silencio.
    SRC="${ONIA_BOT_KNOWLEDGE_FILE:-$BOT_DIR/knowledge.json}"
    if [ ! -f "$SRC" ]; then
      echo "ERROR: no existe $SRC (copia knowledge.example.json y editalo)" >&2
      exit 1
    fi
    if ! docker cp "$SRC" "$CONTAINER:$DEST/knowledge.json.new" >/dev/null 2>&1; then
      echo "ERROR: no se pudo copiar el conocimiento al contenedor (¿corriste 'start' alguna vez?)" >&2
      exit 1
    fi
    if docker exec "$CONTAINER" node "$DEST/knowledge.mjs" --check "$DEST/knowledge.json.new"; then
      docker exec "$CONTAINER" mv "$DEST/knowledge.json.new" "$DEST/knowledge.json"
      echo "conocimiento aplicado — el bot lo toma en <= 5 min (TTL). Para ya mismo: $0 restart"
      exit 0
    fi
    docker exec "$CONTAINER" rm -f "$DEST/knowledge.json.new" >/dev/null 2>&1
    echo "RECHAZADO: el conocimiento NO se aplico. El bot sigue con lo anterior." >&2
    exit 1
    ;;
  stop|restart)
    # Se mata por PID y ADEMAS por patron: si el PID se perdio (o quedo apuntando a un fantasma),
    # matar "lo que diga el archivo" deja vivo al proceso real. Despues se VERIFICA que no quede
    # ninguno: dar por detenido algo que sigue corriendo es como nacio el bug de arriba.
    docker exec "$CONTAINER" sh -c "
      [ -f $PIDFILE ] && kill \$(cat $PIDFILE) 2>/dev/null
      rm -f $PIDFILE
      sleep 1
      for pid in \$(ps -o pid,args | grep '[w]ebhook-server.mjs' | awk '{print \$1}'); do
        kill \$pid 2>/dev/null
      done
      sleep 1
      for pid in \$(ps -o pid,args | grep '[w]ebhook-server.mjs' | awk '{print \$1}'); do
        kill -9 \$pid 2>/dev/null
      done
    " >/dev/null 2>&1
    if docker exec "$CONTAINER" sh -c "ps -o args | grep -q '[w]ebhook-server.mjs'" 2>/dev/null; then
      echo "ERROR: quedo un webhook-server.mjs vivo — NO se pudo detener" >&2
      exit 1
    fi
    echo "servidor detenido"
    [ "$ACTION" = "stop" ] && exit 0
    ;;
  start) ;;
  *)
    echo "uso: $0 start|stop|restart|status|logs [n]|knowledge" >&2
    exit 2
    ;;
esac

# ---------------------------------------------------------------------------
# Sincronizar el codigo (mismo stamp que usan run-turn.sh / chatwoot-adapter.sh)
# ---------------------------------------------------------------------------

# Los *.json ENTRAN en el stamp a proposito: ahi vive knowledge.json (la capa de conocimiento
# editable). Con el stamp calculado solo sobre *.mjs, editar el conocimiento NO cambiaba el
# hash, el restart no re-copiaba nada y el contenedor se quedaba con la version vieja EN
# SILENCIO — o sea el editor creia haber publicado algo que el bot nunca dijo.
STAMP="$(cat "$BOT_DIR"/*.mjs "$BOT_DIR"/*.json 2>/dev/null | md5sum | cut -c1-12)"
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
# El bot postea con SU PROPIA identidad de Chatwoot (agente "Onia Bot"), no con la de Sergio:
# es lo unico que permite saber quien escribio y callar al bot cuando el toma la conversacion.
# Sin la variable cae al 2 (la cuenta de Sergio) = comportamiento de antes, nunca queda sin token.
CW_AGENT_ID="${CHATWOOT_BOT_AGENT_ID:-2}"
CW_TOKEN=""
if [ -n "$CWDB" ]; then
  CW_TOKEN="$(docker exec "$CWDB" psql -U postgres -d 'onia-chatbot' -tAc \
    "select token from access_tokens where owner_id=$CW_AGENT_ID order by created_at desc limit 1" 2>/dev/null | tr -d ' \t\n' || true)"
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
  -e ONIA_BOT_PREVIEW_SECRET="${ONIA_BOT_PREVIEW_SECRET:-}" \
  -e ONIA_BOT_KNOWLEDGE_URL="${ONIA_BOT_KNOWLEDGE_URL:-http://onia-platform:3000/api/chatbot-knowledge/published}" \
  -e BOT_KNOWLEDGE_SECRET="${BOT_KNOWLEDGE_SECRET:-}" \
  -e LITELLM_BASE="${LITELLM_BASE:-http://onia_selfhosted-litellm-1:4000/v1}" \
  -e LITELLM_KEY="$MK" \
  -e ONIA_BOT_MODEL="${ONIA_BOT_MODEL:-gpt-4o-mini}" \
  -e ONIA_BOT_DRY_RUN="${ONIA_BOT_DRY_RUN:-true}" \
  -e ONIA_BOT_SLOTS="${ONIA_BOT_SLOTS:-}" \
  -e CALCOM_BASE_URL="${CALCOM_BASE_URL:-http://calcom:3000}" \
  -e CALCOM_EVENT_TYPE_SLUG="${CALCOM_EVENT_TYPE_SLUG:-demo-onia}" \
  -e CALCOM_USERNAME="${CALCOM_USERNAME:-onia}" \
  -e CALCOM_BOT_EVENT_TYPE_ID="${CALCOM_BOT_EVENT_TYPE_ID:-}" \
  -e CALCOM_BOT_DURATION_MINUTES="${CALCOM_BOT_DURATION_MINUTES:-}" \
  -e CALCOM_TIMEZONE="${CALCOM_TIMEZONE:-America/La_Paz}" \
  -e ONIA_AUDIO_ENABLED="${ONIA_AUDIO_ENABLED:-true}" \
  -e ONIA_AUDIO_STT_BASE_URL="${ONIA_AUDIO_STT_BASE_URL:-http://speaches:8000/v1}" \
  -e ONIA_AUDIO_STT_MODEL="${ONIA_AUDIO_STT_MODEL:-Systran/faster-whisper-small}" \
  -e ONIA_AUDIO_STT_LANGUAGE="${ONIA_AUDIO_STT_LANGUAGE:-es}" \
  -e ONIA_AUDIO_STT_TIMEOUT_MS="${ONIA_AUDIO_STT_TIMEOUT_MS:-45000}" \
  -e ONIA_AUDIO_MAX_BYTES="${ONIA_AUDIO_MAX_BYTES:-8388608}" \
  -e BCP_MODE="${BCP_MODE:-}" \
  -e BCP_BASE_URL="${BCP_BASE_URL:-}" \
  -e BCP_USERNAME="${BCP_USERNAME:-}" \
  -e BCP_PASSWORD="${BCP_PASSWORD:-}" \
  -e BCP_APP_USER_ID="${BCP_APP_USER_ID:-}" \
  -e BCP_PUBLIC_TOKEN="${BCP_PUBLIC_TOKEN:-}" \
  -e BCP_BUSINESS_CODE="${BCP_BUSINESS_CODE:-}" \
  -e BCP_SERVICE_CODE="${BCP_SERVICE_CODE:-050}" \
  -e BCP_CALLBACK_USER="${BCP_CALLBACK_USER:-}" \
  -e BCP_CALLBACK_TOKEN="${BCP_CALLBACK_TOKEN:-}" \
  -e CHATWOOT_BASE_URL="${CHATWOOT_BASE_URL:-http://onia-chatbot_chatwoot:3000}" \
  -e CHATWOOT_ACCOUNT_ID="${CHATWOOT_ACCOUNT_ID:-2}" \
  -e CHATWOOT_API_TOKEN="$CW_TOKEN" \
  -e CHATWOOT_BOT_AGENT_ID="$CW_AGENT_ID" \
  "$CONTAINER" sh -c "node $DEST/webhook-server.mjs >> $LOGFILE 2>&1 & echo \$! > $PIDFILE"

# No alcanza con lanzarlo: hay que ESPERAR a que conteste. Si el puerto estaba ocupado, el node
# nuevo muere en silencio y quien contesta es otro proceso — que es justo lo que hay que detectar.
HEALTH=""
for _ in 1 2 3 4 5 6 7 8 9 10; do
  sleep 1
  HEALTH="$(docker exec "$CONTAINER" sh -c "wget -qO- http://127.0.0.1:$PORT/health 2>/dev/null" 2>/dev/null || true)"
  [ -n "$HEALTH" ] && break
done

if [ -z "$HEALTH" ]; then
  echo "ERROR: el servidor NO responde en el puerto $PORT tras 10s." >&2
  echo "       Mira los logs:  $0 logs 50" >&2
  exit 1
fi

VIVOS="$(docker exec "$CONTAINER" sh -c "ps -o args | grep -c '[w]ebhook-server.mjs'" 2>/dev/null | tr -d ' \r\n')"
if [ "${VIVOS:-1}" != "1" ]; then
  echo "AVISO: hay $VIVOS procesos webhook-server.mjs vivos — el que contesta puede ser el VIEJO." >&2
  echo "       Corre:  $0 restart" >&2
fi

echo "servidor levantado en el contenedor $CONTAINER, puerto $PORT"
echo "$HEALTH"
echo
exit 0
