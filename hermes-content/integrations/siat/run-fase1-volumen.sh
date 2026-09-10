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
# ORDEN, y no es arbitrario:
#   IV emite -> VII anula lo emitido -> XI revierte lo anulado (encadenadas).
#   V registra el evento significativo que VI necesita; VI y IX van despues porque
#   arman lotes con facturas propias. Cada etapa renueva el CUFD por su cuenta
#   (ensureCufd), que es lo que se arreglo en a28b3689.
#
# Los combos pv1-* siguen bloqueados (falta crear el Punto de Venta 1 en SIAT, es
# de Sergio Urcullo) y se saltan solos con "sin CUIS para el punto de venta 1".
cd /opt/onia-siat || exit 1
set -a; . ./siat-piloto.env; set +a

for E in IV VII XI V VI IX; do
  echo "[$(date -u +%FT%TZ)] etapa $E"
  node emisor/src/fase1-runner.mjs --etapa "$E" || echo "[$(date -u +%FT%TZ)] etapa $E exit=$?"
done
echo "[$(date -u +%FT%TZ)] fin"
