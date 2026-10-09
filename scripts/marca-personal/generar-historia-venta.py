#!/usr/bin/env python3
"""Secuencia de 4 historias que VENDE la asesoría gratis: gancho → mito → revelación → CTA único.

Pedido de Sergio Urcullo, 8-oct-2026: «no me gustan las historias, el diseño hay que mejorar y recordá que hay
estructuras de contenido para poder hacer ventas». La estructura sale de `ONIA_MARCA_PERSONAL_ETAPA2_OPERACION.md` §2
(hook → mito → revelación con PRUEBA en pantalla → CTA con una sola acción) y de `STORY_REFERENCES.md` (una idea por
historia, una capa de interacción como máximo). El diseño es el de los kits que Sergio ya aprobó
(`generar-historia-llamada.py`: verde de marca, tarjeta negra, remate en banda, ícono 3D apoyado, sticker sobre el verde):
el CSS se IMPORTA de ese script, no se copia, para que haya una sola fuente del diseño.

QUÉ DICE CADA UNA (todo sale de material que ya existe, nada inventado):
  1 · gancho      — la 4.ª pregunta del checklist «¿Qué automatizo primero?» (ONIA_COMUNIDAD_CONTENIDO §Vie).
  2 · mito        — la creencia común: «automatizar = comprar un sistema enorme».
  3 · revelación  — la PRUEBA en pantalla: las 5 preguntas del checklist (versión corta de las del aviso CHECKLIST de la
                    comunidad, mismo orden y mismo sentido) con su regla «la que aparece en 2 o más respuestas va primero».
  4 · CTA         — una sola acción: reservar la asesoría gratis (20 min por Google Meet, medido en cal.com el 18-sep).
El sticker de LINK lo pega Sergio a mano al publicar (la API de historias no pone stickers), SOLO en la cuarta.

BANDA SEGURA: contenido dentro de y ∈ [230, 1498] (la interfaz de IG tapa 230 px arriba y 422 abajo).
Salida: hermes-content/carousels/out/historias-venta-asesoria/historia-0N.png
Gate:   CHROME_BIN=$CAROUSEL_BROWSER python3 scripts/marca-personal/chequear-banda-segura-historias.py <carpeta>
En la nube: `eval "$(sh scripts/carousel_cloud_setup.sh)"` en el MISMO comando (deja CAROUSEL_BROWSER y las fuentes).
"""
import importlib.util, os, shutil, subprocess, tempfile
from pathlib import Path

if not os.environ.get("CHROME_BIN") and os.environ.get("CAROUSEL_BROWSER"):
    os.environ["CHROME_BIN"] = os.environ["CAROUSEL_BROWSER"]   # el molde busca CHROME_BIN al importarse

REPO = Path(__file__).resolve().parents[2]
_spec = importlib.util.spec_from_file_location("molde_llamada", REPO / "scripts/marca-personal/generar-historia-llamada.py")
molde = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(molde)

OUT = REPO / "hermes-content/carousels/out/historias-venta-asesoria"

CSS_EXTRA = """
.fila-num{display:flex;align-items:flex-start;gap:24px;font-size:40px;font-weight:500;font-variation-settings:'wdth' 96;color:#EDEDED;padding:8px 0;line-height:1.22}
.fila-num .n{flex:none;width:46px;font-family:'Geist Mono',monospace;font-weight:500;color:var(--verde)}
.fila-num b{font-weight:650;color:var(--verde)}
.regla{margin-top:18px;padding-top:20px;border-top:2px solid rgba(255,255,255,.14);font-size:38px;font-weight:500;font-variation-settings:'wdth' 96;color:#EDEDED;line-height:1.25}
.regla b{font-weight:650;color:var(--verde)}
/* Gancho y mito: el texto ES la historia, así que va grande (un gancho tiene que frenar el pulgar). */
.card.xl{padding:68px 60px}
.card.denso{padding:50px 56px}
.card.denso .fila-num:nth-of-type(2){padding-right:104px}  /* el ícono 3D asoma sobre la primera fila */
.card .grande.xl.xxl{font-size:92px;line-height:1.1}
.card .grande.xl{font-size:78px;line-height:1.14;letter-spacing:-0.015em;font-weight:560;font-variation-settings:'wdth' 96}
.card .grande.xl b{font-weight:700}
"""

# (tag, cuerpo de la tarjeta, remate de la banda, ícono 3D, texto del sticker)
# El sticker NO repite el remate: contesta la objeción que el remate no contesta.
HISTORIAS = [
    # 1 · GANCHO — pregunta incómoda, del dueño de negocio, sin presentarme.
    ("UNA PREGUNTA · PARA TU NEGOCIO",
     '<div class="grande xl xxl">¿Dónde perdés clientes por <b>responder tarde</b>?</div>',
     "Empezá<br>por ahí",
     "bell", "pensalo<br>10 seg"),
    # 2 · MITO — «todos creen que…».
    ("EL MITO",
     '<div class="grande xl"><b>Todos creen</b> que automatizar es comprar un sistema enorme y pagarle a un programador.</div>',
     "No se empieza<br>por ahí",
     "money_bag", "ni cerca"),
    # 3 · REVELACIÓN — la prueba en pantalla: el checklist real, en su versión corta (mismo orden y sentido).
    ("LA VERDAD · 5 PREGUNTAS",
     '<div class="fila-num"><span class="n">1</span><span>¿Qué hago más de 3 veces por semana <b>igual</b>?</span></div>'
     '<div class="fila-num"><span class="n">2</span><span>¿Qué me <b>interrumpe</b> cuando trabajo en lo importante?</span></div>'
     '<div class="fila-num"><span class="n">3</span><span>¿Qué se me <b>olvida</b> seguido?</span></div>'
     '<div class="fila-num"><span class="n">4</span><span>¿Dónde pierdo clientes por <b>responder tarde</b>?</span></div>'
     '<div class="fila-num"><span class="n">5</span><span>¿Qué tarea odio tanto que la <b>postergo</b>?</span></div>'
     '<div class="regla">La que aparece en <b>2 o más</b> respuestas: esa va primero.</div>',
     "Una tarea,<br>no todo",
     "memo", "5 min"),
    # 4 · CTA — una sola acción. «Sin costo y sin venta» es el remate ya aprobado en el kit de la llamada.
    ("ASESORÍA GRATIS · 20 MIN",
     '<div class="grande">Traé tus respuestas. <b>Veinte minutos</b> con tu negocio delante: qué automatizar primero y qué <b>no</b> vale la pena pagar.</div>',
     "Reservá<br>la tuya",
     "spiral_calendar", "sin costo<br>y sin venta"),
]
CON_ZONA = [False, False, False, True]   # el recuadro del sticker de link va SOLO en la última
ICONO_TOP = [-52, -52, -52, -52]


def _capas(i, icono, texto):
    lado_izq = i % 2 == 0
    cinta = ('<div class="cinta" style="top:-26px;%s;transform:rotate(%+ddeg)"></div>'
             % ("left:96px" if lado_izq else "right:104px", -7 if lado_izq else 6))
    img = ('<img class="icono-flot" src="%s/%s.png" style="width:150px;top:%dpx;right:-30px;transform:rotate(%+ddeg)">'
           % (molde.ICONOS, icono, ICONO_TOP[i], 11 if lado_izq else -9))
    sticker = ('<div class="sticker" style="%s:-52px;bottom:-56px;transform:rotate(%+ddeg)">%s</div>'
               % ("right" if lado_izq else "left", 12 if lado_izq else -12, texto))
    return cinta + img, sticker


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    tmp = Path(tempfile.mkdtemp(prefix="historia-venta-"))
    for i, (tag, tarjeta, remate, icono, stk) in enumerate(HISTORIAS):
        capas_card, sticker = _capas(i, icono, stk)
        hueco = (f'<div class="zona"><span>{molde.ZONA}</span></div>' if CON_ZONA[i] else '<div class="aire"></div>')
        cuerpo = (f'<div class="lienzo"><div class="tag">{tag}</div>'
                  f'<div class="card{" xl" if i < 2 else ""}{" denso" if i == 2 else ""}">{capas_card}{tarjeta}</div>'
                  f'<div class="banda">{remate}{sticker}</div>{hueco}'
                  f'<div class="handle">@sergiourcullo</div></div>')
        html = f"<!doctype html><html><head><meta charset='utf-8'><style>{molde.CSS}{CSS_EXTRA}</style></head><body>{cuerpo}</body></html>"
        f = tmp / f"historia-{i + 1:02d}.html"
        f.write_text(html, encoding="utf-8")
        png = OUT / f"historia-{i + 1:02d}.png"
        # Chrome headless resta ~90 px de la ventana al capturar: se renderiza más alto y se corta a 1080x1920 (medido 8-oct).
        crudo = tmp / f"crudo-{i + 1:02d}.png"
        subprocess.run([molde.CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-sandbox",
                        "--window-size=1080,2100", "--force-device-scale-factor=1", "--virtual-time-budget=8000",
                        f"--screenshot={crudo}", f.as_uri()], check=True, capture_output=True, timeout=90)
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(crudo), "-vf", "crop=1080:1920:0:0", str(png)], check=True)
        print(f"OK historia-{i + 1:02d}.png {png.stat().st_size} bytes")
    shutil.rmtree(tmp, ignore_errors=True)


if __name__ == "__main__":
    main()
