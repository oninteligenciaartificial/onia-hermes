/*
 * Tests del generador CUF (SIAT Bolivia). El ejemplo oficial del SIAT
 * ("12345" -> 6) es la ANCLA que prueba que el Modulo 11 calza con la norma.
 * Run: node --test hermes-content/integrations/siat/test/cuf.test.mjs
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  CUF_FIELD_WIDTHS,
  CUF_PAYLOAD_WIDTH,
  buildCuf,
  buildCufCore,
  buildCufPayload,
  decimalStringToHex,
  mod11CheckDigit,
} from "../src/cuf.mjs";

describe("Modulo 11 del SIAT (algoritmo oficial)", () => {
  it("ejemplo oficial: '12345' -> digito 6 (ancla de verificacion)", () => {
    // 5*2 + 4*3 + 3*4 + 2*5 + 1*6 = 50; 50 % 11 = 6
    assert.equal(mod11CheckDigit("12345"), 6);
  });

  it("convierte 10 -> 1 (regla oficial): '19' -> 21 % 11 = 10 -> 1", () => {
    // 9*2 + 1*3 = 21; 21 % 11 = 10 -> 1
    assert.equal(mod11CheckDigit("19"), 1);
  });

  it("modo x10: ((suma*10) % 11) % 10 -> '12345' da 5", () => {
    // suma 50; (50*10) % 11 = 500 % 11 = 5; 5 % 10 = 5
    assert.equal(mod11CheckDigit("12345", { multiplicaPor10: true }), 5);
  });

  it("los pesos reinician tras el limite (2..9 ciclico) y el digito queda 0-9", () => {
    const d = mod11CheckDigit("1".repeat(30));
    assert.ok(d >= 0 && d <= 9);
  });

  it("rechaza cadenas no numericas", () => {
    assert.throws(() => mod11CheckDigit("12A45"), /no numerica/);
  });
});

describe("payload del CUF (53 digitos)", () => {
  const components = {
    nit: "5371375010",
    fechaHora: "20260722120000000",
    sucursal: "0",
    modalidad: "1",
    tipoEmision: "1",
    tipoFactura: "1",
    tipoDocumentoSector: "1",
    numeroFactura: "42",
    puntoVenta: "0",
  };

  it("el ancho total documentado es 53 digitos", () => {
    const total = Object.values(CUF_FIELD_WIDTHS).reduce((sum, width) => sum + width, 0);
    assert.equal(total, 53);
    assert.equal(CUF_PAYLOAD_WIDTH, 53);
  });

  it("numeroFactura usa 10 digitos (no 8): resuelve el flag que arrastraba el core", () => {
    assert.equal(CUF_FIELD_WIDTHS.numeroFactura, 10);
  });

  it("rellena cada campo con ceros a la izquierda a su ancho fijo", () => {
    const payload = buildCufPayload(components);
    assert.equal(payload.length, 53);
    assert.ok(payload.startsWith("0005371375010")); // nit(13)
    assert.ok(payload.includes("20260722120000000")); // fechaHora(17)
    assert.ok(payload.includes("0000000042")); // numeroFactura(10)
  });

  it("lanza si un campo excede su ancho o no es numerico", () => {
    assert.throws(() => buildCufPayload({ ...components, sucursal: "99999" }), /excede el ancho/);
    assert.throws(() => buildCufPayload({ ...components, nit: "ABC" }), /numerico/);
  });
});

describe("CUF completo (base 16 + codigo de control del CUFD)", () => {
  const components = {
    nit: "5371375010",
    fechaHora: "20260722120000000",
    sucursal: "0",
    modalidad: "1",
    tipoEmision: "1",
    tipoFactura: "1",
    tipoDocumentoSector: "1",
    numeroFactura: "42",
    puntoVenta: "0",
  };

  it("decimalStringToHex convierte decimal grande a hex mayusculas", () => {
    assert.equal(decimalStringToHex("255"), "FF");
    assert.equal(decimalStringToHex("0"), "0");
  });

  it("buildCufCore es hex mayusculas y deterministico (misma entrada -> mismo CUF)", () => {
    const core = buildCufCore(components);
    assert.match(core, /^[0-9A-F]+$/);
    assert.equal(buildCufCore(components), core);
  });

  it("buildCuf concatena el codigo de control del CUFD al final", () => {
    const codigoControl = "A19E23EF34124CD";
    const cuf = buildCuf(components, codigoControl);
    assert.ok(cuf.endsWith(codigoControl));
    assert.equal(cuf, buildCufCore(components) + codigoControl);
  });

  it("buildCuf exige el codigo de control (viene del CUFD, external_gate del SIN)", () => {
    assert.throws(() => buildCuf(components), /codigoControl/);
    assert.throws(() => buildCuf(components, ""), /codigoControl/);
  });
});
