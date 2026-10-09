#!/usr/bin/env python3
"""PSNR del FINAL contra cada foto fuente (método de psnr-clips.py de G1/G2/G3, adaptado a fotos fijas con empuje lento).
Para cada escena de foto de plan.json se toman 3 cuadros en reposo (lejos de los empujes y de la tarjeta), se arma lo que DEBERÍA verse
(foto fuente → `object-fit:cover` a 1080x1920 → empuje lento 1,00→1,04 con el origen en el centro de la cara medida) y se compara contra el cuadro del final,
SOLO en la franja y 0-900 (abajo van la tarjeta, el dato y el sello; arriba del cuadro de 0 a 2,4 s va el rótulo, por eso el gancho se mide a 2,8 s).
Dos controles: (1) entre las 8 fotos candidatas, el pico tiene que ser la foto que el plan dice (si no, hay una foto cruzada); (2) con la foto correcta,
el pico tiene que estar en la escala de zoom que el plan dice (probando −0,02, −0,01, 0, +0,01, +0,02: si no, el empuje lento está corrido).
Uso (venv del face-gate, que trae numpy + cv2):  $FACE_GATE_HOME/venv/bin/python scripts/psnr-fotos.py out/g4-final-1080x1920.mp4 > qa/psnr-fotos.txt
"""
import json, os, subprocess, sys, tempfile
import cv2, numpy as np
P = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
plan = json.load(open(os.path.join(P, 'plan.json')))
caras = json.load(open(os.path.join(P, 'qa/caras-fotos.json')))['fotos']
final = sys.argv[1]
FPS = plan['lienzo']['fps']; PUSH = plan['empuje']['cuadros'] / FPS; ZOOM = plan['zoom']['fin']
FR = 1080, 1920

def base(foto):
    im = cv2.imread(os.path.join(P, plan['fotos'][foto]['src']))
    h, w = im.shape[:2]
    s = max(FR[0] / w, FR[1] / h)
    im = cv2.resize(im, (int(round(w * s)), int(round(h * s))), interpolation=cv2.INTER_AREA)
    dx, dy = (im.shape[1] - FR[0]) // 2, (im.shape[0] - FR[1]) // 2
    return im[dy:dy + FR[1], dx:dx + FR[0]]

def con_zoom(im, s, ox, oy):
    M = np.float32([[s, 0, ox * (1 - s)], [0, s, oy * (1 - s)]])
    return cv2.warpAffine(im, M, FR, flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)

def psnr(a, b):
    mse = np.mean((a.astype(np.float64) - b.astype(np.float64)) ** 2)
    return 99.0 if mse == 0 else 10 * np.log10(255.0 ** 2 / mse)

# escenas de foto y tres instantes en reposo (frames del final)
casos = []
for m in plan['medios']:
    if m['tipo'] != 'foto':
        continue
    a, b = m['a'], m['b']
    if m['a'] == 0:
        ts = [2.8, 4.0, 5.2]                               # el rótulo sale a 2,58 s; las miniaturas entran desde 3,1 s pero quedan bajo y=900
    else:
        ts = [a + PUSH + 0.6, (a + b) / 2, b - PUSH - 0.6]
    for t in ts:
        casos.append((m, round(t * FPS)))
sel = '+'.join(f'eq(n\\,{n})' for _, n in sorted(casos, key=lambda c: c[1]))
tmp = tempfile.mkdtemp()
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', final, '-vf', f'select={sel}', '-vsync', '0', os.path.join(tmp, 'f%03d.png')], check=True)
orden = sorted(casos, key=lambda c: c[1])
cands = {k: base(k) for k in plan['fotos']}
print('PSNR del final contra la fuente (franja y 0-900). Pico esperado: la foto del plan, con el zoom del plan.')
print(f"{'escena':10} {'t_final':>8} {'zoom':>6}   " + ' '.join(f'{k:>7}' for k in plan['fotos']) + '   mejor     zoom pico   ok')
malos = 0
for i, (m, n) in enumerate(orden):
    fr = cv2.imread(os.path.join(tmp, f'f{i + 1:03d}.png'))[:900]
    t = n / FPS
    s = 1 + (ZOOM - 1) * min(1, max(0, (t - m['a']) / (m['b'] - m['a'])))
    x1, y1, x2, y2 = caras[m['foto']]['caja']; ox, oy = (x1 + x2) / 2, (y1 + y2) / 2
    res = {}
    for k, im in cands.items():
        cx1, cy1, cx2, cy2 = caras[k]['caja']
        res[k] = psnr(fr, con_zoom(im, s, (cx1 + cx2) / 2, (cy1 + cy2) / 2)[:900])
    mejor = max(res, key=res.get)
    zs = {d: psnr(fr, con_zoom(cands[m['foto']], s + d, ox, oy)[:900]) for d in (-0.02, -0.01, 0, 0.01, 0.02)}
    zpico = max(zs, key=zs.get)
    ok = mejor == m['foto'] and abs(zpico) < 1e-9
    malos += 0 if ok else 1
    print(f"{m['id']:10} {t:>8.3f} {s:>6.3f}   " + ' '.join(f'{v:7.1f}' for v in res.values()) + f"   {mejor:8} {zpico:+.2f}      {'ok' if ok else '✖'}")
print('✔ cada escena muestra la foto del plan, con el empuje lento del plan' if not malos else f'✖ {malos} caso(s) con la foto cruzada o el zoom corrido')
sys.exit(1 if malos else 0)
