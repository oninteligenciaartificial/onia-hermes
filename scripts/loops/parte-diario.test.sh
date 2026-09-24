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
cat > "$TMP/tablero.sh" <<'FIN'
#!/usr/bin/env bash
cat "$TMP_TABLERO"
FIN
chmod 755 "$TMP/tablero.sh"

correr() {
  export TMP_MENSAJE="$TMP/mensaje.txt" TMP_TABLERO="$TMP/tablero.txt"
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

if [ "$FALLOS" -gt 0 ]; then
  printf '\nparte-diario: %d prueba(s) FALLARON\n' "$FALLOS"
  exit 1
fi
printf '\nparte-diario: todo en verde\n'
