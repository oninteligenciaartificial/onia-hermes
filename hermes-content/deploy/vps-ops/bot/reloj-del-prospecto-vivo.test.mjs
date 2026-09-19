import test from "node:test";
import assert from "node:assert/strict";

import {
  divergencias,
  columnasDelSelect,
  informe,
  medir,
  TOLERANCIA_SEGUNDOS,
  normalizarFecha,
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

test("el SELECT pide las cuatro columnas que el nucleo lee — sacar una lo dejaria ciego en verde", () => {
  const columnas = columnasDelSelect();
  for (const columna of ["contact_ref", "last_inbound_at", "author = 'contact'", "created_at"]) {
    assert.ok(columnas.includes(columna), `el SELECT tiene que pedir ${columna}`);
  }
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
