#!/usr/bin/env python3
"""L05 — mide la cara de Lucía cuadro por cuadro con SCRFD (det_10g, el de face_identity_qa.py).

Uso: python3 medir-cara.py <video> [--every N] [--scale-to 1080x1920]
Imprime bbox (en coords del lienzo 1080x1920), mentón máx (y2 del bbox) y la franja libre.
"""
import sys, os, json
import cv2, numpy as np
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../../../scripts"))
from face_identity_qa import SCRFD, ensure_models  # noqa: E402

video = sys.argv[1]
every = int(sys.argv[sys.argv.index("--every") + 1]) if "--every" in sys.argv else 1
CW, CH = 1080, 1920
det_path, _ = ensure_models()
det = SCRFD(det_path)
cap = cv2.VideoCapture(video)
fps = cap.get(cv2.CAP_PROP_FPS) or 24
rows, i = [], 0
while True:
    ok, img = cap.read()
    if not ok:
        break
    if i % every == 0:
        h, w = img.shape[:2]
        sx, sy = CW / w, CH / h
        faces, kps = det.detect(img)
        if len(faces):
            a = (faces[:, 2] - faces[:, 0]) * (faces[:, 3] - faces[:, 1])
            j = int(a.argmax())
            x1, y1, x2, y2, s = faces[j]
            rows.append({"f": i, "t": round(i / fps, 3), "n": int(len(faces)), "score": round(float(s), 3),
                         "x1": round(x1 * sx), "y1": round(y1 * sy), "x2": round(x2 * sx), "y2": round(y2 * sy)})
        else:
            rows.append({"f": i, "t": round(i / fps, 3), "n": 0})
    i += 1
det_rows = [r for r in rows if r["n"]]
chin = max(r["y2"] for r in det_rows)
worst = max(det_rows, key=lambda r: r["y2"])
print(json.dumps({"video": video, "frames_total": i, "frames_medidos": len(rows),
                  "frames_con_cara": len(det_rows), "frames_sin_cara": [r["f"] for r in rows if not r["n"]],
                  "max_caras_en_un_cuadro": max(r["n"] for r in rows),
                  "menton_max_y": chin, "menton_max_en": worst["t"],
                  "franja_libre": [chin + 40, 1490],
                  "bbox_union": [min(r["x1"] for r in det_rows), min(r["y1"] for r in det_rows),
                                 max(r["x2"] for r in det_rows), chin]}, ensure_ascii=False))
if "--rows" in sys.argv:
    for r in rows:
        print(r)
