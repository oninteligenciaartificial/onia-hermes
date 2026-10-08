// ONIA — pruebas de la CAPA DE CONOCIMIENTO EDITABLE.
//
// Lo que se prueba no es "el cargador lee un JSON": es que el bot NO SE ROMPA y NO PROMETA nada
// por culpa de un archivo que edita un humano sin desplegar. En orden de importancia:
//   1. degrada a codigo ante archivo ausente / roto / invalido, sin tirar y sin quedar mudo;
//   2. rechaza el archivo ENTERO (nunca a medias) ante una clave desconocida, un tipo mal o un
//      precio metido en cualquier string;
//   3. la cache no relee en el camino de la respuesta;
//   4. la duracion de la demo sale de UN solo lugar y no puede volver a decir dos cosas.
//
// Correr:  node --test hermes-content/deploy/vps-ops/bot/
// Diseño:  hermes-content/docs/ONIA_BOT_CAPA_CONOCIMIENTO_20260806.md

import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { DEFAULT_CONFIG, DEMO, SCRIPT, createBotConfig, demoDuration, renderTemplate } from "./config.mjs";
import {
  DEFAULT_TTL_MS,
  KNOWLEDGE_SCHEMA,
  applyKnowledge,
  checkCli,
  ensureKnowledge,
  getKnowledge,
  getOrgKnowledge,
  ensureKnowledgeHealth,
  getPanelKnowledge,
  mapPanelDoc,
  parseKnowledge,
  readKnowledgeFile,
  resetKnowledgeCache,
  resetOrgKnowledgeCache,
  sanitizePanelKnowledge,
  validateKnowledge,
  withKnowledge,
} from "./knowledge.mjs";
import { handlePreviewRequest } from "./preview-route.mjs";
import { activeSlots, pendingAsk } from "./reply-builder.mjs";
import { step, createState } from "./bot-engine.mjs";
import { normalize } from "./guardrails.mjs";
import { findIndustry, industryLabel } from "./intents.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const EJEMPLO = join(HERE, "knowledge.example.json");

const T0 = "2026-07-27T14:05:00Z"; // lunes 10:05 en La Paz: dentro de horario
const NOW_MS = Date.parse(T0);

/**
 * Horarios REALES. `DEFAULT_CONFIG` trae los placeholders ("HORARIO A (pendiente de definir)") y
 * con eso el motor contesta —bien— la bienvenida SIN horarios. Los tests que miden el guion normal
 * tienen que traer horarios de verdad, o estarian midiendo el camino de contingencia.
 */
const HORARIOS = Object.freeze([
  Object.freeze({ key: "A", label: "jueves 15:00", startAt: "2026-07-30T19:00:00Z" }),
  Object.freeze({ key: "B", label: "viernes 10:00", startAt: "2026-07-31T14:00:00Z" }),
]);
const conHorarios = (config) => createBotConfig({ slots: HORARIOS }, config);

/** Un archivo minimo y valido. Cada test lo deforma para probar UNA cosa. */
function valido(extra = {}) {
  return {
    schema: KNOWLEDGE_SCHEMA,
    version: "test.1",
    updatedBy: "test",
    identity: { humanName: "Sergio" },
    ...extra,
  };
}

/** Escribe un archivo temporal y devuelve su ruta (se borra al final del test). */
function conArchivo(contenido, run) {
  const dir = mkdtempSync(join(tmpdir(), "onia-knowledge-"));
  const path = join(dir, "knowledge.json");
  if (contenido !== null) writeFileSync(path, typeof contenido === "string" ? contenido : JSON.stringify(contenido));
  const limpiar = () => {
    resetKnowledgeCache();
    rmSync(dir, { recursive: true, force: true });
  };
  let salida;
  try {
    salida = run(path);
  } catch (error) {
    limpiar();
    throw error;
  }
  // `checkCli` es async (corre el banco): con un `finally` a secas el archivo se borraria ANTES
  // de que lo terminen de leer, y el test verde estaria midiendo otra cosa.
  if (salida && typeof salida.finally === "function") return salida.finally(limpiar);
  limpiar();
  return salida;
}

test.afterEach(() => {
  resetKnowledgeCache();
  resetOrgKnowledgeCache();
});

// ---------------------------------------------------------------------------
// 1. DEGRADACION — el bot no se cae ni queda mudo
// ---------------------------------------------------------------------------

test("archivo AUSENTE: degrada a codigo, y la degradacion es la MISMA config (identidad)", () => {
  conArchivo(null, (path) => {
    const config = withKnowledge(DEFAULT_CONFIG, { path, nowMs: NOW_MS });
    assert.equal(config, DEFAULT_CONFIG, "sin archivo no se clona nada: es el estado de hoy, 100% funcional");

    const estado = getKnowledge({ path, nowMs: NOW_MS });
    assert.equal(estado.source, "code");
    assert.equal(estado.data, null);
    assert.equal(estado.error, null, "que no exista el archivo NO es un error que haya que gritar");
  });
});

test("archivo AUSENTE: el bot sigue contestando el guion completo, sin un solo {{hueco}}", () => {
  conArchivo(null, (path) => {
    const config = conHorarios(withKnowledge(DEFAULT_CONFIG, { path, nowMs: NOW_MS }));
    const result = step(createState({ channel: "sim", contactRef: "t" }), { text: "DEMO", receivedAt: T0 }, { config });
    const texto = result.replies.map((reply) => reply.text).join("\n");
    assert.match(texto, /30 minutos por videollamada/, "el hecho sale del codigo, exactamente como hoy");
    assert.ok(!texto.includes("{{"), "ninguna variable puede quedar sin resolver a la vista del prospecto");
  });
});

// --- La VENTANA del deploy: el archivo desaparece unos segundos y vuelve --------------------
//
// `webhook-server.sh` sincroniza el codigo con `rm -rf /tmp/onia-bot` + `docker cp` y el proceso
// vivo corre DESDE ahi: durante esa ventana `knowledge.json` NO EXISTE. Eso solo deberia costar
// los segundos del `cp` — pero una lectura fallida por ausencia marcaba la cache como "ya mire"
// y congelaba el estado "sin conocimiento" el TTL ENTERO (5 min), aunque el archivo volviera dos
// segundos despues. Medido el 2026-09-12 en produccion: a las 22:48 UTC el bot le contesto a un
// desconocido que preguntaba el precio "no te quiero tirar una cifra" (el M4_BODY sin cotizacion)
// y a las 23:15 el MISMO proceso, sin reiniciar, ya servia la escalera entera.
test("el archivo que DESAPARECE durante un deploy no deja al bot sin cotizar 5 minutos: el turno siguiente lo relee", () => {
  conArchivo(null, (path) => {
    const durante = getKnowledge({ path, nowMs: NOW_MS });
    assert.equal(durante.data, null, "durante el `rm -rf` no hay nada que leer");
    assert.equal(durante.error, null, "un archivo ausente no grita: puede ser el estado normal");

    // El `docker cp` termina dos segundos despues y el archivo vuelve.
    writeFileSync(path, JSON.stringify(valido({ version: "vuelta" })));

    const despues = getKnowledge({ path, nowMs: NOW_MS + 2_000 });
    assert.equal(
      despues.data?.version,
      "vuelta",
      "apenas el archivo vuelve, el mensaje siguiente tiene que cotizar — esperar el TTL son 5 min de prospectos sin precio",
    );
    assert.equal(despues.source, "file");
  });
});

test("archivo ausente CON copia buena en memoria: se sigue sirviendo esa copia y NO se relee en cada turno", () => {
  conArchivo(valido({ version: "publicada" }), (path) => {
    assert.equal(getKnowledge({ path, nowMs: NOW_MS }).data.version, "publicada");

    let lecturas = 0;
    const readFileSync = () => {
      lecturas += 1;
      const error = new Error("no existe");
      error.code = "ENOENT";
      throw error;
    };
    for (const salto of [1_000, 2_000, 3_000]) {
      const estado = getKnowledge({ path, nowMs: NOW_MS + salto, readFileSync });
      assert.equal(estado.data.version, "publicada", "lo ultimo bueno no se pierde porque el archivo desaparezca");
    }
    assert.equal(lecturas, 0, "con copia buena manda el TTL: releer por turno seria pagar disco en el camino de la respuesta");
  });
});

test("JSON ROTO: se rechaza entero, se sigue con codigo y el error queda a la vista en /health", async () => {
  await conArchivo("{ esto no es json", async (path) => {
    const config = withKnowledge(DEFAULT_CONFIG, { path, nowMs: NOW_MS });
    assert.equal(config, DEFAULT_CONFIG);

    const salud = await ensureKnowledgeHealth({ path, nowMs: NOW_MS });
    assert.equal(salud.source, "code");
    assert.match(salud.lastError, /JSON invalido/);
  });
});

test("JSON ROTO despues de uno bueno: se CONSERVA la ultima copia buena (no se pierde lo publicado)", async () => {
  const dir = mkdtempSync(join(tmpdir(), "onia-knowledge-"));
  const path = join(dir, "knowledge.json");
  try {
    writeFileSync(path, JSON.stringify(valido({ identity: { humanName: "Sergio" } })));
    assert.equal(getKnowledge({ path, nowMs: NOW_MS }).source, "file");

    // Alguien edita a mano por SSH y lo rompe. El refresco lo relee y lo rechaza.
    writeFileSync(path, "{{{");
    const readFile = async () => "{{{"; // inyectado para no depender del disco ni del reloj
    const estado = getKnowledge({ path, nowMs: NOW_MS + DEFAULT_TTL_MS, readFile });
    assert.equal(estado.source, "file", "se sigue sirviendo lo ultimo bueno mientras se relee");
    await new Promise((resolve) => setImmediate(resolve));

    const despues = getKnowledge({ path, nowMs: NOW_MS + DEFAULT_TTL_MS });
    assert.equal(despues.data.version, "test.1", "la copia buena sigue viva en memoria");
    assert.match(despues.error, /JSON invalido/, "y el fallo se reporta, no se traga");
  } finally {
    resetKnowledgeCache();
    rmSync(dir, { recursive: true, force: true });
  }
});

test("el cargador NUNCA tira: aunque leer el archivo explote, devuelve la config que recibio", () => {
  const explota = () => {
    throw new Error("disco en llamas");
  };
  const config = withKnowledge(DEFAULT_CONFIG, { path: "/no/existe.json", nowMs: NOW_MS, readFileSync: explota });
  assert.equal(config, DEFAULT_CONFIG);
});

// ---------------------------------------------------------------------------
// 2. RECHAZO TOTAL — nunca a medias
// ---------------------------------------------------------------------------

test("clave DESCONOCIDA: rechazo del archivo entero (no hay donde inyectar nada nuevo)", () => {
  const verdict = validateKnowledge(valido({ precios: { landing: 790 } }));
  assert.equal(verdict.ok, false);
  assert.match(verdict.errors.join(" "), /precios: clave desconocida/);
});

test("el guion NO se puede pisar desde los datos: `script` y las M* no existen en el esquema", () => {
  for (const intento of [{ script: { M0: "hola" } }, { M4_BODY: "el precio es 790" }, { SCRIPT: {} }]) {
    const verdict = validateKnowledge(valido(intento));
    assert.equal(verdict.ok, false, `${JSON.stringify(intento)} tendria que rechazarse`);
    assert.match(verdict.errors.join(" "), /clave desconocida/);
  }
});

test("UN PRECIO en cualquier string rechaza el archivo ENTERO: lo valido del mismo archivo tampoco entra", () => {
  const conPrecio = valido({
    identity: { humanName: "Sergio", productName: "Onia" }, // esto es impecable...
    faq: [
      {
        id: "siat",
        title: "Precios",
        body: "La plataforma cuesta 790 Bs al mes.", // ...y esto tira el archivo abajo
        status: "publicado",
        vigenteHasta: null,
      },
    ],
  });

  const verdict = validateKnowledge(conPrecio);
  assert.equal(verdict.ok, false);
  assert.match(verdict.errors.join(" "), /declara_precio/, "lo caza el MISMO guardrail que vigila al LLM");

  conArchivo(conPrecio, (path) => {
    const config = withKnowledge(DEFAULT_CONFIG, { path, nowMs: NOW_MS });
    assert.equal(config, DEFAULT_CONFIG, "TODO O NADA: ni el identity bueno se aplica");
    assert.equal(config.script.M_SIAT_BODY, SCRIPT.M_SIAT_BODY);
  });
});

test("las otras promesas tambien rebotan: feature, SIAT homologado, cifra inventada, fingir humano", () => {
  const casos = [
    ["se integra con tu impresora fiscal y con todo lo que uses", /promete_feature/],
    ["ya estamos homologados ante el SIN", /promete_siat/],
    ["más de 50 clientes ya lo usan", /cifra_inventada|declara_precio/],
    ["soy Sergio, te llamo ahora", /finge_humano/],
  ];
  for (const [body, esperado] of casos) {
    const verdict = validateKnowledge(valido({ faq: [{ id: "siat", body, status: "publicado", vigenteHasta: null }] }));
    assert.equal(verdict.ok, false, `deberia rechazar: ${body}`);
    assert.match(verdict.errors.join(" "), esperado);
  }
});

test("una FAQ sin consumidor se RECHAZA: una edicion que no hace nada es el fallo silencioso de siempre", () => {
  const verdict = validateKnowledge(valido({ faq: [{ id: "rubro-nuevo", body: "algo", status: "publicado" }] }));
  assert.equal(verdict.ok, false);
  assert.match(verdict.errors.join(" "), /faq\[0\]\.id: solo puede ser siat/);
});

test("tipos y rangos: el esquema no acepta basura aunque la clave exista", () => {
  const casos = [
    [{ empresa: { horario: { desde: "nueve" } } }, /desde: tiene que ser un numero entero/],
    [{ empresa: { horario: { dias: [1, 9] } } }, /dias\[1\]: fuera de rango/],
    [{ identity: { humanName: "" } }, /humanName: no puede estar vacio/],
    [{ triggersExtra: { demo: "agendame" } }, /demo: tiene que ser una lista/],
    [{ schema: "otra/9" }, /schema: tiene que ser exactamente/],
  ];
  for (const [intento, esperado] of casos) {
    const verdict = validateKnowledge({ ...valido(), ...intento });
    assert.equal(verdict.ok, false, `deberia rechazar: ${JSON.stringify(intento)}`);
    assert.match(verdict.errors.join(" "), esperado);
  }
});

test("sin `schema` no hay archivo: un JSON cualquiera no se toma por conocimiento del bot", () => {
  const verdict = validateKnowledge({ identity: { humanName: "Sergio" } });
  assert.equal(verdict.ok, false);
  assert.match(verdict.errors.join(" "), /schema: falta y es obligatorio/);
});

// ---------------------------------------------------------------------------
// 3. CACHE Y TTL — el refresco no corre en el camino de la respuesta
// ---------------------------------------------------------------------------

test("dentro del TTL el archivo se lee UNA sola vez (10 turnos = 1 lectura)", () => {
  let lecturas = 0;
  const readFileSync = () => {
    lecturas += 1;
    return JSON.stringify(valido());
  };
  const path = "/fake/knowledge.json";
  for (let i = 0; i < 10; i += 1) getKnowledge({ path, nowMs: NOW_MS + i * 1000, readFileSync });
  assert.equal(lecturas, 1, "releer en cada mensaje seria pagar disco en el camino de la respuesta");
});

test("vencido el TTL: devuelve la copia VIEJA al instante y refresca aparte (nunca bloquea el turno)", async () => {
  const path = "/fake/knowledge.json";
  getKnowledge({ path, nowMs: NOW_MS, readFileSync: () => JSON.stringify(valido({ version: "vieja" })) });

  let releyo = false;
  const readFile = async () => {
    releyo = true;
    return JSON.stringify(valido({ version: "nueva" }));
  };

  const durante = getKnowledge({ path, nowMs: NOW_MS + DEFAULT_TTL_MS, readFile });
  assert.equal(durante.data.version, "vieja", "el turno se contesta con lo que ya habia, sin esperar el disco");

  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(releyo, true);
  assert.equal(getKnowledge({ path, nowMs: NOW_MS + DEFAULT_TTL_MS }).data.version, "nueva");
});

test("cambiar de ruta no hereda lo de la ruta anterior", () => {
  getKnowledge({ path: "/fake/a.json", nowMs: NOW_MS, readFileSync: () => JSON.stringify(valido({ version: "a" })) });
  const otra = getKnowledge({
    path: "/fake/b.json",
    nowMs: NOW_MS,
    readFileSync: () => {
      const error = new Error("no existe");
      error.code = "ENOENT";
      throw error;
    },
  });
  assert.equal(otra.data, null);
  assert.equal(otra.source, "code");
});

// ---------------------------------------------------------------------------
// 4. DURACION DE LA DEMO — una sola fuente, y la contradiccion no puede volver
// ---------------------------------------------------------------------------

test("DURACION DE LA DEMO: los dos numeros coinciden (decidido 2026-08-06: 30 y 30)", () => {
  const hoy = demoDuration(DEFAULT_CONFIG);

  // Sergio decidio 30 y 30. Si alguien cambia uno de los dos numeros sin el otro, este assert
  // cae y lo obliga a tomar la decision en vez de dejar dos verdades sueltas — que es como
  // convivieron meses "15 minutos" en el guion y 45 en la agenda.
  assert.deepEqual(
    { minutos: hoy.minutos, fraseMinutos: hoy.fraseMinutos, pendiente: hoy.pendiente },
    { minutos: 30, fraseMinutos: 30, pendiente: false },
    "cambio la duracion: poné el MISMO número en duracionMinutos y duracionFrase, y actualizá este test",
  );
  assert.equal(hoy.coherente, true, "decidido y coherente: la invitacion dice lo mismo que el guion");

  // La regla dura: sin `pendiente` declarado, divergir es un fallo. Es lo que va a proteger el
  // dia que se tome la decision.
  const yaDecidido = createBotConfig({ demo: { ...DEMO, duracionFrase: "20 minutos", pendiente: false } });
  const roto = demoDuration(yaDecidido);
  assert.equal(roto.coherente, false);
  assert.equal(roto.pendiente, false, "una divergencia con la decision ya tomada no tiene excusa");
});

test("el guion NO puede volver a traer la duracion ni el horario escritos a mano", () => {
  for (const [key, texto] of Object.entries(SCRIPT)) {
    assert.ok(!/\d+\s*(?:minutos?|min\b|hs?\b|horas?)\b/i.test(texto), `${key} escribe una duracion a mano`);
    assert.ok(!/\d{1,2}:\d{2}/.test(texto), `${key} escribe un horario a mano`);
  }
});

// El horario del negocio es un RANGO, y un rango se valida CRUZANDO sus extremos. Hasta el
// 2026-09-18 `desde` y `hasta` se validaban por separado (`desde` 0..23, `hasta` 1..24) y nadie
// los comparaba nunca: un bar que declara 18 -> 02 pasaba, y el motor lo lee como
// `startHour: 18, endHour: 2`, o sea un rango VACIO — el bot contesta lo contrario de su horario
// las 24 h. La mitad hermana es peor porque no se ve: declarar UN solo extremo hereda el otro del
// base (`startHour: 9, endHour: 22`, los de Sergio Urcullo), asi que `desde: 23` solo tambien da
// un rango vacio y el documento ni siquiera trae el campo que lo delata.
test("el horario del negocio se valida CRUZANDO sus extremos, no de a uno", () => {
  const normal = validateKnowledge(valido({ empresa: { horario: { dias: [1, 2, 3, 4, 5], desde: 9, hasta: 18 } } }));
  assert.equal(normal.ok, true, "el horario corriente de un negocio tiene que seguir pasando");

  const cruzaMedianoche = validateKnowledge(valido({ empresa: { horario: { dias: [1], desde: 18, hasta: 2 } } }));
  assert.equal(cruzaMedianoche.ok, false, "18 -> 02 es un rango vacio para el motor: no se guarda");
  assert.match(cruzaMedianoche.errors.join(" "), /cierra antes de abrir|no atiende ninguna hora/);

  const vacio = validateKnowledge(valido({ empresa: { horario: { desde: 9, hasta: 9 } } }));
  assert.equal(vacio.ok, false, "abrir y cerrar a la misma hora no es un horario");

  // El hermano que no se ve: un solo extremo hereda el otro del base y produce el MISMO rango vacio.
  const soloDesde = validateKnowledge(valido({ empresa: { horario: { desde: 23 } } }));
  assert.equal(soloDesde.ok, false, "`desde: 23` solo hereda endHour 22 del base: rango vacio");
  assert.match(soloDesde.errors.join(" "), /van juntos/);

  const soloHasta = validateKnowledge(valido({ empresa: { horario: { hasta: 2 } } }));
  assert.equal(soloHasta.ok, false, "`hasta: 2` solo hereda startHour 9 del base: rango vacio");
  assert.match(soloHasta.errors.join(" "), /van juntos/);

  // Tocar SOLO los dias no declara ningun extremo: no es el sujeto de esta regla.
  const soloDias = validateKnowledge(valido({ empresa: { horario: { dias: [1, 2] } } }));
  assert.equal(soloDias.ok, true, "los dias se pueden tocar sin volver a declarar el rango");
});

test("la capa editable no puede CREAR la contradiccion: si toca la duracion, va entera y coherente", () => {
  const soloFrase = validateKnowledge(valido({ demo: { duracionFrase: "10 minutos" } }));
  assert.equal(soloFrase.ok, false);
  assert.match(soloFrase.errors.join(" "), /van juntos/);

  const divergente = validateKnowledge(valido({ demo: { duracionMinutos: 45, duracionFrase: "15 minutos" } }));
  assert.equal(divergente.ok, false);
  assert.match(divergente.errors.join(" "), /Poné el mismo número/);

  const coherente = validateKnowledge(valido({ demo: { duracionMinutos: 30, duracionFrase: "30 minutos" } }));
  assert.equal(coherente.ok, true, "decidir es poner el mismo numero en los dos, sin desplegar");
});

test("decidida en el JSON, la duracion alimenta el guion Y la reserva desde el mismo campo", () => {
  const config = conHorarios(applyKnowledge(DEFAULT_CONFIG, valido({ demo: { duracionMinutos: 30, duracionFrase: "30 minutos" } })));
  const result = step(createState({ channel: "sim", contactRef: "t" }), { text: "DEMO", receivedAt: T0 }, { config });
  assert.match(result.replies[0].text, /30 minutos por videollamada/, "lo que el prospecto lee");
  assert.equal(config.demo.duracionMinutos, 30, "lo que run-turn.mjs le pasa a Cal.com");
  assert.equal(config.demo.pendiente, false, "declarar la duracion completa cierra el pendiente");
});

// ---------------------------------------------------------------------------
// 5. APLICAR LOS HECHOS — que el dato editado llegue de verdad al mensaje
// ---------------------------------------------------------------------------

test("horario: cambia el texto del guion Y la ventana real, desde el mismo dato", () => {
  const config = applyKnowledge(
    DEFAULT_CONFIG,
    valido({ empresa: { horario: { dias: [1, 2, 3, 4, 5, 6], desde: 8, hasta: 20, frase: "lun-sáb, 8:00-20:00" } } }),
  );
  assert.deepEqual(config.businessHours.days, [1, 2, 3, 4, 5, 6]);
  assert.equal(config.businessHours.startHour, 8);

  const result = step(createState({ channel: "sim", contactRef: "t" }), { text: "quiero hablar con una persona", receivedAt: T0 }, { config });
  assert.match(result.replies[0].text, /lun-sáb, 8:00-20:00/, "el guion dice lo que la config hace");
});

// El test de arriba SIEMPRE pasa `frase`, asi que nunca ejercita el caso en que el dueno NO la
// escribe — y es el camino normal: en `/settings/chatbot` los dias y las horas son campos
// estructurados y la frase es un texto libre opcional (`ChatbotClient.tsx`: `if (form.frase.trim())`).
// Sin frase propia, `businessHours.frase` se heredaba del base, que son los horarios de ONIA, y esa
// frase es la que el bot PRONUNCIA: viaja a `{{horario_frase}}`, o sea a `R_HORARIO` ("Atendemos
// ..."), a la coletilla `M7` de fuera de horario y a los cuatro acuses de handoff. El bot del
// cliente DECIDIA con el rango del cliente y DECIA el horario de Sergio Urcullo.
test("el horario que el bot DICE sale del que declaro el dueno, no del de Onia", () => {
  const sinFrase = valido({ empresa: { horario: { dias: [1, 2, 3, 4, 5], desde: 8, hasta: 20 } } });
  const config = applyKnowledge(DEFAULT_CONFIG, sinFrase);

  assert.equal(config.businessHours.startHour, 8, "decide con el rango del dueno");
  assert.notEqual(
    config.businessHours.frase,
    DEFAULT_CONFIG.businessHours.frase,
    "la frase de Onia no puede quedar como la del cliente",
  );

  // Mismo disparador que el test de arriba: el acuse del handoff es el camino ya probado hasta
  // `{{horario_frase}}`. Preguntar "a que hora atienden" en el PRIMER turno cae en la bienvenida
  // y mediria el camino de contingencia, no la plantilla.
  const dicho = step(
    createState({ channel: "sim", contactRef: "t" }),
    { text: "quiero hablar con una persona", receivedAt: T0 },
    { config },
  )
    .replies.map((reply) => reply.text)
    .join("\n");

  assert.doesNotMatch(dicho, /14:00-17:00|20:00-22:00/, "no puede decir las franjas de Sergio Urcullo");
  assert.match(dicho, /8:00-20:00/, "dice el horario que el dueno declaro");
});

// La mitad hermana: declarar SOLO la frase dejaba vivas las `franjas` del base — las de Sergio
// Urcullo (lun-vie 14-17 y 20-22) —, que deciden POR ENCIMA del rango. El comentario de
// `applyKnowledge` ya decia que heredarlas "le cerraria el negocio al cliente a las 17:00 y se lo
// abriria a las 20:00"; su guarda miraba `dias`/`desde`/`hasta` y no `frase`.
test("quien declara su horario no se queda con las franjas de Onia, ni declarando solo la frase", () => {
  const config = applyKnowledge(
    DEFAULT_CONFIG,
    valido({ empresa: { horario: { frase: "todos los dias, 8:00 a 20:00" } } }),
  );
  assert.equal(config.businessHours.franjas, null, "las franjas de Sergio Urcullo no deciden en el bot de un cliente");
});

test("identidad: el nombre del humano y del producto salen del archivo", () => {
  const config = applyKnowledge(DEFAULT_CONFIG, valido({ identity: { humanName: "Leslie", productName: "Onia" } }));
  const result = step(createState({ channel: "sim", contactRef: "t" }), { text: "cuanto sale?", receivedAt: T0 }, { config });
  const texto = result.replies.map((reply) => reply.text).join("\n");
  assert.match(texto, /el número exacto se lo pasa Leslie en la demo/, "M4_BODY: el precio lo da un humano, y el humano sale del archivo");
});

test("FAQ del SIAT: reemplaza el cuerpo de M_SIAT_BODY, y vencida NO se sirve", () => {
  const faq = (vigenteHasta) =>
    valido({
      faq: [
        {
          id: "siat",
          title: "SIAT",
          body: "Sobre facturación en línea te contesto sólo lo que es público. El detalle lo ve {{humano}} en la demo.",
          status: "publicado",
          vigenteHasta,
        },
      ],
    });

  const vigente = applyKnowledge(DEFAULT_CONFIG, faq("2026-09-30"), { nowIso: T0 });
  assert.match(vigente.script.M_SIAT_BODY, /sólo lo que es público\. El detalle/);

  const vencida = applyKnowledge(DEFAULT_CONFIG, faq("2026-07-01"), { nowIso: T0 });
  assert.equal(vencida.script.M_SIAT_BODY, SCRIPT.M_SIAT_BODY, "una FAQ vieja que ya no es cierta no se dice");

  const borrador = applyKnowledge(DEFAULT_CONFIG, { ...faq(null), faq: [{ ...faq(null).faq[0], status: "borrador" }] }, { nowIso: T0 });
  assert.equal(borrador.script.M_SIAT_BODY, SCRIPT.M_SIAT_BODY, "un borrador no sale al aire");
});

test("disparadores: la capa editable AGREGA, nunca saca (union con el codigo)", () => {
  const config = applyKnowledge(DEFAULT_CONFIG, valido({ triggersExtra: { demo: ["quiero ver el sistema", "DEMO"] } }));
  for (const palabra of DEFAULT_CONFIG.triggers.demo) {
    assert.ok(config.triggers.demo.includes(palabra), `se perdio el disparador del codigo: ${palabra}`);
  }
  assert.ok(config.triggers.demo.includes("quiero ver el sistema"));
  assert.equal(new Set(config.triggers.demo).size, config.triggers.demo.length, "sin repetidos");
});

test("los hechos NO pisan los horarios que vinieron de Cal.com (se mergea sobre la config del turno)", () => {
  const delTurno = createBotConfig({
    slots: [{ key: "A", label: "jueves 15:00", startAt: "2026-07-30T19:00:00Z", pending: false }],
    dryRun: false,
  });
  const config = applyKnowledge(delTurno, valido({ identity: { humanName: "Leslie" } }));
  assert.equal(config.slots[0].label, "jueves 15:00");
  assert.equal(config.dryRun, false);
  assert.equal(config.identity.humanName, "Leslie");
});

// ---------------------------------------------------------------------------
// 6. EL ARCHIVO DE ARRANQUE Y LA COMPUERTA DE PUBLICACION
// ---------------------------------------------------------------------------

test("knowledge.example.json es valido y NO cambia una coma de lo que el bot dice hoy", () => {
  const leido = readKnowledgeFile(EJEMPLO);
  assert.equal(leido.error, null, `el ejemplo del repo no valida: ${leido.error}`);

  const config = applyKnowledge(DEFAULT_CONFIG, leido.data, { nowIso: T0 });
  for (const key of Object.keys(SCRIPT)) {
    assert.equal(config.script[key], SCRIPT[key], `${key} cambio: el arranque tiene que replicar produccion tal cual`);
  }
  assert.deepEqual(config.identity, DEFAULT_CONFIG.identity);
  assert.deepEqual(config.businessHours, DEFAULT_CONFIG.businessHours);
  assert.equal(config.demo, DEFAULT_CONFIG.demo, "el arranque NO decide la duracion: eso lo decide Sergio");
});

test("checkCli: devuelve 0 con el ejemplo, 1 y el motivo exacto con un archivo rechazado", async () => {
  assert.equal((await checkCli([EJEMPLO])).code, 0);

  await conArchivo(valido({ tarifas: { mensual: 790 } }), async (path) => {
    const salida = await checkCli([path]);
    assert.equal(salida.code, 1);
    assert.match(salida.lines.join("\n"), /RECHAZADO/);
    assert.match(salida.lines.join("\n"), /tarifas: clave desconocida/, "el editor tiene que ver QUE esta mal, no un 'error'");
  });

  await conArchivo(null, async (path) => {
    assert.equal((await checkCli([path])).code, 1, "un archivo que no existe no es una publicacion valida");
  });
});

test("/health dice de donde salio lo que el bot esta diciendo (si no, 'edite y no paso nada' tarda dias)", async () => {
  await conArchivo(valido({ version: "2026-08-06.9" }), async (path) => {
    const salud = await ensureKnowledgeHealth({ path, nowMs: NOW_MS });
    assert.equal(salud.source, "file");
    assert.equal(salud.version, "2026-08-06.9");
    assert.equal(salud.lastError, null);
    assert.equal(salud.path, path);
    assert.equal(salud.alcance, "proceso", "sin inbox se midio el proceso, y hay que decirlo");
  });
});

test("parseKnowledge no tira nunca, ni con un JSON hostil", () => {
  for (const raw of ["", "null", "[]", "1", '"texto"', "{}"]) {
    const result = parseKnowledge(raw);
    assert.equal(result.data, null);
    assert.ok(result.error, `${raw} tendria que dar un motivo legible`);
  }
});

// ---------------------------------------------------------------------------
// 5.bis SIN HORARIOS QUE OFRECER — la contingencia de Cal.com
// ---------------------------------------------------------------------------
// No hace falta que Cal.com se caiga: alcanza con que la agenda no tenga hueco en el rango. Antes,
// en ese caso, el PRIMER mensaje que veia todo prospecto decia "HORARIO A (pendiente de definir)"
// y encima no se podia elegir (detectSlotChoice descarta los `pending`): la conversacion moria ahi.

test("sin horarios reales el bot NO inventa ni muestra el placeholder: saluda y deriva", () => {
  // DEFAULT_CONFIG trae los placeholders — es exactamente el estado al que cae produccion si
  // Cal.com no devuelve nada (run-turn.mjs → resolveConfig).
  const result = step(createState({ channel: "sim", contactRef: "t" }), { text: "DEMO", receivedAt: T0 }, { config: DEFAULT_CONFIG });
  const texto = result.replies.map((reply) => reply.text).join("\n");

  assert.ok(!/pendiente de definir/i.test(texto), "el placeholder NUNCA puede llegarle al prospecto");
  assert.ok(!texto.includes("{{"), "ninguna variable sin resolver");
  assert.match(texto, /coordina uno personalmente/, "se le dice la verdad: el horario lo pone un humano");
  assert.match(texto, /a qué se dedica su negocio/, "y no se pierde la calificacion");

  // ESTA LINEA EXIGIA `handoff_humano` Y ERA EL BLINDAJE DEL BUG. Verificaba que el mensaje fuera
  // correcto y nunca que la conversacion pudiera seguir. Derivar a un humano es correcto —los dos
  // efectos de abajo lo hacen— pero `handoff_humano` ademas MATA al bot: es la barrera que
  // devuelve cero respuestas para siempre (barrera 1 de step()). Como los slots nunca se
  // definieron, TODA conversacion caia ahi: el bot saludaba y no volvia a hablar. Cinco personas
  // escribieron entre el 24 y el 29 de agosto; a cuatro no les contesto nadie. El test quedaba
  // verde igual. `esperando_horario` deriva IGUAL y sigue calificando; lo prueba el test de
  // abajo, que es el que mira el segundo turno.
  assert.equal(result.nextState.botStage, "esperando_horario", "deriva al humano SIN quedarse mudo: handoff_humano no responde nunca mas");
  assert.ok(result.notes.includes("sin_horarios_que_ofrecer"));
  const tipos = result.sideEffects.map((effect) => effect.type);
  assert.ok(tipos.includes("lead_upsert"), "el lead nace igual: el prospecto no se pierde");
  assert.ok(tipos.includes("notify_sergio"), "y Sergio se entera de que tiene que proponer hora");
});

// EL SEGUNDO TURNO ES EL QUE PAGA. El test de arriba miraba el mensaje de bienvenida, y por eso
// estuvo VERDE toda la semana en que el bot saludaba y se callaba: `handoff_humano` es la barrera
// que hace que step() devuelva CERO respuestas para siempre (bot-engine.mjs, case "handoff_humano").
// Como los slots de config.mjs siguen en "pendiente de definir", CADA conversacion caia ahi.
// Medido el 2026-09-02 en la base de produccion: de las conversaciones de personas reales desde el
// 24-ago, ninguna recibio jamas una SEGUNDA respuesta. Un test que solo mira el primer mensaje no
// ve un sistema que muere en el segundo.
test("sin horarios el bot sigue vivo en el SEGUNDO mensaje: contesta al que cuenta su negocio", () => {
  const bienvenida = step(createState({ channel: "sim", contactRef: "t" }), { text: "DEMO", receivedAt: T0 }, { config: DEFAULT_CONFIG });
  assert.equal(bienvenida.replies.length, 1, "saluda");

  const segundo = step(
    bienvenida.nextState,
    { text: "Tengo una clinica dental en Santa Cruz, somos 4 personas", receivedAt: "2026-07-27T14:06:00Z" },
    { config: DEFAULT_CONFIG },
  );

  assert.ok(segundo.replies.length > 0, "el bot NO puede quedarse mudo en el segundo mensaje");
  const texto = segundo.replies.map((reply) => reply.text).join("\n");
  assert.ok(!/pendiente de definir/i.test(texto), "el placeholder NUNCA puede llegarle al prospecto");
  assert.ok(!texto.includes("{{"), "ninguna variable sin resolver");
  assert.match(texto, /odontolog/i, "acusa recibo del dato que dio, no lo vuelve a preguntar");
  assert.ok(!segundo.notes.includes("silencio:handoff_en_curso"), "el silencio del handoff es exactamente el bug");

  // TERCER turno: un bot que contesta una vez mas y se apaga tampoco sirve. El silencio se podia
  // haber corrido un turno en vez de arreglarse, y solo un tercer mensaje lo distingue.
  const tercero = step(
    segundo.nextState,
    { text: "atendemos de 9 a 19", receivedAt: "2026-07-27T14:12:00Z" },
    { config: DEFAULT_CONFIG },
  );
  assert.ok(tercero.replies.length >= 1, "y sigue contestando, no se agota en un turno");
  // ESTA LINEA FALTABA Y ES POR LO QUE EL PLACEHOLDER LLEGO A PRODUCCION. El tercer turno YA
  // estaba cubierto, pero solo por "¿habla?" — nunca por "¿que dice?". Los dos turnos de arriba
  // si miran el texto; este no, y el agujero quedo justo donde el guion cae a `pendingAsk`.
  const textoTercero = tercero.replies.map((reply) => reply.text).join("\n");
  assert.ok(!/pendiente de definir/i.test(textoTercero), "el placeholder NUNCA puede llegarle al prospecto");
});

// ---------------------------------------------------------------------------
// 5.ter LA RE-PREGUNTA — el agujero por donde el placeholder SI salio a produccion
// ---------------------------------------------------------------------------
// Medido el 2026-09-03 en la base de produccion (conv 49, mensajes de 21:09 y 23:03 UTC): el bot
// le dijo a una conversacion "¿En que horario te viene mejor que te reserve, horario A o horario
// B?" y "en la opcion A o en la B". Ninguno de los dos es el literal, asi que las guardas de
// arriba —que buscan "pendiente de definir"— los dejaron pasar enteros.
//
// El camino es este: `welcomeResult` marca `slotsOffered: []` (no se ofrecio NINGUN horario), pero
// `activeSlots` cae a `config.slots` cuando el array esta vacio — un fallback DELIBERADO, que
// followUpTemplate documenta y necesita — asi que `pendingAsk` recibia los placeholders de
// config.mjs y renderizaba PENDING_HORARIO: "¿Te reservo **{{slot_a}}** o **{{slot_b}}**?".
//
// Y `pendingAsk` no se dice solo: bot-engine.mjs lo pega al final de la respuesta determinista
// (linea ~440) Y se lo pasa al LLM como `pendingQuestion` (linea ~786). Eso ultimo es lo que
// produjo la PARAFRASIS: el modelo recibio los dos labels y los reescribio como "horario A o B".
// Por eso el arreglo va en `pendingAsk` y no en la plantilla: es el unico punto que tapa las dos.
// Y la señal es el flag `pending` de cada slot, no el array vacio: cubre los dos caminos sin
// mover `activeSlots`, que comparte una ruta de plantillas PAGAS.
test("sin horarios la RE-PREGUNTA no ofrece elegir: ni el literal ni una parafrasis", () => {
  // El estado EXACTO al que welcomeResult manda a toda conversacion sin horarios definidos.
  const state = { botStage: "esperando_horario", slotsOffered: [], qualification: {} };

  // El fallback sigue vivo a proposito: lo que NO puede pasar es que esos placeholders se digan.
  assert.ok(
    activeSlots(state, DEFAULT_CONFIG).every((slot) => slot.pending),
    "sin horarios definidos, todo lo que activeSlots devuelve es placeholder",
  );

  const ask = pendingAsk(state, DEFAULT_CONFIG);
  assert.ok(ask, "sigue habiendo una pregunta pendiente: el embudo no se apaga");
  assert.ok(!/pendiente de definir/i.test(ask), "el placeholder NUNCA puede llegarle al prospecto");
  assert.ok(!ask.includes("{{"), "ninguna variable sin resolver");
  // La parafrasis del LLM nace de que el texto le OFRECE elegir entre dos cosas sin nombre. Si la
  // re-pregunta no plantea una eleccion, no hay nada que parafrasear.
  assert.ok(!/\bhorario a\b|\bopci[oó]n a\b|\bA\)/i.test(ask), "no puede ofrecer 'horario A' / 'opcion A': para el prospecto no significa nada");
  assert.match(ask, /coordina/i, "dice la verdad: la hora la pone un humano");

  // Con horarios REALES la re-pregunta de siempre no cambia.
  const conReales = { ...state, slotsOffered: conHorarios(DEFAULT_CONFIG).slots };
  assert.match(pendingAsk(conReales, DEFAULT_CONFIG), /jueves 15:00/, "con horarios reales se sigue ofreciendo elegir");
});

test("con horarios reales el guion normal no cambia ni una coma", () => {
  const result = step(createState({ channel: "sim", contactRef: "t" }), { text: "DEMO", receivedAt: T0 }, { config: conHorarios(DEFAULT_CONFIG) });
  const texto = result.replies.map((reply) => reply.text).join("\n");
  assert.match(texto, /jueves 15:00/);
  assert.equal(result.nextState.botStage, "esperando_horario");
  assert.ok(!result.notes.includes("sin_horarios_que_ofrecer"));
});

// ---------------------------------------------------------------------------
// 6. EL LEXICO DE RUBROS — agregar un rubro SIN desplegar
// ---------------------------------------------------------------------------
// No se prueba "el JSON se lee". Se prueba que un rubro nuevo CLASIFIQUE de verdad (si no, es una
// edicion que parece publicada y no hace nada), que no pueda pisar a los del codigo, y que una
// lista de palabras mala se frene ANTES de produccion.

const FUNERARIA = Object.freeze({
  key: "funeraria",
  label: "servicios funerarios",
  fuerte: ["funeraria", "velatorio", "sala de velacion"],
});

/** La config que tendria el bot si alguien edita el archivo del VPS y no despliega nada. */
function conRubros(rubros) {
  return applyKnowledge(DEFAULT_CONFIG, valido({ rubrosExtra: rubros }));
}

test("un rubro NUEVO del archivo clasifica y el bot lo sabe nombrar — sin desplegar nada", () => {
  const texto = normalize("hola, tengo una funeraria en santa cruz");
  assert.equal(findIndustry(texto), null, "sin archivo el codigo no conoce el rubro: es lo que hace honesta a la prueba");

  const config = conRubros([FUNERARIA]);
  assert.equal(findIndustry(texto, config), "funeraria");
  assert.equal(industryLabel("funeraria", config), "servicios funerarios");
});

test("PUNTA A PUNTA: el rubro editable llega hasta lo que el prospecto LEE", () => {
  const estado = createState({ channel: "sim", contactRef: "t", botStage: "demo_agendada" });
  const mensaje = { text: "tengo una funeraria, somos 4, en santa cruz", receivedAt: T0 };

  const conCodigo = step(estado, mensaje, { config: DEFAULT_CONFIG });
  assert.equal(conCodigo.nextState.qualification.industry, undefined, "hoy el bot no sabe que es una funeraria");

  const result = step(estado, mensaje, { config: conRubros([FUNERARIA]) });
  assert.equal(result.nextState.qualification.industry, "funeraria", "el dato queda en el CRM con su propia key");
  const texto = result.replies.map((reply) => reply.text).join("\n");
  assert.match(texto, /servicios funerarios/, "y el bot se lo repite con la etiqueta que puso el que edito");
  assert.ok(!texto.includes("{{"), "ninguna variable puede quedar sin resolver a la vista del prospecto");
});

test("el archivo no le roba un match a una palabra FUERTE del codigo (el orden es el candado)", () => {
  const config = conRubros([{ key: "salon_eventos", label: "salón de eventos", fuerte: ["clinica dental", "dentista"] }]);
  assert.equal(findIndustry(normalize("tengo una clinica dental"), config), "dental");
  assert.equal(findIndustry(normalize("soy dentista"), config), "dental");
});

test("para una key que ya existe el archivo SUMA palabras: nunca reemplaza el lexico del codigo", () => {
  const config = conRubros([{ key: "comercio", label: "comercio", fuerte: ["botilleria", "bodega"] }]);
  assert.equal(findIndustry(normalize("tengo una botilleria"), config), "comercio", "la palabra nueva entra");
  assert.equal(findIndustry(normalize("tengo una ferreteria"), config), "comercio", "y la del codigo sigue viva");
  assert.equal(findIndustry(normalize("soy dentista"), config), "dental", "editar un rubro no toca a los otros");
});

test("las palabras son TEXTO, no regex: se escapan (una regex mala mata el matcher o cuelga el proceso)", () => {
  const config = conRubros([{ key: "rara", label: "rara", fuerte: ["a.*z", "(uno|dos)"] }]);
  assert.equal(findIndustry(normalize("tengo abcz aca"), config), null, "'a.*z' no puede portarse como comodin");
  assert.equal(findIndustry(normalize("tengo uno"), config), null, "los parentesis no abren un grupo");
  assert.equal(findIndustry(normalize("esto es un a.*z"), config), "rara", "la palabra literal si matchea");
});

test("el validador frena el lexico que no sirve, el que clasifica de mas y el que promete", () => {
  const casos = [
    [{ key: "vacio", label: "vacío", fuerte: [] }, /nunca lo va a leer/, "un rubro sin palabras no hace nada"],
    [{ key: "corto", label: "corto", fuerte: ["ok"] }, /es muy corta/, "2 letras se cuelan en medio diccionario"],
    [{ key: "Mayuscula", label: "x", fuerte: ["funeraria"] }, /business_type/, "la key va al CRM"],
    [{ key: "caro", label: "desde 790 Bs", fuerte: ["funeraria"] }, /declara_precio/, "el bot no cotiza, ni en una etiqueta"],
    [{ key: "extra", label: "x", fuerte: ["funeraria"], moduloListo: true }, /clave desconocida/, "prometer un modulo es un commit"],
    [{ key: "sinlabel", fuerte: ["funeraria"] }, /falta y es obligatorio/, "sin etiqueta el guion no lo puede nombrar"],
  ];
  for (const [rubro, esperado, porque] of casos) {
    const verdict = validateKnowledge(valido({ rubrosExtra: [rubro] }));
    assert.equal(verdict.ok, false, porque);
    assert.match(verdict.errors.join(" · "), esperado, porque);
  }

  const dup = validateKnowledge(valido({ rubrosExtra: [FUNERARIA, { ...FUNERARIA, label: "otra cosa" }] }));
  assert.equal(dup.ok, false, "la misma key dos veces es una contradiccion, no una edicion");
  assert.match(dup.errors.join(" · "), /esta dos veces/);
});

test("COMPUERTA DEL BANCO: un lexico que rompe la clasificacion no se publica (y uno sano si)", async () => {
  await conArchivo(valido({ rubrosExtra: [FUNERARIA] }), async (path) => {
    const salida = await checkCli([path]);
    assert.equal(salida.code, 0, salida.lines.join("\n"));
    assert.match(salida.lines.join("\n"), /banco OK/);
  });

  // "hola" y "buenas" abren media conversacion del banco: el bot guardaria un rubro que el
  // prospecto nunca dijo. Eso es un dato INVENTADO — el fallo mas caro que mide el banco, y el que
  // no se ve leyendo el JSON.
  await conArchivo(valido({ rubrosExtra: [{ key: "saludo", label: "saludo", fuerte: ["hola", "buenas"] }] }), async (path) => {
    const salida = await checkCli([path]);
    assert.equal(salida.code, 1, "un lexico que hace bajar el banco NO puede publicarse");
    assert.match(salida.lines.join("\n"), /el banco BAJA/);
  });
});

// ---------------------------------------------------------------------------
// 7. EL CATALOGO — que vendemos, sin desplegar
// ---------------------------------------------------------------------------
// El problema real: un producto nuevo tardaba un deploy en existir para el bot. Lo que NO puede
// pasar es que la misma edicion que agrega un producto pueda declararlo terminado — eso es
// prometer una feature (N2), y esa llave se queda en el codigo.

const CATALOGO_NUEVO = Object.freeze([
  Object.freeze({ key: "dental", nombre: "Dental", queResuelve: "agenda, recordatorios y cobros de una clínica" }),
  Object.freeze({ key: "veterinaria", nombre: "Veterinaria", queResuelve: "fichas, vacunas y recordatorios" }),
]);

/** Lo que el prospecto LEE cuando pregunta que hacemos. */
function respuestaCatalogo(config) {
  const estado = createState({ channel: "sim", contactRef: "t", botStage: "demo_agendada" });
  const result = step(estado, { text: "y que hacen exactamente?", receivedAt: T0 }, { config });
  return { texto: result.replies.map((reply) => reply.text).join("\n"), notes: result.notes };
}

test("'¿que hacen?' se contesta con el catalogo (no con un humano) y el embudo sigue", () => {
  const { texto, notes } = respuestaCatalogo(DEFAULT_CONFIG);
  assert.ok(notes.includes("pregunta_que_hacemos"), "tiene su propia rama, no cae en el LLM ni en handoff");
  assert.match(texto, /Dental/, "nombra lo que SI esta armado");
  // Hasta el 2026-09-05 esta linea exigia "en construcción, sin humo" — "la misma verdad que la
  // web publica". Las dos mitades quedaron falsas: la web no dice eso en ninguna pantalla, y la
  // regla de Sergio del 2026-08-20 prohibe estado de obra en toda superficie que ve un cliente.
  // Lo que no esta listo ya no se nombra, asi que lo que se exige ahora es el silencio.
  assert.ok(!/en construcci[oó]n|sin humo/.test(texto), "no se le muestra obra a un prospecto");
  assert.match(texto, /me falta/, "contestar no puede costar la calificacion: el embudo sigue");
  assert.ok(!texto.includes("{{"), "ninguna variable puede quedar sin resolver a la vista del prospecto");
});

test("un SERVICIO nuevo aparece con solo editar el JSON — sin desplegar", () => {
  // Esta prueba pedia lo mismo con un MODULO (Veterinaria) y dejo de ser cierto el 2026-09-05:
  // un modulo sumado por edicion ya no se nombra, porque las tres reglas juntas no dejan otra
  // salida — no se puede declarar armado (es promesa comercial, va por codigo) y tampoco se lo
  // puede anunciar como obra (regla de Sergio 2026-08-20). El valor que el test protege sigue
  // vivo donde de verdad estaba: los SERVICIOS, que son trabajo que Onia ya entrega, entran el
  // mismo dia y sin deploy.
  const nuevo = Object.freeze({ key: "fotos", tipo: "servicio", nombre: "fotos de producto con IA" });
  assert.ok(!respuestaCatalogo(DEFAULT_CONFIG).texto.includes("fotos de producto"), "hoy no lo conoce");
  const config = applyKnowledge(DEFAULT_CONFIG, valido({ productos: [...CATALOGO_NUEVO, nuevo] }));
  const { texto } = respuestaCatalogo(config);
  assert.match(texto, /fotos de producto con IA/, "el servicio nuevo se ofrece sin desplegar");
  assert.ok(!/Veterinaria/.test(texto), "y el modulo de la misma edicion sigue sin nombrarse");
});

test("CANDADO: el archivo puede sumar un producto pero NUNCA declararlo terminado", () => {
  const config = applyKnowledge(DEFAULT_CONFIG, valido({ productos: CATALOGO_NUEVO }));
  const { texto } = respuestaCatalogo(config);
  assert.match(texto, /• \*Dental\*/, "el que SI esta armado se nombra como tal");
  // El candado se ENDURECIO el 2026-09-05: antes el modulo editado entraba como "en
  // construcción", que lo declaraba no-terminado pero igual lo NOMBRABA — y nombrar obra es lo
  // que la regla de Sergio prohibe. Ahora directamente no aparece. Sigue siendo el mismo
  // invariante (una edicion no puede declarar armado un modulo) y ademas no exhibe obra.
  assert.ok(!/Veterinaria/.test(texto), "un modulo sumado por edicion no se nombra: no esta armado");
  assert.ok(!/en construcci[oó]n/.test(texto), "y no se lo anuncia como obra");

  // Y no hay ni donde intentarlo: el esquema no tiene el campo.
  for (const intento of [{ listo: true }, { moduloListo: true }, { estado: "listo" }, { precio: 390 }]) {
    const verdict = validateKnowledge(valido({ productos: [{ ...CATALOGO_NUEVO[1], ...intento }] }));
    assert.equal(verdict.ok, false, `${JSON.stringify(intento)} tendria que rechazarse`);
    assert.match(verdict.errors.join(" · "), /clave desconocida/);
  }
});

test("los SERVICIOS que ya entregamos no pueden salir como 'en construcción'", () => {
  const { texto } = respuestaCatalogo(DEFAULT_CONFIG);
  // La web y el chatbot se venden HOY (lib/pricing.ts → ADDONS y las propuestas reales).
  // Meterlos en la bolsa de "en construcción" seria mentir para el otro lado: regala lo unico
  // que ya se puede cerrar sin esperar a que un modulo este armado.
  const [enCamino] = texto.match(/^• .*en construcción.*$/m) || [""];
  for (const servicio of ["web", "chatbot", "videos", "redes", "automatizaciones"]) {
    assert.ok(!enCamino.includes(servicio), `"${servicio}" quedo listado como en construcción`);
  }
  // El chatbot ya no dice "con IA" (2026-09-30): el que se entrega atiende sin LLM
  // (recepcionista.mjs, regla 4). Ver que-hacen-a-una-clinica.test.mjs.
  assert.match(texto, /Y además hacemos .*chatbot de WhatsApp.*videos e influencers con IA/);
});

test("un catalogo SIN servicios no deja un 'Y además hacemos .' colgando", () => {
  const config = applyKnowledge(DEFAULT_CONFIG, valido({ productos: CATALOGO_NUEVO }));
  const { texto } = respuestaCatalogo(config);
  assert.ok(!/Y además hacemos\s*\./.test(texto), "la frase se arma entera o no se arma");
  assert.ok(!texto.includes("{{"));
});

test("un servicio no necesita `queResuelve`; un módulo sí (si no, la viñeta no dice nada)", () => {
  const servicio = validateKnowledge(valido({ productos: [{ key: "web", tipo: "servicio", nombre: "la web de tu negocio" }] }));
  assert.equal(servicio.ok, true, servicio.errors.join(" · "));

  const modulo = validateKnowledge(valido({ productos: [{ key: "veterinaria", nombre: "Veterinaria" }] }));
  assert.equal(modulo.ok, false);
  assert.match(modulo.errors.join(" · "), /qué resuelve/);
});

test("el catalogo tampoco puede cotizar: el guardrail vale para cada producto", () => {
  const verdict = validateKnowledge(
    valido({ productos: [{ key: "dental", nombre: "Dental", queResuelve: "todo por 390 Bs al mes" }] }),
  );
  assert.equal(verdict.ok, false);
  assert.match(verdict.errors.join(" · "), /declara_precio/);
});

test("una pregunta MAS especifica le gana al catalogo (el orden del router se sostiene)", () => {
  const estado = createState({ channel: "sim", contactRef: "t", botStage: "demo_agendada" });
  const casos = [
    ["que hacen? y cuanto cuesta?", "pregunta_precio"],
    ["que servicios tienen para la factura del siat?", "pregunta_siat"],
    ["que hacen si no puedo entrar al sistema de ustedes?", "handoff"],
  ];
  for (const [texto, esperado] of casos) {
    const result = step(estado, { text: texto, receivedAt: T0 }, { config: DEFAULT_CONFIG });
    assert.ok(
      result.notes.some((note) => note.includes(esperado)),
      `"${texto}" tendria que rutear a ${esperado}, no al catalogo (dio: ${result.notes.join(",")})`,
    );
  }
});

test("renderTemplate sigue siendo el ultimo paso: los {{ }} del conocimiento se resuelven en el guion", () => {
  const config = applyKnowledge(
    DEFAULT_CONFIG,
    valido({ faq: [{ id: "siat", body: "Eso lo ve {{humano}} en la demo.", status: "publicado", vigenteHasta: null }] }),
  );
  assert.match(config.script.M_SIAT_BODY, /\{\{humano\}\}/, "el texto guardado conserva la variable");
  assert.match(renderTemplate(config.script.M_SIAT_BODY, { humano: "Sergio" }), /Sergio en la demo/);
});

// ---------------------------------------------------------------------------
// FUENTE "DB" (paso b): la fila publicada POR ORGANIZACION, via HTTP al producto
// ---------------------------------------------------------------------------
// Lo que se prueba es el mismo contrato que el archivo, pero con red en el medio:
// nunca tira, degrada a archivo/codigo, valida TODO O NADA, y el fetch roto no
// borra la ultima copia buena de la org.

const ORG = "org_ferreteria";

/**
 * Un fetch falso que contesta como el endpoint /published del producto.
 * `orgSlug` es la agenda publica de esa org: el producto lo manda SOLO si la org de verdad
 * puede recibir reservas, y sin el el bot deriva la cita a un humano (fail-closed).
 */
function fetchFalso(doc, { status = 200, fallar = false, orgSlug = undefined } = {}) {
  const fn = async (url, init) => {
    fn.calls.push({ url, init });
    if (fallar) throw new Error("red caida");
    return {
      ok: status >= 200 && status < 300,
      status,
      json: async () => ({ data: doc, version: 1, updatedBy: "test", ...(orgSlug === undefined ? {} : { orgSlug }) }),
    };
  };
  fn.calls = [];
  return fn;
}

const DB_OPTS = { dbUrl: "http://producto/api/chatbot-knowledge/published", dbSecret: "s3cr3t" };

test("db: la fila publicada de la org se aplica, source dice 'db' y el Bearer viaja", async () => {
  const doc = valido({ identity: { productName: "ZZ QA Ferreteria Tornillo" } });
  const fetch = fetchFalso(doc);
  const state = await getOrgKnowledge(ORG, { ...DB_OPTS, fetch });
  assert.equal(state.source, "db");
  assert.match(fetch.calls[0].url, /organizationId=org_ferreteria/);
  assert.equal(fetch.calls[0].init.headers.authorization, "Bearer s3cr3t");
  const config = applyKnowledge(createBotConfig(), state.data);
  assert.equal(config.identity.productName, "ZZ QA Ferreteria Tornillo");
});

test("db: dentro del TTL NO se vuelve a pedir (la red no esta en el camino de la respuesta)", async () => {
  const fetch = fetchFalso(valido());
  await getOrgKnowledge(ORG, { ...DB_OPTS, fetch, nowMs: NOW_MS });
  await getOrgKnowledge(ORG, { ...DB_OPTS, fetch, nowMs: NOW_MS + 1000 });
  assert.equal(fetch.calls.length, 1);
});

test("db: sin URL o sin secreto la fuente esta APAGADA y se sigue con el archivo/codigo", async () => {
  const state = await getOrgKnowledge(ORG, { fetch: fetchFalso(valido()), dbUrl: "", dbSecret: "" });
  assert.equal(state.source, "code");
  assert.equal(state.error, null, "apagado no es un error que gritar");
});

test("db: red caida, HTTP roto o 404 degradan a codigo SIN tirar", async () => {
  for (const opts of [
    { fetch: fetchFalso(null, { fallar: true }) },
    { fetch: fetchFalso(null, { status: 500 }) },
    { fetch: fetchFalso(null, { status: 404 }) },
  ]) {
    resetOrgKnowledgeCache();
    const state = await getOrgKnowledge(ORG, { ...DB_OPTS, ...opts });
    assert.equal(state.data, null);
    assert.equal(state.source, "code");
  }
});

test("db: un documento con precio se rechaza ENTERO — el mismo candado que el archivo", async () => {
  const doc = valido({ productos: [{ key: "dental", nombre: "Dental", queResuelve: "todo por 390 Bs" }] });
  const state = await getOrgKnowledge(ORG, { ...DB_OPTS, fetch: fetchFalso(doc) });
  assert.equal(state.data, null, "ni un campo del documento entra");
});

test("db: un fetch roto CONSERVA la ultima copia buena de la org (no la borra)", async () => {
  const bueno = fetchFalso(valido({ identity: { productName: "Ferreteria" } }));
  await getOrgKnowledge(ORG, { ...DB_OPTS, fetch: bueno, nowMs: NOW_MS });
  const state = await getOrgKnowledge(ORG, {
    ...DB_OPTS,
    fetch: fetchFalso(null, { fallar: true }),
    nowMs: NOW_MS + DEFAULT_TTL_MS + 1,
  });
  assert.equal(state.source, "db");
  assert.equal(state.data.identity.productName, "Ferreteria");
});

// --- keying por INBOX: la conversacion real trae inbox, no organizationId ---

test("db: keying por inbox — el fetch va con ?inboxId= y el producto resuelve la org", async () => {
  const doc = valido({ identity: { productName: "ZZ QA Ferreteria Tornillo" } });
  const fetch = fetchFalso(doc);
  const state = await ensureKnowledge({ ...DB_OPTS, fetch, inboxId: "6" });
  assert.equal(state.source, "db");
  assert.match(fetch.calls[0].url, /inboxId=6/);
  assert.doesNotMatch(fetch.calls[0].url, /organizationId=/, "el motor NO conoce la org: la resuelve el producto");
  // y la copia queda cacheada para el camino SINCRONICO del turno:
  const sync = getKnowledge({ ...DB_OPTS, fetch, inboxId: "6", nowMs: NOW_MS });
  assert.equal(sync.source, "db");
  assert.equal(sync.data.identity.productName, "ZZ QA Ferreteria Tornillo");
});

test("db: organizationId explicito le gana al inbox (misma regla que el endpoint)", async () => {
  const fetch = fetchFalso(valido());
  await ensureKnowledge({ ...DB_OPTS, fetch, organizationId: ORG, inboxId: "6" });
  assert.match(fetch.calls[0].url, /organizationId=org_ferreteria/);
  assert.doesNotMatch(fetch.calls[0].url, /inboxId=/);
});

test("db: ensureKnowledge espera la red SOLO con la cache fria; despues es getKnowledge", async () => {
  const fetch = fetchFalso(valido({ identity: { productName: "Ferreteria" } }));
  // 1a vez (fria): espera UNA lectura y ya sirve la copia db — el primer mensaje del
  // cliente no puede salir con la cara de Onia.
  const primera = await ensureKnowledge({ ...DB_OPTS, fetch, inboxId: "6", nowMs: NOW_MS });
  assert.equal(primera.source, "db");
  assert.equal(fetch.calls.length, 1);
  // 2a vez (caliente, TTL vencido): NO espera — sirve la copia vieja ya y refresca aparte.
  const segunda = await ensureKnowledge({ ...DB_OPTS, fetch, inboxId: "6", nowMs: NOW_MS + DEFAULT_TTL_MS + 1 });
  assert.equal(segunda.data.identity.productName, "Ferreteria", "la copia vieja sale YA");
});

test("db: inbox sin org (404) degrada a archivo/codigo y NO vuelve a esperar red en el turno siguiente", async () => {
  const fetch = fetchFalso(null, { status: 404 });
  // `path` inexistente a proposito: en el VPS SI existe knowledge.json al lado y la degradacion
  // seria a "file" — lo que se prueba aca es que la fuente db no aporta nada, no que archivo haya.
  const opts = { ...DB_OPTS, fetch, inboxId: "99", path: "/no/existe/knowledge.json" };
  const state = await ensureKnowledge({ ...opts, nowMs: NOW_MS });
  assert.equal(state.source, "code", "sin fila y sin archivo no queda documento: el motor usa su config");
  // OJO: esto NO dice "y entonces vende Onia". Eso era lo que decia hasta el 2026-09-13 y era el
  // bug — ver el caso "panel: un inbox HUERFANO (404) no come del panel global". Un 404 sobre un
  // inbox se DECLARA huerfano y `withKnowledge` lo degrada a recepcionista neutro.
  assert.equal(state.huerfano, true, "404 sobre un inbox = no es de ninguna org, y se declara");
  assert.equal(state.error ?? null, null, "404 no es un error que gritar");
  await ensureKnowledge({ ...opts, nowMs: NOW_MS + 1000 });
  assert.equal(fetch.calls.length, 1, "el intento fallido tambien deja huella: una sola espera por proceso");
});

test("db: getKnowledge (sincronico) sirve la copia db ya cacheada sin esperar red", async () => {
  await getOrgKnowledge(ORG, { ...DB_OPTS, fetch: fetchFalso(valido({ identity: { productName: "Ferreteria" } })), nowMs: NOW_MS });
  const state = getKnowledge({ organizationId: ORG, nowMs: NOW_MS + 1000 });
  assert.equal(state.source, "db");
  // y sin copia todavia, cae al archivo/codigo de siempre (jamas espera):
  resetOrgKnowledgeCache();
  assert.equal(getKnowledge({ organizationId: "org_sin_cache", dbUrl: "", dbSecret: "" }).source, "code");
});

test("db: withKnowledge con fuente db enciende el MODO RECEPCIONISTA — y solo con fuente db", async () => {
  const doc = valido({ identity: { productName: "ZZ QA Ferreteria Tornillo", humanName: "Marta" } });
  await getOrgKnowledge("org_modo_recep", { ...DB_OPTS, fetch: fetchFalso(doc), nowMs: NOW_MS });
  const config = withKnowledge(DEFAULT_CONFIG, { organizationId: "org_modo_recep", nowMs: NOW_MS + 1000 });
  assert.equal(config.modo, "recepcionista", "org cliente = el bot del negocio, no el funnel de Onia");
  assert.equal(config.conocimiento.identity.productName, "ZZ QA Ferreteria Tornillo");
  // ... y el turno entero ya contesta como recepcionista, no con el pitch de venta:
  const result = step(createState(), { text: "hola", receivedAt: T0 }, { config });
  assert.equal(result.replies[0].templateKey, "M0R");
  assert.doesNotMatch(result.replies[0].text, /plataforma por módulos/i);

  // Fuente archivo/codigo (la cara de Onia): NADA de modo — el funnel de venta sigue intacto.
  resetOrgKnowledgeCache();
  resetKnowledgeCache();
  const deOnia = withKnowledge(DEFAULT_CONFIG, { path: "/no/existe/knowledge.json" });
  assert.equal(deOnia.modo, undefined);
});

// El CABLE entero, de punta a punta: /published manda `orgSlug` -> la cache lo guarda ->
// withKnowledge lo baja a la config -> el turno contesta con el link de reserva de ESA org.
// Sin este test, el dia que el producto deje de mandar el campo (o alguien lo renombre) el bot
// vuelve a derivar TODA cita y nadie se entera: exactamente el fallo silencioso que esta capa
// existe para evitar.
test("db: con orgSlug el bot AGENDA (manda el link de la org); sin orgSlug deriva a un humano", async () => {
  const doc = valido({ identity: { productName: "ZZ QA Ferreteria Tornillo", humanName: "Marta" } });

  resetOrgKnowledgeCache();
  await getOrgKnowledge("org_con_agenda", {
    ...DB_OPTS,
    fetch: fetchFalso(doc, { orgSlug: "zz-qa-ferreteria-ab123" }),
    nowMs: NOW_MS,
  });
  const conAgenda = withKnowledge(DEFAULT_CONFIG, { organizationId: "org_con_agenda", nowMs: NOW_MS + 1000 });
  assert.equal(conAgenda.orgSlug, "zz-qa-ferreteria-ab123", "el slug baja del endpoint a la config");
  const reserva = step(createState(), { text: "quiero agendar una cita", receivedAt: T0 }, { config: conAgenda });
  assert.equal(reserva.replies.at(-1).templateKey, "R_AGENDA");
  assert.match(reserva.replies.at(-1).text, /https:\/\/app\.onia\.com\.bo\/book\/zz-qa-ferreteria-ab123/);

  // Sin el campo (org sin agenda publica, o producto viejo): el handoff de siempre.
  resetOrgKnowledgeCache();
  await getOrgKnowledge("org_sin_agenda", { ...DB_OPTS, fetch: fetchFalso(doc), nowMs: NOW_MS });
  const sinAgenda = withKnowledge(DEFAULT_CONFIG, { organizationId: "org_sin_agenda", nowMs: NOW_MS + 1000 });
  assert.equal(sinAgenda.orgSlug, null);
  const derivado = step(createState(), { text: "quiero agendar una cita", receivedAt: T0 }, { config: sinAgenda });
  assert.equal(derivado.replies.at(-1).templateKey, "R_INTERES");
  assert.doesNotMatch(derivado.replies.at(-1).text, /app\.onia\.com\.bo/);
});

test("preview: con organizationId el turno corre contra el conocimiento de ESA org", async () => {
  process.env.ONIA_BOT_PREVIEW_SECRET = "prev";
  try {
    // Cache caliente de la org (como quedaria tras el primer turno real):
    const doc = valido({
      identity: { productName: "ZZ QA Ferreteria Tornillo" },
      productos: [{ key: "tornillos", tipo: "servicio", nombre: "tornillos al por mayor" }],
    });
    await getOrgKnowledge(ORG, { ...DB_OPTS, fetch: fetchFalso(doc), nowMs: Date.now() });

    const out = await handlePreviewRequest({
      rawBody: JSON.stringify({ message: "y que hacen exactamente?", organizationId: ORG }),
      headers: { authorization: "Bearer prev" },
    });
    assert.equal(out.status, 200);
    assert.equal(out.body.conocimiento.fuente, "db");
    const texto = out.body.respuestas.map((r) => r.texto).join("\n");
    assert.match(texto, /tornillos al por mayor/);
  } finally {
    delete process.env.ONIA_BOT_PREVIEW_SECRET;
  }
});

test("preview: el BORRADOR corre en modo RECEPCIONISTA — lo que el cliente final vera, con botones", async () => {
  // Decision Sergio 2026-08-18: el probador del editor muestra el bot del NEGOCIO
  // (M0R + pastillas), nunca el funnel de venta de Onia con el nombre cambiado.
  process.env.ONIA_BOT_PREVIEW_SECRET = "prev";
  try {
    const doc = valido({
      identity: { productName: "ZZ QA Ferreteria Tornillo", humanName: "Marta" },
      empresa: { horario: { frase: "lun-vie, 9:00-18:00" } },
    });
    const out = await handlePreviewRequest({
      rawBody: JSON.stringify({ message: "hola", knowledge: doc }),
      headers: { authorization: "Bearer prev" },
    });
    assert.equal(out.status, 200);
    assert.equal(out.body.conocimiento.fuente, "borrador");
    assert.equal(out.body.respuestas[0].plantilla, "M0R", "borrador => recepcionista, no M0 de venta");
    assert.match(out.body.respuestas[0].texto, /Soy el asistente de ZZ QA Ferreteria Tornillo/);
    assert.doesNotMatch(out.body.respuestas[0].texto, /plataforma por módulos/i);
    // Los botones input_select llegan como TITULOS para que el chat del editor los pinte.
    assert.deepEqual(out.body.respuestas[0].opciones, ["Horarios", "Servicios", "Hablar con Marta"]);

    // El click de una pastilla ("Horarios") contesta con el dato del borrador:
    const horario = await handlePreviewRequest({
      rawBody: JSON.stringify({ message: "Horarios", knowledge: doc }),
      headers: { authorization: "Bearer prev" },
    });
    assert.equal(horario.status, 200);
    assert.match(horario.body.respuestas.map((r) => r.texto).join("\n"), /lun-vie, 9:00-18:00/);
  } finally {
    delete process.env.ONIA_BOT_PREVIEW_SECRET;
  }
});

test("seguimiento (v6.6): activo bool + horas 1-48; tipos malos rechazan entero", () => {
  const ok = validateKnowledge({ schema: "onia.bot.knowledge/1", seguimiento: { activo: true, horas: 2 } });
  assert.equal(ok.ok, true);
  const mal = validateKnowledge({ schema: "onia.bot.knowledge/1", seguimiento: { activo: "si" } });
  assert.equal(mal.ok, false);
  const rango = validateKnowledge({ schema: "onia.bot.knowledge/1", seguimiento: { activo: true, horas: 99 } });
  assert.equal(rango.ok, false);
});

// ---------------------------------------------------------------------------
// FUENTE "PANEL" (F2.1): el conocimiento del bot de VENTAS editado en el panel
// ---------------------------------------------------------------------------
// El contrato: mismo TTL y mismo validador N1 que el archivo, pero (a) NO enciende el modo
// recepcionista (es la cara de venta de Onia) y (b) una entrada invalida se descarta SOLA,
// con log, en vez de tumbar el documento entero. URL caida => se sigue con el archivo/codigo
// (fail-open al conocimiento anterior, jamas mudo).

const PANEL_OPTS = {
  panelUrl: "http://producto/api/chatbot-knowledge/published?organizationId=org_onia_interna",
  panelSecret: "s3cr3t",
};

test("panel: el sobre del producto se mapea al doc del bot, source dice 'panel' y viaja el Bearer", async () => {
  // El doc del editor SIN version/updatedBy propios: se estampan los de la fila (v1 / test).
  const doc = valido({ identity: { productName: "Onia editada en el panel" } });
  delete doc.version;
  delete doc.updatedBy;
  const fetch = fetchFalso(doc);
  const state = await getPanelKnowledge({ ...PANEL_OPTS, fetch, nowMs: NOW_MS });

  assert.equal(state.source, "panel");
  assert.equal(state.version, "v1", "la version de la fila del producto llega al /health");
  assert.equal(state.updatedBy, "test", "el autor del editor llega al /health");
  assert.equal(fetch.calls[0].url, PANEL_OPTS.panelUrl, "la URL viaja COMPLETA, sin query agregada");
  assert.equal(fetch.calls[0].init.headers.authorization, "Bearer s3cr3t");

  // Y NO es el modo recepcionista: el panel edita la cara de VENTA de Onia.
  const config = withKnowledge(DEFAULT_CONFIG, { ...PANEL_OPTS, fetch, nowMs: NOW_MS });
  assert.notEqual(config.modo, "recepcionista");
  assert.equal(config.identity.productName, "Onia editada en el panel");
});

test("panel: dentro del TTL NO se vuelve a pedir; vencido, se relee (mismo TTL que el archivo)", async () => {
  const fetch = fetchFalso(valido());
  await getPanelKnowledge({ ...PANEL_OPTS, fetch, nowMs: NOW_MS });
  await getPanelKnowledge({ ...PANEL_OPTS, fetch, nowMs: NOW_MS + 1000 });
  assert.equal(fetch.calls.length, 1, "la red no esta en el camino de la respuesta");
  await getPanelKnowledge({ ...PANEL_OPTS, fetch, nowMs: NOW_MS + DEFAULT_TTL_MS + 1 });
  assert.equal(fetch.calls.length, 2, "vencido el TTL se relee");
});

test("panel: getKnowledge (sincronico) sirve la copia cacheada sin tocar la red", async () => {
  await getPanelKnowledge({ ...PANEL_OPTS, fetch: fetchFalso(valido()), nowMs: NOW_MS });
  const frio = fetchFalso(valido());
  const state = getKnowledge({ ...PANEL_OPTS, fetch: frio, nowMs: NOW_MS + 1000 });
  assert.equal(state.source, "panel");
  assert.equal(frio.calls.length, 0);
});

test("panel: URL caida o HTTP roto degradan al ARCHIVO local, sin tirar y sin quedar mudo", async () => {
  await conArchivo(valido({ identity: { productName: "Onia del archivo" } }), async (path) => {
    for (const opts of [{ fetch: fetchFalso(null, { fallar: true }) }, { fetch: fetchFalso(null, { status: 500 }) }]) {
      resetKnowledgeCache();
      const state = await getPanelKnowledge({ ...PANEL_OPTS, ...opts, path, nowMs: NOW_MS });
      assert.equal(state.source, "file", "sin panel se sigue con el conocimiento anterior");
      assert.equal(state.data.identity.productName, "Onia del archivo");
    }
    // 404 = la org interna todavia no publico nada: NO es un error que gritar.
    resetKnowledgeCache();
    const state = await getPanelKnowledge({ ...PANEL_OPTS, fetch: fetchFalso(null, { status: 404 }), path, nowMs: NOW_MS });
    assert.equal(state.source, "file");
    assert.equal(state.error, null);
  });
});

test("panel: un fetch roto CONSERVA la ultima copia buena (y el fallo queda a la vista)", async () => {
  await getPanelKnowledge({ ...PANEL_OPTS, fetch: fetchFalso(valido({ identity: { productName: "Onia v1" } })), nowMs: NOW_MS });
  const state = await getPanelKnowledge({
    ...PANEL_OPTS,
    fetch: fetchFalso(null, { fallar: true }),
    nowMs: NOW_MS + DEFAULT_TTL_MS + 1,
  });
  assert.equal(state.source, "panel");
  assert.equal(state.data.identity.productName, "Onia v1", "lo publicado no se borra por una red caida");
  assert.match(state.error, /no se pudo leer el panel/);
});

test("panel: una entrada con PRECIO invalido se descarta SOLA — el resto se publica igual", async () => {
  // El editor guardo dos FAQs del negocio: una sana y una con una cifra de plata (N1).
  // Todo-o-nada castigaria al documento entero; aca cae SOLO la entrada con la cifra.
  const doc = valido({
    faq: [
      { id: "negocio", body: "Aceptamos pagos por QR y transferencia", status: "publicado", tags: ["pagos"] },
      { id: "negocio", body: "El plan cuesta Bs 500 al mes", status: "publicado", tags: ["planes"] },
    ],
  });
  const state = await getPanelKnowledge({ ...PANEL_OPTS, fetch: fetchFalso(doc), nowMs: NOW_MS });
  assert.equal(state.source, "panel", "el documento NO se rechazo entero");
  assert.equal(state.data.faq.length, 1, "la entrada con la cifra se descarto sola");
  assert.equal(state.data.faq[0].body, "Aceptamos pagos por QR y transferencia");
  assert.ok(Array.isArray(state.descartes) && state.descartes.length >= 1, "el descarte queda registrado");
  assert.match(state.descartes.join(" "), /faq\[1\]/);
});

test("panel: un error ESTRUCTURAL (clave desconocida arriba) rechaza el doc ENTERO y cae al archivo", async () => {
  await conArchivo(valido({ identity: { productName: "Onia del archivo" } }), async (path) => {
    const state = await getPanelKnowledge({
      ...PANEL_OPTS,
      fetch: fetchFalso(valido({ inventada: true })),
      path,
      nowMs: NOW_MS,
    });
    assert.equal(state.source, "file", "un doc de otro contrato no entra ni recortado");
    assert.match((await ensureKnowledgeHealth({ ...PANEL_OPTS, path, nowMs: NOW_MS })).panel.lastError, /RECHAZADO/);
  });
});

test("panel: sin ONIA_KNOWLEDGE_URL la fuente esta APAGADA y nada cambia", async () => {
  const fetch = fetchFalso(valido());
  const state = await getPanelKnowledge({ panelUrl: "", panelSecret: "x", fetch, nowMs: NOW_MS, path: "/no/existe.json" });
  assert.equal(state.source, "code");
  assert.equal(fetch.calls.length, 0);
});

test("panel: /health dice source:'panel' con la version y el autor del editor", async () => {
  const fetch = fetchFalso(valido({ version: "v7", updatedBy: "Sergio Urcullo" }));
  await getPanelKnowledge({ ...PANEL_OPTS, fetch, nowMs: NOW_MS });
  const salud = await ensureKnowledgeHealth({ ...PANEL_OPTS, fetch, nowMs: NOW_MS + 1000 });
  assert.equal(salud.source, "panel");
  assert.equal(salud.version, "v7");
  assert.equal(salud.updatedBy, "Sergio Urcullo");
  assert.deepEqual(salud.panel, { configurado: true, sirviendo: true, descartes: 0, lastError: null });
});

test("panel: publicar NO puede APAGAR una respuesta que el archivo ya daba", async () => {
  // El defecto es ESTRUCTURAL y se lee en el codigo; no hace falta que le haya pasado a un lead.
  // Encontrado el 2026-09-13 sembrando una fila de prueba en el panel de `onia-interna` (el bot
  // de VENTA) — fila propia, en borrador, que NUNCA sirvio a un desconocido: no es un incidente
  // vivo y no se cuenta como tal.
  //
  // Lo que la fila dejo a la vista es una cadena que se cierra sola:
  //   1. `editor-sugerir.mjs` le dicta al LLM un solo id posible — 'faq: lista de { id:
  //      "negocio", ... }' — y ademas le exige (regla 1) devolver el DOCUMENTO COMPLETO;
  //   2. el bot de VENTA no consume `negocio`: FAQ_TEMPLATE mapea `precios` -> M4_BODY y
  //      `siat` -> M_SIAT_BODY, mientras `negocio` -> R_FAQ_NEGOCIO lo sirve el recepcionista;
  //   3. el panel reemplazaba el documento ENTERO.
  // O sea que CUALQUIER edicion hecha desde el panel reescribia las FAQ bajo `negocio` y apagaba
  // `precios` y `siat`, devolviendo al bot al M4_BODY por defecto de config.mjs ("no te quiero
  // tirar una cifra") — contra la decision de Sergio Urcullo del 2026-09-03 de que el bot diga
  // los precios publicos. Sin una sola señal: /health informa `descartes: 0, lastError: null`,
  // o sea SANO, porque cada entrada que llego es valida. Lo que se pierde es lo que NO llego.
  // La fila sembrada lo muestra literal: sus dos FAQ son de precios y de SIAT por su texto, y
  // las dos quedaron con id `negocio`.
  //
  // La fuente panel ya se declaraba tolerante POR ENTRADA para no dejar al editor sin nada
  // ("castigarle el documento entero por una entrada lo deja sin nada"). Este es el mismo
  // principio en la otra dimension: lo que el panel NO trae se HEREDA del archivo, en vez de
  // apagarse. Editar una FAQ no puede ser una forma de borrar las demas.
  const archivo = valido({
    faq: [
      {
        id: "precios",
        title: "Precios",
        body: "El sistema arranca en Bs 320 al mes con el plan Básico.",
        tags: ["precio", "cuanto"],
        status: "publicado",
      },
    ],
  });
  const panel = valido({
    version: "v1",
    faq: [
      {
        id: "negocio",
        title: "Planes y precios",
        body: "La lista completa y al día está en onia.com.bo/precios.",
        tags: ["precio", "planes"],
        status: "publicado",
      },
    ],
  });
  await conArchivo(archivo, async (path) => {
    const fetch = fetchFalso(panel);
    const state = await getPanelKnowledge({ ...PANEL_OPTS, fetch, path, nowMs: NOW_MS });
    assert.equal(state.source, "panel", "la fila publicada manda: es lo que el editor acaba de guardar");

    const config = withKnowledge(DEFAULT_CONFIG, { ...PANEL_OPTS, fetch, path, nowMs: NOW_MS });
    const texto = step(
      createState({ channel: "sim", contactRef: "t" }),
      { text: "cuanto cuesta el sistema?", receivedAt: T0 },
      { config },
    )
      .replies.map((reply) => reply.text)
      .join("\n");

    assert.match(texto, /Bs 320/, "el panel no trajo FAQ `precios`: la del archivo se conserva y el bot SIGUE cotizando");
    assert.doesNotMatch(
      texto,
      /no (te|le) quiero tirar una cifra/i,
      "volver al M4_BODY por defecto es la regresion: el bot de venta dejaria de dar el precio",
    );
  });
});

test("panel: mapPanelDoc y sanitizePanelKnowledge son puros y defensivos", () => {
  assert.equal(mapPanelDoc(null), null);
  assert.equal(mapPanelDoc({ data: "no-objeto" }), null);
  const doc = valido();
  const limpio = sanitizePanelKnowledge(doc);
  assert.equal(limpio.data, doc, "un doc valido pasa identico, sin clonar de mas");
  assert.deepEqual(limpio.descartes, []);
});

// ---------------------------------------------------------------------------
// FUENTE "PANEL" + ARCHIVO: MERGE POR CAMPO (F2.2) — publicar del panel no degrada nada
// ---------------------------------------------------------------------------
// Medido el 2026-09-13 (v1 publicada desde el panel, con rollback): el doc del panel
// REEMPLAZABA al archivo entero. Sin su FAQ `precios`, M4_BODY volvia al default SIN cifras
// (el bot dejo de dar precios); los 9 triggersExtra.demo del archivo se perdian; y el modo
// venta ignoraba las FAQ `negocio` del editor. Estos tests son el contrato de la reparacion:
// lo que el panel no trae SE CONSERVA del archivo, y lo que trae se sirve tambien en venta.

const ARCHIVO_ONIA = JSON.parse(readFileSync(join(HERE, "knowledge.onia.json"), "utf8"));

/** El doc tipico del editor del panel: UNA FAQ del dueño, sin precios ni triggers. */
function panelNegocio(extra = {}) {
  return valido({
    faq: [
      {
        id: "negocio",
        title: "Garantía",
        body: "Tenés 14 días de prueba y soporte directo por WhatsApp",
        status: "publicado",
        tags: ["garantia", "prueba"],
      },
    ],
    ...extra,
  });
}

test("panel: los PRECIOS no dependen de la fuente — sin FAQ `precios` en el panel, la del archivo sigue con cifras y link", async () => {
  await conArchivo(ARCHIVO_ONIA, async (path) => {
    const state = await getPanelKnowledge({ ...PANEL_OPTS, fetch: fetchFalso(panelNegocio()), path, nowMs: NOW_MS });
    assert.equal(state.source, "panel", "el panel esta sirviendo (no se degrado)");
    const ids = state.data.faq.map((f) => f.id).sort();
    assert.deepEqual(ids, ["negocio", "precios", "siat"], "el merge conserva las FAQ del archivo que el panel no trae");

    const config = withKnowledge(DEFAULT_CONFIG, { ...PANEL_OPTS, path, nowMs: NOW_MS });
    assert.match(config.script.M4_BODY, /Bs 320/, "la respuesta de precios sigue COTIZANDO");
    assert.match(config.script.M4_BODY, /onia\.com\.bo\/precios/, "y sigue mandando a la lista publica");

    const result = step(
      createState({ channel: "sim", contactRef: "merge-precio" }),
      { text: "¿cuánto cuesta?", receivedAt: T0 },
      { config: conHorarios(config) },
    );
    const texto = result.replies.map((r) => r.text).join("\n");
    assert.match(texto, /Bs 320/, "el embudo contesta el precio con la escalera C");
    assert.match(texto, /890/);
    assert.match(texto, /1\.290/);
  });
});

test("panel: los triggersExtra.demo del archivo SOBREVIVEN al cambio de fuente (union, nunca resta)", async () => {
  await conArchivo(ARCHIVO_ONIA, async (path) => {
    const fetch = fetchFalso(panelNegocio({ triggersExtra: { demo: ["disparador del panel"] } }));
    const state = await getPanelKnowledge({ ...PANEL_OPTS, fetch, path, nowMs: NOW_MS });
    assert.equal(state.source, "panel");
    const esperados = ARCHIVO_ONIA.triggersExtra.demo.length + 1;
    assert.equal(state.data.triggersExtra.demo.length, esperados, "union archivo+panel, sin perder ninguno");

    const salud = await ensureKnowledgeHealth({ ...PANEL_OPTS, path, nowMs: NOW_MS });
    assert.equal(salud.source, "panel");
    assert.equal(salud.triggersDemo, esperados, "/health cuenta lo SERVIDO (el merge), no el doc pelado del panel");

    const config = withKnowledge(DEFAULT_CONFIG, { ...PANEL_OPTS, path, nowMs: NOW_MS });
    assert.ok(config.triggers.demo.includes("quiero contratar"), "el disparador del archivo sigue vivo");
    assert.ok(config.triggers.demo.includes("disparador del panel"), "y el del panel se suma");
  });
});

test("panel: si el panel SI trae una FAQ de un id del archivo, la suya manda (merge por id)", async () => {
  await conArchivo(ARCHIVO_ONIA, async (path) => {
    const doc = panelNegocio();
    doc.faq.push({
      id: "siat",
      body: "Sobre facturación te contesto en la demo, con tu NIT delante.",
      status: "publicado",
      tags: ["fiscal"],
    });
    const state = await getPanelKnowledge({ ...PANEL_OPTS, fetch: fetchFalso(doc), path, nowMs: NOW_MS });
    assert.equal(state.source, "panel");
    const siat = state.data.faq.filter((f) => f.id === "siat");
    assert.equal(siat.length, 1, "no quedan dos versiones del mismo id");
    assert.match(siat[0].body, /con tu NIT delante/, "gana la del panel");
    assert.ok(state.data.faq.some((f) => f.id === "precios"), "y la de precios del archivo sigue");
  });
});

test("panel: una FAQ del editor (id 'negocio') SE CONTESTA en el embudo de VENTA por sus tags", async () => {
  await conArchivo(ARCHIVO_ONIA, async (path) => {
    await getPanelKnowledge({ ...PANEL_OPTS, fetch: fetchFalso(panelNegocio()), path, nowMs: NOW_MS });
    const config = conHorarios(withKnowledge(DEFAULT_CONFIG, { ...PANEL_OPTS, path, nowMs: NOW_MS }));
    assert.notEqual(config.modo, "recepcionista", "sigue siendo la cara de VENTA de Onia");

    // En frio ('nuevo'): la bienvenida manda (D2) y la respuesta editable va atras.
    const r1 = step(
      createState({ channel: "sim", contactRef: "faq-venta" }),
      { text: "¿me dan garantía?", receivedAt: T0 },
      { config },
    );
    const texto1 = r1.replies.map((r) => r.text).join("\n");
    assert.match(texto1, /14 días de prueba y soporte directo/, "la FAQ del panel se sirve en venta");

    // Y en medio del embudo tambien, sin abandonar el guion.
    const r2 = step(r1.nextState, { text: "y la garantia?", receivedAt: T0 }, { config });
    const texto2 = r2.replies.map((r) => r.text).join("\n");
    assert.match(texto2, /14 días de prueba/, "tambien fuera de la bienvenida");
  });
});

test("panel: los candados del guion le GANAN a la FAQ del panel — 'cuanto cuesta' sigue siendo M4 con cifras", async () => {
  await conArchivo(ARCHIVO_ONIA, async (path) => {
    // El tag del dueño pisa una palabra de plata a proposito: el candado tiene que ganar.
    const doc = valido({
      faq: [{ id: "negocio", body: "Trabajamos con todos los planes de las telefónicas", status: "publicado", tags: ["planes"] }],
    });
    await getPanelKnowledge({ ...PANEL_OPTS, fetch: fetchFalso(doc), path, nowMs: NOW_MS });
    const config = conHorarios(withKnowledge(DEFAULT_CONFIG, { ...PANEL_OPTS, path, nowMs: NOW_MS }));
    const result = step(
      createState({ channel: "sim", contactRef: "candado" }),
      { text: "¿cuánto cuesta el plan?", receivedAt: T0 },
      { config },
    );
    const texto = result.replies.map((r) => r.text).join("\n");
    assert.match(texto, /Bs 320/, "pregunta de plata => M4 con cifras, no la FAQ del dueño");
    assert.doesNotMatch(texto, /telefónicas/);
  });
});

for (const status of [404, 409]) {
  for (const organizationId of ["org_onia_interna", "org_cliente"]) {
    test(`db: ${status} con ${organizationId} conserva el modo correspondiente`, async () => {
      const opts = {
        dbUrl: "http://producto/published", dbSecret: "test",
        panelUrl: "http://producto/published?organizationId=org_onia_interna", panelSecret: "test",
        inboxId: "5", nowMs: NOW_MS, path: "/no/existe/knowledge.json",
        fetch: async () => ({ ok: false, status, json: async () => ({ organizationId }) }),
      };
      await ensureKnowledge(opts);
      const config = withKnowledge(DEFAULT_CONFIG, opts);
      assert.equal(config.modo === "recepcionista", organizationId !== "org_onia_interna");
      const result = step(createState({ channel: "whatsapp" }), { text: "hola", receivedAt: T0 }, { config });
      assert.ok(result.replies.length > 0);
    });
  }
}

for (const channelType of ["Channel::Whatsapp", "Channel::Website"]) {
  test(`db: bandeja sin org ${channelType}: silencio solo en WhatsApp y un registro por conversación`, async () => {
    const opts = {
      inboxId: "99", dbUrl: "http://producto/published", dbSecret: "test",
      nowMs: NOW_MS, path: "/no/existe/knowledge.json",
      fetch: async () => ({ ok: false, status: 404, json: async () => ({}) }),
    };
    await ensureKnowledge(opts);
    const config = withKnowledge(DEFAULT_CONFIG, opts);
    let state = createState({ channel: "chatwoot", channelType, inboxId: "99" });
    const audits = [];
    for (const text of ["hola", "precio", "servicios", "DEMO"]) {
      const result = step(state, { text, receivedAt: T0 }, { config });
      if (channelType === "Channel::Whatsapp") assert.deepEqual(result.replies, []);
      else if (text === "hola") assert.ok(result.replies.length > 0, "web conserva la bienvenida neutral");
      audits.push(...result.sideEffects.filter((e) => e.payload?.action === "bandeja_huerfana"));
      state = createState(result.nextState);
    }
    assert.equal(audits.length, channelType === "Channel::Whatsapp" ? 1 : 0);
    if (audits.length) assert.equal(audits[0].payload.detail.reason, "bandeja huérfana, no se responde");
  });
}

test("db: la fila de la ORG INTERNA (la del panel) NO enciende el recepcionista — el lead de venta sigue en venta", async () => {
  // Medido en prod el 2026-09-13: el producto resuelve inbox->org y los inboxes de VENTA (4 web,
  // 5 WhatsApp) resuelven a la org interna de Onia. Con la fila del panel publicada, la fuente
  // "db" la devolvia como si fuera una org cliente y asRecepcionista le ponia el menu de
  // recepcion ("horarios, servicios, pedido") a los leads del widget. La fila interna entra SOLO
  // por la fuente "panel" (mergeada, modo venta); por inbox se trata como "sin fila".
  const doc = valido({
    faq: [{ id: "negocio", body: "Tenés 14 días de prueba", status: "publicado", tags: ["prueba"] }],
  });
  const sobreInterno = async () => ({
    ok: true,
    status: 200,
    json: async () => ({ organizationId: "org_onia_interna", data: doc, version: 2, updatedBy: "panel" }),
  });
  const opts = {
    dbUrl: "http://producto/api/chatbot-knowledge/published",
    dbSecret: "s3cr3t",
    panelUrl: "http://producto/api/chatbot-knowledge/published?organizationId=org_onia_interna",
    panelSecret: "s3cr3t",
    inboxId: "4",
    fetch: sobreInterno,
    nowMs: NOW_MS,
  };
  const state = await ensureKnowledge(opts);
  assert.notEqual(state.source, "db", "la fila interna no es una org cliente");
  const config = withKnowledge(DEFAULT_CONFIG, opts);
  assert.notEqual(config.modo, "recepcionista", "el lead de venta NUNCA ve el menu de recepcion");

  // Y una org CLIENTE de verdad sigue encendiendo el recepcionista: la guarda no rompe clientes.
  resetOrgKnowledgeCache();
  const sobreCliente = async () => ({
    ok: true,
    status: 200,
    json: async () => ({ organizationId: "org_ferreteria", data: valido(), version: 1, updatedBy: "x" }),
  });
  await getOrgKnowledge("org_ferreteria", { ...opts, inboxId: undefined, fetch: sobreCliente });
  const cliente = withKnowledge(DEFAULT_CONFIG, { organizationId: "org_ferreteria", nowMs: NOW_MS + 1000 });
  assert.equal(cliente.modo, "recepcionista", "una org cliente sigue siendo el bot del negocio");
});

// La frontera de ARRIBA la fija por MODO (recepcionista si/no). Esta la fija por CONTENIDO, que
// es lo que el cliente lee. Nace de medir produccion el 2026-09-13: preguntandole al proceso vivo
// por la MISMA via del camino de respuesta, los CUATRO inboxes de Chatwoot devolvian el mismo
// documento — `path: panel:...?organizationId=c956c02fccd8573cd6fcc5b35`, que es `onia-interna` —
// incluido el inbox 7, para el que el producto contesta 404 (no es de ninguna org):
//
//   docker exec onia-center wget -qO- 'http://127.0.0.1:3020/health?inboxId=7'
//   docker exec onia-center wget -qO- --header='Authorization: Bearer <BOT_KNOWLEDGE_SECRET>' \
//     'http://onia-platform:3000/api/chatbot-knowledge/published?inboxId=7'   # -> 404
//
// Que un inbox DESCONOCIDO reciba el bot de Onia es una decision tomada y con test ("db: inbox
// sin org (404) degrada a archivo/codigo"): un canal nuevo de Onia debe seguir vendiendo Onia.
// Lo que NO puede pasar nunca es lo de aca abajo: que un inbox CON fila propia igual coma del
// panel global. Hoy no pasa porque `getKnowledge` devuelve la copia db ANTES de mirar el panel,
// pero nada lo sujeta: la fuente panel (F2.1) llego DESPUES de la resolucion por inbox y se
// aplica a todos los alcances, asi que mover su bloque unas lineas arriba le serviria el guion
// de venta de Onia —con sus precios y sus horarios de demo— a los clientes de un cliente, y
// ningun gate se pondria rojo. Validado por mutacion: con el bloque del panel movido antes del
// `if (org?.data)`, este caso sale en ROJO.
test("panel: un inbox CON fila propia come de SU fila, nunca del panel global de la interna", async () => {
  resetKnowledgeCache();
  resetOrgKnowledgeCache();
  // El MISMO fetch contesta las dos rutas, como en produccion (mismo endpoint, mismo Bearer):
  // por inbox devuelve la ferreteria; la URL del panel lleva la org interna clavada en la query.
  const fetch = async (url, init) => {
    const calls = fetch.calls;
    calls.push({ url: String(url), init });
    const esPanelGlobal = String(url).includes("organizationId=org_onia_interna");
    return {
      ok: true,
      status: 200,
      json: async () => ({
        organizationId: esPanelGlobal ? "org_onia_interna" : "org_ferreteria",
        data: valido({
          identity: {
            productName: esPanelGlobal ? "Onia — plataforma de gestión" : "Ferretería El Tornillo",
          },
        }),
        version: 1,
        updatedBy: esPanelGlobal ? "panel-venta" : "dueno-ferreteria",
      }),
    };
  };
  fetch.calls = [];

  const opts = {
    dbUrl: "http://producto/api/chatbot-knowledge/published",
    dbSecret: "s3cr3t",
    panelUrl: "http://producto/api/chatbot-knowledge/published?organizationId=org_onia_interna",
    panelSecret: "s3cr3t",
    inboxId: "31",
    fetch,
    nowMs: NOW_MS,
    path: "/no/existe/knowledge.json",
  };

  const state = await ensureKnowledge(opts);
  assert.equal(state.source, "db", "el inbox del cliente tiene fila propia: esa es su fuente");
  assert.equal(state.data.identity.productName, "Ferretería El Tornillo");

  // Y el turno que lee el cliente tampoco sale con la cara de Onia.
  const config = withKnowledge(DEFAULT_CONFIG, opts);
  assert.equal(config.identity.productName, "Ferretería El Tornillo");
  assert.equal(config.modo, "recepcionista", "org cliente = el bot del negocio");
  assert.notEqual(
    config.identity.productName,
    "Onia — plataforma de gestión",
    "el panel global es del alcance del PROCESO, no de un inbox ajeno",
  );
});

// LA MITAD QUE FALTABA, medida en produccion el 2026-09-13: el inbox que nace HUERFANO.
// Preguntandole al proceso vivo por la via del camino de respuesta, `?inboxId=99` —un inbox que
// NO EXISTE— contestaba `source: "panel"`, o sea el guion de venta de Onia con sus precios y sus
// horarios de demo. El dia que se destrabe el Embedded Signup (S1), el inbox del cliente nace
// huerfano y hasta que alguien lo registre en `clinic_settings.chatwootInboxId` el bot le cotiza
// ONIA a los clientes de ESE negocio.
//
// La causa es que `fetchOrgKnowledge` aplanaba DOS respuestas distintas en el mismo `missing`:
// "es la org interna" (correcto: cae al panel, que es el guion de Onia, y ese inbox ES de Onia) y
// "404, no es de ninguna org" (huerfano). Con las dos indistinguibles, el huerfano heredaba la
// cara de Onia. Es la MISMA clase de bug que ya se curo al lado: sin `humanName` del cliente, el
// fallback heredado era "Sergio" delante del cliente final (asRecepcionista, 2026-08-29).
//
// Degradacion elegida: recepcionista NEUTRO. No vende Onia, no cotiza, no ofrece demo con Sergio
// y deriva a "el equipo". Un canal nuevo DE ONIA sigue vendiendo Onia sin cambiar nada: sus
// inboxes se registran en la org interna igual que el 4 y el 5, y entonces no son huerfanos.
test("panel: un inbox HUERFANO (404) no come del panel global — no le vende Onia a los clientes de nadie", async () => {
  resetKnowledgeCache();
  resetOrgKnowledgeCache();
  // El mismo fetch de produccion: el panel global (org interna clavada en la query) contesta 200;
  // el inbox desconocido contesta 404 — "ese inbox no es de ninguna org".
  const fetch = async (url, init) => {
    fetch.calls.push({ url: String(url), init });
    if (!String(url).includes("organizationId=org_onia_interna")) {
      return { ok: false, status: 404, json: async () => ({}) };
    }
    return {
      ok: true,
      status: 200,
      json: async () => ({
        organizationId: "org_onia_interna",
        data: valido({ identity: { productName: "Onia — plataforma de gestión", humanName: "Sergio" } }),
        version: 1,
        updatedBy: "panel-venta",
      }),
    };
  };
  fetch.calls = [];

  const opts = {
    ...DB_OPTS,
    panelUrl: "http://producto/api/chatbot-knowledge/published?organizationId=org_onia_interna",
    panelSecret: "s3cr3t",
    inboxId: "99",
    fetch,
    nowMs: NOW_MS,
    path: "/no/existe/knowledge.json",
  };

  const state = await ensureKnowledge(opts);
  assert.equal(state.huerfano, true, "el producto dijo 404: ese inbox no es de nadie, y se DECLARA");
  assert.equal(state.error ?? null, null, "404 sigue sin ser un error que gritar");
  assert.equal(state.data ?? null, null, "y no se le sirve el documento de otra org");

  const config = withKnowledge(DEFAULT_CONFIG, opts);
  assert.equal(config.modo, "recepcionista", "inbox de nadie = jamas el funnel de venta de Onia");
  assert.notEqual(config.identity.productName, "Onia — plataforma de gestión");
  assert.equal(config.identity.humanName, "el equipo", "ni 'Sergio' delante del cliente de otro");

  // Y el turno que recibe esa persona no cotiza Onia ni le ofrece una demo con Sergio.
  const result = step(createState(), { text: "hola", receivedAt: T0 }, { config });
  assert.doesNotMatch(result.replies[0].text, /Sergio/i, "el humano de Onia no se nombra en un canal ajeno");
  assert.doesNotMatch(result.replies[0].text, /plataforma por módulos/i, "ni el pitch de venta de Onia");
});

test("applyKnowledge: las FAQ 'negocio' viajan en config.faq para el modo venta y NO pisan el guion", () => {
  const data = valido({
    faq: [
      { id: "negocio", body: "Aceptamos pagos por QR", status: "publicado", tags: ["pagos"] },
      { id: "negocio", body: "Hacemos envíos a todo el país", status: "publicado", tags: ["envios"] },
    ],
  });
  const config = applyKnowledge(DEFAULT_CONFIG, data, { nowIso: T0 });
  assert.equal(config.faq.length, 2, "las DOS viajan (no gana solo la ultima)");
  assert.equal(config.script.R_FAQ_NEGOCIO, DEFAULT_CONFIG.script.R_FAQ_NEGOCIO, "el guion no se pisa");
});

// EL 404 DEL PRODUCTO TIENE DOS SIGNIFICADOS, Y EL MOTOR LOS APLANABA EN UNO.
// `published/route.ts` contesta 404 en cuatro situaciones y las separa A PROPOSITO por el
// cuerpo: manda `organizationId` cuando el inbox SI resolvio a una org — add-on apagado,
// nada publicado todavia, o borrador sin publicar — y lo OMITE solo cuando ningun
// `clinic_settings` reclama ese inbox ("Inbox sin organizacion"). Su comentario lo dice
// textual: "Un 404 SIN organizationId sigue significando 'inbox sin org'".
//
// `fetchOrgKnowledge` no leia el cuerpo: `huerfano: key.startsWith("inbox:")` declaraba "ese
// inbox no es de NINGUNA org" tambien sobre el WhatsApp de un cliente que paga Bs 390. El
// efecto COINCIDIA (los dos cortan el fallback de venta), y por eso sobrevivio: lo que mentia
// era el estado, no la respuesta. Pero ese estado se publica —`/health?inboxId=N` lo sirve, y
// el item S1 de la cola razona con el— asi que el operador que mira el inbox recien nacido del
// Embedded Signup lee "no es de nadie" sobre un cliente real y lo trata como basura.
//
// LAS DOS MITADES VAN JUNTAS. Corregir el flag sin ampliar el corte es la regresion cara: el
// `if (org?.huerfano) return org` de getKnowledge dejaria de aplicar y la org cliente caeria al
// archivo, que es el guion de venta de ONIA — cotizarle Onia a los clientes del negocio que
// acaba de conectar su WhatsApp. Por eso este test afirma el estado Y la degradacion.
test("404 CON organizationId = org cliente sin conocimiento, NO un inbox de nadie", async () => {
  resetKnowledgeCache();
  resetOrgKnowledgeCache();
  // Produccion exacta: el inbox 77 es el WhatsApp de un cliente (resuelve a su org), pero hoy
  // no se le sirve conocimiento. El producto lo dice mandando el organizationId en el 404.
  const fetch = async (url, init) => {
    fetch.calls.push({ url: String(url), init });
    if (String(url).includes("organizationId=org_onia_interna")) {
      return {
        ok: true,
        status: 200,
        json: async () => ({
          organizationId: "org_onia_interna",
          data: valido({ identity: { productName: "Onia — plataforma de gestión", humanName: "Sergio" } }),
          version: 1,
          updatedBy: "panel-venta",
        }),
      };
    }
    return {
      ok: false,
      status: 404,
      json: async () => ({ error: "Sin conocimiento publicado", organizationId: "org_cliente_dental" }),
    };
  };
  fetch.calls = [];

  const opts = {
    ...DB_OPTS,
    panelUrl: "http://producto/api/chatbot-knowledge/published?organizationId=org_onia_interna",
    panelSecret: "s3cr3t",
    inboxId: "77",
    fetch,
    nowMs: NOW_MS,
    path: "/no/existe/knowledge.json",
  };

  const state = await ensureKnowledge(opts);
  assert.equal(state.huerfano, false, "ese inbox SI es de una org: llamarlo huerfano es falso");
  assert.equal(state.organizationId, "org_cliente_dental", "de quien es viaja: el producto ya lo dijo");
  assert.equal(state.error ?? null, null, "404 sigue sin ser un error que gritar");
  assert.equal(state.data ?? null, null, "y no se le sirve el documento de otra org");

  // LA MITAD QUE PROTEGE: sin conocimiento propio NO se hereda el guion de venta de Onia.
  const config = withKnowledge(DEFAULT_CONFIG, opts);
  assert.equal(config.modo, "recepcionista", "el WhatsApp de un cliente jamas es el funnel de Onia");
  assert.notEqual(config.identity.productName, "Onia — plataforma de gestión");
  assert.equal(config.identity.humanName, "el equipo", "ni 'Sergio' delante del cliente de otro");
});

// EL INBOX EN CONFLICTO NO TIENE DUEÑO QUE EL BOT PUEDA ELEGIR (DG-047).
// `clinic_settings` no hace unicos los tres slots de inbox: dos orgs pueden reclamar el mismo
// numero por un error de alta. Hasta hoy /published elegia la fila mas antigua (determinista)
// y este motor le contestaba al cliente de un negocio con el conocimiento de OTRO — fuga entre
// tenants con cara de respuesta normal. El contrato nuevo: el producto DECLARA el conflicto con
// 409 y este motor lo trata como inbox ajeno — aviso neutro, jamas el archivo (que es el guion
// de venta de Onia), y jamas elegir una org por su cuenta.
test("409 del producto (inbox en conflicto entre orgs) = ajeno: neutro, sin funnel y sin elegir org", async () => {
  resetKnowledgeCache();
  resetOrgKnowledgeCache();
  const fetch = async (url, init) => {
    fetch.calls.push({ url: String(url), init });
    if (String(url).includes("organizationId=org_onia_interna")) {
      return {
        ok: true,
        status: 200,
        json: async () => ({
          organizationId: "org_onia_interna",
          data: valido({ identity: { productName: "Onia — plataforma de gestión", humanName: "Sergio" } }),
          version: 1,
          updatedBy: "panel-venta",
        }),
      };
    }
    return {
      ok: false,
      status: 409,
      json: async () => ({ error: "Inbox en conflicto entre organizaciones", conflicto: true }),
    };
  };
  fetch.calls = [];

  const opts = {
    ...DB_OPTS,
    panelUrl: "http://producto/api/chatbot-knowledge/published?organizationId=org_onia_interna",
    panelSecret: "s3cr3t",
    inboxId: "88",
    fetch,
    nowMs: NOW_MS,
    path: "/no/existe/knowledge.json",
  };

  const state = await ensureKnowledge(opts);
  assert.equal(state.error ?? null, null, "el conflicto es un estado declarado, no un error que gritar");
  assert.equal(state.data ?? null, null, "sin dueño claro no se sirve el documento de NINGUNA org");
  assert.equal(state.ajena, true, "conflicto = de alguien que no es Onia, aunque no se sepa de quien");
  assert.equal(state.huerfano, false, "dos orgs lo reclaman: 'de nadie' seria mentira");

  const config = withKnowledge(DEFAULT_CONFIG, opts);
  assert.equal(config.modo, "recepcionista", "inbox en conflicto jamas es el funnel de venta de Onia");
  assert.notEqual(config.identity.productName, "Onia — plataforma de gestión");
  assert.equal(config.identity.humanName, "el equipo", "ni 'Sergio' delante del cliente de otro");

  const result = step(createState(), { text: "hola", receivedAt: T0 }, { config });
  assert.doesNotMatch(result.replies[0].text, /Sergio/i, "el humano de Onia no se nombra en un canal en disputa");
  assert.doesNotMatch(result.replies[0].text, /plataforma por módulos/i, "ni el pitch de venta de Onia");
});
