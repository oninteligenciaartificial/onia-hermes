// Timeline único (pausado, determinista). Doctrina de movimiento (motion-doctrine + cut-the-curve), 2da pasada del 8-oct:
//  · LA CORRIENTE es hacia la izquierda: todo entra desde la derecha y sale por la izquierda (mismo eje, mismo sentido).
//  · TARJETAS: entrada y salida con la misma duración (0,18 s), la misma distancia (80 px) y eases espejados (power3.out / power3.in):
//    la velocidad con que sale una es la velocidad con que entra la siguiente. La siguiente arranca 1 cuadro ANTES de que la anterior
//    termine de salir (nunca más de 1 cuadro sin tarjeta, H8).
//  · COSTURAS DE PANTALLA COMPLETA (H3): un EMPUJE rígido de 6 cuadros hacia la izquierda. Lo que sale y lo que entra comparten curva y
//    duración y están pegados borde con borde: la velocidad coincide en TODOS los cuadros y nunca hay un cuadro vacío ni un destello.
//    La ventana es [T-6 cuadros, T]: en T la imagen nueva ya está en reposo y su tarjeta entra en ese mismo cuadro.
//  · 3ra pasada (C4): en las costuras con `tarjetas` (35,0 y 41,0 s) la tarjeta que sale y la que entra VIAJAN con el empuje (−W y +W, misma curva y misma
//    duración): el conjunto imagen+tarjeta es una sola pieza rígida, no queda una tarjeta fija sobre la imagen que entra y nunca falta una tarjeta.
//  · sin vaivén ocioso: cada fase está ocupada por una ruta (tarjeta→etiqueta→marco→lupa, marcas del panel, barrido de la placa,
//    barra de cuadros, términos de la cuenta) — un evento visual cada 1,5-3 s.
//  · un solo sello fuerte: «5 dedos» sobre el cuadro 60 (130 % → 100 % en 3 cuadros, −5°) con golpe de zoom +3 % durante 5 cuadros.
const tl = gsap.timeline({ paused: true });
const { E_IN, E_OUT, FR, PUSH, PEASE, W } = PLAN;
const ACC = getComputedStyle(document.documentElement).getPropertyValue('--acc').trim() || '#10C26B';
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

// ── rótulo de IA: ya está en pantalla en el cuadro 0 (sin entrada); sale por la izquierda a los 2,4 s
leave('#rotulo', PLAN.rotulo.b, { x: -60 });

// ── tarjetas narrativas (la 1ª de cada cadena entra a su hora; las demás 1 cuadro antes). La última se queda hasta el final.
for (const c of PLAN.tarjetas) {
  if (!c.en_empuje_entra) enter('#' + c.id, c.a);                     // las que viajan con un empuje no hacen la entrada de 80 px
  if (!c.sin_salida && !c.en_empuje_sale) leave('#' + c.id, c.b);     // ni la salida de 80 px: se van con el empuje (x −W, misma curva)
  // acento tardío: la mitad de la frase se enciende a mitad de tarjeta (evento visual real, sin texto nuevo)
  if (c.acento_t) tl.to('#' + c.id + ' b.late', { color: ACC, duration: 0.2, ease: 'none' }, c.acento_t);
}

// ── etiquetas de dato (S2 y S4). d2/d3 (S4) salen dentro del empuje de las 35,0 s; d1 sale con su tarjeta.
for (const d of PLAN.etiquetas) {
  if (d.id === 'eq') continue;
  enter('#' + d.id, d.a, { x: 60 });
  if (d.id === 'd1') leave('#' + d.id, d.b, { x: -60 });
}

// ── S2: «Primero la cara»: el marco se cierra sobre la cara a los 10,4 s y 2 s después sale de él la lupa
tl.fromTo('#marco', { scale: 1.2, autoAlpha: 0, transformOrigin: '50% 50%' }, { scale: 1, autoAlpha: 1, duration: 0.3, ease: 'power4.out' }, PLAN.marco.a);
leave('#marco', PLAN.marco.b, { x: -60 });
if (PLAN.lupa) {
  const L = PLAN.lupa;
  // la lupa nace en el borde del marco (portador) y se abre hacia la derecha. C2 (3ra pasada): su borde se queda NEUTRO. Antes se «confirmaba» en verde a
  // 14,2 s, a la vez que «siempre igual.» se enciende, y eso sugería una verificación que el video no hace. El acento verde sigue SOLO en el texto.
  tl.fromTo('#lupa', { x: -70, scale: 0.6, autoAlpha: 0, transformOrigin: '0% 50%' }, { x: 0, scale: 1, autoAlpha: 1, duration: 0.32, ease: 'power4.out' }, L.a);
  leave('#lupa', L.b, { x: -80 });
}

// ── S3: panel «Orden real» (cita literal de 31 palabras) con tres marcas sobre el mismo texto: SOLO color + subrayado (H5)
{
  const pa = PLAN.panel.a;
  enter('#panel', pa, { d: 0.2 });
  // cascada de entrada de los bloques del panel (waterfall corto, la corriente a la izquierda)
  ['.eyebrow', '#pq', '.leg'].forEach((s, i) => tl.fromTo('#panel ' + s, { x: 40, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.2, ease: 'power3.out' }, pa + 0.08 + i * 0.08));
  tl.set('.lg', { opacity: 0.62 }, 0);
  const subr = (id, t, color) => {
    tl.to(id, { color, duration: 0.25, ease: 'none' }, t);
    tl.fromTo(id, { backgroundSize: '0% 4px' }, { backgroundSize: '100% 4px', duration: 0.55, ease: 'power2.out' }, t);
  };
  const [m1, m2, m3] = PLAN.panel.marcas;
  subr('#ph1', m1.t, '#F6F8FB');   // movimiento: la primera frase
  subr('#ph2', m2.t, ACC);         // cámara: handheld
  subr('#ph3', m3.t, ACC);         // luz: natural morning light
  [m1, m2, m3].forEach((m, i) => tl.to('#lg' + (i + 1), { opacity: 1, duration: 0.2 }, m.t));   // el chip con su número se enciende en el mismo cuadro
  leave('#panel', PLAN.part.salida_panel.b, { x: -80, d: 0.22 });
}

// ── S3→S4: la foto de pantalla completa se encoge a la ventana de arriba (morph) y, EN LA MISMA CURVA, el clip sube desde el borde de abajo del lienzo.
//    C5 (3ra pasada): antes el clip entraba a 31,0 s (fundido de 0,35 s) y entre 30,5 y 31,04 s el lienzo quedaba oscuro y vacío. Ahora la ventana
//    del clip va siempre POR DEBAJO del borde de la foto que se retira (borde de la foto 1920 − 1130·p; borde de arriba del clip 1920 − 940·p: nunca se pisan),
//    sin fundido: lo que sale de la foto lo ocupa el clip. La tarjeta ③ entra a 30,75 s en el hueco entre las dos.
//    La salida de la partida no es un apagado: es parte del empuje de las 35,0 s.
{
  const p = PLAN.part, [w0, w1] = p.ventana_fuente_y, T = p.arriba, B = p.abajo;
  tl.fromTo('#foto1', { clipPath: 'inset(0px 0px 0px 0px)', y: 0 },
    { clipPath: `inset(${w0}px 0px ${1920 - w1}px 0px)`, y: T.y - w0, duration: p.morph.b - p.morph.a, ease: 'power3.inOut' }, p.morph.a);
  tl.fromTo('#k1b', { y: 1920 - B.y }, { y: 0, duration: p.morph.b - p.morph.a, ease: 'power3.inOut' }, p.morph.a);
}

// ── S5: visor + tira de 8 cuadros de K4. Llegan en bloque con el empuje de las 34,75 s; la marca barre la tira; el visor corta
//    (sin transición) al cuadro que se mira; al final foco en el 60. Sale en bloque con el empuje de las 40,75 s.
{
  const L = PLAN.placa, t0 = L.tiles[0];
  const n = L.tiles.length;
  tl.fromTo('#scan', { x: 120, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.18, ease: 'power3.out' }, L.barrido - 0.18);
  L.tiles.forEach((t, i) => {
    const T = L.barrido + i * L.paso;
    if (i > 0) tl.to('#scan', { x: t.x - t0.x, duration: 0.12, ease: 'power2.inOut' }, T - 0.12);
    tl.to('#vf' + i, { opacity: 1, duration: 0.001 }, i === 0 ? L.entrada : T);            // el visor muestra este cuadro (el primero ya al entrar)
    if (i < n - 1) tl.to('#vf' + i, { opacity: 0, duration: 0.001 }, T + L.paso);          // y lo suelta cuando entra el siguiente
  });
  // foco: el visor vuelve al 60 (el que entra en el tramo de 0 a 96), la marca lo sigue y el resto se apaga
  const t60 = L.tiles.findIndex((t) => t.n === 60);
  tl.to('#vf' + (n - 1), { opacity: 0, duration: 0.001 }, L.foco);
  tl.to('#vf' + t60, { opacity: 1, duration: 0.001 }, L.foco);
  tl.to('#visor', { borderColor: ACC, duration: 0.2, ease: 'none' }, L.foco);
  L.tiles.forEach((t, i) => { if (i !== t60) tl.to('#tile' + i, { opacity: t.ok ? 0.5 : 0.28, duration: 0.25, ease: 'power2.out' }, L.foco); });
  tl.to('#scan', { x: L.tiles[t60].x - t0.x, duration: 0.3, ease: 'power3.inOut' }, L.foco);
}

// ── S6: K4 (cuadros 0–101; los 0–5 pasan dentro del empuje de entrada). La barra avanza con el clip; en el cuadro 60 (43,25 s)
//    cae el recorte, el sello y el golpe de zoom. Todo el grupo (clip + barra + recorte + sello) sale en bloque con el empuje de las 45,0 s.
{
  const k = PLAN.k4, T0 = PLAN.medios.k4.a, TF = k.t_foco, REST = T0 + PUSH;
  enter('#scrub', REST + 0.05, { d: 0.18 });
  tl.set('#sfill', { scaleX: 0 }, 0);
  tl.to('#sfill', { scaleX: 1, duration: PLAN.medios.k4.b - T0, ease: 'none' }, T0);
  tl.fromTo('#snotch', { scale: 1 }, { scale: 1.7, duration: 0.1, ease: 'power2.out' }, TF);
  tl.to('#snotch', { scale: 1, duration: 0.15, ease: 'power2.in' }, TF + 0.1);
  // C1 (3ra pasada): el recuadro «origen» marca de dónde sale el recorte, y esa mano en vivo solo coincide con el recorte mientras el clip muestra el cuadro 60.
  //  Antes seguía hasta 44,1 s (f1056), cuando el clip ya muestra el dedo de la otra mano cruzando (K4 cuadros 66-78 = f1044-f1056). Ahora está a la vista
  //  SOLO en f1038-f1041 (K4 cuadros 60-63) y desaparece en f1042. Los cortes caen a medio cuadro (±0,5 cuadro) para que no dependan del redondeo del instante.
  tl.set('#origen', { autoAlpha: 0, immediateRender: true }, 0);
  tl.set('#origen', { autoAlpha: 1 }, TF - 0.5 * FR);
  tl.fromTo('#origen', { scale: 1.08, transformOrigin: '50% 50%' }, { scale: 1, duration: 2 * FR, ease: 'power3.out' }, TF);
  tl.set('#origen', { autoAlpha: 0 }, TF + 3.5 * FR);
  tl.fromTo('#inset', { x: 70, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.18, ease: 'power4.out' }, TF);
  tl.fromTo('#sello', { scale: 1.3, rotation: -5, autoAlpha: 0, transformOrigin: '50% 50%' }, { scale: 1, rotation: -5, autoAlpha: 1, duration: 3 * FR, ease: 'power4.out' }, TF);
  // golpe de zoom +3 % durante 5 cuadros, en el mismo cuadro que el sello
  tl.fromTo('#k4', { scale: 1, transformOrigin: '50% 50%' }, { scale: 1.03, duration: 2 * FR, ease: 'power2.out' }, TF);
  tl.to('#k4', { scale: 1, duration: 3 * FR, ease: 'power2.inOut' }, TF + 2 * FR);
}

// ── S7: la cuenta 1 + 7,5 = 8,5: cada término entra de a uno (H4: llena el tramo 46,7–49,8 s con eventos reales). El resultado va en verde.
{
  const d = PLAN.etiquetas.find((x) => x.id === 'eq');
  if (d) {
    d.terminos_t.forEach((t, i) => tl.fromTo('#eq' + i, { x: 50, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.28, ease: 'power4.out' }, t));
    leave('#eq', d.b, { x: -60 });
  }
}

window.__timelines['main'] = tl;
