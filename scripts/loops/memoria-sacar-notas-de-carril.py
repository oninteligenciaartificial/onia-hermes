#!/usr/bin/env python3
"""Saca de MEMORY.md las notas de método que un carril escribió sobre sí mismo.

POR QUÉ EXISTE. El 2026-09-26 MEMORY.md estaba en 65.449 de 65.536 bytes — 87 de
headroom — y llevaba congelada desde el 24-sep: toda lección nueva se desviaba a
archivo-aprendizajes/, que ningún prompt inyecta. Contado el contexto activo, 9 de
los 25 bloques firmados (2.709 bytes) eran la nota de método de un carril sobre su
propio método, y 5 de esas 9 repetían con otras palabras un hecho que el MISMO
carril ya había dejado completo minutos antes (al reescribirlo cambia el hash, así
que el dedup del consolidador no las veía). `scripts/loops/aprender.sh` ya cierra la
puerta para las próximas; esto saca las que entraron antes.

POR QUÉ NO DESALOJA "LA MÁS VIEJA". Era la hipótesis obvia —una ventana FIFO sobre
los bloques firmados— y la medición la refutó ANTES de escribirla: el bloque firmado
más viejo del archivo es la corrección de precios del 24-sep ("la escalera vigente
son CUATRO escalones... la entrada vieja de esta memoria que dice 320/750/1.500 es
FALSA"), y la entrada falsa que corrige sigue viva más arriba, en la sección
curada. FIFO habría sacado la corrección y dejado el error, o sea habría mandado a
escribir precios inventados en propuestas, landing y carruseles. En un archivo que
mezcla reglas curadas con lecciones fechadas, "vieja" no es proxy de "sobra".

QUÉ NO HACE. No resume, no reescribe y no decide por tema: eso sigue siendo de una
persona, y el consolidador explica por qué (pedirle a un LLM que guarde un hecho lo
lleva a compactar y tirar reglas, medido el 2026-09-03). Acá el corte es mecánico:
la marca del carril al inicio del bloque. Lo que sale va COMPLETO al archivo, con el
mismo nombre por hash que usa el consolidador, así que sigue consultable por grep y
el dedup lo reconoce si alguien lo vuelve a aprender.
"""
from __future__ import annotations

import argparse
import fcntl
import hashlib
import os
import re
import subprocess
import sys
import tempfile
import unicodedata
from pathlib import Path

SEPARADOR = "\n§\n"
# La misma marca que rechaza aprender.sh. Se exige ADEMÁS la firma: un bloque de la
# sección curada que empezara con corchetes no es una nota de carril.
MARCA_DE_CARRIL = re.compile(r"^\[[a-z0-9-]+\]")
FIRMA = "— aprendido por"


def normalizar(texto: str) -> str:
    """El normalizar() de consolidar-memoria.sh, para que el hash coincida.

    Minúsculas, sin acentos, sólo [a-z0-9., \\n], espacios colapsados y recortados.
    Se conservan "." y "," a propósito: sin ellos "1,5 créditos" y "15 créditos"
    daban el mismo hash y una corrección de cifra se perdía como "repetido".
    """
    plano = unicodedata.normalize("NFKD", texto.lower())
    plano = plano.encode("ascii", "ignore").decode("ascii")
    plano = "".join(c for c in plano if c in " \n.," or c.isalnum())
    plano = re.sub(r" +", " ", plano)
    return "\n".join(linea.strip(" ") for linea in plano.split("\n")).strip(" ")


def firma(bloque: str) -> str:
    sin_firma = "\n".join(l for l in bloque.split("\n") if not l.startswith(FIRMA))
    texto = normalizar(sin_firma)
    if not texto:
        return ""
    return hashlib.sha256(texto.encode("utf-8")).hexdigest()


def es_nota_de_carril(bloque: str) -> bool:
    return bool(MARCA_DE_CARRIL.match(bloque.lstrip("\n"))) and FIRMA in bloque


def partir(texto: str) -> list[str]:
    return texto.split(SEPARADOR)


def unir(bloques: list[str], termina_en_salto: bool) -> str:
    texto = SEPARADOR.join(bloques)
    # El último bloque se queda con el "\n" final del archivo; si es justo el que
    # sale, hay que devolverlo o el archivo queda sin salto y el consolidador le
    # mete un PREFIJO que no corresponde.
    if termina_en_salto and not texto.endswith("\n"):
        texto += "\n"
    return texto


def planear(texto: str) -> tuple[list[str], list[str]]:
    bloques = partir(texto)
    # El bloque 0 es la cabecera curada: nunca sale, ni si empezara con corchetes.
    quedan = [bloques[0]]
    sacados: list[str] = []
    for bloque in bloques[1:]:
        (sacados if es_nota_de_carril(bloque) else quedan).append(bloque)
    return quedan, sacados


def archivar(destino: Path, bloque: str) -> Path | None:
    """Publica el bloque completo antes de que nadie lo saque de MEMORY.md."""
    h = firma(bloque)
    if not h:
        return None
    destino.mkdir(parents=True, exist_ok=True)
    final = destino / f"{h}.md"
    cuerpo = bloque.strip("\n") + "\n"
    if final.exists() and final.stat().st_size:
        return final
    tmp = tempfile.NamedTemporaryFile("w", encoding="utf-8", dir=destino,
                                      prefix=".pendiente.", delete=False)
    with tmp:
        tmp.write(cuerpo)
    os.chmod(tmp.name, 0o600)
    os.replace(tmp.name, final)
    return final


def ejecutar(mem: Path, destino: Path, lock: Path, seco: bool) -> int:
    if not mem.is_file():
        print(f"no existe {mem}: nada que sacar", file=sys.stderr)
        return 2
    lock.parent.mkdir(parents=True, exist_ok=True)
    with open(lock, "w") as f:
        fcntl.flock(f, fcntl.LOCK_EX)
        texto = mem.read_text(encoding="utf-8")
        antes = len(texto.encode("utf-8"))
        quedan, sacados = planear(texto)
        if not sacados:
            print(f"0 notas de carril — MEMORY.md queda en {antes} bytes")
            return 0
        for bloque in sacados:
            primera = bloque.strip().split("\n")[0]
            print(("  [seco] " if seco else "  sale  ") + primera[:110])
        nuevo = unir(quedan, texto.endswith("\n"))
        despues = len(nuevo.encode("utf-8"))
        if seco:
            print(f"[simulacro] {len(sacados)} bloques, "
                  f"{antes} -> {despues} bytes ({antes - despues} liberados). "
                  "Nada se escribió.")
            return 0
        # Primero al archivo, después sacar: si algo se corta en el medio el hecho
        # queda duplicado (recuperable), nunca perdido.
        for bloque in sacados:
            if archivar(destino, bloque) is None:
                print("un bloque no pudo archivarse: no se toca MEMORY.md", file=sys.stderr)
                return 1
        tmp = tempfile.NamedTemporaryFile("w", encoding="utf-8", dir=mem.parent,
                                          prefix=".MEMORY.", delete=False)
        with tmp:
            tmp.write(nuevo)
        os.chmod(tmp.name, 0o600)
        os.replace(tmp.name, mem)
        print(f"{len(sacados)} nota(s) de carril al archivo — MEMORY.md "
              f"{antes} -> {despues} bytes ({antes - despues} liberados)")
    return 0


def self_check() -> int:
    fallos = []

    def afirmar(cond, que):
        if not cond:
            fallos.append(que)

    cabecera = "# Memoria\nRegla curada que no se toca.\n"
    curado = "Una regla vigente con su causa medida."
    nota = "[recorrido-cliente] ninguna nueva.\n— aprendido por recorrido-cliente, 2026-09-24 08:17 La Paz"
    hecho = "El bot muere en el segundo turno, medido.\n— aprendido por chatbot-cola, 2026-09-24 07:22 La Paz"
    original = SEPARADOR.join([cabecera, curado, nota, hecho]) + "\n"

    afirmar(unir(partir(original), True) == original, "el ida y vuelta no es byte a byte")

    quedan, sacados = planear(original)
    afirmar(len(sacados) == 1, f"esperaba 1 nota, encontré {len(sacados)}")
    afirmar(sacados and sacados[0].startswith("[recorrido-cliente]"), "sacó el bloque equivocado")
    afirmar(quedan[0] == cabecera, "tocó la cabecera curada")
    afirmar(any(curado in b for b in quedan), "sacó una regla curada sin firma")
    afirmar(any("segundo turno" in b for b in quedan), "sacó un hecho que sí es compartido")

    # La cabecera no sale ni con la marca adelante: no tiene firma y es el bloque 0.
    q2, s2 = planear("[onia-cola] cabecera\n" + SEPARADOR + curado + "\n")
    afirmar(not s2, "sacó el bloque 0")

    # Un bloque con la marca pero SIN firma es contenido curado: se queda.
    _, s3 = planear(SEPARADOR.join([cabecera, "[tabla] fila de una seccion curada."]) + "\n")
    afirmar(not s3, "sacó un bloque con corchetes que no tiene firma")

    # Y el hash tiene que ser EL MISMO que el del consolidador, o el dedup se rompe:
    # un bloque sacado que no se reconozca volvería a entrar la próxima vez que
    # alguien lo aprenda.
    #
    # ⚠️ El pipeline se captura con $(...) y se emite con printf '%s', igual que
    # firma() en consolidar-memoria.sh. No es decorativo: $(...) COME el \n final que
    # deja tr, así que pipear el mismo pipeline directo a sha256sum da otro hash.
    # Escrito así primero, este self-check dio rojo contra un script correcto — un
    # rojo por el motivo equivocado es un verde futuro.
    esperado = subprocess.run(
        ["bash", "-c",
         "texto=$(sed '/^— aprendido por/d' | tr '[:upper:]' '[:lower:]' "
         "| iconv -f utf-8 -t ascii//TRANSLIT | tr -cd 'a-z0-9., \\n' | tr -s ' ' "
         "| sed 's/^ *//;s/ *$//'); printf '%s' \"$texto\" | sha256sum | cut -d' ' -f1"],
        input=nota, capture_output=True, text=True).stdout.strip()
    afirmar(esperado == firma(nota),
            f"el hash no coincide con consolidar-memoria.sh: {esperado} vs {firma(nota)}")

    # El caso que refutó FIFO: el bloque firmado más viejo puede ser el más valioso.
    precios = ("PRECIOS: la escalera vigente son CUATRO escalones.\n"
               "— aprendido por chatbot-cola, 2026-09-24 04:25 La Paz")
    _, s4 = planear(SEPARADOR.join([cabecera, precios, nota]) + "\n")
    afirmar(len(s4) == 1 and "recorrido-cliente" in s4[0],
            "una correccion de precios sin marca de carril NO se saca, aunque sea la mas vieja")

    for f in fallos:
        print(f"  FALLO: {f}", file=sys.stderr)
    print(f"self-check memoria-sacar-notas-de-carril: {9 - len(fallos)}/9")
    return 1 if fallos else 0


def main() -> int:
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--seco", action="store_true", help="muestra qué saldría, sin escribir")
    p.add_argument("--self-check", action="store_true")
    p.add_argument("--memoria", default=os.environ.get(
        "ONIA_MEMORIA", "/root/.hermes/memories/MEMORY.md"))
    p.add_argument("--archivo", default=os.environ.get("ONIA_MEMORIA_ARCHIVO", ""))
    p.add_argument("--lock", default=os.environ.get(
        "ONIA_MEMORIA_LOCK", "/var/lock/onia-memoria.lock"))
    a = p.parse_args()
    if a.self_check:
        return self_check()
    mem = Path(a.memoria)
    destino = Path(a.archivo) if a.archivo else mem.parent / "archivo-aprendizajes"
    return ejecutar(mem, destino, Path(a.lock), a.seco)


if __name__ == "__main__":
    sys.exit(main())
