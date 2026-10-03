# -*- coding: utf-8 -*-
"""L08 — velo oscuro (INSTRUCCION § ESTILO): degradé vertical negro, alfa 0 en y=1060 → 0,55 en y=1320 → 0,6 en
y=1920. El blazer es crema (luminancia p90 > 200) y el texto blanco no se lee sin él. Va debajo de todo el texto,
encima del b-roll, el video entero. Salida: assets/velo.png (1080x1920 RGBA)."""
import os
import numpy as np
from PIL import Image

W, H = 1080, 1920
y = np.arange(H, dtype=np.float64)
a = np.interp(y, [0, 1060, 1320, 1920], [0.0, 0.0, 0.55, 0.60])
alpha = np.round(a * 255).astype(np.uint8)
img = np.zeros((H, W, 4), np.uint8)
img[:, :, 3] = alpha[:, None]
out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "assets", "velo.png")
Image.fromarray(img, "RGBA").save(out)
print("velo →", os.path.normpath(out), "alfa en 1060/1190/1320/1490/1920:", [round(float(a[i]), 3) for i in (1060, 1190, 1320, 1490, 1919)])
