// editor-videos — APOYOS VISUALES (2/2): pega los PNG sobre el video en el momento exacto.
//
// Segunda mitad del método de Santiago: los apoyos que generó make-mockup.mjs
// (mockups, tarjetas de dato, capturas enmarcadas) entran y salen del video en
// momentos clave, con fade, sin abrir un editor. Una sola pasada de ffmpeg
// filter_complex: 1..N overlays encadenados sobre el mismo base.
//
// Uso:
//   node overlay-visuals.mjs --video raw.mp4 --plan overlay-plan.json --out renders/overlays.mp4
//   node overlay-visuals.mjs --video raw.mp4 --plan overlay-plan.json --out x.mp4 --dry-run
//
// plan.json:
//   { "overlays": [
//       { "asset": "assets/stat.png", "start": 7.0, "end": 12.0,
//         "position": "top", "scale": 0.7, "fade": 0.3 }
//   ] }
//   · position: top | center | bottom | left | right | top-left | top-right |
//               bottom-left | bottom-right   (o x/y propios, ver abajo)
//   · scale: fracción del ANCHO DEL VIDEO que ocupa el apoyo (0.7 = 70% del ancho).
//   · fade:  segundos de fade in y fade out (se recorta si no cabe en la duración).
//   · x / y: opcionales, expresiones ffmpeg crudas (W,H = base; w,h = overlay) que
//            pisan a `position` cuando querés control fino.
//   · marginX / marginY: fracción de W/H de margen al borde (default .05 / .08).
//
// El audio se COPIA (-c:a copy): nunca se re-encodea la voz de Sergio.
// Determinista: sin Date.now / Math.random. Sin dependencias externas.
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";

// ---- args ------------------------------------------------------------------
const argv = process.argv.slice(2);
const has = (name) => argv.includes("--" + name);
const flag = (name, def) => {
  const i = argv.indexOf("--" + name);
  return i >= 0 && i + 1 < argv.length && !String(argv[i + 1]).startsWith("--") ? argv[i + 1] : def;
};
const fail = (msg) => {
  console.error("overlay-visuals: " + msg);
  process.exit(1);
};

const VIDEO = flag("video");
const PLAN = flag("plan");
const OUT = flag("out");
const DRY = has("dry-run");
const CRF = flag("crf", "18");
const PRESET = flag("preset", "veryfast");

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
const overlays = Array.isArray(plan) ? plan : Array.isArray(plan.overlays) ? plan.overlays : null;
if (!overlays) fail("el plan necesita { overlays: [ ... ] }");
if (!overlays.length) fail("el plan no tiene overlays (nada que pegar)");

// ---- ffprobe: dimensiones reales (nada hardcodeado) -------------------------
function probe(file, stream = "v:0", fields = "width,height") {
  const r = spawnSync(
    "ffprobe",
    ["-v", "error", "-select_streams", stream, "-show_entries", `stream=${fields}`, "-of", "csv=p=0:nk=1", file],
    { encoding: "utf8" },
  );
  if (r.error) fail(`no pude ejecutar ffprobe: ${r.error.message} (¿está instalado?)`);
  if (r.status !== 0) fail(`ffprobe falló sobre ${file}: ${(r.stderr || "").trim()}`);
  return String(r.stdout).trim().split("\n")[0].split(",").map((s) => s.trim());
}

const [bw, bh] = probe(VIDEO).map(Number);
if (!Number.isFinite(bw) || !Number.isFinite(bh) || !bw || !bh) fail(`no pude leer el tamaño de ${VIDEO}`);
const fpsRaw = probe(VIDEO, "v:0", "r_frame_rate")[0] || "30/1";
const [fn, fd] = fpsRaw.split("/").map(Number);
const fps = fd ? fn / fd : fn || 30;
const durRaw = probe(VIDEO, "v:0", "duration")[0];
const baseDur = Number(durRaw) || 0;

// ---- posiciones como expresiones ffmpeg (W,H base · w,h overlay) -----------
// Nada de píxeles fijos: si mañana el reel es 1080x1350 o 1920x1080, sigue centrado.
function place(pos, mx, my) {
  const MX = `W*${mx}`;
  const MY = `H*${my}`;
  const cx = "(W-w)/2";
  const cy = "(H-h)/2";
  const left = MX;
  const right = `W-w-${MX}`;
  const top = MY;
  const bottom = `H-h-${MY}`;
  const map = {
    top: [cx, top],
    center: [cx, cy],
    bottom: [cx, bottom],
    left: [left, cy],
    right: [right, cy],
    "top-left": [left, top],
    "top-right": [right, top],
    "bottom-left": [left, bottom],
    "bottom-right": [right, bottom],
  };
  const hit = map[pos];
  if (!hit) fail(`position desconocida "${pos}" (usá: ${Object.keys(map).join(" | ")} — o x/y propios)`);
  return { x: hit[0], y: hit[1] };
}

// ---- secuencias PNG (apoyos ANIMADOS de scripts/remotion) -------------------
// Motivo: el WebM con alpha (vp8/vp9 + yuva420p) que produce scripts/remotion/render.mjs
// es correcto del lado del encoder (Remotion/Chromium graba el canal alpha real,
// verificado con side_data "Matroska BlockAdditional"), pero el ffmpeg local de
// Windows (gyan.dev essentials build) NO decodifica ese alpha al leerlo de vuelta
// (probado: alpha siempre 255 al reconvertir, incluso con -c:v libvpx explícito).
// Por eso `render.mjs --format png-sequence` es la salida recomendada para este
// pipeline: cada frame es un PNG con alpha real (no depende del decoder VP8), y
// overlay-visuals.mjs lo consume acá como secuencia numerada de imágenes.
function isDirAsset(path) {
  return statSync(path).isDirectory();
}
// Detecta el patrón numerado (prefijo, ancho de ceros, extensión) a partir del
// primer archivo — no asumimos "element-%02d.png" a mano: Remotion podría
// cambiar el padding según la cantidad de frames.
function resolveSequence(dir) {
  const files = readdirSync(dir)
    .filter((f) => /\.(png|jpg|jpeg|webp)$/i.test(f))
    .sort();
  if (!files.length) fail(`la carpeta de secuencia está vacía: ${dir}`);
  const m = files[0].match(/^(.*?)(\d+)(\.\w+)$/);
  if (!m) fail(`no reconozco el patrón de nombres en ${dir} (esperaba algo tipo element-00.png)`);
  const [, prefix, digits, ext] = m;
  const width = digits.length;
  const startNumber = parseInt(digits, 10);
  return {
    pattern: join(dir, `${prefix}%0${width}d${ext}`),
    startNumber,
    count: files.length,
    sample: join(dir, files[0]),
  };
}

// ---- construir el filter_complex -------------------------------------------
const num = (v) => Math.round(Number(v) * 1000) / 1000; // 3 decimales: determinista y legible
const chains = [];
const inputs = [];
const rows = [];
let label = "0:v"; // el base arranca como [0:v] y se va encadenando

overlays.forEach((ov, i) => {
  const idx = i + 1; // input 0 = video; 1..N = los PNG
  const asset = ov.asset;
  if (!asset) fail(`overlays[${i}] sin "asset"`);
  if (!existsSync(asset)) fail(`overlays[${i}]: no existe el asset ${asset}`);

  const start = Number(ov.start);
  const end = Number(ov.end);
  if (!Number.isFinite(start) || !Number.isFinite(end)) fail(`overlays[${i}]: start/end deben ser números`);
  if (end <= start) fail(`overlays[${i}]: end (${end}) debe ser > start (${start})`);
  if (baseDur && start >= baseDur) {
    fail(`overlays[${i}]: start ${start}s cae después del final del video (${baseDur.toFixed(2)}s)`);
  }
  if (baseDur && end > baseDur + 0.05) {
    console.error(
      `overlay-visuals: AVISO overlays[${i}] termina en ${end}s pero el video dura ${baseDur.toFixed(2)}s → se corta ahí.`,
    );
  }

  const dur = end - start;
  const scale = Number(ov.scale ?? 0.7);
  if (!(scale > 0) || scale > 3) fail(`overlays[${i}]: scale debe estar entre 0 y 3 (recibí ${ov.scale})`);
  // fade: no puede comerse el clip (dos fades tienen que caber en la duración)
  let fade = Number(ov.fade ?? 0.3);
  if (!Number.isFinite(fade) || fade < 0) fade = 0;
  const maxFade = Math.max(0, (dur - 0.02) / 2);
  if (fade > maxFade) {
    console.error(`overlay-visuals: AVISO overlays[${i}] fade ${fade}s no cabe en ${num(dur)}s → ${num(maxFade)}s`);
    fade = maxFade;
  }

  // apoyo ANIMADO (carpeta = secuencia PNG de scripts/remotion/render.mjs
  // --format png-sequence) vs. apoyo estático (PNG suelto de make-mockup.mjs).
  const isSequence = isDirAsset(asset);
  const seq = isSequence ? resolveSequence(asset) : null;

  // scale: el plan habla en fracción del ANCHO DEL VIDEO (lo que uno espera al
  // escribir 0.7), pero el filtro se escribe como iw*K sobre el PNG. K se calcula
  // con el ancho real del asset (ffprobe) → 0.7 = 70% del ancho del video, siempre.
  const [aw, ah] = probe(seq ? seq.sample : asset, "v:0").map(Number);
  if (!Number.isFinite(aw) || !aw) fail(`overlays[${i}]: no pude leer el tamaño de ${asset}`);
  const targetW = Math.round(bw * scale);
  const k = num(targetW / aw);
  const outW = Math.round(aw * k);
  const outH = Math.round(ah * k);

  // x/y propios pisan a position (control fino para casos raros)
  const mx = Number(ov.marginX ?? 0.05);
  const my = Number(ov.marginY ?? 0.08);
  const pos = ov.position || "center";
  const p = ov.x !== undefined && ov.y !== undefined ? { x: String(ov.x), y: String(ov.y) } : place(pos, mx, my);

  if (isSequence) {
    // Secuencia real: NO se loopea (cada frame ya es distinto). `-framerate`
    // asume que el clip se renderizó al mismo fps que el video base (igual
    // criterio que usa scripts/remotion — ver su README). `-t` acota por las
    // dudas (si el clip quedó más largo que la ventana del overlay).
    const seqDur = seq.count / fps;
    if (Math.abs(seqDur - dur) > 0.15) {
      console.error(
        `overlay-visuals: AVISO overlays[${i}] la secuencia dura ${num(seqDur)}s pero la ventana pide ${num(dur)}s (se corta o se corta antes).`,
      );
    }
    inputs.push(
      "-framerate",
      String(num(fps)),
      "-start_number",
      String(seq.startNumber),
      "-t",
      String(num(end + 0.2)),
      "-i",
      seq.pattern,
    );
  } else {
    // El PNG entra LOOPEADO (-loop 1) para que fade tenga frames sobre los que trabajar:
    // un PNG suelto es UN frame y el alpha nunca animaría.
    // `-t` es OBLIGATORIO: con el loop infinito, overlay (eof_action=repeat) sigue
    // emitiendo frames repitiendo el último del base y el render NO TERMINA NUNCA
    // (probado: 84 MB y subiendo sobre un reel de 38s). Acotar cada PNG a su ventana
    // deja todos los inputs finitos → el grafo termina solo.
    inputs.push("-loop", "1", "-framerate", String(num(fps)), "-t", String(num(end + 0.2)), "-i", asset);
  }

  // format=rgba ANTES del fade: sin canal alpha, fade:alpha=1 no tiene qué animar.
  const steps = [`format=rgba`, `scale=iw*${k}:-2`];
  if (fade > 0) {
    steps.push(`fade=t=in:st=${num(start)}:d=${num(fade)}:alpha=1`);
    steps.push(`fade=t=out:st=${num(end - fade)}:d=${num(fade)}:alpha=1`);
  }
  chains.push(`[${idx}:v]${steps.join(",")}[ov${idx}]`);

  // enable: el overlay solo se compone en su ventana (fuera de ella pasa el base
  // tal cual). Redundante con el fade de alpha, pero evita cualquier sangrado
  // y le ahorra trabajo al compositor en el resto del video.
  // eof_action=pass: cuando el PNG (acotado con -t) termina, el base sigue pasando
  // intacto hasta el final del video en vez de quedar clavado en su último frame.
  const last = i === overlays.length - 1;
  const outLabel = last ? "vout" : `b${idx}`;
  chains.push(
    `[${label}][ov${idx}]overlay=x=${p.x}:y=${p.y}:enable='between(t,${num(start)},${num(end)})':eval=init:eof_action=pass[${outLabel}]`,
  );
  label = outLabel;

  rows.push({
    i: idx,
    asset,
    start: num(start),
    end: num(end),
    dur: num(dur),
    fade: num(fade),
    pos: ov.x !== undefined && ov.y !== undefined ? `x=${ov.x} y=${ov.y}` : pos,
    px: `${outW}×${outH}`,
    pct: Math.round(scale * 100),
  });
});

const filter = chains.join(";");

// ---- comando ---------------------------------------------------------------
const outDir = dirname(resolve(OUT));
const ffArgs = [
  "-y",
  "-i",
  VIDEO,
  ...inputs,
  "-filter_complex",
  filter,
  "-map",
  "[vout]",
  "-map",
  "0:a?", // "?" = si el crudo no tiene audio, no falla
  "-c:v",
  "libx264",
  "-preset",
  PRESET,
  "-crf",
  String(CRF),
  "-pix_fmt",
  "yuv420p",
  "-c:a",
  "copy", // la voz de Sergio pasa intacta
  "-movflags",
  "+faststart",
  OUT,
];
// Forma shell solo para MOSTRAR (el exec real usa argv → sin líos de quoting)
const shellCmd =
  "ffmpeg " +
  ffArgs
    .map((a) => (/[\s'"$;|&<>()*?]/.test(a) ? `"${a.replace(/"/g, '\\"')}"` : a))
    .join(" ");

// ---- tabla legible (REGLA DE ORO: se muestra antes de aplicar) --------------
const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${(s % 60).toFixed(1).padStart(4, "0")}`;
let table = `\nAPOYOS VISUALES (mostrar a Sergio antes de aplicar)\n`;
table += `base ${VIDEO}  ${bw}×${bh} @${num(fps)}fps  ${baseDur ? baseDur.toFixed(2) + "s" : "dur ?"}\n\n`;
table += `#  | entra   | sale    | dur   | fade | posición     | tamaño      | asset\n`;
table += `---+---------+---------+-------+------+--------------+-------------+---------------------------\n`;
for (const r of rows) {
  table += `${String(r.i).padStart(2)} | ${fmt(r.start)} | ${fmt(r.end)} | ${(r.dur + "s").padEnd(5)} | ${(r.fade + "s").padEnd(4)} | ${r.pos.padEnd(12)} | ${(r.px + ` (${r.pct}%)`).padEnd(11)} | ${r.asset.split(/[\\/]/).pop()}\n`;
}
console.log(table);
console.log("filter_complex:\n" + filter + "\n");
console.log("ffmpeg:\n" + shellCmd + "\n");

if (DRY) {
  console.error("--dry-run: no se corrió nada. Quitá --dry-run para renderizar.");
  process.exit(0);
}

mkdirSync(outDir, { recursive: true });
const res = spawnSync("ffmpeg", ffArgs, { stdio: ["ignore", "inherit", "inherit"] });
if (res.error) fail(`no pude ejecutar ffmpeg: ${res.error.message} (¿está instalado?)`);
if (typeof res.status === "number" && res.status !== 0) fail(`ffmpeg salió con código ${res.status}`);
console.log(`overlay-visuals: ${rows.length} apoyo(s) → ${OUT}`);
