#!/usr/bin/env python3
"""medir-salto-cara.py — ¿salta la cara en cada empalme del corte? Mide sobre el RENDER FINAL, no sobre el bruto.

Para cada límite de bloque del cutplan (tiempo de salida = suma de lo que dura cada `keep`), toma el cuadro justo antes y el
justo después y detecta la cara con YuNet (el mismo modelo que usa santiago.py con OpenCV 5). Imprime el corrimiento de los ojos
(dx, dy, en píxeles de 1080x1920) y el cambio de ancho de cara. Ojo: donde el corte coincide con un cambio de layout
(split <-> cara completa) el salto es el movimiento de cámara del molde, no un defecto; la ventana reducida (pip) no se mide.

Uso: python3 -I medir-salto-cara.py <video.mp4> <cutplan.json> [<plan.txt>]   (con plan.txt marca cuáles quedan «a la vista»)
"""
import re
import sys
from pathlib import Path

import cv2
import json
import numpy as np

REPO = Path(__file__).resolve().parents[5]
YUNET = REPO / ".claude/skills/editor-videos/assets/models/face_detection_yunet_2023mar.onnx"


def cara(det, img):
    h, w = img.shape[:2]
    det.setInputSize((w, h))
    _, caras = det.detect(img)
    if caras is None or not len(caras):
        return None
    f = max(caras, key=lambda c: c[2] * c[3])
    return {"ox": (f[4] + f[6]) / 2, "oy": (f[5] + f[7]) / 2, "w": float(f[2]), "n": len(caras)}


def main():
    video, cutplan = sys.argv[1], sys.argv[2]
    vista = set()
    if len(sys.argv) > 3:
        m = re.search(r"a la vista \(sin cambio de panel/layout/punch\): \[(.*?)\]", Path(sys.argv[3]).read_text())
        if m:
            vista = {float(x) for x in re.findall(r"'([\d.]+)\(", m.group(1))}
    keeps = json.loads(Path(cutplan).read_text())["keep"]
    cortes, acc = [], 0.0
    for k in keeps[:-1]:
        acc += k["end"] - k["start"]
        cortes.append(round(acc, 2))
    det = cv2.FaceDetectorYN.create(str(YUNET), "", (1080, 1920), 0.7, 0.3, 50)
    cap = cv2.VideoCapture(video)
    fps = cap.get(cv2.CAP_PROP_FPS) or 30.0

    def cuadro(t):
        cap.set(cv2.CAP_PROP_POS_FRAMES, max(0, int(round(t * fps))))
        ok, im = cap.read()
        return im if ok else None

    filas = []
    for c in cortes:
        a, b = cara(det, cuadro(c - 2 / fps)), cara(det, cuadro(c + 1 / fps))
        if a is None or b is None:
            filas.append((c, None, None, None, c in vista))
            continue
        filas.append((c, b["ox"] - a["ox"], b["oy"] - a["oy"], b["w"] - a["w"], c in vista))
    print(f"empalmes medidos: {len(filas)} (cuadro −2 contra +1 alrededor de cada límite de bloque)")
    for c, dx, dy, dw, v in filas:
        if dx is None:
            print(f"  {c:6.2f} s  sin cara detectada (ventana reducida o cuadro sin cara)")
            continue
        print(f"  {c:6.2f} s  dx {dx:+6.1f}  dy {dy:+6.1f}  ancho {dw:+6.1f}" + ("   <- a la vista (sin cambio de panel)" if v else ""))
    # referencia: el mismo corrimiento de 3 cuadros en medio de cada bloque (sin corte), para separar lo que es corte de lo que es
    # movimiento natural de la cabeza (un empalme se come de 0,1 a 0,4 s de imagen)
    lim = [0.0] + cortes + [round(sum(k["end"] - k["start"] for k in keeps), 2)]
    base = []
    for i in range(len(lim) - 1):
        if lim[i + 1] - lim[i] < 1.2:
            continue
        m = (lim[i] + lim[i + 1]) / 2
        a, b = cara(det, cuadro(m - 2 / fps)), cara(det, cuadro(m + 1 / fps))
        if a and b:
            base.append((abs(b["ox"] - a["ox"]), abs(b["oy"] - a["oy"])))
    if base:
        bx, by = np.array(base).T
        print(f"referencia sin corte (3 cuadros dentro de {len(base)} bloques): ojos dx mediana {np.median(bx):.1f} · p90 {np.percentile(bx, 90):.1f} px; "
              f"dy mediana {np.median(by):.1f} · p90 {np.percentile(by, 90):.1f} px (el máximo, {by.max():.0f} px, es un bloque con cambio de layout)")
    vs = [(abs(dx), abs(dy), c) for c, dx, dy, dw, v in filas if v and dx is not None]
    if vs:
        print(f"a la vista, {len(vs)} medidos: salto máximo de ojos dx {max(v[0] for v in vs):.1f} px · dy {max(v[1] for v in vs):.1f} px")


if __name__ == "__main__":
    main()
