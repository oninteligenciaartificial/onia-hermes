#!/usr/bin/env python3
"""STATEMENT-POST "Atender clientes 24/7 son 4 cosas" — patron statement-3d-minimal.

Idea del banco de la FICHA de statement-3d-minimal ("Atender clientes 24/7 solo
requiere N cosas"), que figuraba pendiente porque n8n no tiene icono propio en el
set. Se resuelve con los 4 objetos que SI tienen icono y que ademas describen mejor
el circuito real de atender: contestar (WhatsApp), pensar la respuesta (Claude),
agendar (agenda) y recordar (recordatorio).

Construido con la receta de marca ganadora del experimento A/B/C2 de esta corrida
(experimento-statement-tipografia.py): contexto gris chico + remate gigante
Archivo 650 / eje wdth 96 con highlight verde + capas collage. B (el
buscar-y-reemplazar) volvio a ser un retroceso, ahora tambien medido en statement.

TRES defectos que la variante C2 del experimento destapo y que aca estan corregidos
—los tres solo se ven MIRANDO el render, ninguno cambia el peso del PNG:
  1. CONTENIDO: el claim decia "3 COSAS" y el lienzo mostraba 4 iconos. La formula
     del patron es "[resultado] + solo requiere N cosas + los N objetos": con N
     distinto de la cantidad de iconos la pieza se contradice sola. Va 4 y 4.
  2. El sticker circular cortaba la palabra "CONTRATAR" por los dos lados: a 28px
     esa palabra mide mas que el diametro de 166px. Circulo a 186px y tipografia a
     24px — medido, no a ojo (9 caracteres x ~14.4px = ~130px < 162px utiles).
  3. La cinta quedaba DETRAS del bloque verde y asomaba como una mancha gris. Va
     anclada al `.centro` (position:relative) y con z-index por ENCIMA, apoyada
     sobre el borde inferior del verde: es la trampa #5 de la FICHA de
     carrusel-pinterest-refs — una cinta que no sujeta nada no lee como collage.

Sin precios ni promesas de producto: es contenido de marca, no venta.
Salida: hermes-content/carousels/out/statement-atender-24-7.png
"""
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

# 4 objetos = las "4 COSAS" del remate. Si se agrega o saca uno, el remate cambia.
ITEMS = [
    ("speech_balloon", "WhatsApp"),
    ("robot", "Claude"),
    ("spiral_calendar", "Agenda"),
    ("bell", "Recordatorio"),
]
CANTIDAD = len(ITEMS)

def _fila(items):
    return "".join(
        f'<div class="item"><img src="{ICONOS}/{ic}.png"><div class="label">{lbl}</div></div>'
        for ic, lbl in items
    )

HTML = f"""<!doctype html><html><head><meta charset='utf-8'><style>
@import url('https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&family=Geist+Mono:wght@500&display=swap');
*{{margin:0;padding:0;box-sizing:border-box}}
:root{{--bg:#F6F4F1;--ink:#0A0A0A;--muted:#8E8E8E;--verde:#00C661}}
html,body{{width:1080px;height:1350px}}
body{{background:var(--bg);font-family:'Archivo',sans-serif;font-weight:450;overflow:hidden}}
.lienzo{{width:1080px;height:1350px;display:flex;flex-direction:column;justify-content:center;
  align-items:center;gap:64px;padding:100px 120px;position:relative}}
.fila{{display:flex;gap:130px;justify-content:center;align-items:flex-end}}
.item{{display:flex;flex-direction:column;align-items:center;gap:20px}}
.item img{{width:196px;height:196px;object-fit:contain;filter:drop-shadow(0 30px 45px rgba(0,0,0,.25))}}
.label{{font-family:'Geist Mono',monospace;font-size:24px;font-weight:500;letter-spacing:.08em;
  text-transform:uppercase;color:var(--muted)}}
/* position:relative — de aca cuelga la cinta, asi no depende del alto del lienzo */
.centro{{text-align:center;display:flex;flex-direction:column;gap:14px;position:relative}}
.contexto{{font-size:50px;font-weight:450;color:var(--muted);line-height:1.2}}
.remate{{font-size:132px;font-weight:650;font-variation-settings:'wdth' 96;color:var(--ink);
  line-height:.98;letter-spacing:-0.035em;margin-top:12px}}
.remate .hl{{background:var(--verde);border-radius:12px;padding:2px 22px 10px;white-space:nowrap;
  -webkit-box-decoration-break:clone;box-decoration-break:clone}}
.icono-flot{{position:absolute;object-fit:contain;filter:drop-shadow(0 14px 22px rgba(0,0,0,.18))}}
/* la cinta SUJETA el bloque verde por el borde de abajo y va ENCIMA (z-index):
   detras asoma como una mancha gris y no lee como collage. */
.cinta{{position:absolute;bottom:-18px;left:2px;width:190px;height:52px;z-index:3;
  background:rgba(0,0,0,.055);border:1px solid rgba(0,0,0,.05);
  box-shadow:0 3px 8px rgba(0,0,0,.05);transform:rotate(-8deg)}}
/* 186px de diametro y 24px de tipografia: "CONTRATAR" son 9 caracteres (~130px) y
   entra en los 162px utiles. A 166/28px se cortaba por los dos lados. */
.sticker{{position:absolute;background:#0A0A0A;color:var(--verde);border-radius:50%;
  width:186px;height:186px;display:flex;align-items:center;justify-content:center;
  transform:rotate(12deg);font-weight:650;font-size:24px;line-height:1.15;text-align:center;
  box-shadow:0 14px 30px rgba(0,0,0,.25)}}
.handle{{position:absolute;bottom:52px;left:0;right:0;text-align:center;font-family:'Geist Mono',monospace;
  font-size:27px;font-weight:500;letter-spacing:.08em;color:var(--muted)}}
</style></head><body>
<div class="lienzo">
  <img class="icono-flot" src="{ICONOS}/sparkles.png" style="width:112px;top:92px;left:40px;transform:rotate(-12deg)">
  <div class="sticker" style="top:96px;right:40px">SIN<br>CONTRATAR</div>
  <div class="fila">{_fila(ITEMS[:2])}</div>
  <div class="centro">
    <div class="contexto">Atender clientes 24/7</div>
    <div class="remate">SOLO SON<br><span class="hl">{CANTIDAD} COSAS</span></div>
    <div class="cinta"></div>
  </div>
  <div class="fila">{_fila(ITEMS[2:])}</div>
  <div class="handle">@sergiourcullo</div>
</div></body></html>"""

def main():
    OUT.mkdir(parents=True, exist_ok=True)
    tmp = Path(tempfile.mkdtemp(prefix="statement-atender-"))
    f = tmp / "statement.html"
    f.write_text(HTML, encoding="utf-8")
    png = OUT / "statement-atender-24-7.png"
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-sandbox",
        "--window-size=1080,1350", "--force-device-scale-factor=1",
        "--virtual-time-budget=8000", f"--screenshot={png}", f.as_uri()],
        check=True, capture_output=True, timeout=90)
    print(f"OK statement-atender-24-7.png {png.stat().st_size} bytes")
    shutil.rmtree(tmp, ignore_errors=True)

if __name__ == "__main__":
    main()
