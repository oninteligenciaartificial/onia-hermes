// El dia de la semana de la etiqueta tiene que ser el DIA DE VERDAD.
//
// Nace del bug que este archivo caza: la primera version calculaba el dia
// restandole 4 h a medianoche UTC, y eso cae en el dia anterior — etiquetaba el
// sabado 12 como «viernes 12». Un nombre de dia equivocado no es cosmetico: manda
// al prospecto el dia que no es, y el bot lo dice con total seguridad.
import { test } from "node:test";
import assert from "node:assert/strict";

import { proximosSlots, comoSpec, siguenVigentes } from "./slots-rodantes.mjs";
import { ANTICIPACION_MINIMA_MS, parseSlotsSpec, slotsPending } from "./config.mjs";
import { franjasDeAtencion } from "./ventanas-de-atencion.mjs";

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

// ---------------------------------------------------------------------------
// La disponibilidad es UNA, y no vive aca
// ---------------------------------------------------------------------------
// Hasta el 2026-09-18 este bloque se llamaba «nunca ofrece sabado ni domingo» y
// AFIRMABA EL DEFECTO: el sabado 09:00-15:00 es horario de atencion declarado
// por Sergio Urcullo (cita textual del 2026-09-02, `VENTANAS_ATENCION`), el otro
// generador lo ofrece y la coletilla que el bot manda en el MISMO mensaje lo
// promete. Lo que se sostiene es la baranda —no ofrecer un dia en el que no hay
// nadie, que es el domingo—, no la prohibicion del sabado.
//
// El costo, medido el 2026-09-18 09:43 La Paz con los dos generadores corridos
// sobre el MISMO instante: el .py daba «sábado 19, 10:00» y este daba «lunes 21,
// 14:00». Dos dias de espera de diferencia escribiendo los dos la MISMA variable
// (`ONIA_BOT_SLOTS`), y este es el que corre DESPUES (07:41 vs 06:23 La Paz), o
// sea el que tiene la ultima palabra el dia que el otro falla — que es el unico
// dia para el que existe.

test("todo horario ofrecido cae DENTRO de una franja de atencion", () => {
  const franjas = franjasDeAtencion();
  for (const desde of ["2026-09-11T13:00:00Z", "2026-09-12T13:00:00Z", "2026-09-13T13:00:00Z", "2026-09-18T13:43:00Z"]) {
    const slots = proximosSlots(new Date(desde));
    assert.ok(slots.length > 0, `sin candidatos desde ${desde}`);
    for (const s of slots) {
      // El dia y la hora LOCALES del slot, calculados aparte del codigo que se prueba.
      const local = new Date(Date.parse(s.startAt) - 4 * 3600_000);
      const delDia = franjas[local.getUTCDay()] || [];
      assert.ok(
        delDia.some(([ini, fin]) => local.getUTCHours() >= ini && local.getUTCHours() < fin),
        `${s.label} (${s.startAt}) no cae en ninguna franja de atencion: el bot ofreceria un horario en el que no hay nadie`,
      );
    }
  }
});

test("el sabado se OFRECE: es horario de atencion, no fin de semana muerto", () => {
  // Viernes 18 de septiembre, 09:43 La Paz. El sabado 19 esta a mas de 24 h y su
  // ventana (09:00-15:00) esta abierta. Con la disponibilidad propia que tenia este
  // archivo —lun-vie a las 14:00 y nada mas— el primero era «lunes 21»: tres dias de
  // espera para el prospecto que escribe un viernes, con el sabado libre.
  const primero = proximosSlots(new Date("2026-09-18T13:43:00Z"))[0];
  assert.equal(diaDe(primero.startAt), "sábado", `el primero fue ${primero.label}`);
});

test("la HORA sale de la franja, no de una constante", () => {
  // El dia tambien se puede perder por la hora: con las 14:00 clavadas —como estaba—
  // un dia cuya franja de tarde ya arranco, o que solo tiene la nocturna abierta, se
  // descarta ENTERO y el prospecto salta al siguiente.
  const casos = [
    // Jueves 15:30 La Paz -> el piso cae el viernes 15:30: 14:00 ya paso, 16:00 entra.
    ["2026-09-17T19:30:00Z", "viernes 18 de septiembre, 16:00"],
    // Jueves 17:30 -> el viernes ya cerro la franja de tarde (14-17); queda la de 20-22.
    ["2026-09-17T21:30:00Z", "viernes 18 de septiembre, 20:00"],
  ];
  for (const [iso, esperado] of casos) {
    assert.equal(proximosSlots(new Date(iso))[0].label, esperado, `desde ${iso}`);
  }
});

test("el domingo no se ofrece nunca: no hay nadie del otro lado", () => {
  for (const desde of ["2026-09-11T13:00:00Z", "2026-09-18T13:43:00Z", "2026-09-19T13:00:00Z"]) {
    for (const s of proximosSlots(new Date(desde))) {
      assert.notEqual(diaDe(s.startAt), "domingo", `${s.label} cae un domingo`);
    }
  }
});

test("todo horario ofrecido es FUTURO", () => {
  const ahora = new Date("2026-09-10T22:00:00Z");
  for (const s of proximosSlots(ahora)) assert.ok(Date.parse(s.startAt) > ahora.getTime(), s.label);
});

test("el spec sale en el formato que parsea run-turn (etiqueta@ISO|...)", () => {
  const ahora = new Date("2026-09-08T13:00:00Z");
  const spec = comoSpec(proximosSlots(ahora));
  // El sujeto es el FORMATO de cada par, no cuantos hay: desde que se generan candidatos de
  // mas para que el motor elija (CUANTOS), anclar la cantidad convertia este test en un tope
  // silencioso — se ponia rojo por un cambio deliberado sin decir nada del formato.
  assert.match(spec, /^([^@|]+@\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z)(\|[^@|]+@\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z)*$/);

  // Y la prueba que de verdad importa: que el MOTOR lo entienda y salga con dos para
  // ofrecer. Comparar contra una regex escrita a mano es una copia del parseo real; esto
  // pregunta al consumidor, que es quien decide si el prospecto ve horarios o no.
  const leidos = parseSlotsSpec(spec, { now: ahora });
  assert.equal(leidos.length, 2, "el guion recibe el par A/B, no los candidatos crudos");
  assert.ok(!slotsPending({ slots: leidos }), "y los dos son ofrecibles de verdad");
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
