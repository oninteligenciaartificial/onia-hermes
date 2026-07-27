#!/usr/bin/env node
// scripts/hyperframes/render.mjs — CLI de render de los apoyos visuales ANIMADOS
// de ONIA, ahora sobre HyperFrames (antes: scripts/remotion/render.mjs).
//
// MISMA ergonomia que el CLI de Remotion y que
// .claude/skills/editor-videos/scripts/make-mockup.mjs, para que el pipeline de
// overlay-visuals.mjs no cambie:
//
//   node render.mjs --comp Stat --out assets/stat --props '{"value":"6","label":"DOCTORES"}'
//   node render.mjs --comp Browser --out assets/web --props '{"urlLabel":"dentalgest.com","image":"capturas/panel.png"}'
//   node render.mjs --comp Quote --out assets/cita --props-file props/cita.json
//   node render.mjs --list
//
// Flags:
//   --comp <Stat|Browser|Phone|Quote|LowerThird>  (requerido salvo --list)
//   --out <carpeta/ para png-sequence | archivo.webm|.mov|.mp4>
//   --props '<json>'        props inline
//   --props-file <archivo>  props desde un .json (--props tiene prioridad)
//   --width --height --duration (segundos) --fps   overrides sueltos, ganan sobre --props
//   --accent --theme (dark|light)                   overrides sueltos, ganan sobre --props
//   --format png-sequence | webm | mov | mp4   (default png-sequence)
//   --quality draft | standard | high          (default high)
//   --keep-build            no borra el proyecto temporal (para depurar)
//   --dry-run               resuelve composicion/props y sale (no renderiza)
//
// POR QUE png-sequence ES EL DEFAULT: el ffmpeg local (gyan.dev 8.1.1) NO
// decodifica el alpha de WebM VP8/VP9 — al leerlo de vuelta el canal vuelve
// siempre opaco (verificado encodeando a mano, sin Remotion de por medio). La
// secuencia PNG lleva alpha real y overlay-visuals.mjs ya sabe consumir una
// carpeta con PNGs numerados.
//
// Reglas duras: render LOCAL siempre (nunca el VPS), costo cero, determinista
// (las composiciones no usan Date.now/Math.random).
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { basename, dirname, extname, join, resolve } from "node:path";
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

// nombre publico -> carpeta de la composicion (= data-composition-id)
const COMPS = {
  Stat: "stat",
  Browser: "browser",
  Phone: "phone",
  Quote: "quote",
  LowerThird: "lower-third",
};
const COMP_NAMES = Object.keys(COMPS);

if (has("list")) {
  console.log("Composiciones disponibles: " + COMP_NAMES.join(", "));
  process.exit(0);
}

const COMP = flag("comp");
const OUT = flag("out");
const FORMAT = flag("format", "png-sequence");
const QUALITY = flag("quality", "high");
const DRY = has("dry-run");

if (!COMP) fail("falta --comp <" + COMP_NAMES.join("|") + ">");
if (!COMPS[COMP]) fail(`--comp desconocido "${COMP}" (usa: ${COMP_NAMES.join(" | ")})`);
if (!OUT) fail("falta --out <carpeta/ o archivo>");
if (!["png-sequence", "webm", "mov", "mp4"].includes(FORMAT)) {
  fail(`--format debe ser png-sequence | webm | mov | mp4 (recibi "${FORMAT}")`);
}
if (!["draft", "standard", "high"].includes(QUALITY)) {
  fail(`--quality debe ser draft | standard | high (recibi "${QUALITY}")`);
}

const slug = COMPS[COMP];
const srcDir = resolve(__dirname, "compositions", slug);
const srcHtml = join(srcDir, "index.html");
if (!existsSync(srcHtml)) fail(`no existe la composicion: ${srcHtml}`);

// ---- props: --props (inline) > --props-file > {} ---------------------------
let props = {};
const PROPS_FILE = flag("props-file");
if (PROPS_FILE) {
  if (!existsSync(PROPS_FILE)) fail(`no existe --props-file ${PROPS_FILE}`);
  try {
    props = JSON.parse(readFileSync(PROPS_FILE, "utf8"));
  } catch (err) {
    fail(`--props-file invalido (${PROPS_FILE}): ${err.message}`);
  }
}
const PROPS_INLINE = flag("props");
if (PROPS_INLINE) {
  try {
    props = { ...props, ...JSON.parse(PROPS_INLINE) };
  } catch (err) {
    fail(`--props invalido: ${err.message}`);
  }
}

// overrides sueltos: ganan sobre --props / --props-file
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
  if (!/^#[0-9a-fA-F]{3,8}$/.test(ACCENT)) fail(`--accent debe ser hex (#RRGGBB), recibi "${ACCENT}"`);
  props.accent = ACCENT;
}
if (THEME !== undefined) {
  if (!["dark", "light"].includes(THEME)) fail(`--theme debe ser dark | light (recibi "${THEME}")`);
  props.theme = THEME;
}

// ---- geometria: la del HTML es el default, las props la pisan ---------------
const html = readFileSync(srcHtml, "utf8");
const stageTagMatch = html.match(/<div\s+id="stage"[\s\S]*?>/);
if (!stageTagMatch) fail(`no encontre el <div id="stage"> en ${srcHtml}`);
const stageTag = stageTagMatch[0];
const attrOf = (name) => {
  const m = stageTag.match(new RegExp(`${name}="([^"]*)"`));
  return m ? m[1] : undefined;
};

const geom = {
  width: Math.round(Number(props.width ?? attrOf("data-width"))),
  height: Math.round(Number(props.height ?? attrOf("data-height"))),
  duration: Number(props.durationInSeconds ?? attrOf("data-duration")),
  fps: Math.round(Number(props.fps ?? attrOf("data-fps"))),
  theme: String(props.theme ?? attrOf("data-theme") ?? "dark"),
};
for (const k of ["width", "height", "duration", "fps"]) {
  if (!Number.isFinite(geom[k]) || geom[k] <= 0) fail(`geometria invalida: ${k}=${geom[k]}`);
}
if (![24, 30, 60].includes(geom.fps)) {
  fail(`--fps debe ser 24 | 30 | 60 (el CLI de hyperframes solo acepta esos); recibi ${geom.fps}`);
}

// ---- proyecto temporal ------------------------------------------------------
const buildDir = resolve(__dirname, ".build", slug);
rmSync(buildDir, { recursive: true, force: true });
mkdirSync(buildDir, { recursive: true });

// Las fuentes de marca tienen que VIAJAR al proyecto temporal. El @font-face de
// la composicion las pide como "fonts/...", relativo a la raiz del proyecto, y
// la raiz durante el render es buildDir — no la carpeta de la composicion.
//
// Sin esta copia el render arrancaba igual pero el file server devolvia
// "404 /fonts/BricolageGrotesque-var-latin.woff2" y el frame salia con una
// fuente del sistema: exactamente el no-determinismo que la tipografia
// autohospedada viene a eliminar, y encima MUDO. `hyperframes check` no lo
// detecta porque corre dentro de la composicion, donde fonts/ si existe.
// Por eso se falla fuerte si el HTML pide fonts/ y la carpeta no esta.
const fontsSrc = join(dirname(srcHtml), "fonts");
if (html.includes('url("fonts/')) {
  if (!existsSync(fontsSrc)) {
    fail(
      `${COMP} referencia fonts/ pero no existe ${fontsSrc}\n` +
        "  corre: python hermes-content/brand/fonts/build-onia-fonts.py",
    );
  }
  cpSync(fontsSrc, join(buildDir, "fonts"), { recursive: true });
}

// La imagen se COPIA al proyecto (self-contained) en vez de viajar como data URI:
// una captura de 2 MB en base64 no entra en la linea de comandos de Windows.
const MIME_EXT = [".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif"];
if (typeof props.image === "string" && props.image.length > 0 && !props.image.startsWith("data:")) {
  const abs = resolve(props.image);
  if (!existsSync(abs)) fail(`no existe la imagen: ${props.image}`);
  const ext = extname(abs).toLowerCase();
  if (!MIME_EXT.includes(ext)) fail(`extension de imagen no soportada: ${ext} (png/jpg/webp/gif/avif)`);
  mkdirSync(join(buildDir, "assets"), { recursive: true });
  const dest = "assets/screen" + ext;
  cpSync(abs, join(buildDir, dest));
  props.image = dest;
}

// El HTML de la composicion es la fuente: se copia tal cual y la geometria se
// inyecta como un <style> al final del <head> (gana por orden) + reescritura de
// los data-* del root. Asi no se toca el CSS autoral con regex.
//
// Por que la geometria NO puede ir por --variables: HyperFrames congela
// data-duration / data-width / data-height del root en tiempo de compilacion
// (se leen antes de que corran los scripts), asi que un override en runtime se
// ignora. El contenido si viaja por --variables, que es el mecanismo nativo.
const geometryStyle = [
  '<style id="onia-geometry">',
  `  html, body { width: ${geom.width}px; height: ${geom.height}px; }`,
  `  #stage { width: ${geom.width}px; height: ${geom.height}px;`,
  `           --stage-w: ${geom.width}; --stage-h: ${geom.height}; }`,
  "</style>",
  "</head>",
].join("\n");

let outHtml = html.replace("</head>", geometryStyle);
const newStageTag = stageTag
  .replace(/data-theme="[^"]*"/, `data-theme="${geom.theme}"`)
  .replace(/data-duration="[^"]*"/, `data-duration="${geom.duration}"`)
  .replace(/data-fps="[^"]*"/, `data-fps="${geom.fps}"`)
  .replace(/data-width="[^"]*"/, `data-width="${geom.width}"`)
  .replace(/data-height="[^"]*"/, `data-height="${geom.height}"`);
outHtml = outHtml.replace(stageTag, newStageTag);
writeFileSync(join(buildDir, "index.html"), outHtml);

// Solo las variables DECLARADAS por la composicion viajan al render: pasar una
// clave no declarada es un error con --strict-variables.
const declMatch = html.match(/data-composition-variables='([\s\S]*?)'/);
let declared = [];
if (declMatch) {
  try {
    declared = JSON.parse(declMatch[1]).map((d) => d.id);
  } catch (err) {
    fail(`data-composition-variables invalido en ${srcHtml}: ${err.message}`);
  }
}
const variables = {};
for (const id of declared) {
  if (props[id] !== undefined && props[id] !== null) variables[id] = String(props[id]);
}
const ignored = Object.keys(props).filter(
  (k) => !declared.includes(k) && !["width", "height", "durationInSeconds", "fps", "theme"].includes(k),
);
writeFileSync(join(buildDir, "variables.json"), JSON.stringify(variables, null, 2));

console.log(
  `render.mjs: ${COMP} -> ${geom.width}x${geom.height} @${geom.fps}fps · ${Math.round(
    geom.duration * geom.fps,
  )}f (${geom.duration}s) · tema ${geom.theme}`,
);
if (ignored.length) {
  console.error(`render.mjs: AVISO props ignoradas (no declaradas por ${COMP}): ${ignored.join(", ")}`);
}

if (DRY) {
  console.log(`render.mjs: --dry-run · format=${FORMAT} quality=${QUALITY}`);
  console.log("variables: " + JSON.stringify(variables, null, 2));
  console.log(`proyecto temporal: ${buildDir}`);
  process.exit(0);
}

// ---- render -----------------------------------------------------------------
const outAbs = resolve(OUT);
mkdirSync(FORMAT === "png-sequence" ? outAbs : dirname(outAbs), { recursive: true });

const args = [
  "hyperframes",
  "render",
  buildDir,
  "--format",
  FORMAT,
  "--quality",
  QUALITY,
  "--fps",
  String(geom.fps),
  "--output",
  outAbs,
  "--variables-file",
  join(buildDir, "variables.json"),
  "--strict-variables",
];

const t0 = Date.now();
const r = spawnSync("npx", args, { stdio: "inherit", shell: process.platform === "win32" });
if (r.error) fail(`no pude ejecutar el CLI de hyperframes: ${r.error.message}`);
if (r.status !== 0) fail(`el render de hyperframes fallo (exit ${r.status})`);

if (!has("keep-build")) rmSync(buildDir, { recursive: true, force: true });

console.log(
  `render.mjs: ${COMP} -> ${outAbs} (${FORMAT}${
    FORMAT === "png-sequence" ? ", RGBA con alpha real" : ""
  }, ${((Date.now() - t0) / 1000).toFixed(1)}s)`,
);
