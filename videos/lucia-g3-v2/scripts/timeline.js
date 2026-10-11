// Timeline único (pausado, determinista). Doctrina de movimiento (motion-doctrine + cut-the-curve), igual que G1/G3:
//  · LA CORRIENTE es hacia la izquierda: todo entra desde la derecha y sale por la izquierda.
//  · TARJETAS: entrada y salida con la misma duración (0,18 s), la misma distancia (80 px) y eases espejados (power3.out / power3.in); la siguiente
//    arranca 1 cuadro ANTES de que la anterior termine de salir (nunca más de 1 cuadro sin tarjeta). La primera (el gancho) ya está en el cuadro 0.
//  · COSTURAS DE PANTALLA COMPLETA: empuje rígido de 6 cuadros a la izquierda dentro del hueco de 6 cuadros entre dos líneas de voz; lo que sale y lo
//    que entra comparten curva y duración y están pegados borde con borde. Las tarjetas VIAJAN con el empuje (−W saliente, +W entrante).
//  · SIN AIRE MUERTO (v2): un evento visual como mucho cada 2,0 s (tarjeta, acento, etiqueta, recorte, aro, marco, sello, empuje) y las fotos fijas llevan un
//    empuje lento 1,00 → 1,03 (el aro, el marco y los recuadros de origen están dentro del contenedor que hace el zoom y siguen a la foto).
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
for (const c of PLAN.empujes) empuje(c.t, c.sale, c.entra);

// ── empuje lento de las fotos fijas (1,00 → 1,03 con origen en el centro): nunca hay un cuadro idéntico al anterior
for (const z of PLAN.zooms) tl.fromTo('#z-' + z.id, { scale: 1 }, { scale: z.z, duration: z.b - z.a, ease: 'none' }, z.a);

// ── rótulo de IA: ya está en pantalla en el cuadro 0 (sin entrada); se mantiene los 3 s completos y sale por la izquierda entre 3,0 y 3,25 s
leave('#rotulo', PLAN.rotulo.b, { x: -60, d: 0.25 });

// ── tarjetas narrativas
for (const c of PLAN.tarjetas) {
  if (!c.en_empuje_entra && !c.sin_entrada) enter('#' + c.id, c.a);
  if (!c.sin_salida && !c.en_empuje_sale) leave('#' + c.id, c.b);
  // acento tardío: la segunda mitad de la frase se enciende a mitad de tarjeta (evento visual real, sin texto nuevo)
  if (c.acento_t) tl.to('#' + c.id + ' b.late', { color: ACC, duration: 0.2, ease: 'none' }, c.acento_t);
}

// ── etiquetas de dato (entran desde la derecha, salen por la izquierda)
for (const d of PLAN.etiquetas) { enter('#' + d.id, d.a, { x: 60 }); leave('#' + d.id, d.b, { x: -60 }); }

// ── gancho: aro verde sobre el letrero (1,5 s) y, 0,4 s después, el recorte ampliado (ya difuminado) con su leyenda. El aro está dentro del zoom de la foto.
{
  const A = PLAN.aro;
  tl.fromTo('#aro', { scale: 1.4, autoAlpha: 0, transformOrigin: '50% 50%' }, { scale: 1, autoAlpha: 1, duration: 0.3, ease: 'power4.out' }, A.a);
  if (PLAN.insL) { enter('#insL', PLAN.insL.a, { x: 70 }); leave('#insL', PLAN.insL.b, { x: -70 }); }
}
// ── error 1: la cara pasó el control: marco de esquinas (se cierra), sale antes del empuje
{
  const m = PLAN.marco;
  tl.fromTo('#marco', { scale: 1.2, autoAlpha: 0, transformOrigin: '50% 50%' }, { scale: 1, autoAlpha: 1, duration: 0.3, ease: 'power4.out' }, m.a);
  leave('#marco', m.b, { x: -60 });
}

// ── error 2: recortes ampliados de la agenda: recuadro verde en la foto (dentro del zoom) + recorte. Entran desde la derecha y salen por la izquierda.
for (const [n, ins] of [[1, PLAN.ag.ins1], [2, PLAN.ag.ins2]]) {
  if (!ins) continue;
  tl.fromTo('#org' + n, { scale: 1.08, autoAlpha: 0, transformOrigin: '50% 50%' }, { scale: 1, autoAlpha: 1, duration: 0.25, ease: 'power3.out' }, ins.a);
  enter('#ins' + n, ins.a + 0.1, { x: 70 });
  leave('#ins' + n, ins.b, { x: -70 });
  tl.to('#org' + n, { autoAlpha: 0, duration: 0.18, ease: 'power3.in' }, ins.b - 0.18);
}

// ── error 3: clip K4 a 1x. El contador avanza UN número por cuadro (tira de 145 números, ease steps): el cuadro n del clip cae en t_clip + (n − k0)/24.
//    En el cuadro 120 (t120) la pastilla se enciende y el recuadro «origen» marca de dónde sale el recorte de la placa, SOLO 6 cuadros (120-125);
//    después viaja con el empuje de salida hacia la placa (los cuadros 126-131 del clip pasan dentro del empuje).
{
  const k = PLAN.ctr, N = k.cuadros_clip, last = Math.round((k.b - k.t_clip) / FR) + k.k0 - 1;   // último cuadro del clip que se ve
  enter('#ctr', k.a + 0.05, { d: 0.18 });
  // steps(S) da S+1 escalones iguales: (last − k0 + 1) cuadros = steps(last − k0). Arranca 1/4 de cuadro ANTES del cuadro k0 para que cada instante
  // t_clip + j/24 caiga en el MEDIO de su escalón (justo en el borde, un error de coma flotante lo corre un número).
  tl.fromTo('#ctrstrip', { y: -k.k0 * 48 }, { y: -last * 48, duration: (last - k.k0 + 1) * FR, ease: 'steps(' + (last - k.k0) + ')' }, k.t_clip - 0.25 * FR);
  const t0 = k.t120, t1 = k.t120 + k.origen_cuadros * FR;
  tl.set('#ctr .tag', { backgroundColor: ACC, color: '#04210F' }, t0 - 0.5 * FR);
  tl.set('#ctr .tag', { backgroundColor: 'rgba(10,12,17,.80)', color: '#F6F8FB' }, t1 - 0.5 * FR);
  tl.set('#origen', { autoAlpha: 0, immediateRender: true }, 0);
  tl.set('#origen', { autoAlpha: 1 }, t0 - 0.5 * FR);
  tl.fromTo('#origen', { scale: 1.06, transformOrigin: '50% 50%' }, { scale: 1, duration: 2 * FR, ease: 'power3.out' }, t0);
  tl.set('#origen', { autoAlpha: 0 }, t1 - 0.5 * FR);
}

// ── placa de evidencia (llega con el empuje de T10 y sale con el de T11). El sello cae sobre el cuadro 120.
{
  const TS = PLAN.placa.sello_t;
  tl.set('#sello', { autoAlpha: 0, immediateRender: true }, 0);
  tl.fromTo('#sello', { scale: 1.3, rotation: -5, autoAlpha: 0, transformOrigin: '50% 50%' }, { scale: 1, rotation: -5, autoAlpha: 1, duration: 3 * FR, ease: 'power4.out' }, TS);
  tl.fromTo('#visor', { scale: 1, transformOrigin: '50% 50%' }, { scale: 1.03, duration: 2 * FR, ease: 'power2.out' }, TS);
  tl.to('#visor', { scale: 1, duration: 3 * FR, ease: 'power2.inOut' }, TS + 2 * FR);
  tl.to('#visor', { borderColor: ACC, duration: 0.2, ease: 'none' }, TS);
  // el cuadro ampliado respira: empuje lento 1,00 → 1,05 dentro del visor (overflow:hidden) durante toda la placa
  tl.fromTo('#visor img', { scale: 1, transformOrigin: '50% 50%' }, { scale: 1.05, duration: PLAN.placa.b - PLAN.placa.a, ease: 'none' }, PLAN.placa.a);
}

window.__timelines['main'] = tl;
