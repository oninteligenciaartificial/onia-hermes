#!/usr/bin/env node
// scripts/remotion/render.mjs — CLI de render de los apoyos visuales ANIMADOS
// de ONIA (misma ergonomía que .claude/skills/editor-videos/scripts/make-mockup.mjs,
// pero producto es video con alpha en vez de un PNG).
//
// Uso:
//   node render.mjs --comp Stat --out assets/stat.webm --props '{"value":"6","label":"DOCTORES"}'
//   node render.mjs --comp Browser --out assets/web.webm --props '{"urlLabel":"dentalgest.com","image":"capturas/panel.png"}'
//   node render.mjs --comp Quote --out assets/cita.webm --props-file props/cita.json
//   node render.mjs --list
//
// Flags:
//   --comp <Stat|Browser|Phone|Quote|LowerThird>  (requerido salvo --list)
//   --out <archivo.webm | carpeta/ si --format png-sequence>
//   --props '<json>'        props inline (mismo objeto que defaultProps de la composición)
//   --props-file <archivo>  props desde un .json (--props tiene prioridad si se pasan ambos)
//   --width --height --duration (segundos) --fps   overrides sueltos, ganan sobre --props
//   --accent --theme (dark|light)                   overrides sueltos, ganan sobre --props
//   --format webm | png-sequence   (default webm)
//   --codec vp8 | vp9               (default vp8; solo aplica a --format webm)
//   --serve-url <carpeta-bundle>     reusar un bundle ya generado (salta bundle(), más rápido)
//   --print-serve-url                imprime dónde quedó el bundle para reusarlo con --serve-url
//   --dry-run                        solo resuelve composición/props y sale (no renderiza)
//
// Reglas duras: TODO el render es LOCAL (nunca VPS), costo cero (Remotion es
// gratis), determinista (las composiciones no usan Date.now/Math.random).
import { existsSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { dirname, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const argv = process.argv.slice(2);
const has = (name) => argv.includes("--" + name);
const flag = (name, def) => {
  const i = argv.indexOf("--" + name);
  return i >= 0 && i + 1 < argv.length && !String(argv[i + 1]).startsWith("--") ? argv[i + 1] : def;
};
const fail = (msg) => {
  console.error("render.mjs: " + msg);
  process.exit(1);
};

const COMPS = ["Stat", "Browser", "Phone", "Quote", "LowerThird"];

if (has("list")) {
  console.log("Composiciones disponibles: " + COMPS.join(", "));
  process.exit(0);
}

const COMP = flag("comp");
const OUT = flag("out");
const FORMAT = flag("format", "webm"); // webm | png-sequence
const CODEC = flag("codec", "vp8"); // vp8 | vp9
const SERVE_URL = flag("serve-url");
const DRY = has("dry-run");

if (!COMP) fail("falta --comp <" + COMPS.join("|") + ">");
if (!COMPS.includes(COMP)) fail(`--comp desconocido "${COMP}" (usá: ${COMPS.join(" | ")})`);
if (!OUT) fail("falta --out <archivo.webm o carpeta/>");
if (!["webm", "png-sequence"].includes(FORMAT)) fail(`--format debe ser webm | png-sequence (recibí "${FORMAT}")`);
if (!["vp8", "vp9"].includes(CODEC)) fail(`--codec debe ser vp8 | vp9 (recibí "${CODEC}")`);

// ---- props: --props (inline) > --props-file > {} -----------------------
let props = {};
const PROPS_FILE = flag("props-file");
if (PROPS_FILE) {
  if (!existsSync(PROPS_FILE)) fail(`no existe --props-file ${PROPS_FILE}`);
  try {
    props = JSON.parse(readFileSync(PROPS_FILE, "utf8"));
  } catch (err) {
    fail(`--props-file inválido (${PROPS_FILE}): ${err.message}`);
  }
}
const PROPS_INLINE = flag("props");
if (PROPS_INLINE) {
  try {
    props = { ...props, ...JSON.parse(PROPS_INLINE) };
  } catch (err) {
    fail(`--props inválido: ${err.message}`);
  }
}

// overrides sueltos: ganan sobre --props / --props-file (misma prioridad que
// los flags de make-mockup.mjs sobre su --json)
const numFlag = (name) => {
  const v = flag(name);
  return v !== undefined ? Number(v) : undefined;
};
const WIDTH = numFlag("width");
const HEIGHT = numFlag("height");
const DURATION = numFlag("duration");
const FPS = numFlag("fps");
const ACCENT = flag("accent");
const THEME = flag("theme");
if (WIDTH !== undefined) props.width = WIDTH;
if (HEIGHT !== undefined) props.height = HEIGHT;
if (DURATION !== undefined) props.durationInSeconds = DURATION;
if (FPS !== undefined) props.fps = FPS;
if (ACCENT !== undefined) {
  if (!/^#[0-9a-fA-F]{3,8}$/.test(ACCENT)) fail(`--accent debe ser hex (#RRGGBB), recibí "${ACCENT}"`);
  props.accent = ACCENT;
}
if (THEME !== undefined) {
  if (!["dark", "light"].includes(THEME)) fail(`--theme debe ser dark | light (recibí "${THEME}")`);
  props.theme = THEME;
}

// ---- imágenes → data URI (self-contained, igual criterio que make-mockup.mjs) ----
const MIME = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".avif": "image/avif",
};
function toDataUri(file) {
  const abs = resolve(file);
  if (!existsSync(abs)) fail(`no existe la imagen: ${file}`);
  const ext = extname(abs).toLowerCase();
  const mime = MIME[ext];
  if (!mime) fail(`extensión de imagen no soportada: ${ext} (png/jpg/webp/gif/avif)`);
  const buf = readFileSync(abs);
  return `data:${mime};base64,${buf.toString("base64")}`;
}
if (typeof props.image === "string" && props.image.length > 0 && !props.image.startsWith("data:")) {
  props.image = toDataUri(props.image);
}

if (DRY) {
  console.log(`render.mjs: --dry-run · comp=${COMP} format=${FORMAT} codec=${CODEC}`);
  console.log("props: " + JSON.stringify({ ...props, image: props.image ? "<data-uri>" : undefined }, null, 2));
  process.exit(0);
}

// ---- bundle + selectComposition + render (server-side rendering APIs) ----
const { bundle } = await import("@remotion/bundler");
const { renderMedia, renderFrames, selectComposition } = await import("@remotion/renderer");

const entryPoint = resolve(__dirname, "src/index.ts");
const t0 = Date.now();

let serveUrl = SERVE_URL;
if (serveUrl) {
  if (!existsSync(serveUrl)) fail(`--serve-url no existe: ${serveUrl}`);
  console.log(`render.mjs: reusando bundle en ${serveUrl}`);
} else {
  console.log("render.mjs: bundling (webpack)…");
  serveUrl = await bundle({ entryPoint });
  console.log(`render.mjs: bundle listo en ${((Date.now() - t0) / 1000).toFixed(1)}s → ${serveUrl}`);
}
if (has("print-serve-url")) {
  console.log(`render.mjs: serveUrl=${serveUrl} (reusalo con --serve-url "${serveUrl}" para saltar el bundle)`);
}

const composition = await selectComposition({ serveUrl, id: COMP, inputProps: props });
console.log(
  `render.mjs: ${COMP} → ${composition.width}x${composition.height} @${composition.fps}fps · ${composition.durationInFrames}f (${(composition.durationInFrames / composition.fps).toFixed(2)}s)`,
);

const outAbs = resolve(OUT);

if (FORMAT === "png-sequence") {
  mkdirSync(outAbs, { recursive: true });
  const t1 = Date.now();
  await renderFrames({
    composition,
    serveUrl,
    inputProps: props,
    outputDir: outAbs,
    imageFormat: "png",
    onFrameUpdate: (rendered, frame) => {
      if (rendered % 15 === 0 || rendered === composition.durationInFrames) {
        process.stdout.write(`\rrender.mjs: frame ${frame} (${rendered}/${composition.durationInFrames})   `);
      }
    },
  });
  process.stdout.write("\n");
  console.log(`render.mjs: ${COMP} → ${outAbs} (secuencia PNG con alpha, ${composition.durationInFrames} frames, ${((Date.now() - t1) / 1000).toFixed(1)}s)`);
} else {
  mkdirSync(dirname(outAbs), { recursive: true });
  const t1 = Date.now();
  await renderMedia({
    composition,
    serveUrl,
    codec: CODEC,
    imageFormat: "png",
    pixelFormat: "yuva420p",
    outputLocation: outAbs,
    inputProps: props,
    onProgress: ({ progress }) => {
      process.stdout.write(`\rrender.mjs: ${Math.round(progress * 100)}%   `);
    },
  });
  process.stdout.write("\n");
  const size = statSync(outAbs).size;
  console.log(
    `render.mjs: ${COMP} → ${outAbs} (${CODEC}/yuva420p, alpha, ${(size / 1024).toFixed(0)} KB, ${((Date.now() - t1) / 1000).toFixed(1)}s)`,
  );
}
