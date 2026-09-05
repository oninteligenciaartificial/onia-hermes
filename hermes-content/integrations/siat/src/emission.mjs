/*
 * Ensamblador de EMISION del SIAT (Bolivia): la funcion pura que orquesta el
 * flujo COMPLETO de emitir una factura, atando las piezas ya construidas del
 * emisor. NO reimplementa nada: importa cuf.mjs (CUF verificado), xml-builder.mjs
 * (XML + huella SHA-256), soap-client.mjs (envelope de recepcion) e
 * invoice-payload.mjs (subtotales), y usa constants.mjs para los codigos.
 *
 * Flujo (plan seccion 2.2/2.3): derivar los 9 componentes del CUF -> armar el XML
 * (cabecera + detalle) con el cuf + cufd -> comprimir (gzip -> base64) + hashear
 * (SHA-256) -> armar el request SOAP de recepcion. Devuelve todo el material listo
 * para que la CAPA DE TRANSPORTE (aparte, necesita NIT + credenciales del piloto)
 * lo POSTee al SIN.
 *
 * Puro, sin IO de red, inmutable, sin dependencias externas (solo node:zlib para
 * el gzip). "now"/fechas SIEMPRE como parametro (fechaEmision/fechaEnvio). Los
 * codigos/estructuras NO confirmados contra el Anexo Tecnico / catalogo del SIN
 * van marcados [VERIFICAR]. Esto NO es asesoria fiscal.
 */
import { gzipSync } from "node:zlib";

import { buildCuf } from "./cuf.mjs";
import { buildInvoiceXml, sha256Hex } from "./xml-builder.mjs";
import {
  buildRecepcionFacturaRequest,
  codigoAmbienteFor,
  EMISSION_CODES,
  MODALITY_CODES,
} from "./soap-client.mjs";
import { lineSubtotal } from "./invoice-payload.mjs";
import {
  DOC_SECTOR,
  EMISSION_TYPES,
  MODALITIES,
  RECOMMENDED_START_MODALITY,
} from "./constants.mjs";

// tipoFactura del CUF: 1 = factura con derecho a credito fiscal (compra-venta).
// [VERIFICAR codigo exacto de tipoFactura contra el catalogo/Anexo del SIN].
const DEFAULT_TIPO_FACTURA = 1;

// codigoMoneda: BOB. [VERIFICAR: BOB -> codigo 1 contra el catalogo de monedas del SIN].
const DEFAULT_CODIGO_MONEDA = 1;

// codigoMetodoPago por defecto (contado/efectivo). [VERIFICAR contra el catalogo del SIN].
const DEFAULT_CODIGO_METODO_PAGO = 1;

function isEmpty(value) {
  return value === undefined || value === null || value === "";
}

// Convierte 0 (o vacio) a null para que un campo nillable del XML se emita como
// <campo xsi:nil="true"/> en vez de <campo>0</campo> (montoDescuento/descuentoAdicional).
function nilIfZero(value) {
  return isEmpty(value) || Number(value) === 0 ? null : value;
}

/**
 * Formatea una fechaEmision/fechaEnvio a los 17 digitos yyyyMMddHHmmssSSS que
 * exige el CUF. Deterministico y testable: para un string ISO extrae los digitos
 * de PARED tal cual (sin conversion de zona) -- la fechaEmision del payload ES la
 * hora local de emision y sus digitos deben calzar con el <fechaEmision> del XML.
 * Para un Date usa los componentes UTC (pasar la hora ya en UTC para tests estables).
 */
export function formatFechaHoraCuf(fecha) {
  if (isEmpty(fecha)) {
    throw new Error("assembleEmission requiere fechaEmision (yyyyMMddHHmmssSSS del CUF)");
  }
  if (fecha instanceof Date) {
    if (Number.isNaN(fecha.getTime())) {
      throw new Error(`fechaEmision es un Date invalido: ${fecha}`);
    }
    const p = (n, w = 2) => String(n).padStart(w, "0");
    return (
      `${fecha.getUTCFullYear()}${p(fecha.getUTCMonth() + 1)}${p(fecha.getUTCDate())}` +
      `${p(fecha.getUTCHours())}${p(fecha.getUTCMinutes())}${p(fecha.getUTCSeconds())}` +
      `${p(fecha.getUTCMilliseconds(), 3)}`
    );
  }
  const m = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?/.exec(String(fecha));
  if (!m) {
    throw new Error(`fechaEmision no tiene formato ISO reconocible: "${fecha}"`);
  }
  const millis = (m[7] ?? "").padEnd(3, "0").slice(0, 3);
  return `${m[1]}${m[2]}${m[3]}${m[4]}${m[5]}${m[6]}${millis}`;
}

// yyyyMMddHHmmssSSS -> yyyy-MM-ddTHH:mm:ss.SSS (formato de fecha del XML/SOAP del
// SIN). Deriva del MISMO instante que el CUF, asi el <fechaEmision> del XML y el
// fechaHora del CUF nunca discrepan.
function fechaHora17ToIso(d17) {
  return (
    `${d17.slice(0, 4)}-${d17.slice(4, 6)}-${d17.slice(6, 8)}` +
    `T${d17.slice(8, 10)}:${d17.slice(10, 12)}:${d17.slice(12, 14)}.${d17.slice(14, 17)}`
  );
}

/** Fecha en el formato yyyy-MM-ddTHH:mm:ss.SSS del SIN (para el XML y fechaEnvio). */
export function toSinDateString(fecha) {
  return fechaHora17ToIso(formatFechaHoraCuf(fecha));
}

// MODALITIES (string) -> codigoModalidad numerico del SIN (1=electronica, 2=computarizada).
function modalidadCode(modalidad) {
  if (modalidad === MODALITIES.ELECTRONICA_EN_LINEA) {
    return MODALITY_CODES.ELECTRONICA_EN_LINEA;
  }
  // Computarizada por defecto (la de arranque). Portal/manual/prevalorada no
  // aplican al arranque en linea. [VERIFICAR codigoModalidad para fuera de linea].
  return MODALITY_CODES.COMPUTARIZADA_EN_LINEA;
}

/**
 * Deriva los 9 componentes del CUF (SIN el digito verificador ni el codigo de
 * control) desde tenant + payload + constantes. Puro. El numero de factura es de
 * 10 digitos (lo maneja cuf.mjs); aca se pasa el valor entero.
 */
export function deriveCufComponents({ payload = {}, tenant = {}, numeroFactura, fechaEmision, tipoFactura } = {}) {
  const nit = tenant?.emisor?.nit ?? payload?.emisor?.nit;
  const sucursal = payload?.emisor?.sucursalCodigo ?? tenant?.sucursales?.[0]?.codigo ?? 0;
  const puntoVenta = payload?.emisor?.puntoVentaCodigo ?? tenant?.puntosVenta?.[0]?.codigo ?? 0;
  const modalidadStr = tenant?.emisor?.modalidad ?? payload?.emisor?.modalidad ?? RECOMMENDED_START_MODALITY;
  const tipoDocumentoSector = payload?.documento?.tipoDocumentoSector ?? DOC_SECTOR.COMPRA_VENTA;
  const numero = numeroFactura ?? payload?.numeroFactura;
  if (isEmpty(numero)) {
    throw new Error("assembleEmission requiere numeroFactura para el CUF");
  }
  return {
    nit,
    fechaHora: formatFechaHoraCuf(fechaEmision),
    sucursal,
    modalidad: modalidadCode(modalidadStr),
    tipoEmision: EMISSION_TYPES.ONLINE, // 1 = en linea
    tipoFactura: tipoFactura ?? DEFAULT_TIPO_FACTURA,
    tipoDocumentoSector,
    numeroFactura: numero,
    puntoVenta,
  };
}

/**
 * Ensambla la CABECERA (30 campos) desde payload + tenant + cuf + cufd + fecha.
 * Los campos que no vienen del payload normalizado (leyenda, usuario, codigoMoneda,
 * metodo de pago) toman input.* o un default marcado. `input.cabecera` permite
 * override final de cualquier campo. Devuelve un objeto NUEVO (inmutable).
 */
function assembleCabecera({ input, payload, tenant, cuf, cufdCodigo, fechaEmisionIso, componentes }) {
  const receptor = payload?.receptor ?? {};
  const base = {
    nitEmisor: componentes.nit,
    razonSocialEmisor: tenant?.emisor?.razonSocial ?? null,
    municipio: tenant?.emisor?.municipio ?? null,
    telefono: tenant?.emisor?.telefono ?? null,
    numeroFactura: componentes.numeroFactura,
    cuf,
    cufd: cufdCodigo,
    codigoSucursal: componentes.sucursal,
    direccion: tenant?.emisor?.direccion ?? null,
    codigoPuntoVenta: componentes.puntoVenta,
    fechaEmision: fechaEmisionIso,
    // Comprador (receptor -> campos del XSD).
    nombreRazonSocial: receptor.razonSocial ?? null,
    codigoTipoDocumentoIdentidad: receptor.tipoDocumentoIdentidad ?? null,
    numeroDocumento: receptor.numeroDocumento ?? null,
    complemento: receptor.complemento ?? null,
    codigoCliente: receptor.codigoCliente ?? receptor.numeroDocumento ?? null,
    codigoMetodoPago: input.codigoMetodoPago ?? payload?.pagos?.[0]?.codigoMetodoPago ?? DEFAULT_CODIGO_METODO_PAGO,
    numeroTarjeta: input.numeroTarjeta ?? null,
    montoTotal: payload?.montoTotal ?? null,
    montoTotalSujetoIva: input.montoTotalSujetoIva ?? payload?.montoTotal ?? null,
    codigoMoneda: input.codigoMoneda ?? DEFAULT_CODIGO_MONEDA,
    tipoCambio: payload?.documento?.tipoCambio ?? 1,
    montoTotalMoneda: input.montoTotalMoneda ?? payload?.montoTotal ?? null,
    montoGiftCard: input.montoGiftCard ?? null,
    descuentoAdicional: nilIfZero(payload?.descuentoTotal),
    codigoExcepcion: input.codigoExcepcion ?? null,
    cafc: input.cafc ?? null,
    leyenda: input.leyenda ?? payload?.documento?.leyenda ?? null,
    usuario: input.usuario ?? tenant?.orgId ?? "sistema",
    codigoDocumentoSector: componentes.tipoDocumentoSector,
  };
  return { ...base, ...(input.cabecera ?? {}) };
}

/**
 * Mapea los items del payload normalizado a los campos del <detalle> del XSD.
 * Los campos propios de un documento sector (p.ej. quirofano/medico del 17)
 * pasan tal cual desde el item: el builder solo renderiza los del esquema.
 */
function assembleDetalle(payload) {
  const items = payload?.items ?? [];
  return items.map((item) => ({
    ...item,
    actividadEconomica: item.actividadEconomica ?? payload?.emisor?.actividadEconomica ?? null,
    codigoProductoSin: item.codigoProductoSin ?? null,
    codigoProducto: item.codigoProducto ?? item.codigoInterno ?? null,
    descripcion: item.descripcion ?? null,
    cantidad: item.cantidad ?? null,
    unidadMedida: item.unidadMedida ?? null,
    precioUnitario: item.precioUnitario ?? null,
    montoDescuento: nilIfZero(item.descuento),
    subTotal: item.subtotal ?? lineSubtotal(item),
    numeroSerie: item.numeroSerie ?? null,
    numeroImei: item.numeroImei ?? null,
  }));
}

/**
 * Ensamblador de emision: orquesta CUF -> XML -> gzip/base64 + hash -> request de
 * recepcion. Devuelve { cuf, xml, archivo, hashArchivo, recepcionRequest }.
 *
 * Parametros:
 *  - payload: payload NORMALIZADO (salida de buildInvoicePayload).
 *  - tenant: tenant del registro (buildTenant) -- emisor, sucursales, codigoSistema.
 *  - cufd: { codigo, codigoControl } del CUFD del dia (external_gate: viene del SIN).
 *  - cuis: CUIS del sistema (string u objeto { codigo }).
 *  - numeroFactura: correlativo de la factura (10 digitos en el CUF).
 *  - fechaEmision: fecha/hora de emision (string ISO o Date) -- PARAMETRO.
 *  - fechaEnvio: fecha/hora de envio al SIN (opcional; default = fechaEmision).
 *  - environment: "piloto" | "produccion" (default piloto) para codigoAmbiente.
 *  - overrides opcionales de cabecera: leyenda, usuario, codigoMoneda, etc.
 */
export function assembleEmission(input = {}) {
  const {
    payload = {},
    tenant = {},
    cufd,
    cuis,
    numeroFactura,
    fechaEmision,
    fechaEnvio,
    environment = "piloto",
  } = input;

  // 1. CUF: 9 componentes -> buildCuf con el codigo de control del CUFD del dia.
  if (isEmpty(cufd?.codigoControl)) {
    throw new Error("assembleEmission requiere cufd.codigoControl (del CUFD del dia) para el CUF");
  }
  const componentes = deriveCufComponents({ payload, tenant, numeroFactura, fechaEmision, tipoFactura: input.tipoFactura });
  const cuf = buildCuf(componentes, cufd.codigoControl);

  // 2. XML: cabecera + detalle (con el cuf + cufd), modalidad computarizada por defecto.
  const cufdCodigo = cufd?.codigo ?? null;
  const fechaEmisionIso = toSinDateString(fechaEmision);
  const modalidadStr = tenant?.emisor?.modalidad ?? payload?.emisor?.modalidad ?? RECOMMENDED_START_MODALITY;
  const cabecera = assembleCabecera({ input, payload, tenant, cuf, cufdCodigo, fechaEmisionIso, componentes });
  const detalle = assembleDetalle(payload);
  const xml = buildInvoiceXml({ cabecera, detalle }, { modality: modalidadStr });

  // 3. Compresion + hash. archivo = base64(gzip(xml)). El gzip es deterministico
  // en la misma plataforma (mtime=0), pero NO se compara el base64 exacto: se
  // valida por ROUND-TRIP (gunzip). hashArchivo = SHA-256 hex.
  // [VERIFICAR: el SIAT calcula el hashArchivo sobre el XML SIN comprimir o sobre
  //  el gzip (base64). Doc oficial dice "SHA-256 del archivo"; aca se implementa
  //  por DEFAULT el SHA-256 del XML string (sin comprimir). Confirmar contra el
  //  Anexo Tecnico / piloto antes de emitir real.]
  const archivo = gzipSync(Buffer.from(xml, "utf8")).toString("base64");
  const hashArchivo = sha256Hex(xml);

  // 4. Request de recepcion (envelope SOAP puro; el transporte HTTP es aparte).
  const cuisCodigo = cuis && typeof cuis === "object" ? cuis.codigo : cuis;
  const tipoFacturaDocumento = input.tipoFacturaDocumento ?? componentes.tipoFactura;
  const recepcionRequest = buildRecepcionFacturaRequest({
    codigoAmbiente: codigoAmbienteFor(environment),
    codigoDocumentoSector: componentes.tipoDocumentoSector,
    codigoEmision: EMISSION_CODES.EN_LINEA, // 1 = en linea
    codigoModalidad: componentes.modalidad, // 2 = computarizada
    codigoPuntoVenta: componentes.puntoVenta,
    codigoSistema: tenant?.emisor?.codigoSistema,
    codigoSucursal: componentes.sucursal,
    nit: componentes.nit,
    cufd: cufdCodigo,
    cuis: cuisCodigo,
    tipoFacturaDocumento,
    archivo,
    fechaEnvio: toSinDateString(fechaEnvio ?? fechaEmision),
    hashArchivo,
  });

  return { cuf, xml, archivo, hashArchivo, recepcionRequest };
}
