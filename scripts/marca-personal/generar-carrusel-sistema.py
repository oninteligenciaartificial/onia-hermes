#!/usr/bin/env python3
"""Pieza de venta — "un sistema, no una lista de apps" (las 4 capacidades del nucleo
Onia YA vivas: agenda, clientes, servicios, inventario), 5 laminas 1080x1350, marco
spec-sheet (ganador del experimento 02-sep). Salida:
carousels/out/carrusel-sistema-venta/.

Fuente de las promesas: hermes-content/docs/ONIA_CATALOGO_DE_VENTA.md SS4 Modulos del
producto -> Agenda y citas / Clientes-pacientes / Servicios-tratamientos / Inventario
simple, las 4 en estado 🟢. SIN PRECIO: el catalogo no lo escribe ahi (vive en
subscription-plans.ts, que esta pieza no cita).

Portada con arte Higgsfield (text2image_soul_v2, 0,12 cr, ver
ONIA_MARCA_PERSONAL_HIGGSFIELD_RECETAS.md) en vez de icono Fluent: ganó el experimento
A/B de esta misma corrida (carousels/out/experimento-arte-higgsfield-vs-icono/) — el
engranaje literaliza "sistema" y el verde marca encaja mejor que el clipart generico.
El resto de la pieza sigue con iconos Fluent (gratis): el arte pago se reserva para la
portada/hero, no para cada lamina — ver veredicto en BASE_CONTENIDO SS6.
"""
import subprocess, tempfile, shutil
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
ICONOS = (REPO / "hermes-content/references/ui-patterns/statement-3d-minimal/iconos").as_uri()
ARTE = (REPO / "hermes-content/references/marca-personal/higgsfield-artes/sistema-engranajes.png").as_uri()
OUT = REPO / "hermes-content/carousels/out/carrusel-sistema-venta"

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

CSS = """
@import url('https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&family=Geist+Mono:wght@500&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
:root{--bg:#F7F7F7;--ink:#0A0A0A;--muted:#8E8E8E;--card:#FFFFFF;--verde:#1F7A4D}
html,body{width:1080px;height:1350px}
body{background:var(--bg);font-family:'Archivo',sans-serif;overflow:hidden}
.lienzo{width:1080px;height:1350px;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:90px 100px;position:relative}
.handle{position:absolute;bottom:52px;left:0;right:0;text-align:center;font-family:'Geist Mono',monospace;font-size:27px;font-weight:500;letter-spacing:.08em;color:var(--muted)}
.num{font-size:200px;font-weight:900;font-variation-settings:'wdth' 125;color:var(--ink);letter-spacing:-0.02em;line-height:.9}
.icono{width:300px;height:300px;object-fit:contain;filter:drop-shadow(0 30px 45px rgba(0,0,0,.25))}
.arte{width:340px;height:340px;object-fit:contain;filter:drop-shadow(0 30px 45px rgba(0,0,0,.25))}
.titulo{font-size:88px;font-weight:900;font-variation-settings:'wdth' 62;color:var(--ink);letter-spacing:0;word-spacing:.09em;text-align:center;line-height:1.02}
.sub{font-size:44px;font-weight:600;color:var(--muted);text-align:center}
.caja{background:var(--card);border-radius:36px;padding:56px 60px;font-size:40px;line-height:1.45;color:var(--ink);box-shadow:0 18px 50px rgba(0,0,0,.07);width:100%}
.caja b{font-weight:600;background:#EFEDEA;border-radius:8px;padding:0 8px}
.cta{font-weight:900;color:var(--verde)}
.marco-top{position:absolute;top:0;left:0;right:0;display:flex;justify-content:space-between;
  padding:44px 56px;font-family:'Geist Mono',monospace;font-size:24px;font-weight:500;
  letter-spacing:.08em;text-transform:uppercase;color:var(--ink);border-bottom:2px solid var(--ink)}
.marco-bottom{position:absolute;bottom:0;left:0;right:0;display:flex;justify-content:space-between;
  padding:36px 56px 96px;font-family:'Geist Mono',monospace;font-size:22px;font-weight:500;
  letter-spacing:.06em;text-transform:uppercase;color:var(--muted);border-top:2px solid var(--ink)}
"""

SLIDES = [
    # 1 portada — marco spec-sheet + arte Higgsfield (hero, no icono)
    f"""<div class="lienzo" style="gap:56px;padding-top:150px;padding-bottom:150px">
  <div class="marco-top"><span>ONIA SYSTEM &middot; GRID 1080&times;1350</span><span>V1.0</span></div>
  <img class="arte" src="{ARTE}">
  <div style="text-align:center">
    <div class="titulo">Un sistema,<br>no una lista de apps</div>
    <div class="sub" style="margin-top:24px">agenda, clientes e inventario en un solo lugar</div>
  </div>
  <div class="marco-bottom"><span>TECHNICAL SPEC &middot; TEMA: SISTEMA POR RUBRO</span><span>FORMATO: CARRUSEL</span></div>
  <div class="handle">@sergiourcullo</div>
</div>""",
    # 2 agenda y citas
    f"""<div class="lienzo" style="gap:64px">
  <div style="display:flex;align-items:center;gap:70px">
    <div class="num">01</div>
    <img class="icono" src="{ICONOS}/spiral_calendar.png">
  </div>
  <div class="titulo">Cada cita,<br>agendada sola</div>
  <div class="caja">El cliente reserva desde un link o vos la cargás en un toque. <b>Nada en un cuaderno ni en un grupo de WhatsApp</b>: la agenda vive en un solo lugar y no se pisa.</div>
  <div class="handle">@sergiourcullo</div>
</div>""",
    # 3 clientes con ficha completa
    f"""<div class="lienzo" style="gap:64px">
  <div style="display:flex;align-items:center;gap:70px">
    <div class="num">02</div>
    <img class="icono" src="{ICONOS}/memo.png">
  </div>
  <div class="titulo">La ficha de cada<br>cliente, a mano</div>
  <div class="caja">Historial, contacto y lo que compró o atendió antes &mdash;todo junto, sin buscar en tres lugares distintos cuando te escribe de nuevo.</div>
  <div class="handle">@sergiourcullo</div>
</div>""",
    # 4 servicios e inventario
    f"""<div class="lienzo" style="gap:64px">
  <div style="display:flex;align-items:center;gap:70px">
    <div class="num">03</div>
    <img class="icono" src="{ICONOS}/white_check_mark.png">
  </div>
  <div class="titulo">Sabés qué tenés<br>y qué vendiste</div>
  <div class="caja">Servicios y stock cargados una vez, no anotados a mano cada día. El sistema habla el vocabulario de <b>tu rubro</b>: no te obliga al de otro negocio.</div>
  <div class="handle">@sergiourcullo</div>
</div>""",
    # 5 CTA venta
    f"""<div class="lienzo" style="gap:56px">
  <img class="icono" src="{ICONOS}/rocket.png">
  <div class="titulo">Lo armamos para<br>tu negocio</div>
  <div class="sub">Escribime <span class="cta">AUTOMATIZAR</span> y te cuento c&oacute;mo</div>
  <div class="handle">@sergiourcullo</div>
</div>""",
]

def main():
    OUT.mkdir(parents=True, exist_ok=True)
    tmp = Path(tempfile.mkdtemp(prefix="carrusel-"))
    for i, cuerpo in enumerate(SLIDES, 1):
        html = f"<!doctype html><html><head><meta charset='utf-8'><style>{CSS}</style></head><body>{cuerpo}</body></html>"
        f = tmp / f"lamina-{i:02d}.html"
        f.write_text(html, encoding="utf-8")
        png = OUT / f"lamina-{i:02d}.png"
        subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-sandbox",
            "--window-size=1080,1350", "--force-device-scale-factor=1",
            "--virtual-time-budget=8000", f"--screenshot={png}", f.as_uri()],
            check=True, capture_output=True, timeout=90)
        print(f"OK lamina-{i:02d}.png {png.stat().st_size} bytes")
    shutil.rmtree(tmp, ignore_errors=True)

if __name__ == "__main__":
    main()
