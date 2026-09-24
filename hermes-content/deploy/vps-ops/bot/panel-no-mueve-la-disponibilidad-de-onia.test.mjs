import test from "node:test";
import assert from "node:assert/strict";

import { DEFAULT_CONFIG } from "./config.mjs";
import { applyKnowledge, mergePanelKnowledge, resetAvisosDePanel } from "./knowledge.mjs";
import { VENTANAS_ATENCION, fraseDeAtencion, envolventeDeAtencion } from "./ventanas-de-atencion.mjs";

// ---------------------------------------------------------------------------
// EL BUG QUE ESTOS CASOS CIERRAN
//
// La disponibilidad de Sergio Urcullo se unifico el 2026-09-13 en `ventanas-de-atencion.mjs`
// justamente porque el bot la usaba para DOS cosas con DOS fuentes: OFRECIA los horarios de demo
// calculados por `renovar-slots-bot.py` (lun-vie 14-17 y 20-22, sab 9-15) y PROMETIA la respuesta
// del humano con un `businessHours` tipeado aparte. Un mismo mensaje ofrecia un sabado y prometia
// que solo se atiende de lunes a viernes.
//
// Ese arreglo cerro las dos fuentes que viven en el REPO y dejo abierta la de ARRIBA: la fila que
// Sergio edita en el panel para la org interna se mergea sobre `knowledge.onia.json`
// (`mergePanelKnowledge`) y hasta hoy podia pisar `empresa.horario` — dias, desde, hasta y la
// FRASE. O sea que la mitad PROMETIDA se podia mover desde el panel mientras la mitad OFRECIDA
// seguia saliendo de la constante, que es exactamente como se separaron la primera vez.
//
// Medido en produccion el 2026-09-18 con `npm run horario:vivo`: de los 2 documentos que sirve el
// bot, la fila del panel traia `hasta: 19` y la frase "Lunes a viernes de 9:00 a 19:00, sabados de
// 9 a 13". Un lead que escribia un martes a las 10:00 leia que le contestaban (Sergio recien
// empieza 14:00) y un sabado se le prometia hasta las 13:00 mientras el bot le OFRECIA las 14:00.
//
// LA REGLA QUE QUEDA: el horario de ONIA no es un campo editable — tiene dueno en el repo, y es
// el mismo que genera los horarios que el bot ofrece. Mover la disponibilidad se hace ahi, en un
// solo lugar, y mueve las dos mitades juntas. El panel sigue mandando en todo lo demas.
//
// La direccion simetrica importa igual y tiene su caso: el horario de un CLIENTE llega por otra
// puerta (`fetchOrgKnowledge`, fila por org) y ahi SI tiene que ganar — su negocio declara su
// propio horario y contradecir el de Sergio Urcullo es lo correcto, no un defecto.
// ---------------------------------------------------------------------------

/** El documento del repo tal como esta hoy: declara `empresa` sin horario (lo hereda del codigo). */
function archivoDeOnia() {
  return {
    schema: "onia.bot.knowledge/1",
    version: 3,
    identity: { nombre: "Onia" },
    empresa: {},
    faq: [{ id: "precios", body: "Bs 320 el Basico." }],
  };
}

/** La fila viva del panel el 2026-09-18, con el horario que NO es el de Sergio Urcullo. */
function filaDelPanelComoEstaEnProduccion() {
  return {
    schema: "onia.bot.knowledge/1",
    version: 7,
    empresa: {
      horario: {
        dias: [1, 2, 3, 4, 5],
        desde: 9,
        hasta: 19,
        frase: "Lunes a viernes de 9:00 a 19:00, sábados de 9 a 13",
      },
    },
    faq: [{ id: "que-es", body: "Onia es una plataforma por modulos." }],
  };
}

test("ANCLA: la fila del panel NO mueve el horario que el bot promete en nombre de Onia", () => {
  const merged = mergePanelKnowledge(archivoDeOnia(), filaDelPanelComoEstaEnProduccion());

  assert.equal(
    merged.empresa?.horario ?? null,
    null,
    "el horario del panel tiene que quedar AFUERA del documento de Onia: su dueno es ventanas-de-atencion.mjs",
  );

  // Y la prueba que le importa a un lead: lo que el motor termina PRONUNCIANDO.
  const config = applyKnowledge(DEFAULT_CONFIG, merged);
  assert.equal(
    config.businessHours.frase,
    fraseDeAtencion(VENTANAS_ATENCION),
    "la coletilla que lee el lead tiene que ser la de la fuente unica",
  );
  assert.equal(
    config.businessHours.endHour,
    envolventeDeAtencion(VENTANAS_ATENCION).endHour,
    "la hora de cierre tiene que ser la de la fuente unica, no la 19 del panel",
  );
  assert.notEqual(
    config.businessHours.frase,
    filaDelPanelComoEstaEnProduccion().empresa.horario.frase,
    "el bot no puede prometer el horario tipeado en el panel",
  );
});

test("el panel sigue mandando en todo lo demas: solo el horario tiene dueno en el repo", () => {
  const merged = mergePanelKnowledge(archivoDeOnia(), filaDelPanelComoEstaEnProduccion());

  assert.equal(merged.version, 7, "la version del panel sigue pisando");
  const ids = merged.faq.map((f) => f.id);
  assert.ok(ids.includes("que-es"), "la FAQ nueva del panel tiene que entrar");
  assert.ok(ids.includes("precios"), "la FAQ del archivo que el panel no trae se conserva");
  assert.equal(merged.identity?.nombre, "Onia", "lo que el panel no trae se hereda del archivo");
});

test("un panel que NO declara horario no cambia nada (la ausencia no puede inventar un campo)", () => {
  const panel = { schema: "onia.bot.knowledge/1", version: 4, faq: [{ id: "que-es", body: "x" }] };
  const merged = mergePanelKnowledge(archivoDeOnia(), panel);
  assert.equal(merged.empresa?.horario ?? null, null);
  assert.equal(applyKnowledge(DEFAULT_CONFIG, merged).businessHours.frase, fraseDeAtencion(VENTANAS_ATENCION));
});

test("SIMETRICA: el horario de un CLIENTE sigue ganando — no viene por este merge", () => {
  // La fila de una org cliente llega por `fetchOrgKnowledge` y se aplica sin pasar por el merge
  // del panel. Si este caso se pone rojo, la cura se fue de tema y le apago el horario a los
  // clientes, que es un defecto peor que el que cierra.
  const doc = {
    empresa: { horario: { dias: [1, 2, 3, 4, 5, 6], desde: 8, hasta: 20, frase: "lun-sáb 8:00-20:00" } },
  };
  const config = applyKnowledge(DEFAULT_CONFIG, doc);
  assert.equal(config.businessHours.startHour, 8);
  assert.equal(config.businessHours.endHour, 20);
  assert.equal(config.businessHours.frase, "lun-sáb 8:00-20:00");
  assert.equal(config.businessHours.franjas, null, "el cliente no hereda las franjas de Sergio Urcullo");
});

/** Captura lo que sale por `console.warn` mientras corre `fn`. */
function avisosDe(fn) {
  const avisos = [];
  const original = console.warn;
  console.warn = (msg) => avisos.push(String(msg));
  try {
    fn();
  } finally {
    console.warn = original;
  }
  return avisos;
}

test("no se descarta en silencio: un horario tipeado en el panel deja constancia", () => {
  resetAvisosDePanel();
  const avisos = avisosDe(() => mergePanelKnowledge(archivoDeOnia(), filaDelPanelComoEstaEnProduccion()));
  assert.equal(avisos.length, 1, "tiene que avisar exactamente una vez que ignoro el horario del panel");
  assert.match(
    avisos[0],
    /horario/i,
    "el aviso tiene que nombrar el campo ignorado para que se pueda buscar en el log",
  );
});

// ---------------------------------------------------------------------------
// EL SEGUNDO BUG, MEDIDO EN PRODUCCION EL 2026-09-24
//
// El aviso de arriba es correcto y tiene que quedar — pero `mergePanelKnowledge` corre en CADA
// carga del conocimiento, y la fila del panel trae `empresa.horario` SIEMPRE. O sea que avisaba
// de una condicion PERMANENTE como si fuera un evento nuevo, y el aviso se repetia para siempre.
//
// Medido en el bot vivo (contenedor onia-center, /tmp/onia-bot-webhook.log, 4,2 MB): 3.541 copias
// de esta misma linea, y —lo que cuesta— la COLA ENTERA del log era esa linea. El comando con el
// que este carril mide su propio objetivo (`webhook-server.sh logs | tail -80 | grep
// demo_agendada|handoff_humano`) devolvia VACIO teniendo 27 eventos de demo/handoff adentro: no
// habia ninguno en las ultimas 80 lineas porque el aviso los habia empujado fuera.
//
// Un log ahogado en ruido es tan ciego como un log que no existe, y esa ceguera ya costo una
// semana de bot mudo en septiembre. La constancia se deja UNA vez por valor descartado: si Sergio
// Urcullo edita el panel y pone otro horario, eso SI es noticia y vuelve a avisar.
// ---------------------------------------------------------------------------

test("el aviso no se repite en cada carga: un log ahogado es un log ciego", () => {
  resetAvisosDePanel();
  const avisos = avisosDe(() => {
    for (let i = 0; i < 50; i += 1) mergePanelKnowledge(archivoDeOnia(), filaDelPanelComoEstaEnProduccion());
  });
  assert.equal(
    avisos.length,
    1,
    `50 cargas con la MISMA fila tienen que dejar 1 sola linea, no 50 (salieron ${avisos.length}). ` +
      "Repetir una condicion permanente empuja los eventos reales fuera de la cola del log.",
  );
});

test("un horario NUEVO en el panel si vuelve a avisar: el silencio es por valor, no para siempre", () => {
  resetAvisosDePanel();
  const avisos = avisosDe(() => {
    mergePanelKnowledge(archivoDeOnia(), filaDelPanelComoEstaEnProduccion());
    mergePanelKnowledge(archivoDeOnia(), filaDelPanelComoEstaEnProduccion());
    const otra = filaDelPanelComoEstaEnProduccion();
    otra.empresa.horario = { dias: [1, 2, 3], desde: 7, hasta: 11, frase: "lun-mié 7:00-11:00" };
    mergePanelKnowledge(archivoDeOnia(), otra);
  });
  assert.equal(
    avisos.length,
    2,
    "un descarte que cambia de valor es noticia y tiene que dejar su propia linea",
  );
});

test("el horario se descarta igual aunque el aviso ya no salga: callar no es aceptar", () => {
  resetAvisosDePanel();
  mergePanelKnowledge(archivoDeOnia(), filaDelPanelComoEstaEnProduccion());
  // La segunda pasada es la que ya no avisa: lo que NO puede pasar es que ademas deje pasar el
  // horario del panel. Si este caso se pone rojo, la cura silencio el aviso Y el descarte.
  const merged = mergePanelKnowledge(archivoDeOnia(), filaDelPanelComoEstaEnProduccion());
  assert.equal(merged.empresa?.horario ?? null, null, "el horario del panel no puede colarse");
  assert.equal(
    applyKnowledge(DEFAULT_CONFIG, merged).businessHours.frase,
    fraseDeAtencion(VENTANAS_ATENCION),
    "el bot sigue prometiendo la disponibilidad de la constante",
  );
});
