#!/usr/bin/env python3
"""Carrusel de bienvenida ONIA COMMUNITY — estilo VERDE Onia (#00C661).
3 laminas 1080x1350. Salida: carousels/out/carrusel-comunidad-bienvenida/."""
import subprocess, tempfile, shutil
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
ICONOS = (REPO / "hermes-content/references/ui-patterns/statement-3d-minimal/iconos").as_uri()
OUT = REPO / "hermes-content/carousels/out/carrusel-comunidad-bienvenida"

def _chrome():
    import os, glob
    if os.environ.get("CHROME_BIN"):
        return os.environ["CHROME_BIN"]
    candidatos = [r"C:\Program Files\Google\Chrome\Application\chrome.exe"]
    candidatos += sorted(glob.glob("/root/.cache/ms-playwright/chromium-*/chrome-linux64/chrome"), reverse=True)
    for c in candidatos:
        if Path(c).exists():
            return c
    raise SystemExit("No encontre Chrome/Chromium")

CHROME = _chrome()

CSS = """
@import url('https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&family=Geist+Mono:wght@500&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
:root{--verde:#00C661;--ink:#0A0A0A;--blanco:#FFFFFF}
html,body{width:1080px;height:1350px}
body{background:var(--verde);font-family:'Archivo',sans-serif;overflow:hidden}
.lienzo{width:1080px;height:1350px;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:90px 100px;position:relative;gap:56px}
.handle{position:absolute;bottom:52px;left:0;right:0;text-align:center;font-family:'Geist Mono',monospace;font-size:27px;font-weight:500;letter-spacing:.08em;color:rgba(0,0,0,.55)}
.wordmark{font-size:150px;font-weight:560;font-variation-settings:'wdth' 96;color:var(--ink);letter-spacing:-0.03em;line-height:.95;text-align:center}
.titulo{font-size:92px;font-weight:900;font-variation-settings:'wdth' 62;color:var(--ink);letter-spacing:0;word-spacing:.09em;text-align:center;line-height:1.02}
.sub{font-size:46px;font-weight:600;color:rgba(0,0,0,.65);text-align:center;line-height:1.3}
.pill{background:var(--ink);color:var(--verde);font-size:42px;font-weight:900;padding:22px 54px;border-radius:60px;letter-spacing:-0.01em}
.card{background:rgba(255,255,255,.94);border-radius:36px;padding:46px 54px;width:100%;display:flex;align-items:center;gap:40px;box-shadow:0 16px 40px rgba(0,0,0,.14)}
.card img{width:130px;height:130px;object-fit:contain;flex:none}
.card .t{font-size:44px;font-weight:900;color:var(--ink);letter-spacing:-0.02em}
.card .d{font-size:34px;font-weight:400;color:#444;margin-top:6px;line-height:1.3}
.icono{width:280px;height:280px;object-fit:contain}
"""

SLIDES = [
    # 1 portada
    f"""<div class="lienzo">
  <div class="pill">GRATIS · CADA DÍA</div>
  <div class="wordmark">Onia<br>Community</div>
  <div class="sub" style="font-size:41px">Los recursos de IA que uso de verdad<br>para construir mi empresa — con 16 años</div>
  <div class="handle">@sergiourcullo</div>
</div>""",
    # 2 qué recibís
    f"""<div class="lienzo" style="gap:44px">
  <div class="titulo">Qué recibís<br>todos los días</div>
  <div class="card"><img src="{ICONOS}/light_bulb.png"><div><div class="t">Una herramienta o prompt</div><div class="d">los mismos que uso yo, listos para copiar</div></div></div>
  <div class="card"><img src="{ICONOS}/laptop.png"><div><div class="t">Mi día a día</div><div class="d">construyendo una empresa de software desde Bolivia</div></div></div>
  <div class="card"><img src="{ICONOS}/money_bag.png"><div><div class="t">Cómo genero ingresos con IA</div><div class="d">sin humo — lo que funciona de verdad</div></div></div>
  <div class="handle">@sergiourcullo</div>
</div>""",
    # 3 CTA
    f"""<div class="lienzo">
  <img class="icono" src="{ICONOS}/rocket.png">
  <div class="titulo">Somos los primeros.<br>Entrá gratis.</div>
  <div class="pill">COMENTÁ: COMUNIDAD</div>
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
