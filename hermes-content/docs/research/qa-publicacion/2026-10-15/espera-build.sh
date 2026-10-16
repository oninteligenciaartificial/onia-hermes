#!/bin/bash
# Espera hasta 9 minutos a que cambie el buildId de producción; imprime el nuevo y la hora de su manifiesto.
VIEJO="${1:?uso: espera-build.sh <buildId viejo>}"
for i in $(seq 1 27); do
  ID=$(curl -s --max-time 15 https://app.onia.com.bo/login | grep -o '\\"b\\":\\"[^\\"]*' | head -1 | sed 's/.*\\"b\\":\\"//')
  if [ -n "$ID" ] && [ "$ID" != "$VIEJO" ]; then
    echo "NUEVO buildId: $ID a las $(date -u +%H:%M:%S)"
    curl -sSI --max-time 15 "https://app.onia.com.bo/_next/static/$ID/_buildManifest.js" | grep -i -E "^HTTP/2|last-modified"
    exit 0
  fi
  sleep 20
done
echo "SIN CAMBIO: sigue $VIEJO a las $(date -u +%H:%M:%S)"
exit 2
