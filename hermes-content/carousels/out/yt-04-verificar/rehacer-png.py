#!/usr/bin/env python3
"""Rinde las laminas de deck.html a lamina-NN.png, 1920x1080.

Por que existe: el README de los decks hermanos manda correr
`chrome --headless --screenshot "deck.html?limpio#N"`, y en esta maquina ESO NO
ESCRIBE EL PNG (queda el archivo anterior, viejo, sin ningun error visible) —
justo el falso verde del que habla este video. Playwright si lo escribe.

El deck escala el lienzo de 1920x1080 al viewport, asi que el viewport TIENE que
ser 1920x1080 o las laminas salen con otro tamano de texto.

Uso:  python rehacer-png.py            (las 11)
      python rehacer-png.py 9          (solo la 9)
"""
import pathlib
import sys

from playwright.sync_api import sync_playwright

AQUI = pathlib.Path(__file__).resolve().parent
DECK = (AQUI / "deck.html").as_uri()


def main() -> None:
    pedidas = [int(a) for a in sys.argv[1:]]
    with sync_playwright() as p:
        nav = p.chromium.launch()
        pag = nav.new_page(viewport={"width": 1920, "height": 1080})
        pag.goto(DECK + "?limpio")
        total = pag.evaluate("document.querySelectorAll('.lamina').length")
        for n in pedidas or range(1, total + 1):
            pag.evaluate("n => location.hash = '#' + n", n)
            pag.wait_for_timeout(250)
            salida = AQUI / ("lamina-%02d.png" % n)
            pag.screenshot(path=str(salida))
            # Un render que "salio bien" pero no escribio el archivo es el bug que
            # este video denuncia. Se comprueba el archivo, no que no explotara.
            assert salida.stat().st_size > 20_000, "PNG vacio: %s" % salida.name
            print("  lamina-%02d.png  %d KB" % (n, salida.stat().st_size // 1024))
        nav.close()
    print("%d laminas en total" % total)


if __name__ == "__main__":
    main()
