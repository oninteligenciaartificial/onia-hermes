#!/bin/sh
# Fase 1 contra el PILOTO tras crear el Punto de Venta 1 (2026-09-12).
#
# Pasada 1: etapas VI y IX — los casos del PdV 0 que faltan (~258 + ~58) NO
#   dependen del PdV 1; corren primero pase lo que pase con el registro.
# Pasada 2: todas las etapas con --retry-blocked — limpia los blockedCases
#   pv1-* (bloqueados cuando el SIN devolvia 933) y recorre I..XI en orden:
#   I obtiene el CUIS del PdV 1, II sincroniza, III su CUFD, y el resto sigue.
#   La etapa VIII (firma digital) NO esta en STAGE_ORDER: nunca se corre.
# Lo ya hecho se salta solo (checkpoint). Retomable: relanzar el mismo script.
#
# Uso: nohup /opt/onia-siat/run-fase1-pdv1.sh > /var/log/onia-siat-runner-$(date +%Y%m%d).log 2>&1 < /dev/null &
cd /opt/onia-siat || exit 1
set -a; . ./siat-piloto.env; set +a
for E in VI IX; do
  echo "[$(date -u +%FT%TZ)] pasada 1 etapa $E (pv0)"
  node emisor/src/fase1-runner.mjs --etapa "$E" || echo "[$(date -u +%FT%TZ)] etapa $E exit=$?"
done
echo "[$(date -u +%FT%TZ)] pasada 2: todas las etapas, --retry-blocked (combos pv1)"
node emisor/src/fase1-runner.mjs --retry-blocked || echo "[$(date -u +%FT%TZ)] pasada 2 exit=$?"
echo "[$(date -u +%FT%TZ)] fin"
