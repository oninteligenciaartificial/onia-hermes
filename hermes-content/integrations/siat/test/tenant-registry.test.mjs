import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  TOKEN_ESTADOS,
  buildTenant,
  addSucursal,
  addPuntoVenta,
  setCodigoSistema,
  setTokenDelegado,
  registerHomologation,
  resolveHomologation,
  isTokenVigente,
  validateTenantReady,
} from "../src/tenant-registry.mjs";
import { RECOMMENDED_START_MODALITY, MODALITIES } from "../src/constants.mjs";

// Metadata de token vigente reutilizable en varios tests (nunca el valor real).
function tokenMetaVigente(overrides = {}) {
  return {
    referencia: "vault://onia/tenant/acme/token-delegado",
    estado: TOKEN_ESTADOS.ACTIVO,
    vigenciaDesde: "2026-01-01T00:00:00.000Z",
    vigenciaHasta: "2026-12-31T23:59:59.000Z",
    ...overrides,
  };
}

describe("buildTenant", () => {
  it("construye un tenant minimo solo con orgId, con defaults sanos", () => {
    const t = buildTenant({ orgId: "org-1" });
    assert.equal(t.orgId, "org-1");
    assert.equal(t.emisor.nit, null);
    assert.equal(t.emisor.codigoSistema, null);
    assert.equal(t.emisor.modalidad, RECOMMENDED_START_MODALITY);
    assert.deepEqual(t.sucursales, []);
    assert.deepEqual(t.puntosVenta, []);
    assert.equal(t.tokenDelegado, null);
    assert.deepEqual(t.homologacion, {});
  });

  it("normaliza datos del emisor provistos", () => {
    const t = buildTenant({
      orgId: "org-1",
      emisor: {
        nit: "5371375010",
        razonSocial: "ONIA SRL",
        municipio: "Santa Cruz",
        direccion: "Av. Siempre Viva 123",
      },
    });
    assert.equal(t.emisor.nit, "5371375010");
    assert.equal(t.emisor.razonSocial, "ONIA SRL");
    assert.equal(t.emisor.municipio, "Santa Cruz");
    assert.equal(t.emisor.direccion, "Av. Siempre Viva 123");
  });

  it("hidrata sucursales, puntos de venta, token y homologacion del input", () => {
    const t = buildTenant({
      orgId: "org-1",
      emisor: { nit: "5371375010", codigoSistema: "ABC123" },
      sucursales: [{ codigo: 0, nombre: "Casa Matriz" }],
      puntosVenta: [{ codigo: 1, sucursalCodigo: 0, tipo: "cajero" }],
      tokenDelegado: tokenMetaVigente(),
      homologacion: {
        "SERV-01": { codigoProductoSin: "83131", unidadMedida: "58", actividadEconomica: "620000" },
      },
    });
    assert.equal(t.sucursales.length, 1);
    assert.equal(t.puntosVenta.length, 1);
    assert.equal(t.emisor.codigoSistema, "ABC123");
    assert.equal(t.tokenDelegado.referencia, "vault://onia/tenant/acme/token-delegado");
    assert.deepEqual(resolveHomologation(t, "SERV-01"), {
      codigoProductoSin: "83131",
      unidadMedida: "58",
      actividadEconomica: "620000",
    });
  });

  it("acepta una modalidad valida distinta a la recomendada", () => {
    const t = buildTenant({ orgId: "org-1", emisor: { modalidad: MODALITIES.ELECTRONICA_EN_LINEA } });
    assert.equal(t.emisor.modalidad, MODALITIES.ELECTRONICA_EN_LINEA);
  });

  it("falla sin orgId", () => {
    assert.throws(() => buildTenant({}), /orgId/);
  });

  it("falla con modalidad invalida", () => {
    assert.throws(() => buildTenant({ orgId: "org-1", emisor: { modalidad: "inventada" } }), /modalidad/);
  });

  it("no muta el input", () => {
    const input = { orgId: "org-1", sucursales: [{ codigo: 0 }] };
    const t = buildTenant(input);
    t.sucursales.push({ codigo: 99 });
    assert.equal(input.sucursales.length, 1);
  });
});

describe("addSucursal", () => {
  it("agrega una sucursal y devuelve un tenant nuevo (inmutable)", () => {
    const t0 = buildTenant({ orgId: "org-1" });
    const t1 = addSucursal(t0, { codigo: 0, nombre: "Casa Matriz", direccion: "Centro" });
    assert.equal(t0.sucursales.length, 0);
    assert.equal(t1.sucursales.length, 1);
    assert.deepEqual(t1.sucursales[0], { codigo: 0, nombre: "Casa Matriz", direccion: "Centro" });
    assert.notEqual(t0, t1);
  });

  it("rellena nombre/direccion con null si faltan", () => {
    const t = addSucursal(buildTenant({ orgId: "org-1" }), { codigo: 2 });
    assert.deepEqual(t.sucursales[0], { codigo: 2, nombre: null, direccion: null });
  });

  it("falla si falta el codigo", () => {
    assert.throws(() => addSucursal(buildTenant({ orgId: "org-1" }), {}), /codigo/);
  });

  it("falla ante sucursal duplicada (mismo codigo, distinto tipo)", () => {
    let t = addSucursal(buildTenant({ orgId: "org-1" }), { codigo: 0 });
    assert.throws(() => addSucursal(t, { codigo: "0" }), /duplicada/);
  });
});

describe("addPuntoVenta", () => {
  it("agrega un PdV a una sucursal existente", () => {
    let t = addSucursal(buildTenant({ orgId: "org-1" }), { codigo: 0 });
    t = addPuntoVenta(t, { codigo: 1, sucursalCodigo: 0, nombre: "Caja 1", tipo: "cajero" });
    assert.equal(t.puntosVenta.length, 1);
    assert.deepEqual(t.puntosVenta[0], { codigo: 1, sucursalCodigo: 0, nombre: "Caja 1", tipo: "cajero" });
  });

  it("falla si la sucursalCodigo no existe", () => {
    const t = addSucursal(buildTenant({ orgId: "org-1" }), { codigo: 0 });
    assert.throws(() => addPuntoVenta(t, { codigo: 1, sucursalCodigo: 9 }), /no existe/);
  });

  it("falla si falta codigo o sucursalCodigo", () => {
    let t = addSucursal(buildTenant({ orgId: "org-1" }), { codigo: 0 });
    assert.throws(() => addPuntoVenta(t, { sucursalCodigo: 0 }), /pv\.codigo/);
    assert.throws(() => addPuntoVenta(t, { codigo: 1 }), /sucursalCodigo/);
  });

  it("falla ante PdV duplicado en la misma sucursal", () => {
    let t = addSucursal(buildTenant({ orgId: "org-1" }), { codigo: 0 });
    t = addPuntoVenta(t, { codigo: 1, sucursalCodigo: 0 });
    assert.throws(() => addPuntoVenta(t, { codigo: 1, sucursalCodigo: 0 }), /duplicado/);
  });

  it("permite el mismo codigo de PdV en sucursales distintas", () => {
    let t = addSucursal(buildTenant({ orgId: "org-1" }), { codigo: 0 });
    t = addSucursal(t, { codigo: 1 });
    t = addPuntoVenta(t, { codigo: 1, sucursalCodigo: 0 });
    t = addPuntoVenta(t, { codigo: 1, sucursalCodigo: 1 });
    assert.equal(t.puntosVenta.length, 2);
  });
});

describe("setCodigoSistema", () => {
  it("fija el codigoSistema en un tenant nuevo", () => {
    const t0 = buildTenant({ orgId: "org-1" });
    const t1 = setCodigoSistema(t0, "SYS-9988");
    assert.equal(t0.emisor.codigoSistema, null);
    assert.equal(t1.emisor.codigoSistema, "SYS-9988");
  });

  it("falla con codigo vacio", () => {
    assert.throws(() => setCodigoSistema(buildTenant({ orgId: "org-1" }), ""), /codigo/);
  });
});

describe("setTokenDelegado", () => {
  it("guarda solo metadata del token", () => {
    const t = setTokenDelegado(buildTenant({ orgId: "org-1" }), tokenMetaVigente());
    assert.deepEqual(t.tokenDelegado, {
      referencia: "vault://onia/tenant/acme/token-delegado",
      estado: TOKEN_ESTADOS.ACTIVO,
      vigenciaDesde: "2026-01-01T00:00:00.000Z",
      vigenciaHasta: "2026-12-31T23:59:59.000Z",
    });
  });

  it("estado por defecto es PENDIENTE", () => {
    const t = setTokenDelegado(buildTenant({ orgId: "org-1" }), { referencia: "vault://x" });
    assert.equal(t.tokenDelegado.estado, TOKEN_ESTADOS.PENDIENTE);
    assert.equal(t.tokenDelegado.vigenciaDesde, null);
    assert.equal(t.tokenDelegado.vigenciaHasta, null);
  });

  it("rechaza el valor del token en claro (regla de secretos)", () => {
    assert.throws(
      () => setTokenDelegado(buildTenant({ orgId: "org-1" }), { referencia: "vault://x", valor: "eyJhbGc..." }),
      /vault|solo metadata|valor/i,
    );
    assert.throws(
      () => setTokenDelegado(buildTenant({ orgId: "org-1" }), { referencia: "vault://x", token: "abc" }),
      /vault|solo metadata|token/i,
    );
  });

  it("falla sin referencia al vault", () => {
    assert.throws(() => setTokenDelegado(buildTenant({ orgId: "org-1" }), { estado: TOKEN_ESTADOS.ACTIVO }), /referencia/);
  });

  it("falla con estado invalido", () => {
    assert.throws(
      () => setTokenDelegado(buildTenant({ orgId: "org-1" }), { referencia: "vault://x", estado: "raro" }),
      /estado/,
    );
  });
});

describe("registerHomologation / resolveHomologation", () => {
  it("registra un mapeo y lo resuelve", () => {
    const t = registerHomologation(buildTenant({ orgId: "org-1" }), "PROD-01", {
      codigoProductoSin: "99100",
      unidadMedida: "57",
      actividadEconomica: "461000",
    });
    assert.deepEqual(resolveHomologation(t, "PROD-01"), {
      codigoProductoSin: "99100",
      unidadMedida: "57",
      actividadEconomica: "461000",
    });
  });

  it("devuelve null para un codigoInterno no registrado", () => {
    assert.equal(resolveHomologation(buildTenant({ orgId: "org-1" }), "NOPE"), null);
  });

  it("reemplaza el mapeo si se registra de nuevo el mismo codigoInterno", () => {
    let t = registerHomologation(buildTenant({ orgId: "org-1" }), "P", {
      codigoProductoSin: "1",
      unidadMedida: "57",
      actividadEconomica: "461000",
    });
    t = registerHomologation(t, "P", {
      codigoProductoSin: "2",
      unidadMedida: "58",
      actividadEconomica: "462000",
    });
    assert.equal(resolveHomologation(t, "P").codigoProductoSin, "2");
    assert.equal(Object.keys(t.homologacion).length, 1);
  });

  it("falla si faltan campos del mapeo", () => {
    assert.throws(
      () => registerHomologation(buildTenant({ orgId: "org-1" }), "P", { codigoProductoSin: "1" }),
      /unidadMedida|actividadEconomica|incompleta/,
    );
  });

  it("falla sin codigoInterno", () => {
    assert.throws(
      () =>
        registerHomologation(buildTenant({ orgId: "org-1" }), "", {
          codigoProductoSin: "1",
          unidadMedida: "57",
          actividadEconomica: "461000",
        }),
      /codigoInterno/,
    );
  });

  it("resolveHomologation devuelve una copia (no muta el registro)", () => {
    const t = registerHomologation(buildTenant({ orgId: "org-1" }), "P", {
      codigoProductoSin: "1",
      unidadMedida: "57",
      actividadEconomica: "461000",
    });
    const m = resolveHomologation(t, "P");
    m.codigoProductoSin = "hackeado";
    assert.equal(resolveHomologation(t, "P").codigoProductoSin, "1");
  });
});

describe("isTokenVigente", () => {
  const now = new Date("2026-06-15T12:00:00.000Z");

  it("true si estado ACTIVO y now dentro de la ventana", () => {
    assert.equal(isTokenVigente(tokenMetaVigente(), { now }), true);
  });

  it("false si el token es null", () => {
    assert.equal(isTokenVigente(null, { now }), false);
  });

  it("false si el estado no es ACTIVO", () => {
    assert.equal(isTokenVigente(tokenMetaVigente({ estado: TOKEN_ESTADOS.REVOCADO }), { now }), false);
    assert.equal(isTokenVigente(tokenMetaVigente({ estado: TOKEN_ESTADOS.PENDIENTE }), { now }), false);
  });

  it("false si now es anterior a vigenciaDesde", () => {
    const before = new Date("2025-12-31T00:00:00.000Z");
    assert.equal(isTokenVigente(tokenMetaVigente(), { now: before }), false);
  });

  it("false si now es posterior a vigenciaHasta", () => {
    const after = new Date("2027-01-01T00:00:00.000Z");
    assert.equal(isTokenVigente(tokenMetaVigente(), { now: after }), false);
  });

  it("true sin bordes de vigencia si el estado es ACTIVO", () => {
    assert.equal(
      isTokenVigente({ referencia: "vault://x", estado: TOKEN_ESTADOS.ACTIVO, vigenciaDesde: null, vigenciaHasta: null }, { now }),
      true,
    );
  });
});

describe("validateTenantReady", () => {
  const now = new Date("2026-06-15T12:00:00.000Z");

  function tenantCompleto() {
    let t = buildTenant({ orgId: "org-1", emisor: { nit: "5371375010", codigoSistema: "SYS-1" } });
    t = addSucursal(t, { codigo: 0 });
    t = addPuntoVenta(t, { codigo: 1, sucursalCodigo: 0 });
    t = setTokenDelegado(t, tokenMetaVigente());
    return t;
  }

  it("ready=true cuando todo esta completo y el token vigente", () => {
    assert.deepEqual(validateTenantReady(tenantCompleto(), { now }), { ready: true, missing: [] });
  });

  it("lista todo lo que falta en un tenant recien creado", () => {
    const { ready, missing } = validateTenantReady(buildTenant({ orgId: "org-1" }), { now });
    assert.equal(ready, false);
    assert.deepEqual(missing.sort(), ["codigoSistema", "nit", "puntosVenta", "sucursales", "tokenDelegadoVigente"].sort());
  });

  it("marca nit si el formato es invalido", () => {
    let t = tenantCompleto();
    t = { ...t, emisor: { ...t.emisor, nit: "abc" } };
    assert.equal(validateTenantReady(t, { now }).missing.includes("nit"), true);
  });

  it("marca tokenDelegadoVigente si el token esta vencido a la fecha now", () => {
    let t = tenantCompleto();
    t = setTokenDelegado(t, tokenMetaVigente({ estado: TOKEN_ESTADOS.VENCIDO }));
    const { ready, missing } = validateTenantReady(t, { now });
    assert.equal(ready, false);
    assert.deepEqual(missing, ["tokenDelegadoVigente"]);
  });

  it("marca sucursales/puntosVenta si estan vacios pese a tener el resto", () => {
    let t = buildTenant({ orgId: "org-1", emisor: { nit: "5371375010", codigoSistema: "SYS-1" } });
    t = setTokenDelegado(t, tokenMetaVigente());
    const { missing } = validateTenantReady(t, { now });
    assert.equal(missing.includes("sucursales"), true);
    assert.equal(missing.includes("puntosVenta"), true);
    assert.equal(missing.includes("nit"), false);
  });
});
