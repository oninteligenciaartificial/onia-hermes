# -*- coding: utf-8 -*-
"""L08 QA de SFX (corrección del 2-oct): dónde cae el GOLPE de cada efecto y a cuántos dB queda bajo la voz.
· renders/qa/sfx-solo.mp4 = el MISMO sfx-plan.json mezclado sobre silencio (sfx.mjs sobre renders/qa/mudo.mp4):
  golpe = primer milisegundo en que el efecto llega a −12 dB de su propio pico; pico por efecto con astats-like (estéreo).
· En el FINAL: correlación del efecto (sfx-solo, ventana de 0,4 s) contra el audio masterizado → desfase entre lo
  planeado y lo que suena (0 ms = el final tiene el efecto donde sfx-solo dice).
· Voz: pico de renders/karaoke.mp4 (antes de SFX y master), estéreo.
Uso: python3 scripts/qa-sfx.py  → renders/qa/sfx-qa.json"""
import json, os, subprocess
import numpy as np
from scipy.signal import correlate

P = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
SR = 48000
plan = json.load(open(f"{P}/scripts/sfx-plan.json"))["sfx"]
def dec(path):
    r = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-map", "0:a:0", "-ac", "2", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True)
    return np.frombuffer(r.stdout, dtype=np.float32).reshape(-1, 2)
db = lambda x: 20 * np.log10(max(float(x), 1e-12))
solo, fin, voz = dec(f"{P}/renders/qa/sfx-solo.mp4"), dec(f"{P}/final/l08.mp4"), dec(f"{P}/renders/karaoke.mp4")
voz_pk = np.abs(voz).max()
rows = []
for c in plan:
    a, b = int((c["at"] - 0.1) * SR), int((c["at"] + 0.5) * SR)
    seg = np.abs(solo[a:b]).max(axis=1)
    pk = seg.max()
    on = a + int(np.argmax(seg >= pk * 10 ** (-12 / 20)))
    hit = on / SR
    # correlación en el final (mono), ventana del efecto 0,4 s desde 20 ms antes del golpe, búsqueda ±0,15 s
    t0 = on - int(0.02 * SR); tmpl = solo[t0:t0 + int(0.4 * SR)].mean(axis=1)
    lo = t0 - int(0.15 * SR); hi = t0 + int(0.15 * SR) + len(tmpl)
    cc = correlate(fin[lo:hi].mean(axis=1), tmpl, "valid")
    lag = (lo + int(np.argmax(cc)) - t0) / SR
    rows.append({"asset": c["asset"], "plan_at": c["at"], "golpe_s": round(hit, 4), "error_ms": round((hit - c["at"]) * 1000, 1),
                 "desfase_en_final_ms": round(lag * 1000, 1), "pico_dbfs": round(db(pk), 2), "bajo_pico_voz_db": round(db(voz_pk) - db(pk), 2)})
out = {"pico_voz_premaster_dbfs": round(db(voz_pk), 2), "efectos": rows}
json.dump(out, open(f"{P}/renders/qa/sfx-qa.json", "w"), indent=1, ensure_ascii=False)
print(f"pico de la voz (karaoke.mp4): {out['pico_voz_premaster_dbfs']} dBFS")
for r in rows:
    print(f"{r['asset'].split('/')[-1]:14s} plan {r['plan_at']:6.3f} → golpe {r['golpe_s']:.4f} ({r['error_ms']:+.1f} ms) · en el final {r['desfase_en_final_ms']:+.1f} ms · pico {r['pico_dbfs']} dBFS = {r['bajo_pico_voz_db']} dB bajo la voz")
