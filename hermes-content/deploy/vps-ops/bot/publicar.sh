#!/usr/bin/env bash
# Publica el bot de Onia. UN comando, SIN argumentos, que no caduca nunca.
#
# POR QUÉ EXISTE. `ok <id>` de Sergio sabía publicar una PIEZA y desplegar la
# landing y la plataforma. El BOT no estaba en la lista blanca de
# publicar-aprobado.mjs, así que un `ok` sobre un pedido de deploy del bot
# devolvía «destino desconocido» y NO desplegaba nada — con el pedido escrito,
# el aviso entregado y el tilde verde de «desbloqueada» a la vista.
#
# Medido el 2026-09-05 16:xx La Paz: DOS tareas `ready` pedían el MISMO swap
# (t_7340fb5b y t_43e4b9ec) sobre un bot vivo que le contestaba «• Servicios:
# en construcción, sin humo» a 2 de los 5 rubros que hoy se contratan en
# app.onia.com.bo/register — el 40% de los prospectos, y encima exhibiendo obra,
# que la regla de Sergio del 2026-08-20 prohíbe en superficie de cliente. La
# propia t_7340fb5b ya lo dejaba escrito: «el bot NO está en la lista blanca,
# así que un `ok <id>` sobre esta tarea no despliega nada».
#
# POR QUÉ NO NOMBRA NINGUNA CARPETA. Es la lección de la landing (ver
# hermes-content/deploy/onia-landing/publicar.sh): un pedido que nombra un
# artefacto con timestamp caduca cuando el build siguiente lo borra, y el fallo
# se disfraza de decisión pendiente. Acá no hay artefacto: se COMPRUEBA que el
# subárbol del bot en el árbol de trabajo sea idéntico a `origin/main`, y recién
# entonces se despliega desde ahí. Si difiere, se corta con código 2 y se dice
# en qué archivo — nunca se publica el working tree del integrador sin avisar.
#
# POR QUÉ NO SE EXTRAE A UN TEMPORAL, que fue el primer intento y salió mal.
# `git archive origin/main <subárbol> | tar -x` en /tmp da un árbol pelado, y
# ahí DOS gates del bot se ponen rojos por el instrumento y no por el código:
# espejo-check.test.mjs corre `git check-attr` y muere con «not a git
# repository», y campanas-web.test.mjs cruza los literales waLink() de
# web-factory, que en el temporal no existen. Medido el 2026-09-05: 849 pass y
# 2 fail sobre un bot sano, con `npm test` verde en el repo a la misma hora. Un
# rojo falso acá no es cosmético: deploy-bot.sh se niega a desplegar, así que el
# circuito quedaba cerrado para siempre y el fallo se leería como «el bot está
# roto». Es la misma familia que el worktree sin node_modules.
#
# El trabajo pesado lo hace deploy-bot.sh, que ya es idempotente y seguro: corre
# los tests como gate, compara por lista blanca (nunca borra knowledge.json ni
# webhook.env, que no están en git), hace backup de lo que pisa, reinicia el
# webhook y exige `"ok":true` del /health antes de cantar victoria.
#
# Uso:
#   bash /opt/onia/bot/_deploy/publicar.sh              # despliega lo que haya en main
#   bash /opt/onia/bot/_deploy/publicar.sh --dry-run    # dice qué haría, NO toca producción
#
# Salidas: 0 desplegado (o ya estaba al día) · 1 no se pudo desplegar · 2 no se pudo medir.
set -uo pipefail

REPO=${ONIA_LOOPS_REPO:-/root/loops/onia-hermes}
SUB=hermes-content/deploy/vps-ops/bot
DEST=${ONIA_BOT_DEST:-/opt/onia/bot}
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

# Estar ATRASADO no es motivo para no publicar, y tratarlo como si lo fuera dejó
# este pedido INEJECUTABLE tres días. Desde que el integrador se mudó al nodo de
# casa y pushea desde allá, nadie vuelve a tocar este clon: quedarse atrás es su
# estado normal, no una anomalía. Medido el 2026-09-08: el clon estaba 6 commits
# atrás y `--dry-run` cortaba con «NO coincide con origin/main», así que un `ok`
# de Sergio Urcullo sobre t_340bd6e2 habría puesto el tilde verde sin desplegar.
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

# `diff` cubre las tres formas de diferir a la vez: commits sin mergear, cambios
# sin commitear y archivos sin trackear que taparían a uno versionado.
DIFIEREN=$(git diff --name-only origin/main -- "$SUB"; git ls-files --others --exclude-standard -- "$SUB")
if [ -n "$DIFIEREN" ]; then
  echo "ERR: el árbol de $REPO NO coincide con origin/main en $SUB." >&2
  echo "     No se despliega: lo que se publique tiene que ser lo que está en main." >&2
  echo "$DIFIEREN" | sed 's/^/       /' >&2
  exit 2
fi

BOT="$REPO/$SUB"
[ -f "$BOT/deploy-bot.sh" ] || { echo "ERR: no encuentro $BOT/deploy-bot.sh"; exit 2; }

echo "== publicar el bot =="
echo "   desde:   $BOT (idéntico a origin/main $SHA)"
echo "   destino: $DEST"
echo

# ── desplegar ───────────────────────────────────────────────────────────────
# deploy-bot.sh es DRY-RUN por defecto y sólo aplica con --aplicar, así que el
# modo seco de acá es simplemente no pasarle esa bandera: los dos caminos corren
# EL MISMO script, y no hay una segunda copia de la lógica que se desincronice.
if [ -n "$DRY" ]; then
  echo "[dry-run] producción NO se toca."
  ONIA_BOT_DEST="$DEST" bash "$BOT/deploy-bot.sh"
  CODIGO=$?
  echo
  # El simulacro TIENE que propagar el veredicto del gate. Devolver 0 acá diría
  # "un deploy real saldría bien" justo cuando deploy-bot.sh se está negando —
  # es la misma clase de mentira que el modo seco que se reportaba como
  # ejecutado (2026-09-05, scripts/kanban/desplegar-en-segundo-plano.sh).
  if [ "$CODIGO" != 0 ]; then
    echo "[dry-run] el gate del bot dio ROJO (código $CODIGO): un deploy real se negaría. NO se desplegó nada." >&2
    exit 1
  fi
  echo "[dry-run] hasta acá llegó el simulacro: NO se desplegó nada."
  exit 0
fi

ONIA_BOT_DEST="$DEST" bash "$BOT/deploy-bot.sh" --aplicar
CODIGO=$?

if [ "$CODIGO" != 0 ]; then
  echo "ERR: el deploy del bot falló (código $CODIGO). Producción quedó como estaba o con el backup que nombra deploy-bot.sh." >&2
  exit 1
fi

echo
echo "OK: el bot corre lo que hay en origin/main ($SHA)."
exit 0
