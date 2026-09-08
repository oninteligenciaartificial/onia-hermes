#!/usr/bin/env bash
# Cama de musica para el video: un pad lento, sintetizado con ffmpeg.
#
# Por que sintetizado y no de libreria: las dos rutas de BGM de media-use necesitan lo que
# no hay -- HeyGen pide credencial, Lyria pide GEMINI_API_KEY y MusicGen pide torch (~2 GB).
# Pixabay no expone la URL del mp3 sin interactuar con la pagina. Un pad a -30 dB debajo de
# la voz es textura, no melodia: lo que importa es que no distraiga y que el loop no se note.
#
# Progresion de OCHO acordes en La menor (Am F C G Am Dm F E). El octavo (E) resuelve al
# primero (Am), asi que el punto de loop es musical y no se oye.
#
# Dos cosas que se corrigieron MIRANDO EL ESPECTROGRAMA de la primera version:
#  · Los acordes latian: con afade de 3.2s dentro de cada uno MAS el crossfade, en la union
#    los dos estaban en su fade y la musica casi se apagaba cada 8s. Ahora el fade interno
#    es solo anti-clic (0.6s) y la transicion la hace el crossfade, que es largo (6s).
#  · Toda la energia caia en 100-1100 Hz, que es justo donde vive la voz. Las notas bajaron
#    UNA OCTAVA: el pad ocupa 70-500 Hz, por debajo de la narracion, y no compite con ella.
# Determinista: mismas frecuencias, mismo archivo.
set -e
OUT="${1:-assets/pad.wav}"
DUR="${2:-440}"
TMP=$(mktemp -d)

# acorde: tres notas + dos armonicos suaves + una voz apenas desafinada (calidez)
acorde () {  # $1..$3 = frecuencias, $4 = archivo
  local f1=$1 f2=$2 f3=$3 out=$4
  ffmpeg -v error -f lavfi -i \
"aevalsrc='0.30*sin(2*PI*$f1*t)+0.26*sin(2*PI*$f2*t)+0.22*sin(2*PI*$f3*t)\
+0.09*sin(2*PI*($f1*2)*t)+0.05*sin(2*PI*($f2*2)*t)\
+0.10*sin(2*PI*($f1+0.4)*t)+0.08*sin(2*PI*($f3+0.3)*t)':d=10:s=48000" \
    -af "lowpass=f=1700,afade=t=in:d=3.2:curve=qsin,afade=t=out:st=6.8:d=3.2:curve=qsin" \
    -ac 2 -c:a pcm_s16le -y "$out"
}
acorde 110.00 130.81 164.81 "$TMP/1.wav"   # Am
acorde  87.31 110.00 130.81 "$TMP/2.wav"   # F
acorde 130.81 164.81 196.00 "$TMP/3.wav"   # C
acorde  98.00 123.47 146.83 "$TMP/4.wav"   # G
acorde 110.00 130.81 164.81 "$TMP/5.wav"   # Am
acorde  73.42  87.31 110.00 "$TMP/6.wav"   # Dm
acorde  87.31 110.00 130.81 "$TMP/7.wav"   # F
acorde  82.41 103.83 123.47 "$TMP/8.wav"   # E

# encadenar con crossfade de 2s: los acordes se funden, no se cortan
ffmpeg -v error $(for i in 1 2 3 4 5 6 7 8; do printf -- "-i %s " "$TMP/$i.wav"; done) \
  -filter_complex "[0][1]acrossfade=d=6:c1=tri:c2=tri[a];[a][2]acrossfade=d=6:c1=tri:c2=tri[b];\
[b][3]acrossfade=d=6:c1=tri:c2=tri[c];[c][4]acrossfade=d=6:c1=tri:c2=tri[d];\
[d][5]acrossfade=d=6:c1=tri:c2=tri[e];[e][6]acrossfade=d=6:c1=tri:c2=tri[f];\
[f][7]acrossfade=d=6:c1=tri:c2=tri[g]" -map "[g]" -c:a pcm_s16le -y "$TMP/ciclo.wav"

# reverb largo (aecho) para que respire, y loop hasta cubrir el video
ffmpeg -v error -stream_loop -1 -i "$TMP/ciclo.wav" -t "$DUR" \
  -af "aecho=0.8:0.85:520|900|1350:0.30|0.20|0.12,lowpass=f=1100,volume=0.9" \
  -ac 2 -ar 48000 -c:a pcm_s16le -y "$OUT"
rm -rf "$TMP"
ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT"
