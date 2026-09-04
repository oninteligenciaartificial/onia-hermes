#!/usr/bin/env python3
"""Pieza de venta — "tu negocio responde solo" (chatbot/recepcionista IA de Onia),
5 laminas 1080x1350, patron statement-3d-minimal. Salida:
carousels/out/carrusel-chatbot-venta/.

Fuente de las promesas: hermes-content/docs/ONIA_CATALOGO_DE_VENTA.md SS5 Add-ons ->
"Chatbot con IA (web + WhatsApp)", estado vivo. SIN PRECIO: el catalogo no lo escribe
ahi (vive en pricing.ts, que esta pieza no cita), asi que la pieza sale sin numero.
"""
import subprocess, tempfile, shutil
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
ICONOS = (REPO / "hermes-content/references/ui-patterns/statement-3d-minimal/iconos").as_uri()
OUT = REPO / "hermes-content/carousels/out/carrusel-chatbot-venta"

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
:root{--bg:#F7F7F7;--ink:#0A0A0A;--muted:#8E8E8E;--card:#FFFFFF;--verde:#00C661}
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
.cta{font-weight:900;color:var(--ink);background:var(--verde);border-radius:10px;padding:2px 16px 6px}
"""

SLIDES = [
    # 1 portada — sin marco: Sergio descarto el spec-sheet el 02-sep (BASE_CONTENIDO SS7)
    f"""<div class="lienzo" style="gap:56px;padding-top:150px;padding-bottom:150px">
  <div class="fila">
    <div class="item"><img class="icono-sm" src="{ICONOS}/robot.png"><div class="lbl">24/7</div></div>
    <div class="item"><img class="icono-sm" src="{ICONOS}/speech_balloon.png"><div class="lbl">WhatsApp</div></div>
  </div>
  <div style="text-align:center">
    <div class="titulo" style="font-size:110px">Tu negocio<br>responde solo</div>
    <div class="sub" style="margin-top:24px">chatbot con IA, atendiendo mientras dormís</div>
  </div>
  <div class="fila">
    <div class="item"><img class="icono-sm" src="{ICONOS}/chart_increasing.png"><div class="lbl">Vende</div></div>
    <div class="item"><img class="icono-sm" src="{ICONOS}/white_check_mark.png"><div class="lbl">Deriva</div></div>
  </div>
  <div class="handle">@sergiourcullo</div>
</div>""",
    # 2 contesta, califica, deriva
    f"""<div class="lienzo" style="gap:64px">
  <div style="display:flex;align-items:center;gap:70px">
    <div class="num">01</div>
    <img class="icono" src="{ICONOS}/robot.png">
  </div>
  <div class="titulo">Contesta, califica<br>y deriva</div>
  <div class="caja">Responde a cada cliente en el momento. Si el pedido necesita una persona &mdash;por ejemplo, agendar una cita&mdash; <b>lo escala solo</b> a tu bandeja. No reemplaza tu criterio: lo usa para saber cu&aacute;ndo llamarte.</div>
  <div class="handle">@sergiourcullo</div>
</div>""",
    # 3 vos editas el guion charlando
    f"""<div class="lienzo" style="gap:64px">
  <div style="display:flex;align-items:center;gap:70px">
    <div class="num">02</div>
    <img class="icono" src="{ICONOS}/speech_balloon.png">
  </div>
  <div class="titulo">Vos le ense&ntilde;&aacute;s<br>charlando</div>
  <div class="caja">Nada de programar. Le contás qué querés que diga y él te muestra su guion en pasos, para que lo ajustés vos mismo cuando quieras.</div>
  <div class="handle">@sergiourcullo</div>
</div>""",
    # 4 entiende fotos y audios + seguimiento
    f"""<div class="lienzo" style="gap:64px">
  <div style="display:flex;align-items:center;gap:70px">
    <div class="num">03</div>
    <img class="icono" src="{ICONOS}/spiral_calendar.png">
  </div>
  <div class="titulo">Entiende fotos<br>y audios</div>
  <div class="caja">El cliente manda una nota de voz o una foto del producto: el bot la entiende y sigue la conversación. Y si queda en silencio, <b>hace el seguimiento</b> por vos.</div>
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
