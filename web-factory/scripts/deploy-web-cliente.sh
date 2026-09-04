#!/usr/bin/env bash
# Publica una web de cliente de Web Factory (apps/dental-premium, apps/ferreteria-sur)
# en el VPS: build standalone -> tarball -> stage -> swap con backup y rollback.
#
# Mismo modelo que scripts/deploy-onia-landing.sh, que es el que ya publica
# onia.com.bo. Dos diferencias, y las dos son porque un sitio de cliente ARRANCA
# de cero mientras la landing ya tenia todo montado:
#
#   1. Si el contenedor no existe, este script lo CREA (primer deploy).
#   2. El vhost de traefik NO lo toca: lo imprime para que se pegue a mano.
#      Traefik es infra de un solo dueno (CLAUDE.md) y el subdominio lo elige
#      Sergio. Pegar ese fragmento es el unico paso que queda fuera de aca.
#
# Uso:
#   APP=dental-premium SITE_DOMAIN=dental.onia.com.bo VPS_KEY=~/.ssh/id_vps \
#     bash web-factory/scripts/deploy-web-cliente.sh
#
# Env: APP (requerido), SITE_DOMAIN (requerido), VPS_KEY (requerido),
#      VPS_HOST, VPS_USER, DEPLOY_SWAP=true|false (default false), DEPLOY_REF.
#
# DEPLOY_SWAP=false (el default) buildea y deja el runtime staged SIN tocar nada
# publicado. Ese es el modo que puede correr un loop; el swap lo aprieta Sergio.
set -euo pipefail

APP="${APP:?APP es requerido (dental-premium | ferreteria-sur)}"
SITE_DOMAIN="${SITE_DOMAIN:?SITE_DOMAIN es requerido (ej: dental.onia.com.bo)}"
VPS_KEY="${VPS_KEY:?VPS_KEY (ruta a la llave SSH) es requerido}"
VPS_HOST="${VPS_HOST:-187.77.16.63}"
VPS_USER="${VPS_USER:-root}"
DEPLOY_SWAP="${DEPLOY_SWAP:-false}"

case "$APP" in
  dental-premium|ferreteria-sur) ;;
  *) echo "ERR: APP '$APP' no es una web de cliente de este carril"; exit 1 ;;
esac

TS=$(date +%Y%m%d%H%M%S)
REF="${DEPLOY_REF:-$(git rev-parse --short HEAD 2>/dev/null || echo unknown)}"
REMOTE="$VPS_USER@$VPS_HOST"
CT="onia-web-$APP"          # nombre del contenedor; traefik lo alcanza por este nombre
ROOT="/opt/$CT"
NET=easypanel               # la red donde vive el traefik de Easypanel
WF="$(cd "$(dirname "$0")/.." && pwd)"
SSHOPTS="-i $VPS_KEY -o StrictHostKeyChecking=accept-new -o UserKnownHostsFile=/dev/null -o ConnectTimeout=25"

echo "== [1/6] build standalone $APP (host $(uname -s)/$(uname -m)) =="
cd "$WF"
corepack enable >/dev/null 2>&1 || true
pnpm install --frozen-lockfile
pnpm --filter "$APP" build

# La ruta de abajo solo es estable porque la app declara `outputFileTracingRoot`
# en su next.config.ts. Sin eso Next hornea la ruta ABSOLUTA del checkout dentro
# del bundle y esto falla distinto en cada maquina — medido el 2026-09-03.
SA="apps/$APP/.next/standalone"
[ -f "$SA/apps/$APP/server.js" ] || {
  echo "ERR: standalone server.js ausente en $SA/apps/$APP/"
  echo "     revisa outputFileTracingRoot en apps/$APP/next.config.ts"
  exit 1
}

echo "== [2/6] ensamblar runtime + tarball =="
WORK="$(mktemp -d)"; STAGE="$WORK/runtime-next"; mkdir -p "$STAGE/apps/$APP/public"
cp -a "$SA/." "$STAGE/"
cp -a "apps/$APP/.next/static" "$STAGE/apps/$APP/.next/static"
[ -d "apps/$APP/public" ] && cp -a "apps/$APP/public/." "$STAGE/apps/$APP/public/"
BUILD_ID="$(cat "$STAGE/apps/$APP/.next/BUILD_ID")"
TARBALL="$WORK/runtime-$TS.tgz"
tar -C "$WORK" -czf "$TARBALL" runtime-next
echo "BUILD_ID=$BUILD_ID ref=$REF tarball=$(du -h "$TARBALL" | cut -f1)"

echo "== [3/6] subir + stage en VPS =="
ssh $SSHOPTS "$REMOTE" "mkdir -p $ROOT/_deploy"
scp $SSHOPTS "$TARBALL" "$REMOTE:$ROOT/_deploy/runtime-$TS.tgz"
ssh $SSHOPTS "$REMOTE" "bash -s" <<EOF
set -e
cd $ROOT
rm -rf runtime-next.new-$TS && mkdir -p runtime-next.new-$TS
tar -C runtime-next.new-$TS -xzf _deploy/runtime-$TS.tgz --strip-components=1
[ -f runtime-next.new-$TS/apps/$APP/server.js ] || { echo "ERR: staged server.js ausente"; exit 1; }
echo "STAGED_BUILD_ID=\$(cat runtime-next.new-$TS/apps/$APP/.next/BUILD_ID)"
rm -f _deploy/runtime-$TS.tgz
EOF

if [ "$DEPLOY_SWAP" != "true" ]; then
  echo "STAGED_ONLY=$ROOT/runtime-next.new-$TS (sin swap; nada publicado cambio)."
  exit 0
fi

echo "== [4/6] crear contenedor si es el primer deploy =="
ssh $SSHOPTS "$REMOTE" "bash -s" <<EOF
set -e
if docker inspect $CT >/dev/null 2>&1; then
  echo "CONTAINER=$CT (ya existe)"
else
  # Primer deploy: sin runtime-next vivo, el staged pasa a serlo directamente.
  [ -d $ROOT/runtime-next ] || mv $ROOT/runtime-next.new-$TS $ROOT/runtime-next
  docker run -d --name $CT --restart unless-stopped --network $NET \
    -e PORT=3000 -e HOSTNAME=0.0.0.0 -e NODE_ENV=production \
    -v $ROOT/runtime-next:/app -w /app \
    node:20-alpine node apps/$APP/server.js
  echo "CONTAINER=$CT (creado)"
fi
EOF

echo "== [5/6] backup + swap + restart + verify + rollback =="
ssh $SSHOPTS "$REMOTE" "bash -s" <<EOF
set -uo pipefail
ROOT=$ROOT; CT=$CT; STAGE=\$ROOT/runtime-next.new-$TS
health() {
  docker exec \$CT node -e 'require("http").get("http://127.0.0.1:3000/",r=>{console.log(r.statusCode);process.exit(0)}).on("error",()=>process.exit(1))' 2>/dev/null || true
}
if [ -d "\$STAGE" ]; then
  BAK=\$ROOT/runtime-next.bak-deploy-$TS
  echo "backup live runtime -> \$BAK"
  mv \$ROOT/runtime-next \$BAK
  mv \$STAGE \$ROOT/runtime-next
else
  BAK=""   # primer deploy: no hay nada a lo que volver
fi
docker restart \$CT >/dev/null
ok=""
for i in \$(seq 1 25); do
  sleep 2
  code=\$(health)
  if [ -n "\$code" ] && [ "\$code" -lt 500 ] 2>/dev/null; then ok=1; echo "home HTTP \$code (try \$i)"; break; fi
done
if [ -z "\$ok" ]; then
  echo "!! health check FAILED"
  if [ -n "\$BAK" ]; then
    mv \$ROOT/runtime-next \$ROOT/runtime-next.failed-$TS
    mv \$BAK \$ROOT/runtime-next
    docker restart \$CT >/dev/null
    sleep 4
    echo "post-rollback home HTTP \$(health)"
    echo "ROLLED_BACK (build fallido en runtime-next.failed-$TS)"
  else
    echo "PRIMER_DEPLOY_FALLIDO: nada publicado que revertir; el contenedor \$CT queda arriba y roto"
  fi
  exit 2
fi
echo "SWAP_OK backup=\${BAK:-none}"
EOF

echo "== [6/6] vhost de traefik =="
echo "El runtime esta arriba en el contenedor $CT. Para que $SITE_DOMAIN lo sirva,"
echo "falta pegar esto en /etc/easypanel/traefik/config/onia-manual-routes.yaml"
echo "(hacer backup del archivo antes; traefik lo recarga solo):"
cat <<YAML

  http.services.$CT-manual:
    loadBalancer:
      passHostHeader: true
      servers:
        - url: "http://$CT:3000/"

  http.routers.https-$(echo "$SITE_DOMAIN" | tr '.' '-')-manual:
    rule: "Host(\`$SITE_DOMAIN\`) && PathPrefix(\`/\`)"
    service: "$CT-manual"
    entryPoints: ["https"]
    tls: { certResolver: letsencrypt }
    middlewares: ["comprimir"]
YAML

echo "DEPLOY_OK app=$APP ref=$REF build=$BUILD_ID dominio=$SITE_DOMAIN (falta el vhost de arriba)"
