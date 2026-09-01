#!/usr/bin/env bash
# v7: SOLO cambia el ultimo clip. Sergio 2026-08-23: "el ultimo clip de L1 pierde
# mucha consistencia".
#
# Diagnostico (mirando frames, no suponiendo): el clip de playa PERDIO LAS PECAS —
# el marcador de identidad del ancla. Se nota el doble porque el plano anterior
# (gimnasio) SI las tiene y estan pegados. Ademas cerraba en plano entero, o sea
# cara chica Y derivada.
#
# Reemplazo: VIDEO-rooftop-veo-8s. Mira a camara, pecas intactas, misma remera y
# misma hora dorada, y el arco del clip construye hacia la sonrisa mas abierta —
# que es lo que pide "Seguime". Ademas cierra donde abrio: bookend deliberado.
# Costo: 0 creditos, el clip ya estaba generado y pago.
#
# Timeline derivada de los cortes REALES del render final (suman 22.1 exacto):
#   B1 0.00-4.20 rooftop kling | B2a 4.20-7.03 estudiando | B2b 7.03-9.87 gimnasio
#   B3 9.87-15.87 trabajando   | cola 15.87-16.40 gimnasio | B4 16.40-22.10 <-- NUEVO
#
# El AUDIO no se toca: se remuxea el del render final, que ya trae voz + SFX +
# master a -14 LUFS. Rehacerlo seria arriesgar una cadena que ya estaba aprobada.
set -euo pipefail
B=/c/dev/proyectos/onia-hermes/hermes-content/references/modelos/lucia/tanda-20260821
T=$B/TEST-MOTORES-VIDEO
BR=$B/BROLL-TEST
cd /c/dev/proyectos/onia-hermes/hermes-content/references/modelos/lucia/reel-lanzamiento-20260822
COVER="scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,setsar=1,fps=30,format=yuv420p"

# 1) montaje solo-video con el clip nuevo al final
ffmpeg -y -v error \
  -i "$T/03 - KLING color natural (5s).mp4" \
  -i "$BR/VID-02-estudiando-veo-6s.mp4" \
  -i "$BR/VID-04-gimnasio-veo-6s.mp4" \
  -i "$BR/VID-01-trabajando-veo-6s.mp4" \
  -i "$B/VIDEO-rooftop-veo-8s.mp4" \
  -filter_complex "\
[0:v]trim=0:4.20,setpts=PTS-STARTPTS,$COVER[v1];\
[1:v]trim=0:2.833,setpts=PTS-STARTPTS,$COVER[v2];\
[2:v]trim=0:2.833,setpts=PTS-STARTPTS,$COVER[v3];\
[3:v]trim=0:6.00,setpts=PTS-STARTPTS,$COVER[v4];\
[2:v]trim=2.833:3.366,setpts=PTS-STARTPTS,$COVER[v5];\
[4:v]trim=2.30:8.00,setpts=PTS-STARTPTS,$COVER[v6];\
[v1][v2][v3][v4][v5][v6]concat=n=6:v=1:a=0[vout]" \
  -map "[vout]" -an -c:v libx264 -preset fast -crf 18 renders/montaje-v7.mp4
echo "montaje-v7: $(ffprobe -v error -show_entries format=duration -of csv=p=0 renders/montaje-v7.mp4)"
