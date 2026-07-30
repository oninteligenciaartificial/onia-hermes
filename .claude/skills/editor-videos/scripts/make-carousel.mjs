// editor-videos — CARRUSELES + HISTORIAS (piezas de costo CERO).
//
// Un carrusel de IG no es "un video sin movimiento": es tipografía. El texto ES la
// pieza. Este script toma un plan JSON con los slides ya escritos (guion aprobado)
// y los rinde como PNGs numerados listos para subir — sin editor, sin diseñador,
// sin gastar un solo crédito de generación.
//
// Uso:
//   node make-carousel.mjs --plan planes/dia01.json --out salida/dia01
//   node make-carousel.mjs --plan planes/dia05.json --out salida/dia05 --format story
//   node make-carousel.mjs --plan p.json --out o --accent "#0EA5E9" --theme light
//
// Formatos: post 1080x1350 (4:5, el de IG) · story 1080x1920 · square 1080x1080
//           (o --width / --height explícitos).
//
// Plan JSON:
//   {
//     "brand":  "Onia Dental",                   // barra superior
//     "handle": "@lu.antelo",                 // pie del slide de cierre (opcional)
//     "aiLabel":"Contenido creado con IA",    // etiqueta IA (obligatoria en campaña)
//     "accent": "#00D26A",
//     "slides": [
//       { "kind":"hook", "title":"...", "body":"...", "placeholder":"[FOTO - pendiente]" },
//       { "kind":"body", "kicker":"...", "title":"...", "body":"...", "footnote":"..." },
//       { "kind":"cta",  "title":"Escribí **DEMO** al WhatsApp", "body":"..." }
//     ]
//   }
//   · kind: hook (portada) | body (desarrollo) | cta (cierre, siempre el último)
//   · **texto** dentro de title/body → resaltado en acento (chip en el slide CTA)
//   · "image": ruta a un PNG/JPG → se incrusta como data URI (reemplaza al placeholder)
//
// Campos extra para HISTORIAS (todos opcionales; si no están, el slide no cambia —
// por eso los carruseles ya generados siguen saliendo byte a byte iguales):
//   · "stamp":   "Simulación con datos de demo"  → píldora de acento arriba del titular.
//                Rotular SIEMPRE las capturas de demo: no se muestra data de cliente real.
//   · "counter": { "pre":"Faltan", "value":"~60", "unit":"días" } → número gigante.
//                pre + value/unit + title arman UNA frase leída de arriba abajo.
//   · "poll":    { "options":["a","b","c"], "hint":"..." } → maqueta de la encuesta.
//                El sticker que vota es el NATIVO de IG: esto reserva la zona y fija el copy.
//   · "collage": ["a.png","b.png", ...] → grilla 2×2 con piezas ya publicadas (recap).
//   · "sticker": "Sticker de link"  |  { "label":"...", "hint":"..." }  |  [ ... ]
//                → zona punteada donde va el sticker nativo (link / preguntas / encuesta).
//   En `--format story` el lienzo respeta las ZONAS SEGURAS de IG (cabecera de perfil
//   arriba, barra de respuesta abajo): nada de marca, etiqueta IA ni copy queda tapado.
//
// Reglas duras de este script:
//   · SELF-CONTAINED: cero recursos externos (ni CDN, ni fuentes remotas). Si el HTML
//     pidiera red, el render se aborta → el PNG nunca depende de internet.
//   · DETERMINISTA: sin Date.now / Math.random (el grano es SVG con seed fijo).
//     Mismo plan → mismos PNGs, byte a byte.
//   · LEGIBILIDAD MÓVIL (piso duro, el auto-ajuste nunca baja de acá):
//     título ≥ 64px · cuerpo ≥ 34px · margen ≥ 64px · contraste alto siempre.
//   · Sin dependencias nuevas: playwright se resuelve desde el workspace del panel.
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve, join, extname } from "node:path";
import { createRequire } from "node:module";

const require = createRequire("C:/dev/proyectos/onia-hermes/web-factory/apps/site/package.json");
const { chromium } = require("playwright");

// ---- args ------------------------------------------------------------------
const argv = process.argv.slice(2);
const flag = (name, def) => {
  const i = argv.indexOf("--" + name);
  return i >= 0 && i + 1 < argv.length && !String(argv[i + 1]).startsWith("--") ? argv[i + 1] : def;
};
const fail = (msg) => {
  console.error("make-carousel: " + msg);
  process.exit(1);
};

const PLAN_FILE = flag("plan");
const OUT_DIR = flag("out");
const FORMAT = flag("format", "post");
const PREFIX = flag("prefix", "slide");
if (!PLAN_FILE) fail("falta --plan <archivo.json>");
if (!OUT_DIR) fail("falta --out <carpeta>");
if (!existsSync(PLAN_FILE)) fail(`no existe --plan ${PLAN_FILE}`);

let plan;
try {
  plan = JSON.parse(await readFile(PLAN_FILE, "utf8"));
} catch (err) {
  fail(`--plan inválido (${PLAN_FILE}): ${err.message}`);
}
if (!Array.isArray(plan.slides) || plan.slides.length === 0) fail("el plan no tiene slides[]");

const FORMATS = { post: [1080, 1350], story: [1080, 1920], square: [1080, 1080] };
if (!FORMATS[FORMAT]) fail(`--format desconocido "${FORMAT}" (usá: ${Object.keys(FORMATS).join(" | ")})`);
// Historia = pantalla completa con chrome de IG encima: la cabecera de perfil come el
// tope y la barra de respuesta el pie. El lienzo se achica a la zona segura en vez de
// confiar en que "más o menos entra".
const STORY = FORMAT === "story";
const W = Math.round(Number(flag("width", "0")) || FORMATS[FORMAT][0]);
const H = Math.round(Number(flag("height", "0")) || FORMATS[FORMAT][1]);
if (W < 320 || H < 320) fail(`tamaño inválido ${W}x${H}`);

const ACCENT = flag("accent", plan.accent || "#00D26A");
if (!/^#[0-9a-fA-F]{3,8}$/.test(ACCENT)) fail(`--accent debe ser hex (#RRGGBB), recibí "${ACCENT}"`);
const THEME = flag("theme", plan.theme || "dark");
const BRAND = plan.brand ?? "Onia";
const HANDLE = plan.handle ?? "";
const AI_LABEL = plan.aiLabel ?? "";

// ---- helpers ---------------------------------------------------------------
const esc = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
// **texto** → resaltado (se aplica DESPUÉS de escapar, para no romper el HTML)
const rich = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<b class="hl">$1</b>');

const MIME = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
};
async function dataUri(file) {
  const abs = resolve(file);
  if (!existsSync(abs)) fail(`no existe la imagen del slide: ${file}`);
  const mime = MIME[extname(abs).toLowerCase()];
  if (!mime) fail(`extensión de imagen no soportada: ${extname(abs)} (png/jpg/webp/avif)`);
  return `data:${mime};base64,${(await readFile(abs)).toString("base64")}`;
}

// ---- design system ---------------------------------------------------------
// Todo se mide en `u` = width/1080 → cambiar el formato reescala la pieza entera
// sin re-tunear tipografías. Los tamaños de abajo son px a 1080 de ancho.
const dark = THEME !== "light";
// El texto manda sobre el tamaño: cada slide arranca en `fs` y el render lo ACHICA
// si desborda (nunca por debajo de `fsMin`, el piso de legibilidad móvil) o lo AGRANDA
// hasta `fsMax` si sobra lienzo. Un slide de 5 palabras y uno de 3 líneas terminan
// pesando lo mismo en el feed — que es lo que hace que el carrusel se lea como serie.
const SCALE = {
  hook: { fs: 128, fsMin: 74, fsMax: 152, fb: 44, fbMin: 34 },
  body: { fs: 84, fsMin: 64, fsMax: 124, fb: 43, fbMin: 34 },
  cta: { fs: 78, fsMin: 64, fsMax: 98, fb: 41, fbMin: 34 },
};

// grano: SVG con seed fijo → determinista, y va como data URI (self-contained)
const GRAIN =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'>` +
      `<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='3' seed='7' stitchTiles='stitch'/></filter>` +
      `<rect width='200' height='200' filter='url(#n)' opacity='0.55'/></svg>`,
  );

function css() {
  return `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --u: ${(W / 1080).toFixed(5)}px;
    --accent: ${ACCENT};
    --accent-lo: color-mix(in oklab, var(--accent) 62%, #000);
    --accent-hi: color-mix(in oklab, var(--accent) 84%, #fff);
    --ink:    ${dark ? "#06080C" : "#FBFBF8"};
    --ink-2:  ${dark ? "#12161F" : "#FFFFFF"};
    --text:   ${dark ? "#F8FAFD" : "#0A0C11"};
    --text-2: ${dark ? "rgba(248,250,253,.84)" : "rgba(10,12,17,.80)"};
    --text-3: ${dark ? "rgba(248,250,253,.56)" : "rgba(10,12,17,.55)"};
    --hairline: ${dark ? "rgba(255,255,255,.13)" : "rgba(10,12,17,.12)"};
    --ghost: ${dark ? "rgba(255,255,255,.030)" : "rgba(10,12,17,.036)"};
  }
  html, body { background: #000; }
  body {
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
    -webkit-font-smoothing: antialiased;
    text-rendering: geometricPrecision;
    font-variant-ligatures: none;
  }
  #stage { display: block; width: ${W}px; }

  /* --- lienzo ------------------------------------------------------------ */
  .slide {
    position: relative; width: ${W}px; height: ${H}px; overflow: hidden;
    display: flex; flex-direction: column; color: var(--text);
    padding: calc(84*var(--u)) calc(88*var(--u)) calc(84*var(--u));  /* margen ≥64px */
    background:
      radial-gradient(104% 62% at 2% -6%, color-mix(in oklab, var(--accent) ${dark ? 30 : 18}%, transparent), transparent 58%),
      radial-gradient(88% 58% at 106% 108%, ${dark ? "rgba(84,116,255,.15)" : "rgba(84,116,255,.10)"}, transparent 62%),
      linear-gradient(166deg, var(--ink-2) 0%, var(--ink) 56%);
  }
  /* grano + viñeta: textura, no ruido. Lo que separa una pieza de marca de un slide de plantilla. */
  .slide::before {
    content: ""; position: absolute; inset: 0; z-index: 1; pointer-events: none;
    background-image: url("${GRAIN}"); background-size: calc(200*var(--u)) calc(200*var(--u));
    opacity: ${dark ? ".30" : ".22"}; mix-blend-mode: ${dark ? "overlay" : "multiply"};
  }
  .slide::after {
    content: ""; position: absolute; inset: 0; z-index: 1; pointer-events: none;
    background: radial-gradient(126% 82% at 46% 38%, transparent 52%, ${dark ? "rgba(0,0,0,.34)" : "rgba(10,12,17,.09)"} 100%);
  }
  .ghost {
    position: absolute; z-index: 0; right: calc(-24*var(--u)); bottom: calc(-96*var(--u));
    font-size: calc(560*var(--u)); font-weight: 800; line-height: .78; letter-spacing: -.07em;
    color: var(--ghost); font-variant-numeric: tabular-nums; user-select: none;
  }

  /* --- barra superior ---------------------------------------------------- */
  .bar { position: relative; z-index: 2; flex: 0 0 auto;
         display: flex; align-items: center; justify-content: space-between; gap: calc(24*var(--u));
         padding-bottom: calc(26*var(--u)); }
  .bar::after { content: ""; position: absolute; left: 0; right: 0; bottom: 0; height: 1px;
                background: linear-gradient(90deg, var(--hairline), transparent 78%); }
  .mark { display: flex; align-items: center; gap: calc(15*var(--u));
          font-size: calc(25*var(--u)); font-weight: 800; letter-spacing: .2em;
          text-transform: uppercase; color: var(--text-2); white-space: nowrap; }
  .mark i { width: calc(15*var(--u)); height: calc(15*var(--u)); border-radius: 999px;
            background: var(--accent); box-shadow: 0 0 calc(22*var(--u)) var(--accent); flex: 0 0 auto; }
  .ai { font-size: calc(20*var(--u)); font-weight: 700; letter-spacing: .15em; text-transform: uppercase;
        color: var(--text-3); border: 1px solid var(--hairline); border-radius: 999px;
        padding: calc(11*var(--u)) calc(22*var(--u)); white-space: nowrap; }

  /* --- historia: zonas seguras de IG -------------------------------------- */
  /* Arriba vive la fila de perfil, abajo la barra de respuesta: si el copy llega
     al borde, IG lo tapa. Se recorta el lienzo útil, no el tamaño de letra. */
  .slide[data-story] { padding: calc(212*var(--u)) calc(84*var(--u)) calc(248*var(--u)); }
  .slide[data-story] .ai { font-size: calc(23*var(--u)); color: var(--text-2); }
  .slide[data-story] .main { padding: calc(46*var(--u)) 0 calc(38*var(--u)); }

  /* --- cuerpo ------------------------------------------------------------ */
  .main { position: relative; z-index: 2; flex: 1 1 auto; min-height: 0;
          display: flex; flex-direction: column;
          padding: calc(54*var(--u)) 0 calc(44*var(--u)); }
  .stack { flex: 1 1 auto; min-height: 0;
           display: flex; flex-direction: column; justify-content: center; gap: calc(30*var(--u)); }
  /* Con foto, el titular se apoya ABAJO sobre la imagen y vive en la mitad inferior:
     el alto del 58% obliga al auto-ajuste a respetar la zona de la cara en vez de
     treparse encima. Alto DEFINIDO (no max-height): si la caja dependiera del
     contenido, achicar el texto achicaría la caja y el bucle no convergería nunca. */
  .slide[data-cover] .stack { flex: 0 0 auto; height: 58%; margin-top: auto;
                              justify-content: flex-end; }

  .kicker { display: flex; align-items: center; gap: calc(16*var(--u));
            font-size: calc(29*var(--u)); font-weight: 800; letter-spacing: .17em;
            text-transform: uppercase; color: var(--accent); }
  .kicker i { width: calc(46*var(--u)); height: calc(5*var(--u)); border-radius: 999px;
              background: var(--accent); flex: 0 0 auto; }
  .rule { width: calc(120*var(--u)); height: calc(12*var(--u)); border-radius: 999px; flex: 0 0 auto;
          background: linear-gradient(90deg, var(--accent-hi), var(--accent-lo)); }
  .title { font-size: calc(var(--fs)*var(--u)); font-weight: 800; line-height: 1.02;
           letter-spacing: -.035em; text-wrap: balance; }
  .copy  { font-size: calc(var(--fb)*var(--u)); font-weight: 500; line-height: 1.34;
           letter-spacing: -.012em; color: var(--text-2); text-wrap: pretty;
           max-width: calc(880*var(--u)); }
  .hl { color: var(--accent); font-weight: 800; }

  /* --- rótulo de honestidad (stamp) --------------------------------------- */
  /* Toda captura de demo se rotula. Va en acento sólido, no en gris de pie de
     página: si hay que aclarar que es simulación, se lee antes que el titular. */
  .stamp { align-self: flex-start; display: inline-flex; align-items: center; gap: calc(13*var(--u));
           font-size: calc(27*var(--u)); font-weight: 800; letter-spacing: .11em; text-transform: uppercase;
           color: #080A0E; background: var(--accent); border-radius: 999px;
           padding: calc(13*var(--u)) calc(26*var(--u)); }
  .stamp i { width: calc(13*var(--u)); height: calc(13*var(--u)); border-radius: 999px;
             background: rgba(8,10,14,.72); flex: 0 0 auto; }

  /* --- contador (countdown) ----------------------------------------------- */
  /* El número escala con --fs → el auto-ajuste lo achica junto al titular y nunca
     desborda. pre + número + titular se leen como una sola frase. */
  .cpre { font-size: calc(var(--fb)*var(--u)); font-weight: 700; letter-spacing: .04em;
          color: var(--text-2); }
  .counter { display: flex; align-items: baseline; gap: calc(40*var(--u)); flex-wrap: wrap;
             margin: calc(-10*var(--u)) 0 calc(-14*var(--u)); }
  .counter .n { font-size: calc(var(--fs)*2.55*var(--u)); font-weight: 800; line-height: .84;
                letter-spacing: -.06em; color: var(--accent); font-variant-numeric: tabular-nums; }
  .counter .cu { font-size: calc(var(--fs)*.86*var(--u)); font-weight: 800; line-height: 1;
                 letter-spacing: -.03em; color: var(--text); }

  /* --- encuesta + zonas de sticker nativo --------------------------------- */
  /* El voto lo toma el sticker NATIVO de IG (por eso la historia convierte). Acá se
     reserva la zona y se congela el copy de las opciones para que no se improvise. */
  .zone { border: calc(3*var(--u)) dashed color-mix(in oklab, var(--accent) 58%, transparent);
          border-radius: calc(36*var(--u)); padding: calc(30*var(--u)) calc(30*var(--u));
          display: flex; flex-direction: column; gap: calc(18*var(--u));
          background: ${dark ? "rgba(255,255,255,.035)" : "rgba(10,12,17,.028)"}; }
  .zone .zt { font-size: calc(24*var(--u)); font-weight: 800; letter-spacing: .16em;
              text-transform: uppercase; color: var(--accent); }
  .zone .zh { font-size: calc(28*var(--u)); font-weight: 500; line-height: 1.3; color: var(--text-3); }
  .opts { display: flex; flex-direction: column; gap: calc(15*var(--u)); }
  .opt { font-size: calc(41*var(--u)); font-weight: 700; letter-spacing: -.01em; text-align: center;
         color: var(--text); border-radius: calc(26*var(--u));
         padding: calc(24*var(--u)) calc(22*var(--u));
         background: ${dark ? "rgba(255,255,255,.10)" : "rgba(10,12,17,.06)"};
         border: 1px solid var(--hairline); }

  /* --- collage de recap ---------------------------------------------------- */
  /* La grilla ABSORBE el lienzo que sobra (flex:1) en vez de imponer su alto: el
     texto manda y el collage se acomoda, así el recap nunca desborda la historia. */
  .collage { display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr;
             gap: calc(16*var(--u)); flex: 1 1 auto; min-height: calc(430*var(--u)); }
  .collage figure { position: relative; min-height: 0; overflow: hidden;
                    border-radius: calc(26*var(--u)); border: 1px solid var(--hairline);
                    background: var(--ink-2); }
  /* contain, no cover: el recap muestra piezas de TEXTO — recortarlas parte frases a
     la mitad y el recap deja de leerse. Mejor miniatura completa con aire. */
  .collage img { display: block; width: 100%; height: 100%; object-fit: contain; }

  /* --- portada a sangre (foto o placeholder) ------------------------------ */
  /* La foto NO va en una cajita: ocupa el lienzo entero y el titular se apoya
     sobre el degradado. Es lo que hace que la portada frene el scroll. */
  .cover { position: absolute; inset: 0; z-index: 0; overflow: hidden; }
  .cover img { display: block; width: 100%; height: 100%; object-fit: cover; }
  .cover::after { content: ""; position: absolute; inset: 0; z-index: 1;
    background: linear-gradient(180deg, rgba(6,8,12,.52) 0%, rgba(6,8,12,.16) 24%,
                rgba(6,8,12,.80) 62%, var(--ink) 96%); }
  .cover.ph .phbox { position: absolute; z-index: 2;
    top: calc(178*var(--u)); left: calc(88*var(--u)); right: calc(88*var(--u)); bottom: calc(150*var(--u));
    border: calc(3*var(--u)) dashed color-mix(in oklab, var(--accent) 55%, transparent);
    border-radius: calc(44*var(--u));
    background: linear-gradient(158deg, rgba(255,255,255,.05), rgba(255,255,255,.012));
    display: flex; flex-direction: column; align-items: center; gap: calc(16*var(--u));
    text-align: center; padding: calc(150*var(--u)) calc(48*var(--u)) 0; }
  .cover.ph .tag { font-size: calc(31*var(--u)); font-weight: 800; letter-spacing: .09em;
                   text-transform: uppercase; color: var(--accent); }
  .cover.ph .hint { font-size: calc(25*var(--u)); font-weight: 500; color: var(--text-3);
                    letter-spacing: .02em; max-width: calc(660*var(--u)); text-wrap: balance; }
  /* En historia el hueco de la captura vive ARRIBA del bloque de texto (que se ancla
     al 58% inferior), no debajo de la cabecera de perfil de IG. */
  .slide[data-story] .cover.ph .phbox {
    top: calc(300*var(--u)); left: calc(84*var(--u)); right: calc(84*var(--u));
    bottom: calc(1120*var(--u)); justify-content: center;
    padding: calc(40*var(--u)) calc(44*var(--u)); }

  /* --- cierre (CTA) ------------------------------------------------------- */
  .slide[data-kind="cta"] .stack { justify-content: center; }
  .cta { position: relative; border-radius: calc(50*var(--u));
         padding: calc(80*var(--u)) calc(72*var(--u));
         display: flex; flex-direction: column; gap: calc(28*var(--u));
         background: linear-gradient(150deg, var(--accent-hi) 0%, var(--accent) 44%, var(--accent-lo) 100%);
         box-shadow: 0 calc(44*var(--u)) calc(96*var(--u)) calc(-34*var(--u)) color-mix(in oklab, var(--accent) 62%, transparent),
                     inset 0 1px 0 rgba(255,255,255,.42); }
  .cta .title, .cta .kicker { color: #080A0E; }
  .cta .kicker i { background: rgba(8,10,14,.72); }
  .cta .copy { color: rgba(8,10,14,.78); max-width: none; font-weight: 600; }
  .cta .hl { display: inline-block; color: var(--accent); background: #080A0E;
             border-radius: calc(14*var(--u)); padding: 0 calc(18*var(--u)) calc(7*var(--u));
             margin: 0 calc(2*var(--u)); }
  .cta .copy { padding-right: calc(150*var(--u)); }
  .badge { position: absolute; right: calc(60*var(--u)); bottom: calc(58*var(--u));
           width: calc(104*var(--u)); height: calc(104*var(--u)); border-radius: 999px;
           background: #080A0E; display: flex; align-items: center; justify-content: center; }
  .badge svg { width: calc(44*var(--u)); height: calc(44*var(--u)); color: var(--accent); }

  /* --- pie ---------------------------------------------------------------- */
  .foot { position: relative; z-index: 2; flex: 0 0 auto;
          display: flex; align-items: flex-end; justify-content: space-between; gap: calc(30*var(--u)); }
  .note { font-size: calc(25*var(--u)); font-weight: 500; line-height: 1.32; color: var(--text-3);
          max-width: calc(660*var(--u)); }
  .note b { color: var(--text-2); font-weight: 700; }
  .nav { display: flex; align-items: center; gap: calc(16*var(--u)); flex: 0 0 auto;
         font-size: calc(25*var(--u)); font-weight: 700; letter-spacing: .1em;
         color: var(--text-3); font-variant-numeric: tabular-nums; }
  .nav .cur { color: var(--text); }
  .nav svg { width: calc(30*var(--u)); height: calc(30*var(--u)); color: var(--accent); }
  .prog { position: absolute; left: 0; right: 0; bottom: 0; z-index: 3;
          height: calc(8*var(--u)); background: ${dark ? "rgba(255,255,255,.07)" : "rgba(10,12,17,.07)"}; }
  .prog i { display: block; height: 100%;
            background: linear-gradient(90deg, var(--accent-lo), var(--accent)); }
  `;
}

// ---- markup por slide ------------------------------------------------------
const ARROW = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6"
  stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h15"/><path d="M13 6l6 6-6 6"/></svg>`;
const BADGE = `<div class="badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6"
  stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h15"/><path d="M13 6l6 6-6 6"/></svg></div>`;

async function slideHtml(slide, i, total) {
  const kind = slide.kind || (i === 0 ? "hook" : i === total - 1 ? "cta" : "body");
  if (!SCALE[kind]) fail(`slide ${i + 1}: kind desconocido "${kind}" (hook | body | cta)`);
  if (!slide.title) fail(`slide ${i + 1}: falta "title"`);
  // Con contador, el número ES el titular: si el texto de la cola crece hasta el techo
  // normal los dos compiten y la pieza se lee como un muro. Se le baja el techo.
  const sc = slide.counter
    ? { ...SCALE[kind], fs: Math.min(SCALE[kind].fs, 84), fsMax: Math.min(SCALE[kind].fsMax, 96) }
    : SCALE[kind];

  const num = String(i + 1).padStart(2, "0");
  const pct = ((i + 1) / total) * 100;

  const kicker = slide.kicker ? `<div class="kicker"><i></i>${esc(slide.kicker)}</div>` : "";
  const title = `<div class="title">${rich(slide.title)}</div>`;
  const copy = slide.body ? `<div class="copy">${rich(slide.body)}</div>` : "";

  // rótulo de honestidad (capturas de demo)
  const stamp = slide.stamp ? `<div class="stamp"><i></i>${esc(slide.stamp)}</div>` : "";

  // contador: "pre" arriba, número gigante, y el titular cierra la frase
  let counter = "";
  if (slide.counter) {
    const c = slide.counter;
    if (!c.value) fail(`slide ${i + 1}: "counter" necesita "value"`);
    counter =
      (c.pre ? `<div class="cpre">${rich(c.pre)}</div>` : "") +
      `<div class="counter"><span class="n">${esc(c.value)}</span>` +
      (c.unit ? `<span class="cu">${esc(c.unit)}</span>` : "") +
      `</div>`;
  }

  // encuesta: maqueta + zona reservada para el sticker nativo de IG
  let poll = "";
  if (slide.poll) {
    const opts = slide.poll.options;
    if (!Array.isArray(opts) || opts.length === 0) fail(`slide ${i + 1}: "poll" necesita "options" (array)`);
    poll =
      `<div class="zone"><div class="zt">${esc(slide.poll.label || "Sticker de encuesta")}</div>` +
      `<div class="opts">${opts.map((o) => `<div class="opt">${esc(o)}</div>`).join("")}</div>` +
      `<div class="zh">${esc(slide.poll.hint || "pegá el sticker NATIVO de IG encima, con estas opciones exactas")}</div></div>`;
  }

  // collage de recap (2×2 con piezas ya publicadas)
  let collage = "";
  if (slide.collage) {
    if (!Array.isArray(slide.collage) || slide.collage.length === 0)
      fail(`slide ${i + 1}: "collage" debe ser un array de rutas de imagen`);
    const figs = [];
    for (const src of slide.collage) figs.push(`<figure><img src="${await dataUri(src)}" alt=""></figure>`);
    collage = `<div class="collage">${figs.join("")}</div>`;
  }

  // zonas de sticker nativo (link / preguntas / …)
  const stickerList = slide.sticker == null ? [] : Array.isArray(slide.sticker) ? slide.sticker : [slide.sticker];
  const stickers = stickerList
    .map((s) => {
      const st = typeof s === "string" ? { label: s } : s || {};
      if (!st.label) fail(`slide ${i + 1}: cada "sticker" necesita "label"`);
      return (
        `<div class="zone"><div class="zt">${esc(st.label)}</div>` +
        `<div class="zh">${esc(st.hint || "pegá el sticker NATIVO de IG en esta zona")}</div></div>`
      );
    })
    .join("");

  // portada a sangre: la foto (o su placeholder) es el fondo del slide, no una cajita
  let cover = "";
  if (slide.image) {
    cover = `<div class="cover"><img src="${await dataUri(slide.image)}" alt=""></div>`;
  } else if (slide.placeholder) {
    cover = `<div class="cover ph"><div class="phbox"><div class="tag">${esc(slide.placeholder)}</div>
      <div class="hint">${esc(slide.placeholderHint || "reemplazar antes de publicar")}</div></div></div>`;
  }

  // Sin kicker, el filete de acento sostiene el titular: ningún slide queda sin ancla de marca.
  // Con contador, el número YA es el ancla — meterle además el filete ensucia la jerarquía.
  const anchor = kicker || (counter ? "" : `<div class="rule"></div>`);
  const inner =
    kind === "cta"
      ? `<div class="cta">${kicker}${title}${copy}${BADGE}</div>${collage}${poll}${stickers}`
      : `${stamp}${anchor}${counter}${title}${copy}${collage}${poll}${stickers}`;

  const ghost = kind === "body" ? `<div class="ghost">${num}</div>` : "";
  const note = slide.footnote ? `<div class="note">${rich(slide.footnote)}</div>` : `<div class="note"></div>`;
  const nav =
    kind === "cta"
      ? `<div class="nav">${HANDLE ? esc(HANDLE) : ""}</div>`
      : `<div class="nav"><span class="cur">${num}</span>/${String(total).padStart(2, "0")}${ARROW}</div>`;

  return `<section class="slide" data-kind="${kind}"${cover ? ' data-cover="1"' : ""}${STORY ? ' data-story="1"' : ""} data-fit="${sc.fsMin},${sc.fsMax},${sc.fbMin}"
    style="--fs:${sc.fs};--fb:${sc.fb}">
    ${cover}${ghost}
    <header class="bar">
      <div class="mark"><i></i>${esc(BRAND)}</div>
      ${AI_LABEL ? `<div class="ai">${esc(AI_LABEL)}</div>` : ""}
    </header>
    <div class="main"><div class="stack">${inner}</div></div>
    <footer class="foot">${note}${nav}</footer>
    <div class="prog"><i style="width:${pct.toFixed(3)}%"></i></div>
  </section>`;
}

const total = plan.slides.length;
const sections = [];
for (let i = 0; i < total; i++) sections.push(await slideHtml(plan.slides[i], i, total));
const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><style>${css()}</style></head>
<body><div id="stage">${sections.join("")}</div></body></html>`;

// ---- render ----------------------------------------------------------------
const outAbs = resolve(OUT_DIR);
await mkdir(outAbs, { recursive: true });

const browser = await chromium.launch({
  args: ["--force-color-profile=srgb", "--hide-scrollbars", "--font-render-hinting=none"],
});
const written = [];
try {
  const ctx = await browser.newContext({
    viewport: { width: W, height: H },
    deviceScaleFactor: 1, // 1x: el PNG sale exactamente W×H, el tamaño que pide IG
    colorScheme: dark ? "dark" : "light",
    reducedMotion: "reduce",
  });
  const p = await ctx.newPage();
  await p.route("**/*", (route) => {
    const u = route.request().url();
    if (u.startsWith("data:") || u.startsWith("about:") || u.startsWith("blob:")) return route.continue();
    console.error(`make-carousel: recurso externo BLOQUEADO (self-contained): ${u.slice(0, 120)}`);
    return route.abort();
  });
  await p.setContent(html, { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);

  // Auto-ajuste determinista (pasos fijos, sin heurística flotante):
  //   1. si el texto DESBORDA → achica el título de 2 en 2, y recién después el cuerpo;
  //      nunca por debajo del piso de legibilidad móvil (64px título / 34px cuerpo).
  //   2. si SOBRA lienzo → agranda el título hasta el techo del formato.
  // Se mide con justify-content:flex-start: un contenedor centrado o anclado abajo
  // esconde el desborde superior y devuelve un scrollHeight que miente.
  const fits = await p.evaluate(() => {
    const out = [];
    document.querySelectorAll(".slide").forEach((slide, idx) => {
      const stack = slide.querySelector(".stack");
      const [minFs, maxFs, minFb] = slide.dataset.fit.split(",").map(Number);
      const startFs = Number(getComputedStyle(slide).getPropertyValue("--fs"));
      const startFb = Number(getComputedStyle(slide).getPropertyValue("--fb"));
      const prev = stack.style.justifyContent;
      stack.style.justifyContent = "flex-start";
      const over = () => stack.scrollHeight > stack.clientHeight + 1.5;
      const setFs = (v) => slide.style.setProperty("--fs", String(v));
      let fs = startFs;
      let fb = startFb;

      while (over() && fs > minFs) setFs((fs -= 2));
      while (over() && fb > minFb) {
        fb -= 1;
        slide.style.setProperty("--fb", String(fb));
      }
      if (fs === startFs && fb === startFb) {
        while (fs < maxFs) {
          setFs(fs + 2);
          if (over()) {
            setFs(fs);
            break;
          }
          fs += 2;
        }
      }
      // el veredicto se toma ANTES de restaurar la alineación real
      const overflow = over();
      const need = stack.scrollHeight;
      const have = stack.clientHeight;
      stack.style.justifyContent = prev;
      if (overflow) out.push({ n: idx + 1, fs, fb, need, have });
    });
    return out;
  });
  for (const f of fits)
    console.error(
      `make-carousel: slide ${f.n} NO entra ni en el piso de legibilidad ` +
        `(título ${f.fs}u / cuerpo ${f.fb}u · ${f.need}px de texto en ${f.have}px) → acortá el texto`,
    );

  const nodes = await p.$$(".slide");
  for (let i = 0; i < nodes.length; i++) {
    const png = await nodes[i].screenshot({ type: "png", animations: "disabled" });
    // dimensiones reales leídas del IHDR del PNG (no de lo que creemos que pedimos)
    const pw = png.readUInt32BE(16);
    const ph = png.readUInt32BE(20);
    const file = join(outAbs, `${PREFIX}-${String(i + 1).padStart(2, "0")}.png`);
    await writeFile(file, png);
    written.push({ file, w: pw, h: ph, bytes: png.length });
  }
} finally {
  await browser.close();
}

console.log(`make-carousel: ${written.length} slides · ${FORMAT} ${W}x${H} · accent ${ACCENT} · ${outAbs}`);
for (const f of written) {
  const ok = f.w === W && f.h === H ? "ok" : "TAMAÑO INESPERADO";
  console.log(`  ${f.file}  ${f.w}x${f.h}  ${(f.bytes / 1024).toFixed(0)} KB  ${ok}`);
}
