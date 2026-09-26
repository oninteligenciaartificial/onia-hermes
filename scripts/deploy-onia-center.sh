#!/usr/bin/env bash
# Deploy de ONIA Center (web-factory/apps/site) al VPS. Idempotente.
#
# Buildea el standalone de Next en ESTE host — que DEBE ser Linux glibc (CI ubuntu),
# NUNCA Windows (sharp es binario nativo) NI el VPS (swap al 100% → riesgo OOM en prod).
# Sube por tarball, backup + swap del runtime, restart, verifica y hace ROLLBACK si falla.
#
# Env:
#   VPS_HOST (default 187.77.16.63), VPS_USER (default root), VPS_KEY (ruta a la llave SSH)
#   DEPLOY_SWAP=true|false   false = solo build + stage (no toca prod). Default false.
#   DEPLOY_REF               sha informativo del commit desplegado.
#
# Optimización: public/nuvia (media estática ~240MB) NO va en el tarball; se reusa del
# runtime vivo. Si cambian assets de Nuvia, hacer un sync completo aparte (ver RUNBOOK).
set -euo pipefail

VPS_HOST="${VPS_HOST:-187.77.16.63}"
VPS_USER="${VPS_USER:-root}"
VPS_KEY="${VPS_KEY:?VPS_KEY (ruta a la llave SSH) es requerido}"
DEPLOY_SWAP="${DEPLOY_SWAP:-false}"
TS=$(date +%Y%m%d%H%M%S)
REF="${DEPLOY_REF:-$(git rev-parse --short HEAD 2>/dev/null || echo unknown)}"
# El sha que se estampa en produccion, RESUELTO a commit. `DEPLOY_REF` lo escribe
# una persona o el Action, asi que puede llegar `main` — y un `.commit` que dice
# `main` no se puede comparar con nada, porque `main` se mueve.
SHA="$(git rev-parse --short "$REF" 2>/dev/null || echo unknown)"
REMOTE="$VPS_USER@$VPS_HOST"
ROOT=/opt/onia-center
REPO="$(cd "$(dirname "$0")/.." && pwd)"
SSHOPTS="-i $VPS_KEY -o StrictHostKeyChecking=accept-new -o UserKnownHostsFile=/dev/null -o ConnectTimeout=25"

echo "== [1/6] build standalone (host $(uname -s)/$(uname -m)) =="
cd "$REPO/web-factory"
corepack enable >/dev/null 2>&1 || true
pnpm install --frozen-lockfile
ONIA_STANDALONE_BUILD=true pnpm --filter site build
SA="apps/site/.next/standalone"
[ -f "$SA/apps/site/server.js" ] || { echo "ERR: standalone server.js ausente"; exit 1; }

echo "== [2/6] ensamblar runtime + tarball (excl public/nuvia) =="
WORK="$(mktemp -d)"; STAGE="$WORK/runtime-next"; mkdir -p "$STAGE/apps/site/public"
cp -a "$SA/." "$STAGE/"
cp -a "apps/site/.next/static" "$STAGE/apps/site/.next/static"
( cd apps/site/public && tar -cf - --exclude=nuvia . ) | ( cd "$STAGE/apps/site/public" && tar -xf - )
BUILD_ID="$(cat "$STAGE/apps/site/.next/BUILD_ID")"
# EL SHA VIVO DE onia-center, que hasta el 2026-09-26 no existia. Sin este archivo
# el destino no se puede medir: corre `node:20-alpine` (imagen sin etiqueta de
# commit) y `deploy:sin-pedido` contestaba «no hay sha vivo que comparar», que es
# como un build del 1-sep atendio leads quince dias sin que nadie lo viera.
# Va DENTRO de $STAGE porque el tarball es lo UNICO que viaja al VPS, y solo si el
# sha se pudo resolver: un `.commit` con "unknown" adentro es peor que su ausencia
# —el instrumento pasaria de «no pude medir» a comparar contra un sha inexistente,
# o sea a fallar EN VERDE. Lo cuida scripts/onia-center-sha-vivo.test.mjs.
if [ "$SHA" != unknown ]; then printf '%s\n' "$SHA" > "$STAGE/.commit"; fi
TARBALL="$WORK/runtime-$TS.tgz"
tar -C "$WORK" -czf "$TARBALL" runtime-next
echo "BUILD_ID=$BUILD_ID ref=$REF commit=$SHA tarball=$(du -h "$TARBALL" | cut -f1)"

echo "== [3/6] subir + stage en VPS (reusa public/nuvia del runtime vivo) =="
ssh $SSHOPTS "$REMOTE" "mkdir -p $ROOT/_deploy"
scp $SSHOPTS "$TARBALL" "$REMOTE:$ROOT/_deploy/runtime-$TS.tgz"
ssh $SSHOPTS "$REMOTE" "bash -s" <<EOF
set -e
cd $ROOT
rm -rf runtime-next.new-$TS && mkdir -p runtime-next.new-$TS
tar -C runtime-next.new-$TS -xzf _deploy/runtime-$TS.tgz --strip-components=1
if [ -d runtime-next/apps/site/public/nuvia ]; then cp -a runtime-next/apps/site/public/nuvia runtime-next.new-$TS/apps/site/public/nuvia; fi
[ -f runtime-next.new-$TS/apps/site/server.js ] || { echo "ERR: staged server.js ausente"; exit 1; }
echo "STAGED_BUILD_ID=\$(cat runtime-next.new-$TS/apps/site/.next/BUILD_ID)"
grep -rl 'Agente Vendedor' runtime-next.new-$TS/apps/site/.next/server >/dev/null 2>&1 && echo "AGENTE_VENDEDOR=present" || echo "AGENTE_VENDEDOR=MISSING"
rm -f _deploy/runtime-$TS.tgz
EOF

if [ "$DEPLOY_SWAP" != "true" ]; then
  echo "STAGED_ONLY=$ROOT/runtime-next.new-$TS (sin swap). Correr con DEPLOY_SWAP=true para promover."
  exit 0
fi

echo "== [4/6] backup + swap + restart + verify + rollback (en el VPS) =="
scp $SSHOPTS "$REPO/hermes-content/deploy/onia-center/swap-and-verify.sh" "$REMOTE:$ROOT/_deploy/swap-and-verify.sh"
ssh $SSHOPTS "$REMOTE" "sed -i 's/\r\$//' $ROOT/_deploy/swap-and-verify.sh && bash $ROOT/_deploy/swap-and-verify.sh $ROOT/runtime-next.new-$TS"

echo "== [5/6] verificacion HTTP publica =="
ssh $SSHOPTS "$REMOTE" 'c(){ curl -s -o /dev/null -w "%{http_code}" -m 12 "$1"; }; echo "/onia-center -> $(c https://center.onia.com.bo/onia-center)"; echo "/onia-center/login -> $(c https://center.onia.com.bo/onia-center/login)"'

echo "== [6/6] maintenance dry-run (matched debe seguir en 0) =="
scp $SSHOPTS "$REPO/hermes-content/deploy/onia-center/maintenance-cleanup.js" "$REMOTE:$ROOT/_deploy/maintenance-cleanup.js" 2>/dev/null || true
ssh $SSHOPTS "$REMOTE" "docker exec -i onia-center node - < $ROOT/_deploy/maintenance-cleanup.js 2>/dev/null || echo '(maintenance helper no disponible)'"

echo "DEPLOY_OK ref=$REF build=$BUILD_ID"
