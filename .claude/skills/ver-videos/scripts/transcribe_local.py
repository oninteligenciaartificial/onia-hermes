# ver-videos - transcripcion LOCAL con faster-whisper. Camino por defecto en la PC (19-oct-2026);
# transcribe.sh lo elige solo si faster_whisper importa. Base: videos/claude-vs-claudecode/scripts/.
#   python transcribe_local.py <audio> [salida.json]
# stdout: el mismo JSON que verbose-transcribe.mjs (Speaches), para que los que llaman no cambien:
#   {ok, model, language, duration, n_segments, n_words, segments[], words[]}
# Env: ONIA_AUDIO_STT_LANGUAGE (es; "auto" = detectar), ONIA_LOCAL_STT_MODEL (small = el del VPS).
import json
import os
import sys


def transcribe(audio: str) -> dict:
    from faster_whisper import WhisperModel

    lang = os.environ.get("ONIA_AUDIO_STT_LANGUAGE", "es")
    name = os.environ.get("ONIA_LOCAL_STT_MODEL", "small")
    model = WhisperModel(name, device="cpu", compute_type="int8")
    segs, info = model.transcribe(audio, language=None if lang in ("", "auto") else lang,
                                  word_timestamps=True, vad_filter=False, beam_size=5)
    segments, words = [], []
    for s in segs:
        segments.append({"start": round(s.start, 3), "end": round(s.end, 3), "text": s.text.strip()})
        for w in s.words or []:
            words.append({"start": round(w.start, 3), "end": round(w.end, 3), "word": w.word.strip()})
    return {"ok": True, "model": f"faster-whisper-{name} (local)", "language": info.language,
            "duration": info.duration, "n_segments": len(segments), "n_words": len(words),
            "segments": segments, "words": words}


try:
    if len(sys.argv) < 2 or not os.path.isfile(sys.argv[1]):
        raise FileNotFoundError(f"no existe el audio: {sys.argv[1:2]}")
    result = transcribe(sys.argv[1])
except Exception as e:  # el contrato es JSON siempre, como verbose-transcribe.mjs
    result = {"ok": False, "error": str(e)[:400]}

# ensure_ascii (default): en Windows stdout a un pipe es cp1252 y un emoji lo rompe.
print(json.dumps(result))
if len(sys.argv) > 2:
    with open(sys.argv[2], "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=1)
