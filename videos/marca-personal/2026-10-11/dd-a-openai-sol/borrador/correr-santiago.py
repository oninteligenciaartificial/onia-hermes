#!/usr/bin/env python3
"""correr-santiago.py — corre santiago.py TAL CUAL (no se toca) con un parche en memoria para OpenCV 5.

Por qué: la nube trae opencv-python-headless 5.0.0, que ELIMINÓ cv2.CascadeClassifier y no trae los .xml de Haar, y
santiago.py (analizar_bruto) detecta la cara de cada toma con Haar → «AttributeError: module 'cv2' has no attribute
'CascadeClassifier'». El repo ya documenta lo mismo en editor-videos/scripts/blur-faces-detect.py y trae el detector que
sí existe en OpenCV 5: YuNet (assets/models/face_detection_yunet_2023mar.onnx, 230 KB, local, gratis).

Qué hace: si falta CascadeClassifier, lo reemplaza por una clase con la misma interfaz (detectMultiScale) que usa YuNet y
devuelve cajas «tipo Haar»: cuadradas, de ancho = ancho de la caja de YuNet y con los OJOS (landmarks de YuNet) en el 40 %
del alto, que es la fórmula con la que santiago.py calcula la altura de los ojos (y + 0,4·h). Después ejecuta santiago.py
con los mismos argumentos.

Uso: python3 correr-santiago.py <los mismos argumentos de santiago.py>
"""
import runpy
import sys
from pathlib import Path

import cv2
import numpy as np

REPO = Path(__file__).resolve().parents[5]
SANTIAGO = REPO / ".claude/skills/edicion-referentes/scripts/santiago/santiago.py"
MODELO = REPO / ".claude/skills/editor-videos/assets/models/face_detection_yunet_2023mar.onnx"


class _CascadeYuNet:
    """Misma interfaz que cv2.CascadeClassifier para lo que usa santiago.py: detectMultiScale(gris, f, vecinos, minSize)."""
    _det = None

    def __init__(self, *_a, **_k):
        pass

    def empty(self):
        return False

    def detectMultiScale(self, img, scaleFactor=1.1, minNeighbors=3, minSize=(0, 0), *_a, **_k):
        h, w = img.shape[:2]
        if _CascadeYuNet._det is None:
            crear = getattr(cv2.FaceDetectorYN, "create", None) or cv2.FaceDetectorYN_create
            _CascadeYuNet._det = crear(str(MODELO), "", (w, h), 0.6, 0.3, 5000)
        det = _CascadeYuNet._det
        det.setInputSize((w, h))
        bgr = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR) if img.ndim == 2 else img
        _, caras = det.detect(bgr)
        out = []
        for f in (caras if caras is not None else []):
            x, y, bw, bh = (float(v) for v in f[:4])
            ojo_y = (float(f[5]) + float(f[7])) / 2.0  # landmarks: ojo derecho (x4,y5), ojo izquierdo (x6,y7)
            if bw < min(minSize):
                continue
            out.append((int(round(x)), int(round(ojo_y - 0.4 * bw)), int(round(bw)), int(round(bw))))
        return np.array(out, dtype=np.int32).reshape(-1, 4)


def main():
    if not hasattr(cv2, "CascadeClassifier"):
        if not MODELO.exists():
            sys.exit(f"correr-santiago: falta el modelo YuNet en {MODELO}")
        cv2.CascadeClassifier = _CascadeYuNet
        print("correr-santiago: OpenCV", cv2.__version__, "sin CascadeClassifier → parche con YuNet (santiago.py intacto)")
    sys.argv = [str(SANTIAGO)] + sys.argv[1:]
    runpy.run_path(str(SANTIAGO), run_name="__main__")


if __name__ == "__main__":
    main()
