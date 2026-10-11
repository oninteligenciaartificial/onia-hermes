#!/usr/bin/env node
// Lucía · G4 v2 «Seis motores de imagen, una cara: ¿cuál la conserva?» (~28 s, 1080x1920, 24 fps; motores nombrados desde D-N1, 11-oct) — re-corte de G4 con HyperFrames (11-oct-2026).
// Lee plan.json + guion-voz.txt → valida reglas de texto, el cronograma de la voz, costuras Y LOS NÚMEROS contra v4/PROCEDENCIA.jsonl → escribe index.html
// (DOM estático + un único timeline GSAP). 0 créditos: fotos ya pagadas el 8-oct + 8 referencias oficiales. Sin clips: fotos fijas con empuje lento (1,00 → 1,04).
// Método y trampas: .claude/skills/lucia/montaje-hyperframes.md. Plantilla: videos/lucia-g4/ (59,75 s).
// Uso:  node scripts/build.mjs   (copia el material, genera derivados con ffmpeg si faltan, valida e imprime la tabla de cortes y el cronograma de la voz)
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const P = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const plan = JSON.parse(fs.readFileSync(path.join(P, 'plan.json'), 'utf8'));
const { w: W, h: H, fps: FPS, frames: NF } = plan.lienzo;
const DUR = NF / FPS;
const ACC = plan.acento, BAD = plan.alerta;
const Z = plan.zona_segura;
const FR = 1 / FPS;
const E_IN = 0.18, E_OUT = 0.18;               // entrada y salida de las tarjetas: misma duración y distancia (80 px), eases espejados
const PUSH = plan.empuje.cuadros * FR;
const SC = plan.escala;
const AIRE = plan.aire;
const X = (v) => Math.round(SC.x0 + v * (SC.x1 - SC.x0));       // valor 0-1 → x del lienzo (los puntos salen de los datos, nunca a mano)
const r2 = (v) => Math.round(v * 100 + 1e-7) / 100;             // 2 decimales, media hacia arriba (0,805 → 0,81; 0,785 → 0,79)
const f2 = (n) => +(+n).toFixed(3);
const fm = (v) => v.toFixed(2).replace('.', ',');
const crs = (v) => String(v).replace('.', ',');
const lectura = (n) => n * AIRE.lectura_s_por_palabra + AIRE.lectura_base_s;     // 0,35 s por palabra + 0,3 s
const nw = (t) => String(t).replace(/<[^>]+>/g, ' ').split(/\s+/).filter((x) => x && !/^[·→—]$/.test(x)).length;

// ───────────────────────── 0) material ─────────────────────────
const R = path.resolve(P, '../..');
const V4 = path.join(R, 'hermes-content/references/modelos/lucia/v4');
const FONTS = path.join(R, 'hermes-content/brand/fonts');
const COPIAS = [
  ...Object.values(plan.fotos).map((f) => [f.src, path.join(R, f.origen)]),
  ['assets/fonts/BricolageGrotesque-var-latin.woff2', path.join(FONTS, 'BricolageGrotesque-var-latin.woff2')],
  ['assets/fonts/DMSans-var-latin.woff2', path.join(FONTS, 'DMSans-var-latin.woff2')],
  ['assets/fonts/SplineSansMono-var-latin.woff2', path.join(FONTS, 'SplineSansMono-var-latin.woff2')],
];
// copia solo si falta o si CAMBIÓ el contenido (C y E son las fotos «limpias»: «copiar si falta» dejaría la vieja)
const mismo = (a, b) => fs.existsSync(a) && fs.existsSync(b) && fs.statSync(a).size === fs.statSync(b).size && fs.readFileSync(a).equals(fs.readFileSync(b));
for (const [dest, src] of COPIAS) {
  const d = path.join(P, dest);
  if (!fs.existsSync(src)) { if (fs.existsSync(d)) continue; console.error(`✖ falta ${src}`); process.exit(1); }
  if (mismo(d, src)) continue;
  fs.mkdirSync(path.dirname(d), { recursive: true });
  fs.copyFileSync(src, d);
}
const curl = (url, out) => execFileSync('curl', ['-sSf', '-m', '120', '-o', out, url], { stdio: 'inherit' });
const gs = path.join(P, 'assets/vendor/gsap.min.js');      // GSAP local (el render no puede depender de la red): 3.14.2, la versión del scaffold de HyperFrames 0.8.142; viene versionado en assets-fijos/
if (!fs.existsSync(gs)) {
  fs.mkdirSync(path.dirname(gs), { recursive: true });
  const fijo = path.join(P, 'assets-fijos/vendor/gsap.min.js');
  const ya = [fijo, ...['lucia-g4', 'lucia-g2', 'lucia-g3', 'lucia-g1'].map((g) => path.join(R, `videos/${g}/assets/vendor/gsap.min.js`))].find((f) => fs.existsSync(f));
  if (ya) fs.copyFileSync(ya, gs); else curl('https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js', gs);
}
const ff = (args) => execFileSync('ffmpeg', ['-v', 'error', '-y', ...args], { stdio: 'inherit' });
const A = (n) => path.join(P, 'assets', n);

// 8 referencias oficiales: los recortes de 360x360 están VERSIONADOS en assets-fijos/ (con su origen en ORIGEN.md); solo si faltan se bajan de CloudFront (0 cr) y se recortan
const manifest = JSON.parse(fs.readFileSync(path.join(R, plan.refs.manifest), 'utf8'));
const refNames = Object.keys(manifest.refs);
fs.mkdirSync(A('refs-orig'), { recursive: true });
for (const m of plan.refs.recortes) {
  const out = A(`${m.id}.jpg`), fijo = path.join(P, plan.refs.fijos, `${m.id}.jpg`);
  if (fs.existsSync(fijo)) { if (!mismo(out, fijo)) fs.copyFileSync(fijo, out); continue; }
  if (fs.existsSync(out)) continue;
  const key = refNames.find((k) => k.startsWith(m.fuente.split('_')[0] + '_'));
  const url = manifest.refs[key];
  const orig = A(`refs-orig/${key}${path.extname(url)}`);
  if (!fs.existsSync(orig)) curl(url, orig);
  const [ox, oy, s_] = m.recorte;
  ff(['-i', orig, '-vf', `crop=${s_}:${s_}:${ox}:${oy},scale=360:360:flags=lanczos`, '-frames:v', '1', '-q:v', '2', '-update', '1', out]);
}
// derivados (miniaturas y fotos de la escena 2): se regeneran si faltan o si su fuente es más nueva. ⚠️ Al cambiar una medida en plan.json se BORRA el derivado antes de reconstruir.
const viejo = (out, src) => !fs.existsSync(out) || fs.statSync(out).mtimeMs < fs.statSync(src).mtimeMs;
const th = plan.gancho.miniaturas;
for (const id of th.ids) {
  const out = A(`th-${id}.jpg`), src = A(`ph-${id}.jpg`);
  if (viejo(out, src)) ff(['-i', src, '-vf', `scale=${th.w * 2}:${th.h * 2}:force_original_aspect_ratio=increase:flags=lanczos,crop=${th.w * 2}:${th.h * 2}`, '-frames:v', '1', '-q:v', '2', '-update', '1', out]);
}
for (const f of plan.l2.fotos.lista) {
  const out = A(`cf-${f.foto}.jpg`), src = A(path.basename(plan.fotos[f.foto].src));
  if (viejo(out, src)) ff(['-i', src, '-vf', `scale=${plan.l2.fotos.w * 2}:${plan.l2.fotos.h * 2}:force_original_aspect_ratio=increase:flags=lanczos,crop=${plan.l2.fotos.w * 2}:${plan.l2.fotos.h * 2}`, '-frames:v', '1', '-q:v', '2', '-update', '1', out]);
}

// ───────────────────────── 1) reglas (se corta el build si alguna falla) ─────────────────────────
const errores = [];
const med = Object.fromEntries(plan.medios.map((m) => [m.id, m]));
const tj = Object.fromEntries(plan.tarjetas.map((c) => [c.id, c]));
const img = Object.fromEntries(plan.imagenes.map((m) => [m.id, m]));
const near = (a, b, tol = 1e-4) => Math.abs(a - b) <= tol;

// 1a) la voz: guion-voz.txt = UNA línea por tramo, ≤ 450 caracteres (con espacios y saltos), cada tramo dura palabras / 3,6 s, huecos de 0,25 s. NO se genera audio.
const vozTxt = fs.readFileSync(path.join(P, plan.voz.archivo), 'utf8').replace(/\n$/, '');
const lineas = vozTxt.split('\n');
const nCar = [...vozTxt].length;
if (nCar > plan.voz.max_caracteres) errores.push(`guion-voz.txt: ${nCar} caracteres (máx ${plan.voz.max_caracteres}, contando los saltos de línea)`);
if (lineas.some((l) => !l.trim())) errores.push('guion-voz.txt: hay una línea vacía');
const tramos = [];
{
  let t = plan.voz.inicio;
  lineas.forEach((l, i) => {
    const n = nw(l), d = n / plan.voz.palabras_por_s;
    tramos.push({ i: i + 1, texto: l, palabras: n, caracteres: [...l].length, ini: t, fin: t + d });
    t += d + plan.voz.hueco;
  });
}
const hMax = Math.max(...tramos.slice(1).map((s, i) => s.ini - tramos[i].fin));
if (hMax > plan.voz.hueco + 1e-9) errores.push(`huecos de voz de ${hMax.toFixed(3)} s (máx ${plan.voz.hueco})`);
// cada costura cae en el inicio del tramo que dice el plan (a ± medio cuadro); el video dura lo que la voz + una cola corta
for (const c of plan.costuras) {
  const s = tramos[c.seg - 1];
  if (!s) { errores.push(`costura ${c.t}: el tramo ${c.seg} no existe`); continue; }
  if (Math.abs(s.ini * FPS - c.t * FPS) > 0.5 + 1e-6) errores.push(`costura ${c.t}: el tramo ${c.seg} de la voz empieza en ${s.ini.toFixed(3)} s (${(s.ini * FPS).toFixed(2)} cuadros) y la costura en el cuadro ${(c.t * FPS).toFixed(2)}`);
}
const colaCTA = DUR - plan.costuras.at(-1).t;
if (colaCTA < plan.voz.cta_min_s - 1e-6 || colaCTA > plan.voz.cta_max_s + 1e-6) errores.push(`el cierre dura ${colaCTA.toFixed(3)} s y el CTA tiene que estar entre ${plan.voz.cta_min_s} y ${plan.voz.cta_max_s} s`);
if (DUR < 26 - 1e-9 || DUR > 30 + 1e-9) errores.push(`el video dura ${DUR.toFixed(3)} s (tiene que estar entre 26 y 30 s)`);
const colaVoz = DUR - tramos.at(-1).fin;
if (colaVoz < 0 || colaVoz > 1.2) errores.push(`el video termina ${colaVoz.toFixed(2)} s después de la última palabra (0 a 1,2 s)`);

// 1b) tarjetas: ≤ 6 palabras, ≥ 0,35 s por palabra + 0,3 s (+0,1 s de margen: la salida cuenta), acento dentro de la vida de la tarjeta
for (const c of plan.tarjetas) {
  const n = nw(`${c.texto} ${c.acento || ''}`), min = lectura(n), dur = c.b - c.a;
  if (n > 6) errores.push(`${c.id}: ${n} palabras (máx 6: el tope del guion, sin excepciones)`);
  if (dur < min + 0.1 - 1e-6) errores.push(`${c.id}: dura ${dur.toFixed(2)} s y necesita ${min.toFixed(2)} s para ${n} palabras (+0,1 s de margen: el último instante es la salida)`);
  if (c.id === 'c1' && c.a > 0.15 + 1e-9) errores.push('c1: la primera tarjeta entra después de 0,15 s');
  if (c.acento_t != null && (c.acento_t < c.a + 0.5 - 1e-9 || c.acento_t > c.b - 0.5 + 1e-9)) errores.push(`${c.id}: acento_t ${c.acento_t} fuera de [a+0,5, b-0,5]`);
  c.n_palabras = n; c.min_s = +min.toFixed(2);
}
if (!near(med['f-cierre'].b, DUR)) errores.push(`el cierre termina en ${med['f-cierre'].b} y el video dura ${DUR}`);
// cadena de tarjetas: contiguas (b de una = a de la siguiente)
for (const cad of plan.cadenas_de_tarjetas) for (let i = 1; i < cad.length; i++) {
  if (!near(tj[cad[i]].a, tj[cad[i - 1]].b)) errores.push(`${cad[i - 1]}→${cad[i]}: no son contiguas (${tj[cad[i - 1]].b} vs ${tj[cad[i]].a})`);
}
// costuras: el medio entrante arranca en T−6 cuadros; el saliente termina exactamente en T (son fotos y placas: no hay clips)
for (const c of plan.costuras) if (c.tipo === 'empuje') {
  for (const id of c.entra) if (med[id] && !near(med[id].a, c.t - PUSH)) errores.push(`costura ${c.t}: «${id}» debe empezar en ${(c.t - PUSH).toFixed(3)} y empieza en ${med[id].a}`);
  for (const id of c.sale) if (med[id] && !near(med[id].b, c.t)) errores.push(`costura ${c.t}: «${id}» debe terminar en ${c.t} y termina en ${med[id].b}`);
  if (c.tarjetas) {
    const s = c.tarjetas.sale ? tj[c.tarjetas.sale] : null, e = c.tarjetas.entra ? tj[c.tarjetas.entra] : null;
    if ((c.tarjetas.sale && !s) || (c.tarjetas.entra && !e)) { errores.push(`costura ${c.t}: tarjeta «${c.tarjetas.sale}» o «${c.tarjetas.entra}» no existe`); continue; }
    if (s && !near(s.b, c.t)) errores.push(`costura ${c.t}: la tarjeta «${s.id}» debe terminar en ${c.t} y termina en ${s.b}`);
    if (e && !near(e.a, c.t)) errores.push(`costura ${c.t}: la tarjeta «${e.id}» debe entrar en ${c.t} y entra en ${e.a}`);
  }
}
// D-N1 (11-oct-2026): los motores van con su NOMBRE REAL (uso propio, no recomendación pagada). El nombre de pantalla coincide con la clave de PROCEDENCIA.jsonl.
const NOMBRES = { a: 'Seedream 4.5', b: 'Kling O1 Image', c: 'Nano Banana 2.1', d: 'Seedream 5.0 Pro', e: 'FLUX 3', f: 'GPT Image 2.5' };
const SLUG = { a: 'seedream_4_5', b: 'kling', c: 'nano_banana_2_1', d: 'seedream_v5_pro', e: 'flux_3', f: 'gpt_image_2_5' };
for (const m of plan.imagenes) {
  if (m.nombre !== NOMBRES[m.id]) errores.push(`motor ${m.id}: se llama «${m.nombre}» y tiene que llamarse «${NOMBRES[m.id]}»`);
  if (!String(plan.claves_procedencia[m.id]).startsWith(SLUG[m.id])) errores.push(`motor ${m.id}: la clave de PROCEDENCIA «${plan.claves_procedencia[m.id]}» no es de «${NOMBRES[m.id]}»`);
}
for (const f of plan.l2.fotos.lista) if (f.nombre !== NOMBRES[f.letra.toLowerCase()]) errores.push(`foto ${f.foto}: se llama «${f.nombre}» y tiene que llamarse «${NOMBRES[f.letra.toLowerCase()]}»`);
// cada imagen con escena propia: su foto empieza en T−6 cuadros y termina donde termina su tarjeta; la tarjeta dice la letra y el costo de esa imagen
const conEscena = plan.imagenes.filter((m) => m.tarjeta);
if (conEscena.map((m) => m.letra).join() !== 'A,D,E') errores.push('las escenas de motor son Seedream 4.5, Seedream 5.0 Pro y FLUX 3 (el contraste esencial: el que sostiene, el que cae justo en el piso, el más caro bajo el piso)');
for (const m of conEscena) {
  const c = tj[m.tarjeta], fm_ = med[`f-${m.id}`];
  if (!c || !fm_) { errores.push(`falta la escena de la imagen ${m.id}`); continue; }
  if (c.imagen !== m.id) errores.push(`${c.id}: debería ser de la imagen ${m.id}`);
  if (!near(fm_.a, c.a - PUSH) || !near(fm_.b, c.b)) errores.push(`imagen ${m.id}: la foto (${fm_.a}-${fm_.b}) no coincide con su tarjeta (${c.a}-${c.b})`);
  if (c.texto !== `${m.nombre} ·`) errores.push(`${c.id}: la tarjeta dice «${c.texto}» y tiene que decir «${m.nombre} ·»`);
  if (c.acento !== `${crs(m.cr)} ${m.cr === 1 ? 'crédito' : 'créditos'}`) errores.push(`${c.id}: «${c.acento}» no es el costo de la imagen ${m.id} (${m.cr})`);
}
// los números salen de PROCEDENCIA.jsonl (última línea «resultados»): parecido y créditos de cada imagen
const claim = [];
let proc = null;
{
  const lines = fs.readFileSync(path.join(V4, 'PROCEDENCIA.jsonl'), 'utf8').split('\n').filter(Boolean).map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
  const res = lines.filter((l) => /resultados$/.test(l.type || '')).at(-1);
  if (!res) errores.push('PROCEDENCIA.jsonl: no hay línea «resultados»');
  else {
    const v = res.imagen_misma_escena_K1_mismas_6_refs;
    const get = (k) => { const d = v[plan.claves_procedencia[k]]; if (!d) errores.push(`«${k}»: «${plan.claves_procedencia[k]}» no está en PROCEDENCIA.jsonl`); return d; };
    proc = Object.fromEntries(Object.keys(plan.claves_procedencia).map((k) => [k, get(k)]));
    for (const m of plan.imagenes) {
      const d = proc[m.id]; if (!d) continue;
      if (r2(d.id) !== m.valor) errores.push(`${m.id}: parecido ${m.valor} y PROCEDENCIA dice ${d.id} → ${r2(d.id)}`);
      if (d.cr !== m.cr) errores.push(`${m.id}: ${m.cr} créditos y PROCEDENCIA dice ${d.cr}`);
      m._raw = d.id;
      const est = d.id >= 0.71 ? 'ok' : d.id >= 0.70 ? 'justo' : 'bajo';
      if (est !== m.estado) errores.push(`${m.id}: estado «${m.estado}» y ${d.id} es «${est}» (ok ≥ 0,71 · justo 0,70-0,71 · bajo < 0,70)`);
      if (!!m.sello !== (m.id === 'e')) errores.push(`${m.id}: el sello «bajo el piso» va solo en la imagen E (la más cara)`);
      if (m.sello && (m.estado !== 'bajo' || m.sello.texto !== 'bajo el piso')) errores.push(`${m.id}: el sello «bajo el piso» va solo en las que están bajo el piso`);
      if (m.pastilla && (m.estado !== 'justo' || m.pastilla.texto !== 'justo en el piso')) errores.push(`${m.id}: la pastilla «justo en el piso» va solo en la que cae justo`);
      if (m.estado === 'justo' && !m.pastilla) errores.push(`${m.id}: cae justo en el piso y no lo dice`);
    }
    for (const f of plan.l2.fotos.lista) { const d = proc[f.clave]; if (d && r2(d.id) !== f.valor) errores.push(`foto ${f.foto}: ${f.valor} y PROCEDENCIA dice ${d.id}`); }
    if (!errores.length) {
      // lo que el video AFIRMA, contra los datos (si una afirmación falla, el build se corta)
      const raw = (k) => proc[k].id;
      const ok = (cond, texto) => { claim.push(`${cond ? 'ok ' : '✖  '} ${texto}`); if (!cond) errores.push(`afirmación falsa: ${texto}`); };
      const masCaro = plan.imagenes.reduce((a, b) => (b.cr > a.cr ? b : a)), masBarato = plan.imagenes.reduce((a, b) => (b.cr < a.cr ? b : a));
      ok(masCaro.letra === 'E' && raw('e') < raw('a') && raw('e') < raw('b'), `«Pagar más no mejoró el parecido»: el más caro (${masCaro.nombre}, ${masCaro.cr} cr, ${raw('e')}) queda bajo el de 1 cr (${raw('a')}) y el de 0,5 cr (${raw('b')})`);
      ok(plan.imagenes.filter((m) => m.cr > 1).every((m) => m._raw < raw('a')), `ninguno de los que cuestan más que Seedream 4.5 (1 cr) mejora su parecido (${raw('a')})`);
      ok(raw('a') >= SC.piso, `«Seedream, con un crédito, la sostiene»: Seedream 4.5 (1 cr) da ${raw('a')} (≥ ${SC.piso})`);
      ok(raw('d') >= SC.piso && raw('d') < 0.71, `«Seedream Pro… justo en el piso»: Seedream 5.0 Pro (2,5 cr) da ${raw('d')} (entre ${SC.piso} y 0,71)`);
      ok(raw('e') < SC.piso, `«FLUX, el más caro, bajo el piso»: FLUX 3 (3 cr, el más caro) da ${raw('e')} (< ${SC.piso})`);
      ok(raw('f') < SC.piso && r2(raw('f')) === plan.l1.ruido.desde && r2(raw('d')) === plan.l1.ruido.hasta && raw('e') > raw('f') && raw('e') < raw('d'), `franja de ruido 0,66-0,70: GPT Image 2.5 ${raw('f')} · FLUX 3 ${raw('e')} · Seedream 5.0 Pro ${raw('d')} caen adentro (la franja va de ${plan.l1.ruido.desde} a ${plan.l1.ruido.hasta})`);
      ok(masBarato.letra === 'B', `Kling O1 Image es el más barato (${masBarato.cr} cr)`);
      ok(raw('a_cafe2') >= SC.piso && raw('b_cafe2') < SC.piso, `«Escena 2: Kling perdió la cara»: en la escena 2 Seedream 4.5 da ${raw('a_cafe2')} y Kling O1 Image ${raw('b_cafe2')}`);
      ok(plan.l2.fotos.lista.map((f) => f.valor).join() === '0.83,0.35', 'las fotos de la escena 2: Seedream 4.5 0,83 contra Kling O1 Image 0,35');
      ok(plan.imagenes.length === 6 && new Set(plan.imagenes.map((m) => m.id)).size === 6, 'seis motores distintos con su nombre real');
    }
  }
}
if (refNames.length !== plan.refs.total || plan.refs.recortes.length !== plan.refs.total) errores.push(`el manifiesto trae ${refNames.length} referencias, el plan ${plan.refs.recortes.length} recortes y la tarjeta dice ${plan.refs.total}`);
if (plan.tarjetas.find((c) => c.id === 'c3').texto.split(' ')[1] !== String(plan.refs.total)) errores.push('c3 tiene que decir el número de referencias del plan');
// caras medidas (SCRFD): el origen del empuje lento sale de ahí
const caras = JSON.parse(fs.readFileSync(path.join(P, 'qa/caras-fotos.json'), 'utf8')).fotos;
for (const k of Object.keys(plan.fotos)) if (!caras[k] || !caras[k].caja) errores.push(`sin caja de cara para la foto «${k}» (correr scripts/medir-caras.py)`);
const orden = [...plan.l1.filas].map((f) => img[f.img].cr);
if (orden.some((c, i) => i && c < orden[i - 1])) errores.push('l1: las filas no están ordenadas por precio (de menor a mayor)');
if (new Set(plan.l1.filas.map((f) => f.img)).size !== 6) errores.push('l1: tienen que estar las 6 imágenes');

// 1c) lo obligatorio y lo prohibido en pantalla (frases exactas)
const textoCarta = (id) => `${tj[id].texto.replace(/\n$/, '')} ${tj[id].acento || ''}`.replace(/\s+/g, ' ').trim();
{
  const exacto = (que, obtenido, esperado) => { if (obtenido !== esperado) errores.push(`${que}: «${obtenido}» y tiene que decir «${esperado}»`); };
  exacto('rótulo', plan.rotulo.texto, 'Lucía Antelo · personaje IA de Onia');
  if (plan.rotulo.a !== 0 || !near(plan.rotulo.b, 3.0)) errores.push(`el rótulo tiene que ir del cuadro 0 a los 3,0 s (va de ${plan.rotulo.a} a ${plan.rotulo.b})`);
  exacto('CTA', textoCarta('c9'), 'Seguime: cada semana, una prueba.');
  exacto('lección', textoCarta('c7'), 'Pagar más no mejoró el parecido.');
  exacto('escena 2', textoCarta('c8'), 'Escena 2: Kling perdió la cara.');
  exacto('gancho', textoCarta('c1'), '¿Cuál conserva su cara?');
  exacto('nota 1', plan.l1.nota1.texto, 'Una toma cada uno: es una prueba, no una regla.');
  exacto('nota 2', plan.l1.nota2.texto, 'Entre 0,66 y 0,70 la diferencia es ruido (±0,03).');
  const css0 = fs.readFileSync(path.join(P, 'scripts/estilos.css'), 'utf8');
  if (!/\.note\{[^}]*font-size:44px/.test(css0)) errores.push('las notas de honestidad van a 44 px (estilos.css .note)');
  if (!/\.tag\.tag-r\{[^}]*font-size:40px/.test(css0)) errores.push('el rótulo de IA va a 40 px (estilos.css .tag.tag-r)');
  const todas = JSON.stringify(plan.tarjetas) + JSON.stringify(plan.l1) + JSON.stringify(plan.l2) + JSON.stringify(plan.rotulo);
  for (const x of ['El café', 'café:', 'Motor ', 'Omni', 'Higgsfield', 'Midjourney', 'ChatGPT', 'Claude']) if (todas.includes(x)) errores.push(`texto retirado o marca no autorizada en el plan: «${x}»`);
  if (/Imagen [A-F]\b/.test(todas)) errores.push('queda una «Imagen A-F» en el plan: desde D-N1 los motores van con su nombre');
}

// 1d) pie.txt: abre con «personaje hecho con IA», lleva la nota de honestidad y no afirma nada que el video no diga
{
  const pp = path.join(P, 'pie.txt');
  if (!fs.existsSync(pp)) errores.push('falta pie.txt');
  else {
    const pie = fs.readFileSync(pp, 'utf8').trim();
    if (!/^personaje hecho con ia\b/i.test(pie)) errores.push('pie.txt tiene que abrir con «personaje hecho con IA»');
    if (!pie.includes(plan.l1.nota1.texto)) errores.push('pie.txt tiene que traer la nota «Una toma cada uno: es una prueba, no una regla.»');
    if (!/pagar más no mejoró el parecido/i.test(pie)) errores.push('pie.txt tiene que decir «pagar más no mejoró el parecido» (igual que el video)');
    if (!pie.includes('Cada semana hago una prueba. Seguime.')) errores.push('pie.txt tiene que cerrar con el CTA («Cada semana hago una prueba. Seguime.»)');
    if (!pie.includes('Nombro lo que uso; no es una recomendación pagada.')) errores.push('pie.txt tiene que decir «Nombro lo que uso; no es una recomendación pagada.» (D-N1)');
    for (const n of Object.values(NOMBRES)) if (!pie.includes(n)) errores.push(`pie.txt no nombra a «${n}»`);
    if (/\b(el|la|lo|los|las|es) mejor(es)?\b|recomiend|imagen [a-f]\b/i.test(pie)) errores.push('pie.txt suena a «el mejor» o a recomendación, o dice «Imagen A-F»');
    for (const x of ['tres escenas', 'una de tres']) if (pie.includes(x)) errores.push(`pie.txt dice «${x}», que el video v2 ya no muestra tal cual`);
    const pantalla = JSON.stringify(plan.tarjetas) + JSON.stringify(plan.imagenes) + JSON.stringify(plan.l1) + JSON.stringify(plan.l2);
    for (const num of pie.replace(/#\S+/g, '').match(/\d+(?:,\d+)?/g) || []) {
      const alt = num.replace(',', '.');
      if (!pantalla.includes(num) && !pantalla.includes(alt) && !pantalla.includes(`"${alt}"`)) errores.push(`pie.txt dice «${num}» y no está en pantalla`);
    }
  }
}

// ── tiempo de lectura de TODO texto que no es una tarjeta: ≥ 0,35 s por palabra + 0,3 s, medido de que termina de entrar a que empieza a salir
//    (la métrica del revisor; ventanas.mjs lo mide después en el DOM cuadro a cuadro). Se cuenta con este script, no a ojo. ──
const lecturas = [];
{
  const L = (que, texto, a, b) => lecturas.push({ que, texto, n: nw(texto), a, b, dur: b - a, min: lectura(nw(texto)) });
  const rg = plan.regla, es = rg.escala, l1 = plan.l1, l2 = plan.l2;
  const fin = (id) => med[id].b - 0.18;                                // la placa o la foto viaja: legible hasta que el empuje la saca (≥ 95 % adentro hasta T − 0,18 s)
  L('rótulo de IA', plan.rotulo.texto, plan.rotulo.a, plan.rotulo.b);
  for (const m of conEscena) {
    L(`${m.letra} dato`, `parecido ${fm(m.valor)}`, m.tag_t + E_IN, fin(`f-${m.id}`));
    if (m.sello) L(`${m.letra} sello`, m.sello.texto, m.sello.t + 3 * FR, fin(`f-${m.id}`));
    if (m.pastilla) L(`${m.letra} pastilla`, m.pastilla.texto, m.pastilla.t + E_IN, fin(`f-${m.id}`));
  }
  L('regla «mi piso»', `mi piso · ${fm(SC.piso)}`, es.marca_t + 0.05 + E_IN, fin('pl-regla'));
  L('regla «idéntica · 1»', 'idéntica · 1', es.ax_t + 0.25, fin('pl-regla'));
  const T1 = tj.c7.a, leg0 = T1 - 0.05;                              // lo que viaja con la placa se lee desde que llega (en T la placa está en reposo)
  L('l1 «mi piso»', `mi piso · ${fm(SC.piso)}`, leg0, fin('pl-l1'));
  L('l1 nota 1', l1.nota1.texto, leg0, fin('pl-l1'));
  L('l1 nota 2', l1.nota2.texto, l1.nota2.t + E_IN, fin('pl-l1'));
  // las dos notas se leen UNA DESPUÉS DE LA OTRA: la 2 entra cuando la 1 ya tuvo su tiempo de lectura (no son 19 palabras juntas en 3,8 s)
  const need1 = lectura(nw(l1.nota1.texto));
  if (l1.nota2.t + E_IN < leg0 + need1 - 1e-9) errores.push(`l1: la nota 2 (legible a ${(l1.nota2.t + E_IN).toFixed(2)}) entra antes de que la nota 1 termine de leerse (${(leg0 + need1).toFixed(2)})`);
  for (const f of l1.filas) {
    const m = img[f.img];
    L(`l1 fila ${m.letra}`, `${m.nombre} · ${crs(m.cr)} ${m.cr === 1 ? 'crédito' : 'créditos'}`, f.t + 0.25, fin('pl-l1'));
    L(`l1 valor ${m.letra}`, fm(m.valor), f.t + 0.2 + 0.2, fin('pl-l1'));
  }
  const ru = l1.ruido; if (ru.desde !== 0.66 || ru.hasta !== 0.7) errores.push('l1.ruido: la franja es de 0,66 a 0,70 (lo que dice la nota 2)');
  for (const [i, f] of l2.fotos.lista.entries()) L(`l2 pie foto ${f.nombre}`, `${f.nombre} ${fm(f.valor)}`, f.cap_t == null ? med['pl-l2'].a + PUSH - 0.05 : f.cap_t + 0.2, fin('pl-l2'));
  for (const x of lecturas) if (x.dur < x.min - 1e-9) errores.push(`lectura «${x.que}» (${x.n} palabras): ${x.dur.toFixed(2)} s y pide ${x.min.toFixed(2)} s`);
}
// qué ve la voz mientras tanto: cada tarjeta que NO es de su tramo (para el README)
if (errores.length) { console.error('✖ reglas:\n  ' + errores.join('\n  ')); process.exit(1); }

// ───────────────────────── 2) HTML ─────────────────────────
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
let html = '';
let track = 40;
const nextTrack = () => track++;
const FULLDIV = (id, a, b, z, inner, cls = '') => `<div id="${id}" class="clip ${cls}" data-start="${f2(a)}" data-duration="${f2(b - a)}" data-track-index="${nextTrack()}" style="position:absolute;left:0;top:0;width:1080px;height:1920px;z-index:${z}">${inner}</div>\n`;
// elemento centrado en cx sin tocar transform (GSAP lo pisaría): contenedor flex de ancho fijo
const cent = (cx, top, inner, w = 760) => `<div class="ab" style="left:${Math.round(cx - w / 2)}px;top:${top}px;width:${w}px;display:flex;justify-content:center">${inner}</div>`;
const cls = (m) => (m.estado === 'bajo' ? ' bajo' : m.estado === 'justo' ? ' ne' : '');

// fotos: contenedor .clip a lienzo completo con overflow:hidden (el empuje rígido anima el contenedor; el empuje lento anima la <img>)
const fotosPlan = [];
for (const m of plan.medios) if (m.tipo === 'foto') {
  const f = plan.fotos[m.foto], c = caras[m.foto].caja, ox = Math.round((c[0] + c[2]) / 2), oy = Math.round((c[1] + c[3]) / 2);
  fotosPlan.push({ id: m.id, a: m.a, b: m.b, ox, oy, foto: m.foto });
  html += `<div id="${m.id}" class="clip ph" data-start="${f2(m.a)}" data-duration="${f2(m.b - m.a)}" data-track-index="${m.track}" style="z-index:1"><img id="${m.id}-i" src="${f.src}" data-layout-allow-overflow alt=""></div>\n`;
}

// rótulo de IA (cuadro 0 → 3,0 s, a 40 px)
{
  const r = plan.rotulo;
  html += `<div id="cc-rotulo" class="clip cc cc-top" data-start="${f2(r.a)}" data-duration="${f2(r.b + E_OUT - r.a)}" data-track-index="${nextTrack()}" style="--t:${r.top}px"><div class="cw" id="rotulo"><span class="tag tag-r"><i></i>${esc(r.texto)}</span></div></div>\n`;
}

// gancho: 6 miniaturas de las fotos A a F (viajan con la foto en el primer empuje)
{
  const g = plan.gancho.miniaturas;
  const items = g.ids.map((id, i) => `<div class="th" id="th-${id}" style="left:${g.x0 + i * (g.w + g.gap)}px;top:${g.y}px;width:${g.w}px;height:${g.h}px"><img src="assets/th-${id}.jpg" alt=""></div>`).join('');
  html += FULLDIV('thumbs', g.a - 0.1, med['f-gancho'].b, 8, items);
}

// ── placa de la regla: las 8 referencias (4x2) + escala 0-1 con la marca en 0,70 ──
{
  const rg = plan.regla, rf = rg.refs, es = rg.escala, y = es.y;
  let h = '';
  plan.refs.recortes.forEach((m, i) => { const col = i % 4, fila = Math.floor(i / 4); h += `<div class="ref" id="rf${i + 1}" style="left:${rf.x0 + col * (rf.lado + rf.gap)}px;top:${fila ? rf.y2 : rf.y}px;width:${rf.lado}px;height:${rf.lado}px"><img src="assets/${m.id}.jpg" alt=""></div>`; });
  h += `<div class="trk" id="sc-trk" style="left:${SC.x0}px;top:${y}px;width:${SC.x1 - SC.x0}px"><div class="zona" id="sc-zona" style="left:${X(SC.piso) - SC.x0}px;right:0"></div></div>`;
  h += `<div class="mkv" id="sc-mk" style="left:${X(SC.piso)}px;top:${y - 62}px;height:96px"></div>`;
  h += cent(X(SC.piso), es.marca_label_y, `<span class="tag tag-d" id="sc-mkl"><i></i>mi piso · <b>${fm(SC.piso)}</b></span>`, 560);
  h += `<div class="ax" id="sc-ax0" style="left:${SC.x0}px;top:${y + 50}px">0</div>`;
  h += `<div class="ax r" id="sc-ax1" style="left:${SC.x1 - 420}px;width:420px;top:${y + 50}px">idéntica · 1</div>`;
  html += FULLDIV('pl-regla', med['pl-regla'].a, med['pl-regla'].b, 4, h, 'pl');
}

// ── lección: las seis imágenes ordenadas por precio sobre la escala 0-1, la nota del ruido en dos instantes y la franja de 0,66 a 0,70 ──
{
  const L = plan.l1, ru = L.ruido;
  // la franja va detrás de todo; la marca, la nota 1 y los ejes están ya en la placa cuando llega (viajan con el empuje: sin entradas casi vacías)
  let h = `<div class="ruido" id="l1-ruido" style="left:${X(ru.desde)}px;top:${L.marca_top}px;width:${X(ru.hasta) - X(ru.desde)}px;height:${L.marca_alto}px"></div>`;
  h += cent(X(SC.piso), L.marca_label_y, `<span class="tag tag-d" id="l1-mkl"><i></i>mi piso · <b>${fm(SC.piso)}</b></span>`, 560);
  h += cent(540, L.nota1.y, `<span class="note" id="l1-nota1">${esc(L.nota1.texto)}</span>`, 940);
  h += cent(540, L.nota2.y, `<span class="note" id="l1-nota2">${esc(L.nota2.texto)}</span>`, 940);
  h += `<div class="mkv" id="l1-mk" style="left:${X(SC.piso)}px;top:${L.marca_top}px;height:${L.marca_alto}px"></div>`;
  L.filas.forEach((f, i) => {
    const m = img[f.img], n = i + 1, x = X(m.valor);
    h += `<div class="rt" id="l1-t${n}" style="left:${SC.x0}px;top:${f.y - 68}px">${m.nombre} · ${crs(m.cr)} ${m.cr === 1 ? 'crédito' : 'créditos'}</div>`;
    h += `<div class="rl" id="l1-r${n}" style="left:${SC.x0}px;top:${f.y - 5}px;width:${SC.x1 - SC.x0}px"></div>`;
    h += `<div class="dot f${cls(m)}" id="l1-f${n}" style="left:${x}px;top:${f.y}px"></div>`;
    h += `<div class="vl${cls(m)}" id="l1-v${n}" style="left:${x + 29}px;top:${f.y - 23}px;transform:none">${fm(m.valor)}</div>`;
  });
  h += `<div class="ax" id="l1-ax0" style="left:${SC.x0}px;top:${L.ejes_y}px">0</div><div class="ax r" id="l1-ax1" style="left:${SC.x1 - 420}px;width:420px;top:${L.ejes_y}px">1</div>`;
  html += FULLDIV('pl-l1', med['pl-l1'].a, med['pl-l1'].b, 4, h, 'pl');
}

// ── escena 2: las dos fotos del café lado a lado (A 0,83 y B 0,35) con su pie y un anillo sobre la que perdió la cara ──
{
  const L = plan.l2, F = L.fotos;
  let h = '';
  F.lista.forEach((f, i) => {
    const cx = F.cx[i];
    h += `<div class="cph" id="l2-ph${i + 1}" style="left:${cx - F.w / 2}px;top:${F.y}px;width:${F.w}px;height:${F.h}px"><img src="assets/cf-${f.foto}.jpg" alt=""></div>`;
    h += cent(cx, F.cap_y, `<div class="cap" id="l2-cap${i + 1}"><span class="rt" style="position:static">${f.nombre}</span><span class="cv${f.valor < SC.piso ? ' bajo' : ''}">${fm(f.valor)}</span></div>`, 420);
  });
  const ib = F.lista.findIndex((f) => f.valor < SC.piso);
  h += `<div class="barring" id="l2-ring" style="left:${F.cx[ib] - F.w / 2 - 10}px;top:${F.y - 10}px;width:${F.w + 20}px;height:${F.h + 20}px"></div>`;
  html += FULLDIV('pl-l2', med['pl-l2'].a, med['pl-l2'].b, 4, h, 'pl');
}

// ── tarjetas narrativas (+ pila de dato y sello en las imágenes). La entrada arranca 1 cuadro ANTES de que termine la anterior, salvo en los empujes (viajan) ──
const viajaEntra = new Set(plan.costuras.filter((c) => c.tarjetas && c.tarjetas.entra).map((c) => c.tarjetas.entra));
const viajaSale = new Set(plan.costuras.filter((c) => c.tarjetas && c.tarjetas.sale).map((c) => c.tarjetas.sale));
const primeras = new Set(plan.cadenas_de_tarjetas.map((c) => c[0]));
for (const c of plan.tarjetas) c.entra = f2(c.a - (viajaEntra.has(c.id) ? PUSH : primeras.has(c.id) ? 0 : FR));
for (const c of plan.tarjetas) {
  // en las tarjetas de motor (nombre + costo) el nombre y el costo no se parten por dentro: si no entran en una línea, el corte cae entre «Seedream 5.0 Pro ·» y «2,5 créditos»
  const nb = (x) => (c.imagen ? x.replaceAll(' ', '\u00A0') : x);
  const t = c.texto.endsWith('\n') ? esc(c.texto.slice(0, -1)) + '<br>' : esc(nb(c.texto)) + (c.acento ? ' ' : '');
  const acento = c.acento ? `<b${c.acento_t ? ' class="late"' : ''}>${esc(nb(c.acento))}</b>` : '';
  let extras = '';
  if (c.imagen) {
    const m = img[c.imagen];
    if (m.sello) extras += `<div class="sello" id="s-${m.id}">${esc(m.sello.texto)}</div>`;
    if (m.pastilla) extras += `<div class="sello dato" id="p-${m.id}">${esc(m.pastilla.texto)}</div>`;
    extras += `<div class="drow" id="d-${m.id}"><span class="tag tag-d dg${cls(m)}" id="dA-${m.id}"><i></i>parecido <b>${fm(m.valor)}</b></span></div>`;
  }
  html += `<div id="cc-${c.id}" class="clip cc cc-bot" data-start="${c.entra}" data-duration="${f2(c.b - c.entra)}" data-track-index="${3 + (plan.tarjetas.indexOf(c) % 2)}" style="--b:${Z.tarjeta_bottom_y}px">` +
    `<div class="stk">${extras}<div class="cw" id="${c.id}"><i class="sh sh1"></i><i class="sh sh2"></i><div class="card"><div class="rail"></div><div class="t">${t}${acento}</div></div></div></div></div>\n`;
}

const css = fs.readFileSync(path.join(P, 'scripts/estilos.css'), 'utf8').replaceAll('{{ACC}}', ACC).replaceAll('{{BAD}}', BAD);
const tlJs = fs.readFileSync(path.join(P, 'scripts/timeline.js'), 'utf8');
const existe = (id) => html.includes(`id="${id}"`);
// los datos, el sello y la pastilla de una imagen VIAJAN con el empuje que saca su tarjeta (no se apagan antes: ganan tiempo de lectura)
const extrasDe = (cid) => conEscena.filter((m) => m.tarjeta === cid).flatMap((m) => [`dA-${m.id}`, `p-${m.id}`, `s-${m.id}`]);
const costuras = plan.costuras.filter((c) => c.tipo === 'empuje').map((c) => ({
  t: c.t,
  sale: [...c.sale, ...(c.tarjetas && c.tarjetas.sale ? [c.tarjetas.sale, ...extrasDe(c.tarjetas.sale)] : [])].filter(existe),
  entra: [...c.entra, ...(c.tarjetas ? [c.tarjetas.entra] : [])].filter(existe),
}));
const idxFila = Object.fromEntries(plan.l1.filas.map((f, i) => [f.img, i + 1]));
const PLAN_JS = {
  W, H, FR, PUSH, PEASE: plan.empuje.ease, E_IN, E_OUT, costuras, ACC, DUR,
  zoom: plan.zoom.fin,
  fotos: fotosPlan,
  tarjetas: plan.tarjetas.map(({ id, entra, b, acento_t }) => ({ id, a: +entra, b, acento_t: acento_t || null, en_empuje_entra: viajaEntra.has(id), en_empuje_sale: viajaSale.has(id) })),
  rotulo: plan.rotulo,
  gancho: { a: plan.gancho.miniaturas.a, esc: plan.gancho.miniaturas.escalon, ids: plan.gancho.miniaturas.ids },
  regla: { refs: { a: plan.regla.refs.a, esc: plan.regla.refs.escalon, n: plan.refs.recortes.length, est: plan.regla.refs.estaticas }, escala: plan.regla.escala },
  imagenes: conEscena.map((m) => ({ id: m.id, a: m.tag_t, sello: m.sello || null, pastilla: m.pastilla || null, enfasis: m.enfasis || [] })),
  l1: { nota2_t: plan.l1.nota2.t, ruido_t: plan.l1.ruido.t, filas: plan.l1.filas.map((f, i) => ({ n: i + 1, t: f.t })), pulsos: plan.l1.pulsos.map((p) => ({ n: idxFila[p.img], t: p.t })) },
  l2: { fotos: plan.l2.fotos.lista.map((f, i) => ({ n: i + 1, t: f.t, cap_t: f.cap_t })), anillo_t: plan.l2.anillo_t },
  cta: { id: plan.tarjetas.at(-1).id, pulso_t: plan.cta.pulso_t },
};
const out = `<!doctype html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=${W}, height=${H}">
<title>Lucía · G4 v2</title>
<script src="assets/vendor/gsap.min.js"></script>
<style>
${css}
</style>
</head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-duration="${f2(DUR)}" data-width="${W}" data-height="${H}" data-fps="${FPS}">
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

// ───────────────────────── 3) tablas ─────────────────────────
console.log(`Cronograma de la voz (guion-voz.txt: ${nCar} caracteres con saltos, ${tramos.reduce((a, s) => a + s.palabras, 0)} palabras, ${plan.voz.palabras_por_s} palabras por segundo, huecos de ${plan.voz.hueco} s; NO se genera audio):`);
for (const s of tramos) console.log(`  ${String(s.i).padStart(2)}  ${s.ini.toFixed(3).padStart(7)} – ${s.fin.toFixed(3).padEnd(7)} ${String(s.palabras).padStart(2)} pal ${String(s.caracteres).padStart(2)} car  ${s.texto}`);
console.log(`  el video dura ${DUR.toFixed(3)} s (${NF} cuadros); la voz termina en ${tramos.at(-1).fin.toFixed(3)} s; el CTA está ${colaCTA.toFixed(3)} s`);
console.log('Tabla de cortes (t en s):');
for (const m of plan.medios) console.log(`  ${m.a.toFixed(3).padStart(7)} – ${m.b.toFixed(3).padEnd(7)} ${m.id.padEnd(9)} ${m.tipo.padEnd(5)} ${m.capa}`);
console.log('Costuras (empuje rígido de 6 cuadros):');
for (const c of plan.costuras) console.log(`  ${c.t.toFixed(3).padStart(7)}  tramo ${String(c.seg).padStart(2)}  sale ${c.sale.join(',')} → entra ${c.entra.join(',')}`);
console.log('Tarjetas (entra = 1 cuadro antes de a salvo en los empujes, donde viajan):');
for (const c of plan.tarjetas) console.log(`  ${c.a.toFixed(3).padStart(7)} – ${c.b.toFixed(3).padEnd(7)} ${c.id.padEnd(3)} ${String(c.n_palabras)} pal (mín ${c.min_s} s, dura ${(c.b - c.a).toFixed(2)}) «${(c.texto.replace(/\n/g, ' ') + ' ' + (c.acento || '')).trim()}»${viajaEntra.has(c.id) ? ' [entra con el empuje]' : ''}${viajaSale.has(c.id) ? ' [sale con el empuje]' : ''}`);
console.log('Lecturas de rótulo, datos, sellos, placas (≥ 0,35 s/palabra + 0,3):');
for (const x of lecturas) console.log(`  ${x.que.padEnd(22)} ${String(x.n).padStart(2)} pal  ${x.a.toFixed(2)}–${x.b.toFixed(2)}  ${x.dur.toFixed(2)} s  (pide ${x.min.toFixed(2)})  ${x.dur - x.min < 0.2 ? '← justo' : ''}`);
console.log('Datos (de PROCEDENCIA.jsonl):');
for (const m of plan.imagenes) console.log(`  ${m.nombre}: ${crs(m.cr)} cr · parecido ${fm(m.valor)} (medido ${m._raw}) · ${m.estado}${m.tarjeta ? ' · escena propia' : ''}`);
console.log('Lo que el video afirma, contra los datos:');
for (const c of claim) console.log('  ' + c);
console.log(`ok: index.html (${Math.round(out.length / 1024)} KB)`);
