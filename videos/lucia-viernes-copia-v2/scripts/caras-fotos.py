#!/usr/bin/env python3
"""Caja de la cara de Lucía (SCRFD det_10g de scripts/face_identity_qa.py) en las dos fotos de esta pieza: K4 (Kling O1 Image, café con teclado) y R3 (foto de entrada).
Escribe qa/caras-fotos.json con la caja en píxeles NATIVOS de cada foto; build.mjs la lleva al lienzo según el encuadre de cada escena.
Uso (venv y modelos ya existentes del face-gate; no descarga nada):  $FACE_GATE_HOME/venv/bin/python -I scripts/caras-fotos.py > qa/caras-fotos.json
"""
import json, os, sys
import cv2, numpy as np
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
sys.path.insert(0, os.path.join(ROOT, "scripts"))
from face_identity_qa import SCRFD  # noqa: E402
P = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
det = SCRFD(os.path.join(os.environ.get("FACE_GATE_HOME", "/tmp/lucia-face-gate"), "models", "det_10g.onnx"))
out = {"nota": "SCRFD det_10g 640 / 0,5; la cara más grande; caja [x1,y1,x2,y2] en píxeles nativos de cada foto", "fotos": {}}
for k, f in {"k4": "assets/k4.png", "r3": "assets/r3.png"}.items():
    img = cv2.imread(os.path.join(P, f))
    h, w = img.shape[:2]
    faces, kps = det.detect(img)
    j = int(((faces[:, 2] - faces[:, 0]) * (faces[:, 3] - faces[:, 1])).argmax())
    x1, y1, x2, y2, sc = faces[j]
    out["fotos"][k] = {"archivo": f, "ancho": w, "alto": h, "caja": [round(float(v), 1) for v in (x1, y1, x2, y2)], "score": round(float(sc), 3),
                       "cara_px": round(float(x2 - x1)), "caras_detectadas": int(len(faces)),
                       "puntos": [[round(float(a), 1), round(float(b), 1)] for a, b in kps[j]]}
print(json.dumps(out, indent=1, ensure_ascii=False))
