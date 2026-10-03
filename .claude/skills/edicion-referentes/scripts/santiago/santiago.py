#!/usr/bin/env python3
"""santiago.py — edita un talking head con la receta de Santiago Muñoz (skill edicion-referentes).

Entradas: bruto + cutplan (keep = tramos del bruto) + transcript EN TIEMPO DE SALIDA (words con start/end) +
storyboard (escenas con su layout, elementos y la PALABRA que dispara cada uno). Salida: MP4 1080x1920 a 30 fps,
solo voz a −13 LUFS, y una hoja de control a 2 fps con el segundo impreso.

Lo que la receta fija acá (medido en 4 reels; detalle en el README):
- layouts: split (panel arriba 0-900 px, ojos al 67,5 %), cara completa (ojos al 46 %), persona reducida (lámina
  con la cámara en una ventana del 40 % del ancho) y lámina sin cara. Entre split y cara la cámara se TRASLADA
  (≈400 px) sin reescalar: sube en 0,33 s y tapa el panel; baja en 0,27 s.
- encuadre por toma: el bruto trae saltos internos (tomas pegadas); cada toma se normaliza con Haar (posición y
  ancho de la cara) para que la cara no salte en los cortes, con una escala base de 1,08 que da margen abajo.
- aire: abre las uniones de frase (puntos y comas) hasta 2,65-3,2 palabras/s, sin pausas de más de 0,56 s; en un
  corte estira el corte sobre el silencio real del bruto, adentro de una toma estira el silencio (cuadros fundidos).
- cambios de escena del panel con fundido de 0,2 s; cambio de capítulo con barrido de 0,3 s; lo demás, seco.
- zoom solo como acento: golpe de +3 % que vuelve en 0,13 s, o punch-in ×1,10-1,22 sostenido.
- subtítulo sin caja: Inter Black en minúsculas normales, blanco con contorno negro y sombra; se arma palabra
  por palabra (1 cuadro translúcida, después amarilla #FDC82F); bloques de 1-3 palabras; en el split va sobre
  la costura, en cara completa al 77 %, en lámina al 80 %.
- sonido: solo voz, sin ruido de sala en las pausas (puerta espectral + puerta por habla), −13 LUFS, TP ≤ −1,5.
- los tiempos salen de las PALABRAS del transcript; "corte": true pega el cambio al límite del cutplan o al salto
  interno del bruto más cercano (el piso: el apoyo cambia justo en el corte para que el salto de la cara no se vea).

Uso:
  python3 santiago.py --bruto bruto.mp4 --cutplan cutplan.json --transcript segments-cut.json \
      --storyboard storyboard.json --out prueba.mp4 [--assets carpeta] [--hojas carpeta] [--fotos 0.5,12,30]

--fotos renderiza solo esos segundos a PNG (para mirar antes del render completo).
Necesita ffmpeg, Pillow, numpy, scipy, opencv; Node + Playwright solo si faltan capturas (capturar.mjs).
"""
from __future__ import annotations

import argparse
import json
import math
import re
import subprocess
import sys
import time
from functools import lru_cache
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont
from scipy.ndimage import uniform_filter
from scipy.signal import istft, stft

AQUI = Path(__file__).resolve().parent
W, H, FPS = 1080, 1920, 30
SR = 48000

# ------------------------------------------------------------------ receta (cambiar acá = cambiar la receta)
R = dict(
    costura=900,          # alto del panel del split: 46,9 % (medido 45,8-50 %)
    # cámara, medida con Haar en Sonnet 5.5: ojos al 67,1 % en el split y al 49,2 % en cara completa (Animaciones
    # 38 %, Forja 33 %); paso split→cara de 318-600 px a escala 1,00. La escala base 1,08 da margen abajo para subir
    # la cara sin dejar hueco; una toma que necesita más para llegar al 47 % sube hasta escala_max (el cambio de
    # escala cae en el corte de toma, nunca dentro de un movimiento). Lo que falte abajo se rellena en espejo ≤40 px.
    ojos_split=0.675, ojos_full=0.46, escala_base=1.08, escala_max=1.18, relleno_max=40,
    sube=0.33, baja=0.27,  # mover la cámara al abrir/cerrar el split (medido 0,33 y 0,27 s)
    fundido=0.2,          # escena nueva del panel (0,13-0,27 s)
    barrido=0.3,          # cambio de capítulo (0,25-0,4 s)
    golpe=0.03, golpe_cuadros=4,  # +3 % que vuelve en ≈0,13 s
    punch_dur=0.2,        # punch-in hecho en 0-0,4 s
    # persona reducida (Animaciones a 5,0 s: la toma en una ventana dentro de la lámina): 40 % del ancho
    pip=dict(x=600, y=170, w=432, h=540, cara=0.60, ojos=0.42),
    sub_y={"split": 940, "full": 1478, "lamina": 1536, "pip": 1536},  # centro del renglón: 49 %, 77 %, 80 %
    sub_tam=64, sub_borde=5, sub_palabras=3, sub_hueco=0.25, sub_cola=0.35, sub_ancho=940,
    # aire: voz a 2,65-3,2 palabras/s con 16-33 pausas de 0,18-0,5 s (la más rápida, Forja: 3,16)
    pps_obj=3.0, pausa_punto=0.48, pausa_coma=0.34, pausa_max=0.56, aire_min=0.06, estira_mitad=0.12,
    # sonido: piso de las pausas −41/−55 dBFS en los referentes (p1 del RMS en 50 ms, escala del QA = RMS − 3 dB)
    lufs=-13.0, tp=-1.5, ruido_db=15, puerta_rango=14.0,
    sello_lado=320,       # lado largo del sello ≤ 320 px (Sonnet: 27-32 % del ancho)
)
FAMILIA = {"split": "split", "full": "full", "lamina": "lamina", "pip": "lamina"}
P = dict(tinta="#0A0F0D", papel="#F2EFE8", tarjeta="#141B18", borde="#2A332F", blanco="#FFFFFF",
         gris="#8F9893", gris_papel="#6E6A62", verde="#10C26B", amarillo="#FDC82F", linea_papel="#DCD6CA",
         tarjeta_papel="#FFFFFF")
FUENTES = {"black": "Inter:style=Black", "bold": "Inter:style=Bold", "semibold": "Inter:style=SemiBold",
           "regular": "Inter:style=Regular", "mono": "JetBrains Mono:style=SemiBold"}


def color(c):
    c = P.get(c, c)
    c = c.lstrip("#")
    return tuple(int(c[i:i + 2], 16) for i in (0, 2, 4)) + ((int(c[6:8], 16),) if len(c) == 8 else (255,))


@lru_cache(None)
def archivo_fuente(kind):
    pat = FUENTES[kind]
    out = subprocess.run(["fc-match", "-f", "%{family}|%{file}", pat], capture_output=True, text=True).stdout
    fam, path = out.split("|", 1)
    if pat.split(":")[0].lower() not in fam.lower():  # fc-match cae a otra familia en silencio
        sys.exit(f"santiago: falta la fuente {pat} (fc-match dio {fam}). Instalá Inter y JetBrains Mono.")
    return path


@lru_cache(None)
def fuente(kind, tam):
    return ImageFont.truetype(archivo_fuente(kind), int(tam))


def ease(p):  # ease-in-out cúbico
    p = min(1.0, max(0.0, p))
    return 4 * p ** 3 if p < 0.5 else 1 - (-2 * p + 2) ** 3 / 2


def ease_out(p):
    p = min(1.0, max(0.0, p))
    return 1 - (1 - p) ** 3


# ------------------------------------------------------------------ transcript y disparadores
def norm(s):
    return re.sub(r"[¿?¡!.,;:«»\"()]", "", s.lower()).strip()


class Linea:
    """Palabras en tiempo de salida + límites de corte del cutplan → resuelve disparadores a segundos."""

    def __init__(self, words, cortes, total, avisar=True):
        self.w, self.cortes, self.total, self.avisar = words, cortes, total, avisar
        self.usos = []  # (descripción, t) para el informe

    def buscar(self, frase, n=1):
        toks = [norm(t) for t in frase.split()]
        k = 0
        for i in range(len(self.w) - len(toks) + 1):
            if all(norm(self.w[i + j]["word"]) == toks[j] for j in range(len(toks))):
                k += 1
                if k == n:
                    return i, i + len(toks) - 1
        sys.exit(f"santiago: el storyboard pide «{frase}» (#{n}) y no está en el transcript")

    def t(self, d, defecto=None):
        if d is None:
            return defecto
        if isinstance(d, (int, float)):
            return float(d)
        if isinstance(d, str):
            m = re.match(r"^(.*?)(?:#(\d+))?$", d)
            d = {"frase": m.group(1), "n": int(m.group(2) or 1)}
        desde = None
        if "t" in d:
            t = float(d["t"])
        else:
            a, b = self.buscar(d["frase"], d.get("n", 1))
            t = self.w[b]["end"] if d.get("fin") else self.w[a]["start"]
            if a and not d.get("fin"):
                desde = self.w[a - 1]["end"] - 0.06  # el corte puede caer en cualquier punto de la pausa de antes
        if d.get("corte"):
            ini = min(t - 0.45, desde) if desde is not None else t - 0.45
            cand = [c for c in self.cortes if ini <= c <= t + 0.06]
            if not cand:
                if self.avisar:
                    print(f"  ⚠ «{d.get('frase')}» pide corte y no hay corte ni salto en la pausa de antes: queda en la palabra")
            else:
                t = min(cand, key=lambda c: abs(c - t))
        t += float(d.get("offset", 0))
        return max(0.0, min(self.total, t))


# ------------------------------------------------------------------ dibujo (Pillow)
def recorte_alfa(im, pad=0):
    bb = im.getbbox()
    if not bb:
        return im
    return im.crop((max(0, bb[0] - pad), max(0, bb[1] - pad), min(im.width, bb[2] + pad), min(im.height, bb[3] + pad)))


def partes_markup(texto, base, acento):
    """'Arranca en *modo auto*' → [(palabra, color)]. Los asteriscos marcan el color de acento."""
    out, en = [], False
    for trozo in re.split(r"(\*)", texto):
        if trozo == "*":
            en = not en
            continue
        for pal in re.findall(r"\S+|\n", trozo):
            out.append((pal, acento if en else base))
    return out


def texto_img(texto, kind="black", tam=60, col="blanco", acento="verde", ancho_max=None, alinear="izq",
              interlineado=1.12, sombra=False, borde=0):
    f = fuente(kind, tam)
    sp = f.getlength(" ")
    lineas, linea, ancho = [], [], 0
    for pal, c in partes_markup(texto, color(col), color(acento)):
        if pal == "\n":
            lineas.append(linea); linea, ancho = [], 0
            continue
        w = f.getlength(pal)
        if ancho_max and linea and ancho + sp + w > ancho_max:
            lineas.append(linea); linea, ancho = [], 0
        linea.append((pal, c, w)); ancho += (sp if len(linea) > 1 else 0) + w
    lineas.append(linea)
    asc, desc = f.getmetrics()
    lh = int(tam * interlineado)
    anchos = [sum(w for _, _, w in l) + sp * max(0, len(l) - 1) for l in lineas]
    cw = int(max(anchos + [1])) + 40 + 2 * borde
    ch = lh * (len(lineas) - 1) + asc + desc + 40 + 2 * borde
    capa = Image.new("RGBA", (cw, ch), (0, 0, 0, 0))
    d = ImageDraw.Draw(capa)
    for i, l in enumerate(lineas):
        x = 20 + borde + ((cw - 40 - 2 * borde - anchos[i]) / 2 if alinear == "centro" else 0)
        y = 20 + borde + i * lh
        for pal, c, w in l:
            d.text((x, y), pal, font=f, fill=c, stroke_width=borde, stroke_fill=(0, 0, 0, 255) if borde else None)
            x += w + sp
    if sombra:
        a = capa.split()[3].filter(ImageFilter.GaussianBlur(8)).point(lambda v: int(v * 0.65))
        sh = Image.new("RGBA", capa.size, (0, 0, 0, 0))
        sh.putalpha(a)
        fondo = Image.new("RGBA", capa.size, (0, 0, 0, 0))
        fondo.alpha_composite(sh, (0, 4))
        fondo.alpha_composite(capa)
        capa = fondo
    return recorte_alfa(capa, 2)


def cruz(d, cx, cy, r, c, w=6):
    d.line((cx - r, cy - r, cx + r, cy + r), fill=c, width=w)
    d.line((cx - r, cy + r, cx + r, cy - r), fill=c, width=w)


def tilde(d, cx, cy, r, c, w=6):  # ✓ dibujado: Inter no trae el glifo
    d.line((cx - r, cy, cx - r * 0.3, cy + r * 0.7), fill=c, width=w)
    d.line((cx - r * 0.3, cy + r * 0.7, cx + r, cy - r * 0.8), fill=c, width=w)


def pausa(d, x, y, h, c):  # ⏸ dibujado
    w = max(4, int(h * 0.26))
    d.rounded_rectangle((x, y, x + w, y + h), 2, fill=c)
    d.rounded_rectangle((x + int(w * 1.9), y, x + int(w * 2.9), y + h), 2, fill=c)
    return int(w * 2.9)


def pildora(texto, icono=None, tam=30, estilo="oscuro"):
    f = fuente("bold", tam)
    fondo, borde_c, txt, ic = {
        "oscuro": (P["tarjeta"], P["verde"], P["blanco"], P["verde"]),
        "verde": (P["verde"], P["verde"], P["tinta"], P["tinta"]),
        "claro": (P["tarjeta_papel"], P["linea_papel"], P["tinta"], P["verde"]),
        "papel-oscuro": (P["tinta"], P["tinta"], P["blanco"], P["verde"]),
    }[estilo]
    h = int(tam * 1.9)
    iw = int(tam * 1.1) if icono else 0
    w = int(f.getlength(texto)) + 2 * int(tam * 0.75) + iw
    im = Image.new("RGBA", (w + 4, h + 4), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((2, 2, w, h), h // 2, fill=fondo, outline=borde_c, width=3)
    x = int(tam * 0.75)
    if icono == "check":
        tilde(d, x + tam * 0.42, h / 2 + 2, tam * 0.36, ic, max(4, tam // 7))
    elif icono == "cruz":
        cruz(d, x + tam * 0.42, h / 2 + 2, tam * 0.3, ic, max(4, tam // 7))
    elif icono == "pausa":
        pausa(d, x + 4, int(h / 2 + 2 - tam * 0.38), int(tam * 0.76), ic)
    d.text((x + iw, h / 2 + 2), texto, font=f, fill=txt, anchor="lm")
    return im


def sello(texto, tam=54, rot=-8, lado=None):
    """Sello amarillo rotado. El lado largo (ya rotado, sin sombra) no pasa de `lado` px: Sonnet usa 27-32 % del
    ancho ('ACABA DE SALIR' ≈32 %, 'LA MITAD' ≈27 %) con 1-3 palabras cortas; más grande tapa la prueba."""
    lado = lado or R["sello_lado"]
    while True:
        f = fuente("black", tam)
        pad_x, pad_y = int(tam * 0.5), int(tam * 0.32)
        w = int(f.getlength(texto)) + 2 * pad_x
        h = int(tam * 0.74) + 2 * pad_y
        im = Image.new("RGBA", (w + 40, h + 40), (0, 0, 0, 0))
        d = ImageDraw.Draw(im)
        d.rounded_rectangle((20, 20, 20 + w, 20 + h), 8, fill=color("amarillo"), outline=color("tinta"), width=4)
        d.text((20 + w / 2, 20 + h / 2 + 1), texto, font=f, fill=color("tinta"), anchor="mm")
        im = recorte_alfa(im.rotate(-rot, resample=Image.BICUBIC, expand=True))  # rot como en CSS: −8 = antihorario
        largo = max(im.size)
        if largo <= lado or tam <= 22:
            break
        tam = max(22, int(tam * lado / largo) - 1)
    sh = Image.new("RGBA", im.size, (0, 0, 0, 0))
    sh.putalpha(im.split()[3].filter(ImageFilter.GaussianBlur(10)).point(lambda v: int(v * 0.5)))
    out = Image.new("RGBA", (im.width + 20, im.height + 20), (0, 0, 0, 0))
    out.alpha_composite(sh, (6, 14))
    out.alpha_composite(im, (0, 0))
    return recorte_alfa(out)


def marco_navegador(contenido, url, ancho, fondo="oscuro"):
    """Ventana con tres puntos y la URL arriba: 'captura oficial en marco de navegador con URL'."""
    esc = ancho / contenido.width
    cont = contenido.resize((ancho, max(1, round(contenido.height * esc))), Image.LANCZOS)
    barra = 58
    im = Image.new("RGBA", (ancho, cont.height + barra), (0, 0, 0, 0))
    mask = Image.new("L", im.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, im.width - 1, im.height - 1), 20, fill=255)
    lienzo = Image.new("RGBA", im.size, color("#1A211E"))
    lienzo.paste(cont, (0, barra))
    d = ImageDraw.Draw(lienzo)
    for i, c in enumerate(("#FF5F57", "#FEBC2E", "#28C840")):
        d.ellipse((26 + i * 30, barra / 2 - 8, 42 + i * 30, barra / 2 + 8), fill=c)
    fu = fuente("mono", 22)
    uw = int(fu.getlength(url)) + 44
    x0 = 130
    d.rounded_rectangle((x0, 12, min(ancho - 24, x0 + uw), barra - 12), 17, fill=color("#0E1412"))
    d.text((x0 + 22, barra / 2), url, font=fu, fill=color("gris"), anchor="lm")
    im.paste(lienzo, (0, 0), mask)
    d2 = ImageDraw.Draw(im)
    d2.rounded_rectangle((0, 0, im.width - 1, im.height - 1), 20, outline=color("borde"), width=2)
    return im, barra, esc


def caja(titulo, sub=None, ancho=300, alto=150, estilo="claro", tam=40):
    fondo, borde_c, tc, sc = {
        "claro": (P["tarjeta_papel"], P["linea_papel"], P["tinta"], P["gris_papel"]),
        "oscuro": (P["tarjeta"], P["borde"], P["blanco"], P["gris"]),
        "verde": (P["tarjeta_papel"], P["verde"], P["tinta"], P["verde"]),
        "tinta": (P["tinta"], P["tinta"], P["blanco"], P["verde"]),
    }[estilo]
    im = Image.new("RGBA", (ancho, alto), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((0, 0, ancho - 1, alto - 1), 22, fill=fondo, outline=borde_c, width=4 if estilo == "verde" else 2)
    t = texto_img(titulo, "black", tam, tc, ancho_max=ancho - 30, alinear="centro", interlineado=1.05)
    if sub:
        s = texto_img(sub, "mono", int(tam * 0.62), sc, ancho_max=ancho - 30, alinear="centro")
        y = (alto - t.height - s.height + 6) // 2
        im.alpha_composite(t, ((ancho - t.width) // 2, y))
        im.alpha_composite(s, ((ancho - s.width) // 2, y + t.height - 6))
    else:
        im.alpha_composite(t, ((ancho - t.width) // 2, (alto - t.height) // 2))
    return im


def flecha(largo=60, grosor=6, col="gris_papel", vertical=False):
    im = Image.new("RGBA", (largo, 40), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    c = color(col)
    d.line((0, 20, largo - 16, 20), fill=c, width=grosor)
    d.polygon([(largo, 20), (largo - 22, 6), (largo - 22, 34)], fill=c)
    return im.rotate(-90, expand=True) if vertical else im


def fila(texto, sub=None, icono="cruz", ancho=984, alto=140, estilo="claro"):
    fondo, borde_c, tc, sc = ((P["tarjeta_papel"], P["linea_papel"], P["tinta"], P["gris_papel"]) if estilo == "claro"
                              else (P["tarjeta"], P["borde"], P["blanco"], P["gris"]))
    im = Image.new("RGBA", (ancho, alto), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((0, 0, ancho - 1, alto - 1), 22, fill=fondo, outline=borde_c, width=2)
    s = alto - 52
    d.rounded_rectangle((26, 26, 26 + s, 26 + s), 16, fill=color("tinta") if icono == "cruz" else color("verde"))
    (cruz if icono == "cruz" else tilde)(d, 26 + s / 2, 26 + s / 2, s * 0.24, color("blanco") if icono == "cruz" else color("tinta"), 7)
    t = texto_img(texto, "bold", 46, tc, ancho_max=ancho - s - 90)
    x = 26 + s + 26
    if sub:
        u = texto_img(sub, "mono", 27, sc)
        y = (alto - t.height - u.height - 8) // 2
        im.alpha_composite(t, (x, y))
        im.alpha_composite(u, (x + 2, y + t.height + 8))
    else:
        im.alpha_composite(t, (x, (alto - t.height) // 2))
    return im


def teclas(nombres, tam=72):
    f = fuente("black", tam)
    piezas = []
    for i, n in enumerate(nombres):
        if i:
            piezas.append(texto_img("+", "black", tam, "gris"))
        w = int(f.getlength(n)) + int(tam * 1.1)
        h = int(tam * 1.75)
        k = Image.new("RGBA", (w, h + 12), (0, 0, 0, 0))
        d = ImageDraw.Draw(k)
        d.rounded_rectangle((0, 12, w - 1, h + 11), 22, fill=color("#050807"))
        d.rounded_rectangle((0, 0, w - 1, h - 1), 22, fill=color("#222B27"), outline=color("#3C4842"), width=3)
        d.text((w / 2, h / 2), n, font=f, fill=color("blanco"), anchor="mm")
        piezas.append(k)
    ww = sum(p.width for p in piezas) + 24 * (len(piezas) - 1)
    hh = max(p.height for p in piezas)
    im = Image.new("RGBA", (ww, hh), (0, 0, 0, 0))
    x = 0
    for p in piezas:
        im.alpha_composite(p, (x, (hh - p.height) // 2))
        x += p.width + 24
    return im


def contorno(w, h, col="verde", grosor=5, radio=12):
    im = Image.new("RGBA", (int(w) + 2 * grosor, int(h) + 2 * grosor), (0, 0, 0, 0))
    ImageDraw.Draw(im).rounded_rectangle((grosor // 2, grosor // 2, im.width - 1 - grosor // 2, im.height - 1 - grosor // 2),
                                          radio, outline=color(col), width=grosor)
    return im


def etiqueta(partes, oscuro=True):
    """Fila de arriba del panel: insignia verde + texto mono gris ('● ÚLTIMA HORA · 28 SEP 2026' en Sonnet)."""
    f = fuente("mono", 24)
    piezas = []
    if partes:
        b = partes[0]
        w = int(f.getlength(b)) + 62
        im = Image.new("RGBA", (w, 44), (0, 0, 0, 0))
        d = ImageDraw.Draw(im)
        d.rounded_rectangle((0, 0, w - 1, 43), 8, fill=color("verde"))
        d.ellipse((16, 16, 28, 28), fill=color("tinta"))
        d.text((40, 22), b, font=f, fill=color("tinta"), anchor="lm")
        piezas.append(im)
    for p in partes[1:]:
        piezas.append(texto_img(p, "mono", 24, "gris" if oscuro else "gris_papel"))
    ww = sum(p.width for p in piezas) + 18 * (len(piezas) - 1)
    im = Image.new("RGBA", (max(1, ww), 48), (0, 0, 0, 0))
    x = 0
    for p in piezas:
        im.alpha_composite(p, (x, (48 - p.height) // 2))
        x += p.width + 18
    return im


# ------------------------------------------------------------------ elementos y escenas
class Elemento:
    def __init__(self, img, x, y, t0, t1, anim="pop", dinamico=None):
        self.img, self.x, self.y, self.t0, self.t1, self.anim, self.dinamico = img, x, y, t0, t1, anim, dinamico
        self.cache = {}

    def estado(self, t):
        if t < self.t0 - 1e-6 or t >= self.t1 - 1e-6:
            return None
        k = int(round((t - self.t0) * FPS))
        a = self.anim
        if a == "corte" or k > 8:
            st = (1.0, 1.0, 0)
        elif a == "pop":  # escala 1,25 → 1 en 4 cuadros
            st = (min(1.0, (k + 1) / 2), round(1 + 0.25 * max(0.0, 1 - k / 4) ** 2, 3), 0)
        elif a == "marca":  # contorno de resalte: entra casi en su tamaño (1,08 → 1) para no correrse de la frase
            st = (min(1.0, (k + 1) / 2), round(1 + 0.08 * max(0.0, 1 - k / 3), 3), 0)
        elif a == "sello":  # cae de 130 % a 100 % en 3-4 cuadros
            st = (1.0, round(1 + 0.3 * max(0.0, 1 - k / 3.5), 3), 0)
        elif a == "fundido":
            st = (round(min(1.0, (k + 1) / 6), 3), 1.0, 0)
        elif a == "sube":
            p = ease_out((k + 1) / 7)
            st = (round(p, 3), 1.0, int(28 * (1 - p)))
        else:
            st = (1.0, 1.0, 0)
        return st

    def imagen(self, t, st):
        base = self.dinamico(t) if self.dinamico else self.img
        if self.dinamico is None:
            key = st
            if key in self.cache:
                return self.cache[key]
        alfa, esc, dy = st
        im = base
        if esc != 1.0:
            im = im.resize((max(1, round(im.width * esc)), max(1, round(im.height * esc))), Image.BICUBIC)
        if alfa < 1.0:
            im = im.copy()
            im.putalpha(im.split()[3].point(lambda v: int(v * alfa)))
        dx = (base.width - im.width) // 2
        res = (im, dx, (base.height - im.height) // 2 + dy)
        if self.dinamico is None:
            self.cache[st] = res
        return res


class Escena:
    def __init__(self, sid, layout, t0, fondo, entrada):
        self.id, self.layout, self.t0, self.entrada = sid, layout, t0, entrada
        self.t1 = None
        self.fondo = fondo
        self.els: list[Elemento] = []
        self._sig, self._arr = None, None

    def lienzo(self, t):
        """RGBA del panel (split: 1080x900), de la lámina (1080x1920) o del overlay de cara completa."""
        vis = []
        for i, e in enumerate(self.els):
            st = e.estado(t)
            if st:
                vis.append((i, st, (int(t * FPS) if e.dinamico else 0)))
        sig = tuple(vis)
        if sig == self._sig:
            return self._arr
        c = self.fondo.copy()
        for i, st, _ in vis:
            e = self.els[i]
            im, dx, dy = e.imagen(t, st)
            x, y = e.x + dx, e.y + dy
            # recorte a los bordes del lienzo
            cx0, cy0 = max(0, -x), max(0, -y)
            cx1, cy1 = min(im.width, c.width - x), min(im.height, c.height - y)
            if cx1 > cx0 and cy1 > cy0:
                c.alpha_composite(im.crop((cx0, cy0, cx1, cy1)), (x + cx0, y + cy0))
        self._sig, self._arr = sig, np.asarray(c)
        return self._arr


def fondo_img(layout, tipo):
    if layout == "full":
        return Image.new("RGBA", (W, H), (0, 0, 0, 0))
    h = R["costura"] if layout == "split" else H
    if tipo == "papel":
        im = Image.new("RGBA", (W, h), color("papel"))
        d = ImageDraw.Draw(im)
        lc = color("#E6E1D6")
        for x in range(0, W, 60):
            d.line((x, 0, x, h), fill=lc, width=1)
        for y in range(0, h, 60):
            d.line((0, y, W, y), fill=lc, width=1)
        return im
    return Image.new("RGBA", (W, h), color("tinta"))


# ------------------------------------------------------------------ clips (grabaciones oficiales)
@lru_cache(None)
def clip_cuadros(ruta):
    pr = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
                         "stream=width,height,r_frame_rate", "-of", "csv=p=0", ruta], capture_output=True, text=True)
    w, h, r = pr.stdout.strip().split(",")
    w, h = int(w), int(h)
    num, den = r.split("/")
    fps = float(num) / float(den)
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", ruta, "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
                         capture_output=True, check=True).stdout
    n = len(raw) // (w * h * 3)
    return np.frombuffer(raw, np.uint8).reshape(n, h, w, 3), fps


# ------------------------------------------------------------------ construcción del storyboard
class Montaje:
    def __init__(self, sb, linea: Linea, assets: Path, capmeta):
        self.sb, self.L, self.assets, self.capmeta = sb, linea, assets, capmeta
        self.escenas: list[Escena] = []
        self.zooms = []          # (tipo, t0, t1, escala)
        self.disparos = []       # (t, descripción) para el informe
        self.construir()

    def asset(self, nombre):
        p = Path(nombre)
        for cand in (p, self.assets / p, AQUI / p):
            if cand.exists():
                return cand
        sys.exit(f"santiago: no encuentro el asset {nombre}")

    def construir(self):
        L = self.L
        crudo = sorted(((L.t(e["desde"]), e) for e in self.sb["escenas"]), key=lambda x: x[0])
        for i, (t0, e) in enumerate(crudo):
            lay = e["layout"]
            prev = crudo[i - 1][1]["layout"] if i else None
            ent = e.get("entrada")
            if lay not in FAMILIA:
                sys.exit(f"santiago: layout desconocido {lay} (split, full, lamina, pip)")
            if not ent:
                if prev is None:
                    ent = "corte"
                elif prev == "split" and lay == "full":
                    ent = "sube"
                elif prev == "full" and lay == "split":
                    ent = "baja"
                elif FAMILIA[prev] == FAMILIA[lay] and lay != "full":
                    ent = "fundido"   # split→split y lámina↔persona reducida
                else:
                    ent = "corte"
            esc = Escena(e.get("id", f"e{i}"), lay, t0, fondo_img(lay, e.get("fondo", "oscuro")), ent)
            self.escenas.append(esc)
        for i, esc in enumerate(self.escenas):
            esc.t1 = self.escenas[i + 1].t0 if i + 1 < len(self.escenas) else L.total + 1
        for esc, (_, e) in zip(self.escenas, crudo):
            oscuro = e.get("fondo", "oscuro") != "papel"
            if e.get("etiqueta"):
                im = etiqueta(e["etiqueta"], oscuro)
                y = 90 if FAMILIA[esc.layout] == "lamina" else 40
                esc.els.append(Elemento(im, 48, y, esc.t0, esc.t1 + 0.6, "corte"))
            for el in e.get("elementos", []):
                self.elemento(esc, el, oscuro)
        for z in self.sb.get("zooms", []):
            t0 = L.t(z["en"])
            if z["tipo"] == "golpe":
                self.zooms.append(("golpe", t0, t0 + R["golpe_cuadros"] / FPS, 1 + z.get("escala", R["golpe"])))
            else:
                self.zooms.append(("punch", t0, L.t(z["hasta"]), z.get("escala", 1.12)))
            self.disparos.append((t0, f"zoom {z['tipo']}"))

    def pos(self, el, im, escena_h):
        x, y = el.get("pos", [48, 104])
        if x == "centro":
            x = (W - im.width) // 2
        if y == "centro":
            y = (escena_h - im.height) // 2
        return int(x), int(y)

    def elemento(self, esc, el, oscuro):
        L = self.L
        t0 = L.t(el.get("en"), esc.t0)
        # sin "hasta", el elemento sigue vivo 0,6 s después de su escena: la escena siguiente lo necesita para su
        # fundido / barrido / cámara que sube (si no, el panel viejo se vacía y el cambio pasa por negro)
        t1 = L.t(el.get("hasta"), esc.t1 + 0.6)
        tipo = el["tipo"]
        hh = R["costura"] if esc.layout == "split" else H
        # lo que ya está al abrir la escena entra con la escena (fundido, barrido o la cámara que se mueve):
        # animarlo además hace un bache a negro en el medio del cambio
        if abs(t0 - esc.t0) < 1e-3 and esc.entrada != "corte":
            el = {**el, "anim": "corte"}
        anim = el.get("anim", "pop")
        tinta_txt = "blanco" if oscuro else "tinta"
        if tipo == "texto":
            im = texto_img(el["texto"], el.get("fuente", "black"), el.get("tam", 72), el.get("color", tinta_txt),
                           el.get("acento", "verde"), el.get("ancho_max", 984), el.get("alinear", "izq"),
                           el.get("interlineado", 1.08), el.get("sombra", esc.layout == "full"))
            anim = el.get("anim", "sube")
        elif tipo == "credito":
            im = texto_img(el["texto"], "mono", el.get("tam", 23), "gris" if oscuro else "gris_papel", ancho_max=984)
            anim = el.get("anim", "corte")
        elif tipo == "pildora":
            im = pildora(el["texto"], el.get("icono"), el.get("tam", 30), el.get("estilo", "oscuro" if oscuro else "claro"))
        elif tipo == "pildoras":  # varias píldoras apiladas que entran juntas (una pieza)
            ps = [pildora(t, ic, el.get("tam", 30), el.get("estilo", "oscuro" if oscuro else "claro")) for t, ic in el["items"]]
            im = Image.new("RGBA", (max(q.width for q in ps), sum(q.height for q in ps) + 14 * (len(ps) - 1)), (0, 0, 0, 0))
            yy = 0
            for q in ps:
                im.alpha_composite(q, (0, yy))
                yy += q.height + 14
        elif tipo == "sello":
            im = sello(el["texto"], el.get("tam", 54), el.get("rot", -8), el.get("lado"))
            anim = "sello"
        elif tipo == "logo":
            src = Image.open(self.asset(el["src"])).convert("RGBA")
            src = recorte_alfa(src)
            if "ancho" in el:
                im = src.resize((el["ancho"], round(src.height * el["ancho"] / src.width)), Image.LANCZOS)
            else:
                im = src.resize((round(src.width * el["alto"] / src.height), el["alto"]), Image.LANCZOS)
        elif tipo == "caja":
            im = caja(el["titulo"], el.get("sub"), el.get("ancho", 300), el.get("alto", 150), el.get("estilo", "claro" if not oscuro else "oscuro"), el.get("tam", 40))
        elif tipo == "flecha":
            im = flecha(el.get("largo", 60), el.get("grosor", 6), el.get("color", "gris_papel" if not oscuro else "gris"), el.get("vertical", False))
            anim = el.get("anim", "fundido")
        elif tipo == "fila":
            im = fila(el["texto"], el.get("sub"), el.get("icono", "cruz"), el.get("ancho", 984), el.get("alto", 140), "claro" if not oscuro else "oscuro")
            anim = el.get("anim", "sube")
        elif tipo == "teclas":
            im = teclas(el["teclas"], el.get("tam", 72))
        elif tipo == "tarjeta":
            im = self.tarjeta(el)
        elif tipo == "captura":
            return self.captura(esc, el, t0, t1, oscuro)
        elif tipo == "clip":
            return self.clip(esc, el, t0, t1)
        else:
            sys.exit(f"santiago: tipo de elemento desconocido: {tipo}")
        x, y = self.pos(el, im, hh)
        esc.els.append(Elemento(im, x, y, t0, t1, anim))
        self.disparos.append((t0, f"{esc.id}:{tipo} {el.get('texto', el.get('titulo', el.get('src', '')))}"[:70]))

    def tarjeta(self, el):
        ancho, alto = el.get("ancho", 860), el.get("alto", 560)
        im = Image.new("RGBA", (ancho, alto), (0, 0, 0, 0))
        d = ImageDraw.Draw(im)
        d.rounded_rectangle((0, 0, ancho - 1, alto - 1), 30, fill=color("tarjeta"), outline=color("verde"), width=4)
        y = 46
        for ln in el["lineas"]:
            t = texto_img(ln["texto"], ln.get("fuente", "black"), ln.get("tam", 80), ln.get("color", "blanco"),
                          ancho_max=ancho - 80, alinear="centro", interlineado=1.05)
            im.alpha_composite(t, ((ancho - t.width) // 2, y))
            y += t.height + ln.get("aire", 10)
        return im

    def captura(self, esc, el, t0, t1, oscuro):
        cid = el["src"]
        meta = self.capmeta.get(cid)
        if not meta:
            sys.exit(f"santiago: falta la captura {cid} (corré capturar.mjs)")
        img = Image.open(self.asset(f"{cid}.png")).convert("RGBA")
        rx, ry, rw, rh = el.get("recorte", [0, 0, img.width, img.height])
        cont = img.crop((rx, ry, rx + rw, ry + rh))
        ancho = el.get("ancho", 984)
        if el.get("marco", True):
            im, barra, esc_f = marco_navegador(cont, el.get("url", meta["url"].split("://")[-1]), ancho)
        else:
            esc_f = ancho / cont.width
            im = cont.resize((ancho, round(cont.height * esc_f)), Image.LANCZOS)
            mask = Image.new("L", im.size, 0)
            ImageDraw.Draw(mask).rounded_rectangle((0, 0, im.width - 1, im.height - 1), 16, fill=255)
            im.putalpha(mask)
            barra = 0
        hh = R["costura"] if esc.layout == "split" else H
        x, y = self.pos(el, im, hh)
        zl = el.get("zoom_lento")  # acercar lento 10-20 % (grabaciones propias en Jev)
        if zl and el.get("marcas"):
            sys.exit(f"santiago: {cid}: zoom_lento con marcas no va (el contorno no sigue al zoom)")
        if zl:
            dur = max(0.5, t1 - t0)
            base = im

            def din(t, base=base, zl=zl, t0=t0, dur=dur):
                s = zl[0] + (zl[1] - zl[0]) * ease((t - t0) / dur)
                w2, h2 = base.width / s, base.height / s
                cx, cy = base.width / 2, base.height / 2
                return base.crop((int(cx - w2 / 2), int(cy - h2 / 2), int(cx + w2 / 2), int(cy + h2 / 2))).resize(base.size, Image.BICUBIC)
            esc.els.append(Elemento(im, x, y, t0, t1, el.get("anim", "fundido"), dinamico=din))
        else:
            esc.els.append(Elemento(im, x, y, t0, t1, el.get("anim", "fundido")))
        self.disparos.append((t0, f"{esc.id}:captura {cid}"))
        for m in el.get("marcas", []):
            fx, fy, fw, fh = meta["frases"][m["frase"]]
            px = x + (fx - rx) * esc_f
            py = y + barra + (fy - ry) * esc_f
            pad = m.get("pad", 8)
            c = contorno(fw * esc_f + 2 * pad, fh * esc_f + 2 * pad)
            mt0 = self.L.t(m["en"])
            esc.els.append(Elemento(c, int(px - pad - 5), int(py - pad - 5), mt0, self.L.t(m.get("hasta"), t1), "marca"))
            self.disparos.append((mt0, f"{esc.id}:marca «{m['frase'][:30]}»"))
            if m.get("etiqueta"):
                pl = pildora(m["etiqueta"], m.get("icono", "check"), 28, "verde")
                lx = int(px - pad) if m.get("lado", "abajo") == "abajo" else int(px + fw * esc_f + pad + 14)
                ly = int(py + fh * esc_f + pad + 6) if m.get("lado", "abajo") == "abajo" else int(py - pad)
                esc.els.append(Elemento(pl, lx, ly, mt0 + 0.2, t1, "pop"))

    def clip(self, esc, el, t0, t1):
        ruta = str(self.asset(el["src"]))
        cuadros, cfps = clip_cuadros(ruta)
        cx, cy, cw, ch = el.get("recorte", [0, 0, cuadros.shape[2], cuadros.shape[1]])
        ancho = el.get("ancho", 984)
        alto = round(ch * ancho / cw)
        t_clip = el.get("t_clip", 0.0)
        tplay = self.L.t(el["play"]) if el.get("play") else None
        zl = el.get("zoom_lento", [1.0, 1.0])
        marco = el.get("marco", True)
        url = el.get("url", "")

        @lru_cache(None)
        def cuadro(idx, s1000):
            fr = cuadros[min(idx, len(cuadros) - 1), cy:cy + ch, cx:cx + cw]
            im = Image.fromarray(fr).convert("RGBA").resize((ancho, alto), Image.LANCZOS)
            s = s1000 / 1000
            if s != 1:
                w2, h2 = ancho / s, alto / s
                im = im.crop((int((ancho - w2) / 2), int((alto - h2) / 2), int((ancho + w2) / 2), int((alto + h2) / 2))).resize((ancho, alto), Image.BICUBIC)
            if marco:
                im, _, _ = marco_navegador(im, url, ancho)
            return im

        def din(t):
            tc = t_clip + (max(0.0, t - tplay) if tplay is not None else 0.0)
            s = zl[0] + (zl[1] - zl[0]) * ease((t - t0) / max(0.5, t1 - t0))
            return cuadro(int(tc * cfps), int(round(s * 1000)))

        hh = R["costura"] if esc.layout == "split" else H
        x, y = self.pos(el, cuadro(int(t_clip * cfps), 1000), hh)
        esc.els.append(Elemento(None, x, y, t0, t1, el.get("anim", "fundido"), dinamico=din))
        self.disparos.append((t0, f"{esc.id}:clip {Path(ruta).name}"))
        barra = 58 if marco else 0
        for m in el.get("marcas", []):
            bx, by, bw, bh = m["caja"]  # en píxeles del clip recortado
            f = ancho / cw
            c = contorno(bw * f + 16, bh * f + 16)
            mt0 = self.L.t(m["en"])
            esc.els.append(Elemento(c, int(x + bx * f - 13), int(y + barra + by * f - 13), mt0, t1, "marca"))
            self.disparos.append((mt0, f"{esc.id}:marca clip"))

    # -------------------------------------------------- consultas por tiempo
    def escena(self, t):
        i = 0
        for k, e in enumerate(self.escenas):
            if e.t0 <= t + 1e-6:
                i = k
        return i

    def escala(self, t):
        s = 1.0
        for tipo, t0, t1, esc in self.zooms:
            if tipo == "golpe" and t0 - 1e-6 <= t < t1:
                k = int(round((t - t0) * FPS))
                s = max(s, 1 + (esc - 1) * (1 - k / R["golpe_cuadros"]))
            elif tipo == "punch" and t0 - 1e-6 <= t < t1:
                s = max(s, 1 + (esc - 1) * ease_out((t - t0 + 1 / FPS) / R["punch_dur"]))
            elif tipo == "punch" and t1 <= t < t1 + R["sube"] and not any(abs(c - t1) < 0.06 for c in self.L.cortes):
                # termina fuera de un corte: vuelve a 1,00 durante la subida de la cámara, no de golpe
                s = max(s, 1 + (esc - 1) * (1 - ease((t - t1 + 1 / FPS) / R["sube"])))
        return s


# ------------------------------------------------------------------ subtítulos (karaoke Sonnet)
def limpiar(w):
    return re.sub(r"[.,;:]+$", "", w.strip())


class Subtitulos:
    def __init__(self, words):
        self.w = words
        self.f = fuente("black", R["sub_tam"])
        self.sp = self.f.getlength(" ")
        self.bloques = self.agrupar()
        self.cache = {}

    def agrupar(self):
        bl, cur = [], []
        for i, w in enumerate(self.w):
            cand = cur + [i]
            ancho = sum(self.f.getlength(limpiar(self.w[j]["word"])) for j in cand) + self.sp * (len(cand) - 1)
            if cur and ancho > R["sub_ancho"]:
                bl.append(cur); cand = [i]
            cur = cand
            gap = self.w[i + 1]["start"] - w["end"] if i + 1 < len(self.w) else 9
            if len(cur) >= R["sub_palabras"] or re.search(r"[.,;:?!]$", w["word"]) or gap > R["sub_hueco"]:
                bl.append(cur); cur = []
        if cur:
            bl.append(cur)
        out = []
        for k, b in enumerate(bl):
            t0 = self.w[b[0]]["start"]
            t1 = self.w[b[-1]]["end"] + R["sub_cola"]
            if k + 1 < len(bl):
                t1 = min(t1, self.w[bl[k + 1][0]]["start"])
            out.append((t0, max(t1, self.w[b[-1]]["start"] + 0.2), b))
        return out

    def imagen(self, t):
        for bi, (t0, t1, b) in enumerate(self.bloques):
            if t0 - 1e-6 <= t < t1:
                break
        else:
            return None
        act = max(k for k, j in enumerate(b) if self.w[j]["start"] <= t + 1e-6)
        primera = (t - self.w[b[act]]["start"]) < 1 / FPS - 1e-6  # el cuadro en que aparece: translúcida
        key = (bi, act, primera)
        if key in self.cache:
            return self.cache[key]
        pals = [limpiar(self.w[j]["word"]) for j in b]
        anchos = [self.f.getlength(p) for p in pals]
        total = sum(anchos) + self.sp * (len(pals) - 1)
        bo = R["sub_borde"]
        asc, desc = self.f.getmetrics()
        cw, ch = int(total) + 2 * bo + 40, asc + desc + 2 * bo + 40
        capa = Image.new("RGBA", (cw, ch), (0, 0, 0, 0))
        d = ImageDraw.Draw(capa)
        x = 20 + bo
        for k, (p, a) in enumerate(zip(pals, anchos)):
            if k > act:
                break
            if k == act and primera:
                fill, st = (255, 255, 255, 120), (0, 0, 0, 120)
            elif k == act or (k == act - 1 and primera):
                fill, st = color("amarillo"), (0, 0, 0, 255)
            else:
                fill, st = (255, 255, 255, 255), (0, 0, 0, 255)
            d.text((x, 20 + bo), p, font=self.f, fill=fill, stroke_width=bo, stroke_fill=st)
            x += a + self.sp
        sh = Image.new("RGBA", capa.size, (0, 0, 0, 0))
        sh.putalpha(capa.split()[3].filter(ImageFilter.GaussianBlur(6)).point(lambda v: int(v * 0.55)))
        out = Image.new("RGBA", capa.size, (0, 0, 0, 0))
        out.alpha_composite(sh, (0, 5))
        out.alpha_composite(capa)
        arr = np.asarray(out)
        self.cache[key] = arr
        return arr


# ------------------------------------------------------------------ bruto: saltos internos, cara por toma, voz
def leer_audio(ruta, filtros=None):
    cmd = ["ffmpeg", "-v", "error", "-i", str(ruta)] + (["-af", filtros] if filtros else [])
    cmd += ["-vn", "-ac", "2", "-ar", str(SR), "-f", "f32le", "-"]
    raw = subprocess.run(cmd, capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, 2).copy()


def escribir_audio(ruta, x):
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", "-",
                    "-c:a", "pcm_f32le", str(ruta)], input=np.ascontiguousarray(x, np.float32).tobytes(), check=True)


def envolvente(x, paso=0.01):
    """dB del RMS (mono) en ventanas de `paso` s."""
    m = x.mean(1) if x.ndim == 2 else x
    n = int(SR * paso)
    k = len(m) // n
    return 10 * np.log10((m[:k * n].reshape(k, n).astype(np.float64) ** 2).mean(1) + 1e-12)


def analizar_bruto(bruto, work: Path):
    """Saltos internos del bruto (tomas pegadas antes del corte), cara de cada toma (Haar, el mismo detector del QA)
    y envolvente de la voz. Va a work/ para no repetirlo en cada corrida.

    Nace de la prueba N03 (3-oct): el bruto traía 4 tomas pegadas; la de 43,93 s entraba corrida +46/+83 px y el
    salto de 34,10 caía en medio de un split sin cambio de panel — el control decía «a la vista: ninguno» porque
    solo conocía los cortes del cutplan."""
    st = Path(bruto).stat()
    clave = f"{st.st_size}:{int(st.st_mtime)}:v2"
    cache, cache_voz = work / "bruto-analisis.json", work / "bruto-voz.npy"
    if cache.exists() and cache_voz.exists():
        d = json.loads(cache.read_text())
        if d.get("clave") == clave:
            d["voz"] = np.load(cache_voz)
            return d
    t_ini = time.time()
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(bruto), "-vf", "scale=108:192,format=gray",
                          "-f", "rawvideo", "-"], capture_output=True, check=True).stdout
    fr = np.frombuffer(raw, np.uint8).reshape(-1, 192, 108).astype(np.int16)
    dif = np.abs(np.diff(fr, axis=0)).mean(axis=(1, 2))
    med = float(np.median(dif))
    picos = []
    for i, v in enumerate(dif):  # salto = pico aislado (5× la mediana y 2,5× sus vecinos), no un movimiento sostenido
        vec = np.concatenate([dif[max(0, i - 5):i], dif[i + 1:i + 6]])
        if v > 5 * med and v > 2.5 * float(np.median(vec)):
            t = round((i + 1) / FPS, 3)
            if picos and t - picos[-1][0] < 0.2:
                if v > picos[-1][1]:
                    picos[-1] = (t, float(v))
            else:
                picos.append((t, float(v)))
    saltos = [float(t) for t, _ in picos]
    dur = len(fr) / FPS
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(bruto), "-vf", "fps=4,scale=540:960,format=gray",
                          "-f", "rawvideo", "-"], capture_output=True, check=True).stdout
    det = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
    obs = []
    for i, f in enumerate(np.frombuffer(raw, np.uint8).reshape(-1, 960, 540)):
        fs = det.detectMultiScale(f, 1.1, 5, minSize=(100, 100))
        if len(fs):
            x, y, w, h = max(fs, key=lambda b: b[2])
            obs.append((i / 4, 2 * (x + w / 2), 2 * (y + 0.4 * h), 2 * w))  # ojos ≈ 40 % del alto de la caja
    todas = np.array([o[1:] for o in obs]) if obs else np.array([[W / 2, H / 2, W / 2]])
    bordes = [0.0] + saltos + [dur]
    tomas = []
    for a, b in zip(bordes, bordes[1:]):
        o = np.array([q[1:] for q in obs if a + 0.15 <= q[0] < b - 0.15])
        ex, ey, fw = np.median(o if len(o) >= 3 else todas, axis=0)
        tomas.append({"t0": a, "t1": b, "ex": float(ex), "ey": float(ey), "w": float(fw), "n": int(len(o))})
    voz = envolvente(leer_audio(bruto, "highpass=f=100,lowpass=f=6000"))
    np.save(cache_voz, voz)
    d = {"clave": clave, "dur": dur, "saltos": saltos, "tomas": tomas,
         "ref_w": float(np.median(todas[:, 2])), "ref_x": float(np.median(todas[:, 0]))}
    cache.write_text(json.dumps(d, indent=1))
    print(f"bruto analizado en {time.time() - t_ini:.0f} s · saltos internos: {saltos}")
    d["voz"] = voz
    return d


def actividad(voz):
    """Máscara de habla (10 ms): 6 dB sobre el piso de la sala, con 30 ms de colgado a cada lado."""
    v = voz[voz > -80]
    piso = float(np.percentile(v, 10))
    from scipy.ndimage import maximum_filter1d
    return maximum_filter1d(voz > piso + 6, 7), piso


# ------------------------------------------------------------------ aire: la línea de tiempo nueva
def mapa_tiempo(keeps):
    acc, segs = 0.0, []
    for a, b in keeps:
        segs.append((acc, acc + (b - a), a))
        acc += b - a
    return segs, acc


def t_fuente(segs, t, izq=False):
    """Tiempo de salida del corte ORIGINAL → bruto. izq: un fin de palabra justo en el corte queda en su tramo."""
    for o0, o1, a in segs:
        if t < o1 - 1e-9 or (izq and t <= o1 + 1e-9):
            return a + (t - o0)
    o0, o1, a = segs[-1]
    return a + (o1 - o0) - 1e-3


class Tramo:
    """Pedazo continuo del bruto: un keep del cutplan partido en sus saltos internos."""

    def __init__(self, a, b, ini, fin):
        self.a, self.b, self.ini, self.fin = a, b, ini, fin
        self.a0, self.b0 = a, b
        self.ins = []  # (c, d, h): d s de aire en el silencio c del bruto, estirando el video de c-h a c+h


class LineaTiempo:
    """Salida → bruto. Cada segmento: (o0, o1, sa, sb, c, d); c None = se reproduce tal cual; si no, el video de
    [sa, sb] se estira (cuadros fundidos) y el audio mete d s de tono de sala en c."""

    def __init__(self, tramos):
        self.tramos = tramos
        self.segs, self.cortes, self.uniones = [], [], []
        o = 0.0
        for k, T in enumerate(tramos):
            if k:
                self.cortes.append((o, T.ini))
            cur = T.a
            for c, d, h in sorted(T.ins):
                x0, x1 = max(cur, c - h), min(T.b, c + h)
                if x0 - cur > 1e-6:
                    self.segs.append((o, o + x0 - cur, cur, x0, None, 0.0)); o += x0 - cur
                self.segs.append((o, o + x1 - x0 + d, x0, x1, c, d))
                self.uniones += [o + c - x0, o + c - x0 + d]
                o += x1 - x0 + d
                cur = x1
            if T.b - cur > 1e-6:
                self.segs.append((o, o + T.b - cur, cur, T.b, None, 0.0)); o += T.b - cur
        self.total = o
        self._o0 = [s[0] for s in self.segs]

    def fuente(self, t):
        """→ (segundo del bruto, ¿estirado?)."""
        import bisect
        i = max(0, bisect.bisect_right(self._o0, t + 1e-9) - 1)
        o0, o1, sa, sb, c, d = self.segs[i]
        if t >= o1 - 1e-9 and i == len(self.segs) - 1:
            return sb - 1e-3, False
        if c is None:
            return sa + (t - o0), False
        return sa + (t - o0) * (sb - sa) / (o1 - o0), True

    def nuevo(self, tb, izq=False):
        """Bruto → salida nueva (para las palabras). Lo que cayó en un recorte se pega al borde más cercano."""
        mejor, dist = 0.0, 1e9
        for o0, o1, sa, sb, c, d in self.segs:
            if sa - 1e-9 <= tb < sb - 1e-9 or (izq and sa < tb <= sb + 1e-9):
                return o0 + (tb - sa) + (d if c is not None and tb >= c else 0.0)
            for borde, ob in ((sa, o0), (sb, o1)):
                if abs(tb - borde) < dist:
                    mejor, dist = ob, abs(tb - borde)
        return mejor

    def audio(self, x, tono):
        n = int(round(self.total * SR))
        out = np.zeros((n, 2), np.float32)

        def copia(o, sa, sb):
            i0, j0 = int(round(o * SR)), int(round(sa * SR))
            L = min(int(round((sb - sa) * SR)), n - i0, len(x) - j0)
            if L > 0:
                out[i0:i0 + L] = x[j0:j0 + L]

        for o0, o1, sa, sb, c, d in self.segs:
            if c is None:
                copia(o0, sa, sb)
            else:
                copia(o0, sa, c)
                i0 = int(round((o0 + c - sa) * SR))
                L = min(int(round(d * SR)), n - i0)
                out[i0:i0 + L] = tono(L)
                copia(o0 + c - sa + d, c, sb)
        f = int(0.008 * SR)
        rampa = np.linspace(0, 1, f, dtype=np.float32)[:, None]
        for t in [c for c, _ in self.cortes] + self.uniones:  # fundidos de 8 ms en cada costura
            i = int(round(t * SR))
            a = out[max(0, i - f):i]
            a *= rampa[::-1][f - len(a):]
            b = out[i:i + f]
            b *= rampa[:len(b)]
        return out


def puntuacion(w):
    p = w.strip()[-1:] if w.strip() else ""
    return "punto" if p in ".?!…" else "coma" if p in ",;:" else None


def planear_aire(keeps, words, an, activo=True, layout_de=None):
    """Parte los keeps en sus saltos internos y abre las uniones de frase hasta R['pps_obj'] palabras/s.

    Cómo se mete el aire, de mejor a peor (nunca se inventa una toma):
    1. en un corte del cutplan: se corre el borde sobre el SILENCIO real que el corte había sacado (video real);
    2. adentro de una toma o en un salto: se estira el silencio entre las dos palabras (video ≤0,12 s a cada lado
       del centro, cuadros fundidos) y el audio mete tono de sala del propio bruto.
    Una pausa de más de R['pausa_max'] en un corte o salto se recorta del lado que tiene más silencio.
    Orden: primero donde no se ve la cara (lámina), después los cortes (video real), después la ventana reducida y
    al final el split o la cara completa — y ahí solo si la pausa real ya tiene ≥0,05 s (boca cerrada)."""
    layout_de = layout_de or (lambda t: "split")
    habla, _ = actividad(an["voz"])
    viejo, total_viejo = mapa_tiempo(keeps)
    tramos = []
    for k, (a, b) in enumerate(keeps):
        bordes = [a] + [s for s in an["saltos"] if a + 0.05 < s < b - 0.05] + [b]
        for j, (x, y) in enumerate(zip(bordes, bordes[1:])):
            ini = ("borde" if k == 0 else "corte") if j == 0 else "salto"
            fin = ("borde" if k == len(keeps) - 1 else "corte") if j == len(bordes) - 2 else "salto"
            tramos.append(Tramo(x, y, ini, fin))

    def idx_tramo(tb):
        for i, T in enumerate(tramos):
            if T.a - 1e-6 <= tb <= T.b + 1e-6:
                return i
        return None

    def silencio(a, b):
        """Corridas de silencio dentro de [a, b] del bruto → [(ini, fin)]."""
        i0, i1 = max(0, int(math.floor(a * 100))), min(len(habla), int(math.ceil(b * 100)))
        out, ini = [], None
        for i in range(i0, i1):
            if not habla[i] and ini is None:
                ini = i
            elif habla[i] and ini is not None:
                out.append((ini / 100, i / 100)); ini = None
        if ini is not None:
            out.append((ini / 100, i1 / 100))
        return [(max(a, x), min(b, y)) for x, y in out]

    def primera_voz(a, b):  # primer instante con voz en [a, b] (o b)
        i0, i1 = int(a * 100), min(len(habla), int(math.ceil(b * 100)))
        for i in range(i0, i1):
            if habla[i]:
                return max(a, i / 100)
        return b

    def ultima_voz(a, b):  # último instante con voz en [a, b] (o a)
        i0, i1 = max(0, int(a * 100)), min(len(habla), int(math.ceil(b * 100)))
        for i in range(i1 - 1, i0 - 1, -1):
            if habla[i]:
                return min(b, (i + 1) / 100)
        return a

    juntas, usadas = [], set()
    for i in range(len(words) - 1):
        tipo = puntuacion(words[i]["word"])
        eb = t_fuente(viejo, words[i]["end"], izq=True)
        sb = t_fuente(viejo, words[i + 1]["start"])
        ta, tb_ = idx_tramo(eb), idx_tramo(sb)
        if ta is None or tb_ is None or tb_ - ta > 1:
            continue
        # densidad local (palabras/s en ±5 s): el aire va primero donde habla más rápido
        t = words[i]["end"]
        dens = sum(1 for w in words if abs(w["start"] - t) <= 5) / 10
        if ta == tb_:
            T = tramos[ta]
            # la corrida ENTERA que toca la unión (el fin de palabra de Whisper se corre hasta 0,3 s)
            runs = [r for r in silencio(max(T.a, eb - 1.0), min(T.b, sb + 1.0))
                    if r[1] > eb - 0.15 and r[0] < sb + 0.15]
            if not runs:
                continue
            x, y = max(runs, key=lambda r: r[1] - r[0])
            g = y - x
            # una corrida pegada al borde del tramo es la pausa del corte/salto (la mide esa unión); y dos uniones que
            # comparten la misma corrida (una palabra de Whisper de duración 0) son UNA pausa, no dos
            if x <= T.a + 0.02 or y >= T.b - 0.02 or (ta, round(x, 2)) in usadas:
                continue
            usadas.add((ta, round(x, 2)))
            if tipo is None and g < 0.12:  # sin puntuación solo cuenta una respiración real
                continue
            lay = layout_de(t)
            if lay in ("split", "full") and g < 0.05:
                continue
            juntas.append(dict(i=i, tipo=tipo or "respira", lugar="dentro", tramo=ta, g=g, c=(x + y) / 2,
                               dens=dens, w=words[i]["word"], costo={"lamina": 0, "pip": 2}.get(lay, 3)))
        else:
            A, B = tramos[ta], tramos[tb_]
            gA = A.b - ultima_voz(max(A.a, A.b - 0.8), A.b)
            gB = primera_voz(B.a, min(B.b, B.a + 0.8)) - B.a
            eA = eB = 0.0
            if A.fin == "corte":  # lo que el corte sacó y es silencio
                eA = max(0.0, primera_voz(A.b, B.a) - A.b - 0.04)
                eB = max(0.0, B.a - ultima_voz(A.b, B.a) - 0.04)
                if eA + eB > B.a - A.b - 0.02:
                    eA = eB = max(0.0, (B.a - A.b - 0.02) / 2)
            lay = layout_de(t)
            juntas.append(dict(i=i, tipo=tipo or "respira", lugar=A.fin, tramo=ta, g=gA + gB, gA=gA, gB=gB,
                               eA=eA, eB=eB, dens=dens, w=words[i]["word"],
                               costo=0 if lay == "lamina" else 1 if A.fin == "corte" else {"pip": 2}.get(lay, 3)))

    objetivo = {"punto": R["pausa_punto"], "coma": R["pausa_coma"], "respira": R["pausa_coma"]}
    hechos, recortes, largas = [], [], []
    total = total_viejo
    # 1) pausas largas en cortes/saltos: se recortan (siempre)
    for j in juntas:
        if j["lugar"] != "dentro" and j["g"] > R["pausa_max"]:
            A, B = tramos[j["tramo"]], tramos[j["tramo"] + 1]
            sobra = j["g"] - objetivo[j["tipo"]]
            lado_b = min(sobra, max(0.0, j["gB"] - 0.12)) if j["gB"] >= j["gA"] else 0.0
            lado_a = min(sobra - lado_b, max(0.0, j["gA"] - 0.12))
            lado_b = min(sobra - lado_a, max(0.0, j["gB"] - 0.12))
            A.b -= lado_a; B.a += lado_b
            total -= lado_a + lado_b
            j["g"] -= lado_a + lado_b
            recortes.append((j, lado_a + lado_b))
        elif j["lugar"] == "dentro" and j["g"] > R["pausa_max"]:
            largas.append(j)
    # 2) aire hasta el objetivo de palabras por segundo: puntos y comas a su pausa, empezando por lo barato;
    #    si no alcanza, lo barato (lámina y cortes) sube hasta el tope; recién después las respiraciones
    falta = len(words) / R["pps_obj"] - total if activo else 0.0
    tope = R["pausa_max"] - 0.04
    rondas = [(sorted([j for j in juntas if j["tipo"] != "respira"],
                      key=lambda j: (j["costo"], {"punto": 0, "coma": 1}[j["tipo"]], -j["dens"])), objetivo),
              (sorted([j for j in juntas if j["tipo"] != "respira" and j["costo"] <= 1], key=lambda j: -j["dens"]),
               {"punto": tope, "coma": tope}),
              (sorted([j for j in juntas if j["tipo"] == "respira"], key=lambda j: (j["costo"], -j["dens"])), objetivo)]
    orden = [(j, obj) for lista, obj in rondas for j in lista]
    for j, obj in orden:
        if falta < R["aire_min"]:
            break
        d = min(obj[j["tipo"]] - j["g"], falta)
        if d < R["aire_min"]:
            continue
        T = tramos[j["tramo"]]
        puesto = 0.0
        if j["lugar"] == "corte":  # 1) silencio real que había sacado el corte
            A, B = T, tramos[j["tramo"] + 1]
            ea = min(j["eA"], d / 2)
            eb = min(j["eB"], d - ea)
            ea = min(j["eA"], d - eb)
            A.b += ea; B.a -= eb
            puesto = ea + eb
        resto = d - puesto
        if resto >= R["aire_min"]:  # 2) estirar el silencio
            if j["lugar"] == "dentro":
                tr, c = T, j["c"]
                medio = j["g"] / 2
            else:
                A, B = T, tramos[j["tramo"] + 1]
                if j["gA"] >= j["gB"]:
                    tr, c, medio = A, A.b0 - j["gA"] / 2, j["gA"] / 2
                else:
                    tr, c, medio = B, B.a0 + j["gB"] / 2, j["gB"] / 2
            h = min(R["estira_mitad"], max(medio, 0.04))
            if tr.a + 0.02 < c < tr.b - 0.02:
                prev = [k for k, q in enumerate(tr.ins) if abs(q[0] - c) < 1e-3]
                if prev:  # la misma unión en otra ronda: se suma al mismo estiramiento
                    q = tr.ins[prev[0]]
                    tr.ins[prev[0]] = (q[0], q[1] + resto, q[2])
                else:
                    tr.ins.append((c, resto, h))
                puesto += resto
        if puesto > 0:
            falta -= puesto
            total += puesto
            j["g"] += puesto
            if j["lugar"] == "corte":  # lo ya usado del silencio del corte no se vuelve a usar
                j["eA"] -= ea; j["eB"] -= eb
            hechos.append((j, puesto))
    tl = LineaTiempo(tramos)
    nuevas = []
    for w in words:
        s = tl.nuevo(t_fuente(viejo, w["start"]))
        e = tl.nuevo(t_fuente(viejo, w["end"], izq=True), izq=True)
        nuevas.append({**w, "start": round(s, 3), "end": round(max(e, s + 0.02), 3)})
    plan = dict(hechos=hechos, recortes=recortes, largas=largas, juntas=juntas, total_viejo=total_viejo,
                falta=max(0.0, falta), voz=an["voz"])
    return tl, nuevas, plan


def habla_salida(tl: LineaTiempo, voz):
    """Máscara de habla (10 ms) en la salida nueva: la del bruto llevada por la línea de tiempo; el aire es silencio."""
    habla, _ = actividad(voz)
    n = int(math.ceil(tl.total * 100))
    h = np.zeros(n, bool)
    for o0, o1, sa, sb, c, d in tl.segs:
        tramos = [(o0, o1, sa)] if c is None else [(o0, o0 + c - sa, sa), (o0 + c - sa + d, o1, c)]
        for a, b, s0 in tramos:
            for k in range(int(round(a * 100)), min(n, int(round(b * 100)))):
                j = int(round((s0 + k / 100 - a) * 100))
                h[k] = habla[min(j, len(habla) - 1)]
    return h


def pausas_plan(tl: LineaTiempo, voz):
    """Pausas que va a tener la voz nueva, antes de renderizar."""
    h = habla_salida(tl, voz)
    idx = np.nonzero(h)[0]
    runs, ini = [], None
    for k in range(idx[0], idx[-1] + 1):
        if not h[k] and ini is None:
            ini = k
        elif h[k] and ini is not None:
            runs.append((ini / 100, (k - ini) / 100)); ini = None
    return runs


def tono_de_sala(x, voz=None):
    """El silencio más parejo del bruto para rellenar el aire nuevo. Se mide en banda completa y ningún cuadro puede
    pasar el piso + 3 dB: con el promedio solo (0,6 s) entró la cola de una palabra y sonaba un «blip» a −19 dBFS
    en medio de la pausa nueva (prueba N03, 3-oct)."""
    v = envolvente(x)
    piso = float(np.percentile(v[v > -80], 10))
    base = None
    for n in (60, 40, 25):
        best, bi = 1e9, None
        for i in range(0, len(v) - n, 2):
            w = v[i:i + n]
            if w.min() < -80 or w.max() > piso + 3:
                continue
            if w.max() < best:
                best, bi = float(w.max()), i
        if bi is not None:
            base = x[int(bi / 100 * SR):int((bi + n) / 100 * SR)].copy()
            break
    if base is None:  # no hay silencio limpio: aire en silencio digital
        base = np.zeros((int(0.3 * SR), 2), np.float32)
    f = int(0.008 * SR)
    r = np.linspace(0, 1, f, dtype=np.float32)[:, None]

    def tono(L):
        piezas, k = [], 0
        while sum(len(p) for p in piezas) < L:
            piezas.append(base if k % 2 == 0 else base[::-1])  # ida y vuelta: sin clics al empalmar
            k += 1
        y = np.concatenate(piezas)[:L].copy()
        if L > 2 * f:
            y[:f] *= r
            y[-f:] *= r[::-1]
        return y
    return tono


# ------------------------------------------------------------------ sonido: solo voz, sin sala en las pausas
def puerta_espectral(x, red_db=15.0, nstd=1.0, nfft=2048, hop=512):
    """Resta el ruido de sala por bandas: perfil de los cuadros más quietos (percentiles 3-15) y máscara suave.
    afftdn nr=15:nf=-45 bajó el piso 2 dB nada más (el ruido es de 50-800 Hz, no blanco): no sirve acá."""
    mid = x.mean(1)
    _, _, Z = stft(mid, SR, nperseg=nfft, noverlap=nfft - hop)
    db = 20 * np.log10(np.abs(Z) + 1e-10)
    e = db.mean(0)
    q = (e > np.percentile(e, 3)) & (e <= np.percentile(e, 15))
    mu = np.median(db[:, q], 1, keepdims=True)
    sd = 1.4826 * np.median(np.abs(db[:, q] - mu), 1, keepdims=True)
    m = 1 / (1 + np.exp(-(db - (mu + nstd * sd)) / 2.0))
    g = uniform_filter(m, size=(5, 7))
    g = g + (1 - g) * 10 ** (-red_db / 20)
    out = np.empty_like(x)
    for ch in range(x.shape[1]):
        _, _, Zc = stft(x[:, ch], SR, nperseg=nfft, noverlap=nfft - hop)
        _, y = istft(Zc * g, SR, nperseg=nfft, noverlap=nfft - hop)
        out[:, ch] = y[:len(x)] if len(y) >= len(x) else np.pad(y, (0, len(x) - len(y)))
    return out


def puerta_por_habla(x, h, rango, antes=0.05, despues=0.06, ataque=0.012, release=0.07):
    """Baja `rango` dB todo lo que NO es habla según la máscara del bruto (no según el nivel: después de normalizar,
    la sala de las pausas queda a −27 dBFS y una sílaba suave a −25, y un expansor por nivel no las separa — se
    probó con umbral −30, 1:3: el p1 bajaba pero las pausas seguían en −25/−33). Abre 50 ms antes de la voz."""
    k = np.asarray(h, bool)
    n10 = len(k)
    acum = np.concatenate([[0], np.cumsum(k)])
    i = np.arange(n10)
    lo = np.clip(i - int(despues * 100), 0, n10)
    hi = np.clip(i + int(antes * 100) + 1, 0, n10)
    obj = np.where(acum[hi] - acum[lo] > 0, 0.0, float(rango))  # abierta si hay voz en los próximos 50 ms o los últimos 60
    a_at, a_rel = math.exp(-1 / (ataque * 100)), math.exp(-1 / (release * 100))
    s = np.empty_like(obj)
    g = 0.0
    for i, v in enumerate(obj):
        a = a_rel if v > g else a_at
        g = a * g + (1 - a) * v
        s[i] = g
    n = len(x)
    gan = 10 ** (-np.interp(np.arange(n) / (SR / 100), np.arange(len(s)) + 0.5, s) / 20)
    return (x * gan[:, None]).astype(np.float32)


def audio_master(bruto, tl: LineaTiempo, an, work: Path):
    """Corte + aire → sin sala (puerta espectral) → compresión suave → −13 LUFS → limitador → puerta por habla.
    Él entrega solo voz, LRA 2,3-3,4 LU y el piso de las pausas en −41/−55 dBFS; sin cama ni dings."""
    x = leer_audio(bruto)
    corte = work / "voz-corte.wav"
    escribir_audio(corte, tl.audio(x, tono_de_sala(x, an["voz"])))
    hp = work / "voz-hp.wav"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(corte), "-af", "highpass=f=80", "-c:a", "pcm_f32le",
                    str(hp)], check=True)
    limpia = work / "voz-limpia.wav"
    escribir_audio(limpia, puerta_espectral(leer_audio(hp), R["ruido_db"]))
    # loudnorm de dos pasadas NO sirve: para subir ~6 dB sin pasarse de pico cae en modo dinámico y deja el LRA en
    # 2,0. Se hace a mano: ganancia lineal medida + limitador de picos.
    cadena = "acompressor=threshold=-28dB:ratio=2:attack=5:release=150:knee=6:makeup=2"
    gan = R["lufs"] - medir(limpia, cadena)["I"] + 0.6
    master = work / "voz-master.wav"
    lim = work / "voz-lim.wav"
    for _ in range(3):
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(limpia), "-af",
                        f"{cadena},volume={gan:.2f}dB,alimiter=limit=0.80:attack=3:release=60:level=false",
                        "-c:a", "pcm_f32le", str(lim)], check=True)
        escribir_audio(master, puerta_por_habla(leer_audio(lim), habla_salida(tl, an["voz"]), R["puerta_rango"]))
        dif = R["lufs"] - medir(master)["I"]
        if abs(dif) <= 0.2:
            break
        gan += dif
    return master


def medir(ruta, previo=None):
    af = (previo + "," if previo else "") + "ebur128=peak=true"
    r = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(ruta), "-vn", "-af", af, "-f", "null", "-"],
                       capture_output=True, text=True).stderr
    g = lambda k: float(re.findall(k + r":\s+(-?[\d.]+)", r)[-1])
    return {"I": g("I"), "LRA": g("LRA"), "TP": g("Peak")}


def pausas_audio(ruta):
    """Pausas reales de la voz terminada (no las del transcript): silencios entre la primera y la última palabra.
    Y el piso: percentil 1 del RMS en 50 ms (escala del QA = RMS − 3 dB)."""
    from scipy.ndimage import maximum_filter1d
    x = leer_audio(ruta)
    v10 = envolvente(x, 0.01)
    hab = maximum_filter1d(v10 > -36, 7)  # voz terminada: habla > −36 dBFS en 10 ms, 30 ms de colgado
    idx = np.nonzero(hab)[0]
    runs, ini = [], None
    for i in range(idx[0], idx[-1] + 1):
        if not hab[i] and ini is None:
            ini = i
        elif hab[i] and ini is not None:
            runs.append((ini / 100, (i - ini) / 100)); ini = None
    p1 = float(np.percentile(envolvente(x, 0.05), 1)) - 3.01
    return runs, p1


# ------------------------------------------------------------------ cámara: encuadre por toma
class Camara:
    """Normaliza cada toma (cara al mismo ancho y en la misma x) y la ubica por layout: ojos al 67,5 % en el split y
    al 47 % en cara completa. Entre layouts solo traslada (escala 1,00, como Sonnet)."""

    def __init__(self, an, tl: LineaTiempo, m):
        self.tomas = an["tomas"]
        self.X = an["ref_x"]
        self.Ys = R["ojos_split"] * H
        full = set()
        for i in range(0, int(tl.total * FPS), 3):
            t = i / FPS
            if m.escenas[m.escena(t)].layout == "full":
                full.add(self.toma(tl.fuente(t)[0]))
        self.c, self.Yf = [], []
        for i, T in enumerate(self.tomas):
            c = R["escala_base"] * an["ref_w"] / T["w"]
            # el borde que la normalización deja adentro se cubre con escala (no con relleno)
            nx = max((self.X - R["relleno_max"]) / T["ex"], (W - self.X - R["relleno_max"]) / (W - T["ex"]))
            c = max(c, min(nx, R["escala_max"]))
            yf = R["ojos_full"] * H
            if i in full:
                c = max(c, min((H - R["relleno_max"] - yf) / (H - T["ey"]), R["escala_max"]))
                yf = max(yf, H - R["relleno_max"] - c * (H - T["ey"]))
            self.c.append(c)
            self.Yf.append(yf)
        self.full = full

    def toma(self, tb):
        for i, T in enumerate(self.tomas):
            if tb < T["t1"] - 1e-6:
                return i
        return len(self.tomas) - 1

    def imagen(self, src, tb, Y, z=1.0):
        i = self.toma(tb)
        T, c = self.tomas[i], self.c[i] * z
        M = np.float32([[c, 0, self.X - c * T["ex"]], [0, c, Y - c * T["ey"]]])
        return cv2.warpAffine(src, M, (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT_101)

    def ventana(self, src, tb):
        p = R["pip"]
        T = self.tomas[self.toma(tb)]
        s = p["cara"] * p["w"] / T["w"]
        chico = cv2.resize(src, None, fx=s, fy=s, interpolation=cv2.INTER_AREA)
        M = np.float32([[1, 0, p["w"] / 2 - s * T["ex"]], [0, 1, p["ojos"] * p["h"] - s * T["ey"]]])
        return cv2.warpAffine(chico, M, (p["w"], p["h"]), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT_101)


@lru_cache(None)
def marco_pip():
    """Máscara redondeada y marco (borde + sombra) de la ventana de persona reducida."""
    p = R["pip"]
    m = Image.new("L", (p["w"], p["h"]), 0)
    ImageDraw.Draw(m).rounded_rectangle((0, 0, p["w"] - 1, p["h"] - 1), 28, fill=255)
    pad = 30
    marco = Image.new("RGBA", (p["w"] + 2 * pad, p["h"] + 2 * pad), (0, 0, 0, 0))
    sh = Image.new("L", marco.size, 0)
    ImageDraw.Draw(sh).rounded_rectangle((pad, pad + 10, pad + p["w"], pad + p["h"] + 10), 28, fill=110)
    marco.putalpha(sh.filter(ImageFilter.GaussianBlur(14)))
    borde = Image.new("RGBA", marco.size, (0, 0, 0, 0))
    ImageDraw.Draw(borde).rounded_rectangle((pad - 3, pad - 3, pad + p["w"] + 2, pad + p["h"] + 2), 31,
                                            outline=color("tinta"), width=6)
    return np.asarray(m, np.float32)[..., None] / 255.0, np.asarray(marco), np.asarray(borde), pad


# ------------------------------------------------------------------ compositor
def pegar(out, rgba, x, y):
    h, w = rgba.shape[:2]
    x0, y0 = max(0, x), max(0, y)
    x1, y1 = min(out.shape[1], x + w), min(out.shape[0], y + h)
    if x1 <= x0 or y1 <= y0:
        return
    src = rgba[y0 - y:y1 - y, x0 - x:x1 - x]
    a = src[..., 3:4].astype(np.float32) / 255.0
    reg = out[y0:y1, x0:x1].astype(np.float32)
    out[y0:y1, x0:x1] = (reg * (1 - a) + src[..., :3].astype(np.float32) * a + 0.5).astype(np.uint8)


def overlay_full(out, arr):
    a = arr[..., 3]
    ys, xs = np.nonzero(a[::8, ::8])
    if len(ys) == 0:
        return
    y0, y1 = max(0, ys.min() * 8 - 8), min(H, ys.max() * 8 + 16)
    x0, x1 = max(0, xs.min() * 8 - 8), min(W, xs.max() * 8 + 16)
    pegar(out, arr[y0:y1, x0:x1], x0, y0)


class Compositor:
    def __init__(self, m: Montaje, subs: Subtitulos, cam: Camara):
        self.m, self.subs, self.cam = m, subs, cam

    def camara(self, src, t, tb, Y):
        return self.cam.imagen(src, tb, Y, self.m.escala(t))

    def y_full(self, tb):
        return self.cam.Yf[self.cam.toma(tb)]

    def plano(self, esc: Escena, t, src, tb):
        if esc.layout in ("lamina", "pip"):
            out = np.ascontiguousarray(esc.lienzo(t)[..., :3])
            if esc.layout == "pip":
                p = R["pip"]
                mask, sombra, borde, pad = marco_pip()
                out = out.copy()
                pegar(out, sombra, p["x"] - pad, p["y"] - pad)
                reg = out[p["y"]:p["y"] + p["h"], p["x"]:p["x"] + p["w"]].astype(np.float32)
                vid = self.cam.ventana(src, tb).astype(np.float32)
                out[p["y"]:p["y"] + p["h"], p["x"]:p["x"] + p["w"]] = (reg * (1 - mask) + vid * mask + 0.5).astype(np.uint8)
                pegar(out, borde, p["x"] - pad, p["y"] - pad)
            return out
        if esc.layout == "split":
            out = self.camara(src, t, tb, self.cam.Ys)
            out[:R["costura"]] = esc.lienzo(t)[..., :3]
            return out
        out = self.camara(src, t, tb, self.y_full(tb))
        overlay_full(out, esc.lienzo(t))
        return out

    def mover(self, panel_esc, full_esc, e, t, src, tb):
        """e=1 → split completo; e=0 → cara completa. La cámara se traslada sin reescalar y tapa/destapa el panel."""
        Yf = self.y_full(tb)
        wtop = int(round(R["costura"] * e))
        out = self.camara(src, t, tb, Yf + (self.cam.Ys - Yf) * e)
        if wtop > 0:
            out[:wtop] = panel_esc.lienzo(t)[:wtop, :, :3]
        overlay_full(out, full_esc.lienzo(t))
        return out

    def cuadro(self, t, src, tb):
        m = self.m
        i = m.escena(t)
        cur = m.escenas[i]
        prev = m.escenas[i - 1] if i else None
        dt = t - cur.t0
        ent = cur.entrada
        dur = {"fundido": R["fundido"], "barrido": R["barrido"], "sube": R["sube"], "baja": R["baja"]}.get(ent, 0)
        sub_y = R["sub_y"][cur.layout]
        if prev is not None and dt < dur - 1e-6:
            p = (dt + 1 / FPS) / dur
            if ent in ("sube", "baja"):  # el subtítulo acompaña a la cámara (no flota sobre la cara a mitad de camino)
                e = 1 - ease(p) if ent == "sube" else ease(p)
                sub_y = R["sub_y"]["full"] + (R["sub_y"]["split"] - R["sub_y"]["full"]) * e
            if ent == "fundido":
                a = self.plano(prev, t, src, tb).astype(np.float32)
                b = self.plano(cur, t, src, tb).astype(np.float32)
                out = (a * (1 - ease(p)) + b * ease(p) + 0.5).astype(np.uint8)
            elif ent == "barrido":
                out = self.plano(prev, t, src, tb)
                b = self.plano(cur, t, src, tb)
                X = int(W * (1 - ease(p)))
                out[:, X:] = b[:, X:]
                out[:, max(0, X - 3):X + 3] = color("verde")[:3]
            elif ent == "sube":
                out = self.mover(prev, cur, 1 - ease(p), t, src, tb)
            else:  # baja
                out = self.mover(cur, prev, ease(p), t, src, tb)
        else:
            out = self.plano(cur, t, src, tb)
        sub = self.subs.imagen(t)
        if sub is not None:
            y = int(round(sub_y)) - sub.shape[0] // 2
            pegar(out, sub, (W - sub.shape[1]) // 2, y)
        return out


# ------------------------------------------------------------------ informe contra la receta
def informe(m: Montaje, words, tl: LineaTiempo, subs: Subtitulos, cam: Camara, plan):
    total = tl.total
    print("\n— control contra la receta —")
    print(f"  duración {total:.2f} s (receta 65-120 con persona; antes {plan['total_viejo']:.2f})")
    dur = {"split": 0.0, "full": 0.0, "pip": 0.0, "lamina": 0.0}
    for e in m.escenas:
        dur[e.layout] += min(e.t1, total) - e.t0
    print("  reparto:", " · ".join(f"{k} {v / total * 100:.0f} %" for k, v in dur.items()),
          "(pip = persona reducida)")
    sin_cara, ini = 0.0, None
    for e in m.escenas + [None]:
        if e is not None and e.layout == "lamina":
            ini = e.t0 if ini is None else ini
        elif ini is not None:
            sin_cara = max(sin_cara, (e.t0 if e else total) - ini); ini = None
    print(f"  tramo sin cara más largo: {sin_cara:.1f} s (referentes ≤10; Sonnet ≤1,25)")
    cambios = sum(1 for a, b in zip(m.escenas, m.escenas[1:]) if a.layout != b.layout)
    print(f"  cambios de layout: {cambios} ({cambios / total * 10:.2f} por 10 s; receta 0,75-2,1)")
    yf = sorted({round(cam.Yf[i] / H * 100, 1) for i in cam.full})
    print(f"  ojos: split {cam.Ys / H * 100:.1f} % · cara completa {yf} % (Sonnet 67,1 / 49,2; QA 46-47) · "
          f"paso split→cara {[round(cam.Ys - cam.Yf[i]) for i in sorted(cam.full)]} px (318-600)")
    print("  escala por toma:", " · ".join(f"{T['t0']:.1f}s ×{c:.3f}" for T, c in zip(cam.tomas, cam.c)))
    visibles, ventana = [], []
    for c, tipo in tl.cortes:
        e = m.escenas[m.escena(c + 1e-3)]
        if e.layout == "lamina":
            continue
        tapado = (any(abs(x.t0 - c) < 0.06 for x in m.escenas)
                  or any(abs(z0 - c) < 0.06 or (z == "punch" and abs(z1 - c) < 0.06) for z, z0, z1, _ in m.zooms))
        if not tapado:
            (ventana if e.layout == "pip" else visibles).append(f"{c:.2f}({tipo})")
    print(f"  cortes y saltos: {len(tl.cortes)}; a la vista (sin cambio de panel/layout/punch): {visibles or 'ninguno'}"
          + (f"; en la ventana reducida: {ventana}" if ventana else ""))
    marcas = sorted({round(e.t0, 2) for e in m.escenas} |
                    {round(c, 2) for c, _ in tl.cortes if m.escenas[m.escena(c + 1e-3)].layout != "lamina"})
    huecos = [b - a for a, b in zip(marcas, marcas[1:] + [total])]
    print(f"  algo cambia cada {sum(huecos) / len(huecos):.1f} s de media (máx {max(huecos):.1f}; receta 3-5)")
    piezas = sorted({(d.split(":")[0], round(t / 0.1)) for t, d in m.disparos if not re.search(r"zoom|credito|flecha", d)})
    print(f"  elementos gráficos nuevos: {len(piezas)} ({len(piezas) / total * 10:.1f} por 10 s; receta ≈6-9)")
    zz = [z[0] for z in m.zooms]
    print(f"  acentos de zoom: {len(zz)} ({', '.join(zz)}); receta 1-3")
    gaps = [words[i + 1]["start"] - words[i]["end"] for i in range(len(words) - 1)]
    print(f"  pausas según Whisper (orientativo: sus finales de palabra se corren hasta 0,4 s): {sum(1 for g in gaps if 0.18 <= g <= 0.5)} de 0,18-0,5 s · "
          f"{sum(1 for g in gaps if 0.5 < g <= 0.6)} de 0,5-0,6 · más de 0,6: "
          f"{[(round(words[i]['end'], 2), round(g, 2)) for i, g in enumerate(gaps) if g > 0.6] or 'ninguna'}")
    aire = sum(d for _, d in plan["hechos"])
    print(f"  aire: +{aire:.2f} s en {len(plan['hechos'])} uniones "
          f"({sum(1 for j, _ in plan['hechos'] if j['lugar'] == 'corte')} sobre el silencio del corte, el resto estirado)"
          f" · recortes {[(j['w'], round(d, 2)) for j, d in plan['recortes']]}"
          + (f" · faltan {plan['falta']:.2f} s" if plan["falta"] > 0.05 else ""))
    if plan["largas"]:
        print(f"  ⚠ pausas > {R['pausa_max']} s dentro de una toma (necesitan un corte): {[j['w'] for j in plan['largas']]}")
    runs = pausas_plan(tl, plan["voz"])
    ds = [d for _, d in runs]
    print(f"  pausas reales (habla del bruto en la salida nueva): {sum(1 for d in ds if 0.18 <= d <= 0.5)} de 0,18-0,5 s"
          f" · {sum(1 for d in ds if 0.5 < d <= 0.6)} de 0,5-0,6 · más de 0,6: "
          f"{[(round(t, 2), round(d, 2)) for t, d in runs if d > 0.6] or 'ninguna'} (receta 16-33, ≤0,6)")
    hab = words[-1]["end"] - words[0]["start"]
    print(f"  palabras/s: {len(words) / total:.2f} sobre la duración (método QA) · {len(words) / hab:.2f} sobre el habla "
          f"(receta 2,65-3,2)")
    print(f"  primera palabra {words[0]['start']:.2f} s · primer subtítulo {subs.bloques[0][0]:.2f} s (≤0,3) · "
          f"cola tras la última palabra {total - words[-1]['end']:.2f} s (0,3-0,65)")
    pr = [t for t, d in m.disparos if "captura" in d or "clip" in d]
    print(f"  prueba en pantalla a {min(pr):.2f} s (≤0,9)" if pr else "  ⚠ sin prueba en pantalla")


def hoja(video, carpeta: Path):
    carpeta.mkdir(parents=True, exist_ok=True)
    for v in carpeta.glob("sheet-*.jpg"):
        v.unlink()
    fnt = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(video), "-vf",
                    # 2 fps EXACTOS (cuadro n·15): fps=2 a secas toma el último cuadro de cada medio segundo y
                    # rotula 32,5 lo que pasa a 32,73 — una transición «adelantada» que no existe.
                    f"select='not(mod(n\\,15))',setpts=N/2/TB,scale=216:-2,"
                    f"drawtext=fontfile={fnt}:text='%{{pts\\:hms}}':x=6:y=6:fontsize=15:"
                    "fontcolor=yellow:box=1:boxcolor=black@0.55:boxborderw=3,tile=5x4",
                    "-fps_mode", "vfr", "-q:v", "3", str(carpeta / "sheet-%02d.jpg")], check=True)


# ------------------------------------------------------------------ main
class Fuente:
    """Cuadros del bruto en orden (decodifica una sola vez); un cuadro intermedio se funde de sus dos vecinos."""

    def __init__(self, bruto):
        self.p = subprocess.Popen(["ffmpeg", "-v", "error", "-i", str(bruto), "-vf",
                                   "scale=in_color_matrix=bt709:in_range=full:out_range=full,format=rgb24",
                                   "-f", "rawvideo", "-"], stdout=subprocess.PIPE)
        self.idx, self.buf = -1, {}

    def cuadro(self, k):
        while self.idx < k:
            b = self.p.stdout.read(W * H * 3)
            if len(b) < W * H * 3:
                break
            self.idx += 1
            self.buf[self.idx] = np.frombuffer(b, np.uint8).reshape(H, W, 3)
            for v in [v for v in self.buf if v < self.idx - 3]:
                del self.buf[v]
        return self.buf.get(min(k, self.idx), self.buf[max(self.buf)])

    def en(self, tb, estirado):
        f = tb * FPS
        if not estirado:
            return self.cuadro(int(round(f)))
        k = int(math.floor(f))
        fr = f - k
        a = self.cuadro(k)
        if fr < 0.1:
            return a
        b = self.cuadro(k + 1)
        return a if fr < 0.1 else b if fr > 0.9 else (a * (1 - fr) + b * fr + 0.5).astype(np.uint8)

    def cerrar(self):
        self.p.stdout.close()
        self.p.wait()


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("--bruto", required=True)
    ap.add_argument("--cutplan", required=True)
    ap.add_argument("--transcript", required=True, help="words en tiempo de SALIDA (segments-cut.json)")
    ap.add_argument("--storyboard", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--assets", help="carpeta de capturas/logos (default: assets del storyboard)")
    ap.add_argument("--hojas", help="carpeta para la hoja de control (default: <out>/../sheets)")
    ap.add_argument("--fotos", help="solo renderizar estos segundos a PNG, ej. 0.5,12,30")
    ap.add_argument("--solo-hoja", action="store_true", help="rehace la hoja de control de --out sin renderizar")
    ap.add_argument("--plan", action="store_true", help="solo imprime la línea de tiempo y el control contra la receta")
    ap.add_argument("--sin-aire", action="store_true", help="no abre las uniones de frase (deja el ritmo del corte)")
    ap.add_argument("--crf", default="16")
    a = ap.parse_args()

    if a.solo_hoja:
        hoja(Path(a.out), Path(a.hojas) if a.hojas else Path(a.out).parent / "sheets")
        return
    sb_path = Path(a.storyboard).resolve()
    sb = json.loads(sb_path.read_text())
    for k, v in sb.get("camara", {}).items():  # el storyboard puede pisar la cámara de la receta
        if k in R:
            R[k] = v
    assets = Path(a.assets).resolve() if a.assets else (sb_path.parent / sb.get("assets", "assets-ejemplo")).resolve()
    out = Path(a.out).resolve()
    work = out.parent / "work"
    work.mkdir(parents=True, exist_ok=True)

    keeps = [(k["start"], k["end"]) for k in json.loads(Path(a.cutplan).read_text())["keep"]]
    _, total_viejo = mapa_tiempo(keeps)
    tr = json.loads(Path(a.transcript).read_text())
    words = [w for w in tr["words"] if w["word"].strip()]
    if words[-1]["end"] > total_viejo + 0.05:
        sys.exit(f"santiago: el transcript termina en {words[-1]['end']} y el corte dura {total_viejo:.2f}: "
                 "¿está en tiempo de salida?")

    capjson = assets / "capturas.json"
    falta = [c["id"] for c in sb.get("capturas", []) if not (assets / f"{c['id']}.png").exists()]
    falta += [l["id"] for l in sb.get("logos_svg", []) if not (assets / f"{l['id']}.png").exists()]
    if falta or (sb.get("capturas") and not capjson.exists()):
        print("capturas que faltan:", falta)
        subprocess.run(["node", str(AQUI / "capturar.mjs"), str(sb_path), str(assets)], check=True)
    capmeta = json.loads(capjson.read_text()) if capjson.exists() else {}

    an = analizar_bruto(a.bruto, work)
    # el storyboard en el tiempo del corte original dice qué se ve en cada unión (lámina, ventana, cara)
    viejo, _ = mapa_tiempo(keeps)
    cortes_viejos = sorted([s[1] for s in viejo[:-1]] +
                           [o0 + s - k0 for o0, o1, k0 in viejo for s in an["saltos"] if k0 < s < k0 + (o1 - o0)])
    pre = Montaje(sb, Linea(words, cortes_viejos, total_viejo, avisar=False), assets, capmeta)
    tl, words, plan = planear_aire(keeps, words, an, activo=not a.sin_aire,
                                   layout_de=lambda t: pre.escenas[pre.escena(t)].layout)
    (work / "transcript-salida.json").write_text(json.dumps({"words": words}, ensure_ascii=False, indent=1))
    L = Linea(words, [c for c, _ in tl.cortes], tl.total)
    m = Montaje(sb, L, assets, capmeta)
    cam = Camara(an, tl, m)
    subs = Subtitulos(words)
    comp = Compositor(m, subs, cam)
    total = tl.total
    print(f"escenas: {len(m.escenas)} · bloques de subtítulo: {len(subs.bloques)} · duración {total:.2f} s")
    for e in m.escenas:
        print(f"  {e.t0:6.2f}  {e.layout:6s} {e.entrada:8s} {e.id}  ({len(e.els)} elementos)")
    informe(m, words, tl, subs, cam, plan)
    if a.plan:
        print("\n— aire —")
        for j, d in sorted(plan["hechos"], key=lambda x: x[0]["i"]):
            print(f"  «{j['w']}» +{d:.2f} s ({j['lugar']}, pausa real {j['g']:.2f})")
        print("\n— disparos —")
        for t, d in sorted(m.disparos):
            print(f"  {t:6.2f}  {d}")
        return

    n = int(math.ceil(total * FPS - 1e-6))
    if a.fotos:
        fotos = out.parent / "fotos"
        fotos.mkdir(exist_ok=True)
        for t in sorted(float(x) for x in a.fotos.split(",")):
            tb, _ = tl.fuente(t)
            raw = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{tb:.3f}", "-i", a.bruto, "-frames:v", "1", "-vf",
                                  "scale=in_color_matrix=bt709:in_range=full:out_range=full,format=rgb24",
                                  "-f", "rawvideo", "-"], capture_output=True, check=True).stdout
            src = np.frombuffer(raw, np.uint8).reshape(H, W, 3)
            Image.fromarray(comp.cuadro(t, src, tb)).save(fotos / f"t{t:06.2f}.png")
        print("fotos en", fotos)
        return

    master = audio_master(a.bruto, tl, an, work)
    print("voz:", medir(master))
    enc = ["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS),
           "-i", "-", "-i", str(master), "-map", "0:v", "-map", "1:a",
           "-vf", "scale=out_color_matrix=bt709:out_range=tv,format=yuv420p",
           "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", "-color_range", "tv",
           "-c:v", "libx264", "-preset", "medium", "-crf", a.crf, "-profile:v", "high",
           "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-t", f"{n / FPS:.3f}", "-movflags", "+faststart", str(out)]
    fu = Fuente(a.bruto)
    pe = subprocess.Popen(enc, stdin=subprocess.PIPE)
    t_ini = time.time()
    for i in range(n):
        t = i / FPS
        tb, estirado = tl.fuente(t)
        pe.stdin.write(comp.cuadro(t, fu.en(tb, estirado), tb).tobytes())
        if i % 300 == 0:
            print(f"  cuadro {i}/{n}  {time.time() - t_ini:.0f} s", flush=True)
    pe.stdin.close()
    pe.wait()
    fu.cerrar()
    fin = medir(out)
    runs, p1 = pausas_audio(out)
    largos = [d for _, d in runs]
    print("final:", fin, "(receta: −13 ±0,5 LUFS · LRA 2,3-3,4 · TP ≤ −1)")
    print(f"pausas reales: {sum(1 for d in largos if 0.18 <= d <= 0.5)} de 0,18-0,5 s · "
          f"{sum(1 for d in largos if 0.5 < d <= 0.6)} de 0,5-0,6 · máx {max(largos):.2f} s (receta 16-33, ≤0,6) · "
          f"piso p1 {p1:.1f} dBFS (escala QA; receta −41/−55)")
    hoja(out, Path(a.hojas) if a.hojas else out.parent / "sheets")
    print("OK ->", out)


if __name__ == "__main__":
    main()
