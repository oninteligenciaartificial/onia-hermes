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

import { cierreDeReservaFallida } from "./calcom-booking.mjs";

import { DEFAULT_CONFIG } from "./config.mjs";
import { createState, step } from "./bot-engine.mjs";
import { MONTOS_PERMITIDOS } from "./precios-publicos.mjs";
import { buildConfig, cargarConocimientoPublicado, configParaGuion, CONOCIMIENTO_PUBLICADO, WEBHOOK_ENV_DESPLEGADO } from "./simulate.mjs";

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

  assert.equal(config, DEFAULT_CONFIG, "sin documento valido tiene que degradar al guion del codigo, sin mezclar");
  const delDocumento = avisos.filter((linea) => /conocimiento/i.test(linea));
  assert.equal(delDocumento.length, 1, "un instrumento que no puede medir lo dice; callarselo es el modo de falla caro");
});

test("--sin-conocimiento sirve el guion pelado del codigo, para poder comparar los dos", () => {
  assert.equal(buildConfig({ sinConocimiento: true }, SIN_AMBIENTE), DEFAULT_CONFIG);
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
  const env = { ONIA_BOT_SLOTS: SPEC_PROD };
  const config = buildConfig({}, { env });

  assert.equal(config.slots[0].label, "sábado 5 de septiembre, 09:00");
  assert.doesNotMatch(
    preguntar(config, "hola, quiero información"),
    /no tengo horarios libres/i,
    "el simulador sirve la rama SIN_HORARIOS mientras produccion ofrece dos: mide el guion equivocado",
  );
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
    `ONIA_BOT_MODEL=gpt-4.1-mini\nONIA_BOT_SLOTS="${SPEC_PROD}"\n`,
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
  writeFileSync(envFile, `ONIA_BOT_SLOTS="sábado 5 de septiembre, 09:00@${ISO_A}"\n`);
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

  const config = buildConfig({}, { env: { ONIA_BOT_SLOTS: "del entorno, 10:00@2026-09-05T14:00:00Z" }, envFile });

  assert.equal(config.slots?.[0]?.label, "del entorno, 10:00");
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
        return { status: 0, stdout: `ONIA_BOT_SLOTS="${SPEC_PROD}"\n`, stderr: "" };
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

// ---------------------------------------------------------------------------------------------
// LOS HORARIOS DEL CASO NO PUEDEN SER FECHAS ESCRITAS A MANO.
//
// Estos dos casos nacieron con `ONIA_BOT_SLOTS="lun 14:00@2026-09-14T18:00:00Z|mar 14:00@...15..."`.
// El motor descarta los horarios que ya pasaron —bien, es lo que tiene que hacer— asi que el
// 2026-09-15 los dos casos se pusieron ROJOS solos, sin que nadie tocara una linea: el simulador
// caia en `M0_SIN_HORARIOS` y el assert de "Listo, agendado" no podia cumplirse nunca mas.
//
// Y el dano no se queda en el tablero: `deploy-bot.sh` corre `node --test` como gate ANTES de
// desplegar, asi que una fecha vencida en un test de instrumento BLOQUEA el despliegue del bot
// vivo. Se descubrio el 2026-09-21, seis dias despues, desplegando otra cosa.
//
// La regla: en un caso que depende de "todavia no paso", la fecha se CALCULA desde el reloj.
// Una fecha literal en el futuro es una bomba con temporizador y la unica duda es cuando suena.
// ---------------------------------------------------------------------------------------------

/** Dos horarios siempre por delante del reloj, en el formato `label@ISO` que lee `parseSlotsSpec`. */
export function slotsSiempreFuturos(ahora = new Date()) {
  const enDias = (d) => new Date(ahora.getTime() + d * 86_400_000).toISOString().replace(/\.\d{3}Z$/, "Z");
  return `horario A@${enDias(7)}|horario B@${enDias(8)}`;
}

test("los horarios de los casos de abajo estan SIEMPRE en el futuro", () => {
  // Guarda del instrumento: si alguien vuelve a escribir una fecha a mano, se entera hoy y no
  // el dia que caduque — que es el dia en que el gate del deploy se pone rojo sin motivo visible.
  const spec = slotsSiempreFuturos();
  for (const parte of spec.split("|")) {
    const iso = parte.split("@")[1];
    assert.ok(iso, `el horario "${parte}" no trae fecha ISO`);
    assert.ok(
      new Date(iso).getTime() > Date.now(),
      `el horario "${parte}" ya paso: el motor lo descarta y el caso mide la rama sin horarios`,
    );
  }
});

test("ningun caso de este archivo fija los horarios con una fecha literal", () => {
  const fuente = readFileSync(fileURLToPath(new URL("./simulate.test.mjs", import.meta.url)), "utf8");
  // Se miran SOLO las asignaciones `env.ONIA_BOT_SLOTS = "..."`, que son las que alimentan al
  // simulador de verdad en un proceso hijo — o sea las unicas que dependen de "todavia no paso".
  // Las otras fechas literales del archivo son deliberadas y tienen que quedar: los comentarios
  // guardan la historia del bug, y los casos de precedencia (entorno vs archivo) y de `pending`
  // miden el PARSEO, que no mira el reloj. Una guarda que las barriera tambien se volveria ruido
  // y terminaria desactivada, que es como mueren las guardas.
  // Las lineas de comentario quedan afuera: la primera version de esta guarda se conto A SI MISMA
  // (el comentario de arriba nombra el patron) y dio 3 donde hay 2 asignaciones de verdad.
  const asignaciones = fuente
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => !l.startsWith("//") && !l.startsWith("*"))
    .filter((l) => /env\.ONIA_BOT_SLOTS\s*=/.test(l));
  // Que la guarda no pueda quedar HUECA: si el patron deja de encontrar las asignaciones —porque
  // alguien renombro la variable o cambio la forma— el test pasaria en verde sin mirar nada, que
  // es peor que no tenerlo. Son dos casos y los dos tienen que estar.
  assert.equal(
    asignaciones.length,
    2,
    "la guarda dejo de encontrar las asignaciones que vigila: revisar el patron, no borrar el caso",
  );
  for (const a of asignaciones) {
    assert.ok(
      !/\d{4}-\d{2}-\d{2}/.test(a),
      `hay una fecha literal en ${a} — usa slotsSiempreFuturos(), que se calcula desde el reloj`,
    );
  }
});

test("el guion feliz del simulador cierra con la MISMA salvedad que recibe el prospecto", () => {
  const simulador = fileURLToPath(new URL("./simulate.mjs", import.meta.url));
  // Ambiente explicito: sin Cal.com configurado, que es produccion HOY. Si alguna vez se
  // configura, este caso sigue midiendo lo suyo en vez de volverse intermitente.
  const env = { ...process.env };
  delete env.CALCOM_BASE_URL;
  delete env.CALCOM_BOT_EVENT_TYPE_ID;
  env.ONIA_BOT_SLOTS = slotsSiempreFuturos();

  const corrida = spawnSync(process.execPath, [simulador, "--script", "1-feliz"], {
    encoding: "utf8",
    env,
    timeout: 60000,
  });

  assert.equal(corrida.status, 0, `el simulador no corrio: ${corrida.stderr}`);
  assert.match(corrida.stdout, /Listo, agendado/, "el guion feliz tiene que llegar a agendar (si no, el caso no mide nada)");
  // El texto se IMPORTA del modulo que lo emite: escribirlo aca seria una segunda copia, que
  // es exactamente el defecto que este caso existe para impedir.
  const salvedad = cierreDeReservaFallida("sin_config").trim().replace(/^_\(|\)_$/g, "");
  assert.ok(
    corrida.stdout.includes(salvedad),
    "el simulador imprimio el 'Listo, agendado' sin la salvedad que el bot SI le manda al prospecto",
  );
});

test("y el modo INTERACTIVO tambien — es el que usa la medicion de arranque del carril", () => {
  // Los dos llamadores de `step()` son caminos distintos: el gate de arriba cubre `--script`,
  // pero la linea que este carril corre cada vuelta es `printf ... | node simulate.mjs`. Sin
  // este caso, sacarle el cierre al modo interactivo pasa en verde — y justamente ahi es donde
  // se lee el "simulador 3/3" que se reporta.
  const simulador = fileURLToPath(new URL("./simulate.mjs", import.meta.url));
  const env = { ...process.env };
  delete env.CALCOM_BASE_URL;
  delete env.CALCOM_BOT_EVENT_TYPE_ID;
  env.ONIA_BOT_SLOTS = slotsSiempreFuturos();

  const corrida = spawnSync(process.execPath, [simulador], {
    encoding: "utf8",
    env,
    timeout: 60000,
    input: "quiero una demo\nA\n/salir\n",
  });

  assert.equal(corrida.status, 0, `el simulador no corrio: ${corrida.stderr}`);
  assert.match(corrida.stdout, /Listo, agendado/, "el camino tiene que llegar a agendar (si no, el caso no mide nada)");
  const salvedad = cierreDeReservaFallida("sin_config").trim().replace(/^_\(|\)_$/g, "");
  assert.ok(
    corrida.stdout.includes(salvedad),
    "el modo interactivo imprimio el 'Listo, agendado' sin la salvedad que el bot SI le manda al prospecto",
  );
});
