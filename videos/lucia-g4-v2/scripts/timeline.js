// Timeline único (pausado, determinista). Doctrina de movimiento (motion-doctrine + cut-the-curve), igual que G1-G5:
//  · LA CORRIENTE es hacia la izquierda: todo entra desde la derecha y sale por la izquierda. No hay excepciones en G4 v2.
//  · TARJETAS: entrada y salida con la misma duración (0,18 s), la misma distancia (80 px) y eases espejados (power3.out / power3.in); la
//    siguiente arranca 1 cuadro ANTES de que la anterior termine de salir. En cada empuje VIAJAN con la imagen, y con ellas el dato, el sello y la pastilla.
//  · COSTURAS DE PANTALLA COMPLETA: empuje rígido de 6 cuadros a la izquierda; lo que sale y lo que entra comparten curva y duración y están
//    pegados borde con borde (T = el segundo del guion: desde T la escena nueva está en reposo). El medio entrante arranca en T−6 cuadros.
//  · FOTOS: empuje lento 1,00 → 1,04 en línea recta (ease none) sobre la <img>, con el origen en el centro de la cara medida; el contenedor
//    (overflow:hidden) es el que viaja en el empuje rígido, así los bordes siguen pegados. Sin morph, sin vaivén. El empuje lento NO cuenta como evento.
//  · REGLA 15 (v2): ninguna pantalla se queda idéntica más de 0,3 s sin una tarjeta o un texto en lectura; un evento visual nuevo como máximo cada 2,0 s
//    (tarjeta, acento, dato, sello, fila, punto, empuje, pulso). Lo mide scripts/aire.mjs sobre el DOM, cuadro a cuadro.
//  · el sello va ROTADO −5° (130 % → 100 % en 3 cuadros) y solo cuando hay un dato medido que lo respalda.
const tl = gsap.timeline({ paused: true });
const { E_IN, E_OUT, FR, PUSH, PEASE, W, ACC } = PLAN;
const IN_X = 80, OUT_X = -80;
const enter = (sel, a, o = {}) => tl.fromTo(sel, { x: o.x ?? IN_X, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: o.d ?? E_IN, ease: 'power3.out' }, a);
const leave = (sel, b, o = {}) => tl.to(sel, { x: o.x ?? OUT_X, autoAlpha: 0, duration: o.d ?? E_OUT, ease: 'power3.in' }, b - (o.d ?? E_OUT));

// ── EMPUJE rígido (costura de pantalla completa): los que salen van de 0 a −W y los que entran de +W a 0, con la misma curva
const empuje = (T, sale, entra) => {
  const t0 = T - PUSH, S = sale.map((i) => '#' + i).join(','), E = entra.map((i) => '#' + i).join(',');
  if (S) tl.fromTo(S, { x: 0 }, { x: -W, duration: PUSH, ease: PEASE, immediateRender: false }, t0);
  if (E) tl.fromTo(E, { x: W }, { x: 0, duration: PUSH, ease: PEASE }, t0);
};
for (const c of PLAN.costuras) empuje(c.t, c.sale, c.entra);

// ── empuje lento sobre cada foto (dura lo que dura el contenedor, empujes incluidos)
for (const f of PLAN.fotos) tl.fromTo('#' + f.id + '-i', { scale: 1, transformOrigin: f.ox + 'px ' + f.oy + 'px' }, { scale: PLAN.zoom, duration: f.b - f.a, ease: 'none' }, f.a);

// ── rótulo de IA: ya está en pantalla en el cuadro 0 (sin entrada), se ve ENTERO hasta los 3,0 s y recién ahí sale por la izquierda
leave('#rotulo', PLAN.rotulo.b + E_OUT, { x: -60 });

// ── tarjetas narrativas
const FIN = PLAN.DUR - 1e-6;
for (const c of PLAN.tarjetas) {
  if (!c.en_empuje_entra) enter('#' + c.id, c.a);
  if (c.b < FIN && !c.en_empuje_sale) leave('#' + c.id, c.b);
  // acento tardío: la segunda mitad de la frase se enciende cuando la voz la dice (evento visual real, sin texto nuevo)
  if (c.acento_t) tl.to('#' + c.id + ' b.late', { color: ACC, duration: 0.2, ease: 'none' }, c.acento_t);
}

// ── gancho (2-4,75 s): las seis miniaturas (A a F) entran de a una desde la derecha y viajan con la foto en el primer empuje
{
  const G = PLAN.gancho;
  G.ids.forEach((id, i) => enter('#th-' + id, G.a + i * G.esc, { x: 60, d: 0.28 }));
}

// ── regla: la primera fila de referencias llega con la placa y la segunda entra de a una, la escala 0-1 se dibuja y la marca de 0,70 cae con «el piso» de la voz
{
  const Rg = PLAN.regla, F = Rg.refs, E = Rg.escala;
  for (let i = F.est; i < F.n; i++) enter('#rf' + (i + 1), F.a + (i - F.est) * F.esc, { x: 70, d: 0.28 });   // la primera fila ya está en la placa al llegar (sin entrada casi vacía)
  tl.fromTo('#sc-trk', { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, duration: E.d, ease: 'power2.out' }, E.a);
  tl.fromTo('#sc-ax0,#sc-ax1', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25, ease: 'none' }, E.ax_t);
  tl.to('#sc-ax1', { color: ACC, duration: 0.2, ease: 'none' }, E.uno_t);
  tl.fromTo('#sc-zona', { autoAlpha: 0 }, { autoAlpha: 0.9, duration: 0.3, ease: 'none' }, E.marca_t);
  tl.fromTo('#sc-mk', { scaleY: 0, autoAlpha: 0, transformOrigin: '50% 100%' }, { scaleY: 1, autoAlpha: 1, duration: 0.25, ease: 'power3.out' }, E.marca_t);
  enter('#sc-mkl', E.marca_t + 0.05, { x: 40 });
}

// ── Imágenes A, D y E: dato («parecido 0,81»), y donde hay respaldo una pastilla neutra (D: «justo en el piso») o un sello (E: «bajo el piso»).
//    NO se apagan: viajan con el empuje que saca su tarjeta (ver costuras), así ganan el tiempo de lectura que la escena corta no da.
for (const m of PLAN.imagenes) {
  enter('#dA-' + m.id, m.a, { x: 60 });
  if (m.pastilla) enter('#p-' + m.id, m.pastilla.t, { x: 60 });
  if (m.sello) tl.fromTo('#s-' + m.id, { scale: 1.3, rotation: -5, autoAlpha: 0, transformOrigin: '50% 50%' }, { scale: 1, rotation: -5, autoAlpha: 1, duration: 3 * FR, ease: 'power4.out' }, m.sello.t);
  // énfasis con la voz («la sostiene», «justo en el piso», «bajo el piso»): un golpe corto de escala sobre el dato, la pastilla o el sello (y el número del dato se enciende en verde si hay respaldo)
  for (const e of m.enfasis) {
    const sel = e.que === 'dato' ? '#dA-' + m.id : e.que === 'pastilla' ? '#p-' + m.id : '#s-' + m.id;
    tl.to(sel, { scale: 1.1, duration: 0.12, ease: 'power2.out' }, e.t);
    tl.to(sel, { scale: 1, duration: 0.2, ease: 'power2.in' }, e.t + 0.12);
    if (e.color) tl.to(sel + ' b', { color: ACC, duration: 0.2, ease: 'none' }, e.t);
  }
}

// ── lección: la marca de 0,70, la nota 1 y los ejes YA ESTÁN cuando llega la placa (viajan con el empuje); seis filas ordenadas por precio
//    (etiqueta + línea → punto → valor); la nota 2 entra cuando la 1 ya tuvo su tiempo de lectura; la franja de 0,66 a 0,70 dibuja lo que dice la nota 2
//    y los puntos D, E y F pulsan (están adentro de la franja: «se rozan»)
{
  const L = PLAN.l1;
  for (const f of L.filas) {
    const n = f.n, t = f.t;
    tl.fromTo('#l1-t' + n + ',#l1-r' + n, { x: 60, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.25, ease: 'power3.out' }, t);
    tl.fromTo('#l1-f' + n, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.22, ease: 'power4.out' }, t + 0.1);
    tl.fromTo('#l1-v' + n, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2, ease: 'none' }, t + 0.2);
  }
  enter('#l1-nota2', L.nota2_t, { x: 60 });
  tl.fromTo('#l1-ruido', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, ease: 'none' }, L.ruido_t);
  for (const p of L.pulsos) {
    tl.to('#l1-f' + p.n, { scale: 1.7, duration: 0.14, ease: 'power2.out' }, p.t);
    tl.to('#l1-f' + p.n, { scale: 1, duration: 0.2, ease: 'power2.in' }, p.t + 0.14);
  }
}

// ── escena 2: la foto A del café y su pie ya están en la placa al llegar; la foto B, su pie y el anillo entran después
{
  const L = PLAN.l2;
  for (const f of L.fotos) {
    if (f.t != null) enter('#l2-ph' + f.n, f.t, { x: 70, d: 0.28 });
    if (f.cap_t != null) enter('#l2-cap' + f.n, f.cap_t, { x: 40 });
  }
  tl.fromTo('#l2-ring', { autoAlpha: 0, scale: 1.05, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: 0.3, ease: 'power3.out' }, L.anillo_t);
}

// ── cierre: la raya de la tarjeta del CTA pulsa una vez al final (último evento: ningún tramo quieto de más de 0,3 s)
tl.to('#' + PLAN.cta.id + ' .rail', { scaleX: 2.4, transformOrigin: '0% 50%', duration: 0.14, ease: 'power2.out' }, PLAN.cta.pulso_t);
tl.to('#' + PLAN.cta.id + ' .rail', { scaleX: 1, duration: 0.2, ease: 'power2.in' }, PLAN.cta.pulso_t + 0.14);

window.__timelines['main'] = tl;
