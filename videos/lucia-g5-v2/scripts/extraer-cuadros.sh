#!/usr/bin/env bash
# Extrae de los clips CRUDOS de G2 (ignorados en git; se recuperan a 0 créditos con job_display, ver assets-fijos/ORIGEN.md) los dos cuadros de G5
# y los deja VERSIONADOS en assets-fijos/ (build.mjs usa assets-fijos/ primero y no necesita los clips).
#   fr-m5.jpg : Motor 5 (kling_o3_image_reference_5_refs_948a89d3), cuadro 0, recorte nativo x100 y250 480x600 → cara de 89 px (SCRFD)
#   fr-m4.jpg : Motor 4 (seedance_2_0_mini_start_mas_3_refs_dd2d7c91), cuadro 96 (t = 4,0 s), recorte nativo x0 y0 620x680, con los letreros inventados
#               de la torre (x 0-220, y 40-130) DIFUMINADOS con pluma: el primero se lee como «DMSS»/«DVOSS» y podría confundirse con una marca (decisión de G5).
# Uso: bash scripts/extraer-cuadros.sh [DIR_DE_LOS_CLIPS]   (por defecto ../lucia-g2/assets)
set -euo pipefail
P="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CLIPS="${1:-$P/../lucia-g2/assets}"
T="$(mktemp -d)"
ffmpeg -v error -y -i "$CLIPS/m5.mp4" -vf "select=eq(n\,0)" -vsync 0 -frames:v 1 "$T/m5.png"
ffmpeg -v error -y -i "$T/m5.png" -vf "crop=480:600:100:250" -q:v 2 -frames:v 1 -update 1 "$P/assets-fijos/fr-m5.jpg"
ffmpeg -v error -y -i "$CLIPS/m4.mp4" -vf "select=eq(n\,96)" -vsync 0 -frames:v 1 "$T/m4.png"
# difuminado con pluma en UN paso en RGB (format=gbrp + gblur + maskedmerge; salida yuvj420p): dos pasos por YUV corren los colores (v4/prueba-motores-20261008/fotos-limpias/README.md)
X0=0; Y0=40; X1=220; Y1=130; F=14; SIGMA=3.5
ffmpeg -v error -y -i "$T/m4.png" -filter_complex \
  "[0:v]crop=620:680:0:0,format=gbrp,split=2[o][b];[b]gblur=sigma=${SIGMA}:steps=2[bl];\
color=c=black:s=620x680,format=gray,geq=lum='255*max(0,min(1,min(min(X-${X0},${X1}-X),min(Y-${Y0},${Y1}-Y))/${F}))'[mk];\
[mk]format=gbrp[mkr];[o][bl][mkr]maskedmerge,format=yuvj420p" -q:v 2 -frames:v 1 -update 1 "$P/assets-fijos/fr-m4.jpg"
rm -rf "$T"
echo "ok: assets-fijos/fr-m5.jpg y fr-m4.jpg"
