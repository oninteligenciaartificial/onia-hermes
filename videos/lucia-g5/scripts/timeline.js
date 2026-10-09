// Timeline único (pausado, determinista). Doctrina de movimiento (motion-doctrine + cut-the-curve), igual que G1-G4:
//  · LA CORRIENTE es hacia la izquierda: todo entra desde la derecha y sale por la izquierda. No hay excepciones en G5.
//  · TARJETAS: entrada y salida con la misma duración (0,18 s), la misma distancia (80 px) y eases espejados (power3.out / power3.in); la
//    siguiente arranca 1 cuadro ANTES de que la anterior termine de salir (nunca más de 1 cuadro sin tarjeta). En cada empuje VIAJAN con la imagen.
//  · COSTURAS DE PANTALLA COMPLETA: empuje rígido de 6 cuadros a la izquierda; lo que sale y lo que entra comparten curva y duración y están
//    pegados borde con borde (T = el segundo del guion: desde T la escena nueva está en reposo). El medio entrante arranca en T−6 cuadros.
//  · FOTOS: empuje lento 1,00 → 1,04 en línea recta (ease none) sobre la <img> y su caja de cara, con el origen en el centro de la cara medida; el
//    contenedor (overflow:hidden) es el que viaja en el empuje rígido, así los bordes siguen pegados. Sin morph, sin vaivén.
//  · sin vaivén ocioso: cada tramo tiene un evento visual cada 1,5-3 s (tarjeta, dato, caja, lupa, escala, fila, acento). Las fotos solo llevan ese empuje.
//  · lo que ya está en la placa cuando llega (la fila de arriba de las 8 referencias, la fila de las 8 pequeñas, la escala ampliada, las miniaturas de la
//    lección) viaja con el empuje: se acabaron las entradas casi vacías.
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

// ── empuje lento sobre cada foto (dura lo que dura el contenedor, empujes incluidos); la caja de cara hace el mismo zoom con el mismo origen
for (const f of PLAN.fotos) tl.fromTo('#' + f.id + '-i', { scale: 1, transformOrigin: f.ox + 'px ' + f.oy + 'px' }, { scale: PLAN.zoom, duration: f.b - f.a, ease: 'none' }, f.a);
for (const c of PLAN.cajas) {
  const f = PLAN.fotos.find((x) => x.id === c.medio);
  tl.fromTo('#' + c.zid, { scale: 1, transformOrigin: c.ox + 'px ' + c.oy + 'px' }, { scale: PLAN.zoom, duration: f.b - f.a, ease: 'none' }, f.a);   // misma escala y mismo origen que la foto
  tl.fromTo('#' + c.id, { autoAlpha: 0, scale: 1.25, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: 0.3, ease: 'power3.out' }, c.t);
}

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

// ── datos (pastilla «parecido 0,81» sobre la tarjeta): entran y salen antes del empuje de salida
for (const m of PLAN.datos) { enter('#dA-' + m.id, m.a, { x: 60 }); leave('#dA-' + m.id, m.fin, { x: -60 }); }

// ── paso 1: la fila de abajo de las 8 referencias entra de a una; «fija.» enciende el borde de las 8
{
  const P1 = PLAN.p1;
  for (let i = 5; i <= 8; i++) enter('#rf' + i, P1.fila2 + (i - 5) * P1.esc, { x: 70, d: 0.28 });
  tl.to('#pl-p1 .ref', { borderColor: ACC, duration: 0.25, ease: 'none' }, P1.aro_t);
}

// ── paso 2: flecha de las 8 a la escala, la escala se dibuja, «idéntica · 1» se enciende, cae la marca de 0,70 con «mi piso»
{
  const E = PLAN.p2;
  tl.fromTo('#p2-flecha', { y: -30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.3, ease: 'power3.out' }, E.flecha_t);
  tl.fromTo('#sc-trk', { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, duration: E.dura, ease: 'power2.out' }, E.dibuja_t);
  tl.fromTo('#sc-ax0,#sc-ax1', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25, ease: 'none' }, E.ejes_t);
  tl.to('#sc-ax1', { color: ACC, duration: 0.2, ease: 'none' }, E.uno_t);
  tl.fromTo('#sc-zona', { autoAlpha: 0 }, { autoAlpha: 0.9, duration: 0.3, ease: 'none' }, E.marca_t);
  tl.fromTo('#sc-mk', { scaleY: 0, autoAlpha: 0, transformOrigin: '50% 100%' }, { scaleY: 1, autoAlpha: 1, duration: 0.25, ease: 'power3.out' }, E.marca_t);
  enter('#sc-mkl', E.marca_t + 0.05, { x: 40 });
}

// ── razón 1: caja de la cara (89 px), su rótulo, la línea y la lupa, la nota
{
  const R = PLAN.r1;
  tl.fromTo('#r1-box', { autoAlpha: 0, scale: 1.3, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: 0.3, ease: 'power3.out' }, R.box_t);
  enter('#r1-tag', R.tag_t, { x: 50 });
  tl.fromTo('#r1-lineas', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25, ease: 'none' }, R.lupa_t);
  enter('#r1-lupa', R.lupa_t, { x: 70, d: 0.28 });
  enter('#r1-nota', R.nota_t, { x: 60 });
}

// ── razón 2: las dos puntas del MISMO clip (0,77 y 0,80), luego la banda de ±0,03 alrededor de su promedio con su corchete
{
  const R = PLAN.r2;
  tl.fromTo('#r2-d1', { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.22, ease: 'power4.out' }, R.d1);
  tl.fromTo('#r2-v1', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2, ease: 'none' }, R.d1 + 0.1);
  tl.fromTo('#r2-d2', { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.22, ease: 'power4.out' }, R.d2);
  tl.fromTo('#r2-v2', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2, ease: 'none' }, R.d2 + 0.1);
  tl.fromTo('#r2-band', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, ease: 'none' }, R.banda);
  tl.fromTo('#r2-brk', { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.3, ease: 'power3.out' }, R.banda);
  tl.fromTo('#r2-bl', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2, ease: 'none' }, R.banda + 0.15);
}

// ── razón 3: el aro cae sobre lo difuminado, «Lo difuminé: lo inventó la IA.», el número que el programa le dio y la nota
{
  const R = PLAN.r3;
  tl.fromTo('#r3-aro', { autoAlpha: 0, scale: 1.2, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: 0.3, ease: 'power3.out' }, R.aro);
  enter('#r3-call', R.call, { x: 50 });
  enter('#r3-num', R.num, { x: 60 });
  enter('#r3-nota', R.nota, { x: 60 });
}

// ── lección: las tres razones juntas se encienden de a una (borde y nombre en verde) y una caja las rodea: «la imagen entera»
{
  const R = PLAN.lec;
  for (const f of R.filas) {
    tl.to('#le-i' + f.n, { borderColor: ACC, duration: 0.25, ease: 'none' }, f.t);
    tl.to('#le-t' + f.n, { color: ACC, duration: 0.25, ease: 'none' }, f.t);
  }
  tl.fromTo('#le-ring', { autoAlpha: 0, scale: 1.03, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'power3.out' }, R.anillo_t);
}

window.__timelines['main'] = tl;
