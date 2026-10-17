#!/usr/bin/env python3
"""Prueba de «cara chica» de G5: ¿el número BAJA SOLO cuando la cara es más chica?  (0 créditos, sin red salvo las 8 referencias)

El guion dice «Cara chica: baja sola». Los datos guardados no lo prueban: en el Motor 5 de G2 la cara va de 89 a 168 px y el número va de 0,80 a 0,83
(qa/cara-chica-m5.txt). Esta prueba lo mide con un CONTROL: la MISMA foto (misma cara, misma luz, mismo peinado) reducida con INTER_AREA a que la cara
mida 237 (nativa) / 178 / 120 / 89 / 60 px, y puntuada con el mismo medidor (ArcFace buffalo_l contra el centroide de las 8 referencias oficiales,
el de scripts/face_identity_qa.py). Es el único experimento donde lo único que cambia es el tamaño.

Uso (venv del face-gate):  $FACE_GATE_HOME/venv/bin/python scripts/cara-chica.py FOTO.jpg [FOTO.jpg …] > qa/cara-chica-control.txt
"""
import json, os, sys
import cv2, numpy as np

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
sys.path.insert(0, os.path.join(ROOT, "scripts"))
from face_identity_qa import SCRFD, ArcFace, load_image  # noqa: E402

HOME = os.environ.get("FACE_GATE_HOME", "/tmp/lucia-face-gate")
det = SCRFD(os.path.join(HOME, "models", "det_10g.onnx"))
rec = ArcFace(os.path.join(HOME, "models", "w600k_r50.onnx"))
man = json.load(open(os.path.join(ROOT, "hermes-content/references/modelos/lucia/v4/qa/manifest-escenas-seedream-20260930.json")))

def embed(img):
    faces, kps = det.detect(img)
    if len(faces) == 0:
        return None, 0
    i = int(((faces[:, 2] - faces[:, 0]) * (faces[:, 3] - faces[:, 1])).argmax())
    return rec.embed(img, kps[i]), int(faces[i, 2] - faces[i, 0])

R = []
for k, u in man["refs"].items():
    e, _ = embed(load_image(u))
    R.append(e)
C = np.mean(R, axis=0); C /= np.linalg.norm(C)
print(f"centroide de {len(R)} referencias oficiales; ArcFace buffalo_l; gate 0,70")
OBJ = [None, 178, 120, 89, 60]
print(f"{'foto':44} " + ' '.join(f"{'nativa' if o is None else str(o) + ' px':>14}" for o in OBJ))
for f in sys.argv[1:]:
    img = cv2.imread(f)
    e0, px0 = embed(img)
    fila = []
    for o in OBJ:
        im = img if o is None else cv2.resize(img, None, fx=o / px0, fy=o / px0, interpolation=cv2.INTER_AREA)
        e, px = embed(im)
        fila.append("sin cara" if e is None else f"{float(C @ e):.3f} ({px:3d}px)")
    print(f"{os.path.basename(f)[:44]:44} " + ' '.join(f"{x:>14}" for x in fila))
