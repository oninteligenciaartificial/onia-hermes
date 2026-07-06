#!/usr/bin/env bash
# Swap a staged runtime into production and verify, with automatic rollback.
# Usage: bash swap-and-verify.sh /opt/onia-center/runtime-next.new-<ts>
#
# Backs up the live runtime, swaps in the staged one, restarts the container, and
# polls the login route. If the app does not come up (HTTP >= 500 or no response),
# it rolls back to the backup automatically.
set -uo pipefail

ROOT=/opt/onia-center
STAGE="${1:-}"
if [ -z "$STAGE" ] || [ ! -f "$STAGE/apps/site/server.js" ]; then
  echo "ERR: bad STAGE path '$STAGE' (server.js not found)"; exit 1
fi
TS=$(date +%Y%m%d%H%M%S)
BAK=$ROOT/runtime-next.bak-deploy-$TS

health() {
  docker exec onia-center node -e 'require("http").get("http://127.0.0.1:3012/onia-center/login",r=>{console.log(r.statusCode);process.exit(0)}).on("error",()=>process.exit(1))' 2>/dev/null || true
}

echo "== backup live runtime -> $BAK =="
mv "$ROOT/runtime-next" "$BAK"
mv "$STAGE" "$ROOT/runtime-next"

echo "== restart container =="
docker restart onia-center >/dev/null

ok=""
for i in $(seq 1 25); do
  sleep 2
  code=$(health)
  if [ -n "$code" ] && [ "$code" -lt 500 ] 2>/dev/null; then
    ok=1; echo "login HTTP $code (try $i)"; break
  fi
done

if [ -z "$ok" ]; then
  echo "!! health check FAILED after swap — rolling back"
  mv "$ROOT/runtime-next" "$ROOT/runtime-next.failed-$TS"
  mv "$BAK" "$ROOT/runtime-next"
  docker restart onia-center >/dev/null
  sleep 4
  echo "post-rollback login HTTP $(health)"
  echo "ROLLED_BACK (failed build kept at runtime-next.failed-$TS)"
  exit 2
fi

echo "DEPLOY_OK backup=$BAK"
