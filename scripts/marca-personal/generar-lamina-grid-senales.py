#!/usr/bin/env python3
"""Lamina grid 2x3, mismo patron visual que generar-lamina-grid-ia.py (bastian.xu:
iconos 3D en escala de grises + color solo en highlights verde Onia), pero con
angulo distinto: senales de que un negocio YA necesita automatizar (autodiagnostico),
no lista de capacidades. Tipografia de marca: Archivo variable + Geist Mono. 1080x1350.
Salida: hermes-content/carousels/out/lamina-grid-senales.png"""
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
    raise SystemExit("No encontre Chrome/Chromium (seteá CHROME_BIN)")

CHROME = _chrome()

CELDAS = [
    ("speech_balloon", "Contestás", "lo mismo, muchas veces"),
    ("money_bag", "Cotizás", "a mano, uno por uno"),
    ("spiral_calendar", "Agendás", "por WhatsApp, sin sistema"),
    ("memo", "Escribís", "todo desde cero"),
    ("brain", "No sabés", "por dónde empezar"),
    ("hot_beverage", "Se te va el día", "en lo operativo"),
]

celdas_html = "".join(
    f"""<div class="celda"><img src="{ICONOS}/{icono}.png">
    <div class="lbl">{arriba}<br><span class="hl">{abajo}</span></div></div>"""
    for icono, arriba, abajo in CELDAS
)

HTML = f"""<!doctype html><html><head><meta charset='utf-8'><style>
@import url('https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&family=Geist+Mono:wght@500&display=swap');
*{{margin:0;padding:0;box-sizing:border-box}}
html,body{{width:1080px;height:1350px}}
body{{background:#F7F7F7;font-family:'Archivo',sans-serif;overflow:hidden}}
.lienzo{{width:1080px;height:1350px;display:flex;flex-direction:column;align-items:center;padding:110px 90px 90px;position:relative}}
.t1{{font-size:64px;font-weight:500;font-variation-settings:'wdth' 96;color:#0A0A0A;letter-spacing:-0.01em}}
.t2{{font-size:96px;font-weight:900;font-variation-settings:'wdth' 62;word-spacing:.09em;color:#0A0A0A;line-height:1.05;margin-top:6px;text-align:center}}
.t2 .hl{{background:#00C661;padding:2px 20px 8px;border-radius:10px}}
.grid{{display:grid;grid-template-columns:repeat(3,1fr);gap:64px 40px;margin-top:88px;width:100%}}
.celda{{display:flex;flex-direction:column;align-items:center;gap:22px}}
.celda img{{width:210px;height:210px;object-fit:contain;filter:grayscale(1) contrast(1.05)}}
.lbl{{font-size:35px;font-weight:600;color:#0A0A0A;text-align:center;line-height:1.45}}
.lbl .hl{{background:#00C661;padding:1px 12px 4px;border-radius:8px;font-weight:800}}
.handle{{position:absolute;bottom:52px;left:0;right:0;text-align:center;font-family:'Geist Mono',monospace;font-size:27px;font-weight:500;letter-spacing:.08em;color:#8E8E8E}}
</style></head><body>
<div class="lienzo">
  <div class="t1">Señales de que ya</div>
  <div class="t2"><span class="hl">necesitás automatizar</span></div>
  <div class="grid">{celdas_html}</div>
  <div class="handle">@sergiourcullo</div>
</div></body></html>"""

def main():
    OUT.mkdir(parents=True, exist_ok=True)
    tmp = Path(tempfile.mkdtemp(prefix="grid-senales-"))
    f = tmp / "lamina.html"
    f.write_text(HTML, encoding="utf-8")
    png = OUT / "lamina-grid-senales.png"
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-sandbox",
        "--window-size=1080,1350", "--force-device-scale-factor=1",
        "--virtual-time-budget=8000", f"--screenshot={png}", f.as_uri()],
        check=True, capture_output=True, timeout=90)
    print(f"OK lamina-grid-senales.png {png.stat().st_size} bytes")
    shutil.rmtree(tmp, ignore_errors=True)

if __name__ == "__main__":
    main()
