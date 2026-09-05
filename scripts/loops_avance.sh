#!/bin/bash
# loops_avance.sh — ¿que loops NO midieron su objetivo en su ultima vuelta?
#
# Es la medicion de arranque del loop `supervisor`. Vive en un archivo y no en su prompt
# porque el one-liner que estaba ahi dio falsos positivos DOS vueltas seguidas, y un
# instrumento que se corrige en prosa se vuelve a romper en la vuelta siguiente.
#
# ⚠️ LAS CUATRO FORMAS EN QUE ESTA MEDICION MIENTE, todas medidas en este proyecto.
# Un loop sin linea `OBJETIVO:` parece desobediente, y casi nunca lo es:
#
#   1. VUELTA EN CURSO. La linea se escribe al FINAL. Los loops que estan corriendo
#      ahora mismo todavia no la escribieron. El 2026-09-04 esto acuso a onia-cola,
#      web-factory-dev y al propio supervisor — que estaba ejecutando este chequeo.
#      Se descarta por la ausencia de `===== TERMINA`.
#   2. VUELTA MUERTA. Una vuelta cortada por el limite de uso de Claude dura 2-3 s y no
#      escribe nada. El 2026-09-03 murieron 15 asi. Un muerto no es un desobediente:
#      mandar a arreglarlo gasta una vuelta en un loop sano.
#   3. MEDICION ADORNADA CON MARKDOWN. `**OBJETIVO:**` y `` `OBJETIVO:` `` no empiezan
#      con `OBJETIVO:`. Por eso el grep va DESPUES de limpiar el prefijo, igual que hace
#      el corredor desde a546a058a.
#      ⚠️ Y la limpieza NO enumera adornos: esa lista (`[*_#> -]`) fallo DOS veces —la
#      negrita el 03-sep, el backtick el 04-sep, que acuso a `investigacion` de
#      desobediente en la vuelta en que midio bien con RAZON y LECCION. Una lista de
#      inclusion falla callada con el primer caracter que nadie previo. Se limpia todo
#      lo no alfanumerico, y `loops_avance.test.sh` lo fija en las dos direcciones.
#   4. TODAVIA NO VIO LA INSTRUCCION. Un loop de cadencia diaria cuya ultima vuelta es
#      anterior al despliegue del prompt que pide la linea no la pudo haber escrito.
#
# Sin los cuatro descartes, de 15 loops salen ~8 "desobedientes" y ninguno lo es.
#
#   scripts/loops_avance.sh                  (sale 0 si no hay desobedientes)
#   scripts/loops_avance.sh --desde 2026-09-03T21:19
#
# Salida: una linea por categoria, y al final la que va en la linea OBJETIVO: del loop.
set -u

# Cuando se desplego el prompt que pide la linea `OBJETIVO:`. Un loop cuya ultima vuelta
# es anterior no puede haberla escrito: no es desobediente, es que no la vio.
DESDE="2026-09-03T21:19"
[ "${1:-}" = "--desde" ] && DESDE="${2:?--desde necesita una fecha ISO}"

MIDEN=""; EN_CURSO=""; MUERTAS=""; SIN_VER=""; SIN_MEDIR=""; SIN_LOG=""

# Por defecto mide los loops REALES del crontab contra sus logs reales. Las dos variables
# existen para que `loops_avance.test.sh` pueda darle logs sinteticos: sin eso este
# instrumento no se puede probar, y es justo el que ya mintio dos veces.
LOGDIR="${ONIA_LOGDIR:-/var/log}"
LOOPS="${ONIA_LOOPS:-$(crontab -l 2>/dev/null | grep -oE 'onia-loop\.sh [a-z-]+' | awk '{print $2}' | sort -u)}"

for id in $LOOPS; do
  L=$LOGDIR/onia-loop-$id.log
  # Un log ausente en un loop registrado es un loop MUERTO con cara de vivo: el crontab
  # lo declara sano y nada avisa. Es la peor falla, asi que tiene categoria propia.
  [ -s "$L" ] || { SIN_LOG="$SIN_LOG $id"; continue; }

  INI=$(grep -n "===== ARRANCA $id" "$L" | tail -1 | cut -d: -f1)
  [ -n "$INI" ] || { SIN_LOG="$SIN_LOG $id"; continue; }
  FECHA=$(sed -n "${INI}p" "$L" | cut -c1-16)
  BLOQUE=$(tail -n +"$INI" "$L")

  echo "$BLOQUE" | grep -q "===== TERMINA" || { EN_CURSO="$EN_CURSO $id"; continue; }
  echo "$BLOQUE" | grep -q "session limit"  && { MUERTAS="$MUERTAS $id";  continue; }

  # Se limpia TODO lo que no sea alfanumerico, no una lista de adornos de markdown.
  # La lista `[*_#> -]` ya dejo pasar dos: la negrita y el backtick (ver el punto 3).
  if echo "$BLOQUE" | sed -E 's/^[0-9T:Z-]+Z //; s/^[^[:alnum:]]*//' | grep -q "^OBJETIVO:"; then
    MIDEN="$MIDEN $id"
  elif [[ "$FECHA" < "$DESDE" ]]; then
    SIN_VER="$SIN_VER $id($FECHA)"
  else
    SIN_MEDIR="$SIN_MEDIR $id"
  fi
done

N() { echo $# ; }
echo "miden:${MIDEN:- -}"
echo "en curso ahora:${EN_CURSO:- -}"
echo "muertas por cupo de Claude:${MUERTAS:- -}"
echo "aun no vieron el prompt (desde $DESDE):${SIN_VER:- -}"
echo "SIN LOG — registrados en cron y nunca corrieron:${SIN_LOG:- -}"
echo "DESOBEDIENTES:${SIN_MEDIR:- ninguno}"
echo
echo "para la linea OBJETIVO: sin medir $(N $SIN_MEDIR) de $(N $MIDEN $EN_CURSO $MUERTAS $SIN_VER $SIN_MEDIR $SIN_LOG) · muertas $(N $MUERTAS) · sin log $(N $SIN_LOG)"

# Un loop registrado que nunca corrio cuenta como fallo: el crontab lo declara sano.
[ -z "$SIN_MEDIR$SIN_LOG" ]
