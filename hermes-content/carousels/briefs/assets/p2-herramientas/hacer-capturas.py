#!/usr/bin/env python3
"""Capturas de P2 «7 herramientas. 4 son gratis.» que SÍ se pueden sacar desde la nube (11-oct-2026).

Uso (desde cualquier carpeta):  python3 hacer-capturas.py [--fecha 20261011] [--segundo 1.2]

Hace, en esta misma carpeta:
  04-hyperframes-intro-<fecha>.png   izquierda: líneas REALES de intro.html (captura-editor.py, líneas 6-7 y 94-103);
                                     derecha: cuadro REAL de la composición (Chromium + Playwright, window.__timelines.intro,
                                     seek al segundo --segundo), un solo PNG más ancho que alto.
  07-whisper-palabras-<fecha>.png    palabras y segundos REALES del transcript de faster-whisper (campos w y s), sin prompt ni rutas.
  08-foto-fotobn-lote-s32-20261008.jpg  la foto generada el 8-oct (galería), recortada a ~1,7:1: NO es una captura de Higgsfield.
  PENDIENTE-0N-*.png                 marcadores de posición para lo que solo se saca con Chrome o en la PC. No son capturas.
No usa red de pago ni créditos. Playwright viene de /opt/node-tools; el gsap lo carga la propia composición (CDN).
"""
import argparse, json, os, shutil, subprocess, sys, tempfile
from PIL import Image, ImageDraw, ImageFont

AQUI = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(AQUI, '..', '..', '..', '..', '..'))
INTRO = 'hermes-content/scripts/hyperframes/onia-sting-01/compositions/intro.html'
TRANSCRIPT = 'videos/marca-personal/2026-10-11/n06-antigravity/transcript-whisper-small.json'
FOTO = 'hermes-content/galeria/fotos-bn/lote-fotobn-s32-c5e1d3d0.jpg'
MONO = os.path.join(REPO, '.claude/skills/edicion-referentes/scripts/erik/assets-ejemplo/fuentes/JetBrainsMono-Bold.ttf')
FONDO, VERDE, GRIS = (11, 16, 14), (16, 194, 107), (108, 124, 115)

FRAME_JS = r"""
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const fs = require('fs');
const [,, intro, harness, out, t] = process.argv;
(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  const src = fs.readFileSync(intro, 'utf8');
  // el contenido de la <template>, montado en el documento (así lo monta el runtime de HyperFrames)
  const inner = src.replace(/^[\s\S]*?<template id="intro-template">/, '').replace(/<\/template>[\s\S]*$/, '');
  fs.writeFileSync(harness, '<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;width:1920px;height:1080px;overflow:hidden;background:#f5f5f5}</style></head><body>' + inner + '</body></html>');
  await page.goto('file://' + harness, { waitUntil: 'networkidle', timeout: 30000 });
  const info = await page.evaluate((t) => {
    const tl = (window.__timelines || {}).intro;
    if (!tl) return { ok: false, keys: Object.keys(window.__timelines || {}) };
    tl.pause(); tl.seek(parseFloat(t), false);
    return { ok: true, keys: Object.keys(window.__timelines), duracion: tl.duration(), tiempo: tl.time(), gsap: gsap.version };
  }, t);
  if (!info.ok) { console.error(JSON.stringify(info)); process.exit(3); }
  await page.waitForTimeout(300);
  await page.screenshot({ path: out });
  console.log(JSON.stringify(info));
  await browser.close();
})();
"""


def fuente(px):
    return ImageFont.truetype(MONO, px) if os.path.isfile(MONO) else ImageFont.load_default()


def editor(specs, ancho, tmp):
    sp = os.path.join(tmp, 'specs.json')
    with open(sp, 'w', encoding='utf-8') as fh:
        json.dump(specs, fh, ensure_ascii=False)
    subprocess.run([sys.executable, os.path.join(REPO, 'scripts/marca-personal/captura-editor.py'), '--spec', sp, '--out', tmp, '--ancho', str(ancho)], check=True, cwd=REPO)


def captura_04(fecha, segundo, tmp):
    editor([{'nombre': '04a', 'ruta': 'compositions/intro.html', 'fuente': 30, 'bloques': [
        {'archivo': INTRO, 'desde': 6, 'hasta': 7, 'resaltar': ['HYPERFRAMES', 'THE SURVEY FINDINGS']},
        {'archivo': INTRO, 'desde': 94, 'hasta': 103, 'resaltar': ['.title']}]}], 1000, tmp)
    js = os.path.join(tmp, 'frame.js')
    with open(js, 'w', encoding='utf-8') as fh:
        fh.write(FRAME_JS)
    frame = os.path.join(tmp, 'frame.png')
    env = dict(os.environ, PLAYWRIGHT_BROWSERS_PATH='/opt/pw-browsers')
    r = subprocess.run(['node', js, os.path.join(REPO, INTRO), os.path.join(tmp, 'harness.html'), frame, str(segundo)], env=env, capture_output=True, text=True, check=True)
    print('frame:', r.stdout.strip())
    codigo = Image.open(os.path.join(tmp, '04a.png')).convert('RGB')
    cuadro = Image.open(frame).convert('RGB').resize((520, 292), Image.LANCZOS)
    W, H = codigo.width + 24 + 520 + 44, codigo.height
    lienzo = Image.new('RGB', (W, H), FONDO)
    lienzo.paste(codigo, (0, 0))
    x, y = codigo.width + 24, (H - 292) // 2 - 20
    d = ImageDraw.Draw(lienzo)
    d.rectangle([x - 3, y - 3, x + 520 + 2, y + 292 + 2], outline=(36, 53, 45), width=3)
    lienzo.paste(cuadro, (x, y))
    d.text((x, y + 292 + 18), f'cuadro a {str(segundo).replace(".", ",")} s de la composición', font=fuente(21), fill=GRIS)
    destino = os.path.join(AQUI, f'04-hyperframes-intro-{fecha}.png')
    lienzo.save(destino)
    return destino


def captura_07(fecha, tmp):
    with open(os.path.join(REPO, TRANSCRIPT), encoding='utf-8') as fh:
        d = json.load(fh)
    ws = [(w['w'].strip(), w['s']) for s in d['segments'] for w in s['words']][:14]
    col = lambda xs: [f'{w:<13}{s:>5.2f}' for w, s in xs]
    lineas = [f'{a}    {b}' for a, b in zip(col(ws[:7]), col(ws[7:14]))]
    editor([{'nombre': '07', 'ruta': 'palabra  segundo', 'fuente': 32, 'arbol': lineas}], 1000, tmp)
    destino = os.path.join(AQUI, f'07-whisper-palabras-{fecha}.png')
    shutil.copy(os.path.join(tmp, '07.png'), destino)
    return destino


def foto_08():
    im = Image.open(os.path.join(REPO, FOTO)).convert('RGB')
    w, h = im.size  # 2048x1528: se corta el gris de arriba y de abajo, las dos bandejas y el sobre verde quedan enteros
    nuevo_h = round(w / 1.69)
    y0 = max(0, min(h - nuevo_h, 790 - nuevo_h // 2))
    destino = os.path.join(AQUI, '08-foto-fotobn-lote-s32-20261008.jpg')
    im.crop((0, y0, w, y0 + nuevo_h)).save(destino, quality=92)
    return destino


def marcador(nombre, tema):
    """Gris neutro, borde punteado, texto obvio. Sin color de marca ni rojo: no se puede confundir con una captura."""
    W, H = 1600, 900
    im = Image.new('RGB', (W, H), (231, 234, 232))
    d = ImageDraw.Draw(im)
    for x in range(-H, W, 56):  # rayado diagonal suave
        d.line([(x, H), (x + H, 0)], fill=(222, 226, 224), width=3)
    for x in range(40, W - 40, 36):  # borde punteado
        d.line([(x, 40), (x + 18, 40)], fill=(120, 130, 125), width=5)
        d.line([(x, H - 40), (x + 18, H - 40)], fill=(120, 130, 125), width=5)
    for y in range(40, H - 40, 36):
        d.line([(40, y), (40, y + 18)], fill=(120, 130, 125), width=5)
        d.line([(W - 40, y), (W - 40, y + 18)], fill=(120, 130, 125), width=5)
    f1, f2 = fuente(62), fuente(40)
    t1 = 'CAPTURA PENDIENTE · PC/Chrome'
    w1 = d.textlength(t1, font=f1)
    d.text(((W - w1) / 2, H / 2 - 80), t1, font=f1, fill=(48, 58, 53))
    w2 = d.textlength(tema, font=f2)
    d.text(((W - w2) / 2, H / 2 + 20), tema, font=f2, fill=(90, 102, 96))
    im.save(os.path.join(AQUI, nombre))


MARCADORES = [
    ('PENDIENTE-02-sesiones.png', '02 · lista de sesiones'),
    ('PENDIENTE-03-codex-tarea.png', '03 · terminal de codex-tarea.sh'),
    ('PENDIENTE-05-buffer-cola.png', '05 · cola de Buffer'),
    ('PENDIENTE-06-n8n-ejecuciones.png', '06 · lista de ejecuciones de n8n'),
    ('PENDIENTE-06B-n8n-inicio.png', '06 plan B · pantalla de inicio de n8n'),
]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--fecha', default='20261011')
    ap.add_argument('--segundo', type=float, default=1.2)
    ap.add_argument('--sin-marcadores', action='store_true', help='no rehacer los PENDIENTE-* (cuando ya hay capturas reales con ese nombre)')
    a = ap.parse_args()
    with tempfile.TemporaryDirectory() as tmp:
        print(captura_04(a.fecha, a.segundo, tmp))
        print(captura_07(a.fecha, tmp))
    print(foto_08())
    if not a.sin_marcadores:
        for n, t in MARCADORES:
            marcador(n, t)
            print(os.path.join(AQUI, n))


if __name__ == '__main__':
    main()
