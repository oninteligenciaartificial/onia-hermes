#!/usr/bin/env node
/**
 * Onia carousel render engine.
 *
<<<<<<< HEAD
 * brief JSON (from carousel_generator.py) -> branded PNG slides.
 * Formats: feed 1080x1350 (default) | cuadrado 1080x1080 | story 1080x1920.
=======
 * brief JSON -> branded PNG slides en 3 formatos (--format feed|square|story).
 * feed 1080x1350 (4:5, default) · square 1080x1080 · story 1080x1920.
>>>>>>> origin/main
 * Zero external deps: builds one HTML per slide and screenshots it with
 * Edge/Chrome headless (same approach as the propuestas generador).
 *
 * Encodes the 5 Onia carousel rules via slide roles:
 *   cover  -> frena el scroll, hook gigante, contraste brutal (regla 1)
 *   stakes -> confirma el hook / sube lo que está en juego (regla 2)
 *   point  -> una idea por slide, screenshot suelto (regla 3)
 *   save   -> slide guardable: framework / prompt / frase (regla 4)
 *   cta    -> CTA motor + comment trigger (regla 5)
 *
 * Usage:
 *   node carousel_render.js --brief brief.json --out ./out [--account onia|arthur|sergio] [--bg path.jpg] [--formato feed|cuadrado|story]
 *
 * Node >= 18, CommonJS.
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const BRAND = path.join(__dirname, '..', 'hermes-content', 'brand');
const ROOT = path.join(__dirname, '..');

// Resuelve una ruta de asset (de un slide) a file:// absoluto. Acepta rutas
// relativas al repo o absolutas. Devuelve '' si no existe.
function assetUrl(p) {
  if (!p) return '';
  const abs = path.isAbsolute(p) ? p : path.join(ROOT, p);
  return fs.existsSync(abs) ? `file://${abs.replace(/\\/g, '/')}` : '';
}

const BROWSER_CANDIDATES = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
];

const ACCOUNTS = {
  // Handle IG real de ONIA, confirmado por Sergio 2026-08-13.
  onia: { handle: '@oniahq', name: 'Onia', personal: false },
  arthur: { handle: '@arthur', name: 'Arthur', personal: true },
  sergio: { handle: '@sergio', name: 'Sergio', personal: true },
  nuvia: { handle: '@nuvia.bo', name: 'Nuvia', personal: false },
  lucia: { handle: '@lucia.antelo.oficial', name: 'Lucía Antelo', personal: true },
};

// Brand kits para packs no-Onia. Cada marca define superficie, tinta, acentos
// y logo. El pack bright-retail los consume.
const BRANDS = {
  nuvia: {
    name: 'Nuvia',
    handle: '@nuvia.bo',
    tagline: 'EVERYTHING FOR EVERYONE',
    bg: '#FFFBF4',
    surface2: '#FFFFFF',
    ink: '#0F2D52',
    muted: '#5C6B82',
    accents: ['#00A7A0', '#FF6B6B', '#F5B400', '#7B4FB5'],
    stripes: ['#0F2D52', '#00A7A0', '#F5B400', '#FF6B6B', '#7B4FB5'],
    logo: path.join(__dirname, '..', 'web-factory', 'data', 'clients', 'nuvia.assets', 'nuvia-icon.png'),
  },
};

function findBrowser() {
  for (const c of BROWSER_CANDIDATES) {
    if (fs.existsSync(c)) return c;
  }
  throw new Error('No Edge/Chrome found. Install one of: ' + BROWSER_CANDIDATES.join(', '));
}

const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const PACKS = ['typographic', 'dark-product', 'dark-neon', 'editorial-photo', 'bright-retail'];

<<<<<<< HEAD
// Formatos de salida. 'feed' (1080x1350) es el default historico: quien llama
// sin --formato sigue recibiendo exactamente lo mismo de siempre.
const FORMATS = {
  feed: { w: 1080, h: 1350 },
  cuadrado: { w: 1080, h: 1080 },
  story: { w: 1080, h: 1920 },
};

// Resuelve el formato desde args (o el default). Todas las plantillas lo usan.
function fmtOf(args) {
  return FORMATS[(args && args.formato) || 'feed'] || FORMATS.feed;
}

function parseArgs(argv) {
  const a = { out: './out', account: 'onia', bg: '', pack: 'typographic', object: '', formato: 'feed' };
=======
// Los 3 formatos que pide Instagram. Hasta el 2026-08-15 el render estaba fijo en 4:5 y
// no se podian hacer ni cuadrados ni historias (gap del prompt A3).
const FORMATS = {
  feed: { w: 1080, h: 1350 },   // 4:5  — carrusel de feed, el default de siempre
  square: { w: 1080, h: 1080 }, // 1:1  — feed cuadrado
  story: { w: 1080, h: 1920 },  // 9:16 — historia
};

// Estado de modulo a proposito: los 5 packs construyen su CSS en template literals sueltos
// y pasarles el tamano por parametro obligaba a tocar 5 firmas. El script es CLI de una
// corrida; el default deja el comportamiento anterior intacto.
let FMT = FORMATS.feed;

// Una historia NO es un feed mas alto. Instagram tapa ~280px arriba (foto, nombre, cerrar) y
// ~360px abajo (barra de responder y compartir). Sin esto el texto queda pegado al borde,
// debajo de su UI, y sobra un hueco enorme en el medio. Los 5 packs comparten
// `.slide { padding:var(--pad); display:flex; flex-direction:column }`, asi que un solo
// override sirve para todos.
// OJO especificidad: este bloque se inyecta ANTES de la regla `.slide` de cada pack, asi que
// va con `html body .slide` para ganar la cascada. Con `.slide` a secas lo pisa el
// `padding:var(--pad)` que viene despues y el arreglo no se aplica (pasó, 2026-08-15).
const safeAreaCss = () => FMT.h < 1600 ? '' : `
html body .slide { padding-top:300px; padding-bottom:380px; }
html body .slide .dots { margin-top:56px; padding-top:0; }
`;

function parseArgs(argv) {
  const a = { out: './out', account: 'onia', bg: '', pack: 'typographic', object: '', accent: '', format: 'feed' };
>>>>>>> origin/main
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i];
    if (k === '--brief') a.brief = argv[++i];
    else if (k === '--out') a.out = argv[++i];
    else if (k === '--account') a.account = argv[++i];
    else if (k === '--bg') a.bg = argv[++i];
    else if (k === '--pack') a.pack = argv[++i];
    else if (k === '--object') a.object = argv[++i];
<<<<<<< HEAD
    else if (k === '--formato') a.formato = argv[++i];
=======
    else if (k === '--accent') a.accent = argv[++i];
    else if (k === '--format') a.format = argv[++i];
  }
  if (!FORMATS[a.format]) {
    throw new Error('Unknown --format: ' + a.format + ' (use ' + Object.keys(FORMATS).join('|') + ')');
  }
  FMT = FORMATS[a.format];
  // --accent permite que una cuenta personal (una modelo) tenga SU color y no el
  // verde de la marca Onia. Sin el flag, nada cambia.
  if (a.accent && !/^#[0-9a-fA-F]{6}$/.test(a.accent)) {
    throw new Error('--accent debe ser hex #RRGGBB, recibi: ' + a.accent);
>>>>>>> origin/main
  }
  if (!a.brief) throw new Error('Missing --brief <file.json>');
  if (!ACCOUNTS[a.account]) throw new Error('Unknown account: ' + a.account);
  if (!PACKS.includes(a.pack)) throw new Error('Unknown --pack: ' + a.pack + ' (use ' + PACKS.join('|') + ')');
  if (!FORMATS[a.formato]) throw new Error('Unknown --formato: ' + a.formato + ' (use ' + Object.keys(FORMATS).join('|') + ')');
  return a;
}

// Derive role from explicit flag or position.
function roleFor(slide, idx, total) {
  if (slide.role) return slide.role;
  if (idx === 0) return 'cover';
  if (idx === 1) return 'stakes';
  if (idx === total - 1) return 'cta';
  if (slide.save_worthy) return 'save';
  return 'point';
}

function pageNo(idx, total) {
  const p = String(idx + 1).padStart(2, '0');
  const t = String(total).padStart(2, '0');
  return `${p} / ${t}`;
}

// continuation cue at right edge (peek arrow) — lifts swipe-through
const swipeCue = (last) => last ? '' :
  `<div class="cue">→</div>`;

const saveBar = `<div class="savebar">Guardá esto ↗</div>`;

// CAROUSEL_PATTERN_BANK §7: la pildora de arriba CAMBIA DE ROL segun la seccion
// (categoria -> contador -> CTA). Es el sistema de navegacion mas barato que existe:
// el lector siempre sabe donde esta sin leer nada.
function pill(role, idx, total, account) {
  const txt = role === 'cover' ? ACCOUNTS[account].name.toUpperCase()
    : role === 'cta' ? 'COMENTÁ'
    : `PASO ${String(idx + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
  return `<div class="pill">${esc(txt)}</div>`;
}

// Puntos DENTRO de la imagen: el lector ve cuantas slides son y se compromete.
// Un "03 / 08" en texto no produce ese efecto; los puntos si.
function dots(idx, total) {
  const d = Array.from({ length: total }, (_, i) =>
    `<i class="${i === idx ? 'on' : ''}"></i>`).join('');
  return `<div class="dots">${d}</div>`;
}

// La palabra del trueque sale del propio cuerpo del ultimo slide ("Comentá *LISTA* y...").
// Asi el ticket no puede desincronizarse del texto: hay una sola fuente.
function triggerWord(slide) {
  const m = String(slide.body || '').match(/Comentá\s+\*?([A-ZÁÉÍÓÚÑ]{3,})\*?/);
  return m ? m[1] : '';
}

// Itemizado con guia punteada, para el estatico "recibo". El motor solo tenia un <p> unico
// como cuerpo (los saltos de linea colapsan), asi que una oferta no se podia desglosar.
// Opcional: sin `lines[]` en el brief no cambia nada.
const itemLines = (slide) => !Array.isArray(slide.lines) || !slide.lines.length ? '' :
  `<div class="lines">${slide.lines.map((l) =>
    `<div class="ln"><span class="ln-k">${esc(l.k)}</span><i class="ln-d"></i><span class="ln-v">${esc(l.v)}</span></div>`
  ).join('')}</div>`;

function logoFooter(account) {
  const acc = ACCOUNTS[account];
  return `<div class="footer">
    <svg class="mark" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="43" stroke="var(--ink)" stroke-width="13" fill="none"/>
      <path d="M60 17 A43 43 0 0 1 98 43" stroke="var(--onia-green)" stroke-width="13" fill="none" stroke-linecap="round"/>
      <circle cx="98" cy="43" r="11" fill="var(--onia-green)"/>
      <circle cx="98" cy="43" r="4.5" fill="var(--ink)"/>
    </svg>
    <span class="handle">${esc(acc.handle)}</span>
  </div>`;
}

function slideHtml(slide, idx, total, account, bg, formato) {
  const role = roleFor(slide, idx, total);
  const last = idx === total - 1;
  const acc = ACCOUNTS[account];
  const { w: W, h: H } = fmtOf({ formato });
  const bgLayer = bg
    ? `<div class="bgphoto" style="background-image:url('file://${bg.replace(/\\/g, '/')}')"></div><div class="bgscrim"></div>`
    : '';

  let inner = '';
  const word = triggerWord(slide);

  if (role === 'cover') {
    inner = `
      ${bgLayer}
      <div class="topline">${pill(role, idx, total, account)}<span class="swipe">SWIPE →</span></div>
      <h1 class="hook">${emph(slide.headline)}</h1>
      ${slide.body ? `<p class="coverline">${emph(slide.body)}</p>` : ''}
      ${dots(idx, total)}
      ${logoFooter(account)}`;
  } else if (role === 'cta') {
    // El cierre es la slide que casi nadie copia bien. El banco §7: el CTA aparece
    // TRES veces (titular, ticket, boton) y se pide GUARDAR ademas de comentar —
    // son dos senales distintas del algoritmo y se piden juntas. De paso, el ticket
    // llena el vacio que dejaba esta slide con solo dos lineas de texto.
    inner = `
      ${bgLayer}
      <div class="topline">${pill(role, idx, total, account)}</div>
      <h2 class="cta-h">${emph(slide.headline)}</h2>
      <p class="body">${emph(slide.body)}</p>
      ${itemLines(slide)}
      ${word && !itemLines(slide) ? `<div class="ticket">
        <div class="ticket-l">
          <span class="ticket-k">Comentás</span>
          <span class="ticket-w">${esc(word)}</span>
        </div>
        <div class="ticket-r">
          <span class="ticket-k">Y recibís</span>
          <span class="ticket-v">${word === 'SISTEMA' ? 'tu diagnóstico de 20 min' : 'la lista con los costos'}</span>
        </div>
      </div>` : ''}
      ${word ? `<div class="ctabtn">Comentá ${esc(word)}</div>` : ''}
      <p class="savehint">Gratis. Guardalo para cuando te sientes a resolverlo.</p>
      ${logoFooter(account)}`;
  } else if (role === 'save') {
    inner = `
      <div class="topline">${pill(role, idx, total, account)}</div>
      ${saveBar}
      <div class="savecard">
        <div class="savetag">FRAMEWORK</div>
        <h2 class="point-h">${emph(slide.headline)}</h2>
        <p class="body">${emph(slide.body)}</p>
      </div>
      ${dots(idx, total)}
      ${swipeCue(last)}
      ${logoFooter(account)}`;
  } else { // stakes | point
    inner = `
      <div class="topline">${pill(role, idx, total, account)}</div>
      <h2 class="point-h">${emph(slide.headline)}</h2>
      <p class="body">${emph(slide.body)}</p>
      ${dots(idx, total)}
      ${swipeCue(last)}
      ${logoFooter(account)}`;
  }

  const tokens = fs.readFileSync(path.join(BRAND, 'tokens.css'), 'utf8');
  return `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;600&display=swap" rel="stylesheet">
<style>
${tokens}
* { margin:0; padding:0; box-sizing:border-box; }
<<<<<<< HEAD
html,body { width:${W}px; height:${H}px; }
.slide {
  position:relative; width:${W}px; height:${H}px; overflow:hidden;
=======
html,body { width:${FMT.w}px; height:${FMT.h}px; }
${safeAreaCss()}
.slide {
  position:relative; width:${FMT.w}px; height:${FMT.h}px; overflow:hidden;
>>>>>>> origin/main
  padding:var(--pad); display:flex; flex-direction:column;
  font-family:var(--font-body);
  --ink:var(--onia-ink);
  background:var(--onia-surface); color:var(--onia-ink);
}
/* role backgrounds */
.slide.cover { background:var(--onia-ink); color:var(--onia-white); --ink:var(--onia-white); justify-content:center; }
.slide.cta   { background:var(--onia-green); color:var(--onia-ink); justify-content:center; }
.slide.save  { background:var(--onia-ink); color:var(--onia-white); --ink:var(--onia-white); }

.bgphoto { position:absolute; inset:0; background-size:cover; background-position:center; }
.bgscrim { position:absolute; inset:0; background:linear-gradient(180deg, rgba(10,15,13,.45), rgba(10,15,13,.88)); }
.slide.cover > *:not(.bgphoto):not(.bgscrim) { position:relative; z-index:2; }
.slide.cta   > *:not(.bgphoto):not(.bgscrim) { position:relative; z-index:2; }

.kicker { font-family:var(--font-display); font-weight:500; font-size:30px;
  letter-spacing:6px; text-transform:uppercase; color:var(--onia-green); margin-bottom:36px; }

/* Pildora de rol cambiante + puntos de progreso (CAROUSEL_PATTERN_BANK §7). */
.topline { display:flex; align-items:center; justify-content:space-between; margin-bottom:44px; }
.pill { font-family:var(--font-display); font-weight:700; font-size:26px; letter-spacing:4px;
  text-transform:uppercase; padding:14px 28px; border-radius:999px;
  background:var(--onia-green); color:var(--onia-ink); }
.slide.cta .pill { background:var(--onia-ink); color:var(--onia-green); }
.swipe { font-family:var(--font-display); font-weight:700; font-size:24px; letter-spacing:3px;
  color:var(--onia-green); opacity:.9; }
.dots { display:flex; gap:12px; margin-top:auto; padding-top:40px; }
.dots i { width:14px; height:14px; border-radius:50%; background:currentColor; opacity:.22; }
.dots i.on { opacity:1; background:var(--onia-green); }

/* Ticket del trueque: la palabra a comentar ES el cupon. */
/* flex-shrink:0 — sin esto el ticket se encoge a cero en silencio cuando la slide se
   llena y desaparece del PNG sin ningun error. Pasó el 2026-08-15 con el recibo. */
.ticket { display:flex; flex-shrink:0; margin-top:56px; border-radius:28px; overflow:hidden;
  background:var(--onia-ink); color:var(--onia-white); }
.ticket-l, .ticket-r { padding:38px 40px; display:flex; flex-direction:column; gap:10px; }
.ticket-l { flex:0 0 44%; border-right:6px dashed var(--onia-green); }
.ticket-r { flex:1; }
.ticket-k { font-size:26px; letter-spacing:3px; text-transform:uppercase; opacity:.62; }
.ticket-w { font-family:var(--font-display); font-weight:700; font-size:76px;
  letter-spacing:-1px; color:var(--onia-green); }
.ticket-v { font-family:var(--font-display); font-weight:700; font-size:40px; line-height:1.15; }
.ctabtn { margin-top:32px; align-self:flex-start; background:var(--onia-ink);
  color:var(--onia-green); font-family:var(--font-display); font-weight:700; font-size:46px;
  padding:26px 52px; border-radius:999px; }
.savehint { margin-top:28px; font-size:32px; opacity:.72; }
.lines { margin-top:44px; display:flex; flex-direction:column; gap:20px; }
.ln { display:flex; align-items:baseline; gap:16px; font-size:36px; }
.ln-k { font-weight:600; }
.ln-d { flex:1; border-bottom:5px dotted currentColor; opacity:.32; }
.ln-v { font-family:var(--font-display); font-weight:700; font-size:42px; white-space:nowrap; }
.hook { font-family:var(--font-display); font-weight:700; font-size:118px;
  line-height:1.02; letter-spacing:-3px; }
.coverline { font-size:42px; line-height:1.35; color:var(--onia-muted-dark); margin-top:40px; max-width:840px; }

.pageno { font-family:var(--font-display); font-weight:500; font-size:28px;
  letter-spacing:3px; color:var(--onia-green); }
.point-h { font-family:var(--font-display); font-weight:700; font-size:76px;
  line-height:1.06; letter-spacing:-2px; margin-top:auto; }
.body { font-size:42px; line-height:1.45; margin-top:36px; max-width:880px;
  color:var(--onia-muted); }
.slide.save .body { color:var(--onia-muted-dark); }

.cta-h { font-family:var(--font-display); font-weight:700; font-size:88px;
  line-height:1.05; letter-spacing:-2px; }
.slide.cta .body { color:var(--onia-ink); opacity:.85; font-weight:600; }

.savebar { align-self:flex-start; margin-top:24px; background:var(--onia-green);
  color:var(--onia-ink); font-family:var(--font-display); font-weight:700;
  font-size:30px; padding:14px 28px; border-radius:100px; }
.savecard { margin-top:auto; border:3px solid var(--onia-green); border-radius:var(--r-lg);
  padding:64px; }
.savetag { font-family:var(--font-display); font-weight:700; font-size:26px;
  letter-spacing:4px; color:var(--onia-green); margin-bottom:28px; }

.cue { position:absolute; right:48px; top:50%; transform:translateY(-50%);
  font-size:64px; font-weight:700; color:var(--onia-green); opacity:.9; }

.footer { display:flex; align-items:center; gap:18px; margin-top:auto; padding-top:48px; }
.footer .mark { width:64px; height:64px; }
.footer .handle { font-family:var(--font-display); font-weight:500; font-size:30px;
  color:var(--ink); opacity:.7; }
.slide.cover .point-h, .slide.cover .body { margin-top:0; }
.g { color:var(--onia-green); }
.slide.cta .g { color:var(--onia-ink); }
</style></head>
<body><div class="slide ${role}">${inner}</div></body></html>`;
}

// Escape, then turn *emphasis* into a green span (keyword highlight).
function emph(s) {
  return esc(s).replace(/\*([^*]+)\*/g, '<span class="g">$1</span>');
}

// Continuation curve: a green stroke that bleeds off the right edge on
// non-last slides (and enters from the left on non-first), giving the
// Solaris-style panorama / swipe cue. Alternates arc direction by parity.
// The y coordinates were authored for the 1350px feed canvas; they scale with
// the format height so the band keeps its relative position (and the viewBox
// matches the slide, avoiding any stretch).
function continuationCurve(idx, total, formato) {
  const { w: W, h: H } = fmtOf({ formato });
  const k = H / 1350;
  const y = (v) => Math.round(v * k);
  const last = idx === total - 1;
  const first = idx === 0;
  const down = idx % 2 === 0;
  // Curve stays in the UPPER band (y 300-640 at feed height), the
  // floating-object zone, and never dips into the headline/body area at the
  // bottom — so it reads as a continuous panorama behind the 3D object
  // without crossing the text.
  // enter from left (unless first), exit right (unless last)
  const enter = first ? '' : (down
    ? `M -60 ${y(300)} C 220 ${y(300)} 260 ${y(560)} 540 ${y(560)}`
    : `M -60 ${y(600)} C 220 ${y(600)} 260 ${y(340)} 540 ${y(340)}`);
  const exit = last ? '' : (down
    ? `M 540 ${y(560)} C 860 ${y(560)} 940 ${y(320)} 1140 ${y(320)}`
    : `M 540 ${y(340)} C 860 ${y(340)} 940 ${y(600)} 1140 ${y(600)}`);
  const paths = [enter, exit].filter(Boolean)
    .map((d) => `<path d="${d}" />`).join('');
<<<<<<< HEAD
  return `<svg class="curve" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">${paths}</svg>`;
=======
  return `<svg class="curve" viewBox="0 0 ${FMT.w} ${FMT.h}" xmlns="http://www.w3.org/2000/svg">${paths}</svg>`;
>>>>>>> origin/main
}

// Pack: dark-product (Solaris-style). Black canvas, pills, continuation curve,
// condensed title with *green* keyword, optional 3D object, callout body.
function darkProductHtml(slide, idx, total, account, args) {
  const role = roleFor(slide, idx, total);
  const last = idx === total - 1;
  const acc = ACCOUNTS[account];
  const { w: W, h: H } = fmtOf(args);
  const tokens = fs.readFileSync(path.join(BRAND, 'tokens.css'), 'utf8');
  const object = args && args.object
    ? `<img class="object" src="file://${String(args.object).replace(/\\/g, '/')}" alt="">`
    : '';

  // On save slides the savetag already labels "FRAMEWORK", so drop the top pill
  // to avoid the duplicate and keep the hierarchy clean.
  const pills = (slide.pill && role !== 'save') ? `<div class="pills">
    <span class="pill solid">${esc(slide.pill)}</span>
  </div>` : '<div class="pills"></div>';

  const callout = slide.callout
    ? `<div class="callout">${emph(slide.callout)}</div>` : '';

  let block;
  if (role === 'save') {
    block = `<div class="savetag">FRAMEWORK · Guardá esto ↗</div>
      <h2 class="dp-h">${emph(slide.headline)}</h2>
      ${slide.body ? `<p class="dp-body">${emph(slide.body)}</p>` : ''}`;
  } else if (role === 'cta') {
    block = `<h2 class="dp-h cta">${emph(slide.headline)}</h2>
      ${slide.body ? `<p class="dp-body">${emph(slide.body)}</p>` : ''}`;
  } else {
    block = `<h2 class="dp-h">${emph(slide.headline)}</h2>
      ${slide.body ? `<p class="dp-body">${emph(slide.body)}</p>` : ''}`;
  }

  return `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;800;900&family=Inter:wght@400;600&display=swap" rel="stylesheet">
<style>
${tokens}
* { margin:0; padding:0; box-sizing:border-box; }
<<<<<<< HEAD
html,body { width:${W}px; height:${H}px; }
.slide { position:relative; width:${W}px; height:${H}px; overflow:hidden;
=======
html,body { width:${FMT.w}px; height:${FMT.h}px; }
${safeAreaCss()}
.slide { position:relative; width:${FMT.w}px; height:${FMT.h}px; overflow:hidden;
>>>>>>> origin/main
  padding:var(--pad); display:flex; flex-direction:column;
  background:var(--onia-ink); color:var(--onia-white);
  font-family:'Inter',var(--font-body); }
.slide.cta { background:var(--onia-green); color:var(--onia-ink); }
.g { color:var(--onia-green); }
.slide.cta .g { color:var(--onia-ink); -webkit-text-stroke:0; background:var(--onia-ink); color:var(--onia-green); padding:0 .12em; }

<<<<<<< HEAD
.curve { position:absolute; inset:0; width:${W}px; height:${H}px; z-index:0; pointer-events:none; }
=======
.curve { position:absolute; inset:0; width:${FMT.w}px; height:${FMT.h}px; z-index:0; pointer-events:none; }
>>>>>>> origin/main
.curve path { fill:none; stroke:var(--onia-green); stroke-width:16; stroke-linecap:round; opacity:.95; }
.slide.cta .curve path { stroke:var(--onia-ink); opacity:.5; }
.slide > *:not(.curve) { position:relative; z-index:2; }

.pills { display:flex; align-items:center; gap:16px; }
.pill { font-family:'Archivo'; font-weight:600; font-size:26px; color:var(--onia-white);
  border:2px solid rgba(255,255,255,.35); border-radius:100px; padding:10px 22px; }
.pill.solid { background:var(--onia-green); color:var(--onia-ink); border-color:var(--onia-green); }
.slide.cta .pill { color:var(--onia-ink); border-color:rgba(10,15,13,.4); }
.slide.cta .pill.solid { background:var(--onia-ink); color:var(--onia-green); }
.pageno { margin-left:auto; font-family:'Archivo'; font-weight:600; font-size:26px;
  letter-spacing:2px; color:var(--onia-green); }
.slide.cta .pageno { color:var(--onia-ink); }

.object { display:block; max-width:620px; max-height:420px; margin:24px auto;
  object-fit:contain; filter:drop-shadow(0 30px 60px rgba(0,0,0,.5)); }

.dp-h { font-family:'Archivo'; font-weight:900; font-size:88px; line-height:.98;
  letter-spacing:-2px; text-transform:uppercase; margin-top:auto; }
.dp-h.cta { font-size:80px; }
.dp-body { font-family:'Inter'; font-weight:600; font-size:36px; line-height:1.38;
  margin-top:28px; max-width:880px; color:var(--onia-muted-dark); }
.slide.cta .dp-body { color:var(--onia-ink); opacity:.85; }

.savetag { font-family:'Archivo'; font-weight:800; font-size:28px; letter-spacing:3px;
  color:var(--onia-green); margin-top:auto; margin-bottom:24px; }

.callout { display:inline-flex; align-self:flex-start; gap:12px; margin-top:32px;
  background:var(--onia-white); color:var(--onia-ink); font-weight:600; font-size:32px;
  border-radius:24px; padding:22px 30px; max-width:760px; }

.footer { display:flex; align-items:center; gap:18px; margin-top:48px; }
.footer .mark { width:60px; height:60px; }
.footer .handle { font-family:'Archivo'; font-weight:600; font-size:30px; opacity:.75; }
.footer .mark circle[stroke="var(--ink)"] { stroke:var(--onia-white); }
.slide.cta .footer .handle { color:var(--onia-ink); }
</style></head>
<body><div class="slide ${role}">
  ${continuationCurve(idx, total, args && args.formato)}
  ${pills}
  ${object}
  ${block}
  ${callout}
  <div class="footer">
    <svg class="mark" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="43" stroke="${role === 'cta' ? 'var(--onia-ink)' : 'var(--onia-white)'}" stroke-width="13" fill="none"/>
      <path d="M60 17 A43 43 0 0 1 98 43" stroke="var(--onia-green)" stroke-width="13" fill="none" stroke-linecap="round"/>
      <circle cx="98" cy="43" r="11" fill="var(--onia-green)"/>
      <circle cx="98" cy="43" r="4.5" fill="${role === 'cta' ? 'var(--onia-ink)' : 'var(--onia-white)'}"/>
    </svg>
    <span class="handle">${esc(acc.handle)}</span>
  </div>
</div></body></html>`;
}

// Pack: dark-neon (Perfluence style). Black canvas, faint grid + radial green
// glow + halftone dots, neon headline (green glow), floating 3D object with glow.
function darkNeonHtml(slide, idx, total, account, args) {
  const role = roleFor(slide, idx, total);
  const acc = ACCOUNTS[account];
  const { w: W, h: H } = fmtOf(args);
  const tokens = fs.readFileSync(path.join(BRAND, 'tokens.css'), 'utf8');
  const object = args && args.object
    ? `<img class="object" src="file://${String(args.object).replace(/\\/g, '/')}" alt="">`
    : '';

  const pills = (slide.pill && role !== 'save') ? `<div class="pills">
    <span class="pill solid">${esc(slide.pill)}</span>
  </div>` : '<div class="pills"></div>';
  const callout = slide.callout ? `<div class="callout">${emph(slide.callout)}</div>` : '';

  let block;
  if (role === 'save') {
    block = `<div class="savetag">FRAMEWORK · Guardá esto ↗</div>
      <h2 class="dn-h">${emph(slide.headline)}</h2>
      ${slide.body ? `<p class="dn-body">${emph(slide.body)}</p>` : ''}`;
  } else {
    block = `<h2 class="dn-h${role === 'cta' ? ' cta' : ''}">${emph(slide.headline)}</h2>
      ${slide.body ? `<p class="dn-body">${emph(slide.body)}</p>` : ''}`;
  }

  return `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;800;900&family=Inter:wght@400;600&display=swap" rel="stylesheet">
<style>
${tokens}
* { margin:0; padding:0; box-sizing:border-box; }
<<<<<<< HEAD
html,body { width:${W}px; height:${H}px; }
.slide { position:relative; width:${W}px; height:${H}px; overflow:hidden;
=======
html,body { width:${FMT.w}px; height:${FMT.h}px; }
${safeAreaCss()}
.slide { position:relative; width:${FMT.w}px; height:${FMT.h}px; overflow:hidden;
>>>>>>> origin/main
  padding:var(--pad); display:flex; flex-direction:column;
  background:#05080A; color:var(--onia-white); font-family:'Inter',var(--font-body); }
.grid { position:absolute; inset:0; z-index:0;
  background-image:linear-gradient(rgba(52,224,74,.10) 1px, transparent 1px),
    linear-gradient(90deg, rgba(52,224,74,.10) 1px, transparent 1px);
  background-size:60px 60px; -webkit-mask-image:radial-gradient(circle at 50% 38%, #000 0%, transparent 72%); }
.glow { position:absolute; left:50%; top:34%; transform:translate(-50%,-50%);
  width:900px; height:900px; z-index:0; border-radius:50%;
  background:radial-gradient(circle, rgba(52,224,74,.28) 0%, rgba(52,224,74,0) 62%); }
.halftone { position:absolute; right:-40px; bottom:240px; width:360px; height:360px; z-index:0; opacity:.5;
  background-image:radial-gradient(rgba(52,224,74,.6) 30%, transparent 32%); background-size:20px 20px;
  -webkit-mask-image:linear-gradient(135deg, #000, transparent 70%); }
.slide > *:not(.grid):not(.glow):not(.halftone) { position:relative; z-index:2; }
.g { color:var(--onia-green); }
.pills { display:flex; align-items:center; gap:16px; }
.pill { font-family:'Archivo'; font-weight:600; font-size:26px; color:var(--onia-white);
  border:2px solid rgba(52,224,74,.45); border-radius:100px; padding:10px 22px; }
.pill.solid { background:var(--onia-green); color:#05080A; border-color:var(--onia-green);
  box-shadow:0 0 24px rgba(52,224,74,.5); }
.pageno { margin-left:auto; font-family:'Archivo'; font-weight:600; font-size:26px; letter-spacing:2px; color:var(--onia-green); }
.object { display:block; max-width:600px; max-height:410px; margin:20px auto;
  object-fit:contain; filter:drop-shadow(0 0 50px rgba(52,224,74,.45)) drop-shadow(0 30px 50px rgba(0,0,0,.6)); }
.dn-h { font-family:'Archivo'; font-weight:900; font-size:88px; line-height:.98;
  letter-spacing:-2px; text-transform:uppercase; margin-top:auto; }
.dn-h.cta { font-size:80px; }
.dn-h .g { text-shadow:0 0 28px rgba(52,224,74,.75); }
.dn-body { font-family:'Inter'; font-weight:600; font-size:36px; line-height:1.38;
  margin-top:28px; max-width:880px; color:rgba(255,255,255,.78); }
.savetag { font-family:'Archivo'; font-weight:800; font-size:28px; letter-spacing:3px;
  color:var(--onia-green); margin-top:auto; margin-bottom:24px; }
.callout { display:inline-flex; align-self:flex-start; gap:12px; margin-top:32px;
  background:rgba(52,224,74,.12); border:2px solid rgba(52,224,74,.5);
  color:var(--onia-white); font-weight:600; font-size:32px; border-radius:24px; padding:20px 28px; max-width:780px; }
.footer { display:flex; align-items:center; gap:18px; margin-top:48px; }
.footer .mark { width:60px; height:60px; }
.footer .handle { font-family:'Archivo'; font-weight:600; font-size:30px; opacity:.75; }
</style></head>
<body><div class="slide ${role}">
  <div class="grid"></div><div class="glow"></div><div class="halftone"></div>
  ${pills}
  ${object}
  ${block}
  ${callout}
  <div class="footer">
    <svg class="mark" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="43" stroke="var(--onia-white)" stroke-width="13" fill="none"/>
      <path d="M60 17 A43 43 0 0 1 98 43" stroke="var(--onia-green)" stroke-width="13" fill="none" stroke-linecap="round"/>
      <circle cx="98" cy="43" r="11" fill="var(--onia-green)"/>
      <circle cx="98" cy="43" r="4.5" fill="var(--onia-white)"/>
    </svg>
    <span class="handle">${esc(acc.handle)}</span>
  </div>
</div></body></html>`;
}

// Pack: editorial-photo (Mobile Editing Club / Asterisk style). Full-bleed photo,
// scrim + grain, heavy sans headline with *serif-italic* accent, pill caption.
// Needs --bg (a photo). Falls back to ink field if no photo given.
function editorialPhotoHtml(slide, idx, total, account, args) {
  const role = roleFor(slide, idx, total);
  const last = idx === total - 1;
  const acc = ACCOUNTS[account];
  const { w: W, h: H } = fmtOf(args);
  const tokens = fs.readFileSync(path.join(BRAND, 'tokens.css'), 'utf8');
  const rawBg = slide.bg || (args && args.bg) || '';
  const bg = rawBg ? path.resolve(rawBg).replace(/\\/g, '/') : '';
  const photo = bg
    ? `<div class="photo" style="background-image:url('file://${bg}')"></div>`
    : '';

  const headTag = role === 'cover' ? 'h1' : 'h2';
  const pill = slide.pill
    ? `<div class="topbar"><span class="captop">${esc(slide.pill)}</span></div>` : '';
  const body = slide.body ? `<p class="ed-body">${emph(slide.body)}</p>` : '';
  // Acento propio de la cuenta (una modelo no lleva el verde de la marca Onia).
  const accentVar = (args && args.accent)
    ? `:root, .slide { --onia-green: ${args.accent}; }` : '';

  return `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@800;900&family=Fraunces:ital,wght@1,500;1,600&family=Inter:wght@500;600&display=swap" rel="stylesheet">
<style>
${tokens}
${accentVar}
* { margin:0; padding:0; box-sizing:border-box; }
<<<<<<< HEAD
html,body { width:${W}px; height:${H}px; }
.slide { position:relative; width:${W}px; height:${H}px; overflow:hidden;
=======
html,body { width:${FMT.w}px; height:${FMT.h}px; }
${safeAreaCss()}
.slide { position:relative; width:${FMT.w}px; height:${FMT.h}px; overflow:hidden;
>>>>>>> origin/main
  padding:var(--pad); display:flex; flex-direction:column; justify-content:flex-end;
  background:var(--onia-ink); color:var(--onia-white); font-family:'Inter',var(--font-body); }
.photo { position:absolute; inset:0; background-size:cover; background-position:center; z-index:0; }
.scrim { position:absolute; inset:0; z-index:1;
  background:linear-gradient(180deg, rgba(10,15,13,.15) 0%, rgba(10,15,13,.55) 55%, rgba(10,15,13,.92) 100%); }
.grain { position:absolute; inset:0; z-index:2; opacity:.10; mix-blend-mode:overlay; }
.slide > *:not(.photo):not(.scrim):not(.grain):not(.topbar) { position:relative; z-index:3; }

/* Category pill sits at the TOP (niche-winner pattern); no ghost kicker/pageno
   behind the headline. */
.topbar { position:absolute; top:var(--pad); left:var(--pad); right:var(--pad);
  display:flex; align-items:flex-start; z-index:4; height:auto; pointer-events:none; }
.captop { display:inline-flex; background:var(--onia-green); color:var(--onia-ink);
  font-family:'Archivo'; font-weight:800; font-size:26px; letter-spacing:1px;
  text-transform:uppercase; padding:12px 24px; border-radius:100px; }

.ed-h { font-family:'Archivo'; font-weight:900; font-size:96px; line-height:.98;
  letter-spacing:-2px; text-transform:uppercase; }
.ed-h .g { font-family:'Fraunces'; font-style:italic; font-weight:600; text-transform:none;
  color:var(--onia-green); letter-spacing:0; }
.ed-body { font-family:'Inter'; font-weight:500; font-size:38px; line-height:1.4;
  margin-top:28px; max-width:880px; color:rgba(255,255,255,.85); }
.ed-body .g { color:var(--onia-green); font-family:'Fraunces'; font-style:italic; }
.swipe { align-self:flex-start; margin-top:28px; font-family:'Archivo'; font-weight:800;
  font-size:26px; letter-spacing:3px; text-transform:uppercase; color:var(--onia-green); }

.footer { display:flex; align-items:center; gap:16px; margin-top:40px; }
.footer .mark { width:56px; height:56px; }
.footer .handle { font-family:'Archivo'; font-weight:800; font-size:28px; opacity:.85; }
</style></head>
<body><div class="slide ${role}">
  ${photo}<div class="scrim"></div>
  <svg class="grain" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2"/></filter><rect width="300" height="300" filter="url(#n)"/></svg>
  ${pill}
  <${headTag} class="ed-h">${emph(slide.headline)}</${headTag}>
  ${body}
  ${last ? '' : '<div class="swipe">Deslizá →</div>'}
  <div class="footer">
    <svg class="mark" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="43" stroke="var(--onia-white)" stroke-width="13" fill="none"/>
      <path d="M60 17 A43 43 0 0 1 98 43" stroke="var(--onia-green)" stroke-width="13" fill="none" stroke-linecap="round"/>
      <circle cx="98" cy="43" r="11" fill="var(--onia-green)"/>
      <circle cx="98" cy="43" r="4.5" fill="var(--onia-white)"/>
    </svg>
    <span class="handle">${esc(acc.handle)}</span>
  </div>
</div></body></html>`;
}

// Ribbon multicolor continuo (eco de las franjas del logo Nuvia). Fluye de
// borde a borde y cambia de fase por slide -> sensación de panorama/peek entre
// slides, como la curva verde del pack dark-product de Onia.
function nuviaRibbon(idx, total, stripes, onAccent, formato) {
  const { w: W, h: H } = fmtOf({ formato });
  const k = H / 1350; // alturas autoradas para el feed de 1350px; escalan con el formato
  const first = idx === 0;
  const last = idx === total - 1;
  // S-curve base que entra por izquierda y sale por derecha; alterna altura.
  const up = idx % 2 === 0;
  const yA = Math.round((up ? 430 : 980) * k);
  const yB = Math.round((up ? 980 : 430) * k);
  const base = `M -120 ${yA} C 260 ${yA} 320 ${yB} 560 ${yB} S 900 ${yA} 1200 ${yA}`;
  const cols = onAccent
    ? ['rgba(255,255,255,.9)', 'rgba(255,255,255,.6)', 'rgba(255,255,255,.35)', 'rgba(255,255,255,.2)', 'rgba(255,255,255,.12)']
    : stripes;
  const paths = cols.map((c, i) =>
    `<path d="${base}" fill="none" stroke="${c}" stroke-width="22" stroke-linecap="round" transform="translate(0 ${(i - 2) * 30})"/>`
  ).join('');
  // En cover/cta el ribbon va más visible; en el resto, sutil al fondo.
  const op = onAccent ? 0.9 : (first || last ? 0.5 : 0.28);
<<<<<<< HEAD
  return `<svg class="ribbon" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" style="opacity:${op}">${paths}</svg>`;
=======
  return `<svg class="ribbon" viewBox="0 0 ${FMT.w} ${FMT.h}" xmlns="http://www.w3.org/2000/svg" style="opacity:${op}">${paths}</svg>`;
>>>>>>> origin/main
}

// Pack: bright-retail (Nuvia-style). Marca clara/multicolor, amigable, con
// ribbon continuo, composición anclada y slot de producto por slide.
function brightRetailHtml(slide, idx, total, account, args) {
  const role = roleFor(slide, idx, total);
  const last = idx === total - 1;
  const acc = ACCOUNTS[account] || ACCOUNTS.onia;
  const { w: W, h: H } = fmtOf(args);
  const brand = BRANDS[account] || BRANDS.nuvia;
  const accent = brand.accents[idx % brand.accents.length];
  const stripes = brand.stripes || brand.accents;
  const tokens = fs.readFileSync(path.join(BRAND, 'tokens.css'), 'utf8');

  const coverLike = role === 'cover' || role === 'cta';
  // objeto: por-slide (slide.object) o global (--object). Ruta relativa al repo.
  const objUrl = assetUrl(slide.object) || (args && args.object ? assetUrl(args.object) : '');
  const object = objUrl ? `<img class="object" src="${objUrl}" alt="">` : '';
  const logoUrl = assetUrl(brand.logo);
  const logo = logoUrl ? `<img class="brandmark" src="${logoUrl}" alt="">` : '';

  const pill = slide.pill ? `<span class="pill">${esc(slide.pill)}</span>` : '';
  const callout = slide.callout ? `<div class="callout">${emph(slide.callout)}</div>` : '';
  const headTag = role === 'cover' ? 'h1' : 'h2';
  const body = slide.body ? `<p class="br-body">${emph(slide.body)}</p>` : '';
  const savetag = role === 'save' ? `<div class="savetag">GUARDÁ ESTO ↗</div>` : '';
  const hlen = (slide.headline || '').replace(/\*/g, '').length;
  const hsize = hlen > 30 ? 86 : (hlen > 18 ? 100 : 116);

  return `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;800;900&display=swap" rel="stylesheet">
<style>
${tokens}
* { margin:0; padding:0; box-sizing:border-box; }
<<<<<<< HEAD
html,body { width:${W}px; height:${H}px; }
.slide { position:relative; width:${W}px; height:${H}px; overflow:hidden;
=======
html,body { width:${FMT.w}px; height:${FMT.h}px; }
${safeAreaCss()}
.slide { position:relative; width:${FMT.w}px; height:${FMT.h}px; overflow:hidden;
>>>>>>> origin/main
  padding:var(--pad); display:flex; flex-direction:column;
  font-family:'Inter',system-ui,sans-serif;
  --accent:${accent};
  background:${coverLike ? accent : brand.bg};
  color:${coverLike ? '#FFFFFF' : brand.ink}; }
<<<<<<< HEAD
.ribbon { position:absolute; inset:0; width:${W}px; height:${H}px; z-index:0; pointer-events:none; }
=======
.ribbon { position:absolute; inset:0; width:${FMT.w}px; height:${FMT.h}px; z-index:0; pointer-events:none; }
>>>>>>> origin/main
.slide > *:not(.ribbon) { position:relative; z-index:2; }
.g { color:var(--accent); }
.slide.cover .g, .slide.cta .g { color:#fff; text-decoration:underline; text-decoration-thickness:9px; text-underline-offset:8px; }

.topbar { display:flex; align-items:center; gap:16px; }
.kicker { font-weight:900; font-size:32px; letter-spacing:.5px; color:${coverLike ? '#fff' : brand.ink}; }

/* main: llena el alto y ancla el contenido abajo (cover/cta: centrado) */
.main { flex:1; display:flex; flex-direction:column;
  justify-content:${role === 'cover' ? 'center' : 'flex-end'}; min-height:0; }
/* producto: alto FIJO -> escala consistente entre slides, ancho auto, centrado.
   El alto se adapta a si hay headline largo o no (slide chico vs grande). */
.object { display:block; height:${hlen > 30 ? 420 : 480}px; width:auto;
  max-width:620px; margin:0 auto auto; object-fit:contain;
  filter:drop-shadow(0 30px 55px rgba(15,45,82,.28)); }
.spacer { margin-top:auto; }

.savetag { align-self:flex-start; margin-bottom:18px; font-weight:900;
  font-size:28px; letter-spacing:2px; color:${coverLike ? '#fff' : accent}; }
.br-h { font-weight:900; font-size:${hsize}px; line-height:.98; letter-spacing:-3px; }
.br-body { font-weight:500; font-size:40px; line-height:1.4; margin-top:26px; max-width:880px;
  color:${coverLike ? 'rgba(255,255,255,.92)' : brand.muted}; }
.pill { display:inline-flex; align-self:flex-start; margin-top:26px; font-weight:800;
  font-size:26px; padding:13px 28px; border-radius:100px;
  background:${coverLike ? 'rgba(255,255,255,.2)' : accent}; color:#fff; }
.callout { display:inline-flex; align-self:flex-start; margin-top:24px; background:#fff; color:${brand.ink};
  font-weight:600; font-size:32px; border-radius:20px; padding:20px 28px; max-width:800px;
  box-shadow:0 16px 44px rgba(15,45,82,.16); }

.footer { display:flex; align-items:center; gap:16px; margin-top:36px; }
.footer .brandmark { width:62px; height:62px; border-radius:14px;
  background:#fff; padding:6px; box-shadow:0 6px 18px rgba(15,45,82,.14); }
.footer .handle { font-weight:800; font-size:30px; color:${coverLike ? '#fff' : brand.ink}; }
.footer .tag { margin-left:auto; font-weight:700; font-size:22px; letter-spacing:2px; opacity:.55; }
${last ? '' : `.cue{position:absolute;right:46px;bottom:300px;z-index:3;font-size:58px;font-weight:900;color:${coverLike ? '#fff' : accent}}`}
</style></head>
<body><div class="slide ${role}">
  ${nuviaRibbon(idx, total, stripes, coverLike, args && args.formato)}
  <div class="topbar"><span class="kicker">${esc(acc.name)}</span></div>
  <div class="main">
    ${object}
    ${object ? '<div class="spacer"></div>' : ''}
    ${savetag}
    <${headTag} class="br-h">${emph(slide.headline)}</${headTag}>
    ${body}
    ${pill}
    ${callout}
  </div>
  ${last ? '' : '<div class="cue">→</div>'}
  <div class="footer">
    ${logo}<span class="handle">${esc(acc.handle)}</span><span class="tag">${esc(brand.tagline || '')}</span>
  </div>
</div></body></html>`;
}

function render(args) {
  const brief = JSON.parse(fs.readFileSync(args.brief, 'utf8'));
  const slides = brief.slides || [];
  if (!slides.length) throw new Error('brief has no slides');
  if (args.bg) args.bg = path.resolve(args.bg);
  if (args.object) args.object = path.resolve(args.object);
  fs.mkdirSync(args.out, { recursive: true });
  const browser = findBrowser();
  const tmp = fs.mkdtempSync(path.join(require('os').tmpdir(), 'onia-car-'));

  const produced = [];
  slides.forEach((slide, idx) => {
    let html;
    if (args.pack === 'dark-product') html = darkProductHtml(slide, idx, slides.length, args.account, args);
    else if (args.pack === 'dark-neon') html = darkNeonHtml(slide, idx, slides.length, args.account, args);
    else if (args.pack === 'editorial-photo') html = editorialPhotoHtml(slide, idx, slides.length, args.account, args);
    else if (args.pack === 'bright-retail') html = brightRetailHtml(slide, idx, slides.length, args.account, args);
    else html = slideHtml(slide, idx, slides.length, args.account, args.bg, args.formato);
    const htmlPath = path.join(tmp, `slide-${idx + 1}.html`);
    fs.writeFileSync(htmlPath, html, 'utf8');
    const png = path.resolve(args.out, `slide-${String(idx + 1).padStart(2, '0')}.png`);
    const fmt = fmtOf(args);
    execFileSync(browser, [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      '--allow-file-access-from-files',
      '--force-device-scale-factor=1',
<<<<<<< HEAD
      `--window-size=${fmt.w},${fmt.h}`,
=======
      `--window-size=${FMT.w},${FMT.h}`,
>>>>>>> origin/main
      '--virtual-time-budget=4000',
      `--screenshot=${png}`,
      `file://${htmlPath.replace(/\\/g, '/')}`,
    ], { stdio: 'ignore', timeout: 60000 });
    if (!fs.existsSync(png)) throw new Error('render failed for slide ' + (idx + 1));
    produced.push(png);
  });

  fs.rmSync(tmp, { recursive: true, force: true });
  return produced;
}

function main(argv) {
  const args = parseArgs(argv);
  // give fonts a moment by rendering; Edge waits for load. Output manifest.
  const pngs = render(args);
  console.log(JSON.stringify({ ok: true, account: args.account, slides: pngs }, null, 2));
  return 0;
}

if (require.main === module) {
  try {
    process.exit(main(process.argv.slice(2)));
  } catch (e) {
    console.error(JSON.stringify({ ok: false, error: e.message }));
    process.exit(2);
  }
}

<<<<<<< HEAD
module.exports = { slideHtml, darkProductHtml, darkNeonHtml, editorialPhotoHtml, brightRetailHtml, emph, roleFor, ACCOUNTS, BRANDS, PACKS, FORMATS };
=======
module.exports = {
  slideHtml, darkProductHtml, darkNeonHtml, editorialPhotoHtml, brightRetailHtml,
  emph, roleFor, ACCOUNTS, BRANDS, PACKS, FORMATS,
  setFormat: (name) => { if (!FORMATS[name]) throw new Error('Unknown format: ' + name); FMT = FORMATS[name]; },
};
>>>>>>> origin/main
