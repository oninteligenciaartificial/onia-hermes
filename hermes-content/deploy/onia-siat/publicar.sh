#!/usr/bin/env bash
# Publica el emisor fiscal SIAT. UN comando, SIN argumentos, que no caduca nunca.
#
# POR QUÉ EXISTE. El emisor era el ÚNICO de los cuatro destinos de producción sin
# circuito de deploy: no había `/opt/onia-siat/_deploy/`, `siat` no estaba en la
# lista blanca del ejecutor, y `scripts/loops/sincronizar.sh` no lo nombraba. El
# efecto es el que este proyecto ya pagó dos veces: un pedido `DESPLEGAR: siat`
# nacía INEJECUTABLE — el ejecutor corta con «ERR destino fuera de la lista
# blanca», así que el `ok` de Sergio Urcullo devolvía tilde verde sin desplegar
# nada. Por eso el arreglo del CUFD (a28b3689, en `origin/main`) llevaba cuatro
# días sin llegar al archivo que el VPS ejecuta.
#
# Medido el 2026-09-08 por onia-cola (tarea t_7d2019bb):
#   repo: grep -c ensureCufd hermes-content/integrations/siat/src/fase1-runner.mjs -> 6
#   VPS:  grep -c ensureCufd /opt/onia-siat/emisor/src/fase1-runner.mjs            -> 4
# Con el emisor viejo, las etapas VI y IX de la Fase 1 vuelven a fallar con
# «123 CUFD FUERA DE TOLERANCIA» y «EL EVENTO SIGNIFICATIVO NO CORRESPONDE AL
# CUFD», quemando la corrida y los 320 casos que el arreglo desbloquea.
#
# POR QUÉ NO NOMBRA NINGUNA CARPETA. Es la lección de la landing (ver
# hermes-content/deploy/onia-landing/publicar.sh): un pedido que nombra un
# artefacto con timestamp caduca cuando el siguiente lo borra, y el fallo se
# disfraza de decisión pendiente. Acá no hay artefacto: se COMPRUEBA que el
# subárbol del emisor sea idéntico a `origin/main` y se despliega desde ahí.
#
# QUÉ SE COPIA Y QUÉ NO. La lista de archivos sale de `git ls-files`, no de una
# lista escrita a mano: un archivo nuevo del emisor nace cubierto. El ESTADO de
# la corrida vive un nivel más arriba (/opt/onia-siat/fase1-state.json,
# fase1-log.ndjson, siat-piloto.env) y este script no lo toca ni lo mira — es la
# trampa del deploy por lista blanca que ya revirtió el contador del bot el
# 2026-09-04. Verificado antes de escribir esto: dentro de `emisor/` NO hay un
# solo archivo que exista sólo en producción (35 en el VPS, los 35 versionados).
#
# SON DOS DESTINOS, NO UNO (2026-09-10). El emisor va a `emisor/` y el
# orquestador de la corrida de volumen vive un nivel más arriba, en
# /opt/onia-siat/, porque es el que lee el estado. Hasta hoy eso estaba escrito
# acá como una EXENCIÓN — «run-fase1-volumen.sh → vive un nivel más arriba» —, y
# es cierto dónde vive: lo que no lo saca es de necesitar deploy. Efecto medido:
# el VPS corría la versión del 4-sep (633 B) con `origin/main` en la del 10-sep
# (3023 B, commit 2e9230c5), la que deriva sus etapas de STAGE_ORDER en vez de
# tipearlas — o sea la que corre la etapa I, la que pide el CUIS por punto de
# venta. Sin ella, el día que exista el Punto de Venta 1 este script NO lo
# desbloquea y los 11 combos pv1 (1.169 documentos de cobertura) no se emiten.
# Una exención con su motivo escrito se lee como decidida y nadie la re-audita:
# por eso ahora el archivo tiene destino y `scripts/publicador-siat-cubre.test.mjs`
# exige que NINGÚN ejecutable del subárbol pueda quedar exento.
#
# POR QUÉ SE NIEGA CON UNA CORRIDA VIVA. Cambiar el código bajo un runner en
# curso deja la corrida a mitad con dos versiones del emisor, y el estado que
# escribe es el insumo de las etapas siguientes.
#
# Uso:
#   bash /opt/onia-siat/_deploy/publicar.sh              # despliega lo que haya en main
#   bash /opt/onia-siat/_deploy/publicar.sh --dry-run    # dice qué haría, NO toca producción
#
# Salidas: 0 desplegado (o ya estaba al día) · 1 no se pudo desplegar · 2 no se pudo medir.
set -uo pipefail

REPO=${ONIA_LOOPS_REPO:-/root/loops/onia-hermes}
SUB=hermes-content/integrations/siat
DEST=${ONIA_SIAT_DEST:-/opt/onia-siat/emisor}
DRY=""
[ "${1:-}" = "--dry-run" ] && DRY=1

[ -d "$REPO/.git" ] || { echo "ERR: no encuentro el repo ($REPO)"; exit 2; }
[ -d "$DEST" ]      || { echo "ERR: no existe el destino ($DEST)"; exit 2; }

cd "$REPO" || { echo "ERR: no puedo entrar a $REPO"; exit 2; }

# ── derivar: comprobar que el árbol ES origin/main para este subárbol ───────
# Un `fetch` que falla NO es motivo para no publicar: se avisa y se compara
# contra el origin/main que haya en disco. Lo que nunca se hace es publicar sin
# comparar.
git fetch origin --quiet 2>/dev/null || echo "aviso: el fetch falló, comparo contra el origin/main que tengo en disco" >&2

SHA=$(git rev-parse --short origin/main 2>/dev/null) || { echo "ERR: no puedo leer origin/main"; exit 2; }

# Estar ATRASADO no es motivo para no publicar. Desde que el integrador se mudó
# al nodo de casa y pushea desde allá, nadie vuelve a tocar este clon: quedarse
# atrás es su estado normal, no una anomalía. Al bot esto ya lo dejó inejecutable
# tres días (2026-09-08); acá daba verde sólo porque el subárbol de SIAT no había
# cambiado en los commits que faltaban — el defecto estaba igual de vivo.
#
# El fast-forward es la única forma de avanzar que no puede inventar contenido:
# si el árbol tiene trabajo propio o cambios sin commitear, git se niega y cae en
# la comparación de abajo, que corta igual que siempre. La guarda no se afloja —
# deja de dispararse sobre el caso en el que no había nada que guardar.
if [ "$(git rev-parse HEAD 2>/dev/null)" != "$(git rev-parse origin/main 2>/dev/null)" ]; then
  if git merge --ff-only --quiet origin/main 2>/dev/null; then
    echo "   (el árbol estaba atrasado: lo puse en origin/main $SHA)"
  else
    echo "aviso: no pude poner el árbol al día por fast-forward; lo comparo como está" >&2
  fi
fi

DIFIEREN=$(git diff --name-only origin/main -- "$SUB"; git ls-files --others --exclude-standard -- "$SUB")
if [ -n "$DIFIEREN" ]; then
  echo "ERR: el árbol de $REPO NO coincide con origin/main en $SUB." >&2
  echo "     No se despliega: lo que se publique tiene que ser lo que está en main." >&2
  echo "$DIFIEREN" | sed 's/^/       /' >&2
  exit 2
fi

SRC="$REPO/$SUB"

# ── qué se copiaría ─────────────────────────────────────────────────────────
# El emisor de producción NO tiene node_modules y no lo necesita: `src/` no
# importa un solo paquete externo (sólo node:* y hermanos de su carpeta). Por
# eso alcanza con copiar archivos.
#
# Se copia código, tests y esquemas. Quedan fuera a propósito, con su motivo:
#   .env.example / .gitignore  → del repo, no del despliegue
#   ONBOARDING_CLIENTE.md      → documentación de cliente, no la ejecuta nadie
ARCHIVOS=$(cd "$SRC" && git ls-files . | grep -E '^(src|test|xsd)/|^(README\.md|package\.json)$')
[ -n "$ARCHIVOS" ] || { echo "ERR: no encontré archivos del emisor en $SRC"; exit 2; }

# Lo que va un nivel más arriba (/opt/onia-siat/), donde vive el estado que lee:
# TODO script del primer nivel del subárbol, derivado del disco.
#
# ⚠️ Acá decía '^run-fase1-volumen\.sh$' — un nombre a dedo, y por eso el hermano
# `run-fase1-pdv1.sh` (12-sep) nació huérfano: ningún destino lo copiaba, aunque
# su propio encabezado documenta correrlo como `/opt/onia-siat/run-fase1-pdv1.sh`.
# Es la misma clase que este publicador ya pagó una vez con `run-fase1-volumen.sh`,
# sólo que con el motivo escrito adentro de un regex en vez de un comentario: una
# lista blanca por NOMBRE falla abierto en el sujeto nuevo, siempre. El sujeto se
# deriva ahora, así que el próximo `run-*.sh` nace cubierto.
ARRIBA=$(cd "$SRC" && git ls-files . | grep -E '^[^/]+\.sh$')
[ -n "$ARRIBA" ] || { echo "ERR: no encontré los orquestadores (*.sh) en $SRC"; exit 2; }
DEST_ARRIBA=$(dirname "$DEST")

# El diff se hace SIN los retornos de carro: la copia de /opt llegó por scp desde
# Windows y tiene CRLF, así que md5 y `diff` la marcan entera como distinta
# aunque no cambie un solo byte útil. Ese falso positivo ya hizo copiar a mano
# encima de producción para "arreglar" algo que estaba bien (2026-09-08).
#
# El destino se pregunta UNA vez, acá, y lo usan los tres pasos (comparar,
# copiar, verificar). Tener la regla escrita tres veces es como se desincronizan.
#
# ⚠️ Acá decía `case " $ARRIBA " in *" $1 "*)`, y el patrón pide ESPACIOS a los
# lados del nombre. `$ARRIBA` sale de `git ls-files`: viene separado por saltos
# de línea, no por espacios. Mientras fue UN archivo (el regex a dedo
# `^run-fase1-volumen\.sh$`) el valor no tenía separador y `" $ARRIBA "` lo
# rodeaba de espacios, así que matcheaba; al derivarlo el 10-sep y pasar a TRES,
# el separador se volvió `\n` y dejó de matchear **para los tres**, en silencio y
# cayendo al default. Medido el 2026-09-26: los tres orquestadores estaban en
# /opt/onia-siat/emisor/ (13-sep 02:16) y el que el VPS ejecuta,
# /opt/onia-siat/run-fase1-volumen.sh, seguía siendo el del 4-sep (633 B, con
# `for E in IV VII XI`) — 16 días creyéndose desplegado.
#
# Y el falso verde se cerraba solo: el publicador COMPARA con este mismo
# `destino_de()`, así que encontraba sus propias copias en el lugar equivocado y
# decía «YA ESTA PUBLICADO». Ampliar el conjunto rompió el ruteo del elemento que
# ya andaba — por eso `scripts/publicador-siat-cubre.test.mjs` ahora EJECUTA esta
# función en vez de leerla, y con más de un archivo: con uno solo el defecto no
# aparece.
#
# El `for` no tiene ese punto ciego: separa por IFS (espacios Y saltos de línea),
# que es exactamente como el resto del script ya recorre `$TODOS` y `$ARRIBA`.
destino_de() {
  for _a in $ARRIBA; do
    [ "$_a" = "$1" ] && { echo "$DEST_ARRIBA/$1"; return; }
  done
  echo "$DEST/$1"
}
TODOS="$ARCHIVOS $ARRIBA"

CAMBIAN=""
for f in $TODOS; do
  d=$(destino_de "$f")
  if [ ! -f "$d" ]; then
    CAMBIAN="$CAMBIAN$f (NUEVO)\n"
  elif ! diff -q <(tr -d '\r' < "$SRC/$f") <(tr -d '\r' < "$d") >/dev/null 2>&1; then
    CAMBIAN="$CAMBIAN$f\n"
  fi
done

echo "== publicar el emisor SIAT =="
echo "   desde:   $SRC (idéntico a origin/main $SHA)"
echo "   destino: $DEST"
echo

if [ -z "$CAMBIAN" ]; then
  echo "YA ESTA PUBLICADO — el emisor del VPS corre todo lo que main tiene."
  exit 0
fi

# El recuento va en el formato de la casa ("hay que publicar: N arreglo(s)") a
# propósito: `scripts/deploy_sin_pedido.mjs` ya sabe leer esa línea de los otros
# publicadores en seco, así que este destino reusa ese parser en vez de estrenar
# uno propio — una segunda forma de decir lo mismo es como se desincronizan.
N=$(printf "%b" "$CAMBIAN" | grep -c .)
echo "hay que publicar: $N arreglo(s) que el emisor del VPS no tiene"
echo "Cambia:"
printf "%b" "$CAMBIAN" | sed 's/^/   /'
echo

# ── no pisar una corrida viva ───────────────────────────────────────────────
# `pgrep -f` se encuentra a sí mismo (el shell que corre el chequeo lleva el
# patrón en su propia línea de comando), así que se pregunta con `ps` y se
# descarta el PID propio.
VIVOS=$(ps -eo pid,args | grep -F 'fase1-runner' | grep -v grep | awk -v me=$$ '$1 != me' | head -3)
if [ -n "$VIVOS" ]; then
  echo "ERR: hay una corrida de Fase 1 EN CURSO. No se pisa el código bajo un runner vivo:" >&2
  echo "$VIVOS" | sed 's/^/       /' >&2
  exit 1
fi

# ── gate: los tests del emisor, sobre lo que se va a publicar ───────────────
echo "== gate: tests del emisor =="
if ! (cd "$SRC" && node --test test/*.test.mjs >/tmp/siat-gate.log 2>&1); then
  echo "ERR: los tests del emisor dieron ROJO. NO se despliega." >&2
  tail -20 /tmp/siat-gate.log >&2
  exit 1
fi
echo "   verde: $(grep -cE '^ok ' /tmp/siat-gate.log 2>/dev/null || echo '?') casos"
echo

if [ -n "$DRY" ]; then
  echo "[dry-run] hasta acá llegó el simulacro: NO se desplegó nada."
  exit 0
fi

# ── desplegar ───────────────────────────────────────────────────────────────
# Backup del árbol entero antes de pisar nada: es lo que ya hacía el deploy a
# mano (emisor.backup-20260904-0237) y lo único que permite volver atrás sin
# depender de que el repo esté sano.
TS=$(date +%Y%m%d-%H%M%S)
BACKUP="$(dirname "$DEST")/emisor.backup-$TS"
cp -a "$DEST" "$BACKUP" || { echo "ERR: no pude hacer el backup en $BACKUP"; exit 1; }
echo "backup: $BACKUP"

for f in $TODOS; do
  d=$(destino_de "$f")
  mkdir -p "$(dirname "$d")" || { echo "ERR: no pude crear $(dirname "$d")"; exit 1; }
  cp "$SRC/$f" "$d" || { echo "ERR: no pude copiar $f"; exit 1; }
  # El bit de ejecución no viaja con `cp` a un archivo que ya existía: sin esto,
  # el orquestador se despliega y deja de poder correrse.
  [ -x "$SRC/$f" ] && chmod +x "$d"
done

# ── verificar que lo copiado es lo que hay en main ──────────────────────────
FALLA=""
for f in $TODOS; do
  d=$(destino_de "$f")
  diff -q <(tr -d '\r' < "$SRC/$f") <(tr -d '\r' < "$d") >/dev/null 2>&1 || FALLA="$FALLA $f"
  [ -x "$SRC/$f" ] && [ ! -x "$d" ] && FALLA="$FALLA $f(sin-permiso-de-ejecucion)"
done
if [ -n "$FALLA" ]; then
  echo "ERR: después de copiar, estos archivos siguen difiriendo:$FALLA" >&2
  echo "     El árbol anterior está en $BACKUP" >&2
  exit 1
fi

echo
echo "OK: el emisor SIAT corre lo que hay en origin/main ($SHA)."
exit 0
