"""Capa de fondo+sujeto de la miniatura: el MISMO frame de fondo (desenfocado y oscurecido)
y encima el sujeto recortado, mas claro y con rim light.

Por que el fondo es el propio frame: rembg no puede separar la camiseta negra del respaldo
NEGRO de la silla (probado con u2net_human_seg y con isnet-general-use: los dos se comen la
silla). Sobre un fondo plano ese error se ve como una mancha; sobre su propia imagen, la
silla del recorte cae justo encima de la silla del fondo y desaparece. El sujeto se separa
con LUZ -- rim naranja + mas brillo -- que es como lo hace la referencia, no con un borde duro.
"""
from PIL import Image, ImageFilter, ImageEnhance, ImageChops
import sys

W, H = 1280, 720
src = Image.open("renders/mini-src/f00001.png").convert("RGB")
cut = Image.open("renders/mini-cut/f00001.png").convert("RGBA")

# --- fondo: el frame, desenfocado, oscuro, con viñeta y un calido por la derecha ---
bg = src.resize((W, H), Image.LANCZOS).filter(ImageFilter.GaussianBlur(34))
bg = ImageEnhance.Brightness(bg).enhance(0.34)
bg = ImageEnhance.Color(bg).enhance(0.50)

vig = Image.new("L", (W, H), 0)
import math
px = vig.load()
cx, cy, r = W * 0.60, H * 0.45, W * 0.78
for y in range(H):
    for x in range(W):
        d = math.hypot((x - cx) / r, (y - cy) / (r * 0.62))
        px[x, y] = max(0, min(255, int(255 * (1 - d * d * 0.92))))
bg = Image.composite(bg, ImageEnhance.Brightness(bg).enhance(0.42), vig)

calido = Image.new("RGB", (W, H), (255, 116, 48))
grad = Image.new("L", (W, H), 0)
gp = grad.load()
for x in range(W):
    v = int(96 * max(0.0, (x / W - 0.34) / 0.66) ** 1.5)
    for y in range(H):
        gp[x, y] = v
bg = Image.composite(calido, bg, grad).convert("RGB")
bg = Image.blend(bg, ImageChops.screen(bg, Image.new("RGB", (W, H), (26, 10, 2))), 0.55)

# --- sujeto: busto, mas claro y contrastado que el fondo ---
bb = cut.getbbox()
busto = cut.crop((bb[0], bb[1], bb[2], bb[1] + int((bb[3] - bb[1]) * 0.80)))
# el corte del busto dejaba un borde RECTO en el brazo: se desvanece en los ultimos px
ba = busto.split()[3]
fade = Image.new("L", busto.size, 255)
fp = fade.load()
for y in range(busto.height - 90, busto.height):
    v = int(255 * (busto.height - y) / 90)
    for x in range(busto.width):
        fp[x, y] = v
busto.putalpha(ImageChops.multiply(ba, fade))
alto = 668
esc = alto / busto.height
suj = busto.resize((int(busto.width * esc), alto), Image.LANCZOS)

rgb = suj.convert("RGB")
rgb = ImageEnhance.Brightness(rgb).enhance(1.14)
rgb = ImageEnhance.Contrast(rgb).enhance(1.16)
rgb = ImageEnhance.Color(rgb).enhance(1.10)
a = suj.split()[3]
suj = Image.merge("RGBA", (*rgb.split(), a))

# --- rim light: anillo alrededor del alpha, teñido y difuminado ---
anillo = ImageChops.subtract(a.filter(ImageFilter.MaxFilter(9)), a)
glow = Image.new("RGBA", suj.size, (255, 138, 62, 0))
glow.putalpha(anillo.filter(ImageFilter.GaussianBlur(7)).point(lambda v: int(v * 0.95)))
glow2 = Image.new("RGBA", suj.size, (255, 200, 150, 0))
glow2.putalpha(ImageChops.subtract(a.filter(ImageFilter.MaxFilter(3)), a).filter(ImageFilter.GaussianBlur(1.6)))

# sombra para despegarlo del fondo
sombra = Image.new("RGBA", suj.size, (0, 0, 0, 0))
sombra.putalpha(a.filter(ImageFilter.GaussianBlur(26)).point(lambda v: int(v * 0.85)))

capa = Image.new("RGBA", (W, H), (0, 0, 0, 0))
x0, y0 = W - suj.width + 58, H - alto + 6
capa.alpha_composite(sombra, (x0 - 16, y0 + 12))
capa.alpha_composite(glow, (x0, y0))
capa.alpha_composite(suj, (x0, y0))
capa.alpha_composite(glow2, (x0, y0))

out = Image.alpha_composite(bg.convert("RGBA"), capa)
out.save("assets/mini-fondo.png")
print("assets/mini-fondo.png", out.size, "sujeto en x", x0, "ancho", suj.width)
