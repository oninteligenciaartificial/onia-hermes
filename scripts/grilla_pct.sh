#!/usr/bin/env bash
# Pone una grilla al 10% sobre una imagen, para LEER las coordenadas de `marks`
# (que van en % del recorte, no en pixeles).
#
# Existe porque poner las anotaciones a ojo dejo los marcos desplazados en las
# cuatro laminas de O04 que las usaban (2026-08-25) — el mismo error que ya se
# habia cometido con los recortes y no se traslado a las anotaciones.
#
# Uso: bash scripts/grilla_pct.sh <imagen.png> [salida.png]
set -e
src="$1"
out="${2:-_grilla.png}"
# drawgrid evalua expresiones, asi que no hace falta calcular nada en bash
# (y de paso se evita el \r de Windows rompiendo la aritmetica).
ffmpeg -y -loglevel error -i "$src" \
  -vf "drawgrid=w=iw/10:h=ih/10:t=2:c=red@0.85,scale=900:-1" -frames:v 1 "$out"
echo "$out — cada celda = 10% (x: 0,10,20... de izq a der · y: 0,10,20... de arriba abajo)"
