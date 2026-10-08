#!/usr/bin/env python3
# H3/H8: cuadros PLANOS (vacíos) y saltos de luma entre cuadros consecutivos (destellos) de un render. Imprime también la luma/desviación de los
# cuadros de cada costura. Uso (necesita numpy + cv2: el venv del control de cara sirve):
#   $FACE_GATE_HOME/venv/bin/python scripts/vacios.py out/g3-final-1080x1920.mp4 > qa/vacios-y-saltos.txt
# G3: imprime la luma/desviación de las 4 costuras (empujes de 27,0 / 40,25 / 46,0 / 53,25 s) y de los 2 morphs (19,0 y 23,0 s).
import sys, numpy as np, cv2
v=sys.argv[1]
cap=cv2.VideoCapture(v); n=int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
L=[];S=[]
for i in range(n):
    ok,fr=cap.read()
    if not ok: break
    g=cv2.cvtColor(cv2.resize(fr,(180,320)),cv2.COLOR_BGR2GRAY).astype(float)
    L.append(g.mean()); S.append(g.std())
L=np.array(L);S=np.array(S)
print('cuadros',len(L))
vac=[i for i in range(len(L)) if S[i]<6]
print('cuadros PLANOS (std<6):',vac)
print('luma min/max: %.1f / %.1f'%(L.min(),L.max()))
d=np.abs(np.diff(L))
top=np.argsort(-d)[:12]
print('mayores saltos de luma entre cuadros consecutivos (cuadro i -> i+1, t, luma_i, luma_i+1):')
for i in sorted(top): print('  %d->%d  t=%.3f  %.1f -> %.1f  (Δ=%.1f)'%(i,i+1,(i+1)/24,L[i],L[i+1],d[i]))
for name,f0,f1 in [('19.0 morph',454,472),('23.0 morph',550,568),('27.0',640,650),('40.25',958,968),('46.0',1096,1106),('53.25',1270,1280)]:
    print(name,' '.join('%d:%.0f/%.0f'%(i,L[i],S[i]) for i in range(f0,f1)))
