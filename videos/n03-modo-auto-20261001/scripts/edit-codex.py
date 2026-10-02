"""N03 «modo auto» con la receta del reel de Codex del 14-sep — la edición que Sergio Urcullo reconoce como suya.

Receta: hermes-content/references/video-intake/2026-09-14-reel-astra-fable-codex/RECETA.md (edit.py de Codex).
- un mockup oscuro por bloque hablado, arriba (720 px), que entra de costado en 340 ms alternando;
- la cara a lo ancho abajo (crop 1080x1200);
- banda #111219 al 92 % con el subtítulo en frases cortas en mayúsculas;
- sin zooms, sin karaoke, sin SFX; voz con pasa-altos, compresor suave y −14 LUFS.
Lo distinto de Codex: el corte es el plan aprobado por Sergio Urcullo (14 tramos, micro-fundido de 12 ms en cada
uno), y el panel cambia en el corte cuando el cambio de idea cae ahí, si no en la palabra que abre la idea.

Uso:  N03_DIR=<carpeta con raw/bruto.mp4 y scripts/cutplan.json> python3 edit-codex.py
Necesita Pillow, ffmpeg con libass e Inter + JetBrains Mono instaladas (fc-match).
"""
from __future__ import annotations

import json
import os
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

D = Path(os.environ["N03_DIR"])
SOURCE = D / "raw" / "bruto.mp4"
BUILD = D / "codex-build"
OUTPUT = D / "final" / "sergio-n03-modo-auto-codex.mp4"
KEEP = [(k["start"], k["end"]) for k in json.loads((D / "scripts" / "cutplan.json").read_text())["keep"]]
DURS = [b - a for a, b in KEEP]
TOTAL = sum(DURS)
CROP_Y = 430  # cara y hombros: pelo ~620, mentón ~1380 en el bruto

W, H, TOP = 1080, 1920, 720
WHITE, MUTED, RULE = "#F4F1EA", "#AAA9B0", "#34363E"
BLUE, ORANGE, RED, GREEN = "#78A9F8", "#E6A47B", "#E26D5C", "#67BE86"
N = 9


def fc(pattern: str) -> str:
    return subprocess.run(["fc-match", "-f", "%{file}", pattern], capture_output=True, text=True, check=True).stdout


SANS, SANS_BOLD, MONO = fc("Inter:regular"), fc("Inter:bold"), fc("JetBrains Mono")


def font(size: int, bold: bool = False, mono: bool = False) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(MONO if mono else SANS_BOLD if bold else SANS, size)


def txt(d, xy, text, size, color=WHITE, bold=False, mono=False):
    d.text(xy, text, font=font(size, bold, mono), fill=color)


def rr(d, box, fill, radius=20, outline=None, width=1):
    d.rounded_rectangle(box, radius, fill=fill, outline=outline, width=width)


def pill(d, box, label, color):
    rr(d, box, "#20232C", 14, color, 2)
    txt(d, (box[0] + 18, box[1] + 10), label, 20, color, bold=True, mono=True)


def base(n, section, title):
    """La ventana de Codex: tres puntos, título mono en mayúsculas, contador y pie de sección."""
    im = Image.new("RGBA", (W, TOP), "#090A0F")
    d = ImageDraw.Draw(im)
    rr(d, (30, 30, 1050, 710), "#050609", 34)
    rr(d, (44, 18, 1036, 696), "#161820", 28, "#3A3D48", 2)
    d.line((44, 112, 1036, 112), fill="#353844", width=2)
    for x, color in ((78, RED), (108, "#E9B45E"), (138, GREEN)):
        d.ellipse((x - 8, 57, x + 8, 73), fill=color)
    txt(d, (178, 46), title.upper(), 23, WHITE, bold=True, mono=True)
    txt(d, (884, 46), f"{n:02d} / {N:02d}", 22, MUTED, mono=True)
    d.line((68, 646, 1012, 646), fill=RULE, width=2)
    txt(d, (68, 658), section.upper(), 18, MUTED, mono=True)
    return im, d


def cruz(d, cx, cy, r, color, w=5):
    """La ✕ no existe en Inter ni en JetBrains Mono (sale un rectángulo): se dibuja."""
    d.line((cx - r, cy - r, cx + r, cy + r), fill=color, width=w)
    d.line((cx - r, cy + r, cx + r, cy - r), fill=color, width=w)


def fila(d, y, marca, color, texto, sub=None, resalta=False):
    rr(d, (68, y, 1012, y + 92), "#20222B", 18, color if resalta else "#333641", 2)
    rr(d, (88, y + 20, 140, y + 72), "#161820", 12, color, 2)
    if marca == "✕":
        cruz(d, 114, y + 46, 11, color)
    else:
        txt(d, (102 if marca == "✓" else 108, y + 22), marca, 34, color, bold=True)
    txt(d, (166, y + 16 if sub else y + 26), texto, 33, WHITE, bold=True)
    if sub:
        txt(d, (166, y + 56), sub, 21, MUTED, mono=True)


def flecha(d, x0, x1, y, color=MUTED):
    d.line((x0, y, x1 - 14, y), fill=color, width=4)
    d.polygon([(x1, y), (x1 - 18, y - 11), (x1 - 18, y + 11)], fill=color)


def caja(d, box, linea1, linea2, color, fill="#20222B"):
    rr(d, box, fill, 22, color, 2)
    cx = (box[0] + box[2]) // 2
    for i, t in enumerate((linea1, linea2)):
        f = font(30 if i == 0 else 22, bold=i == 0, mono=i == 1)
        w = d.textlength(t, font=f)
        d.text((cx - w / 2, box[1] + (34 if i == 0 else 84)), t, font=f, fill=WHITE if i == 0 else color)


def card_1():
    im, d = base(1, "novedad · desde fines de septiembre", "claude code")
    txt(d, (68, 150), "YA NO TE PIDE", 70, WHITE, bold=True)
    txt(d, (68, 232), "PERMISO", 70, BLUE, bold=True)
    txt(d, (68, 330), "para casi nada", 34, MUTED)
    pill(d, (68, 420, 296, 466), "MODO AUTO", BLUE)
    pill(d, (316, 420, 620, 466), "TODOS LOS PLANES", MUTED)
    rr(d, (68, 506, 1012, 602), "#20222B", 18, "#333641", 2)
    txt(d, (96, 532), "arranca así por defecto", 30, WHITE, mono=True)
    return im


def card_2():
    im, d = base(2, "cómo funciona", "modo auto")
    txt(d, (68, 140), "OTRO MODELO REVISA", 50, WHITE, bold=True)
    txt(d, (68, 200), "EN VEZ DE VOS", 50, BLUE, bold=True)
    caja(d, (68, 300, 360, 430), "CLAUDE", "quiere hacer algo", MUTED)
    flecha(d, 372, 432, 365)
    caja(d, (444, 300, 736, 430), "CLASIFICADOR", "otro modelo", BLUE, "#1B2436")
    flecha(d, 748, 808, 365)
    rr(d, (820, 300, 1012, 360), "#1D2A22", 16, GREEN, 2)
    txt(d, (848, 312), "✓ PASA", 28, GREEN, bold=True)
    rr(d, (820, 370, 1012, 430), "#2E1F1E", 16, RED, 2)
    cruz(d, 858, 400, 9, RED, 4)
    txt(d, (880, 382), "FRENA", 28, RED, bold=True)
    txt(d, (68, 498), "leer y editar en tu carpeta:", 26, MUTED, mono=True)
    txt(d, (68, 538), "pasa solo, sin revisión", 26, WHITE, mono=True)
    return im


def card_3():
    im, d = base(3, "documentación oficial", "por defecto")
    txt(d, (68, 134), "BLOQUEA", 60, RED, bold=True)
    fila(d, 222, "✕", RED, "BAJAR Y EJECUTAR CÓDIGO", "de internet · curl | bash")
    fila(d, 326, "✕", RED, "DEPLOYS A PRODUCCIÓN")
    fila(d, 430, "✕", RED, "BORRAR LO QUE YA EXISTÍA")
    fila(d, 534, "✕", RED, "FORCE PUSH · RESET --HARD")
    return im


def card_4():
    im, d = base(4, "documentación oficial", "por defecto")
    txt(d, (68, 134), "DEJA PASAR", 60, GREEN, bold=True)
    fila(d, 222, "✓", GREEN, "EDITAR ARCHIVOS EN TU CARPETA")
    fila(d, 326, "✓", GREEN, "INSTALAR DEPENDENCIAS")
    fila(d, 430, "✓", GREEN, "PUSH A CUALQUIER RAMA")
    fila(d, 534, "!", ORANGE, "INCLUIDA LA PRINCIPAL", resalta=True)
    return im


def card_5():
    im, d = base(5, "por qué me importa", "mi caso")
    txt(d, (68, 140), "LA RAMA PRINCIPAL", 50, WHITE, bold=True)
    txt(d, (68, 200), "ALIMENTA EL DEPLOY", 50, ORANGE, bold=True)
    caja(d, (68, 300, 340, 430), "PUSH", "a la principal", ORANGE, "#33251F")
    flecha(d, 352, 412, 365)
    caja(d, (424, 300, 696, 430), "DEPLOY", "automático", MUTED)
    flecha(d, 708, 768, 365)
    caja(d, (780, 300, 1012, 430), "PRODUCCIÓN", "en vivo", MUTED)
    rr(d, (68, 474, 1012, 602), "#2E1F1E", 20, RED, 2)
    txt(d, (96, 494), "TRABAJO A MEDIAS", 34, WHITE, bold=True)
    txt(d, (96, 544), "= producción rota", 28, RED, mono=True)
    return im


def tecla(d, box, label):
    rr(d, (box[0], box[1] + 8, box[2], box[3] + 8), "#050609", 16)
    rr(d, box, "#262934", 16, "#4A4E5C", 2)
    f = font(44, bold=True, mono=True)
    w = d.textlength(label, font=f)
    d.text(((box[0] + box[2]) / 2 - w / 2, box[1] + 28), label, font=f, fill=WHITE)


def card_6():
    im, d = base(6, "en la sesión", "cómo revisarlo")
    txt(d, (68, 140), "ABAJO TE DICE", 50, WHITE, bold=True)
    txt(d, (68, 200), "EN QUÉ MODO ESTÁS", 50, BLUE, bold=True)
    tecla(d, (68, 316, 388, 436), "SHIFT")
    txt(d, (414, 336), "+", 60, MUTED, bold=True)
    tecla(d, (472, 316, 732, 436), "TAB")
    txt(d, (764, 352), "cambia", 32, MUTED, mono=True)
    txt(d, (764, 392), "el modo", 32, MUTED, mono=True)
    rr(d, (68, 494, 1012, 602), "#20222B", 18, "#333641", 2)
    txt(d, (96, 526), "> _", 34, MUTED, mono=True)
    return im


def card_7():
    im, d = base(7, "para que vuelva a preguntarte", "~/.claude/settings.json")
    rr(d, (68, 146, 1012, 602), "#0F1016", 22, "#333641", 2)
    lineas = [
        ("1", "{", WHITE, None),
        ("2", '  "permissions": {', WHITE, None),
        ("3", '    "defaultMode": "default"', BLUE, "#1B2436"),
        ("4", "  }", WHITE, None),
        ("5", "}", WHITE, None),
    ]
    for i, (num, code, color, hl) in enumerate(lineas):
        y = 186 + i * 78
        if hl:
            rr(d, (84, y - 14, 996, y + 58), hl, 12, "#4B6590", 2)
        txt(d, (104, y), num, 30, "#5A5E6B", mono=True)
        txt(d, (164, y), code, 34, color, mono=True)
    return im


def card_8():
    im, d = base(8, "cómo sabés que quedó", "próxima sesión")
    txt(d, (68, 140), "ABAJO VAS A VER", 50, WHITE, bold=True)
    rr(d, (68, 262, 1012, 442), "#0F1016", 22, GREEN, 3)
    f = font(58, bold=True, mono=True)
    t = "manual mode on"
    w = d.textlength(t, font=f) + 70  # + el ícono de pausa, dibujado (⏸ no está en la fuente)
    x0 = 540 - w / 2
    d.rounded_rectangle((x0, 330, x0 + 14, 388), 3, fill=GREEN)
    d.rounded_rectangle((x0 + 26, 330, x0 + 40, 388), 3, fill=GREEN)
    d.text((x0 + 70, 316), t, font=f, fill=GREEN)
    txt(d, (68, 500), "vuelve a preguntarte antes de actuar", 28, MUTED, mono=True)
    return im


def card_9():
    im, d = base(9, "el paso a paso, en la comunidad", "comunidad")
    txt(d, (68, 150), "COMENTÁ", 76, WHITE, bold=True)
    txt(d, (68, 240), "COMUNIDAD", 76, ORANGE, bold=True)
    rr(d, (68, 380, 1012, 602), "#20222B", 22, "#333641", 2)
    txt(d, (101, 416), "y te paso el link", 34, WHITE, bold=True)
    txt(d, (101, 470), "de mi comunidad de WhatsApp", 34, WHITE, bold=True)
    txt(d, (101, 536), "con el bloque para copiar…", 25, MUTED, mono=True)
    return im


CARDS = (card_1, card_2, card_3, card_4, card_5, card_6, card_7, card_8, card_9)
# Cambio de panel, en tiempo de SALIDA. Cortes del plan: 7.91 11.33 … 49.52 53.22.
# 21.60 «Pero, por defecto, deja pasar» · 30.30 «Por ejemplo, en mi caso» · 43.40 «Y si querés que vuelva a
# preguntarte»: el cambio de idea cae en medio de un tramo, y manda la idea.
SWITCH = [0.0, 7.91, 11.33, 21.60, 30.30, 37.77, 43.40, 49.52, 53.22]

# Frases cortas en mayúsculas, revisadas contra la transcripción corregida (segments-cut.json, tiempo de salida).
CAPTIONS = [
    (0.08, 0.84, "¿TE HAS DADO CUENTA?"),
    (0.86, 2.00, "TU CLAUDE CODE"),
    (2.02, 3.20, "YA NO TE PIDE PERMISO"),
    (3.26, 4.30, "PARA CASI NADA"),
    (4.46, 5.70, "DESDE FINES DE SEPTIEMBRE"),
    (5.70, 6.70, "ARRANCA EN MODO AUTO"),
    (6.80, 7.90, "EN TODOS LOS PLANES"),
    (8.15, 9.05, "EN MODO AUTOMÁTICO"),
    (9.13, 10.05, "UN SEGUNDO MODELO"),
    (10.05, 11.30, "REVISA EN VEZ DE VOS"),
    (11.52, 12.50, "SEGÚN LA DOCUMENTACIÓN"),
    (12.52, 13.95, "POR DEFECTO, BLOQUEA"),
    (14.02, 15.60, "BAJAR Y EJECUTAR CÓDIGO"),
    (15.66, 16.90, "DEPLOYS A PRODUCCIÓN"),
    (16.96, 17.70, "FORCE PUSH"),
    (17.76, 19.05, "BORRAR LO QUE YA EXISTÍA"),
    (19.08, 20.34, "COMANDOS DE GIT"),
    (20.36, 21.50, "CON CAMBIOS SIN GUARDAR"),
    (21.66, 22.80, "PERO DEJA PASAR"),
    (22.84, 24.65, "EDITAR TU CARPETA"),
    (24.71, 25.55, "INSTALAR DEPENDENCIAS"),
    (25.59, 26.70, "Y HACER PUSH"),
    (26.71, 27.85, "A CUALQUIER RAMA"),
    (27.91, 30.20, "INCLUIDA LA PRINCIPAL"),
    (30.38, 31.50, "EN MI CASO"),
    (31.54, 32.60, "ESO IMPORTA"),
    (32.72, 33.90, "LA RAMA PRINCIPAL"),
    (33.95, 34.55, "ALIMENTA EL DEPLOY"),
    (34.59, 35.85, "UN PUSH A MEDIAS"),
    (35.88, 37.70, "ROMPE MI PRODUCCIÓN"),
    (37.95, 38.95, "¿CÓMO LO REVISÁS?"),
    (38.99, 40.35, "ABAJO TE LO MUESTRA"),
    (40.42, 41.55, "CON SHIFT+TAB"),
    (41.55, 43.30, "LO CAMBIÁS DE MODO"),
    (43.42, 44.50, "¿QUERÉS QUE VUELVA"),
    (44.50, 45.00, "A PREGUNTARTE?"),
    (45.05, 46.75, "EN TU SETTINGS"),
    (46.80, 47.50, "DE .CLAUDE"),
    (47.55, 49.45, "DEFAULTMODE EN DEFAULT"),
    (49.56, 50.60, "LA PRÓXIMA SESIÓN"),
    (50.66, 51.90, "TE MUESTRA"),
    (51.95, 53.15, "MANUAL MODE ON"),
    (53.28, 55.05, "¿QUERÉS EL PASO A PASO?"),
    (55.12, 57.70, "COMENTÁ COMUNIDAD"),
]


def ass_time(t):
    cs = max(0, round(t * 100))
    h, cs = divmod(cs, 360000)
    m, cs = divmod(cs, 6000)
    s, cs = divmod(cs, 100)
    return f"{h}:{m:02d}:{s:02d}.{cs:02d}"


def write_ass():
    header = """[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Main,Inter,54,&H00EAF1F4,&H00EAF1F4,&H00191211,&H00191211,-1,0,0,0,100,100,0,0,1,2,0,5,65,65,0,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    # sin solapes: cada frase termina donde empieza la siguiente; y entra en la banda (950 px a 54 px)
    caps = sorted(CAPTIONS)
    f = font(54, bold=True)
    for s, e, words in caps:
        assert ImageDraw.Draw(Image.new("L", (1, 1))).textlength(words, font=f) <= 950, f"no entra: {words}"
    lines = []
    for i, (s, e, words) in enumerate(caps):
        if i + 1 < len(caps):
            e = min(e, caps[i + 1][0] - 0.02)
        if e - s < 0.4:
            e = s + 0.4
        lines.append(f"Dialogue: 0,{ass_time(s)},{ass_time(e)},Main,,0,0,0,,{{\\an5\\pos(540,775)}}{words}")
    (BUILD / "captions.ass").write_text(header + "\n".join(lines) + "\n", encoding="utf-8")


def render():
    BUILD.mkdir(parents=True, exist_ok=True)
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    for i, factory in enumerate(CARDS, 1):
        factory().save(BUILD / f"card-{i:02d}.png")
    write_ass()
    n = len(KEEP)
    g = [f"[0:v]split={n}" + "".join(f"[v{i}]" for i in range(n)),
         f"[0:a]asplit={n}" + "".join(f"[a{i}]" for i in range(n))]
    for i, (a, b) in enumerate(KEEP):
        g.append(f"[v{i}]trim=start={a}:end={b},setpts=PTS-STARTPTS[vc{i}]")
        g.append(f"[a{i}]atrim=start={a}:end={b},asetpts=PTS-STARTPTS,"
                 f"afade=t=in:d=0.012,afade=t=out:st={b - a - 0.012:.3f}:d=0.012[ac{i}]")
    g.append("".join(f"[vc{i}]" for i in range(n)) + f"concat=n={n}:v=1:a=0[vcat]")
    g.append("".join(f"[ac{i}]" for i in range(n)) + f"concat=n={n}:v=0:a=1[acat]")
    g.append(f"[vcat]crop=1080:1200:0:{CROP_Y},pad=1080:1920:0:720:color=0x111219,"
             "drawbox=x=0:y=720:w=1080:h=110:color=0x111219@0.92:t=fill,setsar=1[base]")
    g.append("[acat]highpass=f=80,acompressor=threshold=0.11:ratio=2:attack=15:release=120,"
             "loudnorm=I=-14:TP=-1.5:LRA=11[aout]")
    prev, tr = "base", 0.34
    ends = SWITCH[1:] + [TOTAL]
    for i, (cur, end) in enumerate(zip(SWITCH, ends), 1):
        tail = end + tr if i < len(SWITCH) else end
        if i == 1:
            x = "0"
        elif i % 2 == 0:
            x = f"if(lt(t,{cur + tr:.3f}),main_w*(1-(t-{cur:.3f})/{tr:.3f}),0)"
        else:
            x = f"if(lt(t,{cur + tr:.3f}),-overlay_w*(1-(t-{cur:.3f})/{tr:.3f}),0)"
        g.append(f"[{prev}][{i}:v]overlay=x='{x}':y=0:enable='between(t,{cur:.3f},{tail - 0.001:.3f})'"
                 f":eof_action=repeat[vcard{i}]")
        prev = f"vcard{i}"
    fonts = os.path.dirname(SANS_BOLD)
    g.append(f"[{prev}]ass=captions.ass:fontsdir={fonts},format=yuv420p[vout]")
    (BUILD / "filtergraph.txt").write_text(";\n".join(g), encoding="utf-8")
    args = ["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(SOURCE)]
    for i in range(1, len(CARDS) + 1):
        args += ["-framerate", "30", "-loop", "1", "-i", f"card-{i:02d}.png"]
    args += ["-filter_complex_script", "filtergraph.txt", "-map", "[vout]", "-map", "[aout]",
             "-r", "30", "-c:v", "libx264", "-preset", "slow", "-crf", "17",
             "-c:a", "aac", "-b:a", "192k", "-ar", "48000",
             "-movflags", "+faststart", "-t", f"{TOTAL:.3f}", str(OUTPUT)]
    subprocess.run(args, cwd=BUILD, check=True)
    print(OUTPUT, f"duration={TOTAL:.3f}s")


if __name__ == "__main__":
    import sys
    if "--cards" in sys.argv:  # sólo los paneles, para mirarlos antes del render
        BUILD.mkdir(parents=True, exist_ok=True)
        for i, factory in enumerate(CARDS, 1):
            factory().save(BUILD / f"card-{i:02d}.png")
        print(BUILD)
    else:
        render()
