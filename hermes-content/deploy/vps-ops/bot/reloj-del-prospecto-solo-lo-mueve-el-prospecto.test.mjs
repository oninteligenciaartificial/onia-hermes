/**
 * `last_inbound_at` es el reloj DEL PROSPECTO: dice cuando hablo EL, y nadie mas puede moverlo.
 *
 * `step()` lo pisaba con el `receivedAt` de CUALQUIER mensaje que entrara al motor, sin preguntar
 * quien lo escribio — y al motor tambien entra lo que sale de NUESTRO lado: cuando un humano
 * contesta desde la bandeja, Chatwoot manda ese saliente por webhook y el adapter lo convierte en
 * un turno con `author: "human"` (chatwoot-adapter.mjs, takeoverTurn). La linea de arriba, la que
 * decide si la conversacion vencio, SI pregunta (`msg.author === "contact"`); la del reloj no.
 *
 * MEDIDO EN PRODUCCION el 2026-09-18 sobre un lead REAL de WhatsApp (conv 58, +59175755019, el
 * unico desconocido vivo del inbox 5):
 *
 *   - `messages` de Chatwoot: UN solo mensaje entrante, el 2026-09-17 22:50:55Z ("Hola, vengo de
 *     la web de Onia. Quiero saber si me sirve para mi negocio.").
 *   - el 2026-09-18 19:17:02Z le sale el follow-up M3, SALIENTE.
 *   - `/tmp/onia-bot-webhook.log`: `conv=58 msg=1437 rama=MUDO etapa=esperando_horario->
 *     esperando_horario` — o sea ese saliente NUESTRO entro al motor y se persistio el estado.
 *   - `onia_center.bot_conversations` chatwoot:58: `last_inbound_at = 2026-09-18 19:17:02.925+00`.
 *
 * El prospecto no habia vuelto a escribir: su reloj se corrio 20,4 h hacia adelante solo, con
 * nuestro propio mensaje. Los tres consumidores del reloj deciden A QUIEN ESCRIBIRLE:
 *
 *   1. `sweepInsistenciaCandidates` (persistence.mjs) lo usa como LA VENTANA DE 24 H DE META, que
 *      Meta cuenta desde el ultimo mensaje DEL USUARIO. Con el reloj corrido por un mensaje
 *      nuestro, el bot cree que la ventana sigue abierta cuando ya se cerro: el envio se rechaza
 *      o se cobra como plantilla. Ese barrido es el multi-tenant — lo paga el cliente del cliente
 *      con el quality rating de SU linea.
 *   2. `sweepFollowUpCandidates` / `followUpDue` eligen por el SILENCIO del prospecto. Un lead que
 *      calla se ve "recien hablado" y se cae de la ventana de rescate (caso 3 de abajo).
 *   3. `sweepFollowUpVencidas` cuenta a los colgados: con el reloj corrido, el corte de 7 dias se
 *      corre con el.
 *
 * La clase ya se habia pagado una vez en la fila de `bot_messages` (run-turn.mjs:402, "dos mensajes
 * NUESTROS atribuidos al prospecto", 2026-08-13) y la cura no viajo al reloj del estado.
 */
import test from "node:test";
import assert from "node:assert/strict";

import { createState, followUpDue, step } from "./bot-engine.mjs";
import { DEFAULT_CONFIG } from "./config.mjs";

/** Los instantes reales de la conv 58. */
const HABLO_EL_PROSPECTO = "2026-09-17T22:50:55.884Z";
const HABLAMOS_NOSOTROS = "2026-09-18T19:17:02.925Z";

/** El estado tal como quedo en `bot_conversations` despues del primer turno. */
function esperandoHorario() {
  return createState({
    channel: "chatwoot",
    contactRef: "58",
    botStage: "esperando_horario",
    slotsOffered: DEFAULT_CONFIG.slots,
    lastInboundAt: HABLO_EL_PROSPECTO,
    lastOutboundAt: HABLO_EL_PROSPECTO,
  });
}

/**
 * El turno del traspaso, igual al que arma `takeoverTurn` del adapter: sin texto, autor "human".
 * Es la forma exacta con la que entro el follow-up de la conv 58, posteado con la cuenta humana.
 */
const TRASPASO = { text: "", author: "human", receivedAt: HABLAMOS_NOSOTROS };

test("un mensaje NUESTRO que vuelve por el webhook no mueve el reloj del prospecto", () => {
  const { nextState } = step(esperandoHorario(), TRASPASO, { config: DEFAULT_CONFIG });

  assert.equal(
    nextState.lastInboundAt,
    HABLO_EL_PROSPECTO,
    "el reloj tiene que seguir marcando cuando hablo EL, no cuando hablamos nosotros",
  );
});

test("tampoco lo mueve un mensaje atribuido al bot", () => {
  const { nextState } = step(
    esperandoHorario(),
    { text: "", author: "bot", receivedAt: HABLAMOS_NOSOTROS },
    { config: DEFAULT_CONFIG },
  );

  assert.equal(nextState.lastInboundAt, HABLO_EL_PROSPECTO);
});

test("el prospecto SI lo mueve — la direccion simetrica, para que el reloj no quede congelado", () => {
  const { nextState } = step(
    esperandoHorario(),
    { text: "A", author: "contact", receivedAt: HABLAMOS_NOSOTROS },
    { config: DEFAULT_CONFIG },
  );

  assert.equal(
    nextState.lastInboundAt,
    HABLAMOS_NOSOTROS,
    "un entrante de verdad tiene que adelantar el reloj: sin esto el bot lo perseguiria para siempre",
  );
});

test("el lead no se cae de la ventana de rescate porque le escribimos nosotros", () => {
  // 2026-09-18 20:00Z: el prospecto lleva 21,2 h callado, o sea todavia dentro de la ventana de
  // rescate (afterHours 20, staleAfterDays 7). Con el reloj pisado lleva 0,7 h y no lo rescata nadie.
  const AHORA = "2026-09-18T20:00:00.000Z";
  const inicial = esperandoHorario();

  assert.equal(followUpDue(inicial, AHORA, DEFAULT_CONFIG), true, "precondicion: antes califica");

  const { nextState } = step(inicial, TRASPASO, { config: DEFAULT_CONFIG });

  assert.equal(
    followUpDue(nextState, AHORA, DEFAULT_CONFIG),
    true,
    "que un mensaje nuestro pase por el motor no puede sacar al lead de la ventana de rescate",
  );
});
