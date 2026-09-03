#!/usr/bin/env bash
# Build la LANDING (web-factory/apps/onia-platform) standalone en el VPS y deja
# un runtime-next staged SIN tocar produccion. Calcado del metodo ya probado en
# /opt/onia-center/_deploy/build-and-stage.sh, cambiando site -> onia-platform.
#
# Input:  /opt/onia-landing/_deploy/wf-code.tgz  (archivo slim de main)
# Output: /opt/onia-landing/runtime-next.new-<ts>  (standalone armado, no vivo)
#
# NO se exporta NODE_ENV ni se sourcea app.env antes del install: NODE_ENV=production
# antes del install saltea las devDependencies y el build muere sin next/tailwind.
# El contenedor ya inyecta app.env en runtime; esta app no tiene NEXT_PUBLIC_*.
set -euo pipefail

ROOT=/opt/onia-landing
DEPLOY=$ROOT/_deploy
TARBALL=$DEPLOY/wf-code.tgz
TS=$(date +%Y%m%d%H%M%S)
BUILD=$DEPLOY/build-$TS
STAGE=$ROOT/runtime-next.new-$TS

# ── [0/5] el tgz se regenera DESDE main, siempre ────────────────────────────
# 🔴 Nace del 2026-09-03. wf-code.tgz era un snapshot hecho a mano el 2-sep 16:51
# y nadie lo volvia a hacer: "publicar" compilaba codigo de ayer con cara de hoy.
# Se corrio el runbook entero, dio DEPLOY_OK, y el sitio vivo siguio diciendo
# "(borrador, pendiente de revision por abogado)" en /terminos y sirviendo una
# pagina de error de 29 KB como favicon — los seis fixes estaban en main, no en
# el tgz. Un runbook que publica una foto vieja es peor que no tener runbook:
# el DEPLOY_OK convence.
#
# Los seis paths son exactamente los que tenia el tgz original (medidos con
# `tar -tzf`): lo que el build necesita y nada mas (sin docs, sin references).
REPO=${ONIA_LOOPS_REPO:-/root/loops/onia-hermes}
REF=${ONIA_LANDING_REF:-origin/main}
if git -C "$REPO" rev-parse --verify -q "$REF" >/dev/null 2>&1; then
  git -C "$REPO" fetch origin --quiet 2>/dev/null || echo "aviso: fetch fallo, uso $REF como esta"
  COMMIT=$(git -C "$REPO" rev-parse --short "$REF")
  echo "== [0/5] wf-code.tgz <- $REF ($COMMIT) =="
  [ -f "$TARBALL" ] && cp -a "$TARBALL" "$TARBALL.bak-$TS"
  git -C "$REPO" archive --format=tar "$REF" \
    web-factory/apps web-factory/packages web-factory/package.json \
    web-factory/pnpm-lock.yaml web-factory/pnpm-workspace.yaml web-factory/tsconfig.json \
    | gzip > "$TARBALL.new" && mv -f "$TARBALL.new" "$TARBALL"
  # Se conservan 3 respaldos: un tgz viejo es la unica forma de rehacer un build
  # anterior si el swap hace rollback y hay que investigar.
  ls -1t "$TARBALL".bak-* 2>/dev/null | tail -n +4 | xargs -r rm -f
else
  COMMIT="desconocido"
  echo "aviso: no encuentro $REF en $REPO — uso el wf-code.tgz que hay (puede ser VIEJO)"
fi

echo "== [1/5] extract source -> $BUILD =="
rm -rf "$BUILD"; mkdir -p "$BUILD"
tar -xzf "$TARBALL" -C "$BUILD"
# Que quede escrito QUE commit es este build: sin esto, saber que esta publicado
# exige comparar md5 a mano contra main (se hizo asi hoy, y es lento y fragil).
printf '%s\n' "$COMMIT" > "$BUILD/.commit"
SRC=$BUILD/web-factory
[ -f "$SRC/pnpm-lock.yaml" ] || { echo 'ERR: source archive incomplete'; exit 1; }
for f in .env .env.local .env.production .env.production.local; do
  [ -f "$SRC/apps/onia-platform/$f" ] && { echo "FATAL: $f presente en el source"; exit 1; }
done
echo 'OK: sin env files que Next hornee'

echo "== [2/5] pnpm install (frozen lockfile) =="
cd "$SRC"
pnpm install --frozen-lockfile

echo "== [3/5] next build (standalone, webpack = default en Next 15.5) =="
pnpm --filter onia-platform build

SA=$SRC/apps/onia-platform/.next/standalone
[ -f "$SA/apps/onia-platform/server.js" ] || { echo 'ERR: standalone server.js missing'; exit 1; }

echo "== [4/5] assemble staged runtime -> $STAGE =="
rm -rf "$STAGE"; mkdir -p "$STAGE"
cp -a "$SA/." "$STAGE/"
cp -a "$SRC/apps/onia-platform/.next/static" "$STAGE/apps/onia-platform/.next/static"
mkdir -p "$STAGE/apps/onia-platform/public"
cp -a "$SRC/apps/onia-platform/public/." "$STAGE/apps/onia-platform/public/" 2>/dev/null || true

echo "== [5/5] verify staged artifact =="
echo "BUILD_ID=$(cat "$STAGE/apps/onia-platform/.next/BUILD_ID" 2>/dev/null || echo NONE)"
echo "SERVER_JS=$([ -f "$STAGE/apps/onia-platform/server.js" ] && echo present || echo MISSING)"
echo "NODE_MODULES=$([ -d "$STAGE/node_modules" ] && echo present || echo MISSING)"
echo "STATIC=$([ -d "$STAGE/apps/onia-platform/.next/static" ] && echo present || echo MISSING)"
echo "PUBLIC_CAPTURAS=$(ls "$STAGE/apps/onia-platform/public/capturas" 2>/dev/null | wc -l)"
APP=$STAGE/apps/onia-platform/.next/server/app
for r in index rubros agentes chatbot precios comparativa facturacion contacto empezar v1; do
  echo "ROUTE $r=$([ -f "$APP/$r.html" ] && echo ok || echo MISSING)"
done
du -sh "$STAGE" 2>/dev/null | awk '{print "STAGE_SIZE="$1}'
rm -rf "$BUILD"
echo "STAGED=$STAGE"
