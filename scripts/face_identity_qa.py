#!/usr/bin/env python3
"""QA de identidad facial: ¿es la MISMA cara que las referencias?

Mide cada imagen contra un set de referencia con insightface `buffalo_l`
(detector SCRFD det_10g + ArcFace w600k_r50), que es la métrica con la que
se reporta preservación de identidad en generación de personajes
(InstantID, PuLID, PhotoMaker). Reproduce el preprocesado oficial de
insightface (SCRFD 640, norm_crop 112 con la plantilla ArcFace), sin
depender del paquete `insightface` (que compila C y arrastra media PyPI).

Mide IDENTIDAD, no belleza ni realismo de piel: eso se sigue MIRANDO.

Uso (máquina con internet o `sandbox_exec` de Higgsfield):
    pip install opencv-python-headless onnx onnxruntime numpy
    python3 face_identity_qa.py manifest.json > resultado.json

manifest.json:
    {"refs":      {"R1": "https://...png", ...},   # la identidad fijada
     "tests":     {"T201": "https://...", ...},    # lo que se evalúa
     "negatives": {"N1": "https://...", ...}}      # otras caras: calibran el piso

Salida: JSON con consistencia interna de las refs, puntaje por imagen
(coseno contra el centroide de las refs) y un veredicto relativo a los
controles negativos. Los valores y (mean, std) salen del propio modelo.
"""
import io
import json
import os
import sys
import urllib.request
import zipfile

import cv2
import numpy as np
import onnxruntime as ort

MODEL_DIR = os.environ.get("FACE_QA_MODELS", os.path.expanduser("~/.face_qa/buffalo_l"))
BUFFALO_L = "https://github.com/deepinsight/insightface/releases/download/v0.7/buffalo_l.zip"
ARCFACE_DST = np.array(
    [[38.2946, 51.6963], [73.5318, 51.5014], [56.0252, 71.7366],
     [41.5493, 92.3655], [70.7299, 92.2041]], dtype=np.float32)


def ensure_models():
    det = os.path.join(MODEL_DIR, "det_10g.onnx")
    rec = os.path.join(MODEL_DIR, "w600k_r50.onnx")
    if not (os.path.exists(det) and os.path.exists(rec)):
        os.makedirs(MODEL_DIR, exist_ok=True)
        blob = urllib.request.urlopen(BUFFALO_L, timeout=600).read()
        with zipfile.ZipFile(io.BytesIO(blob)) as z:
            for name in z.namelist():
                base = os.path.basename(name)
                if base in ("det_10g.onnx", "w600k_r50.onnx"):
                    with open(os.path.join(MODEL_DIR, base), "wb") as f:
                        f.write(z.read(name))
    return det, rec


def load_image(src):
    if src.startswith("http"):
        req = urllib.request.Request(src, headers={"User-Agent": "onia-face-qa/1"})
        data = urllib.request.urlopen(req, timeout=120).read()
    else:
        with open(src, "rb") as f:
            data = f.read()
    img = cv2.imdecode(np.frombuffer(data, np.uint8), cv2.IMREAD_COLOR)
    if img is None:
        raise ValueError(f"no se pudo decodificar {src}")
    return img


def nms(boxes, thresh):
    x1, y1, x2, y2 = boxes.T
    areas = (x2 - x1 + 1) * (y2 - y1 + 1)
    order = np.arange(len(boxes))
    keep = []
    while order.size:
        i = order[0]
        keep.append(i)
        xx1 = np.maximum(x1[i], x1[order[1:]])
        yy1 = np.maximum(y1[i], y1[order[1:]])
        xx2 = np.minimum(x2[i], x2[order[1:]])
        yy2 = np.minimum(y2[i], y2[order[1:]])
        inter = np.maximum(0, xx2 - xx1 + 1) * np.maximum(0, yy2 - yy1 + 1)
        ovr = inter / (areas[i] + areas[order[1:]] - inter)
        order = order[np.where(ovr <= thresh)[0] + 1]
    return keep


class SCRFD:
    """Port 1:1 de insightface/model_zoo/scrfd.py para det_10g (9 salidas, con kps)."""

    def __init__(self, path):
        self.sess = ort.InferenceSession(path, providers=["CPUExecutionProvider"])
        self.inp = self.sess.get_inputs()[0].name
        outs = self.sess.get_outputs()
        if len(outs) != 9:
            raise ValueError(f"se esperaba SCRFD con 9 salidas, hay {len(outs)}")
        self.names = [o.name for o in outs]
        self.batched = len(outs[0].shape) == 3
        self.strides = (8, 16, 32)
        self.anchors = 2
        self.cache = {}

    def detect(self, img, size=640, thresh=0.5, nms_thresh=0.4):
        h, w = img.shape[:2]
        if h / w > 1.0:
            nh, nw = size, int(size * w / h)
        else:
            nw, nh = size, int(size * h / w)
        scale = nh / h
        canvas = np.zeros((size, size, 3), np.uint8)
        canvas[:nh, :nw] = cv2.resize(img, (nw, nh))
        blob = cv2.dnn.blobFromImage(canvas, 1.0 / 128, (size, size), (127.5, 127.5, 127.5), swapRB=True)
        out = self.sess.run(self.names, {self.inp: blob})
        scores, boxes, kpss = [], [], []
        for i, stride in enumerate(self.strides):
            sc, bb, kp = out[i], out[i + 3], out[i + 6]
            if self.batched:
                sc, bb, kp = sc[0], bb[0], kp[0]
            bb = bb * stride
            kp = kp * stride
            fh = fw = size // stride
            key = (fh, fw, stride)
            if key not in self.cache:
                centers = np.stack(np.mgrid[:fh, :fw][::-1], axis=-1).astype(np.float32)
                centers = (centers * stride).reshape(-1, 2)
                self.cache[key] = np.stack([centers] * self.anchors, axis=1).reshape(-1, 2)
            c = self.cache[key]
            pos = np.where(sc >= thresh)[0]
            b = np.stack([c[:, 0] - bb[:, 0], c[:, 1] - bb[:, 1],
                          c[:, 0] + bb[:, 2], c[:, 1] + bb[:, 3]], axis=-1)
            k = np.stack([c[:, j % 2] + kp[:, j] for j in range(10)], axis=-1).reshape(-1, 5, 2)
            scores.append(sc[pos].reshape(-1))
            boxes.append(b[pos])
            kpss.append(k[pos])
        s = np.concatenate(scores)
        if s.size == 0:
            return np.zeros((0, 5), np.float32), np.zeros((0, 5, 2), np.float32)
        b = np.concatenate(boxes) / scale
        k = np.concatenate(kpss) / scale
        order = s.argsort()[::-1]
        s, b, k = s[order], b[order], k[order]
        keep = nms(b, nms_thresh)
        return np.hstack([b[keep], s[keep, None]]), k[keep]


def similarity_transform(src, dst):
    """Umeyama sin reflexión: la misma estimación que skimage SimilarityTransform."""
    n = src.shape[0]
    mu_s, mu_d = src.mean(0), dst.mean(0)
    sc, dc = src - mu_s, dst - mu_d
    a = dc.T @ sc / n
    d = np.ones(2)
    if np.linalg.det(a) < 0:
        d[1] = -1
    u, s, vt = np.linalg.svd(a)
    r = u @ np.diag(d) @ vt
    scale = (s * d).sum() / ((sc ** 2).sum() / n)
    m = np.zeros((2, 3), np.float64)
    m[:, :2] = scale * r
    m[:, 2] = mu_d - scale * (r @ mu_s)
    return m


class ArcFace:
    def __init__(self, path):
        self.sess = ort.InferenceSession(path, providers=["CPUExecutionProvider"])
        self.inp = self.sess.get_inputs()[0].name
        # Misma regla que insightface/model_zoo/arcface_onnx.py para (mean, std).
        self.mean, self.std = 127.5, 127.5
        try:
            import onnx
            nodes = [n.name for n in onnx.load(path).graph.node[:8]]
            sub = any(n.startswith(("Sub", "_minus")) for n in nodes)
            mul = any(n.startswith(("Mul", "_mul")) for n in nodes)
            if sub and mul:
                self.mean, self.std = 0.0, 1.0
        except ImportError:
            pass

    def embed(self, img, kps):
        aligned = cv2.warpAffine(img, similarity_transform(kps, ARCFACE_DST), (112, 112), borderValue=0.0)
        blob = cv2.dnn.blobFromImage(aligned, 1.0 / self.std, (112, 112), (self.mean,) * 3, swapRB=True)
        e = self.sess.run(None, {self.inp: blob})[0][0]
        return e / np.linalg.norm(e)


def main(manifest_path):
    with open(manifest_path) as f:
        manifest = json.load(f)
    det_path, rec_path = ensure_models()
    det, rec = SCRFD(det_path), ArcFace(rec_path)
    info, emb = {}, {}
    for group in ("refs", "tests", "negatives"):
        for label, src in manifest.get(group, {}).items():
            try:
                img = load_image(src)
                faces, kpss = det.detect(img)
                if len(faces) == 0:
                    info[label] = {"group": group, "faces": 0}
                    continue
                areas = (faces[:, 2] - faces[:, 0]) * (faces[:, 3] - faces[:, 1])
                i = int(areas.argmax())  # el sujeto principal = la cara más grande
                e = rec.embed(img, kpss[i])
                flip = cv2.flip(img, 1)
                ff, fk = det.detect(flip)
                flip_self = None
                if len(ff):
                    j = int(((ff[:, 2] - ff[:, 0]) * (ff[:, 3] - ff[:, 1])).argmax())
                    flip_self = round(float(e @ rec.embed(flip, fk[j])), 3)
                emb[label] = e
                info[label] = {"group": group, "faces": int(len(faces)),
                               "det_score": round(float(faces[i, 4]), 3),
                               "face_px": int(faces[i, 2] - faces[i, 0]),
                               "img": f"{img.shape[1]}x{img.shape[0]}",
                               "flip_self": flip_self}
            except Exception as exc:  # una imagen rota no tumba el resto
                info[label] = {"group": group, "error": str(exc)[:200]}

    refs = [k for k in manifest.get("refs", {}) if k in emb]
    if len(refs) < 2:
        raise SystemExit("hacen falta al menos 2 referencias con cara detectada")
    R = np.stack([emb[k] for k in refs])
    pair = R @ R.T
    off = pair[~np.eye(len(refs), dtype=bool)]

    def score(label):
        # Una referencia se mide contra las DEMÁS (leave-one-out): contra sí misma daría 1.
        others = np.stack([emb[r] for r in refs if r != label])
        e = emb[label]
        sims = others @ e
        centroid = others.mean(0)
        centroid /= np.linalg.norm(centroid)
        return {"centroid": round(float(centroid @ e), 3), "mean_ref": round(float(sims.mean()), 3),
                "min_ref": round(float(sims.min()), 3), "max_ref": round(float(sims.max()), 3)}

    scores = {k: score(k) for k in emb}
    neg = [scores[k]["centroid"] for k in manifest.get("negatives", {}) if k in scores]
    ref_c = [scores[k]["centroid"] for k in refs]  # leave-one-out
    out = {
        "model": "insightface buffalo_l: SCRFD det_10g + ArcFace w600k_r50",
        "arcface_mean_std": [rec.mean, rec.std],
        "refs_internal": {"pairwise_mean": round(float(off.mean()), 3),
                          "pairwise_min": round(float(off.min()), 3),
                          "leave_one_out_min": round(min(ref_c), 3),
                          "matrix": {a: {b: round(float(pair[i, j]), 3) for j, b in enumerate(refs)}
                                     for i, a in enumerate(refs)}},
        "negatives_max": round(max(neg), 3) if neg else None,
        "images": info,
        "scores": scores,
    }
    json.dump(out, sys.stdout, ensure_ascii=False, indent=1)


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "manifest.json")
