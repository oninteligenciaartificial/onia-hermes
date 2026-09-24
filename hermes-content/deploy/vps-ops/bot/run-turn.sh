#!/usr/bin/env bash
# ONIA — corre UN TURNO del chatbot propio DENTRO del contenedor onia-center (que tiene las
# credenciales de Supabase onia_center y alcanza a LiteLLM por la red interna de docker).
# Llamado por n8n vía SSH. Mismo patrón que voice-transcribe-run.sh.
#
# POR QUÉ docker cp y no `node - < archivo.mjs` (patrón de sales-agent-run.sh): el bot son 6
# módulos ES que se importan entre sí; `node -` lee UN solo archivo por stdin y además nos
# comería el stdin, que acá lleva el JSON del turno. Se copia la carpeta y se ejecuta por ruta.
#
# ENTRADA : el JSON del turno por STDIN.
# SALIDA  : el JSON de respuesta por STDOUT (una línea). Exit 0 SIEMPRE: si esto falla con
#           código != 0, n8n reintenta y el prospecto recibe el mensaje dos veces.
#
# Uso local:
#   echo '{"channel":"telegram","contact_ref":"777","text":"DEMO","message_key":"telegram:1"}' \
#     | ./run-turn.sh
#
# n8n (nodo SSH, que NO tiene stdin): se pasa el turno en base64 por variable.
#   BOT_TURN_B64='<base64 del JSON>' bash /opt/onia/bot/run-turn.sh < /dev/null
#
# Env opcionales (se pasan al contenedor):
#   ONIA_BOT_DRY_RUN=false   → deja de marcar los envíos como 'skipped'
#   ONIA_BOT_SLOTS="jue 31/07 15:00@2026-07-30T19:00:00Z|vie 01/08 10:00@2026-07-31T14:00:00Z"
#   ONIA_BOT_MODEL=gpt-4o-mini
set -uo pipefail

CONTAINER="${ONIA_BOT_CONTAINER:-onia-center}"
DEST="/tmp/onia-bot"

BOT_DIR="$(cd "$(dirname "$0")" 2>/dev/null && pwd)"
[ -f "$BOT_DIR/run-turn.mjs" ] || BOT_DIR="/opt/onia/bot"
if [ ! -f "$BOT_DIR/run-turn.mjs" ]; then
  echo '{"ok":false,"send":[],"error":"no se encontro run-turn.mjs (esperado en /opt/onia/bot)"}'
  exit 0
fi

# Sincronizar el código sólo si cambió (evita 2 llamadas a docker por cada mensaje).
# Los *.json van INCLUIDOS: ahí vive knowledge.json (los hechos editables). Sin ellos en el
# stamp, editar el conocimiento no re-copiaba nada y el contenedor seguía con la copia vieja.
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

# LOS HORARIOS DE DEMO SE DERIVAN DE webhook.env, no del entorno del que llama. El cron invoca
# estos wrappers PELADOS, asi que `${ONIA_BOT_SLOTS:-}` viajaba VACIO y el barrido concluia
# "slots_sin_definir" con los cinco horarios vivos en el proceso del webhook. Es el mismo agujero
# que ONIA_BOT_DRY_RUN tuvo hasta el 2026-09-17, en el mismo archivo y tres lineas mas abajo: la
# cura no viajo al hermano. Ojo con el lector: el valor LLEVA ESPACIOS ("sabado 19 de septiembre,
# 14:00@..."), asi que el `tr -d "\"' \r"` que usa ONIA_BOT_DRY_RUN lo DESTROZARIA — aca solo se
# saca el CR y las comillas que envuelven.
if [ -z "${ONIA_BOT_SLOTS:-}" ] && [ -f "$BOT_DIR/webhook.env" ]; then
  ONIA_BOT_SLOTS="$(sed -n 's/^ONIA_BOT_SLOTS=//p' "$BOT_DIR/webhook.env" | head -n1 |
    sed -e 's/\r$//' -e 's/^"\(.*\)"$/\1/' -e "s/^'\(.*\)'$/\1/")"
fi

# La master key de LiteLLM se lee de su propio contenedor (nunca se hardcodea ni va por $env).
MK="$(docker exec onia_selfhosted-litellm-1 printenv LITELLM_MASTER_KEY 2>/dev/null || true)"

# STDIN del wrapper (JSON del turno) -> STDIN del proceso node dentro del contenedor.
docker exec \
  -e LITELLM_BASE="${LITELLM_BASE:-http://onia_selfhosted-litellm-1:4000/v1}" \
  -e LITELLM_KEY="$MK" \
  -e ONIA_BOT_MODEL="${ONIA_BOT_MODEL:-gpt-4o-mini}" \
  -e ONIA_BOT_DRY_RUN="${ONIA_BOT_DRY_RUN:-true}" \
  -e ONIA_BOT_SLOTS="${ONIA_BOT_SLOTS:-}" \
  -e BOT_TURN_B64="${BOT_TURN_B64:-}" \
  -i "$CONTAINER" node "$DEST/run-turn.mjs"

exit 0
