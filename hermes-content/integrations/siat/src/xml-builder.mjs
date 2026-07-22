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

// Elemento raiz por modalidad. [VERIFICAR nombre exacto contra el XSD del piloto].
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

/** Bloque <cabecera> con los 30 campos en orden. */
export function buildCabeceraXml(cabecera = {}) {
  return renderBlock("cabecera", CABECERA_FIELDS, cabecera);
}

/** Bloque <detalle> de un item con los 11 campos en orden. */
export function buildDetalleXml(item = {}) {
  return renderBlock("detalle", DETALLE_FIELDS, item);
}

/**
 * XML completo de la factura: raiz (por modalidad) envolviendo <cabecera> +
 * uno o mas <detalle>. Necesita al menos un item.
 */
export function buildInvoiceXml({ cabecera, detalle = [] } = {}, { modality = "computarizada_en_linea", rootElement } = {}) {
  if (!Array.isArray(detalle) || detalle.length === 0) {
    throw new Error("la factura necesita al menos un <detalle>");
  }
  const root = rootElement ?? ROOT_ELEMENTS[modality] ?? ROOT_ELEMENTS.computarizada_en_linea;
  const cabeceraXml = buildCabeceraXml(cabecera);
  const detalleXml = detalle.map(buildDetalleXml).join("");
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
