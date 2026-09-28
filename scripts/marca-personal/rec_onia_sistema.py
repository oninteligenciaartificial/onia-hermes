# -*- coding: utf-8 -*-
"""Onia Platform · clips 2-5: login, onboarding/panel, crear cliente, crear cita,
inventario. Sobre la org demo 'Tienda La Esquina' (datos de utileria).
Cada clip es un video aparte para que la edicion elija."""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from grabar_pantalla import Grabador

BASE = r"E:\ONIA-YouTube\grabaciones\samuel"
EMAIL = "oninteligenciaartificial+demorodaje@gmail.com"
PASS = "DemoRodaje-2026!"


def login(g):
    g.ir("https://app.onia.com.bo/login", espera=3)
    g.tipear("input[type='email']", EMAIL, delay=30)
    g.tipear("input[type='password']", PASS, delay=40)
    g.click("button[type='submit']", espera=6)
    g.pausa(3)


# clip 2 · login + primer vistazo del panel/onboarding
with Grabador(BASE + r"\onia-2-login-panel.mp4", ancho=1440, alto=900) as g:
    login(g)
    g.pausa(2)
    g.scroll(500, tramos=14)
    g.pausa(2)
    g.page.screenshot(path=BASE + r"\debug-panel.png")
    print("URL tras login:", g.page.url)

print("OK clip 2")
