#!/usr/bin/env bash
# rehacer.sh — rehace el BORRADOR de N06 (Santiago «noticia con tarjetas») de punta a punta con UN comando.
# NO es master. No publica nada, no toca el VPS ni cuentas; solo lee el bruto y escribe en esta carpeta y en la de trabajo.
#
# Uso:    bash rehacer.sh [CUTPLAN] [BRUTO] [CARPETA_DE_TRABAJO]
#   CUTPLAN  (default: ../cutplan.json)        el corte; con el «ok cortes» de Sergio Urcullo, pasar el aprobado
#   BRUTO    (default: el de la sesión)        MP4 sin cortar
#   CARPETA  (default: scratchpad N06/borrador) donde queda video.mp4 a 1080x1920, work/ y sheets/ (NO va al repo)
# Variables:
#   RECAPTURAR=1   vuelve a sacar TODAS las capturas oficiales del día (hacerlo el día del master)
#
# Pasos: 1 transcript corregido en tiempo de salida · 2 plan (control contra la receta) · 3 render completo
#        4 regla 15 (silencedetect) · 5 versión 360p liviana para revisar.
set -euo pipefail
AQUI="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PIEZA="$(dirname "$AQUI")"
REPO="$(cd "$PIEZA/../../../.." && pwd)"
SCRATCH=/tmp/claude-0/-home-user-onia-hermes/0fd2553b-524b-53fe-9e97-5c1ac80566e6/scratchpad
CUTPLAN="${1:-$PIEZA/cutplan.json}"
BRUTO="${2:-$SCRATCH/brutos/A_1CCFE9FE.mp4}"
S="${3:-$SCRATCH/N06/borrador}"
mkdir -p "$S"
[ -f "$CUTPLAN" ] || { echo "falta el cutplan: $CUTPLAN" >&2; exit 2; }
[ -f "$BRUTO" ] || { echo "falta el bruto: $BRUTO" >&2; exit 2; }
SANTIAGO=("python3" "$AQUI/santiago-cv5.py" --bruto "$BRUTO" --cutplan "$CUTPLAN" --transcript "$AQUI/segments-cut.json" --storyboard "$AQUI/storyboard.json")

echo "== 1/5 transcript corregido en tiempo de salida"
python3 "$AQUI/armar-transcript.py" --transcript "$PIEZA/transcript-whisper-small.json" --cutplan "$CUTPLAN" \
  --arreglos "$AQUI/arreglos.json" --extra "$AQUI/dudosas-extra.json" \
  --out "$AQUI/segments-cut.json" --dudosas "$AQUI/palabras-a-confirmar.txt"

if [ "${RECAPTURAR:-0}" = "1" ]; then
  echo "== 1b recapturando las páginas oficiales de hoy"
  node "$REPO/.claude/skills/edicion-referentes/scripts/santiago/capturar.mjs" "$AQUI/storyboard.json" "$AQUI/capturas" --forzar
fi

echo "== 2/5 plan (control contra la receta) -> plan.txt"
"${SANTIAGO[@]}" --out "$S/video.mp4" --sin-aire --plan > "$AQUI/plan.txt" 2>&1
grep -E "⚠|a la vista|aire:|pausas reales|duración" "$AQUI/plan.txt" || true

echo "== 3/5 render completo (1080x1920, 30 fps) -> $S/video.mp4"
T0=$(date +%s)
"${SANTIAGO[@]}" --out "$S/video.mp4" --sin-aire > "$S/render.log" 2>&1
echo "render: $(( $(date +%s) - T0 )) s · $(grep -E '^final:' "$S/render.log")"

echo "== 4/5 regla 15: silencedetect noise=-35dB d=0.3 sobre el audio del render (debe dar 0)"
N=$(ffmpeg -hide_banner -nostats -i "$S/video.mp4" -vn -af "silencedetect=noise=-35dB:d=0.3" -f null - 2>&1 | grep -c silence_start || true)
echo "silencios >= 0,3 s: $N"
[ "$N" = "0" ] || echo "AVISO: la regla 15 NO se cumple; revisar en qué segundos (ffmpeg ... | grep silence_)" >&2

echo "== 5/5 versión liviana 360p -> BORRADOR-no-es-master-360p.mp4"
ffmpeg -v error -y -i "$S/video.mp4" -vf scale=360:-2 -c:v libx264 -crf 30 -preset medium -c:a aac -b:a 64k -movflags +faststart \
  "$AQUI/BORRADOR-no-es-master-360p.mp4"
ls -la "$AQUI/BORRADOR-no-es-master-360p.mp4"
echo "LISTO (borrador, no es master)"
