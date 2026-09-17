// editor-videos — LAYOUT "TUTORIAL VERTICAL PARTIDO" (estilo reel DdE7wYbxjPK).
//
// Compone el 9:16 en dos zonas: la CABEZA hablante abajo (ancla fija, ~45%) y la
// zona de APOYO arriba (~55%) que rota screencasts / fotos / b-roll por plan.
// Cuando ningún apoyo cubre un tramo, arriba va la propia cabeza en blur oscuro
// (el mismo recurso que usa el CTA final del estilo). Una sola pasada de
// filter_complex; el audio de la cabeza se COPIA (nunca se re-encodea la voz).
//
// Uso:
//   node split-layout.mjs --head head.mp4 --plan plan.json --out out.mp4
//     [--split 0.55]           fracción del alto para la zona de apoyo (arriba)
//     [--width 1080] [--height 1920]
//     [--head-anchor center]   center | top | bottom: qué parte del cuadro de la
//                              cámara sobrevive al recorte de la zona de cabeza
//     [--crf 18] [--preset veryfast] [--dry-run]
//
// plan.json:
//   { "supports": [
//       { "asset": "deck.mp4", "start": 0, "end": 8, "offset": 100 },
//       { "asset": "foto.jpg", "start": 8, "end": 11 },
//       { "asset": "term.mp4", "start": 11, "end": 20, "offset": 35,
//         "crop": { "x": 0, "y": 0, "w": 960, "h": 540 }, "fit": "cover" }
//   ] }
//   · start/end: segundos en la línea de tiempo de la CABEZA (la narración manda).
//   · offset:    desde qué segundo del ASSET fuente se lee (video; default 0).
//   · crop:      recorte focal en píxeles DEL FUENTE antes de escalar — es el
//                "zoom focal" del estilo: mostrar la línea que importa, no la
//                pantalla entera.
//   · fit:       cover (default: llena y recorta bordes) | contain (entra entero,
//                bandas del color de tinta de marca donde falte).
//
// Los apoyos NO pueden solaparse entre sí (el estilo es rotación, no capas).
// Determinista: sin Date.now / Math.random. Sin dependencias externas.
import { existsSync, readFileSync, mkdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, resolve, extname } from "node:path";

// ---- args ------------------------------------------------------------------
const argv = process.argv.slice(2);
const has = (name) => argv.includes("--" + name);
const flag = (name, def) => {
  const i = argv.indexOf("--" + name);
  return i >= 0 && i + 1 < argv.length && !String(argv[i + 1]).startsWith("--") ? argv[i + 1] : def;
};
const fail = (msg) => {
  console.error("split-layout: " + msg);
  process.exit(1);
};

const HEAD = flag("head");
const PLAN = flag("plan");
const OUT = flag("out");
const DRY = has("dry-run");
const W = parseInt(flag("width", "1080"), 10);
const H = parseInt(flag("height", "1920"), 10);
const SPLIT = parseFloat(flag("split", "0.55"));
const ANCHOR = flag("head-anchor", "center");
const CRF = flag("crf", "18");
const PRESET = flag("preset", "veryfast");
const INK = "0x0A0F0D"; // tinta de marca para las bandas de `contain`

if (!HEAD) fail("falta --head <camara.mp4>");
if (!PLAN) fail("falta --plan <plan.json>");
if (!OUT) fail("falta --out <out.mp4>");
if (!existsSync(HEAD)) fail(`no existe la camara: ${HEAD}`);
if (!existsSync(PLAN)) fail(`no existe el plan: ${PLAN}`);
if (!(SPLIT > 0.2 && SPLIT < 0.8)) fail(`--split ${SPLIT} fuera de rango razonable (0.2–0.8)`);
if (!["center", "top", "bottom"].includes(ANCHOR)) fail(`--head-anchor invalido: ${ANCHOR}`);

// Alturas pares (h264 exige dimensiones pares).
const topH = Math.round((H * SPLIT) / 2) * 2;
const headH = H - topH;

// ---- plan ------------------------------------------------------------------
let plan;
try {
  plan = JSON.parse(readFileSync(PLAN, "utf8"));
} catch (err) {
  fail(`plan ilegible: ${err.message}`);
}
const supports = plan.supports || [];
if (!Array.isArray(supports)) fail("plan.supports tiene que ser un array");
for (const s of supports) {
  if (!s.asset) fail("apoyo sin asset");
  if (!existsSync(s.asset)) fail(`no existe el asset: ${s.asset}`);
  if (!(s.end > s.start)) fail(`apoyo ${s.asset}: end (${s.end}) <= start (${s.start})`);
}
const orden = [...supports].sort((a, b) => a.start - b.start);
for (let i = 1; i < orden.length; i++) {
  if (orden[i].start < orden[i - 1].end)
    fail(
      `apoyos solapados: "${orden[i - 1].asset}" termina en ${orden[i - 1].end}s y ` +
        `"${orden[i].asset}" arranca en ${orden[i].start}s — el estilo es rotación, no capas`,
    );
}

const esImagen = (p) => [".jpg", ".jpeg", ".png", ".webp"].includes(extname(p).toLowerCase());

// ---- filtro ----------------------------------------------------------------
// Cadena de la cabeza: escalar a cubrir el ancho y recortar el alto de su zona.
// El anclaje decide qué franja del cuadro de la cámara sobrevive.
const yCrop =
  ANCHOR === "top" ? "0" : ANCHOR === "bottom" ? "ih-oh" : "(ih-oh)/2";
const cabeza =
  `[0:v]split=2[cabsrc][fondosrc];` +
  // Escalar a CUBRIR la zona (ancho Y alto): una cámara 16:9 desborda a los
  // costados y se recorta centrada; una 9:16 desborda arriba/abajo y ahí manda
  // el anclaje. Escalar solo al ancho dejaba la zona más alta que el cuadro
  // (crop imposible: pedía 864 de un cuadro de 608).
  `[cabsrc]scale=${W}:${headH}:force_original_aspect_ratio=increase,` +
  `crop=${W}:${headH}:(iw-ow)/2:${yCrop}[cabeza];` +
  // Fondo de la zona de apoyo cuando no hay apoyo: la propia cabeza, cubriendo,
  // con blur fuerte y oscurecida — el mismo recurso del CTA del estilo.
  `[fondosrc]scale=${W}:${topH}:force_original_aspect_ratio=increase,` +
  `crop=${W}:${topH},boxblur=24,eq=brightness=-0.12[fondo];` +
  `[fondo][cabeza]vstack=2[base0]`;

const inputs = ["-i", HEAD];
const cadenas = [cabeza];
let base = "base0";

orden.forEach((s, idx) => {
  const inIdx = idx + 1;
  const dur = s.end - s.start;
  if (esImagen(s.asset)) {
    inputs.push("-loop", "1", "-t", String(dur), "-i", s.asset);
  } else {
    inputs.push("-ss", String(s.offset || 0), "-t", String(dur), "-i", s.asset);
  }
  const fit = s.fit || "cover";
  const pasos = [];
  if (s.crop) pasos.push(`crop=${s.crop.w}:${s.crop.h}:${s.crop.x}:${s.crop.y}`);
  if (fit === "contain") {
    pasos.push(
      `scale=${W}:${topH}:force_original_aspect_ratio=decrease`,
      `pad=${W}:${topH}:(ow-iw)/2:(oh-ih)/2:color=${INK}`,
    );
  } else {
    pasos.push(`scale=${W}:${topH}:force_original_aspect_ratio=increase`, `crop=${W}:${topH}`);
  }
  // Corrimiento al tiempo de la narración: los frames del apoyo existen SOLO en
  // su ventana, y el enable lo guarda por si el fuente trae más de la cuenta.
  pasos.push(`setpts=PTS-STARTPTS+${s.start}/TB`);
  const out = `base${idx + 1}`;
  cadenas.push(`[${inIdx}:v]${pasos.join(",")}[ap${idx}]`);
  cadenas.push(
    `[${base}][ap${idx}]overlay=0:0:enable='between(t,${s.start},${s.end})'[${out}]`,
  );
  base = out;
});

const filtro = cadenas.join(";");

const args = [
  "-y",
  ...inputs,
  "-filter_complex",
  filtro,
  "-map",
  `[${base}]`,
  "-map",
  "0:a:0?",
  "-c:v",
  "libx264",
  "-crf",
  CRF,
  "-preset",
  PRESET,
  "-pix_fmt",
  "yuv420p",
  "-c:a",
  "copy",
  OUT,
];

console.log(`split-layout: ${W}x${H} — apoyo arriba ${topH}px (${Math.round(SPLIT * 100)}%), cabeza abajo ${headH}px`);
console.log(`apoyos: ${orden.length}` + (orden.length ? " — " + orden.map((s) => `${s.asset} [${s.start}-${s.end}s]`).join(" · ") : " (todo el tramo: cabeza + fondo blur)"));
if (DRY) {
  console.log("\nffmpeg " + args.map((a) => (/[\s'"]/.test(a) ? JSON.stringify(a) : a)).join(" "));
  process.exit(0);
}

mkdirSync(dirname(resolve(OUT)), { recursive: true });
const r = spawnSync("ffmpeg", args, { stdio: ["ignore", "inherit", "inherit"] });
if (r.status !== 0) fail(`ffmpeg salio con ${r.status}`);
console.log(`OK -> ${OUT}`);
