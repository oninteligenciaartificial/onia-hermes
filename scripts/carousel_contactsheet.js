#!/usr/bin/env node
/**
 * Contact sheet: renders all slides of a carousel into one grid, so a whole
 * carousel can be reviewed at a glance (and shared in chat) instead of opening
 * eight separate files.
 *
 * Es un instrumento de VERIFICACION: la hoja se mira para decidir si una pieza se
 * publica. Por eso no puede quedarse callada ni afirmar de mas.
 *
 * 03-sep: no armaba una sola hoja de las 10 carpetas publicables de Lucia. Solo
 * miraba `slide-*.png` y las 10 son JPG, asi que cortaba con "No slides"; y sus
 * rutas de navegador eran de Windows mas dos que en el VPS no existen. Las hojas
 * de L09/L6/L08 (1530x1068, que es exactamente su formula) salieron de aca cuando
 * los renders todavia eran PNG; desde el cambio a JPG cada vuelta se re-inventaba
 * la hoja a mano — de ahi que la de L10 sea 1550x968.
 *
 * Y el tercero era el peor, porque mentia en vez de fallar: el titulo estampaba
 * "1080x1350" fijo SIN medir nada, y `object-fit:cover` recortaba cualquier lamina
 * de otro tamano hasta que entrara. Una pieza mal renderizada daba una hoja que
 * afirmaba las medidas correctas. Mismo defecto de sentido que carousel_render.js
 * ("aparecio un archivo") y verificar_recompensas.js ("respondio 200"): contestar
 * con seguridad la pregunta equivocada. Ahora mide cada lamina y la que se sale
 * del tamano dominante se ve — marco rojo, medida al pie y aviso en el titulo.
 *
 * Usage:
 *   node carousel_contactsheet.js --dir <out/folder> [--title "..."] [--cols 4]
 *        [--out sheet.png]
 *   node carousel_contactsheet.js --self-check
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

// Los renders publicables son JPG desde el lote del 28-ago; los packs viejos, PNG.
const SLIDE_RE = /^slide-\d+\.(png|jpe?g)$/i;

const BROWSER_CANDIDATES = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
];

// En el VPS no hay Chrome del sistema: el unico navegador es el que bajo Playwright.
// Se toma el de version mas alta para no clavar un numero que caduca en la proxima
// actualizacion.
function playwrightChromiums(root) {
  const base = root || path.join(process.env.HOME || '/root', '.cache', 'ms-playwright');
  let dirs;
  try { dirs = fs.readdirSync(base); } catch { return []; }
  return dirs
    .filter((d) => /^chromium-\d+$/.test(d))
    .sort((a, b) => Number(b.split('-')[1]) - Number(a.split('-')[1]))
    .map((d) => path.join(base, d, 'chrome-linux64', 'chrome'));
}

function findBrowser() {
  for (const c of [...BROWSER_CANDIDATES, ...playwrightChromiums()]) {
    if (fs.existsSync(c)) return c;
  }
  throw new Error('No Edge/Chrome found');
}

/**
 * Ancho y alto reales leidos del encabezado del archivo. Sin ffprobe ni modulos:
 * el self-check tiene que correr offline y en cualquier maquina.
 */
function dimensiones(file) {
  const fd = fs.openSync(file, 'r');
  try {
    const head = Buffer.alloc(Math.min(fs.fstatSync(fd).size, 64 * 1024));
    fs.readSync(fd, head, 0, head.length, 0);

    // PNG: firma de 8 bytes y despues el chunk IHDR, ancho y alto big-endian.
    if (head.length >= 24 && head.toString('hex', 0, 8) === '89504e470d0a1a0a') {
      return { w: head.readUInt32BE(16), h: head.readUInt32BE(20) };
    }
    // JPEG: recorrer marcadores hasta un SOF (todos menos DHT/JPG/DAC y los RSTn).
    if (head.length >= 4 && head[0] === 0xff && head[1] === 0xd8) {
      let i = 2;
      while (i + 9 < head.length) {
        if (head[i] !== 0xff) { i += 1; continue; }
        const marker = head[i + 1];
        if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
          i += 2; continue;
        }
        const len = head.readUInt16BE(i + 2);
        const esSOF = marker >= 0xc0 && marker <= 0xcf
          && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
        if (esSOF) return { w: head.readUInt16BE(i + 7), h: head.readUInt16BE(i + 5) };
        i += 2 + len;
      }
    }
  } finally {
    fs.closeSync(fd);
  }
  return null;   // formato que no sabemos medir: se dice, no se inventa
}

/** El tamano que comparten la mayoria de las laminas. Las que se salen, se marcan. */
function tamanoDominante(medidas) {
  const cuenta = new Map();
  for (const m of medidas) {
    if (!m) continue;
    const k = `${m.w}x${m.h}`;
    cuenta.set(k, (cuenta.get(k) || 0) + 1);
  }
  if (!cuenta.size) return null;
  return [...cuenta.entries()].sort((a, b) => b[1] - a[1])[0][0];
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
    .filter((f) => SLIDE_RE.test(f)).sort();
  if (!slides.length) throw new Error('No slides in ' + dir);

  const medidas = slides.map((f) => dimensiones(path.join(dir, f)));
  const dominante = tamanoDominante(medidas);
  const raras = slides
    .map((f, i) => ({ f, m: medidas[i] }))
    .filter(({ m }) => !m || `${m.w}x${m.h}` !== dominante);

  const cols = Number(a.cols);
  const cellW = 360;                     // thumb width
  // La celda toma la proporcion MEDIDA, no una fija: si el lote entero salio con
  // otra forma, la hoja se ve con esa forma en vez de recortarla hasta la esperada.
  const [domW, domH] = (dominante || '1080x1350').split('x').map(Number);
  const cellH = Math.round(cellW * domH / domW);
  const gap = 14;
  const pad = 24;
  const rows = Math.ceil(slides.length / cols);
  const width = pad * 2 + cols * cellW + (cols - 1) * gap;
  const height = pad * 2 + 54 + rows * (cellH + 26) + (rows - 1) * gap;

  const cells = slides.map((f, i) => {
    const m = medidas[i];
    const rara = !m || `${m.w}x${m.h}` !== dominante;
    const pie = rara ? `${String(i + 1).padStart(2, '0')} · ${m ? `${m.w}×${m.h}` : 'no medible'}`
      : String(i + 1).padStart(2, '0');
    return `
    <figure${rara ? ' class="rara"' : ''}>
      <img src="file://${path.join(dir, f).replace(/\\/g, '/')}">
      <figcaption>${pie}</figcaption>
    </figure>`;
  }).join('');

  const rotulo = dominante
    ? `${slides.length} slides · ${dominante.replace('x', '×')}`
    : `${slides.length} slides · tamaño no medible`;
  const aviso = raras.length
    ? `<em>⚠ ${raras.length} fuera de ${dominante}</em>` : '';

  const html = `<!doctype html><meta charset="utf-8"><style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:${width}px;height:${height}px;background:#0A0F0D;padding:${pad}px;
    font-family:'Segoe UI',system-ui,sans-serif;color:#fff}
  h1{font-size:26px;font-weight:800;margin-bottom:18px;letter-spacing:-.5px}
  h1 span{color:#34E04A;font-weight:600;font-size:19px;margin-left:10px}
  h1 em{color:#FF5A47;font-style:normal;font-weight:700;font-size:19px;margin-left:10px}
  .grid{display:grid;grid-template-columns:repeat(${cols},${cellW}px);gap:${gap}px}
  figure{width:${cellW}px}
  /* contain, no cover: una lamina de otro tamano tiene que VERSE distinta, no
     recortarse hasta parecer correcta. */
  img{width:${cellW}px;height:${cellH}px;object-fit:contain;border-radius:8px;display:block;
    background:#000;border:1px solid rgba(255,255,255,.12)}
  figcaption{font-size:13px;color:#7d8a85;margin-top:6px;letter-spacing:1px}
  .rara img{border:3px solid #FF5A47}
  .rara figcaption{color:#FF5A47;font-weight:700}
  </style><body>
  <h1>${a.title || path.basename(dir)}<span>${rotulo}</span>${aviso}</h1>
  <div class="grid">${cells}</div>
  </body>`;

  const tmp = fs.mkdtempSync(path.join(require('os').tmpdir(), 'onia-sheet-'));
  const htmlPath = path.join(tmp, 'sheet.html');
  fs.writeFileSync(htmlPath, html, 'utf8');
  const out = path.resolve(a.out || path.join(dir, '_contactsheet.png'));

  // El loop del VPS corre como root, y ahi Chrome se niega a arrancar sin esto:
  // "Running as root without --no-sandbox is not supported". Se agrega solo para
  // root: donde el sandbox funciona, se deja puesto.
  const esRoot = typeof process.getuid === 'function' && process.getuid() === 0;

  try {
    execFileSync(findBrowser(), [
      '--headless=new', '--disable-gpu', '--hide-scrollbars',
      ...(esRoot ? ['--no-sandbox'] : []),
      '--allow-file-access-from-files', '--force-device-scale-factor=1',
      `--window-size=${width},${height}`, '--virtual-time-budget=6000',
      `--screenshot=${out}`, `file://${htmlPath.replace(/\\/g, '/')}`,
    ], { stdio: ['ignore', 'ignore', 'pipe'], timeout: 90000 });
  } catch (e) {
    // Antes era stdio:'ignore' y el motivo se perdia: el error decia "Command
    // failed" con la linea entera y nada mas. Sin log no hay diagnostico.
    const detalle = (e.stderr || '').toString().trim().split('\n').slice(-3).join(' | ');
    throw new Error(`El navegador no pudo dibujar la hoja: ${detalle || e.message}`);
  }

  fs.rmSync(tmp, { recursive: true, force: true });
  if (!fs.existsSync(out) || fs.statSync(out).size < 10 * 1024) {
    // El navegador tambien escribe captura cuando no pudo abrir el HTML: sale con
    // codigo 0 y deja una imagen de su propia pagina de error. Es como
    // onia-costo-invisible paso 13 dias pareciendo un carrusel.
    throw new Error('La hoja salio vacia o no se escribio: ' + out);
  }
  console.log(JSON.stringify({
    ok: true, out, slides: slides.length, width, height,
    tamano: dominante, fuera_de_tamano: raras.map((r) => r.f),
  }, null, 2));
  return 0;
}

function selfCheck() {
  const assert = require('assert');
  const os = require('os');
  let casos = 0;
  const ok = (c, m) => { casos += 1; assert.ok(c, m); };

  // --- que cuenta como lamina ---
  ok(SLIDE_RE.test('slide-01.png'), 'png es lamina');
  ok(SLIDE_RE.test('slide-01.jpg'), 'jpg es lamina — las 10 carpetas vivas de Lucia son JPG');
  ok(SLIDE_RE.test('slide-07.jpeg'), 'jpeg es lamina');
  ok(SLIDE_RE.test('SLIDE-02.JPG'), 'el caso no importa');
  ok(!SLIDE_RE.test('_HOJA-DE-CONTACTO.jpg'), 'la hoja anterior no se cuenta a si misma');
  ok(!SLIDE_RE.test('slide-01.jpg.bak'), 'un backup no es lamina');
  ok(!SLIDE_RE.test('portada.jpg'), 'una portada suelta no es lamina');

  // --- medir de verdad: se arman archivos reales y se comparan contra ffprobe ---
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'onia-sheet-check-'));
  try {
    // PNG 1080x1350 minimo: firma + IHDR con las medidas en big-endian.
    const png = Buffer.concat([
      Buffer.from('89504e470d0a1a0a', 'hex'),
      Buffer.from('0000000d49484452', 'hex'),
      (() => { const b = Buffer.alloc(8); b.writeUInt32BE(1080, 0); b.writeUInt32BE(1350, 4); return b; })(),
      Buffer.from('0806000000', 'hex'),
    ]);
    const pPng = path.join(tmp, 'slide-01.png');
    fs.writeFileSync(pPng, png);
    const dPng = dimensiones(pPng);
    ok(dPng && dPng.w === 1080 && dPng.h === 1350, 'PNG: lee 1080x1350 del IHDR');

    // JPEG: SOF0 lleva alto y ancho en ese orden — invertirlos es el error clasico.
    const jpg = Buffer.concat([
      Buffer.from('ffd8', 'hex'),
      Buffer.from('ffe000104a46494600010100000100010000', 'hex'),   // APP0, se saltea
      Buffer.from('ffc0001108', 'hex'),
      (() => { const b = Buffer.alloc(4); b.writeUInt16BE(1350, 0); b.writeUInt16BE(1080, 2); return b; })(),
      Buffer.from('03012200021101031101', 'hex'),
    ]);
    const pJpg = path.join(tmp, 'slide-02.jpg');
    fs.writeFileSync(pJpg, jpg);
    const dJpg = dimensiones(pJpg);
    ok(dJpg && dJpg.w === 1080 && dJpg.h === 1350,
      `JPEG: lee 1080x1350 saltando APP0 (dio ${dJpg && `${dJpg.w}x${dJpg.h}`})`);

    const vacio = path.join(tmp, 'slide-03.jpg');
    fs.writeFileSync(vacio, Buffer.from('no soy una imagen'));
    ok(dimensiones(vacio) === null, 'lo que no se puede medir devuelve null, no un numero inventado');

    // --- control negativo: el instrumento tiene que DISCRIMINAR ---
    ok(tamanoDominante([{ w: 1080, h: 1350 }, { w: 1080, h: 1350 }]) === '1080x1350',
      'lote parejo: el dominante es el unico tamano');
    const mezcla = [{ w: 1080, h: 1350 }, { w: 1080, h: 1350 }, { w: 640, h: 640 }];
    ok(tamanoDominante(mezcla) === '1080x1350', 'lote mezclado: manda la mayoria');
    ok(mezcla.filter((m) => `${m.w}x${m.h}` !== tamanoDominante(mezcla)).length === 1,
      'y la lamina que se sale queda marcada, no recortada');
    ok(tamanoDominante([null, null]) === null, 'sin nada medible no se afirma un tamano');
    ok(tamanoDominante([null, { w: 1080, h: 1350 }]) === '1080x1350',
      'una no medible no borra la medicion de las otras');
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }

  // --- navegador: el VPS no tiene Chrome del sistema ---
  const fake = fs.mkdtempSync(path.join(os.tmpdir(), 'onia-pw-'));
  try {
    for (const v of ['chromium-1223', 'chromium-1234', 'chromium_headless_shell-1234']) {
      fs.mkdirSync(path.join(fake, v, 'chrome-linux64'), { recursive: true });
    }
    const encontrados = playwrightChromiums(fake);
    ok(encontrados.length === 2, `solo las carpetas chromium-N (dio ${encontrados.length})`);
    ok(encontrados[0].includes('chromium-1234'), 'gana la version mas alta, no la alfabetica');
    ok(playwrightChromiums(path.join(fake, 'no-existe')).length === 0,
      'sin cache de Playwright devuelve vacio en vez de reventar');
  } finally {
    fs.rmSync(fake, { recursive: true, force: true });
  }

  console.log(`self-check ok: ${casos} casos`);
  return 0;
}

if (require.main === module) {
  try {
    process.exit(process.argv.includes('--self-check')
      ? selfCheck() : main(process.argv.slice(2)));
  } catch (e) { console.error(JSON.stringify({ ok: false, error: e.message })); process.exit(2); }
}
