/*
 * Tests del registro/consulta de puntos de venta (FacturacionOperaciones).
 * Sin red: cotejan el envelope contra el orden del WSDL del piloto (leido
 * 2026-09-12) y el parser de listaPuntosVentas contra una respuesta fixture.
 * Run: node --test hermes-content/integrations/siat/test/registrar-pdv.test.mjs
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildConsultaPuntoVentaRequest,
  buildRegistroPuntoVentaRequest,
  parseListaPuntosVentas,
  resolveTipoPuntoVenta,
} from "../src/registrar-pdv.mjs";

function inOrder(xml, tags) {
  const positions = tags.map((t) => xml.indexOf(t));
  assert.ok(positions.every((p) => p >= 0), `faltan tags en el XML: ${tags.filter((t) => !xml.includes(t))}`);
  for (let i = 1; i < positions.length; i += 1) {
    assert.ok(positions[i] > positions[i - 1], `orden roto: "${tags[i]}" antes de "${tags[i - 1]}"`);
  }
}

const REG_PARAMS = {
  codigoAmbiente: 2,
  codigoModalidad: 2,
  codigoSistema: "SYS",
  codigoSucursal: 0,
  codigoTipoPuntoVenta: 5,
  cuis: "97DA6A35",
  descripcion: "Punto de Venta 1",
  nit: "5371375010",
  nombrePuntoVenta: "Punto de Venta 1",
};

describe("buildRegistroPuntoVentaRequest", () => {
  it("emite los 9 campos del XSD en orden, dentro de SolicitudRegistroPuntoVenta", () => {
    const xml = buildRegistroPuntoVentaRequest(REG_PARAMS);
    assert.ok(xml.includes("<siat:registroPuntoVenta><SolicitudRegistroPuntoVenta>"));
    inOrder(xml, [
      "<codigoAmbiente>2</codigoAmbiente>",
      "<codigoModalidad>2</codigoModalidad>",
      "<codigoSistema>SYS</codigoSistema>",
      "<codigoSucursal>0</codigoSucursal>",
      "<codigoTipoPuntoVenta>5</codigoTipoPuntoVenta>",
      "<cuis>97DA6A35</cuis>",
      "<descripcion>Punto de Venta 1</descripcion>",
      "<nit>5371375010</nit>",
      "<nombrePuntoVenta>Punto de Venta 1</nombrePuntoVenta>",
    ]);
  });

  it("lanza si falta un campo requerido (todos lo son)", () => {
    const { cuis, ...sinCuis } = REG_PARAMS;
    assert.throws(() => buildRegistroPuntoVentaRequest(sinCuis), /cuis/);
  });
});

describe("buildConsultaPuntoVentaRequest", () => {
  it("emite los 5 campos del XSD en orden y SIN codigoPuntoVenta", () => {
    const xml = buildConsultaPuntoVentaRequest({
      codigoAmbiente: 2,
      codigoSistema: "SYS",
      codigoSucursal: 0,
      cuis: "97DA6A35",
      nit: "5371375010",
    });
    assert.ok(xml.includes("<siat:consultaPuntoVenta><SolicitudConsultaPuntoVenta>"));
    inOrder(xml, ["<codigoAmbiente>", "<codigoSistema>", "<codigoSucursal>", "<cuis>", "<nit>"]);
    assert.ok(!xml.includes("codigoPuntoVenta"));
  });
});

describe("parseListaPuntosVentas", () => {
  it("extrae cada bloque con sus campos", () => {
    const xml =
      "<RespuestaConsultaPuntoVenta>" +
      "<listaPuntosVentas><codigoPuntoVenta>0</codigoPuntoVenta><nombrePuntoVenta>Casa Matriz</nombrePuntoVenta><tipoPuntoVenta>PUNTO DE VENTA CAJEROS</tipoPuntoVenta></listaPuntosVentas>" +
      "<listaPuntosVentas><codigoPuntoVenta>1</codigoPuntoVenta><nombrePuntoVenta>Punto de Venta 1</nombrePuntoVenta><tipoPuntoVenta>PUNTO DE VENTA CAJEROS</tipoPuntoVenta></listaPuntosVentas>" +
      "<transaccion>true</transaccion></RespuestaConsultaPuntoVenta>";
    const lista = parseListaPuntosVentas(xml);
    assert.equal(lista.length, 2);
    assert.equal(lista[1].codigoPuntoVenta, "1");
    assert.equal(lista[1].nombrePuntoVenta, "Punto de Venta 1");
  });

  it("devuelve [] si no hay puntos de venta", () => {
    assert.deepEqual(parseListaPuntosVentas("<RespuestaConsultaPuntoVenta><transaccion>true</transaccion></RespuestaConsultaPuntoVenta>"), []);
  });
});

describe("resolveTipoPuntoVenta", () => {
  const CATALOGO = [
    { codigoClasificador: "1", descripcion: "PUNTO VENTA COMISIONISTA" },
    { codigoClasificador: "2", descripcion: "PUNTO VENTA VENTANILLA DE COBRANZA" },
    { codigoClasificador: "5", descripcion: "PUNTO DE VENTA CAJEROS" },
  ];

  it("elige CAJEROS del catalogo sincronizado", () => {
    assert.equal(resolveTipoPuntoVenta(CATALOGO), 5);
  });

  it("JAMAS elige comisionista (tiene su propia operacion con contrato)", () => {
    assert.equal(resolveTipoPuntoVenta(CATALOGO.slice(0, 2)), 2);
    assert.throws(() => resolveTipoPuntoVenta([CATALOGO[0]]), /comisionista/i);
  });

  it("lanza con catalogo vacio", () => {
    assert.throws(() => resolveTipoPuntoVenta([]), /vacio/);
  });
});
