#!/usr/bin/env node
/**
 * Casos PUROS de pedido_deploy_entregado.mjs. No tocan git, ni el tablero, ni produccion:
 * por eso pueden vivir en la cadena `npm test` que el integrador corre antes de mergear.
 * La medicion VIVA va aparte (`npm run pedido:entregado`), porque necesita el repo hermano
 * y produccion, y un gate que exige eso pone rojo por AMBIENTE y traba a los quince carriles.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { clasificarPedido, shasDelTexto, shasPrometidos } from './pedido_deploy_entregado.mjs';

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
