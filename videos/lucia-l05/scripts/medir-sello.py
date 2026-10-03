#!/usr/bin/env python3
"""L05 · mide la entrada del sello «CERO.» cuadro a cuadro: largo de la raya verde y opacidad.

Largo = extensión horizontal de los píxeles de la raya con cobertura ≥ 50 % (en el PNG: alpha ≥ 128 y verde).
Opacidad (sólo video) = cobertura mediana del núcleo de la raya, por el canal rojo, contra el MISMO cuadro
renderizado SIN el sello (build.mjs --sin sello-cero): c = (fondo_R − final_R) / (fondo_R − 16).

Uso (desde P):
  python3 scripts/medir-sello.py png                      → assets/canvas/sello_00..03.png
  python3 scripts/medir-sello.py video final/l05.mp4      → cuadros 57-62 contra renders/qa/fondo-sin-sello/
  python3 scripts/medir-sello.py video renders/stills     → lo mismo sobre los stills (antes del render)
  (el fondo se genera con: node scripts/build.mjs --stills 57,58,59,60,61,62 --sin sello-cero --stills-dir renders/qa/fondo-sin-sello)
Imprime JSON. Con --hoja <png> guarda la tira 57-62 recortada con guías del 130 % y del 100 %.
"""
import json
import os
import subprocess
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFont

P = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
L = json.load(open(os.path.join(P, "scripts/layout.json")))
S = {o["id"]: o for o in L["overlays"]}["sello-cero"]
GREEN = np.array([16, 194, 107], float)


def extent(mask):
    ys, xs = np.nonzero(mask)
    if len(xs) == 0:
        return None
    return int(xs.max() - xs.min() + 1), [int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())]


def png_mode():
    out = []
    for i in range(S["sequence"]):
        a = np.asarray(Image.open(os.path.join(P, f"assets/canvas/sello_{i:02d}.png")).convert("RGBA")).astype(float)
        m = (a[..., 1] > a[..., 0] + 60) & (a[..., 3] >= 128)
        ln, bb = extent(m)
        out.append({"png": f"sello_{i:02d}", "raya_px": ln, "alpha_raya": int(np.median(a[..., 3][m]))})
    return out


def frame709(path, n, w=1080, h=1920):
    if os.path.isdir(path):  # stills de build.mjs --stills (mismo grafo, sin encode)
        return np.asarray(Image.open(os.path.join(path, f"f{n:03d}.png")).convert("RGB")).astype(float)
    vf = f"select=eq(n\\,{n}),scale={w}:{h}:flags=lanczos:in_color_matrix=bt709:in_range=tv:out_range=pc,format=rgb24"
    b = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-vf", vf, "-frames:v", "1", "-f", "rawvideo",
                        "-pix_fmt", "rgb24", "-"], capture_output=True).stdout
    return np.frombuffer(b, np.uint8).reshape(h, w, 3).astype(float)


def video_mode(video, frames, hoja=None):
    y0, y1, x0, x1 = 1080, 1460, 200, 900  # región del sello (al 130 %: 241,1126 → 836,1416)
    out, tiles = [], []
    for n in frames:
        fin = frame709(video, n)
        bgp = os.path.join(P, f"renders/qa/fondo-sin-sello/f{n:03d}.png")
        bg = np.asarray(Image.open(bgp).convert("RGB")).astype(float)
        f, b = fin[y0:y1, x0:x1], bg[y0:y1, x0:x1]
        den = b[..., 0] - GREEN[0]
        c = np.where(den > 40, (b[..., 0] - f[..., 0]) / np.maximum(den, 1), 0)
        hue = f[..., 1] > f[..., 0] + 30  # verdoso (la letra y la camisa son neutras)
        cov = np.where(hue, c, 0)
        core = cov[cov > 0.5 * cov.max()] if cov.max() > 0.2 else np.array([])
        if len(core) < 200:
            out.append({"cuadro": n, "t": round(n / L["fps"], 3), "raya_px": 0, "opacidad": 0.0})
        else:
            op = float(np.median(core))
            ln, bb = extent(cov >= 0.5 * op)
            out.append({"cuadro": n, "t": round(n / L["fps"], 3), "raya_px": ln, "opacidad": round(op, 3),
                        "caja_raya": [bb[0] + x0, bb[1] + y0, bb[2] + x0, bb[3] + y0]})
        tiles.append((n, Image.fromarray(fin[y0:y1, x0:x1].astype(np.uint8))))
    if hoja:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 18)
        W, H = x1 - x0, y1 - y0
        sheet = Image.new("RGB", (W, len(tiles) * (H + 30)), (20, 20, 20))
        v130, v100 = S["visible_box_130"], S["visible_box"]
        for k, ((n, im), m) in enumerate(zip(tiles, out)):
            d = ImageDraw.Draw(im)
            for xx, col in ((v130[0], (255, 0, 0)), (v130[2], (255, 0, 0)), (v100[0], (0, 90, 255)), (v100[2], (0, 90, 255))):
                d.line([(xx - x0, 0), (xx - x0, H)], fill=col, width=2)
            sheet.paste(im, (0, k * (H + 30) + 30))
            ImageDraw.Draw(sheet).text((6, k * (H + 30) + 5),
                                       f"f{n:03d} {n / L['fps']:.3f}s · raya {m['raya_px']} px · opac. {m['opacidad'] * 100:.0f} %"
                                       + ("  · rojo 130 %, azul 100 %" if k == 0 else ""), fill=(255, 230, 80), font=font)
        sheet.save(hoja)
    return out


if __name__ == "__main__":
    if sys.argv[1] == "png":
        print(json.dumps(png_mode(), indent=1))
    else:
        hoja = sys.argv[sys.argv.index("--hoja") + 1] if "--hoja" in sys.argv else None
        print(json.dumps(video_mode(sys.argv[2], [S["in"] - 1 + k for k in range(6)], hoja), indent=1))
