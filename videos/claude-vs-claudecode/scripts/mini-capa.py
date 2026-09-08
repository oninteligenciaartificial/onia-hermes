"""Capa de fondo+sujeto de la miniatura: el MISMO frame de fondo (desenfocado y oscurecido)
y encima el sujeto recortado, mas claro y con rim light.

Por que el fondo es el propio frame: rembg no puede separar la camiseta negra del respaldo
NEGRO de la silla (probado con u2net_human_seg y con isnet-general-use: los dos se la comen).
Sobre un fondo plano ese error se ve como una mancha; sobre su propia imagen, la silla del
recorte cae justo encima de la silla del fondo y desaparece. El sujeto se separa con LUZ
-- rim naranja + mas brillo -- que es como lo hace la referencia, no con un borde duro.
"""
from PIL import Image, ImageFilter, ImageEnhance, ImageChops
import math

W, H = 1280, 720
# Frame 508.7s del crudo. Se probaron 507.3, 508.0 y 509.3: los tres traen una franja
# de pared pegada al contorno del pelo que ningun filtro saca sin embarrar el borde.
# El de 508.7 sale limpio de fabrica y ademas tiene la mejor sonrisa. Cambiar de
# frame salio mas barato que pelear con la mascara.
src = Image.open("renders/mini-src/f00001.png").convert("RGB")
cut = Image.open("renders/mini-cut/f00001.png").convert("RGBA")

# --- fondo: el frame, desenfocado, oscuro, con viñeta y un calido por la derecha ---
bg = src.resize((W, H), Image.LANCZOS).filter(ImageFilter.GaussianBlur(34))
bg = ImageEnhance.Brightness(bg).enhance(0.34)
bg = ImageEnhance.Color(bg).enhance(0.50)

vig = Image.new("L", (W, H), 0)
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

# --- sujeto: encuadre CERRADO (cabeza + hombros), no medio cuerpo ---
# La caja se calcula del alpha: alto de la cabeza = desde la coronilla hasta donde el
# ancho de la silueta se dispara (los hombros). Asi el encuadre no depende de numeros
# a ojo si algun dia se cambia de frame.
a_full = cut.split()[3]
cols = a_full.point(lambda v: 255 if v > 128 else 0)
bb = cols.getbbox()
anchos = []
for y in range(bb[1], bb[3], 4):
    fila = cols.crop((0, y, W_ := cut.width, y + 1)).getbbox()
    anchos.append((y, 0 if fila is None else fila[2] - fila[0]))
# El ANCHO de la cabeza es la unidad fiable: el alto se confunde con el cuello.
cabeza_w = max(w for _, w in anchos[:70])   # ~280px desde la coronilla: ancho REAL
fc = cols.crop((0, bb[1], cut.width, bb[1] + int(cabeza_w * 0.9)))
cx_cab = (fc.getbbox()[0] + fc.getbbox()[2]) / 2

# encuadre CERRADO: 2.0 anchos de cabeza a lo ancho, 2.1 a lo alto. Con eso la cabeza
# queda en ~45% del alto de la miniatura, que es la proporcion de la referencia.
box = (int(cx_cab - cabeza_w * 1.00), int(bb[1] - cabeza_w * 0.24),
       int(cx_cab + cabeza_w * 1.00), int(bb[1] + cabeza_w * 1.86))
busto = cut.crop(box)

# el corte de abajo dejaba un borde RECTO en el brazo: se desvanece en los ultimos px
ba = busto.split()[3]
ba = ba.filter(ImageFilter.MinFilter(9))
fade = Image.new("L", busto.size, 255)
fp = fade.load()
_f = max(60, int(busto.height * 0.20))
for y in range(busto.height - _f, busto.height):
    v = int(255 * (busto.height - y) / _f)
    for x in range(busto.width):
        fp[x, y] = v
busto.putalpha(ImageChops.multiply(ba, fade))

alto = 700
esc = alto / busto.height
suj = busto.resize((max(1, int(busto.width * esc)), alto), Image.LANCZOS)

# --- descontaminar el borde ---------------------------------------------------
# El contorno del matte se lleva pixeles de la pared BLANCA: erosionar solo el alpha no
# alcanza (probado con 2px, el halo seguia). Aca el COLOR del interior se estira hacia
# afuera con un blur normalizado, asi el borde toma el color del pelo y no el de la pared.
import numpy as np
_rgb = np.asarray(suj.convert("RGB"), dtype=np.float32)
a = suj.split()[3]
_seg = np.asarray(a.filter(ImageFilter.MinFilter(15)), dtype=np.float32) / 255.0
_num = Image.fromarray(np.uint8(np.clip(_rgb * _seg[..., None], 0, 255))).filter(ImageFilter.GaussianBlur(9))
_den = Image.fromarray(np.uint8(_seg * 255)).filter(ImageFilter.GaussianBlur(9))
_n = np.asarray(_num, dtype=np.float32)
_d = np.asarray(_den, dtype=np.float32)[..., None] / 255.0
_exp = np.where(_d > 0.02, _n / np.maximum(_d, 0.02), _rgb)
_m = _seg[..., None]
suj = Image.merge("RGBA", (*Image.fromarray(np.uint8(np.clip(_rgb * _m + _exp * (1 - _m), 0, 255))).split(), a))

# --- fondo colado DENTRO de la silueta -----------------------------------------
# Entre el pelo y la oreja rembg dejo un pedazo de PARED metido en el recorte: a tamaño
# de feed se veia como una mancha blanca al lado de la cara. No es spill de borde (eso ya
# se corrigio arriba), es un agujero mal segmentado. Se caza por color -- claro y
# desaturado -- y SOLO en la banda de ~12px pegada al contorno, para no tocar los ojos
# ni los dientes, que tambien son claros pero viven en el centro de la silueta.
_ar = np.asarray(suj.convert("RGB"), dtype=np.float32)
_mx, _mn = _ar.max(axis=2), _ar.min(axis=2)
_lum, _sat = _mx, (_mx - _mn) / np.maximum(_mx, 1.0)
_ero = a.filter(ImageFilter.GaussianBlur(26)).point(lambda v: 255 if v > 218 else 0)
_banda = (np.asarray(a, np.float32) - np.asarray(_ero, np.float32)) / 255.0
_mal = (_banda > 0.30) & (_lum > 158) & (_sat < 0.17)
if _mal.any():
    _q = Image.fromarray(np.uint8(_mal * 255)).filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.GaussianBlur(1.4))
    a = Image.fromarray(np.uint8(np.clip(np.asarray(a, np.float32) * (1 - np.asarray(_q, np.float32) / 255.0), 0, 255)))
    suj.putalpha(a)
    print(f"fondo colado: {int(_mal.sum())} px limpiados del contorno")

rgb = suj.convert("RGB")
rgb = ImageEnhance.Brightness(rgb).enhance(1.14)
rgb = ImageEnhance.Contrast(rgb).enhance(1.16)
rgb = ImageEnhance.Color(rgb).enhance(1.10)
suj = Image.merge("RGBA", (*rgb.split(), a))

# --- rim light: UN solo halo, naranja y difuso ---
# El segundo halo (casi blanco, con blur 1.6) dibujaba un contorno duro alrededor del pelo:
# a tamaño real se leia como si la imagen estuviera rota. Va uno solo, y bien difuminado.
anillo = ImageChops.subtract(a.filter(ImageFilter.MaxFilter(9)), a)
glow = Image.new("RGBA", suj.size, (255, 138, 62, 0))
glow.putalpha(anillo.filter(ImageFilter.GaussianBlur(11)).point(lambda v: int(v * 0.85)))

sombra = Image.new("RGBA", suj.size, (0, 0, 0, 0))
sombra.putalpha(a.filter(ImageFilter.GaussianBlur(26)).point(lambda v: int(v * 0.85)))

capa = Image.new("RGBA", (W, H), (0, 0, 0, 0))
x0, y0 = W - suj.width + 44, H - alto + 4
capa.alpha_composite(sombra, (x0 - 14, y0 + 10))
capa.alpha_composite(glow, (x0, y0))
capa.alpha_composite(suj, (x0, y0))

out = Image.alpha_composite(bg.convert("RGBA"), capa)
out.save("assets/mini-fondo.png")
print(f"ancho de cabeza {cabeza_w}px -> encuadre {box[2]-box[0]}x{box[3]-box[1]}, esc {esc:.2f}")
print(f"sujeto x{x0} ancho {suj.width}")
