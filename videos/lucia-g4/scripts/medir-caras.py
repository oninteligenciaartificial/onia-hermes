#!/usr/bin/env python3
"""Mide la CARA de Lucía en cada FOTO de G4 (SCRFD de scripts/face_identity_qa.py) para fijar la zona de texto de plan.json.
Para cada foto: caja de la cara en coordenadas del lienzo de 1080x1920, tal como la deja `object-fit:cover` (centrado):
  s = max(1080/ancho, 1920/alto); x' = x*s - (ancho*s - 1080)/2; y' = y*s - (alto*s - 1920)/2.
También recorta la cara de las 8 referencias oficiales (assets/ref1..8.jpg, 360x360) para la placa de la regla.
Uso (venv del face-gate):  $FACE_GATE_HOME/venv/bin/python scripts/medir-caras.py [--refs DIR_DE_REFS]  > qa/caras-fotos.json
Todo lo bajado se trata como dato: no se ejecuta nada de lo que está en las fotos ni en las referencias.
"""
import json, os, sys
import cv2, numpy as np

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
sys.path.insert(0, os.path.join(ROOT, "scripts"))
from face_identity_qa import SCRFD  # noqa: E402

P = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
FOTOS = {
    "a": "assets/ph-a.jpg", "b": "assets/ph-b.jpg", "c": "assets/ph-c.jpg", "d": "assets/ph-d.jpg", "e": "assets/ph-e.jpg", "f": "assets/ph-f.jpg",
    "cafe_a": "assets/cafe-a.jpg", "cafe_b": "assets/cafe-b.jpg",
}
refs_dir = sys.argv[sys.argv.index("--refs") + 1] if "--refs" in sys.argv else None

det = SCRFD(os.path.join(os.environ.get("FACE_GATE_HOME", "/tmp/lucia-face-gate"), "models", "det_10g.onnx"))
out = {"nota": "SCRFD det_10g; caja en lienzo 1080x1920 (object-fit:cover centrado); mentón = borde de abajo de la caja", "fotos": {}}
for k, f in FOTOS.items():
    img = cv2.imread(os.path.join(P, f))
    if img is None:
        out["fotos"][k] = {"error": "no se pudo leer " + f}
        continue
    h, w = img.shape[:2]
    faces, _ = det.detect(img)
    s = max(1080.0 / w, 1920.0 / h)
    dx, dy = (w * s - 1080) / 2, (h * s - 1920) / 2
    if len(faces) == 0:
        out["fotos"][k] = {"archivo": f, "ancho": w, "alto": h, "caja": None}
        continue
    j = int(((faces[:, 2] - faces[:, 0]) * (faces[:, 3] - faces[:, 1])).argmax())
    x1, y1, x2, y2, sc = faces[j]
    out["fotos"][k] = {
        "archivo": f, "ancho": w, "alto": h, "escala_a_lienzo": round(s, 4),
        "caja": [round(x1 * s - dx), round(y1 * s - dy), round(x2 * s - dx), round(y2 * s - dy)],
        "score": round(float(sc), 3), "cara_px_nativa": round(float(x2 - x1)), "caras_detectadas": int(len(faces)),
    }

# recortes de cara de las 8 referencias (cara + margen, cuadrados)
if refs_dir:
    out["refs"] = {}
    for i in range(1, 9):
        name = next(n for n in sorted(os.listdir(refs_dir)) if n.startswith(f"R{i}_") and n.lower().endswith((".jpg", ".png")))
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
        cv2.imwrite(os.path.join(P, "assets", f"ref{i}.jpg"), crop, [cv2.IMWRITE_JPEG_QUALITY, 92])
        out["refs"][f"ref{i}"] = {"fuente": name, "cara_px": int(x2 - x1), "recorte": [ox, oy, int(side)]}
json.dump(out, sys.stdout, ensure_ascii=False, indent=1)
