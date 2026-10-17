#!/usr/bin/env node
// QA geométrico G3: abre index.html en Chromium, lleva el timeline a mitad de cada elemento de texto y mide su caja.
// Reglas (CLAUDE.md / editor-videos §Reels de Lucía): texto entre mentón+40 y y=1490; nada en los 80 px de la derecha bajo y=1000; nada sobre y=280
// (UI de Instagram arriba); NINGÚN texto baja de 34 px; y dos textos nunca se pisan entre sí.
// Con la cara ABAJO del cuadro (foto buena, clip K4) no hay franja bajo el mentón: el texto va ARRIBA, en el cielo, y termina antes del cabello
// (excepción documentada en plan.json → caras).
// Uso: node scripts/medir-dom.mjs   → imprime una tabla y sale con código 1 si algo incumple.
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
const require = createRequire('/opt/node-tools/package.json');
const { chromium } = require('playwright');
const P = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const plan = JSON.parse(fs.readFileSync(path.join(P, 'plan.json'), 'utf8'));
plan.etiquetas = plan.etiquetas.filter((d) => d.activo !== false);
const Z = plan.zona_segura, C = plan.caras;
// regla de la cara según el tramo: {min: el texto debe empezar en y ≥ min} o {max: el texto debe terminar en y ≤ max} (cara abajo → texto arriba)
const regla = (t) => {
  if (t < 19) return { min: C.desc.texto_desde_y, por: 'mentón de la foto descartada + 40' };
  if (t < 23) return {};                                                       // pantalla partida: las ventanas no llevan cara
  if (t < 27) return { max: C.buena.texto_hasta_y_arriba, por: 'cabello de la foto buena (cara abajo: el texto va arriba)' };
  if (t < 40.25) return {};                                                    // agenda: sin persona
  if (t < 46) return { max: C.k4.texto_hasta_y_arriba, por: 'cabello de K4 (cara abajo: el texto va arriba)' };
  if (t < 53.25) return {};                                                    // placa: recorte de manos bajo el mentón
  return { min: C.k1.cuerpo_texto_desde_y, por: 'mentón de K1 + 40' };
};
const b = await chromium.launch({ executablePath: process.env.PRODUCER_HEADLESS_SHELL_PATH || '/opt/pw-browsers/chromium/chrome', args: ['--no-sandbox'] }).catch(async () => chromium.launch({ args: ['--no-sandbox'] }));
const pg = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await pg.goto(pathToFileURL(path.join(P, 'index.html')).href);
await pg.evaluate(() => document.fonts.ready);
await pg.waitForTimeout(500);
const k = plan.k4;
const items = [
  ...plan.tarjetas.map((c) => ({ id: c.id, sel: `#${c.id} .card`, t: +((c.a + c.b) / 2).toFixed(2), tipo: 'tarjeta' })),
  { id: 'rotulo', sel: '#rotulo .tag', t: 1.2, tipo: 'rótulo' },
  ...plan.etiquetas.map((d) => ({ id: d.id, sel: `#${d.id} .tag`, t: +(Math.min(d.a + 0.8, (d.a + d.b) / 2 + 0.4)).toFixed(2), tipo: 'etiqueta' })),
  { id: 'ctr', sel: '#ctr .tag', t: 42.0, tipo: 'contador' },
  { id: 'sello', sel: '#sello', t: 47.5, tipo: 'sello' },
  ...plan.placa.tiles.map((_, i) => ({ id: `pt${i}`, sel: `#pt${i}`, t: 50.0, tipo: 'cuadro' })),
];
let fallos = 0;
for (const it of items) {
  const r = await pg.evaluate(([sel, t]) => {
    window.__timelines.main.pause(); window.__timelines.main.time(t);
    const e = document.querySelector(sel); if (!e) return null;
    const q = e.getBoundingClientRect(); return { x1: Math.round(q.left), y1: Math.round(q.top), x2: Math.round(q.right), y2: Math.round(q.bottom) };
  }, [it.sel, it.t]);
  if (!r) { console.log(`${it.id.padEnd(8)} ✖ no existe ${it.sel}`); fallos++; continue; }
  const probs = [];
  if (r.y2 > Z.texto_hasta_y) probs.push(`baja de y=${Z.texto_hasta_y}`);
  if (it.tipo !== 'cuadro' && r.y1 < Z.arriba_minimo_y) probs.push(`sube sobre y=${Z.arriba_minimo_y}`);
  if (r.y2 > 1000 && r.x2 > 1080 - Z.derecha_libre_px) probs.push(`invade los 80 px de la derecha (x2=${r.x2})`);
  if (r.x1 < 0) probs.push('sale por la izquierda');
  const g = regla(it.t);
  if (g.min != null && r.y1 < g.min) probs.push(`queda sobre ${g.por} (${g.min})`);
  if (g.max != null && r.y2 > g.max) probs.push(`baja de ${g.por} (${g.max})`);
  console.log(`${it.id.padEnd(8)} t=${String(it.t).padEnd(6)} x ${String(r.x1).padStart(4)}–${String(r.x2).padEnd(4)} y ${String(r.y1).padStart(4)}–${String(r.y2).padEnd(4)} (${r.x2 - r.x1}×${r.y2 - r.y1}) ${probs.length ? '✖ ' + probs.join('; ') : 'ok'}`);
  if (probs.length) fallos++;
}

// ningún texto visible se pisa con otro: cada 0,25 s se miden las cajas de todos los textos (tarjetas, etiquetas, contador, sello, rótulos de cuadros)
const pis = await pg.evaluate(([N, FPS]) => {
  const sels = ['.card', '.tag', '#sello', '.ptn', '.ptm', '.vn'];
  const tl = window.__timelines.main; tl.pause(); const out = [];
  for (let f = 0; f < N; f += 6) {
    tl.time(f / FPS);
    const cajas = [];
    for (const e of document.querySelectorAll(sels.join(','))) {
      let o = 1, n = e;
      while (n && n !== document.body) { const cs = getComputedStyle(n); o *= +cs.opacity; if (cs.visibility === 'hidden' || cs.display === 'none') o = 0; n = n.parentElement; }
      // el .clip contenedor lo prende el runtime según data-start: se respeta mirando el atributo
      const clip = e.closest('.clip'); if (clip) { const a = +clip.dataset.start, d = +clip.dataset.duration; if (f / FPS < a - 1e-6 || f / FPS > a + d + 1e-6) continue; }
      if (o < 0.5) continue;
      const q = e.getBoundingClientRect(); if (q.right < 0 || q.left > 1080 || q.width < 1) continue;
      cajas.push({ id: (e.closest('[id]') || e).id + '/' + e.className.toString().split(' ')[0], x1: q.left, y1: q.top, x2: q.right, y2: q.bottom });
    }
    for (let i = 0; i < cajas.length; i++) for (let j = i + 1; j < cajas.length; j++) {
      const a = cajas[i], c = cajas[j];
      if (a.id.split('/')[0] === c.id.split('/')[0]) continue;
      // un rótulo dentro de su propio cuadro (ptn/ptm dentro de pt, vn dentro de visor) no es un choque
      const ix = Math.min(a.x2, c.x2) - Math.max(a.x1, c.x1), iy = Math.min(a.y2, c.y2) - Math.max(a.y1, c.y1);
      if (ix > 4 && iy > 4) out.push(`t=${(f / FPS).toFixed(2)} ${a.id} ∩ ${c.id} (${Math.round(ix)}×${Math.round(iy)} px)`);
    }
  }
  return out;
}, [plan.lienzo.duracion * plan.lienzo.fps, plan.lienzo.fps]);
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

// el contador muestra el número correcto en cada cuadro del clip K4 (cuadro n a inicio + n/24)
if (plan.k4.contador.activo !== false) {
  const malos = await pg.evaluate(([T0, N, FPS]) => {
    const tl = window.__timelines.main; tl.pause(); const strip = document.getElementById('ctrstrip'); const out = [];
    for (let n = 0; n < N; n++) {
      tl.time(T0 + n / FPS);
      const y = -new DOMMatrix(getComputedStyle(strip).transform).m42, v = Math.round(y / 48);
      if (v !== n) out.push(`cuadro ${n} (t=${(T0 + n / FPS).toFixed(3)}): la tira muestra ${v}`);
    }
    return out;
  }, [plan.k4.inicio, plan.k4.cuadros_clip, plan.lienzo.fps]);
  if (malos.length) { console.log('✖ contador desfasado:\n  ' + malos.slice(0, 12).join('\n  ') + `\n  … ${malos.length} en total`); fallos += malos.length; } else console.log(`✔ el contador marca el cuadro n en inicio + n/24 para los ${plan.k4.cuadros_clip} cuadros`);
}
await b.close();
if (fallos) { console.error(`✖ ${fallos} incumplimiento(s)`); process.exit(1); }
console.log('✔ todo el texto dentro de la zona segura');
