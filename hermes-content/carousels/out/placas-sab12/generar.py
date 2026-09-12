# -*- coding: utf-8 -*-
"""Placas 1080x1920 para overlays de video — patrón apple-editorial simplificado."""
import os

AQUI = os.path.dirname(os.path.abspath(__file__))
FONTS = os.path.abspath(os.path.join(AQUI, '../../../references/ui-patterns/apple-editorial/fonts')).replace(os.sep, '/')

placas = [
    ("1-bolivia-dolar", "EL PROBLEMA · EL DÓLAR", "$7 <span class='v'>→</span> $11", "mi gasto fijo en dólares: UNA sola suscripción"),
    ("2-skills", "CLAUDE CODE · SKILLS", "Se lo enseñás<br><span class='v'>una vez.</span>", "una skill = tu forma de trabajar, escrita en un archivo"),
    ("3-claude-vs-claudecode", "LA DIFERENCIA", "Claude te explica.<br><span class='v'>Claude Code lo hace.</span>", "misma suscripción · dos herramientas"),
    ("4-broll-cierre", "DETRÁS DE ESCENA", "6 videos.<br><span class='v'>Una tarde.</span>", "las guías completas: sergiourcullo.vercel.app"),
    ("5-loops", "MIS LOOPS", "cada noche, 3:00<br><span class='v'>→ respaldar todo</span>", "un loop: una tarea por horario, escrita una vez"),
    ("6-veces-minutos", "LA CUENTA", "veces <span class='v'>×</span> minutos", "eso es lo que estás pagando con tu vida"),
    ("7-cierro", "LA SEXTA RESPUESTA", "<span class='v'>/cierro</span>", "la respuesta que pide la decisión — casi nadie la tiene"),
    ("8-cta-comunidad", "GRATIS · LINK EN EL PERFIL", "Onia<br><span class='v'>Community</span>", "cada día un recurso real, listo para copiar"),
]

TPL = """<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{{font-family:'Inter';src:url('file:///{fonts}/Inter-var-latin.woff2') format('woff2');font-weight:100 900}}
*{{margin:0;box-sizing:border-box}}
body{{width:1080px;height:1920px;background:#FBFBFC;font-family:Inter,Arial,sans-serif;color:#14161A;
display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:90px}}
.eyebrow{{font-size:30px;font-weight:600;letter-spacing:.22em;color:#007A44;margin-bottom:70px}}
h1{{font-size:126px;font-weight:800;line-height:1.06;letter-spacing:-.03em;max-width:900px}}
h1 .v{{color:#007A44}}
.baja{{margin-top:70px;font-size:40px;font-weight:500;color:#5B6470;max-width:820px;line-height:1.4}}
.firma{{position:fixed;bottom:80px;left:0;right:0;font-size:30px;font-weight:600;letter-spacing:.06em;color:#8A93A0}}
</style></head><body>
<div class="eyebrow">{eyebrow}</div><h1>{titulo}</h1><p class="baja">{baja}</p>
<div class="firma">@sergiourcullo</div></body></html>"""

for slug, eyebrow, titulo, baja in placas:
    p = os.path.join(AQUI, slug + '.html')
    with open(p, 'w', encoding='utf-8') as f:
        f.write(TPL.format(fonts=FONTS, eyebrow=eyebrow, titulo=titulo, baja=baja))
print('html ok:', len(placas))
