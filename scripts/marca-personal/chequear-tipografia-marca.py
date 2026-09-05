#!/usr/bin/env python3
"""Cuenta los generadores del carril que TODAVIA renderizan con la tipografia que
Sergio rechazo el 2026-09-02: Archivo black 900 y el eje condensed `wdth` 62.

    python3 scripts/marca-personal/chequear-tipografia-marca.py          # veredicto
    python3 scripts/marca-personal/chequear-tipografia-marca.py --test   # solo el autotest

POR QUE EXISTE. El pendiente "migrar los generadores a la tipografia de marca" lleva
abierto desde el 02-sep y su contador vivia a mano en un doc ("3 de 12 hechos"), o sea
que nadie sabia el numero real y nada se ponia rojo. Medido con esto el 2026-09-05:
20 de 28 archivos, 21 declaraciones. El doc decia 12 archivos en total.

DOS CLASES DE SUJETO, y separarlas por CONTEXTO y no por una lista de exentos:
  · `generar-*.py` son generadores de PRODUCCION: si renderizan con el eje rechazado,
    es ROJO. Cada pieza que salga de ahi nace con el defecto.
  · `experimento-*.py` renderiza a proposito la variante mala como el lado "antes" de
    un A/B — son los que PROBARON que el condensed no iba. Ponerlos en rojo obliga a
    borrar la evidencia, asi que salen como AVISO.

⚠️ ESTE INSTRUMENTO YA FALLO UNA VEZ EN VERDE, y el fallo es la parte que importa. La
primera version capturaba el valor con `[^;"']+`, y `font-variation-settings` SIEMPRE
lleva los ejes entre comillas: cortaba antes del primer eje y devolvia "(ninguna)" con
21 defectos presentes. No lo cazo el resultado -que parecia una buena noticia- sino la
prueba en las dos direcciones. Por eso el autotest corre ANTES del veredicto y aborta:
un chequeo de tipografia que no puede ver un defecto es peor que no tenerlo.

NO se cablea a `npm test` de la raiz mientras el contador sea > 0: eso pondria main en
rojo y trabaria el merge de los 15 carriles por una deuda de este carril.
"""
import re
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
GEN = RAIZ / "scripts/marca-personal"

# Solo la declaracion que RENDERIZA. El rango de ejes de la URL de la fuente
# (`family=Archivo:wdth,wght@62..125,100..900`) es la declaracion legitima del archivo
# variable y NO es un defecto: confundirlos marca los 28 archivos y el gate se ignora.
FVS = re.compile(r"font-variation-settings\s*:\s*([^;\n]+)", re.I)
EJE = re.compile(r"['\"](wght|wdth)['\"]\s*(\d+)")

RECHAZADO = "Sergio 02-sep: nada de black 900 ni condensed 62"


def infracciones(texto, archivo=""):
    """(archivo, linea, eje, valor, declaracion) por cada eje rechazado que se pinta."""
    out = []
    for m in FVS.finditer(texto):
        for eje, val in EJE.findall(m.group(1)):
            v = int(val)
            if (eje == "wght" and v >= 800) or (eje == "wdth" and v <= 75):
                out.append((archivo, texto[: m.start()].count("\n") + 1, eje, v, m.group(1).strip()[:60]))
    return out


def autotest():
    assert infracciones("font-variation-settings: 'wght' 900, 'wdth' 62;"), \
        "ciego al defecto (es como esta comprobacion fallo en verde la primera vez)"
    assert not infracciones("family=Archivo:wdth,wght@62..125,100..900"), \
        "confunde el rango de ejes de la fuente con una declaracion"
    assert not infracciones("font-variation-settings: 'wght' 650, 'wdth' 96;"), \
        "rojo sobre la tipografia de marca correcta"
    assert infracciones('font-variation-settings:"wdth" 62;'), "ciego a las comillas dobles"
    return True


def main():
    autotest()
    if "--test" in sys.argv:
        print("autotest OK (4 direcciones)")
        return 0

    rojo, aviso = [], []
    # Este archivo se excluye a si mismo: sus fixtures de autotest LLEVAN la
    # declaracion rechazada a proposito, y sin esto el chequeo nace en rojo por su
    # propia prueba. Se excluye por __file__, no por una lista de nombres, para que no
    # se desincronice si alguien lo renombra.
    archivos = sorted(f for f in GEN.glob("*.py") if f.name != Path(__file__).name)
    for f in archivos:
        for hit in infracciones(f.read_text(encoding="utf-8"), f.name):
            (aviso if f.name.startswith("experimento-") else rojo).append(hit)

    for etiqueta, grupo in (("ROJO  ", rojo), ("aviso ", aviso)):
        for a, l, e, v, d in grupo:
            print(f"{etiqueta} {a}:{l}  {e}={v}  ->  {d}")

    limpios = len(archivos) - len({h[0] for h in rojo + aviso})
    print(f"\n{RECHAZADO}")
    print(f"generadores de produccion en rojo: {len({h[0] for h in rojo})}  ·  "
          f"experimentos con la variante vieja (esperado): {len({h[0] for h in aviso})}  ·  "
          f"limpios: {limpios} de {len(archivos)}")
    return 1 if rojo else 0


if __name__ == "__main__":
    raise SystemExit(main())
