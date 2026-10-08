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
import { fraseDeAtencion } from "./ventanas-de-atencion.mjs";

/** Version del esquema. Un archivo con otra cadena se rechaza entero (no se "migra" solo). */
export const KNOWLEDGE_SCHEMA = "onia.bot.knowledge/1";

/** 5 minutos. Vencido, se sirve la copia vieja y se relee aparte. */
export const DEFAULT_TTL_MS = 300_000;

export const MIN_ESPERA_INSISTENCIA_HORAS = 1;

/**
 * La espera mas larga que el barrido de la insistencia alcanza a EJECUTAR.
 *
 * No es una decision de diseño: `sweepInsistenciaCandidates` (persistence.mjs) solo
 * mira las filas que siguen dentro de la ventana de servicio del canal, porque
 * pasada esa ventana al negocio solo le queda la plantilla aprobada. Una espera de
 * `windowClosesAtHours` o mas sale del rango antes de volverse elegible: no produce
 * envio nunca, y sin dejar rastro. Por eso el techo se DERIVA de la ventana y no se
 * tipea — mover una sola de las dos puntas es como nacio este bug (2026-09-13).
 */
export const MAX_ESPERA_INSISTENCIA_HORAS = DEFAULT_CONFIG.followUp.windowClosesAtHours - 1;

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
export const FAQ_TEMPLATE = Object.freeze({
  siat: "M_SIAT_BODY",
  // "precios": la respuesta a "¿cuanto cuesta?" en modo VENTA (inbox 4 web y 5 WhatsApp).
  // M4_BODY es la plantilla que ya sirve `isPriceQuestion` en bot-engine.mjs, asi que esto NO
  // inventa una rama nueva: cambia el TEXTO de una respuesta que el embudo ya daba.
  // Decision de Sergio via sesion de control (2026-09-03, t_0651707c): el bot dice los precios
  // publicos. Es la unica FAQ que puede traer cifras, y solo las de precios-publicos.mjs.
  precios: "M4_BODY",
  // "negocio": la FAQ editable del dueño (decision Sergio 2026-08-28). NO pisa un mensaje del
  // guion: el recepcionista la consume como LISTA (varias FAQs, cada una con sus tags como
  // disparadores) y la sirve via la plantilla R_FAQ_NEGOCIO. Control de calidad: guardrails
  // sobre cada texto + checkFaqNegocio (sin disparador se rechaza) + vigencia.
  negocio: "R_FAQ_NEGOCIO",
});

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
  // Insistencia (v6.6, decision Sergio 2026-08-30: ENCENDIDA por defecto): si el
  // cliente deja de responder, el asistente insiste UNA vez pasadas `horas`.
  // La ausencia del campo = encendida con 2 horas (el default vive en quien lo lee,
  // no aca — un doc viejo sin el campo no debe fallar la validacion).
  // El techo se DERIVA de la ventana de servicio (ver MAX_ESPERA_INSISTENCIA_HORAS):
  // hasta el 2026-09-13 era un 48 tipeado y aceptaba esperas que el barrido no
  // alcanza a ejecutar jamas — el dueño creia tener insistencia y no tenia nada.
  seguimiento: {
    kind: "object",
    fields: {
      activo: { kind: "bool" },
      horas: { kind: "int", min: MIN_ESPERA_INSISTENCIA_HORAS, max: MAX_ESPERA_INSISTENCIA_HORAS },
    },
  },

  // Frases de campaña (2026-08-31, gap Sendy): la frase EXACTA que un link
  // wa.me?text= o un anuncio precarga, y la respuesta del dueño para ese embudo.
  // Ambos son kind text: los guardrails los vigilan como a todo dato del doc.
  campanas: {
    kind: "array",
    maxItems: 10,
    item: {
      kind: "object",
      fields: {
        frase: { kind: "text", max: 200, required: true },
        respuesta: { kind: "text", max: 500, required: true },
        // Opt-in: la frase es un PREFIJO y el mensaje puede seguir (link con el texto abierto,
        // ej. "...Mi negocio es: " en /v1/empezar). Sin el campo, el match es del mensaje entero.
        prefijo: { kind: "bool" },
      },
    },
  },

  faq: {
    kind: "array",
    maxItems: 20,
    // La FAQ `precios` es la UNICA que puede traer cifras de plata, y aun asi solo las que estan
    // en precios-publicos.mjs (atadas a los dos .ts por precios-publicos.test.mjs). Cualquier otra
    // FAQ sigue en modo estricto: una cifra ahi rechaza el archivo entero, como siempre.
    opcionesPorItem: (item) => (item?.id === "precios" ? { preciosPublicos: true } : {}),
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
    // Modulos + servicios en la misma lista. El tope existe para que la respuesta siga entrando
    // de un vistazo en WhatsApp, no por capricho: cada modulo es una viñeta.
    maxItems: 16,
    item: {
      kind: "object",
      fields: {
        key: { kind: "slug", max: 24, required: true },
        // `servicio` = trabajo que ya entregamos (web, chatbot, videos). `modulo` (el default) =
        // software de la plataforma, y ESE pasa por MODULOS_LISTOS.
        tipo: { kind: "enum", values: ["modulo", "servicio"] },
        nombre: { kind: "text", max: 60, required: true },
        queResuelve: { kind: "text", max: 120 },
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
function checkText(value, path, errors, opciones = {}) {
  const violations = checkGuardrails(value, opciones);
  for (const code of violations) {
    errors.push(`${path}: ${code} — ${guardrailReason(code)}`);
  }
}

function checkField(value, shape, path, errors, opciones = {}) {
  switch (shape.kind) {
    case "const":
      if (value !== shape.value) errors.push(`${path}: tiene que ser exactamente "${shape.value}"`);
      return;

    case "text":
      if (typeof value !== "string") return void errors.push(`${path}: tiene que ser texto`);
      if (!value.trim()) return void errors.push(`${path}: no puede estar vacio`);
      if (value.length > shape.max) return void errors.push(`${path}: pasa de ${shape.max} caracteres`);
      checkText(value, path, errors, opciones);
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

    case "bool":
      if (typeof value !== "boolean") errors.push(`${path}: tiene que ser true o false`);
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
      value.forEach((item, index) => checkField(item, { kind: "text", max: shape.max }, `${path}[${index}]`, errors, opciones));
      return;

    case "array":
      if (!Array.isArray(value)) return void errors.push(`${path}: tiene que ser una lista`);
      if (value.length > shape.maxItems) return void errors.push(`${path}: mas de ${shape.maxItems} items`);
      // `opcionesPorItem` deja que un item elija con que reglas se lo valida segun su propio
      // contenido — hoy solo la FAQ `precios`, que es la unica autorizada a traer cifras.
      value.forEach((item, index) =>
        checkField(
          item,
          shape.item,
          `${path}[${index}]`,
          errors,
          typeof shape.opcionesPorItem === "function" ? shape.opcionesPorItem(item) : opciones,
        ),
      );
      return;

    case "object":
      if (!isPlainObject(value)) return void errors.push(`${path}: tiene que ser un objeto`);
      checkObject(value, shape.fields, path, errors, opciones);
      return;

    default:
      errors.push(`${path}: tipo de campo desconocido en el esquema`);
  }
}

function checkObject(value, fields, path, errors, opciones = {}) {
  for (const [key, raw] of Object.entries(value)) {
    const shape = fields[key];
    // EL candado estructural: una clave que el esquema no declara rechaza el archivo entero.
    if (!shape) {
      errors.push(`${path ? `${path}.` : ""}${key}: clave desconocida (el esquema no la acepta)`);
      continue;
    }
    if (raw === undefined) continue;
    checkField(raw, shape, `${path ? `${path}.` : ""}${key}`, errors, opciones);
  }
  for (const [key, shape] of Object.entries(fields)) {
    if (shape.required && value[key] === undefined) errors.push(`${path ? `${path}.` : ""}${key}: falta y es obligatorio`);
  }
}

/**
 * El horario del negocio es un RANGO, y un rango se valida cruzando sus extremos. El SHAPE los
 * mira de a uno (`desde` 0..23, `hasta` 1..24) y asi entraba 18 -> 02: `applyKnowledge` lo copia
 * a `startHour: 18, endHour: 2`, que para el motor es un rango VACIO — el bot del cliente contesta
 * lo contrario de su horario las 24 h, y el dueño no tiene forma de enterarse.
 *
 * Los dos extremos van JUNTOS por la misma razon que `duracionMinutos`/`duracionFrase`: declarar
 * uno solo hereda el otro del base (`startHour: 9, endHour: 22`, que son los de Sergio Urcullo),
 * asi que `desde: 23` a secas produce el mismo rango vacio sin traer el campo que lo delataria.
 *
 * Cruzar la medianoche es un horario legitimo (un bar, una farmacia de turno) y el motor todavia
 * no sabe representarlo: mientras no sepa, se RECHAZA en vez de guardarse al reves.
 */
function checkHorario(empresa, errors) {
  if (!isPlainObject(empresa)) return;
  const horario = empresa.horario;
  if (!isPlainObject(horario)) return;
  const tieneDesde = horario.desde !== undefined;
  const tieneHasta = horario.hasta !== undefined;
  if (!tieneDesde && !tieneHasta) return;
  if (!tieneDesde || !tieneHasta) {
    errors.push(
      "empresa.horario: `desde` y `hasta` van juntos — declarar uno solo hereda el otro del horario de Onia y te deja un horario que no es el tuyo",
    );
    return;
  }
  if (!Number.isInteger(horario.desde) || !Number.isInteger(horario.hasta)) return; // ya lo dijo el SHAPE
  if (horario.hasta <= horario.desde) {
    errors.push(
      `empresa.horario: cierra antes de abrir (${horario.desde} -> ${horario.hasta}), asi no atiende ninguna hora del dia. Un horario que cruza la medianoche todavia no se puede cargar: parti el dia o escribilo en \`frase\`.`,
    );
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
/**
 * Un MODULO sin `queResuelve` sale como una viñeta con un nombre y nada mas — el prospecto lee
 * "Dental." y sigue sin saber que hace. En los servicios no aplica: van en una frase, donde el
 * nombre ya alcanza ("la web de tu negocio").
 */
function checkProductos(productos, errors) {
  if (!Array.isArray(productos)) return;
  productos.forEach((producto, index) => {
    if (!isPlainObject(producto)) return;
    if (producto.tipo !== "servicio" && producto.queResuelve === undefined) {
      errors.push(`productos[${index}].queResuelve: un módulo tiene que decir qué resuelve (los servicios no lo necesitan)`);
    }
  });
}

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
/** La FAQ del negocio SIN palabras disparadoras nunca se va a servir: se rechaza al publicar,
 *  con el motivo claro, en vez de aceptar una edicion que no hace nada (fallo silencioso). */
function checkFaqNegocio(faq, errors) {
  if (!Array.isArray(faq)) return;
  faq.forEach((item, index) => {
    if (!item || item.id !== "negocio") return;
    const tags = Array.isArray(item.tags) ? item.tags : [];
    const utiles = tags.filter((tag) => normalize(tag).trim().length >= MIN_LEXICON_WORD);
    if (!utiles.length) {
      errors.push(
        `faq[${index}]: la FAQ del negocio necesita al menos una palabra disparadora de ${MIN_LEXICON_WORD}+ letras en tags — sin eso el bot nunca la usa`,
      );
    }
  });
}

export function validateKnowledge(data) {
  const errors = [];
  try {
    if (!isPlainObject(data)) return { ok: false, errors: ["el archivo no es un objeto JSON"] };
    checkObject(data, SHAPE, "", errors);
    checkHorario(data.empresa, errors);
    checkDemo(data.demo, errors);
    checkProductos(data.productos, errors);
    checkRubros(data.rubrosExtra, errors);
    checkFaqNegocio(data.faq, errors);
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
  // "db" | "panel" | "file" | "code". "db" = la fila publicada POR ORG (paso b), delante de todo.
  // "panel" = la fila publicada de la ORG INTERNA de Onia (F2.1): el conocimiento del bot de
  // VENTAS editado en el panel, delante del archivo y detras de la fila por org.
  source: "code",
  // Solo lo trae la fuente "db": el slug de la agenda publica de esa org. null = sin agenda.
  orgSlug: null,
  // Solo la fuente "db": { agotada, usadas, limite } de la cuota mensual. null = no se sabe = atender.
  cuota: null,
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
  PANEL_CACHE = EMPTY;
  panelRefreshing = false;
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
    // Un archivo AUSENTE sin copia buena en memoria NO cuenta como "ya lo mire": se deja la cache
    // fria para que el turno siguiente vuelva a mirar. Si se marcaba, una ausencia de dos segundos
    // —la ventana en que `webhook-server.sh` hace `rm -rf /tmp/onia-bot` antes del `docker cp`, con
    // el proceso vivo corriendo DESDE ahi— congelaba al bot SIN CONOCIMIENTO el TTL entero: cinco
    // minutos contestandole "no te quiero tirar una cifra" a quien pregunta el precio, y curandose
    // solo, que es exactamente el sintoma medido el 2026-09-12 (conv 49, 22:48 UTC, mismo PID).
    // Cuesta un ENOENT por turno mientras no haya archivo, y ni eso apenas aparece.
    // ⚠️ NO se derrama a las fuentes `db`/`panel` (nextOrgCache, nextPanelCache) y es deliberado:
    // ahi "ausente" es un 404 por RED, reintentarlo por turno pone un fetch en el camino de la
    // respuesta, y su degradacion cae a este archivo — que sigue teniendo los precios.
    checkedAt: result.missing && !CACHE.data ? null : nowMs,
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

// ---------------------------------------------------------------------------
// Fuente "db" (paso b): la fila publicada POR ORGANIZACION, via HTTP al producto
// ---------------------------------------------------------------------------
// El motor NO toca la base del producto: el producto expone la fila publicada en
// GET /api/chatbot-knowledge/published (Bearer BOT_KNOWLEDGE_SECRET) y aca solo
// se consume. Mismo contrato que el archivo: TTL, degradacion a archivo/codigo,
// y el MISMO validador — un documento que el archivo rechazaria, la db tampoco entra.

const DB_TIMEOUT_MS = 5000;
const ORG_CACHE = new Map(); // clave (org o "inbox:<id>") -> mismo shape que CACHE, con source "db"
const orgRefreshing = new Set();

/**
 * La clave de cache de la copia db. `organizationId` explicito manda (/preview);
 * sin el, el inbox de Chatwoot que trajo la conversacion keyea como "inbox:<id>"
 * y ES EL PRODUCTO quien lo resuelve a una org (clinic_settings.chatwootInboxId)
 * — el motor no conoce el mapeo y no lo duplica.
 */
function cacheKeyOf(options = {}) {
  const org = String(options.organizationId || "").trim();
  if (org) return org;
  const inbox = String(options.inboxId ?? "").trim();
  return inbox ? `inbox:${inbox}` : "";
}

/** La query que entiende GET /published segun la clave: org directa o inbox a resolver. */
function publishedQuery(key) {
  return key.startsWith("inbox:")
    ? `inboxId=${encodeURIComponent(key.slice("inbox:".length))}`
    : `organizationId=${encodeURIComponent(key)}`;
}

/** Para los tests: olvida todas las copias por organizacion. */
export function resetOrgKnowledgeCache() {
  ORG_CACHE.clear();
  orgRefreshing.clear();
}

/**
 * El organizationId de la org interna de Onia, leido de la URL de la fuente "panel"
 * (`ONIA_KNOWLEDGE_URL`), que es el UNICO lugar que lo declara. Sin la fuente panel
 * configurada no hay org interna que distinguir y la guarda no aplica.
 */
function orgInternaDe(options = {}) {
  const { url } = panelConfig(options);
  if (!url) return null;
  try {
    return new URL(url).searchParams.get("organizationId") || null;
  } catch {
    return null;
  }
}

function dbConfig(options = {}) {
  return {
    url: String(options.dbUrl ?? process.env.ONIA_BOT_KNOWLEDGE_URL ?? "").trim(),
    secret: String(options.dbSecret ?? process.env.BOT_KNOWLEDGE_SECRET ?? "").trim(),
    timeoutMs: Number.isFinite(options.dbTimeoutMs) ? options.dbTimeoutMs : DB_TIMEOUT_MS,
    fetch: options.fetch || globalThis.fetch,
  };
}

/**
 * ¿Este inbox es de ALGUIEN QUE NO ES ONIA? Un solo lugar para las dos causas, porque las dos
 * tienen la misma consecuencia y olvidar una es servirle el guion de venta de Onia al cliente
 * final de otro negocio. `huerfano` = de ninguna org · `ajena` = de una org cliente que hoy no
 * tiene documento servible (add-on apagado, nada publicado, borrador sin publicar).
 */
export function esAjenoAOnia(state) {
  return state?.huerfano === true || state?.ajena === true;
}

/**
 * ¿Este inbox es de UNA org CLIENTE, sin dudas? La pregunta que hace la plataforma antes de
 * actuar sobre un mensaje de ese canal (`orgDelInbox(inboxId).resultado === "org"`), contestada
 * con lo que este motor YA resolvio por la misma via (GET /published) y ya tiene en cache.
 *
 * NO es `esAjenoAOnia` y no se puede reusar: esa pregunta mete en la misma bolsa al huerfano y al
 * conflicto porque para servir conocimiento los dos se tratan igual (neutro, nunca el guion de
 * venta). Aca la consecuencia es otra — CALLARSE porque la plataforma contesta — y la plataforma
 * NO contesta ni en el huerfano (`sin_org`) ni en el conflicto: callarse ahi es dejar a la persona
 * sin nadie.
 *
 *   - huerfano o conflicto           -> false (la plataforma tampoco tiene dueño para el canal)
 *   - la ULTIMA lectura fallo        -> false (`error`: la plataforma no contesto o contesto
 *                                              roto. Es la MISMA plataforma que tendria que
 *                                              contestarle a la persona, y una copia "db" vieja
 *                                              no prueba que hoy este para hacerlo)
 *   - ajena con organizationId       -> true  (cliente sin documento servible hoy: la plataforma
 *                                              igual lo resuelve a su org, el add-on no importa)
 *                                              SALVO que esa org sea la INTERNA de Onia:
 *                                              defensa adicional al filtro de fetchOrgKnowledge.
 *   - fila publicada (`source` "db") -> true  (la org interna de Onia NUNCA llega aca como "db":
 *                                              `fetchOrgKnowledge` la convierte en "sin fila")
 *   - cualquier otra cosa            -> false (inbox de Onia, fuente apagada, cache fria sin
 *                                              respuesta: no se sabe, y ante la duda se contesta
 *                                              como siempre)
 *
 * `options` es el MISMO objeto con el que se resolvio el estado: de ahi sale la org interna
 * (`ONIA_KNOWLEDGE_URL`). Sin esa variable no hay org interna que distinguir — y entonces tampoco
 * la distingue `fetchOrgKnowledge`, que es la otra mitad de esta guarda.
 */
export function esInboxDeCliente(state, options = {}) {
  if (!state || state.huerfano === true || state.conflicto === true) return false;
  if (state.error) return false;
  if (state.ajena === true) {
    const org = String(state.organizationId || "").trim();
    return Boolean(org) && org !== orgInternaDe(options);
  }
  return state.source === "db";
}

/** Sin URL o sin secreto la fuente esta APAGADA y eso NO es un error: es el estado de hoy. */
async function fetchOrgKnowledge(key, options = {}) {
  const { url, secret, timeoutMs, fetch: doFetch } = dbConfig(options);
  if (!url || !secret || typeof doFetch !== "function") return { data: null, error: null, missing: true };
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    let res;
    try {
      res = await doFetch(`${url}?${publishedQuery(key)}`, {
        headers: { authorization: `Bearer ${secret}` },
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timer);
    }
    // 404 = el producto no tiene conocimiento para esa clave, y NO significa siempre lo mismo:
    // `published/route.ts` manda el `organizationId` en el cuerpo cuando el inbox SI resolvio a
    // una org (add-on apagado, nada publicado, borrador sin publicar) y lo OMITE solo cuando
    // ningun `clinic_settings` reclama ese inbox. Su comentario es textual: "Un 404 SIN
    // organizationId sigue significando 'inbox sin org'".
    //   - sin org  -> HUERFANO: no es de nadie.
    //   - con org interna -> venta, como el 200.
    //   - con otra org -> CLIENTE que hoy no tiene documento servible.
    // Huerfanos y clientes cortan el fallback (abajo es el guion de venta de Onia, y servirselo a cualquiera
    // de los dos es cotizarle Onia a los clientes de otro negocio), pero no son el mismo hecho:
    // aplanarlos declaraba "ese inbox no es de NINGUNA org" sobre el WhatsApp de un cliente que
    // paga, y ese estado se publica en `/health?inboxId=N`.
    if (res.status === 404 || res.status === 409) {
      if (res.status === 404 && !key.startsWith("inbox:")) return { data: null, error: null, missing: true };
      // El cuerpo de un 404 puede no ser JSON (proxy, error de red a mitad): sin cuerpo legible
      // no se puede afirmar que sea de una org, y "no es de nadie" es la lectura conservadora —
      // corta igual y no le atribuye el inbox a un cliente que quiza no existe.
      let orgDelCuerpo = "";
      try {
        const cuerpo = await res.json();
        orgDelCuerpo = typeof cuerpo?.organizationId === "string" ? cuerpo.organizationId.trim() : "";
      } catch {
        orgDelCuerpo = "";
      }
      // La org interna vende aun sin fila publicada, igual que en el camino 200.
      if (orgDelCuerpo && orgDelCuerpo === orgInternaDe(options)) {
        return { data: null, error: null, missing: true };
      }
      // Sin la org interna explicita, el conflicto sigue siendo ajeno, no huerfano.
      if (res.status === 409) {
        return { data: null, error: null, missing: true, huerfano: false, ajena: true, conflicto: true };
      }
      return {
        data: null,
        error: null,
        missing: true,
        huerfano: !orgDelCuerpo,
        ajena: Boolean(orgDelCuerpo),
        organizationId: orgDelCuerpo || null,
      };
    }
    if (!res.ok) return { data: null, error: `la db contesto HTTP ${res.status}` };
    const body = await res.json();
    // LA ORG INTERNA NO ES UN CLIENTE (medido en prod 2026-09-13). El producto resuelve
    // inbox->org, y los inboxes de VENTA (4 web, 5 WhatsApp) resuelven a la org interna de
    // Onia: con su fila del panel publicada, esta fuente la devolvia como "db" y
    // asRecepcionista le ponia el menu de recepcion a los leads del widget. Esa fila entra
    // SOLO por la fuente "panel" (mergeada sobre el archivo, modo venta): por aca se trata
    // como "sin fila" para que el flujo caiga exactamente ahi.
    const interna = orgInternaDe(options);
    if (interna && String(body?.organizationId || "") === interna) {
      return { data: null, error: null, missing: true };
    }
    const verdict = validateKnowledge(body?.data);
    if (!verdict.ok) {
      return { data: null, error: `RECHAZADO (${verdict.errors.length}): ${verdict.errors.join(" · ")}`.slice(0, 600) };
    }
    // `orgSlug` es la agenda publica de esa org (`/book/<slug>`), y el producto lo manda SOLO si
    // la org de verdad puede recibir reservas (add-on / plan). Que falte no es un error: es una
    // org sin agenda, y el bot vuelve a derivar la cita a un humano (recepcionista.mjs).
    const orgSlug = typeof body?.orgSlug === "string" ? body.orgSlug.trim() : "";
    return { data: body.data, orgSlug: orgSlug || null, cuota: cuotaDe(body?.cuota), error: null };
  } catch (error) {
    return { data: null, error: `no se pudo leer la db: ${String(error?.message || error).slice(0, 160)}` };
  }
}

/**
 * La CUOTA MENSUAL de la org, tal como la manda /published (lote 4, 2026-09-03):
 * `{ agotada, usadas, limite }`. null = el producto no pudo leerla (o no la manda todavia) y
 * entonces el bot SIGUE ATENDIENDO (fail-open): cortar por un dato que no existe es callar.
 */
function cuotaDe(raw) {
  if (!raw || typeof raw !== "object" || typeof raw.agotada !== "boolean") return null;
  return { agotada: raw.agotada, usadas: Number(raw.usadas) || 0, limite: Number(raw.limite) || 0 };
}

/**
 * LA MISMA PREGUNTA PARA TODOS: ¿esta org agoto su cuota del mes?
 *
 * `true` = nadie le escribe. Ni el motor cuando el cliente del cliente pregunta (barrera 1b de
 * bot-engine.mjs), ni los BARRIDOS proactivos, que hasta el 2026-09-04 seguian mandando por su
 * cuenta: un negocio cortado por cuota igual gastaba mensajes salientes que Meta cobra, sin que
 * nadie los pidiera. `null`/ausente = no se sabe = se atiende, igual que el motor (fail-open).
 */
export function cuotaAgotada(config) {
  return config?.cuota?.agotada === true;
}

/**
 * Igual que nextCache: un fetch fallido CONSERVA la ultima copia buena de esa org.
 *
 * PERO NO LA CUOTA (2026-09-04). El conocimiento es CONTENIDO y envejece bien: una FAQ vieja
 * sigue sirviendo. `cuota` no es contenido, es un INTERRUPTOR DE CORTE, y heredarlo invierte el
 * riesgo: con `agotada:true` guardado, cualquier tramo sin producto (un deploy de onia-platform,
 * un 404 porque el dueño apago y prendio el add-on, la red) deja al bot contestando "cupo lleno"
 * a TODOS los que le escriban a ese cliente — y el 1 del mes que viene, con el cupo ya renovado,
 * la unica forma de soltarlo seria reiniciar el proceso. Sin dato fresco vuelve a `null`, que es
 * lo que `cuotaDe` ya define para un dato ausente o malformado: no se sabe = se atiende.
 */
function nextOrgCache(prev, result, organizationId, nowMs) {
  if (result.data) {
    return Object.freeze({
      data: result.data,
      source: "db",
      orgSlug: result.orgSlug || null,
      cuota: result.cuota || null,
      version: typeof result.data.version === "string" ? result.data.version : null,
      updatedBy: typeof result.data.updatedBy === "string" ? result.data.updatedBy : null,
      loadedAt: new Date(nowMs).toISOString(),
      checkedAt: nowMs,
      path: `db:${organizationId}`,
      error: null,
    });
  }
  const base = prev || EMPTY;
  return Object.freeze({
    ...base,
    cuota: null, // el corte NO se hereda de una lectura que fallo (ver el comentario de arriba)
    source: base.data ? base.source : "code",
    checkedAt: nowMs,
    path: `db:${organizationId}`,
    // DE QUIEN ES ESTE INBOX viaja con el estado: es lo unico que distingue a un canal ajeno de
    // un inbox de Onia, y sin el dato el fallback le sirve el guion de venta a un canal ajeno.
    // Se RE-DERIVA en cada lectura (nunca se hereda): el dia que alguien registre ese inbox, la
    // lectura siguiente trae fila y deja de ser ajeno sin reiniciar el proceso.
    //   `huerfano` = no es de NINGUNA org · `ajena` = es de una org CLIENTE sin documento hoy.
    // Son excluyentes y los dos cortan (ver `esAjenoAOnia`); separarlos es lo que hace que
    // `/health` diga la verdad sobre el inbox recien nacido de un Embedded Signup.
    huerfano: result.huerfano === true,
    ajena: result.ajena === true,
    organizationId: result.organizationId ?? null,
    // El 409 se guarda CON NOMBRE y no solo como "ajena sin organizationId": `esInboxDeCliente`
    // tiene que poder decir "dos orgs lo reclaman" sin deducirlo de un hueco. Deducido, alcanza
    // con que manana el 409 traiga a un reclamante en el cuerpo para que el conflicto se lea como
    // "es de ese cliente" — y ahi el bot se calla esperando a una plataforma que tampoco contesta.
    conflicto: result.conflicto === true,
    error: result.missing ? null : result.error || base.error,
  });
}

function scheduleOrgRefresh(key, nowMs, options = {}) {
  if (orgRefreshing.has(key)) return;
  orgRefreshing.add(key);
  Promise.resolve()
    .then(() => fetchOrgKnowledge(key, options))
    .then((result) => {
      ORG_CACHE.set(key, nextOrgCache(ORG_CACHE.get(key), result, key, nowMs));
    })
    .catch(() => {})
    .finally(() => {
      orgRefreshing.delete(key);
    });
}

/**
 * La fila publicada de UNA organizacion, ESPERANDO la red si hace falta.
 * La usa /preview (que no esta en el camino del mensaje). El camino del turno
 * usa getKnowledge(), que jamas espera red. Degradacion: sin datos de la db
 * (fuente apagada, 404, HTTP roto, documento invalido) cae al archivo/codigo.
 */
export async function getOrgKnowledge(organizationId, options = {}) {
  try {
    // Acepta la org directa (asi la llama /preview) o, sin ella, la clave que salga de
    // options (organizationId u inboxId) — misma clave que usa el camino sincronico.
    const key = String(organizationId || "").trim() || cacheKeyOf(options);
    if (!key) return getKnowledge(options);
    const nowMs = Number.isFinite(options.nowMs) ? options.nowMs : Date.now();
    const prev = ORG_CACHE.get(key);
    if (!prev || prev.checkedAt === null || nowMs - prev.checkedAt >= ttlMs(options)) {
      ORG_CACHE.set(key, nextOrgCache(prev, await fetchOrgKnowledge(key, options), key, nowMs));
    }
    const state = ORG_CACHE.get(key);
    return state.data ? state : getKnowledge(options);
  } catch {
    return getKnowledge(options);
  }
}

/**
 * Como getKnowledge(), pero si esa org/inbox NUNCA se consulto en este proceso, espera UNA
 * lectura de red (acotada por el timeout de la db, 5 s max) antes de contestar.
 *
 * POR QUE EXISTE: con la cache fria, el camino 100% sincronico serviria el archivo/codigo de
 * Onia — o sea que el PRIMER mensaje del cliente de una ferreteria saldria con la cara de Onia,
 * que es exactamente lo que la resolucion por inbox existe para evitar. Despues de ese primer
 * intento (bueno O fallido: la entrada queda en cache igual) esto ES getKnowledge: sincronico,
 * copia vieja + refresh en background. Una espera acotada por inbox por proceso, nada mas.
 */
export async function ensureKnowledge(options = {}) {
  try {
    const key = cacheKeyOf(options);
    if (key && !ORG_CACHE.has(key)) return await getOrgKnowledge(key, options);
    return getKnowledge(options);
  } catch {
    return getKnowledge(options);
  }
}

// ---------------------------------------------------------------------------
// Fuente "panel" (F2.1): el conocimiento del BOT DE VENTAS editado en el panel
// ---------------------------------------------------------------------------
// El bot de ventas de Onia leia su conocimiento de `knowledge.onia.json` publicado A MANO
// (deploy-bot.sh, paso 7). Con `ONIA_KNOWLEDGE_URL` apuntando a la fila publicada de la org
// interna de Onia (GET /published?organizationId=<onia-interna>), Sergio edita en el panel y el
// bot lo toma solo, con el MISMO TTL y el MISMO validador N1. Sin la variable, nada cambia.
//
// DIFERENCIA DELIBERADA con la fuente "db": esta fuente NO enciende el modo recepcionista
// (es la cara de VENTA de Onia, no un cliente) y RECHAZA POR ENTRADA, no todo-o-nada: si el
// editor mete una cifra en una FAQ, se descarta ESA FAQ, se loguea, y el resto se publica.
// El archivo sigue siendo todo-o-nada porque su editor es un commit; el del panel es un humano
// a las 10 de la noche, y castigarle el documento entero por una entrada lo deja sin nada.
// Un error ESTRUCTURAL (schema ajeno, clave desconocida arriba, demo incoherente) sigue
// rechazando el documento entero: eso no es una entrada, es otro contrato.

let PANEL_CACHE = EMPTY;
let panelRefreshing = false;

/** Sin URL o sin secreto la fuente esta APAGADA y eso NO es un error: es el estado de hoy. */
function panelConfig(options = {}) {
  return {
    // URL COMPLETA, query incluida: el loader no sabe (ni debe saber) cual es la org interna.
    url: String(options.panelUrl ?? process.env.ONIA_KNOWLEDGE_URL ?? "").trim(),
    // El mismo endpoint /published que la fuente db => el mismo Bearer.
    secret: String(options.panelSecret ?? process.env.BOT_KNOWLEDGE_SECRET ?? "").trim(),
    timeoutMs: Number.isFinite(options.dbTimeoutMs) ? options.dbTimeoutMs : DB_TIMEOUT_MS,
    fetch: options.fetch || globalThis.fetch,
  };
}

/**
 * El sobre del producto -> el documento "onia.bot.knowledge/1". El producto YA guarda el mismo
 * esquema (su editor valida con el validador espejo), asi que el mapeo es fino: se toma
 * `body.data` y, si el documento no trae version/updatedBy propios, se estampan los de la fila
 * (`row.version` numerico -> "vN"). Lo que no sea ese esquema lo rechaza el validador de siempre.
 */
export function mapPanelDoc(body) {
  if (!isPlainObject(body?.data)) return null;
  const doc = { ...body.data };
  if (typeof doc.version !== "string" && (typeof body.version === "number" || typeof body.version === "string")) {
    doc.version = `v${body.version}`.slice(0, 40);
  }
  if (typeof doc.updatedBy !== "string" && typeof body.updatedBy === "string" && body.updatedBy.trim()) {
    doc.updatedBy = body.updatedBy.slice(0, 60);
  }
  return doc;
}

/**
 * Rechazo POR ENTRADA. Corre el MISMO validateKnowledge; si todos los errores apuntan a items
 * de una lista (faq[i], campanas[i], productos[i], rubrosExtra[i], triggersExtra.demo[i]) se
 * descartan ESOS items y se revalida. Cualquier error que no sea de un item (clave desconocida
 * arriba, demo incoherente, schema ajeno) rechaza el documento ENTERO, como siempre.
 * Los precios siguen saliendo SOLO de las fuentes: la cifra invalida no entra ni recortada.
 */
export function sanitizePanelKnowledge(data) {
  const primero = validateKnowledge(data);
  if (primero.ok) return { data, descartes: [], errors: [] };

  const listas = { faq: new Set(), campanas: new Set(), productos: new Set(), rubrosExtra: new Set() };
  const triggersDemo = new Set();
  const fatales = [];
  for (const error of primero.errors) {
    const item = /^(faq|campanas|productos|rubrosExtra)\[(\d+)\]/.exec(error);
    if (item) {
      listas[item[1]].add(Number(item[2]));
      continue;
    }
    const trigger = /^triggersExtra\.demo\[(\d+)\]/.exec(error);
    if (trigger) {
      triggersDemo.add(Number(trigger[1]));
      continue;
    }
    fatales.push(error);
  }
  if (fatales.length) return { data: null, descartes: [], errors: primero.errors };

  const podado = { ...data };
  for (const [key, indices] of Object.entries(listas)) {
    if (indices.size && Array.isArray(podado[key])) podado[key] = podado[key].filter((_, i) => !indices.has(i));
  }
  if (triggersDemo.size && Array.isArray(podado.triggersExtra?.demo)) {
    podado.triggersExtra = { ...podado.triggersExtra, demo: podado.triggersExtra.demo.filter((_, i) => !triggersDemo.has(i)) };
  }

  // Una sola poda: los errores de item no dependen unos de otros. Si despues de podar sigue
  // invalido, el documento tiene algo mas de fondo y se rechaza entero (fallback, jamas mudo).
  const segundo = validateKnowledge(podado);
  if (!segundo.ok) return { data: null, descartes: [], errors: segundo.errors };
  return { data: podado, descartes: primero.errors, errors: [] };
}

/**
 * MERGE POR CAMPO archivo+panel (F2.2). El doc del panel NO reemplaza al archivo: lo pisa solo
 * en lo que TRAE. Nace del 2026-09-13: la v1 publicada desde el panel (sin FAQ `precios` ni
 * `triggersExtra`) dejo al bot sin precios y sin los 9 disparadores del archivo — el lead
 * preguntaba "¿cuanto cuesta?" y recibia el M4 default sin cifras. Reglas:
 *   - campo simple / lista plana: el panel manda SI lo trae; si no, queda el del archivo;
 *   - objetos (identity, demo, seguimiento): por sub-campo;
 *   - `empresa.horario`: NO — ver abajo, es el unico campo que el panel no puede mover;
 *   - `triggersExtra.demo`: UNION (la direccion segura: agregar si, sacar no);
 *   - `faq`: por ID — el panel manda sobre los ids que trae; los que no trae (precios, siat)
 *     se conservan del archivo, que es de donde salen las cifras.
 * Los DOS docs ya pasaron su validador. No lee caches ni archivos (el unico efecto es el aviso
 * de abajo, que existe para que un descarte no sea invisible).
 *
 * ⚠️ `empresa.horario` NO SE MERGEA, y es a proposito (2026-09-18). Los dos lados de este merge
 * hablan EN NOMBRE DE ONIA, asi que el horario de aca es la disponibilidad de Sergio Urcullo — y
 * esa ya tiene dueno: `VENTANAS_ATENCION` en `ventanas-de-atencion.mjs`, la MISMA constante de la
 * que `renovar-slots-bot.py` saca los horarios de demo que el bot OFRECE. Dejar que el panel
 * moviera solo la mitad PROMETIDA es como se separaron la primera vez: hasta el 13-sep el bot
 * ofrecia un sabado a las 14:00 y prometia "lun-vie 9:00-18:00" en el mismo mensaje. Medido vivo
 * el 2026-09-18 (`npm run horario:vivo`): la fila del panel decia `hasta: 19` y "Lunes a viernes
 * de 9:00 a 19:00, sabados de 9 a 13", o sea le prometia atencion a las 10:00 de un martes a un
 * lead que Sergio recien atiende a las 14:00. Mover la disponibilidad se hace en la constante,
 * donde mueve las dos mitades juntas.
 *
 * Esto NO le toca el horario a un CLIENTE: su fila llega por `fetchOrgKnowledge` (por org) y se
 * aplica sin pasar por aca, que es el camino exclusivo del documento de venta de Onia.
 */
/**
 * Descartes del panel ya avisados, por VALOR. `mergePanelKnowledge` corre en cada carga del
 * conocimiento y la fila del panel trae `empresa.horario` siempre: avisar en cada pasada repite
 * una condicion PERMANENTE como si fuera un evento. Medido el 2026-09-24 en el bot vivo: 3.541
 * copias de la misma linea en /tmp/onia-bot-webhook.log, ocupando la COLA ENTERA del log — los 27
 * eventos de demo/handoff que habia adentro no se veian con `tail`. Un log ahogado es tan ciego
 * como un log vacio, y esa ceguera ya costo una semana de bot mudo en septiembre.
 *
 * Se guarda el valor y no un booleano a proposito: si Sergio Urcullo edita el panel y escribe OTRO
 * horario, ese descarte es nuevo y vuelve a dejar su linea.
 */
const avisosDePanelYaDados = new Set();

/** Vacia la memoria de avisos ya dados. Para tests; en el bot vivo el reinicio hace lo mismo. */
export function resetAvisosDePanel() {
  avisosDePanelYaDados.clear();
}

export function mergePanelKnowledge(archivo, panel) {
  if (!archivo) return panel;
  if (!panel) return archivo;
  const out = { ...archivo, ...panel };
  for (const key of ["identity", "demo", "seguimiento"]) {
    if (isPlainObject(archivo[key]) && isPlainObject(panel[key])) out[key] = { ...archivo[key], ...panel[key] };
  }
  if (isPlainObject(archivo.empresa) || isPlainObject(panel.empresa)) {
    out.empresa = { ...(archivo.empresa || {}), ...(panel.empresa || {}) };
    // El horario del ARCHIVO se conserva (es del repo, y hoy no lo declara: hereda del codigo);
    // el del PANEL se descarta con constancia. Un descarte mudo es como esta familia se esconde.
    if (isPlainObject(panel.empresa?.horario)) {
      // El DESCARTE es incondicional; lo que se dice una sola vez es el AVISO. Separarlos importa:
      // callar no puede ser aceptar (caso "callar no es aceptar" en el test de este archivo).
      let clave;
      try {
        clave = JSON.stringify(panel.empresa.horario);
      } catch {
        clave = null; // un horario no serializable (ciclos) avisa siempre: es peor callarlo
      }
      if (clave === null || !avisosDePanelYaDados.has(clave)) {
        if (clave !== null) avisosDePanelYaDados.add(clave);
        console.warn(
          "[knowledge:panel] ignoro `empresa.horario` de la fila del panel: la disponibilidad de " +
            "Onia la manda ventanas-de-atencion.mjs (es la misma de la que salen los horarios de " +
            "demo que el bot ofrece). Para cambiarla, se edita esa constante.",
        );
      }
      if (isPlainObject(archivo.empresa?.horario)) out.empresa.horario = archivo.empresa.horario;
      else delete out.empresa.horario;
    }
  }
  const demoArchivo = Array.isArray(archivo.triggersExtra?.demo) ? archivo.triggersExtra.demo : [];
  const demoPanel = Array.isArray(panel.triggersExtra?.demo) ? panel.triggersExtra.demo : [];
  if (demoArchivo.length || demoPanel.length) {
    out.triggersExtra = { demo: [...new Set([...demoArchivo, ...demoPanel])] };
  }
  const faqArchivo = Array.isArray(archivo.faq) ? archivo.faq : [];
  const faqPanel = Array.isArray(panel.faq) ? panel.faq : [];
  if (faqArchivo.length || faqPanel.length) {
    const idsPanel = new Set(faqPanel.map((item) => item?.id));
    out.faq = [...faqPanel, ...faqArchivo.filter((item) => !idsPanel.has(item?.id))];
  }
  return out;
}

async function fetchPanelKnowledge(options = {}) {
  const { url, secret, timeoutMs, fetch: doFetch } = panelConfig(options);
  if (!url || !secret || typeof doFetch !== "function") return { data: null, error: null, missing: true };
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    let res;
    try {
      res = await doFetch(url, { headers: { authorization: `Bearer ${secret}` }, signal: controller.signal });
    } finally {
      clearTimeout(timer);
    }
    // 404 = la org interna todavia no publico nada (o el add-on esta apagado): NO es un error,
    // es el estado de hoy — se sigue con el archivo del deploy.
    if (res.status === 404) return { data: null, error: null, missing: true };
    if (!res.ok) return { data: null, error: `el panel contesto HTTP ${res.status}` };
    const body = await res.json();
    const doc = mapPanelDoc(body);
    if (!doc) return { data: null, error: "el panel mando una respuesta sin `data`" };
    const { data, descartes, errors } = sanitizePanelKnowledge(doc);
    if (!data) {
      return { data: null, error: `RECHAZADO (${errors.length}): ${errors.join(" · ")}`.slice(0, 600) };
    }
    if (descartes.length) {
      // Se loguea CADA descarte con su motivo: el editor tiene que poder ver que su entrada
      // no salio y por que, sin que eso tumbe al resto del documento ni al bot.
      console.error(`[knowledge:panel] ${descartes.length} entrada(s) descartada(s): ${descartes.join(" · ")}`.slice(0, 600));
    }
    return { data, descartes, error: null };
  } catch (error) {
    return { data: null, error: `no se pudo leer el panel: ${String(error?.message || error).slice(0, 160)}` };
  }
}

/** Igual que nextCache: una lectura fallida CONSERVA la ultima copia buena del panel. */
function nextPanelCache(result, url, nowMs) {
  if (result.data) {
    return Object.freeze({
      ...EMPTY,
      data: result.data,
      source: "panel",
      descartes: Array.isArray(result.descartes) && result.descartes.length ? result.descartes : null,
      version: typeof result.data.version === "string" ? result.data.version : null,
      updatedBy: typeof result.data.updatedBy === "string" ? result.data.updatedBy : null,
      loadedAt: new Date(nowMs).toISOString(),
      checkedAt: nowMs,
      path: `panel:${url}`,
      error: null,
    });
  }
  return Object.freeze({
    ...PANEL_CACHE,
    source: PANEL_CACHE.data ? PANEL_CACHE.source : "code",
    checkedAt: nowMs,
    path: `panel:${url}`,
    error: result.missing ? null : result.error || PANEL_CACHE.error,
  });
}

function schedulePanelRefresh(url, nowMs, options = {}) {
  if (panelRefreshing) return;
  panelRefreshing = true;
  Promise.resolve()
    .then(() => fetchPanelKnowledge(options))
    .then((result) => {
      PANEL_CACHE = nextPanelCache(result, url, nowMs);
    })
    .catch(() => {})
    .finally(() => {
      panelRefreshing = false;
    });
}

/** Si cambio la URL, lo cacheado era de OTRO panel y no se hereda (mismo trato que el archivo). */
function panelCacheVigente(url) {
  if (PANEL_CACHE.path !== null && PANEL_CACHE.path !== `panel:${url}`) PANEL_CACHE = EMPTY;
  return PANEL_CACHE;
}

/**
 * La copia del panel ESPERANDO la red si hace falta (tests, prewarm). El camino del turno usa
 * getKnowledge(), que jamas espera: sirve la copia vieja y refresca aparte. Degradacion: sin
 * datos del panel (fuente apagada, 404, HTTP roto, documento rechazado) cae al archivo/codigo.
 */
export async function getPanelKnowledge(options = {}) {
  try {
    const { url } = panelConfig(options);
    if (!url) return getKnowledge(options);
    const nowMs = Number.isFinite(options.nowMs) ? options.nowMs : Date.now();
    const prev = panelCacheVigente(url);
    if (prev.checkedAt === null || nowMs - prev.checkedAt >= ttlMs(options)) {
      PANEL_CACHE = nextPanelCache(await fetchPanelKnowledge(options), url, nowMs);
    }
    // getKnowledge es quien sabe SERVIR: resuelve el archivo y devuelve el panel MERGEADO
    // por campo sobre el (o degrada a archivo/codigo si el panel no tiene datos).
    return getKnowledge(options);
  } catch {
    return getKnowledge(options);
  }
}

/**
 * El conocimiento vigente. SINCRONICO y tolerante: nunca tira y nunca espera red.
 *   - con `options.organizationId` (o `options.inboxId`) y copia db en cache: la copia
 *     de ESA org (vencido el TTL se sirve la vieja y se refresca aparte);
 *   - sin copia db (o sin organizationId/inboxId): el archivo local de siempre;
 *   - primera vez (o cambio de ruta): lectura sincronica del archivo local (arranque);
 *   - TTL vigente: devuelve el cache;
 *   - TTL vencido: DEVUELVE LA COPIA VIEJA YA y dispara la relectura aparte.
 */
export function getKnowledge(options = {}) {
  try {
    const orgKey = cacheKeyOf(options);
    if (orgKey) {
      const orgNow = Number.isFinite(options.nowMs) ? options.nowMs : Date.now();
      const org = ORG_CACHE.get(orgKey);
      if (!org || org.checkedAt === null || orgNow - org.checkedAt >= ttlMs(options)) {
        scheduleOrgRefresh(orgKey, orgNow, options);
      }
      if (org?.data) return org;
      // EL INBOX QUE NO ES DE ONIA NO SIGUE DE LARGO. Abajo esperan el panel y el archivo, que
      // son los dos el guion de venta de ONIA: servirselos a un inbox ajeno es cotizarle Onia
      // a los clientes del negocio que acaba de conectar su WhatsApp. Se corta ACA, con el dato
      // que el producto ya dio (404), y `withKnowledge` lo degrada a recepcionista neutro.
      // Pregunta por LAS DOS causas: el de nadie y el del cliente sin documento. Cuando eran un
      // solo booleano esto funcionaba por accidente — el dia que se dijo la verdad sobre cual es
      // cual, preguntar solo por `huerfano` habria mandado al cliente al funnel de venta.
      if (esAjenoAOnia(org)) return org;
      // sin copia db todavia: sigue el camino del panel/archivo/codigo de siempre
    }
    // EL ARCHIVO SE RESUELVE SIEMPRE, aunque el panel este sirviendo: la fuente panel se sirve
    // MERGEADA por campo sobre el archivo (mergePanelKnowledge) — lo que el panel no trae
    // (la FAQ `precios` con sus cifras, los triggersExtra.demo) NO se pierde.
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
    const { url: panelUrl } = panelConfig(options);
    if (panelUrl) {
      const panelNow = Number.isFinite(options.nowMs) ? options.nowMs : Date.now();
      const panel = panelCacheVigente(panelUrl);
      if (panel.checkedAt === null || panelNow - panel.checkedAt >= ttlMs(options)) {
        schedulePanelRefresh(panelUrl, panelNow, options);
      }
      if (panel.data) {
        return CACHE.data
          ? Object.freeze({ ...panel, data: mergePanelKnowledge(CACHE.data, panel.data) })
          : panel;
      }
      // sin copia del panel todavia (fria, 404 o rechazada): sigue el archivo/codigo — fail-open
      // al conocimiento anterior, JAMAS mudo.
    }
    return CACHE;
  } catch {
    return CACHE; // el cargador jamas puede romper un turno
  }
}

/**
 * Lo que /health tiene que decir para que "edite y no pasó nada" no tarde dias en descubrirse,
 * resuelto con la MISMA funcion que el camino de respuesta (`ensureKnowledge`) para que conteste
 * sobre el documento que le toca al lead y no sobre otro.
 *
 * ⚠️ ES ASINCRONICA A PROPOSITO, y acá vivía el defecto. Hasta el 2026-09-12 esto era
 * `knowledgeHealth()`, sincronica: con cache fria por inbox NO espera el primer fetch, asi que
 * reportaba el ARCHIVO del proceso aunque existiera una fila publicada para ese inbox. Mientras
 * no hubo filas publicadas los dos coincidian y no se vio; el dia que se publique una, el gate
 * de precios que le pregunta a /health habria fallado EN VERDE sobre el documento equivocado.
 * La hermana sincronica se BORRO en vez de dejarse "por si acaso": era exactamente el pie de
 * banco con el que se vuelve a pisar el mismo agujero. Ver el bloque 0.a-bis de
 * webhook-server.test.mjs.
 */
export async function ensureKnowledgeHealth(options = {}) {
  return healthFromState(await ensureKnowledge(options), options);
}

/**
 * `alcance` NO es decoracion: es lo que hace que el que pregunta pueda distinguir "te contesto
 * por el inbox 4" de "te contesto por el archivo del proceso". Los dos JSON son iguales en todo
 * lo demas, y esa ambiguedad ES el defecto que este campo cierra.
 */
function healthFromState(state, options = {}) {
  const salud = {
    alcance: cacheKeyOf(options) || "proceso",
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
    // El unico canal por el que se puede MIRAR de quien es un inbox sin leerle la memoria al
    // proceso. Asi se midio el bug (`/health?inboxId=99` contestaba source "panel"), y asi se
    // verifica el arreglo despues del deploy — el mismo comando, sin tocar una conversacion real.
    // Los TRES campos, porque la pregunta del operador no es una: "¿por que este inbox no
    // contesta como el negocio?" se responde distinto si no es de nadie (registrarlo) o si es de
    // un cliente sin documento (publicar desde el panel / revisar el add-on). Con un solo
    // booleano, el inbox recien nacido de un Embedded Signup se leia como basura.
    huerfano: state.huerfano === true,
    ajena: state.ajena === true,
    organizationId: state.organizationId ?? null,
  };
  // Con la fuente panel CONFIGURADA, /health tiene que contar su estado aunque hoy no sirva:
  // "edite en el panel y el bot no lo tomo" se diagnostica aca, no adivinando.
  const { url } = panelConfig(options);
  if (url) {
    salud.panel = {
      configurado: true,
      sirviendo: state.source === "panel",
      descartes: Array.isArray(state.descartes) ? state.descartes.length : 0,
      lastError: PANEL_CACHE.error,
    };
  }
  return salud;
}

// ---------------------------------------------------------------------------
// Aplicar los hechos sobre la config
// ---------------------------------------------------------------------------

/** Una FAQ vencida NO se sirve: el bot afirmando algo que ya no es cierto es el peor daño. */
export function faqVigente(item, nowIso) {
  if (item.status !== "publicado") return false;
  if (!item.vigenteHasta) return true;
  const raw = String(item.vigenteHasta);
  // Fecha sola = vale HASTA EL FINAL de ese dia (si no, caduca un dia antes de lo que dice).
  const hasta = Date.parse(raw.length === 10 ? `${raw}T23:59:59Z` : raw);
  return !Number.isFinite(hasta) || hasta >= Date.parse(nowIso);
}

/**
 * El horario de un cliente es UN tramo por dia (`dias` + `desde` + `hasta`); `fraseDeAtencion`
 * habla el mapa `dia -> franjas`. Traducir aca —y no tipear la frase— es lo que hace que el texto
 * y la decision no puedan separarse: los dos salen del mismo `businessHours`.
 */
function horarioComoVentanas({ days, startHour, endHour }) {
  const ventanas = {};
  for (const dia of days) ventanas[dia] = [[startHour, endHour]];
  return ventanas;
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
    // Un negocio declara su horario como RANGO (dias + desde + hasta). Las `franjas` del base
    // son las de Sergio Urcullo (lun-vie 14-17 y 20-22, sab 9-15) y deciden por encima del
    // rango, asi que heredarlas le cerraria el negocio al cliente a las 17:00 y se lo abriria
    // a las 20:00. Quien declara su horario se queda con el suyo, entero.
    // `null` y no `delete`: `createBotConfig` fusiona con `{ ...base[key], ...value }`, asi que
    // una clave BORRADA del override vuelve a aparecer desde la base. La ausencia no se puede
    // expresar quitando: hay que escribirla.
    // La guarda mira TODO el objeto y no solo el rango: quien declara su horario aunque sea con
    // una `frase` suelta tampoco puede quedarse con las franjas de Sergio Urcullo, que deciden
    // POR ENCIMA del rango y le cierran el negocio de 17 a 20.
    businessHours.franjas = null;
    if (Array.isArray(horario.dias)) businessHours.days = [...horario.dias];
    if (Number.isInteger(horario.desde)) businessHours.startHour = horario.desde;
    if (Number.isInteger(horario.hasta)) businessHours.endHour = horario.hasta;
    // La frase es lo que el bot PRONUNCIA ({{horario_frase}} -> R_HORARIO, la coletilla M7 y los
    // cuatro acuses de handoff), y en el panel es un texto libre OPCIONAL al lado de los campos
    // estructurados. Heredarla dejaba al bot del cliente decidiendo con el rango del cliente y
    // diciendo el horario de ONIA. Se DERIVA de lo que el bot va a hacer, con la misma funcion
    // que arma la de Onia, asi que mover el rango cambia la promesa sola.
    businessHours.frase = horario.frase || fraseDeAtencion({ ...horarioComoVentanas(businessHours) });
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

  // Las campañas viajan a la config de LOS DOS modos, no solo del recepcionista. El consumidor
  // principal de `campanas` son los links wa.me?text= de onia.com.bo, que apuntan al numero de
  // Onia — y ese numero corre en modo VENTA. Hasta hoy `campanaExacta` solo se leia desde
  // `config.conocimiento`, que unicamente existe en el recepcionista: las cuatro frases que la
  // web manda de verdad no podian matchear nunca. `campanaExacta(config, norm)` lee `.campanas`,
  // asi que la misma funcion sirve a los dos (el recepcionista le pasa `config.conocimiento`).
  if (Array.isArray(data.campanas) && data.campanas.length) overrides.campanas = data.campanas;

  const extraDemo = data.triggersExtra?.demo;
  if (Array.isArray(extraDemo) && extraDemo.length) {
    // UNION con el codigo: agregar es libre, quitar es imposible (diseño §4, candado 4).
    const union = new Set([...(base.triggers?.demo || []), ...extraDemo.map((word) => String(word).toLowerCase().trim())]);
    overrides.triggers = { ...base.triggers, demo: [...union].filter(Boolean) };
  }

  const script = {};
  const negocio = [];
  for (const item of Array.isArray(data.faq) ? data.faq : []) {
    // "negocio" NO pisa el guion: son N entradas y las consume el recepcionista como lista
    // (recepcionista.mjs, faqNegocioVigente). Pisar script[R_FAQ_NEGOCIO] dejaria solo la ultima.
    if (item?.id === "negocio") {
      negocio.push(item);
      continue;
    }
    const templateKey = FAQ_TEMPLATE[item?.id];
    if (templateKey && faqVigente(item, nowIso)) script[templateKey] = item.body;
  }
  if (Object.keys(script).length) overrides.script = { ...base.script, ...script };
  // Las FAQ del dueño viajan TAMBIEN a la config del modo venta (F2.2): el embudo las contesta
  // por sus tags (bot-engine → faqNegocioVigente), igual que el recepcionista. La vigencia se
  // decide AL SERVIR, contra msg.receivedAt (fail-closed sin fecha), no aca — por eso van crudas.
  if (negocio.length) overrides.faq = negocio;

  return Object.keys(overrides).length ? createBotConfig(overrides, base) : base;
}

/**
 * MODO RECEPCIONISTA: la config del bot de un CLIENTE de Onia. Se activa SOLO cuando el
 * conocimiento vino de la fila publicada de una org (fuente "db" con org/inbox resuelto) —
 * nunca por el archivo local ni por el codigo, que son la cara de Onia. `conocimiento` viaja
 * entero (el documento validado "onia.bot.knowledge/1") para que el motor renderice SOLO
 * hechos de la org y pueda ser honesto cuando un campo falta. Ver recepcionista.mjs.
 *
 * `orgSlug` (opcional) es la agenda publica de esa org: con el, el bot AGENDA de verdad mandando
 * `/book/<slug>`; sin el, la cita se deriva a un humano como siempre. Va por parametro y no
 * dentro de `data` a proposito: no es un hecho editable por el dueño, es la identidad de su org
 * en el producto — el allowlist de esta capa no tiene (ni debe tener) un campo para escribirlo.
 */
export function asRecepcionista(config, data, orgSlug = null, cuota = null) {
  const slug = typeof orgSlug === "string" && orgSlug.trim() ? orgSlug.trim() : null;
  // `cuota` viaja igual que orgSlug: dato de la org en el producto, no un hecho editable.
  // Con `agotada:true` el motor contesta el texto fijo y deriva (bot-engine.mjs, barrera 1b).
  const base = createBotConfig({ modo: "recepcionista", conocimiento: data, orgSlug: slug, cuota: cuotaDe(cuota) }, config);
  // Sin humanName del cliente, el fallback heredado era "Sergio" (el humano del
  // funnel de VENTA de Onia): un negocio ajeno decia "Sergio te confirma" delante
  // de su cliente final (visto en prod, 2026-08-29). Neutro: "el equipo" — M7 dice
  // "el equipo te confirma" y el boton queda "Hablar con el equipo".
  const humanoDelCliente = String(data?.identity?.humanName || "").trim();
  if (!humanoDelCliente) {
    return { ...base, identity: { ...base.identity, humanName: "el equipo" } };
  }
  return base;
}

/**
 * La config del turno con los hechos editables aplicados. Es LO UNICO que llaman run-turn.mjs y
 * followup-run.mjs. Sin archivo (el estado de hoy) devuelve la misma config que recibio.
 * Con fuente "db" (org cliente) ademas enciende el modo recepcionista.
 */
export function withKnowledge(config = DEFAULT_CONFIG, options = {}) {
  try {
    const state = getKnowledge(options);
    // INBOX AJENO: el producto dijo que ese inbox no es de Onia — ni de ninguna org
    // (`huerfano`), ni con documento servible hoy (`ajena`: add-on apagado, nada publicado).
    // Devolver `config` seria el funnel de VENTA de Onia (DEFAULT_CONFIG lo es), asi que se
    // degrada a recepcionista NEUTRO: sin conocimiento de nadie, sin precios, sin horarios de
    // demo, y con "el equipo" en vez de "Sergio" — la misma cura que ya se aplico al humanName
    // heredado (asRecepcionista).
    // El motor silencia WhatsApp huerfano; web conserva la recepcion neutral.
    // Pregunta por LAS DOS causas con el mismo helper que corta en `getKnowledge`: son dos
    // guardias del mismo hecho, y curar uno solo deja al cliente del otro lado vendiendo Onia.
    if (esAjenoAOnia(state)) return { ...asRecepcionista(config, null), bandejaHuerfana: state.huerfano === true };
    if (!state.data) return config;
    const applied = applyKnowledge(config, state.data, options);
    return state.source === "db" ? asRecepcionista(applied, state.data, state.orgSlug, state.cuota) : applied;
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
