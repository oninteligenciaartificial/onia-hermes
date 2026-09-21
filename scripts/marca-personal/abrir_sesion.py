# -*- coding: utf-8 -*-
"""Abre un Chrome VISIBLE con perfil persistente para que Sergio Urcullo inicie
sesion A MANO una sola vez. La sesion queda guardada en el perfil y todas las
grabaciones posteriores la reutilizan headless, sin volver a pedir nada.

Por que asi: yo no escribo contrasenas en ningun formulario. El login lo hace el,
en su ventana, y lo unico que queda del otro lado es la cookie en el perfil local.

Uso:
    python abrir_sesion.py n8n
    python abrir_sesion.py higgsfield

El perfil vive en E:/ONIA-YouTube/grabaciones/_perfiles/<sitio> (fuera del repo).

---

🔴 POR QUE ESTO **NO** USA PLAYWRIGHT PARA ABRIR LA VENTANA

Sergio Urcullo, 2026-09-21: *"no me deja iniciar con google en higgsfield y asi
esta creada mi cuenta"*. Y su cuenta de Higgsfield entra por Google.

Playwright arranca Chrome con `--enable-automation` y deja `navigator.webdriver`
en true. **Google detecta eso y bloquea el login** con "este navegador o
aplicacion puede no ser seguro". No es un bug nuestro ni de Higgsfield: es una
politica de Google contra navegadores controlados por software, y no se esquiva
peleandola (esconder la bandera es justo lo que esa politica busca impedir).

La salida no era pelearla: era notar que **para que el se loguee no hace falta
automatizacion ninguna**. Este script solo tiene que abrirle una ventana apuntada
al perfil correcto. Eso es `chrome.exe --user-data-dir=<perfil>` y nada mas — un
Chrome normal, indistinguible del suyo, donde Google funciona como siempre.

La automatizacion recien entra DESPUES, al grabar: ahi Playwright abre el mismo
perfil headless y la cookie ya esta puesta. Google no participa de esa parte.

Playwright queda como respaldo por si no hay Chrome ni Edge instalados, con el
aviso de que el login con Google probablemente falle por ese camino.
"""
from __future__ import annotations

import subprocess
import sys
import time
from pathlib import Path

SITIOS: dict[str, str] = {
    "n8n": "https://n8n-sergio-n8n.hqdqgh.easypanel.host/",
    "higgsfield": "https://higgsfield.ai/",
    "github": "https://github.com/login",
}

PERFILES = Path(r"E:\ONIA-YouTube\grabaciones\_perfiles")

# Mismo orden que usa el generador de carruseles desde agosto: Chrome real primero.
NAVEGADORES: tuple[tuple[str, str], ...] = (
    ("Chrome", r"C:\Program Files\Google\Chrome\Application\chrome.exe"),
    ("Chrome (x86)", r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"),
    ("Edge", r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"),
    ("Edge", r"C:\Program Files\Microsoft\Edge\Application\msedge.exe"),
)


def _navegador() -> tuple[str, str] | None:
    for nombre, ruta in NAVEGADORES:
        if Path(ruta).exists():
            return nombre, ruta
    return None


def _abrir_normal(exe: str, perfil: Path, url: str) -> subprocess.Popen[bytes]:
    """Chrome tal cual lo abre una persona. Sin una sola bandera de automatizacion."""
    return subprocess.Popen(
        [
            exe,
            f"--user-data-dir={perfil}",
            "--no-first-run",
            "--no-default-browser-check",
            "--start-maximized",
            url,
        ]
    )


def _abrir_con_playwright(perfil: Path, url: str) -> None:
    """Respaldo: solo si no hay Chrome ni Edge instalados."""
    print("  [!]  No encontre Chrome ni Edge. Voy por Playwright — ojo: si el sitio")
    print("      entra con Google, es probable que Google BLOQUEE este login.")
    from playwright.sync_api import sync_playwright

    with sync_playwright() as pw:
        ctx = pw.chromium.launch_persistent_context(
            str(perfil), headless=False, viewport={"width": 1440, "height": 900}
        )
        page = ctx.pages[0] if ctx.pages else ctx.new_page()
        page.goto(url)
        limite = time.time() + 20 * 60
        while time.time() < limite:
            try:
                if not ctx.pages:
                    break
                ctx.pages[0].title()
            except Exception:
                break
            time.sleep(1)
        try:
            ctx.close()
        except Exception:
            pass


def main() -> None:
    if len(sys.argv) < 2 or sys.argv[1] not in SITIOS:
        sys.exit(f"Uso: python abrir_sesion.py [{' | '.join(SITIOS)}]")

    sitio = sys.argv[1]
    perfil = PERFILES / sitio
    perfil.mkdir(parents=True, exist_ok=True)
    url = SITIOS[sitio]

    print(f"\n  Abriendo {sitio}. Inicia sesion en la ventana que aparece.")
    print("  Cuando ya estes adentro, CERRA la ventana: ahi se guarda la sesion.\n")

    elegido = _navegador()
    if elegido is None:
        _abrir_con_playwright(perfil, url)
    else:
        nombre, exe = elegido
        print(f"  (abierto con {nombre} normal, sin automatizacion: Google funciona)")
        proc = _abrir_normal(exe, perfil, url)
        # Chrome puede delegar en una instancia previa del MISMO perfil y salir al
        # instante; en ese caso esperar al proceso no sirve de nada. Lo que de verdad
        # dice que termino es que el archivo de cookies se libere.
        proc.wait()
        _esperar_cierre(perfil)

    cookies = perfil / "Default" / "Network" / "Cookies"
    if cookies.exists():
        print(f"  Sesion de {sitio} guardada en {perfil}")
        print(f"  Comprobalo con:  python scripts/marca-personal/probar_sesion.py {sitio}")
    else:
        print(f"  [!]  No se escribio ninguna cookie en {perfil}.")
        print("      Si cerraste sin loguearte, volve a correr esto.")


def _esperar_cierre(perfil: Path, limite_min: int = 20) -> None:
    """Espera a que Chrome suelte el perfil.

    Hace falta porque el archivo de cookies queda BLOQUEADO mientras la ventana
    sigue abierta, y una grabacion lanzada contra un perfil bloqueado arranca con
    un perfil nuevo y vacio — sin error, sin aviso, y con la pagina pidiendo login.
    Eso paso el 21-sep con n8n: 33 MB en el perfil, cero cookies, y un 401.
    """
    cookies = perfil / "Default" / "Network" / "Cookies"
    limite = time.time() + limite_min * 60
    aviso = False
    while time.time() < limite:
        try:
            with open(cookies, "rb"):
                return
        except FileNotFoundError:
            pass
        except PermissionError:
            if not aviso:
                print("  (la ventana sigue abierta; cerrala para que se guarde)")
                aviso = True
        time.sleep(2)


if __name__ == "__main__":
    main()
