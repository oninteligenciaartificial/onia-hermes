#!/usr/bin/env python3
"""armar-transcript.py (N07) — transcript de Whisper (tiempo del BRUTO) -> segments-cut.json (tiempo de SALIDA del cutplan).

Es el de N06 (`n06-antigravity/borrador/armar-transcript.py`) con tres cambios que pidió N07:
  (a) pega los pedazos numéricos que Whisper parte («5» + «.5» -> «5.5», «4» + «.5» -> «4.5»), como en DD-A;
  (b) cuando un arreglo cambia la cantidad de palabras, el tiempo de TODO el tramo viejo se reparte entre las nuevas por largo de
      letras (antes las palabras que sobraban le prestaban su tiempo a la que sigue y esa arrancaba antes de tiempo en el karaoke:
      «claude-haiku-5-5» tiene que cubrir lo que Sergio dijo, no dejarle su tiempo a «y»);
  (c) la lista de palabras a confirmar sale con el segundo del BRUTO de cada lectura dudosa y la frase que oyó Whisper.

Pasos (todo determinista, sin red, sin modelos):
  1. junta las palabras de segments[].words[] ({w,s,e} del bruto) y pega los pedazos numéricos;
  2. ajusta cada palabra a la voz real: ni empieza ni termina dentro de un silencio medido por el cutplan
     (campo "silences", silencedetect -35 dB >= 0,3 s). Whisper small corre los bordes de palabra hasta 0,4 s;
  3. se queda con lo que cae en los bloques "keep" y resta el desplazamiento acumulado de los bloques anteriores
     (una palabra que cruza un micro-recorte queda continua: empieza en su primer bloque y termina en el último);
  4. aplica arreglos.json A NIVEL DE TEXTO (frases de Whisper -> mejor lectura). Los marcadores [?] y [¿...?]
     NO llegan a los subtítulos; lo dudoso se lista aparte en palabras-a-confirmar.txt con el segundo del bruto;
  5. verifica: ninguna palabra sin tiempo, ningún tiempo que retroceda, nada fuera de la duración del corte.

Uso (las rutas por defecto son relativas a esta carpeta, así que si el corte cambia basta con reemplazar ../cutplan.json):
  python3 armar-transcript.py [--transcript ../transcript-whisper-small.json] [--cutplan ../cutplan.json]
      [--arreglos arreglos.json] [--extra dudosas-extra.json] [--out segments-cut.json] [--dudosas palabras-a-confirmar.txt]
"""
from __future__ import annotations

import argparse
import difflib
import json
import re
import sys
from pathlib import Path

AQUI = Path(__file__).resolve().parent
PIEZA = AQUI.parent
MIN_DUR = 0.04


def norm(s: str) -> str:
    return re.sub(r"[\[\]¿?¡!.,;:«»\"()]", "", s.lower()).strip()


def limpiar_marca(tok: str) -> str:
    """Quita [?] y [¿ ... ?] del texto de un reemplazo (no llegan a los subtítulos)."""
    return re.sub(r"\s+", " ", re.sub(r"\[\?\]|\[¿[^\]]*\]", "", tok)).strip()


def cargar_palabras(path: Path):
    """Palabras del bruto [{w,s,e}], con los pedazos numéricos de Whisper pegados («5» + «.5» -> «5.5»)."""
    tr = json.loads(path.read_text())
    out = []
    for seg in tr["segments"]:
        for w in seg["words"]:
            txt = w["w"].strip()
            if not txt:
                continue
            if out and re.match(r"^\.\d+[.,;:?!]*$", txt) and re.search(r"\d$", out[-1]["w"]):
                out[-1] = {"w": out[-1]["w"] + txt, "s": out[-1]["s"], "e": float(w["e"])}
                continue
            out.append({"w": txt, "s": float(w["s"]), "e": float(w["e"])})
    return out


def ajustar_a_voz(words, silences):
    """Ni el inicio ni el fin de una palabra caen dentro de un silencio medido. Devuelve cuántos bordes movió."""
    cambios = 0
    for w in words:
        for a, b in silences:
            if a - 1e-6 <= w["s"] < b - 1e-6 and w["e"] > b:
                w["s"] = b
                cambios += 1
            if a + 1e-6 < w["e"] <= b + 1e-6 and w["s"] < a:
                w["e"] = a
                cambios += 1
        if w["e"] - w["s"] < MIN_DUR:
            w["e"] = w["s"] + MIN_DUR
    return cambios


def a_salida(words, keeps):
    """Bruto -> salida. Devuelve palabras con 'start'/'end' y 'bruto' (segundo del bruto donde empieza la palabra)."""
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
        out.append({"word": w["w"], "start": round(s, 3), "end": round(max(e, s + MIN_DUR), 3), "bruto": round(w["s"], 2)})
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


def repartir(grupo, nn):
    """El tiempo de TODO el tramo viejo (de su primera palabra al fin de la última) se reparte entre las palabras nuevas
    por largo de letras. Conserva orden y monotonía, y no le presta tiempo a la palabra que sigue."""
    t0, t1 = grupo[0]["start"], grupo[-1]["end"]
    pesos = [max(1, len(n)) for n in nn]
    tot, t, res = sum(pesos), t0, []
    for k, (n, p) in enumerate(zip(nn, pesos)):
        d = (t1 - t0) * p / tot
        fin = t1 if k == len(nn) - 1 else t + d
        res.append(dict(grupo[0], word=n, start=round(t, 3), end=round(max(fin, t + MIN_DUR), 3)))
        t += d
    return res


def unir(viejas, nuevos, punt_final):
    """viejas: palabras con tiempo; nuevos: textos. Reparte los tiempos conservando orden y monotonía."""
    if len(viejas) == len(nuevos):
        res = [dict(v, word=n) for v, n in zip(viejas, nuevos)]
    else:
        res = []
        sm = difflib.SequenceMatcher(a=[norm(v["word"]) for v in viejas], b=[norm(n) for n in nuevos], autojunk=False)
        for op, i1, i2, j1, j2 in sm.get_opcodes():
            if op == "equal":
                res += [dict(viejas[i1 + k], word=nuevos[j1 + k]) for k in range(i2 - i1)]
            elif op == "delete":
                # palabras que se sacan: su tiempo se lo queda la palabra de antes (si no hay, se pierde: nadie lo habla)
                if res:
                    res[-1] = dict(res[-1], end=max(res[-1]["end"], viejas[i2 - 1]["end"]))
            elif op == "insert":
                ref = res[-1] if res else viejas[0]
                t = ref["end"]
                res += [dict(ref, word=n, start=t, end=t + MIN_DUR) for n in nuevos[j1:j2]]
            else:  # replace
                grupo, nn = viejas[i1:i2], nuevos[j1:j2]
                if len(grupo) == len(nn):
                    res += [dict(g, word=n) for g, n in zip(grupo, nn)]
                else:
                    res += repartir(grupo, nn)
    if punt_final and not re.search(r"[.,;:?!]$", res[-1]["word"]):
        res[-1] = dict(res[-1], word=res[-1]["word"] + punt_final)
    return res


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("--transcript", default=str(PIEZA / "transcript-whisper-small.json"))
    ap.add_argument("--cutplan", default=str(PIEZA / "cutplan.json"))
    ap.add_argument("--arreglos", default=str(AQUI / "arreglos.json"))
    ap.add_argument("--extra", default=str(AQUI / "dudosas-extra.json"),
                    help="json {frase de Whisper: motivo} de lecturas dudosas que no se tocaron en arreglos.json")
    ap.add_argument("--out", default=str(AQUI / "segments-cut.json"))
    ap.add_argument("--dudosas", default=str(AQUI / "palabras-a-confirmar.txt"))
    ap.add_argument("--sin-ajuste-silencios", action="store_true")
    a = ap.parse_args()

    cp = json.loads(Path(a.cutplan).read_text())
    keeps = cp["keep"]
    words = cargar_palabras(Path(a.transcript))
    n_ajustes = 0 if a.sin_ajuste_silencios else ajustar_a_voz(
        words, [(s["start"], s["end"]) for s in cp.get("silences", [])])
    sal, total, perdidas = a_salida(words, keeps)
    if perdidas:
        print(f"  (palabras de Whisper que caen enteras en un tramo que el corte tira: {len(perdidas)}; la primera toma completa, p. ej. "
              f"«{perdidas[0]['w']}» a {perdidas[0]['s']:.1f} s)")

    arreglos = json.loads(Path(a.arreglos).read_text())
    dudosas = []
    for clave, valor in arreglos.items():
        veces = reemplazar(sal, clave, valor)
        marcado = "[?]" in valor or "[¿" in valor
        print(f"  arreglo «{clave}» -> «{limpiar_marca(valor)}»: {veces} vez/veces" + (" (dudoso)" if marcado else ""))
        if veces and marcado:
            dudosas.append((clave, valor))
        if not veces:
            # si la frase existe en la toma descartada o en un hueco tirado, no es un error: el corte cambió
            print(f"    AVISO: «{clave}» no calza en el transcript del corte (¿quedó afuera del corte?)")

    # verificación
    problemas = []
    prev_e = 0.0
    for w in sal:
        if w.get("start") is None or w.get("end") is None:
            problemas.append(f"sin tiempo: {w}")
            continue
        if w["end"] <= w["start"]:
            problemas.append(f"duración <= 0: {w['word']} {w['start']}-{w['end']}")
        if w["start"] < prev_e - 1e-3:  # solapes de unas centésimas entre vecinas: se corrige empujando el inicio
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
        lin = ["Palabras a confirmar con el audio (segundo del BRUTO, toma 2). El subtítulo lleva la mejor lectura, sin [?].", ""]
        pares = [(k, "subtítulo dice «" + limpiar_marca(v) + "»") for k, v in dudosas]
        if a.extra and Path(a.extra).exists():
            pares += [(k, "motivo: " + v) for k, v in json.loads(Path(a.extra).read_text()).items()]
        for clave, motivo in pares:
            kt = [norm(t) for t in clave.split() if norm(t)]
            hallada = False
            for i in range(len(orig) - len(kt) + 1):
                if [norm(orig[i + j]["w"]) for j in range(len(kt))] == kt:
                    s, e = orig[i]["s"], orig[i + len(kt) - 1]["e"]
                    en_corte = any(s < k["end"] and e > k["start"] for k in keeps)
                    if not en_corte:
                        continue
                    hallada = True
                    lin.append(f"bruto {s:6.2f}-{e:6.2f} s  Whisper oyó «{clave}»  ->  {motivo}")
            if not hallada:
                lin.append(f"(sin hallar en el corte) «{clave}»  ->  {motivo}")
        Path(a.dudosas).write_text("\n".join(lin) + "\n")
        print("->", a.dudosas)


if __name__ == "__main__":
    main()
