#!/usr/bin/env bash
# ONIA — corre el transcriptor de voz (STT) DENTRO de onia-center, que está en la red
# interna de docker y alcanza a Speaches (Whisper self-hosted, cero costo). Llamado por
# n8n vía SSH.
#
# MODELO: se fija Systran/faster-whisper-small (MULTILINGÜE, español, y cabe en el límite
# de 4GB RAM del contenedor Speaches). NO se hereda el ONIA_AUDIO_STT_MODEL de onia-center
# porque hoy apunta al distil (English-only: transcribe el español a inglés). Se puede
# override exportando ONIA_AUDIO_STT_MODEL / ONIA_AUDIO_STT_LANGUAGE antes de llamar.
#
# El audio (nota de voz de Telegram) entra por STDIN en base64. Va por stdin y no por
# argumento/env porque una nota de 1 min en base64 supera el límite MAX_ARG_STRLEN (128KB)
# de Linux ("Argument list too long"). El código .mjs (4KB) se copia al contenedor y el
# audio binario se pipea a node por stdin (sin límite de tamaño).
#
# Uso local:  base64 -w0 voz.oga | ./voice-transcribe-run.sh voz.oga
# n8n (SSH):  el nodo manda el base64 del audio por stdin; arg1 = nombre/extension del archivo.
#             echo "$AUDIO_B64" | ssh ... "/opt/onia/voice-transcribe-run.sh voice.oga"
set -uo pipefail

FN="${1:-audio.ogg}"
MJS="$(dirname "$0")/voice-transcribe.mjs"
[ -f "$MJS" ] || MJS="/opt/onia/voice-transcribe.mjs"

# Asegurar el código dentro del contenedor (4KB, idempotente; /opt/onia no está montado).
docker cp "$MJS" onia-center:/tmp/voice-transcribe.mjs >/dev/null 2>&1 || {
  echo '{"ok":false,"error":"no se pudo copiar el script a onia-center"}'; exit 0;
}

# Modelo/idioma: default multilingüe español; override por env si se exporta antes.
STT_MODEL="${ONIA_AUDIO_STT_MODEL:-Systran/faster-whisper-small}"
STT_LANG="${ONIA_AUDIO_STT_LANGUAGE:-es}"

# STDIN del wrapper = base64 del audio -> decodificar -> pipe binario a node (stdin del exec).
base64 -d 2>/dev/null | docker exec \
  -e ONIA_AUDIO_STT_MODEL="$STT_MODEL" \
  -e ONIA_AUDIO_STT_LANGUAGE="$STT_LANG" \
  -e AUDIO_FILENAME="$FN" \
  -e STT_TIMEOUT_MS="${STT_TIMEOUT_MS:-300000}" \
  -i onia-center node /tmp/voice-transcribe.mjs
