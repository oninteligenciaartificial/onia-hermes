#!/usr/bin/env bash
# Prepara las imágenes del control de ArcFace master ↔ fuente (9 pares): cuadros del master y la foto original llevada al MISMO encuadre del lienzo.
#   B1 (K4 a pantalla completa): master f12, f36, f60 contra K4 cover a 1080x1920.
#   B2 (paneles, antes de los aros): master f78, f84, f96 recortados al panel de K4 (540x880 en 0,370) y al de R3 (540x880 en 540,370) contra cada foto escalada igual.
# Uso: bash scripts/recortes-arcface.sh out/<master>.mp4 <carpeta-de-salida>     (escribe args.txt con las rutas para face-gate.sh)
set -euo pipefail
M="$1"; D="$2"; P="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
mkdir -p "$D"; : > "$D/args.txt"
OX=$(node -e "console.log(require('$P/plan.json').paneles.r3.ox)"); PY=$(node -e "console.log(require('$P/plan.json').paneles.y)")
KH=$(node -e "const p=require('$P/plan.json');console.log(Math.round(p.fotos.k4.alto*p.paneles.w/p.fotos.k4.ancho))"); RW=$(node -e "const p=require('$P/plan.json');console.log(Math.round(p.fotos.r3.ancho*p.paneles.h/p.fotos.r3.alto))")
fr(){ ffmpeg -v error -y -i "$M" -vf "select=eq(n\,$1)$2" -frames:v 1 "$3"; }
ffmpeg -v error -y -i "$P/assets/k4.png" -vf "scale=-2:1920:flags=bilinear,crop=1080:1920" "$D/fuente-b1-k4.png"; echo "$D/fuente-b1-k4.png" >> "$D/args.txt"
for f in 12 36 60; do fr $f "" "$D/master-b1-f$f.png"; echo "$D/master-b1-f$f.png" >> "$D/args.txt"; done
ffmpeg -v error -y -i "$P/assets/k4.png" -vf "scale=540:$KH:flags=bilinear,crop=540:880:0:0" "$D/fuente-b2-k4.png"; echo "$D/fuente-b2-k4.png" >> "$D/args.txt"
ffmpeg -v error -y -i "$P/assets/r3.png" -vf "scale=$RW:880:flags=bilinear,crop=540:880:$OX:0" "$D/fuente-b2-r3.png"; echo "$D/fuente-b2-r3.png" >> "$D/args.txt"
for f in 78 84 96; do fr $f ",crop=540:880:0:$PY" "$D/master-b2-k4-f$f.png"; fr $f ",crop=540:880:540:$PY" "$D/master-b2-r3-f$f.png"; echo "$D/master-b2-k4-f$f.png $D/master-b2-r3-f$f.png" >> "$D/args.txt"; done
echo "$D/args.txt:"; cat "$D/args.txt"
