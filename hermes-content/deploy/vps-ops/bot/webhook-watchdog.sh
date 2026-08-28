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
# Un incidente = UN aviso de caida + UN aviso de recuperacion. El marcador evita
# 30 mensajes/hora mientras dure la caida (el cron corre cada 2 min).
ALERT_ENV="/root/.config/onia/backup.env"
INCIDENTE="/var/lib/onia-bot-watchdog.incidente"
tg_error() {
  [ -f "$ALERT_ENV" ] && . "$ALERT_ENV"
  [ -n "${TG_BOT_TOKEN:-}" ] && [ -n "${TG_CHAT_ID:-}" ] || return 0
  curl -sf -m 20 -X POST "https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage"     -d chat_id="${TG_CHAT_ID}" -d parse_mode=HTML --data-urlencode text="$1" >/dev/null || true
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
  if [ -f "$INCIDENTE" ]; then
    rm -f "$INCIDENTE"
    tg_error "✅ <b>Bot Onia recuperado</b> — el webhook volvio a responder."
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

# 4. Confirmar que el reinicio sirvio (si no, el log tiene que gritarlo).
sleep 3
if docker exec "$CONTAINER" sh -c "wget -qO- --timeout=5 http://127.0.0.1:$PORT/health" >/dev/null 2>&1; then
  log "OK: webhook de vuelta arriba"
  if [ -f "$INCIDENTE" ]; then
    rm -f "$INCIDENTE"
    tg_error "✅ <b>Bot Onia recuperado</b> — el watchdog lo levanto y responde de nuevo."
  fi
else
  log "ERROR: el webhook sigue caido despues del reinicio — mirar ./webhook-server.sh logs"
  if [ ! -f "$INCIDENTE" ]; then
    touch "$INCIDENTE"
    tg_error "🚨 <b>Bot Onia CAIDO</b> — el webhook no responde en :3020 y el watchdog NO pudo levantarlo. El chatbot (widget + WhatsApp) esta mudo hasta que alguien mire. Log: /var/log/onia-bot-watchdog.log"
  fi
fi
