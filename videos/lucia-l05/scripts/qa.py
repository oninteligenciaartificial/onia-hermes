#!/usr/bin/env python3
"""L05 · QA mirado: hoja de cuadros con guías, caras YuNet crudo vs final, identidad ArcFace en 5 cuadros,
recorte 1:1 de la cara en el zoom máximo, golpe de zoom medido y specs. Todo a renders/qa/ + renders/qa-frames.jpg.

Uso (desde P):  python3 scripts/qa.py
Refs de identidad: env LUCIA_REFS (default: refs locales de la sesión de L08).
"""
import json
import os
import subprocess
import sys

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont

P = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
R = os.path.abspath(os.path.join(P, "../.."))
FINAL = os.path.join(P, "final/l05.mp4")
RAW = os.path.join(P, "raw/l05-coworking-kling-07b938b2.mp4")
QA = os.path.join(P, "renders/qa")
os.makedirs(QA, exist_ok=True)
REFS = os.environ.get("LUCIA_REFS", "/tmp/claude-0/-home-user-onia-hermes/59ef38f5-141c-5055-9631-e06d8af00fa0/scratchpad/l08/qa/refs")
YUNET = os.path.join(R, ".claude/skills/editor-videos/assets/models/face_detection_yunet_2023mar.onnx")
L = json.load(open(os.path.join(P, "scripts/layout.json")))
FPS = L["fps"]
out = {}


def frames(path):
    cap = cv2.VideoCapture(path)
    while True:
        ok, img = cap.read()
        if not ok:
            break
        yield img


fin = list(frames(FINAL))
raw = list(frames(RAW))
out["frames"] = {"final": len(fin), "raw": len(raw)}

# ---- 0) entrada del sello MEDIDA en el final (no supuesta): largo de la raya y opacidad, cuadros in-1 … in+4 ----
# El fondo sin sello sale del MISMO grafo (build.mjs --sin sello-cero) para medir la opacidad contra él.
import importlib.util  # noqa: E402

o = {x["id"]: x for x in L["overlays"]}
si = o["sello-cero"]["in"]
subprocess.run(["node", os.path.join(P, "scripts/build.mjs"), "--stills", ",".join(str(si - 1 + k) for k in range(6)),
                "--sin", "sello-cero", "--stills-dir", "renders/qa/fondo-sin-sello"], check=True, capture_output=True)
spec = importlib.util.spec_from_file_location("medir_sello", os.path.join(P, "scripts/medir-sello.py"))
ms = importlib.util.module_from_spec(spec)
spec.loader.exec_module(ms)
sello = ms.video_mode(FINAL, [si - 1 + k for k in range(6)], os.path.join(QA, "sello-entrada.png"))
out["sello_entrada_final"] = sello
out["sello_png"] = ms.png_mode()
sm = {d["cuadro"]: d for d in sello}


def sello_lbl(f, pct):
    d = sm[f]
    return f"sello {pct} %\nmedido: raya {d['raya_px']} px · opacidad {round(min(d['opacidad'], 1) * 100)} %"


# ---- 1) hoja de cuadros con guías ----
picks = [
    (o["card1-lunes"]["in"], "0,1 s · entra rótulo + LUNES"),
    ((o["card1-lunes"]["in"] + o["card1-lunes"]["out"]) // 2, "mitad tarjeta 1"),
    (o["card1-lunes"]["out"] - 1, "sale tarjeta 1"),
    (o["card2-link"]["in"], "entra tarjeta 2"),
    (si, "entra " + sello_lbl(si, 130).replace("\n", " + golpe\n", 1)),
    (si + 3, sello_lbl(si + 3, 100)),
    ((o["card2-link"]["in"] + o["card2-link"]["out"]) // 2, "mitad tarjeta 2 + sello"),
    (o["card2-link"]["out"] - 1, "sale tarjeta 2 + sello"),
    (o["card3-horario"]["in"], "entra tarjeta 3"),
    ((o["card3-horario"]["in"] + L["frames"]) // 2, "mitad tarjeta 3"),
    (L["frames"] - 1, "último cuadro"),
    (0, "cuadro 0 (antes de entrar)"),
]
tw, th = 400, 711
cols = 6
HD = 62  # cabecera de 3 líneas: cuadro/tiempo, qué se ve y lo MEDIDO del sello
sheet = Image.new("RGB", (cols * tw + (cols - 1) * 8, 2 * (th + HD) + 8), (16, 16, 16))
try:
    font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 14)
except OSError:
    font = ImageFont.load_default()
for i, (f, label) in enumerate(picks):
    im = Image.fromarray(cv2.cvtColor(fin[f], cv2.COLOR_BGR2RGB))
    d = ImageDraw.Draw(im, "RGBA")
    d.rectangle([1000, 1000, 1080, 1920], fill=(255, 0, 0, 50))  # 80 px derecha bajo y=1000
    d.rectangle([0, 1490, 1080, 1920], fill=(255, 0, 0, 40))  # zona UI de Instagram
    for y, c in ((714, (0, 255, 255)), (1490, (255, 40, 40))):
        d.line([(0, y), (1080, y)], fill=c, width=4)
    im = im.resize((tw, th), Image.LANCZOS)
    x0, y0 = (i % cols) * (tw + 8), (i // cols) * (th + HD + 8)
    sheet.paste(im, (x0, y0 + HD))
    dr = ImageDraw.Draw(sheet)
    dr.text((x0 + 4, y0 + 4), f"f{f:03d} · {f / FPS:.3f} s", fill=(255, 230, 80), font=font)
    for k, line in enumerate(label.split("\n")):
        dr.text((x0 + 4, y0 + 22 + 18 * k), line, fill=(255, 255, 255) if k == 0 else (120, 255, 170), font=font)
sheet.save(os.path.join(P, "renders/qa-frames.jpg"), quality=90)
out["qa_frames"] = [{"frame": f, "t": round(f / FPS, 3), "que": l.replace("\n", " · ")} for f, l in picks]

# ---- 2) caras con YuNet: crudo vs final, cuadro por cuadro ----
def yunet_count(imgs):
    det = cv2.FaceDetectorYN.create(YUNET, "", (320, 320), 0.8, 0.3, 5000)
    counts = []
    for img in imgs:
        h, w = img.shape[:2]
        det.setInputSize((w, h))
        _, faces = det.detect(img)
        counts.append(0 if faces is None else len(faces))
    return counts


cr, cf = yunet_count(raw), yunet_count(fin)
out["yunet"] = {"raw_total": int(sum(cr)), "final_total": int(sum(cf)),
                "raw_cuadros_con_1": cr.count(1), "final_cuadros_con_1": cf.count(1),
                "cuadros_distintos": [i for i, (a, b) in enumerate(zip(cr, cf)) if a != b]}

# ---- 3) SCRFD: mentón máx en el final + golpe de zoom medido (ancho de cara) ----
sys.path.insert(0, os.path.join(R, "scripts"))
from face_identity_qa import SCRFD, ensure_models  # noqa: E402

det_path, _ = ensure_models()
scrfd = SCRFD(det_path)
boxes = []
for img in fin:
    fb, _ = scrfd.detect(img)
    a = (fb[:, 2] - fb[:, 0]) * (fb[:, 3] - fb[:, 1])
    boxes.append(fb[int(a.argmax())])
boxes = np.array(boxes)
g = L["golpe"]["frame"]
wid = boxes[:, 2] - boxes[:, 0]
out["scrfd_final"] = {"menton_max_y": int(boxes[:, 3].max()), "en_cuadro": int(boxes[:, 3].argmax()),
                      "ancho_cara_px": {str(f): round(float(wid[f]), 1) for f in range(g - 2, g + 7)},
                      "golpe_ratio_medido": round(float(wid[g:g + 5].mean() / np.r_[wid[g - 3:g], wid[g + 5:g + 8]].mean()), 4)}

# ---- 4) recorte 1:1 de la cara en el zoom máximo (cuadro del golpe) ----
x1, y1, x2, y2 = [int(v) for v in boxes[g + 2][:4]]
pad = 60
crop = fin[g + 2][max(0, y1 - pad):y2 + pad, max(0, x1 - pad):x2 + pad]
cv2.imwrite(os.path.join(QA, f"cara-1a1-f{g + 2:03d}.png"), crop)
out["recorte_1a1"] = f"renders/qa/cara-1a1-f{g + 2:03d}.png"

# ---- 5) identidad ArcFace en 5 cuadros del FINAL ----
tests = {}
for t in (0.5, 1.5, 3.0, 4.5, 6.0):
    f = min(int(round(t * FPS)), len(fin) - 1)
    pth = os.path.join(QA, f"L05_{f / FPS:.2f}.png")
    cv2.imwrite(pth, fin[f])
    tests[f"L05_{f / FPS:.2f}"] = pth
refs = {os.path.splitext(n)[0]: os.path.join(REFS, n) for n in sorted(os.listdir(REFS)) if n.startswith("R")}
negs = {os.path.splitext(n)[0]: os.path.join(REFS, n) for n in sorted(os.listdir(REFS)) if n.startswith("N")}
man = os.path.join(QA, "manifest-l05.json")
json.dump({"refs": refs, "tests": tests, "negatives": negs}, open(man, "w"), indent=1)
res = subprocess.run([sys.executable, os.path.join(R, "scripts/face_identity_qa.py"), man], capture_output=True, text=True)
if res.returncode != 0:
    print(res.stderr, file=sys.stderr)
    sys.exit(1)
ident = json.loads(res.stdout)
json.dump(ident, open(os.path.join(QA, "identidad-l05.json"), "w"), ensure_ascii=False, indent=1)
out["identidad"] = {k: ident["scores"][k]["centroid"] for k in tests}
out["identidad_negativos_max"] = ident["negatives_max"]
out["identidad_refs_loo_min"] = ident["refs_internal"]["leave_one_out_min"]

# ---- 6) specs + audio ----
pr = subprocess.run(["ffprobe", "-v", "error", "-show_entries",
                     "stream=codec_name,profile,width,height,r_frame_rate,nb_frames,pix_fmt,color_space,color_transfer,color_primaries,sample_rate,channels,duration",
                     "-show_entries", "format=duration,size,bit_rate", "-of", "json", FINAL], capture_output=True, text=True)
out["specs"] = json.loads(pr.stdout)
with open(FINAL, "rb") as fh:
    head = fh.read(4096)
out["faststart_moov_antes_de_mdat"] = head.find(b"moov") != -1 and (head.find(b"mdat") == -1 or head.find(b"moov") < head.find(b"mdat"))
eb = subprocess.run(["ffmpeg", "-hide_banner", "-i", FINAL, "-af", "ebur128=peak=true:framelog=quiet", "-f", "null", "-"],
                    capture_output=True, text=True).stderr
I = [l for l in eb.splitlines() if l.strip().startswith("I:")][-1].split()[1]
TP = [l for l in eb.splitlines() if l.strip().startswith("Peak:")][-1].split()[1]
out["audio"] = {"lufs_integrado": float(I), "pico_dbtp": float(TP)}

# ---- 7) color: el verde de la raya y la piel contra el crudo, decodificando como bt709 (lo que está etiquetado) ----
def rgb709(path, n, w=1080, h=1920):
    vf = f"select=eq(n\\,{n}),scale={w}:{h}:flags=lanczos:in_color_matrix=bt709:in_range=tv:out_range=pc,format=rgb24"
    b = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-vf", vf, "-frames:v", "1", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
                       capture_output=True).stdout
    return np.frombuffer(b, np.uint8).reshape(h, w, 3).astype(float)


fa, ra = rgb709(FINAL, 72), rgb709(RAW, 72)
px = fa[1150:1420, 240:840].reshape(-1, 3)
green = px[(px[:, 1] > 180) & (px[:, 0] < 60) & (px[:, 2] < 140)]
top = slice(0, 700)  # sin overlays: cara y fondo
mse = ((fa[top] - ra[top]) ** 2).mean()
out["color"] = {"verde_raya_rgb_mediana": [int(v) for v in np.median(green, 0)], "objetivo": [16, 194, 107],
                "psnr_cara_vs_crudo_db": round(float(10 * np.log10(255 ** 2 / mse)), 2),
                "desvio_medio_rgb": [round(float(v), 2) for v in (fa[top] - ra[top]).reshape(-1, 3).mean(0)]}

# ---- 8) SFX: dónde suena cada golpe (10 % del pico) contra la entrada visual ----
pcm = subprocess.run(["ffmpeg", "-v", "error", "-i", FINAL, "-f", "f32le", "-ac", "1", "-ar", "48000", "-"], capture_output=True).stdout
y = np.abs(np.frombuffer(pcm, np.float32))
ons, i = [], 0
while i < len(y):
    if y[i] > 0.1 * y.max():
        ons.append(round(i / 48000, 3))
        i += int(0.3 * 48000)
    else:
        i += 1
out["sfx_golpes_s"] = ons
out["entradas_visuales_s"] = sorted(round(x["in"] / FPS, 3) for x in L["overlays"] if x["id"] != "tag-ia")

json.dump(out, open(os.path.join(QA, "qa.json"), "w"), ensure_ascii=False, indent=1)
print(json.dumps({k: v for k, v in out.items() if k not in ("specs", "qa_frames")}, ensure_ascii=False, indent=1))
v = [s for s in out["specs"]["streams"] if s["codec_name"] == "h264"][0]
print("specs:", v["width"], v["height"], v["r_frame_rate"], v["pix_fmt"], v["color_space"], v.get("profile"),
      "| faststart:", out["faststart_moov_antes_de_mdat"])
