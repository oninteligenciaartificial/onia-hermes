#!/usr/bin/env bash
# Swap del runtime staged de la landing a produccion, con verificacion y
# rollback automatico. Uso: bash swap-and-verify.sh /opt/onia-landing/runtime-next.new-<ts>
set -uo pipefail

ROOT=/opt/onia-landing
STAGE="${1:-}"
if [ -z "$STAGE" ] || [ ! -f "$STAGE/apps/onia-platform/server.js" ]; then
  echo "ERR: bad STAGE path '$STAGE' (server.js not found)"; exit 1
fi
TS=$(date +%Y%m%d%H%M%S)
BAK=$ROOT/runtime-next.bak-deploy-$TS

health() {
  docker exec onia-landing node -e 'require("http").get("http://127.0.0.1:3000/",r=>{console.log(r.statusCode);process.exit(0)}).on("error",()=>process.exit(1))' 2>/dev/null || true
}

echo "== backup live runtime -> $BAK =="
mv "$ROOT/runtime-next" "$BAK"
mv "$STAGE" "$ROOT/runtime-next"

echo "== restart container =="
docker restart onia-landing >/dev/null

ok=""
for i in $(seq 1 25); do
  sleep 2
  code=$(health)
  if [ -n "$code" ] && [ "$code" -lt 500 ] 2>/dev/null; then
    ok=1; echo "home HTTP $code (try $i)"; break
  fi
done

if [ -z "$ok" ]; then
  echo "!! health check FAILED after swap — rolling back"
  mv "$ROOT/runtime-next" "$ROOT/runtime-next.failed-$TS"
  mv "$BAK" "$ROOT/runtime-next"
  docker restart onia-landing >/dev/null
  sleep 4
  echo "post-rollback home HTTP $(health)"
  echo "ROLLED_BACK (failed build kept at runtime-next.failed-$TS)"
  exit 2
fi

echo "DEPLOY_OK backup=$BAK"
