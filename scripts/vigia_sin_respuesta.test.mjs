// Casos del vigia del desconocido colgado. Sin docker, sin red, sin Telegram: todo lo que
// decide vive en funciones puras y se prueba aca.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, rmSync } from 'node:fs';
import {
  seleccionarColgados,
  seleccionarEsperandoHumano,
  seleccionarEsperandoDecision,
  frasePromesaHandoff,
  CONFIG_DEL_BOT,
  nuevosParaAvisar,
  armarEstado,
  armarAviso,
  UMBRAL_MS,
  correrVigia,
  escalonDe,
  mensajeAvisado,
  entregarComoDecision,
  tareasViejasDelVigia,
  tituloDelAviso,
  estadoDeLaTarea,
  quien,
  MARCA_LEADS,
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
  assert.equal(mensajeAvisado(estado.avisados['100']), 1);
});

// ── El que se cansa y no vuelve a escribir ──────────────────────────────────────────────
//
// Medido el 2026-09-13 en el log vivo del VPS (`/var/log/onia-vigia-sin-respuesta.log`): el
// vigia corre cada 2 h, detecta bien a los 5 colgados, el contador de dias SUBE en cada corrida
// (14, 16, 17, 19, 20 d) y firma `0 sin avisar` en todas. Aviso una vez el 3-sep y no volvio a
// abrir la boca nunca.
//
// La causa es la clave del dedup: `conversationId -> messageId`. El UNICO evento que puede
// reactivar el aviso es que el prospecto escriba de nuevo — y un prospecto al que ignoras, por
// definicion, deja de escribir. O sea que el sistema se vuelve MAS silencioso cuanto peor esta
// la situacion, que es exactamente la inversion que el comentario de `nuevosParaAvisar` decia
// evitar ("un vigia que avisa una vez y calla para siempre repite el bug que vino a vigilar"):
// la cura de ahi cubre al que INSISTE, que es el caso raro.
//
// La cura es que la ANTIGUEDAD entre en la clave. No se re-avisa en cada corrida —eso serian 12
// mensajes diarios en un canal que ya esta saturado, y saturar un canal es apagarlo—: se
// re-avisa solo cuando el sujeto cruza un escalon nuevo.
test('el que NO insiste vuelve a avisar al cruzar un escalon de dias, sin repetir dentro del mismo', () => {
  const recien = seleccionarColgados([fila({ createdAtMs: haceMin(120) })], { ahoraMs: AHORA });
  assert.equal(nuevosParaAvisar(recien, {}).length, 1, 'la primera vez avisa');
  const estado = armarEstado({}, nuevosParaAvisar(recien, {}));

  // Mismo mensaje, 3 h mas tarde: sigue en el escalon 0. Callar aca es lo correcto.
  const tresHoras = seleccionarColgados([fila({ createdAtMs: haceMin(120) })], { ahoraMs: AHORA + 3 * 3600e3 });
  assert.deepEqual(nuevosParaAvisar(tresHoras, estado), [], 'dentro del mismo escalon NO repite');

  // Al dia siguiente cruza el escalon de 1 dia: el lead se pudrio mas y hay que volver a decirlo,
  // aunque la persona no haya escrito una sola letra mas.
  const unDia = seleccionarColgados([fila({ createdAtMs: haceMin(120) })], { ahoraMs: AHORA + 25 * 3600e3 });
  assert.equal(nuevosParaAvisar(unDia, estado).length, 1, 'al cruzar 1 dia vuelve a avisar');

  // Y no se queda gritando: guardado el escalon de 1 dia, a las 2 dias calla hasta el de 3.
  const estado1d = armarEstado(estado, nuevosParaAvisar(unDia, estado));
  const dosDias = seleccionarColgados([fila({ createdAtMs: haceMin(120) })], { ahoraMs: AHORA + 49 * 3600e3 });
  assert.deepEqual(nuevosParaAvisar(dosDias, estado1d), [], 'a los 2 dias sigue callado');
  const tresDias = seleccionarColgados([fila({ createdAtMs: haceMin(120) })], { ahoraMs: AHORA + 73 * 3600e3 });
  assert.equal(nuevosParaAvisar(tresDias, estado1d).length, 1, 'a los 3 dias vuelve');
});

// El estado que HOY esta vivo en el VPS guarda un numero plano. Si el formato nuevo no lo sabe
// leer, el vigia arranca creyendo que nunca aviso a nadie... o peor, tira. Los 5 que llevan
// 14-20 dias tienen que salir UNA vez con el formato nuevo, no quedar enterrados otra vez.
test('lee el estado viejo (numero plano) y rescata al que lleva semanas colgado', () => {
  const viejo = { avisados: { 100: 1 } };
  const veinteDias = seleccionarColgados([fila({ createdAtMs: haceMin(120) })], {
    ahoraMs: AHORA + 20 * 24 * 3600e3,
  });
  const nuevos = nuevosParaAvisar(veinteDias, viejo);
  assert.equal(nuevos.length, 1, 'el formato viejo no lo deja enterrado');
  assert.equal(nuevos[0].reaviso, true, 'y se marca como re-aviso, no como lead nuevo');
});

// Sergio Urcullo lee el aviso en el telefono entre otras 80 tareas. Si un re-aviso se ve igual
// que un lead que acaba de entrar, lo hace actuar mal: creeria que entraron 5 desconocidos hoy.
test('el aviso distingue un re-aviso de un lead nuevo', () => {
  const colgado = seleccionarColgados([fila()], { ahoraMs: AHORA });
  assert.equal(armarAviso(colgado).includes('sigue esperando'), false, 'un lead nuevo no dice eso');
  const reavisado = colgado.map((c) => ({ ...c, reaviso: true }));
  assert.equal(armarAviso(reavisado).includes('sigue esperando'), true, 'un re-aviso se nombra');
});

test('escalonDe: los umbrales, y despues del mes sigue avisando una vez por mes', () => {
  const dias = (d) => escalonDe(d * 24 * 60);
  assert.equal(dias(0.1), 0);
  assert.equal(dias(1), 1);
  assert.equal(dias(2.9), 1);
  assert.equal(dias(3), 3);
  assert.equal(dias(7), 7);
  assert.equal(dias(14), 14);
  assert.equal(dias(29), 14, 'el mes todavia no se cumplio');
  assert.equal(dias(30), 30);
  assert.equal(dias(59), 30, 'no grita todos los dias despues del mes');
  assert.equal(dias(60), 60, 'pero tampoco se muere: vuelve cada mes');
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
// EL AVISO LLEVA CON QUE CONTESTAR.
//
// Medido el 2026-09-19 contra produccion: los tres leads de WhatsApp colgados tienen su telefono
// en `contacts.phone_number` (conv 35 `+59173232758` hace 24 d, conv 37 `+59173021804` hace 22 d,
// conv 58 `+59175755019`), el vigia YA los LEE — `esNuestra({contacto, telefono})` es lo unico que
// distingue a un desconocido de una sonda — y el texto que le pide a Sergio Urcullo que los
// contacte salia sin el numero: `conv 58 (WhatsApp) — 11 h ... — .: Hola, vengo de la web`.
// El contacto de esa conversacion se llama literalmente `.`, asi que el aviso no nombraba a nadie
// con quien actuar.
//
// La clase, transferible: **un dato que el instrumento ya consulta para DECIDIR tiene que viajar
// al texto que pide ACTUAR**. Y falla hacia el lado caro — el canal donde contestar es UN CLIC
// (`wa.me`) es justo el que llegaba sin con que hacerlo.

test('un lead de WhatsApp llega con su telefono: es lo unico con lo que se le contesta', () => {
  const aviso = armarAviso(seleccionarColgados(
    [fila({ inboxId: 5, contacto: '.', telefono: '+59175755019' })],
    { ahoraMs: AHORA },
  ));
  assert.match(aviso, /\+59175755019/, 'sin el numero, un contacto llamado "." no se puede contestar');
  assert.match(aviso, /wa\.me\/59175755019/, 'en WhatsApp contestar es un clic: el enlace va armado');
});

test('un lead de la web no inventa telefono ni ensucia la linea diciendo que no lo tiene', () => {
  const aviso = armarAviso(seleccionarColgados(
    [fila({ inboxId: 4, contacto: 'icy-lake-546', telefono: '' })],
    { ahoraMs: AHORA },
  ));
  assert.equal(/wa\.me/.test(aviso), false, 'no hay telefono que enlazar');
  assert.equal(/sin telefono|sin numero/i.test(aviso), false, 'decir lo que falta es ruido, no dato');
});

test('la CLI lleva el MISMO dato que el Telegram, y sin escapar: ahi nadie lee HTML', () => {
  const c = { contacto: 'A<b>', telefono: '+59175755019' };
  assert.match(quien(c), /&lt;b&gt;/, 'el aviso de Telegram escapa');
  assert.ok(quien(c, (t) => t).includes('A<b>'), 'la CLI no escapa: ahi `&lt;` se leeria literal');
  // Las dos vias tienen que traer el numero: el que diagnostica desde la consola tampoco puede
  // contestarle a un contacto llamado `.` sin el telefono. El archivo declara el invariante
  // («la CLI dice lo MISMO que el Telegram») y ya envejecio una vez por su cuenta.
  for (const via of [quien(c), quien(c, (t) => t)]) {
    assert.match(via, /wa\.me\/59175755019/, 'las dos vias derivan del mismo helper');
  }
});

test('el telefono del aviso se escapa igual que el resto: viaja en HTML a Telegram', () => {
  const aviso = armarAviso(seleccionarColgados(
    [fila({ inboxId: 5, telefono: '+591<b>7' })],
    { ahoraMs: AHORA },
  ));
  assert.equal(aviso.includes('+591<b>7'), false, 'un telefono con HTML rompe el mensaje entero');
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

// ───────────────────────────────────────────────────────────────────────────────────────────
// HERMETICIDAD DE `correrVigia`. Hasta el 2026-09-11 esta funcion —la que decide si Sergio
// Urcullo se entera de que un lead quedo colgado— no tenia UN SOLO caso, y sus cuatro
// dependencias caian por defecto a produccion: Telegram real, el JSON de estado real, y dos
// `docker exec` contra las bases. La cabecera de este archivo declaraba «sin docker, sin red,
// sin Telegram» y era cierto sólo porque nadie la llamaba: una hipotesis, no una garantia.
//
// Ese mismo dia, a las 05:16 y otra vez a las 06:05 UTC, el modulo HERMANO (`rescate-run.mjs`)
// pago la factura de esta misma forma: doce casos sin inyectar `avisar` mandaron 18 Telegram,
// crearon una tarea 🔴 falsa en el tablero y dejaron tres marcas de produccion — una,
// `chatwoot-11-873`, silencio el aviso de un lead REAL de WhatsApp.
//
// Estos casos NO prueban el efecto: prueban que el efecto es inalcanzable desde la suite.
const colgadoDeVerdad = [fila({ conversationId: 777, messageId: 7 })];
const enriquecerNoOp = async (c) => c;

test('sin inyectar `avisar`, el vigia NO puede llegar al canal de Sergio Urcullo', async () => {
  await assert.rejects(
    () => correrVigia(
      { emitir: true, ahoraMs: AHORA, estado: `/tmp/vigia-estado-${process.pid}.json` },
      { leerFilas: async () => colgadoDeVerdad, enriquecer: enriquecerNoOp },
    ),
    (error) => {
      assert.equal(error.hermetismo, true, 'la baranda tiene que ir MARCADA o un catch se la traga');
      assert.match(error.message, /deps\.avisar/, 'el error tiene que decir como inyectarla');
      return true;
    },
  );
});

test('sin inyectar `estado`, el vigia NO puede pisar el JSON que apaga los avisos pendientes', async () => {
  await assert.rejects(
    () => correrVigia(
      { emitir: true, ahoraMs: AHORA },
      { leerFilas: async () => colgadoDeVerdad, enriquecer: enriquecerNoOp, avisar: async () => {} },
    ),
    (error) => error.hermetismo === true && /opciones\.estado/.test(error.message),
  );
});

test('sin inyectar `leerFilas`, el vigia NO puede hacer psql contra Chatwoot', async () => {
  await assert.rejects(
    () => correrVigia({ ahoraMs: AHORA, estado: `/tmp/vigia-estado-${process.pid}.json` }, { enriquecer: enriquecerNoOp }),
    (error) => error.hermetismo === true && /deps\.leerFilas/.test(error.message),
  );
});

test('sin inyectar `enriquecer`, el vigia NO puede hacer docker exec contra el motor', async () => {
  await assert.rejects(
    () => correrVigia(
      { ahoraMs: AHORA, estado: `/tmp/vigia-estado-${process.pid}.json` },
      { leerFilas: async () => colgadoDeVerdad, avisar: async () => {} },
    ),
    (error) => error.hermetismo === true && /deps\.enriquecer/.test(error.message),
  );
});

test('ANCLA: con todo inyectado el vigia SI avisa, y no repite en la segunda corrida', async () => {
  // La baranda no puede volver intesteable a la parte que hay que probar. Este caso es la
  // primera cobertura que tuvo `correrVigia` y es el que se rompe si alguien la sobre-guarda.
  const estado = `/tmp/vigia-ancla-${process.pid}.json`;
  rmSync(estado, { force: true });
  const avisos = [];
  const deps = {
    leerFilas: async () => colgadoDeVerdad,
    enriquecer: enriquecerNoOp,
    avisar: async (texto) => { avisos.push(texto); return { entregado: true }; },
  };
  const primera = await correrVigia({ emitir: true, ahoraMs: AHORA, estado }, deps);
  assert.equal(primera.nuevos.length, 1, 'el colgado tiene que salir como nuevo');
  assert.equal(avisos.length, 1, 'y tiene que avisarse');
  assert.match(avisos[0], /777/, 'el aviso nombra la conversacion');

  const segunda = await correrVigia({ emitir: true, ahoraMs: AHORA, estado }, deps);
  assert.equal(segunda.nuevos.length, 0, 'ya avisado: no se repite');
  assert.equal(avisos.length, 1, 'y no manda un segundo Telegram');
  rmSync(estado, { force: true });
});

// ---------------------------------------------------------------------------
// LA TERCERA MIRADA: al bot le contestaron, la persona no volvio, y NADIE SE ENTERO.
//
// Medido el 2026-09-17 contra la base de Chatwoot, con DOS desconocidos reales que ninguno de
// los dos vigias de arriba puede ver, porque los dos exigen que el bot se haya callado:
//
//   conv 58  WhatsApp  hace 3 h   "+59175755019"  entro por el boton wa.me de onia.com.bo
//   conv 38  web       hace 20 d  "billowing-shadow-768"  escribio "hola" el 29-ago
//
// En las dos el bot contesto bien y ofrecio dos horarios de demo. La persona no eligio ninguno
// y ahi murio: `seleccionarColgados` las descarta con `// ya le contestaron`, y
// `seleccionarEsperandoHumano` tampoco las toma porque el bot nunca prometio un humano.
//
// EL BOT APAGO EL UNICO AVISO DE LEAD NUEVO QUE HABIA. Antes de que contestara, ese mismo
// desconocido quedaba sin respuesta y disparaba el vigia. Ahora el bot contesta SIEMPRE, asi
// que el vigia no se dispara NUNCA — y con cero clientes pagando, el unico que vende no se
// entera de que alguien apreto el boton de WhatsApp en su web. La conv 38 lleva 20 dias asi.
const conPromesa = frasePromesaHandoff(readFileSync(CONFIG_DEL_BOT, 'utf8'));

/** El caso de la conv 58: la persona escribio, el bot ofrecio horarios, y no volvio. */
const ofrecioYNoVolvio = () => [
  fila({ conversationId: 58, messageId: 1, messageType: 0, createdAtMs: haceMin(200), content: 'Hola, vengo de la web de Onia' }),
  fila({ conversationId: 58, messageId: 2, messageType: 1, createdAtMs: haceMin(199), senderId: 3, content: '¿Cual te va mejor? A) sabado 19 B) lunes 21' }),
];

test('el bot ofrecio horarios y la persona no volvio: queda esperando una decision', () => {
  const esperando = seleccionarEsperandoDecision(ofrecioYNoVolvio(), { ahoraMs: AHORA, frase: conPromesa });
  assert.equal(esperando.length, 1, 'ninguna de las otras dos miradas la ve: si esta no la toma, se pierde');
  assert.equal(esperando[0].conversationId, 58);
  assert.equal(esperando[0].esperandoDecision, true);
});

test('lo que se muestra es lo que dijo LA PERSONA, no la oferta del bot', () => {
  // Sergio Urcullo necesita saber a que contestarle; su propio guion no se lo dice.
  const [uno] = seleccionarEsperandoDecision(ofrecioYNoVolvio(), { ahoraMs: AHORA, frase: conPromesa });
  assert.match(uno.content, /vengo de la web/);
});

test('sin un solo entrante NO es un lead: es un saliente que arrancamos nosotros', () => {
  const soloSaliente = [fila({ conversationId: 59, messageId: 1, messageType: 1, createdAtMs: haceMin(200) })];
  assert.deepEqual(seleccionarEsperandoDecision(soloSaliente, { ahoraMs: AHORA, frase: conPromesa }), []);
});

test('si la persona volvio a escribir NO es de esta mirada: es del vigia de arriba', () => {
  // Dos avisos por la misma conversacion es como se le deja de creer a un vigia.
  const volvio = [...ofrecioYNoVolvio(), fila({ conversationId: 58, messageId: 3, messageType: 0, createdAtMs: haceMin(150) })];
  assert.deepEqual(seleccionarEsperandoDecision(volvio, { ahoraMs: AHORA, frase: conPromesa }), []);
  assert.equal(seleccionarColgados(volvio, { ahoraMs: AHORA }).length, 1, 'y la otra mirada SI la toma');
});

test('si el bot prometio un humano NO es de esta mirada: es del vigia de al lado', () => {
  const prometio = [
    fila({ conversationId: 60, messageId: 1, messageType: 0, createdAtMs: haceMin(200) }),
    fila({ conversationId: 60, messageId: 2, messageType: 1, createdAtMs: haceMin(199), senderId: 3, content: conPromesa }),
  ];
  assert.deepEqual(seleccionarEsperandoDecision(prometio, { ahoraMs: AHORA, frase: conPromesa }), []);
  assert.equal(seleccionarEsperandoHumano(prometio, { ahoraMs: AHORA, frase: conPromesa }).length, 1, 'y la otra mirada SI la toma');
});

test('recien contestado no cuenta: la persona todavia lo esta leyendo', () => {
  const recien = [
    fila({ conversationId: 61, messageId: 1, messageType: 0, createdAtMs: AHORA - 120000 }),
    fila({ conversationId: 61, messageId: 2, messageType: 1, createdAtMs: AHORA - 60000, senderId: 3 }),
  ];
  assert.deepEqual(seleccionarEsperandoDecision(recien, { ahoraMs: AHORA, frase: conPromesa }), []);
});

test('la sonda del propio carril no es un lead', () => {
  const nuestra = ofrecioYNoVolvio().map((f) => ({ ...f, contacto: 'Sonda QA carril chatbot' }));
  assert.deepEqual(seleccionarEsperandoDecision(nuestra, { ahoraMs: AHORA, frase: conPromesa }), []);
});

test('si YA le escribiste vos, no se avisa: el objetivo era que te enteraras', async () => {
  // `human_took_over` lo escribe el motor y es el unico dato que sabe si una PERSONA de Onia
  // tomo la conversacion. Sin el, el vigia le reclamaria a Sergio Urcullo un lead que el ya
  // contesto — y a un vigia que grita mal no se lo corrige, se lo apaga.
  const estado = `/tmp/vigia-decision-${process.pid}.json`;
  rmSync(estado, { force: true });
  const avisos = [];
  const { nuevos } = await correrVigia({ emitir: true, ahoraMs: AHORA, estado }, {
    leerFilas: async () => ofrecioYNoVolvio(),
    enriquecer: async (cs) => cs.map((c) => ({ ...c, humanoTomo: true })),
    avisar: async (t) => { avisos.push(t); },
  });
  assert.deepEqual(nuevos, [], 'ya lo tomo una persona: no hay nada que avisar');
  assert.equal(avisos.length, 0);
  rmSync(estado, { force: true });
});

test('si NO se pudo preguntarle al motor, avisa igual y lo DICE', async () => {
  // Fallar callado seria perder el lead, que es lo caro. Se avisa, con la salvedad escrita:
  // "no pude preguntar" nunca se imprime con las mismas palabras que "ya le contestaste".
  const estado = `/tmp/vigia-decision-nm-${process.pid}.json`;
  rmSync(estado, { force: true });
  const avisos = [];
  const { nuevos } = await correrVigia({ emitir: true, ahoraMs: AHORA, estado }, {
    leerFilas: async () => ofrecioYNoVolvio(),
    enriquecer: async (cs) => cs.map((c) => ({ ...c, humanoTomo: null })),
    avisar: async (t) => { avisos.push(t); },
  });
  assert.equal(nuevos.length, 1, 'no medido no puede significar callarse');
  assert.match(avisos[0], /no pude confirmar/i, 'la salvedad va escrita, pegada a la afirmacion');
  rmSync(estado, { force: true });
});

test('el aviso separa las tres miradas: cada una pide algo distinto de Sergio Urcullo', () => {
  const texto = armarAviso([
    fila({ conversationId: 1, esperaMin: 600 }),
    fila({ conversationId: 2, esperaMin: 600, esperandoHumano: true }),
    fila({ conversationId: 3, esperaMin: 600, esperandoDecision: true }),
  ]);
  assert.match(texto, /nadie contesto/, 'a este hay que contestarle');
  assert.match(texto, /el bot ya se lo prometio/, 'a este el bot ya le prometio una persona');
  assert.match(texto, /no lo sabia nadie/i, 'de este nadie se entero nunca');
  // Sumarlos bajo un mismo titulo diria algo falso de dos de los tres grupos.
  assert.equal(texto.split('🔴').length - 1, 3, 'tres bloques, no uno');
});

// ---------------------------------------------------------------------------
// EL AVISO TIENE QUE LLEGARLE A SERGIO URCULLO, Y EL VIGIA TIENE QUE SABER SI LLEGO.
//
// Medido el 2026-09-18. Este vigia avisaba por `onia-tg.sh`, que por defecto NO manda
// Telegram: crea una tarea `ready` y la dedupea por el TITULO con los digitos colapsados a
// `N`. Dos consecuencias, las dos vivas ese dia:
//
//   1. La tarea del 18-sep (`t_3b9d0ded`, conv 58 hace 6 h y conv 38 hace 20 DIAS) quedo
//      `ready` entre 262 tareas. `ready` es de donde los carriles sacan trabajo; contactar a
//      un prospecto es decision de Sergio Urcullo, y la unica forma que la ve es
//      `blocked --kind needs_input`. Nadie la miro.
//   2. Mientras esa tarea siguiera viva, «3 escribieron» normaliza al MISMO titulo que
//      «2 escribieron»: `TAREA-YA-EXISTE`, exit 0, aviso tirado en silencio. Y `correrVigia`
//      escribia igual el estado «ya le avise», asi que el lead nuevo quedaba marcado como
//      avisado sin que nadie lo hubiera visto nunca.
//
// Con cero clientes pagando, esos son los unicos leads que hay.

/** Un tablero de mentira: anota lo que le pidieron y contesta lo que el caso le diga. */
function tableroFalso({ vivas = [], estadoFinal = 'blocked', id = 't_abcd1234' } = {}) {
  const llamadas = [];
  const tablero = async (args) => {
    llamadas.push(args);
    if (args[0] === 'list') return JSON.stringify(vivas);
    if (args[0] === 'create') return `Created task ${id}`;
    if (args[0] === 'show') return `Task ${id}: x\n  status:    ${estadoFinal}\n  assignee:  -\n`;
    return '';
  };
  return { tablero, llamadas };
}

test('las tareas viejas del vigia se buscan por MARCA y las terminadas no cuentan', () => {
  const viejas = tareasViejasDelVigia([
    { id: 't_11111111', title: `${MARCA_LEADS} 2 desconocido(s) esperando una respuesta tuya`, status: 'ready' },
    { id: 't_22222222', title: `${MARCA_LEADS} 5 desconocido(s) esperando una respuesta tuya`, status: 'done' },
    { id: 't_33333333', title: 'Otra cosa cualquiera del tablero', status: 'ready' },
    { id: 't_44444444', title: `${MARCA_LEADS} 1 desconocido(s) esperando una respuesta tuya`, status: 'blocked' },
  ]);
  // La `done` no se toca; la `blocked` SI, porque es un aviso vivo que ya no describe a la
  // gente de hoy — dejarla viva es lo que tapaba al lead nuevo.
  assert.deepEqual(viejas, ['t_11111111', 't_44444444']);
});

// Medido el 2026-09-24: el barrido por MARCA dejo vivas CUATRO tareas sobre las mismas siete
// personas — dos `[auto:]` del formato anterior a la marca (t_13f09d9a, t_3b9d0ded) y dos
// escritas a mano (t_c3b9aa8f, t_706b8369) — con cuentas congeladas de hace 11 dias (decian 5,
// 2, 5 y 1 colgados; hoy son 7, y las esperas pasaron de 15-20 d a 26-31 d). Desde el arreglo
// del parte diario (79014865) TODA tarea blocked le llega a Sergio Urcullo cada manana, y el
// pidio maximo 5 filas por mensaje: el mismo grupo le llegaba cinco veces con cuatro cuentas
// distintas. La MARCA es una clave sobre el TITULO, o sea se rompe sola el dia que el titulo
// cambia — y ya cambio una vez. El ID que el vigia creo no cambia nunca.
test('el barrido alcanza la tarea que el vigia RECUERDA por id, aunque su titulo no lleve la MARCA', () => {
  const viejas = tareasViejasDelVigia(
    [
      { id: 't_11111111', title: '🔴 5 desconocido(s) escribieron y nadie contesto', status: 'blocked' },
      { id: 't_22222222', title: 'Una tarea ajena que el vigia nunca creo', status: 'blocked' },
      { id: 't_33333333', title: `${MARCA_LEADS} 1 desconocido(s) esperando una respuesta tuya`, status: 'ready' },
    ],
    ['t_11111111', 't_99999999'],
  );
  // La ajena no se toca (archivar por las dudas es peor que el ruido que evita) y la que ya
  // no existe en el tablero tampoco aparece: el recuerdo no inventa sujetos.
  assert.deepEqual(viejas, ['t_11111111', 't_33333333']);
});

test('el vigia ANOTA el id que acaba de crear: es la memoria que hace al barrido independiente del titulo', () => {
  const estado = armarEstado({ avisados: { 7: { mensaje: 1, escalon: 0 } } }, [], 't_nueva123');
  assert.deepEqual(estado.tareas, ['t_nueva123']);
  assert.ok(estado.avisados[7], 'y no se lleva puesto lo que ya sabia de cada conversacion');
});

test('el aviso archiva tambien lo que recuerda, no solo lo que reconoce por el titulo', async () => {
  const { tablero, llamadas } = tableroFalso({
    vivas: [{ id: 't_viejo222', title: '🔴 2 escribio(eron), el bot lo(s) atendio', status: 'blocked' }],
  });
  const entrega = await entregarComoDecision('cuerpo', [{}], { tablero }, { tareasPrevias: ['t_viejo222'] });
  assert.equal(entrega.entregado, true);
  assert.ok(
    llamadas.some((a) => a[0] === 'archive' && a[1] === 't_viejo222'),
    'sin esto, cada cambio de titulo deja una tarea vieja viva para siempre en la hoja de Sergio Urcullo',
  );
});

test('el titulo del aviso lleva la MARCA, que es lo que lo hace encontrable', () => {
  assert.match(tituloDelAviso([{}, {}]), /^\[leads-esperando\] 2 desconocido/);
  assert.equal(estadoDeLaTarea('Task t_x: y\n  status:    blocked\n  assignee:  -'), 'blocked');
});

test('el aviso archiva el anterior, crea el de hoy y lo deja BLOCKED needs_input', async () => {
  const { tablero, llamadas } = tableroFalso({
    vivas: [{ id: 't_viejo111', title: `${MARCA_LEADS} 9 desconocido(s) esperando una respuesta tuya`, status: 'ready' }],
  });
  const entrega = await entregarComoDecision('cuerpo del aviso', [{}, {}], { tablero });

  assert.equal(entrega.entregado, true, 'con el tablero contestando bien, el aviso se entrego');
  assert.ok(llamadas.some((a) => a[0] === 'archive' && a[1] === 't_viejo111'),
    'el aviso anterior se archiva: vivo, su titulo normalizado tapa al lead nuevo');

  const bloqueo = llamadas.find((a) => a[0] === 'block');
  assert.ok(bloqueo, 'la tarea se bloquea: `ready` no le llega a Sergio Urcullo');
  // El motivo va ANTES de `--kind`. Con la opcion en el medio el tablero muere con
  // `unrecognized arguments` y la tarea se queda `ready`, o sea sin avisarle a nadie.
  assert.equal(bloqueo[1], 't_abcd1234');
  assert.match(bloqueo[2], /Sergio Urcullo/, 'el motivo es el segundo posicional, no una opcion');
  assert.deepEqual(bloqueo.slice(3), ['--kind', 'needs_input']);
  assert.ok(llamadas.some((a) => a[0] === 'show'), 'y se MIRA el estado: `block` sale 0 sin bloquear');
});

test('si el bloqueo no prendio, el aviso NO se da por entregado', async () => {
  // `block` devuelve 0 igual cuando el tablero detecta un bucle de bloqueos y no bloquea
  // nada. Creerle al exit deja la tarea en `ready` y el lead invisible.
  const { tablero } = tableroFalso({ estadoFinal: 'ready' });
  const entrega = await entregarComoDecision('cuerpo', [{}], { tablero });
  assert.equal(entrega.entregado, false);
  assert.match(entrega.motivo, /ready/, 'el motivo dice en que estado quedo, para poder arreglarlo');
});

test('ANCLA: un aviso que NO llego no se anota como avisado — si no, el lead se pierde', async () => {
  const estado = `/tmp/vigia-entrega-${process.pid}.json`;
  rmSync(estado, { force: true });
  let intentos = 0;
  const deps = {
    leerFilas: async () => colgadoDeVerdad,
    enriquecer: enriquecerNoOp,
    avisar: async () => { intentos += 1; return { entregado: false, motivo: 'el tablero lo tiro' }; },
  };
  const primera = await correrVigia({ emitir: true, ahoraMs: AHORA, estado }, deps);
  assert.equal(primera.nuevos.length, 1, 'hay alguien esperando');
  assert.equal(intentos, 1);

  // La de verdad: la vuelta siguiente TIENE que volver a intentarlo. Antes se anotaba como
  // avisado igual y esta persona no se nombraba nunca mas.
  const segunda = await correrVigia({ emitir: true, ahoraMs: AHORA, estado }, deps);
  assert.equal(segunda.nuevos.length, 1, 'no se entrego: sigue siendo nuevo');
  assert.equal(intentos, 2, 'y se vuelve a intentar');
  rmSync(estado, { force: true });
});

// ───────────────────────────────────────────────────────────────────────────────────────────
// EL AVISO CUENTA EL TOTAL VIGENTE, NO SOLO LA NOVEDAD.
//
// Medido el 2026-09-25 en produccion, y es el fallo mas caro que puede tener este vigia:
// `correrVigia` corrio en seco y firmo «7 colgado(s) — 5 sin respuesta», pero la UNICA tarea
// que este vigia dejo en el tablero (`t_768dc2ad`, 24-sep 22:39) se titula «[leads-esperando]
// 1 desconocido(s) esperando una respuesta tuya» y su cuerpo nombra UNA conversacion. El
// disparo por novedad esta bien —no se repite un lead que ya se aviso—, pero el TITULO y el
// CUERPO se armaban con `nuevos`, asi que el numero que Sergio Urcullo lee en la hoja de
// decisiones es el de los que cambiaron desde el ultimo aviso, no el de los que estan
// esperando. Leyo «1» sobre 7 personas, 5 de ellas sin una sola respuesta nuestra, y decidio
// sobre una muestra. La prueba de que no se comunicaba: una sesion tuvo que escribir a mano la
// tarea `t_5ea80f5e` («son 4, no 3») para contar lo que este aviso ya sabia.
//
// `armarAviso` YA estaba preparado para esto: su campo `reaviso` existe para que el que lleva
// 20 dias no se lea como uno que entro recien. Lo que faltaba era pasarle la lista entera.
test('el aviso dice cuantos estan esperando EN TOTAL, no cuantos son novedad', async () => {
  const estado = `/tmp/vigia-total-${process.pid}.json`;
  rmSync(estado, { force: true });
  const viejo = fila({ conversationId: 888, messageId: 8, content: 'me interesa el sistema' });
  const recien = fila({ conversationId: 999, messageId: 9, content: 'hola, tienen precios?' });
  const entregados = [];
  const deps = {
    enriquecer: enriquecerNoOp,
    avisar: async (texto, colgados) => { entregados.push({ texto, colgados }); return { entregado: true }; },
  };

  // Primera corrida: solo el viejo. Queda anotado como avisado.
  await correrVigia({ emitir: true, ahoraMs: AHORA, estado }, { ...deps, leerFilas: async () => [viejo] });
  assert.equal(entregados.length, 1, 'el primer colgado se avisa');

  // Segunda corrida, mismo instante: el viejo NO es novedad (mismo mensaje, mismo escalon) y
  // el recien llegado si. Son DOS esperando y el aviso tiene que decir DOS.
  const segunda = await correrVigia(
    { emitir: true, ahoraMs: AHORA, estado },
    { ...deps, leerFilas: async () => [viejo, recien] },
  );
  rmSync(estado, { force: true });

  assert.equal(segunda.nuevos.length, 1, 'la novedad sigue siendo una sola: el disparo no cambia');
  assert.equal(entregados.length, 2, 'y con una novedad el aviso sale');

  const ultimo = entregados[1];
  assert.equal(ultimo.colgados.length, 2,
    'el aviso se entrega con los DOS que estan esperando: el titulo se arma de esta lista');
  assert.match(tituloDelAviso(ultimo.colgados), /\] 2 desconocido/,
    'el titulo que lee Sergio Urcullo dice 2, que es la gente esperando, no 1, que es la novedad');
  assert.match(ultimo.texto, /888/, 'el cuerpo no puede esconder al que ya esperaba: sigue esperando');
  assert.match(ultimo.texto, /999/, 'y nombra al que acaba de entrar');
  assert.match(ultimo.texto, /2 desconocido\(s\) escribieron y nadie contesto/,
    'el encabezado del bloque cuenta los dos');
  assert.match(ultimo.texto, /888.*sigue esperando/,
    'al viejo se lo marca como reaviso para que no parezca que hoy entraron dos');
});
