#!/usr/bin/env bash
# v2: narracion con pausas (pedido Sergio). Timeline recalculada:
#   B1 0.00-3.73   kling-natural rooftop
#   B2a 3.73-6.73  estudiando (3.0)   B2b 6.73-9.74 gimnasio (3.01)
#   B3 9.74-15.74  trabajando (6.0) + 15.74-17.23 gimnasio-cola (1.49)
#   B4 17.23-23.02 playa (5.79)
set -euo pipefail
B=/c/dev/proyectos/onia-hermes/hermes-content/references/modelos/lucia/tanda-20260821
T=$B/TEST-MOTORES-VIDEO
BR=$B/BROLL-TEST
cd /c/dev/proyectos/onia-hermes/hermes-content/references/modelos/lucia/reel-lanzamiento-20260822
COVER="scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,setsar=1,fps=30,format=yuv420p"

ffmpeg -y -v error \
  -i "$T/03 - KLING color natural (5s).mp4" \
  -i "$BR/VID-02-estudiando-veo-6s.mp4" \
  -i "$BR/VID-04-gimnasio-veo-6s.mp4" \
  -i "$BR/VID-01-trabajando-veo-6s.mp4" \
  -i "$BR/VID-03-playa-veo-6s.mp4" \
  -i audio/v2-beat1.mp3 -i audio/v2-beat2.mp3 -i audio/v2-beat3.mp3 -i audio/v2-beat4.mp3 \
  -filter_complex "\
[0:v]trim=0:3.73,setpts=PTS-STARTPTS,$COVER[v1];\
[1:v]trim=0:3.00,setpts=PTS-STARTPTS,$COVER[v2];\
[2:v]trim=0:3.01,setpts=PTS-STARTPTS,$COVER[v3];\
[3:v]trim=0:6.00,setpts=PTS-STARTPTS,$COVER[v4];\
[2:v]trim=3.01:4.50,setpts=PTS-STARTPTS,$COVER[v5];\
[4:v]trim=0:5.79,setpts=PTS-STARTPTS,$COVER[v6];\
[v1][v2][v3][v4][v5][v6]concat=n=6:v=1:a=0[vout];\
[5:a]aresample=44100,pan=mono|c0=c0[a1];\
[6:a]aresample=44100,pan=mono|c0=c0[a2];\
[7:a]aresample=44100,pan=mono|c0=c0[a3];\
[8:a]aresample=44100,pan=mono|c0=c0[a4];\
aevalsrc=0:d=0.25:s=44100[g1];aevalsrc=0:d=0.25:s=44100[g2];aevalsrc=0:d=0.25:s=44100[g3];\
[a1][g1][a2][g2][a3][g3][a4]concat=n=7:v=0:a=1[aout]" \
  -map "[vout]" -map "[aout]" -c:v libx264 -preset fast -crf 18 -c:a aac -b:a 192k \
  renders/montaje-v2.mp4
ffprobe -v error -show_entries format=duration -of csv=p=0 renders/montaje-v2.mp4
ffmpeg -y -v error -i renders/montaje-v2.mp4 -vn -ac 1 -ar 16000 audio/narracion-v2-16k.wav
echo BUILD_V2_OK
