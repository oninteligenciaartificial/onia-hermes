#!/usr/bin/env node
/**
 * Casos PUROS de pedido_deploy_entregado.mjs. No tocan git, ni el tablero, ni produccion:
 * por eso pueden vivir en la cadena `npm test` que el integrador corre antes de mergear.
 * La medicion VIVA va aparte (`npm run pedido:entregado`), porque necesita el repo hermano
 * y produccion, y un gate que exige eso pone rojo por AMBIENTE y traba a los quince carriles.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, rmSync, mkdtempSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { archivosDelDryRun, archivosDelDryRunBot, archivosNombrados, secoDeProduccion, barrerTablero, creadoEnSegundos, barrerTableroJson, buildQueCorre, cadenaPorPedido, clasificarPedido, imprimirCadena, cuerpoCortoArchivos, cuerpoNoEjecuta, inmediblesSinDeclarar, publicariaLanding, publicariaPorCopia, shasDelTexto, shasPrometidos, soloLosQueViajan } from './pedido_deploy_entregado.mjs';
import { DESTINOS, ESTADOS_VIVOS } from './kanban/publicar-aprobado.mjs';

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

const TAREAS = [
  { id: 't_340bd6e2', status: 'blocked', body: 'DESPLEGAR: bot\nle dice en construccion a 2 rubros' },
  { id: 't_8baa5891', status: 'ready', body: 'nada que ver con deploys' },
  { id: 't_deddf471', status: 'blocked', body: 'DESPLEGAR: plataforma\nDEPLOY PEDIDO 77d0867' },
  { id: 't_558eaec1', status: 'done', body: 'DESPLEGAR: landing\nya cerrada' },
];

test('el barrido encuentra un pedido por cada tarea abierta que declara DESPLEGAR', () => {
  const { pedidos, ilegibles } = barrerTablero({ tareas: TAREAS });
  assert.deepEqual(pedidos.map((p) => p.destino), ['bot', 'plataforma']);
  assert.deepEqual(ilegibles, []);
});

// La EDAD del pedido viaja en el barrido porque su consumidor (deploy_sin_pedido.mjs) la
// necesita para distinguir un pedido recien abierto de uno que lleva dias sin que nadie lo
// apriete. Sin este campo, ese gate absuelve igual a los dos.
test('el barrido trae CUANDO nacio cada pedido, en segundos epoch', () => {
  const { pedidos } = barrerTablero({
    tareas: [{ id: 't_a', status: 'blocked', body: 'DESPLEGAR: bot', created_at: 1789638115 }],
  });
  assert.equal(pedidos[0].creado, 1789638115);
});

// Tri-estado: sin fecha legible es `null`, nunca 0 ni la fecha de hoy. Inventarla declararia
// fresco a un pedido de la semana pasada, que es la direccion que calla trabajo varado.
test('un pedido sin fecha legible trae creado null, no un numero inventado', () => {
  for (const tarea of [
    { id: 't_a', status: 'blocked', body: 'DESPLEGAR: bot' },
    { id: 't_b', status: 'blocked', body: 'DESPLEGAR: bot', created_at: null },
    { id: 't_c', status: 'blocked', body: 'DESPLEGAR: bot', created_at: 'ayer' },
  ]) {
    const { pedidos } = barrerTablero({ tareas: [tarea] });
    assert.equal(pedidos[0].creado, null, `${tarea.id} no puede inventar fecha`);
  }
});

test('creadoEnSegundos acepta las formas que el tablero ya usa', () => {
  assert.equal(creadoEnSegundos({ created_at: 1789638115 }), 1789638115);
  assert.equal(creadoEnSegundos({ created_at: '1789638115' }), 1789638115);
  assert.equal(creadoEnSegundos({ createdAt: 1789638115 }), 1789638115);
  assert.equal(creadoEnSegundos({ created_at: '2026-09-17T09:41:55Z' }), 1789638115);
});

// Una tarea CERRADA no es un pedido vivo: su `ok` ya no ejecuta (el brazo sale 3). Contarla
// haria que el gate exija desplegar algo que nadie puede disparar.
test('una tarea done NO cuenta como pedido vivo aunque declare DESPLEGAR', () => {
  const { pedidos, abiertos } = barrerTablero({ tareas: TAREAS });
  assert.ok(!pedidos.some((p) => p.id === 't_558eaec1'), 'la done no puede entrar');
  assert.ok(!abiertos.has('t_558eaec1'), 'y tampoco cuenta como puntero vivo');
});

// 🔴 EL AGUJERO DE ESTA VUELTA, medido el 2026-09-13 contra el tablero real. El barrido
// filtraba por los SIMBOLOS de `list` con `/^[⊘▶◻]/` — blocked, ready, todo — y el ejecutor
// declara SIETE estados vivos. Un pedido RECLAMADO (`running`, que imprime `●`) era invisible
// para el gate mientras su `ok` desplegaba perfecto: no salia en `pedidos` (-> se abre un
// pedido DUPLICADO para ese destino) ni en `abiertos` (-> `cuerpoPunteroMuerto` acusa de
// muerto a un puntero vivo). Las dos direcciones del dano en el mismo agujero.
test('un pedido RECLAMADO (running) es un pedido vivo: el ok ejecuta sobre el', () => {
  const { pedidos, abiertos } = barrerTablero({
    tareas: [{ id: 't_running1', status: 'running', body: 'DESPLEGAR: landing' }],
  });
  assert.deepEqual(pedidos.map((p) => p.destino), ['landing']);
  assert.ok(abiertos.has('t_running1'), 'y su puntero no se puede leer como muerto');
});

// El cierre de CLASE, y lo que evita que esto vuelva con el proximo estado que agregue el
// tablero: el universo no es una lista propia, es la del brazo. Si manana `ESTADOS_VIVOS`
// gana uno, este caso lo exige aca sin que nadie se acuerde de venir.
test('todo estado que el ok EJECUTA cuenta como pedido vivo para el gate', () => {
  for (const estado of ESTADOS_VIVOS) {
    const { pedidos } = barrerTablero({
      tareas: [{ id: `t_${estado}`, status: estado, body: 'DESPLEGAR: bot' }],
    });
    assert.deepEqual(
      pedidos.map((p) => p.id), [`t_${estado}`],
      `el brazo ejecuta sobre "${estado}", asi que el gate tiene que verlo`,
    );
  }
});

// EL OTRO AGUJERO, en su forma de codigo. `pedidosVivos` hacia `if (!cuerpo) continue`: un
// cuerpo que NO llega se descartaba igual que una tarea sin linea DESPLEGAR, asi que el
// pedido desaparecia y el gate seguia hablando como si hubiera mirado todo. Es la misma
// firma que engana a mano: una foto parcial no se distingue de un resultado completo.
test('un cuerpo que NO se pudo leer no se descarta en silencio: queda como ilegible', () => {
  const { pedidos, ilegibles } = barrerTablero({
    tareas: TAREAS.map((t) => (t.id === 't_deddf471' ? { ...t, body: null } : t)),
  });
  assert.deepEqual(pedidos.map((p) => p.id), ['t_340bd6e2']);
  assert.deepEqual(ilegibles, ['t_deddf471'], 'el pedido ilegible tiene que quedar NOMBRADO');
});

// Un estado que no se pudo leer no es «cerrada»: es «no se». Las dos salidas conservadoras
// son no callar el pedido (ilegible) y no acusar al puntero (abierto).
test('una tarea sin status legible se NOMBRA y no se da por cerrada', () => {
  const { ilegibles, abiertos } = barrerTablero({
    tareas: [{ id: 't_sinestado', body: 'DESPLEGAR: bot' }],
  });
  assert.deepEqual(ilegibles, ['t_sinestado']);
  assert.ok(abiertos.has('t_sinestado'), 'ante la duda NO se acusa al puntero');
});

// La direccion cara: con TODOS los cuerpos ilegibles el barrido sale vacio, que es
// exactamente lo que dice un tablero sin pedidos. Uno es «no hay nada que desplegar» y el
// otro es «no vi nada». Sin esta distincion el gate firma verde sobre un tablero que no leyo.
test('un barrido que no pudo leer NADA no se confunde con un tablero sin pedidos', () => {
  const { pedidos, ilegibles } = barrerTablero({
    tareas: TAREAS.map((t) => ({ ...t, body: null })),
  });
  assert.deepEqual(pedidos, []);
  assert.equal(ilegibles.length, 3, 'las 3 tareas abiertas quedan nombradas como ilegibles');
});

// Cableado: el gate se APAGABA SOLO y nada se ponia rojo. `pedidosVivos` pedia la lista y
// despues un `show` POR CADA TAREA ABIERTA; en el nodo de casa `onia-tablero.sh` hace `exec
// ssh`, o sea un handshake por tarea: ~7 minutos con 72 tareas (medido 2026-09-13), creciendo
// con el tablero, hasta no contestar dentro de la vuelta. Un gate que no contesta es
// indistinguible de uno que no existe. El sujeto se deriva del fuente: si vuelve un `show`
// por tarea, este caso lo dice — que es lo unico que impide que el arreglo se revierta solo.
test('cableado: el tablero se lee UNA vez, no un show por tarea', () => {
  const src = readFileSync(new URL('./pedido_deploy_entregado.mjs', import.meta.url), 'utf8')
    .split('\n').filter((l) => !/^\s*(\/\/|\*|\/\*)/.test(l)).join('\n');
  assert.ok(
    !/TABLERO,\s*'show'/.test(src),
    'un `show` por tarea es un SSH por tarea: el gate deja de contestar dentro de la vuelta',
  );
  assert.match(src, /TABLERO,\s*'list',\s*'--json'/,
    'el barrido sale de `list --json`, que trae los cuerpos de todas las tareas de una');
  const lecturas = [...src.matchAll(/\[TABLERO[^\]]*\]/g)];
  assert.equal(lecturas.length, 1, `el tablero se consulta una sola vez, no ${lecturas.length}`);
});

// TRI-ESTADO en el parseo, que es donde un SSH cortado a mitad del JSON se disfraza de
// tablero vacio. `[]` diria «no hay pedidos» y borraria un pedido real; tiene que ser `null`.
test('un JSON truncado es NO MEDIDO, nunca un tablero sin pedidos', () => {
  assert.equal(barrerTableroJson('[{"id":"t_1","status":"ready","body":"DESPLE'), null);
  assert.equal(barrerTableroJson(''), null, 'una respuesta vacia tampoco es un tablero vacio');
  assert.equal(barrerTableroJson(null), null, 'ni el fallo del propio comando');
  assert.equal(barrerTableroJson('{"tareas":[]}'), null, 'ni un JSON que no sea la lista');
  assert.deepEqual(barrerTableroJson('[]').pedidos, [], 'un tablero REALMENTE vacio si es []');
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
//
// ⚠️ El ancla dejo de ser `p.destino === 'siat'` el 2026-09-12: la rama pasó a ser de la
// ESPECIE (los que publican por copia, hoy siat y bot) en vez de una rama por destino. Es el
// mismo invariante sobre un sujeto mas grande — y el motivo del cambio es que la version por
// destino ya habia dejado afuera al hermano una vez.
test('el main INVOCA el instrumento de los destinos por copia, no solo lo declara', async () => {
  const { readFileSync } = await import('node:fs');
  const src = readFileSync(new URL('./pedido_deploy_entregado.mjs', import.meta.url), 'utf8')
    .split('\n').filter((l) => !/^\s*(\/\/|\*|\/\*)/.test(l)).join('\n');
  const desde = src.indexOf('DESTINOS_POR_COPIA[p.destino] !== undefined');
  assert.ok(desde > 0, 'no encontre el bloque de los destinos por copia del main');
  const vecindad = src.slice(desde, desde + 1800);
  // 🔴 Pedir que `publicariaPorCopia()` APAREZCA se satisface con el ESQUIVE de llamarlo y
  // tirar el resultado (`publicariaPorCopia(p.destino); const publicaria = null;`): medido el
  // 2026-09-11, esa mutacion pasaba 44/44 en VERDE. Tiene que estar ASIGNADO a lo que se usa.
  assert.match(vecindad, /const\s+publicaria\s*=\s*publicariaPorCopia\(p\.destino\)/,
    'el universo se deriva del publicador DEL DESTINO Y se usa, no se llama para tirarlo');
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
test('los destinos por copia ya no caen en la rama «sin instrumento»', async () => {
  const { readFileSync } = await import('node:fs');
  const src = readFileSync(new URL('./pedido_deploy_entregado.mjs', import.meta.url), 'utf8');
  const iCopia = src.indexOf('DESTINOS_POR_COPIA[p.destino] !== undefined');
  const iSinCubrir = src.indexOf("p.destino !== 'plataforma'");
  assert.ok(iCopia > 0 && iSinCubrir > 0, 'faltan las dos ramas');
  assert.ok(iCopia < iSinCubrir, 'la rama por copia tiene que ir ANTES del cajon de «sin instrumento»');
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

// ── el universo de plataforma pasa por el filtro, igual que el de landing ──────────────
//
// El 2026-09-11 `soloLosQueViajan` existia, estaba documentado con el criterio correcto e
// importado del lugar correcto... y se aplicaba SOLO a landing. La mitad `plataforma` ni
// siquiera pedia los archivos, asi que tres commits de puro `.test.ts` entraron al universo
// y el gate exigio nombrarlos: conto 23 donde `publicar.sh --dry-run` contaba 20. Es
// «declarado pero no invocado», y ningun caso sobre la funcion pura lo puede ver — por eso
// este mira el CABLEADO, y ancla la ASIGNACION, no la mencion del simbolo (llamarlo y tirar
// el resultado es el esquive barato de esta familia).
test('cableado: el universo de plataforma se arma con los archivos y sale por soloLosQueViajan', () => {
  const fuente = readFileSync(new URL('./pedido_deploy_entregado.mjs', import.meta.url), 'utf8');
  const i = fuente.indexOf('const publicariaPlataforma');
  assert.ok(i > -1, 'no encontre el bloque publicariaPlataforma');
  const bloque = fuente.slice(i, fuente.indexOf('\n  const entregados', i));
  assert.ok(/'--name-only'/.test(bloque),
    'sin --name-only no hay archivos, y sin archivos el filtro cuenta TODO commit como que viaja');
  assert.ok(/return\s+soloLosQueViajan\(/.test(bloque),
    'el universo tiene que SALIR por el filtro: mencionarlo y tirar el resultado deja el gate igual de crudo');
});

// La direccion contraria, que es la que sostiene el sesgo de la casa: sin datos, VIAJA.
// Aflojar esto haria callar un arreglo real, que es el unico error que este gate no puede
// permitirse (pedir nombrar de mas es barato).
test('un commit sin archivos sigue contando como que viaja', () => {
  assert.equal(soloLosQueViajan([{ sha: '2222222', titulo: 'merge o no pude preguntar', archivos: null }]).length, 1);
});

// ─────────────────────────────────────────────────────────────────────────────────────
// EL PEDIDO QUE NO SE PUEDE JUZGAR. Medido el 2026-09-12 sobre los pedidos vivos: de los
// cuatro, `t_bd62e5a0` (plataforma) y `t_fd5b30c4` (landing) nombraban su sha EN PROSA
// —«1) 4bff903 - la escalera de precios NUEVA»— y no con la marca `DEPLOY PEDIDO`. Los dos
// salian `NO MEDIDO: el pedido no nombra un solo sha`, y el gate salia con codigo 0.
//
// O sea: el modo de falla que este archivo existe para cazar —el pedido que le pide un ok a
// Sergio Urcullo por trabajo ya publicado— no se podia cazar en la MITAD de los pedidos
// vivos, y nada se ponia rojo. Es la misma firma que su encabezado ya documenta para
// `landing` y `bot` («el hueco esta en el sujeto que no mira, y un exit 0 lo tapa»), solo
// que un nivel mas adentro: aca el destino SI tiene instrumento, el que falta es el sha.
//
// La cura NO es aflojar `shasPrometidos` para que adivine el sha de la prosa: deducir el
// sujeto del texto libre es lo que rompe a esta familia, y esta escrito arriba con su
// medicion. La cura es que un pedido INMEDIBLE sea un rojo accionable —declarar el sha
// cuesta un comentario— en vez de una linea informativa que pasa en verde.
test('un pedido sin shas declarados queda marcado como INMEDIBLE, no como un no-medido cualquiera', () => {
  const r = clasificarPedido({ id: 't_bd62e5a0', shas: [], publicado: () => true });
  assert.equal(r.estado, 'NO_MEDIDO');
  assert.equal(r.causa, 'SIN_DECLARAR',
    'sin una causa legible, el reporte tiene que distinguirlo comparando prosa');
});

// La direccion que sostiene el sesgo: un NO_MEDIDO por AMBIENTE (no pude fetchear, no pude
// derivar el build vivo) NO es sujeto de este rojo. Confundirlos pondria rojo al carril por
// un SSH caido y trabaria a los quince — el rojo ambiental que esta casa ya prohibio.
test('un pedido que SI declara no es inmedible aunque no se pueda resolver el sha', () => {
  const r = clasificarPedido({ id: 't_x', shas: ['4bff903'], publicado: () => null });
  assert.equal(r.estado, 'VIGENTE');
  assert.equal(inmediblesSinDeclarar({ resultados: [r] }).length, 0);
});

test('inmediblesSinDeclarar junta SOLO a los que no declararon', () => {
  const sinDeclarar = clasificarPedido({ id: 't_1', shas: [], publicado: () => true });
  const vigente = clasificarPedido({ id: 't_2', shas: ['4bff903'], publicado: () => false });
  const entregado = clasificarPedido({ id: 't_3', shas: ['4bff903'], publicado: () => true });
  assert.deepEqual(inmediblesSinDeclarar({ resultados: [sinDeclarar, vigente, entregado] }), ['t_1']);
});

// Y el cableado, que es donde esta familia se escapa: la funcion pura puede estar perfecta y
// el main seguir empujando el caso a `noMedidos`, que sale en verde. Se mide sobre los DOS
// bloques —landing y plataforma— porque los dos llaman a `clasificarPedido` y arreglar uno
// solo deja la clase abierta, que es exactamente como nacio este bug.
test('cableado: los DOS destinos con sha mandan el caso SIN_DECLARAR a inmedibles, no a noMedidos', () => {
  const src = readFileSync(new URL('./pedido_deploy_entregado.mjs', import.meta.url), 'utf8')
    .split('\n').filter((l) => !/^\s*(\/\/|\*|\/\*)/.test(l)).join('\n');
  for (const ancla of ["clasificarPedido({\n        id: p.id", 'clasificarPedido({ id: p.id']) {
    const desde = src.indexOf(ancla);
    assert.ok(desde > 0, `no encontre el bloque que ancla en ${JSON.stringify(ancla)}`);
    const vecindad = src.slice(desde, desde + 700);
    assert.match(vecindad, /causa === 'SIN_DECLARAR'\s*\)\s*inmedibles\.push\(/,
      'el push tiene que colgar de la causa, no de una condicion cualquiera');
  }
});

// El rojo tiene que EXISTIR y cortar. Un `inmedibles.push()` sin su `return 1` deja el
// veredicto en la basura: el gate imprimiria el aviso y saldria 0, que es el estado de hoy.
test('cableado: un pedido inmedible hace salir al gate con codigo 1', () => {
  const src = readFileSync(new URL('./pedido_deploy_entregado.mjs', import.meta.url), 'utf8')
    .split('\n').filter((l) => !/^\s*(\/\/|\*|\/\*)/.test(l)).join('\n');
  const i = src.indexOf('if (inmedibles.length > 0)');
  assert.ok(i > 0, 'el main tiene que tener un control propio para los pedidos inmedibles');
  assert.match(src.slice(i, i + 900), /return 1;/,
    'sin return 1 el control es decorativo: imprime y pasa en verde');
});

// ── el bot: el ultimo destino que salia «sin instrumento» ──────────────────────────────
//
// Hasta el 2026-09-12 `bot` caia en `sinCubrir` y el gate lo DECIA («su artefacto no nombra
// sha ni fecha») — cierto, y a la vez irrelevante: su publicador ya enumera lo que copiaria.
// Mientras tanto el pedido t_e45a24ff pedia publicar el bot porque le esta diciendo precios
// muertos a leads reales, y era el unico de los cuatro que nadie podia juzgar.

/** La salida REAL del publicador en seco del bot, medida el 2026-09-12 contra el VPS. */
const SECO_BOT = [
  '   (el árbol estaba atrasado: lo puse en origin/main 547c91283)',
  '== publicar el bot ==',
  '   desde:   /root/loops/onia-hermes/hermes-content/deploy/vps-ops/bot (idéntico a origin/main 547c91283)',
  '   destino: /opt/onia/bot',
  '',
  '[dry-run] producción NO se toca.',
  '== deploy del bot ==',
  '   repo:   /root/loops/onia-hermes/hermes-content/deploy/vps-ops/bot',
  '   destino: /opt/onia/bot',
  '   modo:   DRY-RUN (agrega --aplicar para desplegar de verdad)',
  '',
  '-- gate: node --test sobre el arbol del repo',
  '   # pass 933 # fail 0 ',
  '',
  '-- diferencias repo -> produccion',
  '   CAMBIA   avisos-vivo.mjs  (57 lineas)',
  '   NUEVO    precios-vivos.mjs',
  '   CAMBIA   knowledge.onia.json  (2 lineas)',
  '   total: 3 archivo(s)',
  '',
  'DRY-RUN: no se toco nada. Para desplegar: /root/.../deploy-bot.sh --aplicar',
  '',
  '[dry-run] hasta acá llegó el simulacro: NO se desplegó nada.',
].join('\n');

test('bot: del dry-run salen los archivos que el ok publicaria, NUEVO y CAMBIA por igual', () => {
  assert.deepEqual(archivosDelDryRunBot(SECO_BOT),
    ['avisos-vivo.mjs', 'precios-vivos.mjs', 'knowledge.onia.json']);
});

// `[]` y `null` NO son lo mismo: el primero es una respuesta real del publicador, el segundo
// es «no llegue a preguntar». Es la misma guarda que ya tiene su gemelo de siat.
test('bot: «nada que desplegar» es al dia ([]), no «no pude medir» (null)', () => {
  const alDia = '-- diferencias repo -> produccion\n   (nada que desplegar: produccion ya coincide con el repo)';
  assert.deepEqual(archivosDelDryRunBot(alDia), []);
});

test('bot: sin salida, o con un formato que no entiendo -> null, nunca []', () => {
  assert.equal(archivosDelDryRunBot(null), null, 'el SSH no contesto');
  assert.equal(archivosDelDryRunBot(''), null, 'salida vacia');
  assert.equal(archivosDelDryRunBot('ERR: no existe el destino (/opt/onia/bot)'), null, 'el publicador fallo');
  assert.equal(
    archivosDelDryRunBot('-- diferencias repo -> produccion\n   CAMBIA   simulate.mjs  (2 lineas)'),
    null,
    'sin el recuento del publicador no puedo saber si vi la lista entera',
  );
});

// EL CASO QUE IMPORTA, y el unico modo en que este lector fallaria EN VERDE: una lista CORTA.
// Si el publicador cambia la forma de una linea (o agrega un tercer verbo junto a NUEVO y
// CAMBIA), el parseo devuelve menos archivos de los que el ok copia — y una lista corta hace
// que `cuerpoCortoArchivos` declare completo un cuerpo que no nombra lo que falta. El propio
// publicador imprime su recuento: si no coincide, me callo.
test('bot: si el recuento del publicador no coincide con lo que parsee -> null', () => {
  const tercerVerbo = [
    '-- diferencias repo -> produccion',
    '   CAMBIA   avisos-vivo.mjs  (57 lineas)',
    '   BORRA    viejo.mjs',
    '   total: 2 archivo(s)',
  ].join('\n');
  assert.equal(archivosDelDryRunBot(tercerVerbo), null,
    'una lista corta declara completo un cuerpo que no nombra lo que falta');
});

// La direccion que decide todo: con las dos vias caidas sale NO MEDIDO, nunca «al dia».
test('bot: con las DOS vias caidas -> null, y de ahi NO_MEDIDO', () => {
  const publicaria = publicariaPorCopia('bot', { local: () => null, remoto: () => null });
  assert.equal(publicaria, null, 'no llegue a preguntar no es una respuesta');
  assert.equal(archivosNombrados({ texto: 'cualquier cosa', publicaria }).estado, 'NO_MEDIDO');
});

// Un destino que no es de esta especie no puede salir `[]`: eso lo declararia al dia.
test('bot: un destino que no esta en la tabla sale null, nunca []', () => {
  assert.equal(publicariaPorCopia('plataforma', { local: () => 'lo que sea', remoto: () => null }), null);
});

// ── el gate que CIERRA la clase, y el motivo por el que esto no se enumera a mano ───────
//
// `siat` se cableo el 2026-09-11 copiando la forma de `plataforma`, y el hermano `bot` —misma
// especie, mismo invariante, la fila de al lado en la MISMA lista blanca— quedo afuera otro
// dia entero. Enumerar los destinos a mano acá seria repetir el defecto: una lista de
// inclusion falla abierto justo en el sujeto nuevo. El universo se DERIVA de la lista blanca
// del ejecutor, que es la que decide que puede publicar el `ok` de Sergio Urcullo.
test('todo destino que el ok sabe ejecutar tiene instrumento en este gate', () => {
  const src = readFileSync(new URL('./pedido_deploy_entregado.mjs', import.meta.url), 'utf8')
    .split('\n').filter((l) => !/^\s*(\/\/|\*|\/\*)/.test(l)).join('\n');
  const porCopia = src.slice(src.indexOf('const DESTINOS_POR_COPIA'));
  // Los dos que NO son por copia se miden por sha (plataforma) y por fecha (landing): tienen
  // su propia rama, nombrada con su literal, y por eso se los excusa por NOMBRE y no por
  // forma — una excusa por patron absolveria al destino nuevo que todavia no existe.
  const conRamaPropia = ['plataforma', 'landing'];
  const sinInstrumento = Object.keys(DESTINOS).filter((d) =>
    !conRamaPropia.includes(d) && !new RegExp(`^\\s*${d}:\\s*\\{`, 'm').test(porCopia));
  assert.deepEqual(sinInstrumento, [],
    `el ok publica estos destinos y este gate no los sabe juzgar: ${sinInstrumento.join(', ')}`);
  // Y la simetrica, que es la que se olvida: las dos excusas por nombre tienen que SEGUIR
  // teniendo su rama. Borrar la de landing dejaria el gate verde con un destino mudo.
  // `plataforma` la nombra por NEGACION (es el que cae despues del cajon de «sin
  // instrumento»), asi que se aceptan las dos comparaciones: lo que se exige es que el main
  // nombre el destino con su literal, no la forma en que lo compara.
  for (const d of conRamaPropia) {
    assert.match(src, new RegExp(`p\\.destino [!=]== '${d}'`),
      `${d} esta excusado de la tabla porque tiene rama propia, y ya no la tiene`);
  }
});

// El veredicto tiene que mandar al publicador del destino que quedo corto. Antes la ruta de
// `siat` estaba escrita a mano en el mensaje: con el bot adentro, eso mandaba al carril del
// bot a correr el publicador del emisor fiscal, que no publica nada suyo.
test('cableado: el comando de cura de un cuerpo corto se DERIVA del destino', () => {
  const src = readFileSync(new URL('./pedido_deploy_entregado.mjs', import.meta.url), 'utf8')
    .split('\n').filter((l) => !/^\s*(\/\/|\*|\/\*)/.test(l)).join('\n');
  const i = src.indexOf('if (cortosSiat.length > 0)');
  assert.ok(i > 0, 'el main tiene que tener un control para los cuerpos cortos por copia');
  const bloque = src.slice(i, i + 900);
  assert.match(bloque, /DESTINOS_POR_COPIA\[c\.destino\]\.seco/,
    'la ruta del publicador sale de la tabla, no de un literal');
  assert.doesNotMatch(bloque, /onia-siat\/_deploy/,
    'una ruta a mano manda al carril equivocado en cuanto hay mas de un destino por copia');

  // Y el CIERRE DE CLASE, que el de arriba dejaba abierto por estar escrito para UN bloque:
  // `cortos` acaba de ganar un segundo destino (`landing`, 2026-09-12) y su remedio seguia
  // citando la ruta de `plataforma` a mano — el mismo defecto, en el bloque de al lado. Medido
  // por mutacion ese dia: con el literal puesto, los 69 casos pasaban en verde.
  //
  // ⚠️ El universo son TODOS los bloques de veredicto, y NO «los que mencionan un publicador»,
  // que fue el primer intento: derivar asi lo apaga solo, porque un bloque deja de nombrar
  // `publicar.sh` EXACTAMENTE cuando se arregla (la ruta se muda a la tabla). Un gate cuyo
  // sujeto sale del universo al curarse firma verde sobre cero sujetos.
  const conRuta = [...src.matchAll(/if \((\w+)\.length > 0\)/g)]
    .map((m) => ({ acc: m[1], bloque: src.slice(m.index, src.indexOf('return 1;', m.index)) }));
  assert.ok(conRuta.length >= 4, `esperaba los bloques de veredicto, derive ${conRuta.length}`);
  for (const { acc, bloque: b } of conRuta) {
    assert.doesNotMatch(b, /\/opt\/[\w.\/-]*publicar\.sh/,
      `el remedio de ${acc} escribe la ruta del publicador a mano: en cuanto el acumulador `
      + `junta mas de un destino, manda al carril a correr el publicador del otro`);
  }
});

// ── el remedio impreso tiene que poder limpiar el rojo ─────────────────────────────────
//
// Medido el 2026-09-12, en la primera corrida del instrumento del bot: el gate dio ROJO
// porque el cuerpo de t_e45a24ff no nombraba 8 de los 10 archivos que su ok publica, y el
// remedio decia «Nombralos comentando el recuento DERIVADO». Ese control lee
// `partirPedido(texto).cuerpo` y NADA MAS — un comentario no lo puede limpiar nunca. O sea
// que el gate mandaba al carril a hacer algo que no funciona, y recien despues («si ya se
// comento y el cuerpo sigue corto») al remedio que si. Una vuelta entera por un texto.
//
// El universo se DERIVA: funciones que parten el pedido y se quedan con el cuerpo ->
// acumulador al que empujan en el main -> bloque que imprime su veredicto. Escribir los tres
// nombres a mano dejaria afuera al cuarto control del dia que se escriba, que es exactamente
// como el hermano `bot` quedo sin instrumento.
test('un control que lee SOLO el cuerpo no manda a comentar', () => {
  const src = readFileSync(new URL('./pedido_deploy_entregado.mjs', import.meta.url), 'utf8')
    .split('\n').filter((l) => !/^\s*(\/\/|\*|\/\*)/.test(l)).join('\n');

  const soloCuerpo = [...src.matchAll(/export function (\w+)\(/g)]
    .map((m) => ({ nombre: m[1], cuerpo: src.slice(m.index, m.index + 400) }))
    .filter((f) => f.cuerpo.includes('partirPedido(') && f.nombre !== 'partirPedido')
    .map((f) => f.nombre);
  assert.ok(soloCuerpo.length >= 3,
    `esperaba al menos los 3 controles de cuerpo, derive ${soloCuerpo.length}: ${soloCuerpo}`);

  const acumuladores = new Set();
  for (const nombre of soloCuerpo) {
    for (const m of src.matchAll(new RegExp(`=\\s*${nombre}\\(\\{`, 'g'))) {
      const vecindad = src.slice(m.index, m.index + 500);
      const push = /(\w+)\.push\(/.exec(vecindad);
      assert.ok(push, `${nombre} se llama y su resultado no empuja a ningun acumulador`);
      acumuladores.add(push[1]);
    }
  }
  assert.ok(acumuladores.size >= 3, `derive ${acumuladores.size} acumuladores: ${[...acumuladores]}`);

  for (const acc of acumuladores) {
    const i = src.indexOf(`if (${acc}.length > 0)`);
    assert.ok(i > 0, `${acc} se llena y nadie imprime su veredicto`);
    const bloque = src.slice(i, src.indexOf('return 1;', i));
    // 🔴 El defecto exacto: la INSTRUCCION de comentar. Hablar de los comentarios para
    // explicar por que el pedido salio VIGENTE si vale («Los comentarios pueden nombrarlos»),
    // y por eso el patron pide el imperativo/gerundio y no la palabra suelta.
    assert.doesNotMatch(bloque, /coment(a|ando)\b/i,
      `el remedio de ${acc} manda a comentar, y comentar no puede limpiar un control que solo lee el cuerpo`);
    // Y la simetrica, que es la que deja el rojo sin salida: sacar el remedio malo no alcanza
    // si no queda el bueno escrito.
    assert.match(bloque, /rehac(e|iendo)/i, `el remedio de ${acc} no dice como se cura`);
  }
});

// Y el CIERRE DE CLASE de los dos de arriba, que hasta hoy no tenia dueno. Los dos anteriores
// preguntan por el remedio y por la ruta; ninguno pregunta si la rama del destino LLAMA a un
// control de cuerpo. Por eso `landing` paso desde el 2026-09-10 con la mitad cruda: preguntaba
// `promesaCompleta({ shas: shasDelTexto(p.texto) })` —cuerpo MAS comentarios— y nada mas,
// mientras sus tres hermanos ya tenian su control de cuerpo al lado, en el mismo archivo.
// Medido el 2026-09-12 sobre t_fd5b30c4: cuerpo con 7 shas, un comentario con los 3 que
// faltaban, veredicto «sigue VIGENTE» y ni un rojo de cuerpo corto. El cuerpo es lo unico que
// Sergio Urcullo lee para decidir, y el comentario no viaja a esa pantalla.
//
// EL SUJETO SE DERIVA DEL DISCO, y la ventana es la RAMA, no el `for`: cada rama del bucle de
// `medirEnVivo` que le pregunte al TEXTO ENTERO (`shasDelTexto(p.texto)`) tiene que preguntarle
// tambien al cuerpo. Partir por `continue;` es lo que lo hace honesto — con la ventana puesta en
// el bucle entero, el `cuerpoCortoArchivos` de la rama de al lado (siat) absolveria a `landing`
// sin tocarla, que es justo la forma en que esta familia de gates falla en verde.
test('toda rama que le pregunta al TEXTO ENTERO le pregunta tambien al cuerpo', () => {
  const src = readFileSync(new URL('./pedido_deploy_entregado.mjs', import.meta.url), 'utf8')
    .split('\n').filter((l) => !/^\s*(\/\/|\*|\/\*)/.test(l)).join('\n');

  // Los controles de cuerpo, derivados igual que en el test de arriba: los que parten el pedido
  // y se quedan con el cuerpo. Escribir los nombres a mano dejaria fuera al proximo.
  const soloCuerpo = [...src.matchAll(/export function (\w+)\(/g)]
    .map((m) => ({ nombre: m[1], cuerpo: src.slice(m.index, m.index + 400) }))
    .filter((f) => f.cuerpo.includes('partirPedido(') && f.nombre !== 'partirPedido')
    .map((f) => f.nombre);
  assert.ok(soloCuerpo.length >= 3, `esperaba los controles de cuerpo, derive ${soloCuerpo}`);

  const desde = src.indexOf('for (const p of pedidos) {\n    if (p.destino === ');
  assert.ok(desde > 0, 'no encontre el bucle que juzga cada pedido');
  const bucle = src.slice(desde, src.indexOf('\n  for (const n of noMedidos)', desde));

  // Una rama termina donde el bucle pasa al pedido siguiente. La ultima no lleva `continue;`
  // (cae por el final), y por eso se queda como ultimo segmento del split.
  const crudas = bucle.split('continue;');
  const sujetos = crudas
    .map((rama, i) => ({ rama, nombre: `rama #${i + 1} del bucle` }))
    .filter(({ rama }) => rama.includes('shasDelTexto(p.texto)'));

  const mudas = sujetos
    .filter(({ rama }) => !soloCuerpo.some((n) => rama.includes(`${n}({`)))
    .map(({ nombre }) => nombre);
  assert.deepEqual(mudas, [],
    `estas ramas juzgan el texto entero (cuerpo + comentarios) y nunca miran el cuerpo solo, `
    + `asi que un comentario les tapa un cuerpo corto: ${mudas.join(', ')}`);

  // 🔴 Y el veredicto tiene que SALIR de la rama. Pedir solo que el control aparezca se
  // satisface con el esquive mas barato que existe —anteponerle `false &&` a la guarda del
  // push—, que deja la llamada y el push intactos en el fuente y tira el resultado a la basura.
  //
  // Y anclar `if (<var>.estado === ...) <algo>.push(` TAMPOCO alcanza, medido hoy: la rama
  // tiene un hermano que absuelve —`else if (k.estado === 'NO_MEDIDO') noMedidos.push(...)`—
  // y con el `false &&` puesto la mutacion volvia a pasar en verde. `noMedidos` se IMPRIME
  // pero no corta: un control cuyo unico push va ahi deja al gate saliendo 0. Por eso el
  // sujeto es el acumulador que CORTA, derivado de los que tienen bloque de veredicto.
  const cortan = new Set([...src.matchAll(/if \((\w+)\.length > 0\)/g)].map((m) => m[1]));
  assert.ok(cortan.size >= 3, `esperaba los acumuladores que cortan, derive ${[...cortan]}`);

  for (const { rama, nombre } of sujetos) {
    for (const n of soloCuerpo) {
      const asignacion = new RegExp(`const (\\w+) = ${n}\\(\\{`).exec(rama);
      if (!asignacion) continue;
      const v = asignacion[1];
      // El estado se deja abierto a proposito: `cuerpoVencido` empuja por 'VENCIDO' y
      // `cuerpoCorto` por 'SUB_DESCRIBE'. Lo que se exige es que ALGUN push de esa variable
      // llegue a un acumulador que hace salir al gate con codigo 1.
      const destinos = [...rama.matchAll(new RegExp(`if \\(\\s*${v}\\.estado === '[A-Z_]+'\\s*\\)\\s*\\{?\\s*(\\w+)\\.push\\(`, 'g'))]
        .map((m) => m[1]);
      assert.ok(destinos.some((acc) => cortan.has(acc)),
        `${nombre} llama a ${n} y su veredicto no llega a ningun acumulador que corte `
        + `(empuja a: ${destinos.join(', ') || 'ninguno'}). El push tiene que colgar directo de `
        + `la comparacion de ${v}.estado, o la rama queda muda con el gate en verde`);
    }
  }

  // El caso que YA cumple, para que el gate no quede tautologico: alguna rama tiene que caer en
  // el universo. Si `shasDelTexto(p.texto)` desaparece del bucle, esto se pone rojo en vez de
  // firmar verde sobre un universo vacio.
  assert.ok(crudas.some((r) => r.includes('shasDelTexto(p.texto)')),
    'ninguna rama pregunta por el texto entero: el universo quedo vacio y el gate no mide nada');
});

// ── un publicador que CONTESTA y sale !=0 no es «no pude preguntar» ────────────────────
//
// Medido el 2026-09-12 desde el nodo de casa, con el unico pedido de deploy vivo (t_053da636,
// siat): `publicar.sh --dry-run` imprimio su recuento entero —«hay que publicar: 2 arreglo(s)»
// con los dos nombres— y despues salio 1, porque hay una corrida de Fase 1 en curso y el
// publicador se niega a pisar codigo bajo un runner vivo. Esa negativa es una condicion
// OPERATIVA del destino, no un fallo de la medicion: el recuento ya estaba dicho.
//
// `sh()` devuelve null ante cualquier status !=0, asi que el gate tiro esa salida entera y
// firmo «NO MEDIDO: no pude correr el publicador en seco (¿SSH al VPS?)» — mandando a
// diagnosticar una red que andaba perfecto. El archivo se documenta a si mismo diciendo que
// `null` significa «no llegue a preguntar»; con exit!=0 violaba su propio contrato.
//
// La distincion que se prueba: corrio y dijo algo -> se lee; no se pudo ejecutar -> null.
test('siat: un publicador que imprime su recuento y sale 1 SE LEE, no es NO MEDIDO', () => {
  const guion = `${tmpdir()}/zz-qa-pedido-${process.pid}-${Date.now()}.sh`;
  writeFileSync(guion, [
    '#!/bin/sh',
    'echo "hay que publicar: 2 arreglo(s) que el emisor del VPS no tiene"',
    'echo "Cambia:"',
    'echo "   test/fase1-runner.test.mjs"',
    'echo "   run-fase1-volumen.sh"',
    'echo ""',
    'echo "ERR: hay una corrida de Fase 1 EN CURSO. No se pisa el codigo bajo un runner vivo"',
    'exit 1',
  ].join('\n') + '\n', { mode: 0o755 });
  try {
    const salida = secoDeProduccion(guion);
    assert.ok(salida !== null, 'un publicador que ya imprimio su recuento no es «no llegue a preguntar»');
    assert.deepEqual(archivosDelDryRun(salida), ['test/fase1-runner.test.mjs', 'run-fase1-volumen.sh']);
  } finally {
    rmSync(guion, { force: true });
  }
});

// La simetrica, que es la que sostiene el tri-estado: si NO se pudo ejecutar, sigue siendo
// null. Sin este caso, «devolver siempre la stdout» pasaria el test de arriba convirtiendo
// todo fallo en `''`, que se lee como «el publicador no dijo nada» = una respuesta.
test('siat: un publicador que NO existe sigue siendo null (no medido)', () => {
  assert.equal(secoDeProduccion(`${tmpdir()}/zz-qa-no-existe-${process.pid}.sh`), null);
});

// Y la linea `ERR:` no es un archivo aunque el publicador no deje la linea en blanco de por
// medio: los archivos vienen SANGRADOS y los mensajes arrancan en la columna 0. Sin este
// corte, el gate le exige al pedido que nombre «ERR: hay una corrida de Fase 1 EN CURSO».
test('siat: un mensaje pegado a la lista no se cuenta como archivo', () => {
  const salida = ['hay que publicar: 1 arreglo(s)', 'Cambia:', '   run-fase1-pdv1.sh',
    'ERR: hay una corrida de Fase 1 EN CURSO. No se pisa el codigo bajo un runner vivo'].join('\n');
  assert.deepEqual(archivosDelDryRun(salida), ['run-fase1-pdv1.sh']);
});

// ── ¿el ok EJECUTA lo que el cuerpo promete? ───────────────────────────────────────────
//
// Estan en ESTA cadena, y no solo en el --self-check, por el motivo de arriba: es la que
// corre el integrador antes de tocar `main`.
//
// Medido el 2026-09-12 sobre el pedido de la plataforma (t_60c884c6, archivado). El metodo
// vigente EXIGE citar textual el recuento del publicador, que dice "hay que publicar: N
// arreglo(s)". Al envolver el parrafo, "publicar:" cae al principio de un renglon, el filtro
// /^PUBLICAR:/i del brazo lo lee como una orden de publicar una PIEZA, y el deploy nunca se
// intenta: sale "la linea PUBLICAR: no trae cuenta, imagenes, texto" y no publica nada.
// Nadie escribio esa linea a proposito — alcanzo con obedecer el metodo y que el wrap
// cayera mal.
//
// El resto del gate lee el CUERPO; este le pregunta al BRAZO con la misma funcion que corre
// cuando Sergio Urcullo aprieta el boton. Por eso un modo de falla nuevo nace cazado, y por
// eso este caso se pone rojo si alguien revierte `elegirCamino`.
test('ejecuta: una cita "publicar:" envuelta no puede dejar mudo al ok', () => {
  const cuerpo = 'Pedido de deploy.\n\nRecuento citado: hay que\npublicar: 3 arreglo(s)\n\nDESPLEGAR: plataforma';
  assert.equal(cuerpoNoEjecuta({ texto: cuerpo }).estado, 'DESPLIEGA');
});

// El caso que YA cumple. Sin el, un detector que diga SIEMPRE «despliega» pasa el de arriba
// por el motivo equivocado y el control queda mudo.
test('ejecuta: el caso que YA cumple: un DESPLEGAR: limpio despliega', () => {
  assert.equal(cuerpoNoEjecuta({ texto: 'Pedido.\n\nDESPLEGAR: landing' }).estado, 'DESPLIEGA');
});

// Y la direccion que el control existe para cazar: que el brazo elija OTRA cosa.
test('ejecuta: si el brazo publica una pieza en vez de desplegar, es NO_EJECUTA', () => {
  const r = cuerpoNoEjecuta({ texto: 'DESPLEGAR: landing', elegir: () => ({ modo: 'pieza', pieza: {} }) });
  assert.equal(r.estado, 'NO_EJECUTA');
});

test('ejecuta: si el brazo se cae leyendo el cuerpo, es NO_EJECUTA y dice por que', () => {
  const r = cuerpoNoEjecuta({ texto: 'DESPLEGAR: landing', elegir: () => { throw new Error('x roto'); } });
  assert.equal(r.estado, 'NO_EJECUTA');
  assert.match(r.motivo, /x roto/);
});

// Sujeto: un pedido que no pide deploy no es asunto de este control.
test('ejecuta: un cuerpo sin DESPLEGAR: no es sujeto', () => {
  const pieza = 'PUBLICAR: cuenta=lucia imagenes=/tmp/a.png texto=/tmp/b.json';
  assert.equal(cuerpoNoEjecuta({ texto: pieza }).estado, 'SIN_ORDEN');
});

// ── ningun pedido queda mudo por culpa de otro ─────────────────────────────────────────
//
// 🔴 Medido el 2026-09-12, tres corridas seguidas de `npm run pedido:entregado`:
//   corrida 1: OK siat / OK bot / OK landing / OK plataforma
//   corrida 2: OK siat / OK landing / ROJO plataforma   <- el BOT no sale ni OK ni rojo
//   corrida 3: OK siat / ROJO landing                   <- sigue sin aparecer el bot
// La cadena de `imprimirCadena` corria UNA sola vez para TODOS los pedidos, asi que el
// `return 1` del primer bloque con contenido se llevaba puesto a los pedidos de los OTROS
// destinos. El del bot (t_2baef483) quedo blocked pidiendole un ok a Sergio Urcullo por
// trabajo YA publicado y el gate no lo dijo — que es justo el modo de falla que caza.
//
// Tapar el segundo control DEL MISMO pedido es el diseno (se cura el de arriba y en la
// corrida siguiente aparece el de abajo); tapar un pedido ENTERO de otro destino es el bug.
// ⚠️ El `correr` NO puede ser un espia propio que recorra todas las listas: con esa copia
// benevola la mutacion «corre una sola vez con todo» pasaba en VERDE, medido hoy. Lo que
// produce el tapado es el `return` del primer control, asi que el sujeto tiene que ser
// `imprimirCadena`, que es la que lo tiene.
test('dos pedidos en rojo por controles distintos: los DOS se imprimen', () => {
  const { texto, corta } = correrCadena({
    ids: ['t_plataforma', 't_bot'],
    entregados: [{ id: 't_plataforma' }],
    entregadosSiat: [{ id: 't_bot', destino: 'bot' }],
  });
  assert.match(texto, /ROJO t_plataforma/);
  assert.match(texto, /ROJO t_bot/,
    'un pedido de otro destino quedo invisible: ni OK ni rojo, que es como sobrevivio el bug');
  assert.equal(corta, 1);
});

// El caso que YA cumple, para que el de arriba no pase por el motivo equivocado: con un solo
// pedido la cadena sigue siendo UNA, y el rojo de mayor prioridad tapa al de abajo A PROPOSITO.
test('un pedido con dos rojos sigue imprimiendo SOLO el mas caro', () => {
  const { texto } = correrCadena({
    ids: ['t_uno'],
    entregados: [{ id: 't_uno' }],
    cortos: [{ id: 't_uno', destino: 'plataforma', mudos: [{ sha: 'abc1234', titulo: 'x' }] }],
  });
  assert.match(texto, /ya esta publicado/);
  assert.doesNotMatch(texto, /no nombra 1 arreglo/);
});

// Y la direccion sana: sin rojos no corta, o el gate da rojo siempre y se termina apagando.
test('sin rojos, la cadena por pedido no corta', () => {
  assert.equal(cadenaPorPedido({
    ids: ['t_uno', 't_dos'],
    acumuladores: { entregados: [], cortos: [] },
    correr: () => 0,
  }), 0);
});

// Cableado: el defecto vuelve entero si alguien le pasa los acumuladores CRUDOS a la cadena.
// El sujeto se deriva del fuente: toda llamada a `imprimirCadena(` que no sea su declaracion
// tiene que colgar del `correr:` de `cadenaPorPedido`.
test('cableado: el main corre la cadena POR PEDIDO, no una vez con todo', () => {
  const src = readFileSync(new URL('./pedido_deploy_entregado.mjs', import.meta.url), 'utf8')
    .split('\n').filter((l) => !/^\s*(\/\/|\*|\/\*)/.test(l)).join('\n');
  const llamadas = [...src.matchAll(/(.{0,40})imprimirCadena\(/g)]
    .map((m) => m[1])
    .filter((antes) => !/export function $/.test(antes));
  assert.ok(llamadas.length > 0, 'nadie llama a la cadena: el gate no imprime ningun rojo');
  for (const antes of llamadas) {
    assert.match(antes, /correr:\s*\([\w\s,{}]*\)\s*=>\s*$/,
      'una llamada a imprimirCadena fuera del correr: de cadenaPorPedido vuelve a tapar '
      + 'los pedidos de los otros destinos');
  }
  assert.match(src, /cadenaPorPedido\(\{/, 'el main tiene que repartir la cadena por pedido');
});

// ── el sha que justifica un rojo es el del DESTINO del pedido ──────────────────────────
//
// 🔴 Medido el 2026-09-12 (t_da62bade): el rojo de la landing `t_a840b237` imprimio
// «produccion corre a888b5b», que es el sha de onia-platform; la landing corria bd90e8af2
// (`/opt/onia-landing/runtime-next/.commit`). El VEREDICTO era correcto — lo que estaba mal
// era el sha que lo justifica, y es de OTRO sistema: el que lo lea va a verificar contra el
// repo equivocado, donde ese sha ni siquiera existe. `entregados` recibe pedidos de los DOS
// destinos (ramas `landing` y `plataforma` del main) y los dos se imprimian con el de
// plataforma, porque `vivo` era UNA constante derivada de `shaVivoPlataforma()`.
test('el rojo de un pedido de landing se justifica con el sha vivo de LA LANDING', () => {
  const { texto } = correrCadena({
    ids: ['t_landing'],
    entregados: [{ id: 't_landing', destino: 'landing' }],
  });
  assert.match(texto, /bd90e8a/,
    'el rojo de landing tiene que citar el build que sirve onia.com.bo');
  assert.doesNotMatch(texto, /a888b5b/,
    'justifico el rojo de la landing con el sha de la PLATAFORMA: manda a verificar contra '
    + 'el repo equivocado, donde ese sha no existe');
});

// El caso que YA cumple, para que el de arriba no pase por el motivo equivocado.
test('el rojo de un pedido de plataforma sigue citando el sha de la plataforma', () => {
  const { texto } = correrCadena({
    ids: ['t_plataforma'],
    entregados: [{ id: 't_plataforma', destino: 'plataforma' }],
  });
  assert.match(texto, /a888b5b/);
  assert.doesNotMatch(texto, /bd90e8a/);
});

// Y la direccion que no puede fallar abierto: sin sha del destino NO se inventa uno ni se
// cae al del vecino. El veredicto se sigue imprimiendo —es correcto— pero sin cita falsa.
test('sin sha vivo del destino, el rojo no cita el del otro sistema', () => {
  const { texto } = correrCadena({
    ids: ['t_landing'],
    entregados: [{ id: 't_landing', destino: 'landing' }],
    vivoPorDestino: { plataforma: 'a888b5b', landing: null },
  });
  assert.match(texto, /ROJO t_landing/, 'el veredicto sigue siendo correcto: se imprime igual');
  assert.doesNotMatch(texto, /a888b5b/,
    'sin poder leer el build de la landing cayo al de la plataforma: una cita inventada');
});

// Cableado: los casos de arriba le pasan `vivoPorDestino` a mano, asi que NO pueden ver de
// donde lo saca el main. El esquive barato es `landing: vivo` —una linea, sin tocar nada mas—
// y con el vuelve el bug entero en verde. El sujeto es la CLAVE, no la mencion del helper:
// nombrar a `shaVivoLanding` en cualquier otro lado del archivo no alcanza.
// ⚠️ El ancla era `/landing:\s*(.*)/` sobre el fuente con los comentarios sacados, y eso lo
// acusaba una PROSA cualquiera que dijera «landing: … vivo …» (paso el 2026-09-18 con el texto
// del aviso del `.commit`: el producto intacto y el gate rojo). Ahora se miden las CADENAS en
// blanco ademas de los comentarios —una prosa no puede acusar ni absolver— y el valor de la
// clave se sigue hasta su asignacion, porque la derivacion legitima hoy son dos lineas.
test('cableado: el sha de landing sale de shaVivoLanding, no del de plataforma', () => {
  const src = readFileSync(new URL('./pedido_deploy_entregado.mjs', import.meta.url), 'utf8')
    .split('\n').filter((l) => !/^\s*(\/\/|\*|\/\*)/.test(l)).join('\n')
    .replace(/'(?:[^'\\\n]|\\.)*'|`(?:[^`\\]|\\.)*`/g, "''");
  // El sujeto es la clave `landing` DE `vivoPorDestino`, nombrada: el archivo tiene otros mapas
  // con esa misma clave (los publicadores en seco) y quedarse con «la primera del archivo»
  // juzga al vecino — la trampa de atribuir por cercania que esta cola ya tiene escrita.
  const obj = (src.match(/vivoPorDestino\s*=\s*\{([^}]*)\}/) ?? [])[1];
  assert.ok(obj, 'no encontre la definicion de vivoPorDestino: sin ella no se puede juzgar la cita');
  const valor = (obj.match(/landing:\s*([^,;}\n]*)/) ?? [])[1]?.trim();
  assert.ok(valor, 'nadie deriva el sha vivo de la landing');

  // `shaVivoLanding()` en la clave, o una variable cuya asignacion lo llame. Lo que NO vale es
  // el esquive barato de una linea —`landing: vivo`— que devuelve el sha de la PLATAFORMA.
  const directo = /shaVivoLanding\(/.test(valor);
  const porVariable = /^[A-Za-z_$][\w$]*$/.test(valor)
    && new RegExp(`\\b(?:const|let|var)\\s+${valor}\\s*=[^;]*shaVivoLanding\\(`).test(src);
  assert.ok(directo || porVariable,
    `la clave landing se deriva de otra cosa (${valor}): si sale del sha de plataforma, `
    + 'el rojo de la landing vuelve a citar el repo equivocado');
});

// La otra mitad del mismo cableado, y la que hace UTIL al tri-estado: a quien se le pregunta.
// Hasta el 2026-09-18 el sha de la landing se pedia solo si su pedido estaba ENTREGADO —el
// unico camino que imprime cita—, asi que en el caso normal (un pedido VIGENTE, que es casi
// toda corrida) nadie preguntaba, y un runtime sin `.commit` no lo notaba nadie. Acotarlo de
// nuevo a `entregados` es una sola palabra y deja el tri-estado entero en verde.
test('cableado: al runtime de la landing se le pregunta por TODO pedido suyo, no solo por los entregados', () => {
  const src = readFileSync(new URL('./pedido_deploy_entregado.mjs', import.meta.url), 'utf8')
    .split('\n').filter((l) => !/^\s*(\/\/|\*|\/\*)/.test(l)).join('\n');
  const condicion = (src.match(/=\s*([^\n?]*)\?\s*shaVivoLanding\(/) ?? [])[1]?.trim();
  assert.ok(condicion, 'nadie decide cuando preguntarle al runtime de la landing');
  assert.match(condicion, /\bpedidos\b/,
    `se le pregunta bajo "${condicion}": el universo son los PEDIDOS de landing, no un subconjunto`);
  assert.doesNotMatch(condicion, /\bentregados\b/,
    'acotarlo a los entregados deja la ausencia del .commit invisible en el caso normal');
});

/** Corre la cadena REAL capturando lo que imprime. Los acumuladores que el caso no nombra van
 *  vacios, igual que en el main. */
function correrCadena({ ids, vivoPorDestino, ...listas }) {
  const dicho = [];
  const orig = console.log;
  console.log = (...a) => dicho.push(a.join(' '));
  try {
    const corta = cadenaPorPedido({
      ids,
      acumuladores: {
        entregados: [], entregadosSiat: [], mudos: [], punteros: [], cortosSiat: [],
        incompletos: [], vencidos: [], cortos: [], inmedibles: [], ...listas,
      },
      correr: (propios) => imprimirCadena({
        ...propios,
        vivoPorDestino: vivoPorDestino ?? { plataforma: 'a888b5b', landing: 'bd90e8a' },
      }),
    });
    return { texto: dicho.join('\n'), corta };
  } finally {
    console.log = orig;
  }
}

// ── un remedio no manda a comentar si hay un control de CUERPO esperando debajo ───────────
//
// 🔴 La misma clase que `67f22b71` cerro el 2026-09-12, y el cierre quedo corto: aquel gate
// deriva su universo de los controles que LEEN solo el cuerpo, y `incompletos` no es uno —
// pregunta con `promesaCompleta`, que lee cuerpo MAS comentarios. Por eso quedo afuera, y su
// remedio siguio diciendo «Comenta el recuento DERIVADO (no rehagas la tarea)».
//
// Lo pague hoy, 2026-09-13, integrando dos carriles: mergee DESPUES de que existiera el pedido
// de plataforma, el gate dio ROJO por `incompletos`, y obedecer ese texto habria limpiado ese
// rojo y destapado `cortos` —que esta 23 lineas mas abajo en la misma cadena y lee
// `partirPedido(texto).cuerpo` y NADA MAS—, con el remedio contrario escrito al lado. Una
// vuelta entera para llegar a la cura que ya estaba impresa dos bloques despues.
//
// LA PROPIEDAD NO ES «este control lee el cuerpo», que es la que derivaba el gate anterior:
// es «este control tiene DEBAJO otro que lee solo el cuerpo». Comentar limpia al de arriba y
// destapa al de abajo SIEMPRE, porque el comentario absuelve a quien lee cuerpo+comentarios y
// es invisible para quien lee el cuerpo solo. El sujeto se deriva del disco — el orden real de
// la cadena y que acumuladores son de cuerpo—, asi que el control numero once lo hereda.
//
// Se exige solo el NO-comentar, no el «rehace»: `entregados` y `entregadosSiat` tambien tienen
// controles de cuerpo debajo y su cura legitima es cerrar o archivar la tarea, no rehacerla.
// Exigirles la palabra los pondria rojos por un remedio que esta bien.
test('un control con un control de CUERPO debajo no manda a comentar', () => {
  const src = readFileSync(new URL('./pedido_deploy_entregado.mjs', import.meta.url), 'utf8')
    .split('\n').filter((l) => !/^\s*(\/\/|\*|\/\*)/.test(l)).join('\n');

  // Los controles de cuerpo, derivados igual que sus dos hermanos: los que parten el pedido y
  // se quedan con el cuerpo. Escribir los nombres a mano dejaria fuera al proximo.
  const soloCuerpo = [...src.matchAll(/export function (\w+)\(/g)]
    .map((m) => ({ nombre: m[1], cuerpo: src.slice(m.index, m.index + 400) }))
    .filter((f) => f.cuerpo.includes('partirPedido(') && f.nombre !== 'partirPedido')
    .map((f) => f.nombre);
  assert.ok(soloCuerpo.length >= 3, `esperaba los controles de cuerpo, derive ${soloCuerpo}`);

  // A que acumulador empuja cada uno. Es lo que ata «lee solo el cuerpo» con «corta en la
  // cadena»: sin esto el test compararia nombres de funcion contra nombres de acumulador.
  const deCuerpo = new Set();
  for (const nombre of soloCuerpo) {
    for (const m of src.matchAll(new RegExp(`=\\s*${nombre}\\(\\{`, 'g'))) {
      const push = /(\w+)\.push\(/.exec(src.slice(m.index, m.index + 500));
      assert.ok(push, `${nombre} se llama y su resultado no empuja a ningun acumulador`);
      deCuerpo.add(push[1]);
    }
  }
  assert.ok(deCuerpo.size >= 3, `derive ${deCuerpo.size} acumuladores de cuerpo: ${[...deCuerpo]}`);

  // El ORDEN de la cadena sale del archivo, no de una lista: es lo que decide quien tapa a
  // quien. `imprimirCadena` corta en el primero que tenga sujetos, asi que «debajo» es
  // literalmente «mas adelante en el fuente».
  const cadena = [...src.matchAll(/if \((\w+)\.length > 0\)/g)]
    .map((m) => ({ nombre: m[1], i: m.index }));
  assert.ok(cadena.length >= 8, `esperaba la cadena entera, derive ${cadena.length} controles`);
  assert.ok(cadena.some(({ nombre }) => deCuerpo.has(nombre)),
    'ningun acumulador de cuerpo corta en la cadena: el universo quedo vacio y el gate se apago solo');

  const tapados = cadena.filter(({ nombre, i }) => cadena
    .some((o) => o.i > i && deCuerpo.has(o.nombre) && o.nombre !== nombre));
  assert.ok(tapados.length > 0,
    'ningun control tiene un control de cuerpo debajo: el gate no esta mirando nada');

  for (const { nombre, i } of tapados) {
    const fin = src.indexOf('return 1;', i);
    assert.ok(fin > i, `${nombre} imprime su veredicto y nunca corta`);
    const bloque = src.slice(i, fin);
    // Mismo patron que el gate hermano: la INSTRUCCION de comentar, no la palabra suelta.
    // Explicar por que el pedido salio VIGENTE nombrando los comentarios sigue valiendo.
    assert.doesNotMatch(bloque, /coment(a|ando)\b/i,
      `el remedio de ${nombre} manda a comentar, y debajo suyo en la cadena hay un control que `
      + `lee SOLO el cuerpo: comentar limpia este rojo y destapa aquel, con el remedio contrario. `
      + `Se cura rehaciendo el pedido y archivando el viejo en la misma vuelta.`);
  }
});

// ── lo que el `ok` de la landing publicaria: ANCESTRIA, no fecha ───────────────────────────
//
// 🔴 Medido el 2026-09-18 con el pedido t_afd816af vivo: `publicariaLanding` devolvia VACIO
// mientras `bash /opt/onia-landing/_deploy/publicar.sh --dry-run` —el que de verdad publica—
// decia «hay que publicar: 1 arreglo(s)». Con la lista vacia, los DOS controles que verifican
// que el cuerpo del pedido describa lo que el `ok` publica (`promesaCompleta` y `cuerpoCorto`)
// salen NO_MEDIDO, y NO_MEDIDO no se pone rojo NUNCA: queda apagado justo el control que
// impide que Sergio Urcullo apruebe codigo que el pedido no le mostro.
//
// La causa es la misma que `deploy-vivo.mjs` ya cerro el 2026-09-17 y que no viajo a este
// hermano: filtrar por FECHA (`ct > epochBuild`) junto con `--no-merges`. Un commit de rama de
// carril tiene fecha ANTERIOR al merge que lo trae, asi que queda fuera por viejo — y el merge
// que lo hace visible queda fuera por merge. El sujeto se pierde para siempre, en verde.
//
// La pregunta correcta no es «que hay mas nuevo que el build» sino «que tiene main que el build
// no contiene». La fecha se usa UNA vez, para elegir el punto de `--first-parent` por el que el
// build paso (`baseDelBuild`), y de ahi manda el grafo.
test('un arreglo que entra a main por un merge posterior al build NO se pierde', () => {
  //  base ── merge(POSTERIOR al build) ── main
  //      \── arreglo(ANTERIOR al build) ─┘
  const BUILD_S = Math.floor(Date.parse('2026-09-18T21:06:00Z') / 1000);
  const FECHA_BASE = '2026-09-18T18:00:00Z';
  const FECHA_ARREGLO = '2026-09-18T20:55:10Z'; // ANTERIOR al build
  const FECHA_MERGE = '2026-09-18T21:37:43Z'; //  POSTERIOR al build

  // Siembra su propio sujeto y lo borra en el `finally`: un sujeto prestado del repo real deja
  // de calificar el dia que alguien mergea, o muere en rojo acusando al producto.
  const raiz = mkdtempSync(join(tmpdir(), 'pedido-ancestria-'));
  const git = (args, fecha) => {
    const r = spawnSync('git', args, {
      cwd: raiz,
      encoding: 'utf8',
      env: fecha ? { ...process.env, GIT_AUTHOR_DATE: fecha, GIT_COMMITTER_DATE: fecha } : process.env,
    });
    // Sembrar es PREPARAR: si el escenario no se armo, el caso no puede concluir — se rompe
    // aca, no se convierte en un rojo contra el producto.
    if (r.status !== 0) throw new Error(`no pude sembrar (git ${args.join(' ')}): ${r.stderr}`);
    return r.stdout.trim();
  };
  const escribir = (rel, texto) => {
    mkdirSync(dirname(join(raiz, rel)), { recursive: true });
    writeFileSync(join(raiz, rel), texto);
  };

  try {
    git(['init', '--quiet', '--initial-branch=main']);
    git(['config', 'user.email', 'gate@onia.test']);
    git(['config', 'user.name', 'gate']);
    git(['config', 'commit.gpgsign', 'false']);

    escribir('README.md', 'base\n');
    git(['add', '-A']);
    git(['commit', '--quiet', '-m', 'base'], FECHA_BASE);

    git(['checkout', '--quiet', '-b', 'claude/carril']);
    // Un archivo que SI llega al cliente: si no, `soloLosQueViajan` lo descarta y el caso
    // pasaria por el motivo equivocado.
    escribir('web-factory/apps/onia-platform/src/app/(sitio)/page.tsx', 'export default () => null\n');
    git(['add', '-A']);
    git(['commit', '--quiet', '-m', 'fix(venta): el arreglo que el pedido tiene que nombrar'], FECHA_ARREGLO);

    git(['checkout', '--quiet', 'main']);
    git(['merge', '--quiet', '--no-ff', 'claude/carril', '-m', 'Merge carril'], FECHA_MERGE);

    const r = publicariaLanding(BUILD_S, { cwd: raiz, ref: 'main' });

    assert.notEqual(r, null, 'no pude medir el repo sembrado');
    assert.equal(r.length, 1,
      'el arreglo entro a main por un merge POSTERIOR al build y su propio commit es ANTERIOR: '
      + 'filtrar por fecha lo descarta por viejo y --no-merges descarta al merge que lo trae, '
      + 'asi que el ok publicaria un commit que el pedido no le nombro a nadie y los controles '
      + 'de completitud salen NO_MEDIDO en vez de rojo');
    assert.match(r[0].titulo, /el arreglo que el pedido tiene que nombrar/);
  } finally {
    rmSync(raiz, { recursive: true, force: true });
  }
});

// ── el .commit del runtime vivo de la landing: ausente NO es lo mismo que no medido ──────
//
// Nace del 2026-09-18: `/opt/onia-landing/runtime-next/` quedo SIN `.commit` (los respaldos y
// los builds armados si lo tienen), asi que «que corre onia.com.bo» volvio a ser a mano — que
// es exactamente lo que su propio publicador dice haber curado el 2026-09-03. La ausencia era
// MUDA porque `shaVivoLanding` degradaba a `null` igual que un SSH caido.
import { clasificarShaVivo, avisoDelCommitAusente, citaDelVivo, guionDelCommit, SIN_COMMIT } from './pedido_deploy_entregado.mjs';

// El caso que YA cumple. Sin el, «devolver siempre SIN_COMMIT» pasa verde y el gate avisa
// todos los dias sobre un runtime sano, que es como se apaga un aviso: por ruido.
test('el .commit esta y trae un sha -> MEDIDO, y se puede citar', () => {
  const r = clasificarShaVivo('bd90e8af2\n');
  assert.equal(r.estado, 'MEDIDO');
  assert.equal(r.sha, 'bd90e8af2');
  assert.equal(citaDelVivo('landing', { landing: r }), ' (produccion corre bd90e8af2)');
});

test('pregunte y el runtime NO lo tiene -> SIN_COMMIT, no NO_MEDIDO', () => {
  const r = clasificarShaVivo(SIN_COMMIT);
  assert.equal(r.estado, 'SIN_COMMIT',
    'aplanar la ausencia en NO_MEDIDO es el bug: el remedio de uno es mirar el acceso y el del '
    + 'otro mirar el stage que se publico, y son opuestos');
  assert.equal(r.sha, null);
});

test('no pude preguntar -> NO_MEDIDO, y su motivo NO es el de la ausencia', () => {
  const mudo = clasificarShaVivo(null);
  assert.equal(mudo.estado, 'NO_MEDIDO');
  assert.notEqual(mudo.motivo, clasificarShaVivo(SIN_COMMIT).motivo,
    'los dos null se distinguen por el MOTIVO: si dicen lo mismo, el tri-estado es decorativo');
});

test('una respuesta que no es un sha no se cita nunca', () => {
  const r = clasificarShaVivo('bash: cat: command not found');
  assert.equal(r.estado, 'NO_MEDIDO');
  assert.equal(citaDelVivo('landing', { landing: r }), '',
    'una cita inventada manda a verificar contra un commit que no existe');
});

test('el aviso habla SOLO cuando el runtime esta sin .commit', () => {
  assert.equal(avisoDelCommitAusente(clasificarShaVivo('bd90e8af2')), null);
  assert.equal(avisoDelCommitAusente(clasificarShaVivo(null)), null,
    'un SSH caido no es un runtime sin .commit: avisarlo ahi manda a mirar el stage equivocado');
  assert.match(String(avisoDelCommitAusente(clasificarShaVivo(SIN_COMMIT))), /SIN \.commit/);
});

test('la cita de la plataforma (sha pelado) sigue andando con la forma nueva', () => {
  assert.equal(citaDelVivo('plataforma', { plataforma: 'a888b5b', landing: null }),
    ' (produccion corre a888b5b)');
  assert.equal(citaDelVivo('landing', { plataforma: 'a888b5b', landing: null }), '',
    'sin dato del destino la cita se OMITE: no se cae a la del vecino');
});

// Lo que ningun caso puro ve: que el LECTOR distinga de verdad. Un `cat` a secas falla igual
// con el archivo ausente y con el SSH caido, asi que la distincion vive en el guion — y un
// guion se prueba corriendolo en un shell de verdad, no leyendolo.
test('el guion distingue en un shell de verdad: con archivo y sin archivo', () => {
  const raiz = mkdtempSync(join(tmpdir(), 'commit-landing-'));
  try {
    const ruta = join(raiz, '.commit');
    const correr = () => spawnSync('bash', ['-lc', guionDelCommit(ruta)], { encoding: 'utf8' });

    const ausente = correr();
    assert.equal(ausente.status, 0, 'el shell tiene que CONTESTAR, no fallar: fallar es "no pude preguntar"');
    assert.equal(clasificarShaVivo(ausente.stdout).estado, 'SIN_COMMIT');

    writeFileSync(ruta, 'bd90e8af2\n');
    assert.equal(clasificarShaVivo(correr().stdout).estado, 'MEDIDO');
  } finally {
    rmSync(raiz, { recursive: true, force: true });
  }
});
