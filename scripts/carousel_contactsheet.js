#!/usr/bin/env node
/**
 * Contact sheet: renders all slides of a carousel into one PNG grid, so a whole
 * carousel can be reviewed at a glance (and shared in chat) instead of opening
 * eight separate files.
 *
 * Usage:
 *   node carousel_contactsheet.js --dir <out/folder> [--title "..."] [--cols 4]
 *        [--out sheet.png]
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const BROWSER_CANDIDATES = [
  // En la nube, `eval "$(sh scripts/carousel_cloud_setup.sh)"` deja el headless_shell acá;
  // sin esta línea la hoja fallaba con «No Edge/Chrome found» (1-oct-2026). Igual que el renderer.
  process.env.CAROUSEL_BROWSER || '',
  // Chrome va primero: Edge headless puede devolver una captura de
  // ERR_FILE_NOT_FOUND aunque el HTML temporal exista (mismo criterio que el
  // renderer principal).
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
];

function findBrowser() {
  for (const c of BROWSER_CANDIDATES) if (c && fs.existsSync(c)) return c;
  throw new Error('No Edge/Chrome found');
}

function parseArgs(argv) {
  const a = { cols: '4' };
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i];
    if (k === '--dir') a.dir = argv[++i];
    else if (k === '--title') a.title = argv[++i];
    else if (k === '--cols') a.cols = argv[++i];
    else if (k === '--out') a.out = argv[++i];
  }
  if (!a.dir) throw new Error('Missing --dir');
  return a;
}

function main(argv) {
  const a = parseArgs(argv);
  const dir = path.resolve(a.dir);
  const slides = fs.readdirSync(dir)
    // `lamina-NN.png` ademas de `slide-NN.png`: los generadores de scripts/marca-personal/
    // nombran en espanol, y por eso ese carril se venia escribiendo sus propias hojas de
    // contacto a mano en vez de usar esta.
    .filter((f) => /^(slide|lamina)-\d+\.png$/i.test(f)).sort();
  if (!slides.length) throw new Error('No slides in ' + dir);

  const cols = Number(a.cols);
  const cellW = 360;                     // thumb width
  const cellH = Math.round(cellW * 1350 / 1080);
  const gap = 14;
  const pad = 24;
  const rows = Math.ceil(slides.length / cols);
  const width = pad * 2 + cols * cellW + (cols - 1) * gap;
  const height = pad * 2 + 54 + rows * (cellH + 26) + (rows - 1) * gap;

  const cells = slides.map((f, i) => `
    <figure>
      <img src="file://${path.join(dir, f).replace(/\\/g, '/')}">
      <figcaption>${String(i + 1).padStart(2, '0')}</figcaption>
    </figure>`).join('');

  const html = `<!doctype html><meta charset="utf-8"><style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:${width}px;height:${height}px;background:#0A0F0D;padding:${pad}px;
    font-family:'Segoe UI',system-ui,sans-serif;color:#fff}
  h1{font-size:26px;font-weight:800;margin-bottom:18px;letter-spacing:-.5px}
  h1 span{color:#34E04A;font-weight:600;font-size:19px;margin-left:10px}
  .grid{display:grid;grid-template-columns:repeat(${cols},${cellW}px);gap:${gap}px}
  figure{width:${cellW}px}
  img{width:${cellW}px;height:${cellH}px;object-fit:cover;border-radius:8px;display:block;
    border:1px solid rgba(255,255,255,.12)}
  figcaption{font-size:13px;color:#7d8a85;margin-top:6px;letter-spacing:1px}
  </style><body>
  <h1>${a.title || path.basename(dir)}<span>${slides.length} slides · 1080×1350</span></h1>
  <div class="grid">${cells}</div>
  </body>`;

  const tmp = fs.mkdtempSync(path.join(require('os').tmpdir(), 'onia-sheet-'));
  const htmlPath = path.join(tmp, 'sheet.html');
  fs.writeFileSync(htmlPath, html, 'utf8');
  const out = path.resolve(a.out || path.join(dir, '_contactsheet.png'));

  execFileSync(findBrowser(), [
    '--headless=new', '--disable-gpu', '--hide-scrollbars',
    // Como root (VPS, nube) Chromium no arranca sin esto: mismo criterio que carousel_render.js.
    '--no-sandbox',
    '--allow-file-access-from-files', '--force-device-scale-factor=1',
    `--window-size=${width},${height}`, '--virtual-time-budget=6000',
    `--screenshot=${out}`, `file://${htmlPath.replace(/\\/g, '/')}`,
  ], { stdio: 'ignore', timeout: 90000 });

  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(JSON.stringify({ ok: true, out, slides: slides.length, width, height }, null, 2));
  return 0;
}

if (require.main === module) {
  try { process.exit(main(process.argv.slice(2))); }
  catch (e) { console.error(JSON.stringify({ ok: false, error: e.message })); process.exit(2); }
}
