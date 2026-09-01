// editor-videos — NARRACIÓN (TTS) con ElevenLabs. Voz oficial de Lucía: "Marcela"
// (elegida por Sergio 2026-07-25 tras comparar 7 candidatas; la voz de Higgsfield
// sonaba robótica y quedó descartada para narración).
//
// Uso:  node tts-elevenlabs.mjs --text "…"            --out renders/voz.mp3
//       node tts-elevenlabs.mjs --text-file guion.txt --out renders/voz.mp3 [--voice <id|alias>]
// Env:  ELEVENLABS_API_KEY (persistida como variable de usuario; NUNCA se commitea).
//
// Plan starter: ~69k caracteres/mes (una narración de reel ≈ 350 chars → ~200 reels/mes).
// `--cost` estima el consumo de caracteres sin generar nada.
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";

const KEY = process.env.ELEVENLABS_API_KEY || "";
const MODEL = process.env.EL_MODEL || "eleven_multilingual_v2"; // el bueno para español

// Voces validadas (comparadas en vivo). Marcela = oficial de Lucía.
const VOICES = {
  marcela: "86V9x9hrQds83qf7zaGn",   // OFICIAL Lucía — juvenil, suave, natural (es-LATAM)
  daniela: "ajOR9IDAaubDK5qtLUqQ",   // cálida, clara y positiva
  valeria: "9oPKasc15pfAbMr7N6Gs",   // alegre, juvenil, pegadiza
  sandra: "rEVYTKPqwSMhytFPayIb",    // dinámica y energética
  jhenny: "2Lb1en5ujrODDIqmp7F3",    // suave, calma, dulce
  anamaria: "m7yTemJqdIqrcNleANfX",  // calma, natural y clara
};
const DEFAULT_VOICE = "marcela";

const args = process.argv.slice(2);
const flag = (n, d) => { const i = args.indexOf("--" + n); return i >= 0 ? args[i + 1] : d; };
const has = (n) => args.includes("--" + n);

const voiceArg = String(flag("voice", DEFAULT_VOICE)).toLowerCase();
const VOICE_ID = VOICES[voiceArg] || flag("voice", VOICES[DEFAULT_VOICE]);
const OUT = flag("out", "voz.mp3");

// ⚠️ SIN voice_settings por defecto (Sergio, 2026-08-21): los ajustes forzados
// (stability .45 / style .35) le CAMBIABAN el timbre a Marcela — "esa no es la voz".
// La voz aprobada en el casting salió con los defaults de la API; así se queda.
// Solo se aplican settings si se piden explícitos por flag.
const SETTINGS = (has("stability") || has("similarity") || has("style"))
  ? {
      stability: Number(flag("stability", "0.5")),
      similarity_boost: Number(flag("similarity", "0.75")),
      style: Number(flag("style", "0")),
      use_speaker_boost: true,
    }
  : null;

(async () => {
  const textFile = flag("text-file", "");
  const text = textFile ? (await readFile(textFile, "utf8")).trim() : String(flag("text", "")).trim();
  if (!text) { console.error("falta --text o --text-file"); process.exit(1); }

  if (has("cost")) {
    console.log(JSON.stringify({ chars: text.length, voice: voiceArg, model: MODEL, nota: "plan starter ~69k chars/mes" }));
    return;
  }
  if (!KEY) { console.error("falta ELEVENLABS_API_KEY"); process.exit(2); }

  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`,
    {
      method: "POST",
      headers: { "xi-api-key": KEY, "Content-Type": "application/json" },
      body: JSON.stringify(SETTINGS ? { text, model_id: MODEL, voice_settings: SETTINGS } : { text, model_id: MODEL }),
    },
  );
  if (!res.ok) { console.error(`ElevenLabs ${res.status}: ${(await res.text()).slice(0, 200)}`); process.exit(1); }

  const buf = Buffer.from(await res.arrayBuffer());
  await mkdir(dirname(OUT), { recursive: true }).catch(() => {});
  await writeFile(OUT, buf);
  console.log(JSON.stringify({ ok: true, out: OUT, kb: Math.round(buf.length / 1024), chars: text.length, voice: voiceArg, model: MODEL }));
})();
