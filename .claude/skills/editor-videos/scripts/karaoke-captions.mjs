// editor-videos — FASE 6: subtítulos KARAOKE word-level (estilo creators) quemados con ffmpeg.
//
// Método (elegido a propósito, NO cambiar): se genera un archivo ASS (Advanced SubStation) y se
// quema con `ffmpeg -vf "subtitles=archivo.ass"`. Para el resaltado por palabra NO se usan los tags
// \k de libass (dan problemas de timing): en cambio, para cada FRASE se emite UNA línea Dialogue
// POR PALABRA activa. Cada línea muestra la frase completa y envuelve la palabra activa en un
// override de color (\c). Así el highlight arranca EXACTO en word.start.
//
// Uso:
//   node karaoke-captions.mjs --segments <segments.json> --video <in.mp4> [--out final.mp4]
//     [--ass-out x.ass] [--srt-out x.srt] [--words-per-line 4] [--max-dur 1.6] [--gap-break 0.6]
//     [--margin-v 220] [--font-size N] [--font "Bricolage Grotesque"] [--outline 4] [--shadow 2]
//     [--active-color "#FFFF00"] [--base-color "#FFFFFF"] [--fix "Fergio=Sergio,otro=cosa"]
//     [--no-upper] [--dry-run]
//
//   <segments.json> = { segments:[{start,end,text}], words:[{start,end,word}] }
//   (salida de ver-videos/transcribe.sh — Speaches verbose_json con timestamp_granularities=word)
//
// Por DEFECTO QUEMA el video (es local y gratis). --dry-run solo escribe el .ass e imprime el ffmpeg.
// Determinista: sin Date.now / Math.random.
import { readFile, writeFile, mkdir, copyFile } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join, basename, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// ---------------------------------------------------------------- flags
const args = process.argv.slice(2);
const has = (n) => args.includes("--" + n);
const flag = (n, def) => { const i = args.indexOf("--" + n); return i >= 0 && args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : def; };

const SEGMENTS = flag("segments", args.find((a) => !a.startsWith("--") && /\.json$/i.test(a)));
// ABSOLUTA a propósito: más abajo ffmpeg corre con `cwd: assDir` (para que el filtro
// subtitles encuentre el .ass sin pelear con el escapado de rutas en Windows). Si --video
// llega relativa, ffmpeg la resuelve contra assDir y no la encuentra: el script moría con
// "No such file" aunque el archivo existiera. Roto medido el 2026-07-30 en la cadena del día 1.
const VIDEO = flag("video", null) ? resolve(flag("video")) : null;
if (!SEGMENTS || !VIDEO) {
  console.error("uso: node karaoke-captions.mjs --segments <segments.json> --video <in.mp4> [--out final.mp4] [--dry-run]");
  process.exit(1);
}
if (!existsSync(SEGMENTS)) { console.error("no existe segments: " + SEGMENTS); process.exit(1); }
if (!existsSync(VIDEO)) { console.error("no existe video: " + VIDEO); process.exit(1); }

const videoBase = basename(VIDEO, extname(VIDEO));
const OUT = resolve(flag("out", join(dirname(VIDEO), `${videoBase}-karaoke.mp4`)));
const ASS_OUT = resolve(flag("ass-out", join(dirname(OUT), `${basename(OUT, extname(OUT))}.ass`)));
const SRT_OUT = flag("srt-out", null) ? resolve(flag("srt-out")) : null;
const WORDS_PER_LINE = Math.max(1, Number(flag("words-per-line", "4")));
const MAX_DUR = Number(flag("max-dur", "1.6"));         // s: largo máximo de una frase
const GAP_BREAK = Number(flag("gap-break", "0.6"));     // s: pausa que corta frase (no dejar el sub colgado)
const MARGIN_V = Number(flag("margin-v", "220"));       // px desde abajo (220 = no tapa la cara en 1080x1920)
const MARGIN_H = Number(flag("margin-h", "80"));
// Tipografia de marca (ONIA_BRAND_IDENTITY_2026 §2): el subtitulo es el
// TITULAR del video vertical, asi que va en la display de la marca. Antes era
// "Arial Black", que ademas de no ser de marca depende de que la fuente este
// instalada en la maquina — en el VPS no esta y libass caia a otra cosa.
const FONT = flag("font", "Bricolage Grotesque");
// Archivo de la fuente para libass. ffmpeg NO lee woff2 y no sabe elegir una
// instancia de un variable, por eso se versiona una estatica de peso 700.
const BRAND_FONT_FILE = resolve(
  fileURLToPath(new URL("../../../../", import.meta.url)),
  "hermes-content/brand/fonts/BricolageGrotesque-Bold.ttf",
);
const FONTS_SUBDIR = "_fonts"; // relativo al .ass; se le pasa a libass por fontsdir
const UPPER = !has("no-upper");
const DRY = has("dry-run");
const FIX = flag("fix", "");

// Constantes de agrupación (deterministas): no cortar en puntuación si la frase queda huérfana.
const MIN_WORDS_FOR_PUNCT_BREAK = 2;
const LAST_WORD_MIN = 0.2;   // s: piso de duración de la última palabra de la frase
const LAST_WORD_HOLD = 0.3;  // s: cola extra al final de la frase (recortada si arranca la siguiente)
const MIN_LINE_DUR = 0.02;   // s: por debajo de esto la línea se descarta (timestamps duplicados del ASR)
const MIN_PHRASE_DUR = 0.4;  // s: frase más corta que esto = parpadeo → se fusiona con la siguiente
const MERGE_MAX_GAP = 0.35;  // s: solo fusiono si están pegadas (si hay pausa real, la frase queda)
const MERGE_MAX_WORDS = WORDS_PER_LINE + 2;

// ---------------------------------------------------------------- color helpers (ASS = &HAABBGGRR&)
function toAssColor(v, fallback) {
  if (!v) return fallback;
  const s = String(v).trim();
  if (/^&H[0-9a-fA-F]{6,8}&?$/.test(s)) return s.endsWith("&") ? s : s + "&";
  const hex = s.replace(/^#/, "");
  if (/^[0-9a-fA-F]{6}$/.test(hex)) {
    const rr = hex.slice(0, 2), gg = hex.slice(2, 4), bb = hex.slice(4, 6);
    return `&H00${bb}${gg}${rr}`.toUpperCase() + "&";
  }
  console.error(`color inválido "${v}" → uso ${fallback}`);
  return fallback;
}
// Palabra activa en VERDE DE MARCA (#10C26B, tokens.css --onia-green). Antes era
// amarillo genérico: Sergio 2026-08-22 — "que sea verde por Onia, ese mismo color".
// El subtítulo es la única superficie de marca que el reel tiene en cuadro; si el
// resaltado no es el verde, el video no se lee como nuestro.
// ⚠️ El default va como VALOR del flag, no como fallback: toAssColor() devuelve el
// fallback TAL CUAL, sin convertir. Un "#10C26B" ahí llega crudo al .ass, libass no
// lo entiende y pinta la palabra de NEGRO (bug real, 22-ago — se vio en el frame).
// El fallback queda ya en formato ASS (&HAABBGGRR&, o sea BGR invertido).
const BASE_COLOR = toAssColor(flag("base-color", "#FFFFFF"), "&H00FFFFFF&");   // BLANCO
const ACTIVE_COLOR = toAssColor(flag("active-color", "#10C26B"), "&H006BC210&"); // VERDE ONIA

// ---------------------------------------------------------------- ffprobe: dimensiones + audio
function probe(entries, stream) {
  const r = spawnSync("ffprobe", ["-v", "error", "-select_streams", stream, "-show_entries", entries, "-of", "default=nw=1:nk=1", VIDEO], { encoding: "utf8" });
  if (r.status !== 0) return null;
  return r.stdout.trim().split(/\r?\n/).filter(Boolean);
}
const dims = probe("stream=width,height", "v:0");
let W = 1080, H = 1920;
if (dims && dims.length >= 2) { W = Number(dims[0]); H = Number(dims[1]); }
else console.error("aviso: ffprobe no devolvió dimensiones → asumo 1080x1920");
const audioCodec = (probe("stream=codec_name", "a:0") || [])[0] || null;

// Tamaño de fuente relativo al alto (1920 → 72px). Borde/sombra escalan con la fuente.
// 0.042 del alto (1920 → 81px). Antes 0.0375 (72px): en el feed, compitiendo con
// el resto del scroll, leía chico y sin presencia. El rail de karaoke es el titular
// del reel — tiene que pesar.
const FONT_SIZE = Math.round(Number(flag("font-size", String(Math.max(18, Math.round(H * 0.042))))));
const OUTLINE = Number(flag("outline", String(Math.max(2, Math.round(FONT_SIZE / 18)))));   // 4 @ 72px
const SHADOW = Number(flag("shadow", String(Math.max(1, Math.round(FONT_SIZE / 36)))));     // 2 @ 72px
// Bold=-1 pide una cara bold REAL. La estática que enviamos ya está marcada como
// Bold (usWeightClass 700 + fsSelection), así que libass la matchea y NO aplica
// engorde sintético — el trazo es el dibujo real del peso 700 del tipógrafo.
// Las fuentes que YA son black/heavy (Arial Black) van con 0: pedirles bold
// encima las deja pastosas.
const BOLD = /black|heavy/i.test(FONT) ? 0 : -1;

// ---------------------------------------------------------------- datos
const data = JSON.parse(await readFile(SEGMENTS, "utf8"));
const rawWords = (data.words || []).map((w) => ({ start: +w.start, end: +w.end, word: String(w.word ?? w.text ?? "").trim() }))
  .filter((w) => w.word && Number.isFinite(w.start) && Number.isFinite(w.end))
  .sort((a, b) => a.start - b.start || a.end - b.end);
if (!rawWords.length) { console.error("segments.json sin words[] — el karaoke necesita timestamps por palabra"); process.exit(1); }

// --fix "malo=bueno,otro=cosa": corrige errores del ASR sobre el CORE alfanumérico del token
// (respeta puntuación pegada: "Fergio," → "Sergio,"). Case-insensitive, token completo.
const fixes = new Map();
for (const pair of FIX.split(",").map((s) => s.trim()).filter(Boolean)) {
  const [bad, good] = pair.split("=");
  if (bad && good !== undefined) fixes.set(bad.trim().toLowerCase(), good.trim());
}
let nFixed = 0;
function applyFix(token) {
  if (!fixes.size) return token;
  const m = token.match(/^([^\p{L}\p{N}]*)(.*?)([^\p{L}\p{N}]*)$/u);
  const [, pre, core, post] = m;
  const rep = fixes.get(core.toLowerCase());
  if (rep === undefined) return token;
  nFixed++;
  return pre + rep + post;
}
const words = rawWords.map((w) => {
  const fixed = applyFix(w.word);
  return { ...w, word: UPPER ? fixed.toLocaleUpperCase("es-ES") : fixed };
});

// ---------------------------------------------------------------- agrupar en frases
// máx WORDS_PER_LINE palabras o ~MAX_DUR s (lo que ocurra primero), cortando en puntuación (.,?!…).
const ENDS_PHRASE = /[.,?!…;:]$/u;
// Token que ARRANCA con puntuación ("5" + ".000" del ASR) → se pega sin espacio al anterior.
const STARTS_PUNCT = /^[.,;:!?)»%…\]]/u;
const phrases = [];
let cur = [];
for (let i = 0; i < words.length; i++) {
  const w = words[i];
  cur.push(w);
  const next = words[i + 1];
  const dur = w.end - cur[0].start;
  const gap = next ? next.start - w.end : Infinity;
  const punct = ENDS_PHRASE.test(w.word) && cur.length >= MIN_WORDS_FOR_PUNCT_BREAK;
  const glued = next && STARTS_PUNCT.test(next.word);   // no separar "5" de ".000"
  if (!next || (!glued && (cur.length >= WORDS_PER_LINE || dur >= MAX_DUR || gap > GAP_BREAK || punct))) {
    phrases.push(cur);
    cur = [];
  }
}
if (cur.length) phrases.push(cur);

// Fusionar frases ultra-cortas (parpadeo de 3-4 frames, ej. "O SEA," en 0.10s) hacia la siguiente,
// solo si están pegadas y el resultado no se desborda. Si hay pausa real, la frase se respeta.
const merged = [];
for (let i = 0; i < phrases.length; i++) {
  const p = phrases[i], next = phrases[i + 1];
  const span = p[p.length - 1].end - p[0].start;
  if (next && span < MIN_PHRASE_DUR && next[0].start - p[p.length - 1].end <= MERGE_MAX_GAP
      && p.length + next.length <= MERGE_MAX_WORDS) {
    phrases[i + 1] = [...p, ...next];   // prepend: la frase corta encabeza la siguiente
    continue;
  }
  merged.push(p);
}
phrases.length = 0;
phrases.push(...merged);

// ---------------------------------------------------------------- ASS
// Escapado verificado contra libass (ffmpeg 8.1.1): "\\" → backslash literal, "\{" / "\}" → llaves.
// Orden importante: primero el backslash, después las llaves (si no, se re-escapan las que agrego).
// El campo Text es el ÚLTIMO de la línea Dialogue → las COMAS van literales, no se escapan
// (romperlas sería mutar el texto; el parser lee el resto de la línea tal cual).
function escAss(t) {
  return t.replace(/\\/g, "\\\\").replace(/\{/g, "\\{").replace(/\}/g, "\\}");
}
// Une los tokens de una frase respetando la puntuación pegada ("5" + ".000" → "5.000").
// render(j) permite decorar el token activo sin romper el espaciado.
function joinWords(ws, render = (t) => t) {
  return ws.map((w, j) => (j === 0 || STARTS_PUNCT.test(w.word) ? "" : " ") + render(w.word, j)).join("");
}
function assTime(s) {
  const cs = Math.max(0, Math.round(s * 100));
  const h = Math.floor(cs / 360000);
  const m = Math.floor((cs % 360000) / 6000);
  const sec = Math.floor((cs % 6000) / 100);
  return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}.${String(cs % 100).padStart(2, "0")}`;
}

const header = [
  "[Script Info]",
  "; editor-videos karaoke (ONIA) — una línea Dialogue por palabra activa",
  "ScriptType: v4.00+",
  `PlayResX: ${W}`,
  `PlayResY: ${H}`,
  "WrapStyle: 0",
  "ScaledBorderAndShadow: yes",
  "YCbCr Matrix: TV.709",
  "",
  "[V4+ Styles]",
  "Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding",
  `Style: K,${FONT},${FONT_SIZE},${BASE_COLOR},${ACTIVE_COLOR},&H00000000&,&H80000000&,${BOLD},0,0,0,100,100,0,0,1,${OUTLINE},${SHADOW},2,${MARGIN_H},${MARGIN_H},${MARGIN_V},1`,
  "",
  "[Events]",
  // OJO: MarginV va en el Format de Dialogue (10 campos). Si falta, un campo se corre al Text
  // y aparece una coma fantasma al principio del subtítulo (bug real detectado al probar).
  "Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text",
].join("\n");

const events = [];
let dropped = 0;
for (let p = 0; p < phrases.length; p++) {
  const ws = phrases[p];
  const nextPhraseStart = phrases[p + 1] ? phrases[p + 1][0].start : Infinity;
  // Fin de la frase: piso de duración + cola corta, sin pisar la frase siguiente.
  const last = ws[ws.length - 1];
  let phraseEnd = Math.max(last.end, last.start + LAST_WORD_MIN) + LAST_WORD_HOLD;
  if (phraseEnd > nextPhraseStart) phraseEnd = nextPhraseStart;
  phraseEnd = Math.max(phraseEnd, last.start + MIN_LINE_DUR);

  for (let i = 0; i < ws.length; i++) {
    const start = ws[i].start;
    // Dentro de la frase el rango llega hasta el arranque de la palabra siguiente: el highlight
    // salta exacto en word.start y la frase queda visible sin parpadeo entre palabra y palabra.
    const end = i < ws.length - 1 ? ws[i + 1].start : phraseEnd;
    if (end - start < MIN_LINE_DUR) { dropped++; continue; }  // timestamps duplicados del ASR
    // La palabra activa va envuelta en el override de color; el resto queda en el color base
    // del estilo. Los tags {\c...} se agregan DESPUÉS de escapar (si no, se escaparían sus llaves).
    // La palabra activa cambia SOLO de color de relleno (\1c), al verde de marca.
    // ⚠️ Probado y descartado el 22-ago: engrosar el borde de la activa (\bord ×1.35)
    // la tapa por completo — con 4px de outline negro sobre 72px de fuente, el trazo
    // se come el glifo y la palabra sale como un bloque negro. Se vio en el frame de
    // control, no en el código. El énfasis lo hace el color; el borde no se toca.
    // Tampoco \alpha (setea los cuatro canales, incluido el del borde) ni \fscx
    // (re-centra la línea y hace saltar las palabras).
    const text = joinWords(ws, (word, j) =>
      j === i ? `{\\1c${ACTIVE_COLOR}}${escAss(word)}{\\1c${BASE_COLOR}}` : escAss(word));
    events.push(`Dialogue: 0,${assTime(start)},${assTime(end)},K,,0,0,0,,${text}`);
  }
}
const ass = header + "\n" + events.join("\n") + "\n";
await mkdir(dirname(ASS_OUT), { recursive: true });
await writeFile(ASS_OUT, ass, "utf8");

// ---------------------------------------------------------------- SRT opcional (frase, sin karaoke)
if (SRT_OUT) {
  const srtTime = (s) => {
    const ms = Math.max(0, Math.round(s * 1000));
    const h = Math.floor(ms / 3600000), m = Math.floor((ms % 3600000) / 60000), sec = Math.floor((ms % 60000) / 1000);
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")},${String(ms % 1000).padStart(3, "0")}`;
  };
  const cues = phrases.map((ws, i) => {
    const nextStart = phrases[i + 1] ? phrases[i + 1][0].start : Infinity;
    const last = ws[ws.length - 1];
    const end = Math.min(Math.max(last.end, last.start + LAST_WORD_MIN) + LAST_WORD_HOLD, nextStart);
    return `${i + 1}\n${srtTime(ws[0].start)} --> ${srtTime(end)}\n${joinWords(ws)}\n`;
  });
  await mkdir(dirname(SRT_OUT), { recursive: true });
  await writeFile(SRT_OUT, cues.join("\n"), "utf8");
}

// ---------------------------------------------------------------- ffmpeg
// Se corre con cwd = carpeta del .ass y nombre relativo: así se evita el escapado infernal de
// "C:\..." dentro del filtro subtitles= en Windows (los dos puntos y el backslash lo rompen).
const assDir = dirname(ASS_OUT), assName = basename(ASS_OUT);
const audioArgs = audioCodec && /^(aac|mp3|opus)$/.test(audioCodec) ? ["-c:a", "copy"] : ["-c:a", "aac", "-b:a", "192k"];

// La fuente se COPIA junto al .ass y se le pasa a libass por `fontsdir`. Sin
// esto libass la busca en las fuentes INSTALADAS del sistema: en Windows
// encontraba una cosa y en el VPS otra (o ninguna), y el subtítulo cambiaba de
// dibujo según la máquina. Con fontsdir el archivo viaja con el render.
// Va en un subdirectorio relativo a propósito: cwd de ffmpeg ya es assDir, así
// se esquiva el escapado de rutas absolutas de Windows dentro del filtro (los
// dos puntos de "C:" y las barras invertidas lo rompen).
const fontsDirAbs = join(assDir, FONTS_SUBDIR);
if (!DRY) {
  if (!existsSync(BRAND_FONT_FILE)) {
    console.error(`no existe la fuente de marca: ${BRAND_FONT_FILE}\ncorré: python hermes-content/brand/fonts/build-onia-fonts.py`);
    process.exit(1);
  }
  await mkdir(fontsDirAbs, { recursive: true });
  await copyFile(BRAND_FONT_FILE, join(fontsDirAbs, basename(BRAND_FONT_FILE)));
}

const vf = `subtitles=${assName}:fontsdir=${FONTS_SUBDIR}`;
const ffArgs = ["-y", "-hide_banner", "-i", VIDEO, "-vf", vf,
  "-c:v", "libx264", "-preset", "veryfast", "-crf", "20", "-pix_fmt", "yuv420p",
  ...audioArgs, "-movflags", "+faststart", OUT];
// Versión copy-paste (path del .ass escapado como lo quiere el filtro: / y \: )
const assFilterPath = ASS_OUT.replace(/\\/g, "/").replace(/:/g, "\\:");
const fontsFilterPath = fontsDirAbs.replace(/\\/g, "/").replace(/:/g, "\\:");
const ffPrintable = `ffmpeg -y -i "${VIDEO}" -vf "subtitles=${assFilterPath}:fontsdir=${fontsFilterPath}" -c:v libx264 -preset veryfast -crf 20 -pix_fmt yuv420p ${audioArgs.join(" ")} -movflags +faststart "${OUT}"`;

// ---------------------------------------------------------------- resumen (REGLA DE ORO: mostrar antes)
const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${(s % 60).toFixed(2).padStart(5, "0")}`;
console.log(`\nKARAOKE word-level — ${W}x${H}, fuente ${FONT} ${FONT_SIZE}px, outline ${OUTLINE}, shadow ${SHADOW}, MarginV ${MARGIN_V}`);
console.log(`base ${BASE_COLOR}  activa ${ACTIVE_COLOR}   agrupado: máx ${WORDS_PER_LINE} palabras / ${MAX_DUR}s / pausa > ${GAP_BREAK}s / puntuación\n`);
console.log("#   | t             | frase");
console.log("----+---------------+------------------------------------------------");
phrases.forEach((ws, i) => {
  const t = `${fmt(ws[0].start)}→${fmt(ws[ws.length - 1].end)}`;
  console.log(`${String(i + 1).padStart(3)} | ${t.padEnd(13)} | ${joinWords(ws)}`);
});
console.log(`\nfrases: ${phrases.length}   palabras: ${words.length}   líneas ASS: ${events.length}${dropped ? ` (${dropped} descartadas por timestamp duplicado)` : ""}${fixes.size ? `   --fix aplicado: ${nFixed} token(s)` : ""}`);
console.log(`ass: ${ASS_OUT}`);
if (SRT_OUT) console.log(`srt: ${SRT_OUT}`);

if (DRY) {
  console.log(`\n--dry-run (no quemo). ffmpeg:\n${ffPrintable}\n`);
  process.exit(0);
}

await mkdir(dirname(OUT), { recursive: true });
console.log(`\nquemando (${audioArgs[1] === "copy" ? "audio copy" : "audio → aac"})…`);
const r = spawnSync("ffmpeg", ffArgs, { cwd: assDir, stdio: ["ignore", "inherit", "inherit"] });
if (r.status !== 0) {
  console.error(`\nffmpeg falló (status ${r.status}). Comando:\n${ffPrintable}`);
  process.exit(r.status || 1);
}
const size = existsSync(OUT) ? statSync(OUT).size : 0;
const outDur = spawnSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", OUT], { encoding: "utf8" }).stdout.trim();
console.log(`\nmp4: ${OUT}  (${(size / 1048576).toFixed(1)} MB, ${outDur || "?"}s)`);
