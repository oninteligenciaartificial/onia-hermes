// Casos del vigia del desconocido colgado. Sin docker, sin red, sin Telegram: todo lo que
// decide vive en funciones puras y se prueba aca.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  seleccionarColgados,
  seleccionarEsperandoHumano,
  frasePromesaHandoff,
  CONFIG_DEL_BOT,
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

// ---------------------------------------------------------------------------------------------
// EL QUE ESPERA A UN HUMANO QUE NUNCA LLEGA.
//
// El vigia de arriba solo ve conversaciones cuyo ULTIMO mensaje es de la persona. Cuando el bot
// deriva, el ultimo mensaje es suyo — "ya le pase tu consulta, te escribe el" — y la persona,
// que hizo bien en esperar, se vuelve invisible: `seleccionarColgados` la descarta con un
// `// ya le contestaron` que en este caso es MENTIRA. Medido el 2026-09-03 en la conv 49.
// ---------------------------------------------------------------------------------------------

const FRASE = 'Ya le pasé tu consulta con todo lo que me contaste. Te escribe él desde este mismo número, en horario de oficina';
const BOT = 3;

/** El mensaje del bot que promete el humano. Por defecto ya paso el umbral. */
function promesa(over = {}) {
  return fila({
    messageId: 10,
    messageType: 1,
    senderId: BOT,
    createdAtMs: haceMin(120),
    content: `Eso lo tiene que ver Sergio, no yo.\n\n${FRASE} (lun a vie).`,
    botStage: 'handoff_humano',
    ...over,
  });
}

const esperando = (filas, opciones = {}) =>
  seleccionarEsperandoHumano(filas, { ahoraMs: AHORA, frase: FRASE, ...opciones });

test('la frase de la promesa sale de M5 del guion del bot, no de este archivo', () => {
  const guion = 'M5: [\n    "Eso lo tiene que ver {{humano}}, no yo.",\n    "",\n    "Ya le pasé tu consulta con todo. Te escribe él desde este mismo número, en horario de oficina ({{horario_frase}}).",\n  ].join';
  assert.equal(
    frasePromesaHandoff(guion),
    'Ya le pasé tu consulta con todo. Te escribe él desde este mismo número, en horario de oficina',
  );
});

test('un guion sin M5 no se inventa una frase: prefiere no mirar a mirar mal', () => {
  assert.equal(frasePromesaHandoff('M7: ["otra cosa"]'), null);
  assert.equal(frasePromesaHandoff(''), null);
});

test('no elige la linea corta y generica de M5: "Eso lo tiene que ver" matchearia cualquier cosa', () => {
  const frase = frasePromesaHandoff('M5: [\n    "Eso lo tiene que ver {{humano}}, no yo.",\n    "Ya le pasé tu consulta con todo lo que me contaste, te escribe {{humano}}.",\n  ]');
  assert.match(frase, /Ya le pas/);
});

test('el que espera al humano prometido NO esta contestado, aunque el ultimo mensaje sea saliente', () => {
  assert.deepEqual(seleccionarColgados([fila(), promesa()], { ahoraMs: AHORA }), [], 'el vigia viejo no lo ve');
  const esperan = esperando([fila(), promesa()]);
  assert.equal(esperan.length, 1);
  assert.equal(esperan[0].conversationId, 100);
  assert.equal(esperan[0].esperandoHumano, true);
});

test('si un HUMANO le escribio despues, ya no espera a nadie', () => {
  // Sender distinto al de la promesa = no es el bot. Es el unico caso que cierra el aviso.
  const filas = [fila(), promesa(), fila({ messageId: 11, messageType: 1, senderId: 2, createdAtMs: haceMin(90), content: 'Hola, soy Sergio' })];
  assert.deepEqual(esperando(filas), []);
});

test('que el BOT siga hablando no cuenta como que llego el humano', () => {
  // M5_ACUSE sale del mismo sender y no es una persona: si tapara el aviso, el acuse de recibo
  // se volveria el mejor escondite del embudo.
  const filas = [fila(), promesa(), fila({ messageId: 11, messageType: 1, senderId: BOT, createdAtMs: haceMin(90), content: 'Te leo, y esto tambien se lo paso a Sergio.' })];
  assert.equal(esperando(filas).length, 1);
});

test('si la persona volvio a escribir NO se cuenta dos veces: ese caso es del vigia de arriba', () => {
  const filas = [fila(), promesa(), fila({ messageId: 12, createdAtMs: haceMin(40) })];
  assert.equal(seleccionarColgados(filas, { ahoraMs: AHORA }).length, 1, 'lo agarra el vigia viejo');
  assert.deepEqual(esperando(filas), [], 'y este no lo repite');
});

test('una promesa recien hecha no se avisa: el humano todavia puede estar yendo', () => {
  assert.deepEqual(esperando([fila(), promesa({ createdAtMs: AHORA - 60000 })]), []);
});

test('la sonda del propio carril no cuenta: hoy es la unica que tiene promesas de handoff', () => {
  assert.deepEqual(esperando([promesa({ contacto: 'Sonda QA carril chatbot' })]), []);
});

test('sin frase legible no inventa nada — pero tampoco tumba al vigia entero', () => {
  assert.deepEqual(seleccionarEsperandoHumano([promesa()], { ahoraMs: AHORA, frase: null }), []);
});

test('un saliente del bot que NO es la promesa no dispara el aviso', () => {
  const filas = [fila(), fila({ messageId: 10, messageType: 1, senderId: BOT, createdAtMs: haceMin(119), content: 'Contame de tu negocio' })];
  assert.deepEqual(esperando(filas), []);
});

test('el aviso separa los dos casos: no es lo mismo "nadie contesto" que "espera una persona"', () => {
  const aviso = armarAviso([...seleccionarColgados([fila()], { ahoraMs: AHORA }), ...esperando([fila({ conversationId: 200 }), promesa({ conversationId: 200 })])]);
  assert.match(aviso, /100/);
  assert.match(aviso, /200/);
  assert.match(aviso, /espera|esperando/i);
  assert.equal(/2 desconocido\(s\) escribieron y nadie contesto/.test(aviso), false, 'no los suma al titulo equivocado');
});

test('GUARDIA: el guion REAL en disco todavia trae la promesa de M5', () => {
  // Los casos de arriba usan texto inyectado y pasarian igual con `config.mjs` ausente. Si M5
  // cambia de forma, el vigia deja de ver los handoff en silencio: hay que enterarse aca.
  const frase = frasePromesaHandoff(readFileSync(CONFIG_DEL_BOT, 'utf8'));
  assert.equal(typeof frase, 'string', 'no encontre M5 en el guion del bot');
  assert.equal(frase.length >= 30, true, `la frase de M5 quedo demasiado corta: ${frase}`);
  assert.match(frase, /consulta/);
});
