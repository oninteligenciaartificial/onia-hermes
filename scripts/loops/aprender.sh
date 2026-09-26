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

# 🔴 Una nota de METODO sobre el propio carril no es memoria compartida.
#
# Medido el 2026-09-26, con MEMORY.md congelada en 65.449/65.536 bytes: de los 25
# bloques firmados que ocupaban el contexto activo, NUEVE (2.709 bytes, 4% del
# archivo) empezaban con la marca del carril y hablaban del carril — "[recorrido-
# cliente] ninguna nueva — el método de comparar BUILD_ID siguió funcionando",
# "[chatbot-cola] dos vueltas seguidas midiendo lo mismo". Y CINCO de esas nueve
# repetian, con otras palabras y minutos despues, un hecho que el mismo carril ya
# habia dejado completo: al reescribirlo cambia el hash, asi que el dedup del
# consolidador no las ve y entran las dos veces.
#
# La regla ya estaba escrita en todos los prompts —"Que NO va: ... nada que sea
# solo de tu carril"— y la plantilla de cierre pide esa linea como `LECCION:` en la
# SALIDA de la vuelta, que es donde el corredor se la muestra a la vuelta siguiente.
# Lo que faltaba era que la PUERTA lo dijera: una regla que vive solo en el prompt
# no avisa al que la desobedece, y cada byte que ocupa se lo cobra a los 15 carriles
# en cada llamada.
#
# El corte es la marca al inicio, no el tema: hablar de metodo esta bien si el hecho
# le sirve a otro carril. Un falso positivo cuesta reescribir sin el prefijo.
if [[ "$HECHO" =~ ^\[[a-z0-9-]+\] ]]; then
  echo "rechazado: eso es la LECCIÓN de tu vuelta, no un hecho compartido." >&2
  echo "  La linea '[$(printf '%s' "$HECHO" | sed 's/^\[\([a-z0-9-]*\)\].*/\1/')] ...' va en tu SALIDA (RAZÓN:/LECCIÓN:), que el corredor le muestra a tu próxima vuelta." >&2
  echo "  Acá va sólo lo que le sirve a otro carril, y sin la marca del tuyo adelante." >&2
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
