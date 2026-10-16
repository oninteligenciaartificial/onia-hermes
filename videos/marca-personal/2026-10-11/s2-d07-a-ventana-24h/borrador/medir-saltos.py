#!/usr/bin/env python3
"""medir-saltos.py — cuánto salta la cara en los empalmes del corte que NO llevan cambio de apoyo, medido sobre el RENDER.

Erik no tapa cada micro-corte: solo los que coinciden con una lámina, una tarjeta, un zoom o un bloque nuevo de subtítulos.
`informe-erik.txt` (de erik_edit.py) lista los empalmes del cutplan «sin cambio de apoyo en ese cuadro»: son los únicos donde
un salto de cara se vería. Para cada uno compara los ojos (YuNet) en el cuadro anterior y en el siguiente.
Uso: python3 medir-saltos.py --video video.mp4 --cutplan cutplan-erik.json --informe informe-erik.txt
"""
import argparse
import json
import re
import statistics
import subprocess
from pathlib import Path

import cv2
import numpy as np

REPO = Path(__file__).resolve().parents[5]
MODELO = REPO / ".claude/skills/editor-videos/assets/models/face_detection_yunet_2023mar.onnx"
FPS = 30
ANCHO = 540  # se mide a la mitad de la resolución y se devuelve en px de 1080


def cuadro(video, t):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{max(t, 0):.4f}", "-i", str(video), "-frames:v", "1",
                          "-vf", f"scale={ANCHO}:-2,format=bgr24", "-f", "rawvideo", "-"], capture_output=True, check=True).stdout
    h = len(raw) // (ANCHO * 3)
    return np.frombuffer(raw, np.uint8).reshape(h, ANCHO, 3)


def ojos(det, im):
    h, w = im.shape[:2]
    det.setInputSize((w, h))
    _, caras = det.detect(im)
    if caras is None or len(caras) == 0:
        return None
    c = max(caras, key=lambda f: f[2] * f[3])
    return ((c[4] + c[6]) / 2 * 1080 / ANCHO, (c[5] + c[7]) / 2 * 1080 / ANCHO)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--video", required=True)
    ap.add_argument("--cutplan", required=True)
    ap.add_argument("--informe", required=True)
    a = ap.parse_args()
    m = re.search(r"sin cambio de apoyo en ese cuadro: \[([^\]]*)\]", Path(a.informe).read_text())
    cortes = [float(x) for x in m.group(1).split(",") if x.strip()] if m else []
    det = cv2.FaceDetectorYN.create(str(MODELO), "", (ANCHO, 960))
    medidos, perdidos = [], 0
    for t in cortes:
        p, q = ojos(det, cuadro(a.video, t - 1.0 / FPS)), ojos(det, cuadro(a.video, t + 1.0 / FPS))
        if p is None or q is None:
            perdidos += 1
            continue
        medidos.append((t, abs(q[0] - p[0]), abs(q[1] - p[1])))
    print(f"empalmes sin cambio de apoyo: {len(cortes)} · medidos {len(medidos)} · sin cara detectada {perdidos}")
    if medidos:
        dx, dy = [x[1] for x in medidos], [x[2] for x in medidos]
        print(f"salto de ojos x máx {max(dx):.0f} px, mediana {statistics.median(dx):.1f} · y máx {max(dy):.0f} px, mediana "
              f"{statistics.median(dy):.1f} (px de 1080; incluye el movimiento natural de 2 cuadros)")
        mal = sorted(medidos, key=lambda x: -(x[1] ** 2 + x[2] ** 2) ** 0.5)[:5]
        print("los 5 mayores: " + " · ".join(f"{t:.2f} s (dx {x:.0f}, dy {y:.0f})" for t, x, y in mal))


if __name__ == "__main__":
    main()
