#!/usr/bin/env node
// Lucía · G5 «Cómo mido si una cara es la de Lucía (y cuándo no creerle al número)» (57,5 s, 1080x1920, 24 fps) — montaje con HyperFrames (1ra pasada, 9-oct-2026).
// Lee plan.json (capas, tiempos, datos) → valida reglas de texto, costuras Y LOS NÚMEROS / AFIRMACIONES contra v4/PROCEDENCIA.jsonl → escribe index.html
// (DOM estático + un único timeline GSAP) y los manifiestos que leen los controles (qa/elementos-texto.json, qa/eventos-plan.json, qa/datos-plan.json).
// 0 créditos: tres fotos y el cierre ya pagados el 8-oct, dos cuadros de clips crudos de G2 (versionados en assets-fijos/), 8 referencias oficiales.
// Sin clips: fotos fijas con empuje lento, cuadros fijos y placas. Método y trampas: .claude/skills/lucia/montaje-hyperframes.md. Plantilla: videos/lucia-g4/.
// Uso:  node scripts/build.mjs   (copia el material, valida e imprime la tabla de cortes; si falla una regla o una afirmación, se corta y no escribe index.html)
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const P = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const plan = JSON.parse(fs.readFileSync(path.join(P, 'plan.json'), 'utf8'));
const { w: W, h: H, fps: FPS, duracion: DUR } = plan.lienzo;
const ACC = plan.acento, BAD = plan.alerta;
const Z = plan.zona_segura;
const FR = 1 / FPS;
const E_IN = 0.18, E_OUT = 0.18;               // entrada y salida de las tarjetas: misma duración y distancia (80 px), eases espejados
const PUSH = plan.empuje.cuadros * FR;
const SC = plan.escala;
const X = (v) => Math.round(SC.x0 + v * (SC.x1 - SC.x0));       // valor 0-1 → x del lienzo (los puntos salen de los datos, nunca a mano)
const E2 = plan.r2.eje;
const X2 = (v) => Math.round(SC.x0 + (SC.x1 - SC.x0) * (v - E2.desde) / (E2.hasta - E2.desde));   // escala AMPLIADA de la razón 2 (0,70 a 0,90)
const r2 = (v) => Math.round(v * 100 + 1e-7) / 100;             // 2 decimales, media hacia arriba (0,805 → 0,81; 0,785 → 0,79)
const f2 = (n) => +(+n).toFixed(3);
const fm = (v) => v.toFixed(2).replace('.', ',');
const crs = (v) => String(v).replace('.', ',');

// ───────────────────────── 0) material ─────────────────────────
const R = path.resolve(P, '../..');
const V4 = path.join(R, 'hermes-content/references/modelos/lucia/v4');
const FONTS = path.join(R, 'hermes-content/brand/fonts');
const COPIAS = [
  ...Object.values(plan.fotos).map((f) => [f.src, path.join(R, f.origen)]),
  ...Object.values(plan.frames).map((f) => [f.src, path.join(P, f.fijo)]),
  ['assets/fonts/BricolageGrotesque-var-latin.woff2', path.join(FONTS, 'BricolageGrotesque-var-latin.woff2')],
  ['assets/fonts/DMSans-var-latin.woff2', path.join(FONTS, 'DMSans-var-latin.woff2')],
  ['assets/fonts/SplineSansMono-var-latin.woff2', path.join(FONTS, 'SplineSansMono-var-latin.woff2')],
];
const mismo = (a, b) => fs.existsSync(a) && fs.existsSync(b) && fs.statSync(a).size === fs.statSync(b).size && fs.readFileSync(a).equals(fs.readFileSync(b));
for (const [dest, src] of COPIAS) {                          // copia solo si falta o si CAMBIÓ el contenido
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

// ───────────────────────── 1) reglas (se corta el build si alguna falla) ─────────────────────────
const errores = [];
const palabras = (t) => `${t.texto} ${t.acento || ''}`.trim().split(/\s+/).filter((s) => s && s !== '·');
const nw = (t) => String(t).replace(/<[^>]+>/g, ' ').split(/\s+/).filter((x) => x && x !== '·' && x !== '→').length;
for (const c of plan.tarjetas) {
  const n = palabras(c).length, min = n * 0.35 + 0.3, dur = c.b - c.a;
  if (n > 6) errores.push(`${c.id}: ${n} palabras (máx 6: el tope del guion, sin excepciones)`);
  if (dur < min + 0.1 - 1e-9) errores.push(`${c.id}: dura ${dur.toFixed(2)} s y necesita ${min.toFixed(2)} s para ${n} palabras (+0,1 s de margen: el último instante es la salida)`);
  if (c.id === 'c1' && c.a > 0.15 + 1e-9) errores.push('c1: la primera tarjeta entra después de 0,15 s');
  if (c.acento_t != null && (c.acento_t < c.a + 0.5 - 1e-9 || c.acento_t > c.b - 0.5 + 1e-9)) errores.push(`${c.id}: acento_t ${c.acento_t} fuera de [a+0,5, b-0,5]`);
  for (const k of [c.a * FPS, c.b * FPS]) if (Math.abs(k - Math.round(k)) > 1e-6) errores.push(`${c.id}: ${k / FPS} no cae en un cuadro de 24 fps`);
  c.n_palabras = n; c.min_s = +min.toFixed(2);
}
const med = Object.fromEntries(plan.medios.map((m) => [m.id, m]));
const tj = Object.fromEntries(plan.tarjetas.map((c) => [c.id, c]));
if (med['f-cierre'].b !== DUR) errores.push(`el cierre termina en ${med['f-cierre'].b} y el video dura ${DUR}`);
if (Math.abs(DUR * FPS - Math.round(DUR * FPS)) > 1e-9) errores.push('la duración no es un número entero de cuadros');
// cadena de tarjetas: contiguas (b de una = a de la siguiente)
for (const cad of plan.cadenas_de_tarjetas) for (let i = 1; i < cad.length; i++) {
  if (Math.abs(tj[cad[i]].a - tj[cad[i - 1]].b) > 1e-9) errores.push(`${cad[i - 1]}→${cad[i]}: no son contiguas (${tj[cad[i - 1]].b} vs ${tj[cad[i]].a})`);
}
if (plan.cadenas_de_tarjetas[0].length !== plan.tarjetas.length) errores.push('la cadena de tarjetas no incluye a todas');
// costuras: el medio entrante arranca en T−6 cuadros; el saliente termina exactamente en T (son fotos y placas: no hay clips)
for (const c of plan.costuras) if (c.tipo === 'empuje') {
  for (const id of c.entra) if (med[id] && Math.abs(med[id].a - (c.t - PUSH)) > 1e-6) errores.push(`costura ${c.t}: «${id}» debe empezar en ${(c.t - PUSH).toFixed(3)} y empieza en ${med[id].a}`);
  for (const id of c.sale) if (med[id] && Math.abs(med[id].b - c.t) > 1e-6) errores.push(`costura ${c.t}: «${id}» debe terminar en ${c.t} y termina en ${med[id].b}`);
  if (c.tarjetas) {
    const s = tj[c.tarjetas.sale], e = tj[c.tarjetas.entra];
    if (!s || !e) { errores.push(`costura ${c.t}: tarjeta «${c.tarjetas.sale}» o «${c.tarjetas.entra}» no existe`); continue; }
    if (Math.abs(s.b - c.t) > 1e-6) errores.push(`costura ${c.t}: la tarjeta «${s.id}» debe terminar en ${c.t} y termina en ${s.b}`);
    if (Math.abs(e.a - c.t) > 1e-6) errores.push(`costura ${c.t}: la tarjeta «${e.id}» debe entrar en ${c.t} y entra en ${e.a}`);
  }
}
// cada medio de pantalla completa tiene que quedar cubierto por las costuras: los medios van uno detrás del otro sin huecos
{
  const orden = [...plan.medios].sort((a, b) => a.a - b.a);
  for (let i = 1; i < orden.length; i++) if (Math.abs(orden[i].a - (orden[i - 1].b - PUSH)) > 1e-6) errores.push(`${orden[i - 1].id}→${orden[i].id}: el siguiente debe entrar en ${(orden[i - 1].b - PUSH).toFixed(3)}`);
}

// los números salen de PROCEDENCIA.jsonl (última línea «resultados»)
const claim = [];
let proc = null, vid = null, lab = null;
{
  const lines = fs.readFileSync(path.join(V4, 'PROCEDENCIA.jsonl'), 'utf8').split('\n').filter(Boolean).map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
  const res = lines.filter((l) => /resultados$/.test(l.type || '')).at(-1);
  if (!res) errores.push('PROCEDENCIA.jsonl: no hay línea «resultados»');
  else {
    const v = res.imagen_misma_escena_K1_mismas_6_refs;
    proc = Object.fromEntries(Object.entries(plan.claves_procedencia).map(([k, key]) => { const d = v[key]; if (!d) errores.push(`«${k}»: «${key}» no está en PROCEDENCIA.jsonl`); return [k, d]; }));
    vid = Object.fromEntries(Object.entries(plan.claves_video).filter(([k]) => k !== 'sync').map(([k, key]) => { const d = res.video_misma_foto_K1_misma_orden[key]; if (!d) errores.push(`«${k}»: «${key}» no está en PROCEDENCIA.jsonl`); return [k, d]; }));
    lab = res.labios_audio_de_prueba_d0eacead_voz_Marcela_solo_evaluacion_interna[plan.claves_video.sync];
    if (!lab) errores.push('sync_so: no está en PROCEDENCIA.jsonl');
  }
}
const caras = JSON.parse(fs.readFileSync(path.join(P, 'qa/caras-fotos.json'), 'utf8'));
for (const k of Object.keys(plan.fotos)) if (!caras.fotos[k] || !caras.fotos[k].caja) errores.push(`sin caja de cara para la foto «${k}» (correr scripts/medir-caras.py)`);
for (const k of ['fr_m5', 'fr_m4']) if (!caras.frames?.[k]) errores.push(`sin caja de cara para el cuadro «${k}» (correr scripts/medir-caras.py)`);
const dato = {};                                       // dato por id: gancho.dato y cada ejemplo
dato[plan.gancho.dato.id] = { ...plan.gancho.dato, pill: 'parecido' };
for (const e of plan.ejemplos) dato[e.id] = e;
if (proc && vid && lab && !errores.length) {
  const raw = (k) => proc[k].id;
  const ok = (cond, texto) => { claim.push(`${cond ? 'ok ' : '✖  '} ${texto}`); if (!cond) errores.push(`afirmación falsa: ${texto}`); };
  const piso = SC.piso;
  // números de las tres fotos de ejemplo
  for (const d of Object.values(dato)) {
    if (r2(raw(d.clave)) !== d.valor) errores.push(`${d.id}: parecido ${d.valor} y PROCEDENCIA dice ${raw(d.clave)} → ${r2(raw(d.clave))}`);
    const est = raw(d.clave) >= piso ? 'ok' : 'bajo';
    if (est !== d.estado) errores.push(`${d.id}: estado «${d.estado}» y ${raw(d.clave)} es «${est}» (piso ${piso})`);
  }
  ok(raw('a') >= piso, `«0,81: es ella.»: la imagen A mide ${raw('a')} (≥ ${fm(piso)}, sobre el piso)`);
  ok(raw('f') < piso && raw('f') > raw('b_cafe'), `«0,66: se parece poco.»: la imagen F mide ${raw('f')} (bajo el piso ${fm(piso)}; y más que la del café, ${raw('b_cafe')}). Ojo: «se parece poco» es una lectura del número, no una frontera objetiva`);
  ok(raw('b_cafe') < piso && /otra persona/.test(proc.b_cafe.nota || ''), `«0,35: otra persona.»: la imagen B del café mide ${raw('b_cafe')} y PROCEDENCIA dice «${proc.b_cafe.nota}»`);
  ok(SC.piso === 0.7, `«Piso, 0,70. Lo elegí yo.»: el piso del plan es ${SC.piso} (el gate del repo: 0,70, una decisión)`);
  ok(refNames.length === 8 && plan.refs.recortes.length === 8, `«Ocho fotos oficiales»: el manifiesto trae ${refNames.length} referencias y el plan ${plan.refs.recortes.length} recortes`);
  // razón 1: cara chica
  const f5 = caras.frames.fr_m5;
  ok(f5.cara_px_nativa === 89 && f5.cara_px_nativa < 200 && /89 a 168 px/.test(vid.m5.nota || ''), `«Cara chica: poco confiable.»: la cara del cuadro del Motor 5 mide ${f5.cara_px_nativa} px (< 200 px: la regla del gate la marca «poco confiable»; PROCEDENCIA: «${vid.m5.nota}»). NO se afirma que el número baje: ese cuadro dio ${vid.m5.id[0]} (ver README)`);
  // razón 2: 0,03
  const m6 = vid.m6.id, a6 = m6[0], b6 = m6.at(-1), p = plan.r2;
  ok(r2(a6) === p.d1.valor && r2(b6) === p.d2.valor, `razón 2: las dos medidas del Motor 6 son ${a6} → ${r2(a6)} y ${b6} → ${r2(b6)} (en pantalla ${fm(p.d1.valor)} y ${fm(p.d2.valor)})`);
  const difMax = Math.max(...lab.id.map((x, i) => Math.abs(x - lab.fuente_mismo_instante[i])));
  ok(Math.abs(a6 - b6) < 0.03 && Math.abs(p.d1.valor - p.d2.valor) <= p.banda.mas_menos + 1e-9, `«Una diferencia de 0,03 no cuenta.»: las dos medidas del Motor 6 difieren ${(Math.abs(a6 - b6)).toFixed(3)} (en pantalla ${(Math.abs(p.d1.valor - p.d2.valor)).toFixed(2)}), dentro de la banda de ±${p.banda.mas_menos} centrada en ${fm(p.banda.centro)}`);
  ok(difMax <= 0.03 + 1e-9, `±0,03 como orden de magnitud: entre un clip y su remapeo de labios (misma cara, mismos instantes) la mayor diferencia medida es ${difMax.toFixed(3)} (sync_so, PROCEDENCIA línea 97). NO es un intervalo de confianza`);
  ok(p.banda.centro === p.d1.valor && p.d2.valor >= p.banda.centro - p.banda.mas_menos && p.d2.valor <= p.banda.centro + p.banda.mas_menos, 'la segunda medida cae dentro de la banda dibujada');
  // razón 3: letreros
  const m4 = vid.m4, t4 = [0, 1, 2, 3, 4, 5, 5.9];
  ok(/letrero/.test(m4.nota || '') && plan.frames.m4.t_clip === t4[plan.r3.muestra] && r2(m4.id[plan.r3.muestra]) === 0.8 && m4.id[plan.r3.muestra] >= piso, `«No ve letreros inventados.»: PROCEDENCIA dice del Motor 4 «${m4.nota}» y su medida a ${t4[plan.r3.muestra]} s (el cuadro mostrado) es ${m4.id[plan.r3.muestra]} → ${fm(r2(m4.id[plan.r3.muestra]))}, sobre el piso: el número aprueba un clip con letrero inventado`);
  ok(plan.frames.m4.cuadro === Math.round(plan.frames.m4.t_clip * FPS), `el cuadro 96 del clip es t = ${plan.frames.m4.t_clip} s a 24 fps`);
  ok(plan.frames.m5.cuadro === 0 && r2(vid.m5.id[0]) === 0.8, `el cuadro 0 del Motor 5 es la primera muestra de PROCEDENCIA (${vid.m5.id[0]})`);
}
// pie: el de pie.txt tiene que ser idéntico al de guion-corregido.md (y se informa si difiere del guion original)
const pieDe = (file) => {
  const g0 = fs.readFileSync(file, 'utf8');
  const g = g0.slice(g0.indexOf('\n## Pie'));              // el pie es el bloque «…» de la sección «## Pie» (hay otros «…» antes)
  const mm = g.match(/\*«([\s\S]+?)»\*\s*`([^`]+)`/);
  return mm ? `${mm[1].replace(/\s+/g, ' ').trim()} ${mm[2].trim()}` : null;
};
{
  const pc = pieDe(path.join(P, plan.guion_corregido)), po = pieDe(path.join(R, plan.guion));
  if (!pc) errores.push('no se encontró el pie en guion-corregido.md');
  else {
    const pp = path.join(P, 'pie.txt');
    if (!fs.existsSync(pp) || fs.readFileSync(pp, 'utf8') !== pc) fs.writeFileSync(pp, pc);   // pie.txt se regenera desde guion-corregido.md (el guion del repo se corrige aparte)
    claim.push(po === pc ? 'ok  pie.txt idéntico al del guion del repo' : 'ojo pie.txt = pie de guion-corregido.md, que DIFIERE del pie del guion del repo (el guion decía «una cara chica baja sola»: falso, ver README); hay que corregir el guion');
  }
}
// tags y sellos dentro de la vida de su tarjeta y antes del empuje de salida
for (const d of Object.values(dato)) {
  const c = plan.tarjetas.find((t) => t.dato === d.id), salida = c.b - PUSH;
  const t0 = d.t, fin = d.fin;
  if (t0 < c.a + 0.1 - 1e-9 || fin > salida + 0.06 + 1e-9) errores.push(`${d.id}: dato (${t0}-${fin}) fuera de la vida de la tarjeta (${c.a}-${salida})`);
}
// ── tiempo de lectura de TODO texto que no es una tarjeta: ≥ 0,35 s por palabra + 0,3 s, medido de que termina de entrar a que empieza a salir. Cada texto lleva su id del DOM:
//    ventanas.mjs lo mide después cuadro a cuadro (qa/elementos-texto.json) ──
const lecturas = [];
{
  const L = (id, que, texto, a, b) => lecturas.push({ id, que, texto, n: nw(texto), a, b, dur: b - a, min: nw(texto) * 0.35 + 0.3 });
  const fin = (id) => med[id].b - PUSH;                                // desde que empieza el empuje de salida ya no se lee entero
  const llega = (id) => med[id].a + PUSH - 0.05;                       // lo que viaja con la placa se lee desde que llega (en T la placa está en reposo)
  L('rotulo', 'rótulo de IA', plan.rotulo.texto, plan.rotulo.a, plan.rotulo.b);
  const g = plan.gancho.dato; L('dA-g', 'gancho dato', `${'parecido'} ${fm(g.valor)}`, g.t + E_IN, g.fin - 0.1);
  const p2 = plan.p2, es = p2.escala;
  L('sc-ax0', 'p2 «0»', '0', es.ejes_t + 0.25, fin('pl-p2'));
  L('sc-ax1', 'p2 «idéntica · 1»', 'idéntica · 1', es.uno_t + 0.25, fin('pl-p2'));
  L('sc-mkl', 'p2 «mi piso»', `mi piso · ${fm(SC.piso)}`, es.marca_t + 0.05 + E_IN, fin('pl-p2'));
  for (const e of plan.ejemplos) L(`dA-${e.id}`, `ejemplo ${e.letra} dato`, `${e.pill} ${fm(e.valor)}`, e.t + E_IN, e.fin - 0.1);
  const r1 = plan.r1; L('r1-tag', 'r1 «89 px»', `${caras.frames.fr_m5.cara_px_nativa} px`, r1.tag_t + 0.25, fin('pl-r1')); L('r1-nota', 'r1 nota', r1.nota.texto, r1.nota.t + E_IN, fin('pl-r1'));
  const r = plan.r2;
  r.marcas.forEach((m, i) => L(`r2-m${i + 1}`, `r2 marca ${fm(m)}`, fm(m), llega('pl-r2'), fin('pl-r2')));
  L('r2-v1', 'r2 valor 1', fm(r.d1.valor), r.d1.t + 0.25, fin('pl-r2')); L('r2-v2', 'r2 valor 2', fm(r.d2.valor), r.d2.t + 0.25, fin('pl-r2'));
  L('r2-bl', 'r2 banda', `±${fm(r.banda.mas_menos)}`, r.banda.t + 0.3, fin('pl-r2'));
  L('r2-pie', 'r2 pie', r.pie.texto, r.pie.t + E_IN, fin('pl-r2')); L('r2-nota', 'r2 nota', r.nota.texto, r.nota.t + E_IN, fin('pl-r2'));
  const r3 = plan.r3;
  L('r3-lab', 'r3 «letrero inventado»', 'letrero inventado', r3.pill_letrero_t + E_IN, fin('pl-r3')); L('r3-num', 'r3 número', `parecido ${fm(r2(vid.m4.id[r3.muestra]))}`, r3.pill_num_t + E_IN, fin('pl-r3')); L('r3-nota', 'r3 nota', r3.nota.texto, r3.nota.t + E_IN, fin('pl-r3'));
  plan.lec.filas.forEach((f, i) => L(`le-t${i + 1}`, `lección ${i + 1}`, f.texto, f.t + 0.25, fin('pl-lec')));
  for (const x of lecturas) if (x.dur < x.min - 1e-9) errores.push(`lectura «${x.que}» (${x.n} palabras): ${x.dur.toFixed(2)} s y pide ${x.min.toFixed(2)} s`);
}
if (errores.length) { console.error('✖ reglas:\n  ' + errores.join('\n  ')); process.exit(1); }

// ───────────────────────── 2) HTML ─────────────────────────
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
let html = '';
let track = 40;
const nextTrack = () => track++;
const FULLDIV = (id, a, b, z, inner, cls = '') => `<div id="${id}" class="clip ${cls}" data-start="${f2(a)}" data-duration="${f2(b - a)}" data-track-index="${nextTrack()}" style="position:absolute;left:0;top:0;width:1080px;height:1920px;z-index:${z}">${inner}</div>\n`;
// elemento centrado en cx sin tocar transform (GSAP lo pisaría): contenedor flex de ancho fijo
const cent = (cx, top, inner, w = 760, extra = '') => `<div class="ab" style="left:${Math.round(cx - w / 2)}px;top:${top}px;width:${w}px;display:flex;justify-content:center;${extra}">${inner}</div>`;
const cls = (estado) => (estado === 'bajo' ? ' bajo' : estado === 'justo' ? ' ne' : '');
const PAD = 16;                                                       // margen de la caja de cara sobre la caja SCRFD

// fotos: contenedor .clip a lienzo completo con overflow:hidden (el empuje rígido anima el contenedor; el empuje lento anima la <img> y la caja de cara)
const fotosPlan = [];
const cajas = [];                                                     // cajas de cara (para el timeline y los controles)
const boxDe = { 'f-gancho': { k: 'gancho', estado: 'ok', t: plan.gancho.caja_t } };
for (const e of plan.ejemplos) boxDe[e.medio] = { k: e.id, estado: e.estado, t: e.box_t };
for (const m of plan.medios) if (m.tipo === 'foto') {
  const f = plan.fotos[m.foto], c = caras.fotos[m.foto].caja, ox = Math.round((c[0] + c[2]) / 2), oy = Math.round((c[1] + c[3]) / 2);
  fotosPlan.push({ id: m.id, a: m.a, b: m.b, ox, oy, foto: m.foto });
  let box = '';
  const bx = boxDe[m.id];
  if (bx) {
    const l = c[0] - PAD, t = c[1] - PAD - 8, w_ = c[2] - c[0] + 2 * PAD, h_ = c[3] - c[1] + 2 * PAD + 8;
    box = `<div class="fz" id="${m.id}-bz" style="left:${l}px;top:${t}px;width:${w_}px;height:${h_}px"><div class="fbox${bx.estado === 'bajo' ? ' bad' : ''}" id="${m.id}-box"></div></div>`;
    cajas.push({ id: `${m.id}-box`, zid: `${m.id}-bz`, medio: m.id, t: bx.t, ox: ox - l, oy: oy - t });
  }
  html += `<div id="${m.id}" class="clip ph" data-start="${f2(m.a)}" data-duration="${f2(m.b - m.a)}" data-track-index="${m.track}" style="z-index:1"><img id="${m.id}-i" src="${f.src}" data-layout-allow-overflow alt="">${box}</div>\n`;
}

// rótulo de IA (cuadro 0 → 3,0 s, a 40 px)
{
  const r = plan.rotulo;
  html += `<div id="cc-rotulo" class="clip cc cc-top" data-start="${f2(r.a)}" data-duration="${f2(r.b + E_OUT - r.a)}" data-track-index="${nextTrack()}" style="--t:${r.top}px"><div class="cw" id="rotulo"><span class="tag tag-r"><i></i>${esc(r.texto)}</span></div></div>\n`;
}

// ── paso 1: las 8 referencias oficiales (4x2): la fila de arriba ya está al llegar la placa; la de abajo entra de a una ──
{
  const rf = plan.p1.refs;
  let h = '';
  plan.refs.recortes.forEach((m, i) => { const col = i % 4, fila = Math.floor(i / 4); h += `<div class="ref" id="rf${i + 1}" style="left:${rf.x0 + col * (rf.lado + rf.gap)}px;top:${fila ? rf.y2 : rf.y}px;width:${rf.lado}px;height:${rf.lado}px"><img src="assets/${m.id}.jpg" alt=""></div>`; });
  html += FULLDIV('pl-p1', med['pl-p1'].a, med['pl-p1'].b, 4, h, 'pl');
}

// ── paso 2: las 8 referencias en fila → flecha → la escala 0-1 con «idéntica · 1» y la marca «mi piso · 0,70» ──
{
  const q = plan.p2.fila, es = plan.p2.escala, y = es.y, fl = plan.p2.flecha;
  let h = '';
  plan.refs.recortes.forEach((m, i) => { h += `<div class="ref q" id="q${i + 1}" style="left:${q.x0 + i * (q.lado + q.gap)}px;top:${q.y}px;width:${q.lado}px;height:${q.lado}px"><img src="assets/${m.id}.jpg" alt=""></div>`; });
  h += `<svg class="ab" id="p2-flecha" style="left:${fl.x - 40}px;top:${fl.y1}px" width="80" height="${fl.y2 - fl.y1}" viewBox="0 0 80 ${fl.y2 - fl.y1}"><line x1="40" y1="0" x2="40" y2="${fl.y2 - fl.y1 - 6}" stroke="#F6F8FB" stroke-opacity=".85" stroke-width="6" stroke-linecap="round"/><path d="M14 ${fl.y2 - fl.y1 - 34} L40 ${fl.y2 - fl.y1 - 6} L66 ${fl.y2 - fl.y1 - 34}" fill="none" stroke="#F6F8FB" stroke-opacity=".85" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  h += `<div class="trk" id="sc-trk" style="left:${SC.x0}px;top:${y}px;width:${SC.x1 - SC.x0}px"><div class="zona" id="sc-zona" style="left:${X(SC.piso) - SC.x0}px;right:0"></div></div>`;
  h += `<div class="mkv" id="sc-mk" style="left:${X(SC.piso)}px;top:${y - 62}px;height:96px"></div>`;
  h += cent(X(SC.piso), es.marca_label_y, `<span class="tag tag-d" id="sc-mkl"><i></i>mi piso · <b>${fm(SC.piso)}</b></span>`, 560);
  h += `<div class="ax" id="sc-ax0" style="left:${SC.x0}px;top:${y + 50}px">0</div>`;
  h += `<div class="ax r" id="sc-ax1" style="left:${SC.x1 - 420}px;width:420px;top:${y + 50}px">idéntica · 1</div>`;
  html += FULLDIV('pl-p2', med['pl-p2'].a, med['pl-p2'].b, 4, h, 'pl');
}

// ── razón 1: cuadro del clip crudo con la cara de 89 px, su caja y su lupa ──
const datos = [];                                                     // lo que medir-dom comprueba: dónde tiene que estar cada cosa y qué dice
{
  const r1 = plan.r1, w_ = r1.win, lp = r1.lupa, f5 = caras.frames.fr_m5, [bx1, by1, bx2, by2] = f5.caja, cx = (bx1 + bx2) / 2, cy = (by1 + by2) / 2;
  const s = lp.w / lp.region, bgw = Math.round(w_.w * s), bgh = Math.round(w_.h * s);
  const bgx = -Math.round((cx - lp.region / 2) * s), bgy = -Math.round((cy - lp.region / 2) * s);
  const B = 10;                                                       // margen de la caja alrededor de la cara
  const L = w_.x + bx1 - B, T = w_.y + by1 - B, BW = bx2 - bx1 + 2 * B, BH = by2 - by1 + 2 * B;
  let h = `<div class="win" id="r1-win" style="left:${w_.x}px;top:${w_.y}px;width:${w_.w}px;height:${w_.h}px"><img src="${plan.frames.m5.src}" alt=""></div>`;
  h += `<div class="fbox bad" id="r1-box" style="left:${L}px;top:${T}px;width:${BW}px;height:${BH}px"></div>`;
  h += cent(L + BW / 2, T - 66, `<span class="tag tag-d bajo" id="r1-tag"><i></i>${f5.cara_px_nativa} px</span>`, 300);
  const lx1 = L + BW, ly1 = T + BH / 2;
  h += `<svg class="ab" id="r1-lineas" style="left:0;top:0" width="1080" height="1000" viewBox="0 0 1080 1000"><line x1="${lx1}" y1="${ly1}" x2="${lp.x}" y2="${lp.y + lp.h / 2}" stroke="${BAD}" stroke-width="5" stroke-opacity=".9" stroke-linecap="round"/></svg>`;
  h += `<div class="lupa bad" id="r1-lupa" style="left:${lp.x}px;top:${lp.y}px;width:${lp.w}px;height:${lp.h}px;background-image:url(${plan.frames.m5.src});background-size:${bgw}px ${bgh}px;background-position:${bgx}px ${bgy}px"></div>`;
  h += cent(540, r1.nota.y, `<span class="note" id="r1-nota">${esc(r1.nota.texto)}</span>`, 940);
  html += FULLDIV('pl-r1', med['pl-r1'].a, med['pl-r1'].b, 4, h, 'pl');
  plan.r1._geom = { L, T, BW, BH, s, bgx, bgy };
}

// ── razón 2: la escala AMPLIADA de 0,70 a 0,90 con las dos medidas del Motor 6 y la banda de ±0,03 ──
{
  const r = plan.r2, y = r.eje.y, b = r.banda, x1 = X2(b.centro - b.mas_menos), x2 = X2(b.centro + b.mas_menos);
  let h = `<div class="ruido" id="r2-band" style="left:${x1}px;top:${r.y_banda_linea + 16}px;width:${x2 - x1}px;height:${y + 30 - (r.y_banda_linea + 16)}px"></div>`;
  h += `<div class="trk" id="r2-trk" style="left:${SC.x0}px;top:${y - 13}px;width:${SC.x1 - SC.x0}px"><div class="zona" style="left:0;right:0"></div></div>`;
  r.marcas.forEach((m, i) => { h += `<div class="tkm" style="left:${X2(m) - 2}px;top:${y + 13}px"></div><div class="ax c" id="r2-m${i + 1}" style="left:${X2(m) - 70}px;width:140px;top:${r.y_marcas}px">${fm(m)}</div>`; });
  h += `<div class="brk" id="r2-brk" style="left:${x1}px;top:${r.y_banda_linea}px;width:${x2 - x1}px"></div>`;
  h += cent((x1 + x2) / 2, r.y_banda_label, `<span class="note g" id="r2-bl">±${fm(b.mas_menos)}</span>`, 300);
  h += `<div class="dot f" id="r2-d1" style="left:${X2(r.d1.valor)}px;top:${y}px"></div><div class="dot f" id="r2-d2" style="left:${X2(r.d2.valor)}px;top:${y}px"></div>`;
  h += cent(X2(r.d2.valor) - 44, r.y_valores, `<span class="vl g" id="r2-v2" style="position:static;transform:none">${fm(r.d2.valor)}</span>`, 200);
  h += cent(X2(r.d1.valor) + 44, r.y_valores, `<span class="vl g" id="r2-v1" style="position:static;transform:none">${fm(r.d1.valor)}</span>`, 200);
  h += cent(540, r.pie.y, `<span class="cap2" id="r2-pie">${esc(r.pie.texto)}</span>`, 940);
  h += cent(540, r.nota.y, `<span class="note" id="r2-nota">${esc(r.nota.texto)}</span>`, 940);
  html += FULLDIV('pl-r2', med['pl-r2'].a, med['pl-r2'].b, 4, h, 'pl');
  datos.push(
    { que: 'r2 dot 0,79', sel: '#r2-d1', t: r.d1.t + 0.6, m: 'cx', esp: X2(r.d1.valor) }, { que: 'r2 dot 0,77', sel: '#r2-d2', t: r.d2.t + 0.6, m: 'cx', esp: X2(r.d2.valor) },
    { que: 'r2 banda (borde izq. = 0,76)', sel: '#r2-band', t: b.t + 0.6, m: 'x1', esp: X2(b.centro - b.mas_menos) }, { que: 'r2 banda (borde der. = 0,82)', sel: '#r2-band', t: b.t + 0.6, m: 'x2', esp: X2(b.centro + b.mas_menos) },
    { que: 'r2 corchete (borde izq.)', sel: '#r2-brk', t: b.t + 0.6, m: 'x1', esp: X2(b.centro - b.mas_menos) }, { que: 'r2 corchete (borde der.)', sel: '#r2-brk', t: b.t + 0.6, m: 'x2', esp: X2(b.centro + b.mas_menos) },
    { que: 'r2 pista (x = 0,70)', sel: '#r2-trk', t: med['pl-r2'].a + PUSH + 0.3, m: 'x1', esp: X2(E2.desde) }, { que: 'r2 pista (x = 0,90)', sel: '#r2-trk', t: med['pl-r2'].a + PUSH + 0.3, m: 'x2', esp: X2(E2.hasta) },
  );
  r.marcas.forEach((m, i) => datos.push({ que: `r2 marca ${fm(m)} (centro)`, sel: `#r2-m${i + 1}`, t: med['pl-r2'].a + PUSH + 0.3, m: 'cx', esp: X2(m), tol: 2 }));
  datos.push({ que: 'r2 valor 0,79', sel: '#r2-v1', t: r.d1.t + 0.6, txt: fm(r.d1.valor) }, { que: 'r2 valor 0,77', sel: '#r2-v2', t: r.d2.t + 0.6, txt: fm(r.d2.valor) });
}

// ── razón 3: cuadro del Motor 4 con el letrero inventado (difuminado con pluma), su aro y el número que el programa le dio ──
{
  const r3 = plan.r3, w_ = r3.win, a = r3.aro, num = r2(vid.m4.id[r3.muestra]);
  let h = `<div class="win" id="r3-win" style="left:${w_.x}px;top:${w_.y}px;width:${w_.w}px;height:${w_.h}px"><img src="${plan.frames.m4.src}" alt=""></div>`;
  h += `<div class="aro" id="r3-aro" style="left:${Math.round(w_.x + a.cx - a.w / 2)}px;top:${Math.round(w_.y + a.cy - a.h / 2)}px;width:${a.w}px;height:${a.h}px"></div>`;
  h += cent(540, r3.pills_y, `<span class="tag tag-d bajo" id="r3-lab"><i></i>letrero inventado</span><span class="tag tag-d dg" id="r3-num"><i></i>parecido <b>${fm(num)}</b></span>`, 980, 'gap:24px');
  h += cent(540, r3.nota.y, `<span class="note" id="r3-nota">${esc(r3.nota.texto)}</span>`, 940);
  html += FULLDIV('pl-r3', med['pl-r3'].a, med['pl-r3'].b, 4, h, 'pl');
  datos.push({ que: 'r3 número en pantalla', sel: '#r3-num b', t: r3.pill_num_t + 0.6, txt: fm(num) });
}

// ── lección: las tres razones juntas (miniatura + nombre), la caja «imagen entera» las rodea al final ──
{
  const L = plan.lec, lp = plan.r1.lupa, f5 = caras.frames.fr_m5, f4 = caras.frames.fr_m4, a = plan.r3.aro, d = L.lado, reg = lp.region;
  const [bx1, by1, bx2, by2] = f5.caja, cx = (bx1 + bx2) / 2, cy = (by1 + by2) / 2, s = d / reg;
  let h = '';
  // fila 1: la cara de 89 px ampliada
  h += `<div class="thumb" id="le-i1" style="left:${L.x}px;top:${L.y0}px;width:${d}px;height:${d}px;background-image:url(${plan.frames.m5.src});background-size:${Math.round(plan.r1.win.w * s)}px ${Math.round(plan.r1.win.h * s)}px;background-position:${-Math.round((cx - reg / 2) * s)}px ${-Math.round((cy - reg / 2) * s)}px"></div>`;
  // fila 2: la escala ampliada con las dos medidas y la banda (mini)
  const rr = plan.r2, mx = (v) => Math.round(18 + (d - 36) * (v - E2.desde) / (E2.hasta - E2.desde)), my = 150, mb = rr.banda;
  h += `<div class="thumb" id="le-i2" style="left:${L.x}px;top:${L.y0 + L.paso}px;width:${d}px;height:${d}px">` +
    `<div class="ruido" style="left:${mx(mb.centro - mb.mas_menos)}px;top:${my - 62}px;width:${mx(mb.centro + mb.mas_menos) - mx(mb.centro - mb.mas_menos)}px;height:124px"></div>` +
    `<div class="trk" style="left:18px;top:${my - 7}px;width:${d - 36}px;height:14px"><div class="zona" style="left:0;right:0"></div></div>` +
    `<div class="dot f" style="left:${mx(rr.d1.valor)}px;top:${my}px;width:24px;height:24px;margin-left:-12px;margin-top:-12px"></div><div class="dot f" style="left:${mx(rr.d2.valor)}px;top:${my}px;width:24px;height:24px;margin-left:-12px;margin-top:-12px"></div></div>`;
  // fila 3: el letrero inventado con su aro
  const s3 = d / reg, bw3 = Math.round(plan.r3.win.w * s3), bh3 = Math.round(plan.r3.win.h * s3);
  const rx = Math.max(0, a.cx - reg / 2), ry = Math.max(0, a.cy - reg / 2);          // la región de la miniatura no se sale de la imagen (si no, queda una franja negra)
  const ax = Math.round((a.cx - rx) * s3), ay = Math.round((a.cy - ry) * s3);       // centro del aro dentro de la miniatura
  h += `<div class="thumb" id="le-i3" style="left:${L.x}px;top:${L.y0 + 2 * L.paso}px;width:${d}px;height:${d}px;background-image:url(${plan.frames.m4.src});background-size:${bw3}px ${bh3}px;background-position:${-Math.round(rx * s3)}px ${-Math.round(ry * s3)}px">` +
    `<div class="aro" style="left:${Math.round(ax - a.w * s3 * 0.38)}px;top:${Math.round(ay - a.h * s3 * 0.38)}px;width:${Math.round(a.w * s3 * 0.76)}px;height:${Math.round(a.h * s3 * 0.76)}px;border-width:5px"></div></div>`;
  L.filas.forEach((f, i) => { h += `<div class="rowt" id="le-t${i + 1}" style="left:${L.x + d + 40}px;top:${L.y0 + i * L.paso + Math.round((d - 58) / 2)}px">${esc(f.texto)}</div>`; });
  h += `<div class="anillo" id="le-ring" style="left:50px;top:${L.y0 - 28}px;width:950px;height:${2 * L.paso + d + 56}px"></div>`;
  html += FULLDIV('pl-lec', med['pl-lec'].a, med['pl-lec'].b, 4, h, 'pl');
}

// ── tarjetas narrativas (+ pila de dato en las que lo llevan). La entrada arranca 1 cuadro ANTES de que termine la anterior, salvo en los empujes (viajan) ──
const viajaEntra = new Set(plan.costuras.filter((c) => c.tarjetas).map((c) => c.tarjetas.entra));
const viajaSale = new Set(plan.costuras.filter((c) => c.tarjetas).map((c) => c.tarjetas.sale));
const primeras = new Set(plan.cadenas_de_tarjetas.map((c) => c[0]));
for (const c of plan.tarjetas) c.entra = f2(c.a - (viajaEntra.has(c.id) ? PUSH : primeras.has(c.id) ? 0 : FR));
for (const c of plan.tarjetas) {
  const t = c.texto.endsWith('\n') ? esc(c.texto.slice(0, -1)) + '<br>' : esc(c.texto) + (c.acento ? ' ' : '');
  const clsA = [c.acento_t ? 'late' : '', c.color === 'bad' ? 'bad' : ''].filter(Boolean).join(' ');
  const acento = c.acento ? `<b${clsA ? ` class="${clsA}"` : ''}>${esc(c.acento)}</b>` : '';
  let extras = '';
  if (c.dato) {
    const m = dato[c.dato];
    extras += `<div class="drow" id="d-${m.id}"><span class="tag tag-d dg${cls(m.estado)}" id="dA-${m.id}"><i></i>${esc(m.pill)} <b>${fm(m.valor)}</b></span></div>`;
  }
  html += `<div id="cc-${c.id}" class="clip cc cc-bot" data-start="${c.entra}" data-duration="${f2(c.b - c.entra)}" data-track-index="${3 + (plan.tarjetas.indexOf(c) % 2)}" style="--b:${Z.tarjeta_bottom_y}px">` +
    `<div class="stk">${extras}<div class="cw" id="${c.id}"><i class="sh sh1"></i><i class="sh sh2"></i><div class="card"><div class="rail"></div><div class="t">${t}${acento}</div></div></div></div></div>\n`;
}

const css = fs.readFileSync(path.join(P, 'scripts/estilos.css'), 'utf8').replaceAll('{{ACC}}', ACC).replaceAll('{{BAD}}', BAD);
const tlJs = fs.readFileSync(path.join(P, 'scripts/timeline.js'), 'utf8');
const existe = (id) => html.includes(`id="${id}"`);
const costuras = plan.costuras.filter((c) => c.tipo === 'empuje').map((c) => ({
  t: c.t,
  sale: [...c.sale, ...(c.tarjetas ? [c.tarjetas.sale] : [])].filter(existe),
  entra: [...c.entra, ...(c.tarjetas ? [c.tarjetas.entra] : [])].filter(existe),
}));
const PLAN_JS = {
  W, H, FR, PUSH, PEASE: plan.empuje.ease, E_IN, E_OUT, costuras, ACC, DUR,
  zoom: plan.zoom.fin,
  fotos: fotosPlan, cajas,
  tarjetas: plan.tarjetas.map(({ id, entra, b, acento_t }) => ({ id, a: +entra, b, acento_t: acento_t || null, en_empuje_entra: viajaEntra.has(id), en_empuje_sale: viajaSale.has(id) })),
  rotulo: plan.rotulo,
  datos: Object.values(dato).map((m) => ({ id: m.id, a: m.t, fin: m.fin })),
  p1: { fila2: plan.p1.refs.fila2_t, esc: plan.p1.refs.escalon, aro_t: plan.p1.aro_t },
  p2: { flecha_t: plan.p2.flecha.t, ...plan.p2.escala },
  r1: { box_t: plan.r1.box_t, tag_t: plan.r1.tag_t, lupa_t: plan.r1.lupa_t, nota_t: plan.r1.nota.t },
  r2: { d1: plan.r2.d1.t, d2: plan.r2.d2.t, banda: plan.r2.banda.t, pie: plan.r2.pie.t, nota: plan.r2.nota.t },
  r3: { aro: plan.r3.aro.t, lab: plan.r3.pill_letrero_t, num: plan.r3.pill_num_t, nota: plan.r3.nota.t },
  lec: { filas: plan.lec.filas.map((f, i) => ({ n: i + 1, t: f.t })), anillo_t: plan.lec.anillo_t },
};
const out = `<!doctype html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=${W}, height=${H}">
<title>Lucía · G5</title>
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

// ───────────────────────── 3) manifiestos para los controles (qa/) ─────────────────────────
// eventos visuales (para scripts/eventos.mjs)
const ev = [];
const ev_ = (t, que) => ev.push({ t: +(+t).toFixed(3), que });
for (const c of plan.tarjetas) { ev_(c.a, c.id); if (c.acento_t) ev_(c.acento_t, c.id + ' acento'); }
ev_(plan.rotulo.b, 'rótulo IA sale'); ev_(plan.gancho.caja_t, 'gancho caja de cara'); ev_(plan.gancho.dato.t, 'gancho dato'); ev_(plan.gancho.dato.fin, 'gancho dato sale');
plan.refs.recortes.slice(4).forEach((m, i) => ev_(plan.p1.refs.fila2_t + i * plan.p1.refs.escalon, 'p1 ref ' + (i + 5))); ev_(plan.p1.aro_t, 'p1 aro de las 8');
const es = plan.p2.escala; ev_(plan.p2.flecha.t, 'p2 flecha'); ev_(es.dibuja_t, 'p2 escala'); ev_(es.ejes_t, 'p2 ejes'); ev_(es.uno_t, 'p2 «1»'); ev_(es.marca_t, 'p2 marca 0,70');
for (const e of plan.ejemplos) { ev_(e.box_t, e.id + ' caja'); ev_(e.t, e.id + ' dato'); ev_(e.fin, e.id + ' dato sale'); }
const q1 = plan.r1; ev_(q1.box_t, 'r1 caja'); ev_(q1.tag_t, 'r1 «89 px»'); ev_(q1.lupa_t, 'r1 lupa'); ev_(q1.nota.t, 'r1 nota');
const q2 = plan.r2; ev_(q2.d1.t, 'r2 medida 1'); ev_(q2.d2.t, 'r2 medida 2'); ev_(q2.banda.t, 'r2 banda'); ev_(q2.pie.t, 'r2 pie'); ev_(q2.nota.t, 'r2 nota');
const q3 = plan.r3; ev_(q3.aro.t, 'r3 aro'); ev_(q3.pill_letrero_t, 'r3 «letrero inventado»'); ev_(q3.pill_num_t, 'r3 número'); ev_(q3.nota.t, 'r3 nota');
plan.lec.filas.forEach((f, i) => ev_(f.t, 'lección fila ' + (i + 1))); ev_(plan.lec.anillo_t, 'lección caja');
for (const c of plan.costuras) ev_(c.t, 'costura');
fs.mkdirSync(path.join(P, 'qa'), { recursive: true });
fs.writeFileSync(path.join(P, 'qa/eventos-plan.json'), JSON.stringify(ev, null, 1));
fs.writeFileSync(path.join(P, 'qa/elementos-texto.json'), JSON.stringify(lecturas.map(({ id, que, texto, n, a, b, min }) => ({ id, que, texto, n, a, b, min })), null, 1));
fs.writeFileSync(path.join(P, 'qa/datos-plan.json'), JSON.stringify(datos, null, 1));

// ───────────────────────── 4) tabla de cortes ─────────────────────────
console.log('Tabla de cortes (t en s):');
for (const m of plan.medios) console.log(`  ${m.a.toFixed(3).padStart(7)} – ${m.b.toFixed(3).padEnd(7)} ${m.id.padEnd(9)} ${m.tipo.padEnd(5)} ${m.capa}`);
console.log('Costuras (empuje rígido de 6 cuadros):');
for (const c of plan.costuras) console.log(`  ${c.t.toFixed(2).padStart(6)}  ${c.tipo}  sale ${c.sale.join(',')} → entra ${c.entra.join(',')}`);
console.log('Tarjetas (entra = 1 cuadro antes de a salvo en los empujes, donde viajan):');
for (const c of plan.tarjetas) console.log(`  ${c.a.toFixed(2).padStart(6)} – ${c.b.toFixed(2).padEnd(6)} ${c.id.padEnd(3)} ${String(c.n_palabras)} pal (mín ${c.min_s} s) «${(c.texto.replace(/\n/g, ' ') + ' ' + (c.acento || '')).trim()}»${viajaEntra.has(c.id) ? ' [entra con el empuje]' : ''}${viajaSale.has(c.id) ? ' [sale con el empuje]' : ''}`);
console.log('Lecturas de rótulo, datos, notas, placas (≥ 0,35 s/palabra + 0,3):');
for (const x of lecturas) console.log(`  ${x.que.padEnd(24)} ${String(x.n).padStart(2)} pal  ${x.a.toFixed(2)}–${x.b.toFixed(2)}  ${x.dur.toFixed(2)} s  (pide ${x.min.toFixed(2)})  ${x.dur - x.min < 0.2 ? '← justo' : ''}`);
console.log('Lo que el video afirma, contra los datos:');
for (const c of claim) console.log('  ' + c);
console.log('Agregados al guion (reversibles, ver plan.json):', plan.agregados_al_guion.map((a) => a.id).join(', '));
console.log(`ok: index.html (${Math.round(out.length / 1024)} KB)`);
