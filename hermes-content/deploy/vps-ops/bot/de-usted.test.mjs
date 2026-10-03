// AL PROSPECTO SE LE HABLA DE USTED (3-oct-2026).
//
// Sergio Urcullo, por la madre: «no se usa vos, es muy informal, usted». El barrido de ese dia
// paso a usted el guion de venta (config.mjs), el texto seguro del guardrail y las respuestas del
// knowledge. Este test es la prueba de hecho, y queda para que el proximo texto que entre en
// voseo o en tuteo no pase en silencio: «una regla sin su gate se desobedece».
//
// Quedan AFUERA a proposito, y cada uno con su motivo:
//   - M3_PLANTILLA y M9_PLANTILLA: copias LITERALES de plantillas aprobadas en Meta
//     (`seguimiento_demo`, `recordatorio_demo`). Cambiarlas aca sin una plantilla nueva aprobada
//     rompe el envio. Pasan a usted cuando Meta apruebe la version nueva.
//   - El recepcionista (R_*, M0R, M6R): es el bot que cada negocio cliente pone delante de SUS
//     clientes, no el que le vende Onia al prospecto. Su registro queda a decision de Sergio Urcullo.
//   - Lo que escribe el prospecto (triggers, optOut, frases de campaña): no es texto del bot.

import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

import { DEFAULT_CONFIG, allQualificationFields } from "./config.mjs";
import { SAFE_REPLY, SAFE_REPLY_BASE } from "./guardrails.mjs";

const leer = (archivo) => JSON.parse(fs.readFileSync(new URL(archivo, import.meta.url), "utf8"));

const FUERA = new Set(["M3_PLANTILLA", "M9_PLANTILLA", "M0R", "M6R"]);
const esFuera = (clave) => FUERA.has(clave) || clave.startsWith("R_");

// Bordes de palabra con letras acentuadas: `\b` de JS es ASCII y partia «contestárselo» en
// «contestá» + «rselo» (falso positivo del primer barrido). Fuera de la lista, las formas que
// tambien son primera persona: «escribí» / «elegí» («Le escribí ayer» es de usted).
const VOSEO_O_TUTEO = new RegExp(
  "(?<!\\p{L})(" +
    [
      "vos", "sos", "te", "tu", "tus", "tú", "ti", "contigo", "tuyo", "tuya",
      "tenés", "querés", "podés", "sabés", "estás", "necesitás", "hacés", "usás", "preferís",
      "elegís", "pasás", "dedicás", "coordinás", "trabajás", "atendés",
      "contame", "decime", "dejame", "escribime", "escribile", "mandame", "pasame", "avisame",
      "fijate", "mirá", "probá", "respondé", "contestá", "tocá", "agendá",
    ].join("|") +
    ")(?!\\p{L})",
  "giu",
);

function textosDelBot() {
  const textos = [];
  const juntar = (valor, donde) => {
    if (typeof valor === "string") textos.push({ donde, texto: valor });
    else if (Array.isArray(valor)) valor.forEach((v, i) => juntar(v, `${donde}[${i}]`));
    else if (valor && typeof valor === "object") {
      for (const [clave, v] of Object.entries(valor)) if (!esFuera(clave)) juntar(v, `${donde}.${clave}`);
    }
  };

  juntar(DEFAULT_CONFIG.script, "script");
  for (const campo of allQualificationFields()) juntar(campo.missLabel, `missLabel.${campo.key}`);
  for (const rama of Object.values(DEFAULT_CONFIG.qualification.branches || {})) {
    juntar(rama.moduleNote, `rama.${rama.key}.moduleNote`);
  }
  for (const producto of DEFAULT_CONFIG.productos) juntar(producto.nombre, `producto.${producto.key}`);
  juntar({ SAFE_REPLY, SAFE_REPLY_BASE }, "guardrails");

  for (const archivo of ["./knowledge.onia.json", "./knowledge.example.json"]) {
    const conocimiento = leer(archivo);
    (conocimiento.campanas || []).forEach((c, i) => juntar(c.respuesta, `${archivo}.campanas[${i}].respuesta`));
    (conocimiento.faq || []).forEach((f) => juntar(f.body, `${archivo}.faq.${f.id}`));
    (conocimiento.productos || []).forEach((p) => juntar(p.nombre, `${archivo}.productos.${p.key}`));
  }
  return textos;
}

test("el detector ve el voseo y el tuteo, y no confunde «contestárselo» (si no, el gate pasa vacío)", () => {
  for (const malo of ["¿me lo pasás?", "Contame mientras", "¿Cuál te va mejor?", "a qué se dedica tu negocio"]) {
    assert.match(malo, VOSEO_O_TUTEO, malo);
    VOSEO_O_TUTEO.lastIndex = 0;
  }
  for (const bueno of ["Eso prefiero no contestárselo yo", "Le escribí ayer", "¿me lo pasa?", "Este es el texto", "Cuénteme"]) {
    assert.doesNotMatch(bueno, VOSEO_O_TUTEO, bueno);
    VOSEO_O_TUTEO.lastIndex = 0;
  }
});

test("todo lo que el bot de venta le escribe al prospecto está de usted", () => {
  const textos = textosDelBot();
  assert.ok(textos.length > 60, `se esperaban los textos del guion y del knowledge, llegaron ${textos.length}`);

  const encontrados = [];
  for (const { donde, texto } of textos) {
    for (const m of texto.matchAll(VOSEO_O_TUTEO)) encontrados.push(`${donde}: «${m[0]}» en «${texto.slice(0, 90)}»`);
  }
  assert.deepEqual(encontrados, [], `texto en voseo o tuteo:\n${encontrados.join("\n")}`);
});

test("lo que queda afuera existe de verdad (si se renombra, la exclusión no tapa un texto nuevo)", () => {
  for (const clave of ["M3_PLANTILLA", "M9_PLANTILLA", "M0R", "M6R"]) {
    assert.ok(clave in DEFAULT_CONFIG.script, `${clave} ya no existe: sacarlo de FUERA`);
  }
});
