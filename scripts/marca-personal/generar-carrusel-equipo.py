#!/usr/bin/env python3
"""Carrusel 5 del plan mensual — "las 6 herramientas que son mi equipo".
8 laminas 1080x1350. Salida: hermes-content/carousels/out/carrusel-equipo-no-cobra/

QUE ENSENA CADA LAMINA
----------------------
Un "puesto" del negocio + la herramienta que lo cubre + **el paso concreto para
arrancar hoy** (regla de contenido de Sergio 02-sep: "tus textos no ensenan nada" —
declarar no es contenido; ver references/ui-patterns/carrusel-pinterest-refs/FICHA.md).

FUENTE DE TODO LO QUE AFIRMA
---------------------------
`ONIA_MARCA_PERSONAL_BASE_CONTENIDO.md` §1 ("lo NUESTRO"): las 6 son herramientas que
usamos de verdad, no una lista sacada de internet. Las cuatro cifras que se dicen se
contaron EN VIVO en esta corrida, no de memoria:

  · chatbot con seguimientos automaticos → `ONIA_CATALOGO_DE_VENTA.md`, fila "Chatbot con
    IA (web + WhatsApp)", estado vivo. SIN PRECIO: el catalogo no le pone precio de lista.
  · n8n hace los seguimientos cada hora  → `crontab -l`: `17 * * * * followup-run.sh`
  · el guardian revisa cada 10 minutos   → `crontab -l`: `*/10 * * * * claude-guardia.sh`
  · el contenido se escribe 4 veces/dia  → `crontab -l`: `56 9,13,17,21 onia-loop.sh marca-personal`
  · cada imagen sale 0,12 creditos       → `higgsfield generate cost text2image_soul_v2`
    corrido en esta misma vuelta (consulta gratis, no se genero nada)

⚠️ El plan mensual titula este carrusel "16 anos, 0 empleados: las 6 herramientas que son
mi equipo". **"0 empleados" no se escribe**: no hay fuente para esa cifra en el carril y
es una afirmacion sobre la empresa que no puedo verificar. Se usa el nombre de la serie ya
validada ("Mi equipo no cobra", el molde del video de 5.407) que habla de las HERRAMIENTAS,
no de una nomina. Mismo criterio que con los "30 segundos" del carrusel 4.

SISTEMA VISUAL: la receta ganadora del experimento de tipografia de esta corrida
(carousels/out/experimento-tipografia-marca/, veredicto en BASE_CONTENIDO §6) —
Archivo pesos MEDIOS (cuerpo 450 / titulos 650 / eje wdth 96), remate de portada 138px
tope, resaltado verde con nowrap y sin puntuacion pegada, capas collage en toda lamina.
"""
import subprocess, tempfile, shutil
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
ICONOS = (REPO / "hermes-content/references/ui-patterns/statement-3d-minimal/iconos").as_uri()
OUT = REPO / "hermes-content/carousels/out/carrusel-equipo-no-cobra"


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
  align-items:center;padding:88px 100px;position:relative}
.handle{position:absolute;bottom:52px;left:0;right:0;text-align:center;font-family:'Geist Mono',monospace;
  font-size:27px;font-weight:500;letter-spacing:.08em;color:var(--muted)}
.num{font-size:172px;font-weight:650;font-variation-settings:'wdth' 96;color:var(--ink);line-height:.9;letter-spacing:-0.03em}
.titulo{font-size:80px;font-weight:650;font-variation-settings:'wdth' 96;color:var(--ink);text-align:center;line-height:1.08;letter-spacing:-0.02em}
.contexto{font-size:54px;font-weight:450;color:var(--muted);text-align:center;line-height:1.25}
.remate{font-size:138px;font-weight:650;font-variation-settings:'wdth' 96;color:var(--ink);text-align:center;line-height:.96;letter-spacing:-0.035em}
.sub{font-size:41px;font-weight:450;color:var(--muted);text-align:center;line-height:1.3}
.icono{width:250px;height:250px;object-fit:contain;filter:drop-shadow(0 30px 45px rgba(0,0,0,.25))}
.icono-sm{width:196px;height:196px;object-fit:contain;filter:drop-shadow(0 22px 34px rgba(0,0,0,.22))}
.fila{display:flex;justify-content:center;align-items:flex-end}
.caja{background:var(--card);border-radius:34px;padding:46px 52px;font-size:37px;font-weight:450;
  line-height:1.4;color:var(--ink);box-shadow:0 18px 50px rgba(0,0,0,.07);width:100%}
.caja b{font-weight:650;background:var(--verde);border-radius:8px;padding:2px 10px;white-space:nowrap;
  -webkit-box-decoration-break:clone;box-decoration-break:clone}
.rotulo{font-family:'Geist Mono',monospace;font-size:25px;font-weight:500;letter-spacing:.1em;
  text-transform:uppercase;color:var(--muted)}
.icono-flot{position:absolute;object-fit:contain;filter:drop-shadow(0 14px 22px rgba(0,0,0,.18))}
.cinta{position:absolute;width:190px;height:52px;background:rgba(0,0,0,.055);
  border:1px solid rgba(0,0,0,.05);box-shadow:0 3px 8px rgba(0,0,0,.05)}
.sticker{position:absolute;background:#0A0A0A;color:var(--verde);border-radius:50%;width:166px;height:166px;
  display:flex;align-items:center;justify-content:center;transform:rotate(12deg);font-weight:650;
  font-size:29px;line-height:1.1;text-align:center;box-shadow:0 14px 30px rgba(0,0,0,.25)}
"""

PORTADA = f"""
<div class="lienzo" style="gap:42px">
  <div class="cinta" style="top:188px;left:100px;transform:rotate(-8deg)"></div>
  <div class="sticker" style="top:206px;right:76px">las 6<br>QUE USO</div>
  <div class="contexto">16 años · Bolivia<br>una empresa de verdad</div>
  <div class="remate">MI EQUIPO<br>NO COBRA</div>
  <div class="fila" style="gap:150px;margin-top:22px">
    <img class="icono-sm" src="{ICONOS}/robot.png" style="transform:rotate(-9deg)">
    <img class="icono-sm" src="{ICONOS}/busts_in_silhouette.png" style="transform:rotate(10deg)">
  </div>
  <div class="handle">@sergiourcullo</div>
</div>"""


def puesto(n, icono, titulo, hace, paso, adorno):
    """Una lamina = un puesto + la herramienta + EL PASO concreto para arrancar hoy."""
    return f"""
<div class="lienzo" style="gap:34px">
  {adorno}
  <div style="display:flex;align-items:center;gap:58px">
    <div class="num">0{n}</div>
    <img class="icono" src="{ICONOS}/{icono}.png">
  </div>
  <div class="titulo">{titulo}</div>
  <div class="sub">{hace}</div>
  <div style="position:relative;width:100%;margin-top:8px">
    <div class="sticker" style="right:-50px;top:-58px;width:144px;height:144px;font-size:26px">hacé<br>ESTO HOY</div>
    <div class="rotulo" style="margin-bottom:14px">empezá por acá</div>
    <div class="caja">{paso}</div>
  </div>
  <div class="handle">@sergiourcullo</div>
</div>"""


CTA = f"""
<div class="lienzo" style="gap:48px">
  <div class="cinta" style="top:206px;right:108px;transform:rotate(7deg)"></div>
  <img class="icono-flot" src="{ICONOS}/light_bulb.png" style="width:148px;left:80px;top:220px;transform:rotate(-11deg)">
  <img class="icono" src="{ICONOS}/rocket.png">
  <div class="titulo">Ninguno de los 6 cobra.<br>Los 6 se pueden copiar</div>
  <div class="sub" style="font-size:52px;line-height:1.3">
    Comentá <span style="background:var(--verde);color:var(--ink);font-weight:650;border-radius:10px;padding:2px 16px;white-space:nowrap">COMUNIDAD</span><br>y te paso el enlace para unirte</div>
  <div class="handle">@sergiourcullo</div>
</div>"""

# Collage por lamina: cinta + un icono 3D flotando, SIEMPRE en la banda superior para no
# pisar el numero, el titulo ni la caja (el error que atrapo el experimento de tipografia).
AD = [
    f'<div class="cinta" style="top:142px;right:118px;transform:rotate(7deg)"></div>'
    f'<img class="icono-flot" src="{ICONOS}/light_bulb.png" style="width:140px;left:68px;top:158px;transform:rotate(-11deg)">',
    f'<div class="cinta" style="top:150px;left:94px;transform:rotate(-9deg)"></div>'
    f'<img class="icono-flot" src="{ICONOS}/white_check_mark.png" style="width:128px;right:76px;top:162px;transform:rotate(10deg)">',
    f'<div class="cinta" style="top:142px;right:126px;transform:rotate(6deg)"></div>'
    f'<img class="icono-flot" src="{ICONOS}/brain.png" style="width:136px;left:72px;top:156px;transform:rotate(-8deg)">',
    f'<div class="cinta" style="top:148px;left:100px;transform:rotate(-7deg)"></div>'
    f'<img class="icono-flot" src="{ICONOS}/sparkles.png" style="width:134px;right:80px;top:160px;transform:rotate(9deg)">',
    f'<div class="cinta" style="top:142px;right:120px;transform:rotate(8deg)"></div>'
    f'<img class="icono-flot" src="{ICONOS}/bell.png" style="width:130px;left:70px;top:156px;transform:rotate(-10deg)">',
    f'<div class="cinta" style="top:150px;left:96px;transform:rotate(-8deg)"></div>'
    f'<img class="icono-flot" src="{ICONOS}/hot_beverage.png" style="width:134px;right:78px;top:162px;transform:rotate(9deg)">',
]

SLIDES = [
    PORTADA,
    puesto(1, "speech_balloon", "La recepcionista",
        "contesta, califica y hace<br>el seguimiento sola",
        "Abrí una nota y escribí <b>las 10 preguntas</b> que más te hacen, con su respuesta. "
        "Sin ese archivo no hay IA que atienda bien", AD[0]),
    puesto(2, "spiral_calendar", "El de operaciones",
        "dispara los seguimientos cada hora,<br>sin que yo abra nada",
        "Elegí <b>una sola tarea</b> que hacés a la misma hora todos los días. Esa es la "
        "primera que se automatiza, no la más difícil", AD[1]),
    puesto(3, "laptop", "El constructor",
        "con esto está hecho el sistema<br>que uso todos los días",
        "Antes de pedirle que escriba, pedile que <b>lea</b> y te resuma tu propio negocio. "
        "Si no lo entiende, no te construye nada", AD[2]),
    puesto(4, "camera_with_flash", "El diseñador",
        "los artes de mi marca<br>salen por terminal",
        "Cotizá <b>antes</b> de generar. Cada imagen me sale 0,12 créditos y lo sé antes "
        "de apretar enter", AD[3]),
    puesto(5, "bell", "El vigilante",
        "revisa el servidor cada 10 minutos<br>y me avisa al teléfono",
        "Empezá por <b>una sola alerta</b> que te llegue al celular cuando algo se cae. "
        "Enterarte por un cliente sale más caro", AD[4]),
    puesto(6, "memo", "El de contenido",
        "escribe lo de mañana<br>mientras yo duermo",
        "Dejá escrito <b>mañana</b> antes de dormir. Mi servidor lo hace 4 veces al día, "
        "y con que vos lo hagas una vez alcanza", AD[5]),
    CTA,
]


def render(nombre, cuerpo, tmp):
    html = f"<!doctype html><html><head><meta charset='utf-8'><style>{CSS}</style></head><body>{cuerpo}</body></html>"
    f = tmp / f"{nombre}.html"
    f.write_text(html, encoding="utf-8")
    png = OUT / f"{nombre}.png"
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-sandbox",
        "--window-size=1080,1350", "--force-device-scale-factor=1", "--virtual-time-budget=9000",
        f"--screenshot={png}", f.as_uri()], check=True, capture_output=True, timeout=90)
    print(f"OK {nombre}.png {png.stat().st_size} bytes")


def hoja_contacto(tmp):
    """Las 8 juntas. Un >50KB no ve un sticker pisando texto; esta hoja si."""
    celdas = "".join(
        f'<div><img src="{(OUT / f"lamina-{i:02d}.png").as_uri()}" style="width:300px;border:1px solid #DDD">'
        f'<div class="pie">lamina-{i:02d}</div></div>' for i in range(1, 9))
    html = f"""<!doctype html><html><head><meta charset='utf-8'><style>
    @import url('https://fonts.googleapis.com/css2?family=Geist+Mono:wght@500&display=swap');
    *{{margin:0;padding:0;box-sizing:border-box}}
    body{{background:#FFF;font-family:'Geist Mono',monospace;padding:40px;width:1360px}}
    h1{{font-size:22px;letter-spacing:.06em;margin-bottom:22px}}
    .g{{display:flex;flex-wrap:wrap;gap:26px}}
    .pie{{font-size:13px;color:#555;margin-top:7px}}
    </style></head><body><h1>CARRUSEL "MI EQUIPO NO COBRA" — 8 laminas</h1>
    <div class="g">{celdas}</div></body></html>"""
    f = tmp / "hoja.html"
    f.write_text(html, encoding="utf-8")
    png = OUT / "CONTACTO-8-laminas.png"
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-sandbox",
        "--window-size=1360,1560", "--force-device-scale-factor=1", "--virtual-time-budget=9000",
        f"--screenshot={png}", f.as_uri()], check=True, capture_output=True, timeout=90)
    print(f"OK CONTACTO-8-laminas.png {png.stat().st_size} bytes")


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    tmp = Path(tempfile.mkdtemp(prefix="equipo-"))
    for i, cuerpo in enumerate(SLIDES, 1):
        render(f"lamina-{i:02d}", cuerpo, tmp)
    hoja_contacto(tmp)
    shutil.rmtree(tmp, ignore_errors=True)


if __name__ == "__main__":
    main()
