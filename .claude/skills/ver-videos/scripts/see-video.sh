#!/usr/bin/env bash
# ver-videos — extrae audio + fotogramas de un video para que Claude lo "vea".
# Uso: bash see-video.sh <video> <workdir>
# Salida: <workdir>/audio.mp3 (mono 16k) + <workdir>/frames/f_XX.jpg + imprime lista e intervalo.
set -uo pipefail

VIDEO="${1:?falta ruta del video}"
WORK="${2:?falta workdir}"
mkdir -p "$WORK/frames"

[ -f "$VIDEO" ] || { echo "no existe: $VIDEO" >&2; exit 1; }

# Duración en segundos (entero)
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$VIDEO" 2>/dev/null | cut -d. -f1)
DUR="${DUR:-0}"

# Intervalo de muestreo segun duración (apunta a ~40-70 cuadros)
if   [ "$DUR" -lt 120 ];  then IV=5
elif [ "$DUR" -lt 600 ];  then IV=15
elif [ "$DUR" -lt 1800 ]; then IV=25
else                           IV=45
fi

echo "duración=${DUR}s  intervalo=${IV}s  cuadros_estimados=$(( DUR / IV + 1 ))"

# Audio: mono 16k (ideal para Whisper)
ffmpeg -y -i "$VIDEO" -ac 1 -ar 16000 -vn "$WORK/audio.mp3" >/dev/null 2>&1 \
  && echo "audio -> $WORK/audio.mp3" || echo "WARN: falló extracción de audio" >&2

# Fotogramas: 1 cada IV s, ancho 640
ffmpeg -y -i "$VIDEO" -vf "fps=1/${IV},scale=640:-1" "$WORK/frames/f_%02d.jpg" >/dev/null 2>&1 \
  && echo "frames -> $WORK/frames/ ($(ls -1 "$WORK/frames" | wc -l) cuadros)" || echo "WARN: falló extracción de frames" >&2

echo "--- para 'ver': transcribí audio.mp3 (scripts/transcribe.sh) y leé una MUESTRA repartida de frames/ con Read ---"
