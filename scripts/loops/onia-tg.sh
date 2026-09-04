#!/usr/bin/env bash
# ONIA — manda un mensaje HTML al Telegram de Sergio y VERIFICA que Telegram lo acepto.
# Hasta el 2026-09-03 tiraba la respuesta (-o /dev/null): un HTML mal formado o un timeout
# se perdia en silencio y el que llamaba creia que aviso (tarea t_2f7ac300). Ahora: exit 1
# si no vuelve "ok":true, y cada envio deja una linea en /var/log/onia-tg.log.
set -uo pipefail
MSG="${1:?uso: onia-tg.sh \"mensaje\"}"
set -a; . /root/.hermes/.env 2>/dev/null; set +a
LOG=/var/log/onia-tg.log
RESP=$(curl -s --max-time 20 \
  "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
  -d chat_id="${TELEGRAM_HOME_CHANNEL}" \
  -d parse_mode=HTML \
  --data-urlencode text="$MSG" 2>&1)
if printf "%s" "$RESP" | grep -q "\"ok\":true"; then
  MID=$(printf "%s" "$RESP" | grep -o "\"message_id\":[0-9]*" | head -1 | cut -d: -f2)
  printf "%s OK message_id=%s bytes=%s\n" "$(date -u +%FT%TZ)" "${MID:-?}" "${#MSG}" >> "$LOG"
  exit 0
fi
printf "%s FALLO bytes=%s resp=%s\n" "$(date -u +%FT%TZ)" "${#MSG}" "$(printf "%s" "$RESP" | head -c 300)" >> "$LOG"
echo "onia-tg.sh: Telegram no acepto el mensaje: $(printf "%s" "$RESP" | head -c 200)" >&2
exit 1
