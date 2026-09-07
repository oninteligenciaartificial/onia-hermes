#!/usr/bin/env python3
"""Vendoriza los logos de marca REALES para el patron apple-editorial.

Por que: los glifos dibujados a mano se ven aproximados —el de WhatsApp salio mal y
Sergio Urcullo lo marco— y las referencias que el mando usan el icono de aplicacion
REAL de cada herramienta. Un logo aproximado en una pieza publica lee como falsificacion.

Fuente: simple-icons (CC0-1.0). Los archivos SVG son CC0; las marcas siguen siendo de
sus duenos y aca se usan de forma nominativa —"uso esta herramienta"—, que es
exactamente lo que hacen las referencias.

Se vendorizan (misma regla que las fuentes): nada de red en tiempo de render, para que
el PNG salga igual en la maquina de Sergio Urcullo y en el VPS.

Uso:  python hermes-content/references/ui-patterns/apple-editorial/build-logos.py
"""
import pathlib
import re
import urllib.request

HERE = pathlib.Path(__file__).resolve().parent
DEST = HERE / "logos"
CDN = "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/{}.svg"

# slug de simple-icons -> nombre con el que lo pide el generador
MARCAS = {
    "claude": "claude",
    "notion": "notion",
    "n8n": "n8n",
    "whatsapp": "whatsapp",
}


def main():
    DEST.mkdir(parents=True, exist_ok=True)
    for slug, nombre in MARCAS.items():
        url = CDN.format(slug)
        with urllib.request.urlopen(url, timeout=30) as r:
            svg = r.read().decode("utf-8")
        # simple-icons trae UN solo <path d="..."> en viewBox 0 0 24 24.
        paths = re.findall(r'<path[^>]*\sd="([^"]+)"', svg)
        if len(paths) != 1:
            raise SystemExit(f"{slug}: esperaba 1 path, encontre {len(paths)}")
        destino = DEST / f"{nombre}.path"
        destino.write_text(paths[0], encoding="utf-8")
        print(f"  {nombre}.path  {len(paths[0])} chars")

    lic = DEST / "LICENCIA.md"
    lic.write_text(
        "# Logos de marca\n\n"
        "Paths extraidos de [simple-icons](https://github.com/simple-icons/simple-icons),\n"
        "licencia **CC0-1.0**. Cada `.path` es el atributo `d` del unico `<path>` del SVG\n"
        "original, en viewBox `0 0 24 24`.\n\n"
        "Las marcas y logotipos pertenecen a sus respectivos duenos. Aca se usan de forma\n"
        "**nominativa** — para decir \"uso esta herramienta\" — que es el mismo uso que hacen\n"
        "las referencias del patron. No se alteran las formas ni se sugiere afiliacion.\n\n"
        "Colores oficiales aplicados por el generador (ver `ICONOS` en\n"
        "`scripts/marca-personal/generar-apple-editorial.py`).\n",
        encoding="utf-8",
    )
    print(f"OK -> {DEST}")


if __name__ == "__main__":
    main()
