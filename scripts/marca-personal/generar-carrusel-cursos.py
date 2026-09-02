#!/usr/bin/env python3
"""Carrusel "2 cursos de IA gratis con certificado" — 5 laminas 1080x1350,
patron statement-3d-minimal. Salida: carousels/out/carrusel-cursos-gratis/."""
import subprocess, tempfile, shutil
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
ICONOS = (REPO / "hermes-content/references/ui-patterns/statement-3d-minimal/iconos").as_uri()
OUT = REPO / "hermes-content/carousels/out/carrusel-cursos-gratis"

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

CSS = """
@import url('https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&family=Geist+Mono:wght@500&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
:root{--bg:#F7F7F7;--ink:#0A0A0A;--muted:#8E8E8E;--card:#FFFFFF}
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
"""

SLIDES = [
    # 1 portada
    f"""<div class="lienzo" style="gap:64px">
  <div class="fila">
    <div class="item"><img class="icono-sm" src="{ICONOS}/graduation_cap.png"><div class="lbl">Gratis</div></div>
    <div class="item"><img class="icono-sm" src="{ICONOS}/trophy.png"><div class="lbl">Certificado</div></div>
  </div>
  <div style="text-align:center">
    <div class="num" style="font-size:150px">2 cursos</div>
    <div class="sub" style="margin-top:14px">de IA, gratis y con certificado</div>
  </div>
  <div class="fila">
    <div class="item"><img class="icono-sm" src="{ICONOS}/brain.png"><div class="lbl">Aprendé</div></div>
    <div class="item"><img class="icono-sm" src="{ICONOS}/sparkles.png"><div class="lbl">Aplicá</div></div>
  </div>
  <div class="handle">@sergiourcullo</div>
</div>""",
    # 2 Anthropic Academy
    f"""<div class="lienzo" style="gap:64px">
  <div style="display:flex;align-items:center;gap:70px">
    <div class="num">01</div>
    <img class="icono" src="{ICONOS}/graduation_cap.png">
  </div>
  <div class="titulo">Anthropic Academy</div>
  <div class="caja">El curso oficial de <b>Claude</b>, la IA que uso para construir mi empresa. En serio: yo lo hice y el certificado está en mi LinkedIn.<br><br>👉 <b>anthropic.com/learn</b></div>
  <div class="handle">@sergiourcullo</div>
</div>""",
    # 3 Elements of AI
    f"""<div class="lienzo" style="gap:64px">
  <div style="display:flex;align-items:center;gap:70px">
    <div class="num">02</div>
    <img class="icono" src="{ICONOS}/books.png">
  </div>
  <div class="titulo">Elements of AI</div>
  <div class="caja">El curso de fundamentos más famoso del mundo, de la Universidad de Helsinki. <b>Disponible en español</b> y sin costo.<br><br>👉 <b>elementsofai.com</b></div>
  <div class="handle">@sergiourcullo</div>
</div>""",
    # 4 certificado en LinkedIn
    f"""<div class="lienzo" style="gap:64px">
  <img class="icono" src="{ICONOS}/trophy.png">
  <div class="titulo">Colgá el certificado<br>en tu LinkedIn</div>
  <div class="caja">Al terminar, los dos te dan certificado digital. En LinkedIn: <b>Perfil → Añadir sección → Licencias y certificaciones</b>. Queda visible para clientes y empleadores.</div>
  <div class="handle">@sergiourcullo</div>
</div>""",
    # 5 CTA
    f"""<div class="lienzo" style="gap:56px">
  <img class="icono" src="{ICONOS}/sparkles.png">
  <div class="titulo">Cada día comparto<br>un recurso así</div>
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
