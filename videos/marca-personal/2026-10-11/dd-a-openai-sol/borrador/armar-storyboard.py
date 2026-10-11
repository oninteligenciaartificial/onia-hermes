#!/usr/bin/env python3
"""armar-storyboard.py — deja el storyboard listo para santiago.py con la variante de cierre elegida.

storyboard.json trae la escena «cta» con la variante A (lo que dice el audio) y `cierre_alternativa_B` con la B.
`--cierre A` copia tal cual; `--cierre B` reemplaza los elementos de la escena «cta» por los de la alternativa B.
Escribe el resultado en --out (santiago.py lo lee con --assets apuntando a borrador/capturas)."""
import argparse
import json
import sys
from pathlib import Path

AQUI = Path(__file__).resolve().parent


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("--storyboard", default=str(AQUI / "storyboard.json"))
    ap.add_argument("--cierre", choices=["A", "B"], default=None, help="default: el del storyboard (A)")
    ap.add_argument("--out", required=True)
    a = ap.parse_args()
    sb = json.loads(Path(a.storyboard).read_text())
    var = a.cierre or sb.get("cierre", {}).get("variante_por_defecto", "A")
    if var == "B":
        alt = sb["cierre_alternativa_B"]
        esc = next((e for e in sb["escenas"] if e["id"] == alt["escena"]), None)
        if esc is None:
            sys.exit(f"armar-storyboard: no hay escena «{alt['escena']}»")
        esc["elementos"] = alt["elementos"]
    sb["titulo"] = f"{sb.get('titulo', '')} · cierre {var}"
    Path(a.out).write_text(json.dumps(sb, ensure_ascii=False, indent=1) + "\n")
    print(f"storyboard con cierre {var} -> {a.out}")


if __name__ == "__main__":
    main()
