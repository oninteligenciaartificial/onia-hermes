#!/usr/bin/env node
// QA geométrico: abre index.html en Chromium, lleva el timeline a mitad de cada elemento de texto y mide su caja.
// Reglas (CLAUDE.md / editor-videos §Reels de Lucía): texto entre mentón+40 y y=1490; nada en los 80 px de la derecha bajo y=1000;
// 2da pasada: nada sobre y=280 (UI de Instagram arriba), la lupa no toca la cara y NINGÚN texto baja de 34 px en el teléfono (H7).
// Uso: node scripts/medir-dom.mjs   → imprime una tabla y sale con código 1 si algo incumple.
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
const require = createRequire('/opt/node-tools/package.json');
const { chromium } = require('playwright');
const P = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const plan = JSON.parse(fs.readFileSync(path.join(P, 'plan.json'), 'utf8'));
plan.etiquetas = plan.etiquetas.filter((d) => d.activo !== false);   // los agregados apagados no están en el DOM
const Z = plan.zona_segura;
// mentón máximo del plano de fondo según el tramo (de plan.caras): arriba sin franja → texto va sobre el cielo (K4)
const W0 = plan.particion.ventana_fuente_y[0], MK1 = plan.caras.k1.menton_max;
const mentonS4 = { d3: MK1 - W0 + plan.particion.arriba.y, d2: MK1 - W0 + plan.particion.abajo.y, c6: MK1 - W0 + plan.particion.arriba.y };
const menton = (t) => (t < 6 || (t >= 6 && t < 35)) ? plan.caras.k1.menton_max : (t >= 45 && t < 50) ? plan.caras.k2_foto.caja[3] : (t >= 50) ? plan.caras.k2.menton_max : null;
const b = await chromium.launch({ executablePath: process.env.PRODUCER_HEADLESS_SHELL_PATH || '/opt/pw-browsers/chromium/chrome', args: ['--no-sandbox'] }).catch(async () => chromium.launch({ args: ['--no-sandbox'] }));
const pg = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await pg.goto(pathToFileURL(path.join(P, 'index.html')).href);
await pg.evaluate(() => document.fonts.ready);
await pg.waitForTimeout(500);
const items = [
  ...plan.tarjetas.map((c) => ({ id: c.id, sel: `#${c.id} .card`, a: c.a, b: c.b, tipo: 'tarjeta' })),
  { id: 'rotulo', sel: '#rotulo .tag', a: 0.5, b: 2.0, tipo: 'rótulo' },
  ...plan.etiquetas.map((d) => ({ id: d.id, sel: d.id === 'eq' ? '#eq .eqrow' : `#${d.id} .tag`, a: d.id === 'eq' ? d.terminos_t[4] + 0.4 : d.a + 0.6, b: d.id === 'eq' ? d.b - 0.3 : d.b - 0.3, tipo: 'etiqueta' })),
  { id: 'panel', sel: '#panel .card', a: 29.0, b: 30.0, tipo: 'panel' },
];
let fallos = 0;
const rows = [];
for (const it of items) {
  const t = +((it.a + it.b) / 2).toFixed(2);
  const r = await pg.evaluate(([sel, t]) => {
    window.__timelines.main.pause(); window.__timelines.main.time(t);
    const e = document.querySelector(sel); const q = e.getBoundingClientRect();
    return { x1: Math.round(q.left), y1: Math.round(q.top), x2: Math.round(q.right), y2: Math.round(q.bottom) };
  }, [it.sel, t]);
  const probs = [];
  if (r.y2 > Z.texto_hasta_y) probs.push(`baja de y=${Z.texto_hasta_y}`);
  if (r.y1 < Z.arriba_minimo_y) probs.push(`sube sobre y=${Z.arriba_minimo_y}`);
  if (r.y2 > 1000 && r.x2 > 1080 - Z.derecha_libre_px) probs.push(`invade los 80 px de la derecha (x2=${r.x2})`);
  if (r.x1 < 0) probs.push('sale por la izquierda');
  const m = mentonS4[it.id] ?? menton(t);
  if (m != null && r.y1 < m + Z.margen_bajo_menton) probs.push(`queda sobre mentón+40 (${m + Z.margen_bajo_menton})`);
  rows.push({ id: it.id, t, ...r, w: r.x2 - r.x1, h: r.y2 - r.y1, probs });
  if (probs.length) fallos++;
}
for (const r of rows) console.log(`${r.id.padEnd(7)} t=${String(r.t).padEnd(6)} x ${String(r.x1).padStart(4)}–${String(r.x2).padEnd(4)} y ${String(r.y1).padStart(4)}–${String(r.y2).padEnd(4)} (${r.w}×${r.h}) ${r.probs.length ? '✖ ' + r.probs.join('; ') : 'ok'}`);

// lupa (imagen, sin texto): dentro del lienzo, bajo y=280, a la derecha de la cara y sin tapar el marco de la cara
if (plan.lupa && plan.lupa.activo !== false) {
  const t = +((plan.lupa.a + 0.5 + plan.lupa.b - 0.3) / 2).toFixed(2);   // en reposo (entró en 0,32 s, sale en los últimos 0,18 s)
  const r = await pg.evaluate((t) => { window.__timelines.main.pause(); window.__timelines.main.time(t); const q = document.querySelector('#lupa').getBoundingClientRect(); return { x1: Math.round(q.left), y1: Math.round(q.top), x2: Math.round(q.right), y2: Math.round(q.bottom) }; }, t);
  const [fx1, fy1, fx2, fy2] = plan.marco_cara.caja, probs = [];
  const toca = r.x1 < fx2 && r.x2 > fx1 && r.y1 < fy2 && r.y2 > fy1;
  if (toca) probs.push('toca el marco de la cara');
  if (r.x2 > 1080 || r.x1 < 0 || r.y1 < Z.arriba_minimo_y) probs.push('sale del lienzo o sube sobre y=280');
  if (r.y2 > 1000 && r.x2 > 1080 - Z.derecha_libre_px) probs.push('invade los 80 px de la derecha');
  console.log(`lupa    t=${String(t).padEnd(6)} x ${String(r.x1).padStart(4)}–${String(r.x2).padEnd(4)} y ${String(r.y1).padStart(4)}–${String(r.y2).padEnd(4)} (${r.x2 - r.x1}×${r.y2 - r.y1}) ${probs.length ? '✖ ' + probs.join('; ') : 'ok (imagen, no toca la cara)'}`);
  if (probs.length) fallos++;
}

// C3 (3ra pasada): en K4 NADA baja de y=885 (la receta pide texto abajo del mentón, que aquí no cabe; el cabello arriba empieza en y≈915).
// El sello «5 dedos» llegaba a y≈912 en la 2da pasada. Se mide su caja REAL (con la rotación −5° y la escala 1,3 → 1 de la entrada) cuadro por cuadro,
// desde que cae (cuadro 60) hasta que K4 sale; y el recorte (#inset) y el recuadro #origen en reposo.
{
  const k = plan.k4, lim = (k.sello && k.sello.limite_y) || 885, T0 = k.t_foco;
  const filas = await pg.evaluate(([T0, T1, FPS]) => {
    const tl = window.__timelines.main; tl.pause();
    const out = { sello: [], inset: null, origen: null };
    const box = (sel) => { const q = document.querySelector(sel).getBoundingClientRect(); return { x1: Math.round(q.left), y1: Math.round(q.top), x2: Math.round(q.right), y2: Math.round(q.bottom) }; };
    for (let f = Math.round(T0 * FPS); f <= Math.round(T1 * FPS); f++) {
      tl.time(f / FPS);
      if (+getComputedStyle(document.querySelector('#sello')).opacity < 0.05) continue;   // el primer cuadro del sello es invisible (opacidad 0): no cuenta
      out.sello.push({ f, ...box('#sello') });
    }
    tl.time(T0 + 0.5); out.inset = box('#inset'); out.origen = box('#origen');
    return out;
  }, [T0, plan.medios.find((m) => m.id === 'k4').b - 0.3, plan.lienzo.fps]);
  const peor = filas.sello.reduce((a, b) => (b.y2 > a.y2 ? b : a));
  const reposo = filas.sello.at(-1);
  const probs = [];
  if (peor.y2 > lim) probs.push(`el sello baja a y=${peor.y2} en el cuadro ${peor.f} (límite ${lim})`);
  if (filas.inset.y2 > lim) probs.push(`el recorte baja a y=${filas.inset.y2}`);
  if (reposo.x2 > 1080 - Z.derecha_libre_px && reposo.y2 > 1000) probs.push('el sello invade los 80 px de la derecha');
  console.log(`K4 sello  cuadros ${filas.sello[0].f}-${filas.sello.at(-1).f}  máx y2=${peor.y2} (cuadro ${peor.f}); en reposo x ${reposo.x1}–${reposo.x2} y ${reposo.y1}–${reposo.y2}; recorte y ${filas.inset.y1}–${filas.inset.y2}; límite y=${lim} ${probs.length ? '✖ ' + probs.join('; ') : 'ok'}`);
  if (probs.length) fallos++;
}

// H7: ningún texto de la pantalla baja de 34 px (todo lo que tenga texto propio, esté o no a la vista en este instante)
const chicos = await pg.evaluate((min) => {
  const out = [];
  for (const e of document.querySelectorAll('#root *')) {
    const propio = [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    if (!propio) continue;
    const px = parseFloat(getComputedStyle(e).fontSize);
    if (px < min - 1e-6) out.push(`${e.id ? '#' + e.id : e.tagName.toLowerCase() + (e.className ? '.' + String(e.className).split(' ')[0] : '')} ${px}px «${e.textContent.trim().slice(0, 24)}»`);
  }
  return out;
}, Z.texto_min_px);
const tamanos = await pg.evaluate(() => {
  const mapa = {};
  for (const e of document.querySelectorAll('#root *')) {
    const propio = [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    if (propio) { const px = Math.round(parseFloat(getComputedStyle(e).fontSize)); mapa[px] = (mapa[px] || 0) + 1; }
  }
  return mapa;
});
console.log('tamaños de texto en el DOM (px: cuántos elementos):', JSON.stringify(tamanos));
if (chicos.length) { console.log(`✖ texto menor a ${Z.texto_min_px} px:\n  ` + chicos.join('\n  ')); fallos += chicos.length; }
else console.log(`✔ ningún texto menor a ${Z.texto_min_px} px`);
await b.close();
if (fallos) { console.error(`✖ ${fallos} incumplimiento(s)`); process.exit(1); }
console.log('✔ todo el texto dentro de la zona segura');
