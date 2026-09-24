#!/usr/bin/env bash
# ONIA — corre el BARRIDO DE INSISTENCIA v6.6 (recepcionista multi-org, encendida por defecto) DENTRO del contenedor onia-center
# (que tiene las credenciales de Supabase onia_center). Llamado por n8n vía SSH, una vez por hora.
# Mismo patrón que run-turn.sh: se copia la carpeta al contenedor y se ejecuta por ruta.
#
# ENTRADA : no usa stdin. Todo va por argumentos.
# SALIDA  : dry-run -> texto legible · --emit / --json -> una línea JSON por STDOUT.
#           Exit 0 SIEMPRE: si esto falla con código != 0, n8n reintenta y el prospecto recibe
#           el follow-up dos veces (justo lo que el CAS existe para evitar).
#
# EL "AHORA" SE INYECTA: si no se pasa --now, este wrapper sella el instante con `date -u` y lo
# manda como parámetro. La lógica de insistencia-run.mjs nunca mira el reloj (determinismo).
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
[ -f "$BOT_DIR/insistencia-run.mjs" ] || BOT_DIR="/opt/onia/bot"
if [ ! -f "$BOT_DIR/insistencia-run.mjs" ]; then
  echo '{"ok":false,"send":[],"error":"no se encontro insistencia-run.mjs (esperado en /opt/onia/bot)"}'
  exit 0
fi

# Sincronizar el código sólo si cambió (mismo sello que run-turn.sh: comparten la carpeta).
# Los *.json van INCLUIDOS: ahí vive knowledge.json (los hechos editables). Sin ellos en el
# sello, editar el conocimiento no re-copiaba nada y el contenedor seguía con la copia vieja.
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

# Si quien llama no fijó el instante, se sella acá y viaja como parámetro explícito.
NOW_ARGS=()
case " $* " in
  *" --now "*|*" --now="*) ;;
  *) NOW_ARGS=(--now "$(date -u +%Y-%m-%dT%H:%M:%SZ)") ;;
esac

# El interruptor de "manda de verdad" vive en UN SOLO lugar: webhook.env, el mismo archivo que ya
# lee el webhook. Antes el default de aca era `true`, asi que un cron que llamara al barrido sin
# exportar la variable barria, reportaba y NO mandaba nada: encendido en apariencia, apagado de
# hecho — y sin ningun error que lo delatara. Quien llama puede seguir forzando el valor (tiene
# prioridad); esto solo cubre el olvido. Si no hay archivo, sigue cayendo a dry-run, que es el
# default seguro: preferimos no mandar por accidente a mandar por accidente.
# Las credenciales del conocimiento por org y de la base salen de webhook.env si el
# caller no las trae (mismo criterio que ONIA_BOT_DRY_RUN: cubrir el olvido).
for VAR in ONIA_BOT_KNOWLEDGE_URL BOT_KNOWLEDGE_SECRET SUPABASE_URL SUPABASE_SERVICE_ROLE_KEY; do
  VAL="$(printenv "$VAR" 2>/dev/null || true)"
  if [ -z "$VAL" ] && [ -f "$BOT_DIR/webhook.env" ]; then
    LEIDO="$(sed -n "s/^$VAR=//p" "$BOT_DIR/webhook.env" | head -n1 | tr -d "\"\' \r")"
    [ -n "$LEIDO" ] && export "$VAR=$LEIDO"
  fi
done
if [ -z "${ONIA_BOT_DRY_RUN:-}" ] && [ -f "$BOT_DIR/webhook.env" ]; then
  ONIA_BOT_DRY_RUN="$(sed -n 's/^ONIA_BOT_DRY_RUN=//p' "$BOT_DIR/webhook.env" | head -n1 | tr -d "\"' \r")"
fi

# EL MODO SE DERIVA DE ESE INTERRUPTOR, no del argumento que el llamador se acuerde de escribir.
# Este barrido es el UNICO de los cuatro que hoy manda de verdad, y no por merito propio: su linea
# de cron trae el `--emit` escrito a mano. Esa diferencia vive fuera de git, asi que el dia que
# alguien reescriba el cron el barrido se apaga mudo, como sus tres hermanos. La historia completa
# esta en followup-run.sh. Quien llama sigue mandando.
EMIT_ARGS=()
case " $* " in
  *" --emit "*|*" --dry-run "*|*" --json "*) ;;
  *)
    if [ "${ONIA_BOT_DRY_RUN:-true}" = "false" ]; then EMIT_ARGS=(--emit); fi
    ;;
esac

# Token de Chatwoot — el barrido MANDA el mensaje, no solo lo reserva. Sale de la base de Chatwoot
# igual que en webhook-server.sh: nunca se escribe en un archivo ni viaja a n8n.
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

docker exec \
  -e ONIA_BOT_DRY_RUN="${ONIA_BOT_DRY_RUN:-true}" \
  -e ONIA_BOT_SLOTS="${ONIA_BOT_SLOTS:-}" \
  -e CHATWOOT_BASE_URL="${CHATWOOT_BASE_URL:-http://onia-chatbot_chatwoot:3000}" \
  -e CHATWOOT_ACCOUNT_ID="${CHATWOOT_ACCOUNT_ID:-2}" \
  -e CHATWOOT_API_TOKEN="$CW_TOKEN" \
  -e CHATWOOT_BOT_AGENT_ID="$CW_AGENT_ID" \
  -e ONIA_BOT_KNOWLEDGE_URL="${ONIA_BOT_KNOWLEDGE_URL:-http://onia-platform:3000/api/chatbot-knowledge/published}" \
  -e BOT_KNOWLEDGE_SECRET="${BOT_KNOWLEDGE_SECRET:-}" \
  -e SUPABASE_URL="${SUPABASE_URL:-}" \
  -e SUPABASE_SERVICE_ROLE_KEY="${SUPABASE_SERVICE_ROLE_KEY:-}" \
  "$CONTAINER" node "$DEST/insistencia-run.mjs" ${NOW_ARGS[@]+"${NOW_ARGS[@]}"} ${EMIT_ARGS[@]+"${EMIT_ARGS[@]}"} "$@"

exit 0
