#!/usr/bin/env python3
"""Carrusel 4 del plan mensual — "como contesto a cada cliente sin estar yo": el paso a
paso de la atencion con IA, 7 laminas 1080x1350. Salida:
carousels/out/carrusel-atender-clientes/.

FUENTE DE LAS PROMESAS: hermes-content/docs/ONIA_CATALOGO_DE_VENTA.md, fila "Chatbot con
IA (web + WhatsApp)" (estado ✅ vivo). Todo lo que afirma cada lamina esta en esa fila:
contesta 24/7, califica, entiende FOTOS y audios, ESCALA a una persona un pedido de cita,
hace seguimiento, se edita CONVERSANDO, el dueno ve su guion en pasos, atiende desde la
bandeja propia y el bot se aparta cuando contesta el, IA incluida sin limite de chats.
SIN PRECIO: el catalogo no le pone precio de lista a esta fila.

⚠️ El plan mensual (ONIA_MARCA_PERSONAL_PLAN_MENSUAL.md SS2, item 4) titulaba este carrusel
"Como respondo clientes en 30 segundos con IA". Los 30 segundos NO estan medidos en ningun
lado: no hay fuente para esa cifra, asi que no se escribe (regla dura del carril). El tema
—el paso a paso de la atencion— es el mismo.

PORTADA: jerarquia por tamano (contexto chico gris + remate gigante wdth 125), ganadora
del experimento de miniatura del 02-sep — ver carousels/out/experimento-portada-miniatura/
y el veredicto en ONIA_MARCA_PERSONAL_BASE_CONTENIDO.md SS6. A 13% (grilla de perfil) es
la unica variante donde algo sigue leyendose; el subtitulo gris de las portadas viejas era
peso muerto (ilegible a 33% y a 13%).

Iconos Fluent 3D (MIT). Sin arte Higgsfield: el 02-sep la cuenta compartida dio
grace_daily_limit_reached (cero cargos) — registrado en HIGGSFIELD_RECETAS.
"""
import subprocess, tempfile, shutil
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
ICONOS = (REPO / "hermes-content/references/ui-patterns/statement-3d-minimal/iconos").as_uri()
OUT = REPO / "hermes-content/carousels/out/carrusel-atender-clientes"

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
:root{--bg:#F7F7F7;--ink:#0A0A0A;--muted:#8E8E8E;--card:#FFFFFF;--verde:#1F7A4D}
html,body{width:1080px;height:1350px}
body{background:var(--bg);font-family:'Archivo',sans-serif;overflow:hidden}
.lienzo{width:1080px;height:1350px;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:90px 100px;position:relative}
.handle{position:absolute;bottom:52px;left:0;right:0;text-align:center;font-family:'Geist Mono',monospace;font-size:27px;font-weight:500;letter-spacing:.08em;color:var(--muted)}
.num{font-size:200px;font-weight:900;font-variation-settings:'wdth' 125;color:var(--ink);letter-spacing:-0.02em;line-height:.9}
.icono{width:300px;height:300px;object-fit:contain;filter:drop-shadow(0 30px 45px rgba(0,0,0,.25))}
.titulo{font-size:88px;font-weight:900;font-variation-settings:'wdth' 62;color:var(--ink);letter-spacing:0;word-spacing:.09em;text-align:center;line-height:1.02}
/* Portada: contexto chico + remate gigante. Ganador del experimento de miniatura 02-sep. */
.contexto{font-size:62px;font-weight:900;font-variation-settings:'wdth' 62;color:var(--muted);text-align:center;line-height:1.05;word-spacing:.09em}
.remate{font-size:150px;font-weight:900;font-variation-settings:'wdth' 125;color:var(--ink);text-align:center;line-height:.92;letter-spacing:-0.02em}
.sub{font-size:44px;font-weight:600;color:var(--muted);text-align:center}
.caja{background:var(--card);border-radius:36px;padding:56px 60px;font-size:40px;line-height:1.45;color:var(--ink);box-shadow:0 18px 50px rgba(0,0,0,.07);width:100%}
.caja b{font-weight:600;background:#EFEDEA;border-radius:8px;padding:0 8px}
.cta{font-weight:900;color:var(--verde)}
.marco-top{position:absolute;top:0;left:0;right:0;display:flex;justify-content:space-between;
  padding:44px 56px;font-family:'Geist Mono',monospace;font-size:24px;font-weight:500;
  letter-spacing:.08em;text-transform:uppercase;color:var(--ink);border-bottom:2px solid var(--ink)}
.marco-bottom{position:absolute;bottom:0;left:0;right:0;display:flex;justify-content:space-between;
  padding:36px 56px 96px;font-family:'Geist Mono',monospace;font-size:22px;font-weight:500;
  letter-spacing:.06em;text-transform:uppercase;color:var(--muted);border-top:2px solid var(--ink)}
"""

SLIDES = [
    # 1 portada — marco spec-sheet + jerarquia por tamano (ganador miniatura)
    f"""<div class="lienzo" style="gap:50px;padding-top:150px;padding-bottom:150px">
  <div class="marco-top"><span>ONIA SYSTEM &middot; GRID 1080&times;1350</span><span>V1.0</span></div>
  <img class="icono" src="{ICONOS}/robot.png" style="width:240px;height:240px">
  <div>
    <div class="contexto">C&oacute;mo contesto a cada cliente</div>
    <div class="remate" style="margin-top:14px">SIN<br>ESTAR YO</div>
  </div>
  <div class="marco-bottom"><span>TECHNICAL SPEC &middot; TEMA: ATENCION CON IA</span><span>FORMATO: CARRUSEL</span></div>
  <div class="handle">@sergiourcullo</div>
</div>""",
    # 2 una sola bandeja
    f"""<div class="lienzo" style="gap:64px">
  <div style="display:flex;align-items:center;gap:70px">
    <div class="num">01</div>
    <img class="icono" src="{ICONOS}/speech_balloon.png">
  </div>
  <div class="titulo">Todo cae en una<br>sola bandeja</div>
  <div class="caja">Te escriben por la web o por WhatsApp y todo llega al mismo lugar. <b>No hay tres apps abiertas</b> ni un mensaje perdido en el celular de otro.</div>
  <div class="handle">@sergiourcullo</div>
</div>""",
    # 3 el guion es del dueno
    f"""<div class="lienzo" style="gap:64px">
  <div style="display:flex;align-items:center;gap:70px">
    <div class="num">02</div>
    <img class="icono" src="{ICONOS}/memo.png">
  </div>
  <div class="titulo">Contesta con<br>tu guion, no el m&iacute;o</div>
  <div class="caja">No tocás configuración: le decís qué responder <b>conversando con él</b> y ves tu guion escrito en pasos, para saber exactamente qué va a decir.</div>
  <div class="handle">@sergiourcullo</div>
</div>""",
    # 4 fotos y audios
    f"""<div class="lienzo" style="gap:64px">
  <div style="display:flex;align-items:center;gap:70px">
    <div class="num">03</div>
    <img class="icono" src="{ICONOS}/camera.png">
  </div>
  <div class="titulo">Entiende fotos<br>y audios</div>
  <div class="caja">El cliente manda la foto del repuesto o un audio de 40 segundos, como escribe de verdad. <b>No le pedís que lo escriba de nuevo</b> para poder atenderlo.</div>
  <div class="handle">@sergiourcullo</div>
</div>""",
    # 5 escalado a humano
    f"""<div class="lienzo" style="gap:64px">
  <div style="display:flex;align-items:center;gap:70px">
    <div class="num">04</div>
    <img class="icono" src="{ICONOS}/busts_in_silhouette.png">
  </div>
  <div class="titulo">Cuando hay que<br>cerrar, te lo pasa</div>
  <div class="caja">Un pedido de cita <b>lo escala a una persona</b> en vez de improvisar. Y cuando entrás vos a contestar, el bot se aparta solo de esa conversación.</div>
  <div class="handle">@sergiourcullo</div>
</div>""",
    # 6 seguimiento
    f"""<div class="lienzo" style="gap:64px">
  <div style="display:flex;align-items:center;gap:70px">
    <div class="num">05</div>
    <img class="icono" src="{ICONOS}/bell.png">
  </div>
  <div class="titulo">Al que no volvi&oacute;,<br>lo sigue solo</div>
  <div class="caja">El que preguntó y desapareció recibe el seguimiento igual. <b>Deja de depender de que te acuerdes</b> un martes a las 11 de la noche.</div>
  <div class="handle">@sergiourcullo</div>
</div>""",
    # 7 CTA comunidad (exacto, regla del carril)
    f"""<div class="lienzo" style="gap:56px">
  <img class="icono" src="{ICONOS}/rocket.png">
  <div class="titulo">El paso a paso<br>lo dejo adentro</div>
  <div class="sub">Comentá <span class="cta">COMUNIDAD</span> y te paso el enlace para unirte</div>
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

# TRAMPA DEL FORMATO (hallada al mirar las laminas del 02-sep): `.caja b` lleva
# `padding:0 8px`, asi que CUALQUIER signo de puntuacion pegado a `</b>` sale separado por
# un hueco visible ("...una persona : no improvisa"). Regla: el resaltado nunca termina
# justo antes de coma, dos puntos o punto — se reformula para que lo siga un espacio y una
# palabra. Aplica a todos los generadores que copien este CSS.
