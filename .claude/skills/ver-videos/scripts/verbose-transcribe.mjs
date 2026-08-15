// ver-videos — transcribe con timestamps (segment + word) via Speaches (Whisper self-hosted).
// Corre DENTRO de onia-center (docker exec), que alcanza http://speaches:8000.
// Uso: node verbose-transcribe.mjs /ruta/audio.mp3  -> stdout JSON {ok, segments[], words[]}
// Modelo por env ONIA_AUDIO_STT_MODEL (forzar Systran/faster-whisper-small = multilingüe;
// el distil grande es English-only y traduce el español). transcribe.sh lo fija.
import { readFile } from "node:fs/promises";

const BASE = (process.env.ONIA_AUDIO_STT_BASE_URL || "http://speaches:8000/v1").replace(/\/$/, "");
const MODEL = process.env.ONIA_AUDIO_STT_MODEL || "Systran/faster-whisper-small";
const LANG = process.env.ONIA_AUDIO_STT_LANGUAGE || "es";
const TIMEOUT = Math.max(5000, Number(process.env.STT_TIMEOUT_MS) || 300000);

function out(o) { process.stdout.write(JSON.stringify(o) + "\n"); }

(async () => {
  try {
    const path = process.argv[2];
    if (!path) throw new Error("falta ruta de audio");
    const buf = await readFile(path);
    const form = new FormData();
    form.append("file", new Blob([buf], { type: "audio/mpeg" }), path.split("/").pop());
    form.append("model", MODEL);
    // "auto" (o vacio) = NO mandar el campo, para que Whisper detecte el idioma.
    // Forzar "es" sobre un video en ingles no falla: TRADUCE, y el verbatim queda
    // inventado. Con el modelo multilingue la deteccion es segura.
    if (LANG && LANG !== "auto") form.append("language", LANG);
    form.append("response_format", "verbose_json");
    form.append("timestamp_granularities[]", "segment");
    form.append("timestamp_granularities[]", "word");
    const res = await fetch(BASE + "/audio/transcriptions", {
      method: "POST", body: form, signal: AbortSignal.timeout(TIMEOUT),
    });
    const raw = await res.text();
    if (!res.ok) throw new Error("stt " + res.status + ": " + raw.slice(0, 300));
    const data = JSON.parse(raw);
    const segments = (data.segments || []).map((s) => ({ start: s.start, end: s.end, text: (s.text || "").trim() }));
    const words = (data.words || []).map((w) => ({ start: w.start, end: w.end, word: (w.word || w.text || "").trim() }));
    out({ ok: true, model: MODEL, language: LANG, duration: data.duration ?? null, n_segments: segments.length, n_words: words.length, segments, words });
  } catch (e) {
    out({ ok: false, error: String((e && e.message) || e).slice(0, 400) });
  }
})();
