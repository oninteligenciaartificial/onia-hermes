#!/usr/bin/env node
// Lucía · G1 «Este video no fue grabado: así se hace, en 3 pasos» (56 s, 1080x1920, 24 fps) — montaje con HyperFrames.
// Lee plan.json (capas, tiempos, zonas) → valida las reglas de texto → escribe index.html (DOM estático + un timeline GSAP).
// 0 créditos: solo clips y fotos ya pagados (K1 e470ef4f, K2 83130c4a, K4 338b751f; fotos 4afffb96 y 3e05cfd0).
// Uso:  node scripts/build.mjs        (genera assets/k4cuadros/* con ffmpeg si faltan, valida e imprime la tabla de cortes)
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const P = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const plan = JSON.parse(fs.readFileSync(path.join(P, 'plan.json'), 'utf8'));
const { w: W, h: H, fps: FPS, duracion: DUR } = plan.lienzo;
const ACC = plan.acento;
const Z = plan.zona_segura;
const FR = 1 / FPS;
// Entrada y salida de las tarjetas con la MISMA duración y la MISMA distancia (80 px) y eases espejados (power3.out / power3.in):
// la velocidad con que sale una es la velocidad con que entra la siguiente (3·80/0,18 = 1333 px/s). 2da pasada: antes 0,15 / 0,22.
const E_IN = 0.18, E_OUT = 0.18;
const PUSH = plan.empuje.cuadros * FR;
// apagables (agregados al guion que la madre puede revertir)
plan.etiquetas = plan.etiquetas.filter((d) => d.activo !== false);
const lupa = plan.lupa && plan.lupa.activo !== false ? plan.lupa : null;

// ───────────────────────── 0) material: se copia del kit (no se duplica en git; assets/ está ignorado salvo lo generado por este script) ─────────────────────────
const R = path.resolve(P, '../..');
const KIT = path.join(R, 'hermes-content/references/modelos/lucia/v4/kit');
const FONTS = path.join(R, 'hermes-content/brand/fonts');
const COPIAS = [
  ['assets/k1.mp4', path.join(KIT, 'k1-clip-mira-camara-e470ef4f.mp4')],
  ['assets/k2.mp4', path.join(KIT, 'k2-clip-deja-cafe-83130c4a.mp4')],
  ['assets/k4.mp4', path.join(KIT, 'k4-clip-cuenta-dedos-338b751f.mp4')],
  ['assets/k1-foto.jpg', path.join(KIT, 'k1-1-recepcion-celular-4afffb96.jpg')],
  ['assets/k2-foto.jpg', path.join(KIT, 'k2-1-cafe-mostrador-3e05cfd0.jpg')],
  ['assets/fonts/BricolageGrotesque-var-latin.woff2', path.join(FONTS, 'BricolageGrotesque-var-latin.woff2')],
  ['assets/fonts/DMSans-var-latin.woff2', path.join(FONTS, 'DMSans-var-latin.woff2')],
  ['assets/fonts/SplineSansMono-var-latin.woff2', path.join(FONTS, 'SplineSansMono-var-latin.woff2')],
];
for (const [dest, src] of COPIAS) {
  const d = path.join(P, dest);
  if (fs.existsSync(d)) continue;
  if (!fs.existsSync(src)) { console.error(`✖ falta ${src}`); process.exit(1); }
  fs.mkdirSync(path.dirname(d), { recursive: true });
  fs.copyFileSync(src, d);
}
// GSAP local (el render no puede depender de la red): 3.14.2, la misma versión que fija el scaffold de HyperFrames 0.8.142
const gs = path.join(P, 'assets/vendor/gsap.min.js');
if (!fs.existsSync(gs)) {
  fs.mkdirSync(path.dirname(gs), { recursive: true });
  execFileSync('curl', ['-sSf', '-m', '60', '-o', gs, 'https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js'], { stdio: 'inherit' });
}

// ───────────────────────── 1) recortes de K4 (resolución completa, 720x1280) ─────────────────────────
fs.mkdirSync(path.join(P, 'assets/k4cuadros'), { recursive: true });
const k4 = path.join(P, 'assets/k4.mp4');
const ff = (args) => execFileSync('ffmpeg', ['-v', 'error', '-y', ...args], { stdio: 'inherit' });
for (const t of plan.placa.tiles) {
  const out = path.join(P, `assets/k4cuadros/c${t.n}.png`);
  if (!fs.existsSync(out)) ff(['-i', k4, '-vf', `select=eq(n\\,${t.n}),crop=380:420:30:850`, '-frames:v', '1', '-vsync', '0', '-update', '1', out]);
}
if (plan.lupa && plan.lupa.activo !== false) {
  // lupa de la cara: recorte de la foto NATIVA (1440x2560) que cae a x(aumento) de la pantalla en la caja de la lupa
  const L = plan.lupa, M = L.aumento, f = 1440 / W, out = path.join(P, 'assets/lupa-cara.jpg');
  const cw = Math.round(L.caja.w / M * f), ch = Math.round(L.caja.h / M * f);
  const cx = Math.round((L.centro_cara[0] - L.caja.w / M / 2) * f), cy = Math.round((L.centro_cara[1] - L.caja.h / M / 2) * f);
  if (!fs.existsSync(out)) ff(['-i', path.join(P, 'assets/k1-foto.jpg'), '-vf', `crop=${cw}:${ch}:${cx}:${cy}`, '-frames:v', '1', '-q:v', '2', '-update', '1', out]);
}
{
  const r = plan.k4.recorte_fuente, out = path.join(P, 'assets/k4cuadros/inset60.png');
  if (!fs.existsSync(out)) ff(['-i', k4, '-vf', `select=eq(n\\,${plan.k4.cuadro_foco}),crop=${r.w}:${r.h}:${r.x}:${r.y}`, '-frames:v', '1', '-vsync', '0', '-update', '1', out]);
}

// ───────────────────────── 2) reglas de texto (se corta el build si alguna falla) ─────────────────────────
const palabras = (t) => `${t.num ? t.num + ' ' : ''}${t.texto} ${t.acento || ''}`.trim().split(/\s+/).filter((s) => s && s !== '·');
const errores = [];
for (const c of plan.tarjetas) {
  const n = palabras(c).length, min = n * 0.35 + 0.3, dur = c.b - c.a;
  if (n > 6) errores.push(`${c.id}: ${n} palabras (máx 6)`);
  if (dur < min - 1e-9) errores.push(`${c.id}: dura ${dur.toFixed(2)} s y necesita ${min.toFixed(2)} s para ${n} palabras`);
  if (c.a > 0.15 + 1e-9 && c.id === 'c1') errores.push('c1: la primera tarjeta entra después de 0,15 s');
  if (c.bottom && c.bottom > Z.texto_hasta_y) errores.push(`${c.id}: el borde de abajo (${c.bottom}) pasa de y=${Z.texto_hasta_y}`);
  if (c.top && c.top < Z.arriba_minimo_y) errores.push(`${c.id}: el borde de arriba (${c.top}) queda sobre y=${Z.arriba_minimo_y}`);
  c.n_palabras = n; c.min_s = +min.toFixed(2);
}
const pn = plan.panel_orden;
const nPrompt = `${pn.frase1} ${pn.frase2_antes}${pn.marca_camara}${pn.frase2_medio}${pn.marca_luz}${pn.frase2_despues}`.split(/\s+/).length;
if (nPrompt !== 31) errores.push(`panel: el prompt literal tiene ${nPrompt} palabras (31 esperadas)`);
const lecturaMin = nPrompt * 0.35 + 0.3;
if ((pn.b - pn.a) < lecturaMin - 1e-9) errores.push('panel: no alcanza la lectura de 0,35 s por palabra + 0,3 s');
// lectura REAL: desde que terminó la cascada de entrada (+0,4 s) hasta que empieza a salir (H6: antes quedaba legible ~10,5 s y exigía 11,15 s)
const legible = plan.particion.salida_panel.a - (pn.a + 0.4);
if (legible < lecturaMin - 1e-9) errores.push(`panel: legible ${legible.toFixed(2)} s y exige ${lecturaMin.toFixed(2)} s`);
for (const m of pn.marcas) if (plan.particion.salida_panel.a - m.t < 3 - 1e-9) errores.push(`panel: la marca ${m.id} queda ${(plan.particion.salida_panel.a - m.t).toFixed(2)} s (mín 3 s)`);
for (const m of plan.medios) if (m.tipo === 'clip' && m.b - m.a > 6.04 + 1e-9) errores.push(`${m.id}: el clip dura 6,04 s y se pide ${m.b - m.a}`);
// H8: en cada cambio de tarjeta nunca más de 1 cuadro sin tarjeta → cadenas contiguas (b de una = a de la siguiente); la entrada arranca 1 cuadro antes
{
  const byId = Object.fromEntries(plan.tarjetas.map((c) => [c.id, c]));
  byId.panel = { id: 'panel', a: pn.a, b: pn.b };
  for (const cad of plan.cadenas_de_tarjetas) for (let i = 1; i < cad.length; i++) {
    if (Math.abs(byId[cad[i]].a - byId[cad[i - 1]].b) > 1e-9) errores.push(`${cad[i - 1]}→${cad[i]}: no son contiguas (${byId[cad[i - 1]].b} vs ${byId[cad[i]].a})`);
  }
}
// H3: cada empuje: lo que entra empieza 6 cuadros antes del corte; lo que sale termina en el corte
{
  const med = Object.fromEntries(plan.medios.map((m) => [m.id, m]));
  for (const c of plan.costuras) if (c.tipo === 'empuje') {
    for (const id of c.entra) if (med[id] && Math.abs(med[id].a - (c.t - PUSH)) > 1e-6) errores.push(`costura ${c.t}: «${id}» debe empezar en ${(c.t - PUSH).toFixed(3)} y empieza en ${med[id].a}`);
    for (const id of c.sale) if (med[id] && Math.abs(med[id].b - c.t) > 1e-6) errores.push(`costura ${c.t}: «${id}» debe terminar en ${c.t} y termina en ${med[id].b}`);
  }
  // C4: en las costuras con `tarjetas`, la que sale termina en T y la que entra empieza en T (contiguas, viajan juntas con el empuje)
  const tj = Object.fromEntries(plan.tarjetas.map((c) => [c.id, c]));
  for (const c of plan.costuras) if (c.tarjetas) {
    const s = tj[c.tarjetas.sale], e = tj[c.tarjetas.entra];
    if (!s || !e) { errores.push(`costura ${c.t}: tarjeta «${c.tarjetas.sale}» o «${c.tarjetas.entra}» no existe`); continue; }
    if (c.tipo !== 'empuje') errores.push(`costura ${c.t}: las tarjetas solo viajan en una costura de tipo empuje`);
    if (Math.abs(s.b - c.t) > 1e-6) errores.push(`costura ${c.t}: la tarjeta «${s.id}» debe terminar en ${c.t} y termina en ${s.b}`);
    if (Math.abs(e.a - c.t) > 1e-6) errores.push(`costura ${c.t}: la tarjeta «${e.id}» debe entrar en ${c.t} y entra en ${e.a}`);
  }
  // C5: el clip de abajo de la partida sube con el morph de la foto (no queda un tramo oscuro y vacío)
  if (Math.abs(med.k1b.a - plan.particion.morph.a) > 1e-6) errores.push(`k1b: debe arrancar con el morph (${plan.particion.morph.a}) y arranca en ${med.k1b.a}`);
  // K4: el cuadro 60 cae en t_foco (verificado con PSNR en la 1ra pasada: cuadro 60 = 2,5 s después de que arranca el clip)
  const k4 = plan.k4;
  if (Math.abs(k4.t_foco - (k4.inicio + k4.cuadro_foco / FPS)) > 1e-6) errores.push(`k4: el cuadro ${k4.cuadro_foco} cae en ${(k4.inicio + k4.cuadro_foco / FPS).toFixed(3)} y t_foco dice ${k4.t_foco}`);
  if (Math.abs(med.k4.a - k4.inicio) > 1e-6) errores.push('k4: plan.k4.inicio no coincide con el medio k4');
  if (Math.abs((med.k4.b - med.k4.a) * FPS - k4.cuadros_barra) > 1e-6) errores.push(`k4: la barra dice ${k4.cuadros_barra} cuadros y el clip usa ${(med.k4.b - med.k4.a) * FPS}`);
  const eq = plan.etiquetas.find((d) => d.id === 'eq');
  if (eq) { const t = eq.terminos_t; if (t.length !== 5 || t.some((x, i) => i && x <= t[i - 1]) || t[0] < eq.a || t[4] > eq.b - 1.0) errores.push('eq: los 5 términos deben entrar de a uno, crecientes, y el último ≥ 1 s antes de salir'); }
}
if (errores.length) { console.error('✖ reglas:\n  ' + errores.join('\n  ')); process.exit(1); }

// ───────────────────────── 3) HTML ─────────────────────────
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const f2 = (n) => +(+n).toFixed(3);
let html = '';
let track = 10;
const nextTrack = () => track++;

// medios
const kM = plan.medios.reduce((o, m) => ((o[m.id] = m), o), {});
const vid = (m, style, extra = '') => `<video id="${m.id}" src="${m.src}" data-start="${f2(m.a)}" data-duration="${f2(m.b - m.a)}" data-track-index="0" muted playsinline preload="auto" style="${style}" ${extra}></video>`;
const img = (m, style) => `<img id="${m.id}" class="clip" src="${m.src}" data-start="${f2(m.a)}" data-duration="${f2(m.b - m.a)}" data-track-index="1" style="${style}" alt="">`;
const FULL = 'position:absolute;left:0;top:0;width:1080px;height:1920px;object-fit:cover;';
html += vid(kM.k1a, FULL + 'z-index:1;') + '\n';
html += img(kM.foto1, FULL + 'z-index:2;') + '\n';
const top = plan.particion.arriba, bot = plan.particion.abajo;
const posY = ((plan.particion.ventana_fuente_y[0]) / (1920 - bot.h) * 100).toFixed(3);
html += vid(kM.k1b, `position:absolute;left:0;top:${bot.y}px;width:1080px;height:${bot.h}px;object-fit:cover;object-position:50% ${posY}%;z-index:3;`) + '\n';
html += vid(kM.k4, FULL + 'z-index:1;') + '\n';
html += img(kM.foto2, FULL + 'z-index:2;') + '\n';
html += vid(kM.k2, FULL + 'z-index:1;') + '\n';

// ── rótulo de IA (cuadro 0 → 2,4 s) y etiquetas de dato
const r = plan.rotulo;
html += `<div id="cc-rotulo" class="clip cc cc-top" data-start="${f2(r.a)}" data-duration="${f2(r.b - r.a)}" data-track-index="${nextTrack()}" style="--t:${r.top}px"><div class="cw" id="rotulo"><span class="tag"><i></i>${esc(r.texto)}</span></div></div>\n`;
for (const d of plan.etiquetas) {
  if (d.id === 'eq') {
    // cada término es su propia pastilla: no queda una pastilla vacía mientras entran de a uno (H4)
    const parts = ['1', '+', '7,5', '=', '8,5'];
    html += `<div id="cc-eq" class="clip cc cc-top" data-start="${f2(d.a)}" data-duration="${f2(d.b - d.a)}" data-track-index="${nextTrack()}" style="--t:${d.top}px"><div class="cw" id="eq"><span class="eqrow">${parts.map((p, i) => `<span class="eqp${i % 2 ? ' eqo' : ''}${i === 4 ? ' eqr' : ''}" id="eq${i}">${p}</span>`).join('')}</span></div></div>\n`;
  } else {
    html += `<div id="cc-${d.id}" class="clip cc cc-top" data-start="${f2(d.a)}" data-duration="${f2(d.b - d.a)}" data-track-index="${nextTrack()}" style="--t:${d.top}px"><div class="cw" id="${d.id}"><span class="tag tag-lg"><i></i>${esc(d.texto)}</span></div></div>\n`;
  }
}

// ── marco de la cara (S2): cuatro esquinas, "la cara primero"
{
  const [x1, y1, x2, y2] = plan.marco_cara.caja, m = plan.marco_cara;
  html += `<div id="cc-marco" class="clip" data-start="${f2(m.a)}" data-duration="${f2(m.b - m.a)}" data-track-index="${nextTrack()}" style="position:absolute;left:0;top:0;width:1080px;height:1920px;z-index:9">` +
    `<div id="marco" style="position:absolute;left:${x1}px;top:${y1}px;width:${x2 - x1}px;height:${y2 - y1}px">` +
    ['tl', 'tr', 'bl', 'br'].map((k) => `<i class="cor ${k}"></i>`).join('') + `</div></div>\n`;
}

// ── lupa de la cara (S2, H4): recorte de la foto NATIVA (1440x2560) a x1,6 de la pantalla. Sin texto.
if (lupa) {
  const L = lupa.caja;
  html += `<div id="cc-lupa" class="clip" data-start="${f2(lupa.a)}" data-duration="${f2(lupa.b - lupa.a)}" data-track-index="${nextTrack()}" style="position:absolute;left:0;top:0;width:1080px;height:1920px;z-index:9">` +
    `<div id="lupa" style="left:${L.x}px;top:${L.y}px;width:${L.w}px;height:${L.h}px"><img src="assets/lupa-cara.jpg" alt=""></div></div>\n`;
}

// ── tarjetas narrativas. H8: la entrada de cada tarjeta (salvo la 1ª de su cadena) arranca 1 cuadro ANTES, en el último cuadro de la salida
// de la anterior: nunca más de 1 cuadro sin tarjeta.
const primeras = new Set(plan.cadenas_de_tarjetas.map((c) => c[0]));
const viajaEntra = new Set(plan.costuras.filter((c) => c.tarjetas).map((c) => c.tarjetas.entra));   // C4: entran con el empuje (a − 6 cuadros, desde x +1080)
const viajaSale = new Set(plan.costuras.filter((c) => c.tarjetas).map((c) => c.tarjetas.sale));      // C4: salen con el empuje (hasta x −1080 en T)
for (const c of plan.tarjetas) c.entra = f2(c.a - (viajaEntra.has(c.id) ? PUSH : primeras.has(c.id) ? 0 : FR));
for (const c of plan.tarjetas) {
  const anch = c.top != null ? `cc-top" style="--t:${c.top}px` : `cc-bot" style="--b:${c.bottom}px`;
  const num = c.num ? `<span class="num">${esc(c.num)}</span>` : '';
  const acento = c.acento ? ` <b${c.acento_t ? ' class="late"' : ''}>${esc(c.acento)}</b>` : '';
  html += `<div id="cc-${c.id}" class="clip cc ${anch}" data-start="${c.entra}" data-duration="${f2(c.b - c.entra)}" data-track-index="${3 + (plan.tarjetas.indexOf(c) % 2)}">` +
    `<div class="cw" id="${c.id}"><i class="sh sh1"></i><i class="sh sh2"></i><div class="card${c.num ? ' card-num' : ''}"><div class="rail"></div>${num}<div class="t">${esc(c.texto)}${acento}</div></div></div></div>\n`;
}

// ── panel «Orden real» (S3). H5: la cita va corrida y literal; las marcas son SOLO color + subrayado (sin insignias dentro de la frase);
// las insignias ①②③ viven en la fila de chips de abajo.
{
  const entraPanel = f2(pn.a - FR);
  html += `<div id="cc-panel" class="clip cc cc-bot" data-start="${entraPanel}" data-duration="${f2(pn.b - pn.a + FR)}" data-track-index="${nextTrack()}" style="--b:${pn.bottom}px">` +
    `<div class="cw cw-panel" id="panel"><i class="sh sh1"></i><i class="sh sh2"></i><div class="card panel"><div class="rail"></div>` +
    `<div class="eyebrow"><i></i>${esc(pn.titulo)}</div>` +
    `<p class="pq" id="pq"><span class="mk" id="ph1">${esc(pn.frase1)}</span> <span id="phb0">${esc(pn.frase2_antes)}</span><span class="mk" id="ph2">${esc(pn.marca_camara)}</span><span id="phb1">${esc(pn.frase2_medio)}</span><span class="mk" id="ph3">${esc(pn.marca_luz)}</span><span id="phb2">${esc(pn.frase2_despues)}</span></p>` +
    `<div class="leg">${pn.marcas.map((m, i) => `<span class="lg" id="lg${i + 1}"><span class="bd">${i + 1}</span>${esc(m.etiqueta)}</span>`).join('')}</div>` +
    `</div></div></div>\n`;
  pn.entra = +entraPanel;
}

// ── placa de 8 cuadros (S5): visor grande (el cuadro que se mira) + tira de 8 miniaturas con la marca que barre.
// H1: «5 dedos» en 0, 60, 84, 96, 112 y 120; «cruza» SOLO en 72 y 104 (v4/PROCEDENCIA.jsonl línea 94). La palabra «tapada» sale.
{
  const pl = plan.placa, V = pl.visor, R = pl.tira, ro = pl.rotulos;
  const x0 = Math.round((W - (8 * R.w + 7 * R.gap)) / 2);
  pl.tiles.forEach((t, i) => { t.x = x0 + i * (R.w + R.gap); t.y = R.y; });
  const visor = pl.tiles.map((t, i) => `<div class="vf" id="vf${i}"><img src="assets/k4cuadros/c${t.n}.png" alt=""><span class="vn">cuadro ${t.n}</span><span class="vm ${t.ok ? 'ok' : 'no'}">${t.ok ? ro.ok : ro.no}</span></div>`).join('');
  const tira = pl.tiles.map((t, i) => `<div class="th" id="tile${i}" style="left:${t.x}px;top:${t.y}px;width:${R.w}px"><img src="assets/k4cuadros/c${t.n}.png" style="width:${R.w}px;height:${R.h}px" alt=""><div class="thn">${t.n}</div></div>`).join('');
  html += `<div id="plate" class="clip" data-start="${f2(kM.plate.a)}" data-duration="${f2(kM.plate.b - kM.plate.a)}" data-track-index="${nextTrack()}" style="position:absolute;left:0;top:0;width:1080px;height:1920px;z-index:4">` +
    `<div id="visor" style="left:${V.x}px;top:${V.y}px;width:${V.w}px;height:${V.h}px">${visor}</div>` + tira +
    `<div id="scan" style="left:${pl.tiles[0].x - 6}px;top:${R.y - 6}px;width:${R.w + 12}px;height:${R.h + 12}px"></div></div>\n`;
  plan._tile = { TW: R.w, TH: R.h };
}

// ── superposiciones del cuadro 60 sobre K4 (S6). H2: la etiqueta «cuadro 60» baja a la esquina inferior izquierda del recorte
// (sobre la muñeca, fuera de las cinco puntas) y el sello «5 dedos» pasa a la derecha (cuelga 74 px fuera del recorte para no pisar la etiqueta). Todo el grupo sale con el empuje de K4.
{
  const k = plan.k4, s = k.recorte_fuente, I = k.inset;
  const rx = Math.round(s.x * 1.5), ry = Math.round(s.y * 1.5), rw = Math.round(s.w * 1.5), rh = Math.round(s.h * 1.5);
  const ix = Math.round((W - I.ancho) / 2);
  html += `<div id="cc-k4" class="clip" data-start="${f2(kM.k4.a)}" data-duration="${f2(kM.k4.b - kM.k4.a)}" data-track-index="${nextTrack()}" style="position:absolute;left:0;top:0;width:1080px;height:1920px;z-index:8">` +
    `<div id="scrub" style="left:${(W - 620) / 2}px;top:452px"><div class="sbar"><div class="sfill" id="sfill"></div></div><div class="snotch" id="snotch" style="left:${(k.cuadro_foco / k.cuadros_barra * 100).toFixed(2)}%"></div></div>` +
    `<div id="origen" style="left:${rx}px;top:${ry}px;width:${rw}px;height:${Math.min(rh, H - ry - 12)}px"></div>` +
    `<div id="inset" style="left:${ix}px;top:${I.top}px;width:${I.ancho}px;height:${I.alto}px"><img src="assets/k4cuadros/inset60.png" alt=""><span class="itag">cuadro ${k.cuadro_foco}</span></div>` +
    `<div id="sello" style="right:${Math.round(W - (ix + I.ancho + 74))}px;top:${I.top + I.alto - 52 + (k.sello ? k.sello.dy : 0)}px">5 dedos</div>` +
    `</div>\n`;
}

const css = fs.readFileSync(path.join(P, 'scripts/estilos.css'), 'utf8').replaceAll('{{ACC}}', ACC);
const tlJs = fs.readFileSync(path.join(P, 'scripts/timeline.js'), 'utf8');
const existe = (id) => html.includes(`id="${id}"`);
const costuras = plan.costuras.filter((c) => c.tipo === 'empuje').map((c) => ({
  t: c.t,
  sale: [...c.sale, ...(c.tarjetas ? [c.tarjetas.sale] : [])].filter(existe),
  entra: [...c.entra, ...(c.tarjetas ? [c.tarjetas.entra] : [])].filter(existe),
}));
const PLAN_JS = {
  W, FR, PUSH, PEASE: plan.empuje.ease, E_IN, E_OUT, costuras,
  tarjetas: plan.tarjetas.map(({ id, entra, b, sin_salida, acento_t }) => ({ id, a: +entra, b, sin_salida: !!sin_salida, acento_t: acento_t || null, en_empuje_entra: viajaEntra.has(id), en_empuje_sale: viajaSale.has(id) })),
  rotulo: plan.rotulo, etiquetas: plan.etiquetas, marco: plan.marco_cara, lupa,
  panel: { a: pn.entra, b: pn.b, marcas: pn.marcas },
  part: plan.particion,
  placa: { ...plan.placa, tiles: plan.placa.tiles.map(({ n, ok, x, y }) => ({ n, ok, x, y })), ...plan._tile },
  k4: plan.k4, medios: Object.fromEntries(plan.medios.map((m) => [m.id, { a: m.a, b: m.b }])),
};
const out = `<!doctype html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=${W}, height=${H}">
<title>Lucía · G1</title>
<script src="assets/vendor/gsap.min.js"></script>
<style>
${css}
</style>
</head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-duration="${DUR}" data-width="${W}" data-height="${H}" data-fps="${FPS}">
<div id="ground"></div>
${html}</div>
<script>
window.__timelines = window.__timelines || {};
const PLAN = ${JSON.stringify(PLAN_JS)};
${tlJs}
</script>
</body>
</html>
`;
fs.writeFileSync(path.join(P, 'index.html'), out);

// ───────────────────────── 4) tabla de cortes ─────────────────────────
console.log('Tabla de cortes (t en s):');
for (const m of plan.medios) console.log(`  ${m.a.toFixed(2).padStart(6)} – ${m.b.toFixed(2).padEnd(6)} ${m.id.padEnd(6)} ${m.tipo.padEnd(5)} ${m.cuadros ? 'cuadros ' + m.cuadros : ''}  ${m.capa}`);
console.log('Costuras:');
for (const c of plan.costuras) console.log(`  ${c.t.toFixed(2).padStart(6)}  ${c.tipo}${c.sale ? '  sale ' + c.sale.join(',') + ' → entra ' + c.entra.join(',') : ''}`);
console.log('Tarjetas (entra = 1 cuadro antes de a, salvo la 1ª de cada cadena; las que viajan con un empuje entran y salen con él):');
for (const c of plan.tarjetas) console.log(`  ${c.a.toFixed(2).padStart(6)} – ${c.b.toFixed(2).padEnd(6)} ${c.id.padEnd(3)} ${String(c.n_palabras).padStart(1)} pal (mín ${c.min_s} s) «${(c.num ? c.num + ' · ' : '') + c.texto + (c.acento ? ' ' + c.acento : '')}»${viajaEntra.has(c.id) ? ' [entra con el empuje]' : ''}${viajaSale.has(c.id) ? ' [sale con el empuje]' : ''}`);
console.log(`Panel «Orden real»: ${pn.a} – ${pn.b} s (${(pn.b - pn.a).toFixed(1)} s en total, ${legible.toFixed(2)} s legibles; exige ${lecturaMin.toFixed(2)} s)`);
console.log('Agregados al guion (reversibles, ver plan.json):', plan.agregados_al_guion.map((a) => a.id).join(', '));
console.log(`ok: index.html (${Math.round(out.length / 1024)} KB)`);
