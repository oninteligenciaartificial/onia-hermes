// editor-videos — EFECTOS DE SONIDO: mezcla SFX sobre el audio del video sin pisar la voz.
//
// Whoosh en el corte, pop cuando entra el apoyo visual, ping en el dato, swish en el CTA.
// Todo local con ffmpeg, costo cero. Una sola pasada de filter_complex (adelay + amix),
// mismo patrón encadenado que overlay-visuals.mjs.
//
// Lo que lo hace sonar profesional y no pegoteado es el DUCKING: mientras suena el efecto,
// la voz baja ~5 dB con rampa y vuelve. Sin eso el SFX se monta encima y compite.
//
// Uso:
//   node sfx.mjs --video renders/cut.mp4 --plan scripts/sfx-plan.json --out renders/sfx.mp4
//   node sfx.mjs --video in.mp4 --plan p.json --out x.mp4 --dry-run
//   node sfx.mjs --video in.mp4 --plan p.json --out x.mp4 --duck-mode sidechain
//   node sfx.mjs --list-lib                      (qué cues hay en la librería)
//
// plan.json:
//   { "sfx": [
//       { "asset": "whoosh",             "at": 3.2,  "gain": -8, "duck": true  },
//       { "asset": "assets/sfx/pop.mp3", "at": 7.05, "gain": -12, "duck": false }
//   ] }
//   · asset : ruta a un archivo de audio, O el nombre de un cue de la librería
//             (--lib, default la de HyperFrames: .agents/skills/media-use/audio/assets/sfx).
//   · at    : segundo exacto en que ARRANCA el efecto (no el pico — ver manifest).
//   · gain  : dB sobre el efecto (negativo = más bajo). Default --gain (-10).
//   · duck  : true = baja la voz mientras suena. Default --duck-default (true).
//   · duckDb / duckDur : override por efecto de la profundidad (dB) y del largo de la
//             ventana de ducking (segundos). Por defecto la ventana = duración del efecto,
//             topeada en --duck-max (2.5s) para que un riser de 10s no aplaste toda la voz.
//
// Flags: --lib --gain --duck-default --duck-db --duck-attack --duck-release --duck-max
//        --duck-mode expr|sidechain --sr --abitrate --dry-run --list-lib
//
// El VIDEO se COPIA (-c:v copy): nunca se re-encodea la imagen. Solo se rehace el audio.
// Determinista: sin Date.now / Math.random. Sin dependencias externas.
import { existsSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// ---- args ------------------------------------------------------------------
const argv = process.argv.slice(2);
const has = (name) => argv.includes("--" + name);
const flag = (name, def) => {
  const i = argv.indexOf("--" + name);
  return i >= 0 && i + 1 < argv.length && !String(argv[i + 1]).startsWith("--") ? argv[i + 1] : def;
};
const fail = (msg) => {
  console.error("sfx: " + msg);
  process.exit(1);
};

const HERE = dirname(fileURLToPath(import.meta.url));
// La librería de HyperFrames vive en .agents/skills/media-use/... — 5 niveles arriba de
// .claude/skills/editor-videos/scripts/. Se resuelve relativo al script, no al cwd.
// Si la copia del repo no está (limpieza de skills del 29-sep), cae a la global de ~/.claude/skills.
const REPO_LIB = resolve(HERE, "../../../../.agents/skills/media-use/audio/assets/sfx");
const HOME_LIB = join(process.env.USERPROFILE || process.env.HOME || "", ".claude/skills/media-use/audio/assets/sfx");
const DEFAULT_LIB = existsSync(REPO_LIB) ? REPO_LIB : HOME_LIB;
const LIB = resolve(flag("lib", DEFAULT_LIB));

const VIDEO = flag("video");
const PLAN = flag("plan");
const OUT = flag("out");
const DRY = has("dry-run");
const SR = Number(flag("sr", "48000"));
const ABITRATE = flag("abitrate", "192k");
const GAIN_DEF = Number(flag("gain", "-10"));
const DUCK_DEFAULT = flag("duck-default", "true") !== "false";
const DUCK_DB = Number(flag("duck-db", "5")); // 4-6 dB es el rango que suena natural
const DUCK_ATTACK = Number(flag("duck-attack", "0.12"));
const DUCK_RELEASE = Number(flag("duck-release", "0.25"));
const DUCK_MAX = Number(flag("duck-max", "2.5"));
const DUCK_MODE = flag("duck-mode", "expr");

if (!["expr", "sidechain"].includes(DUCK_MODE)) fail(`--duck-mode debe ser expr | sidechain (recibí "${DUCK_MODE}")`);
if (!(DUCK_DB >= 0 && DUCK_DB <= 24)) fail("--duck-db fuera de rango (0..24)");
if (!(DUCK_ATTACK > 0) || !(DUCK_RELEASE > 0)) fail("--duck-attack / --duck-release deben ser > 0");

// ---- librería de cues ------------------------------------------------------
function loadManifest() {
  const mf = join(LIB, "manifest.json");
  if (!existsSync(mf)) return null;
  try {
    return JSON.parse(readFileSync(mf, "utf8"));
  } catch (err) {
    console.error(`sfx: AVISO manifest ilegible (${mf}): ${err.message}`);
    return null;
  }
}
const manifest = loadManifest();

if (has("list-lib")) {
  console.log(`\nLibrería de SFX: ${LIB}`);
  if (!manifest) {
    console.log("(sin manifest.json — pasá rutas de archivo directas en el plan)");
    process.exit(0);
  }
  const rows = Object.entries(manifest).sort(([a], [b]) => (a < b ? -1 : 1));
  console.log(`\ncue              | dur    | archivo             | ok | para qué`);
  console.log(`-----------------+--------+---------------------+----+------------------------------`);
  for (const [cue, m] of rows) {
    const p = join(LIB, m.file || `${cue}.mp3`);
    const ok = existsSync(p) ? "SÍ" : "NO";
    const why = String(m.description || "").split(/ [—-] /)[0].slice(0, 46);
    console.log(`${cue.padEnd(16)} | ${(String(m.duration ?? "?") + "s").padEnd(6)} | ${String(m.file || "").padEnd(19)} | ${ok.padEnd(2)} | ${why}`);
  }
  const missing = rows.filter(([cue, m]) => !existsSync(join(LIB, m.file || `${cue}.mp3`)));
  if (missing.length) {
    console.log(
      `\n${missing.length}/${rows.length} cue(s) sin archivo en disco. Ver ` +
        `.claude/skills/editor-videos/assets/sfx/README.md (de dónde bajarlos, licencia libre).`,
    );
  }
  process.exit(0);
}

if (!VIDEO) fail("falta --video <in.mp4>");
if (!PLAN) fail("falta --plan <plan.json>");
if (!OUT) fail("falta --out <out.mp4>");
if (!existsSync(VIDEO)) fail(`no existe el video: ${VIDEO}`);
if (!existsSync(PLAN)) fail(`no existe el plan: ${PLAN}`);

// ---- plan ------------------------------------------------------------------
let plan;
try {
  plan = JSON.parse(readFileSync(PLAN, "utf8"));
} catch (err) {
  fail(`--plan inválido (${PLAN}): ${err.message}`);
}
const cues = Array.isArray(plan) ? plan : Array.isArray(plan.sfx) ? plan.sfx : null;
if (!cues) fail("el plan necesita { sfx: [ ... ] }");
if (!cues.length) fail("el plan no tiene efectos (nada que mezclar)");

// ---- ffprobe ---------------------------------------------------------------
function probe(file, args) {
  const r = spawnSync("ffprobe", ["-v", "error", ...args, "-of", "csv=p=0:nk=1", file], { encoding: "utf8" });
  if (r.error) fail(`no pude ejecutar ffprobe: ${r.error.message} (¿está instalado?)`);
  if (r.status !== 0) fail(`ffprobe falló sobre ${file}: ${(r.stderr || "").trim()}`);
  return String(r.stdout).trim();
}
function mediaDuration(file) {
  // stream primero (más exacto en wav), format como red de seguridad (mp3 con VBR).
  const s = Number(probe(file, ["-select_streams", "a:0", "-show_entries", "stream=duration"]).split("\n")[0]);
  if (Number.isFinite(s) && s > 0) return s;
  const f = Number(probe(file, ["-show_entries", "format=duration"]).split("\n")[0]);
  return Number.isFinite(f) && f > 0 ? f : 0;
}
function hasAudio(file) {
  return probe(file, ["-select_streams", "a", "-show_entries", "stream=index"]).length > 0;
}

const videoDur = Number(probe(VIDEO, ["-select_streams", "v:0", "-show_entries", "stream=duration"]).split("\n")[0]) || 0;
const VIDEO_HAS_AUDIO = hasAudio(VIDEO);

// ---- resolver assets -------------------------------------------------------
// 1) ruta tal cual · 2) cue del manifest · 3) archivo suelto dentro de --lib.
function resolveAsset(name, i) {
  if (existsSync(name) && statSync(name).isFile()) return name;
  if (manifest && manifest[name]) {
    const p = join(LIB, manifest[name].file || `${name}.mp3`);
    if (existsSync(p)) return p;
    fail(
      `sfx[${i}]: el cue "${name}" está en el manifest pero el archivo no está en disco (${p}).\n` +
        `  La librería de HyperFrames viene sin los .mp3 en este repo. Ver ` +
        `.claude/skills/editor-videos/assets/sfx/README.md, o pasá una ruta directa.`,
    );
  }
  const direct = join(LIB, name);
  if (existsSync(direct) && statSync(direct).isFile()) return direct;
  const cueList = manifest ? Object.keys(manifest).join(", ") : "(sin manifest)";
  fail(`sfx[${i}]: no encontré "${name}" (ni como ruta, ni como cue). Cues conocidos: ${cueList}`);
}

// ---- armar el grafo --------------------------------------------------------
const num = (v) => Math.round(Number(v) * 1000) / 1000;
const AFMT = `aformat=sample_fmts=fltp:sample_rates=${SR}:channel_layouts=stereo`;

const inputs = [];
const chains = [];
const sfxLabels = [];
const duckWindows = [];
const rows = [];

cues.forEach((c, i) => {
  const idx = i + 1; // input 0 = video; 1..N = los efectos
  if (!c || typeof c !== "object") fail(`sfx[${i}]: cada entrada debe ser un objeto`);
  if (!c.asset) fail(`sfx[${i}] sin "asset"`);
  const at = Number(c.at);
  if (!Number.isFinite(at)) fail(`sfx[${i}]: "at" debe ser un número (segundos)`);
  if (at < 0) fail(`sfx[${i}]: "at" no puede ser negativo (recibí ${at})`);
  if (videoDur && at >= videoDur) {
    fail(`sfx[${i}]: at ${at}s cae después del final del video (${videoDur.toFixed(2)}s)`);
  }

  const file = resolveAsset(String(c.asset), i);
  const dur = mediaDuration(file);
  if (!dur) fail(`sfx[${i}]: ${file} no tiene stream de audio legible`);
  if (videoDur && at + dur > videoDur + 0.05) {
    console.error(
      `sfx: AVISO sfx[${i}] (${c.asset}) dura ${num(dur)}s desde ${num(at)}s pero el video ` +
        `termina en ${videoDur.toFixed(2)}s → se corta ahí.`,
    );
  }

  const gain = Number(c.gain ?? GAIN_DEF);
  if (!Number.isFinite(gain)) fail(`sfx[${i}]: "gain" debe ser un número (dB)`);
  if (gain > 6) fail(`sfx[${i}]: gain ${gain}dB es demasiado alto (máx +6; el SFX va DEBAJO de la voz)`);

  const delayMs = Math.round(at * 1000);
  const steps = [AFMT];
  if (gain !== 0) steps.push(`volume=${num(gain)}dB`);
  if (delayMs > 0) steps.push(`adelay=${delayMs}:all=1`);
  chains.push(`[${idx}:a]${steps.join(",")}[s${idx}]`);
  sfxLabels.push(`[s${idx}]`);
  inputs.push("-i", file);

  const duck = c.duck === undefined ? DUCK_DEFAULT : Boolean(c.duck);
  const duckDb = Number(c.duckDb ?? DUCK_DB);
  if (!Number.isFinite(duckDb) || duckDb < 0 || duckDb > 24) fail(`sfx[${i}]: duckDb fuera de rango (0..24)`);
  // Ventana de ducking: por defecto lo que dura el efecto, topeado en --duck-max.
  // Un riser de 10s no tiene por qué tener la voz 10s abajo.
  const rawWin = Number(c.duckDur ?? Math.min(dur, DUCK_MAX));
  if (!Number.isFinite(rawWin) || rawWin <= 0) fail(`sfx[${i}]: duckDur debe ser > 0`);
  if (duck && duckDb > 0) duckWindows.push({ a: at, b: at + rawWin, db: duckDb });

  rows.push({
    i: idx,
    cue: String(c.asset),
    file,
    at: num(at),
    dur: num(dur),
    gain: num(gain),
    duck: duck && duckDb > 0 ? `-${num(duckDb)}dB / ${num(rawWin)}s` : "no",
  });
});

// Mezcla de los efectos entre sí. normalize=0 es OBLIGATORIO: amix por defecto divide
// entre N y con 5 efectos cada uno queda 5x más bajo de lo que dice el plan.
let sfxLabel;
if (sfxLabels.length === 1) {
  sfxLabel = sfxLabels[0];
} else {
  chains.push(`${sfxLabels.join("")}amix=inputs=${sfxLabels.length}:normalize=0:dropout_transition=0[sfxmix]`);
  sfxLabel = "[sfxmix]";
}

// Base de voz. Si el video no tiene audio, se sintetiza silencio del mismo largo para
// que la mezcla igual tenga una pista base con la duración correcta.
let voiceLabel;
if (VIDEO_HAS_AUDIO) {
  chains.push(`[0:a]${AFMT}[voice0]`);
  voiceLabel = "[voice0]";
} else {
  console.error("sfx: AVISO el video no tiene pista de audio → se mezcla sobre silencio.");
  inputs.push("-f", "lavfi", "-t", String(num(videoDur || 1)), "-i", `anullsrc=r=${SR}:cl=stereo`);
  chains.push(`[${cues.length + 1}:a]${AFMT}[voice0]`);
  voiceLabel = "[voice0]";
}

// ---- DUCKING ---------------------------------------------------------------
// expr (default): envolvente exacta y determinista por ventana. Para cada ventana [a,b]
//   env(t) = min( clip((t-(a-A))/A, 0, 1), clip((b+R-t)/R, 0, 1) )
//   → rampa de subida en A, meseta en 1 entre a y b, rampa de bajada en R. Se combinan
//   varias ventanas con max() (nunca se suman: dos efectos juntos no duplican el pozo).
//   La ganancia final es  1-(1-g)*ENV  con g = 10^(-dB/20).
// sidechain: sidechaincompress usando la mezcla de SFX como cadena lateral. Suena más
//   "radio" y reacciona al contenido real del efecto, pero NO respeta duck:false por
//   efecto (la cadena lateral es la mezcla entera). Está como alternativa consciente.
let duckNote = "sin ducking (ningún efecto con duck:true)";
if (duckWindows.length && DUCK_MODE === "expr") {
  // Una sola profundidad por render: se toma la MÁS PROFUNDA declarada, así el pozo es
  // predecible. Ventanas con dB distinto se anotan en la tabla.
  const deepest = Math.max(...duckWindows.map((w) => w.db));
  const g = num(Math.pow(10, -deepest / 20));
  const envs = duckWindows.map(
    (w) =>
      `min(clip((t-${num(w.a - DUCK_ATTACK)})/${num(DUCK_ATTACK)}\\,0\\,1)\\,` +
      `clip((${num(w.b + DUCK_RELEASE)}-t)/${num(DUCK_RELEASE)}\\,0\\,1))`,
  );
  const env = envs.reduce((acc, e) => (acc ? `max(${acc}\\,${e})` : e), "");
  const expr = `1-${num(1 - g)}*(${env})`;
  // Comillas simples: dentro de ellas las comas son literales para el parser del filtergraph.
  chains.push(`${voiceLabel}volume=volume='${expr}':eval=frame[voice]`);
  voiceLabel = "[voice]";
  duckNote = `expr · -${num(deepest)}dB · attack ${num(DUCK_ATTACK)}s / release ${num(DUCK_RELEASE)}s · ${duckWindows.length} ventana(s)`;
} else if (duckWindows.length && DUCK_MODE === "sidechain") {
  chains.push(`${sfxLabel}asplit=2[sfxout][sfxsc]`);
  sfxLabel = "[sfxout]";
  const ratio = num(Math.max(2, Math.min(20, Math.pow(10, DUCK_DB / 20) * 2)));
  chains.push(
    `${voiceLabel}[sfxsc]sidechaincompress=threshold=0.03:ratio=${ratio}:attack=${num(DUCK_ATTACK * 1000)}:` +
      `release=${num(DUCK_RELEASE * 1000)}:makeup=1:level_sc=1[voice]`,
  );
  voiceLabel = "[voice]";
  duckNote = `sidechain · ratio ${ratio} · OJO: reacciona a TODOS los efectos, ignora duck:false`;
}

// duration=first: la mezcla dura lo que la voz (= el video). Un efecto pegado al final
// se corta ahí, que es lo correcto: el video termina.
chains.push(`${voiceLabel}${sfxLabel}amix=inputs=2:normalize=0:duration=first:dropout_transition=0[aout]`);

const filter = chains.join(";");

// ---- comando ---------------------------------------------------------------
const ffArgs = [
  "-y",
  "-i",
  VIDEO,
  ...inputs,
  "-filter_complex",
  filter,
  "-map",
  "0:v",
  "-map",
  "[aout]",
  "-c:v",
  "copy", // la imagen pasa intacta: acá solo se toca el audio
  "-c:a",
  "aac",
  "-b:a",
  ABITRATE,
  "-movflags",
  "+faststart",
  OUT,
];
const shellCmd =
  "ffmpeg " + ffArgs.map((a) => (/[\s'"$;|&<>()*?]/.test(a) ? `"${a.replace(/"/g, '\\"')}"` : a)).join(" ");

// ---- tabla legible (se muestra ANTES de aplicar) ---------------------------
const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${(s % 60).toFixed(2).padStart(5, "0")}`;
let table = `\nEFECTOS DE SONIDO (mostrar a Sergio antes de aplicar)\n`;
table += `base ${VIDEO}  ${videoDur ? videoDur.toFixed(2) + "s" : "dur ?"}  ${VIDEO_HAS_AUDIO ? "con voz" : "SIN audio"}\n`;
table += `ducking: ${duckNote}\n\n`;
table += `#  | entra   | dur   | gain  | ducking          | cue / archivo\n`;
table += `---+---------+-------+-------+------------------+--------------------------------\n`;
for (const r of rows) {
  table += `${String(r.i).padStart(2)} | ${fmt(r.at)} | ${(r.dur + "s").padEnd(5)} | ${(r.gain + "dB").padEnd(5)} | ${r.duck.padEnd(16)} | ${r.cue}\n`;
}
console.log(table);
console.log("filter_complex:\n" + filter + "\n");
console.log("ffmpeg:\n" + shellCmd + "\n");

if (DRY) {
  console.error("--dry-run: no se corrió nada. Quitá --dry-run para mezclar.");
  process.exit(0);
}

mkdirSync(dirname(resolve(OUT)), { recursive: true });
const res = spawnSync("ffmpeg", ffArgs, { stdio: ["ignore", "inherit", "inherit"] });
if (res.error) fail(`no pude ejecutar ffmpeg: ${res.error.message} (¿está instalado?)`);
if (typeof res.status === "number" && res.status !== 0) fail(`ffmpeg salió con código ${res.status}`);
console.log(`sfx: ${rows.length} efecto(s) mezclado(s) → ${OUT}`);
