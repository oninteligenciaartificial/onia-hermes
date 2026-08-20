#!/usr/bin/env bash
# Deploy de la landing Onia Platform (web-factory/apps/onia-platform) al VPS.
# Mismo modelo que deploy-onia-center.sh: build standalone en Linux glibc (CI),
# tarball, stage, swap con backup + verificacion + rollback automatico.
# NUNCA buildear en Windows (symlinks pnpm fallan con EPERM) ni en el VPS (swap).
#
# Env: VPS_HOST, VPS_USER, VPS_KEY (requerido), DEPLOY_SWAP=true|false, DEPLOY_REF.
set -euo pipefail

VPS_HOST="${VPS_HOST:-187.77.16.63}"
VPS_USER="${VPS_USER:-root}"
VPS_KEY="${VPS_KEY:?VPS_KEY (ruta a la llave SSH) es requerido}"
DEPLOY_SWAP="${DEPLOY_SWAP:-false}"
TS=$(date +%Y%m%d%H%M%S)
REF="${DEPLOY_REF:-$(git rev-parse --short HEAD 2>/dev/null || echo unknown)}"
REMOTE="$VPS_USER@$VPS_HOST"
ROOT=/opt/onia-landing
REPO="$(cd "$(dirname "$0")/.." && pwd)"
SSHOPTS="-i $VPS_KEY -o StrictHostKeyChecking=accept-new -o UserKnownHostsFile=/dev/null -o ConnectTimeout=25"

echo "== [1/5] build standalone onia-platform (host $(uname -s)/$(uname -m)) =="
cd "$REPO/web-factory"
corepack enable >/dev/null 2>&1 || true
pnpm install --frozen-lockfile
ONIA_STANDALONE_BUILD=true pnpm --filter onia-platform build
SA="apps/onia-platform/.next/standalone"
[ -f "$SA/apps/onia-platform/server.js" ] || { echo "ERR: standalone server.js ausente"; exit 1; }

echo "== [2/5] ensamblar runtime + tarball =="
WORK="$(mktemp -d)"; STAGE="$WORK/runtime-next"; mkdir -p "$STAGE/apps/onia-platform/public"
cp -a "$SA/." "$STAGE/"
cp -a "apps/onia-platform/.next/static" "$STAGE/apps/onia-platform/.next/static"
[ -d apps/onia-platform/public ] && cp -a apps/onia-platform/public/. "$STAGE/apps/onia-platform/public/"
BUILD_ID="$(cat "$STAGE/apps/onia-platform/.next/BUILD_ID")"
TARBALL="$WORK/runtime-$TS.tgz"
tar -C "$WORK" -czf "$TARBALL" runtime-next
echo "BUILD_ID=$BUILD_ID ref=$REF tarball=$(du -h "$TARBALL" | cut -f1)"

echo "== [3/5] subir + stage en VPS =="
ssh $SSHOPTS "$REMOTE" "mkdir -p $ROOT/_deploy"
scp $SSHOPTS "$TARBALL" "$REMOTE:$ROOT/_deploy/runtime-$TS.tgz"
ssh $SSHOPTS "$REMOTE" "bash -s" <<EOF
set -e
cd $ROOT
rm -rf runtime-next.new-$TS && mkdir -p runtime-next.new-$TS
tar -C runtime-next.new-$TS -xzf _deploy/runtime-$TS.tgz --strip-components=1
[ -f runtime-next.new-$TS/apps/onia-platform/server.js ] || { echo "ERR: staged server.js ausente"; exit 1; }
echo "STAGED_BUILD_ID=\$(cat runtime-next.new-$TS/apps/onia-platform/.next/BUILD_ID)"
grep -rl 'agenda-intake' runtime-next.new-$TS/apps/onia-platform/.next/server >/dev/null 2>&1 && echo "AGENDA_INTAKE=present" || echo "AGENDA_INTAKE=MISSING"
rm -f _deploy/runtime-$TS.tgz
EOF

if [ "$DEPLOY_SWAP" != "true" ]; then
  echo "STAGED_ONLY=$ROOT/runtime-next.new-$TS (sin swap)."
  exit 0
fi

echo "== [4/5] backup + swap + restart + verify + rollback =="
scp $SSHOPTS "$REPO/hermes-content/deploy/onia-landing/swap-and-verify.sh" "$REMOTE:$ROOT/_deploy/swap-and-verify.sh"
ssh $SSHOPTS "$REMOTE" "sed -i 's/\r\$//' $ROOT/_deploy/swap-and-verify.sh && bash $ROOT/_deploy/swap-and-verify.sh $ROOT/runtime-next.new-$TS"

echo "== [5/5] verificacion HTTP publica =="
ssh $SSHOPTS "$REMOTE" 'c(){ curl -sk -o /dev/null -w "%{http_code}" -m 12 "$1" --resolve onia.com.bo:443:127.0.0.1; }; echo "/ -> $(c https://onia.com.bo/)"'

echo "DEPLOY_OK ref=$REF build=$BUILD_ID"
