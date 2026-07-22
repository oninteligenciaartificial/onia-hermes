/*
 * Tests del builder XML de la factura de compra-venta (SIAT Bolivia).
 * Verifica orden de elementos (el XSD es sequence-sensitive), manejo de
 * nillables y la huella SHA-256 (vector conocido).
 * Run: node --test hermes-content/integrations/siat/test/xml-builder.test.mjs
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  CABECERA_FIELDS,
  DETALLE_FIELDS,
  ROOT_ELEMENTS,
  buildCabeceraXml,
  buildDetalleXml,
  buildInvoiceXml,
  sha256Hex,
  xmlEscape,
} from "../src/xml-builder.mjs";

const cabecera = {
  nitEmisor: "5371375010",
  razonSocialEmisor: "ONIA SRL",
  municipio: "Santa Cruz",
  telefono: null, // nillable
  numeroFactura: "42",
  cuf: "ABC123",
  cufd: "CUFD123",
  codigoSucursal: 0,
  direccion: "Av. Siempre Viva 123",
  codigoPuntoVenta: 0,
  fechaEmision: "2026-07-22T12:00:00.000",
  nombreRazonSocial: "ACME SRL",
  codigoTipoDocumentoIdentidad: 5,
  numeroDocumento: "1234567015",
  complemento: null, // nillable
  codigoCliente: "1234567015",
  codigoMetodoPago: 1,
  numeroTarjeta: null, // nillable
  montoTotal: 116,
  montoTotalSujetoIva: 116,
  codigoMoneda: 1,
  tipoCambio: 1,
  montoTotalMoneda: 116,
  montoGiftCard: null,
  descuentoAdicional: null,
  codigoExcepcion: null,
  cafc: null,
  leyenda: "Ley 453: tienes derecho a un trato equitativo.",
  usuario: "onia",
  codigoDocumentoSector: 1,
};

const detalle = {
  actividadEconomica: "620000",
  codigoProductoSin: "83131",
  codigoProducto: "SRV-01",
  descripcion: "Servicio de software & soporte",
  cantidad: 1,
  unidadMedida: 58,
  precioUnitario: 116,
  montoDescuento: null,
  subTotal: 116,
  numeroSerie: null,
  numeroImei: null,
};

describe("especificacion de campos (orden del XSD)", () => {
  it("cabecera tiene 30 campos y detalle 11", () => {
    assert.equal(CABECERA_FIELDS.length, 30);
    assert.equal(DETALLE_FIELDS.length, 11);
  });

  it("el orden de cabecera es el del XSD (claves de control)", () => {
    const names = CABECERA_FIELDS.map((f) => f.name);
    assert.equal(names[0], "nitEmisor");
    assert.ok(names.indexOf("cuf") < names.indexOf("cufd"));
    assert.ok(names.indexOf("montoTotal") < names.indexOf("codigoMoneda"));
    assert.ok(names.indexOf("leyenda") < names.indexOf("usuario"));
    assert.equal(names[names.length - 1], "codigoDocumentoSector");
  });
});

describe("buildCabeceraXml", () => {
  const xml = buildCabeceraXml(cabecera);

  it("emite los elementos en el orden del XSD", () => {
    assert.ok(xml.startsWith("<cabecera><nitEmisor>5371375010</nitEmisor><razonSocialEmisor>ONIA SRL</razonSocialEmisor>"));
    assert.ok(xml.indexOf("<cuf>") < xml.indexOf("<cufd>"));
    assert.ok(xml.endsWith("<codigoDocumentoSector>1</codigoDocumentoSector></cabecera>"));
  });

  it("los opcionales vacios van como xsi:nil, no se omiten", () => {
    assert.ok(xml.includes('<telefono xsi:nil="true"/>'));
    assert.ok(xml.includes('<complemento xsi:nil="true"/>'));
    assert.ok(xml.includes('<cafc xsi:nil="true"/>'));
  });

  it("lanza si falta un campo obligatorio", () => {
    assert.throws(() => buildCabeceraXml({ ...cabecera, razonSocialEmisor: null }), /razonSocialEmisor/);
  });
});

describe("buildDetalleXml", () => {
  it("emite los 11 campos en orden y escapa el & de la descripcion", () => {
    const xml = buildDetalleXml(detalle);
    assert.ok(xml.startsWith("<detalle><actividadEconomica>620000</actividadEconomica>"));
    assert.ok(xml.includes("<descripcion>Servicio de software &amp; soporte</descripcion>"));
    assert.ok(xml.includes('<numeroImei xsi:nil="true"/>'));
    assert.ok(xml.endsWith("</detalle>"));
  });
});

describe("buildInvoiceXml", () => {
  it("envuelve cabecera + detalle bajo el elemento raiz de la modalidad", () => {
    const xml = buildInvoiceXml({ cabecera, detalle: [detalle] });
    assert.ok(xml.startsWith('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'));
    assert.ok(xml.includes(`<${ROOT_ELEMENTS.computarizada_en_linea}`));
    assert.ok(xml.includes("<cabecera>"));
    assert.ok(xml.includes("<detalle>"));
    assert.ok(xml.endsWith(`</${ROOT_ELEMENTS.computarizada_en_linea}>`));
  });

  it("acepta varios detalles y permite override del elemento raiz", () => {
    const xml = buildInvoiceXml({ cabecera, detalle: [detalle, detalle] }, { modality: "electronica_en_linea" });
    assert.equal(xml.match(/<detalle>/g).length, 2);
    assert.ok(xml.includes(`<${ROOT_ELEMENTS.electronica_en_linea}`));
  });

  it("lanza si no hay ningun detalle", () => {
    assert.throws(() => buildInvoiceXml({ cabecera, detalle: [] }), /al menos un/);
  });
});

describe("xmlEscape y sha256Hex", () => {
  it("escapa los 5 caracteres reservados", () => {
    assert.equal(xmlEscape(`<a href="x" id='y'>&z`), "&lt;a href=&quot;x&quot; id=&apos;y&apos;&gt;&amp;z");
  });

  it("sha256Hex coincide con el vector conocido de 'abc'", () => {
    assert.equal(sha256Hex("abc"), "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
  });

  it("la huella del XML es deterministica", () => {
    const xml = buildInvoiceXml({ cabecera, detalle: [detalle] });
    assert.equal(sha256Hex(xml), sha256Hex(xml));
  });
});
