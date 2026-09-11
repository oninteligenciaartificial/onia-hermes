#!/usr/bin/env node
/**
 * Casos PUROS de pedido_deploy_entregado.mjs. No tocan git, ni el tablero, ni produccion:
 * por eso pueden vivir en la cadena `npm test` que el integrador corre antes de mergear.
 * La medicion VIVA va aparte (`npm run pedido:entregado`), porque necesita el repo hermano
 * y produccion, y un gate que exige eso pone rojo por AMBIENTE y traba a los quince carriles.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { archivosDelDryRun, archivosNombrados, secoDeProduccion, barrerPedidos, buildQueCorre, clasificarPedido, cuerpoCortoArchivos, shasDelTexto, shasPrometidos, soloLosQueViajan } from './pedido_deploy_entregado.mjs';

// El caso que me costo la vuelta del 2026-09-06: los 13 shas prometidos por t_0268567b
// estaban TODOS dentro del build vivo y el pedido seguia blocked pidiendo un ok por
// trabajo hecho.
test('todo lo prometido ya esta en el build vivo -> ENTREGADO', () => {
  const r = clasificarPedido({
    id: 't_0268567b',
    shas: ['8b420b6', '38bcf8a', '195349b'],
    publicado: (s) => ['8b420b6', '38bcf8a', '195349b'].includes(s),
  });
  assert.equal(r.estado, 'ENTREGADO');
  assert.deepEqual(r.sinPublicar, []);
});

// La direccion inversa, que es la que hace util al gate: si NO existe, el gate da rojo
// cada vez que un pedido esta sano y se lo termina apagando.
test('el caso que YA cumple: un pedido con algo sin publicar sigue VIGENTE', () => {
  const r = clasificarPedido({
    id: 't_7b6c5a1f',
    shas: ['8b420b6', 'b2c25d4'],
    publicado: (s) => s === '8b420b6',
  });
  assert.equal(r.estado, 'VIGENTE');
  assert.deepEqual(r.sinPublicar, ['b2c25d4']);
});

// Un pedido que no nombra ni un sha no se puede juzgar. Declararlo ENTREGADO por vacio es
// como falla abierto esta familia: `todos los elementos de []` es verdadero.
test('sin un solo sha no se concluye ENTREGADO — se dice que no se pudo medir', () => {
  const r = clasificarPedido({ id: 't_x', shas: [], publicado: () => true });
  assert.equal(r.estado, 'NO_MEDIDO');
});

// Fallo conservador: si no se sabe si un sha esta publicado (no existe en el repo, git no
// contesta), el pedido NO se cierra. Cerrar de menos cuesta una vuelta; cerrar de mas le
// borra a Sergio Urcullo un pedido vivo.
test('un sha que no se puede resolver deja el pedido VIGENTE, no ENTREGADO', () => {
  const r = clasificarPedido({
    id: 't_y',
    shas: ['aaaaaaa', 'bbbbbbb'],
    publicado: (s) => (s === 'aaaaaaa' ? true : null), // null = no se sabe
  });
  assert.equal(r.estado, 'VIGENTE');
  assert.deepEqual(r.indeterminados, ['bbbbbbb']);
});

// El sha se busca con limites de palabra: `38bcf8a` NO puede matchear dentro de
// `38bcf8ab12`, o el gate da por publicado un commit que nadie publico.
test('el sha se lee con limites, no como substring', () => {
  const s = shasDelTexto('DEPLOY PEDIDO 38bcf8a — y ojo con 38bcf8ab12cafe que es otro');
  assert.ok(s.includes('38bcf8a'));
  assert.ok(!s.includes('38bcf8ab'));
});

// Palabras de 7+ letras que parecen sha pero no lo son. Sin este corte el gate junta basura
// y despues la declara "no publicada", dejando VIGENTE a todo pedido para siempre.
test('no confunde palabras comunes con shas', () => {
  const s = shasDelTexto('el deploy de la cadena decidida por Sergio, added, feedback');
  assert.deepEqual(s, []);
});

// ─────────────────────────────────────────────────────────────────────────────────────
// EL SUJETO. Estos tres casos son el gate: su primera version juntaba TODOS los shas del
// texto y por eso fallaba EN VERDE. Medido sobre el hilo real de t_0268567b el 2026-09-06.

test('un sha nombrado como «lo que NO viaja» no es una promesa', () => {
  const hilo = [
    'DEPLOY PEDIDO 5922faa — /agents prometia mal la cadencia.',
    'Lo que NO viaja: 7149658 (la pantalla de gastos). Esta commiteado pero NO es',
    'ancestro de origin/master todavia — entra en el swap siguiente.',
  ].join('\n');
  assert.deepEqual(shasPrometidos(hilo), ['5922faa']);
  // Y la prueba de que importa: con el ayudante laxo, el ajeno se cuela y el pedido
  // queda VIGENTE para siempre — basta UNO para que el gate no pueda cazar su caso.
  assert.ok(shasDelTexto(hilo).includes('7149658'));
});

test('el HEAD de un recuento tampoco es una promesa', () => {
  const hilo = "DEPLOY PEDIDO ad2d45f — la Planilla sin camino.\nRECUENTO DERIVADO: 'hay que publicar: 2 arreglo(s)', HEAD origin/master c81f431, staged NINGUNO.";
  assert.deepEqual(shasPrometidos(hilo), ['ad2d45f']);
});

test('del rango del cuerpo se promete la punta derecha, no el punto de partida', () => {
  // «Son 6 commits en master (545dd28..8b420b6)»: 545dd28 es lo que YA corria.
  assert.deepEqual(shasPrometidos('Son 6 commits en master (545dd28..8b420b6), gates verdes.'), ['8b420b6']);
});

// ─────────────────────────────────────────────────────────────────────────────────────
// EL BARRIDO. Distinto del sujeto: aca los shas y el patron estan bien, y lo que puede
// fallar es que la lista de pedidos salga INCOMPLETA y se lea como completa.

const LISTA = [
  'Board: onia',
  '⊘ t_340bd6e2  blocked   (unassigned)          Desplegar el bot',
  '▶ t_8baa5891  ready     (unassigned)          Probar si el tablero sostiene un carril',
  '⊘ t_deddf471  blocked   (unassigned)          Publicar app.onia.com.bo',
  '✓ t_558eaec1  done      default               Ya cerrada',
].join('\n');

test('el barrido encuentra un pedido por cada tarea abierta que declara DESPLEGAR', () => {
  const cuerpos = {
    t_340bd6e2: 'DESPLEGAR: bot\nle dice en construccion a 2 rubros',
    t_8baa5891: 'nada que ver con deploys',
    t_deddf471: 'DESPLEGAR: plataforma\nDEPLOY PEDIDO 77d0867',
  };
  const { pedidos, ilegibles } = barrerPedidos({ lista: LISTA, leerCuerpo: (id) => cuerpos[id] });
  assert.deepEqual(pedidos.map((p) => p.destino), ['bot', 'plataforma']);
  assert.deepEqual(ilegibles, []);
});

// EL AGUJERO QUE ME COSTO ESTA VUELTA, en su forma de codigo. `pedidosVivos` hacia
// `if (!cuerpo) continue`: un `show` que NO contesta se descartaba igual que una tarea sin
// linea DESPLEGAR. Desde que el integrador corre en el nodo de casa cada `show` es una
// llamada SSH — 88 en un barrido —, asi que un timeout suelto borra un pedido entero y el
// gate sigue hablando como si hubiera mirado todo. Es la misma firma que me engano a mano:
// una foto parcial no se distingue de un resultado completo.
test('un cuerpo que NO se pudo leer no se descarta en silencio: queda como ilegible', () => {
  const cuerpos = {
    t_340bd6e2: 'DESPLEGAR: bot',
    t_8baa5891: 'sin deploy',
    t_deddf471: null, // el `show` no contesto
  };
  const { pedidos, ilegibles } = barrerPedidos({ lista: LISTA, leerCuerpo: (id) => cuerpos[id] });
  assert.deepEqual(pedidos.map((p) => p.id), ['t_340bd6e2']);
  assert.deepEqual(ilegibles, ['t_deddf471'], 'el pedido ilegible tiene que quedar NOMBRADO');
});

// La direccion cara: con TODOS los cuerpos ilegibles el barrido sale vacio, que es
// exactamente lo que dice un tablero sin pedidos. Uno es «no hay nada que desplegar» y el
// otro es «no vi nada». Sin esta distincion el gate firma verde sobre un tablero que no leyo.
test('un barrido que no pudo leer NADA no se confunde con un tablero sin pedidos', () => {
  const { pedidos, ilegibles } = barrerPedidos({ lista: LISTA, leerCuerpo: () => null });
  assert.deepEqual(pedidos, []);
  assert.equal(ilegibles.length, 3, 'las 3 tareas abiertas quedan nombradas como ilegibles');
});

// ─────────────────────────────────────────────────────────────────────────────────────
// EL BUILD VIVO. El sha que corre produccion se CASA contra el artefacto; no se adivina.

test('el build que corre es el que casa su BUILD_ID, no el primero de la lista', () => {
  const candidatos = [
    { sha: 'aaaaaaa', buildId: 'viejo1' },
    { sha: 'fe4026e', buildId: 'r3bGWN_19MBDFZ24EKDZi' },
    { sha: 'bbbbbbb', buildId: 'viejo2' },
  ];
  assert.equal(buildQueCorre({ buildIdVivo: 'r3bGWN_19MBDFZ24EKDZi', candidatos }), 'fe4026e');
});

// Sin BUILD_ID vivo no hay con que casar. Devolver un sha igual —el mas nuevo, el primero—
// haria que el gate declarara ENTREGADO contra un build inventado, que es cerrarle a Sergio
// Urcullo un pedido real por un arreglo que el cliente nunca recibio.
test('sin BUILD_ID vivo no se elige ningun build', () => {
  assert.equal(buildQueCorre({ buildIdVivo: null, candidatos: [{ sha: 'fe4026e', buildId: 'x' }] }), null);
});

test('si ningun candidato casa, no se elige ninguno', () => {
  const candidatos = [{ sha: 'aaaaaaa', buildId: 'viejo1' }];
  assert.equal(buildQueCorre({ buildIdVivo: 'otro', candidatos }), null);
});

// ── landing: de que se compone «lo que el ok publicaria» ───────────────────────────────
//
// POR QUE ESTAN ACA Y NO SOLO EN EL --self-check: esta cadena es la que corre el integrador
// antes de tocar `main`. Un caso que vive unicamente en el self-check no lo corre nadie salvo
// el dueno del carril, y el objetivo del gate —que ningun pedido publique algo que Sergio
// Urcullo no leyo— no puede depender de que alguien se acuerde de invocarlo.
//
// La zona de landing (`web-factory/apps/onia-platform`) mezcla el sitio con sus PROPIAS
// herramientas. Sin este filtro, el pedido tendria que nombrar cada gate y cada script, y un
// pedido ilegible es un pedido que no se lee.
test('landing: un commit que solo toca un gate no entra en lo que el ok publica', () => {
  const viajan = soloLosQueViajan([
    { sha: '1111111', titulo: 'copy', archivos: ['web-factory/apps/onia-platform/src/app/page.tsx'] },
    { sha: '9999999', titulo: 'gate', archivos: ['web-factory/apps/onia-platform/src/app/x.test.ts'] },
  ]);
  assert.deepEqual(viajan.map((c) => c.sha), ['1111111']);
});

// El caso que YA cumple. Sin el, un filtro que devuelva SIEMPRE vacio pasa el de arriba por el
// motivo equivocado: todo pedido saldria COMPLETA para siempre y el gate quedaria mudo.
test('landing: el caso que YA cumple: un arreglo de copy si entra', () => {
  const viajan = soloLosQueViajan([
    { sha: '1111111', titulo: 'copy', archivos: ['web-factory/apps/onia-platform/src/lib/pricing.ts'] },
  ]);
  assert.equal(viajan.length, 1);
});

// Ausencia de dato NO es «no viaja»: `git log --name-only` pudo no contestar, y un merge NUNCA
// lista archivos. Ante la duda el commit viaja, asi el error posible es pedir que se nombre uno
// de mas —barato— y nunca callar un arreglo real.
test('landing: un commit sin lista de archivos se cuenta como que viaja', () => {
  assert.equal(soloLosQueViajan([{ sha: '1111111', titulo: 'sin datos' }]).length, 1);
});

// `null` entra y `null` sale: `promesaCompleta` lo traduce a NO_MEDIDO. Devolver `[]` diria
// «el ok no publica nada» y cerraria la pregunta sin haberla podido hacer.
test('landing: sin commits medidos no se inventa un universo vacio', () => {
  assert.equal(soloLosQueViajan(null), null);
});

// ─────────────────────────────────────────────────────────────────────────────
// CUERPO VENCIDO — la tercera pregunta, la que el 2026-09-10 no tenia dueno.
//
// `clasificarPedido` pregunta «¿lo prometido ya se publico?» y `promesaCompleta`
// «¿el ok publica algo que el pedido no nombra?». Las dos leen cuerpo Y comentarios
// como UN SOLO texto, y por eso los comentarios TAPAN al cuerpo: alcanza que el
// comentario mas nuevo nombre un sha sin publicar para que el pedido salga VIGENTE
// mientras su CUERPO —y su TITULO, que es lo unico que se ve en la lista— describen
// trabajo que ya esta en produccion.
//
// El caso real: t_e51796c8 prometia f8d0fc2, e911638 y 7756295 en el cuerpo; los TRES
// eran ancestros del build vivo (build-335389f). Lo unico que su ok publicaba de verdad
// era afa9da6, nombrado en un comentario de ese dia. `npm run pedido:entregado` dijo
// «sigue VIGENTE — 1 sin publicar» y tenia razon para SU pregunta: nadie hacia esta.
import { partirPedido, cuerpoVencido } from './pedido_deploy_entregado.mjs';

const SHOW = [
  'Task t_e51796c8: Publicar el sistema: la pantalla de pago le cobraba a 3 rubros',
  '  status:    blocked',
  '',
  'Body:',
  'DESPLEGAR: plataforma',
  'DEPLOY PEDIDO f8d0fc2 — la pantalla de pago prometia dos pantallas que el rubro no abre',
  'DEPLOY PEDIDO e911638 — la agenda publica rechazaba al desconocido al llegar al tope',
  '',
  'Comments (2):',
  '  [2026-09-08 23:53] x: DEPLOY PEDIDO 7756295 — el cupo de WhatsApp cortaba MUDO',
  '  [2026-09-10 12:32] x: DEPLOY PEDIDO afa9da6 — el boton Agendar lleva a un callejon',
].join('\n');

test('partirPedido separa el cuerpo de los comentarios', () => {
  const { cuerpo, comentarios } = partirPedido(SHOW);
  assert.ok(cuerpo.includes('f8d0fc2'), 'el cuerpo tiene lo suyo');
  assert.ok(!cuerpo.includes('afa9da6'), 'el cuerpo NO se lleva los comentarios');
  assert.ok(comentarios.includes('afa9da6'), 'los comentarios tienen lo suyo');
  assert.ok(!comentarios.includes('f8d0fc2'), 'los comentarios NO se llevan el cuerpo');
});

test('el defecto del 2026-09-10: todo el CUERPO publicado y un comentario sin publicar -> VENCIDO', () => {
  const publicados = new Set(['f8d0fc2', 'e911638', '7756295']);
  const r = cuerpoVencido({ texto: SHOW, publicado: (s) => publicados.has(s) });
  assert.equal(r.estado, 'VENCIDO');
  assert.deepEqual(r.mudos, ['afa9da6'], 'nombra lo que el ok publica y el cuerpo no dice');
});

// EL CASO DE ANCLAJE, sin el cual el guardia daria rojo sobre todo pedido sano y lo apagarian.
test('el caso que YA cumple: si el cuerpo todavia promete algo sin publicar -> VIGENTE', () => {
  const r = cuerpoVencido({ texto: SHOW, publicado: (s) => s !== 'e911638' });
  assert.equal(r.estado, 'VIGENTE');
});

test('un cuerpo sin shas no se puede juzgar: NO_MEDIDO, nunca VENCIDO', () => {
  const sinShas = 'Body:\nDESPLEGAR: landing\nse publica lo de la tabla de precios\n\nComments (1):\n  [x] y: DEPLOY PEDIDO afa9da6 — algo';
  assert.equal(cuerpoVencido({ texto: sinShas, publicado: () => false }).estado, 'NO_MEDIDO');
});

// Sin esto, un `publicado` que devuelve null (no se pudo resolver) se leeria como
// «no publicado» y absolveria al cuerpo vencido, o al reves. La direccion barata es
// callarse: NO_MEDIDO nunca hace rehacer una tarea sana.
test('un sha irresoluble del cuerpo deja NO_MEDIDO, no VENCIDO', () => {
  const r = cuerpoVencido({ texto: SHOW, publicado: (s) => (s === 'e911638' ? null : true) });
  assert.equal(r.estado, 'NO_MEDIDO');
});

test('cuerpo entero publicado y NADA sin publicar en comentarios -> ENTREGADO, lo mide clasificarPedido', () => {
  const r = cuerpoVencido({ texto: SHOW, publicado: () => true });
  assert.equal(r.estado, 'ENTREGADO');
});

// ─────────────────────────────────────────────────────────────────────────────
// Que la funcion EXISTA y pase sus casos no la pone a medir: el `main` puede no
// invocarla nunca. Es la trampa de «declarado pero no invocado», y en esta familia
// no la caza nadie —`guards-cableados` ata los `test:*` de package.json, no los
// clasificadores de adentro de un gate—. Probado el 2026-09-10: quitando el
// `vencidos.push` del main, `--self-check` seguia saliendo con exit 0.
//
// Se mide sobre la VECINDAD del bloque de plataforma, no sobre el archivo entero:
// preguntar «¿el fuente nombra cuerpoVencido?» se cumple con su propia definicion y
// con el import del test. Y se le sacan los comentarios antes, o la bitacora que
// explica por que existe el guardia lo absuelve sola.
test('el main INVOCA cuerpoVencido en el bloque de plataforma, no solo lo declara', async () => {
  const { readFileSync } = await import('node:fs');
  const src = readFileSync(new URL('./pedido_deploy_entregado.mjs', import.meta.url), 'utf8')
    .split('\n').filter((l) => !/^\s*(\/\/|\*|\/\*)/.test(l)).join('\n');
  const desde = src.indexOf('clasificarPedido({ id: p.id');
  assert.ok(desde > 0, 'no encontre el bloque de plataforma del main');
  const vecindad = src.slice(desde, desde + 1400);
  assert.match(vecindad, /cuerpoVencido\(\{/, 'el main tiene que llamar a cuerpoVencido');
  assert.match(vecindad, /vencidos\.push\(/, 'y empujar el resultado, o el veredicto se tira');
  // 🔴 Y el push tiene que colgar de la comparacion CORRECTA — el mismo agujero que su hermano
  // `cortos.push(` ya tenia atado y a este se le quedo abierto. Pedir solo que `vencidos.push(`
  // aparezca se satisface con el ESQUIVE: cambiar la condicion a una que nunca se cumple deja el
  // push intacto en el fuente y el veredicto en la basura. Medido el 2026-09-11 sobre este mismo
  // archivo: con `v.estado === 'ESTADO_QUE_NO_EXISTE'` los 44 casos pasaron en VERDE, o sea que
  // el control que caza el pedido de deploy que le pide a Sergio Urcullo un ok por trabajo YA
  // publicado podia quedar mudo sin que nada se pusiera rojo.
  assert.match(vecindad, /VENCIDO'\s*\)\s*vencidos\.push\(/,
    'el push tiene que dispararlo el estado VENCIDO, no una condicion cualquiera');
});

// ─────────────────────────────────────────────────────────────────────────────
// LA FAMILIA SIMETRICA DE `cuerpoVencido`, abierta hasta el 2026-09-11: el cuerpo que
// quedo CORTO. Esa caza el cuerpo que SOBRE-describe; esta el que SUB-describe.
//
// El caso real: t_5511da55 describia DOS arreglos en prosa, medidos contra «master 42ed1e2»,
// y para cuando se leyo master era 18b1feb con 6 commits mas — el ok publicaba SIETE. Los
// cinco que faltaban vivian en comentarios, asi que `promesaCompleta` decia «0 sin resolver»
// con razon para SU pregunta (lee cuerpo y comentarios juntos), y `cuerpoVencido` salia
// NO_MEDIDO porque el cuerpo describe en prosa y no lleva la marca. Nadie hacia esta.
import { cuerpoCorto } from './pedido_deploy_entregado.mjs';

const SHOW_PROSA = [
  'Task t_5511da55: Publicar app.onia.com.bo: el aviso de que tu plan vence',
  '  status:    blocked',
  '',
  'Body:',
  'DESPLEGAR: plataforma',
  'Recuento derivado del publicador en seco (master 42ed1e2; produccion corre build-cd1629a):',
  '1) El interruptor de correos a SUS clientes le apagaba el aviso de que SU plan vence.',
  '2) El cliente al que le fian quedaba en una tabla que su dueno no abre.',
  '',
  'Comments (1):',
  '  [2026-09-11 04:57] x: DEPLOY PEDIDO 887b3ea — el plan SEMANAL recibia el aviso el dia que pagaba',
].join('\n');

const PUBLICARIA = [
  { sha: '859fd05', titulo: 'el interruptor apagaba el aviso del plan' },
  { sha: '887b3ea', titulo: 'el plan semanal recibia el aviso el dia que pagaba' },
];

test('el defecto del 2026-09-11: el cuerpo describe en prosa y su ok publica mas -> SUB_DESCRIBE', () => {
  const r = cuerpoCorto({ texto: SHOW_PROSA, publicaria: PUBLICARIA });
  assert.equal(r.estado, 'SUB_DESCRIBE');
  // Se lee con `.map().join()` y NO con `.mudos[0]`: sobre una lista vacia el indexado lanza,
  // y un throw mata el reporter entero antes de imprimir una linea — la mutacion se leeria
  // como «el gate aguanta».
  assert.equal(r.mudos.map((m) => m.sha).join(','), '859fd05,887b3ea',
    'los dos son mudos PARA EL CUERPO: uno no esta en ningun lado y el otro solo en un comentario');
});

// EL CASO DE ANCLAJE. Sin el, marcar mudo a todo pasaria igual y el gate pareceria vivo.
test('el caso que YA cumple: el cuerpo nombra todo lo que publica -> COMPLETA', () => {
  const cuerpoCompleto = SHOW_PROSA.replace(
    '1) El interruptor',
    '1) DEPLOY PEDIDO 859fd05 y 887b3ea — El interruptor');
  assert.equal(cuerpoCorto({ texto: cuerpoCompleto, publicaria: PUBLICARIA }).estado, 'COMPLETA');
});

// La otra mitad del anclaje: el comentario NO puede tapar al cuerpo, que es el bug entero.
// Si alguien vuelve a leer el `show` completo, este caso se pone en rojo.
test('un sha nombrado SOLO en un comentario no absuelve al cuerpo', () => {
  const r = cuerpoCorto({ texto: SHOW_PROSA, publicaria: [{ sha: '887b3ea', titulo: 'solo en comentario' }] });
  assert.equal(r.estado, 'SUB_DESCRIBE', 'el comentario lo nombra, el cuerpo no');
});

test('sin poder derivar que publica -> NO_MEDIDO, nunca COMPLETA', () => {
  assert.equal(cuerpoCorto({ texto: SHOW_PROSA, publicaria: null }).estado, 'NO_MEDIDO');
});

// Declarado no es invocado: misma trampa que la de `cuerpoVencido` de arriba.
test('el main INVOCA cuerpoCorto en el bloque de plataforma, no solo lo declara', async () => {
  const { readFileSync } = await import('node:fs');
  const src = readFileSync(new URL('./pedido_deploy_entregado.mjs', import.meta.url), 'utf8')
    .split('\n').filter((l) => !/^\s*(\/\/|\*|\/\*)/.test(l)).join('\n');
  const desde = src.indexOf('clasificarPedido({ id: p.id');
  assert.ok(desde > 0, 'no encontre el bloque de plataforma del main');
  const vecindad = src.slice(desde, desde + 1800);
  assert.match(vecindad, /cuerpoCorto\(\{/, 'el main tiene que llamar a cuerpoCorto');
  assert.match(vecindad, /cortos\.push\(/, 'y empujar el resultado, o el veredicto se tira');
  // 🔴 Y el push tiene que colgar de la comparacion CORRECTA. Pedir solo que `cortos.push(`
  // aparezca se satisface con el ESQUIVE: cambiar la condicion a una que nunca se cumple deja
  // el push en el fuente y el veredicto en la basura. Medido el 2026-09-11 validando este
  // mismo gate: de cuatro mutaciones, las tres de la funcion pura cayeron en rojo y esta paso
  // en VERDE con el main ya incapaz de reportar un solo pedido corto.
  assert.match(vecindad, /SUB_DESCRIBE'\s*\)\s*cortos\.push\(/,
    'el push tiene que dispararlo el estado SUB_DESCRIBE, no una condicion cualquiera');
});

// ── siat: el tercer destino, que se publica por COPIA DE ARCHIVOS ──────────────────────
// Hasta el 2026-09-11 todo destino que no fuera `plataforma` ni `landing` caia en
// `sinCubrir` («su artefacto no nombra sha ni fecha»), asi que el pedido de `siat` podia
// derivar a «su ok publica lo que nadie leyo» sin que nada se pusiera rojo. El invariante
// no cambia: cambia el artefacto contra el que se mide.

/** La salida REAL del publicador en seco, medida el 2026-09-11 contra el VPS. */
const SECO_SIAT = [
  '== publicar el emisor SIAT ==',
  '   desde:   /root/loops/onia-hermes/hermes-content/integrations/siat (idéntico a origin/main b80a4984b)',
  '   destino: /opt/onia-siat/emisor',
  '',
  'hay que publicar: 2 arreglo(s) que el emisor del VPS no tiene',
  'Cambia:',
  '   test/fase1-runner.test.mjs',
  '   run-fase1-volumen.sh',
  '',
  '== gate: tests del emisor ==',
  '   verde: 97 casos',
].join('\n');

test('siat: del dry-run salen los archivos que el ok publicaria', () => {
  assert.deepEqual(archivosDelDryRun(SECO_SIAT), ['test/fase1-runner.test.mjs', 'run-fase1-volumen.sh']);
});

// `[]` y `null` NO son lo mismo, y mezclarlos es como un NO MEDIDO se vuelve un falso verde:
// el primero es una respuesta real del publicador, el segundo es «no llegue a preguntar».
test('siat: «YA ESTA PUBLICADO» es al dia ([]), no «no pude medir» (null)', () => {
  const alDia = '== publicar el emisor SIAT ==\n\nYA ESTA PUBLICADO — el emisor del VPS corre todo lo que main tiene.';
  assert.deepEqual(archivosDelDryRun(alDia), []);
});

test('siat: sin salida, o con un formato que no entiendo -> null, nunca []', () => {
  assert.equal(archivosDelDryRun(null), null, 'el SSH no contesto');
  assert.equal(archivosDelDryRun(''), null, 'salida vacia');
  assert.equal(archivosDelDryRun('ERR: no existe el destino (/opt/onia-siat/emisor)'), null, 'el publicador fallo');
  assert.equal(
    archivosDelDryRun('hay que publicar: 2 arreglo(s)\n(el formato cambio y ya no lista nada)'),
    null,
    'si el publicador cambia su formato el gate se calla, no adivina',
  );
  assert.equal(archivosDelDryRun('Cambia:\n\n'), null, '«Cambia:» sin lista no es «al dia»');
});

// EL CASO QUE IMPORTA: el que EXIGE un rojo. Uno que solo pruebe el verde pasa igual con el
// guardia arrancado. Es el defecto REAL que este instrumento cazo en su primera corrida.
test('siat: un archivo que el cuerpo NO nombra -> SUB_DESCRIBE', () => {
  const r = archivosNombrados({
    texto: 'DESPLEGAR: siat\nEl arreglo esta en run-fase1-volumen.sh.',
    publicaria: ['test/fase1-runner.test.mjs', 'run-fase1-volumen.sh'],
  });
  assert.equal(r.estado, 'SUB_DESCRIBE');
  assert.deepEqual(r.mudos, ['test/fase1-runner.test.mjs']);
});

// Describirlo en prosa NO alcanza, y es la vara que el gate ya usa con los shas: sin un
// identificador literal nadie puede verificar que lo descrito sea lo publicado, y el dia que
// el publicador arrastre OTRO archivo de pruebas la misma frase lo seguiria dando por
// cubierto. Ese es el texto real del cuerpo de t_86874107.
test('siat: «el archivo de pruebas» no es nombrar un archivo', () => {
  const r = archivosNombrados({
    texto: 'El segundo arreglo es el archivo de pruebas que fija lo de arriba.',
    publicaria: ['test/fase1-runner.test.mjs'],
  });
  assert.equal(r.estado, 'SUB_DESCRIBE');
});

// La direccion inversa, la que hace util al gate: sin ella da rojo sobre pedidos sanos y se
// lo termina apagando. Las DOS formas valen, igual que los shas se casan por prefijo.
test('el caso que YA cumple: nombrado por ruta o por nombre de archivo -> COMPLETA', () => {
  const publicaria = ['test/fase1-runner.test.mjs', 'run-fase1-volumen.sh'];
  assert.equal(
    archivosNombrados({ texto: 'Cambia test/fase1-runner.test.mjs y run-fase1-volumen.sh.', publicaria }).estado,
    'COMPLETA',
    'por ruta',
  );
  assert.equal(
    archivosNombrados({ texto: 'Toca fase1-runner.test.mjs y tambien run-fase1-volumen.sh.', publicaria }).estado,
    'COMPLETA',
    'por nombre de archivo: el pedido puede escribir la ruta del repo y el publicador la suya',
  );
});

test('siat: sin poder derivar que publica -> NO_MEDIDO, nunca COMPLETA', () => {
  assert.equal(archivosNombrados({ texto: 'lo que sea', publicaria: null }).estado, 'NO_MEDIDO');
  assert.equal(
    archivosNombrados({ texto: 'lo que sea', publicaria: [] }).estado,
    'NO_MEDIDO',
    '«el ok no publicaria nada» es la pregunta del caso ENTREGADO, no de esta',
  );
});

// Los comentarios se apilan abajo y TAPAN al cuerpo, que es lo unico que Sergio Urcullo lee
// para decidir. Misma relacion que `cuerpoCorto` tiene con `promesaCompleta`.
test('siat: nombrado SOLO en un comentario -> el CUERPO sigue corto', () => {
  const show = [
    'Body:',
    'DESPLEGAR: siat',
    'El arreglo esta en run-fase1-volumen.sh.',
    '',
    'Comments (1):',
    '  [2026-09-11 10:00] onia-cola: ademas viaja test/fase1-runner.test.mjs',
  ].join('\n');
  assert.equal(cuerpoCortoArchivos({ texto: show, publicaria: ['test/fase1-runner.test.mjs', 'run-fase1-volumen.sh'] }).estado,
    'SUB_DESCRIBE', 'el comentario lo nombra, el cuerpo no');
  const enElCuerpo = show.replace('El arreglo esta en run-fase1-volumen.sh.',
    'Cambian run-fase1-volumen.sh y test/fase1-runner.test.mjs.');
  assert.equal(cuerpoCortoArchivos({ texto: enElCuerpo, publicaria: ['test/fase1-runner.test.mjs', 'run-fase1-volumen.sh'] }).estado,
    'COMPLETA', 'y el caso que YA cumple: nombrado en el cuerpo, verde');
});

// Declarado no es invocado, y el push tiene que colgar de la comparacion CORRECTA: pedir solo
// que `cortosSiat.push(` aparezca se satisface con el ESQUIVE de cambiarle la condicion.
test('el main INVOCA el instrumento de siat, no solo lo declara', async () => {
  const { readFileSync } = await import('node:fs');
  const src = readFileSync(new URL('./pedido_deploy_entregado.mjs', import.meta.url), 'utf8')
    .split('\n').filter((l) => !/^\s*(\/\/|\*|\/\*)/.test(l)).join('\n');
  const desde = src.indexOf("p.destino === 'siat'");
  assert.ok(desde > 0, 'no encontre el bloque de siat del main');
  const vecindad = src.slice(desde, desde + 1800);
  // 🔴 Pedir que `publicariaSiat()` APAREZCA se satisface con el ESQUIVE de llamarlo y tirar
  // el resultado (`publicariaSiat(); const publicaria = null;`): medido el 2026-09-11, esa
  // mutacion pasaba 44/44 en VERDE. Tiene que estar ASIGNADO a lo que el resto usa.
  assert.match(vecindad, /const\s+publicaria\s*=\s*publicariaSiat\(\)/,
    'el universo se deriva del publicador Y se usa, no se llama para tirarlo');
  assert.match(vecindad, /cuerpoCortoArchivos\(\{[^}]*texto:\s*p\.texto/,
    'y se le pregunta al CUERPO del pedido');
  assert.match(vecindad, /SUB_DESCRIBE'\s*\)\s*\{?\s*cortosSiat\.push\(/,
    'el push tiene que dispararlo el estado SUB_DESCRIBE, no una condicion cualquiera');
  // Y las dos guardas de direccion: sin poder medir NO se concluye, y el «al dia» es rojo
  // (le pide un ok por trabajo hecho), no un verde silencioso.
  // 🔴 Anclado al `if (` por el mismo motivo: `if (false && publicaria === null)` deja el
  // literal intacto con la guarda muerta, y tambien pasaba 44/44.
  assert.match(vecindad, /if\s*\(\s*publicaria === null\s*\)/, 'sin medicion -> NO MEDIDO');
  assert.match(vecindad, /if\s*\(\s*publicaria\.length === 0\s*\)\s*\{[^}]*entregadosSiat\.push\(/,
    'y al dia -> ROJO por pedir un ok por trabajo hecho');
});

// El destino ya NO puede caer en `sinCubrir`: es la condicion de hecho de la tarea t_7836e91f.
test('siat ya no cae en la rama «sin instrumento»', async () => {
  const { readFileSync } = await import('node:fs');
  const src = readFileSync(new URL('./pedido_deploy_entregado.mjs', import.meta.url), 'utf8');
  const iSiat = src.indexOf("p.destino === 'siat'");
  const iSinCubrir = src.indexOf("p.destino !== 'plataforma'");
  assert.ok(iSiat > 0 && iSinCubrir > 0, 'faltan las dos ramas');
  assert.ok(iSiat < iSinCubrir, 'la rama de siat tiene que ir ANTES del cajon de «sin instrumento»');
});

// El caso que cuesta caro y que ya dejo ciegos a otros tres gates vivos al mudarse de
// maquina: este gate corre hoy desde el nodo de casa, donde `/opt` NO existe. Si la lectura
// no sale por SSH el destino queda sin medir y NADA se pone rojo.
// Las vias se inyectan: un test que salga a la red de verdad es lento y mide otra cosa.
test('siat: sin /opt local, la medicion sale por el VPS', () => {
  const llamadas = [];
  const salida = secoDeProduccion('/opt/onia-siat/_deploy/publicar.sh', {
    local: (r) => { llamadas.push(`local:${r}`); return null; },        // el nodo de casa
    remoto: (r) => { llamadas.push(`remoto:${r}`); return 'Cambia:\n   x.sh\n'; },
  });
  assert.equal(salida, 'Cambia:\n   x.sh\n');
  assert.deepEqual(llamadas, ['local:/opt/onia-siat/_deploy/publicar.sh', 'remoto:/opt/onia-siat/_deploy/publicar.sh']);
});

test('siat: con /opt local NO se sale a la red', () => {
  let remotos = 0;
  const salida = secoDeProduccion('/opt/onia-siat/_deploy/publicar.sh', {
    local: () => 'YA ESTA PUBLICADO — el emisor del VPS corre todo lo que main tiene.',
    remoto: () => { remotos += 1; return 'no deberia llamarse'; },
  });
  assert.match(salida, /^YA ESTA PUBLICADO/);
  assert.equal(remotos, 0, 'si el disco contesta, no se pregunta dos veces');
});

// La direccion que decide todo: con el SSH caido tiene que salir NO MEDIDO, nunca «ok».
test('siat: con las DOS vias caidas -> null, y de ahi NO MEDIDO', () => {
  const salida = secoDeProduccion('/opt/onia-siat/_deploy/publicar.sh', {
    local: () => null,
    remoto: () => null,
  });
  assert.equal(salida, null, 'no llegue a preguntar no es una respuesta');
  assert.equal(archivosDelDryRun(salida), null);
  assert.equal(archivosNombrados({ texto: 'cualquier cosa', publicaria: archivosDelDryRun(salida) }).estado,
    'NO_MEDIDO', 'un SSH caido no puede dar por completo un pedido');
});
