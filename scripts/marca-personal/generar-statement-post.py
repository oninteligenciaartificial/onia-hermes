#!/usr/bin/env python3
"""STATEMENT-POST unico, patron statement-3d-minimal (FICHA.md, referencia
bastian.xu). Claim del banco de ideas: "Mi oficina entera" -> [laptop, cafe,
WhatsApp, Claude], los 4 objetos que arman la empresa sin oficina fisica.
Tipografia de marca: Archivo variable (claim wght900 wdth62 word-spacing .09em)
+ Geist Mono para el handle. Sombra de icono mas rica: ganadora del experimento
A/B/C 02-sep (experimento-textura-statement.py) -- el grano sutil se descarto,
tripicaba el peso del PNG sin verse a esta escala; ver FICHA.md.
Salida: hermes-content/carousels/out/statement-mi-oficina-entera.png"""
import subprocess, tempfile, shutil
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
ICONOS = (REPO / "hermes-content/references/ui-patterns/statement-3d-minimal/iconos").as_uri()
OUT = REPO / "hermes-content/carousels/out"

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

ITEMS = [
    ("laptop", "Laptop"),
    ("hot_beverage", "Café"),
    ("speech_balloon", "WhatsApp"),
    ("robot", "Claude"),
]

fila_top = "".join(
    f'<div class="item"><img src="{ICONOS}/{ic}.png"><div class="label">{lbl}</div></div>'
    for ic, lbl in ITEMS[:2]
)
fila_bottom = "".join(
    f'<div class="item"><img src="{ICONOS}/{ic}.png"><div class="label">{lbl}</div></div>'
    for ic, lbl in ITEMS[2:]
)

HTML = f"""<!doctype html><html><head><meta charset='utf-8'><style>
@import url('https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&family=Geist+Mono:wght@500&display=swap');
*{{margin:0;padding:0;box-sizing:border-box}}
html,body{{width:1080px;height:1350px}}
body{{background:#F6F4F1;font-family:'Archivo',sans-serif;overflow:hidden}}
.lienzo{{width:1080px;height:1350px;display:flex;flex-direction:column;justify-content:center;
  align-items:center;gap:76px;padding:100px 120px;position:relative}}
.fila{{display:flex;gap:130px;justify-content:center;align-items:flex-end}}
.item{{display:flex;flex-direction:column;align-items:center;gap:22px}}
.item img{{width:230px;height:230px;object-fit:contain;filter:drop-shadow(0 30px 45px rgba(0,0,0,.25))}}
.label{{font-size:34px;font-weight:400;color:#0A0A0A;letter-spacing:-0.01em}}
.centro{{text-align:center;display:flex;flex-direction:column;gap:14px}}
.claim{{font-size:132px;font-weight:900;font-variation-settings:'wdth' 62;color:#0A0A0A;
  word-spacing:.09em;line-height:1}}
.sub{{font-size:56px;font-weight:600;color:#8E8E8E}}
.handle{{position:absolute;bottom:52px;left:0;right:0;text-align:center;font-family:'Geist Mono',monospace;
  font-size:27px;font-weight:500;letter-spacing:.08em;color:#8E8E8E}}
</style></head><body>
<div class="lienzo">
  <div class="fila">{fila_top}</div>
  <div class="centro">
    <div class="claim">Mi oficina entera</div>
    <div class="sub">laptop, café, WhatsApp y Claude</div>
  </div>
  <div class="fila">{fila_bottom}</div>
  <div class="handle">@sergiourcullo</div>
</div></body></html>"""

def main():
    OUT.mkdir(parents=True, exist_ok=True)
    tmp = Path(tempfile.mkdtemp(prefix="statement-"))
    f = tmp / "statement.html"
    f.write_text(HTML, encoding="utf-8")
    png = OUT / "statement-mi-oficina-entera.png"
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-sandbox",
        "--window-size=1080,1350", "--force-device-scale-factor=1",
        "--virtual-time-budget=8000", f"--screenshot={png}", f.as_uri()],
        check=True, capture_output=True, timeout=90)
    print(f"OK statement-mi-oficina-entera.png {png.stat().st_size} bytes")
    shutil.rmtree(tmp, ignore_errors=True)

if __name__ == "__main__":
    main()
