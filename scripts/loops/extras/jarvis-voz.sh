#!/usr/bin/env bash
# ONIA - Jarvis matinal: narra el resumen del dia (agenda + plan de video) y lo manda
# como audio a Telegram. Nace 2026-09-17 (Fase 1 del "cerebro"): los jobs de Hermes
# escriben su texto en /root/.hermes/out/ y este guion lo convierte en voz.
#
# Voz: ElevenLabs PREMADE (Daniel, onwK4e9ZLuTAKqWW03F9). NO usar ELEVENLABS_VOICE_ID
# del .env: es una voz CLONADA y el plan actual las rechaza con 401 subscription_required
# (medido 2026-09-17).
#
# Deploy: /root/bin/onia-jarvis-voz.sh en el VPS. Cron: 25 12 * * * (08:25 La Paz; el
# crontab del sistema va en UTC, los crons de Hermes van en hora local -04 - no confundir).
set -euo pipefail

ENV_FILE=/root/.hermes/.env
OUT_DIR=/root/.hermes/out
STATE_DIR=/var/lib/onia-jarvis
VOICE_ID="${ONIA_JARVIS_VOICE_ID:-onwK4e9ZLuTAKqWW03F9}"
MAX_CHARS="${ONIA_JARVIS_MAX_CHARS:-2400}"

mkdir -p "$STATE_DIR"
K=$(grep -m1 '^ELEVENLABS_API_KEY=' "$ENV_FILE" | cut -d= -f2-)
BOT=$(grep -m1 '^TELEGRAM_BOT_TOKEN=' "$ENV_FILE" | cut -d= -f2-)
CHAT=$(grep -m1 '^TELEGRAM_HOME_CHANNEL=' "$ENV_FILE" | cut -d= -f2-)
if [ -z "$K" ] || [ -z "$BOT" ] || [ -z "$CHAT" ]; then
  echo "$(date -u +%FT%TZ) faltan credenciales en $ENV_FILE" >&2
  exit 1
fi

HOY=$(date +%F)
TEXTO=""
# Desde el 2026-09-29 la voz narra EL resumen de la mañana (onia-jarvis-resumen.sh, que
# deja brief-hoy.txt ya limpio para leer en voz alta). Los dos archivos viejos de Hermes
# quedan de respaldo para el día que el resumen no se haya generado.
if [ -f "$OUT_DIR/brief-hoy.txt" ] && [ "$(date -r "$OUT_DIR/brief-hoy.txt" +%F)" = "$HOY" ]; then
  TEXTO="$(cat "$OUT_DIR/brief-hoy.txt")"
else
  for f in "$OUT_DIR/agenda-hoy.txt" "$OUT_DIR/video-hoy.txt"; do
    [ -f "$f" ] || continue
    [ "$(date -r "$f" +%F)" = "$HOY" ] || continue
    TEXTO+="$(cat "$f")"$'\n\n'
  done
fi
if [ -z "$TEXTO" ]; then
  echo "$(date -u +%FT%TZ) sin resumen de hoy, nada que narrar"
  exit 0
fi

HASH=$(printf '%s' "$TEXTO" | md5sum | cut -d' ' -f1)
MARCA="$STATE_DIR/$HOY.$HASH"
if [ -e "$MARCA" ]; then
  echo "$(date -u +%FT%TZ) ya narrado hoy ($HASH)"
  exit 0
fi

TEXTO=${TEXTO:0:$MAX_CHARS}
MP3=$(mktemp /tmp/jarvis-XXXXXX.mp3)
trap 'rm -f "$MP3"' EXIT
BODY=$(python3 -c 'import json,sys; print(json.dumps({"text": sys.argv[1], "model_id": "eleven_multilingual_v2"}))' "$TEXTO")

HTTP=$(curl -s -m 120 -o "$MP3" -w '%{http_code}' -X POST \
  "https://api.elevenlabs.io/v1/text-to-speech/$VOICE_ID" \
  -H "xi-api-key: $K" -H 'Content-Type: application/json' -d "$BODY")
if [ "$HTTP" != 200 ]; then
  echo "$(date -u +%FT%TZ) TTS fallo http=$HTTP: $(head -c 200 "$MP3")" >&2
  exit 1
fi

# Leccion neverError (2026-08-27): una respuesta 200 de la API no prueba el efecto.
# Se exige el ok:true de Telegram antes de marcar el dia como narrado.
RESP=$(curl -s -m 60 -F "chat_id=$CHAT" -F "audio=@$MP3;filename=resumen-$HOY.mp3" \
  -F "title=Resumen $HOY" -F "caption=Tu resumen del dia, Sergio Urcullo." \
  "https://api.telegram.org/bot$BOT/sendAudio")
if ! printf '%s' "$RESP" | grep -q '"ok":true'; then
  echo "$(date -u +%FT%TZ) Telegram NO acepto el audio: $(printf '%s' "$RESP" | head -c 300)" >&2
  exit 1
fi

touch "$MARCA"
# Copia para el panel Cerebro (boton de escuchar en el navegador).
if [ -d /opt/onia-cerebro/www ]; then
  cp -f "$MP3" /opt/onia-cerebro/www/resumen-hoy.mp3 || true
fi
find "$STATE_DIR" -type f -mtime +14 -delete
echo "$(date -u +%FT%TZ) narrado y enviado ($HASH, ${#TEXTO} chars)"
