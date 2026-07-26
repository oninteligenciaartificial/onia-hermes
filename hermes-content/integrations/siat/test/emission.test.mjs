/*
 * Tests del ensamblador de emision (SIAT Bolivia). Ata las piezas ya construidas
 * (CUF verificado + XML + gzip/base64 + hash + envelope de recepcion). El gzip es
 * deterministico en la misma plataforma pero NO se compara el base64 exacto: se
 * valida por ROUND-TRIP. Fechas SIEMPRE como parametro.
 * Run: node --test hermes-content/integrations/siat/test/emission.test.mjs
 */
import assert from "node:assert/strict";
import { gunzipSync } from "node:zlib";
import { describe, it } from "node:test";

import {
  assembleEmission,
  deriveCufComponents,
  formatFechaHoraCuf,
  toSinDateString,
} from "../src/emission.mjs";
import { buildInvoicePayload } from "../src/invoice-payload.mjs";
import { buildTenant } from "../src/tenant-registry.mjs";
import { buildCuf } from "../src/cuf.mjs";

const FECHA_EMISION = "2026-07-22T12:00:00.000";
const FECHA_ENVIO = "2026-07-22T12:05:30.250";

function makePayload(overrides = {}) {
  return buildInvoicePayload({
    emisor: {
      nit: "5371375010",
      sucursalCodigo: 0,
      puntoVentaCodigo: 0,
      actividadEconomica: "620000",
      modalidad: "computarizada_en_linea",
    },
    receptor: {
      tipoDocumentoIdentidad: 5,
      numeroDocumento: "1234567015",
      razonSocial: "ACME SRL",
      complemento: null,
    },
    documento: { tipoDocumentoSector: 1, fechaEmision: FECHA_EMISION, moneda: "BOB", tipoCambio: 1 },
    items: [
      {
        descripcion: "Servicio de software & soporte",
        cantidad: 1,
        precioUnitario: 116,
        codigoProductoSin: "83131",
        codigoProducto: "SRV-01",
        unidadMedida: 58,
        actividadEconomica: "620000",
      },
    ],
    pagos: [{ codigoMetodoPago: 1 }],
    numeroFactura: "42",
    ...overrides,
  });
}

function makeTenant() {
  return buildTenant({
    orgId: "onia",
    emisor: {
      nit: "5371375010",
      razonSocial: "ONIA SRL",
      codigoSistema: "ABC123SYS",
      municipio: "Santa Cruz",
      direccion: "Av Siempre Viva 123",
      modalidad: "computarizada_en_linea",
    },
    sucursales: [{ codigo: 0, nombre: "Casa Matriz" }],
    puntosVenta: [{ codigo: 0, sucursalCodigo: 0 }],
  });
}

const CUFD = { codigo: "CUFD-DEL-DIA", codigoControl: "A19E23EF34124CD" };
const CUIS = { codigo: "CUIS-SYS-01" };

function emit(overrides = {}) {
  return assembleEmission({
    payload: makePayload(),
    tenant: makeTenant(),
    cufd: CUFD,
    cuis: CUIS,
    numeroFactura: "42",
    fechaEmision: FECHA_EMISION,
    fechaEnvio: FECHA_ENVIO,
    leyenda: "Ley 453: tienes derecho a un trato equitativo.",
    usuario: "onia",
    ...overrides,
  });
}

describe("formato de fecha (parametro, deterministico)", () => {
  it("fechaEmision ISO string -> 17 digitos yyyyMMddHHmmssSSS sin conversion de zona", () => {
    assert.equal(formatFechaHoraCuf(FECHA_EMISION), "20260722120000000");
  });

  it("rellena los milisegundos a 3 digitos", () => {
    assert.equal(formatFechaHoraCuf("2026-01-05T09:08:07.5"), "20260105090807500");
    assert.equal(formatFechaHoraCuf("2026-01-05T09:08:07"), "20260105090807000");
  });

  it("un Date usa los componentes UTC (estable en tests)", () => {
    const d = new Date(Date.UTC(2026, 6, 22, 12, 0, 0, 0));
    assert.equal(formatFechaHoraCuf(d), "20260722120000000");
  });

  it("toSinDateString reinserta separadores para el XML/SOAP", () => {
    assert.equal(toSinDateString(FECHA_EMISION), "2026-07-22T12:00:00.000");
  });

  it("lanza claro si falta la fecha", () => {
    assert.throws(() => formatFechaHoraCuf(null), /fechaEmision/);
  });
});

describe("deriveCufComponents (9 componentes)", () => {
  it("deriva los 9 campos desde tenant + payload + constantes", () => {
    const c = deriveCufComponents({
      payload: makePayload(),
      tenant: makeTenant(),
      numeroFactura: "42",
      fechaEmision: FECHA_EMISION,
    });
    assert.equal(c.nit, "5371375010");
    assert.equal(c.fechaHora, "20260722120000000");
    assert.equal(c.sucursal, 0);
    assert.equal(c.modalidad, 2); // computarizada
    assert.equal(c.tipoEmision, 1); // en linea
    assert.equal(c.tipoDocumentoSector, 1);
    assert.equal(c.numeroFactura, "42");
    assert.equal(c.puntoVenta, 0);
  });

  it("lanza si falta numeroFactura", () => {
    assert.throws(
      () => deriveCufComponents({ payload: makePayload({ numeroFactura: null }), tenant: makeTenant(), fechaEmision: FECHA_EMISION }),
      /numeroFactura/,
    );
  });
});

describe("assembleEmission (flujo completo)", () => {
  it("devuelve las 5 piezas: cuf, xml, archivo, hashArchivo, recepcionRequest", () => {
    const out = emit();
    assert.ok(out.cuf && out.xml && out.archivo && out.hashArchivo && out.recepcionRequest);
  });

  it("gzip ROUND-TRIP: gunzip(base64(archivo)) reconstruye exactamente el XML", () => {
    const out = emit();
    const restaurado = gunzipSync(Buffer.from(out.archivo, "base64")).toString("utf8");
    assert.equal(restaurado, out.xml);
  });

  it("el cuf termina con el codigo de control del CUFD del dia", () => {
    const out = emit();
    assert.ok(out.cuf.endsWith(CUFD.codigoControl));
    // y es exactamente el CUF que produce cuf.mjs con esos componentes.
    const componentes = deriveCufComponents({
      payload: makePayload(),
      tenant: makeTenant(),
      numeroFactura: "42",
      fechaEmision: FECHA_EMISION,
    });
    assert.equal(out.cuf, buildCuf(componentes, CUFD.codigoControl));
  });

  it("hashArchivo es SHA-256 hex de 64 chars", () => {
    const out = emit();
    assert.match(out.hashArchivo, /^[0-9a-f]{64}$/);
  });

  it("el XML lleva el cuf, el cufd y la fechaEmision del SIN", () => {
    const out = emit();
    assert.ok(out.xml.includes(`<cuf>${out.cuf}</cuf>`));
    assert.ok(out.xml.includes(`<cufd>${CUFD.codigo}</cufd>`));
    assert.ok(out.xml.includes("<fechaEmision>2026-07-22T12:00:00.000</fechaEmision>"));
    assert.ok(out.xml.includes("<facturaComputarizadaCompraVenta"));
    // receptor mapeado a comprador.
    assert.ok(out.xml.includes("<nombreRazonSocial>ACME SRL</nombreRazonSocial>"));
    assert.ok(out.xml.includes("<numeroDocumento>1234567015</numeroDocumento>"));
  });

  it("el recepcionRequest incluye el archivo y el hashArchivo", () => {
    const out = emit();
    assert.ok(out.recepcionRequest.includes(`<archivo>${out.archivo}</archivo>`));
    assert.ok(out.recepcionRequest.includes(`<hashArchivo>${out.hashArchivo}</hashArchivo>`));
  });

  it("el recepcionRequest lleva los codigos derivados del tenant/ambiente", () => {
    const out = emit();
    // piloto -> codigoAmbiente 2 (al reves de lo intuitivo); computarizada -> 2; en linea -> 1.
    assert.ok(out.recepcionRequest.includes("<codigoAmbiente>2</codigoAmbiente>"));
    assert.ok(out.recepcionRequest.includes("<codigoModalidad>2</codigoModalidad>"));
    assert.ok(out.recepcionRequest.includes("<codigoEmision>1</codigoEmision>"));
    assert.ok(out.recepcionRequest.includes("<codigoSistema>ABC123SYS</codigoSistema>"));
    assert.ok(out.recepcionRequest.includes("<nit>5371375010</nit>"));
    assert.ok(out.recepcionRequest.includes("<cufd>CUFD-DEL-DIA</cufd>"));
    assert.ok(out.recepcionRequest.includes("<cuis>CUIS-SYS-01</cuis>"));
    assert.ok(out.recepcionRequest.includes("<fechaEnvio>2026-07-22T12:05:30.250</fechaEnvio>"));
  });

  it("es deterministico: mismos inputs -> mismo cuf, xml y hash", () => {
    const a = emit();
    const b = emit();
    assert.equal(a.cuf, b.cuf);
    assert.equal(a.xml, b.xml);
    assert.equal(a.hashArchivo, b.hashArchivo);
  });

  it("falla claro si falta cufd.codigoControl", () => {
    assert.throws(() => emit({ cufd: { codigo: "CUFD-DEL-DIA" } }), /codigoControl/);
    assert.throws(() => emit({ cufd: { codigo: "X", codigoControl: "" } }), /codigoControl/);
  });

  it("acepta cuis como string ademas de objeto", () => {
    const out = emit({ cuis: "CUIS-PLANO" });
    assert.ok(out.recepcionRequest.includes("<cuis>CUIS-PLANO</cuis>"));
  });
});
