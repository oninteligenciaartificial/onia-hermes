# -*- coding: utf-8 -*-
"""L08 — hoja de cuadros con guías (QA §12): mentón+40 / inicio de la franja libre (y=1168, cian) y límite de la UI
de Instagram (y=1490, rojo), más la zona de los 80 px de la derecha bajo y=1000 (magenta punteado).
Lee los cuadros por ÍNDICE (cuadro = round(t·fps)), no por seek aproximado.

Uso: python3 hoja-cuadros.py --video ../renders/karaoke-draft.mp4 --out ../renders/qa/stills.jpg \
       --t 0,0.125,1.25 [--cols 6] [--w 300] [--full-dir ../renders/qa/stills]   (full-dir: cada cuadro a 1080×1920)
"""
import argparse, os
import cv2
import numpy as np

ap = argparse.ArgumentParser()
ap.add_argument("--video", required=True)
ap.add_argument("--out", required=True)
ap.add_argument("--t", required=True, help="tiempos en s separados por coma")
ap.add_argument("--cols", type=int, default=6)
ap.add_argument("--w", type=int, default=300)
ap.add_argument("--full-dir", default=None)
ap.add_argument("--no-guides", action="store_true")
a = ap.parse_args()

cap = cv2.VideoCapture(a.video)
fps = cap.get(cv2.CAP_PROP_FPS) or 24.0
frames = []
ok = True
while ok:
    ok, im = cap.read()
    if ok:
        frames.append(im)
times = [float(x) for x in a.t.split(",") if x.strip()]
tiles = []
for t in times:
    n = min(len(frames) - 1, int(round(t * fps)))
    im = frames[n].copy()
    if a.full_dir:
        os.makedirs(a.full_dir, exist_ok=True)
        cv2.imwrite(os.path.join(a.full_dir, f"f{n:03d}_{n / fps:.3f}.png"), im)
    H, W = im.shape[:2]
    if not a.no_guides:
        cv2.line(im, (0, 1168), (W, 1168), (255, 255, 0), 3)
        cv2.line(im, (0, 1490), (W, 1490), (0, 0, 255), 3)
        for y in range(1000, H, 24):
            cv2.line(im, (W - 80, y), (W - 80, y + 12), (255, 0, 255), 2)
    s = a.w / W
    im = cv2.resize(im, (a.w, int(H * s)), interpolation=cv2.INTER_AREA)
    cv2.rectangle(im, (0, 0), (a.w, 26), (0, 0, 0), -1)
    cv2.putText(im, f"#{n} {n / fps:.3f}s", (6, 19), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 255), 2)
    tiles.append(im)
rows = []
for i in range(0, len(tiles), a.cols):
    row = tiles[i:i + a.cols]
    while len(row) < a.cols:
        row.append(np.zeros_like(tiles[0]))
    rows.append(np.hstack(row))
os.makedirs(os.path.dirname(os.path.abspath(a.out)), exist_ok=True)
cv2.imwrite(a.out, np.vstack(rows), [cv2.IMWRITE_JPEG_QUALITY, 88])
print(f"{a.out}: {len(tiles)} cuadros de {len(frames)} ({fps} fps)")
