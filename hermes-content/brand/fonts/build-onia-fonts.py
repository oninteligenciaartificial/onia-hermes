#!/usr/bin/env python3
"""Construye las fuentes de marca ONIA autohospedadas (determinismo de render).

Por que existe este script en vez de bajar los .woff2 de Google y listo:
el CSS de Google Fonts sirve archivos con los ejes RECORTADOS y el default
puesto en el maximo — para Bricolage Grotesque devolvia un archivo cuyo
`wght` default era **800**, justo el corte que el brand system prohibe
(`ONIA_BRAND_IDENTITY_2026.md` §2). Construyendo desde el TTF variable
upstream de google/fonts controlamos exactamente que ejes viajan.

Que produce (todo en esta misma carpeta):
  · BricolageGrotesque-var-latin.woff2  display  — wdth fijado a 100, wght 500..700 (default 600), opsz vivo
  · DMSans-var-latin.woff2              cuerpo   — wght 400..500 (default 400), opsz vivo
  · SplineSansMono-var-latin.woff2      cifras   — wght 400..500 (default 400)
  · BricolageGrotesque-Bold.ttf         libass   — instancia ESTATICA 700 (ffmpeg/libass no lee woff2
                                                   ni sabe elegir instancia de un variable)

El peso 800 y los cortes ultra-condensed quedan estructuralmente imposibles:
no existen en los archivos que se versionan.

Uso:  python build-onia-fonts.py
Requiere: fonttools[woff] (brotli). Corre local, costo cero.
"""

import hashlib
import pathlib
import urllib.request

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

HERE = pathlib.Path(__file__).resolve().parent
UPSTREAM = HERE / ".upstream"  # TTFs variables originales (no se versionan)

# Rango unicode "latin" de Google Fonts. Cubre el espanol completo
# (acentos, enie, apertura de interrogacion/exclamacion) mas comillas,
# guiones largos y puntos suspensivos tipograficos.
LATIN = (
    "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,"
    "U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,"
    "U+2212,U+2215,U+FEFF,U+FFFD"
)

SOURCES = {
    "Bricolage-var.ttf": "https://raw.githubusercontent.com/google/fonts/main/ofl/bricolagegrotesque/BricolageGrotesque%5Bopsz,wdth,wght%5D.ttf",
    "DMSans-var.ttf": "https://raw.githubusercontent.com/google/fonts/main/ofl/dmsans/DMSans%5Bopsz,wght%5D.ttf",
    "SplineSansMono-var.ttf": "https://raw.githubusercontent.com/google/fonts/main/ofl/splinesansmono/SplineSansMono%5Bwght%5D.ttf",
}


def fetch():
    UPSTREAM.mkdir(exist_ok=True)
    for name, url in SOURCES.items():
        dst = UPSTREAM / name
        if not dst.exists():
            print(f"  bajando {name}")
            urllib.request.urlretrieve(url, dst)
    return {n: UPSTREAM / n for n in SOURCES}


def _materialize_gvar(font):
    """Vuelve `gvar.variations` un dict comun con entrada para CADA glifo.

    El subsetter de fontTools indexa `variations[glifo]` para todo glifo que
    retiene, pero el dict perezoso que deja el instancer solo tiene clave para
    los glifos CON variaciones propias -> KeyError ('uni2000', 'uni2003', ...).
    """
    if "gvar" not in font:
        return
    gvar = font["gvar"]
    variations = dict(gvar.variations)
    for glyph in font.getGlyphOrder():
        variations.setdefault(glyph, [])
    gvar.variations = variations


def _rename(font, family, subfamily):
    """Reescribe los registros de nombre a la familia real.

    Al recortar ejes, fontTools deja el nombre de la instancia upstream
    ('Bricolage Grotesque 96pt ExtraBold') — enganoso, porque justamente el
    corte ExtraBold ya no existe en el archivo.
    """
    full, ps = f"{family} {subfamily}", f"{family.replace(' ', '')}-{subfamily}"
    for rec in list(font["name"].names):
        value = {1: family, 16: family, 2: subfamily, 17: subfamily, 4: full, 6: ps}.get(rec.nameID)
        if value is not None:
            font["name"].setName(value, rec.nameID, rec.platformID, rec.platEncID, rec.langID)


def build_woff2(src, out, axis_limits, family):
    """Recorta ejes, deja solo latin y comprime a woff2."""
    font = instancer.instantiateVariableFont(
        TTFont(src, lazy=False), axis_limits, updateFontNames=False
    )
    _materialize_gvar(font)
    _rename(font, family, "Regular")
    opts = subset.Options()
    opts.layout_features = ["*"]
    opts.name_IDs = ["*"]
    opts.notdef_outline = True
    opts.recalc_bounds = True
    sub = subset.Subsetter(options=opts)
    sub.populate(unicodes=subset.parse_unicodes(LATIN))
    sub.subset(font)
    font.flavor = "woff2"
    font.save(out)
    return out


def build_static_ttf(src, out, axis_pins, family, subfamily):
    """Instancia ESTATICA para libass, con nombres y bits de peso correctos.

    libass casa el `Fontname` del ASS contra el nombre de familia, y si no
    encuentra una cara bold la emborrona sinteticamente. Marcando la cara
    como Bold de verdad (usWeightClass 700 + fsSelection + macStyle) el
    subtitulo usa el dibujo real del peso 700, sin engorde sintetico.
    """
    font = instancer.instantiateVariableFont(TTFont(src), axis_pins, updateFontNames=False)
    _rename(font, family, subfamily)
    font["OS/2"].usWeightClass = 700
    font["OS/2"].fsSelection = (font["OS/2"].fsSelection & ~0b1000001) | 0b100000  # BOLD, sin REGULAR
    font["head"].macStyle |= 0b1
    font.save(out)
    return out


# --- reparto a las composiciones -------------------------------------------
# HyperFrames sirve cada composicion con SU carpeta como raiz y rechaza por
# lint cualquier asset referenciado con "../" por encima de esa raiz
# (invalid_parent_traversal_in_asset_path). O sea que no se puede apuntar a
# esta carpeta canonica: cada composicion necesita los .woff2 adentro. Repartir
# desde aca (y no copiar a mano) es lo que garantiza que las copias no deriven:
# se reconstruye con `python build-onia-fonts.py` y quedan todas iguales.
COMPOSITIONS = HERE.parents[2] / "scripts" / "hyperframes" / "compositions"
ROLE_FILES = {
    "display": ("BricolageGrotesque-var-latin.woff2", "OFL-BricolageGrotesque.txt"),
    "body": ("DMSans-var-latin.woff2", "OFL-DMSans.txt"),
    "mono": ("SplineSansMono-var-latin.woff2", "OFL-SplineSansMono.txt"),
}
# Solo los roles que cada composicion USA de verdad (no cargar peso muerto).
NEEDS = {
    "stat": ("display", "body", "mono"),      # cifra en mono
    "browser": ("display", "body", "mono"),   # la URL va en mono
    "phone": ("display", "body"),
    "quote": ("display", "body"),
    "lower-third": ("display", "body"),
}


def distribute():
    for slug, roles in NEEDS.items():
        dest = COMPOSITIONS / slug / "fonts"
        if not dest.parent.is_dir():
            print(f"  AVISO: no existe la composicion {slug}, la salteo")
            continue
        dest.mkdir(exist_ok=True)
        for role in roles:
            for name in ROLE_FILES[role]:
                dest.joinpath(name).write_bytes((HERE / name).read_bytes())
        print(f"  {slug}/fonts <- {', '.join(roles)}")


def main():
    src = fetch()
    built = []

    # Display — wdth FIJO en 100 (prohibido ultra-condensed), wght tope 700
    # (prohibido el 800), opsz vivo para que el tamano optico siga al font-size.
    built.append(build_woff2(
        src["Bricolage-var.ttf"], HERE / "BricolageGrotesque-var-latin.woff2",
        {"wdth": 100, "wght": (500, 600, 700), "opsz": (12, 12, 96)}, "Bricolage Grotesque",
    ))
    built.append(build_woff2(
        src["DMSans-var.ttf"], HERE / "DMSans-var-latin.woff2",
        {"wght": (400, 400, 500), "opsz": (9, 9, 40)}, "DM Sans",
    ))
    built.append(build_woff2(
        src["SplineSansMono-var.ttf"], HERE / "SplineSansMono-var-latin.woff2",
        {"wght": (400, 400, 500)}, "Spline Sans Mono",
    ))
    # Subtitulos quemados: opsz al maximo porque el texto se ve enorme en vertical.
    built.append(build_static_ttf(
        src["Bricolage-var.ttf"], HERE / "BricolageGrotesque-Bold.ttf",
        {"wdth": 100, "wght": 700, "opsz": 96}, "Bricolage Grotesque", "Bold",
    ))

    print("\n  archivo                                    bytes  sha256(12)")
    for p in built:
        data = p.read_bytes()
        print(f"  {p.name:<40} {len(data):>7}  {hashlib.sha256(data).hexdigest()[:12]}")

    print("\n  reparto a composiciones:")
    distribute()


if __name__ == "__main__":
    main()
