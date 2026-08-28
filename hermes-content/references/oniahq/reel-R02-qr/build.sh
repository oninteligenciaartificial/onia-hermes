#!/usr/bin/env bash
# Reel R02 de @oniahq — el dato del QR, con las ilustraciones de O09.
#
# POR QUE ESTE Y NO EL DEL MODULO CATALOGO que pedia el plan: no existe captura del
# modulo. Capturarla es del carril de producto, no de este, y un reel que dice mostrar
# el catalogo sin mostrarlo seria justamente la falta que el gate existe para evitar.
#
# Las dos trampas de R01 siguen vigentes y por eso se conserva el mismo metodo:
# 1. `zoompan` sobre imagenes grandes tarda mas de 10 min por clip. Se usa paneo con
#    `crop` de offset animado.
# 2. `scale` fijo por un solo eje revienta con `crop` cuando la imagen no cubre. Va
#    scale que CUBRE y paneo por el eje con holgura.
# 3. Las ilustraciones traen borde de papel: con el escalado justo el paneo llegaba
#    al borde y aparecian bandas claras. Se agranda el encuadre para entrar adentro.
set -euo pipefail
cd "$(dirname "$0")"
DUR=5
pan () { # $1 png  $2 salida  $3 sentido (1 = normal, -1 = invertido)
  local expr_x expr_y
  if [ "${3:-1}" = "1" ]; then expr_x="(iw-1080)*t/$DUR"; expr_y="(ih-1920)*t/$DUR"
  else expr_x="(iw-1080)*(1-t/$DUR)"; expr_y="(ih-1920)*(1-t/$DUR)"; fi
  ffmpeg -y -v error -loop 1 -t $DUR -i "$1" \
    -vf "scale=1500:2666:force_original_aspect_ratio=increase,crop=1080:1920:'$expr_x':'$expr_y',setsar=1,fps=30,format=yuv420p" \
    -c:v libx264 -preset veryfast -crf 20 -an "$2"
}
# El sentido del paneo alterna: dos planos seguidos moviendose igual se leen como uno solo.
pan clips/a1.png clips/b1.mp4 1
pan clips/a2.png clips/b2.mp4 -1
pan clips/a3.png clips/b3.mp4 1
pan clips/a4.png clips/b4.mp4 -1
printf "file 'b1.mp4'\nfile 'b2.mp4'\nfile 'b3.mp4'\nfile 'b4.mp4'\n" > clips/lista.txt
ffmpeg -y -v error -f concat -safe 0 -i clips/lista.txt -c copy clips/base.mp4
echo "base: $(ffprobe -v error -show_entries format=duration -of csv=p=0 clips/base.mp4) s"
