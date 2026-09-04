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
  // `env: {}` para no depender de si QUIEN corre el test tiene ONIA_BOT_SLOTS: sin fijarlo, este
  // caso pasaba o fallaba segun el entorno. Y se filtra por tema en vez de contar el total, que
  // desde que hay dos cosas sobre las que avisar (documento y horarios) ya no mide este defecto.
  const config = buildConfig({}, { path: "/no/existe/knowledge.onia.json", env: {}, warn: (linea) => avisos.push(linea) });

  assert.equal(config, DEFAULT_CONFIG, "sin documento valido tiene que degradar al guion del codigo, sin mezclar");
  const delDocumento = avisos.filter((linea) => /conocimiento/i.test(linea));
  assert.equal(delDocumento.length, 1, "un instrumento que no puede medir lo dice; callarselo es el modo de falla caro");
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

// ---------------------------------------------------------------------------
// LOS HORARIOS — la otra mitad de "el simulador corre con el artefacto de produccion"
//
// La cabecera de este archivo ya fija esa regla para el DOCUMENTO publicado. Los horarios
// quedaron afuera, y fallan en las DOS direcciones (medido el 2026-09-04):
//
//  1. FALSO ROJO. `--slots` con el formato REAL — el de ONIA_BOT_SLOTS, "etiqueta@ISO" — usaba la
//     cadena entera como etiqueta visible, asi que el guion mostraba «sábado 5 de septiembre,
//     09:00@2026-09-05T13:00:00Z». Copiando los slots de produccion para reproducir su guion,
//     el simulador pinta la tripa interna en la cara del cliente y parece el bug mas famoso del
//     proyecto (el login con los nombres de los iconos). Produccion estaba SANA: el mensaje 448
//     de la conversacion 49 dice «**A)** viernes 4 de septiembre, 14:00», sin timestamp.
//
//  2. FALSO VERDE, y es el peor. Sin `--slots` el simulador cae SIEMPRE en la rama
//     `M0_SIN_HORARIOS`, y produccion tiene ONIA_BOT_SLOTS cargado (lo repone un cron diario).
//     O sea que el "3/3 en el simulador" que este carril reporta cada vuelta certificaba un
//     guion que ningun prospecto ve. Es la trampa de las variantes HERMANAS otra vez.
//
// El parser correcto ya existia y estaba exportado (`parseSlotsSpec`, followup-run.mjs:83):
// simulate.mjs era el unico que lo reimplementaba, y lo reimplementaba mal.

test("--slots con el formato REAL de produccion no filtra el ISO al guion que ve el cliente", () => {
  const config = buildConfig({ slots: "sábado 5 de septiembre, 09:00@2026-09-05T13:00:00Z|lunes 7 de septiembre, 14:00@2026-09-07T18:00:00Z" });

  assert.equal(config.slots[0].label, "sábado 5 de septiembre, 09:00");
  assert.equal(config.slots[0].startAt, "2026-09-05T13:00:00Z", "el ISO no se tira: es lo que reserva la demo");
  assert.equal(config.slots[1].label, "lunes 7 de septiembre, 14:00");

  // Y sobre todo: que no se vea. El guion es la superficie que lee un desconocido.
  const texto = preguntar(config, "hola, quiero información");
  assert.doesNotMatch(texto, /@?\d{4}-\d{2}-\d{2}T/, "el timestamp interno se esta mostrando al prospecto");
  assert.match(texto, /sábado 5 de septiembre, 09:00/);
});

test("sin --slots toma ONIA_BOT_SLOTS del entorno, que es de donde los lee produccion", () => {
  const env = { ONIA_BOT_SLOTS: "sábado 5 de septiembre, 09:00@2026-09-05T13:00:00Z|lunes 7 de septiembre, 14:00@2026-09-07T18:00:00Z" };
  const config = buildConfig({}, { env });

  assert.equal(config.slots[0].label, "sábado 5 de septiembre, 09:00");
  assert.doesNotMatch(
    preguntar(config, "hola, quiero información"),
    /no tengo horarios libres/i,
    "el simulador sirve la rama SIN_HORARIOS mientras produccion ofrece dos: mide el guion equivocado",
  );
});

test("sin horarios por ningun lado NO se lo calla: dice que esa NO es la rama de produccion", () => {
  const avisos = [];
  buildConfig({}, { env: {}, warn: (linea) => avisos.push(linea) });

  const deHorarios = avisos.filter((linea) => /horario/i.test(linea));
  assert.equal(deHorarios.length, 1, "un instrumento que mide otra rama que produccion tiene que decirlo");
  assert.match(deHorarios[0], /ONIA_BOT_SLOTS/, "el aviso nombra el dato que falta, para poder repararlo");
});
