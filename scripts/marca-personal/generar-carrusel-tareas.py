#!/usr/bin/env python3
"""Carrusel #3 del plan mensual — "Las 5 tareas que mas tiempo te roban (y como
las automatizo)", 7 laminas 1080x1350, patron statement-3d-minimal con marco
spec-sheet en portada (ganador del experimento 02-sep, ver BASE_CONTENIDO SS6).
Salida: carousels/out/carrusel-tareas-automatizadas/.

Las 5 tareas son las que Sergio automatiza DE VERDAD en su propia operacion (ver
BASE_CONTENIDO SS1 "Lo NUESTRO"): contenido, servidor, atencion a clientes,
seguimientos/agenda y artes. Sin cifras sin fuente, sin humo.
"""
import subprocess, tempfile, shutil
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
ICONOS = (REPO / "hermes-content/references/ui-patterns/statement-3d-minimal/iconos").as_uri()
OUT = REPO / "hermes-content/carousels/out/carrusel-tareas-automatizadas"

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
.icono{width:300px;height:300px;object-fit:contain}
.icono-sm{width:210px;height:210px;object-fit:contain}
.titulo{font-size:88px;font-weight:900;font-variation-settings:'wdth' 62;color:var(--ink);letter-spacing:0;word-spacing:.09em;text-align:center;line-height:1.02}
.sub{font-size:44px;font-weight:600;color:var(--muted);text-align:center}
.caja{background:var(--card);border-radius:36px;padding:56px 60px;font-size:40px;line-height:1.45;color:var(--ink);box-shadow:0 18px 50px rgba(0,0,0,.07);width:100%}
.caja b{font-weight:600;background:#EFEDEA;border-radius:8px;padding:0 8px}
.fila{display:flex;gap:110px;justify-content:center;align-items:flex-end}
.item{display:flex;flex-direction:column;align-items:center;gap:14px}
.item .lbl{font-size:30px;font-weight:400;color:var(--ink)}
.marco-top{position:absolute;top:0;left:0;right:0;display:flex;justify-content:space-between;
  padding:44px 56px;font-family:'Geist Mono',monospace;font-size:24px;font-weight:500;
  letter-spacing:.08em;text-transform:uppercase;color:var(--ink);border-bottom:2px solid var(--ink)}
.marco-bottom{position:absolute;bottom:0;left:0;right:0;display:flex;justify-content:space-between;
  padding:36px 56px 96px;font-family:'Geist Mono',monospace;font-size:22px;font-weight:500;
  letter-spacing:.06em;text-transform:uppercase;color:var(--muted);border-top:2px solid var(--ink)}
"""

SLIDES = [
    # 1 portada — marco spec-sheet
    f"""<div class="lienzo" style="gap:56px;padding-top:150px;padding-bottom:150px">
  <div class="marco-top"><span>ONIA SYSTEM &middot; GRID 1080&times;1350</span><span>V1.0</span></div>
  <div class="fila">
    <div class="item"><img class="icono-sm" src="{ICONOS}/spiral_calendar.png"><div class="lbl">Tiempo</div></div>
    <div class="item"><img class="icono-sm" src="{ICONOS}/robot.png"><div class="lbl">Automatico</div></div>
  </div>
  <div style="text-align:center">
    <div class="titulo" style="font-size:96px">Las 5 tareas que<br>m&aacute;s tiempo te roban</div>
    <div class="sub" style="margin-top:24px">y c&oacute;mo las automatizo en mi propio negocio</div>
  </div>
  <div class="fila">
    <div class="item"><img class="icono-sm" src="{ICONOS}/chart_increasing.png"><div class="lbl">Sin humo</div></div>
    <div class="item"><img class="icono-sm" src="{ICONOS}/white_check_mark.png"><div class="lbl">Probado</div></div>
  </div>
  <div class="marco-bottom"><span>TECHNICAL SPEC &middot; TEMA: AUTOMATIZACION</span><span>FORMATO: CARRUSEL</span></div>
  <div class="handle">@sergiourcullo</div>
</div>""",
    # 2 producir contenido
    f"""<div class="lienzo" style="gap:64px">
  <div style="display:flex;align-items:center;gap:70px">
    <div class="num">01</div>
    <img class="icono" src="{ICONOS}/memo.png">
  </div>
  <div class="titulo">Producir<br>contenido</div>
  <div class="caja">Un sistema en mi servidor escribe textos y artes <b>varias veces al d&iacute;a</b>, mientras yo hago otra cosa. Yo reviso y publico; no redacto desde cero.</div>
  <div class="handle">@sergiourcullo</div>
</div>""",
    # 3 cuidar el servidor
    f"""<div class="lienzo" style="gap:64px">
  <div style="display:flex;align-items:center;gap:70px">
    <div class="num">02</div>
    <img class="icono" src="{ICONOS}/robot.png">
  </div>
  <div class="titulo">Cuidar el<br>servidor</div>
  <div class="caja">Cada pocos minutos algo revisa que todo est&eacute; vivo. Si un servicio se cae, <b>se reinicia solo</b> y me avisa por Telegram &mdash;no espero a que un cliente me diga que algo no funciona.</div>
  <div class="handle">@sergiourcullo</div>
</div>""",
    # 4 atender clientes
    f"""<div class="lienzo" style="gap:64px">
  <div style="display:flex;align-items:center;gap:70px">
    <div class="num">03</div>
    <img class="icono" src="{ICONOS}/speech_balloon.png">
  </div>
  <div class="titulo">Atender<br>clientes</div>
  <div class="caja">Un chatbot con IA contesta, califica y agenda. Si el pedido necesita una persona, <b>me lo deriva a m&iacute;</b> &mdash;no reemplaza mi criterio, lo usa para saber cu&aacute;ndo llamarme.</div>
  <div class="handle">@sergiourcullo</div>
</div>""",
    # 5 seguimientos y agenda
    f"""<div class="lienzo" style="gap:64px">
  <div style="display:flex;align-items:center;gap:70px">
    <div class="num">04</div>
    <img class="icono" src="{ICONOS}/spiral_calendar.png">
  </div>
  <div class="titulo">Seguimientos<br>y agenda</div>
  <div class="caja">Los recordatorios de cita y el seguimiento despu&eacute;s de un silencio los manda un flujo autom&aacute;tico &mdash;<b>no yo escribiendo</b> uno por uno cada vez.</div>
  <div class="handle">@sergiourcullo</div>
</div>""",
    # 6 generar artes
    f"""<div class="lienzo" style="gap:64px">
  <div style="display:flex;align-items:center;gap:70px">
    <div class="num">05</div>
    <img class="icono" src="{ICONOS}/sparkles.png">
  </div>
  <div class="titulo">Generar<br>artes</div>
  <div class="caja">Las im&aacute;genes de esta misma pieza salen de una terminal, con el <b>costo calculado antes</b> de generar cada una. Nada de abrir un editor a mano.</div>
  <div class="handle">@sergiourcullo</div>
</div>""",
    # 7 CTA comunidad
    f"""<div class="lienzo" style="gap:56px">
  <img class="icono" src="{ICONOS}/light_bulb.png">
  <div class="titulo">Ninguna la armé<br>de un d&iacute;a para otro</div>
  <div class="sub">Comentá <b style="color:var(--ink)">COMUNIDAD</b> y te paso el enlace para unirte</div>
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
