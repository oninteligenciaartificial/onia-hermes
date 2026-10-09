#!/usr/bin/env python3
"""Para el control de cara del FINAL (qa/face-gate-final.txt): arma, para cada escena de foto y para tres instantes en reposo, (1) el cuadro del final
(ffmpeg) y (2) la FOTO FUENTE llevada a 1080x1920 con `object-fit:cover` y el mismo empuje lento (escala del instante, origen en la cara), SIN comprimir.
Después `face-gate.sh` mide los dos y la diferencia dice si el escalado y el H.264 deformaron la cara (regla del repo: ≤ 0,02).
Uso (venv del face-gate):  $FACE_GATE_HOME/venv/bin/python scripts/fuente-con-zoom.py out/g4-final-1080x1920.mp4 DIR_DE_SALIDA   → imprime los argumentos para face-gate.sh
"""
import json, os, subprocess, sys
import cv2, numpy as np
P = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
plan = json.load(open(os.path.join(P, 'plan.json')))
caras = json.load(open(os.path.join(P, 'qa/caras-fotos.json')))['fotos']
final, out = sys.argv[1], os.path.abspath(sys.argv[2])
os.makedirs(out, exist_ok=True)
FPS = plan['lienzo']['fps']; PUSH = plan['empuje']['cuadros'] / FPS; ZOOM = plan['zoom']['fin']
args = []
for m in plan['medios']:
    if m['tipo'] != 'foto':
        continue
    ts = [2.8, 4.0, 5.2] if m['a'] == 0 else [m['a'] + PUSH + 0.6, (m['a'] + m['b']) / 2, m['b'] - PUSH - 0.6]
    im = cv2.imread(os.path.join(P, plan['fotos'][m['foto']]['src'])); h, w = im.shape[:2]
    s0 = max(1080 / w, 1920 / h)
    im = cv2.resize(im, (int(round(w * s0)), int(round(h * s0))), interpolation=cv2.INTER_AREA)
    dx, dy = (im.shape[1] - 1080) // 2, (im.shape[0] - 1920) // 2
    im = im[dy:dy + 1920, dx:dx + 1080]
    x1, y1, x2, y2 = caras[m['foto']]['caja']; ox, oy = (x1 + x2) / 2, (y1 + y2) / 2
    for t in ts:
        n = round(t * FPS); t = n / FPS
        s = 1 + (ZOOM - 1) * min(1, max(0, (t - m['a']) / (m['b'] - m['a'])))
        src = cv2.warpAffine(im, np.float32([[s, 0, ox * (1 - s)], [0, s, oy * (1 - s)]]), (1080, 1920), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
        a = os.path.join(out, f"{m['id']}_t{t:.2f}_FINAL.png"); b = os.path.join(out, f"{m['id']}_t{t:.2f}_fuente.png")
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', final, '-vf', f'select=eq(n\\,{n})', '-vsync', '0', '-frames:v', '1', '-update', '1', a], check=True)
        cv2.imwrite(b, src)
        args += [a, b]
print('\n'.join(args))
