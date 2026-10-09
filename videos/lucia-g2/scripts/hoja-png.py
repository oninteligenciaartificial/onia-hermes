#!/usr/bin/env python3
"""Hoja de contactos de PNG/JPG sueltos (p. ej. las capturas de `hyperframes snapshot`) con las guías del QA mirado.
Uso (venv del face-gate, que trae numpy + cv2):  hoja-png.py salida.jpg COLUMNAS ANCHO_DE_CADA_UNA img1 img2 ...
Guías (solo si la imagen es de 1080x1920): y=1490 rojo (pie de Instagram), x=1000 desde y=1000 magenta (botones), y=280 amarillo (barra de arriba).
Cada cuadro lleva su nombre de archivo. SIN_GUIAS=1 las apaga."""
import os, sys, cv2, numpy as np
out, cols, wid = sys.argv[1], int(sys.argv[2]), int(sys.argv[3])
files = sys.argv[4:]
tiles = []
for f in files:
    im = cv2.imread(f)
    h, w = im.shape[:2]
    if (w, h) == (1080, 1920) and os.environ.get('SIN_GUIAS') != '1':
        cv2.line(im, (0, 1490), (1079, 1490), (0, 0, 255), 3)
        cv2.line(im, (1000, 1000), (1000, 1919), (255, 0, 255), 3)
        cv2.line(im, (0, 280), (1079, 280), (0, 255, 255), 2)
    s = wid / w
    im = cv2.resize(im, (wid, int(h * s)), interpolation=cv2.INTER_AREA)
    name = os.path.basename(f).replace('.png', '').replace('.jpg', '')[:28]
    cv2.rectangle(im, (0, 0), (min(wid, 12 * len(name) + 8), 22), (0, 0, 0), -1)
    cv2.putText(im, name, (4, 16), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 255), 1, cv2.LINE_AA)
    tiles.append(im)
hh = max(t.shape[0] for t in tiles)
rows = []
for r in range(0, len(tiles), cols):
    row = tiles[r:r + cols]
    row += [np.zeros((hh, wid, 3), np.uint8)] * (cols - len(row))
    row = [np.pad(t, ((0, hh - t.shape[0]), (2, 2), (0, 0))) for t in row]
    rows.append(np.hstack(row))
cv2.imwrite(out, np.vstack(rows), [cv2.IMWRITE_JPEG_QUALITY, 88])
