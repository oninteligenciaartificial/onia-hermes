#!/usr/bin/env python3
"""L02 · QA mirado: hoja de cuadros con guías (y=939 / y=1490 / 80 px derecha), caras YuNet crudo vs final, SCRFD
(mentón y golpe de zoom), texto vs cara cuadro por cuadro, identidad ArcFace en 5 cuadros con el puntaje SIN redondear
contra 0,70 + barrido de los 145 cuadros (final y crudo), recorte 1:1 de la cara en el zoom máximo, contraste bajo el
sello (velo), color, SFX, entradas cuadro a cuadro, sombra de las tarjetas (bordes de alfa 0 y sin escalón en el
degradé, f030 al 100 % y el preview ampliado), golpe de zoom con ECC y specs. Todo a renders/qa/ + renders/qa-frames.jpg.

Uso:  python3 videos/lucia-l02/scripts/qa.py
Refs de identidad: env LUCIA_REFS (default: refs locales de la sesión de L08: R1..R8 identidad, N1..N3 negativos).
"""
import json
import os
import subprocess
import sys

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont

P = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
R = os.path.abspath(os.path.join(P, "../.."))
FINAL = os.path.join(P, "final/l02.mp4")
RAW = os.path.join(P, "raw/l02-calle-kling-1d2b5631.mp4")
QA = os.path.join(P, "renders/qa")
os.makedirs(QA, exist_ok=True)
REFS = os.environ.get("LUCIA_REFS", "/tmp/claude-0/-home-user-onia-hermes/59ef38f5-141c-5055-9631-e06d8af00fa0/scratchpad/l08/qa/refs")
YUNET = os.path.join(R, ".claude/skills/editor-videos/assets/models/face_detection_yunet_2023mar.onnx")
L = json.load(open(os.path.join(P, "scripts/layout.json")))
FPS = L["fps"]
FRANJA = (939, 1490)
out = {}


def frames(path):
    cap = cv2.VideoCapture(path)
    while True:
        ok, img = cap.read()
        if not ok:
            break
        yield img


fin = list(frames(FINAL))
raw = list(frames(RAW))
raw_up = [cv2.resize(x, (1080, 1920), interpolation=cv2.INTER_LANCZOS4) for x in raw]
out["frames"] = {"final": len(fin), "raw": len(raw)}
o = {x["id"]: x for x in L["overlays"]}
textos = [x for x in L["overlays"] if not x.get("decor")]

# ---- 1) hoja de cuadros con guías ----
c1, c2, se, g = o["card1-grabado"], o["card2-ia"], o["sello-seguime"], L["golpe"]
picks = [
    (0, "cuadro 0 (antes de entrar)"),
    (c1["in"], "entra tarjeta 1"),
    ((c1["in"] + c1["out"]) // 2, "mitad tarjeta 1"),
    (c1["out"] - 1, "sale tarjeta 1"),
    (c2["in"], "entra tarjeta 2"),
    ((c2["in"] + c2["out"]) // 2, "mitad tarjeta 2"),
    (c2["out"] - 1, "sale tarjeta 2"),
    (se["in"], "sello 130 % + golpe + velo"),
    (se["in"] + 3, "sello 100 %"),
    (g["frame"] + g["frames"] - 1, "último cuadro del golpe"),
    ((se["in"] + L["frames"]) // 2, "mitad sello"),
    (L["frames"] - 1, "último cuadro"),
]
tw, th = 360, 640
cols = 6
sheet = Image.new("RGB", (cols * tw + (cols - 1) * 8, 2 * (th + 42)), (16, 16, 16))
try:
    font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 15)
except OSError:
    font = ImageFont.load_default()
for i, (f, label) in enumerate(picks):
    im = Image.fromarray(cv2.cvtColor(fin[f], cv2.COLOR_BGR2RGB))
    d = ImageDraw.Draw(im, "RGBA")
    d.rectangle([1000, 1000, 1080, 1920], fill=(255, 0, 0, 50))  # 80 px derecha bajo y=1000
    d.rectangle([0, 1490, 1080, 1920], fill=(255, 0, 0, 40))  # zona UI de Instagram
    for y, c in ((FRANJA[0], (0, 255, 255)), (FRANJA[1], (255, 40, 40))):
        d.line([(0, y), (1080, y)], fill=c, width=4)
    im = im.resize((tw, th), Image.LANCZOS)
    x0, y0 = (i % cols) * (tw + 8), (i // cols) * (th + 42)
    sheet.paste(im, (x0, y0 + 34))
    ImageDraw.Draw(sheet).text((x0 + 4, y0 + 8), f"f{f:03d} {f / FPS:.3f}s · {label}", fill=(255, 255, 255), font=font)
sheet.save(os.path.join(P, "renders/qa-frames.jpg"), quality=90)
out["qa_frames"] = [{"frame": f, "t": round(f / FPS, 3), "que": l} for f, l in picks]


# ---- 2) caras con YuNet: crudo vs final, cuadro por cuadro ----
def yunet_count(imgs):
    det = cv2.FaceDetectorYN.create(YUNET, "", (320, 320), 0.8, 0.3, 5000)
    counts = []
    for img in imgs:
        h, w = img.shape[:2]
        det.setInputSize((w, h))
        _, faces = det.detect(img)
        counts.append(0 if faces is None else len(faces))
    return counts


cr, cf = yunet_count(raw), yunet_count(fin)
out["yunet"] = {"raw_total": int(sum(cr)), "final_total": int(sum(cf)),
                "raw_cuadros_con_1": cr.count(1), "final_cuadros_con_1": cf.count(1),
                "cuadros_distintos": [i for i, (a, b) in enumerate(zip(cr, cf)) if a != b]}

# ---- 3) SCRFD: mentón máx (crudo y final), texto vs cara cuadro por cuadro, golpe de zoom medido ----
sys.path.insert(0, os.path.join(R, "scripts"))
from face_identity_qa import SCRFD, ensure_models  # noqa: E402

det_path, _ = ensure_models()
scrfd = SCRFD(det_path)


def boxes_of(imgs):
    bs = []
    for img in imgs:
        fb, _ = scrfd.detect(img)
        a = (fb[:, 2] - fb[:, 0]) * (fb[:, 3] - fb[:, 1])
        bs.append(fb[int(a.argmax())])
    return np.array(bs)


bf, br = boxes_of(fin), boxes_of(raw_up)
wid = bf[:, 2] - bf[:, 0]
wid_r = br[:, 2] - br[:, 0]
gf = g["frame"]
ratio = wid / wid_r  # el crudo trae su propio movimiento: el golpe se mide contra el crudo, cuadro a cuadro
choques = []
for f in range(len(fin)):
    for x in textos:
        if x["in"] <= f < x["out"]:
            box = x.get("visible_box_130") if x.get("sequence") else x["visible_box"]
            if box[1] < bf[f][3] + 40:  # el texto empieza a menos de 40 px del mentón
                choques.append({"frame": f, "id": x["id"], "texto_y1": box[1], "menton": round(float(bf[f][3]))})
out["scrfd"] = {"menton_max_crudo": int(br[:, 3].max()), "menton_max_final": int(bf[:, 3].max()),
                "en_cuadro_final": int(bf[:, 3].argmax()),
                "texto_a_menos_de_40px_del_menton": choques,
                "ancho_cara_final_sobre_crudo": {str(f): round(float(ratio[f]), 4) for f in range(gf - 3, gf + 8)},
                "golpe_ratio_medido": round(float(ratio[gf:gf + 5].mean() / np.r_[ratio[gf - 3:gf], ratio[gf + 5:gf + 8]].mean()), 4)}

# ---- 4) recorte 1:1 de la cara en el zoom máximo (centro del golpe) ----
fz = gf + 2
x1, y1, x2, y2 = [int(v) for v in bf[fz][:4]]
pad = 60
crop = fin[fz][max(0, y1 - pad):y2 + pad, max(0, x1 - pad):x2 + pad]
cv2.imwrite(os.path.join(QA, f"cara-1a1-f{fz:03d}.png"), crop)
out["recorte_1a1"] = f"renders/qa/cara-1a1-f{fz:03d}.png"

# ---- 5) identidad ArcFace en 5 cuadros del FINAL ----
# El gate (≥ 0,70) se compara con el puntaje SIN redondear. face_identity_qa.py redondea a 3 decimales y así un 0,6996
# pasaba como 0,700 (lo encontró la verificación del 2-oct). El reporte oficial (negativos, leave-one-out) sigue saliendo
# del script; el puntaje del gate se recalcula acá con las MISMAS piezas (SCRFD → cara más grande → ArcFace → coseno
# contra el centroide normalizado de R1..R8), sin redondear.
GATE = 0.70
CINCO = [min(int(round(t * FPS)), len(fin) - 1) for t in (0.5, 1.5, 3.0, 4.5, 6.0)]
tests = {}
for f in CINCO:
    pth = os.path.join(QA, f"L02_{f / FPS:.2f}.png")
    cv2.imwrite(pth, fin[f])
    tests[f"L02_{f / FPS:.2f}"] = pth
refs = {os.path.splitext(n)[0]: os.path.join(REFS, n) for n in sorted(os.listdir(REFS)) if n.startswith("R")}
negs = {os.path.splitext(n)[0]: os.path.join(REFS, n) for n in sorted(os.listdir(REFS)) if n.startswith("N")}
man = os.path.join(QA, "manifest-l02.json")
json.dump({"refs": refs, "tests": tests, "negatives": negs}, open(man, "w"), indent=1)
res = subprocess.run([sys.executable, os.path.join(R, "scripts/face_identity_qa.py"), man], capture_output=True, text=True)
if res.returncode != 0:
    print(res.stderr, file=sys.stderr)
    sys.exit(1)
ident = json.loads(res.stdout)
json.dump(ident, open(os.path.join(QA, "identidad-l02.json"), "w"), ensure_ascii=False, indent=1)

from face_identity_qa import ArcFace, load_image  # noqa: E402

_, rec_path = ensure_models()
arc = ArcFace(rec_path)


def emb(img):
    fb, kp = scrfd.detect(img)
    if len(fb) == 0:
        return None
    i = int(((fb[:, 2] - fb[:, 0]) * (fb[:, 3] - fb[:, 1])).argmax())
    return arc.embed(img, kp[i])


cen = np.mean([emb(load_image(pth)) for pth in refs.values()], 0)
cen /= np.linalg.norm(cen)


def sim(img):
    e = emb(img)
    return None if e is None else float(cen @ e)


barr_fin = [sim(x) for x in fin]  # los 145 cuadros del final
barr_raw = [sim(x) for x in raw]  # y los del crudo, a su resolución (720x1280)
cinco = {f"f{f:03d} ({f / FPS:.2f} s)": round(barr_fin[f], 4) for f in CINCO}
out["identidad"] = {"gate": GATE, "sin_redondear": cinco,
                    "redondeado_por_face_identity_qa": {k: ident["scores"][k]["centroid"] for k in tests},
                    "pasan": f"{sum(barr_fin[f] >= GATE for f in CINCO)}/5",
                    "fallan": [k for k, v in zip(cinco, (barr_fin[f] for f in CINCO)) if v < GATE]}
out["identidad_negativos_max"] = ident["negatives_max"]
out["identidad_refs_loo_min"] = ident["refs_internal"]["leave_one_out_min"]

# ---- 6) specs + audio ----
pr = subprocess.run(["ffprobe", "-v", "error", "-show_entries",
                     "stream=codec_name,profile,width,height,r_frame_rate,nb_frames,pix_fmt,color_space,color_transfer,color_primaries,sample_rate,channels,duration,bit_rate",
                     "-show_entries", "format=duration,size,bit_rate", "-of", "json", FINAL], capture_output=True, text=True)
out["specs"] = json.loads(pr.stdout)
with open(FINAL, "rb") as fh:
    head = fh.read(4096)
out["faststart_moov_antes_de_mdat"] = head.find(b"moov") != -1 and (head.find(b"mdat") == -1 or head.find(b"moov") < head.find(b"mdat"))
eb = subprocess.run(["ffmpeg", "-hide_banner", "-i", FINAL, "-af", "ebur128=peak=true:framelog=quiet", "-f", "null", "-"],
                    capture_output=True, text=True).stderr
I = [l for l in eb.splitlines() if l.strip().startswith("I:")][-1].split()[1]
TP = [l for l in eb.splitlines() if l.strip().startswith("Peak:")][-1].split()[1]
out["audio"] = {"lufs_integrado": float(I), "pico_dbtp": float(TP)}


# ---- 7) color: verdes contra #10C26B y piel contra el crudo, decodificando como bt709 (lo que está etiquetado) ----
def rgb709(path, n, w=1080, h=1920):
    vf = f"select=eq(n\\,{n}),scale={w}:{h}:flags=lanczos:in_color_matrix=bt709:in_range=tv:out_range=pc,format=rgb24"
    b = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-vf", vf, "-frames:v", "1", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
                       capture_output=True).stdout
    return np.frombuffer(b, np.uint8).reshape(h, w, 3).astype(float)


def verdes(img, box):
    x1, y1, x2, y2 = box
    px = img[y1:y2, x1:x2].reshape(-1, 3)
    gr = px[(px[:, 1] > 160) & (px[:, 0] < 70) & (px[:, 2] < 150) & (px[:, 1] - px[:, 0] > 110)]
    return [int(v) for v in np.median(gr, 0)] if len(gr) else None


f_c2 = (c2["in"] + c2["out"]) // 2
f_se = (se["in"] + L["frames"]) // 2
fa2, fas, ra = rgb709(FINAL, f_c2), rgb709(FINAL, f_se), rgb709(RAW, f_c2)
top = slice(0, 900)  # sin overlays ni velo: cara y fondo
mse = ((fa2[top] - ra[top]) ** 2).mean()
out["color"] = {"verde_soy_ia_rgb_mediana": verdes(fa2, c2["visible_box"]),
                "verde_raya_sello_rgb_mediana": verdes(fas, se["visible_box"]), "objetivo": [16, 194, 107],
                "psnr_cara_vs_crudo_db": round(float(10 * np.log10(255 ** 2 / mse)), 2),
                "desvio_medio_rgb": [round(float(v), 2) for v in (fa2[top] - ra[top]).reshape(-1, 3).mean(0)]}

# ---- 8) contraste bajo el sello: fondo (sin la letra) crudo vs final ----
x1, y1, x2, y2 = se["visible_box"]
lum = []
for f in range(se["in"], L["frames"], 7):
    yr = cv2.cvtColor(raw_up[f][y1:y2, x1:x2], cv2.COLOR_BGR2YUV)[:, :, 0]
    yf = cv2.cvtColor(fin[f][y1:y2, x1:x2], cv2.COLOR_BGR2YUV)[:, :, 0]
    fondo = yf[yf < 200]  # lo que no es letra blanca
    lum.append({"frame": f, "crudo_p90": int(np.percentile(yr, 90)), "final_fondo_p90": int(np.percentile(fondo, 90)) if fondo.size else None})
out["fondo_bajo_sello"] = lum

# ---- 9) SFX: dónde suena cada golpe (10 % del pico) contra la entrada visual ----
pcm = subprocess.run(["ffmpeg", "-v", "error", "-i", FINAL, "-f", "f32le", "-ac", "1", "-ar", "48000", "-"], capture_output=True).stdout
y = np.abs(np.frombuffer(pcm, np.float32))
ons, i = [], 0
while i < len(y):
    if y[i] > 0.1 * y.max():
        ons.append(round(i / 48000, 3))
        i += int(0.3 * 48000)
    else:
        i += 1
out["sfx_golpes_s"] = ons
out["entradas_visuales_s"] = sorted(round(x["in"] / FPS, 3) for x in textos)

# ---- 10) lectura: segundos en pantalla vs regla (≥ 0,35 s/palabra + 0,3 s) ----
palabras = {"card1-grabado": 5, "card2-ia": 4, "sello-seguime": 1}
out["lectura"] = {k: {"en_pantalla_s": round((o[k]["out"] - o[k]["in"]) / FPS, 3), "palabras": n,
                      "necesita_s": round(n * 0.35 + 0.3, 2)} for k, n in palabras.items()}

json.dump(out, open(os.path.join(QA, "qa.json"), "w"), ensure_ascii=False, indent=1)
print(json.dumps({k: v for k, v in out.items() if k not in ("specs", "qa_frames")}, ensure_ascii=False, indent=1))
v = [s for s in out["specs"]["streams"] if s["codec_name"] == "h264"][0]
print("specs:", v["width"], v["height"], v["r_frame_rate"], v["nb_frames"], v["pix_fmt"], v["color_space"], v.get("profile"),
      v.get("bit_rate"), "| faststart:", out["faststart_moov_antes_de_mdat"])

# ---- 5b) barrido de identidad: los 145 cuadros, final vs crudo, sin redondear ----
# La edición no genera imagen: si un cuadro da < 0,70 en el final y lo mismo en el crudo, es el clip, no el montaje.
fv = np.array([np.nan if v is None else v for v in barr_fin])
rv = np.array([np.nan if v is None else v for v in barr_raw])
bajo = np.nonzero(fv < GATE)[0]
tramos = []
for i in bajo:
    if tramos and i == tramos[-1][1] + 1:
        tramos[-1][1] = int(i)
    else:
        tramos.append([int(i), int(i)])
c6 = fv[::6]
out["identidad_barrido"] = {
    "final": {"cuadros": int(np.isfinite(fv).sum()), "bajo_070": int((fv < GATE).sum()),
              "min": round(float(np.nanmin(fv)), 4), "min_en": f"f{int(np.nanargmin(fv)):03d}",
              "mediana": round(float(np.nanmedian(fv)), 4)},
    "crudo": {"cuadros": int(np.isfinite(rv).sum()), "bajo_070": int((rv < GATE).sum()),
              "min": round(float(np.nanmin(rv)), 4), "min_en": f"f{int(np.nanargmin(rv)):03d}",
              "mediana": round(float(np.nanmedian(rv)), 4)},
    "cada_6_cuadros_ge_070": f"{int((c6 >= GATE).sum())}/{len(c6)}",
    "tramos_bajo_070": [{"cuadros": f"f{x:03d}-f{y:03d}", "s": f"{x / FPS:.2f}-{(y + 1) / FPS:.2f}", "n": y - x + 1}
                        for x, y in tramos],
    "dif_final_menos_crudo": {"max_abs": round(float(np.nanmax(np.abs(fv - rv))), 4),
                              "media": round(float(np.nanmean(fv - rv)), 4)},
    "por_cuadro": {f"f{i:03d}": [None if np.isnan(fv[i]) else round(float(fv[i]), 4),
                                 None if np.isnan(rv[i]) else round(float(rv[i]), 4)] for i in range(len(fv))},
}
json.dump(out, open(os.path.join(QA, "qa.json"), "w"), ensure_ascii=False, indent=1)
print(json.dumps({k: v for k, v in out["identidad_barrido"].items() if k != "por_cuadro"}, ensure_ascii=False))

# ---- 11) entradas cuadro a cuadro (el bug del 2-oct: setpts truncado corría todo un cuadro antes) ----
# Tarjetas: diferencia media contra el crudo dentro de la caja visible (0 = no hay tarjeta todavía).
# Sello: ancho de la raya verde → paso de escala (130/114/104/100 % = 1,30/1,14/1,04/1,00 × el ancho final).
def dif_caja(f, box):
    x1, y1, x2, y2 = box
    return round(float(np.abs(fin[f][y1:y2, x1:x2].astype(float) - raw_up[f][y1:y2, x1:x2].astype(float)).mean()), 1)


def raya(f):
    hsv = cv2.cvtColor(fin[f], cv2.COLOR_BGR2HSV)
    m = (hsv[:, :, 1] > 150) & (hsv[:, :, 0] > 55) & (hsv[:, :, 0] < 85) & (hsv[:, :, 2] > 150)
    m[:1050] = False
    m[1500:] = False
    xs = np.nonzero(m)[1]
    return int(xs.max() - xs.min()) if len(xs) else 0


ent = {}
for x in (c1, c2):
    ent[x["id"]] = {f"f{f:03d}": dif_caja(f, x["visible_box"]) for f in range(x["in"] - 2, x["in"] + 3)}
anchos = {f: raya(f) for f in range(se["in"] - 1, se["in"] + 5)}
base_w = raya(L["frames"] - 1)
ent["sello_ancho_raya_px"] = {f"f{f:03d}": w for f, w in anchos.items()}
ent["sello_escala_por_cuadro"] = {f"f{f:03d}": round(w / base_w, 3) for f, w in anchos.items() if w}
ent["sello_ultimo_cuadro_px"] = base_w
out["entradas_cuadro_a_cuadro"] = ent
json.dump(out, open(os.path.join(QA, "qa.json"), "w"), ensure_ascii=False, indent=1)
print(json.dumps(ent, ensure_ascii=False))


# ---- 12) sombra de las tarjetas: que se desvanezca, sin borde (verificación del 2-oct) ----
# Antes: la plantilla frase-card dejaba 40u de aire y la sombra baja ~137u → la última fila del PNG tenía alfa 55/255 y
# en el video quedaba una franja gris que terminaba en una línea recta en y=1162 (salto de +31,6 a +33,3 niveles).
# Se mide: (a) alfa de los 4 bordes de cada PNG (tiene que ser 0); (b) oscurecimiento = luma del crudo − luma del
# final, promediado en x 150–930, fila por fila debajo de la tarjeta; el salto 1162→1163 (< 2 niveles) y el mayor
# salto ANÓMALO entre filas seguidas desde 4 px bajo el cuerpo opaco hasta y=1360: |Δ fila − mediana de los Δ de las
# 7 filas vecinas| (< 2 niveles). El Δ a secas no sirve de umbral: pegado a la tarjeta la sombra baja ~2 niveles por
# fila por su propia pendiente (es el degradé, no un borde); un borde es un Δ que no se parece a sus vecinos.
def bordes_alfa(path):
    a = np.array(Image.open(path).convert("RGBA"))[:, :, 3]
    return {"arriba": int(a[0].max()), "abajo": int(a[-1].max()), "izq": int(a[:, 0].max()), "der": int(a[:, -1].max())}


sombra = {"bordes_alfa": {n: bordes_alfa(os.path.join(P, n)) for n in (
    "assets/card1-grabado.png", "assets/card2-ia.png", "assets/sello-seguime.png",
    "assets/canvas/card1-grabado.png", "assets/canvas/card2-ia.png")}}
Y0 = c1["visible_box"][3]  # borde inferior del cuerpo opaco (1121)
filas = {}
for f in (10, 30, 75, 90):
    yr = cv2.cvtColor(raw_up[f], cv2.COLOR_BGR2YUV)[:, :, 0].astype(float)
    yf = cv2.cvtColor(fin[f], cv2.COLOR_BGR2YUV)[:, :, 0].astype(float)
    d = (yr - yf)[:, 150:931].mean(1)  # > 0 = el final está más oscuro que el crudo
    dd = np.diff(d)
    paso = np.abs(dd[Y0 + 4:1361])
    k = int(paso.argmax())
    anom = np.array([abs(dd[i] - np.median(dd[i - 3:i + 4])) for i in range(Y0 + 4, 1361)])
    ka = int(anom.argmax())
    fin_sombra = Y0 + 4 + int(np.nonzero(d[Y0 + 4:1361] < 1.0)[0][0]) if (d[Y0 + 4:1361] < 1.0).any() else None
    filas[f"f{f:03d}"] = {"oscurecimiento_1160_1165": [round(float(v), 2) for v in d[1160:1166]],
                          "salto_1162_1163": round(float(abs(d[1163] - d[1162])), 2),
                          "salto_max_entre_filas": round(float(paso[k]), 2), "en_fila": Y0 + 4 + k,
                          "salto_anomalo_max": round(float(anom[ka]), 2), "anomalo_en_fila": Y0 + 4 + ka,
                          "oscurecimiento_cada_10px_desde_1125": [round(float(v), 1) for v in d[Y0 + 4:1361:10]],
                          "baja_de_1_nivel_en_y": fin_sombra}
sombra["perfil_bajo_tarjeta"] = filas
sombra["pasa"] = all(v == 0 for n, b in sombra["bordes_alfa"].items() if "card" in n for v in b.values()) and \
    all(r["salto_1162_1163"] < 2 and r["salto_anomalo_max"] < 2 for r in filas.values())
# f030 al 100 % (final) y el preview 360p ampliado ×3 en la misma zona, para MIRARLOS
cv2.imwrite(os.path.join(QA, "sombra-f030-1a1.png"), fin[30][840:1360])
PREV = os.path.join(P, "renders/preview-360.mp4")
if os.path.exists(PREV):
    pv = subprocess.run(["ffmpeg", "-v", "error", "-i", PREV, "-vf", "select=eq(n\\,30)", "-frames:v", "1", "-f", "rawvideo",
                         "-pix_fmt", "bgr24", "-"], capture_output=True).stdout
    pv = np.frombuffer(pv, np.uint8).reshape(640, 360, 3)
    cv2.imwrite(os.path.join(QA, "preview-f030-zoom.png"),
                cv2.resize(pv[280:454], (1080, 522), interpolation=cv2.INTER_NEAREST))
out["sombra_tarjetas"] = sombra
json.dump(out, open(os.path.join(QA, "qa.json"), "w"), ensure_ascii=False, indent=1)
print(json.dumps(sombra, ensure_ascii=False))


# ---- 13) golpe de zoom medido con ECC contra el crudo (afín, zona sin overlays: y < 900) ----
def ecc_escala(f):
    a = cv2.cvtColor(cv2.resize(raw_up[f][:900], (540, 450)), cv2.COLOR_BGR2GRAY).astype(np.float32)
    b = cv2.cvtColor(cv2.resize(fin[f][:900], (540, 450)), cv2.COLOR_BGR2GRAY).astype(np.float32)
    w = np.eye(2, 3, dtype=np.float32)
    _, w = cv2.findTransformECC(a, b, w, cv2.MOTION_AFFINE, (cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_COUNT, 200, 1e-6), None, 5)
    return round(float(np.sqrt(abs(np.linalg.det(w[:, :2])))), 4)


out["golpe_ecc"] = {f"f{f:03d}": ecc_escala(f) for f in range(gf - 2, gf + 7)}
json.dump(out, open(os.path.join(QA, "qa.json"), "w"), ensure_ascii=False, indent=1)
print(json.dumps(out["golpe_ecc"]))


# ---- 14) hoja de caras de identidad: los 5 cuadros del gate + el mínimo del barrido, con su puntaje ----
ids = sorted(set(CINCO + [int(np.nanargmin(fv))]))
hoja = Image.new("RGB", (len(ids) * 310 - 10, 340), (20, 20, 20))
dh = ImageDraw.Draw(hoja)
for i, f in enumerate(ids):
    cara = cv2.cvtColor(fin[f][150:1000, 190:1040], cv2.COLOR_BGR2RGB)
    hoja.paste(Image.fromarray(cara).resize((300, 300), Image.LANCZOS), (i * 310, 36))
    dh.text((i * 310 + 4, 8), f"f{f:03d} {f / FPS:.2f}s id {fv[f]:.4f}" + (" <0,70" if fv[f] < GATE else ""),
            fill=(255, 255, 255), font=font)
hoja.save(os.path.join(QA, "caras-identidad.jpg"), quality=90)
