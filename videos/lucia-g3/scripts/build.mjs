#!/usr/bin/env node
// Lucía · G3 «Tres errores de la IA que atrapé antes de publicar» (58 s, 1080x1920, 24 fps) — montaje con HyperFrames (2da pasada, 8-oct-2026).
// Lee plan.json (capas, tiempos, zonas) → valida las reglas de texto y de costuras → escribe index.html (DOM estático + un timeline GSAP).
// 0 créditos: solo fotos y clips ya pagados (foto descartada y buena K4·1, agenda K2·2, clip K4 338b751f, clip K1 e470ef4f).
// Método y trampas: .claude/skills/lucia/montaje-hyperframes.md (medido en G1). Plantilla: videos/lucia-g1/.
// Uso:  node scripts/build.mjs   (copia/baja el material, genera los recortes con ffmpeg si faltan, valida e imprime la tabla de cortes)
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
// entrada y salida de las tarjetas: misma duración y misma distancia (80 px), eases espejados (power3.out / power3.in)
const E_IN = 0.18, E_OUT = 0.18;
const PUSH = plan.empuje.cuadros * FR;
// apagables (agregados al guion que la madre puede revertir)
plan.etiquetas = plan.etiquetas.filter((d) => d.activo !== false);
const insB = plan.agenda.inset2.activo !== false ? plan.agenda.inset2 : null;
const ctrOn = plan.k4.contador.activo !== false;
const insL = plan.letrero.inset && plan.letrero.inset.activo !== false ? plan.letrero.inset : null;

// ───────────────────────── 0) material ─────────────────────────
const R = path.resolve(P, '../..');
const KIT = path.join(R, 'hermes-content/references/modelos/lucia/v4/kit');
const FONTS = path.join(R, 'hermes-content/brand/fonts');
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
  const g1 = path.join(R, 'videos/lucia-g1/assets/vendor/gsap.min.js');
  if (fs.existsSync(g1)) fs.copyFileSync(g1, gs); else curl('https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js', gs);
}
// La foto descartada del kit es de 720 px; la original es de 1440x2560 (0 cr: es la URL pública de la imagen ya generada, job 6708e444).
const ORIG = path.join(P, 'assets/descartada-orig.png');
if (!fs.existsSync(ORIG)) curl('https://d8j0ntlcm91z4.cloudfront.net/user_38ZdeEBSxQlcwfO6cjFGGPpE3Kz/hf_20261003_205406_6708e444-3076-40f1-b635-c8c6ae993c43.png', ORIG);

const ff = (args) => execFileSync('ffmpeg', ['-v', 'error', '-y', ...args], { stdio: 'inherit' });
const A = (n) => path.join(P, 'assets', n);
// ───────────────────────── 1) imágenes derivadas (resolución completa) ─────────────────────────
fs.mkdirSync(A('k4cuadros'), { recursive: true });
{
  // foto descartada; el letrero inventado (se parece a un logo de banco) se desenfoca con pluma: no se muestra nítido
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
// H3 (2da pasada): recorte ampliado del letrero, sacado de la foto YA difuminada (nunca de la original): el difuminado es parte de la imagen
if (plan.letrero.inset && plan.letrero.inset.activo !== false) {
  const [rx, ry, rw, rh] = plan.letrero.inset.recorte_nativo, out = A('letrero-inset.jpg');
  if (!fs.existsSync(out)) ff(['-i', A('descartada.jpg'), '-vf', `crop=${rw}:${rh}:${rx}:${ry}`, '-frames:v', '1', '-q:v', '2', '-update', '1', out]);
}
const k4 = A('k4.mp4');
{
  const [cx, cy, cw, ch] = plan.placa.recorte;
  const frames = [plan.placa.cuadro, ...plan.placa.tiles.map((t) => t.n)];
  for (const n of frames) {
    const out = A(`k4cuadros/c${n}.png`);
    if (!fs.existsSync(out)) ff(['-i', k4, '-vf', `select=eq(n\\,${n}),crop=${cw}:${ch}:${cx}:${cy}`, '-frames:v', '1', '-vsync', '0', '-update', '1', out]);
  }
}
for (const [id, rc] of [['ag-inset1', plan.agenda.origen1.recorte_nativo], ['ag-inset2', plan.agenda.origen2.recorte_nativo]]) {
  const out = A(`${id}.jpg`);
  if (!fs.existsSync(out)) ff(['-i', A('agenda.jpg'), '-vf', `crop=${rc[2]}:${rc[3]}:${rc[0]}:${rc[1]}`, '-frames:v', '1', '-q:v', '2', '-update', '1', out]);
}

// ───────────────────────── 2) reglas (se corta el build si alguna falla) ─────────────────────────
const palabras = (t) => `${t.num ? t.num + ' ' : ''}${t.texto} ${t.acento || ''}`.trim().split(/\s+/).filter((s) => s && s !== '·');
const errores = [];
const aroA = (p) => p.letrero.aro.a;
for (const c of plan.tarjetas) {
  const n = palabras(c).length, min = n * 0.35 + 0.3, dur = c.b - c.a;
  if (n > 6) errores.push(`${c.id}: ${n} palabras (máx 6)`);
  if (dur < min - 1e-9) errores.push(`${c.id}: dura ${dur.toFixed(2)} s y necesita ${min.toFixed(2)} s para ${n} palabras`);
  if (c.id === 'c1' && c.a > 0.15 + 1e-9) errores.push('c1: la primera tarjeta entra después de 0,15 s');
  if (c.bottom && c.bottom > Z.texto_hasta_y) errores.push(`${c.id}: el borde de abajo (${c.bottom}) pasa de y=${Z.texto_hasta_y}`);
  if (c.top && c.top < Z.arriba_minimo_y) errores.push(`${c.id}: el borde de arriba (${c.top}) queda sobre y=${Z.arriba_minimo_y}`);
  if (c.acento_t != null && (c.acento_t < c.a + 0.5 || c.acento_t > c.b - 0.5)) errores.push(`${c.id}: acento_t ${c.acento_t} fuera de [a+0,5, b-0,5]`);   // 2da pasada: b-0,5 (antes b-1,0) para que «tapa la otra.» caiga con la otra mano (H6)
  c.n_palabras = n; c.min_s = +min.toFixed(2);
}
for (const m of plan.medios) if (m.tipo === 'clip' && m.b - m.a > 145 / FPS + 1e-6) errores.push(`${m.id}: el clip dura 6,04 s (145 cuadros) y se pide ${(m.b - m.a).toFixed(3)}`);
// cadena de tarjetas: contiguas (b de una = a de la siguiente); la entrada arranca 1 cuadro antes salvo en los empujes (ahí viajan)
{
  const byId = Object.fromEntries(plan.tarjetas.map((c) => [c.id, c]));
  for (const cad of plan.cadenas_de_tarjetas) for (let i = 1; i < cad.length; i++) {
    if (Math.abs(byId[cad[i]].a - byId[cad[i - 1]].b) > 1e-9) errores.push(`${cad[i - 1]}→${cad[i]}: no son contiguas (${byId[cad[i - 1]].b} vs ${byId[cad[i]].a})`);
  }
}
{
  const med = Object.fromEntries(plan.medios.map((m) => [m.id, m]));
  const tj = Object.fromEntries(plan.tarjetas.map((c) => [c.id, c]));
  for (const c of plan.costuras) if (c.tipo === 'empuje') {
    for (const id of c.entra) if (med[id] && Math.abs(med[id].a - (c.t - PUSH)) > 1e-6) errores.push(`costura ${c.t}: «${id}» debe empezar en ${(c.t - PUSH).toFixed(3)} y empieza en ${med[id].a}`);
    for (const id of c.sale) if (med[id]) {
      const d = med[id].b - c.t;
      // un clip puede pasarse hasta 1 cuadro (queda fuera de pantalla: es el cuadro T, ya la imagen nueva en reposo)
      if (d < -1e-6 || d > (med[id].tipo === 'clip' ? FR : 0) + 1e-6) errores.push(`costura ${c.t}: «${id}» debe terminar en ${c.t} y termina en ${med[id].b}`);
    }
    if (c.tarjetas) {
      const s = tj[c.tarjetas.sale], e = tj[c.tarjetas.entra];
      if (!s || !e) { errores.push(`costura ${c.t}: tarjeta «${c.tarjetas.sale}» o «${c.tarjetas.entra}» no existe`); continue; }
      if (Math.abs(s.b - c.t) > 1e-6) errores.push(`costura ${c.t}: la tarjeta «${s.id}» debe terminar en ${c.t} y termina en ${s.b}`);
      if (Math.abs(e.a - c.t) > 1e-6) errores.push(`costura ${c.t}: la tarjeta «${e.id}» debe entrar en ${c.t} y entra en ${e.a}`);
    }
  }
  // K4: el cuadro N cae en inicio + N/24; el cuadro 120 = 45,0 s, el 72 = 43,0 s y el 104 = 44,333 s (lo que el guion dice)
  const k = plan.k4;
  if (Math.abs(k.t_foco - (k.inicio + k.cuadro_foco / FPS)) > 1e-6) errores.push(`k4: el cuadro ${k.cuadro_foco} cae en ${(k.inicio + k.cuadro_foco / FPS).toFixed(3)} y t_foco dice ${k.t_foco}`);
  if (Math.abs(med.k4.a - k.inicio) > 1e-6) errores.push('k4: plan.k4.inicio no coincide con el medio k4');
  if (Math.abs((med.k4.b - med.k4.a) * FPS - k.cuadros_clip) > 1e-6) errores.push(`k4: el clip debe usar los ${k.cuadros_clip} cuadros completos y usa ${(med.k4.b - med.k4.a) * FPS}`);
  if (Math.abs(k.t_foco - plan.placa.cuadro / FPS - k.inicio) > 1e-6) errores.push('la placa muestra un cuadro distinto del que se ve a t_foco');
  // K1: cuadros 0-119 (de 0 a 5 s), sin acelerar ni estirar
  if (Math.abs((med.k1.b - med.k1.a) - 5.0) > 1e-6) errores.push('k1: el cierre usa K1 de 0 a 5 s');
  // morphs: la foto buena ya está debajo antes de que la descartada se encoja; los dos morph duran 0,5 s
  const pa = plan.particion;
  if (Math.abs(med.buena.a - pa.morph_in.a) > 1e-6) errores.push('buena: debe arrancar con el morph de entrada');
  if (med.desc.b < pa.morph_out.b - 1e-6) errores.push('desc: la foto descartada debe seguir hasta que la buena la cubra (morph_out.b)');
  // etiquetas: la de cara dice 0,835 (el registro del 3-oct) y ninguna pisa el rótulo de IA
  const ec = plan.etiquetas.find((e) => e.id === 'e_cara');
  if (!ec || !ec.texto.includes('0,835')) errores.push('e_cara: el puntaje del registro es 0,835');
  if (ec && Math.abs(ec.a - 14.5) > 1e-9) errores.push('e_cara: el guion la pone desde 14,5 s');
}
// H3/H7 (2da pasada): el recorte del letrero va fuera de la barra de Instagram (y>=300) y de los botones de la derecha (x<=1000); los cuadros de la placa, dentro de y<=1490
if (insL) {
  if (insL.y < 300) errores.push(`insL: y=${insL.y} queda en la barra de Instagram (< 300)`);
  if (insL.x + insL.w > 1000) errores.push(`insL: x2=${insL.x + insL.w} pasa de 1000`);
  const aro = plan.letrero.aro;
  if (insL.a < aro.a) errores.push('insL: el recorte entra antes que el aro (su recuadro de origen)');
  if (insL.b > aro.b) errores.push('insL: el recorte sale después que el aro');
  if (insL.y + insL.h > 540) errores.push(`insL: y2=${insL.y + insL.h} baja sobre el cabello de la descartada (≈ 550)`);
}
if (aroA(plan) > 1.5 + 1e-9) errores.push(`aro: entra a ${plan.letrero.aro.a} s y el gancho pide ≤ 1,5 s (H8)`);
for (const t of plan.placa.tiles) if (t.y + t.h > Z.texto_hasta_y || t.x + t.w > 1000) errores.push(`placa: el cuadro ${t.n} se sale de la zona segura (y2=${t.y + t.h}, x2=${t.x + t.w})`);
if (errores.length) { console.error('✖ reglas:\n  ' + errores.join('\n  ')); process.exit(1); }

// ───────────────────────── 3) HTML ─────────────────────────
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const f2 = (n) => +(+n).toFixed(3);
let html = '';
let track = 10;
const nextTrack = () => track++;
const kM = plan.medios.reduce((o, m) => ((o[m.id] = m), o), {});
const FULL = 'position:absolute;left:0;top:0;width:1080px;height:1920px;object-fit:cover;';
const img = (m, z, tr) => `<img id="${m.id}" class="clip" src="${m.src}" data-start="${f2(m.a)}" data-duration="${f2(m.b - m.a)}" data-track-index="${tr}" style="${FULL}z-index:${z};" alt="">`;
const vid = (m, z) => `<video id="${m.id}" src="${m.src}" data-start="${f2(m.a)}" data-duration="${f2(m.b - m.a)}" data-track-index="0" muted playsinline preload="auto" style="${FULL}z-index:${z};"></video>`;
const FULLDIV = (id, a, b, z, inner) => `<div id="${id}" class="clip" data-start="${f2(a)}" data-duration="${f2(b - a)}" data-track-index="${nextTrack()}" style="position:absolute;left:0;top:0;width:1080px;height:1920px;z-index:${z}">${inner}</div>\n`;
html += img(kM.desc, 1, 1) + '\n';
html += img(kM.buena, 2, 2) + '\n';
html += img(kM.agenda, 1, 5) + '\n';
html += vid(kM.k4, 1) + '\n';
html += vid(kM.k1, 1) + '\n';

// rótulo de IA (cuadro 0 → 2,4 s) y etiquetas de dato
const r = plan.rotulo;
html += `<div id="cc-rotulo" class="clip cc cc-top" data-start="${f2(r.a)}" data-duration="${f2(r.b - r.a)}" data-track-index="${nextTrack()}" style="--t:${r.top}px"><div class="cw" id="rotulo"><span class="tag"><i></i>${esc(r.texto)}</span></div></div>\n`;
for (const d of plan.etiquetas) {
  html += `<div id="cc-${d.id}" class="clip cc cc-top" data-start="${f2(d.a)}" data-duration="${f2(d.b - d.a)}" data-track-index="${nextTrack()}" style="--t:${d.top}px"><div class="cw" id="${d.id}"><span class="tag tag-lg"><i></i>${esc(d.texto)}</span></div></div>\n`;
}

// aro verde sobre el letrero (S1) y marco de la cara (S2)
{
  const a = plan.letrero.aro, x = Math.round(a.centro[0] - a.ancho / 2), y = Math.round(a.centro[1] - a.alto / 2);
  html += FULLDIV('cc-aro', a.a, a.b, 9, `<div id="aro" style="left:${x}px;top:${y}px;width:${a.ancho}px;height:${a.alto}px"></div>`);
  const [x1, y1, x2, y2] = plan.marco_cara.caja, m = plan.marco_cara;
  html += FULLDIV('cc-marco', m.a, m.b, 9, `<div id="marco" style="position:absolute;left:${x1}px;top:${y1}px;width:${x2 - x1}px;height:${y2 - y1}px">` + ['tl', 'tr', 'bl', 'br'].map((k) => `<i class="cor ${k}"></i>`).join('') + `</div>`);
}

// H3: recorte ampliado del letrero (ya difuminado), arriba a la derecha bajo el aro: misma gramática que el error 2 (borde verde = lo que se amplía; el aro es su recuadro de origen)
if (insL) html += FULLDIV('cc-insL', insL.a, insL.b, 8, `<div class="ins" id="insL" style="left:${insL.x}px;top:${insL.y}px;width:${insL.w}px;height:${insL.h}px"><img src="assets/letrero-inset.jpg" alt=""></div>`);

// tarjetas narrativas (la entrada de cada una arranca 1 cuadro ANTES de que termine la anterior, salvo en los empujes: ahí viajan)
const viajaEntra = new Set(plan.costuras.filter((c) => c.tarjetas).map((c) => c.tarjetas.entra));
const viajaSale = new Set(plan.costuras.filter((c) => c.tarjetas).map((c) => c.tarjetas.sale));
const primeras = new Set(plan.cadenas_de_tarjetas.map((c) => c[0]));
for (const c of plan.tarjetas) c.entra = f2(c.a - (viajaEntra.has(c.id) ? PUSH : primeras.has(c.id) ? 0 : FR));
for (const c of plan.tarjetas) {
  const anch = c.top != null ? `cc-top" style="--t:${c.top}px` : `cc-bot" style="--b:${c.bottom}px`;
  const num = c.num ? `<span class="num">${esc(c.num)}</span>` : '';
  const acento = c.acento ? ` <b${c.acento_t ? ' class="late"' : ''}>${esc(c.acento)}</b>` : '';
  html += `<div id="cc-${c.id}" class="clip cc ${anch}" data-start="${c.entra}" data-duration="${f2(c.b - c.entra)}" data-track-index="${3 + (plan.tarjetas.indexOf(c) % 2)}">` +
    `<div class="cw" id="${c.id}"><i class="sh sh1"></i><i class="sh sh2"></i><div class="card${c.num ? ' card-num' : ''}"><div class="rail"></div>${num}<div class="t">${esc(c.texto)}${acento}</div></div></div></div>\n`;
}

// recortes ampliados de la agenda (S5): borde verde en el recorte y recuadro verde del mismo tamaño en la foto (cajas = recorte nativo × 0,75)
{
  const s = W / 1440;
  const caja = (rc) => [Math.round(rc[0] * s), Math.round(rc[1] * s), Math.round(rc[2] * s), Math.round(rc[3] * s)];
  const mk = (n, o, ins) => {
    const [x, y, w, h] = caja(o.recorte_nativo);
    o.caja = [x, y, w, h];
    html += FULLDIV(`cc-ins${n}`, ins.a, ins.b, 8,
      `<div class="org" id="org${n}" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px"></div>` +
      `<div class="ins" id="ins${n}" style="left:${ins.x}px;top:${ins.y}px;width:${ins.w}px;height:${ins.h}px"><img src="assets/ag-inset${n}.jpg" alt=""></div>`);
  };
  mk(1, plan.agenda.origen1, plan.agenda.inset1);
  if (insB) mk(2, plan.agenda.origen2, insB);
}

// K4: contador «cuadro N» (tira de 145 números que avanza de a un cuadro) y recuadro «origen» sobre el cuadro 120 (solo 6 cuadros)
{
  const k = plan.k4;
  if (ctrOn) {
    const nums = Array.from({ length: k.cuadros_clip }, (_, n) => `<em>${n}</em>`).join('');
    html += `<div id="cc-ctr" class="clip cc cc-top" data-start="${f2(k.contador.a)}" data-duration="${f2(k.contador.b - k.contador.a)}" data-track-index="${nextTrack()}" style="--t:${k.contador.top}px"><div class="cw" id="ctr"><span class="tag tag-ctr"><i></i>cuadro <span class="ctrwin"><span class="ctrstrip" id="ctrstrip" data-layout-allow-overflow>${nums}</span></span></span></div></div>\n`;
    const [rx, ry, rw, rh] = k.origen.recorte_fuente;
    k.origen_caja = [Math.round(rx * 1.5), Math.round(ry * 1.5), Math.round(rw * 1.5), Math.round(rh * 1.5)];
    html += FULLDIV('cc-k4', k.contador.a, k.contador.b, 8, `<div class="org" id="origen" style="left:${k.origen_caja[0]}px;top:${k.origen_caja[1]}px;width:${k.origen_caja[2]}px;height:${k.origen_caja[3]}px"></div>`);
  }
}

// placa de evidencia (S7): visor con el cuadro 120 ampliado, sello «5 dedos» y (agregado) los cuadros 72 y 104 que cruzan
{
  const pl = plan.placa, V = pl.visor;
  const tiles = pl.tiles.map((t, i) => `<div class="pt" id="pt${i}" style="left:${t.x}px;top:${t.y}px;width:${t.w}px;height:${t.h}px"><img src="assets/k4cuadros/c${t.n}.png" alt=""><span class="ptn">cuadro ${t.n}</span><span class="ptm">cruza</span></div>`).join('');
  html += FULLDIV('placa', kM.placa.a, kM.placa.b, 4,
    `<div id="visor" style="left:${V.x}px;top:${V.y}px;width:${V.w}px;height:${V.h}px"><img src="assets/k4cuadros/c${pl.cuadro}.png" alt=""><span class="vn">cuadro ${pl.cuadro}</span></div>` + tiles +
    `<div id="sello" style="right:${W - (V.x + V.w + 20)}px;top:${V.y + V.h - 52}px">5 dedos</div>`);
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
  W, H, FR, PUSH, PEASE: plan.empuje.ease, E_IN, E_OUT, costuras,
  tarjetas: plan.tarjetas.map(({ id, entra, b, sin_salida, acento_t }) => ({ id, a: +entra, b, sin_salida: !!sin_salida, acento_t: acento_t || null, en_empuje_entra: viajaEntra.has(id), en_empuje_sale: viajaSale.has(id) })),
  rotulo: plan.rotulo, etiquetas: plan.etiquetas, aro: plan.letrero.aro, insL, marco: plan.marco_cara,
  part: plan.particion, agenda: { ins1: plan.agenda.inset1, ins2: insB }, ctr: ctrOn ? plan.k4 : null,
  placa: plan.placa, medios: Object.fromEntries(plan.medios.map((m) => [m.id, { a: m.a, b: m.b }])),
};
const out = `<!doctype html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=${W}, height=${H}">
<title>Lucía · G3</title>
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
for (const m of plan.medios) console.log(`  ${m.a.toFixed(3).padStart(7)} – ${m.b.toFixed(3).padEnd(7)} ${m.id.padEnd(7)} ${m.tipo.padEnd(5)} ${m.cuadros ? 'cuadros ' + m.cuadros : ''}  ${m.capa}`);
console.log('Costuras:');
for (const c of plan.costuras) console.log(`  ${c.t.toFixed(2).padStart(6)}  ${c.tipo}${c.sale ? '  sale ' + c.sale.join(',') + ' → entra ' + c.entra.join(',') : ''}`);
console.log('Tarjetas (entra = 1 cuadro antes de a salvo en los empujes, donde viajan):');
for (const c of plan.tarjetas) console.log(`  ${c.a.toFixed(2).padStart(6)} – ${c.b.toFixed(2).padEnd(6)} ${c.id.padEnd(3)} ${String(c.n_palabras)} pal (mín ${c.min_s} s) «${(c.num ? c.num + ' · ' : '') + c.texto + (c.acento ? ' ' + c.acento : '')}»${viajaEntra.has(c.id) ? ' [entra con el empuje]' : ''}${viajaSale.has(c.id) ? ' [sale con el empuje]' : ''}`);
console.log('Agregados al guion (reversibles, ver plan.json):', plan.agregados_al_guion.map((a) => a.id).join(', '));
console.log(`ok: index.html (${Math.round(out.length / 1024)} KB)`);
