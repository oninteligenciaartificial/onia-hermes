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


def _abrir_ventana(pw, perfil):
    """Abre la ventana con el primer navegador que arranque de verdad.

    El 2026-09-21 esto reventó en la terminal de Sergio Urcullo con
    `Executable doesn't exist at ...ms-playwright\\chromium-1234\\chrome-win64\\chrome.exe`:
    Playwright se actualizó y el binario CON ventana todavía no estaba bajado (el
    headless shell sí). El mensaje que imprime Playwright («run playwright install»)
    manda a descargar ~150 MB para algo que esta máquina ya tiene: **Chrome está
    instalado**, y el generador de carruseles lo viene usando desde agosto.

    Por eso el orden: Chrome del sistema primero (`channel`), el Chromium de
    Playwright después. Así una actualización de Playwright no vuelve a bloquear un
    login que no tiene nada que ver con Playwright.
    """
    intentos = [
        ("Chrome del sistema", {"channel": "chrome"}),
        ("Edge del sistema", {"channel": "msedge"}),
        ("Chromium de Playwright", {}),
    ]
    errores = []
    for nombre, extra in intentos:
        try:
            ctx = pw.chromium.launch_persistent_context(
                str(perfil),
                headless=False,
                viewport={"width": 1440, "height": 900},
                args=["--start-maximized"],
                **extra,
            )
            print(f"  (abierto con: {nombre})")
            return ctx
        except Exception as e:
            errores.append(f"    - {nombre}: {str(e).splitlines()[0][:120]}")
    print("\n  No pude abrir ninguna ventana. Lo que falló, en orden:")
    print("\n".join(errores))
    sys.exit(
        "\n  Si fallaron los tres, corré una vez:  python -m playwright install chromium\n"
        "  (y si estás en una sesión sin escritorio, esto no va a andar: necesita ventana)"
    )


def main():
    if len(sys.argv) < 2 or sys.argv[1] not in SITIOS:
        sys.exit(f"Uso: python abrir_sesion.py [{' | '.join(SITIOS)}]")
    sitio = sys.argv[1]
    perfil = PERFILES / sitio
    perfil.mkdir(parents=True, exist_ok=True)

    print(f"\n  Abriendo {sitio}. Inicia sesion en la ventana que aparece.")
    print("  Cuando el sitio ya este adentro, CERRA la ventana: la sesion queda guardada.\n")

    with sync_playwright() as pw:
        ctx = _abrir_ventana(pw, perfil)
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
