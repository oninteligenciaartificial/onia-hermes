#!/usr/bin/env bash
# Registra un contenedor contra su repo. El token de registro llega por STDIN,
# nunca por argumento: asi no queda en `ps`, en logs ni en el historial.
#   gh api -X POST repos/<o>/<r>/actions/runners/registration-token --jq .token \
#     | ssh root@vps 'bash /opt/onia-runner/registrar.sh onia-runner-platform <o>/<r> onia-vps-platform'
set -euo pipefail
CONT=$1 REPO=$2 NOMBRE=$3

# El runner lee ACTIONS_RUNNER_INPUT_<opcion> del entorno; el token se lee de
# stdin DENTRO del contenedor y solo vive en el entorno de config.sh.
docker exec -i "$CONT" bash -c '
  read -r T
  [ -n "$T" ] || { echo "ERR: token vacio"; exit 1; }
  ACTIONS_RUNNER_INPUT_TOKEN="$T" ./config.sh --unattended --replace \
    --url "https://github.com/'"$REPO"'" --name "'"$NOMBRE"'" \
    --labels onia-vps --work _work
'
docker restart "$CONT" >/dev/null
sleep 8
docker logs --tail 5 "$CONT"
