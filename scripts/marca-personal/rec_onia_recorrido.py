# -*- coding: utf-8 -*-
"""Onia Platform · clip 4 (final): el recorrido que vende — alta de producto CON stock
y la venta COBRADA de punta a punta. Material del video A del brief.

Hallazgos del rodaje (18-sep), utiles para producto:
  1. Los productos que carga el ONBOARDING quedan con stock 0 y Caja bloquea la venta
     («Stock insuficiente»). El stock inicial solo se carga desde Catálogo → Nuevo
     producto; el onboarding nunca lo pide.
  2. El SKU es obligatorio de hecho: sin SKU el boton «Guardar producto» queda
     deshabilitado, y ningun texto lo dice (el campo no esta marcado con *).
  3. El ticket de Caja PERSISTE entre sesiones: si quedo algo cargado, hay que quitarlo.
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from grabar_pantalla import Grabador

BASE = r"E:\ONIA-YouTube\grabaciones\samuel"
EMAIL = "oninteligenciaartificial+demorodaje@gmail.com"
PASS = "DemoRodaje-2026!"


def entrar(g):
    g.ir("https://app.onia.com.bo/login", espera=2.5)
    g.tipear("input[type='email']", EMAIL, delay=20)
    g.tipear("input[type='password']", PASS, delay=25)
    g.click("button[type='submit']", espera=7)
    try:
        if g.page.locator("button:has-text('Cerrar por ahora')").first.is_visible(timeout=2000):
            g.click("button:has-text('Cerrar por ahora')", espera=1.5)
    except Exception:
        pass


with Grabador(BASE + r"\onia-4-producto-y-venta.mp4", ancho=1440, alto=900) as g:
    entrar(g)
    g.pausa(2)

    # 1 · CATALOGO: alta con stock inicial
    g.click("text=Catálogo", espera=4)
    g.pausa(1.5)
    g.click("button:has-text('Nuevo producto')", espera=2.5)
    for ph, val, d in [("Cemento IP-30 50kg", "Fideo 400 g", 70),
                       ("62.00", "12", 110),
                       ("CEM-IP30-50", "FIDEO-400", 80),
                       ("120", "30", 110),
                       ("52.50", "8", 110)]:
        g.tipear(f"input[placeholder='{ph}']", val, delay=d)
    g.pausa(1.2)
    g.click("button:has-text('Guardar producto')", espera=5)
    g.pausa(3.5)          # la tabla ya muestra el stock cargado

    # 2 · CAJA: limpiar lo viejo y vender
    g.click("text=Caja", espera=4.5)
    g.pausa(1.5)
    for _ in range(3):
        try:
            if g.page.locator("text=Quitar").first.is_visible(timeout=1200):
                g.click("text=Quitar", espera=1.2)
            else:
                break
        except Exception:
            break

    g.tipear("input[placeholder*='SKU']", "Fideo", delay=120)
    g.pausa(2)
    try:
        g.click("[role='option']", espera=1.8)
    except Exception:
        g.page.keyboard.press("Enter")
        g.pausa(1.5)

    g.click("button:has-text('Agregá al ticket')", espera=2.5)
    g.pausa(1.5)
    g.click("button:has-text('Cobrar')", espera=6)
    g.pausa(3.5)
    g.scroll(350, tramos=14)
    g.pausa(3)
    g.page.screenshot(path=BASE + r"\debug-venta-final.png")
    print("URL:", g.page.url)

print("OK clip 4 final")
