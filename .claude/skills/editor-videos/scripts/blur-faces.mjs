// editor-videos — CENSURAR CARAS: difumina caras a lo largo del video (proteger a terceros).
//
// Para publicar material donde aparece gente que NO dio permiso: pacientes en una clínica,
// gente en la calle, un tercero que cruza el plano. Acá la SEGURIDAD importa más que la
// prolijidad: es mejor difuminar de más que destapar una cara un frame.
//
// ffmpeg no detecta caras, solo difumina rectángulos. La detección la pone
// `blur-faces-detect.py` (OpenCV / YuNet); este script hace el SEGUIMIENTO, el relleno
// y arma el ffmpeg. Todo local, costo cero.
//
// Uso:
//   node blur-faces.mjs --video in.mp4 --out out.mp4
//   node blur-faces.mjs --video in.mp4 --out out.mp4 --mode pixelate --strength 1.4
//   node blur-faces.mjs --video in.mp4 --out out.mp4 --report det.json --dry-run
//   node blur-faces.mjs --video in.mp4 --out out.mp4 --manual regiones.json
//   node blur-faces.mjs --video in.mp4 --out out.mp4 --manual regiones.json --also-detect
//
// --manual <json>  (SIEMPRE disponible: no necesita OpenCV ni Python)
//   { "regions": [ { "x": 100, "y": 220, "w": 300, "h": 340, "start": 0, "end": 12.5 } ] }
//   Coordenadas en píxeles del video, tiempos en segundos. Por defecto --manual REEMPLAZA
//   a la detección (es la salida para cuando la detección falla); con --also-detect se
//   suman las dos.
//
// Flags:
//   --mode blur|pixelate|box   cómo se tapa (default blur). `box` = rectángulo sólido,
//                              el único 100% irreversible; `pixelate` es más fuerte que blur.
//   --strength <n>             multiplicador de la fuerza del tapado (default 1.0)
//   --padding <f>              margen alrededor de la caja, fracción POR LADO (default 0.25).
//                              Mínimo recomendado 0.20 — abajo de eso avisa.
//   --every <n>                detectar 1 de cada N frames (default 5)
//   --hold <seg>               relleno hacia adelante: seguir tapando la última posición
//                              conocida N segundos tras perder la cara (default 0.6)
//   --lead <seg>               empezar a tapar N segundos antes de la primera detección (default 0.2)
//   --score <0..1>             confianza mínima del detector (default 0.55)
//   --iou <0..1>               umbral para considerar que dos cajas son la misma cara (default 0.2)
//   --drift <n>                cuánto puede crecer la caja-unión antes de abrir un tramo
//                              nuevo (default 1.6 = 60% más de área)
//   --detector yunet|haar      default yunet
//   --model <onnx>             default assets/models/face_detection_yunet_2023mar.onnx
//   --max-side <px>            resolución a la que se detecta (default 640; 0 = full res)
//   --report <json>            volcar detecciones + tracks + tramos (auditable)
//   --python <exe>             intérprete (default python)
//   --dry-run                  imprime el ffmpeg y no ejecuta nada
//
// ⚠ La detección automática NO es garantía. Ver el README de la skill: siempre revisar
//   el resultado antes de publicar. Este script imprime cuántos frames tuvieron detección
//   y cuáles NO, y los tramos de tiempo sin cobertura.
//
// El audio se COPIA (-c:a copy). Determinista: sin Date.now / Math.random.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// ---- args ------------------------------------------------------------------
const argv = process.argv.slice(2);
const has = (name) => argv.includes("--" + name);
const flag = (name, def) => {
  const i = argv.indexOf("--" + name);
  return i >= 0 && i + 1 < argv.length && !String(argv[i + 1]).startsWith("--") ? argv[i + 1] : def;
};
const fail = (msg) => {
  console.error("blur-faces: " + msg);
  process.exit(1);
};

const HERE = dirname(fileURLToPath(import.meta.url));
const VIDEO = flag("video");
const OUT = flag("out");
const DRY = has("dry-run");
const MODE = flag("mode", "blur");
const STRENGTH = Number(flag("strength", "1"));
const PADDING = Number(flag("padding", "0.25"));
const EVERY = Number(flag("every", "5"));
const HOLD = Number(flag("hold", "0.6"));
const LEAD = Number(flag("lead", "0.2"));
const SCORE = Number(flag("score", "0.55"));
const IOU = Number(flag("iou", "0.2"));
const DRIFT = Number(flag("drift", "1.6"));
const DETECTOR = flag("detector", "yunet");
const MODEL = flag("model", resolve(HERE, "../assets/models/face_detection_yunet_2023mar.onnx"));
const MAX_SIDE = flag("max-side", "640");
const REPORT = flag("report");
const PYTHON = flag("python", "python");
const MANUAL = flag("manual");
const ALSO_DETECT = has("also-detect");
const CRF = flag("crf", "18");
const PRESET = flag("preset", "veryfast");

if (!VIDEO) fail("falta --video <in.mp4>");
if (!OUT) fail("falta --out <out.mp4>");
if (!existsSync(VIDEO)) fail(`no existe el video: ${VIDEO}`);
if (!["blur", "pixelate", "box"].includes(MODE)) fail(`--mode debe ser blur | pixelate | box (recibí "${MODE}")`);
if (!(STRENGTH > 0)) fail("--strength debe ser > 0");
if (!(PADDING >= 0)) fail("--padding debe ser >= 0");
if (PADDING < 0.2) {
  console.error(
    `blur-faces: ⚠ AVISO --padding ${PADDING} está por debajo del mínimo recomendado (0.20). ` +
      `Con poco margen la cara se asoma por el borde cuando la persona se mueve.`,
  );
}
if (!(EVERY >= 1)) fail("--every debe ser >= 1");
if (!(HOLD >= 0) || !(LEAD >= 0)) fail("--hold y --lead deben ser >= 0");
if (MANUAL && !existsSync(MANUAL)) fail(`no existe el json de regiones manuales: ${MANUAL}`);

const DO_DETECT = !MANUAL || ALSO_DETECT;

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
const [BW, BH] = probe(VIDEO, "v:0", "width,height").map(Number);
if (!BW || !BH) fail(`no pude leer el tamaño de ${VIDEO}`);
const fpsRaw = probe(VIDEO, "v:0", "r_frame_rate")[0] || "30/1";
const [fn, fd] = fpsRaw.split("/").map(Number);
const FPS = fd ? fn / fd : fn || 30;
const VDUR = Number(probe(VIDEO, "v:0", "duration")[0]) || 0;

const num = (v) => Math.round(Number(v) * 1000) / 1000;

// ---- 1. detección ----------------------------------------------------------
let detection = null;
if (DO_DETECT) {
  if (DETECTOR === "yunet" && !existsSync(MODEL)) {
    fail(
      `no encuentro el modelo YuNet: ${MODEL}\n` +
        `  Bajarlo (232 KB, opencv_zoo oficial, gratis):\n` +
        `  curl -sL -o "${MODEL}" https://github.com/opencv/opencv_zoo/raw/main/models/face_detection_yunet/face_detection_yunet_2023mar.onnx\n` +
        `  O usá --manual <regiones.json> (no necesita modelo ni OpenCV).`,
    );
  }
  const pyScript = resolve(HERE, "blur-faces-detect.py");
  if (!existsSync(pyScript)) fail(`falta el detector: ${pyScript}`);
  const pyArgs = [
    pyScript,
    "--video", VIDEO,
    "--every", String(EVERY),
    "--score", String(SCORE),
    "--max-side", String(MAX_SIDE),
    "--detector", DETECTOR,
  ];
  if (DETECTOR === "yunet") pyArgs.push("--model", MODEL);
  console.error(`blur-faces: detectando caras (${DETECTOR}, 1 de cada ${EVERY} frames)…`);
  const r = spawnSync(PYTHON, pyArgs, { encoding: "utf8", maxBuffer: 256 * 1024 * 1024 });
  if (r.error) fail(`no pude ejecutar ${PYTHON}: ${r.error.message}`);
  if (r.status !== 0) fail(`el detector falló:\n${(r.stderr || "").trim()}`);
  try {
    detection = JSON.parse(r.stdout);
  } catch (err) {
    fail(`el detector no devolvió JSON válido: ${err.message}\n${(r.stderr || "").slice(0, 500)}`);
  }
}

// ---- 2. seguimiento: agrupar detecciones en tracks --------------------------
// Una cara que se mueve entre muestras sigue siendo la misma cara. Se asocia por IoU
// (o cercanía de centros, para movimientos rápidos donde las cajas ya no se solapan).
// Un track se CIERRA si pasa más de --hold sin detección: eso acota el hueco máximo que
// puede haber dentro de un track, y por lo tanto el tamaño de la caja-unión.
function iou(a, b) {
  const x1 = Math.max(a.x, b.x);
  const y1 = Math.max(a.y, b.y);
  const x2 = Math.min(a.x + a.w, b.x + b.w);
  const y2 = Math.min(a.y + a.h, b.y + b.h);
  const inter = Math.max(0, x2 - x1) * Math.max(0, y2 - y1);
  const uni = a.w * a.h + b.w * b.h - inter;
  return uni > 0 ? inter / uni : 0;
}
function nearCenters(a, b) {
  const dx = a.x + a.w / 2 - (b.x + b.w / 2);
  const dy = a.y + a.h / 2 - (b.y + b.h / 2);
  return Math.hypot(dx, dy) < 0.6 * Math.max(a.w, a.h, b.w, b.h);
}

const dtSample = EVERY / FPS;
// Un track se cierra tras --hold sin detección, PERO nunca antes de un par de intervalos
// de muestreo: con --every 5 sobre 8fps las muestras están a 0.625s y un --hold de 0.6s
// cerraría el track en CADA muestra, partiendo una sola cara en N tracks de 1 punto
// (medido: 4 tracks para 4 detecciones de la misma cara). El piso lo arregla.
const CLOSE_AFTER = Math.max(HOLD, dtSample * 2.5);

const tracks = [];
let noDetectRanges = [];
if (detection) {
  const open = [];
  let gapStart = null;
  for (const s of detection.sampled) {
    // Cerrar tracks que llevan demasiado sin actualizarse.
    for (let i = open.length - 1; i >= 0; i--) {
      if (s.t - open[i].lastT > CLOSE_AFTER) open.splice(i, 1);
    }
    const free = new Set(open);
    for (const f of s.faces) {
      let best = null;
      let bestScore = 0;
      for (const tr of free) {
        const ov = iou(tr.lastBox, f);
        const near = ov > 0 ? ov : nearCenters(tr.lastBox, f) ? IOU : 0;
        if (near >= IOU && near > bestScore) {
          best = tr;
          bestScore = near;
        }
      }
      if (!best) {
        best = { id: tracks.length + 1, points: [], lastT: s.t, lastBox: f };
        tracks.push(best);
        open.push(best);
      }
      free.delete(best);
      best.points.push({ t: s.t, x: f.x, y: f.y, w: f.w, h: f.h, score: f.score });
      best.lastT = s.t;
      best.lastBox = f;
    }
    // Registrar tramos muestreados SIN ninguna cara (para el reporte de honestidad).
    if (!s.faces.length) {
      if (gapStart === null) gapStart = s.t;
    } else if (gapStart !== null) {
      noDetectRanges.push([gapStart, s.t]);
      gapStart = null;
    }
  }
  if (gapStart !== null) noDetectRanges.push([gapStart, VDUR || gapStart]);
}

// ---- 3. tramos de caja fija (la "interpolación") ---------------------------
// En vez de mover la caja frame a frame (parpadea y obliga a expresiones gigantes),
// cada track se parte en TRAMOS y cada tramo usa la caja-UNIÓN de todas sus detecciones.
// Así la cara nunca se sale del rectángulo dentro del tramo — incluso en los frames que
// no se muestrearon, y también en los huecos donde el detector no vio nada. Se abre un
// tramo nuevo recién cuando la unión crece más de --drift, o sea cuando la persona se
// movió de verdad. Un talking-head estático colapsa a 1-3 tramos.
const area = (b) => b.w * b.h;
const unionBox = (a, b) => {
  const x = Math.min(a.x, b.x);
  const y = Math.min(a.y, b.y);
  return { x, y, w: Math.max(a.x + a.w, b.x + b.w) - x, h: Math.max(a.y + a.h, b.y + b.h) - y };
};

function chunkTrack(tr) {
  const groups = [];
  let cur = null;
  for (const p of tr.points) {
    if (!cur) {
      cur = { pts: [p], box: { x: p.x, y: p.y, w: p.w, h: p.h } };
      continue;
    }
    const merged = unionBox(cur.box, p);
    const avg = (cur.pts.reduce((s, q) => s + area(q), 0) + area(p)) / (cur.pts.length + 1);
    if (area(merged) <= DRIFT * avg) {
      cur.pts.push(p);
      cur.box = merged;
    } else {
      groups.push(cur);
      cur = { pts: [p], box: { x: p.x, y: p.y, w: p.w, h: p.h } };
    }
  }
  if (cur) groups.push(cur);

  // Ventanas de tiempo: los tramos se SOLAPAN a propósito (±dtSample). Preferimos
  // difuminar de más en la costura antes que dejar un frame destapado entre dos tramos.
  return groups.map((g, k) => {
    const first = g.pts[0].t;
    const nextFirst = k + 1 < groups.length ? groups[k + 1].pts[0].t : null;
    const start = k === 0 ? first - LEAD : first - dtSample;
    const end = nextFirst === null ? g.pts[g.pts.length - 1].t + HOLD : nextFirst + dtSample;
    return { track: tr.id, box: g.box, start, end, points: g.pts.length, source: "auto" };
  });
}

let chunks = [];
for (const tr of tracks) chunks = chunks.concat(chunkTrack(tr));

// ---- regiones manuales (siempre disponibles, sin OpenCV) -------------------
let manualCount = 0;
if (MANUAL) {
  let mj;
  try {
    mj = JSON.parse(readFileSync(MANUAL, "utf8"));
  } catch (err) {
    fail(`--manual inválido (${MANUAL}): ${err.message}`);
  }
  const regions = Array.isArray(mj) ? mj : Array.isArray(mj.regions) ? mj.regions : null;
  if (!regions) fail("el json de --manual necesita { regions: [ {x,y,w,h,start,end} ] }");
  if (!regions.length) fail("--manual no tiene regiones");
  regions.forEach((r, i) => {
    for (const k of ["x", "y", "w", "h", "start", "end"]) {
      if (!Number.isFinite(Number(r[k]))) fail(`--manual regions[${i}]: falta o es inválido "${k}"`);
    }
    if (Number(r.end) <= Number(r.start)) fail(`--manual regions[${i}]: end debe ser > start`);
    if (Number(r.w) <= 0 || Number(r.h) <= 0) fail(`--manual regions[${i}]: w y h deben ser > 0`);
    chunks.push({
      track: `M${i + 1}`,
      box: { x: Number(r.x), y: Number(r.y), w: Number(r.w), h: Number(r.h) },
      start: Number(r.start),
      end: Number(r.end),
      points: 0,
      source: "manual",
      // Las regiones manuales YA vienen dadas por una persona mirando el video:
      // no se les aplica el padding automático, se respetan tal cual.
      noPad: true,
    });
    manualCount += 1;
  });
}

if (!chunks.length) {
  fail(
    "no hay NADA que tapar: el detector no encontró caras y no se pasaron regiones manuales.\n" +
      "  NO se generó ningún archivo — sacar un video sin censurar creyendo que está censurado es peor.\n" +
      "  Opciones: bajar --score (ej. 0.35), bajar --every (ej. 2), --max-side 0 (detectar a full res),\n" +
      "  o pasar --manual <regiones.json>.",
  );
}

// ---- 4. padding + clamp a los bordes ---------------------------------------
// El padding se aplica POR LADO. Arriba va más (x1.6): YuNet devuelve la caja de la CARA,
// que arranca cerca de las cejas — el pelo y la frente quedan afuera si no se estira.
const even = (n) => (n % 2 ? n + 1 : n);
for (const c of chunks) {
  if (!c.noPad) {
    const px = c.box.w * PADDING;
    const pyBot = c.box.h * PADDING;
    const pyTop = c.box.h * PADDING * 1.6;
    c.box = { x: c.box.x - px, y: c.box.y - pyTop, w: c.box.w + 2 * px, h: c.box.h + pyTop + pyBot };
  }
  let x = Math.max(0, Math.floor(c.box.x));
  let y = Math.max(0, Math.floor(c.box.y));
  let w = Math.min(BW - x, even(Math.ceil(c.box.w)));
  let h = Math.min(BH - y, even(Math.ceil(c.box.h)));
  w = even(Math.max(2, w - (w % 2)));
  h = even(Math.max(2, h - (h % 2)));
  if (x + w > BW) w = even(BW - x - ((BW - x) % 2));
  if (y + h > BH) h = even(BH - y - ((BH - y) % 2));
  c.px = { x, y, w: Math.max(2, w), h: Math.max(2, h) };
  c.start = Math.max(0, num(c.start));
  c.end = num(VDUR ? Math.min(c.end, VDUR) : c.end);
}
chunks = chunks.filter((c) => c.end > c.start && c.px.w >= 2 && c.px.h >= 2);
chunks.sort((a, b) => a.start - b.start || String(a.track).localeCompare(String(b.track)));

// ---- 5. filtro ffmpeg ------------------------------------------------------
function coverFilter(w, h) {
  if (MODE === "pixelate") {
    // El tamaño del intermedio ES la cantidad de bloques a lo ancho: bajar a 8 px y volver
    // a subir con `neighbor` deja 8 bloques. 8 es el default POR SEGURIDAD, medido sobre un
    // frame real: con ~27 bloques ojos, nariz y boca se siguen leyendo y la persona es
    // perfectamente reconocible; con 8 (la cara ocupa ~5) deja de serlo. Más fuerza = MENOS
    // bloques. El alto se deriva del ancho para que los bloques queden cuadrados.
    const across = Math.max(3, Math.round(8 / STRENGTH));
    const pw = Math.max(2, across);
    const ph = Math.max(2, Math.round((across * h) / w));
    return `scale=${pw}:${ph}:flags=neighbor,scale=${w}:${h}:flags=neighbor`;
  }
  // boxblur con power alto ≈ gaussiano y es barato. El radio se limita a la mitad del
  // lado menor (el filtro lo exige) y el croma a la mitad del radio (plano submuestreado).
  const cap = Math.max(1, Math.floor(Math.min(w, h) / 2) - 1);
  const r = Math.max(3, Math.min(cap, Math.round(Math.min(w, h) * 0.14 * STRENGTH)));
  const rc = Math.max(1, Math.floor(r / 2));
  return `boxblur=luma_radius=${r}:luma_power=3:chroma_radius=${rc}:chroma_power=3`;
}

let filter;
if (MODE === "box") {
  // Rectángulo sólido: una sola cadena, sin split ni overlay. Es el modo más barato
  // y el único donde la información de abajo desaparece de verdad.
  filter =
    "[0:v]" +
    chunks
      .map(
        (c) =>
          `drawbox=x=${c.px.x}:y=${c.px.y}:w=${c.px.w}:h=${c.px.h}:color=black@1:t=fill:` +
          `enable='between(t,${c.start},${c.end})'`,
      )
      .join(",") +
    "[vout]";
} else {
  const parts = [];
  const labels = chunks.map((_, i) => `[k${i + 1}]`).join("");
  parts.push(`[0:v]split=${chunks.length + 1}[base]${labels}`);
  chunks.forEach((c, i) => {
    parts.push(`[k${i + 1}]crop=${c.px.w}:${c.px.h}:${c.px.x}:${c.px.y},${coverFilter(c.px.w, c.px.h)}[b${i + 1}]`);
  });
  let prev = "base";
  chunks.forEach((c, i) => {
    const outLabel = i === chunks.length - 1 ? "vout" : `o${i + 1}`;
    parts.push(
      `[${prev}][b${i + 1}]overlay=x=${c.px.x}:y=${c.px.y}:enable='between(t,${c.start},${c.end})':eval=init[${outLabel}]`,
    );
    prev = outLabel;
  });
  filter = parts.join(";");
}

const ffArgs = [
  "-y",
  "-i", VIDEO,
  "-filter_complex", filter,
  "-map", "[vout]",
  "-map", "0:a?",
  "-c:v", "libx264",
  "-preset", PRESET,
  "-crf", String(CRF),
  "-pix_fmt", "yuv420p",
  "-c:a", "copy",
  "-movflags", "+faststart",
  OUT,
];
const shellCmd =
  "ffmpeg " + ffArgs.map((a) => (/[\s'"$;|&<>()*?]/.test(a) ? `"${a.replace(/"/g, '\\"')}"` : a)).join(" ");

// ---- 6. tabla + HONESTIDAD -------------------------------------------------
const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${(s % 60).toFixed(2).padStart(5, "0")}`;

// Cobertura temporal: fracción del video que queda tapada por AL MENOS un tramo.
const merged = [];
for (const c of [...chunks].sort((a, b) => a.start - b.start)) {
  const last = merged[merged.length - 1];
  if (last && c.start <= last[1]) last[1] = Math.max(last[1], c.end);
  else merged.push([c.start, c.end]);
}
const covered = merged.reduce((s, [a, b]) => s + (b - a), 0);
const uncovered = [];
let cur = 0;
for (const [a, b] of merged) {
  if (a > cur + 0.001) uncovered.push([cur, a]);
  cur = Math.max(cur, b);
}
if (VDUR && cur < VDUR - 0.001) uncovered.push([cur, VDUR]);

let table = `\nCENSURA DE CARAS (mostrar a Sergio antes de publicar)\n`;
table += `base ${VIDEO}  ${BW}×${BH} @${num(FPS)}fps  ${VDUR ? VDUR.toFixed(2) + "s" : "dur ?"}\n`;
table += `modo ${MODE} · fuerza ${STRENGTH} · padding ${PADDING} por lado (arriba ×1.6) · lead ${LEAD}s · hold ${HOLD}s\n\n`;
table += `#  | track | desde   | hasta   | caja (x,y,w,h)          | det | origen\n`;
table += `---+-------+---------+---------+-------------------------+-----+-------\n`;
chunks.forEach((c, i) => {
  const box = `${c.px.x},${c.px.y},${c.px.w},${c.px.h}`;
  table += `${String(i + 1).padStart(2)} | ${String(c.track).padStart(5)} | ${fmt(c.start)} | ${fmt(c.end)} | ${box.padEnd(23)} | ${String(c.points).padStart(3)} | ${c.source}\n`;
});
console.log(table);

console.log("HONESTIDAD — qué vio realmente el detector:");
if (detection) {
  const st = detection.stats;
  const pct = st.sampled_frames ? ((st.frames_with_face / st.sampled_frames) * 100).toFixed(1) : "0.0";
  console.log(`  detector       : ${detection.detector} (score >= ${detection.score_min}, 1 de cada ${detection.every} frames, detectado a ${Math.round(detection.detect_scale * 100)}% de resolución)`);
  console.log(`  frames CON cara: ${st.frames_with_face} / ${st.sampled_frames} muestreados (${pct}%) · ${st.total_faces} detecciones`);
  console.log(`  frames SIN cara: ${st.frames_without_face}`);
  if (noDetectRanges.length) {
    console.log(`  tramos muestreados sin ninguna detección (${noDetectRanges.length}):`);
    for (const [a, b] of noDetectRanges.slice(0, 12)) console.log(`     ${fmt(a)} → ${fmt(b)}`);
    if (noDetectRanges.length > 12) console.log(`     … y ${noDetectRanges.length - 12} más`);
  }
} else {
  console.log("  detección automática: NO se corrió (modo --manual).");
}
console.log(`  tracks         : ${tracks.length} · tramos: ${chunks.length} (${manualCount} manual(es))`);
console.log(
  `  cobertura      : ${num(covered)}s de ${VDUR ? num(VDUR) : "?"}s` +
    (VDUR ? ` (${((covered / VDUR) * 100).toFixed(1)}%)` : ""),
);
if (uncovered.length) {
  console.log(`  ⚠ SIN TAPAR (${uncovered.length} tramo/s) — revisar a mano si ahí aparece alguien:`);
  for (const [a, b] of uncovered.slice(0, 12)) console.log(`     ${fmt(a)} → ${fmt(b)}  (${num(b - a)}s)`);
  if (uncovered.length > 12) console.log(`     … y ${uncovered.length - 12} más`);
}
console.log(
  "\n  ⚠ La detección automática NO garantiza anonimato. Revisá el render completo antes de\n" +
    "    publicar. Si quedó una cara al descubierto, tapala con --manual (o --manual --also-detect).\n",
);

console.log("filter_complex:\n" + filter + "\n");
console.log("ffmpeg:\n" + shellCmd + "\n");

if (REPORT) {
  mkdirSync(dirname(resolve(REPORT)), { recursive: true });
  writeFileSync(
    REPORT,
    JSON.stringify(
      {
        video: VIDEO,
        width: BW,
        height: BH,
        fps: num(FPS),
        duration: num(VDUR),
        mode: MODE,
        params: { every: EVERY, score: SCORE, padding: PADDING, hold: HOLD, lead: LEAD, iou: IOU, drift: DRIFT, strength: STRENGTH },
        detection: detection ? { detector: detection.detector, stats: detection.stats, sampled: detection.sampled } : null,
        tracks: tracks.map((t) => ({ id: t.id, points: t.points })),
        chunks: chunks.map((c) => ({ track: c.track, start: c.start, end: c.end, box: c.px, source: c.source, points: c.points })),
        coverage: { covered_s: num(covered), duration_s: num(VDUR), uncovered: uncovered.map(([a, b]) => [num(a), num(b)]) },
      },
      null,
      2,
    ),
    "utf8",
  );
  console.error(`blur-faces: reporte → ${REPORT}`);
}

if (DRY) {
  console.error("--dry-run: no se corrió nada. Quitá --dry-run para renderizar.");
  process.exit(0);
}

mkdirSync(dirname(resolve(OUT)), { recursive: true });
const res = spawnSync("ffmpeg", ffArgs, { stdio: ["ignore", "inherit", "inherit"] });
if (res.error) fail(`no pude ejecutar ffmpeg: ${res.error.message} (¿está instalado?)`);
if (typeof res.status === "number" && res.status !== 0) fail(`ffmpeg salió con código ${res.status}`);
console.log(`blur-faces: ${chunks.length} tramo(s) tapado(s) (${MODE}) → ${OUT}`);
console.log("blur-faces: REVISÁ el render antes de publicar. La detección no es garantía.");
