#!/usr/bin/env bash
# ONIA — un loop deja un hecho aprendido en la memoria compartida.
#
# Uso:  /root/bin/onia-aprender.sh "<hecho, 1-3 frases, con el por qué>"
#
# POR QUE NO ESCRIBE DIRECTO EN MEMORY.md: son 15 loops corriendo a la vez.
# Quince procesos haciendo `>> MEMORY.md` al mismo tiempo es como se corrompe un
# archivo, y una memoria corrupta es peor que ninguna porque parece que anda.
# Cada loop deja SU archivo en una bandeja de entrada; un consolidador (uno solo,
# con cerrojo) los mete en MEMORY.md de a uno. Sergio, 2026-09-03: "que los loops
# usen la memoria de hermes tambien, pero haz que funcione".
set -uo pipefail

HECHO="${1:?uso: onia-aprender.sh \"<hecho aprendido>\"}"
INBOX="${ONIA_MEMORIA_INBOX:-/root/.hermes/memories/inbox}"
QUIEN="${ONIA_LOOP_ID:-${HERMES_PROFILE:-desconocido}}"

# Un hecho tiene que ser un hecho: ni un log pegado, ni una frase suelta.
LARGO=${#HECHO}
if [ "$LARGO" -lt 40 ]; then
  echo "rechazado: demasiado corto ($LARGO chars) — un hecho lleva el que y el por que" >&2
  exit 2
fi
if [ "$LARGO" -gt 1200 ]; then
  echo "rechazado: demasiado largo ($LARGO chars) — eso es un log, no un hecho" >&2
  exit 2
fi

mkdir -p "$INBOX" || exit 1
SELLO=$(date -u '+%Y%m%dT%H%M%SZ')
ARCHIVO="$INBOX/$SELLO-$QUIEN-$$.md"
# Se firma con quien y cuando lo aprendio: sin eso, en un mes nadie sabe si el
# hecho sigue vigente ni a quien preguntarle.
printf '%s\n— aprendido por %s, %s\n' "$HECHO" "$QUIEN" "$(TZ=America/La_Paz date '+%Y-%m-%d %H:%M La Paz')" > "$ARCHIVO"
chmod 600 "$ARCHIVO"
echo "anotado en la bandeja: $(basename "$ARCHIVO")"
