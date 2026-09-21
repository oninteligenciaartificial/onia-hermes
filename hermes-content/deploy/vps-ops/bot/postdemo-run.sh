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
# wrappers: este barrido NO le manda nada al prospecto. Sólo cierra el estado y devuelve el aviso
# para Sergio, que lo entrega n8n por Telegram.
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

# Si quien llama no fijó el instante, se sella acá y viaja como parámetro explícito.
NOW_ARGS=()
case " $* " in
  *" --now "*|*" --now="*) ;;
  *) NOW_ARGS=(--now "$(date -u +%Y-%m-%dT%H:%M:%SZ)") ;;
esac

docker exec \
  -e ONIA_BOT_DRY_RUN="${ONIA_BOT_DRY_RUN:-true}" \
  "$CONTAINER" node "$DEST/postdemo-run.mjs" ${NOW_ARGS[@]+"${NOW_ARGS[@]}"} "$@"

exit 0
