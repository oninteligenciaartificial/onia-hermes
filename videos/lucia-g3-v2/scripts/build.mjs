#!/usr/bin/env node
// Lucía · G3 v2 «Tres errores que casi publico» (~27 s, 1080x1920, 24 fps) — re-corte de G3 con HyperFrames 0.8.142 (11-oct-2026).
// Lee plan.json (en CUADROS o expresiones T<n>/L<n>/END) + guion-voz.txt → calcula los tramos de voz → valida las reglas (texto, voz, aire,
// costuras, cifras contra PROCEDENCIA.jsonl) → escribe index.html (DOM estático + un timeline GSAP) y plan-resuelto.json (en segundos, lo leen los QA).
// 0 créditos: solo fotos y clips ya pagados (foto descartada y buena K4·1, agenda K2·2, clip K4 338b751f, clip K1 e470ef4f).
// Método y trampas: .claude/skills/lucia/montaje-hyperframes.md. Plantilla: videos/lucia-g3/.
// Uso:  node scripts/build.mjs   (copia el material si falta, genera los recortes con ffmpeg si faltan, valida e imprime la tabla de cortes)
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const P = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const plan = JSON.parse(fs.readFileSync(path.join(P, 'plan.json'), 'utf8'));
const { w: W, h: H, fps: FPS } = plan.lienzo;
const ACC = plan.acento;
const Z = plan.zona_segura;
const FR = 1 / FPS;
const E_IN = 0.18, E_OUT = 0.18;                 // entrada y salida de tarjetas y etiquetas: misma duración y distancia (80 px), eases espejados
const PUSHF = plan.empuje.cuadros, PUSH = PUSHF * FR;
const errores = [];
const rd = (n, d = 3) => +(+n).toFixed(d);

// ───────────────────────── 0) material ─────────────────────────
const R0 = path.resolve(P, '../..');
const KIT = path.join(R0, 'hermes-content/references/modelos/lucia/v4/kit');
const V4 = path.join(R0, 'hermes-content/references/modelos/lucia/v4');
const FONTS = path.join(R0, 'hermes-content/brand/fonts');
const COPIAS = [
  ['assets/k1.mp4', path.join(KIT, 'k1-clip-mira-camara-e470ef4f.mp4')],
  ['assets/k4.mp4', path.join(KIT, 'k4-clip-cuenta-dedos-338b751f.mp4')],
  ['assets/buena.jpg', path.join(KIT, 'k4-1-saluda-eddca486-recorte.jpg')],
  ['assets/agenda.jpg', path.join(KIT, 'k2-2-agenda-papel-1422fa94.jpg')],
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
// GSAP local (el render no puede depender de la red): 3.14.2, la versión que fija el scaffold de HyperFrames 0.8.142
const gs = path.join(P, 'assets/vendor/gsap.min.js');
if (!fs.existsSync(gs)) {
  fs.mkdirSync(path.dirname(gs), { recursive: true });
  const previo = ['lucia-g3', 'lucia-g1'].map((g) => path.join(R0, 'videos', g, 'assets/vendor/gsap.min.js')).find((f) => fs.existsSync(f));
  if (previo) fs.copyFileSync(previo, gs); else curl('https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js', gs);
}
// La foto descartada del kit es de 720 px; la original es de 1440x2560 (0 cr: es la URL pública de la imagen ya generada, job 6708e444).
const ORIG = path.join(P, 'assets/descartada-orig.png');
if (!fs.existsSync(ORIG)) curl('https://d8j0ntlcm91z4.cloudfront.net/user_38ZdeEBSxQlcwfO6cjFGGPpE3Kz/hf_20261003_205406_6708e444-3076-40f1-b635-c8c6ae993c43.png', ORIG);

const ff = (args) => execFileSync('ffmpeg', ['-v', 'error', '-y', ...args], { stdio: 'inherit' });
const A = (n) => path.join(P, 'assets', n);
// ───────────────────────── 1) imágenes derivadas (resolución completa; SOLO si faltan: al cambiar una caja en plan.json, borrar el archivo) ─────────────────────────
fs.mkdirSync(A('k4cuadros'), { recursive: true });
{
  const L = plan.letrero.desenfoque, out = A('descartada.jpg');
  if (!fs.existsSync(out)) {
    if (L.activo) {
      const [x, y, w, h] = L.caja_nativa;
      ff(['-i', ORIG, '-filter_complex',
        `[0:v]split=2[a][b];[b]crop=${w}:${h}:${x}:${y},gblur=sigma=${L.sigma}:steps=3,format=rgba,` +
        `geq=r='r(X,Y)':g='g(X,Y)':b='b(X,Y)':a='255*min(1,min(min(X,W-1-X),min(Y,H-1-Y))/${L.pluma})'[bm];[a][bm]overlay=${x}:${y}`,
        '-frames:v', '1', '-q:v', '2', '-update', '1', out]);
    } else ff(['-i', ORIG, '-frames:v', '1', '-q:v', '2', '-update', '1', out]);
  }
}
{
  const [rx, ry, rw, rh] = plan.letrero.inset.recorte_nativo, out = A('letrero-inset.jpg');
  if (!fs.existsSync(out)) ff(['-i', A('descartada.jpg'), '-vf', `crop=${rw}:${rh}:${rx}:${ry}`, '-frames:v', '1', '-q:v', '2', '-update', '1', out]);
}
{
  const [cx, cy, cw, ch] = plan.placa.recorte, n = plan.placa.cuadro, out = A(`k4cuadros/c${n}.png`);
  if (!fs.existsSync(out)) ff(['-i', A('k4.mp4'), '-vf', `select=eq(n\\,${n}),crop=${cw}:${ch}:${cx}:${cy}`, '-frames:v', '1', '-vsync', '0', '-update', '1', out]);
}
for (const [id, rc] of [['ag-inset1', plan.agenda.origen1.recorte_nativo], ['ag-inset2', plan.agenda.origen2.recorte_nativo]]) {
  const out = A(`${id}.jpg`);
  if (!fs.existsSync(out)) ff(['-i', A('agenda.jpg'), '-vf', `crop=${rc[2]}:${rc[3]}:${rc[0]}:${rc[1]}`, '-frames:v', '1', '-q:v', '2', '-update', '1', out]);
}

// ───────────────────────── 2) voz: tramos desde guion-voz.txt ─────────────────────────
const V = plan.voz;
const vozTxt = fs.readFileSync(path.join(P, V.archivo), 'utf8');
const lineas = vozTxt.split('\n').map((s) => s.trim()).filter(Boolean);
const contar = (t) => t.trim().split(/\s+/).filter(Boolean).length;
const tramos = [];
{
  let f = 0;
  lineas.forEach((texto, i) => {
    const n = contar(texto), fr = Math.round((n / V.palabras_por_s) * FPS);
    tramos.push({ i: i + 1, texto, palabras: n, chars: texto.length, a: f, b: f + fr, dur_s: rd(fr * FR) });
    f += fr + V.hueco_cuadros;
  });
}
const ENDF = tramos.at(-1).b + V.cola_cuadros;
const DUR = ENDF * FR;
const charsTotal = lineas.join('\n').length;                       // con saltos de línea: el cálculo más estricto
if (charsTotal > V.max_caracteres) errores.push(`voz: ${charsTotal} caracteres (con saltos de línea) y el cupo es ${V.max_caracteres}`);
if (V.hueco_cuadros * FR > V.max_hueco_s + 1e-9) errores.push(`voz: el hueco entre líneas es ${(V.hueco_cuadros * FR).toFixed(3)} s y el máximo es ${V.max_hueco_s}`);
if (DUR < V.min_s - 1e-9 || DUR > V.max_s + 1e-9) errores.push(`duración ${DUR.toFixed(3)} s fuera de ${V.min_s}-${V.max_s} s`);
for (const t of tramos) if (Math.abs((t.b - t.a) * FR - t.palabras / V.palabras_por_s) > 0.5 * FR + 1e-9) errores.push(`tramo ${t.i}: dura ${(t.b - t.a) * FR} s y ${t.palabras} palabras a ${V.palabras_por_s}/s dan ${(t.palabras / V.palabras_por_s).toFixed(3)} s`);

// expresiones de tiempo: cuadro entero, «T<n>» (inicio del tramo n), «L<n>» (fin de su voz), «END», con ±cuadros
const fr = (x) => {
  if (typeof x === 'number') return x;
  const s = String(x).replace(/\s+/g, '');
  let m = /^(T|L)(\d+)([+-]\d+)?$/.exec(s);
  if (m) {
    const t = tramos[+m[2] - 1];
    if (!t) throw new Error(`tramo ${m[2]} no existe (hay ${tramos.length}): «${x}»`);
    return (m[1] === 'T' ? t.a : t.b) + (m[3] ? +m[3] : 0);
  }
  m = /^END([+-]\d+)?$/.exec(s);
  if (m) return ENDF + (m[1] ? +m[1] : 0);
  if (/^-?\d+$/.test(s)) return +s;
  throw new Error(`expresión de tiempo inválida: «${x}»`);
};
const sc = (x) => fr(x) * FR;                                     // segundos

// ───────────────────────── 3) reglas ─────────────────────────
const palabras = (t) => `${t.num ? t.num + ' ' : ''}${t.texto} ${t.acento || ''}`.trim().split(/\s+/).filter((s) => s && s !== '·');
const lectura = (n) => n * 0.35 + 0.3;
// 3a) tarjetas
const tarjetas = plan.tarjetas.map((c) => {
  const o = { ...c, a_f: fr(c.a), b_f: fr(c.b) };
  o.a = o.a_f * FR; o.b = o.b_f * FR;
  if (c.acento_t != null) o.acento_t = sc(c.acento_t);
  o.n_palabras = palabras(c).length; o.min_s = rd(lectura(o.n_palabras), 2);
  return o;
});
for (const c of tarjetas) {
  const dur = c.b - c.a;
  if (c.n_palabras > 6) errores.push(`${c.id}: ${c.n_palabras} palabras (máx 6)`);
  if (dur < c.min_s - 1e-9) errores.push(`${c.id}: dura ${dur.toFixed(2)} s y necesita ${c.min_s.toFixed(2)} s para ${c.n_palabras} palabras`);
  // la tarjeta que SALE con un empuje deja de leerse al empezar el empuje: la ventana en reposo es 6 cuadros más corta (lo mide ventanas.mjs en el DOM)
  if (plan.costuras.some((x) => x.tarjetas.sale === c.id) && dur - PUSH < c.min_s - 1e-9) errores.push(`${c.id}: sale con un empuje y en reposo dura ${(dur - PUSH).toFixed(2)} s: necesita ${c.min_s.toFixed(2)} s`);
  if (c.bottom && c.bottom > Z.texto_hasta_y) errores.push(`${c.id}: el borde de abajo (${c.bottom}) pasa de y=${Z.texto_hasta_y}`);
  if (c.top && c.top < Z.arriba_minimo_y) errores.push(`${c.id}: el borde de arriba (${c.top}) queda sobre y=${Z.arriba_minimo_y}`);
  if (c.acento_t != null && (c.acento_t < c.a + 0.5 - 1e-9 || c.acento_t > c.b - 0.5 + 1e-9)) errores.push(`${c.id}: acento_t ${c.acento_t.toFixed(3)} fuera de [a+0,5, b-0,5] = [${(c.a + 0.5).toFixed(3)}, ${(c.b - 0.5).toFixed(3)}]`);
  if (c.tramo && c.a_f < tramos[c.tramo - 1].a - FPS) errores.push(`${c.id}: entra más de 1 s antes que su tramo de voz`);
}
{
  const c1 = tarjetas[0];
  if (c1.a_f !== 0) errores.push('c1: el gancho (título de 3-7 palabras con la promesa) tiene que estar en el cuadro 0');
  if (!c1.sin_entrada) errores.push('c1: sin_entrada debe ser true (visible ya en el cuadro 0, sin animación de entrada)');
  if (c1.n_palabras < 3 || c1.n_palabras > 7) errores.push(`c1: el título tiene ${c1.n_palabras} palabras y la regla pide 3-7`);
  if (/\b(hola|soy|bienvenid)/i.test(`${c1.texto} ${c1.acento}`)) errores.push('c1: el gancho nunca es un saludo');
  const byId = Object.fromEntries(tarjetas.map((c) => [c.id, c]));
  for (const cad of plan.cadenas_de_tarjetas) for (let i = 1; i < cad.length; i++) {
    if (byId[cad[i]].a_f !== byId[cad[i - 1]].b_f) errores.push(`${cad[i - 1]}→${cad[i]}: no son contiguas (${byId[cad[i - 1]].b_f} vs ${byId[cad[i]].a_f} cuadros)`);
  }
  // CTA exacto, en los últimos 2,4-5,5 s y hasta el final
  const cta = byId.c12;
  if (`${cta.texto} ${cta.acento}` !== plan.cta.texto) errores.push(`CTA: «${cta.texto} ${cta.acento}» ≠ «${plan.cta.texto}»`);
  const d = cta.b - cta.a;
  if (d < plan.cta.min_s - 1e-9 || d > plan.cta.max_s + 1e-9) errores.push(`CTA: ${d.toFixed(3)} s en pantalla y tiene que estar entre ${plan.cta.min_s} y ${plan.cta.max_s} s`);
  if (cta.b_f !== ENDF) errores.push('CTA: la tarjeta tiene que llegar hasta el final del video');
}
// 3b) rótulo de IA: texto exacto, desde el cuadro 0 hasta ≥ 3 s, 40 px
const rotulo = { ...plan.rotulo, a: sc(plan.rotulo.a), b: sc(plan.rotulo.b) };
if (rotulo.texto !== 'Lucía Antelo · personaje IA de Onia') errores.push('rótulo: el texto es fijo');
if (rotulo.a !== 0 || rotulo.b < 3.0 - 1e-9) errores.push(`rótulo: tiene que verse del cuadro 0 a los 3 s (a=${rotulo.a}, b=${rotulo.b})`);
const css = fs.readFileSync(path.join(P, 'scripts/estilos.css'), 'utf8').replaceAll('{{ACC}}', ACC);
if (!new RegExp(`\\.tag-lg\\{[^}]*font-size:${Z.rotulo_px}px`).test(css)) errores.push(`css: .tag-lg tiene que medir ${Z.rotulo_px} px (el rótulo de IA)`);
// 3c) etiquetas (la ventana legible debe pasar 0,35 s/palabra + 0,3 más ~0,3 s de entrada y salida)
const etiquetas = plan.etiquetas.map((e) => ({ ...e, a: sc(e.a), b: sc(e.b), n_palabras: palabras({ texto: e.texto }).length }));
for (const e of etiquetas) {
  const need = lectura(e.n_palabras) + 0.3;
  if (e.b - e.a < need - 1e-9) errores.push(`${e.id}: ventana ${(e.b - e.a).toFixed(2)} s y necesita ${need.toFixed(2)} s para ${e.n_palabras} palabras (con entrada y salida)`);
}
// 3d) escenas y costuras (empuje rígido de 6 cuadros)
const escenas = Object.fromEntries(Object.entries(plan.escenas).map(([id, e]) => [id, { ...e, id, a_f: fr(e.a), b_f: fr(e.b), a: sc(e.a), b: sc(e.b) }]));
const costuras = plan.costuras.map((c) => ({ ...c, t_f: fr(c.t), t: sc(c.t) }));
for (const c of costuras) {
  for (const id of c.entra) if (escenas[id] && escenas[id].a_f !== c.t_f - PUSHF) errores.push(`costura ${c.t_f}: «${id}» debe empezar en ${c.t_f - PUSHF} y empieza en ${escenas[id].a_f}`);
  for (const id of c.sale) if (escenas[id] && escenas[id].b_f !== c.t_f) errores.push(`costura ${c.t_f}: «${id}» debe terminar en ${c.t_f} y termina en ${escenas[id].b_f}`);
  const s = tarjetas.find((x) => x.id === c.tarjetas.sale), e = tarjetas.find((x) => x.id === c.tarjetas.entra);
  if (!s || !e) { errores.push(`costura ${c.t_f}: tarjeta «${c.tarjetas.sale}» o «${c.tarjetas.entra}» no existe`); continue; }
  if (s.b_f !== c.t_f) errores.push(`costura ${c.t_f}: la tarjeta «${s.id}» debe terminar en ${c.t_f} y termina en ${s.b_f}`);
  if (e.a_f !== c.t_f) errores.push(`costura ${c.t_f}: la tarjeta «${e.id}» debe entrar en ${c.t_f} y entra en ${e.a_f}`);
}
// 3e) clips: K4 a 1x entre los cuadros k0 y k0+D-1; el cuadro 120 cae T10-12 (6 cuadros de «origen» + 6 de empuje de salida)
const k4 = escenas.k4, k1 = escenas.k1, kk = plan.k4;
const k4F = k4.b_f - k4.a_f;
if (k4.media_inicio + k4F > kk.cuadros_clip) errores.push(`k4: pide los cuadros ${k4.media_inicio}-${k4.media_inicio + k4F - 1} y el clip tiene ${kk.cuadros_clip}`);
const f120 = k4.a_f + (kk.cuadro_foco - k4.media_inicio);              // cuadro del video donde cae el cuadro 120 del clip
if (f120 !== k4.b_f - PUSHF - kk.origen.cuadros) errores.push(`k4: el cuadro ${kk.cuadro_foco} cae en el cuadro ${f120} y tiene que caer en ${k4.b_f - PUSHF - kk.origen.cuadros} (6 de «origen» + 6 de empuje antes de la placa)`);
if (plan.placa.cuadro !== kk.cuadro_foco) errores.push('la placa muestra un cuadro distinto del que se ve en el clip');
if (k1.media_inicio + (k1.b_f - k1.a_f) > 145) errores.push(`k1: pide hasta el cuadro ${k1.media_inicio + (k1.b_f - k1.a_f) - 1} y el clip tiene 145`);
// 3f) recortes y zonas
const insL = plan.letrero.inset.activo !== false ? { ...plan.letrero.inset, a: sc(plan.letrero.inset.a), b: sc(plan.letrero.inset.b) } : null;
const aro = { ...plan.letrero.aro, a: sc(plan.letrero.aro.a) };
const marco = { ...plan.marco_cara, a: sc(plan.marco_cara.a), b: sc(plan.marco_cara.b) };
const insB = plan.agenda.inset2.activo !== false ? plan.agenda.inset2 : null;
const ag = { ins1: { ...plan.agenda.inset1, a: sc(plan.agenda.inset1.a), b: sc(plan.agenda.inset1.b) }, ins2: insB ? { ...insB, a: sc(insB.a), b: sc(insB.b) } : null };
if (insL) {
  if (insL.y < 300) errores.push(`insL: y=${insL.y} queda en la barra de Instagram (< 300)`);
  if (insL.x + insL.w > 1000) errores.push(`insL: x2=${insL.x + insL.w} pasa de 1000`);
  if (insL.y + insL.h > plan.caras.desc.cielo_hasta_y) errores.push(`insL: y2=${insL.y + insL.h} baja sobre el cabello de la descartada (≈ ${plan.caras.desc.cielo_hasta_y})`);
  if (insL.a < aro.a) errores.push('insL: el recorte entra antes que el aro (su recuadro de origen)');
  const need = lectura(contar(insL.caption)) + 0.3;
  if (insL.b - insL.a < need - 1e-9) errores.push(`insL: ventana ${(insL.b - insL.a).toFixed(2)} s y la leyenda necesita ${need.toFixed(2)} s`);
}
if (aro.a > 3.0 - 0.5) errores.push(`aro: la prueba tiene que estar en pantalla antes de los 3 s con margen (entra a ${aro.a.toFixed(2)} s)`);
{
  const V0 = plan.placa.visor;
  if (V0.x + V0.w > 1000 || V0.y + V0.h > Z.texto_hasta_y) errores.push(`placa: el visor se sale de la zona segura (x2=${V0.x + V0.w}, y2=${V0.y + V0.h})`);
  if (Math.abs(V0.w / V0.h - plan.placa.recorte[2] / plan.placa.recorte[3]) > 0.005) errores.push('placa: el visor no tiene la proporción del recorte');
}
// 3g) cifras y afirmaciones contra v4/PROCEDENCIA.jsonl (y ninguna cifra sin fuente)
{
  const prov = fs.readFileSync(path.join(V4, 'PROCEDENCIA.jsonl'), 'utf8').split('\n').filter(Boolean).map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
  const gen = prov.find((o) => o.fotos && o.fotos.K4_1_descartada), rev = prov.find((o) => o.type === 'kit_lucia_revision_manos'), lit = prov.find((o) => o.foto_K4_1_descartada);
  if (!gen || !rev || !lit) errores.push('PROCEDENCIA.jsonl: faltan las líneas de generación (K4_1_descartada), revisión de manos o prompts literales');
  else {
    const fm = (x) => (+x).toFixed(3).replace('.', ',');
    const dsc = gen.fotos.K4_1_descartada;
    if (!/letrero inventado/.test(dsc.veredicto)) errores.push('PROCEDENCIA: la descartada ya no dice «letrero inventado»');
    if (+dsc.id < 0.70) errores.push(`PROCEDENCIA: la cara descartada midió ${dsc.id} (< 0,70): «aprobada» sería falso`);
    const ec = etiquetas.find((e) => e.id === 'e_cara');
    if (!ec || !ec.texto.includes(fm(dsc.id))) errores.push(`e_cara: el puntaje de la descartada es ${fm(dsc.id)}`);
    if (!/letra de la agenda ilegible/.test(gen.fotos.K2_2.veredicto)) errores.push('PROCEDENCIA: la agenda ya no dice «letra de la agenda ilegible»');
    if (!/no signs anywhere/.test(lit.foto_K4_1_descartada.fragmento_del_prompt)) errores.push('PROCEDENCIA: el prompt de la descartada ya no trae «no signs anywhere»');
    const eo = etiquetas.find((e) => e.id === 'e_orden');
    if (!eo || !eo.texto.includes('no signs anywhere')) errores.push('e_orden: la cita tiene que ser «no signs anywhere»');
    const contables = ((/cinco dedos contables en los cuadros ([0-9, y]+);/.exec(rev.resultado) || [])[1] || '').match(/\d+/g) || [];
    if (!contables.includes(String(kk.cuadro_foco))) errores.push(`PROCEDENCIA: el cuadro ${kk.cuadro_foco} no figura entre los de cinco dedos contables (${contables.join(', ')})`);
    if (!rev.resultado.includes(`en ${kk.cruza_registro.join(' y ')} el dedo de la otra mano cruza la mano abierta y NO se cuenta`)) errores.push('PROCEDENCIA: el registro de manos ya no dice que la otra mano cruza en 72 y 104');
    if (!/uno por uno/.test(rev.metodo)) errores.push('PROCEDENCIA: el registro ya no dice que los cuadros se miraron «uno por uno» (sostiene «reviso cuadro a cuadro»)');
    if (!/145 cuadros/.test(rev.clip)) errores.push('PROCEDENCIA: el clip K4 ya no tiene 145 cuadros');
  }
  // ninguna cifra en pantalla ni en la voz sin fuente: solo 1-2-3 (numeración), 120 (cuadro de la placa, validado arriba) y 0,835 (validado arriba)
  const textos = [...tarjetas.map((c) => `${c.num || ''} ${c.texto} ${c.acento || ''}`), ...etiquetas.map((e) => e.texto), rotulo.texto, insL ? insL.caption : '', ...lineas];
  const cifras = new Set(textos.join(' ').match(/\d+(?:,\d+)?/g) || []);
  for (const c of cifras) if (!['1', '2', '3', '120', '0,835'].includes(c)) errores.push(`cifra «${c}» en pantalla o voz sin fuente en PROCEDENCIA`);
  // frases retiradas (afirmaciones que los cuadros desmienten)
  for (const f of ['Así no se cuentan dedos', 'tapada', 'ya se fue']) if (textos.join(' ').toLowerCase().includes(f.toLowerCase())) errores.push(`frase retirada reapareció: «${f}»`);
}
// 3h) pie.txt: abre con «personaje hecho con IA» y dice lo mismo que el video
{
  const pie = fs.readFileSync(path.join(P, 'pie.txt'), 'utf8').trim();
  if (!/^personaje hecho con ia/i.test(pie)) errores.push('pie.txt: tiene que abrir con «personaje hecho con IA»');
  for (const k of ['letrero', 'difumin', 'letra', 'mano', 'cuadro a cuadro', 'cuento solo lo que se ve', 'Cada semana hago una prueba', 'Seguime']) if (!pie.toLowerCase().includes(k.toLowerCase())) errores.push(`pie.txt: no dice «${k}»`);
}
if (errores.length) { console.error('✖ reglas:\n  ' + errores.join('\n  ')); process.exit(1); }

// ───────────────────────── 4) HTML ─────────────────────────
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// 6 decimales: con 3, un data-start de 15.667 (en vez de 15.666667) o un data-media-start de 0.583 (en vez de 0.583333) corría el cuadro del clip 1 cuadro cada uno (medido 11-oct: el final mostraba el cuadro n−2 de K4/K1)
const f3 = (n) => rd(n, 6);
const SESGO_MEDIA = 0.0004;
// data-start: 0,4 ms ANTES del borde del cuadro. Medido el 11-oct: con data-start = 15.666667 (3e-7 s DESPUÉS del cuadro 376) el cuadro 376 queda oculto y el clip muestra su primer cuadro en el 377: todo el clip llegaba 1 cuadro tarde.
// Con el sesgo, el elemento se ve desde el cuadro previsto y su cuadro n cae en el cuadro previsto. Lo mismo vale para el inicio de cualquier contenedor (tarjetas, etiquetas, recortes).
const st0 = (t) => (t <= 1e-9 ? 0 : rd(t - 0.0004, 6));   // el media-start cae 0,4 ms DESPUÉS del borde del cuadro: ni un redondeo hacia abajo ni uno al más cercano cambian de cuadro
let html = '';
let track = 10;
const nextTrack = () => track++;
const FULLDIV = (id, a, b, z, inner) => `<div id="${id}" class="clip" data-start="${st0(a)}" data-duration="${f3(b - a)}" data-track-index="${nextTrack()}" style="position:absolute;left:0;top:0;width:1080px;height:1920px;z-index:${z}">${inner}</div>\n`;
const SCENE = (e, tr, z, inner) => `<div id="${e.id}" class="clip scn" data-start="${st0(e.a)}" data-duration="${f3(e.b - e.a)}" data-track-index="${tr}" style="z-index:${z}"><div class="zoom" id="z-${e.id}" data-layout-allow-overflow><img class="full" src="${e.src}" alt="" data-layout-allow-overflow>${inner}</div></div>\n`;
const vid = (e, tr) => `<video id="${e.id}" src="${e.src}" data-start="${st0(e.a)}" data-duration="${f3(e.b - e.a)}" data-media-start="${f3(e.media_inicio * FR + SESGO_MEDIA)}" data-track-index="${tr}" muted playsinline preload="auto" style="position:absolute;left:0;top:0;width:1080px;height:1920px;object-fit:cover;z-index:1;"></video>\n`;

// fotos con empuje lento: el aro, el marco de la cara y los recuadros de origen están DENTRO del contenedor que hace el zoom (siguen a la foto)
{
  const ax = Math.round(aro.centro[0] - aro.ancho / 2), ay = Math.round(aro.centro[1] - aro.alto / 2);
  const [x1, y1, x2, y2] = marco.caja;
  html += SCENE(escenas.desc, 1, 1,
    `<div id="aro" style="left:${ax}px;top:${ay}px;width:${aro.ancho}px;height:${aro.alto}px"></div>` +
    `<div id="marco" style="position:absolute;left:${x1}px;top:${y1}px;width:${x2 - x1}px;height:${y2 - y1}px">` + ['tl', 'tr', 'bl', 'br'].map((k) => `<i class="cor ${k}"></i>`).join('') + `</div>`);
  html += SCENE(escenas.buena, 1, 2, '');
  const s = W / 1440;
  const caja = (rc) => [Math.round(rc[0] * s), Math.round(rc[1] * s), Math.round(rc[2] * s), Math.round(rc[3] * s)];
  const orgs = [['org1', plan.agenda.origen1], ['org2', plan.agenda.origen2]].map(([id, o]) => { const [x, y, w, h] = caja(o.recorte_nativo); o.caja = [x, y, w, h]; return `<div class="org" id="${id}" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px"></div>`; }).join('');
  html += SCENE(escenas.agenda, 1, 1, orgs);
}
html += vid(k4, 6);
html += vid(k1, 7);

// rótulo de IA (cuadro 0 → ≥ 3 s, 40 px) y etiquetas de dato
html += `<div id="cc-rotulo" class="clip cc cc-top" data-start="${st0(rotulo.a)}" data-duration="${f3(rotulo.b - rotulo.a)}" data-track-index="${nextTrack()}" style="--t:${rotulo.top}px"><div class="cw" id="rotulo"><span class="tag tag-lg"><i></i>${esc(rotulo.texto)}</span></div></div>\n`;
// el contenedor arranca 0,1 s ANTES de que empiece la animación de entrada (el elemento sigue oculto): `hyperframes check` mide el contraste justo al arrancar el contenedor, y una pastilla
// a medio fundido sobre una nube blanca daba 2,1:1 (falso aviso: ya a opacidad completa pasa AA)
for (const d of etiquetas) html += `<div id="cc-${d.id}" class="clip cc cc-top" data-start="${st0(d.a - 0.1)}" data-duration="${f3(d.b - d.a + 0.1)}" data-track-index="${nextTrack()}" style="--t:${d.top}px"><div class="cw" id="${d.id}"><span class="tag tag-lg"><i></i>${esc(d.texto)}</span></div></div>\n`;

// recorte ampliado del letrero (ya difuminado) en el cielo, con su leyenda: declara que el difuminado es de edición
if (insL) html += FULLDIV('cc-insL', insL.a, insL.b, 8, `<div class="ins" id="insL" style="left:${insL.x}px;top:${insL.y}px;width:${insL.w}px;height:${insL.h}px"><img src="assets/letrero-inset.jpg" alt=""><span class="cap" id="capL">${esc(insL.caption)}</span></div>`);

// tarjetas narrativas (la entrada arranca 1 cuadro ANTES de que termine la anterior, salvo en los empujes —viajan— y la primera —ya está en el cuadro 0—)
const viajaEntra = new Set(costuras.map((c) => c.tarjetas.entra));
const viajaSale = new Set(costuras.map((c) => c.tarjetas.sale));
const primeras = new Set(plan.cadenas_de_tarjetas.map((c) => c[0]));
for (const c of tarjetas) c.entra = rd(c.a - (viajaEntra.has(c.id) ? PUSH : primeras.has(c.id) ? 0 : FR), 6);
for (const c of tarjetas) {
  const anch = c.top != null ? `cc-top" style="--t:${c.top}px` : `cc-bot" style="--b:${c.bottom}px`;
  const num = c.num ? `<span class="num">${esc(c.num)}</span>` : '';
  const acento = c.acento ? ` <b${c.acento_t ? ' class="late"' : ''}>${esc(c.acento)}</b>` : '';
  html += `<div id="cc-${c.id}" class="clip cc ${anch}" data-start="${st0(c.entra)}" data-duration="${f3(c.b - c.entra)}" data-track-index="${3 + (tarjetas.indexOf(c) % 2)}">` +
    `<div class="cw" id="${c.id}"><i class="sh sh1"></i><i class="sh sh2"></i><div class="card${c.num ? ' card-num' : ''}"><div class="rail"></div>${num}<div class="t">${esc(c.texto)}${acento}</div></div></div></div>\n`;
}

// recortes ampliados de la agenda: borde verde en el recorte (acá) y recuadro verde del mismo tamaño en la foto (arriba, dentro del zoom)
html += FULLDIV('cc-ins1', ag.ins1.a, ag.ins1.b, 8, `<div class="ins" id="ins1" style="left:${ag.ins1.x}px;top:${ag.ins1.y}px;width:${ag.ins1.w}px;height:${ag.ins1.h}px"><img src="assets/ag-inset1.jpg" alt=""></div>`);
if (ag.ins2) html += FULLDIV('cc-ins2', ag.ins2.a, ag.ins2.b, 8, `<div class="ins" id="ins2" style="left:${ag.ins2.x}px;top:${ag.ins2.y}px;width:${ag.ins2.w}px;height:${ag.ins2.h}px"><img src="assets/ag-inset2.jpg" alt=""></div>`);

// K4: contador «cuadro N» (tira de 145 números que avanza de a un cuadro) y recuadro «origen» sobre el cuadro 120 (solo 6 cuadros)
const ctr = { top: kk.contador.top, a: sc(kk.contador.a), b: k4.b };
const t120 = f120 * FR;
{
  const nums = Array.from({ length: kk.cuadros_clip }, (_, n) => `<em>${n}</em>`).join('');
  html += `<div id="cc-ctr" class="clip cc cc-top" data-start="${st0(ctr.a)}" data-duration="${f3(ctr.b - ctr.a)}" data-track-index="${nextTrack()}" style="--t:${ctr.top}px"><div class="cw" id="ctr"><span class="tag tag-ctr"><i></i>cuadro <span class="ctrwin"><span class="ctrstrip" id="ctrstrip" data-layout-allow-overflow>${nums}</span></span></span></div></div>\n`;
  const [rx, ry, rw, rh] = kk.origen.recorte_fuente;
  kk.origen_caja = [Math.round(rx * 1.5), Math.round(ry * 1.5), Math.round(rw * 1.5), Math.round(rh * 1.5)];
  html += FULLDIV('cc-k4', ctr.a, k4.b, 8, `<div class="org" id="origen" style="left:${kk.origen_caja[0]}px;top:${kk.origen_caja[1]}px;width:${kk.origen_caja[2]}px;height:${kk.origen_caja[3]}px"></div>`);
}

// placa de evidencia: el cuadro 120 ampliado + sello «5 dedos» (ceremonia de contar dedos comprimida a ~1,9 s)
const pl = plan.placa, VV = pl.visor, placa = escenas.placa, sello_t = sc(pl.sello_t);
html += FULLDIV('placa', placa.a, placa.b, 4,
  `<div id="visor" style="left:${VV.x}px;top:${VV.y}px;width:${VV.w}px;height:${VV.h}px"><img src="assets/k4cuadros/c${pl.cuadro}.png" alt=""><span class="vn">cuadro ${pl.cuadro}</span></div>` +
  `<div id="sello" style="right:${W - (VV.x + VV.w - 10)}px;top:${VV.y + VV.h - 52}px">5 dedos</div>`);

const tlJs = fs.readFileSync(path.join(P, 'scripts/timeline.js'), 'utf8');
const existe = (id) => html.includes(`id="${id}"`);
const empujes = costuras.map((c) => ({ t: c.t, sale: [...c.sale, c.tarjetas.sale].filter(existe), entra: [...c.entra, c.tarjetas.entra].filter(existe) }));
const PLAN_JS = {
  W, H, FR, PUSH, PEASE: plan.empuje.ease, E_IN, E_OUT, empujes,
  tarjetas: tarjetas.map(({ id, entra, b, sin_salida, sin_entrada, acento_t }) => ({ id, a: +entra, b, sin_salida: !!sin_salida, sin_entrada: !!sin_entrada, acento_t: acento_t || null, en_empuje_entra: viajaEntra.has(id), en_empuje_sale: viajaSale.has(id) })),
  rotulo, etiquetas, aro, insL, marco, ag, ctr: { ...ctr, cuadros_clip: kk.cuadros_clip, k0: k4.media_inicio, t_clip: k4.a, t120, origen_cuadros: kk.origen.cuadros },
  placa: { sello_t, a: placa.a, b: placa.b }, zooms: Object.values(escenas).filter((e) => e.zoom).map((e) => ({ id: e.id, a: e.a, b: e.b, z: e.zoom })),
};
const out = `<!doctype html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=${W}, height=${H}">
<title>Lucía · G3 v2</title>
<script src="assets/vendor/gsap.min.js"></script>
<style>
${css}
</style>
</head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-duration="${f3(DUR)}" data-width="${W}" data-height="${H}" data-fps="${FPS}">
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

// ───────────────────────── 5) plan resuelto (en segundos) para los controles de QA + tabla de cortes ─────────────────────────
const resuelto = {
  lienzo: { ...plan.lienzo, duracion: rd(DUR), cuadros: ENDF }, acento: ACC, zona_segura: Z, caras: plan.caras, empuje: plan.empuje,
  voz: { ...V, caracteres: charsTotal, tramos: tramos.map((t) => ({ ...t, a_s: rd(t.a * FR), b_s: rd(t.b * FR) })) },
  escenas, costuras, rotulo, tarjetas: tarjetas.map(({ a_f, b_f, ...x }) => ({ ...x, a_f, b_f })), etiquetas, aro, insL, marco, agenda: ag, k4: { ...kk, media_inicio: k4.media_inicio, t_clip: k4.a, t120, t_origen_fin: t120 + kk.origen.cuadros * FR },
  placa: { ...pl, sello_t }, contador: ctr, cta: plan.cta,
};
fs.writeFileSync(path.join(P, 'plan-resuelto.json'), JSON.stringify(resuelto, null, 1) + '\n');

console.log(`Voz: ${lineas.length} tramos, ${charsTotal} caracteres (con saltos; cupo ${V.max_caracteres}), ${lineas.reduce((s, l) => s + contar(l), 0)} palabras, hueco ${V.hueco_cuadros} cuadros (${(V.hueco_cuadros * FR).toFixed(3)} s). Duración ${DUR.toFixed(3)} s (${ENDF} cuadros).`);
console.log('Tramos de voz (inicio → fin, s):');
for (const t of tramos) console.log(`  T${String(t.i).padEnd(2)} ${(t.a * FR).toFixed(3).padStart(7)} → ${(t.b * FR).toFixed(3).padEnd(7)} ${String(t.palabras).padStart(2)} pal ${String(t.chars).padStart(2)} c  «${t.texto}»`);
console.log('Escenas:');
for (const e of Object.values(escenas)) console.log(`  ${e.a.toFixed(3).padStart(7)} – ${e.b.toFixed(3).padEnd(7)} ${e.id.padEnd(7)} ${e.tipo.padEnd(5)} ${e.media_inicio != null ? 'desde cuadro ' + e.media_inicio : ''}  ${e.capa}`);
console.log('Tarjetas (entra = 1 cuadro antes de a salvo en los empujes, donde viajan):');
for (const c of tarjetas) console.log(`  ${c.a.toFixed(3).padStart(7)} – ${c.b.toFixed(3).padEnd(7)} ${c.id.padEnd(3)} ${String(c.n_palabras)} pal (mín ${c.min_s} s, dura ${(c.b - c.a).toFixed(2)}) «${(c.num ? c.num + ' · ' : '') + c.texto + (c.acento ? ' ' + c.acento : '')}»${viajaEntra.has(c.id) ? ' [entra con el empuje]' : ''}${viajaSale.has(c.id) ? ' [sale con el empuje]' : ''}`);
console.log(`ok: index.html (${Math.round(out.length / 1024)} KB) y plan-resuelto.json`);
