#!/usr/bin/env python3
"""EXPERIMENTO A/B/C -- Textura/atmosfera en el patron statement-3d-minimal
(pendiente #6 de ONIA_MARCA_PERSONAL_BASE_CONTENIDO.md, referencia carosia
"papel envejecido" en references/ui-patterns/spec-sheet-editorial/FICHA.md).

Usa la pieza real "Mi oficina entera" (statement-post nuevo de esta vuelta,
generar-statement-post.py) para comparar sobre algo que se va a publicar.

Variante A: sin textura, sombra actual (control).
Variante B: grano sutil (feTurbulence) sobre el fondo, misma sombra.
Variante C: grano sutil + sombra de icono mas rica/profunda.

Salida: carousels/out/experimento-textura-statement/.
"""
import subprocess, tempfile, shutil
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
ICONOS = (REPO / "hermes-content/references/ui-patterns/statement-3d-minimal/iconos").as_uri()
OUT = REPO / "hermes-content/carousels/out/experimento-textura-statement"

def _chrome():
    import os, glob
    if os.environ.get("CHROME_BIN"):
        return os.environ["CHROME_BIN"]
    candidatos = [r"C:\Program Files\Google\Chrome\Application\chrome.exe"]
    candidatos += sorted(glob.glob("/root/.cache/ms-playwright/chromium-*/chrome-linux64/chrome"), reverse=True)
    for c in candidatos:
        if Path(c).exists():
            return c
    raise SystemExit("No encontre Chrome/Chromium (setea CHROME_BIN)")

CHROME = _chrome()

GRANO_SVG = """<svg style="position:absolute;width:0;height:0">
<filter id="grano"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="noise"/>
<feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.035 0"/></filter></svg>"""

ITEMS = [("laptop", "Laptop"), ("hot_beverage", "Café"), ("speech_balloon", "WhatsApp"), ("robot", "Claude")]
fila_top = "".join(f'<div class="item"><img src="{ICONOS}/{ic}.png"><div class="label">{lbl}</div></div>' for ic, lbl in ITEMS[:2])
fila_bottom = "".join(f'<div class="item"><img src="{ICONOS}/{ic}.png"><div class="label">{lbl}</div></div>' for ic, lbl in ITEMS[2:])

CSS_BASE = """
@import url('https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&family=Geist+Mono:wght@500&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1350px}
body{background:#F6F4F1;font-family:'Archivo',sans-serif;overflow:hidden}
.lienzo{width:1080px;height:1350px;display:flex;flex-direction:column;justify-content:center;
  align-items:center;gap:76px;padding:100px 120px;position:relative}
.fila{display:flex;gap:130px;justify-content:center;align-items:flex-end}
.item{display:flex;flex-direction:column;align-items:center;gap:22px}
.label{font-size:34px;font-weight:400;color:#0A0A0A;letter-spacing:-0.01em}
.centro{text-align:center;display:flex;flex-direction:column;gap:14px}
.claim{font-size:132px;font-weight:900;font-variation-settings:'wdth' 62;color:#0A0A0A;word-spacing:.09em;line-height:1}
.sub{font-size:56px;font-weight:600;color:#8E8E8E}
.handle{position:absolute;bottom:52px;left:0;right:0;text-align:center;font-family:'Geist Mono',monospace;
  font-size:27px;font-weight:500;letter-spacing:.08em;color:#8E8E8E}
"""

SOMBRA_NORMAL = ".item img{width:230px;height:230px;object-fit:contain;filter:drop-shadow(0 16px 22px rgba(0,0,0,.14))}"
SOMBRA_RICA = ".item img{width:230px;height:230px;object-fit:contain;filter:drop-shadow(0 30px 45px rgba(0,0,0,.25))}"
CSS_GRANO = ".grano{position:absolute;inset:0;filter:url(#grano);mix-blend-mode:multiply;pointer-events:none}"

def cuerpo(con_grano):
    grano_div = '<div class="grano"></div>' if con_grano else ""
    grano_svg = GRANO_SVG if con_grano else ""
    return grano_svg, f"""<div class="lienzo">
  {grano_div}
  <div class="fila">{fila_top}</div>
  <div class="centro">
    <div class="claim">Mi oficina entera</div>
    <div class="sub">laptop, café, WhatsApp y Claude</div>
  </div>
  <div class="fila">{fila_bottom}</div>
  <div class="handle">@sergiourcullo</div>
</div>"""

VARIANTES = {
    "variante-A-sin-textura": (CSS_BASE + SOMBRA_NORMAL, *cuerpo(False)),
    "variante-B-grano-sutil": (CSS_BASE + SOMBRA_NORMAL + CSS_GRANO, *cuerpo(True)),
    "variante-C-grano-sombra-rica": (CSS_BASE + SOMBRA_RICA + CSS_GRANO, *cuerpo(True)),
}

def main():
    OUT.mkdir(parents=True, exist_ok=True)
    tmp = Path(tempfile.mkdtemp(prefix="textura-"))
    for nombre, (css, svg, cuerpo_html) in VARIANTES.items():
        html = f"<!doctype html><html><head><meta charset='utf-8'><style>{css}</style></head><body>{svg}{cuerpo_html}</body></html>"
        f = tmp / f"{nombre}.html"
        f.write_text(html, encoding="utf-8")
        png = OUT / f"{nombre}.png"
        subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-sandbox",
            "--window-size=1080,1350", "--force-device-scale-factor=1",
            "--virtual-time-budget=8000", f"--screenshot={png}", f.as_uri()],
            check=True, capture_output=True, timeout=90)
        print(f"OK {nombre}.png {png.stat().st_size} bytes")
    shutil.rmtree(tmp, ignore_errors=True)

if __name__ == "__main__":
    main()
