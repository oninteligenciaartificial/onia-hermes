#!/usr/bin/env python3
"""Cuenta, EN EL VIDEO TERMINADO, cuántos cuadros ve el espectador de cada clip (verificador 4, v2.4).

Definición única de «segundos visibles»: cuadros del master con alguna parte del clip a la vista ÷ 24.
El clip entra y sale con un empuje rígido de 6 cuadros (ease power3.inOut). En el cuadro de arranque del
empuje de entrada el clip está todavía fuera del lienzo (x = ancho): ese cuadro no cuenta. Por eso un clip
cuya ventana es [a, b) se ve (b − a) × 24 − 1 cuadros: m1 66, m3 78 y m5 106 = 2,75 · 3,25 · 4,42 s.

Cómo se comprueba (no se confía en el plan): para cada cuadro n del master cerca del clip se calcula qué
columnas del lienzo ocupa el clip (la geometría del empuje) y se compara esa franja, en las filas 0-250 (sin
tarjetas ni etiquetas), con el cuadro esperado del clip fuente escalado a 1080x1920 (720x1280 × 1,5). Un
cuadro cuenta como visible si la franja coincide (PSNR ≥ 24 dB y sin ser peor que el del cuadro vecino del clip por más de 1,5 dB); el
cuadro de arranque se verifica por lo contrario: ninguna franja de 4 px pegada al borde coincide.
OJO: la costura es un empuje power3.inOut de GSAP, que es CUÁRTICA (8p⁴): en el primer cuadro de movimiento solo asoma
una franja de ≈ 7 px del clip y en el último, otra igual. Cuentan (alguna parte del clip a la vista); el informe
da además los cuadros con el clip a pantalla completa y quieto (x = 0).

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
ROWS = 700                                    # filas 0-700: sin tarjetas ni etiquetas durante los clips (el rótulo, y = 720, ya salió a los 3 s)
med = {m['id']: m for m in plan['medios']}


def ease(p):                                   # GSAP power3.inOut = cuártica (power1 = cuadrática, power2 = cúbica, power3 = cuártica)
    return 8 * p ** 4 if p < 0.5 else 1 - ((-2 * p + 2) ** 4) / 2


def psnr(a, b):
    d = np.mean((a.astype(np.float32) - b.astype(np.float32)) ** 2)
    return 99.0 if d < 1e-9 else float(10 * np.log10(255.0 ** 2 / d))


def leer(path, filas=None, quedan=None):
    """cuadros en gris; `filas` = cuántas filas de arriba se guardan; `quedan` = conjunto de índices que se guardan (el resto, None)"""
    cap = cv2.VideoCapture(path)
    out = []
    while True:
        ok, f = cap.read()
        if not ok:
            break
        i = len(out)
        if quedan is not None and i not in quedan:
            out.append(None)
            continue
        g = cv2.cvtColor(f, cv2.COLOR_BGR2GRAY)
        out.append(g[:filas] if filas else g)
    cap.release()
    return out


ventanas = {}
for id_ in ('m1', 'm3', 'm5'):
    ventanas[id_] = (int(round(med[id_]['a'] * FPS)), int(round(med[id_]['b'] * FPS)))
necesarios = {n for fa, fb in ventanas.values() for n in range(fa - 1, fb + 2)}
master = leer(VIDEO, ROWS, necesarios)                         # solo las filas 0-700 de los cuadros que hacen falta
N = len(master)


def fuente(id_):
    """cuadros del clip fuente, escalados como el lienzo (cover 720x1280 → 1080x1920 = ×1,5), filas 0-250"""
    src = os.path.join(P, med[id_]['src']) if med[id_].get('src') else None
    fr = []
    for g in leer(src, int(round(ROWS / 1.5))):
        fr.append(cv2.resize(g, (W, ROWS), interpolation=cv2.INTER_LINEAR))
    return fr


resultados = {}
lineas = []
for id_ in ('m1', 'm3', 'm5'):
    m = med[id_]
    fa, fb = ventanas[id_]
    c0 = int(round(m.get('media_inicio', 0) * FPS))
    fr = fuente(id_)
    filas = []                                      # (n, visible, completo, texto)
    for n in range(fa - 1, fb + 2):
        if n < 0 or n >= N or master[n] is None:
            continue
        c = c0 + (n - fa)
        k_in, k_out = n - fa, n - (fb - PUSH)
        # franja del lienzo que ocupa el clip: columnas [x1, x2) del master ↔ columnas [s1, s2) del clip
        if n < fa or n >= fb or c < 0 or c >= len(fr):
            filas.append((n, False, False, 'fuera de la ventana del clip'))
            continue
        if k_in < PUSH:                                # empuje de entrada: el clip llega desde la derecha
            off = int(round(W * (1 - ease(k_in / PUSH))))
            x1, x2, s1, s2 = off, W, 0, W - off
        elif k_out >= 0:                               # empuje de salida: el clip se va por la izquierda
            off = int(round(W * ease(k_out / PUSH)))
            x1, x2, s1, s2 = 0, W - off, off, W
        else:
            x1, x2, s1, s2 = 0, W, 0, W
        if x2 - x1 <= 0:
            # cuadro de arranque del empuje de entrada: el clip está justo fuera del lienzo (x = ancho). Se comprueba lo contrario:
            # una franja de 4 px pegada al borde derecho NO coincide con el borde izquierdo del clip (ahí está la placa que sale)
            p4 = psnr(master[n][:, W - 4:], fr[c][:, :4])
            filas.append((n, p4 >= 24.0, False, f'franja de 0 px (el clip está fuera del lienzo, x = {W}); 4 px del borde: {p4:.1f} dB (no coincide: no se ve)'))
            continue
        g = 2 if (x2 - x1) < 16 else 0                 # en una franja de pocos px se saltan 2 columnas del borde (mezcla de subpíxel)
        if x1 > 0:
            a1, a2, b1, b2 = x1 + g, x2, s1 + g, s2
        else:
            a1, a2, b1, b2 = x1, x2 - g, s1, s2 - g
        pm = psnr(master[n][:, a1:a2], fr[c][:, b1:b2])
        vec = [psnr(master[n][:, a1:a2], fr[c + dc][:, b1:b2]) for dc in (-1, 1) if 0 <= c + dc < len(fr)]
        ok = pm >= 24.0 and (not vec or pm >= max(vec) - 1.5)        # el cuadro esperado del clip coincide (m1 casi no se mueve: su cuadro vecino da lo mismo ±1,5 dB; el timing lo prueba psnr-clips.py)
        completo = (x1 == 0 and x2 == W)
        filas.append((n, ok, ok and completo, f'franja x {x1}-{x2} ({x2 - x1} px): {pm:.1f} dB' + (f' (cuadro vecino del clip {max(vec):.1f} dB)' if vec else '')))
    vis = [n for n, ok, _, _ in filas if ok]
    comp = [n for n, _, cmp_, _ in filas if cmp_]
    esperado = (fb - fa) - 1
    resultados[id_] = (len(vis), esperado, len(comp))
    lineas.append((f"{id_}: {len(vis)} cuadros visibles (cuadros {vis[0]}-{vis[-1]} del master) = {len(vis) / FPS:.2f} s" if vis else f'{id_}: 0 cuadros visibles').replace('.', ','))
    lineas.append(f'    con el clip a pantalla completa y quieto (x = 0): {len(comp)} cuadros = {len(comp) / FPS:.2f} s; los otros {len(vis) - len(comp)} son los del empuje de entrada y de salida (franjas parciales)'.replace('.', ','))
    lineas.append(f'    ventana del plan: cuadros {fa}-{fb - 1} ({fb - fa} cuadros = {(fb - fa) / FPS:.2f} s); el cuadro {fa} (clip fuera del lienzo) no cuenta; plan: (b − a) × 24 − 1 = {esperado}'.replace('.', ','))
    for n, ok, cmp_, txt in filas:
        if n in (fa - 1, fa, fa + 1, fa + 2, fa + PUSH - 1, fa + PUSH, fb - PUSH, fb - PUSH + 1, fb - 2, fb - 1, fb, fb + 1):
            lineas.append(f'    n{n:<4d} {"VISIBLE   " if ok else "no visible"}  {txt}')

print('Cuadros visibles de cada clip, contados EN EL MASTER (' + os.path.basename(VIDEO) + f', {N} cuadros a {FPS} fps):')
print('«Segundos visibles» = cuadros del master con alguna parte del clip a la vista ÷ 24 (el clip entra y sale con un empuje de 6 cuadros; el cuadro de arranque del empuje de entrada lo deja fuera del lienzo y no cuenta).')
print(f'Método: por cada cuadro, la franja del lienzo que ocupa el clip (geometría del empuje: power3.inOut de GSAP = cuártica) se compara en las filas 0-{ROWS} con el cuadro esperado del clip fuente ×1,5 (PSNR ≥ 24 dB y sin ser peor que el del cuadro vecino del clip por más de 1,5 dB).')
print()
print('\n'.join(lineas))
malos = [i for i, (n, e, c) in resultados.items() if n != e]
print()
print('Resumen: ' + ' · '.join(f"{i} {n} cuadros = {n / FPS:.2f} s".replace('.', ',') for i, (n, e, c) in resultados.items()) + '  (a pantalla completa: ' + ' · '.join(f"{i} {c} = {c / FPS:.2f} s".replace('.', ',') for i, (n, e, c) in resultados.items()) + ')')
if malos:
    print('✖ el conteo del master no coincide con el plan en: ' + ', '.join(malos), file=sys.stderr)
    sys.exit(1)
print('✔ el conteo del master coincide con el plan ((b − a) × 24 − 1) en los tres clips')
