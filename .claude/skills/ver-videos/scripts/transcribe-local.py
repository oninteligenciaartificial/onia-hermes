"""Transcribe audio/video sin GPU con faster-whisper. Uso: transcribe_local.py <archivo> [modelo] [idioma]"""
import sys, time, json
from faster_whisper import WhisperModel
path = sys.argv[1]; model = sys.argv[2] if len(sys.argv) > 2 else "small"; lang = sys.argv[3] if len(sys.argv) > 3 else None
PROMPT = "Sergio Urcullo, Onia, Onia Platform, WhatsApp, Instagram, Claude, Higgsfield, Bolivia, Santa Cruz."
t0 = time.time()
m = WhisperModel(model, device="cpu", compute_type="int8", cpu_threads=4)
t1 = time.time()
segs, info = m.transcribe(path, language=lang, vad_filter=True, word_timestamps=True, initial_prompt=PROMPT)
out = [{"start": round(s.start,2), "end": round(s.end,2), "text": s.text.strip()} for s in segs]
print(json.dumps({"file": path, "lang": info.language, "prob": round(info.language_probability,2), "dur": round(info.duration,1),
  "load_s": round(t1-t0,1), "run_s": round(time.time()-t1,1), "segments": out}, ensure_ascii=False))
