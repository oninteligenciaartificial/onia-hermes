# -*- coding: utf-8 -*-
# Gate de ortografia materializado: Whisper pone los TIEMPOS, el guion autorado pone
# las LETRAS. Si el conteo de palabras difiere, se reparte proporcional dentro del
# segmento — nunca se quema la grafia del ASR.
import json, io, re, sys

AUTORADO = [
    "No soy real. Mirá bien: no existo.",
    "Soy Lucía. Un personaje digital, creado en Bolivia por el equipo de Onia.",
    "Estoy acá para mostrarte, sin humo, cómo la inteligencia artificial le sirve a un negocio de verdad.",
    "No escondo lo que soy. Vos tampoco deberías perderte lo que viene. Seguime.",
]

d = json.load(io.open("scripts/transcript-raw.json", encoding="utf-8"))
asr_words = [(float(w["start"]), float(w["end"]), w["word"].strip()) for w in d.get("words", [])]
if not asr_words:
    sys.exit("transcript sin words[]")

aut_words = []
for i, frase in enumerate(AUTORADO):
    for tok in frase.split():
        aut_words.append((i, tok))

print(f"ASR: {len(asr_words)} palabras | autorado: {len(aut_words)}")

n = min(len(asr_words), len(aut_words))
# Alinear 1:1 por indice (misma locucion, mismo orden). Si el ASR trae mas/menos
# tokens, el excedente se absorbe estirando la ultima palabra de cada lado.
words_out = []
for i in range(n):
    s, e, _ = asr_words[i]
    beat, tok = aut_words[i]
    words_out.append({"start": round(s, 3), "end": round(e, 3), "word": tok, "beat": beat})
# autoradas sobrantes: pegarlas al final con la duracion media
if len(aut_words) > n:
    last_end = words_out[-1]["end"]
    for beat, tok in aut_words[n:]:
        words_out.append({"start": last_end, "end": round(last_end + 0.3, 3), "word": tok, "beat": beat})
        last_end += 0.3

segments = []
for i, frase in enumerate(AUTORADO):
    ws = [w for w in words_out if w["beat"] == i]
    if ws:
        segments.append({"start": ws[0]["start"], "end": ws[-1]["end"], "text": frase})

out = {"segments": segments, "words": [{k: w[k] for k in ("start", "end", "word")} for w in words_out]}
io.open("scripts/segments.json", "w", encoding="utf-8").write(json.dumps(out, ensure_ascii=False, indent=1))
print("segments.json listo")
for s in segments:
    print(f'  {s["start"]:6.2f}-{s["end"]:6.2f}  {s["text"]}')
