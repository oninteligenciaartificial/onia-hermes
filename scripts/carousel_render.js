#!/usr/bin/env node
/**
 * ONIA carousel render engine.
 *
 * brief JSON (from carousel_generator.py) -> branded 1080x1350 PNG slides.
 * Zero external deps: builds one HTML per slide and screenshots it with
 * Edge/Chrome headless (same approach as the propuestas generador).
 *
 * Encodes the 5 ONIA carousel rules via slide roles:
 *   cover  -> frena el scroll, hook gigante, contraste brutal (regla 1)
 *   stakes -> confirma el hook / sube lo que está en juego (regla 2)
 *   point  -> una idea por slide, screenshot suelto (regla 3)
 *   save   -> slide guardable: framework / prompt / frase (regla 4)
 *   cta    -> CTA motor + comment trigger (regla 5)
 *
 * Usage:
 *   node carousel_render.js --brief brief.json --out ./out [--account onia|arthur|sergio] [--bg path.jpg]
 *
 * Node >= 18, CommonJS.
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const BRAND = path.join(__dirname, '..', 'hermes-content', 'brand');

const BROWSER_CANDIDATES = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
];

const ACCOUNTS = {
  onia: { handle: '@oniaagency', name: 'ONIA', personal: false },
  arthur: { handle: '@arthur', name: 'Arthur', personal: true },
  sergio: { handle: '@sergio', name: 'Sergio', personal: true },
  nuvia: { handle: '@nuvia.bo', name: 'Nuvia', personal: false },
};

// Brand kits para packs no-ONIA. Cada marca define superficie, tinta, acentos
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

function parseArgs(argv) {
  const a = { out: './out', account: 'onia', bg: '', pack: 'typographic', object: '' };
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i];
    if (k === '--brief') a.brief = argv[++i];
    else if (k === '--out') a.out = argv[++i];
    else if (k === '--account') a.account = argv[++i];
    else if (k === '--bg') a.bg = argv[++i];
    else if (k === '--pack') a.pack = argv[++i];
    else if (k === '--object') a.object = argv[++i];
  }
  if (!a.brief) throw new Error('Missing --brief <file.json>');
  if (!ACCOUNTS[a.account]) throw new Error('Unknown account: ' + a.account);
  if (!PACKS.includes(a.pack)) throw new Error('Unknown --pack: ' + a.pack + ' (use ' + PACKS.join('|') + ')');
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

function slideHtml(slide, idx, total, account, bg) {
  const role = roleFor(slide, idx, total);
  const last = idx === total - 1;
  const acc = ACCOUNTS[account];
  const bgLayer = bg
    ? `<div class="bgphoto" style="background-image:url('file://${bg.replace(/\\/g, '/')}')"></div><div class="bgscrim"></div>`
    : '';

  let inner = '';
  if (role === 'cover') {
    inner = `
      ${bgLayer}
      <div class="kicker">${esc(acc.name)}</div>
      <h1 class="hook">${emph(slide.headline)}</h1>
      ${slide.body ? `<p class="coverline">${emph(slide.body)}</p>` : ''}
      ${swipeCue(false)}
      ${logoFooter(account)}`;
  } else if (role === 'cta') {
    inner = `
      ${bgLayer}
      <div class="pageno">${pageNo(idx, total)}</div>
      <h2 class="cta-h">${emph(slide.headline)}</h2>
      <p class="body">${emph(slide.body)}</p>
      ${logoFooter(account)}`;
  } else if (role === 'save') {
    inner = `
      <div class="pageno">${pageNo(idx, total)}</div>
      ${saveBar}
      <div class="savecard">
        <div class="savetag">FRAMEWORK</div>
        <h2 class="point-h">${emph(slide.headline)}</h2>
        <p class="body">${emph(slide.body)}</p>
      </div>
      ${swipeCue(last)}
      ${logoFooter(account)}`;
  } else { // stakes | point
    inner = `
      <div class="pageno">${pageNo(idx, total)}</div>
      <h2 class="point-h">${emph(slide.headline)}</h2>
      <p class="body">${emph(slide.body)}</p>
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
html,body { width:1080px; height:1350px; }
.slide {
  position:relative; width:1080px; height:1350px; overflow:hidden;
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
function continuationCurve(idx, total) {
  const last = idx === total - 1;
  const first = idx === 0;
  const down = idx % 2 === 0;
  // Curve stays in the UPPER band (y 300-640), the floating-object zone, and
  // never dips into the headline/body area at the bottom — so it reads as a
  // continuous panorama behind the 3D object without crossing the text.
  // enter from left (unless first), exit right (unless last)
  const enter = first ? '' : (down
    ? 'M -60 300 C 220 300 260 560 540 560'
    : 'M -60 600 C 220 600 260 340 540 340');
  const exit = last ? '' : (down
    ? 'M 540 560 C 860 560 940 320 1140 320'
    : 'M 540 340 C 860 340 940 600 1140 600');
  const paths = [enter, exit].filter(Boolean)
    .map((d) => `<path d="${d}" />`).join('');
  return `<svg class="curve" viewBox="0 0 1080 1350" xmlns="http://www.w3.org/2000/svg">${paths}</svg>`;
}

// Pack: dark-product (Solaris-style). Black canvas, pills, continuation curve,
// condensed title with *green* keyword, optional 3D object, callout body.
function darkProductHtml(slide, idx, total, account, args) {
  const role = roleFor(slide, idx, total);
  const last = idx === total - 1;
  const acc = ACCOUNTS[account];
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
html,body { width:1080px; height:1350px; }
.slide { position:relative; width:1080px; height:1350px; overflow:hidden;
  padding:var(--pad); display:flex; flex-direction:column;
  background:var(--onia-ink); color:var(--onia-white);
  font-family:'Inter',var(--font-body); }
.slide.cta { background:var(--onia-green); color:var(--onia-ink); }
.g { color:var(--onia-green); }
.slide.cta .g { color:var(--onia-ink); -webkit-text-stroke:0; background:var(--onia-ink); color:var(--onia-green); padding:0 .12em; }

.curve { position:absolute; inset:0; width:1080px; height:1350px; z-index:0; pointer-events:none; }
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
  ${continuationCurve(idx, total)}
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
html,body { width:1080px; height:1350px; }
.slide { position:relative; width:1080px; height:1350px; overflow:hidden;
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
  const tokens = fs.readFileSync(path.join(BRAND, 'tokens.css'), 'utf8');
  const bg = args && args.bg ? String(args.bg).replace(/\\/g, '/') : '';
  const photo = bg
    ? `<div class="photo" style="background-image:url('file://${bg}')"></div>`
    : '';

  const headTag = role === 'cover' ? 'h1' : 'h2';
  const pill = slide.pill ? `<span class="cap">${esc(slide.pill)}</span>` : '';
  const body = slide.body ? `<p class="ed-body">${emph(slide.body)}</p>` : '';

  return `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@800;900&family=Fraunces:ital,wght@1,500;1,600&family=Inter:wght@500;600&display=swap" rel="stylesheet">
<style>
${tokens}
* { margin:0; padding:0; box-sizing:border-box; }
html,body { width:1080px; height:1350px; }
.slide { position:relative; width:1080px; height:1350px; overflow:hidden;
  padding:var(--pad); display:flex; flex-direction:column; justify-content:flex-end;
  background:var(--onia-ink); color:var(--onia-white); font-family:'Inter',var(--font-body); }
.photo { position:absolute; inset:0; background-size:cover; background-position:center; z-index:0; }
.scrim { position:absolute; inset:0; z-index:1;
  background:linear-gradient(180deg, rgba(10,15,13,.15) 0%, rgba(10,15,13,.55) 55%, rgba(10,15,13,.92) 100%); }
.grain { position:absolute; inset:0; z-index:2; opacity:.10; mix-blend-mode:overlay; }
.slide > *:not(.photo):not(.scrim):not(.grain) { position:relative; z-index:3; }

.topbar { position:absolute; top:var(--pad); left:var(--pad); right:var(--pad);
  display:flex; align-items:center; z-index:3; }
.kicker { font-family:'Archivo'; font-weight:800; font-size:28px; letter-spacing:5px;
  text-transform:uppercase; color:var(--onia-white); }
.pageno { margin-left:auto; font-family:'Archivo'; font-weight:800; font-size:26px;
  letter-spacing:2px; color:var(--onia-green); }

.ed-h { font-family:'Archivo'; font-weight:900; font-size:108px; line-height:.95;
  letter-spacing:-2px; text-transform:uppercase; }
.ed-h .g { font-family:'Fraunces'; font-style:italic; font-weight:600; text-transform:none;
  color:var(--onia-green); letter-spacing:0; }
.ed-body { font-family:'Inter'; font-weight:500; font-size:38px; line-height:1.4;
  margin-top:28px; max-width:880px; color:rgba(255,255,255,.85); }
.ed-body .g { color:var(--onia-green); font-family:'Fraunces'; font-style:italic; }
.cap { display:inline-flex; align-self:flex-start; margin-top:30px; background:var(--onia-green);
  color:var(--onia-ink); font-family:'Archivo'; font-weight:800; font-size:26px;
  letter-spacing:1px; text-transform:uppercase; padding:12px 24px; border-radius:8px; }

.footer { display:flex; align-items:center; gap:16px; margin-top:40px; }
.footer .mark { width:56px; height:56px; }
.footer .handle { font-family:'Archivo'; font-weight:800; font-size:28px; opacity:.85; }
${last ? '' : '.cue{position:absolute;right:44px;bottom:300px;z-index:3;font-size:56px;font-weight:800;color:var(--onia-green)}'}
</style></head>
<body><div class="slide ${role}">
  ${photo}<div class="scrim"></div>
  <svg class="grain" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2"/></filter><rect width="300" height="300" filter="url(#n)"/></svg>
  <div class="topbar"><span class="kicker">${esc(acc.name)}</span><span class="pageno">${pageNo(idx, total)}</span></div>
  <${headTag} class="ed-h">${emph(slide.headline)}</${headTag}>
  ${body}
  ${pill}
  ${last ? '' : '<div class="cue">→</div>'}
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

// Pack: bright-retail (Nuvia-style). Marca clara/multicolor, amigable. Fondo
// crema/blanco, titular tinta navy con keyword en color de acento rotativo,
// pills suaves, slot de producto, footer con logo de la marca.
function brightRetailHtml(slide, idx, total, account, args) {
  const role = roleFor(slide, idx, total);
  const last = idx === total - 1;
  const acc = ACCOUNTS[account] || ACCOUNTS.onia;
  const brand = BRANDS[account] || BRANDS.nuvia;
  const accent = brand.accents[idx % brand.accents.length];
  const tokens = fs.readFileSync(path.join(BRAND, 'tokens.css'), 'utf8');

  // cover y cta: superficie de acento suave; resto: crema/blanco
  const coverLike = role === 'cover' || role === 'cta';
  const object = args && args.object
    ? `<img class="object" src="file://${String(args.object).replace(/\\/g, '/')}" alt="">`
    : '';
  const logo = brand.logo && fs.existsSync(brand.logo)
    ? `<img class="brandmark" src="file://${brand.logo.replace(/\\/g, '/')}" alt="">`
    : '';

  const pill = slide.pill ? `<span class="pill">${esc(slide.pill)}</span>` : '';
  const callout = slide.callout ? `<div class="callout">${emph(slide.callout)}</div>` : '';
  const headTag = role === 'cover' ? 'h1' : 'h2';
  const body = slide.body ? `<p class="br-body">${emph(slide.body)}</p>` : '';
  const savetag = role === 'save'
    ? `<div class="savetag">GUARDÁ ESTO ↗</div>` : '';

  return `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;800;900&display=swap" rel="stylesheet">
<style>
${tokens}
* { margin:0; padding:0; box-sizing:border-box; }
html,body { width:1080px; height:1350px; }
.slide { position:relative; width:1080px; height:1350px; overflow:hidden;
  padding:var(--pad); display:flex; flex-direction:column;
  font-family:'Inter',system-ui,sans-serif;
  --bg:${brand.bg}; --ink:${brand.ink}; --muted:${brand.muted}; --accent:${accent};
  background:${coverLike ? accent : brand.bg};
  color:${coverLike ? '#FFFFFF' : brand.ink};
  justify-content:${role === 'cover' ? 'center' : 'flex-start'}; }
.g { color:var(--accent); }
.slide.cover .g, .slide.cta .g { color:#FFFFFF; text-decoration:underline; text-decoration-thickness:8px; text-underline-offset:6px; }

.topbar { display:flex; align-items:center; gap:16px; }
.kicker { font-weight:900; font-size:30px; letter-spacing:1px; }
.slide.cover .kicker, .slide.cta .kicker { color:#fff; }
.pageno { margin-left:auto; font-weight:800; font-size:26px; opacity:.6; }

.pill { display:inline-flex; align-self:flex-start; margin-top:24px; font-weight:800;
  font-size:26px; padding:12px 26px; border-radius:100px;
  background:${coverLike ? 'rgba(255,255,255,.18)' : accent}; color:#fff; }

.br-h { font-weight:900; font-size:104px; line-height:1.0; letter-spacing:-3px;
  margin-top:${role === 'cover' ? '20px' : 'auto'}; }
.br-h.small { font-size:84px; }
.br-body { font-weight:500; font-size:40px; line-height:1.4; margin-top:28px; max-width:860px;
  color:${coverLike ? 'rgba(255,255,255,.92)' : brand.muted}; }
.callout { align-self:flex-start; margin-top:28px; background:#fff; color:${brand.ink};
  font-weight:600; font-size:32px; border-radius:20px; padding:20px 28px; max-width:780px;
  box-shadow:0 14px 40px rgba(15,45,82,.12); }
.savetag { align-self:flex-start; margin-top:auto; margin-bottom:20px; font-weight:900;
  font-size:28px; letter-spacing:2px; color:${coverLike ? '#fff' : accent}; }

.object { display:block; max-width:680px; max-height:520px; margin:30px auto;
  object-fit:contain; filter:drop-shadow(0 24px 50px rgba(15,45,82,.22)); border-radius:24px; }

.footer { display:flex; align-items:center; gap:16px; margin-top:auto; padding-top:40px; }
.footer .brandmark { width:64px; height:64px; border-radius:14px;
  background:#fff; padding:6px; box-shadow:0 6px 18px rgba(15,45,82,.12); }
.footer .handle { font-weight:800; font-size:30px;
  color:${coverLike ? '#fff' : brand.ink}; }
.footer .tag { margin-left:auto; font-weight:600; font-size:22px; letter-spacing:2px;
  opacity:.6; }
${last ? '' : `.cue{position:absolute;right:46px;bottom:300px;font-size:60px;font-weight:900;color:${coverLike ? '#fff' : accent}}`}
</style></head>
<body><div class="slide ${role}">
  <div class="topbar"><span class="kicker">${esc(acc.name)}</span><span class="pageno">${pageNo(idx, total)}</span></div>
  ${savetag}
  ${object}
  <${headTag} class="br-h${(slide.headline || '').length > 26 ? ' small' : ''}">${emph(slide.headline)}</${headTag}>
  ${body}
  ${pill}
  ${callout}
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
    else html = slideHtml(slide, idx, slides.length, args.account, args.bg);
    const htmlPath = path.join(tmp, `slide-${idx + 1}.html`);
    fs.writeFileSync(htmlPath, html, 'utf8');
    const png = path.resolve(args.out, `slide-${String(idx + 1).padStart(2, '0')}.png`);
    execFileSync(browser, [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      '--allow-file-access-from-files',
      '--force-device-scale-factor=1',
      '--window-size=1080,1350',
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

module.exports = { slideHtml, darkProductHtml, darkNeonHtml, editorialPhotoHtml, brightRetailHtml, emph, roleFor, ACCOUNTS, BRANDS, PACKS };
