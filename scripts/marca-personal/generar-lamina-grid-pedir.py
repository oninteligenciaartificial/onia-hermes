#!/usr/bin/env python3
"""Lamina grid 2x3 — "el secreto no es la IA, es como se pide": las 6 partes de un
prompt que funciona. 1080x1350.
Salida: hermes-content/carousels/out/lamina-grid-pedir.png

POR QUE ESTE TEMA Y NO OTRO
---------------------------
Las dos grids que ya existen dicen QUE puede hacer la IA (`lamina-grid-ia.png`) y
CUANDO conviene automatizar (`lamina-grid-senales.png`). Ninguna ensena el COMO. El
carrusel "5 prompts" regala prompts hechos; esta lamina ensena la receta para que el
dueno escriba los suyos — que es lo que pidio Sergio el 02-sep: "tus textos no ensenan
nada", cada lamina tiene que dejar algo aplicable HOY.

Las 6 partes no son una lista sacada de internet: son las que ya usan los prompts
reales del carril (ver `ONIA_COMUNIDAD_CONTENIDO.md` §D2 y el prompt del drop D1 —
todos abren con rol, siguen con contexto, piden formato y ponen un limite).

SISTEMA VISUAL: receta ganadora C2 de `experimento-grid-tipografia.py` (03-sep) —
contexto gris chico + remate gigante 650/wdth 96 en dos lineas, celdas 180px,
capas collage con **la cinta apoyada sobre el bloque verde** (sola en el aire no lee
como collage), sticker con texto que dice algo. Archivo pesos MEDIOS + Geist Mono.
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

# Celda = la parte del prompt (arriba) + el ejemplo concreto y copiable (verde).
# El verde va con nowrap, asi que el ejemplo no puede pasar de ~13 caracteres o se sale
# de la celda (ancho util por celda: 273px). Trampa #2 de la FICHA.
CELDAS = [
    ("busts_in_silhouette", "Dale un rol", "sos vendedor"),
    ("speech_balloon", "Dale contexto", "qué vendés"),
    ("memo", "Pedí formato", "en 3 viñetas"),
    ("white_check_mark", "Poné un límite", "4 líneas máx"),
    ("books", "Pegá tus datos", "tus precios"),
    ("sparkles", "Pedí de nuevo", "más corto"),
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
.grid{{display:grid;grid-template-columns:repeat(3,1fr);gap:60px 40px;margin-top:58px;width:100%}}
.celda{{display:flex;flex-direction:column;align-items:center;gap:20px}}
.celda img{{width:180px;height:180px;object-fit:contain;filter:grayscale(1) contrast(1.05)}}
.lbl{{font-size:34px;font-weight:600;color:var(--ink);text-align:center;line-height:1.45}}
.lbl .hl{{background:var(--verde);padding:1px 12px 4px;border-radius:8px;font-weight:800;
  white-space:nowrap;-webkit-box-decoration-break:clone;box-decoration-break:clone}}
.cta{{margin-top:24px;font-size:33px;font-weight:450;color:var(--ink);text-align:center;line-height:1.35}}
.cta b{{font-weight:650;background:var(--verde);border-radius:9px;padding:2px 14px;white-space:nowrap}}
.handle{{position:absolute;bottom:52px;left:0;right:0;text-align:center;font-family:'Geist Mono',monospace;font-size:27px;font-weight:500;letter-spacing:.08em;color:var(--muted)}}
/* el icono del collage va TAMBIEN en gris: este patron manda "iconos grayscale, color
   solo en los highlights verdes". Un icono 3D a todo color mete rosa/naranja que no
   estan en la paleta y le roba el unico acento a la palabra clave. */
.icono-flot{{position:absolute;object-fit:contain;filter:grayscale(1) contrast(1.05) drop-shadow(0 14px 22px rgba(0,0,0,.18))}}
/* la cinta SUJETA el bloque verde del remate — sola sobre el fondo plano lee como un
   rectangulo gris olvidado, no como collage (trampa #5 de la FICHA). */
.cinta{{position:absolute;width:190px;height:52px;background:rgba(0,0,0,.055);
  border:1px solid rgba(0,0,0,.05);box-shadow:0 3px 8px rgba(0,0,0,.05)}}
.sticker{{position:absolute;background:#0A0A0A;color:var(--verde);border-radius:50%;width:166px;height:166px;
  display:flex;align-items:center;justify-content:center;transform:rotate(12deg);font-weight:650;
  font-size:28px;line-height:1.1;text-align:center;box-shadow:0 14px 30px rgba(0,0,0,.25)}}
</style></head><body>
<div class="lienzo">
  <img class="icono-flot" src="{ICONOS}/brain.png" style="width:118px;top:96px;left:34px;transform:rotate(-12deg)">
  <div class="sticker" style="top:118px;right:36px">1 solo<br>MENSAJE</div>
  <div class="contexto">El secreto no es la IA</div>
  <div class="remate">ES CÓMO<br><span class="hl">SE PIDE</span></div>
  <div class="cinta" style="top:392px;left:150px;transform:rotate(-8deg)"></div>
  <div class="grid">{celdas_html}</div>
  <div class="cta">Comentá <b>COMUNIDAD</b> y te paso el enlace para unirte</div>
  <div class="handle">@sergiourcullo</div>
</div></body></html>"""


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    tmp = Path(tempfile.mkdtemp(prefix="gridpedir-"))
    f = tmp / "lamina.html"
    f.write_text(HTML, encoding="utf-8")
    png = OUT / "lamina-grid-pedir.png"
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-sandbox",
        "--window-size=1080,1350", "--force-device-scale-factor=1",
        "--virtual-time-budget=9000", f"--screenshot={png}", f.as_uri()],
        check=True, capture_output=True, timeout=90)
    print(f"OK lamina-grid-pedir.png {png.stat().st_size} bytes")
    shutil.rmtree(tmp, ignore_errors=True)


if __name__ == "__main__":
    main()
