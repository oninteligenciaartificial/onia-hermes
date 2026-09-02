#!/usr/bin/env python3
"""EXPERIMENTO A/B — pendiente #6 de ONIA_MARCA_PERSONAL_BASE_CONTENIDO.md ("Mas
imagenes: artes Higgsfield integrados en carruseles, no solo iconos"). La mitad de
foto real de Sergio sigue bloqueada (sin identity assets en este carril); esta corrida
prueba SOLO la parte ejecutable: reemplazar el icono Fluent por un arte Higgsfield en
la MISMA portada.

Variante A: portada con icono Fluent (control, lo que usan hoy los generadores).
Variante B: mismo layout, mismo claim, con el arte Higgsfield generado esta corrida
(text2image_soul_v2, 0,12 cr, cotizado y verificado en account transactions — registro
en ONIA_MARCA_PERSONAL_HIGGSFIELD_RECETAS.md).

Salida: carousels/out/experimento-arte-higgsfield-vs-icono/.
"""
import subprocess, tempfile, shutil
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
ICONOS = (REPO / "hermes-content/references/ui-patterns/statement-3d-minimal/iconos").as_uri()
OUT = REPO / "hermes-content/carousels/out/experimento-arte-higgsfield-vs-icono"
ARTE = (OUT / "arte-sistema.png").as_uri()

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
:root{--bg:#F7F7F7;--ink:#0A0A0A;--muted:#8E8E8E;--verde:#1F7A4D}
html,body{width:1080px;height:1350px}
body{background:var(--bg);font-family:'Archivo',sans-serif;overflow:hidden}
.lienzo{width:1080px;height:1350px;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:90px 100px;gap:64px}
.handle{position:absolute;bottom:52px;left:0;right:0;text-align:center;font-family:'Geist Mono',monospace;font-size:27px;font-weight:500;letter-spacing:.08em;color:var(--muted)}
.icono-sm{width:280px;height:280px;object-fit:contain;filter:drop-shadow(0 30px 45px rgba(0,0,0,.25))}
.arte{width:340px;height:340px;object-fit:contain;border-radius:32px;filter:drop-shadow(0 30px 45px rgba(0,0,0,.25))}
.titulo{font-size:100px;font-weight:900;font-variation-settings:'wdth' 62;color:var(--ink);letter-spacing:0;word-spacing:.09em;text-align:center;line-height:1.02}
.sub{font-size:42px;font-weight:600;color:var(--muted);text-align:center}
"""

def cuerpo(img_html):
    return f"""<div class="lienzo" style="position:relative">
  {img_html}
  <div style="text-align:center">
    <div class="titulo">Un sistema,<br>no una lista de apps</div>
    <div class="sub" style="margin-top:24px">agenda, clientes e inventario en un solo lugar</div>
  </div>
  <div class="handle">@sergiourcullo</div>
</div>"""

VARIANTES = {
    "variante-A-icono-fluent": cuerpo(f'<img class="icono-sm" src="{ICONOS}/laptop.png">'),
    "variante-B-arte-higgsfield": cuerpo(f'<img class="arte" src="{ARTE}">'),
}

def main():
    tmp = Path(tempfile.mkdtemp(prefix="experimento-"))
    for nombre, cuerpo_html in VARIANTES.items():
        html = f"<!doctype html><html><head><meta charset='utf-8'><style>{CSS}</style></head><body>{cuerpo_html}</body></html>"
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
