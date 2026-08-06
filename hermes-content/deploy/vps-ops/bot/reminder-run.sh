#!/usr/bin/env bash
# ONIA — corre el RECORDATORIO DEL DIA DE LA DEMO (M9) del chatbot propio DENTRO del contenedor
# onia-center (que tiene las credenciales de Supabase onia_center). Llamado por n8n vía SSH, una
# vez por hora. Mismo patrón que followup-run.sh: se copia la carpeta al contenedor y se ejecuta
# por ruta (comparten carpeta y sello).
#
# ENTRADA : no usa stdin. Todo va por argumentos.
# SALIDA  : dry-run -> texto legible · --emit / --json -> una línea JSON por STDOUT.
#           Exit 0 SIEMPRE: si esto falla con código != 0, n8n reintenta y el prospecto recibe
#           el recordatorio dos veces (justo lo que la reserva existe para evitar).
#
# EL "AHORA" SE INYECTA: si no se pasa --now, este wrapper sella el instante con `date -u` y lo
# manda como parámetro. La lógica de reminder-run.mjs nunca mira el reloj (determinismo).
#
# CALCOM_PUBLIC_URL es el dominio PÚBLICO de Cal.com, NO el interno de docker: el link viaja al
# teléfono del prospecto, así que `http://calcom:3000` no le sirve de nada. Si no se define, el
# código cae al dominio público por defecto (nunca al interno).
#
# Uso local (ver a quién le mandaría, sin reservar ni escribir nada):
#   ./reminder-run.sh
#
# n8n (nodo SSH, cron cada hora) — reserva y devuelve el JSON a enviar:
#   bash /opt/onia/bot/reminder-run.sh --emit
#
# Reproducir un barrido pasado (mismo resultado, siempre):
#   bash /opt/onia/bot/reminder-run.sh --now 2026-07-30T15:00:00Z
#
# Env opcionales (se pasan al contenedor):
#   ONIA_BOT_DRY_RUN=false   → los mensajes se registran como 'sent' en vez de 'skipped'
#   CALCOM_PUBLIC_URL        → default https://cal.onia.com.bo
set -uo pipefail

CONTAINER="${ONIA_BOT_CONTAINER:-onia-center}"
DEST="/tmp/onia-bot"

BOT_DIR="$(cd "$(dirname "$0")" 2>/dev/null && pwd)"
[ -f "$BOT_DIR/reminder-run.mjs" ] || BOT_DIR="/opt/onia/bot"
if [ ! -f "$BOT_DIR/reminder-run.mjs" ]; then
  echo '{"ok":false,"send":[],"error":"no se encontro reminder-run.mjs (esperado en /opt/onia/bot)"}'
  exit 0
fi

# Sincronizar el código sólo si cambió (mismo sello que run-turn.sh / followup-run.sh: comparten
# la carpeta). Los *.json van INCLUIDOS: ahí vive knowledge.json (los hechos editables).
STAMP="$(cat "$BOT_DIR"/*.mjs "$BOT_DIR"/*.json 2>/dev/null | md5sum | cut -c1-12)"
CURRENT="$(docker exec "$CONTAINER" cat "$DEST/.stamp" 2>/dev/null || true)"
if [ "$CURRENT" != "$STAMP" ]; then
  docker exec "$CONTAINER" rm -rf "$DEST" >/dev/null 2>&1
  if ! docker cp "$BOT_DIR" "$CONTAINER:$DEST" >/dev/null 2>&1; then
    echo '{"ok":false,"send":[],"error":"no se pudo copiar el bot al contenedor"}'
    exit 0
  fi
  docker exec "$CONTAINER" sh -c "printf '%s' '$STAMP' > $DEST/.stamp" >/dev/null 2>&1
fi

# Si quien llama no fijó el instante, se sella acá y viaja como parámetro explícito.
NOW_ARGS=()
case " $* " in
  *" --now "*|*" --now="*) ;;
  *) NOW_ARGS=(--now "$(date -u +%Y-%m-%dT%H:%M:%SZ)") ;;
esac

docker exec \
  -e ONIA_BOT_DRY_RUN="${ONIA_BOT_DRY_RUN:-true}" \
  -e CALCOM_PUBLIC_URL="${CALCOM_PUBLIC_URL:-https://cal.onia.com.bo}" \
  "$CONTAINER" node "$DEST/reminder-run.mjs" ${NOW_ARGS[@]+"${NOW_ARGS[@]}"} "$@"

exit 0
