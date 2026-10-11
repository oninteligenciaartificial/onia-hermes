#!/usr/bin/env python3
"""hacer-segments.py — transcript de Whisper (tiempo del BRUTO) -> segments-cut.json (tiempo de SALIDA del cutplan).

Pasos (todo determinista, un solo comando):
 1. junta las palabras de transcript-whisper-small.json y pega las que Whisper partió ('6' + '.1' -> '6.1', '2' + '.000');
 2. aplica arreglos.json a nivel de texto (frase mal oída -> frase corregida). Un '[?]' en el reemplazo marca la palabra
    ANTERIOR como dudosa: NO va al subtítulo, va a dudosas.json (con el segundo del bruto) para confirmarla con el audio;
 3. mapea cada palabra al corte: el inicio que cae en un hueco que el cutplan tiró se corre al arranque de voz del bloque
    siguiente (start + pad); el final que cae en un hueco se corre al fin de voz del bloque anterior (end - pad);
 4. resta el desplazamiento acumulado de los bloques anteriores y verifica: ninguna palabra sin tiempo, ningún tiempo que
    retroceda, nada fuera de la duración del corte.

Uso:  python3 hacer-segments.py [--transcript T] [--cutplan C] [--arreglos A] [--out segments-cut.json]
Los defaults son relativos a esta carpeta (borrador/), así que si el corte cambia basta con reemplazar ../cutplan.json.
"""
import argparse
import json
import re
import sys
from pathlib import Path

AQUI = Path(__file__).resolve().parent
PIEZA = AQUI.parent


def norm(s):
    return re.sub(r"[¿?¡!.,;:«»\"()]", "", s.lower()).strip()


def palabras_del_bruto(tr):
    """Lista plana [{word, s, e}] en tiempo del bruto, con los pedazos numéricos de Whisper pegados."""
    out = []
    for seg in tr["segments"]:
        for w in seg["words"]:
            txt = w["w"].strip()
            if not txt:
                continue
            if out and re.match(r"^\.\d", txt) and re.search(r"\d$", out[-1]["word"]):
                out[-1] = {"word": out[-1]["word"] + txt, "s": out[-1]["s"], "e": w["e"], "dudosa": False}
                continue
            out.append({"word": txt, "s": float(w["s"]), "e": float(w["e"]), "dudosa": False})
    return out


def aplicar_arreglos(ws, arreglos, bruto_norm=()):
    """Reemplazos de texto sobre la secuencia de palabras. Conserva tiempos: palabras iguales, 1:1; si cambia la
    cantidad, el tramo distinto reparte el tiempo de las viejas en proporción al largo de las nuevas."""
    for malo, bueno in arreglos.items():
        clave = [norm(t) for t in malo.split()]
        nuevo = bueno.split()
        # índice de la palabra dudosa (la anterior a cada '[?]') ya sin los '[?]'
        dud_idx, k = set(), 0
        for t in nuevo:
            if t == "[?]":
                dud_idx.add(k - 1)
            else:
                k += 1
        nuevo = [t for t in nuevo if t != "[?]"]
        hallado = False
        for i in range(len(ws) - len(clave) + 1):
            if [norm(w["word"]) for w in ws[i:i + len(clave)]] != clave:
                continue
            hallado = True
            viejas = ws[i:i + len(clave)]
            # prefijo y sufijo en común (por texto normalizado)
            p = 0
            while p < len(viejas) and p < len(nuevo) and norm(viejas[p]["word"]) == norm(nuevo[p]):
                p += 1
            q = 0
            while (q < len(viejas) - p and q < len(nuevo) - p
                   and norm(viejas[len(viejas) - 1 - q]["word"]) == norm(nuevo[len(nuevo) - 1 - q])):
                q += 1
            med_v, med_n = viejas[p:len(viejas) - q], nuevo[p:len(nuevo) - q]
            punt_final = re.search(r"[.,;:?!]+$", viejas[-1]["word"])
            reemp = []
            for j in range(p):  # prefijo igual: se queda como estaba (mantiene su puntuación)
                reemp.append(dict(viejas[j]))
            if med_n:
                a, b = med_v[0]["s"], med_v[-1]["e"]
                if len(med_n) == len(med_v):
                    tiempos = [(w["s"], w["e"]) for w in med_v]
                else:
                    lens = [max(1, len(t)) for t in med_n]
                    tot, acu, tiempos = sum(lens), a, []
                    for L in lens:
                        d = (b - a) * L / tot
                        tiempos.append((acu, acu + d))
                        acu += d
                for t, (s, e) in zip(med_n, tiempos):
                    reemp.append({"word": t, "s": s, "e": e, "dudosa": False})
            for j in range(len(viejas) - q, len(viejas)):  # sufijo igual
                reemp.append(dict(viejas[j]))
            # la puntuación del final de la frase vieja se conserva si el reemplazo no la trae
            if punt_final and not re.search(r"[.,;:?!]$", reemp[-1]["word"]):
                reemp[-1]["word"] += punt_final.group(0)
            # dudosas: posición dentro de `nuevo` -> palabra de `reemp` (mismas posiciones: reemp sigue el orden de nuevo)
            for d in dud_idx:
                if 0 <= d < len(reemp):
                    reemp[d]["dudosa"] = True
                    reemp[d]["antes"] = malo
            ws[i:i + len(clave)] = reemp
            break
        if not hallado:
            # si la frase existe en el transcript del bruto pero el corte la dejó afuera, no es un error: el corte cambió
            n = len(clave)
            if any(list(bruto_norm[i:i + n]) == clave for i in range(len(bruto_norm) - n + 1)):
                print(f"  ⚠ el arreglo «{malo}» ya no entra en el corte (sus palabras quedaron en un hueco tirado): se salta")
                continue
            sys.exit(f"hacer-segments: el arreglo «{malo}» no aparece en el transcript (¿cambió el transcript?)")
    return ws


def mapa(keep):
    """[(bruto_a, bruto_b, salida_a)] por bloque."""
    out, acu = [], 0.0
    for k in keep:
        out.append((k["start"], k["end"], acu))
        acu += k["end"] - k["start"]
    return out, acu


def a_salida(t, bloques, pad, fin):
    """Tiempo del bruto -> tiempo de salida. Si cae en un hueco tirado: inicio -> arranque de voz del bloque siguiente
    (a + pad); fin -> fin de voz del bloque anterior (b - pad)."""
    for a, b, o in bloques:
        if a - 1e-9 <= t <= b + 1e-9:
            return o + (t - a)
    if not fin:
        for a, b, o in bloques:
            if a > t:
                return o + min(pad, b - a)
        return bloques[-1][2] + (bloques[-1][1] - bloques[-1][0])
    prev = None
    for a, b, o in bloques:
        if b < t:
            prev = (a, b, o)
    if prev is None:
        return 0.0
    a, b, o = prev
    return o + max(0.0, (b - a) - pad)


def a_bruto(t, bloques):
    """Tiempo de salida -> tiempo del bruto (para decirle a Sergio Urcullo dónde escuchar)."""
    for a, b, o in bloques:
        if o - 1e-9 <= t <= o + (b - a) + 1e-9:
            return a + (t - o)
    a, b, o = bloques[-1]
    return b


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("--transcript", default=str(PIEZA / "transcript-whisper-small.json"))
    ap.add_argument("--cutplan", default=str(PIEZA / "cutplan.json"))
    ap.add_argument("--arreglos", default=str(AQUI / "arreglos.json"))
    ap.add_argument("--out", default=str(AQUI / "segments-cut.json"))
    ap.add_argument("--dudosas", default=str(AQUI / "dudosas.json"))
    a = ap.parse_args()

    cp = json.loads(Path(a.cutplan).read_text())
    keep, pad = cp["keep"], float(cp.get("pad", 0.12))
    ws = palabras_del_bruto(json.loads(Path(a.transcript).read_text()))
    n_bruto = len(ws)
    bruto_norm = [norm(w["word"]) for w in ws]
    bloques, total = mapa(keep)

    # 1) bruto -> salida, palabra por palabra (Whisper corre los bordes sobre los silencios que el corte tiró)
    words, descartadas = [], []
    for w in ws:
        # una palabra cuenta si toca algún bloque; si cae entera en un hueco tirado, se descarta y se avisa
        if not any(max(w["s"], a_) <= min(w["e"], b_) + 1e-9 for a_, b_, _ in bloques):
            descartadas.append((w["word"], w["s"], w["e"]))
            continue
        s_ = a_salida(w["s"], bloques, pad, fin=False)
        e_ = a_salida(w["e"], bloques, pad, fin=True)
        words.append({"word": w["word"], "s": s_, "e": max(e_, s_ + 0.04), "dudosa": False})
    # 2) arreglos de texto YA en tiempo de salida (si una palabra se parte en dos, el reparto cae donde hay voz)
    words = aplicar_arreglos(words, json.loads(Path(a.arreglos).read_text()), bruto_norm)
    words = [{"word": w["word"], "start": w["s"], "end": w["e"], "_dudosa": w.get("dudosa", False),
              "_antes": w.get("antes")} for w in words]
    dudosas = []
    # tiempos que no retroceden: cada palabra arranca cuando termina la anterior como pronto
    prev = 0.0
    for w in words:
        if w["start"] < prev:
            w["start"] = prev
        if w["end"] < w["start"] + 0.04:
            w["end"] = w["start"] + 0.04
        prev = w["end"]
    # verificación
    problemas = []
    for i, w in enumerate(words):
        if not (0 <= w["start"] < w["end"] <= total + 0.05):
            problemas.append(f"palabra {i} «{w['word']}» fuera de rango: {w['start']:.3f}-{w['end']:.3f} (corte {total:.2f})")
        if i and w["start"] < words[i - 1]["end"] - 1e-9:
            problemas.append(f"palabra {i} «{w['word']}» retrocede")
        if w["_dudosa"]:
            dudosas.append({"palabra": w["word"], "bruto_s": round(a_bruto(w["start"], bloques), 2),
                            "bruto_e": round(a_bruto(w["end"], bloques), 2), "salida_s": round(w["start"], 2),
                            "whisper_oyo": w["_antes"]})
    if problemas:
        sys.exit("hacer-segments: " + "; ".join(problemas))

    out = {"nota": "tiempo de SALIDA del cutplan; generado por hacer-segments.py (no editar a mano)",
           "corte_s": round(total, 3),
           "words": [{"word": w["word"], "start": round(w["start"], 3), "end": round(w["end"], 3)} for w in words]}
    Path(a.out).write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n")
    Path(a.dudosas).write_text(json.dumps(dudosas, ensure_ascii=False, indent=1) + "\n")
    print(f"palabras: bruto {n_bruto} -> salida {len(words)} · descartadas {len(descartadas)} · corte {total:.2f} s")
    for d in descartadas:
        print(f"  ⚠ descartada (cae entera en un hueco tirado): «{d[0]}» {d[1]:.2f}-{d[2]:.2f}")
    for d in dudosas:
        print(f"  ? dudosa: «{d['palabra']}» bruto {d['bruto_s']}-{d['bruto_e']} s (Whisper oyó: «{d['whisper_oyo']}»)")
    print(f"OK -> {a.out}")


if __name__ == "__main__":
    main()
