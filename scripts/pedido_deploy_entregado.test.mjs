#!/usr/bin/env node
/**
 * Casos PUROS de pedido_deploy_entregado.mjs. No tocan git, ni el tablero, ni produccion:
 * por eso pueden vivir en la cadena `npm test` que el integrador corre antes de mergear.
 * La medicion VIVA va aparte (`npm run pedido:entregado`), porque necesita el repo hermano
 * y produccion, y un gate que exige eso pone rojo por AMBIENTE y traba a los quince carriles.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { barrerPedidos, buildQueCorre, clasificarPedido, shasDelTexto, shasPrometidos, soloLosQueViajan } from './pedido_deploy_entregado.mjs';

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
