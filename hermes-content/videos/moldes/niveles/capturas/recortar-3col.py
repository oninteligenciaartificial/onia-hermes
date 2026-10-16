#!/usr/bin/env python3
"""Recorta la captura real de la tabla de precios a las 3 primeras columnas (Model · Input · Output).
Las columnas de caché quedan fuera porque el propio sitio las corta con su scroll horizontal; no se retoca ni un píxel de lo que queda.
Uso: python3 recortar-3col.py   (lee precios-tabla.png de esta carpeta, escribe precios-tabla-3col.png)"""
from pathlib import Path
from PIL import Image
aqui = Path(__file__).resolve().parent
im = Image.open(aqui / "precios-tabla.png")
im.crop((0, 0, 884, im.size[1])).save(aqui / "precios-tabla-3col.png")
print("ok", im.size, "->", (884, im.size[1]))
