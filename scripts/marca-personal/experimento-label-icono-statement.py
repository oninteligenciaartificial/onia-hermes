#!/usr/bin/env python3
"""Practica 02-sep (tanda intensiva): A/B sobre la etiqueta bajo cada icono en
statement-3d-minimal. Hoy es sans regular ~34px (ver FICHA.md); se compara contra
una micro-etiqueta Geist Mono mayuscula, el mismo lenguaje que ya gano en el marco
spec-sheet de las portadas de carrusel (ONIA_MARCA_PERSONAL_BASE_CONTENIDO SS6).
Renderiza las 2 variantes sobre la MISMA pieza real que se produce esta vuelta
("16 anios. 4 herramientas. 1 empresa.") para que el veredicto quede aplicado de
una, no en una pieza descartable.
Salida: carousels/out/experimento-label-icono-statement/{A-sans,B-mono}.png
"""
import subprocess, tempfile, shutil
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
ICONOS = (REPO / "hermes-content/references/ui-patterns/statement-3d-minimal/iconos").as_uri()
OUT = REPO / "hermes-content/carousels/out/experimento-label-icono-statement"

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
    ("robot", "Claude"),
    ("speech_balloon", "WhatsApp"),
    ("spiral_calendar", "Agenda"),
]

CLAIM = "16 años. 4 herramientas.<br>1 empresa."
SUB = "laptop, Claude, WhatsApp y agenda automática"

BASE_CSS = """
@import url('https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&family=Geist+Mono:wght@500&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1350px}
body{background:#F6F4F1;font-family:'Archivo',sans-serif;overflow:hidden}
.lienzo{width:1080px;height:1350px;display:flex;flex-direction:column;justify-content:center;
  align-items:center;gap:52px;padding:96px 110px 140px;position:relative}
.fila{display:flex;gap:110px;justify-content:center;align-items:flex-end}
.item{display:flex;flex-direction:column;align-items:center;gap:20px}
.item img{width:196px;height:196px;object-fit:contain;filter:drop-shadow(0 30px 45px rgba(0,0,0,.25))}
.centro{text-align:center;display:flex;flex-direction:column;gap:14px}
.claim{font-size:96px;font-weight:900;font-variation-settings:'wdth' 62;color:#0A0A0A;
  word-spacing:.09em;line-height:1.08}
.sub{font-size:46px;font-weight:600;color:#8E8E8E}
.handle{position:absolute;bottom:52px;left:0;right:0;text-align:center;font-family:'Geist Mono',monospace;
  font-size:27px;font-weight:500;letter-spacing:.08em;color:#8E8E8E}
"""

LABEL_A = ".label{font-size:34px;font-weight:400;color:#0A0A0A;letter-spacing:-0.01em}"
LABEL_B = (".label{font-family:'Geist Mono',monospace;font-size:24px;font-weight:500;"
           "letter-spacing:.08em;text-transform:uppercase;color:#8E8E8E}")

def render(nombre, label_css):
    fila_top = "".join(
        f'<div class="item"><img src="{ICONOS}/{ic}.png"><div class="label">{lbl}</div></div>'
        for ic, lbl in ITEMS[:2]
    )
    fila_bottom = "".join(
        f'<div class="item"><img src="{ICONOS}/{ic}.png"><div class="label">{lbl}</div></div>'
        for ic, lbl in ITEMS[2:]
    )
    html = f"""<!doctype html><html><head><meta charset='utf-8'><style>{BASE_CSS}{label_css}</style></head><body>
<div class="lienzo">
  <div class="fila">{fila_top}</div>
  <div class="centro">
    <div class="claim">{CLAIM}</div>
    <div class="sub">{SUB}</div>
  </div>
  <div class="fila">{fila_bottom}</div>
  <div class="handle">@sergiourcullo</div>
</div></body></html>"""
    tmp = Path(tempfile.mkdtemp(prefix="exp-label-"))
    f = tmp / "v.html"
    f.write_text(html, encoding="utf-8")
    png = OUT / f"{nombre}.png"
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-sandbox",
        "--window-size=1080,1350", "--force-device-scale-factor=1",
        "--virtual-time-budget=8000", f"--screenshot={png}", f.as_uri()],
        check=True, capture_output=True, timeout=90)
    print(f"OK {nombre}.png {png.stat().st_size} bytes")
    shutil.rmtree(tmp, ignore_errors=True)

def main():
    OUT.mkdir(parents=True, exist_ok=True)
    render("A-sans", LABEL_A)
    render("B-mono", LABEL_B)

if __name__ == "__main__":
    main()
