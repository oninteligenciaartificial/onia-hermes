# -*- coding: utf-8 -*-
"""Clips de la web personal: /claude-code y /stack — b-roll para los videos de
skills e instalacion. Viewport 1440x900: la pagina llena mas el cuadro."""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from grabar_pantalla import Grabador

BASE = r"E:\ONIA-YouTube\grabaciones\samuel"

with Grabador(BASE + r"\web-claude-code.mp4", ancho=1440, alto=900) as g:
    g.ir("https://sergiourcullo.vercel.app/claude-code", espera=3)
    g.scroll(700, tramos=20)   # el hook + la advertencia honesta
    g.pausa(1.5)
    g.scroll(900, tramos=22)   # video 01
    g.pausa(1.5)
    g.scroll(1100, tramos=24)  # video 02 + los tres pasos
    g.pausa(1.5)
    g.scroll(900, tramos=20)   # los comandos con el boton copiar
    g.mover(720, 450)
    g.pausa(2)

with Grabador(BASE + r"\web-stack.mp4", ancho=1440, alto=900) as g:
    g.ir("https://sergiourcullo.vercel.app/stack", espera=3)
    g.scroll(800, tramos=20)
    g.pausa(1.2)
    g.scroll(1000, tramos=22)
    g.pausa(1.2)
    g.scroll(1000, tramos=22)
    g.pausa(2)

print("OK web clips")
