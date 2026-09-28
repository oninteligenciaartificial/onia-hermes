# -*- coding: utf-8 -*-
"""Onia Platform · clip 5: el panel con datos reales + el asistente del sistema
respondiendo. Material del video B del brief (la parte «te enseña a usarlo»)."""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from grabar_pantalla import Grabador

BASE = r"E:\ONIA-YouTube\grabaciones\samuel"
EMAIL = "oninteligenciaartificial+demorodaje@gmail.com"
PASS = "DemoRodaje-2026!"

with Grabador(BASE + r"\onia-5-panel-y-asistente.mp4", ancho=1440, alto=900) as g:
    g.ir("https://app.onia.com.bo/login", espera=2.5)
    g.tipear("input[type='email']", EMAIL, delay=20)
    g.tipear("input[type='password']", PASS, delay=25)
    g.click("button[type='submit']", espera=7)
    try:
        if g.page.locator("button:has-text('Cerrar por ahora')").first.is_visible(timeout=2000):
            g.click("button:has-text('Cerrar por ahora')", espera=1.5)
    except Exception:
        pass

    # 1 · el panel del dia con la venta ya hecha
    g.pausa(3)
    g.scroll(380, tramos=16)
    g.pausa(2)
    g.scroll(-380, tramos=12)
    g.pausa(1.5)

    # 2 · el asistente del sistema
    g.click("button:has-text('por tu negocio')", espera=3)
    g.pausa(1.5)
    g.tipear("input[placeholder*='equipo']", "¿Cómo agrego a alguien de mi equipo?", delay=45)
    g.pausa(1)
    g.click("button:has-text('Preguntar')", espera=6)
    g.pausa(9)     # la respuesta se escribe sola
    g.page.screenshot(path=BASE + r"\debug-asistente-respuesta.png")
    g.pausa(2)

print("OK clip 5")
