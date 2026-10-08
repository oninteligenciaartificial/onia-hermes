#!/usr/bin/env bash
# Hoja de contactos con guías para el QA mirado:   hoja.sh video.mp4 salida.png ancho_de_cada_cuadro t1 t2 t3 ...
#   · cada t es un tiempo en segundos (p. ej. 5.9) o un NÚMERO DE CUADRO con «f» delante (p. ej. f144 = el cuadro 144 = 6,000 s a 24 fps);
#   · COLS=6 hoja.sh … → cuadrícula de 6 columnas (por defecto todo en una fila);
#   · guías: y=1490 (rojo, el pie de Instagram), x=1000 desde y=1000 (magenta, botones de la derecha),
#            y=707 (cian, mentón de K1 + 40) y y=887 (cian claro, mentón de la foto descartada + 40). SIN_GUIAS=1 las apaga.
# ⚠️ ffmpeg con -ss ANTES de -i entrega el primer cuadro con pts ≥ t, no el que contiene a t: con «f144» se pide (144-0,4)/24 s para caer
#    justo en el cuadro 144 (medido el 8-oct: con «t+0,5 cuadro» los rótulos de una hoja de costuras salían corridos 1 cuadro).
set -euo pipefail
V="$1"; OUT="$2"; W="$3"; shift 3
TMP="$(mktemp -d)"; i=0
GUIAS="drawbox=x=0:y=1490:w=1080:h=3:color=red@0.9:t=fill,drawbox=x=1000:y=1000:w=3:h=920:color=magenta@0.9:t=fill,drawbox=x=0:y=707:w=1080:h=2:color=cyan@0.7:t=fill,drawbox=x=0:y=887:w=1080:h=2:color=0x66ffcc@0.6:t=fill,"
[ "${SIN_GUIAS:-0}" = "1" ] && GUIAS=""
ALTO="$(ffprobe -v error -select_streams v -show_entries stream=height -of csv=p=0 "$V")"
[ "$ALTO" = "1920" ] || GUIAS=""     # las guías están en coordenadas de 1080x1920
for t in "$@"; do
  if [[ "$t" == f* ]]; then F="${t#f}"; SS="$(python3 -c "print(round(($F-0.4)/24,4))")"; LAB="f$F $(python3 -c "print(f'{$F/24:.3f}')")s"
  else SS="$t"; LAB="${t}s"; fi
  ffmpeg -v error -y -ss "$SS" -i "$V" -frames:v 1 -vf "${GUIAS}scale=$W:-1,drawtext=text='$LAB':x=6:y=6:fontsize=$((W/9)):fontcolor=yellow:box=1:boxcolor=black@0.6" "$TMP/$(printf '%03d' $i).png"
  i=$((i+1))
done
COLS="${COLS:-$i}"; ROWS=$(( (i + COLS - 1) / COLS ))
ffmpeg -v error -y -framerate 1 -i "$TMP/%03d.png" -vf "tile=${COLS}x${ROWS}:padding=4:color=black" -frames:v 1 "$OUT" 2>&1 | head -3
rm -rf "$TMP"
