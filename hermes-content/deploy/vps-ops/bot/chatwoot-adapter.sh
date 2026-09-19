#!/usr/bin/env bash
# ONIA — corre el ADAPTADOR DE CHATWOOT dentro del contenedor onia-center (mismo patron que
# run-turn.sh: el contenedor ya tiene las credenciales de Supabase onia_center y alcanza a
# LiteLLM/Cal.com/Chatwoot por la red interna de docker "easypanel").
#
# Llamado por n8n vía SSH, con el webhook CRUDO de Chatwoot por STDIN.
#
# ENTRADA : el JSON del webhook de Chatwoot por STDIN (una linea o pretty, da igual).
# SALIDA  : el JSON de chatwoot-adapter.mjs por STDOUT (una linea). Exit 0 SIEMPRE: si esto
#           falla con codigo != 0, n8n reintenta y Chatwoot puede reintentar el webhook tambien
#           -> dos intentos != un mensaje doble gracias al dedup de run-turn.mjs, pero igual no
#           conviene reventar el proceso.
#
# Uso local:
#   echo '{"event":"message_created","id":13,"content":"DEMO","message_type":"incoming", ...}' \
#     | ./chatwoot-adapter.sh
#
# n8n (nodo SSH, que NO tiene stdin): el webhook crudo viaja en base64 por variable, igual que
# BOT_TURN_B64 en run-turn.sh — ver N8N_WORKFLOW.md (seccion Chatwoot).
#   CHATWOOT_WEBHOOK_B64='<base64 del body del webhook>' bash /opt/onia/bot/chatwoot-adapter.sh < /dev/null
#
# Secretos: el token de la API de Chatwoot se lee de SU PROPIA base (nunca hardcodeado, nunca
# en $env de n8n) — mismo patron que la master key de LiteLLM en run-turn.sh.
set -uo pipefail

CONTAINER="${ONIA_BOT_CONTAINER:-onia-center}"
DEST="/tmp/onia-bot"

BOT_DIR="$(cd "$(dirname "$0")" 2>/dev/null && pwd)"
[ -f "$BOT_DIR/chatwoot-adapter.mjs" ] || BOT_DIR="/opt/onia/bot"
if [ ! -f "$BOT_DIR/chatwoot-adapter.mjs" ]; then
  echo '{"ok":false,"skipped":false,"duplicate":false,"sent":[],"error":"no se encontro chatwoot-adapter.mjs (esperado en /opt/onia/bot)"}'
  exit 0
fi

# Sincronizar el codigo solo si cambio (mismo stamp que usa run-turn.sh: comparten carpeta).
# Los *.json van INCLUIDOS: ahi vive knowledge.json (los hechos editables). Sin ellos en el
# stamp, editar el conocimiento no re-copiaba nada y el contenedor seguia con la copia vieja.
STAMP="$(cat "$BOT_DIR"/*.mjs "$BOT_DIR"/*.json 2>/dev/null | md5sum | cut -c1-12)"
CURRENT="$(docker exec "$CONTAINER" cat "$DEST/.stamp" 2>/dev/null || true)"
if [ "$CURRENT" != "$STAMP" ]; then
  docker exec "$CONTAINER" rm -rf "$DEST" >/dev/null 2>&1
  if ! docker cp "$BOT_DIR" "$CONTAINER:$DEST" >/dev/null 2>&1; then
    echo '{"ok":false,"skipped":false,"duplicate":false,"sent":[],"error":"no se pudo copiar el bot al contenedor"}'
    exit 0
  fi
  docker exec "$CONTAINER" sh -c "printf '%s' '$STAMP' > $DEST/.stamp" >/dev/null 2>&1
fi

# La master key de LiteLLM se lee de su propio contenedor (nunca se hardcodea ni va por $env).
MK="$(docker exec onia_selfhosted-litellm-1 printenv LITELLM_MASTER_KEY 2>/dev/null || true)"

# El token de la API de Chatwoot se lee de SU PROPIA base en cada corrida: owner_id=2 es la
# cuenta 2 / user_id=2 (Sergio). Si el token rota (se re-genera desde la UI de Chatwoot), esto
# lo levanta solo, sin tocar n8n ni ningun archivo.
CWDB="$(docker ps -qf name=onia-chatbot_chatwoot-db | head -n1)"
# El bot postea con SU PROPIA identidad de Chatwoot (agente "Onia Bot"), no con la de Sergio:
# es lo unico que permite saber quien escribio y callar al bot cuando el toma la conversacion.
# LA IDENTIDAD TAMBIEN SE DERIVA DE webhook.env, no del entorno del que llama: misma clase que
# ONIA_BOT_DRY_RUN y ONIA_BOT_SLOTS, en este mismo archivo. El cron invoca este wrapper PELADO, y
# el default caia al 2, que NO es neutro: es `OnIA`, la cuenta HUMANA de Sergio Urcullo.
if [ -z "${CHATWOOT_BOT_AGENT_ID:-}" ] && [ -f "$BOT_DIR/webhook.env" ]; then
  CHATWOOT_BOT_AGENT_ID="$(sed -n 's/^CHATWOOT_BOT_AGENT_ID=//p' "$BOT_DIR/webhook.env" | head -n1 | tr -d "\"' \r")"
fi
# Sin fuente NO se inventa una identidad: sin agente no se busca token y el barrido no manda. Ese
# es el fallo BARATO. Postear como una persona es el caro y NO se puede deshacer: el adapter lo lee
# como "lo escribio un humano", prende human_takeover y el bot queda mudo para ese prospecto para
# siempre (medido el 2026-09-18 en la conversacion 58, un desconocido real: el M3 salio como User 2
# mientras el webhook corre con el 3). El comentario que estaba aca decia "nunca queda sin token"
# como si fuera una virtud — conseguir el token de una persona era exactamente el defecto.
CW_AGENT_ID="${CHATWOOT_BOT_AGENT_ID:-}"
CW_TOKEN=""
if [ -n "$CWDB" ] && [ -n "$CW_AGENT_ID" ]; then
  CW_TOKEN="$(docker exec "$CWDB" psql -U postgres -d 'onia-chatbot' -tAc \
    "select token from access_tokens where owner_id=$CW_AGENT_ID order by created_at desc limit 1" 2>/dev/null | tr -d ' \t\n' || true)"
fi

# LOS HORARIOS DE DEMO SE DERIVAN DE webhook.env, no del entorno del que llama. El cron invoca
# estos wrappers PELADOS, asi que `${ONIA_BOT_SLOTS:-}` viajaba VACIO y el barrido concluia
# "slots_sin_definir" con los cinco horarios vivos en el proceso del webhook. Es el mismo agujero
# que ONIA_BOT_DRY_RUN tuvo hasta el 2026-09-17, en el mismo archivo y unas lineas mas arriba: la
# cura no viajo al hermano. Ojo con el lector: el valor LLEVA ESPACIOS ("sabado 19 de septiembre,
# 14:00@..."), asi que el `tr -d "\"' \r"` que usa ONIA_BOT_DRY_RUN lo DESTROZARIA — aca solo se
# saca el CR y las comillas que envuelven.
if [ -z "${ONIA_BOT_SLOTS:-}" ] && [ -f "$BOT_DIR/webhook.env" ]; then
  ONIA_BOT_SLOTS="$(sed -n 's/^ONIA_BOT_SLOTS=//p' "$BOT_DIR/webhook.env" | head -n1 |
    sed -e 's/\r$//' -e 's/^"\(.*\)"$/\1/' -e "s/^'\(.*\)'$/\1/")"
fi

# STDIN del wrapper (webhook de Chatwoot) -> STDIN del proceso node dentro del contenedor.
docker exec \
  -e LITELLM_BASE="${LITELLM_BASE:-http://onia_selfhosted-litellm-1:4000/v1}" \
  -e LITELLM_KEY="$MK" \
  -e ONIA_BOT_MODEL="${ONIA_BOT_MODEL:-gpt-4o-mini}" \
  -e ONIA_BOT_DRY_RUN="${ONIA_BOT_DRY_RUN:-true}" \
  -e ONIA_BOT_SLOTS="${ONIA_BOT_SLOTS:-}" \
  -e CALCOM_BASE_URL="${CALCOM_BASE_URL:-http://calcom:3000}" \
  -e CALCOM_EVENT_TYPE_SLUG="${CALCOM_EVENT_TYPE_SLUG:-demo-onia}" \
  -e CALCOM_USERNAME="${CALCOM_USERNAME:-onia}" \
  -e ONIA_AUDIO_ENABLED="${ONIA_AUDIO_ENABLED:-true}" \
  -e ONIA_AUDIO_STT_BASE_URL="${ONIA_AUDIO_STT_BASE_URL:-http://speaches:8000/v1}" \
  -e ONIA_AUDIO_STT_MODEL="${ONIA_AUDIO_STT_MODEL:-Systran/faster-whisper-small}" \
  -e ONIA_AUDIO_STT_LANGUAGE="${ONIA_AUDIO_STT_LANGUAGE:-es}" \
  -e CHATWOOT_BASE_URL="${CHATWOOT_BASE_URL:-http://onia-chatbot_chatwoot:3000}" \
  -e CHATWOOT_ACCOUNT_ID="${CHATWOOT_ACCOUNT_ID:-2}" \
  -e CHATWOOT_API_TOKEN="$CW_TOKEN" \
  -e CHATWOOT_BOT_AGENT_ID="$CW_AGENT_ID" \
  -e CHATWOOT_WEBHOOK_B64="${CHATWOOT_WEBHOOK_B64:-}" \
  -i "$CONTAINER" node "$DEST/chatwoot-adapter.mjs"

exit 0
