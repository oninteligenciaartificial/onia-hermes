#!/usr/bin/env python3
"""Historias 1080x1920 para anunciar la LLAMADA 1 A 1 (IG stories).

Pedido de Sergio Urcullo, 2026-09-18: «quiero publicar la nueva funcion de
llamada a mis historias». Tres piezas: qué es · qué pasa adentro · cuándo.

DATOS MEDIDOS EN VIVO, no copiados de la web (2026-09-18, Playwright con
timezone America/La_Paz sobre cal.com/sergiourcullo):
  · el evento vivo es `/20min`, se llama «Llamada 1 a 1», dura 20 MINUTOS y es
    por Google Meet. ⚠️ `/30min` da 404 — era el slug que la web tenía en 7
    enlaces y por eso el botón no abría nada.
  · disponibilidad real: sábado 10:00-17:00 (21 cupos), lunes a viernes
    14:00-16:00 y 19:00-22:00 (15 cupos), domingo cerrado.
Si Sergio cambia el evento en cal.com, estas piezas quedan viejas: se vuelve a
medir con `scratchpad/cal-disp.mjs` antes de regenerar. Ningún número de acá
sale de la web ni de memoria.

BANDA SEGURA, TIPOGRAFÍA Y CAPAS COLLAGE: mismo molde que
`generar-historia-quiz.py` (ver su cabecera para la historia de cada decisión).
Contenido dentro de y ∈ [230px, 1498px]; Archivo 450/650 eje wdth 96, sin black
900 ni condensed 62; ícono 3D APOYADO en la tarjeta negra y sticker sobre el
lienzo verde.

LA ZONA PUNTEADA ES PARA EL STICKER DE LINK, no para una encuesta: es el único
camino clicable de una historia. Sergio lo pega encima al publicar, apuntando a
https://cal.com/sergiourcullo/20min — y va SOLO en la tercera (ver `CON_ZONA`):
las dos primeras cuentan, la última pide la acción.

Salida: hermes-content/carousels/out/historias-llamada/historia-0N.png
Gate: python3 chequear-banda-segura-historias.py hermes-content/carousels/out/historias-llamada
"""
import subprocess, tempfile, shutil
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
OUT = REPO / "hermes-content/carousels/out/historias-llamada"
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
.card{{background:#111312;border-radius:40px;padding:calc(70px*var(--s)) calc(64px*var(--s));width:100%;box-shadow:0 24px 60px rgba(0,0,0,.22);color:#EDEDED;position:relative}}
.card .grande{{font-size:calc(54px*var(--s));font-weight:450;font-variation-settings:'wdth' 96;line-height:1.3;letter-spacing:-0.01em}}
.card .grande b{{font-weight:650;color:var(--verde)}}
/* ⚠️ El texto de la fila va SIEMPRE dentro de un <span>, no suelto: `.fila-icono`
   es flex con gap:28px, así que cada hijo directo recibe esa separación — y un
   <b> suelto se vuelve flex item y queda flotando con 28px de aire a cada lado
   («Miramos  tu caso , no una demo»). El molde del quiz nunca lo vio porque sus
   filas no tenían negritas. Con el <span> el gap separa ícono y texto, y la
   negrita vuelve a ser texto corriente. */
.fila-icono{{display:flex;align-items:flex-start;gap:28px;font-size:calc(44px*var(--s));font-weight:500;font-variation-settings:'wdth' 96;color:#EDEDED;padding:calc(16px*var(--s)) 0;line-height:1.25}}
.fila-icono b{{font-weight:650;color:var(--verde)}}
/* Horario: dos columnas mono. El día a la izquierda y la hora a la derecha leen
   como una tabla sin dibujar una: en 5 segundos nadie lee una grilla con bordes. */
.horario{{display:grid;grid-template-columns:auto 1fr;gap:calc(26px*var(--s)) 40px;font-family:'Geist Mono',monospace;font-size:calc(36px*var(--s));line-height:1.35}}
.horario .d{{color:#8E8E8E}}
.horario .h{{color:var(--verde);text-align:right;white-space:nowrap}}
.pie{{margin-top:calc(34px*var(--s));font-family:'Geist Mono',monospace;font-size:calc(28px*var(--s));letter-spacing:.06em;color:#8E8E8E}}
.banda{{background:var(--ink);color:var(--verde);width:100%;border-radius:28px;padding:calc(46px*var(--s)) 40px;text-align:center;font-size:calc(84px*var(--s));font-weight:650;font-variation-settings:'wdth' 96;letter-spacing:-0.025em;line-height:1.06;position:relative}}
.zona{{border:5px dashed rgba(0,0,0,.35);border-radius:36px;width:86%;flex:1;min-height:0;display:flex;align-items:center;justify-content:center}}
.zona span{{font-family:'Geist Mono',monospace;font-size:30px;letter-spacing:.12em;color:rgba(0,0,0,.45)}}
/* El mismo hueco que `.zona` pero sin dibujarlo. Va en las historias que NO
   llevan sticker de link: sin él, el `flex:1` desaparece del lienzo y el bloque
   se estira hacia abajo, o sea que quitar el recuadro movería la composición de
   las tres. Este spacer deja el contenido exactamente donde está. */
.aire{{flex:1;min-height:0}}
.handle{{position:absolute;bottom:{SAFE_BOT + 12}px;left:0;right:0;text-align:center;font-family:'Geist Mono',monospace;font-size:28px;font-weight:500;letter-spacing:.08em;color:rgba(0,0,0,.55)}}
.icono-flot{{position:absolute;object-fit:contain;filter:drop-shadow(0 14px 22px rgba(0,0,0,.28))}}
.cinta{{position:absolute;width:190px;height:52px;background:rgba(255,255,255,.5);border:1px solid rgba(0,0,0,.05);box-shadow:0 3px 8px rgba(0,0,0,.06)}}
.sticker{{position:absolute;background:var(--ink);color:var(--verde);border-radius:50%;width:158px;height:158px;display:flex;align-items:center;justify-content:center;font-weight:650;font-size:29px;line-height:1.1;text-align:center;box-shadow:0 14px 30px rgba(0,0,0,.25)}}
"""

# (ícono Fluent 3D, texto del sticker) por historia.
# ⚠️ El sticker NO repite el remate de su propia banda: en el primer render decía
# «sin venta» encima de una banda que ya gritaba «Sin costo y sin venta», y
# «salís con un plan» sobre «Salís con un plan». Dos veces la misma frase a dos
# tamaños no es énfasis, es una capa desperdiciada — el sticker es el lugar para
# la objeción que el remate no contesta.
# `busts_in_silhouette` salió por invisible: es morado oscuro y sobre la tarjeta
# negra desaparece. Los Fluent 3D que leen ahí son los claros (globo, check,
# calendario), mirado en el render al 100 %.
COLLAGE = [
    ("speech_balloon",   "es en<br>serio"),
    ("white_check_mark", "gratis<br>igual"),
    ("spiral_calendar",  "20 min<br>gratis"),
]


# Cuánto asoma el ícono por arriba de la tarjeta, por historia.
# La 03 necesita -96 y no -52: su tarjeta es la única con una columna alineada a
# la DERECHA (las horas), y con el valor del molde el calendario le comía el «0»
# final de «14:00-16:00». Visto en el render al 100 %, no en el peso del PNG.
# Subirlo lo deja mordiendo el borde sin entrar en la primera línea de texto.
ICONO_TOP = [-52, -52, -96]


def _capas(i):
    """(cinta + ícono apoyados en la tarjeta, sticker que muerde la banda)."""
    icono, texto = COLLAGE[i]
    lado_izq = i % 2 == 0
    cinta = ('<div class="cinta" style="top:-26px;%s;transform:rotate(%+ddeg)"></div>'
             % ("left:96px" if lado_izq else "right:104px", -7 if lado_izq else 6))
    # El ícono va SIEMPRE a la derecha: el texto de las tarjetas es alineado a la
    # izquierda, así que la esquina superior derecha es la única vacía en las tres.
    img = ('<img class="icono-flot" src="%s/%s.png" style="width:150px;top:%dpx;right:-30px;'
           'transform:rotate(%+ddeg)">' % (ICONOS, icono, ICONO_TOP[i], 11 if lado_izq else -9))
    sticker = ('<div class="sticker" style="%s:-52px;bottom:-56px;transform:rotate(%+ddeg)">%s</div>'
               % ("right" if lado_izq else "left", 12 if lado_izq else -12, texto))
    return cinta + img, sticker


# (tag, cuerpo de la tarjeta, remate de la banda). El remate es lo único que se
# lee de lejos: va el beneficio, no el nombre del producto.
HISTORIAS = [
    # 1 — qué es. Arranca por lo que se lleva el otro, no por mí.
    ("LLAMADA 1 A 1 · GRATIS",
     '<div class="grande">Veinte minutos con <b>tu negocio</b> delante: qué automatizar primero, dónde te trabaste, y qué <b>no</b> vale la pena pagar.</div>',
     "Sin costo<br>y sin venta"),
    # 2 — qué pasa adentro. Cuatro líneas concretas; la cuarta es el límite dicho
    # de frente, que es lo que hace creíbles a las otras tres.
    ("LLAMADA 1 A 1 · QUÉ PASA",
     '<div class="fila-icono"><span>🔎</span><span>Miramos <b>tu caso</b>, no una demo</span></div>'
     '<div class="fila-icono"><span>🧰</span><span>Te digo qué instalar <b>primero</b></span></div>'
     '<div class="fila-icono"><span>🚫</span><span>Y qué <b>no</b> te sirve todavía</span></div>'
     '<div class="fila-icono"><span>💻</span><span>Google Meet · 20 minutos</span></div>',
     "Salís con<br>un plan"),
    # 3 — cuándo. Horarios MEDIDOS en cal.com, no copiados de la web.
    ("LLAMADA 1 A 1 · CUÁNDO",
     '<div class="horario">'
     '<span class="d">Lunes a viernes</span><span class="h">14:00-16:00</span>'
     '<span class="d"></span><span class="h">19:00-22:00</span>'
     '<span class="d">Sábado</span><span class="h">10:00-17:00</span>'
     '</div>'
     '<div class="pie">HORA DE BOLIVIA · ELEGÍS DÍA Y HORA</div>',
     "Elegí<br>tu horario"),
]

# El recuadro del sticker de link va SOLO en la última (Sergio Urcullo, 18-sep:
# «que solo la final tenga el link, los otros no necesitan el recuadro»). Las dos
# primeras cuentan; la tercera es la que pide la acción, y un recuadro repetido
# tres veces deja de señalar dónde tocar. Las otras dos llevan el mismo hueco sin
# dibujar, así la composición no se mueve.
ZONA = "LINK ACÁ ↓"          # sticker de link a cal.com/sergiourcullo/20min
CON_ZONA = [False, False, True]


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    tmp = Path(tempfile.mkdtemp(prefix="historia-llamada-"))
    for i, (tag, tarjeta, remate) in enumerate(HISTORIAS):
        capas_card, sticker = _capas(i)
        hueco = (f'<div class="zona"><span>{ZONA}</span></div>' if CON_ZONA[i]
                 else '<div class="aire"></div>')
        cuerpo = (f'<div class="lienzo">'
                  f'<div class="tag">{tag}</div>'
                  f'<div class="card">{capas_card}{tarjeta}</div>'
                  f'<div class="banda">{remate}{sticker}</div>'
                  f'{hueco}'
                  f'<div class="handle">@sergiourcullo</div>'
                  f'</div>')
        n = i + 1
        html = f"<!doctype html><html><head><meta charset='utf-8'><style>{CSS}</style></head><body>{cuerpo}</body></html>"
        f = tmp / f"historia-{n:02d}.html"
        f.write_text(html, encoding="utf-8")
        png = OUT / f"historia-{n:02d}.png"
        subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-sandbox",
            "--window-size=1080,1920", "--force-device-scale-factor=1",
            "--virtual-time-budget=8000", f"--screenshot={png}", f.as_uri()],
            check=True, capture_output=True, timeout=90)
        print(f"OK historia-{n:02d}.png {png.stat().st_size} bytes")
    shutil.rmtree(tmp, ignore_errors=True)


if __name__ == "__main__":
    main()
