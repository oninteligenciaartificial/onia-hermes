#!/usr/bin/env python3
"""variantes.py — deriva el storyboard de render a partir de storyboard.json.

  - assets -> rutas absolutas (el storyboard de render vive fuera del repo, en $S);
  - quita los eventos con `fuera_si` cuando esa opción de corte está activa;
  - copia a corte.quitar los cortes opcionales activos (variables / repetido).
Sin opciones el resultado es el storyboard tal cual (nada opcional se aplica por defecto).
Uso: python3 variantes.py --storyboard storyboard.json --out $S/storyboard-render.json [--variables] [--repetido]
"""
import argparse
import json
from pathlib import Path

ap = argparse.ArgumentParser()
ap.add_argument("--storyboard", required=True)
ap.add_argument("--out", required=True)
ap.add_argument("--variables", action="store_true", help="QUITAR_VARIABLES=1: corta la frase de las variables")
ap.add_argument("--repetido", action="store_true", help="QUITAR_REPETIDO=1: corta el tramo repetido (bruto 01:04-01:23)")
a = ap.parse_args()

src = Path(a.storyboard).resolve()
sb = json.loads(src.read_text())
activas = [k for k, v in (("variables", a.variables), ("repetido", a.repetido)) if v]
sb["assets"] = [str((src.parent / x).resolve()) for x in sb.get("assets", [])]
antes = len(sb["eventos"])
sb["eventos"] = [e for e in sb["eventos"] if not (set(e.get("fuera_si", [])) & set(activas))]
for e in sb["eventos"]:
    e.pop("fuera_si", None)
quitar = list(sb["corte"].get("quitar", []))
for k in activas:
    quitar += sb.get("corte_opcional", {}).get(k, [])
sb["corte"] = dict(sb["corte"], quitar=quitar)
Path(a.out).write_text(json.dumps(sb, ensure_ascii=False, indent=1))
print(f"storyboard de render -> {a.out} · cortes opcionales activos: {activas or 'ninguno'} · "
      f"eventos {antes} -> {len(sb['eventos'])}")
