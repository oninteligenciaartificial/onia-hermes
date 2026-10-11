// Timeline único (pausado, determinista). Doctrina de movimiento (motion-doctrine + cut-the-curve), igual que G1, G3 y G2:
//  · LA CORRIENTE es hacia la izquierda: todo entra desde la derecha y sale por la izquierda. No hay excepciones.
//  · TARJETAS: entrada y salida con la misma duración (0,18 s), la misma distancia (80 px) y eases espejados (power3.out / power3.in); la
//    siguiente arranca 1 cuadro ANTES de que la anterior termine de salir (nunca más de 1 cuadro sin tarjeta). En cada empuje VIAJAN con la imagen.
//  · COSTURAS DE PANTALLA COMPLETA: empuje rígido de 6 cuadros a la izquierda; lo que sale y lo que entra comparten curva y duración y están
//    pegados borde con borde. El medio entrante arranca en T−6 cuadros (su cuadro 0 cae ahí). Cada empuje cae en un hueco de la voz (0,25 s).
//  · v2, SIN AIRE MUERTO: la foto del gancho hace un empuje lento hacia la cara (1,00 → 1,05: nunca hay dos cuadros idénticos); en las placas pasa
//    algo nuevo cada ≤ 2,0 s (referencia, escala, marca, barra, anillo, rótulo, nota, tarjeta) y los clips se muestran a 1× sin tocarlos.
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

// ── foto K1: empuje lento hacia la cara (el contenedor viaja en el empuje rígido; la <img> hace el zoom, así los bordes quedan pegados)
{
  const F = PLAN.foto;
  tl.fromTo('#foto-i', { scale: 1, transformOrigin: F.ox + 'px ' + F.oy + 'px' }, { scale: F.zoom, duration: F.b - F.a, ease: 'none' }, F.a);
}
// ── rótulo de IA: ya está en pantalla en el cuadro 0 (sin entrada); sale por la izquierda a los 3,0 s
leave('#rotulo', PLAN.rotulo.b, { x: -60 });

// ── tarjetas narrativas. La primera (c1) ya está en pantalla en el cuadro 0: la promesa va en el cuadro 0, sin entrada
for (const c of PLAN.tarjetas) {
  if (!c.sin_entrada && !c.en_empuje_entra) enter('#' + c.id, c.a);
  if (c.b < PLAN.FIN && !c.en_empuje_sale) leave('#' + c.id, c.b);
  // acento tardío: la segunda mitad de la frase se enciende a mitad de tarjeta (evento visual real, sin texto nuevo)
  if (c.acento_t) tl.to('#' + c.id + ' b.late', { color: ACC, duration: 0.2, ease: 'none' }, c.acento_t);
}

// ── gancho: las seis miniaturas entran de a una desde la derecha y viajan con la foto en el empuje de T3
{
  const G = PLAN.gancho;
  for (let i = 0; i < G.n; i++) enter('#th' + (i + 1), G.a + i * G.esc, { x: 60, d: 0.28 });
  // H2: el resultado antes de los 3 s («parecido final: 0,64 a 0,82»); viaja con la foto en el empuje de T3
  enter('#pastilla', G.pastilla_t, { x: 60 });
}

// ── regla: cinco de las ocho referencias, la escala 0-1 se dibuja y la marca de 0,70 cae con «Mi piso: 0,70.»
{
  const Rg = PLAN.regla, F = Rg.refs, E = Rg.escala;
  for (let i = 0; i < F.n; i++) enter('#rf' + (i + 1), F.a + i * F.esc, { x: 70, d: 0.28 });
  enter('#rf-l', F.etiqueta_t, { x: 60 });
  tl.fromTo('#sc-trk', { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, duration: E.d, ease: 'power2.out' }, E.a);
  tl.fromTo('#sc-ax0,#sc-ax1', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25, ease: 'none' }, E.ejes_t);
  tl.to('#sc-ax1', { color: ACC, duration: 0.2, ease: 'none' }, E.uno_t);
  tl.fromTo('#sc-zona', { autoAlpha: 0 }, { autoAlpha: 0.9, duration: 0.3, ease: 'none' }, E.marca_t);
  tl.fromTo('#sc-mk', { scaleY: 0, autoAlpha: 0, transformOrigin: '50% 100%' }, { scaleY: 1, autoAlpha: 1, duration: 0.25, ease: 'power3.out' }, E.marca_t);
}

// ── lección: tres barras (finales de los Motores 5, 1 y 3); anillo en la que sostiene la cara; el rótulo de cada barra cambia a lo que pasó con la escena
{
  const L = PLAN.leccion;
  enter('#l-tit', L.titulo_t, { x: 60 });
  enter('#l-mkl', L.marca_t + 0.05, { x: 40 });
  tl.fromTo('#l-mk', { scaleY: 0, autoAlpha: 0, transformOrigin: '50% 0%' }, { scaleY: 1, autoAlpha: 1, duration: 0.3, ease: 'power3.out' }, L.marca_t);
  tl.fromTo('#l-ax0,#l-ax1', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25, ease: 'none' }, L.marca_t + 0.05);
  for (const f of L.filas) {
    tl.fromTo('#l-t' + f.n, { x: 60, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.25, ease: 'power3.out' }, f.t);
    tl.fromTo('#l-b' + f.n, { width: 0 }, { width: f.w, duration: L.d, ease: 'power3.out' }, f.t);
    tl.fromTo('#l-v' + f.n, { autoAlpha: 0, x: -10 }, { autoAlpha: 1, x: 0, duration: 0.2, ease: 'power3.out' }, f.t + L.d - 0.05);
    if (f.ring) tl.fromTo('#l-q' + f.n, { autoAlpha: 0, scale: 1.05, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: 0.3, ease: 'power3.out' }, L.resalte_t);
    if (f.ch != null) {
      tl.to('#l-l' + f.n, { opacity: 0, duration: 0.1, ease: 'none' }, f.ch);          // el rótulo viejo se apaga y recién entonces entra el nuevo: nunca se pisan dos textos
      tl.to('#l-m' + f.n, { opacity: 1, duration: 0.1, ease: 'none' }, f.ch + 0.1);
    }
  }
  enter('#l-nota', L.nota_t, { x: 60 });
  // hallazgo 11-oct: la etiqueta «recibió 4 de las 8 fotos de puntaje» entra junto a la fila de Kling O3, justo después del anillo, y se queda hasta el empuje de salida de la placa
  if (L.fuga_t != null) enter('#l-fuga', L.fuga_t, { x: 60 });
}

// ── Motores: dato en dos pastillas («0 s: …» y «5,9 s: …» con la flecha) y, donde hay respaldo, un sello. Lo que cuelga de una tarjeta que sale en un
//    empuje VIAJA con ella (está en la lista del empuje); si la tarjeta sale sin empuje (Motor 5), sale con ella.
for (const m of PLAN.motores) {
  enter('#dA-' + m.id, m.a, { x: 60 });
  enter('#dX-' + m.id + ',#dB-' + m.id, m.b, { x: 60 });
  if (m.sale_con_tarjeta) leave('#dA-' + m.id + ',#dX-' + m.id + ',#dB-' + m.id, m.card_b, { x: -60 });
  if (m.sello) {
    tl.fromTo('#s-' + m.id, { scale: 1.3, rotation: -5, autoAlpha: 0, transformOrigin: '50% 50%' }, { scale: 1, rotation: -5, autoAlpha: 1, duration: 3 * FR, ease: 'power4.out' }, m.sello.t);
    if (m.sale_con_tarjeta) leave('#s-' + m.id, m.card_b, { x: -60 });
  }
}

window.__timelines['main'] = tl;
