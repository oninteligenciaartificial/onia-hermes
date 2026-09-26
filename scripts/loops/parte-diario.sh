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
ABIERTAS=$(printf '%s\n' "$ESTADO_TABLERO" | grep -F '[auto:' | grep -vE '^[✓⊘]' \
  | awk '{ p = index($0, "🔴") ? 0 : 1; printf "%d\t%09d\t%s\n", p, NR, $0 }' \
  | sort -k1,1n -k2,2r | cut -f3- || true)
CUANTAS=$(printf '%s' "$ABIERTAS" | grep -c . || true)

# 🔴 LA SEGUNDA SECCION: lo que ESPERA SU DECISION (2026-09-24).
# El filtro de arriba es `grep -F '[auto:'`, o sea SOLO lo que el propio sistema creo.
# Medido ese dia: 19 tareas `blocked` esperaban a Sergio Urcullo y apenas 4 llevaban esa
# marca, asi que el unico mensaje del dia no nombro ninguna de las otras 15 — entre ellas
# «HOY vence el VPS (24-sep): renovalo o se apaga TODO» y el pedido para publicar el bot
# (43 conversaciones, 0 demos agendadas). El sistema decia "todo en orden" esa misma
# manana. La regla escrita en los prompts —«solo una tarea blocked --kind needs_input le
# avisa»— era FALSA: un bloqueo sin marca [auto:] no salia por ningun canal, y asi el
# Punto de Venta del SIAT espero 14 dias.
# Van PRIMERO porque son lo unico que no avanza sin el, y CON su id, porque el id es
# literalmente lo que tiene que escribir para contestar.
BLOQUEADAS=$(printf '%s\n' "$ESTADO_TABLERO" | grep -E '^⊘' \
  | awk '{ p = index($0, "🔴") ? 0 : 1; printf "%d\t%09d\t%s\n", p, NR, $0 }' \
  | sort -k1,1n -k2,2r | cut -f3- || true)

# 🔴 Y de lo blocked entra SOLO lo que un `ok` puede desbloquear (2026-09-25).
# El filtro era `grep -E '^⊘'` a secas, o sea TODO lo blocked, sin distinguir "espera
# tu firma" de "el agente se colgo y el tablero la bloqueo solo". Medido ese dia sobre
# el tablero vivo: de 14 blocked, 13 eran `needs_input` y UNA era `kind: capability`
# (t_781090e0, parada 517 h) — y esa se comia uno de los CINCO renglones mientras 8
# decisiones reales quedaban en "… y N mas", entre ellas «7 desconocidos esperando una
# respuesta tuya». Un renglon de este mensaje es el 20 % del unico canal del dia.
#
# El `kind` NO sale de `list` ni de `list --json` (sus claves no incluyen ninguna de
# bloqueo), asi que se pregunta con `show` por tarea: 9 s para las 14, medido, y es un
# cron diario. La salida se lee con `grep -a` porque ya aparecieron bytes binarios en
# el cuerpo de una tarea real (t_781090e0) y sin `-a` grep la descarta entera.
#
# Y el filtro falla CERRADO a proposito: lo que no se pueda clasificar SIGUE en la
# hoja. Esconder una decision real es el error caro de este canal — el del SIAT ya
# espero 14 dias —; nombrar una de mas solo gasta un renglon.
espera_su_ok() {
  local id="$1" kind
  # `</dev/null` NO es cosmetico: si ONIA_TABLERO es el shim de nodo-casa, adentro hay
  # un ssh que se COME el stdin del bucle que llama a esta funcion, y entonces se
  # clasifica la primera y las demas se pierden MUDAS. Ya costo un barrido entero.
  kind=$("$TABLERO" show "$id" 2>/dev/null </dev/null \
    | LC_ALL=C grep -aoE "\[run [0-9]+\] blocked \{.*" | tail -1 \
    | LC_ALL=C grep -aoE "'kind': '[a-z_]+'" | tail -1 \
    | LC_ALL=C tr -dc 'a-z_') || true
  kind=${kind#kind}
  [ -z "$kind" ] && return 0            # no se pudo clasificar -> entra
  [ "$kind" = needs_input ]
}
ESPERAN=$(printf '%s\n' "$BLOQUEADAS" | while IFS= read -r linea; do
  [ -n "$linea" ] || continue
  if espera_su_ok "$(printf '%s\n' "$linea" | awk '{print $2}')"; then
    printf '%s\n' "$linea"
  fi
done)
CUANTAS_ESPERAN=$(printf '%s' "$ESPERAN" | grep -c . || true)

HOJA=""
if [ "${CUANTAS_ESPERAN:-0}" -gt 0 ]; then
  # Del renglon del tablero («⊘ id estado dueno titulo») se tira todo menos el titulo,
  # igual que abajo, y el id se reengancha en su propia linea como el comando a copiar.
  FILAS=$(printf '%s\n' "$ESPERAN" | head -"$MAX" \
    | awk '{ id=$2; $1=$2=$3=$4=""; sub(/^ +/, ""); sub(/\[auto:[0-9a-f]*\] */, "");
             t=$0; if (length(t) > 72) t = substr(t, 1, 69) "…";
             printf "• %s\n   → <code>ok %s</code>\n", t, id }')
  HOJA="🙋 <b>$CUANTAS_ESPERAN esperan tu ok</b>

$FILAS"
  RESTO_E=$((CUANTAS_ESPERAN - MAX))
  [ "$RESTO_E" -gt 0 ] && HOJA="$HOJA
… y $RESTO_E mas esperando en el tablero."
fi

if [ "${CUANTAS:-0}" -eq 0 ] && [ "${CUANTAS_ESPERAN:-0}" -eq 0 ]; then
  MSG="✅ <b>Todo en orden.</b>

Nada roto que el sistema no haya arreglado solo."
elif [ "${CUANTAS:-0}" -eq 0 ]; then
  # Nada roto, pero algo espera su firma. Decir "todo en orden" aca seria el peor modo
  # de falla del canal: el sistema declarandose sano mientras el negocio espera.
  MSG="$HOJA"
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
  # La hoja de decisiones va ARRIBA de lo roto: lo roto lo arregla el sistema en su
  # proxima vuelta, esto no avanza sin el.
  [ -n "$HOJA" ] && MSG="$HOJA

$MSG"
fi

MSG="$MSG

<i>Parte diario · $(date +'%d/%m %H:%M')</i>"

# Este SI sale directo: es el unico mensaje del dia y es el que el pidio.
ONIA_TG_DIRECTO=1 "$TG" "$MSG"
