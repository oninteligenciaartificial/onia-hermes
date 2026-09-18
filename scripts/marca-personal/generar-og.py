#!/usr/bin/env python3
"""Imágenes de compartir (Open Graph) del sitio sergiourcullo.

POR QUE EXISTE
Hasta el 10-sep las paginas de la web no tenian `og:image`: pegar
sergiourcullo.vercel.app/homelab en WhatsApp o en un DM mostraba un link PELADO. Y ese link
es justo el que se le manda a cada persona que comenta una palabra — o sea, el arte que mas
gente ve del carril, y el unico que faltaba.

Es un script aparte de `generar-apple-editorial.py` a proposito: aquel esta calibrado para
1080x1350 (4:5 de Instagram) y su gate mide contra ese ancho util. Meter 1200x630 adentro
obligaba a parametrizar el lienzo, el gate y los seis layouts para ganar nada.

TIPOGRAFIA: Inter autohospedada, la misma de los carruseles. El sitio usa Archivo para los
titulos, pero Archivo no esta vendorizado y NO se baja de Google Fonts en tiempo de render
(regla de la casa: la captura sale antes que la webfont y todo cae al fallback). Inter da
ademas continuidad con lo que la gente ya vio en el feed.

Uso:
  python scripts/marca-personal/generar-og.py
  python scripts/marca-personal/generar-og.py --solo homelab
"""
import argparse
import base64
import glob
import os
import subprocess
import tempfile
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
SITIO = REPO / "hermes-content/sitio-sergiourcullo"
FUENTE = REPO / "hermes-content/references/ui-patterns/apple-editorial/fonts/Inter-var-latin.woff2"
MONO = REPO / "hermes-content/brand/fonts/SplineSansMono-var-latin.woff2"

ANCHO, ALTO = 1200, 630

# Verde de marca. Igual que en el sitio, va en DOS tonos y por el mismo motivo: #00C661
# sobre fondo claro no lee como texto (~1,7:1), asi que ahi va #007A44.
ONIA = "#00C661"
ONIA_TEXTO = "#007A44"

PIEZAS = {
    "index": {
        "salida": "og.png",
        "rotulo": "sergiourcullo.com",
        "titulo": 'Lo que uso, cómo se instala,<br>y lo que <span class="v">no</span> hace',
        "bajada": "Guías completas de automatización para negocios. Sin vender nada.",
        "pie": "16 años · 6 herramientas · 5 gratis",
    },
    "stack": {
        "salida": "stack/og.png",
        "rotulo": "Guía · sergiourcullo.com",
        "titulo": 'El stack de <span class="v">$200</span>',
        "bajada": "Las seis herramientas con las que corre mi negocio, en el orden en que conviene instalarlas.",
        "pie": "Cinco son gratis · qué hace y qué NO hace cada una",
    },
    "vps": {
        "salida": "vps/og.png",
        "rotulo": "Guía · sergiourcullo.com",
        "titulo": 'Qué es un <span class="v">VPS</span>',
        "bajada": "Una computadora alquilada, prendida siempre. Cuánto cuesta el mío y cómo se arma.",
        "pie": "VPS o servidor en casa · qué poner adentro · el error que me costó una noche",
    },
    "homelab": {
        "salida": "homelab/og.png",
        "rotulo": "Guía · sergiourcullo.com",
        "titulo": 'El <span class="v">homelab</span>',
        "bajada": "Un servidor en tu casa hecho con una computadora que ya no usás.",
        "pie": "Cuánto gasta de luz · qué corre adentro · cómo armarlo",
    },
}


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


def _woff2(ruta: Path) -> str:
    """Fuente embebida como data URI: con file:// la carga es sincronica y la captura no
    puede salir antes que la tipografia. Es la trampa que ya nos costo un A/B entero."""
    if not ruta.exists():
        raise SystemExit(f"Falta la fuente {ruta}")
    return base64.b64encode(ruta.read_bytes()).decode()


def html(p: dict) -> str:
    return f"""<!doctype html><meta charset="utf-8"><style>
@font-face{{font-family:'Inter';src:url(data:font/woff2;base64,{_woff2(FUENTE)}) format('woff2');
  font-weight:100 900;font-display:block}}
@font-face{{font-family:'OniaMono';src:url(data:font/woff2;base64,{_woff2(MONO)}) format('woff2');
  font-weight:100 900;font-display:block}}
*{{margin:0;padding:0;box-sizing:border-box}}
html,body{{width:{ANCHO}px;height:{ALTO}px}}
body{{background:#FBFBFC;font-family:'Inter',sans-serif;-webkit-font-smoothing:antialiased;
  display:flex;flex-direction:column;justify-content:center;
  padding:78px 82px;position:relative;overflow:hidden}}
/* Banda de marca al borde izquierdo: es lo unico que se reconoce a tamano de miniatura
   en una lista de chats, donde la imagen entra a ~200px de ancho. */
.banda{{position:absolute;left:0;top:0;bottom:0;width:16px;background:{ONIA}}}
.rotulo{{font-family:'OniaMono',monospace;font-size:20px;font-weight:500;letter-spacing:.14em;
  text-transform:uppercase;color:#8A93A0;margin-bottom:26px}}
h1{{font-size:74px;font-weight:800;letter-spacing:-.035em;line-height:1.04;color:#14161A}}
h1 .v{{color:{ONIA_TEXTO}}}
.bajada{{font-size:27px;color:#5B6470;line-height:1.4;margin-top:24px;max-width:24ch;
  letter-spacing:-.01em}}
.pie{{position:absolute;left:82px;bottom:58px;font-family:'OniaMono',monospace;font-size:19px;
  font-weight:500;letter-spacing:.05em;color:#8A93A0}}
.marca{{position:absolute;right:82px;bottom:52px;display:flex;align-items:center;gap:14px}}
.marca .tile{{width:52px;height:52px;border-radius:13px;background:{ONIA};
  display:flex;align-items:center;justify-content:center;
  font-size:29px;font-weight:800;color:#0A2A18;letter-spacing:-.03em}}
.marca .nom{{font-size:22px;font-weight:600;color:#14161A;letter-spacing:-.02em}}
</style>
<div class="banda"></div>
<p class="rotulo">{p['rotulo']}</p>
<h1>{p['titulo']}</h1>
<p class="bajada">{p['bajada']}</p>
<p class="pie">{p['pie']}</p>
<div class="marca"><span class="tile">S</span><span class="nom">sergiourcullo</span></div>
"""


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--solo", choices=list(PIEZAS))
    args = ap.parse_args()

    chrome = _chrome()
    piezas = {args.solo: PIEZAS[args.solo]} if args.solo else PIEZAS

    for nombre, p in piezas.items():
        destino = SITIO / p["salida"]
        destino.parent.mkdir(parents=True, exist_ok=True)
        with tempfile.NamedTemporaryFile("w", suffix=".html", delete=False, encoding="utf-8") as f:
            f.write(html(p))
            tmp = f.name
        subprocess.run(
            [chrome, "--headless", "--disable-gpu", "--no-sandbox", "--hide-scrollbars",
             "--force-device-scale-factor=1", f"--window-size={ANCHO},{ALTO}",
             # Chrome exige ruta ABSOLUTA en --screenshot: con una relativa no escribe
             # nada y termina con codigo 0, o sea falla en silencio.
             f"--screenshot={destino}", Path(tmp).as_uri()],
            check=True, capture_output=True, timeout=90,
        )
        os.unlink(tmp)
        if not destino.exists() or destino.stat().st_size == 0:
            raise SystemExit(f"Chrome no escribio {destino}")
        print(f"  {p['salida']:<20} {destino.stat().st_size // 1024} KB")

    print(f"OK -> {SITIO}")


if __name__ == "__main__":
    main()
