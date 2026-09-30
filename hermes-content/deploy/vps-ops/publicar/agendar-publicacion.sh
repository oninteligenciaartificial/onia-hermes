#!/usr/bin/env bash
# Agenda UNA publicación ya aprobada para una hora exacta (UTC) con un timer transitorio de systemd.
# Sin cola persistente a propósito: si el VPS se reinicia, lo agendado se pierde y NO sale (falla
# segura; el 4-sep la cola vieja de Postiz publicó 5 posts sin OK al encenderse). Solo Instagram lo
# necesita: TikTok, Shorts y LinkedIn se agendan en Buffer con `buffer-post.mjs --cuando`.
#   agendar-publicacion.sh <nombre> "2026-09-30 16:30:00" node /root/bin/ig-reel.mjs ... --publicar
#   agendar-publicacion.sh --lista               # lo que falta salir
#   agendar-publicacion.sh --cancelar <nombre>
# Resultado: journalctl -u pub-<nombre>; si publicó, /root/publicar/publicado.jsonl.
# Si el comando falla, avisa por la aduana única /root/bin/onia-tg.sh (categoría sistema: queda como
# tarea en el tablero, no interrumpe a Sergio Urcullo). Nunca curl directo a Telegram.
set -euo pipefail

case "${1:-}" in
  --lista) exec systemctl list-timers 'pub-*' --all --no-pager ;;
  --cancelar) systemctl stop "pub-${2:?nombre}.timer"; echo "cancelado pub-$2"; exit ;;
  --correr)
    nombre=$2; shift 2
    if out=$("$@" 2>&1); then echo "$out"; exit 0; fi
    echo "$out"
    txt=$(printf 'Publicación agendada %s falló: %s' "$nombre" \
      "$(tail -c 400 <<<"$out" | sed 's/&/\&amp;/g; s/</\&lt;/g; s/>/\&gt;/g')")
    ONIA_AVISO=sistema ONIA_AVISO_EMISOR=publicador /root/bin/onia-tg.sh "$txt" >/dev/null 2>&1 || true
    exit 1 ;;
esac

nombre=${1:?nombre} cuando=${2:?hora UTC}; shift 2
[[ $nombre =~ ^[a-z0-9-]+$ ]] || { echo "nombre: solo a-z, 0-9 y guiones"; exit 1; }
t=$(date -u -d "$cuando" +%s) || { echo "hora inválida: $cuando"; exit 1; }
(( t > $(date +%s) + 30 )) || { echo "la hora ya pasó o faltan menos de 30 s: $cuando UTC"; exit 1; }
(( $# )) || { echo "falta el comando a correr"; exit 1; }
systemd-run --quiet --unit="pub-$nombre" --on-calendar="$(date -u -d "@$t" '+%F %T') UTC" \
  --timer-property=AccuracySec=1s "$(readlink -f "$0")" --correr "$nombre" "$@"
echo "agendado pub-$nombre: $(date -u -d "@$t" '+%F %T') UTC = $(TZ=America/La_Paz date -d "@$t" '+%H:%M') en La Paz"
