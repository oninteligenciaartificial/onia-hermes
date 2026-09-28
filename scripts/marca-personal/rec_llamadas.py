# -*- coding: utf-8 -*-
"""Recorrido: agendar la llamada 1a1 — web personal → Cal → formulario.
SE DETIENE ANTES de confirmar: no crea reservas reales."""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from grabar_pantalla import Grabador

SALIDA = r"E:\ONIA-YouTube\grabaciones\samuel\llamadas-B-agendar.mp4"

with Grabador(SALIDA) as g:
    # 1 · la home, con calma
    g.ir("https://sergiourcullo.vercel.app", espera=3)
    g.scroll(500)
    g.pausa(1.2)

    # 2 · hover al boton de agenda (esté donde esté)
    try:
        g.click("a[href*='cal.com']", espera=2)
    except Exception:
        # si el click navego en la misma pestaña ya estamos en Cal; si abrio popup,
        # navegamos directo (el corte queda natural en edicion)
        pass
    if "cal.com" not in g.page.url:
        g.ir("https://cal.com/sergiourcullo/30min", espera=4)
    else:
        g.pausa(3)

    # 3 · elegir el primer dia disponible del calendario
    dias = g.page.locator("button:not([disabled])[data-testid], [data-testid='day']:not([data-disabled='true'])")
    try:
        g.click("[data-testid='day'][data-disabled='false']", espera=2.2)
    except Exception:
        # fallback heuristico: botones del calendario habilitados con numero
        g.click("div[id*='calendar'] button:not([disabled]) >> nth=10", espera=2.2)

    # 4 · elegir el primer horario
    try:
        g.click("[data-testid='time']", espera=2.2)
    except Exception:
        g.click("button:has-text(':')", espera=2.2)

    # 5 · el formulario — datos demo, SIN confirmar
    try:
        g.tipear("input[name='name']", "Maria Fernandez (demo)")
        g.tipear("input[name='email']", "demo@ejemplo.com")
        g.pausa(2.5)  # se ve el formulario completo; el video corta aca
    except Exception:
        g.pausa(2.5)

print("OK ->", SALIDA)
