# -*- coding: utf-8 -*-
"""Comprueba que una sesion guardada por `abrir_sesion.py` sirve HEADLESS.

Existe porque el 2026-09-21 el perfil de n8n tenia 33 MB y la sesion NO estaba:
Chrome habia escrito cache, no cookies. Un perfil pesado no prueba nada.

Y comprueba MIRANDO: guarda la captura y dice adonde quedo. Un 200 y una URL que
no redirige tampoco prueban que la app renderice — n8n devuelve la cascara de la
SPA con sesion o sin ella.

Uso:
    python scripts/marca-personal/probar_sesion.py n8n
    python scripts/marca-personal/probar_sesion.py higgsfield

⚠️ Corre esto con la ventana del login CERRADA. Si sigue abierta, el archivo de
cookies esta bloqueado, Chrome arranca con un perfil nuevo y vacio, y el
resultado dice "no hay sesion" cuando en realidad si la hay.
"""
from __future__ import annotations

import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

# Rutas que solo renderizan estando adentro.
SITIOS: dict[str, str] = {
    "n8n": "https://n8n-sergio-n8n.hqdqgh.easypanel.host/home/workflows",
    "higgsfield": "https://higgsfield.ai/",
    "github": "https://github.com/settings/profile",
}

PERFILES = Path(r"E:\ONIA-YouTube\grabaciones\_perfiles")


def main() -> None:
    if len(sys.argv) < 2 or sys.argv[1] not in SITIOS:
        sys.exit(f"Uso: python probar_sesion.py [{' | '.join(SITIOS)}]")

    sitio = sys.argv[1]
    perfil = PERFILES / sitio
    if not perfil.exists():
        sys.exit(f"No existe el perfil {perfil}. Corre antes: abrir_sesion.py {sitio}")

    cookies = perfil / "Default" / "Network" / "Cookies"
    try:
        with open(cookies, "rb"):
            pass
    except FileNotFoundError:
        sys.exit(f"  [NO] El perfil no tiene cookies. Volve a correr: abrir_sesion.py {sitio}")
    except PermissionError:
        sys.exit(
            "  [NO] El archivo de cookies esta BLOQUEADO: la ventana del login sigue\n"
            "    abierta. Cerrala y volve a correr esto."
        )

    destino = Path(f"sesion-{sitio}.png").resolve()
    with sync_playwright() as pw:
        ctx = pw.chromium.launch_persistent_context(
            str(perfil), headless=True, viewport={"width": 1440, "height": 900}
        )
        page = ctx.pages[0] if ctx.pages else ctx.new_page()
        errores: list[str] = []
        page.on("console", lambda m: errores.append(m.text[:160]) if m.type == "error" else None)
        page.goto(SITIOS[sitio], wait_until="domcontentloaded", timeout=60000)
        page.wait_for_timeout(10000)          # las SPA tardan en montar

        url_final = page.url
        texto = page.evaluate("document.body.innerText").strip()
        page.screenshot(path=str(destino))
        ctx.close()

    fuera = any(p in url_final.lower() for p in ("signin", "login", "auth"))
    print(f"  URL final : {url_final}")
    print(f"  texto     : {len(texto)} caracteres")
    if errores:
        print(f"  consola   : {errores[0]}")
    print(f"  captura   : {destino}")

    if fuera:
        print("\n  [NO] SIN SESION: la app te mando al login.")
    elif len(texto) < 40:
        print("\n  [!]  La pagina no renderizo texto. ABRI LA CAPTURA y mirala antes de")
        print("     concluir nada: puede ser sesion vencida o la app tardando mas.")
    else:
        print("\n  [OK] Sesion viva. Igual MIRA la captura: es la unica verificacion que vale.")


if __name__ == "__main__":
    main()
