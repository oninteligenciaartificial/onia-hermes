import test from "node:test";
import assert from "node:assert/strict";

import {
  divergencias,
  columnasDelSelect,
  informe,
  medir,
  TOLERANCIA_SEGUNDOS,
  normalizarFecha,
  evidenciaDeChatwoot,
  idDeChatwoot,
  sqlEntrantes,
  leerEntrantesDeChatwoot,
  CAUSA,
} from "./reloj-del-prospecto-vivo.mjs";

/**
 * Los cinco sujetos REALES contados en produccion el 2026-09-19. Van como caso ancla: un gate
 * cuyo universo se puede vaciar en silencio deja de ver justo lo que existe para ver, y esta
 * familia ya fallo asi otras veces en el repo.
 */
const PRODUCCION_19_SEP = [
  // El lead real de WhatsApp: nuestro propio follow-up le corrio el reloj 20,4 h.
  { contactRef: "58", relojGuardado: "2026-09-18T19:17:02+00", ultimoDelProspecto: "2026-09-17T22:50:55+00", mensajesDelProspecto: 1 },
  { contactRef: "57", relojGuardado: "2026-09-04T17:00:05+00", ultimoDelProspecto: "2026-09-04T14:38:10+00", mensajesDelProspecto: 1 },
  { contactRef: "52", relojGuardado: "2026-09-04T12:00:06+00", ultimoDelProspecto: "2026-09-04T03:39:29+00", mensajesDelProspecto: 1 },
  // Sanas: la diferencia es el sellado de la fila, de segundos.
  { contactRef: "11", relojGuardado: "2026-09-10T20:17:26+00", ultimoDelProspecto: "2026-09-10T20:17:26+00", mensajesDelProspecto: 11 },
  { contactRef: "50", relojGuardado: "2026-09-03T02:06:35+00", ultimoDelProspecto: "2026-09-03T02:06:40+00", mensajesDelProspecto: 2 },
];

test("los cinco sujetos de produccion: nombra los tres corridos y deja en paz los dos sanos", () => {
  const v = divergencias(PRODUCCION_19_SEP);
  assert.equal(v.medido, true);
  assert.deepEqual(v.adelantados.map((c) => c.contactRef).sort(), ["52", "57", "58"]);
  assert.equal(v.atrasados.length, 0);
  assert.equal(v.sanos, 2);
});

test("la conv 58 se reporta con su deriva real de 20,4 h, no con un booleano", () => {
  const v = divergencias(PRODUCCION_19_SEP);
  const c58 = v.adelantados.find((c) => c.contactRef === "58");
  assert.ok(c58, "la conv 58 tiene que estar entre los adelantados");
  assert.equal(c58.derivaSegundos, 73567);
  assert.ok(c58.derivaSegundos / 3600 > 20 && c58.derivaSegundos / 3600 < 21);
});

test("DIRECCION SIMETRICA: un reloj ATRASADO tambien es divergencia — ese prospecto no recibe nada", () => {
  const v = divergencias([
    { contactRef: "70", relojGuardado: "2026-09-10T10:00:00+00", ultimoDelProspecto: "2026-09-10T18:00:00+00", mensajesDelProspecto: 3 },
  ]);
  assert.equal(v.medido, true);
  assert.equal(v.adelantados.length, 0);
  assert.equal(v.atrasados.length, 1);
  assert.equal(v.atrasados[0].derivaSegundos, -28800);
});

test("el sellado de la fila (segundos) NO es divergencia: si no, el gate acusa a las quince sanas", () => {
  const v = divergencias([
    { contactRef: "80", relojGuardado: "2026-09-10T10:00:05+00", ultimoDelProspecto: "2026-09-10T10:00:00+00", mensajesDelProspecto: 1 },
  ]);
  assert.equal(v.sanos, 1);
  assert.equal(v.adelantados.length + v.atrasados.length, 0);
});

test("justo en el borde de la tolerancia no acusa, un segundo mas alla si", () => {
  const conDeriva = (seg) => [
    {
      contactRef: "81",
      relojGuardado: new Date(Date.UTC(2026, 8, 10, 10, 0, seg)).toISOString(),
      ultimoDelProspecto: new Date(Date.UTC(2026, 8, 10, 10, 0, 0)).toISOString(),
      mensajesDelProspecto: 1,
    },
  ];
  assert.equal(divergencias(conDeriva(TOLERANCIA_SEGUNDOS)).sanos, 1);
  assert.equal(divergencias(conDeriva(TOLERANCIA_SEGUNDOS + 1)).adelantados.length, 1);
});

test("una conversacion SIN mensajes del prospecto no es sana: es no juzgable, con su motivo", () => {
  const v = divergencias([
    { contactRef: "90", relojGuardado: "2026-09-10T10:00:00+00", ultimoDelProspecto: null, mensajesDelProspecto: 0 },
    { contactRef: "91", relojGuardado: "2026-09-10T10:00:00+00", ultimoDelProspecto: "2026-09-10T10:00:00+00", mensajesDelProspecto: 1 },
  ]);
  assert.equal(v.sanos, 1, "la que no se puede juzgar no puede contarse como sana");
  assert.equal(v.noJuzgables.length, 1);
  assert.equal(v.noJuzgables[0].contactRef, "90");
});

test("NO FIRMA VERDE ANTE LA AUSENCIA: sin filas juzgables el veredicto es NO MEDIDO, nunca ok", () => {
  const vacio = divergencias([]);
  assert.equal(vacio.medido, false);
  assert.equal(informe(vacio).exit, 2);

  const soloNoJuzgables = divergencias([
    { contactRef: "92", relojGuardado: null, ultimoDelProspecto: null, mensajesDelProspecto: 0 },
  ]);
  assert.equal(soloNoJuzgables.medido, false, "un universo entero de no juzgables no es un circuito sano");
  assert.equal(informe(soloNoJuzgables).exit, 2);
});

test("no pude preguntar NO es me dijeron que no: el lector devuelve null y el veredicto sale 2 con la causa", () => {
  const v = medir({
    leerFilas: () => ({ filas: null, causa: "Error: No such container: supabase-db" }),
  });
  assert.equal(v.medido, false);
  assert.match(v.motivo, /No such container/);
  assert.equal(informe(v).exit, 2);
});

test("el exit distingue las tres salidas y el texto nombra la conversacion", () => {
  const roto = informe(divergencias(PRODUCCION_19_SEP));
  assert.equal(roto.exit, 1);
  assert.match(roto.texto, /conv 58/);
  assert.match(roto.texto, /ADELANTADO/);

  const sano = informe(
    divergencias([
      { contactRef: "11", relojGuardado: "2026-09-10T20:17:26+00", ultimoDelProspecto: "2026-09-10T20:17:26+00", mensajesDelProspecto: 11 },
    ]),
  );
  assert.equal(sano.exit, 0);
});

test("el SELECT pide las columnas que el nucleo lee — sacar una lo dejaria ciego en verde", () => {
  const columnas = columnasDelSelect();
  for (const columna of ["contact_ref", "last_inbound_at", "author = 'contact'", "created_at"]) {
    assert.ok(columnas.includes(columna), `el SELECT tiene que pedir ${columna}`);
  }
  // Sin `conversation_key` no hay id de Chatwoot que preguntar, asi que TODAS las filas caen a
  // `sin_distinguir` y el gate vuelve al diagnostico unico — en verde, que es como se pierde.
  assert.ok(columnas.includes("conversation_key"), "el SELECT tiene que pedir conversation_key");
});

test("el huso de dos digitos de Postgres (+00) se parsea: Date.parse lo rechaza crudo", () => {
  // `to_char(ts,'...OF')` emite `+00`, no `+00:00`. Sin normalizar, TODA fila viva cae a
  // "no juzgable" y el gate queda ciego sobre datos perfectos. Caso de regresion del 2026-09-19.
  assert.ok(Number.isNaN(Date.parse("2026-09-18T19:17:02+00")), "premisa: Date.parse rechaza el crudo");
  assert.equal(Date.parse(normalizarFecha("2026-09-18T19:17:02+00")), Date.parse("2026-09-18T19:17:02Z"));

  const v = divergencias([
    { contactRef: "58", relojGuardado: "2026-09-18T19:17:02+00", ultimoDelProspecto: "2026-09-17T22:50:55+00", mensajesDelProspecto: 1 },
  ]);
  assert.equal(v.medido, true, "con el huso de Postgres el gate tiene que poder juzgar");
  assert.equal(v.adelantados.length, 1);
});

/* ────────────────────────────────────────────────────────────────────────────────────────────
 * UNA DIVERGENCIA, DOS CAUSAS OPUESTAS (2026-09-19).
 *
 * La fila del reloj es IDENTICA en los dos bloques de abajo. Lo unico que cambia es lo que dice
 * Chatwoot. Si el gate contestara lo mismo en los dos, mandaria a correr un `update` sobre un
 * entrante sin atender — o sea a borrar la unica prueba del bug del segundo turno.
 * ──────────────────────────────────────────────────────────────────────────────────────────── */

/** La misma divergencia de 8,4 h de la conv 52, que en produccion SI era un reloj corrido. */
const FILA_DIVERGIDA = {
  contactRef: "52",
  conversationKey: "chatwoot:52",
  relojGuardado: "2026-09-04T12:00:06+00",
  ultimoDelProspecto: "2026-09-04T03:39:29+00",
  mensajesDelProspecto: 1,
};

test("CAUSA 1 — Chatwoot coincide con el motor: el reloj es el que miente, y el update es el remedio", () => {
  const entrantes = new Map([["52", "2026-09-04T03:39:27+00"]]); // 2 s antes: el sellado normal
  const v = divergencias([FILA_DIVERGIDA], { entrantes });

  assert.equal(v.adelantados.length, 1);
  assert.equal(v.entrantesSinProcesar.length, 0, "Chatwoot no tiene nada mas nuevo: no hay entrante perdido");
  assert.equal(v.adelantados[0].causa, CAUSA.RELOJ_CORRIDO);

  const salida = informe(v);
  assert.equal(salida.exit, 1);
  assert.match(salida.texto, /reloj_corrido/);
  assert.match(salida.texto, /reparable con un update/);
});

test("CAUSA 2 — MISMA fila, pero Chatwoot tiene un entrante que el motor no registro: NO es el reloj", () => {
  const entrantes = new Map([["52", "2026-09-04T11:59:00+00"]]); // 8,3 h DESPUES de lo que el motor anoto
  const v = divergencias([FILA_DIVERGIDA], { entrantes });

  assert.equal(v.adelantados.length, 0, "no se puede reportar como reloj adelantado: hubo un entrante de verdad");
  assert.equal(v.entrantesSinProcesar.length, 1);
  assert.equal(v.entrantesSinProcesar[0].causa, CAUSA.ENTRANTE_SIN_PROCESAR);

  const salida = informe(v);
  assert.equal(salida.exit, 1);
  assert.match(salida.texto, /ENTRANTE SIN PROCESAR/);
  assert.match(salida.texto, /NO se repara con un update/);
  assert.doesNotMatch(
    salida.texto,
    /reparable con un update/,
    "obedecer ese remedio aca BORRA la evidencia del entrante sin contestar",
  );
});

test("las dos causas son distinguibles: la misma fila da veredictos distintos segun Chatwoot", () => {
  const comoRelojCorrido = divergencias([FILA_DIVERGIDA], {
    entrantes: new Map([["52", "2026-09-04T03:39:27+00"]]),
  });
  const comoEntrantePerdido = divergencias([FILA_DIVERGIDA], {
    entrantes: new Map([["52", "2026-09-04T11:59:00+00"]]),
  });
  assert.notEqual(
    informe(comoRelojCorrido).texto,
    informe(comoEntrantePerdido).texto,
    "si el texto fuera el mismo, el gate seguiria teniendo UNA sola explicacion para dos defectos",
  );
});

test("EL DEFAULT ES ASIMETRICO: sin poder preguntarle a Chatwoot no recomienda el update", () => {
  const v = divergencias([FILA_DIVERGIDA], { entrantes: null });
  assert.equal(v.adelantados[0].causa, CAUSA.SIN_DISTINGUIR);

  const salida = informe(v);
  assert.equal(salida.exit, 1, "la divergencia sigue siendo un defecto aunque no se sepa la causa");
  assert.match(salida.texto, /no se sabe cual de las dos/);
  assert.doesNotMatch(salida.texto, /reparable con un update/);
});

test("una fila que el reloj da por SANA tampoco absuelve un entrante sin procesar", () => {
  // Reloj y motor coinciden al segundo: el gate viejo la contaba entre las sanas y no miraba mas.
  const sanaPorElReloj = {
    contactRef: "58",
    conversationKey: "chatwoot:58",
    relojGuardado: "2026-09-17T22:50:55+00",
    ultimoDelProspecto: "2026-09-17T22:50:55+00",
    mensajesDelProspecto: 1,
  };
  const sinChatwoot = divergencias([sanaPorElReloj], { entrantes: null });
  assert.equal(sinChatwoot.sanos, 1, "premisa: mirando solo el reloj, esta fila esta sana");

  const conEntrantePerdido = divergencias([sanaPorElReloj], {
    entrantes: new Map([["58", "2026-09-18T09:00:00+00"]]),
  });
  assert.equal(conEntrantePerdido.sanos, 0, "un entrante sin atender no puede contar como conversacion sana");
  assert.equal(conEntrantePerdido.entrantesSinProcesar.length, 1);
  assert.equal(informe(conEntrantePerdido).exit, 1);
});

test("el sellado normal (Chatwoot unos segundos ANTES del motor) no es un entrante perdido", () => {
  // Medido en produccion el 2026-09-19: Chatwoot sella 1-5 s antes de que el motor inserte su
  // fila. Si eso contara como entrante perdido, las 40 conversaciones sanas saldrian rojas.
  const v = divergencias(
    [
      { contactRef: "49", conversationKey: "chatwoot:49", relojGuardado: "2026-09-19T03:14:27+00", ultimoDelProspecto: "2026-09-19T03:14:27+00", mensajesDelProspecto: 531 },
      { contactRef: "58", conversationKey: "chatwoot:58", relojGuardado: "2026-09-17T22:50:55+00", ultimoDelProspecto: "2026-09-17T22:50:55+00", mensajesDelProspecto: 1 },
    ],
    { entrantes: new Map([["49", "2026-09-19T03:14:26+00"], ["58", "2026-09-17T22:50:53+00"]]) },
  );
  assert.equal(v.sanos, 2);
  assert.equal(v.entrantesSinProcesar.length, 0);
  assert.equal(informe(v).exit, 0);
});

test("los CONTEOS distintos no son sujeto: el motor registra turnos sembrados y Chatwoot no", () => {
  // conv 49 en produccion: 532 entrantes en Chatwoot contra 531 del motor, con las marcas de
  // tiempo coincidiendo al segundo. Un gate que comparara cantidades acusaria a una conversacion
  // sana — por eso se comparan marcas de tiempo.
  const v = divergencias(
    [{ contactRef: "49", conversationKey: "chatwoot:49", relojGuardado: "2026-09-19T03:14:27+00", ultimoDelProspecto: "2026-09-19T03:14:27+00", mensajesDelProspecto: 531 }],
    { entrantes: new Map([["49", "2026-09-19T03:14:26+00"]]) },
  );
  assert.equal(v.sanos, 1);
});

test("Chatwoot es evidencia extra, no prerrequisito: si no contesta, el reloj se juzga igual", () => {
  const v = medir({
    leerFilas: () => ({ filas: [FILA_DIVERGIDA], causa: null }),
    leerEntrantesDeChatwoot: () => ({ entrantes: null, causa: "No such container" }),
  });
  assert.equal(v.medido, true, "una base de terceros caida no puede volver NO MEDIDO al reloj");
  assert.equal(v.adelantados.length, 1);
  assert.equal(v.adelantados[0].causa, CAUSA.SIN_DISTINGUIR);
});

test("medir() le pasa al lector de Chatwoot las claves de las filas, no otra cosa", () => {
  let recibidas = null;
  medir({
    leerFilas: () => ({ filas: [FILA_DIVERGIDA], causa: null }),
    leerEntrantesDeChatwoot: (claves) => {
      recibidas = claves;
      return { entrantes: new Map([["52", "2026-09-04T03:39:27+00"]]), causa: null };
    },
  });
  assert.deepEqual(recibidas, ["chatwoot:52"], "sin las claves reales el cruce queda vacio y todo sale sin_distinguir");
});

test("idDeChatwoot: solo una conversacion identificable, nunca una adivinada", () => {
  assert.equal(idDeChatwoot("chatwoot:58"), "58");
  assert.equal(idDeChatwoot("chatwoot:999999"), "999999");
  assert.equal(idDeChatwoot("sin-contacto"), null);
  assert.equal(idDeChatwoot("whatsapp:59171654992"), null);
  assert.equal(idDeChatwoot(null), null);
  assert.equal(idDeChatwoot("chatwoot:abc"), null);
});

test("evidenciaDeChatwoot nombra POR QUE no pudo contrastar, en vez de decir que esta al dia", () => {
  const sinMapa = evidenciaDeChatwoot({ conversationKey: "chatwoot:52", ultimoDelProspecto: "2026-09-04T03:39:29+00" }, null);
  assert.equal(sinMapa.estado, "sin_contrastar");
  assert.match(sinMapa.motivo, /no se le pudo preguntar/);

  const claveAjena = evidenciaDeChatwoot({ conversationKey: "sin-contacto", ultimoDelProspecto: "2026-09-04T03:39:29+00" }, new Map());
  assert.equal(claveAjena.estado, "sin_contrastar");
  assert.match(claveAjena.motivo, /no identifica una conversacion de Chatwoot/);

  const sinEntrante = evidenciaDeChatwoot({ conversationKey: "chatwoot:13", ultimoDelProspecto: "2026-08-17T19:01:42+00" }, new Map());
  assert.equal(sinEntrante.estado, "sin_contrastar", "13-19 y 99xxxx existen en el motor y no en Chatwoot");
  assert.match(sinEntrante.motivo, /ningun entrante/);
});

test("sqlEntrantes pide ENTRANTES y filtra todo id que no sea un numero", () => {
  const sql = sqlEntrantes(["58", "52", "58"]);
  assert.match(sql, /message_type = 0/, "message_type 1 es NUESTRO saliente: pedirlo invertiria el gate");
  assert.match(sql, /conversation_id in \(58,52\)/);
  assert.equal(sqlEntrantes([]), null, "sin ids preguntables devuelve null, no un SELECT sin where");
  assert.equal(sqlEntrantes(["58; drop table messages"]), null);
});

test("el lector de Chatwoot devuelve null —no un Map vacio— cuando no se pudo preguntar", () => {
  const caido = leerEntrantesDeChatwoot(["chatwoot:52"], {
    ejecutar: () => {
      const e = new Error("boom");
      e.stderr = "Error: No such container: onia-chatbot_chatwoot-db";
      throw e;
    },
  });
  assert.equal(caido.entrantes, null, "un Map vacio se leeria como 'Chatwoot no tiene nada', que es otra afirmacion");
  assert.match(caido.causa, /No such container/);

  const sinContenedor = leerEntrantesDeChatwoot(["chatwoot:52"], { ejecutar: () => "" });
  assert.equal(sinContenedor.entrantes, null);
  assert.match(sinContenedor.causa, /no encontre el contenedor/);
});

test("el lector busca el contenedor por PREFIJO: en Swarm el nombre lleva sufijo de replica", () => {
  const llamadas = [];
  const r = leerEntrantesDeChatwoot(["chatwoot:52"], {
    ejecutar: (args) => {
      llamadas.push(args);
      if (args[0] === "ps") return "onia-chatbot_chatwoot-db.1.sddet2j4f4gvnrozj4t5b1850\n";
      return "52|2026-09-04T03:39:27+00\n";
    },
  });
  assert.equal(r.entrantes.get("52"), "2026-09-04T03:39:27+00");
  assert.ok(llamadas[1].includes("onia-chatbot_chatwoot-db.1.sddet2j4f4gvnrozj4t5b1850"));
  assert.ok(llamadas[1].includes("onia-chatbot"), "la base de Chatwoot no se llama chatwoot");
});

test("el informe DECLARA su cobertura de contraste: sin eso, Chatwoot caido imprime lo mismo", () => {
  const filas = [
    { contactRef: "49", conversationKey: "chatwoot:49", relojGuardado: "2026-09-19T03:14:27+00", ultimoDelProspecto: "2026-09-19T03:14:27+00", mensajesDelProspecto: 531 },
    { contactRef: "13", conversationKey: "chatwoot:13", relojGuardado: "2026-08-17T19:01:42+00", ultimoDelProspecto: "2026-08-17T19:01:42+00", mensajesDelProspecto: 1 },
  ];
  const entrantes = new Map([["49", "2026-09-19T03:14:26+00"]]);

  const cruzado = informe(divergencias(filas, { entrantes }));
  const aCiegas = informe(divergencias(filas, { entrantes: null }));

  assert.equal(cruzado.exit, 0);
  assert.equal(aCiegas.exit, 0);
  assert.notEqual(
    cruzado.texto,
    aCiegas.texto,
    "las dos son exit 0 con las mismas filas: si el texto fuera igual, un Chatwoot caido seria invisible",
  );
  assert.match(cruzado.texto, /contrastadas contra Chatwoot: 1 de 2/);
  assert.match(cruzado.texto, /Chatwoot no tiene ningun entrante de la conversacion N/);
  assert.match(aCiegas.texto, /contrastadas contra Chatwoot: 0 de 2/);
  assert.match(aCiegas.texto, /NINGUNA causa esta distinguida/);
});
