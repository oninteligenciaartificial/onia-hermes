// ONIA — el banco de pruebas es un INBOX entero, no un nombre de contacto.
//
// EL DEFECTO (medido contra produccion el 2026-09-19 05:40): `esConversacionNuestra` contesta con
// una FIRMA DEL CONTACTO (telefono propio, o `displayName` que matchee /prueba|qa|test/). A las
// conversaciones que abre una sonda, Chatwoot les pone nombre anonimo, asi que DIEZ filas del
// inbox 7 (`ZZ QA Clinica Chatbot`, el banco de pruebas) dan `false` y los cuatro barridos del
// embudo las tratan como prospectos:
//
//   chatwoot:28 dry-dawn-527 · 42 Cliente Insistencia Dos · 43 Cliente Insistencia Tres
//   chatwoot:44 Cliente Comprobante · 52 purple-bush-931 · 53 wandering-water-74
//   chatwoot:54 summer-shadow-163 · 55 dry-cherry-292 · 56 icy-sunset-817 · 57 (sin nombre)
//
// Es la clase que ya esta en la memoria de la casa: *una firma solo reconoce lo que marcamos al
// sembrar*. Lo que hay que reconocer aca es TENENCIA, y la tenencia es del inbox.
//
// POR QUE NO SE DERIVA DE `organizations.slug like 'zz-qa-%'` (lo que la cola proponia): MEDIDO
// FALSO el 2026-09-19. En produccion `clinic_settings` tiene UNA sola fila con inbox — la de
// `onia-interna`, inboxes 4 y 5. El inbox 7 no cuelga de NINGUNA org, ni siquiera de la cuenta
// `zz-qa-bandeja-10`. Ese conjunto saldria VACIO y el gate quedaria verde con el defecto vivo.
// El dato con dueño es el NOMBRE DEL INBOX en Chatwoot, que lo escribimos nosotros al crearlo.
//
// ⚠️ EL SESGO ES ASIMETRICO Y EL DEFAULT LO RESPETA. Si el conjunto no se pudo cargar queda
// VACIO y el criterio se comporta EXACTAMENTE como hoy. Confundir a un prospecto real con una
// sonda lo deja sin seguimiento — el fallo exacto que este carril existe para evitar, y encima
// mudo. Nunca se falla hacia "es nuestra".

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  esConversacionNuestra,
  fijarInboxesDePrueba,
  inboxesDePruebaActuales,
  cargarInboxesDePrueba,
  MARCA_INBOX_DE_PRUEBA,
} from "./es-nuestra.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));

/** Las diez filas del inbox 7 que hoy dan LEAD. Sujetos REALES, copiados de produccion. */
const DEL_BANCO_DE_PRUEBAS = [
  { conversationKey: "chatwoot:28", inboxId: 7, displayName: "dry-dawn-527" },
  { conversationKey: "chatwoot:42", inboxId: 7, displayName: "Cliente Insistencia Dos" },
  { conversationKey: "chatwoot:43", inboxId: 7, displayName: "Cliente Insistencia Tres" },
  { conversationKey: "chatwoot:44", inboxId: 7, displayName: "Cliente Comprobante" },
  { conversationKey: "chatwoot:52", inboxId: 7, displayName: "purple-bush-931" },
  { conversationKey: "chatwoot:53", inboxId: 7, displayName: "wandering-water-74" },
  { conversationKey: "chatwoot:54", inboxId: 7, displayName: "summer-shadow-163" },
  { conversationKey: "chatwoot:55", inboxId: 7, displayName: "dry-cherry-292" },
  { conversationKey: "chatwoot:56", inboxId: 7, displayName: "icy-sunset-817" },
  { conversationKey: "chatwoot:57", inboxId: 7, displayName: "" },
];

/** Un desconocido REAL del inbox de leads. El criterio nunca puede decir que somos nosotros. */
const LEAD_DE_VERDAD = { conversationKey: "chatwoot:38", inboxId: 4, displayName: "billowing-shadow-768" };

test.afterEach(() => fijarInboxesDePrueba([]));

test("sin conjunto cargado se comporta EXACTAMENTE como hoy (nunca falla hacia 'es nuestra')", () => {
  fijarInboxesDePrueba([]);
  assert.equal(inboxesDePruebaActuales().size, 0, "el default tiene que ser el conjunto vacio");
  for (const fila of DEL_BANCO_DE_PRUEBAS) {
    if (/\b(prueba|qa|test)\b/i.test(fila.displayName)) continue;
    assert.equal(esConversacionNuestra(fila), false, `${fila.conversationKey}: el default no puede inventar tenencia`);
  }
});

test("con el conjunto cargado, las DIEZ filas del banco de pruebas dejan de ser prospectos", () => {
  fijarInboxesDePrueba([7]);
  for (const fila of DEL_BANCO_DE_PRUEBAS) {
    assert.equal(esConversacionNuestra(fila), true, `${fila.conversationKey} (${fila.displayName || "sin nombre"}) sigue contando como lead`);
  }
});

test("un desconocido del inbox de leads NUNCA se marca como nuestro", () => {
  fijarInboxesDePrueba([7]);
  assert.equal(esConversacionNuestra(LEAD_DE_VERDAD), false, "un lead real quedaria sin seguimiento, y mudo");
  assert.equal(esConversacionNuestra({ inboxId: 5, displayName: "." }), false, "chatwoot:58, el unico lead vivo de WhatsApp");
});

test("el conjunto se DERIVA del nombre del inbox, no de una lista de ids escrita a mano", async () => {
  const inboxesDeProduccion = [
    { id: 3, name: "ONIA Demo" },
    { id: 4, name: "Onia Web" },
    { id: 5, name: "Onia WhatsApp" },
    { id: 7, name: "ZZ QA Clinica Chatbot" },
  ];
  const r = await cargarInboxesDePrueba({ listarInboxes: async () => inboxesDeProduccion });
  // Los ids se guardan normalizados a texto a proposito: en la fila el inbox llega `7` y en el
  // payload de Chatwoot puede llegar `"7"`, y tienen que ser el mismo inbox.
  assert.deepEqual([...r.ids].sort(), ["7"], "solo el inbox marcado como banco de pruebas");
  assert.equal(r.medido, true);

  // Un inbox 8 de QA que se cree mañana entra SOLO, sin tocar codigo: eso es lo que compra derivar.
  const conElNuevo = await cargarInboxesDePrueba({
    listarInboxes: async () => [...inboxesDeProduccion, { id: 8, name: "zz-qa-bandeja 2.0" }],
  });
  assert.deepEqual([...conElNuevo.ids].sort(), ["7", "8"], "el inbox de prueba nuevo tiene que entrar derivado");
  assert.equal(esConversacionNuestra({ inboxId: "7", displayName: "purple-bush-931" }), true, "el id como texto es el mismo inbox");
});

test("si no se pudo preguntar, el conjunto queda VACIO y lo dice (no se falla hacia 'es nuestra')", async () => {
  fijarInboxesDePrueba([7]);
  const rompe = await cargarInboxesDePrueba({
    listarInboxes: async () => {
      throw new Error("chatwoot: 500");
    },
  });
  assert.equal(rompe.medido, false, "un fallo no puede pasar por medicion");
  assert.equal(rompe.ids.size, 0, "sin dato, conjunto vacio");
  assert.equal(inboxesDePruebaActuales().size, 0, "y el conjunto del proceso tambien se vacia");
  assert.ok(rompe.warning, "un fallo mudo es como esta familia falla");
  assert.equal(esConversacionNuestra(DEL_BANCO_DE_PRUEBAS[4]), false, "sin dato se comporta como hoy");

  const sinLista = await cargarInboxesDePrueba({ listarInboxes: async () => null });
  assert.equal(sinLista.medido, false, "una respuesta ilegible no es 'no hay inboxes de prueba'");
  assert.ok(sinLista.warning);
});

test("la marca del inbox de prueba es la MISMA convencion de siembra que usa todo el repo", () => {
  assert.ok(MARCA_INBOX_DE_PRUEBA.test("ZZ QA Clinica Chatbot"));
  assert.ok(MARCA_INBOX_DE_PRUEBA.test("zz-qa-bandeja 2.0"));
  assert.ok(MARCA_INBOX_DE_PRUEBA.test("zz_qa algo"));
  // Un negocio que se llame asi NO es nuestro banco de pruebas.
  assert.equal(MARCA_INBOX_DE_PRUEBA.test("QA Consultores"), false, "'qa' suelto es un negocio real, ya paso con el slug");
  assert.equal(MARCA_INBOX_DE_PRUEBA.test("Onia Web"), false);
  assert.equal(MARCA_INBOX_DE_PRUEBA.test("Onia WhatsApp"), false);
});

// ---------------------------------------------------------------------------
// CABLEADO. El universo se DERIVA del disco: todo barrido que pida candidatos a la base decide
// a quien escribirle, asi que tiene que cargar el conjunto antes. Una lista a mano aca falla
// abierto con el quinto barrido que alguien escriba.

/**
 * Los `*-run.mjs` que piden candidatos: el universo real, caminado del directorio.
 *
 * ⚠️ El predicado pregunta por la LLAMADA AL STORE, no por la forma del nombre. Agrupar por
 * `sweep\w*Candidates` —que es como nacio este gate— dejaba fuera a los dos hermanos irregulares
 * (`sweepDemosTerminadas` de postdemo y `sweepDemoReminders` de reminder): el universo salia de 2
 * y el gate firmaba verde sobre la mitad de los barridos. Lo delato el caso ancla de abajo.
 */
function barridosQueEligenAQuienEscribirle() {
  return readdirSync(AQUI)
    .filter((f) => f.endsWith("-run.mjs") && !f.includes(".test."))
    .map((f) => ({ archivo: f, fuente: readFileSync(join(AQUI, f), "utf8") }))
    .filter((x) => /\bstore\.sweep\w*\s*\(/.test(x.fuente));
}

test("TODO barrido que pide candidatos carga el conjunto en su corrida", () => {
  const barridos = batidoSinComentarios(barridosQueEligenAQuienEscribirle());
  // Caso ancla: si el universo se vacia, el gate se apago solo y no tiene que poder firmar verde.
  assert.ok(barridos.length >= 4, `el universo quedo en ${barridos.length}: el detector dejo de ver los barridos`);
  const conocidos = barridos.map((b) => b.archivo).sort();
  for (const esperado of ["followup-run.mjs", "insistencia-run.mjs", "postdemo-run.mjs", "reminder-run.mjs"]) {
    assert.ok(conocidos.includes(esperado), `${esperado} salio del universo del gate`);
  }
  for (const { archivo, fuente } of barridos) {
    assert.match(fuente, /await\s+cargarInboxesDePrueba\s*\(/, `${archivo} elige a quien escribirle sin cargar el conjunto de inboxes de prueba`);
  }
});

/** Los comentarios ACUSAN y ABSUELVEN: se mide sobre codigo, conservando los saltos de linea. */
function batidoSinComentarios(lista) {
  return lista.map(({ archivo, fuente }) => ({
    archivo,
    fuente: fuente
      .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
      .replace(/(^|[^:])\/\/[^\n]*/g, (m, p1) => p1 + " ".repeat(Math.max(0, m.length - p1.length))),
  }));
}
