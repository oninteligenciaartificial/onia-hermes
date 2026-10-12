#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
ORIGINAL="${1:-../media-review-n06/N02-borrador-original-Claude.mp4}"
ffmpeg -hide_banner -loglevel error -i "$ORIGINAL" \
  -filter_complex "[0:v]split=2[v0][v1];[v0]trim=end_frame=3087,setpts=PTS-STARTPTS[va];[v1]trim=start_frame=3155,setpts=PTS-STARTPTS[vb];[0:a]asplit=2[a0][a1];[a0]atrim=end=102.9,asetpts=PTS-STARTPTS[aa];[a1]atrim=start=105.166666666667,asetpts=PTS-STARTPTS[ab];[va][aa][vb][ab]concat=n=2:v=1:a=1[v][a]" \
  -map "[v]" -map "[a]" -c:v libx264 -preset fast -crf 0 -pix_fmt yuv420p \
  -c:a aac -b:a 192k -movflags +faststart -y N02-preview-sin-arranque-falso.mp4
