#!/usr/bin/env python3
"""Lleva a blanco el fondo gris de una imagen de arcilla (Soul 2.0) sin tocar los objetos.

Soul 2.0 suele devolver el «fondo blanco» como un gris de estudio, con viñeta (de ~160 en las esquinas a ~230
en el centro). En una lámina blanca eso queda como un óvalo turbio. El flood fill con -fuzz no alcanza, porque
compara contra el color de la semilla y la viñeta se escapa del rango.

Método:
1. Máscara de candidatos: poca saturación y luz media-alta.
2. Se queda sólo la parte CONECTADA al borde, cortada por los contornos (Sobel): así un objeto blanco que toca el
   fondo (la franja de un faro, un frasco) no se borra.
3. Peso suave por luz, y blur del peso para que el borde con el objeto no quede serruchado.
4. Mezcla hacia blanco: out = img*(1-w) + 255*w.

Uso: python3 scripts/blanquear-fondo.py entrada.jpg salida.jpg
"""
import sys

import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage


def blanquear(src: str, dst: str) -> None:
    im = Image.open(src).convert("RGB")
    a = np.asarray(im).astype(np.float32) / 255.0
    mx, mn = a.max(axis=2), a.min(axis=2)
    light = (mx + mn) / 2
    sat = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1e-6), 0)
    # barrera: el contorno de un objeto (aunque sea blanco sobre gris) tiene borde; el fondo con viñeta no
    suave = ndimage.gaussian_filter(light, 2)
    borde_fuerte = np.hypot(ndimage.sobel(suave, 0), ndimage.sobel(suave, 1)) > 0.10
    borde_fuerte = ndimage.binary_dilation(borde_fuerte, iterations=2)
    cand = (sat < 0.16) & (light > 0.50) & ~borde_fuerte
    lab, _ = ndimage.label(cand)
    borde = np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))
    borde = borde[borde > 0]
    fondo = np.isin(lab, borde)
    # devolverle al fondo la franja de la barrera que no es objeto (si no, queda un halo gris alrededor)
    fondo = fondo | (ndimage.binary_dilation(fondo, iterations=3) & (sat < 0.16) & (light > 0.62))
    # peso: 0 en luz 0,50 → 1 en luz 0,62; las sombras más oscuras quedan como sombra suave
    w = np.clip((light - 0.50) / 0.12, 0, 1) * fondo
    wimg = Image.fromarray((w * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(3))
    w = np.asarray(wimg).astype(np.float32)[..., None] / 255.0
    out = a * (1 - w) + w
    Image.fromarray((out * 255).clip(0, 255).astype(np.uint8)).save(dst, quality=92)


if __name__ == "__main__":
    blanquear(sys.argv[1], sys.argv[2])
