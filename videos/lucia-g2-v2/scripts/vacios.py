#!/usr/bin/env python3
# H3/H8: cuadros PLANOS (vacíos) y saltos de luma entre cuadros consecutivos (destellos) de un render. Imprime también la luma/desviación de los
# cuadros de cada costura. Uso (necesita numpy + cv2: el venv del control de cara sirve):
#   $FACE_GATE_HOME/venv/bin/python scripts/vacios.py out/g2-final-1080x1920.mp4 > qa/vacios-y-saltos.txt
# G2 v2: imprime la luma/desviación de los cuadros de cada costura (los 6 empujes de plan.resuelto.json, de T-6 a T+3 cuadros).
import sys, json, os, numpy as np, cv2
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
plan=json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','plan.resuelto.json')))
# saltos de luma FUERA de los empujes (los empujes pasan de una foto clara a una placa oscura: ahí el salto es esperable)
plan0=json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','plan.resuelto.json')))
en_empuje=set()
for c in plan0['costuras']:
    if c['tipo']=='empuje':
        T=int(round(c['t']*24))
        en_empuje.update(range(T-7,T+2))
fuera=[(d[i],i) for i in range(len(d)) if i not in en_empuje]
mx=max(fuera)
print('mayor salto de luma FUERA de los empujes: Δ=%.1f en %d->%d (t=%.3f)'%(mx[0],mx[1],mx[1]+1,(mx[1]+1)/24))
for name,f0,f1 in [(str(c['t']),int(round(c['t']*24))-6,int(round(c['t']*24))+4) for c in plan['costuras'] if c['tipo']=='empuje']:
    print(name,' '.join('%d:%.0f/%.0f'%(i,L[i],S[i]) for i in range(f0,f1)))
