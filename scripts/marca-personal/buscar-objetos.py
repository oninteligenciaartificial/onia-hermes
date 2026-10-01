#!/usr/bin/env python3
"""Busca objetos reales con licencia libre y los deja recortados para los layouts A/B/C.

Los layouts A, B y C del patron apple-editorial usan objetos del mundo real (una taza, un
reloj, un cuaderno). Eso no tiene logo que bajar, a diferencia del layout E.

⚠️ POR QUE NO PINTEREST. `hermes-content/carousels/CAROUSEL_SYSTEM.md` fija la regla de la
casa: "Pinterest/competencia solo como direccion de estilo; nunca copiar textos, imagenes ni
claims". Bajar una foto de Pinterest y publicarla es usar la foto de otro. Sergio Urcullo
aprobo Unsplash y Pexels el 2026-09-06.

TRES FUENTES, y la eleccion es automatica:
  unsplash   — necesita UNSPLASH_ACCESS_KEY (alta gratis en unsplash.com/developers)
  pexels     — necesita PEXELS_API_KEY      (alta gratis en pexels.com/api)
  openverse  — SIN llave, funciona hoy mismo. Filtrado a CC0 / dominio publico.

Openverse se filtra a **CC0 y PDM** a proposito: en una lamina de carrusel no hay lugar
para poner el credito del fotografo, asi que se usa solo lo que no exige atribucion. Igual
se registra autor y licencia de todo en CREDITOS.md — de eso depende poder demostrar de
donde salio cada imagen.

Los nombres de archivo y las consultas se sanitizan: el nombre entra en una ruta y la
consulta viaja en una URL.

Uso:
  python scripts/marca-personal/buscar-objetos.py --objeto cafe="espresso cup"
  python scripts/marca-personal/buscar-objetos.py --objeto cafe="espresso cup" --objeto reloj="wrist watch"
  python scripts/marca-personal/buscar-objetos.py --objeto cafe="espresso cup" --fuente pexels
"""
import argparse
import json
import os
import re
import urllib.parse
import urllib.request
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
DEST = REPO / "hermes-content/references/ui-patterns/apple-editorial/objetos"
UA = "onia-carousel/1.0 (https://onia.com.bo)"


def _get(url, cabeceras=None):
    req = urllib.request.Request(url, headers={"User-Agent": UA, **(cabeceras or {})})
    with urllib.request.urlopen(req, timeout=40) as r:
        return json.load(r)


def _bajar(url, destino):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=90) as r:
        destino.write_bytes(r.read())


def buscar_openverse(consulta):
    """CC0 / dominio publico unicamente: sin obligacion de atribuir en la lamina."""
    url = ("https://api.openverse.org/v1/images/?"
           + urllib.parse.urlencode({
               "q": consulta, "license": "cc0,pdm", "extension": "jpg",
               "page_size": 8, "mature": "false",
           }))
    for r in _get(url).get("results", []):
        if r.get("url"):
            return {
                "url": r["url"], "fuente": "openverse",
                "licencia": (r.get("license") or "?").upper(),
                "autor": r.get("creator") or "desconocido",
                "pagina": r.get("foreign_landing_url") or r.get("url"),
            }
    return None


def buscar_unsplash(consulta, key):
    url = ("https://api.unsplash.com/search/photos?"
           + urllib.parse.urlencode({"query": consulta, "per_page": 5, "orientation": "squarish"}))
    for r in _get(url, {"Authorization": f"Client-ID {key}"}).get("results", []):
        return {
            "url": r["urls"]["raw"] + "&w=2048&q=85&fm=jpg", "fuente": "unsplash",  # regular = 1080 px
            "licencia": "Unsplash License",
            "autor": (r.get("user") or {}).get("name", "desconocido"),
            "pagina": (r.get("links") or {}).get("html", ""),
        }
    return None


def buscar_pexels(consulta, key):
    url = ("https://api.pexels.com/v1/search?"
           + urllib.parse.urlencode({"query": consulta, "per_page": 5}))
    for r in _get(url, {"Authorization": key}).get("photos", []):
        return {
            "url": r["src"]["large2x"], "fuente": "pexels",  # large = 940 px: poca calidad (29-sep)
            "licencia": "Pexels License",
            "autor": r.get("photographer", "desconocido"),
            "pagina": r.get("url", ""),
        }
    return None


def _leer_env():
    """Lee las llaves de los .env posibles, sin pisar las del entorno.

    Existe para que Sergio Urcullo solo tenga que PEGAR las llaves en un archivo y no
    exportarlas a mano en cada sesion. Todos los .env estan en .gitignore.

    Busca en TRES lugares porque en la practica la llave aparecio en el tercero:
    la raiz del worktree, la raiz del checkout principal (un worktree no comparte
    archivos ignorados con el) y el HOME. Se queda con la primera que encuentra.

    `utf-8-sig` y no `utf-8`: `Add-Content -Encoding utf8` en Windows PowerShell 5.1
    escribe **BOM**, y con utf-8 a secas la primera clave del archivo queda leida como
    "\\ufeffPEXELS_API_KEY" y no matchea nunca. Falla silenciosa y muy dificil de ver.
    """
    candidatos = [
        REPO / ".env",
        REPO.parent.parent.parent / ".env",   # .claude/worktrees/<x>/ -> checkout principal
        Path.home() / ".env",
    ]
    for env in candidatos:
        try:
            if not env.exists():
                continue
            texto = env.read_text(encoding="utf-8-sig", errors="replace")
        except OSError:
            continue
        for linea in texto.splitlines():
            linea = linea.strip()
            if not linea or linea.startswith("#") or "=" not in linea:
                continue
            k, v = linea.split("=", 1)
            k, v = k.strip(), v.strip().strip('"').strip("'")
            # el placeholder del instructivo no es una llave: si se cuela, el script
            # cree que tiene llave y falla con 401 en vez de caer a otra fuente.
            if (k in ("UNSPLASH_ACCESS_KEY", "PEXELS_API_KEY")
                    and v and not v.startswith("pega_") and not os.environ.get(k)):
                os.environ[k] = v


def elegir_fuente(pedida):
    _leer_env()
    unsplash = os.environ.get("UNSPLASH_ACCESS_KEY", "").strip()
    pexels = os.environ.get("PEXELS_API_KEY", "").strip()
    if pedida == "unsplash" or (pedida == "auto" and unsplash):
        if not unsplash:
            raise SystemExit("Falta UNSPLASH_ACCESS_KEY (alta gratis en unsplash.com/developers)")
        return "unsplash", unsplash
    if pedida == "pexels" or (pedida == "auto" and pexels):
        if not pexels:
            raise SystemExit("Falta PEXELS_API_KEY (alta gratis en pexels.com/api)")
        return "pexels", pexels
    return "openverse", None


def _anotar_galeria(creditos, recortado):
    """Una fila por imagen en galeria.json: de donde salio y con que licencia."""
    import datetime
    mf = REPO / "hermes-content/galeria/galeria.json"
    filas = json.loads(mf.read_text(encoding="utf-8")) if mf.exists() else []
    hoy = datetime.date.today().isoformat()
    for n, c, h in creditos:
        archivo = DEST / (f"{n}.png" if recortado else f"{n}-crudo.jpg")
        filas.append({"id": n, "file": archivo.relative_to(REPO).as_posix(), "fecha": hoy,
                      "tipo": "objetos", "fuente": h["fuente"], "licencia": h["licencia"],
                      "autor": h["autor"], "origen": h["pagina"], "consulta": c, "usado_en": [], "tags": []})
    mf.write_text(json.dumps(filas, ensure_ascii=False, indent=2) + chr(10), encoding="utf-8")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--objeto", action="append", required=True,
                    metavar="nombre=consulta", help='ej: cafe="espresso cup"')
    ap.add_argument("--fuente", choices=["auto", "unsplash", "pexels", "openverse"], default="auto")
    ap.add_argument("--sin-recorte", action="store_true",
                    help="no quita el fondo (util para ver el original)")
    ap.add_argument("--galeria", action="store_true",
                    help="guarda en hermes-content/galeria/objetos y lo anota en galeria.json "
                         "(la galeria unica de imagenes reutilizables, 29-sep)")
    a = ap.parse_args()
    global DEST
    if a.galeria:
        DEST = REPO / "hermes-content/galeria/objetos"

    fuente, key = elegir_fuente(a.fuente)
    print(f"fuente: {fuente}" + ("" if key else "  (sin llave — pegá UNSPLASH_ACCESS_KEY o "
                                                "PEXELS_API_KEY para subir la calidad)"))
    DEST.mkdir(parents=True, exist_ok=True)
    creditos = []

    for par in a.objeto:
        if "=" not in par:
            raise SystemExit(f"--objeto espera nombre=consulta, recibí: {par}")
        nombre, consulta = par.split("=", 1)
        # el nombre entra en una ruta: solo lo que es seguro en un nombre de archivo
        nombre = re.sub(r"[^a-z0-9_-]", "", nombre.strip().lower())
        if not nombre:
            raise SystemExit(f"nombre inválido en: {par}")

        hit = {"openverse": lambda: buscar_openverse(consulta),
               "unsplash": lambda: buscar_unsplash(consulta, key),
               "pexels": lambda: buscar_pexels(consulta, key)}[fuente]()
        if not hit:
            print(f"  {nombre}: SIN RESULTADOS para «{consulta}»")
            continue

        crudo = DEST / f"{nombre}-crudo.jpg"
        _bajar(hit["url"], crudo)
        salida = crudo
        if not a.sin_recorte:
            from rembg import remove
            from PIL import Image

            salida = DEST / f"{nombre}.png"
            salida.write_bytes(remove(crudo.read_bytes()))
            im = Image.open(salida).convert("RGBA")
            caja = im.getbbox()          # recorta el lienzo vacio que deja el recorte
            if caja:
                im.crop(caja).save(salida)
            crudo.unlink()
        print(f"  {nombre}: {salida.name}  {salida.stat().st_size // 1024} KB  "
              f"[{hit['fuente']} · {hit['licencia']} · {hit['autor']}]")
        creditos.append((nombre, consulta, hit))

    if creditos:
        cred = DEST / "CREDITOS.md"
        previo = cred.read_text(encoding="utf-8") if cred.exists() else (
            "# Créditos de los objetos\n\n"
            "Imágenes de stock con licencia libre para los layouts A/B/C del patrón\n"
            "`apple-editorial`. **Nunca de Pinterest** — regla de la casa en\n"
            "`hermes-content/carousels/CAROUSEL_SYSTEM.md`.\n\n"
            "De Openverse se toma sólo **CC0 / dominio público**: en una lámina no hay lugar\n"
            "para el crédito del fotógrafo, así que se usa lo que no exige atribuirlo. Aun así\n"
            "se registra todo acá, que es lo que permite demostrar de dónde salió cada imagen.\n\n"
            "| Objeto | Consulta | Fuente | Licencia | Autor | Origen |\n"
            "|---|---|---|---|---|---|\n")
        filas = "".join(
            f"| `{n}` | {c} | {h['fuente']} | {h['licencia']} | {h['autor']} | {h['pagina']} |\n"
            for n, c, h in creditos)
        cred.write_text(previo + filas, encoding="utf-8")
        print(f"OK -> {DEST}  (créditos en CREDITOS.md)")
        if a.galeria:
            _anotar_galeria(creditos, recortado=not a.sin_recorte)
    print("MIRÁ los recortes al 100% antes de usarlos: rembg se come detalles finos")
    print("y eso no se ve en miniatura.")


if __name__ == "__main__":
    main()
