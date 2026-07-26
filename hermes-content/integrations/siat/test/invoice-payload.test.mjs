/*
 * Tests del contrato de payload normalizado del emisor SIAT. Run:
 *   node --test hermes-content/integrations/siat/test/invoice-payload.test.mjs
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildInvoicePayload,
  lineSubtotal,
  round2,
  validateInvoicePayload,
} from "../src/invoice-payload.mjs";
import { CONSUMIDOR_FINAL, DOC_SECTOR } from "../src/constants.mjs";

const validInput = {
  emisor: { nit: "1234567890", sucursalCodigo: 0, puntoVentaCodigo: 0, actividadEconomica: "620100", modalidad: "computarizada_en_linea" },
  receptor: { tipoDocumentoIdentidad: 5, numeroDocumento: "987654321", razonSocial: "Clinica Demo SRL", email: "demo@x.bo" },
  documento: { fechaEmision: "2026-07-09T10:00:00Z", moneda: "BOB" },
  items: [
    { codigoProductoSin: "99100", descripcion: "Consulta", cantidad: 1, unidadMedida: "SERVICIO", precioUnitario: 200 },
    { codigoProductoSin: "99100", descripcion: "Limpieza", cantidad: 2, unidadMedida: "SERVICIO", precioUnitario: 150, descuento: 50 },
  ],
};

describe("lineSubtotal", () => {
  it("cantidad * precio - descuento, nunca negativo", () => {
    assert.equal(lineSubtotal({ cantidad: 2, precioUnitario: 150, descuento: 50 }), 250);
    assert.equal(lineSubtotal({ cantidad: 1, precioUnitario: 100, descuento: 500 }), 0);
  });
});

describe("buildInvoicePayload", () => {
  it("calcula subtotales, descuento total y monto total", () => {
    const payload = buildInvoicePayload(validInput);
    assert.equal(payload.items[0].subtotal, 200);
    assert.equal(payload.items[1].subtotal, 250);
    assert.equal(payload.descuentoTotal, 50);
    assert.equal(payload.montoTotal, 450);
  });

  it("aplica consumidor final cuando no hay receptor", () => {
    const payload = buildInvoicePayload({ ...validInput, receptor: undefined });
    assert.equal(payload.receptor.razonSocial, CONSUMIDOR_FINAL.razonSocial);
    assert.equal(payload.receptor.numeroDocumento, CONSUMIDOR_FINAL.numeroDocumento);
  });

  it("default tipoDocumentoSector = compra-venta, moneda BOB", () => {
    const payload = buildInvoicePayload(validInput);
    assert.equal(payload.documento.tipoDocumentoSector, DOC_SECTOR.COMPRA_VENTA);
    assert.equal(payload.documento.moneda, "BOB");
  });

  it("no muta el input", () => {
    const input = JSON.parse(JSON.stringify(validInput));
    buildInvoicePayload(input);
    assert.equal(input.items[0].subtotal, undefined);
  });

  it("cuf/numeroFactura arrancan null (los completa el emisor en la ronda SIAT)", () => {
    const payload = buildInvoicePayload(validInput);
    assert.equal(payload.cuf, null);
    assert.equal(payload.numeroFactura, null);
  });
});

describe("validateInvoicePayload", () => {
  it("un payload correcto es valido", () => {
    const result = validateInvoicePayload(buildInvoicePayload(validInput));
    assert.equal(result.valid, true, result.errors.join("; "));
  });

  it("rechaza NIT invalido", () => {
    const payload = buildInvoicePayload({ ...validInput, emisor: { ...validInput.emisor, nit: "abc" } });
    const result = validateInvoicePayload(payload);
    assert.equal(result.valid, false);
    assert.ok(result.errors.some((e) => e.includes("nit")));
  });

  it("rechaza factura sin items", () => {
    const payload = buildInvoicePayload({ ...validInput, items: [] });
    const result = validateInvoicePayload(payload);
    assert.ok(result.errors.some((e) => e.includes("items vacio")));
  });

  it("exige codigoProductoSin (homologacion) y unidadMedida por item", () => {
    const payload = buildInvoicePayload({
      ...validInput,
      items: [{ descripcion: "X", cantidad: 1, precioUnitario: 10 }],
    });
    const result = validateInvoicePayload(payload);
    assert.ok(result.errors.some((e) => e.includes("codigoProductoSin")));
    assert.ok(result.errors.some((e) => e.includes("unidadMedida")));
  });

  it("exige actividadEconomica y fechaEmision", () => {
    const bad = buildInvoicePayload({ ...validInput, emisor: { ...validInput.emisor, actividadEconomica: null }, documento: {} });
    const result = validateInvoicePayload(bad);
    assert.ok(result.errors.some((e) => e.includes("actividadEconomica")));
    assert.ok(result.errors.some((e) => e.includes("fechaEmision")));
  });

  it("detecta descuadre de totales (montoTotal manipulado)", () => {
    const payload = buildInvoicePayload(validInput);
    payload.montoTotal = round2(payload.montoTotal + 100);
    const result = validateInvoicePayload(payload);
    assert.ok(result.errors.some((e) => e.includes("no cuadra")));
  });

  it("cantidad cero o negativa es invalida", () => {
    const payload = buildInvoicePayload({
      ...validInput,
      items: [{ codigoProductoSin: "1", descripcion: "X", cantidad: 0, unidadMedida: "U", precioUnitario: 10 }],
    });
    const result = validateInvoicePayload(payload);
    assert.ok(result.errors.some((e) => e.includes("cantidad")));
  });
});
