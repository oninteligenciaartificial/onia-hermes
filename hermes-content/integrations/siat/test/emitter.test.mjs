/*
 * Tests del orquestador del emisor (emitInvoice) con un SIN SIMULADO (mock del
 * transporte). Prueba el flujo de punta a punta: ensamblar -> postear -> mapear
 * el codigoEstado del SIN a la transicion de estado. Sin red real.
 * Run: node --test hermes-content/integrations/siat/test/emitter.test.mjs
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { emitInvoice, estadoFromSin } from "../src/emitter.mjs";
import { buildTenant } from "../src/tenant-registry.mjs";
import { buildInvoicePayload } from "../src/invoice-payload.mjs";
import { MODALITIES } from "../src/constants.mjs";

const NOW = "2026-07-22T12:00:00.000Z";

function readyTenant() {
  return buildTenant({
    orgId: "org-1",
    emisor: {
      nit: "5371375010",
      razonSocial: "ONIA SRL",
      codigoSistema: "SIS123",
      municipio: "Santa Cruz",
      direccion: "Av. Test 123",
      modalidad: MODALITIES.COMPUTARIZADA_EN_LINEA,
    },
    sucursales: [{ codigo: 0, nombre: "Casa Matriz" }],
    puntosVenta: [{ codigo: 0, sucursalCodigo: 0 }],
    tokenDelegado: { referencia: "vault://org-1/token", estado: "activo", vigenciaDesde: null, vigenciaHasta: null },
  });
}

function samplePayload() {
  return buildInvoicePayload({
    emisor: {
      nit: "5371375010",
      sucursalCodigo: 0,
      puntoVentaCodigo: 0,
      actividadEconomica: "620000",
      modalidad: MODALITIES.COMPUTARIZADA_EN_LINEA,
    },
    receptor: { tipoDocumentoIdentidad: 5, numeroDocumento: "1234567015", razonSocial: "ACME SRL" },
    documento: { tipoDocumentoSector: 1, fechaEmision: NOW, moneda: "BOB", tipoCambio: 1 },
    items: [
      { descripcion: "Servicio", cantidad: 1, precioUnitario: 116, codigoProducto: "SRV-01", codigoProductoSin: "83131", unidadMedida: 58, actividadEconomica: "620000" },
    ],
    numeroFactura: 42,
  });
}

const baseContext = () => ({
  payload: samplePayload(),
  tenant: readyTenant(),
  cuis: "CUIS123",
  cufd: { codigo: "CUFD123", codigoControl: "A1B2C3" },
  numeroFactura: 42,
  fechaEmision: NOW,
  environment: "piloto",
  // La leyenda es obligatoria (Ley 453) y en produccion viene del catalogo de
  // leyendas sincronizado; el orquestador la reenvia al ensamblador.
  leyenda: "Ley N 453: El proveedor te debe informar el precio final.",
});

const mockTransport = (response) => async () => response;

describe("emitInvoice (orquestador del emisor)", () => {
  it("factura validada (908) -> estado validated, delivered, CUF con codigo de control", async () => {
    const transport = mockTransport({
      ok: true,
      status: 200,
      body: "<x/>",
      parsed: { transaccion: true, codigoEstado: 908, codigoRecepcion: "R-1", mensajes: [] },
    });
    const r = await emitInvoice(baseContext(), { transport, token: "T", now: NOW });
    assert.equal(r.delivered, true);
    assert.equal(r.estado, "validated");
    assert.equal(r.emission.state, "validated");
    assert.equal(r.codigoRecepcion, "R-1");
    assert.ok(r.material.cuf.endsWith("A1B2C3")); // el CUF concatena el codigo de control del CUFD
  });

  it("observada (904) -> estado observed, con el motivo del SIN", async () => {
    const transport = mockTransport({
      ok: true,
      status: 200,
      body: "<x/>",
      parsed: { transaccion: true, codigoEstado: 904, mensajes: [{ codigo: 5, descripcion: "dato observado" }] },
    });
    const r = await emitInvoice(baseContext(), { transport, token: "T", now: NOW });
    assert.equal(r.estado, "observed");
    assert.equal(r.emission.lastReason, "dato observado");
  });

  it("pendiente (901) -> queda en sent (la validacion del SIN es asincrona)", async () => {
    const transport = mockTransport({
      ok: true,
      status: 200,
      body: "<x/>",
      parsed: { transaccion: true, codigoEstado: 901, codigoRecepcion: "R-2", mensajes: [] },
    });
    const r = await emitInvoice(baseContext(), { transport, token: "T", now: NOW });
    assert.equal(r.estado, "sent");
    assert.equal(r.delivered, true);
  });

  it("rechazo de negocio (transaccion false) -> estado rejected, delivered", async () => {
    const transport = mockTransport({
      ok: false,
      status: 200,
      body: "<transaccion>false</transaccion>",
      parsed: { transaccion: false, codigoEstado: null, mensajes: [{ codigo: 99, descripcion: "rechazo" }] },
    });
    const r = await emitInvoice(baseContext(), { transport, token: "T", now: NOW });
    assert.equal(r.estado, "rejected");
    assert.equal(r.delivered, true);
  });

  it("caida de red -> NO entregada, sigue en queued para reintento", async () => {
    const transport = mockTransport({ ok: false, status: 0, body: "", parsed: null, error: "timeout" });
    const r = await emitInvoice(baseContext(), { transport, token: "T", now: NOW });
    assert.equal(r.delivered, false);
    assert.equal(r.estado, "queued");
  });

  it("lanza si el tenant no esta listo para emitir", async () => {
    const ctx = { ...baseContext(), tenant: buildTenant({ orgId: "x" }) };
    const transport = mockTransport({ ok: true, status: 200, parsed: { codigoEstado: 908 } });
    await assert.rejects(() => emitInvoice(ctx, { transport, token: "T", now: NOW }), /tenant no listo/);
  });

  it("lanza si no se inyecta transport", async () => {
    await assert.rejects(() => emitInvoice(baseContext(), { token: "T" }), /transport inyectable/);
  });

  it("estadoFromSin mapea los codigos del SIN (908/904/901/otro)", () => {
    assert.equal(estadoFromSin(908), "validated");
    assert.equal(estadoFromSin(904), "observed");
    assert.equal(estadoFromSin(901), "sent");
    assert.equal(estadoFromSin(999), "rejected");
  });
});
