// ONIA — Un handoff que NADIE tomó no puede quedar mudo para los DOS lados.
//   node --test "hermes-content/deploy/vps-ops/bot/handoff-sin-humano-no-es-silencio.test.mjs"
//
// POR QUE EXISTE. Medido el 2026-09-24 en el simulador, con el guion desplegado:
//
//   vos > quiero hablar con una persona de verdad
//     [M5]       "Ya le pasé tu consulta a Sergio..."        <- aviso a Sergio: SALE
//   vos > hola? sigo esperando
//     [M5_ACUSE] "Te leo, y esto también se lo paso..."      <- acuse: UNA vez
//   vos > alguien me lee?
//     (el bot NO responde)                  [notas] silencio:handoff_en_curso
//
// ...con `humanTookOver: false`. Nadie tomó la conversación. El bot se calla A PROPOSITO
// para no pisar al humano — pero no hay humano. Y el silencio tampoco le llega a Sergio
// Urcullo: el aviso del handoff ya se gastó en el primer turno.
//
// LA CLASE que cuida este archivo: **el bot deja de hablar por una razón que asume un humano
// del otro lado, y nadie verifica que ese humano exista.** El silencio es correcto; lo que
// estaba roto es que además fuera INVISIBLE. Ningún barrido lo rescata: `followup` mira
// (esperando_calificacion, esperando_horario), `insistencia` mira `nuevo` y `postdemo` mira
// `demo_agendada` — `handoff_humano` no lo barre NADIE (`persistence.mjs:244,708,737`).
// Medido el mismo día en producción: `chatwoot:11` llevaba 14 días en `handoff_humano` con
// `human_took_over=false`, y ninguna de las tres patas del objetivo del carril lo veía.
//
// LO QUE NO SE ARREGLA ACA, a propósito: el bot sigue SIN responderle al cliente. Contestar
// cada insistencia lo convierte en un loro y tapa a Sergio cuando entre. Lo que cambia es que
// el silencio AVISA, una sola vez, como ya hace `handoff_urgente`.

import test from "node:test";
import assert from "node:assert/strict";

import { createBotConfig } from "./config.mjs";
import { createState, step } from "./bot-engine.mjs";
import { ETIQUETAS } from "./aviso-telegram.mjs";

const CONFIG = createBotConfig({
  slots: [
    { key: "A", label: "jueves 15:00", startAt: "2026-07-30T19:00:00Z", pending: false },
    { key: "B", label: "viernes 10:00", startAt: "2026-07-31T14:00:00Z", pending: false },
  ],
});

const T0 = "2026-07-27T14:05:00Z"; // lunes 10:05 en La Paz: dentro de horario

function run(mensajes, options = {}) {
  let state = options.state || createState({ channel: "sim", contactRef: "test" });
  const results = [];
  mensajes.forEach((texto, i) => {
    const result = step(state, { text: texto, receivedAt: new Date(Date.parse(T0) + i * 120000).toISOString() }, { config: CONFIG, ...options });
    state = result.nextState;
    results.push(result);
  });
  return { state, turns: results };
}

const notifyOf = (r) => r.sideEffects.filter((e) => e.type === "notify_sergio").map((e) => e.payload);
const textOf = (r) => r.replies.map((x) => x.text).join("\n");

const PIDE_HUMANO = "quiero hablar con una persona de verdad";
const KIND = "handoff_sin_humano";

// ---------------------------------------------------------------------------
// 1. El caso medido: insiste, nadie lo tomó, y Sergio Urcullo no se entera
// ---------------------------------------------------------------------------

test("el que insiste en un handoff que nadie tomó deja de ser invisible", () => {
  const { state, turns } = run([PIDE_HUMANO, "hola? sigo esperando", "alguien me lee?"]);

  assert.equal(turns[0].nextState.botStage, "handoff_humano", "precondición: el bot derivó");
  assert.equal(state.humanTookOver, false, "precondición: NADIE tomó la conversación");
  assert.equal(textOf(turns[1]).trim().length > 0, true, "precondición: el 1.º tras derivar recibe el acuse");

  // El turno que hoy muere mudo para los dos lados.
  const avisos = notifyOf(turns[2]);
  assert.equal(avisos.length, 1, "insistió en un handoff sin humano y no se enteró nadie");
  assert.equal(avisos[0].kind, KIND);
  assert.equal(avisos[0].conversationKey, state.conversationKey);

  // Y sigue SIN contestarle: el arreglo es que avise, no que se vuelva loro.
  assert.equal(turns[2].replies.length, 0, "el bot no puede hablar encima del humano que va a entrar");
  assert.ok(turns[2].notes.includes("silencio:handoff_en_curso"), "la rama sigue siendo la del silencio");
});

// ---------------------------------------------------------------------------
// 2. UNA sola vez: el canal ya le llega saturado a Sergio Urcullo
// ---------------------------------------------------------------------------

test("avisa UNA vez por conversación: repetirlo es apagar el canal", () => {
  const { state, turns } = run([PIDE_HUMANO, "hola?", "alguien?", "sigo acá", "por favor"]);
  const total = turns.reduce((n, t) => n + notifyOf(t).filter((a) => a.kind === KIND).length, 0);
  assert.equal(total, 1, "un cliente insistente no puede disparar un aviso por mensaje");
  assert.ok(state.handoffMudoAvisadoAt, "no quedó registrado que ya se avisó");
});

// ---------------------------------------------------------------------------
// 3. La otra mitad: si el humano SI entró, el silencio es limpio y mudo
// ---------------------------------------------------------------------------

test("con un humano a cargo NO avisa: Sergio ya está adentro y sabe que le escriben", () => {
  const { state: derivado } = run([PIDE_HUMANO, "hola? sigo esperando"]);
  const conHumano = { ...derivado, humanTookOver: true, humanTookOverAt: T0 };

  const { turns } = run(["alguien me lee?"], { state: conHumano });
  assert.deepEqual(notifyOf(turns[0]), [], "avisarle de un mensaje que está leyendo es ruido");
  assert.equal(turns[0].replies.length, 0, "y el bot sigue callado, que es lo correcto");
});

// ---------------------------------------------------------------------------
// 4. El aviso tiene que ser LEGIBLE: sin etiqueta, Sergio recibe el slug interno
// ---------------------------------------------------------------------------

test("el kind nuevo tiene etiqueta propia en el aviso de Telegram", () => {
  assert.ok(ETIQUETAS[KIND], `sin etiqueta, construirAviso manda el slug crudo "${KIND}"`);
  assert.match(ETIQUETAS[KIND], /\S/);
});
