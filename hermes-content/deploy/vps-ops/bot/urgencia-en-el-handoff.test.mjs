// ONIA — El bot PROMETE una palabra y esa palabra tiene que hacer algo.
//   node --test "hermes-content/deploy/vps-ops/bot/urgencia-en-el-handoff.test.mjs"
//
// POR QUE EXISTE. Medido el 2026-09-10 en el simulador, con el guion desplegado:
//
//   vos > quiero hablar con una persona
//     [M5] "... Si es urgente, decime \"urgente\" y lo marco."
//   vos > quiero comprar el sistema, cuando puedo pagar
//     [M5_ACUSE] "Te leo, y esto tambien se lo paso a Sergio"        <- acuse generico
//   vos > en serio, quiero pagar hoy mismo
//     (el bot NO responde)                    [notas] silencio:handoff_en_curso
//
// Y `grep -rn "urgente" *.mjs` devolvia SOLO los dos literales del guion: la deteccion no
// existia en ninguna parte. O sea que el bot le decia al prospecto exactamente que palabra
// escribir para que lo marquen, y esa palabra caia en el acuse generico la primera vez y en
// SILENCIO TOTAL las siguientes, sin que nadie se enterara.
//
// LA CLASE, que es la que este archivo cuida y no una instancia: **el guion le pide al
// prospecto una accion y el motor no la escucha.** Ningun gate del carril podia verla —
// no sobra ninguna palabra (el texto es correcto y amable), no falta un rubro, el precio
// sale de la fuente y el camino feliz anda. Lo que esta mal es el par
// (lo que el guion PIDE, lo que el motor HACE con eso).
//
// El caso `promesa` de abajo deriva sus sujetos del SCRIPT leido del disco, asi que un
// mensaje NUEVO que prometa la palabra nace cubierto: si manana alguien escribe un tercer
// texto con la misma promesa y no hay deteccion, este archivo se pone rojo solo.

import test from "node:test";
import assert from "node:assert/strict";

import { createBotConfig, SCRIPT } from "./config.mjs";
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

const effectsOf = (r) => r.sideEffects.map((e) => e.type);
const notifyOf = (r) => r.sideEffects.filter((e) => e.type === "notify_sergio").map((e) => e.payload);
const textOf = (r) => r.replies.map((x) => x.text).join("\n");

/** Deriva al bot a un humano y deja la conversacion en `handoff_humano`. */
const PIDE_HUMANO = "quiero hablar con una persona";

// ---------------------------------------------------------------------------
// 1. La promesa del guion se cumple
// ---------------------------------------------------------------------------

test("el que escribe la palabra que el guion le pidió queda marcado, y Sergio se entera", () => {
  const { state, turns } = run([PIDE_HUMANO, "urgente"]);
  assert.equal(turns[0].nextState.botStage, "handoff_humano", "precondición: el bot derivó");

  const avisos = notifyOf(turns[1]);
  assert.equal(avisos.length, 1, 'escribir "urgente" en el handoff no avisó a nadie');
  assert.equal(avisos[0].kind, "handoff_urgente");
  assert.match(String(avisos[0].text || ""), /urgente/i, "el aviso no dice por qué es urgente");
  assert.ok(textOf(turns[1]).trim().length > 0, "el bot se calló ante un pedido de urgencia");
  assert.ok(state.urgenteAvisadoAt, "no quedó registrado que ya se marcó");
});

// ---------------------------------------------------------------------------
// 2. La señal más cara que existe: quiere comprar (T5 de la cola de la v1.0)
// ---------------------------------------------------------------------------

test("una señal de COMPRA en el handoff avisa; hoy recibía el acuse genérico", () => {
  const { turns } = run([PIDE_HUMANO, "quiero comprar el sistema, cuándo puedo pagar"]);
  const avisos = notifyOf(turns[1]);
  assert.equal(avisos.length, 1, "el mensaje más caliente que existe no avisó a nadie");
  assert.equal(avisos[0].kind, "handoff_urgente");
});

test("el SEGUNDO mensaje del handoff también se escucha: hoy era silencio total", () => {
  // El acuse se gasta con el primer inbound. Antes de este arreglo, todo lo que llegaba
  // después caía en `silencio:handoff_en_curso` — incluida una señal de compra.
  const { turns } = run([PIDE_HUMANO, "gracias, quedo atento", "quiero contratarlo, cómo pago"]);
  assert.deepEqual(effectsOf(turns[1]), [], "precondición: un mensaje común sigue sin efectos");
  assert.equal(notifyOf(turns[2]).length, 1, "la compra llegó en el 2.º turno y murió en silencio");
});

// ---------------------------------------------------------------------------
// 3. Una sola vez: el canal de Sergio Urcullo ya está saturado
// ---------------------------------------------------------------------------

test("se marca UNA sola vez por conversación: insistir no vuelve a avisar", () => {
  const { turns } = run([PIDE_HUMANO, "urgente", "urgente en serio", "es muy urgente"]);
  assert.equal(notifyOf(turns[1]).length, 1);
  assert.equal(notifyOf(turns[2]).length, 0, "el segundo pedido volvió a avisar: eso es spam");
  assert.equal(notifyOf(turns[3]).length, 0);
});

test("un mensaje común en el handoff sigue siendo acuse y después silencio", () => {
  const { turns } = run([PIDE_HUMANO, "buenas, quedo a la espera", "sigo esperando"]);
  assert.deepEqual(turns[1].replies.map((r) => r.templateKey), ["M5_ACUSE"]);
  assert.deepEqual(turns[2].replies, [], "se rompió el anti-spam que ya existía");
});

// ---------------------------------------------------------------------------
// 4. ANCLA DE LA CLASE — derivada del SCRIPT, no de una lista escrita a mano
// ---------------------------------------------------------------------------

test("todo mensaje del guion que le pida una palabra al prospecto tiene que ser escuchado", () => {
  // Sujeto derivado del disco: cualquier texto del guion con la forma
  // `decime "X" y lo marco` / `decí "X"` o, en usted (3-oct), `dígame "X"`. Hoy son M5 y M8_SOPORTE (la hermana de soporte,
  // que es justo la que se olvida al arreglar sólo la que motivó el arreglo).
  const pedidos = [];
  for (const [clave, valor] of Object.entries(SCRIPT)) {
    if (typeof valor !== "string") continue;
    for (const m of valor.matchAll(/(?:dec(?:ime|í|i)|d[ií]game|diga)\s+"([^"]+)"/gi)) pedidos.push({ clave, palabra: m[1] });
  }
  assert.ok(pedidos.length >= 2, `el detector no encontró los pedidos del guion (halló ${pedidos.length})`);

  for (const { clave, palabra } of pedidos) {
    const { turns } = run([PIDE_HUMANO, palabra]);
    assert.equal(
      notifyOf(turns[1]).length,
      1,
      `${clave} promete que decir "${palabra}" lo marca, y el motor no hace nada con esa palabra`,
    );
  }
});

// ---------------------------------------------------------------------------
// 5. El aviso llega legible: un kind sin etiqueta le muestra a Sergio un slug interno
// ---------------------------------------------------------------------------

test("el aviso urgente tiene etiqueta propia en Telegram, no el slug crudo", () => {
  const { turns } = run([PIDE_HUMANO, "urgente"]);
  const kind = notifyOf(turns[1])[0].kind;
  assert.ok(ETIQUETAS[kind], `el kind ${kind} no tiene etiqueta: Sergio recibiría el slug interno`);
});

// ---------------------------------------------------------------------------
// 6. El campo nuevo sobrevive al viaje a la base (la trampa de `raw`)
// ---------------------------------------------------------------------------

test("`urgenteAvisadoAt` está en las TRES listas de `raw` o se pierde en silencio", async () => {
  // Ya mordió dos veces con `handoffAckAt` y `branchAsked`: el motor los seteaba, la base
  // nunca los recibía, y el acuse salía tres veces seguidas en la conversación real de
  // Sergio Urcullo (conv 11, 2026-09-10). Se afirma sobre las funciones, no sobre el texto.
  const { toConversationRow } = await import("./bot-engine.mjs");
  const { stateFromRow } = await import("./persistence.mjs");
  const marcado = "2026-07-27T14:07:00.000Z";

  const fila = toConversationRow({ ...createState({ channel: "sim", contactRef: "t" }), urgenteAvisadoAt: marcado });
  assert.equal(fila.raw.urgenteAvisadoAt, marcado, "toConversationRow no lo guarda");

  const vuelta = stateFromRow({ ...fila, conversation_key: "sim:t", bot_stage: "handoff_humano" });
  assert.equal(vuelta.urgenteAvisadoAt, marcado, "stateFromRow no lo restaura: se marcaría dos veces");
});
