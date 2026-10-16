#!/usr/bin/env python3
"""Saca de un cutplan.json de editor-videos los tramos de una toma que NO se usa (una toma abortada, una repetición).

    python3 filtrar-cutplan.py cutplan.json --quita 0:73.5 [--quita a:b ...]

cut-plan.mjs decide por silencio y por muletillas, pero no sabe que Sergio Urcullo arrancó dos veces el mismo texto
(N07, 11-oct: primera toma hasta 72,4 s, «¡Mierda!», y la segunda completa desde 74,1 s). Esa decisión es de la persona
que mira la transcripción: acá se aplica y queda escrita en el cutplan (`quitados`).
"""
import argparse
import json

ap = argparse.ArgumentParser()
ap.add_argument("cutplan")
ap.add_argument("--quita", action="append", required=True, help="inicio:fin en segundos del bruto")
a = ap.parse_args()
plan = json.load(open(a.cutplan, encoding="utf-8"))
rangos = [tuple(float(x) for x in r.split(":")) for r in a.quita]
keep = []
for k in plan["keep"]:
    trozos = [(k["start"], k["end"])]
    for (qa, qb) in rangos:
        nuevo = []
        for (s, e) in trozos:
            if qb <= s or qa >= e:
                nuevo.append((s, e))
                continue
            if qa > s:
                nuevo.append((s, qa))
            if qb < e:
                nuevo.append((qb, e))
        trozos = nuevo
    keep += [{"start": round(s, 2), "end": round(e, 2)} for (s, e) in trozos if e - s >= 0.35]
plan["quitados"] = [{"start": s, "end": e} for (s, e) in rangos]
plan["keep"] = keep
plan["finalDur"] = round(sum(k["end"] - k["start"] for k in keep), 2)
json.dump(plan, open(a.cutplan, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
print(f"{len(keep)} bloques, {plan['finalDur']} s")
