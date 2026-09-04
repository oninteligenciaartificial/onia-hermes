#!/bin/bash
# Gate de `loops_avance.sh` — el instrumento con el que el supervisor decide si un loop
# desobedecio. Un falso positivo aca no es cosmetico: manda a arreglar un loop SANO y
# gasta la vuelta de otro carril.
#
# ⚠️ NACE DE UN DEFECTO QUE YA SE PAGO DOS VECES. La limpieza del prefijo markdown era
# una LISTA DE INCLUSION de caracteres (`[*_#> -]`), y cada caracter que no estaba en la
# lista evadia el grep en silencio:
#   · 2026-09-03: la NEGRITA (`**OBJETIVO:**`) — dos loops se leyeron estancados.
#   · 2026-09-04: el BACKTICK (`` `OBJETIVO: ...` ``) — `investigacion` salio acusado de
#     DESOBEDIENTE en la misma vuelta en que midio bien, con RAZON y LECCION escritas.
# Agregar el backtick a la lista habria dejado la tercera vez esperando. El arreglo es
# dejar de enumerar: se limpia todo lo que no sea alfanumerico.
#
#   scripts/loops_avance.test.sh      (sale 0 si el instrumento no miente)
set -u

AVANCE="$(dirname "$0")/loops_avance.sh"
TMP=$(mktemp -d); trap 'rm -rf "$TMP"' EXIT
FALLOS=0

# Un log sintetico con una vuelta completa que escribe su medicion en el formato dado.
vuelta() {
  local id="$1" medicion="$2"
  cat > "$TMP/onia-loop-$id.log" <<EOF
2026-09-04T09:26:01Z ===== ARRANCA $id — rama claude/$id — HEAD abc1234 — tope 2400s =====
$medicion
2026-09-04T09:32:32Z ===== TERMINA $id — 391s — exit 0 — commiteo abc1234..def5678 — 1 commit(s) =====
EOF
}

espera() { # <descripcion> <id> <categoria esperada: miden|DESOBEDIENTES>
  local desc="$1" id="$2" cat="$3"
  local salida linea
  salida=$(ONIA_LOGDIR="$TMP" ONIA_LOOPS="$id" "$AVANCE" 2>&1)
  linea=$(echo "$salida" | grep -E "^(miden|DESOBEDIENTES):")
  if echo "$salida" | grep -qE "^$cat:.*\b$id\b"; then
    echo "  ok   — $desc"
  else
    echo "  FALLA — $desc"
    echo "         esperaba '$id' en '$cat:', y el instrumento dijo:"
    echo "$linea" | sed 's/^/           /'
    FALLOS=$((FALLOS + 1))
  fi
}

echo "Formas REALES en que los 15 loops escriben su medicion:"

# Las tres formas vistas en produccion. Las tres son obediencia: el loop MIDIO.
vuelta plano     'OBJETIVO: abiertas 25 · sin cotizar 14 — 2026-09-04 05:32'
espera "texto plano — 'OBJETIVO: ...'" plano miden

vuelta negrita   '**OBJETIVO:** abiertas 25 · sin cotizar 14 — 2026-09-04 05:32'
espera "negrita — '**OBJETIVO:** ...'  (rompio el 2026-09-03)" negrita miden

vuelta backtick  '`OBJETIVO: abiertas 25 · sin cotizar 14 — 2026-09-04 05:32`'
espera "backtick — '\`OBJETIVO: ...\`'  (rompio el 2026-09-04, investigacion)" backtick miden

# El caso que NADIE probo: cualquier OTRO adorno de markdown. Si este pasa, la proxima
# forma que a un loop se le ocurra tampoco lo va a romper.
vuelta vineta    '- **`OBJETIVO:`** abiertas 25 — 2026-09-04 05:32'
espera "vineta + negrita + backtick juntos" vineta miden

vuelta citado    '> OBJETIVO: abiertas 25 — 2026-09-04 05:32'
espera "citado — '> OBJETIVO: ...'" citado miden

echo
echo "Y el instrumento tiene que seguir viendo al que de verdad NO midio:"

# La otra direccion. Un gate que solo afloja deja de servir: si esto pasara a verde,
# `loops_avance.sh` diria 'todos miden' para siempre y nadie se enteraria.
vuelta mudo      'Trabaje un rato y no escribi ninguna medicion.'
espera "un loop que NO midio sigue saliendo DESOBEDIENTE" mudo DESOBEDIENTES

# Un OBJETIVO nombrado a mitad de una frase no es una medicion: si contara, un loop
# zafaria de su gate con solo mencionar la palabra.
vuelta mencion   'Todavia no se cual es el OBJETIVO: lo veo la vuelta que viene.'
espera "mencionar la palabra en una frase NO cuenta como medir" mencion DESOBEDIENTES

echo
if [ "$FALLOS" -eq 0 ]; then
  echo "loops_avance: 7/7 — el instrumento no miente en ninguna de las dos direcciones"
else
  echo "loops_avance: $FALLOS de 7 FALLAN — el supervisor esta acusando a loops sanos"
fi
exit $((FALLOS > 0))
