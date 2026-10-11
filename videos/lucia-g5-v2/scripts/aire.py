#!/usr/bin/env python3
"""G5 v2 · AIRE MUERTO medido en los PÍXELES del render (complementa a aire.mjs, que mide el DOM).
Por cada cuadro: diferencia media absoluta de luma contra el cuadro anterior (gris 270x480). Un cuadro es «quieto» si la diferencia < TAU (0,02: en el render de G5 una placa
quieta da 0,001 y el empuje lento de una foto 0,3-0,7, o sea el empuje lento SÍ cuenta como movimiento aquí). Imprime:
  · el mayor tramo quieto SIN descontar nada (k cuadros iguales = k / 24 s);
  · el mayor tramo quieto DESCONTANDO el tiempo de lectura de cada tarjeta (qa/lectura-tarjetas.json, que escribe aire.mjs).
Uso (venv del face-gate: numpy + cv2):  $FACE_GATE_HOME/venv/bin/python scripts/aire.py out/g5-v2-final-1080x1920.mp4 > qa/aire-pixeles.txt
"""
import json, os, sys
import cv2, numpy as np
TAU = 0.02
P = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
plan = json.load(open(os.path.join(P, 'plan.json')))
lect = json.load(open(os.path.join(P, 'qa/lectura-tarjetas.json')))
FPS = plan['lienzo']['fps']; MAXQ = plan['aire']['quieto_max_s']
cap = cv2.VideoCapture(sys.argv[1]); prev = None; d = []
while True:
    ok, fr = cap.read()
    if not ok: break
    g = cv2.cvtColor(cv2.resize(fr, (270, 480), interpolation=cv2.INTER_AREA), cv2.COLOR_BGR2GRAY).astype(np.float32)
    d.append(0.0 if prev is None else float(np.abs(g - prev).mean())); prev = g
d = np.array(d); N = len(d)
en_lectura = lambda f: any(l['legible_desde'] - 1e-9 <= f / FPS < l['lee_hasta'] - 1e-9 for l in lect)
quieto = [f > 0 and d[f] < TAU for f in range(N)]
def tramos(descontar):
    out = []; cur = None
    for f in range(N):
        q = quieto[f] and not (descontar and en_lectura(f))
        if q:
            if cur is None: cur = [f - 1, f]
            else: cur[1] = f
        elif cur is not None: out.append(cur); cur = None
    if cur is not None: out.append(cur)
    return sorted([(r[0], r[1], (r[1] - r[0] + 1) / FPS) for r in out], key=lambda r: -r[2])
def cual(f):
    t = f / FPS
    return next((c['id'] for c in plan['tarjetas'] if c['a'] - 1e-6 <= t < c['b']), '—')
print(f'cuadros: {N}  (diferencia de luma entre cuadros: mínima {d[1:].min():.4f}, mediana {np.median(d[1:]):.3f}, máxima {d.max():.2f}; quieto = < {TAU})')
crudo, muerto = tramos(False), tramos(True)
print(f'\nSIN descontar la lectura de tarjetas: {len(crudo)} tramos quietos; los mayores:')
for a, b, s in crudo[:6]: print(f'  {a / FPS:.3f}–{(b + 1) / FPS:.3f} s ({b - a + 1} cuadros iguales = {s:.3f} s) en {cual(a)}')
print(f'\nDESCONTANDO la lectura de tarjetas: {len(muerto)} tramos; los mayores:')
for a, b, s in muerto[:6]: print(f'  {a / FPS:.3f}–{(b + 1) / FPS:.3f} s ({b - a + 1} cuadros iguales = {s:.3f} s) en {cual(a)}')
mx = muerto[0][2] if muerto else 0.0
print(f'\nMAYOR TRAMO QUIETO en los píxeles, fuera de una lectura: {mx:.3f} s (límite {MAXQ} s)')
print(f'MAYOR TRAMO QUIETO en los píxeles, contando las lecturas: {crudo[0][2] if crudo else 0.0:.3f} s')
# el empuje lento de las fotos: diferencia media en reposo de cada foto
for m in plan['medios']:
    if m['tipo'] != 'foto': continue
    a, b = int((m['a'] + 0.5) * FPS), int((m['b'] - 0.5) * FPS)
    seg = d[a:b]
    print(f"  {m['id']:9} empuje lento: diferencia media {seg.mean():.3f} (mín {seg.min():.3f}) entre cuadros, de {a / FPS:.2f} a {b / FPS:.2f} s")
sys.exit(1 if mx > MAXQ + 1e-9 else 0)
