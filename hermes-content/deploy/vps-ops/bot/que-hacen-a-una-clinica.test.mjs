#!/usr/bin/env node
// «¿Qué hacen?» a quien YA dijo su rubro se contesta con SU módulo. Correr:
//   node --test hermes-content/deploy/vps-ops/bot/que-hacen-a-una-clinica.test.mjs
//
// ORIGEN (2026-09-30, preparando la pauta dental). Medido en el motor con `knowledge.onia.json`:
// el dueño de una clínica que llega por el anuncio («…Tengo una clínica dental.») y pregunta
// «¿qué hacen exactamente?» recibía el catálogo ENTERO: Dental, Comercio, Servicios, Importadora,
// Estética y spa, y «Y además hacemos la web de tu negocio, un chatbot de WhatsApp con IA, videos e
// influencers con IA, conexión y publicación en redes y automatizaciones a medida».
//
// Tres reglas rotas a la vez, las tres de CLAUDE.md:
//   · «El SISTEMA es la oferta… cero autobombo»: a una clínica que pagamos por traer se le ofrecían
//     cinco líneas de negocio que no son la suya, justo en la pregunta donde decide si le sirve.
//   · El test de tres preguntas (estrategia §10): la web, los videos y los influencers FALLAN — no
//     son add-ons de su sistema, son otros negocios. Nombrarlos en la venta los vuelve a abrir.
//   · «con IA» sin serlo: el chatbot que se le vende a un cliente es el modo recepcionista, y
//     recepcionista.mjs lo dice en su regla 4: «SIN LLM. Decisión consciente». La nota
//     `research/onia-1.0-29sep/VENDIBLE_VS_COMPETENCIA.md` ya lo marcaba como hueco.
//
// Lo que NO cambia: a quien no dijo rubro (o dijo uno sin módulo armado) se le sigue mostrando la
// lista entera — ahí el catálogo es justo lo que sirve para que diga cuál es el suyo.
import assert from "node:assert/strict";
import { test } from "node:test";

import { createState, step } from "./bot-engine.mjs";
import { DEFAULT_CONFIG } from "./config.mjs";
import { configComoProduccion } from "./config-como-produccion.mjs";
import { buildConfig } from "./simulate.mjs";

const T0 = "2026-09-30T19:00:00Z";
// El reloj de la config es el de la conversacion (`T0`), no el de la maquina: los horarios son
// fijos y sin esto vencen solos (hoy pasa solo porque los asserts no miran el horario).
const SIN_AMBIENTE = { env: {}, envFile: "/no/existe/webhook.env", now: Date.parse(T0) };
const HORARIOS = "jueves 2 de octubre, 14:00@2026-10-02T18:00:00Z|viernes 3 de octubre, 15:00@2026-10-03T19:00:00Z";
// CON AGENDA PROPIA (`--slots` a mano) y COMO PRODUCCION (3-oct, la persona coordina la demo): la
// respuesta al «¿qué hacen?» no depende de la agenda, y se mide en las dos para que no diverjan.
const CONFIG = buildConfig({ slots: HORARIOS }, SIN_AMBIENTE);
const PRODUCCION = configComoProduccion({ horarios: HORARIOS, now: Date.parse(T0) });

function turno(state, text, minuto = 0, config = CONFIG) {
  const receivedAt = new Date(Date.parse(T0) + minuto * 60000).toISOString();
  return step(state, { text, receivedAt }, { config });
}

function queHacenTras(primerMensaje, config = CONFIG) {
  const r1 = turno(createState({ channel: "chatwoot", contactRef: "qh" }), primerMensaje, 0, config);
  const r2 = turno(r1.nextState, "que hacen exactamente?", 1, config);
  const reply = r2.replies.find((r) => r.templateKey === "M_QUE_ES_ONIA");
  assert.ok(reply, "la pregunta se contesta con el catálogo");
  return reply.text;
}

for (const [rama, config] of [["como en producción", PRODUCCION], ["con agenda propia", CONFIG]]) {
  test(`${rama}: a la clínica dental que llega por el anuncio se le contesta con el módulo dental, sin las otras líneas`, () => {
    const texto = queHacenTras("Hola, vi el anuncio de Onia (D1). Tengo una clínica dental.", config);
    assert.match(texto, /\*Dental\*/);
    for (const ajeno of [/Comercio/, /Importadora/, /Estética/, /web de tu negocio/, /influencers/, /redes/]) {
      assert.doesNotMatch(texto, ajeno, `a una clínica no se le ofrece ${ajeno}`);
    }
  });
}

test("a la ferretería se le contesta con Comercio, no con Dental", () => {
  const texto = queHacenTras("Hola, tengo una ferreteria y quiero informacion");
  assert.match(texto, /\*Comercio\*/);
  assert.doesNotMatch(texto, /\*Dental\*/);
});

test("sin rubro, el catálogo entero sigue ahí (es lo que le sirve para decir cuál es el suyo)", () => {
  const r = turno(createState({ channel: "chatwoot", contactRef: "qh-sin" }), "que hacen ustedes?");
  const texto = r.replies.map((reply) => reply.text).join("\n");
  for (const modulo of [/\*Dental\*/, /\*Comercio\*/, /\*Estética y spa\*/]) assert.match(texto, modulo);
});

test("el chatbot que se le vende a un cliente no se anuncia «con IA»: atiende sin LLM (recepcionista.mjs, regla 4)", () => {
  const chatbot = DEFAULT_CONFIG.productos.find((producto) => producto.key === "chatbot");
  assert.ok(chatbot, "el chatbot sigue en el catálogo — es el add-on que sí pasa el test de tres preguntas");
  assert.doesNotMatch(chatbot.nombre, /\bIA\b|inteligencia artificial/i);
});
