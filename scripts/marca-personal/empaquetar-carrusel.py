#!/usr/bin/env python3
"""Arma el ZIP y la hoja de contacto de una pieza YA RENDIDA, desde sus PNG.

Por que existe (10-sep): el ZIP es la superficie que Sergio Urcullo abre para
publicar, y se armaba a mano. Al recortar "Mi stack" de 11 laminas a 5, el
`1-MI-STACK-para-publicar.zip` quedo con las 11 viejas adentro — o sea, el
archivo que se usa para publicar contradecia a la pieza y a todos los docs, sin
que nada lo delatara. El nombre del ZIP lleva el DESTINO y el ORDEN de salida:
un ZIP que dice "para-publicar" de algo que no se publica es la misma trampa.

    python scripts/marca-personal/empaquetar-carrusel.py respuestas --nombre 5-IG-RESPUESTAS
    python scripts/marca-personal/empaquetar-carrusel.py --todas      # relista lo que hay

El ZIP se rehace ENTERO cada vez (no se actualiza): asi una lamina borrada
tambien desaparece del paquete, que es justo lo que fallaba.
"""
import argparse
import zipfile
from pathlib import Path

from PIL import Image

REPO = Path(__file__).resolve().parents[2]
OUT = REPO / "hermes-content/carousels/out"
COLS = 4
ANCHO_MIN = 260  # ancho de cada miniatura en la hoja de contacto


def laminas(pieza: str) -> list[Path]:
    carpeta = OUT / f"apple-{pieza}-inter"
    if not carpeta.is_dir():
        raise SystemExit(f"No existe {carpeta}. Rendí la pieza primero.")
    hallado = sorted(carpeta.glob("lamina-*.png"))
    if not hallado:
        raise SystemExit(f"{carpeta} no tiene laminas rendidas.")
    return hallado


def hoja(pngs: list[Path], destino: Path) -> None:
    """Contactsheet en grilla: para mirar la pieza entera de un vistazo."""
    with Image.open(pngs[0]) as primera:
        escala = ANCHO_MIN / primera.width
        celda = (ANCHO_MIN, round(primera.height * escala))
    filas = (len(pngs) + COLS - 1) // COLS
    pliego = Image.new("RGB", (COLS * celda[0], filas * celda[1]), "#FFFFFF")
    for i, png in enumerate(pngs):
        with Image.open(png) as im:
            pliego.paste(im.convert("RGB").resize(celda, Image.LANCZOS),
                         ((i % COLS) * celda[0], (i // COLS) * celda[1]))
    pliego.save(destino, optimize=True)


def empaquetar(pieza: str, nombre: str) -> None:
    pngs = laminas(pieza)
    zip_dest = OUT / f"{nombre}.zip"
    with zipfile.ZipFile(zip_dest, "w", zipfile.ZIP_DEFLATED) as z:
        for png in pngs:
            z.write(png, png.name)
    hoja_dest = OUT / f"HOJA-{nombre}.png"
    hoja(pngs, hoja_dest)
    print(f"  {zip_dest.name}  ({len(pngs)} laminas)")
    print(f"  {hoja_dest.name}")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("pieza", nargs="?", help="sufijo de apple-<pieza>-inter/")
    ap.add_argument("--nombre", help="nombre del paquete, con orden y destino "
                                     "(ej. 2-COMUNIDAD-MI-STACK-para-mandar)")
    ap.add_argument("--todas", action="store_true",
                    help="lista las piezas rendidas y cuantas laminas tiene cada una")
    args = ap.parse_args()

    if args.todas:
        for carpeta in sorted(OUT.glob("apple-*-inter")):
            n = len(list(carpeta.glob("lamina-*.png")))
            print(f"  {carpeta.name:34s} {n} laminas")
        return
    if not args.pieza or not args.nombre:
        raise SystemExit("Faltan la pieza y --nombre. Ver --todas o --help.")
    empaquetar(args.pieza, args.nombre)


if __name__ == "__main__":
    main()
