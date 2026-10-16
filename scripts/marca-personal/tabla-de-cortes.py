#!/usr/bin/env python3
"""Tabla de cortes legible para Sergio Urcullo, a partir del cutplan.json de editor-videos/cut-plan.mjs.

La REGLA DE ORO pide mostrar la tabla de cortes + el preview 360p ANTES de cortar. `cut-plan.mjs` imprime una
tabla con el texto del segmento de Whisper (largo, igual en todas las filas); esta usa las PALABRAS con sus
tiempos y dice, por cada bloque que se conserva, qué se dice, y por cada hueco que se tira, ENTRE QUÉ palabras
cae y cuánto aire queda. Así se ve si un corte parte una frase.

    python3 tabla-de-cortes.py --cutplan cutplan.json --transcript bruto.p.json --titulo "N06 · ..." \
        [--arreglos arreglos.json] [--preview preview-360.mp4] > tabla-de-cortes.md

arreglos.json: {"se va a pagar": "se va a apagar [?]"}  → reemplazo de TEXTO sobre lo que Whisper oyó mal; lo marcado [?] se
confirma con Sergio (Whisper small oye «toque» por «token», «Cloud» por «Claude»).
Mide además el aire de los empalmes (regla 15 de edicion-referentes: aire muerto <= 0,3 s) y, si hay preview,
corre silencedetect -35 dB d=0.3 sobre él.
"""
import argparse
import json
import re
import subprocess
import sys


def fmt(s):
    return f"{int(s // 60):02d}:{s % 60:05.2f}"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--cutplan", required=True)
    ap.add_argument("--transcript", required=True)
    ap.add_argument("--titulo", default="")
    ap.add_argument("--arreglos")
    ap.add_argument("--preview")
    a = ap.parse_args()

    plan = json.load(open(a.cutplan, encoding="utf-8"))
    tr = json.load(open(a.transcript, encoding="utf-8"))
    fix = json.load(open(a.arreglos, encoding="utf-8")) if a.arreglos else {}
    words = [w for s in tr["segments"] for w in s.get("words", [])]
    keep = plan["keep"]

    def palabras(ini, fin):
        out = []
        for w in words:
            if w["e"] > ini + 0.05 and w["s"] < fin - 0.05:
                out.append(w["w"].strip())
        txt = " ".join(out)
        for k, v in fix.items():
            txt = txt.replace(k, v)
        return txt

    total = sum(k["end"] - k["start"] for k in keep)
    orig = plan.get("origDur") or tr.get("duration")
    print(f"# Tabla de cortes · {a.titulo}\n")
    print(f"Bruto {orig:.1f} s → corte {total:.1f} s (se tiran {orig - total:.1f} s). "
          f"Silencio medido en el audio: `silencedetect {plan.get('noise')}` ≥ {plan.get('minSil')} s; aire que queda en cada "
          f"empalme: {2 * plan.get('pad', 0):.2f} s (regla 15: ≤ 0,3 s). **No se cortó nada en definitivo: esto es la propuesta.**\n")
    # Se agrupan los bloques que quedan separados por menos de 0,5 s: son micro-recortes de pausas de 0,3x s
    # (invisibles) y llenan la tabla de ruido. Lo que se ve en la cara son los huecos de 0,5 s o más.
    grupos = []
    for k in keep:
        if grupos and k["start"] - grupos[-1]["fin"] < 0.5:
            g = grupos[-1]
            g["micro"].append(k["start"] - g["fin"])
            g["fin"] = k["end"]
            g["dur"] += k["end"] - k["start"]
        else:
            grupos.append({"ini": k["start"], "fin": k["end"], "dur": k["end"] - k["start"], "micro": []})
    print("| # | Bruto (entra–sale) | En el corte | Dura | Qué se dice | Lo que se tira |")
    print("|---|---|---|---|---|---|")
    t_new = 0.0
    prev_end = 0.0
    for i, g in enumerate(grupos):
        gap = g["ini"] - prev_end
        if i == 0:
            q = plan.get("quitados") or []
            if q:
                antes = (f"toma anterior descartada (bruto {fmt(q[0]['start'])}–{fmt(q[0]['end'])}: arrancó y se cortó; "
                         f"se usa la toma completa)")
            else:
                antes = f"{gap:.2f} s de silencio inicial" if gap > 0.05 else "—"
        else:
            antes = f"**{gap:.2f} s** de aire muerto antes"
        if g["micro"]:
            antes += f" · {len(g['micro'])} micro-recortes de pausas ({sum(g['micro']):.2f} s en total, de ≤ {max(g['micro']):.2f} s cada uno)"
        txt = palabras(g["ini"], g["fin"])
        if not txt.strip():
            txt = "⚠ **sin transcripción**: hay audio y Whisper no oyó palabras. ¿Frase o ruido? Se confirma con el audio; si es ruido, se corta"
        print(f"| {i + 1} | {fmt(g['ini'])}–{fmt(g['fin'])} | {fmt(t_new)}–{fmt(t_new + g['dur'])} | {g['dur']:.1f} s | "
              f"{txt} | {antes} |")
        t_new += g["dur"]
        prev_end = g["fin"]
    cola = (orig or prev_end) - prev_end
    if cola > 0.05:
        print(f"| — | {fmt(prev_end)}–{fmt(orig)} | — | — | (silencio final) | {cola:.2f} s |")

    # los huecos entre grupos son los de 0,5 s o más: los que se ven en la cara
    if len(grupos) > 1:
        print("\n**Los cortes que se ven (0,5 s o más tirados):**\n")
        for i in range(1, len(grupos)):
            g = grupos[i]["ini"] - grupos[i - 1]["fin"]
            ant = palabras(grupos[i - 1]["fin"] - 1.2, grupos[i - 1]["fin"]).split()[-3:]
            des = palabras(grupos[i]["ini"], grupos[i]["ini"] + 1.2).split()[:3]
            print(f"- Entre los bloques {i} y {i + 1}: se tiran {g:.2f} s, entre «…{' '.join(ant)}» y «{' '.join(des)}…».")

    if fix:
        print("\n**Lo que Whisper oyó mal y se corrigió a ojo (lo marcado [?] hay que confirmarlo con el audio):** "
              + "; ".join(f"«{k}» → «{v}»" for k, v in fix.items()) + ".")

    if a.preview:
        r = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", a.preview, "-af",
                            "silencedetect=noise=-35dB:d=0.3", "-f", "null", "-"], capture_output=True, text=True)
        n = len(re.findall(r"silence_start", r.stderr))
        d = re.search(r"Duration:\s*(\d+):(\d+):([\d.]+)", r.stderr)
        dur = int(d.group(1)) * 3600 + int(d.group(2)) * 60 + float(d.group(3)) if d else 0
        print(f"\n**Regla 15, medida en el preview:** `silencedetect -35 dB d=0.3` → **{n} silencios** de 0,3 s o más "
              f"(preview de {dur:.1f} s). {'Cumple.' if n == 0 else 'NO cumple: ' + str(n) + ' pausas de 0,3 s o más siguen.'}")


if __name__ == "__main__":
    sys.exit(main())
