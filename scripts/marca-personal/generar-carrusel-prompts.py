#!/usr/bin/env python3
"""Carrusel 1 del plan mensual — "5 prompts que uso a diario en mi negocio".
7 laminas 1080x1350. Salida: hermes-content/carousels/out/carrusel-5-prompts/

SISTEMA VISUAL (migrado el 02-sep, tanda intensiva)
---------------------------------------------------
Esta pieza estaba con la tipografia que Sergio RECHAZO (black 900 + condensed wdth 62).
Migrada a la tipografia real de la marca — la de la landing viva (layout.tsx de
onia-platform) y la del generador que Sergio aprobo (`generar-curso-dia1.py`):
cuerpo 450 · titulos 650 · wordmark 560 · eje wdth 96 · micro-etiquetas Geist Mono.

La receta salio del experimento A/B/C de esta misma corrida
(`carousels/out/experimento-tipografia-marca/`, veredicto en BASE_CONTENIDO §6).
Tres cosas que ese experimento midio y que NO se pueden saltear al migrar otra pieza:

  1. `wdth 96` es MAS ANCHO que `wdth 62`. El remate "5 PROMPTS" a 172px se salia del
     lienzo. Tope medido: 138px para 9 caracteres en una linea sobre 880px utiles.
  2. Cambiar solo el peso (900 -> 650) DEBILITA la portada en la grilla de perfil.
     La migracion tipografica va junto con la jerarquia de portada ganadora
     (contexto gris chico + remate gigante), nunca sola.
  3. El resaltado verde necesita `white-space:nowrap` o se parte entre lineas, y NO se
     le pega puntuacion detras (deja un hueco visible).

Verde de marca #00C661 como FONDO con tinta negra (8,72:1), nunca como color de texto
(2,12:1, reprueba AA) — veredicto del experimento del verde, BASE_CONTENIDO §7.
Capas collage en todas las laminas (regla "stickers siempre" de Sergio, 02-sep).
Iconos Fluent 3D (MIT). Sin marco spec-sheet: Sergio lo descarto.
"""
import subprocess, tempfile, shutil
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
ICONOS = (REPO / "hermes-content/references/ui-patterns/statement-3d-minimal/iconos").as_uri()
OUT = REPO / "hermes-content/carousels/out/carrusel-5-prompts"


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
:root{--bg:#F7F7F7;--ink:#0A0A0A;--muted:#8E8E8E;--card:#FFFFFF;--verde:#00C661}
html,body{width:1080px;height:1350px}
body{background:var(--bg);font-family:'Archivo',sans-serif;font-weight:450;overflow:hidden}
.lienzo{width:1080px;height:1350px;display:flex;flex-direction:column;justify-content:center;
  align-items:center;padding:90px 100px;position:relative}
.handle{position:absolute;bottom:52px;left:0;right:0;text-align:center;font-family:'Geist Mono',monospace;
  font-size:27px;font-weight:500;letter-spacing:.08em;color:var(--muted)}
/* --- tipografia de marca: pesos medios, eje wdth 96 --- */
.num{font-size:190px;font-weight:650;font-variation-settings:'wdth' 96;color:var(--ink);line-height:.9;letter-spacing:-0.03em}
.titulo{font-size:84px;font-weight:650;font-variation-settings:'wdth' 96;color:var(--ink);text-align:center;line-height:1.08;letter-spacing:-0.02em}
.contexto{font-size:56px;font-weight:450;color:var(--muted);text-align:center;line-height:1.25}
.remate{font-size:138px;font-weight:650;font-variation-settings:'wdth' 96;color:var(--ink);text-align:center;line-height:.94;letter-spacing:-0.035em;white-space:nowrap}
.icono{width:280px;height:280px;object-fit:contain;filter:drop-shadow(0 30px 45px rgba(0,0,0,.25))}
.icono-sm{width:200px;height:200px;object-fit:contain;filter:drop-shadow(0 22px 34px rgba(0,0,0,.22))}
.fila{display:flex;justify-content:center;align-items:flex-end}
/* --- la caja del prompt: lo que hace la lamina GUARDABLE --- */
.caja{background:var(--card);border-radius:36px;padding:54px 58px;font-size:39px;font-weight:450;
  line-height:1.42;color:var(--ink);box-shadow:0 18px 50px rgba(0,0,0,.07);width:100%}
.caja b{font-weight:650;background:var(--verde);border-radius:8px;padding:2px 10px;white-space:nowrap;
  -webkit-box-decoration-break:clone;box-decoration-break:clone}
.rotulo{font-family:'Geist Mono',monospace;font-size:26px;font-weight:500;letter-spacing:.1em;
  text-transform:uppercase;color:var(--muted)}
/* --- collage (regla "stickers siempre") --- */
.icono-flot{position:absolute;object-fit:contain;filter:drop-shadow(0 14px 22px rgba(0,0,0,.18))}
.cinta{position:absolute;width:190px;height:52px;background:rgba(0,0,0,.055);
  border:1px solid rgba(0,0,0,.05);box-shadow:0 3px 8px rgba(0,0,0,.05)}
.sticker{position:absolute;background:#0A0A0A;color:var(--verde);border-radius:50%;width:168px;height:168px;
  display:flex;align-items:center;justify-content:center;transform:rotate(12deg);font-weight:650;
  font-size:30px;line-height:1.1;text-align:center;box-shadow:0 14px 30px rgba(0,0,0,.25)}
"""

PORTADA = f"""
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


def prompt_slide(n, icono, titulo, cuerpo, adorno):
    """Una lamina = un prompt COPIABLE. El collage va fuera de la banda de texto."""
    return f"""
<div class="lienzo" style="gap:46px">
  {adorno}
  <div style="display:flex;align-items:center;gap:64px">
    <div class="num">0{n}</div>
    <img class="icono" src="{ICONOS}/{icono}.png">
  </div>
  <div class="titulo">{titulo}</div>
  <div style="position:relative;width:100%">
    <div class="sticker" style="right:-52px;top:-62px;width:148px;height:148px;font-size:27px">pegalo<br>TAL CUAL</div>
    <div class="rotulo" style="margin-bottom:16px">prompt listo para copiar</div>
    <div class="caja">{cuerpo}</div>
  </div>
  <div class="handle">@sergiourcullo</div>
</div>"""


CTA = f"""
<div class="lienzo" style="gap:52px">
  <div class="cinta" style="top:210px;right:110px;transform:rotate(7deg)"></div>
  <img class="icono-flot" src="{ICONOS}/light_bulb.png" style="width:150px;left:82px;top:224px;transform:rotate(-11deg)">
  <img class="icono" src="{ICONOS}/rocket.png">
  <div class="titulo">Estos 5 son el arranque.<br>El resto lo paso cada día</div>
  <div class="titulo" style="font-size:56px;font-weight:450;color:var(--muted);line-height:1.3">
    Comentá <span style="background:var(--verde);color:var(--ink);font-weight:650;border-radius:10px;padding:2px 16px;white-space:nowrap">COMUNIDAD</span><br>y te paso el enlace para unirte</div>
  <div class="handle">@sergiourcullo</div>
</div>"""

# Adornos de collage por lamina: cinta + un icono 3D flotando, siempre en los margenes
# superiores para no pisar el numero, el titulo ni la caja del prompt.
AD = [
    f'<div class="cinta" style="top:150px;right:120px;transform:rotate(7deg)"></div>'
    f'<img class="icono-flot" src="{ICONOS}/light_bulb.png" style="width:146px;left:70px;top:168px;transform:rotate(-11deg)">',
    f'<div class="cinta" style="top:158px;left:96px;transform:rotate(-9deg)"></div>'
    f'<img class="icono-flot" src="{ICONOS}/money_bag.png" style="width:140px;right:78px;top:172px;transform:rotate(10deg)">',
    f'<div class="cinta" style="top:150px;right:130px;transform:rotate(6deg)"></div>'
    f'<img class="icono-flot" src="{ICONOS}/sparkles.png" style="width:140px;left:76px;top:166px;transform:rotate(-8deg)">',
    f'<div class="cinta" style="top:156px;left:104px;transform:rotate(-7deg)"></div>'
    f'<img class="icono-flot" src="{ICONOS}/white_check_mark.png" style="width:132px;right:84px;top:170px;transform:rotate(9deg)">',
    f'<div class="cinta" style="top:150px;right:124px;transform:rotate(8deg)"></div>'
    f'<img class="icono-flot" src="{ICONOS}/hot_beverage.png" style="width:140px;left:74px;top:166px;transform:rotate(-10deg)">',
]

# Los cinco prompts. Regla de escritura: ningun resaltado <b> lleva puntuacion pegada
# detras (deja un hueco visible) — el hallazgo del experimento de esta corrida.
SLIDES = [
    PORTADA,
    prompt_slide(1, "speech_balloon", "Responder clientes",
        "Sos el encargado de atención de <b>[mi negocio]</b> y respondés a los clientes. "
        "Cálido, concreto, máximo 4 líneas. El mensaje es este: <b>[pegá el mensaje]</b>", AD[0]),
    prompt_slide(2, "money_bag", "Cotizar en 1 minuto",
        "Armame una cotización profesional para <b>[el servicio]</b> con qué incluye, qué no "
        "incluye y validez de 7 días. El precio es <b>[pegá el precio]</b>", AD[1]),
    prompt_slide(3, "memo", "Descripciones que venden",
        "Escribí 3 descripciones cortas, cada una con un ángulo distinto, para vender "
        "<b>[mi producto]</b> a <b>[este tipo de cliente]</b>", AD[2]),
    prompt_slide(4, "spiral_calendar", "Resumen de reunión",
        "Resumí estos apuntes en tres bloques: decisiones, tareas con responsable y "
        "pendientes. Los apuntes son estos: <b>[pegá los apuntes]</b>", AD[3]),
    prompt_slide(5, "chart_increasing", "Plan de la semana",
        "Soy dueño de <b>[mi negocio]</b> y quiero el plan de esta semana en bloques de "
        "2 horas. Mis 3 prioridades son <b>[pegá tus 3]</b>", AD[4]),
    CTA,
]


def render(nombre, cuerpo, tmp, w=1080, h=1350):
    html = f"<!doctype html><html><head><meta charset='utf-8'><style>{CSS}</style></head><body>{cuerpo}</body></html>"
    f = tmp / f"{nombre}.html"
    f.write_text(html, encoding="utf-8")
    png = OUT / f"{nombre}.png"
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-sandbox",
        f"--window-size={w},{h}", "--force-device-scale-factor=1", "--virtual-time-budget=9000",
        f"--screenshot={png}", f.as_uri()], check=True, capture_output=True, timeout=90)
    print(f"OK {nombre}.png {png.stat().st_size} bytes")


def hoja_contacto(tmp):
    """Hoja para MIRAR las 7 juntas antes de publicar: un >50KB no ve texto pisado."""
    celdas = "".join(
        f'<div><img src="{(OUT / f"lamina-{i:02d}.png").as_uri()}" style="width:300px;border:1px solid #DDD">'
        f'<div class="pie">lamina-{i:02d}</div></div>' for i in range(1, 8))
    html = f"""<!doctype html><html><head><meta charset='utf-8'><style>
    @import url('https://fonts.googleapis.com/css2?family=Geist+Mono:wght@500&display=swap');
    *{{margin:0;padding:0;box-sizing:border-box}}
    body{{background:#FFF;font-family:'Geist Mono',monospace;padding:40px;width:1360px}}
    h1{{font-size:22px;letter-spacing:.06em;margin-bottom:22px}}
    .g{{display:flex;flex-wrap:wrap;gap:26px}}
    .pie{{font-size:13px;color:#555;margin-top:7px}}
    </style></head><body><h1>CARRUSEL "5 PROMPTS" — 7 laminas, tipografia de marca</h1>
    <div class="g">{celdas}</div></body></html>"""
    f = tmp / "hoja.html"
    f.write_text(html, encoding="utf-8")
    png = OUT / "CONTACTO-7-laminas.png"
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-sandbox",
        "--window-size=1360,1500", "--force-device-scale-factor=1", "--virtual-time-budget=9000",
        f"--screenshot={png}", f.as_uri()], check=True, capture_output=True, timeout=90)
    print(f"OK CONTACTO-7-laminas.png {png.stat().st_size} bytes")


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    tmp = Path(tempfile.mkdtemp(prefix="prompts-"))
    for i, cuerpo in enumerate(SLIDES, 1):
        render(f"lamina-{i:02d}", cuerpo, tmp)
    hoja_contacto(tmp)
    shutil.rmtree(tmp, ignore_errors=True)


if __name__ == "__main__":
    main()
