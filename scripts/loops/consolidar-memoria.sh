#!/usr/bin/env bash
# ONIA — mete en MEMORY.md lo que los loops dejaron en la bandeja, de a uno y
# con cerrojo.
#
# ES DETERMINISTA A PROPOSITO. Se probo el 2026-09-03 que pedirle a Hermes que
# guarde un hecho lo lleva a COMPACTAR el archivo entero (21 entradas -> 11) y
# en esa compresion tira reglas. Este script no resume ni reescribe: agrega lo
# nuevo al final, descarta lo que ya esta (por hash del texto normalizado), y no
# toca lo que habia. El juicio sobre que vale se le pide a Hermes aparte y
# cuando el archivo crezca de verdad — no en cada vuelta.
set -uo pipefail

MEM="${ONIA_MEMORIA:-/root/.hermes/memories/MEMORY.md}"
INBOX="${ONIA_MEMORIA_INBOX:-/root/.hermes/memories/inbox}"
HECHOS="$INBOX/procesados"
LOCK="/var/lock/onia-memoria.lock"
TOPE_ENTRADAS=120   # a partir de aca se le pide a Hermes que compacte SOLO lo aprendido

[ -d "$INBOX" ] || exit 0
mkdir -p "$HECHOS"
shopt -s nullglob
# Mirada barata ANTES del cerrojo: si no hay nada, no vale la pena pelear por el.
PENDIENTES=("$INBOX"/*.md)
[ ${#PENDIENTES[@]} -eq 0 ] && exit 0

normalizar() {  # minusculas, sin acentos ni puntuacion ni espacios dobles: dos frases iguales dan el mismo hash
  tr '[:upper:]' '[:lower:]' | iconv -f utf-8 -t ascii//TRANSLIT 2>/dev/null | tr -cd 'a-z0-9 \n' | tr -s ' ' | sed 's/^ *//;s/ *$//'
}

exec 9>"$LOCK"
if ! flock -w 30 9; then echo "no consegui el cerrojo de la memoria en 30s"; exit 1; fi

# 🔴 La lista se toma DE NUEVO, ya con el cerrojo. Medido el 2026-09-03 con dos
# consolidadores a la vez: los dos tomaron la misma lista antes del cerrojo, el
# primero proceso y movio los archivos, y el segundo —con la lista vieja— hizo
# `cat` de archivos que ya no estaban, obtuvo vacio, y METIO UNA ENTRADA VACIA en
# MEMORY.md. El cerrojo serializaba bien; lo que no estaba protegido era la foto
# de la bandeja. Una entrada vacia en la memoria es peor que un archivo corrupto:
# no rompe nada y se queda para siempre.
PENDIENTES=("$INBOX"/*.md)
[ ${#PENDIENTES[@]} -eq 0 ] && { flock -u 9; exit 0; }

# Firmas de lo que YA esta, para no repetir. La firma del bloque es la del hecho
# sin su linea de "aprendido por": dos loops que aprendieron lo mismo en dias
# distintos cuentan como uno.
declare -A YA
if [ -s "$MEM" ]; then
  while IFS= read -r -d '' bloque; do
    h=$(printf '%s' "$bloque" | grep -v '^— aprendido por' | normalizar | md5sum | cut -c1-16)
    YA["$h"]=1
  done < <(awk 'BEGIN{RS="\n§\n"; ORS="\0"} {print}' "$MEM")
fi

AGREGADOS=0; REPETIDOS=0
for f in "${PENDIENTES[@]}"; do
  # Defensa en profundidad: aunque la lista ya es de adentro del cerrojo, un
  # archivo ausente o vacio NUNCA se convierte en entrada. Vacio = se descarta.
  [ -s "$f" ] || { rm -f "$f" 2>/dev/null; continue; }
  cuerpo=$(cat "$f")
  [ -n "$(printf '%s' "$cuerpo" | tr -d '[:space:]')" ] || { rm -f "$f"; continue; }
  h=$(printf '%s' "$cuerpo" | grep -v '^— aprendido por' | normalizar | md5sum | cut -c1-16)
  if [ -n "${YA[$h]:-}" ]; then
    REPETIDOS=$((REPETIDOS + 1))
  else
    printf '§\n%s\n' "$cuerpo" >> "$MEM"
    YA["$h"]=1
    AGREGADOS=$((AGREGADOS + 1))
  fi
  mv -f "$f" "$HECHOS/"
done
chmod 600 "$MEM"
flock -u 9

N=$(grep -c '^§$' "$MEM" 2>/dev/null || echo 0)
echo "$AGREGADOS agregado(s), $REPETIDOS repetido(s) — MEMORY.md tiene $N entradas"

# Retencion de lo procesado: 200 archivos alcanzan para auditar un mes.
ls -1t "$HECHOS"/*.md 2>/dev/null | tail -n +201 | xargs -r rm -f

if [ "$N" -gt "$TOPE_ENTRADAS" ]; then
  /root/bin/onia-tg.sh "🧠 <b>Memoria</b>: MEMORY.md llegó a ${N} entradas (tope ${TOPE_ENTRADAS}). Toca pedirle a Hermes que compacte SOLO lo aprendido por los loops — las reglas de SOUL.md no se tocan." >/dev/null 2>&1 || true
fi
exit 0
