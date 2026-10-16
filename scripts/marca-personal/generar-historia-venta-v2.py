#!/usr/bin/env python3
"""Secuencia v2 de 4 historias (1080x1920) que VENDE la asesoría de IA gratis: gancho -> mito -> revelación -> CTA único.

Rediseño de `generar-historia-venta.py` (v1, NO se toca): la v1 eran cuatro veces el mismo afiche (tarjeta negra +
banda negra + sticker + ícono 3D sobre verde) y la «prueba» de cada lámina era siempre un recuadro de texto. Acá cada
lámina trae una PRUEBA VISUAL distinta, en el orden de ONIA_MARCA_PERSONAL_ETAPA2_OPERACION §2:
  1 · gancho      (negro)  — un mensaje de cliente sin respuesta: burbuja + «visto · sin respuesta».
  2 · mito        (blanco) — contraste hecho con texto: las dos creencias TACHADAS vs. la frase que queda.
  3 · revelación  (verde)  — las 5 preguntas del checklist de la comunidad, en tarjeta numerada + la regla.
  4 · CTA         (negro)  — tarjeta de acción verde (20 min · qué te llevás) y el tercio inferior LIBRE para el
                             sticker de link, que Sergio Urcullo pega a mano (la API de historias no pone stickers).

COPY (nada inventado): gancho = pregunta 4 del checklist (ONIA_COMUNIDAD_CONTENIDO §Vie); mito = v1; 5 preguntas =
versión corta del mismo checklist, mismo orden; oferta = «Asesoría de IA gratis» de ONIA_COMUNIDAD_CONTENIDO
(20 min por videollamada, con qué se va). El link cal.com/sergiourcullo/20min NO se escribe en ninguna lámina.
La burbuja de la 1 es un EJEMPLO tipográfico (sin nombre, hora, logo ni marca de app): no es una captura ni un testimonio.

PALETA/TIPOS: pack `referentes` (verde #10C26B, blanco, negro #0A0F0D; Bricolage + DM Sans + DM Mono + Caveat).
Bricolage sale del repo (hermes-content/brand/fonts: su archivo llega a 700, por eso no se pide 800);
DM Sans, DM Mono y Caveat son las del sistema (`eval "$(sh scripts/carousel_cloud_setup.sh)"` las instala).

FOTO OPCIONAL de Sergio Urcullo: cada lámina declara su ventana (FOTO_SLOTS). La versión sin foto es la FINAL que se muestra.
  --foto 1=/ruta/a.jpg [--foto 3=...]  ->  con-foto/historia-0N.png (ventana rellena; sin foto, no se crea nada)
  FOTO-SLOTS.png                       ->  hoja con las ventanas vacías, para pedir las tomas

BANDA SEGURA: la interfaz de IG tapa 230 px arriba y 422 abajo (gate del repo). Todo el contenido vive en y 270..1450
(la 4: 270..1280, tercio inferior libre). Se verifica POR PÍXELES (fondo plano), no solo a ojo.

SALIDAS en hermes-content/carousels/out/historias-venta-asesoria-v2/:
  historia-01..04.png · 390/historia-0N-390.png · CHEQUEO-banda-segura.png · FOTO-SLOTS.png · medidas-390.json

Uso (UN solo comando, en la nube o en la PC con Playwright):
  eval "$(sh scripts/carousel_cloud_setup.sh)" && python3 scripts/marca-personal/generar-historia-venta-v2.py
"""
import argparse, json, os, shutil, subprocess, sys, tempfile
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
OUT = REPO / "hermes-content/carousels/out/historias-venta-asesoria-v2"
FUENTES = REPO / "hermes-content/brand/fonts"

W, H = 1080, 1920
SAFE_TOP, SAFE_BOT = 230, 422            # lo que tapa la interfaz de IG (gate chequear-banda-segura-historias.py)
LIMITE_ABAJO = H - SAFE_BOT              # 1498
LIMITE_ABAJO_4 = 1280                    # la 4: desde acá, el tercio inferior queda LIBRE para el sticker de link
TOP_CONTENIDO = 270
UMBRAL_PRINCIPAL, UMBRAL_SECUNDARIO = 16.0, 11.0   # px CSS a 390 de ancho
ESCALA_390 = 390 / W

# (id de toma, ventana, tamaño px en el lienzo 1080x1920, encuadre pedido)
FOTO_SLOTS = {
    1: dict(toma="A", forma="franja", w=936, h=520, pos="50% 38%",
            fondo="oscuro liso", texto="mirando a cámara, serio y cercano"),
    2: dict(toma="B", forma="franja", w=936, h=520, pos="50% 38%",
            fondo="claro liso", texto="ceja arriba, gesto de «no»"),
    3: dict(toma="C", forma="circulo", w=260, h=260, pos="50% 40%",
            fondo="cualquiera (se recorta a círculo)", texto="primer plano, sonrisa leve, mirando a cámara"),
    4: dict(toma="C", forma="circulo", w=260, h=260, pos="50% 40%",
            fondo="cualquiera (se recorta a círculo)", texto="la misma toma C"),
}

CSS = r"""
@font-face{font-family:'OBric';src:url(@@BRIC@@) format('woff2');font-weight:500 700}
@font-face{font-family:'ODM';src:url(@@DM@@) format('woff2');font-weight:400 500}
@font-face{font-family:'OMono';src:url(@@MONO@@) format('woff2');font-weight:400 500}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1920px;overflow:hidden}
.t-negro{--paper:#0A0F0D;--ink:#FFFFFF;--soft:#9FB0A8;--acc:#10C26B;--card:#1C2622}
.t-blanco{--paper:#FFFFFF;--ink:#0A0F0D;--soft:#4F5A55;--acc:#0B8F4F;--mark:#10C26B}
.t-verde{--paper:#10C26B;--ink:#0A0F0D;--soft:#0B3B24;--mark:#FFFFFF}
.lienzo{position:relative;width:1080px;height:1920px;overflow:hidden;background:var(--paper);color:var(--ink);
  font-family:'DM Sans','ODM',sans-serif;padding:270px 72px 0}
.fila-tag{display:flex;justify-content:space-between;align-items:center;height:54px}
.tag{font-family:'DM Mono','OMono',monospace;font-size:34px;font-weight:500;letter-spacing:.08em;line-height:1;
  border:3px solid var(--ink);border-radius:10px;padding:8px 16px}
.handle{font-family:'DM Mono','OMono',monospace;font-size:34px;font-weight:500;letter-spacing:.03em;line-height:1;color:var(--soft)}
.cuerpo{position:absolute;left:72px;right:72px;top:372px;display:flex;flex-direction:column}
.cuerpo.pleno{height:1078px}            /* 372..1450 */
.cuerpo.cta{height:908px}               /* 372..1280 */
.disp{font-family:'OBric','DM Sans',sans-serif;font-weight:700;letter-spacing:-.03em;text-wrap:balance}
.g{color:var(--acc)}
.mk{background:none;box-shadow:inset 0 -.3em 0 var(--mark);color:var(--ink)}
.sigue{position:absolute;right:72px;top:1370px;display:flex;align-items:center;gap:12px;
  font-family:'Caveat',cursive;font-weight:600;font-size:60px;color:var(--soft);line-height:1}
.sigue svg{width:120px;height:40px;fill:none;stroke:currentColor;stroke-width:4;stroke-linecap:round;stroke-linejoin:round}

/* 1 · gancho */
.s1 .h1{font-size:116px;line-height:.98}
.s1 .chat{margin:auto 0}
.s1 .ejemplo{margin:0 0 22px 14px;font-family:'DM Mono','OMono',monospace;font-size:34px;font-weight:500;letter-spacing:.08em;color:var(--soft)}
.s1 .burbuja{display:inline-block;max-width:820px;background:var(--card);color:#fff;border-radius:52px 52px 52px 14px;
  padding:48px 60px;font-size:84px;font-weight:500;line-height:1.08;letter-spacing:-.01em}
.s1 .visto{margin:26px 0 0 14px;font-family:'DM Mono','OMono',monospace;font-size:40px;font-weight:500;letter-spacing:.04em;color:var(--soft)}

/* 2 · mito */
.s2 .lead{font-size:60px;font-weight:600;line-height:1.1;letter-spacing:-.01em}
.s2 .mito{position:relative;display:inline-block;margin-top:34px;padding:30px 44px;border:4px dashed #9AA39E;border-radius:34px;
  font-size:66px;font-weight:500;line-height:1.05;letter-spacing:-.02em;color:#4F5A55;white-space:nowrap}
.s2 .mito:nth-of-type(odd){transform:rotate(-1.4deg)}
.s2 .mito:nth-of-type(even){transform:rotate(1.2deg);margin-left:44px}
.s2 .tacha{position:absolute;left:-10px;top:0;width:calc(100% + 20px);height:100%;overflow:visible}
.s2 .tacha path{fill:none;stroke:#0A0F0D;stroke-width:8;stroke-linecap:round;vector-effect:non-scaling-stroke}
.s2 .grupo{display:flex;flex-direction:column;align-items:flex-start}
.s2 .verdad{margin-top:130px;font-size:148px;line-height:.96}
.s2 .verdad span{display:inline-block;margin-bottom:6px}

/* 3 · revelación */
.s3 .h1{font-size:128px;line-height:.95}
.s3 .sub{margin-top:12px;font-size:48px;font-weight:600;line-height:1.1;color:var(--soft)}
.s3 .titulo{display:flex;justify-content:space-between;align-items:flex-start}
.s3 .lista{margin-top:42px;background:#fff;border:4px solid var(--ink);border-radius:34px;padding:30px 40px;
  box-shadow:12px 12px 0 rgba(10,15,13,.9)}
.s3 .fila{display:flex;align-items:center;gap:26px;padding:15px 0;font-size:52px;font-weight:700;line-height:1.1;letter-spacing:-.01em;color:#0A0F0D}
.s3 .fila + .fila{border-top:3px solid rgba(10,15,13,.12)}
.s3 .fila .n{flex:none;width:64px;font-size:68px;font-weight:700;line-height:1}
.s3 .regla{margin-top:52px;font-size:56px;font-weight:700;line-height:1.12;letter-spacing:-.01em}
.s3 .mk{display:inline-block;line-height:1;padding:0 .06em;margin:0 -.06em;box-shadow:inset 0 -.42em 0 var(--mark)}

/* 4 · CTA */
.s4 .h1{font-size:120px;line-height:.96}
.s4 .tarjeta{margin-top:32px;background:#10C26B;color:#0A0F0D;border-radius:40px;padding:32px 48px 34px}
.s4 .rot{font-family:'DM Mono','OMono',monospace;font-size:34px;font-weight:500;letter-spacing:.08em;line-height:1}
.s4 .fila20{display:flex;align-items:flex-end;justify-content:space-between;margin-top:16px}
.s4 .veinte{font-size:128px;line-height:.9;letter-spacing:-.04em}
.s4 .meet{font-size:42px;font-weight:700;line-height:1.1;text-align:right;padding-bottom:10px}
.s4 .trae{margin-top:18px;padding-top:16px;border-top:4px solid #0A0F0D;font-size:42px;font-weight:600;line-height:1.1}
.s4 .item{display:flex;align-items:center;gap:20px;margin-top:10px;font-size:50px;font-weight:700;line-height:1.1;letter-spacing:-.01em}
.s4 .item svg{flex:none;width:44px;height:44px;fill:none;stroke:#0A0F0D;stroke-width:6;stroke-linecap:round;stroke-linejoin:round}
.s4 .link{margin-top:14px;display:flex;align-items:center;justify-content:center;gap:22px;
  font-family:'Caveat',cursive;font-weight:700;font-size:78px;line-height:1;color:#10C26B}
.s4 .link svg{width:52px;height:80px;fill:none;stroke:#10C26B;stroke-width:7;stroke-linecap:round;stroke-linejoin:round}

/* ventana de foto opcional (solo existe en con-foto/ y en la hoja FOTO-SLOTS) */
.foto-win{position:relative;overflow:hidden;border:4px solid var(--ink);border-radius:36px;flex:none}
.foto-win img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}
.foto-win.circ{border-radius:50%;border-width:8px}
.foto-win.slot{border-style:dashed;display:flex;align-items:center;justify-content:center;text-align:center;
  font-family:'DM Mono','OMono',monospace;font-size:38px;font-weight:500;line-height:1.25;color:var(--soft);
  background:repeating-linear-gradient(45deg,rgba(128,128,128,.10) 0 18px,rgba(128,128,128,.22) 18px 36px)}
.foto-win.slot.circ{font-size:23px;line-height:1.2}
.con-foto.s1 .h1{font-size:96px}
.con-foto.s1 .burbuja{font-size:62px;padding:34px 48px;max-width:760px}
.con-foto.s1 .visto{font-size:36px;margin-top:18px}
.con-foto.s1 .chat{margin:44px 0 0}
.con-foto.s1 .ejemplo{font-size:34px;margin-bottom:16px}
.con-foto .foto-win.franja{margin-top:auto}
.con-foto.s2 .lead{font-size:52px}
.con-foto.s2 .mito{font-size:56px;padding:22px 38px;margin-top:22px}
.con-foto.s2 .verdad{font-size:92px;margin-top:44px}
.con-foto.s3 .h1{font-size:112px}
.con-foto.s4 .tarjeta{margin-top:32px}
"""

ARROW_SIGUE = '<svg viewBox="0 0 90 30"><path d="M3 18 C 25 8, 50 26, 80 14 M68 5 L82 14 L70 24"/></svg>'
CHECK = '<svg viewBox="0 0 44 44"><path d="M7 23 L18 34 L38 10"/></svg>'
FLECHA_ABAJO = '<svg viewBox="0 0 52 80"><path d="M27 4 C 20 24, 32 44, 25 70 M8 52 L25 72 L44 50"/></svg>'


def _tacha(ancho_rel=1.0):
    # garabato a mano que atraviesa el texto de lado a lado (no una línea recta: tiene que parecer tachado a mano)
    return ('<svg class="tacha" viewBox="0 0 600 100" preserveAspectRatio="none">'
            '<path d="M4 62 C 90 38, 170 74, 300 46 S 500 34, 596 54"/></svg>')


def _ventana(i, foto, slot):
    """Ventana de foto de la lámina i. foto = ruta (rellena) · slot = True (hueco señalado) · ninguno = no se dibuja."""
    if not foto and not slot:
        return ""
    s = FOTO_SLOTS[i]
    forma = "circ" if s["forma"] == "circulo" else "franja"
    interior = (f'<img src="{Path(foto).resolve().as_uri()}" style="object-position:{s["pos"]}">' if foto
                else f'FOTO · TOMA {s["toma"]}<br>{s["w"]}×{s["h"]}')
    return (f'<div class="foto-win {forma}{" slot" if not foto else ""}" '
            f'style="width:{s["w"]}px;height:{s["h"]}px">{interior}</div>')


def cuerpo_1(con, v):
    vent = _ventana(1, *v) if con else ""
    sigue = "" if con else f'<div class="sigue" data-rol="secundario">seguí {ARROW_SIGUE}</div>'
    return ('<div class="cuerpo pleno">'
            '<h1 class="h1 disp" data-rol="principal">¿Dónde perdés clientes por <span class="g">responder tarde</span>?</h1>'
            '<div class="chat"><div class="ejemplo" data-rol="secundario">UN CLIENTE TE ESCRIBE</div>'
            '<div class="burbuja" data-rol="principal">Hola, ¿cuánto cuesta?</div>'
            '<div class="visto" data-rol="secundario">visto · sin respuesta</div></div>'
            f'{vent}</div>{sigue}')


def cuerpo_2(con, v):
    vent = _ventana(2, *v) if con else ""
    sigue = "" if con else f'<div class="sigue" data-rol="secundario">seguí {ARROW_SIGUE}</div>'
    return ('<div class="cuerpo pleno"><div class="grupo">'
            '<p class="lead" data-rol="principal">Todos creen que automatizar es:</p>'
            f'<div class="mito disp" data-rol="principal">comprar un sistema enorme{_tacha()}</div>'
            f'<div class="mito disp" data-rol="principal">pagarle a un programador{_tacha()}</div></div>'
            '<h2 class="verdad disp" data-rol="principal">No se empieza <span class="mk">por ahí.</span></h2>'
            f'{vent}</div>{sigue}')


PREGUNTAS = [   # versión corta de las 5 preguntas del checklist (ONIA_COMUNIDAD_CONTENIDO §Vie), mismo orden
    "¿Qué repito más de 3 veces?",
    "¿Qué me interrumpe?",
    "¿Qué se me olvida?",
    "¿Dónde respondo tarde?",
    "¿Qué postergo?",
]


def cuerpo_3(con, v):
    vent = _ventana(3, *v) if con else ""
    filas = "".join(f'<div class="fila"><span class="n" data-rol="principal">{n}</span>'
                    f'<span data-rol="principal">{q}</span></div>' for n, q in enumerate(PREGUNTAS, 1))
    sigue = "" if con else f'<div class="sigue" data-rol="secundario">seguí {ARROW_SIGUE}</div>'
    return ('<div class="cuerpo pleno"><div class="titulo"><div>'
            '<h1 class="h1 disp" data-rol="principal">5 preguntas</h1>'
            '<p class="sub" data-rol="secundario">para elegir qué automatizar primero</p></div>'
            f'{vent}</div>'
            f'<div class="lista">{filas}</div>'
            '<p class="regla" data-rol="principal">La que aparece en <span class="mk">2 o más</span>: esa va primero.</p>'
            f'</div>{sigue}')


def cuerpo_4(con, v):
    vent = _ventana(4, *v) if con else ""
    tit = ('<h1 class="h1 disp" data-rol="principal">Reservá<br><span class="g">la tuya.</span></h1>')
    if con:   # con foto: el sello va a la derecha del titular y el titular queda igual
        tit = f'<div class="titulo" style="display:flex;justify-content:space-between;align-items:flex-start">{tit}{vent}</div>'
    items = "".join(f'<div class="item" data-rol="principal">{CHECK}<span>{t}</span></div>'
                    for t in ("qué automatizar primero", "con qué herramienta", "tu primer paso de esta semana"))
    return ('<div class="cuerpo cta">'
            f'{tit}'
            '<div class="tarjeta"><div class="rot" data-rol="secundario">ASESORÍA DE IA · GRATIS</div>'
            '<div class="fila20"><div class="veinte disp" data-rol="principal">20 min</div>'
            '<div class="meet" data-rol="secundario">videollamada<br>por Google Meet</div></div>'
            '<div class="trae" data-rol="secundario">Traé tus respuestas y salís con:</div>'
            f'{items}</div>'
            f'<div class="link" data-rol="principal"><span>tocá el link</span>{FLECHA_ABAJO}</div>'
            '</div>')


HISTORIAS = [
    dict(tema="t-negro", n=1, cuerpo=cuerpo_1),
    dict(tema="t-blanco", n=2, cuerpo=cuerpo_2),
    dict(tema="t-verde", n=3, cuerpo=cuerpo_3),
    dict(tema="t-negro", n=4, cuerpo=cuerpo_4),
]
FONDO = {"t-negro": (10, 15, 13), "t-blanco": (255, 255, 255), "t-verde": (16, 194, 107)}


def _css():
    f = lambda n: (FUENTES / n).resolve().as_uri()
    return (CSS.replace("@@BRIC@@", f("BricolageGrotesque-var-latin.woff2"))
               .replace("@@DM@@", f("DMSans-var-latin.woff2"))
               .replace("@@MONO@@", f("SplineSansMono-var-latin.woff2")))


def html_historia(h, foto=None, slot=False):
    con = bool(foto or slot)
    i = h["n"]
    cuerpo = h["cuerpo"](con, (foto, slot))
    fila = (f'<div class="fila-tag"><span class="tag" data-rol="secundario">{i:02d}/04</span>'
            '<span class="handle" data-rol="secundario">@sergiourcullo</span></div>')
    return (f"<!doctype html><html lang='es'><head><meta charset='utf-8'><style>{_css()}</style></head><body>"
            f"<div class='lienzo {h['tema']} s{i}{' con-foto' if con else ''}'>{fila}{cuerpo}</div></body></html>")


# ---------- hojas de chequeo ----------

def html_chequeo(pngs):
    """4 teléfonos con la interfaz de IG simulada: bandas tapadas (azul, no rojo: el rojo no existe en esta marca)
    y, en la 4, la zona del sticker de link (ámbar punteada)."""
    k = 300 / W
    alto = round(H * k)
    top, bot = round(SAFE_TOP * k), round(SAFE_BOT * k)
    z0, z1 = round(LIMITE_ABAJO_4 * k), round(LIMITE_ABAJO * k)
    cols = ""
    for n, p in enumerate(pngs, 1):
        zona = (f"<div class='zs' style='top:{z0}px;height:{z1 - z0}px'><b>STICKER DE LINK · libre</b></div>" if n == 4 else "")
        cols += (f"<div class='col'><p class='rot'>historia-{n:02d}</p><div class='mini'><img src='{p.as_uri()}'>"
                 f"<div class='ui arriba' style='height:{top}px'></div><div class='ui abajo' style='height:{bot}px'></div>{zona}"
                 "<div class='barras'><i></i><i></i><i></i><i></i></div>"
                 "<div class='perfil'><div class='av'></div><b>sergiourcullo</b></div><div class='responder'>Enviar mensaje</div></div></div>")
    return f"""<!doctype html><html><head><meta charset='utf-8'><style>
*{{margin:0;padding:0;box-sizing:border-box}} body{{background:#F4F4F2;font-family:'DM Sans',sans-serif}}
.hoja{{display:flex;gap:22px;padding:24px}} .col{{width:300px}}
.rot{{font-family:'DM Mono',monospace;font-size:17px;letter-spacing:.07em;text-transform:uppercase;margin:0 0 9px 2px}}
.mini{{position:relative;width:300px;height:{alto}px;border-radius:11px;overflow:hidden;box-shadow:0 8px 20px rgba(0,0,0,.18)}}
.mini img{{width:100%;height:100%;display:block}}
.ui{{position:absolute;left:0;right:0;background:rgba(30,90,255,.30);border:0 solid rgba(30,90,255,.95)}}
.arriba{{top:0;border-bottom-width:3px}} .abajo{{bottom:0;border-top-width:3px}}
.zs{{position:absolute;left:0;right:0;border:3px dashed #FFB000;background:rgba(255,176,0,.16);display:flex;align-items:center;justify-content:center;color:#FFB000;font-size:12px;letter-spacing:.06em}}
.barras{{position:absolute;top:7px;left:7px;right:7px;display:flex;gap:3px}} .barras i{{flex:1;height:3px;border-radius:2px;background:rgba(255,255,255,.55)}} .barras i:first-child{{background:#fff}}
.perfil{{position:absolute;top:18px;left:8px;display:flex;align-items:center;gap:6px;color:#fff;font-size:11px;font-weight:600;text-shadow:0 0 3px rgba(0,0,0,.6)}}
.perfil .av{{width:19px;height:19px;border-radius:50%;background:#dcdcdc;border:2px solid #fff}}
.responder{{position:absolute;bottom:22px;left:10px;right:10px;height:28px;border:2px solid rgba(255,255,255,.9);border-radius:14px;display:flex;align-items:center;padding-left:13px;color:rgba(255,255,255,.92);font-size:11px}}
</style></head><body><div class='hoja'>{cols}</div></body></html>"""


def html_slots(pngs):
    k = 300 / W
    alto = round(H * k)
    cols = ""
    for n, p in enumerate(pngs, 1):
        s = FOTO_SLOTS[n]
        forma = "franja 936×520 (abajo)" if s["forma"] == "franja" else "sello 260×260 (arriba a la derecha)"
        cols += (f"<div class='col'><p class='rot'>L{n} · toma {s['toma']}</p><img src='{p.as_uri()}'>"
                 f"<p class='n'>{forma}<br>fondo {s['fondo']}<br>{s['texto']}</p></div>")
    return f"""<!doctype html><html><head><meta charset='utf-8'><style>
*{{margin:0;padding:0;box-sizing:border-box}} body{{background:#F4F4F2;font-family:'DM Sans',sans-serif}}
.hoja{{display:flex;gap:22px;padding:24px}} .col{{width:300px}}
.rot{{font-family:'DM Mono',monospace;font-size:17px;letter-spacing:.07em;text-transform:uppercase;margin:0 0 9px 2px}}
img{{width:300px;height:{alto}px;display:block;border-radius:11px;box-shadow:0 8px 20px rgba(0,0,0,.18)}}
.n{{font-size:14px;line-height:1.35;margin-top:10px;color:#333}}
</style></head><body><div class='hoja'>{cols}</div></body></html>"""


def html_telefono(png):
    """Cómo se ve en un 390x844: la historia a pantalla completa en modo «contain» (ancho 390 -> alto 693; barras negras)."""
    return (f"<!doctype html><html><head><meta charset='utf-8'><style>*{{margin:0;padding:0}}"
            f"html,body{{width:390px;height:844px;background:#000;overflow:hidden}}"
            f"img{{display:block;width:100%;height:100%;object-fit:contain}}</style></head><body>"
            f"<img src='{png.resolve().as_uri()}'></body></html>")


# ---------- render con Playwright (un solo proceso de Node) ----------

NODE_JS = r"""
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const jobs = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
  // sin antialias LCD: deja flecos naranjas/azules en el texto chico (medido el 11-oct: 400-1000 px «terracota» falsos)
  const browser = await chromium.launch({ args: ['--disable-lcd-text', '--font-render-hinting=none'] });
  const res = [];
  for (const j of jobs) {
    const ctx = await browser.newContext({ viewport: { width: j.vw, height: j.vh }, deviceScaleFactor: j.dsf || 1 });
    const page = await ctx.newPage();
    await page.goto('file://' + j.html);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(150);
    const r = { out: j.out };
    if (j.measure) {
      r.textos = await page.evaluate(() => {
        const out = [];
        const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        while (w.nextNode()) {
          const t = w.currentNode;
          const txt = t.textContent.replace(/\s+/g, ' ').trim();
          if (!txt) continue;
          const el = t.parentElement;
          const cs = getComputedStyle(el);
          const rol = el.closest('[data-rol]');
          const b = el.getBoundingClientRect();
          out.push({ txt: txt.slice(0, 48), px: parseFloat(cs.fontSize), rol: rol ? rol.dataset.rol : '?',
                     peso: cs.fontWeight, fam: cs.fontFamily.split(',')[0], x0: b.left, x1: b.right, y0: b.top, y1: b.bottom });
        }
        return out;
      });
      const cdp = await ctx.newCDPSession(page);
      await cdp.send('DOM.enable'); await cdp.send('CSS.enable');
      const doc = await cdp.send('DOM.getDocument', { depth: -1 });
      r.fuentes = {};
      for (const sel of ['.h1', '.burbuja', '.tag', '.fila', '.lead', '.veinte', '.sigue', '.link', '.regla', '.verdad']) {
        try {
          const q = await cdp.send('DOM.querySelector', { nodeId: doc.root.nodeId, selector: sel });
          if (!q.nodeId) continue;
          const f = await cdp.send('CSS.getPlatformFontsForNode', { nodeId: q.nodeId });
          r.fuentes[sel] = f.fonts.map(x => x.familyName + (x.isCustomFont ? ' [repo]' : ' [sistema]'));
        } catch (e) {}
      }
    }
    await page.screenshot({ path: j.out, clip: { x: 0, y: 0, width: j.vw, height: j.vh } });
    res.push(r);
    await ctx.close();
  }
  await browser.close();
  fs.writeFileSync(process.argv[3], JSON.stringify(res));
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
"""


def render(jobs, tmp):
    js, jf, rf = tmp / "render.js", tmp / "jobs.json", tmp / "res.json"
    js.write_text(NODE_JS, encoding="utf-8")
    jf.write_text(json.dumps(jobs), encoding="utf-8")
    env = dict(os.environ)
    env["NODE_PATH"] = ":".join(p for p in ("/opt/node-tools/node_modules", env.get("NODE_PATH", "")) if p)
    p = subprocess.run(["node", str(js), str(jf), str(rf)], env=env, capture_output=True, text=True, timeout=300)
    if p.returncode != 0:
        raise SystemExit(f"Falló el render (Node + Playwright): {p.stderr.strip() or p.stdout.strip()}")
    return json.loads(rf.read_text(encoding="utf-8"))


# ---------- verificación por píxeles ----------

def pixeles_rojo_terracota(png):
    """Cuenta píxeles rojos/naranjas/terracota (tono 330°-40°, saturación y brillo apreciables). Esta marca no los usa."""
    import numpy as np
    from PIL import Image
    h, s_, v = (np.asarray(Image.open(png).convert("RGB").convert("HSV")).astype(int)[..., k] for k in range(3))
    return int((((h <= 28) | (h >= 235)) & (s_ >= 90) & (v >= 60)).sum())


def extension_contenido(png, fondo):
    import numpy as np
    from PIL import Image
    a = np.asarray(Image.open(png).convert("RGB")).astype(int)
    m = (np.abs(a - np.array(fondo)).max(axis=2) > 14)
    ys, xs = np.where(m)
    return int(ys.min()), int(ys.max()), int(xs.min()), int(xs.max()), int(m[LIMITE_ABAJO_4:, :].sum()), int(m[:SAFE_TOP + 20, :].sum())


def main():
    global OUT
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--foto", action="append", default=[], metavar="N=RUTA",
                    help="foto opcional de la lámina N (1-4); crea con-foto/historia-0N.png")
    ap.add_argument("--out", default=str(OUT), help="carpeta de salida (por defecto la de la v2)")
    args = ap.parse_args()
    fotos = {}
    for kv in args.foto:
        n, _, ruta = kv.partition("=")
        if not n.isdigit() or int(n) not in FOTO_SLOTS or not Path(ruta).is_file():
            raise SystemExit(f"--foto {kv!r}: usá N=ruta con N entre 1 y 4 y un archivo existente")
        fotos[int(n)] = ruta

    OUT = Path(args.out).resolve()
    OUT.mkdir(parents=True, exist_ok=True)
    for carpeta in ("390",) + (("con-foto",) if fotos else ()):
        (OUT / carpeta).mkdir(exist_ok=True)
    tmp = Path(tempfile.mkdtemp(prefix="historia-venta-v2-"))
    try:
        # 1) las 4 finales (sin foto) + medición de texto + variantes de ventana vacía y con foto
        jobs = []
        for h in HISTORIAS:
            n = h["n"]
            (tmp / f"h{n}.html").write_text(html_historia(h), encoding="utf-8")
            jobs.append(dict(html=str(tmp / f"h{n}.html"), out=str(OUT / f"historia-{n:02d}.png"), vw=W, vh=H, measure=True))
            (tmp / f"s{n}.html").write_text(html_historia(h, slot=True), encoding="utf-8")
            jobs.append(dict(html=str(tmp / f"s{n}.html"), out=str(tmp / f"slot-{n}.png"), vw=W, vh=H))
            if n in fotos:
                (tmp / f"f{n}.html").write_text(html_historia(h, foto=fotos[n]), encoding="utf-8")
                jobs.append(dict(html=str(tmp / f"f{n}.html"), out=str(OUT / "con-foto" / f"historia-{n:02d}.png"), vw=W, vh=H))
        res = render(jobs, tmp)
        medida = {r["out"]: r for r in res if "textos" in r}

        finales = [OUT / f"historia-{h['n']:02d}.png" for h in HISTORIAS]
        # 2) capturas 390x844 @2x + hojas
        jobs = []
        for p in finales:
            (tmp / f"{p.stem}-tel.html").write_text(html_telefono(p), encoding="utf-8")
            jobs.append(dict(html=str(tmp / f"{p.stem}-tel.html"), out=str(OUT / "390" / f"{p.stem}-390.png"), vw=390, vh=844, dsf=2))
        (tmp / "chequeo.html").write_text(html_chequeo(finales), encoding="utf-8")
        jobs.append(dict(html=str(tmp / "chequeo.html"), out=str(OUT / "CHEQUEO-banda-segura.png"), vw=4 * 322 + 26, vh=round(H * 300 / W) + 60))
        slots = [tmp / f"slot-{h['n']}.png" for h in HISTORIAS]
        (tmp / "slots.html").write_text(html_slots(slots), encoding="utf-8")
        jobs.append(dict(html=str(tmp / "slots.html"), out=str(OUT / "FOTO-SLOTS.png"), vw=4 * 322 + 26, vh=round(H * 300 / W) + 170))
        render(jobs, tmp)

        # 3) informe: tamaños a 390 px + banda segura por píxeles
        informe = []
        for h, p in zip(HISTORIAS, finales):
            r = medida[str(p)]
            por_rol = {}
            for t in r["textos"]:
                por_rol.setdefault(t["rol"], []).append(t)
            fila = dict(historia=p.name, fuentes=r["fuentes"])
            fila["titular_px_390"] = round(max(t["px"] for t in por_rol["principal"]) * ESCALA_390, 1)
            for rol, umbral in (("principal", UMBRAL_PRINCIPAL), ("secundario", UMBRAL_SECUNDARIO)):
                if rol in por_rol:
                    m = min(por_rol[rol], key=lambda t: t["px"])
                    fila[rol] = dict(min_px_390=round(m["px"] * ESCALA_390, 1), texto=m["txt"], umbral=umbral,
                                     ok=m["px"] * ESCALA_390 >= umbral)
            fila["sin_rol"] = [t["txt"] for t in por_rol.get("?", [])]
            y0, y1, x0, x1, sucio_abajo, sucio_arriba = extension_contenido(p, FONDO[h["tema"]])
            lim = LIMITE_ABAJO_4 if h["n"] == 4 else LIMITE_ABAJO
            fila["pixeles"] = dict(y_min=y0, y_max=y1, x_min=x0, x_max=x1, limite_abajo=lim,
                                   arriba_ok=y0 >= SAFE_TOP, abajo_ok=y1 <= lim, margen_lateral_ok=(x0 >= 60 and W - 1 - x1 >= 60))
            fila["pixeles"]["rojo_terracota_px"] = pixeles_rojo_terracota(p)
            if h["n"] == 4:
                fila["pixeles"]["pixeles_en_tercio_inferior"] = sucio_abajo
            informe.append(fila)
        (OUT / "medidas-390.json").write_text(json.dumps(informe, ensure_ascii=False, indent=1), encoding="utf-8")
        for f in informe:
            px = f["pixeles"]
            print(f"{f['historia']}: principal min {f['principal']['min_px_390']} px · secundario min {f['secundario']['min_px_390']} px"
                  f" · y {px['y_min']}..{px['y_max']} (límite {px['limite_abajo']}) · x {px['x_min']}..{px['x_max']}"
                  f"{' · sin rol: ' + str(f['sin_rol']) if f['sin_rol'] else ''}")
            print("   fuentes:", {k: v for k, v in f["fuentes"].items() if k in ('.h1', '.tag', '.fila', '.veinte')})
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


if __name__ == "__main__":
    main()
