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
HORAS="${ONIA_PARTE_HORAS:-12}"     # cuanto se le da al sistema para arreglarse solo
MAX=5                                # cuantas se nombran; el resto se cuenta

# Las tareas automaticas llevan la marca [auto:xxxxxx] que pone onia-tg.sh.
ABIERTAS=$("$TABLERO" list 2>/dev/null | grep -F '[auto:' | grep -v '^✓' || true)
CUANTAS=$(printf '%s' "$ABIERTAS" | grep -c . || true)

if [ "${CUANTAS:-0}" -eq 0 ]; then
  MSG="✅ <b>Todo en orden.</b>

Nada roto que el sistema no haya arreglado solo."
else
  LISTA=$(printf '%s\n' "$ABIERTAS" | head -"$MAX" \
    | sed 's/^[^ ]* *//; s/\[auto:[0-9a-f]*\] *//' \
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
