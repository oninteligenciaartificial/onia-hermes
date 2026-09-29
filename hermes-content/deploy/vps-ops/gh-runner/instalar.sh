#!/usr/bin/env bash
# Arma la imagen del runner y levanta un contenedor por repo, SIN registrar.
#   bash /opt/onia-runner/instalar.sh
#
# Limites (VPS: 4 vCPU, 16 GB): los dos runners juntos nunca pasan de 2 CPU y
# 5,5 GB, asi al menos la mitad de CPU y RAM queda para produccion aunque los
# dos corran a la vez. platform lleva el grueso porque su CI hace `next build`.
#
# ROLLBACK: docker rm -f onia-runner-platform onia-runner-hermes, borrar los
# runners en Settings > Actions > Runners (o `gh api -X DELETE
# repos/<o>/<r>/actions/runners/<id>`), y volver `runs-on` a ubuntu-latest.
set -euo pipefail

VERSION=2.337.0
# Publicado en las notas del release v2.337.0 (<!-- BEGIN SHA linux-x64 -->).
SHA=70920811a4f8ad4328818682bca5c6469c1c942fab52448868071d0063816613
TGZ=actions-runner-linux-x64-$VERSION.tar.gz
DIR=$(cd "$(dirname "$0")" && pwd)
IMG=onia-gh-runner:$VERSION

cd "$DIR"
[ -f "$TGZ" ] || curl -fsSL -o "$TGZ" \
  "https://github.com/actions/runner/releases/download/v$VERSION/$TGZ"
echo "$SHA  $TGZ" | sha256sum -c - || { echo "ERR: sha256 NO coincide. No construyo."; rm -f "$TGZ"; exit 1; }

docker build --build-arg RUNNER_VERSION=$VERSION -t "$IMG" "$DIR"

levantar() {  # $1=nombre $2=cpus $3=memoria
  if docker inspect "$1" >/dev/null 2>&1; then echo "$1 ya existe, no lo toco"; return; fi
  docker run -d --name "$1" --restart unless-stopped \
    --cpus "$2" --memory "$3" --memory-swap "$3" --pids-limit 4096 \
    --security-opt no-new-privileges \
    "$IMG"
}
levantar onia-runner-platform 1.5 4g
levantar onia-runner-hermes 0.5 1536m
docker ps --filter name=onia-runner --format '{{.Names}} {{.Status}}'
