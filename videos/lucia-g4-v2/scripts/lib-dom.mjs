// Utilidades compartidas por los controles que miran el DOM cuadro a cuadro (aire.mjs, ventanas.mjs, hueco-tarjetas.mjs).
// Abre index.html en Chromium (Playwright de /opt/node-tools), lleva el timeline a cada cuadro (24 fps) y mide. Nada se descarga.
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
const require = createRequire('/opt/node-tools/package.json');
const { chromium } = require('playwright');
export const P = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const plan = JSON.parse(fs.readFileSync(path.join(P, 'plan.json'), 'utf8'));
export const FPS = plan.lienzo.fps;
export const N = plan.lienzo.frames;
export const lectura = (n) => n * plan.aire.lectura_s_por_palabra + plan.aire.lectura_base_s;     // 0,35 s por palabra + 0,3 s

export async function abrir() {
  const b = await chromium.launch({ executablePath: process.env.PRODUCER_HEADLESS_SHELL_PATH || '/opt/pw-browsers/chromium/chrome', args: ['--no-sandbox'] }).catch(async () => chromium.launch({ args: ['--no-sandbox'] }));
  const pg = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await pg.goto(pathToFileURL(path.join(P, 'index.html')).href);
  await pg.evaluate(() => document.fonts.ready);
  await pg.waitForTimeout(400);
  return { b, pg };
}

// ids de TODO texto con tiempo de lectura (las tarjetas, las notas, el rótulo, los datos, sellos, pastillas, etiquetas y pies). `tarjetas` = solo las narrativas y las dos notas.
export function idsDeTexto() {
  const tarjetas = [...plan.tarjetas.map((c) => c.id), 'l1-nota1', 'l1-nota2'];
  const otros = ['rotulo', 'sc-mkl', 'sc-ax1', 'l1-mkl'];
  for (const m of plan.imagenes.filter((x) => x.tarjeta)) { otros.push('dA-' + m.id); if (m.sello) otros.push('s-' + m.id); if (m.pastilla) otros.push('p-' + m.id); }
  for (let i = 1; i <= plan.l1.filas.length; i++) otros.push('l1-t' + i, 'l1-v' + i);
  for (let i = 1; i <= plan.l2.fotos.lista.length; i++) otros.push('l2-cap' + i);
  return { tarjetas, otros };
}

// palabras de cada id contadas nodo por nodo (con un espacio entre elementos: «Escena 1» + «0,79» son 3 palabras aunque textContent las pegue)
export async function textos(pg, ids) {
  return pg.evaluate((ids) => ids.map((id) => {
    const e = document.getElementById(id); const ns = [];
    if (e) { const w = document.createTreeWalker(e, NodeFilter.SHOW_TEXT); while (w.nextNode()) ns.push(w.currentNode.textContent.trim()); }
    const t = ns.filter(Boolean).join(' ');
    return [id, t, t.split(/\s+/).filter((x) => x && x !== '·' && x !== '→').length];
  }), ids);
}

// cuadros en que cada id es LEGIBLE: opacidad efectiva ≥ 0,9 y ≥ 95 % de su caja dentro del lienzo, y dentro de la vida de su .clip
export async function legibles(pg, ids) {
  return pg.evaluate(([ids, N, FPS]) => {
    const tl = window.__timelines.main; tl.pause();
    const out = Object.fromEntries(ids.map((i) => [i, []]));
    for (let f = 0; f < N; f++) {
      tl.time(f / FPS);
      for (const id of ids) {
        const e = document.getElementById(id); if (!e) continue;
        let o = 1, n = e;
        while (n && n !== document.body) { const cs = getComputedStyle(n); o *= +cs.opacity; if (cs.visibility === 'hidden' || cs.display === 'none') o = 0; n = n.parentElement; }
        const clip = e.closest('.clip'); if (clip) { const a = +clip.dataset.start, d = +clip.dataset.duration, t = f / FPS; if (t < a - 1e-6 || t > a + d + 1e-6) o = 0; }
        const q = e.getBoundingClientRect(); const dentro = q.width ? Math.max(0, Math.min(q.right, 1080) - Math.max(q.left, 0)) / q.width : 0;
        if (o >= 0.9 && dentro >= 0.95) out[id].push(f);
      }
    }
    return out;
  }, [ids, N, FPS]);
}

// cuadros en que ALGO cambia respecto del anterior (cualquier elemento visible que cambie de opacidad, posición, tamaño, color, fondo o recorte).
// El empuje lento de las fotos (la <img> de .ph) NO cuenta: es un movimiento continuo, no un evento. Devuelve un arreglo de 0/1 de largo N (el cuadro 0 cuenta como 0).
export async function cambios(pg) {
  return pg.evaluate(([N, FPS]) => {
    const tl = window.__timelines.main; tl.pause();
    const els = [...document.querySelectorAll('#root *')].filter((e) => e.id !== 'ground' && !(e.tagName === 'IMG' && e.closest('.ph')));
    const firma = (t) => els.map((e) => {
      let o = 1, n = e;
      while (n && n !== document.body) { const cs = getComputedStyle(n); o *= +cs.opacity; if (cs.visibility === 'hidden' || cs.display === 'none') o = 0; n = n.parentElement; }
      const clip = e.closest('.clip'); if (clip) { const a = +clip.dataset.start, d = +clip.dataset.duration; if (t < a - 1e-6 || t > a + d + 1e-6) o = 0; }
      if (o < 0.004) return '';
      const cs = getComputedStyle(e), q = e.getBoundingClientRect();
      if (q.right < -2 || q.left > 1082) return '';                       // fuera del lienzo: no se ve
      return [o.toFixed(3), cs.color, cs.backgroundColor, cs.backgroundSize, cs.clipPath, Math.round(q.left * 20), Math.round(q.top * 20), Math.round(q.width * 20), Math.round(q.height * 20)].join('|');
    });
    const out = new Array(N).fill(0);
    tl.time(0); let prev = firma(0);
    for (let f = 1; f < N; f++) {
      tl.time(f / FPS); const cur = firma(f / FPS);
      let ch = 0; for (let i = 0; i < cur.length; i++) if (cur[i] !== prev[i]) { ch = 1; break; }
      out[f] = ch; prev = cur;
    }
    return out;
  }, [N, FPS]);
}

// agrupa cuadros consecutivos: [[f0, f1, …], …]
export function grupos(frames) {
  const g = [];
  for (const f of frames) { const u = g[g.length - 1]; if (u && f === u.at(-1) + 1) u.push(f); else g.push([f]); }
  return g;
}
