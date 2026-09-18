// Gate de `es-nuestra.mjs`: el criterio, su atadura a la fuente unica, y —lo que cierra la
// CLASE— que TODO barrido que le escribe a alguien lo pregunte.
//
// La instancia era el follow-up; la clase son los cuatro barridos del embudo. Arreglar uno solo
// deja la puerta abierta en los otros tres y en el quinto que se escriba manana, asi que el
// universo se DERIVA del disco (los `*-run.mjs` que llaman a un `sweep*`), nunca de una lista.

import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";

import {
  MOTIVO_NUESTRA,
  NOMBRE_DE_PRUEBA,
  NUESTROS_TELEFONOS,
  esConversacionNuestra,
  normalizarTelefono,
} from "./es-nuestra.mjs";
import * as fuenteUnica from "../../../../scripts/objetivo_visible.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));

// --- 1. El criterio, contra las filas REALES medidas en produccion el 2026-09-18 --------------
// No son casos inventados: salen de `select conversation_key, display_name, raw->>'publicContact'
// from onia_center.bot_conversations`, cruzado con `contacts` de Chatwoot.

test("reconoce la sonda del propio carril (chatwoot:49, la que corre cada 30 min)", () => {
  assert.equal(esConversacionNuestra({ displayName: "Sonda QA carril chatbot", publicContact: null }), true);
});

test("reconoce la fila sintetica sin conversacion detras (chatwoot:999999)", () => {
  assert.equal(esConversacionNuestra({ displayName: "QA Prueba", publicContact: "+59170000000" }), true);
});

test("reconoce a Sergio Urcullo por su telefono aunque el nombre no diga nada (chatwoot:11)", () => {
  assert.equal(esConversacionNuestra({ displayName: "Sergio", publicContact: "+59171654992" }), true);
});

test("el telefono se compara normalizado, no como cadena", () => {
  assert.equal(esConversacionNuestra({ displayName: "Sergio", publicContact: "+591 716-54992" }), true);
  assert.equal(normalizarTelefono("+591 716-54992"), "59171654992");
});

// La direccion que MAS importa: un desconocido real nunca se saltea. Si este caso se pone verde
// por el motivo equivocado, el barrido deja de escribirle a los prospectos de verdad.
test("un desconocido real NO es nuestro (chatwoot:58, el unico lead real de la tanda)", () => {
  assert.equal(esConversacionNuestra({ displayName: ".", publicContact: "+59175755019" }), false);
});

test("una fila sin nombre ni telefono NO se da por nuestra", () => {
  assert.equal(esConversacionNuestra({ displayName: null, publicContact: null }), false);
  assert.equal(esConversacionNuestra(null), false);
});

test("el nombre se mira por PALABRA, no por subcadena: 'Quality' no es 'qa'", () => {
  assert.equal(esConversacionNuestra({ displayName: "Quality Muebles", publicContact: null }), false);
  assert.equal(esConversacionNuestra({ displayName: "Testaferro SRL", publicContact: null }), false);
});

// --- 2. Atadura a la FUENTE UNICA -------------------------------------------------------------
// La regla esta copiada a proposito (un import fuera de este directorio no viaja al deploy), asi
// que lo que impide que se separen es este gate. Sin el, sumar un telefono propio en
// `objetivo_visible.mjs` dejaria al barrido escribiendole a ese numero, con todo en verde.

test("los telefonos propios son los MISMOS que los de scripts/objetivo_visible.mjs", () => {
  assert.deepEqual(
    [...NUESTROS_TELEFONOS].map(normalizarTelefono).sort(),
    [...fuenteUnica.NUESTROS_TELEFONOS].map(normalizarTelefono).sort(),
    "se sumo/saco un telefono propio en una copia y no en la otra",
  );
});

test("el patron de nombre de prueba es el MISMO que el de la fuente unica", () => {
  assert.equal(NOMBRE_DE_PRUEBA.source, fuenteUnica.NOMBRE_DE_PRUEBA.source);
  assert.equal(NOMBRE_DE_PRUEBA.flags, fuenteUnica.NOMBRE_DE_PRUEBA.flags);
});

test("las dos copias contestan lo mismo sobre las filas medidas", () => {
  const filas = [
    { displayName: "Sonda QA carril chatbot", publicContact: null },
    { displayName: "QA Prueba", publicContact: "+59170000000" },
    { displayName: "Sergio", publicContact: "+59171654992" },
    { displayName: ".", publicContact: "+59175755019" },
    { displayName: "Quality Muebles", publicContact: null },
  ];
  for (const f of filas) {
    assert.equal(
      esConversacionNuestra(f),
      fuenteUnica.esNuestra({ contacto: f.displayName, telefono: f.publicContact }),
      `las dos copias no coinciden sobre ${f.displayName}`,
    );
  }
});

// --- 3. LA CLASE: todo barrido que escribe, pregunta -------------------------------------------

/**
 * El universo se camina del DISCO y no se le pregunta a git: el barrido que mas importa cazar es
 * justamente el archivo NUEVO todavia sin commitear, que `git ls-files` no ve.
 */
function barridosQueEscriben() {
  return readdirSync(AQUI)
    .filter((f) => f.endsWith("-run.mjs"))
    .map((f) => ({ archivo: f, fuente: readFileSync(join(AQUI, f), "utf8") }))
    .filter((x) => /\bsweep[A-Za-z]+\s*\(/.test(x.fuente));
}

test("el universo derivado contiene los cuatro barridos conocidos", () => {
  const nombres = barridosQueEscriben().map((x) => x.archivo).sort();
  for (const esperado of ["followup-run.mjs", "insistencia-run.mjs", "postdemo-run.mjs", "reminder-run.mjs"]) {
    assert.ok(nombres.includes(esperado), `el universo perdio ${esperado}: ${nombres.join(", ")}`);
  }
});

test("los que NO barren quedan fuera (no se le pide la guarda a quien no le escribe a nadie)", () => {
  const nombres = barridosQueEscriben().map((x) => x.archivo);
  assert.ok(!nombres.includes("usage-run.mjs"), "usage-run.mjs no barre: no es sujeto");
  assert.ok(!nombres.includes("rescate-run.mjs"), "rescate-run.mjs no barre: no es sujeto");
});

test("TODO barrido que elige a quien escribirle pregunta si la conversacion es nuestra", () => {
  const sinGuarda = barridosQueEscriben()
    .filter((x) => !/\besConversacionNuestra\s*\(/.test(x.fuente))
    .map((x) => x.archivo);
  assert.deepEqual(
    sinGuarda,
    [],
    "estos barridos eligen por etapa y tiempo pero no por QUIEN es: le escriben a nuestras " +
      "propias sondas (y en WhatsApp, Meta lo cobra). Importa `esConversacionNuestra` de " +
      "`./es-nuestra.mjs` y saltea con el motivo `" + MOTIVO_NUESTRA + "`.",
  );
});

test("el salteo es RUIDOSO: cada barrido nombra el motivo, no descarta la fila en silencio", () => {
  const mudos = barridosQueEscriben()
    .filter((x) => !x.fuente.includes("MOTIVO_NUESTRA"))
    .map((x) => x.archivo);
  assert.deepEqual(
    mudos,
    [],
    "saltear sin motivo convierte un falso positivo en un lead perdido y mudo: el motivo tiene " +
      "que salir en `skipped[]` para que se vea en el dry-run y en el log",
  );
});
