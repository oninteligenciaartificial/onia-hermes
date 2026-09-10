// El dia de la semana de la etiqueta tiene que ser el DIA DE VERDAD.
//
// Nace del bug que este archivo caza: la primera version calculaba el dia
// restandole 4 h a medianoche UTC, y eso cae en el dia anterior — etiquetaba el
// sabado 12 como «viernes 12». Un nombre de dia equivocado no es cosmetico: manda
// al prospecto el dia que no es, y el bot lo dice con total seguridad.
import { test } from "node:test";
import assert from "node:assert/strict";

import { proximosSlots, comoSpec, siguenVigentes } from "./slots-rodantes.mjs";

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
