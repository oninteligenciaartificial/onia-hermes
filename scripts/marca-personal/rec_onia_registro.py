# -*- coding: utf-8 -*-
"""Onia Platform · clip 1: el registro (asistente de 2 pasos) creando la org DEMO
de utileria. Selectores por placeholder EXACTO (v2 — la v1 mezclo los campos y el
validador freno el submit, sin efectos)."""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from grabar_pantalla import Grabador

SALIDA = r"E:\ONIA-YouTube\grabaciones\samuel\onia-1-registro.mp4"
EMAIL = "oninteligenciaartificial+demorodaje@gmail.com"
PASS = "DemoRodaje-2026!"

with Grabador(SALIDA, ancho=1440, alto=900) as g:
    g.ir("https://app.onia.com.bo/register", espera=3)
    g.pausa(1.5)
    g.click("button:has-text('Comercio / tienda')", espera=2.5)

    g.tipear("input[placeholder='María Pérez']", "Sergio Demo")
    g.tipear("input[type='email']", EMAIL, delay=35)
    g.tipear("input[type='password']", PASS, delay=45)
    g.tipear("input[placeholder='Ferretería El Tornillo']", "Tienda La Esquina")
    g.pausa(1.5)
    g.click("button:has-text('Crear mi cuenta')", espera=8)
    g.pausa(5)
    g.page.screenshot(path=str(Path(SALIDA).parent / "debug-post-registro.png"))
    print("URL final:", g.page.url)

print("OK ->", SALIDA)
