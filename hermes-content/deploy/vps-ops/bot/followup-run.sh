#!/usr/bin/env bash
# ONIA — corre el BARRIDO DE FOLLOW-UP (M3) del chatbot propio DENTRO del contenedor onia-center
# (que tiene las credenciales de Supabase onia_center). Llamado por n8n vía SSH, una vez por hora.
# Mismo patrón que run-turn.sh: se copia la carpeta al contenedor y se ejecuta por ruta.
#
# ENTRADA : no usa stdin. Todo va por argumentos.
# SALIDA  : dry-run -> texto legible · --emit / --json -> una línea JSON por STDOUT.
#           Exit 0 SIEMPRE: si esto falla con código != 0, n8n reintenta y el prospecto recibe
#           el follow-up dos veces (justo lo que el CAS existe para evitar).
#
# EL "AHORA" SE INYECTA: si no se pasa --now, este wrapper sella el instante con `date -u` y lo
# manda como parámetro. La lógica de followup-run.mjs nunca mira el reloj (determinismo).
#
# Uso local (ver a quién le mandaría, sin reservar ni escribir nada):
#   ./followup-run.sh
#
# n8n (nodo SSH, cron cada hora) — reserva con el CAS y devuelve el JSON a enviar:
#   bash /opt/onia/bot/followup-run.sh --emit
#
# Reproducir un barrido pasado (mismo resultado, siempre):
#   bash /opt/onia/bot/followup-run.sh --now 2026-07-28T14:05:00Z
#
# Env opcionales (se pasan al contenedor):
#   ONIA_BOT_DRY_RUN=false   → los mensajes se registran como 'sent' en vez de 'skipped'
#   ONIA_BOT_SLOTS="jue 31/07 15:00@2026-07-30T19:00:00Z|vie 01/08 10:00@2026-07-31T14:00:00Z"
set -uo pipefail

CONTAINER="${ONIA_BOT_CONTAINER:-onia-center}"
DEST="/tmp/onia-bot"

BOT_DIR="$(cd "$(dirname "$0")" 2>/dev/null && pwd)"
[ -f "$BOT_DIR/followup-run.mjs" ] || BOT_DIR="/opt/onia/bot"
if [ ! -f "$BOT_DIR/followup-run.mjs" ]; then
  echo '{"ok":false,"send":[],"error":"no se encontro followup-run.mjs (esperado en /opt/onia/bot)"}'
  exit 0
fi

# Sincronizar el código sólo si cambió (mismo sello que run-turn.sh: comparten la carpeta).
STAMP="$(cat "$BOT_DIR"/*.mjs 2>/dev/null | md5sum | cut -c1-12)"
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
  -e ONIA_BOT_SLOTS="${ONIA_BOT_SLOTS:-}" \
  "$CONTAINER" node "$DEST/followup-run.mjs" ${NOW_ARGS[@]+"${NOW_ARGS[@]}"} "$@"

exit 0
