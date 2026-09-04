// ONIA — el SIMULADOR tiene que contestar lo mismo que el bot vivo.
//
// POR QUE EXISTE ESTE ARCHIVO. `simulate.mjs` es el instrumento con el que el carril chatbot mide
// su objetivo cada vuelta ("3/3 preguntas bien en el simulador"). Hasta el 2026-09-04 armaba la
// config con `DEFAULT_CONFIG` pelado, o sea SIN el documento publicado que produccion si carga
// para los inboxes de venta (4 web y 5 WhatsApp). Resultado medido ese dia: a "¿cuánto cuesta el
// sistema?" el simulador contestaba «el número exacto te lo pasa Sergio en la demo» mientras el
// bot vivo, en la MISMA hora, contestaba «Bs 320 el Básico, Bs 750 el Profesional, Bs 1.500 el
// Completo, chatbot Bs 390» (conversacion 49 de Chatwoot, mensaje 418).
//
// Un instrumento que da ROJO sobre algo que en produccion esta VERDE no es conservador: manda a
// la vuelta siguiente a reabrir un bug cerrado, que es exactamente el gasto que este loop existe
// para no repetir. La regla que fija este test: el simulador corre con el MISMO documento que se
// despliega, y si no lo puede cargar lo DICE en vez de mostrar un guion que nadie sirve.

import assert from "node:assert/strict";
import test from "node:test";

import { DEFAULT_CONFIG } from "./config.mjs";
import { createState, step } from "./bot-engine.mjs";
import { MONTOS_PERMITIDOS } from "./precios-publicos.mjs";
import { buildConfig, cargarConocimientoPublicado, configParaGuion, CONOCIMIENTO_PUBLICADO } from "./simulate.mjs";

const RECIBIDO = "2026-09-04T18:00:00.000Z";

function preguntar(config, texto) {
  const state = createState({ channel: "sim", contactRef: "test-simulador" });
  const { replies } = step(
    state,
    { kind: "text", text: texto, receivedAt: RECIBIDO, externalMessageId: "t-1" },
    { config },
  );
  return replies.map((reply) => String(reply.text || "")).join("\n");
}

test("el simulador arranca con el documento publicado, el mismo que corre en produccion", () => {
  const { data, aviso } = cargarConocimientoPublicado();
  assert.equal(aviso, null, `el documento publicado no carga: ${aviso}`);
  assert.ok(data, "sin documento el simulador mide un guion que ningun inbox sirve");
  assert.equal(data.schema, "onia.bot.knowledge/1");
});

test("a la pregunta de precio contesta con los montos PUBLICOS, no con 'te lo pasa un humano'", () => {
  const texto = preguntar(buildConfig({}), "¿cuánto cuesta el sistema?");

  // Los dos que un lead pregunta primero: el plan de entrada y el add-on del chatbot.
  assert.match(texto, /\b320\b/, "falta el plan Básico (subscription-plans.ts)");
  assert.match(texto, /\b390\b/, "falta el chatbot de WhatsApp (pricing.ts)");
  assert.doesNotMatch(
    texto,
    /el número exacto te lo pasa/,
    "sigue sirviendo el guion sin precio: el simulador no cargo el documento publicado",
  );

  // Ninguna cifra de plata puede ser una que el bot no tenga permitido decir.
  for (const [, monto] of texto.matchAll(/\bBs\s*\.?\s*(\d[\d.,]*)/gi)) {
    const valor = Number(String(monto).replace(/\./g, "").replace(",", "."));
    assert.ok(MONTOS_PERMITIDOS.has(valor), `el simulador dice Bs ${monto}, que no esta en precios-publicos.mjs`);
  }
});

test("sin el documento (o roto) NO inventa: se queda con el codigo y AVISA", () => {
  const avisos = [];
  const config = buildConfig({}, { path: "/no/existe/knowledge.onia.json", warn: (linea) => avisos.push(linea) });

  assert.equal(config, DEFAULT_CONFIG, "sin documento valido tiene que degradar al guion del codigo, sin mezclar");
  assert.equal(avisos.length, 1, "un instrumento que no puede medir lo dice; callarselo es el modo de falla caro");
  assert.match(avisos[0], /conocimiento/i);
});

test("--sin-conocimiento sirve el guion pelado del codigo, para poder comparar los dos", () => {
  assert.equal(buildConfig({ sinConocimiento: true }), DEFAULT_CONFIG);
  assert.notEqual(buildConfig({}), DEFAULT_CONFIG, "sin la bandera manda el documento publicado");
});

test("el documento publicado es el que se despliega, no una copia de adorno", () => {
  assert.match(CONOCIMIENTO_PUBLICADO, /knowledge\.onia\.json$/);
});

test("el bot de un CLIENTE no hereda el conocimiento de Onia: contestaria NUESTROS precios", () => {
  // En produccion el bot de una org se arma con el codigo + la fila publicada DE ESA org. Si el
  // simulador lo armara encima del documento de Onia, la ferreteria tendria cargado "Bs 320 al
  // mes … onia.com.bo/precios" para contestarle a un cliente suyo que pregunta por un rollo de cable.
  //
  // ⚠️ Esto mira el ESTADO (la plantilla cargada), no el mensaje: la primera version de este test
  // mandaba "¿cuánto cuesta?" y pasaba en falso, porque en modo recepcionista esa pregunta no
  // llega a M4_BODY — la fuga estaba igual, cargada y esperando otra rama.
  const cliente = configParaGuion("recepcionista-ferreteria", buildConfig({}), buildConfig({ sinConocimiento: true }));

  assert.doesNotMatch(
    cliente.script.M4_BODY,
    /\b320\b|onia\.com\.bo/i,
    "se filtro el conocimiento de Onia al bot de un cliente",
  );
  assert.equal(cliente.identity.productName, "Ferretería El Tornillo");
});
