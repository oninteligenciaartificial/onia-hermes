#!/usr/bin/env python3
"""L05 · chequeo de los PNG de make-mockup antes de montarlos.

1) Bordes: alpha máx de la fila/columna exterior (tiene que ser 0: si no, la sombra queda cortada
   y en el video se ve como un rectángulo con borde duro — corrección de la verificación del 2-oct).
2) Costuras internas: salto de alpha anómalo (|a[i]-a[i-1]| menos la pendiente local) en cualquier
   fila/columna dentro de la sombra (0 < alpha < 150, lejos del cuerpo). Chromium rasteriza en tiles de 254 px y un
   box-shadow grande sale con costuras rectas en esos bordes (medido: 93→86 en la fila 508).
Uso: python3 scripts/check-png.py assets/*.png   → exit 1 si algo falla.
"""
import sys

import numpy as np
from PIL import Image

LIM_COSTURA = 3  # salto anómalo tolerado, en niveles de alpha (sobre 255)
CUERPO = 150  # alpha del cuerpo: tarjeta 255, pastilla del rótulo 184; la sombra nunca pasa de ~135
bad = False
for f in sys.argv[1:]:
    a = np.array(Image.open(f).convert("RGBA"))[:, :, 3].astype(int)
    edge = max(a[0].max(), a[-1].max(), a[:, 0].max(), a[:, -1].max())
    worst = (0, None)
    for axis in (0, 1):
        b = a if axis == 0 else a.T
        d = np.diff(b, axis=0)  # d[i] = b[i+1]-b[i]
        # pendiente local: media de los saltos 2 arriba y 2 abajo
        loc = (np.abs(d[:-4]) + np.abs(d[1:-3]) + np.abs(d[3:-1]) + np.abs(d[4:])) / 4
        anom = np.abs(d[2:-2]) - loc
        m = (b[2:-3] > 0) & (b[2:-3] < CUERPO) & (b[3:-2] > 0) & (b[3:-2] < CUERPO)
        # descartar el borde del cuerpo (antialias de la tarjeta o de la pastilla): vecinos a <6 px del cuerpo
        opaque = b >= CUERPO
        near = np.zeros_like(opaque)
        for k in range(-6, 7):
            near |= np.roll(opaque, k, axis=0)
        m &= ~near[2:-3]
        # contar sólo líneas: un salto anómalo que se repite en >= 20 posiciones de la misma fila/columna
        hits = (anom > LIM_COSTURA) & m
        per_line = hits.sum(1)
        if per_line.max() >= 20:
            i = int(per_line.argmax())
            worst = max(worst, (int(per_line.max()), f'{"fila" if axis == 0 else "columna"} {i + 3}'), key=lambda x: x[0])
    ok = edge == 0 and worst[0] == 0
    bad |= not ok
    print(f"{'OK ' if ok else 'MAL'} {f}: {a.shape[1]}x{a.shape[0]} · alpha máx en el borde {edge} · "
          f"costura interna: {'ninguna' if worst[0] == 0 else f'{worst[0]} saltos en la {worst[1]}'}")
sys.exit(1 if bad else 0)
