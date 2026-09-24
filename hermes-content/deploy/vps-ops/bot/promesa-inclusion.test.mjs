#!/usr/bin/env node
// Ata la promesa "el chatbot ya viene adentro de tu plan" al booleano que la decide en el
// producto. Correr:
//   node --test hermes-content/deploy/vps-ops/bot/promesa-inclusion.test.mjs
//
// El porqué completo está arriba de `promesa-inclusion.mjs`. En una línea: `precios-publicos`
// ata las CIFRAS y esto no es una cifra, es `whatsappIncluded` (booleano, otro repo) — así que
// mover ese booleano dejaba al bot cobrando Bs 390 por algo ya incluido, con todo en verde.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

import { incluidoPorPlanDelCatalogo, labelsDelProducto } from "./catalogo-inclusion.mjs";
import { fuenteDePlataforma, repoPlataforma } from "./fuente-plataforma.mjs";
import {
  mencionesDePlanes,
  planesDadosPorIncluidos,
  revisarPromesaDeInclusion,
} from "./promesa-inclusion.mjs";

const AQUI = path.dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------------------
// 1. El detector, contra casos escritos a mano
// ---------------------------------------------------------------------------

const LABELS = {
  free: "Gratuito",
  basic: "Básico",
  crece: "Crece",
  professional: "Profesional",
  clinic: "Completo",
  enterprise: "Empresa",
};

// El texto del bot entre el 2026-09-12 y el 2026-09-19, palabra por palabra. Sigue clavado acá
// por DOS motivos distintos:
//
//  1. Es el caso ancla del detector de cláusula: nombra los cuatro planes en UNA sola oración y
//     la marca de inclusión aplica sólo al último. Un detector que juzgue por oración marca los
//     cuatro y acusa a tres planes sanos — por eso la ventana es la cláusula.
//  2. Es el caso ancla del defecto que se cerró el 19-sep: su cierre universal ("En los otros
//     planes...") abarca al Empresa, que trae el chatbot adentro. Si vuelve esa forma, rojo.
const TEXTO_CON_COMPLEMENTO =
  "Te los paso derecho, son públicos: el sistema arranca en Bs 320 al mes con el plan Básico, " +
  "Bs 550 el Crece, Bs 890 el Profesional y Bs 1.290 el Completo, que ya trae el chatbot de " +
  "WhatsApp adentro. En los otros planes el chatbot va aparte, Bs 390 al mes.";

// La redacción vigente: enumera a quiénes se les cobra en vez de hablar del complemento. Elegida
// así porque falla del lado seguro — un plan nuevo que no esté en la lista queda sin nombrar
// (AVISO: no lo vendemos), mientras que el universal lo abarcaba y le mentía.
const TEXTO_HOY =
  "Te los paso derecho, son públicos: el sistema arranca en Bs 320 al mes con el plan Básico, " +
  "Bs 550 el Crece, Bs 890 el Profesional y Bs 1.290 el Completo, que ya trae el chatbot de " +
  "WhatsApp adentro. En el Básico, el Crece y el Profesional el chatbot va aparte, Bs 390 al mes.";

test("la marca de inclusión aplica al plan que tiene al lado, no a los cuatro de la enumeración", () => {
  const dados = planesDadosPorIncluidos(TEXTO_CON_COMPLEMENTO, LABELS);
  assert.deepEqual([...dados].sort(), ["clinic"], "sólo el Completo está dado por incluido");
});

test("una coordinación pegada suma a los dos: «el Profesional y el Completo ya traen...»", () => {
  const dados = planesDadosPorIncluidos(
    "Bs 890 el Profesional y Bs 1.290 el Completo ya traen el chatbot adentro.",
    LABELS,
  );
  assert.deepEqual([...dados].sort(), ["clinic", "professional"]);
});

test("los nombres se buscan con límites de palabra: «crecer» no es el plan Crece", () => {
  const menciones = mencionesDePlanes("el sistema te ayuda a crecer sin pagar de más", LABELS);
  assert.deepEqual(menciones, [], "«crecer» no puede contar como una mención del plan Crece");
});

// ---------------------------------------------------------------------------
// 2. El veredicto: capacidad (catálogo) contra promesa (texto)
// ---------------------------------------------------------------------------

const HOY = { free: false, basic: false, crece: false, professional: false, clinic: true, enterprise: true };

test("con el catálogo de hoy, el texto de hoy no tiene un solo problema", () => {
  const { problemas } = revisarPromesaDeInclusion({
    incluidoPorPlan: HOY,
    labels: LABELS,
    texto: TEXTO_HOY,
  });
  assert.deepEqual(problemas, []);
});

test("ROJO si el producto le da el chatbot a un plan y el bot le sigue cobrando el add-on", () => {
  // El movimiento que la escalera C invita: hacer más atractivo al Profesional incluyéndolo.
  const conProfesional = { ...HOY, professional: true };
  const { problemas } = revisarPromesaDeInclusion({
    incluidoPorPlan: conProfesional,
    labels: LABELS,
    texto: TEXTO_HOY,
  });
  assert.equal(problemas.length, 1, `esperaba un problema, hubo ${problemas.length}`);
  assert.match(problemas[0], /Profesional/);
  assert.match(problemas[0], /cobrando el add-on aparte/);
});

test("ROJO en la dirección simétrica: el bot regala lo que el producto cobra", () => {
  const sinNinguno = { ...HOY, clinic: false, enterprise: false };
  const { problemas } = revisarPromesaDeInclusion({
    incluidoPorPlan: sinNinguno,
    labels: LABELS,
    texto: TEXTO_CON_COMPLEMENTO,
  });
  assert.equal(problemas.length, 1);
  assert.match(problemas[0], /Completo/);
  assert.match(problemas[0], /promesa que el producto no cumple/);
});

test("una redacción que el detector NO reconoce acusa, no absuelve", () => {
  // Falla cerrado a propósito: el veredicto se arma EXIGIENDO la marca, no buscando su ausencia,
  // así que una forma nueva de decir «incluido» cae en rojo y alguien la lee. Es la propiedad que
  // separa esta lista de inclusión de las que fallan abiertas ante el sujeto nuevo.
  const otraRedaccion = "Bs 1.290 el Completo, con el chatbot de WhatsApp de yapa.";
  const { problemas } = revisarPromesaDeInclusion({
    incluidoPorPlan: HOY,
    labels: LABELS,
    texto: otraRedaccion,
  });
  assert.equal(problemas.length, 1);
  assert.match(problemas[0], /YA TRAE el chatbot incluido, y el texto/);
});

test("un plan incluido del que el bot CALLA es AVISO, no rojo — no miente, no lo vende", () => {
  // Ojo con el fixture: el texto tiene que callar DE VERDAD. `TEXTO_CON_COMPLEMENTO` no calla —remata con
  // "En los otros planes..."— y usarlo acá era lo que defendía el defecto de abajo.
  const calla =
    "Te los paso derecho: el sistema arranca en Bs 320 al mes con el plan Básico, Bs 550 el " +
    "Crece, Bs 890 el Profesional y Bs 1.290 el Completo, que ya trae el chatbot adentro.";
  const { problemas, avisos } = revisarPromesaDeInclusion({
    incluidoPorPlan: HOY,
    labels: LABELS,
    texto: calla,
  });
  assert.deepEqual(problemas, []);
  assert.equal(avisos.length, 1);
  assert.match(avisos[0], /Empresa/);
});

test("ROJO: el texto no CALLA sobre el plan que no nombró — lo abarca con «en los otros planes»", () => {
  // El defecto que esto cierra, medido en producción el 2026-09-19: el bot enumeraba cuatro
  // planes y remataba "En los otros planes el chatbot va aparte, Bs 390 al mes", con el Empresa
  // (Bs 2.900) trayéndolo adentro desde la escalera C. O sea le cobraba Bs 390/mes al lead más
  // grande. El gate lo daba por AVISO —"no miente, pero no lo está vendiendo"— porque sólo
  // juzgaba los planes NOMBRADOS, y un universal sobre el complemento no nombra a nadie.
  const { problemas } = revisarPromesaDeInclusion({
    incluidoPorPlan: HOY,
    labels: LABELS,
    texto: TEXTO_CON_COMPLEMENTO,
  });
  assert.equal(problemas.length, 1, `esperaba un problema, hubo ${problemas.length}`);
  assert.match(problemas[0], /Empresa/);
  assert.match(problemas[0], /no lo nombra y la frase .* lo abarca/);
});

test("el complemento acusa por la FORMA, no por el texto viejo: «en los demás planes se cobra»", () => {
  // Se prohíbe la forma (cuantificador de complemento + marca de que se cobra aparte) y no la
  // redacción de hoy: prohibir la frase literal se apaga sola en cuanto alguien la reescriba.
  for (const cierre of [
    "En los demás planes se cobra aparte.",
    "En el resto de los planes el chatbot no viene incluido.",
    "Para los otros planes el asistente se suma por Bs 390.",
  ]) {
    const { problemas } = revisarPromesaDeInclusion({
      incluidoPorPlan: HOY,
      labels: LABELS,
      texto: `Bs 1.290 el Completo, que ya trae el chatbot adentro. ${cierre}`,
    });
    assert.equal(problemas.length, 1, `no acusó con el cierre «${cierre}»`);
    assert.match(problemas[0], /Empresa/);
  }
});

test("el complemento NO acusa si no afirma que se cobra: «en los otros planes, consultanos»", () => {
  // La mentira la hace la EXCLUSIÓN, no el cuantificador: un complemento que no afirma nada
  // sobre el precio del add-on no le promete de más a nadie.
  const { problemas } = revisarPromesaDeInclusion({
    incluidoPorPlan: HOY,
    labels: LABELS,
    texto: "Bs 1.290 el Completo, que ya trae el chatbot adentro. En los otros planes, consultanos.",
  });
  assert.deepEqual(problemas, []);
});

test("el complemento NO acusa a un texto que DERIVA los nombres: sin ancla literal no hay «los demás»", () => {
  // El caso del sitio (`inclusion-chatbot.test.ts`), que comparte este módulo por el espejo: la
  // FAQ escribe «nombresConChatbot() ya trae el chatbot incluido. En los demás planes va aparte»
  // — derivado del dato, que es exactamente la forma que el gate hermano EXIGE. Sin esta
  // pregunta el detector la pintaba roja y empujaba a TIPEAR los nombres, el arreglo contrario.
  const { problemas } = revisarPromesaDeInclusion({
    incluidoPorPlan: HOY,
    labels: LABELS,
    texto: "«nombresConChatbot()» ya trae el chatbot de WhatsApp incluido. En los demás planes va aparte, Bs 390/mes.",
  });
  assert.deepEqual(problemas, []);
});

test("el complemento deja de acusar solo cuando ningún plan callado trae la capacidad", () => {
  // Que el gate se apague por la razón correcta: si el Empresa dejara de traerlo, la frase
  // universal vuelve a ser cierta y no hay nada que reportar.
  const soloClinic = { ...HOY, enterprise: false };
  const { problemas } = revisarPromesaDeInclusion({
    incluidoPorPlan: soloClinic,
    labels: LABELS,
    texto: TEXTO_CON_COMPLEMENTO,
  });
  assert.deepEqual(problemas, []);
});

// ---------------------------------------------------------------------------
// 3. La correa: contra el catálogo PUBLICADO y el knowledge REAL
// ---------------------------------------------------------------------------

// Los dos parsers del catálogo ya NO viven acá: los importa este test y también `precios-vivos.mjs`,
// que es el que puede cruzar el documento VIVO (fila del panel mergeada sobre el archivo). Tenerlos
// adentro del test era lo que ataba este cruce al archivo del repo y sólo al archivo del repo.

/** Todo string del knowledge, venga del campo que venga: el universo sale del artefacto. */
function textosDelKnowledge(valor, salida = []) {
  if (typeof valor === "string") salida.push(valor);
  else if (Array.isArray(valor)) for (const v of valor) textosDelKnowledge(v, salida);
  else if (valor && typeof valor === "object") for (const v of Object.values(valor)) textosDelKnowledge(v, salida);
  return salida;
}

test("lo que el bot dice de la inclusión coincide con el catálogo PUBLICADO de onia-platform", () => {
  const repo = repoPlataforma();
  const incluidoPorPlan = incluidoPorPlanDelCatalogo(fuenteDePlataforma(repo, "plan-catalogo.ts"));
  const labels = labelsDelProducto(fuenteDePlataforma(repo, "pricing.ts"));

  const knowledge = JSON.parse(readFileSync(path.join(AQUI, "knowledge.onia.json"), "utf8"));
  const textos = textosDelKnowledge(knowledge);
  assert.ok(textos.length > 0, "el knowledge no tiene un solo texto: algo se rompió al leerlo");

  // Se juzga texto por texto: pegarlos crearía cláusulas que nadie escribió, y una marca de un
  // párrafo terminaría aplicándole a un plan nombrado en otro.
  const problemas = [];
  const nombrados = new Set();
  for (const texto of textos) {
    const veredicto = revisarPromesaDeInclusion({ incluidoPorPlan, labels, texto });
    problemas.push(...veredicto.problemas);
    for (const plan of veredicto.nombrados) nombrados.add(plan);
  }

  assert.deepEqual(
    problemas,
    [],
    "El bot promete una cosa y el catálogo hace otra:\n  - " +
      problemas.join("\n  - ") +
      "\n\nSe arregla editando knowledge.onia.json (y publicándolo: `DESPLEGAR: bot` no lleva el " +
      "texto, el install es aparte con `webhook-server.sh knowledge`).",
  );

  // Que el cruce haya tenido SUJETO. Sin esto el test pasa verde el día que los nombres de plan
  // cambien y el texto deje de mencionarlos: cero menciones, cero problemas, cero valor.
  assert.ok(
    nombrados.size >= 2,
    `el knowledge nombra ${nombrados.size} plan(es) del catálogo: el cruce se quedó sin sujeto. ` +
      "Si los planes se renombraron, este gate dejó de mirar lo que cree mirar.",
  );
});

// ---------------------------------------------------------------------------
// 4. "Empresa" es el nombre de un plan Y una palabra corriente del castellano
//
// Medido el 2026-09-24 al traer las campañas de la web al documento que el deploy publica: la
// frase que onia.com.bo manda por wa.me dice "Quiero consultoría/capacitación en IA para mi
// empresa", y el gate la leyó como una mención del plan `enterprise` (label "Empresa"). Acusó
// que le cobramos el add-on a un cliente que ya lo tiene incluido — sobre un texto que no habla
// de planes en absoluto.
//
// No se podía arreglar por el lado del texto: esa frase es una COPIA EXACTA de la que la web
// precarga en el link, y `campanaExacta` compara el mensaje entero. Cambiarle una palabra al
// documento rompe el match y el desconocido vuelve al saludo genérico.
//
// La regla que se aplica es del castellano, y es estrecha a propósito: un POSESIVO delante
// ("tu/mi/su empresa") sólo puede ser la palabra corriente. El plan se nombra "el Empresa" o
// "plan Empresa", y esos siguen contando.
// ---------------------------------------------------------------------------
test("un posesivo delante convierte al label en palabra corriente, no en el nombre del plan", () => {
  const vivo = "La consultoría la da Sergio: se arma sobre lo que tu empresa ya hace hoy.";
  assert.deepEqual(mencionesDePlanes(vivo, LABELS), [], "«tu empresa» no nombra ningún plan");
  assert.deepEqual(mencionesDePlanes("Quiero capacitación en IA para mi empresa", LABELS), []);
  assert.deepEqual(mencionesDePlanes("su empresa ya factura en línea", LABELS), []);
});

test("sin posesivo el plan SIGUE contando — la exclusión no puede apagar el gate", () => {
  for (const texto of ["el Empresa ya trae el chatbot", "el plan Empresa lo incluye", "Empresa lo trae"]) {
    assert.deepEqual(
      mencionesDePlanes(texto, LABELS).map((m) => m.plan),
      ["enterprise"],
      `"${texto}" sí nombra el plan`,
    );
  }
});
