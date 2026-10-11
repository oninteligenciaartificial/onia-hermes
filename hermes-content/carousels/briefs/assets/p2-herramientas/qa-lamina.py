#!/usr/bin/env python3
"""Control de calidad de P2 (11-oct-2026). Uso: python3 qa-lamina.py <carpeta-out> <brief.json>
Por lámina: banda de contenido sin la etiqueta NN/10 ni el @handle, % vacío (1 - alto de contenido / 1.171 px de zona segura),
márgenes izquierdo/derecho, rojo/terracota SÓLIDO (R domina por más de 40, bloques de 5x5 px; las franjas de 1 px del antialiasing LCD
de las letras no cuentan) y exporta jpg/ a q92 con su peso. Al final cuenta las palabras visibles (título, marcas, pie, CTA y `next`).
"""
import sys, os, json, re, glob, colorsys
import numpy as np
from PIL import Image
out, brief = sys.argv[1], sys.argv[2]
d = json.load(open(brief, encoding='utf-8'))
PEND = lambda s: 'PENDIENTE' in (s.get('image') or '')
res = []
os.makedirs(out + '/jpg', exist_ok=True)
for i, s in enumerate(d['slides'], 1):
    f = f'{out}/slide-{i:02d}.png'
    im = Image.open(f).convert('RGB'); a = np.asarray(im).astype(int)
    h, w, _ = a.shape
    bg = a[3, 3]
    dist = np.abs(a - bg).sum(axis=2)
    ink = dist > 60
    # banda de contenido: sin la etiqueta NN/10 (y<150), ni el @handle / flecha (y>1255)
    band = ink[150:1255]
    rows = np.where(band.any(axis=1))[0]
    y0, y1 = (rows.min() + 150, rows.max() + 150) if len(rows) else (0, 0)
    span = y1 - y0 + 1
    vacio = 100 * (1 - span / (1255 - 84))
    cols = np.where(band.any(axis=0))[0]
    x0, x1 = cols.min(), cols.max()
    # rojo/terracota SÓLIDO: R domina a G y B por más de 40 (R>120) en bloques de al menos 5x5 px, en TODA la lámina (capturas
    # incluidas). Las franjas de 1 px naranja/azul del antialiasing LCD de las letras no son color y no sobreviven al filtro.
    m = (a[:, :, 0] > 120) & (a[:, :, 0] - a[:, :, 1] > 40) & (a[:, :, 0] - a[:, :, 2] > 40)
    from PIL import ImageFilter
    sol = np.asarray(Image.fromarray((m * 255).astype('uint8')).filter(ImageFilter.MinFilter(5))) > 0
    rojo = int(sol.sum()); franja = int(m.sum())
    jp = f'{out}/jpg/slide-{i:02d}.jpg'
    im.save(jp, 'JPEG', quality=92, optimize=True)
    res.append(dict(n=i, bg=tuple(int(x) for x in bg), y0=int(y0), y1=int(y1), span=int(span), vacio=round(float(vacio), 1), x0=int(x0), x1=int(x1), margen_izq=int(x0), margen_der=int(w - 1 - x1), rojo_solido_px=rojo, franja_px=franja, jpg_kb=round(os.path.getsize(jp) / 1024), pend=PEND(s)))
for r in res: print(r)
# palabras visibles (título + marcas + pie + cta), sin NN/10, flechas ni @handle; la etiqueta de serie por separado
strip = lambda t: re.sub(r'[*▌→]', ' ', (t or '').replace(' ', ' '))
words = lambda t: [x for x in re.split(r'\s+', strip(t)) if x and x != '·' and re.search(r'\w', x)]
tot = 0; tot_next = 0; por = []
for i, s in enumerate(d['slides'], 1):
    n = len(words(s.get('headline'))) + len(words(s.get('body'))) + len(words(s.get('cta')))
    n += sum(len(words(l.get('label'))) for l in s.get('logos', []))
    nx = len(words(s.get('next')))
    por.append((i, n, nx)); tot += n; tot_next += nx
print('palabras por lámina (n, next):', por)
print('TOTAL visibles', tot, '| con las palabras de «next»', tot + tot_next, '| serie en las 10 etiquetas:', 10 * len(words(d.get('serie'))))
