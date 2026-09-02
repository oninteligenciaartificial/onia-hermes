#!/usr/bin/env python3
"""Dia 1 del curso — post de feed (1080x1350) + secuencia de 4 historias
(1080x1920). Sistema visual de marca: verde #00C661, Archivo variable,
Geist Mono. Zonas punteadas = ahi van los stickers nativos de IG."""
import subprocess, tempfile, shutil, sys
from pathlib import Path

OUT = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).parent / "curso-dia1"

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
body{background:#00C661;font-family:'Archivo',sans-serif;overflow:hidden}
.lienzo{display:flex;flex-direction:column;align-items:center;position:relative}
.pill{background:#0A0A0A;color:#00C661;font-size:40px;font-weight:900;padding:20px 50px;border-radius:60px}
.titulo{font-weight:900;font-variation-settings:'wdth' 62;word-spacing:.09em;color:#0A0A0A;text-align:center;line-height:1.02}
.sub{font-size:44px;font-weight:600;color:rgba(0,0,0,.65);text-align:center;line-height:1.35}
.zona{border:5px dashed rgba(0,0,0,.35);border-radius:36px;width:86%;flex:1;display:flex;align-items:center;justify-content:center}
.zona span{font-family:'Geist Mono',monospace;font-size:30px;letter-spacing:.12em;color:rgba(0,0,0,.45)}
.handle{position:absolute;bottom:54px;left:0;right:0;text-align:center;font-family:'Geist Mono',monospace;font-size:27px;font-weight:500;letter-spacing:.08em;color:rgba(0,0,0,.55)}
.card{background:#111312;border-radius:40px;padding:60px 58px;width:100%;color:#EDEDED;box-shadow:0 24px 60px rgba(0,0,0,.22)}
.op{display:flex;align-items:center;gap:26px;padding:17px 0;font-size:42px;font-weight:600}
.op b{color:#00C661;font-weight:900;font-size:46px;flex:none;width:56px}
"""

FEED = """<div class="lienzo" style="width:1080px;height:1350px;justify-content:center;gap:52px;padding:90px 100px">
  <div class="pill">SIN HUMO</div>
  <div class="titulo" style="font-size:150px">Estoy armando<br>EL CURSO</div>
  <div class="sub">el sistema completo que muestro acá,<br>paso a paso, para tu negocio</div>
  <div class="sub" style="font-size:40px;font-weight:900;color:#0A0A0A;margin-top:22px">Ayudame a armarlo:<br>contá en comentarios qué te urge más 👇</div>
  <div class="handle">@sergiourcullo</div>
</div>"""

H1 = """<div class="lienzo" style="width:1080px;height:1920px;justify-content:center;gap:56px;padding:150px 90px">
  <div class="pill">HOY</div>
  <div class="titulo" style="font-size:170px">Estoy armando<br>EL CURSO</div>
  <div class="sub">el sistema completo que muestro acá,<br>paso a paso — y lo armo con vos</div>
  <div class="sub" style="font-size:38px;font-weight:900;color:#0A0A0A">seguí →</div>
  <div class="handle">@sergiourcullo</div>
</div>"""

H2 = """<div class="lienzo" style="width:1080px;height:1920px;gap:50px;padding:140px 90px 120px">
  <div class="titulo" style="font-size:96px">¿Qué te urge más<br>en tu negocio?</div>
  <div class="card">
    <div class="op"><b>A</b> que responda solo por WhatsApp</div>
    <div class="op"><b>B</b> fotos y anuncios sin diseñador</div>
    <div class="op"><b>C</b> cotizaciones en 1 minuto</div>
    <div class="op"><b>D</b> TODO el sistema, mientras dormís</div>
  </div>
  <div class="zona"><span>ENCUESTA ACÁ</span></div>
  <div class="handle">@sergiourcullo</div>
</div>"""

H3 = """<div class="lienzo" style="width:1080px;height:1920px;gap:54px;padding:150px 90px 120px">
  <div class="titulo" style="font-size:104px">¿Qué tendría que<br>tener sí o sí?</div>
  <div class="sub">decímelo con tus palabras —<br>lo leo TODO y lo meto al temario</div>
  <div class="zona"><span>CAJA DE PREGUNTAS ACÁ</span></div>
  <div class="handle">@sergiourcullo</div>
</div>"""

H4 = """<div class="lienzo" style="width:1080px;height:1920px;justify-content:center;gap:58px;padding:150px 90px">
  <div class="titulo" style="font-size:104px">Mientras lo armo,<br>el paso a paso<br>va GRATIS</div>
  <div class="sub">cada día suelto una herramienta o prompt<br>en mi comunidad de WhatsApp</div>
  <div class="pill" style="font-size:44px">RESPONDÉ: COMUNIDAD</div>
  <div class="sub" style="font-size:36px">a esta historia y te paso el enlace</div>
  <div class="handle">@sergiourcullo</div>
</div>"""

PIEZAS = [("post-feed", FEED, 1080, 1350), ("historia-1-anuncio", H1, 1080, 1920),
          ("historia-2-encuesta", H2, 1080, 1920), ("historia-3-preguntas", H3, 1080, 1920),
          ("historia-4-comunidad", H4, 1080, 1920)]

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
