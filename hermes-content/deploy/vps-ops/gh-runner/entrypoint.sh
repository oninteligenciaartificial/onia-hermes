#!/bin/bash
# Sin registrar, el contenedor espera: el registro se hace una vez con
# registrar.sh (token por stdin) y despues `docker restart`.
set -e
cd /home/runner/actions-runner
if [ ! -f .runner ]; then
  echo "runner sin registrar: correr registrar.sh y reiniciar el contenedor"
  exec sleep infinity
fi
exec ./run.sh
