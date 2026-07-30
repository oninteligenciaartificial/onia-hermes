#!/usr/bin/env python3
"""editor-videos — DETECTOR de caras (mitad Python de blur-faces.mjs).

ffmpeg NO detecta caras: solo sabe difuminar un rectangulo. Este script pone los
rectangulos. Muestrea 1 de cada N frames, corre el detector y emite JSON; el
seguimiento, el relleno y el ffmpeg los hace blur-faces.mjs.

Detector: YuNet (cv2.FaceDetectorYN, modelo ONNX de ~230 KB del opencv_zoo oficial).
Se eligio sobre haar cascade porque:
  · OpenCV 5 ELIMINO cv2.CascadeClassifier y dnn.readNetFromCaffe -> haar y el
    res10 SSD ya no existen en la version instalada (5.0.0). YuNet si.
  · Es una CNN moderna: mucho mejor recall en perfil, cara girada y poca luz,
    justo donde haar se cae y deja una cara DESTAPADA (el fallo caro aca).
  · 230 KB y corre en CPU en tiempo real. Costo cero, todo local.
Fallback: si la instalacion de OpenCV todavia trae CascadeClassifier (4.x),
--detector haar funciona como red de seguridad. No es la ruta recomendada.

Uso:
  python blur-faces-detect.py --video in.mp4 --model models/face_detection_yunet_2023mar.onnx \\
      [--every 5] [--score 0.6] [--max-side 640] [--detector yunet|haar] [--out det.json]

Salida (stdout o --out): JSON
  { "video", "width", "height", "fps", "frame_count", "every", "detector", "score_min",
    "sampled": [ { "n": <frame>, "t": <seg>, "faces": [ {"x","y","w","h","score"} ] } ],
    "stats": { "sampled_frames", "frames_with_face", "frames_without_face", "total_faces" } }

Determinista: sin random, sin timestamps en la salida.
"""

import argparse
import json
import sys

try:
    import cv2
except ImportError:
    sys.exit(
        "blur-faces-detect: falta OpenCV.\n"
        "  Instalar (gratis, local):  python -m pip install opencv-python"
    )


def build_yunet(model, score, size):
    if not hasattr(cv2, "FaceDetectorYN_create"):
        sys.exit(
            "blur-faces-detect: esta build de OpenCV no tiene FaceDetectorYN "
            "(hace falta >= 4.5.4). Actualiza opencv-python o usa --detector haar."
        )
    # nms=0.3, topK=5000: valores del ejemplo oficial del opencv_zoo.
    return cv2.FaceDetectorYN_create(model, "", size, score, 0.3, 5000)


def build_haar():
    if not hasattr(cv2, "CascadeClassifier"):
        sys.exit(
            "blur-faces-detect: esta build de OpenCV (>=5.0) ELIMINO CascadeClassifier.\n"
            "  Usa --detector yunet (recomendado igual)."
        )
    base = cv2.data.haarcascades
    fronts = cv2.CascadeClassifier(base + "haarcascade_frontalface_default.xml")
    prof = cv2.CascadeClassifier(base + "haarcascade_profileface.xml")
    if fronts.empty():
        sys.exit(f"blur-faces-detect: no pude cargar los cascades haar desde {base}")
    return fronts, prof


def main():
    ap = argparse.ArgumentParser(add_help=True)
    ap.add_argument("--video", required=True)
    ap.add_argument("--model", default=None, help="ONNX de YuNet (obligatorio con --detector yunet)")
    ap.add_argument("--every", type=int, default=5, help="detectar 1 de cada N frames")
    ap.add_argument("--score", type=float, default=0.6, help="confianza minima (0..1)")
    ap.add_argument("--max-side", type=int, default=640, help="lado mayor para detectar (0 = full res)")
    ap.add_argument("--detector", choices=["yunet", "haar"], default="yunet")
    ap.add_argument("--out", default=None)
    args = ap.parse_args()

    if args.every < 1:
        sys.exit("blur-faces-detect: --every debe ser >= 1")

    cap = cv2.VideoCapture(args.video)
    if not cap.isOpened():
        sys.exit(f"blur-faces-detect: no pude abrir el video: {args.video}")

    W = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    H = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = cap.get(cv2.CAP_PROP_FPS) or 0.0
    total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT) or 0)
    if not W or not H:
        sys.exit("blur-faces-detect: no pude leer el tamano del video")
    if fps <= 0:
        fps = 30.0

    # Escala de deteccion: bajar la resolucion acelera mucho y YuNet sigue viendo
    # caras chicas. Las cajas se re-escalan a coordenadas del video original.
    scale = 1.0
    if args.max_side and max(W, H) > args.max_side:
        scale = args.max_side / float(max(W, H))
    dw, dh = max(1, int(round(W * scale))), max(1, int(round(H * scale)))

    if args.detector == "yunet":
        if not args.model:
            sys.exit("blur-faces-detect: --detector yunet necesita --model <archivo.onnx>")
        det = build_yunet(args.model, args.score, (dw, dh))
        det.setInputSize((dw, dh))
    else:
        fronts, prof = build_haar()

    sampled = []
    frames_with = 0
    total_faces = 0
    n = -1

    while True:
        ok, frame = cap.read()
        if not ok:
            break
        n += 1
        if n % args.every:
            continue

        small = frame if scale == 1.0 else cv2.resize(frame, (dw, dh), interpolation=cv2.INTER_AREA)
        faces = []

        if args.detector == "yunet":
            _, raw = det.detect(small)
            if raw is not None:
                # YuNet: [x, y, w, h, 5x landmarks(x,y)..., score] -> 15 columnas.
                for f in raw:
                    sc = float(f[-1])
                    if sc < args.score:
                        continue
                    faces.append((float(f[0]), float(f[1]), float(f[2]), float(f[3]), sc))
        else:
            gray = cv2.cvtColor(small, cv2.COLOR_BGR2GRAY)
            gray = cv2.equalizeHist(gray)
            boxes = list(fronts.detectMultiScale(gray, 1.1, 5, minSize=(24, 24)))
            if not prof.empty():
                # Perfil en los dos sentidos: el cascade solo mira a un lado, asi que
                # se corre tambien sobre el espejo y se desespeja la coordenada x.
                boxes += list(prof.detectMultiScale(gray, 1.1, 5, minSize=(24, 24)))
                flipped = cv2.flip(gray, 1)
                for (x, y, w, h) in prof.detectMultiScale(flipped, 1.1, 5, minSize=(24, 24)):
                    boxes.append((dw - x - w, y, w, h))
            for (x, y, w, h) in boxes:
                # haar no da confianza: se reporta 1.0 y se confia en el padding.
                faces.append((float(x), float(y), float(w), float(h), 1.0))

        out_faces = []
        for (x, y, w, h, sc) in faces:
            out_faces.append(
                {
                    "x": round(x / scale, 2),
                    "y": round(y / scale, 2),
                    "w": round(w / scale, 2),
                    "h": round(h / scale, 2),
                    "score": round(sc, 4),
                }
            )
        if out_faces:
            frames_with += 1
            total_faces += len(out_faces)
        sampled.append({"n": n, "t": round(n / fps, 4), "faces": out_faces})

    cap.release()

    report = {
        "video": args.video,
        "width": W,
        "height": H,
        "fps": round(fps, 6),
        "frame_count": total if total > 0 else n + 1,
        "every": args.every,
        "detector": args.detector,
        "score_min": args.score,
        "detect_scale": round(scale, 4),
        "sampled": sampled,
        "stats": {
            "sampled_frames": len(sampled),
            "frames_with_face": frames_with,
            "frames_without_face": len(sampled) - frames_with,
            "total_faces": total_faces,
        },
    }
    text = json.dumps(report, ensure_ascii=False)
    if args.out:
        with open(args.out, "w", encoding="utf-8") as fh:
            fh.write(text)
        print(
            f"blur-faces-detect: {frames_with}/{len(sampled)} frames muestreados con cara "
            f"({total_faces} detecciones) -> {args.out}",
            file=sys.stderr,
        )
    else:
        sys.stdout.write(text)


if __name__ == "__main__":
    main()
