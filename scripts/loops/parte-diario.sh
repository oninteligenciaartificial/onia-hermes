#!/usr/bin/env bash
# ONIA — el parte diario. UN mensaje al dia a Sergio Urcullo, y nada mas.
#
# POR QUE EXISTE (2026-09-08). Sergio Urcullo:
#   "si se friega el CI o los loops, que el lo arregle y que solo diga que esta
#    todo en orden"
#
# Antes de esto le llegaban 226 a 443 mensajes por dia (registro de onia-tg.log).
# Ahora los avisos se vuelven tareas del tablero (ver `onia-tg.sh`) y los loops las
# arreglan. Este script es lo unico que le habla sin que el pregunte, y dice una de
# dos cosas:
#
#   "Todo en orden."                 -> el sistema se arreglo solo
#   "N cosas que no pude arreglar"   -> las que llevan mas de UMBRAL horas abiertas
#
# 🔴 La regla que lo hace util: solo se reporta lo que el sistema YA INTENTO arreglar
# y no pudo. Reportar una tarea recien creada seria el mismo ruido con otro nombre —
# el loop todavia no tuvo su vuelta.
set -uo pipefail

TABLERO="${ONIA_TABLERO:-/root/bin/onia-tablero.sh}"
TG="${ONIA_TG:-/root/bin/onia-tg.sh}"
MAX=5                                # cuantas se nombran; el resto se cuenta

# 🔴 EL ORDEN NO ES COSMETICO — es lo unico que decide que ve Sergio Urcullo.
# Medido el 2026-09-21: los 4 loops de nodo-casa murieron el 19-sep 19:33 UTC y el
# vigia lo detecto bien, pero su tarea entro al tablero como la #16 de 16. El
# tablero lista en orden de CREACION, y este script recortaba con `head -5`, o sea
# se quedaba con las CINCO MAS VIEJAS. Resultado: las mananas del 20 y del 21 el
# unico mensaje del dia nombro drops faltantes del 9 y del 10 de septiembre y
# resumio la caida real —que ese mismo dia dejo el chatbot mudo 33 horas— como
# "… y 11 mas en el tablero". Un recorte por antiguedad esconde por diseno lo que
# se acaba de romper, que es justo lo unico que hay que mirar.
#
# Se ordena por dos criterios, en este orden:
#   1. los 🔴 (lo que el enrutador marco como grave) antes que el resto;
#   2. dentro de cada grupo, lo MAS NUEVO primero.
# `%09d` con NR y `sort -k2,2r` da descendente sin depender de `sort -n` inverso.
#
# Las tareas automaticas llevan la marca [auto:xxxxxx] que pone onia-tg.sh.
if ! ESTADO_TABLERO=$("$TABLERO" list 2>/dev/null); then
  echo "No se pudo consultar el tablero; estado sin verificar" >&2
  ONIA_TG_DIRECTO=1 "$TG" "⚠️ <b>No pude verificar el estado del sistema.</b>

El tablero no respondió. El parte diario no puede confirmar que todo esté en orden." || true
  exit 1
fi
ABIERTAS=$(printf '%s\n' "$ESTADO_TABLERO" | grep -F '[auto:' | grep -v '^✓' \
  | awk '{ p = index($0, "🔴") ? 0 : 1; printf "%d\t%09d\t%s\n", p, NR, $0 }' \
  | sort -k1,1n -k2,2r | cut -f3- || true)
CUANTAS=$(printf '%s' "$ABIERTAS" | grep -c . || true)

if [ "${CUANTAS:-0}" -eq 0 ]; then
  MSG="✅ <b>Todo en orden.</b>

Nada roto que el sistema no haya arreglado solo."
else
  # Se corta TODO lo anterior a la marca [auto:xxxxxx] —que siempre esta, porque es
  # por lo que se filtro—, no solo el simbolo de estado. El sed viejo (`s/^[^ ]* *//`)
  # quitaba el "▶" y dejaba "t_c6f54fcb ready (unassigned)" delante de cada linea:
  # tres datos que no le dicen nada a quien lee el mensaje en el telefono, ocupando el
  # ancho donde tendria que estar el titulo.
  LISTA=$(printf '%s\n' "$ABIERTAS" | head -"$MAX" \
    | sed 's/^.*\[auto:[0-9a-f]*\] *//' \
    | sed 's/^/• /')
  RESTO=$((CUANTAS - MAX))
  MSG="⚠️ <b>$CUANTAS cosa(s) que no pude arreglar solo</b>

$LISTA"
  [ "$RESTO" -gt 0 ] && MSG="$MSG

… y $RESTO mas en el tablero."
fi

MSG="$MSG

<i>Parte diario · $(date +'%d/%m %H:%M')</i>"

# Este SI sale directo: es el unico mensaje del dia y es el que el pidio.
ONIA_TG_DIRECTO=1 "$TG" "$MSG"
