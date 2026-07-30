// editor-videos — APOYOS VISUALES (1/2): genera el PNG con fondo TRANSPARENTE.
//
// El método de Santiago: los apoyos visuales del reel (mockups, tarjetas de dato,
// citas, capturas enmarcadas) NO se diseñan a mano en un editor — se ESCRIBEN con
// código (HTML/CSS), se rinden con chromium headless y se superponen al video.
// Este script hace la primera mitad: HTML/CSS → PNG con alpha.
// La segunda mitad (ponerlo sobre el video en el momento exacto) es overlay-visuals.mjs.
//
// Uso:
//   node make-mockup.mjs --template stat --out assets/stat.png \
//        --value "6" --label "DOCTORES" --subtitle "probando el sistema dental"
//   node make-mockup.mjs --template browser --out assets/web.png \
//        --url-label "dentalgest.com" --image capturas/panel.png
//   node make-mockup.mjs --template phone   --out assets/app.png  --image capturas/chat.jpg
//   node make-mockup.mjs --template quote   --out assets/cita.png \
//        --title "3 doctores más en el sistema" --subtitle "día 5 del reto"
//   node make-mockup.mjs --template custom  --out assets/x.png --html-file mi.html
//
// Flags: --template --out --width --height --title --subtitle --value --label
//        --image --html-file --accent [--sublabel --text --url-label --json --theme]
//
// Reglas duras de este script:
//   · SELF-CONTAINED: cero recursos externos (ni CDN, ni fuentes remotas). Las imágenes
//     se incrustan como data URI leyendo el archivo del disco. Si el HTML pidiera red,
//     el render se bloquea (route abort) → el PNG nunca depende de internet.
//   · DETERMINISTA: sin Date.now / Math.random. Mismos flags → mismo PNG.
//   · Sin dependencias nuevas: playwright se resuelve desde el workspace del panel.
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, extname, resolve, join } from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

// playwright vive en el workspace de la app del panel (no instalamos nada nuevo)
const require = createRequire("C:/dev/proyectos/onia-hermes/web-factory/apps/site/package.json");
const { chromium } = require("playwright");

// ---- args ------------------------------------------------------------------
const argv = process.argv.slice(2);
const flag = (name, def) => {
  const i = argv.indexOf("--" + name);
  return i >= 0 && i + 1 < argv.length && !String(argv[i + 1]).startsWith("--") ? argv[i + 1] : def;
};
const fail = (msg) => {
  console.error("make-mockup: " + msg);
  process.exit(1);
};

// --json <file> permite pasar todos los parámetros como objeto; los flags de CLI ganan.
let fromJson = {};
const JSON_FILE = flag("json");
if (JSON_FILE) {
  if (!existsSync(JSON_FILE)) fail(`no existe --json ${JSON_FILE}`);
  try {
    fromJson = JSON.parse(await readFile(JSON_FILE, "utf8"));
  } catch (err) {
    fail(`--json inválido (${JSON_FILE}): ${err.message}`);
  }
}
// pick: flag CLI → clave del JSON (camelCase y kebab-case) → default
const pick = (name, def) => {
  const camel = name.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  const v = flag(name);
  if (v !== undefined) return v;
  if (fromJson[name] !== undefined && fromJson[name] !== null) return String(fromJson[name]);
  if (fromJson[camel] !== undefined && fromJson[camel] !== null) return String(fromJson[camel]);
  return def;
};

const TEMPLATE = pick("template", "stat");
const OUT = pick("out");
const WIDTH_IN = Number(pick("width", "0")) || 0;
const WIDTH = WIDTH_IN > 0 ? Math.max(200, Math.round(WIDTH_IN)) : 0; // 0 = ancho default de la plantilla
const HEIGHT_IN = Number(pick("height", "0")) || 0;
const HEIGHT = HEIGHT_IN > 0 ? Math.round(HEIGHT_IN) : 0; // 0 = alto por contenido
const ACCENT = pick("accent", "#FF7A00"); // naranja estilo Santiago
const THEME = pick("theme", "dark"); // dark = tarjeta oscura (pega sobre video claro) | light
const TITLE = pick("title", pick("text", ""));
const SUBTITLE = pick("subtitle", pick("sublabel", ""));
const VALUE = pick("value", "");
const LABEL = pick("label", "");
const URL_LABEL = pick("url-label", "onia.com.bo");
const IMAGE = pick("image");
const HTML_FILE = pick("html-file");

const TEMPLATES = ["browser", "phone", "stat", "quote", "custom"];
if (!OUT) fail("falta --out <archivo.png>");
if (!TEMPLATES.includes(TEMPLATE)) fail(`--template desconocido "${TEMPLATE}" (usá: ${TEMPLATES.join(" | ")})`);
if (!/^#[0-9a-fA-F]{3,8}$/.test(ACCENT)) fail(`--accent debe ser hex (#RRGGBB), recibí "${ACCENT}"`);

// ---- imágenes → data URI (self-contained: nada de rutas ni red) -------------
const MIME = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
};
async function dataUri(file) {
  const abs = resolve(file);
  if (!existsSync(abs)) fail(`no existe la imagen: ${file}`);
  const ext = extname(abs).toLowerCase();
  const mime = MIME[ext];
  if (!mime) fail(`extensión de imagen no soportada: ${ext} (png/jpg/webp/gif/avif/svg)`);
  const buf = await readFile(abs);
  return `data:${mime};base64,${buf.toString("base64")}`;
}
// ---- tipografia de marca → @font-face con data URI --------------------------
// Trio oficial de ONIA_BRAND_IDENTITY_2026 §2. Van EMBEBIDAS como data URI por
// la misma razon que las imagenes: este script bloquea toda request de red, y
// ademas asi el PNG sale identico en Windows y en el VPS sin depender de que la
// fuente este instalada en el sistema. Antes se usaba el stack del sistema
// ("Segoe UI"), que es justamente lo que hacia que un reel mezclando apoyos
// estaticos y animados mostrara DOS tipografias distintas.
const FONTS_DIR = resolve(fileURLToPath(new URL("../../../../", import.meta.url)), "hermes-content/brand/fonts");
const BRAND_FONTS = [
  ["Bricolage Grotesque", "BricolageGrotesque-var-latin.woff2", "500 700"],
  ["DM Sans", "DMSans-var-latin.woff2", "400 500"],
  ["Spline Sans Mono", "SplineSansMono-var-latin.woff2", "400 500"],
];
const fontFaceCss = (
  await Promise.all(
    BRAND_FONTS.map(async ([family, file, weight]) => {
      const abs = join(FONTS_DIR, file);
      if (!existsSync(abs)) {
        fail(`falta la fuente de marca ${file} en ${FONTS_DIR} — corré hermes-content/brand/fonts/build-onia-fonts.py`);
      }
      const b64 = (await readFile(abs)).toString("base64");
      return `@font-face{font-family:"${family}";src:url(data:font/woff2;base64,${b64}) format("woff2");font-weight:${weight};font-style:normal;font-display:block}`;
    }),
  )
).join("\n");

const esc = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

// ---- design system (un solo lenguaje visual para las 4 plantillas) ----------
// Todo se mide en `u` = width/1000 → cambiar --width escala la pieza entera sin
// re-tunear tipografías. Jerarquía por contraste de escala, no por adornos.
function baseCss(width) {
  const dark = THEME !== "light";
  return `
  ${fontFaceCss}
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --u: ${(width / 1000).toFixed(4)}px;
    /* Roles del trio: display = titulares y etiquetas · body = texto de apoyo
       · mono = cifras y URLs. Mismos roles que las composiciones animadas de
       scripts/hyperframes, para que un reel que mezcla apoyos estaticos y
       animados se lea como UNA sola pieza. */
    --font-display: "Bricolage Grotesque", sans-serif;
    --font-body: "DM Sans", sans-serif;
    --font-mono: "Spline Sans Mono", monospace;
    --accent: ${ACCENT};
    --ink:      ${dark ? "#0A0C11" : "#FFFFFF"};
    --ink-2:    ${dark ? "#15181F" : "#F4F5F7"};
    --text:     ${dark ? "#F6F8FB" : "#0B0D12"};
    --muted:    ${dark ? "rgba(246,248,251,.60)" : "rgba(11,13,18,.58)"};
    --hairline: ${dark ? "rgba(255,255,255,.11)" : "rgba(11,13,18,.10)"};
    --gloss:    ${dark ? "rgba(255,255,255,.09)" : "rgba(255,255,255,.85)"};
    --shadow: 0 calc(46*var(--u)) calc(96*var(--u)) calc(-24*var(--u)) rgba(0,0,0,.62),
              0 calc(10*var(--u)) calc(26*var(--u)) rgba(0,0,0,.32);
  }
  /* fondo transparente de punta a punta: omitBackground conserva el alpha */
  html, body { background: transparent; }
  body {
    font-family: var(--font-body);
    color: var(--text);
    -webkit-font-smoothing: antialiased;
    text-rendering: geometricPrecision;
    font-variant-ligatures: none;
  }
  /* #stage = lo que se captura. El padding deja respirar la sombra (si no, se recorta). */
  #stage { display: inline-block; padding: calc(52*var(--u)); background: transparent; }
  .card {
    position: relative;
    background: linear-gradient(158deg, var(--ink-2) 0%, var(--ink) 62%);
    border: 1px solid var(--hairline);
    border-radius: calc(34*var(--u));
    box-shadow: var(--shadow);
    overflow: hidden;
  }
  /* filo superior de luz: lo que separa una tarjeta "diseñada" de un div con sombra */
  .card::after {
    content: ""; position: absolute; inset: 0; border-radius: inherit; pointer-events: none;
    border-top: 1px solid var(--gloss);
    -webkit-mask-image: linear-gradient(#000, transparent 42%);
            mask-image: linear-gradient(#000, transparent 42%);
  }
  .rail { position: absolute; left: 0; top: 0; bottom: 0; width: calc(12*var(--u));
          background: linear-gradient(180deg, var(--accent), color-mix(in oklab, var(--accent) 62%, #000)); }
  .eyebrow { display: flex; align-items: center; gap: calc(14*var(--u));
             font-family: var(--font-display);
             font-size: calc(26*var(--u)); font-weight: 700; letter-spacing: .18em;
             text-transform: uppercase; color: var(--muted); }
  .eyebrow i { width: calc(14*var(--u)); height: calc(14*var(--u)); border-radius: 999px;
               background: var(--accent); box-shadow: 0 0 calc(22*var(--u)) var(--accent); }
  .muted { color: var(--muted); }
  `;
}

function page(width, bodyHtml, extraCss = "") {
  return `<!doctype html><html lang="es"><head><meta charset="utf-8">
<style>${baseCss(width)}${extraCss}</style></head>
<body><div id="stage">${bodyHtml}</div></body></html>`;
}

// ---- plantilla: stat -------------------------------------------------------
// Tarjeta de dato. Jerarquía brutal: el número manda, el label lo nombra en acento,
// el sublabel explica en voz baja. Riel de acento a la izquierda para que se lea
// como "dato de ONIA" y no como notificación del sistema.
function tplStat(width) {
  const w = width || 900;
  const eyebrow = TITLE ? `<div class="eyebrow"><i></i>${esc(TITLE)}</div>` : "";
  if (!VALUE) fail("--template stat necesita --value");
  const css = `
  /* hug-content: la tarjeta se ajusta al texto más largo (vertical-friendly para reels),
     con piso y techo para que nunca salga ni raquítica ni banner. */
  .stat { width: max-content; min-width: calc(560*var(--u)); max-width: calc(1000*var(--u));
          padding: calc(62*var(--u)) calc(80*var(--u)) calc(58*var(--u)) calc(84*var(--u)); }
  ${HEIGHT ? `.stat { height: ${HEIGHT}px; display: flex; flex-direction: column; justify-content: center; }` : ""}
  .stat .value {
    font-family: var(--font-mono);
    font-size: calc(var(--fs)*var(--u)); font-weight: 500; line-height: .94;
    letter-spacing: -.045em; font-variant-numeric: tabular-nums;
    margin-top: ${TITLE ? "calc(24*var(--u))" : "0"}; white-space: nowrap; width: max-content;
    background: linear-gradient(180deg, var(--text) 78%, color-mix(in oklab, var(--text) 72%, var(--ink)));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .stat .label { margin-top: calc(22*var(--u)); font-family: var(--font-display);
                 font-size: calc(38*var(--u)); font-weight: 700;
                 letter-spacing: .13em; text-transform: uppercase; color: var(--accent); }
  .stat .sub { margin-top: calc(12*var(--u)); font-size: calc(31*var(--u)); font-weight: 500;
               letter-spacing: -.01em; color: var(--muted); }
  /* halo de acento DETRÁS del número: profundidad sin ensuciar.
     z-index explícito: un absolute con z-index:auto pinta ENCIMA del texto en flujo
     (orden de pintado CSS) y le teñía los glifos de naranja. */
  .stat::before { content: ""; position: absolute; z-index: 0;
    right: calc(-90*var(--u)); top: calc(-120*var(--u));
    width: calc(430*var(--u)); height: calc(430*var(--u)); border-radius: 999px;
    background: radial-gradient(circle, color-mix(in oklab, var(--accent) 26%, transparent), transparent 68%); }
  .stat > .eyebrow, .stat > .value, .stat > .label, .stat > .sub { position: relative; z-index: 1; }
  `;
  // font-size inicial por longitud; después se encoge hasta entrar (shrink-to-fit en el DOM)
  const n = VALUE.length;
  const fs = n <= 1 ? 268 : n <= 2 ? 240 : n <= 3 ? 208 : n <= 5 ? 176 : n <= 7 ? 146 : 112;
  const body = `<div class="card stat" id="fit-box" style="--fs:${fs}">
    <div class="rail"></div>${eyebrow}
    <div class="value" id="fit-text">${esc(VALUE)}</div>
    ${LABEL ? `<div class="label">${esc(LABEL)}</div>` : ""}
    ${SUBTITLE ? `<div class="sub">${esc(SUBTITLE)}</div>` : ""}
  </div>`;
  return { width: w, html: page(w, body, css), fit: { start: fs, min: 60 } };
}

// ---- plantilla: browser ----------------------------------------------------
// Ventana de navegador para enmarcar una captura. La barra no es un wireframe:
// dots reales de macOS, pill de URL con candado, y la captura pegada al filo.
async function tplBrowser(width) {
  const w = width || 1100;
  const img = IMAGE ? await dataUri(IMAGE) : null;
  const inner = HTML_FILE ? await readFile(HTML_FILE, "utf8") : null;
  const css = `
  .win { width: calc(1000*var(--u)); }
  .bar { display: flex; align-items: center; gap: calc(20*var(--u));
         padding: calc(24*var(--u)) calc(28*var(--u));
         background: linear-gradient(180deg, rgba(255,255,255,.07), rgba(255,255,255,.02));
         border-bottom: 1px solid var(--hairline); }
  .dots { display: flex; gap: calc(12*var(--u)); flex: 0 0 auto; }
  .dots span { width: calc(20*var(--u)); height: calc(20*var(--u)); border-radius: 999px; }
  .dots span:nth-child(1) { background:#FF5F57 } .dots span:nth-child(2) { background:#FEBC2E }
  .dots span:nth-child(3) { background:#28C840 }
  .url { flex: 1 1 auto; display: flex; align-items: center; gap: calc(12*var(--u));
         height: calc(50*var(--u)); padding: 0 calc(22*var(--u)); border-radius: 999px;
         background: rgba(0,0,0,.34); border: 1px solid var(--hairline);
         font-family: var(--font-mono);
         font-size: calc(25*var(--u)); font-weight: 400; color: var(--muted);
         letter-spacing: -.01em; overflow: hidden; white-space: nowrap; }
  .url b { color: var(--text); font-weight: 500; }
  .lock { width: calc(19*var(--u)); height: calc(19*var(--u)); flex: 0 0 auto; opacity: .8; }
  .stack { display: flex; gap: calc(9*var(--u)); flex: 0 0 auto; }
  .stack i { width: calc(26*var(--u)); height: calc(3*var(--u)); border-radius: 999px; background: var(--muted); opacity: .7; }
  .view { display: block; background: var(--ink); ${HEIGHT ? `height: ${HEIGHT}px;` : ""} }
  .view img { display: block; width: 100%; height: ${HEIGHT ? "100%" : "auto"}; object-fit: cover; }
  .empty { padding: calc(96*var(--u)) calc(72*var(--u)); min-height: calc(520*var(--u));
           display: flex; flex-direction: column; justify-content: center; gap: calc(18*var(--u));
           background: radial-gradient(120% 100% at 0% 0%, color-mix(in oklab, var(--accent) 14%, transparent), transparent 60%); }
  .empty h1 { font-family: var(--font-display);
              font-size: calc(70*var(--u)); font-weight: 700; letter-spacing: -.035em; line-height: 1.02; }
  .empty p  { font-size: calc(31*var(--u)); font-weight: 500; color: var(--muted); }
  .empty .bars { display: flex; gap: calc(14*var(--u)); margin-top: calc(28*var(--u)); }
  .empty .bars i { height: calc(12*var(--u)); border-radius: 999px; background: var(--hairline); }
  .empty .bars i:first-child { width: calc(150*var(--u)); background: var(--accent); }
  .empty .bars i:nth-child(2) { width: calc(96*var(--u)); } .empty .bars i:nth-child(3) { width: calc(58*var(--u)); }
  `;
  // candado SVG inline (self-contained, sin iconos externos)
  const lock = `<svg class="lock" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"
    stroke-linecap="round"><rect x="4.5" y="10.5" width="15" height="10.5" rx="2.4"/><path d="M8 10.5V7.6a4 4 0 0 1 8 0v2.9"/></svg>`;
  const view = img
    ? `<img src="${img}" alt="">`
    : inner !== null
      ? inner
      : `<div class="empty"><h1>${esc(TITLE || "Tu web, andando")}</h1>
         <p>${esc(SUBTITLE || "hecha con ONIA")}</p><div class="bars"><i></i><i></i><i></i></div></div>`;
  const body = `<div class="card win">
    <div class="bar"><div class="dots"><span></span><span></span><span></span></div>
      <div class="url">${lock}<b>${esc(URL_LABEL)}</b></div>
      <div class="stack"><i></i><i></i><i></i></div></div>
    <div class="view">${view}</div>
  </div>`;
  return { width: w, html: page(w, body, css), fit: null };
}

// ---- plantilla: phone ------------------------------------------------------
// Marco de teléfono vertical con notch tipo Dynamic Island. Bisel con dos filos
// (luz arriba, sombra abajo) para que se lea como objeto y no como rectángulo.
async function tplPhone(width) {
  const w = width || 560;
  const img = IMAGE ? await dataUri(IMAGE) : null;
  const css = `
  .phone { width: calc(1000*var(--u)); padding: calc(26*var(--u)); border-radius: calc(112*var(--u));
           background: linear-gradient(150deg, #2A2E37 0%, #0B0D12 46%, #23262E 100%); }
  .phone::after { border-radius: inherit; }
  .screen { position: relative; border-radius: calc(90*var(--u)); overflow: hidden;
            background: var(--ink); border: 1px solid rgba(0,0,0,.6);
            ${HEIGHT ? `height: ${HEIGHT}px;` : "aspect-ratio: 9 / 19.5;"} }
  .screen img { display: block; width: 100%; height: 100%; object-fit: cover; }
  .notch { position: absolute; left: 50%; top: calc(26*var(--u)); transform: translateX(-50%);
           width: calc(300*var(--u)); height: calc(76*var(--u)); border-radius: 999px;
           background: #05070A; z-index: 2; box-shadow: 0 0 0 1px rgba(255,255,255,.05); }
  .notch::after { content: ""; position: absolute; right: calc(26*var(--u)); top: 50%; transform: translateY(-50%);
                  width: calc(26*var(--u)); height: calc(26*var(--u)); border-radius: 999px;
                  background: radial-gradient(circle at 32% 30%, #2C3A52, #070A10 70%); }
  .btn { position: absolute; right: calc(-5*var(--u)); border-radius: 999px; width: calc(9*var(--u));
         background: linear-gradient(180deg,#3A3F4A,#15181F); }
  .btn.p { top: calc(300*var(--u)); height: calc(190*var(--u)); }
  .ph-empty { height: 100%; display: flex; flex-direction: column; justify-content: flex-end;
              gap: calc(14*var(--u)); padding: calc(74*var(--u)) calc(56*var(--u)) calc(96*var(--u));
              /* el glow acompaña al texto (abajo), no un vacío negro con luz arriba */
              background: radial-gradient(130% 62% at 50% 100%, color-mix(in oklab, var(--accent) 26%, transparent), transparent 66%); }
  .ph-empty h1 { font-family: var(--font-display);
                 font-size: calc(72*var(--u)); font-weight: 700; letter-spacing: -.035em; line-height: 1.04; }
  .ph-empty p { font-size: calc(34*var(--u)); color: var(--muted); font-weight: 500; }
  `;
  const inner = img
    ? `<img src="${img}" alt="">`
    : `<div class="ph-empty"><h1>${esc(TITLE || "Reservá tu cita")}</h1><p>${esc(SUBTITLE || "en 2 toques")}</p></div>`;
  const body = `<div class="card phone"><div class="btn p"></div>
    <div class="screen"><div class="notch"></div>${inner}</div></div>`;
  return { width: w, html: page(w, body, css), fit: null };
}

// ---- plantilla: quote -----------------------------------------------------
// Cita destacada. La comilla gigante en acento translúcido hace de textura;
// el filete de acento + atribución cierran la composición.
function tplQuote(width) {
  const w = width || 980;
  const text = TITLE || VALUE;
  if (!text) fail("--template quote necesita --title (el texto de la cita)");
  const css = `
  .quote { width: calc(1000*var(--u)); padding: calc(78*var(--u)) calc(80*var(--u)) calc(66*var(--u)) calc(86*var(--u));
           ${HEIGHT ? `height: ${HEIGHT}px; display: flex; flex-direction: column; justify-content: center;` : ""} }
  /* z-index: la comilla es textura, va DETRÁS del texto (ver nota de pintado en .stat) */
  .quote .mark { position: absolute; z-index: 0; left: calc(34*var(--u)); top: calc(-46*var(--u));
                 font-family: var(--font-display);
                 font-size: calc(320*var(--u)); line-height: 1; font-weight: 700;
                 color: color-mix(in oklab, var(--accent) 30%, transparent); pointer-events: none; }
  .quote p { position: relative; z-index: 1; font-family: var(--font-display);
             font-size: calc(62*var(--u)); font-weight: 700;
             line-height: 1.16; letter-spacing: -.03em; text-wrap: balance; }
  .quote .who { position: relative; z-index: 1; }
  .quote p em { font-style: normal; color: var(--accent); }
  .quote .who { display: flex; align-items: center; gap: calc(18*var(--u)); margin-top: calc(40*var(--u));
                font-size: calc(29*var(--u)); font-weight: 500; color: var(--muted); letter-spacing: -.01em; }
  .quote .who i { width: calc(58*var(--u)); height: calc(4*var(--u)); border-radius: 999px; background: var(--accent); }
  `;
  const body = `<div class="card quote">
    <div class="rail"></div><div class="mark">&ldquo;</div>
    <p>${esc(text)}</p>
    ${SUBTITLE ? `<div class="who"><i></i>${esc(SUBTITLE)}</div>` : ""}
  </div>`;
  return { width: w, html: page(w, body, css), fit: null };
}

// ---- plantilla: custom ----------------------------------------------------
// HTML propio: se inyectan las variables (--u, --accent, --text…) y las clases
// .card/.rail/.eyebrow para que el autor reuse el mismo lenguaje visual.
async function tplCustom(width) {
  const w = width || 1000;
  if (!HTML_FILE) fail("--template custom necesita --html-file <archivo.html>");
  if (!existsSync(HTML_FILE)) fail(`no existe --html-file ${HTML_FILE}`);
  const raw = await readFile(HTML_FILE, "utf8");
  // Si el archivo ya es un documento completo, se usa tal cual (el autor manda);
  // solo se fuerza el fondo transparente para no perder el alpha.
  if (/<html[\s>]/i.test(raw)) {
    const inject = `<style>html,body{background:transparent!important}#stage{display:inline-block}</style>`;
    const html = /<\/head>/i.test(raw) ? raw.replace(/<\/head>/i, inject + "</head>") : inject + raw;
    return { width: w, html, fit: null, selector: raw.includes('id="stage"') ? "#stage" : "body" };
  }
  return { width: w, html: page(w, raw), fit: null };
}

// ---- render ----------------------------------------------------------------
const build = {
  stat: tplStat,
  browser: tplBrowser,
  phone: tplPhone,
  quote: tplQuote,
  custom: tplCustom,
};
const spec = await build[TEMPLATE](WIDTH);
const selector = spec.selector || "#stage";

await mkdir(dirname(resolve(OUT)), { recursive: true });

const browser = await chromium.launch({
  args: ["--force-color-profile=srgb", "--hide-scrollbars", "--font-render-hinting=none"],
});
try {
  const ctx = await browser.newContext({
    viewport: { width: spec.width, height: 1200 },
    deviceScaleFactor: 2, // 2x: el PNG entra nítido aunque el overlay lo escale
    colorScheme: "dark",
    reducedMotion: "reduce", // nada de animaciones a medio camino → PNG reproducible
  });
  const p = await ctx.newPage();
  // ni una request de red: si el HTML pidiera algo externo, se aborta (self-contained)
  await p.route("**/*", (route) => {
    const u = route.request().url();
    if (u.startsWith("data:") || u.startsWith("about:") || u.startsWith("blob:")) return route.continue();
    console.error(`make-mockup: recurso externo BLOQUEADO (self-contained): ${u.slice(0, 120)}`);
    return route.abort();
  });
  await p.setContent(spec.html, { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);

  // shrink-to-fit del número (determinista: baja de 2 en 2 hasta que entra).
  // Se mide con getBoundingClientRect (subpíxel) y NO con scrollWidth: scrollWidth
  // redondea hacia arriba y hacía que el bucle se comiera hasta el mínimo.
  if (spec.fit) {
    const used = await p.evaluate(({ start, min }) => {
      const box = document.getElementById("fit-box");
      const el = document.getElementById("fit-text");
      if (!box || !el) return null;
      const cs = getComputedStyle(box);
      const avail =
        parseFloat(cs.maxWidth || "0") - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      let fs = start;
      for (; fs > min; fs -= 2) {
        box.style.setProperty("--fs", String(fs));
        if (el.getBoundingClientRect().width <= avail + 0.5) break;
      }
      return fs;
    }, spec.fit);
    if (used !== null && used !== spec.fit.start) {
      console.error(`make-mockup: --value largo → font-size ajustado ${spec.fit.start}u → ${used}u`);
    }
  }

  // Ajustar el viewport al contenido real y capturar SOLO el #stage → PNG ajustado
  // al mockup (con margen para la sombra), sin kilos de transparente al costado.
  const box = await p.evaluate((sel) => {
    const el = document.querySelector(sel);
    const r = el.getBoundingClientRect();
    return { w: Math.ceil(r.width), h: Math.ceil(r.height) };
  }, selector);
  await p.setViewportSize({ width: Math.max(box.w, 32), height: Math.max(box.h, 32) });

  const el = await p.$(selector);
  if (!el) fail(`no encontré ${selector} en el HTML`);
  const png = await el.screenshot({ omitBackground: true, type: "png", animations: "disabled" });
  await writeFile(resolve(OUT), png);

  console.log(
    `make-mockup: ${TEMPLATE} → ${OUT}  (${box.w}×${box.h} css · ${box.w * 2}×${box.h * 2} px @2x · alpha, accent ${ACCENT})`,
  );
} finally {
  await browser.close();
}
