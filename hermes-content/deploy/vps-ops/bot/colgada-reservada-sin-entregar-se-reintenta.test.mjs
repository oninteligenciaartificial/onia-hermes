/**
 * UNA RESERVA QUE NUNCA SE ENTREGO NO PUEDE SILENCIAR AL LEAD PARA SIEMPRE.
 *
 * EL CASO, medido en produccion el 2026-09-25 (no heredado). El deploy del bot salio a las 18:44
 * UTC y encendio este barrido. El directorio de marcas del VPS quedo asi:
 *
 *     /var/lib/onia-colgada-avisado/   (dentro del contenedor onia-center)
 *       19:00  colgada-chatwoot:990777-...    <- 930 h callado
 *       19:00  colgada-chatwoot:990779-...    <- 930 h
 *       19:00  colgada-chatwoot:40-...        <- 647 h
 *       19:00  colgada-chatwoot:45-...        <- 596 h
 *       19:00  colgada-chatwoot:46-...        <- 575 h
 *       19:17  colgada-chatwoot:47-...        <- 557 h
 *       19:17  colgada-chatwoot:58-...        <- 191 h
 *
 * Las de 19:17 son del cron, y su corrida lo dice: `avisados:["chatwoot:47","chatwoot:58"]`. Las
 * CINCO de 19:00 las escribio otro proceso que reservo y nunca entrego: en todo el log del
 * barrido hay UNA sola corrida con `avisados` no vacio. Y como ordena por antiguedad, ese
 * proceso se llevo justo a los cinco que llevaban MAS tiempo callados.
 *
 * Resultado: 2 de 7 desconocidos avisados, y los 5 mas viejos mudos PARA SIEMPRE — `reservar`
 * devuelve `false` por EEXIST en cada corrida siguiente, y estas marcas no se purgan a proposito
 * (el silencio de un lead no vence, ver `avisarColgadas`). El objetivo de este carril es que cada
 * handoff le llegue a Sergio Urcullo; cinco no le llegaron y ninguna corrida futura los iba a
 * recuperar.
 *
 * POR QUE NO ALCANZA EL `catch` QUE YA LIBERA. Ese camino existe y funciona —lo cuida
 * `colgada-avisa-una-sola-vez.test.mjs`— pero solo corre si el proceso LLEGA al catch. Un proceso
 * que muere entre la reserva y el envio, o un llamador que no pasa por ahi, deja la marca puesta.
 * El anti-duplicado no puede depender de que todos los llamadores se porten bien: el costo de
 * equivocarse es permanente en una direccion (silencio eterno) y barato en la otra (un aviso
 * repetido).
 *
 * LA DISTINCION QUE FALTABA: un archivo VACIO era "ya avise". Ahora es "lo estoy mandando"; el
 * veredicto se ESCRIBE adentro al confirmarse. Una reserva vacia y vieja esta abandonada y se
 * retoma. Una marca con veredicto silencia para siempre, como antes.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, utimesSync, readFileSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { runFollowUpSweep, claveDeColgada } from "./followup-run.mjs";
import { crearMarcasEnDisco, MS_RESERVA_EN_VUELO } from "./marcas-en-disco.mjs";

const AHORA = "2026-09-25T22:17:00Z";

/** Una fila cruda como la que devuelve PostgREST, con lo minimo que `stateFromRow` hidrata. */
function fila({ key, nombre, tel = null, horas, inbox = 4 }) {
  const inbound = new Date(Date.parse(AHORA) - horas * 3600000).toISOString();
  return {
    conversation_key: key,
    display_name: nombre,
    public_contact: tel,
    bot_stage: "handoff_humano",
    followup_step: 1,
    human_took_over: false,
    opt_out_at: null,
    last_inbound_at: inbound,
    last_outbound_at: inbound,
    raw: { inboxId: inbox, publicContact: tel },
  };
}

function store(vencidas = []) {
  return {
    enabled: true,
    warnings: [],
    async sweepFollowUpCandidates() {
      return [];
    },
    async sweepFollowUpVencidas() {
      return vencidas.map((r) => ({ ...r }));
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
}

function canal() {
  const enviados = [];
  return {
    enviados,
    enviar: async (aviso) => {
      enviados.push(aviso);
      return { ok: true, status: "sent", reason: "" };
    },
  };
}

const dirDeMarcas = () => mkdtempSync(join(tmpdir(), "colgadas-abandonadas-"));

/** `chatwoot:46`, uno de los cinco que quedaron mudos: 575 h callado, inbox 4. */
const LEAD = fila({ key: "chatwoot:46", nombre: "dawn-glade-230", horas: 575 });

/**
 * Deja la marca como la dejo el proceso de las 19:00: reservada, VACIA y vieja.
 * @returns {string} la ruta del archivo, para poder mirarlo despues.
 */
function marcaAbandonada(dir, lead, edadMs) {
  const clave = claveDeColgada({
    conversationKey: lead.conversation_key,
    lastInboundAt: lead.last_inbound_at,
  });
  const ruta = join(dir, clave);
  writeFileSync(ruta, "");
  const cuando = new Date(Date.now() - edadMs);
  utimesSync(ruta, cuando, cuando);
  return ruta;
}

test("una reserva vacia y vieja esta ABANDONADA: el barrido siguiente reintenta el aviso", async () => {
  // El caso exacto del 2026-09-25: cinco leads reservados a las 19:00 y nunca entregados.
  const dir = dirDeMarcas();
  marcaAbandonada(dir, LEAD, MS_RESERVA_EN_VUELO * 2);
  const aviso = canal();

  const resultado = await runFollowUpSweep(
    { nowIso: AHORA, emit: true },
    { store: store([LEAD]), aviso, marcas: crearMarcasEnDisco({ dir }) },
  );

  assert.equal(
    aviso.enviados.length,
    1,
    "una marca que nadie confirmo no puede silenciar al lead para siempre",
  );
  assert.deepEqual(resultado.colgadas.avisados, ["chatwoot:46"]);
});

test("al entregarse, la marca guarda su VEREDICTO: eso es lo que silencia de ahi en mas", async () => {
  // Sin esto el arreglo se come a si mismo: la marca recien escrita seria otra reserva vacia y,
  // pasada la ventana, el mismo lead volveria a avisarse cada hora para siempre.
  const dir = dirDeMarcas();
  const aviso = canal();
  const deps = { store: store([LEAD]), aviso, marcas: crearMarcasEnDisco({ dir }) };

  await runFollowUpSweep({ nowIso: AHORA, emit: true }, deps);

  const archivos = readdirSync(dir);
  assert.equal(archivos.length, 1, "el aviso entregado deja su marca");
  assert.match(
    readFileSync(join(dir, archivos[0]), "utf8"),
    /\S/,
    "una marca entregada NO puede quedar vacia: vacia significa 'en vuelo' y se retomaria",
  );
});

test("una marca CONFIRMADA silencia para siempre, por vieja que sea", async () => {
  // La otra mitad del requisito, y la que no se puede perder: las colgadas no se vacian nunca, y
  // repetir el aviso de alguien de hace meses apaga el canal entero.
  const dir = dirDeMarcas();
  const clave = claveDeColgada({
    conversationKey: LEAD.conversation_key,
    lastInboundAt: LEAD.last_inbound_at,
  });
  const ruta = join(dir, clave);
  writeFileSync(ruta, "sent 2026-09-01T00:00:00Z\n");
  const viejisimo = new Date(Date.now() - MS_RESERVA_EN_VUELO * 1000);
  utimesSync(ruta, viejisimo, viejisimo);
  const aviso = canal();

  const resultado = await runFollowUpSweep(
    { nowIso: AHORA, emit: true },
    { store: store([LEAD]), aviso, marcas: crearMarcasEnDisco({ dir }) },
  );

  assert.equal(aviso.enviados.length, 0, "un aviso ya entregado no se repite nunca");
  assert.deepEqual(resultado.colgadas.avisados, []);
  assert.equal(resultado.colgadas.desconocidas, 1, "pero el lead sigue contandose");
});

test("una reserva vacia RECIEN puesta no se retoma: otro proceso la esta mandando ahora", async () => {
  // Si se retomara sin ventana, dos barridos solapados mandarian el mismo aviso dos veces — que
  // es el ruido que este candado existe para evitar.
  const dir = dirDeMarcas();
  marcaAbandonada(dir, LEAD, Math.floor(MS_RESERVA_EN_VUELO / 2));
  const aviso = canal();

  await runFollowUpSweep(
    { nowIso: AHORA, emit: true },
    { store: store([LEAD]), aviso, marcas: crearMarcasEnDisco({ dir }) },
  );

  assert.equal(aviso.enviados.length, 0, "una reserva en vuelo se respeta");
});
