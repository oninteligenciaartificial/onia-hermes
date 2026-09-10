import sys, json
from faster_whisper import WhisperModel

wav, out = sys.argv[1], sys.argv[2]
model = WhisperModel("small", device="cpu", compute_type="int8")
segs, info = model.transcribe(wav, language="es", word_timestamps=True,
                              vad_filter=False, beam_size=5)
segments, words = [], []
for s in segs:
    segments.append({"start": round(s.start, 3), "end": round(s.end, 3), "text": s.text.strip()})
    for w in (s.words or []):
        words.append({"start": round(w.start, 3), "end": round(w.end, 3), "word": w.word.strip()})
    print(f"[{s.start:7.2f}] {s.text.strip()}", flush=True)
json.dump({"segments": segments, "words": words, "language": info.language,
           "duration": info.duration}, open(out, "w", encoding="utf-8"),
          ensure_ascii=False, indent=1)
print(f"OK -> {out}  segments={len(segments)} words={len(words)}")
