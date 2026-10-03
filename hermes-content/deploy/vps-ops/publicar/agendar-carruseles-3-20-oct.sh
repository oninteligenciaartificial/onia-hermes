#!/usr/bin/env bash
# Sube cada carrusel al VPS y lo agenda en Instagram (@sergiourcullo) a las 16:00 La Paz (20:00 UTC).
# Uso: agendar-carruseles.sh [--ensayo <slug>] | [--agendar]
# Pedido de Sergio Urcullo (2-oct): «programalos para uno al día».
set -euo pipefail
REPO=/home/user/onia-hermes
B=$REPO/hermes-content/carousels/briefs/marca-personal
O=$REPO/hermes-content/carousels/out
CAL=(
  "2026-10-03 sergio-dda-openai-sol-20261001"
  "2026-10-04 sergio-k1-opcion-b-clay-20260929"
  "2026-10-05 sergio-n02-sonnet45-se-apaga-20261001"
  "2026-10-06 sergio-n04-skill-verify-20261001"
  "2026-10-07 sergio-k3v2-claude-md-historia-20260929"
  "2026-10-08 sergio-k11-hook-stop-guarda-20261001"
  "2026-10-09 sergio-k4v2-cinco-pruebas-bot-20260929"
  "2026-10-10 sergio-k9v2-checklist-video-ia-20260929"
  "2026-10-11 sergio-k12-worktrees-sin-pisarse-20261001"
  "2026-10-12 sergio-k5v2-seguimiento-que-no-molesta-20260929"
  "2026-10-13 sergio-k13-loop-sin-api-key-20261001"
  "2026-10-14 sergio-k7v2-carruseles-por-codigo-20260929"
  "2026-10-15 sergio-k8v3-recuperar-vs-reconstruir-20261001"
  "2026-10-16 sergio-k10v2-perilla-de-esfuerzo-20260929"
  "2026-10-17 sergio-k2v3-primera-skill-20261001"
  "2026-10-18 sergio-k6v2-confirmado-por-confirmar-20260929"
  "2026-10-19 sergio-n03-modo-auto-20261001"
  "2026-10-20 sergio-n06-antigravity-cli-20261002"
)
subir() { # slug -> /root/publicar/car-<slug>/ con slide-NN.png + caption.txt
  local slug=$1 n tmp
  n=$(node -e "console.log(require('$B/$slug.json').slides.length)")
  tmp=$(mktemp -d)
  node -e "process.stdout.write(require('$B/$slug.json').caption.trim()+'\n')" > "$tmp/caption.txt"
  for i in $(seq -w 1 "$n"); do cp "$O/$slug/slide-$(printf '%02d' $((10#$i))).png" "$tmp/"; done
  [ "$(ls "$tmp"/slide-*.png | wc -l)" -eq "$n" ] || { echo "faltan láminas en $slug"; exit 1; }
  ssh -o BatchMode=yes onia-vps "rm -rf /root/publicar/car-$slug && mkdir -p /root/publicar/car-$slug"
  tar -C "$tmp" -cf - . | ssh -o BatchMode=yes onia-vps "tar -C /root/publicar/car-$slug -xf -"
  rm -rf "$tmp"
  echo "subido $slug ($n láminas)"
}
case "${1:-}" in
  --ensayo)
    slug=$2; subir "$slug"
    ssh -o BatchMode=yes onia-vps "cd /root/bin && node ig-carrusel.mjs --cuenta sergio --dir /root/publicar/car-$slug --caption /root/publicar/car-$slug/caption.txt" ;;
  --agendar)
    for row in "${CAL[@]}"; do
      set -- $row; dia=$1 slug=$2
      subir "$slug"
      nombre="car-${dia//-/}"
      ssh -o BatchMode=yes onia-vps "/root/bin/agendar-publicacion.sh $nombre '$dia 20:00:00' node /root/bin/ig-carrusel.mjs --cuenta sergio --dir /root/publicar/car-$slug --caption /root/publicar/car-$slug/caption.txt --publicar"
    done
    ssh -o BatchMode=yes onia-vps "/root/bin/agendar-publicacion.sh --lista" ;;
  *) echo "uso: $0 --ensayo <slug> | --agendar"; exit 1 ;;
esac
