#!/usr/bin/env bash
# Build de onia-platform (app.onia.com.bo) standalone en el VPS, dejando el
# resultado STAGED en /opt/onia-platform/build-<sha> SIN tocar produccion.
# El swap es el paso siguiente y vive aparte: deploy-gates-swap.sh <sha>.
#
# Nace del 2026-09-03 (tarea t_07a79fa6). El swap estaba scripteado y el BUILD
# no: habia un build-<sha>.sh suelto por deploy (copias identicas salvo el sha)
# y el deploy de ese dia (38a0c8a) se hizo entero a mano, sin dejar script. Un
# paso a mano en la mitad de la cadena es el motivo por el que un commit verde
# se queda dias sin llegar al cliente.
#
# Uso:  build-and-stage.sh <sha|ref>      (default: origin/master)
# Sale 0 solo si el standalone quedo integro y listo para el swap.
set -uo pipefail

REPO=${ONIA_PLATFORM_REPO:-/root/loops/onia-platform}
BASE=/opt/onia-platform
REF=${1:-origin/master}

git -C "$REPO" fetch --quiet origin 2>/dev/null || echo "aviso: fetch fallo, uso $REF como esta"
SHA=$(git -C "$REPO" rev-parse --short "$REF" 2>/dev/null) || { echo "FATAL: ref desconocida: $REF"; exit 1; }

D=$BASE/build-$SHA
LOG=$BASE/build-$SHA.log
exec > >(tee "$LOG") 2>&1

echo "=== BUILD $SHA -> $D ($(date -u +%H:%M:%S) UTC)"

# ── [1/5] el codigo sale de git, no de un tarball hecho a mano ──────────────
# El metodo viejo desempaquetaba onia-platform-<sha>.tar.gz, que alguien tenia
# que generar aparte: la misma trampa que en la landing, donde el tgz era una
# foto de ayer y el runbook publicaba codigo viejo con cara de nuevo.
rm -rf "$D"; mkdir -p "$D"
git -C "$REPO" archive --format=tar "$SHA" | tar -x -C "$D" || { echo "FATAL: git archive fallo"; exit 1; }
echo "SOURCE_OK=$(ls -1 "$D" | wc -l) entradas"

# ── [2/5] ningun .env que Next pueda hornear ────────────────────────────────
# CLAUDE.md: nunca buildear produccion con un .env.local presente — Next hornea
# los NEXT_PUBLIC_* en el bundle y publica 127.0.0.1 al cliente.
MALOS=$(find "$D" -maxdepth 1 -name '.env*' ! -name '*.example' -printf '%f ' 2>/dev/null)
if [ -n "$MALOS" ]; then echo "FATAL: env files en el source: $MALOS"; exit 1; fi
echo "SIN_ENV_FILES=ok"

cd "$D" || { echo "FATAL: no puedo entrar a $D"; exit 1; }

# ── [3/5] install SIN NODE_ENV y SIN app.env ────────────────────────────────
# NODE_ENV=production antes del install saltea las devDependencies y el build
# muere sin next/tailwind. El orden importa y por eso va comentado.
echo "=== npm ci --include=dev (sin NODE_ENV, sin app.env)"
npm ci --include=dev
INSTALL_EXIT=$?
echo "NPM_INSTALL_EXIT=$INSTALL_EXIT"
echo "PAQUETES=$(ls node_modules 2>/dev/null | wc -l)"
[ "$INSTALL_EXIT" = "0" ] || { echo "FATAL: npm ci fallo, no sigo al build"; exit 1; }

# ── [4/5] build con app.env horneado ────────────────────────────────────────
# `npm run build` del repo ya encadena: prisma generate + subset de iconos +
# next build + prepare-standalone-runtime (copia .next/static y public dentro
# del standalone) + remove-standalone-env. No se repiten a mano: se verifican
# abajo. Verificado el 2026-09-03 leyendo scripts/prepare-standalone-runtime.mjs.
echo "=== app.env + NODE_ENV=production + npm run build"
set -a; . "$BASE/app.env"; set +a
export NODE_ENV=production
npm run build
BUILD_EXIT=$?
echo "BUILD_EXIT=$BUILD_EXIT"
[ "$BUILD_EXIT" = "0" ] || { echo "FATAL: build fallo"; exit 1; }

# ── [5/5] el standalone tiene que estar integro ANTES del swap ──────────────
# Son los mismos cuatro archivos que exige el GATE 1 de deploy-gates-swap.sh:
# si faltan, el swap deja produccion sin server.js.
NB=$D/.next/standalone
S=ok; T=ok; M=ok
test -f "$NB/server.js"     || S=FALTA
test -d "$NB/.next/static"  || T=FALTA
test -d "$NB/node_modules"  || M=FALTA
BID=$(cat "$NB/.next/BUILD_ID" 2>/dev/null)
echo "STANDALONE_server.js=$S static=$T node_modules=$M BUILD_ID=${BID:-FALTA}"
if [ "$S$T$M" != "okokok" ] || [ -z "$BID" ]; then
  echo "FATAL: standalone incompleto, NO apto para swap"; exit 1
fi

echo "=== FIN $(date -u +%H:%M:%S) UTC | tamano: $(du -sh "$D" | cut -f1)"
echo "STAGED_OK sha=$SHA build_id=$BID"
echo "siguiente paso (DEPLOY, pide OK de Sergio): $BASE/deploy-gates-swap.sh $SHA"
