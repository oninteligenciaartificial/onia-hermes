"""Modelo de avances tipográficos sin navegador. No sustituye medir-dom."""
import json
import re
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

root = Path(__file__).resolve().parent.parent
html = (root / 'index.html').read_text(encoding='utf-8')
fonts = {}
for family, name, weight in [('DM', 'DMSans', 500), ('BG', 'BricolageGrotesque', 700)]:
    font = TTFont(root / 'assets/fonts' / (name + '-var-latin.woff2'))
    font = instantiateVariableFont(font, {'wght': weight}, inplace=True)
    fonts[family] = font.getBestCmap(), font['hmtx'].metrics, font['head'].unitsPerEm

def width(text, family, size):
    cmap, metrics, em = fonts[family]
    return sum(metrics[cmap.get(ord(c), '.notdef')][0] for c in text) / em * size

lines = ['MODELO de avances de glifos locales; NO es DOM ni shaping del navegador. Interior866px; kerning omitido.']
for element, classes, y, size, text in re.findall(r'<div id="([^"]+)" class="texto ([^"]*)" style="top:(\d+)px;font-size:(\d+)px">([^<]*)</div>', html):
    family = 'BG' if 'titular' in classes else 'DM'
    line_height = 1.12 if family == 'BG' else 1.1
    wrapped = ['']
    for word in text.split():
        new = (wrapped[-1] + ' ' + word).strip()
        if width(new, family, int(size)) > 866 and wrapped[-1]:
            wrapped.append(word)
        else:
            wrapped[-1] = new
    bottom = int(y) + 24 + len(wrapped) * int(size) * line_height
    lines.append(f'{element}: {len(wrapped)} líneas previstas; y={y}, inferior previsto={bottom:.2f}px; {wrapped}')
    if bottom > 1490:
        raise ValueError(f'{element}: modelo fuera de y1490: {bottom}')
lines.append('EXIT 0 (modelo; DOM PENDIENTE por la madre)')
(root / 'qa/tipografia-estimada.txt').write_text('\n'.join(lines) + '\n', encoding='utf-8')
print('\n'.join(lines))
