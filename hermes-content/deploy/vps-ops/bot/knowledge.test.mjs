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
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { DEFAULT_CONFIG, DEMO, SCRIPT, createBotConfig, demoDuration, renderTemplate } from "./config.mjs";
import {
  DEFAULT_TTL_MS,
  KNOWLEDGE_SCHEMA,
  applyKnowledge,
  checkCli,
  getKnowledge,
  knowledgeHealth,
  parseKnowledge,
  readKnowledgeFile,
  resetKnowledgeCache,
  validateKnowledge,
  withKnowledge,
} from "./knowledge.mjs";
import { step, createState } from "./bot-engine.mjs";
import { normalize } from "./guardrails.mjs";
import { findIndustry, industryLabel } from "./intents.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const EJEMPLO = join(HERE, "knowledge.example.json");

const T0 = "2026-07-27T14:05:00Z"; // lunes 10:05 en La Paz: dentro de horario
const NOW_MS = Date.parse(T0);

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

test.afterEach(() => resetKnowledgeCache());

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
    const config = withKnowledge(DEFAULT_CONFIG, { path, nowMs: NOW_MS });
    const result = step(createState({ channel: "sim", contactRef: "t" }), { text: "DEMO", receivedAt: T0 }, { config });
    const texto = result.replies.map((reply) => reply.text).join("\n");
    assert.match(texto, /30 minutos por videollamada/, "el hecho sale del codigo, exactamente como hoy");
    assert.ok(!texto.includes("{{"), "ninguna variable puede quedar sin resolver a la vista del prospecto");
  });
});

test("JSON ROTO: se rechaza entero, se sigue con codigo y el error queda a la vista en /health", () => {
  conArchivo("{ esto no es json", (path) => {
    const config = withKnowledge(DEFAULT_CONFIG, { path, nowMs: NOW_MS });
    assert.equal(config, DEFAULT_CONFIG);

    const salud = knowledgeHealth({ path, nowMs: NOW_MS });
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
  const config = applyKnowledge(DEFAULT_CONFIG, valido({ demo: { duracionMinutos: 30, duracionFrase: "30 minutos" } }));
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

test("identidad: el nombre del humano y del producto salen del archivo", () => {
  const config = applyKnowledge(DEFAULT_CONFIG, valido({ identity: { humanName: "Leslie", productName: "Onia" } }));
  const result = step(createState({ channel: "sim", contactRef: "t" }), { text: "cuanto sale?", receivedAt: T0 }, { config });
  const texto = result.replies.map((reply) => reply.text).join("\n");
  assert.match(texto, /el número exacto te lo pasa Leslie en la demo/, "M4_BODY: el precio lo da un humano, y el humano sale del archivo");
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

test("/health dice de donde salio lo que el bot esta diciendo (si no, 'edite y no paso nada' tarda dias)", () => {
  conArchivo(valido({ version: "2026-08-06.9" }), (path) => {
    const salud = knowledgeHealth({ path, nowMs: NOW_MS });
    assert.equal(salud.source, "file");
    assert.equal(salud.version, "2026-08-06.9");
    assert.equal(salud.lastError, null);
    assert.equal(salud.path, path);
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
  assert.match(texto, /en construcción, sin humo/, "y dice la misma verdad que la web publica");
  assert.match(texto, /me falta/, "contestar no puede costar la calificacion: el embudo sigue");
  assert.ok(!texto.includes("{{"), "ninguna variable puede quedar sin resolver a la vista del prospecto");
});

test("un producto NUEVO aparece con solo editar el JSON — sin desplegar", () => {
  assert.ok(!respuestaCatalogo(DEFAULT_CONFIG).texto.includes("Veterinaria"), "hoy el bot no lo conoce");
  const config = applyKnowledge(DEFAULT_CONFIG, valido({ productos: CATALOGO_NUEVO }));
  assert.match(respuestaCatalogo(config).texto, /Veterinaria/);
});

test("CANDADO: el archivo puede sumar un producto pero NUNCA declararlo terminado", () => {
  const config = applyKnowledge(DEFAULT_CONFIG, valido({ productos: CATALOGO_NUEVO }));
  const { texto } = respuestaCatalogo(config);
  assert.match(texto, /• \*Dental\*/, "el que SI esta armado se nombra como tal");
  assert.match(texto, /Veterinaria: en construcción/, "el nuevo entra siempre como en construccion");

  // Y no hay ni donde intentarlo: el esquema no tiene el campo.
  for (const intento of [{ listo: true }, { moduloListo: true }, { estado: "listo" }, { precio: 390 }]) {
    const verdict = validateKnowledge(valido({ productos: [{ ...CATALOGO_NUEVO[1], ...intento }] }));
    assert.equal(verdict.ok, false, `${JSON.stringify(intento)} tendria que rechazarse`);
    assert.match(verdict.errors.join(" · "), /clave desconocida/);
  }
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
