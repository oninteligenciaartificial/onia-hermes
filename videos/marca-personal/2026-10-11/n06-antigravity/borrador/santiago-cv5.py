#!/usr/bin/env python3
"""santiago-cv5.py — corre santiago.py SIN tocarlo en un Python con OpenCV 5.

Por qué existe (11-oct-2026): OpenCV 5.0 sacó cv2.CascadeClassifier y los haarcascades; santiago.py los usa en
analizar_bruto() para medir la cara de cada toma y revienta con
    AttributeError: module 'cv2' has no attribute 'CascadeClassifier'
Este envoltorio pone en su lugar un detector con la misma interfaz (detectMultiScale) hecho con
cv2.FaceDetectorYN y el modelo YuNet que YA está en el repo (.claude/skills/editor-videos/assets/models/). Nada se
descarga. Si el OpenCV tiene Haar (4.x), no parchea nada y corre santiago.py tal cual.

santiago.py solo usa del recuadro: x + w/2 (centro), y + 0,4*h (ojos) y w (ancho de cara). Acá el recuadro se arma
con el ancho de YuNet y la altura calculada para que y + 0,4*h caiga en la línea REAL de los ojos (landmarks).

Uso: idéntico a santiago.py:  python3 santiago-cv5.py --bruto ... --cutplan ... (todos sus argumentos)
"""
import runpy
import sys
from pathlib import Path

import cv2
import numpy as np

AQUI = Path(__file__).resolve().parent


def raiz_repo() -> Path:
    for p in [AQUI, *AQUI.parents]:
        if (p / ".claude" / "skills" / "edicion-referentes").is_dir():
            return p
    sys.exit("santiago-cv5: no encuentro la raíz del repo (.claude/skills/edicion-referentes)")


REPO = raiz_repo()
SANTIAGO = REPO / ".claude/skills/edicion-referentes/scripts/santiago/santiago.py"
YUNET = REPO / ".claude/skills/editor-videos/assets/models/face_detection_yunet_2023mar.onnx"


class CascadeYuNet:
    """Misma interfaz que cv2.CascadeClassifier para lo que usa santiago.py."""

    def __init__(self, _ruta_ignorada=None):
        if not YUNET.exists():
            sys.exit(f"santiago-cv5: falta el modelo {YUNET}")
        self.det = cv2.FaceDetectorYN.create(str(YUNET), "", (540, 960), 0.7, 0.3, 50)

    def detectMultiScale(self, gris, scaleFactor=1.1, minNeighbors=5, minSize=(0, 0)):
        img = cv2.cvtColor(gris, cv2.COLOR_GRAY2BGR) if gris.ndim == 2 else gris
        h, w = img.shape[:2]
        self.det.setInputSize((w, h))
        _, caras = self.det.detect(img)
        out = []
        if caras is not None:
            for f in caras:
                x, y, bw, bh = (float(v) for v in f[:4])
                if bw < minSize[0] or bh < minSize[1]:
                    continue
                ojos_y = (float(f[5]) + float(f[7])) / 2  # landmarks: ojo derecho (4,5) e izquierdo (6,7)
                out.append((int(round(x)), int(round(ojos_y - 0.4 * bh)), int(round(bw)), int(round(bh))))
        return np.array(out, dtype=np.int32).reshape(-1, 4)


def main():
    if not hasattr(cv2, "CascadeClassifier"):
        cv2.CascadeClassifier = CascadeYuNet
        if not hasattr(cv2.data, "haarcascades"):
            cv2.data.haarcascades = ""
        print("santiago-cv5: OpenCV", cv2.__version__, "sin Haar; detector de cara = YuNet del repo", file=sys.stderr)
    sys.argv[0] = str(SANTIAGO)
    runpy.run_path(str(SANTIAGO), run_name="__main__")


if __name__ == "__main__":
    main()
