# -*- coding: utf-8 -*-
"""Onia Platform · clip 3 (v2, completo): el onboarding de punta a punta con datos
de utileria de una tienda de barrio, hasta el panel."""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from grabar_pantalla import Grabador

BASE = r"E:\ONIA-YouTube\grabaciones\samuel"
EMAIL = "oninteligenciaartificial+demorodaje@gmail.com"
PASS = "DemoRodaje-2026!"

with Grabador(BASE + r"\onia-3-onboarding.mp4", ancho=1440, alto=900) as g:
    g.ir("https://app.onia.com.bo/login", espera=3)
    g.tipear("input[type='email']", EMAIL, delay=25)
    g.tipear("input[type='password']", PASS, delay=35)
    g.click("button[type='submit']", espera=6)
    g.pausa(2)

    # pantalla del nombre (si aparece): continuar directo
    try:
        if g.page.locator("text=¿Cómo se llama tu negocio?").first.is_visible(timeout=3000):
            g.click("button:has-text('Continuar')", espera=4)
    except Exception:
        pass

    # P1 · datos del negocio
    try:
        g.tipear("input[placeholder*='591']", "70123456", delay=40)
        g.tipear("input[placeholder*='Banzer']", "Av. Las Américas #245", delay=35)
        g.tipear("input[placeholder*='Santa Cruz']", "Santa Cruz de la Sierra", delay=30)
        g.click("button:has-text('Continuar')", espera=3.5)
    except Exception as e:
        print("P1:", e)

    # P2 · horarios: lunes a viernes
    try:
        botones = g.page.locator("button:has-text('Agregar horario')")
        for i in range(5):
            g.click("button:has-text('Agregar horario') >> nth=0", espera=1.0)
        g.pausa(1)
        g.click("button:has-text('Continuar')", espera=3.5)
    except Exception as e:
        print("P2:", e)

    # P3 · productos con precio
    try:
        for nombre, precio in [("Arroz 5 kg", "42"), ("Aceite 1 L", "15"), ("Harina 1 kg", "8")]:
            g.tipear("input[placeholder*='Cemento']", nombre, delay=40)
            g.tipear("input[placeholder='Bs']", precio, delay=60)
            g.click("button:has-text('Agregar')", espera=1.4)
        g.pausa(1)
        g.click("button:has-text('Continuar')", espera=3.5)
    except Exception as e:
        print("P3:", e)

    # P4 · equipo
    try:
        g.tipear("input[placeholder='Carlos Rojas']", "Ana Rodríguez", delay=45)
        g.pausa(0.8)
        g.click("button:has-text('Terminar')", espera=7)
    except Exception as e:
        print("P4:", e)

    g.pausa(4)
    g.page.screenshot(path=BASE + r"\debug-panel-final.png")
    print("URL final:", g.page.url)

print("OK clip 3 v2")
