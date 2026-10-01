# -*- coding: utf-8 -*-
# Gate de ortografía materializado (editor-videos §5b): las LETRAS salen del guion autorado y los
# TIEMPOS del alineamiento por carácter de ElevenLabs (/with-timestamps). No hay ASR en el medio:
# Whisper solo se usa después, para controlar que la voz dijo lo que dice el guion.
# Salida: scripts/segments.json en el formato de Speaches (segments[] + words[]) que come
# karaoke-captions.mjs y sync-plan.mjs. Los offsets son dónde entra cada toma en el video.
import io, json, os

AQUI = os.path.dirname(os.path.abspath(__file__))
TOMAS = [  # (alineamiento, segundo del video donde arranca la toma)
    ("../audio/voz-cuerpo.alignment.json", 0.50),
    ("../audio/voz-remate.alignment.json", 8.70),
]

def palabras(al, off):
    out, cur, st, en = [], "", None, None
    for ch, s, e in zip(al["characters"], al["character_start_times_seconds"], al["character_end_times_seconds"]):
        if ch.isspace():
            if cur: out.append({"start": round(st + off, 3), "end": round(en + off, 3), "word": cur})
            cur, st = "", None
        else:
            if st is None: st = s
            cur += ch; en = e
    if cur: out.append({"start": round(st + off, 3), "end": round(en + off, 3), "word": cur})
    return out

words, segments = [], []
for rel, off in TOMAS:
    al = json.load(io.open(os.path.join(AQUI, rel), encoding="utf-8"))
    ws = palabras(al, off)
    words += ws
    # una oración por segmento: corta en . ? !
    frase = []
    for w in ws:
        frase.append(w)
        if w["word"][-1] in ".?!":
            segments.append({"start": frase[0]["start"], "end": frase[-1]["end"], "text": " ".join(x["word"] for x in frase)})
            frase = []
    if frase:
        segments.append({"start": frase[0]["start"], "end": frase[-1]["end"], "text": " ".join(x["word"] for x in frase)})

io.open(os.path.join(AQUI, "segments.json"), "w", encoding="utf-8").write(
    json.dumps({"segments": segments, "words": words}, ensure_ascii=False, indent=1))
for s in segments:
    print(f'{s["start"]:6.2f}-{s["end"]:6.2f}  {s["text"]}')
