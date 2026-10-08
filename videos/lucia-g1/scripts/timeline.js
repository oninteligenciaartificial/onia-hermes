// Timeline único (pausado, determinista). Doctrina de movimiento (motion-doctrine):
//  · LA CORRIENTE es hacia la izquierda: todo entra desde la derecha y sale por la izquierda (mismo eje, mismo sentido).
//  · entrada 0,15 s power3.out · salida 0,22 s power3.in (eases espejadas: la entrada arranca con la velocidad con que salió la anterior).
//  · cada tarjeta sale justo cuando entra la siguiente: cero solapamiento, el corte cae a mitad de movimiento.
//  · sin vaivén ocioso: cada fase está ocupada por una ruta (tarjeta→etiqueta→marco, marcas del panel, barrido de la placa, barra de cuadros).
//  · un solo sello fuerte: «5 dedos» sobre el cuadro 60 (130 % → 100 % en 3 cuadros, −5°) con golpe de zoom +3 % durante 5 cuadros.
const tl = gsap.timeline({ paused: true });
const { E_IN, E_OUT } = PLAN;
const ACC = getComputedStyle(document.documentElement).getPropertyValue('--acc').trim() || '#10C26B';
const FR = 1 / 24;
const IN_X = 80, OUT_X = -80;
const enter = (sel, a, o = {}) => tl.fromTo(sel, { x: o.x ?? IN_X, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: o.d ?? E_IN, ease: 'power3.out' }, a);
const leave = (sel, b, o = {}) => tl.to(sel, { x: o.x ?? OUT_X, autoAlpha: 0, duration: o.d ?? E_OUT, ease: 'power3.in' }, b - (o.d ?? E_OUT));

// ── rótulo de IA: ya está en pantalla en el cuadro 0 (sin entrada); sale por la izquierda a los 2,4 s
leave('#rotulo', PLAN.rotulo.b, { x: -60 });

// ── tarjetas narrativas (entrada 0,15 s, salida 0,22 s; la última se queda hasta el final)
for (const c of PLAN.tarjetas) {
  enter('#' + c.id, c.a);
  if (!c.sin_salida) leave('#' + c.id, c.b);
}

// ── etiquetas de dato (S2 y S4)
for (const d of PLAN.etiquetas) {
  if (d.id === 'eq') continue;
  enter('#' + d.id, d.a, { x: 60, d: 0.18 });
  leave('#' + d.id, d.b, { x: -60 });
}

// ── S2: «Primero la cara»: el marco se cierra sobre la cara a los 10,4 s (cae sobre la tarjeta que dice «la cara»)
tl.fromTo('#marco', { scale: 1.2, autoAlpha: 0, transformOrigin: '50% 50%' }, { scale: 1, autoAlpha: 1, duration: 0.3, ease: 'power4.out' }, PLAN.marco.a);
leave('#marco', PLAN.marco.b, { x: -60 });

// ── S3: panel «Orden real» (cita literal de 31 palabras, 11,5 s) con tres marcas sobre el mismo texto
{
  const pa = PLAN.panel.a;
  enter('#panel', pa, { d: 0.2 });
  // cascada de entrada de los bloques del panel (waterfall corto, la corriente a la izquierda)
  ['.eyebrow', '#pa', '.pb', '.leg'].forEach((s, i) => tl.fromTo('#panel ' + s, { x: 40, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.2, ease: 'power3.out' }, pa + 0.08 + i * 0.08));
  tl.set('#bd1,#bd2,#bd3', { scale: 0 }, 0); // insignias: aparecen con su marca
  tl.set('.lg', { opacity: 0.62 }, 0);
  tl.set('#bar1', { scaleY: 0 }, 0);
  const [m1, m2, m3] = PLAN.panel.marcas;
  // marca 1 «movimiento»: barra a la izquierda de la primera frase + la frase se enciende
  tl.to('#bar1', { scaleY: 1, duration: 0.35, ease: 'power3.out' }, m1.t);
  tl.to('#ph1', { color: '#F6F8FB', duration: 0.25, ease: 'none' }, m1.t);
  tl.to('#bd1', { scale: 1, duration: 0.25, ease: 'back.out(1.7)' }, m1.t + 0.05);
  tl.to('#lg1', { opacity: 1, duration: 0.2 }, m1.t);
  // marca 2 «cámara»: handheld
  tl.to('#ph2', { color: ACC, duration: 0.2, ease: 'none' }, m2.t);
  tl.to('#bd2', { scale: 1, duration: 0.25, ease: 'back.out(1.7)' }, m2.t + 0.05);
  tl.to('#lg2', { opacity: 1, duration: 0.2 }, m2.t);
  // marca 3 «luz»: natural morning light
  tl.to('#ph3', { color: ACC, duration: 0.2, ease: 'none' }, m3.t);
  tl.to('#bd3', { scale: 1, duration: 0.25, ease: 'back.out(1.7)' }, m3.t + 0.05);
  tl.to('#lg3', { opacity: 1, duration: 0.2 }, m3.t);
  leave('#panel', PLAN.part.salida_panel.b, { x: -80 });
}

// ── S3→S4: la foto de pantalla completa se encoge a la ventana de arriba (morph) y el clip sube desde abajo.
{
  const p = PLAN.part, [w0, w1] = p.ventana_fuente_y, T = p.arriba;
  tl.fromTo('#foto1', { clipPath: 'inset(0px 0px 0px 0px)', y: 0 },
    { clipPath: `inset(${w0}px 0px ${1920 - w1}px 0px)`, y: T.y - w0, duration: p.morph.b - p.morph.a, ease: 'power3.inOut' }, p.morph.a);
  tl.fromTo('#k1b', { y: 160, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: 'power4.out' }, PLAN.medios.k1b.a);
  // salida de la partida hacia la izquierda, a mitad de movimiento, justo cuando entra la placa
  tl.to('#foto1', { x: -220, opacity: 0, duration: E_OUT, ease: 'power3.in' }, PLAN.medios.foto1.b - E_OUT);
  tl.to('#k1b', { x: -220, opacity: 0, duration: E_OUT, ease: 'power3.in' }, PLAN.medios.k1b.b - E_OUT);
}

// ── S5: visor + tira de 8 cuadros de K4. La marca barre la tira; el visor corta (sin transición) al cuadro que se mira; al final foco en el 60
{
  const L = PLAN.placa, t0 = L.tiles[0];
  const n = L.tiles.length;
  tl.fromTo('#visor', { x: 200, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.3, ease: 'power4.out' }, L.entrada);
  L.tiles.forEach((t, i) => tl.fromTo('#tile' + i, { x: 160, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.28, ease: 'power4.out' }, L.entrada + 0.12 + i * 0.05));
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
  // salida a la izquierda a mitad de movimiento, al mismo tiempo que sale la tarjeta
  tl.to('#visor', { x: -200, autoAlpha: 0, duration: E_OUT, ease: 'power3.in' }, L.salida);
  L.tiles.forEach((t, i) => tl.to('#tile' + i, { x: -200, autoAlpha: 0, duration: E_OUT, ease: 'power3.in' }, L.salida + i * 0.012));
  tl.to('#scan', { x: '-=200', autoAlpha: 0, duration: E_OUT, ease: 'power3.in' }, L.salida);
}

// ── S6: K4 cuadros 0–95. La barra avanza con el clip; en el cuadro 60 (43,5 s) cae el recorte, el sello y el golpe de zoom
{
  const k = PLAN.k4, T0 = PLAN.medios.k4.a, TF = k.t_foco;
  enter('#scrub', T0 + 0.05, { d: 0.18 });
  tl.set('#sfill', { scaleX: 0 }, 0);
  tl.to('#sfill', { scaleX: 1, duration: PLAN.medios.k4.b - T0, ease: 'none' }, T0);
  leave('#scrub', PLAN.medios.k4.b, { x: -60 });
  tl.fromTo('#snotch', { scale: 1 }, { scale: 1.7, duration: 0.1, ease: 'power2.out' }, TF);
  tl.to('#snotch', { scale: 1, duration: 0.15, ease: 'power2.in' }, TF + 0.1);
  tl.fromTo('#origen', { autoAlpha: 0, scale: 1.08, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: 0.15, ease: 'power3.out' }, TF);
  tl.to('#origen', { autoAlpha: 0, duration: 0.2, ease: 'power2.in' }, TF + 0.8);
  tl.fromTo('#inset', { x: 70, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.18, ease: 'power4.out' }, TF);
  tl.fromTo('#sello', { scale: 1.3, rotation: -5, autoAlpha: 0, transformOrigin: '50% 50%' }, { scale: 1, rotation: -5, autoAlpha: 1, duration: 3 * FR, ease: 'power4.out' }, TF);
  // golpe de zoom +3 % durante 5 cuadros, en el mismo cuadro que el sello
  tl.fromTo('#k4', { scale: 1, transformOrigin: '50% 50%' }, { scale: 1.03, duration: 2 * FR, ease: 'power2.out' }, TF);
  tl.to('#k4', { scale: 1, duration: 3 * FR, ease: 'power2.inOut' }, TF + 2 * FR);
  const bK = PLAN.medios.k4.b;
  tl.to('#inset', { x: -70, autoAlpha: 0, duration: E_OUT, ease: 'power3.in' }, bK - E_OUT);
  tl.to('#sello', { x: -70, autoAlpha: 0, duration: E_OUT, ease: 'power3.in' }, bK - E_OUT);
}

// ── S7: la cuenta: 1 + 7,5 = 8,5 (cada parte entra desde la derecha, una tras otra)
{
  const d = PLAN.etiquetas.find((x) => x.id === 'eq');
  for (let i = 0; i < 5; i++) tl.fromTo('#eq' + i, { x: 50, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.28, ease: 'power4.out' }, d.a + i * 0.14);
  leave('#eq', d.b, { x: -60 });
}

window.__timelines['main'] = tl;
