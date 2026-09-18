# -*- coding: utf-8 -*-
"""Onia Platform · clip 4: el recorrido que propone el propio checklist del panel —
cargar stock inicial y registrar la primera venta. Exploratorio con debug."""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from grabar_pantalla import Grabador

BASE = r"E:\ONIA-YouTube\grabaciones\samuel"
EMAIL = "oninteligenciaartificial+demorodaje@gmail.com"
PASS = "DemoRodaje-2026!"

with Grabador(BASE + r"\onia-4-stock-y-venta.mp4", ancho=1440, alto=900) as g:
    g.ir("https://app.onia.com.bo/login", espera=2.5)
    g.tipear("input[type='email']", EMAIL, delay=20)
    g.tipear("input[type='password']", PASS, delay=25)
    g.click("button[type='submit']", espera=7)
    g.pausa(2.5)

    # el modal de primeros pasos: entrar a inventario desde ahi
    try:
        g.click("button:has-text('Abrir inventario')", espera=4)
    except Exception:
        g.ir("https://app.onia.com.bo/inventory", espera=4)
    g.page.screenshot(path=BASE + r"\debug-inventario.png")

    # cargar stock: inputs numericos visibles -> 24, 18, 30
    try:
        inputs = g.page.locator("input[type='number']")
        n = inputs.count()
        for i, valor in zip(range(min(n, 3)), ["24", "18", "30"]):
            caja = inputs.nth(i).bounding_box()
            if caja:
                g.mover(caja["x"] + caja["width"] / 2, caja["y"] + caja["height"] / 2)
            inputs.nth(i).click()
            inputs.nth(i).fill("")
            g.page.keyboard.type(valor, delay=80)
            g.pausa(0.6)
        for sel in ["button:has-text('Guardar')", "button:has-text('Confirmar')"]:
            try:
                if g.page.locator(sel).first.is_visible(timeout=1500):
                    g.click(sel, espera=3)
                    break
            except Exception:
                continue
    except Exception as e:
        print("stock:", e)
    g.pausa(1.5)
    g.page.screenshot(path=BASE + r"\debug-stock-final.png")
    print("URL:", g.page.url)

print("OK clip 4")
