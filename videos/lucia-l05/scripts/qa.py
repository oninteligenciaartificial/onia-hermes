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

# ---- 1) hoja de cuadros con guías ----
o = {x["id"]: x for x in L["overlays"]}
picks = [
    (o["card1-lunes"]["in"], "0,1 s · entra rótulo + LUNES"),
    ((o["card1-lunes"]["in"] + o["card1-lunes"]["out"]) // 2, "mitad tarjeta 1"),
    (o["card1-lunes"]["out"] - 1, "sale tarjeta 1"),
    (o["card2-link"]["in"], "entra tarjeta 2"),
    (o["sello-cero"]["in"], "entra sello 130 % + golpe"),
    (o["sello-cero"]["in"] + 3, "sello 100 %"),
    ((o["card2-link"]["in"] + o["card2-link"]["out"]) // 2, "mitad tarjeta 2 + sello"),
    (o["card2-link"]["out"] - 1, "sale tarjeta 2 + sello"),
    (o["card3-horario"]["in"], "entra tarjeta 3"),
    ((o["card3-horario"]["in"] + L["frames"]) // 2, "mitad tarjeta 3"),
    (L["frames"] - 1, "último cuadro"),
    (0, "cuadro 0 (antes de entrar)"),
]
tw, th = 360, 640
cols = 6
sheet = Image.new("RGB", (cols * tw + (cols - 1) * 8, 2 * (th + 34) + 8), (16, 16, 16))
try:
    font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 15)
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
    x0, y0 = (i % cols) * (tw + 8), (i // cols) * (th + 42)
    sheet.paste(im, (x0, y0 + 34))
    ImageDraw.Draw(sheet).text((x0 + 4, y0 + 8), f"f{f:03d} {f / FPS:.3f}s · {label}", fill=(255, 255, 255), font=font)
sheet.save(os.path.join(P, "renders/qa-frames.jpg"), quality=90)
out["qa_frames"] = [{"frame": f, "t": round(f / FPS, 3), "que": l} for f, l in picks]

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

json.dump(out, open(os.path.join(QA, "qa.json"), "w"), ensure_ascii=False, indent=1)
print(json.dumps({k: v for k, v in out.items() if k not in ("specs", "qa_frames")}, ensure_ascii=False, indent=1))
v = [s for s in out["specs"]["streams"] if s["codec_name"] == "h264"][0]
print("specs:", v["width"], v["height"], v["r_frame_rate"], v["pix_fmt"], v["color_space"], v.get("profile"),
      "| faststart:", out["faststart_moov_antes_de_mdat"])
