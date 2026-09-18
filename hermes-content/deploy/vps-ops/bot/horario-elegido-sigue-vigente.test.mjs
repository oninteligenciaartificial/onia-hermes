// ONIA — El horario que el prospecto ELIGE tiene que seguir siendo ofrecible en el instante
// en que lo elige, no en el instante en que se lo ofrecimos.
//
// LA CLASE. `slotsOffered` es una FOTO: `persistence.mjs` la guarda con el `pending` que el
// horario tenia el dia que se ofrecio, y ese booleano no se vuelve a calcular nunca. Pero
// `pending` no es un dato del horario: es una propiedad del INSTANTE — lo calcula
// `parseSlotsSpec` comparando contra `now + ANTICIPACION_MINIMA_MS`. Al rehidratar, un horario
// del pasado vuelve con `pending: false` y todo el motor lo trata como ofrecible:
// `activeSlots` lo prefiere sobre `config.slots`, `hayHorarioReal` lo aprueba (mira `pending`),
// `detectSlotChoice` lo ofrece y `handleHorario` lo AGENDA.
//
// POR QUE NO ES TEORICO, Y CUAL ES LA VENTANA EXACTA. Medido el 2026-09-18 en produccion
// (onia_center.bot_conversations): DOCE conversaciones en `esperando_horario` guardan horarios
// que ya pasaron — conv 7 "sáb 01/08 14:00", conv 13-19 "mar 18/08 14:00", conv 999999 "sábado
// 12 de septiembre" — todas con `pending: false` congelado. A esas DOCE las salva otra baranda,
// y hay que decirlo porque es lo que separa un test que mide de uno que se miente:
// `conversacionVencida` (14 dias sin actividad) las reinicia al saludo antes de llegar aca. Un
// caso escrito sobre ellas pasa VERDE con el defecto intacto.
//
// El defecto vive en la ventana donde la conversacion SIGUE VIVA (< 14 dias) y el horario ya
// caduco — y esa ventana es la normal, no la rara: el generador publica horarios a 24-48 h de
// anticipacion, asi que alcanza con que la persona tarde dos o tres dias en contestar. Es el
// estado de las DOS conversaciones vivas: conv 49 y conv 58, esta ultima un desconocido REAL
// que escribio por WhatsApp el 17-sep y tiene guardado "sábado 19 de septiembre, 09:00" — a la
// hora de esta medicion faltaban 19 h, o sea el propio motor ya no lo ofreceria, y la coletilla
// de ESE MISMO mensaje le promete un dia de anticipacion. Si contesta "A", el bot le confirma
// "Listo, agendado" sobre un horario que no se sostiene y dispara la reserva de calendario.
//
// ES LA CLASE HERMANA de la que se cerro el 2026-09-18 en `buildFollowUp` (3622a447): alli el
// mensaje diferido OFRECIA la foto vieja; aca el camino interactivo la ACEPTA. La regla que
// las une: lo que DECIDE se re-mide en cada turno, no se lee del estado guardado.
//
// LA DIRECCION DEL ARREGLO IMPORTA. Caer a `config.slots` y agendar el "A" nuevo seria PEOR
// que el bug: le confirmaria a la persona un horario que nunca vio. Por eso el invariante no
// es "agenda el correcto" sino "NO agenda el vencido": se le vuelven a poner los vigentes
// sobre la mesa y elige de nuevo.

import test from "node:test";
import assert from "node:assert/strict";

import { createBotConfig, ANTICIPACION_MINIMA_MS } from "./config.mjs";
import { createState, step } from "./bot-engine.mjs";

// El instante del turno. Los horarios del config se sostienen holgados; los de la FOTO no.
const AHORA = "2026-09-18T17:45:00Z";
const VIGENTE_A = "2026-09-21T18:00:00Z"; // +3 dias
const VIGENTE_B = "2026-09-22T18:00:00Z"; // +4 dias
// La conversacion tiene que estar VIVA: con mas de `reinicio.trasDiasSinActividad` (14) la
// reinicia `conversacionVencida` y nunca llega a elegir horario. Tres dias es el caso comun.
const AYER = "2026-09-15T22:00:00Z";

const CONFIG = createBotConfig({
  slots: [
    { key: "A", label: "lunes 21 de septiembre, 14:00", startAt: VIGENTE_A, pending: false },
    { key: "B", label: "martes 22 de septiembre, 14:00", startAt: VIGENTE_B, pending: false },
  ],
});

/**
 * Una conversacion que quedo dormida esperando que elija horario, con la foto de lo que se le
 * ofrecio aquel dia. Es la forma EXACTA que devuelve la base (`slots_offered`), incluido el
 * `pending: false` congelado, que es lo que hace invisible el defecto.
 */
function dormidaCon(slotsOffered, lastInboundAt) {
  return {
    ...createState({ channel: "chatwoot", contactRef: "58" }),
    botStage: "esperando_horario",
    qualification: { rubro: "odontología", ciudad: "La Paz" },
    lastInboundAt,
    lastOutboundAt: lastInboundAt,
    slotsOffered,
  };
}

const textOf = (result) => result.replies.map((reply) => reply.text).join("\n");
const effectsOf = (result) => result.sideEffects.map((effect) => effect.type);

// ---------------------------------------------------------------------------
// 1. Horario YA PASADO, en una conversacion todavia viva: le ofrecimos el martes, contesta el
//    viernes. Ni el prospecto ni Sergio Urcullo pueden ir a una reunion de anteayer.
// ---------------------------------------------------------------------------

test("un horario que YA PASO no se agenda aunque el prospecto lo elija", () => {
  const state = dormidaCon(
    [
      { key: "A", label: "martes 15 de septiembre, 14:00", startAt: "2026-09-15T18:00:00Z", pending: false },
      { key: "B", label: "martes 15 de septiembre, 16:00", startAt: "2026-09-15T20:00:00Z", pending: false },
    ],
    AYER,
  );

  const result = step(state, { text: "A", receivedAt: AHORA }, { config: CONFIG });

  assert.notEqual(
    result.nextState.botStage,
    "demo_agendada",
    "se agendo una demo para un horario que ya paso",
  );
  assert.ok(
    !effectsOf(result).includes("calendar_event"),
    `se disparo la reserva de un horario pasado: ${effectsOf(result).join(", ")}`,
  );
  // Nombrar el horario caducado es CORRECTO — hay que explicarle por que no se lo confirmamos.
  // Lo prohibido es CONFIRMARLO: que el texto lo de por reservado.
  assert.ok(
    !/agendad|reservad|confirmad/i.test(textOf(result)),
    `se le dio por confirmado un horario que ya paso:\n${textOf(result)}`,
  );
});

// ---------------------------------------------------------------------------
// 2. El caso que no hay que esperar a que envejezca: FUTURO pero por debajo del dia de
//    anticipacion que el propio bot promete. Es el estado de conv 58 al medirlo.
// ---------------------------------------------------------------------------

test("un horario futuro que ya no da un dia de aviso tampoco se agenda", () => {
  const enHoras = new Date(Date.parse(AHORA) + ANTICIPACION_MINIMA_MS - 3600000).toISOString();
  const state = dormidaCon(
    [
      { key: "A", label: "sábado 19 de septiembre, 09:00", startAt: enHoras, pending: false },
      { key: "B", label: "lunes 21 de septiembre, 14:00", startAt: VIGENTE_A, pending: false },
    ],
    AYER,
  );

  const result = step(state, { text: "A", receivedAt: AHORA }, { config: CONFIG });

  assert.notEqual(
    result.nextState.botStage,
    "demo_agendada",
    "se agendo un horario que no llega al dia de anticipacion que el mismo mensaje promete",
  );
  assert.ok(
    !/agendad|reservad|confirmad/i.test(textOf(result)),
    `se dio por confirmado un horario que el motor ya no ofreceria:\n${textOf(result)}`,
  );
});

// ---------------------------------------------------------------------------
// 3. La direccion simetrica, que es la que evita que el arreglo sea peor que el bug: NO se le
//    puede agendar un horario que nunca vio. El "A" de la foto y el "A" del config son
//    horarios DISTINTOS, y caer al del config seria confirmarle una reunion que no eligio.
// ---------------------------------------------------------------------------

test("al caducar el elegido NO se agenda el horario nuevo que el prospecto nunca vio", () => {
  const state = dormidaCon(
    [
      { key: "A", label: "martes 15 de septiembre, 14:00", startAt: "2026-09-15T18:00:00Z", pending: false },
      { key: "B", label: "martes 15 de septiembre, 16:00", startAt: "2026-09-15T20:00:00Z", pending: false },
    ],
    AYER,
  );

  const result = step(state, { text: "A", receivedAt: AHORA }, { config: CONFIG });

  assert.notEqual(
    result.nextState.scheduledLabel,
    "lunes 21 de septiembre, 14:00",
    "se le agendo el horario vigente que nunca estuvo sobre la mesa para el",
  );
});

// ---------------------------------------------------------------------------
// 4. Y no se puede cerrar la puerta: la conversacion sigue, con los horarios VIGENTES sobre la
//    mesa. Un corte que deja al prospecto sin nada que elegir cambia un bug por un silencio.
// ---------------------------------------------------------------------------

test("cuando el elegido caduco, el prospecto recibe los horarios vigentes para elegir de nuevo", () => {
  const state = dormidaCon(
    [
      { key: "A", label: "martes 15 de septiembre, 14:00", startAt: "2026-09-15T18:00:00Z", pending: false },
      { key: "B", label: "martes 15 de septiembre, 16:00", startAt: "2026-09-15T20:00:00Z", pending: false },
    ],
    AYER,
  );

  const result = step(state, { text: "A", receivedAt: AHORA }, { config: CONFIG });
  const texto = textOf(result);

  assert.ok(result.replies.length >= 1, "elegir un horario caducado no puede producir silencio");
  assert.ok(
    texto.includes("lunes 21 de septiembre, 14:00") && texto.includes("martes 22 de septiembre, 14:00"),
    `no se le volvieron a ofrecer los horarios vigentes:\n${texto}`,
  );
  assert.deepEqual(
    (result.nextState.slotsOffered || []).map((slot) => slot.label),
    ["lunes 21 de septiembre, 14:00", "martes 22 de septiembre, 14:00"],
    "el estado tiene que quedar con los horarios que se acaban de ofrecer, o el proximo 'A' vuelve a reservar el viejo",
  );
});
