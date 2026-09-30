#!/usr/bin/env bash
# Renueva los tokens de Instagram del publicador (duran 60 días; renovar requiere que el token
# tenga >24 h y NO haya vencido). Cron semanal. Avisa SOLO si falla: si se corta en silencio, a
# los 60 días el publicador muere sin que nadie lo vea. El aviso pasa por la aduana única
# (/root/bin/onia-tg.sh, categoría sistema: queda como tarea, no interrumpe a Sergio Urcullo).
# Instalado 29-sep-2026: /root/bin/ig-refrescar.sh + cron `0 13 * * 1` (lunes 09:00 La Paz).
set -uo pipefail
CONF=/root/.config/onia-publicar
tg() { ONIA_AVISO=sistema ONIA_AVISO_EMISOR=publicador /root/bin/onia-tg.sh "$1" >/dev/null 2>&1 || true; }
for f in "$CONF"/ig-*.env; do
  cuenta=$(basename "$f" .env)
  tok=$(grep '^IG_TOKEN=' "$f" | cut -d= -f2-)
  id=$(grep '^IG_USER_ID=' "$f" | cut -d= -f2-)
  r=$(curl -s --max-time 30 "https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${tok}")
  new=$(printf '%s' "$r" | python3 -c 'import sys,json;print(json.load(sys.stdin).get("access_token",""))' 2>/dev/null)
  if [ -n "$new" ]; then
    umask 077; printf 'IG_USER_ID=%s\nIG_TOKEN=%s\n' "$id" "$new" > "$f.tmp" && mv "$f.tmp" "$f"
    echo "$(date -u +%FT%TZ) $cuenta renovado"
  else
    err=$(printf '%s' "$r" | python3 -c 'import sys,json;print(json.load(sys.stdin).get("error",{}).get("message","sin respuesta"))' 2>/dev/null)
    echo "$(date -u +%FT%TZ) $cuenta FALLÓ: $err"
    tg "🔴 <b>Publicador de Instagram</b>: no se pudo renovar el token de <b>${cuenta#ig-}</b> (${err}). Sin renovar, deja de publicar cuando venza."
  fi
done
