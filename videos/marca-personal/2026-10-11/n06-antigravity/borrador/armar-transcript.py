#!/usr/bin/env python3
"""armar-transcript.py — transcript de Whisper (tiempo del BRUTO) -> segments-cut.json (tiempo de SALIDA del cutplan).

Pasos (todo determinista, sin red, sin modelos):
  1. toma las palabras de segments[].words[] ({w,s,e} del bruto);
  2. ajusta cada palabra a la voz real: ni empieza ni termina dentro de un silencio medido por el cutplan
     (campo "silences", silencedetect -35 dB >= 0,3 s). Whisper small corre los bordes de palabra hasta 0,4 s;
  3. se queda con lo que cae en los bloques "keep" y resta el desplazamiento acumulado de los bloques anteriores
     (una palabra que cruza un micro-recorte queda continua: empieza en su primer bloque y termina en el último);
  4. aplica arreglos.json A NIVEL DE TEXTO (frases de Whisper -> mejor lectura). Los marcadores [?] y [¿...?]
     NO llegan a los subtítulos; lo dudoso se lista aparte en palabras-a-confirmar.txt con el segundo del bruto;
  5. verifica: ninguna palabra sin tiempo, ningún tiempo que retroceda, nada fuera de la duración del corte.

Uso:
  python3 armar-transcript.py --transcript ../transcript-whisper-small.json --cutplan ../cutplan.json \
      --arreglos arreglos.json --extra dudosas-extra.json --out segments-cut.json --dudosas palabras-a-confirmar.txt
Si el corte cambia, se vuelve a correr con el cutplan nuevo: todo lo demás sale de ahí.
"""
from __future__ import annotations

import argparse
import difflib
import json
import re
import sys
from pathlib import Path

MIN_DUR = 0.04


def norm(s: str) -> str:
    return re.sub(r"[\[\]¿?¡!.,;:«»\"()]", "", s.lower()).strip()


def limpiar_marca(tok: str) -> str:
    """Quita [?] y [¿ ... ?] del texto de un reemplazo (no llegan a los subtítulos)."""
    return re.sub(r"[\[\]¿?]", "", tok).strip()


def cargar_palabras(path: Path):
    tr = json.loads(path.read_text())
    out = []
    for seg in tr["segments"]:
        for w in seg["words"]:
            out.append({"w": w["w"].strip(), "s": float(w["s"]), "e": float(w["e"])})
    return out


def ajustar_a_voz(words, silences):
    """Ni el inicio ni el fin de una palabra caen dentro de un silencio medido."""
    cambios = 0
    for w in words:
        for a, b in silences:
            if a - 1e-6 <= w["s"] < b - 1e-6 and w["e"] > b:
                w["s"] = b; cambios += 1
            if a + 1e-6 < w["e"] <= b + 1e-6 and w["s"] < a:
                w["e"] = a; cambios += 1
        if w["e"] - w["s"] < MIN_DUR:
            w["e"] = w["s"] + MIN_DUR
    return cambios


def a_salida(words, keeps):
    """Bruto -> salida. Devuelve palabras con 'start'/'end' (y 'bs'/'be' = segundos del bruto sin ajustar)."""
    bloques, acc = [], 0.0
    for k in keeps:
        bloques.append((k["start"], k["end"], acc))
        acc += k["end"] - k["start"]
    total = acc
    out, perdidas = [], []
    for w in words:
        sup = [(a, b, o) for a, b, o in bloques if w["e"] > a + 1e-6 and w["s"] < b - 1e-6]
        if not sup:
            perdidas.append(w)
            continue
        a0, b0, o0 = sup[0]
        a1, b1, o1 = sup[-1]
        s = o0 + (max(w["s"], a0) - a0)
        e = o1 + (min(w["e"], b1) - a1)
        out.append({"word": w["w"], "start": round(s, 3), "end": round(max(e, s + MIN_DUR), 3),
                    "bruto": round(w["s"], 2)})
    return out, total, perdidas


def reemplazar(words, clave: str, valor: str):
    """Aplica un reemplazo de texto sobre la secuencia de palabras. Devuelve cuántas veces calzó."""
    kt = [norm(t) for t in clave.split() if norm(t)]
    if not kt:
        return 0
    nuevos = [t for t in (limpiar_marca(x) for x in valor.split()) if t]
    veces = 0
    i = 0
    while i <= len(words) - len(kt):
        if [norm(words[i + j]["word"]) for j in range(len(kt))] != kt:
            i += 1
            continue
        viejas = words[i:i + len(kt)]
        punt_final = re.search(r"[.,;:?!]+$", viejas[-1]["word"])
        res = unir(viejas, nuevos, punt_final.group(0) if punt_final else "")
        words[i:i + len(kt)] = res
        veces += 1
        i += len(res)
    return veces


def unir(viejas, nuevos, punt_final):
    """viejas: palabras con tiempo; nuevos: textos. Reparte los tiempos conservando orden y monotonía."""
    if [norm(v["word"]) for v in viejas] == [norm(n) for n in nuevos]:
        res = [dict(v, word=n) for v, n in zip(viejas, nuevos)]
    elif len(viejas) == len(nuevos):
        res = [dict(v, word=n) for v, n in zip(viejas, nuevos)]
    else:
        res = []
        sm = difflib.SequenceMatcher(a=[norm(v["word"]) for v in viejas], b=[norm(n) for n in nuevos], autojunk=False)
        for op, i1, i2, j1, j2 in sm.get_opcodes():
            if op == "equal":
                res += [dict(viejas[i1 + k], word=nuevos[j1 + k]) for k in range(i2 - i1)]
            elif op == "delete":
                continue
            elif op == "insert":
                ref = res[-1] if res else viejas[0]
                t = ref["end"]
                res += [dict(ref, word=n, start=t, end=t + MIN_DUR) for n in nuevos[j1:j2]]
            else:
                grupo = viejas[i1:i2]
                nn = nuevos[j1:j2]
                t0, t1 = grupo[0]["start"], grupo[-1]["end"]
                if len(nn) <= len(grupo):  # fusionar: cada nuevo toma un tramo contiguo de viejas
                    cortes = [round(k * len(grupo) / len(nn)) for k in range(len(nn) + 1)]
                    for k, n in enumerate(nn):
                        g = grupo[cortes[k]:cortes[k + 1]]
                        res.append(dict(g[0], word=n, start=g[0]["start"], end=g[-1]["end"]))
                else:  # repartir por largo de letras
                    pesos = [max(1, len(n)) for n in nn]
                    tot, t = sum(pesos), t0
                    for n, p in zip(nn, pesos):
                        d = (t1 - t0) * p / tot
                        res.append(dict(grupo[0], word=n, start=round(t, 3), end=round(t + d, 3)))
                        t += d
    if punt_final and not re.search(r"[.,;:?!]$", res[-1]["word"]):
        res[-1] = dict(res[-1], word=res[-1]["word"] + punt_final)
    return res


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--transcript", required=True)
    ap.add_argument("--cutplan", required=True)
    ap.add_argument("--arreglos", required=True)
    ap.add_argument("--extra", help="json {frase: motivo} de lecturas dudosas que no vienen en arreglos.json")
    ap.add_argument("--out", required=True)
    ap.add_argument("--dudosas", help="txt con las palabras a confirmar con el audio")
    ap.add_argument("--sin-ajuste-silencios", action="store_true")
    a = ap.parse_args()

    cp = json.loads(Path(a.cutplan).read_text())
    keeps = cp["keep"]
    words = cargar_palabras(Path(a.transcript))
    n_ajustes = 0 if a.sin_ajuste_silencios else ajustar_a_voz(
        words, [(s["start"], s["end"]) for s in cp.get("silences", [])])
    sal, total, perdidas = a_salida(words, keeps)
    if perdidas:
        print("AVISO palabras de Whisper que caen enteras en un tramo que el corte tira:",
              [(p["w"], p["s"]) for p in perdidas])

    arreglos = json.loads(Path(a.arreglos).read_text())
    dudosas = []
    for clave, valor in arreglos.items():
        veces = reemplazar(sal, clave, valor)
        marcado = "[?]" in valor or "[¿" in valor
        print(f"  arreglo «{clave}» -> «{limpiar_marca(valor)}»: {veces} vez/veces" + (" (dudoso)" if marcado else ""))
        if veces and marcado:
            dudosas.append((clave, valor))
        if not veces and norm(clave.replace("[?]", "")) != norm(limpiar_marca(valor)):
            print(f"    AVISO: «{clave}» no calza en el transcript del corte")

    # verificación
    problemas = []
    prev_e = 0.0
    for i, w in enumerate(sal):
        if w.get("start") is None or w.get("end") is None:
            problemas.append(f"sin tiempo: {w}")
            continue
        if w["end"] <= w["start"]:
            problemas.append(f"duración <= 0: {w['word']} {w['start']}-{w['end']}")
        if w["start"] < prev_e - 1e-3:
            # solapes de unas centésimas entre vecinas: se corrige empujando el inicio
            w["start"] = round(prev_e, 3)
            if w["end"] <= w["start"]:
                w["end"] = round(w["start"] + MIN_DUR, 3)
        prev_e = w["end"]
        if w["end"] > total + 0.05:
            problemas.append(f"termina después del corte ({total:.2f}): {w}")
    for i in range(1, len(sal)):
        if sal[i]["start"] < sal[i - 1]["start"]:
            problemas.append(f"el tiempo retrocede en {sal[i]['word']}")
    if problemas:
        print("PROBLEMAS:", *problemas, sep="\n  ")
        sys.exit(1)

    limpio = [{"word": w["word"], "start": w["start"], "end": w["end"]} for w in sal]
    Path(a.out).write_text(json.dumps({"words": limpio}, ensure_ascii=False, indent=1))
    print(f"OK {len(limpio)} palabras · {limpio[0]['start']:.2f}-{limpio[-1]['end']:.2f} de {total:.2f} s · "
          f"{n_ajustes} bordes ajustados a la voz · -> {a.out}")

    if a.dudosas:
        # segundo del bruto de cada lectura dudosa: la palabra del transcript original que la origina
        orig = cargar_palabras(Path(a.transcript))
        lin = ["Palabras a confirmar con el audio (segundo del BRUTO). Subtítulo = mejor lectura.", ""]
        pares = list(dudosas)
        if a.extra and Path(a.extra).exists():
            pares += [(k, "{" + v + "}") for k, v in json.loads(Path(a.extra).read_text()).items()]
        for clave, valor in pares:
            kt = [norm(t) for t in clave.split() if norm(t)]
            for i in range(len(orig) - len(kt) + 1):
                if [norm(orig[i + j]["w"]) for j in range(len(kt))] == kt:
                    s, e = orig[i]["s"], orig[i + len(kt) - 1]["e"]
                    en_corte = any(s < k["end"] and e > k["start"] for k in keeps)
                    lin.append(f"bruto {s:6.2f}-{e:6.2f} s  Whisper oyó «{clave}»  ->  "
                               f"{('motivo: ' + valor[1:-1]) if valor.startswith('{') else 'subtítulo dice «' + limpiar_marca(valor) + '»'}"
                               + ("" if en_corte else "  (este tramo hoy NO está en el corte)"))
        Path(a.dudosas).write_text("\n".join(lin) + "\n")
        print("->", a.dudosas)


if __name__ == "__main__":
    main()
