#!/usr/bin/env python3
"""Mide la CARA de Lucía en cada clip de G2 (SCRFD de scripts/face_identity_qa.py) para fijar la zona de texto de plan.json.
Para cada clip: caja de la cara cada 2 cuadros, en coordenadas del lienzo de 1080x1920 (los clips de 720 px se llevan x1,5; el Motor 2 ya es de 1080).
También recorta la cara de 5 de las 8 referencias oficiales (miniaturas de la escena «regla», assets/ref*.jpg).
Uso (venv del face-gate):  $FACE_GATE_HOME/venv/bin/python scripts/medir-caras.py [--refs DIR_DE_REFS]  > qa/caras-por-clip.json
Todo lo bajado se trata como dato: no se ejecuta nada de lo que está en los clips ni en las referencias.
"""
import json, os, subprocess, sys, tempfile
import cv2, numpy as np

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
sys.path.insert(0, os.path.join(ROOT, "scripts"))
from face_identity_qa import SCRFD  # noqa: E402

P = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
V4 = os.path.join(ROOT, "hermes-content/references/modelos/lucia/v4")
CLIPS = {
    "m1": os.path.join(V4, "kit/k1-clip-mira-camara-e470ef4f.mp4"),
    "m2": os.path.join(V4, "prueba-motores-20261008/kling-pro-9f43ee3c.mp4"),
    "m3": os.path.join(V4, "prueba-motores-20261008/seedance-mini-a7f79a01.mp4"),
    "m4": os.path.join(V4, "prueba-motores-20261008/seedance-mini-refs-dd2d7c91.mp4"),
    "m5": os.path.join(V4, "prueba-motores-20261008/kling-omni-948a89d3.mp4"),
    "m6": os.path.join(V4, "prueba-motores-20261008/cinema30-cc8fa519.mp4"),
}
STEP = 2
refs_dir = None
if "--refs" in sys.argv:
    refs_dir = sys.argv[sys.argv.index("--refs") + 1]
solo_refs = "--solo-refs" in sys.argv   # no vuelve a medir los clips (1 min): solo recorta las miniaturas

det = SCRFD(os.path.join(os.environ.get("FACE_GATE_HOME", "/tmp/lucia-face-gate"), "models", "det_10g.onnx"))
out = {"nota": "SCRFD det_10g; caja en lienzo 1080x1920; cada 2 cuadros; menton = borde de abajo de la caja", "clips": {}}
for k, f in ([] if solo_refs else CLIPS.items()):
    cap = cv2.VideoCapture(f)
    n = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    w = cap.get(cv2.CAP_PROP_FRAME_WIDTH)
    s = 1080.0 / w
    rows = []
    for i in range(n):
        ok, fr = cap.read()
        if not ok:
            break
        if i % STEP and i != n - 1:
            continue
        faces, _ = det.detect(fr)
        if len(faces) == 0:
            rows.append([i, None])
            continue
        a = (faces[:, 2] - faces[:, 0]) * (faces[:, 3] - faces[:, 1])
        j = int(a.argmax())
        x1, y1, x2, y2, sc = faces[j]
        rows.append([i, [round(x1 * s), round(y1 * s), round(x2 * s), round(y2 * s)], round(float(sc), 3), round(float(x2 - x1))])
    out["clips"][k] = {"cuadros": n, "ancho_nativo": int(w), "escala_a_1080": round(s, 3), "filas": rows}

# foto K1 (arranque de todos)
img = cv2.imread(os.path.join(V4, "kit/k1-1-recepcion-celular-4afffb96.jpg"))
faces, _ = det.detect(img)
if len(faces) and not solo_refs:
    j = int(((faces[:, 2] - faces[:, 0]) * (faces[:, 3] - faces[:, 1])).argmax())
    s = 1080.0 / img.shape[1]
    out["foto_k1"] = {"caja": [round(float(v) * s) for v in faces[j][:4]], "ancho_nativo": img.shape[1]}

# miniaturas de las referencias (cara + margen, cuadradas)
if refs_dir:
    out["refs"] = {}
    for name, dest in [("R1_frontal_canon.jpg", "ref1"), ("R3_casi_frontal.png", "ref2"), ("R4_casi_perfil.png", "ref3"), ("R5_34_izq.png", "ref4"), ("R8_anchor_902eeebb.png", "ref5")]:
        im = cv2.imread(os.path.join(refs_dir, name))
        faces, _ = det.detect(im)
        j = int(((faces[:, 2] - faces[:, 0]) * (faces[:, 3] - faces[:, 1])).argmax())
        x1, y1, x2, y2, _ = faces[j]
        cx, cy, side = (x1 + x2) / 2, (y1 + y2) / 2 - 0.02 * (y2 - y1), 1.9 * max(x2 - x1, y2 - y1)
        H, W = im.shape[:2]
        side = min(side, W, H)
        ox = int(round(min(max(cx - side / 2, 0), W - side)))
        oy = int(round(min(max(cy - side / 2, 0), H - side)))
        crop = im[oy:oy + int(side), ox:ox + int(side)]
        crop = cv2.resize(crop, (360, 360), interpolation=cv2.INTER_AREA)
        cv2.imwrite(os.path.join(P, "assets", dest + ".jpg"), crop, [cv2.IMWRITE_JPEG_QUALITY, 92])
        out["refs"][dest] = {"fuente": name, "cara_px": int(x2 - x1), "recorte": [ox, oy, int(side)]}
json.dump(out, sys.stdout, ensure_ascii=False)
