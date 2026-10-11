#!/usr/bin/env node
// Reglas de marca medidas en el DOM, cuadro a cuadro (24 fps):
//  · rótulo «Lucía Antelo · personaje IA de Onia» legible (opacidad ≥ 0,9, dentro del lienzo) en TODOS los cuadros de 0 a 2,8 s, a 40 px, y ya fuera desde los 3,0 s;
//  · la promesa («Misma foto. Seis clips.») ya está en el cuadro 0 y las 6 miniaturas están a la vista antes de los 3 s;
//  · el CTA exacto «Seguime: cada semana, una prueba.» legible desde que llega hasta el último cuadro, y dura entre 2,4 y 5,5 s;
//  · los motores se nombran «Motor N» (cada «Motor» va seguido de un número).
// Uso: node scripts/marca.mjs   (sale con 1 si algo incumple)
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
const require = createRequire('/opt/node-tools/package.json');
const { chromium } = require('playwright');
const P = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const plan = JSON.parse(fs.readFileSync(path.join(P, 'plan.resuelto.json'), 'utf8'));
const FPS = plan.lienzo.fps, N = Math.round(plan.lienzo.duracion * FPS);
const b = await chromium.launch({ executablePath: process.env.PRODUCER_HEADLESS_SHELL_PATH || '/opt/pw-browsers/chromium/chrome', args: ['--no-sandbox'] }).catch(async () => chromium.launch({ args: ['--no-sandbox'] }));
const pg = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await pg.goto(pathToFileURL(path.join(P, 'index.html')).href);
await pg.evaluate(() => document.fonts.ready);
await pg.waitForTimeout(400);
const r = await pg.evaluate(([N, FPS]) => {
  const tl = window.__timelines.main; tl.pause();
  const vis = (id) => {
    const e = document.getElementById(id); if (!e) return null;
    let o = 1, n = e;
    while (n && n !== document.body) { const cs = getComputedStyle(n); o *= +cs.opacity; if (cs.visibility === 'hidden' || cs.display === 'none') o = 0; n = n.parentElement; }
    const clip = e.closest('.clip'); const t = tl.time();
    if (clip) { const a = +clip.dataset.start, d = +clip.dataset.duration; if (t < a - 1e-6 || t > a + d + 1e-6) o = 0; }
    const q = e.getBoundingClientRect();
    const dentro = q.width ? Math.max(0, Math.min(q.right, 1080) - Math.max(q.left, 0)) / q.width : 0;
    return { o, dentro, ok: o >= 0.9 && dentro >= 0.95 };
  };
  const out = { rotulo: [], cta: [], c1: [], thumbs: [] };
  for (let f = 0; f < N; f++) {
    tl.time(f / FPS);
    out.rotulo.push(vis('rotulo').ok); out.cta.push(vis('c12').ok); out.c1.push(vis('c1').ok);
    out.thumbs.push([1, 2, 3, 4, 5, 6].every((n) => vis('th' + n).ok));
  }
  tl.time(0);
  const tag = document.querySelector('#rotulo .tag');
  return { out, px: parseFloat(getComputedStyle(tag).fontSize), texto: tag.textContent.trim(), cta: document.getElementById('c12').textContent.replace(/\s+/g, ' ').trim(), html: document.getElementById('root').textContent.replace(/\s+/g, ' ') };
}, [N, FPS]);
await b.close();
let malos = 0;
const falla = (m) => { malos++; console.log('  ✖ ' + m); };
const ok = (m) => console.log('  ok  ' + m);
// rótulo
const rot = r.out.rotulo;
const hasta = rot.findIndex((v, f) => f > 0 && !v);                  // primer cuadro en que ya no es legible
if (!rot[0]) falla('rótulo: no es legible en el cuadro 0');
if (r.px !== 40) falla(`rótulo: ${r.px} px (debe ser 40)`);
if (r.texto !== 'Lucía Antelo · personaje IA de Onia') falla(`rótulo: texto «${r.texto}»`);
const f28 = Math.round(2.8 * FPS);
if (!rot.slice(0, f28).every(Boolean)) falla(`rótulo: hay un cuadro ilegible antes de 2,8 s (cuadro ${rot.findIndex((v) => !v)})`);
if (rot.slice(Math.round(3.0 * FPS)).some(Boolean)) falla('rótulo: sigue legible después de los 3,0 s');
if (!malos) ok(`rótulo «${r.texto}» a ${r.px} px: legible del cuadro 0 al ${hasta - 1} (${(hasta / FPS).toFixed(3)} s) y fuera desde los 3,0 s`);
// promesa en el cuadro 0
if (!r.out.c1[0]) falla('la promesa «Misma foto. Seis clips.» no está legible en el cuadro 0'); else ok('promesa «Misma foto. Seis clips.» legible en el cuadro 0');
const tTh = r.out.thumbs.findIndex(Boolean);
if (tTh < 0 || tTh / FPS > 3.0) falla(`las 6 miniaturas no están a la vista antes de los 3 s (primer cuadro: ${tTh})`); else ok(`las 6 miniaturas están a la vista desde ${(tTh / FPS).toFixed(3)} s (antes de los 3 s)`);
// CTA
const cta = r.out.cta, c0 = cta.findIndex(Boolean), cl = cta.lastIndexOf(true);
const dur = (N - c0) / FPS;
if (r.cta !== 'Seguime: cada semana, una prueba.') falla(`CTA: «${r.cta}»`);
if (cl !== N - 1) falla(`CTA: no es legible en el último cuadro (último legible: ${cl} de ${N - 1})`);
if (cta.slice(c0).some((v) => !v)) falla('CTA: hay un cuadro ilegible entre su llegada y el final');
if (dur < 2.4 || dur > 5.5) falla(`CTA: ${dur.toFixed(3)} s en pantalla (debe ser 2,4-5,5 s)`);
ok(`CTA exacto «${r.cta}» legible desde ${(c0 / FPS).toFixed(3)} s hasta el último cuadro: ${dur.toFixed(3)} s (2,4-5,5 s)`);
// «Motor N»
const sueltos = (r.html.match(/Motor(?!\s\d)/g) || []).length;
if (sueltos) falla(`hay ${sueltos} «Motor» sin número`); else ok('todos los motores se nombran «Motor N»');

if (malos) { console.error(`✖ ${malos} incumplimiento(s)`); process.exit(1); }
console.log('✔ reglas de marca');
