/**
 * El tope del follow-up tiene que hablar con su cuenta.
 *
 * `skipReason` YA sabe decir `conversacion_muerta`, pero esa rama es INALCANZABLE desde el barrido
 * real: la consulta SQL descarta con `last_inbound_at=gte.<hoy-7d>` ANTES de que el runner pueda
 * juzgar la fila. O sea que el consumidor RECORTA antes de JUZGAR, y lo que el humano lee en el
 * log es `scanned: 0` — la misma cara que "no hay nadie a quien escribirle".
 *
 * Medido el 2026-09-18 contra produccion: `scanned: 0` en las cuatro corridas del dia, con NUEVE
 * conversaciones en `esperando_horario` colgadas por encima del piso de 7 dias. Hoy las nueve son
 * nuestras (seis pruebas del inbox 3, dos sondas del carril y la fila sintetica `chatwoot:999999`),
 * asi que el numero correcto de leads perdidos es cero. Pero el barrido corrio en dry-run hasta el
 * 17-sep (02505ade): el piso NUNCA se ejercio con un desconocido, y el dia que uno quede colgado
 * se va a caer por el mismo agujero con el log diciendo exactamente lo mismo que hoy.
 *
 * Con cero clientes pagando, un prospecto que pidio una demo y no eligio horario es el lead que
 * mas importa. Que se pierda es una decision tomada (a los 8 dias escribir ya es spam); que se
 * pierda EN SILENCIO no lo decidio nadie.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import { runFollowUpSweep, renderHuman } from "./followup-run.mjs";
import { FILTROS_FOLLOWUP_BASE } from "./persistence.mjs";

const AHORA = "2026-09-18T14:00:00Z";

/** Una fila cruda como la que devuelve PostgREST, con lo minimo que `stateFromRow` hidrata. */
function fila({ key, nombre, tel = null, dias }) {
  const inbound = new Date(Date.parse(AHORA) - dias * 86400000).toISOString();
  return {
    conversation_key: key,
    display_name: nombre,
    public_contact: tel,
    bot_stage: "esperando_horario",
    followup_step: 0,
    human_took_over: false,
    opt_out_at: null,
    last_inbound_at: inbound,
    last_outbound_at: inbound,
  };
}

/** Store de mentira: separa lo que cae en la franja elegible de lo que quedo por encima del piso. */
function store({ elegibles = [], vencidas = [], sinMetodo = false, vencidasNull = false } = {}) {
  const base = {
    enabled: true,
    warnings: [],
    async sweepFollowUpCandidates() {
      return elegibles.map((r) => ({ ...r }));
    },
    async reserveFollowUp() {
      return true;
    },
    async insertOutbound(m) {
      return m.length;
    },
    async saveConversation() {
      return true;
    },
  };
  if (!sinMetodo) {
    base.sweepFollowUpVencidas = async () => (vencidasNull ? null : vencidas.map((r) => ({ ...r })));
  }
  return base;
}

test("las colgadas por encima del piso se CUENTAN, y se separa el desconocido de lo nuestro", async () => {
  const resultado = await runFollowUpSweep(
    { nowIso: AHORA, emit: false },
    {
      store: store({
        vencidas: [
          fila({ key: "chatwoot:50", nombre: "Sonda QA carril chatbot", dias: 15 }),
          fila({ key: "chatwoot:7", nombre: "Prueba Audio Prod", dias: 48 }),
          fila({ key: "chatwoot:61", nombre: "Marcela", dias: 9 }),
        ],
      }),
    },
  );

  assert.equal(resultado.colgadas.medido, true);
  assert.equal(resultado.colgadas.total, 3);
  // Lo unico que le importa a una persona: cuantos de esos eran leads de verdad.
  assert.equal(resultado.colgadas.desconocidas, 1);
  assert.equal(resultado.colgadas.nuestras, 2);
  // Y NOMBRADO, para que no haya que ir a la base a saber a quien se perdio.
  assert.ok(
    resultado.colgadas.quienes.some((q) => q.conversationKey === "chatwoot:61"),
    "el desconocido colgado tiene que salir nombrado",
  );
  assert.ok(
    !resultado.colgadas.quienes.some((q) => q.conversationKey === "chatwoot:50"),
    "lo nuestro se cuenta aparte, no se nombra como lead perdido",
  );
});

test("el humano lo lee sin abrir la base: la linea nombra al desconocido colgado", async () => {
  const resultado = await runFollowUpSweep(
    { nowIso: AHORA, emit: false },
    { store: store({ vencidas: [fila({ key: "chatwoot:61", nombre: "Marcela", dias: 9 })] }) },
  );
  const texto = renderHuman(resultado);
  assert.match(texto, /chatwoot:61/);
  assert.match(texto, /Marcela/);
});

test("cero colgadas NO inventa una alarma: el circuito sano se ve sano", async () => {
  const resultado = await runFollowUpSweep(
    { nowIso: AHORA, emit: false },
    { store: store({ vencidas: [] }) },
  );
  assert.equal(resultado.colgadas.medido, true);
  assert.equal(resultado.colgadas.total, 0);
  assert.equal(resultado.colgadas.desconocidas, 0);
  // Nada de alarma: ni un sujeto nombrado, ni la nota que la dispara.
  assert.doesNotMatch(renderHuman(resultado), /YA NO SE RESCATA/);
  assert.ok(!resultado.notes.includes("colgadas_sin_rescate"));
});

test("solo NUESTRAS colgadas no es un lead perdido: desconocidas queda en 0", async () => {
  const resultado = await runFollowUpSweep(
    { nowIso: AHORA, emit: false },
    {
      store: store({
        vencidas: [fila({ key: "chatwoot:999999", nombre: "Prueba Final", dias: 8 })],
      }),
    },
  );
  assert.equal(resultado.colgadas.total, 1);
  assert.equal(resultado.colgadas.desconocidas, 0);
});

test("lo que no se pudo leer NO es cero: sin dato, medido:false y total null", async () => {
  // La trampa de toda esta familia: un catch que devuelve 0 dice "no hay leads perdidos" cuando lo
  // que paso es que nadie pudo preguntar. Falla hacia el lado caro — el que calla el aviso.
  for (const variante of [{ vencidasNull: true }, { sinMetodo: true }]) {
    const resultado = await runFollowUpSweep({ nowIso: AHORA, emit: false }, { store: store(variante) });
    assert.equal(resultado.colgadas.medido, false, JSON.stringify(variante));
    assert.equal(resultado.colgadas.total, null, JSON.stringify(variante));
    assert.notEqual(resultado.colgadas.total, 0, JSON.stringify(variante));
  }
});

test("las dos consultas parten la MISMA poblacion: la BASE no se tipea dos veces", async () => {
  // La clase, no la instancia. El dia que alguien agregue una condicion de PERTENENCIA en un solo
  // lado, quedan filas que no son de ninguna de las dos — ni se les escribe ni se las cuenta, que
  // es el peor de los dos mundos. Ese motivo sigue vivo y es lo que este caso ata.
  //
  // ⚠️ Corregido el 2026-09-24: hasta hoy esto exigia el predicado COMPLETO, y esa exigencia
  // DEFENDIA un bug. `followup_step=eq.0` no es pertenencia, es elegibilidad para escribir; metida
  // en lo compartido, borraba del conteo justo a la conversacion mas perdida (la que ya recibio su
  // follow-up). Lo compartido ahora es la BASE; el porque, con la medicion en produccion que lo
  // probo, esta en `colgada-que-ya-recibio-followup-sigue-perdida.test.mjs`.
  const fuente = await readFile(new URL("./persistence.mjs", import.meta.url), "utf8");
  const cuerpo = (nombre) => {
    const desde = fuente.indexOf(`async function ${nombre}(`);
    assert.notEqual(desde, -1, `no encontre ${nombre} — ¿la renombraron?`);
    return fuente.slice(desde, fuente.indexOf("\n  }", desde));
  };

  for (const nombre of ["sweepFollowUpCandidates", "sweepFollowUpVencidas"]) {
    const src = cuerpo(nombre);
    assert.match(src, /\.\.\.FILTROS_(FOLLOWUP|COLGADAS)\b/, `${nombre} tiene que DERIVAR un predicado compartido`);
    assert.match(src, /pisoFollowUp\(/, `${nombre} tiene que derivar el piso, no recalcularlo`);
    for (const tipeado of FILTROS_FOLLOWUP_BASE) {
      assert.ok(
        !src.includes(`"${tipeado}"`),
        `${nombre} tipea "${tipeado}" a mano en vez de tomarlo de FILTROS_FOLLOWUP_BASE`,
      );
    }
  }
});

test("contar las colgadas no le escribe a ninguna: a los 8 dias ya no se manda", async () => {
  // La decision de no escribirles esta tomada y no se reabre aca. Este caso la ata: si alguien
  // hace que las vencidas entren al bucle de envio, el barrido se convierte en spam a 48 dias.
  const resultado = await runFollowUpSweep(
    { nowIso: AHORA, emit: true },
    {
      store: store({
        vencidas: [fila({ key: "chatwoot:61", nombre: "Marcela", dias: 9 })],
      }),
    },
  );
  assert.equal(resultado.send.length, 0);
  assert.equal(resultado.scanned, 0);
});
