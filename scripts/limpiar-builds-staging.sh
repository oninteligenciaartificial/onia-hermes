#!/bin/bash
# Libera disco del VPS borrando los directorios de STAGING de onia-platform.
#
# POR QUÉ existe: el 2026-09-07 había 93 directorios `build-<sha>` en /opt/onia-platform
# (40 GB) y el disco estaba al 82 %, a 3 puntos del umbral del vigía. Si se llena se caen
# los cuatro loops, incluido onia-cola, que es el único camino a `main`.
#
# POR QUÉ es seguro: producción NO vive en los `build-<sha>`. El contenedor monta
# /opt/onia-platform/runtime-next -> /app, que es una copia propia. Los `build-<sha>` son
# artefactos de compilación y `publicar.sh` los rearma solo desde git cuando los necesita
# (dice "rearmo <sha> desde origin/master"). Borrarlos no toca ninguna superficie viva.
#
# El build vivo se DERIVA casando el BUILD_ID del contenedor, nunca se escribe a mano:
# un sha hardcodeado caduca en el deploy siguiente y entonces el script borra el bueno.
set -u

BASE=${BASE:-/opt/onia-platform}
CONT=${CONT:-onia-platform}
SECO=${SECO:-0}   # SECO=1 -> sólo dice qué borraría

cd "$BASE" || { echo "ERR: no existe $BASE"; exit 1; }

# Guarda 1: nunca correr con un deploy en curso — dos procesos se pisan el directorio.
if ps -eo args | grep -E 'build-and-stage|swap-and-verify|deploy-gates-swap' | grep -qv grep; then
  echo "ERR: hay un deploy en curso, no toco nada"; exit 2
fi

# Guarda 2: el runtime vivo tiene que existir. Si no lo encuentro, no borro nada.
if [ ! -f "$BASE/runtime-next/.next/BUILD_ID" ]; then
  echo "ERR: no encuentro el runtime vivo ($BASE/runtime-next), no toco nada"; exit 3
fi

# El BUILD_ID que sirve el contenedor AHORA. Se relee acá, no se hereda de una medición previa.
VIVO_ID=$(docker exec "$CONT" cat /app/.next/BUILD_ID 2>/dev/null || true)
[ -n "$VIVO_ID" ] || { echo "ERR: no pude leer el BUILD_ID de $CONT, no toco nada"; exit 4; }

# Derivo qué build-<sha> corresponde a ese BUILD_ID. Puede no existir (ya borrado): no es error.
VIVO=""
for d in "$BASE"/build-*/; do
  [ -d "$d" ] || continue
  if [ "$(cat "$d/.next/standalone/.next/BUILD_ID" 2>/dev/null)" = "$VIVO_ID" ]; then
    VIVO=$(basename "$d"); break
  fi
done

echo "antes:  $(df -h / | awk 'NR==2{print $5" usado, "$4" libre"}')"
echo "vivo:   BUILD_ID=$VIVO_ID -> ${VIVO:-(ya no queda su build-*, sólo runtime-next)}"

mapfile -t BORRAR < <(ls -d build-* 2>/dev/null | { [ -n "$VIVO" ] && grep -vx "$VIVO" || cat; })
echo "staging a borrar: ${#BORRAR[@]}"
[ "${#BORRAR[@]}" -gt 0 ] || { echo "nada que hacer"; exit 0; }

if [ "$SECO" = "1" ]; then
  printf '  [seco] %s\n' "${BORRAR[@]}"
  echo "[seco] no se borró nada"; exit 0
fi

for d in "${BORRAR[@]}"; do
  case "$d" in
    build-*) rm -rf "${BASE:?}/$d" ;;
    *) echo "SALTEO raro: $d" ;;
  esac
done

echo "quedan build-*: $(ls -d "$BASE"/build-* 2>/dev/null | wc -l)"
echo "después: $(df -h / | awk 'NR==2{print $5" usado, "$4" libre"}')"
