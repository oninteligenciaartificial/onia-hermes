/**
 * UN LEAD QUE SE ENFRIA TIENE QUE LLEGARLE A SERGIO URCULLO — y una sola vez.
 *
 * EL CASO, con nombre y fecha (medido el 2026-09-24 en el log del bot vivo, no heredado):
 * `conv 58`, inbox 5 (WhatsApp, leads reales), `+59175755019`. El 2026-09-17 22:50 UTC escribio
 * "Hola, vengo de la web de Onia. Quiero saber si me sirve para mi negocio.". El bot contesto
 * bien, el barrido le insistio al dia siguiente con los dos horarios, y la persona no volvio.
 * NUNCA hubo una linea `[aviso]` para `conv=58`: el aviso a Sergio Urcullo cuelga de
 * `notify_sergio`, que el motor emite al derivar a un humano o al agendar — y "se quedo callado"
 * no es ninguno de los dos. Un prospecto de WhatsApp llegado desde la web quedo tibio seis dias
 * y el unico que podia rescatarlo no supo que existia.
 *
 * POR QUE "UNA SOLA VEZ" ES LA MITAD DEL REQUISITO, no un adorno: las colgadas no se vacian
 * nunca (una conversacion por encima del piso de rescate se queda ahi para siempre), asi que un
 * aviso por corrida seria el mismo lead repetido todos los dias hasta que Sergio Urcullo aprenda
 * a no leer estos avisos. Ese es el modo de falla que se lleva puesto tambien al aviso que SI
 * importaba.
 *
 * POR QUE UN ARCHIVO Y NO UNA COLUMNA. Los cuatro candidatos de la cola tienen costo medido:
 * quemar `followup_step` apaga el otro circuito (`insistencia-run.mjs:220` documenta ese bug
 * exacto); mover `bot_stage` a `descartado` le pone al lead un desenlace comercial que el bot no
 * conoce; `insertOutbound` con `messageKey` le COBRA al cliente un mensaje que nunca existio
 * (`ESTADOS_COBRABLES`); y la columna nueva pide una migracion en `onia_center` que este carril
 * no puede desplegar. El quinto camino ya estaba construido y probado en este mismo repo —
 * `crearMarcasEnDisco`, el candado del barrido de rescate— y no tiene ninguno de los cuatro
 * costos. Se extrajo a `marcas-en-disco.mjs` en vez de copiarse.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { runFollowUpSweep, claveDeColgada } from "./followup-run.mjs";
import { crearMarcasEnDisco } from "./marcas-en-disco.mjs";

const AHORA = "2026-09-24T14:00:00Z";

/** Una fila cruda como la que devuelve PostgREST, con lo minimo que `stateFromRow` hidrata. */
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
    // El telefono y el inbox viajan en `raw`, no en columna propia: asi los hidrata
    // `stateFromRow`. Ponerlos en `public_contact`/`inbox_id` daria un fixture que prueba un
    // campo que en produccion nunca llega.
    raw: { inboxId: inbox, publicContact: tel },
  };
}

/** Store de mentira: nada elegible para escribir, y las colgadas que pida el caso. */
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

/** Canal de aviso de mentira: guarda lo que se mando, o falla si se lo pide. */
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

const dirDeMarcas = () => mkdtempSync(join(tmpdir(), "colgadas-"));

const LEAD = fila({ key: "chatwoot:58", nombre: "+59175755019", tel: "+59175755019", dias: 7 });

test("el lead que se enfria le llega a Sergio Urcullo: contacto, etapa y cuanto lleva callado", async () => {
  const aviso = canal();
  const resultado = await runFollowUpSweep(
    { nowIso: AHORA, emit: true },
    { store: store([LEAD]), aviso, marcas: crearMarcasEnDisco({ dir: dirDeMarcas() }) },
  );

  assert.equal(aviso.enviados.length, 1, "un desconocido colgado tiene que producir un aviso");
  const texto = aviso.enviados[0].texto;
  // Los tres datos con los que se puede ACTUAR sin abrir la base. "Lo ultimo que dijo" no esta a
  // proposito: el entrante no se persiste (`INBOUND_BODY_PLACEHOLDER`), y un aviso que lo
  // inventara seria peor que uno que no lo trae.
  assert.match(texto, /chatwoot:58/, "sin la conversacion no se sabe a quien contestarle");
  assert.match(texto, /\+59175755019/, "el contacto es POR DONDE se abre la conversacion");
  assert.match(texto, /esperando_horario/, "la etapa dice en que quedo la charla");
  assert.match(texto, /7 d/i, "cuanto lleva callado es lo que ordena a cual rescatar primero");
  assert.deepEqual(resultado.colgadas.avisados, ["chatwoot:58"]);
});

test("UNA sola vez: la segunda corrida sobre el mismo lead no vuelve a avisar", async () => {
  // El modo de falla que se lleva puesto al canal entero. Las colgadas no se vacian nunca.
  const aviso = canal();
  const marcas = crearMarcasEnDisco({ dir: dirDeMarcas() });
  const deps = { store: store([LEAD]), aviso, marcas };

  await runFollowUpSweep({ nowIso: AHORA, emit: true }, deps);
  const segunda = await runFollowUpSweep({ nowIso: AHORA, emit: true }, deps);

  assert.equal(aviso.enviados.length, 1, "el segundo barrido no puede repetir el mismo aviso");
  assert.deepEqual(segunda.colgadas.avisados, [], "y lo dice: no avisó a nadie nuevo");
  // La colgada SIGUE contandose: recordar el aviso no puede borrar al lead de la cuenta.
  assert.equal(segunda.colgadas.desconocidas, 1);
});

test("si el aviso NO salio, la marca se suelta: el lead se reintenta en la corrida siguiente", async () => {
  // La marca existe para no repetir un aviso ENTREGADO. Si Telegram se cayo, ese lead no se
  // anuncio nunca — y una marca puesta ahi se tragaria al unico aviso que importaba.
  const dir = dirDeMarcas();
  const caido = canal({ falla: true });
  const primera = await runFollowUpSweep(
    { nowIso: AHORA, emit: true },
    { store: store([LEAD]), aviso: caido, marcas: crearMarcasEnDisco({ dir }) },
  );
  assert.equal(readdirSync(dir).length, 0, "una marca sin aviso entregado es un lead silenciado");
  assert.ok(
    primera.warnings.some((w) => /chatwoot:58/.test(w) && /avis/i.test(w)),
    "un aviso que no salio se grita: perder un lead EN SILENCIO es el bug original",
  );

  const sano = canal();
  await runFollowUpSweep(
    { nowIso: AHORA, emit: true },
    { store: store([LEAD]), aviso: sano, marcas: crearMarcasEnDisco({ dir }) },
  );
  assert.equal(sano.enviados.length, 1, "el barrido siguiente tiene que reintentarlo");
});

test("lo NUESTRO no se avisa: el criterio es el mismo que ya usa el barrido para no escribirse solo", async () => {
  // Con cero clientes pagando, casi todo lo que hay en la base lo sembramos nosotros. Un aviso
  // por cada sonda de QA entrena a no leer los avisos igual que uno repetido.
  const aviso = canal();
  const resultado = await runFollowUpSweep(
    { nowIso: AHORA, emit: true },
    {
      store: store([fila({ key: "chatwoot:50", nombre: "Sonda QA carril chatbot", dias: 15 })]),
      aviso,
      marcas: crearMarcasEnDisco({ dir: dirDeMarcas() }),
    },
  );

  assert.equal(aviso.enviados.length, 0, "una prueba nuestra no es un lead perdido");
  assert.equal(resultado.colgadas.nuestras, 1, "pero se sigue contando aparte");
});

test("dry-run no avisa ni recuerda: mirar no puede gastar el unico aviso del lead", async () => {
  const dir = dirDeMarcas();
  const aviso = canal();
  await runFollowUpSweep(
    { nowIso: AHORA, emit: false },
    { store: store([LEAD]), aviso, marcas: crearMarcasEnDisco({ dir }) },
  );

  assert.equal(aviso.enviados.length, 0, "el dry-run no manda nada");
  assert.equal(
    readdirSync(dir).length,
    0,
    "y sobre todo no deja la marca: un `--dry-run` que quema el recuerdo silencia el aviso de verdad",
  );
});

test("si el lead vuelve a escribir y se enfria otra vez, es un lead nuevo y se avisa de nuevo", async () => {
  // La clave lleva `last_inbound_at` justamente por esto: "ya avise" vale para ESTE silencio, no
  // para la persona. Una clave por conversacion sola dejaria mudo al que vuelve y se va.
  const primera = claveDeColgada({ conversationKey: "chatwoot:58", lastInboundAt: "2026-09-17T22:50:00Z" });
  const segunda = claveDeColgada({ conversationKey: "chatwoot:58", lastInboundAt: "2026-09-30T10:00:00Z" });
  assert.ok(primera && segunda);
  assert.notEqual(primera, segunda);
});

test("una clave que no se puede formar es `null`, no una clave parcial", async () => {
  // Una clave inventada colisiona con la de otro lead y lo silencia. Es mas seguro no tener
  // marca —y avisar de mas— que tener la marca equivocada.
  assert.equal(claveDeColgada({ conversationKey: "chatwoot:58", lastInboundAt: null }), null);
  assert.equal(claveDeColgada({ conversationKey: null, lastInboundAt: AHORA }), null);
  assert.equal(
    claveDeColgada({ conversationKey: "../../etc/passwd", lastInboundAt: AHORA }),
    null,
    "la clave es el NOMBRE de un archivo: una barra la saca del directorio de marcas",
  );
});

test("hermetismo: un caso con `emit` que no inyecte las marcas no puede escribir en produccion", () => {
  // Medido el 2026-09-11 en el barrido hermano: un test sin inyectar dejo la marca REAL del lead
  // del 10-sep en `/var/lib/onia-rescate-avisado/`, y con esa marca puesta el aviso de ese lead
  // deja de salir. El instrumento que existe para no perder un lead lo silencia su propio test.
  assert.throws(
    () => crearMarcasEnDisco({ porDefecto: "/var/lib/onia-colgada-avisado", guarda: () => {
      const e = new Error("hermetismo: llegue a las marcas REALES");
      e.hermetismo = true;
      throw e;
    } }),
    /hermetismo/i,
  );
});
