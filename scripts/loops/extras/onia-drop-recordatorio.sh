#!/usr/bin/env bash
# Recordatorio del drop del dia — 18:45 La Paz (22:45 UTC), diario.
# Manda a Telegram el drop listo-para-pegar 15 min antes de la hora de publicar
# (19:00). Sin IA: lee el archivo que el loop marca-personal dejo escrito.
# Cron: 45 22 * * *   Log: /var/log/onia-drop-recordatorio.log
set -uo pipefail
REPO=/root/loops/onia-hermes
HOY=$(TZ=America/La_Paz date +%F)
F="$REPO/hermes-content/docs/cola/drops/$HOY.md"

git -C "$REPO" fetch origin --quiet 2>/dev/null || true
git -C "$REPO" merge --ff-only origin/main --quiet 2>/dev/null || true

if [ -f "$F" ]; then
  CUERPO=$(head -c 3200 "$F" | sed 's/&/\&amp;/g; s/</\&lt;/g; s/>/\&gt;/g')
  /root/bin/onia-tg.sh "📬 <b>Drop de hoy — publicar 19:00</b> (docs/cola/drops/$HOY.md)

<pre>$CUERPO</pre>" >/dev/null && echo "$(date -u +%FT%TZ) enviado drop $HOY"
else
  /root/bin/onia-tg.sh "⚠️ <b>No hay drop escrito para hoy</b> ($HOY). El loop marca-personal no lo dejo — revisar antes de las 19:00." >/dev/null
  echo "$(date -u +%FT%TZ) SIN drop para $HOY"
fi
