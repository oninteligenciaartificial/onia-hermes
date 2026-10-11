#!/usr/bin/env bash
# rehacer.sh — rehace el BORRADOR de N02 (Sonnet 4.5 se apaga el 30-nov · Santiago «noticia con tarjetas») con UN comando.
# NO es master. No publica ni agenda nada, no toca el VPS, Drive ni cuentas: lee el bruto y escribe en esta carpeta y en $S.
#
#   bash rehacer.sh                         # con el corte que haya en ../cutplan.json
#   RECAPTURAR=1 bash rehacer.sh            # además vuelve a sacar las páginas oficiales de Anthropic (hacerlo el día del master)
#   CUTPLAN=/ruta/aprobado.json BRUTO=/ruta/D_EE23A577.mp4 S=/ruta/de/trabajo bash rehacer.sh
#
# Pasos: 1 transcript corregido en tiempo de SALIDA · [1b capturas] · 2 plan (control contra la receta) · 3 render completo
#        con --sin-aire (la regla 15 manda sobre el aire del molde) · 4 medición (silencedetect, ebur128, salto de cara)
#        · 5 BORRADOR-no-es-master-360p.mp4 + cuadros/.
# El 1080x1920 queda en $S (NO en el repo).
set -euo pipefail

AQUI="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PIEZA="$(dirname "$AQUI")"
REPO="$(cd "$PIEZA/../../../.." && pwd)"
SCRATCH=/tmp/claude-0/-home-user-onia-hermes/0fd2553b-524b-53fe-9e97-5c1ac80566e6/scratchpad
CUTPLAN="${CUTPLAN:-$PIEZA/cutplan.json}"
BRUTO="${BRUTO:-$SCRATCH/brutos/D_EE23A577.mp4}"
S="${S:-$SCRATCH/N02/borrador}"
CUADROS_S="${CUADROS_S:-2.0 22.8 56.5 65.5 86.0 109.9}"   # segundos de la SALIDA para los cuadros clave
SANTIAGO="$REPO/.claude/skills/edicion-referentes/scripts/santiago"

[ -f "$CUTPLAN" ] || { echo "falta el cutplan: $CUTPLAN" >&2; exit 2; }
[ -f "$BRUTO" ] || { echo "falta el bruto: $BRUTO (BRUTO=/ruta/D_EE23A577.mp4)" >&2; exit 2; }
mkdir -p "$S" "$AQUI/cuadros"
ARGS=(--bruto "$BRUTO" --cutplan "$CUTPLAN" --transcript "$AQUI/segments-cut.json" --storyboard "$AQUI/storyboard.json" --out "$S/video.mp4" --sin-aire)
T0=$(date +%s)

echo "== 1/5 transcript corregido en tiempo de salida"
python3 -I "$AQUI/armar-transcript.py" --transcript "$PIEZA/transcript-whisper-small.json" --cutplan "$CUTPLAN" \
  --arreglos "$AQUI/arreglos.json" --extra "$AQUI/dudosas-extra.json" --out "$AQUI/segments-cut.json" --dudosas "$AQUI/palabras-a-confirmar.txt"

if [ "${RECAPTURAR:-0}" = "1" ]; then
  echo "== 1b recapturando las páginas oficiales de hoy (capturar.mjs, proxy de la sesión, TLS intacto)"
  node "$SANTIAGO/capturar.mjs" "$AQUI/storyboard.json" "$AQUI/capturas" --forzar
  python3 -I - "$AQUI/capturas/capturas.json" <<'EOF'
import json, sys, datetime
p = sys.argv[1]
m = json.load(open(p))
ahora = datetime.datetime.now(datetime.timezone.utc)
for v in m.values():
    v["fecha"] = ahora.strftime("%Y-%m-%d")           # capturar.mjs no guarda fecha: se la ponemos
    v["hora_utc"] = ahora.strftime("%H:%M")
json.dump(m, open(p, "w"), ensure_ascii=False, indent=1)
print("capturas.json sellado:", ahora.strftime("%Y-%m-%d %H:%M UTC"))
EOF
fi

echo "== 2/5 plan (control contra la receta) -> plan.txt"
TP=$(date +%s)
python3 "$SANTIAGO/santiago.py" "${ARGS[@]}" --plan > "$AQUI/plan.txt" 2>&1
grep -E "⚠|a la vista|aire:|pausas reales|duración|cambios de layout" "$AQUI/plan.txt" | cut -c1-200 || true

echo "== 3/5 render completo (1080x1920, 30 fps) -> $S/video.mp4"
TR=$(date +%s)
python3 "$SANTIAGO/santiago.py" "${ARGS[@]}" > "$S/render.log" 2>&1
TE=$(date +%s)
grep -E "^final:|^pausas reales|^OK" "$S/render.log" || true

echo "== 4/5 medición sobre el audio final -> medicion.txt"
{
  echo "# Medición del render final ($(date -u '+%F %H:%M UTC'))"
  echo "duración: $(ffprobe -v error -show_entries format=duration -of csv=p=0 "$S/video.mp4") s"
  echo "REGLA 15 · silencedetect noise=-35dB d=0.3 (debe dar 0 silencios):"
  ffmpeg -hide_banner -nostats -i "$S/video.mp4" -vn -af silencedetect=noise=-35dB:d=0.3 -f null - 2>&1 | grep -E "silence_(start|end)" || echo "  (ninguno)"
  echo "silencios >= 0,3 s: $(ffmpeg -hide_banner -nostats -i "$S/video.mp4" -vn -af silencedetect=noise=-35dB:d=0.3 -f null - 2>&1 | grep -c silence_start || true)"
  echo "silencios >= 0,2 s (informativo): $(ffmpeg -hide_banner -nostats -i "$S/video.mp4" -vn -af silencedetect=noise=-35dB:d=0.2 -f null - 2>&1 | grep -c silence_start || true)"
  echo "ebur128 (LUFS integrado, LRA, true peak):"
  ffmpeg -hide_banner -nostats -i "$S/video.mp4" -vn -af ebur128=peak=true -f null - 2>&1 | sed -n '/Summary:/,$p' | grep -E "I:|LRA:|Peak:" | head -4
  echo "salto de la cara en los empalmes (YuNet sobre el render):"
  python3 -I "$AQUI/medir-saltos.py" --video "$S/video.mp4" --cutplan "$CUTPLAN" --plan "$AQUI/plan.txt"
} | tee "$AQUI/medicion.txt"

echo "== 5/5 360p liviano + cuadros"
ffmpeg -v error -y -i "$S/video.mp4" -vf scale=360:-2 -c:v libx264 -crf 30 -preset medium -c:a aac -b:a 64k -movflags +faststart \
  "$AQUI/BORRADOR-no-es-master-360p.mp4"
rm -f "$AQUI"/cuadros/t*.jpg
for t in $CUADROS_S; do
  ffmpeg -v error -y -ss "$t" -i "$S/video.mp4" -frames:v 1 -vf scale=540:-2 -q:v 4 "$AQUI/cuadros/t$(printf '%05.1f' "$t").jpg"
done
echo "tiempos: plan $((TR - TP)) s · render $((TE - TR)) s · total $(( $(date +%s) - T0 )) s"
echo "LISTO (borrador, no es master) -> $AQUI/BORRADOR-no-es-master-360p.mp4 · render completo en $S/video.mp4"
