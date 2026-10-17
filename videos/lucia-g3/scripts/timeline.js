// Timeline único (pausado, determinista). Doctrina de movimiento (motion-doctrine + cut-the-curve), igual que G1:
//  · LA CORRIENTE es hacia la izquierda: todo entra desde la derecha y sale por la izquierda. Excepción con causa: la foto buena SUBE sobre la
//    descartada (arriba = una conclusión que se eleva sobre lo anterior), una sola vez y a 23 s.
//  · TARJETAS: entrada y salida con la misma duración (0,18 s), la misma distancia (80 px) y eases espejados (power3.out / power3.in); la
//    siguiente arranca 1 cuadro ANTES de que la anterior termine de salir (nunca más de 1 cuadro sin tarjeta).
//  · COSTURAS DE PANTALLA COMPLETA: empuje rígido de 6 cuadros a la izquierda; lo que sale y lo que entra comparten curva y duración y están
//    pegados borde con borde. Las tarjetas VIAJAN con el empuje (−W saliente, +W entrante). El clip entrante arranca en T−6 cuadros.
//  · sin vaivén ocioso: cada fase tiene un evento visual cada 1,5-3 s (tarjeta, acento de texto, etiqueta, recorte, contador, sello).
//  · un solo sello fuerte: «5 dedos» sobre el cuadro 120 en la placa (130 % → 100 % en 3 cuadros, −5°) con golpe de zoom +3 % durante 5 cuadros.
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

// ── tarjetas narrativas
for (const c of PLAN.tarjetas) {
  if (!c.en_empuje_entra) enter('#' + c.id, c.a);
  if (!c.sin_salida && !c.en_empuje_sale) leave('#' + c.id, c.b);
  // acento tardío: la segunda mitad de la frase se enciende a mitad de tarjeta (evento visual real, sin texto nuevo)
  if (c.acento_t) tl.to('#' + c.id + ' b.late', { color: ACC, duration: 0.2, ease: 'none' }, c.acento_t);
}

// ── etiquetas de dato (entran desde la derecha, salen por la izquierda)
for (const d of PLAN.etiquetas) { enter('#' + d.id, d.a, { x: 60 }); leave('#' + d.id, d.b, { x: -60 }); }

// ── S1: aro verde sobre el letrero (4 s). Es el portador del morph: acompaña a la foto a la ventana de arriba (misma curva) y se va antes de 23 s.
{
  const A = PLAN.aro, P = PLAN.part, T = P.arriba, M = P.morph_in;
  tl.fromTo('#aro', { scale: 1.4, autoAlpha: 0, transformOrigin: '50% 50%' }, { scale: 1, autoAlpha: 1, duration: 0.3, ease: 'power4.out' }, A.a);
  tl.to('#aro', { y: T.y - T.fuente_y[0], duration: M.b - M.a, ease: 'power3.inOut' }, M.a);
  leave('#aro', A.b, { x: -60 });
}
// ── S1 (H3): recorte ampliado del letrero (ya difuminado) bajo el aro: entra desde la derecha 0,1 s después y sale por la izquierda (misma gramática que S5)
if (PLAN.insL) { enter('#insL', PLAN.insL.a, { x: 70 }); leave('#insL', PLAN.insL.b, { x: -70 }); }
// ── S2: la cara pasó el control: marco de esquinas a 14,6 s (se cierra), sale antes del morph
{
  const m = PLAN.marco;
  tl.fromTo('#marco', { scale: 1.2, autoAlpha: 0, transformOrigin: '50% 50%' }, { scale: 1, autoAlpha: 1, duration: 0.3, ease: 'power4.out' }, m.a);
  leave('#marco', m.b, { x: -60 });
}

// ── S3 y S4: MORPH 1 (19,0-19,5): la descartada se encoge a la ventana de arriba y, EN LA MISMA CURVA, la buena sube desde el borde de abajo
//    (borde de la descartada 1920 − 1180·p; borde de arriba de la buena 1920 − 910·p: nunca se pisan; entre las dos queda el hueco de la tarjeta).
//    MORPH 2 (23,0-23,5): la buena sube de su ventana a pantalla completa y cubre a la descartada (sin fundido).
{
  const P = PLAN.part, T = P.arriba, B = P.abajo, [w0, w1] = T.fuente_y, [b0, b1] = B.fuente_y;
  const dur = P.morph_in.b - P.morph_in.a;
  const insetT = `inset(${w0}px 0px ${1920 - w1}px 0px)`, insetB = `inset(${b0}px 0px ${1920 - b1}px 0px)`, FULLI = 'inset(0px 0px 0px 0px)';
  tl.fromTo('#desc', { clipPath: FULLI, y: 0 }, { clipPath: insetT, y: T.y - w0, duration: dur, ease: 'power3.inOut' }, P.morph_in.a);
  tl.set('#buena', { clipPath: insetB, immediateRender: true }, 0);
  tl.fromTo('#buena', { y: 1920 - b0 }, { y: B.y - b0, duration: dur, ease: 'power3.inOut' }, P.morph_in.a);
  tl.fromTo('#buena', { clipPath: insetB, y: B.y - b0 }, { clipPath: FULLI, y: 0, duration: P.morph_out.b - P.morph_out.a, ease: 'power3.inOut', immediateRender: false }, P.morph_out.a);
}

// ── S5: recortes ampliados de la agenda: recuadro verde en la foto + recorte. Entran desde la derecha y salen por la izquierda.
for (const [n, ins] of [[1, PLAN.agenda.ins1], [2, PLAN.agenda.ins2]]) {
  if (!ins) continue;
  tl.fromTo('#org' + n, { scale: 1.08, autoAlpha: 0, transformOrigin: '50% 50%' }, { scale: 1, autoAlpha: 1, duration: 0.25, ease: 'power3.out' }, ins.a);
  enter('#ins' + n, ins.a + 0.1, { x: 70 });
  leave('#ins' + n, ins.b, { x: -70 });
  tl.to('#org' + n, { autoAlpha: 0, duration: 0.18, ease: 'power3.in' }, ins.b - 0.18);
}

// ── S6: clip K4 completo. El contador avanza UN número por cuadro (tira de 145 números, ease steps): cuadro n = inicio + n/24.
//    En el cuadro 120 (45,0 s) la pastilla se enciende y el recuadro «origen» marca de dónde sale el recorte de la placa, SOLO 6 cuadros (120-125):
//    en 128 ya se juntan las manos y el recuadro no tendría nada que marcar (lección C1 de G1).
if (PLAN.ctr) {
  const k = PLAN.ctr, T0 = k.inicio, TF = k.t_foco;
  enter('#ctr', k.contador.a + 0.05, { d: 0.18 });
  // steps(N) da N+1 escalones iguales: 145 escalones de 1 cuadro = steps(144). Arranca 1/4 de cuadro ANTES de T0 para que cada instante n/24 caiga
  // en el medio de su escalón (justo en el borde, un error de coma flotante lo corre un número).
  tl.fromTo('#ctrstrip', { y: 0 }, { y: -(k.cuadros_clip - 1) * 48, duration: k.cuadros_clip * FR, ease: 'steps(' + (k.cuadros_clip - 1) + ')' }, T0 - 0.25 * FR);
  tl.set('#ctr .tag', { backgroundColor: ACC, color: '#04210F' }, TF - 0.5 * FR);
  tl.set('#ctr .tag', { backgroundColor: 'rgba(10,12,17,.80)', color: '#F6F8FB' }, TF + k.origen.cuadros * FR - 0.5 * FR);
  tl.set('#origen', { autoAlpha: 0, immediateRender: true }, 0);
  tl.set('#origen', { autoAlpha: 1 }, TF - 0.5 * FR);
  tl.fromTo('#origen', { scale: 1.06, transformOrigin: '50% 50%' }, { scale: 1, duration: 2 * FR, ease: 'power3.out' }, TF);
  tl.set('#origen', { autoAlpha: 0 }, TF + k.origen.cuadros * FR - 0.5 * FR);
  // el contador se va justo después del destello: la tarjeta «Cuadro 120: cinco dedos.» sigue en pantalla hasta la placa y un contador en 129 la contradiría
  leave('#ctr', TF + k.origen.cuadros * FR + 0.25, { x: -60 });
}

// ── S7: placa de evidencia (llega con el empuje de 45,75 s y sale con el de 53,0 s). El sello cae sobre el cuadro 120; los cuadros 72 y 104 entran de a uno.
{
  const L = PLAN.placa, TS = L.sello_t;
  tl.set('#sello', { autoAlpha: 0, immediateRender: true }, 0);
  tl.fromTo('#sello', { scale: 1.3, rotation: -5, autoAlpha: 0, transformOrigin: '50% 50%' }, { scale: 1, rotation: -5, autoAlpha: 1, duration: 3 * FR, ease: 'power4.out' }, TS);
  tl.fromTo('#visor', { scale: 1, transformOrigin: '50% 50%' }, { scale: 1.03, duration: 2 * FR, ease: 'power2.out' }, TS);
  tl.to('#visor', { scale: 1, duration: 3 * FR, ease: 'power2.inOut' }, TS + 2 * FR);
  tl.to('#visor', { borderColor: ACC, duration: 0.2, ease: 'none' }, TS);
  L.tiles.forEach((t, i) => tl.fromTo('#pt' + i, { x: 70, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.28, ease: 'power4.out' }, t.t));
}

window.__timelines['main'] = tl;
