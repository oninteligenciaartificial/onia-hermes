#!/usr/bin/env bash
# ONIA — corre el CIERRE POST-DEMO del chatbot propio DENTRO del contenedor onia-center (que tiene
# las credenciales de Supabase onia_center). Pensado para que n8n lo llame vía SSH, una vez por
# hora, junto a los otros dos barridos. Mismo patrón que reminder-run.sh: se copia la carpeta al
# contenedor y se ejecuta por ruta (comparten carpeta y sello).
#
# ENTRADA : no usa stdin. Todo va por argumentos.
# SALIDA  : dry-run -> texto legible · --emit / --json -> una línea JSON por STDOUT.
#           Exit 0 SIEMPRE: si esto falla con código != 0, n8n reintenta. El reintento es inofensivo
#           (la reserva es el cambio de estado), pero un exit != 0 ensucia la ejecución igual.
#
# EL "AHORA" SE INYECTA: si no se pasa --now, este wrapper sella el instante con `date -u` y lo
# manda como parámetro. La lógica de postdemo-run.mjs nunca mira el reloj (determinismo).
#
# NO NECESITA TOKEN DE CHATWOOT ni la URL pública de Cal.com, a diferencia de los otros dos
# wrappers: este barrido NO le manda nada al prospecto. Sólo cierra el estado y le avisa a Sergio.
#
# ⚠️ Acá decía que el aviso "lo entrega n8n por Telegram" — y n8n está tapiado desde antes de que
# esa línea se escribiera (`ONIA_N8N_ENABLED=false` y `ONIA_N8N_EVENT_URL` vacío, medido el
# 2026-09-17 en `/proc/<pid>/environ` del webhook vivo). O sea que el cierre post-demo no le
# llegaba a nadie. Desde hoy el aviso sale por el MISMO Telegram que ya usa el webhook, y por eso
# este wrapper le pasa las credenciales al `docker exec`.
#
# Uso local (ver qué demos cerraría, sin escribir nada):
#   ./postdemo-run.sh
#
# n8n (nodo SSH, cron cada hora) — cierra y devuelve el JSON del aviso:
#   bash /opt/onia/bot/postdemo-run.sh --emit
#
# Reproducir un barrido pasado (mismo resultado, siempre):
#   bash /opt/onia/bot/postdemo-run.sh --now 2026-07-30T21:00:00Z
set -uo pipefail

CONTAINER="${ONIA_BOT_CONTAINER:-onia-center}"
DEST="/tmp/onia-bot"

BOT_DIR="$(cd "$(dirname "$0")" 2>/dev/null && pwd)"
[ -f "$BOT_DIR/postdemo-run.mjs" ] || BOT_DIR="/opt/onia/bot"
if [ ! -f "$BOT_DIR/postdemo-run.mjs" ]; then
  echo '{"ok":false,"send":[],"error":"no se encontro postdemo-run.mjs (esperado en /opt/onia/bot)"}'
  exit 0
fi

# Sincronizar el código sólo si cambió (mismo sello que run-turn.sh / followup-run.sh /
# reminder-run.sh: comparten la carpeta). Los *.json van INCLUIDOS: ahí vive knowledge.json.
STAMP="$(cat "$BOT_DIR"/*.mjs "$BOT_DIR"/*.json 2>/dev/null | md5sum | cut -c1-12)"
CURRENT="$(docker exec "$CONTAINER" cat "$DEST/.stamp" 2>/dev/null || true)"
if [ "$CURRENT" != "$STAMP" ]; then
  # `mkdir -p` + `cp origen/.` en vez de `rm -rf` + `cp origen`: con el destino ya creado,
  # `docker cp origen destino` anida (/tmp/onia-bot/bot/) y mata el bot con MODULE_NOT_FOUND.
  # Pasa cuando dos de los 8 scripts que comparten este bloque sincronizan a la vez (los crons
  # se solapan con el restart del watchdog). El porque largo esta en webhook-server.sh.
  docker exec "$CONTAINER" mkdir -p "$DEST" >/dev/null 2>&1
  if ! docker cp "$BOT_DIR/." "$CONTAINER:$DEST" >/dev/null 2>&1; then
    echo '{"ok":false,"send":[],"error":"no se pudo copiar el bot al contenedor"}'
    exit 0
  fi
  docker exec "$CONTAINER" sh -c "printf '%s' '$STAMP' > $DEST/.stamp" >/dev/null 2>&1
fi

# El modo de envío se hereda de webhook.env, igual que followup-run.sh y reminder-run.sh. Sin esto
# el cron corría SIEMPRE en dry-run: nadie le pasa la variable, así que caía al `:-true` de abajo y
# el cierre post-demo quedaba registrado como 'skipped' para siempre. Quien llama puede pisarlo.
if [ -z "${ONIA_BOT_DRY_RUN:-}" ] && [ -f "$BOT_DIR/webhook.env" ]; then
  ONIA_BOT_DRY_RUN="$(sed -n 's/^ONIA_BOT_DRY_RUN=//p' "$BOT_DIR/webhook.env" | head -n1 | tr -d "\"' \r")"
fi

# EL MODO SE DERIVA DE ESE INTERRUPTOR, no del argumento que el llamador se acuerde de escribir.
# Heredar la variable no alcanzaba: este cron (`47 * * * *`) llama al wrapper PELADO y sin
# `--emit` el .mjs ni reserva ni cierra — 670 corridas, todas en dry-run. Por eso el `CERRARIA (0)`
# del log tenia DOS causas y arreglar solo el canal del aviso no lo habria encendido. La historia
# completa esta en followup-run.sh. Quien llama sigue mandando.
EMIT_ARGS=()
case " $* " in
  *" --emit "*|*" --dry-run "*|*" --json "*) ;;
  *)
    if [ "${ONIA_BOT_DRY_RUN:-true}" = "false" ]; then EMIT_ARGS=(--emit); fi
    ;;
esac

# CREDENCIALES DEL AVISO. Mismo patrón y mismo archivo que `webhook-server.sh`: el secreto vive
# donde ya vivía y nadie lo copia a mano. Hace falta acá porque `docker exec` hereda el entorno del
# CONTENEDOR, no el del webhook — medido el 2026-09-17, `onia-center` no tiene `TG_BOT_TOKEN`
# (0 coincidencias), lo tiene el PROCESO del webhook porque su lanzador se lo pasó con `-e`.
# Sin estas tres líneas el barrido no puede avisar, y como no puede avisar no cierra ninguna demo.
TG_AVISO="${ONIA_BOT_TG_AVISO:-true}"
TG_ENV_FILE="${ONIA_TG_ENV_FILE:-/root/.config/onia/backup.env}"
if [ -f "$TG_ENV_FILE" ]; then
  TG_BOT_TOKEN="${TG_BOT_TOKEN:-$(sed -n 's/^TG_BOT_TOKEN=//p' "$TG_ENV_FILE" | tr -d '\"'\''' | tr -d ' \t\r\n' || true)}"
  TG_CHAT_ID="${TG_CHAT_ID:-$(sed -n 's/^TG_CHAT_ID=//p' "$TG_ENV_FILE" | tr -d '\"'\''' | tr -d ' \t\r\n' || true)}"
fi

# CREDENCIALES DE CHATWOOT — no para postear (este barrido avisa por Telegram), sino para que el
# criterio "¿esta conversacion somos NOSOTROS?" pueda contestar. `es-nuestra.mjs` dejo de decidir
# por la FIRMA del contacto y ahora deriva los inboxes de prueba del NOMBRE que Chatwoot publica
# (d35bf465), porque el banco de pruebas llega con nombres anonimos y daba "no somos nosotros".
# Este wrapper era el UNICO de los cuatro sin estas lineas: sus tres hermanos ya las tenian por
# otra razon (postean), asi que el insumo llego a la familia y este quedo afuera en silencio.
# Medido el 2026-09-19 en /var/log/onia-bot-postdemo.log, 3 de 3 corridas desde que aterrizo el
# codigo: warnings ["inboxes de prueba: no pude preguntarle a Chatwoot (sin CHATWOOT_API_TOKEN)"].
# No es un parpadeo: `cargarInboxesDePrueba` falla ABIERTO (conjunto vacio) a proposito, asi que
# el barrido volvia al criterio viejo y el banco de pruebas pasaba como prospecto real.
#
# Y se DERIVA de webhook.env, no del entorno del que llama: el cron (`47 * * * *`) invoca este
# wrapper PELADO, asi que heredar la variable no alcanza. Es la misma clase que ONIA_BOT_DRY_RUN
# unas lineas mas arriba, y la cuarta vez que muerde en estos mismos archivos.
CWDB="$(docker ps -qf name=onia-chatbot_chatwoot-db | head -n1)"
if [ -z "${CHATWOOT_BOT_AGENT_ID:-}" ] && [ -f "$BOT_DIR/webhook.env" ]; then
  CHATWOOT_BOT_AGENT_ID="$(sed -n 's/^CHATWOOT_BOT_AGENT_ID=//p' "$BOT_DIR/webhook.env" | head -n1 | tr -d "\"' \r")"
fi
CW_AGENT_ID="${CHATWOOT_BOT_AGENT_ID:-}"
CW_TOKEN="${CHATWOOT_API_TOKEN:-}"
if [ -z "$CW_TOKEN" ] && [ -f "$BOT_DIR/webhook.env" ]; then
  CW_TOKEN="$(sed -n 's/^CHATWOOT_API_TOKEN=//p' "$BOT_DIR/webhook.env" | head -n1 | tr -d "\"' \r")"
fi
if [ -z "$CW_TOKEN" ] && [ -n "$CWDB" ] && [ -n "$CW_AGENT_ID" ]; then
  CW_TOKEN="$(docker exec "$CWDB" psql -U postgres -d 'onia-chatbot' -tAc \
    "select token from access_tokens where owner_id=$CW_AGENT_ID order by created_at desc limit 1" 2>/dev/null | tr -d ' \t\n' || true)"
fi

# Si quien llama no fijó el instante, se sella acá y viaja como parámetro explícito.
NOW_ARGS=()
case " $* " in
  *" --now "*|*" --now="*) ;;
  *) NOW_ARGS=(--now "$(date -u +%Y-%m-%dT%H:%M:%SZ)") ;;
esac

docker exec \
  -e ONIA_BOT_DRY_RUN="${ONIA_BOT_DRY_RUN:-true}" \
  -e ONIA_BOT_TG_AVISO="$TG_AVISO" \
  -e TG_BOT_TOKEN="${TG_BOT_TOKEN:-}" \
  -e TG_CHAT_ID="${TG_CHAT_ID:-}" \
  -e CHATWOOT_BASE_URL="${CHATWOOT_BASE_URL:-http://onia-chatbot_chatwoot:3000}" \
  -e CHATWOOT_ACCOUNT_ID="${CHATWOOT_ACCOUNT_ID:-2}" \
  -e CHATWOOT_API_TOKEN="$CW_TOKEN" \
  "$CONTAINER" node "$DEST/postdemo-run.mjs" ${NOW_ARGS[@]+"${NOW_ARGS[@]}"} ${EMIT_ARGS[@]+"${EMIT_ARGS[@]}"} "$@"

exit 0
