#!/usr/bin/env python3
"""L05 · prepara los overlays a tamaño de lienzo (1080x1920) y escribe scripts/layout.json.

Entra: los PNG @2x de make-mockup (assets/*.png).
Sale:  assets/canvas/*.png (ya escalados, listos para overlay sin re-escalar en ffmpeg)
       assets/canvas/sello_00..03.png (entrada del sello 130% -> 100% en 3 cuadros, rotado -5 grados)
       scripts/layout.json (x, y y ventana en CUADROS de cada overlay; lo lee build.mjs)

Reglas de la instrucción (P/INSTRUCCION.md):
  · "y" = borde SUPERIOR de lo visible (la tarjeta o la pastilla), no del PNG con su margen de sombra.
  · Se escala por el ANCHO VISIBLE (cuerpo opaco), nunca por el del PNG: desde el 2-oct los PNG traen
    margen de sombra completo (antes se cortaba y quedaba un rectángulo con borde duro), y escalar por
    el PNG achicaría la letra. Tarjetas de frase: UNA sola escala para las tres, la que deja la
    tarjeta 1 (ancho completo) en 828 px visibles → letra de 57,6 px en las tres. Rótulo IA: pastilla
    de 477 px. Sello: letra + raya de 455 px al 100 % (lo mismo que medían en la versión anterior).
  · Tiempos de la instrucción cuantizados al cuadro más cercano a 24 fps.
Uso: python3 scripts/prep-assets.py   (desde P)
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


def fr(t):
    """segundo de la instrucción -> cuadro más cercano"""
    return int(round(t * FPS))


def opaque_top(im, thr):
    a = im.split()[-1].point(lambda v: 255 if v > thr else 0)
    return a.getbbox()


CARD1_VIS_W = 828   # tarjeta 1 visible (= 900 de la instrucción menos la sombra) → define la escala de las 3
TAG_VIS_W = 477     # pastilla del rótulo IA visible (520 de la instrucción con el margen viejo)
SELLO_VIS_W = 455   # letra + raya del sello al 100 % (560 de la instrucción con el margen viejo)


def vis_w(src, thr):
    b = opaque_top(Image.open(os.path.join(A, src)).convert("RGBA"), thr)
    return b[2] - b[0]


def scaled(src, factor):
    im = Image.open(os.path.join(A, src)).convert("RGBA")
    return im.resize((round(im.width * factor), round(im.height * factor)), Image.LANCZOS), im


layout = {"canvas": [W, H], "fps": FPS, "frames": FRAMES, "overlays": []}

# ---- rótulo IA: ancho 520, centrado, y=730 (borde superior de la pastilla) ----
tag, tag2x = scaled("tag-ia.png", TAG_VIS_W / vis_w("tag-ia.png", 150))
tag.save(os.path.join(C, "tag-ia.png"))
bb = opaque_top(tag, 150)  # fondo de la pastilla = alpha .72 (184)
layout["overlays"].append({"id": "tag-ia", "file": "assets/canvas/tag-ia.png",
                           "x": (W - tag.width) // 2, "y": 730 - bb[1],
                           "in": fr(0.10), "out": fr(1.95), "fade_in": 0.15, "fade_out": 0.22,
                           "visible_box": [(W - tag.width) // 2 + bb[0], 730, (W - tag.width) // 2 + bb[2], 730 + bb[3] - bb[1]]})

# ---- tarjetas de frase: escala única (la de la tarjeta 1 a 828 visibles), centradas, y=850 ----
F = CARD1_VIS_W / vis_w("card1-lunes.png", 240)
cards = [("card1-lunes", fr(0.10), fr(1.95), 0.22),
         ("card2-link", fr(1.95), fr(4.10), 0.22),
         ("card3-horario", fr(4.10), FRAMES, 0.0)]  # la última se queda hasta el último cuadro (ver README)
print(f"escala tarjetas {F:.4f} · rótulo {TAG_VIS_W / vis_w('tag-ia.png', 150):.4f}")
for cid, a, b, fo in cards:
    im, _ = scaled(f"{cid}.png", F)
    im.save(os.path.join(C, f"{cid}.png"))
    bb = opaque_top(im, 240)  # cuerpo opaco de la tarjeta (sin la sombra)
    x = (W - im.width) // 2
    layout["overlays"].append({"id": cid, "file": f"assets/canvas/{cid}.png", "x": x, "y": 850 - bb[1],
                               "in": a, "out": b, "fade_in": 0.15, "fade_out": fo,
                               "visible_box": [x + bb[0], 850, x + bb[2], 850 + bb[3] - bb[1]]})

# ---- sello CERO.: letra+raya 455 px, rotado -5 grados (CSS: antihorario), centrado, letra arriba en y=1170 ----
src = Image.open(os.path.join(A, "sello-cero.png")).convert("RGBA")
glyph = opaque_top(src, 200)  # letra + raya (sin la sombra difusa)
k = SELLO_VIS_W / (glyph[2] - glyph[0])
print(f"escala sello {k:.4f}")
cx_src = (glyph[0] + glyph[2]) / 2
cy_src = (glyph[1] + glyph[3]) / 2
center = (W / 2, 1170 + (cy_src - glyph[1]) * k)  # centro visual del sello en el lienzo
STEPS = [(1.30, 0.70), (1.14, 0.90), (1.04, 1.0), (1.00, 1.0)]  # (escala, opacidad) cuadro a cuadro
box = int(max(src.width, src.height) * k * 1.30 * 1.12) + 8  # lienzo fijo que entra el 130% rotado
box += box % 2
vis = []
for i, (s, op) in enumerate(STEPS):
    im = src.resize((round(src.width * k * s), round(src.height * k * s)), Image.LANCZOS)
    # PIL rota antihorario con ángulo positivo = rotate(-5deg) de CSS
    im = im.rotate(5, resample=Image.BICUBIC, expand=True)
    if op < 1:
        a = im.split()[-1].point(lambda v, op=op: round(v * op))
        im.putalpha(a)
    canvas = Image.new("RGBA", (box, box), (0, 0, 0, 0))
    # centro del glifo dentro de im (rotado alrededor del centro de la imagen): desplazamiento del centro
    dx = (cx_src - src.width / 2) * k * s
    dy = (cy_src - src.height / 2) * k * s
    th = math.radians(5)
    rdx = dx * math.cos(th) + dy * math.sin(th)
    rdy = -dx * math.sin(th) + dy * math.cos(th)
    px = round(box / 2 - (im.width / 2 + rdx))
    py = round(box / 2 - (im.height / 2 + rdy))
    canvas.alpha_composite(im, (px, py))
    canvas.save(os.path.join(C, f"sello_{i:02d}.png"))
    vb = opaque_top(canvas, int(200 * op))
    ox, oy = round(center[0] - box / 2), round(center[1] - box / 2)
    vis.append({"step": i, "scale": s, "box": [ox + vb[0], oy + vb[1], ox + vb[2], oy + vb[3]]})
layout["overlays"].append({"id": "sello-cero", "file": "assets/canvas/sello_%02d.png", "sequence": len(STEPS),
                           "x": round(center[0] - box / 2), "y": round(center[1] - box / 2),
                           "in": fr(2.40), "out": fr(4.10), "fade_in": 0, "fade_out": 0.22,
                           "visible_box": vis[-1]["box"], "visible_box_130": vis[0]["box"]})

# ---- golpe de zoom +3% durante 5 cuadros en el cuadro del sello ----
layout["golpe"] = {"frame": fr(2.40), "frames": 5, "z": 1.03, "anchor": "top"}
# ---- SFX: el pop trae 0,116 s de silencio antes del golpe (medido) -> se adelanta para que suene en la entrada
POP_ONSET = 0.116
layout["sfx"] = [{"asset": "pop", "visual_frame": o["in"], "gain": -8 if o["id"] == "sello-cero" else -10}
                 for o in layout["overlays"] if o["id"] != "tag-ia"]
layout["pop_onset_s"] = POP_ONSET

with open(os.path.join(P, "scripts", "layout.json"), "w") as f:
    json.dump(layout, f, ensure_ascii=False, indent=1)

for o in layout["overlays"]:
    print(f'{o["id"]:14s} cuadros {o["in"]:3d}-{o["out"]:3d}  ({o["in"]/FPS:.3f}-{o["out"]/FPS:.3f} s)  '
          f'png@({o["x"]},{o["y"]})  visible {o["visible_box"]}' + (f'  al 130%: {o["visible_box_130"]}' if "visible_box_130" in o else ""))
