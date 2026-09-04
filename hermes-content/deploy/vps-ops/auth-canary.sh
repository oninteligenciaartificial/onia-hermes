#!/usr/bin/env bash
# ONIA — CANARIO del flujo de auth (registro/login) de la plataforma.
#
# EL PROBLEMA QUE RESUELVE: el 2026-08-16 supabase-auth2 se recreo y perdio su alias de
# red `auth`; Kong respondia 503 "DNS resolution failed" y el REGISTRO de produccion
# estuvo caido ~10 horas sin que nadie se entere. El guardian mira contenedores arriba,
# no flujos: todos los contenedores estaban "Up" mientras el alta estaba muerta.
#
# Este canario prueba el CAMINO real, no el contenedor:
#   1. onia-center -> supabase-kong:8000 /auth/v1/settings (apikey anon del app.env):
#      atraviesa Kong y su resolucion DNS del alias `auth` — exactamente lo que fallo.
#   2. https://app.onia.com.bo/login responde 200 (la pantalla por la que entra la gente).
#
# Telegram: SOLO errores (decision Sergio 2026-08-28). Un incidente = UN aviso de caida
# + UN aviso de recuperacion (marcador en /var/lib). Cron sugerido:
#   */5 * * * * /opt/onia/auth-canary.sh >> /var/log/onia-auth-canary.log 2>&1
set -uo pipefail

STAMP="$(date -Iseconds)"
log() { echo "[$STAMP] $*"; }

ALERT_ENV="/root/.config/onia/backup.env"
INCIDENTE="/var/lib/onia-auth-canary.incidente"
APP_ENV="${ONIA_APP_ENV:-/opt/onia-platform/app.env}"
KONG_HOST="${ONIA_KONG_HOST:-supabase-kong}"
LOGIN_URL="${ONIA_LOGIN_URL:-https://app.onia.com.bo/login}"

tg_error() {
  [ -f "$ALERT_ENV" ] && . "$ALERT_ENV"
  [ -n "${TG_BOT_TOKEN:-}" ] && [ -n "${TG_CHAT_ID:-}" ] || return 0
  curl -sf -m 20 -X POST "https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage" \
    -d chat_id="${TG_CHAT_ID}" -d parse_mode=HTML --data-urlencode text="$1" >/dev/null || true
}

FALLO=""

# --- 1. Camino Kong -> GoTrue (el que se rompio con el alias perdido) -------
ANON="$(grep '^NEXT_PUBLIC_SUPABASE_ANON_KEY=' "$APP_ENV" 2>/dev/null | head -1 | cut -d= -f2-)"
CENTER="$(docker ps -qf name=onia-center | head -n1)"
if [ -z "$ANON" ] || [ -z "$CENTER" ]; then
  FALLO="canario incompleto: $([ -z "$ANON" ] && echo 'sin anon key en app.env ') $([ -z "$CENTER" ] && echo 'sin contenedor onia-center')"
else
  SETTINGS="$(docker exec -e K="$ANON" "$CENTER" sh -c \
    "wget -qO- --timeout=10 --header=\"apikey: \$K\" http://${KONG_HOST}:8000/auth/v1/settings 2>/dev/null" || true)"
  case "$SETTINGS" in
    *external*) log "auth via Kong OK" ;;
    *) FALLO="Kong->GoTrue NO responde settings (alias 'auth' perdido u otro corte). Respuesta: ${SETTINGS:0:120}" ;;
  esac
fi

# --- 2. Pantalla de login publica --------------------------------------------
if [ -z "$FALLO" ]; then
  CODE="$(curl -s -o /dev/null -w '%{http_code}' -m 15 "$LOGIN_URL" || echo 000)"
  if [ "$CODE" = "200" ]; then
    log "login publico OK (200)"
  else
    FALLO="login publico devolvio $CODE en $LOGIN_URL"
  fi
fi

# --- Estado + alertas (1 por incidente) --------------------------------------
if [ -n "$FALLO" ]; then
  log "ERROR: $FALLO"
  if [ ! -f "$INCIDENTE" ]; then
    echo "$STAMP $FALLO" > "$INCIDENTE"
    tg_error "🚨 <b>Registro/login de Onia CAIDO</b> — $FALLO. Runbook: si es el alias, docker network connect --alias auth --alias supabase-auth2 supabase_default supabase-auth2. Log: /var/log/onia-auth-canary.log"
  fi
  exit 1
fi

if [ -f "$INCIDENTE" ]; then
  rm -f "$INCIDENTE"
  tg_error "✅ <b>Registro/login de Onia recuperado</b> — el flujo de auth responde de nuevo."
fi
log "todo OK"
