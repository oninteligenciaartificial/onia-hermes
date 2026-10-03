#!/usr/bin/env bash
# L08 — pipeline completo, de los assets al feed (INSTRUCCION § ORDEN). Costo 0: todo local.
# Uso: bash videos/lucia-l08/scripts/render.sh      (desde cualquier carpeta)
set -euo pipefail
P="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
R="$(cd "$P/../.." && pwd)"
ES="$R/.claude/skills/editor-videos/scripts"
cd "$P"
DUR=9.625   # 231 cuadros a 24 fps: el clip recortado 0,40 s, SIN tpad (corrección del 2-oct: el final ya no se congela)

# 1. assets (HTML/CSS → PNG con alfa @2x) + velo
node "$ES/make-mockup.mjs" --template custom --html-file assets/html/tag-ia.html --title "Lucía · personaje creado con IA" --accent "#10C26B" --width 1000 --out assets/tag-ia.png
for s in base "solo r1" "solo r2" "solo r3"; do
  n="${s#solo }"
  node "$ES/make-mockup.mjs" --template custom --html-file assets/html/panel-recordatorio.html --value "$s" --accent "#10C26B" --width 1000 --out "assets/panel-$n.png"
done
node "$ES/make-mockup.mjs" --template custom --html-file assets/html/sello-dedo.html --title "NO MOVÉS UN DEDO." --accent "#10C26B" --width 1000 --out assets/sello-dedo.png
python3 scripts/make-velo.py
# SFX sin el silencio inicial (corrección del 2-oct): sfx.mjs toma «at» como el ARRANQUE del archivo y la librería trae
# el golpe adentro (ping.mp3 a 0,323 s, pop.mp3 a 0,116 s, medido). Recortados, el golpe cae a ~15 ms del «at» del plan
# y la ventana de ducking (que también arranca en «at») lo cubre.
LIB="$R/.agents/skills/media-use/audio/assets/sfx"
mkdir -p assets/sfx
ffmpeg -hide_banner -loglevel error -y -i "$LIB/ping.mp3" -af "atrim=start=0.31,asetpts=PTS-STARTPTS" assets/sfx/ping-l08.wav
ffmpeg -hide_banner -loglevel error -y -i "$LIB/pop.mp3"  -af "atrim=start=0.10,asetpts=PTS-STARTPTS" assets/sfx/pop-l08.wav

# 2. tiempos clavados a la palabra (storyboard en palabras → sync-plan.json)
node "$ES/sync-plan.mjs" --segments scripts/segments.json --storyboard scripts/storyboard.json --lead -0.15 --fade 0.15 --duration "$DUR" --out scripts/sync-plan.json

# 3. gen1 en una pasada (CRF 14 slow) → 4. karaoke (gen2, CRF 14 slow)
node scripts/build.mjs
node scripts/karaoke.mjs

# 5. SFX (copia el video) → 6. master −14 LUFS / pico −1,8 dBTP (copia el video) → cola de audio al largo del video
node "$ES/sfx.mjs" --video renders/karaoke.mp4 --plan scripts/sfx-plan.json --out renders/sfx.mp4
node "$ES/master.mjs" --video renders/sfx.mp4 --out renders/master-l08.mp4 --tp -1.8
ffmpeg -hide_banner -loglevel error -y -i renders/master-l08.mp4 -map 0 -c copy -t "$DUR" -movflags +faststart final/l08.mp4

# 7. feed + preview 360p
cp final/l08.mp4 "$R/hermes-content/references/modelos/lucia/v4/feed/l08-recordatorio-sin-mover-un-dedo.mp4"
ffmpeg -hide_banner -loglevel error -y -i final/l08.mp4 -vf "scale=360:640:flags=lanczos" -c:v libx264 -crf 28 -preset medium \
  -pix_fmt yuv420p -colorspace bt709 -color_primaries bt709 -color_trc bt709 -c:a aac -b:a 96k -movflags +faststart renders/preview-360.mp4
echo "OK → $P/final/l08.mp4 · feed · renders/preview-360.mp4"
