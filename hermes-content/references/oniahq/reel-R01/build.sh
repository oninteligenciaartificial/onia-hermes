#!/usr/bin/env bash
# Reel R01 de @oniahq — formato P16: escenificacion en 2a persona, rotulada.
# 0 creditos: capturas REALES de producto + placas de codigo. Sin voz, con rotulo.
#
# DOS TRAMPAS QUE COSTARON TIEMPO, anotadas para no repetirlas:
# 1. `zoompan` sobre una imagen de 2160 px tarda MAS DE 10 MINUTOS por clip: re-escala
#    cada fotograma. Se reemplaza por un paneo con `crop` de offset animado.
# 2. Las capturas mezclan vertical (widget, 1240x2200) y apaisada (panel, 2160x1620).
#    Un `scale=ancho:-1` fijo deja la apaisada mas baja que 1920 y `crop` explota con
#    "Invalid too big or non positive size". Va scale que CUBRE + paneo por el eje que
#    tenga holgura; si un eje no tiene, su expresion da 0 sola.
set -euo pipefail
cd "$(dirname "$0")"
DUR=5
pan () { # $1 png  $2 salida
  ffmpeg -y -v error -loop 1 -t $DUR -i "$1" \
    -vf "scale=1242:2208:force_original_aspect_ratio=increase,crop=1080:1920:'(iw-1080)*t/$DUR':'(ih-1920)*t/$DUR',setsar=1,fps=30,format=yuv420p" \
    -c:v libx264 -preset veryfast -crf 20 -an "$2"
}
pan clips/chat.png    clips/b1.mp4
pan clips/bandeja.png clips/b2.mp4
pan clips/panel.png   clips/b3.mp4
# b4 es el mismo panel que b3: se panea al REVES para que no se lea como plano repetido.
ffmpeg -y -v error -loop 1 -t $DUR -i clips/panel.png   -vf "scale=1242:2208:force_original_aspect_ratio=increase,crop=1080:1920:'(iw-1080)*(1-t/$DUR)':'(ih-1920)*(1-t/$DUR)',setsar=1,fps=30,format=yuv420p"   -c:v libx264 -preset veryfast -crf 20 -an clips/b4.mp4
printf "file 'b1.mp4'\nfile 'b2.mp4'\nfile 'b3.mp4'\nfile 'b4.mp4'\n" > clips/lista.txt
ffmpeg -y -v error -f concat -safe 0 -i clips/lista.txt -c copy clips/base.mp4
echo "base: $(ffprobe -v error -show_entries format=duration -of csv=p=0 clips/base.mp4) s"
