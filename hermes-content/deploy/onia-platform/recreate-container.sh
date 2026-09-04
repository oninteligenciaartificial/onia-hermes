#!/usr/bin/env bash
# Recrear el contenedor onia-platform conservando su configuracion EXACTA.
# Solo hace falta cuando cambia algo del contenedor (imagen, env-file, redes):
# para publicar codigo nuevo alcanza con deploy-gates-swap.sh, que hace un
# `docker restart` sobre el bind /opt/onia-platform/runtime-next:/app.
#
# 🔴 ESTE SCRIPT TUMBA PRODUCCION MIENTRAS CORRE. La skill onia-deploy cuenta
# que recrear a mano tumbo prod 3 veces, siempre por lo mismo: crear con
# --network pone UNA sola red y las otras dos quedan sin conectar, asi que el
# contenedor levanta "sano" y no llega ni a auth ni a db. Por eso aca las redes
# se verifican con nc ANTES de dar el cambio por bueno, y el viejo se RENOMBRA
# en vez de borrarse: el rollback cuesta cero.
#
# Config tomada del contenedor vivo el 2026-09-03 (docker inspect onia-platform).
# Uso:  recreate-container.sh [--si-estoy-seguro]
set -uo pipefail

NOMBRE=onia-platform
IMAGEN=node:20-alpine
ENVFILE=/opt/onia-platform/app.env
BIND=/opt/onia-platform/runtime-next:/app
RED_PRINCIPAL=supabase_default            # donde viven auth y db
REDES_EXTRA=(easypanel dentalgest-staging-supabase_default)
TS=$(date +%Y%m%d-%H%M%S)
VIEJO="$NOMBRE-old-$TS"

if [ "${1:-}" != "--si-estoy-seguro" ]; then
  cat <<FIN
Este script RECREA el contenedor de produccion (app.onia.com.bo) y lo deja caido
unos segundos. Para publicar codigo nuevo NO hace falta: usa deploy-gates-swap.sh.
Si de verdad hace falta, corre:  $0 --si-estoy-seguro
FIN
  exit 2
fi

test -f "$ENVFILE" || { echo "FATAL: no existe $ENVFILE"; exit 1; }
test -f "${BIND%%:*}/server.js" || { echo "FATAL: ${BIND%%:*} no tiene server.js — el swap no corrio"; exit 1; }

echo "=== [1/5] parar y RENOMBRAR el viejo (esto es el rollback, no se borra)"
docker stop "$NOMBRE" >/dev/null || { echo "FATAL: no pude parar $NOMBRE"; exit 1; }
docker rename "$NOMBRE" "$VIEJO" || { echo "FATAL: no pude renombrar; arranco el viejo de nuevo"; docker start "$NOMBRE"; exit 1; }
echo "  viejo guardado como $VIEJO"

# rollback: devuelve produccion al contenedor anterior y sale en rojo
rollback() {
  echo "!! ROLLBACK: $1"
  docker rm -f "$NOMBRE" >/dev/null 2>&1
  docker rename "$VIEJO" "$NOMBRE" && docker start "$NOMBRE" >/dev/null && echo "   produccion restaurada desde $VIEJO"
  exit 1
}

echo "=== [2/5] crear el nuevo con la MISMA config"
docker run -d --name "$NOMBRE" \
  --network "$RED_PRINCIPAL" \
  --env-file "$ENVFILE" \
  -v "$BIND" \
  -w /app \
  --restart unless-stopped \
  "$IMAGEN" node server.js >/dev/null || rollback "docker run fallo"

echo "=== [3/5] conectar las OTRAS redes (crear solo pone la primera)"
for r in "${REDES_EXTRA[@]}"; do
  docker network connect "$r" "$NOMBRE" 2>/dev/null && echo "  conectado: $r" || echo "  aviso: no pude conectar $r"
done

echo "=== [4/5] verificar que LLEGA a auth y db (no confiar en el connect)"
sleep 4
FALLO=0
docker exec "$NOMBRE" nc -z auth 9999  || { echo "  FATAL: no llega a auth:9999"; FALLO=1; }
docker exec "$NOMBRE" nc -z db 54329   || { echo "  FATAL: no llega a db:54329";  FALLO=1; }
[ "$FALLO" = "0" ] || rollback "el contenedor nuevo no alcanza auth/db"
echo "  auth:9999 ok · db:54329 ok"

echo "=== [5/5] que la pantalla de login conteste de verdad"
CODIGO=$(curl -s -o /dev/null -w '%{http_code}' --max-time 20 https://app.onia.com.bo/login)
[ "$CODIGO" = "200" ] || rollback "el login devolvio $CODIGO"
echo "  login=200"

echo "RECREATE OK — rollback disponible en $VIEJO (borralo a mano cuando estes tranquilo)"
