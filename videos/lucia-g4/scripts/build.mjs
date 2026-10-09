#!/usr/bin/env node
// Lucía · G4 «Seis motores de imagen, una cara: ¿cuál la conserva?» (59,75 s, 1080x1920, 24 fps) — montaje con HyperFrames (2da pasada, 9-oct-2026: revisión H1-H7).
// Lee plan.json (capas, tiempos, datos) → valida reglas de texto, costuras Y LOS NÚMEROS contra v4/PROCEDENCIA.jsonl → escribe index.html
// (DOM estático + un único timeline GSAP). 0 créditos: seis fotos y cuatro del café ya pagadas el 8-oct + 8 referencias oficiales bajadas por curl.
// Sin clips: son fotos fijas con un empuje lento (1,00 → 1,04). Método y trampas: .claude/skills/lucia/montaje-hyperframes.md. Plantilla: videos/lucia-g2/.
// Uso:  node scripts/build.mjs   (copia/baja el material, genera derivados con ffmpeg si faltan, valida e imprime la tabla de cortes)
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
  ['assets/fonts/BricolageGrotesque-var-latin.woff2', path.join(FONTS, 'BricolageGrotesque-var-latin.woff2')],
  ['assets/fonts/DMSans-var-latin.woff2', path.join(FONTS, 'DMSans-var-latin.woff2')],
  ['assets/fonts/SplineSansMono-var-latin.woff2', path.join(FONTS, 'SplineSansMono-var-latin.woff2')],
];
// copia solo si falta o si CAMBIÓ el contenido (las fotos C y E pasaron a ser las «limpias»: «copiar si falta» dejaría la vieja)
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
  const ya = [fijo, ...['lucia-g2', 'lucia-g3', 'lucia-g1'].map((g) => path.join(R, `videos/${g}/assets/vendor/gsap.min.js`))].find((f) => fs.existsSync(f));
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
// derivados (miniaturas y fotos del café): se regeneran si faltan o si su fuente es más nueva
const viejo = (out, src) => !fs.existsSync(out) || fs.statSync(out).mtimeMs < fs.statSync(src).mtimeMs;
const th = plan.gancho.miniaturas;
for (const m of plan.imagenes) {
  const out = A(`th-${m.id}.jpg`), src = A(`ph-${m.id}.jpg`);
  if (viejo(out, src)) ff(['-i', src, '-vf', `scale=${th.w * 2}:${th.h * 2}:force_original_aspect_ratio=increase:flags=lanczos,crop=${th.w * 2}:${th.h * 2}`, '-frames:v', '1', '-q:v', '2', '-update', '1', out]);
}
for (const f of plan.l2.fotos.lista) {
  const out = A(`cf-${f.foto}.jpg`), src = A(path.basename(plan.fotos[f.foto].src));
  if (viejo(out, src)) ff(['-i', src, '-vf', `scale=${plan.l2.fotos.w * 2}:${plan.l2.fotos.h * 2}:force_original_aspect_ratio=increase:flags=lanczos,crop=${plan.l2.fotos.w * 2}:${plan.l2.fotos.h * 2}`, '-frames:v', '1', '-q:v', '2', '-update', '1', out]);
}

// ───────────────────────── 1) reglas (se corta el build si alguna falla) ─────────────────────────
const errores = [];
const palabras = (t) => `${t.texto} ${t.acento || ''}`.trim().split(/\s+/).filter((s) => s && s !== '·');
for (const c of plan.tarjetas) {
  const n = palabras(c).length, min = n * 0.35 + 0.3, dur = c.b - c.a;
  const tope = c.max_palabras || 6;                      // tope del guion: 6 palabras por tarjeta; una excepción lleva su razón en plan.json (c.excepcion)
  if (n > tope) errores.push(`${c.id}: ${n} palabras (máx ${tope})`);
  if (n > 6 && !c.excepcion) errores.push(`${c.id}: pasa de 6 palabras y no declara su excepción`);
  if (dur < min + 0.1 - 1e-9) errores.push(`${c.id}: dura ${dur.toFixed(2)} s y necesita ${min.toFixed(2)} s para ${n} palabras (+0,1 s de margen: el último instante es la salida)`);
  if (c.id === 'c1' && c.a > 0.15 + 1e-9) errores.push('c1: la primera tarjeta entra después de 0,15 s');
  if (c.acento_t != null && (c.acento_t < c.a + 0.5 - 1e-9 || c.acento_t > c.b - 0.5 + 1e-9)) errores.push(`${c.id}: acento_t ${c.acento_t} fuera de [a+0,5, b-0,5]`);
  c.n_palabras = n; c.min_s = +min.toFixed(2);
}
const med = Object.fromEntries(plan.medios.map((m) => [m.id, m]));
const tj = Object.fromEntries(plan.tarjetas.map((c) => [c.id, c]));
const img = Object.fromEntries(plan.imagenes.map((m) => [m.id, m]));
if (med['f-cierre'].b !== DUR) errores.push(`el cierre termina en ${med['f-cierre'].b} y el video dura ${DUR}`);
// cadena de tarjetas: contiguas (b de una = a de la siguiente)
for (const cad of plan.cadenas_de_tarjetas) for (let i = 1; i < cad.length; i++) {
  if (Math.abs(tj[cad[i]].a - tj[cad[i - 1]].b) > 1e-9) errores.push(`${cad[i - 1]}→${cad[i]}: no son contiguas (${tj[cad[i - 1]].b} vs ${tj[cad[i]].a})`);
}
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
// las seis fotos van en el orden del guion, cada una 5 s en reposo (T = 12, 17, 22, 27, 32, 37) y la escena de cada imagen coincide con su tarjeta
'abcdef'.split('').forEach((id, i) => {
  const m = img[id], c = tj[`c${5 + i}`], fm_ = med[`f-${id}`];
  if (!m || !c || !fm_) { errores.push(`falta la imagen ${id}`); return; }
  if (c.imagen !== id) errores.push(`c${5 + i}: debería ser de la imagen ${id}`);
  if (Math.abs(m.esc - (12 + 5 * i)) > 1e-9 || Math.abs(c.a - m.esc) > 1e-9 || Math.abs(fm_.b - (m.esc + 5)) > 1e-9) errores.push(`imagen ${id}: la escena no cae en ${12 + 5 * i}-${17 + 5 * i} s`);
  const letra = c.texto.match(/^Imagen ([A-F]) ·$/);
  if (!letra || letra[1] !== m.letra) errores.push(`${c.id}: la tarjeta dice otra letra que la imagen ${id}`);
  if (c.acento !== `${crs(m.cr)} ${m.cr === 1 ? 'crédito' : 'créditos'}`) errores.push(`${c.id}: «${c.acento}» no es el costo de la imagen ${id} (${m.cr})`);
});
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
      if ((m.estado === 'bajo') !== (m.sello?.texto === 'bajo el piso')) errores.push(`${m.id}: el sello «bajo el piso» va solo en las que están bajo el piso`);
      if ((m.estado === 'justo') !== (m.pastilla?.texto === 'justo en el piso')) errores.push(`${m.id}: la pastilla «justo en el piso» va solo en la que cae justo`);
    }
    for (const f of plan.l2.tabla.filas) for (const c of f.celdas) { const d = proc[c.clave]; if (d && r2(d.id) !== c.valor) errores.push(`tabla ${f.img}${c.n}: ${c.valor} y PROCEDENCIA dice ${d.id}`); }
    for (const f of plan.l2.fotos.lista) { const d = proc[f.clave]; if (d && r2(d.id) !== f.valor) errores.push(`foto ${f.foto}: ${f.valor} y PROCEDENCIA dice ${d.id}`); }
    if (!errores.length) {
      // lo que el video AFIRMA, contra los datos (si una afirmación falla, el build se corta)
      const raw = (k) => proc[k].id;
      const ok = (cond, texto) => { claim.push(`${cond ? 'ok ' : '✖  '} ${texto}`); if (!cond) errores.push(`afirmación falsa: ${texto}`); };
      const masCaro = plan.imagenes.reduce((a, b) => (b.cr > a.cr ? b : a)), masBarato = plan.imagenes.reduce((a, b) => (b.cr < a.cr ? b : a));
      ok(masCaro.letra === 'E' && raw('e') < raw('a') && raw('e') < raw('b'), `«Pagar más no la hace más parecida»: la más cara (${masCaro.letra}, ${masCaro.cr} cr, ${raw('e')}) queda bajo la de 1 cr (${raw('a')}) y la de 0,5 cr (${raw('b')})`);
      ok(plan.imagenes.filter((m) => m.cr > 1).every((m) => m._raw < raw('a')), `ninguna de las que cuestan más que A (1 cr) la hace más parecida que A (${raw('a')})`);
      ok(raw('a') >= 0.7 && raw('a_cafe2') >= 0.7 && raw('a_cafe3') >= 0.7, `A (1 cr) la sostuvo en tres escenas: ${raw('a')} · ${raw('a_cafe2')} · ${raw('a_cafe3')} (todas ≥ 0,70)`);
      ok(masBarato.letra === 'B' && raw('b') >= 0.7 && raw('b_cafe2') < 0.7 && raw('b_cafe3') >= 0.7, `B (el más barato, ${masBarato.cr} cr) la perdió en UNA de tres: ${raw('b')} · ${raw('b_cafe2')} · ${raw('b_cafe3')}`);
      const fila = (l) => plan.l2.tabla.filas.find((f) => f.img === l).celdas.map((c) => c.valor).join();
      ok(fila('B') === '0.79,0.35,0.83', 'la lección 2 dice B: 0,79 · 0,35 · 0,83');
      ok(fila('A') === '0.81,0.83,0.84', `la lección 2 dice A: 0,81 · 0,83 · 0,84 (PROCEDENCIA: ${raw('a')} · ${raw('a_cafe2')} · ${raw('a_cafe3')})`);
      ok(plan.l2.tabla.filas.find((f) => f.img === 'A').celdas.every((c) => c.valor >= SC.piso) && plan.tarjetas.find((t) => t.id === 'c12').acento === 'la sostuvo en tres.', '«Imagen A: la sostuvo en tres.»: las tres escenas de A están sobre el piso');
      ok(plan.l2.fotos.lista.map((f) => f.valor).join() === '0.83,0.35', 'las fotos del café: A 0,83 contra B 0,35');
      ok(plan.imagenes.filter((m) => m.estado === 'bajo').map((m) => m.letra).join() === 'E,F', 'bajo el piso: E y F (D cae justo en el piso y no se anuncia como aprobada)');
      ok(plan.imagenes.length === 6 && new Set(plan.imagenes.map((m) => m.id)).size === 6, 'seis imágenes distintas (A a F)');
    }
  }
}
if (refNames.length !== plan.refs.total || plan.refs.recortes.length !== plan.refs.total) errores.push(`el manifiesto trae ${refNames.length} referencias, el plan ${plan.refs.recortes.length} recortes y la tarjeta dice ${plan.refs.total}`);
// caras medidas (SCRFD): el origen del empuje lento sale de ahí, y se comprueba que ninguna cara pasa de y=900 (el texto de abajo arranca en ~1142)
const caras = JSON.parse(fs.readFileSync(path.join(P, 'qa/caras-fotos.json'), 'utf8')).fotos;
for (const k of Object.keys(plan.fotos)) if (!caras[k] || !caras[k].caja) errores.push(`sin caja de cara para la foto «${k}» (correr scripts/medir-caras.py)`);
const orden = [...plan.l1.filas].map((f) => img[f.img].cr);
if (orden.some((c, i) => i && c < orden[i - 1])) errores.push('l1: las filas no están ordenadas por precio (de menor a mayor)');
if (new Set(plan.l1.filas.map((f) => f.img)).size !== 6) errores.push('l1: tienen que estar las 6 imágenes');
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
// tags y sellos dentro de la vida de su tarjeta y antes del empuje de salida
for (const m of plan.imagenes) {
  const c = tj[`c${5 + 'abcdef'.indexOf(m.id)}`], salida = c.b - PUSH;
  if (m.tag_t < c.a + 0.1 - 1e-9 || m.fin > salida + 0.06 + 1e-9) errores.push(`${m.id}: dato (${m.tag_t}-${m.fin}) fuera de la vida de la tarjeta (${c.a}-${salida})`);
  for (const x of [m.sello, m.pastilla]) if (x && (x.t < m.tag_t - 1e-9 || x.t > m.fin - 0.5)) errores.push(`${m.id}: «${x.texto}» a ${x.t} fuera de [tag_t, fin-0,5]`);
}
// ── tiempo de lectura de TODO texto que no es una tarjeta: ≥ 0,35 s por palabra + 0,3 s, medido de que termina de entrar a que empieza a salir
//    (la métrica del revisor; ventanas.mjs lo mide después en el DOM cuadro a cuadro). Se cuenta con este script, no a ojo. ──
const lecturas = [];
{
  const nw = (t) => String(t).replace(/<[^>]+>/g, ' ').split(/\s+/).filter((x) => x && x !== '·' && x !== '→').length;
  const L = (que, texto, a, b) => lecturas.push({ que, texto, n: nw(texto), a, b, dur: b - a, min: nw(texto) * 0.35 + 0.3 });
  const rg = plan.regla, es = rg.escala, l1 = plan.l1, l2 = plan.l2;
  const fin = (id) => med[id].b - PUSH;                                // desde que empieza el empuje de salida ya no se lee entero
  L('rótulo de IA', plan.rotulo.texto, plan.rotulo.a, plan.rotulo.b);
  for (const m of plan.imagenes) {
    L(`${m.letra} dato`, `parecido ${fm(m.valor)}`, m.tag_t + E_IN, m.fin - 0.1);
    if (m.sello) L(`${m.letra} sello`, m.sello.texto, m.sello.t + 3 * FR, m.fin - 0.1);
    if (m.pastilla) L(`${m.letra} pastilla`, m.pastilla.texto, m.pastilla.t + E_IN, m.fin - 0.1);
  }
  L('regla «mi piso»', `mi piso · ${fm(SC.piso)}`, es.marca_t + 0.05 + E_IN, fin('pl-regla'));
  L('regla «idéntica · 1»', 'idéntica · 1', es.a + 0.2 + 0.25, fin('pl-regla'));
  const T1 = tj.c11.a, leg0 = T1 - 0.05;                              // lo que viaja con la placa se lee desde que llega (en T la placa está en reposo)
  L('l1 «mi piso»', `mi piso · ${fm(SC.piso)}`, leg0, fin('pl-l1'));
  L('l1 nota 1', l1.nota1.texto, leg0, fin('pl-l1'));
  L('l1 nota 2', l1.nota2.texto, l1.nota2.t + E_IN, fin('pl-l1'));
  // las dos notas se leen UNA DESPUÉS DE LA OTRA: la 2 entra cuando la 1 ya tuvo su tiempo de lectura (no son 19 palabras juntas en 3,8 s)
  const need1 = nw(l1.nota1.texto) * 0.35 + 0.3;
  if (l1.nota2.t + E_IN < leg0 + need1 - 1e-9) errores.push(`l1: la nota 2 (legible a ${(l1.nota2.t + E_IN).toFixed(2)}) entra antes de que la nota 1 termine de leerse (${(leg0 + need1).toFixed(2)})`);
  for (const f of l1.filas) {
    const m = img[f.img];
    L(`l1 fila ${m.letra}`, `Imagen ${m.letra} · ${crs(m.cr)} ${m.cr === 1 ? 'crédito' : 'créditos'}`, f.t + 0.25, fin('pl-l1'));
    L(`l1 valor ${m.letra}`, fm(m.valor), f.t + 0.2 + 0.2, fin('pl-l1'));
  }
  const ru = l1.ruido; if (ru.desde !== 0.66 || ru.hasta !== 0.7) errores.push('l1.ruido: la franja es de 0,66 a 0,70 (lo que dice la nota 2)');
  l2.cabecera.textos.forEach((t, i) => L(`l2 ${t}`, t, med['pl-l2'].a + PUSH - 0.05, fin('pl-l2')));
  for (const f of l2.tabla.filas) {
    L(`l2 etiqueta ${f.img}`, `Imagen ${f.img}`, f.etiqueta_t == null ? med['pl-l2'].a + PUSH - 0.05 : f.etiqueta_t + E_IN, fin('pl-l2'));
    for (const c of f.celdas) L(`l2 ${f.img}${c.n}`, fm(c.valor), c.t + 0.25, fin('pl-l2'));
  }
  for (const f of l2.fotos.lista) L(`l2 pie foto ${f.letra}`, `Imagen ${f.letra} · café ${fm(f.valor)}`, f.cap_t + 0.2, fin('pl-l2'));
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

// gancho: 6 miniaturas de las fotos A a F (viajan con la foto en el empuje de 6,0 s)
{
  const g = plan.gancho.miniaturas;
  const items = plan.imagenes.map((m, i) => `<div class="th" id="th-${m.id}" style="left:${g.x0 + i * (g.w + g.gap)}px;top:${g.y}px;width:${g.w}px;height:${g.h}px"><img src="assets/th-${m.id}.jpg" alt=""><span>${m.letra}</span></div>`).join('');
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

// ── lección 1: las seis imágenes ordenadas por precio sobre la escala 0-1, la nota del ruido en dos instantes y la franja de 0,66 a 0,70 ──
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
    h += `<div class="rt" id="l1-t${n}" style="left:${SC.x0}px;top:${f.y - 68}px">Imagen ${m.letra} · ${crs(m.cr)} ${m.cr === 1 ? 'crédito' : 'créditos'}</div>`;
    h += `<div class="rl" id="l1-r${n}" style="left:${SC.x0}px;top:${f.y - 5}px;width:${SC.x1 - SC.x0}px"></div>`;
    h += `<div class="dot f${cls(m)}" id="l1-f${n}" style="left:${x}px;top:${f.y}px"></div>`;
    h += `<div class="vl${cls(m)}" id="l1-v${n}" style="left:${x + 29}px;top:${f.y - 23}px;transform:none">${fm(m.valor)}</div>`;
  });
  h += `<div class="ax" id="l1-ax0" style="left:${SC.x0}px;top:${L.ejes_y}px">0</div><div class="ax r" id="l1-ax1" style="left:${SC.x1 - 420}px;width:420px;top:${L.ejes_y}px">1</div>`;
  html += FULLDIV('pl-l1', med['pl-l1'].a, med['pl-l1'].b, 4, h, 'pl');
}

// ── lección 2: tabla con A y B en tres escenas (A 0,81 · 0,83 · 0,84 y B 0,79 · 0,35 · 0,83) y las dos fotos del café lado a lado ──
{
  const L = plan.l2, T = L.tabla, F = L.fotos;
  let h = '';
  L.cabecera.textos.forEach((t, i) => { h += `<div class="thd" id="l2-h${i + 1}" style="left:${L.cabecera.cx[i] - 102}px;top:${L.cabecera.y}px;width:204px">${esc(t)}</div>`; });
  T.filas.forEach((f, fi) => {
    h += `<div class="rl2" id="l2-r${fi + 1}" style="left:${T.etiqueta_x}px;top:${f.y + Math.round((T.h - 48) / 2)}px">Imagen ${f.img}</div>`;
    f.celdas.forEach((c, i) => {
      h += `<div class="chip s" id="l2-c${fi + 1}${c.n}" style="left:${T.x0 + i * (T.w + T.gap)}px;top:${f.y}px;width:${T.w}px;height:${T.h}px"><div class="cn${c.valor < SC.piso ? ' bajo' : ''}">${fm(c.valor)}</div></div>`;
    });
  });
  // anillo sobre la celda que perdió la cara (B, escena 2 = el café, 0,35): enlaza el número con la foto
  const fb = T.filas.findIndex((f) => f.celdas.some((c) => c.valor < SC.piso)), cb = T.filas[fb].celdas.findIndex((c) => c.valor < SC.piso);
  h += `<div class="barring" id="l2-ring" style="left:${T.x0 + cb * (T.w + T.gap) - 8}px;top:${T.filas[fb].y - 8}px;width:${T.w + 16}px;height:${T.h + 16}px"></div>`;
  F.lista.forEach((f, i) => {
    const cx = F.cx[i];
    h += `<div class="cph" id="l2-ph${i + 1}" style="left:${cx - F.w / 2}px;top:${F.y}px;width:${F.w}px;height:${F.h}px"><img src="assets/cf-${f.foto}.jpg" alt=""></div>`;
    h += cent(cx, F.cap_y, `<div class="cap" id="l2-cap${i + 1}"><span class="rt" style="position:static">Imagen ${f.letra} · café</span><span class="cv${f.valor < SC.piso ? ' bajo' : ''}">${fm(f.valor)}</span></div>`, 420);
  });
  html += FULLDIV('pl-l2', med['pl-l2'].a, med['pl-l2'].b, 4, h, 'pl');
}

// ── tarjetas narrativas (+ pila de dato y sello en las imágenes). La entrada arranca 1 cuadro ANTES de que termine la anterior, salvo en los empujes (viajan) ──
const viajaEntra = new Set(plan.costuras.filter((c) => c.tarjetas).map((c) => c.tarjetas.entra));
const viajaSale = new Set(plan.costuras.filter((c) => c.tarjetas).map((c) => c.tarjetas.sale));
const primeras = new Set(plan.cadenas_de_tarjetas.map((c) => c[0]));
for (const c of plan.tarjetas) c.entra = f2(c.a - (viajaEntra.has(c.id) ? PUSH : primeras.has(c.id) ? 0 : FR));
for (const c of plan.tarjetas) {
  const t = c.texto.endsWith('\n') ? esc(c.texto.slice(0, -1)) + '<br>' : esc(c.texto) + (c.acento ? ' ' : '');
  const acento = c.acento ? `<b${c.acento_t ? ' class="late"' : ''}>${esc(c.acento)}</b>` : '';
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
const costuras = plan.costuras.filter((c) => c.tipo === 'empuje').map((c) => ({
  t: c.t,
  sale: [...c.sale, ...(c.tarjetas ? [c.tarjetas.sale] : [])].filter(existe),
  entra: [...c.entra, ...(c.tarjetas ? [c.tarjetas.entra] : [])].filter(existe),
}));
const PLAN_JS = {
  W, H, FR, PUSH, PEASE: plan.empuje.ease, E_IN, E_OUT, costuras, ACC, DUR,
  zoom: plan.zoom.fin,
  fotos: fotosPlan,
  tarjetas: plan.tarjetas.map(({ id, entra, b, acento_t }) => ({ id, a: +entra, b, acento_t: acento_t || null, en_empuje_entra: viajaEntra.has(id), en_empuje_sale: viajaSale.has(id) })),
  rotulo: plan.rotulo,
  gancho: { a: plan.gancho.miniaturas.a, esc: plan.gancho.miniaturas.escalon, ids: plan.imagenes.map((m) => m.id) },
  regla: { refs: { a: plan.regla.refs.a, esc: plan.regla.refs.escalon, n: plan.refs.recortes.length }, escala: plan.regla.escala },
  imagenes: plan.imagenes.map((m) => ({ id: m.id, a: m.tag_t, fin: m.fin, sello: m.sello || null, pastilla: m.pastilla || null })),
  l1: { nota2_t: plan.l1.nota2.t, ruido_t: plan.l1.ruido.t, filas: plan.l1.filas.map((f, i) => ({ n: i + 1, t: f.t })) },
  l2: { filas: plan.l2.tabla.filas.map((f, fi) => ({ n: fi + 1, etiqueta_t: f.etiqueta_t, celdas: f.celdas.map((c) => ({ id: `l2-c${fi + 1}${c.n}`, t: c.t })) })), fotos: plan.l2.fotos.lista.map((f, i) => ({ n: i + 1, t: f.t, cap_t: f.cap_t })), anillo_t: plan.l2.anillo_t },
};
const out = `<!doctype html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=${W}, height=${H}">
<title>Lucía · G4</title>
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
for (const m of plan.medios) console.log(`  ${m.a.toFixed(3).padStart(7)} – ${m.b.toFixed(3).padEnd(7)} ${m.id.padEnd(9)} ${m.tipo.padEnd(5)} ${m.capa}`);
console.log('Costuras (empuje rígido de 6 cuadros):');
for (const c of plan.costuras) console.log(`  ${c.t.toFixed(2).padStart(6)}  ${c.tipo}  sale ${c.sale.join(',')} → entra ${c.entra.join(',')}`);
console.log('Tarjetas (entra = 1 cuadro antes de a salvo en los empujes, donde viajan):');
for (const c of plan.tarjetas) console.log(`  ${c.a.toFixed(2).padStart(6)} – ${c.b.toFixed(2).padEnd(6)} ${c.id.padEnd(3)} ${String(c.n_palabras)} pal (mín ${c.min_s} s) «${(c.texto.replace(/\n/g, ' ') + ' ' + (c.acento || '')).trim()}»${viajaEntra.has(c.id) ? ' [entra con el empuje]' : ''}${viajaSale.has(c.id) ? ' [sale con el empuje]' : ''}`);
console.log('Lecturas de rótulo, datos, sellos, placas (≥ 0,35 s/palabra + 0,3):');
for (const x of lecturas) console.log(`  ${x.que.padEnd(22)} ${String(x.n).padStart(2)} pal  ${x.a.toFixed(2)}–${x.b.toFixed(2)}  ${x.dur.toFixed(2)} s  (pide ${x.min.toFixed(2)})  ${x.dur - x.min < 0.2 ? '← justo' : ''}`);
console.log('Datos (de PROCEDENCIA.jsonl):');
for (const m of plan.imagenes) console.log(`  Imagen ${m.letra}: ${crs(m.cr)} cr · parecido ${fm(m.valor)} (medido ${m._raw}) · ${m.estado}`);
console.log('Lo que el video afirma, contra los datos:');
for (const c of claim) console.log('  ' + c);
console.log('Agregados al guion (reversibles, ver plan.json):', plan.agregados_al_guion.map((a) => a.id).join(', '));
console.log(`ok: index.html (${Math.round(out.length / 1024)} KB)`);
