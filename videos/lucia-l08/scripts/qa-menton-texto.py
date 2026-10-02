# -*- coding: utf-8 -*-
"""L08 QA — la caja del mentón + 40 px nunca toca una caja de texto (receta §12).
Cajas de texto: karaoke MEDIDO (diferencia karaoke.mp4 − gen1.mp4, píxeles que cambió el quemado);
tag, panel y sello por GEOMETRÍA (las mismas constantes de build.mjs: posición, escala y bbox sólido del PNG).
Mentón: SCRFD y YuNet sobre el final (renders/qa/caras-final.json)."""
import json, os
import cv2
import numpy as np

P = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
plan = {o["asset"].split("/")[-1]: o for o in json.load(open(f"{P}/scripts/sync-plan.json"))["overlays"]}
import re
PANEL_TOP = int(re.search(r"const PANEL_TOP = (\d+);", open(f"{P}/scripts/build.mjs", encoding="utf8").read()).group(1))  # la de build.mjs
caras = json.load(open(f"{P}/renders/qa/caras-final.json"))["por_cuadro"]
FPS = 24

# karaoke medido
g = cv2.VideoCapture(f"{P}/renders/gen1.mp4"); k = cv2.VideoCapture(f"{P}/renders/karaoke.mp4")
kar = {}
n = 0
while True:
    ok1, a = g.read(); ok2, b = k.read()
    if not (ok1 and ok2):
        break
    d = cv2.absdiff(a, b).max(axis=2)
    ys, xs = np.where(d > 40)
    if len(ys) > 50:
        kar[n] = (int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max()))
    n += 1

def cajas(n):
    t = n / FPS
    out = []
    if n in kar:
        out.append(("karaoke", kar[n]))
    o = plan["tag-ia.png"]
    if o["start"] <= t <= o["end"]:
        s = 520 / (1353 - 88); out.append(("tag", (280, 1186, 800, round(1186 + (227 - 56) * s))))
    o = plan["panel-base.png"]
    if o["start"] <= t <= o["end"]:
        out.append(("panel", (90, PANEL_TOP, 990, PANEL_TOP + 288)))
    o = plan["sello-dedo.png"]
    f0 = int(np.ceil(o["start"] * FPS - 1e-6))
    if n >= f0:
        z = [1.3, 1.2, 1.1, 1.0][min(n - f0, 3)]
        h = round(538 * 0.4618 * z); top = 1300 - h / 2 + h * 115 / 538; bot = 1300 - h / 2 + h * 475 / 538
        w = round(2116 * 0.4618 * z); out.append(("sello", (round(540 - w / 2), round(top), round(540 + w / 2), round(bot))))
    return out

peor = {"scrfd": (1e9, None), "yunet": (1e9, None)}
fallos = []
for c in caras:
    n = c["n"]
    for det in ("scrfd", "yunet"):
        if not c[det]:
            continue
        menton = max(b[3] for b in c[det]) + 40
        for nombre, (x0, y0, x1, y1) in cajas(n):
            gap = y0 - menton
            if gap < peor[det][0]:
                peor[det] = (round(gap, 1), f"cuadro {n} ({n / FPS:.3f}s) {nombre} top {y0} vs mentón+40 {menton:.1f}")
            if gap < 0:
                fallos.append((det, n, nombre, gap))
kar_rows = [v for v in kar.values()]
print("karaoke medido: cuadros", min(kar), "→", max(kar), f"({min(kar)/FPS:.3f}–{max(kar)/FPS:.3f}s)",
      "· y", min(v[1] for v in kar_rows), "→", max(v[3] for v in kar_rows), "· x", min(v[0] for v in kar_rows), "→", max(v[2] for v in kar_rows))
for det, (gap, donde) in peor.items():
    print(f"{det}: margen mínimo texto − (mentón+40) = {gap} px  [{donde}]")
print("FALLOS:", len(fallos), fallos[:5])
