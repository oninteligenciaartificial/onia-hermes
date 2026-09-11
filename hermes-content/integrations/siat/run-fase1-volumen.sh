#!/bin/sh
# Corrida de volumen de la Fase 1 contra el PILOTO (codigoAmbiente=2), con los
# targets del SIN. Retomable: el estado es checkpoint, si se corta retoma.
#
# Uso (VPS):
#   nohup /opt/onia-siat/run-fase1-volumen.sh > /opt/onia-siat/fase1-volumen.log 2>&1 &
#
# POR QUE ESTE ARCHIVO ESTA EN EL REPO (2026-09-08): vivia SOLO en /opt/onia-siat
# del VPS, fuera de git, y su recorte costo un mes de cobertura. Corria unicamente
# IV -> VII -> XI, asi que cuando ensureCufd() se cableo en esas tres etapas y no en
# sus hermanas, las etapas VI y IX quedaron clavadas en 20 desde el 6-ago sin que
# nada se pusiera rojo: el instrumento miraba justo las tres que ya estaban sanas.
# Un script de orquestacion fuera de git no lo revisa nadie y no lo mide ningun gate.
#
# POR QUE YA NO TIPEA SUS ETAPAS (2026-09-10): agregar las que faltaban habria sido
# arreglar la instancia. La lista a mano ES el defecto — es una lista de INCLUSION
# al lado de STAGE_ORDER, que es la fuente, asi que solo cubre lo que YA fallo y
# ninguna etapa nueva nace cubierta. Medido ese dia: seguia sin la etapa I, la que
# pide el CUIS por punto de venta, o sea que el dia que exista el Punto de Venta 1
# este script NO lo desbloqueaba y los 11 combos pv1 (1.169 documentos de cobertura)
# seguian cayendo con "sin CUIS para el punto de venta 1: correr la etapa I antes".
# Ahora las DERIVA del runner. Atado por gate en test/fase1-runner.test.mjs.
#
# ORDEN, y no es arbitrario — STAGE_ORDER ya lo respeta, por eso se puede derivar:
#   IV emite -> VII anula lo emitido -> XI revierte lo anulado (encadenadas).
#   V registra el evento significativo que VI necesita; VI y IX van despues porque
#   arman lotes con facturas propias. Cada etapa renueva el CUFD por su cuenta
#   (ensureCufd), que es lo que se arreglo en a28b3689.
#
# Los combos pv1-* siguen bloqueados (falta crear el Punto de Venta 1 en SIAT, es
# de Sergio Urcullo) y se saltan solos con "sin CUIS para el punto de venta 1".
cd /opt/onia-siat || exit 1
set -a; . ./siat-piloto.env; set +a

RUNNER=emisor/src/fase1-runner.mjs

# Las etapas SALEN DEL RUNNER (STAGE_ORDER), no de una lista de acá.
ETAPAS=$(node -e "
  import(new URL('$RUNNER', 'file://' + process.cwd() + '/'))
    .then((m) => {
      if (!Array.isArray(m.STAGE_ORDER) || m.STAGE_ORDER.length === 0) {
        throw new Error('STAGE_ORDER vacio o ausente en $RUNNER');
      }
      console.log(m.STAGE_ORDER.join(' '));
    })
    .catch((e) => { console.error(e.message); process.exit(1); });
")

# Si no se pudo derivar, se CORTA. Caer a una lista por defecto seria reponer el
# mismo defecto: una corrida a medias se lee igual que una corrida entera.
if [ -z "$ETAPAS" ]; then
  echo "[$(date -u +%FT%TZ)] ABORTA: no pude leer STAGE_ORDER de $RUNNER" >&2
  exit 1
fi

echo "[$(date -u +%FT%TZ)] etapas a correr: $ETAPAS"
for E in $ETAPAS; do
  echo "[$(date -u +%FT%TZ)] etapa $E"
  node "$RUNNER" --etapa "$E" || echo "[$(date -u +%FT%TZ)] etapa $E exit=$?"
done
echo "[$(date -u +%FT%TZ)] fin"
