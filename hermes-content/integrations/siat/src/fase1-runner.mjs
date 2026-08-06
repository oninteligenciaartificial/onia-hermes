/*
 * RUNNER de la FASE 1 de homologacion SIAT (pruebas minimas, ambiente PILOTO).
 *
 * Orquesta las etapas oficiales de la modalidad COMPUTARIZADA contra el piloto:
 *   I    CUIS x2                       (FacturacionCodigos.cuis)
 *   II   sincronizacion x50 por caso   (FacturacionSincronizacion.*)
 *   III  CUFD x100                     (FacturacionCodigos.cufd)
 *   IV   emision individual x500       (recepcionFactura)
 *   V    eventos significativos x5/caso (FacturacionOperaciones.registroEventoSignificativo)
 *   VI   paquetes de contingencia x10  (recepcionPaqueteFactura + validacion)
 *   VII  anulacion x250                (anulacionFactura)
 *   IX   emision masiva x10            (recepcionMasivaFactura + validacion)
 *   XI   reversion de anulacion x98    (reversionAnulacionFactura)
 * (VIII firma digital y X: NO aplican a computarizada.)
 *
 * Uso (VPS, con /opt/onia-siat/siat-piloto.env cargado en el ambiente):
 *   node src/fase1-runner.mjs                  # todas las etapas en orden
 *   node src/fase1-runner.mjs --etapa gate     # gate minimo antes del volumen
 *   node src/fase1-runner.mjs --etapa IV --count 5
 *   flags: --pace ms (default 500 = ~2 req/s) --state file --log file
 *
 * Diseno:
 *  - CHECKPOINT/RESUME: el estado vive en un JSON local (--state); si el proceso
 *    se corta, retoma donde iba (done por etapa/caso, facturas, cufds, catalogos).
 *  - LOG NDJSON por operacion (--log): etapa, op, codigos SIN, mensaje. SIN token.
 *  - STOP AUTOMATICO: 5 errores IDENTICOS consecutivos en una etapa => corta y
 *    reporta el codigo SIN exacto en vez de quemar volumen (exit code 2).
 *    En etapas por-caso (II sync, V eventos) el caso se SALTA y se marca blocked.
 *  - Datos REALES de catalogo: sincroniza las parametricas y arma las facturas de
 *    prueba con productos/actividades/leyendas/unidades/metodos DEL catalogo.
 *  - El TOKEN va solo en el header (soap-transport); jamas se loggea.
 *
 * Los envelopes core (cuis/cufd/recepcion/anulacion/reversion) salen de
 * soap-client.mjs (verificados contra el XSD 2026-08-06). Las operaciones SOLO de
 * fase 1 (sync, eventos, paquete, masiva, validacion) se definen aca con la misma
 * metadata, orden confirmado contra los WSDL v2 del piloto 2026-08-06.
 * Esto NO es asesoria fiscal.
 */
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, appendFileSync, existsSync } from "node:fs";
import { gzipSync } from "node:zlib";

import { buildCuf } from "./cuf.mjs";
import { buildInvoiceXml } from "./xml-builder.mjs";
import { buildInvoicePayload } from "./invoice-payload.mjs";
import { assembleEmission, toSinDateString } from "./emission.mjs";
import {
  SOAP_OPERATIONS,
  buildSoapEnvelope,
  buildAnulacionFacturaRequest,
  buildCufdRequest,
  buildCuisRequest,
  buildRecepcionFacturaRequest,
  buildReversionAnulacionFacturaRequest,
  soapEndpoint,
} from "./soap-client.mjs";
import { postSoap, classifyResponse } from "./soap-transport.mjs";

// ------------------------- constantes del piloto ----------------------------

export const PILOT = {
  environment: "piloto",
  codigoAmbiente: 2,
  codigoModalidad: 2, // computarizada en linea
  codigoSucursal: 0,
  codigoPuntoVenta: 0,
  codigoDocumentoSector: 1, // factura compra-venta
  tipoFacturaDocumento: 1,
};

// NIT de prueba del piloto para el receptor (convencion de homologacion).
export const NIT_PRUEBA_RECEPTOR = "99001";

// Datos del emisor para la cabecera de las facturas de prueba (denominacion
// legal SEPREC de Onia; el piloto no valida la direccion contra el padron).
export const EMISOR_PRUEBA = {
  razonSocial: "OniaAgency",
  municipio: "Santa Cruz de la Sierra",
  direccion: "Av. Beni, Santa Cruz de la Sierra",
  telefono: null,
};

// -------------------- operaciones SOLO fase 1 (orden XSD) -------------------

// Campos del wrapper SolicitudSincronizacion (XSD FacturacionSincronizacion,
// verificado 2026-08-06): codigoAmbiente, codigoPuntoVenta?, codigoSistema,
// codigoSucursal, cuis, nit.
const SYNC_FIELDS = [
  { name: "codigoAmbiente" },
  { name: "codigoPuntoVenta", optional: true },
  { name: "codigoSistema" },
  { name: "codigoSucursal" },
  { name: "cuis" },
  { name: "nit" },
];

// base solicitudRecepcion (XSD ServicioFacturacionComputarizada, 2026-08-06).
const RECEPCION_BASE_FIELDS = [
  { name: "codigoAmbiente" },
  { name: "codigoDocumentoSector" },
  { name: "codigoEmision" },
  { name: "codigoModalidad" },
  { name: "codigoPuntoVenta", optional: true },
  { name: "codigoSistema" },
  { name: "codigoSucursal" },
  { name: "cufd" },
  { name: "cuis" },
  { name: "nit" },
  { name: "tipoFacturaDocumento" },
];

// Operaciones de fase 1 que no viven en soap-client (metadata con orden XSD).
export const RUNNER_OPS = {
  registroEventoSignificativo: {
    service: "FACTURACION_OPERACIONES",
    operation: "registroEventoSignificativo",
    requestElement: "SolicitudEventoSignificativo",
    fields: [
      { name: "codigoAmbiente" },
      { name: "codigoMotivoEvento" },
      { name: "codigoPuntoVenta", optional: true },
      { name: "codigoSistema" },
      { name: "codigoSucursal" },
      { name: "cufd" },
      { name: "cufdEvento" },
      { name: "cuis" },
      { name: "descripcion" },
      { name: "fechaHoraFinEvento" },
      { name: "fechaHoraInicioEvento" },
      { name: "nit" },
    ],
  },
  recepcionPaqueteFactura: {
    service: "FACTURACION_COMPUTARIZADA",
    operation: "recepcionPaqueteFactura",
    requestElement: "SolicitudServicioRecepcionPaquete",
    fields: [
      ...RECEPCION_BASE_FIELDS,
      { name: "archivo" },
      { name: "fechaEnvio" },
      { name: "hashArchivo" },
      { name: "cafc", optional: true },
      { name: "cantidadFacturas" },
      { name: "codigoEvento" },
    ],
  },
  validacionRecepcionPaqueteFactura: {
    service: "FACTURACION_COMPUTARIZADA",
    operation: "validacionRecepcionPaqueteFactura",
    requestElement: "SolicitudServicioValidacionRecepcionPaquete",
    fields: [...RECEPCION_BASE_FIELDS, { name: "codigoRecepcion" }],
  },
  recepcionMasivaFactura: {
    service: "FACTURACION_COMPUTARIZADA",
    operation: "recepcionMasivaFactura",
    requestElement: "SolicitudServicioRecepcionMasiva",
    fields: [
      ...RECEPCION_BASE_FIELDS,
      { name: "archivo" },
      { name: "fechaEnvio" },
      { name: "hashArchivo" },
      { name: "cantidadFacturas" },
    ],
  },
  validacionRecepcionMasivaFactura: {
    service: "FACTURACION_COMPUTARIZADA",
    operation: "validacionRecepcionMasivaFactura",
    requestElement: "SolicitudServicioValidacionRecepcionMasiva",
    fields: [...RECEPCION_BASE_FIELDS, { name: "codigoRecepcion" }],
  },
};

/** Envelope de una operacion de fase 1 (sync o RUNNER_OPS). */
export function buildRunnerEnvelope(opKey, params) {
  if (opKey.startsWith("sincronizar")) {
    return buildSoapEnvelope({
      operation: opKey,
      requestElement: "SolicitudSincronizacion",
      fields: SYNC_FIELDS,
      params,
    });
  }
  const op = RUNNER_OPS[opKey];
  if (!op) {
    throw new Error(`operacion de runner desconocida: "${opKey}"`);
  }
  return buildSoapEnvelope({
    operation: op.operation,
    requestElement: op.requestElement,
    fields: op.fields,
    params,
  });
}

// Casos de la etapa II: operacion de sync -> clave del catalogo en el estado.
export const SYNC_CASES = [
  ["sincronizarFechaHora", "fechaHora"],
  ["sincronizarActividades", "actividades"],
  ["sincronizarListaActividadesDocumentoSector", "actividadesDocSector"],
  ["sincronizarListaLeyendasFactura", "leyendas"],
  ["sincronizarListaMensajesServicios", "mensajesServicios"],
  ["sincronizarListaProductosServicios", "productos"],
  ["sincronizarParametricaEventosSignificativos", "eventos"],
  ["sincronizarParametricaMotivoAnulacion", "motivosAnulacion"],
  ["sincronizarParametricaPaisOrigen", "paisOrigen"],
  ["sincronizarParametricaTipoDocumentoIdentidad", "tiposDocIdentidad"],
  ["sincronizarParametricaTipoDocumentoSector", "tiposDocSector"],
  ["sincronizarParametricaTipoEmision", "tiposEmision"],
  ["sincronizarParametricaTipoHabitacion", "tiposHabitacion"],
  ["sincronizarParametricaTipoMetodoPago", "metodosPago"],
  ["sincronizarParametricaTipoMoneda", "tiposMoneda"],
  ["sincronizarParametricaTipoPuntoVenta", "tiposPuntoVenta"],
  ["sincronizarParametricaTiposFactura", "tiposFactura"],
  ["sincronizarParametricaUnidadMedida", "unidadesMedida"],
];

// Volumenes oficiales de fase 1 (computarizada).
export const STAGE_TARGETS = {
  I: 2,
  II: 50, // por caso (SYNC_CASES)
  III: 100,
  IV: 500,
  V: 5, // por caso (motivo de evento del catalogo)
  VI: 10,
  VII: 250,
  IX: 10,
  XI: 98,
};

export const STAGE_ORDER = ["I", "II", "III", "IV", "V", "VI", "VII", "IX", "XI"];

// ----------------------------- parsers puros --------------------------------

const ITEM_CONTAINERS = "listaCodigos|listaActividades|listaLeyendas|listaActividadesDocumentoSector";

/**
 * Extrae los items de una respuesta de sincronizacion: bloques listaCodigos /
 * listaActividades / listaLeyendas / listaActividadesDocumentoSector, cada uno
 * como objeto { campoSimple: valor }. Puro, tolerante a prefijos de namespace.
 */
export function extractSyncItems(xml) {
  const blockRe = new RegExp(
    `<(?:[\\w-]+:)?(${ITEM_CONTAINERS})(?:\\s[^>]*)?>([\\s\\S]*?)</(?:[\\w-]+:)?\\1>`,
    "gi",
  );
  const items = [];
  let m;
  while ((m = blockRe.exec(String(xml ?? ""))) !== null) {
    const inner = m[2];
    const item = {};
    const fieldRe = /<(?:[\w-]+:)?(\w+)(?:\s[^>]*)?>([^<]*)<\/(?:[\w-]+:)?\1>/g;
    let f;
    while ((f = fieldRe.exec(inner)) !== null) {
      item[f[1]] = f[2].trim();
    }
    if (Object.keys(item).length > 0) {
      items.push(item);
    }
  }
  return items;
}

/** Primer contenido de un tag simple (tolerante a prefijo). null si ausente. */
export function tagText(xml, tag) {
  const re = new RegExp(`<(?:[\\w-]+:)?${tag}(?:\\s[^>]*)?>([^<]*)</(?:[\\w-]+:)?${tag}>`, "i");
  const m = re.exec(String(xml ?? ""));
  return m ? m[1].trim() || null : null;
}

// ------------------------------ regla de STOP -------------------------------

/**
 * Clave de identidad de un error para la regla de stop: mismo codigo SIN + misma
 * clasificacion => mismo error. Un exito devuelve null (resetea la racha).
 */
export function errorKey(result) {
  if (result?.ok && result?.parsed?.transaccion !== false) {
    return null;
  }
  const parsed = result?.parsed ?? null;
  const sinCodigo = parsed?.mensajes?.[0]?.codigo ?? parsed?.codigoDescripcion ?? "";
  return `${result?.error ?? "business"}:${sinCodigo}`;
}

export const STOP_THRESHOLD = 5;

/**
 * Actualiza la racha de errores identicos consecutivos. Devuelve la racha nueva
 * { key, count } (inmutable). key null (exito) resetea.
 */
export function updateStreak(streak, key) {
  if (key == null) {
    return { key: null, count: 0 };
  }
  if (streak?.key === key) {
    return { key, count: (streak.count ?? 0) + 1 };
  }
  return { key, count: 1 };
}

/**
 * Normaliza el resultado de una solicitud de CUIS: el piloto responde
 * transaccion=false con SIN 980 ("EXISTE UN CUIS VIGENTE...") pero INCLUYE el
 * CUIS vigente en <codigo> (verificado en vivo 2026-08-06). Para fase 1 eso ES
 * un CUIS obtenido: se marca ok. Sin codigo, el resultado queda tal cual.
 */
export function normalizeCuisResult(result) {
  const codigo = result?.parsed?.codigo ?? null;
  if (!codigo) {
    return result;
  }
  return { ...result, ok: true, parsed: { ...result.parsed, transaccion: true } };
}

export class StopError extends Error {
  constructor(etapa, streak, lastResult) {
    const mensaje = lastResult?.parsed?.mensajes?.[0] ?? null;
    super(
      `STOP etapa ${etapa}: ${streak.count} errores identicos consecutivos (${streak.key})` +
        (mensaje ? ` — SIN ${mensaje.codigo}: ${mensaje.descripcion}` : ""),
    );
    this.etapa = etapa;
    this.streak = streak;
    this.mensaje = mensaje;
  }
}

// ------------------------------ tar (ustar) ---------------------------------

function octal(value, width) {
  return value.toString(8).padStart(width - 1, "0") + "\0";
}

/**
 * TAR (ustar) minimo para los paquetes/masiva: N archivos { name, content } ->
 * Buffer .tar. Suficiente para XMLs chicos (nombres <100 chars). Puro.
 */
export function buildTar(files) {
  const blocks = [];
  for (const { name, content } of files) {
    const data = Buffer.isBuffer(content) ? content : Buffer.from(content, "utf8");
    const header = Buffer.alloc(512);
    header.write(name, 0, 100, "utf8");
    header.write(octal(0o644, 8), 100);
    header.write(octal(0, 8), 108); // uid
    header.write(octal(0, 8), 116); // gid
    header.write(octal(data.length, 12), 124);
    header.write(octal(Math.floor(Date.now() / 1000), 12), 136);
    header.write("        ", 148); // checksum en blanco durante el calculo
    header.write("0", 156); // typeflag: archivo regular
    header.write("ustar\0", 257);
    header.write("00", 263);
    let sum = 0;
    for (const byte of header) {
      sum += byte;
    }
    header.write(octal(sum, 8), 148);
    blocks.push(header, data);
    const rem = data.length % 512;
    if (rem > 0) {
      blocks.push(Buffer.alloc(512 - rem));
    }
  }
  blocks.push(Buffer.alloc(1024)); // fin de archivo: 2 bloques en cero
  return Buffer.concat(blocks);
}

// --------------------------- reloj del SIN ----------------------------------

/**
 * Offset (ms) entre el reloj de PARED del SIN y Date.now(): se parsea solo la
 * parte local del fechaHora del SIN (sin zona) como si fuera UTC, y las fechas
 * de emision se formatean con getters UTC del epoch corrido. Deterministico.
 */
export function computeSinOffset(sinFechaHora, nowMs) {
  const m = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?/.exec(
    String(sinFechaHora ?? ""),
  );
  if (!m) {
    return null;
  }
  const wall = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6], +(m[7] ?? "0").padEnd(3, "0"));
  return wall - nowMs;
}

/** Epoch corrido -> "yyyy-MM-ddTHH:mm:ss.SSS" (hora de pared del SIN). */
export function formatSinLocal(shiftedMs) {
  const d = new Date(shiftedMs);
  const p = (n, w = 2) => String(n).padStart(w, "0");
  return (
    `${d.getUTCFullYear()}-${p(d.getUTCMonth() + 1)}-${p(d.getUTCDate())}` +
    `T${p(d.getUTCHours())}:${p(d.getUTCMinutes())}:${p(d.getUTCSeconds())}.${p(d.getUTCMilliseconds(), 3)}`
  );
}

// ----------------------- factura de prueba (catalogo) -----------------------

/**
 * Arma el payload de una factura de prueba usando SOLO valores del catalogo
 * sincronizado: producto homologado (con su actividad), leyenda de esa
 * actividad, unidad de medida, metodo de pago y tipo de documento del receptor.
 * Montos chicos variados por indice. Receptor: NIT 99001 (4 de cada 5) o CI de
 * consumidor final (1 de cada 5).
 */
export function buildTestInvoice({ catalogs, nit, index }) {
  const productos = catalogs?.productos ?? [];
  if (productos.length === 0) {
    throw new Error("catalogo de productos homologados vacio: sincronizar etapa II antes de emitir");
  }
  const producto = productos[index % productos.length];
  const actividad = producto.codigoActividad;
  const leyendas = catalogs?.leyendas ?? [];
  const leyenda =
    leyendas.find((l) => String(l.codigoActividad) === String(actividad)) ?? leyendas[0] ?? null;
  const unidad = (catalogs?.unidadesMedida ?? [])[0];
  const metodoPago = (catalogs?.metodosPago ?? [])[0];
  const tiposDoc = catalogs?.tiposDocIdentidad ?? [];
  const nitDoc = tiposDoc.find((t) => /(^|\s)NIT(\s|$)/i.test(t.descripcion ?? ""));
  const ciDoc = tiposDoc.find((t) => /CEDULA|CARNET|IDENTIDAD/i.test(t.descripcion ?? ""));

  const consumidorFinal = index % 5 === 4;
  const receptor = consumidorFinal
    ? {
        tipoDocumentoIdentidad: ciDoc?.codigoClasificador ?? 1,
        numeroDocumento: "1234567",
        razonSocial: "CONSUMIDOR FINAL",
      }
    : {
        tipoDocumentoIdentidad: nitDoc?.codigoClasificador ?? 5,
        numeroDocumento: NIT_PRUEBA_RECEPTOR,
        razonSocial: "PRUEBAS HOMOLOGACION SIAT",
      };

  const precio = 10 + (index % 90) + (index % 2 === 0 ? 0.5 : 0);
  const cantidad = 1 + (index % 3);

  const payload = buildInvoicePayload({
    emisor: {
      nit,
      sucursalCodigo: PILOT.codigoSucursal,
      puntoVentaCodigo: PILOT.codigoPuntoVenta,
      actividadEconomica: actividad,
    },
    receptor,
    items: [
      {
        actividadEconomica: actividad,
        codigoProductoSin: producto.codigoProducto,
        codigoProducto: `ONIA-${index + 1}`,
        descripcion: producto.descripcionProducto ?? "Servicio de prueba",
        cantidad,
        unidadMedida: unidad?.codigoClasificador ?? 58,
        precioUnitario: precio,
      },
    ],
  });
  return {
    payload,
    leyenda: leyenda?.descripcionLeyenda ?? "Ley N° 453: Tienes derecho a un trato equitativo.",
    codigoMetodoPago: metodoPago?.codigoClasificador ?? 1,
  };
}

// ------------------------------ estado (IO) ---------------------------------

export function emptyState() {
  return {
    startedAt: null,
    sinOffsetMs: 0,
    hashMode: "xml", // "xml" | "gzip": sobre que bytes se calcula hashArchivo
    cuis: null,
    cufd: null, // { codigo, codigoControl, fechaVigencia } vigente
    numeroFactura: null,
    catalogs: {},
    invoices: [], // { numero, cuf, codigoRecepcion, estado, anulada, revertida }
    etapas: {}, // id -> { done, target, attempts, blockedCases: {}, cases: {} }
  };
}

function loadState(file) {
  if (existsSync(file)) {
    return { ...emptyState(), ...JSON.parse(readFileSync(file, "utf8")) };
  }
  return emptyState();
}

function saveState(file, state) {
  writeFileSync(file, JSON.stringify(state), "utf8");
}

// ------------------------------- runner (IO) --------------------------------

function sha256HexOf(bufferOrString) {
  return createHash("sha256").update(bufferOrString).digest("hex");
}

/** hashArchivo segun el modo: "xml" = SHA-256 del XML plano; "gzip" = del .gz. */
export function hashFor(mode, xmlString, gzipBuffer) {
  return mode === "gzip" ? sha256HexOf(gzipBuffer) : sha256HexOf(xmlString);
}

function parseArgs(argv) {
  const args = { etapa: null, count: null, pace: 500, state: "fase1-state.json", log: "fase1-log.ndjson" };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === "--etapa") args.etapa = argv[++i];
    else if (a === "--count") args.count = Number(argv[++i]);
    else if (a === "--pace") args.pace = Number(argv[++i]);
    else if (a === "--state") args.state = argv[++i];
    else if (a === "--log") args.log = argv[++i];
  }
  return args;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

class Runner {
  constructor({ token, nit, codigoSistema, stateFile, logFile, pace }) {
    this.token = token;
    this.nit = nit;
    this.codigoSistema = codigoSistema;
    this.stateFile = stateFile;
    this.logFile = logFile;
    this.pace = pace;
    this.state = loadState(stateFile);
    if (!this.state.startedAt) {
      this.state.startedAt = new Date().toISOString();
    }
    if (!this.state.numeroFactura) {
      // Correlativo unico por corrida (evita chocar con pruebas previas del dia).
      this.state.numeroFactura = Math.floor(Date.now() / 1000) % 1_000_000_000;
    }
  }

  log(entry) {
    appendFileSync(this.logFile, `${JSON.stringify({ ts: new Date().toISOString(), ...entry })}\n`);
  }

  checkpoint() {
    saveState(this.stateFile, this.state);
  }

  etapaState(id, target) {
    if (!this.state.etapas[id]) {
      this.state.etapas[id] = { done: 0, target, attempts: 0, cases: {}, blockedCases: {} };
    }
    this.state.etapas[id].target = target;
    return this.state.etapas[id];
  }

  baseParams() {
    return {
      codigoAmbiente: PILOT.codigoAmbiente,
      codigoSistema: this.codigoSistema,
      codigoSucursal: PILOT.codigoSucursal,
      codigoPuntoVenta: PILOT.codigoPuntoVenta,
      nit: this.nit,
    };
  }

  recepcionBase(codigoEmision = 1) {
    return {
      ...this.baseParams(),
      codigoDocumentoSector: PILOT.codigoDocumentoSector,
      codigoEmision,
      codigoModalidad: PILOT.codigoModalidad,
      cufd: this.state.cufd?.codigo,
      cuis: this.state.cuis,
      tipoFacturaDocumento: PILOT.tipoFacturaDocumento,
    };
  }

  sinNow() {
    return formatSinLocal(Date.now() + (this.state.sinOffsetMs ?? 0));
  }

  async post(serviceKey, envelope, meta) {
    const started = Date.now();
    const result = await postSoap({
      endpoint: soapEndpoint(PILOT.environment, serviceKey),
      envelope,
      token: this.token,
      fetchImpl: globalThis.fetch,
    });
    const parsed = result.parsed ?? {};
    this.log({
      ...meta,
      ok: result.ok,
      status: result.status,
      error: result.error,
      transaccion: parsed.transaccion ?? null,
      codigoEstado: parsed.codigoEstado ?? null,
      codigoRecepcion: parsed.codigoRecepcion ?? null,
      sin: (parsed.mensajes ?? []).map((m) => `${m.codigo}:${m.descripcion}`).slice(0, 3),
      ms: Date.now() - started,
    });
    await sleep(this.pace);
    return result;
  }

  /**
   * Loop generico de una etapa: ejecuta `fn(i)` hasta `target` exitos, con la
   * regla de STOP (5 errores identicos consecutivos) y tope de intentos (3x).
   * `caseId` aisla la racha (etapas por caso saltan el caso en vez de abortar).
   */
  async loop(etapaId, target, fn, { caseId = null } = {}) {
    const etapa = this.etapaState(etapaId, target);
    const doneOf = () => (caseId ? etapa.cases[caseId] ?? 0 : etapa.done);
    const bump = () => {
      if (caseId) {
        etapa.cases[caseId] = (etapa.cases[caseId] ?? 0) + 1;
      } else {
        etapa.done += 1;
      }
    };
    if (caseId && etapa.blockedCases[caseId]) {
      return; // caso ya bloqueado en una corrida anterior
    }
    let streak = { key: null, count: 0 };
    let attempts = 0;
    const maxAttempts = target * 3;
    while (doneOf() < target && attempts < maxAttempts) {
      attempts += 1;
      etapa.attempts += 1;
      const result = await fn(doneOf());
      const key = errorKey(result);
      streak = updateStreak(streak, key);
      if (key == null) {
        bump();
      } else if (streak.count >= STOP_THRESHOLD) {
        if (caseId) {
          etapa.blockedCases[caseId] = { key: streak.key, mensaje: result?.parsed?.mensajes?.[0] ?? null };
          this.log({ etapa: etapaId, case: caseId, blocked: streak.key });
          this.checkpoint();
          return;
        }
        this.checkpoint();
        throw new StopError(etapaId, streak, result);
      }
      this.checkpoint();
    }
    if (doneOf() < target) {
      this.log({ etapa: etapaId, case: caseId, attempt_cap: attempts, done: doneOf(), target });
    }
  }

  // --------------------------- etapas ---------------------------------------

  async etapaI(target = STAGE_TARGETS.I) {
    await this.loop("I", target, async () => {
      const envelope = buildCuisRequest({ ...this.baseParams(), codigoModalidad: PILOT.codigoModalidad });
      const raw = await this.post("FACTURACION_CODIGOS", envelope, { etapa: "I", op: "cuis" });
      const result = normalizeCuisResult(raw); // SIN 980 devuelve el CUIS vigente: cuenta
      if (result.ok && result.parsed?.codigo) {
        this.state.cuis = result.parsed.codigo;
      }
      return result;
    });
  }

  async syncOnce(op, catalogKey) {
    const envelope = buildRunnerEnvelope(op, { ...this.baseParams(), cuis: this.state.cuis });
    const result = await this.post("FACTURACION_SINCRONIZACION", envelope, { etapa: "II", op });
    if (result.ok) {
      if (catalogKey === "fechaHora") {
        const fh = tagText(result.body, "fechaHora");
        const offset = computeSinOffset(fh, Date.now());
        if (offset != null) {
          this.state.sinOffsetMs = offset;
        }
      } else if (!this.state.catalogs[catalogKey]?.length) {
        this.state.catalogs[catalogKey] = extractSyncItems(result.body);
      }
    }
    return result;
  }

  async etapaII(target = STAGE_TARGETS.II, { cases = SYNC_CASES } = {}) {
    for (const [op, catalogKey] of cases) {
      await this.loop("II", target, () => this.syncOnce(op, catalogKey), { caseId: op });
    }
  }

  /** Sincroniza 1x cada catalogo que las etapas de emision necesitan (para el gate). */
  async syncEssentials() {
    const essentials = SYNC_CASES.filter(([, key]) =>
      ["fechaHora", "actividades", "leyendas", "productos", "motivosAnulacion", "tiposDocIdentidad", "metodosPago", "tiposMoneda", "unidadesMedida", "eventos"].includes(key),
    );
    for (const [op, catalogKey] of essentials) {
      await this.syncOnce(op, catalogKey);
    }
  }

  async etapaIII(target = STAGE_TARGETS.III) {
    await this.loop("III", target, async () => {
      const envelope = buildCufdRequest({
        ...this.baseParams(),
        codigoModalidad: PILOT.codigoModalidad,
        cuis: this.state.cuis,
      });
      const result = await this.post("FACTURACION_CODIGOS", envelope, { etapa: "III", op: "cufd" });
      if (result.ok && result.parsed?.codigo) {
        this.state.cufd = {
          codigo: result.parsed.codigo,
          codigoControl: result.parsed.codigoControl,
          fechaVigencia: result.parsed.fechaVigencia,
        };
      }
      return result;
    });
  }

  buildEmisionMaterial(index, { fechaEmision } = {}) {
    const { payload, leyenda, codigoMetodoPago } = buildTestInvoice({
      catalogs: this.state.catalogs,
      nit: this.nit,
      index,
    });
    const numeroFactura = ++this.state.numeroFactura;
    const material = assembleEmission({
      payload,
      tenant: { emisor: { nit: this.nit, codigoSistema: this.codigoSistema, ...EMISOR_PRUEBA } },
      cufd: this.state.cufd,
      cuis: this.state.cuis,
      numeroFactura,
      fechaEmision: fechaEmision ?? this.sinNow(),
      environment: PILOT.environment,
      leyenda,
      codigoMetodoPago,
      usuario: "onia",
    });
    return { material, numeroFactura };
  }

  /** Reconstruye el request de recepcion con el hash del modo vigente. */
  recepcionRequestFor(material) {
    const gzipBuffer = Buffer.from(material.archivo, "base64");
    return buildRecepcionFacturaRequest({
      ...this.recepcionBase(1),
      archivo: material.archivo,
      fechaEnvio: this.sinNow(),
      hashArchivo: hashFor(this.state.hashMode, material.xml, gzipBuffer),
    });
  }

  async emitOne(index) {
    const { material, numeroFactura } = this.buildEmisionMaterial(index);
    const result = await this.post("FACTURACION_COMPRA_VENTA", this.recepcionRequestFor(material), {
      etapa: "IV",
      op: "recepcionFactura",
      numeroFactura,
    });
    // Autocalibracion del hash: si el SIN observa el hash en modo "xml", probar
    // "gzip" una vez y quedarse con el modo que funcione (se persiste).
    if (
      !result.ok &&
      this.state.hashMode === "xml" &&
      (result.parsed?.mensajes ?? []).some((m) => /HASH/i.test(m.descripcion ?? ""))
    ) {
      this.state.hashMode = "gzip";
      this.log({ etapa: "IV", op: "hash_mode_switch", to: "gzip" });
      return this.emitOne(index);
    }
    if (result.ok && result.parsed?.transaccion === true) {
      this.state.invoices.push({
        numero: numeroFactura,
        cuf: material.cuf,
        codigoRecepcion: result.parsed.codigoRecepcion ?? null,
        estado: result.parsed.codigoEstado ?? null,
        anulada: false,
        revertida: false,
      });
    }
    return result;
  }

  async etapaIV(target = STAGE_TARGETS.IV) {
    await this.loop("IV", target, (done) => this.emitOne(done));
  }

  async registrarEvento(motivo, { window = 30 * 60 * 1000, finMs } = {}) {
    const fin = finMs ?? Date.now() + (this.state.sinOffsetMs ?? 0) - 5 * 60 * 1000;
    const envelope = buildRunnerEnvelope("registroEventoSignificativo", {
      ...this.baseParams(),
      codigoMotivoEvento: motivo.codigoClasificador,
      cufd: this.state.cufd?.codigo,
      cufdEvento: this.state.cufd?.codigo,
      cuis: this.state.cuis,
      descripcion: motivo.descripcion ?? `Evento ${motivo.codigoClasificador}`,
      fechaHoraInicioEvento: formatSinLocal(fin - window),
      fechaHoraFinEvento: formatSinLocal(fin),
    });
    return this.post("FACTURACION_OPERACIONES", envelope, {
      etapa: "V",
      op: "registroEventoSignificativo",
      motivo: motivo.codigoClasificador,
    });
  }

  async etapaV(target = STAGE_TARGETS.V) {
    const motivos = this.state.catalogs.eventos ?? [];
    if (motivos.length === 0) {
      throw new Error("catalogo de eventos significativos vacio: correr etapa II antes");
    }
    for (const motivo of motivos) {
      await this.loop("V", target, () => this.registrarEvento(motivo), {
        caseId: `motivo-${motivo.codigoClasificador}`,
      });
    }
  }

  /** Paquete/masiva: N facturas -> tar -> gzip -> base64 + hash del modo vigente. */
  buildLote(count, { tipoEmision, baseIndex, fechaIso = null }) {
    const xmls = [];
    for (let i = 0; i < count; i += 1) {
      const { payload, leyenda, codigoMetodoPago } = buildTestInvoice({
        catalogs: this.state.catalogs,
        nit: this.nit,
        index: baseIndex + i,
      });
      const numeroFactura = ++this.state.numeroFactura;
      const fecha17 = fechaIso ?? this.sinNow();
      const cuf = buildCuf(
        {
          nit: this.nit,
          fechaHora: fecha17.replace(/[-T:.]/g, ""),
          sucursal: PILOT.codigoSucursal,
          modalidad: PILOT.codigoModalidad,
          tipoEmision,
          tipoFactura: PILOT.tipoFacturaDocumento,
          tipoDocumentoSector: PILOT.codigoDocumentoSector,
          numeroFactura,
          puntoVenta: PILOT.codigoPuntoVenta,
        },
        this.state.cufd.codigoControl,
      );
      const cabecera = {
        nitEmisor: this.nit,
        razonSocialEmisor: EMISOR_PRUEBA.razonSocial,
        municipio: EMISOR_PRUEBA.municipio,
        numeroFactura,
        cuf,
        cufd: this.state.cufd.codigo,
        codigoSucursal: PILOT.codigoSucursal,
        direccion: EMISOR_PRUEBA.direccion,
        codigoPuntoVenta: PILOT.codigoPuntoVenta,
        fechaEmision: fecha17,
        nombreRazonSocial: payload.receptor.razonSocial,
        codigoTipoDocumentoIdentidad: payload.receptor.tipoDocumentoIdentidad,
        numeroDocumento: payload.receptor.numeroDocumento,
        codigoCliente: payload.receptor.numeroDocumento,
        codigoMetodoPago,
        montoTotal: payload.montoTotal,
        montoTotalSujetoIva: payload.montoTotal,
        codigoMoneda: 1,
        tipoCambio: 1,
        montoTotalMoneda: payload.montoTotal,
        leyenda,
        usuario: "onia",
        codigoDocumentoSector: PILOT.codigoDocumentoSector,
      };
      const detalle = payload.items.map((item) => ({
        actividadEconomica: item.actividadEconomica,
        codigoProductoSin: item.codigoProductoSin,
        codigoProducto: item.codigoProducto,
        descripcion: item.descripcion,
        cantidad: item.cantidad,
        unidadMedida: item.unidadMedida,
        precioUnitario: item.precioUnitario,
        subTotal: item.subtotal,
      }));
      xmls.push({ name: `${cuf}.xml`, content: buildInvoiceXml({ cabecera, detalle }) });
    }
    const tar = buildTar(xmls);
    const gz = gzipSync(tar);
    const archivo = gz.toString("base64");
    // En lote el "archivo" ES el tar comprimido: modo xml = hash del tar plano.
    const hashArchivo = this.state.hashMode === "gzip" ? sha256HexOf(gz) : sha256HexOf(tar);
    return { archivo, hashArchivo, cantidad: xmls.length };
  }

  async etapaVI(target = STAGE_TARGETS.VI) {
    const motivo = (this.state.catalogs.eventos ?? [])[0];
    if (!motivo) {
      throw new Error("sin catalogo de eventos para paquetes de contingencia");
    }
    await this.loop("VI", target, async (done) => {
      // Ventana del evento: [fin-30min, fin], con fin 5 min en el pasado; las
      // facturas offline del paquete se fechan DENTRO de esa ventana.
      const finMs = Date.now() + (this.state.sinOffsetMs ?? 0) - 5 * 60 * 1000;
      const evento = await this.registrarEvento(motivo, { finMs });
      const codigoEvento =
        tagText(evento.body, "codigoRecepcionEventoSignificativo") ?? null;
      if (!codigoEvento) {
        return evento; // sin evento no hay paquete: cuenta como error de la racha
      }
      const lote = this.buildLote(2, {
        tipoEmision: 2,
        baseIndex: done * 2,
        fechaIso: formatSinLocal(finMs - 10 * 60 * 1000),
      });
      const envelope = buildRunnerEnvelope("recepcionPaqueteFactura", {
        ...this.recepcionBase(2),
        archivo: lote.archivo,
        fechaEnvio: this.sinNow(),
        hashArchivo: lote.hashArchivo,
        cantidadFacturas: lote.cantidad,
        codigoEvento,
      });
      const result = await this.post("FACTURACION_COMPRA_VENTA", envelope, {
        etapa: "VI",
        op: "recepcionPaqueteFactura",
      });
      if (result.ok && result.parsed?.codigoRecepcion) {
        await sleep(2000);
        const val = buildRunnerEnvelope("validacionRecepcionPaqueteFactura", {
          ...this.recepcionBase(2),
          codigoRecepcion: result.parsed.codigoRecepcion,
        });
        await this.post("FACTURACION_COMPRA_VENTA", val, {
          etapa: "VI",
          op: "validacionRecepcionPaqueteFactura",
        });
      }
      return result;
    });
  }

  async anularOne() {
    // Preferir validadas (908); las 901 (pendientes) suelen validar en segundos
    // en el piloto, asi que valen como fallback.
    const factura =
      this.state.invoices.find((f) => !f.anulada && f.estado === 908) ??
      this.state.invoices.find((f) => !f.anulada && f.estado === 901);
    if (!factura) {
      throw new Error("etapa VII sin facturas validadas disponibles para anular");
    }
    const motivo = (this.state.catalogs.motivosAnulacion ?? [])[0];
    const envelope = buildAnulacionFacturaRequest({
      ...this.recepcionBase(1),
      codigoMotivo: motivo?.codigoClasificador ?? 1,
      cuf: factura.cuf,
    });
    const result = await this.post("FACTURACION_COMPRA_VENTA", envelope, {
      etapa: "VII",
      op: "anulacionFactura",
      numeroFactura: factura.numero,
    });
    if (result.ok && result.parsed?.transaccion === true) {
      factura.anulada = true;
    }
    return result;
  }

  async etapaVII(target = STAGE_TARGETS.VII) {
    await this.loop("VII", target, () => this.anularOne());
  }

  async etapaIX(target = STAGE_TARGETS.IX) {
    await this.loop("IX", target, async (done) => {
      const lote = this.buildLote(2, { tipoEmision: 1, baseIndex: 1000 + done * 2 });
      const envelope = buildRunnerEnvelope("recepcionMasivaFactura", {
        ...this.recepcionBase(1),
        archivo: lote.archivo,
        fechaEnvio: this.sinNow(),
        hashArchivo: lote.hashArchivo,
        cantidadFacturas: lote.cantidad,
      });
      const result = await this.post("FACTURACION_COMPRA_VENTA", envelope, {
        etapa: "IX",
        op: "recepcionMasivaFactura",
      });
      if (result.ok && result.parsed?.codigoRecepcion) {
        await sleep(2000);
        const val = buildRunnerEnvelope("validacionRecepcionMasivaFactura", {
          ...this.recepcionBase(1),
          codigoRecepcion: result.parsed.codigoRecepcion,
        });
        await this.post("FACTURACION_COMPRA_VENTA", val, {
          etapa: "IX",
          op: "validacionRecepcionMasivaFactura",
        });
      }
      return result;
    });
  }

  async revertirOne() {
    const factura = this.state.invoices.find((f) => f.anulada && !f.revertida);
    if (!factura) {
      throw new Error("etapa XI sin facturas anuladas disponibles para revertir");
    }
    const envelope = buildReversionAnulacionFacturaRequest({
      ...this.recepcionBase(1),
      cuf: factura.cuf,
    });
    const result = await this.post("FACTURACION_COMPRA_VENTA", envelope, {
      etapa: "XI",
      op: "reversionAnulacionFactura",
      numeroFactura: factura.numero,
    });
    if (result.ok && result.parsed?.transaccion === true) {
      factura.revertida = true;
    }
    return result;
  }

  async etapaXI(target = STAGE_TARGETS.XI) {
    await this.loop("XI", target, () => this.revertirOne());
  }

  /** Gate minimo: 2 CUIS, sync esencial, 1 CUFD, 1 emision, 1 anulacion, 1 reversion. */
  async gate() {
    await this.etapaI(2);
    await this.syncEssentials();
    this.checkpoint();
    await this.etapaIII(1);
    await this.etapaIV(1);
    await this.etapaVII(1);
    await this.etapaXI(1);
  }

  async runStage(id, count) {
    const map = {
      I: (n) => this.etapaI(n ?? STAGE_TARGETS.I),
      II: (n) => this.etapaII(n ?? STAGE_TARGETS.II),
      III: (n) => this.etapaIII(n ?? STAGE_TARGETS.III),
      IV: (n) => this.etapaIV(n ?? STAGE_TARGETS.IV),
      V: (n) => this.etapaV(n ?? STAGE_TARGETS.V),
      VI: (n) => this.etapaVI(n ?? STAGE_TARGETS.VI),
      VII: (n) => this.etapaVII(n ?? STAGE_TARGETS.VII),
      IX: (n) => this.etapaIX(n ?? STAGE_TARGETS.IX),
      XI: (n) => this.etapaXI(n ?? STAGE_TARGETS.XI),
      gate: () => this.gate(),
    };
    if (!map[id]) {
      throw new Error(`etapa desconocida: "${id}" (validas: ${Object.keys(map).join(", ")})`);
    }
    await map[id](count);
  }

  summary() {
    const rows = Object.entries(this.state.etapas).map(([id, e]) => ({
      etapa: id,
      done: e.done,
      target: e.target,
      attempts: e.attempts,
      cases: e.cases,
      blocked: e.blockedCases,
    }));
    return { hashMode: this.state.hashMode, cuis: this.state.cuis, etapas: rows };
  }
}

export { Runner, classifyResponse, SOAP_OPERATIONS };

// ------------------------------- main ---------------------------------------

const isMain =
  process.argv[1] && import.meta.url === (await import("node:url")).pathToFileURL(process.argv[1]).href;

if (isMain) {
  const args = parseArgs(process.argv.slice(2));
  const token = process.env.SIAT_PILOT_TOKEN;
  const nit = process.env.SIAT_NIT;
  const codigoSistema = process.env.SIAT_CODIGO_SISTEMA;
  if (!token || !nit || !codigoSistema) {
    console.error("faltan SIAT_PILOT_TOKEN / SIAT_NIT / SIAT_CODIGO_SISTEMA en el ambiente");
    process.exit(1);
  }
  const runner = new Runner({
    token,
    nit,
    codigoSistema,
    stateFile: args.state,
    logFile: args.log,
    pace: args.pace,
  });
  const stages = args.etapa ? [args.etapa] : STAGE_ORDER;
  try {
    for (const stage of stages) {
      console.log(`[fase1] etapa ${stage}...`);
      await runner.runStage(stage, args.count);
      runner.checkpoint();
    }
    console.log(JSON.stringify(runner.summary(), null, 2));
  } catch (err) {
    runner.checkpoint();
    console.error(`[fase1] ${err.message}`);
    console.error(JSON.stringify(runner.summary(), null, 2));
    process.exit(err instanceof StopError ? 2 : 1);
  }
}
