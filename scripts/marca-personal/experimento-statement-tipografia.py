#!/usr/bin/env python3
"""EXPERIMENTO A/B/C2 — la receta de marca sobre un STATEMENT-POST.

La receta ganadora (Archivo pesos MEDIOS 450/650 + eje wdth 96 + jerarquia
contexto-chico/remate-gigante + capas collage) ya se midio tres veces: sobre una
PORTADA de carrusel (02-sep), sobre una lamina GRID 2x3 (03-sep) y sobre una
HISTORIA 9:16 (03-sep). En los tres gano C2 y en los tres B (el buscar-y-reemplazar)
resulto un RETROCESO.

Lo que este formato tiene de distinto, y por eso no se puede dar por transferido:
en una portada o en una grid el texto grande convive con OTRA cosa que sostiene la
pieza (la grilla de celdas, la foto, las 6 celdas de contenido). En un statement el
claim ES la pieza entera — los 4 iconos son el eco, no el contenido. La pregunta
real es si bajar de black 900 / condensed 62 a 650 / wdth 96 deja el claim sin peso
justo donde no hay nada mas que lo sostenga.

  A  — receta vieja: claim 900 / wdth 62, sin collage. Es lo que hay hoy en
       generar-statement-post.py y lo que la FICHA del patron todavia manda.
       Los dos valores estan PROHIBIDOS por Sergio (02-sep).
  B  — buscar-y-reemplazar: mismo layout y mismo tamano, 650 / wdth 96 y nada mas.
  C2 — receta completa: contexto gris chico + remate gigante con highlight verde +
       capas collage (sticker, cinta apoyada, icono flotante).

Claim: "Atender clientes 24/7 solo requiere 3 cosas" — es la penultima idea del banco
de la FICHA de statement-3d-minimal, que figuraba pendiente por no haber icono de n8n
en el set. Se resuelve con los 4 iconos que SI existen (WhatsApp, Claude, agenda,
recordatorio), que ademas describen mejor el circuito real: contestar y agendar.

Salida: hermes-content/carousels/out/experimento-statement-tipografia/
"""
import subprocess, tempfile, shutil
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
ICONOS = (REPO / "hermes-content/references/ui-patterns/statement-3d-minimal/iconos").as_uri()
OUT = REPO / "hermes-content/carousels/out/experimento-statement-tipografia"

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

ITEMS = [
    ("speech_balloon", "WhatsApp"),
    ("robot", "Claude"),
    ("spiral_calendar", "Agenda"),
    ("bell", "Recordatorio"),
]

def _fila(items):
    return "".join(
        f'<div class="item"><img src="{ICONOS}/{ic}.png"><div class="label">{lbl}</div></div>'
        for ic, lbl in items
    )

BASE = """
@import url('https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&family=Geist+Mono:wght@500&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
:root{--bg:#F6F4F1;--ink:#0A0A0A;--muted:#8E8E8E;--verde:#00C661}
html,body{width:1080px;height:1350px}
body{background:var(--bg);font-family:'Archivo',sans-serif;overflow:hidden}
.lienzo{width:1080px;height:1350px;display:flex;flex-direction:column;justify-content:center;
  align-items:center;gap:64px;padding:100px 120px;position:relative}
.fila{display:flex;gap:130px;justify-content:center;align-items:flex-end}
.item{display:flex;flex-direction:column;align-items:center;gap:20px}
.item img{width:196px;height:196px;object-fit:contain;filter:drop-shadow(0 30px 45px rgba(0,0,0,.25))}
.label{font-family:'Geist Mono',monospace;font-size:24px;font-weight:500;letter-spacing:.08em;
  text-transform:uppercase;color:var(--muted)}
.centro{text-align:center;display:flex;flex-direction:column;gap:14px}
.handle{position:absolute;bottom:52px;left:0;right:0;text-align:center;font-family:'Geist Mono',monospace;
  font-size:27px;font-weight:500;letter-spacing:.08em;color:var(--muted)}
"""

# A — la receta vieja: black 900 + condensed 62, sin collage.
CSS_A = BASE + """
.claim{font-size:118px;font-weight:900;font-variation-settings:'wdth' 62;color:var(--ink);
  word-spacing:.09em;line-height:1}
.sub{font-size:52px;font-weight:600;color:var(--muted)}
"""
CUERPO_A = f"""
  <div class="fila">{_fila(ITEMS[:2])}</div>
  <div class="centro">
    <div class="claim">Atender 24/7<br>son 3 cosas</div>
    <div class="sub">WhatsApp, Claude y tu agenda</div>
  </div>
  <div class="fila">{_fila(ITEMS[2:])}</div>
"""

# B — buscar-y-reemplazar: mismo layout, sólo cambian los ejes de la fuente.
CSS_B = BASE + """
.claim{font-size:118px;font-weight:650;font-variation-settings:'wdth' 96;color:var(--ink);
  word-spacing:.09em;line-height:1;letter-spacing:-0.035em}
.sub{font-size:52px;font-weight:450;color:var(--muted)}
"""
CUERPO_B = CUERPO_A

# C2 — receta completa: jerarquía + highlight verde + collage.
CSS_C2 = BASE + """
body{font-weight:450}
.contexto{font-size:50px;font-weight:450;color:var(--muted);line-height:1.2}
.remate{font-size:132px;font-weight:650;font-variation-settings:'wdth' 96;color:var(--ink);
  line-height:.98;letter-spacing:-0.035em;margin-top:12px}
.remate .hl{background:var(--verde);border-radius:12px;padding:2px 22px 10px;white-space:nowrap;
  -webkit-box-decoration-break:clone;box-decoration-break:clone}
.icono-flot{position:absolute;object-fit:contain;filter:drop-shadow(0 14px 22px rgba(0,0,0,.18))}
.cinta{position:absolute;width:190px;height:52px;background:rgba(0,0,0,.055);
  border:1px solid rgba(0,0,0,.05);box-shadow:0 3px 8px rgba(0,0,0,.05)}
.sticker{position:absolute;background:#0A0A0A;color:var(--verde);border-radius:50%;width:166px;height:166px;
  display:flex;align-items:center;justify-content:center;transform:rotate(12deg);font-weight:650;
  font-size:28px;line-height:1.1;text-align:center;box-shadow:0 14px 30px rgba(0,0,0,.25)}
"""
CUERPO_C2 = f"""
  <div class="sticker" style="top:104px;right:44px">SIN<br>CONTRATAR</div>
  <div class="fila">{_fila(ITEMS[:2])}</div>
  <div class="centro">
    <div class="contexto">Atender clientes 24/7</div>
    <div class="remate">SOLO SON<br><span class="hl">3 COSAS</span></div>
  </div>
  <div class="cinta" style="top:806px;left:404px;transform:rotate(-8deg)"></div>
  <div class="fila">{_fila(ITEMS[2:])}</div>
"""

VARIANTES = [
    ("A-vieja-900-62", CSS_A, CUERPO_A),
    ("B-reemplazo-650-96", CSS_B, CUERPO_B),
    ("C2-receta-completa", CSS_C2, CUERPO_C2),
]

def render(nombre, css, cuerpo, tmp):
    html = (f"<!doctype html><html><head><meta charset='utf-8'><style>{css}</style></head>"
            f"<body><div class='lienzo'>{cuerpo}<div class='handle'>@sergiourcullo</div></div></body></html>")
    f = tmp / f"{nombre}.html"
    f.write_text(html, encoding="utf-8")
    png = OUT / f"{nombre}.png"
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-sandbox",
        "--window-size=1080,1350", "--force-device-scale-factor=1",
        "--virtual-time-budget=8000", f"--screenshot={png}", f.as_uri()],
        check=True, capture_output=True, timeout=90)
    return png

def hoja_comparativa(tmp):
    """Las tres al 33 % una al lado de la otra: asi es como se comparan de verdad."""
    cards = "".join(
        f'<div class="col"><div class="cap">{n}</div>'
        f'<img src="{(OUT / (n + ".png")).as_uri()}"></div>'
        for n, _, _ in VARIANTES
    )
    html = f"""<!doctype html><html><head><meta charset='utf-8'><style>
@import url('https://fonts.googleapis.com/css2?family=Geist+Mono:wght@500&display=swap');
*{{margin:0;padding:0;box-sizing:border-box}}
html,body{{width:1240px;height:620px;background:#fff}}
.wrap{{display:flex;gap:26px;padding:26px}}
.col{{display:flex;flex-direction:column;gap:10px}}
.cap{{font-family:'Geist Mono',monospace;font-size:17px;color:#333}}
img{{width:370px;border:1px solid #ddd}}
</style></head><body><div class="wrap">{cards}</div></body></html>"""
    f = tmp / "hoja.html"
    f.write_text(html, encoding="utf-8")
    png = OUT / "COMPARATIVA-33pct.png"
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-sandbox",
        "--window-size=1240,620", "--force-device-scale-factor=1",
        "--virtual-time-budget=8000", f"--screenshot={png}", f.as_uri()],
        check=True, capture_output=True, timeout=90)
    return png

def main():
    OUT.mkdir(parents=True, exist_ok=True)
    tmp = Path(tempfile.mkdtemp(prefix="exp-statement-"))
    for nombre, css, cuerpo in VARIANTES:
        png = render(nombre, css, cuerpo, tmp)
        print(f"OK {png.name} {png.stat().st_size} bytes")
    hoja = hoja_comparativa(tmp)
    print(f"OK {hoja.name} {hoja.stat().st_size} bytes")
    shutil.rmtree(tmp, ignore_errors=True)

if __name__ == "__main__":
    main()
