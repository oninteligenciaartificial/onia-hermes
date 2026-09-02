#!/usr/bin/env python3
"""EXPERIMENTO (practica del loop, 02-sep) — la portada de un carrusel, LEIDA AL TAMANO
EN QUE LA VE EL PUBLICO.

Por que: todas las portadas del carril se juzgaron a 1080px, abiertas de a una. Nadie la
miro nunca al tamano real del feed (la primera lamina aparece reducida) ni al de la
grilla de perfil (mas chica todavia). Es el mismo agujero que encontro el experimento de
banda segura: el PNG suelto se ve impecable y el defecto solo aparece cuando lo mirás
como lo mira el usuario. El peso >50KB no puede ver esto.

Tres variantes de la MISMA portada (carrusel 4 "como contesto a cada cliente"):
  A — layout actual de todos los generadores: icono 300 + titulo 88 wdth62 + sub 44
  B — sin subtitulo, titulo 112: menos elementos, mas tamano
  C — jerarquia por tamano: 2 lineas chicas + remate gigante wdth 125

Salida: carousels/out/experimento-portada-miniatura/
  variante-{A,B,C}.png            (1080x1350, como se revisan hoy)
  COMPARATIVA-escalas.png         (las 3, a 100% / 33% / 13% — MIRAR ESTA)
"""
import subprocess, tempfile, shutil
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
ICONOS = (REPO / "hermes-content/references/ui-patterns/statement-3d-minimal/iconos").as_uri()
OUT = REPO / "hermes-content/carousels/out/experimento-portada-miniatura"

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
.lienzo{width:1080px;height:1350px;display:flex;flex-direction:column;justify-content:center;
  align-items:center;padding:150px 100px;position:relative;gap:56px}
.handle{position:absolute;bottom:52px;left:0;right:0;text-align:center;font-family:'Geist Mono',monospace;
  font-size:27px;font-weight:500;letter-spacing:.08em;color:var(--muted)}
.icono{object-fit:contain;filter:drop-shadow(0 30px 45px rgba(0,0,0,.25))}
.titulo{font-weight:900;font-variation-settings:'wdth' 62;color:var(--ink);letter-spacing:0;
  word-spacing:.09em;text-align:center;line-height:1.02}
.sub{font-size:44px;font-weight:600;color:var(--muted);text-align:center}
.remate{font-weight:900;font-variation-settings:'wdth' 125;color:var(--ink);text-align:center;
  line-height:.92;letter-spacing:-0.02em}
.marco-top{position:absolute;top:0;left:0;right:0;display:flex;justify-content:space-between;
  padding:44px 56px;font-family:'Geist Mono',monospace;font-size:24px;font-weight:500;
  letter-spacing:.08em;text-transform:uppercase;color:var(--ink);border-bottom:2px solid var(--ink)}
.marco-bottom{position:absolute;bottom:0;left:0;right:0;display:flex;justify-content:space-between;
  padding:36px 56px 96px;font-family:'Geist Mono',monospace;font-size:22px;font-weight:500;
  letter-spacing:.06em;text-transform:uppercase;color:var(--muted);border-top:2px solid var(--ink)}
"""

MARCO = ("""<div class="marco-top"><span>ONIA SYSTEM &middot; GRID 1080&times;1350</span><span>V1.0</span></div>""",
         """<div class="marco-bottom"><span>TECHNICAL SPEC &middot; TEMA: ATENCION CON IA</span><span>FORMATO: CARRUSEL</span></div>""")

VARIANTES = {
    # A — lo que hacen HOY todos los generadores del carril
    "A": f"""<div class="lienzo">
  {MARCO[0]}
  <img class="icono" src="{ICONOS}/robot.png" style="width:300px;height:300px">
  <div>
    <div class="titulo" style="font-size:88px">C&oacute;mo contesto a cada<br>cliente sin estar yo</div>
    <div class="sub" style="margin-top:24px">el paso a paso, en 5 pasos</div>
  </div>
  {MARCO[1]}
  <div class="handle">@sergiourcullo</div>
</div>""",
    # B — menos elementos, mas tamano: se cae el subtitulo, el titulo crece
    "B": f"""<div class="lienzo">
  {MARCO[0]}
  <img class="icono" src="{ICONOS}/robot.png" style="width:260px;height:260px">
  <div class="titulo" style="font-size:112px">C&oacute;mo contesto<br>a cada cliente<br>sin estar yo</div>
  {MARCO[1]}
  <div class="handle">@sergiourcullo</div>
</div>""",
    # C — jerarquia por tamano: contexto chico + remate gigante en wdth 125
    "C": f"""<div class="lienzo">
  {MARCO[0]}
  <img class="icono" src="{ICONOS}/robot.png" style="width:240px;height:240px">
  <div>
    <div class="titulo" style="font-size:62px;color:#8E8E8E">C&oacute;mo contesto a cada cliente</div>
    <div class="remate" style="font-size:150px;margin-top:14px">SIN<br>ESTAR YO</div>
  </div>
  {MARCO[1]}
  <div class="handle">@sergiourcullo</div>
</div>""",
}

# Escalas de la comparativa. No son medidas de la UI de Instagram (esta corrida no puede
# citar la spec de Meta): son las proporciones a las que se ve una portada cuando NO la
# abris a pantalla completa — un tercio (feed) y un octavo (grilla de perfil).
#
# NO incluir aca la escala 100%: tres laminas de 1080 no entran en una hoja legible, y una
# hoja mas ancha se vuelve contraproducente — al abrirla se reduce entera y las miniaturas
# dejan de verse al tamano que se quiere juzgar. El 100% se mira en los variante-*.png
# sueltos, de a uno, que es justamente como se venia revisando.
ESCALAS = [(360, "33% — feed"),
           (140, "13% — grilla de perfil")]


def _shot(html: str, png: Path, w: int, h: int, tmp: Path, nombre: str):
    f = tmp / f"{nombre}.html"
    f.write_text(html, encoding="utf-8")
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-sandbox",
                    f"--window-size={w},{h}", "--force-device-scale-factor=1",
                    "--virtual-time-budget=8000", f"--screenshot={png}", f.as_uri()],
                   check=True, capture_output=True, timeout=90)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    tmp = Path(tempfile.mkdtemp(prefix="exp-miniatura-"))

    for k, cuerpo in VARIANTES.items():
        html = f"<!doctype html><html><head><meta charset='utf-8'><style>{CSS}</style></head><body>{cuerpo}</body></html>"
        png = OUT / f"variante-{k}.png"
        _shot(html, png, 1080, 1350, tmp, f"variante-{k}")
        print(f"OK variante-{k}.png {png.stat().st_size} bytes")

    # Contact sheet: las 3 variantes x 3 escalas, con el navegador reduciendo de verdad.
    cols = ""
    for ancho, etiqueta in ESCALAS:
        celdas = "".join(
            f'<div class="celda"><img src="{(OUT / f"variante-{k}.png").as_uri()}" style="width:{ancho}px">'
            f'<div class="cap">{k}</div></div>' for k in VARIANTES)
        cols += f'<div class="fila"><div class="titulo-escala">{etiqueta}</div><div class="tira">{celdas}</div></div>'

    sheet_css = """
    @import url('https://fonts.googleapis.com/css2?family=Geist+Mono:wght@500&display=swap');
    *{margin:0;padding:0;box-sizing:border-box}
    body{background:#FFFFFF;font-family:'Geist Mono',monospace;padding:44px}
    .fila{margin-bottom:52px}
    .titulo-escala{font-size:26px;letter-spacing:.08em;text-transform:uppercase;color:#0A0A0A;
      border-bottom:2px solid #0A0A0A;padding-bottom:12px;margin-bottom:28px}
    .tira{display:flex;gap:44px;align-items:flex-start}
    .celda{text-align:center}
    .celda img{display:block;border:1px solid #DDD}
    .cap{font-size:22px;color:#8E8E8E;margin-top:10px;letter-spacing:.08em}
    """
    pie = ('<div class="cap" style="text-align:left;margin-top:8px">LAS TRES A 1080 SE MIRAN '
           'DE A UNA EN variante-A/B/C.png &mdash; ACA SOLO LO QUE NO SE VE ABRIENDOLAS</div>')
    sheet = f"<!doctype html><html><head><meta charset='utf-8'><style>{sheet_css}</style></head><body>{cols}{pie}</body></html>"
    png = OUT / "COMPARATIVA-escalas.png"
    _shot(sheet, png, 1400, 1050, tmp, "comparativa")
    print(f"OK COMPARATIVA-escalas.png {png.stat().st_size} bytes  <- MIRAR ESTA")

    shutil.rmtree(tmp, ignore_errors=True)


if __name__ == "__main__":
    main()
