# -*- coding: utf-8 -*-
"""Clip: los repos de skills en GitHub — material del video 9 del brief (ranking de
skills para desarrollo web), del carrusel REPOS y del b-roll del YT 05.
Muestra que una skill es TEXTO PLANO que se lee antes de instalar."""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from grabar_pantalla import Grabador

BASE = r"E:\ONIA-YouTube\grabaciones\samuel"

with Grabador(BASE + r"\repos-1-oficial.mp4", ancho=1440, alto=900) as g:
    # el repo oficial de Anthropic
    g.ir("https://github.com/anthropics/skills", espera=4)
    g.scroll(520, tramos=18)
    g.pausa(2)
    # entrar a una skill y mostrar que es texto legible
    try:
        g.click("a:has-text('artifacts-builder')", espera=3.5)
    except Exception:
        try:
            g.click("div[role='rowheader'] a >> nth=3", espera=3.5)
        except Exception:
            pass
    g.scroll(400, tramos=14)
    g.pausa(2.5)
    g.page.screenshot(path=BASE + r"\debug-repo-skill.png")

with Grabador(BASE + r"\repos-2-comunidad.mp4", ancho=1440, alto=900) as g:
    for url in ["https://github.com/anthropics/claude-plugins-official",
                "https://github.com/thedotmack/claude-mem"]:
        g.ir(url, espera=3.5)
        g.scroll(450, tramos=16)
        g.pausa(2)

print("OK clips repos")
