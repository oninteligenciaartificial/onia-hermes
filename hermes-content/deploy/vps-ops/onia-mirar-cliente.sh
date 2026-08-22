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

exec node /root/bin/onia-mirar-cliente.mjs "$@"
