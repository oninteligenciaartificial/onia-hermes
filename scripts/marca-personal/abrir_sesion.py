# -*- coding: utf-8 -*-
"""Abre un Chromium VISIBLE con perfil persistente para que Sergio Urcullo inicie
sesion A MANO una sola vez. La sesion queda guardada en el perfil y todas las
grabaciones posteriores la reutilizan headless, sin volver a pedir nada.

Por que asi: yo no escribo contraseñas en ningun formulario. El login lo hace el,
en su ventana, y lo unico que queda del otro lado es la cookie en el perfil local.

Uso:
    python abrir_sesion.py n8n
    python abrir_sesion.py higgsfield

El perfil vive en E:/ONIA-YouTube/grabaciones/_perfiles/<sitio> (fuera del repo).
"""
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

SITIOS = {
    "n8n": "https://n8n-sergio-n8n.hqdqgh.easypanel.host/",
    "higgsfield": "https://higgsfield.ai/",
    "github": "https://github.com/login",
}

PERFILES = Path(r"E:\ONIA-YouTube\grabaciones\_perfiles")


def main():
    if len(sys.argv) < 2 or sys.argv[1] not in SITIOS:
        sys.exit(f"Uso: python abrir_sesion.py [{' | '.join(SITIOS)}]")
    sitio = sys.argv[1]
    perfil = PERFILES / sitio
    perfil.mkdir(parents=True, exist_ok=True)

    print(f"\n  Abriendo {sitio}. Inicia sesion en la ventana que aparece.")
    print("  Cuando el sitio ya este adentro, CERRA la ventana: la sesion queda guardada.\n")

    with sync_playwright() as pw:
        ctx = pw.chromium.launch_persistent_context(
            str(perfil),
            headless=False,
            viewport={"width": 1440, "height": 900},
            args=["--start-maximized"],
        )
        page = ctx.pages[0] if ctx.pages else ctx.new_page()
        page.goto(SITIOS[sitio])
        # espera hasta que se cierre la ventana (o 20 min de guarda)
        import time
        limite = time.time() + 20 * 60
        while time.time() < limite:
            try:
                if not ctx.pages:
                    break
                ctx.pages[0].title()      # falla cuando la ventana se cerro
            except Exception:
                break
            time.sleep(1)
        try:
            ctx.close()
        except Exception:
            pass
    print(f"  Sesion de {sitio} guardada en {perfil}")


if __name__ == "__main__":
    main()
