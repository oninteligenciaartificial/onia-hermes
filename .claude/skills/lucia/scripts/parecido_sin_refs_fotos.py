#!/usr/bin/env python3
"""Parecido de Lucía en FOTOS FIJAS, contra las 8 oficiales y contra solo las no recibidas (11-oct-2026).

Hermano de parecido_sin_refs.py (que mide cuadros de clips): mismo método, pero la entrada es una imagen y no un mp4.
Los seis motores de imagen de G4 recibieron como entrada las mismas seis imágenes (abe2e6bd, R1, R3, R6, R7, 688d63a7), así que
el puntaje contra el centroide de las 8 (A, lo que reporta face-gate.sh) tiene R1, R3, R6 y R7 «vistas». Este script calcula por imagen:
  A    coseno contra el centroide (normalizado) de las 8 fotos; debe reproducir el valor publicado (PROCEDENCIA.jsonl) con diferencia <= 0,001,
  B*   coseno contra el centroide de SOLO las fotos que nadie recibió (por defecto R2, R4, R5, R8) y B* - A,
  el coseno contra cada foto, el tamaño de cara en px (< 200 = poco confiable) y, por motor, el orden en A y en B*.

No modifica face_identity_qa.py ni parecido_sin_refs.py: importa ambos por ruta (con -I el directorio del script no está en sys.path) y usa
sus mismas clases y funciones (SCRFD 640 / 0,5, cara = la más grande, centroide = media normalizada). No descarga nada: si faltan los
modelos, se detiene. Mide IDENTIDAD, no belleza. Ruido de ±0,03; el piso 0,70 es una decisión del equipo, no una ley.

Uso (venv y modelos ya existentes en el scratchpad del face-gate):
  <venv>/bin/python -I parecido_sin_refs_fotos.py --refs-dir <dir R*.png> --models <dir onnx> --json-out salida.json \
      --img "MOTOR|ESCENA|ruta.jpg|0.806"        # ESCENA = K1, K2, K4...; el valor esperado (PROCEDENCIA) es opcional pero recomendado
"""
import argparse
import importlib.util
import json
import os
import sys

import numpy as np

AQUI = os.path.dirname(os.path.abspath(__file__))
UMBRAL_PX = 200  # debajo de esto la cara es poco confiable (regla del face-gate)
RUIDO = 0.03  # ruido entre re-mediciones de la misma cara (G3 v2, montaje-hyperframes.md §11)
PISO = 0.70  # decisión del equipo, no una propiedad de ArcFace
TOL_REPRO = 0.001  # diferencia máxima aceptada entre A y el valor publicado
ESCENA_COMUN = "K1"  # la escena que los seis motores tienen en común
CARA_PERDIDA = 0.50  # A por debajo de esto = la imagen ya no es Lucía (otra persona); se pesa aparte


def cargar_por_ruta(nombre, ruta):
    spec = importlib.util.spec_from_file_location(nombre, ruta)
    modulo = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(modulo)
    return modulo


def f3(x):
    return f"{x:.3f}"


def sg(x):
    return format(x, "+.3f")


def fc(x):
    """Decimal con coma, para la prosa."""
    return f3(x).replace(".", ",")


def sgc(x):
    return sg(x).replace(".", ",")


def parsear_img(texto):
    campos = [c.strip() for c in texto.split("|")]
    if len(campos) < 3:
        raise SystemExit(f"--img necesita MOTOR|ESCENA|ruta[|esperado]: {texto}")
    campos += [""] * (4 - len(campos))
    motor, escena, ruta, esperado = campos[:4]
    if not os.path.isfile(ruta):
        raise SystemExit(f"no existe la imagen: {ruta}")
    return {"motor": motor, "escena": escena, "ruta": ruta, "esperado": float(esperado) if esperado else None}


def medir_imagen(base, qa, det, rec, refs_mat, etiquetas, excluidas, img):
    r = base.embeber(qa, det, rec, img["ruta"])
    if r is None:
        return {**img, "sin_cara": True}
    e, px, det_score = r
    por_foto = refs_mat @ e
    idx_b = [i for i, et in enumerate(etiquetas) if et not in excluidas]
    a = float(base.centroide(refs_mat, list(range(len(etiquetas)))) @ e)
    b = float(base.centroide(refs_mat, idx_b) @ e)
    return {**img, "cara_px": px, "det": det_score, "A": a, "B": b,
            "por_foto": {etiquetas[i]: float(por_foto[i]) for i in range(len(etiquetas))}}


def tabla_imagenes(medidas, etiquetas, excluidas):
    corto = [e.split("_")[0] for e in etiquetas]
    cab_fotos = " ".join(f"{(c + ('*' if e in excluidas else '')):>6}" for c, e in zip(corto, etiquetas))
    nb = ", ".join(c for c, e in zip(corto, etiquetas) if e not in excluidas)
    ex = ", ".join(c for c, e in zip(corto, etiquetas) if e in excluidas)
    lineas = [f"   B* = centroide de {nb}  ·  * = foto que los seis motores recibieron como entrada ({ex}), fuera de B*",
              f"   {'motor / escena':34} {'cara_px':>7} {'A':>6} {'PROC':>6} {'A-PROC':>7} {'B*':>6} {'B*-A':>7}  {cab_fotos}  nota"]
    for m in medidas:
        nom = f"{m['motor']} {m['escena']}"[:34]
        if m.get("sin_cara"):
            lineas.append(f"   {nom:34} SIN CARA DETECTADA")
            continue
        esp = m["esperado"]
        fotos = " ".join(f"{f3(m['por_foto'][e]):>6}" for e in etiquetas)
        nota = "cara < 200 px: poco confiable" if m["cara_px"] < UMBRAL_PX else ""
        lineas.append(f"   {nom:34} {m['cara_px']:>7} {f3(m['A']):>6} {(f3(esp) if esp is not None else '-'):>6} "
                      f"{(sg(m['A'] - esp) if esp is not None else '-'):>7} {f3(m['B']):>6} {sg(m['B'] - m['A']):>7}  {fotos}  {nota}")
    return lineas


def agrupar_por_motor(medidas):
    motores = {}
    for m in medidas:
        motores.setdefault(m["motor"], []).append(m)
    return motores


def resumen_motores(motores):
    lineas = [f"   {'motor':26} {'escenas':>7} {'A K1':>6} {'B* K1':>6} {'A media':>8} {'B* media':>9} {'B*-A medio':>11} "
              f"{'A min/max':>13} {'B* min/max':>13} {'cara_px':>9} {'<200px':>6}"]
    for nombre, ms in motores.items():
        a, b, px = [m["A"] for m in ms], [m["B"] for m in ms], [m["cara_px"] for m in ms]
        k1 = next((m for m in ms if m["escena"] == ESCENA_COMUN), None)
        lineas.append(
            f"   {nombre:26} {len(ms):>7} {(f3(k1['A']) if k1 else '-'):>6} {(f3(k1['B']) if k1 else '-'):>6} "
            f"{f3(np.mean(a)):>8} {f3(np.mean(b)):>9} {sg(float(np.mean(np.array(b) - np.array(a)))):>11} "
            f"{f3(min(a)) + '/' + f3(max(a)):>13} {f3(min(b)) + '/' + f3(max(b)):>13} "
            f"{str(min(px)) + '-' + str(max(px)):>9} {sum(1 for v in px if v < UMBRAL_PX):>3}/{len(px)}")
    return lineas


def ordenar(valores):
    """valores = {motor: número} -> lista de motores de mayor a menor."""
    return sorted(valores, key=lambda k: -valores[k])


def bloque_orden(titulo, va, vb, lineas):
    oa, ob = ordenar(va), ordenar(vb)
    lineas.append(titulo)
    lineas.append(f"   {'#':>2} {'en A':34} {'valor':>6}    {'en B* (R2, R4, R5, R8)':34} {'valor':>6}")
    for i in range(len(oa)):
        lineas.append(f"   {i + 1:>2} {oa[i][:34]:34} {f3(va[oa[i]]):>6}    {ob[i][:34]:34} {f3(vb[ob[i]]):>6}")
    cambia = oa != ob
    lineas.append(f"   ¿Cambia el orden entre A y B*? {'SI' if cambia else 'NO'}")
    if cambia:
        for k in oa:
            if oa.index(k) != ob.index(k):
                lineas.append(f"      {k}: lugar {oa.index(k) + 1} en A -> lugar {ob.index(k) + 1} en B*")
    return oa, ob


def bloque_vecinos(titulo, orden_a, orden_b, va, vb, lineas):
    lineas.append(titulo)
    lineas.append(f"   (ruido de ±{RUIDO:.2f}: una diferencia menor o igual que eso no se distingue; vecinos tomados del orden de cada columna)")
    for nombre, orden, vals in (("A ", orden_a, va), ("B*", orden_b, vb)):
        for i in range(len(orden) - 1):
            d = vals[orden[i]] - vals[orden[i + 1]]
            marca = "dentro del ruido" if abs(d) <= RUIDO else "fuera del ruido"
            if abs(d) < 0.0005:
                marca += " (empate a 3 decimales: el orden lo decide el 4.º decimal)"
            lineas.append(f"   {nombre} {orden[i][:30]:30} - {orden[i + 1][:30]:30} {sg(d)}  {marca}")


def valores_k1(motores, clave):
    return {n: next(m[clave] for m in ms if m["escena"] == ESCENA_COMUN) for n, ms in motores.items()
            if any(m["escena"] == ESCENA_COMUN for m in ms)}


def valores_media(motores, clave):
    return {n: float(np.mean([m[clave] for m in ms])) for n, ms in motores.items()}


def bloques_orden(motores):
    lineas = []
    ka, kb = valores_k1(motores, "A"), valores_k1(motores, "B")
    oa1, ob1 = bloque_orden(f"ORDEN por escena {ESCENA_COMUN} (la misma escena en los {len(ka)} motores; comparación pareja):", ka, kb, lineas)
    lineas.append("")
    bloque_vecinos("DIFERENCIAS entre vecinos, escena " + ESCENA_COMUN + ":", oa1, ob1, ka, kb, lineas)
    lineas.append("")
    ma, mb = valores_media(motores, "A"), valores_media(motores, "B")
    oam, obm = bloque_orden("ORDEN por MEDIA de las escenas medidas (Seedream 4.5 y Kling O1 Image: sus 3 escenas; los demás: solo K1):", ma, mb, lineas)
    lineas.append("")
    bloque_vecinos("DIFERENCIAS entre vecinos, orden por media:", oam, obm, ma, mb, lineas)
    return lineas, {"k1": (oa1, ob1), "media": (oam, obm), "va_k1": ka, "vb_k1": kb, "va_m": ma, "vb_m": mb}


def lectura(medidas, motores, datos, etiquetas):
    ok = [m for m in medidas if not m.get("sin_cara")]
    con_esp = [m for m in ok if m["esperado"] is not None]
    dif = [abs(m["A"] - m["esperado"]) for m in con_esp]
    malos = [f"{m['motor']} {m['escena']} ({sgc(m['A'] - m['esperado'])})" for m in con_esp if abs(m["A"] - m["esperado"]) > TOL_REPRO]
    chicas = [m for m in ok if m["cara_px"] < UMBRAL_PX]
    d = [m["B"] - m["A"] for m in ok]
    r4 = sum(1 for m in ok if min(m["por_foto"], key=m["por_foto"].get).startswith("R4"))
    oa1, ob1 = datos["k1"]
    oam, obm = datos["media"]
    L = ["LECTURA NUMÉRICA (sin opinión; las cifras salen de las tablas de arriba).",
         f"   1. Comprobación: A vs PROCEDENCIA l.97 en {len(con_esp)} imágenes, diferencia máxima {format(max(dif), '.4f').replace('.', ',')}"
         + ("; todas dentro de ±0,001." if not malos else f"; fuera de ±0,001: {', '.join(malos)}."),
         f"   2. Tamaño de cara: {len(chicas)} de {len(ok)} imágenes tienen cara < {UMBRAL_PX} px"
         + (f" ({', '.join(m['motor'] + ' ' + m['escena'] + ' ' + str(m['cara_px']) + ' px' for m in chicas)})." if chicas else
            f"; rango {min(m['cara_px'] for m in ok)}-{max(m['cara_px'] for m in ok)} px."),
         f"   3. B* - A: de {sgc(min(d))} a {sgc(max(d))}, media {sgc(float(np.mean(d)))} en {len(ok)} imágenes; "
         f"R4 es la foto de menor coseno en {r4} de {len(ok)}.",
         "      Por motor (media B* - A): " + "; ".join(
             f"{n} {sgc(float(np.mean([m['B'] - m['A'] for m in ms])))}" for n, ms in motores.items()) + "."]
    L.append(f"   4. Orden en la escena {ESCENA_COMUN}: A = " + " > ".join(f"{k} {fc(datos['va_k1'][k])}" for k in oa1) + ".")
    L.append("      B* = " + " > ".join(f"{k} {fc(datos['vb_k1'][k])}" for k in ob1) + ".")
    L.append("      " + ("El orden NO cambia entre A y B*." if oa1 == ob1 else "El orden SÍ cambia entre A y B*: " + "; ".join(
        f"{k} {oa1.index(k) + 1}.º -> {ob1.index(k) + 1}.º" for k in oa1 if oa1.index(k) != ob1.index(k)) + "."))
    L.append(f"   5. Orden por media de escenas: A = " + " > ".join(f"{k} {fc(datos['va_m'][k])}" for k in oam) + ".")
    L.append("      B* = " + " > ".join(f"{k} {fc(datos['vb_m'][k])}" for k in obm) + ".")
    L.append("      " + ("El orden NO cambia entre A y B*." if oam == obm else "El orden SÍ cambia entre A y B*: " + "; ".join(
        f"{k} {oam.index(k) + 1}.º -> {obm.index(k) + 1}.º" for k in oam if oam.index(k) != obm.index(k)) + "."))
    L += notas_empates("A", oam, datos["va_m"]) + notas_empates("B*", obm, datos["vb_m"])
    L += sensibilidad(motores, ok)
    L += vecinos_en_ruido(oa1, ob1, datos["va_k1"], datos["vb_k1"])
    L += piso(ok)
    return L


def notas_empates(nombre, orden, vals):
    """Pares vecinos que empatan a 3 decimales: su lugar relativo lo decide el 4.º decimal."""
    return [f"      Empate a 3 decimales en {nombre} (el lugar lo decide el 4.º decimal): {orden[i]} y {orden[i + 1]}, ambos {fc(vals[orden[i]])}."
            for i in range(len(orden) - 1) if abs(vals[orden[i]] - vals[orden[i + 1]]) < 0.0005]


def sensibilidad(motores, ok):
    """Media de los motores de varias escenas sin la(s) escena(s) donde alguna imagen perdió la cara (A < CARA_PERDIDA)."""
    perdidas = sorted({m["escena"] for m in ok if m["A"] < CARA_PERDIDA})
    if not perdidas:
        return []
    multi = {n: [m for m in ms if m["escena"] not in perdidas] for n, ms in motores.items() if len(ms) > 1}
    partes = [f"{n} A {fc(float(np.mean([m['A'] for m in ms])))} / B* {fc(float(np.mean([m['B'] for m in ms])))} ({len(ms)} escenas)"
              for n, ms in multi.items()]
    return [f"   5b. Sin la escena {', '.join(perdidas)} (hay una imagen con A < {format(CARA_PERDIDA, '.2f').replace('.', ',')}), media de los motores con varias escenas: "
            + "; ".join(partes) + "."]


def vecinos_en_ruido(oa, ob, va, vb):
    L = []
    for nombre, orden, vals in (("A", oa, va), ("B*", ob, vb)):
        dentro = [f"{orden[i]} - {orden[i + 1]} {sgc(vals[orden[i]] - vals[orden[i + 1]])}" for i in range(len(orden) - 1)
                  if abs(vals[orden[i]] - vals[orden[i + 1]]) <= RUIDO]
        fuera = len(orden) - 1 - len(dentro)
        L.append(f"   6{'a' if nombre == 'A' else 'b'}. Escena {ESCENA_COMUN}, vecinos en {nombre}: {len(dentro)} de {len(orden) - 1} pares dentro de ±0,03"
                 + (f" ({'; '.join(dentro)})" if dentro else "") + f"; {fuera} fuera.")
    return L


def piso(ok):
    pa = [m for m in ok if m["A"] >= PISO]
    pb = [m for m in ok if m["B"] >= PISO]
    nombre = lambda m: f"{m['motor']} {m['escena']}"
    return [f"   7. Contra el piso {format(PISO, '.2f').replace('.', ',')} (decisión del equipo), por imagen: en A pasan {len(pa)} de {len(ok)}; en B* pasan {len(pb)} de {len(ok)}.",
            f"      Pasan en A y no en B*: {', '.join(nombre(m) for m in pa if m not in pb) or 'ninguna'}. "
            f"No pasan en A: {', '.join(nombre(m) for m in ok if m not in pa) or 'ninguna'}."]


def tabla_control(medidas, ruta_json, etiqueta, datos):
    """Misma medición sobre OTRO archivo de cada imagen (p. ej. el jpg de 1080 px del repo vs el PNG original)."""
    otro = json.load(open(ruta_json))
    idx = {(m["motor"], m["escena"]): m for m in otro["imagenes"]}
    L = [f"CONTROL: la misma medición sobre {etiqueta} (control) frente a la tabla principal; dA, dB* = control - principal; A-PROC = A del control - valor publicado",
         f"   {'motor / escena':34} {'cara_px':>7} {'A':>6} {'B*':>6}   {'principal:':>10} {'cara_px':>7} {'A':>6} {'B*':>6}   {'dA':>7} {'dB*':>7} {'A-PROC':>7}  nota (del control)"]
    malos, chicas = 0, 0
    for m in medidas:
        o = idx[(m["motor"], m["escena"])]
        igual = os.path.abspath(o["ruta"]) == os.path.abspath(m["ruta"])
        malos += 0 if o["esperado"] is None or abs(o["A"] - o["esperado"]) <= TOL_REPRO else 1
        chicas += 1 if o["cara_px"] < UMBRAL_PX else 0
        nota = "mismo archivo" if igual else ("cara < 200 px: poco confiable" if o["cara_px"] < UMBRAL_PX else "")
        esp = o["esperado"]
        L.append(f"   {(m['motor'] + ' ' + m['escena'])[:34]:34} {o['cara_px']:>7} {f3(o['A']):>6} {f3(o['B']):>6}   {'':>10} {m['cara_px']:>7} {f3(m['A']):>6} {f3(m['B']):>6}   "
                 f"{sg(o['A'] - m['A']):>7} {sg(o['B'] - m['B']):>7} {(sg(o['A'] - esp) if esp is not None else '-'):>7}  {nota}")
    ok1, ob1 = otro["orden"]["k1"]
    L.append(f"   En el control: {malos} de {len(medidas)} imágenes difieren de PROCEDENCIA en más de ±0,001; {chicas} de {len(medidas)} con cara < 200 px.")
    L.append(f"   Orden K1 en el control, A: {' > '.join(ok1)}")
    L.append(f"   Orden K1 en el control, B*: {' > '.join(ob1)}")
    mismo_a, mismo_b = list(ok1) == list(datos["k1"][0]), list(ob1) == list(datos["k1"][1])
    L.append(f"   ¿Mismo orden K1 que el principal? A: {'SI' if mismo_a else 'NO'}; B*: {'SI' if mismo_b else 'NO'}")
    da = [idx[(m["motor"], m["escena"])]["A"] - m["A"] for m in medidas]
    db = [idx[(m["motor"], m["escena"])]["B"] - m["B"] for m in medidas]
    extra = [f"   8. Control con {etiqueta}: dA de {sgc(min(da))} a {sgc(max(da))}, dB* de {sgc(min(db))} a {sgc(max(db))} (control - principal); "
             f"{malos} de {len(medidas)} imágenes difieren de PROCEDENCIA en más de ±0,001 y {chicas} de {len(medidas)} tienen cara < 200 px. "
             f"Orden K1 igual al principal: en A {'sí' if mismo_a else 'no'}, en B* {'sí' if mismo_b else 'no'}."]
    return L, extra


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--refs-dir", required=True)
    ap.add_argument("--models", required=True)
    ap.add_argument("--json-out", required=True)
    ap.add_argument("--excluir", default="R1,R3,R6,R7", help="fotos que los motores recibieron (fuera de B*)")
    ap.add_argument("--img", action="append", required=True, help="MOTOR|ESCENA|ruta|esperado")
    ap.add_argument("--comparar-json", help="JSON de otra corrida (mismas imágenes en otro archivo) para imprimir una tabla de control")
    ap.add_argument("--comparar-etiqueta", default="otro archivo de cada imagen")
    args = ap.parse_args()

    det_p, rec_p = (os.path.join(args.models, f) for f in ("det_10g.onnx", "w600k_r50.onnx"))
    if not (os.path.exists(det_p) and os.path.exists(rec_p)):
        raise SystemExit(f"faltan los modelos ArcFace/SCRFD en {args.models}: este script no descarga nada")
    base = cargar_por_ruta("parecido_sin_refs", os.path.join(AQUI, "parecido_sin_refs.py"))
    qa = base.cargar_qa()
    det, rec = qa.SCRFD(det_p), qa.ArcFace(rec_p)

    refs = base.leer_refs(args.refs_dir)
    etiquetas = list(refs)
    excluidas = [base.resolver(r.strip(), etiquetas) for r in args.excluir.split(",") if r.strip()]
    embs = []
    for e in etiquetas:
        r = base.embeber(qa, det, rec, refs[e])
        if r is None:
            raise SystemExit(f"sin cara en la referencia {e}")
        embs.append(r[0])
    refs_mat = np.stack(embs)

    medidas = [medir_imagen(base, qa, det, rec, refs_mat, etiquetas, excluidas, parsear_img(t)) for t in args.img]
    if any(m.get("sin_cara") for m in medidas):
        print("\n".join(tabla_imagenes(medidas, etiquetas, excluidas)))
        raise SystemExit("hay imágenes sin cara detectada: no se calcula el resto")
    motores = agrupar_por_motor(medidas)
    lineas_orden, datos = bloques_orden(motores)
    titulo_resumen = "RESUMEN por motor (K1 = escena común; media sobre las escenas medidas; cara_px mín-máx; <200px = imágenes con cara < 200 px)"
    control, extra = ([], [])
    if args.comparar_json:
        control, extra = tabla_control(medidas, args.comparar_json, args.comparar_etiqueta, datos)
    salida = (tabla_imagenes(medidas, etiquetas, excluidas) + ["", titulo_resumen] + resumen_motores(motores) + [""] + lineas_orden + [""]
              + (control + [""] if control else []) + lectura(medidas, motores, datos, etiquetas) + extra)
    print("\n".join(salida))
    with open(args.json_out, "w") as f:
        json.dump({"refs": etiquetas, "excluidas_de_B": excluidas, "imagenes": medidas,
                   "orden": {"k1": datos["k1"], "media": datos["media"]}}, f, ensure_ascii=False, indent=1, default=str)


if __name__ == "__main__":
    sys.exit(main())
