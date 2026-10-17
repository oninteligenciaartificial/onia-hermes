#!/usr/bin/env bash
# Control de cara de Lucía en la nube (8-oct-2026). Mide FOTOS o CUADROS de video contra las 8 referencias oficiales
# del repo (v4/qa/manifest-escenas-seedream-20260930.json) y las caras negativas que calibran el piso.
#
# Uso:   face-gate.sh foto1.jpg foto2.png clip.mp4[@0,2,4.5] ...
#   - una foto se mide tal cual;
#   - un video se mide en los segundos que se pidan después de «@» (por defecto 0, mitad y final), extrayendo cuadros con ffmpeg.
# Salida: tabla «archivo  centroide  min_ref  max_ref  veredicto» y el JSON completo en $FACE_GATE_OUT (por defecto /tmp/face-gate-out.json).
# Gate del repo: ≥ 0,70 en caras frontales o de tres cuartos de 200 px o más; perfiles, parpadeos y caras chicas se MIRAN.
# Primera vez: crea el venv (pip: opencv-python-headless, onnx, onnxruntime, numpy, pillow) y baja buffalo_l (~280 MB) de GitHub.
# Todo vive FUERA del repo, en $FACE_GATE_HOME (por defecto /tmp/lucia-face-gate). No toca producción ni gasta créditos.
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../.." && pwd)"
HOME_DIR="${FACE_GATE_HOME:-/tmp/lucia-face-gate}"
OUT="${FACE_GATE_OUT:-/tmp/face-gate-out.json}"
MANIFEST_BASE="$ROOT/hermes-content/references/modelos/lucia/v4/qa/manifest-escenas-seedream-20260930.json"
mkdir -p "$HOME_DIR/frames"
if [ ! -x "$HOME_DIR/venv/bin/python" ]; then
  python3 -m venv "$HOME_DIR/venv"
  "$HOME_DIR/venv/bin/pip" install -q opencv-python-headless onnx onnxruntime numpy pillow
fi
[ "$#" -ge 1 ] || { echo "uso: face-gate.sh archivo[.mp4@seg,seg] ..." >&2; exit 2; }
TESTS=()
for arg in "$@"; do
  f="${arg%%@*}"; secs=""
  [[ "$arg" == *"@"* ]] && secs="${arg#*@}"
  case "${f,,}" in
    *.mp4|*.mov|*.webm)
      dur="$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$f")"
      [ -n "$secs" ] || secs="0,$(python3 -c "print(round($dur/2,2))"),$(python3 -c "print(round(max($dur-0.15,0),2))")"
      IFS=',' read -ra S <<< "$secs"
      for s in "${S[@]}"; do
        o="$HOME_DIR/frames/$(basename "${f%.*}")_t${s}.png"
        ffmpeg -v error -y -ss "$s" -i "$f" -frames:v 1 "$o"; TESTS+=("$o")
      done ;;
    *) TESTS+=("$(cd "$(dirname "$f")" && pwd)/$(basename "$f")") ;;
  esac
done
TESTS_JSON="$(printf '%s\n' "${TESTS[@]}" | python3 -c "import sys,json; print(json.dumps({l.strip().split('/')[-1]:l.strip() for l in sys.stdin if l.strip()}))")"
python3 - "$MANIFEST_BASE" "$HOME_DIR/manifest.json" "$TESTS_JSON" <<'PY'
import json, sys
base = json.load(open(sys.argv[1]))
json.dump({"refs": base["refs"], "negatives": base["negatives"], "tests": json.loads(sys.argv[3])}, open(sys.argv[2], "w"))
PY
FACE_QA_MODELS="$HOME_DIR/models" "$HOME_DIR/venv/bin/python" "$ROOT/scripts/face_identity_qa.py" "$HOME_DIR/manifest.json" > "$OUT"
python3 - "$OUT" <<'PY'
import json, sys
d = json.load(open(sys.argv[1]))
neg = d.get("negatives_max")
print(f"piso de caras negativas (max): {neg}   gate del repo: 0,70")
print(f"{'archivo':46} {'centroide':>9} {'min_ref':>8} {'max_ref':>8} {'cara_px':>8}  veredicto")
for k, v in d["images"].items():
    if v.get("group") != "tests":
        continue
    s = d["scores"].get(k)
    if v.get("error") or not s:
        print(f"{k[:46]:46} {'—':>9} {'—':>8} {'—':>8} {'—':>8}  SIN CARA DETECTADA ({v.get('error','')})"); continue
    px = v.get("face_px", 0)
    ver = "OK" if s["centroid"] >= 0.70 else "BAJO: mirar"
    if px < 200: ver += " (cara < 200 px: poco confiable)"
    print(f"{k[:46]:46} {s['centroid']:>9.3f} {s['min_ref']:>8.3f} {s['max_ref']:>8.3f} {px:>8}  {ver}")
PY
