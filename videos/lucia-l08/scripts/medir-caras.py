# -*- coding: utf-8 -*-
"""L08 — mide la cara en TODO el clip (receta «Reels de Lucía» §2 y QA §12).

Corre SCRFD (det_10g de insightface, el mismo de scripts/face_identity_qa.py) y YuNet (el ONNX de
editor-videos) sobre CADA cuadro y lleva las cajas al lienzo 1080x1920. Sirve para dos cosas:
  · antes del montaje: dónde termina el mentón → franja libre para el texto;
  · después: misma cantidad de caras en crudo y en final, y la caja del mentón + 40 px fuera del texto.

Uso:
  python3 medir-caras.py --video ../raw/l08-cafe-kling-f79eb10e.mp4 --skip-frames 10 --out ../renders/qa/caras-crudo.json
  python3 medir-caras.py --video ../final/l08.mp4 --out ../renders/qa/caras-final.json
"""
import argparse, json, os, sys
import cv2
import numpy as np

R = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../.."))
sys.path.insert(0, os.path.join(R, "scripts"))
from face_identity_qa import SCRFD, ensure_models  # noqa: E402

YUNET = os.path.join(R, ".claude/skills/editor-videos/assets/models/face_detection_yunet_2023mar.onnx")

ap = argparse.ArgumentParser()
ap.add_argument("--video", required=True)
ap.add_argument("--skip-frames", type=int, default=0, help="cuadros que se tiran al inicio (el trim del montaje)")
ap.add_argument("--canvas-w", type=int, default=1080)
ap.add_argument("--out", required=True)
a = ap.parse_args()

det_path, _ = ensure_models()
scrfd = SCRFD(det_path)
cap = cv2.VideoCapture(a.video)
fps = cap.get(cv2.CAP_PROP_FPS) or 24.0
W = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)); H = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
k = a.canvas_w / W  # 720 -> 1080 = 1.5 ; 1080 -> 1080 = 1
yn = cv2.FaceDetectorYN_create(YUNET, "", (W, H), 0.6, 0.3, 5000)

frames, n = [], 0
while True:
    ok, img = cap.read()
    if not ok:
        break
    if n < a.skip_frames:
        n += 1
        continue
    i = n - a.skip_frames
    faces, _ = scrfd.detect(img)
    s_boxes = [[round(float(f[0]) * k, 1), round(float(f[1]) * k, 1), round(float(f[2]) * k, 1), round(float(f[3]) * k, 1), round(float(f[4]), 3)] for f in faces]
    _, yf = yn.detect(img)
    y_boxes = [] if yf is None else [[round(float(f[0]) * k, 1), round(float(f[1]) * k, 1), round(float(f[0] + f[2]) * k, 1), round(float(f[1] + f[3]) * k, 1), round(float(f[14]), 3)] for f in yf]
    frames.append({"n": i, "t": round(i / fps, 3), "scrfd": s_boxes, "yunet": y_boxes})
    n += 1

def resumen(key):
    cnt = [len(f[key]) for f in frames]
    chins = [(max(b[3] for b in f[key]), f["t"]) for f in frames if f[key]]
    tops = [(min(b[1] for b in f[key]), f["t"]) for f in frames if f[key]]
    return {
        "frames": len(frames),
        "frames_con_cara": sum(1 for c in cnt if c),
        "frames_sin_cara": [f["t"] for f in frames if not f[key]],
        "caras_por_frame": {str(c): cnt.count(c) for c in sorted(set(cnt))},
        "menton_max": max(chins) if chins else None,  # (y, t)
        "coronilla_min": min(tops) if tops else None,
    }

out = {"video": a.video, "fps": fps, "src": f"{W}x{H}", "canvas_scale": k, "skip_frames": a.skip_frames,
       "scrfd": resumen("scrfd"), "yunet": resumen("yunet"), "por_cuadro": frames}
os.makedirs(os.path.dirname(os.path.abspath(a.out)), exist_ok=True)
json.dump(out, open(a.out, "w"), indent=1)
print(json.dumps({"video": a.video, "scrfd": out["scrfd"], "yunet": out["yunet"]}, indent=1))
