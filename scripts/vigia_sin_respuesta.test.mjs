// Casos del vigia del desconocido colgado. Sin docker, sin red, sin Telegram: todo lo que
// decide vive en funciones puras y se prueba aca.
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  seleccionarColgados,
  nuevosParaAvisar,
  armarEstado,
  armarAviso,
  UMBRAL_MS,
} from './vigia_sin_respuesta.mjs';

const AHORA = Date.parse('2026-09-03T12:00:00Z');
const haceMin = (m) => AHORA - m * 60000;

/** Una fila como sale del psql de Chatwoot, con lo minimo para el caso. */
function fila(over = {}) {
  return {
    conversationId: 100,
    messageId: 1,
    messageType: 0,
    createdAtMs: haceMin(120),
    private: false,
    inboxId: 4,
    content: 'hola',
    contacto: 'Juan Perez',
    telefono: '+59170000000',
    botStage: 'nuevo',
    ...over,
  };
}

test('un entrante viejo sin ningun saliente despues queda colgado', () => {
  const colgados = seleccionarColgados([fila()], { ahoraMs: AHORA });
  assert.equal(colgados.length, 1);
  assert.equal(colgados[0].conversationId, 100);
});

test('si hay un saliente POSTERIOR no esta colgado', () => {
  const filas = [fila(), fila({ messageId: 2, messageType: 1, createdAtMs: haceMin(119) })];
  assert.deepEqual(seleccionarColgados(filas, { ahoraMs: AHORA }), []);
});

test('un saliente ANTERIOR no salva al entrante: es justo el caso del mensaje perdido', () => {
  const filas = [fila({ messageId: 1, messageType: 1, createdAtMs: haceMin(130) }), fila({ messageId: 2 })];
  const colgados = seleccionarColgados(filas, { ahoraMs: AHORA });
  assert.equal(colgados.length, 1);
  assert.equal(colgados[0].messageId, 2);
});

test('recien llegado no cuenta: el webhook todavia lo puede estar contestando', () => {
  assert.deepEqual(seleccionarColgados([fila({ createdAtMs: AHORA - 60000 })], { ahoraMs: AHORA }), []);
  assert.equal(UMBRAL_MS > 60000, true);
});

test('la actividad del sistema (message_type 2) NO tapa a un entrante', () => {
  // "marked resolved" es un evento de Chatwoot, no una respuesta a la persona.
  const filas = [fila(), fila({ messageId: 2, messageType: 2, createdAtMs: haceMin(10) })];
  assert.equal(seleccionarColgados(filas, { ahoraMs: AHORA }).length, 1);
});

test('una nota privada del agente tampoco cuenta como respuesta', () => {
  const filas = [fila(), fila({ messageId: 2, messageType: 1, private: true, createdAtMs: haceMin(10) })];
  assert.equal(seleccionarColgados(filas, { ahoraMs: AHORA }).length, 1);
});

test('la sonda NO es un desconocido — si no, el vigia se avisa a si mismo cada hora', () => {
  assert.deepEqual(seleccionarColgados([fila({ contacto: 'Sonda QA' })], { ahoraMs: AHORA }), []);
  assert.deepEqual(seleccionarColgados([fila({ contacto: 'Cliente Prueba Bandeja' })], { ahoraMs: AHORA }), []);
});

test('Sergio desde su celular tampoco es un desconocido', () => {
  const propio = fila({ contacto: 'Sergio', telefono: '+591 716-54992' });
  assert.deepEqual(seleccionarColgados([propio], { ahoraMs: AHORA }), []);
});

test('handoff_humano SI se avisa: es exactamente el caso donde el humano nunca llego', () => {
  const colgados = seleccionarColgados([fila({ botStage: 'handoff_humano' })], { ahoraMs: AHORA });
  assert.equal(colgados.length, 1);
  assert.equal(colgados[0].botStage, 'handoff_humano');
});

test('no hay techo de edad: el de hace nueve dias sigue esperando respuesta', () => {
  // A diferencia del rescate —que NO debe auto-contestar fuera de contexto—, avisar de un
  // lead viejo nunca es danino: el que decide es Sergio.
  assert.equal(seleccionarColgados([fila({ createdAtMs: haceMin(9 * 24 * 60) })], { ahoraMs: AHORA }).length, 1);
});

test('un inbox que no es del bot no entra', () => {
  assert.deepEqual(seleccionarColgados([fila({ inboxId: 3 })], { ahoraMs: AHORA }), []);
});

test('avisa una sola vez por mensaje, pero vuelve a avisar si la persona insiste', () => {
  const colgado = seleccionarColgados([fila()], { ahoraMs: AHORA });
  assert.equal(nuevosParaAvisar(colgado, {}).length, 1, 'la primera vez avisa');
  const estado = armarEstado({}, colgado);
  assert.deepEqual(nuevosParaAvisar(colgado, estado), [], 'la segunda vuelta NO repite');

  const insiste = seleccionarColgados([fila({ messageId: 7, createdAtMs: haceMin(60) })], { ahoraMs: AHORA });
  assert.equal(nuevosParaAvisar(insiste, estado).length, 1, 'un mensaje nuevo vuelve a avisar');
});

test('el estado viejo de otras conversaciones se conserva', () => {
  const estado = armarEstado({ avisados: { 55: 9 } }, seleccionarColgados([fila()], { ahoraMs: AHORA }));
  assert.equal(estado.avisados['55'], 9);
  assert.equal(estado.avisados['100'], 1);
});

test('el aviso escapa el HTML: un contacto con < rompe el mensaje de Telegram', () => {
  const aviso = armarAviso(seleccionarColgados([fila({ contacto: 'A<b>&', content: '5 > 3' })], { ahoraMs: AHORA }));
  assert.equal(aviso.includes('A<b>&'), false);
  assert.equal(aviso.includes('&lt;b&gt;'), true);
  assert.equal(aviso.includes('5 &gt; 3'), true);
});

test('el aviso dice cuantos son, la conversacion y hace cuanto', () => {
  const aviso = armarAviso(seleccionarColgados([fila()], { ahoraMs: AHORA }));
  assert.match(aviso, /1/);
  assert.match(aviso, /100/);
  assert.match(aviso, /2 h|120/);
});
