#!/usr/bin/env python3
"""PSNR del FINAL contra cada clip fuente (método de G1/G3): ¿cada clip cae en el cuadro que dice el plan, a 1×, sin acelerar ni correrse?
Para cada motor se toma el cuadro n del clip (cuadro 0 = su `a` en plan.json), se lo lleva a 1080x1920 (lanczos, igual que el navegador x1,5) y se
compara contra el cuadro del final en a + n/24, SOLO en la franja y 250-1000 (arriba hay aro/rótulo y abajo van la tarjeta y los datos).
Se prueban los cuadros n-2…n+2 de la fuente: el PICO tiene que caer en n (si cae en otro, el clip está corrido).
Contra clips sin `color_space` el PSNR absoluto sale bajo aunque la imagen sea igual (bt601 contra bt709, G1): por eso se imprime también la
diferencia de la media por canal RGB (≤ ±3 niveles = mismo color).
Uso:  python3 scripts/psnr-clips.py out/g2-final-1080x1920.mp4 > qa/psnr-clips.txt
"""
import json, os, re, subprocess, sys, tempfile
P = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
ROOT = os.path.abspath(os.path.join(P, '..', '..'))
plan = json.load(open(os.path.join(P, 'plan.json')))
final = sys.argv[1]
med = {m['id']: m for m in plan['medios']}
CROP = 'crop=1080:750:0:250'
tmp = tempfile.mkdtemp()

def frame(src, n, out, scale):
    vf = f"select=eq(n\\,{n})" + (",scale=1080:1920:flags=lanczos" if scale else "") + "," + CROP
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-vf', vf, '-frames:v', '1', '-vsync', '0', '-update', '1', out], check=True)

def media_rgb(img):
    o = subprocess.run(['ffmpeg', '-v', 'error', '-i', img, '-vf', 'scale=1:1:flags=area,format=rgb24', '-f', 'rawvideo', '-'], capture_output=True, check=True).stdout
    return list(o[:3])

def psnr(a, b):
    r = subprocess.run(['ffmpeg', '-v', 'info', '-i', a, '-i', b, '-lavfi', 'psnr', '-f', 'null', '-'], capture_output=True, text=True)
    m = re.search(r'average:([0-9.]+|inf)', r.stderr)
    return float(m.group(1)) if m else float('nan')

# (id, clip fuente, cuadro n del clip) — tres cuadros por motor, lejos de los empujes
casos = []
for k in ['m1', 'm2', 'm3', 'm4', 'm5', 'm6']:
    for n in ([30, 60, 90] if k != 'm6' else [12, 30, 48]):      # 2da pasada: el Motor 6 se ve de 0 a 59 (2,5 s)
        casos.append((k, k, n))
for n in [20, 50, 80]:
    casos.append(('k1', 'm1', n))               # el cierre arranca en el cuadro 48 del clip (H7): n es el cuadro del cierre, la fuente es n + 48
print('PSNR del final contra la fuente (franja y 250-1000, fuente llevada a 1080x1920 con lanczos). Pico esperado en el cuadro n.')
print(f"{'medio':6} {'cuadro n':>8} {'t_final':>8}   " + '   '.join(f'n{d:+d}' for d in range(-2, 3)) + '    pico   ΔRGB(media)')
malos = 0
for mid, src, n in casos:
    a = med[mid]['a']
    off = int(round(med[mid].get('media_inicio', 0) * 24))          # offset del clip fuente (cierre K1: 48 cuadros)
    F = round((a + n / 24) * 24)
    fin = os.path.join(tmp, f'fin_{mid}_{n}.png')
    frame(final, F, fin, False)
    res = []
    for d in range(-2, 3):
        s = os.path.join(tmp, f'src_{mid}_{n}_{d}.png')
        frame(plan_src := os.path.join(P, 'assets', f'{src}.mp4'), n + off + d, s, True)
        res.append(psnr(fin, s))
    best = max(range(5), key=lambda i: res[i]) - 2
    s0 = os.path.join(tmp, f'src_{mid}_{n}_0.png')
    rf, rs = media_rgb(fin), media_rgb(s0)
    dr = [rf[i] - rs[i] for i in range(3)]
    ok = best == 0
    if not ok:
        malos += 1
    print(f"{mid:6} {n:>8} {F / 24:>8.3f}   " + '   '.join(f'{v:5.1f}' for v in res) + f"    {best:+d} {'ok' if ok else '✖'}   {dr[0]:+d}/{dr[1]:+d}/{dr[2]:+d}")
print('✔ todos los picos caen en el cuadro prometido' if not malos else f'✖ {malos} caso(s) con el pico corrido')
sys.exit(1 if malos else 0)
