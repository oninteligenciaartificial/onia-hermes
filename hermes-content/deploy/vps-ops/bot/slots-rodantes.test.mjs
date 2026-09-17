// El dia de la semana de la etiqueta tiene que ser el DIA DE VERDAD.
//
// Nace del bug que este archivo caza: la primera version calculaba el dia
// restandole 4 h a medianoche UTC, y eso cae en el dia anterior — etiquetaba el
// sabado 12 como «viernes 12». Un nombre de dia equivocado no es cosmetico: manda
// al prospecto el dia que no es, y el bot lo dice con total seguridad.
import { test } from "node:test";
import assert from "node:assert/strict";

import { proximosSlots, comoSpec, siguenVigentes } from "./slots-rodantes.mjs";
import { ANTICIPACION_MINIMA_MS, parseSlotsSpec } from "./config.mjs";

/** El dia real, calculado aparte del codigo que se prueba. */
const DIA_REAL = ["domingo","lunes","martes","miércoles","jueves","viernes","sábado"];
const diaDe = (iso) => DIA_REAL[new Date(new Date(iso).getTime() - 4 * 3600_000).getUTCDay()];

test("la etiqueta nombra el mismo dia que su ISO", () => {
  for (const desde of ["2026-09-08T13:00:00Z", "2026-09-11T02:00:00Z", "2026-09-12T13:00:00Z", "2026-12-31T13:00:00Z"]) {
    for (const s of proximosSlots(new Date(desde))) {
      assert.equal(s.label.split(" ")[0], diaDe(s.startAt), `${s.label} vs ${s.startAt}`);
    }
  }
});

test("nunca ofrece sabado ni domingo", () => {
  for (const desde of ["2026-09-11T13:00:00Z", "2026-09-12T13:00:00Z", "2026-09-13T13:00:00Z"]) {
    for (const s of proximosSlots(new Date(desde))) {
      const d = diaDe(s.startAt);
      assert.ok(d !== "sábado" && d !== "domingo", `${s.label} cae en fin de semana`);
    }
  }
});

test("todo horario ofrecido es FUTURO", () => {
  const ahora = new Date("2026-09-10T22:00:00Z");
  for (const s of proximosSlots(ahora)) assert.ok(Date.parse(s.startAt) > ahora.getTime(), s.label);
});

test("el spec sale en el formato que parsea run-turn (etiqueta@ISO|...)", () => {
  const spec = comoSpec(proximosSlots(new Date("2026-09-08T13:00:00Z")));
  assert.match(spec, /^[^@|]+@\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z\|[^@|]+@\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
});

test("siguenVigentes: futuro si, pasado no", () => {
  const spec = "miércoles 9 de septiembre, 14:00@2026-09-09T18:00:00Z";
  assert.equal(siguenVigentes(spec, new Date("2026-09-08T12:00:00Z")), true);
  assert.equal(siguenVigentes(spec, new Date("2026-09-11T12:00:00Z")), false);
  assert.equal(siguenVigentes("", new Date()), false);
});

// ---------------------------------------------------------------------------
// «Vigente» lo decide el MOTOR, no el reloj
// ---------------------------------------------------------------------------
// Este script existe (cabecera, 2026-09-08) para que el bot no le diga a TODO
// prospecto «justo ahora no tengo horarios libres». Decidia renovar con
// `t > ahora` —"son futuros"— mientras el motor decide OFRECER con
// `t >= ahora + ANTICIPACION_MINIMA_MS` (config.mjs, las 24 h que pidio Sergio
// Urcullo el 2026-09-02). En esa banda de 24 h el generador escribe «VIGENTES,
// no toco nada» en su log y el bot exhibe la carencia: el unico dia que este
// script hace falta es el dia que se declara innecesario.
//
// Los dos casos de abajo cruzan contra la funcion REAL del motor a proposito.
// Reimplementar el corte aca seria compararlo consigo mismo.

test("siguenVigentes exige la anticipacion del MOTOR, no solo que sean futuros", () => {
  const spec = "jueves 17 de septiembre, 14:00@2026-09-17T18:00:00Z";
  // 30 h antes: el motor lo ofrece, no hay nada que renovar.
  assert.equal(siguenVigentes(spec, new Date("2026-09-16T12:00:00Z")), true);
  // 3 h antes: sigue siendo futuro, pero el motor ya NO lo ofrece.
  assert.equal(siguenVigentes(spec, new Date("2026-09-17T15:00:00Z")), false);
});

test("lo que genera, el motor lo puede OFRECER durante toda su vigencia", () => {
  // Un miercoles a la manana, un viernes a la noche y un sabado: dias con forma
  // distinta (fin de semana en el medio, y el caso en que en La Paz todavia es
  // ayer respecto de UTC).
  for (const desde of ["2026-09-16T13:00:00Z", "2026-09-18T23:00:00Z", "2026-09-19T13:00:00Z"]) {
    const ahora = new Date(desde);
    const spec = comoSpec(proximosSlots(ahora));
    // Al escribirlo, y tambien al final de las 24 h que se sirve sin recalcular:
    // el margen tiene que alcanzar hasta el ULTIMO prospecto que lo lea.
    for (const alLeer of [ahora, new Date(ahora.getTime() + ANTICIPACION_MINIMA_MS)]) {
      for (const slot of parseSlotsSpec(spec, { now: alLeer }) || []) {
        assert.equal(slot.pending, false, `${slot.label} (generado ${desde}, leido ${alLeer.toISOString()})`);
      }
    }
    assert.equal(siguenVigentes(spec, ahora), true, `recien generado y ya pide renovacion: ${spec}`);
  }
});
