#!/usr/bin/env python3
"""Publica hermes-content/sitio-sergiourcullo/ en sergiourcullo.vercel.app.

POR QUE ESTE SCRIPT EXISTE
El proyecto de Vercel `sergiourcullo` esta linkeado al repo GitHub
`oninteligenciaartificial/sergiourcullo`, que NO es este repo. Sin esto, cada deploy
significaba reenviar los ~65 KB del sitio entero por el MCP de Vercel, a mano y en una
sola llamada. Con esto, publicar es un comando y Vercel deploya solo en cada push.

El sitio vive en ESTE repo (junto al resto del contenido de marca personal); el repo de
GitHub es sólo el buzón de deploy. Nunca se edita alla.

Uso:
  python scripts/publicar-sitio.py                    # publica
  python scripts/publicar-sitio.py -m "que cambio"    # con mensaje propio
  python scripts/publicar-sitio.py --dry              # muestra que copiaria, sin tocar nada
"""
import argparse
import shutil
import subprocess
import sys
from datetime import date
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
ORIGEN = REPO / "hermes-content/sitio-sergiourcullo"
# Checkout del buzon de deploy. Va FUERA del repo a proposito: un `git init` dentro de
# onia-hermes crearia un repo anidado y eso rompe el auto-sync del proyecto.
CLON = Path("C:/dev/proyectos/sergiourcullo-deploy")
REMOTO = "https://github.com/oninteligenciaartificial/sergiourcullo.git"

# Lo que se publica. Explicito y no un glob: el README es documentacion interna y no tiene
# por que quedar servido en la web.
PUBLICABLE = {".html", ".css", ".txt", ".json", ".svg", ".png", ".jpg", ".webp", ".ico"}
EXCLUIR = {"README.md"}


def correr(*args, cwd=None):
    r = subprocess.run(args, cwd=cwd, capture_output=True, text=True, encoding="utf-8")
    if r.returncode != 0:
        print(f"FALLO: {' '.join(args)}\n{r.stderr.strip()}", file=sys.stderr)
        raise SystemExit(r.returncode)
    return r.stdout.strip()


def archivos():
    for ruta in sorted(ORIGEN.rglob("*")):
        if ruta.is_file() and ruta.suffix in PUBLICABLE and ruta.name not in EXCLUIR:
            yield ruta, ruta.relative_to(ORIGEN)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("-m", "--mensaje", default=None)
    ap.add_argument("--dry", action="store_true")
    args = ap.parse_args()

    if not ORIGEN.is_dir():
        raise SystemExit(f"No existe {ORIGEN}")

    lista = list(archivos())
    print(f"sitio-sergiourcullo -> {len(lista)} archivos")
    for _, rel in lista:
        print(f"  {rel.as_posix()}")
    if args.dry:
        return

    if not (CLON / ".git").is_dir():
        print(f"\nclonando el buzon en {CLON}")
        CLON.parent.mkdir(parents=True, exist_ok=True)
        correr("git", "clone", REMOTO, str(CLON))
    else:
        # `|| true` a mano: el repo puede estar vacio y entonces no hay nada que traer.
        subprocess.run(["git", "fetch", "origin"], cwd=CLON, capture_output=True)
        subprocess.run(["git", "reset", "--hard", "origin/main"], cwd=CLON, capture_output=True)

    # Se borra todo salvo .git y se copia de nuevo: asi un archivo eliminado del origen
    # tambien desaparece de la web. Un rsync a medias deja paginas fantasma servidas.
    for hijo in CLON.iterdir():
        if hijo.name == ".git":
            continue
        shutil.rmtree(hijo) if hijo.is_dir() else hijo.unlink()

    for ruta, rel in lista:
        destino = CLON / rel
        destino.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(ruta, destino)

    correr("git", "add", "-A", cwd=CLON)
    estado = correr("git", "status", "--porcelain", cwd=CLON)
    if not estado:
        print("\nsin cambios: la web ya esta al dia")
        return

    mensaje = args.mensaje or f"publicar sitio {date.today().isoformat()}"
    correr("git", "-c", "user.name=oninteligenciaartificial",
           "-c", "user.email=oninteligenciaartificial@gmail.com",
           "commit", "-m", mensaje, cwd=CLON)
    correr("git", "push", "origin", "HEAD:main", cwd=CLON)

    print(f"\npusheado. Vercel deploya solo en ~1 min.")
    print("   https://sergiourcullo.vercel.app")


if __name__ == "__main__":
    main()
