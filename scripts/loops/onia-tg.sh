#!/usr/bin/env bash
# ONIA — el reemplazo de PushNotification para los loops que corren en el VPS.
#
# PushNotification es una herramienta de la app de Claude Code y NO existe fuera
# de ella: un loop mudado al VPS se queda mudo. Este script es el unico canal por
# el que un loop del VPS le habla a Sergio.
#
# parse_mode=HTML a proposito: el nodo/bot de Telegram rompe con Markdown — un
# guion bajo suelto y el mensaje NO llega.
#
# Uso:  onia-tg.sh "texto <b>con HTML</b>"
set -uo pipefail
MSG="${1:?uso: onia-tg.sh \"mensaje\"}"
set -a; . /root/.hermes/.env 2>/dev/null; set +a
curl -s -o /dev/null --max-time 20 \
  "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
  -d chat_id="${TELEGRAM_HOME_CHANNEL}" \
  -d parse_mode=HTML \
  --data-urlencode text="$MSG"
