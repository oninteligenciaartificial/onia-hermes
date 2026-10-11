#!/usr/bin/env python3
"""AIRE MUERTO medido sobre el VIDEO RENDERIZADO (regla 15): ningún tramo de más de 0,3 s con la pantalla idéntica y sin una tarjeta en lectura.
Método: cada cuadro se lleva a gris de 270x480 (INTER_AREA); entre un cuadro y el siguiente se cuentan los píxeles que cambian más de 6 niveles (de 0-255).
«Idéntico» = menos de NMIN (8) píxeles cambiados (el ruido de compresión de un fondo quieto no pasa de 2 niveles; un rótulo que cambia de color, una barra que crece
o una miniatura que entra cambian cientos). La diferencia MEDIA no sirve: un objeto chico que se mueve (la escala dibujándose) da 0,03-0,1 y pasaría por quieto.
Un tramo quieto = cuadros consecutivos idénticos. Un tramo quieto se perdona
SOLO mientras una tarjeta está en su tiempo de lectura (0,35 s por palabra + 0,3 desde que la tarjeta llega a su lugar; plan.resuelto.json → tarjetas).
Imprime: el mayor tramo quieto (con y sin tarjeta), todos los tramos de más de 0,3 s con su veredicto, la distribución de la diferencia y los
eventos visuales por 10 s (de qa/eventos.json, que escribe scripts/eventos.mjs). Sale con 1 si queda un tramo de más de 0,3 s sin tarjeta en lectura.
Uso (venv con numpy + cv2):  python3 scripts/aire.py out/g2-v2-final-1080x1920.mp4 > qa/aire.txt
"""
import json, os, sys
import cv2, numpy as np

P = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
plan = json.load(open(os.path.join(P, 'plan.resuelto.json')))
FPS = plan['lienzo']['fps']
NIVEL = 6
NMIN = int(os.environ.get('AIRE_NMIN', '8'))
AN = (270, 480)
MAX_S = 0.3
cap = cv2.VideoCapture(sys.argv[1])
n = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
prev = None
d = []
nc = []
for i in range(n):
    ok, fr = cap.read()
    if not ok:
        break
    g = cv2.cvtColor(cv2.resize(fr, AN, interpolation=cv2.INTER_AREA), cv2.COLOR_BGR2GRAY).astype(np.float32)
    if prev is not None:
        dd = np.abs(g - prev)
        d.append(float(dd.mean()))
        nc.append(int((dd > NIVEL).sum()))
    prev = g
d = np.array(d)
nc = np.array(nc)
N = len(d) + 1

# tiempos de lectura de las tarjetas: [a, a + 0,35·palabras + 0,3] (a = cuando la tarjeta llega a su lugar; c1 ya está en el cuadro 0)
lect = [(c['a'], c['a'] + c['min_s']) for c in plan['tarjetas']]

def cubierto(f0, f1):
    """segundos del tramo de cuadros idénticos [f0, f1] (inclusive) que NO están bajo una tarjeta en lectura, como lista de (inicio, fin) en cuadros"""
    sin = []
    f = f0
    while f <= f1:
        t = (f + 0.5) / FPS
        if any(a - 1e-6 <= t <= b + 1e-6 for a, b in lect):
            f += 1
            continue
        g = f
        while g + 1 <= f1 and not any(a - 1e-6 <= (g + 1.5) / FPS <= b + 1e-6 for a, b in lect):
            g += 1
        sin.append((f, g))
        f = g + 1
    return sin

quiet = nc < NMIN                     # quiet[i]: el cuadro i y el i+1 son idénticos
runs = []
i = 0
while i < len(quiet):
    if quiet[i]:
        j = i
        while j + 1 < len(quiet) and quiet[j + 1]:
            j += 1
        runs.append((i, j + 1))       # cuadros i..j+1 idénticos
        i = j + 1
    else:
        i += 1
largo = max((b - a + 1 for a, b in runs), default=1)
print(f'cuadros: {N} ({N / FPS:.3f} s)   «idéntico» = menos de {NMIN} píxeles (de {AN[0] * AN[1]}) cambian más de {NIVEL} niveles entre cuadros consecutivos')
print(f'píxeles cambiados entre cuadros consecutivos: mínimo {nc.min()} · mediana {int(np.median(nc))} · percentil 5 {int(np.percentile(nc, 5))} · transiciones idénticas: {int(quiet.sum())} de {len(d)}')
print(f'MAYOR TRAMO QUIETO (pantalla idéntica, con o sin tarjeta): {largo / FPS:.3f} s ({largo} cuadros)')
malos = []
mayor_sin = 0
print(f'tramos idénticos de más de {MAX_S} s:')
largos = [(a, b) for a, b in runs if (b - a + 1) / FPS > MAX_S + 1e-9]
if not largos:
    print('  ninguno')
for a, b in largos:
    sin = cubierto(a, b)
    peor = max(((y - x + 1) for x, y in sin), default=0)
    mayor_sin = max(mayor_sin, peor)
    ok = peor / FPS <= MAX_S + 1e-9
    print(f'  {a / FPS:6.3f}–{(b + 1) / FPS:6.3f} s  {(b - a + 1) / FPS:.3f} s idénticos; sin tarjeta en lectura: {peor / FPS:.3f} s  {"ok (tarjeta en lectura)" if ok else "✖ AIRE"}')
    if not ok:
        malos.append((a, b))
runs_cortos = [(a, b) for a, b in runs if (b - a + 1) / FPS <= MAX_S + 1e-9 and (b - a + 1) > 1]
print(f'MAYOR TRAMO QUIETO SIN TARJETA EN LECTURA: {max(mayor_sin, max(((b - a + 1) for a, b in runs_cortos), default=1)) / FPS:.3f} s (tope {MAX_S} s)')
ev = json.load(open(os.path.join(P, 'qa/eventos.json'))) if os.path.exists(os.path.join(P, 'qa/eventos.json')) else None
if ev:
    print(f"eventos visuales por 10 s (de plan.resuelto.json): mínimo {ev['por_10s']['min']}, máximo {ev['por_10s']['max']}, promedio {ev['por_10s']['promedio']}; hueco máximo entre eventos {ev['hueco_max']:.2f} s (tope 2,0 s)")
# cambios reales de la imagen por 10 s (cuadros con diferencia ≥ EPS agrupados en «cambios» separados por ≥ 0,3 s quietos)
print('\nresumen por escena (diferencia media entre cuadros; los clips de IA son los más tranquilos):')
for m in plan['medios']:
    a, b = int(round(m['a'] * FPS)), int(round(m['b'] * FPS))
    seg = d[max(0, a): min(len(d), b)]
    if len(seg):
            sg = nc[max(0, a): min(len(nc), b)]
    print(f"  {m['id']:9} {m['a']:6.3f}–{m['b']:6.3f} s  diferencia media {seg.mean():6.2f}  píxeles cambiados: mediana {int(np.median(sg)):6d}, mínimo {int(sg.min()):6d}  transiciones idénticas {int((sg < NMIN).sum())}")
if malos:
    print(f'✖ {len(malos)} tramo(s) con aire muerto')
    sys.exit(1)
print(f'✔ ningún tramo de más de {MAX_S} s con la pantalla idéntica y sin una tarjeta en lectura')
