#!/usr/bin/env python3
"""EXPERIMENTO A/B — Marco spec-sheet en portada de carrusel (pendiente #6 de
ONIA_MARCA_PERSONAL_BASE_CONTENIDO.md SS6, referencia carosia en
references/ui-patterns/spec-sheet-editorial/FICHA.md).

Variante A: portada actual, sin marco (control).
Variante B: header + footer con metadata tecnica fake en Geist Mono, patron
carosia adaptado a la marca Onia (sin su naranja ni su mascota).

Usa la portada real de carrusel-chatbot-venta ("Tu negocio responde solo") para
comparar sobre una pieza que ya se va a publicar, no un caso de prueba inventado.
Salida: carousels/out/experimento-marco-specsheet/.
"""
import subprocess, tempfile, shutil
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
ICONOS = (REPO / "hermes-content/references/ui-patterns/statement-3d-minimal/iconos").as_uri()
OUT = REPO / "hermes-content/carousels/out/experimento-marco-specsheet"

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

CSS_BASE = """
@import url('https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&family=Geist+Mono:wght@500&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
:root{--bg:#F7F7F7;--ink:#0A0A0A;--muted:#8E8E8E;--verde:#00C661}
html,body{width:1080px;height:1350px}
body{background:var(--bg);font-family:'Archivo',sans-serif;overflow:hidden}
.lienzo{width:1080px;height:1350px;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:90px 100px;position:relative}
.handle{position:absolute;bottom:52px;left:0;right:0;text-align:center;font-family:'Geist Mono',monospace;font-size:27px;font-weight:500;letter-spacing:.08em;color:var(--muted)}
.icono-sm{width:210px;height:210px;object-fit:contain}
.titulo{font-size:110px;font-weight:900;font-variation-settings:'wdth' 62;color:var(--ink);letter-spacing:0;word-spacing:.09em;text-align:center;line-height:1.02}
.sub{font-size:44px;font-weight:600;color:var(--muted);text-align:center}
.fila{display:flex;gap:110px;justify-content:center;align-items:flex-end}
.item{display:flex;flex-direction:column;align-items:center;gap:14px}
.item .lbl{font-size:30px;font-weight:400;color:var(--ink)}
"""

CSS_MARCO = """
.marco-top{position:absolute;top:0;left:0;right:0;display:flex;justify-content:space-between;
  padding:44px 56px;font-family:'Geist Mono',monospace;font-size:24px;font-weight:500;
  letter-spacing:.08em;text-transform:uppercase;color:var(--ink);border-bottom:2px solid var(--ink)}
.marco-bottom{position:absolute;bottom:0;left:0;right:0;display:flex;justify-content:space-between;
  padding:36px 56px 96px;font-family:'Geist Mono',monospace;font-size:22px;font-weight:500;
  letter-spacing:.06em;text-transform:uppercase;color:var(--muted);border-top:2px solid var(--ink)}
"""

PORTADA_A = f"""<div class="lienzo" style="gap:64px">
  <div class="fila">
    <div class="item"><img class="icono-sm" src="{ICONOS}/robot.png"><div class="lbl">24/7</div></div>
    <div class="item"><img class="icono-sm" src="{ICONOS}/speech_balloon.png"><div class="lbl">WhatsApp</div></div>
  </div>
  <div style="text-align:center">
    <div class="titulo">Tu negocio<br>responde solo</div>
    <div class="sub" style="margin-top:24px">chatbot con IA, atendiendo mientras dormís</div>
  </div>
  <div class="fila">
    <div class="item"><img class="icono-sm" src="{ICONOS}/chart_increasing.png"><div class="lbl">Vende</div></div>
    <div class="item"><img class="icono-sm" src="{ICONOS}/white_check_mark.png"><div class="lbl">Deriva</div></div>
  </div>
  <div class="handle">@sergiourcullo</div>
</div>"""

PORTADA_B = f"""<div class="lienzo" style="gap:56px;padding-top:150px;padding-bottom:150px">
  <div class="marco-top"><span>ONIA SYSTEM &middot; GRID 1080&times;1350</span><span>V1.0</span></div>
  <div class="fila">
    <div class="item"><img class="icono-sm" src="{ICONOS}/robot.png"><div class="lbl">24/7</div></div>
    <div class="item"><img class="icono-sm" src="{ICONOS}/speech_balloon.png"><div class="lbl">WhatsApp</div></div>
  </div>
  <div style="text-align:center">
    <div class="titulo">Tu negocio<br>responde solo</div>
    <div class="sub" style="margin-top:24px">chatbot con IA, atendiendo mientras dormís</div>
  </div>
  <div class="fila">
    <div class="item"><img class="icono-sm" src="{ICONOS}/chart_increasing.png"><div class="lbl">Vende</div></div>
    <div class="item"><img class="icono-sm" src="{ICONOS}/white_check_mark.png"><div class="lbl">Deriva</div></div>
  </div>
  <div class="marco-bottom"><span>TECHNICAL SPEC &middot; TEMA: CHATBOT IA</span><span>FORMATO: CARRUSEL</span></div>
  <div class="handle">@sergiourcullo</div>
</div>"""

VARIANTES = {
    "variante-A-sin-marco": (CSS_BASE, PORTADA_A),
    "variante-B-con-marco": (CSS_BASE + CSS_MARCO, PORTADA_B),
}

def main():
    OUT.mkdir(parents=True, exist_ok=True)
    tmp = Path(tempfile.mkdtemp(prefix="experimento-"))
    for nombre, (css, cuerpo) in VARIANTES.items():
        html = f"<!doctype html><html><head><meta charset='utf-8'><style>{css}</style></head><body>{cuerpo}</body></html>"
        f = tmp / f"{nombre}.html"
        f.write_text(html, encoding="utf-8")
        png = OUT / f"{nombre}.png"
        subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-sandbox",
            "--window-size=1080,1350", "--force-device-scale-factor=1",
            "--virtual-time-budget=8000", f"--screenshot={png}", f.as_uri()],
            check=True, capture_output=True, timeout=90)
        print(f"OK {nombre}.png {png.stat().st_size} bytes")
    shutil.rmtree(tmp, ignore_errors=True)

if __name__ == "__main__":
    main()
