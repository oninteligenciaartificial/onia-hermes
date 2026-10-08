#!/usr/bin/env bash
# Agenda el video «modo auto» (N03 v2) el vie 9-oct 18:30 La Paz: Instagram (ig-reel.mjs) y, 1-3 min después,
# TikTok, YouTube Shorts y LinkedIn por Buffer. Los archivos ya están en el VPS: /root/publicar/n03-modo-auto/.
# v2 = el video del 1-oct sin la tarjeta final «Comentá COMUNIDAD» (la regla de CLAUDE.md deja fuera ese CTA);
# corta en la pausa de 53,1 s y cierra con «El link está en mi perfil».
# Uso: agendar-n03.sh --ensayo | --agendar
set -euo pipefail
D=/root/publicar/n03-modo-auto V=$D/final-v2.mp4 C=$D/caption-v2.txt
case "${1:-}" in
  --ensayo) ssh -o BatchMode=yes onia-vps "cd /root/bin && node ig-reel.mjs --cuenta sergio --video $V --caption $C" ;;
  --agendar)
    ssh -o BatchMode=yes onia-vps "set -e
      A=/root/bin/agendar-publicacion.sh
      \$A n03-ig '2026-10-09 22:30:00' node /root/bin/ig-reel.mjs --cuenta sergio --video $V --caption $C --publicar
      \$A n03-tt '2026-10-09 22:31:00' node /root/bin/buffer-post.mjs --canal 6abc2906ea19ca0bde28cf75 --video $V --texto $C --meta $D/tt.json --publicar
      \$A n03-yt '2026-10-09 22:32:00' node /root/bin/buffer-post.mjs --canal 6abc2995ea19ca0bde28df15 --video $V --texto $C --meta $D/yt.json --publicar
      \$A n03-li '2026-10-09 22:33:00' node /root/bin/buffer-post.mjs --canal 6abc2a1aea19ca0bde28eda6 --video $V --texto $C --publicar
      \$A --lista | grep n03" ;;
  *) echo "uso: $0 --ensayo | --agendar"; exit 1 ;;
esac
