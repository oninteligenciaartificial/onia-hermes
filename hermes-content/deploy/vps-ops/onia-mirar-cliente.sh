#!/usr/bin/env bash
# ONIA - wrapper de cron del monitor que MIRA las pantallas del cliente.
# Carga las credenciales de Telegram de Hermes (mismo bot que el guardian; NO se
# crea uno nuevo) y corre el chequeo. Sin secretos en este archivo ni en el cron.
#
# VIVE EN:  /root/bin/onia-mirar-cliente.sh  +  /root/bin/onia-mirar-cliente.mjs
#           (en /root/bin y no en /opt/onia porque el .mjs importa playwright-core
#            y node lo resuelve subiendo desde la carpeta DEL ARCHIVO: /root/node_modules)
# CRON:     */15 * * * * /root/bin/onia-mirar-cliente.sh >> /var/log/onia-mirar-cliente.log 2>&1
# APAGAR:   crontab -e y comentar esa linea. El script queda; no borra nada.
# PROBAR:   /root/bin/onia-mirar-cliente.sh --inspeccionar   (mide y NO avisa)
# ESTADO:   /root/.onia-mirar-estado.json  (borrarlo = volver a avisar en el proximo fallo)
set -uo pipefail

set -a
# shellcheck disable=SC1091
. /root/.hermes/.env
set +a

node /root/bin/onia-mirar-cliente.mjs "$@"
codigo=$?

# Un monitor que se muere en silencio es peor que no tener monitor: pareceria
# que todo esta bien. exit 0 = sano, 1 = detecto un fallo (ya aviso el .mjs),
# >=2 = el monitor mismo se rompio. Ese caso se avisa aca, como mucho cada 6 h
# para no convertir una rotura persistente en spam.
if [ "$codigo" -ge 2 ]; then
  AVISADO=/root/.onia-mirar-crash-avisado
  if [ ! -f "$AVISADO" ] || [ "$(find "$AVISADO" -mmin +360 2>/dev/null)" ]; then
    curl -s -o /dev/null --max-time 20 \
      "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
      -d chat_id="${TELEGRAM_HOME_CHANNEL}" -d parse_mode=HTML \
      --data-urlencode text="🟠 <b>Onia — el monitor de pantallas se cayo</b> (exit ${codigo}). Nadie esta mirando el login: ver /var/log/onia-mirar-cliente.log"
    touch "$AVISADO"
  fi
else
  rm -f /root/.onia-mirar-crash-avisado
fi

# El JSON completo de cada corrida sirve para el forense, pero 96 corridas al dia
# engordan el log sin freno. Se conservan las ultimas ~2000 lineas (medio dia).
LOG=/var/log/onia-mirar-cliente.log
if [ -f "$LOG" ] && [ "$(wc -l < "$LOG")" -gt 4000 ]; then
  tail -n 2000 "$LOG" > "$LOG.tmp" && mv "$LOG.tmp" "$LOG"
fi

exit "$codigo"
