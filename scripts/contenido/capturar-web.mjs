#!/usr/bin/env node
/**
 * capturar-web.mjs — graba páginas web REALES para los guiones de contenido.
 *
 * Por qué existe (2026-09-25). Sergio Urcullo: "si necesitamos grabar la pantalla sobre ese
 * algo, vos lo tenés que hacer, pero tiene que ser real". Los grabadores que dejó Codex
 * (capture_opus_5_5_playwright.cjs, screencast-session.cjs) sólo corren en su PC con Windows
 * (rutas E:/ y C:/ fijas) y graban en tiempo real a 30 fps con un cursor-punto de 24 px; la
 * casa pide cursor grande y 60 fps para interfaces (editor-videos, Manual de formatos).
 *
 * Éste corre en cualquier máquina (nube o PC) y graba CUADRO A CUADRO: el video sale fluido
 * aunque la máquina sea lenta, y es reproducible. Cada toma deja un manifiesto con la URL, la
 * fecha, el título, el estado HTTP y los textos que el guion afirma, verificados en la página:
 * si la página no dice lo que el guion dice, la toma FALLA. Ésa es la prueba de "real".
 *
 * Qué NO hace: no inicia sesión, no guarda cookies, no envía formularios (bloquea todo pedido
 * que no sea GET/HEAD y lo anota), no dibuja interfaces. El recuadro verde, el foco y el cursor
 * son edición ENCIMA de la página real, y el manifiesto lo dice.
 *
 * Uso:
 *   node scripts/contenido/capturar-web.mjs <plan.json> [--out DIR] [--solo S1,S3]
 *                                            [--sin-video] [--fps N] [--dpr N]
 *
 * Plan (JSON). Cada paso dura `s` segundos; los textos se buscan en la página real:
 * {
 *   "tema": "opus-5-5",
 *   "viewport": { "width": 1440, "height": 900 }, "dpr": 2, "fps": 60,
 *   "ocultar": ["#banner-de-cookies"],              // CSS extra a ocultar (banners)
 *   "tomas": [{
 *     "id": "S1-precio", "url": "https://…",
 *     "debe_decir": ["Claude Opus 5.5", "$4"],     // si falta uno, la toma falla
 *     "pasos": [
 *       { "hacer": "esperar", "s": 1 },
 *       { "hacer": "scroll",  "texto": "Cost and speed", "s": 1.4, "margen": 140 },
 *       { "hacer": "cursor",  "texto": "$4", "s": 0.8 },
 *       { "hacer": "click" },                        // pulso visual, NO hace click real
 *       { "hacer": "marcar",  "texto": "$4 per million", "s": 1.5 },
 *       { "hacer": "foco",    "texto": "…", "s": 1.5 },   // oscurece el resto
 *       { "hacer": "foto",    "nombre": "precio" },       // PNG en este instante
 *       { "hacer": "quitar",  "s": 0.3 },
 *       { "hacer": "cursor_fuera", "s": 0.6 }
 *     ]
 *   }]
 * }
 * Opcionales por paso con texto: "n" (0 = primera aparición), "dentro" (selector CSS que
 * acota la búsqueda). Por toma: "viewport", "dpr", "inicio_y".
 *
 * Salida en --out (por defecto <carpeta del plan>/capturas): <id>.mp4 (H.264, 60 fps,
 * resolución = viewport × dpr), <id>-<foto>.png (con marcas) y <id>-<foto>-limpia.png (sin
 * marcas), _hoja.png (hoja de contacto para MIRAR antes de editar) y manifest.json.
 */

import { createRequire } from 'node:module';
import { spawn, execSync } from 'node:child_process';
import { once } from 'node:events';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const require = createRequire(import.meta.url);
const VERSION = 'capturar-web 1.0 (2026-09-25)';
const VERDE = '#10C26B'; // hermes-content/brand/tokens.css --onia-green

// ---------- dependencias: playwright y ffmpeg, estén donde estén ----------
function cargarChromium() {
  const candidatos = ['playwright', 'playwright-core'];
  try {
    const raiz = execSync('npm root -g', { encoding: 'utf8' }).trim();
    candidatos.push(path.join(raiz, 'playwright'), path.join(raiz, 'playwright-core'));
  } catch { /* sin npm global */ }
  for (const c of candidatos) {
    try { return require(c).chromium; } catch { /* siguiente */ }
  }
  throw new Error('No encuentro Playwright. Instalalo (npm i -D playwright) o globalmente.');
}

function rutaFfmpeg() {
  if (process.env.FFMPEG_PATH) return process.env.FFMPEG_PATH;
  try { execSync('ffmpeg -version', { stdio: 'ignore' }); return 'ffmpeg'; } catch { /* no está */ }
  try {
    return execSync(
      'python3 -c "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())"',
      { encoding: 'utf8' },
    ).trim();
  } catch { /* no está */ }
  throw new Error('No encuentro ffmpeg con H.264. Poné FFMPEG_PATH o `pip install imageio-ffmpeg`.');
}

// ---------- argumentos ----------
function leerArgs(argv) {
  const a = { plan: null, out: null, solo: null, sinVideo: false, fps: null, dpr: null };
  for (let i = 0; i < argv.length; i++) {
    const v = argv[i];
    if (v === '--out') a.out = argv[++i];
    else if (v === '--solo') a.solo = argv[++i].split(',').map((s) => s.trim());
    else if (v === '--sin-video') a.sinVideo = true;
    else if (v === '--fps') a.fps = Number(argv[++i]);
    else if (v === '--dpr') a.dpr = Number(argv[++i]);
    else if (!a.plan) a.plan = v;
    else throw new Error(`Argumento desconocido: ${v}`);
  }
  if (!a.plan) throw new Error('Falta el plan: node capturar-web.mjs <plan.json>');
  return a;
}

// ---------- tiempo ----------
const DURACION = { esperar: 1, scroll: 1.4, cursor: 0.8, click: 0.35, marcar: 1.2, foco: 1.2,
  quitar: 0.3, cursor_fuera: 0.6, foto: 0 };
const suave = (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2); // easeInOutCubic
const lerp = (a, b, p) => a + (b - a) * p;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

/**
 * Convierte los pasos en una línea de tiempo muestreable. Las marcas viven en coordenadas del
 * DOCUMENTO (se mueven con el contenido, como si estuvieran pegadas al texto); el cursor vive
 * en coordenadas de la PANTALLA (si la página scrollea, el cursor se queda donde está, como un
 * mouse real).
 */
function lineaDeTiempo(pasos, objetivos, vp, maxScroll, inicioY) {
  let t = 0;
  let scrollY = clamp(inicioY, 0, maxScroll);
  let cursor = null;
  const fueraDePantalla = { x: vp.width * 0.9, y: vp.height + 60 };
  const scrolls = [];
  const cursores = [];
  const clicks = [];
  const marcas = [];
  const fotos = [];
  pasos.forEach((p, i) => {
    const dur = p.s ?? DURACION[p.hacer];
    if (dur === undefined) throw new Error(`Paso ${i}: acción desconocida "${p.hacer}"`);
    const t0 = t;
    const t1 = t + dur;
    const obj = objetivos[i];
    if (p.hacer === 'scroll') {
      const margen = p.margen ?? 140;
      let destino = p.y ?? (p.centrar
        ? obj.y + obj.h / 2 - vp.height / 2
        : obj.y - margen);
      destino = clamp(Math.round(destino), 0, maxScroll);
      scrolls.push({ t0, t1, de: scrollY, a: destino });
      scrollY = destino;
    } else if (p.hacer === 'cursor') {
      // Por defecto la punta queda al FINAL de la frase: el cuerpo del cursor cae sobre lo que
      // sigue y no tapa la cifra (en la primera prueba, apuntando al medio, tapaba el "40%").
      const ult = obj?.lineas?.[obj.lineas.length - 1] ?? obj;
      const pri = obj?.lineas?.[0] ?? obj;
      const a = !obj ? { x: p.x, y: p.y }
        : p.apunta === 'centro' ? { x: obj.x + obj.w / 2, y: obj.y + obj.h / 2 - scrollY }
          : p.apunta === 'inicio' ? { x: pri.x + Math.min(pri.w * 0.12, 36), y: pri.y + pri.h + 6 - scrollY }
            : { x: Math.min(ult.x + ult.w + 6, vp.width - 70), y: ult.y + ult.h * 0.55 - scrollY };
      const de = cursor ?? fueraDePantalla; // entra desde fuera del cuadro (doctrina oversized-cursor)
      cursores.push({ t0, t1, de, a, visible: true });
      cursor = a;
    } else if (p.hacer === 'cursor_fuera') {
      if (cursor) cursores.push({ t0, t1, de: cursor, a: fueraDePantalla, visible: true, sale: true });
      cursor = null;
    } else if (p.hacer === 'click') {
      if (!cursor) throw new Error(`Paso ${i}: "click" sin cursor en pantalla`);
      clicks.push({ t0, t1, en: cursor });
    } else if (p.hacer === 'marcar' || p.hacer === 'foco') {
      marcas.push({ id: `m${i}`, modo: p.hacer === 'foco' ? 'foco' : 'caja', rect: obj,
        padX: p.pad ?? 10, padY: p.pad ?? 4, tIn: t0, tOut: Infinity, dOut: 0.3 });
    } else if (p.hacer === 'quitar') {
      for (const m of marcas) if (m.tOut === Infinity) { m.tOut = t0; m.dOut = Math.max(dur, 0.01); }
    } else if (p.hacer === 'foto') {
      fotos.push({ t: t0, nombre: p.nombre ?? `f${i}` });
    }
    t = t1;
  });
  const duracion = t;

  function muestra(tt) {
    // scroll
    let y = clamp(inicioY, 0, maxScroll);
    for (const s of scrolls) {
      if (tt >= s.t1) y = s.a;
      else if (tt >= s.t0) { y = lerp(s.de, s.a, suave((tt - s.t0) / (s.t1 - s.t0))); break; }
      else break;
    }
    // cursor
    let cur = null;
    for (const c of cursores) {
      if (tt < c.t0) break;
      const p = c.t1 > c.t0 ? clamp((tt - c.t0) / (c.t1 - c.t0), 0, 1) : 1;
      const e = suave(p);
      const arco = Math.sin(Math.PI * e) * 0.06 * Math.hypot(c.a.x - c.de.x, c.a.y - c.de.y);
      const nx = -(c.a.y - c.de.y);
      const ny = c.a.x - c.de.x;
      const nl = Math.hypot(nx, ny) || 1;
      cur = { x: lerp(c.de.x, c.a.x, e) + (nx / nl) * arco, y: lerp(c.de.y, c.a.y, e) + (ny / nl) * arco };
      if (c.sale && p >= 1) cur = null;
    }
    // click
    let pulso = null;
    for (const k of clicks) {
      if (tt >= k.t0 && tt < k.t1) pulso = { x: k.en.x, y: k.en.y, p: (tt - k.t0) / (k.t1 - k.t0) };
    }
    // marcas
    const ms = [];
    for (const m of marcas) {
      if (tt < m.tIn) continue;
      const entra = clamp((tt - m.tIn) / 0.25, 0, 1);
      const sale = tt >= m.tOut ? clamp(1 - (tt - m.tOut) / m.dOut, 0, 1) : 1;
      const op = suave(entra) * sale;
      if (op <= 0) continue;
      ms.push({ id: m.id, modo: m.modo, rect: m.rect, padX: m.padX, padY: m.padY, op, esc: lerp(0.96, 1, suave(entra)) });
    }
    return { scrollY: Math.round(y), cursor: cur, pulso, marcas: ms };
  }
  return { duracion, muestra, fotos };
}

// ---------- código que corre DENTRO de la página ----------
const EN_PAGINA = String.raw`
window.__cap = (() => {
  const VERDE = '__VERDE__';
  let raiz, cursorEl, pulsoEl;
  const marcasEl = new Map();
  function init(cursorPx) {
    if (raiz) return;
    document.documentElement.style.scrollBehavior = 'auto';
    raiz = document.createElement('div');
    raiz.id = '__cap-raiz';
    raiz.style.cssText = 'position:fixed;inset:0;z-index:2147483647;pointer-events:none;overflow:hidden';
    document.documentElement.appendChild(raiz);
    pulsoEl = document.createElement('div');
    pulsoEl.style.cssText = 'position:absolute;left:0;top:0;width:10px;height:10px;border-radius:50%;border:4px solid ' + VERDE + ';opacity:0;box-sizing:border-box';
    raiz.appendChild(pulsoEl);
    cursorEl = document.createElement('div');
    cursorEl.style.cssText = 'position:absolute;left:0;top:0;width:' + cursorPx + 'px;height:' + cursorPx + 'px;display:none;filter:drop-shadow(0 3px 6px rgba(0,0,0,.45))';
    cursorEl.innerHTML = '<svg viewBox="0 0 24 24" width="100%" height="100%"><path d="M3 2 L3 19.5 L7.6 15.2 L10.6 22 L13.6 20.7 L10.7 14 L17 14 Z" fill="#fff" stroke="#0A0F0D" stroke-width="1.4" stroke-linejoin="round"/></svg>';
    raiz.appendChild(cursorEl);
  }
  function normaliza(s) { return s.replace(/\s+/g, ' ').trim(); }
  function escapa(s) { return s.replace(/[.*+?^\${}()|[\]\\]/g, '\\$&'); }
  // Busca "texto" en los nodos de texto VISIBLES y devuelve su rectángulo en coordenadas
  // del documento. Soporta textos partidos en varios nodos (<strong>$4</strong> per…).
  function buscar(texto, n, dentro) {
    const base = dentro ? document.querySelector(dentro) : document.body;
    if (!base) return { error: 'no existe el contenedor ' + dentro };
    const nodos = [];
    const w = document.createTreeWalker(base, NodeFilter.SHOW_TEXT, {
      acceptNode(nd) {
        if (!nd.nodeValue || !nd.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        const el = nd.parentElement;
        if (!el || el.closest('#__cap-raiz, script, style, noscript')) return NodeFilter.FILTER_REJECT;
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        if (r.width === 0 || r.height === 0 || cs.visibility === 'hidden' || cs.display === 'none') return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    let total = '';
    while (w.nextNode()) { nodos.push({ nodo: w.currentNode, desde: total.length }); total += w.currentNode.nodeValue; }
    const re = new RegExp(escapa(normaliza(texto)).replace(/ /g, '\\s+'), 'g');
    let m, i = 0;
    while ((m = re.exec(total))) {
      if (i++ < n) continue;
      const ini = m.index, fin = m.index + m[0].length;
      const ubicar = (pos) => {
        for (let k = nodos.length - 1; k >= 0; k--) if (nodos[k].desde <= pos) return { nodo: nodos[k].nodo, off: pos - nodos[k].desde };
        return null;
      };
      const a = ubicar(ini), b = ubicar(fin - 1);
      const rango = document.createRange();
      rango.setStart(a.nodo, a.off);
      rango.setEnd(b.nodo, b.off + 1);
      const rs = [...rango.getClientRects()].filter((r) => r.width > 0 && r.height > 0);
      if (!rs.length) return { error: 'el texto existe pero no se ve: ' + texto };
      // Un rectángulo por RENGLÓN: si la frase ocupa dos líneas, la unión de sus rectángulos
      // abarcaría las dos líneas enteras y marcaría palabras que no son de la frase (pasó el
      // 2026-09-25: el recuadro del precio metía "Cache reads (which make up…").
      const orden = rs.slice().sort((a, b) => a.top - b.top || a.left - b.left);
      const lineas = [];
      for (const r of orden) {
        const cy = (r.top + r.bottom) / 2;
        const l = lineas.find((q) => cy > q.top && cy < q.bottom);
        if (l) { l.left = Math.min(l.left, r.left); l.right = Math.max(l.right, r.right); l.top = Math.min(l.top, r.top); l.bottom = Math.max(l.bottom, r.bottom); }
        else lineas.push({ left: r.left, right: r.right, top: r.top, bottom: r.bottom });
      }
      const x0 = Math.min(...rs.map((r) => r.left)), y0 = Math.min(...rs.map((r) => r.top));
      const x1 = Math.max(...rs.map((r) => r.right)), y1 = Math.max(...rs.map((r) => r.bottom));
      return { x: x0 + scrollX, y: y0 + scrollY, w: x1 - x0, h: y1 - y0,
        lineas: lineas.map((q) => ({ x: q.left + scrollX, y: q.top + scrollY, w: q.right - q.left, h: q.bottom - q.top })) };
    }
    return { error: 'no encontré en la página: "' + texto + '"' + (n ? ' (aparición ' + n + ')' : '') };
  }
  function aplicar(st) {
    window.scrollTo({ top: st.scrollY, left: 0, behavior: 'instant' });
    const vivas = new Set();
    for (const m of st.marcas) {
      const piezas = m.modo === 'foco' || !m.rect.lineas ? [m.rect] : m.rect.lineas;
      // Una línea: recuadro. Dos o más: resaltador (fondo + subrayado), porque en renglones
      // apretados los recuadros se montan unos sobre otros y la marca se vuelve ruido.
      const resaltador = m.modo !== 'foco' && piezas.length > 1;
      const padX = resaltador ? 5 : m.padX, padY = resaltador ? 1 : m.padY;
      piezas.forEach((r, k) => {
        const id = m.id + '-' + k;
        vivas.add(id);
        let el = marcasEl.get(id);
        if (!el) {
          el = document.createElement('div');
          el.style.cssText = 'position:absolute;box-sizing:border-box;transform-origin:center;mix-blend-mode:multiply';
          if (m.modo === 'foco') { el.style.borderRadius = '10px'; el.style.boxShadow = '0 0 0 200vmax rgba(10,15,13,.62)'; el.style.mixBlendMode = 'normal'; }
          else if (resaltador) { el.style.borderRadius = '6px'; el.style.background = 'rgba(16,194,107,.26)'; el.style.boxShadow = 'inset 0 -3px 0 ' + VERDE; }
          else { el.style.borderRadius = '10px'; el.style.mixBlendMode = 'normal'; el.style.border = '4px solid ' + VERDE; el.style.boxShadow = '0 0 0 5px rgba(16,194,107,.20), 0 8px 22px rgba(16,194,107,.26)'; }
          raiz.insertBefore(el, pulsoEl);
          marcasEl.set(id, el);
        }
        const x = r.x - padX - scrollX, y = r.y - padY - window.scrollY;
        el.style.left = x + 'px'; el.style.top = y + 'px';
        el.style.width = (r.w + 2 * padX) + 'px'; el.style.height = (r.h + 2 * padY) + 'px';
        el.style.opacity = m.op; el.style.transform = 'scale(' + m.esc + ')';
        el.style.display = 'block';
      });
    }
    for (const [id, el] of marcasEl) if (!vivas.has(id)) el.style.display = 'none';
    if (st.cursor) { cursorEl.style.display = 'block'; cursorEl.style.transform = 'translate(' + (st.cursor.x - 3) + 'px,' + (st.cursor.y - 2) + 'px)'; }
    else cursorEl.style.display = 'none';
    if (st.pulso) {
      const d = 16 + st.pulso.p * 70;
      pulsoEl.style.width = pulsoEl.style.height = d + 'px';
      pulsoEl.style.transform = 'translate(' + (st.pulso.x - d / 2) + 'px,' + (st.pulso.y - d / 2) + 'px)';
      pulsoEl.style.opacity = String(1 - st.pulso.p);
    } else pulsoEl.style.opacity = '0';
    return new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
  }
  function mostrarCapa(v) { if (raiz) raiz.style.visibility = v ? 'visible' : 'hidden'; }
  // Región (px CSS del viewport) que cubren las marcas visibles: la "región focal" de la foto.
  function regionMarcas() {
    const rs = [...marcasEl.values()].filter((el) => el.style.display !== 'none' && Number(el.style.opacity) > 0.5)
      .map((el) => el.getBoundingClientRect());
    if (!rs.length) return null;
    const x0 = Math.max(0, Math.min(...rs.map((r) => r.left))), y0 = Math.max(0, Math.min(...rs.map((r) => r.top)));
    const x1 = Math.min(innerWidth, Math.max(...rs.map((r) => r.right))), y1 = Math.min(innerHeight, Math.max(...rs.map((r) => r.bottom)));
    return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
  }
  return { init, buscar, aplicar, mostrarCapa, normaliza, regionMarcas };
})();
`.replace('__VERDE__', VERDE);

const OCULTAR_BASE = [
  '#onetrust-banner-sdk', '#onetrust-consent-sdk', '.osano-cm-window', '#CybotCookiebotDialog',
  '[id*="cookie-banner" i]', '[class*="cookie-banner" i]', '[class*="cookieBanner" i]',
  '[aria-label*="cookie" i][role="dialog"]', '[aria-label*="cookie" i][role="region"]',
];

/** Ninguna fase puede colgarse en silencio: si pasa el límite, falla con su nombre. */
function conLimite(promesa, ms, fase) {
  let t;
  return Promise.race([promesa, new Promise((_, rej) => { t = setTimeout(() => rej(new Error(`se colgó en: ${fase} (${ms / 1000} s)`)), ms); })])
    .finally(() => clearTimeout(t));
}

function sha256(archivo) {
  return createHash('sha256').update(fs.readFileSync(archivo)).digest('hex');
}

async function codificar(ffmpeg, destino, fps, crf, generarCuadros) {
  const args = ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-c:v', 'mjpeg', '-framerate', String(fps),
    '-i', '-', '-c:v', 'libx264', '-preset', 'slow', '-crf', String(crf), '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart', destino];
  const proc = spawn(ffmpeg, args, { stdio: ['pipe', 'ignore', 'pipe'] });
  let err = '';
  proc.stderr.on('data', (d) => { err += d; });
  await generarCuadros(async (buf) => {
    if (!proc.stdin.write(buf)) await once(proc.stdin, 'drain');
  });
  proc.stdin.end();
  const [codigo] = await once(proc, 'close');
  if (codigo !== 0) throw new Error(`ffmpeg falló (${codigo}): ${err.slice(0, 400)}`);
}

async function hojaDeContacto(browser, fotos, destino) {
  if (!fotos.length) return;
  const celdas = fotos.map((f) => `<figure><img src="data:image/png;base64,${fs.readFileSync(f.ruta).toString('base64')}"><figcaption>${f.etiqueta}</figcaption></figure>`).join('');
  const html = `<html><body style="margin:0;background:#0A0F0D;font:600 22px system-ui;color:#fff">
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:18px;padding:18px">${celdas}</div>
    <style>img{width:100%;border-radius:8px;display:block}figure{margin:0}figcaption{padding:8px 2px}</style></body></html>`;
  const page = await browser.newPage({ viewport: { width: 1800, height: 800 } });
  await page.setContent(html);
  await page.screenshot({ path: destino, fullPage: true });
  await page.close();
}

async function main() {
  const args = leerArgs(process.argv.slice(2));
  const plan = JSON.parse(fs.readFileSync(args.plan, 'utf8'));
  const out = path.resolve(args.out ?? plan.out ?? path.join(path.dirname(args.plan), 'capturas'));
  fs.mkdirSync(out, { recursive: true });
  const ffmpeg = args.sinVideo ? null : rutaFfmpeg();
  const chromium = cargarChromium();
  const browser = await chromium.launch({ args: ['--hide-scrollbars', '--font-render-hinting=none'] });
  const manifest = {
    tema: plan.tema, herramienta: VERSION, capturado: new Date().toISOString(),
    navegador: `Chromium ${browser.version()}`, sesion: 'sin login · contexto nuevo · sin cookies guardadas',
    nota: 'Página real. El recuadro verde, el foco y el cursor son edición encima; el contenido no se tocó. '
      + 'Se ocultan banners de cookies. Todo pedido que no sea GET/HEAD se bloquea y se anota.',
    tomas: [],
  };
  const fotosHoja = [];
  let fallas = 0;
  try {
    for (const toma of plan.tomas) {
      if (args.solo && !args.solo.includes(toma.id)) continue;
      const vp = toma.viewport ?? plan.viewport ?? { width: 1440, height: 900 };
      const dpr = args.dpr ?? toma.dpr ?? plan.dpr ?? 2;
      const fps = args.fps ?? toma.fps ?? plan.fps ?? 60;
      const registro = { id: toma.id, url: toma.url, viewport: vp, dpr, fps, bloqueados: [], debe_decir: [] };
      manifest.tomas.push(registro);
      const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: dpr, locale: plan.locale ?? 'es-419',
        colorScheme: toma.esquema ?? plan.esquema ?? 'light', reducedMotion: 'no-preference' });
      const page = await ctx.newPage();
      try {
        await page.route('**/*', (route) => {
          const m = route.request().method();
          if (m === 'GET' || m === 'HEAD') return route.continue();
          registro.bloqueados.push(`${m} ${route.request().url().slice(0, 160)}`);
          return route.abort();
        });
        const resp = await page.goto(toma.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
        registro.estado_http = resp?.status() ?? null;
        await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
        registro.url_final = page.url();
        registro.titulo = await page.title();
        const ocultar = [...OCULTAR_BASE, ...(plan.ocultar ?? []), ...(toma.ocultar ?? [])];
        await page.addStyleTag({ content: `${ocultar.join(',')}{display:none!important}` });
        await page.addScriptTag({ content: EN_PAGINA });
        await conLimite(page.evaluate((px) => window.__cap.init(px), Math.round((toma.cursor_px ?? plan.cursor_px ?? 56))), 10000, 'init de la capa');
        // precalentar: bajar y subir para que carguen imágenes perezosas y animaciones de entrada
        const alto = await conLimite(page.evaluate(() => document.scrollingElement.scrollHeight), 10000, 'alto');
        for (let y = 0; y < alto; y += Math.round(vp.height * 0.8)) {
          await conLimite(page.evaluate((yy) => window.scrollTo({ top: yy, behavior: 'instant' }), y), 10000, 'precalentar');
          await page.waitForTimeout(120);
        }
        if (process.env.CAPTURA_DEBUG) console.log(`  ${toma.id}: cargada (${alto}px), verificando…`);
        await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
        await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
        await conLimite(page.evaluate(() => (document.fonts ? document.fonts.ready.then(() => true) : true)), 15000, 'fuentes');
        await page.waitForTimeout(800);
        // verificar lo que el guion afirma
        const cuerpo = await conLimite(page.evaluate(() => window.__cap.normaliza(document.body.innerText)), 15000, 'leer texto');
        for (const txt of toma.debe_decir ?? []) {
          const ok = cuerpo.includes(txt.replace(/\s+/g, ' ').trim());
          registro.debe_decir.push({ texto: txt, encontrado: ok });
          if (!ok) throw new Error(`la página NO dice "${txt}" — el guion no se puede apoyar en esta toma`);
        }
        // resolver objetivos de texto
        const objetivos = [];
        for (const [i, p] of (toma.pasos ?? []).entries()) {
          if (p.texto) {
            const r = await conLimite(page.evaluate(([t, n, d]) => window.__cap.buscar(t, n, d), [p.texto, p.n ?? 0, p.dentro ?? null]), 15000, `buscar "${p.texto}"`);
            if (r.error) throw new Error(`paso ${i} (${p.hacer}): ${r.error}`);
            objetivos[i] = r;
          } else objetivos[i] = null;
        }
        const maxScroll = await page.evaluate(() => document.scrollingElement.scrollHeight - innerHeight);
        const linea = lineaDeTiempo(toma.pasos ?? [], objetivos, vp, maxScroll, toma.inicio_y ?? 0);
        registro.duracion_s = Number(linea.duracion.toFixed(2));
        const total = Math.max(1, Math.round(linea.duracion * fps));
        const fotosPend = [...linea.fotos];
        if (!fotosPend.length) fotosPend.push({ t: Math.max(0, linea.duracion - 1 / fps), nombre: 'fin' });
        registro.fotos = [];
        const sacarFoto = async (f) => {
          const base = path.join(out, `${toma.id}-${f.nombre}`);
          await page.evaluate((st) => window.__cap.aplicar(st), linea.muestra(f.t));
          await page.screenshot({ path: `${base}.png`, animations: 'disabled', caret: 'hide' });
          const reg = await page.evaluate(() => window.__cap.regionMarcas());
          await page.evaluate(() => window.__cap.mostrarCapa(false));
          await page.screenshot({ path: `${base}-limpia.png`, animations: 'disabled', caret: 'hide' });
          await page.evaluate(() => window.__cap.mostrarCapa(true));
          // region_px: en píxeles del PNG (viewport × dpr). Sirve para recortar la cifra marcada
          // (carrusel) o como región focal del layout partido (edición).
          const region = reg ? Object.fromEntries(Object.entries(reg).map(([k, v]) => [k, Math.round(v * dpr)])) : null;
          registro.fotos.push({ archivo: path.basename(`${base}.png`), limpia: path.basename(`${base}-limpia.png`), t: Number(f.t.toFixed(2)), region_px: region });
          fotosHoja.push({ ruta: `${base}.png`, etiqueta: `${toma.id} · ${f.nombre}` });
        };
        if (ffmpeg) {
          const destino = path.join(out, `${toma.id}.mp4`);
          const t0 = Date.now();
          await codificar(ffmpeg, destino, fps, toma.crf ?? plan.crf ?? 18, async (escribir) => {
            for (let k = 0; k < total; k++) {
              await conLimite(page.evaluate((st) => window.__cap.aplicar(st), linea.muestra(k / fps)), 15000, `cuadro ${k}`);
              const buf = await page.screenshot({ type: 'jpeg', quality: 93, animations: 'disabled', caret: 'hide' });
              await escribir(buf);
              if (k % Math.max(1, fps) === 0) process.stdout.write(`\r  ${toma.id}: cuadro ${k + 1}/${total}   `);
            }
          });
          process.stdout.write(`\r  ${toma.id}: ${total} cuadros en ${((Date.now() - t0) / 1000).toFixed(0)} s      \n`);
          registro.video = { archivo: path.basename(destino), cuadros: total, resolucion: `${vp.width * dpr}x${vp.height * dpr}`,
            bytes: fs.statSync(destino).size, sha256: sha256(destino) };
        }
        for (const f of fotosPend) await sacarFoto(f);
        registro.ok = true;
      } catch (e) {
        registro.ok = false;
        registro.error = e.message;
        fallas++;
        console.error(`✗ ${toma.id}: ${e.message}`);
      } finally {
        await ctx.close();
      }
    }
    await hojaDeContacto(browser, fotosHoja, path.join(out, '_hoja.png'));
  } finally {
    await browser.close();
  }
  // Con --solo se re-graban algunas tomas: el manifiesto conserva las demás (no se pisan).
  const rutaManifest = path.join(out, 'manifest.json');
  if (args.solo && fs.existsSync(rutaManifest)) {
    const previo = JSON.parse(fs.readFileSync(rutaManifest, 'utf8'));
    const nuevas = new Map(manifest.tomas.map((t) => [t.id, t]));
    const combinadas = (previo.tomas ?? []).map((t) => nuevas.get(t.id) ?? t);
    for (const t of manifest.tomas) if (!combinadas.some((c) => c.id === t.id)) combinadas.push(t);
    manifest.tomas = combinadas;
  }
  fs.writeFileSync(rutaManifest, `${JSON.stringify(manifest, null, 2)}\n`);
  const ok = manifest.tomas.filter((t) => t.ok).length;
  console.log(`✓ ${ok}/${manifest.tomas.length} tomas · salida: ${out}`);
  console.log('  Antes de editar: MIRAR _hoja.png y cada PNG (verificar es mirar, no suponer).');
  process.exit(fallas ? 1 : 0);
}

main().catch((e) => { console.error(`✗ ${e.message}`); process.exit(1); });
