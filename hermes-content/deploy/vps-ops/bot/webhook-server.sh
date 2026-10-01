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
#   - Clave de LiteLLM -> la VIRTUAL del bot (alias onia-bot-motor, tope US$10/30d) desde
#     /root/.config/onia/litellm-bot.key (root, chmod 600). Si ese archivo no existe o esta
#     vacio, la master key, leida de su propio contenedor (el comportamiento de antes).
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

      # Y ADEMAS se deja en el HOST, que no es redundante: aplicar solo adentro del contenedor
      # es REVERSIBLE EN SILENCIO. El sync de mas abajo calcula un stamp sobre `$BOT_DIR/*.mjs`
      # y `$BOT_DIR/*.json` del host y, si cambio, hace `rm -rf $DEST` y vuelve a copiar el host
      # entero — o sea que el primer deploy que toque un .mjs devuelve el conocimiento VIEJO, sin
      # una linea en ningun lado. Quien corrio este comando lo vio aplicarse y nada le avisa
      # cuando se deshace.
      #
      # Medido el 2026-09-12 en /opt/onia/bot: knowledge.json era del 4-sep y knowledge.onia.json
      # del 6-sep. Seis dias contestandole a desconocidos que la facturacion en linea es
      # obligatoria "desde el 30 de septiembre" -la fecha que CLAUDE.md prohibe por nombre- con
      # la correccion ("1 de octubre de 2026, RND 102600000007") en el mismo directorio.
      #
      # Va DESPUES de la validacion a proposito: un conocimiento rechazado no puede tocar ni el
      # contenedor ni el host.
      VIVO="$BOT_DIR/knowledge.json"
      if [ "$SRC" -ef "$VIVO" ]; then
        : # SRC ya ES el archivo vivo (el default): copiarlo sobre si mismo aborta con
          # "are the same file" y convertiria un deploy sano en uno reportado como fallido.
      elif ! cp -p "$SRC" "$VIVO"; then
        echo "ERROR: se aplico en el contenedor pero NO se pudo escribir $VIVO." >&2
        echo "       El proximo deploy lo revierte: arreglalo antes de darlo por publicado." >&2
        exit 1
      fi

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
# La copia se arma AL LADO y se publica con un `mv`, en vez de `rm -rf $DEST` + `docker cp`.
# Por que: este sync corre tambien en `start`, o sea CON EL PROCESO VIVO, y el bot corre DESDE
# $DEST (`node $DEST/webhook-server.mjs`). Borrar el destino primero dejaba al bot sin
# `knowledge.json` durante todo el `docker cp` — y en esa ventana el que preguntaba el precio
# recibia el texto sin cotizacion, porque un archivo ausente no es un error que el cargador grite.
# Medido el 2026-09-12 (conv 49, 22:48 UTC). Peor todavia: si el `cp` FALLABA, el destino ya
# estaba borrado y el proceso vivo se quedaba sin archivos, con el script saliendo en error.
# Asi la ventana pasa de durar el `cp` entero a durar dos `mv` (el rename no es atomico entre los
# dos, pero son microsegundos), y un `cp` fallido NO toca lo que esta sirviendo.
#
# Y se copia `"$BOT_DIR/."` (el CONTENIDO) sobre un destino creado con `mkdir -p`, nunca
# `"$BOT_DIR"` (la carpeta). `docker cp ORIGEN DESTINO` se comporta distinto segun exista o no el
# destino: si ya existe, mete la carpeta ADENTRO — /tmp/onia-bot/bot/webhook-server.mjs — y el
# arranque muere con MODULE_NOT_FOUND mientras el .stamp miente que esta sincronizado. Eso mato al
# bot dos dias enteros (19-sep 19:00 UTC -> 21-sep 19:34). El `rm -rf "$DEST.new"` de aca abajo NO
# alcanza para evitarlo: dos corridas solapadas de este mismo script (el watchdog reinicia cada 2
# min y un deploy a mano puede caer encima) hacen que la segunda encuentre el `.new` que creo la
# primera. Copiar el contenido es idempotente y no puede anidar, corra como corra la carrera.
# Lo congela sync-no-anida.test.mjs, que exige el mismo idioma en los 8 scripts que sincronizan.
if [ "$CURRENT" != "$STAMP" ]; then
  docker exec "$CONTAINER" rm -rf "$DEST.new" "$DEST.old" >/dev/null 2>&1
  docker exec "$CONTAINER" mkdir -p "$DEST.new" >/dev/null 2>&1
  if ! docker cp "$BOT_DIR/." "$CONTAINER:$DEST.new" >/dev/null 2>&1; then
    docker exec "$CONTAINER" rm -rf "$DEST.new" >/dev/null 2>&1
    echo "ERROR: no se pudo copiar el bot al contenedor (lo que estaba sirviendo quedo intacto)" >&2
    exit 1
  fi
  # El stamp viaja DENTRO de la copia nueva: asi el `mv` publica codigo y stamp de una, y no puede
  # quedar un destino con codigo nuevo y stamp viejo (que haria recopiar todo en la corrida que viene).
  docker exec "$CONTAINER" sh -c "printf '%s' '$STAMP' > $DEST.new/.stamp" >/dev/null 2>&1
  docker exec "$CONTAINER" mv "$DEST" "$DEST.old" >/dev/null 2>&1   # la primera vez no existe: se tolera
  if ! docker exec "$CONTAINER" mv "$DEST.new" "$DEST" >/dev/null 2>&1; then
    docker exec "$CONTAINER" mv "$DEST.old" "$DEST" >/dev/null 2>&1
    echo "ERROR: no se pudo publicar la copia nueva del bot (se restauro la anterior)" >&2
    exit 1
  fi
  docker exec "$CONTAINER" rm -rf "$DEST.old" >/dev/null 2>&1
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

# LiteLLM con la clave VIRTUAL del bot, no con la master. Con la master el motor salteaba su
# propio tope (US$10 cada 30 dias en LiteLLM): un bucle o un abuso gastaba contra la cuenta
# entera de OpenAI sin que nada lo frenara. La master queda SOLO como respaldo si ops todavia no
# creo el archivo, para que este cambio no pueda dejar al bot sin IA. Se dice cual se uso —la
# clase, nunca el valor— en la salida y en el log del proceso (el watchdog descarta la salida).
LLM_KEY_FILE="${ONIA_LITELLM_BOT_KEY_FILE:-/root/.config/onia/litellm-bot.key}"
LLM_BASE="${LITELLM_BASE:-http://onia_selfhosted-litellm-1:4000/v1}"
LLM_MODEL="${ONIA_BOT_MODEL:-gpt-4o-mini}"
LLM_KEY=""
LLM_RECHAZO=""
[ -r "$LLM_KEY_FILE" ] && LLM_KEY="$(tr -d ' \t\r\n' < "$LLM_KEY_FILE")"
if [ -n "$LLM_KEY" ]; then
  # Una clave PRESENTE no es una clave que SIRVE. Revocada, regenerada, pegada con basura, o
  # restringida a otro modelo (la del bot solo puede gpt-4.1-mini, y el default de aca es
  # gpt-4o-mini): LiteLLM contesta 401, run-turn.mjs hace `if (!res.ok) return ""` y el bot
  # contesta TEXTO FIJO con /health en verde. Ni el watchdog ni el vigia de credito (que calla
  # los 401 del proxy a proposito) lo ven. Por eso se pregunta ANTES: GET /models con la clave,
  # que es gratis y devuelve solo los modelos que esa clave puede usar. Corre adentro del
  # contenedor del bot porque es el que esta en la red de LiteLLM. La clave viaja por el
  # entorno (`-e K` sin valor), nunca en argv. Si LiteLLM no contesta, la virtual se queda: la
  # master tampoco pasaria, y LiteLLM caido lo ve vps-healthcheck.
  # ponytail: se prueba al ARRANCAR; una clave revocada con el proceso vivo se ve en el proximo restart.
  VEREDICTO="$(K="$LLM_KEY" docker exec -e K -e M="$LLM_MODEL" -e U="$LLM_BASE/models" "$CONTAINER" node -e '
    (async () => {
      try {
        const r = await fetch(process.env.U, { headers: { Authorization: "Bearer " + process.env.K }, signal: AbortSignal.timeout(8000) });
        if (r.status === 401 || r.status === 403) return console.log("rechazada " + r.status);
        if (!r.ok) return console.log("http " + r.status);
        const ids = ((await r.json()).data || []).map((m) => m.id);
        console.log(ids.includes(process.env.M) ? "ok" : "sin-modelo " + process.env.M);
      } catch (e) { console.log("error " + e.name); }
    })()' 2>/dev/null | tail -n 1 | tr -cd 'A-Za-z0-9 ._:/-')"
  case "$VEREDICTO" in
    ok) LLM_KEY_CLASE="virtual ($LLM_KEY_FILE)" ;;
    rechazada*|sin-modelo*) LLM_RECHAZO="$VEREDICTO"; LLM_KEY="" ;;
    *) LLM_KEY_CLASE="virtual ($LLM_KEY_FILE, sin verificar: ${VEREDICTO:-LiteLLM no contesto})" ;;
  esac
fi
if [ -z "$LLM_KEY" ]; then
  LLM_KEY="$(docker exec onia_selfhosted-litellm-1 printenv LITELLM_MASTER_KEY 2>/dev/null || true)"
  if [ -n "$LLM_RECHAZO" ]; then
    LLM_KEY_CLASE="MASTER (la virtual de $LLM_KEY_FILE no sirve: $LLM_RECHAZO con $LLM_MODEL; el bot gasta sin su tope)"
    # Al tablero, no directo: el bot sigue con IA; lo que se perdio es el tope, y eso es trabajo.
    ONIA_TG="${ONIA_TG:-/root/bin/onia-tg.sh}"
    [ -x "$ONIA_TG" ] && "$ONIA_TG" "⚠️ Bot: la clave virtual de LiteLLM no sirve ($LLM_RECHAZO con $LLM_MODEL): contesta con la MASTER, sin su tope
Revisar $LLM_KEY_FILE contra la key onia-bot-motor de LiteLLM (existe, no revocada, models incluye $LLM_MODEL) y ONIA_BOT_MODEL en /opt/onia/bot/webhook.env. Despues: webhook-server.sh restart." >/dev/null 2>&1
  else
    LLM_KEY_CLASE="MASTER (sin $LLM_KEY_FILE o vacio: el bot gasta sin su tope)"
  fi
  echo "AVISO: LiteLLM con la $LLM_KEY_CLASE." >&2
fi
echo "LiteLLM: clave $LLM_KEY_CLASE"

# Aviso a Sergio por Telegram (aviso-telegram.mjs). El token y el chat NO son credencial nueva:
# son los que `webhook-watchdog.sh` —el script de al lado, por cron cada 2 minutos— ya lee de
# `/root/.config/onia/backup.env`. Leerlos de ahi es lo mismo que hacemos arriba con la clave de
# LiteLLM y el token de Chatwoot: el secreto vive donde ya vivia y nadie lo copia a mano.
# Lo que manda es `ONIA_BOT_TG_AVISO`, y viene ENCENDIDO de fabrica. Sergio ya decidio que si
# (tablero `t_b18ca430`, opcion (c)); dejarlo en `false` significaba que encenderlo dependia de
# editar a mano `/opt/onia/bot/webhook.env`, que no esta en git y que ningun deploy toca — o sea
# que el arreglo se desplegaba y el log seguia diciendo "apagado". Apagarlo es una linea en
# `webhook.env`, que gana por el `:-`.
TG_AVISO="${ONIA_BOT_TG_AVISO:-true}"
TG_ENV_FILE="${ONIA_TG_ENV_FILE:-/root/.config/onia/backup.env}"
if [ -f "$TG_ENV_FILE" ]; then
  TG_BOT_TOKEN="${TG_BOT_TOKEN:-$(sed -n 's/^TG_BOT_TOKEN=//p' "$TG_ENV_FILE" | tr -d '\"'\''' | tr -d ' \t\r\n' || true)}"
  TG_CHAT_ID="${TG_CHAT_ID:-$(sed -n 's/^TG_CHAT_ID=//p' "$TG_ENV_FILE" | tr -d '\"'\''' | tr -d ' \t\r\n' || true)}"
fi
# Encendido sin credencial no se calla: `aviso-telegram.mjs` devuelve `failed` con nombre propio.
# Avisarlo tambien aca ahorra el viaje al log para el caso mas probable (encender sin el archivo).
# Ojo con el default: este chequeo tiene que mirar el MISMO valor que se le pasa al `docker exec`.
# Con `${ONIA_BOT_TG_AVISO:-}` (vacio) el aviso quedaba encendido y esta guarda muda — el caso
# que mas importa, porque es el del operador que no configuro nada.
if [ "$(printf '%s' "$TG_AVISO" | tr '[:upper:]' '[:lower:]')" = "true" ] \
   && { [ -z "${TG_BOT_TOKEN:-}" ] || [ -z "${TG_CHAT_ID:-}" ]; }; then
  echo "AVISO: ONIA_BOT_TG_AVISO=true pero falta TG_BOT_TOKEN o TG_CHAT_ID ($TG_ENV_FILE)." >&2
  echo "       El aviso a Sergio va a salir 'failed' en el log, no 'sent'." >&2
fi

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
  -e ONIA_BOT_TG_AVISO="$TG_AVISO" \
  -e TG_BOT_TOKEN="${TG_BOT_TOKEN:-}" \
  -e TG_CHAT_ID="${TG_CHAT_ID:-}" \
  -e ONIA_BOT_KNOWLEDGE_URL="${ONIA_BOT_KNOWLEDGE_URL:-http://onia-platform:3000/api/chatbot-knowledge/published}" \
  -e ONIA_KNOWLEDGE_URL="${ONIA_KNOWLEDGE_URL:-}" \
  -e BOT_KNOWLEDGE_SECRET="${BOT_KNOWLEDGE_SECRET:-}" \
  -e ONIA_PLATFORM_URL="${ONIA_PLATFORM_URL:-}" \
  -e CHATWOOT_WEBHOOK_SECRET="${CHATWOOT_WEBHOOK_SECRET:-}" \
  -e ONIA_VERIFICACION_INVERSA="${ONIA_VERIFICACION_INVERSA:-apagada}" \
  -e ONIA_VERIFICACION_INVERSA_SECRETO="${ONIA_VERIFICACION_INVERSA_SECRETO:-}" \
  -e ONIA_VERIFICACION_INVERSA_INBOX_ID="${ONIA_VERIFICACION_INVERSA_INBOX_ID:-5}" \
  -e ONIA_VERIFICACION_INVERSA_URL="${ONIA_VERIFICACION_INVERSA_URL:-http://onia-platform:3000/api/auth/verificacion-whatsapp/desde-whatsapp}" \
  -e LITELLM_BASE="${LITELLM_BASE:-http://onia_selfhosted-litellm-1:4000/v1}" \
  -e LITELLM_KEY="$LLM_KEY" \
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
  "$CONTAINER" sh -c "echo '[arranque] LiteLLM: clave $LLM_KEY_CLASE' >> $LOGFILE; node $DEST/webhook-server.mjs >> $LOGFILE 2>&1 & echo \$! > $PIDFILE"

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
