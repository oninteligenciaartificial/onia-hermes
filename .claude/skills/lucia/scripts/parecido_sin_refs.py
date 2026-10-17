#!/usr/bin/env python3
"""Parecido de Lucía en un clip, SIN las fotos que el motor recibió como entrada (11-oct-2026).

Problema que resuelve: el puntaje del face-gate es el coseno ArcFace contra el centroide de las 8 fotos oficiales
(R1..R8). Si un motor recibió R1 o R3 como referencia de entrada, su puntaje no es independiente: la entrada y la
medida comparten foto. Este script calcula, para cada cuadro pedido de un clip:
  A  coseno contra el centroide de las 8 fotos (lo que reporta face-gate.sh; debe reproducir PROCEDENCIA.jsonl),
  B  coseno contra el centroide de SOLO las fotos que ese motor NO recibió,
  C  coseno contra cada foto por separado (máximo y mínimo entre las no recibidas),
y el tamaño de cara en px. Para separar «foto recibida» de «subconjunto distinto» mide además cada clip contra el
subconjunto de los demás clips (matriz cruzada): un control sin entradas tampoco puntúa igual contra 4 fotos que contra 8.

No modifica face_identity_qa.py ni face-gate.sh: importa el primero por ruta y usa sus clases SCRFD y ArcFace con los
mismos umbrales (detector 640, 0,5; cara = la más grande). No descarga nada: si faltan los modelos, se detiene.
Mide IDENTIDAD, no belleza. Caras < 200 px poco confiables; ruido de ±0,03; el piso 0,70 es una decisión, no una ley.

Uso (venv y modelos ya existentes en el scratchpad; ver el encabezado del .txt de resultados):
  <venv>/bin/python -I parecido_sin_refs.py --refs-dir <dir R*.png> --models <dir onnx> --frames-dir <dir> \
      --json-out salida.json \
      --clip "NOMBRE|ruta.mp4|0,1,2,3,4,5,5.9|R1,R3|0.707,0.762,..."   # recibidas y esperado (PROCEDENCIA) opcionales
"""
import argparse
import importlib.util
import json
import os
import subprocess
import sys

import numpy as np

UMBRAL_PX = 200  # debajo de esto la cara es poco confiable (regla del face-gate)


def cargar_qa():
    """Importa scripts/face_identity_qa.py por ruta, sin tocarlo (con -I el directorio del script no está en sys.path)."""
    aqui = os.path.dirname(os.path.abspath(__file__))
    ruta = os.path.normpath(os.path.join(aqui, "..", "..", "..", "..", "scripts", "face_identity_qa.py"))
    spec = importlib.util.spec_from_file_location("face_identity_qa", ruta)
    modulo = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(modulo)
    return modulo


def leer_refs(refs_dir):
    exts = (".jpg", ".jpeg", ".png")
    nombres = sorted(f for f in os.listdir(refs_dir) if f.startswith("R") and f.lower().endswith(exts))
    return {os.path.splitext(f)[0]: os.path.join(refs_dir, f) for f in nombres}


def resolver(nombre, etiquetas):
    """«R3» -> «R3_casi_frontal»; falla si es ambiguo o no existe."""
    hits = [e for e in etiquetas if e == nombre or e.split("_")[0] == nombre]
    if len(hits) != 1:
        raise SystemExit(f"referencia '{nombre}' no resuelve a una sola foto: {hits}")
    return hits[0]


def parsear_clip(texto, etiquetas):
    campos = texto.split("|")
    if len(campos) < 3:
        raise SystemExit(f"--clip necesita NOMBRE|ruta|tiempos[|recibidas[|esperado]]: {texto}")
    campos += [""] * (5 - len(campos))
    nombre, ruta, tiempos, recibidas, esperado = (c.strip() for c in campos[:5])
    if not os.path.isfile(ruta):
        raise SystemExit(f"no existe el clip: {ruta}")
    ts = [t.strip() for t in tiempos.split(",") if t.strip()]
    rec = [resolver(r.strip(), etiquetas) for r in recibidas.split(",") if r.strip()]
    esp = [float(x) for x in esperado.split(",") if x.strip()]
    if esp and len(esp) != len(ts):
        raise SystemExit(f"{nombre}: {len(esp)} valores esperados para {len(ts)} tiempos")
    return {"nombre": nombre, "ruta": ruta, "t": ts, "recibidas": rec, "esperado": esp}


def extraer_cuadro(ruta, t, frames_dir):
    """Mismo comando que face-gate.sh: un cuadro PNG en el segundo t."""
    stem = os.path.splitext(os.path.basename(ruta))[0]
    salida = os.path.join(frames_dir, f"{stem}_t{t}.png")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", t, "-i", ruta, "-frames:v", "1", salida], check=True)
    return salida


def embeber(qa, det, rec, ruta_img):
    """Embedding de la cara más grande (el sujeto principal), igual que face_identity_qa.main."""
    img = qa.load_image(ruta_img)
    caras, kps = det.detect(img)
    if len(caras) == 0:
        return None
    areas = (caras[:, 2] - caras[:, 0]) * (caras[:, 3] - caras[:, 1])
    i = int(areas.argmax())
    return rec.embed(img, kps[i]), int(caras[i, 2] - caras[i, 0]), float(caras[i, 4])


def centroide(matriz, indices):
    c = matriz[indices].mean(0)
    return c / np.linalg.norm(c)


def medir_punto(e, refs_mat, etiquetas, recibidas, sets):
    """A, B propio, coseno por foto, min/max entre no recibidas y B/gap bajo cada subconjunto de la matriz cruzada."""
    todas = list(range(len(etiquetas)))
    por_foto = refs_mat @ e
    a = float(centroide(refs_mat, todas) @ e)
    punto = {"A": a, "por_foto": {etiquetas[i]: float(por_foto[i]) for i in todas}}
    no_rec = [i for i in todas if etiquetas[i] not in recibidas]
    punto["B"] = float(centroide(refs_mat, no_rec) @ e) if recibidas else a
    if recibidas:
        vals = [(float(por_foto[i]), etiquetas[i]) for i in no_rec]
        punto["no_rec_min"], punto["no_rec_max"] = min(vals), max(vals)
    punto["sets"] = {}
    for nombre_set, rec_set in sets.items():
        fuera = [i for i in todas if etiquetas[i] not in rec_set]
        dentro = [i for i in todas if etiquetas[i] in rec_set]
        punto["sets"][nombre_set] = {
            "B": float(centroide(refs_mat, fuera) @ e),
            "gap_recibidas_menos_no": float(por_foto[dentro].mean() - por_foto[fuera].mean()),
        }
    return punto


def medir_clip(qa, det, rec, refs_mat, etiquetas, clip, sets, frames_dir):
    puntos = []
    for t in clip["t"]:
        cuadro = extraer_cuadro(clip["ruta"], t, frames_dir)
        r = embeber(qa, det, rec, cuadro)
        if r is None:
            puntos.append({"t": t, "sin_cara": True})
            continue
        e, px, det_score = r
        p = medir_punto(e, refs_mat, etiquetas, clip["recibidas"], sets)
        p.update({"t": t, "cara_px": px, "det": det_score})
        puntos.append(p)
    return puntos


def f3(x):
    return f"{x:.3f}"


def tabla_clip(clip, puntos, etiquetas):
    rec = clip["recibidas"]
    no_rec = [e for e in etiquetas if e not in rec]
    lineas = [f"== {clip['nombre']}",
              f"   recibió: {', '.join(r.split('_')[0] for r in rec) or '(nada)'}  ·  "
              f"no recibió ({len(no_rec)}): {', '.join(r.split('_')[0] for r in no_rec)}"
              + ("" if rec else "  (B = A)"),
              f"   {'t':>5} {'cara_px':>8} {'A':>6} {'PROC':>6} {'A-PROC':>7} {'B':>6} {'B-A':>7}  "
              f"{'min no recib.':>14} {'max no recib.':>14}  nota"]
    for i, p in enumerate(puntos):
        if p.get("sin_cara"):
            lineas.append(f"   {p['t']:>5} {'-':>8}  SIN CARA DETECTADA")
            continue
        esp = clip["esperado"][i] if clip["esperado"] else None
        mn = f"{p['no_rec_min'][1].split('_')[0]} {f3(p['no_rec_min'][0])}" if rec else "-"
        mx = f"{p['no_rec_max'][1].split('_')[0]} {f3(p['no_rec_max'][0])}" if rec else "-"
        nota = "cara < 200 px: poco confiable" if p["cara_px"] < UMBRAL_PX else ""
        lineas.append(
            f"   {p['t']:>5} {p['cara_px']:>8} {f3(p['A']):>6} {f3(esp) if esp is not None else '-':>6} "
            f"{(format(p['A'] - esp, '+.3f') if esp is not None else '-'):>7} {f3(p['B']):>6} "
            f"{format(p['B'] - p['A'], '+.3f'):>7}  {mn:>14} {mx:>14}  {nota}")
    return lineas


def tabla_fotos(clip, puntos, etiquetas):
    cab = " ".join(f"{(e.split('_')[0] + ('*' if e in clip['recibidas'] else '')):>6}" for e in etiquetas)
    lineas = [f"   coseno por foto (* = recibida como entrada)  {'t':>5} {cab}"]
    for p in puntos:
        if p.get("sin_cara"):
            continue
        fila = " ".join(f"{f3(p['por_foto'][e]):>6}" for e in etiquetas)
        lineas.append(f"   {'':45}{p['t']:>5} {fila}")
    return lineas


def resumen(resultados, etiquetas):
    lineas = ["", "RESUMEN por clip (extremos sobre los puntos medidos; B-A < 0 = el parecido baja al sacar las fotos recibidas)",
              f"   {'clip':44} {'A min-max':>13} {'B min-max':>13} {'B-A medio':>10} {'B-A min/max':>14} "
              f"{'n':>2} {'n>=200px':>8} {'B-A (>=200px)':>14}"]
    for r in resultados:
        ok = [p for p in r["puntos"] if not p.get("sin_cara")]
        grandes = [p for p in ok if p["cara_px"] >= UMBRAL_PX]
        d = [p["B"] - p["A"] for p in ok]
        dg = [p["B"] - p["A"] for p in grandes]
        a = [p["A"] for p in ok]
        b = [p["B"] for p in ok]
        lineas.append(
            f"   {r['clip']['nombre'][:44]:44} {f3(min(a)) + '-' + f3(max(a)):>13} {f3(min(b)) + '-' + f3(max(b)):>13} "
            f"{format(np.mean(d), '+.3f'):>10} {format(min(d), '+.3f') + '/' + format(max(d), '+.3f'):>14} "
            f"{len(ok):>2} {len(grandes):>8} {(format(np.mean(dg), '+.3f') if dg else '-'):>14}")
    return lineas


def matriz_cruzada(resultados, sets):
    """Cada clip medido contra el subconjunto 'sin las fotos' de cada motor con entradas: separa recibida de subconjunto."""
    lineas = ["", "MATRIZ CRUZADA: media de (B - A) y media del gap «cos medio a las fotos recibidas - cos medio a las no recibidas»,",
              "   midiendo CADA clip contra el subconjunto de cada motor (la diagonal es el caso real; las filas de control son el piso).",
              "   Un gap > 0 en un control sin entradas solo dice que esas fotos se parecen más a su cara; el exceso sobre el control es la fuga."]
    for nombre_set, rec_set in sets.items():
        lineas.append(f"   subconjunto de «{nombre_set}»  (recibidas: {', '.join(s.split('_')[0] for s in rec_set)})")
        lineas.append(f"      {'clip':44} {'B-A medio':>10} {'gap medio':>10}")
        for r in resultados:
            ok = [p for p in r["puntos"] if not p.get("sin_cara")]
            d = np.mean([p["sets"][nombre_set]["B"] - p["A"] for p in ok])
            g = np.mean([p["sets"][nombre_set]["gap_recibidas_menos_no"] for p in ok])
            marca = "  <- este motor" if r["clip"]["nombre"] == nombre_set else ""
            lineas.append(f"      {r['clip']['nombre'][:44]:44} {format(d, '+.3f'):>10} {format(g, '+.3f'):>10}{marca}")
        lineas += exceso_sobre_control(resultados, nombre_set)
    return lineas


def exceso_sobre_control(resultados, nombre_set):
    """Lo del motor menos la media de los clips SIN entradas, bajo el mismo subconjunto: lo que queda es la fuga."""
    def medias(r):
        ok = [p for p in r["puntos"] if not p.get("sin_cara")]
        return (np.mean([p["sets"][nombre_set]["B"] - p["A"] for p in ok]),
                np.mean([p["sets"][nombre_set]["gap_recibidas_menos_no"] for p in ok]))
    motor = next(r for r in resultados if r["clip"]["nombre"] == nombre_set)
    controles = [medias(r) for r in resultados if not r["clip"]["recibidas"]]
    d_m, g_m = medias(motor)
    d_c, g_c = (float(np.mean([c[i] for c in controles])) for i in (0, 1))
    return [f"      {'EXCESO del motor sobre la media de ' + str(len(controles)) + ' controles':44} "
            f"{format(d_m - d_c, '+.3f'):>10} {format(g_m - g_c, '+.3f'):>10}"
            f"   (controles: B-A {format(d_c, '+.3f')}, gap {format(g_c, '+.3f')})"]


def construir_sets(clips):
    sets = {}
    for c in clips:
        if c["recibidas"]:
            sets[c["nombre"]] = c["recibidas"]
    return sets


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--refs-dir", required=True)
    ap.add_argument("--models", required=True)
    ap.add_argument("--frames-dir", required=True)
    ap.add_argument("--json-out", required=True)
    ap.add_argument("--clip", action="append", required=True)
    args = ap.parse_args()

    det_p, rec_p = (os.path.join(args.models, f) for f in ("det_10g.onnx", "w600k_r50.onnx"))
    if not (os.path.exists(det_p) and os.path.exists(rec_p)):
        raise SystemExit(f"faltan los modelos ArcFace/SCRFD en {args.models}: este script no descarga nada")
    os.makedirs(args.frames_dir, exist_ok=True)
    qa = cargar_qa()
    det, rec = qa.SCRFD(det_p), qa.ArcFace(rec_p)

    refs = leer_refs(args.refs_dir)
    etiquetas = list(refs)
    embs = []
    for e in etiquetas:
        r = embeber(qa, det, rec, refs[e])
        if r is None:
            raise SystemExit(f"sin cara en la referencia {e}")
        embs.append(r[0])
    refs_mat = np.stack(embs)

    clips = [parsear_clip(c, etiquetas) for c in args.clip]
    sets = construir_sets(clips)
    resultados = []
    for c in clips:
        resultados.append({"clip": c, "puntos": medir_clip(qa, det, rec, refs_mat, etiquetas, c, sets, args.frames_dir)})

    salida = []
    for r in resultados:
        salida += tabla_clip(r["clip"], r["puntos"], etiquetas) + tabla_fotos(r["clip"], r["puntos"], etiquetas) + [""]
    salida += resumen(resultados, etiquetas) + matriz_cruzada(resultados, sets)
    print("\n".join(salida))
    with open(args.json_out, "w") as f:
        json.dump({"refs": etiquetas, "clips": resultados}, f, ensure_ascii=False, indent=1, default=str)


if __name__ == "__main__":
    sys.exit(main())
