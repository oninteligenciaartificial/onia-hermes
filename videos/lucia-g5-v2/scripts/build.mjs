#!/usr/bin/env node
// Lucía · G5 v2 «Cómo mido si una cara es la de Lucía (y cuándo no creerle al número)» (26,8 s, 1080x1920, 24 fps) — re-corte de G5 con HyperFrames (11-oct-2026).
// Lee plan.json (capas, tiempos, datos) y guion-voz.txt (los TRAMOS: una línea de voz = un tramo) → valida reglas de texto, costuras, el CRONOGRAMA DE VOZ
// (caracteres / 17 por segundo, o duraciones.json si existe, + hueco ≤ 0,25-0,30 s, ≤ 450 caracteres; plan.json tiene que estar al día con él: scripts/retemporizar.mjs)
// Y LOS NÚMEROS / AFIRMACIONES contra v4/PROCEDENCIA.jsonl → escribe index.html
// (DOM estático + un único timeline GSAP) y los manifiestos que leen los controles (qa/elementos-texto.json, qa/eventos-plan.json, qa/datos-plan.json, qa/lectura-plan.json).
// 0 créditos: tres fotos y el cierre ya pagados el 8-oct, dos cuadros de clips crudos de G2 (versionados en assets-fijos/), 8 referencias oficiales. SIN VOZ: el audio es silencio.
// Sin clips: fotos fijas con empuje lento, cuadros fijos y placas. Método y trampas: .claude/skills/lucia/montaje-hyperframes.md. Plantilla: videos/lucia-g5/ (57,5 s).
// Uso:  node scripts/build.mjs   (copia el material, valida e imprime la tabla de cortes; si falla una regla o una afirmación, se corta y no escribe index.html)
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CUPO, GAP_MAX, GAP_OBJ, CPS, leerDuraciones } from './voz.mjs';
import { cronogramaDelPlan, retemporizar, diferencias } from './retemporizar.mjs';

const P = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const plan = JSON.parse(fs.readFileSync(path.join(P, 'plan.json'), 'utf8'));
const { w: W, h: H, fps: FPS } = plan.lienzo;
const DUR = plan.lienzo.cuadros / plan.lienzo.fps;                      // exacto: un número entero de cuadros
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
if (Math.abs(med['f-cierre'].b - DUR) > 1e-6) errores.push(`el cierre termina en ${med['f-cierre'].b} y el video dura ${DUR}`);
if (DUR < 26 - 1e-9 || DUR > 30 + 1e-9) errores.push(`la duración (${DUR.toFixed(3)} s) está fuera de 26-30 s`);
// cadena de tarjetas: contiguas (b de una = a de la siguiente)
for (const cad of plan.cadenas_de_tarjetas) for (let i = 1; i < cad.length; i++) {
  if (Math.abs(tj[cad[i]].a - tj[cad[i - 1]].b) > 1e-9) errores.push(`${cad[i - 1]}→${cad[i]}: no son contiguas (${tj[cad[i - 1]].b} vs ${tj[cad[i]].a})`);
}
if (plan.cadenas_de_tarjetas[0].length !== plan.tarjetas.length) errores.push('la cadena de tarjetas no incluye a todas');
// ── CRONOGRAMA DE VOZ: cada línea de guion-voz.txt es un tramo; el plan (tarjetas y tramos) tiene que seguirlos al cuadro ──
const vozTxt = fs.readFileSync(path.join(P, 'guion-voz.txt'), 'utf8');
const crono = cronogramaDelPlan(P, plan);                    // estimado a 17 car/s, o con las duraciones reales si existe duraciones.json
const voces = crono.tramos;
{
  if (crono.chars > CUPO) errores.push(`guion-voz.txt: ${crono.chars} caracteres (con un salto entre líneas): pasa el cupo de ${CUPO}`);
  if (crono.cuadros !== plan.lienzo.cuadros) errores.push(`guion-voz.txt da ${crono.cuadros} cuadros y plan.lienzo.cuadros dice ${plan.lienzo.cuadros}: correr node scripts/retemporizar.mjs`);
  // plan.json (tramos, tarjetas, costuras, medios y todos los eventos de plan.rel) tiene que estar al día con el cronograma de voz
  { const dif = diferencias(plan, retemporizar(plan, crono)); if (dif.length) errores.push(`plan.json está desfasado del cronograma de voz (${dif.length} valores: ${dif.slice(0, 4).join(' · ')}…): correr node scripts/retemporizar.mjs`); }
  if (voces.length !== plan.tramos.length || voces.length !== plan.tarjetas.length) errores.push(`hay ${voces.length} líneas de voz, ${plan.tramos.length} tramos y ${plan.tarjetas.length} tarjetas: tienen que ser las mismas`);
  voces.forEach((v, i) => {
    const tr = plan.tramos[i], c = plan.tarjetas[i];
    if (!tr || !c) return;
    if (Math.abs(tr.a - v.a) > 1e-6 || Math.abs(tr.b - v.b) > 1e-6) errores.push(`tramo ${v.n}: el plan dice ${tr.a}-${tr.b} y la línea de voz da ${v.a.toFixed(4)}-${v.b.toFixed(4)} (${v.chars} caracteres / ${CPS} + hueco)`);
    if (Math.abs(c.a - v.a) > 1e-6 || Math.abs(c.b - v.b) > 1e-6 || c.tramo !== tr.id) errores.push(`tarjeta ${c.id}: no coincide con el tramo ${v.n} (${v.a.toFixed(4)}-${v.b.toFixed(4)})`);
    if (!v.ultimo && v.hueco > GAP_MAX + 1e-9) errores.push(`tramo ${v.n}: hueco de ${v.hueco.toFixed(3)} s entre líneas (máx ${GAP_MAX})`);
    if (v.lecturaCorta) errores.push(`tramo ${v.n}: la lectura pide ${v.pide} cuadros y con un hueco ≤ ${GAP_MAX} s solo caben ${Math.floor(plan.lienzo.fps * (v.voz_s + GAP_MAX))}: acortar la tarjeta o la placa, o alargar la línea`);
    v.tarjeta = c.id;
  });
  if (/\d[.,]\d/.test(vozTxt)) errores.push('guion-voz.txt: hay un decimal; la voz no lleva cifras con coma (el TTS las lee mal; la pantalla las muestra)');
  // lo que la voz dice y lo que la pantalla dice es lo mismo (las cifras van en pantalla; la voz las nombra sin decimales)
  const dice = (n, re) => { if (!re.test(voces[n - 1]?.linea || '')) errores.push(`la línea de voz ${n} no dice lo que su tarjeta (${re})`); };
  dice(1, /^¿Cómo sé que sigue siendo ella\?/); dice(4, /piso lo elegí yo/); dice(5, /otra persona/); dice(6, /a ojo/); dice(6, /medidor avisa/); dice(7, /clip varía/); dice(8, /letreros inventados/); dice(9, /imagen entera/);
  if (voces.at(-1)?.linea !== 'Seguime: cada semana, una prueba.') errores.push('la última línea de voz tiene que ser el CTA exacto «Seguime: cada semana, una prueba.»');
}
// el CTA exacto, en los últimos 2,4 a 5,5 s (regla de marca)
{
  const cta = plan.tarjetas.at(-1), t = `${cta.texto.replace(/\n/g, ' ')} ${cta.acento}`.replace(/\s+/g, ' ').trim();
  if (t !== 'Seguime: cada semana, una prueba.') errores.push(`CTA: «${t}» no es el texto exacto`);
  const vis = DUR - cta.a;
  if (vis < 2.4 - 1e-9 || vis > 5.5 + 1e-9) errores.push(`CTA: se ve ${vis.toFixed(3)} s y la regla pide 2,4 a 5,5 s`);
  if (plan.rotulo.a !== 0 || plan.rotulo.b < 3.0 - 1e-9) errores.push('el rótulo de IA tiene que verse desde el cuadro 0 hasta los 3,0 s');
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
dato[plan.gancho.dato.id] = { ...plan.gancho.dato };           // la pastilla ya trae el nombre de la herramienta (D-N1)
for (const e of plan.ejemplos) dato[e.id] = e;
if (proc && vid && lab && !errores.length) {
  const raw = (k) => proc[k].id;
  const ok = (cond, texto) => { claim.push(`${cond ? 'ok ' : '✖  '} ${texto}`); if (!cond) errores.push(`afirmación falsa: ${texto}`); };
  const piso = SC.piso;
  // D-N1 (11-oct-2026): las herramientas se NOMBRAN. El nombre que va en pantalla tiene que corresponder a la clave de PROCEDENCIA del archivo que se muestra
  const Hn = plan.herramientas;
  for (const [k, re] of Object.entries(Hn.claves)) {
    const clave = { a: plan.claves_procedencia.a, f: null, cafe_b: plan.claves_procedencia.b_cafe, m4: plan.claves_video.m4, m5: plan.claves_video.m5, m6: plan.claves_video.m6 }[k];
    if (clave && !new RegExp(re).test(clave)) errores.push(`herramienta «${Hn[k]}» (${k}): la clave de PROCEDENCIA «${clave}» no corresponde a /${re}/`);
  }
  if (!plan.gancho.dato.pill.startsWith(Hn.a) || !plan.ejemplos[0].pill.startsWith(Hn.cafe_b)) errores.push('las pastillas del gancho y del café tienen que empezar con el nombre de su herramienta (plan.herramientas)');
  for (const [k, h] of [['r1', 'm5'], ['r2', 'm6'], ['r3', 'm4']]) if (plan[k].tool.herr !== h) errores.push(`${k}: la etiqueta tiene que nombrar ${Hn[h]} (${h})`);
  claim.push(`ok  herramientas nombradas (D-N1): gancho «${Hn.a}», café «${Hn.cafe_b}», razón 1 «${Hn.m5}», razón 2 «${Hn.m6}», razón 3 «${Hn.m4}»; cada nombre corresponde a la clave de PROCEDENCIA del archivo que se ve`);
  // números de la foto del gancho (A) y del ejemplo (B del café)
  for (const d of Object.values(dato)) {
    if (r2(raw(d.clave)) !== d.valor) errores.push(`${d.id}: parecido ${d.valor} y PROCEDENCIA dice ${raw(d.clave)} → ${r2(raw(d.clave))}`);
    const est = raw(d.clave) >= piso ? 'ok' : 'bajo';
    if (est !== d.estado) errores.push(`${d.id}: estado «${d.estado}» y ${raw(d.clave)} es «${est}» (piso ${piso})`);
  }
  ok(raw('a') >= piso && r2(raw('a')) === 0.81, `gancho «parecido 0,81»: la imagen A mide ${raw('a')} (≥ ${fm(piso)}, sobre el piso). La pantalla no dice «es ella»: solo muestra el número que el programa le dio`);
  ok(raw('b_cafe') < piso && /otra persona/.test(proc.b_cafe.nota || '') && /otra persona/.test(`${tj.c5.texto} ${tj.c5.acento}`) && /bajo el piso/i.test(tj.c5.texto), `«Bajo el piso: otra persona.» (parecido 0,35): la imagen B del café mide ${raw('b_cafe')} (< ${fm(piso)}) y PROCEDENCIA dice «${proc.b_cafe.nota}»`);
  ok(SC.piso === 0.7, `«Piso, 0,70. Lo elegí yo.»: el piso del plan es ${SC.piso} (el gate del repo: 0,70, una decisión)`);
  ok(refNames.length === 8 && plan.refs.recortes.length === 8, `«Ocho fotos oficiales»: el manifiesto trae ${refNames.length} referencias y el plan ${plan.refs.recortes.length} recortes`);
  // razón 1: cara chica
  const f5 = caras.frames.fr_m5;
  ok(f5.cara_px_nativa === 89 && f5.cara_px_nativa < 200 && /89 a 168 px/.test(vid.m5.nota || ''), `«Cara chica: lo reviso a ojo.»: la cara del cuadro del Motor 5 mide ${f5.cara_px_nativa} px (< 200 px: la regla del gate no la da por fiable y la imagen se mira; PROCEDENCIA: «${vid.m5.nota}»). NO se afirma que el número baje ni que no baje: ese cuadro dio ${vid.m5.id[0]} y el control (qa/cara-chica-control.txt) da −0,004 a −0,010 a 60 px en 5 de 6 fotos`);
  // razón 2: el MISMO clip (Motor 6) oscila; las dos puntas y el promedio salen de PROCEDENCIA
  const m6 = vid.m6.id, mn = Math.min(...m6), mx = Math.max(...m6), prom = m6.reduce((s, x) => s + x, 0) / m6.length, p = plan.r2;
  p.d1.valor = r2(mn); p.d2.valor = r2(mx); p.d1.raw = mn; p.d2.raw = mx; p.banda.centro = prom;
  const difMax = Math.max(...lab.id.map((x, i) => Math.abs(x - lab.fuente_mismo_instante[i])));
  ok(mn === 0.771 && mx === 0.799 && m6.length === 6, `razón 2: las 6 medidas del MISMO clip (Motor 6, PROCEDENCIA línea 97) son ${m6.join(' · ')}: mínimo ${mn} → ${fm(r2(mn))}, máximo ${mx} → ${fm(r2(mx))} (rango ${(mx - mn).toFixed(3)})`);
  const c7 = tj.c7;
  ok(/^Esa variación/.test(c7.texto) && /cabe en ±0,03/.test(c7.acento) && p.banda.mas_menos === 0.03 && /mismo clip/.test(p.tool.sufijo || ''), `«Esa variación cabe en ±0,03.» (la etiqueta de la placa dice «${plan.herramientas[p.tool.herr]}${p.tool.sufijo}»: la variación es la de UN clip; revisión 1, H4): las dos puntas (${fm(p.d1.valor)} y ${fm(p.d2.valor)}) van rotuladas sobre la escala ampliada y su valor lo comprueba medir-dom en el DOM (qa/datos-plan.json)`);
  ok(m6.every((x) => Math.abs(x - prom) <= p.banda.mas_menos + 1e-9), `las 6 medidas del clip caen dentro de ±${p.banda.mas_menos} de su promedio (${prom.toFixed(3)}): la banda dibujada las contiene a todas (la mayor separación al promedio es ${Math.max(...m6.map((x) => Math.abs(x - prom))).toFixed(3)})`);
  ok(difMax <= 0.03 + 1e-9, `±0,03 como tamaño del ruido: entre un clip y su remapeo de labios (misma cara, mismos instantes) la mayor diferencia medida es ${difMax.toFixed(3)} (sync_so, PROCEDENCIA línea 97), y el rango del clip del Motor 6 es ${(mx - mn).toFixed(3)}. Es un tamaño aproximado del ruido, NO un intervalo de confianza`);
  // razón 3: letreros
  const m4 = vid.m4, t4 = [0, 1, 2, 3, 4, 5, 5.9];
  ok(/letreros inventados/.test(`${tj.c8.texto} ${tj.c8.acento}`) && /letrero/.test(m4.nota || '') && plan.frames.m4.t_clip === t4[plan.r3.muestra] && r2(m4.id[plan.r3.muestra]) === 0.8 && m4.id[plan.r3.muestra] >= piso, `«El número no ve letreros inventados.»: PROCEDENCIA dice del Motor 4 «${m4.nota}» y su medida a ${t4[plan.r3.muestra]} s (el cuadro mostrado) es ${m4.id[plan.r3.muestra]} → ${fm(r2(m4.id[plan.r3.muestra]))}, sobre el piso: el número aprueba un clip con letrero inventado`);
  ok(plan.frames.m4.cuadro === Math.round(plan.frames.m4.t_clip * FPS), `el cuadro 96 del clip es t = ${plan.frames.m4.t_clip} s a 24 fps`);
  ok(plan.frames.m5.cuadro === 0 && r2(vid.m5.id[0]) === 0.8, `el cuadro 0 del Motor 5 es la primera muestra de PROCEDENCIA (${vid.m5.id[0]})`);
}
// pie: pie.txt se ESCRIBE a mano (el pie del guion aprobado de G5 habla de un video de 57 s; este es de 26,8 s) y el build lo comprueba contra la pantalla, la voz y las frases retiradas
const SUENA_A_RECOMENDACION = ['el mejor', 'la mejor', 'los mejores', 'lo mejor', 'recomend', 'te conviene', 'usá este', 'usa este', 'mejor que', 'ganó', 'gana ', 'ganador'];   // D-N1: se nombra lo que se usa, nunca «el mejor» ni una recomendación
const RETIRADAS = ['baja sola', 'poco confiable', 'orden de magnitud', 'se parece poco', 'es ruido', 'no es fiable', 'lo inventó la ia', 'son tomas sueltas', 'no una comparación', 'un programa'];   // las tres últimas: revisión 1 (H2, H5, H9)
const pie = fs.readFileSync(path.join(P, 'pie.txt'), 'utf8').replace(/\s+/g, ' ').trim();
{
  const lp = pie.toLowerCase();
  if (!pie.startsWith('Personaje hecho con IA: Lucía Antelo, de @oniahq.')) errores.push('el pie tiene que ABRIR con «Personaje hecho con IA: Lucía Antelo, de @oniahq.» (revisión 1, H3; lo comprueba startsWith, no una lectura)');
  for (const f of ['ocho fotos oficiales', 'un medidor (arcface) que las compara', '0,70', 'que elegí yo', 'bajo el piso', 'otra persona', 'a ojo', '0,77', '0,80', 'cabe en ±0,03', 'letreros inventados', 'imagen entera', 'cada semana hago una prueba', 'seguime', 'seedream 4.5', 'kling o1 image', 'kling o3', 'cinematic studio 3.0', 'seedance 2.0 mini + referencias',
    'una toma de cada una: es una prueba, no una regla. en otras dos escenas, kling o1 image dio 0,79 y 0,83.']) if (!lp.includes(f)) errores.push(`el pie no dice «${f}», que el video sí dice`);
  // H2: los números de las otras dos tomas de Kling O1 Image salen de PROCEDENCIA (línea «resultados»), no de memoria
  if (proc) {
    const k1 = proc.kling_otra_k1?.id, k4 = proc.kling_otra_k4cafe?.id;
    if (r2(k1) !== 0.79 || r2(k4) !== 0.83) errores.push(`el pie dice «Kling O1 Image dio 0,79 y 0,83» y PROCEDENCIA da ${k1} y ${k4}`);
    else claim.push(`ok  pie «En otras dos escenas, Kling O1 Image dio 0,79 y 0,83»: PROCEDENCIA línea 97, kling_omni_image_K1 ${k1} → ${fm(r2(k1))} y K4cafe ${k4} → ${fm(r2(k4))} (la del café de este video, 0,35, es la tercera toma)`);
  }
  const pantalla = [plan.rotulo.texto, ...plan.tarjetas.map((c) => `${c.texto} ${c.acento || ''}`), plan.r1.nota.texto, plan.r2.zoom.texto, plan.r3.llamada.texto].join(' \n ').replace(/\s+/g, ' ').toLowerCase();
  for (const f of RETIRADAS) {
    if (lp.includes(f)) errores.push(`el pie repite una frase retirada: «${f}»`);
    if (pantalla.includes(f)) errores.push(`la pantalla repite una frase retirada: «${f}»`);
    if (vozTxt.toLowerCase().includes(f)) errores.push(`la voz repite una frase retirada: «${f}»`);
  }
  const pant2 = [plan.rotulo.texto, ...plan.tarjetas.map((c) => `${c.texto} ${c.acento || ''}`), plan.r1.nota.texto, plan.r2.zoom.texto, plan.r3.llamada.texto, ...Object.values(plan.herramientas).filter((x) => typeof x === 'string' && !x.startsWith('D-N1')), plan.gancho.dato.pill, plan.ejemplos[0].pill].join(' ').toLowerCase();
  for (const f of SUENA_A_RECOMENDACION) {
    if (pant2.includes(f)) errores.push(`la pantalla suena a recomendación o a «el mejor»: «${f}»`);
    if (vozTxt.toLowerCase().includes(f)) errores.push(`la voz suena a recomendación o a «el mejor»: «${f}»`);
    if (f !== 'recomend' && lp.includes(f)) errores.push(`el pie suena a recomendación o a «el mejor»: «${f}»`);
  }
  if (!/nombro lo que uso; no es una recomendación pagada\./.test(lp)) errores.push('el pie tiene que decir «Nombro lo que uso; no es una recomendación pagada.» (D-N1)');
  claim.push('ok  nada suena a «el mejor» ni a recomendación en pantalla ni en la voz; el pie dice «Nombro lo que uso; no es una recomendación pagada.»');
  claim.push('ok  pie.txt ABRE con «Personaje hecho con IA: Lucía Antelo, de @oniahq.», nombra al medidor (ArcFace), dice lo que el video dice (ocho fotos oficiales, piso 0,70, café 0,35, cara chica, 0,77-0,80 cabe en ±0,03, letreros inventados, imagen entera, CTA), pone el límite de las herramientas («Una toma de cada una: es una prueba, no una regla») y no repite ninguna frase retirada');
  claim.push(`ok  ninguna frase retirada (${RETIRADAS.join(' / ')}) en pantalla, voz ni pie`);
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
  L('sc-mkl', 'p2 «piso»', `piso · ${fm(SC.piso)}`, es.marca_t + 0.05 + E_IN, fin('pl-p2'));
  for (const e of plan.ejemplos) L(`dA-${e.id}`, `ejemplo ${e.letra} dato`, `${e.pill} ${fm(e.valor)}`, e.t + E_IN, e.fin - 0.1);
  const r1 = plan.r1; L('r1-tag', 'r1 «89 px»', `${caras.frames.fr_m5.cara_px_nativa} px`, r1.tag_t + 0.25, fin('pl-r1')); L('r1-nota', 'r1 nota (ya está al llegar)', r1.nota.texto, llega('pl-r1'), fin('pl-r1')); L('tool-r1', 'r1 herramienta (ya está al llegar)', plan.herramientas[r1.tool.herr], llega('pl-r1'), fin('pl-r1'));
  const r = plan.r2;
  L('r2-mkl', 'r2 «piso»', `piso · ${fm(SC.piso)}`, llega('pl-r2'), fin('pl-r2'));
  L('r2-zoom', 'r2 «Zoom»', r.zoom.texto, llega('pl-r2'), fin('pl-r2'));
  L('tool-r2', 'r2 herramienta (ya está al llegar)', plan.herramientas[r.tool.herr] + (r.tool.sufijo || ''), llega('pl-r2'), fin('pl-r2'));
  r.marcas.forEach((m, i) => L(`r2-m${i + 1}`, `r2 marca ${fm(m)}`, fm(m), llega('pl-r2'), fin('pl-r2')));
  L('r2-v1', 'r2 valor 1', fm(r.d1.valor), r.d1.t + 0.25, fin('pl-r2')); L('r2-v2', 'r2 valor 2', fm(r.d2.valor), r.d2.t + 0.25, fin('pl-r2'));
  L('r2-bl', 'r2 banda', `±${fm(r.banda.mas_menos)}`, r.banda.t + 0.3, fin('pl-r2'));
  const r3 = plan.r3;
  L('r3-call', 'r3 «Lo difuminé» (ya está al llegar)', r3.llamada.texto.replace('\n', ' '), llega('pl-r3'), fin('pl-r3')); L('tool-r3', 'r3 herramienta (ya está al llegar)', plan.herramientas[plan.r3.tool.herr], llega('pl-r3'), fin('pl-r3')); L('r3-num', 'r3 número', `parecido ${fm(r2(vid.m4.id[r3.muestra]))}`, r3.pill_num_t + E_IN, fin('pl-r3'));
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
const boxDe = { 'f-gancho': { k: 'gancho', estado: 'ok', t: plan.gancho.caja_t, fin: plan.gancho.caja_fin } };
for (const e of plan.ejemplos) boxDe[e.medio] = { k: e.id, estado: e.estado, t: e.box_t, fin: e.box_fin };
for (const m of plan.medios) if (m.tipo === 'foto') {
  const f = plan.fotos[m.foto], c = caras.fotos[m.foto].caja, ox = Math.round((c[0] + c[2]) / 2), oy = Math.round((c[1] + c[3]) / 2);
  fotosPlan.push({ id: m.id, a: m.a, b: m.b, ox, oy, foto: m.foto });
  let box = '';
  const bx = boxDe[m.id];
  if (bx) {
    const l = c[0] - PAD, t = c[1] - PAD - 8, w_ = c[2] - c[0] + 2 * PAD, h_ = c[3] - c[1] + 2 * PAD + 8;
    box = `<div class="fz" id="${m.id}-bz" style="left:${l}px;top:${t}px;width:${w_}px;height:${h_}px"><div class="fbox${bx.estado === 'bajo' ? ' bad' : ''}" id="${m.id}-box"></div></div>`;
    cajas.push({ id: `${m.id}-box`, zid: `${m.id}-bz`, medio: m.id, t: bx.t, fin: bx.fin ?? null, ox: ox - l, oy: oy - t });
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

// ── paso 2: las 8 referencias en fila → flecha → la escala 0-1 (un cursor la recorre de 0 a 1 mientras la voz dice «de 0 a 1») con «idéntica · 1» y la marca «piso · 0,70» ──
{
  const q = plan.p2.fila, es = plan.p2.escala, y = es.y, fl = plan.p2.flecha;
  let h = '';
  plan.refs.recortes.forEach((m, i) => { h += `<div class="ref q" id="q${i + 1}" style="left:${q.x0 + i * (q.lado + q.gap)}px;top:${q.y}px;width:${q.lado}px;height:${q.lado}px"><img src="assets/${m.id}.jpg" alt=""></div>`; });
  h += `<svg class="ab" id="p2-flecha" style="left:${fl.x - 40}px;top:${fl.y1}px" width="80" height="${fl.y2 - fl.y1}" viewBox="0 0 80 ${fl.y2 - fl.y1}"><line x1="40" y1="0" x2="40" y2="${fl.y2 - fl.y1 - 6}" stroke="#F6F8FB" stroke-opacity=".85" stroke-width="6" stroke-linecap="round"/><path d="M14 ${fl.y2 - fl.y1 - 34} L40 ${fl.y2 - fl.y1 - 6} L66 ${fl.y2 - fl.y1 - 34}" fill="none" stroke="#F6F8FB" stroke-opacity=".85" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  h += `<div class="trk" id="sc-trk" style="left:${SC.x0}px;top:${y}px;width:${SC.x1 - SC.x0}px"><div class="zona" id="sc-zona" style="left:${X(SC.piso) - SC.x0}px;right:0"></div></div>`;
  h += `<div class="mkv" id="sc-mk" style="left:${X(SC.piso)}px;top:${y - 62}px;height:96px"></div>`;
  h += `<div class="dot s" id="sc-cur" style="left:${X(0)}px;top:${y + 13}px"></div>`;
  h += cent(X(SC.piso), es.marca_label_y, `<span class="tag tag-d" id="sc-mkl"><i></i>piso · <b>${fm(SC.piso)}</b></span>`, 560);
  h += `<div class="ax" id="sc-ax0" style="left:${SC.x0}px;top:${y + 50}px">0</div>`;
  h += `<div class="ax r" id="sc-ax1" style="left:${SC.x1 - 420}px;width:420px;top:${y + 50}px">idéntica · 1</div>`;
  html += FULLDIV('pl-p2', med['pl-p2'].a, med['pl-p2'].b, 4, h, 'pl');
  plan.p2._cur = { x0: X(0), x1: X(1) };
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
  h += `<div class="ab" style="left:${r1.tool.x}px;top:${r1.tool.y}px"><span class="tag tool" id="tool-r1">${esc(plan.herramientas[r1.tool.herr])}</span></div>`;
  html += FULLDIV('pl-r1', med['pl-r1'].a, med['pl-r1'].b, 4, h, 'pl');
  plan.r1._geom = { L, T, BW, BH, s, bgx, bgy };
}

// ── razón 2: escala AMPLIADA «Zoom: 0,70 a 0,90» con la marca «piso · 0,70», las dos puntas de un MISMO clip (Motor 6: mínimo y máximo de sus 6 medidas) y la banda de ±0,03 alrededor de su promedio ──
{
  const r = plan.r2, y = r.eje.y, b = r.banda, x1 = X2(b.centro - b.mas_menos), x2 = X2(b.centro + b.mas_menos), xp = X2(SC.piso);
  let h = `<div class="ruido" id="r2-band" style="left:${x1}px;top:${r.y_banda_linea + 16}px;width:${x2 - x1}px;height:${y + 30 - (r.y_banda_linea + 16)}px"></div>`;
  h += `<div class="trk" id="r2-trk" style="left:${SC.x0}px;top:${y - 13}px;width:${SC.x1 - SC.x0}px"><div class="zona" style="left:0;right:0"></div></div>`;
  r.marcas.forEach((m, i) => { h += `<div class="tkm" style="left:${X2(m) - 2}px;top:${y + 13}px"></div><div class="ax c" id="r2-m${i + 1}" style="left:${X2(m) - 70}px;width:140px;top:${r.y_marcas}px">${fm(m)}</div>`; });
  // el piso (0,70) está en el extremo izquierdo de la escala ampliada: la misma marca y la misma etiqueta que la escala de 0 a 1
  h += `<div class="mkv" id="r2-mk" style="left:${xp}px;top:${y - 33}px;height:${r.y_inferior - 4 - (y - 33)}px"></div>`;
  h += `<div class="ab" style="left:${xp - 40}px;top:${r.y_inferior}px"><span class="tag tag-d" id="r2-mkl"><i></i>piso · <b>${fm(SC.piso)}</b></span></div>`;
  h += `<div class="ab" style="left:560px;width:440px;top:${r.y_inferior + 12}px;text-align:right"><span class="cap2" id="r2-zoom">${esc(r.zoom.texto)}</span></div>`;
  h += cent(540, r.tool.y, `<span class="tag tool" id="tool-r2">${esc(plan.herramientas[r.tool.herr] + (r.tool.sufijo || ''))}</span>`, 760);
  h += `<div class="brk" id="r2-brk" style="left:${x1}px;top:${r.y_banda_linea}px;width:${x2 - x1}px"></div>`;
  h += cent((x1 + x2) / 2, r.y_banda_label, `<span class="note g" id="r2-bl">±${fm(b.mas_menos)}</span>`, 300);
  h += `<div class="dot f" id="r2-d1" style="left:${X2(r.d1.raw)}px;top:${y}px"></div><div class="dot f" id="r2-d2" style="left:${X2(r.d2.raw)}px;top:${y}px"></div>`;
  h += cent(X2(r.d1.raw) - 52, r.y_valores, `<span class="vl g" id="r2-v1" style="position:static;transform:none">${fm(r.d1.valor)}</span>`, 200);
  h += cent(X2(r.d2.raw) + 52, r.y_valores, `<span class="vl g" id="r2-v2" style="position:static;transform:none">${fm(r.d2.valor)}</span>`, 200);
  html += FULLDIV('pl-r2', med['pl-r2'].a, med['pl-r2'].b, 4, h, 'pl');
  const tl_ = med['pl-r2'].a + PUSH + 0.3;
  datos.push(
    { que: `r2 punta baja ${fm(r.d1.valor)} (${r.d1.raw})`, sel: '#r2-d1', t: r.d1.t + 0.6, m: 'cx', esp: X2(r.d1.raw) }, { que: `r2 punta alta ${fm(r.d2.valor)} (${r.d2.raw})`, sel: '#r2-d2', t: r.d2.t + 0.6, m: 'cx', esp: X2(r.d2.raw) },
    { que: `r2 banda (borde izq. = ${(b.centro - b.mas_menos).toFixed(3)})`, sel: '#r2-band', t: b.t + 0.6, m: 'x1', esp: X2(b.centro - b.mas_menos) }, { que: `r2 banda (borde der. = ${(b.centro + b.mas_menos).toFixed(3)})`, sel: '#r2-band', t: b.t + 0.6, m: 'x2', esp: X2(b.centro + b.mas_menos) },
    { que: 'r2 corchete (borde izq.)', sel: '#r2-brk', t: b.t + 0.6, m: 'x1', esp: X2(b.centro - b.mas_menos) }, { que: 'r2 corchete (borde der.)', sel: '#r2-brk', t: b.t + 0.6, m: 'x2', esp: X2(b.centro + b.mas_menos) },
    { que: 'r2 pista (x = 0,70)', sel: '#r2-trk', t: tl_, m: 'x1', esp: X2(E2.desde) }, { que: 'r2 pista (x = 0,90)', sel: '#r2-trk', t: tl_, m: 'x2', esp: X2(E2.hasta) },
    { que: 'r2 marca del piso (x = 0,70)', sel: '#r2-mk', t: tl_, m: 'cx', esp: X2(SC.piso) },
  );
  r.marcas.forEach((m, i) => datos.push({ que: `r2 marca ${fm(m)} (centro)`, sel: `#r2-m${i + 1}`, t: tl_, m: 'cx', esp: X2(m), tol: 2 }));
  { const es = plan.p2.escala; datos.push({ que: 'p2 cursor en 0 (sale de x = 0)', sel: '#sc-cur', t: es.cursor_t, m: 'cx', esp: X(0) }, { que: 'p2 cursor llega a 1 (x = 1)', sel: '#sc-cur', t: es.uno_t, m: 'cx', esp: X(1) }); }
  datos.push({ que: `r2 valor ${fm(r.d1.valor)}`, sel: '#r2-v1', t: r.d1.t + 0.6, txt: fm(r.d1.valor) }, { que: `r2 valor ${fm(r.d2.valor)}`, sel: '#r2-v2', t: r.d2.t + 0.6, txt: fm(r.d2.valor) });
}

// ── razón 3: cuadro del Motor 4 con el letrero inventado (DIFUMINADO con pluma), el aro sobre todo lo difuminado, «Lo difuminé: lo inventó el motor.» y el número que el programa le dio ──
{
  const r3 = plan.r3, w_ = r3.win, a = r3.aro, c = r3.llamada, num = r2(vid.m4.id[r3.muestra]);
  let h = `<div class="win" id="r3-win" style="left:${w_.x}px;top:${w_.y}px;width:${w_.w}px;height:${w_.h}px"><img src="${plan.frames.m4.src}" alt=""></div>`;
  h += `<div class="aro" id="r3-aro" style="left:${w_.x + a.x}px;top:${w_.y + a.y}px;width:${a.w}px;height:${a.h}px;border-radius:34px"></div>`;
  h += `<div class="call" id="r3-call" style="left:${c.x}px;top:${c.y}px">${esc(c.texto).replace('\n', '<br>')}</div>`;
  h += cent(540, r3.pills_y, `<span class="tag tag-d dg" id="r3-num"><i></i>parecido <b>${fm(num)}</b></span>`, 980);
  h += cent(540, r3.tool.y, `<span class="tag tool" id="tool-r3">${esc(plan.herramientas[r3.tool.herr])}</span>`, 940);
  html += FULLDIV('pl-r3', med['pl-r3'].a, med['pl-r3'].b, 4, h, 'pl');
  datos.push({ que: 'r3 número en pantalla', sel: '#r3-num b', t: r3.pill_num_t + 0.6, txt: fm(num) });
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
  zoom: plan.zoom.fin, BAD,
  fotos: fotosPlan, cajas,
  tarjetas: plan.tarjetas.map(({ id, a, entra, b, acento_t, acento_dur, color }) => ({ id, a: +entra, b, desde_cero: a === 0, bad: color === 'bad', acento_t: acento_t || null, acento_dur: acento_dur || 0.2, en_empuje_entra: viajaEntra.has(id), en_empuje_sale: viajaSale.has(id) })),
  rotulo: plan.rotulo,
  datos: Object.values(dato).map((m) => ({ id: m.id, a: m.t, fin: m.fin })),
  p1: { fila2: plan.p1.refs.fila2_t, esc: plan.p1.refs.escalon, aro_t: plan.p1.aro_t },
  p2: { flecha_t: plan.p2.flecha.t, ...plan.p2.escala, cursor_dx: X(1) - X(0) },
  r1: { box_t: plan.r1.box_t, tag_t: plan.r1.tag_t, lupa_t: plan.r1.lupa_t, ping: plan.r1.lupa_ping_t },
  r2: { d1: plan.r2.d1.t, d2: plan.r2.d2.t, banda: plan.r2.banda.t, ping: plan.r2.banda_ping_t },
  r3: { aro: plan.r3.aro.t, ping: plan.r3.aro.ping_t, num: plan.r3.pill_num_t },
};
const out = `<!doctype html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=${W}, height=${H}">
<title>Lucía · G5 v2</title>
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
// eventos visuales (para scripts/eventos.mjs y scripts/aire.mjs): TODO lo que cambia en pantalla además del empuje lento de las fotos
const ev = [];
const ev_ = (t, que) => ev.push({ t: +(+t).toFixed(3), que });
for (const c of plan.tarjetas) { ev_(c.a, c.id); if (c.acento_t) ev_(c.acento_t, c.id + ' acento'); }
ev_(plan.rotulo.b, 'rótulo IA sale'); ev_(plan.gancho.caja_t, 'gancho caja de cara'); if (plan.gancho.caja_fin) ev_(plan.gancho.caja_fin - 0.2, 'gancho caja sale'); ev_(plan.gancho.dato.t, 'gancho dato'); ev_(plan.gancho.dato.fin, 'gancho dato sale');
plan.refs.recortes.slice(4).forEach((m, i) => ev_(plan.p1.refs.fila2_t + i * plan.p1.refs.escalon, 'p1 ref ' + (i + 5))); ev_(plan.p1.aro_t, 'p1 aro de las 8');
const es = plan.p2.escala; ev_(plan.p2.flecha.t, 'p2 flecha'); ev_(es.dibuja_t, 'p2 escala'); ev_(es.ejes_t, 'p2 ejes'); ev_(es.cursor_t, 'p2 cursor sale de 0'); ev_(es.cursor_t + es.cursor_dura, 'p2 cursor llega a 1'); ev_(es.uno_t, 'p2 «1» se enciende'); ev_(es.marca_t, 'p2 marca 0,70');
for (const e of plan.ejemplos) { ev_(e.box_t, e.id + ' caja'); ev_(e.t, e.id + ' dato'); ev_(e.fin, e.id + ' dato sale'); }
const q1 = plan.r1; ev_(q1.box_t, 'r1 caja'); ev_(q1.tag_t, 'r1 «89 px»'); ev_(q1.lupa_t, 'r1 lupa'); ev_(q1.lupa_ping_t, 'r1 la lupa marca «a ojo»');
const q2 = plan.r2; ev_(q2.d1.t, 'r2 punta baja'); ev_(q2.d2.t, 'r2 punta alta'); ev_(q2.banda.t, 'r2 banda'); ev_(q2.banda_ping_t, 'r2 la banda marca «este margen»');
const q3 = plan.r3; ev_(q3.aro.t, 'r3 aro'); ev_(q3.aro.ping_t, 'r3 el aro vuelve a marcar «inventados»'); ev_(q3.pill_num_t, 'r3 número');
for (const c of plan.costuras) ev_(c.t, 'costura');
fs.mkdirSync(path.join(P, 'qa'), { recursive: true });
fs.writeFileSync(path.join(P, 'qa/eventos-plan.json'), JSON.stringify(ev, null, 1));
fs.writeFileSync(path.join(P, 'qa/elementos-texto.json'), JSON.stringify(lecturas.map(({ id, que, texto, n, a, b, min }) => ({ id, que, texto, n, a, b, min })), null, 1));
fs.writeFileSync(path.join(P, 'qa/datos-plan.json'), JSON.stringify(datos, null, 1));
fs.writeFileSync(path.join(P, 'qa/tramos-voz.json'), JSON.stringify(voces.map(({ n, linea, palabras, chars, voz_s, a, b, hueco, ultimo, tarjeta }) => ({ n, linea, palabras, chars, voz_s: +voz_s.toFixed(3), a: +a.toFixed(4), b: +b.toFixed(4), dura: +(b - a).toFixed(4), hueco: +hueco.toFixed(3), ultimo, tarjeta })), null, 1));

// ───────────────────────── 4) tabla de cortes ─────────────────────────
console.log(`Tramos de voz (guion-voz.txt: caracteres / ${CPS} por segundo${leerDuraciones(P) ? ' → duraciones REALES de duraciones.json' : ' (estimado: aún no hay voz)'} + hueco ≤ ${GAP_OBJ}-${GAP_MAX} s; ≤ ${CUPO} caracteres):`);
for (const v of voces) console.log(`  t${String(v.n).padEnd(2)} ${v.a.toFixed(3).padStart(7)} – ${v.b.toFixed(3).padEnd(7)} ${String(v.palabras).padStart(2)} pal ${String(v.chars).padStart(2)} car  voz ${v.voz_s.toFixed(2)} s  hueco ${v.hueco.toFixed(3)} s  ${v.tarjeta}  «${v.linea}»${v.ultimo ? '  (CTA: la tarjeta se lee ' + (v.b - v.a).toFixed(2) + ' s, la voz dura ' + v.voz_s.toFixed(2) + ' s)' : ''}`);
console.log(`  total: ${voces.reduce((s_, v) => s_ + v.palabras, 0)} palabras, ${crono.chars} caracteres con saltos de línea (${vozTxt.replace(/\n/g, '').length} sin ellos), ${DUR.toFixed(3)} s`);
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
