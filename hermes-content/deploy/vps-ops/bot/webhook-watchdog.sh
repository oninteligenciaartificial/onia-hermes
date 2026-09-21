#!/usr/bin/env bash
# ONIA — WATCHDOG del servidor de webhook del chatbot.
#
# EL PROBLEMA QUE RESUELVE: `webhook-server.sh start` arranca el proceso con `docker exec -d`.
# Eso lo cuelga del contenedor `onia-center`, NO de un supervisor. Si el contenedor reinicia
# (deploy, reboot del VPS, OOM), el proceso se va y NADIE lo vuelve a levantar: Chatwoot sigue
# mandando webhooks a un puerto muerto y el bot deja de contestarle a prospectos reales, en
# silencio y sin que nadie se entere.
#
# Corre por cron cada 2 minutos. Es idempotente: si /health responde, no hace nada.
#
#   */2 * * * * /opt/onia/bot/webhook-watchdog.sh >> /var/log/onia-bot-watchdog.log 2>&1
#
# Deliberadamente tonto: no reintenta en loop ni escala. Si el contenedor no existe, avisa y
# sale — que se caiga el contenedor es un problema distinto y lo cubre Easypanel.
set -uo pipefail

CONTAINER="${ONIA_BOT_CONTAINER:-onia-center}"
PORT="${ONIA_WEBHOOK_PORT:-3020}"
BOT_DIR="/opt/onia/bot"
STAMP="$(date -Iseconds)"

log() { echo "[$STAMP] $*"; }

# --- Telegram: SOLO errores (decision Sergio 2026-08-28) ---------------------
# Un aviso de caida + uno de recuperacion. El marcador evita 30 mensajes/hora
# mientras dure la caida (el cron corre cada 2 min).
#
# CORREGIDO 2026-09-21. Aca decia "un incidente = UN aviso" a secas, y ese "UN" costo dos
# dias de bot mudo (19-sep 19:00 UTC -> 21-sep 19:34). El aviso se mando bien: UNA vez, un
# viernes a las 19:00, a un Telegram donde Sergio Urcullo ya tiene decenas de tareas abiertas.
# Despues el watchdog se callo 1.440 ciclos seguidos mientras el bot seguia muerto, porque el
# mismo marcador que evita el spam evitaba tambien el segundo aviso, para siempre.
#
# Lo que NO se hace: repetir cada 2 minutos — eso lo silencia igual, pero peor.
# Lo que se hace: ESCALAR. Se re-avisa a los 15 min, 1 h, 6 h y despues una vez por dia, y
# cada aviso dice hace cuanto esta caido. Una caida de 5 minutos sigue costando UN mensaje.
ALERT_ENV="/root/.config/onia/backup.env"
INCIDENTE="/var/lib/onia-bot-watchdog.incidente"
tg_error() {
  [ -f "$ALERT_ENV" ] && . "$ALERT_ENV"
  [ -n "${TG_BOT_TOKEN:-}" ] && [ -n "${TG_CHAT_ID:-}" ] || return 0
  curl -sf -m 20 -X POST "https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage"     -d chat_id="${TG_CHAT_ID}" -d parse_mode=HTML --data-urlencode text="$1" >/dev/null || true
}

# Hitos de re-aviso, en segundos. El 0 es el aviso inmediato; pasado el dia, uno por dia.
hito_alcanzado() {
  s="$1"
  if   [ "$s" -ge 86400 ]; then echo $(( (s / 86400) * 86400 ))
  elif [ "$s" -ge 21600 ]; then echo 21600
  elif [ "$s" -ge 3600 ];  then echo 3600
  elif [ "$s" -ge 900 ];   then echo 900
  else echo 0
  fi
}

duracion_humana() {
  s="$1"
  if   [ "$s" -ge 86400 ]; then echo "$(( s / 86400 ))d $(( (s % 86400) / 3600 ))h"
  elif [ "$s" -ge 3600 ];  then echo "$(( s / 3600 ))h $(( (s % 3600) / 60 ))min"
  else echo "$(( s / 60 )) min"
  fi
}

# El marcador guarda "<epoch de inicio> <ultimo hito avisado>". Un marcador del formato viejo
# (el `touch` vacio) se lee como inicio=ahora: se pierde la antiguedad real una sola vez, nunca
# el aviso. Las funciones son POSIX sh a proposito, igual que el resto del script.
avisar_caida() {  # $1 = texto, sin el sufijo de duracion
  ahora="$(date +%s)"; inicio=""; ultimo=""
  [ -f "$INCIDENTE" ] && read -r inicio ultimo < "$INCIDENTE" 2>/dev/null
  case "${inicio:-}" in ''|*[!0-9]*) inicio="$ahora"; ultimo="" ;; esac
  edad=$(( ahora - inicio ))
  hito="$(hito_alcanzado "$edad")"
  printf '%s %s\n' "$inicio" "$hito" > "$INCIDENTE"
  [ "$hito" = "${ultimo:-}" ] && return 0   # este hito ya se aviso: callar hasta el proximo
  if [ "$edad" -lt 60 ]; then
    tg_error "$1"
  else
    tg_error "$1

Caido hace <b>$(duracion_humana "$edad")</b> y el watchdog no puede solo."
  fi
}

avisar_recuperacion() {  # $1 = texto
  [ -f "$INCIDENTE" ] || return 0
  ahora="$(date +%s)"; inicio=""
  read -r inicio _ < "$INCIDENTE" 2>/dev/null
  rm -f "$INCIDENTE"
  case "${inicio:-}" in ''|*[!0-9]*) tg_error "$1"; return 0 ;; esac
  tg_error "$1 Estuvo caido $(duracion_humana $(( ahora - inicio )))."
}

# 1. ¿Existe el contenedor? Sin el, no hay nada que levantar.
if ! docker ps --format '{{.Names}}' | grep -qx "$CONTAINER"; then
  log "AVISO: el contenedor $CONTAINER no esta corriendo — el watchdog no puede hacer nada"
  exit 0
fi


# 1.5. La excepcion de firewall que el bot necesita para su base (PostgREST escucha en 3000
# y ONIA-BLOCK-3000 en DOCKER-USER corta contenedor<->contenedor). Se perdio en el reinicio
# del 2026-08-24 y el bot quedo 4 dias sin base. Idempotente: si la regla esta, no hace nada.
# ponytail: se re-inserta aca cada 2 min porque el que re-aplica los DROP tras un reinicio
# sigue sin identificarse; si algun dia se encuentra, mover la excepcion a ese mismo lugar.
if ! iptables -C DOCKER-USER -s 172.16.0.0/12 -d 172.16.0.0/12 -p tcp -m conntrack --ctorigdstport 3000 -m comment --comment ONIA-ALLOW-3000-INTERNO -j RETURN 2>/dev/null; then
  iptables -I DOCKER-USER 1 -s 172.16.0.0/12 -d 172.16.0.0/12 -p tcp -m conntrack --ctorigdstport 3000 -m comment --comment ONIA-ALLOW-3000-INTERNO -j RETURN     && log "firewall: re-inserte ONIA-ALLOW-3000-INTERNO (se habia perdido)"
fi

# 2. ¿Contesta /health? Es la unica prueba que vale: el PID puede existir y el puerto estar mudo.
if docker exec "$CONTAINER" sh -c "wget -qO- --timeout=5 http://127.0.0.1:$PORT/health" >/dev/null 2>&1; then
  avisar_recuperacion "✅ <b>Bot Onia recuperado</b> — el webhook volvio a responder."
  # 2.b. El /health NO ve el camino bot->Chatwoot (la base va por otro puerto): el 2026-08-28
  # el bot estuvo 4 dias calculando respuestas que Chatwoot nunca recibio (attachment overlay
  # rancio tras el reboot). Chequeo directo; fix manual documentado en el handoff del carril:
  # docker network disconnect easypanel onia-center && docker network connect --alias onia-center easypanel onia-center
  INCIDENTE_CW="/var/lib/onia-bot-watchdog.incidente-chatwoot"
  if docker exec "$CONTAINER" sh -c "timeout 5 wget -qO- http://onia-chatbot_chatwoot:3000/ >/dev/null 2>&1"; then
    if [ -f "$INCIDENTE_CW" ]; then
      rm -f "$INCIDENTE_CW"
      tg_error "✅ <b>Bot Onia</b> — el camino a Chatwoot volvio: las respuestas salen de nuevo."
    fi
  else
    log "ERROR: el bot NO llega a Chatwoot (respuestas mudas aunque /health este ok)"
    if [ ! -f "$INCIDENTE_CW" ]; then
      touch "$INCIDENTE_CW"
      tg_error "🚨 <b>Bot Onia MUDO</b> — el proceso vive pero NO llega a Chatwoot: calcula respuestas que nadie recibe. Fix: reconectar onia-center a la red easypanel (comando en el watchdog y en el handoff del carril chatbot)."
    fi
  fi
  exit 0
fi

# 3. No contesta: levantarlo.
log "el webhook NO responde en :$PORT — reiniciando"
if [ ! -x "$BOT_DIR/webhook-server.sh" ]; then
  log "ERROR: falta $BOT_DIR/webhook-server.sh"
  exit 1
fi

"$BOT_DIR/webhook-server.sh" restart >/dev/null 2>&1

# 3.bis "No responde" y "no arranca" son fallas distintas y hasta hoy se trataban igual.
#
# Del 19 al 21-sep el arbol del bot dentro del contenedor quedo anidado un nivel de mas
# (/tmp/onia-bot/bot/) y el arranque moria con MODULE_NOT_FOUND. Reiniciar no devuelve un archivo
# que no esta, asi que este watchdog corrio el MISMO arranque roto 1.440 veces. Peor: el `.stamp`
# marcaba el arbol como sincronizado, asi que ningun sync posterior iba a re-copiarlo tampoco.
#
# La causa se arreglo en los 8 scripts que sincronizan (mkdir -p + `docker cp origen/.`), pero
# el watchdog necesita saber salir de un arbol roto por CUALQUIER motivo: borrar $DEST deja el
# stamp inservible y el proximo `restart` re-copia todo de cero. Es idempotente y barato.
if ! docker exec "$CONTAINER" sh -c "wget -qO- --timeout=5 http://127.0.0.1:$PORT/health" >/dev/null 2>&1; then
  ARRANQUE="$(docker exec "$CONTAINER" sh -c "tail -n 40 /tmp/onia-bot-webhook.log 2>/dev/null" 2>/dev/null || true)"
  if printf '%s' "$ARRANQUE" | grep -qE "MODULE_NOT_FOUND|Cannot find module|no such file or directory"; then
    log "el arbol del bot en el contenedor esta roto (falta un modulo) — forzando re-sync limpio"
    docker exec "$CONTAINER" rm -rf /tmp/onia-bot >/dev/null 2>&1
    "$BOT_DIR/webhook-server.sh" restart >/dev/null 2>&1
  fi
fi

# 4. Confirmar que el reinicio sirvio (si no, el log tiene que gritarlo).
sleep 3
if docker exec "$CONTAINER" sh -c "wget -qO- --timeout=5 http://127.0.0.1:$PORT/health" >/dev/null 2>&1; then
  log "OK: webhook de vuelta arriba"
  avisar_recuperacion "✅ <b>Bot Onia recuperado</b> — el watchdog lo levanto y responde de nuevo."
else
  log "ERROR: el webhook sigue caido despues del reinicio — mirar ./webhook-server.sh logs"
  avisar_caida "🚨 <b>Bot Onia CAIDO</b> — el webhook no responde en :$PORT y el watchdog NO pudo levantarlo. El chatbot (widget + WhatsApp) esta mudo hasta que alguien mire. Log: /var/log/onia-bot-watchdog.log"
fi
