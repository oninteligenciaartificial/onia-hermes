#!/usr/bin/env python3
"""Lamina grid 2x3 estilo bastian.xu (post DcqsXYdIGep): iconos 3D en ESCALA DE
GRISES + el color solo en highlights (verde Onia) sobre la palabra clave.
Tipografia de marca: Archivo variable + Geist Mono. 1080x1350.
Salida: hermes-content/carousels/out/lamina-grid-ia.png"""
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
    ("speech_balloon", "Responde", "clientes 24/7"),
    ("money_bag", "Cotiza", "en 1 minuto"),
    ("spiral_calendar", "Agenda", "tus citas"),
    ("memo", "Escribe", "lo que vende"),
    ("chart_increasing", "Ordena", "tus números"),
    ("robot", "Atiende", "sin que estés"),
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
.t2{{font-size:118px;font-weight:900;font-variation-settings:'wdth' 62;word-spacing:.09em;color:#0A0A0A;line-height:1;margin-top:6px}}
.t2 .hl{{background:#00C661;padding:2px 20px 8px;border-radius:10px}}
.grid{{display:grid;grid-template-columns:repeat(3,1fr);gap:64px 40px;margin-top:96px;width:100%}}
.celda{{display:flex;flex-direction:column;align-items:center;gap:22px}}
.celda img{{width:210px;height:210px;object-fit:contain;filter:grayscale(1) contrast(1.05)}}
.lbl{{font-size:37px;font-weight:600;color:#0A0A0A;text-align:center;line-height:1.45}}
.lbl .hl{{background:#00C661;padding:1px 12px 4px;border-radius:8px;font-weight:800}}
.handle{{position:absolute;bottom:52px;left:0;right:0;text-align:center;font-family:'Geist Mono',monospace;font-size:27px;font-weight:500;letter-spacing:.08em;color:#8E8E8E}}
</style></head><body>
<div class="lienzo">
  <div class="t1">Lo que la IA ya hace</div>
  <div class="t2"><span class="hl">por tu negocio</span></div>
  <div class="grid">{celdas_html}</div>
  <div class="handle">@sergiourcullo</div>
</div></body></html>"""

def main():
    OUT.mkdir(parents=True, exist_ok=True)
    tmp = Path(tempfile.mkdtemp(prefix="grid-"))
    f = tmp / "lamina.html"
    f.write_text(HTML, encoding="utf-8")
    png = OUT / "lamina-grid-ia.png"
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-sandbox",
        "--window-size=1080,1350", "--force-device-scale-factor=1",
        "--virtual-time-budget=8000", f"--screenshot={png}", f.as_uri()],
        check=True, capture_output=True, timeout=90)
    print(f"OK lamina-grid-ia.png {png.stat().st_size} bytes")
    shutil.rmtree(tmp, ignore_errors=True)

if __name__ == "__main__":
    main()
