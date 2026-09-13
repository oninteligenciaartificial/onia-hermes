/*
 * Tests de la firma XMLDSig enveloped de la factura electronica (etapa VIII).
 * Fixture XML del builder -> firmar -> verificar con node:crypto (digest +
 * RSA-SHA256), estructura EXACTA del SignatureSchema oficial del SIN y las
 * reglas de la C14N restringida.
 * Run: node --test hermes-content/integrations/siat/test/xml-signer.test.mjs
 */
import assert from "node:assert/strict";
import { createHash, generateKeyPairSync } from "node:crypto";
import { describe, it } from "node:test";

import { buildInvoiceXml } from "../src/xml-builder.mjs";
import {
  ALGORITHMS,
  XMLDSIG_NS,
  canonicalizeBuilderXml,
  canonicalSignedInfo,
  pemToBase64,
  signInvoiceXml,
  verifySignedInvoiceXml,
} from "../src/xml-signer.mjs";

// Par de llaves RSA efimero (solo para el test; un certificado real lo emite
// ADSIB — el firmador no valida el cert, solo lo embebe).
const { publicKey, privateKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
const privateKeyPem = privateKey.export({ type: "pkcs8", format: "pem" });
const publicKeyPem = publicKey.export({ type: "spki", format: "pem" });
// "Certificado" de relleno para la etiqueta X509Certificate en tests que
// verifican con publicKeyPem explicito.
const dummyCertB64 = Buffer.from("certificado-de-prueba").toString("base64");

const cabecera = {
  nitEmisor: "5371375010",
  razonSocialEmisor: "OniaAgency",
  municipio: "Santa Cruz de la Sierra",
  telefono: null,
  numeroFactura: "7",
  cuf: "ABC123DEF",
  cufd: "CUFD-XYZ",
  codigoSucursal: 0,
  direccion: "Av. Beni, Santa Cruz de la Sierra",
  codigoPuntoVenta: 0,
  fechaEmision: "2026-09-12T10:00:00.000",
  nombreRazonSocial: "Cliente D'Angelo \"SRL\"", // fuerza &apos;/&quot; en el builder
  codigoTipoDocumentoIdentidad: 5,
  numeroDocumento: "99001",
  complemento: null,
  codigoCliente: "99001",
  codigoMetodoPago: 1,
  numeroTarjeta: null,
  montoTotal: 100,
  montoTotalSujetoIva: 100,
  codigoMoneda: 1,
  tipoCambio: 1,
  montoTotalMoneda: 100,
  montoGiftCard: null,
  descuentoAdicional: null,
  codigoExcepcion: null,
  cafc: null,
  leyenda: "Ley 453: leyenda de prueba",
  usuario: "onia",
  codigoDocumentoSector: 1,
};
const detalle = {
  actividadEconomica: "620000",
  codigoProductoSin: "83131",
  codigoProducto: "SRV-1",
  descripcion: "Servicio de prueba",
  cantidad: 1,
  unidadMedida: 58,
  precioUnitario: 100,
  montoDescuento: null,
  subTotal: 100,
  numeroSerie: null,
  numeroImei: null,
};

function fixtureXml() {
  return buildInvoiceXml({ cabecera, detalle: [detalle] }, { modality: "electronica_en_linea" });
}

describe("canonicalizeBuilderXml", () => {
  it("quita la declaracion, expande vacios y des-escapa apos/quot", () => {
    const canonical = canonicalizeBuilderXml(fixtureXml());
    assert.ok(!canonical.startsWith("<?xml"), "la forma canonica no lleva declaracion XML");
    assert.ok(!canonical.includes("/>"), "C14N expande los elementos vacios");
    assert.ok(canonical.includes('<telefono xsi:nil="true"></telefono>'));
    // C14N en texto: & < > quedan escapados; ' y " van literales.
    assert.ok(canonical.includes(`<nombreRazonSocial>Cliente D'Angelo "SRL"</nombreRazonSocial>`));
    assert.ok(!canonical.includes("&apos;"));
    assert.ok(!canonical.includes("&quot;"));
  });

  it("preserva &amp;/&lt;/&gt; escapados en texto", () => {
    const xml = buildInvoiceXml(
      { cabecera: { ...cabecera, nombreRazonSocial: "A&B <SRL>" }, detalle: [detalle] },
      { modality: "electronica_en_linea" },
    );
    const canonical = canonicalizeBuilderXml(xml);
    assert.ok(canonical.includes("<nombreRazonSocial>A&amp;B &lt;SRL&gt;</nombreRazonSocial>"));
  });

  it("rechaza comentarios, CDATA y CR crudos (XML que no salio del builder)", () => {
    assert.throws(() => canonicalizeBuilderXml("<a><!-- x --></a>"), /comentarios/);
    assert.throws(() => canonicalizeBuilderXml("<a><![CDATA[x]]></a>"), /comentarios|CDATA/);
    assert.throws(() => canonicalizeBuilderXml("<a>x\r</a>"), /CR crudo/);
  });
});

describe("pemToBase64", () => {
  it("pela el PEM a base64 DER", () => {
    const pem = `-----BEGIN CERTIFICATE-----\nQUJD\nREVG\n-----END CERTIFICATE-----\n`;
    assert.equal(pemToBase64(pem), "QUJDREVG");
  });
  it("passthrough de base64 pelado y rechazo de basura", () => {
    assert.equal(pemToBase64("QUJD"), "QUJD");
    assert.throws(() => pemToBase64("no es base64!!"), /certificado invalido/);
  });
});

describe("signInvoiceXml — estructura del SignatureSchema oficial", () => {
  const signed = signInvoiceXml(fixtureXml(), { privateKeyPem, certificatePem: dummyCertB64 });

  it("la firma es el ULTIMO hijo del root (orden del XSD electronico)", () => {
    assert.match(signed, /<\/KeyInfo><\/Signature><\/facturaElectronicaCompraVenta>$/);
  });

  it("bloque con namespace xmldsig default (prefijo vacio, como la referencia del SIN)", () => {
    assert.ok(signed.includes(`<Signature xmlns="${XMLDSIG_NS}">`));
    assert.ok(!signed.includes("<ds:Signature"), "sin prefijo ds: (la referencia usa prefijo vacio)");
  });

  it("URIs de algoritmo exactas de la referencia oficial", () => {
    for (const uri of Object.values(ALGORITHMS)) {
      assert.ok(signed.includes(`Algorithm="${uri}"`) || signed.includes(uri), `falta ${uri}`);
    }
    assert.ok(signed.includes('<Reference URI="">'));
  });

  it("solo los elementos que el SignatureSchema declara (sin Id, sin Object, sin X509SubjectName)", () => {
    const block = signed.slice(signed.indexOf("<Signature"));
    for (const tag of ["SignedInfo", "CanonicalizationMethod", "SignatureMethod", "Reference", "Transforms", "Transform", "DigestMethod", "DigestValue", "SignatureValue", "KeyInfo", "X509Data", "X509Certificate"]) {
      assert.ok(block.includes(`<${tag}`), `falta <${tag}>`);
    }
    assert.ok(!/ Id="/.test(block), "el XSD del SIN no declara atributos Id");
    assert.ok(!block.includes("<Object"), "sin <Object> (no es XAdES)");
    assert.ok(!block.includes("X509SubjectName"), "X509Data solo lleva X509Certificate");
  });

  it("sin declaracion <?xml?> (salida canonica, como outputDOMc14nWithComments)", () => {
    assert.ok(!signed.startsWith("<?xml"));
  });

  it("el certificado embebido es el base64 pelado", () => {
    assert.ok(signed.includes(`<X509Certificate>${dummyCertB64}</X509Certificate>`));
  });

  it("se niega a firmar dos veces y exige llave+cert", () => {
    assert.throws(() => signInvoiceXml(signed, { privateKeyPem, certificatePem: dummyCertB64 }), /ya tiene una firma/);
    assert.throws(() => signInvoiceXml(fixtureXml(), { privateKeyPem }), /requiere/);
  });
});

describe("firma -> verificacion (roundtrip con node:crypto)", () => {
  it("digest y firma RSA-SHA256 verifican sobre lo que quedo escrito", () => {
    const signed = signInvoiceXml(fixtureXml(), { privateKeyPem, certificatePem: dummyCertB64 });
    const result = verifySignedInvoiceXml(signed, { publicKeyPem });
    assert.deepEqual(result, { digestValid: true, signatureValid: true, valid: true });
  });

  it("el DigestValue es el SHA-256 base64 del documento SIN la firma", () => {
    const xml = fixtureXml();
    const signed = signInvoiceXml(xml, { privateKeyPem, certificatePem: dummyCertB64 });
    const canonical = canonicalizeBuilderXml(xml);
    const expected = createHash("sha256").update(canonical, "utf8").digest("base64");
    assert.ok(signed.includes(`<DigestValue>${expected}</DigestValue>`));
  });

  it("detecta cualquier modificacion post-firma (regla del SIN)", () => {
    const signed = signInvoiceXml(fixtureXml(), { privateKeyPem, certificatePem: dummyCertB64 });
    const tampered = signed.replace("<montoTotal>100</montoTotal>", "<montoTotal>999</montoTotal>");
    const result = verifySignedInvoiceXml(tampered, { publicKeyPem });
    assert.equal(result.digestValid, false);
    assert.equal(result.valid, false);
  });

  it("detecta una firma ajena (otra llave)", () => {
    const otra = generateKeyPairSync("rsa", { modulusLength: 2048 });
    const signed = signInvoiceXml(fixtureXml(), {
      privateKeyPem: otra.privateKey.export({ type: "pkcs8", format: "pem" }),
      certificatePem: dummyCertB64,
    });
    const result = verifySignedInvoiceXml(signed, { publicKeyPem });
    assert.equal(result.digestValid, true);
    assert.equal(result.signatureValid, false);
  });

  it("el SignedInfo canonico hereda xmlns:xsi del root (gotcha de la C14N inclusiva)", () => {
    const si = canonicalSignedInfo("DIGEST");
    assert.ok(si.startsWith(`<SignedInfo xmlns="${XMLDSIG_NS}" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">`));
    // La forma embebida NO lleva las declaraciones (las hereda del documento).
    const signed = signInvoiceXml(fixtureXml(), { privateKeyPem, certificatePem: dummyCertB64 });
    assert.ok(signed.includes("<SignedInfo><CanonicalizationMethod"));
  });
});
