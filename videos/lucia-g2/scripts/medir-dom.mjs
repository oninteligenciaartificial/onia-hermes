#!/usr/bin/env node
// QA geométrico G2: abre index.html en Chromium, lleva el timeline a cada 0,125 s (3 cuadros) y mide la caja de TODO texto visible.
// Reglas (CLAUDE.md / editor-videos §Reels de Lucía): texto entre mentón+40 y y=1490; nada en los 80 px de la derecha bajo y=1000; nada sobre y=280
// (UI de Instagram arriba); NINGÚN texto baja de 34 px; dos textos nunca se pisan; y los DATOS de las placas están donde dice el número
// (punto, barra y marca a 100 + 880 × valor).
// El mentón de cada instante sale de qa/caras-por-clip.json (SCRFD cada 2 cuadros, el máximo en ±2 cuadros) y se aplica solo a los
// textos que van SOBRE un clip o la foto (no a las placas, que tapan todo). Los 6 cuadros de cada empuje se saltan (todo viaja en x).
// Uso: node scripts/medir-dom.mjs   → imprime un resumen y sale con código 1 si algo incumple.
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
const require = createRequire('/opt/node-tools/package.json');
const { chromium } = require('playwright');
const P = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const plan = JSON.parse(fs.readFileSync(path.join(P, 'plan.json'), 'utf8'));
const caras = JSON.parse(fs.readFileSync(path.join(P, 'qa/caras-por-clip.json'), 'utf8'));
const Z = plan.zona_segura, FPS = plan.lienzo.fps, PUSH = plan.empuje.cuadros / FPS;
const SC = plan.escala, X = (v) => SC.x0 + v * (SC.x1 - SC.x0);
const mot = Object.fromEntries(plan.motores.map((m) => [m.id, m]));
const med = Object.fromEntries(plan.medios.map((m) => [m.id, m]));
const empujes = plan.costuras.filter((c) => c.tipo === 'empuje').map((c) => [c.t - PUSH - 1e-6, c.t + 1e-6]);
const enEmpuje = (t) => empujes.some(([a, b]) => t >= a && t <= b);

// mentón (+40) del medio con cara que está en reposo a t; null si hay una placa o un empuje
const mentonEn = (t) => {
  if (enEmpuje(t)) return null;
  const d = (id, datos) => {
    const m = med[id];
    if (t < m.a || t >= m.b) return null;
    const f = (t - m.a) * FPS + (m.media_inicio || 0) * FPS;     // el cierre K1 arranca en el segundo 2,0 del clip (H7)
    const filas = datos.filter((r) => r[1] && Math.abs(r[0] - f) <= 2.5);
    return filas.length ? Math.max(...filas.map((r) => r[1][3])) : null;
  };
  if (t < med.foto.b) return caras.foto_k1.caja[3];
  for (const k of ['m1', 'm2', 'm3', 'm4', 'm5', 'm6']) { const v = d(k, caras.clips[k].filas); if (v != null) return v; }
  const v = d('k1', caras.clips.m1.filas);       // el cierre es el mismo clip del Motor 1
  return v;
};
const placaEn = (t) => ['pl-regla', 'pl-l1', 'pl-m6', 'pl-l2'].some((id) => t >= med[id].a + PUSH && t < med[id].b - PUSH + 1e-6);

const b = await chromium.launch({ executablePath: process.env.PRODUCER_HEADLESS_SHELL_PATH || '/opt/pw-browsers/chromium/chrome', args: ['--no-sandbox'] }).catch(async () => chromium.launch({ args: ['--no-sandbox'] }));
const pg = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await pg.goto(pathToFileURL(path.join(P, 'index.html')).href);
await pg.evaluate(() => document.fonts.ready);
await pg.waitForTimeout(500);

const N = Math.round(plan.lienzo.duracion * FPS);
const muestras = await pg.evaluate(([N, FPS]) => {
  const tl = window.__timelines.main; tl.pause();
  const SEL = '.card, .tag, .sello, .arr, .rt, .vl, .ax, .barv, .num, .lb, .th span';
  const RANGE = new Set(['lb', 'ax', 'rt', 'num', 'arr']);
  const out = [];
  const posiciones = (t) => { tl.time(t); const m = new Map(); for (const e of document.querySelectorAll(SEL)) { const q = e.getBoundingClientRect(); m.set(e, q.left); } return m; };
  for (let f = 0; f < N; f += 3) {
    const t = f / FPS;
    const antes = posiciones(t + 1 / FPS);
    tl.time(t);
    const cajas = [];
    for (const e of document.querySelectorAll(SEL)) {
      const clip = e.closest('.clip'); if (clip) { const a = +clip.dataset.start, d = +clip.dataset.duration; if (t < a - 1e-6 || t > a + d + 1e-6) continue; }
      let o = 1, n = e;
      while (n && n !== document.body) { const cs = getComputedStyle(n); o *= +cs.opacity; if (cs.visibility === 'hidden' || cs.display === 'none') o = 0; n = n.parentElement; }
      if (o < 0.5) continue;
      let q;
      if (RANGE.has(e.className.toString().split(' ')[0]) || e.className.toString().includes('rt')) { const r = document.createRange(); r.selectNodeContents(e); q = r.getBoundingClientRect(); } else q = e.getBoundingClientRect();
      if (q.width < 1) continue;
      const id = (e.closest('[id]') || e).id;
      const tipo = e.classList.contains('card') ? 'card' : e.classList.contains('sello') ? 'sello' : e.classList.contains('arr') ? 'arr' : e.classList.contains('tag') ? 'tag' : 'placa';
      cajas.push({ mov: Math.abs(q.left - antes.get(e)) > 0.4, id: id + '/' + e.className.toString().split(' ')[0], tipo, x1: q.left, y1: q.top, x2: q.right, y2: q.bottom, px: parseFloat(getComputedStyle(e.classList.contains('card') ? e.querySelector('.t') : e).fontSize), txt: e.textContent.trim().slice(0, 30) });
    }
    out.push({ t, cajas });
  }
  return out;
}, [N, FPS]);

let fallos = 0;
const malos = [];
const falla = (t, m) => { fallos++; if (malos.length < 60) malos.push(`t=${t.toFixed(3)} ${m}`); };
let nCajas = 0;
for (const { t, cajas } of muestras) {
  const push = enEmpuje(t), ment = mentonEn(t), placa = placaEn(t);
  for (const c of cajas) {
    nCajas++;
    if (c.y2 > Z.texto_hasta_y + 0.5) falla(t, `${c.id} «${c.txt}» baja de y=${Z.texto_hasta_y} (y2=${Math.round(c.y2)})`);
    if (c.y1 < Z.arriba_minimo_y - 0.5 && c.tipo !== 'x') falla(t, `${c.id} «${c.txt}» sube sobre y=${Z.arriba_minimo_y} (y1=${Math.round(c.y1)})`);
    if (c.px < Z.texto_min_px - 1e-6) falla(t, `${c.id} «${c.txt}» mide ${c.px}px (< ${Z.texto_min_px})`);
    if (push) continue;
    if (!c.mov && c.y2 > 1000 && c.x2 > 1080 - Z.derecha_libre_px + 0.5) falla(t, `${c.id} «${c.txt}» invade los 80 px de la derecha (x2=${Math.round(c.x2)}, y2=${Math.round(c.y2)})`);
    if (!c.mov && (c.x1 < -0.5 || c.x2 > 1080.5)) falla(t, `${c.id} «${c.txt}» se sale del lienzo (x ${Math.round(c.x1)}–${Math.round(c.x2)})`);
    if (ment != null && !placa && ['card', 'tag', 'sello', 'arr'].includes(c.tipo) && c.y1 < ment + Z.margen_bajo_menton - 0.5) falla(t, `${c.id} «${c.txt}» queda sobre mentón+40 (${Math.round(c.y1)} < ${Math.round(ment + Z.margen_bajo_menton)})`);
  }
  if (!push) for (let i = 0; i < cajas.length; i++) for (let j = i + 1; j < cajas.length; j++) {
    const a = cajas[i], c = cajas[j];
    if (a.id.split('/')[0] === c.id.split('/')[0]) continue;
    const ix = Math.min(a.x2, c.x2) - Math.max(a.x1, c.x1), iy = Math.min(a.y2, c.y2) - Math.max(a.y1, c.y1);
    if (ix > 4 && iy > 4) falla(t, `${a.id} «${a.txt}» ∩ ${c.id} «${c.txt}» (${Math.round(ix)}×${Math.round(iy)} px)`);
  }
}
console.log(`muestras: ${muestras.length} instantes (cada 3 cuadros), ${nCajas} cajas de texto medidas`);

// ningún texto del DOM menor a 34 px (esté o no a la vista)
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
for (const c of chicos) falla(0, `texto menor a ${Z.texto_min_px} px: ${c}`);

// los DATOS están donde dice el número: punto, barra y marca a 100 + 880 × valor (±1,5 px)
const datos = [];
const medida = async (t, sel) => pg.evaluate(([t, sel]) => { const tl = window.__timelines.main; tl.pause(); tl.time(t); const e = document.querySelector(sel); const q = e.getBoundingClientRect(); return { cx: q.left + q.width / 2, x1: q.left, x2: q.right, w: q.width }; }, [t, sel]);
const cerca = (n, esperado, tol = 1.5) => Math.abs(n - esperado) <= tol;
{
  const t1 = plan.l1.filas.at(-1).t + 1.5;                       // todas las filas ya se movieron
  const mk = await medida(t1, '#l1-mk'); datos.push(['L1 marca 0,70', mk.cx, X(SC.piso)]);
  for (const [i, f] of plan.l1.filas.entries()) {
    const m = mot[f.motor], s = await medida(t1, `#l1-s${i + 1}`), e = await medida(t1, `#l1-f${i + 1}`);
    datos.push([`L1 Motor ${m.n} arranque ${m.ini}`, s.cx, X(m.ini)], [`L1 Motor ${m.n} final ${m.fin}`, e.cx, X(m.fin)]);
  }
  const t2 = plan.l2.barra.t0 + 6 * plan.l2.barra.escalon + 1.0;
  const mk2 = await medida(t2, '#l2-mk'); datos.push(['L2 marca 0,70', mk2.cx, X(SC.piso)]);
  for (const [i, id] of plan.l2.orden.entries()) { const m = mot[id], r = await medida(t2, `#l2-b${i + 1}`); datos.push([`L2 barra Motor ${m.n} ${m.fin} (ancho)`, r.w, m.fin * (SC.x1 - SC.x0), 1.5]); datos.push([`L2 barra Motor ${m.n} (borde izquierdo = 0)`, r.x1, SC.x0]); }
  const tq = plan.m6plate.punto_t + 0.6;
  const mk3 = await medida(tq, '#q-mk'); datos.push(['Motor 6 marca 0,70', mk3.cx, X(SC.piso)]);
  const dq = await medida(tq, '#q-dot'); datos.push([`Motor 6 punto ${mot.m6.fin}`, dq.cx, X(mot.m6.fin)]);
  const tr = plan.regla.escala.marca_t + 0.6;
  const mk4 = await medida(tr, '#sc-mk'); datos.push(['regla marca 0,70', mk4.cx, X(SC.piso)]);
}
for (const [que, got, esp, tol] of datos) {
  const ok = cerca(got, esp, tol || 1.5);
  console.log(`  ${ok ? 'ok ' : '✖  '} ${que.padEnd(40)} medido ${got.toFixed(1)}  esperado ${esp.toFixed(1)}`);
  if (!ok) falla(0, `dato fuera de lugar: ${que} (${got.toFixed(1)} vs ${esp.toFixed(1)})`);
}

// el aro sigue al letrero: su centro en cada punto medido
{
  const A = plan.aro_m4;
  for (const p of A.puntos) {
    const r = await medida(p.t + 1e-3, '#aro');
    const ok = cerca(r.cx, p.cx, 2) && true;
    console.log(`  ${ok ? 'ok ' : '✖  '} aro t=${p.t}: centro x ${r.cx.toFixed(1)} (esperado ${p.cx})`);
    if (!ok) falla(p.t, 'aro fuera del punto');
  }
}
await b.close();
if (malos.length) console.log('✖ incumplimientos:\n  ' + malos.join('\n  ') + (fallos > malos.length ? `\n  … ${fallos} en total` : ''));
if (fallos) { console.error(`✖ ${fallos} incumplimiento(s)`); process.exit(1); }
console.log('✔ todo el texto dentro de la zona segura, sin pisarse, ≥ 34 px, y los datos están donde dice el número');
