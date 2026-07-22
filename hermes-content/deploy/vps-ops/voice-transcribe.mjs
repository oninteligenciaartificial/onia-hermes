// ONIA — Voz a texto (STT) v1. Corre DENTRO del contenedor onia-center (docker exec),
// que está en la red interna de docker y alcanza a Speaches (Whisper self-hosted).
// Recibe el audio de una nota de voz de Telegram (.ogg/.oga/.mp3/.wav/.m4a) y lo POSTea
// al endpoint OpenAI-compatible /v1/audio/transcriptions de Speaches (multipart form con
// `file` + `model`); devuelve {ok, text} por stdout con la transcripción.
//
// v1 = SOLO transcribir (STT). NO ejecuta comandos. El cableado de Telegram (bajar la
// nota de voz, mandar el texto de vuelta) lo hace n8n; este script es la pata VPS.
//
// ENTRADA DEL AUDIO (2 vías; STDIN es la recomendada para notas de voz reales):
//   1) STDIN binario (recomendado): el audio crudo entra por stdin. Sin límite de tamaño.
//      Lo usa el wrapper voice-transcribe-run.sh. Una nota de voz de 1 min en base64 supera
//      el límite MAX_ARG_STRLEN (128KB) de argumentos/env de Linux, por eso NO va por env.
//   2) AUDIO_B64 (fallback, solo audios chicos < ~90KB): base64 del binario en una env var.
//      Útil para pruebas manuales rápidas.
//
// Env: ONIA_AUDIO_STT_BASE_URL (ej http://speaches:8000/v1), ONIA_AUDIO_STT_MODEL,
//   ONIA_AUDIO_STT_LANGUAGE (ej es). El wrapper las fija; ver default de modelo abajo.
// Env (opcionales): AUDIO_FILENAME (default audio.ogg — fija la extensión/mime),
//   STT_TIMEOUT_MS (default 300000), ONIA_AUDIO_STT_API_KEY (si Speaches exigiera auth).
//
// MODELO: default Systran/faster-whisper-small (MULTILINGÜE, transcribe español y cabe
//   cómodo en el límite de 4GB RAM del contenedor Speaches de este VPS). OJO: NO usar
//   Systran/faster-distil-whisper-large-v3 (el distil es ENGLISH-ONLY: transcribe el
//   español a inglés) ni whisper-large-v3 full (excede los 4GB -> OOM, tumba Speaches).

const BASE = (process.env.ONIA_AUDIO_STT_BASE_URL || "http://speaches:8000/v1").replace(/\/$/, "");
const MODEL = process.env.ONIA_AUDIO_STT_MODEL || "Systran/faster-whisper-small";
const LANGUAGE = (process.env.ONIA_AUDIO_STT_LANGUAGE || "").trim();
const API_KEY = process.env.ONIA_AUDIO_STT_API_KEY || "";
const FILENAME = (process.env.AUDIO_FILENAME || "audio.ogg").trim() || "audio.ogg";
// Timeout generoso: la PRIMERA llamada puede descargar el modelo (~1.5GB) on-demand.
const TIMEOUT_MS = Math.max(5000, Number(process.env.STT_TIMEOUT_MS) || 300000);

function out(o) {
  process.stdout.write(JSON.stringify(o) + "\n");
}

// Content-Type por extensión (Speaches/OpenAI lo usan para elegir el decoder).
function guessType(name) {
  const ext = String(name).toLowerCase().split(".").pop();
  const map = {
    ogg: "audio/ogg", oga: "audio/ogg", opus: "audio/ogg",
    mp3: "audio/mpeg", mpga: "audio/mpeg", m4a: "audio/mp4", mp4: "audio/mp4",
    wav: "audio/wav", webm: "audio/webm", flac: "audio/flac",
  };
  return map[ext] || "application/octet-stream";
}

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks);
}

async function loadAudio() {
  const b64 = process.env.AUDIO_B64;
  if (b64) return Buffer.from(b64, "base64");
  return await readStdin();
}

async function transcribe(buf) {
  const form = new FormData();
  const blob = new Blob([buf], { type: guessType(FILENAME) });
  form.append("file", blob, FILENAME);
  form.append("model", MODEL);
  form.append("response_format", "json");
  if (LANGUAGE) form.append("language", LANGUAGE);

  const headers = {};
  if (API_KEY) headers.Authorization = "Bearer " + API_KEY;

  const res = await fetch(BASE + "/audio/transcriptions", {
    method: "POST",
    headers,
    body: form,
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  const raw = await res.text();
  if (!res.ok) throw new Error("stt " + res.status + ": " + raw.slice(0, 300));

  // response_format=json -> {"text":"..."}; si el server devolviera texto plano, lo tomamos igual.
  const trimmed = raw.trim();
  if (trimmed.startsWith("{")) {
    try {
      const data = JSON.parse(trimmed);
      return typeof data.text === "string" ? data.text.trim() : "";
    } catch {
      return trimmed;
    }
  }
  return trimmed;
}

(async () => {
  try {
    const buf = await loadAudio();
    if (!buf || buf.length < 32) throw new Error("audio vacío o inválido (" + (buf ? buf.length : 0) + " bytes)");

    const text = await transcribe(buf);
    out({ ok: true, text, model: MODEL, language: LANGUAGE || null, bytes: buf.length });
  } catch (e) {
    const msg = String((e && e.message) || e);
    const timeout = /timed out|abort/i.test(msg);
    out({ ok: false, error: msg.slice(0, 300), timeout });
  }
})();
