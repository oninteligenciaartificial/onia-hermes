#!/usr/bin/env python3
"""medir-saltos.py — cuánto salta la cara en cada empalme del corte, medido sobre el RENDER (no sobre el bruto).

Para cada límite de bloque del cutplan (tiempo de salida) compara la cara (ojos, YuNet) en el cuadro anterior y en el
siguiente. Los empalmes donde cambia el layout (arranque de escena en plan.txt) se listan aparte: ahí la cámara se mueve
a propósito (sube / baja) y el salto lo tapa el cambio de panel. Lo que importa es el resto: micro-cortes dentro de una
misma escena, que es donde un salto de cara se vería.

Uso: python3 medir-saltos.py --video video.mp4 --cutplan ../cutplan.json --plan plan.txt
Sin red, sin modelos nuevos: usa el YuNet que ya está en editor-videos/assets/models/.
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
    return ((c[4] + c[6]) / 2 * 1080 / ANCHO, (c[5] + c[7]) / 2 * 1080 / ANCHO)  # (x, y) en px de 1080


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--video", required=True)
    ap.add_argument("--cutplan", required=True)
    ap.add_argument("--plan", required=True, help="plan.txt (de ahí salen los arranques de escena)")
    a = ap.parse_args()

    keep = json.loads(Path(a.cutplan).read_text())["keep"]
    cortes, acu = [], 0.0
    for k in keep[:-1]:
        acu += k["end"] - k["start"]
        cortes.append(round(acu, 3))
    escenas = [float(m.group(1)) for m in re.finditer(r"^\s+(\d+\.\d+)\s+(?:split|full|pip|lamina)\s", Path(a.plan).read_text(), re.M)]
    det = cv2.FaceDetectorYN.create(str(MODELO), "", (ANCHO, 960))

    dentro, layout, perdidos = [], [], 0
    for t in cortes:
        p, q = ojos(det, cuadro(a.video, t - 1.0 / FPS)), ojos(det, cuadro(a.video, t + 1.0 / FPS))
        if p is None or q is None:
            perdidos += 1
            continue
        d = (abs(q[0] - p[0]), abs(q[1] - p[1]))
        (layout if any(abs(t - e) < 0.12 for e in escenas) else dentro).append((t, d[0], d[1]))
    print(f"cortes del cutplan: {len(cortes)} · medidos {len(dentro) + len(layout)} · sin cara detectada {perdidos}")
    for nombre, lista in (("dentro de una escena (el salto de cara se vería)", dentro),
                          ("en un cambio de layout (la cámara se mueve a propósito)", layout)):
        if not lista:
            print(f"{nombre}: ninguno")
            continue
        dx, dy = [x[1] for x in lista], [x[2] for x in lista]
        print(f"{nombre}: {len(lista)} · salto de ojos x máx {max(dx):.0f} px, mediana {statistics.median(dx):.1f} · "
              f"y máx {max(dy):.0f} px, mediana {statistics.median(dy):.1f} (px de 1080; incluye el movimiento natural de 2 cuadros)")
    mal = sorted(dentro, key=lambda x: -(x[1] ** 2 + x[2] ** 2) ** 0.5)[:5]
    print("los 5 mayores dentro de una escena: " + " · ".join(f"{t:.2f} s (dx {dx:.0f}, dy {dy:.0f})" for t, dx, dy in mal))


if __name__ == "__main__":
    main()
