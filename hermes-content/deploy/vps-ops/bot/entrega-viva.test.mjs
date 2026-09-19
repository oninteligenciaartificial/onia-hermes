// Gate de `entrega-viva.mjs`: el bot no "contesto" hasta que el mensaje LLEGO.
//
// Los fixtures no son inventados: salen de la base de Chatwoot del 2026-09-19 (los cinco
// salientes en `failed`, con sus codigos de error reales).

import test from "node:test";
import assert from "node:assert/strict";
import {
  ESTADO,
  causaEsGlobal,
  ultimoDeCadaConversacion,
  juzgarEntregas,
  esNuestraFila,
  lectura,
} from "./entrega-viva.mjs";

const T0 = Date.parse("2026-09-19T12:00:00Z");
const min = (n) => T0 + n * 60_000;
// El fallo real del inbox 3: 1-ago, siete semanas quieto.
const VIEJO = Date.parse("2026-08-01T06:31:00Z");

test("tri-estado: sin poder preguntar NO es verde", () => {
  assert.equal(juzgarEntregas({ salientes: null }).veredicto, "no-medido");
  assert.equal(juzgarEntregas({}).veredicto, "no-medido");
});

test("tri-estado: cero filas tampoco es verde — o el bot nunca contesto, o la consulta esta mal", () => {
  const r = juzgarEntregas({ salientes: [] });
  assert.equal(r.veredicto, "no-medido");
  assert.match(r.motivo, /No medir NO es estar bien/);
});

test("la ultima respuesta a un LEAD quedo failed -> rojo, y lo dice en la lectura", () => {
  const r = juzgarEntregas({
    salientes: [
      { id: 1, conv: 58, inbox: 5, estado: ESTADO.FAILED, creadoMs: min(0), error: "131026: undeliverable", nuestra: false },
    ],
  });
  assert.equal(r.veredicto, "rojo");
  assert.equal(r.sinLlegar.length, 1);
  assert.match(lectura(r).join("\n"), /NO LLEGO.*conv 58.*LEAD/s);
});

test("una causa GLOBAL con entrega posterior en el mismo inbox queda curada, no roja", () => {
  // El caso real de agosto: conv 11, `131042 Business eligibility payment issue`, y despues
  // el canal volvio a entregar (conv 58, 17-sep). Sin esta regla el gate queda rojo para
  // siempre sobre una tabla que nadie rota.
  const r = juzgarEntregas({
    salientes: [
      { id: 31, conv: 11, inbox: 5, estado: ESTADO.FAILED, creadoMs: min(0), error: "131042: Business eligibility payment issue", nuestra: true },
      { id: 1321, conv: 58, inbox: 5, estado: ESTADO.DELIVERED, creadoMs: min(10), error: "", nuestra: false },
    ],
  });
  assert.equal(r.veredicto, "ok");
  assert.equal(r.curados.length, 1);
});

test("la misma causa global SIN entrega posterior sigue roja — es el 1-oct", () => {
  const r = juzgarEntregas({
    salientes: [
      { id: 31, conv: 11, inbox: 5, estado: ESTADO.FAILED, creadoMs: min(10), error: "131042: Business eligibility payment issue", nuestra: true },
      { id: 30, conv: 11, inbox: 5, estado: ESTADO.READ, creadoMs: min(0), error: "", nuestra: true },
    ],
  });
  assert.equal(r.veredicto, "rojo", "una entrega ANTERIOR no cura nada: el canal se rompio despues");
});

test("un fallo POR SUJETO no lo cura que otro haya recibido despues", () => {
  const r = juzgarEntregas({
    salientes: [
      { id: 1, conv: 58, inbox: 5, estado: ESTADO.FAILED, creadoMs: min(0), error: "131026: Message undeliverable", nuestra: false },
      { id: 2, conv: 11, inbox: 5, estado: ESTADO.READ, creadoMs: min(10), error: "", nuestra: true },
    ],
  });
  assert.equal(r.veredicto, "rojo");
  assert.equal(r.sinLlegar[0].conv, 58);
});

test("un error desconocido se trata como POR SUJETO: falla hacia avisar", () => {
  assert.equal(causaEsGlobal("131099: algo nuevo que Meta invento"), false);
  assert.equal(causaEsGlobal(""), false);
  assert.equal(causaEsGlobal("131042: Business eligibility payment issue"), true);
  assert.equal(causaEsGlobal("Template not found or invalid template name"), true);
  assert.equal(causaEsGlobal("404 Not Found"), true);
});

test("el sujeto es el ULTIMO saliente de cada conversacion, no todos", () => {
  const ult = ultimoDeCadaConversacion([
    { id: 1, conv: 11, inbox: 5, estado: ESTADO.FAILED, creadoMs: min(0) },
    { id: 2, conv: 11, inbox: 5, estado: ESTADO.READ, creadoMs: min(5) },
  ]);
  assert.equal(ult.length, 1);
  assert.equal(ult[0].id, 2, "un fallo del medio que despues se recupero no dejo a nadie colgado");
});

test("dos filas del mismo instante: desempata el id, no el orden de llegada", () => {
  const ult = ultimoDeCadaConversacion([
    { id: 9, conv: 4, inbox: 4, estado: ESTADO.READ, creadoMs: min(1) },
    { id: 8, conv: 4, inbox: 4, estado: ESTADO.FAILED, creadoMs: min(1) },
  ]);
  assert.equal(ult[0].id, 9);
});

test("`nuestra` etiqueta y NO silencia: la fila propia sigue contando como rojo", () => {
  const r = juzgarEntregas({
    salientes: [
      { id: 1, conv: 11, inbox: 5, estado: ESTADO.FAILED, creadoMs: min(0), error: "131026", nuestra: true },
    ],
  });
  assert.equal(r.veredicto, "rojo", "callar un fallo porque parece nuestro esconde que el canal esta muerto");
});

test("los LEADS salen primero en el informe", () => {
  const r = juzgarEntregas({
    salientes: [
      { id: 1, conv: 11, inbox: 5, estado: ESTADO.FAILED, creadoMs: min(0), error: "131026", nuestra: true },
      { id: 2, conv: 58, inbox: 5, estado: ESTADO.FAILED, creadoMs: min(0), error: "131026", nuestra: false },
    ],
  });
  assert.equal(r.sinLlegar[0].conv, 58);
});

test("la cura de una causa global NO se derrama a otro inbox", () => {
  const r = juzgarEntregas({
    salientes: [
      { id: 1, conv: 11, inbox: 5, estado: ESTADO.FAILED, creadoMs: min(0), error: "131042 payment", nuestra: true },
      { id: 2, conv: 40, inbox: 4, estado: ESTADO.READ, creadoMs: min(10), error: "", nuestra: false },
    ],
  });
  assert.equal(r.veredicto, "rojo", "el widget web entregando no prueba nada sobre el canal de WhatsApp");
});

test("esNuestraFila reconoce los bancos de prueba y el telefono del dueño", () => {
  assert.equal(esNuestraFila({ inbox: 7, nombre: "purple-bush-931", tel: "" }), true);
  assert.equal(esNuestraFila({ inbox: 3, nombre: "-", tel: "" }), true);
  assert.equal(esNuestraFila({ inbox: 5, nombre: "Sergio", tel: "+59171654992" }), true);
  assert.equal(esNuestraFila({ inbox: 5, nombre: ".", tel: "+59175755019" }), false, "el desconocido real del 17-sep");
  assert.equal(esNuestraFila({ inbox: 4, nombre: "Sonda QA carril chatbot", tel: "" }), true);
});

test("canal EN DESUSO (ni un saliente posterior en el inbox) no es rojo: no hay nadie esperando", () => {
  // El caso real del inbox 3 (ONIA Demo): dos `sent` el 26-jul, dos `failed` con 404 el
  // 1-ago, y nada mas. Sin esta rama el gate queda rojo para siempre por una prueba nuestra.
  const r = juzgarEntregas({
    salientes: [
      { id: 14, conv: 5, inbox: 3, estado: ESTADO.SENT, creadoMs: VIEJO, error: "", nuestra: true },
      { id: 21, conv: 6, inbox: 3, estado: ESTADO.FAILED, creadoMs: VIEJO + 60_000, error: "404 Not Found", nuestra: true },
    ],
    ahoraMs: T0,
  });
  assert.equal(r.veredicto, "ok");
  assert.match(r.curados[0].porQue, /en desuso/);
});

test("un fallo global RECIENTE sin nada posterior NO es desuso: el canal acaba de romperse", () => {
  const r = juzgarEntregas({
    salientes: [
      { id: 1, conv: 58, inbox: 5, estado: ESTADO.FAILED, creadoMs: min(0), error: "131042 payment", nuestra: false },
    ],
    ahoraMs: min(30),
  });
  assert.equal(r.veredicto, "rojo");
});

test("el 1-oct NO cae en 'desuso': el canal sigue intentando y nada entrega -> rojo", () => {
  // Meta corta el cobro, los cuatro barridos siguen escribiendo: hay salientes posteriores y
  // ninguno llega. Es el modo de falla que este medidor existe para cazar.
  const r = juzgarEntregas({
    salientes: [
      { id: 1, conv: 58, inbox: 5, estado: ESTADO.FAILED, creadoMs: min(0), error: "131042 payment", nuestra: false },
      { id: 2, conv: 60, inbox: 5, estado: ESTADO.FAILED, creadoMs: min(10), error: "131042 payment", nuestra: false },
    ],
  });
  assert.equal(r.veredicto, "rojo");
  assert.equal(r.sinLlegar.length, 2);
});

test("un fallo POR SUJETO sin nada posterior sigue rojo: 'desuso' solo absuelve causas globales", () => {
  const r = juzgarEntregas({
    salientes: [
      { id: 1, conv: 58, inbox: 5, estado: ESTADO.FAILED, creadoMs: min(0), error: "131026 undeliverable", nuestra: false },
    ],
  });
  assert.equal(r.veredicto, "rojo");
});

test("el caso verde de hoy: todo entregado", () => {
  const r = juzgarEntregas({
    salientes: [
      { id: 1321, conv: 58, inbox: 5, estado: ESTADO.DELIVERED, creadoMs: min(0), error: "", nuestra: false },
      { id: 900, conv: 40, inbox: 4, estado: ESTADO.READ, creadoMs: min(1), error: "", nuestra: false },
    ],
  });
  assert.equal(r.veredicto, "ok");
  assert.equal(r.mirados, 2);
});
