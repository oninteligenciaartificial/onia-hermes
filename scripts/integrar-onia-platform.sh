#!/bin/bash
# Entrega una rama de carril a `master` de onia-platform, ENTERA y en UN solo proceso.
#
# POR QUÉ existe, y por qué no es un `git merge` a mano:
#   - Desde nodo-casa NO se puede pushear a onia-platform (su remoto es
#     `DESHABILITADO-NODO-DE-DESARROLLO`; la llave vive sólo en el VPS), así que la entrega
#     se hace por SSH. Y un merge commit NO viaja por `git format-patch | git am`.
#   - Los cinco gates tardan ~9 min, y en ese repo hay una sesión humana empujando a `master`
#     en ráfaga: el 2026-09-18 el push rebotó DOS veces por non-fast-forward mientras se medía.
#     Por eso gates y push van en el MISMO proceso, con bucle de reintento: cada ida y vuelta
#     manual desde casa regala la ventana entera.
#   - Y `git push … | tail` NO corta un script con `set -e` (el exit es el de `tail`), así que
#     acá el veredicto de "publicó" se toma de `git log HEAD --not --remotes=origin`, no del
#     código de salida del push. Esa confusión ya borró un worktree con el merge sin publicar.
#
# Hasta el 2026-09-18 esto vivía SIN fuente, en un archivo suelto de `/root/tmp` del VPS: una
# limpieza de disco lo borraba y la vuelta siguiente del integrador se quedaba sin camino a
# `master` y sin saber que había existido. Vive acá para que haya UNA sola copia.
#
# CÓMO SE INVOCA desde nodo-casa (el clon del VPS se pone al día primero, o no se corre):
#
#   ssh -o BatchMode=yes root@187.77.16.63 \
#     'git -C /root/loops/onia-hermes fetch --quiet origin \
#      && git -C /root/loops/onia-hermes merge --ff-only origin/main --quiet \
#      && bash /root/loops/onia-hermes/scripts/integrar-onia-platform.sh claude/<rama>'
#
# Códigos: 0 publicado · 2 no se pudo preparar el árbol · 3 conflicto (merge abortado)
#          4 un gate en rojo (nombra cuál) · 5 no publicó tras los reintentos.
set -u

RAMA_ARG="${1:-}"
if [ -z "$RAMA_ARG" ]; then
  echo "uso: $0 <rama> [intentos]   — ej: $0 claude/chatbots-platform-review-0d1d09" >&2
  exit 2
fi
# Se acepta con o sin `origin/`: el sujeto es la rama PUBLICADA, nunca una local.
RAMA="origin/${RAMA_ARG#origin/}"
INTENTOS="${2:-2}"

ARBOL=/root/tmp/plat-merge
REPO=/root/loops/onia-platform
# `check:onia-core` busca el contrato en <padre>/onia-hermes y, si no está, imprime
# "check SKIPPED" y sale 0 — o sea la cadena queda verde sin haber medido el espejo del core.
HERMANO_ESPERADO="$(dirname "$ARBOL")/onia-hermes"

preparar_arbol() {
  if [ ! -d "$ARBOL/.git" ] && [ ! -f "$ARBOL/.git" ]; then
    git -C "$REPO" fetch origin --quiet || return 1
    git -C "$REPO" worktree add --detach "$ARBOL" origin/master >/dev/null 2>&1 || return 1
  fi
  # node_modules por HARDLINK: un symlink hace que el output standalone de Next muera con
  # "[standalone-runtime] Required directory is missing, invalid or linked", un rojo que se
  # lee como código roto y es del instrumento.
  if [ ! -d "$ARBOL/node_modules" ]; then
    cp -al "$REPO/node_modules" "$ARBOL/node_modules" || return 1
  fi
  [ -e "$HERMANO_ESPERADO" ] || ln -sfn /root/loops/onia-hermes "$HERMANO_ESPERADO" || return 1
}

preparar_arbol || { echo "NO PUDE PREPARAR EL ARBOL $ARBOL (worktree, node_modules o el hermano onia-hermes)"; exit 2; }
cd "$ARBOL" || exit 2

for intento in $(seq 1 "$INTENTOS"); do
  echo "=== intento $intento ==="
  git fetch origin --quiet || { echo "NO PUDE FETCHEAR"; exit 2; }
  git reset --hard origin/master --quiet || { echo "NO PUDE PONER EL ARBOL EN origin/master"; exit 2; }
  git merge --no-ff "$RAMA" -m "Merge remote-tracking branch '$RAMA'" >/dev/null 2>&1
  if [ -n "$(git diff --name-only --diff-filter=U)" ]; then
    echo "CONFLICTO — se resuelve a mano, nunca se suelta el turno con el merge abierto"
    git diff --name-only --diff-filter=U
    git merge --abort
    exit 3
  fi
  echo "base $(git rev-parse --short origin/master) -> merge $(git rev-parse --short HEAD)"

  npm run check:onia-core >/tmp/g1.log 2>&1 || { echo "ROJO check:onia-core"; tail -5 /tmp/g1.log; exit 4; }
  grep -q 'SKIPPED' /tmp/g1.log && { echo "ROJO check:onia-core no midio nada (SKIPPED): falta $HERMANO_ESPERADO"; exit 4; }
  npx tsc --noEmit >/tmp/g2.log 2>&1 || { echo "ROJO tsc"; tail -10 /tmp/g2.log; exit 4; }
  npx vitest run >/tmp/g3.log 2>&1 || { echo "ROJO vitest"; grep -E "FAIL|Tests " /tmp/g3.log | tail -10; exit 4; }
  npm run lint >/tmp/g4.log 2>&1 || { echo "ROJO lint"; tail -5 /tmp/g4.log; exit 4; }
  # ENCRYPTION_KEY: sin ella el build muere con "Failed to collect page data for
  # /api/gateway-config", que NO nombra al env faltante y hace culpar a la rama recién
  # mergeada. No es NEXT_PUBLIC_*, así que no se hornea en el bundle.
  ENCRYPTION_KEY=$(node -e 'console.log(require("crypto").randomBytes(32).toString("hex"))') \
    npm run build >/tmp/g5.log 2>&1 || { echo "ROJO build"; tail -10 /tmp/g5.log; exit 4; }
  echo "5 gates verdes | $(grep -E 'Tests ' /tmp/g3.log | tail -1)"

  # El build REGENERA la fuente de iconos y deja 4 archivos sin commitear: si viajan, se
  # publica una fuente que no decidió nadie.
  git checkout -- . 2>/dev/null

  ONIA_LOOP_ID=onia-cola git push origin HEAD:master >/tmp/push.log 2>&1
  if [ "$(git log HEAD --not --remotes=origin --oneline | wc -l)" = "0" ]; then
    echo "PUBLICADO: $(git rev-parse --short HEAD)"
    exit 0
  fi
  echo "push rechazado (master se movio debajo), rehago el merge"
  tail -2 /tmp/push.log
done

echo "NO PUBLICADO tras $INTENTOS intento(s)"
exit 5
