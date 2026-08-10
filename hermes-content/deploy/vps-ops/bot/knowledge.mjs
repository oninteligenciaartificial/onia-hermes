// ONIA — Chatbot propio: CAPA DE CONOCIMIENTO EDITABLE (los HECHOS, fuera del codigo).
//
// EL PROBLEMA QUE RESUELVE: hoy los hechos (horario de atencion, cuanto dura la demo, como se da,
// la respuesta del SIAT) viven congelados en `config.mjs`, o sea en CODIGO. Cambiar un horario
// obliga a editar, commitear y desplegar. Como siempre se agregan cosas nuevas, eso no escala y
// deja al negocio dependiendo de un desarrollador.
//
// LA FRONTERA (diseño §1): es LOGICA si equivocarse hace que el bot prometa, cotice, mienta o
// rompa un contrato de datos — eso se queda en codigo, con tests. Es HECHO si equivocarse solo lo
// hace decir algo desactualizado — eso vive en un JSON que se edita sin desplegar.
//
// CONTRATO DE ESTE MODULO, en orden de importancia:
//   1. NUNCA TIRA. Archivo ausente, roto o invalido => se sigue con los valores del codigo y el
//      bot vende igual que hoy. La degradacion es IDENTIDAD literal: sin conocimiento,
//      `withKnowledge(config)` devuelve EL MISMO objeto que recibio.
//   2. TODO O NADA. Una sola clave desconocida, un solo tipo mal o un solo string que viola el
//      guardrail rechazan el archivo ENTERO. Aceptar la mitad hace creer al editor que publico
//      algo que el bot no esta diciendo — el modo de falla que ya nos costo dias con
//      `sync-onia-core.mjs` fallando en silencio.
//   3. NI UN PRECIO NI UNA PROMESA. El allowlist no tiene ningun campo donde escribir una cifra
//      de plata, y TODO string editable pasa por `checkGuardrails()`, el mismo que vigila al LLM.
//      El bot no cotiza: el precio lo da un humano en la demo.
//   4. EL REFRESCO NO CORRE EN EL CAMINO DE LA RESPUESTA. Vencido el TTL se sirve la copia vieja
//      y se relee en segundo plano (patron de Bolivian Electric, `learned-synonyms.ts`).
//   5. LA CAPA EDITABLE SOLO SE MUEVE EN LA DIRECCION SEGURA: agrega disparadores, rubros y
//      palabras (union), nunca saca uno; elige el TEXTO de una respuesta que ya existe, nunca crea
//      un mensaje nuevo.
//
// Diseño: hermes-content/docs/ONIA_BOT_CAPA_CONOCIMIENTO_20260806.md

import { readFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";

import { DEFAULT_CONFIG, createBotConfig, demoDuration } from "./config.mjs";
import { checkGuardrails, guardrailReason, normalize } from "./guardrails.mjs";
import { MIN_LEXICON_WORD } from "./intents.mjs";

/** Version del esquema. Un archivo con otra cadena se rechaza entero (no se "migra" solo). */
export const KNOWLEDGE_SCHEMA = "onia.bot.knowledge/1";

/** 5 minutos. Vencido, se sirve la copia vieja y se relee aparte. */
export const DEFAULT_TTL_MS = 300_000;

/**
 * En el contenedor esto es `/tmp/onia-bot/knowledge.json` (el modulo vive al lado). En el repo
 * el archivo NO existe a proposito: la copia viva vive en el VPS, en `/opt/onia/bot/knowledge.json`,
 * fuera de git, para que un deploy no le pise las ediciones al que las hizo.
 */
export const DEFAULT_KNOWLEDGE_FILE = fileURLToPath(new URL("./knowledge.json", import.meta.url));

/**
 * Las UNICAS plantillas del guion que un hecho editable puede reemplazar — y la clave la fija el
 * CODIGO, no el archivo. La capa editable elige el TEXTO de una respuesta que YA EXISTE; no puede
 * inventar un mensaje nuevo ni cambiar a que rama del embudo se contesta (diseño §4, candado 1).
 * `siat` es el caso mixto declarado en §1.1: una respuesta frecuente con una fecha que caduca.
 * Un `faq[].id` que no este aca RECHAZA el archivo: una FAQ sin consumidor es una edicion que no
 * hace nada, o sea el fallo silencioso que esta capa existe para evitar.
 */
export const FAQ_TEMPLATE = Object.freeze({ siat: "M_SIAT_BODY" });

// ---------------------------------------------------------------------------
// Allowlist estricto (el candado estructural)
// ---------------------------------------------------------------------------
// Lo que no esta en esta tabla NO EXISTE. Consecuencias buscadas, no efectos secundarios:
//   - no hay clave `script` ni `M*`: la capa editable no puede inyectar un mensaje del guion;
//   - no hay `precio`, `planes`, `desde` ni `tarifa`: no hay donde escribir una cifra;
//   - no hay `optOut`: los gatillos de baja viven en el regex de intents.mjs y solo cambian por
//     commit. Quitar una baja es lo unico que quema el numero ante Meta.
// `text` = string libre que ADEMAS pasa por checkGuardrails().

const SHAPE = Object.freeze({
  schema: { kind: "const", value: KNOWLEDGE_SCHEMA, required: true },
  version: { kind: "text", max: 40 },
  updatedBy: { kind: "text", max: 60 },

  identity: {
    kind: "object",
    fields: {
      productName: { kind: "text", max: 60 },
      humanName: { kind: "text", max: 60 },
      botName: { kind: "text", max: 140 },
    },
  },

  empresa: {
    kind: "object",
    fields: {
      horario: {
        kind: "object",
        fields: {
          dias: { kind: "intArray", min: 0, max: 6, maxItems: 7 },
          desde: { kind: "int", min: 0, max: 23 },
          hasta: { kind: "int", min: 1, max: 24 },
          frase: { kind: "text", max: 80 },
        },
      },
    },
  },

  // OJO: `duracionMinutos` y `duracionFrase` van SIEMPRE JUNTOS y tienen que decir el mismo
  // numero (ver checkDemo). Es la regla que impide que la capa editable vuelva a crear la
  // contradiccion "el guion promete X, el calendario bloquea Y".
  demo: {
    kind: "object",
    fields: {
      duracionMinutos: { kind: "int", min: 5, max: 240 },
      duracionFrase: { kind: "text", max: 40 },
      modalidad: { kind: "text", max: 140 },
    },
  },

  faq: {
    kind: "array",
    maxItems: 20,
    item: {
      kind: "object",
      fields: {
        id: { kind: "enum", values: Object.keys(FAQ_TEMPLATE), required: true },
        title: { kind: "text", max: 120 },
        body: { kind: "text", max: 900, required: true },
        status: { kind: "enum", values: ["publicado", "borrador"], required: true },
        vigenteHasta: { kind: "date", nullable: true },
        tags: { kind: "textArray", maxItems: 8, max: 30 },
      },
    },
  },

  // Solo AGREGA. La union con el set del codigo la hace applyKnowledge: sacar un disparador por
  // archivo es imposible por construccion.
  triggersExtra: {
    kind: "object",
    fields: { demo: { kind: "textArray", maxItems: 30, max: 60 } },
  },

  // EL CATALOGO — que vendemos. Es la otra mitad del problema "siempre agregamos cosas nuevas":
  // `rubrosExtra` es A QUIEN le vendemos, esto es QUE le vendemos.
  // NO existe un campo "listo": cual modulo esta armado lo decide `MODULOS_LISTOS` en config.mjs,
  // congelado en codigo. Agregar un producto en construccion es libre (no promete nada);
  // declararlo terminado es una promesa comercial (N2) y sigue siendo un commit.
  productos: {
    kind: "array",
    maxItems: 8,
    item: {
      kind: "object",
      fields: {
        key: { kind: "slug", max: 24, required: true },
        nombre: { kind: "text", max: 40, required: true },
        queResuelve: { kind: "text", max: 120, required: true },
      },
    },
  },

  // EL LEXICO DE RUBROS — lo que hace que agregar un rubro sea una edicion y no un despliegue.
  // Palabras, JAMAS regex: quien edita esto no es desarrollador y una regex mala cuelga el
  // proceso. `intents.mjs` las escapa y las compila, y las agrega DESPUES de las del codigo
  // (ver lexiconOf): un rubro editable no puede robarle un match a uno versionado.
  // No hay campo para prometer un modulo: nombrar una feature que no existe es N2 disfrazado, y
  // eso sigue siendo un commit (`qualification.branches` en config.mjs).
  rubrosExtra: {
    kind: "array",
    maxItems: 12,
    item: {
      kind: "object",
      fields: {
        key: { kind: "slug", max: 24, required: true },
        label: { kind: "text", max: 40, required: true },
        fuerte: { kind: "textArray", maxItems: 40, max: 40 },
        debil: { kind: "textArray", maxItems: 20, max: 40 },
      },
    },
  },
});

// ---------------------------------------------------------------------------
// Validacion — rechazo TOTAL
// ---------------------------------------------------------------------------

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

/** El guardrail que vigila al LLM vigila tambien a los datos (diseño §4, candado 2). */
function checkText(value, path, errors) {
  const violations = checkGuardrails(value);
  for (const code of violations) {
    errors.push(`${path}: ${code} — ${guardrailReason(code)}`);
  }
}

function checkField(value, shape, path, errors) {
  switch (shape.kind) {
    case "const":
      if (value !== shape.value) errors.push(`${path}: tiene que ser exactamente "${shape.value}"`);
      return;

    case "text":
      if (typeof value !== "string") return void errors.push(`${path}: tiene que ser texto`);
      if (!value.trim()) return void errors.push(`${path}: no puede estar vacio`);
      if (value.length > shape.max) return void errors.push(`${path}: pasa de ${shape.max} caracteres`);
      checkText(value, path, errors);
      return;

    case "enum":
      if (!shape.values.includes(value)) errors.push(`${path}: solo puede ser ${shape.values.join(" | ")}`);
      return;

    // Identificador, no texto: la key del rubro se guarda en el CRM (`business_type`) y viaja al
    // panel. Sin tildes, sin espacios y sin mayusculas para que "Ferretería" y "ferreteria" no
    // terminen siendo dos rubros distintos en los tableros.
    case "slug":
      if (typeof value !== "string") return void errors.push(`${path}: tiene que ser texto`);
      if (value.length > shape.max) return void errors.push(`${path}: pasa de ${shape.max} caracteres`);
      if (!/^[a-z][a-z0-9_]*$/.test(value)) {
        errors.push(`${path}: solo minusculas, numeros y "_", empezando por letra (va al CRM como business_type)`);
      }
      return;

    case "int":
      if (!Number.isInteger(value)) return void errors.push(`${path}: tiene que ser un numero entero`);
      if (value < shape.min || value > shape.max) errors.push(`${path}: fuera de rango (${shape.min}-${shape.max})`);
      return;

    case "date":
      if (value === null) {
        if (!shape.nullable) errors.push(`${path}: no puede ser null`);
        return;
      }
      if (typeof value !== "string" || !Number.isFinite(Date.parse(value))) {
        errors.push(`${path}: tiene que ser una fecha ISO ("2026-09-30") o null`);
      }
      return;

    case "intArray":
      if (!Array.isArray(value)) return void errors.push(`${path}: tiene que ser una lista`);
      if (value.length > shape.maxItems) return void errors.push(`${path}: mas de ${shape.maxItems} items`);
      value.forEach((item, index) => checkField(item, { kind: "int", min: shape.min, max: shape.max }, `${path}[${index}]`, errors));
      return;

    case "textArray":
      if (!Array.isArray(value)) return void errors.push(`${path}: tiene que ser una lista`);
      if (value.length > shape.maxItems) return void errors.push(`${path}: mas de ${shape.maxItems} items`);
      value.forEach((item, index) => checkField(item, { kind: "text", max: shape.max }, `${path}[${index}]`, errors));
      return;

    case "array":
      if (!Array.isArray(value)) return void errors.push(`${path}: tiene que ser una lista`);
      if (value.length > shape.maxItems) return void errors.push(`${path}: mas de ${shape.maxItems} items`);
      value.forEach((item, index) => checkField(item, shape.item, `${path}[${index}]`, errors));
      return;

    case "object":
      if (!isPlainObject(value)) return void errors.push(`${path}: tiene que ser un objeto`);
      checkObject(value, shape.fields, path, errors);
      return;

    default:
      errors.push(`${path}: tipo de campo desconocido en el esquema`);
  }
}

function checkObject(value, fields, path, errors) {
  for (const [key, raw] of Object.entries(value)) {
    const shape = fields[key];
    // EL candado estructural: una clave que el esquema no declara rechaza el archivo entero.
    if (!shape) {
      errors.push(`${path ? `${path}.` : ""}${key}: clave desconocida (el esquema no la acepta)`);
      continue;
    }
    if (raw === undefined) continue;
    checkField(raw, shape, `${path ? `${path}.` : ""}${key}`, errors);
  }
  for (const [key, shape] of Object.entries(fields)) {
    if (shape.required && value[key] === undefined) errors.push(`${path ? `${path}.` : ""}${key}: falta y es obligatorio`);
  }
}

/**
 * La duracion no puede volver a decir dos cosas. Si el archivo toca la duracion, tiene que traer
 * los DOS campos y decir el mismo numero: asi la capa editable no puede prometer 15 minutos
 * mientras reserva 45.
 */
function checkDemo(demo, errors) {
  if (!isPlainObject(demo)) return;
  const tieneMinutos = demo.duracionMinutos !== undefined;
  const tieneFrase = demo.duracionFrase !== undefined;
  if (!tieneMinutos && !tieneFrase) return;
  if (!tieneMinutos || !tieneFrase) {
    errors.push("demo: `duracionMinutos` y `duracionFrase` van juntos — si cambias uno, declara el otro");
    return;
  }
  const { minutos, fraseMinutos, coherente } = demoDuration({ demo });
  if (!coherente) {
    errors.push(
      `demo: la reserva bloquea ${minutos} min y el guion promete ${fraseMinutos} — o le mentis al prospecto o le rompes la agenda. Poné el mismo número.`,
    );
  }
}

/**
 * Un rubro editable tiene que SERVIR y no puede clasificar de mas. Lo que se rechaza y por que:
 *   - sin ninguna palabra usable el matcher nunca lo lee: es una edicion que parece publicada y
 *     no hace nada, o sea el fallo silencioso que esta capa entera existe para evitar;
 *   - una palabra de 1-2 letras se cuela en medio diccionario ("ol", "sa") y manda al rubro
 *     equivocado a cualquiera que la escriba de paso;
 *   - la misma key dos veces es una contradiccion: la segunda pisa la etiqueta de la primera y no
 *     hay forma de saber cual quiso el editor.
 */
function checkRubros(rubros, errors) {
  if (!Array.isArray(rubros)) return;
  const vistas = new Set();
  rubros.forEach((rubro, index) => {
    if (!isPlainObject(rubro)) return;
    const path = `rubrosExtra[${index}]`;
    if (typeof rubro.key === "string" && rubro.key) {
      if (vistas.has(rubro.key)) errors.push(`${path}.key: "${rubro.key}" esta dos veces`);
      vistas.add(rubro.key);
    }
    const palabras = [...(Array.isArray(rubro.fuerte) ? rubro.fuerte : []), ...(Array.isArray(rubro.debil) ? rubro.debil : [])];
    const cortas = palabras.filter((word) => typeof word === "string" && normalize(word).trim().length < MIN_LEXICON_WORD);
    for (const word of cortas) errors.push(`${path}: "${word}" es muy corta (minimo ${MIN_LEXICON_WORD} letras)`);
    if (palabras.length === cortas.length) {
      errors.push(`${path}: sin palabras de al menos ${MIN_LEXICON_WORD} letras el matcher nunca lo va a leer`);
    }
  });
}

/**
 * @returns {{ok: boolean, errors: string[]}} `ok:false` = el archivo se descarta ENTERO.
 * Nunca tira: un JSON con un getter hostil no puede tumbar el bot.
 */
export function validateKnowledge(data) {
  const errors = [];
  try {
    if (!isPlainObject(data)) return { ok: false, errors: ["el archivo no es un objeto JSON"] };
    checkObject(data, SHAPE, "", errors);
    checkDemo(data.demo, errors);
    checkRubros(data.rubrosExtra, errors);
  } catch (error) {
    errors.push(`no se pudo validar: ${String(error?.message || error).slice(0, 160)}`);
  }
  return { ok: errors.length === 0, errors };
}

/** Texto crudo -> {data|null, error|null}. La validacion corre siempre. */
export function parseKnowledge(raw) {
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    return { data: null, error: `JSON invalido: ${String(error?.message || error).slice(0, 160)}` };
  }
  const verdict = validateKnowledge(parsed);
  if (!verdict.ok) {
    return {
      data: null,
      errors: verdict.errors,
      error: `RECHAZADO (${verdict.errors.length}): ${verdict.errors.join(" · ")}`.slice(0, 600),
    };
  }
  return { data: parsed, error: null, errors: [] };
}

/** Lee y valida. Archivo ausente NO es error: es el estado de hoy, 100% funcional. */
export function readKnowledgeFile(path, deps = {}) {
  try {
    const read = deps.readFileSync || readFileSync;
    return parseKnowledge(read(path, "utf8"));
  } catch (error) {
    if (error?.code === "ENOENT") return { data: null, error: null, missing: true };
    return { data: null, error: `no se pudo leer ${path}: ${String(error?.message || error).slice(0, 160)}` };
  }
}

// ---------------------------------------------------------------------------
// Cache con TTL (el refresco NUNCA en el camino de la respuesta)
// ---------------------------------------------------------------------------

const EMPTY = Object.freeze({
  data: null,
  source: "code", // "file" | "code". El paso (b) del diseño agrega "db" adelante del archivo.
  version: null,
  updatedBy: null,
  loadedAt: null,
  checkedAt: null,
  path: null,
  error: null,
});

let CACHE = EMPTY;
let refreshing = false;

/** Para los tests y para el arranque: vuelve al estado "todavia no mire el archivo". */
export function resetKnowledgeCache() {
  CACHE = EMPTY;
  refreshing = false;
}

function knowledgePath(options = {}) {
  return options.path || String(process.env.ONIA_BOT_KNOWLEDGE_FILE || "").trim() || DEFAULT_KNOWLEDGE_FILE;
}

function ttlMs(options = {}) {
  const raw = Number(options.ttlMs ?? process.env.ONIA_BOT_KNOWLEDGE_TTL_MS);
  return Number.isFinite(raw) && raw >= 0 ? raw : DEFAULT_TTL_MS;
}

/**
 * El resultado de una lectura -> el cache nuevo.
 * Si la lectura no trajo datos buenos se CONSERVA la ultima copia buena que hubiera: un archivo
 * roto no puede borrar lo que ya estaba publicado y andando.
 */
function nextCache(result, path, nowMs) {
  if (result.data) {
    return Object.freeze({
      data: result.data,
      source: "file",
      version: typeof result.data.version === "string" ? result.data.version : null,
      updatedBy: typeof result.data.updatedBy === "string" ? result.data.updatedBy : null,
      loadedAt: new Date(nowMs).toISOString(),
      checkedAt: nowMs,
      path,
      error: null,
    });
  }
  return Object.freeze({
    ...CACHE,
    source: CACHE.data ? CACHE.source : "code",
    checkedAt: nowMs,
    path,
    // Archivo ausente no es un error que haya que gritar; roto o invalido, SI.
    error: result.missing ? null : result.error || CACHE.error,
  });
}

function scheduleRefresh(path, nowMs, options = {}) {
  if (refreshing) return;
  refreshing = true;
  const read = options.readFile || readFile;
  Promise.resolve()
    .then(() => read(path, "utf8"))
    .then(
      (raw) => {
        CACHE = nextCache(parseKnowledge(raw), path, nowMs);
      },
      (error) => {
        CACHE = nextCache(
          error?.code === "ENOENT"
            ? { data: null, error: null, missing: true }
            : { data: null, error: `no se pudo releer ${path}: ${String(error?.message || error).slice(0, 160)}` },
          path,
          nowMs,
        );
      },
    )
    .catch(() => {})
    .finally(() => {
      refreshing = false;
    });
}

/**
 * El conocimiento vigente. SINCRONICO y tolerante: nunca tira y nunca espera red.
 *   - primera vez (o cambio de ruta): lectura sincronica del archivo local (arranque);
 *   - TTL vigente: devuelve el cache;
 *   - TTL vencido: DEVUELVE LA COPIA VIEJA YA y dispara la relectura aparte.
 */
export function getKnowledge(options = {}) {
  try {
    const path = knowledgePath(options);
    const nowMs = Number.isFinite(options.nowMs) ? options.nowMs : Date.now();
    if (CACHE.path !== path) {
      // Cambio la ruta: lo que habia era de OTRO archivo y no se hereda.
      CACHE = EMPTY;
      CACHE = nextCache(readKnowledgeFile(path, options), path, nowMs);
    } else if (CACHE.checkedAt === null) {
      CACHE = nextCache(readKnowledgeFile(path, options), path, nowMs);
    } else if (nowMs - CACHE.checkedAt >= ttlMs(options)) {
      scheduleRefresh(path, nowMs, options);
    }
    return CACHE;
  } catch {
    return CACHE; // el cargador jamas puede romper un turno
  }
}

/** Lo que /health tiene que decir para que "edite y no pasó nada" no tarde dias en descubrirse. */
export function knowledgeHealth(options = {}) {
  const state = getKnowledge(options);
  return {
    source: state.source,
    version: state.version,
    updatedBy: state.updatedBy,
    faq: Array.isArray(state.data?.faq) ? state.data.faq.length : 0,
    triggersDemo: Array.isArray(state.data?.triggersExtra?.demo) ? state.data.triggersExtra.demo.length : 0,
    rubros: Array.isArray(state.data?.rubrosExtra) ? state.data.rubrosExtra.length : 0,
    productos: Array.isArray(state.data?.productos) ? state.data.productos.length : 0,
    loadedAt: state.loadedAt,
    path: state.path,
    lastError: state.error,
  };
}

// ---------------------------------------------------------------------------
// Aplicar los hechos sobre la config
// ---------------------------------------------------------------------------

/** Una FAQ vencida NO se sirve: el bot afirmando algo que ya no es cierto es el peor daño. */
function faqVigente(item, nowIso) {
  if (item.status !== "publicado") return false;
  if (!item.vigenteHasta) return true;
  const raw = String(item.vigenteHasta);
  // Fecha sola = vale HASTA EL FINAL de ese dia (si no, caduca un dia antes de lo que dice).
  const hasta = Date.parse(raw.length === 10 ? `${raw}T23:59:59Z` : raw);
  return !Number.isFinite(hasta) || hasta >= Date.parse(nowIso);
}

/**
 * config + hechos = config. Puro: no lee archivos ni cachea.
 * Sin datos devuelve EL MISMO objeto (identidad), que es como degrada todo el modulo.
 */
export function applyKnowledge(base = DEFAULT_CONFIG, data = null, options = {}) {
  if (!data) return base;
  const nowIso = options.nowIso || new Date().toISOString();
  const overrides = {};

  if (isPlainObject(data.identity)) overrides.identity = { ...base.identity, ...data.identity };

  const horario = data.empresa?.horario;
  if (isPlainObject(horario)) {
    const businessHours = { ...base.businessHours };
    if (Array.isArray(horario.dias)) businessHours.days = [...horario.dias];
    if (Number.isInteger(horario.desde)) businessHours.startHour = horario.desde;
    if (Number.isInteger(horario.hasta)) businessHours.endHour = horario.hasta;
    if (horario.frase) businessHours.frase = horario.frase;
    overrides.businessHours = businessHours;
  }

  // `pendiente` NO se acepta del archivo: el validador ya exige que la duracion editada sea
  // coherente, asi que por esta capa la divergencia no puede entrar ni declarada.
  if (isPlainObject(data.demo)) {
    overrides.demo = { ...base.demo, ...data.demo, pendiente: data.demo.duracionMinutos !== undefined ? false : base.demo.pendiente };
  }

  // El catalogo REEMPLAZA al del codigo (no es union como los rubros): una lista de productos
  // vieja no rompe nada, solo dice algo desactualizado — la definicion misma de "hecho". Lo que
  // no se puede es declarar un modulo listo: eso no tiene campo.
  if (Array.isArray(data.productos) && data.productos.length) overrides.productos = data.productos;

  // El lexico viaja CRUDO (palabras) hasta intents.mjs, que es el unico que sabe compilarlo y el
  // unico que puede garantizar el orden codigo-primero. Compilarlo aca seria partir esa regla en
  // dos archivos.
  if (Array.isArray(data.rubrosExtra) && data.rubrosExtra.length) overrides.rubrosExtra = data.rubrosExtra;

  const extraDemo = data.triggersExtra?.demo;
  if (Array.isArray(extraDemo) && extraDemo.length) {
    // UNION con el codigo: agregar es libre, quitar es imposible (diseño §4, candado 4).
    const union = new Set([...(base.triggers?.demo || []), ...extraDemo.map((word) => String(word).toLowerCase().trim())]);
    overrides.triggers = { ...base.triggers, demo: [...union].filter(Boolean) };
  }

  const script = {};
  for (const item of Array.isArray(data.faq) ? data.faq : []) {
    const templateKey = FAQ_TEMPLATE[item?.id];
    if (templateKey && faqVigente(item, nowIso)) script[templateKey] = item.body;
  }
  if (Object.keys(script).length) overrides.script = { ...base.script, ...script };

  return Object.keys(overrides).length ? createBotConfig(overrides, base) : base;
}

/**
 * La config del turno con los hechos editables aplicados. Es LO UNICO que llaman run-turn.mjs y
 * followup-run.mjs. Sin archivo (el estado de hoy) devuelve la misma config que recibio.
 */
export function withKnowledge(config = DEFAULT_CONFIG, options = {}) {
  try {
    const state = getKnowledge(options);
    return state.data ? applyKnowledge(config, state.data, options) : config;
  } catch {
    return config;
  }
}

// ---------------------------------------------------------------------------
// CLI: la compuerta de PUBLICACION (`node knowledge.mjs --check [ruta]`)
// ---------------------------------------------------------------------------
// El mismo validador corre dos veces (diseño §4, candado 3): al publicar, para devolverle al
// editor la linea exacta y el codigo violado; y al cargar, por si alguien edito el archivo a mano
// por SSH salteandose el paso anterior. `webhook-server.sh knowledge` usa esto.

/**
 * EL BANCO COMO COMPUERTA (diseño §4): un lexico que hace bajar el banco NO se publica.
 * Corre solo si el archivo trae `rubrosExtra`, que es el unico bloque capaz de cambiar a que
 * rubro se clasifica una conversacion — el resto solo cambia texto. Una palabra demasiado amplia
 * ("local", "estudio") no se ve leyendo el JSON: se ve cuando 60 conversaciones reales cambian de
 * rama, y eso es exactamente lo que mide el banco.
 *
 * El import es DINAMICO a proposito: el runtime del bot no carga nunca los 60 casos ni el motor
 * de evaluacion. Si el banco no se puede correr, la publicacion se FRENA: publicar a ciegas el
 * unico bloque que puede romper la clasificacion es peor que no publicar.
 */
async function benchGate(data) {
  let bench;
  let cases;
  try {
    [bench, cases] = await Promise.all([import("./bench.mjs"), import("./bench-cases.mjs")]);
  } catch (error) {
    return [`no se pudo correr el banco: ${String(error?.message || error).slice(0, 160)}`];
  }
  const score = (config) => bench.summarizeOutcomes(cases.BENCH_CASES.map((item) => bench.evaluateCase(item, config)));
  const antes = score(bench.BENCH_CONFIG);
  const despues = score(applyKnowledge(bench.BENCH_CONFIG, data));
  if (despues.hits >= antes.hits && despues.datosInventados <= antes.datosInventados) return [];
  return [
    `el banco BAJA con este archivo: ${antes.hits}/${antes.total} -> ${despues.hits}/${despues.total}` +
      (despues.datosInventados > antes.datosInventados
        ? ` · datos inventados: ${antes.datosInventados} -> ${despues.datosInventados}`
        : ""),
    "revisa las palabras de `rubrosExtra`: una demasiado amplia clasifica mal (las genericas van en `debil`)",
    "para ver caso por caso: node bench.mjs",
  ];
}

export async function checkCli(argv = [], deps = {}) {
  const path = argv.find((arg) => !arg.startsWith("--")) || knowledgePath();
  const result = readKnowledgeFile(path, deps);
  if (result.missing) return { code: 1, lines: [`no existe ${path}`] };
  if (result.data) {
    const rubros = result.data.rubrosExtra || [];
    const problemas = rubros.length ? await benchGate(result.data) : [];
    if (problemas.length) {
      return { code: 1, lines: [`RECHAZADO ${path} (compuerta del banco)`, ...problemas.map((line) => `  - ${line}`)] };
    }
    return {
      code: 0,
      lines: [
        `OK ${path}`,
        `  version: ${result.data.version || "(sin version)"} · por: ${result.data.updatedBy || "(sin autor)"}`,
        `  faq: ${(result.data.faq || []).length} · disparadores extra: ${(result.data.triggersExtra?.demo || []).length} · productos: ${(result.data.productos || []).length}`,
        `  rubros: ${rubros.length}${rubros.length ? ` (${rubros.map((rubro) => rubro.key).join(", ")}) · banco OK` : ""}`,
      ],
    };
  }
  return { code: 1, lines: [`RECHAZADO ${path}`, ...(result.errors || [result.error]).map((error) => `  - ${error}`)] };
}

const invokedDirectly = Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href;
if (invokedDirectly) {
  const { code, lines } = await checkCli(process.argv.slice(2));
  process.stdout.write(`${lines.join("\n")}\n`);
  process.exitCode = code;
}
