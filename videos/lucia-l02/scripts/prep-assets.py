#!/usr/bin/env python3
"""L02 · prepara los overlays a tamaño de lienzo (1080x1920) y escribe scripts/layout.json.

Entra: los PNG @2x de make-mockup (assets/*.png).
Sale:  assets/canvas/*.png (ya escalados, listos para overlay sin re-escalar en ffmpeg)
       assets/canvas/sello_00..03.png (entrada del sello 130% -> 100% en 3 cuadros, rotado -5 grados)
       scripts/layout.json (x, y y ventana en CUADROS de cada overlay; lo lee build.mjs y qa.py)

Reglas de la instrucción (P/INSTRUCCION.md § LAYOUT):
  · "y" = borde SUPERIOR de lo visible (el cuerpo opaco de la tarjeta; la letra del sello sin rotar), no del
    PNG con su margen de sombra.
  · Tarjeta 1 "ancho 900" = ancho VISIBLE de la tarjeta. La tarjeta 2 usa LA MISMA escala (la letra mide lo
    mismo en las dos aunque la tarjeta corta sea más angosta).
  · Sello "ancho 640" = ancho visible de la letra + raya al 100 %, antes de rotar.
  · Tiempos de la instrucción cuantizados al cuadro más cercano a 24 fps.
Uso: python3 scripts/prep-assets.py   (desde cualquier carpeta)
"""
import json
import math
import os

from PIL import Image

P = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
A = os.path.join(P, "assets")
C = os.path.join(A, "canvas")
os.makedirs(C, exist_ok=True)
W, H, FPS = 1080, 1920, 24
FRAMES = 145  # 6,0417 s del clip Kling, entero (no se congela ni se acelera)
FADE_IN, FADE_OUT = 0.15, 0.22  # receta § «Reels de Lucía» 9 (la misma de L05/L08)


def fr(t):
    """segundo de la instrucción -> cuadro más cercano"""
    return int(round(t * FPS))


def opaque_box(im, thr):
    a = im.split()[-1].point(lambda v: 255 if v > thr else 0)
    return a.getbbox()


def load(name):
    return Image.open(os.path.join(A, name)).convert("RGBA")


layout = {"canvas": [W, H], "fps": FPS, "frames": FRAMES, "overlays": []}

# ---- tarjetas de frase: escala única (tarjeta 1 visible = 900 px), centradas, y=960 ----
c1 = load("card1-grabado.png")
bb1 = opaque_box(c1, 240)
F = 900 / (bb1[2] - bb1[0])
layout["card_scale"] = round(F, 5)
cards = [("card1-grabado", fr(0.10), fr(2.15), FADE_OUT),
         ("card2-ia", fr(2.15), fr(3.95), FADE_OUT)]
for cid, a, b, fo in cards:
    src = load(f"{cid}.png")
    im = src.resize((round(src.width * F), round(src.height * F)), Image.LANCZOS)
    im.save(os.path.join(C, f"{cid}.png"))
    bb = opaque_box(im, 240)  # cuerpo opaco de la tarjeta (sin la sombra)
    vw = bb[2] - bb[0]
    x = round((W - vw) / 2) - bb[0]  # centrado por lo VISIBLE, no por el PNG
    y = 960 - bb[1]
    layout["overlays"].append({"id": cid, "file": f"assets/canvas/{cid}.png", "x": x, "y": y,
                               "in": a, "out": b, "fade_in": FADE_IN, "fade_out": fo,
                               "visible_box": [x + bb[0], 960, x + bb[2], 960 + bb[3] - bb[1]]})

# ---- velo oscuro debajo del sello (receta § «Reels de Lucía» 6, criterio de L08) ----
# El sello es blanco y cae sobre el suéter crema y la vereda al sol: luminancia p90 bajo el sello 188 → 223
# (medido en el crudo, cuadros 95-144; > 200 desde el cuadro ~102). Degradé vertical negro: alfa 0 en y=940
# (mentón máx + 41) → 0,48 en y=1200 → 0,55 en y=1920. Entra con el sello (fade 0,22 s) y queda hasta el final:
# es el «oscurecer el fondo en el CTA» de Santiago, no un velo de todo el video (las tarjetas son oscuras y no lo
# necesitan; oscurecer 6 s la hora dorada le saca lo que la hace linda).
VELO = [(0, 0.0), (940, 0.0), (1200, 0.48), (1490, 0.52), (1920, 0.55)]
import numpy as np  # noqa: E402

ys = np.arange(H, dtype=np.float64)
va = np.interp(ys, [p[0] for p in VELO], [p[1] for p in VELO])
velo = np.zeros((H, W, 4), np.uint8)
velo[:, :, 3] = np.round(va * 255).astype(np.uint8)[:, None]
Image.fromarray(velo, "RGBA").save(os.path.join(C, "velo.png"))
layout["overlays"].append({"id": "velo", "file": "assets/canvas/velo.png", "x": 0, "y": 0, "decor": True,
                           "in": fr(3.95), "out": FRAMES, "fade_in": FADE_OUT, "fade_out": 0.0,
                           "perfil_alfa": VELO})

# ---- sello SEGUIME.: letra+raya 640 de ancho, rotado -5 grados (CSS: antihorario), centrado, letra arriba y=1170 ----
src = load("sello-seguime.png")
glyph = opaque_box(src, 200)  # letra + raya (sin la sombra difusa)
k = 640 / (glyph[2] - glyph[0])
cx_src = (glyph[0] + glyph[2]) / 2
cy_src = (glyph[1] + glyph[3]) / 2
center = (W / 2, 1170 + (cy_src - glyph[1]) * k)  # centro visual del sello en el lienzo
STEPS = [(1.30, 0.70), (1.14, 0.90), (1.04, 1.0), (1.00, 1.0)]  # (escala, opacidad) cuadro a cuadro
box = int(max(src.width, src.height) * k * 1.30 * 1.12) + 8  # lienzo fijo que entra el 130 % rotado
box += box % 2
ox, oy = round(center[0] - box / 2), round(center[1] - box / 2)
vis = []
for i, (s, op) in enumerate(STEPS):
    im = src.resize((round(src.width * k * s), round(src.height * k * s)), Image.LANCZOS)
    im = im.rotate(5, resample=Image.BICUBIC, expand=True)  # PIL +5 (antihorario) = rotate(-5deg) de CSS
    if op < 1:
        im.putalpha(im.split()[-1].point(lambda v, op=op: round(v * op)))
    canvas = Image.new("RGBA", (box, box), (0, 0, 0, 0))
    # el glifo no está centrado en el PNG: se compensa el desplazamiento de su centro, rotado
    dx = (cx_src - src.width / 2) * k * s
    dy = (cy_src - src.height / 2) * k * s
    th = math.radians(5)
    rdx = dx * math.cos(th) + dy * math.sin(th)
    rdy = -dx * math.sin(th) + dy * math.cos(th)
    px = round(box / 2 - (im.width / 2 + rdx))
    py = round(box / 2 - (im.height / 2 + rdy))
    canvas.alpha_composite(im, (px, py))
    canvas.save(os.path.join(C, f"sello_{i:02d}.png"))
    vb = opaque_box(canvas, int(200 * op))
    vis.append({"step": i, "scale": s, "box": [ox + vb[0], oy + vb[1], ox + vb[2], oy + vb[3]]})
layout["overlays"].append({"id": "sello-seguime", "file": "assets/canvas/sello_%02d.png", "sequence": len(STEPS),
                           "x": ox, "y": oy, "in": fr(3.95), "out": FRAMES, "fade_in": 0, "fade_out": 0.0,
                           "visible_box": vis[-1]["box"], "visible_box_130": vis[0]["box"],
                           "sello_scale": round(k, 5)})

# ---- golpe de zoom +3 % durante 5 cuadros en el cuadro del sello ----
layout["golpe"] = {"frame": fr(3.95), "frames": 5, "z": 1.03, "anchor": "top"}
# ---- SFX: pop en cada entrada (el sello a -8); at se corrige por el silencio inicial del pop (lo mide qa/sfx) ----
layout["sfx"] = [{"asset": "pop", "visual_frame": o["in"], "gain": -8 if o["id"] == "sello-seguime" else -10}
                 for o in layout["overlays"] if not o.get("decor")]

with open(os.path.join(P, "scripts", "layout.json"), "w") as f:
    json.dump(layout, f, ensure_ascii=False, indent=1)

print(f"escala tarjetas {F:.5f} (letra {64 * 2 * F:.1f} px) · escala sello {k:.5f} (letra {112 * 2 * k:.1f} px)")
for o in [x for x in layout["overlays"] if not x.get("decor")]:
    print(f'{o["id"]:14s} cuadros {o["in"]:3d}-{o["out"]:3d}  ({o["in"]/FPS:.3f}-{o["out"]/FPS:.3f} s)  '
          f'png@({o["x"]},{o["y"]})  visible {o["visible_box"]}' + (f'  al 130%: {o["visible_box_130"]}' if "visible_box_130" in o else ""))
