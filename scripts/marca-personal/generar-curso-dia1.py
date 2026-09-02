#!/usr/bin/env python3
"""Dia 1 — post de feed (presentacion VISUAL de la comunidad, mockup de chat)
+ 4 historias de validacion del curso. TIPOGRAFIA REAL de la landing viva
(layout.tsx onia-platform): Archivo cuerpo 450, titulos 600-650, wordmark
560/wdth 96 — SIN black 900, SIN condensed. Geist Mono micro-etiquetas."""
import subprocess, tempfile, shutil, sys
from pathlib import Path

OUT = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).parent / "curso-dia1"
ICONOS = (Path(sys.argv[2]) if len(sys.argv) > 2 else Path(__file__).parent / "iconos").resolve().as_uri()

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

BASE_CSS = """
@import url('https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&family=Geist+Mono:wght@500&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{background:#00C661;font-family:'Archivo',sans-serif;font-weight:450;overflow:hidden}
.lienzo{display:flex;flex-direction:column;align-items:center;position:relative}
.pill{background:#0A0A0A;color:#00C661;font-size:34px;font-weight:650;letter-spacing:.04em;padding:18px 44px;border-radius:60px}
.wordmark{font-weight:560;font-variation-settings:'wdth' 96;color:#0A0A0A;text-align:center;line-height:1;letter-spacing:-0.03em}
.titulo{font-weight:650;font-variation-settings:'wdth' 96;color:#0A0A0A;text-align:center;line-height:1.08;letter-spacing:-0.02em}
.sub{font-size:42px;font-weight:450;color:rgba(0,0,0,.68);text-align:center;line-height:1.4}
.zona{border:5px dashed rgba(0,0,0,.35);border-radius:36px;width:86%;flex:1;display:flex;align-items:center;justify-content:center}
.zona span{font-family:'Geist Mono',monospace;font-size:30px;letter-spacing:.12em;color:rgba(0,0,0,.45)}
.handle{position:absolute;bottom:54px;left:0;right:0;text-align:center;font-family:'Geist Mono',monospace;font-size:26px;font-weight:500;letter-spacing:.08em;color:rgba(0,0,0,.55)}
.card{background:#111312;border-radius:40px;padding:60px 58px;width:100%;color:#EDEDED;box-shadow:0 24px 60px rgba(0,0,0,.22)}
.op{display:flex;align-items:center;gap:26px;padding:17px 0;font-size:42px;font-weight:500}
.op b{color:#00C661;font-weight:650;font-size:46px;flex:none;width:56px}
/* mockup chat */
.chat{background:#FFFFFF;border-radius:44px;padding:42px 42px;width:100%;box-shadow:0 26px 60px rgba(0,0,0,.20);display:flex;flex-direction:column;gap:26px;position:relative}
.chat .dia{align-self:center;background:#F1F1F1;color:#777;font-size:26px;font-weight:500;padding:10px 26px;border-radius:30px}
.burbuja{background:#EFFAF3;border:2px solid #DDF2E4;border-radius:26px;border-top-left-radius:8px;padding:24px 30px;max-width:92%;align-self:flex-start;position:relative}
.burbuja .autor{font-size:26px;font-weight:650;color:#00A854;margin-bottom:6px}
.burbuja .txt{font-size:33px;font-weight:450;color:#222;line-height:1.35}
.burbuja .hora{position:absolute;right:16px;bottom:10px;font-size:22px;color:#9AA;font-weight:450}
.icono-flot{position:absolute;object-fit:contain;filter:drop-shadow(0 14px 22px rgba(0,0,0,.18))}
.cinta{position:absolute;width:190px;height:52px;background:rgba(255,255,255,.5);border:1px solid rgba(0,0,0,.05);box-shadow:0 3px 8px rgba(0,0,0,.06)}
.sticker{position:absolute;background:#0A0A0A;color:#00C661;border-radius:50%;width:170px;height:170px;display:flex;align-items:center;justify-content:center;transform:rotate(12deg);font-weight:650;font-size:31px;line-height:1.1;text-align:center;box-shadow:0 14px 30px rgba(0,0,0,.25)}
.burbuja.codigo{background:#111312;border-color:#111312;border-top-left-radius:26px}
.burbuja.codigo .txt{font-family:'Geist Mono',monospace;font-size:27px;color:#E8E8E8;line-height:1.5}
.burbuja.codigo .txt b{color:#00C661;font-weight:500}
.burbuja.codigo .autor{color:#00C661}
"""

FEED = f"""<div class="lienzo" style="width:1080px;height:1350px;justify-content:center;gap:34px;padding:66px 84px 108px">
  <div class="pill">GRATIS · CADA DÍA</div>
  <div class="wordmark" style="font-size:104px">Onia Community</div>
  <div class="chat">
    <div class="cinta" style="top:-24px;left:70px;transform:rotate(-7deg)"></div>
    <div class="cinta" style="top:-20px;right:90px;transform:rotate(5deg)"></div>
    <img class="icono-flot" src="{ICONOS}/light_bulb.png" style="width:140px;top:-58px;left:-48px;transform:rotate(-10deg)">
    <div class="sticker" style="right:-44px;top:-64px">esto llega<br>HOY</div>
    <div class="dia">HOY · 09:00</div>
    <div class="burbuja"><div class="autor">Sergio · Onia</div><div class="txt">Armá una IA que responda a tus clientes en 10 min: entrá a <b style="font-weight:650">claude.ai</b> y pegale esto 👇</div></div>
    <div class="burbuja codigo"><div class="autor">prompt listo para copiar</div><div class="txt">Sos el asistente de <b>[mi negocio]</b>. Respondé precios, horarios y stock con esta info: <b>[pegá tu lista]</b>. Amable, directo, máximo 3 líneas.</div></div>
    <div class="burbuja"><div class="autor">Sergio · Onia</div><div class="txt">📸 Mañana: fotos de producto de catálogo con tu celular, paso a paso</div></div>
    <img class="icono-flot" src="{ICONOS}/rocket.png" style="width:150px;bottom:-52px;right:-48px;transform:rotate(12deg)">
  </div>
  <div class="titulo" style="font-size:47px">¿Querés el paso a paso completo cada día?<br>Comentá <span style="background:#0A0A0A;color:#00C661;padding:2px 18px;border-radius:12px">COMUNIDAD</span> y te paso el enlace</div>
  <div class="handle">@sergiourcullo</div>
</div>"""

H1 = f"""<div class="lienzo" style="width:1080px;height:1920px;justify-content:center;gap:44px;padding:120px 90px">
  <div class="pill">HOY ARRANCA</div>
  <div class="wordmark" style="font-size:112px">Onia<br>Community</div>
  <div class="chat" style="width:100%">
    <div class="cinta" style="top:-22px;left:60px;transform:rotate(-7deg)"></div>
    <img class="icono-flot" src="{ICONOS}/light_bulb.png" style="width:130px;top:-54px;right:-40px;transform:rotate(10deg)">
    <div class="burbuja"><div class="autor">Sergio · Onia</div><div class="txt">Cada día: una herramienta o prompt que uso de verdad en mi empresa — gratis</div></div>
    <div class="burbuja"><div class="autor">Sergio · Onia</div><div class="txt">🧰 El de hoy ya está en el feed: tu asistente de clientes en 10 minutos</div></div>
  </div>
  <div class="sub" style="font-weight:650;color:#0A0A0A;font-size:38px">seguí →</div>
  <div class="handle">@sergiourcullo</div>
</div>"""

H2 = f"""<div class="lienzo" style="width:1080px;height:1920px;justify-content:center;gap:52px;padding:150px 90px">
  <div class="pill">LO QUE VIENE</div>
  <div class="titulo" style="font-size:108px">Y esto recién<br>empieza</div>
  <div class="sub">más adelante quiero armar un curso:<br>el sistema COMPLETO, paso a paso —<br>y lo voy a armar con vos</div>
  <img class="icono-flot" src="{ICONOS}/rocket.png" style="position:static;width:170px;transform:rotate(8deg)">
  <div class="sub" style="font-weight:650;color:#0A0A0A;font-size:38px">decime qué necesitás →</div>
  <div class="handle">@sergiourcullo</div>
</div>"""

H3 = """<div class="lienzo" style="width:1080px;height:1920px;gap:50px;padding:140px 90px 120px">
  <div class="titulo" style="font-size:86px">¿Qué querés que<br>enseñe primero?</div>
  <div class="card">
    <div class="op"><b>A</b> que responda solo por WhatsApp</div>
    <div class="op"><b>B</b> fotos y anuncios sin diseñador</div>
    <div class="op"><b>C</b> cotizaciones en 1 minuto</div>
    <div class="op"><b>D</b> TODO el sistema, mientras dormís</div>
  </div>
  <div class="zona"><span>ENCUESTA ACÁ</span></div>
  <div class="handle">@sergiourcullo</div>
</div>"""

H4 = """<div class="lienzo" style="width:1080px;height:1920px;gap:54px;padding:150px 90px 120px">
  <div class="titulo" style="font-size:92px">¿Qué te gustaría<br>aprender sí o sí?</div>
  <div class="sub">decímelo con tus palabras —<br>lo leo TODO y con eso armo el contenido</div>
  <div class="zona"><span>CAJA DE PREGUNTAS ACÁ</span></div>
  <div class="handle">@sergiourcullo</div>
</div>"""

H5 = """<div class="lienzo" style="width:1080px;height:1920px;justify-content:center;gap:56px;padding:150px 90px">
  <div class="titulo" style="font-size:96px">Entrá gratis.<br>Somos los primeros.</div>
  <div class="sub">cada día una herramienta o prompt<br>en mi comunidad de WhatsApp</div>
  <div class="pill" style="font-size:42px">RESPONDÉ: COMUNIDAD</div>
  <div class="sub" style="font-size:36px">a esta historia y te paso el enlace</div>
  <div class="handle">@sergiourcullo</div>
</div>"""

PIEZAS = [("post-feed", FEED, 1080, 1350), ("historia-1-arranque", H1, 1080, 1920),
          ("historia-2-lo-que-viene", H2, 1080, 1920), ("historia-3-encuesta", H3, 1080, 1920),
          ("historia-4-preguntas", H4, 1080, 1920), ("historia-5-comunidad", H5, 1080, 1920)]

def main():
    OUT.mkdir(parents=True, exist_ok=True)
    tmp = Path(tempfile.mkdtemp(prefix="curso-"))
    for nombre, cuerpo, w, h in PIEZAS:
        css = BASE_CSS + f"html,body{{width:{w}px;height:{h}px}}"
        html = f"<!doctype html><html><head><meta charset='utf-8'><style>{css}</style></head><body>{cuerpo}</body></html>"
        f = tmp / f"{nombre}.html"
        f.write_text(html, encoding="utf-8")
        png = OUT / f"{nombre}.png"
        subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-sandbox",
            f"--window-size={w},{h}", "--force-device-scale-factor=1",
            "--virtual-time-budget=8000", f"--screenshot={png}", f.as_uri()],
            check=True, capture_output=True, timeout=90)
        print(f"OK {nombre}.png {png.stat().st_size} bytes")
    shutil.rmtree(tmp, ignore_errors=True)

if __name__ == "__main__":
    main()
