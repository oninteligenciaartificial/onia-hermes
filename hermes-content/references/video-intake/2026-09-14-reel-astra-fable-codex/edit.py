"""Render a vertical social edit from Sergio's Astra/Fable talking-head clip.

The source stays untouched. Run: python videos/astra-fable-social/edit.py
"""

from __future__ import annotations

import subprocess
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parent
BUILD = ROOT / "build"
SOURCE = Path(r"C:\Users\PC\Downloads\video fable 5.1 vs gpt 6 astra.MP4")
OUTPUT = Path(r"C:\Users\PC\Downloads\video fable 5.1 vs gpt 6 astra - reel editado.mp4")
SEGOE = Path(r"C:\Windows\Fonts\segoeui.ttf")
SEGOE_BOLD = Path(r"C:\Windows\Fonts\segoeuib.ttf")
MONO = Path(r"C:\Windows\Fonts\consola.ttf")

W, H, TOP = 1080, 1920, 720
BG = "#111219"
WHITE = "#F4F1EA"
MUTED = "#AAA9B0"
BLUE = "#78A9F8"
ORANGE = "#E6A47B"
RULE = "#34363E"

# Preserve spoken content while tightening the conspicuous pauses.
SEGMENTS = [
    (0.17, 2.99),
    (4.07, 12.26),
    (12.62, 16.43),
    (17.02, 26.58),
    (26.93, 31.99),
    (32.60, 35.17),
]
DURATIONS = [b - a for a, b in SEGMENTS]
TOTAL = sum(DURATIONS)


def font(size: int, bold: bool = False, mono: bool = False) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(MONO if mono else SEGOE_BOLD if bold else SEGOE), size)


def txt(draw: ImageDraw.ImageDraw, xy: tuple[int, int], text: str, size: int, color: str = WHITE, bold: bool = False, mono: bool = False) -> None:
    draw.text(xy, text, font=font(size, bold, mono), fill=color)


def rr(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], fill: str, radius: int = 20, outline: str | None = None, width: int = 1) -> None:
    draw.rounded_rectangle(box, radius, fill=fill, outline=outline, width=width)


def pill(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], label: str, color: str) -> None:
    rr(draw, box, "#20232C", 14, color, 2)
    txt(draw, (box[0] + 18, box[1] + 10), label, 20, color, bold=True, mono=True)


def base(n: int, section: str, title: str) -> tuple[Image.Image, ImageDraw.ImageDraw]:
    im = Image.new("RGBA", (W, TOP), "#090A0F")
    d = ImageDraw.Draw(im)
    # A large software-window mockup, inspired by the reference reel without
    # copying its branding. The layered border also reads as a soft shadow.
    rr(d, (30, 30, 1050, 710), "#050609", 34)
    rr(d, (44, 18, 1036, 696), "#161820", 28, "#3A3D48", 2)
    d.line((44, 112, 1036, 112), fill="#353844", width=2)
    for x, color in ((78, "#E26D5C"), (108, "#E9B45E"), (138, "#67BE86")):
        d.ellipse((x - 8, 57, x + 8, 73), fill=color)
    txt(d, (178, 46), title.upper(), 23, WHITE, bold=True, mono=True)
    txt(d, (884, 46), f"{n:02d} / 06", 22, MUTED, mono=True)
    d.line((68, 646, 1012, 646), fill=RULE, width=2)
    txt(d, (68, 658), section.upper(), 18, MUTED, mono=True)
    return im, d


def card_1() -> Image.Image:
    im, d = base(1, "comparativa", "model arena")
    txt(d, (68, 147), "DOS MODELOS.", 67, WHITE, bold=True)
    txt(d, (68, 222), "DOS FORTALEZAS.", 58, WHITE, bold=True)
    rr(d, (68, 344, 493, 582), "#1B2436", 24, "#4B6590", 2)
    rr(d, (587, 344, 1012, 582), "#33251F", 24, "#865C45", 2)
    pill(d, (91, 366, 243, 410), "MODELO A", BLUE)
    pill(d, (610, 366, 762, 410), "MODELO B", ORANGE)
    txt(d, (92, 435), "GPT-6", 61, BLUE, bold=True)
    txt(d, (92, 508), "ASTRA", 33, WHITE, bold=True)
    txt(d, (611, 435), "FABLE", 61, ORANGE, bold=True)
    txt(d, (611, 508), "5.1", 33, WHITE, bold=True)
    txt(d, (514, 438), "VS", 34, MUTED, bold=True, mono=True)
    return im


def metric_row(d: ImageDraw.ImageDraw, y: int, name: str, a: float, f: float) -> None:
    rr(d, (68, y, 1012, y + 150), "#20222B", 20, "#333641", 2)
    txt(d, (92, y + 19), name, 25, WHITE, bold=True, mono=True)
    bx0, bx1 = 92, 780
    for dy, val, color, label in ((63, a, BLUE, "ASTRA"), (105, f, ORANGE, "FABLE")):
        txt(d, (92, y + dy - 4), label, 17, color, bold=True, mono=True)
        rr(d, (190, y + dy, bx1, y + dy + 18), "#30333D", 8)
        rr(d, (190, y + dy, 190 + int((bx1 - 190) * val / 70), y + dy + 18), color, 8)
        txt(d, (820, y + dy - 11), f"{val:.1f}%", 29, WHITE, bold=True)


def card_2() -> Image.Image:
    im, d = base(2, "resultados publicados", "benchmark dashboard")
    txt(d, (68, 137), "ASTRA LIDERA EN", 48, WHITE, bold=True)
    txt(d, (68, 195), "TRABAJO TÉCNICO", 48, BLUE, bold=True)
    pill(d, (789, 158, 991, 204), "DATA VIEW", BLUE)
    metric_row(d, 274, "AUTOMATIONBENCH", 41.4, 31.4)
    metric_row(d, 446, "TERMINAL-BENCH 4.0", 57.9, 55.8)
    return im


def card_3() -> Image.Image:
    im, d = base(3, "razonamiento", "reasoning report")
    txt(d, (68, 139), "FABLE TOMA", 52, WHITE, bold=True)
    txt(d, (68, 201), "LA DELANTERA", 52, ORANGE, bold=True)
    pill(d, (730, 164, 990, 210), "HLE SCORE", ORANGE)
    rr(d, (68, 294, 1012, 589), "#201F25", 24, "#3D3940", 2)
    txt(d, (96, 319), "HUMANITY'S LAST EXAM", 24, MUTED, bold=True, mono=True)
    txt(d, (96, 397), "65.0%", 83, ORANGE, bold=True)
    txt(d, (405, 420), "FABLE 5.1", 31, WHITE, bold=True)
    d.line((96, 506, 984, 506), fill="#393740", width=2)
    txt(d, (96, 531), "ASTRA", 22, BLUE, bold=True, mono=True)
    txt(d, (250, 524), "57.2%", 34, WHITE, bold=True)
    txt(d, (442, 534), "CON HERRAMIENTAS", 19, MUTED, mono=True)
    return im


def card_4() -> Image.Image:
    im, d = base(4, "experiencia del presentador", "backend workspace")
    txt(d, (68, 137), "ASTRA", 63, BLUE, bold=True)
    txt(d, (68, 210), "PARA BACKEND", 47, WHITE, bold=True)
    pill(d, (792, 163, 990, 209), "EDITOR", BLUE)
    rr(d, (68, 296, 1012, 607), "#11141B", 20, "#465167", 2)
    # IDE file tree.
    d.rectangle((69, 337, 282, 606), fill="#181C25")
    txt(d, (91, 311), "PROJECT / API", 18, MUTED, bold=True, mono=True)
    for idx, label in enumerate(("▾ src", "  routes", "  services", "  index.ts")):
        txt(d, (91, 367 + idx * 47), label, 19, WHITE if idx in (0, 3) else MUTED, mono=True)
    # Editor code lines and a terminal strip.
    code = [
        ("01", "async function runAgent() {", BLUE),
        ("02", "  const result = await tools.call();", WHITE),
        ("03", "  return validate(result);", ORANGE),
        ("04", "}", BLUE),
    ]
    for idx, (num, line, color) in enumerate(code):
        y = 358 + idx * 43
        txt(d, (310, y), num, 17, "#676B76", mono=True)
        txt(d, (355, y), line, 20, color, mono=True)
    d.rectangle((283, 548, 1011, 606), fill="#1D2230")
    txt(d, (310, 566), "> STATUS   BUILD OK   •   LOGIC VERIFIED", 18, "#79CF9A", bold=True, mono=True)
    return im


def card_5() -> Image.Image:
    im, d = base(5, "experiencia del presentador", "capability board")
    txt(d, (68, 137), "FABLE SIGUE", 49, WHITE, bold=True)
    txt(d, (68, 196), "COMPITIENDO", 49, ORANGE, bold=True)
    pill(d, (762, 162, 990, 208), "STRENGTHS", ORANGE)
    rr(d, (68, 296, 523, 598), "#2B211D", 22, "#76523F", 2)
    rr(d, (557, 296, 1012, 598), "#2B211D", 22, "#76523F", 2)
    txt(d, (96, 324), "FRONTEND", 31, WHITE, bold=True)
    txt(d, (585, 324), "CIBERSEGURIDAD", 27, WHITE, bold=True)
    # Browser/UI wireframe.
    rr(d, (96, 395, 495, 558), "#151820", 14, "#8B614A", 2)
    d.line((96, 431, 495, 431), fill="#8B614A", width=2)
    for x in (117, 139, 161):
        d.ellipse((x, 410, x + 10, 420), fill=ORANGE)
    rr(d, (120, 458, 258, 531), "#3A2B24", 10)
    for y in (462, 486, 510):
        rr(d, (282, y, 466, y + 12), "#4C3830", 6)
    # Minimal shield mockup.
    d.polygon(((784, 398), (884, 431), (872, 518), (784, 560), (696, 518), (684, 431)), fill="#3B2B25", outline=ORANGE)
    d.line((735, 475, 770, 510), fill=ORANGE, width=10)
    d.line((770, 510, 837, 445), fill=ORANGE, width=10)
    return im


def card_6() -> Image.Image:
    im, d = base(6, "tu turno", "community prompt")
    txt(d, (68, 149), "¿CON CUÁL", 75, WHITE, bold=True)
    txt(d, (68, 235), "TE QUEDAS?", 75, WHITE, bold=True)
    rr(d, (68, 372, 500, 475), "#1B2436", 20, "#4B6590", 2)
    rr(d, (580, 372, 1012, 475), "#33251F", 20, "#865C45", 2)
    txt(d, (157, 393), "ASTRA", 47, BLUE, bold=True)
    txt(d, (687, 393), "FABLE", 47, ORANGE, bold=True)
    rr(d, (68, 514, 1012, 594), "#20222A", 18, "#424550", 2)
    txt(d, (101, 536), "ESCRIBE TU ELECCIÓN EN LOS COMENTARIOS…", 25, MUTED, mono=True)
    return im


def output_time(t: float) -> float:
    elapsed = 0.0
    for a, b in SEGMENTS:
        if t < a:
            return elapsed
        if t <= b:
            return elapsed + t - a
        elapsed += b - a
    return TOTAL


def ass_time(t: float) -> str:
    cs = max(0, round(t * 100))
    h, cs = divmod(cs, 360000)
    m, cs = divmod(cs, 6000)
    s, cs = divmod(cs, 100)
    return f"{h}:{m:02d}:{s:02d}.{cs:02d}"


# Short phrase captions, proofread from the local Spanish ASR transcript.
CAPTIONS = [
    (0.20, 2.94, "FABLE 5.1 vs GPT-6 ASTRA"),
    (4.15, 5.29, "SEGÚN LOS BENCHMARKS"),
    (5.85, 8.40, "ASTRA LIDERA EN"),
    (8.40, 9.70, "GENERAR CÓDIGO"),
    (9.87, 10.55, "AUTOMATIZACIÓN"),
    (10.55, 12.20, "Y MATEMÁTICA AVANZADA"),
    (12.69, 14.54, "PERO SEGÚN LAS ESTADÍSTICAS"),
    (14.54, 16.38, "FABLE GANA EN RAZONAMIENTO"),
    (17.09, 19.40, "LO ESTUVE PROBANDO"),
    (19.40, 20.78, "EN MI PLATAFORMA"),
    (20.78, 23.40, "PARA MÍ, ASTRA ES SUPERIOR"),
    (23.40, 24.90, "EN CODIFICACIÓN"),
    (24.90, 26.56, "SOBRE TODO EN BACKEND"),
    (27.01, 29.02, "FABLE NO SE QUEDA ATRÁS"),
    (29.02, 31.90, "EN FRONTEND Y CIBERSEGURIDAD"),
    (34.31, 35.10, "DÉJAME UN COMENTARIO"),
]


def write_ass() -> None:
    header = """[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Main,Segoe UI,54,&H00F4F1EA,&H00F4F1EA,&H00111219,&H00111219,-1,0,0,0,100,100,0,0,1,2,0,5,65,65,0,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    lines = []
    for start, end, words in CAPTIONS:
        s, e = output_time(start), output_time(end)
        if e - s < 0.4:
            continue
        # The caption lives in the dark seam above the head.
        lines.append(f"Dialogue: 0,{ass_time(s)},{ass_time(e)},Main,,0,0,0,,{{\\an5\\pos(540,775)}}{words}")
    (BUILD / "captions.ass").write_text(header + "\n".join(lines) + "\n", encoding="utf-8")


def render() -> None:
    if not SOURCE.exists():
        raise FileNotFoundError(SOURCE)
    if OUTPUT.exists():
        raise FileExistsError(f"Refusing to overwrite {OUTPUT}")
    BUILD.mkdir(parents=True, exist_ok=True)
    for i, factory in enumerate((card_1, card_2, card_3, card_4, card_5, card_6), 1):
        factory().save(BUILD / f"card-{i:02d}.png")
    write_ass()

    vparts = []
    aparts = []
    for i, (start, end) in enumerate(SEGMENTS):
        vparts.append(f"[v{i}]trim=start={start}:end={end},setpts=PTS-STARTPTS[vc{i}]")
        aparts.append(f"[a{i}]atrim=start={start}:end={end},asetpts=PTS-STARTPTS[ac{i}]")
    graph = [
        f"[0:v]split={len(SEGMENTS)}" + "".join(f"[v{i}]" for i in range(len(SEGMENTS))),
        f"[0:a]asplit={len(SEGMENTS)}" + "".join(f"[a{i}]" for i in range(len(SEGMENTS))),
        *vparts,
        *aparts,
        "".join(f"[vc{i}]" for i in range(len(SEGMENTS))) + f"concat=n={len(SEGMENTS)}:v=1:a=0[vcat]",
        "".join(f"[ac{i}]" for i in range(len(SEGMENTS))) + f"concat=n={len(SEGMENTS)}:v=0:a=1[acat]",
        "[vcat]crop=1080:1200:0:250,pad=1080:1920:0:720:color=0x111219,drawbox=x=0:y=720:w=1080:h=110:color=0x111219@0.92:t=fill,setsar=1[base]",
        "[acat]highpass=f=80,acompressor=threshold=0.11:ratio=2:attack=15:release=120,loudnorm=I=-14:TP=-1.5:LRA=11[aout]",
    ]
    previous = "base"
    cursor = 0.0
    transition = 0.34
    for i, duration in enumerate(DURATIONS, 1):
        end = cursor + duration
        # Keep the previous mockup visible underneath while the next large
        # screen slides in. Alternating direction adds rhythm without making
        # the edit feel like a template carousel.
        tail = end + transition if i < len(DURATIONS) else end
        if i == 1:
            enter_x = "0"
        elif i % 2 == 0:
            enter_x = f"if(lt(t,{cursor + transition:.3f}),main_w*(1-(t-{cursor:.3f})/{transition:.3f}),0)"
        else:
            enter_x = f"if(lt(t,{cursor + transition:.3f}),-overlay_w*(1-(t-{cursor:.3f})/{transition:.3f}),0)"
        graph.append(
            f"[{previous}][{i}:v]overlay=x='{enter_x}':y=0:enable='between(t,{cursor:.3f},{tail - 0.001:.3f})':eof_action=repeat[vcard{i}]"
        )
        previous = f"vcard{i}"
        cursor = end
    graph.append(f"[{previous}]ass=captions.ass,format=yuv420p[vout]")
    (BUILD / "filtergraph.txt").write_text(";\n".join(graph), encoding="utf-8")

    args = ["ffmpeg", "-hide_banner", "-y", "-i", str(SOURCE)]
    for i in range(1, 7):
        args += ["-framerate", "30", "-loop", "1", "-i", f"card-{i:02d}.png"]
    args += [
        "-filter_complex_script", "filtergraph.txt",
        "-map", "[vout]", "-map", "[aout]",
        "-r", "30", "-c:v", "libx264", "-preset", "veryfast", "-crf", "19",
        "-c:a", "aac", "-b:a", "192k", "-ar", "48000",
        "-movflags", "+faststart", "-t", f"{TOTAL:.3f}", str(OUTPUT),
    ]
    subprocess.run(args, cwd=BUILD, check=True)
    print(OUTPUT)
    print(f"duration={TOTAL:.3f}s")


if __name__ == "__main__":
    render()
