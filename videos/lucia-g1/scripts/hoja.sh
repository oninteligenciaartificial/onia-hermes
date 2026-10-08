#!/usr/bin/env bash
# Hoja de contactos con guías para el QA mirado: hoja.sh video.mp4 salida.png ancho t1 t2 t3 ...
#   guías: y=1490 (rojo, el pie de Instagram), x=1000 desde y=1000 (magenta, botones de la derecha),
#          y=707 (cian, mentón de K1 + 40) y y=899 (cian claro, mentón de K2 + 40).
set -euo pipefail
V="$1"; OUT="$2"; W="$3"; shift 3
TMP="$(mktemp -d)"; i=0; ARGS=()
for t in "$@"; do
  f="$TMP/$(printf '%03d' $i).png"
  ffmpeg -v error -y -ss "$t" -i "$V" -frames:v 1 -vf "drawbox=x=0:y=1490:w=1080:h=3:color=red@0.9:t=fill,drawbox=x=1000:y=1000:w=3:h=920:color=magenta@0.9:t=fill,drawbox=x=0:y=707:w=1080:h=2:color=cyan@0.7:t=fill,drawbox=x=0:y=899:w=1080:h=2:color=0x66ffcc@0.6:t=fill,scale=$W:-1,drawtext=text='$t':x=6:y=6:fontsize=$((W/12)):fontcolor=yellow:box=1:boxcolor=black@0.6" "$f"
  ARGS+=(-i "$f"); i=$((i+1))
done
N=$i; COLS=${COLS:-$N}
ffmpeg -v error -y "${ARGS[@]}" -filter_complex "$(for ((k=0;k<N;k++)); do printf '[%d:v]' $k; done)hstack=inputs=$N" "$OUT" 2>&1 | head -3
rm -rf "$TMP"
