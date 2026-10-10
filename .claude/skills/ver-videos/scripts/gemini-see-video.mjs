// ver-videos — VER NATIVO con Gemini (método primario): mira el video entero
// (imagen + audio en UNA llamada) y devuelve resumen + timeline con timestamps.
// Fuente: ai.google.dev (generateContent con file_data; File API resumable upload).
//
// Uso CLI:  GEMINI_API_KEY=... node gemini-see-video.mjs <youtube-url | ruta-local.mp4>
//   - URL de YouTube (youtube.com/youtu.be)  -> se pasa directa (cero subida).
//   - archivo local                          -> File API (subir -> ACTIVE -> analizar).
// Importable: geminiEnabled(), seeYouTube(url), seeLocalVideo(path).
//
// Env: GEMINI_API_KEY (gratis, aistudio.google.com/apikey). GEMINI_MODEL (default gemini-2.5-flash).
//   GEMINI_MEDIA_RES=low  -> ~100 tok/s en vez de ~300 (videos largos, ahorra cuota).
import { readFile, stat } from "node:fs/promises";
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";

// Sin GEMINI_API_KEY en el env, buscar un .env subiendo desde este script y
// desde el cwd (el del repo esta gitignoreado). Asi "node gemini-see-video.mjs"
// funciona solo, sin exportar nada a mano.
function envKeyFromDotenv() {
  const roots = new Set();
  for (let d of [dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), process.cwd()]) {
    for (let i = 0; i < 8; i++) { roots.add(d); const up = dirname(d); if (up === d) break; d = up; }
  }
  for (const root of roots) {
    const p = join(root, ".env");
    if (!existsSync(p)) continue;
    const m = readFileSync(p, "utf8").match(/^GEMINI_API_KEY=(.+)$/m);
    if (m) return m[1].trim();
  }
  return "";
}

const API_KEY = process.env.GEMINI_API_KEY || envKeyFromDotenv();
// gemini-flash-latest = alias al flash actual (no se deprecia; las cuentas nuevas ya no
// tienen gemini-2.5-flash). Override con GEMINI_MODEL (ej. gemini-3.6-flash, gemini-flash-lite-latest).
const MODEL = process.env.GEMINI_MODEL || "gemini-flash-latest";
const BASE = "https://generativelanguage.googleapis.com";
const H = { "x-goog-api-key": API_KEY };

const PROMPT = `Sos un analista de video. Mirá ESTE video completo (audio + imagen) y devolvé en español:
1. RESUMEN (3-5 frases): de qué trata y el mensaje central.
2. TIMELINE POR SECCIONES en orden: [MM:SS - MM:SS] Título — QUÉ SE VE (personas, texto en pantalla, producto, acción) — QUÉ SE DICE (idea del audio; citas clave entre comillas).
3. TEXTO EN PANTALLA: transcribí literal rótulos/CTA/precios con su timestamp.
4. CONCLUSIÓN / CTA.
Reglas: timestamps reales MM:SS, no inventes; si algo no se distingue decilo "no se distingue en MM:SS"; reportá cobertura real; solo ese formato.`;

export const geminiEnabled = () => Boolean(API_KEY);
const isYouTube = (s) => /^https:\/\/(?:(?:www\.|m\.)?youtube\.com\/|youtu\.be\/)/.test(s);

function genConfig() {
  return process.env.GEMINI_MEDIA_RES === "low"
    ? { generationConfig: { mediaResolution: "MEDIA_RESOLUTION_LOW" } }
    : {};
}

// Auto-reintento SOLO ante errores transitorios de Gemini: 429 (rate limit),
// 500 y 503 (saturado), y errores de red / timeout. Los NO transitorios
// (400/401/403/404…) fallan de una. Esperas fijas escalonadas (no Math.random).
const TRANSIENT = new Set([429, 500, 503]);
const BACKOFF_MS = [3000, 8000, 20000]; // esperas entre los 4 intentos (~3s, 8s, 20s)

async function generate(parts) {
  const url = `${BASE}/v1beta/models/${MODEL}:generateContent`;
  const opts = {
    method: "POST",
    headers: { ...H, "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts }], ...genConfig() }),
  };
  let lastErr;
  for (let i = 1; i <= 4; i++) {
    let status = "red"; // por defecto: error de red/timeout (fetch tiró)
    try {
      const res = await fetch(url, opts);
      if (res.ok) {
        const data = await res.json();
        return data.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") ?? "";
      }
      status = res.status;
      const err = new Error(`Gemini ${res.status}: ${(await res.text()).slice(0, 300)}`);
      // status NO transitorio -> fallar de una, sin reintento
      if (!TRANSIENT.has(res.status)) throw Object.assign(err, { fatal: true });
      lastErr = err;
    } catch (e) {
      if (e.fatal) throw e; // no transitorio: propagar sin reintentar
      lastErr = e; // error de red / timeout: transitorio
    }
    if (i < 4) {
      const s = BACKOFF_MS[i - 1] / 1000;
      console.error(`Gemini ${status} — reintento ${i}/4 en ${s}s…`);
      await new Promise((r) => setTimeout(r, BACKOFF_MS[i - 1]));
    }
  }
  throw new Error(`${lastErr?.message || "Gemini falló"} (tras 4 intentos)`);
}

// Video ya en YouTube (público/unlisted): cero subida.
export async function seeYouTube(url, prompt = PROMPT) {
  return generate([{ text: prompt }, { file_data: { file_uri: url } }]);
}

// Archivo local: File API resumable -> esperar ACTIVE -> analizar.
export async function seeLocalVideo(path, prompt = PROMPT, mimeType = "video/mp4") {
  const numBytes = (await stat(path)).size;
  const start = await fetch(`${BASE}/upload/v1beta/files`, {
    method: "POST",
    headers: {
      ...H,
      "X-Goog-Upload-Protocol": "resumable",
      "X-Goog-Upload-Command": "start",
      "X-Goog-Upload-Header-Content-Length": String(numBytes),
      "X-Goog-Upload-Header-Content-Type": mimeType,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ file: { display_name: "onia-ver-video" } }),
  });
  if (!start.ok) throw new Error(`upload start ${start.status}: ${(await start.text()).slice(0, 200)}`);
  const uploadUrl = start.headers.get("x-goog-upload-url");

  const fin = await fetch(uploadUrl, {
    method: "POST",
    headers: { "Content-Length": String(numBytes), "X-Goog-Upload-Offset": "0", "X-Goog-Upload-Command": "upload, finalize" },
    body: await readFile(path),
  });
  if (!fin.ok) throw new Error(`upload finalize ${fin.status}: ${(await fin.text()).slice(0, 200)}`);
  const { file } = await fin.json();

  let state = file.state, meta = file;
  const t0 = Date.now();
  while (state === "PROCESSING") {
    if (Date.now() - t0 > 600000) throw new Error("timeout esperando ACTIVE (>10min)");
    await new Promise((r) => setTimeout(r, 5000));
    const g = await fetch(`${BASE}/v1beta/${file.name}`, { headers: H });
    meta = await g.json();
    state = meta.state;
  }
  if (state !== "ACTIVE") throw new Error(`archivo en estado ${state}`);
  return generate([{ file_data: { mime_type: mimeType, file_uri: meta.uri } }, { text: prompt }]);
}

// CLI
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith("gemini-see-video.mjs")) {
  const arg = process.argv[2];
  // El prompt propio iba como 2º argumento y se ignoraba: hasta el 8-oct todo CLI corrió con el genérico.
  const prompt = process.argv[3] ?? PROMPT;
  if (!arg) { console.error('uso: node gemini-see-video.mjs <youtube-url | ruta.mp4> ["prompt"]'); process.exit(1); }
  if (!API_KEY) { console.error("falta GEMINI_API_KEY (gratis en aistudio.google.com/apikey)"); process.exit(2); }
  (isYouTube(arg) ? seeYouTube(arg, prompt) : seeLocalVideo(arg, prompt))
    .then((txt) => { console.log(txt); })
    .catch((e) => { console.error("ERROR:", String(e.message || e)); process.exit(1); });
}
