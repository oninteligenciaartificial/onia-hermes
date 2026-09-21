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
# ⚠️ El handle NO es global: hay piezas que van en la cuenta de la empresa. Rendir una
# pieza de Onia firmada @sergiourcullo la publica en la cuenta equivocada, y eso no lo
# atrapa ningun gate — se ve recien cuando ya esta arriba.
HANDLES = {"onia-cuatro": "@oniahq"}
_handle_actual = HANDLE


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
_SQ = 0  # contador para ids de clipPath unicos: dos <clipPath> con el mismo id en la
         # misma pagina y el navegador aplica solo el primero a todos.


def _squircle(bg, glifo, borde=""):
    """El contenido va RECORTADO al cuadrado redondeado.

    Sin el clip, un logo a sangre que trae sus propias esquinas (el PNG oficial de Claude
    las tiene casi rectas) entra como cuadrado duro y rompe el patron: todo lo demas es
    redondeado. Se ve al instante y no lo atrapa ningun gate.
    """
    global _SQ
    _SQ += 1
    cid = f"sq{_SQ}"
    b = ""
    if borde:
        b = f'<rect x="2" y="2" width="252" height="252" rx="59" fill="none" stroke="{borde}" stroke-width="2"/>'
    return (f'<svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">'
            f'<defs><clipPath id="{cid}">'
            f'<rect width="256" height="256" rx="59"/></clipPath></defs>'
            f'<g clip-path="url(#{cid})">'
            f'<rect width="256" height="256" fill="{bg}"/>{glifo}</g>{b}</svg>')


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


def _tarjeta_clientes():
    """Panel de analitica con textura de producto real (pedido de Sergio Urcullo, 06-sep:
    "hacelo mas real estilo startup").

    🔴 LAS DOS CIFRAS SON INVENTADAS. El pidio "numeros falsos pero realistas" y se le
    marco el choque con la regla de la casa (`no fabricar`: cero clientes pagando ⇒
    prohibido inventar cifras). Se eligieron a proposito CHICAS —12 y +3— para que
    lean como arranque y no como alarde: una cifra grande seria a la vez mas falsa y
    mas cara de sostener si alguien pregunta.
    Si el prefiere sacarlas, el grafico funciona igual sin ningun numero.
    """
    return (
        '<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">'
        '<rect x="10" y="34" width="280" height="232" rx="20" fill="#FFFFFF" '
        'stroke="#E8E8ED" stroke-width="2"/>'
        '<text x="34" y="76" font-family="OniaMono,monospace" font-size="15" '
        'letter-spacing="1.6" fill="#8E8E93">CLIENTES ACTIVOS</text>'
        '<text x="33" y="132" font-family="Inter,sans-serif" font-size="58" '
        'font-weight="700" letter-spacing="-2" fill="#1D1D1F">12</text>'
        '<rect x="112" y="102" width="86" height="32" rx="16" fill="#E4F9EE"/>'
        '<text x="127" y="124" font-family="Inter,sans-serif" font-size="19" '
        'font-weight="700" fill="#0B8F4F">+3 mes</text>'
        '<polyline points="34,236 82,222 122,214 166,182 212,162 266,152" fill="none" '
        'stroke="#00C661" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>'
        '<circle cx="266" cy="152" r="9" fill="#00C661"/></svg>')


def _tarjeta_transferencia():
    """Celda "Transferencia" de la fila 3 de founders-bo, como squircle de app bancaria.

    ⚠️ SE INTENTO CON FOTO Y NO HAY. Sergio Urcullo, 07-sep: "las imagenes puedes usar
    simplemente pngs, mejor" — y tenia razon en que la version anterior (un comprobante
    dibujado con un tilde verde) se veia floja al lado de las ocho celdas restantes.
    Se buscaron tres fotos en Pexels y las tres fallaron, y el motivo es de fondo:
    **una transferencia bancaria no tiene objeto fisico que fotografiar**.
      · "mobile banking app phone hand" -> una mano con GOOGLE WALLET. Marca ajena que la
        pieza no nombra, y que ni siquiera opera en Bolivia: un error factual visual.
      · "smartphone isolated white background" -> un celular con la pantalla en blanco.
        No comunica nada.
      · "credit card isolated" -> monedas de EURO sobre tarjetas, sin recortar.
    Quedan guardadas como transferencia*.png con su credito en CREDITOS.md; ninguna se usa.

    Asi que la celda pasa a SQUIRCLE, que ademas es mas coherente: en su misma fila USDT ya
    es squircle, y en la fila de arriba lo son Claude, ChatGPT y Gemini. Cuatro de las nueve
    celdas ya eran squircle — la que desentonaba era esta.

    El verde tambien se fue: el tilde anterior usaba el #00C661 de Onia en una celda que
    representa la banca en general. El verde es de la casa y aca no pinta nada.
    """
    flecha = ('<path d="M92 104 H164 M146 86 L164 104 L146 122" stroke="#FFFFFF" '
              'stroke-width="13" fill="none" stroke-linecap="round" '
              'stroke-linejoin="round"/>'
              '<path d="M164 152 H92 M110 134 L92 152 L110 170" stroke="#FFFFFF" '
              'stroke-width="13" fill="none" stroke-linecap="round" '
              'stroke-linejoin="round"/>')
    return _squircle("#1F6FEB", flecha)


def _tarjeta_creditos():
    """Panel de uso de CLAUDE, en los colores de Claude.

    Sergio Urcullo, 06-sep: los tokens tienen que verse como de Claude. Antes esta celda
    mostraba el saldo de Higgsfield sobre un panel oscuro y neutro: no se leia de quien
    era. Ahora va sobre la crema oficial #F3E9D7, con el coral #D97757 en la barra y en
    el boton, y el estallido de la marca arriba a la izquierda. La celda dice "Claude"
    sin escribir la palabra.

    La cifra `$0,25 / 1M` es el precio publico de lectura de cache de Fable 5.1
    (anthropic.com, leido el 2026-09-06) — real, y la misma que sostiene el otro carrusel.
    """
    return (
        '<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">'
        '<rect x="10" y="34" width="280" height="232" rx="20" fill="#F3E9D7"/>'
        # estallido chico de la marca, en coral
        '<g transform="translate(30 52) scale(0.105)">'
        '<circle cx="128" cy="128" r="30" fill="#D97757"/>'
        + "".join(
            f'<rect x="{128 - 11}" y="{128 - 92}" width="22" height="76" rx="11" '
            f'fill="#D97757" transform="rotate({i * 30} 128 128)"/>' for i in range(12))
        + '</g>'
        '<text x="66" y="74" font-family="OniaMono,monospace" font-size="15" '
        'letter-spacing="1.6" fill="#8A7B63">TOKENS DE CLAUDE</text>'
        '<text x="33" y="140" font-family="Inter,sans-serif" font-size="52" '
        'font-weight="700" letter-spacing="-2" fill="#3A2E1E">$0,25</text>'
        '<text x="34" y="172" font-family="Inter,sans-serif" font-size="19" '
        'fill="#8A7B63">por millón · lectura de caché</text>'
        '<rect x="34" y="192" width="232" height="9" rx="5" fill="#E0D2B8"/>'
        '<rect x="34" y="192" width="58" height="9" rx="5" fill="#D97757"/>'
        '<rect x="34" y="220" width="110" height="38" rx="11" fill="#D97757"/>'
        '<rect x="156" y="220" width="110" height="38" rx="11" fill="#E4D8C0"/></svg>')


ICONOS = {
    # Marcas REALES (simple-icons, CC0) sobre squircle en el color oficial de cada una.
    # Antes eran glifos dibujados a mano: aproximados, y el de WhatsApp directamente mal.
    # ⚠️ Icono OFICIAL bajado de claude.ai/images/claude_app_icon.png, no el de
    # simple-icons. Sergio Urcullo marco el 06-sep que "el logo de claude no es el
    # original" y tenia razon: yo lo tenia INVERTIDO — cuadrado naranja con estallido
    # blanco. El real es al reves, estallido coral #D97757 sobre crema #F3E9D7, y la
    # entrada de simple-icons ademas dibuja el estallido mucho mas tosco.
    # Leccion: "logo real" no es lo mismo que "logo de una libreria de logos".
    # Fondo BLANCO por pedido de Sergio Urcullo (06-sep). El PNG oficial trae la crema
    # #F3E9D7 horneada; `claude-oficial-blanco.png` la reemplaza por blanco midiendo
    # distancia de color, para no dejarle halo a los bordes suavizados del estallido.
    # El trazo sigue siendo el coral oficial: cambia el fondo, no la marca.
    "claude": _squircle("#FFFFFF", _imagen("claude-oficial-blanco", alto=256),
                        borde="#E8E8ED"),
    "whatsapp": _squircle("#25D366", _marca("whatsapp", "#FFFFFF")),
    "n8n": _squircle("#EA4B71", _marca("n8n", "#FFFFFF")),
    # Notion va al reves —blanco con glifo negro y filo— porque asi es su icono real.
    # El filo existe para que no se pierda sobre el fondo #F5F5F7.
    "notion": _squircle("#FFFFFF", _marca("notion", "#0A0A0A"), borde="#D2D2D7"),
    # Onia Platform: el icono de marca YA publicado (brand/v2/onia-icon-rounded.svg), a
    # sangre sobre todo el squircle. Es el UNICO objeto que lleva el verde de Onia — y acá
    # sí corresponde, porque es lo único del stack que construyó Sergio Urcullo.
    "onia": _squircle("#00D26A", _imagen("onia", alto=256)),
    # ⚠️ Los otros dos de la fila 1, corregidos el 06-sep — Sergio Urcullo: "los logos
    # siguen siendo fake". Tenia razon en los dos, por motivos distintos:
    #   · ChatGPT: el NUDO de simple-icons si es la marca real; lo falso era MI color.
    #     Lo habia puesto en verde copiando la referencia #1, que muestra el icono VIEJO.
    #     El actual es negro con el nudo en blanco.
    #   · Gemini: simple-icons lo da como destello PLANO. El real tiene el degradado
    #     aurora (azul → violeta → rosa) y sin eso no se reconoce. Va el SVG oficial
    #     bajado de gemini.google.com, a sangre.
    # La regla que deja esto: para una marca conocida, el asset oficial del producto
    # gana siempre; una libreria de iconos sirve para la FORMA, nunca para el color.
    "chatgpt": _squircle("#0A0A0A", _marca("chatgpt", "#FFFFFF")),
    # GitHub: el mark oficial (octocat) en su uso canonico — blanco sobre negro.
    # La forma de la libreria ES la marca real; el color se verifico contra github.com.
    "github": _squircle("#0A0A0A", _marca("github", "#FFFFFF")),
    "gemini": _squircle("#FFFFFF", _imagen("gemini-oficial", alto=150), borde="#E8E8ED"),
    "usdt": _squircle("#26A17B", _marca("usdt", "#FFFFFF")),
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

DIBUJOS = {"clientes": _tarjeta_clientes, "creditos": _tarjeta_creditos,
           "transferencia": _tarjeta_transferencia}

# --- Contenido. Las cifras de precio salen de ONIA_ESTRATEGIA_DE_EMPRESA.md §8.1.
LAMINAS = [
    # PORTADA. Rehecha el 06-sep: Sergio Urcullo pidió que la primera imagen sea más
    # impresionante para que la gente entre al carrusel. La anterior contaba una lista
    # ("SIETE COSAS") y contar no frena a nadie.
    # Ahora frena la CIFRA — $200 al mes para operar una empresa entera es lo raro — y
    # abajo va la tira con los 7 iconos: el ojo los cuenta, quiere saber cuál es cuál, y
    # ése es exactamente el swipe. La portada pasa de enunciar a prometer.
    {
        "layout": "D",
        "contexto": "Tengo 16 años, una empresa en Bolivia,\ny esto es todo lo que pago:",
        "remate": "$200",
        "pie": "al mes. Y cinco de las siete cuestan",
        "pie_hl": "$0",
        "gancho": True,
        "tira": ["claude", "vps", "n8n", "whatsapp", "hyperframes", "hermes", "onia"],
    },
    {
        "layout": "E",
        "icono": "claude",
        "nombre": "Claude Max",
        "desc": "La capa que piensa. Escribe el código, los textos\ny los sistemas. Es lo único caro, y es para construir:\nno para que el negocio funcione.",
        "precio": "$200/mes",
    },
    # ⚠️ RECORTE del 10-sep — veredictos en docs/cola/AUDITORIA-8-CARRUSELES.md. Sergio
    # Urcullo: "si tenés carruseles que están horribles, primero perfeccionar y ver
    # cuáles son los mejores". Cinco fichas seguidas con la misma estructura y el mismo
    # $0: a partir de la tercera el lector ya entendió y desliza. Las cinco gratis
    # (Homelab, n8n, WhatsApp Business, HyperFrames, Hermes) se juntan en UNA lámina.
    # Las fichas individuales — con su historia: Notion y Chatwoot fuera el 06-sep, la
    # corrección de autoría de Hermes (es de NousResearch, lo suyo es el SOUL.md) —
    # quedan en git antes de este commit, por si alguna vuelve como pieza propia.
    {
        "layout": "D",
        "contexto": "Y las otras cinco cuestan",
        "remate": "$0",
        "sub": "Homelab · n8n · WhatsApp Business\nHyperFrames · Hermes\nCinco herramientas, cero mensualidades.",
        "tira": ["vps", "n8n", "whatsapp", "hyperframes", "hermes"],
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
    # CIERRE para ADENTRO (10-sep): la pieza cambió de destino — no va al perfil
    # público, ABRE la semana «Mi stack» en Announcements (14-sep). El cierre deja de
    # repetir la portada y anuncia lo único que el de adentro recibe y el de afuera no:
    # el archivo diario de cada herramienta.
    {
        "layout": "D",
        "contexto": "Siete herramientas, una factura",
        "remate": "$200",
        "sub": "al mes, y es todo para construir.\nY esta semana, acá adentro:\nun archivo por día, listo para usar.",
    },
    # QUIÉN-SOY (F, sergio-chroma.png) y el CTA «COMENTÁ STACK» SALIERON el 10-sep con
    # el cambio de destino: dentro de la comunidad ya lo conocen y ya comentaron —
    # pedir seguimiento o una palabra clave ahí es ruido, y "la lista con el paso a
    # paso" que prometía el CTA la reemplazan los seis drops de la semana, que entregan
    # el archivo real. Si la pieza vuelve alguna vez al perfil público, las dos láminas
    # están en git antes de este commit.
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

# Layout B — grilla 2x2 (referencia #2 del batch: "Necesito vitamina C", con Claude,
# Clientes, Café y Créditos). El chiste es que las cuatro empiezan con C, y las cuatro son
# reales para Sergio Urcullo: Claude lo paga, café toma, créditos gasta en artes, y
# clientes es LO QUE LE FALTA — ONIA_ESTRATEGIA_DE_EMPRESA.md §8.2 lo dice con todas las
# letras: "el producto no tiene un problema de rentabilidad, tiene un problema de
# clientes". Que la lámina más honesta sea también el remate es la mitad de la pieza.
VITAMINA_C = [
    {
        "layout": "B",
        "titulo": "Necesito vitamina C",
        "celdas": [
            {"icono": "claude", "rotulo": "Claude"},
            {"dibujo": "clientes", "rotulo": "Clientes"},
            {"objeto": "cafe.png", "rotulo": "Café"},
            {"dibujo": "creditos", "rotulo": "Créditos"},
        ],
    },
]

# Carrusel Fable 5.1. TODAS las cifras salen de la pagina oficial de Anthropic
# (anthropic.com/claude-fable-and-mythos-5-1), releida el 2026-09-07.
#
# ⚠️ TERCERA VERSION. Sergio Urcullo, 07-sep: "aun no me gusta la info que das en el de
# fable... coloca info relevante que se entienda". Tenia razon y el problema era de fondo:
# la pieza estaba escrita con los NOMBRES DE LAS PRUEBAS —AutomationBench, CursorBench,
# Terminal-Bench-Science, OSWorld— y a un dueño de negocio boliviano eso no le dice nada.
# Un titular que hay que googlear no es informacion: es ruido con aspecto de dato.
#
# REGLA NUEVA DE ESTA PIEZA: en la lamina NO aparece ningun nombre de benchmark. Cada
# numero se dice por lo que SIGNIFICA para el que lo lee ("termina 1 de cada 3 tareas
# enteras", "abre programas y hace clic"), y el nombre de la prueba baja al pie chiquito
# del layout G, que es donde va la trazabilidad sin estorbar la lectura.
#
# El angulo sigue siendo LO QUE HACE, no quien lo usa (pedido del 07-sep). Y lo que diga
# "el mejor" se CITA, no se opina: la pagina dice textual "They're the world's most
# advanced models for coding and knowledge work".
FABLE = [
    {
        "layout": "D",
        "marca": "claude",
        "contexto": "El modelo más avanzado de Anthropic",
        "remate": 'FABLE <span class="coral">5.1</span>',
        "pie": "y esto es lo que hace",
        "pie_hl": "mejor",
        "gancho": True,
        # ⚠️ "hasta −45%" lleva el "hasta" porque la pagina dice "up to approximately 45%".
        # Sin esa palabra la cifra pasa de ser un techo a ser una promesa.
        "adelanto": [
            {"cifra": "7 de 7", "que": "pruebas\nganadas"},
            {"cifra": "casi 2×", "que": "en tareas\nde oficina"},
            {"cifra": "hasta −45%", "que": "de costo si\ntrabaja solo"},
        ],
    },
    # LA MAS RELEVANTE PRIMERO: es la unica prueba de toda la tabla que mide una tarea de
    # oficina de punta a punta, o sea lo que hace un negocio. La lamina la cuenta con
    # ejemplos y con "1 de cada 3", no con el nombre de la prueba ni con el porcentaje
    # crudo: 31,4% se lee como nota baja, "1 de cada 3" se lee como lo que es.
    {
        "layout": "G",
        "titulo": "Le das el trabajo entero\ny lo termina",
        "sub": "No un pedacito: la tarea completa, de principio a fin,\nsin que se la vuelvas a explicar en el medio.\nHoy lo logra 1 de cada 3 veces. Antes, 1 de cada 6.",
        "fuente": "AutomationBench · Anthropic",
        "barras": [
            {"rotulo": "Fable 5.1", "valor": 31.4, "gana": True},
            {"rotulo": "Opus 5", "valor": 26.9},
            {"rotulo": "GPT-5.6\nSol", "valor": 19.6},
            {"rotulo": "Fable 5", "valor": 17.1},
        ],
    },
    # Capacidad pura, sin porcentaje en el titular: "usa la computadora" se entiende sin
    # ninguna explicacion y es lo que mas sorprende a alguien que nunca vio un agente.
    {
        "layout": "D",
        "contexto": "Y ya no hay que dictarle",
        "remate": "USA LA\nCOMPUTADORA",
        "largo": True,
        "sub": "Abre los programas, hace clic donde va y completa\nla tarea en la pantalla, como lo harías vos.\nAhí también le gana a Opus 5 y a su versión anterior.",
    },
    # Anthropic lo publica como caracteristica, no como puntaje. Para el lector de esta
    # cuenta es LA diferencia practica: algo que trabaja de noche sin que nadie lo mire.
    {
        "layout": "D",
        "contexto": "Y aguanta el turno largo",
        "remate": "TRABAJA SOLO",
        "sub": "Anthropic dice que se maneja mejor que la versión\nanterior en trabajos largos y sin supervisión.\nEs la diferencia entre una respuesta y un empleado.",
    },
    # La ventaja mas relatable: cualquiera que le pidio codigo a una IA conoce el parche
    # que funciona hoy y explota el martes. El tachado hace el trabajo sin gastar palabras.
    {
        "layout": "D",
        "contexto": 'Antes parchaba <span class="tachado">el síntoma</span>',
        "remate": "AHORA BUSCA\nLA CAUSA",
        "sub": "Anthropic lo dice así: arregla la raíz del problema\nen vez de tomar atajos que dan peor trabajo.",
    },
    # La prueba de que el salto no es marketing. Va DESPUES de las ventajas: primero se
    # entiende QUE cambio, despues se muestra CUANTO.
    {
        "layout": "G",
        "titulo": "Y no es sólo trabajo\nde oficina",
        "sub": "En investigación científica hecha sin nadie al lado\npasó de resolver 1 de cada 4 casos a más de la mitad.\nEl segundo de la lista no llega a 3 de cada 10.",
        "fuente": "Terminal-Bench-Science 0.1 · Anthropic",
        "barras": [
            {"rotulo": "Fable 5.1", "valor": 52.6, "gana": True},
            {"rotulo": "Opus 5", "valor": 29.0},
            {"rotulo": "GPT-5.6\nSol", "valor": 22.4},
            {"rotulo": "Fable 5", "valor": 24.7},
        ],
    },
    # El precio, TRADUCIDO. "$0,25 por millon de tokens" no se entiende fuera del gremio;
    # "lo que cuesta tenerlo trabajando" si. La ficha con el icono de Claude ademas cierra
    # la identidad visual de la pieza.
    {
        "layout": "E",
        "icono": "claude",
        "nombre": "Y encima bajó",
        "desc": "Tener algo suyo trabajando todo el día cuesta\nhasta 45% menos: lo que un agente más repite\nmientras trabaja solo ahora vale la cuarta parte.",
        "precio": "−75%",
        "etiqueta": "en lo que más se repite",
    },
    # CTA que obliga a comentar: pregunta cerrada, respuesta de una palabra, sobre algo
    # que el lector ya tiene decidido.
    {
        "layout": "D",
        "contexto": "Ahora te toca a vos",
        "remate": "¿CUÁL USÁS?",
        "sub": "Claude, ChatGPT o Gemini. Escribí el tuyo abajo\ny te digo para qué me sirve mejor cada uno.",
        "cta_hl": "Un nombre alcanza.",
        "cta_gris": "Te contesto a todos.",
    },
]
# Layout A — grilla comparativa 3x3 (referencia #1 del batch). Es el meme de founders
# LOCALIZADO, y el chiste vive en la tercera fila: el original pone Stripe / PayPal /
# Hotmart, y en Bolivia ninguna de las tres te sirve — Stripe directamente no acepta el
# pais ([[lety-cobra-tarjeta-antes-del-trial]]). Por eso la fila es transferencia, USDT y
# efectivo: el que la ve se rie porque le pasa.
# Sergio Urcullo sacó "QR del banco" el 06-sep y entró USDT en su lugar.
# Cero cifras y cero promesas: la pieza no afirma nada que haya que sostener despues.
FOUNDERS_BO = [
    {
        "layout": "A",
        "titulo": "Los founders bolivianos\ntienen 3 grandes decisiones:",
        "filas": [
            [
                {"icono": "claude", "rotulo": "Claude"},
                {"icono": "chatgpt", "rotulo": "ChatGPT"},
                {"icono": "gemini", "rotulo": "Gemini"},
            ],
            [
                {"objeto": "cafe.png", "rotulo": "Café"},
                {"objeto": "mate.png", "rotulo": "Mate"},
                {"objeto": "energetica.png", "rotulo": "Energética"},
            ],
            [
                {"dibujo": "transferencia", "rotulo": "Transferencia"},
                {"icono": "usdt", "rotulo": "USDT"},
                {"objeto": "efectivo.png", "rotulo": "Efectivo"},
            ],
        ],
    },
]

# ---------------------------------------------------------------------------------------
# LAS SEIS RESPUESTAS (cuenta @sergiourcullo). Sale del drop del lunes 14-sep y del archivo
# ya publicado en /stack/archivos. Es la pieza mas "guardable" del carril: no cuenta lo que
# el hizo, entrega algo que el lector usa hoy.
#
# ⚠️ RECORTADA de 6 a 4 el 10-sep (docs/cola/AUDITORIA-8-CARRUSELES.md): el remate
# (/cierro) esperaba hasta la lamina 4 detras de dos de relleno. La ficha de WhatsApp
# ademas traia la ruta de menu ("Herramientas para la empresa → …"), que es el COMO y
# esta prohibido en el perfil publico — la ruta vive en la guia /stack y en el drop del
# lunes. Y la portada perdio el gancho de 196px: "RESPUESTAS" a ese cuerpo salia CORTADA
# en los dos bordes del lienzo, y el gate de ancho NO lo atrapo — se vio MIRANDO el PNG.
RESPUESTAS = [
    {
        "layout": "D",
        "contexto": "Escribís lo mismo veinte veces por día",
        "remate": "SEIS\nRESPUESTAS",
        "pie": "y la sexta casi nadie la",
        "pie_hl": "tiene",
    },
    {
        "layout": "D",
        "contexto": "Las cinco que todos necesitan",
        "remate": "/precio\n/horario\n/donde",
        "sub": "/pago  ·  /demora\nCon el atajo, salen con dos toques.",
    },
    # El remate, ahora en la lamina 3: llega antes de que el lector se vaya. El "pide
    # la decision" (ex lamina 5 entera) baja a una linea de contexto — era la
    # explicacion del dato, no un dato aparte.
    {
        "layout": "D",
        "contexto": "Las cinco informan. La sexta decide:",
        "remate": "/cierro",
        "sub": "«¿Querés que te lo reserve? Con eso ya te lo\ndejo apartado a tu nombre.»",
    },
    # "largo": una sola linea a 104px. A 126px el remate partia en dos y la tilde de
    # ¿CUÁL caia sobre la E de REPETÍS (line-height .98 no deja aire para acentos
    # apilados) — se leia "RÉPETÍS". Visto MIRANDO el render del 10-sep.
    {
        "layout": "D",
        "contexto": "Ahora te toca a vos",
        "remate": "¿CUÁL REPETÍS?",
        "largo": True,
        "sub": "Escribí abajo la frase que más veces tipeaste\nesta semana y te la dejo lista para guardar.",
        "cta_hl": "Copiá y pegá, nomás.",
        "cta_gris": "Te contesto a todos.",
    },
]

# ---------------------------------------------------------------------------------------
# LO QUE ESTA SEMANA VA A LA COMUNIDAD (cuenta @sergiourcullo). Invita mostrando lo que se
# entrega, no prometiendo lo que se va a entregar: los seis archivos existen y estan
# publicados. Es la diferencia entre "unite que va a estar buenisimo" y "esto es lo que hay".
#
# ⚠️ SIN PALABRA CLAVE. La cuenta tiene `palabras: {}` en el workflow n8n activo de
# private-reply: un "Comenta X" sale con palabra=null y quien comenta no recibe nada.
COMUNIDAD_SEMANA = [
    {
        "layout": "D",
        "contexto": "Esta semana en mi comunidad",
        "remate": "SEIS\nARCHIVOS",
        "pie": "uno por día, y son",
        "pie_hl": "gratis",
        "gancho": True,
        "tira": ["whatsapp", "vps", "n8n", "claude", "hyperframes", "hermes"],
    },
    {
        "layout": "E",
        "icono": "whatsapp",
        "nombre": "Lunes",
        "desc": "Las seis respuestas de WhatsApp escritas,\ncon su atajo. Copiás y pegás.",
        "precio": "$0",
        "etiqueta": "respuestas-rapidas.txt",
    },
    {
        "layout": "E",
        "icono": "vps",
        "nombre": "Martes",
        "desc": "El script que deja tu PC vieja lista como\nservidor: zona horaria, Docker, firewall.",
        "precio": "$0",
        "etiqueta": "primer-arranque.sh",
    },
    {
        "layout": "E",
        "icono": "n8n",
        "nombre": "Miércoles",
        "desc": "El archivo que levanta n8n con la\nconfiguración ya puesta. Un comando.",
        "precio": "$0",
        "etiqueta": "docker-compose.yml",
    },
    {
        "layout": "E",
        "icono": "claude",
        "nombre": "Jueves",
        "desc": "El archivo que le da contexto a Claude Code,\nescrito para un negocio y no para código.",
        "precio": "$0",
        "etiqueta": "CLAUDE.md",
    },
    {
        "layout": "E",
        "icono": "hermes",
        "nombre": "Viernes y sábado",
        "desc": "Una plantilla de video desde HTML y el alma\ndel agente que avisa cuando algo se rompe.",
        "precio": "$0",
        "etiqueta": "placa.html · SOUL.md",
    },
    # La pieza tiene que contestar por que entrar si las guias son publicas. Se contesta
    # sin esconder nada, que es lo unico que se sostiene.
    {
        "layout": "D",
        "contexto": "Todo lo que enseño está afuera",
        "remate": "ADENTRO\nESTÁ HECHO",
        "sub": "La guía te dice qué escribir.\nAdentro está escrito, y si te trabás preguntás.",
    },
    {
        "layout": "D",
        "contexto": "Arranca el lunes",
        "remate": "¿TE SUMÁS?",
        "sub": "Escribí abajo «voy» y te paso el enlace del\ncanal. Es gratis y no vendo nada adentro.",
        "cta_hl": "Una palabra alcanza.",
        "cta_gris": "Te contesto a todos.",
    },
]

# ---------------------------------------------------------------------------------------
# ONIA — CUATRO COSAS QUE DEJAS DE HACER A MANO (cuenta @oniahq).
#
# ⚠️ TRES REGLAS DURAS DE ESTA PIEZA, de CLAUDE.md:
# 1. "Se vende el SISTEMA, el bot es add-on" + CERO AUTOBOMBO: no se habla de nosotros, del
#    equipo ni de nuestras competencias. Se habla del dia del dueño del negocio.
# 2. "La venta nunca exhibe obra": prohibido "proximamente", "beta", "muy pronto".
# 3. SOLO MODULOS 🟢 de ONIA_CATALOGO_DE_VENTA.md — los que un cliente real ya uso:
#    agenda y citas, clientes, servicios y inventario. Los 🟡 estan completos pero sin
#    kilometraje y esta pieza no los nombra.
# Sin precio: los precios los fija subscription-plans.ts / pricing.ts y esto es contenido.
ONIA_CUATRO = [
    {
        "layout": "D",
        "marca": "onia",
        "contexto": "Tu negocio ya funciona",
        "remate": "CUATRO COSAS\nA MANO",
        "pie": "y ninguna hace falta que",
        "pie_hl": "lo sigan",
        "gancho": True,
    },
    {
        "layout": "D",
        "contexto": "Anotar cada turno en un cuaderno",
        "remate": "LA AGENDA",
        "sub": "Los turnos entran solos, el cliente reserva\ndesde un link y nadie llama para preguntar\nsi hay lugar.",
    },
    {
        "layout": "D",
        "contexto": "Buscar quién era el del martes",
        "remate": "LOS CLIENTES",
        "sub": "Cada uno con su ficha, su historial y lo que\nte compró. Se busca escribiendo el nombre.",
    },
    {
        "layout": "D",
        "contexto": "Repetir el precio de memoria",
        "remate": "LOS SERVICIOS",
        "sub": "Lo que vendés, con su precio y su duración,\nen un solo lugar. Cambiás uno y cambia en\ntodos lados.",
    },
    {
        "layout": "D",
        "contexto": "Contar el stock a ojo",
        "remate": "EL INVENTARIO",
        "sub": "Lo que entra y lo que sale, sin planilla.\nY te avisa antes de que te quedes sin nada.",
    },
    {
        "layout": "D",
        "contexto": "Cuatro cosas menos por día",
        "remate": "EL MISMO\nNEGOCIO",
        "sub": "Sin que el dueño esté encima de cada una.\nEso es todo lo que hace el sistema.",
    },
    {
        "layout": "D",
        "contexto": "¿Cuál te come más tiempo?",
        "remate": "CONTAME",
        "sub": "Agenda, clientes, servicios o inventario.\nEscribí abajo cuál y te digo por dónde\nempezaría en tu rubro.",
        "cta_hl": "Una palabra alcanza.",
        "cta_gris": "Contesto a todos.",
    },
]

# REPOS — pedida por Sergio Urcullo el 17-sep con la referencia de @soyenriquerocha
# («Que no se vea hecho con IA · 10 repos», 3,1k likes en un dia). Se extrae la
# ESTRUCTURA (portada statement → repos agrupados por tarea, 2-4 por lamina, nombre
# exacto → una linea → cierre con criterio), no la identidad. El dato que el lector no
# sabia: el ORDEN de confianza (oficial → empresa dueña → comunidad) y que una skill se
# LEE antes de instalar. Los 10 repos: los del video 05, re-verificados vivos por la API
# de GitHub el 2026-09-17 (mismos nombres que el 10-sep). Sin estrellas: envejecen.
# Trailer del YT 05 «No escribas nada» — publicar con su salida (sab 19).
F_QUIEN_SOY = {
    "layout": "F",
    "nombre": "Soy Sergio Urcullo,",
    "sub": "y automatizo negocios bolivianos\npara que dejen de hacer todo a mano.\nSeguime — publico esto todos los días.",
    "foto": "sergio-chroma.png",
}

REPOS = [
    {
        "layout": "D",
        "marca": "github",
        "contexto": "Escribí 197 piezas para mi empresa.\nDespués aprendí a buscar primero:",
        "remate": "10 repos",
        "pie": "hacen casi todo lo que necesito. Cuestan",
        "pie_hl": "$0",
        "gancho": True,
    },
    {
        "layout": "R",
        "term_titulo": "es texto: se lee",
        "term": ['<span class="p">&gt;</span> abrí una skill oficial',
                 '<span class="g">instrucciones, en texto plano</span>',
                 '<span class="ok">✓</span> la leíste ANTES de instalar'],
        "own": "anthropics", "repo": "skills",
        "linea": "Las skills oficiales de Anthropic.\nEl primero al que hay que ir.",
        "etiqueta": "1 · oficial · por acá se empieza",
    },
    {
        "layout": "R",
        "term_titulo": "el directorio",
        "term": ['<span class="p">&gt;</span> buscá "memoria"',
                 '<span class="ok">✓</span> instalado en 10 segundos',
                 '<span class="g">queda en todos tus proyectos</span>'],
        "own": "anthropics", "repo": "claude-plugins-official",
        "chico": True,
        "linea": "El directorio oficial de plugins:" + chr(10) + "desde acá se llega a casi todo lo demás.",
        "etiqueta": "1 · oficial",
    },
    {
        "layout": "R",
        "term_titulo": "la publica el dueño",
        "term": ['<span class="p">&gt;</span> construí sobre Cloudflare',
                 '<span class="ok">✓</span> sin inventarte la mitad'],
        "own": "cloudflare", "repo": "skills",
        "linea": "La escribió la empresa dueña de la herramienta.\nGreenSock hace igual: greensock/gsap-skills.",
        "etiqueta": "2 · empresa dueña",
    },
    {
        "layout": "R",
        "term_titulo": "memoria",
        "term": ['<span class="p">&gt;</span> ¿en qué quedamos ayer?',
                 '<span class="ok">✓</span> se acuerda. De todo.'],
        "own": "thedotmack", "repo": "claude-mem",
        "linea": "Memoria entre sesiones: dejás de contarle\ntu proyecto cada vez que lo abrís.",
        "etiqueta": "3 · comunidad · lo uso yo",
    },
    {
        "layout": "R",
        "term_titulo": "el mapa",
        "term": ['<span class="p">&gt;</span> leete este proyecto entero',
                 '<span class="ok">✓</span> mapa listo: recorrelo'],
        "own": "Egonex-AI", "repo": "Understand-Anything",
        "chico": True,
        "linea": "Convierte un proyecto entero en un mapa que se recorre.\nPara entender código ajeno no conozco nada igual.",
        "etiqueta": "3 · comunidad · lo uso yo",
    },
    {
        "layout": "R",
        "term_titulo": "personalidad",
        "term": ['<span class="p">&gt;</span> antes: 200 líneas de código',
                 '<span class="ok">✓</span> ahora: 20. Y funcionan.'],
        "own": "DietrichGebert", "repo": "ponytail",
        "linea": "Lo vuelve un senior vago: menos código, menos roturas.\nSu dupla: JuliusBrussee/caveman — respuestas sin relleno.",
        "etiqueta": "3 · comunidad · uso los dos",
    },
    {
        "layout": "D",
        "contexto": "El orden ES el consejo:",
        "remate": "Buscá.\nDespués escribí.",
        "sub": "Oficial → empresa dueña → comunidad.\nY dos más que uso: multica-ai/andrej-karpathy-skills\ny affaan-m/ECC. Leelos antes: son texto plano.",
        "cta_hl": "¿Cuál probás primero?",
        "cta_gris": "Respondo todos los comentarios.",
    },
    F_QUIEN_SOY,
]

DIA = [
    {
        "layout": "H",
        "titulo": "«Y a qué hora hacés todo?»",
        "sub": "Mi día, con las dos agendas a la vez:",
        "yo": [
            (8, 9, "leo lo que dejó el sistema", "#BFD7F2", False),
            (9, 13, "construyo, una cosa por vez", "#DCD3F2", False),
            (13, 14, "almuerzo", "#F2E2B8", False),
            (14, 16, "llamadas 1 a 1", "#F2C9C4", False),
            (16.5, 18.5, "grabo los videos del día", "#F2E2B8", False),
            (19, 22, "llamadas 1 a 1", "#F2C9C4", False),
        ],
        "sistema": [
            (6, 6.8, "revisa web y docs", "", True),
            (8, 8.8, "cola de tareas", "", True),
            (10, 10.8, "entra como cliente", "", True),
            (12, 12.8, "cola de tareas", "", True),
            (14, 14.8, "revisa la web de venta", "", True),
            (16, 16.8, "cola de tareas", "", True),
            (18, 18.8, "entra como cliente", "", True),
            (20, 20.8, "revisa la web de venta", "", True),
            (22, 22.8, "cola de tareas", "", True),
        ],
        "rem": 'Los <span class="vd">verdes ✓</span> corren solos. Yo no estoy ahí.',
    },
    F_QUIEN_SOY,
]

# Variante FOUNDER de la pieza dia (pedida 17-sep: "similar, pero mas founder").
# Mismo layout H; el angulo cambia: construir POCO y vender/decidir MUCHO. Bloques
# reales: llamadas Cal (14-16 y 19-22), prospectos de WhatsApp (existen y esperan),
# la 1.0 como objetivo vigente, grabacion en lote real. Los verdes: crons del deck 03.
DIA_FOUNDER = [
    {
        "layout": "H",
        "titulo": "«¿Cómo es ser founder a los 16?»",
        "sub": "Construir · vender · contar. Lo repetido no me toca:",
        "yo": [
            (8, 9, "números y avisos de ayer", "#BFD7F2", False),
            (9, 12, "producto: la 1.0", "#DCD3F2", False),
            (12, 13, "prospectos de WhatsApp", "#D7E8F0", False),
            (13, 14, "almuerzo", "#F2E2B8", False),
            (14, 16, "llamadas con clientes", "#F2C9C4", False),
            (16.5, 18.5, "contenido: el video del día", "#F2E2B8", False),
            (19, 22, "llamadas y demos", "#F2C9C4", False),
        ],
        "sistema": [
            (6, 6.8, "revisa web y docs", "", True),
            (8, 8.8, "cola de tareas", "", True),
            (10, 10.8, "prueba el producto", "", True),
            (12, 12.8, "cola de tareas", "", True),
            (14, 14.8, "vigila la web de venta", "", True),
            (16, 16.8, "cola de tareas", "", True),
            (18, 18.8, "prueba el producto", "", True),
            (20, 20.8, "vigila la web de venta", "", True),
            (22, 22.8, "cola de tareas", "", True),
        ],
        "rem": 'Los <span class="vd">verdes ✓</span> corren solos. Yo hago lo que no se delega: <b>vender y decidir</b>.',
    },
    F_QUIEN_SOY,
]

# Tres piezas nuevas del 17-sep (cola de carruseles de las 8:00). Datos propios y ya
# verificados en los decks 03/06 (el 74 %, las fallas, el caso del correo). Regla:
# cada una entrega UN dato que el lector no sabia; los term MUESTRAN el mecanismo.
REGLA_74 = [
    {
        "layout": "D",
        "contexto": "Mi gasto de IA se dispar\u00f3.\nAntes de cortar nada, fui a mirar:",
        "remate": "74%",
        "pie": "del pico era UN solo trabajo",
        "pie_hl": "mal configurado",
        "gancho": True,
    },
    {
        "layout": "R",
        "term_titulo": "qui\u00e9n gast\u00f3",
        "badge": "paso 1",
        "term": ['<span class="p">&gt;</span> \u00bfqui\u00e9n gast\u00f3?',
                 '<span class="ok">\u2713</span> atribuido: UN trabajo',
                 '<span class="g">los dem\u00e1s: normales</span>'],
        "titular": "Primero, atribuir.",
        "linea": "No apagu\u00e9s todo: con arreglar \u00e9se alcanz\u00f3,\ny lo dem\u00e1s sigui\u00f3 andando.",
        "etiqueta": "la regla del 74%",
    },
    {
        "layout": "R",
        "term_titulo": "la trampa",
        "badge": "paso 2",
        "term": ['<span class="p">&gt;</span> \u00bfsubo el tope?',
                 '<span class="no">\u2717</span> el mes que viene: el doble'],
        "titular": "El tope, al final.",
        "linea": "Si sub\u00eds el tope sin mirar,\nel gasto solo aprende a crecer.",
        "etiqueta": "la regla del 74%",
    },
    {
        "layout": "D",
        "contexto": "La regla entera:",
        "remate": "Se baja el consumo.\nNo se sube el tope.",
        "sub": "Primero qui\u00e9n. Despu\u00e9s \u00e9se. El tope, al final.",
        "cta_hl": "\u00bfTu factura de IA subi\u00f3 este mes?",
        "cta_gris": "Contame y la miramos.",
    },
]

TRES_PREGUNTAS = [
    {
        "layout": "D",
        "contexto": "La IA me dijo \u00ablisto\u00bb.\nLa pantalla estuvo rota d\u00edas.",
        "remate": "Mentira.",
        "pie": "Tres preguntas para que no te pase",
        "pie_hl": "a vos",
        "gancho": True,
    },
    {
        "layout": "R",
        "term_titulo": "lo que te dice",
        "badge": "1 de 3",
        "term": ['<span class="ok">\u2713</span> Listo. Cambi\u00e9 3 archivos.',
                 '<span class="g">(no estaba listo)</span>'],
        "titular": "\u00bfLo mir\u00e9?",
        "linea": "Si lo ve una persona, se abre y se mira.\nUna b\u00fasqueda descarta; nunca confirma.",
        "etiqueta": "mirar",
    },
    {
        "layout": "R",
        "term_titulo": "el n\u00famero",
        "badge": "2 de 3",
        "term": ['<span class="p">&gt;</span> mand\u00e1 el correo a todos',
                 '<span class="ok">\u2713</span> terminado sin errores',
                 '<span class="no">lista: 0 clientes</span>'],
        "titular": "\u00bfCu\u00e1nto sali\u00f3?",
        "linea": "Un n\u00famero, no un \u00ablisto\u00bb: cu\u00e1ntos correos,\ncu\u00e1ntas filas, cu\u00e1ntos segundos.",
        "etiqueta": "medir",
    },
    {
        "layout": "R",
        "term_titulo": "la fecha",
        "badge": "3 de 3",
        "term": ['<span class="p">&gt;</span> dato de la semana pasada',
                 '<span class="no">\u2717</span> hoy ya cambi\u00f3'],
        "titular": "\u00bfLo cont\u00e9 hoy?",
        "linea": "Un dato viejo es una suposici\u00f3n\ncon cara de dato.",
        "etiqueta": "volver a contar",
    },
    {
        "layout": "D",
        "contexto": "Mirar \u00b7 medir \u00b7 volver a contar",
        "remate": "2 minutos.",
        "sub": "Eso cuesta comprobar en vez de creer.\nEl video completo est\u00e1 en mi canal.",
        "cta_hl": "\u00bfCu\u00e1l de las tres te salte\u00e1s?",
        "cta_gris": "Yo me salteaba la primera.",
    },
]

FALLA_SOLO = [
    {
        "layout": "D",
        "contexto": "Automatic\u00e9 media empresa.\nY esto lo aprend\u00ed a los golpes:",
        "remate": "Lo que corre solo,\nfalla solo.",
        "gancho": True,
    },
    {
        "layout": "D",
        "contexto": "Falla 1",
        "remate": "200 l\u00edneas",
        "sub": "Mi hook de cierre subi\u00f3 c\u00f3digo antes de que\nexistiera lo que lo usaba. No rompi\u00f3 nada\nde pura casualidad.",
    },
    {
        "layout": "D",
        "contexto": "Falla 2",
        "remate": "3 semanas",
        "sub": "Un servicio corri\u00f3 todos los d\u00edas sin publicar\nnada. No fallaba: no hac\u00eda nada. Y nada avisa\ncuando algo no hace nada.",
    },
    {
        "layout": "D",
        "contexto": "Falla 3",
        "remate": "4 de 6",
        "sub": "Cuatro de mis seis conectores no andaban.\nNo me avis\u00f3 ninguno: me enter\u00e9\nporque fui a mirar.",
    },
    {
        "layout": "D",
        "contexto": "Las tres reglas que me salvan",
        "remate": "Que avise\ncuando falla.",
        "sub": "Que mida el resultado, no el \u00ablisto\u00bb.\nY techo al gasto \u2014 siempre.",
        "cta_hl": "\u00bfQu\u00e9 corre solo en tu negocio?",
        "cta_gris": "\u00bfY qui\u00e9n lo mira?",
    },
]

# Lamina de presentacion (pedida 17-sep: "a cada post... el que tenga mi cara con mi
# nombre"). Es el layout F ya aprobado (PORTADA_F), como ULTIMA lamina de cada pieza.


# ── Cola de ENSEÑANZA del 17-sep. Correccion de Sergio Urcullo: "los 3 nuevos no
# enseñan nada interesante, busca cosas interesantes, noticias". Una tesis no es una
# pieza: cada carrusel enseña una NOTICIA, una FUNCION o una APP.
# NOTICIA-WHATSAPP: fuente OFICIAL leida el 17-sep (developers.facebook.com/docs/
# whatsapp/pricing, "Updated: 10 sep 2026"): cambios de precios el 1-oct-2026; solo
# se cobran mensajes de plantilla; sin plantilla dentro de la ventana de servicio =
# gratis; 72h gratis desde punto de acceso (anuncios). CADUCA: publicar ANTES del 1-oct.
NOTICIA_WHATSAPP = [
    {
        "layout": "P",
        "pill": "noticia \u00b7 rige el 1 oct",
        "pill_color": "rojo",
        "titulo": "WhatsApp<br>cambia sus<br><em>precios.</em>",
        "obj_icono": "whatsapp",
    },
    {
        "layout": "R",
        "term_titulo": "lo que sigue GRATIS",
        "badge": "dato 1",
        "term": ['<span class="p">&gt;</span> el cliente te escribe',
                 '<span class="p">&gt;</span> le respond\u00e9s en la ventana',
                 '<span class="ok">\u2713</span> costo: $0'],
        "titular": "Responder es gratis.",
        "linea": "Los mensajes sin plantilla, dentro de la ventana\nde servicio, no se cobran. Contest\u00e1 r\u00e1pido.",
        "etiqueta": "fuente: meta \u00b7 le\u00eddo 17-sep",
    },
    {
        "layout": "R",
        "term_titulo": "lo que se cobra",
        "badge": "dato 2",
        "term": ['<span class="p">&gt;</span> VOS inici\u00e1s la conversaci\u00f3n',
                 '<span class="no">\u2717</span> plantilla = se paga',
                 '<span class="g">y el precio cambia el 1-oct</span>'],
        "titular": "Iniciar se paga.",
        "linea": "Solo se cobran los mensajes de plantilla \u2014 los\nque mand\u00e1s vos primero: promos, recordatorios.",
        "etiqueta": "fuente: meta \u00b7 le\u00eddo 17-sep",
    },
    {
        "layout": "R",
        "term_titulo": "el truco que nadie usa",
        "badge": "dato 3",
        "term": ['<span class="p">&gt;</span> cliente entra por tu anuncio',
                 '<span class="ok">\u2713</span> 72 horas: TODO gratis'],
        "titular": "72 horas gratis.",
        "linea": "Si la conversaci\u00f3n arranca desde un anuncio,\ntodos los mensajes son gratis por 72 horas.",
        "etiqueta": "fuente: meta \u00b7 le\u00eddo 17-sep",
    },
    {
        "layout": "D",
        "contexto": "Antes del 1 de octubre:",
        "remate": "Revis\u00e1 tus\nplantillas.",
        "sub": "Lo que hoy mand\u00e1s como plantilla y podr\u00eda ser\nrespuesta dentro de la ventana, es plata que\nse va desde octubre.",
        "cta_hl": "\u00bfVend\u00e9s por WhatsApp?",
        "cta_gris": "Contame qu\u00e9 mand\u00e1s m\u00e1s: \u00bfpromos o respuestas?",
    },
    F_QUIEN_SOY,
]

# CUADERNO-EXCEL: funcion que impresiona y se puede copiar HOY. El prompt es la pieza.
CUADERNO_EXCEL = [
    {
        "layout": "P",
        "pill": "gratis \u00b7 2 minutos",
        "titulo": "Tu cuaderno<br>ya es una<br><em>planilla.</em>",
        "obj_term_titulo": "una foto alcanza",
        "obj_term": ['<span class="ok">\u2713</span> tabla lista',
                     '<span class="ok">\u2713</span> fiado: sumado'],
    },
    {
        "layout": "R",
        "term_titulo": "c\u00f3mo funciona",
        "badge": "gratis",
        "term": ['<span class="p">&gt;</span> [foto del cuaderno]',
                 '<span class="ok">\u2713</span> tabla: fecha \u00b7 cliente \u00b7 monto',
                 '<span class="ok">\u2713</span> fiado total: sumado'],
        "titular": "Lee tu letra.",
        "linea": "Le sac\u00e1s la foto, se la peg\u00e1s al chat de Claude\ny le ped\u00eds la tabla. Eso es todo.",
        "etiqueta": "funciona en el plan gratis",
    },
    {
        "layout": "R",
        "term_titulo": "el prompt \u00b7 copialo",
        "badge": "",
        "term": ['<span class="g">Pas\u00e1 esta foto a una tabla:</span>',
                 '<span class="g">fecha, cliente, monto. Si dice</span>',
                 '<span class="g">\u00abdebe\u00bb, marcalo. Sum\u00e1 el fiado.</span>'],
        "titular": "El prompt exacto.",
        "linea": "As\u00ed, literal. La palabra \u00abmarcalo\u00bb hace que\nte separe el fiado de lo cobrado.",
        "etiqueta": "guardalo",
    },
    {
        "layout": "R",
        "term_titulo": "lo que NO hace",
        "badge": "",
        "term": ['<span class="no">\u2717</span> letra imposible: inventa',
                 '<span class="p">&gt;</span> revis\u00e1 los montos vos'],
        "titular": "No le creas ciego.",
        "linea": "Si tu letra es muy mala, puede leer mal un n\u00famero.\nLa tabla se revisa antes de usarla. Siempre.",
        "etiqueta": "la parte honesta",
    },
    {
        "layout": "D",
        "contexto": "Probalo hoy con una p\u00e1gina",
        "remate": "2 minutos.",
        "sub": "Una foto, el prompt de arriba, y tu primer\nregistro digital sin cambiar de cuaderno.",
        "cta_hl": "\u00bfQu\u00e9 anot\u00e1s a mano todos los d\u00edas?",
        "cta_gris": "Contame y te digo si una foto lo resuelve.",
    },
    F_QUIEN_SOY,
]

# APP-ESCRITORIO: dato verificado contra la doc oficial (10-sep, drop D4): existe la
# app de escritorio de Claude Code para macOS, Windows y Linux.
APP_ESCRITORIO = [
    {
        "layout": "P",
        "pill": "sin terminal",
        "pill_color": "naranja",
        "titulo": "Claude Code,<br>sin pantalla<br><em>negra.</em>",
        "obj_icono": "claude",
    },
    {
        "layout": "R",
        "term_titulo": "antes \u00b7 la terminal",
        "badge": "",
        "term": ['<span class="p">&gt;</span> npm install -g ...',
                 '<span class="g">pantalla negra, comandos,</span>',
                 '<span class="g">miedo de romper algo</span>'],
        "titular": "Esto asustaba.",
        "linea": "La terminal frena a la mitad de la gente\nantes de empezar. Con raz\u00f3n.",
        "etiqueta": "el problema",
    },
    {
        "layout": "R",
        "term_titulo": "ahora \u00b7 la app",
        "badge": "",
        "term": ['<span class="ok">\u2713</span> ventanas, botones, chat',
                 '<span class="ok">\u2713</span> mismos poderes',
                 '<span class="ok">\u2713</span> Mac \u00b7 Windows \u00b7 Linux'],
        "titular": "La app hace lo mismo.",
        "linea": "Toca tus archivos, construye y automatiza igual\nque la terminal \u2014 con ventanas normales.",
        "etiqueta": "claude.com \u00b7 verificado en la doc",
    },
    {
        "layout": "D",
        "contexto": "El detalle que importa:",
        "remate": "Plan pago,\nno gratis.",
        "sub": "El plan gratis de Claude NO incluye Claude Code\n\u2014 ni en terminal ni en app. Te lo digo antes\nde que pierdas la tarde.",
        "cta_hl": "\u00bfTerminal o ventanas, vos?",
        "cta_gris": "Yo arranqu\u00e9 con miedo tambi\u00e9n.",
    },
    F_QUIEN_SOY,
]

# ---------------------------------------------------------------------------------
# SEMANA DEL 21-SEP · 5 piezas. Copy portado de los briefs `sergio-*-20260921.json`,
# que se habian rendido con el motor de PRODUCTO (carousel_render.js --pack
# typographic). Ese motor no dibuja el `callout` del brief — ocho datos se perdian en
# silencio — y no tiene lamina F. Marca personal se rinde con este patron.
#
# Todo numero sale de la tabla verificada del handoff `yt-serie-claude-code.md`
# (medida el 18-sep). Ninguno se hereda sin su fuente.

# 1 · AGENTS.md — noticia. Claude Code 2.1.277 lee AGENTS.md, pero SOLO si no hay
# CLAUDE.md. Era el pedido #1 del repo (5.270 reacciones).
AGENTS_MD = [
    {
        "layout": "P",
        "pill": "novedad · 2.1.277",
        "pill_color": "naranja",
        "titulo": "Un archivo<br>de reglas.<br><em>Los dos.</em>",
        "obj_icono": "claude",
    },
    {
        "layout": "R",
        "term_titulo": "antes · dos archivos",
        "badge": "",
        "term": ['<span class="p">&gt;</span> CLAUDE.md → Claude Code',
                 '<span class="p">&gt;</span> AGENTS.md → Codex, Cursor',
                 '<span class="no">✗</span> las mismas reglas, 2 veces'],
        "titular": "Escribías todo dos veces.",
        "linea": "Y también Copilot. Las mismas reglas en dos\narchivos: cambiabas uno y el otro mentía.",
        "etiqueta": "el problema",
    },
    {
        "layout": "R",
        "term_titulo": "ahora · versión 2.1.277",
        "badge": "nuevo",
        "term": ['<span class="ok">✓</span> Claude Code lee AGENTS.md',
                 '<span class="g">5.270 personas lo pidieron</span>',
                 '<span class="g">era el pedido #1 del repo</span>'],
        "titular": "Era el pedido número uno.",
        "linea": "El archivo que ya usaban Codex, Cursor y Copilot\nahora también lo lee Claude Code.",
        "etiqueta": "changelog oficial · leído 18-sep",
    },
    {
        "layout": "R",
        "term_titulo": "la letra chica",
        "badge": "",
        "term": ['<span class="p">&gt;</span> ¿el proyecto tiene CLAUDE.md?',
                 '<span class="no">✗</span> sí → AGENTS.md se ignora',
                 '<span class="ok">✓</span> no → recién ahí lo lee'],
        "titular": "Lo van a contar mal.",
        "linea": "No los lee a los dos. Si están los dos, gana\nCLAUDE.md y el otro no existe.",
        "etiqueta": "el detalle que casi nadie dice",
    },
    {
        "layout": "D",
        "contexto": "Qué hacés hoy, según dónde estés:",
        "remate": "Una línea\nalcanza.",
        "sub": "Arrancás de cero: escribí solo AGENTS.md y\nte sirve para los cuatro programas.\nYa tenés CLAUDE.md andando: no lo borres —\nmetele adentro la línea @AGENTS.md.",
        "cta_hl": "¿Ya tenés tus reglas escritas?",
        "cta_gris": "¿O se las explicás de nuevo en cada chat? Contame.",
    },
    F_QUIEN_SOY,
]

# 2 · MISMO PRECIO — Fable 5.1 (Anthropic, 1-sep) y GPT-6 Astra (OpenAI, 3-sep;
# default en Codex el 4-sep) cuestan lo mismo por token.
MISMO_PRECIO = [
    {
        "layout": "P",
        "pill": "septiembre 2026",
        "titulo": "El precio<br>ya <em>no</em><br>decide.",
        "obj_term_titulo": "frontera contra frontera",
        "obj_term": ['<span class="ok">✓</span> Fable 5.1 · 1-sep',
                     '<span class="ok">✓</span> GPT-6 Astra · 3-sep',
                     '<span class="g">mismo precio por token</span>'],
    },
    {
        "layout": "R",
        "term_titulo": "dos lanzamientos, tres días",
        "badge": "",
        "term": ['<span class="p">&gt;</span> 1-sep · Fable 5.1',
                 '<span class="p">&gt;</span> 3-sep · GPT-6 Astra',
                 '<span class="p">&gt;</span> 4-sep · default en Codex'],
        "titular": "Se cerró la brecha.",
        "linea": "Anthropic el 1, OpenAI el 3, y el 4 ya era el\ndefault de Codex. El precio por token empata.",
        "etiqueta": "el dato",
    },
    {
        "layout": "R",
        "term_titulo": "criterio 1 · dónde vivís vos",
        "badge": "",
        "term": ['<span class="ok">✓</span> Claude Code: terminal, reglas',
                 '<span class="ok">✓</span> Codex: si ya usás OpenAI'],
        "titular": "Elegís por costumbre.",
        "linea": "La herramienta que ya está donde trabajás te va\na doler menos que la que puntúa mejor.",
        "etiqueta": "no es una pelea de puntajes",
    },
    {
        "layout": "R",
        "term_titulo": "criterio 2 · quién revisa",
        "badge": "",
        "term": ['<span class="p">&gt;</span> los dos reparten en agentes',
                 '<span class="p">&gt;</span> ¿cuál te MUESTRA qué hizo?'],
        "titular": "Vas a vivir ahí adentro.",
        "linea": "Lo que se usa todos los días no es el modelo:\nes la pantalla donde revisás su trabajo.",
        "etiqueta": "lo que nadie compara",
    },
    {
        "layout": "D",
        "contexto": "Criterio 3, y es el único que no se discute:",
        "remate": "Misma tarea.\nLos dos.",
        "sub": "No los compares leyendo comparativas.\nDales la misma tarea real una semana\ny mirá cuál te hizo corregir menos.",
        "tira": ["claude", "chatgpt"],
        "cta_hl": "¿Cuál usás vos, y por qué?",
        "cta_gris": "Leo todos los comentarios.",
    },
    F_QUIEN_SOY,
]

# 3 · INSTRUMENTO ROTO — el caso real del 2026-08-15 (CLAUDE.md §«Verificar es MIRAR»):
# la pantalla de login mostraba los nombres de los iconos como texto, en produccion.
INSTRUMENTO_ROTO = [
    {
        "layout": "P",
        "pill": "la regla que más uso",
        "pill_color": "rojo",
        "titulo": "Si da verde<br>con la cosa<br><em>rota…</em>",
        "obj_term_titulo": "dos verdes seguidos",
        "obj_term": ['<span class="ok">✓</span> los textos están',
                     '<span class="ok">✓</span> el servidor responde',
                     '<span class="no">✗</span> nunca la abrí'],
    },
    {
        "layout": "R",
        "term_titulo": "verde 1 · busqué los textos",
        "badge": "",
        "term": ['<span class="p">&gt;</span> grep "Iniciar sesión" *.tsx',
                 '<span class="ok">✓</span> está en el archivo'],
        "titular": "Buscar no confirma nada.",
        "linea": "Una búsqueda sirve para DESCARTAR. Que el texto\nesté en el archivo no dice cómo se ve.",
        "etiqueta": "verde, y no medía nada",
    },
    {
        "layout": "R",
        "term_titulo": "verde 2 · ¿responde la página?",
        "badge": "",
        "term": ['<span class="p">&gt;</span> curl -w "%{http_code}" URL',
                 '<span class="ok">✓</span> 200'],
        "titular": "Doscientos. Verde.",
        "linea": "Una página puede responder perfecto y verse rota.\nEl 200 mide el servidor, no la pantalla.",
        "etiqueta": "verde, y tampoco medía nada",
    },
    {
        "layout": "R",
        "term_titulo": "lo que el cliente veía",
        "badge": "producción",
        "term": ['<span class="no">✗</span> credit_card_off',
                 '<span class="no">✗</span> verified_user',
                 '<span class="g">donde iba el ícono, su NOMBRE</span>'],
        "titular": "En producción. Lo vio otro.",
        "linea": "En la pantalla de entrar. La di por buena con esas\ndos medidas, sin abrirla una sola vez.",
        "etiqueta": "encontrado el 15-ago",
    },
    {
        "layout": "D",
        "contexto": "De ahí salió la regla:",
        "remate": "Medí la cosa,\nno su sombra.",
        "sub": "Si tu comprobación puede dar verde\ncon todo roto, no es una comprobación:\nes un instrumento roto.\nAbrilo. Miralo. Después decí listo.",
        "cta_hl": "¿Qué «verde» tenés hoy que nunca abriste?",
        "cta_gris": "Contame cuál y te digo cómo lo miraría.",
    },
    F_QUIEN_SOY,
]

# 4 · DATO HEREDADO — el numero era 4 y son 40 (crons del VPS, `crontab -l`, 18-sep).
# El archivo tenia escrito arriba, por mi, «estos numeros no cambian».
DATO_HEREDADO = [
    {
        "layout": "P",
        "pill": "me pasó esta semana",
        "titulo": "Un dato viejo<br><em>no</em> es<br>un dato.",
        "obj_term_titulo": "lo que tenía anotado",
        "obj_term": ['<span class="p">&gt;</span> decía: 4 tareas',
                     '<span class="g">repetido 5 veces</span>',
                     '<span class="no">✗</span> jamás recontado'],
    },
    {
        "layout": "R",
        "term_titulo": "estaba por decirlo en cámara",
        "badge": "",
        "term": ['<span class="p">&gt;</span> lo puse en un guion',
                 '<span class="p">&gt;</span> lo puse en un documento',
                 '<span class="p">&gt;</span> lo puse en una lámina'],
        "titular": "Se volvió cierto solo.",
        "linea": "Cada vez que copiás un dato de tu propio documento\nse siente más cierto. No lo volviste a medir.",
        "etiqueta": "así se fabrica una certeza falsa",
    },
    {
        "layout": "R",
        "term_titulo": "fui a contarlo de nuevo",
        "badge": "2 minutos",
        "term": ['<span class="p">&gt;</span> crontab -l | wc -l',
                 '<span class="no">✗</span> decía 4',
                 '<span class="ok">✓</span> son 40'],
        "titular": "Diez veces más.",
        "linea": "Nadie lo había tocado. Simplemente nunca fue\nel número que yo creía que era.",
        "etiqueta": "contado el 18-sep, en la máquina",
    },
    {
        "layout": "R",
        "term_titulo": "lo peor del asunto",
        "badge": "",
        "term": ['<span class="g">« estos números no cambian,</span>',
                 '<span class="g">  no hace falta recontarlos »</span>',
                 '<span class="no">✗</span> lo escribí yo, ahí arriba'],
        "titular": "Me avisé a mí mismo.",
        "linea": "Esa frase no era un ahorro de tiempo: era el error,\nescrito con letra grande y firmado.",
        "etiqueta": "y aun así lo heredé",
    },
    {
        "layout": "D",
        "contexto": "La regla, y cuesta dos minutos:",
        "remate": "Recontá antes\nde afirmarlo.",
        "sub": "Sobre todo si lo vas a decir en público,\ncobrar por eso, o decidir algo con eso.\nRepetir no es saber.",
        "cta_hl": "¿Ese número tuyo lo contaste HOY?",
        "cta_gris": "Si la respuesta es «lo tenía anotado», andá a contarlo.",
    },
    F_QUIEN_SOY,
]

# 5 · 18 ERRORES — contados en las 6 versiones de handoff/onia-dev-node-setup.md §5
# (4+9+5). Los 18 autodetectados. ⚠️ material viejo decia «12, y 11 los encontro el»:
# ese 12 no sale de ningun lado.
ERRORES_18 = [
    {
        "layout": "P",
        "pill": "mi caso · números reales",
        "titulo": "Conté mis<br>errores. Los<br><em>anoté todos.</em>",
        "obj_term_titulo": "lo que anoté",
        "obj_term": ['<span class="p">&gt;</span> anotados: 18',
                     '<span class="p">&gt;</span> de una sesión: 4',
                     '<span class="no">✗</span> el que se escapó: 1'],
    },
    {
        "layout": "R",
        "term_titulo": "la pregunta de siempre",
        "badge": "",
        "term": ['<span class="p">&gt;</span> «¿y si la IA se equivoca?»',
                 '<span class="g">corta: se equivoca. bastante.</span>',
                 '<span class="g">la larga es más útil</span>'],
        "titular": "Sí, se equivoca.",
        "linea": "Es lo que todos preguntan antes de empezar,\ny el número real ayuda más que la opinión.",
        "etiqueta": "el miedo",
    },
    {
        "layout": "R",
        "term_titulo": "el número",
        "badge": "18",
        "term": ['<span class="p">&gt;</span> diagnósticos equivocados',
                 '<span class="p">&gt;</span> comprobaciones que no prueban',
                 '<span class="p">&gt;</span> datos viejos sin recontar'],
        "titular": "Dieciocho anotados.",
        "linea": "Cuatro salieron de una sola sesión. El resto, de\ndías sobre lo mismo. Uno por uno, con su causa.",
        "etiqueta": "contados a mano el 21-sep, en el archivo",
    },
    {
        "layout": "R",
        "term_titulo": "lo que no me esperaba",
        "badge": "18 de 18",
        "term": ['<span class="ok">✓</span> los 18 los encontró él',
                 '<span class="g">revisando su propio trabajo</span>'],
        "titular": "Se corrige más de lo que creés.",
        "linea": "Ninguno lo cacé yo. Quedaron escritos por él,\nrevisando su propio trabajo.",
        "etiqueta": "el dato que cambia el miedo",
    },
    {
        "layout": "D",
        "contexto": "Y el que se le escapó llegó al cliente:",
        "remate": "Lo que nadie\nrevisó.",
        "sub": "La lección no es desconfiar de todo:\nlo que él revisa está bastante bien.\nLo que te muerde es lo que NADIE miró —\nni él, ni vos.",
        "cta_hl": "¿Cuántos «listo» diste por buenos sin abrirlos?",
        "cta_gris": "Contame abajo. Yo di tres seguidos.",
    },
    F_QUIEN_SOY,
]

PIEZAS = {
    "mi-stack": None,
    "fable": FABLE,
    "founders-bo": FOUNDERS_BO,
    "portada-f": PORTADA_F,
    "duelo-cuaderno": DUELO_CUADERNO,
    "vitamina-c": VITAMINA_C,
    "respuestas": RESPUESTAS,
    "comunidad-semana": COMUNIDAD_SEMANA,
    "onia-cuatro": ONIA_CUATRO,
    "repos": REPOS,
    "dia": DIA,
    "dia-founder": DIA_FOUNDER,
    "regla-74": REGLA_74,
    "tres-preguntas": TRES_PREGUNTAS,
    "falla-solo": FALLA_SOLO,
    "noticia-whatsapp": NOTICIA_WHATSAPP,
    "cuaderno-excel": CUADERNO_EXCEL,
    "app-escritorio": APP_ESCRITORIO,
    "agents-md": AGENTS_MD,
    "mismo-precio": MISMO_PRECIO,
    "instrumento-roto": INSTRUMENTO_ROTO,
    "dato-heredado": DATO_HEREDADO,
    "errores-18": ERRORES_18,
}  # mi-stack se resuelve a LAMINAS abajo

# Piel por pieza: una clase extra en el lienzo que habilita el acento de esa marca.
# Sergio Urcullo, 07-sep: "coloca mas cosas de claude, mas visuales, mas colores, que
# resalte, el inicio del carrusel se ve muy triste". El coral #D97757 NO es inventado:
# sale SAMPLEADO del PNG oficial del icono de Claude ya vendorizado en logos/ (su color
# mas frecuente despues del fondo).
#
# ⚠️ Esto llego a pintar tambien el FONDO de crema #F3E9D7, y el mismo dia lo rechazo:
# "mejor que todos sean blancos nomas, pero esta bien que uses ahi los colores naranjas
# de claude". La superficie es del patron; el color de marca entra como acento y nada mas.
# `--claude-crema` queda definida en tokens pero HOY NO LA USA NADIE: si vuelve a hacer
# falta, es esa. No reactivarla sin pedirselo.
FONDO = {"fable": "claude"}

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
:root{{--bg:#F5F5F7;--ink:#1D1D1F;--muted:#6E6E73;--verde:#00C661;--crema:#F5F1E8;--surface:#FFFFFF;--hairline:#D2D2D7;
  /* Colores de Anthropic, SAMPLEADOS del PNG oficial del icono de Claude que ya estaba
     vendorizado en logos/ — son sus dos colores mas frecuentes, no una aproximacion a ojo. */
  --claude-crema:#F3E9D7;--claude-coral:#D97757;--claude-hairline:#E3D6BE}}
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
/* La portada es la unica lamina cuyo trabajo es FRENAR el scroll: su cifra
   va mas grande que cualquier otra del carrusel. */
.remate.gancho{{font-size:196px;letter-spacing:-.045em;margin-top:14px}}
/* Palabra larga: "COMPUTADORA" a 126px mide 934px y el util son 888. Baja el cuerpo
   en vez de acortar la palabra — el copy manda sobre la tipografia, no al reves. */
.remate.largo{{font-size:104px}}
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
/* Layout R (repo) — el term de los decks yt-* traido al carrusel: el mock MUESTRA el
   mecanismo y el titular es el NOMBRE del repo (correccion 17-sep, tercera igual). */
.term-r{{width:850px;border-radius:30px;text-align:left;overflow:hidden;position:relative;
  background:linear-gradient(160deg,#26221F 0%,#1B1815 55%,#141210 100%);
  border:1px solid rgba(255,255,255,.10);
  box-shadow:0 34px 64px rgba(0,0,0,.30),0 0 70px rgba(217,119,87,.28)}}
.term-r-barra{{height:64px;display:flex;align-items:center;gap:13px;padding:0 28px;
  border-bottom:1px solid rgba(255,255,255,.12)}}
.term-r-barra i{{width:17px;height:17px;border-radius:50%;flex:none}}
.term-r-barra i:nth-child(1){{background:#FF5F57}}
.term-r-barra i:nth-child(2){{background:#FEBC2E}}
.term-r-barra i:nth-child(3){{background:#28C840}}
.term-r-barra .badge{{margin-left:auto;font-family:'OniaMono',monospace;font-size:23px;
  font-weight:700;color:#0A2A18;background:#3ECF6E;border-radius:999px;padding:6px 18px}}
.term-r-barra em{{font-style:normal;font-family:'OniaMono',monospace;font-size:26px;
  color:rgba(255,255,255,.52);margin-left:8px}}
.term-r pre{{font-family:'OniaMono',monospace;font-size:38px;font-weight:500;line-height:1.7;
  padding:36px 42px 42px;color:#F2EFE9;margin:0;white-space:pre-line;letter-spacing:.01em}}
.term-r .cur{{display:inline-block;width:21px;height:44px;background:#FF8A5C;border-radius:4px;
  vertical-align:-8px;margin-left:10px;box-shadow:0 0 16px rgba(255,138,92,.8)}}
.term-r .p{{color:#FF8A5C;font-weight:700}}
.term-r .ok{{color:#3ECF6E}}
.term-r .g{{color:rgba(255,255,255,.45);font-weight:400}}
.term-r .no{{color:#FF6B63}}
.repo-r{{display:flex;align-items:center;gap:22px;margin-top:56px;
  font-family:'OniaMono',monospace;font-size:57px;font-weight:700;letter-spacing:-.02em}}
.repo-r .gh-mark{{width:76px;height:76px;flex:none}}
.repo-r .own{{color:#A1A1A6;font-weight:500}}
.repo-r.chico{{font-size:36px}}
/* Layout H (horario) — referencia @iampascio 17-sep: el calendario de bloques ES el
   contenido. El giro propio: DOS agendas en paralelo, la mia y la del sistema. */
.lienzo.h{{justify-content:flex-start;padding-top:88px}}
.h .tit-h{{font-size:64px;font-weight:800;letter-spacing:-.03em;line-height:1.06}}
.h .sub-h{{font-size:31px;color:var(--muted);margin-top:14px}}
.h .cal{{display:flex;gap:18px;margin-top:56px;width:100%;height:760px;flex:none}}
.h .horas{{width:88px;position:relative;flex:none}}
.h .hora{{position:absolute;right:10px;font-family:'OniaMono',monospace;font-size:21px;
  color:#A1A1A6;transform:translateY(-50%)}}
.h .col{{flex:1;position:relative;border-left:1px solid #E3E3E8}}
.h .col-tit{{position:absolute;top:-40px;left:0;right:0;text-align:center;
  font-family:'OniaMono',monospace;font-size:22px;font-weight:700;letter-spacing:.08em;
  text-transform:uppercase;color:#6E6E73}}
.h .blq{{position:absolute;left:10px;right:6px;border-radius:14px;padding:10px 16px;
  overflow:hidden;text-align:left}}
.h .blq b i{{font-style:normal;color:#1B8A4C}}
.h .blq b{{display:block;font-size:24px;font-weight:700;letter-spacing:-.01em;line-height:1.15}}
.h .blq span{{display:block;font-family:'OniaMono',monospace;font-size:18px;color:rgba(0,0,0,.45);margin-top:2px}}
.h .blq.sys{{border:2px solid #2FBF71;background:#D9F2E2}}
.h .rem-h{{margin-top:40px;font-size:37px;font-weight:700;letter-spacing:-.02em}}
.h .rem-h .vd{{background:#2FBF71;color:#08210F;border-radius:12px;padding:2px 14px}}

.repo-r.chico .gh-mark{{width:60px;height:60px}}
/* Layout P (portada impact) — patron extraido de Pinterest el 17-sep: fondo de color
   pleno (la grilla clara de IG hace que el oscuro FRENE), tipografia display gigante,
   UN objeto con glow, badge de contexto y flecha de swipe. Portada oscura + interior
   claro es el contraste que abre el carrusel. */
.lienzo.p{{background:linear-gradient(155deg,#26221F 0%,#1B1815 52%,#131110 100%);
  justify-content:center;text-align:left;align-items:flex-start;padding:96px 96px 170px}}
.lienzo.p::after{{content:'';position:absolute;right:-220px;top:-220px;width:760px;height:760px;
  border-radius:50%;background:radial-gradient(circle,rgba(217,119,87,.34) 0%,rgba(217,119,87,0) 68%)}}
.p .pill-p{{display:inline-block;font-family:'OniaMono',monospace;font-size:26px;font-weight:700;
  letter-spacing:.1em;text-transform:uppercase;color:#08210F;background:#3ECF6E;
  border-radius:999px;padding:12px 28px;position:relative;z-index:2}}
.p .pill-p.rojo{{background:#FF6B63;color:#2A0806}}
.p .pill-p.naranja{{background:#FF8A5C;color:#2A1206}}
.p .tit-p{{font-size:128px;font-weight:800;line-height:.98;letter-spacing:-.045em;color:#F5F1E8;
  margin-top:44px;position:relative;z-index:2}}
.p .tit-p em{{font-style:normal;color:#FF8A5C}}
.p .obj-p{{margin-top:56px;position:relative;z-index:2;display:flex;align-items:center;gap:36px}}
.p .obj-p svg{{width:230px;height:230px;
  filter:drop-shadow(0 30px 56px rgba(0,0,0,.5)) drop-shadow(0 0 60px rgba(255,138,92,.4))}}
/* 560px + fuente 34px = ~22 caracteres por linea, NO los ~31 del layout R.
   Una linea mas larga envuelve y deja la palabra huerfana contra el margen
   izquierdo. Ninguno de los dos gates lo ve: no hay desborde, hay un salto
   feo. Visto el 21-sep en las portadas de dato-heredado y errores-18. */
.p .obj-p .term-r{{width:560px;margin:0}}
.p .obj-p .term-r pre{{font-size:34px;padding:26px 32px 32px}}
.p .swipe-p{{position:absolute;right:96px;bottom:150px;display:flex;align-items:center;gap:16px;
  font-size:30px;font-weight:700;color:#F5F1E8;opacity:.85;z-index:2}}
.p .swipe-p b{{font-size:44px;color:#FF8A5C}}
/* left:96px — el handle heredaba `left:0` y la arroba quedaba PEGADA al borde
   del lienzo (visto mirando la portada, el gate no mide margenes). 96px es el
   mismo canal que usa la pildora de arriba, asi la firma se alinea con ella. */
.p .handle{{left:96px;right:auto;text-align:left;color:#F5F1E8;opacity:.55}}
.tit-r{{font-size:64px;font-weight:800;letter-spacing:-.03em;margin-top:52px}}
.linea-r{{font-size:33px;color:var(--muted);line-height:1.42;margin-top:24px;
  white-space:pre-line;max-width:850px}}
.sub{{font-size:38px;color:var(--muted);line-height:1.4;margin-top:30px;
  white-space:pre-line;letter-spacing:-.01em}}
/* chip en su propia linea: en linea con el texto gris la frase se partia en dos y el
   chip quedaba descentrado contra una segunda linea centrada. */
/* Tira de iconos para la portada: muestra en la lámina 1 TODO lo que viene adentro.
   Es lo que convierte una portada en una promesa — el ojo cuenta los objetos y quiere
   saber cuál es cuál, y eso es exactamente el swipe. */
.tira{{display:flex;gap:26px;justify-content:center;align-items:center;margin-top:64px;
  flex-wrap:wrap}}
.tira > *{{width:96px;height:96px;flex:0 0 auto;
  filter:drop-shadow(0 10px 20px rgba(0,0,0,.13))}}
.tira > * > svg{{width:100%;height:100%}}
.cta{{margin-top:70px;font-size:40px;color:var(--muted);letter-spacing:-.01em}}
.cta .hl{{display:inline-block;margin-bottom:22px}}
.cta-gris{{display:block}}
/* layout A — grilla comparativa 3xN (referencia #1 del batch: Claude/ChatGPT/Gemini,
   DY/DWY/DFY, Stripe/Paypal/Hotmart). El divisor hairline entre filas es lo que la hace
   leer como TABLA y no como collage: sin el, nueve objetos sueltos son ruido.
   Es el layout mas caro del patron — pide 9 objetos con altura optica pareja. */
/* Nueve objetos + tres filas de etiquetas + titulo NO entran a tamano de portada. La
   primera version desbordo por abajo: la fila 3 quedaba cortada y su etiqueta chocaba
   con el handle, y el titulo se iba a TRES lineas (la FICHA manda maximo dos). Todo el
   bloque esta calibrado para cerrar dentro de los 1350px con aire. */
.lienzo.a{{justify-content:center;padding:74px 88px 132px}}
.titulo-a{{font-size:70px;font-weight:{peso};font-variation-settings:{vf};
  letter-spacing:-.03em;line-height:1.06;color:var(--ink);white-space:pre-line;
  margin-bottom:20px}}
.fila-a{{display:grid;grid-template-columns:repeat(3,1fr);gap:30px;width:100%;
  padding:42px 0;border-top:1px solid var(--hairline)}}
.fila-a.primera{{border-top:none}}
.celda-a{{display:flex;flex-direction:column;align-items:center;gap:16px}}
/* altura FIJA: nueve objetos de proporciones distintas solo leen parejos si comparten caja.
   ⚠️ `object-fit` NO aplica a un <svg> en linea —solo a elementos reemplazados como <img>—
   asi que los squircles desbordaban su caja, se comian las etiquetas de su fila y pisaban
   la fila de abajo. El <svg> se acota con height/width propios, no con object-fit. */
.celda-a .obj-a{{height:170px;width:100%;display:flex;align-items:center;
  justify-content:center;filter:drop-shadow(0 14px 26px rgba(0,0,0,.13))}}
.celda-a .obj-a > svg{{height:100%;width:auto;max-width:100%}}
.celda-a img.obj-a{{object-fit:contain}}
.celda-a .rotulo-a{{font-size:38px;font-weight:{peso};font-variation-settings:{vf};
  letter-spacing:-.02em;color:var(--ink);text-align:center}}
/* layout B — grilla 2x2 con el objeto encajonado (referencia #2 del batch). Cada celda
   es una tarjeta blanca con filo: eso separa los objetos entre si sin dibujar divisores,
   y hace que una foto y un icono dibujado convivan sin pelearse. */
/* Piel de la pieza de Claude: SOLO el acento, el fondo queda en el gris del patron.
   ⚠️ El 07-sep esto pinto ademas el fondo entero de crema #F3E9D7 y Sergio Urcullo lo
   rechazo en el mismo dia: "mejor que todos sean blancos nomas, pero esta bien que uses
   ahi los colores naranjas de claude". El color de marca entra como ACENTO, no como
   superficie — que es como lo usa el patron con todo lo demas.
   El coral reemplaza al verde de Onia SOLO en esta pieza: el verde es de la casa y este
   carrusel habla de un producto ajeno. */
.lienzo.claude .hl{{background:var(--claude-coral);color:#FFFFFF}}
.lienzo.claude .barra.gana .cana{{background:var(--claude-coral)}}
.lienzo.claude .barra.gana .val{{color:var(--claude-coral)}}
.lienzo.claude .barra.gana .rot{{color:var(--ink)}}
/* Remate en coral para las laminas de dato puro: sin esto quedaban tres pantallas
   seguidas de tinta sobre crema y el color desaparecia del carrusel a la mitad. */
.lienzo.claude .remate.acento{{color:var(--claude-coral)}}
/* Portada: el icono de Claude arriba del titulo. Es la lamina que decide si alguien mira
   el resto, y sin la marca era un cartel de texto que no decia de quien habla. */
.marca-portada{{width:244px;height:244px;margin-bottom:40px;
  filter:drop-shadow(0 22px 40px rgba(148,96,64,.24))}}
.marca-portada svg{{width:100%;height:100%}}
.coral{{color:var(--claude-coral)}}
.tachado{{text-decoration:line-through;text-decoration-thickness:4px;
  text-decoration-color:var(--claude-coral)}}
/* Adelanto de cifras en la portada. Mismo truco que la tira de iconos de "Mi stack": la
   portada deja de ENUNCIAR y pasa a PROMETER — el ojo ve tres numeros que no entiende
   todavia y desliza para saber de que son. Ademas llena el tercio inferior, que con solo
   titulo y chip quedaba muerto y era la mitad de lo que hacia ver "triste" la lamina. */
.adelanto{{display:flex;gap:56px;justify-content:center;align-items:flex-start;
  margin-top:66px;padding-top:44px;border-top:1px solid var(--hairline);width:100%}}
.adelanto .celda{{flex:1;max-width:236px}}
.adelanto .cifra{{font-size:70px;font-weight:{peso};font-variation-settings:{vf};
  letter-spacing:-.035em;color:var(--claude-coral);line-height:1}}
.adelanto .que{{font-family:'OniaMono',monospace;font-size:22px;font-weight:500;
  letter-spacing:.06em;text-transform:uppercase;color:#A1A1A6;margin-top:14px;
  line-height:1.3;white-space:pre-line}}
/* layout G — barras comparativas. Nace el 07-sep de "el de claude siento que esta muy
   pobre, intenta colocarles mas cosas de valor y mas visuales": el carrusel de Fable era
   siete laminas y seis eran texto centrado. Un porcentaje escrito se lee; un porcentaje
   dibujado se COMPARA, que es justo lo que la pieza necesita hacer.
   ⚠️ La altura es proporcional al valor desde CERO (`v / max * 100%`). Recortar la base
   para "que se note mas la diferencia" es el truco de grafico mentiroso mas comun que
   existe, y en una pieza que presume de datos verificados seria el peor lugar para usarlo. */
.lienzo.g{{justify-content:center;padding:96px 96px 150px}}
.titulo-g{{font-size:62px;font-weight:{peso};font-variation-settings:{vf};
  letter-spacing:-.03em;line-height:1.06;color:var(--ink);white-space:pre-line}}
.sub-g{{font-size:34px;color:var(--muted);line-height:1.35;margin-top:18px;
  letter-spacing:-.01em;white-space:pre-line}}
.barras{{display:flex;align-items:flex-end;justify-content:center;gap:38px;
  height:560px;width:100%;margin-top:56px}}
.barra{{flex:1;max-width:180px;display:flex;flex-direction:column;
  justify-content:flex-end;height:100%}}
.barra .val{{font-size:50px;font-weight:{peso};font-variation-settings:{vf};
  letter-spacing:-.03em;color:var(--muted);margin-bottom:18px;flex-shrink:0}}
/* ⚠️ Corregido el 10-sep, encontrado MIRANDO el render (el gate no lo mide): la cana
   iba con height:% dentro de una columna que tambien contiene el rotulo. Un rotulo de
   DOS lineas (GPT-5.6/SOL) levantaba su barra ~29px — la de 22,4 rendia MAS ALTA que
   la de 24,7 — y en la columna ganadora (val+560+rot > 560px) el flex ENCOGIA la cana:
   ni las bases alineadas ni las alturas proporcionales, en la pieza que presume de
   datos. Ahora: altura en PX desde Python (v/tope*390), cana sin shrink, y el rotulo
   con min-height de dos lineas para que TODAS las barras apoyen en la misma base. */
.barra .cana{{width:100%;background:var(--hairline);border-radius:22px 22px 10px 10px;
  flex:0 0 auto}}
.barra .rot{{font-family:'OniaMono',monospace;font-size:22px;font-weight:500;
  letter-spacing:.04em;text-transform:uppercase;color:#A1A1A6;margin-top:22px;
  line-height:1.3;white-space:pre-line;min-height:58px;flex-shrink:0}}
/* El ganador en tinta plena. NO en verde: el verde es de la marca Onia y esta pieza
   habla de un producto ajeno — pintar a Anthropic con el color de la casa confunde
   de quien es el logro. */
.barra.gana .val{{color:var(--ink);font-size:60px}}
.barra.gana .cana{{background:var(--ink)}}
.barra.gana .rot{{color:var(--ink)}}
.pie-g{{font-family:'OniaMono',monospace;font-size:22px;font-weight:500;
  letter-spacing:.06em;text-transform:uppercase;color:#A1A1A6;margin-top:44px}}
.lienzo.b{{justify-content:center;padding:96px 96px 150px}}
.titulo-b{{font-size:96px;font-weight:{peso};font-variation-settings:{vf};
  letter-spacing:-.032em;line-height:1;color:var(--ink);margin-bottom:78px}}
.grilla{{display:grid;grid-template-columns:1fr 1fr;gap:60px 56px;width:100%}}
.celda{{display:flex;flex-direction:column;align-items:center;gap:26px}}
.caja{{width:100%;height:300px;background:var(--surface);border:1px solid var(--hairline);
  border-radius:26px;display:flex;align-items:center;justify-content:center;
  overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.06)}}
.caja img,.caja svg{{max-width:88%;max-height:88%;object-fit:contain}}
.rotulo{{font-size:52px;font-weight:{peso};font-variation-settings:{vf};
  letter-spacing:-.02em;color:var(--ink)}}
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
/* Chip de accion bajo el subtitulo. Es la unica lamina del carrusel que le pide algo al
   lector ademas del comentario, asi que lleva el verde de marca: acá sí es Onia hablando. */
.f .cta-f{{margin-top:30px}}
.f .cta-f .hl{{font-size:38px;display:inline-block}}
/* La foto sale del flujo y se apoya en el borde inferior: a sangre, como la referencia. */
.f .foto{{position:absolute;left:50%;transform:translateX(-50%);bottom:0;
  max-height:72%;width:auto;object-fit:contain;object-position:bottom}}
/* El handle centrado caia ENCIMA del polo azul marino y no se leia.
   ⚠️ Mandarlo al margen derecho NO lo arreglo, solo lo movio: medido en el render del
   07-sep, a la altura del handle la foto ocupa de x=94 a x=984, o sea TODO el ancho util
   — no hay franja de fondo abajo, y el gris quedaba igual sobre el azul, encima pegado
   al logo bordado del polo.
   Se deja sobre la foto y se invierte el color: blanco sobre azul marino lee, y lee como
   firma puesta a proposito. `left` en vez de `right` lo aleja del bordado del pecho. */
.f .handle{{left:110px;right:auto;text-align:left;bottom:56px;color:#FFFFFF;opacity:.78}}
.handle{{position:absolute;bottom:76px;left:0;right:0;font-family:'OniaMono',monospace;
  font-size:23px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;
  color:#A1A1A6}}"""


def _clases(lamina):
    """Clases del lienzo: el layout (los que traen grilla propia) y el fondo de la pieza."""
    c = ["lienzo"]
    if lamina["layout"] in ("A", "B", "C", "F", "G", "H", "P"):
        c.append(lamina["layout"].lower())
    if lamina.get("fondo"):
        c.append(lamina["fondo"])
    return " ".join(c)


def markup(lamina):
    if lamina["layout"] == "A":
        filas = []
        for n, fila in enumerate(lamina["filas"]):
            celdas = []
            for c in fila:
                if c.get("icono"):
                    cuerpo = f'<div class="obj-a">{ICONOS[c["icono"]]}</div>'
                elif c.get("dibujo"):
                    cuerpo = f'<div class="obj-a">{DIBUJOS[c["dibujo"]]()}</div>'
                else:
                    obj = OBJETOS / c["objeto"]
                    if not obj.exists():
                        raise SystemExit(f"Falta el objeto {obj}. Corré buscar-objetos.py.")
                    cuerpo = f'<img class="obj-a" src="{obj.as_uri()}">'
                celdas.append(f'<div class="celda-a">{cuerpo}'
                              f'<div class="rotulo-a">{c["rotulo"]}</div></div>')
            clase = "fila-a primera" if n == 0 else "fila-a"
            filas.append(f'<div class="{clase}">{"".join(celdas)}</div>')
        return (f'<div class="display titulo-a">{lamina["titulo"]}</div>'
                f'{"".join(filas)}')
    if lamina["layout"] == "G":          # barras comparativas
        tope = max(b["valor"] for b in lamina["barras"])
        cols = []
        for b in lamina["barras"]:
            gana = " gana" if b.get("gana") else ""
            # px, no %: el % era relativo a la columna entera (val+cana+rot) y mentia.
            # 390px es el techo del ganador: 90 (val) + 390 + 80 (rot) = 560 justos.
            alto = b["valor"] / tope * 390
            val = f'{b["valor"]:.1f}'.replace(".", ",") + lamina.get("unidad", "%")
            cols.append(f'<div class="barra{gana}"><div class="val">{val}</div>'
                        f'<div class="cana" style="height:{alto:.0f}px"></div>'
                        f'<div class="rot">{b["rotulo"]}</div></div>')
        sub = f'<div class="sub-g">{lamina["sub"]}</div>' if lamina.get("sub") else ""
        return (f'<div class="titulo-g">{lamina["titulo"]}</div>{sub}'
                f'<div class="barras">{"".join(cols)}</div>'
                f'<div class="pie-g">{lamina["fuente"]}</div>')
    if lamina["layout"] == "B":
        celdas = []
        for c in lamina["celdas"]:
            if c.get("icono"):
                cuerpo = ICONOS[c["icono"]]
            elif c.get("dibujo"):
                cuerpo = DIBUJOS[c["dibujo"]]()
            else:
                obj = OBJETOS / c["objeto"]
                if not obj.exists():
                    raise SystemExit(f"Falta el objeto {obj}. Corré buscar-objetos.py.")
                cuerpo = f'<img src="{obj.as_uri()}">'
            celdas.append(f'<div class="celda"><div class="caja">{cuerpo}</div>'
                          f'<div class="rotulo">{c["rotulo"]}</div></div>')
        return (f'<div class="titulo-b">{lamina["titulo"]}</div>'
                f'<div class="grilla">{"".join(celdas)}</div>')
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
        cta = (f'<div class="cta-f"><span class="hl">{lamina["cta"]}</span></div>'
               if lamina.get("cta") else "")
        return (f'<div class="display nombre-f">{lamina["nombre"]}</div>'
                f'<div class="sub-f">{lamina["sub"]}</div>{cta}'
                f'<img class="foto" src="{foto.as_uri()}">')
    if lamina["layout"] == "D":
        gancho = " gancho" if lamina.get("gancho") else ""
        acento = " acento" if lamina.get("acento") else ""
        acento += " largo" if lamina.get("largo") else ""
        marca = (f'<div class="marca-portada">{ICONOS[lamina["marca"]]}</div>'
                 if lamina.get("marca") else "")
        cuerpo = (f'{marca}<div class="contexto">{lamina["contexto"]}</div>'
                  f'<div class="display remate{gancho}{acento}">{lamina["remate"]}</div>')
        if lamina.get("pie"):
            cuerpo += f'<div class="pie">{lamina["pie"]} <span class="hl">{lamina["pie_hl"]}</span></div>'
        if lamina.get("sub"):
            cuerpo += f'<div class="sub">{lamina["sub"]}</div>'
        if lamina.get("adelanto"):
            celdas = "".join(
                f'<div class="celda"><div class="cifra">{c["cifra"]}</div>'
                f'<div class="que">{c["que"]}</div></div>' for c in lamina["adelanto"])
            cuerpo += f'<div class="adelanto">{celdas}</div>'
        if lamina.get("tira"):
            iconos = "".join(ICONOS[i] for i in lamina["tira"])
            cuerpo += f'<div class="tira">{iconos}</div>'
        if lamina.get("cta_hl"):
            cuerpo += (f'<div class="cta"><span class="hl">{lamina["cta_hl"]}</span>'
                       f'<span class="cta-gris">{lamina["cta_gris"]}</span></div>')
        return cuerpo
    if lamina["layout"] == "P":
        pill_clase = " " + lamina["pill_color"] if lamina.get("pill_color") else ""
        cuerpo = f'<div class="pill-p{pill_clase}">{lamina["pill"]}</div>'
        cuerpo += f'<div class="tit-p">{lamina["titulo"]}</div>'
        if lamina.get("obj_icono"):
            cuerpo += f'<div class="obj-p">{ICONOS[lamina["obj_icono"]]}</div>'
        elif lamina.get("obj_term"):
            lineas_p = "\n".join(lamina["obj_term"])
            cuerpo += (f'<div class="obj-p"><div class="term-r">'
                       f'<div class="term-r-barra"><i></i><i></i><i></i>'
                       f'<em>{lamina.get("obj_term_titulo", "")}</em></div>'
                       f'<pre>{lineas_p}</pre></div></div>')
        cuerpo += '<div class="swipe-p">deslizá <b>&rarr;</b></div>'
        return cuerpo
    if lamina["layout"] == "H":
        def _col(bloques):
            html = ""
            for ini, fin, txt, color, es_sys in bloques:
                top = (ini - 6) * 42          # escala: 06:00 arriba, 52px por hora
                alto = max((fin - ini) * 42 - 6, 40)
                clase = "blq sys" if es_sys else "blq"
                estilo = f"top:{top}px;height:{alto}px"
                if not es_sys:
                    estilo += f";background:{color}"
                horas_txt = f"{int(ini):02d}:{int(ini % 1 * 60):02d} – {int(fin):02d}:{int(fin % 1 * 60):02d}"
                tick = " <i>✓</i>" if es_sys else ""
                html += (f'<div class="{clase}" style="{estilo}">'
                         f"<b>{txt}{tick}</b><span>{horas_txt}</span></div>")
            return html
        horas = "".join(f'<div class="hora" style="top:{(h-6)*42}px">{h:02d}:00</div>'
                        for h in range(6, 25, 3))
        return (f'<div class="tit-h">{lamina["titulo"]}</div>'
                f'<div class="sub-h">{lamina["sub"]}</div>'
                f'<div class="cal"><div class="horas">{horas}</div>'
                f'<div class="col"><div class="col-tit">yo</div>{_col(lamina["yo"])}</div>'
                f'<div class="col"><div class="col-tit">el sistema</div>{_col(lamina["sistema"])}</div>'
                f'</div><div class="rem-h">{lamina["rem"]}</div>')
    if lamina["layout"] == "R":
        # Layout R (repo) — correccion de Sergio Urcullo del 17-sep, la TERCERA igual:
        # "en lugar de 'lo oficial' directo el nombre, y cosas que muestren de que se
        # refieren; se ve muy simple". El titular es el NOMBRE del repo y arriba va un
        # mock de terminal que MUESTRA el mecanismo (el mismo term de los decks yt-*).
        lineas = "\n".join(lamina["term"])
        badge = lamina.get("badge", "gratis")
        cab = (f'<div class="term-r"><div class="term-r-barra"><i></i><i></i><i></i>'
               f'<em>{lamina["term_titulo"]}</em>')
        if badge:
            cab += f'<span class="badge">{badge}</span>'
        cab += f'</div><pre>{lineas}<span class="cur"></span></pre></div>'
        if lamina.get("own"):
            cab += (f'<div class="repo-r{" chico" if lamina.get("chico") else ""}">'
                    f'<svg class="gh-mark" viewBox="0 0 256 256">{_marca("github", "#1D1D1F")}</svg>'
                    f'<span><b class="own">{lamina["own"]}/</b>{lamina["repo"]}</span></div>')
        else:
            cab += f'<div class="tit-r">{lamina["titular"]}</div>'
        return (cab + f'<div class="linea-r">{lamina["linea"]}</div>'
                f'<div class="etiqueta">{lamina["etiqueta"]}</div>')
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
                f"<body><div class='{_clases(lamina)}'>{markup(lamina)}"
                f"<div class='handle'>{_handle_actual}</div></div></body></html>")
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
    document.querySelectorAll('.remate,.nombre,.precio,.desc,.contexto,.pie,.sub,.cta,.etiqueta,.nombre-f,.sub-f,.titulo-c,.dato,.titulo-b,.rotulo,.titulo-a,.rotulo-a,.nom,.bio,.titulo-g,.sub-g,.val,.rot,.pie-g,.cta-f,.cifra,.que')
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
                f"{sonda}</head><body><div class='{_clases(lamina)}'>{markup(lamina)}"
                f"<div class='handle'>{_handle_actual}</div></div></body></html>")
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
    if args.pieza in FONDO:      # copia, no mutacion: los dicts de arriba son la fuente
        laminas = [{**l, "fondo": FONDO[args.pieza]} for l in laminas]

    global _handle_actual
    _handle_actual = HANDLES.get(args.pieza, HANDLE)

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
