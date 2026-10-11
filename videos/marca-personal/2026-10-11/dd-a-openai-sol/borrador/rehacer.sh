#!/usr/bin/env bash
# rehacer.sh — rehace el BORRADOR de DD-A (OpenAI «Sol» y la caché) con UN comando, sobre el corte que haya en ../cutplan.json.
#
#   bash rehacer.sh                       # cierre A (lo que dice el audio)
#   CIERRE=B bash rehacer.sh              # cierre B («Lo que probé está en mi comunidad. Link en mi perfil.»)
#   RECAPTURAR=1 bash rehacer.sh          # además vuelve a sacar las capturas oficiales de developers.openai.com (fecha de hoy)
#   BRUTO=/ruta/F9630B16.mp4 S=/ruta/de/trabajo bash rehacer.sh
#
# Hace, en orden: transcript en tiempo de SALIDA (hacer-segments.py) → storyboard con el cierre elegido → [capturas] →
# santiago.py --plan (plan.txt) → render completo 1080x1920 con --sin-aire (regla 15: el aire muerto manda sobre el «aire»
# del molde) → silencedetect del audio final (medicion.txt) → BORRADOR-no-es-master-360p.mp4 + cuadros/ clave.
# El render grande queda en $S, NO en el repo. No toca git, ni Drive, ni redes.
set -euo pipefail

AQUI="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PIEZA="$(dirname "$AQUI")"
BRUTO="${BRUTO:-/tmp/claude-0/-home-user-onia-hermes/0fd2553b-524b-53fe-9e97-5c1ac80566e6/scratchpad/brutos/B_F9630B16.mp4}"
S="${S:-/tmp/dd-a-openai-sol-borrador}"
CIERRE="${CIERRE:-A}"
CUADROS_S="${CUADROS_S:-2.0 14.4 31.0 44.0 53.8 57.4}"   # segundos de la SALIDA para los cuadros clave
CORRER=(python3 "$AQUI/correr-santiago.py")

[ -f "$BRUTO" ] || { echo "falta el bruto: $BRUTO (BRUTO=/ruta/F9630B16.mp4)"; exit 1; }
mkdir -p "$S" "$AQUI/cuadros"
T0=$(date +%s)

echo "== 1/6 transcript en tiempo de salida"
python3 -I "$AQUI/hacer-segments.py"

echo "== 2/6 storyboard (cierre $CIERRE)"
python3 -I "$AQUI/armar-storyboard.py" --cierre "$CIERRE" --out "$S/storyboard-render.json"

if [ "${RECAPTURAR:-0}" = 1 ]; then
  echo "== 3/6 capturas oficiales (capturar-openai.mjs)"
  node "$AQUI/capturar-openai.mjs" "$AQUI/storyboard.json" "$AQUI/capturas" --forzar
else
  echo "== 3/6 capturas: las de $AQUI/capturas (RECAPTURAR=1 para sacarlas de nuevo)"
fi

ARGS=(--bruto "$BRUTO" --cutplan "$PIEZA/cutplan.json" --transcript "$AQUI/segments-cut.json"
      --storyboard "$S/storyboard-render.json" --assets "$AQUI/capturas" --out "$S/video.mp4" --sin-aire)

echo "== 4/6 control (--plan) -> plan.txt"
TP0=$(date +%s)
"${CORRER[@]}" "${ARGS[@]}" --plan 2>&1 | tee "$AQUI/plan.txt"

echo "== 5/6 render completo"
T1=$(date +%s)
"${CORRER[@]}" "${ARGS[@]}" 2>&1 | tee "$S/render.log"
T2=$(date +%s)

echo "== 6/6 medición (regla 15), 360p y cuadros"
{
  echo "# Medición del render final ($(date -u +%F' '%H:%M' UTC')) · cierre $CIERRE"
  echo "duración: $(ffprobe -v error -show_entries format=duration -of csv=p=0 "$S/video.mp4") s"
  echo "silencedetect noise=-35dB d=0.3 (regla 15: 0 silencios de 0,3 s o más):"
  ffmpeg -nostats -i "$S/video.mp4" -vn -af silencedetect=noise=-35dB:d=0.3 -f null - 2>&1 | grep -E "silence_(start|end)" || echo "  (ninguno)"
  echo "silencios contados: $(ffmpeg -nostats -i "$S/video.mp4" -vn -af silencedetect=noise=-35dB:d=0.3 -f null - 2>&1 | grep -c silence_start || true)"
  echo "ebur128:"
  ffmpeg -nostats -i "$S/video.mp4" -vn -af ebur128=peak=true -f null - 2>&1 | tail -12 | grep -E "I:|LRA:|Peak:" || true
} | tee "$AQUI/medicion.txt"

ffmpeg -v error -y -i "$S/video.mp4" -vf scale=360:-2 -c:v libx264 -crf 30 -preset medium -c:a aac -b:a 64k -movflags +faststart \
  "$AQUI/BORRADOR-no-es-master-360p.mp4"
rm -f "$AQUI"/cuadros/t*.jpg
for t in $CUADROS_S; do
  ffmpeg -v error -y -ss "$t" -i "$S/video.mp4" -frames:v 1 -vf scale=540:-2 -q:v 4 "$AQUI/cuadros/t$(printf '%05.1f' "$t").jpg"
done
# el cuadro del cierre de la OTRA variante (A↔B), para compararlas sin volver a renderizar todo
OTRA=$([ "$CIERRE" = A ] && echo B || echo A)
python3 -I "$AQUI/armar-storyboard.py" --cierre "$OTRA" --out "$S/storyboard-render-$OTRA.json" > /dev/null
mkdir -p "$S/fotos"; rm -f "$S/fotos/t057.40.png"
"${CORRER[@]}" --bruto "$BRUTO" --cutplan "$PIEZA/cutplan.json" --transcript "$AQUI/segments-cut.json" \
  --storyboard "$S/storyboard-render-$OTRA.json" --assets "$AQUI/capturas" --out "$S/video-otra.mp4" --sin-aire --fotos 57.4 > /dev/null 2>&1
python3 -c "from PIL import Image; Image.open('$S/fotos/t057.40.png').convert('RGB').resize((540, 960)).save('$AQUI/cuadros/cierre-$OTRA.jpg', quality=88)"
echo "tiempos: plan $((T1 - TP0)) s · render $((T2 - T1)) s · total $(( $(date +%s) - T0 )) s"
echo "OK -> $AQUI/BORRADOR-no-es-master-360p.mp4  (render completo: $S/video.mp4)"
