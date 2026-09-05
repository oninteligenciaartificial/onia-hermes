#!/usr/bin/env python3
"""Ninguna pieza de Lucía pide una palabra clave que el sistema NO responde.

Por qué existe: el 2026-09-04 la lámina FIJADA del perfil pedía comentar COMUNIDAD
y la cuenta de Lucía sólo responde SISTEMA y HUMO. Quien comentaba salía con
palabra=null y NO recibía nada, sin dejar registro — una palabra muerta es peor que
ninguna, porque la pieza PARECE que captura. Y el barrido a mano no alcanzó: quedaron
otros cinco CTA con ONIA y COMUNIDAD en guiones listos para publicar.

Cómo NO falla abierto, que es la trampa de esta familia de gates:
  · Los sujetos salen del DISCO (todo .md/.json del árbol) menos EXENTOS nombrados,
    no de una lista blanca: una pieza nueva nace cubierta y hay que excluirla a mano.
  · Las palabras válidas salen del workflow n8n ACTIVO, no de un doc ni de este archivo.
    Si el cableado cambia, el gate se entera solo.
  · Si no puede leer n8n, sale ROJO (exit 2). Nunca verde por no haber podido mirar.
  · Si el barrido no encuentra ni un archivo, sale ROJO: un árbol vacío es un bug del
    gate, no un aprobado.

Uso:  python3 hermes-content/references/modelos/lucia/scripts/palabras-cableadas.py
"""
import json
import re
import shutil
import sqlite3
import subprocess
import sys
import tempfile
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent          # .../modelos/lucia
CUENTA = "lucia"

EXENTOS = {"palabras-cableadas.py"}   # este archivo

# «Comentá HUMO», «Comenta SISTEMA», y el campo declarado en los briefs.
PEDIDOS = [
    re.compile(r"[Cc]oment[aá]\s+([A-ZÁÉÍÓÚÑ]{3,})"),
    re.compile(r'"comment_trigger"\s*:\s*"([A-ZÁÉÍÓÚÑ]{3,})"'),
]

# Qué es PIEZA y qué es prosa, que es la distinción que decide el color.
# Se publica: todo el contenido de un brief .json, y la línea «**CTA:** ...» de un
# guion .md. Todo lo demás en un .md es narración — una bitácora que cita la palabra
# muerta para explicar el error NO la está pidiendo, y marcarla en rojo obligaría a
# reescribir el registro de lo que pasó.
#
# La prosa igual se mira, pero como AVISO: si mañana un CTA se escribe con otro
# formato, aparece ahí en vez de desaparecer. El gate no puede quedarse callado sobre
# lo que no supo clasificar — así es como esta familia de gates falla abierto.
PUBLICABLE_MD = re.compile(r"^\s*\**CTA\**\s*:")


def palabras_cableadas():
    """Las que el workflow n8n ACTIVO responde para la cuenta de Lucía."""
    nombre = subprocess.run(
        ["docker", "ps", "--format", "{{.Names}}"],
        capture_output=True, text=True, check=True,
    ).stdout
    contenedor = next((l for l in nombre.splitlines() if "n8n" in l), None)
    if not contenedor:
        raise RuntimeError("no hay contenedor de n8n corriendo")

    with tempfile.TemporaryDirectory() as tmp:
        db = Path(tmp) / "n8n.sqlite"
        subprocess.run(
            ["docker", "cp", f"{contenedor}:/home/node/.n8n/database.sqlite", str(db)],
            capture_output=True, check=True,
        )
        con = sqlite3.connect(db)
        try:
            # active=1: hay copias apagadas del mismo workflow y leer una miente.
            filas = con.execute(
                "SELECT name, nodes FROM workflow_entity WHERE active=1"
            ).fetchall()
        finally:
            con.close()

    for _, nodes in filas:
        if CUENTA not in nodes.lower():
            continue
        for nodo in json.loads(nodes):
            code = nodo.get("parameters", {}).get("jsCode", "")
            # El bloque de la cuenta: `cuenta: 'lucia', ... palabras: { X: '...', Y: '...' }`
            m = re.search(
                r"cuenta:\s*'%s'.*?palabras:\s*\{(.*?)\n\}" % CUENTA,
                code, re.S,
            )
            if m:
                return set(re.findall(r"^\s*([A-ZÁÉÍÓÚÑ]{3,})\s*:", m.group(1), re.M))
    raise RuntimeError(f"ningún workflow activo define palabras para la cuenta '{CUENTA}'")


def main():
    try:
        vivas = palabras_cableadas()
    except Exception as e:                      # noqa: BLE001 — cualquier fallo es ROJO
        print(f"ROJO: no se pudo leer el cableado de n8n: {e}", file=sys.stderr)
        print("El gate NO aprueba por no haber podido mirar.", file=sys.stderr)
        return 2
    if not vivas:
        print(f"ROJO: la cuenta '{CUENTA}' no tiene ni una palabra cableada", file=sys.stderr)
        return 2

    archivos = [
        p for p in sorted(RAIZ.rglob("*"))
        if p.suffix in (".md", ".json") and p.name not in EXENTOS
    ]
    if not archivos:
        print("ROJO: el barrido no encontró ni un archivo — gate roto", file=sys.stderr)
        return 2

    muertas, avisos = [], []
    for p in archivos:
        es_brief = p.suffix == ".json"
        texto = p.read_text(encoding="utf-8", errors="replace")
        for linea_n, linea in enumerate(texto.splitlines(), 1):
            for rx in PEDIDOS:
                for palabra in rx.findall(linea):
                    if palabra in vivas:
                        continue
                    donde = (p.relative_to(RAIZ), linea_n, palabra)
                    publicable = es_brief or PUBLICABLE_MD.match(linea)
                    (muertas if publicable else avisos).append(donde)

    print(f"cableadas en n8n ({CUENTA}): {', '.join(sorted(vivas))}")
    print(f"archivos barridos: {len(archivos)}")

    if avisos:
        print(f"\nAVISO: {len(avisos)} mención(es) en prosa, no en una pieza publicable.")
        print("Si alguna de éstas es un CTA de verdad, el gate no la está cuidando:")
        for ruta, linea_n, palabra in avisos:
            print(f"  {ruta}:{linea_n}  nombra {palabra}")

    if muertas:
        print(f"\nROJO: {len(muertas)} pieza(s) piden una palabra que NO se responde:")
        for ruta, linea_n, palabra in muertas:
            print(f"  {ruta}:{linea_n}  pide {palabra}")
        print("\nQuien la comente sale con palabra=null y no recibe NADA, sin registro.")
        return 1

    print("\nVERDE: toda palabra pedida en una pieza publicable está cableada.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
