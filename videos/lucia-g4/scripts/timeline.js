// Timeline único (pausado, determinista). Doctrina de movimiento (motion-doctrine + cut-the-curve), igual que G1, G2 y G3:
//  · LA CORRIENTE es hacia la izquierda: todo entra desde la derecha y sale por la izquierda. No hay excepciones en G4.
//  · TARJETAS: entrada y salida con la misma duración (0,18 s), la misma distancia (80 px) y eases espejados (power3.out / power3.in); la
//    siguiente arranca 1 cuadro ANTES de que la anterior termine de salir (nunca más de 1 cuadro sin tarjeta). En cada empuje VIAJAN con la imagen.
//  · COSTURAS DE PANTALLA COMPLETA: empuje rígido de 6 cuadros a la izquierda; lo que sale y lo que entra comparten curva y duración y están
//    pegados borde con borde (T = el segundo del guion: desde T la escena nueva está en reposo). El medio entrante arranca en T−6 cuadros.
//  · FOTOS: empuje lento 1,00 → 1,04 en línea recta (ease none) sobre la <img>, con el origen en el centro de la cara medida; el contenedor
//    (overflow:hidden) es el que viaja en el empuje rígido, así los bordes siguen pegados. Sin morph, sin vaivén.
//  · sin vaivén ocioso: cada tramo tiene un evento visual cada 1,5-3 s (tarjeta, dato, sello, acento, fila, foto). Las fotos solo llevan ese empuje.
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
  // acento tardío: la segunda mitad de la frase se enciende a mitad de tarjeta (evento visual real, sin texto nuevo)
  if (c.acento_t) tl.to('#' + c.id + ' b.late', { color: ACC, duration: 0.2, ease: 'none' }, c.acento_t);
}

// ── gancho (3-6 s): las seis miniaturas (A a F) entran de a una desde la derecha y viajan con la foto en el empuje de 6,0 s
{
  const G = PLAN.gancho;
  G.ids.forEach((id, i) => enter('#th-' + id, G.a + i * G.esc, { x: 60, d: 0.28 }));
}

// ── regla (6-12 s): las ocho referencias entran de a una, la escala 0-1 se dibuja y la marca de 0,70 cae con «Piso, 0,70.»
{
  const Rg = PLAN.regla, F = Rg.refs, E = Rg.escala;
  for (let i = 0; i < F.n; i++) enter('#rf' + (i + 1), F.a + i * F.esc, { x: 70, d: 0.28 });
  tl.fromTo('#sc-trk', { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, duration: E.d, ease: 'power2.out' }, E.a);
  tl.fromTo('#sc-ax0,#sc-ax1', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25, ease: 'none' }, E.a + 0.2);
  tl.to('#sc-ax1', { color: ACC, duration: 0.2, ease: 'none' }, E.uno_t);
  tl.fromTo('#sc-zona', { autoAlpha: 0 }, { autoAlpha: 0.9, duration: 0.3, ease: 'none' }, E.marca_t);
  tl.fromTo('#sc-mk', { scaleY: 0, autoAlpha: 0, transformOrigin: '50% 100%' }, { scaleY: 1, autoAlpha: 1, duration: 0.25, ease: 'power3.out' }, E.marca_t);
  enter('#sc-mkl', E.marca_t + 0.05, { x: 40 });
}

// ── Imágenes A-F: dato («parecido 0,81»), y donde hay respaldo una pastilla neutra (D: «justo en el piso») o un sello (E y F: «bajo el piso»)
for (const m of PLAN.imagenes) {
  enter('#dA-' + m.id, m.a, { x: 60 });
  leave('#dA-' + m.id, m.fin, { x: -60 });
  if (m.pastilla) { enter('#p-' + m.id, m.pastilla.t, { x: 60 }); leave('#p-' + m.id, m.fin, { x: -60 }); }
  if (m.sello) {
    tl.fromTo('#s-' + m.id, { scale: 1.3, rotation: -5, autoAlpha: 0, transformOrigin: '50% 50%' }, { scale: 1, rotation: -5, autoAlpha: 1, duration: 3 * FR, ease: 'power4.out' }, m.sello.t);
    leave('#s-' + m.id, m.fin, { x: -60 });
  }
}

// ── lección 1 (42-49,75 s): la marca de 0,70, la nota 1 y los ejes YA ESTÁN cuando llega la placa (viajan con el empuje); seis filas ordenadas por precio
//    (etiqueta + línea → punto → valor); la nota 2 entra cuando la 1 ya tuvo su tiempo de lectura; la franja de 0,66 a 0,70 dibuja lo que dice la nota 2
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
}

// ── lección 2 (49,5-57,25 s): cabecera y etiqueta de A ya están en la placa; las tres celdas de A, luego la etiqueta y las tres celdas de B, las dos fotos
//    del café con su pie y el anillo sobre la celda que perdió la cara
{
  const L = PLAN.l2;
  for (const f of L.filas) {
    if (f.etiqueta_t != null) enter('#l2-r' + f.n, f.etiqueta_t, { x: 60 });
    for (const c of f.celdas) enter('#' + c.id, c.t, { x: 60 });
  }
  for (const f of L.fotos) { enter('#l2-ph' + f.n, f.t, { x: 70, d: 0.28 }); enter('#l2-cap' + f.n, f.cap_t, { x: 40 }); }
  tl.fromTo('#l2-ring', { autoAlpha: 0, scale: 1.05, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: 0.3, ease: 'power3.out' }, L.anillo_t);
}

window.__timelines['main'] = tl;
