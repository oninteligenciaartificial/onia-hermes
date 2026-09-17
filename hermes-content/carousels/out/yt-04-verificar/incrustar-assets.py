#!/usr/bin/env python3
"""Incrusta el logo y las fuentes DENTRO de deck.html, en base64.

Por que existe: el deck viaja solo — se manda por chat, por mail, se abre en otra
maquina. Al separarse de su carpeta se rompian el logo y las tres tipografias, y el
usuario ve un cuadrito roto sin ninguna pista de por que. Un archivo que se rompe al
moverlo no sirve como material de grabacion.

Es idempotente: reemplaza el bloque anterior si ya estaba incrustado. Se puede correr
las veces que haga falta despues de editar el texto del deck.

Uso:  python incrustar-assets.py
"""
import base64
import pathlib
import re
import sys

AQUI = pathlib.Path(__file__).resolve().parent
DECK = AQUI / "deck.html"

FUENTES = [
    ("Inter", "Inter-var-latin.woff2", "100 900"),
    ("Instrument Serif", "InstrumentSerif-latin.woff2", "400"),
    ("Spline Sans Mono", "SplineSansMono-var-latin.woff2", "100 700"),
]
LOGO = "claude.png"
ARTE = "arte-hook.jpg"

INICIO = "<!-- ASSETS_INLINE -->"
FIN = "<!-- /ASSETS_INLINE -->"


def b64(nombre: str) -> str:
    ruta = AQUI / nombre
    if not ruta.exists():
        sys.exit("Falta %s en %s" % (nombre, AQUI))
    return base64.b64encode(ruta.read_bytes()).decode("ascii")


def main() -> None:
    html = DECK.read_text(encoding="utf-8")

    caras = "\n".join(
        "@font-face{font-family:'%s';src:url(data:font/woff2;base64,%s) format('woff2');"
        "font-weight:%s;font-display:block}" % (fam, b64(arch), peso)
        for fam, arch, peso in FUENTES
    )
    # El logo entra por CSS y NO por el src del <img>: asi cada <img src="claude.png">
    # del documento queda tapado por el background, sin tocar el markup en 9 lugares.
    logo = ("img[src='claude.png']{background:url(data:image/png;base64,%s) "
            "center/contain no-repeat;content:url(data:image/png;base64,%s)}" % (b64(LOGO), b64(LOGO)))

    arte = ("img[src='arte-hook.jpg']{content:url(data:image/jpeg;base64,%s)}" % b64(ARTE))
    bloque = "%s\n<style>\n%s\n%s\n%s\n</style>\n%s" % (INICIO, caras, logo, arte, FIN)

    if FIN in html:  # ya estaba incrustado: se reemplaza, no se acumula
        html = re.sub(re.escape(INICIO) + r".*?" + re.escape(FIN), lambda _: bloque, html, flags=re.S)
    else:
        html = html.replace(INICIO, bloque, 1)

    DECK.write_text(html, encoding="utf-8")

    # Un deck que "quedo bien" pero perdio un asset es justo el bug que esto viene a
    # arreglar. Se verifica que los cuatro esten adentro, no que el script no exploto.
    final = DECK.read_text(encoding="utf-8")
    assert final.count("base64,") == len(FUENTES) + 3, "falta algun asset incrustado"
    print("deck.html autocontenido · %d KB" % (DECK.stat().st_size // 1024))


if __name__ == "__main__":
    main()
