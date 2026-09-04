#!/usr/bin/env python3
"""EXPERIMENTO — ¿la receta de tipografía de marca transfiere al formato HISTORIA 9:16?

La receta ganadora se midió DOS veces (portada de carrusel, lámina grid) y las dos
con el mismo instrumento: la miniatura a 33 % y 13 %, o sea *sobrevivir a la grilla
del perfil*. **Una historia nunca se ve chica**: ocupa la pantalla entera, dura 5
segundos y encima le come la interfaz de IG 230px arriba y 422px abajo. Así que la
pregunta acá es otra y puede salir que NO:

  ¿el peso 650/wdth 96 sigue ganando cuando el enemigo no es el tamaño sino
  la interfaz y los 5 segundos — o el condensed 900 rendía porque mete
  más palabras en el mismo ancho de banda?

Variantes, todas sobre la historia-01 real ("¿Cuánto tarda armarlo?"):
  A — lo que hay hoy en generar-historia-quiz.py: banda segura OK, pregunta en
      Archivo 900 / wdth 62 (los dos rechazos de Sergio), sin capas collage.
  B — control conocido: sólo el buscar-y-reemplazar tipográfico (650 / wdth 96),
      mismo layout. En portada y en grid B fue un RETROCESO las dos veces.
  C — receta completa: tipografía de marca + jerarquía (la pregunta como remate) +
      capas collage con la cinta SUJETANDO un borde (regla #5 de la FICHA) +
      banda segura intacta.

Instrumento: hoja al 100 % (se juzga el render real) y hoja con la interfaz de IG
simulada encima — que es lo que un PNG suelto no puede mostrar. NO se juzga a 13 %:
ese instrumento no aplica a este formato y usarlo sería medir con la regla de otro.

Salida: hermes-content/carousels/out/experimento-historia-tipografia/
"""
import subprocess, tempfile, shutil
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
OUT = REPO / "hermes-content/carousels/out/experimento-historia-tipografia"
ICONOS = (REPO / "hermes-content/references/ui-patterns/statement-3d-minimal/iconos").as_uri()

SAFE_TOP = round(1920 * 0.12)      # 230
SAFE_BOT = round(1920 * 0.22)      # 422


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

COMUN = f"""
@import url('https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&family=Geist+Mono:wght@400;500&display=swap');
*{{margin:0;padding:0;box-sizing:border-box}}
:root{{--verde:#00C661;--ink:#0A0A0A;--s:.88}}
html,body{{width:1080px;height:1920px}}
body{{background:var(--verde);font-family:'Archivo',sans-serif;overflow:hidden}}
.lienzo{{width:1080px;height:1920px;display:flex;flex-direction:column;align-items:center;
  padding:{SAFE_TOP + 40}px 90px {SAFE_BOT + 74}px;position:relative;gap:44px}}
.tag{{font-family:'Geist Mono',monospace;font-size:calc(32px*var(--s));font-weight:500;
  letter-spacing:.14em;color:rgba(0,0,0,.6)}}
.card{{background:#111312;border-radius:40px;padding:calc(70px*var(--s)) calc(64px*var(--s));
  width:100%;box-shadow:0 24px 60px rgba(0,0,0,.22);color:#EDEDED;position:relative}}
.zona{{border:5px dashed rgba(0,0,0,.35);border-radius:36px;width:86%;flex:1;min-height:0;
  display:flex;align-items:center;justify-content:center}}
.zona span{{font-family:'Geist Mono',monospace;font-size:30px;letter-spacing:.12em;color:rgba(0,0,0,.45)}}
.handle{{position:absolute;bottom:{SAFE_BOT + 12}px;left:0;right:0;text-align:center;
  font-family:'Geist Mono',monospace;font-size:28px;font-weight:500;letter-spacing:.08em;color:rgba(0,0,0,.55)}}
.banda{{background:var(--ink);color:var(--verde);width:100%;border-radius:28px;
  padding:calc(44px*var(--s)) 40px;text-align:center;line-height:1.05;position:relative}}
/* capas collage (sólo C) */
.icono-flot{{position:absolute;object-fit:contain;filter:drop-shadow(0 14px 22px rgba(0,0,0,.18))}}
.cinta{{position:absolute;width:190px;height:52px;background:rgba(255,255,255,.5);
  border:1px solid rgba(0,0,0,.05);box-shadow:0 3px 8px rgba(0,0,0,.06)}}
.sticker{{position:absolute;background:#0A0A0A;color:#00C661;border-radius:50%;width:170px;height:170px;
  display:flex;align-items:center;justify-content:center;transform:rotate(12deg);font-weight:650;
  font-size:31px;line-height:1.1;text-align:center;box-shadow:0 14px 30px rgba(0,0,0,.25)}}
"""

# --- A: lo que hay hoy (900 / wdth 62, sin collage) --------------------------
A = """<style>
.card .grande{font-size:calc(58px*var(--s));font-weight:700;line-height:1.18;letter-spacing:-0.01em}
.banda{font-size:calc(66px*var(--s));font-weight:900;font-variation-settings:'wdth' 62;word-spacing:.09em}
</style>
<div class="lienzo">
  <div class="tag">QUIZ · IA PARA TU NEGOCIO</div>
  <div class="card"><div class="grande">Un asistente que responde a <span style="color:#00C661">tus clientes</span> las preguntas de siempre — precio, stock, horarios — sin que estés vos.</div></div>
  <div class="banda">¿Cuánto tarda armarlo?</div>
  <div class="zona"><span>ENCUESTA ACÁ ↓</span></div>
  <div class="handle">@sergiourcullo</div>
</div>"""

# --- B: sólo el buscar-y-reemplazar tipográfico ------------------------------
B = """<style>
.card .grande{font-size:calc(58px*var(--s));font-weight:600;font-variation-settings:'wdth' 96;line-height:1.18;letter-spacing:-0.01em}
.banda{font-size:calc(66px*var(--s));font-weight:650;font-variation-settings:'wdth' 96;letter-spacing:-0.02em}
</style>
<div class="lienzo">
  <div class="tag">QUIZ · IA PARA TU NEGOCIO</div>
  <div class="card"><div class="grande">Un asistente que responde a <span style="color:#00C661">tus clientes</span> las preguntas de siempre — precio, stock, horarios — sin que estés vos.</div></div>
  <div class="banda">¿Cuánto tarda armarlo?</div>
  <div class="zona"><span>ENCUESTA ACÁ ↓</span></div>
  <div class="handle">@sergiourcullo</div>
</div>"""

# --- C: receta completa (marca + jerarquía + collage con la cinta sujetando) --
C = f"""<style>
.card .grande{{font-size:calc(54px*var(--s));font-weight:450;font-variation-settings:'wdth' 96;line-height:1.3;letter-spacing:-0.01em}}
.card .grande b{{font-weight:650;color:#00C661}}
.banda{{padding:calc(38px*var(--s)) 40px calc(44px*var(--s))}}
.banda .ctx{{font-family:'Geist Mono',monospace;font-size:30px;font-weight:500;letter-spacing:.12em;
  color:rgba(255,255,255,.5);display:block;margin-bottom:14px}}
.banda .remate{{font-size:calc(84px*var(--s));font-weight:650;font-variation-settings:'wdth' 96;
  letter-spacing:-0.025em;display:block;line-height:1.02}}
</style>
<div class="lienzo">
  <div class="tag">QUIZ · IA PARA TU NEGOCIO</div>
  <div class="card">
    <div class="cinta" style="top:-26px;left:96px;transform:rotate(-7deg)"></div>
    <img class="icono-flot" src="{ICONOS}/speech_balloon.png" style="width:150px;top:-64px;right:-42px;transform:rotate(11deg)">
    <div class="grande">Un asistente que responde a <b>tus clientes</b> las preguntas de siempre — precio, stock, horarios — sin que estés vos.</div>
  </div>
  <div class="banda">
    <div class="sticker" style="left:-46px;top:-58px;width:158px;height:158px;font-size:29px;transform:rotate(-11deg)">tu voto<br>manda</div>
    <span class="ctx">¿CUÁNTO TARDA ARMARLO?</span>
    <span class="remate">Adiviná</span>
  </div>
  <div class="zona"><span>ENCUESTA ACÁ ↓</span></div>
  <div class="handle">@sergiourcullo</div>
</div>"""

# --- C2: la corrección de C ---------------------------------------------------
# C demostró que la tipografía y el collage transfieren, y de paso destapó DOS
# defectos suyos que sólo se ven mirando:
#   1. para tener "remate gigante" hubo que degradar LA PREGUNTA a micro-mono y
#      poner un "Adiviná" de relleno arriba. En un quiz la pregunta ES la carga
#      útil: degradarla para hacerle lugar a una palabra vacía es justo la
#      "metadata decorativa" que la §7 de Sergio prohíbe.
#   2. el sticker negro quedaba sobre la banda negra y la tarjeta negra: un
#      círculo oscuro sobre oscuro no lee como sticker, lee como mancha.
# C2: el remate ES la pregunta (dos líneas, verde sobre negro) y el sticker se
# apoya en el lienzo verde mordiendo el borde de la banda — ahí sí contrasta y
# ahí sí sujeta algo.
C2 = f"""<style>
.card .grande{{font-size:calc(54px*var(--s));font-weight:450;font-variation-settings:'wdth' 96;line-height:1.3;letter-spacing:-0.01em}}
.card .grande b{{font-weight:650;color:#00C661}}
.banda{{padding:calc(46px*var(--s)) 40px;font-size:calc(84px*var(--s));font-weight:650;
  font-variation-settings:'wdth' 96;letter-spacing:-0.025em;line-height:1.06}}
</style>
<div class="lienzo">
  <div class="tag">QUIZ · IA PARA TU NEGOCIO</div>
  <div class="card">
    <div class="cinta" style="top:-26px;left:96px;transform:rotate(-7deg)"></div>
    <img class="icono-flot" src="{ICONOS}/speech_balloon.png" style="width:150px;top:-64px;right:-42px;transform:rotate(11deg)">
    <div class="grande">Un asistente que responde a <b>tus clientes</b> las preguntas de siempre — precio, stock, horarios — sin que estés vos.</div>
  </div>
  <div class="banda">¿Cuánto tarda<br>armarlo?
    <div class="sticker" style="right:-52px;bottom:-56px;width:158px;height:158px;font-size:29px;transform:rotate(12deg)">tu voto<br>manda</div>
  </div>
  <div class="zona"><span>ENCUESTA ACÁ ↓</span></div>
  <div class="handle">@sergiourcullo</div>
</div>"""

VARIANTES = [("A-actual-900-condensed", A), ("B-solo-tipografia", B),
             ("C-receta-completa", C), ("C2-remate-es-la-pregunta", C2)]


def render(nombre, cuerpo, tmp):
    html = f"<!doctype html><html><head><meta charset='utf-8'><style>{COMUN}</style></head><body>{cuerpo}</body></html>"
    f = tmp / f"{nombre}.html"
    f.write_text(html, encoding="utf-8")
    png = OUT / f"{nombre}.png"
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-sandbox",
                    "--window-size=1080,1920", "--force-device-scale-factor=1",
                    "--virtual-time-budget=8000", f"--screenshot={png}", f.as_uri()],
                   check=True, capture_output=True, timeout=90)
    print(f"OK {nombre}.png {png.stat().st_size} bytes")
    return png


def hoja_con_chrome(pngs, tmp):
    """La hoja que importa: las 3 variantes con la interfaz de IG encima.
    Un PNG suelto no puede mostrar qué le tapa la app."""
    ancho_mini = 420
    k = ancho_mini / 1080
    alto = round(1920 * k)
    top, bot = round(SAFE_TOP * k), round(SAFE_BOT * k)
    cols = "".join(
        f"<div class='col'><p class='rot'>{p.stem}</p><div class='mini'>"
        f"<img src='{p.as_uri()}'>"
        f"<div class='ui arriba'></div><div class='ui abajo'></div>"
        f"<div class='barras'><i></i><i></i><i></i></div>"
        f"<div class='perfil'><div class='av'></div><b>sergiourcullo</b></div>"
        f"<div class='responder'>Enviar mensaje</div></div></div>"
        for p in pngs)
    html = f"""<!doctype html><html><head><meta charset='utf-8'><style>
@import url('https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&family=Geist+Mono:wght@400;500&display=swap');
*{{margin:0;padding:0;box-sizing:border-box}}
body{{background:#F4F4F2;font-family:'Archivo',sans-serif}}
.hoja{{display:flex;gap:26px;padding:26px}}
.col{{width:{ancho_mini}px}}
.rot{{font-family:'Geist Mono',monospace;font-size:19px;letter-spacing:.07em;text-transform:uppercase;margin:0 0 10px 2px}}
.mini{{position:relative;width:{ancho_mini}px;height:{alto}px;border-radius:14px;overflow:hidden;box-shadow:0 8px 22px rgba(0,0,0,.18)}}
.mini img{{width:100%;height:100%;display:block}}
.ui{{position:absolute;left:0;right:0;background:rgba(214,28,42,.32);border-color:rgba(214,28,42,.95);border-style:solid;border-width:0}}
.arriba{{top:0;height:{top}px;border-bottom-width:3px}}
.abajo{{bottom:0;height:{bot}px;border-top-width:3px}}
.barras{{position:absolute;top:9px;left:9px;right:9px;display:flex;gap:4px}}
.barras i{{flex:1;height:4px;border-radius:2px;background:rgba(255,255,255,.55)}}
.barras i:first-child{{background:#fff}}
.perfil{{position:absolute;top:24px;left:11px;display:flex;align-items:center;gap:8px;color:#fff;font-size:15px;font-weight:600}}
.perfil .av{{width:26px;height:26px;border-radius:50%;background:#dcdcdc;border:2px solid #fff}}
.responder{{position:absolute;bottom:30px;left:14px;right:14px;height:39px;border:2px solid rgba(255,255,255,.9);
  border-radius:20px;display:flex;align-items:center;padding-left:18px;color:rgba(255,255,255,.92);font-size:15px}}
</style></head><body><div class='hoja'>{cols}</div></body></html>"""
    f = tmp / "hoja.html"
    f.write_text(html, encoding="utf-8")
    png = OUT / "COMPARACION-con-interfaz.png"
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-sandbox",
                    f"--window-size={len(pngs) * (ancho_mini + 26) + 26},{alto + 80}", "--force-device-scale-factor=1",
                    "--virtual-time-budget=8000", f"--screenshot={png}", f.as_uri()],
                   check=True, capture_output=True, timeout=120)
    print(f"OK COMPARACION-con-interfaz.png {png.stat().st_size} bytes")


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    tmp = Path(tempfile.mkdtemp(prefix="exp-historia-"))
    pngs = [render(n, c, tmp) for n, c in VARIANTES]
    hoja_con_chrome(pngs, tmp)
    shutil.rmtree(tmp, ignore_errors=True)
    print("MIRALAS: la hoja con interfaz decide; los PNG sueltos son para el detalle al 100 %.")


if __name__ == "__main__":
    main()
