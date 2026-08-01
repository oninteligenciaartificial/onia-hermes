// editor-videos — TRANSICIONES: une clips o suaviza los puntos de corte (xfade + acrossfade).
//
// Después de cortar silencios queda un corte SECO en cada costura. Una transición de
// 250-300 ms en esos puntos hace que el video respire sin que se note el editor.
// Todo local con ffmpeg, costo cero.
//
// Tres formas de decirle DÓNDE va la transición:
//   1) --clips a.mp4 b.mp4 c.mp4      unir varios clips (una transición entre cada par)
//   2) --video cut.mp4 --cutplan cutplan.json
//        lee keep[] (salida de cut-plan.mjs) y pone la transición EXACTAMENTE en las
//        costuras del video ya cortado por render-approved.mjs. Es el uso principal.
//   3) --video x.mp4 --seams 3.2,7.8   costuras a mano, en segundos
//
// Uso:
//   node transitions.mjs --video renders/cut.mp4 --cutplan scripts/cutplan.json --out renders/tr.mp4
//   node transitions.mjs --video renders/cut.mp4 --cutplan scripts/cutplan.json --out x.mp4 --dry-run
//   node transitions.mjs --clips a.mp4 b.mp4 --out x.mp4 --transition wipeleft --duration 0.25
//   node transitions.mjs --video cut.mp4 --seams 3.2,7.8 --out x.mp4 --plan tr-plan.json
//
// plan.json (opcional, para variar la transición costura por costura):
//   { "transitions": [ { "at": 1, "type": "wipeleft", "duration": 0.25 } ] }
//   · at   : número de costura, 1-based (la costura 1 está entre el bloque 1 y el 2).
//   · type : una del set de abajo. · duration: segundos.
//   Las costuras que no aparecen usan --transition / --duration.
//
// SET ACOTADO (a propósito: ffmpeg trae ~50 y casi todas se ven a juguete).
//   fade       cross-dissolve neutro. El default. Sirve SIEMPRE; ante la duda, esta.
//   dissolve   disolvencia por ruido, más sucia/orgánica. Para saltar de tema de golpe.
//   wipeleft   barrido hacia la izquierda. Avanza: "y el siguiente punto es…".
//   wiperight  barrido hacia la derecha. Retrocede: volver a algo ya dicho.
//   slideup    el plano nuevo empuja al viejo hacia arriba. Muy natural en 9:16 (es el
//              gesto del feed). La mejor para listas en vertical.
//   slidedown  ídem al revés. Usar poco: en vertical se lee como "deshacer".
//   circleopen iris que abre desde el centro. RESERVAR para el remate / CTA final.
//
// --duration default 0.3s. Corto es lo profesional: arriba de ~0.5s se ve amateur
// (avisa). OJO: cada transición ACORTA el video su propia duración, porque los dos
// bloques se SOLAPAN — así funciona un crossfade de verdad, no se pierde contenido.
//
// Determinista: sin Date.now / Math.random. Sin dependencias externas.
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";

// ---- args ------------------------------------------------------------------
const argv = process.argv.slice(2);
const has = (name) => argv.includes("--" + name);
const flag = (name, def) => {
  const i = argv.indexOf("--" + name);
  return i >= 0 && i + 1 < argv.length && !String(argv[i + 1]).startsWith("--") ? argv[i + 1] : def;
};
// --clips consume TODOS los valores hasta el próximo --flag
const listFlag = (name) => {
  const i = argv.indexOf("--" + name);
  if (i < 0) return null;
  const out = [];
  for (let k = i + 1; k < argv.length && !String(argv[k]).startsWith("--"); k++) out.push(argv[k]);
  return out;
};
const fail = (msg) => {
  console.error("transitions: " + msg);
  process.exit(1);
};

const ALLOWED = ["fade", "dissolve", "wipeleft", "wiperight", "slideup", "slidedown", "circleopen"];

const VIDEO = flag("video");
const CLIPS = listFlag("clips");
const CUTPLAN = flag("cutplan");
const SEAMS = flag("seams");
const OUT = flag("out");
const PLAN = flag("plan");
const DRY = has("dry-run");
const TRANSITION = flag("transition", "fade");
const DURATION = Number(flag("duration", "0.3"));
const CRF = flag("crf", "18");
const PRESET = flag("preset", "veryfast");
const ABITRATE = flag("abitrate", "192k");

if (!OUT) fail("falta --out <out.mp4>");
if (!ALLOWED.includes(TRANSITION)) fail(`--transition "${TRANSITION}" no está en el set. Usá: ${ALLOWED.join(" | ")}`);
if (!(DURATION > 0)) fail("--duration debe ser > 0");
if (DURATION > 0.5) {
  console.error(`transitions: ⚠ AVISO --duration ${DURATION}s es largo. Arriba de 0.5s se ve amateur (200-400ms es lo normal).`);
}
const sources = [VIDEO ? 1 : 0, CLIPS && CLIPS.length ? 1 : 0].reduce((a, b) => a + b, 0);
if (sources !== 1) fail("elegí UNA fuente: --clips a.mp4 b.mp4 …  O  --video <in.mp4> (+ --cutplan | --seams)");
if (VIDEO && !CUTPLAN && !SEAMS) fail("--video necesita --cutplan <cutplan.json> o --seams <s1,s2,…> para saber dónde van las costuras");
if (VIDEO && !existsSync(VIDEO)) fail(`no existe el video: ${VIDEO}`);
if (CUTPLAN && !existsSync(CUTPLAN)) fail(`no existe el cutplan: ${CUTPLAN}`);

// ---- ffprobe ---------------------------------------------------------------
function probe(file, stream, fields) {
  const r = spawnSync(
    "ffprobe",
    ["-v", "error", "-select_streams", stream, "-show_entries", `stream=${fields}`, "-of", "csv=p=0:nk=1", file],
    { encoding: "utf8" },
  );
  if (r.error) fail(`no pude ejecutar ffprobe: ${r.error.message} (¿está instalado?)`);
  if (r.status !== 0) fail(`ffprobe falló sobre ${file}: ${(r.stderr || "").trim()}`);
  return String(r.stdout).trim().split("\n")[0].split(",").map((s) => s.trim());
}
function videoDuration(file) {
  const s = Number(probe(file, "v:0", "duration")[0]);
  if (Number.isFinite(s) && s > 0) return s;
  const r = spawnSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file], { encoding: "utf8" });
  return Number(String(r.stdout).trim()) || 0;
}
function hasAudio(file) {
  const r = spawnSync("ffprobe", ["-v", "error", "-select_streams", "a", "-show_entries", "stream=index", "-of", "csv=p=0", file], { encoding: "utf8" });
  return String(r.stdout).trim().length > 0;
}

const num = (v) => Math.round(Number(v) * 1000) / 1000;

// ---- armar la lista de BLOQUES ---------------------------------------------
// Todo termina en lo mismo: una lista de bloques con duración, que se encadenan con xfade.
const MULTI = Boolean(CLIPS && CLIPS.length);
let blocks = []; // { label, dur, file?, start?, end? }
let W, H, FPS, AUDIO;

if (MULTI) {
  if (CLIPS.length < 2) fail("--clips necesita al menos 2 archivos");
  for (const c of CLIPS) if (!existsSync(c)) fail(`no existe el clip: ${c}`);
  const [w0, h0] = probe(CLIPS[0], "v:0", "width,height").map(Number);
  W = w0;
  H = h0;
  const fr = probe(CLIPS[0], "v:0", "r_frame_rate")[0] || "30/1";
  const [fn, fd] = fr.split("/").map(Number);
  FPS = fd ? fn / fd : fn || 30;
  AUDIO = CLIPS.every(hasAudio);
  if (!AUDIO && CLIPS.some(hasAudio)) {
    console.error("transitions: ⚠ AVISO algunos clips tienen audio y otros no → se descarta el audio.");
  }
  blocks = CLIPS.map((f, i) => ({ file: f, idx: i, dur: videoDuration(f) }));
  blocks.forEach((b, i) => {
    if (!b.dur) fail(`no pude leer la duración de ${CLIPS[i]}`);
  });
} else {
  const [w0, h0] = probe(VIDEO, "v:0", "width,height").map(Number);
  W = w0;
  H = h0;
  const fr = probe(VIDEO, "v:0", "r_frame_rate")[0] || "30/1";
  const [fn, fd] = fr.split("/").map(Number);
  FPS = fd ? fn / fd : fn || 30;
  AUDIO = hasAudio(VIDEO);
  const total = videoDuration(VIDEO);
  if (!total) fail(`no pude leer la duración de ${VIDEO}`);

  let bounds = [];
  if (CUTPLAN) {
    // Las costuras del video YA CORTADO son las sumas acumuladas de keep[]: el bloque k
    // de cut.mp4 dura keep[k].end - keep[k].start. No se lee el crudo, se lee el cortado.
    let plan;
    try {
      plan = JSON.parse(readFileSync(CUTPLAN, "utf8"));
    } catch (err) {
      fail(`--cutplan inválido (${CUTPLAN}): ${err.message}`);
    }
    const keep = Array.isArray(plan.keep) ? plan.keep : Array.isArray(plan) ? plan : null;
    if (!keep || !keep.length) fail("el cutplan no tiene keep[] (¿corriste cut-plan.mjs?)");
    if (keep.length < 2) fail("el cutplan tiene un solo bloque keep[] → no hay ninguna costura donde poner transición");
    let cum = 0;
    for (const k of keep) {
      const d = Number(k.end) - Number(k.start);
      if (!Number.isFinite(d) || d <= 0) fail(`keep[] inválido: ${JSON.stringify(k)}`);
      bounds.push([cum, cum + d]);
      cum += d;
    }
    // El cortado real puede diferir unos frames del cálculo: se recorta al final real.
    if (Math.abs(cum - total) > 0.5) {
      console.error(
        `transitions: ⚠ AVISO el cutplan suma ${num(cum)}s pero ${VIDEO} dura ${num(total)}s ` +
          `(diferencia ${num(Math.abs(cum - total))}s). ¿Es el cut.mp4 de ESE cutplan?`,
      );
    }
    bounds[bounds.length - 1][1] = Math.min(bounds[bounds.length - 1][1], total);
  } else {
    const seams = String(SEAMS)
      .split(",")
      .map((s) => Number(s.trim()))
      .filter((s) => Number.isFinite(s));
    if (!seams.length) fail("--seams no tiene números válidos (ej: --seams 3.2,7.8)");
    for (const s of seams) if (s <= 0 || s >= total) fail(`--seams: ${s}s cae fuera del video (0..${num(total)}s)`);
    const sorted = [...seams].sort((a, b) => a - b);
    let prev = 0;
    for (const s of sorted) {
      bounds.push([prev, s]);
      prev = s;
    }
    bounds.push([prev, total]);
  }
  blocks = bounds.map(([s, e], i) => ({ idx: i, start: s, end: e, dur: e - s }));
}

const N = blocks.length;
if (N < 2) fail("hacen falta al menos 2 bloques para poner una transición");

// ---- transición por costura (plan opcional) --------------------------------
const perSeam = new Array(N - 1).fill(null).map(() => ({ type: TRANSITION, duration: DURATION }));
if (PLAN) {
  if (!existsSync(PLAN)) fail(`no existe el plan: ${PLAN}`);
  let pj;
  try {
    pj = JSON.parse(readFileSync(PLAN, "utf8"));
  } catch (err) {
    fail(`--plan inválido (${PLAN}): ${err.message}`);
  }
  const list = Array.isArray(pj) ? pj : Array.isArray(pj.transitions) ? pj.transitions : null;
  if (!list) fail("el plan necesita { transitions: [ {at,type,duration} ] }");
  for (const t of list) {
    const at = Number(t.at);
    if (!Number.isInteger(at) || at < 1 || at > N - 1) {
      fail(`plan: "at" debe ser un entero entre 1 y ${N - 1} (hay ${N} bloques → ${N - 1} costuras). Recibí ${t.at}`);
    }
    if (t.type !== undefined) {
      if (!ALLOWED.includes(t.type)) fail(`plan: transición "${t.type}" no está en el set. Usá: ${ALLOWED.join(" | ")}`);
      perSeam[at - 1].type = t.type;
    }
    if (t.duration !== undefined) {
      const d = Number(t.duration);
      if (!(d > 0)) fail(`plan: duration debe ser > 0 (costura ${at})`);
      perSeam[at - 1].duration = d;
    }
  }
}

// Clamp: una transición no puede comerse más de la mitad del bloque más corto que toca,
// o xfade se queda sin material y el render sale mal.
perSeam.forEach((s, i) => {
  const maxD = Math.max(0.04, Math.min(blocks[i].dur, blocks[i + 1].dur) / 2 - 0.02);
  if (s.duration > maxD) {
    console.error(
      `transitions: ⚠ AVISO costura ${i + 1}: ${num(s.duration)}s no cabe entre bloques de ` +
        `${num(blocks[i].dur)}s y ${num(blocks[i + 1].dur)}s → ${num(maxD)}s.`,
    );
    s.duration = maxD;
  }
  s.duration = num(s.duration);
});

// ---- filter_complex --------------------------------------------------------
const parts = [];
const vNorm = `scale=${W}:${H}:force_original_aspect_ratio=decrease,pad=${W}:${H}:(ow-iw)/2:(oh-ih)/2,setsar=1,fps=${num(FPS)},format=yuv420p`;

if (MULTI) {
  blocks.forEach((b) => parts.push(`[${b.idx}:v]${vNorm},setpts=PTS-STARTPTS[v${b.idx}]`));
  if (AUDIO) {
    blocks.forEach((b) =>
      parts.push(`[${b.idx}:a]aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo,asetpts=PTS-STARTPTS[a${b.idx}]`),
    );
  }
} else {
  // Un solo archivo: se duplica y se recorta en bloques. trim + setpts a cero es lo que
  // permite que xfade los trate como clips independientes.
  parts.push(`[0:v]split=${N}${blocks.map((b) => `[sv${b.idx}]`).join("")}`);
  blocks.forEach((b) =>
    parts.push(`[sv${b.idx}]trim=start=${num(b.start)}:end=${num(b.end)},setpts=PTS-STARTPTS,${vNorm}[v${b.idx}]`),
  );
  if (AUDIO) {
    parts.push(`[0:a]asplit=${N}${blocks.map((b) => `[sa${b.idx}]`).join("")}`);
    blocks.forEach((b) =>
      parts.push(
        `[sa${b.idx}]atrim=start=${num(b.start)}:end=${num(b.end)},asetpts=PTS-STARTPTS,` +
          `aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo[a${b.idx}]`,
      ),
    );
  }
}

// Cadena de xfade. El `offset` va en la línea de tiempo del ACUMULADO de la izquierda:
// running arranca en la duración del bloque 0 y cada transición le resta su duración,
// porque los dos bloques se solapan.
let running = blocks[0].dur;
let vPrev = "v0";
let aPrev = "a0";
const seamRows = [];
for (let k = 1; k < N; k++) {
  const s = perSeam[k - 1];
  const offset = num(running - s.duration);
  const vOut = k === N - 1 ? "vout" : `vx${k}`;
  parts.push(`[${vPrev}][v${k}]xfade=transition=${s.type}:duration=${s.duration}:offset=${offset}[${vOut}]`);
  vPrev = vOut;
  if (AUDIO) {
    const aOut = k === N - 1 ? "aout" : `ax${k}`;
    parts.push(`[${aPrev}][a${k}]acrossfade=d=${s.duration}:c1=tri:c2=tri[${aOut}]`);
    aPrev = aOut;
  }
  seamRows.push({ k, type: s.type, d: s.duration, at: num(running), offset });
  running = num(running + blocks[k].dur - s.duration);
}

const filter = parts.join(";");
const finalDur = running;

const ffArgs = ["-y"];
if (MULTI) for (const c of CLIPS) ffArgs.push("-i", c);
else ffArgs.push("-i", VIDEO);
ffArgs.push("-filter_complex", filter, "-map", `[${vPrev}]`);
if (AUDIO) ffArgs.push("-map", `[${aPrev}]`, "-c:a", "aac", "-b:a", ABITRATE);
ffArgs.push("-c:v", "libx264", "-preset", PRESET, "-crf", String(CRF), "-pix_fmt", "yuv420p", "-movflags", "+faststart", OUT);
const shellCmd =
  "ffmpeg " + ffArgs.map((a) => (/[\s'"$;|&<>()*?]/.test(a) ? `"${a.replace(/"/g, '\\"')}"` : a)).join(" ");

// ---- tabla legible (se muestra ANTES de aplicar) ---------------------------
const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${(s % 60).toFixed(2).padStart(5, "0")}`;
const totalIn = blocks.reduce((s, b) => s + b.dur, 0);
let table = `\nTRANSICIONES (mostrar a Sergio antes de aplicar)\n`;
table += `fuente ${MULTI ? `${N} clips` : VIDEO}  ${W}×${H} @${num(FPS)}fps  ${AUDIO ? "con audio" : "SIN audio"}\n`;
table += `origen de las costuras: ${MULTI ? "unión de clips" : CUTPLAN ? `cutplan ${CUTPLAN}` : "--seams"}\n\n`;
table += `bloques (${N}):\n`;
blocks.forEach((b, i) => {
  const where = MULTI ? String(b.file).split(/[\\/]/).pop() : `${fmt(b.start)} → ${fmt(b.end)}`;
  table += `  ${String(i + 1).padStart(2)}  ${(num(b.dur) + "s").padEnd(8)} ${where}\n`;
});
table += `\ncostura | en        | transición  | dur    | offset xfade\n`;
table += `--------+-----------+-------------+--------+-------------\n`;
for (const r of seamRows) {
  table += `${String(r.k).padStart(7)} | ${fmt(r.at).padEnd(9)} | ${r.type.padEnd(11)} | ${(r.d + "s").padEnd(6)} | ${r.offset}s\n`;
}
table += `\nduración: ${num(totalIn)}s → ${num(finalDur)}s (los solapes restan ${num(totalIn - finalDur)}s)\n`;
console.log(table);
console.log("filter_complex:\n" + filter + "\n");
console.log("ffmpeg:\n" + shellCmd + "\n");

if (DRY) {
  console.error("--dry-run: no se corrió nada. Quitá --dry-run para renderizar.");
  process.exit(0);
}

mkdirSync(dirname(resolve(OUT)), { recursive: true });
const res = spawnSync("ffmpeg", ffArgs, { stdio: ["ignore", "inherit", "inherit"] });
if (res.error) fail(`no pude ejecutar ffmpeg: ${res.error.message} (¿está instalado?)`);
if (typeof res.status === "number" && res.status !== 0) fail(`ffmpeg salió con código ${res.status}`);
console.log(`transitions: ${seamRows.length} transición(es) → ${OUT}`);
