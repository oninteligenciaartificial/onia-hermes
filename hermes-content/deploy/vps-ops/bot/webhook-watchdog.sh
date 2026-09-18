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
BOT_DIR="${ONIA_BOT_DIR:-/opt/onia/bot}"
STAMP="$(date -Iseconds)"

log() { echo "[$STAMP] $*"; }

# --- Telegram: SOLO errores (decision Sergio 2026-08-28) ---------------------
# Un incidente = UN aviso de caida + UN aviso de recuperacion. El marcador evita
# 30 mensajes/hora mientras dure la caida (el cron corre cada 2 min).
ALERT_ENV="${ONIA_WATCHDOG_ALERT_ENV:-/root/.config/onia/backup.env}"
# Prefijo de los marcadores de estado. Inyectable SOLO para poder ejecutar este
# script de verdad en un test (ver webhook-watchdog.test.mjs); el default es el
# de produccion y no cambia, asi que un incidente ya declarado se sigue
# reconociendo despues de este cambio.
ESTADO="${ONIA_WATCHDOG_ESTADO:-/var/lib/onia-bot-watchdog}"
INCIDENTE="$ESTADO.incidente"
tg_error() {
  [ -f "$ALERT_ENV" ] && . "$ALERT_ENV"
  [ -n "${TG_BOT_TOKEN:-}" ] && [ -n "${TG_CHAT_ID:-}" ] || return 0
  curl -sf -m 20 -X POST "https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage"     -d chat_id="${TG_CHAT_ID}" -d parse_mode=HTML --data-urlencode text="$1" >/dev/null || true
}

# 1. ¿Existe el contenedor? Sin el no hay nada que levantar — y el bot esta 100% mudo, en el
# widget Y en WhatsApp. Hasta el 2026-09-18 esta rama solo escribia el log y salia 0 (que para
# el cron es exito), asi que el dano MAYOR era el unico que no le llegaba a nadie, mientras el
# webhook caido con el contenedor vivo si disparaba la alarma 🚨.
#
# Strike de una corrida, mismo criterio que el camino a Chatwoot: durante un reinicio de docker
# el contenedor desaparece unos segundos y eso no es un incidente.
INCIDENTE_CONT="$ESTADO.incidente-contenedor"
STRIKE_CONT="$ESTADO.strike-contenedor"
if ! docker ps --format '{{.Names}}' | grep -qx "$CONTAINER"; then
  if [ ! -f "$STRIKE_CONT" ] && [ ! -f "$INCIDENTE_CONT" ]; then
    touch "$STRIKE_CONT"
    log "AVISO: no veo el contenedor $CONTAINER — espero la corrida siguiente antes de declarar el incidente"
  else
    log "ERROR: el contenedor $CONTAINER no esta corriendo — el bot esta mudo y no hay que levantar"
    if [ ! -f "$INCIDENTE_CONT" ]; then
      touch "$INCIDENTE_CONT"
      tg_error "🚨 <b>Bot Onia SIN CONTENEDOR</b> — $CONTAINER no esta corriendo: el chatbot esta mudo en el widget Y en WhatsApp, y el watchdog no tiene nada que levantar. Hay que arrancarlo a mano. Log: /var/log/onia-bot-watchdog.log"
    fi
  fi
  exit 0
fi
# El strike no se acumula entre parpadeos lejanos: un exito lo borra.
rm -f "$STRIKE_CONT"
if [ -f "$INCIDENTE_CONT" ]; then
  rm -f "$INCIDENTE_CONT"
  log "OK: el contenedor $CONTAINER volvio a estar corriendo"
  tg_error "✅ <b>Bot Onia</b> — el contenedor $CONTAINER volvio: el chatbot puede recibir mensajes de nuevo."
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
  if [ -f "$INCIDENTE" ]; then
    rm -f "$INCIDENTE"
    log "OK: el webhook volvio a responder solo — incidente cerrado"
    tg_error "✅ <b>Bot Onia recuperado</b> — el webhook volvio a responder."
  fi
  # 2.b. El /health NO ve el camino bot->Chatwoot (la base va por otro puerto): el 2026-08-28
  # el bot estuvo 4 dias calculando respuestas que Chatwoot nunca recibio (attachment overlay
  # rancio tras el reboot). Chequeo directo; fix manual documentado en el handoff del carril:
  # docker network disconnect easypanel onia-center && docker network connect --alias onia-center easypanel onia-center
  #
  # DOS CORRIDAS, NO UNA (2026-09-17). Esta sonda es un unico `timeout 5` y el que la
  # falla dispara la alarma 🚨 maxima. Medido en el log de produccion: los tres ERROR de
  # los ultimos 15 dias (03-sep, 05-sep, 17-sep) son de UNA linea cada uno — con el cron
  # cada 2 min, una caida de verdad escribe una linea cada 2 min. O sea, tres parpadeos,
  # seis mensajes al Telegram de Sergio Urcullo y cero incidentes. Un strike de una
  # corrida cuesta 2 minutos de deteccion sobre una caida que ya duro 4 dias, y le saca
  # los falsos positivos al unico canal por el que avisamos algo grave.
  INCIDENTE_CW="$ESTADO.incidente-chatwoot"
  STRIKE_CW="$ESTADO.strike-chatwoot"
  if docker exec "$CONTAINER" sh -c "timeout 5 wget -qO- http://onia-chatbot_chatwoot:3000/ >/dev/null 2>&1"; then
    # El strike no se acumula entre parpadeos lejanos: un exito lo borra.
    rm -f "$STRIKE_CW"
    if [ -f "$INCIDENTE_CW" ]; then
      rm -f "$INCIDENTE_CW"
      log "OK: el camino a Chatwoot volvio — las respuestas salen de nuevo"
      tg_error "✅ <b>Bot Onia</b> — el camino a Chatwoot volvio: las respuestas salen de nuevo."
    fi
  elif [ ! -f "$STRIKE_CW" ] && [ ! -f "$INCIDENTE_CW" ]; then
    touch "$STRIKE_CW"
    log "AVISO: una sonda al camino a Chatwoot fallo — espero la corrida siguiente antes de declarar el incidente"
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
# Se llega aca con el webhook YA caido, asi que rendirse en silencio deja al bot mudo sin que
# nadie se entere. El 2026-09-18 el deploy de las 03:47 UTC dejo en 644 a reminder-run.sh,
# postdemo-run.sh y a este mismo watchdog: el mismo accidente sobre webhook-server.sh cae justo
# en esta rama. Por eso el aviso nombra la causa probable, que es la que se arregla en 5 s.
if [ ! -x "$BOT_DIR/webhook-server.sh" ]; then
  log "ERROR: no puedo ejecutar $BOT_DIR/webhook-server.sh (falta, o viajo sin el bit de ejecucion)"
  if [ ! -f "$INCIDENTE" ]; then
    touch "$INCIDENTE"
    tg_error "🚨 <b>Bot Onia CAIDO</b> — el webhook no responde y el watchdog NO puede levantarlo: $BOT_DIR/webhook-server.sh no se puede ejecutar (suele ser un deploy que lo dejo en 644). El chatbot esta mudo hasta que alguien mire."
  fi
  exit 1
fi

"$BOT_DIR/webhook-server.sh" restart >/dev/null 2>&1

# 4. Confirmar que el reinicio sirvio (si no, el log tiene que gritarlo).
sleep 3
if docker exec "$CONTAINER" sh -c "wget -qO- --timeout=5 http://127.0.0.1:$PORT/health" >/dev/null 2>&1; then
  log "OK: webhook de vuelta arriba"
  if [ -f "$INCIDENTE" ]; then
    rm -f "$INCIDENTE"
    log "OK: incidente cerrado — el watchdog lo levanto"
    tg_error "✅ <b>Bot Onia recuperado</b> — el watchdog lo levanto y responde de nuevo."
  fi
else
  log "ERROR: el webhook sigue caido despues del reinicio — mirar ./webhook-server.sh logs"
  if [ ! -f "$INCIDENTE" ]; then
    touch "$INCIDENTE"
    tg_error "🚨 <b>Bot Onia CAIDO</b> — el webhook no responde en :3020 y el watchdog NO pudo levantarlo. El chatbot (widget + WhatsApp) esta mudo hasta que alguien mire. Log: /var/log/onia-bot-watchdog.log"
  fi
fi
