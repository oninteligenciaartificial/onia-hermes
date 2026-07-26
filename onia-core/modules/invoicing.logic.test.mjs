/*
 * Tests de la logica pura del modulo invoicing (Bolivia). Run:
 *   node --test onia-core/modules/invoicing.logic.test.mjs
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  BUYER_DOC_TYPES,
  CUF_FIELD_WIDTHS,
  amountToWords,
  assertValidBuyer,
  buildCreditDebitNote,
  buildCuf,
  buildCufPayload,
  buildQrUrl,
  cancellationDeadline,
  canCancelInvoice,
  computeInvoiceTotal,
  invoiceTotalInBob,
  decimalStringToHex,
  integerToWords,
  isPastCancellationDeadline,
  mod11CheckDigit,
  validateBuyer,
  validateInvoiceLineHomologation,
} from "./invoicing.logic.mjs";

describe("moneda extranjera: TCO del BCB (RND 102600000026)", () => {
  it("factura en USD se convierte a BOB con el TCO del dia", () => {
    const r = invoiceTotalInBob(1000, { currency: "USD", dailyTco: 10.9 });
    assert.equal(r.currency, "USD");
    assert.equal(r.tcoUsed, 10.9);
    assert.equal(r.bobTotal, 10900);
  });
  it("factura en BOB: TCO 1, total sin cambio", () => {
    const r = invoiceTotalInBob(500, { currency: "BOB" });
    assert.equal(r.tcoUsed, 1);
    assert.equal(r.bobTotal, 500);
  });
  it("sin TCO del dia cae al fallback historico (6.96) sin romper", () => {
    const r = invoiceTotalInBob(100, { currency: "USD" });
    assert.equal(r.tcoUsed, 6.96);
    assert.equal(r.bobTotal, 696);
  });
});

describe("comprador y homologacion SIN por item (RND 102500000018)", () => {
  it("BUYER_DOC_TYPES: 1=CI ... 5=NIT (parametrica estandar, sync diaria)", () => {
    assert.equal(BUYER_DOC_TYPES.CI, 1);
    assert.equal(BUYER_DOC_TYPES.CEX, 2);
    assert.equal(BUYER_DOC_TYPES.NIT, 5);
  });

  it("validateBuyer exige razon social, tipo de documento (1-5) y numero", () => {
    assert.deepEqual(validateBuyer({ name: "ACME SRL", docType: 5, docNumber: "1234567015" }), {
      valid: true,
      errors: [],
    });
    const bad = validateBuyer({ name: "", docType: 9, docNumber: "" });
    assert.equal(bad.valid, false);
    assert.equal(bad.errors.length, 3);
  });

  it("assertValidBuyer lanza si faltan datos; pasa con datos completos", () => {
    assert.throws(() => assertValidBuyer({ docType: 1 }), /comprador invalido/);
    assert.equal(assertValidBuyer({ name: "Juan Perez", docType: 1, docNumber: "9876543" }), true);
  });

  it("homologacion de linea: exige codigoProductoSin + actividadEconomica (CAEB) + unidadMedida", () => {
    const ok = validateInvoiceLineHomologation({
      sinProductCode: "99100",
      economicActivityCode: "620000",
      unitMeasureCode: 20,
      quantity: 3,
    });
    assert.deepEqual(ok, { valid: true, errors: [] });
    const bad = validateInvoiceLineHomologation({ quantity: 3 });
    assert.equal(bad.valid, false);
    assert.equal(bad.errors.length, 3); // faltan los 3 codigos
  });

  it("servicios (unidad 58): la cantidad debe ser 1", () => {
    const bad = validateInvoiceLineHomologation({
      sinProductCode: "8",
      economicActivityCode: "1",
      unitMeasureCode: 58,
      quantity: 2,
    });
    assert.equal(bad.valid, false);
    assert.match(bad.errors.join(" "), /cantidad debe ser 1/);
    const ok = validateInvoiceLineHomologation({
      sinProductCode: "8",
      economicActivityCode: "1",
      unitMeasureCode: 58,
      quantity: 1,
    });
    assert.equal(ok.valid, true);
  });
});

describe("computeInvoiceTotal", () => {
  it("reutiliza la formula de commerce (cantidad*precio - descuento)", () => {
    assert.equal(
      computeInvoiceTotal([
        { quantity: 2, unitPrice: 100 },
        { quantity: 1, unitPrice: 50, discount: 10 },
      ]),
      240,
    );
  });
});

describe("integerToWords", () => {
  it("numeros basicos", () => {
    assert.equal(integerToWords(0), "cero");
    assert.equal(integerToWords(1), "uno");
    assert.equal(integerToWords(10), "diez");
    assert.equal(integerToWords(15), "quince");
    assert.equal(integerToWords(21), "veintiuno");
    assert.equal(integerToWords(30), "treinta");
    assert.equal(integerToWords(31), "treinta y uno");
  });

  it("centenas (con el caso especial de 'cien')", () => {
    assert.equal(integerToWords(100), "cien");
    assert.equal(integerToWords(101), "ciento uno");
    assert.equal(integerToWords(200), "doscientos");
    assert.equal(integerToWords(999), "novecientos noventa y nueve");
  });

  it("miles, con apocope de 'uno' -> 'un' antes de mil", () => {
    assert.equal(integerToWords(1000), "mil");
    assert.equal(integerToWords(1001), "mil uno");
    assert.equal(integerToWords(21000), "veintiun mil");
    assert.equal(integerToWords(31021), "treinta y un mil veintiuno");
  });

  it("millones, con apocope antes de 'millones' (no antes de 'millon' singular)", () => {
    assert.equal(integerToWords(1_000_000), "un millon");
    assert.equal(integerToWords(2_000_000), "dos millones");
    assert.equal(integerToWords(21_000_000), "veintiun millones");
  });

  it("rechaza negativos, no numericos y fuera de rango", () => {
    assert.throws(() => integerToWords(-1), /negativo/);
    assert.throws(() => integerToWords(Number.NaN), /invalido/);
    assert.throws(() => integerToWords(1_000_000_000), /fuera de rango/);
  });

  it("trunca decimales", () => {
    assert.equal(integerToWords(10.9), "diez");
  });
});

describe("amountToWords", () => {
  it("arma el importe en literal con centavos", () => {
    assert.equal(amountToWords(1000.5), "Mil 50/100 Bolivianos");
    assert.equal(amountToWords(0), "Cero 00/100 Bolivianos");
    assert.equal(amountToWords(21.05), "Veintiuno 05/100 Bolivianos");
  });

  it("rechaza importes negativos", () => {
    assert.throws(() => amountToWords(-5), /negativo/);
  });
});

describe("CUF: payload, digito verificador y hex", () => {
  const components = {
    nit: "1234567015",
    dateTime: "20260706120000000",
    branch: "0",
    modality: "2",
    emissionType: "1",
    invoiceType: "1",
    docSectorType: "01",
    invoiceNumber: "42",
    pointOfSale: "0",
  };

  it("el ancho total documentado es 51 digitos (+1 verificador = 52)", () => {
    const totalWidth = Object.values(CUF_FIELD_WIDTHS).reduce((sum, width) => sum + width, 0);
    assert.equal(totalWidth, 51);
  });

  it("buildCufPayload rellena cada campo a su ancho fijo", () => {
    const payload = buildCufPayload(components);
    assert.equal(payload.length, 51);
    assert.ok(payload.startsWith("0001234567015")); // nit(13) con padding
  });

  it("buildCufPayload lanza si un campo excede su ancho", () => {
    assert.throws(() => buildCufPayload({ ...components, branch: "99999" }), /excede el ancho/);
  });

  it("mod11CheckDigit es deterministico (0-10)", () => {
    const digit = mod11CheckDigit("123456789");
    assert.ok(digit >= 0 && digit <= 10);
    assert.equal(mod11CheckDigit("123456789"), digit); // mismo input -> mismo output
  });

  it("decimalStringToHex convierte decimal a hex", () => {
    assert.equal(decimalStringToHex("255"), "FF");
    assert.equal(decimalStringToHex("0"), "0");
  });

  it("buildCuf produce un hex valido y deterministico (misma entrada -> mismo CUF)", () => {
    const cuf = buildCuf(components);
    assert.match(cuf, /^[0-9A-F]+$/);
    assert.equal(buildCuf(components), cuf);
  });
});

describe("buildQrUrl", () => {
  it("arma la URL con los 4 parametros confirmados (nit, cuf, numero, t)", () => {
    const url = buildQrUrl({ nit: "1234567015", cuf: "ABC123", invoiceNumber: "42" });
    assert.equal(url, "https://pilotosiat.impuestos.gob.bo/consulta/QR?nit=1234567015&cuf=ABC123&numero=42&t=1");
  });

  it("acepta host y tamano personalizados", () => {
    const url = buildQrUrl({ host: "https://siat.impuestos.gob.bo", nit: "1", cuf: "X", invoiceNumber: "1", size: 2 });
    assert.equal(url, "https://siat.impuestos.gob.bo/consulta/QR?nit=1&cuf=X&numero=1&t=2");
  });

  it("exige nit, cuf y numero de factura", () => {
    assert.throws(() => buildQrUrl({ nit: "1", cuf: "X" }), /requiere nit, cuf/);
  });
});

describe("anulacion (vencimiento dia 9 del mes siguiente)", () => {
  it("cancellationDeadline calcula el mes siguiente, con rollover de anio", () => {
    assert.equal(cancellationDeadline("2026-07-15"), "2026-08-09");
    assert.equal(cancellationDeadline("2026-01-01"), "2026-02-09");
    assert.equal(cancellationDeadline("2026-12-20"), "2027-01-09");
  });

  it("isPastCancellationDeadline compara contra el vencimiento", () => {
    assert.equal(isPastCancellationDeadline("2026-07-15", "2026-08-01T00:00:00.000Z"), false);
    assert.equal(isPastCancellationDeadline("2026-07-15", "2026-08-10T00:00:00.000Z"), true);
  });

  it("canCancelInvoice: caso feliz y los tres bloqueos", () => {
    const now = "2026-07-20T00:00:00.000Z";
    const invoice = { status: "issued", issueDate: "2026-07-15" };
    assert.equal(canCancelInvoice(invoice, { now }), true);
    assert.equal(canCancelInvoice({ ...invoice, status: "cancelled" }, { now }), false);
    assert.equal(canCancelInvoice(invoice, { now, confirmedInRcv: true }), false);
    assert.equal(canCancelInvoice(invoice, { now, declared: true }), false);
    assert.equal(canCancelInvoice(invoice, { now: "2026-09-01T00:00:00.000Z" }), false); // vencida
  });
});

describe("buildCreditDebitNote", () => {
  it("referencia el CUF de la factura original", () => {
    const note = buildCreditDebitNote(
      { id: "inv1", cuf: "ABC123" },
      { noteType: "credito", reason: "devolucion parcial", amount: 100.456, number: "NCD-0001", date: "2026-07-20" },
    );
    assert.equal(note.originalInvoiceCuf, "ABC123");
    assert.equal(note.originalInvoiceId, "inv1");
    assert.equal(note.amount, 100.46);
  });

  it("exige el CUF original y un noteType valido", () => {
    assert.throws(() => buildCreditDebitNote({ id: "inv1" }, { noteType: "credito" }), /CUF de la factura original/);
    assert.throws(() => buildCreditDebitNote({ cuf: "X" }, { noteType: "reembolso" }), /noteType invalido/);
  });
});
