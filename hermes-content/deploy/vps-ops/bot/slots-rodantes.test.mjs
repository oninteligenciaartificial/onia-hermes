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
  //
  // CUAL de las horas de la franja se elige lo decide la vida util del dia y no el
  // orden (ver «el dia mas cercano no se pierde a mitad de la vigencia»), asi que los
  // casos mezclan las dos ramas a proposito —la del dia cercano, que toma la ultima
  // hora que todavia entra, y la del lejano, que toma el COMIENZO de su franja— y
  // dan tres horas distintas: ninguna constante los pasa.
  const casos = [
    // Jueves 15:30 La Paz -> el piso cae el viernes 15:30: las 14:00 ya pasaron.
    // Ninguna hora del viernes aguanta la vigencia entera, asi que va la ultima que
    // entra, que sale de la franja NOCTURNA (20-22).
    ["2026-09-17T19:30:00Z", 0, "viernes 18 de septiembre, 21:00"],
    // El mismo dia, el sabado siguiente: su franja es 09:00-15:00, o sea que la ultima
    // hora que entra con la demo adentro son las 14:00 — ni 21:00 ni el comienzo.
    ["2026-09-17T19:30:00Z", 1, "sábado 19 de septiembre, 14:00"],
    // Jueves 17:30 -> el lunes ya esta lo bastante lejos como para aguantar toda la
    // vigencia, y ahi si se ofrece el COMIENZO de la franja de tarde.
    ["2026-09-17T21:30:00Z", 2, "lunes 21 de septiembre, 14:00"],
  ];
  for (const [iso, puesto, esperado] of casos) {
    assert.equal(proximosSlots(new Date(iso))[puesto].label, esperado, `desde ${iso}, puesto ${puesto}`);
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

// ---------------------------------------------------------------------------
// «Vigente» no es «hay dos»: es «son los dos que corresponden»
// ---------------------------------------------------------------------------
// El caso de abajo es el spec que servia PRODUCCION el 2026-09-18 (leido de
// /proc/<pid>/environ del webhook vivo). El cron de las 06:23 lo escribio bien
// —"sábado 19, 11:00", 28,6 h de aviso— y a media manana ese sabado dejo de
// llegar a las 24 h. Desde ahi el motor tenia DOS horarios que sostener (lunes y
// martes), asi que `siguenVigentes` contestaba que si y este generador escribia
// «VIGENTES, no toco nada» mientras el bot le ofrecia LUNES 21 a quien escribia
// ese viernes, con el sabado 19 a las 12:00, 13:00 y 14:00 libres y con
// "sáb 9:00-15:00" prometido en la coletilla del MISMO mensaje. Dos dias de
// espera de mas, y la unica razon por la que se arreglo es que alguien lo miro.
//
// Es la misma familia que el caso de arriba, un nivel mas arriba: aquel media
// el umbral («¿el motor los ofrece?») y este mide la SUFICIENCIA («¿hay dos?»).
// Las dos preguntas se contestan que si teniendo un dia entero desperdiciado
// delante. La que hay que hacer es la del prospecto: ¿me estan ofreciendo el
// dia mas cercano al que podria venir?

test("siguenVigentes pide renovar cuando el spec puesto esconde un dia que HOY se puede ofrecer", () => {
  // El spec vivo de produccion, tal cual.
  const spec = [
    "sábado 19 de septiembre, 11:00@2026-09-19T15:00:00Z",
    "lunes 21 de septiembre, 14:00@2026-09-21T18:00:00Z",
    "martes 22 de septiembre, 14:00@2026-09-22T18:00:00Z",
    "miércoles 23 de septiembre, 14:00@2026-09-23T18:00:00Z",
    "jueves 24 de septiembre, 14:00@2026-09-24T18:00:00Z",
  ].join("|");

  // 06:23 La Paz: recien escrito. El sabado todavia llega a las 24 h -> no se toca.
  assert.equal(siguenVigentes(spec, new Date("2026-09-18T10:23:00Z")), true);

  // 12:00 La Paz: el sabado ya no llega, pero quedan lunes y martes, asi que
  // "hay dos". El generador SI puede ofrecer el sabado (a las 14:00), o sea que
  // lo puesto le esconde un dia entero al prospecto: hay que renovar.
  const aMediaManana = new Date("2026-09-18T16:00:00Z");
  // `parseSlotsSpec` ya ELIGE los dos que se sostienen: el sabado no llega a las
  // 24 h, asi que se cayo de la oferta y el primero pasa a ser el lunes.
  assert.deepEqual(
    parseSlotsSpec(spec, { now: aMediaManana }).map((s) => s.label),
    ["lunes 21 de septiembre, 14:00", "martes 22 de septiembre, 14:00"],
    "premisa: el sabado ya se cayo de la oferta",
  );
  assert.equal(
    proximosSlots(aMediaManana)[0].label,
    "sábado 19 de septiembre, 14:00",
    "premisa: el generador todavia alcanza ese sabado",
  );
  assert.equal(siguenVigentes(spec, aMediaManana), false);
});

test("siguenVigentes no manda renovar por la HORA: solo si se pierde el DIA", () => {
  // Esta es la baranda del caso de arriba. Lo que se escribe se sirve 24 h y
  // reescribirlo reinicia el webhook, asi que un criterio que pida que el spec
  // sea identico a lo que se generaria ahora reiniciaria el bot en cada corrida
  // —la hora elegida depende del instante— por cero horas ganadas.
  for (const escrito of ["2026-09-18T10:23:00Z", "2026-09-19T10:23:00Z", "2026-09-21T10:23:00Z"]) {
    const spec = comoSpec(proximosSlots(new Date(escrito)));
    for (const horas of [3, 6, 12, 20]) {
      const alLeer = new Date(new Date(escrito).getTime() + horas * 3600_000);
      const propuesto = proximosSlots(alLeer)[0];
      const ofrecible = (parseSlotsSpec(spec, { now: alLeer }) || []).find((s) => !s.pending);
      // Mientras el dia mas cercano ofrecible sea el mismo, no se toca — aunque
      // la hora del dia haya cambiado.
      if (ofrecible && propuesto && propuesto.startAt.slice(0, 10) === ofrecible.startAt.slice(0, 10)) {
        assert.equal(siguenVigentes(spec, alLeer), true, `renovaria por la hora: ${escrito} +${horas}h`);
      }
    }
  }
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

/**
 * Todas las horas que el motor OFRECERIA en un instante dado, derivadas de las
 * FRANJAS y no del generador — que es justo lo que se esta midiendo.
 */
function ofreciblesAlLeer(alLeer, franjas) {
  const desde = alLeer.getTime() + ANTICIPACION_MINIMA_MS;
  const salida = [];
  const cursor = new Date(alLeer.getTime() - 4 * 3600_000);
  cursor.setUTCHours(0, 0, 0, 0);
  for (let i = 0; i <= 21; i += 1) {
    const local = new Date(cursor);
    local.setUTCDate(local.getUTCDate() + i);
    for (const [horaDesde, horaHasta] of franjas[local.getUTCDay()] || []) {
      for (let hora = horaDesde; hora < horaHasta; hora += 1) {
        const inicioUtc = Date.UTC(
          local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate(), hora + 4, 0, 0,
        );
        if (inicioUtc >= desde) salida.push(new Date(inicioUtc).toISOString());
      }
    }
  }
  return salida.sort();
}

/** `2026-09-19` del lado LOCAL: comparar dias, no horas — el generador manda una por dia. */
const fechaLocal = (iso) => new Date(new Date(iso).getTime() - 4 * 3600_000).toISOString().slice(0, 10);

test("el dia mas cercano no se pierde a mitad de la vigencia", () => {
  // El generador manda UN candidato por dia, asi que la hora que elige decide
  // cuanto vive el DIA en la oferta: la mas temprana es tambien la primera en
  // caerse, y cuando se cae no se pierde un horario — se pierde el dia entero.
  //
  // Medido en produccion el 2026-09-18 11:13 La Paz. El cron de las 06:23 habia
  // escrito "sábado 19, 11:00" (28,6 h de aviso en ese momento, correcto), y a las
  // 11:13 ese horario ya no llegaba a 24 h: el motor lo descartaba y el bot le
  // ofrecia LUNES 21 a quien escribia ese viernes, con el sabado 19 a las 12:00,
  // 13:00 y 14:00 libres y ofrecibles — y con la coletilla del mismo mensaje
  // prometiendole "sáb 9:00-15:00". Dos dias de espera regalados.
  const franjas = franjasDeAtencion();
  // 06:23 La Paz = 10:23 UTC: la hora REAL a la que corre el cron del generador.
  for (const generadoEn of ["2026-09-18T10:23:00Z", "2026-09-16T10:23:00Z", "2026-09-21T10:23:00Z"]) {
    const ahora = new Date(generadoEn);
    const spec = comoSpec(proximosSlots(ahora));
    // A lo largo de la VIGENCIA: lo que se escribe se sirve hasta la corrida siguiente.
    for (const horas of [0, 3, 6, 9, 12, 18, 23]) {
      const alLeer = new Date(ahora.getTime() + horas * 3600_000);
      const esperado = ofreciblesAlLeer(alLeer, franjas)[0];
      const primero = (parseSlotsSpec(spec, { now: alLeer }) || [])[0];
      const contexto = `generado ${generadoEn}, leido +${horas}h (${alLeer.toISOString()}) — spec ${spec}`;
      assert.ok(primero && !primero.pending, `no ofrece ningun horario: ${contexto}`);
      assert.equal(
        fechaLocal(primero.startAt), fechaLocal(esperado),
        `ofrece ${primero.label} teniendo libre ${esperado}: ${contexto}`,
      );
    }
  }
});
