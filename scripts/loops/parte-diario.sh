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
# UTF-8 explicito (2026-10-09). Sin LANG (POSIX, como puede correr un cron) el orden
# "🔴 primero" se rompe: medido el 29-sep, 5 de sus pruebas en rojo. jarvis-resumen.sh ya
# lo fijaba al llamarlo; corrido desde su propio cron, o por una prueba en una maquina sin
# LANG, no lo tenia.
export LC_ALL=C.UTF-8

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
#
# 🔴 Y NO se ordenan como lo de arriba (2026-09-27). Esta hoja nacio el 24-sep copiando la
# clave de orden de la seccion de fallos —«🔴 primero, y lo MAS NUEVO antes»— y para una
# DECISION es exactamente al reves: un fallo envejece hacia lo irrelevante (el sistema lo
# arregla o lo tapa otro), una firma pendiente se vuelve MAS urgente cuanto mas espera.
# Con MAX=5 fijo, las mismas quedaban afuera todos los dias: medido ese dia sobre el
# tablero vivo, 19 blocked y t_6bf938b7 llevaba 24 DIAS sin ser nombrada una sola vez.
# Es el modo de falla del Punto de Venta del SIAT —14 dias— que esta hoja existe para evitar.
#
# Ademas la clave vieja era la POSICION en `list`, y ese orden no correlaciona con nada
# util: medido el mismo dia, la #1 era del 18-sep y la #3 del 03-sep. O sea que los cinco
# renglones se repartian por el orden en que el tablero imprime.
# El orden correcto es: 1. los 🔴 (la valvula para lo que no puede esperar su turno);
# 2. dentro de cada grupo, la que espera hace MAS TIEMPO. Asi toda decision sube sola si
# nadie la contesta, y ninguna puede quedar invisible para siempre.
BLOQUEADAS=$(printf '%s\n' "$ESTADO_TABLERO" | grep -E '^⊘' || true)

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
#
# La EDAD sale de la MISMA llamada: `show` imprime tambien «created:   <fecha> by <quien>»
# (medido el 2026-09-27 sobre t_b3143556). Pedirla aparte con `list --json` seria una
# consulta nueva por nada — y el `kind`, que es el otro dato que hace falta, solo existe
# aca. Una sola pregunta por tarea devuelve los dos.
datos_del_bloqueo() {
  local id="$1" salida kind creada destino
  # `</dev/null` NO es cosmetico: si ONIA_TABLERO es el shim de nodo-casa, adentro hay
  # un ssh que se COME el stdin del bucle que llama a esta funcion, y entonces se
  # clasifica la primera y las demas se pierden MUDAS. Ya costo un barrido entero.
  # El `tr -d '\0'` saca los bytes nulos que ya aparecieron en el cuerpo de una tarea real
  # (t_781090e0): sin el, bash avisa «ignored null byte in input» en CADA tarea con basura
  # binaria, y este script escribe a un log de cron que alguien tiene que poder leer.
  salida=$("$TABLERO" show "$id" 2>/dev/null </dev/null | LC_ALL=C tr -d '\0') || true
  kind=$(printf '%s\n' "$salida" \
    | LC_ALL=C grep -aoE "\[run [0-9]+\] blocked \{.*" | tail -1 \
    | LC_ALL=C grep -aoE "'kind': '[a-z_]+'" | tail -1 \
    | LC_ALL=C tr -dc 'a-z_') || true
  kind=${kind#kind}
  # `head -1` porque el cuerpo de una tarea puede contener la palabra: el metadato va
  # antes del Body. Sin fecha legible se devuelve la mas vieja posible, o sea entra
  # arriba: el filtro falla CERRADO tambien con la edad.
  creada=$(printf '%s\n' "$salida" \
    | LC_ALL=C grep -aoE 'created: *[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}' | head -1 \
    | LC_ALL=C grep -aoE '[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}') || true
  # El DESTINO, si es un pedido de deploy: las dos formas que ya existen y que el instrumento
  # del objetivo (`scripts/deploy_sin_pedido.mjs`) reconoce — `DESPLEGAR: <destino>` para los
  # cuatro de la lista blanca del `ok`, y `PUBLICAR A MANO: <destino>` para los que no estan
  # cableados. No se inventa convencion nueva: se lee la que el pedido ya tiene que llevar
  # para ser accionable. Es la IDENTIDAD DE RONDA del pedido (ver la rotacion mas abajo).
  destino=$(printf '%s\n' "$salida" \
    | LC_ALL=C grep -aoE '(DESPLEGAR|PUBLICAR A MANO): *[a-z0-9-]+' | head -1 \
    | LC_ALL=C sed -E 's/.*: *//' | LC_ALL=C tr -dc 'a-z0-9-') || true
  printf '%s\t%s\t%s\n' "$kind" "${creada:-0000-00-00 00:00}" "$destino"
}
# El desempate final es la linea misma (o sea el id): con dos fechas iguales el orden
# tiene que ser el mismo todos los dias, no el que salga.
ESPERAN_CLAVES=$(printf '%s\n' "$BLOQUEADAS" | while IFS= read -r linea; do
  [ -n "$linea" ] || continue
  id=$(printf '%s\n' "$linea" | awk '{print $2}')
  datos=$(datos_del_bloqueo "$id")
  kind=$(printf '%s' "$datos" | cut -f1)
  creada=$(printf '%s' "$datos" | cut -f2)
  destino=$(printf '%s' "$datos" | cut -f3)
  [ -z "$kind" ] || [ "$kind" = needs_input ] || continue
  prioridad=1
  case "$linea" in *🔴*) prioridad=0 ;; esac
  # La CLAVE DE RONDA: el destino si es un pedido de deploy, el id si no. Ver la rotacion.
  if [ -n "$destino" ]; then clave="deploy-$destino"; else clave="$id"; fi
  printf '%d\t%s\t%s\t%s\n' "$prioridad" "$creada" "$clave" "$linea"
done | sort -t$'\t' -k1,1n -k2,2 -k4,4)
ESPERAN=$(printf '%s\n' "$ESPERAN_CLAVES" | cut -f4-)
CUANTAS_ESPERAN=$(printf '%s' "$ESPERAN" | grep -c . || true)

# 🔴 Y la hoja ROTA (2026-09-27). El orden por edad hace que toda decision SUBA sola…
# pero solo si las de arriba se contestan. Con MAX=5 fijo y 18 esperando —medido ese dia
# sobre el tablero vivo— cinco decisiones que no se pueden contestar hoy clavan los cinco
# renglones TODOS los dias, y las 13 de abajo no se nombran nunca: entre ellas estaban los
# TRES pedidos de deploy (posiciones 11, 17 y 18), que son lo unico que hace que el trabajo
# ya mergeado llegue al cliente. El orden es una cola sin salida si la cabeza no avanza.
#
# La rotacion la hace avanzar: cada decision tiene su renglon dentro de una ronda. Reglas,
# y cada una es un modo de falla que ya se pago en otra parte del sistema:
#   · los 🔴 NO rotan — son la valvula de lo que no puede esperar turno, y una valvula que
#     pasa hambre cambia un starvation por otro. No consumen ronda ni la pierden.
#   · la ronda se cierra cuando ya no quedan sin turno para llenar los renglones libres, y
#     las que quedaron sin turno entran PRIMERAS en la siguiente: si no, la ultima de una
#     ronda corta no se nombraria nunca, que es el bug de vuelta con otro disfraz.
#   · se rota lo que se NOMBRA, nunca lo que se CUENTA: el total sigue siendo el total, o
#     la hoja mentiria sobre el tamano de la deuda.
#   · elegir y mostrar son dos preguntas distintas: la hoja se sigue leyendo por edad.
# El estado es un archivo por sujeto con noclobber (el `openSync wx` de /var/lib/
# onia-vigia-remotos/<id>), NO una tabla ajena con unique key — ese patron ya fallo justo
# en el peor modo de falla. Perderlo no rompe nada: arranca una ronda nueva.
#
# 🔴 Y la SEXTA (2026-09-27, tarea `t_ceefb6cd`): la rotacion de arriba arregla el starvation
# de las decisiones ESTABLES, pero un pedido de deploy no es estable — CADUCA POR DISENO y se
# rehace con id NUEVO cada vez que se le suma un arreglo (el del bot se rehizo 30 veces, a
# veces 3 en un dia). Un id nuevo nunca tuvo turno, entra en SIN_TURNO, y el orden ahi es por
# EDAD: su edad es «ahora», asi que va ULTIMO. Con 17 esperando y 4 renglones libres la ronda
# dura ~5 dias; un sujeto que vive horas no alcanza su renglon NUNCA. No es mala suerte: es
# aritmetica. Y es el unico renglon que hace que el trabajo ya mergeado y verificado llegue al
# cliente — el del bot tenia adentro 5 desconocidos que pidieron hablar con una persona.
#
# Por eso la identidad de ronda de un pedido de deploy es su DESTINO, no su id: un pedido
# rehecho HEREDA el turno y la antiguedad de su antecesor en vez de volver al final. Se eligio
# esto y no «los pedidos no rotan, como los rojos» porque una valvula que pasa hambre cambia un
# starvation por otro — este mismo archivo ya lo advierte dos parrafos arriba.
#
# La herencia corta en los DOS sentidos, y el segundo es el que evita cambiar un starvation por
# otro: un pedido que YA uso su renglon en esta ronda no se lo puede quedar rehaciendose.
RONDA="${ONIA_PARTE_RONDA:-/var/lib/onia-parte-diario/ronda}"
# Las edades viven ADENTRO del estado de ronda pero tienen que sobrevivir a su cierre: si se
# fueran con la ronda, el pedido rehecho volveria al final cada cinco dias y el bug reaparece
# despacio. Por eso el cierre borra las marcas de turno (archivos sueltos) y no el arbol.
EDADES="$RONDA/edades"
tuvo_turno() { [ -e "$RONDA/$1" ]; }
dar_turno() { mkdir -p "$RONDA" 2>/dev/null || return 0; ( set -C; : > "$RONDA/$1" ) 2>/dev/null || true; }
cerrar_ronda() { find "$RONDA" -maxdepth 1 -type f -delete 2>/dev/null || true; }
claves_de() { printf '%s\n' "$1" | awk -F'\t' 'NF { print $3 }'; }
# La antiguedad de una clave es la MAS VIEJA que se le vio: el pedido de hoy hereda la fecha
# del primero que pidio ese destino. Sin estado legible se devuelve la fecha nueva, o sea el
# comportamiento de antes: no se puede fallar hacia «mas viejo que nadie» por no poder leer.
edad_heredada() {
  local clave="$1" nueva="$2" guardada=""
  mkdir -p "$EDADES" 2>/dev/null || { printf '%s' "$nueva"; return 0; }
  [ -f "$EDADES/$clave" ] && guardada=$(LC_ALL=C tr -dc '0-9: -' < "$EDADES/$clave" 2>/dev/null) || true
  # Fechas ISO: comparar como texto ES comparar cronologicamente.
  if [ -n "$guardada" ] && [ "$guardada" \< "$nueva" ]; then printf '%s' "$guardada"; return 0; fi
  printf '%s' "$nueva" > "$EDADES/$clave" 2>/dev/null || true
  printf '%s' "$nueva"
}
# Recien aca se puede aplicar la herencia (el estado se define arriba), asi que la clave de
# orden se reescribe y la lista se vuelve a ordenar. Solo toca a los pedidos de deploy: para
# un sujeto estable la clave es su id y su fecha es siempre la misma.
ESPERAN_CLAVES=$(printf '%s\n' "$ESPERAN_CLAVES" | while IFS= read -r fila; do
  [ -n "$fila" ] || continue
  clave=$(printf '%s' "$fila" | cut -f3)
  case "$clave" in
    deploy-*)
      printf '%s\t%s\t%s\t%s\n' "$(printf '%s' "$fila" | cut -f1)" \
        "$(edad_heredada "$clave" "$(printf '%s' "$fila" | cut -f2)")" \
        "$clave" "$(printf '%s' "$fila" | cut -f4-)" ;;
    *) printf '%s\n' "$fila" ;;
  esac
done | sort -t$'\t' -k1,1n -k2,2 -k4,4)

ROJAS=$(printf '%s\n' "$ESPERAN_CLAVES" | awk -F'\t' '$1 == 0')
RESTO=$(printf '%s\n' "$ESPERAN_CLAVES" | awk -F'\t' '$1 == 1')
CUANTAS_ROJAS=$(printf '%s' "$ROJAS" | grep -c . || true)
# Los 🔴 entran siempre, hasta llenar la hoja ellos solos si hace falta.
LIBRES=$((MAX - CUANTAS_ROJAS))
[ "$LIBRES" -lt 0 ] && LIBRES=0

SIN_TURNO=""; CON_TURNO=""
while IFS= read -r fila; do
  [ -n "$fila" ] || continue
  clave=$(printf '%s' "$fila" | cut -f3)
  if tuvo_turno "$clave"; then CON_TURNO="$CON_TURNO$fila
"; else SIN_TURNO="$SIN_TURNO$fila
"; fi
done <<EOF
$RESTO
EOF
CUANTAS_SIN_TURNO=$(printf '%s' "$SIN_TURNO" | grep -c . || true)

if [ "$CUANTAS_SIN_TURNO" -lt "$LIBRES" ]; then
  # Ronda agotada: se cierra y se abre otra. Las que no alcanzaron turno van primeras.
  cerrar_ronda
  ELEGIBLES="$SIN_TURNO$CON_TURNO"
else
  ELEGIBLES="$SIN_TURNO"
fi
TOMADAS=$(printf '%s' "$ELEGIBLES" | grep . | head -"$LIBRES" || true)
for clave in $(claves_de "$TOMADAS"); do dar_turno "$clave"; done

# Elegido el conjunto, se MUESTRA por la clave de siempre: 🔴 primero y despues por edad.
ESPERAN=$(printf '%s\n%s\n' "$ROJAS" "$TOMADAS" | grep . \
  | sort -t$'\t' -k1,1n -k2,2 -k4,4 | cut -f4- || true)

HOJA=""
if [ "${CUANTAS_ESPERAN:-0}" -gt 0 ]; then
  # Del renglon del tablero («⊘ id estado dueno titulo») se tira todo menos el titulo,
  # igual que abajo, y el id se reengancha en su propia linea como el comando a copiar.
  # El recorte a $MAX ya lo hizo la rotacion; `head` queda como red por si $ROJAS sola
  # lo pasa, que es el unico camino en que puede venir mas larga.
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
