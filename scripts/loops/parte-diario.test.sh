#!/usr/bin/env bash
# Prueba de `parte-diario.sh`. Nace el 2026-09-21 de una falla medida, no de una idea:
#
# Los 4 loops de nodo-casa murieron el 19-sep a las 19:33 UTC. El vigia lo detecto bien
# y dejo su tarea en el tablero. Pero el tablero lista en orden de CREACION y este script
# recortaba con `head -5`, o sea nombraba las CINCO MAS VIEJAS. La tarea del apagon era la
# #16 de 16, asi que las mananas del 20 y del 21 el unico mensaje del dia le nombro a
# Sergio Urcullo drops faltantes del 9 y del 10 de septiembre y comprimio la caida real
# —la que ese mismo dia dejo el chatbot de ventas mudo 33 horas— en "… y 11 mas".
#
# Lo que se prueba es lo unico que importa de este script: que lo que se ACABA DE ROMPER
# entre en los cinco que se nombran. Un parte diario que recorta por antiguedad esconde
# por diseno la unica linea que hay que leer.
set -uo pipefail

DIR=$(cd "$(dirname "$0")" && pwd)
SUT="${PARTE_SUT:-$DIR/parte-diario.sh}"
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

FALLOS=0
ok()    { printf '  ok   — %s\n' "$1"; }
falla() { printf '  FALLA — %s\n     %s\n' "$1" "$2"; FALLOS=$((FALLOS+1)); }

# El TG de mentira guarda el mensaje en vez de mandarlo.
cat > "$TMP/tg.sh" <<'FIN'
#!/usr/bin/env bash
printf '%s' "$1" > "$TMP_MENSAJE"
FIN
chmod 755 "$TMP/tg.sh"

# El tablero de mentira devuelve lo que le dejen en $TMP/tablero.txt, en el mismo
# formato que `onia-tablero.sh list` (marca de estado, id, estado, dueno, titulo).
#
# Y responde `show <id>` como el tablero real: con el evento `blocked` que lleva el
# `kind`. Ese dato NO sale de `list` ni de `list --json` (medido el 2026-09-25: sus
# claves no incluyen ninguna de bloqueo), asi que `show` es el unico camino. Cada caso
# declara los kinds que quiere en $TMP_KINDS, una linea "<id> <kind>"; un id que no
# declare nada no imprime NADA, que es como se prueba el camino "no se pudo clasificar".
#
# `show` imprime TAMBIEN la linea `created:` del tablero real (medido el 2026-09-27 sobre
# t_b3143556: «  created:   2026-09-27 09:25 by user»). De ahi sale la EDAD, que es lo que
# ordena la hoja de decisiones — y sale de la misma llamada que ya se hacia por el `kind`,
# sin una consulta nueva. Cada caso declara las fechas en $TMP_FECHAS, "<id> <YYYY-MM-DD>
# <HH:MM>"; un id sin fecha no imprime la linea, que es como se prueba el camino
# "no se pudo leer la fecha".
cat > "$TMP/tablero.sh" <<'FIN'
#!/usr/bin/env bash
if [ "${1:-}" = show ]; then
  F=$(awk -v i="${2:-}" '$1==i {print $2, $3}' "${TMP_FECHAS:-/dev/null}" 2>/dev/null)
  [ -n "$F" ] && printf '  created:   %s by user\n' "$F"
  [ -s "${TMP_KINDS:-/dev/null}" ] || exit 0
  K=$(awk -v i="${2:-}" '$1==i {print $2}' "$TMP_KINDS")
  [ -n "$K" ] && printf "  [2026-09-25 23:44] [run 9] blocked {'reason': 'x', 'kind': '%s', 'recurrences': 1}\n" "$K"
  exit 0
fi
cat "$TMP_TABLERO"
FIN
chmod 755 "$TMP/tablero.sh"

: > "$TMP/kinds.txt"
: > "$TMP/fechas.txt"

correr() {
  export TMP_MENSAJE="$TMP/mensaje.txt" TMP_TABLERO="$TMP/tablero.txt" TMP_KINDS="$TMP/kinds.txt"
  export TMP_FECHAS="$TMP/fechas.txt"
  : > "$TMP_MENSAJE"
  ONIA_TABLERO="$TMP/tablero.sh" ONIA_TG="$TMP/tg.sh" bash "$SUT" >/dev/null 2>&1
  cat "$TMP_MENSAJE"
}

# ── 1. Sin tareas automaticas: el parte dice que todo esta en orden ──────────
: > "$TMP/tablero.txt"
MSG=$(correr)
case "$MSG" in
  *"Todo en orden"*) ok "sin tareas [auto:] dice «Todo en orden»" ;;
  *) falla "sin tareas [auto:] dice «Todo en orden»" "obtuvo: $MSG" ;;
esac

# ── 2. LA REGRESION: lo nuevo y grave entra aunque sea lo ultimo de la lista ──
# Seis viejas inofensivas y, al final —como la #16 de 16 del 20-sep—, el apagon.
{
  echo "▶ t_0000001  ready     (unassigned)          [auto:aaaaaa] ⚠️ No hay drop escrito para hoy (2026-09-09)"
  echo "▶ t_0000002  ready     (unassigned)          [auto:bbbbbb] ⚠️ No hay drop escrito para hoy (2026-09-10)"
  echo "▶ t_0000003  ready     (unassigned)          [auto:cccccc] ⚠️ web-venta · 9s"
  echo "▶ t_0000004  ready     (unassigned)          [auto:dddddd] ⚠️ chatbot-cola · 6s"
  echo "▶ t_0000005  ready     (unassigned)          [auto:eeeeee] ⚠️ onia-cola · 6s"
  echo "▶ t_0000006  ready     (unassigned)          [auto:ffffff] ⚠️ otra vieja mas"
  echo "▶ t_0000007  ready     (unassigned)          [auto:777777] 🔴 la PC de casa no da senales — sus 4 loops estan callados"
} > "$TMP/tablero.txt"
MSG=$(correr)
case "$MSG" in
  *"no da senales"*) ok "el 🔴 recien creado se NOMBRA aunque sea el ultimo de la lista" ;;
  *) falla "el 🔴 recien creado se NOMBRA aunque sea el ultimo de la lista" \
           "quedo fuera del recorte — es exactamente el bug del 20-sep. Mensaje: $MSG" ;;
esac

# ── 3. Y las viejas son las que se van al contador, no al reves ──────────────
case "$MSG" in
  *"2026-09-09"*) falla "la mas vieja cede su lugar" "la del 09-sep desplazo a algo mas nuevo" ;;
  *)              ok "la mas vieja cede su lugar y cae en «… y N mas»" ;;
esac

# ── 4. El conteo sigue siendo el total, no el recorte ────────────────────────
case "$MSG" in
  *"7 cosa(s)"*) ok "cuenta las 7 abiertas aunque nombre 5" ;;
  *) falla "cuenta las 7 abiertas aunque nombre 5" "obtuvo: $MSG" ;;
esac
case "$MSG" in
  *"y 2 mas"*) ok "el resto queda en «… y 2 mas en el tablero»" ;;
  *) falla "el resto queda en «… y 2 mas en el tablero»" "obtuvo: $MSG" ;;
esac

# ── 5. Entre dos 🔴, gana el mas nuevo ───────────────────────────────────────
{
  echo "▶ t_0000010  ready     (unassigned)          [auto:111111] 🔴 rojo viejo"
  echo "▶ t_0000011  ready     (unassigned)          [auto:222222] 🔴 rojo nuevo"
} > "$TMP/tablero.txt"
MSG=$(correr)
PRIMERO=$(printf '%s\n' "$MSG" | grep -m1 '^•')
case "$PRIMERO" in
  *"rojo nuevo"*) ok "entre dos 🔴 se nombra primero el mas nuevo" ;;
  *) falla "entre dos 🔴 se nombra primero el mas nuevo" "primero fue: $PRIMERO" ;;
esac

# ── 6. Las ya hechas (✓) no cuentan ──────────────────────────────────────────
{
  echo "✓ t_0000020  done      (unassigned)          [auto:333333] 🔴 esto ya se arreglo"
} > "$TMP/tablero.txt"
MSG=$(correr)
case "$MSG" in
  *"Todo en orden"*) ok "una tarea [auto:] ya hecha no dispara el parte" ;;
  *) falla "una tarea [auto:] ya hecha no dispara el parte" "obtuvo: $MSG" ;;
esac

# ── 7. La linea que se lee no arrastra id/estado/dueno ───────────────────────
{
  echo "▶ t_0000030  ready     (unassigned)          [auto:444444] 🔴 titulo limpio"
} > "$TMP/tablero.txt"
MSG=$(correr)
case "$MSG" in
  *"• 🔴 titulo limpio"*) ok "la vinieta arranca en el titulo, sin id ni estado" ;;
  *) falla "la vinieta arranca en el titulo, sin id ni estado" "obtuvo: $MSG" ;;
esac

# ── 8. LA SEGUNDA REGRESION (2026-09-24): lo que ESPERA SU DECISION se nombra ──
# El filtro de este script era `grep -F '[auto:'`, o sea solo lo que el propio sistema
# creo. Medido ese dia: 19 tareas blocked esperaban a Sergio Urcullo y solo 4 llevaban
# esa marca, asi que el unico mensaje del dia no nombro ninguna de las otras 15 — entre
# ellas «HOY vence el VPS: renovalo o se apaga TODO» y el pedido para publicar el bot.
# La regla del sistema dice que una tarea `blocked --kind needs_input` le avisa; era
# falso, y por eso un bloqueo del SIAT espero 14 dias.
{
  echo "⊘ t_539598e3  blocked   (unassigned)          🔴 HOY vence el VPS (24-sep): renovalo o se apaga TODO"
  echo "▶ t_0000040  ready     (unassigned)          [auto:555555] ⚠️ algo menor"
} > "$TMP/tablero.txt"
MSG=$(correr)
case "$MSG" in
  *"vence el VPS"*) ok "un bloqueo SIN marca [auto:] se nombra igual" ;;
  *) falla "un bloqueo SIN marca [auto:] se nombra igual" \
           "quedo fuera: el unico mensaje del dia no dice que hoy se apaga todo. Mensaje: $MSG" ;;
esac
# Sin el id no puede contestar: el circuito de deploy y de decisiones es `ok <id>`.
case "$MSG" in
  *"t_539598e3"*) ok "el bloqueo trae su id, que es lo que el tiene que escribir" ;;
  *) falla "el bloqueo trae su id, que es lo que el tiene que escribir" "obtuvo: $MSG" ;;
esac
# Este caso NACE DE MIRAR el mensaje renderizado con el tablero real: las 11 pruebas
# estaban en verde y la linea decia «• (unassigned) 🔴 HOY vence el VPS». El awk vaciaba
# tres campos y el dueno es el CUARTO. Un test que solo pregunta si el titulo aparece
# no ve la basura que aparece junto al titulo.
case "$MSG" in
  *"(unassigned)"*) falla "la vinieta del bloqueo no arrastra el dueno" \
                          "el dueno se colo delante del titulo: $MSG" ;;
  *) ok "la vinieta del bloqueo no arrastra el dueno" ;;
esac
# Y el contador va en SU renglon: pegado al ultimo id se lee como parte del comando.
{
  for n in 1 2 3 4 5 6; do
    echo "⊘ t_000060$n  blocked   (unassigned)          decision numero $n"
  done
} > "$TMP/tablero.txt"
MSG=$(correr)
case "$MSG" in
  *"</code>… y"*) falla "«… y N mas» arranca en su propio renglon" \
                        "quedo pegado al comando a copiar: $MSG" ;;
  *"… y 1 mas esperando"*) ok "«… y N mas» arranca en su propio renglon" ;;
  *) falla "«… y N mas» arranca en su propio renglon" "obtuvo: $MSG" ;;
esac

# ── 9. Nada roto pero algo esperando NO es «todo en orden» ───────────────────
# Este es el modo de falla peor: el sistema se declara sano mientras el negocio
# espera una firma que nadie le pidio.
{
  echo "⊘ t_2508295d  blocked   (unassigned)          Publicar el bot: hoy no agenda ninguna demo"
} > "$TMP/tablero.txt"
MSG=$(correr)
case "$MSG" in
  *"Todo en orden"*) falla "un pedido esperando NO se reporta como «todo en orden»" \
                           "se declaro sano con un deploy esperando su firma: $MSG" ;;
  *"Publicar el bot"*) ok "un pedido esperando NO se reporta como «todo en orden»" ;;
  *) falla "un pedido esperando NO se reporta como «todo en orden»" "obtuvo: $MSG" ;;
esac

# ── 10. LA TERCERA REGRESION (2026-09-25): un renglon gastado en algo que el `ok`
# no desbloquea. La hoja nombra MAX=5 y las derivaba de `grep -E '^⊘'`, o sea de TODO
# lo blocked — sin distinguir "espera tu firma" de "el agente se colgo y el tablero la
# bloqueo solo". Medido ese dia sobre el tablero vivo: de 14 blocked, 13 eran
# `needs_input` y UNA era `kind: capability` (t_781090e0, 517 h parada), y esa se
# comia uno de los cinco renglones mientras 8 decisiones reales quedaban en "… y N
# mas" — entre ellas «7 desconocidos esperando una respuesta».
{
  echo "⊘ t_0000101  blocked   (unassigned)          Publicar el bot: espera tu firma"
  echo "⊘ t_0000102  blocked   default               Disenar hero: el agente se colgo"
  echo "⊘ t_0000103  blocked   (unassigned)          Renovaste el VPS?"
} > "$TMP/tablero.txt"
{
  echo "t_0000101 needs_input"
  echo "t_0000102 capability"
  echo "t_0000103 needs_input"
} > "$TMP/kinds.txt"
MSG=$(correr)
case "$MSG" in
  *"el agente se colgo"*) falla "lo que un \`ok\` no desbloquea NO gasta un renglon" \
                                "la bloqueada por \`capability\` se nombro igual: $MSG" ;;
  *) ok "lo que un \`ok\` no desbloquea NO gasta un renglon" ;;
esac
# Y el contador cuenta las que DE VERDAD esperan su ok: decir "3 esperan tu ok" cuando
# solo 2 se pueden contestar le hace buscar una cuarta que no existe.
case "$MSG" in
  *"2 esperan tu ok"*) ok "el contador cuenta solo las que se pueden contestar" ;;
  *) falla "el contador cuenta solo las que se pueden contestar" "obtuvo: $MSG" ;;
esac
# Las dos reales siguen enteras, con su id.
case "$MSG" in
  *"espera tu firma"*) ok "las decisiones reales siguen en la hoja" ;;
  *) falla "las decisiones reales siguen en la hoja" "obtuvo: $MSG" ;;
esac

# ── 11. El filtro FALLA CERRADO: esconder una decision real es el error caro de este
# canal, asi que lo que no se puede clasificar SIGUE en la hoja. Aca `show` no devuelve
# ningun evento (tablero viejo, id archivado, salida ilegible por los bytes binarios que
# ya aparecieron en t_781090e0): entra igual.
{
  echo "⊘ t_0000201  blocked   (unassigned)          🔴 Carga la tarjeta en Meta o el bot deja de contestar"
} > "$TMP/tablero.txt"
: > "$TMP/kinds.txt"
MSG=$(correr)
case "$MSG" in
  *"tarjeta en Meta"*) ok "sin kind legible la decision NO se esconde (falla cerrado)" ;;
  *) falla "sin kind legible la decision NO se esconde (falla cerrado)" \
           "se la trago el filtro: $MSG" ;;
esac

# ── 12. LA CUARTA REGRESION (2026-09-27): STARVATION de la hoja de decisiones.
# La hoja se creo el 24-sep y heredo la clave de orden de la seccion de ARRIBA (lo roto):
# «🔴 primero, y dentro de cada grupo lo MAS NUEVO». Para un FALLO eso es correcto y esta
# razonado arriba — lo que se acaba de romper es lo unico que hay que mirar. Para una
# DECISION es exactamente al reves: no envejece mal, se vuelve mas urgente cuanto mas
# espera. Con MAX=5 fijo (Sergio Urcullo: "maximo 5 filas, si hay mas me pierdo"), las
# mismas quedaban afuera TODOS LOS DIAS y nunca se nombraban.
#
# Medido el 2026-09-27 sobre el tablero vivo: 19 blocked, y la posicion en `list` NO
# correlaciona con la edad (la #1 era del 18-sep y la #3 del 03-sep), asi que los cinco
# renglones se repartian por el orden en que el tablero imprime. t_6bf938b7 llevaba
# 24 DIAS esperando sin ser nombrada nunca; es el mismo modo de falla que el Punto de
# Venta del SIAT, que espero 14 dias — y que esta hoja se creo para evitar.
{
  echo "⊘ t_0000301  blocked   (unassigned)          Tarjeta del panel: el cliente conecta SU WhatsApp"
  for n in 2 3 4 5 6; do
    echo "⊘ t_000030$n  blocked   (unassigned)          decision de hoy $n"
  done
} > "$TMP/tablero.txt"
{
  echo "t_0000301 2026-09-03 19:38"
  for n in 2 3 4 5 6; do echo "t_000030$n 2026-09-27 09:0$n"; done
} > "$TMP/fechas.txt"
: > "$TMP/kinds.txt"
MSG=$(correr)
case "$MSG" in
  *"Tarjeta del panel"*) ok "la decision que espera hace 24 dias se NOMBRA" ;;
  *) falla "la decision que espera hace 24 dias se NOMBRA" \
           "quedo en «… y N mas» un dia mas, como todos los dias desde el 3-sep: $MSG" ;;
esac
# Y va PRIMERA: el renglon de arriba es el que se lee en el telefono.
PRIMERO=$(printf '%s\n' "$MSG" | grep -m1 '^•')
case "$PRIMERO" in
  *"Tarjeta del panel"*) ok "la que espera hace mas tiempo va primero en la hoja" ;;
  *) falla "la que espera hace mas tiempo va primero en la hoja" "primero fue: $PRIMERO" ;;
esac
# El cap de 5 no se toca: lo que cede su lugar es la mas NUEVA, no la mas vieja.
case "$MSG" in
  *"decision de hoy 6"*) falla "con la hoja llena cede su lugar la mas nueva" \
                               "entro la mas nueva y quedo afuera una que espera mas: $MSG" ;;
  *"… y 1 mas esperando"*) ok "con la hoja llena cede su lugar la mas nueva" ;;
  *) falla "con la hoja llena cede su lugar la mas nueva" "obtuvo: $MSG" ;;
esac
# Un 🔴 sigue ganandole a la edad: es la valvula para lo que no puede esperar el turno.
{
  echo "⊘ t_0000310  blocked   (unassigned)          decision vieja sin urgencia"
  echo "⊘ t_0000311  blocked   (unassigned)          🔴 Carga la tarjeta en Meta o el bot deja de contestar"
} > "$TMP/tablero.txt"
{
  echo "t_0000310 2026-09-01 10:00"
  echo "t_0000311 2026-09-26 10:00"
} > "$TMP/fechas.txt"
MSG=$(correr)
PRIMERO=$(printf '%s\n' "$MSG" | grep -m1 '^•')
case "$PRIMERO" in
  *"tarjeta en Meta"*) ok "un 🔴 nuevo le sigue ganando a una vieja sin urgencia" ;;
  *) falla "un 🔴 nuevo le sigue ganando a una vieja sin urgencia" "primero fue: $PRIMERO" ;;
esac
# Y falla CERRADO tambien con la EDAD: si no se puede leer la fecha se trata como la mas
# vieja y entra. Esconder una decision real es el error caro de este canal; gastar un
# renglon de mas solo cuesta un renglon.
{
  echo "⊘ t_0000320  blocked   (unassigned)          sin fecha legible: entra igual"
  for n in 1 2 3 4 5; do
    echo "⊘ t_000032$n  blocked   (unassigned)          decision con fecha $n"
  done
} > "$TMP/tablero.txt"
{ for n in 1 2 3 4 5; do echo "t_000032$n 2026-09-2$n 09:00"; done; } > "$TMP/fechas.txt"
MSG=$(correr)
case "$MSG" in
  *"sin fecha legible"*) ok "sin fecha legible la decision NO se esconde (falla cerrado)" ;;
  *) falla "sin fecha legible la decision NO se esconde (falla cerrado)" \
           "se la trago el orden: $MSG" ;;
esac

if [ "$FALLOS" -gt 0 ]; then
  printf '\nparte-diario: %d prueba(s) FALLARON\n' "$FALLOS"
  exit 1
fi
printf '\nparte-diario: todo en verde\n'
