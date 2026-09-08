"""Barre un video y puntua CADA frame como candidato a miniatura.

No elige: ORDENA. La eleccion la hace Sergio Urcullo mirando la hoja de contactos, porque
es su cara. Lo medible:

  · nitidez  -- varianza del laplaciano sobre el recorte de la cara. Descarta el motion
                blur de cuando gesticula, que a tamaño de miniatura se ve mal.
  · frontal  -- ojos a la misma altura y nariz centrada entre ellos. Una cabeza girada o
                inclinada no funciona en una miniatura.
  · sonrisa  -- comisuras ELEVADAS respecto a la nariz.
  · boca cerrada -- fraccion de pixeles oscuros en la region de la boca.

⚠ El ancho de boca NO mide sonrisa: mide que esta HABLANDO. Primer intento usaba
ancho_boca/dist_ojos y el top 12 salio entero con la boca abierta a media palabra, que
para una miniatura no sirve. En un video hablado casi todo el material es boca abierta;
lo escaso son las pausas. Por eso el peso fuerte va en CERRAR la boca, no en estirarla.

Detector: YuNet (el mismo ONNX que usa blur-faces.mjs). 5 landmarks: ojo izq, ojo der,
nariz, comisura izq, comisura der.
"""
import sys, json, cv2, numpy as np

video, t0, t1, paso, out = sys.argv[1], float(sys.argv[2]), float(sys.argv[3]), int(sys.argv[4]), sys.argv[5]
MODEL = "../../.claude/skills/editor-videos/assets/models/face_detection_yunet_2023mar.onnx"

cap = cv2.VideoCapture(video)
fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
cap.set(cv2.CAP_PROP_POS_FRAMES, int(t0 * fps))
W = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)); H = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
det = cv2.FaceDetectorYN.create(MODEL, "", (W, H), 0.75, 0.3, 5000)

filas, n = [], 0
while True:
    ok, frame = cap.read()
    if not ok: break
    t = t0 + n / fps
    if t > t1: break
    if n % paso == 0:
        _, caras = det.detect(frame)
        if caras is not None and len(caras):
            c = max(caras, key=lambda f: f[2] * f[3])
            x, y, w, h = [int(v) for v in c[:4]]
            oi, od, nz, bi, bd = [(float(c[4 + 2*i]), float(c[5 + 2*i])) for i in range(5)]
            roi = frame[max(0, y):y + h, max(0, x):x + w]
            if roi.size:
                gris = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
                nitidez = float(cv2.Laplacian(gris, cv2.CV_64F).var())
                dojos = float(np.hypot(od[0] - oi[0], od[1] - oi[1])) or 1.0

                # sonrisa: comisuras arriba respecto a la nariz (normalizado por dist. ojos)
                ymed_boca = (bi[1] + bd[1]) / 2
                sonrisa = -(ymed_boca - nz[1]) / dojos            # menos distancia = mas sonrisa

                # boca abierta: banda oscura (interior) en el rectangulo de la boca
                bw = float(np.hypot(bd[0] - bi[0], bd[1] - bi[1]))
                mx, my = int((bi[0] + bd[0]) / 2), int(ymed_boca)
                bx0, bx1 = max(0, int(mx - bw * .62)), min(W, int(mx + bw * .62))
                by0, by1 = max(0, int(my - bw * .40)), min(H, int(my + bw * .48))
                mroi = cv2.cvtColor(frame[by0:by1, bx0:bx1], cv2.COLOR_BGR2GRAY) if by1 > by0 and bx1 > bx0 else None
                if mroi is not None and mroi.size:
                    umbral = np.percentile(mroi, 22)
                    apertura = float((mroi < max(45.0, umbral * 0.72)).mean())
                else:
                    apertura = 0.5

                nivel = abs(od[1] - oi[1]) / dojos
                centro = abs(nz[0] - (oi[0] + od[0]) / 2) / dojos
                filas.append({"t": round(t, 2), "w": w, "h": h,
                              "nitidez": round(nitidez, 1), "sonrisa": round(sonrisa, 4),
                              "apertura": round(apertura, 4), "nivel": round(nivel, 3),
                              "centro": round(centro, 3), "score_det": round(float(c[-1]), 3)})
    n += 1
cap.release()

if filas:
    def nz_(v):
        v = np.asarray(v, float); r = v.max() - v.min()
        return (v - v.min()) / r if r > 1e-9 else np.zeros_like(v)
    n_nit = nz_([f["nitidez"] for f in filas])
    n_son = nz_([f["sonrisa"] for f in filas])
    for i, f in enumerate(filas):
        pen_pose = min(1.0, f["nivel"] * 5.0) * 0.34 + min(1.0, f["centro"] * 4.5) * 0.24
        pen_boca = min(1.0, max(0.0, f["apertura"] - 0.10) / 0.30) * 0.62   # el peso fuerte
        f["score"] = round(float(0.30 * n_son[i] + 0.26 * n_nit[i] + 0.62 - pen_pose - pen_boca), 4)
    filas.sort(key=lambda f: -f["score"])
json.dump(filas, open(out, "w"), indent=1)
print(f"{len(filas)} frames con cara. Top 8:")
for f in filas[:8]:
    print(f"  t={f['t']:7.2f} score {f['score']:.3f} sonrisa {f['sonrisa']:+.3f} apertura {f['apertura']:.3f} nitidez {f['nitidez']:6.1f}")
