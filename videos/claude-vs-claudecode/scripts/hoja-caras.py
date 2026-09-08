"""Hoja de contactos de los mejores candidatos, dedupeados: un frame por MOMENTO.
Sin dedup el top se llena de 6 frames del mismo gesto separados por 0.1s."""
import json, subprocess, os, sys
cands = json.load(open("renders/candidatos.json"))
elegidos, N = [], int(sys.argv[1]) if len(sys.argv) > 1 else 12
for c in cands:
    if any(e["video"] == c["video"] and abs(e["t"] - c["t"]) < 1.6 for e in elegidos):
        continue
    elegidos.append(c)
    if len(elegidos) >= N: break

os.makedirs("renders/caras", exist_ok=True)
for i, c in enumerate(elegidos):
    # recorte generoso alrededor de la cara para juzgar tambien hombros y encuadre
    subprocess.run(["ffmpeg", "-v", "error", "-ss", str(c["t"]), "-i", c["video"], "-frames:v", "1",
                    "-vf", f"crop={c['w']*3}:{c['h']*3}:{max(0,c.get('x',0))}:0,scale=300:-1"
                           if False else f"scale=300:-1,crop=300:169",
                    "-y", f"renders/caras/{i:02d}.png"], check=False)
# recorte real centrado en la cara: se rehace con las coordenadas de la deteccion
import cv2
for i, c in enumerate(elegidos):
    cap = cv2.VideoCapture(c["video"]); fps = cap.get(cv2.CAP_PROP_FPS) or 30
    cap.set(cv2.CAP_PROP_POS_FRAMES, int(c["t"] * fps)); ok, fr = cap.read(); cap.release()
    if not ok: continue
    H, W = fr.shape[:2]
    det = cv2.FaceDetectorYN.create("../../.claude/skills/editor-videos/assets/models/face_detection_yunet_2023mar.onnx",
                                    "", (W, H), 0.7, 0.3, 5000)
    _, cs = det.detect(fr)
    if cs is None or not len(cs): continue
    f = max(cs, key=lambda z: z[2] * z[3]); x, y, w, h = [int(v) for v in f[:4]]
    cx, cy = x + w // 2, y + h // 2
    lado = int(w * 2.3)
    x0, y0 = max(0, cx - lado // 2), max(0, cy - int(lado * 0.42))
    rec = fr[y0:min(H, y0 + lado), x0:min(W, x0 + lado)]
    rec = cv2.resize(rec, (320, 320))
    cv2.putText(rec, f"{i}", (10, 34), cv2.FONT_HERSHEY_SIMPLEX, 1.1, (0, 0, 0), 6)
    cv2.putText(rec, f"{i}", (10, 34), cv2.FONT_HERSHEY_SIMPLEX, 1.1, (255, 255, 255), 2)
    cv2.imwrite(f"renders/caras/{i:02d}.png", rec)
json.dump(elegidos, open("renders/elegidos.json", "w"), indent=1)
for i, c in enumerate(elegidos):
    print(f"  {i:2d}  {os.path.basename(c['video'])[:34]:34s} t={c['t']:7.2f}  score {c['score']:.3f}")
