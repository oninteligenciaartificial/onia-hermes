#!/usr/bin/env bash
# Le escribe a la jefa del proyecto «ONIA · Hermes» (u otra sesión de la nube) desde la PC.
# Uso: jefa.sh "mensaje"   ·   otra sesión: ONIA_SESION=cse_... jefa.sh "mensaje"
set -euo pipefail
[ $# -gt 0 ] || { echo 'uso: jefa.sh "mensaje"'; exit 64; }
claude -p "$*" --cloud "${ONIA_SESION:-cse_011cQSargj5qz516CNpPQEko}" --output-format json
