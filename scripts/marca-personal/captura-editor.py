#!/usr/bin/env python3
"""Captura de editor con TEXTO REAL del repo (para láminas `captura` de los carruseles).

Lee las líneas de un archivo del repo (desde..hasta), las pinta en un panel oscuro con número de línea y las pasa a PNG
con el Chrome headless. Como las líneas se leen del archivo, la captura no puede parafrasear: si el archivo cambia, se
vuelve a correr y sale lo nuevo.

Uso:
  python3 scripts/marca-personal/captura-editor.py --spec specs.json --out carpeta/

specs.json = lista de capturas:
  {"nombre": "02-claude-md",
   "ruta": "CLAUDE.md",                      # etiqueta de la pestaña (por defecto, el archivo)
   "migas": "Objetivo por sesión (REGLA)",   # opcional, gris, a la derecha de la ruta
   "bloques": [ {"archivo": "CLAUDE.md", "desde": 43, "hasta": 45, "resaltar": ["Un objetivo al inicio"]},
                {"archivo": "...", "desde": 85, "hasta": 86} ],   # varios bloques = «⋯» plegado entre ellos
   "esquema": ["META", "PRUEBA DE HECHO"],   # opcional: títulos que se leen del archivo y se muestran arriba
   "arbol": ["linea con {verde}marca{/}", ...]}   # alternativa a «bloques»: árbol; cada ruta se verifica que exista
Un bloque admite "cortar": "frase." → su última línea se corta justo después de esa frase (útil si la línea sigue en la de abajo).
Tamaño: --ancho 1200 --alto 820 (más ancha que alta, como pide el layout `captura`). Fuente: la de la marca, mono.
No se renderiza nada con rojo. Probado el 9-oct-2026 (carrusel «Los 5 archivos»).
"""
import argparse, glob, html, json, os, re, subprocess, sys

REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
FUENTES = [os.path.join(REPO, '.claude/skills/edicion-referentes/scripts/erik/assets-ejemplo/fuentes/JetBrainsMono-Bold.ttf')]


def chrome():
    c = [os.environ.get('CHROME_BIN'), os.environ.get('CAROUSEL_BROWSER')] + sorted(glob.glob('/opt/pw-browsers/chromium*/chrome-linux/chrome')) + [
        'C:/Program Files/Google/Chrome/Application/chrome.exe']
    for p in c:
        if p and os.path.isfile(p):
            return p
    sys.exit('no encontré Chrome/Chromium (seteá CHROME_BIN)')


def resaltar(txt, frases):
    """Escapa y marca (fondo verde) cada frase que aparezca en el texto."""
    out = html.escape(txt)
    for f in frases or []:
        e = html.escape(f)
        if e in out:
            out = out.replace(e, f'<mark>{e}</mark>', 1)
    return out


def bloque_html(b):
    ruta = os.path.join(REPO, b['archivo'])
    with open(ruta, encoding='utf-8') as fh:
        todas = fh.read().split('\n')
    filas = []
    for n in range(b['desde'], b['hasta'] + 1):
        linea = todas[n - 1]
        if n == b['hasta'] and b.get('cortar'):  # la última línea puede seguir en la siguiente: se corta donde cierra una frase
            i = linea.find(b['cortar'])
            if i < 0:
                sys.exit(f'«{b["cortar"]}» no está en la línea {n} de {b["archivo"]}')
            linea = linea[:i + len(b['cortar'])]
        filas.append(f'<div class="l"><span class="n">{n}</span><span class="t">{resaltar(linea, b.get("resaltar"))}</span></div>')
    return ''.join(filas)


def esquema_html(spec):
    """Títulos «## X» que existen de verdad en el archivo, como el panel de esquema del editor."""
    if not spec.get('esquema'):
        return ''
    arch = spec['bloques'][0]['archivo']
    with open(os.path.join(REPO, arch), encoding='utf-8') as fh:
        cuerpo = fh.read()
    chips = []
    for t in spec['esquema']:
        if not re.search(r'^## ' + re.escape(t) + r'\s*$', cuerpo, re.M):
            sys.exit(f'el título «{t}» no existe en {arch}')
        chips.append(f'<span class="chip">{html.escape(t)}</span>')
    return f'<div class="esq">{"".join(chips)}</div>'


def arbol_html(lineas):
    out = []
    for ln in lineas:
        for m in re.finditer(r'\{ruta:([^}]+)\}', ln):  # {ruta:...} verifica que la ruta exista
            if not os.path.exists(os.path.join(REPO, m.group(1))):
                sys.exit(f'la ruta no existe: {m.group(1)}')
        txt = re.sub(r'\{ruta:([^}]+)\}', '', ln)
        txt = re.sub(r'\{n:([^}]+)\}', lambda m: str(len([x for x in os.listdir(os.path.join(REPO, m.group(1))) if not x.startswith('.')])), txt)
        e = html.escape(txt)
        e = re.sub(r'\{verde\}(.*?)\{/\}', r'<b class="v">\1</b>', e)
        e = re.sub(r'\{gris\}(.*?)\{/\}', r'<span class="g">\1</span>', e)
        out.append(f'<div class="l"><span class="t">{e}</span></div>')
    return ''.join(out)


def pagina(spec, ancho, alto):
    css = ''
    if os.path.isfile(FUENTES[0]):
        css += "@font-face{font-family:JB;src:url(file://%s)}" % FUENTES[0]
    css += f"""
html,body{{margin:0;width:{ancho}px;{'height:'+str(alto)+'px;' if alto else ''}background:#0B100E;overflow:hidden}}
.p{{box-sizing:border-box;width:{ancho}px;{'height:'+str(alto)+'px;' if alto else ''}padding:34px 44px;font:700 {spec.get('fuente', 36)}px/1.5 JB,'DejaVu Sans Mono',monospace;color:#E8EFEB}}
.tab{{display:flex;gap:18px;align-items:center;margin-bottom:26px;font-size:26px;color:#8FA197}}
.tab .r{{color:#10C26B}} .tab .m{{color:#6C7C73}}
.esq{{display:flex;gap:12px;margin:-6px 0 22px}} .chip{{font-size:22px;padding:6px 16px;border:2px solid #24352D;border-radius:999px;color:#9FB2A8}}
.l{{display:flex;gap:26px}} .n{{flex:none;width:70px;text-align:right;color:#51635A}} .t{{flex:1;min-width:0;white-space:pre-wrap;overflow-wrap:anywhere;text-wrap:pretty;padding-left:2ch;text-indent:-2ch}}
.l:has(mark){{background:#10C26B14;margin:0 -44px;padding:0 44px;border-left:6px solid #10C26B}}
mark{{background:#10C26B;color:#0B100E;padding:0 6px;border-radius:6px}}
.plg{{color:#51635A;margin:6px 0 6px 96px}} b.v{{color:#10C26B}} .g{{color:#6C7C73}}
"""
    if spec.get('arbol'):
        cuerpo = arbol_html(spec['arbol'])
    else:
        partes = [bloque_html(b) for b in spec['bloques']]
        cuerpo = '<div class="plg">⋯</div>'.join(partes)
    tab = f'<div class="tab"><span class="r">{html.escape(spec.get("ruta") or spec["bloques"][0]["archivo"])}</span>' \
          + (f'<span class="m">› {html.escape(spec["migas"])}</span>' if spec.get('migas') else '') + '</div>'
    return f"<!doctype html><meta charset='utf-8'><style>{css}</style><div class='p'>{tab}{esquema_html(spec) if spec.get('bloques') else ''}{cuerpo}</div>"


def medir(ch, h, ancho):
    """Alto real del contenido (px): una pasada --dump-dom con un script que lo escribe en el DOM."""
    with open(h, encoding='utf-8') as fh:
        base = fh.read()
    med = base + "<script>addEventListener('load',()=>{document.body.setAttribute('data-h',String(Math.ceil(document.querySelector('.p').getBoundingClientRect().height)))})</script>"
    tmp = h + '.medir.html'
    with open(tmp, 'w', encoding='utf-8') as fh:
        fh.write(med)
    r = subprocess.run([ch, '--headless=new', '--no-sandbox', '--disable-gpu', f'--window-size={ancho},3000', '--virtual-time-budget=3000',
                        '--dump-dom', 'file://' + tmp], capture_output=True, text=True)
    os.remove(tmp)
    m = re.search(r'data-h="(\d+)"', r.stdout)
    return int(m.group(1)) if m else None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--spec', required=True)
    ap.add_argument('--out', required=True)
    ap.add_argument('--ancho', type=int, default=1000)
    ap.add_argument('--alto', type=int, default=820)
    a = ap.parse_args()
    a.out = os.path.abspath(a.out)  # file:// necesita ruta absoluta; con una relativa Chrome da ERR_INVALID_URL (visto el 9-oct)
    os.makedirs(a.out, exist_ok=True)
    with open(a.spec, encoding='utf-8') as fh:
        specs = json.load(fh)
    ch = chrome()
    for s in specs:
        h = os.path.join(a.out, s['nombre'] + '.html')
        with open(h, 'w', encoding='utf-8') as fh:
            fh.write(pagina(s, a.ancho, None))
        alto = (medir(ch, h, a.ancho) or a.alto) + 34  # el contenido + el mismo margen de abajo que de arriba
        with open(h, 'w', encoding='utf-8') as fh:
            fh.write(pagina(s, a.ancho, alto))
        crudo = os.path.join(a.out, s['nombre'] + '-crudo.png')
        # Chrome headless resta ~90 px de la ventana al capturar: se renderiza más alto y se corta (medido el 8-oct).
        subprocess.run([ch, '--headless=new', '--no-sandbox', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
                        f'--window-size={a.ancho},{alto + 140}', '--virtual-time-budget=3000', f'--screenshot={crudo}',
                        'file://' + h], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', crudo, '-vf', f'crop={a.ancho}:{alto}:0:0', os.path.join(a.out, s['nombre'] + '.png')], check=True)
        os.remove(crudo)
        os.remove(h)
        print('capturada', s['nombre'])


if __name__ == '__main__':
    main()
