#!/usr/bin/env python3
"""Historias-quiz 1080x1920 para IG (formato referencia ingenierobinario adaptado
a marca Onia: verde #00C661, Archivo variable, Geist Mono). La ENCUESTA la pega
Sergio en IG con el sticker nativo sobre la zona punteada.
Salida: hermes-content/carousels/out/historias-quiz/historia-0N.png
Respuestas correctas y opciones del poll: docs/ONIA_MARCA_PERSONAL_SEMANA1.md.

BANDA SEGURA (02-sep, experimento `experimento-safearea-historia.py`, ganó C):
todo el contenido vive dentro de y ∈ [230px, 1498px]. Fuera de ahí lo tapa la
interfaz de Instagram — con el layout viejo el handle quedaba TACHADO por la barra
"Enviar mensaje" y ~40% de la zona de encuesta caía debajo de la UI.
Fuente de la banda: `.agents/skills/embedded-captions/references/aesthetic-principles.md`
§17 — "9:16 TikTok/IG/Shorts: caption zone y ∈ [12%, 78%] (bottom 22% is UI)".
La escala tipográfica al 88% (--s) es lo que paga el alto que come la banda sin
apretar la zona del sticker.

TIPOGRAFIA DE MARCA (03-sep, experimento `experimento-historia-tipografia.py`,
ganó C2): Archivo cuerpo 450, títulos/remate 650, eje wdth 96 — SIN black 900 y
SIN condensed 62, que son los dos pesos que Sergio rechazó. La pregunta de la
banda es el REMATE de la historia (74px) y la tarjeta baja a peso de cuerpo: en
una historia el ojo tiene 5 segundos y sin jerarquía los dos bloques compiten.
⚠️ El remate NO puede ser una palabra de relleno: en un quiz la pregunta ES la
carga útil (variante C la degradó a micro-mono para poner un "Adiviná" y perdió).

CAPAS COLLAGE (regla "stickers siempre", Sergio 02-sep) — con dos reglas de
superficie que salieron de mirar el render al 100 %:
  · el ícono 3D va APOYADO sobre la tarjeta negra, no flotando en el verde: los
    Fluent 3D son blancos/lavanda y sobre el verde de marca gritan fuera de paleta.
  · el sticker negro va sobre el LIENZO VERDE mordiendo el borde de la banda —
    negro sobre negro no lee como sticker, lee como mancha."""
import subprocess, tempfile, shutil
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
OUT = REPO / "hermes-content/carousels/out/historias-quiz"
ICONOS = (REPO / "hermes-content/references/ui-patterns/statement-3d-minimal/iconos").as_uri()

SAFE_TOP = round(1920 * 0.12)      # 230 — UI de arriba (perfil + barras de progreso)
SAFE_BOT = round(1920 * 0.22)      # 422 — UI de abajo (barra "Enviar mensaje")

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

CSS = f"""
@import url('https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&family=Geist+Mono:wght@400;500&display=swap');
*{{margin:0;padding:0;box-sizing:border-box}}
:root{{--verde:#00C661;--ink:#0A0A0A;--blanco:#FFFFFF;--s:.88}}
html,body{{width:1080px;height:1920px}}
body{{background:var(--verde);font-family:'Archivo',sans-serif;overflow:hidden}}
.lienzo{{width:1080px;height:1920px;display:flex;flex-direction:column;align-items:center;padding:{SAFE_TOP + 40}px 90px {SAFE_BOT + 74}px;position:relative;gap:44px}}
.tag{{font-family:'Geist Mono',monospace;font-size:calc(32px*var(--s));font-weight:500;letter-spacing:.14em;color:rgba(0,0,0,.6)}}
/* position:relative NO es cosmético: sin él las capas collage se anclan al .lienzo
   y se van al borde superior del lienzo — o sea DEBAJO de las barras de progreso y
   del usuario de IG. Lo atrapó CHEQUEO-banda-segura.png, no el peso del PNG. */
.card{{background:#111312;border-radius:40px;padding:calc(70px*var(--s)) calc(64px*var(--s));width:100%;box-shadow:0 24px 60px rgba(0,0,0,.22);color:#EDEDED;position:relative}}
.card .mono{{font-family:'Geist Mono',monospace;font-size:calc(36px*var(--s));line-height:1.6}}
.card .mono .v{{color:var(--verde)}}
.card .mono .c{{color:#8E8E8E}}
.card .grande{{font-size:calc(54px*var(--s));font-weight:450;font-variation-settings:'wdth' 96;line-height:1.3;letter-spacing:-0.01em}}
.card .grande b{{font-weight:650;color:var(--verde)}}
.banda{{background:var(--ink);color:var(--verde);width:100%;border-radius:28px;padding:calc(46px*var(--s)) 40px;text-align:center;font-size:calc(84px*var(--s));font-weight:650;font-variation-settings:'wdth' 96;letter-spacing:-0.025em;line-height:1.06;position:relative}}
.zona{{border:5px dashed rgba(0,0,0,.35);border-radius:36px;width:86%;flex:1;min-height:0;display:flex;align-items:center;justify-content:center}}
.zona span{{font-family:'Geist Mono',monospace;font-size:30px;letter-spacing:.12em;color:rgba(0,0,0,.45)}}
.handle{{position:absolute;bottom:{SAFE_BOT + 12}px;left:0;right:0;text-align:center;font-family:'Geist Mono',monospace;font-size:28px;font-weight:500;letter-spacing:.08em;color:rgba(0,0,0,.55)}}
.fila-icono{{display:flex;align-items:center;gap:28px;font-size:calc(44px*var(--s));font-weight:500;font-variation-settings:'wdth' 96;color:#EDEDED;padding:calc(16px*var(--s)) 0}}
/* capas collage — ícono 3D APOYADO en la tarjeta negra, sticker en el lienzo verde */
.icono-flot{{position:absolute;object-fit:contain;filter:drop-shadow(0 14px 22px rgba(0,0,0,.28))}}
.cinta{{position:absolute;width:190px;height:52px;background:rgba(255,255,255,.5);border:1px solid rgba(0,0,0,.05);box-shadow:0 3px 8px rgba(0,0,0,.06)}}
.sticker{{position:absolute;background:var(--ink);color:var(--verde);border-radius:50%;width:158px;height:158px;display:flex;align-items:center;justify-content:center;font-weight:650;font-size:29px;line-height:1.1;text-align:center;box-shadow:0 14px 30px rgba(0,0,0,.25)}}
"""

# Capas collage por historia: (icono Fluent 3D, texto del sticker).
# El ícono se apoya en la esquina de la tarjeta negra; el sticker muerde el borde
# de la banda desde el lienzo verde. Ninguno de los dos pisa texto — verificado en
# CHEQUEO-banda-segura.png, que es la hoja que hay que MIRAR antes de publicar.
COLLAGE = [
    ("speech_balloon", "tu voto<br>manda"),
    ("brain",          "una es<br>TRAMPA"),
    ("money_bag",      "el precio<br>REAL"),
    ("robot",          "pasa ahora<br>mismo"),
    ("memo",           "esta<br>MISMA"),
    ("hot_beverage",   "pensalo<br>bien"),
    ("light_bulb",     "probá<br>hoy"),
]


def _capas(i):
    """Devuelve (cinta+icono para la tarjeta, sticker para la banda)."""
    icono, texto = COLLAGE[i]
    lado_izq = i % 2 == 0
    cinta = ('<div class="cinta" style="top:-26px;%s;transform:rotate(%+ddeg)"></div>'
             % ("left:96px" if lado_izq else "right:104px", -7 if lado_izq else 6))
    # El ícono va SIEMPRE a la derecha: el texto de las tarjetas es alineado a la
    # izquierda, así que la esquina superior derecha es la única vacía en las 7.
    # Alternándolo, en las impares tapaba el primer emoji de la lista y el "$" de
    # la terminal — visible sólo al mirar el render, no en el peso del PNG.
    img = ('<img class="icono-flot" src="%s/%s.png" style="width:150px;top:-52px;right:-30px;'
           'transform:rotate(%+ddeg)">' % (ICONOS, icono, 11 if lado_izq else -9))
    sticker = ('<div class="sticker" style="%s:-52px;bottom:-56px;transform:rotate(%+ddeg)">%s</div>'
               % ("right" if lado_izq else "left", 12 if lado_izq else -12, texto))
    return cinta + img, sticker


# (tag, cuerpo de la tarjeta, pregunta de la banda) — la pregunta es el REMATE.
HISTORIAS = [
    # 1 — cuánto tarda un asistente
    ("QUIZ · IA PARA TU NEGOCIO",
     '<div class="grande">Un asistente que responde a <b>tus clientes</b> las preguntas de siempre — precio, stock, horarios — sin que estés vos.</div>',
     "¿Cuánto tarda<br>armarlo?"),
    # 2 — cuál NO puede
    ("QUIZ · IA PARA TU NEGOCIO",
     '<div class="fila-icono">📸&ensp;Fotos de producto de catálogo</div>'
     '<div class="fila-icono">💬&ensp;Responder WhatsApp de clientes</div>'
     '<div class="fila-icono">🧾&ensp;Cotizar sola en 1 minuto</div>'
     '<div class="fila-icono">📅&ensp;Agendar citas y recordarlas</div>',
     "¿Cuál NO puede<br>hacer la IA hoy?"),
    # 3 — cuánto costó el arte (terminal real)
    ("QUIZ · ASÍ TRABAJO",
     '<div class="mono"><span class="c">$</span> higgsfield generate cost<br><br>modelo: <span class="v">soul_v2</span><br>tamaño: <span class="v">2048px</span><br>costo: <span class="v">0,12 créditos</span><br><br><span class="c"># un arte para mi marca,</span><br><span class="c"># generado desde la terminal</span></div>',
     "¿Cuánto costó<br>en bolivianos?"),
    # 4 — el guardián del VPS (cron real, verificado en vivo: */10 * * * * claude-guardia.sh)
    ("QUIZ · ASÍ TRABAJO",
     '<div class="mono"><span class="c">$</span> crontab -l<br><br><span class="v">*/10 * * * *</span> claude-guardia.sh<br><br><span class="c"># revisa el servidor solo,</span><br><span class="c"># levanta lo que se cayó</span><br><span class="c"># y me avisa por Telegram</span></div>',
     "¿Cada cuánto<br>se revisa solo?"),
    # 5 — los loops de contenido (meta-contenido: esta historia la escribió el servidor)
    ("QUIZ · ASÍ TRABAJO",
     '<div class="grande">Esta historia no la escribí yo a las 3 de la mañana. La escribió <b>mi servidor</b>, solo. Yo apreté publicar.</div>',
     "¿Cuántas veces al día<br>trabaja sin mí?"),
    # 6 — el empleado que no duerme (claim "Bs 0 en sueldos" del banco de la FICHA)
    ("QUIZ · ASÍ TRABAJO",
     '<div class="fila-icono">🌙&ensp;No duerme</div>'
     '<div class="fila-icono">📅&ensp;No falta los lunes</div>'
     '<div class="fila-icono">🚪&ensp;No renuncia</div>'
     '<div class="fila-icono">⚡&ensp;Trabaja los feriados</div>',
     "¿Cuánto le pago<br>de sueldo?"),
    # 7 — por qué la IA contesta cualquier cosa (03-sep). El hueco del set eran las
    # historias PARA EL DUEÑO DE NEGOCIO: 4 de las 6 primeras eran build-in-public.
    # Enseña una idea aplicable hoy y sin ninguna cifra que haya que sostener.
    ("QUIZ · IA PARA TU NEGOCIO",
     '<div class="grande">Le pedís que atienda a tus clientes y contesta <b>cualquier cosa</b>: inventa un precio, manda a un horario que no abrís, promete lo que no tenés.</div>',
     "¿Qué le falta<br>para contestar<br>como vos?"),
]


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    tmp = Path(tempfile.mkdtemp(prefix="historia-"))
    for i, (tag, tarjeta, pregunta) in enumerate(HISTORIAS):
        capas_card, sticker = _capas(i)
        cuerpo = (f'<div class="lienzo">'
                  f'<div class="tag">{tag}</div>'
                  f'<div class="card">{capas_card}{tarjeta}</div>'
                  f'<div class="banda">{pregunta}{sticker}</div>'
                  f'<div class="zona"><span>ENCUESTA ACÁ ↓</span></div>'
                  f'<div class="handle">@sergiourcullo</div>'
                  f'</div>')
        i += 1
        html = f"<!doctype html><html><head><meta charset='utf-8'><style>{CSS}</style></head><body>{cuerpo}</body></html>"
        f = tmp / f"historia-{i:02d}.html"
        f.write_text(html, encoding="utf-8")
        png = OUT / f"historia-{i:02d}.png"
        subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-sandbox",
            "--window-size=1080,1920", "--force-device-scale-factor=1",
            "--virtual-time-budget=8000", f"--screenshot={png}", f.as_uri()],
            check=True, capture_output=True, timeout=90)
        print(f"OK historia-{i:02d}.png {png.stat().st_size} bytes")
    shutil.rmtree(tmp, ignore_errors=True)

if __name__ == "__main__":
    main()
