#!/usr/bin/env python3
"""Lamina grid 2x3 estilo bastian.xu (post DcqsXYdIGep): iconos 3D en ESCALA DE
GRISES + el color solo en highlights (verde Onia) sobre la palabra clave.
1080x1350. Salida: hermes-content/carousels/out/lamina-grid-ia.png

MIGRADA A LA TIPOGRAFIA DE MARCA el 03-sep (pendiente de BASE_CONTENIDO §6, "los otros
11 generadores"). Trae la variante C2 ganadora de `experimento-grid-tipografia.py`:

  · encabezado con JERARQUIA, no dos lineas parejas: contexto gris chico (450) +
    remate gigante 650/wdth 96 en DOS lineas. A 13% (grilla de perfil) es lo unico
    que sobrevive; el layout viejo se volvia una mancha gris.
  · el remate va en 2 lineas de <=7 caracteres: `wdth 96` es mas ancho que el
    condensed 62 que habia, y "POR TU NEGOCIO" en una linea desborda los 900px utiles.
  · celdas 210px -> 190px para hacerle lugar al remate sin perder legibilidad.
  · capas collage (regla "stickers siempre"), con la correccion que salio de MIRAR el
    render al 100%: **la cinta se apoya sobre el bloque verde**, no flota en vacio.
    Una cinta pegada a NADA lee como un rectangulo gris perdido, no como collage.
  · el sticker dice algo ("sin SUELDO"), no metadata decorativa.
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
:root{{--bg:#F7F7F7;--ink:#0A0A0A;--muted:#8E8E8E;--verde:#00C661}}
html,body{{width:1080px;height:1350px}}
body{{background:var(--bg);font-family:'Archivo',sans-serif;font-weight:450;overflow:hidden}}
.lienzo{{width:1080px;height:1350px;display:flex;flex-direction:column;align-items:center;padding:110px 90px 90px;position:relative}}
.contexto{{font-size:50px;font-weight:450;color:var(--muted);text-align:center;line-height:1.2}}
/* remate en DOS lineas de <=7 caracteres: wdth 96 es mas ancho que el condensed 62.
   Tope medido: 138px para 9 caracteres en 880px utiles. */
.remate{{font-size:130px;font-weight:650;font-variation-settings:'wdth' 96;color:var(--ink);
  text-align:center;line-height:.98;letter-spacing:-0.035em;margin-top:10px}}
.remate .hl{{background:var(--verde);border-radius:12px;padding:2px 22px 10px;white-space:nowrap;
  -webkit-box-decoration-break:clone;box-decoration-break:clone}}
.grid{{display:grid;grid-template-columns:repeat(3,1fr);gap:64px 40px;margin-top:74px;width:100%}}
.celda{{display:flex;flex-direction:column;align-items:center;gap:22px}}
.celda img{{width:190px;height:190px;object-fit:contain;filter:grayscale(1) contrast(1.05)}}
.lbl{{font-size:35px;font-weight:600;color:var(--ink);text-align:center;line-height:1.45}}
.lbl .hl{{background:var(--verde);padding:1px 12px 4px;border-radius:8px;font-weight:800;
  white-space:nowrap;-webkit-box-decoration-break:clone;box-decoration-break:clone}}
.handle{{position:absolute;bottom:52px;left:0;right:0;text-align:center;font-family:'Geist Mono',monospace;font-size:27px;font-weight:500;letter-spacing:.08em;color:var(--muted)}}
/* el icono del collage va TAMBIEN en gris: este patron manda "iconos grayscale, color
   solo en los highlights verdes". A todo color mete rosa/naranja fuera de paleta. */
.icono-flot{{position:absolute;object-fit:contain;filter:grayscale(1) contrast(1.05) drop-shadow(0 14px 22px rgba(0,0,0,.18))}}
/* la cinta SUJETA el bloque verde del remate. Sola sobre el fondo plano no lee como
   collage: lee como un rectangulo gris olvidado (visto al 100% el 03-sep). */
.cinta{{position:absolute;width:190px;height:52px;background:rgba(0,0,0,.055);
  border:1px solid rgba(0,0,0,.05);box-shadow:0 3px 8px rgba(0,0,0,.05)}}
.sticker{{position:absolute;background:#0A0A0A;color:var(--verde);border-radius:50%;width:166px;height:166px;
  display:flex;align-items:center;justify-content:center;transform:rotate(12deg);font-weight:650;
  font-size:29px;line-height:1.1;text-align:center;box-shadow:0 14px 30px rgba(0,0,0,.25)}}
</style></head><body>
<div class="lienzo">
  <img class="icono-flot" src="{ICONOS}/sparkles.png" style="width:118px;top:96px;left:34px;transform:rotate(-12deg)">
  <div class="sticker" style="top:118px;right:36px">sin<br>SUELDO</div>
  <div class="contexto">Lo que la IA ya hace</div>
  <div class="remate">POR TU<br><span class="hl">NEGOCIO</span></div>
  <div class="cinta" style="top:392px;left:150px;transform:rotate(-8deg)"></div>
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
