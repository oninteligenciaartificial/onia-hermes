/*
 * Tests del wrapper HTTP del emisor SIAT — servidor real en puerto efimero,
 * SIN simulado (transport inyectado), cero red al piloto.
 * El contrato que se verifica es el del CALLER (onia-platform siat-client.ts):
 * 200 con codigoEstado / 5xx = queued / 4xx sin codigoEstado = rejected.
 * Run: node --test hermes-content/integrations/siat/test/http-wrapper.test.mjs
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import {
  buildWrapperResponse,
  createWrapper,
  mapProductInvoice,
  qrUrlFor,
  readConfig,
} from "../src/http-wrapper.mjs";

function testConfig(overrides = {}) {
  return {
    environment: "piloto",
    host: "127.0.0.1",
    port: 0,
    wrapperToken: "wtok-secreto",
    sinToken: "sintok",
    nit: "5371375010",
    codigoSistema: "SIS1",
    cuis: "CUIS1",
    sucursal: 0,
    puntoVenta: 0,
    actividadEconomica: "620000",
    codigoProductoSin: "83131",
    unidadMedida: "58",
    leyenda: "Ley N° 453: prueba.",
    codigoMetodoPago: 1,
    razonSocial: "OniaAgency",
    municipio: "Santa Cruz de la Sierra",
    direccion: "Av. Test",
    stateFile: join(mkdtempSync(join(tmpdir(), "siat-wrapper-")), "state.json"),
    numeroInicial: 1000,
    ...overrides,
  };
}

/**
 * SIN simulado: rutea por el contenido del envelope. `modo.recepcion` controla
 * la respuesta de recepcionFactura: "908" | "904" | "rechazo" | "network".
 */
function fakeSin(modo = { recepcion: "908" }) {
  const calls = { fechaHora: 0, cufd: 0, recepcion: 0 };
  const transport = async ({ envelope }) => {
    const e = String(envelope);
    if (e.includes("sincronizarFechaHora")) {
      calls.fechaHora += 1;
      return {
        ok: true,
        status: 200,
        body: "<fechaHora>2026-09-12T12:00:00.000</fechaHora>",
        parsed: { transaccion: true },
      };
    }
    if (e.includes("SolicitudCufd")) {
      calls.cufd += 1;
      if (modo.cufd === "network") {
        return { ok: false, status: null, body: null, parsed: null, error: "network" };
      }
      return {
        ok: true,
        status: 200,
        body: "<x/>",
        parsed: {
          transaccion: true,
          codigo: "CUFD-WRAP-1",
          codigoControl: "A1B2C3",
          fechaVigencia: "2099-01-01T00:00:00.000",
        },
      };
    }
    calls.recepcion += 1;
    if (modo.recepcion === "network") {
      return { ok: false, status: null, body: null, parsed: null, error: "network" };
    }
    if (modo.recepcion === "rechazo") {
      return {
        ok: false,
        status: 200,
        body: "<transaccion>false</transaccion>",
        parsed: { transaccion: false, codigoEstado: null, mensajes: [{ codigo: 999, descripcion: "NIT INVALIDO" }] },
      };
    }
    return {
      ok: true,
      status: 200,
      body: "<x/>",
      parsed: { transaccion: true, codigoEstado: Number(modo.recepcion), codigoRecepcion: "R-77", mensajes: [] },
    };
  };
  return { transport, calls, modo };
}

async function startWrapper(t, { modo, config: cfgOverrides } = {}) {
  const config = testConfig(cfgOverrides);
  const sin = fakeSin(modo ?? { recepcion: "908" });
  const { server, state } = createWrapper(config, { transport: sin.transport });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(() => server.close());
  const base = `http://127.0.0.1:${server.address().port}`;
  const post = (body, { token = config.wrapperToken, key = "invoice:abc" } = {}) =>
    fetch(`${base}/fiscal/invoices`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(token ? { authorization: `Bearer ${token}` } : {}),
        ...(key ? { "idempotency-key": key } : {}),
      },
      body: JSON.stringify(body),
    });
  return { base, post, sin, state, config };
}

function productBody(overrides = {}) {
  return {
    organizationId: "org-1",
    environment: "piloto",
    invoice: {
      invoiceNumber: "F-001",
      issueDate: "2026-09-12",
      currencyCode: "BOB",
      total: 100,
      customer: { name: "Juan Perez", taxId: "1234567", email: null },
      lines: [{ description: "Consulta", quantity: 2, unitPrice: 50, lineTotal: 100 }],
    },
    ...overrides,
  };
}

describe("mapProductInvoice (mapeo puro)", () => {
  const config = testConfig();

  it("mapea la factura del producto al payload normalizado con la homologacion del env", () => {
    const { payload, errors } = mapProductInvoice(productBody().invoice, config);
    assert.deepEqual(errors, []);
    assert.equal(payload.montoTotal, 100);
    assert.equal(payload.items[0].codigoProductoSin, "83131");
    assert.equal(payload.items[0].actividadEconomica, "620000");
    assert.equal(payload.receptor.numeroDocumento, "1234567");
    assert.equal(payload.receptor.tipoDocumentoIdentidad, 1); // CI (el producto manda patient.ci)
    assert.equal(payload.documento.tipoDocumentoSector, 1);
  });

  it("lineTotal menor que cantidad*precio => la diferencia es descuento", () => {
    const invoice = productBody().invoice;
    invoice.lines = [{ description: "Consulta", quantity: 2, unitPrice: 50, lineTotal: 90 }];
    invoice.total = 90;
    const { payload, errors } = mapProductInvoice(invoice, config);
    assert.deepEqual(errors, []);
    assert.equal(payload.items[0].descuento, 10);
    assert.equal(payload.montoTotal, 90);
  });

  it("lineTotal MAYOR que cantidad*precio => error (no representable)", () => {
    const invoice = productBody().invoice;
    invoice.lines = [{ description: "X", quantity: 1, unitPrice: 50, lineTotal: 60 }];
    invoice.total = 60;
    const { payload, errors } = mapProductInvoice(invoice, config);
    assert.equal(payload, null);
    assert.ok(errors.some((e) => e.includes("mayor que cantidad*precio")));
  });

  it("sin taxId => consumidor final (S/N, documento 0)", () => {
    const invoice = productBody().invoice;
    invoice.customer = { name: "Sin Nit", taxId: null, email: null };
    const { payload, errors } = mapProductInvoice(invoice, config);
    assert.deepEqual(errors, []);
    assert.equal(payload.receptor.razonSocial, "S/N");
    assert.equal(payload.receptor.numeroDocumento, "0");
  });

  it("total que no cuadra con las lineas => error", () => {
    const invoice = productBody().invoice;
    invoice.total = 999;
    const { errors } = mapProductInvoice(invoice, config);
    assert.ok(errors.some((e) => e.includes("no cuadra")));
  });

  it("moneda distinta de BOB => error", () => {
    const invoice = productBody().invoice;
    invoice.currencyCode = "USD";
    const { errors } = mapProductInvoice(invoice, config);
    assert.ok(errors.some((e) => e.includes("BOB")));
  });
});

describe("readConfig (fail-closed)", () => {
  it("lanza con la LISTA de variables faltantes", () => {
    assert.throws(
      () => readConfig({ SIAT_ENV: "piloto", SIAT_NIT: "123456" }),
      /SIAT_WRAPPER_TOKEN.*SIAT_CUIS/s,
    );
  });

  it("rechaza un SIAT_ENV desconocido", () => {
    assert.throws(() => readConfig({ SIAT_ENV: "prod" }), /SIAT_ENV invalido/);
  });

  it("acepta el token del SIN como SIAT_PILOT_TOKEN (mismo env del runner)", () => {
    const config = readConfig({
      SIAT_WRAPPER_TOKEN: "w",
      SIAT_PILOT_TOKEN: "sin-token",
      SIAT_NIT: "5371375010",
      SIAT_CODIGO_SISTEMA: "S",
      SIAT_CUIS: "C",
      SIAT_ACTIVIDAD_ECONOMICA: "620000",
      SIAT_CODIGO_PRODUCTO_SIN: "83131",
      SIAT_UNIDAD_MEDIDA: "58",
    });
    assert.equal(config.sinToken, "sin-token");
    assert.equal(config.environment, "piloto"); // default: JAMAS produccion implicita
  });
});

describe("POST /fiscal/invoices (contrato del caller)", () => {
  it("factura validada: 200 con codigoEstado 908, CUF, QR y delivered", async (t) => {
    const { post, sin } = await startWrapper(t);
    const res = await post(productBody());
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.codigoEstado, 908);
    assert.equal(body.estado, "validated");
    assert.equal(body.delivered, true);
    assert.equal(body.cufd, "CUFD-WRAP-1");
    assert.equal(body.controlCode, "A1B2C3");
    assert.equal(body.codigoRecepcion, "R-77");
    assert.ok(body.cuf.endsWith("A1B2C3")); // el CUF concatena el codigo de control del CUFD
    assert.ok(body.qrUrl.includes("pilotosiat.impuestos.gob.bo"));
    assert.ok(body.qrUrl.includes(body.cuf));
    assert.equal(sin.calls.cufd, 1);
    assert.equal(sin.calls.recepcion, 1);
  });

  it("idempotencia: la misma Idempotency-Key NO re-emite y devuelve el mismo CUF", async (t) => {
    const { post, sin } = await startWrapper(t);
    const r1 = await (await post(productBody())).json();
    const r2 = await (await post(productBody())).json();
    assert.equal(sin.calls.recepcion, 1); // una sola emision real
    assert.equal(r1.cuf, r2.cuf);
    assert.equal(r1.numeroFactura, r2.numeroFactura);
  });

  it("sin token o token invalido: 401 y el SIN ni se toca", async (t) => {
    const { post, sin } = await startWrapper(t);
    assert.equal((await post(productBody(), { token: null })).status, 401);
    assert.equal((await post(productBody(), { token: "otro" })).status, 401);
    assert.equal(sin.calls.recepcion, 0);
    assert.equal(sin.calls.cufd, 0);
  });

  it("sin Idempotency-Key: 400 (no se puede garantizar no duplicar)", async (t) => {
    const { post } = await startWrapper(t);
    const res = await post(productBody(), { key: null });
    assert.equal(res.status, 400);
  });

  it("environment que no coincide con el del servicio: 400", async (t) => {
    const { post, sin } = await startWrapper(t);
    const res = await post(productBody({ environment: "produccion" }));
    assert.equal(res.status, 400);
    assert.equal(sin.calls.recepcion, 0);
  });

  it("factura invalida: 400 con la lista de errores (el caller la marca rejected)", async (t) => {
    const { post, sin } = await startWrapper(t);
    const body = productBody();
    body.invoice.lines = [];
    const res = await post(body);
    assert.equal(res.status, 400);
    const parsed = await res.json();
    assert.ok(Array.isArray(parsed.errors) && parsed.errors.length > 0);
    assert.equal(parsed.codigoEstado, undefined); // 4xx sin codigoEstado = rechazo para el caller
    assert.equal(sin.calls.recepcion, 0);
  });

  it("SIN caido en recepcion: 503 (el caller la deja queued) y el correlativo NO se quema", async (t) => {
    const { post, sin, state } = await startWrapper(t, { modo: { recepcion: "network" } });
    const antes = state.numeroFactura;
    const res = await post(productBody());
    assert.equal(res.status, 503);
    assert.equal(state.numeroFactura, antes); // numero no consumido
    sin.modo.recepcion = "908"; // el SIN vuelve
    const ok = await (await post(productBody())).json();
    assert.equal(ok.codigoEstado, 908);
    assert.equal(ok.numeroFactura, antes + 1); // reusa el numero que no se quemo
  });

  it("SIN caido al pedir CUFD: 503, nunca se intenta emitir", async (t) => {
    const { post, sin } = await startWrapper(t, { modo: { cufd: "network", recepcion: "908" } });
    const res = await post(productBody());
    assert.equal(res.status, 503);
    assert.equal(sin.calls.recepcion, 0);
  });

  it("rechazo de negocio del SIN: 200 con codigoEstado null y el motivo en leyenda; NO se cachea", async (t) => {
    const { post, sin } = await startWrapper(t, { modo: { recepcion: "rechazo" } });
    const res = await post(productBody());
    assert.equal(res.status, 200); // el caller deriva rejected de codigoEstado null
    const body = await res.json();
    assert.equal(body.estado, "rejected");
    assert.equal(body.codigoEstado, null);
    assert.equal(body.cuf, null);
    assert.equal(body.leyenda, "NIT INVALIDO");
    // Reintento (datos corregidos en el producto) re-emite:
    sin.modo.recepcion = "908";
    const retry = await (await post(productBody())).json();
    assert.equal(retry.codigoEstado, 908);
    assert.equal(sin.calls.recepcion, 2);
  });

  it("GET /health responde sin auth; cualquier otra ruta es 404", async (t) => {
    const { base } = await startWrapper(t);
    const health = await fetch(`${base}/health`);
    assert.equal(health.status, 200);
    assert.equal((await health.json()).environment, "piloto");
    assert.equal((await fetch(`${base}/otra`, { method: "POST" })).status, 404);
  });

  it("el estado (correlativo, CUFD, resultados) sobrevive un reinicio del wrapper", async (t) => {
    const config = testConfig();
    const sin = fakeSin({ recepcion: "908" });
    const w1 = createWrapper(config, { transport: sin.transport });
    await new Promise((resolve) => w1.server.listen(0, "127.0.0.1", resolve));
    const port1 = w1.server.address().port;
    const res1 = await fetch(`http://127.0.0.1:${port1}/fiscal/invoices`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${config.wrapperToken}`,
        "idempotency-key": "invoice:persist",
      },
      body: JSON.stringify(productBody()),
    });
    const body1 = await res1.json();
    await new Promise((resolve) => w1.server.close(resolve));

    const w2 = createWrapper(config, { transport: sin.transport });
    await new Promise((resolve) => w2.server.listen(0, "127.0.0.1", resolve));
    t.after(() => w2.server.close());
    const port2 = w2.server.address().port;
    const res2 = await fetch(`http://127.0.0.1:${port2}/fiscal/invoices`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${config.wrapperToken}`,
        "idempotency-key": "invoice:persist",
      },
      body: JSON.stringify(productBody()),
    });
    const body2 = await res2.json();
    assert.equal(body2.cuf, body1.cuf); // replay desde el estado persistido
    assert.equal(sin.calls.recepcion, 1);
  });
});

describe("buildWrapperResponse / qrUrlFor", () => {
  it("la URL del QR apunta al host de consulta del ambiente", () => {
    const url = qrUrlFor({ environment: "produccion", nit: "123", cuf: "ABC", numeroFactura: 7 });
    assert.ok(url.startsWith("https://siat.impuestos.gob.bo/consulta/QR?nit=123&cuf=ABC&numero=7"));
  });

  it("901 (pendiente async) viaja como estado sent con su codigoEstado", () => {
    const r = {
      estado: "sent",
      codigoEstado: 901,
      codigoRecepcion: "R-1",
      material: { cuf: "CUF901" },
      emission: { lastReason: null },
    };
    const body = buildWrapperResponse(r, {
      numeroFactura: 5,
      cufd: { codigo: "C", codigoControl: "K" },
      config: testConfig(),
    });
    assert.equal(body.codigoEstado, 901);
    assert.equal(body.cuf, "CUF901");
    assert.equal(body.delivered, true);
  });
});
