/*
 * Contrato de PAYLOAD NORMALIZADO del emisor SIAT.
 *
 * Es la API interna que un producto (DentalGest, GestiOS, ProveeGest) le manda
 * al emisor para facturar: `POST /api/fiscal/invoices` (plan seccion 3, "payload
 * normalizado"). Este contrato es DISEÑO NUESTRO — NO depende de los WSDLs/XSD
 * del SIN ni del NIT, asi que se puede definir y testear hoy. El builder del XML
 * SIAT (pendiente, necesita el XSD oficial) consume este payload.
 *
 * Valor: le da a los equipos de producto un objetivo concreto (que enviar) y
 * centraliza la normalizacion/validacion antes de tocar al SIN.
 *
 * Puro, sin IO, inmutable. Helper de totales local (el emisor es un servicio
 * aparte; misma convencion "cada modulo self-contained" del core).
 */
import { DOC_SECTOR, TIPO_DOC_IDENTIDAD, CONSUMIDOR_FINAL } from "./constants.mjs";

export function round2(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

/** Subtotal de una linea: cantidad * precio - descuento. Nunca negativo. */
export function lineSubtotal(item) {
  const qty = Number(item?.cantidad ?? 0);
  const price = Number(item?.precioUnitario ?? 0);
  const discount = Number(item?.descuento ?? 0);
  return round2(Math.max(0, qty * price - discount));
}

/**
 * Normaliza y COMPLETA un payload de factura: calcula subtotales por linea,
 * descuento total, monto total; aplica consumidor final si no hay receptor.
 * No valida (eso es validateInvoicePayload); solo deriva campos.
 */
export function buildInvoicePayload(input = {}) {
  const items = (input.items ?? []).map((item) => ({
    ...item,
    subtotal: lineSubtotal(item),
  }));
  const descuentoTotal = round2((input.items ?? []).reduce((sum, i) => sum + Number(i?.descuento ?? 0), 0));
  const montoTotal = round2(items.reduce((sum, i) => sum + i.subtotal, 0));

  return {
    emisor: {
      nit: input.emisor?.nit ?? null,
      sucursalCodigo: input.emisor?.sucursalCodigo ?? 0,
      puntoVentaCodigo: input.emisor?.puntoVentaCodigo ?? 0,
      actividadEconomica: input.emisor?.actividadEconomica ?? null,
      modalidad: input.emisor?.modalidad ?? null,
    },
    receptor: input.receptor
      ? {
          tipoDocumentoIdentidad: input.receptor.tipoDocumentoIdentidad ?? TIPO_DOC_IDENTIDAD.NIT,
          numeroDocumento: input.receptor.numeroDocumento ?? null,
          razonSocial: input.receptor.razonSocial ?? null,
          email: input.receptor.email ?? null,
          complemento: input.receptor.complemento ?? null,
        }
      : { ...CONSUMIDOR_FINAL, email: null, complemento: null },
    documento: {
      tipoDocumentoSector: input.documento?.tipoDocumentoSector ?? DOC_SECTOR.COMPRA_VENTA,
      fechaEmision: input.documento?.fechaEmision ?? null,
      moneda: input.documento?.moneda ?? "BOB",
      tipoCambio: input.documento?.tipoCambio ?? 1,
    },
    items,
    pagos: input.pagos ?? [],
    descuentoTotal,
    montoTotal,
    // Campos que el emisor completa en la ronda SIAT (no los manda el producto).
    cuf: null,
    numeroFactura: input.numeroFactura ?? null,
  };
}

const NIT_RE = /^\d{5,15}$/;

/**
 * Valida un payload (idealmente ya pasado por buildInvoicePayload). Devuelve
 * { valid, errors }. Chequea presencia, items no vacios, coherencia de totales
 * (suma de subtotales == montoTotal) y formato basico de NIT/fecha. NO valida
 * contra el XSD del SIN (eso es del builder XML, que necesita el esquema oficial).
 */
export function validateInvoicePayload(payload) {
  const errors = [];
  const push = (msg) => errors.push(msg);

  if (!payload?.emisor?.nit || !NIT_RE.test(String(payload.emisor.nit))) {
    push("emisor.nit ausente o con formato invalido (5-15 digitos)");
  }
  if (!payload?.emisor?.actividadEconomica) {
    push("emisor.actividadEconomica requerida (codigo CAEB homologado)");
  }
  if (!payload?.documento?.fechaEmision || Number.isNaN(Date.parse(payload.documento.fechaEmision))) {
    push("documento.fechaEmision ausente o no es fecha ISO valida");
  }

  const receptor = payload?.receptor;
  if (!receptor?.razonSocial) {
    push("receptor.razonSocial requerida (usar S/N para consumidor final)");
  }
  if (receptor?.tipoDocumentoIdentidad == null || receptor?.numeroDocumento == null) {
    push("receptor.tipoDocumentoIdentidad y numeroDocumento requeridos");
  }

  const items = payload?.items ?? [];
  if (items.length === 0) {
    push("items vacio: la factura necesita al menos una linea");
  }
  items.forEach((item, index) => {
    if (!item.descripcion) push(`items[${index}].descripcion requerida`);
    if (!(Number(item.cantidad) > 0)) push(`items[${index}].cantidad debe ser > 0`);
    if (item.precioUnitario == null || Number(item.precioUnitario) < 0) push(`items[${index}].precioUnitario invalido`);
    if (!item.codigoProductoSin) push(`items[${index}].codigoProductoSin requerido (homologacion SIN)`);
    if (!item.unidadMedida) push(`items[${index}].unidadMedida requerida`);
  });

  // Coherencia de totales: la suma de subtotales debe cuadrar con montoTotal.
  const sumaSubtotales = round2(items.reduce((sum, i) => sum + Number(i.subtotal ?? lineSubtotal(i)), 0));
  if (payload?.montoTotal != null && sumaSubtotales !== round2(payload.montoTotal)) {
    push(`montoTotal (${payload.montoTotal}) no cuadra con la suma de subtotales (${sumaSubtotales})`);
  }

  return { valid: errors.length === 0, errors };
}
