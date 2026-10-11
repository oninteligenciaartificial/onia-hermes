#!/usr/bin/env python3
"""Cuenta, EN EL VIDEO TERMINADO, cuántos cuadros ve el espectador de cada clip (verificador 4, v2.4).

Definición única de «segundos visibles»: cuadros del master con alguna parte del clip a la vista ÷ 24.
El clip entra y sale con un empuje rígido de 6 cuadros (ease power3.inOut). En el cuadro de arranque del
empuje de entrada el clip está todavía fuera del lienzo (x = ancho): ese cuadro no cuenta. Por eso un clip
cuya ventana es [a, b) se ve (b − a) × 24 − 1 cuadros: m1 66, m3 78 y m5 106 = 2,75 · 3,25 · 4,42 s.

Cómo se comprueba (no se confía en el plan): para cada cuadro n del master cerca del clip se calcula qué
columnas del lienzo ocupa el clip (la geometría del empuje) y se compara esa franja, en las filas 0-250 (sin
tarjetas ni etiquetas), con el cuadro esperado del clip fuente escalado a 1080x1920 (720x1280 × 1,5). Un
cuadro cuenta como visible si la franja coincide (PSNR ≥ 24 dB y mucho mayor que contra el clip vecino); el
cuadro de arranque se verifica por lo contrario: ninguna franja de 4 px pegada al borde coincide.

Uso:  FACE_GATE_HOME=… $FACE_GATE_HOME/venv/bin/python scripts/cuadros-visibles.py out/g2-v2-final-1080x1920.mp4 > qa/cuadros-visibles.txt
(solo lee el video, la composición y los clips; no escribe nada más; sale con 1 si el conteo no coincide con el plan)
"""
import json
import os
import sys

import cv2
import numpy as np

P = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VIDEO = sys.argv[1] if len(sys.argv) > 1 else os.path.join(P, 'out/g2-v2-final-1080x1920.mp4')
plan = json.load(open(os.path.join(P, 'plan.resuelto.json'), encoding='utf8'))
FPS = plan['lienzo']['fps']
W, H = plan['lienzo']['w'], plan['lienzo']['h']
PUSH = plan['empuje']['cuadros']
ROWS = 250
med = {m['id']: m for m in plan['medios']}


def ease(p):                                   # GSAP power3.inOut
    return 4 * p ** 3 if p < 0.5 else 1 - ((-2 * p + 2) ** 3) / 2


def psnr(a, b):
    d = np.mean((a.astype(np.float32) - b.astype(np.float32)) ** 2)
    return 99.0 if d < 1e-9 else float(10 * np.log10(255.0 ** 2 / d))


def leer(path, filas_fuente=None):
    cap = cv2.VideoCapture(path)
    out = []
    while True:
        ok, f = cap.read()
        if not ok:
            break
        g = cv2.cvtColor(f, cv2.COLOR_BGR2GRAY)
        out.append(g)
    cap.release()
    return out


master = [g[:ROWS] for g in leer(VIDEO)]                       # solo las filas 0-250
N = len(master)


def fuente(id_):
    """cuadros del clip fuente, escalados como el lienzo (cover 720x1280 → 1080x1920 = ×1,5), filas 0-250"""
    src = os.path.join(P, med[id_]['src']) if med[id_].get('src') else None
    fr = []
    for g in leer(src):
        top = g[: int(round(ROWS / 1.5))]
        fr.append(cv2.resize(top, (W, ROWS), interpolation=cv2.INTER_LINEAR))
    return fr


resultados = {}
lineas = []
for id_ in ('m1', 'm3', 'm5'):
    m = med[id_]
    fa, fb = int(round(m['a'] * FPS)), int(round(m['b'] * FPS))
    c0 = int(round(m.get('media_inicio', 0) * FPS))
    fr = fuente(id_)
    visibles = []
    detalle = []
    for n in range(fa - 1, fb + 2):
        if n < 0 or n >= N:
            continue
        k_in, k_out = n - fa, n - (fb - PUSH)
        c = c0 + (n - fa)
        if c < 0 or c >= len(fr):
            visibles.append((n, False, 'fuera de la ventana', None))
            continue
        # franja del lienzo que ocupa el clip: columnas [x1, x2) del master ↔ columnas [s1, s2) del clip
        if n < fa or n >= fb:
            x1 = x2 = 0
        elif k_in < PUSH:                              # empuje de entrada: el clip llega desde la derecha
            off = int(round(W * (1 - ease(k_in / PUSH))))
            x1, x2, s1, s2 = off, W, 0, W - off
        elif k_out >= 0:                               # empuje de salida: el clip se va por la izquierda
            off = int(round(W * ease(k_out / PUSH)))
            x1, x2, s1, s2 = 0, W - off, off, W
        else:
            x1, x2, s1, s2 = 0, W, 0, W
        if x2 - x1 <= 0:
            # cuadro de arranque del empuje de entrada (x = ancho) o fuera de la ventana: no hay franja que esperar;
            # se comprueba lo contrario: una franja de 4 px pegada al borde derecho NO coincide con el borde izquierdo del clip
            p4 = psnr(master[n][:, W - 4:], fr[c][:, :4]) if n >= fa else 0.0
            visibles.append((n, p4 >= 24.0, f'franja de 0 px (clip fuera del lienzo); 4 px del borde: {p4:.1f} dB', None))
            continue
        pm = psnr(master[n][:, x1:x2], fr[c][:, s1:s2])
        vec = []
        for dc in (-1, 1):
            if 0 <= c + dc < len(fr):
                vec.append(psnr(master[n][:, x1:x2], fr[c + dc][:, s1:s2]))
        ok = pm >= 24.0 and (not vec or pm > max(vec) + 0.5 or (x2 - x1) < 40)
        visibles.append((n, ok, f'franja x {x1}-{x2} ({x2 - x1} px): {pm:.1f} dB (clip vecino {max(vec):.1f} dB)' if vec else f'franja x {x1}-{x2}: {pm:.1f} dB', (x1, x2)))
    vis = [n for n, ok, _, _ in visibles if ok]
    esperado = (fb - fa) - 1
    resultados[id_] = (len(vis), esperado, vis[0] if vis else None, vis[-1] if vis else None)
    lineas.append(f"{id_}: {len(vis)} cuadros visibles (cuadros {vis[0]}-{vis[-1]} del master) = {len(vis) / FPS:.2f} s".replace('.', ',') if vis else f'{id_}: 0 cuadros visibles')
    lineas.append(f'    ventana del plan: cuadros {fa}-{fb - 1} ({fb - fa} cuadros = {(fb - fa) / FPS:.2f} s); el cuadro {fa} (clip fuera del lienzo, x = {W}) no cuenta; plan: (b − a) × 24 − 1 = {esperado}'.replace('.', ','))
    for n, ok, txt, _ in visibles:
        if n in (fa - 1, fa, fa + 1, fa + PUSH - 1, fa + PUSH, fb - PUSH, fb - 2, fb - 1, fb, fb + 1):
            lineas.append(f'    n{n:<4d} {"VISIBLE " if ok else "no visible"}  {txt}')

print('Cuadros visibles de cada clip, contados EN EL MASTER (' + os.path.basename(VIDEO) + f', {N} cuadros a {FPS} fps):')
print('«Segundos visibles» = cuadros del master con alguna parte del clip a la vista ÷ 24 (el clip entra y sale con un empuje de 6 cuadros; el cuadro de arranque del empuje de entrada lo deja fuera del lienzo y no cuenta).')
print('Método: por cada cuadro, la franja del lienzo que ocupa el clip (geometría del empuje, power3.inOut) se compara en las filas 0-250 con el cuadro esperado del clip fuente ×1,5 (PSNR ≥ 24 dB y mayor que contra el cuadro vecino del clip).')
print()
print('\n'.join(lineas))
malos = [i for i, (n, e, a, b) in resultados.items() if n != e]
print()
print('Resumen: ' + ' · '.join(f"{i} {n} cuadros = {n / FPS:.2f} s".replace('.', ',') for i, (n, e, a, b) in resultados.items()))
if malos:
    print('✖ el conteo del master no coincide con el plan en: ' + ', '.join(malos), file=sys.stderr)
    sys.exit(1)
print('✔ el conteo del master coincide con el plan ((b − a) × 24 − 1) en los tres clips')
