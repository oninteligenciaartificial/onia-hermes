// ---------------------------------------------------------------------------
// El aviso a Sergio Urcullo dice si la conversacion somos NOSOTROS.
//
// QUE PASO (medido el 2026-09-18 contra produccion, `npm run avisos:vivo`):
//
//     eventos: 5 avisos (enviados 3 · salteados 2 · fallidos 0)
//     de quien: leads 0 · nuestros 4
//     VEREDICTO: ok · circuito sano, pero NINGUN aviso es de un lead
//
// O sea: los unicos avisos que Sergio Urcullo recibio en su vida por este canal —incluido
// "DEMO AGENDADA — anotala", que le pide ANOTAR algo en su calendario— fueron por sondas y
// pruebas nuestras, y ninguno lo decia. Con CERO clientes pagando, el primer aviso REAL va a
// ser indistinguible de los que ya aprendio a ignorar.
//
// POR QUE NO LO VIO NINGUN GATE. `esConversacionNuestra()` (`es-nuestra.mjs`) existe desde el
// 2026-09-18 y se cableo a los CUATRO barridos del embudo (48637b11) porque le escribian al
// PROSPECTO. El aviso le escribe a SERGIO, viaja por otro camino (motor -> `run-turn.mjs` ->
// `chatwoot-adapter.mjs` -> `webhook-server.mjs` -> `aviso-telegram.mjs`) y quedo afuera: un
// grep de `esNuestra` en esos cuatro archivos daba CERO. La cura no viaja sola al hermano.
//
// ⚠️ EL SESGO ES AL REVES QUE EN LOS BARRIDOS, Y POR ESO ESTO MARCA EN VEZ DE CALLAR.
// En un barrido, confundir a un desconocido con nosotros deja a un prospecto real sin
// seguimiento: por eso alla se saltea con motivo a la vista. Aca el error caro es el otro —
// marcar a un lead REAL como prueba haria que Sergio lo ignore, y ese lead es el negocio
// entero. Asi que el aviso SIEMPRE se manda completo, la marca es ADITIVA, y ante la duda
// (`esNuestra` ausente o falso) el aviso sale tal cual salia. Falla hacia el lado barato:
// como mucho, Sergio lee un aviso sin marcar que era una prueba.
// ---------------------------------------------------------------------------

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { MARCA_PRUEBA, construirAviso } from "./aviso-telegram.mjs";
import { esConversacionNuestra } from "./es-nuestra.mjs";
import { handleChatwootWebhook } from "./webhook-server.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));

/** La demo agendada: el aviso mas caro del negocio, y el que pide una accion. */
const NOTIFY_DEMO = [{ kind: "demo_agendada", reason: "demo_agendada", text: "Demo lunes 21, 14:00." }];

test("un aviso de una conversacion NUESTRA sale marcado como prueba", () => {
  const aviso = construirAviso({
    notify: NOTIFY_DEMO,
    conversationId: 49,
    stageAfter: "demo_agendada",
    esNuestra: true,
  });
  assert.ok(aviso, "el aviso tiene que salir igual: marcar no es callar");
  assert.match(aviso.texto, MARCA_PRUEBA, "Sergio Urcullo no puede distinguir esto de un lead real");
  // Lo que el aviso dice sigue estando entero: la marca es ADITIVA.
  assert.match(aviso.texto, /DEMO AGENDADA/);
  assert.match(aviso.texto, /Demo lunes 21, 14:00\./);
  assert.match(aviso.texto, /conversacion 49/);
});

test("un aviso de un DESCONOCIDO sale sin marca, identico a como salia", () => {
  const args = { notify: NOTIFY_DEMO, conversationId: 58, stageAfter: "demo_agendada" };
  const lead = construirAviso({ ...args, esNuestra: false });
  assert.doesNotMatch(lead.texto, MARCA_PRUEBA, "marcar a un lead real como prueba lo hace ignorable");
  // Ante la DUDA (el campo ni viene) tambien se trata como lead: es el lado barato.
  assert.equal(construirAviso(args).texto, lead.texto);
});

test("el webhook le PASA al aviso si la conversacion es nuestra", async () => {
  // La costura que ningun caso miraba: `avisos-vivo.mjs` llama a `construirAviso` con los datos
  // a mano, asi que probaba el redactor y nunca al llamador real.
  const payload = {
    event: "message_created",
    message_type: "incoming",
    id: 9001,
    content: "A",
    conversation: { id: 49, status: "open", messages: [] },
    inbox: { id: 4 },
    account: { id: 1 },
  };

  const correr = (esNuestra) =>
    handleChatwootWebhook(
      { rawBody: JSON.stringify(payload), headers: {}, method: "POST", url: "/webhook/chatwoot" },
      {
        // `allowUnsigned` es la puerta que el propio `webhook-security.mjs` deja para esto: sin
        // ella el pipeline corta en 503 ANTES de llegar al aviso, y el caso pasaria a medir la
        // autenticacion en vez de la costura que le importa.
        config: { webhookSecret: "", pathSecret: "", allowUnsigned: true, maxBodyBytes: 1e6 },
        shouldProcessMessage: () => true,
        runChatwootTurn: async () => ({
          ok: true,
          conversationId: 49,
          stageAfter: "demo_agendada",
          notify: NOTIFY_DEMO,
          esNuestra,
        }),
      },
    );

  const nuestra = await correr(true);
  assert.ok(nuestra.avisoTelegram, "el webhook dejo de armar el aviso");
  assert.match(nuestra.avisoTelegram.texto, MARCA_PRUEBA, "el webhook no le pasa `esNuestra` al aviso");

  const lead = await correr(false);
  assert.doesNotMatch(lead.avisoTelegram.texto, MARCA_PRUEBA);
});

test("la cadena que trae el dato no se corta en el medio", () => {
  // El booleano nace donde vive el estado completo (`run-turn.mjs`, que es el unico que tiene
  // `displayName` y `publicContact`) y tiene que atravesar al adapter para llegar al webhook.
  // Se publica el BOOLEANO y no el telefono a proposito: `n8n-event.mjs` se arma de este mismo
  // resultado y manda analitica FUERA del sistema.
  const leer = (archivo) => readFileSync(join(AQUI, archivo), "utf8");

  const motor = leer("run-turn.mjs");
  assert.match(motor, /esConversacionNuestra/, "run-turn.mjs ya no calcula si la conversacion es nuestra");
  assert.match(motor, /esNuestra:\s*esConversacionNuestra\(/, "el booleano no sale en el resultado del turno");

  const adapter = leer("chatwoot-adapter.mjs");
  assert.match(adapter, /esNuestra:/, "chatwoot-adapter.mjs se come el dato y el webhook nunca lo ve");

  // Y el telefono NO viaja en el resultado: lo que se publica es el veredicto.
  assert.doesNotMatch(motor, /publicContact:\s*state\.publicContact/, "el telefono del prospecto no sale del motor");
});

test("TODO el que arma un aviso dice de quien es — universo derivado del disco", () => {
  // Se camina la CARPETA y no `git ls-files`: el archivo nuevo sin commitear es justo el sujeto
  // que esto existe para cazar. Se saltea la convencion de siembra `__loquesea__`.
  const archivos = readdirSync(AQUI, { withFileTypes: true })
    .filter((e) => e.isFile() && e.name.endsWith(".mjs") && !e.name.includes(".test."))
    .map((e) => e.name);

  // El universo son los que arman un aviso Y LO MANDAN. Esa segunda mitad no es un carve-out a
  // mano: deja afuera al redactor (`aviso-telegram.mjs`, que no se manda a si mismo) y al
  // medidor (`avisos-vivo.mjs`, que arma un aviso sintetico para ver si el circuito redacta y
  // nunca lo entrega). Un archivo que empiece a enviar entra al universo solo.
  const llamadores = archivos.filter((nombre) => {
    const fuente = readFileSync(join(AQUI, nombre), "utf8");
    if (!/construirAviso\s*\(/.test(fuente)) return false;
    return /(enviarAvisoTelegram|dispararAvisoTelegram)\s*\(/.test(fuente);
  });

  // Caso ancla: los sujetos que YA conocemos tienen que estar en el universo, o el detector
  // se apago solo y este gate quedaria verde sin mirar nada.
  for (const conocido of ["webhook-server.mjs", "postdemo-run.mjs"]) {
    assert.ok(llamadores.includes(conocido), `${conocido} salio del universo: el detector no lo ve`);
  }

  for (const nombre of llamadores) {
    const fuente = readFileSync(join(AQUI, nombre), "utf8");
    // Hay DOS formas de cumplir el invariante, y las dos valen:
    //  (a) la llamada le pasa `esNuestra` al aviso — el camino del webhook, que avisa de TODO; o
    //  (b) el archivo DESCARTA antes la conversacion nuestra, asi que no llega a avisar nunca
    //      — el camino de `postdemo-run.mjs`, cuyo `skipReason` ya devuelve `MOTIVO_NUESTRA`.
    // La excusa (b) no es una lista a mano: se re-mide contra el archivo en cada corrida, y el
    // dia que alguien saque ese descarte, este gate se pone rojo solo.
    const llamada = fuente.slice(fuente.indexOf("construirAviso(")).slice(0, 400);
    const pasaElDato = /esNuestra/.test(llamada);
    const descartaAntes = /esConversacionNuestra\s*\(/.test(fuente);
    assert.ok(
      pasaElDato || descartaAntes,
      `${nombre} arma un aviso sin decir si la conversacion es nuestra, y tampoco descarta las nuestras`,
    );
  }
});

test("el criterio es el MISMO que usan los barridos, no una copia", () => {
  // Si aca se reimplementara "es de prueba", el aviso y el barrido podrian discrepar sobre la
  // misma conversacion. Se afirma contra la funcion importada, no contra una lista propia.
  assert.equal(esConversacionNuestra({ displayName: "Sonda QA carril chatbot" }), true);
  assert.equal(esConversacionNuestra({ publicContact: "+591 716-54992" }), true);
  assert.equal(esConversacionNuestra({ displayName: "delicate-glitter-674" }), false);
});
