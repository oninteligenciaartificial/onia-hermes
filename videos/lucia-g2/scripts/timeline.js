// Timeline único (pausado, determinista). Doctrina de movimiento (motion-doctrine + cut-the-curve), igual que G1 y G3:
//  · LA CORRIENTE es hacia la izquierda: todo entra desde la derecha y sale por la izquierda. No hay excepciones en G2.
//  · TARJETAS: entrada y salida con la misma duración (0,18 s), la misma distancia (80 px) y eases espejados (power3.out / power3.in); la
//    siguiente arranca 1 cuadro ANTES de que la anterior termine de salir (nunca más de 1 cuadro sin tarjeta). En cada empuje VIAJAN con la imagen.
//  · COSTURAS DE PANTALLA COMPLETA: empuje rígido de 6 cuadros a la izquierda; lo que sale y lo que entra comparten curva y duración y están
//    pegados borde con borde. El medio entrante arranca en T−6 cuadros (su cuadro 0 cae ahí).
//  · sin vaivén ocioso: cada tramo tiene un evento visual cada 1,5-3 s (tarjeta, dato, sello, barra, punto, aro). Los clips no se tocan:
//    ni zoom, ni velocidad, ni congelado.
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

// ── rótulo de IA: ya está en pantalla en el cuadro 0 (sin entrada); sale por la izquierda a los 2,4 s
leave('#rotulo', PLAN.rotulo.b, { x: -60 });

// ── tarjetas narrativas
const FIN = 58 - 1e-6;
for (const c of PLAN.tarjetas) {
  if (!c.en_empuje_entra) enter('#' + c.id, c.a);
  if (c.b < FIN && !c.en_empuje_sale) leave('#' + c.id, c.b);
  // acento tardío: la segunda mitad de la frase se enciende a mitad de tarjeta (evento visual real, sin texto nuevo)
  if (c.acento_t) tl.to('#' + c.id + ' b.late', { color: ACC, duration: 0.2, ease: 'none' }, c.acento_t);
}

// ── gancho (3-6 s): las seis miniaturas entran de a una desde la derecha y viajan con la foto en el empuje de 6,0 s
{
  const G = PLAN.gancho;
  for (let i = 0; i < G.n; i++) enter('#th' + (i + 1), G.a + i * G.esc, { x: 60, d: 0.28 });
}

// ── regla (6-12 s): cinco de las ocho referencias, la escala 0-1 se dibuja y la marca de 0,70 cae con «Piso, 0,70.»
{
  const Rg = PLAN.regla, F = Rg.refs, E = Rg.escala;
  for (let i = 0; i < F.n; i++) enter('#rf' + (i + 1), F.a + i * F.esc, { x: 70, d: 0.28 });
  enter('#rf-l', F.etiqueta_t, { x: 60 });
  tl.fromTo('#sc-trk', { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, duration: E.d, ease: 'power2.out' }, E.a);
  tl.fromTo('#sc-ax0,#sc-ax1', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25, ease: 'none' }, E.a + 0.2);
  tl.to('#sc-ax1', { color: ACC, duration: 0.2, ease: 'none' }, E.uno_t);
  tl.fromTo('#sc-zona', { autoAlpha: 0 }, { autoAlpha: 0.9, duration: 0.3, ease: 'none' }, E.marca_t);
  tl.fromTo('#sc-mk', { scaleY: 0, autoAlpha: 0, transformOrigin: '50% 100%' }, { scaleY: 1, autoAlpha: 1, duration: 0.25, ease: 'power3.out' }, E.marca_t);
  enter('#sc-mkl', E.marca_t + 0.05, { x: 40 });
}

// ── lección 1 (27-32 s): tres filas; el punto del final sale del arranque y baja; la marca de 0,70 cruza las tres
{
  const L = PLAN.l1;
  tl.fromTo('#l1-mk', { scaleY: 0, autoAlpha: 0, transformOrigin: '50% 0%' }, { scaleY: 1, autoAlpha: 1, duration: 0.3, ease: 'power3.out' }, L.marca_t);
  enter('#l1-mkl', L.marca_t + 0.05, { x: 40 });
  enter('#l1-leg', L.leyenda_t, { x: 60 });
  enter('#l1-nota', L.leyenda_t + 0.15, { x: 60 });                  // H5: «Final: cierre del clip, que no se ve entero.»
  tl.fromTo('#l1-ax0,#l1-ax1', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25, ease: 'none' }, L.leyenda_t);
  for (const f of L.filas) {
    const n = f.n, t = f.t, tm = t + 0.5;
    tl.fromTo('#l1-t' + n + ',#l1-r' + n, { x: 60, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.25, ease: 'power3.out' }, t);
    tl.fromTo('#l1-s' + n, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.22, ease: 'power4.out' }, t + 0.1);
    tl.fromTo('#l1-vs' + n, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2, ease: 'none' }, t + 0.15);
    tl.fromTo('#l1-f' + n, { x: f.dx, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: L.mueve_d, ease: 'power2.inOut' }, tm);
    tl.fromTo('#l1-g' + n, { scaleX: 0, transformOrigin: f.dx > 0 ? '100% 50%' : '0% 50%' }, { scaleX: 1, duration: L.mueve_d, ease: 'power2.inOut' }, tm);
    tl.fromTo('#l1-vf' + n, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2, ease: 'none' }, tm + L.mueve_d);
  }
}

// ── lección 2 (47-54,75 s): seis barras ordenadas por el final; resalte de las dos con referencias; cambio de rótulo a lo que inventaron; nota
{
  const L = PLAN.l2;
  enter('#l2-mkl', L.marca_t, { x: 40 });
  tl.fromTo('#l2-mk', { scaleY: 0, autoAlpha: 0, transformOrigin: '50% 0%' }, { scaleY: 1, autoAlpha: 1, duration: 0.3, ease: 'power3.out' }, L.marca_t);
  tl.fromTo('#l2-ax0,#l2-ax1', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25, ease: 'none' }, L.marca_t);
  for (const f of L.filas) {
    tl.fromTo('#l2-b' + f.n, { width: 0 }, { width: f.w, duration: L.d, ease: 'power3.out' }, f.t);
    tl.fromTo('#l2-v' + f.n, { autoAlpha: 0, x: -10 }, { autoAlpha: 1, x: 0, duration: 0.2, ease: 'power3.out' }, f.t + L.d - 0.05);
    if (f.ring) tl.fromTo('#l2-q' + f.n, { autoAlpha: 0, scale: 1.05, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: 0.3, ease: 'power3.out' }, L.resalte_t);
    if (f.ch != null) {
      tl.to('#l2-l' + f.n, { opacity: 0, duration: 0.1, ease: 'none' }, f.ch);          // el rótulo viejo se apaga y recién entonces entra el nuevo: nunca se pisan dos textos
      tl.to('#l2-m' + f.n, { opacity: 1, duration: 0.1, ease: 'none' }, f.ch + 0.1);
    }
  }
  enter('#l2-nota', L.nota_t, { x: 60 });
}

// ── placa del Motor 6 (44,25-47,25 s; reposo 44,5-47,0). H1: las dos cifras por segundo (#q-p6, #q-p1) están ESTÁTICAS desde que llega la placa
//    (6 palabras cada una = 2,4 s de lectura; en reposo hay 2,5 s), igual que el número «0,77» y su pie («cierre del clip (3,9 s)»: 6 palabras); la escala, el punto 0,77 y el sello «4×» entran después.
{
  const Q = PLAN.m6plate, TS = Q.sello_t;
  tl.fromTo('#q-trk', { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, duration: 0.35, ease: 'power2.out' }, Q.escala_t);
  tl.fromTo('#q-mk', { scaleY: 0, autoAlpha: 0, transformOrigin: '50% 100%' }, { scaleY: 1, autoAlpha: 1, duration: 0.25, ease: 'power3.out' }, Q.escala_t + 0.05);
  enter('#q-mkl', Q.escala_t + 0.05, { x: 40 });
  tl.fromTo('#q-ax0,#q-ax1', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25, ease: 'none' }, Q.escala_t + 0.1);
  tl.fromTo('#q-dot', { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.25, ease: 'power4.out' }, Q.punto_t);
  tl.fromTo('#q-sello', { scale: 1.3, rotation: -5, autoAlpha: 0, transformOrigin: '50% 50%' }, { scale: 1, rotation: -5, autoAlpha: 1, duration: 3 * FR, ease: 'power4.out' }, TS);
}

// ── Motores 1-6: dato en dos pastillas («0 s: …» y «5,9 s: …»; la segunda llega después, con la flecha) y, donde hay respaldo, un sello
for (const m of PLAN.motores) {
  enter('#dA-' + m.id, m.a, { x: 60 });
  if (!m.sin_b) enter('#dX-' + m.id + ',#dB-' + m.id, m.b, { x: 60 });
  leave(m.sin_b ? '#dA-' + m.id : '#dA-' + m.id + ',#dX-' + m.id + ',#dB-' + m.id, m.fin, { x: -60 });
  if (m.pastilla) { enter('#p-' + m.id, m.pastilla.t, { x: 60 }); leave('#p-' + m.id, m.fin, { x: -60 }); }   // H6: «Este clip: 1080p, los otros 720p»
  if (m.sello) {
    if (m.sello.tipo === 'dato') enter('#s-' + m.id, m.sello.t, { x: 60 });
    else tl.fromTo('#s-' + m.id, { scale: 1.3, rotation: -5, autoAlpha: 0, transformOrigin: '50% 50%' }, { scale: 1, rotation: -5, autoAlpha: 1, duration: 3 * FR, ease: 'power4.out' }, m.sello.t);
    leave('#s-' + m.id, m.fin, { x: -60 });
  }
}

// ── Motor 4: aro verde sobre el letrero inventado; sigue al letrero por cuatro puntos medidos (movimiento lineal, sin vaivén)
{
  const A = PLAN.aro, p0 = A.puntos[0];
  tl.fromTo('#aro', { scale: 1.4, autoAlpha: 0, transformOrigin: '50% 50%' }, { scale: 1, autoAlpha: 1, duration: 0.3, ease: 'power4.out' }, A.a);
  for (let i = 1; i < A.puntos.length; i++) {
    const p = A.puntos[i], q = A.puntos[i - 1];
    tl.to('#aro', { x: p.cx - p0.cx, y: p.cy - p0.cy, duration: p.t - q.t, ease: 'none' }, q.t);
  }
  leave('#aro', A.b, { x: -60 });
}

window.__timelines['main'] = tl;
