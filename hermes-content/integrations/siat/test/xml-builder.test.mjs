/*
 * Tests del builder XML de la factura de compra-venta (SIAT Bolivia).
 * Verifica orden de elementos (el XSD es sequence-sensitive), manejo de
 * nillables y la huella SHA-256 (vector conocido).
 * Run: node --test hermes-content/integrations/siat/test/xml-builder.test.mjs
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

import {
  CABECERA_FIELDS,
  DETALLE_FIELDS,
  DOC_SECTOR_SCHEMAS,
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
    assert.throws(() => buildInvoiceXml({ cabecera, detalle: [] }), /al menos 1/);
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

// ------------------- los campos salen del XSD oficial (xsd/) -------------------
//
// El piloto valida contra el XSD (cvc-elt.1.a del 2026-08-27 fue por la raiz
// equivocada del sector 17). En vez de confiar en listas tipeadas a mano, se
// leen los XSD descargados del SIN y se cotejan nombre, ORDEN y nillable.

function leerXsd(nombre) {
  return readFileSync(new URL(`../xsd/${nombre}.xsd`, import.meta.url), "utf8");
}

/** Campos {name, nillable} de un bloque (cabecera | detalle) del XSD, en orden. */
function camposXsd(nombre, bloque) {
  const xsd = leerXsd(nombre);
  const start = xsd.indexOf(`<xs:element name="${bloque}"`);
  assert.ok(start >= 0, `${nombre}: sin bloque ${bloque}`);
  const end = bloque === "cabecera" ? xsd.indexOf('<xs:element name="detalle"') : xsd.length;
  const body = xsd.slice(start, end).replace(/^[^\n]*\n/, ""); // salta la linea del propio bloque
  return [...body.matchAll(/<xs:element\s+name="(\w+)"([^>]*)>/g)].map((m) => ({
    name: m[1],
    nillable: /nillable="true"/.test(m[2]),
  }));
}

const spec = (fields) => fields.map((f) => ({ name: f.name, nillable: f.nillable === true }));

describe("los campos y la raiz de cada sector salen del XSD oficial", () => {
  const casos = [
    [1, "facturaComputarizadaCompraVenta", "facturaElectronicaCompraVenta"],
    [17, "facturaComputarizadaHospitalClinica", "facturaElectronicaHospitalClinica"],
    [24, "notaComputarizadaCreditoDebito", "notaElectronicaCreditoDebito"],
  ];
  for (const [sector, computarizada, electronica] of casos) {
    const schema = DOC_SECTOR_SCHEMAS[sector];

    it(`sector ${sector}: cabecera y detalle en el orden y nillables del XSD (ambas modalidades)`, () => {
      for (const xsd of [computarizada, electronica]) {
        assert.deepEqual(spec(schema.cabecera), camposXsd(xsd, "cabecera"), `${xsd} cabecera`);
        assert.deepEqual(spec(schema.detalle), camposXsd(xsd, "detalle"), `${xsd} detalle`);
      }
    });

    it(`sector ${sector}: el elemento raiz es el que declara cada XSD`, () => {
      assert.ok(leerXsd(computarizada).includes(`<xs:element name="${schema.roots.computarizada_en_linea}">`));
      assert.ok(leerXsd(electronica).includes(`<xs:element name="${schema.roots.electronica_en_linea}">`));
    });

    it(`sector ${sector}: el minimo de detalles es el minOccurs del XSD`, () => {
      const m = /<xs:element name="detalle" minOccurs="(\d+)"/.exec(leerXsd(computarizada));
      assert.equal(schema.minDetalle, Number(m[1]));
    });
  }

  it("el sector 17 sale con la raiz de hospital y los campos del medico, sin numeroSerie", () => {
    const xml = buildInvoiceXml({
      cabecera: { ...cabecera, codigoDocumentoSector: 17 },
      detalle: [{ ...detalle, nroQuirofanoSalaOperaciones: 1, nombreApellidoMedico: "DR PRUEBA", nitDocumentoMedico: 99001 }],
    });
    assert.ok(xml.includes("<facturaComputarizadaHospitalClinica "));
    assert.ok(xml.endsWith("</facturaComputarizadaHospitalClinica>"));
    assert.ok(xml.includes('<modalidadServicio xsi:nil="true"/>'));
    assert.ok(xml.includes("<descripcion>Servicio de software &amp; soporte</descripcion><especialidad xsi:nil=\"true\"/>"));
    assert.ok(xml.includes("<nitDocumentoMedico>99001</nitDocumentoMedico><nroMatriculaMedico"));
    assert.ok(!xml.includes("numeroSerie"));
  });

  it("el sector 17 exige quirofano y medico: sin ellos lanza", () => {
    assert.throws(
      () => buildInvoiceXml({ cabecera: { ...cabecera, codigoDocumentoSector: 17 }, detalle: [detalle] }),
      /nroQuirofanoSalaOperaciones/,
    );
  });

  it("el sector 24 usa la raiz de nota fiscal y exige 2 detalles", () => {
    const nota = {
      ...cabecera,
      numeroNotaCreditoDebito: 7,
      numeroAutorizacionCuf: "CUFORIG",
      fechaEmisionFactura: "2026-07-20T10:00:00.000",
      montoTotalOriginal: 116,
      montoTotalDevuelto: 116,
      montoEfectivoCreditoDebito: 15.08,
      codigoDocumentoSector: 24,
    };
    const linea = (t) => ({ ...detalle, codigoDetalleTransaccion: t });
    assert.throws(() => buildInvoiceXml({ cabecera: nota, detalle: [linea(1)] }), /al menos 2/);
    const xml = buildInvoiceXml({ cabecera: nota, detalle: [linea(1), linea(2)] });
    assert.ok(xml.includes("<notaFiscalComputarizadaCreditoDebito "));
    assert.ok(xml.includes("<numeroAutorizacionCuf>CUFORIG</numeroAutorizacionCuf><fechaEmisionFactura>"));
    assert.ok(!xml.includes("codigoMetodoPago"), "la nota no lleva pago");
    assert.ok(xml.includes("<codigoDetalleTransaccion>1</codigoDetalleTransaccion></detalle><detalle>"));
    assert.ok(xml.includes("<codigoDocumentoSector>24</codigoDocumentoSector></cabecera>"));
  });

  it("un sector sin esquema lanza en vez de mandar la raiz de compra-venta", () => {
    assert.throws(() => buildInvoiceXml({ cabecera: { ...cabecera, codigoDocumentoSector: 35 }, detalle: [detalle] }), /sin esquema/);
  });
});
