/**
 * EL ESTRENO DEL AVISO DE LEADS FRIOS NO PUEDE SER UNA RAFAGA DE 22 TELEGRAM.
 *
 * EL CASO: produccion todavia no tiene el aviso de "se enfrio", asi que la PRIMERA corrida
 * despues del swap descubre de golpe a todos los que ya estaban colgados y —con un aviso por
 * lead— le manda a Sergio Urcullo esa pila de mensajes seguidos.
 *
 * ⚠️ EL FIXTURE DE 22 ES UNA CARGA SINTETICA, NO EL HEADCOUNT DE PRODUCCION — aclarado el
 * 2026-09-25. Este encabezado decia "hay 22 conversaciones colgadas de desconocidos, medido el
 * 2026-09-24", y ese numero contaba nuestras propias sondas: se tomo antes de que `es-nuestra.mjs`
 * aprendiera a reconocer el inbox 7 (el banco de pruebas). Re-derivado corriendo este barrido
 * contra `onia_center.bot_conversations` el 2026-09-25 10:20 UTC: 23 colgadas, de las cuales
 * **7 desconocidas y 16 nuestras**. Las 22 se dejan igual porque prueban el BULTO y el orden con
 * holgura (5 + 5 + ... hasta drenar), que es lo que este archivo cuida; el reparto real lo fija
 * el ultimo test de abajo, que es el que faltaba.
 *
 * POR QUE ESO ES UN DEFECTO Y NO UN VOLUMEN: su canal de Telegram ya le llega saturado, y el
 * arreglo del 2026-09-24 a los avisos del parte diario nace de ese mismo problema. Su preferencia
 * esta dicha textualmente y con fecha (2026-09-03): "cuando me mandes una tabla por telegram,
 * maximo 5 filas, si hay mas me pierdo". 22 de una es exactamente como se apaga un canal — y el
 * que se apaga se lleva puesto tambien al aviso que SI importaba (la demo agendada).
 *
 * POR QUE UN TOPE A SECAS SERIA PEOR QUE EL RUIDO, que es la mitad dificil: las marcas de colgada
 * NO se purgan a proposito (el silencio de un lead no vence). Un tope que descarte a los que no
 * entraron —o peor, que los MARQUE como avisados sin nombrarlos— los silencia PARA SIEMPRE. Por
 * eso acá el tope no descarta: pospone. Sólo se marca a quien viajó en el mensaje; el resto vuelve
 * al conteo y sale en el barrido siguiente, de a 5, hasta que la cola drena.
 *
 * Y POR QUE LOS MAS VIEJOS PRIMERO: es lo unico que garantiza que la cola drene. Ordenar por el
 * mas reciente deja a los mas viejos esperando detras de cada lead nuevo que se enfria.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { runFollowUpSweep, TOPE_COLGADAS_POR_AVISO } from "./followup-run.mjs";
import { crearMarcasEnDisco } from "./marcas-en-disco.mjs";

const AHORA = "2026-09-24T14:00:00Z";

function fila({ key, nombre, tel = null, dias, inbox = 5 }) {
  const inbound = new Date(Date.parse(AHORA) - dias * 86400000).toISOString();
  return {
    conversation_key: key,
    display_name: nombre,
    public_contact: tel,
    bot_stage: "esperando_horario",
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

function canal({ falla = false } = {}) {
  const enviados = [];
  return {
    enviados,
    enviar: async (aviso) => {
      if (falla) throw new Error("telegram caido");
      enviados.push(aviso);
      return { ok: true, status: "sent", reason: "" };
    },
  };
}

const dirDeMarcas = () => mkdtempSync(join(tmpdir(), "colgadas-lote-"));

/** Carga sintetica de 22, escalonada de 7 a 28 dias: todas de desconocidos (ver el ⚠️ de arriba). */
const VEINTIDOS = Array.from({ length: 22 }, (_, i) =>
  fila({
    key: `chatwoot:${100 + i}`,
    nombre: `+5917500${String(i).padStart(4, "0")}`,
    tel: `+5917500${String(i).padStart(4, "0")}`,
    dias: 7 + i, // el ultimo es el mas viejo
  }),
);

test("22 leads frios son UN mensaje, no 22: el canal saturado es el modo de falla", async () => {
  const aviso = canal();
  const resultado = await runFollowUpSweep(
    { nowIso: AHORA, emit: true },
    { store: store(VEINTIDOS), aviso, marcas: crearMarcasEnDisco({ dir: dirDeMarcas() }) },
  );

  assert.equal(
    aviso.enviados.length,
    1,
    "22 Telegram seguidos apagan el canal y se llevan puesto al aviso de la demo agendada",
  );
  assert.equal(resultado.colgadas.desconocidas, 22, "el conteo sigue viendo a los 22");
});

test("el mensaje trae 5 filas —su numero, dicho con fecha— y NO esconde que hay mas", async () => {
  const aviso = canal();
  await runFollowUpSweep(
    { nowIso: AHORA, emit: true },
    { store: store(VEINTIDOS), aviso, marcas: crearMarcasEnDisco({ dir: dirDeMarcas() }) },
  );

  const texto = aviso.enviados[0].texto;
  assert.equal(TOPE_COLGADAS_POR_AVISO, 5, '"maximo 5 filas, si hay mas me pierdo" (2026-09-03)');

  // Los cinco MAS VIEJOS (24 a 28 dias), que es el orden que hace drenar la cola.
  for (const dias of [28, 27, 26, 25, 24]) {
    assert.match(texto, new RegExp(`${dias} d`), `falta el lead de ${dias} dias`);
  }
  assert.doesNotMatch(texto, /chatwoot:100\b/, "el de 7 dias no entra en esta corrida");

  // Un mensaje que muestra 5 sin decir que hay 22 miente por omision: se lee como "hay 5 leads".
  assert.match(texto, /22/, "el total tiene que estar: es el dato que dice cuanto hay en juego");
});

test("los que no entraron NO quedan marcados: el tope pospone, nunca descarta", async () => {
  // La mitad dificil. Las marcas de colgada no se purgan (el silencio del lead no vence), asi que
  // marcar a quien nunca se nombro lo silencia PARA SIEMPRE.
  const aviso = canal();
  const marcas = crearMarcasEnDisco({ dir: dirDeMarcas() });
  const deps = { store: store(VEINTIDOS), aviso, marcas };

  const primera = await runFollowUpSweep({ nowIso: AHORA, emit: true }, deps);
  const segunda = await runFollowUpSweep({ nowIso: AHORA, emit: true }, deps);

  assert.equal(primera.colgadas.avisados.length, 5, "solo se marca a quien viajo en el mensaje");
  assert.equal(segunda.colgadas.avisados.length, 5, "los que faltaban salen en la corrida siguiente");
  assert.equal(
    new Set([...primera.colgadas.avisados, ...segunda.colgadas.avisados]).size,
    10,
    "y son otros cinco: ninguno se repite y ninguno se pierde",
  );
  // El segundo mensaje arranca donde quedo el primero: 23, 22, 21, 20, 19 dias.
  assert.match(aviso.enviados[1].texto, /23 d/);
  assert.doesNotMatch(aviso.enviados[1].texto, /28 d/, "el de 28 ya se nombro y no se repite");
});

test("si el mensaje NO salio, no queda marcado NINGUNO de los cinco", async () => {
  // Un solo envio para cinco leads: si se cae, se sueltan los cinco o se pierden los cinco.
  const marcas = crearMarcasEnDisco({ dir: dirDeMarcas() });
  const caido = canal({ falla: true });
  await runFollowUpSweep({ nowIso: AHORA, emit: true }, { store: store(VEINTIDOS), aviso: caido, marcas });

  const sano = canal();
  const reintento = await runFollowUpSweep(
    { nowIso: AHORA, emit: true },
    { store: store(VEINTIDOS), aviso: sano, marcas },
  );

  assert.equal(sano.enviados.length, 1, "el barrido siguiente reintenta");
  assert.match(sano.enviados[0].texto, /28 d/, "y arranca por el mas viejo, que nunca se anuncio");
  assert.equal(reintento.colgadas.avisados.length, 5);
});

test("con pocos leads el aviso no habla de una cola que no existe", async () => {
  const aviso = canal();
  await runFollowUpSweep(
    { nowIso: AHORA, emit: true },
    { store: store(VEINTIDOS.slice(0, 2)), aviso, marcas: crearMarcasEnDisco({ dir: dirDeMarcas() }) },
  );

  const texto = aviso.enviados[0].texto;
  assert.match(texto, /8 d/, "los dos van en el mensaje");
  assert.match(texto, /7 d/);
  assert.doesNotMatch(texto, /pr[oó]ximos barridos/i, "no hay nadie esperando: decirlo confunde");
});

/**
 * EL NUMERO QUE EL AVISO LE DICE A SERGIO URCULLO NO PUEDE CONTAR NUESTRAS PROPIAS PRUEBAS.
 *
 * DE DONDE SALE, y es la razon por la que este caso faltaba: los fixtures de arriba son TODOS
 * desconocidos, asi que `total` y `desconocidas` valen lo mismo en cada uno de ellos y ninguno
 * puede distinguir un `total` bien cableado de uno mal cableado. Produccion no se parece a eso.
 *
 * MEDIDO el 2026-09-25 10:20 UTC corriendo este mismo barrido (codigo de `origin/main`) contra
 * `onia_center.bot_conversations`: 23 colgadas, y de esas **7 desconocidas y 16 NUESTRAS** — el
 * banco de pruebas del inbox 7, los contactos sembrados con "Prueba"/"QA" en el nombre, y el
 * telefono de Sergio Urcullo. Con `total` en vez de `desconocidas`, el estreno del aviso le diria
 * "23 leads frios" cuando hay 7: un 3x sobre el unico numero con el que decide a quien contactar.
 *
 * Y NO ES SIMETRICO. Inflar el numero manda a perseguir leads que no existen; pero el mismo
 * cableado al reves esconderia desconocidos entre nuestras pruebas, que es el fallo que este
 * carril existe para evitar. Por eso se fija el reparto (7 / 16) y ademas que NINGUNA fila
 * nuestra aparezca nombrada en el texto.
 */
const MEZCLA_COMO_PRODUCCION = [
  // Los 7 reales: nombre anonimo de Chatwoot o sin nombre, en los inboxes que atienden (4 y 5).
  ...Array.from({ length: 7 }, (_, i) =>
    fila({ key: `chatwoot:${200 + i}`, nombre: `white-pine-${699 + i}`, dias: 8 + i, inbox: 4 }),
  ),
  // Nuestras por NOMBRE (asi se reconocen 6 filas de produccion hoy).
  ...Array.from({ length: 6 }, (_, i) =>
    fila({ key: `chatwoot:${300 + i}`, nombre: `Sonda QA carril chatbot ${i}`, dias: 30 + i, inbox: 4 }),
  ),
  // Nuestras por TENENCIA del inbox: el banco de pruebas le pone nombre anonimo al contacto, o
  // sea que por nombre son indistinguibles de un desconocido. Son las 10 que faltaban contar.
  ...Array.from({ length: 10 }, (_, i) =>
    fila({ key: `chatwoot:${400 + i}`, nombre: `billowing-tree-${407 + i}`, dias: 40 + i, inbox: 7 }),
  ),
];

/** El inbox 7 se llama `ZZ QA Clinica Chatbot`: la tenencia se DERIVA de ese nombre, no se tipea. */
const inboxesDeChatwoot = () => [
  { id: 4, name: "Onia Web" },
  { id: 5, name: "WhatsApp" },
  { id: 7, name: "ZZ QA Clinica Chatbot" },
];

test("el total del aviso cuenta los 7 desconocidos, NO las 23 colgadas", async () => {
  const aviso = canal();
  const resultado = await runFollowUpSweep(
    { nowIso: AHORA, emit: true },
    {
      store: store(MEZCLA_COMO_PRODUCCION),
      aviso,
      marcas: crearMarcasEnDisco({ dir: dirDeMarcas() }),
      listarInboxes: inboxesDeChatwoot,
    },
  );

  assert.equal(resultado.colgadas.total, 23, "el conteo crudo sigue viendo las 23 filas");
  assert.equal(resultado.colgadas.desconocidas, 7, "pero solo 7 son de alguien que no somos");
  assert.equal(resultado.colgadas.nuestras, 16, "y 16 son nuestras (nombre de prueba o inbox QA)");

  const texto = aviso.enviados[0].texto;
  assert.match(texto, /\b7\b/, "el total que viaja es el de desconocidos");
  assert.doesNotMatch(texto, /\b23\b/, "23 es nuestras pruebas incluidas: infla 3x lo que hay en juego");

  // La otra mitad: ninguna fila nuestra puede aparecer NOMBRADA como lead frio.
  assert.doesNotMatch(texto, /Sonda QA|billowing-tree/, "una prueba nuestra nombrada como lead es ruido");
  for (const clave of ["chatwoot:300", "chatwoot:400"]) {
    assert.doesNotMatch(texto, new RegExp(clave), `${clave} es nuestra y no se nombra`);
  }
});
