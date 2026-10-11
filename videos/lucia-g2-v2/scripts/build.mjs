#!/usr/bin/env node
// Lucía · G2 v2 «La misma foto, seis clips: ¿quién pierde la cara?» (26,5 s, 1080x1920, 24 fps) — re-corte de G2 (58 s, muda) con la regla de aire muerto.
// Lee guion-voz.txt (UNA línea por tramo; cada tramo dura palabras/3,6 s, huecos de 6 cuadros) y plan.json (tiempos anclados a los tramos: «T6+0.8»)
// → resuelve todos los tiempos → valida reglas de texto, de voz, de CTA y LOS NÚMEROS contra v4/PROCEDENCIA.jsonl → escribe index.html y plan.resuelto.json.
// 0 créditos: mismos clips y misma foto de G2. Método y trampas: .claude/skills/lucia/montaje-hyperframes.md. Plantilla: videos/lucia-g2/.
// Uso:  node scripts/build.mjs   (copia el material si falta, valida e imprime la tabla de cortes)
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buscarProhibidas } from './prohibidas.mjs';

const P = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const plan0 = JSON.parse(fs.readFileSync(path.join(P, 'plan.json'), 'utf8'));
const { w: W, h: H, fps: FPS } = plan0.lienzo;
const ACC = plan0.acento, BAD = plan0.alerta;
const Z = plan0.zona_segura;
const FR = 1 / FPS;
const E_IN = 0.18, E_OUT = 0.18;               // entrada y salida de las tarjetas: misma duración y distancia (80 px), eases espejados
const PUSH = plan0.empuje.cuadros * FR;
const SC = plan0.escala;
const X = (v) => Math.round(SC.x0 + v * (SC.x1 - SC.x0));       // valor 0-1 → x del lienzo (los puntos salen de los datos, nunca a mano)
const r2 = (v) => Math.round(v * 100 + 1e-7) / 100;             // 2 decimales, media hacia arriba (0,805 → 0,81; 0,785 → 0,79; 0,798 → 0,80)
const f2 = (n) => +(+n).toFixed(6);
const fm = (v) => v.toFixed(2).replace('.', ',');
const fm1 = (v) => (Math.round(v * 10 + 1e-7) / 10).toFixed(1).replace('.', ',');
const errores = [];

// ───────────────────────── 0) material (se copia SOLO si falta; todo va al .gitignore) ─────────────────────────
const R0 = path.resolve(P, '../..');
const V4 = path.join(R0, 'hermes-content/references/modelos/lucia/v4');
const KIT = path.join(V4, 'kit');
const PM = path.join(V4, 'prueba-motores-20261008');
const FONTS = path.join(R0, 'hermes-content/brand/fonts');
const COPIAS = [
  ['assets/k1.jpg', path.join(KIT, 'k1-1-recepcion-celular-4afffb96.jpg')],
  ['assets/m1.mp4', path.join(KIT, 'k1-clip-mira-camara-e470ef4f.mp4')],
  ['assets/m2.mp4', path.join(PM, 'kling-pro-9f43ee3c.mp4')],            // m2, m4 y m6 NO van en el video: solo dan la miniatura del gancho (6 clips)
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
  const cands = ['lucia-g2', 'lucia-g3', 'lucia-g1'].map((n) => path.join(R0, 'videos', n, 'assets/vendor/gsap.min.js')).filter((f) => fs.existsSync(f));
  if (cands.length) fs.copyFileSync(cands[0], gs); else curl('https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js', gs);
}
const ff = (args) => execFileSync('ffmpeg', ['-v', 'error', '-y', ...args], { stdio: 'inherit' });
const A = (n) => path.join(P, 'assets', n);
// 8 referencias oficiales (0 cr: URL públicas del manifiesto de v4/qa) → recortes de cara de 5 de ellas (assets/ref1-5.jpg)
const manifest = JSON.parse(fs.readFileSync(path.join(R0, plan0.refs.manifest), 'utf8'));
const refNames = Object.keys(manifest.refs);
fs.mkdirSync(A('refs-orig'), { recursive: true });
for (const m of plan0.refs.muestra) {
  const out = A(`ref${m.id.slice(3)}.jpg`);
  if (fs.existsSync(out)) continue;
  const key = refNames.find((k) => k.startsWith(m.fuente.split('_')[0] + '_'));
  const url = manifest.refs[key];
  const orig = A(`refs-orig/${key}${path.extname(url)}`);
  if (!fs.existsSync(orig)) curl(url, orig);
  const [ox, oy, s] = m.recorte;
  ff(['-i', orig, '-vf', `crop=${s}:${s}:${ox}:${oy},scale=360:360:flags=lanczos`, '-frames:v', '1', '-q:v', '2', '-update', '1', out]);
}
// miniaturas de los SEIS clips del gancho (cuadro 90 = 3,75 s). El video solo muestra tres; el gancho promete seis y las seis miniaturas están a la vista.
const SEIS = [1, 2, 3, 4, 5, 6];
for (const n of SEIS) {
  const out = A(`th${n}.jpg`);
  if (!fs.existsSync(out)) ff(['-i', A(`m${n}.mp4`), '-vf', `select=eq(n\\,${plan0.gancho.miniaturas.cuadro}),scale=272:484:flags=lanczos`, '-frames:v', '1', '-vsync', '0', '-q:v', '2', '-update', '1', out]);
}

// ───────────────────────── 1) la voz manda: tramos = líneas de guion-voz.txt ─────────────────────────
const VZ = plan0.voz;
const vozTxt = fs.readFileSync(path.join(P, VZ.archivo), 'utf8');
const lineas = vozTxt.split('\n').map((l) => l.trim()).filter(Boolean);
const sumaChars = lineas.reduce((s, l) => s + [...l].length, 0);
if (sumaChars > VZ.max_caracteres) errores.push(`guion-voz.txt: ${sumaChars} caracteres (máx ${VZ.max_caracteres})`);
if ([...lineas.join('\n')].length > VZ.max_caracteres) errores.push(`guion-voz.txt: con los saltos de línea pasa de ${VZ.max_caracteres} caracteres`);
const tramos = [];
{
  let s = VZ.inicio_cuadros;
  lineas.forEach((l, i) => {
    const n = l.split(/\s+/).filter(Boolean).length;
    const dur = Math.round(FPS * n / VZ.palabras_por_s);            // cuadros: lo que dura la línea a 3,6 palabras por segundo
    if (n < VZ.min_palabras_por_linea) errores.push(`tramo ${i + 1} «${l}»: ${n} palabras (mín ${VZ.min_palabras_por_linea}: una línea más corta no cabe en una frase natural)`);
    for (const f of buscarProhibidas(l)) errores.push(`tramo ${i + 1}: frase prohibida «${f}» en la voz`);
    tramos.push({ i: i + 1, texto: l, palabras: n, caracteres: [...l].length, sf: s, df: dur, t: s / FPS, e: (s + dur) / FPS });
    s += dur + VZ.hueco_cuadros;
  });
  tramos.forEach((t, k) => { t.w = k + 1 < tramos.length ? tramos[k + 1].sf / FPS : null; });
}
const NT = tramos.length;
const FIN = f2(tramos[NT - 1].t + VZ.cta_ventana_cuadros / FPS);
tramos[NT - 1].w = FIN;
for (let k = 0; k + 1 < NT; k++) {
  const hueco = (tramos[k + 1].sf - (tramos[k].sf + tramos[k].df)) / FPS;
  if (hueco > 0.25 + 1e-9) errores.push(`hueco entre las líneas ${k + 1} y ${k + 2}: ${hueco.toFixed(3)} s (máx 0,25)`);
}
const DUR = FIN;
if (DUR < 26 || DUR > 30) errores.push(`duración ${DUR} s fuera de 26-30 s`);

// resolución de anclas: «T6», «T6+0.8», «T7-6f», «E6», «W6», «FIN»
const RE = /^([TEW])(\d+)(?:([+-])(\d+(?:\.\d+)?)(f?))?$/;
const resolver = (v) => {
  if (v === 'FIN') return FIN;
  if (typeof v !== 'string') return v;
  const m = RE.exec(v);
  if (!m) return v;
  const k = +m[2];
  if (k < 1 || k > NT) { errores.push(`ancla «${v}»: no hay tramo ${k}`); return 0; }
  const tr = tramos[k - 1];
  let base = m[1] === 'T' ? tr.t : m[1] === 'E' ? tr.e : tr.w;
  if (m[3]) { const d = +m[4] / (m[5] ? FPS : 1); base += m[3] === '+' ? d : -d; }
  return base;
};
const walk = (o) => Array.isArray(o) ? o.map(walk) : (o && typeof o === 'object') ? Object.fromEntries(Object.entries(o).map(([k, v]) => [k, walk(v)])) : resolver(o);
const plan = walk(plan0);
plan.lienzo.duracion = DUR;
plan.tramos = tramos;

// ───────────────────────── 2) reglas (se corta el build si alguna falla) ─────────────────────────
const nw = (t) => String(t).replace(/<[^>]+>/g, ' ').split(/\s+/).filter((x) => x && x !== '·' && x !== '→' && x !== '=').length;
const palabras = (t) => nw(`${t.texto} ${t.acento || ''}`);
for (const c of plan.tarjetas) {
  const n = palabras(c), min = n * 0.35 + 0.3, dur = c.b - c.a;
  if (n > 6) errores.push(`${c.id}: ${n} palabras (máx 6)`);
  if (dur < min - 1e-9) errores.push(`${c.id}: dura ${dur.toFixed(3)} s y necesita ${min.toFixed(2)} s para ${n} palabras`);
  if (c.id === 'c1' && c.a > 0.15 + 1e-9) errores.push('c1: la primera tarjeta entra después de 0,15 s');
  if (c.acento_t != null && (c.acento_t < c.a + 0.5 - 1e-9 || c.acento_t > c.b - 0.5 + 1e-9)) errores.push(`${c.id}: acento_t ${c.acento_t} fuera de [a+0,5, b-0,5]`);
  c.n_palabras = n; c.min_s = +min.toFixed(2);
}
const med = Object.fromEntries(plan.medios.map((m) => [m.id, m]));
const tj = Object.fromEntries(plan.tarjetas.map((c) => [c.id, c]));
for (const m of plan.medios) if (m.tipo === 'clip') {
  const n = (m.b - m.a) * FPS + (m.media_inicio || 0) * FPS;
  if (n > 145 + 1e-6) errores.push(`${m.id}: pide hasta el cuadro ${n.toFixed(2)} y el clip tiene 145`);
  if (Math.abs(n - Math.round(n)) > 1e-3) errores.push(`${m.id}: ${n.toFixed(3)} cuadros: el clip no cae en la cuadrícula de 24 fps`);
}
for (const cad of plan.cadenas_de_tarjetas) for (let i = 1; i < cad.length; i++) {
  if (Math.abs(tj[cad[i]].a - tj[cad[i - 1]].b) > 1e-9) errores.push(`${cad[i - 1]}→${cad[i]}: no son contiguas (${tj[cad[i - 1]].b} vs ${tj[cad[i]].a})`);
}
// costuras: el medio entrante arranca en T−6 cuadros; el saliente termina en T; la tarjeta saliente termina en T y la entrante entra en T
for (const c of plan.costuras) if (c.tipo === 'empuje') {
  for (const id of c.entra) if (med[id] && Math.abs(med[id].a - (c.t - PUSH)) > 1e-6) errores.push(`costura ${c.t}: «${id}» debe empezar en ${(c.t - PUSH).toFixed(3)} y empieza en ${med[id].a}`);
  for (const id of c.sale) if (med[id] && Math.abs(med[id].b - c.t) > 1e-6) errores.push(`costura ${c.t}: «${id}» debe terminar en ${c.t} y termina en ${med[id].b}`);
  const k = plan.tramos.findIndex((t) => Math.abs(t.t - c.t) < 1e-9);
  if (k < 0) errores.push(`costura ${c.t}: no cae en el inicio de ningún tramo de voz`);
  else if (k > 0) { const hu = plan.tramos[k].t - (plan.tramos[k - 1].t + plan.tramos[k - 1].df / FPS); if (hu < PUSH - 1e-6) errores.push(`costura ${c.t}: el hueco de voz (${hu.toFixed(3)} s) es menor que el empuje (${PUSH} s)`); }
  if (c.tarjetas) {
    const s = tj[c.tarjetas.sale], e = tj[c.tarjetas.entra];
    if (!s || !e) { errores.push(`costura ${c.t}: tarjeta «${c.tarjetas.sale}» o «${c.tarjetas.entra}» no existe`); continue; }
    if (Math.abs(s.b - c.t) > 1e-6) errores.push(`costura ${c.t}: la tarjeta «${s.id}» debe terminar en ${c.t} y termina en ${s.b}`);
    if (Math.abs(e.a - c.t) > 1e-6) errores.push(`costura ${c.t}: la tarjeta «${e.id}» debe entrar en ${c.t} y entra en ${e.a}`);
  }
}
// gancho: texto exacto, rótulo desde el cuadro 0 hasta los 3 s a 40 px, seis miniaturas a la vista dentro de los 3 s
{
  const t12 = `${tj.c1.texto} ${tj.c1.acento} ${tj.c2.texto} ${tj.c2.acento}`;
  if (t12 !== 'Misma foto. Seis clips. ¿Quién pierde la cara?') errores.push(`gancho: «${t12}»`);
  const r = plan.rotulo;
  if (r.texto !== 'Lucía Antelo · personaje IA de Onia' || r.a !== 0 || Math.abs(r.b - 3.0) > 1e-9 || r.px !== 40) errores.push('rótulo: texto, 0-3 s o 40 px incorrectos');
  const g = plan.gancho.miniaturas, ult = g.a + (SEIS.length - 1) * g.escalon + 0.28;
  if (ult > 3.0) errores.push(`gancho: la sexta miniatura termina de entrar a ${ult.toFixed(2)} s (> 3 s)`);
}
// CTA exacto, visible de 2,4 a 5,5 s y hasta el último cuadro
{
  const c = tj.c12, txt = `${c.texto} ${c.acento}`, d = DUR - c.a;
  if (txt !== plan.cta.texto || txt !== 'Seguime: cada semana, una prueba.') errores.push(`CTA: «${txt}»`);
  if (d < plan.cta.min_s - 1e-9 || d > plan.cta.max_s + 1e-9) errores.push(`CTA: visible ${d.toFixed(2)} s (debe ser 2,4-5,5 s)`);
  if (Math.abs(c.b - DUR) > 1e-6) errores.push('CTA: no llega al último cuadro');
}
// los números salen de PROCEDENCIA.jsonl (última línea «resultados»): arranque, final y créditos de cada motor
const permitidos = new Set([fm(SC.piso)]);
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
      const tf = d.t ? d.t.at(-1) : 5.9;
      if (!d.t && d.id.length !== 7) errores.push(`${m.id}: se esperaban 7 muestras y hay ${d.id.length}`);
      if (Math.abs(tf - m.t_fin) > 0.051) errores.push(`${m.id}: t_fin ${m.t_fin} y la última muestra es ${tf}`);
      m._valores = d.id;
      permitidos.add(fm(m.ini)); permitidos.add(fm(m.fin));
    }
    // afirmaciones del video contra los datos
    const M = Object.fromEntries(plan.motores.map((m) => [m.id, m]));
    if (!(M.m1.fin < M.m1.ini)) errores.push('«pierde parecido» (Motor 1): el final no es menor que el arranque');
    if (!(M.m3.ini < SC.piso && M.m3.fin < SC.piso)) errores.push('«queda bajo el piso» (Motor 3): arranque y final no están bajo 0,70');
    if (!(M.m5.ini >= SC.piso && M.m5.fin >= SC.piso && M.m5.fin >= M.m5.ini - 0.03)) errores.push('«sostiene la cara» (Motor 5): no se sostiene sobre 0,70');
    if (!res.video_misma_foto_K1_misma_orden || Object.keys(v).length !== 6) errores.push('PROCEDENCIA: no hay seis clips para la misma foto y la misma orden');
  }
}
if (refNames.length !== plan.refs.total) errores.push(`el manifiesto trae ${refNames.length} referencias y la tarjeta dice ${plan.refs.total}`);
// pie: abre con «personaje hecho con IA», dice lo mismo que el video, sin cifras que el video no muestre ni frases prohibidas
{
  const pp = path.join(P, 'pie.txt');
  if (!fs.existsSync(pp)) errores.push('falta pie.txt');
  else {
    const pie = fs.readFileSync(pp, 'utf8').trim();
    if (!/^personaje hecho con ia/i.test(pie)) errores.push('pie.txt: debe abrir con «Personaje hecho con IA»');
    for (const f of buscarProhibidas(pie)) errores.push(`pie.txt: frase prohibida «${f}»`);
    const decs = pie.match(/\d,\d+/g) || [];
    for (const d of decs) if (!permitidos.has(d)) errores.push(`pie.txt: la cifra ${d} no sale de los datos del video`);
    for (const f of ['seis clips', 'ocho fotos', 'una toma', 'Seguime']) if (!pie.toLowerCase().includes(f.toLowerCase()) && !pie.toLowerCase().includes(f.replace('ocho', '8').toLowerCase())) errores.push(`pie.txt: no dice «${f}»`);
  }
}
// tags y sellos dentro de la vida de su tarjeta
const mot = Object.fromEntries(plan.motores.map((m) => [m.id, m]));
const cardDe = (m) => plan.tarjetas.find((t) => t.motor === m.id);
const pushSale = new Set(plan.costuras.filter((c) => c.tarjetas).map((c) => c.tarjetas.sale));
const salidaDe = (c) => c.b - (pushSale.has(c.id) ? PUSH : E_OUT);       // desde cuándo ya no se lee lo que cuelga de la tarjeta
for (const m of plan.motores) {
  const c = cardDe(m);
  if (m.tag_a < c.a - 1e-9 || m.tag_b <= m.tag_a || m.tag_b > salidaDe(c) - 0.5 || (m.sello && (m.sello.t < m.tag_a || m.sello.t > salidaDe(c) - 0.5))) errores.push(`${m.id}: tags (${m.tag_a}/${m.tag_b}) fuera de la vida de su tarjeta (${c.a}-${salidaDe(c).toFixed(2)})`);
}
// ── tiempo de lectura de TODO texto que no es una tarjeta: ≥ 0,35 s por palabra + 0,3 s, ya descontada la entrada (0,18 s). El script ventanas.mjs lo mide en el DOM. ──
const lecturas = [];
{
  const L = (id, que, texto, a, b) => lecturas.push({ id, que, texto: String(texto).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(), n: nw(texto), a: f2(a), b: f2(b), dur: f2(b - a - E_IN), min: f2(nw(texto) * 0.35 + 0.3) });
  L('rotulo', 'rótulo de IA', plan.rotulo.texto, 0, plan.rotulo.b - E_OUT + E_IN);
  for (const m of plan.motores) {
    const c = cardDe(m), fin = salidaDe(c);
    L(`dA-${m.id}`, `${m.id} dato A`, `parecido 0 s: ${fm(m.ini)}`, m.tag_a, fin);
    L(`dB-${m.id}`, `${m.id} dato B`, `${fm1(m.t_fin)} s: ${fm(m.fin)}`, m.tag_b, fin);
    if (m.sello) L(`s-${m.id}`, `${m.id} sello`, m.sello.texto, m.sello.t, fin);
  }
  const lf = med['pl-l'].b - PUSH, rf = med['pl-regla'].b - PUSH, Lc = plan.leccion;
  L('rf-l', 'regla: etiqueta de las referencias', `${plan.refs.muestra.length} de las ${plan.refs.total} fotos de referencia`, plan.regla.refs.etiqueta_t, rf);
  L('l-tit', 'lección: título', Lc.titulo.texto, Lc.titulo.t, lf);
  L('l-mkl', 'lección: «mi piso»', `mi piso · ${fm(SC.piso)}`, Lc.marca_t + 0.05, lf);
  L('l-nota', 'lección: nota del final', Lc.nota.texto, Lc.nota.t, lf);
  Lc.orden.forEach((id, i) => {
    const B = Lc.barra, t0 = B.t0 + i * B.escalon + B.d, ch = Lc.cambios.find((c) => c.motor === id), n = mot[id].n;
    L(`l-l${i + 1}`, `lección: rótulo Motor ${n}`, `Motor ${n} · ${Lc.descriptor[id]}`, t0 - E_IN, ch ? ch.t : lf);
    if (ch) L(`l-m${i + 1}`, `lección: rótulo Motor ${n} (cambia)`, `Motor ${n} · ${ch.texto}`, ch.t + 0.2 - E_IN, lf);
  });
  for (const x of lecturas) if (x.dur < x.min - 1e-9) errores.push(`lectura «${x.que}» (${x.n} palabras): ${x.dur.toFixed(2)} s y pide ${x.min.toFixed(2)} s`);
}
plan.lecturas = lecturas;
if (errores.length) { console.error('✖ reglas:\n  ' + errores.join('\n  ')); process.exit(1); }

// ───────────────────────── 3) HTML ─────────────────────────
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
let html = '';
let track = 40;
const nextTrack = () => track++;
const kM = med;
const FULL = 'position:absolute;left:0;top:0;width:1080px;height:1920px;object-fit:cover;';
const vid = (m, z, tr) => `<video id="${m.id}" src="${m.src}" data-start="${f2(m.a)}"${m.media_inicio ? ` data-media-start="${f2(m.media_inicio)}"` : ''} data-duration="${f2(m.b - m.a)}" data-track-index="${tr}" muted playsinline preload="auto" style="${FULL}z-index:${z};"></video>`;
const FULLDIV = (id, a, b, z, inner, cls = '') => `<div id="${id}" class="clip ${cls}" data-start="${f2(a)}" data-duration="${f2(b - a)}" data-track-index="${nextTrack()}" style="position:absolute;left:0;top:0;width:1080px;height:1920px;z-index:${z}">${inner}</div>\n`;
const cent = (cx, top, inner, w = 760) => `<div class="ab" style="left:${Math.round(cx - w / 2)}px;top:${top}px;width:${w}px;display:flex;justify-content:center">${inner}</div>`;

// foto K1: contenedor a lienzo completo (viaja en el empuje) + <img> con el empuje lento hacia la cara
html += `<div id="foto" class="clip ph" data-start="${f2(kM.foto.a)}" data-duration="${f2(kM.foto.b - kM.foto.a)}" data-track-index="1" style="position:absolute;left:0;top:0;width:1080px;height:1920px;z-index:1"><img id="foto-i" src="${kM.foto.src}" data-layout-allow-overflow alt=""></div>\n`;
html += vid(kM.m1, 1, 20) + '\n' + vid(kM.m3, 1, 22) + '\n' + vid(kM.m5, 1, 24) + '\n' + vid(kM.k1, 1, 26) + '\n';

// rótulo de IA (cuadro 0 → 3 s, 40 px)
{
  const r = plan.rotulo;
  html += `<div id="cc-rotulo" class="clip cc cc-top" data-start="${f2(r.a)}" data-duration="${f2(r.b - r.a)}" data-track-index="${nextTrack()}" style="--t:${r.top}px"><div class="cw" id="rotulo"><span class="tag r"><i></i>${esc(r.texto)}</span></div></div>\n`;
}
// gancho: las seis miniaturas de los clips (viajan con la foto en el empuje de T3)
{
  const g = plan.gancho.miniaturas;
  const items = SEIS.map((n, i) => `<div class="th" id="th${n}" style="left:${g.x0 + i * (g.w + g.gap)}px;top:${g.y}px;width:${g.w}px;height:${g.h}px"><img src="assets/th${n}.jpg" alt=""><span>${n}</span></div>`).join('');
  html += FULLDIV('thumbs', g.a - 0.1, kM.foto.b, 8, items);
}
// ── placa de la regla: 5 de las 8 referencias + escala 0-1 con la marca en 0,70 (la marca lleva el rótulo «mi piso» en la tarjeta c4, no en la placa) ──
{
  const rg = plan.regla, rf = rg.refs, es = rg.escala, y = es.y;
  let h = '';
  plan.refs.muestra.forEach((m, i) => { h += `<div class="ref" id="rf${i + 1}" style="left:${rf.x0 + i * (rf.lado + rf.gap)}px;top:${rf.y}px;width:${rf.lado}px;height:${rf.lado}px"><img src="assets/ref${i + 1}.jpg" alt=""></div>`; });
  h += cent(540, rf.etiqueta_y, `<span class="tag tag-d" id="rf-l"><i></i>${plan.refs.muestra.length} de las ${plan.refs.total} fotos de referencia</span>`, 900);
  h += `<div class="trk" id="sc-trk" style="left:${SC.x0}px;top:${y}px;width:${SC.x1 - SC.x0}px"><div class="zona" id="sc-zona" style="left:${X(SC.piso) - SC.x0}px;right:0"></div></div>`;
  h += `<div class="mkv" id="sc-mk" style="left:${X(SC.piso)}px;top:${y - 62}px;height:96px"></div>`;
  h += `<div class="ax" id="sc-ax0" style="left:${SC.x0}px;top:${y + 50}px">0</div>`;
  h += `<div class="ax r" id="sc-ax1" style="left:${SC.x1 - 420}px;width:420px;top:${y + 50}px">idéntica · 1</div>`;
  html += FULLDIV('pl-regla', kM['pl-regla'].a, kM['pl-regla'].b, 4, h, 'pl');
}
// ── lección: los finales de los Motores 5, 1 y 3 (barras sobre la escala 0-1, marca en 0,70) ──
const bajo = (v) => v < SC.piso - 1e-9;
const Lc = plan.leccion;
const lrows = Lc.orden.map((id, i) => {
  const m = mot[id], B = Lc.barra, w = Math.round(m.fin * (SC.x1 - SC.x0)), top = B.y0 + i * B.paso;
  return { id, m, w, top, t: B.t0 + i * B.escalon, ch: Lc.cambios.find((c) => c.motor === id) };
});
{
  const B = Lc.barra, nb = lrows.length, yb = B.y0 + (nb - 1) * B.paso + B.alto + 14;
  let h = cent(540, Lc.titulo.y, `<span class="tag tag-d" id="l-tit"><i></i>${esc(Lc.titulo.texto)}</span>`, 940);
  h += cent(X(SC.piso), Lc.marca_label_y, `<span class="tag tag-d" id="l-mkl"><i></i>mi piso · <b>${fm(SC.piso)}</b></span>`, 560);
  h += `<div class="mkv" id="l-mk" style="left:${X(SC.piso)}px;top:${Lc.marca_label_y + 70}px;height:${yb - (Lc.marca_label_y + 70)}px"></div>`;
  lrows.forEach((r, i) => {
    const n = i + 1;
    h += `<div class="bar${bajo(r.m.fin) ? ' bajo' : ''}" id="l-b${n}" style="left:${SC.x0}px;top:${r.top}px;width:${r.w}px;height:${B.alto}px"><span class="lb" id="l-l${n}" data-layout-allow-overflow data-layout-allow-overlap style="width:${SC.x1 - SC.x0}px">Motor ${r.m.n} · ${Lc.descriptor[r.id]}</span>${r.ch ? `<span class="lb lb2" id="l-m${n}" data-layout-allow-overflow data-layout-allow-overlap style="width:${SC.x1 - SC.x0}px">Motor ${r.m.n} · ${esc(r.ch.texto)}</span>` : ''}</div>`;
    h += `<div class="barv" id="l-v${n}" style="left:${SC.x0 + r.w + 14}px;top:${r.top + 22}px">${fm(r.m.fin)}</div>`;
    if (Lc.resalte_motores.includes(r.id)) h += `<div class="barring" id="l-q${n}" style="left:${SC.x0 - 8}px;top:${r.top - 8}px;width:${r.w + 16}px;height:${B.alto + 16}px"></div>`;
  });
  h += `<div class="ax" id="l-ax0" style="left:${SC.x0}px;top:${yb + 4}px">0</div><div class="ax r" id="l-ax1" style="left:${SC.x1 - 420}px;width:420px;top:${yb + 4}px">1</div>`;
  h += cent(540, Lc.nota.y, `<span class="tag" id="l-nota" style="font-size:38px;white-space:normal;text-align:center"><i></i>${esc(Lc.nota.texto)}</span>`, 960);
  html += FULLDIV('pl-l', kM['pl-l'].a, kM['pl-l'].b, 4, h, 'pl');
}
// ── tarjetas narrativas (+ pila de dato y sello en los motores). La entrada arranca 1 cuadro ANTES de que termine la anterior, salvo en los empujes (viajan) ──
const viajaEntra = new Set(plan.costuras.filter((c) => c.tarjetas).map((c) => c.tarjetas.entra));
const viajaSale = new Set(plan.costuras.filter((c) => c.tarjetas).map((c) => c.tarjetas.sale));
const primeras = new Set(plan.cadenas_de_tarjetas.map((c) => c[0]));
for (const c of plan.tarjetas) c.entra = f2(c.a - (viajaEntra.has(c.id) ? PUSH : primeras.has(c.id) ? 0 : FR));
const extrasDe = {};                                       // ids que cuelgan de cada tarjeta (viajan con ella en el empuje)
for (const c of plan.tarjetas) {
  const t = c.texto.endsWith('\n') ? esc(c.texto.slice(0, -1)) + '<br>' : esc(c.texto) + (c.acento ? ' ' : '');
  const acento = c.acento ? `<b${c.acento_t ? ' class="late"' : ''}>${esc(c.acento)}</b>` : '';
  let extras = '';
  extrasDe[c.id] = [];
  if (c.motor) {
    const m = mot[c.motor];
    if (m.sello) { extras += `<div class="sello" id="s-${m.id}">${esc(m.sello.texto)}</div>`; extrasDe[c.id].push(`s-${m.id}`); }
    extras += `<div class="drow" id="d-${m.id}"><span class="tag tag-d${bajo(m.ini) ? ' bajo' : ''}" id="dA-${m.id}"><i></i>parecido <b>0 s:</b> <b>${fm(m.ini)}</b></span>` +
      `<span class="arr" id="dX-${m.id}">→</span><span class="tag tag-d${bajo(m.fin) ? ' bajo' : ''}" id="dB-${m.id}"><i></i><b>${fm1(m.t_fin)} s:</b> <b>${fm(m.fin)}</b></span></div>`;
    extrasDe[c.id].push(`d-${m.id}`);
  }
  html += `<div id="cc-${c.id}" class="clip cc cc-bot" data-start="${f2(c.entra)}" data-duration="${f2(c.b - c.entra)}" data-track-index="${3 + (plan.tarjetas.indexOf(c) % 2)}" style="--b:${Z.tarjeta_bottom_y}px">` +
    `<div class="stk">${extras}<div class="cw" id="${c.id}"><i class="sh sh1"></i><i class="sh sh2"></i><div class="card"><div class="rail"></div><div class="t">${t}${acento}</div></div></div></div></div>\n`;
}
const css = fs.readFileSync(path.join(P, 'scripts/estilos.css'), 'utf8').replaceAll('{{ACC}}', ACC).replaceAll('{{BAD}}', BAD);
const tlJs = fs.readFileSync(path.join(P, 'scripts/timeline.js'), 'utf8');
const existe = (id) => html.includes(`id="${id}"`);
const costuras = plan.costuras.filter((c) => c.tipo === 'empuje').map((c) => ({
  t: c.t,
  sale: [...c.sale, ...(c.tarjetas ? [c.tarjetas.sale, ...(extrasDe[c.tarjetas.sale] || [])] : [])].filter(existe),
  entra: [...c.entra, ...(c.tarjetas ? [c.tarjetas.entra] : [])].filter(existe),
}));
const PLAN_JS = {
  W, H, FR, PUSH, PEASE: plan.empuje.ease, E_IN, E_OUT, costuras, ACC, FIN: DUR - 1e-6,
  tarjetas: plan.tarjetas.map(({ id, entra, b, acento_t }) => ({ id, a: +entra, b, acento_t: acento_t || null, en_empuje_entra: viajaEntra.has(id), en_empuje_sale: viajaSale.has(id), sin_entrada: primeras.has(id) })),
  rotulo: plan.rotulo,
  foto: { a: kM.foto.a, b: kM.foto.b, zoom: kM.foto.zoom, ox: kM.foto.ox, oy: kM.foto.oy },
  gancho: { a: plan.gancho.miniaturas.a, esc: plan.gancho.miniaturas.escalon, n: SEIS.length },
  regla: { refs: { a: plan.regla.refs.a, esc: plan.regla.refs.escalon, n: plan.refs.muestra.length, etiqueta_t: plan.regla.refs.etiqueta_t }, escala: plan.regla.escala },
  leccion: { marca_t: Lc.marca_t, titulo_t: Lc.titulo.t, d: Lc.barra.d, filas: lrows.map((r, i) => ({ n: i + 1, t: r.t, w: r.w, ch: r.ch ? r.ch.t : null, ring: Lc.resalte_motores.includes(r.id) })), resalte_t: Lc.resalte_t, nota_t: Lc.nota.t },
  motores: plan.motores.map((m) => { const c = cardDe(m); return { id: m.id, a: m.tag_a, b: m.tag_b, sello: m.sello, sale_con_tarjeta: !viajaSale.has(c.id), card_b: c.b }; }),
};
const out = `<!doctype html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=${W}, height=${H}">
<title>Lucía · G2 v2</title>
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
fs.writeFileSync(path.join(P, 'plan.resuelto.json'), JSON.stringify(plan, null, 1));

// ───────────────────────── 4) tabla de cortes ─────────────────────────
const hms = (t) => t.toFixed(3).padStart(7);
console.log(`Voz (guion-voz.txt: ${sumaChars} caracteres, ${tramos.reduce((s, t) => s + t.palabras, 0)} palabras; 3,6 palabras/s; huecos de ${VZ.hueco_cuadros} cuadros = ${(VZ.hueco_cuadros / FPS).toFixed(2)} s):`);
for (const t of tramos) console.log(`  T${String(t.i).padEnd(2)} ${hms(t.t)} – ${hms(t.e)} (${t.palabras} pal, ${t.df} cuadros) ventana hasta ${hms(+t.w)}  «${t.texto}»`);
console.log(`Duración: ${DUR.toFixed(3)} s (${Math.round(DUR * FPS)} cuadros)`);
console.log('Medios:');
for (const m of plan.medios) console.log(`  ${hms(m.a)} – ${hms(m.b)} ${m.id.padEnd(9)} ${m.tipo.padEnd(5)} ${m.capa}`);
console.log('Costuras (empuje rígido de 6 cuadros, caen en el hueco de la voz):');
for (const c of plan.costuras) console.log(`  ${hms(c.t - PUSH)} → ${hms(c.t)}  sale ${c.sale.join(',')} → entra ${c.entra.join(',')}`);
console.log('Tarjetas:');
for (const c of plan.tarjetas) console.log(`  ${hms(c.a)} – ${hms(c.b)} ${c.id.padEnd(3)} ${String(c.n_palabras)} pal (mín ${c.min_s} s, dura ${(c.b - c.a).toFixed(2)}) «${(c.texto.replace(/\n/g, ' ') + ' ' + (c.acento || '')).trim()}»${viajaEntra.has(c.id) ? ' [entra con el empuje]' : ''}${viajaSale.has(c.id) ? ' [sale con el empuje]' : ''}`);
console.log('Lecturas de rótulo, datos, sellos y placas (≥ 0,35 s/palabra + 0,3, ya descontada la entrada):');
for (const x of lecturas) console.log(`  ${x.id.padEnd(8)} ${x.que.padEnd(36)} ${String(x.n).padStart(2)} pal  ${x.a.toFixed(2)}–${x.b.toFixed(2)}  ${x.dur.toFixed(2)} s (pide ${x.min.toFixed(2)})  ${x.dur - x.min < 0.2 ? '← justo' : ''}`);
console.log('Datos (de PROCEDENCIA.jsonl):');
for (const m of plan.motores) console.log(`  Motor ${m.n}: ${m.cr} cr · 0 s ${fm(m.ini)} → ${fm1(m.t_fin)} s ${fm(m.fin)}  (muestras ${m._valores.join(' ')})`);
console.log(`ok: index.html (${Math.round(out.length / 1024)} KB), plan.resuelto.json`);
