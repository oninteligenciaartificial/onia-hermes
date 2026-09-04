#!/usr/bin/env python3
"""STATEMENT-POST unico, patron statement-3d-minimal (FICHA.md). Claim del banco
de ideas: "16 anios. 4 herramientas. 1 empresa." -> [laptop, Claude, WhatsApp,
agenda], la identidad que mas convierte segun BASE_CONTENIDO SS3 (5x en numeros
propios). Layout con 4 iconos + claim de 2 lineas: iconos y gaps mas chicos que
el primer statement (que llevaba claim de 1 sola linea) para no invadir el
handle -- bug real encontrado y corregido en el experimento A/B de esta vuelta
(experimento-label-icono-statement.py). Etiqueta bajo icono: Geist Mono
mayuscula gris, mismo veredicto que se aplico a generar-statement-post.py.
Salida: hermes-content/carousels/out/statement-16-anos-4-herramientas.png"""
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
    ("robot", "Claude"),
    ("speech_balloon", "WhatsApp"),
    ("spiral_calendar", "Agenda"),
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
  align-items:center;gap:52px;padding:96px 110px 140px;position:relative}}
.fila{{display:flex;gap:110px;justify-content:center;align-items:flex-end}}
.item{{display:flex;flex-direction:column;align-items:center;gap:20px}}
.item img{{width:196px;height:196px;object-fit:contain;filter:drop-shadow(0 30px 45px rgba(0,0,0,.25))}}
.label{{font-family:'Geist Mono',monospace;font-size:24px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:#8E8E8E}}
.centro{{text-align:center;display:flex;flex-direction:column;gap:14px}}
.claim{{font-size:96px;font-weight:900;font-variation-settings:'wdth' 62;color:#0A0A0A;
  word-spacing:.09em;line-height:1.08}}
.sub{{font-size:46px;font-weight:600;color:#8E8E8E}}
.handle{{position:absolute;bottom:52px;left:0;right:0;text-align:center;font-family:'Geist Mono',monospace;
  font-size:27px;font-weight:500;letter-spacing:.08em;color:#8E8E8E}}
</style></head><body>
<div class="lienzo">
  <div class="fila">{fila_top}</div>
  <div class="centro">
    <div class="claim">16 años. 4 herramientas.<br>1 empresa.</div>
    <div class="sub">laptop, Claude, WhatsApp y agenda automática</div>
  </div>
  <div class="fila">{fila_bottom}</div>
  <div class="handle">@sergiourcullo</div>
</div></body></html>"""

def main():
    OUT.mkdir(parents=True, exist_ok=True)
    tmp = Path(tempfile.mkdtemp(prefix="statement-"))
    f = tmp / "statement.html"
    f.write_text(HTML, encoding="utf-8")
    png = OUT / "statement-16-anos-4-herramientas.png"
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-sandbox",
        "--window-size=1080,1350", "--force-device-scale-factor=1",
        "--virtual-time-budget=8000", f"--screenshot={png}", f.as_uri()],
        check=True, capture_output=True, timeout=90)
    print(f"OK statement-16-anos-4-herramientas.png {png.stat().st_size} bytes")
    shutil.rmtree(tmp, ignore_errors=True)

if __name__ == "__main__":
    main()
