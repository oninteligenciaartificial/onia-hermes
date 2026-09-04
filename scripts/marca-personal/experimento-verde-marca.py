#!/usr/bin/env python3
"""Experimento — el VERDE DE MARCA (#00C661) sobre la lamina de CTA real.

Sergio fijo el 02-sep (BASE_CONTENIDO section 7): "Verde Onia (#00C661) SIEMPRE".
Cuatro generadores estaban en #1F7A4D, un verde oscuro que NADIE decidio.

Pero cambiar el hex a secas no alcanza: en esos generadores el verde es COLOR DE
TEXTO de la palabra "COMUNIDAD" — la palabra que dispara toda la conversion del
carrusel. #00C661 es un verde CLARO: como texto sobre fondo claro se apaga.

Por eso el experimento mide el contraste ademas de mirarlo:
  A  color de texto #1F7A4D  (lo que hay hoy: verde equivocado)
  B  color de texto #00C661  (verde correcto, arreglo ingenuo)
  C  bloque de fondo #00C661 + tinta #0A0A0A  (verde correcto como FILL)

C es como ya lo usan generar-lamina-grid-senales.py y generar-carrusel-comunidad.py
(.hl{background:#00C661}) — la hipotesis es que esa familia ya tenia razon.

Salida: carousels/out/experimento-verde-marca/ (A/B/C sueltas + hoja comparada).
"""
import subprocess, tempfile, os, glob
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
OUT = RAIZ / "hermes-content/carousels/out/experimento-verde-marca"
ICONOS = (RAIZ / "hermes-content/references/ui-patterns/statement-3d-minimal/iconos").as_uri()


def _chrome():
    if os.environ.get("CHROME_BIN"):
        return os.environ["CHROME_BIN"]
    candidatos = sorted(glob.glob(
        "/root/.cache/ms-playwright/chromium-*/chrome-linux64/chrome"), reverse=True)
    for c in candidatos:
        if Path(c).exists():
            return c
    raise SystemExit("No encontre Chrome/Chromium (setea CHROME_BIN)")


CHROME = _chrome()

# ---------------------------------------------------------------- contraste
def _lum(hex_color):
    """Luminancia relativa WCAG de un #RRGGBB."""
    r, g, b = (int(hex_color[i:i + 2], 16) / 255 for i in (1, 3, 5))
    f = lambda c: c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)


def contraste(fg, bg):
    a, b = _lum(fg), _lum(bg)
    hi, lo = max(a, b), min(a, b)
    return (hi + 0.05) / (lo + 0.05)


CSS = """
@import url('https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&family=Geist+Mono:wght@500&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
:root{--bg:#F7F7F7;--ink:#0A0A0A;--muted:#8E8E8E}
html,body{width:1080px;height:1350px}
body{background:var(--bg);font-family:'Archivo',sans-serif;overflow:hidden}
.lienzo{width:1080px;height:1350px;display:flex;flex-direction:column;justify-content:center;
  align-items:center;padding:90px 100px;gap:56px;position:relative}
.handle{position:absolute;bottom:52px;left:0;right:0;text-align:center;
  font-family:'Geist Mono',monospace;font-size:27px;font-weight:500;letter-spacing:.08em;color:var(--muted)}
.icono{width:300px;height:300px;object-fit:contain;filter:drop-shadow(0 30px 45px rgba(0,0,0,.25))}
.titulo{font-size:88px;font-weight:900;font-variation-settings:'wdth' 62;color:var(--ink);
  word-spacing:.09em;text-align:center;line-height:1.02}
.sub{font-size:44px;font-weight:600;color:var(--muted);text-align:center}
/* A y B: el verde como color de texto. C: el verde como bloque. */
.cta-a{font-weight:900;color:#1F7A4D}
.cta-b{font-weight:900;color:#00C661}
.cta-c{font-weight:900;color:#0A0A0A;background:#00C661;border-radius:10px;padding:2px 16px 6px}
.sello{position:absolute;top:44px;left:0;right:0;text-align:center;
  font-family:'Geist Mono',monospace;font-size:26px;letter-spacing:.1em;color:#8E8E8E}
"""

VARIANTES = {
    "A-texto-verde-oscuro": ("A · #1F7A4D COMO TEXTO (HOY)", 'cta-a'),
    "B-texto-verde-marca": ("B · #00C661 COMO TEXTO", 'cta-b'),
    "C-bloque-verde-marca": ("C · #00C661 COMO BLOQUE + TINTA", 'cta-c'),
}


def lamina(sello, clase):
    return f"""<div class="lienzo">
  <div class="sello">{sello}</div>
  <img class="icono" src="{ICONOS}/rocket.png">
  <div class="titulo">El paso a paso<br>lo dejo adentro</div>
  <div class="sub">Coment&aacute; <span class="{clase}">COMUNIDAD</span> y te paso el enlace para unirte</div>
  <div class="handle">@sergiourcullo</div>
</div>"""


def render(html, destino, w=1080, h=1350):
    doc = f"<!doctype html><html><head><meta charset='utf-8'><style>{CSS}</style></head><body>{html}</body></html>"
    with tempfile.NamedTemporaryFile("w", suffix=".html", delete=False, encoding="utf-8") as f:
        f.write(doc)
        tmp = f.name
    subprocess.run([CHROME, "--headless", "--no-sandbox", "--disable-gpu",
                    "--hide-scrollbars", "--force-device-scale-factor=1",
                    f"--window-size={w},{h}", "--virtual-time-budget=9000",
                    f"--screenshot={destino}", f"file://{tmp}"],
                   check=True, capture_output=True)
    os.unlink(tmp)
    return destino


def main():
    OUT.mkdir(parents=True, exist_ok=True)

    print("=== CONTRASTE MEDIDO (WCAG) — fondo de la lamina #F7F7F7 ===")
    print(f"  A  #1F7A4D texto   : {contraste('#1F7A4D', '#F7F7F7'):.2f}:1")
    print(f"  B  #00C661 texto   : {contraste('#00C661', '#F7F7F7'):.2f}:1")
    print(f"  C  #0A0A0A / #00C661: {contraste('#0A0A0A', '#00C661'):.2f}:1")
    print("  (AA cuerpo = 4.5:1 · AA texto grande = 3:1)\n")

    for nombre, (sello, clase) in VARIANTES.items():
        destino = OUT / f"{nombre}.png"
        render(lamina(sello, clase), str(destino))
        print(f"  {destino.name}  {destino.stat().st_size // 1024} KB")

    # Hoja comparada: las 3 al tamano en que se comparan de verdad.
    tarjetas = "".join(
        f'<div class="col"><img src="{(OUT / f"{n}.png").as_uri()}"></div>'
        for n in VARIANTES
    )
    hoja = f"""<style>
      body{{margin:0;background:#111;font-family:sans-serif;width:1720px}}
      .fila{{display:flex;gap:20px;padding:20px}}
      .col img{{width:550px;display:block;border-radius:8px}}
    </style><div class="fila">{tarjetas}</div>"""
    destino = OUT / "COMPARADA-3-variantes.png"
    render(hoja, str(destino), w=1720, h=780)
    print(f"  {destino.name}  {destino.stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
