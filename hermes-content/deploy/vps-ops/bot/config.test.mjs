import test from "node:test";
import assert from "node:assert/strict";

import { DEFAULT_CONFIG, parseSlotsSpec, renderTemplate, slotsElegibles } from "./config.mjs";

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

// ---------------------------------------------------------------------------
// OFRECER es de a dos; ACEPTAR no tiene por que serlo
// ---------------------------------------------------------------------------
// Medido en produccion el 2026-09-24: de 43 conversaciones, 18 llegaron a `esperando_horario`
// y ahi se quedaron. El cron publica CINCO horarios por dia y el guion nombra
// dos ({{slot_a}} y {{slot_b}} en la misma frase): los otros tres seguian LIBRES en la agenda,
// pero para el motor no existian. Quien escribia "el lunes 28 a las 14:00" —un horario nuestro,
// libre y dentro de la franja que la coletilla del MISMO mensaje le prometia— no matcheaba
// ningun slot, caia en `intents.proposesOwnTime` y se iba a la cola humana.
//
// OJO con la evidencia que NO sirve, y que este bloque citaba hasta el 2026-09-25: el CERO de
// `calendar_event_id`. No prueba nada de este bug y no se mueve con ningun deploy — Cal.com no
// existe en el VPS POR DECISION (opcion (c), tablero `t_b18ca430`), asi que esa columna solo
// puede ser null. Re-medido el 2026-09-25: `docker ps -a | grep -i cal` no devuelve NINGUN
// contenedor y desde `onia-center` el host da `bad address 'calcom:3000'`.
// Y "CERO a `demo_agendada`" tambien era falso: la etapa SI se alcanzo —conv=49 el 2026-09-03 y
// conv=11 el 2026-09-10, con su aviso a Telegram en el log del bot vivo—; lo que no hay es
// ninguna fila PARADA ahi, porque despues siguen a `handoff_humano`. Un estado mutable no cuenta
// historia. Citar cualquiera de los dos manda a la proxima vuelta a buscar un bug decidido; la
// consecuencia real de este es la cola humana. Detalle en `config.mjs`, sobre `slotsElegibles`.
//
// `parseSlotsSpec` NO cambia: sigue devolviendo el par A/B, que es lo que el guion sabe decir.
// Lo que se agrega es la otra pregunta, que nadie estaba haciendo: que MAS podemos aceptar.
const SPEC_CINCO = [
  "viernes 25 de septiembre, 21:00@2026-09-26T01:00:00Z",
  "sábado 26 de septiembre, 09:00@2026-09-26T13:00:00Z",
  "lunes 28 de septiembre, 14:00@2026-09-28T18:00:00Z",
  "martes 29 de septiembre, 14:00@2026-09-29T18:00:00Z",
  "miércoles 30 de septiembre, 14:00@2026-09-30T18:00:00Z",
].join("|"); // el ONIA_BOT_SLOTS del proceso vivo, leido de /proc/<pid>/environ el 2026-09-24

test("slotsElegibles: los horarios libres que el guion no nombra siguen siendo elegibles", () => {
  const ahora = Date.parse("2026-09-24T15:00:00Z");
  const ofrecidos = parseSlotsSpec(SPEC_CINCO, { now: ahora });
  assert.deepEqual(
    ofrecidos.map((slot) => slot.label),
    ["viernes 25 de septiembre, 21:00", "sábado 26 de septiembre, 09:00"],
    "premisa: el guion sigue ofreciendo DOS, ni uno mas",
  );

  const extras = slotsElegibles(SPEC_CINCO, { now: ahora });
  assert.deepEqual(
    extras.map((slot) => slot.label),
    [
      "lunes 28 de septiembre, 14:00",
      "martes 29 de septiembre, 14:00",
      "miércoles 30 de septiembre, 14:00",
    ],
    "los tres que quedaron fuera del par se pueden ACEPTAR",
  );
  assert.ok(
    extras.every((slot) => slot.key === null),
    "sin letra a proposito: un 'A' reasignado le confirmaria a alguien un dia que nunca eligio",
  );
  assert.ok(extras.every((slot) => slot.pending === false && slot.startAt), "vivos y reservables");
});

test("slotsElegibles: ni el par ofrecido ni lo que ya caduco se cuelan", () => {
  const ahora = Date.parse("2026-09-24T15:00:00Z");
  const spec = [
    "jueves 24 de septiembre, 18:00@2026-09-24T22:00:00Z", // no llega a la anticipacion minima
    "viernes 25 de septiembre, 21:00@2026-09-26T01:00:00Z",
    "sábado 26 de septiembre, 09:00@2026-09-26T13:00:00Z",
    "lunes 28 de septiembre, 14:00@2026-09-28T18:00:00Z",
  ].join("|");

  const extras = slotsElegibles(spec, { now: ahora });
  assert.deepEqual(
    extras.map((slot) => slot.label),
    ["lunes 28 de septiembre, 14:00"],
    "el caducado no es elegible y el par ofrecido no se duplica",
  );
  assert.deepEqual(slotsElegibles("", { now: ahora }), [], "sin spec no se inventa ninguno");
});
