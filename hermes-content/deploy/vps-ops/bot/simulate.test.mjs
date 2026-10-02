// ONIA — el SIMULADOR tiene que contestar lo mismo que el bot vivo.
//
// POR QUE EXISTE ESTE ARCHIVO. `simulate.mjs` es el instrumento con el que el carril chatbot mide
// su objetivo cada vuelta ("3/3 preguntas bien en el simulador"). Hasta el 2026-09-04 armaba la
// config con `DEFAULT_CONFIG` pelado, o sea SIN el documento publicado que produccion si carga
// para los inboxes de venta (4 web y 5 WhatsApp). Resultado medido ese dia: a "¿cuánto cuesta el
// sistema?" el simulador contestaba «el número exacto te lo pasa Sergio en la demo» mientras el
// bot vivo, en la MISMA hora, contestaba «Bs 320 el Básico, Bs 750 el Profesional, Bs 1.500 el
// Completo, chatbot Bs 390» (conversacion 49 de Chatwoot, mensaje 418).
//
// Un instrumento que da ROJO sobre algo que en produccion esta VERDE no es conservador: manda a
// la vuelta siguiente a reabrir un bug cerrado, que es exactamente el gasto que este loop existe
// para no repetir. La regla que fija este test: el simulador corre con el MISMO documento que se
// despliega, y si no lo puede cargar lo DICE en vez de mostrar un guion que nadie sirve.

import assert from "node:assert/strict";
import test from "node:test";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import { DEFAULT_CONFIG } from "./config.mjs";
import { createState, step } from "./bot-engine.mjs";
import { MONTOS_PERMITIDOS } from "./precios-publicos.mjs";
import { buildConfig, cargarConocimientoPublicado, configParaGuion, resolverLlaveVps, CONOCIMIENTO_PUBLICADO, WEBHOOK_ENV_DESPLEGADO } from "./simulate.mjs";

const RECIBIDO = "2026-09-04T18:00:00.000Z";

function preguntar(config, texto) {
  const state = createState({ channel: "sim", contactRef: "test-simulador" });
  const { replies } = step(
    state,
    { kind: "text", text: texto, receivedAt: RECIBIDO, externalMessageId: "t-1" },
    { config },
  );
  return replies.map((reply) => String(reply.text || "")).join("\n");
}

// Los casos que NO miden la resolucion de horarios corren SIN AMBIENTE: ni `ONIA_BOT_SLOTS` en el
// entorno ni el `webhook.env` desplegado. Sin fijar los dos, el resultado depende de si la maquina
// que corre el test es el VPS —que SI tiene dos horarios cargados— o cualquier otra. Ya habia
// pasado un escalon mas arriba con `env: {}`; al cablear el archivo volvio a aparecer igual, asi
// que el ambiente se fija en UN lugar y los casos nuevos lo heredan en vez de tener que acordarse.
const SIN_AMBIENTE = { env: {}, envFile: "/no/existe/webhook.env" };

test("el simulador arranca con el documento publicado, el mismo que corre en produccion", () => {
  const { data, aviso } = cargarConocimientoPublicado();
  assert.equal(aviso, null, `el documento publicado no carga: ${aviso}`);
  assert.ok(data, "sin documento el simulador mide un guion que ningun inbox sirve");
  assert.equal(data.schema, "onia.bot.knowledge/1");
});

test("a la pregunta de precio contesta con los montos PUBLICOS, no con 'te lo pasa un humano'", () => {
  const texto = preguntar(buildConfig({}, SIN_AMBIENTE), "¿cuánto cuesta el sistema?");

  // Los dos que un lead pregunta primero: el plan de entrada y el add-on del chatbot.
  assert.match(texto, /\b320\b/, "falta el plan Básico (subscription-plans.ts)");
  assert.match(texto, /\b390\b/, "falta el chatbot de WhatsApp (pricing.ts)");
  assert.doesNotMatch(
    texto,
    /el número exacto te lo pasa/,
    "sigue sirviendo el guion sin precio: el simulador no cargo el documento publicado",
  );

  // Ninguna cifra de plata puede ser una que el bot no tenga permitido decir.
  for (const [, monto] of texto.matchAll(/\bBs\s*\.?\s*(\d[\d.,]*)/gi)) {
    const valor = Number(String(monto).replace(/\./g, "").replace(",", "."));
    assert.ok(MONTOS_PERMITIDOS.has(valor), `el simulador dice Bs ${monto}, que no esta en precios-publicos.mjs`);
  }
});

test("sin el documento (o roto) NO inventa: se queda con el codigo y AVISA", () => {
  const avisos = [];
  const config = buildConfig({}, { ...SIN_AMBIENTE, path: "/no/existe/knowledge.onia.json", warn: (linea) => avisos.push(linea) });

  // Sin documento degrada al guion del CODIGO, sin mezclar. Lo unico que se le suma es la agenda:
  // sin poder leer la config desplegada, el simulador corre como produccion por default — sin agenda
  // propia (2-oct) — y lo avisa (ver el caso "sin horarios por ningun lado").
  const { agenda, ...delCodigo } = config;
  assert.deepEqual(delCodigo, { ...DEFAULT_CONFIG }, "sin documento valido tiene que degradar al guion del codigo, sin mezclar");
  assert.equal(agenda?.modo, "persona");
  const delDocumento = avisos.filter((linea) => /conocimiento/i.test(linea));
  assert.equal(delDocumento.length, 1, "un instrumento que no puede medir lo dice; callarselo es el modo de falla caro");
});

test("--sin-conocimiento sirve el guion pelado del codigo, para poder comparar los dos", () => {
  const { agenda, ...pelado } = buildConfig({ sinConocimiento: true }, { ...SIN_AMBIENTE, warn: () => {} });
  assert.deepEqual(pelado, { ...DEFAULT_CONFIG }, "el guion pelado del codigo (con la agenda por default de produccion)");
  assert.equal(agenda?.modo, "persona");
  assert.notEqual(buildConfig({}, SIN_AMBIENTE), DEFAULT_CONFIG, "sin la bandera manda el documento publicado");
});

test("el documento publicado es el que se despliega, no una copia de adorno", () => {
  assert.match(CONOCIMIENTO_PUBLICADO, /knowledge\.onia\.json$/);
});

test("el bot de un CLIENTE no hereda el conocimiento de Onia: contestaria NUESTROS precios", () => {
  // En produccion el bot de una org se arma con el codigo + la fila publicada DE ESA org. Si el
  // simulador lo armara encima del documento de Onia, la ferreteria tendria cargado "Bs 320 al
  // mes … onia.com.bo/precios" para contestarle a un cliente suyo que pregunta por un rollo de cable.
  //
  // ⚠️ Esto mira el ESTADO (la plantilla cargada), no el mensaje: la primera version de este test
  // mandaba "¿cuánto cuesta?" y pasaba en falso, porque en modo recepcionista esa pregunta no
  // llega a M4_BODY — la fuga estaba igual, cargada y esperando otra rama.
  const cliente = configParaGuion("recepcionista-ferreteria", buildConfig({}, SIN_AMBIENTE), buildConfig({ sinConocimiento: true }, SIN_AMBIENTE));

  assert.doesNotMatch(
    cliente.script.M4_BODY,
    /\b320\b|onia\.com\.bo/i,
    "se filtro el conocimiento de Onia al bot de un cliente",
  );
  assert.equal(cliente.identity.productName, "Ferretería El Tornillo");
});

// ---------------------------------------------------------------------------
// LOS HORARIOS — la otra mitad de "el simulador corre con el artefacto de produccion"
//
// La cabecera de este archivo ya fija esa regla para el DOCUMENTO publicado. Los horarios
// quedaron afuera, y fallan en las DOS direcciones (medido el 2026-09-04):
//
//  1. FALSO ROJO. `--slots` con el formato REAL — el de ONIA_BOT_SLOTS, "etiqueta@ISO" — usaba la
//     cadena entera como etiqueta visible, asi que el guion mostraba «sábado 5 de septiembre,
//     09:00@2026-09-05T13:00:00Z». Copiando los slots de produccion para reproducir su guion,
//     el simulador pinta la tripa interna en la cara del cliente y parece el bug mas famoso del
//     proyecto (el login con los nombres de los iconos). Produccion estaba SANA: el mensaje 448
//     de la conversacion 49 dice «**A)** viernes 4 de septiembre, 14:00», sin timestamp.
//
//  2. FALSO VERDE, y es el peor. Sin `--slots` el simulador cae SIEMPRE en la rama
//     `M0_SIN_HORARIOS`, y produccion tiene ONIA_BOT_SLOTS cargado (lo repone un cron diario).
//     O sea que el "3/3 en el simulador" que este carril reporta cada vuelta certificaba un
//     guion que ningun prospecto ve. Es la trampa de las variantes HERMANAS otra vez.
//
// El parser correcto ya existia y estaba exportado (`parseSlotsSpec`, followup-run.mjs:83):
// simulate.mjs era el unico que lo reimplementaba, y lo reimplementaba mal.

// Los horarios de estos casos se copiaron CONGELADOS de produccion el 2026-09-04 y
// al dia siguiente ya no eran ofrecibles: `parseSlotsSpec` marca `pending` el que da
// menos de 24 h de aviso, asi que los cuatro se pusieron rojos con el codigo sano —
// median el calendario sin querer. Lo que prueban es el FORMATO (etiqueta con tildes
// y coma + ISO detras de un `@`) y el renderizado, no la fecha: la etiqueta se
// mantiene con la forma real de produccion y el ISO se ancla al reloj.
const ISO_A = new Date(Date.now() + 48 * 3600_000).toISOString().replace(/\.\d{3}Z$/, "Z");
const ISO_B = new Date(Date.now() + 96 * 3600_000).toISOString().replace(/\.\d{3}Z$/, "Z");
const SPEC_PROD = `sábado 5 de septiembre, 09:00@${ISO_A}|lunes 7 de septiembre, 14:00@${ISO_B}`;

// Desde el 2-oct los horarios eligen la rama SOLO con agenda propia (`ONIA_BOT_AGENDA=calcom` y
// Cal.com configurado): sin ella produccion no ofrece ninguno aunque el cron los deje en
// webhook.env. Los casos que miden DE DONDE salen los horarios la declaran en la misma fuente
// (entorno, archivo o VPS) que los horarios; el default sin agenda tiene su caso propio abajo.
const AGENDA_PROPIA = { ONIA_BOT_AGENDA: "calcom", CALCOM_BASE_URL: "http://calcom:3000", CALCOM_BOT_EVENT_TYPE_ID: "5" };
const AGENDA_PROPIA_EN_ARCHIVO = Object.entries(AGENDA_PROPIA).map(([k, v]) => `${k}=${v}`).join("\n");

test("--slots con el formato REAL de produccion no filtra el ISO al guion que ve el cliente", () => {
  const config = buildConfig({ slots: SPEC_PROD });

  assert.equal(config.slots[0].label, "sábado 5 de septiembre, 09:00");
  assert.equal(config.slots[0].startAt, ISO_A, "el ISO no se tira: es lo que reserva la demo");
  assert.equal(config.slots[1].label, "lunes 7 de septiembre, 14:00");

  // Y sobre todo: que no se vea. El guion es la superficie que lee un desconocido.
  const texto = preguntar(config, "hola, quiero información");
  assert.doesNotMatch(texto, /@?\d{4}-\d{2}-\d{2}T/, "el timestamp interno se esta mostrando al prospecto");
  assert.match(texto, /sábado 5 de septiembre, 09:00/);
});

test("sin --slots toma ONIA_BOT_SLOTS del entorno, que es de donde los lee produccion", () => {
  const env = { ONIA_BOT_SLOTS: SPEC_PROD, ...AGENDA_PROPIA };
  const config = buildConfig({}, { env });

  assert.equal(config.slots[0].label, "sábado 5 de septiembre, 09:00");
  assert.doesNotMatch(
    preguntar(config, "hola, quiero información"),
    /no tengo horarios libres/i,
    "el simulador sirve la rama SIN_HORARIOS mientras produccion ofrece dos: mide el guion equivocado",
  );
});

// EL RELOJ SE INYECTA (2026-10-02). Cinco archivos de la pauta dental (codigo-del-anuncio,
// frase-de-la-pauta, paciente-de-la-pauta, profesionales-de-la-clinica,
// tratamiento-a-medias-no-es-consulta-clinica) escribieron sus mensajes el 30-sep con `T0` fijo y
// horarios fijos del 2 y 3 de octubre, pero armaban la config con el reloj de la MAQUINA. El 2-oct
// los horarios cayeron adentro de las 24 h de anticipacion, el motor paso a la rama SIN_HORARIOS y
// diez tests se pusieron rojos sin que nadie tocara el bot — y con ellos se trabo el deploy.
// La conversacion ya tenia su instante; faltaba que la config lo usara.
test("buildConfig juzga los horarios con el reloj INYECTADO, no con el de la maquina", () => {
  const horarios = "jueves 2 de octubre, 14:00@2026-10-02T18:00:00Z|viernes 3 de octubre, 15:00@2026-10-03T19:00:00Z";

  const antes = buildConfig({ slots: horarios }, { ...SIN_AMBIENTE, now: Date.parse("2026-09-30T19:00:00Z") });
  assert.deepEqual(antes.slots.map((s) => s.pending), [false, false], "el 30-sep los dos se sostienen");

  const despues = buildConfig({ slots: horarios }, { ...SIN_AMBIENTE, now: Date.parse("2026-10-02T19:00:00Z") });
  assert.ok(despues.slots.some((s) => s.pending), "el 2-oct a las 19:00 UTC el del jueves ya paso: no se ofrece");
});

test("sin horarios por ningun lado NO se lo calla: dice que esa NO es la rama de produccion", () => {
  const avisos = [];
  buildConfig({}, { ...SIN_AMBIENTE, warn: (linea) => avisos.push(linea) });

  const deHorarios = avisos.filter((linea) => /horario/i.test(linea));
  assert.equal(deHorarios.length, 1, "un instrumento que mide otra rama que produccion tiene que decirlo");
  assert.match(deHorarios[0], /ONIA_BOT_SLOTS/, "el aviso nombra el dato que falta, para poder repararlo");
});

// ---------------------------------------------------------------------------
// Los horarios salen del ARTEFACTO DESPLEGADO, no de que alguien exporte a mano
// ---------------------------------------------------------------------------
// Medido el 2026-09-04: produccion tenia DOS horarios cargados (`webhook.env` +
// el proceso vivo confirmado en /proc/<pid>/environ) y el simulador, corrido como
// lo manda el prompt de este carril, caia igual en `M0_SIN_HORARIOS` — o sea que
// el "3/3" que el carril reporta cada vuelta certificaba un guion que NINGUN
// prospecto ve. El aviso de la vuelta anterior existia y salio impreso DOS veces;
// avisar no alcanzo, porque el que lee el aviso es el mismo que ya decidio confiar.
//
// Es el mismo eslabon que `knowledge.onia.json` (arreglado el 2026-09-03): el
// instrumento tiene que CARGAR el mismo artefacto que se instala. Ahi era la
// config; aca es la entrada que ELIGE LA RAMA, que es la que quedo suelta.
// Documentar el comando manual para copiarlos (cabecera de simulate.mjs) es
// exactamente el patron "documentado pero no cableado" que ya fallo en este carril.

test("sin --slots ni entorno, los horarios salen del webhook.env DESPLEGADO", (t) => {
  const envFile = join(mkdtempSync(join(tmpdir(), "onia-slots-")), "webhook.env");
  writeFileSync(
    envFile,
    `ONIA_BOT_MODEL=gpt-4.1-mini\nONIA_BOT_SLOTS="${SPEC_PROD}"\n${AGENDA_PROPIA_EN_ARCHIVO}\n`,
  );
  t.after(() => rmSync(dirname(envFile), { recursive: true, force: true }));

  const config = buildConfig({}, { env: {}, envFile });

  assert.equal(config.slots?.[0]?.label, "sábado 5 de septiembre, 09:00", "no leyo el archivo que carga produccion");
  assert.equal(config.slots[0].startAt, ISO_A);
  assert.doesNotMatch(
    preguntar(config, "hola, quiero información"),
    /no tengo horarios libres/i,
    "mide la rama SIN_HORARIOS teniendo el archivo de produccion al alcance",
  );
});

test("el valor del webhook.env viene ENTRECOMILLADO: las comillas no se filtran al guion", (t) => {
  const envFile = join(mkdtempSync(join(tmpdir(), "onia-slots-")), "webhook.env");
  writeFileSync(envFile, `ONIA_BOT_SLOTS="sábado 5 de septiembre, 09:00@${ISO_A}"\n${AGENDA_PROPIA_EN_ARCHIVO}\n`);
  t.after(() => rmSync(dirname(envFile), { recursive: true, force: true }));

  const config = buildConfig({}, { env: {}, envFile });

  assert.equal(config.slots?.[0]?.label, "sábado 5 de septiembre, 09:00", 'la comilla quedo pegada: «"sábado…»');
  // Sobre el HORARIO renderizado, no sobre la pantalla entera: el guion trae comillas propias
  // y legitimas (`o escribime "otro" y lo coordinamos`), asi que prohibirlas todas acusa al bot.
  assert.match(
    preguntar(config, "hola, quiero información"),
    /(?<!["'])sábado 5 de septiembre, 09:00(?!["'])/,
    "la comilla del webhook.env se filtro al horario que ve el prospecto",
  );
});

test("el entorno le GANA al archivo: es lo que produccion resuelve ultimo", (t) => {
  const envFile = join(mkdtempSync(join(tmpdir(), "onia-slots-")), "webhook.env");
  writeFileSync(envFile, 'ONIA_BOT_SLOTS="del archivo, 09:00@2026-09-05T13:00:00Z"\n');
  t.after(() => rmSync(dirname(envFile), { recursive: true, force: true }));

  const config = buildConfig({}, { env: { ONIA_BOT_SLOTS: "del entorno, 10:00@2026-09-05T14:00:00Z", ...AGENDA_PROPIA }, envFile, now: Date.parse("2026-09-01T00:00:00Z") });

  assert.equal(config.slots?.[0]?.label, "del entorno, 10:00");
});

test("webhook.env CON horarios pero SIN agenda propia: el simulador sirve la rama de produccion, sin horarios", (t) => {
  // Es el estado de produccion despues del 2-oct: el cron sigue dejando horarios y nadie los
  // reserva. El prospecto recibe M0_PERSONA; medir con los horarios seria medir una rama que nadie ve.
  const envFile = join(mkdtempSync(join(tmpdir(), "onia-slots-")), "webhook.env");
  writeFileSync(envFile, `ONIA_BOT_SLOTS="${SPEC_PROD}"\nCALCOM_BASE_URL=http://calcom:3000\nCALCOM_BOT_EVENT_TYPE_ID=5\n`);
  t.after(() => rmSync(dirname(envFile), { recursive: true, force: true }));
  const avisos = [];

  const config = buildConfig({}, { env: {}, envFile, warn: (linea) => avisos.push(linea) });

  assert.equal(config.agenda?.modo, "persona");
  const texto = preguntar(config, "hola, quiero información");
  assert.doesNotMatch(texto, /\*\*A\)\*\*/, "ofrece horarios que produccion ya no ofrece");
  assert.match(texto, /te escribe/, "lo que produccion le dice: quien le coordina la demo");
  assert.deepEqual(avisos.filter((l) => /horario/i.test(l)), [], "es LA rama de produccion: no hay nada que avisar");
});

test("el webhook.env que se lee es el DESPLEGADO, no una copia de adorno", () => {
  assert.equal(WEBHOOK_ENV_DESPLEGADO, "/opt/onia/bot/webhook.env", "si esta ruta cambia, el simulador mide otra cosa que produccion");
});

// ---------------------------------------------------------------------------------------------
// EL ARREGLO DE ARRIBA ESTABA ATADO A UNA MAQUINA, Y AL MUDARSE EL CARRIL VOLVIO EL MISMO BUG.
//
// El escalon `webhook.env DESPLEGADO` se cableo el 2026-09-04, cuando este loop corria en el VPS.
// El 2026-09-06 el carril se mudo a nodo-casa (WSL), donde `/opt/onia/bot` NO EXISTE — y el
// falso verde numero 2 de la cabecera volvio entero: medido el 2026-09-07, el simulador caia en
// `M0_SIN_HORARIOS` («Justo ahora no tengo horarios libres para ofrecerte») mientras produccion
// tenia DOS horarios cargados en ese mismo archivo. O sea que el "3/3" que este carril reporta
// cada vuelta volvia a certificar un guion que ningun prospecto ve.
//
// No es un bug nuevo: es el ya conocido «un gate que lee una ruta absoluta del VPS deja de medir
// cuando su loop se muda de maquina». Y avisar no alcanza — el simulador YA imprimia
// «⚠️ sin horarios ... esta es OTRA rama del guion» las dos veces, y no cambio nada. Un aviso no
// arregla un instrumento.
//
// El escalon que falta es preguntarle al VPS, que es donde vive el archivo: nodo-casa tiene SSH
// con BatchMode contra 187.77.16.63. Se prueba en las DOS direcciones, porque el modo de falla
// caro no es que no lea: es que al no leer se invente la rama sin horarios y la firme en verde.

test("sin el webhook.env local, los horarios se le piden al VPS — es donde vive el archivo", () => {
  const config = buildConfig(
    {},
    {
      env: {},
      // nodo-casa: el archivo desplegado no existe en el disco local.
      readFileSync: () => {
        throw Object.assign(new Error("ENOENT"), { code: "ENOENT" });
      },
      spawnSync: (cmd, args) => {
        assert.equal(cmd, "ssh", "el ultimo escalon es SSH al VPS, no otra cosa");
        assert.ok(
          args.some((a) => String(a).includes(WEBHOOK_ENV_DESPLEGADO)),
          "le tiene que pedir al VPS el MISMO archivo que carga produccion",
        );
        return { status: 0, stdout: `ONIA_BOT_SLOTS="${SPEC_PROD}"\n${AGENDA_PROPIA_EN_ARCHIVO}\n`, stderr: "" };
      },
    },
  );

  assert.equal(config.slots?.[0]?.label, "sábado 5 de septiembre, 09:00", "no le pregunto al VPS");
  assert.equal(config.slots[0].startAt, ISO_A);
  assert.doesNotMatch(
    preguntar(config, "hola, quiero información"),
    /no tengo horarios libres/i,
    "mide la rama SIN_HORARIOS teniendo los horarios de produccion a un SSH de distancia",
  );
});

test("si el VPS tampoco contesta, NO se inventa la rama: lo dice", () => {
  const avisos = [];
  const config = buildConfig(
    {},
    {
      env: {},
      readFileSync: () => {
        throw Object.assign(new Error("ENOENT"), { code: "ENOENT" });
      },
      spawnSync: () => ({ status: 255, stdout: "", stderr: "ssh: connect timed out" }),
      warn: (linea) => avisos.push(String(linea)),
    },
  );

  // Cae al placeholder de config.mjs, que es la rama HONESTA: no inventa un horario ofrecible.
  assert.ok(
    config.slots.every((s) => s.pending && s.startAt === null),
    "se invento un horario ofrecible sin haber podido leer ninguno",
  );
  const aviso = avisos.join("\n");
  assert.match(aviso, /OTRA rama del guion/, "el aviso honesto de siempre tiene que seguir saliendo");
  assert.match(
    aviso,
    /VPS|ssh/i,
    "el aviso tiene que decir que TAMBIEN se le pregunto al VPS: si no, se lee como 'la maquina no tiene el archivo' y se arregla en el lugar equivocado",
  );
});

test("una ruta que NO es la desplegada nunca sale a la red", () => {
  // Los casos hermeticos de arriba pasan `envFile: "/no/existe/webhook.env"`. Si el escalon
  // remoto disparara con cualquier ruta, la suite entera se colgaria contra un SSH real — y en
  // una maquina sin la llave daria un rojo que no tiene nada que ver con el codigo.
  //
  // ⚠️ El testigo se ANOTA, no se tira. La primera version de este caso hacia
  // `spawnSync: () => assert.fail(...)`, y `leerDelEnvRemoto` envuelve la llamada en un
  // try/catch (para sobrevivir a un `ssh` que no existe): se comia la excepcion del assert y el
  // caso pasaba en VERDE aun ensanchando el gate a proposito. Lo cazo la mutacion
  // `esLaDesplegada = true`, no la lectura. Un guardia que no puede fallar no es un guardia.
  let salioALaRed = false;
  buildConfig(
    {},
    {
      ...SIN_AMBIENTE,
      spawnSync: () => {
        salioALaRed = true;
        return { status: 1, stdout: "", stderr: "" };
      },
    },
  );

  assert.equal(salioALaRed, false, "salio a la red por una ruta que produccion no usa");
});

// ---------------------------------------------------------------------------
// EL SIMULADOR NO PUEDE PROMETER MAS QUE EL BOT
//
// Medido el 2026-09-12: el simulador imprimia "Listo, agendado: lunes 14, 14:00" PELADO,
// mientras los dos mensajes que el bot MANDO de verdad (convs 11 y 49 de Chatwoot) llevaban
// los dos "(Estoy confirmando ese horario con Sergio...)". La causa: el simulador llama a
// `step()` directo y NUNCA pasa por `runTurn`, que es donde el producto pega ese cierre
// cuando la reserva no sale — y hoy no sale nunca, porque no hay Cal.com en el VPS.
//
// Por que es peor que un detalle de texto: el simulador es el instrumento con el que este
// carril mide "simulador 3/3" AL ARRANCAR CADA VUELTA. Un instrumento mas optimista que el
// producto es ciego justo a la regresion que mide. Misma familia que el "simulador 3/3" que
// convivio con el bot vivo cotizando Bs 750.
//
// El caso corre el simulador DE VERDAD en un proceso hijo (no la funcion suelta): asi se pone
// rojo tambien si alguien saca el cableado de uno de los dos llamadores de `step()`.
// ---------------------------------------------------------------------------

// CAMBIO DE CONTRATO (2-oct). Aca se exigia que el simulador imprimiera «Listo, agendado» CON la
// salvedad pegada abajo, porque eso era lo que recibia el prospecto. Eso ERA el bug (auditoria de
// produccion del 2-oct, §2 accion 3): confirmar y desdecirse en el mismo mensaje. Lo que se sigue
// exigiendo es lo de fondo: el simulador imprime lo MISMO que recibe el prospecto, por los dos
// llamadores de `step()`.

/** Entorno de un proceso hijo sin agenda propia ni Cal.com: produccion, hoy. */
function entornoDeProduccionSinAgenda() {
  const env = { ...process.env };
  delete env.CALCOM_BASE_URL;
  delete env.CALCOM_BOT_EVENT_TYPE_ID;
  delete env.ONIA_BOT_AGENDA;
  // Los horarios se DERIVAN de ahora (SPEC_PROD), no se tipean: `parseSlotsSpec` descarta todo
  // lo que caiga antes de ANTICIPACION_MINIMA_MS (24 h), asi que un ISO literal convierte este
  // caso en una bomba de tiempo (paso el 17-sep y trabo el merge de todos los carriles).
  env.ONIA_BOT_SLOTS = SPEC_PROD;
  return env;
}

test("el guion feliz, con el entorno de produccion: no ofrece horarios y nunca dice «Listo, agendado»", () => {
  const simulador = fileURLToPath(new URL("./simulate.mjs", import.meta.url));
  const corrida = spawnSync(process.execPath, [simulador, "--script", "1-feliz"], {
    encoding: "utf8",
    env: entornoDeProduccionSinAgenda(),
    timeout: 60000,
  });

  assert.equal(corrida.status, 0, `el simulador no corrio: ${corrida.stderr}`);
  assert.doesNotMatch(corrida.stdout, /Listo, agendado/, "el simulador confirma una demo que produccion no agenda");
  assert.doesNotMatch(corrida.stdout, /\*\*A\)\*\*/, "y ofrece horarios que produccion ya no ofrece");
  assert.match(corrida.stdout, /M0_PERSONA/, "mide la bienvenida que recibe el prospecto");
});

test("con --slots a mano y sin Cal.com, la eleccion imprime la version HONESTA (el mismo texto que el vivo)", () => {
  const simulador = fileURLToPath(new URL("./simulate.mjs", import.meta.url));
  const corrida = spawnSync(process.execPath, [simulador, "--script", "1-feliz", "--slots", SPEC_PROD], {
    encoding: "utf8",
    env: entornoDeProduccionSinAgenda(),
    timeout: 60000,
  });

  assert.equal(corrida.status, 0, `el simulador no corrio: ${corrida.stderr}`);
  assert.match(corrida.stdout, /sábado 5 de septiembre, 09:00/, "el caso tiene que llegar a elegir (si no, no mide nada)");
  assert.doesNotMatch(corrida.stdout, /Listo, agendado/, "sin Cal.com la reserva no sale: confirmarla es el bug del 2-oct");
  assert.match(corrida.stdout, /todavía no quedó reservado/, "imprime lo que el bot vivo manda cuando la reserva no sale");
});

test("y el modo INTERACTIVO tambien — es el que usa la medicion de arranque del carril", () => {
  // Los dos llamadores de `step()` son caminos distintos: el gate de arriba cubre `--script`,
  // pero la linea que este carril corre cada vuelta es `printf ... | node simulate.mjs`.
  const simulador = fileURLToPath(new URL("./simulate.mjs", import.meta.url));
  const corrida = spawnSync(process.execPath, [simulador, "--slots", SPEC_PROD], {
    encoding: "utf8",
    env: entornoDeProduccionSinAgenda(),
    timeout: 60000,
    input: "quiero una demo\nA\n/salir\n",
  });

  assert.equal(corrida.status, 0, `el simulador no corrio: ${corrida.stderr}`);
  assert.match(corrida.stdout, /sábado 5 de septiembre, 09:00/, "el camino tiene que llegar a elegir (si no, el caso no mide nada)");
  assert.doesNotMatch(corrida.stdout, /Listo, agendado/);
  assert.match(corrida.stdout, /todavía no quedó reservado/, "el modo interactivo imprime el texto honesto que manda el bot vivo");
});

// ---------------------------------------------------------------------------------------------
// LA LLAVE DEL ESCALON REMOTO NO PUEDE SER UNA RUTA FIJA — tercera vuelta del mismo bug.
//
// El escalon que le pregunta al VPS nacio el 2026-09-07 para arreglar «un instrumento atado a la
// ruta absoluta de UNA maquina deja de medir cuando su loop se muda»... y se cableo a OTRA ruta
// absoluta: `/root/.ssh/onia_hermes_vps_ed25519`, la de nodo-casa (WSL, como root).
//
// El 2026-09-21 el carril se abrio en Windows, donde la llave vive en `C:\Users\<usuario>\.ssh\`.
// `leerDelEnvRemoto` envuelve el `spawnSync` en try/catch para sobrevivir a un ssh ausente, asi
// que el fallo fue SILENCIOSO: devolvia null, el simulador caia en `M0_SIN_HORARIOS` y el "3/3"
// del carril volvia a certificar un guion que ningun prospecto ve. Exactamente el falso verde
// que la cabecera de este archivo describe, por tercera vez y por el mismo mecanismo.
//
// La regla que fijan estos casos: la llave se RESUELVE preguntando donde esta. Arreglar una ruta
// fija escribiendo otra ruta fija solo corre la fecha en que vuelve a romperse.
// ---------------------------------------------------------------------------------------------

test("ONIA_VPS_KEY manda sobre todo lo demas: es la escotilla para una maquina rara", () => {
  const llave = resolverLlaveVps({
    env: { ONIA_VPS_KEY: "/ruta/elegida/a/mano" },
    home: "/casa",
    existsSync: () => true,
  });
  assert.equal(llave, "/ruta/elegida/a/mano");
});

test("sin variable, usa la llave del HOME de esta maquina (Windows, mac o Linux de usuario)", () => {
  const vistas = [];
  const llave = resolverLlaveVps({
    env: {},
    home: join("/casa", "usuario"),
    existsSync: (p) => {
      vistas.push(p);
      return p.includes("casa");
    },
  });
  assert.match(String(llave), /onia_hermes_vps_ed25519$/);
  assert.ok(String(llave).includes("casa"), `se esperaba la del HOME y salio ${llave}`);
  assert.ok(vistas.length >= 1, "la guarda no probo ninguna ruta: estaria devolviendo una fija");
});

test("cae a /root/.ssh (nodo-casa) solo si el HOME no la tiene", () => {
  const llave = resolverLlaveVps({
    env: {},
    home: "/casa",
    existsSync: (p) => p.startsWith("/root/"),
  });
  assert.equal(llave, "/root/.ssh/onia_hermes_vps_ed25519");
});

test("sin ninguna llave devuelve null — y eso NO puede significar rendirse", () => {
  assert.equal(resolverLlaveVps({ env: {}, home: "/casa", existsSync: () => false }), null);

  // La otra mitad: con null igual se sale a preguntar, sin `-i`, para que ssh use su config o su
  // agente. Si en vez de eso abandonara, volveriamos al silencio que este escalon vino a romper.
  const fuente = readFileSync(fileURLToPath(new URL("./simulate.mjs", import.meta.url)), "utf8");
  const remoto = fuente.slice(fuente.indexOf("function leerDelEnvRemoto"));
  assert.match(remoto.slice(0, 900), /if \(llave\) args\.push\("-i", llave\)/, "el `-i` tiene que ser condicional");
});

test("no queda ninguna ruta de llave escrita a mano fuera de la lista que las resuelve", () => {
  const fuente = readFileSync(fileURLToPath(new URL("./simulate.mjs", import.meta.url)), "utf8");
  const codigo = fuente
    .split("\n")
    .filter((l) => !l.trim().startsWith("*") && !l.trim().startsWith("//") && !l.trim().startsWith("/*"))
    .join("\n");
  const dentroDeLaLista = codigo.slice(codigo.indexOf("export function rutasDeLlaveVps"), codigo.indexOf("export function resolverLlaveVps"));
  const fuera = codigo.split(dentroDeLaLista).join("");
  assert.equal(
    /\.ssh\/onia_hermes|\.ssh\\onia_hermes/.test(fuera),
    false,
    "hay una ruta de llave fija fuera de rutasDeLlaveVps: es el bug que ya volvio tres veces",
  );
});
