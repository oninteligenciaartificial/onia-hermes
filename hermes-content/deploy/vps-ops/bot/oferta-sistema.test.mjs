#!/usr/bin/env node
// El primer mensaje que ve un desconocido vende el SISTEMA, no el chatbot. Correr:
//   node --test hermes-content/deploy/vps-ops/bot/oferta-sistema.test.mjs
//
// ORIGEN (medido el 2026-09-04, tarea t_d3f02b65). Sergio, 2026-09-03: "el sistema no ofrece
// directamente el bot, ofrece solo el sistema". CLAUDE.md seccion 3: "El SISTEMA es la oferta; el
// chatbot es un add-on (pricing.ts), nunca el titular".
//
// El bot rompia esa regla en su PRIMERA linea, y lo hacia de la forma mas cara de detectar: el
// guion tiene DOS bienvenidas hermanas (bot-engine.mjs:388, `sinHorarios ? M0_SIN_HORARIOS : M0`)
// y solo una estaba corregida.
//   - M0_SIN_HORARIOS  ya decia "una plataforma por modulos ... agenda, cobros, clientes"  OK
//   - M0               decia "esto que estas viendo es justo lo que vendemos: un asistente
//                      que atiende tu WhatsApp 24/7"                                       ROTO
// Como solo se cae en M0_SIN_HORARIOS cuando no hay horarios cargados, la variante ROTA es la que
// ve casi todo el mundo: mensajes 412 y 416 de la conversacion 49 de Chatwoot, en vivo. Y en la
// MISMA conversacion el turno siguiente (mensaje 418) ya vendia bien el sistema ("el sistema
// arranca en Bs 320 al mes"): el turno 1 vendia el add-on y el turno 3 el producto.
//
// Es el caso exacto que CLAUDE.md llama "una promesa que cambia se barre en TODA la superficie, no
// solo donde la estabas tocando". Por eso este test recorre las DOS bienvenidas y no solo la que
// estaba rota: arreglar una y dejar la hermana es como nacio el bug.
//
// Se mide sobre el texto RENDERIZADO por el motor y con `knowledge.onia.json`, el documento que
// produccion carga para los inboxes 4 y 5 — no sobre la plantilla pelada. Un harness que arma su
// propia config diverge de produccion en silencio (lo que costo la vuelta del 2026-09-03).
import assert from "node:assert/strict";
import { test } from "node:test";

import { createState, step } from "./bot-engine.mjs";
import { buildConfig } from "./simulate.mjs";

const T0 = "2026-07-27T14:05:00Z"; // lunes 10:05 en La Paz: dentro de horario

// La rama SIN horarios hay que PEDIRLA, y por eso se fija el ambiente entero: desde que
// `buildConfig` cae al `webhook.env` desplegado (2026-09-04), en el VPS —que tiene dos horarios
// cargados— `buildConfig({})` devuelve M0 y este archivo medía dos veces la MISMA hermana,
// dejando sin cubrir justo la variante que motivó el test. Lo cazó el `assert.equal(key, ...)`
// de abajo: un test que además verifica QUÉ rama midió es lo que evita ese verde falso.
// El reloj es el del caso (`T0`): los horarios de acá no traen fecha, pero un archivo con instante
// propio lo pasa siempre (test-con-fecha-fija-pasa-el-reloj.test.mjs).
const SIN_AMBIENTE = { env: {}, envFile: "/no/existe/webhook.env", now: Date.parse(T0) };

// Agenda propia ENCENDIDA y sin horarios cargados: la unica forma de pedir M0_SIN_HORARIOS desde el
// 2-oct. Sin `ONIA_BOT_AGENDA=calcom` el bot no ofrece horarios y saluda con M0_PERSONA.
const CON_AGENDA_SIN_HORARIOS = {
  env: { ONIA_BOT_AGENDA: "calcom", CALCOM_BASE_URL: "http://calcom:3000", CALCOM_BOT_EVENT_TYPE_ID: "5" },
  envFile: "/no/existe/webhook.env",
  now: Date.parse(T0),
  warn: () => {},
};

/** El saludo tal como sale al cliente, con el conocimiento publicado aplicado. */
function saludar({ rama }) {
  const config =
    rama === "M0"
      ? buildConfig({ slots: "viernes 4 de septiembre, 14:00|sábado 5 de septiembre, 09:00" }, SIN_AMBIENTE)
      : rama === "M0_SIN_HORARIOS"
        ? buildConfig({}, CON_AGENDA_SIN_HORARIOS)
        : buildConfig({}, { ...SIN_AMBIENTE, warn: () => {} });
  const result = step(
    createState({ channel: "sim", contactRef: "desconocido" }),
    { text: "Hola, quiero informacion sobre el sistema", receivedAt: T0 },
    { config },
  );
  return {
    key: result.replies[0].templateKey,
    texto: result.replies.map((reply) => reply.text).join("\n"),
  };
}

// Las dos ramas de bot-engine.mjs:388. La de "sin horarios" es la que ya estaba bien: va en la
// lista para que no se rompa al revés el día que alguien reescriba la otra.
// Desde el 2-oct son TRES hermanas: sin agenda propia (`ONIA_BOT_AGENDA`, el default de
// produccion) el bot saluda con M0_PERSONA — la que hoy ve casi todo el mundo. Las tres van en la
// lista por la misma razon de siempre: corregir una y dejar la hermana es como nacio el bug.
const BIENVENIDAS = [
  { nombre: "con horarios que ofrecer (M0)", rama: "M0" },
  { nombre: "sin horarios que ofrecer (M0_SIN_HORARIOS)", rama: "M0_SIN_HORARIOS" },
  { nombre: "sin agenda propia (M0_PERSONA — el default de produccion)", rama: "M0_PERSONA" },
];

// Lo que el sistema HACE. Se piden DOS de estas y no la palabra "sistema" suelta: si alcanzara con
// nombrarla, el test se satisface metiendo "sistema" en cualquier lado sin cambiar la oferta.
const LO_QUE_HACE_EL_SISTEMA = /plataforma|módulos|modulos|agenda|cobros|clientes|gestión|gestion/gi;

// La construccion que pone al add-on de titular: un verbo de venta y, en la misma oracion, el bot
// como el objeto vendido. NO alcanza con prohibir la palabra "bot": el disclosure de D2 la exige.
const VENDE_EL_BOT = /(vendemos|ofrecemos|te ofrezco|lo que hacemos)[^.\n]{0,80}(asistente|bot|chatbot)[^.\n]{0,60}(atiende|responde|contesta|califica|agenda)/i;

for (const { nombre, rama } of BIENVENIDAS) {
  test(`la bienvenida ${nombre} presenta el sistema, no el chatbot`, () => {
    const { key, texto } = saludar({ rama });
    assert.equal(key, rama, "se midio la rama que se creia");

    const nombra = [...new Set((texto.match(LO_QUE_HACE_EL_SISTEMA) || []).map((w) => w.toLowerCase()))];
    assert.ok(
      nombra.length >= 2,
      `el saludo tiene que decir que es el sistema y para que sirve; solo nombro ${JSON.stringify(nombra)} en:\n${texto}`,
    );

    assert.ok(
      !VENDE_EL_BOT.test(texto),
      `el chatbot es un add-on (pricing.ts), nunca el titular de la oferta. Saludo:\n${texto}`,
    );
  });

  // D2 no se negocia, y es la forma mas facil de "arreglar" mal lo de arriba: borrar la linea que
  // declara al bot. Si eso pasa, este test se cae en vez de dejar pasar un bot que se hace pasar
  // por humano.
  test(`la bienvenida ${nombre} sigue declarandose bot en la primera linea (D2)`, () => {
    const { texto } = saludar({ rama });
    const primeraLinea = texto.split("\n")[0];
    assert.match(
      primeraLinea,
      /bot|asistente automático|asistente automatico/i,
      `D2: el disclosure va en la PRIMERA linea. Salio: ${primeraLinea}`,
    );
  });
}

// El bot puede (y debe) poder vender el chatbot: es un add-on real de pricing.ts. Lo que no puede
// es ponerlo de titular en la bienvenida. Sin este caso, el arreglo correcto seria "que el bot
// nunca hable del chatbot", que es otra forma de romper la oferta.
test("el add-on de chatbot se sigue pudiendo nombrar cuando preguntan el precio", () => {
  const config = buildConfig({ slots: "viernes 4 de septiembre, 14:00|sábado 5 de septiembre, 09:00" }, SIN_AMBIENTE);
  let state = createState({ channel: "sim", contactRef: "desconocido" });
  const primero = step(state, { text: "Hola", receivedAt: T0 }, { config });
  const segundo = step(
    primero.nextState,
    { text: "¿Cuánto cuesta?", receivedAt: "2026-07-27T14:07:00Z" },
    { config },
  );
  const texto = segundo.replies.map((reply) => reply.text).join("\n");
  assert.match(texto, /chatbot/i, "el add-on se nombra cuando corresponde: en el precio");
  assert.match(texto, /aparte|add-?on|adicional/i, "y se nombra COMO add-on, no como el producto");
});
