#!/usr/bin/env python3
"""CARRUSEL "Mi stack" — patron apple-editorial (8 laminas 1080x1350).

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

OBJETOS: squircle app-icon dibujado en SVG, no arte generativo. Las referencias 1/5/6/7
usan iconos de aplicacion, no renders 3D: el SVG da nitidez exacta a 1080px, control del
radio y de la sombra, y costo cero. El arte generado se reserva para los layouts B y C,
que si piden objetos reales (taza, reloj).

TIPOGRAFIA: A/B sin veredicto. `--tipografia inter` (fidelidad con las refs) vs
`archivo` (la de marca, §7). SF Pro no se puede empaquetar: licencia Apple restringida
a desarrollo en sus plataformas. NO adoptar ninguna hasta que Sergio Urcullo mire.

CIFRAS: las de precio salen de ONIA_ESTRATEGIA_DE_EMPRESA.md §8.1 (tabla de estructura
de costos), no de memoria. Si cambian ahi, se recalculan aca — no se corrigen a mano.

CTA: pide respuesta humana a proposito. La cuenta @sergio_urcullo tiene `palabras: {}`
en el workflow n8n activo de private-reply (medido 2026-09-04): un "Comenta X" ahi no
entrega nada y no deja registro.

Uso:
  python scripts/marca-personal/generar-apple-editorial.py [--tipografia inter|archivo]
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


def _starburst(color="#fff", n=12, largo=74, ancho=15):
    # Rafaga radial de rayos redondeados. Se dibuja con rects rotados en vez de un
    # path: mismo resultado y se puede leer al editarlo.
    return "".join(
        f'<rect x="{128 - ancho / 2}" y="{128 - largo}" width="{ancho}" height="{largo}" '
        f'rx="{ancho / 2}" fill="{color}" transform="rotate({i * 360 / n} 128 128)"/>'
        for i in range(n)
    )


def _server():
    filas = []
    for i in range(3):
        y = 68 + i * 47
        filas.append(f'<rect x="62" y="{y}" width="132" height="34" rx="9" fill="#fff" opacity="{1 - i * 0.18}"/>')
        filas.append(f'<circle cx="176" cy="{y + 17}" r="7" fill="#673DE6"/>')
    return "".join(filas)


ICONOS = {
    "claude": _squircle("#D97757", _starburst()),
    "vps": _squircle("#673DE6", _server()),
    # Fondo oscuro, no blanco: el squircle blanco sobre #F5F5F7 daba contraste casi nulo
    # y leia como una mancha flotante (visto en el render, no supuesto). El oscuro ademas
    # se parece mas al mark real de n8n.
    "n8n": _squircle(
        "#1A1A2E",
        '<path d="M78 128 H124 M132 96 H178 M132 160 H178" stroke="#EA4B71" stroke-width="11" stroke-linecap="round"/>'
        '<circle cx="70" cy="128" r="20" fill="#EA4B71"/>'
        '<circle cx="186" cy="96" r="16" fill="#EA4B71"/>'
        '<circle cx="186" cy="160" r="16" fill="#EA4B71"/>',
    ),
    "whatsapp": _squircle(
        "#25D366",
        '<path d="M128 60c-37 0-67 30-67 67 0 12 3 23 9 33l-10 36 37-10c10 5 21 8 31 8 37 0 67-30 67-67s-30-67-67-67z" fill="#fff"/>'
        '<path d="M104 100c-2-5-4-5-6-5h-5c-2 0-5 1-8 4-3 3-10 10-10 24s10 28 12 30c1 2 20 32 49 43 24 9 29 7 34 7 5-1 16-7 19-13 2-7 2-12 2-13-1-1-3-2-5-3l-19-9c-3-1-5-2-7 1l-7 9c-2 2-3 3-6 1-3-1-13-5-25-15-9-8-15-18-17-21-2-3 0-5 1-6l4-5c2-2 2-3 3-5s1-4 0-5l-9-19z" fill="#25D366"/>',
    ),
    "chatwoot": _squircle(
        "#1F93FF",
        '<path d="M128 62c-37 0-67 27-67 61 0 19 10 36 25 47v33l31-19c4 1 8 1 11 1 37 0 67-27 67-62s-30-61-67-61z" fill="#fff"/>',
    ),
    "hyperframes": _squircle(
        "#1D1D1F",
        '<rect x="58" y="72" width="140" height="112" rx="14" fill="none" stroke="#FFFFFF" stroke-width="10"/>'
        '<path d="M112 106 L152 128 L112 150 Z" fill="#FFFFFF"/>',
    ),
    "notion": _squircle(
        "#FFFFFF",
        '<path d="M92 176 V88 L164 176 V88" stroke="#1D1D1F" stroke-width="15" fill="none"'
        ' stroke-linecap="square" stroke-linejoin="miter"/>',
        borde="#D2D2D7",
    ),
    # Hermes lleva el verde de Onia y es el UNICO objeto que lo lleva: dice "esta es mia"
    # sin gastar una palabra. Relleno verde con glifo negro — el tratamiento de §7 que mide
    # 8,72:1; el verde como tinta reprueba AA.
    "hermes": _squircle(
        "#00C661",
        '<circle cx="128" cy="128" r="26" fill="#0A0A0A"/>'
        '<circle cx="70" cy="80" r="15" fill="#0A0A0A"/><circle cx="186" cy="80" r="15" fill="#0A0A0A"/>'
        '<circle cx="70" cy="176" r="15" fill="#0A0A0A"/><circle cx="186" cy="176" r="15" fill="#0A0A0A"/>'
        '<path d="M84 90 L112 114 M172 90 L144 114 M84 166 L112 142 M172 166 L144 142"'
        ' stroke="#0A0A0A" stroke-width="10" stroke-linecap="round"/>',
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
        "pie_hl": "Bs 0",
    },
    {
        "layout": "E",
        "icono": "claude",
        "nombre": "Claude Max",
        "desc": "La capa que piensa. Escribe el código, los textos\ny los sistemas. Es lo único caro, y es para construir:\nno para que el negocio funcione.",
        "precio": "Bs 2.304/mes",
    },
    {
        "layout": "E",
        "icono": "vps",
        # "Homelab" es la palabra que pidio Sergio Urcullo en lugar de "VPS Hostinger".
        # La bajada NO afirma que el hardware este en su casa —es un KVM alquilado—, asi
        # que el titulo usa el termino de la cultura self-hosted sin sostener un dato falso.
        "nombre": "Homelab",
        "desc": "4 vCPU, 16 GB, 41 contenedores corriendo.\nUn solo servidor que administro yo, y todo\nlo que viene abajo vive acá adentro.",
        "precio": "Bs 461/mes",
    },
    {
        "layout": "E",
        "icono": "n8n",
        "nombre": "n8n",
        "desc": "Las automatizaciones: embudo, seguimientos, avisos.\nCorre en mi servidor, así que no suma un peso.",
        "precio": "Bs 0",
        "etiqueta": "Open source",
    },
    {
        "layout": "E",
        "icono": "whatsapp",
        "nombre": "WhatsApp Business",
        "desc": "El canal donde se atiende. El transporte de Meta\nlo paga la cuenta del negocio, no yo.",
        "precio": "Bs 0",
    },
    # ⚠️ El plan de Notion NO esta verificado en ningun lado del repo. "Bs 0" asume plan
    # gratis y queda PENDIENTE de confirmacion de Sergio Urcullo: un precio sin verificar en
    # pieza publica es justo lo que prohibe la regla de fuente unica.
    {
        "layout": "E",
        "icono": "notion",
        "nombre": "Notion",
        "desc": "Donde vive cada decisión, cada documento y la\nbiblioteca de la comunidad. Un solo lugar, no doce.",
        "precio": "Bs 0",
        "etiqueta": "Plan gratis",
    },
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
        "precio": "Bs 0",
    },
    # El giro, justo antes del cierre: la unica del stack que escribio el, y encima abierta.
    # Hermes vive en hermes-content/deploy/hermes-agent/SOUL.md ("el jefe de gabinete de
    # Sergio"). Open source por decision de Sergio Urcullo (06-sep) — es su codigo y su
    # licencia. OJO: hoy no hay repo publico enlazable; si la lamina lo dice, alguien lo va
    # a pedir en los comentarios.
    {
        "layout": "E",
        "icono": "hermes",
        "nombre": "Hermes",
        "desc": "Mi jefe de gabinete, y lo escribí yo. Un agente que\nvive en el servidor con su propia memoria, coordina\nlos bots y me avisa cuando algo se rompe.",
        "precio": "Bs 0",
        "etiqueta": "Open source",
    },
    {
        "layout": "D",
        "contexto": "Siete herramientas, dos facturas",
        "remate": "Bs 2.765",
        "sub": "al mes. Y la parte grande es para construir,\nno para que el negocio siga funcionando.",
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
    for ruta in (woff2, MONO_WOFF2):
        if not ruta.exists():
            raise SystemExit(f"Falta la fuente {ruta}. Corré build-inter.py del patrón.")
    return f"""@font-face{{font-family:'{nombre}';src:url('{woff2.as_uri()}') format('woff2');
  font-weight:100 900;font-display:block}}
@font-face{{font-family:'OniaMono';src:url('{MONO_WOFF2.as_uri()}') format('woff2');
  font-weight:400 500;font-display:block}}
*{{margin:0;padding:0;box-sizing:border-box}}
:root{{--bg:#F5F5F7;--ink:#1D1D1F;--muted:#6E6E73;--verde:#00C661}}
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
.handle{{position:absolute;bottom:76px;left:0;right:0;font-family:'OniaMono',monospace;
  font-size:23px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;
  color:#A1A1A6}}"""


def markup(lamina):
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
            f'<div class="display precio">{lamina["precio"]}</div>{etiqueta}')


def render(tipo, out_dir):
    out_dir.mkdir(parents=True, exist_ok=True)
    chrome = _chrome()
    hoja = css(tipo)
    for i, lamina in enumerate(LAMINAS, 1):
        html = (f"<!doctype html><html><head><meta charset='utf-8'><style>{hoja}</style></head>"
                f"<body><div class='lienzo'>{markup(lamina)}"
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
    document.querySelectorAll('.remate,.nombre,.precio,.desc,.contexto,.pie,.sub,.cta,.etiqueta')
      .forEach(function(el){
        out.push('SONDA|' + el.className.replace(/display /,'') + '|' + Math.round(ancho(el)));
      });
    var d = document.createElement('div'); d.id = 'sonda'; d.textContent = out.join(' ');
    document.body.appendChild(d);
  });
});
</script>
""".replace("__FAM__", nombre)


def check(tipo):
    """Rinde cada lamina midiendo, y falla si algun texto pasa el ancho util."""
    chrome = _chrome()
    hoja = css(tipo)
    sonda = sonda_js(FUENTES[tipo][0])
    fallos = []
    for i, lamina in enumerate(LAMINAS, 1):
        html = (f"<!doctype html><html><head><meta charset='utf-8'><style>{hoja}</style>"
                f"{sonda}</head><body><div class='lienzo'>{markup(lamina)}"
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
    ap.add_argument("--out", default=None)
    ap.add_argument("--check", action="store_true",
                    help="solo mide desborde de texto, no rinde PNG")
    args = ap.parse_args()

    if args.check:
        print(f"gate de desborde · tipografia={args.tipografia} · util={UTIL}px")
        fallos = check(args.tipografia)
        for f in fallos:
            print(f"  DESBORDA  {f}")
        if fallos:
            raise SystemExit(f"{len(fallos)} desborde(s)")
        print(f"  OK · {len(LAMINAS)} laminas dentro del margen")
        return

    destino = Path(args.out) if args.out else OUT_BASE / f"apple-mi-stack-{args.tipografia}"
    print(f"apple-editorial · tipografia={args.tipografia} · {len(LAMINAS)} laminas")
    render(args.tipografia, destino)
    print(f"OK -> {destino}")


if __name__ == "__main__":
    main()
