# -*- coding: utf-8 -*-
"""L08 QA de las 3 correcciones del 2-oct, MEDIDAS sobre final/l08.mp4 (no sobre el plan).

1. Fila 3 (chips «Confirma» / «Cancela»): opacidad cuadro a cuadro.
   p = opacidad del panel, de una zona SOLO tarjeta:   F = p·K + (1−p)·C
   a = opacidad de la fila 3, en los píxeles del texto: F = a·Wt + (1−a)·U,  U = p·K + (1−p)·C
   C = renders/qa/clean.mp4 (b-roll + zoom + velo, `node scripts/build.mjs --clean`), K = tarjeta (cuadro antes de la
   fila), Wt = texto al 100 % (cuadro de referencia con todo quieto). Además: cuadros sin ningún apoyo entre el panel y
   el sello (final − clean) y alto real de los chips en pantalla.
2. Final sin congelado: diferencia media entre cuadros consecutivos ARRIBA del texto (y < 1150) en los últimos cuadros,
   y crecimiento / corrimiento de la caja SCRFD (renders/qa/caras-final.json).
3. Pings: dónde salta el golpe en el final (envolvente con pasaaltos de 1,8 kHz, ventanas de 5 ms) contra el «at» del
   plan, ±20 ms. Los 4 efectos (pops incluidos) y su nivel contra la voz: scripts/qa-sfx.py.
Salida: renders/qa/correcciones.json + resumen en pantalla.  Uso: python3 scripts/qa-correcciones.py
"""
import json, os, subprocess
import cv2
import numpy as np
from PIL import Image
from scipy.signal import butter, sosfiltfilt

P = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
FPS, SR = 24, 48000
plan = {o["asset"].split("/")[-1]: o for o in json.load(open(f"{P}/scripts/sync-plan.json"))["overlays"]}
sfxplan = json.load(open(f"{P}/scripts/sfx-plan.json"))["sfx"]


def frames(path):
    cap = cv2.VideoCapture(path)
    out = []
    while True:
        ok, im = cap.read()
        if not ok:
            break
        out.append(cv2.cvtColor(im, cv2.COLOR_BGR2GRAY).astype(np.float32))
    return out


F = frames(f"{P}/final/l08.mp4")
C = frames(f"{P}/renders/qa/clean.mp4")
assert len(F) == len(C), (len(F), len(C))
res = {"cuadros": len(F), "duracion_s": len(F) / FPS}

# ---- 1. fila 3 -----------------------------------------------------------------------------------------
# geometría = la de build.mjs: panel PNG @2x × 0,45, x = (1080 − w)/2, y = PANEL_TOP − 80·0,45
import re
PANEL_TOP = int(re.search(r"const PANEL_TOP = (\d+);", open(f"{P}/scripts/build.mjs", encoding="utf8").read()).group(1))
S, X0, Y0 = 0.45, (1080 - 2320 * 0.45) / 2, PANEL_TOP - 80 * 0.45
r3 = np.array(Image.open(f"{P}/assets/panel-r3.png").convert("RGBA")).astype(np.float32)
wt = (r3[..., 0] > 220) & (r3[..., 1] > 220) & (r3[..., 2] > 220) & (r3[..., 3] > 240)  # letras blancas sólidas
m = cv2.resize(wt.astype(np.uint8), (round(r3.shape[1] * S), round(r3.shape[0] * S)), interpolation=cv2.INTER_AREA)
m = cv2.erode((m > 0).astype(np.uint8), np.ones((2, 2), np.uint8))
mask = np.zeros((1920, 1080), bool)
ys, xs = np.nonzero(m)
mask[(ys + round(Y0)).clip(0, 1919), (xs + round(X0)).clip(0, 1079)] = True
ys_al, _ = np.nonzero(r3[..., 3] > 200)
chip_top, chip_bot = Y0 + ys_al.min() * S, Y0 + ys_al.max() * S
txt_top, txt_bot = Y0 + np.nonzero(wt)[0].min() * S, Y0 + np.nonzero(wt)[0].max() * S
# zona SOLO tarjeta: a la derecha de los chips en la fila 3 (sin contenido de r3)
card = np.zeros_like(mask)
card[round(Y0 + 560 * S):round(Y0 + 640 * S), round(X0 + 1500 * S):round(X0 + 2000 * S)] = True

f_in = int(np.ceil(plan["panel-r3.png"]["start"] * FPS - 1e-6))  # primer cuadro de la fila 3
K_m = F[f_in - 1][mask]          # tarjeta debajo del texto (panel al 100 %, fila todavía no)
K_c = F[f_in - 1][card]
REF = 180                        # 7,5 s: panel y fila quietos al 100 %
Wt = F[REF][mask]
op = []
for n in range(f_in - 6, min(len(F), 200)):
    Cc, Cm = C[n][card], C[n][mask]
    dc = Cc - K_c
    sel = np.abs(dc) > 30
    p = float(np.clip(np.median((Cc[sel] - F[n][card][sel]) / dc[sel]), 0, 1)) if sel.sum() > 50 else float("nan")
    U = p * K_m + (1 - p) * Cm
    d = Wt - U
    s2 = np.abs(d) > 40
    a = float(np.clip(np.median((F[n][mask][s2] - U[s2]) / d[s2]), 0, 1)) if s2.sum() > 50 else 0.0
    op.append({"n": n, "t": round(n / FPS, 3), "panel": round(p, 3), "fila3": round(a, 3)})
full = [o["n"] for o in op if o["fila3"] >= 0.98]
half = [o["n"] for o in op if o["fila3"] >= 0.5]
res["fila3"] = {
    "entra_cuadro": f_in, "plan": [plan["panel-r3.png"]["start"], plan["panel-r3.png"]["end"]],
    "al_100": [min(full), max(full), len(full), round(len(full) / FPS, 3)],
    "al_50_o_mas": [min(half), max(half), len(half), round(len(half) / FPS, 3)],
    "alto_chip_px": round(chip_bot - chip_top, 1), "alto_letras_px": round(txt_bot - txt_top, 1),
    "chips_y": [round(chip_top, 1), round(chip_bot, 1)], "por_cuadro": op,
}
# cuadros sin ningún apoyo entre el cierre del panel y el sello (final − clean, zona de texto)
vacios = []
for n in range(185, 200):
    d = np.abs(F[n][1100:1500] - C[n][1100:1500])
    vacios.append({"n": n, "t": round(n / FPS, 3), "px_distintos": int((d > 25).sum())})
res["entre_panel_y_sello"] = vacios

# ---- 2. final sin congelado -----------------------------------------------------------------------------
mov = [{"n": n, "t": round(n / FPS, 3), "dif_media": round(float(np.abs(F[n][:1150] - F[n - 1][:1150]).mean()), 2)}
       for n in range(len(F) - 16, len(F))]
res["movimiento_final"] = mov
caras = json.load(open(f"{P}/renders/qa/caras-final.json"))["por_cuadro"]
cola = []
for c in caras[-10:]:
    b = c["scrfd"][0] if c["scrfd"] else None
    if b:
        cola.append({"n": c["n"], "ancho": round(b[2] - b[0], 1), "cx": round((b[0] + b[2]) / 2, 1)})
res["caja_cara_cola"] = cola


# ---- 3. SFX ----------------------------------------------------------------------------------------------
def dec(path, ch=1):
    r = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-map", "0:a:0", "-ac", str(ch), "-ar", str(SR), "-f", "f32le", "-"],
                       capture_output=True, check=True)
    return np.frombuffer(r.stdout, dtype=np.float32)


A = dec(f"{P}/final/l08.mp4")
sos = butter(6, 1800, "hp", fs=SR, output="sos")
Ah = sosfiltfilt(sos, A)
w = int(0.005 * SR)
env = np.array([np.abs(Ah[i:i + w]).max() for i in range(0, len(Ah) - w, w)])
envdb = 20 * np.log10(np.maximum(env, 1e-9))
db = lambda x: 20 * np.log10(max(float(x), 1e-12))
sfx_rows = []
# Solo los PINGS: son agudos y el pasaaltos de 1,8 kHz los separa de la voz. El pop es grave y ahí ganan las sibilantes
# de la voz (medido: daba 3,60 s para el pop de 3,75). Los cuatro golpes, pops incluidos, los mide scripts/qa-sfx.py
# sobre la mezcla de SFX sola.
for c in [c for c in sfxplan if "ping" in c["asset"]]:
    at = c["at"]
    i0, i1 = int((at - 0.15) / 0.005), int((at + 0.15) / 0.005)
    seg = envdb[i0:i1]
    base = np.median(envdb[int((at - 0.30) / 0.005):int((at - 0.05) / 0.005)])
    pk = seg.max()
    # golpe = primera ventana que sube a ≥ (pico − 6 dB)
    k = int(np.argmax(seg >= pk - 6))
    hit = (i0 + k) * 0.005
    sfx_rows.append({"asset": c["asset"], "plan_at": at, "golpe_medido": round(hit, 3), "error_ms": round((hit - at) * 1000),
                     "salto_db": [round(float(base), 1), round(float(pk), 1)]})
res["pings_en_el_final"] = sfx_rows  # picos contra la voz y golpes de los 4 efectos: scripts/qa-sfx.py

json.dump(res, open(f"{P}/renders/qa/correcciones.json", "w"), indent=1, ensure_ascii=False)
f3 = res["fila3"]
print(f"fila 3: entra cuadro {f3['entra_cuadro']} · 100 %: f{f3['al_100'][0]}–f{f3['al_100'][1]} ({f3['al_100'][2]} cuadros = {f3['al_100'][3]} s)"
      f" · ≥ 50 %: f{f3['al_50_o_mas'][0]}–f{f3['al_50_o_mas'][1]} ({f3['al_50_o_mas'][3]} s) · chip {f3['alto_chip_px']} px, letras {f3['alto_letras_px']} px")
print("  por cuadro:", " ".join(f"{o['n']}:{o['fila3']:.2f}/{o['panel']:.2f}" for o in op))
print("entre panel y sello (px distintos de clean, y 1100–1500):", " ".join(f"{v['n']}:{v['px_distintos']}" for v in vacios))
print("movimiento arriba del texto (dif media entre cuadros):", " ".join(f"{m_['n']}:{m_['dif_media']}" for m_ in mov))
print("caja SCRFD cola (ancho, centro x):", " ".join(f"{c['n']}:{c['ancho']}/{c['cx']}" for c in cola))
for r in sfx_rows:
    print(f"SFX {r['asset'].split('/')[-1]} plan {r['plan_at']} → golpe {r['golpe_medido']} ({r['error_ms']:+d} ms) · {r['salto_db'][0]} → {r['salto_db'][1]} dBFS")
