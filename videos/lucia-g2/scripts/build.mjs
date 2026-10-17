#!/usr/bin/env node
// Lucía · G2 «La misma foto, seis clips: ¿quién pierde la cara?» (58 s, 1080x1920, 24 fps) — montaje con HyperFrames (2da pasada, 9-oct-2026: revisión H1-H9).
// Lee plan.json (capas, tiempos, datos) → valida reglas de texto, costuras Y LOS NÚMEROS contra v4/PROCEDENCIA.jsonl → escribe index.html
// (DOM estático + un único timeline GSAP). 0 créditos: seis clips y una foto ya pagados + 8 referencias oficiales bajadas por curl.
// Método y trampas: .claude/skills/lucia/montaje-hyperframes.md (medido en G1 y G3). Plantilla: videos/lucia-g3/.
// Uso:  node scripts/build.mjs   (copia/baja el material, genera miniaturas con ffmpeg si faltan, valida e imprime la tabla de cortes)
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
const r2 = (v) => Math.round(v * 100 + 1e-7) / 100;             // 2 decimales, media hacia arriba (0,805 → 0,81; 0,785 → 0,79; 0,798 → 0,80)
const f2 = (n) => +(+n).toFixed(3);
const fm = (v) => v.toFixed(2).replace('.', ',');
const fm1 = (v) => (Math.round(v * 10 + 1e-7) / 10).toFixed(1).replace('.', ',');

// ───────────────────────── 0) material ─────────────────────────
const R = path.resolve(P, '../..');
const V4 = path.join(R, 'hermes-content/references/modelos/lucia/v4');
const KIT = path.join(V4, 'kit');
const PM = path.join(V4, 'prueba-motores-20261008');
const FONTS = path.join(R, 'hermes-content/brand/fonts');
const COPIAS = [
  ['assets/k1.jpg', path.join(KIT, 'k1-1-recepcion-celular-4afffb96.jpg')],
  ['assets/m1.mp4', path.join(KIT, 'k1-clip-mira-camara-e470ef4f.mp4')],
  ['assets/m2.mp4', path.join(PM, 'kling-pro-9f43ee3c.mp4')],
  ['assets/m3.mp4', path.join(PM, 'seedance-mini-a7f79a01.mp4')],
  ['assets/m4.mp4', path.join(PM, 'seedance-mini-refs-dd2d7c91.mp4')],
  ['assets/m5.mp4', path.join(PM, 'kling-omni-948a89d3.mp4')],
  ['assets/m6.mp4', path.join(PM, 'cinema30-cc8fa519.mp4')],
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
const curl = (url, out) => execFileSync('curl', ['-sSf', '-m', '120', '-o', out, url], { stdio: 'inherit' });
const gs = path.join(P, 'assets/vendor/gsap.min.js');      // GSAP local (el render no puede depender de la red): 3.14.2, la versión del scaffold de HyperFrames 0.8.142
if (!fs.existsSync(gs)) {
  fs.mkdirSync(path.dirname(gs), { recursive: true });
  const g1 = path.join(R, 'videos/lucia-g3/assets/vendor/gsap.min.js'), g0 = path.join(R, 'videos/lucia-g1/assets/vendor/gsap.min.js');
  if (fs.existsSync(g1)) fs.copyFileSync(g1, gs); else if (fs.existsSync(g0)) fs.copyFileSync(g0, gs); else curl('https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js', gs);
}
const ff = (args) => execFileSync('ffmpeg', ['-v', 'error', '-y', ...args], { stdio: 'inherit' });
const A = (n) => path.join(P, 'assets', n);

// 8 referencias oficiales (0 cr: son las URL públicas del manifiesto de v4/qa) → recortes de cara de 5 de ellas (assets/ref1-5.jpg)
const manifest = JSON.parse(fs.readFileSync(path.join(R, plan.refs.manifest), 'utf8'));
const refNames = Object.keys(manifest.refs);
fs.mkdirSync(A('refs-orig'), { recursive: true });
for (const m of plan.refs.muestra) {
  const out = A(`ref${m.id.slice(3)}.jpg`);
  if (fs.existsSync(out)) continue;
  const key = refNames.find((k) => k.startsWith(m.fuente.split('_')[0] + '_'));
  const url = manifest.refs[key];
  const orig = A(`refs-orig/${key}${path.extname(url)}`);
  if (!fs.existsSync(orig)) curl(url, orig);
  const [ox, oy, s] = m.recorte;
  ff(['-i', orig, '-vf', `crop=${s}:${s}:${ox}:${oy},scale=360:360:flags=lanczos`, '-frames:v', '1', '-q:v', '2', '-update', '1', out]);
}
// miniaturas de los seis clips (cuadro 90 = 3,75 s)
for (const m of plan.motores) {
  const out = A(`th${m.n}.jpg`);
  if (!fs.existsSync(out)) ff(['-i', A(`${m.id}.mp4`), '-vf', `select=eq(n\\,${plan.gancho.miniaturas.cuadro}),scale=272:484:flags=lanczos`, '-frames:v', '1', '-vsync', '0', '-q:v', '2', '-update', '1', out]);
}

// ───────────────────────── 1) reglas (se corta el build si alguna falla) ─────────────────────────
const errores = [];
const palabras = (t) => `${t.texto} ${t.acento || ''}`.trim().split(/\s+/).filter((s) => s && s !== '·');
for (const c of plan.tarjetas) {
  const n = palabras(c).length, min = n * 0.35 + 0.3, dur = c.b - c.a;
  if (n > 6) errores.push(`${c.id}: ${n} palabras (máx 6)`);
  if (dur < min - 1e-9) errores.push(`${c.id}: dura ${dur.toFixed(2)} s y necesita ${min.toFixed(2)} s para ${n} palabras`);
  if (c.id === 'c1' && c.a > 0.15 + 1e-9) errores.push('c1: la primera tarjeta entra después de 0,15 s');
  if (c.acento_t != null && (c.acento_t < c.a + 0.5 - 1e-9 || c.acento_t > c.b - 0.5 + 1e-9)) errores.push(`${c.id}: acento_t ${c.acento_t} fuera de [a+0,5, b-0,5]`);
  c.n_palabras = n; c.min_s = +min.toFixed(2);
}
const med = Object.fromEntries(plan.medios.map((m) => [m.id, m]));
const tj = Object.fromEntries(plan.tarjetas.map((c) => [c.id, c]));
for (const m of plan.medios) if (m.tipo === 'clip') {
  const n = (m.b - m.a) * FPS + (m.media_inicio || 0) * FPS, max = m.id === 'm6' ? 97 : 145;
  if (n > max + 1e-6) errores.push(`${m.id}: pide hasta el cuadro ${n.toFixed(2)} y el clip tiene ${max}`);
}
// cadena de tarjetas: contiguas (b de una = a de la siguiente)
for (const cad of plan.cadenas_de_tarjetas) for (let i = 1; i < cad.length; i++) {
  if (Math.abs(tj[cad[i]].a - tj[cad[i - 1]].b) > 1e-9) errores.push(`${cad[i - 1]}→${cad[i]}: no son contiguas (${tj[cad[i - 1]].b} vs ${tj[cad[i]].a})`);
}
// costuras: el medio entrante arranca en T−6 cuadros; el saliente termina en T (un clip puede pasarse 1 cuadro: ese cuadro cae fuera de pantalla)
for (const c of plan.costuras) if (c.tipo === 'empuje') {
  for (const id of c.entra) if (med[id] && Math.abs(med[id].a - (c.t - PUSH)) > 1e-6) errores.push(`costura ${c.t}: «${id}» debe empezar en ${(c.t - PUSH).toFixed(3)} y empieza en ${med[id].a}`);
  for (const id of c.sale) if (med[id]) {
    const d = med[id].b - c.t;
    if (d < -1e-6 || d > (med[id].tipo === 'clip' ? FR : 0) + 1e-6) errores.push(`costura ${c.t}: «${id}» debe terminar en ${c.t} y termina en ${med[id].b}`);
  }
  if (c.tarjetas) {
    const s = tj[c.tarjetas.sale], e = tj[c.tarjetas.entra];
    if (!s || !e) { errores.push(`costura ${c.t}: tarjeta «${c.tarjetas.sale}» o «${c.tarjetas.entra}» no existe`); continue; }
    if (Math.abs(s.b - c.t) > 1e-6) errores.push(`costura ${c.t}: la tarjeta «${s.id}» debe terminar en ${c.t} y termina en ${s.b}`);
    if (Math.abs(e.a - c.t) > 1e-6) errores.push(`costura ${c.t}: la tarjeta «${e.id}» debe entrar en ${c.t} y entra en ${e.a}`);
  }
}
// el clip M6 (sus primeros 60 cuadros: la placa del precio entra a 44,25 s, H1) y el cierre K1 de 2,0 a 5,5 s (84 cuadros, H7): sin acelerar, estirar ni congelar
if (Math.abs((med.m6.b - med.m6.a) * FPS - 60) > 1e-6) errores.push('m6: usa sus primeros 60 cuadros (2,5 s)');
if (Math.abs((med.k1.b - med.k1.a) - 3.5) > 1e-6) errores.push('k1: el cierre dura 3,5 s');
if (Math.abs(med.k1.media_inicio - 2.0) > 1e-6) errores.push('k1: el cierre arranca en el segundo 2,0 del clip (H7: ya mira a cámara)');
if (Math.abs(med.m6.a - 42.0) > 1e-6) errores.push('m6 arranca a 42,0 s');
// los números salen de PROCEDENCIA.jsonl (última línea «resultados»): arranque, final y créditos de cada motor
{
  const lines = fs.readFileSync(path.join(V4, 'PROCEDENCIA.jsonl'), 'utf8').split('\n').filter(Boolean).map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
  const res = lines.filter((l) => /resultados$/.test(l.type || '')).at(-1);
  if (!res) errores.push('PROCEDENCIA.jsonl: no hay línea «resultados»');
  else {
    const v = res.video_misma_foto_K1_misma_orden;
    for (const m of plan.motores) {
      const d = v[m.clave];
      if (!d) { errores.push(`${m.id}: «${m.clave}» no está en PROCEDENCIA.jsonl`); continue; }
      const ini = r2(d.id[0]), fin = r2(d.id.at(-1));
      if (ini !== m.ini) errores.push(`${m.id}: arranque ${m.ini} y PROCEDENCIA dice ${d.id[0]} → ${ini}`);
      if (fin !== m.fin) errores.push(`${m.id}: final ${m.fin} y PROCEDENCIA dice ${d.id.at(-1)} → ${fin}`);
      if (d.cr !== m.cr) errores.push(`${m.id}: ${m.cr} créditos y PROCEDENCIA dice ${d.cr}`);
      const tf = d.t ? d.t.at(-1) : 5.9;                 // las muestras sin «t» usan los mismos instantes que el control (0-5 de a 1 s y 5,9 s)
      if (!d.t && d.id.length !== 7) errores.push(`${m.id}: se esperaban 7 muestras y hay ${d.id.length}`);
      if (Math.abs(tf - m.t_fin) > 0.051) errores.push(`${m.id}: t_fin ${m.t_fin} y la última muestra es ${tf}`);
      m._valores = d.id;
    }
    // «4 veces el precio» = créditos POR SEGUNDO: Motor 6 = 20 cr por 4 s; Motor 1 = 7,5 cr por 6 s
    const cp = plan.m6plate.cr_por_s;
    if (Math.abs(20 / 4 - cp.m6) > 1e-9 || Math.abs(7.5 / 6 - cp.m1) > 1e-9) errores.push('cr_por_s no sale de 20÷4 y 7,5÷6');
    if (Math.abs(cp.m6 / cp.m1 - 4) > 1e-9) errores.push('el sello «4×» no es exacto');
    if (res.video_misma_foto_K1_misma_orden.cinematic_studio_3_0_4s_720p_cc8fa519 && false) { /* silencio */ }
  }
}
if (refNames.length !== plan.refs.total) errores.push(`el manifiesto trae ${refNames.length} referencias y la tarjeta dice ${plan.refs.total}`);
// tags y sellos dentro de la vida de su tarjeta y antes del empuje de salida; el sello del Motor 4 antes de que baje el mentón
for (const m of plan.motores) {
  const c = plan.tarjetas.find((t) => t.motor === m.id), cm = med[m.id];
  const salida = c.b - PUSH;
  if (m.tag_a < c.a - 0.1 || (!m.sin_b && m.tag_b <= m.tag_a) || m.tags_fin > salida + 0.06) errores.push(`${m.id}: tags (${m.tag_a}/${m.tag_b}/${m.tags_fin}) fuera de la vida de la tarjeta (${c.a}-${salida})`);
  if (m.id === 'm6' && m.tags_fin > 44.3 + 1e-9) errores.push('m6: los tags tienen que salir antes del empuje de 44,25 s');
  if (m.sello && (m.sello.t < m.tag_a - 1e-9 || m.sello.t > m.tags_fin - 0.5)) errores.push(`${m.id}: sello a ${m.sello.t} fuera de [tag_a, tags_fin-0,5]`);
  if (m.id === 'm4' && (m.tags_fin - cm.a) > 4.65) errores.push('m4: el sello baja de y=1056 (mentón + 40) después de 4,65 s del clip');
}
// aro del Motor 4: dentro del clip, 4 puntos
{
  const a = plan.aro_m4;
  if (a.a < med.m4.a + 1.0 || a.b > med.m4.b - PUSH) errores.push('aro_m4: fuera de la ventana del clip');
}
// la nota de la lección 2 («Caras de 89 a 348 px») sale de la medición, no de memoria: mínimo y máximo del ancho de cara en todos los cuadros medidos
{
  const cm = JSON.parse(fs.readFileSync(path.join(P, 'qa/caras-por-clip.json'), 'utf8'));
  const px = Object.values(cm.clips).flatMap((c) => c.filas.filter((r) => r[1]).map((r) => r[3]));
  const [lo, hi] = [Math.min(...px), Math.max(...px)];
  const nums = (plan.l2.nota.linea2.match(/\d+/g) || []).map(Number);
  if (nums[0] !== lo || nums[1] !== hi) errores.push(`l2.nota: dice ${nums[0]} a ${nums[1]} px y la medición da ${lo} a ${hi}`);
}
// pie idéntico al del guion
{
  const g0 = fs.readFileSync(path.join(R, plan.guion), 'utf8');
  const g = g0.slice(g0.indexOf('\n## Pie'));              // el pie es el bloque «…» de la sección «## Pie» (hay otros «…» antes)
  const mm = g.match(/\*«([\s\S]+?)»\*\s*`([^`]+)`/);
  if (!mm) errores.push('no se encontró el pie en el guion');
  else {
    const pie = `${mm[1].replace(/\s+/g, ' ').trim()} ${mm[2].trim()}`;
    const pp = path.join(P, 'pie.txt');
    if (!fs.existsSync(pp)) fs.writeFileSync(pp, pie);
    else if (fs.readFileSync(pp, 'utf8') !== pie) errores.push('pie.txt no es idéntico al del guion');
  }
}
// ── tiempo de lectura de TODO texto que no es una tarjeta (sellos, pastillas, notas, rótulos de barras, placa del Motor 6): ≥ 0,35 s por palabra + 0,3 s,
//    medido de que entra a que sale (la métrica del revisor: 2da pasada, H1/H2/H8). Se cuenta con este script, no a ojo. ──
const lecturas = [];
{
  const nw = (t) => String(t).replace(/<[^>]+>/g, ' ').split(/\s+/).filter((x) => x && x !== '·' && x !== '→').length;
  const L = (que, texto, a, b) => lecturas.push({ que, texto, n: nw(texto), a, b, dur: b - a, min: nw(texto) * 0.35 + 0.3 });
  for (const m of plan.motores) {
    L(`${m.id} dato A`, `parecido 0 s: ${fm(m.ini)}`, m.tag_a, m.tags_fin);
    if (!m.sin_b) L(`${m.id} dato B`, `${fm1(m.t_fin)} s: ${fm(m.fin)}`, m.tag_b, m.tags_fin);
    if (m.sello) L(`${m.id} sello`, m.sello.texto, m.sello.t, m.tags_fin);
    if (m.pastilla) L(`${m.id} pastilla`, m.pastilla.texto, m.pastilla.t, m.tags_fin);
  }
  const l1f = med['pl-l1'].b - PUSH, l2f = med['pl-l2'].b - PUSH, q = plan.m6plate, qa = med['pl-m6'].a + PUSH, qf = med['pl-m6'].b - PUSH;
  L('l1 leyenda', 'arranque (0 s) final (5,9 s)', plan.l1.leyenda_t, l1f);
  L('l1 nota del final', plan.l1.leyenda_nota, plan.l1.leyenda_t, l1f);
  L('l2 nota línea 1', plan.l2.nota.linea1, plan.l2.nota.t, l2f);
  L('l2 nota línea 2', plan.l2.nota.linea2, plan.l2.nota.t, l2f);
  plan.l2.orden.forEach((id, i) => {
    const B = plan.l2.barra, t0 = B.t0 + i * B.escalon + B.d, ch = plan.l2.cambios.find((c) => c.motor === id), n = plan.motores.find((m) => m.id === id).n;
    L(`l2 rótulo Motor ${n}`, `Motor ${n} · ${plan.l2.descriptor[id]}`, t0, ch ? ch.t : l2f);
    if (ch) L(`l2 rótulo Motor ${n} (cambia)`, `Motor ${n} · ${ch.texto}`, ch.t + 0.2, l2f);
  });
  L('m6 placa «mi piso»', 'mi piso · 0,70', q.escala_t + 0.05 + E_IN, qf);
  const m6 = plan.motores.find((m) => m.id === 'm6');
  L('m6 placa número', `${fm(m6.fin)} cierre del clip (${fm1(m6.t_fin)} s)`, qa, qf);
  L('m6 placa Motor 6', `Motor 6: ${q.cr_por_s.m6} créditos por segundo`, qa, qf);
  L('m6 placa Motor 1', `Motor 1: ${q.cr_por_s.m1} créditos por segundo`, qa, qf);
  L('m6 placa sello', `${q.cr_por_s.m6 / q.cr_por_s.m1}× el precio por segundo`, q.sello_t, qf);
  for (const x of lecturas) if (x.dur < x.min - 1e-9) errores.push(`lectura «${x.que}» (${x.n} palabras): ${x.dur.toFixed(2)} s y pide ${x.min.toFixed(2)} s`);
}
if (errores.length) { console.error('✖ reglas:\n  ' + errores.join('\n  ')); process.exit(1); }

// ───────────────────────── 2) HTML ─────────────────────────
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
let html = '';
let track = 40;
const nextTrack = () => track++;
const kM = med;
const FULL = 'position:absolute;left:0;top:0;width:1080px;height:1920px;object-fit:cover;';
const img = (m, z, tr) => `<img id="${m.id}" class="clip" src="${m.src}" data-start="${f2(m.a)}" data-duration="${f2(m.b - m.a)}" data-track-index="${tr}" style="${FULL}z-index:${z};" alt="">`;
const vid = (m, z, tr) => `<video id="${m.id}" src="${m.src}" data-start="${f2(m.a)}"${m.media_inicio ? ` data-media-start="${f2(m.media_inicio)}"` : ''} data-duration="${f2(m.b - m.a)}" data-track-index="${tr}" muted playsinline preload="auto" style="${FULL}z-index:${z};"></video>`;
const FULLDIV = (id, a, b, z, inner, cls = '') => `<div id="${id}" class="clip ${cls}" data-start="${f2(a)}" data-duration="${f2(b - a)}" data-track-index="${nextTrack()}" style="position:absolute;left:0;top:0;width:1080px;height:1920px;z-index:${z}">${inner}</div>\n`;
// elemento centrado en cx sin tocar transform (GSAP lo pisaría): contenedor flex de ancho fijo
const cent = (cx, top, inner, w = 760) => `<div class="ab" style="left:${Math.round(cx - w / 2)}px;top:${top}px;width:${w}px;display:flex;justify-content:center">${inner}</div>`;

html += img(kM.foto, 1, 1) + '\n';
html += vid(kM.m1, 1, 20) + '\n' + vid(kM.m2, 1, 21) + '\n' + vid(kM.m3, 1, 22) + '\n' + vid(kM.m4, 1, 23) + '\n' + vid(kM.m5, 1, 24) + '\n' + vid(kM.m6, 1, 25) + '\n' + vid(kM.k1, 1, 26) + '\n';

// rótulo de IA (cuadro 0 → 2,4 s)
{
  const r = plan.rotulo;
  html += `<div id="cc-rotulo" class="clip cc cc-top" data-start="${f2(r.a)}" data-duration="${f2(r.b - r.a)}" data-track-index="${nextTrack()}" style="--t:${r.top}px"><div class="cw" id="rotulo"><span class="tag"><i></i>${esc(r.texto)}</span></div></div>\n`;
}

// gancho: 6 miniaturas de los clips (viajan con la foto en el empuje de 6,0 s)
{
  const g = plan.gancho.miniaturas;
  const items = plan.motores.map((m, i) => `<div class="th" id="th${m.n}" style="left:${g.x0 + i * (g.w + g.gap)}px;top:${g.y}px;width:${g.w}px;height:${g.h}px"><img src="assets/th${m.n}.jpg" alt=""><span>${m.n}</span></div>`).join('');
  html += FULLDIV('thumbs', g.a - 0.1, kM.foto.b, 8, items);
}

// ── placa de la regla: 5 de las 8 referencias + escala 0-1 con la marca en 0,70 ──
{
  const rg = plan.regla, rf = rg.refs, es = rg.escala, y = es.y;
  let h = '';
  plan.refs.muestra.forEach((m, i) => { h += `<div class="ref" id="rf${i + 1}" style="left:${rf.x0 + i * (rf.lado + rf.gap)}px;top:${rf.y}px;width:${rf.lado}px;height:${rf.lado}px"><img src="assets/ref${i + 1}.jpg" alt=""></div>`; });
  h += cent(540, rf.etiqueta_y, `<span class="tag tag-d" id="rf-l"><i></i>${plan.refs.muestra.length} de las ${plan.refs.total} fotos de referencia</span>`, 900);
  h += `<div class="trk" id="sc-trk" style="left:${SC.x0}px;top:${y}px;width:${SC.x1 - SC.x0}px"><div class="zona" id="sc-zona" style="left:${X(SC.piso) - SC.x0}px;right:0"></div></div>`;
  h += `<div class="mkv" id="sc-mk" style="left:${X(SC.piso)}px;top:${y - 62}px;height:96px"></div>`;
  h += cent(X(SC.piso), es.marca_label_y, `<span class="tag tag-d" id="sc-mkl"><i></i>mi piso · <b>${fm(SC.piso)}</b></span>`, 560);
  h += `<div class="ax" id="sc-ax0" style="left:${SC.x0}px;top:${y + 50}px">0</div>`;
  h += `<div class="ax r" id="sc-ax1" style="left:${SC.x1 - 420}px;width:420px;top:${y + 50}px">idéntica · 1</div>`;
  html += FULLDIV('pl-regla', kM['pl-regla'].a, kM['pl-regla'].b, 4, h, 'pl');
}

// ── lección 1: tres arranques y tres finales (Motores 1-3) ──
const mot = Object.fromEntries(plan.motores.map((m) => [m.id, m]));
const bajo = (v) => v < SC.piso - 1e-9;
{
  const L = plan.l1;
  let h = cent(540, L.leyenda_y, `<span class="tag tag-d" id="l1-leg"><span class="leg"><span class="dot s"></span>arranque (<b>0 s</b>)</span><span class="leg"><span class="dot f"></span>final (<b>${fm1(mot.m1.t_fin)} s</b>)</span></span>`, 920);
  const top0 = L.filas[0].y - 120, hh = L.filas.at(-1).y + 120 - top0;
  h += cent(540, L.leyenda_nota_y, `<span class="sub" id="l1-nota">${esc(L.leyenda_nota)}</span>`, 920);
  h += `<div class="mkv" id="l1-mk" style="left:${X(SC.piso)}px;top:${top0}px;height:${hh}px"></div>`;
  h += cent(X(SC.piso), L.marca_label_y, `<span class="tag tag-d" id="l1-mkl"><i></i>mi piso · <b>${fm(SC.piso)}</b></span>`, 560);
  L.filas.forEach((f, i) => {
    const m = mot[f.motor], xi = X(m.ini), xf = X(m.fin), n = i + 1;
    h += `<div class="rt" id="l1-t${n}" style="left:${SC.x0}px;top:${f.y - 86}px">Motor ${m.n}</div>`;
    h += `<div class="rl" id="l1-r${n}" style="left:${SC.x0}px;top:${f.y - 5}px;width:${SC.x1 - SC.x0}px"></div>`;
    h += `<div class="seg" id="l1-g${n}" style="left:${Math.min(xi, xf)}px;top:${f.y}px;width:${Math.abs(xi - xf)}px"></div>`;
    h += `<div class="dot s" id="l1-s${n}" style="left:${xi}px;top:${f.y}px"></div>`;
    h += `<div class="dot f${bajo(m.fin) ? ' bajo' : ''}" id="l1-f${n}" style="left:${xf}px;top:${f.y}px"></div>`;
    h += `<div class="ab" style="left:${xi - 90}px;top:${f.y - 74}px;width:180px;display:flex;justify-content:center"><span class="vl${bajo(m.ini) ? ' bajo' : ''}" id="l1-vs${n}" style="transform:none">${fm(m.ini)}</span></div>`;
    h += `<div class="ab" style="left:${xf - 90}px;top:${f.y + 28}px;width:180px;display:flex;justify-content:center"><span class="vl${bajo(m.fin) ? ' bajo' : ''}" id="l1-vf${n}" style="transform:none">${fm(m.fin)}</span></div>`;
  });
  const ya = L.filas.at(-1).y + 112;
  h += `<div class="ax" id="l1-ax0" style="left:${SC.x0}px;top:${ya}px">0</div><div class="ax r" id="l1-ax1" style="left:${SC.x1 - 420}px;width:420px;top:${ya}px">1</div>`;
  html += FULLDIV('pl-l1', kM['pl-l1'].a, kM['pl-l1'].b, 4, h, 'pl');
}

// ── lección 2: los seis finales ordenados (barras sobre la escala 0-1, marca en 0,70) ──
const L2 = plan.l2;
const l2rows = L2.orden.map((id, i) => {
  const m = mot[id], B = L2.barra, w = Math.round(m.fin * (SC.x1 - SC.x0)), top = B.y0 + i * B.paso;
  return { id, m, w, top, t: B.t0 + i * B.escalon, ch: L2.cambios.find((c) => c.motor === id) };
});
{
  let h = cent(X(SC.piso), L2.marca_label_y, `<span class="tag tag-d" id="l2-mkl"><i></i>mi piso · <b>${fm(SC.piso)}</b></span>`, 560);
  const yb = L2.barra.y0 + 6 * L2.barra.paso - 10;
  h += `<div class="mkv" id="l2-mk" style="left:${X(SC.piso)}px;top:${L2.marca_label_y + 70}px;height:${yb - (L2.marca_label_y + 70)}px"></div>`;
  l2rows.forEach((r, i) => {
    const n = i + 1;
    const desc = L2.descriptor[r.id];
    h += `<div class="bar${bajo(r.m.fin) ? ' bajo' : ''}" id="l2-b${n}" style="left:${SC.x0}px;top:${r.top}px;width:${r.w}px;height:${L2.barra.alto}px"><span class="lb" id="l2-l${n}" data-layout-allow-overflow data-layout-allow-overlap style="width:${SC.x1 - SC.x0}px">Motor ${r.m.n} · ${desc}</span>${r.ch ? `<span class="lb lb2" id="l2-m${n}" data-layout-allow-overflow data-layout-allow-overlap style="width:${SC.x1 - SC.x0}px">Motor ${r.m.n} · ${esc(r.ch.texto)}</span>` : ''}</div>`;
    h += `<div class="barv" id="l2-v${n}" style="left:${SC.x0 + r.w + 14}px;top:${r.top + 4}px">${fm(r.m.fin)}</div>`;
    if (L2.resalte_motores.includes(r.id)) h += `<div class="barring" id="l2-q${n}" style="left:${SC.x0 - 8}px;top:${r.top - 8}px;width:${r.w + 16}px;height:${L2.barra.alto + 16}px"></div>`;
  });
  const ya = L2.barra.y0 + 6 * L2.barra.paso - 24;
  h += `<div class="ax" id="l2-ax0" style="left:${SC.x0}px;top:${ya}px">0</div><div class="ax r" id="l2-ax1" style="left:${SC.x1 - 420}px;width:420px;top:${ya}px">1</div>`;
  h += cent(540, L2.nota.y, `<span class="tag" id="l2-nota" style="flex-direction:column;align-items:flex-start;gap:8px;border-radius:34px;white-space:normal;font-size:40px;line-height:1.18;padding:16px 30px;max-width:920px"><span>${esc(L2.nota.linea1)}</span><span style="font-size:36px;color:rgba(246,248,251,.9);text-wrap:balance">${esc(L2.nota.linea2)}</span></span>`, 960);
  html += FULLDIV('pl-l2', kM['pl-l2'].a, kM['pl-l2'].b, 4, h, 'pl');
}

// ── placa del Motor 6 (H1): puntaje final 0,77 + las dos cifras por segundo JUNTAS + sello «4×» ──
{
  const Q = plan.m6plate, m = mot.m6, y = Q.escala_y, cp = Q.cr_por_s;
  const cr = (v) => String(v).replace('.', ',');
  let h = `<div class="trk" id="q-trk" style="left:${SC.x0}px;top:${y}px;width:${SC.x1 - SC.x0}px"><div class="zona" style="left:${X(SC.piso) - SC.x0}px;right:0"></div></div>`;
  h += `<div class="mkv" id="q-mk" style="left:${X(SC.piso)}px;top:${y - 62}px;height:96px"></div>`;
  h += cent(X(SC.piso), Q.marca_label_y, `<span class="tag tag-d" id="q-mkl"><i></i>mi piso · <b>${fm(SC.piso)}</b></span>`, 560);
  h += `<div class="ax" id="q-ax0" style="left:${SC.x0}px;top:${y + 50}px">0</div><div class="ax r" id="q-ax1" style="left:${SC.x1 - 420}px;width:420px;top:${y + 50}px">1</div>`;
  h += `<div class="dot f${bajo(m.fin) ? ' bajo' : ''}" id="q-dot" style="left:${X(m.fin)}px;top:${y + 13}px;width:46px;height:46px;margin-left:-23px;margin-top:-23px"></div>`;
  h += cent(X(m.fin), Q.numeral_y, `<span class="num" id="q-num" style="transform:none">${fm(m.fin)}</span>`, 560);
  h += cent(X(m.fin), Q.numeral_y + 178, `<span class="rt" id="q-cap" style="position:static;font-size:38px;color:var(--mut)">cierre del clip (<b>${fm1(m.t_fin)} s</b>)</span>`, 620);
  h += cent(540, Q.precio_y, `<span class="tag tag-d" id="q-p6"><i></i>Motor 6: <b>${cr(cp.m6)}</b> créditos por segundo</span>`, 920);
  h += cent(540, Q.precio2_y, `<span class="tag tag-d" id="q-p1"><i></i>Motor 1: <b>${cr(cp.m1)}</b> créditos por segundo</span>`, 920);
  h += cent(540, Q.sello_y, `<span class="sello" id="q-sello">${cp.m6 / cp.m1}× el precio por segundo</span>`, 920);
  html += FULLDIV('pl-m6', kM['pl-m6'].a, kM['pl-m6'].b, 4, h, 'pl');
}

// ── aro verde sobre el letrero inventado del Motor 4 (sigue al letrero por 4 puntos) ──
{
  const a = plan.aro_m4, p0 = a.puntos[0];
  html += FULLDIV('cc-aro', a.a, a.b, 9, `<div id="aro" style="left:${Math.round(p0.cx - a.w / 2)}px;top:${Math.round(p0.cy - a.h / 2)}px;width:${a.w}px;height:${a.h}px"></div>`);
}

// ── tarjetas narrativas (+ pila de dato y sello en los motores). La entrada arranca 1 cuadro ANTES de que termine la anterior, salvo en los empujes (viajan) ──
const viajaEntra = new Set(plan.costuras.filter((c) => c.tarjetas).map((c) => c.tarjetas.entra));
const viajaSale = new Set(plan.costuras.filter((c) => c.tarjetas).map((c) => c.tarjetas.sale));
const primeras = new Set(plan.cadenas_de_tarjetas.map((c) => c[0]));
for (const c of plan.tarjetas) c.entra = f2(c.a - (viajaEntra.has(c.id) ? PUSH : primeras.has(c.id) ? 0 : FR));
for (const c of plan.tarjetas) {
  const t = c.texto.endsWith('\n') ? esc(c.texto.slice(0, -1)) + '<br>' : esc(c.texto) + (c.acento ? ' ' : '');
  const acento = c.acento ? `<b${c.acento_t ? ' class="late"' : ''}>${esc(c.acento)}</b>` : '';
  let extras = '';
  if (c.motor) {
    const m = mot[c.motor];
    if (m.sello) extras += `<div class="sello${m.sello.tipo === 'dato' ? ' dato' : ''}" id="s-${m.id}">${esc(m.sello.texto)}</div>`;
    if (m.pastilla) extras += `<div class="sello dato" id="p-${m.id}">${esc(m.pastilla.texto)}</div>`;
    extras += `<div class="drow" id="d-${m.id}"><span class="tag tag-d${bajo(m.ini) ? ' bajo' : ''}" id="dA-${m.id}"><i></i>parecido <b>0 s:</b> <b>${fm(m.ini)}</b></span>` +
      (m.sin_b ? '' : `<span class="arr" id="dX-${m.id}">→</span><span class="tag tag-d${bajo(m.fin) ? ' bajo' : ''}" id="dB-${m.id}"><i></i><b>${fm1(m.t_fin)} s:</b> <b>${fm(m.fin)}</b></span>`) + `</div>`;
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
  W, H, FR, PUSH, PEASE: plan.empuje.ease, E_IN, E_OUT, costuras, ACC,
  tarjetas: plan.tarjetas.map(({ id, entra, b, acento_t }) => ({ id, a: +entra, b, acento_t: acento_t || null, en_empuje_entra: viajaEntra.has(id), en_empuje_sale: viajaSale.has(id) })),
  rotulo: plan.rotulo,
  gancho: { a: plan.gancho.miniaturas.a, esc: plan.gancho.miniaturas.escalon, n: plan.motores.length },
  regla: { refs: { a: plan.regla.refs.a, esc: plan.regla.refs.escalon, n: plan.refs.muestra.length, etiqueta_t: plan.regla.refs.etiqueta_t }, escala: plan.regla.escala },
  l1: { leyenda_t: plan.l1.leyenda_t, marca_t: plan.l1.marca_t, mueve_d: plan.l1.mueve_d, filas: plan.l1.filas.map((f, i) => { const m = mot[f.motor]; return { n: i + 1, t: f.t, dx: X(m.ini) - X(m.fin) }; }) },
  l2: { marca_t: L2.marca_t, d: L2.barra.d, filas: l2rows.map((r, i) => ({ n: i + 1, t: r.t, w: r.w, ch: r.ch ? r.ch.t : null, ring: L2.resalte_motores.includes(r.id) })), resalte_t: L2.resalte_t, nota_t: L2.nota.t },
  m6plate: plan.m6plate,
  motores: plan.motores.map((m) => ({ id: m.id, a: m.tag_a, b: m.tag_b, fin: m.tags_fin, sello: m.sello, sin_b: !!m.sin_b, pastilla: m.pastilla || null })),
  aro: plan.aro_m4,
};
const out = `<!doctype html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=${W}, height=${H}">
<title>Lucía · G2</title>
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

// ───────────────────────── 3) tabla de cortes ─────────────────────────
console.log('Tabla de cortes (t en s):');
for (const m of plan.medios) console.log(`  ${m.a.toFixed(3).padStart(7)} – ${m.b.toFixed(3).padEnd(7)} ${m.id.padEnd(8)} ${m.tipo.padEnd(5)} ${m.cuadros ? 'cuadros ' + m.cuadros : ''}  ${m.capa}`);
console.log('Costuras (empuje rígido de 6 cuadros):');
for (const c of plan.costuras) console.log(`  ${c.t.toFixed(2).padStart(6)}  ${c.tipo}  sale ${c.sale.join(',')} → entra ${c.entra.join(',')}`);
console.log('Tarjetas (entra = 1 cuadro antes de a salvo en los empujes, donde viajan):');
for (const c of plan.tarjetas) console.log(`  ${c.a.toFixed(2).padStart(6)} – ${c.b.toFixed(2).padEnd(6)} ${c.id.padEnd(3)} ${String(c.n_palabras)} pal (mín ${c.min_s} s) «${(c.texto.replace(/\n/g, ' ') + ' ' + (c.acento || '')).trim()}»${viajaEntra.has(c.id) ? ' [entra con el empuje]' : ''}${viajaSale.has(c.id) ? ' [sale con el empuje]' : ''}`);
console.log('Lecturas de sellos, pastillas, notas y placa (≥ 0,35 s/palabra + 0,3):');
for (const x of lecturas) console.log(`  ${x.que.padEnd(28)} ${String(x.n).padStart(2)} pal  ${x.a.toFixed(2)}–${x.b.toFixed(2)}  ${x.dur.toFixed(2)} s  (pide ${x.min.toFixed(2)})  ${x.dur - x.min < 0.2 ? '← justo' : ''}`);
console.log('Datos (de PROCEDENCIA.jsonl):');
for (const m of plan.motores) console.log(`  Motor ${m.n}: ${m.cr} cr · 0 s ${fm(m.ini)} → ${fm1(m.t_fin)} s ${fm(m.fin)}  (muestras ${m._valores.join(' ')})`);
console.log('Agregados al guion (reversibles, ver plan.json):', plan.agregados_al_guion.map((a) => a.id).join(', '));
console.log(`ok: index.html (${Math.round(out.length / 1024)} KB)`);
