#!/usr/bin/env python3
"""Lamina grid 2x3: los 6 mensajes que un negocio repite todo el dia y que se
escriben UNA vez en Respuestas rapidas de WhatsApp Business.
1080x1350. Salida: hermes-content/carousels/out/lamina-grid-mensajes.png

POR QUE ESTE TEMA: es el paso 1 del statement «Atender clientes 24/7 · solo son 4
cosas» (t_d4a7c724), cuyo caption manda a cargar "las cinco preguntas que mas te
repiten". Esta lamina se las entrega escritas: la pieza anterior dice QUE hacer,
esta dice CUALES. Cumple la regla de contenido -ensenar algo aplicable YA-, no
declarar.

COPIA `generar-lamina-grid-ia.py`, que es el patron migrado a la tipografia de marca.
Lo que se hereda de ahi y NO se re-descubre:
  · remate 650 / `wdth` 96 en DOS lineas de <=7 caracteres. El condensed 62 esta
    PROHIBIDO (Sergio lo rechazo el 02-sep) y ademas `wdth` 96 es mas ancho: un
    remate de una linea desborda los 880px utiles. Aca: "ESCRIBI" (7) / "UNA VEZ" (7).
  · celdas 190px, iconos en escala de grises y el color SOLO en los highlights verdes.
  · la cinta se apoya SOBRE el bloque verde del remate: sola sobre el fondo plano lee
    como un rectangulo gris olvidado, no como collage.
  · el sticker dice algo ("en 10 MINUTOS"), no metadata decorativa.

Los 6 iconos salen del set que YA existe en el repo (statement-3d-minimal/iconos):
no se baja ninguno nuevo, asi que esto corre sin red.
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
    hallado = shutil.which("chromium") or shutil.which("google-chrome") or shutil.which("chromium-browser")
    if hallado:
        return hallado
    raise SystemExit("no encuentro Chrome/Chromium para renderizar")


CHROME = _chrome()

# Cada celda es un mensaje REAL que el dueno ya contesta a mano. El icono se elige
# por lo que dice, no por decorar: sin eso la grilla es seis adornos.
CELDAS = [
    ("money_bag", "Cuánto sale", "y cómo se paga"),
    ("spiral_calendar", "Qué horario", "tenés hoy"),
    ("white_check_mark", "Sí hay lugar", "así reservás"),
    ("bell", "Tu pedido", "cuándo llega"),
    ("busts_in_silhouette", "No estoy ahora", "te contesto a las 9"),
    ("memo", "Qué necesito", "para empezar"),
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
.contexto{{font-size:47px;font-weight:450;color:var(--muted);text-align:center;line-height:1.2}}
/* remate en DOS lineas de <=7 caracteres: `wdth` 96 es mas ancho que el condensed 62
   que esta prohibido. Tope medido en el patron: 138px para 9 caracteres en 880px. */
.remate{{font-size:130px;font-weight:650;font-variation-settings:'wdth' 96;color:var(--ink);
  text-align:center;line-height:.98;letter-spacing:-0.035em;margin-top:10px}}
.remate .hl{{background:var(--verde);border-radius:12px;padding:2px 22px 10px;white-space:nowrap;
  -webkit-box-decoration-break:clone;box-decoration-break:clone}}
.grid{{display:grid;grid-template-columns:repeat(3,1fr);gap:60px 34px;margin-top:70px;width:100%}}
.celda{{display:flex;flex-direction:column;align-items:center;gap:20px}}
.celda img{{width:180px;height:180px;object-fit:contain;filter:grayscale(1) contrast(1.05)}}
.lbl{{font-size:33px;font-weight:600;color:var(--ink);text-align:center;line-height:1.45}}
.lbl .hl{{background:var(--verde);padding:1px 11px 4px;border-radius:8px;font-weight:800;
  white-space:nowrap;-webkit-box-decoration-break:clone;box-decoration-break:clone}}
.pie{{position:absolute;bottom:108px;left:0;right:0;text-align:center;font-size:34px;
  font-weight:500;color:var(--muted);line-height:1.3}}
.pie b{{color:var(--ink);font-weight:650}}
.handle{{position:absolute;bottom:52px;left:0;right:0;text-align:center;font-family:'Geist Mono',monospace;font-size:27px;font-weight:500;letter-spacing:.08em;color:var(--muted)}}
/* el icono del collage va TAMBIEN en gris: este patron manda iconos grayscale y color
   solo en los highlights verdes. A todo color mete rosa/naranja fuera de paleta. */
.icono-flot{{position:absolute;object-fit:contain;filter:grayscale(1) contrast(1.05) drop-shadow(0 14px 22px rgba(0,0,0,.18))}}
/* la cinta SUJETA el bloque verde del remate (visto al 100% el 03-sep). */
.cinta{{position:absolute;width:190px;height:52px;background:rgba(0,0,0,.055);
  border:1px solid rgba(0,0,0,.05);box-shadow:0 3px 8px rgba(0,0,0,.05)}}
.sticker{{position:absolute;background:#0A0A0A;color:var(--verde);border-radius:50%;width:166px;height:166px;
  display:flex;align-items:center;justify-content:center;transform:rotate(12deg);font-weight:650;
  font-size:29px;line-height:1.1;text-align:center;box-shadow:0 14px 30px rgba(0,0,0,.25)}}
</style></head><body>
<div class="lienzo">
  <img class="icono-flot" src="{ICONOS}/speech_balloon.png" style="width:118px;top:94px;left:34px;transform:rotate(-12deg)">
  <div class="sticker" style="top:116px;right:36px">en 10<br>MINUTOS</div>
  <!-- ⚠️ El contexto NO puede pasar de ~26 caracteres: el sticker vive en el borde
       derecho (right:36px, 166px de ancho) y la primera version -"Los 6 mensajes que
       repetís todo el día", 37 caracteres- le tapaba la ultima letra. Se vio MIRANDO
       el render, no midiendo el archivo: pesaba 180 KB y estaba mal igual. -->
  <div class="contexto">Los 6 mensajes de siempre</div>
  <div class="remate">ESCRIBÍ<br><span class="hl">UNA VEZ</span></div>
  <div class="cinta" style="top:392px;left:150px;transform:rotate(-8deg)"></div>
  <div class="grid">{celdas_html}</div>
  <div class="pie">WhatsApp Business → Herramientas → <b>Respuestas rápidas</b></div>
  <div class="handle">@sergiourcullo</div>
</div></body></html>"""


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    tmp = Path(tempfile.mkdtemp(prefix="grid-msj-"))
    f = tmp / "lamina.html"
    f.write_text(HTML, encoding="utf-8")
    png = OUT / "lamina-grid-mensajes.png"
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-sandbox",
        "--window-size=1080,1350", "--force-device-scale-factor=1",
        "--virtual-time-budget=8000", f"--screenshot={png}", f.as_uri()],
        check=True, capture_output=True, timeout=90)
    print(f"OK lamina-grid-mensajes.png {png.stat().st_size} bytes")
    shutil.rmtree(tmp, ignore_errors=True)


if __name__ == "__main__":
    main()
