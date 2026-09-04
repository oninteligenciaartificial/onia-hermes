#!/usr/bin/env python3
"""EXPERIMENTO (02-sep, tanda intensiva) — la tipografia de marca sobre una pieza VIEJA.

QUE PREGUNTA RESPONDE
---------------------
Sergio aprobo `generar-curso-dia1.py` como "la mejor hasta el momento" y de ahi salio la
regla del carril: **Archivo con pesos MEDIOS** (cuerpo 450, titulos 600-650, wordmark
560/wdth 96) y **PROHIBIDO black 900 + condensed wdth 62**. Contados los generadores de
`scripts/marca-personal/` el 02-sep: **12 de 13 siguen en 900/62**. O sea: casi todo lo
que hay renderizado en `carousels/out/` esta con la tipografia que Sergio rechazo.

Pero cambiar `900 -> 650` y `wdth 62 -> 96` a secas es justo el buscar-y-reemplazar que ya
rompio una pieza en el experimento del verde (§6): **wdth 62 es CONDENSED**, ocupa menos
ancho. Al pasar a 96 el mismo texto se ensancha y puede desbordar o cortar mal la linea.
Y el peso 650 pesa menos en pantalla que el 900: hay que MIRAR si el titulo sigue frenando
el scroll al tamano en que se ve de verdad.

VARIANTES (misma pieza real: la portada y un interior del carrusel "5 prompts")
  A  lo que hay HOY            titulo 900/wdth62 · num 900/wdth125 · sin collage
  B  tipografia de marca       titulo 650/wdth96 · cuerpo 450 · mismo layout
  C  marca + portada ganadora  contexto gris chico + remate gigante 650/96 + collage
                               (sticker/cinta/icono flotante, regla "stickers siempre")

Se juzga en `CHEQUEO-tipografia.png`: fila a 33% (feed) y fila a 13% (grilla de perfil),
las dos escalas del experimento de miniatura del 02-sep. El 100% se mira en los PNG
sueltos: tres laminas de 1080 no entran a tamano completo en una hoja legible.

Salida: hermes-content/carousels/out/experimento-tipografia-marca/
"""
import subprocess, tempfile, shutil
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
ICONOS = (REPO / "hermes-content/references/ui-patterns/statement-3d-minimal/iconos").as_uri()
OUT = REPO / "hermes-content/carousels/out/experimento-tipografia-marca"


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

BASE = """
@import url('https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&family=Geist+Mono:wght@500&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
:root{--bg:#F7F7F7;--ink:#0A0A0A;--muted:#8E8E8E;--card:#FFFFFF;--verde:#00C661}
html,body{width:1080px;height:1350px}
body{background:var(--bg);font-family:'Archivo',sans-serif;overflow:hidden}
.lienzo{width:1080px;height:1350px;display:flex;flex-direction:column;justify-content:center;
  align-items:center;padding:90px 100px;position:relative}
.handle{position:absolute;bottom:52px;left:0;right:0;text-align:center;font-family:'Geist Mono',monospace;
  font-size:27px;font-weight:500;letter-spacing:.08em;color:var(--muted)}
.icono{width:300px;height:300px;object-fit:contain;filter:drop-shadow(0 30px 45px rgba(0,0,0,.25))}
.icono-sm{width:210px;height:210px;object-fit:contain;filter:drop-shadow(0 22px 34px rgba(0,0,0,.22))}
.fila{display:flex;gap:110px;justify-content:center;align-items:flex-end}
.item{display:flex;flex-direction:column;align-items:center;gap:14px}
.item .lbl{font-family:'Geist Mono',monospace;font-size:26px;font-weight:500;letter-spacing:.08em;
  text-transform:uppercase;color:var(--muted)}
/* --- collage (regla "stickers siempre", clases del generador aprobado) --- */
.icono-flot{position:absolute;object-fit:contain;filter:drop-shadow(0 14px 22px rgba(0,0,0,.18))}
.cinta{position:absolute;width:190px;height:52px;background:rgba(0,0,0,.055);
  border:1px solid rgba(0,0,0,.05);box-shadow:0 3px 8px rgba(0,0,0,.05)}
.sticker{position:absolute;background:#0A0A0A;color:var(--verde);border-radius:50%;width:170px;height:170px;
  display:flex;align-items:center;justify-content:center;transform:rotate(12deg);font-weight:650;
  font-size:31px;line-height:1.1;text-align:center;box-shadow:0 14px 30px rgba(0,0,0,.25)}
"""

# --- A: lo que hay hoy (black 900 + condensed 62) -----------------------------
CSS_A = BASE + """
.num{font-size:200px;font-weight:900;font-variation-settings:'wdth' 125;color:var(--ink);line-height:.9;letter-spacing:-0.02em}
.titulo{font-size:88px;font-weight:900;font-variation-settings:'wdth' 62;color:var(--ink);word-spacing:.09em;text-align:center;line-height:1.02}
.sub{font-size:44px;font-weight:600;color:var(--muted);text-align:center;letter-spacing:-0.01em}
.caja{background:var(--card);border-radius:36px;padding:56px 60px;font-size:40px;line-height:1.42;color:var(--ink);box-shadow:0 18px 50px rgba(0,0,0,.07);width:100%}
.caja b{font-weight:600;background:#EFEDEA;border-radius:8px;padding:0 8px}
"""

# --- B/C: tipografia real de la marca (pesos medios, wdth 96) -----------------
CSS_M = BASE + """
.num{font-size:200px;font-weight:650;font-variation-settings:'wdth' 96;color:var(--ink);line-height:.9;letter-spacing:-0.03em}
.titulo{font-size:88px;font-weight:650;font-variation-settings:'wdth' 96;color:var(--ink);text-align:center;line-height:1.08;letter-spacing:-0.02em}
.sub{font-size:44px;font-weight:450;color:var(--muted);text-align:center;line-height:1.35}
.caja{background:var(--card);border-radius:36px;padding:56px 60px;font-size:40px;font-weight:450;line-height:1.42;color:var(--ink);box-shadow:0 18px 50px rgba(0,0,0,.07);width:100%}
/* nowrap: sin esto el resaltado se parte entre lineas ("[mi" arriba, "negocio]" abajo).
   Y el hueco antes de un signo de puntuacion se evita NO pegandole puntuacion al <b>. */
.caja b{font-weight:650;background:var(--verde);border-radius:8px;padding:2px 10px;white-space:nowrap;-webkit-box-decoration-break:clone;box-decoration-break:clone}
.contexto{font-size:56px;font-weight:450;color:var(--muted);text-align:center;line-height:1.25}
/* wdth 96 es MAS ANCHO que el 62 condensed: "5 PROMPTS" a 172px se salia del lienzo
   (880px utiles). 138px es el tope medido para 9 caracteres en una linea. */
.remate{font-size:138px;font-weight:650;font-variation-settings:'wdth' 96;color:var(--ink);text-align:center;line-height:.94;letter-spacing:-0.035em;white-space:nowrap}
"""

PORTADA_AB = f"""
<div class="lienzo" style="gap:64px">
  <div class="fila">
    <div class="item"><img class="icono-sm" src="{ICONOS}/robot.png"><div class="lbl">IA</div></div>
    <div class="item"><img class="icono-sm" src="{ICONOS}/light_bulb.png"><div class="lbl">Ideas</div></div>
  </div>
  <div style="text-align:center">
    <div class="num" style="font-size:150px">5 prompts</div>
    <div class="sub" style="margin-top:14px">que uso todos los días en mi negocio</div>
  </div>
  <div class="fila">
    <div class="item"><img class="icono-sm" src="{ICONOS}/memo.png"><div class="lbl">Copiá</div></div>
    <div class="item"><img class="icono-sm" src="{ICONOS}/rocket.png"><div class="lbl">Pegá</div></div>
  </div>
  <div class="handle">@sergiourcullo</div>
</div>"""

# El collage vive FUERA de la banda del texto: cinta y sticker arriba, iconos abajo.
# En la primera pasada los iconos flotaban a media altura y quedaban ENCIMA del remate.
PORTADA_C = f"""
<div class="lienzo" style="gap:44px">
  <div class="cinta" style="top:196px;left:104px;transform:rotate(-8deg)"></div>
  <div class="sticker" style="top:216px;right:78px">copiá y<br>PEGÁ</div>
  <div class="contexto">los que uso todos los días<br>en mi negocio</div>
  <div class="remate">5 PROMPTS</div>
  <div class="fila" style="gap:150px;margin-top:26px">
    <img class="icono-sm" src="{ICONOS}/robot.png" style="transform:rotate(-9deg)">
    <img class="icono-sm" src="{ICONOS}/rocket.png" style="transform:rotate(11deg)">
  </div>
  <div class="handle">@sergiourcullo</div>
</div>"""

INTERIOR = """
<div class="lienzo" style="gap:56px">
  <div style="display:flex;align-items:center;gap:70px">
    <div class="num">01</div>
    <img class="icono" src="{ic}/speech_balloon.png">
  </div>
  <div class="titulo">Responder clientes</div>
  <div class="caja">Sos el encargado de atención de <b>[mi negocio]</b> y respondés a los clientes. Cálido, concreto, máximo 4 líneas. El mensaje es este: <b>[pegá el mensaje]</b></div>
  <div class="handle">@sergiourcullo</div>
</div>"""

INTERIOR_C = """
<div class="lienzo" style="gap:50px">
  <div class="cinta" style="top:150px;right:120px;transform:rotate(7deg)"></div>
  <img class="icono-flot" src="{ic}/light_bulb.png" style="width:150px;left:70px;top:170px;transform:rotate(-11deg)">
  <div style="display:flex;align-items:center;gap:70px">
    <div class="num">01</div>
    <img class="icono" src="{ic}/speech_balloon.png">
  </div>
  <div class="titulo">Responder clientes</div>
  <div style="position:relative;width:100%">
    <div class="sticker" style="right:-52px;top:-64px;width:150px;height:150px;font-size:28px">pegalo<br>TAL CUAL</div>
    <div class="caja">Sos el encargado de atención de <b>[mi negocio]</b> y respondés a los clientes. Cálido, concreto, máximo 4 líneas. El mensaje es este: <b>[pegá el mensaje]</b></div>
  </div>
  <div class="handle">@sergiourcullo</div>
</div>"""

PIEZAS = [
    ("portada-A-hoy-900-62", CSS_A, PORTADA_AB),
    ("portada-B-marca-650-96", CSS_M, PORTADA_AB),
    ("portada-C-marca-remate-collage", CSS_M, PORTADA_C),
    ("interior-A-hoy-900-62", CSS_A, INTERIOR.format(ic=ICONOS)),
    ("interior-C-marca-collage", CSS_M, INTERIOR_C.format(ic=ICONOS)),
]


def render(nombre, css, cuerpo, tmp):
    html = f"<!doctype html><html><head><meta charset='utf-8'><style>{css}</style></head><body>{cuerpo}</body></html>"
    f = tmp / f"{nombre}.html"
    f.write_text(html, encoding="utf-8")
    png = OUT / f"{nombre}.png"
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-sandbox",
        "--window-size=1080,1350", "--force-device-scale-factor=1", "--virtual-time-budget=9000",
        f"--screenshot={png}", f.as_uri()], check=True, capture_output=True, timeout=90)
    print(f"OK {nombre}.png {png.stat().st_size} bytes")
    return png


def hoja(tmp):
    """Hoja de juicio: las 3 portadas a 33% (feed) y a 13% (grilla de perfil).

    Sin fila al 100%: tres laminas de 1080px no entran en una hoja que se pueda mirar
    (lo aprendio el experimento de miniatura del 02-sep). El 100% son los PNG sueltos.
    """
    cols = ["portada-A-hoy-900-62", "portada-B-marca-650-96", "portada-C-marca-remate-collage"]
    etiquetas = ["A · hoy (900 / wdth 62)", "B · marca (650 / wdth 96)", "C · marca + remate + collage"]

    def fila(escala, titulo):
        celdas = "".join(
            f'<div class="celda"><img src="{(OUT / (c + ".png")).as_uri()}" style="width:{int(1080*escala)}px">'
            f'<div class="pie">{e}</div></div>' for c, e in zip(cols, etiquetas))
        return f'<div class="bloque"><div class="rot">{titulo}</div><div class="row">{celdas}</div></div>'

    html = f"""<!doctype html><html><head><meta charset='utf-8'><style>
    @import url('https://fonts.googleapis.com/css2?family=Geist+Mono:wght@500&display=swap');
    *{{margin:0;padding:0;box-sizing:border-box}}
    body{{background:#FFF;font-family:'Geist Mono',monospace;padding:46px 40px;width:1300px}}
    h1{{font-size:24px;letter-spacing:.06em;margin-bottom:8px}}
    .nota{{font-size:15px;color:#666;line-height:1.5;margin-bottom:30px}}
    .bloque{{margin-bottom:38px}}
    .rot{{font-size:17px;letter-spacing:.1em;color:#111;background:#00C661;display:inline-block;padding:5px 14px;margin-bottom:14px}}
    .row{{display:flex;gap:34px;align-items:flex-start}}
    .celda img{{display:block;border:1px solid #DDD}}
    .pie{{font-size:13px;color:#555;margin-top:8px;letter-spacing:.04em}}
    </style></head><body>
    <h1>TIPOGRAFIA DE MARCA SOBRE UNA PIEZA VIEJA — portada "5 prompts"</h1>
    <div class="nota">A = lo que hay hoy (black 900 + condensed wdth 62, los dos rechazados por Sergio).<br>
    B = misma portada con la tipografia real de la marca (650 / wdth 96, cuerpo 450).<br>
    C = tipografia de marca + jerarquia ganadora de portada (contexto gris + remate gigante) + capas collage.<br>
    Se juzga a 33% (como se ve en el feed) y a 13% (grilla de perfil). El 100%: los PNG sueltos.</div>
    {fila(0.33, "33% — FEED")}
    {fila(0.13, "13% — GRILLA DE PERFIL")}
    </body></html>"""
    f = tmp / "hoja.html"
    f.write_text(html, encoding="utf-8")
    png = OUT / "CHEQUEO-tipografia.png"
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-sandbox",
        "--window-size=1300,1200", "--force-device-scale-factor=1", "--virtual-time-budget=9000",
        f"--screenshot={png}", f.as_uri()], check=True, capture_output=True, timeout=90)
    print(f"OK CHEQUEO-tipografia.png {png.stat().st_size} bytes")


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    tmp = Path(tempfile.mkdtemp(prefix="tipo-"))
    for nombre, css, cuerpo in PIEZAS:
        render(nombre, css, cuerpo, tmp)
    hoja(tmp)
    shutil.rmtree(tmp, ignore_errors=True)


if __name__ == "__main__":
    main()
