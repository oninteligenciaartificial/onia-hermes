#!/usr/bin/env bash
# El TABLERO de Onia — un solo tablero para todas las sesiones y todos los loops.
#
# POR QUE EXISTE: hasta el 2026-09-02 las colas eran archivos markdown, y dos
# carriles que cerraban items DISTINTOS del mismo archivo daban conflicto igual,
# porque las lineas estaban pegadas. Medido ese dia, con dos ramas de prueba:
# git no puede separar la linea 3 de la linea 4. La regla escrita ("el que MIRA
# agrega, el que ARREGLA marca") solo ayuda si las ediciones quedan lejos.
#
# El tablero de Hermes no tiene ese problema: cada tarea es una FILA en SQLite y
# se reclama con un cerrojo atomico. Probado el mismo dia, dos agentes a la vez:
#   [chatbot]  Claimed t_f42ff607
#   [webventa] cannot claim t_f42ff607: status=running lock=srv1360183:81929
#
# Vive en el VPS. Este script es el atajo para usarlo desde CUALQUIER lado
# (Windows con Git Bash, otra sesion de Claude Code, o el VPS mismo) contra el
# MISMO tablero — que es lo que hace que no se pisen.
#
# Uso:
#   scripts/kanban/tablero.sh list
#   scripts/kanban/tablero.sh create "Titulo de la tarea" --body "detalle" --priority 1
#   PERFIL=carril-chatbot scripts/kanban/tablero.sh claim t_abc123
#   PERFIL=carril-chatbot scripts/kanban/tablero.sh complete t_abc123
#   scripts/kanban/tablero.sh show t_abc123
set -uo pipefail

VPS="${ONIA_VPS:-root@187.77.16.63}"
LLAVE="${ONIA_VPS_KEY:-$HOME/.ssh/onia_hermes_vps_ed25519}"
TABLERO="${ONIA_TABLERO:-onia}"
# Quien reclama. SIEMPRE poner uno propio: es lo que hace legible quien tiene que
# el cerrojo cuando una tarea aparece tomada.
PERFIL="${PERFIL:-${HERMES_PROFILE:-sesion-anonima}}"

if [ $# -eq 0 ]; then
  sed -n '2,25p' "$0" | sed 's/^# \{0,1\}//'
  exit 64
fi

PYTHON="${ONIA_HERMES_PY:-/usr/local/lib/hermes-agent/venv/bin/python}"
HERMES="$PYTHON -m hermes_cli.main"

# HOME=/root en LAS DOS ramas, a proposito: el CLI resuelve por HOME donde vive
# el SQLite del tablero. Si la rama local heredara otro HOME leeria OTRO tablero,
# y un script que promete "el MISMO tablero desde cualquier lado" pasaria a ser
# justo la segunda fuente de verdad que CLAUDE.md prohibe.

# ¿Ya estamos DENTRO del VPS? Entonces no hay que salir por SSH a nuestra propia IP.
#
# Nace del 2026-09-02, el mismo dia en que se escribio este script: se penso para
# Windows con Git Bash, pero ese mismo dia los nueve loops se mudaron al VPS, y
# desde adentro `ssh root@187.77.16.63` buscaba una llave que en el VPS no existe
# (`/root/.ssh/onia_hermes_vps_ed25519`). `tablero.sh list` moria con "Permission
# denied (publickey)" para TODOS los loops del cron — y el prompt de cada uno dice
# "el tablero va primero". El tablero unico quedaba ilegible justo para las nueve
# sesiones que mas lo necesitan, y cada una seguia de largo con su markdown.
#
# La prueba es el INTERPRETE, no la IP ni el hostname: la pregunta real es "¿puedo
# correr el CLI sin salir a la red?". Un hostname se renombra y una IP se mueve;
# si el binario esta y es ejecutable, el SSH sobra.
if [ -x "$PYTHON" ]; then
  export HOME=/root HERMES_PROFILE="$PERFIL"
  exec $HERMES kanban --board "$TABLERO" "$@"
fi

# Las comillas de cada argumento se preservan para que un titulo con espacios
# llegue entero al otro lado.
ARGS=""
for a in "$@"; do ARGS="$ARGS $(printf '%q' "$a")"; done

exec ssh -i "$LLAVE" -o StrictHostKeyChecking=no "$VPS" \
  "export HOME=/root HERMES_PROFILE=$(printf '%q' "$PERFIL"); $HERMES kanban --board $(printf '%q' "$TABLERO")$ARGS"
