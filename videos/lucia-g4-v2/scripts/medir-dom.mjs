#!/usr/bin/env node
// QA geométrico G4 v2: abre index.html en Chromium, lleva el timeline a cada 0,125 s (3 cuadros) y mide la caja de TODO texto visible.
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
const caras = JSON.parse(fs.readFileSync(path.join(P, 'qa/caras-fotos.json'), 'utf8')).fotos;
const Z = plan.zona_segura, FPS = plan.lienzo.fps, PUSH = plan.empuje.cuadros / FPS;
const SC = plan.escala, X = (v) => SC.x0 + v * (SC.x1 - SC.x0);
const img = Object.fromEntries(plan.imagenes.map((m) => [m.id, m]));
const med = Object.fromEntries(plan.medios.map((m) => [m.id, m]));
const empujes = plan.costuras.filter((c) => c.tipo === 'empuje').map((c) => [c.t - PUSH - 1e-6, c.t + 1e-6]);
const enEmpuje = (t) => empujes.some(([a, b]) => t >= a && t <= b);

// mentón del medio con cara que está en reposo a t (la foto con su empuje lento: el origen es el centro de la cara medida); null si hay un empuje
const ZOOM = plan.zoom.fin;
const mentonEn = (t) => {
  if (enEmpuje(t)) return null;
  for (const m of plan.medios) if (m.tipo === 'foto') {
    const a = m.a === 0 ? 0 : m.a + PUSH - 1e-6;
    if (t < a || t > m.b - PUSH + 1e-6) continue;
    const [x1, y1, x2, y2] = caras[m.foto].caja, oy = (y1 + y2) / 2;
    const s = 1 + (ZOOM - 1) * Math.min(1, Math.max(0, (t - m.a) / (m.b - m.a)));
    return oy + (y2 - oy) * s;
  }
  return null;
};
const placaEn = (t) => ['pl-regla', 'pl-l1', 'pl-l2'].some((id) => t >= med[id].a + PUSH && t < med[id].b - PUSH + 1e-6);

const b = await chromium.launch({ executablePath: process.env.PRODUCER_HEADLESS_SHELL_PATH || '/opt/pw-browsers/chromium/chrome', args: ['--no-sandbox'] }).catch(async () => chromium.launch({ args: ['--no-sandbox'] }));
const pg = await b.newPage({ viewport: { width: 1080, height: 1920 } });
await pg.goto(pathToFileURL(path.join(P, 'index.html')).href);
await pg.evaluate(() => document.fonts.ready);
await pg.waitForTimeout(500);

const N = plan.lienzo.frames;
const muestras = await pg.evaluate(([N, FPS]) => {
  const tl = window.__timelines.main; tl.pause();
  const SEL = '.card, .tag, .sello, .arr, .rt, .vl, .ax, .barv, .num, .lb, .cn, .cv, .sub, .note, .thd, .rl2, .th span';
  const RANGE = new Set(['lb', 'ax', 'rt', 'num', 'arr', 'cn', 'cv', 'sub', 'note', 'thd', 'rl2']);
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
let nCajas = 0, minMargen = null;
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
    if (ment != null && !placa && ['card', 'tag', 'sello', 'arr'].includes(c.tipo)) {
      const margen = c.y1 - ment;                                       // px entre el mentón y lo que queda justo debajo (la regla pide ≥ 40)
      if (!minMargen || margen < minMargen.v) minMargen = { v: margen, t, id: c.id, y1: c.y1, ment };
      if (c.y1 < ment + Z.margen_bajo_menton - 0.5) falla(t, `${c.id} «${c.txt}» queda sobre mentón+40 (${Math.round(c.y1)} < ${Math.round(ment + Z.margen_bajo_menton)})`);
    }
  }
  if (!push) for (let i = 0; i < cajas.length; i++) for (let j = i + 1; j < cajas.length; j++) {
    const a = cajas[i], c = cajas[j];
    if (a.id.split('/')[0] === c.id.split('/')[0]) continue;
    const ix = Math.min(a.x2, c.x2) - Math.max(a.x1, c.x1), iy = Math.min(a.y2, c.y2) - Math.max(a.y1, c.y1);
    if (ix > 4 && iy > 4) falla(t, `${a.id} «${a.txt}» ∩ ${c.id} «${c.txt}» (${Math.round(ix)}×${Math.round(iy)} px)`);
  }
}
console.log(`muestras: ${muestras.length} instantes (cada 3 cuadros), ${nCajas} cajas de texto medidas`);
if (minMargen) console.log(`margen mínimo entre el mentón y el texto que queda debajo: ${minMargen.v.toFixed(0)} px (t=${minMargen.t.toFixed(3)} s, ${minMargen.id}: texto desde y=${Math.round(minMargen.y1)}, mentón y=${Math.round(minMargen.ment)}; la regla pide ≥ 40)`);

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

// los DATOS están donde dice el número: punto y marca a 100 + 880 × valor (±1,5 px)
const datos = [];
const medida = async (t, sel) => pg.evaluate(([t, sel]) => { const tl = window.__timelines.main; tl.pause(); tl.time(t); const e = document.querySelector(sel); const q = e.getBoundingClientRect(); return { cx: q.left + q.width / 2, x1: q.left, x2: q.right, w: q.width, txt: e.textContent.trim() }; }, [t, sel]);
const cerca = (n, esperado, tol = 1.5) => Math.abs(n - esperado) <= tol;
const fm = (v) => v.toFixed(2).replace('.', ',');
{
  const t1 = plan.l1.filas.at(-1).t + 1.5;                       // todas las filas ya entraron
  const mk = await medida(t1, '#l1-mk'); datos.push(['L1 marca 0,70', mk.cx, X(SC.piso)]);
  for (const [i, f] of plan.l1.filas.entries()) {
    const m = img[f.img], e = await medida(t1, `#l1-f${i + 1}`), v = await medida(t1, `#l1-v${i + 1}`);
    datos.push([`L1 Imagen ${m.letra} punto ${m.valor}`, e.cx, X(m.valor)]);
    if (v.txt !== fm(m.valor)) falla(0, `L1 Imagen ${m.letra}: el valor en pantalla dice «${v.txt}» y el dato es ${fm(m.valor)}`);
  }
  const ru = await medida(plan.l1.ruido.t + 0.6, '#l1-ruido'); datos.push(['L1 franja de ruido (borde izquierdo = 0,66)', ru.x1, X(plan.l1.ruido.desde)], ['L1 franja de ruido (borde derecho = 0,70)', ru.x2, X(plan.l1.ruido.hasta)]);
  const tr = plan.regla.escala.marca_t + 0.6;
  const mk4 = await medida(tr, '#sc-mk'); datos.push(['regla marca 0,70', mk4.cx, X(SC.piso)]);
  for (const [i, f] of plan.l2.fotos.lista.entries()) { const r = await medida((f.cap_t ?? plan.l2.fotos.lista.at(-1).cap_t) + 0.6, `#l2-cap${i + 1} .cv`); if (r.txt !== fm(f.valor)) falla(0, `L2 foto ${f.letra}: dice «${r.txt}» y el dato es ${fm(f.valor)}`); }
  for (const m of plan.imagenes.filter((x) => x.tarjeta)) { const r = await medida(m.tag_t + 0.6, `#dA-${m.id} b`); if (r.txt !== fm(m.valor)) falla(0, `Imagen ${m.letra}: el dato en pantalla dice «${r.txt}» y es ${fm(m.valor)}`); }
  // los rótulos de fila de la lección (nombres largos) no cruzan la marca de 0,70 ni se pisan con el valor de la fila de arriba
  {
    const filas = await pg.evaluate((t) => {
      const tl = window.__timelines.main; tl.pause(); tl.time(t);
      const out = []; for (let n = 1; n <= 6; n++) { const e = document.getElementById('l1-t' + n); const r = document.createRange(); r.selectNodeContents(e); const q = r.getBoundingClientRect(); out.push({ n, x1: q.left, x2: q.right, y1: q.top, y2: q.bottom, px: parseFloat(getComputedStyle(e).fontSize), txt: e.textContent }); }
      const mk = document.getElementById('l1-mk').getBoundingClientRect();
      return { out, mk: mk.left };
    }, plan.l1.filas.at(-1).t + 1.5);
    let peor = null;
    for (const f of filas.out) { const holgura = filas.mk - 3 - f.x2; if (!peor || holgura < peor.h) peor = { h: holgura, ...f }; if (holgura < 6) falla(0, `rótulo de fila «${f.txt}» cruza la marca de 0,70 (termina en x=${Math.round(f.x2)}, la marca está en x=${Math.round(filas.mk)})`); }
    console.log(`  ${peor.h >= 6 ? 'ok ' : '✖  '} rótulos de fila de la lección: el más largo («${peor.txt}», ${peor.px} px) termina en x=${Math.round(peor.x2)}; la marca de 0,70 está en x=${Math.round(filas.mk)} (holgura ${Math.round(peor.h)} px)`);
  }
  // las notas de honestidad a 44 px y el rótulo de IA a 40 px (medido en el DOM)
  for (const [sel, min, que] of [['#l1-nota1', 44, 'nota 1'], ['#l1-nota2', 44, 'nota 2'], ['#rotulo .tag', 40, 'rótulo de IA']]) {
    const px = await pg.evaluate((s) => parseFloat(getComputedStyle(document.querySelector(s)).fontSize), sel);
    console.log(`  ${px >= min ? 'ok ' : '✖  '} ${que.padEnd(40)} ${px} px (mínimo ${min})`); if (px < min) falla(0, `${que}: ${px} px (< ${min})`);
  }
  // la escena 2: ninguna foto se pisa con un texto, el anillo y las fotos quedan dentro de la zona (x 80-1000) y las fotos empiezan bajo y=280
  const caja = await pg.evaluate(([t]) => {
    const tl = window.__timelines.main; tl.pause(); tl.time(t);
    const r = (s) => { const q = document.querySelector(s).getBoundingClientRect(); return [q.left, q.top, q.right, q.bottom]; };
    return { fotos: [r('#l2-ph1'), r('#l2-ph2')], ring: r('#l2-ring'), caps: [r('#l2-cap1'), r('#l2-cap2')], card: r('#c8 .card') };
  }, [plan.l2.anillo_t + 0.6]);
  const toca = (a, b) => Math.min(a[2], b[2]) - Math.max(a[0], b[0]) > 2 && Math.min(a[3], b[3]) - Math.max(a[1], b[1]) > 2;
  for (const f of caja.fotos) for (const t of [...caja.caps, caja.card]) if (toca(f, t)) falla(0, 'escena 2: un texto pisa una foto del café');
  if (toca(caja.fotos[0], caja.fotos[1])) falla(0, 'escena 2: las dos fotos se pisan');
  if (caja.ring[0] < 80 || caja.ring[2] > 1000 || caja.fotos.some((f) => f[1] < Z.arriba_minimo_y)) falla(0, 'escena 2: foto o anillo fuera de la zona segura');
  console.log(`  ok  escena 2: fotos x ${Math.round(caja.fotos[0][0])}-${Math.round(caja.fotos[1][2])}, y ${Math.round(caja.fotos[0][1])}-${Math.round(caja.fotos[0][3])}; pies hasta y=${Math.round(Math.max(...caja.caps.map((c) => c[3])))}; la tarjeta arranca en y=${Math.round(caja.card[1])}`);
}
for (const [que, got, esp, tol] of datos) {
  const ok = cerca(got, esp, tol || 1.5);
  console.log(`  ${ok ? 'ok ' : '✖  '} ${que.padEnd(40)} medido ${got.toFixed(1)}  esperado ${esp.toFixed(1)}`);
  if (!ok) falla(0, `dato fuera de lugar: ${que} (${got.toFixed(1)} vs ${esp.toFixed(1)})`);
}
await b.close();
if (malos.length) console.log('✖ incumplimientos:\n  ' + malos.join('\n  ') + (fallos > malos.length ? `\n  … ${fallos} en total` : ''));
if (fallos) { console.error(`✖ ${fallos} incumplimiento(s)`); process.exit(1); }
console.log('✔ todo el texto dentro de la zona segura, sin pisarse, ≥ 34 px, y los datos están donde dice el número');
