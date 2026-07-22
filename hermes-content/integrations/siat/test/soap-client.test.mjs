/*
 * Tests de la capa PURA del cliente SOAP del SIAT (Bolivia). NO hace red: arma
 * envelopes desde parametros y parsea respuestas fixture. La estructura EXACTA
 * (targetNamespace, wrapper del DTO, orden de campos, SOAP 1.1 vs 1.2) se
 * confirma contra el WSDL del piloto antes de emitir real -- ver cabecera de
 * src/soap-client.mjs.
 * Run: node --test hermes-content/integrations/siat/test/soap-client.test.mjs
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { ENVIRONMENTS } from "../src/constants.mjs";
import {
  AMBIENTE_CODES,
  SIAT_SERVICES,
  SOAP_ENV_NS,
  SOAP_OPERATIONS,
  buildAnulacionFacturaRequest,
  buildAuthHeader,
  buildCufdRequest,
  buildCuisRequest,
  buildRecepcionFacturaRequest,
  buildSoapEnvelope,
  buildVerificarComunicacionRequest,
  codigoAmbienteFor,
  escapeXml,
  parseSoapResponse,
  soapEndpoint,
  soapWsdlUrl,
} from "../src/soap-client.mjs";

// Orden de aparicion de una lista de subcadenas dentro del XML (para asserts de orden).
function inOrder(xml, tags) {
  const positions = tags.map((t) => xml.indexOf(t));
  assert.ok(
    positions.every((p) => p >= 0),
    `faltan tags en el XML: ${tags.filter((t, i) => positions[i] < 0).join(", ")}`,
  );
  for (let i = 1; i < positions.length; i += 1) {
    assert.ok(positions[i - 1] < positions[i], `orden roto: "${tags[i - 1]}" deberia ir antes de "${tags[i]}"`);
  }
}

describe("helpers de ambiente y endpoint", () => {
  it("codigoAmbiente: piloto=2, produccion=1 (al reves de lo intuitivo)", () => {
    assert.equal(codigoAmbienteFor(ENVIRONMENTS.PILOTO), 2);
    assert.equal(codigoAmbienteFor(ENVIRONMENTS.PRODUCCION), 1);
    assert.equal(AMBIENTE_CODES.piloto, 2);
    assert.equal(AMBIENTE_CODES.produccion, 1);
  });

  it("codigoAmbienteFor acepta el id string y lanza ante ambiente desconocido", () => {
    assert.equal(codigoAmbienteFor("piloto"), 2);
    assert.equal(codigoAmbienteFor("produccion"), 1);
    assert.throws(() => codigoAmbienteFor("mainnet"), /desconocido/);
  });

  it("soapEndpoint usa el soapBase de constants y el segmento del servicio", () => {
    const url = soapEndpoint(ENVIRONMENTS.PILOTO, "FACTURACION_CODIGOS");
    assert.ok(url.startsWith(ENVIRONMENTS.PILOTO.soapBase));
    assert.ok(url.endsWith(`/${SIAT_SERVICES.FACTURACION_CODIGOS}`));
  });

  it("soapEndpoint permite forzar la version del path (piloto vigente = v2)", () => {
    const url = soapEndpoint(ENVIRONMENTS.PILOTO, "FACTURACION_COMPUTARIZADA", { version: "v2" });
    assert.ok(url.includes("/v2/"));
    assert.ok(!url.includes("/v1/"));
    assert.ok(url.endsWith("/ServicioFacturacionComputarizada"));
  });

  it("soapWsdlUrl agrega ?wsdl al endpoint", () => {
    assert.ok(soapWsdlUrl(ENVIRONMENTS.PILOTO, "FACTURACION_SINCRONIZACION").endsWith("?wsdl"));
  });

  it("buildAuthHeader arma 'Token X' (token va en HTTP header, no en el envelope)", () => {
    assert.equal(buildAuthHeader("abc123"), "Token abc123");
    assert.throws(() => buildAuthHeader(""), /token/);
  });
});

describe("builders de envelope: estructura comun", () => {
  it("todo envelope trae el namespace SOAP 1.1, Header vacio y Body", () => {
    const xml = buildVerificarComunicacionRequest();
    assert.ok(xml.includes(`xmlns:soapenv="${SOAP_ENV_NS}"`));
    assert.ok(xml.includes("<soapenv:Header/>"));
    inOrder(xml, ["<soapenv:Body>", "<siat:verificarComunicacion>", "</soapenv:Body>"]);
  });

  it("verificarComunicacion no lleva parametros de negocio (health-check)", () => {
    const xml = buildVerificarComunicacionRequest();
    assert.ok(!xml.includes("<nit>"));
    assert.ok(!xml.includes("<codigoSistema>"));
  });

  it("buildSoapEnvelope lanza si falta el nombre de operacion", () => {
    assert.throws(() => buildSoapEnvelope({ fields: [] }), /operacion/);
  });
});

describe("buildCuisRequest", () => {
  const params = {
    codigoAmbiente: 2,
    codigoSistema: "SIS-ONIA-01",
    nit: "5371375010",
    codigoModalidad: 2,
    codigoSucursal: 0,
    codigoPuntoVenta: 0,
  };

  it("envuelve la operacion cuis en el wrapper SolicitudCuis", () => {
    const xml = buildCuisRequest(params);
    inOrder(xml, ["<siat:cuis>", "<SolicitudCuis>", "</SolicitudCuis>", "</siat:cuis>"]);
  });

  it("emite los campos EN ORDEN (spec / doc oficial)", () => {
    const xml = buildCuisRequest(params);
    inOrder(xml, [
      "<codigoAmbiente>2</codigoAmbiente>",
      "<codigoSistema>SIS-ONIA-01</codigoSistema>",
      "<nit>5371375010</nit>",
      "<codigoModalidad>2</codigoModalidad>",
      "<codigoSucursal>0</codigoSucursal>",
      "<codigoPuntoVenta>0</codigoPuntoVenta>",
    ]);
  });

  it("codigoPuntoVenta=0 SI se emite (0 no es vacio); si se omite el campo, no aparece", () => {
    assert.ok(buildCuisRequest(params).includes("<codigoPuntoVenta>0</codigoPuntoVenta>"));
    const sinPdv = { ...params };
    delete sinPdv.codigoPuntoVenta;
    assert.ok(!buildCuisRequest(sinPdv).includes("<codigoPuntoVenta>"));
  });

  it("lanza si falta un campo requerido (nit)", () => {
    const sinNit = { ...params };
    delete sinNit.nit;
    assert.throws(() => buildCuisRequest(sinNit), /"nit" ausente/);
  });

  it("deriva codigoAmbiente desde environment si no viene explicito", () => {
    const { codigoAmbiente, ...rest } = params;
    const xml = buildCuisRequest({ ...rest, environment: ENVIRONMENTS.PILOTO });
    assert.ok(xml.includes("<codigoAmbiente>2</codigoAmbiente>"));
    assert.ok(!xml.includes("<environment>"));
  });
});

describe("buildCufdRequest", () => {
  it("incluye el cuis (obtenido en el inicio del sistema) en orden", () => {
    const xml = buildCufdRequest({
      codigoAmbiente: 2,
      codigoSistema: "SIS-ONIA-01",
      nit: "5371375010",
      codigoModalidad: 2,
      cuis: "A1B2C3",
      codigoSucursal: 0,
    });
    inOrder(xml, ["<siat:cufd>", "<SolicitudCufd>", "<cuis>A1B2C3</cuis>", "</SolicitudCufd>"]);
    // codigoPuntoVenta es opcional: omitido -> no aparece
    assert.ok(!xml.includes("<codigoPuntoVenta>"));
  });
});

describe("buildRecepcionFacturaRequest", () => {
  const params = {
    codigoAmbiente: 2,
    codigoDocumentoSector: 1,
    codigoEmision: 1,
    codigoModalidad: 2,
    codigoPuntoVenta: 0,
    codigoSistema: "SIS-ONIA-01",
    codigoSucursal: 0,
    nit: "5371375010",
    cufd: "CUFD-DIA",
    cuis: "CUIS-SIS",
    tipoFacturaDocumento: 1,
    archivo: "H4sIA+/base64+data==",
    fechaEnvio: "2026-07-22T12:00:00.000",
    hashArchivo: "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
  };

  it("emite archivo (base64), fechaEnvio y hashArchivo, en orden", () => {
    const xml = buildRecepcionFacturaRequest(params);
    inOrder(xml, [
      "<siat:recepcionFactura>",
      "<codigoEmision>1</codigoEmision>",
      "<archivo>H4sIA+/base64+data==</archivo>",
      "<fechaEnvio>2026-07-22T12:00:00.000</fechaEnvio>",
      `<hashArchivo>${params.hashArchivo}</hashArchivo>`,
    ]);
  });

  it("lanza si falta hashArchivo", () => {
    const sinHash = { ...params };
    delete sinHash.hashArchivo;
    assert.throws(() => buildRecepcionFacturaRequest(sinHash), /"hashArchivo" ausente/);
  });
});

describe("buildAnulacionFacturaRequest", () => {
  it("incluye el cuf a anular y el codigoMotivo del catalogo", () => {
    const xml = buildAnulacionFacturaRequest({
      codigoAmbiente: 2,
      codigoSistema: "SIS-ONIA-01",
      codigoSucursal: 0,
      codigoEmision: 1,
      codigoModalidad: 2,
      codigoDocumentoSector: 1,
      nit: "5371375010",
      cuis: "CUIS-SIS",
      cufd: "CUFD-DIA",
      tipoFacturaDocumento: 1,
      cuf: "1234ABCD5678",
      codigoMotivo: 1,
    });
    inOrder(xml, ["<siat:anulacionFactura>", "<cuf>1234ABCD5678</cuf>", "<codigoMotivo>1</codigoMotivo>"]);
  });
});

describe("escapeXml", () => {
  it("escapa los 5 reservados", () => {
    assert.equal(escapeXml(`<a>&'"`), "&lt;a&gt;&amp;&apos;&quot;");
  });

  it("los valores con caracteres reservados se escapan dentro del envelope", () => {
    const xml = buildCuisRequest({
      codigoAmbiente: 2,
      codigoSistema: "A&B<C",
      nit: "5371375010",
      codigoModalidad: 2,
      codigoSucursal: 0,
    });
    assert.ok(xml.includes("<codigoSistema>A&amp;B&lt;C</codigoSistema>"));
  });
});

describe("SOAP_OPERATIONS: marca verified vs [VERIFICAR]", () => {
  it("cuis/cufd/recepcion/anulacion estan verified; verificarComunicacion no", () => {
    assert.equal(SOAP_OPERATIONS.cuis.verified, true);
    assert.equal(SOAP_OPERATIONS.cufd.verified, true);
    assert.equal(SOAP_OPERATIONS.recepcionFactura.verified, true);
    assert.equal(SOAP_OPERATIONS.anulacionFactura.verified, true);
    assert.equal(SOAP_OPERATIONS.verificarComunicacion.verified, false);
  });
});

describe("parseSoapResponse: respuesta EXITOSA (factura validada)", () => {
  const OK = `<?xml version="1.0" encoding="UTF-8"?>
<S:Envelope xmlns:S="http://schemas.xmlsoap.org/soap/envelope/">
 <S:Body>
  <ns2:recepcionFacturaResponse xmlns:ns2="https://siat.impuestos.gob.bo/">
   <RespuestaServicioFacturacion>
    <transaccion>true</transaccion>
    <codigoDescripcion>VALIDA</codigoDescripcion>
    <codigoEstado>908</codigoEstado>
    <codigoRecepcion>1170079123456</codigoRecepcion>
    <listaMensajes>
     <codigo>980</codigo>
     <descripcion>La factura ha sido validada</descripcion>
    </listaMensajes>
   </RespuestaServicioFacturacion>
  </ns2:recepcionFacturaResponse>
 </S:Body>
</S:Envelope>`;

  it("normaliza transaccion, codigoEstado, codigoRecepcion y codigoDescripcion", () => {
    const r = parseSoapResponse(OK);
    assert.equal(r.transaccion, true);
    assert.equal(r.codigoEstado, 908);
    assert.equal(r.codigoRecepcion, "1170079123456");
    assert.equal(r.codigoDescripcion, "VALIDA");
  });

  it("extrae el mensaje {codigo:int, descripcion:string}", () => {
    const r = parseSoapResponse(OK);
    assert.deepEqual(r.mensajes, [{ codigo: 980, descripcion: "La factura ha sido validada" }]);
  });
});

describe("parseSoapResponse: respuesta OBSERVADA (con varios mensajes)", () => {
  // Namespaces con prefijo + un mensaje en orden invertido (descripcion antes que
  // codigo) + codigoRecepcion nillable vacio. Prueba tolerancia del parser.
  const OBS = `<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
 <soap:Body>
  <ns2:recepcionFacturaResponse xmlns:ns2="https://siat.impuestos.gob.bo/">
   <RespuestaServicioFacturacion>
    <transaccion>false</transaccion>
    <codigoDescripcion>OBSERVADA</codigoDescripcion>
    <codigoEstado>904</codigoEstado>
    <codigoRecepcion xsi:nil="true"/>
    <mensajesList>
     <codigo>994</codigo>
     <descripcion>Codigo de producto no homologado</descripcion>
    </mensajesList>
    <mensajesList>
     <descripcion>Monto total no coincide</descripcion>
     <codigo>995</codigo>
    </mensajesList>
   </RespuestaServicioFacturacion>
  </ns2:recepcionFacturaResponse>
 </soap:Body>
</soap:Envelope>`;

  it("marca la transaccion false y el estado 904 (observada)", () => {
    const r = parseSoapResponse(OBS);
    assert.equal(r.transaccion, false);
    assert.equal(r.codigoEstado, 904);
  });

  it("codigoRecepcion nillable vacio -> null", () => {
    assert.equal(parseSoapResponse(OBS).codigoRecepcion, null);
  });

  it("extrae los 2 mensajes en el ORDEN de aparicion, sin importar el orden interno", () => {
    const r = parseSoapResponse(OBS);
    assert.deepEqual(r.mensajes, [
      { codigo: 994, descripcion: "Codigo de producto no homologado" },
      { codigo: 995, descripcion: "Monto total no coincide" },
    ]);
  });
});

describe("parseSoapResponse: tolerancia", () => {
  it("un <codigo> suelto (valor CUIS) NO se cuenta como mensaje", () => {
    const CUIS = `<S:Envelope xmlns:S="http://schemas.xmlsoap.org/soap/envelope/"><S:Body>
     <ns2:cuisResponse xmlns:ns2="https://siat.impuestos.gob.bo/"><RespuestaCuis>
      <transaccion>true</transaccion>
      <codigo>a1b2c3d4e5</codigo>
      <fechaVigencia>2026-08-01T00:00:00.000</fechaVigencia>
      <codigoDescripcion></codigoDescripcion>
     </RespuestaCuis></ns2:cuisResponse></S:Body></S:Envelope>`;
    const r = parseSoapResponse(CUIS);
    assert.equal(r.transaccion, true);
    assert.deepEqual(r.mensajes, []);
    assert.equal(r.codigoEstado, null); // no hay codigoEstado en la respuesta CUIS
    assert.equal(r.codigoDescripcion, null); // vacio -> null
  });

  it("respuesta vacia o basura -> objeto con nulls y mensajes []", () => {
    const r = parseSoapResponse("");
    assert.deepEqual(r, {
      transaccion: null,
      codigoEstado: null,
      codigoRecepcion: null,
      codigoDescripcion: null,
      mensajes: [],
    });
  });

  it("no confunde codigoEstado/codigoRecepcion con el tag codigo (prefijo compartido)", () => {
    const xml = `<x><transaccion>true</transaccion><codigoEstado>901</codigoEstado></x>`;
    const r = parseSoapResponse(xml);
    assert.equal(r.codigoEstado, 901);
    assert.deepEqual(r.mensajes, []);
  });
});
