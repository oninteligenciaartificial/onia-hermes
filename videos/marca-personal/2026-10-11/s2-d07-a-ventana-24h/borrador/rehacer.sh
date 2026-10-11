#!/usr/bin/env bash
# rehacer.sh — rehace el BORRADOR de S2-D07-A (ventana de 24 h de WhatsApp · molde Erik) con UN comando.
# NO es master. No publica ni agenda nada, no toca el VPS, Drive ni cuentas: lee el bruto y escribe en esta carpeta y en $S.
#
#   bash rehacer.sh                              # con el corte propuesto de ../cutplan.json
#   RECAPTURAR=1 bash rehacer.sh                 # además vuelve a sacar las páginas oficiales de Meta (hacerlo el día del master)
#   QUITAR_VARIABLES=1 bash rehacer.sh           # corta la frase de las variables (ALERTA del README); NO es el default
#   QUITAR_REPETIDO=1 bash rehacer.sh            # corta el tramo repetido (bruto 01:04-01:23); NO es el default
#   SOLO_CUADROS=2,12,40 bash rehacer.sh         # solo los cuadros sueltos y el informe (~30 s), sin render ni medición
#   CUTPLAN=/ruta/aprobado.json BRUTO=/ruta/C_3941A129.mp4 S=/ruta/trabajo bash rehacer.sh
#
# Pasos: 1 transcript corregido en tiempo de SALIDA · [1b capturas] · 2 storyboard de render (cortes opcionales) ·
#        3 erik_edit.py --sin-vosk (render completo) · 4 tabla de cortes derivada · 5 medición (silencedetect, ebur128) ·
#        6 BORRADOR-no-es-master-360p.mp4 + cuadros/.  El 1080x1920 queda en $S (NO en el repo).
# Con una opción de corte activa, los archivos del repo salen con sufijo (-sin-variables, -sin-repetido) y no pisan el borrador por defecto.
set -euo pipefail

AQUI="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PIEZA="$(dirname "$AQUI")"
REPO="$(cd "$PIEZA/../../../.." && pwd)"
SCRATCH=/tmp/claude-0/-home-user-onia-hermes/0fd2553b-524b-53fe-9e97-5c1ac80566e6/scratchpad
CUTPLAN="${CUTPLAN:-$PIEZA/cutplan.json}"
BRUTO="${BRUTO:-$SCRATCH/brutos/C_3941A129.mp4}"
S="${S:-$SCRATCH/D07/borrador}"
CUADROS_S="${CUADROS_S:-0.4 2.8 17.5 39.6 44.0 90.3}"   # segundos de la SALIDA para los cuadros clave del repo
ERIK="$REPO/.claude/skills/edicion-referentes/scripts/erik"
QV="${QUITAR_VARIABLES:-0}"; QR="${QUITAR_REPETIDO:-0}"

[ -f "$CUTPLAN" ] || { echo "falta el cutplan: $CUTPLAN" >&2; exit 2; }
[ -f "$BRUTO" ] || { echo "falta el bruto: $BRUTO (BRUTO=/ruta/C_3941A129.mp4)" >&2; exit 2; }
mkdir -p "$S" "$AQUI/cuadros"
SUF=""; OPC=()
if [ "$QV" = "1" ]; then SUF="$SUF-sin-variables"; OPC+=(--variables); fi
if [ "$QR" = "1" ]; then SUF="$SUF-sin-repetido"; OPC+=(--repetido); fi
VIDEO="$S/video$SUF.mp4"
TRABAJO="$S/work-erik$SUF"
T0=$(date +%s)

echo "== 1/6 transcript corregido en tiempo de salida"
python3 -I "$AQUI/armar-transcript.py" --transcript "$PIEZA/transcript-whisper-small.json" --cutplan "$CUTPLAN" \
  --arreglos "$AQUI/arreglos.json" --extra "$AQUI/dudosas-extra.json" --out "$AQUI/segments-cut.json" --dudosas "$AQUI/palabras-a-confirmar.txt"

if [ "${RECAPTURAR:-0}" = "1" ]; then
  echo "== 1b recapturando las páginas oficiales de Meta (capturar-meta.mjs, proxy de la sesión, TLS intacto)"
  node "$AQUI/capturar-meta.mjs" "$AQUI/capturas/specs/servicio.json" "$AQUI/capturas/servicio"
  node "$AQUI/capturar-meta.mjs" "$AQUI/capturas/specs/plantillas.json" "$AQUI/capturas/plantillas"
  python3 -I "$AQUI/indice-capturas.py" "$AQUI/capturas"
fi

echo "== 2/6 storyboard de render (cortes opcionales: variables=$QV repetido=$QR)"
python3 -I "$AQUI/variantes.py" --storyboard "$AQUI/storyboard.json" --out "$S/storyboard-render$SUF.json" "${OPC[@]}"
ARGS=(--bruto "$BRUTO" --cutplan "$CUTPLAN" --transcript "$AQUI/segments-cut.json" --storyboard "$S/storyboard-render$SUF.json"
      --salida "$VIDEO" --trabajo "$TRABAJO" --sin-vosk)

if [ -n "${SOLO_CUADROS:-}" ]; then
  echo "== solo cuadros: $SOLO_CUADROS -> $TRABAJO/cuadros (y el informe)"
  python3 "$ERIK/erik_edit.py" "${ARGS[@]}" --cuadros "$SOLO_CUADROS" 2>&1 | grep -v WARN
  exit 0
fi

echo "== 3/6 render completo (1080x1920, 30 fps, --sin-vosk) -> $VIDEO"
TR=$(date +%s)
python3 "$ERIK/erik_edit.py" "${ARGS[@]}" --hojas "$S/sheets$SUF" > "$S/render$SUF.log" 2>&1
TE=$(date +%s)
grep -vE "^  cuadro [0-9]+/|WARN" "$S/render$SUF.log" > "$AQUI/informe-erik$SUF.txt" || true
grep -E "audio:|pausas:|listo:|duración|plano de cámara" "$S/render$SUF.log" || true

echo "== 4/6 tabla de cortes derivada de erik_edit.py"
cp "$TRABAJO/tabla-cortes.md" "$AQUI/tabla-cortes$SUF.md"
cp "$TRABAJO/cutplan-erik.json" "$AQUI/cutplan-erik$SUF.json"

echo "== 5/6 medición sobre el audio final -> medicion$SUF.txt"
{
  echo "# Medición del render final$SUF ($(date -u '+%F %H:%M UTC'))"
  echo "duración: $(ffprobe -v error -show_entries format=duration -of csv=p=0 "$VIDEO") s"
  echo "REGLA 15 · silencedetect noise=-35dB d=0.3 (debe dar 0 silencios):"
  ffmpeg -hide_banner -nostats -i "$VIDEO" -vn -af silencedetect=noise=-35dB:d=0.3 -f null - 2>&1 | grep -E "silence_(start|end)" || echo "  (ninguno)"
  echo "silencios >= 0,3 s: $(ffmpeg -hide_banner -nostats -i "$VIDEO" -vn -af silencedetect=noise=-35dB:d=0.3 -f null - 2>&1 | grep -c silence_start || true)"
  echo "silencios >= 0,2 s (informativo): $(ffmpeg -hide_banner -nostats -i "$VIDEO" -vn -af silencedetect=noise=-35dB:d=0.2 -f null - 2>&1 | grep -c silence_start || true)"
  echo "ebur128 (LUFS integrado, LRA, true peak; Erik pide -14 LUFS, TP <= -1,5):"
  ffmpeg -hide_banner -nostats -i "$VIDEO" -vn -af ebur128=peak=true -f null - 2>&1 | sed -n '/Summary:/,$p' | grep -E "I:|LRA:|Peak:" | head -4
  echo "ritmo (del informe de erik_edit.py):"
  grep -E "duración:|plano de cámara|planos-flash|tarjeta «|subtítulos T|sin cambio de apoyo" "$AQUI/informe-erik$SUF.txt" | cut -c1-230
} | tee "$AQUI/medicion$SUF.txt"

echo "== 6/6 360p liviano + cuadros"
ffmpeg -v error -y -i "$VIDEO" -vf scale=360:-2 -c:v libx264 -crf 30 -preset medium -c:a aac -b:a 64k -movflags +faststart \
  "$AQUI/BORRADOR-no-es-master-360p$SUF.mp4"
if [ -z "$SUF" ]; then
  rm -f "$AQUI"/cuadros/t*.jpg
  for t in $CUADROS_S; do
    ffmpeg -v error -y -ss "$t" -i "$VIDEO" -frames:v 1 -vf scale=540:-2 -q:v 4 "$AQUI/cuadros/t$(printf '%05.1f' "$t").jpg"
  done
fi
echo "tiempos: render $((TE - TR)) s · total $(( $(date +%s) - T0 )) s"
echo "LISTO (borrador, no es master) -> $AQUI/BORRADOR-no-es-master-360p$SUF.mp4 · render completo en $VIDEO"
