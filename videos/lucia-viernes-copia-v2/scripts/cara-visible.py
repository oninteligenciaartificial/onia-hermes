#!/usr/bin/env python3
"""Fracción de muestras del master con una cara de Lucía a la vista (v2, pedido de la madre marketing: la cara visible MÁS de la mitad del tiempo; objetivo ≥ 85 %).
Toma un cuadro cada `muestreo` segundos (por defecto 0,5 s: t = 0, 0,5, … 14,5), detecta caras con SCRFD det_10g (el detector de scripts/face_identity_qa.py, el mismo del face-gate)
y cuenta la muestra como «con cara» si alguna caja mide ≥ `min_px` px de ancho en el lienzo de 1080×1920. No descarga nada: usa el venv y los modelos ya existentes del face-gate.
Uso:  $FACE_GATE_HOME/venv/bin/python -I scripts/cara-visible.py out/<master>.mp4 [muestreo=0.5] [min_px=200] > qa/cara-visible.json
"""
import json, math, os, subprocess, sys, tempfile
import cv2
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
sys.path.insert(0, os.path.join(ROOT, "scripts"))
from face_identity_qa import SCRFD  # noqa: E402
master = sys.argv[1]
step = float(sys.argv[2]) if len(sys.argv) > 2 else 0.5
min_px = float(sys.argv[3]) if len(sys.argv) > 3 else 200
fps = 24
dur = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", master]).decode().strip())
n_muestras = int(math.floor(dur / step + 1e-9))
det = SCRFD(os.path.join(os.environ.get("FACE_GATE_HOME", "/tmp/lucia-face-gate"), "models", "det_10g.onnx"))
muestras = []
with tempfile.TemporaryDirectory() as tmp:
    for k in range(n_muestras):
        t = k * step
        f = int(round(t * fps))
        png = os.path.join(tmp, f"f{f}.png")
        subprocess.check_call(["ffmpeg", "-v", "error", "-y", "-i", master, "-vf", f"select=eq(n\\,{f})", "-frames:v", "1", png])
        img = cv2.imread(png)
        faces, _ = det.detect(img)
        cajas = [{"x1": round(float(a[0]), 1), "y1": round(float(a[1]), 1), "x2": round(float(a[2]), 1), "y2": round(float(a[3]), 1), "px": round(float(a[2] - a[0])), "score": round(float(a[4]), 3)} for a in faces]
        mx = max([c["px"] for c in cajas], default=0)
        muestras.append({"t": round(t, 3), "cuadro": f, "caras": cajas, "max_px": mx, "con_cara": mx >= min_px})
con = sum(1 for m in muestras if m["con_cara"])
print(json.dumps({"master": os.path.basename(master), "muestreo_s": step, "min_px": min_px, "n_muestras": n_muestras, "con_cara": con, "fraccion": round(con / n_muestras, 4), "muestras": muestras}, indent=1, ensure_ascii=False))
