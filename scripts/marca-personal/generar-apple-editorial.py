#!/usr/bin/env python3
"""CARRUSEL "Mi stack" — patron apple-editorial (9 laminas 1080x1350).

Patron nuevo, decidido por Sergio Urcullo el 2026-09-06: CONVIVE con
statement-3d-minimal y carrusel-pinterest-refs, no los reemplaza. La diferencia dura
es que aca NO hay collage (cinta / sticker / icono flotante): esa capa venia de la
FICHA de Pinterest y es justo lo que separaba las piezas de las referencias que el
sigue senalando. Receta completa y trampas:
  hermes-content/references/ui-patterns/apple-editorial/{FICHA.md,tokens.css}

Implementa 2 de los 5 layouts de la FICHA — los que esta pieza usa:
  D = statement puro (portada y CTA)
  E = ficha de producto (objeto + nombre + descripcion + precio gigante)
A, B y C se implementan cuando una pieza los pida; scaffolding vacio no sirve a nadie.

OBJETOS: squircle app-icon con el LOGO REAL de cada marca (simple-icons, CC0,
vendorizado por build-logos.py) sobre el color oficial. Los glifos dibujados a mano se
veian aproximados y el de WhatsApp salio directamente mal; en una pieza publica eso lee
como falsificacion. Solo se dibujan los tres que no tienen logo publicado: la torre del
homelab, HyperFrames y Hermes.

TIPOGRAFIA: Inter, elegida por Sergio Urcullo mirando el A/B (06-sep). `--tipografia
dmsans` conserva la comparacion. SF Pro no se puede empaquetar: licencia Apple
restringida a desarrollo en sus plataformas.

CIFRAS: en DOLARES por pedido de Sergio Urcullo. Claude Max sale de
ONIA_ESTRATEGIA_DE_EMPRESA.md §8.1 (US$200/mes). El homelab va en $0 porque es una PC
que el ya tenia — no es el VPS alquilado de esa misma tabla, y las specs de la PC no
estan registradas en ningun lado, asi que la lamina no afirma ninguna.
PENDIENTE: el plan de Notion no esta registrado; "$0" asume plan gratis.

CTA: pide respuesta humana a proposito. La cuenta @sergiourcullo tiene `palabras: {}`
en el workflow n8n activo de private-reply (medido 2026-09-04): un "Comenta X" ahi no
entrega nada y no deja registro.

Uso:
  python scripts/marca-personal/generar-apple-editorial.py [--tipografia inter|dmsans]
  python scripts/marca-personal/generar-apple-editorial.py --check   # gate, sin rendir
"""
import argparse
import glob
import os
import re
import subprocess
import tempfile
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
OUT_BASE = REPO / "hermes-content/carousels/out"
HANDLE = "@sergiourcullo"


def _chrome():
    if os.environ.get("CHROME_BIN"):
        return os.environ["CHROME_BIN"]
    cands = [r"C:\Program Files\Google\Chrome\Application\chrome.exe"]
    cands += sorted(glob.glob("/root/.cache/ms-playwright/chromium-*/chrome-linux64/chrome"), reverse=True)
    cands += sorted(glob.glob(os.path.expanduser("~/AppData/Local/ms-playwright/chromium-*/chrome-win/chrome.exe")), reverse=True)
    for c in cands:
        if Path(c).exists():
            return c
    raise SystemExit("No encontre Chrome/Chromium (setea CHROME_BIN)")


# --- Objetos: squircle app-icon con el color de marca real y un glifo simple.
def _squircle(bg, glifo, borde=""):
    b = ""
    if borde:
        b = f'<rect x="2" y="2" width="252" height="252" rx="59" fill="none" stroke="{borde}" stroke-width="2"/>'
    return (f'<svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">'
            f'<rect width="256" height="256" rx="59" fill="{bg}"/>{b}{glifo}</svg>')


LOGOS = REPO / "hermes-content/references/ui-patterns/apple-editorial/logos"
OBJETOS = REPO / "hermes-content/references/ui-patterns/apple-editorial/objetos"


def _marca(slug, color):
    """Logo REAL de simple-icons (viewBox 24x24) escalado y centrado en el squircle.

    Los glifos dibujados a mano se ven aproximados y en una pieza publica leen como
    falsificacion: el de WhatsApp salio mal y Sergio Urcullo lo marco. Las referencias
    usan el icono de aplicacion real de cada herramienta, asi que acá también.
    """
    archivo = LOGOS / f"{slug}.path"
    if not archivo.exists():
        raise SystemExit(f"Falta {archivo}. Corré build-logos.py del patrón.")
    d = archivo.read_text(encoding="utf-8").strip()
    lado = 132              # area optica del glifo dentro de los 256 del squircle
    escala = lado / 24
    off = (256 - lado) / 2
    return (f'<g transform="translate({off} {off}) scale({escala})">'
            f'<path d="{d}" fill="{color}"/></g>')


def _imagen(nombre, alto=196):
    """Logo en mapa de bits dentro del squircle (PNG/JPG), centrado.

    Existe para el logo de Hermes, que es una ilustracion y no un glifo: redibujarla
    "parecida" es exactamente la trampa #9 de la FICHA. Devuelve '' si el archivo no
    esta, y el llamador cae al glifo dibujado — asi el generador nunca se rompe por un
    asset ausente, solo entrega menos.
    """
    for ext in (".png", ".jpg", ".jpeg", ".svg", ".webp"):
        ruta = LOGOS / f"{nombre}{ext}"
        if ruta.exists():
            off = (256 - alto) / 2
            return (f'<image href="{ruta.as_uri()}" x="{off}" y="{off}" '
                    f'width="{alto}" height="{alto}" preserveAspectRatio="xMidYMid meet"/>')
    return ""


def _torre():
    # Torre de escritorio: el homelab es una maquina fisica que Sergio Urcullo ya tenia,
    # no un servidor alquilado. La primera version salio angosta y con dos rayas, y a
    # tamano de miniatura leia como un TELEFONO — visto en la hoja de contacto, no supuesto.
    # Esta es mas ancha, con bahia de lectora arriba y rejilla de ventilacion: la silueta
    # de una PC vieja. El punto verde es el LED de encendido.
    vents = "".join(
        f'<rect x="106" y="{124 + i * 14}" width="44" height="6" rx="3" fill="#1D1D1F"/>'
        for i in range(4)
    )
    return ('<rect x="80" y="44" width="96" height="168" rx="13" fill="#fff"/>'
            # bahia de la lectora de CD
            '<rect x="96" y="62" width="64" height="13" rx="4" fill="#1D1D1F"/>'
            '<rect x="96" y="86" width="64" height="13" rx="4" fill="#1D1D1F"/>'
            + vents +
            '<circle cx="128" cy="192" r="10" fill="#00C661"/>')


ICONOS = {
    # Marcas REALES (simple-icons, CC0) sobre squircle en el color oficial de cada una.
    # Antes eran glifos dibujados a mano: aproximados, y el de WhatsApp directamente mal.
    "claude": _squircle("#D97757", _marca("claude", "#FFFFFF")),
    "whatsapp": _squircle("#25D366", _marca("whatsapp", "#FFFFFF")),
    "n8n": _squircle("#EA4B71", _marca("n8n", "#FFFFFF")),
    # Notion va al reves —blanco con glifo negro y filo— porque asi es su icono real.
    # El filo existe para que no se pierda sobre el fondo #F5F5F7.
    "notion": _squircle("#FFFFFF", _marca("notion", "#0A0A0A"), borde="#D2D2D7"),
    # Onia Platform: el icono de marca YA publicado (brand/v2/onia-icon-rounded.svg), a
    # sangre sobre todo el squircle. Es el UNICO objeto que lleva el verde de Onia — y acá
    # sí corresponde, porque es lo único del stack que construyó Sergio Urcullo.
    "onia": _squircle("#00D26A", _imagen("onia", alto=256)),
    # Sin logo oficial en simple-icons: se dibujan.
    "vps": _squircle("#1D1D1F", _torre()),
    "hyperframes": _squircle(
        "#1D1D1F",
        '<rect x="58" y="72" width="140" height="112" rx="14" fill="none" stroke="#FFFFFF" stroke-width="10"/>'
        '<path d="M112 106 L152 128 L112 150 Z" fill="#FFFFFF"/>',
    ),
    # Hermes usa el logo REAL del proyecto (nous-girl de NousResearch/hermes-agent, MIT).
    # NO lleva el verde de Onia: es codigo de terceros, y vestirlo con nuestra marca
    # sugeriria autoria. Squircle blanco con filo, como Notion — el line art es blanco y
    # negro y sobre blanco lee perfecto. El glifo de nodos queda de respaldo por si falta
    # el archivo, para que el generador no se rompa por un asset ausente.
    "hermes": _squircle(
        "#FFFFFF",
        _imagen("hermes") or (
            '<circle cx="128" cy="128" r="26" fill="#0A0A0A"/>'
            '<circle cx="70" cy="80" r="15" fill="#0A0A0A"/><circle cx="186" cy="80" r="15" fill="#0A0A0A"/>'
            '<circle cx="70" cy="176" r="15" fill="#0A0A0A"/><circle cx="186" cy="176" r="15" fill="#0A0A0A"/>'
            '<path d="M84 90 L112 114 M172 90 L144 114 M84 166 L112 142 M172 166 L144 142"'
            ' stroke="#0A0A0A" stroke-width="10" stroke-linecap="round"/>'
        ),
        borde="#D2D2D7",
    ),
}

# --- Contenido. Las cifras de precio salen de ONIA_ESTRATEGIA_DE_EMPRESA.md §8.1.
LAMINAS = [
    # El remate es "SEIS COSAS" y no "6 HERRAMIENTAS" por una razon medida, no de gusto:
    # 14 caracteres a 126px desbordan los 888px utiles, y en Archivo (wdth 96, mas ancho
    # que Inter) desbordan mas. Es la trampa #2 de la FICHA de carrusel-pinterest-refs.
    # El numero no se pierde: lo lleva el pie. Verificable con `--check`.
    {
        "layout": "D",
        "contexto": "Todo mi negocio corre con",
        "remate": "SIETE COSAS",
        "pie": "y cinco cuestan",
        "pie_hl": "$0",
    },
    {
        "layout": "E",
        "icono": "claude",
        "nombre": "Claude Max",
        "desc": "La capa que piensa. Escribe el código, los textos\ny los sistemas. Es lo único caro, y es para construir:\nno para que el negocio funcione.",
        "precio": "$200/mes",
    },
    {
        "layout": "E",
        "icono": "vps",
        # Sergio Urcullo, 06-sep: "es una pc vieja que tengo". O sea hardware PROPIO, no el
        # KVM alquilado — mi reparo anterior sobre el termino "homelab" no aplicaba a esta
        # lamina. Se cayeron las specs "4 vCPU / 16 GB / 41 contenedores": eran del VPS de
        # ONIA_ESTRATEGIA_DE_EMPRESA.md §8.1, no de esta maquina, y las de la PC no estan
        # registradas en ningun lado. Sin dato verificado no se escribe dato.
        "nombre": "Homelab",
        "desc": "Una PC vieja que ya tenía guardada.\nAhí adentro corre todo lo que viene abajo.",
        "precio": "$0",
        "etiqueta": "Hardware que ya tenía",
    },
    {
        "layout": "E",
        "icono": "n8n",
        "nombre": "n8n",
        "desc": "Las automatizaciones: embudo, seguimientos, avisos.\nCorre en mi servidor, así que no suma un peso.",
        "precio": "$0",
        "etiqueta": "Open source",
    },
    {
        "layout": "E",
        "icono": "whatsapp",
        "nombre": "WhatsApp Business",
        # Antes decia "el transporte de Meta lo paga la cuenta del negocio, no yo": jerga
        # de plataforma que a un dueno de negocio no le dice nada. Ahora nombra lo que el
        # lector hace todos los dias, y el paso concreto — las respuestas rapidas son las
        # mismas del brief lamina-grid-mensajes.json, contenido ya verificado.
        "desc": "Donde me escriben los clientes. Con las respuestas\nrápidas dejé escritos de una vez los seis mensajes\nque antes tipeaba todos los días.",
        "precio": "$0",
    },
    # Notion SALIO: Sergio Urcullo, 06-sep — "gratis, aunque ni lo uso". Una herramienta que
    # no se usa en una pieza cuyo valor entero es que las siete son reales la vuelve mentira.
    # Su .path queda vendorizado por si vuelve en otra pieza.
    # Chatwoot SALIO de la pieza (Sergio Urcullo, 06-sep). No es pudor: es la capa que hace
    # funcionar el chatbot que se vende desde Onia Platform. Las otras cinco herramientas no
    # tienen ese problema —nadie compra Claude en vez de Onia—, pero Chatwoot con "Bs 0" al
    # lado le ensena al lector el camino para saltearse el producto. Era la unica lamina que
    # le daba un motivo para no comprar. El icono queda definido por si vuelve en otra pieza.
    {
        "layout": "E",
        "icono": "hyperframes",
        # Sin etiqueta de autoria a proposito: HyperFrames es `heygen-com/hyperframes`, de
        # terceros. La bajada solo afirma un uso propio, que si es verificable.
        "nombre": "HyperFrames",
        "desc": "Video desde HTML. El teaser de la comunidad\nse renderizó en el servidor en 30 segundos.",
        "precio": "$0",
    },
    # El giro, justo antes del cierre. ⚠️ Corregido el 06-sep: la bajada decia "lo escribi
    # yo" y es FALSO. Hermes es NousResearch/hermes-agent — publico, MIT, Python, 242k
    # estrellas (verificado con `gh repo view`). Lo de Sergio Urcullo es el SOUL.md, la
    # memoria y la config con la que corre en su maquina, que es lo que ahora dice la
    # lamina. Reclamar autoria de un proyecto ajeno en pieza publica es lo peor que podia
    # tener esta pieza.
    {
        "layout": "E",
        "icono": "hermes",
        "nombre": "Hermes",
        "desc": "Un agente open source que vive en mi servidor.\nYo le escribí el alma: su identidad, su memoria\ny a quién avisar cuando algo se rompe.",
        "precio": "$0",
        "etiqueta": "Open source · MIT",
    },
    # El cierre del arco: lo unico del stack que no instalo, sino que construyo. Va ultima
    # a proposito — es la carta mas fuerte y la unica que lleva el verde de Onia.
    #
    # ⚠️ "Próximamente" es una EXCEPCION EXPLICITA a CLAUDE.md § "La venta nunca exhibe obra",
    # que prohibe esa palabra exacta en toda superficie que ve un cliente. Se le planteo el
    # choque a Sergio Urcullo con la regla citada, se ofrecio "Te cuento pronto" como
    # alternativa, y el 2026-09-06 el RATIFICO la palabra literal: "ponela literal,
    # próximamente". Es su decision y su marca.
    # NO revertir esto por leer la regla: la regla sigue vigente para todo lo demas, y esta
    # excepcion vale SOLO para esta lamina. Detalle en la trampa #14 de la FICHA.
    #
    # Promesas: agenda y clientes son 🟢 en ONIA_CATALOGO_DE_VENTA.md; el chatbot es 🟢 en
    # su §5. Sin precio de producto: es contenido, no venta.
    {
        "layout": "E",
        "icono": "onia",
        "nombre": "Onia Platform",
        "desc": "Donde manejo el negocio: los clientes, la agenda\ny el chatbot que contesta cuando no estoy.\nEs la única que no instalé. La construí.",
        "precio": "Próximamente",
        "etiqueta": "Lo que estoy construyendo",
    },
    {
        "layout": "D",
        "contexto": "Siete herramientas, una factura",
        "remate": "$200",
        "sub": "al mes, y es todo para construir.\nMantener el negocio andando no me cuesta nada.",
        # El CTA reusa el mismo highlight verde de la portada en vez de un boton de ancho
        # completo: el boton leia como banner web y partia la frase en dos lineas — nada
        # asi aparece en las 8 referencias. Verde en dos puntos de ocho laminas.
        "cta_hl": "¿Cuál te falta a vos?",
        "cta_gris": "Contame en los comentarios.",
    },
]

# --- Fuentes: autohospedadas, NUNCA de Google Fonts en tiempo de render ------------
# Regla de la casa, ya escrita en hermes-content/brand/fonts/README.md y que este carril
# venia incumpliendo: con `@import url(fonts.googleapis.com)` Chrome dispara la captura
# antes de que llegue la webfont y todo cae al fallback del sistema. Medido el
# 2026-09-06: las dos variantes tipograficas salieron byte-identicas (mismo md5).
# Con file:// la carga es sincronica y la carrera desaparece. `--check` lo verifica.
FONTS_PATRON = REPO / "hermes-content/references/ui-patterns/apple-editorial/fonts"
FONTS_MARCA = REPO / "hermes-content/brand/fonts"
MONO_WOFF2 = FONTS_MARCA / "SplineSansMono-var-latin.woff2"
# Serif del layout C. No es del trio de marca: es tipografia de UN patron.
SERIF_WOFF2 = FONTS_PATRON / "InstrumentSerif-latin.woff2"

# Layout F — portada con foto recortada (referencia bastian.xu, la #8 del batch).
# La foto sale de recortar-foto.py: croma local, sin generacion ni creditos.
PORTADA_F = [
    {
        "layout": "F",
        "nombre": "Soy Sergio Urcullo,",
        # Dos lineas exactas. La version larga dejaba "bolivianos" huerfano en una tercera
        # linea: el salto manual no controla el wrap, lo controla el largo del texto.
        "sub": "y automatizo negocios bolivianos\npara que dejen de hacer todo a mano.",
        "foto": "sergio-chroma.png",
    },
]

# Layout C — duelo 2-up (referencia #3). Contenido del brief ya aprobado
# `briefs/onia-cuaderno-no-avisa-foto-20260820.json`: "Tu cuaderno no miente. Pero
# tampoco avisa". Los dos remates son propiedades, no mediciones: un cuaderno de papel
# no puede avisar (0), y los agentes del sistema corren una vez al dia segun
# ONIA_CATALOGO_DE_VENTA.md. Nada inventado, nada que haya que sostener despues.
DUELO_CUADERNO = [
    {
        "layout": "C",
        "titulo": "Tu cuaderno no miente.\nPero tampoco avisa.",
        "lados": [
            # Los dos remates tienen la MISMA forma (cantidad + unidad), como el
            # "310 cal / 0 cal" de la referencia. Con "0" de un lado y "todos los días"
            # del otro, la comparacion no cierra: no se estan midiendo con la misma vara.
            # "1 por dia" sale de ONIA_CATALOGO_DE_VENTA.md — los agentes corren una vez
            # al dia. Ninguno de los dos numeros es una estimacion.
            {"objeto": "cuaderno.png", "dato": "0 avisos", "etiqueta": "el cuaderno"},
            {"objeto": "celular.png", "dato": "1 por día", "etiqueta": "el sistema"},
        ],
    },
]

PIEZAS = {"mi-stack": None, "portada-f": PORTADA_F, "duelo-cuaderno": DUELO_CUADERNO}  # mi-stack se resuelve a LAMINAS abajo

FUENTES = {
    # Maxima fidelidad con las referencias que mando Sergio Urcullo. Vendorizada aca,
    # no adoptada como fuente de marca: esa decision no la toma un generador.
    "inter": ("Inter", FONTS_PATRON / "Inter-var-latin.woff2", "700", "normal"),
    # Del trio declarado en ONIA_BRAND_IDENTITY_2026.md §2. Geometrica y de bajo
    # contraste: es la opcion legal-de-marca mas parecida a SF Pro que ya esta vendorizada.
    "dmsans": ("DM Sans", FONTS_MARCA / "DMSans-var-latin.woff2", "500", "normal"),
}


def css(tipo):
    nombre, woff2, peso, vf = FUENTES[tipo]
    for ruta in (woff2, MONO_WOFF2, SERIF_WOFF2):
        if not ruta.exists():
            raise SystemExit(f"Falta la fuente {ruta}. Corré build-inter.py del patrón.")
    return f"""@font-face{{font-family:'{nombre}';src:url('{woff2.as_uri()}') format('woff2');
  font-weight:100 900;font-display:block}}
@font-face{{font-family:'OniaMono';src:url('{MONO_WOFF2.as_uri()}') format('woff2');
  font-weight:400 500;font-display:block}}
@font-face{{font-family:'OniaSerif';src:url('{SERIF_WOFF2.as_uri()}') format('woff2');
  font-weight:400;font-display:block}}
*{{margin:0;padding:0;box-sizing:border-box}}
:root{{--bg:#F5F5F7;--ink:#1D1D1F;--muted:#6E6E73;--verde:#00C661;--crema:#F5F1E8}}
html,body{{width:1080px;height:1350px}}
body{{background:var(--bg);font-family:'{nombre}',sans-serif;font-weight:400;overflow:hidden;
  -webkit-font-smoothing:antialiased}}
/* padding-bottom extra: el handle va absolute y no ocupa flujo, asi que sin esto el
   bloque queda visualmente bajo y el tercio inferior muerto. Las refs apoyan el bloque
   apenas por encima del centro optico. */
.lienzo{{width:1080px;height:1350px;padding:96px 96px 190px;display:flex;
  flex-direction:column;align-items:center;justify-content:center;position:relative;
  text-align:center}}
.display{{font-weight:{peso};font-variation-settings:{vf};letter-spacing:-.032em;
  line-height:.98;color:var(--ink)}}
.contexto{{font-size:46px;font-weight:400;color:var(--muted);line-height:1.25;
  letter-spacing:-.01em}}
.remate{{font-size:126px;margin-top:22px}}
.pie{{font-size:44px;color:var(--muted);margin-top:40px;letter-spacing:-.01em}}
.hl{{background:var(--verde);color:var(--ink);border-radius:10px;padding:2px 16px 8px;
  font-weight:{peso};white-space:nowrap;-webkit-box-decoration-break:clone}}
.obj{{width:260px;height:260px;filter:drop-shadow(0 24px 48px rgba(0,0,0,.14))}}
.nombre{{font-size:96px;margin-top:52px}}
.desc{{font-size:33px;color:var(--muted);line-height:1.42;margin-top:22px;
  white-space:pre-line;letter-spacing:-.005em;max-width:800px}}
/* Un solo tamano para todo el precio, unidad incluida: es como lo muestran las refs
   5/6/7 ("$20/mes"). Con la unidad en otro cuerpo quedaba pegada y desalineada. */
.precio{{font-size:92px;margin-top:58px}}
/* Cuando el slot no lleva cifra sino una frase, 92px la vuelve un titular que compite con
   el nombre. Baja a 60px y sigue siendo el segundo foco. */
.precio.texto{{font-size:60px}}
/* Etiqueta de procedencia (open source / plan gratis). Mismo tratamiento que el handle
   —mono, mayuscula, gris— para que lea como dato tecnico y no compita con el precio. */
.etiqueta{{font-family:'OniaMono',monospace;font-size:25px;font-weight:500;
  letter-spacing:.08em;text-transform:uppercase;color:#A1A1A6;margin-top:24px}}
.sub{{font-size:38px;color:var(--muted);line-height:1.4;margin-top:30px;
  white-space:pre-line;letter-spacing:-.01em}}
/* chip en su propia linea: en linea con el texto gris la frase se partia en dos y el
   chip quedaba descentrado contra una segunda linea centrada. */
.cta{{margin-top:70px;font-size:40px;color:var(--muted);letter-spacing:-.01em}}
.cta .hl{{display:inline-block;margin-bottom:22px}}
.cta-gris{{display:block}}
/* layout C — duelo 2-up (referencia #3 del batch: chocolate vs reloj, "310 cal / 0 cal").
   Fondo crema y titulo SERIF: el aire editorial de esa referencia sale de esas dos cosas
   juntas, no de una. Con el gris y la sans queda otra lamina mas del carrusel. */
.lienzo.c{{background:var(--crema);justify-content:center;padding-top:120px}}
.titulo-c{{font-family:'OniaSerif',Georgia,serif;font-size:82px;line-height:1.08;
  color:var(--ink);white-space:pre-line;letter-spacing:-.01em}}
.duelo{{display:flex;gap:70px;align-items:flex-end;justify-content:center;
  margin-top:110px;width:100%}}
.lado{{flex:1;display:flex;flex-direction:column;align-items:center;gap:44px}}
/* Altura FIJA de caja para los dos objetos: es la unica forma de que dos fotos de
   proporciones distintas lean con la misma presencia. Sin esto, el mas ancho domina. */
.lado img{{height:380px;width:100%;object-fit:contain;object-position:bottom;
  filter:drop-shadow(0 24px 48px rgba(0,0,0,.14))}}
.dato{{font-size:64px;font-weight:{peso};font-variation-settings:{vf};
  letter-spacing:-.03em;color:var(--ink);line-height:1}}
.dato .chico{{display:block;font-family:'OniaMono',monospace;font-size:23px;font-weight:500;
  letter-spacing:.08em;text-transform:uppercase;color:#A1A1A6;margin-top:18px}}
/* layout F — portada con foto recortada (referencia bastian.xu). El texto va arriba y
   alineado a la IZQUIERDA, no centrado: en la referencia el bloque de nombre ancla la
   esquina y la foto entra por abajo a sangre. Centrarlo lo vuelve una placa cualquiera. */
.lienzo.f{{justify-content:flex-start;text-align:left;align-items:stretch;padding:120px 96px 0}}
.f .nombre-f{{font-size:92px;line-height:1.0}}
.f .sub-f{{font-size:44px;color:var(--muted);line-height:1.22;margin-top:18px;
  letter-spacing:-.01em;max-width:820px;white-space:pre-line}}
/* La foto sale del flujo y se apoya en el borde inferior: a sangre, como la referencia. */
.f .foto{{position:absolute;left:50%;transform:translateX(-50%);bottom:0;
  max-height:72%;width:auto;object-fit:contain;object-position:bottom}}
/* El handle centrado caia ENCIMA del polo azul marino y no se leia. En F va al margen
   derecho, sobre el gris del fondo, que es donde queda aire. */
.f .handle{{right:96px;left:auto;text-align:right;bottom:52px}}
.handle{{position:absolute;bottom:76px;left:0;right:0;font-family:'OniaMono',monospace;
  font-size:23px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;
  color:#A1A1A6}}"""


def markup(lamina):
    if lamina["layout"] == "C":
        lados = []
        for lado in lamina["lados"]:
            obj = OBJETOS / lado["objeto"]
            if not obj.exists():
                raise SystemExit(f"Falta el objeto {obj}. Corré buscar-objetos.py.")
            chico = f'<span class="chico">{lado["etiqueta"]}</span>' if lado.get("etiqueta") else ""
            lados.append(f'<div class="lado"><img src="{obj.as_uri()}">'
                         f'<div class="dato">{lado["dato"]}{chico}</div></div>')
        return (f'<div class="titulo-c">{lamina["titulo"]}</div>'
                f'<div class="duelo">{"".join(lados)}</div>')
    if lamina["layout"] == "F":
        foto = LOGOS / lamina["foto"]
        if not foto.exists():
            raise SystemExit(f"Falta la foto recortada {foto}. Corré recortar-foto.py.")
        return (f'<div class="display nombre-f">{lamina["nombre"]}</div>'
                f'<div class="sub-f">{lamina["sub"]}</div>'
                f'<img class="foto" src="{foto.as_uri()}">')
    if lamina["layout"] == "D":
        cuerpo = (f'<div class="contexto">{lamina["contexto"]}</div>'
                  f'<div class="display remate">{lamina["remate"]}</div>')
        if lamina.get("pie"):
            cuerpo += f'<div class="pie">{lamina["pie"]} <span class="hl">{lamina["pie_hl"]}</span></div>'
        if lamina.get("sub"):
            cuerpo += f'<div class="sub">{lamina["sub"]}</div>'
        if lamina.get("cta_hl"):
            cuerpo += (f'<div class="cta"><span class="hl">{lamina["cta_hl"]}</span>'
                       f'<span class="cta-gris">{lamina["cta_gris"]}</span></div>')
        return cuerpo
    etiqueta = (f'<div class="etiqueta">{lamina["etiqueta"]}</div>'
                if lamina.get("etiqueta") else "")
    return (f'<div class="obj">{ICONOS[lamina["icono"]]}</div>'
            f'<div class="display nombre">{lamina["nombre"]}</div>'
            f'<div class="desc">{lamina["desc"]}</div>'
            f'<div class="display precio{"" if lamina["precio"].startswith("$") else " texto"}">'
            f'{lamina["precio"]}</div>{etiqueta}')


def render(tipo, out_dir, laminas=None):
    out_dir.mkdir(parents=True, exist_ok=True)
    chrome = _chrome()
    hoja = css(tipo)
    for i, lamina in enumerate(laminas or LAMINAS, 1):
        html = (f"<!doctype html><html><head><meta charset='utf-8'><style>{hoja}</style></head>"
                f"<body><div class='lienzo{" " + lamina["layout"].lower() if lamina["layout"] in ("C", "F") else ""}'>{markup(lamina)}"
                f"<div class='handle'>{HANDLE}</div></div></body></html>")
        with tempfile.NamedTemporaryFile("w", suffix=".html", delete=False, encoding="utf-8") as fh:
            fh.write(html)
            tmp = fh.name
        dest = out_dir / f"lamina-{i:02d}.png"
        subprocess.run(
            [chrome, "--headless", "--disable-gpu", "--no-sandbox", "--hide-scrollbars",
             "--force-device-scale-factor=1", "--window-size=1080,1350",
             f"--screenshot={dest}", Path(tmp).as_uri()],
            check=True, capture_output=True, timeout=90,
        )
        os.unlink(tmp)
        if not dest.exists() or dest.stat().st_size == 0:
            raise SystemExit(f"PNG vacio o ausente: {dest}")
        print(f"  {dest.name}  {dest.stat().st_size // 1024} KB")


# --- Gate de desborde -------------------------------------------------------------
# El texto que se sale del margen es la trampa que ya mordio dos veces en este repo
# (trampa #2 de la FICHA de carrusel-pinterest-refs, y de nuevo en la primera corrida
# de este generador con "6 HERRAMIENTAS"). No se ve en el peso del PNG y en miniatura
# apenas se nota, asi que se mide: ancho real entintado vs ancho util del lienzo.
UTIL = 1080 - 96 * 2

def sonda_js(nombre):
    return """
<script>
window.addEventListener('load', function(){
  document.fonts.ready.then(function(){
    // FUENTE: la asercion que impide que vuelva el fallback silencioso. Si la familia
    // no cargo, el render sale con la del sistema y NADA lo delata: mismo peso de PNG,
    // misma composicion, tipografia equivocada. Paso en la primera corrida de este
    // generador y solo se descubrio comparando md5 entre las dos variantes.
    var ok = document.fonts.check('700 126px "__FAM__"') ? 1 : 0;
    function ancho(el){
      var r = document.createRange(); r.selectNodeContents(el);
      var rects = Array.prototype.slice.call(r.getClientRects());
      return rects.length ? Math.max.apply(null, rects.map(function(x){return x.width})) : 0;
    }
    var out = ['FUENTE|' + ok];
    document.querySelectorAll('.remate,.nombre,.precio,.desc,.contexto,.pie,.sub,.cta,.etiqueta,.nombre-f,.sub-f,.titulo-c,.dato')
      .forEach(function(el){
        out.push('SONDA|' + el.className.replace(/display /,'') + '|' + Math.round(ancho(el)));
      });
    var d = document.createElement('div'); d.id = 'sonda'; d.textContent = out.join(' ');
    document.body.appendChild(d);
  });
});
</script>
""".replace("__FAM__", nombre)


def check(tipo, laminas=None):
    """Rinde cada lamina midiendo, y falla si algun texto pasa el ancho util."""
    chrome = _chrome()
    hoja = css(tipo)
    sonda = sonda_js(FUENTES[tipo][0])
    fallos = []
    for i, lamina in enumerate(laminas or LAMINAS, 1):
        html = (f"<!doctype html><html><head><meta charset='utf-8'><style>{hoja}</style>"
                f"{sonda}</head><body><div class='lienzo{" " + lamina["layout"].lower() if lamina["layout"] in ("C", "F") else ""}'>{markup(lamina)}"
                f"<div class='handle'>{HANDLE}</div></div></body></html>")
        with tempfile.NamedTemporaryFile("w", suffix=".html", delete=False, encoding="utf-8") as fh:
            fh.write(html)
            tmp = fh.name
        res = subprocess.run(
            [chrome, "--headless", "--disable-gpu", "--no-sandbox", "--dump-dom",
             "--virtual-time-budget=4000", "--window-size=1080,1350", Path(tmp).as_uri()],
            capture_output=True, text=True, encoding="utf-8", errors="replace", timeout=90,
        )
        os.unlink(tmp)
        # regex y no split(): la ultima medida viene pegada al HTML de cierre del dump
        cargada = re.search(r"FUENTE\|(\d)", res.stdout)
        if not cargada or cargada.group(1) != "1":
            fallos.append(f"lamina {i:02d} · la fuente '{FUENTES[tipo][0]}' NO cargo "
                          f"(el render saldria con la del sistema, sin avisar)")
        medidas = re.findall(r"SONDA\|([\w.-]+)\|(\d+)", res.stdout)
        if not medidas:
            fallos.append(f"lamina {i:02d}: la sonda no devolvio medidas")
            continue
        for clase, px in medidas:
            if int(px) > UTIL:
                fallos.append(f"lamina {i:02d} · .{clase} mide {px}px > {UTIL}px utiles")
    return fallos


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--tipografia", choices=list(FUENTES), default="inter")
    ap.add_argument("--pieza", choices=list(PIEZAS), default="mi-stack")
    ap.add_argument("--out", default=None)
    ap.add_argument("--check", action="store_true",
                    help="solo mide desborde de texto, no rinde PNG")
    args = ap.parse_args()
    laminas = PIEZAS[args.pieza] or LAMINAS

    if args.check:
        print(f"gate de desborde · {args.pieza} · tipografia={args.tipografia} · util={UTIL}px")
        fallos = check(args.tipografia, laminas)
        for f in fallos:
            print(f"  DESBORDA  {f}")
        if fallos:
            raise SystemExit(f"{len(fallos)} desborde(s)")
        print(f"  OK · {len(laminas)} laminas dentro del margen")
        return

    destino = Path(args.out) if args.out else OUT_BASE / f"apple-{args.pieza}-{args.tipografia}"
    print(f"apple-editorial · {args.pieza} · tipografia={args.tipografia} · {len(laminas)} laminas")
    render(args.tipografia, destino, laminas)
    print(f"OK -> {destino}")


if __name__ == "__main__":
    main()
