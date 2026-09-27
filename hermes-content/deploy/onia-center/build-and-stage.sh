#!/usr/bin/env bash
# Build ONIA Center (web-factory/apps/site) standalone on the VPS and stage a new
# runtime-next WITHOUT touching production. Prints the staged path + verification.
#
# Input:  /opt/onia-center/_deploy/wf-code.tgz  (slim code-only archive of main)
# Output: /opt/onia-center/runtime-next.new-<ts>  (assembled standalone, not live)
#
# Heavy static assets (apps/site/public/nuvia) are reused from the current live
# runtime instead of being re-uploaded — they are unchanged product media.
set -euo pipefail

ROOT=/opt/onia-center
DEPLOY=$ROOT/_deploy
TARBALL=$DEPLOY/wf-code.tgz
CURRENT=$ROOT/runtime-next
TS=$(date +%Y%m%d%H%M%S)
BUILD=$DEPLOY/build-$TS
STAGE=$ROOT/runtime-next.new-$TS

echo "== [1/5] extract source -> $BUILD =="
rm -rf "$BUILD"; mkdir -p "$BUILD"
tar -xzf "$TARBALL" -C "$BUILD"
SRC=$BUILD/web-factory
[ -f "$SRC/pnpm-lock.yaml" ] || { echo "ERR: source archive incomplete"; exit 1; }

echo "== [2/5] pnpm install (frozen lockfile) =="
cd "$SRC"
pnpm install --frozen-lockfile

echo "== [3/5] next build (standalone) =="
export ONIA_STANDALONE_BUILD=true
pnpm --filter site build

SA=$SRC/apps/site/.next/standalone
[ -f "$SA/apps/site/server.js" ] || { echo "ERR: standalone server.js missing"; exit 1; }

echo "== [4/5] assemble staged runtime -> $STAGE =="
rm -rf "$STAGE"; mkdir -p "$STAGE"
cp -a "$SA/." "$STAGE/"
cp -a "$SRC/apps/site/.next/static" "$STAGE/apps/site/.next/static"
mkdir -p "$STAGE/apps/site/public"
cp -a "$SRC/apps/site/public/." "$STAGE/apps/site/public/" 2>/dev/null || true
if [ -d "$CURRENT/apps/site/public/nuvia" ]; then
  cp -a "$CURRENT/apps/site/public/nuvia" "$STAGE/apps/site/public/nuvia"
fi

echo "== [5/5] verify staged artifact =="
echo "BUILD_ID=$(cat "$STAGE/apps/site/.next/BUILD_ID" 2>/dev/null || echo NONE)"
# El sha del commit que se esta armando. Este camino NO lo puede estampar: buildea en el VPS
# desde `wf-code.tgz`, un archivo de codigo sin metadatos de git, asi que no hay de donde
# derivarlo — y un `.commit` inventado seria peor que su ausencia (`deploy:sin-pedido` pasaria
# de "no pude medir", honesto, a comparar contra un sha que no existe: fallar EN VERDE).
# Lo que si se puede es DECIRLO en el momento en que se crea el hueco, y no dos semanas
# despues: sin `.commit` en el arbol, `npm run deploy:sin-pedido` no va a poder contestar
# nunca si a onia-center le falta publicar. El camino que si estampa es
# `scripts/deploy-onia-center.sh` (lo corre el Action, y corre en cualquier host Linux con el
# repo y la llave). Se avisa, no se aborta: este guion sigue siendo el rescate valido cuando
# no hay repo a mano.
if [ -s "$STAGE/.commit" ]; then
  echo "COMMIT=$(cat "$STAGE/.commit")"
else
  echo "COMMIT=MISSING — este camino no estampa el sha: produccion queda inmedible para deploy:sin-pedido."
  echo "COMMIT_HINT=publica con scripts/deploy-onia-center.sh si querés que el sha vivo se pueda leer."
fi
MR=$(find "$STAGE" -path '*server/app/api/onia-center/maintenance*' -name 'route.js' 2>/dev/null | head -1 || true)
echo "MAINTENANCE_ROUTE=${MR:-MISSING}"
echo "NUVIA_PUBLIC=$([ -d "$STAGE/apps/site/public/nuvia" ] && echo present || echo MISSING)"
du -sh "$STAGE" 2>/dev/null | awk '{print "STAGE_SIZE="$1}'
rm -rf "$BUILD"
echo "STAGED=$STAGE"
