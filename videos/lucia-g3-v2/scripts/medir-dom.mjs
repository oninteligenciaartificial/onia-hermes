#!/usr/bin/env node
// QA geométrico G3 v2: abre index.html en Chromium, lleva el timeline a mitad de cada elemento de texto y mide su caja en el DOM.
// Reglas (CLAUDE.md / editor-videos §Reels de Lucía): texto entre mentón+40 y y=1490; nada en los 80 px de la derecha bajo y=1000; nada sobre y=280
// (UI de Instagram arriba); NINGÚN texto baja de 34 px (el rótulo de IA mide 40); y dos textos nunca se pisan entre sí.
// Con la cara ABAJO del cuadro (foto buena, clip K4) no hay franja bajo el mentón: el texto va ARRIBA, en el cielo, y termina antes del cabello.
// Lee plan-resuelto.json (lo escribe build.mjs, tiempos en segundos). Uso: node scripts/medir-dom.mjs → tabla; sale con 1 si algo incumple.
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
const require = createRequire('/opt/node-tools/package.json');
const { chromium } = require('playwright');
const P = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const plan = JSON.parse(fs.readFileSync(path.join(P, 'plan-resuelto.json'), 'utf8'));
const Z = plan.zona_segura, C = plan.caras, E = plan.escenas, FPS = plan.lienzo.fps, N = plan.lienzo.cuadros;
// regla de la cara según la escena que se ve a ese tiempo (la que entró última): {min: el texto empieza en y ≥ min} o {max: termina en y ≤ max}
const regla = (t) => {
  const vis = Object.values(E).filter((s) => t >= s.a - 1e-9 && t < s.b - 1e-9).sort((x, y) => y.a - x.a)[0];
  switch (vis && vis.id) {
    case 'desc': return { min: C.desc.texto_desde_y, por: 'mentón de la foto descartada + 40' };
    case 'buena': return { max: C.buena.texto_hasta_y_arriba, por: 'cabello de la foto buena (cara abajo: el texto va arriba)' };
    case 'k4': return { max: C.k4.texto_hasta_y_arriba, por: 'cabello de K4 (cara abajo: el texto va arriba)' };
    case 'k1': return { min: C.k1.cuerpo_texto_desde_y, por: 'mentón de K1 + 40' };
    default: return {};                                                              // agenda y placa: sin persona
  }
};
const b = await chromium.launch({ executablePath: process.env.PRODUCER_HEADLESS_SHELL_PATH || '/opt/pw-browsers/chromium/chrome', args: ['--no-sandbox'] }).catch(async () => chromium.launch({ args: ['--no-sandbox'] }));
const pg = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await pg.goto(pathToFileURL(path.join(P, 'index.html')).href);
await pg.evaluate(() => document.fonts.ready);
await pg.waitForTimeout(500);
const k = plan.k4, ins = plan.insL;
const mid = (a, bb) => +((a + bb) / 2).toFixed(3);
const items = [
  ...plan.tarjetas.map((c) => ({ id: c.id, sel: `#${c.id} .card`, t: mid(c.a, c.b), tipo: 'tarjeta' })),
  { id: 'rotulo', sel: '#rotulo .tag', t: 1.5, tipo: 'rótulo', px: Z.rotulo_px },
  ...plan.etiquetas.map((d) => ({ id: d.id, sel: `#${d.id} .tag`, t: mid(d.a, d.b), tipo: 'etiqueta' })),
  ...(ins ? [{ id: 'capL', sel: '#capL', t: mid(ins.a, ins.b), tipo: 'leyenda', max: C.desc.cielo_hasta_y }] : []),
  { id: 'ctr', sel: '#ctr .tag', t: plan.contador.a + 1.0, tipo: 'contador' },
  { id: 'sello', sel: '#sello', t: plan.placa.sello_t + 0.6, tipo: 'sello' },
  { id: 'visor', sel: '#visor', t: plan.escenas.placa.a + 0.9, tipo: 'visor' },
];
let fallos = 0;
for (const it of items) {
  const r = await pg.evaluate(([sel, t]) => {
    window.__timelines.main.pause(); window.__timelines.main.time(t);
    const e = document.querySelector(sel); if (!e) return null;
    const q = e.getBoundingClientRect(); return { x1: Math.round(q.left), y1: Math.round(q.top), x2: Math.round(q.right), y2: Math.round(q.bottom), px: parseFloat(getComputedStyle(e).fontSize) };
  }, [it.sel, it.t]);
  if (!r) { console.log(`${it.id.padEnd(8)} ✖ no existe ${it.sel}`); fallos++; continue; }
  const probs = [];
  if (r.y2 > Z.texto_hasta_y) probs.push(`baja de y=${Z.texto_hasta_y}`);
  if (it.tipo !== 'visor' && r.y1 < Z.arriba_minimo_y) probs.push(`sube sobre y=${Z.arriba_minimo_y}`);
  if (r.y2 > 1000 && r.x2 > 1080 - Z.derecha_libre_px) probs.push(`invade los 80 px de la derecha (x2=${r.x2})`);
  if (r.x1 < 0) probs.push('sale por la izquierda');
  if (it.px && Math.abs(r.px - it.px) > 0.01) probs.push(`mide ${r.px} px y tiene que medir ${it.px}`);
  const g = it.max != null ? { max: it.max, por: 'cabello de la descartada (el recorte va en el cielo)' } : regla(it.t);
  if (g.min != null && r.y1 < g.min) probs.push(`queda sobre ${g.por} (${g.min})`);
  if (g.max != null && r.y2 > g.max) probs.push(`baja de ${g.por} (${g.max})`);
  console.log(`${it.id.padEnd(8)} t=${String(it.t).padEnd(6)} x ${String(r.x1).padStart(4)}–${String(r.x2).padEnd(4)} y ${String(r.y1).padStart(4)}–${String(r.y2).padEnd(4)} (${r.x2 - r.x1}×${r.y2 - r.y1}) ${probs.length ? '✖ ' + probs.join('; ') : 'ok'}`);
  if (probs.length) fallos++;
}
// el recorte del letrero y los recuadros de la agenda caen fuera de la barra de Instagram y de los botones de la derecha
if (ins) {
  const q = await pg.evaluate((t) => { window.__timelines.main.time(t); const e = document.getElementById('insL').getBoundingClientRect(); return { x1: Math.round(e.left), y1: Math.round(e.top), x2: Math.round(e.right), y2: Math.round(e.bottom) }; }, mid(ins.a, ins.b));
  const ok = q.y1 >= 280 && q.x2 <= 1000 && q.y2 <= C.desc.cielo_hasta_y;
  console.log(`insL     x ${q.x1}–${q.x2} y ${q.y1}–${q.y2} ${ok ? 'ok' : '✖ fuera de y≥280, x≤1000, y≤' + C.desc.cielo_hasta_y}`); if (!ok) fallos++;
}

// ningún texto visible se pisa con otro: cada 6 cuadros (0,25 s) se miden las cajas de todos los textos
const pis = await pg.evaluate(([N, FPS]) => {
  const sels = ['.card', '.tag', '#sello', '.vn', '.cap'];
  const tl = window.__timelines.main; tl.pause(); const out = [];
  for (let f = 0; f < N; f += 6) {
    tl.time(f / FPS);
    const cajas = [];
    for (const e of document.querySelectorAll(sels.join(','))) {
      let o = 1, n = e;
      while (n && n !== document.body) { const cs = getComputedStyle(n); o *= +cs.opacity; if (cs.visibility === 'hidden' || cs.display === 'none') o = 0; n = n.parentElement; }
      const clip = e.closest('.clip'); if (clip) { const a = +clip.dataset.start, d = +clip.dataset.duration; if (f / FPS < a - 1e-6 || f / FPS > a + d + 1e-6) continue; }
      if (o < 0.5) continue;
      const q = e.getBoundingClientRect(); if (q.right < 0 || q.left > 1080 || q.width < 1) continue;
      cajas.push({ id: (e.closest('[id]') || e).id + '/' + e.className.toString().split(' ')[0], x1: q.left, y1: q.top, x2: q.right, y2: q.bottom });
    }
    for (let i = 0; i < cajas.length; i++) for (let j = i + 1; j < cajas.length; j++) {
      const a = cajas[i], c = cajas[j];
      if (a.id.split('/')[0] === c.id.split('/')[0]) continue;
      const ix = Math.min(a.x2, c.x2) - Math.max(a.x1, c.x1), iy = Math.min(a.y2, c.y2) - Math.max(a.y1, c.y1);
      if (ix > 4 && iy > 4) out.push(`t=${(f / FPS).toFixed(2)} ${a.id} ∩ ${c.id} (${Math.round(ix)}×${Math.round(iy)} px)`);
    }
  }
  return out;
}, [N, FPS]);
if (pis.length) { console.log('✖ textos que se pisan:\n  ' + pis.join('\n  ')); fallos += pis.length; } else console.log('✔ ningún texto se pisa con otro (muestreo cada 0,25 s)');

// tamaños de texto: ningún texto < 34 px (todo lo que tenga texto propio, esté o no a la vista)
const chicos = await pg.evaluate((min) => {
  const out = [];
  for (const e of document.querySelectorAll('#root *')) {
    if (![...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
    const px = parseFloat(getComputedStyle(e).fontSize);
    if (px < min - 1e-6) out.push(`${e.id ? '#' + e.id : e.tagName.toLowerCase()} ${px}px «${e.textContent.trim().slice(0, 24)}»`);
  }
  return out;
}, Z.texto_min_px);
const tamanos = await pg.evaluate(() => {
  const mapa = {};
  for (const e of document.querySelectorAll('#root *')) if ([...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) { const px = Math.round(parseFloat(getComputedStyle(e).fontSize)); mapa[px] = (mapa[px] || 0) + 1; }
  return mapa;
});
console.log('tamaños de texto en el DOM (px: cuántos elementos):', JSON.stringify(tamanos));
if (chicos.length) { console.log(`✖ texto menor a ${Z.texto_min_px} px:\n  ` + chicos.join('\n  ')); fallos += chicos.length; } else console.log(`✔ ningún texto menor a ${Z.texto_min_px} px`);

// el contador muestra el número correcto en cada cuadro del clip K4 (cuadro n del clip a t_clip + (n − k0)/24)
{
  const k0 = k.media_inicio, T0 = k.t_clip, last = Math.round((plan.escenas.k4.b - T0) * FPS) + k0 - 1;
  const malos = await pg.evaluate(([T0, k0, last, FPS]) => {
    const tl = window.__timelines.main; tl.pause(); const strip = document.getElementById('ctrstrip'); const out = [];
    for (let n = k0; n <= last; n++) {
      tl.time(T0 + (n - k0) / FPS);
      const y = -new DOMMatrix(getComputedStyle(strip).transform).m42, v = Math.round(y / 48);
      if (v !== n) out.push(`cuadro ${n} (t=${(T0 + (n - k0) / FPS).toFixed(3)}): la tira muestra ${v}`);
    }
    return out;
  }, [T0, k0, last, FPS]);
  if (malos.length) { console.log('✖ contador desfasado:\n  ' + malos.slice(0, 12).join('\n  ') + `\n  … ${malos.length} en total`); fallos += malos.length; } else console.log(`✔ el contador marca el cuadro n en t_clip + (n−${k0})/24 para los cuadros ${k0}-${last} (${last - k0 + 1} cuadros; el 120 cae a ${k.t120.toFixed(3)} s)`);
}
await b.close();
if (fallos) { console.error(`✖ ${fallos} incumplimiento(s)`); process.exit(1); }
console.log('✔ todo el texto dentro de la zona segura');
