#!/usr/bin/env bash
# ver-videos — transcribe con timestamps (segment + word): faster-whisper local si está, si no Speaches (VPS).
# FUERZA el modelo multilingüe: el default del contenedor es el distil (English-only) y
# traduce el español al inglés. Uso: bash transcribe.sh <audio.(mp3|ogg|wav|m4a)>
# Salida (stdout): JSON {ok, model, duration, n_segments, n_words, segments[], words[]}
#
# Camino PRIMARIO: node en el HOST del VPS contra el puerto publicado de Speaches
# (127.0.0.1:3108). Antes esto pasaba por `docker exec onia-center`, y el día que el
# panel se cayó (2026-07-30, "network easypanel not found") la transcripción se cayó con
# él aunque Speaches estaba sano. El editor no puede depender del panel para transcribir.
# Camino de RESPALDO: adentro de onia-center por la red interna (http://speaches:8000).
set -uo pipefail

AUDIO="${1:?falta audio}"
KEY="${ONIA_VPS_KEY:-$HOME/.ssh/onia_hermes_vps_ed25519}"
H="${ONIA_VPS_HOST:-root@187.77.16.63}"
MODEL="${ONIA_AUDIO_STT_MODEL:-Systran/faster-whisper-small}"   # multilingüe; NO faster-distil-* (English-only)
LANG="${ONIA_AUDIO_STT_LANGUAGE:-es}"
BASE="${ONIA_AUDIO_STT_BASE_URL:-http://127.0.0.1:3108/v1}"     # Speaches publicado en el host del VPS
MJS="$(dirname "$0")/verbose-transcribe.mjs"
FN="$(basename "$AUDIO")"

[ -f "$AUDIO" ] || { echo "{\"ok\":false,\"error\":\"no existe $AUDIO\"}"; exit 0; }

# Por DEFECTO en la PC (19-oct-2026): faster-whisper LOCAL, mismo JSON, sin VPS ni red.
# Speaches del VPS (abajo) queda para la nube, o forzado con ONIA_STT=vps.
PY="${ONIA_PYTHON:-python}"
if [ "${ONIA_STT:-local}" != "vps" ] && "$PY" -c "import importlib.util as u,sys; sys.exit(u.find_spec('faster_whisper') is None)" >/dev/null 2>&1; then
  exec "$PY" "$(dirname "$0")/transcribe_local.py" "$AUDIO"
fi

scp -i "$KEY" -o StrictHostKeyChecking=no "$MJS" "$AUDIO" "$H":/tmp/ >/dev/null 2>&1 \
  || { echo '{"ok":false,"error":"scp al VPS falló"}'; exit 0; }

ssh -i "$KEY" -o StrictHostKeyChecking=no "$H" \
  "export ONIA_AUDIO_STT_MODEL='$MODEL' ONIA_AUDIO_STT_LANGUAGE='$LANG' STT_TIMEOUT_MS=560000; \
   if command -v node >/dev/null 2>&1 && curl -sf -m 10 '$BASE/models' >/dev/null 2>&1; then \
     ONIA_AUDIO_STT_BASE_URL='$BASE' node /tmp/verbose-transcribe.mjs '/tmp/$FN'; \
   elif docker exec onia-center true >/dev/null 2>&1; then \
     docker cp /tmp/verbose-transcribe.mjs onia-center:/tmp/vt.mjs >/dev/null 2>&1; \
     docker cp '/tmp/$FN' 'onia-center:/tmp/$FN' >/dev/null 2>&1; \
     docker exec -e ONIA_AUDIO_STT_MODEL='$MODEL' -e ONIA_AUDIO_STT_LANGUAGE='$LANG' \
       -e STT_TIMEOUT_MS=560000 onia-center node /tmp/vt.mjs '/tmp/$FN'; \
   else \
     echo '{\"ok\":false,\"error\":\"Speaches no responde en $BASE y el contenedor onia-center no corre\"}'; \
   fi"
