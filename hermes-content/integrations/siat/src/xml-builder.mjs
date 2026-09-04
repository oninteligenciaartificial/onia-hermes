/*
 * Builder del XML de la Factura Electronica de Compra-Venta (SIAT Bolivia) +
 * huella digital SHA-256 (modalidad computarizada en linea).
 *
 * Estructura VERIFICADA 2026-07-22 contra la pagina oficial del XML/XSD
 * (siatinfo.impuestos.gob.bo/.../factura-de-compra-y-venta): 30 campos de
 * <cabecera> + 11 de <detalle>, EN ORDEN (el SIN valida contra el XSD, el orden
 * y los nillables importan). Los campos "Opcional (nillable)" vacios se envian
 * como `<campo xsi:nil="true"/>`, no se omiten (gotcha del SIAT).
 *
 * El nombre EXACTO del elemento raiz por modalidad se confirma contra el XSD
 * descargado del piloto (ROOT_ELEMENTS, marcado). Este builder arma y hashea el
 * XML; la FIRMA XMLDSig (modalidad electronica) y el envio SOAP son pasos aparte
 * que necesitan piloto/credenciales. No es asesoria fiscal.
 */
import { createHash } from "node:crypto";

// Elemento raiz por modalidad del sector 1 (compra-venta). Los nombres de TODOS
// los sectores salen de los XSD oficiales guardados en ../xsd/ (el test los
// coteja archivo por archivo); ver DOC_SECTOR_SCHEMAS mas abajo.
export const ROOT_ELEMENTS = {
  computarizada_en_linea: "facturaComputarizadaCompraVenta",
  electronica_en_linea: "facturaElectronicaCompraVenta",
};

// Cabecera: 30 campos EN ORDEN. required = obligatorio; nillable = opcional que,
// si va vacio, se emite como <campo xsi:nil="true"/>.
export const CABECERA_FIELDS = [
  { name: "nitEmisor", required: true },
  { name: "razonSocialEmisor", required: true },
  { name: "municipio", required: true },
  { name: "telefono", nillable: true },
  { name: "numeroFactura", required: true },
  { name: "cuf", required: true },
  { name: "cufd", required: true },
  { name: "codigoSucursal", required: true },
  { name: "direccion", required: true },
  { name: "codigoPuntoVenta", nillable: true },
  { name: "fechaEmision", required: true },
  { name: "nombreRazonSocial", nillable: true },
  { name: "codigoTipoDocumentoIdentidad", required: true },
  { name: "numeroDocumento", required: true },
  { name: "complemento", nillable: true },
  { name: "codigoCliente", required: true },
  { name: "codigoMetodoPago", required: true },
  { name: "numeroTarjeta", nillable: true },
  { name: "montoTotal", required: true },
  { name: "montoTotalSujetoIva", required: true },
  { name: "codigoMoneda", required: true },
  { name: "tipoCambio", required: true },
  { name: "montoTotalMoneda", required: true },
  { name: "montoGiftCard", nillable: true },
  { name: "descuentoAdicional", nillable: true },
  { name: "codigoExcepcion", nillable: true },
  { name: "cafc", nillable: true },
  { name: "leyenda", required: true },
  { name: "usuario", required: true },
  { name: "codigoDocumentoSector", required: true },
];

// Detalle: 11 campos EN ORDEN (uno o mas <detalle> por factura).
export const DETALLE_FIELDS = [
  { name: "actividadEconomica", required: true },
  { name: "codigoProductoSin", required: true },
  { name: "codigoProducto", required: true },
  { name: "descripcion", required: true },
  { name: "cantidad", required: true },
  { name: "unidadMedida", required: true },
  { name: "precioUnitario", required: true },
  { name: "montoDescuento", nillable: true },
  { name: "subTotal", required: true },
  { name: "numeroSerie", nillable: true },
  { name: "numeroImei", nillable: true },
];

/** Copia de `fields` con `extra` insertado despues del campo `after`. */
function insertAfter(fields, after, ...extra) {
  const i = fields.findIndex((f) => f.name === after);
  if (i < 0) {
    throw new Error(`campo "${after}" no existe`);
  }
  return [...fields.slice(0, i + 1), ...extra, ...fields.slice(i + 1)];
}

// Sector 17 (hospitales/clinicas), XSD facturaComputarizadaHospitalClinica.xsd
// (ver. 23/08/2021): la cabecera de compra-venta + modalidadServicio (nillable)
// despues de codigoCliente; el detalle suma 8 campos de quirofano/medico despues
// de descripcion y NO lleva numeroSerie/numeroImei. Sin esto el piloto rechazaba
// con cvc-elt.1.a (2026-08-27): mandabamos la raiz de compra-venta.
export const CABECERA_FIELDS_17 = insertAfter(CABECERA_FIELDS, "codigoCliente", {
  name: "modalidadServicio",
  nillable: true,
});
export const DETALLE_FIELDS_17 = insertAfter(
  DETALLE_FIELDS.filter((f) => f.name !== "numeroSerie" && f.name !== "numeroImei"),
  "descripcion",
  { name: "especialidad", nillable: true },
  { name: "especialidadDetalle", nillable: true },
  { name: "nroQuirofanoSalaOperaciones", required: true }, // integer 1..9999
  { name: "especialidadMedico", nillable: true },
  { name: "nombreApellidoMedico", required: true },
  { name: "nitDocumentoMedico", required: true }, // integer 1..9999999999999
  { name: "nroMatriculaMedico", nillable: true },
  { name: "nroFacturaMedico", nillable: true },
);

// Sector 24 (nota fiscal de credito-debito), XSD notaComputarizadaCreditoDebito.xsd
// (ver. 23/08/2021). Es un documento de AJUSTE sobre una factura original: no
// lleva pago ni moneda; en su lugar identifica la factura original (numero, CUF,
// fecha) y los montos devueltos. Reglas del SIN (validaciones sector 24):
//   montoTotalOriginal = sum(subTotal con codigoDetalleTransaccion=1)
//   montoTotalDevuelto = sum(subTotal con codigoDetalleTransaccion=2) - montoDescuentoCreditoDebito
//   montoEfectivoCreditoDebito = montoTotalDevuelto x 0.13
// El detalle exige MINIMO 2 lineas: las de la factura original (1) y las del
// monto devuelto (2).
export const CABECERA_FIELDS_24 = [
  { name: "nitEmisor", required: true },
  { name: "razonSocialEmisor", required: true },
  { name: "municipio", required: true },
  { name: "telefono", nillable: true },
  { name: "numeroNotaCreditoDebito", required: true },
  { name: "cuf", required: true },
  { name: "cufd", required: true },
  { name: "codigoSucursal", required: true },
  { name: "direccion", required: true },
  { name: "codigoPuntoVenta", nillable: true },
  { name: "fechaEmision", required: true },
  { name: "nombreRazonSocial", nillable: true },
  { name: "codigoTipoDocumentoIdentidad", required: true },
  { name: "numeroDocumento", required: true },
  { name: "complemento", nillable: true },
  { name: "codigoCliente", required: true },
  { name: "numeroFactura", required: true }, // de la factura ORIGINAL
  { name: "numeroAutorizacionCuf", required: true }, // CUF de la factura original
  { name: "fechaEmisionFactura", required: true }, // fecha de la factura original
  { name: "montoTotalOriginal", required: true },
  { name: "montoTotalDevuelto", required: true },
  { name: "montoDescuentoCreditoDebito", nillable: true },
  { name: "montoEfectivoCreditoDebito", required: true },
  { name: "codigoExcepcion", nillable: true },
  { name: "leyenda", required: true },
  { name: "usuario", required: true },
  { name: "codigoDocumentoSector", required: true },
];
export const DETALLE_FIELDS_24 = [
  { name: "actividadEconomica", required: true },
  { name: "codigoProductoSin", required: true },
  { name: "codigoProducto", required: true },
  { name: "descripcion", required: true },
  { name: "cantidad", required: true },
  { name: "unidadMedida", required: true },
  { name: "precioUnitario", required: true },
  { name: "montoDescuento", nillable: true },
  { name: "subTotal", required: true },
  { name: "codigoDetalleTransaccion", required: true }, // 1 = original, 2 = devuelto
];

/**
 * Esquema del XML por documento sector: elemento raiz por modalidad + campos en
 * orden + minimo de <detalle>. buildInvoiceXml elige el esquema por el
 * codigoDocumentoSector de la cabecera, asi ningun caller tiene que saber el
 * nombre de la raiz.
 */
export const DOC_SECTOR_SCHEMAS = {
  1: { roots: ROOT_ELEMENTS, cabecera: CABECERA_FIELDS, detalle: DETALLE_FIELDS, minDetalle: 1 },
  17: {
    roots: {
      computarizada_en_linea: "facturaComputarizadaHospitalClinica",
      electronica_en_linea: "facturaElectronicaHospitalClinica",
    },
    cabecera: CABECERA_FIELDS_17,
    detalle: DETALLE_FIELDS_17,
    minDetalle: 1,
  },
  24: {
    roots: {
      computarizada_en_linea: "notaFiscalComputarizadaCreditoDebito",
      electronica_en_linea: "notaFiscalElectronicaCreditoDebito",
    },
    cabecera: CABECERA_FIELDS_24,
    detalle: DETALLE_FIELDS_24,
    minDetalle: 2,
  },
};

/** Escapa los 5 caracteres reservados de XML. */
export function xmlEscape(value) {
  return String(value).replace(
    /[<>&'"]/g,
    (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c],
  );
}

function isEmpty(value) {
  return value === undefined || value === null || value === "";
}

function renderField(field, source) {
  const value = source?.[field.name];
  if (isEmpty(value)) {
    if (field.nillable) {
      return `<${field.name} xsi:nil="true"/>`;
    }
    throw new Error(`campo obligatorio "${field.name}" ausente en el XML de la factura`);
  }
  return `<${field.name}>${xmlEscape(value)}</${field.name}>`;
}

function renderBlock(tag, fields, source) {
  return `<${tag}>${fields.map((field) => renderField(field, source)).join("")}</${tag}>`;
}

/** Bloque <cabecera> con los campos del sector en orden (30 en compra-venta). */
export function buildCabeceraXml(cabecera = {}, fields = CABECERA_FIELDS) {
  return renderBlock("cabecera", fields, cabecera);
}

/** Bloque <detalle> de un item con los campos del sector en orden (11 en compra-venta). */
export function buildDetalleXml(item = {}, fields = DETALLE_FIELDS) {
  return renderBlock("detalle", fields, item);
}

/**
 * XML completo del documento: raiz (por sector y modalidad) envolviendo
 * <cabecera> + los <detalle>. El sector sale de `codigoDocumentoSector` (opcion
 * o cabecera; default 1) y decide raiz, campos y minimo de detalles.
 */
export function buildInvoiceXml(
  { cabecera, detalle = [] } = {},
  { modality = "computarizada_en_linea", rootElement, codigoDocumentoSector } = {},
) {
  const sector = Number(codigoDocumentoSector ?? cabecera?.codigoDocumentoSector ?? 1);
  const schema = DOC_SECTOR_SCHEMAS[sector];
  if (!schema) {
    throw new Error(
      `sin esquema XML para el documento sector ${sector} (soportados: ${Object.keys(DOC_SECTOR_SCHEMAS).join(", ")})`,
    );
  }
  if (!Array.isArray(detalle) || detalle.length < schema.minDetalle) {
    throw new Error(`el documento sector ${sector} necesita al menos ${schema.minDetalle} <detalle>`);
  }
  const root = rootElement ?? schema.roots[modality] ?? schema.roots.computarizada_en_linea;
  const cabeceraXml = buildCabeceraXml(cabecera, schema.cabecera);
  const detalleXml = detalle.map((item) => buildDetalleXml(item, schema.detalle)).join("");
  return (
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
    `<${root} xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="${root}.xsd">` +
    `${cabeceraXml}${detalleXml}` +
    `</${root}>`
  );
}

/** Huella digital SHA-256 (hex) del XML: lo que la modalidad computarizada envia al SIN. */
export function sha256Hex(content) {
  return createHash("sha256").update(String(content), "utf8").digest("hex");
}
