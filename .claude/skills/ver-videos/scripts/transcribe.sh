#!/usr/bin/env bash
# ver-videos — transcribe con timestamps (segment + word) via Speaches (VPS, gratis).
# FUERZA el modelo multilingüe: el default del contenedor es el distil (English-only) y
# traduce el español al inglés. Uso: bash transcribe.sh <audio.(mp3|ogg|wav|m4a)>
# Salida (stdout): JSON {ok, model, duration, n_segments, n_words, segments[], words[]}
set -uo pipefail

AUDIO="${1:?falta audio}"
KEY="${ONIA_VPS_KEY:-$HOME/.ssh/onia_hermes_vps_ed25519}"
H="${ONIA_VPS_HOST:-root@187.77.16.63}"
MODEL="${ONIA_AUDIO_STT_MODEL:-Systran/faster-whisper-small}"   # multilingüe; NO faster-distil-* (English-only)
LANG="${ONIA_AUDIO_STT_LANGUAGE:-es}"
MJS="$(dirname "$0")/verbose-transcribe.mjs"
FN="$(basename "$AUDIO")"

[ -f "$AUDIO" ] || { echo "{\"ok\":false,\"error\":\"no existe $AUDIO\"}"; exit 0; }

scp -i "$KEY" -o StrictHostKeyChecking=no "$MJS" "$AUDIO" "$H":/tmp/ >/dev/null 2>&1 \
  || { echo '{"ok":false,"error":"scp al VPS falló"}'; exit 0; }

ssh -i "$KEY" -o StrictHostKeyChecking=no "$H" \
  "docker cp /tmp/verbose-transcribe.mjs onia-center:/tmp/vt.mjs >/dev/null 2>&1; \
   docker cp /tmp/$FN onia-center:/tmp/$FN >/dev/null 2>&1; \
   docker exec -e ONIA_AUDIO_STT_MODEL='$MODEL' -e ONIA_AUDIO_STT_LANGUAGE='$LANG' \
     -e STT_TIMEOUT_MS=560000 onia-center node /tmp/vt.mjs /tmp/$FN"
