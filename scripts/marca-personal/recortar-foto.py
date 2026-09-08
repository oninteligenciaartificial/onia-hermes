#!/usr/bin/env python3
"""Recorta el fondo de una foto y deja un PNG con transparencia, para el layout F.

Todo local y gratis: OpenCV + rembg, sin servicio de IA y sin creditos. El layout F del
patron apple-editorial (portada con foto recortada, referencia bastian.xu) necesita al
sujeto sobre fondo transparente para apoyarlo sobre el gris #F5F5F7.

Dos metodos, porque ninguno gana siempre:

  chroma  — para fondo verde/azul plano de croma. Umbral en HSV + DESPILL (le saca el
            rebote verde al pelo y a los bordes de la ropa). Bordes durisimos y exactos,
            pero exige que el fondo sea realmente plano.
  rembg   — segmentacion por modelo (u2net, corre local). Aguanta cualquier fondo y
            resuelve mejor el pelo suelto, pero puede comerse detalles finos.
  ambos   — DEFAULT. Rinde los dos y arma una hoja comparada para MIRARLOS antes de
            elegir. La regla de la casa es mirar, no suponer cual salio mejor.

Uso:
  python scripts/marca-personal/recortar-foto.py --entrada foto.jpg
  python scripts/marca-personal/recortar-foto.py --entrada foto.jpg --metodo chroma --matiz 60
"""
import argparse
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
DEST = REPO / "hermes-content/references/ui-patterns/apple-editorial/logos"


def _chroma(bgr, matiz, tol_h, sat_min, val_min):
    """Croma en HSV + despill. Devuelve BGRA."""
    import cv2
    import numpy as np

    hsv = cv2.cvtColor(bgr, cv2.COLOR_BGR2HSV)
    h, s, v = hsv[:, :, 0].astype(int), hsv[:, :, 1], hsv[:, :, 2]
    # OpenCV usa H en 0..179, asi que la distancia de matiz es circular sobre 180.
    dist = np.minimum(np.abs(h - matiz), 180 - np.abs(h - matiz))
    fondo = (dist <= tol_h) & (s >= sat_min) & (v >= val_min)

    alpha = np.where(fondo, 0, 255).astype("uint8")
    # Suaviza 1px el borde: un alpha binario deja escalera visible al escalar.
    alpha = cv2.GaussianBlur(alpha, (3, 3), 0)

    # DESPILL: donde el verde domina, lo baja al maximo de los otros dos canales. Sin
    # esto queda un halo verde en el pelo y en el hombro que se ve SOLO al 100%.
    out = bgr.copy().astype(int)
    b, g, r = out[:, :, 0], out[:, :, 1], out[:, :, 2]
    exceso = g > np.maximum(b, r)
    g[exceso] = np.maximum(b, r)[exceso]
    out = np.dstack([out.astype("uint8"), alpha])
    return out


def _recortar_transparente(png_path):
    """Recorta el lienzo a lo que de verdad tiene pixeles: sin esto el sujeto queda
    chico y descentrado dentro de un marco vacio."""
    from PIL import Image

    im = Image.open(png_path).convert("RGBA")
    caja = im.getbbox()
    if caja:
        im.crop(caja).save(png_path)
    return im.size


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--entrada", required=True, help="foto original (jpg/png)")
    ap.add_argument("--metodo", choices=["chroma", "rembg", "ambos"], default="ambos")
    ap.add_argument("--salida", default=None, help="carpeta destino (default: logos/ del patrón)")
    # Verde de croma: H≈60 en la escala 0..179 de OpenCV.
    ap.add_argument("--matiz", type=int, default=60, help="matiz del fondo, 0..179 (verde=60, azul=110)")
    ap.add_argument("--tolerancia", type=int, default=25)
    ap.add_argument("--sat-min", type=int, default=70)
    ap.add_argument("--val-min", type=int, default=50)
    a = ap.parse_args()

    src = Path(a.entrada)
    if not src.exists():
        raise SystemExit(f"No existe {src}")
    dest = Path(a.salida) if a.salida else DEST
    dest.mkdir(parents=True, exist_ok=True)

    salidas = []
    if a.metodo in ("chroma", "ambos"):
        import cv2

        bgr = cv2.imread(str(src), cv2.IMREAD_COLOR)
        if bgr is None:
            raise SystemExit(f"OpenCV no pudo leer {src}")
        out = dest / "sergio-chroma.png"
        cv2.imwrite(str(out), _chroma(bgr, a.matiz, a.tolerancia, a.sat_min, a.val_min))
        salidas.append(out)

    if a.metodo in ("rembg", "ambos"):
        from rembg import remove

        out = dest / "sergio-rembg.png"
        out.write_bytes(remove(src.read_bytes()))
        salidas.append(out)

    for s in salidas:
        w, h = _recortar_transparente(s)
        print(f"  {s.name}  {s.stat().st_size // 1024} KB  ({w}x{h} antes de recortar)")
    print(f"OK -> {dest}")
    print("MIRÁ los dos al 100% antes de elegir: el halo verde y el pelo suelto")
    print("no se ven en miniatura.")


if __name__ == "__main__":
    main()
