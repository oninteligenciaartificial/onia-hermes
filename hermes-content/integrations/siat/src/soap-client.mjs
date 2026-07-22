/*
 * Capa PURA del cliente SOAP del SIAT (Sistema de Facturacion en Linea, Bolivia).
 *
 * Arma el XML del ENVELOPE de cada request desde parametros y PARSEA la respuesta
 * a un objeto normalizado. NO hace red ni IO: el TRANSPORTE HTTP real (POST del
 * envelope, header Authorization, timeouts, reintentos) es un concern APARTE que
 * necesita el NIT + credenciales del piloto y se enchufa encima de esta capa. Asi
 * el cliente es testeable HOY sin red ni NIT, coherente con external_gate: siat
 * (el core nunca factura).
 *
 * Puro, sin IO, inmutable, sin dependencias externas. Reusa ENVIRONMENTS de
 * constants.mjs. Esto NO es asesoria fiscal.
 *
 * ============================ IMPORTANTE (ESTRUCTURA) ========================
 * La estructura EXACTA del envelope (targetNamespace del servicio, SOAP 1.1 vs
 * 1.2, nombre del elemento wrapper del request DTO -- SolicitudCuis, etc.-- y el
 * ORDEN de los campos por el XSD) se CONFIRMA contra el WSDL del piloto ANTES de
 * emitir real. Fuente: WSDLs publicos v2 del piloto + doc oficial siatinfo.
 *   - pilotosiatservicios.impuestos.gob.bo/v2/FacturacionCodigos?wsdl
 *   - pilotosiatservicios.impuestos.gob.bo/v2/FacturacionSincronizacion?wsdl
 *   - pilotosiatservicios.impuestos.gob.bo/v2/ServicioFacturacionComputarizada?wsdl
 * El NOMBRE de la operacion SI esta confirmado en el binding del WSDL del piloto
 * (verified:true por operacion abajo); lo [VERIFICAR] es el detalle de tipos.
 *
 * AUTENTICACION (VERIFICADO, doc oficial): el Token Delegado NO viaja en el XML
 * ni en el SOAP header, sino en el HTTP header 'Authorization: Token VALOR'. Eso
 * es de la CAPA DE TRANSPORTE (fuera de esta capa pura). buildAuthHeader ayuda a
 * armar ese header sin acoplar red aca.
 * ============================================================================
 */
import { ENVIRONMENTS } from "./constants.mjs";

// Namespace del envelope. SOAP 1.1 por defecto (JAX-WS suele bindear 1.1).
// [VERIFICAR SOAP 1.1 vs 1.2 contra el binding del WSDL del piloto].
export const SOAP_ENV_NS = "http://schemas.xmlsoap.org/soap/envelope/";

// targetNamespace del servicio SIAT (prefijo de la operacion en el Body).
// PLACEHOLDER -- [VERIFICAR el targetNamespace EXACTO de cada servicio contra el WSDL].
export const SIAT_TARGET_NS = "https://siat.impuestos.gob.bo/";

// Prefijo de namespace usado para la operacion dentro del Body.
const OP_PREFIX = "siat";

// Segmentos de endpoint por servicio SOAP. OJO: no todos llevan el prefijo
// 'Servicio' (FacturacionCodigos vs ServicioFacturacionComputarizada); ambos
// responden en el piloto. VERIFICADO contra los WSDL v2 del piloto.
export const SIAT_SERVICES = {
  FACTURACION_CODIGOS: "FacturacionCodigos",
  FACTURACION_SINCRONIZACION: "FacturacionSincronizacion",
  FACTURACION_COMPUTARIZADA: "ServicioFacturacionComputarizada",
};

// codigoAmbiente por ambiente. OJO: es al reves de lo intuitivo -- el piloto NO
// es 1. VERIFICADO contra la doc oficial (misma convencion en cuis/cufd/recepcion/
// anulacion/paquete). Produccion=1, Pruebas/Piloto=2.
export const AMBIENTE_CODES = {
  produccion: 1,
  piloto: 2,
};

// codigoEmision: 1=en linea (online), 2=fuera de linea (offline/paquete). VERIFICADO.
export const EMISSION_CODES = {
  EN_LINEA: 1,
  FUERA_DE_LINEA: 2,
};

// codigoModalidad: 1=Electronica en Linea, 2=Computarizada en Linea (la de
// arranque recomendada es la 2). VERIFICADO.
export const MODALITY_CODES = {
  ELECTRONICA_EN_LINEA: 1,
  COMPUTARIZADA_EN_LINEA: 2,
};

// Metadata por operacion SOAP. `operation` = nombre del binding (VERIFICADO en el
// WSDL del piloto). `requestElement` = wrapper del request DTO ([VERIFICAR nombre
// exacto]). `fields` = campos EN ORDEN segun la doc oficial ([VERIFICAR orden
// exacto contra el XSD]; optional:true no se emite si viene vacio). `verified`
// refleja si los CAMPOS estan confirmados campo por campo contra doc oficial.
export const SOAP_OPERATIONS = {
  // Health-check de disponibilidad del servicio (existe en los 3 servicios v2).
  // Nombre de operacion confirmado en el binding; campos NO confirmados.
  verificarComunicacion: {
    service: "FACTURACION_CODIGOS",
    operation: "verificarComunicacion",
    // [VERIFICAR nombre del wrapper y si lleva parametros de negocio contra el WSDL].
    requestElement: "SolicitudVerificarComunicacion",
    fields: [], // sin parametros de negocio (health-check) [VERIFICAR firma exacta]
    verified: false,
  },
  // SolicitudCuis: CUIS por sistema. Campos VERIFICADOS contra doc oficial.
  cuis: {
    service: "FACTURACION_CODIGOS",
    operation: "cuis",
    requestElement: "SolicitudCuis", // [VERIFICAR nombre exacto del wrapper]
    fields: [
      { name: "codigoAmbiente" },
      { name: "codigoSistema" },
      { name: "nit" },
      { name: "codigoModalidad" },
      { name: "codigoSucursal" },
      { name: "codigoPuntoVenta", optional: true }, // 0 si no aplica
    ],
    verified: true,
  },
  // SolicitudCufd: CUFD diario (vigencia 24h). Campos VERIFICADOS.
  cufd: {
    service: "FACTURACION_CODIGOS",
    operation: "cufd",
    requestElement: "SolicitudCufd", // [VERIFICAR nombre exacto del wrapper]
    fields: [
      { name: "codigoAmbiente" },
      { name: "codigoSistema" },
      { name: "nit" },
      { name: "codigoModalidad" },
      { name: "cuis" },
      { name: "codigoSucursal" },
      { name: "codigoPuntoVenta", optional: true }, // 0 si no aplica
    ],
    verified: true,
  },
  // Recepcion de factura compra-venta computarizada en linea. Campos VERIFICADOS.
  recepcionFactura: {
    service: "FACTURACION_COMPUTARIZADA",
    operation: "recepcionFactura",
    // [VERIFICAR nombre exacto del wrapper; suele ser SolicitudServicioRecepcionFactura].
    requestElement: "SolicitudServicioRecepcionFactura",
    fields: [
      { name: "codigoAmbiente" },
      { name: "codigoDocumentoSector" },
      { name: "codigoEmision" }, // 1=en linea
      { name: "codigoModalidad" },
      { name: "codigoPuntoVenta", optional: true }, // 0 si no aplica
      { name: "codigoSistema" },
      { name: "codigoSucursal" },
      { name: "nit" },
      { name: "cufd" },
      { name: "cuis" },
      { name: "tipoFacturaDocumento" },
      { name: "archivo" }, // base64: XML gzip -> base64
      { name: "fechaEnvio" },
      { name: "hashArchivo" }, // SHA-256 del archivo
    ],
    verified: true,
  },
  // Anulacion de factura (misma firma compra-venta y electronica). Campos VERIFICADOS.
  anulacionFactura: {
    service: "FACTURACION_COMPUTARIZADA",
    operation: "anulacionFactura",
    // [VERIFICAR nombre exacto del wrapper; suele ser SolicitudServicioAnulacionFactura].
    requestElement: "SolicitudServicioAnulacionFactura",
    fields: [
      { name: "codigoAmbiente" },
      { name: "codigoSistema" },
      { name: "codigoSucursal" }, // 0=casa matriz
      { name: "codigoPuntoVenta", optional: true }, // 0 si no aplica
      { name: "codigoEmision" }, // 1=en linea
      { name: "codigoModalidad" },
      { name: "codigoDocumentoSector" },
      { name: "nit" },
      { name: "cuis" },
      { name: "cufd" },
      { name: "tipoFacturaDocumento" },
      { name: "cuf" }, // CUF de la factura a anular
      { name: "codigoMotivo" }, // del catalogo sincronizado de motivos de anulacion
    ],
    verified: true,
  },
};

// ------------------------------- helpers XML --------------------------------

/** Escapa los 5 caracteres reservados de XML (self-contained, no acopla el xml-builder). */
export function escapeXml(value) {
  return String(value).replace(
    /[<>&'"]/g,
    (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c],
  );
}

function unescapeXml(value) {
  return String(value)
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&");
}

function isEmpty(value) {
  return value === undefined || value === null || value === "";
}

// --------------------------- helpers de ambiente ----------------------------

/** Resuelve un ambiente: acepta el objeto de ENVIRONMENTS o su id ("piloto"/"produccion"). */
function resolveEnv(environment) {
  if (environment && typeof environment === "object") {
    return environment;
  }
  const key = String(environment ?? "").toUpperCase();
  const env = ENVIRONMENTS[key];
  if (!env) {
    throw new Error(`ambiente SIAT desconocido: "${environment}"`);
  }
  return env;
}

/**
 * codigoAmbiente del SIAT para un ambiente dado (produccion=1, piloto=2).
 * Acepta el objeto de ENVIRONMENTS o su id string.
 */
export function codigoAmbienteFor(environment) {
  const env = resolveEnv(environment);
  const code = AMBIENTE_CODES[env.id];
  if (code == null) {
    throw new Error(`sin codigoAmbiente para el ambiente "${env.id}"`);
  }
  return code;
}

/**
 * Endpoint SOAP para un servicio en un ambiente. Reusa soapBase de ENVIRONMENTS
 * (constants). El piloto vigente (2026-07) sirve en /v2/; constants trae /v1 --
 * por eso `version` permite forzar la version del path. [VERIFICAR que version
 * exige PRODUCCION antes de emitir real].
 */
export function soapEndpoint(environment, serviceKey, { version } = {}) {
  const env = resolveEnv(environment);
  const service = SIAT_SERVICES[serviceKey] ?? serviceKey;
  const base = version ? env.soapBase.replace(/\/v\d+$/, `/${version}`) : env.soapBase;
  return `${base}/${service}`;
}

/** URL del WSDL de un servicio (endpoint + '?wsdl'). */
export function soapWsdlUrl(environment, serviceKey, options = {}) {
  return `${soapEndpoint(environment, serviceKey, options)}?wsdl`;
}

/**
 * Header HTTP de autenticacion del SIAT (VERIFICADO, doc oficial): el Token
 * Delegado va como 'Authorization: Token VALOR'. Lo consume la CAPA DE TRANSPORTE
 * (aca solo se arma el string; sin red). El token del piloto es distinto al de
 * produccion.
 */
export function buildAuthHeader(token) {
  if (isEmpty(token)) {
    throw new Error("buildAuthHeader requiere el token delegado del SIAT");
  }
  return `Token ${token}`;
}

// -------------------------- builders de envelope ----------------------------

/** Renderiza los campos del request en orden; lanza si falta uno requerido. */
function renderFields(fields, params) {
  return fields
    .map((field) => {
      const value = params?.[field.name];
      if (isEmpty(value)) {
        if (field.optional) {
          return "";
        }
        throw new Error(`campo SOAP requerido "${field.name}" ausente en el request`);
      }
      return `<${field.name}>${escapeXml(value)}</${field.name}>`;
    })
    .join("");
}

/**
 * Arma el envelope SOAP generico: Header vacio + Body con la operacion (en el
 * targetNamespace del servicio) envolviendo el request DTO con sus campos.
 * Estructura sujeta a [VERIFICAR] contra el WSDL (ver cabecera del archivo).
 */
export function buildSoapEnvelope({
  operation,
  requestElement,
  fields = [],
  params = {},
  targetNamespace = SIAT_TARGET_NS,
  soapEnvNamespace = SOAP_ENV_NS,
  prefix = OP_PREFIX,
} = {}) {
  if (isEmpty(operation)) {
    throw new Error("buildSoapEnvelope requiere el nombre de la operacion");
  }
  const inner = renderFields(fields, params);
  const body = requestElement ? `<${requestElement}>${inner}</${requestElement}>` : inner;
  return (
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<soapenv:Envelope xmlns:soapenv="${soapEnvNamespace}" xmlns:${prefix}="${targetNamespace}">` +
    `<soapenv:Header/>` +
    `<soapenv:Body>` +
    `<${prefix}:${operation}>${body}</${prefix}:${operation}>` +
    `</soapenv:Body>` +
    `</soapenv:Envelope>`
  );
}

/**
 * Normaliza codigoAmbiente: si no viene explicito pero si `environment`, lo
 * deriva (produccion=1, piloto=2). No muta la entrada.
 */
function withCodigoAmbiente(params = {}) {
  if (params.codigoAmbiente != null) {
    return params;
  }
  if (params.environment != null) {
    return { ...params, codigoAmbiente: codigoAmbienteFor(params.environment) };
  }
  return params;
}

/** Envelope generico a partir de la metadata de SOAP_OPERATIONS + params. */
function buildFromOperation(key, params, options = {}) {
  const op = SOAP_OPERATIONS[key];
  return buildSoapEnvelope({
    operation: op.operation,
    requestElement: op.requestElement,
    fields: op.fields,
    params: withCodigoAmbiente(params),
    ...options,
  });
}

/** verificarComunicacion: health-check del servicio. [VERIFICAR firma exacta]. */
export function buildVerificarComunicacionRequest(params = {}, options = {}) {
  return buildFromOperation("verificarComunicacion", params, options);
}

/** SolicitudCuis: CUIS por sistema. */
export function buildCuisRequest(params = {}, options = {}) {
  return buildFromOperation("cuis", params, options);
}

/** SolicitudCufd: CUFD diario. */
export function buildCufdRequest(params = {}, options = {}) {
  return buildFromOperation("cufd", params, options);
}

/** recepcionFactura: recepcion de factura compra-venta computarizada en linea. */
export function buildRecepcionFacturaRequest(params = {}, options = {}) {
  return buildFromOperation("recepcionFactura", params, options);
}

/** anulacionFactura: anulacion de factura (cuf + codigoMotivo). */
export function buildAnulacionFacturaRequest(params = {}, options = {}) {
  return buildFromOperation("anulacionFactura", params, options);
}

// ----------------------------- parser de respuesta --------------------------

/** Primer contenido de un tag (tolerante a prefijo de namespace y atributos). null si ausente/vacio. */
function extractTag(xml, tag) {
  // (?=[\s/>]) evita que "codigo" matchee "codigoEstado" (prefijo compartido).
  const re = new RegExp(
    `<(?:[\\w-]+:)?${tag}(?=[\\s/>])(?:\\s[^>]*)?>([\\s\\S]*?)</(?:[\\w-]+:)?${tag}>`,
    "i",
  );
  const match = re.exec(xml);
  if (!match) {
    return null;
  }
  const inner = unescapeXml(match[1].trim());
  return inner === "" ? null : inner;
}

function parseBoolean(raw) {
  if (raw == null) {
    return null;
  }
  const value = String(raw).trim().toLowerCase();
  if (value === "true" || value === "1") {
    return true;
  }
  if (value === "false" || value === "0") {
    return false;
  }
  return null;
}

function toIntOrNull(raw) {
  if (raw == null) {
    return null;
  }
  const n = Number.parseInt(String(raw).trim(), 10);
  return Number.isNaN(n) ? null : n;
}

function normalizeCodigo(raw) {
  const value = unescapeXml(String(raw).trim());
  return /^-?\d+$/.test(value) ? Number(value) : value;
}

/**
 * Extrae los mensajes {codigo, descripcion} sin importar el contenedor
 * (listaMensajes / mensajesList / codigosRespuestas: mismo DTO). Matchea el par
 * codigo+descripcion ADYACENTE en cualquiera de los dos ordenes; el `\s*` entre
 * ambos evita cruzar mensajes distintos (hay markup del wrapper entre uno y otro)
 * y evita capturar un <codigo> suelto (p.ej. el valor CUIS) como mensaje.
 */
function extractMensajes(xml) {
  // Inner text SIN '<': el par codigo+descripcion es texto plano, y asi el capture
  // no cruza a otro mensaje (el markup del wrapper corta el match).
  const forward =
    /<(?:[\w-]+:)?codigo>([^<]*)<\/(?:[\w-]+:)?codigo>\s*<(?:[\w-]+:)?descripcion>([^<]*)<\/(?:[\w-]+:)?descripcion>/gi;
  const backward =
    /<(?:[\w-]+:)?descripcion>([^<]*)<\/(?:[\w-]+:)?descripcion>\s*<(?:[\w-]+:)?codigo>([^<]*)<\/(?:[\w-]+:)?codigo>/gi;
  const found = [];
  let m;
  while ((m = forward.exec(xml)) !== null) {
    found.push({ at: m.index, codigo: normalizeCodigo(m[1]), descripcion: unescapeXml(m[2].trim()) });
  }
  while ((m = backward.exec(xml)) !== null) {
    found.push({ at: m.index, codigo: normalizeCodigo(m[2]), descripcion: unescapeXml(m[1].trim()) });
  }
  return found
    .sort((a, b) => a.at - b.at)
    .map(({ codigo, descripcion }) => ({ codigo, descripcion }));
}

/**
 * Parseo TOLERANTE (regex, sin dependencias) de una respuesta SIAT a un objeto
 * normalizado. Patron comun del SIAT: transaccion:boolean + lista de mensajes
 * {codigo, descripcion}; las recepciones agregan codigoRecepcion y codigoEstado
 * (901 pendiente / 904 observada / 908 validada). Campos ausentes -> null.
 *
 * [VERIFICAR los nombres EXACTOS de los elementos de respuesta contra el XSD del
 * piloto antes de emitir real (listaMensajes vs mensajesList vs codigosRespuestas
 * es el mismo DTO; este parser es agnostico al contenedor).]
 */
export function parseSoapResponse(xmlString) {
  const xml = String(xmlString ?? "");
  return {
    transaccion: parseBoolean(extractTag(xml, "transaccion")),
    codigoEstado: toIntOrNull(extractTag(xml, "codigoEstado")),
    codigoRecepcion: extractTag(xml, "codigoRecepcion"),
    codigoDescripcion: extractTag(xml, "codigoDescripcion"),
    mensajes: extractMensajes(xml),
  };
}
