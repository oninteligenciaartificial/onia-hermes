#!/usr/bin/env python3
"""Vendoriza Inter (variable, subset latin) para el patron apple-editorial.

Por que existe: `hermes-content/brand/fonts/README.md` fija la regla de la casa —
**nada de Google Fonts en tiempo de render**. Los generadores de marca personal la
incumplian con `@import url('https://fonts.googleapis.com/...')`: Chrome dispara la
captura antes de que llegue la webfont y TODO caia al fallback del sistema. Medido el
2026-09-06: los PNG de las dos variantes tipograficas salieron byte-identicos (mismo
md5) y los anchos de texto diferian 4px, que es ruido de render.

Se construye desde el TTF variable upstream de google/fonts y no desde el CSS de
Google, por la misma razon que documenta `brand/fonts/build-onia-fonts.py`: ese CSS
sirve los ejes recortados con el default puesto en el maximo.

No toca el trio de marca (Bricolage / DM Sans / Spline Sans Mono) ni su script: Inter
es candidata de UN patron, no una decision de marca. Esa la toma Sergio Urcullo.

Uso:  python hermes-content/references/ui-patterns/apple-editorial/build-inter.py
Requiere: fonttools[woff] (brotli). Corre local, costo cero.
"""
import pathlib
import urllib.request

from fontTools import subset
from fontTools.ttLib import TTFont

HERE = pathlib.Path(__file__).resolve().parent
DEST = HERE / "fonts"
UPSTREAM = HERE / ".upstream"

# Mismo rango latin que brand/fonts/build-onia-fonts.py: cubre el espanol completo.
LATIN = (
    "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,"
    "U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,"
    "U+2212,U+2215,U+FEFF,U+FFFD"
)

# nombre local -> (TTF variable/estatico upstream, OFL)
FAMILIAS = {
    "Inter-var-latin": (
        "https://raw.githubusercontent.com/google/fonts/main/ofl/inter/Inter%5Bopsz,wght%5D.ttf",
        "https://raw.githubusercontent.com/google/fonts/main/ofl/inter/OFL.txt",
    ),
    # Serif del layout C: alto contraste y aire editorial, como la referencia #3 del batch
    # (fondo crema + serif). El trio de marca no tiene ninguna serif, asi que se vendoriza
    # aca — es tipografia de UN patron, no una decision de marca.
    "InstrumentSerif-latin": (
        "https://raw.githubusercontent.com/google/fonts/main/ofl/instrumentserif/InstrumentSerif-Regular.ttf",
        "https://raw.githubusercontent.com/google/fonts/main/ofl/instrumentserif/OFL.txt",
    ),
}


def _construir(nombre, ttf_url, ofl_url):
    crudo = UPSTREAM / f"{nombre}.ttf"
    if not crudo.exists():
        print(f"bajando {ttf_url}")
        urllib.request.urlretrieve(ttf_url, crudo)

    ofl = DEST / f"OFL-{nombre.split('-')[0]}.txt"
    if not ofl.exists():
        urllib.request.urlretrieve(ofl_url, ofl)

    fuente = TTFont(crudo)
    opciones = subset.Options()
    opciones.flavor = "woff2"
    opciones.layout_features = ["*"]
    # Los ejes viajan vivos: el patron pide opsz alto (optica Display) y wght 400..800.
    opciones.retain_gids = False
    subsetter = subset.Subsetter(options=opciones)
    subsetter.populate(unicodes=subset.parse_unicodes(LATIN))
    subsetter.subset(fuente)
    salida = DEST / f"{nombre}.woff2"
    fuente.flavor = "woff2"
    fuente.save(salida)
    print(f"  {salida.name}  {salida.stat().st_size // 1024} KB")


def main():
    DEST.mkdir(parents=True, exist_ok=True)
    UPSTREAM.mkdir(parents=True, exist_ok=True)
    for nombre, (ttf, ofl) in FAMILIAS.items():
        _construir(nombre, ttf, ofl)
    print(f"OK -> {DEST}")


if __name__ == "__main__":
    main()
