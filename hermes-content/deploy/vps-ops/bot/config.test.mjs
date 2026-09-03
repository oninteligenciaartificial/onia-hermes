import test from "node:test";
import assert from "node:assert/strict";

import { DEFAULT_CONFIG, renderTemplate } from "./config.mjs";

// ---------------------------------------------------------------------------
// EL BUG QUE ESTOS CASOS CIERRAN
//
// `renderTemplate` sustituia `{{humano}}` por el valor CRUDO del conocimiento de la org. Con el
// humano de Onia el valor es un nombre propio (`Sergio`) y nunca se noto; el conocimiento de un
// cliente trae un CARGO en minuscula (`la encargada`), y hay cuatro plantillas donde `{{humano}}`
// cae al empezar una oracion. Medido en vivo el 2026-09-03 en la conversacion 51, textual:
//
//     _(Estoy respondiendo automatico fuera de horario de oficina. la encargada te confirma
//     en la mañana.)_
//
// Lo ve el cliente del cliente, en la primera respuesta. No es cosmetico: es la unica frase que
// el negocio manda cuando nadie esta.
//
// Por que la regla mira el OFFSET y no la clave: el defecto no es de `humano`, es de cualquier
// valor que caiga a empezar oracion. Atarlo a una clave dejaria el mismo bug vivo en la proxima
// plantilla que alguien escriba.
// ---------------------------------------------------------------------------

test("un cargo en minuscula que ARRANCA la frase se capitaliza", () => {
  assert.equal(renderTemplate("{{h}} llega", { h: "la encargada" }), "La encargada llega");
});

test("el mismo cargo a mitad de frase NO se toca", () => {
  assert.equal(renderTemplate("lo ve {{h}} hoy", { h: "la encargada" }), "lo ve la encargada hoy");
});

test("despues de punto empieza oracion: se capitaliza", () => {
  assert.equal(
    renderTemplate("Listo. {{h}} te confirma", { h: "la encargada" }),
    "Listo. La encargada te confirma",
  );
});

test("despues de ? y de ! tambien empieza oracion", () => {
  assert.equal(renderTemplate("¿Vamos? {{h}} coordina", { h: "la encargada" }), "¿Vamos? La encargada coordina");
  assert.equal(renderTemplate("¡Listo! {{h}} coordina", { h: "la encargada" }), "¡Listo! La encargada coordina");
});

test("despues de salto de linea empieza oracion", () => {
  assert.equal(
    renderTemplate("Perfecto, anotado.\n\n{{h}} te coordina el horario", { h: "la encargada" }),
    "Perfecto, anotado.\n\nLa encargada te coordina el horario",
  );
});

// Los dos puntos NO abren oracion en castellano: "Anotado: agenda y cobros" es correcto y
// "Anotado: Agenda y cobros" no lo es. Es el caso que separa esta regla de un `toUpperCase` a lo
// bruto, y el que mas facil se rompe si alguien "simplifica" la condicion.
test("despues de dos puntos NO se capitaliza", () => {
  assert.equal(
    renderTemplate("Anotado: {{d}}. Nos vemos", { d: "agenda y cobros" }),
    "Anotado: agenda y cobros. Nos vemos",
  );
});

test("un nombre propio no se toca — ya venia bien y sigue igual", () => {
  assert.equal(renderTemplate("{{h}} llega", { h: "Sergio" }), "Sergio llega");
});

test("un valor que no empieza con letra minuscula pasa intacto (vineta, numero, negrita)", () => {
  assert.equal(renderTemplate("{{p}}", { p: "• uno\n• dos" }), "• uno\n• dos");
  assert.equal(renderTemplate("{{s}} arranca", { s: "10:00 del martes" }), "10:00 del martes arranca");
  assert.equal(renderTemplate("{{s}} arranca", { s: "**lunes**" }), "**lunes** arranca");
});

// Si la clave no existe el marcador queda tal cual — comportamiento viejo, y capitalizarlo lo
// convertiria en `{{Humano}}`, o sea en un marcador que ya no empareja con nada.
test("una clave sin valor deja el marcador crudo, sin capitalizar", () => {
  assert.equal(renderTemplate("{{humano}} llega", {}), "{{humano}} llega");
  assert.equal(renderTemplate("{{humano}} llega", { humano: null }), "{{humano}} llega");
});

// ---------------------------------------------------------------------------
// Y la prueba contra las plantillas REALES, que es la que representa lo que ve el cliente del
// cliente. Un test del helper solo demuestra el helper; estas cuatro son las que salieron mal a
// produccion.
// ---------------------------------------------------------------------------

test("las cuatro plantillas donde {{humano}} abre oracion salen capitalizadas", () => {
  const vars = {
    humano: "la encargada",
    datos_que_si_dio: "clinica dental",
    nota_modulo: "",
    dia_hora_elegida: "el martes 10:00",
  };
  for (const clave of ["M0b_SIN_HORARIOS", "M2b", "M7", "PENDING_HORARIO_SIN_HORARIOS"]) {
    const texto = renderTemplate(DEFAULT_CONFIG.script[clave], vars);
    assert.ok(
      texto.includes("La encargada"),
      `${clave} deberia abrir con "La encargada" y dio: ${JSON.stringify(texto)}`,
    );
    assert.ok(
      !texto.includes(". la encargada") && !texto.startsWith("la encargada"),
      `${clave} dejo el cargo en minuscula abriendo oracion: ${JSON.stringify(texto)}`,
    );
  }
});

test("M_SIAT_BODY tiene {{humano}} a mitad de frase y sigue en minuscula", () => {
  const texto = renderTemplate(DEFAULT_CONFIG.script.M_SIAT_BODY, {
    humano: "la encargada",
    producto: "Onia",
  });
  assert.ok(texto.includes("lo ve la encargada en la demo"), texto);
});
