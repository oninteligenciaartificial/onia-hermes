#!/usr/bin/env bash
# sacar-prompt — deja listos los insumos para reconstruir el prompt de una imagen o un video.
#
# Uso:  bash preparar.sh <url-o-archivo> [--out DIR]
#
# Que hace, y nada mas:
#   - si es un link de IG/TikTok/YouTube -> lo baja con fetch-video.mjs (o ig-carousel.mjs si
#     es carrusel de imagenes), trayendo tambien el caption
#   - si es un video -> saca fotogramas MUESTREADOS POR DENSIDAD DE TEXTO, no a intervalo fijo,
#     porque un prompt en pantalla puede durar un solo cuadro
#   - si tiene voz -> transcribe (faster-whisper local en la PC; Speaches del VPS en la nube; idioma en auto)
#   - si es una imagen -> no hace nada, se lee directo
#
# NO genera, NO sube nada a ningun lado y NO gasta creditos.
set -uo pipefail

SRC="${1:?falta la url o el archivo}"
OUT="."; [ "${2:-}" = "--out" ] && OUT="${3:?falta el directorio}"
VV="$(cd "$(dirname "$0")/../../ver-videos/scripts" && pwd)"
mkdir -p "$OUT/fotogramas"

# ---------- 1. conseguir el archivo ----------
if [[ "$SRC" =~ ^https?:// ]]; then
  if node "$VV/fetch-video.mjs" "$SRC" --out "$OUT" >/dev/null 2>&1 && ls "$OUT"/*.mp4 >/dev/null 2>&1; then
    F="$(ls -t "$OUT"/*.mp4 | head -1)"
  elif node "$VV/ig-carousel.mjs" "$SRC" --out "$OUT" >/dev/null 2>&1; then
    echo "CARRUSEL bajado en $OUT — leer TODAS las laminas y el caption.txt"
    exit 0
  else
    echo "no se pudo bajar $SRC"; exit 1
  fi
else
  F="$SRC"
fi

case "${F,,}" in
  *.jpg|*.jpeg|*.png|*.webp) echo "IMAGEN: $F — leerla directo, no hace falta preparar nada"; exit 0 ;;
esac

DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$F")
echo "VIDEO: $F  ${DUR}s"
[ -f "${F%.*}.info.json" ] && echo "caption: ${F%.*}.info.json (campo description) — leerlo PRIMERO"

# ---------- 2. fotogramas por densidad de texto ----------
# COSTO (medido 2026-08-23): quien lee estos fotogramas es un modelo, y una imagen de 1080px
# cuesta ~1.000-1.500 tokens. Con 40 densos por video eran ~50.000 tokens por agente SOLO en
# mirar; un lote de 32 se iba a 4-5 M. A 640px y 3 ventanas (~24 densos) el texto en pantalla
# se sigue leyendo igual y el costo baja a ~1/5. Si algun dia hace falta leer letra chica,
# subir la escala para ESE video, no para todos.
# Primero una pasada barata (1 cada 2 s). Despues se re-muestrea DENSO alrededor de los cuadros
# con mas bordes — el texto en pantalla dispara la varianza de bordes muy por encima del video.
ffmpeg -v error -i "$F" -vf "fps=1/2,scale=640:-1" -q:v 3 "$OUT/fotogramas/base_%03d.jpg" -y

BEST=""
for img in "$OUT"/fotogramas/base_*.jpg; do
  # proxy de "cuanto texto hay": peso del jpg comprimido al mismo nivel. El texto no comprime.
  SZ=$(wc -c < "$img")
  BEST="$BEST$SZ $img
"
done
UMBRAL=$(printf '%s' "$BEST" | sort -rn | head -3 | tail -1 | cut -d' ' -f1)

printf '%s' "$BEST" | sort -rn | head -3 | while read -r sz img; do
  n=$(basename "$img" .jpg | sed 's/base_//')
  t=$(node -e "console.log(((parseInt('$n',10)-1)*2).toFixed(2))")
  # 4 cuadros por segundo en la ventana de 2 s alrededor del candidato
  ffmpeg -v error -ss "$t" -t 2 -i "$F" -vf "fps=4,scale=640:-1" -q:v 2 \
    "$OUT/fotogramas/texto_${n}_%02d.jpg" -y 2>/dev/null
done

echo "fotogramas base:  $(ls "$OUT"/fotogramas/base_*.jpg 2>/dev/null | wc -l)"
echo "fotogramas densos donde hay texto: $(ls "$OUT"/fotogramas/texto_*.jpg 2>/dev/null | wc -l)"
echo "  -> leer PRIMERO los texto_*, ahi suele estar el prompt"

# ---------- 3. voz ----------
ffmpeg -v error -i "$F" -vn -ac 1 -ar 16000 -b:a 48k "$OUT/audio.mp3" -y 2>/dev/null
if [ -s "$OUT/audio.mp3" ]; then
  ONIA_AUDIO_STT_LANGUAGE=auto bash "$VV/transcribe.sh" "$OUT/audio.mp3" > "$OUT/audio.json" 2>/dev/null
  node -e "
    const d=require('$OUT/audio.json');
    if(!d.ok){console.log('(sin transcripcion: '+d.error+')');process.exit(0)}
    console.log(d.segments.map(s=>'['+s.start.toFixed(0)+'] '+s.text).join('\n'))
  " > "$OUT/verbatim.txt" 2>/dev/null
  echo "verbatim: $OUT/verbatim.txt ($(wc -c < "$OUT/verbatim.txt") bytes)"
  echo "  -> Whisper degrada nombres tecnicos. Contrastar contra fotograma antes de citar."
else
  echo "sin voz"
fi
