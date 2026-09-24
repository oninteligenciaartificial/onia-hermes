#!/usr/bin/env bash
# ONIA — corre el MEDIDOR de mensajes salientes DENTRO del contenedor onia-center (que tiene las
# credenciales de Supabase onia_center). Mismo patrón que postdemo-run.sh: se copia la carpeta al
# contenedor y se ejecuta por ruta (comparten carpeta y sello).
#
# ENTRADA : no usa stdin. Todo va por argumentos.
# SALIDA  : texto legible · --json una línea JSON por STDOUT.
#           Exit 0 SIEMPRE: si esto falla con código != 0, n8n reintenta y ensucia la ejecución.
#
# SÓLO LEE. No manda mensajes, no reserva, no escribe: correrlo dos veces no cambia nada.
# No necesita token de Chatwoot ni URL de Cal.com.
#
# EL "AHORA" SE INYECTA: sin --month ni --now, este wrapper sella el instante con `date -u` y lo
# manda como parámetro. La lógica de usage-run.mjs nunca mira el reloj (determinismo).
#
# TIPO DE CAMBIO: por defecto 11,66 Bs/USD (BCB, 13-ago-2026). Se mueve — para pisarlo sin tocar
# código: ONIA_BOB_PER_USD=11.80 ./usage-run.sh
#
# Uso local (mes en curso):
#   ./usage-run.sh
#
# n8n (nodo SSH, cron el día 1 de cada mes) — consumo del mes que cerró, en JSON:
#   bash /opt/onia/bot/usage-run.sh --month 2026-10 --json
set -uo pipefail

CONTAINER="${ONIA_BOT_CONTAINER:-onia-center}"
DEST="/tmp/onia-bot"

BOT_DIR="$(cd "$(dirname "$0")" 2>/dev/null && pwd)"
[ -f "$BOT_DIR/usage-run.mjs" ] || BOT_DIR="/opt/onia/bot"
if [ ! -f "$BOT_DIR/usage-run.mjs" ]; then
  echo '{"ok":false,"clientes":[],"error":"no se encontro usage-run.mjs (esperado en /opt/onia/bot)"}'
  exit 0
fi

# Sincronizar el código sólo si cambió (mismo sello que run-turn.sh / followup-run.sh /
# reminder-run.sh / postdemo-run.sh: comparten la carpeta).
STAMP="$(cat "$BOT_DIR"/*.mjs "$BOT_DIR"/*.json 2>/dev/null | md5sum | cut -c1-12)"
CURRENT="$(docker exec "$CONTAINER" cat "$DEST/.stamp" 2>/dev/null || true)"
if [ "$CURRENT" != "$STAMP" ]; then
  # `mkdir -p` + `cp origen/.` en vez de `rm -rf` + `cp origen`: con el destino ya creado,
  # `docker cp origen destino` anida (/tmp/onia-bot/bot/) y mata el bot con MODULE_NOT_FOUND.
  # Pasa cuando dos de los 8 scripts que comparten este bloque sincronizan a la vez (los crons
  # se solapan con el restart del watchdog). El porque largo esta en webhook-server.sh.
  docker exec "$CONTAINER" mkdir -p "$DEST" >/dev/null 2>&1
  if ! docker cp "$BOT_DIR/." "$CONTAINER:$DEST" >/dev/null 2>&1; then
    echo '{"ok":false,"clientes":[],"error":"no se pudo copiar el bot al contenedor"}'
    exit 0
  fi
  docker exec "$CONTAINER" sh -c "printf '%s' '$STAMP' > $DEST/.stamp" >/dev/null 2>&1
fi

# Si quien llama no fijó ni el mes ni el instante, se sella acá y viaja como parámetro explícito.
NOW_ARGS=()
case " $* " in
  *" --month "*|*" --month="*|*" --now "*|*" --now="*) ;;
  *) NOW_ARGS=(--now "$(date -u +%Y-%m-%dT%H:%M:%SZ)") ;;
esac

docker exec \
  -e ONIA_BOB_PER_USD="${ONIA_BOB_PER_USD:-}" \
  "$CONTAINER" node "$DEST/usage-run.mjs" ${NOW_ARGS[@]+"${NOW_ARGS[@]}"} "$@"

exit 0
