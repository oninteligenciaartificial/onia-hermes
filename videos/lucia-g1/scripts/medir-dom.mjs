#!/usr/bin/env node
// QA geométrico: abre index.html en Chromium, lleva el timeline a mitad de cada elemento de texto y mide su caja.
// Reglas (CLAUDE.md / editor-videos §Reels de Lucía): texto entre mentón+40 y y=1490; nada en los 80 px de la derecha bajo y=1000.
// Uso: node scripts/medir-dom.mjs   → imprime una tabla y sale con código 1 si algo incumple.
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
const require = createRequire('/opt/node-tools/package.json');
const { chromium } = require('playwright');
const P = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const plan = JSON.parse(fs.readFileSync(path.join(P, 'plan.json'), 'utf8'));
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
  ...plan.etiquetas.map((d) => ({ id: d.id, sel: d.id === 'eq' ? '#eq .eqrow' : `#${d.id} .tag`, a: d.a + 0.6, b: d.b - 0.3, tipo: 'etiqueta' })),
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
  if (r.y2 > 1000 && r.x2 > 1080 - Z.derecha_libre_px) probs.push(`invade los 80 px de la derecha (x2=${r.x2})`);
  if (r.x1 < 0) probs.push('sale por la izquierda');
  const m = mentonS4[it.id] ?? menton(t);
  if (m != null && r.y1 < m + Z.margen_bajo_menton) probs.push(`queda sobre mentón+40 (${m + Z.margen_bajo_menton})`);
  rows.push({ id: it.id, t, ...r, w: r.x2 - r.x1, h: r.y2 - r.y1, probs });
  if (probs.length) fallos++;
}
for (const r of rows) console.log(`${r.id.padEnd(7)} t=${String(r.t).padEnd(6)} x ${String(r.x1).padStart(4)}–${String(r.x2).padEnd(4)} y ${String(r.y1).padStart(4)}–${String(r.y2).padEnd(4)} (${r.w}×${r.h}) ${r.probs.length ? '✖ ' + r.probs.join('; ') : 'ok'}`);
await b.close();
if (fallos) { console.error(`✖ ${fallos} elemento(s) fuera de la zona`); process.exit(1); }
console.log('✔ todo el texto dentro de la zona segura');
