#!/usr/bin/env bash
# Montaje del reel de lanzamiento de Lucia — 4 beats, voz en off, sin lipsync.
# Timeline (gaps de 0.25s entre beats):
#   B1 0.00-2.76  kling-natural rooftop (cara a camara)      [voz: "No soy real..."]
#   B2a 2.76-5.45 estudiando cafe                            [voz: "Soy Lucia..."]
#   B2b 5.45-8.16 gimnasio
#   B3 8.16-14.59 trabajando laptop (retime 1.07x, imperceptible)  [voz: "Estoy aca..."]
#   B4 14.59-19.60 playa sonrisa caminando a camara          [voz: "No escondo..."]
set -euo pipefail
B=/c/dev/proyectos/onia-hermes/hermes-content/references/modelos/lucia/tanda-20260821
T=$B/TEST-MOTORES-VIDEO
BR=$B/BROLL-TEST
cd /c/dev/proyectos/onia-hermes/hermes-content/references/modelos/lucia/reel-lanzamiento-20260822

# COVER = escalar y recortar a 1080x1920 (los veo son 720x1280 9:16 exacto; kling 828x1108 se recorta)
COVER="scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,setsar=1,fps=30,format=yuv420p"

ffmpeg -y -v error \
  -i "$T/03 - KLING color natural (5s).mp4" \
  -i "$BR/VID-02-estudiando-veo-6s.mp4" \
  -i "$BR/VID-04-gimnasio-veo-6s.mp4" \
  -i "$BR/VID-01-trabajando-veo-6s.mp4" \
  -i "$BR/VID-03-playa-veo-6s.mp4" \
  -i audio/beat1.mp3 -i audio/beat2.mp3 -i audio/beat3.mp3 -i audio/beat4.mp3 \
  -filter_complex "\
[0:v]trim=0:2.76,setpts=PTS-STARTPTS,$COVER[v1];\
[1:v]trim=0:2.69,setpts=PTS-STARTPTS,$COVER[v2];\
[2:v]trim=0:2.71,setpts=PTS-STARTPTS,$COVER[v3];\
[3:v]trim=0:6.00,setpts=(PTS-STARTPTS)*1.0717,$COVER[v4];\
[4:v]trim=0:5.01,setpts=PTS-STARTPTS,$COVER[v5];\
[v1][v2][v3][v4][v5]concat=n=5:v=1:a=0[vout];\
[5:a]aresample=44100,pan=mono|c0=c0[a1];\
[6:a]aresample=44100,pan=mono|c0=c0[a2];\
[7:a]aresample=44100,pan=mono|c0=c0[a3];\
[8:a]aresample=44100,pan=mono|c0=c0[a4];\
aevalsrc=0:d=0.25:s=44100[g1];aevalsrc=0:d=0.25:s=44100[g2];aevalsrc=0:d=0.25:s=44100[g3];\
[a1][g1][a2][g2][a3][g3][a4]concat=n=7:v=0:a=1[aout]" \
  -map "[vout]" -map "[aout]" -c:v libx264 -preset fast -crf 18 -c:a aac -b:a 192k \
  renders/montaje.mp4

ffprobe -v error -show_entries format=duration -of csv=p=0 renders/montaje.mp4
# narracion sola para transcribir (16k mono wav)
ffmpeg -y -v error -i renders/montaje.mp4 -vn -ac 1 -ar 16000 audio/narracion-16k.wav
echo BUILD_OK
