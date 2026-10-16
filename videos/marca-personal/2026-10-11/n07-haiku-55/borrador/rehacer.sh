#!/usr/bin/env bash
# rehacer.sh — rehace el BORRADOR de N07 (Haiku 5.5: el precio y la cuenta de un bot, Santiago «noticia con tarjetas») con UN comando,
# sobre el corte que haya en ../cutplan.json. NO es master. No publica nada, no toca el VPS, Drive ni cuentas; solo lee el bruto y las
# páginas oficiales (solo con RECAPTURAR=1) y escribe en esta carpeta y en la de trabajo $S.
#
#   bash rehacer.sh                              # con las capturas ya guardadas en capturas/
#   RECAPTURAR=1 bash rehacer.sh                 # además vuelve a sacar TODAS las capturas oficiales de hoy (hacerlo el día del master)
#   BRUTO=/ruta/E_15270626.mp4 S=/ruta/de/trabajo bash rehacer.sh
#
# Pasos: 1 transcript corregido en tiempo de salida · [2 capturas] · 3 plan (control contra la receta) · 4 render completo con --sin-aire
#        (la regla 15, aire muerto ≤ 0,3 s, manda sobre las pausas de 0,34-0,52 s que el molde abre por defecto) · 5 medición del audio final
#        (silencedetect, LUFS/LRA/TP) · 6 BORRADOR-no-es-master-360p.mp4 + cuadros/. El 1080x1920 queda en $S, NO en el repo.
# santiago.py corre con OpenCV 5 sin rodeo (arreglado el 11-oct, commit 80a03dd24): se llama directo.
set -euo pipefail

AQUI="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PIEZA="$(dirname "$AQUI")"
REPO="$(cd "$PIEZA/../../../.." && pwd)"
SCRATCH=/tmp/claude-0/-home-user-onia-hermes/0fd2553b-524b-53fe-9e97-5c1ac80566e6/scratchpad
BRUTO="${BRUTO:-$SCRATCH/brutos/E_15270626.mp4}"      # sale de Drive «Videos Onia Octubre», 15270626-ABFC-4562-9DF0-2E35CDE665DA.mp4
S="${S:-$SCRATCH/N07/borrador}"
CUADROS_S="${CUADROS_S:-1.0 14.6 28.4 36.9 62.9 80.6}"  # segundos de la SALIDA para los cuadros clave
SANTIAGO=(python3 "$REPO/.claude/skills/edicion-referentes/scripts/santiago/santiago.py")

[ -f "$BRUTO" ] || { echo "falta el bruto: $BRUTO (BRUTO=/ruta/E_15270626.mp4)" >&2; exit 2; }
[ -f "$PIEZA/cutplan.json" ] || { echo "falta $PIEZA/cutplan.json" >&2; exit 2; }
mkdir -p "$S" "$AQUI/cuadros"
T0=$(date +%s)

echo "== 1/6 transcript corregido en tiempo de salida (armar-transcript.py)"
python3 -I "$AQUI/armar-transcript.py"

if [ "${RECAPTURAR:-0}" = 1 ]; then
  echo "== 2/6 capturas oficiales de hoy (capturar-anthropic.mjs, --forzar)"
  node "$AQUI/capturar-anthropic.mjs" "$AQUI/storyboard.json" "$AQUI/capturas" --forzar
else
  echo "== 2/6 capturas: las de $AQUI/capturas (RECAPTURAR=1 para sacarlas de nuevo)"
fi

ARGS=(--bruto "$BRUTO" --cutplan "$PIEZA/cutplan.json" --transcript "$AQUI/segments-cut.json"
      --storyboard "$AQUI/storyboard.json" --assets "$AQUI/capturas" --out "$S/video.mp4" --sin-aire)

echo "== 3/6 control (--plan) -> plan.txt"
TP0=$(date +%s)
"${SANTIAGO[@]}" "${ARGS[@]}" --plan 2>&1 | tee "$AQUI/plan.txt"

echo "== 4/6 render completo (1080x1920, 30 fps) -> $S/video.mp4"
T1=$(date +%s)
"${SANTIAGO[@]}" "${ARGS[@]}" 2>&1 | tee "$S/render.log" | grep -E "^final:|LUFS|Traceback|Error" || true
T2=$(date +%s)
[ -s "$S/video.mp4" ] || { echo "no salió $S/video.mp4: mirar $S/render.log" >&2; exit 3; }

echo "== 5/6 medición del audio final -> medicion.txt (regla 15: 0 silencios de 0,3 s o más)"
{
  echo "# Medición del render final ($(date -u +%F' '%H:%M' UTC')) · $S/video.mp4"
  echo "duración: $(ffprobe -v error -show_entries format=duration -of csv=p=0 "$S/video.mp4") s · $(ffprobe -v error -select_streams v:0 -show_entries stream=width,height,r_frame_rate -of csv=p=0 "$S/video.mp4")"
  echo "silencedetect noise=-35dB d=0.3 (regla 15: debe dar 0):"
  ffmpeg -nostats -i "$S/video.mp4" -vn -af silencedetect=noise=-35dB:d=0.3 -f null - 2>&1 | grep -E "silence_(start|end)" || echo "  (ninguno)"
  echo "silencios contados (-35 dB, d=0,3): $(ffmpeg -nostats -i "$S/video.mp4" -vn -af silencedetect=noise=-35dB:d=0.3 -f null - 2>&1 | grep -c silence_start || true)"
  echo "silencios contados (-35 dB, d=0,2): $(ffmpeg -nostats -i "$S/video.mp4" -vn -af silencedetect=noise=-35dB:d=0.2 -f null - 2>&1 | grep -c silence_start || true)"
  echo "silencios contados (-45 dB, d=0,3): $(ffmpeg -nostats -i "$S/video.mp4" -vn -af silencedetect=noise=-45dB:d=0.3 -f null - 2>&1 | grep -c silence_start || true)"
  echo "ebur128 (resumen):"
  ffmpeg -nostats -i "$S/video.mp4" -vn -af ebur128=peak=true -f null - 2>&1 | awk '/Summary:/{r=1} r' | grep -E "^\s+(I:|LRA:|LRA low:|LRA high:|Peak:)" || true
} | tee "$AQUI/medicion.txt"
{
  echo "salto de cara en los empalmes del render final (medir-salto-cara.py, YuNet sobre cuadros −2/+1):"
  python3 -I "$AQUI/medir-salto-cara.py" "$S/video.mp4" "$PIEZA/cutplan.json" "$AQUI/plan.txt" 2>&1 | grep -v "WARN" || true
} | tee -a "$AQUI/medicion.txt"
N=$(grep -m1 "^silencios contados (-35 dB, d=0,3):" "$AQUI/medicion.txt" | awk -F': ' '{print $2}')
[ "$N" = "0" ] || echo "AVISO: la regla 15 NO se cumple ($N silencios >= 0,3 s); ver medicion.txt" >&2

echo "== 6/6 360p liviano + cuadros clave"
ffmpeg -v error -y -i "$S/video.mp4" -vf scale=360:-2 -c:v libx264 -crf 30 -preset medium -c:a aac -b:a 64k -movflags +faststart \
  "$AQUI/BORRADOR-no-es-master-360p.mp4"
rm -f "$AQUI"/cuadros/t*.jpg
for t in $CUADROS_S; do
  ffmpeg -v error -y -ss "$t" -i "$S/video.mp4" -frames:v 1 -vf scale=540:-2 -q:v 4 "$AQUI/cuadros/t$(printf '%05.1f' "$t").jpg"
done
echo "tiempos: plan $((T1 - TP0)) s · render $((T2 - T1)) s · total $(( $(date +%s) - T0 )) s"
echo "OK -> $AQUI/BORRADOR-no-es-master-360p.mp4  (render completo: $S/video.mp4; hoja de control: $S/sheets/)"
