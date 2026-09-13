/*
 * Firma XMLDSig ENVELOPED de la factura electronica (SIAT Bolivia, etapa VIII).
 *
 * Estandar VERIFICADO 2026-09-12 contra la doc oficial del SIN — NO es XAdES:
 *  - SignatureSchema oficial (siatinfo .../firma-digital/signatureschema): namespace
 *    http://www.w3.org/2000/09/xmldsig# con EXACTAMENTE SignedInfo(Canonicalization
 *    Method, SignatureMethod, Reference(Transforms(Transform+), DigestMethod,
 *    DigestValue)), SignatureValue, KeyInfo(X509Data(X509Certificate)). Sin
 *    QualifyingProperties, sin Object, sin atributos Id (el XSD no los declara:
 *    agregarlos rompe la validacion contra el XSD electronico).
 *  - Referencia Java oficial (siatinfo .../firma-digital/firmado-de-xml, Apache
 *    Santuario): RSA-SHA256, digest SHA-256, transforms enveloped-signature +
 *    C14N-with-comments, SignedInfo con C14N 1.0 omit-comments (default del
 *    constructor de XMLSignature), prefijo de namespace VACIO
 *    (ElementProxy.setDefaultPrefix(SignatureSpecNS, "")), Signature como ULTIMO
 *    hijo del root (el XSD electronico exige <xs:element ref="ds:Signature"/> al
 *    final), y salida final en forma canonica (outputDOMc14nWithComments: SIN
 *    declaracion <?xml?>).
 *  - XSD electronico (xsd/facturaElectronica*.xsd): importa SignatureSchema y
 *    exige la firma tras cabecera+detalle.
 *
 * Implementacion en node:crypto puro (sin dependencias): la C14N completa no
 * hace falta porque el XML SIEMPRE sale de nuestro xml-builder (deterministico,
 * una linea, sin comentarios/CDATA/PIs, atributos fijos ya en orden canonico).
 * canonicalizeBuilderXml() cubre EXACTAMENTE ese subconjunto y falla ruidoso
 * ante cualquier cosa fuera de el.
 * ponytail: C14N restringida al XML de xml-builder; si algun dia se firma XML
 * ajeno, reemplazar por una libreria C14N completa (xml-crypto / xmldsigjs).
 */
import { createHash, createPublicKey, sign as cryptoSign, verify as cryptoVerify, X509Certificate } from "node:crypto";

// URIs de algoritmo EXACTAS de la referencia oficial (Apache Santuario).
export const ALGORITHMS = {
  // SignedInfo: C14N 1.0 inclusiva SIN comentarios (default de XMLSignature).
  canonicalization: "http://www.w3.org/TR/2001/REC-xml-c14n-20010315",
  // "RSA Sha256 V2" de la doc = RSASSA-PKCS1-v1_5 con SHA-256.
  signature: "http://www.w3.org/2001/04/xmldsig-more#rsa-sha256",
  transformEnveloped: "http://www.w3.org/2000/09/xmldsig#enveloped-signature",
  transformC14nWithComments: "http://www.w3.org/TR/2001/REC-xml-c14n-20010315#WithComments",
  digest: "http://www.w3.org/2001/04/xmlenc#sha256",
};

export const XMLDSIG_NS = "http://www.w3.org/2000/09/xmldsig#";
const XSI_NS = "http://www.w3.org/2001/XMLSchema-instance";

/**
 * Forma canonica (C14N 1.0) del XML que produce xml-builder. Reglas aplicadas:
 * quitar la declaracion <?xml?>, expandir elementos vacios (<x/> -> <x></x>) y
 * des-escapar &apos;/&quot; en texto (C14N solo escapa & < > y CR en texto; los
 * valores de atributo del builder son constantes sin entidades, asi que el
 * reemplazo global es seguro). Falla ante comentarios, CDATA, PIs o CR crudos:
 * ese XML no salio de nuestro builder.
 */
export function canonicalizeBuilderXml(xml) {
  const s = String(xml);
  if (s.includes("<!--") || s.includes("<![CDATA[") || /<\?(?!xml[\s?])/.test(s)) {
    throw new Error("canonicalizeBuilderXml: comentarios/CDATA/PI no soportados (XML no salio de xml-builder)");
  }
  if (s.includes("\r")) {
    throw new Error("canonicalizeBuilderXml: CR crudo en el XML (C14N exige &#xD;); limpiar el dato de origen");
  }
  return s
    .replace(/^<\?xml[^?]*\?>/, "")
    .replace(/<([A-Za-z][\w.-]*)((?:\s+[\w:.-]+="[^"]*")*)\s*\/>/g, "<$1$2></$1>")
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"');
}

/** Base64 DER de un certificado PEM (o passthrough si ya viene en base64 pelado). */
export function pemToBase64(pem) {
  const body = String(pem)
    .replace(/-----(BEGIN|END)[^-]+-----/g, "")
    .replace(/\s+/g, "");
  if (!body || !/^[A-Za-z0-9+/=]+$/.test(body)) {
    throw new Error("certificado invalido: se espera PEM o base64 DER");
  }
  return body;
}

function sha256Base64(content) {
  return createHash("sha256").update(content, "utf8").digest("base64");
}

// SignedInfo SIN declaraciones de namespace (como queda EMBEBIDO en el XML: el
// default namespace lo hereda de <Signature xmlns=...>). Elementos ya expandidos
// (sin auto-cierre) para que la forma embebida coincida con la canonica.
function signedInfoMarkup(digestValue) {
  return (
    "<SignedInfo>" +
    `<CanonicalizationMethod Algorithm="${ALGORITHMS.canonicalization}"></CanonicalizationMethod>` +
    `<SignatureMethod Algorithm="${ALGORITHMS.signature}"></SignatureMethod>` +
    '<Reference URI="">' +
    "<Transforms>" +
    `<Transform Algorithm="${ALGORITHMS.transformEnveloped}"></Transform>` +
    `<Transform Algorithm="${ALGORITHMS.transformC14nWithComments}"></Transform>` +
    "</Transforms>" +
    `<DigestMethod Algorithm="${ALGORITHMS.digest}"></DigestMethod>` +
    `<DigestValue>${digestValue}</DigestValue>` +
    "</Reference>" +
    "</SignedInfo>"
  );
}

/**
 * Forma CANONICA del SignedInfo, que es lo que se firma. C14N inclusiva de un
 * subset rinde en el apex TODOS los namespaces en scope: el default (xmldsig#,
 * declarado en Signature) y xmlns:xsi (heredado del root de la factura), en ese
 * orden (prefijo vacio ordena primero). Este es el gotcha clasico de la C14N
 * inclusiva; Santuario (la referencia y el validador del SIN) hace exactamente esto.
 */
export function canonicalSignedInfo(digestValue, { inheritedXsi = true } = {}) {
  const nsDecls = `xmlns="${XMLDSIG_NS}"${inheritedXsi ? ` xmlns:xsi="${XSI_NS}"` : ""}`;
  return signedInfoMarkup(digestValue).replace("<SignedInfo>", `<SignedInfo ${nsDecls}>`);
}

/**
 * Firma un XML de factura (salida de buildInvoiceXml, modalidad electronica) con
 * XMLDSig enveloped segun el estandar del SIN. Devuelve el documento firmado en
 * forma canonica (sin declaracion <?xml?>, igual que la referencia Java del SIN).
 *
 *  - privateKeyPem: llave privada PEM (PKCS#8 o PKCS#1). NUNCA se loguea.
 *  - certificatePem: certificado X.509 (PEM o base64 DER) que va en X509Certificate.
 */
export function signInvoiceXml(xml, { privateKeyPem, certificatePem } = {}) {
  if (!privateKeyPem || !certificatePem) {
    throw new Error("signInvoiceXml requiere privateKeyPem y certificatePem");
  }
  const canonical = canonicalizeBuilderXml(xml);
  const rootClose = canonical.match(/<\/([A-Za-z][\w.-]*)>$/);
  if (!rootClose) {
    throw new Error("signInvoiceXml: no se encontro el cierre del elemento raiz");
  }
  if (canonical.includes(`<Signature xmlns="${XMLDSIG_NS}"`)) {
    throw new Error("signInvoiceXml: el XML ya tiene una firma");
  }

  // 1. Digest de la referencia URI="": enveloped (doc sin la firma, que aun no
  //    existe) + C14N-with-comments (= canonical: el builder no emite comentarios).
  const digestValue = sha256Base64(canonical);

  // 2. Firmar la forma canonica del SignedInfo con RSA-SHA256 (PKCS#1 v1.5).
  const signedInfo = canonicalSignedInfo(digestValue);
  const signatureValue = cryptoSign("sha256", Buffer.from(signedInfo, "utf8"), privateKeyPem).toString("base64");

  // 3. Bloque Signature (estructura EXACTA del SignatureSchema oficial) como
  //    ultimo hijo del root, con prefijo vacio como la referencia del SIN.
  const signatureBlock =
    `<Signature xmlns="${XMLDSIG_NS}">` +
    signedInfoMarkup(digestValue) +
    `<SignatureValue>${signatureValue}</SignatureValue>` +
    `<KeyInfo><X509Data><X509Certificate>${pemToBase64(certificatePem)}</X509Certificate></X509Data></KeyInfo>` +
    "</Signature>";

  return canonical.slice(0, rootClose.index) + signatureBlock + rootClose[0];
}

const SIGNATURE_BLOCK_RE = new RegExp(`<Signature xmlns="${XMLDSIG_NS}">[\\s\\S]*?</Signature>`);

/**
 * Verificacion del XML firmado (post-firma, regla "que no sufra modificaciones
 * despues de la firma" de la doc de firma invalida del SIN): recomputa el digest
 * del documento sin la firma y verifica SignatureValue contra la llave publica
 * (por parametro, o extraida del X509Certificate embebido).
 * Devuelve { digestValid, signatureValid, valid }.
 */
export function verifySignedInvoiceXml(signedXml, { publicKeyPem } = {}) {
  const s = String(signedXml);
  const block = s.match(SIGNATURE_BLOCK_RE);
  if (!block) {
    throw new Error("verifySignedInvoiceXml: no hay bloque Signature");
  }
  const unsigned = s.replace(block[0], "");
  const digestValue = block[0].match(/<DigestValue>([^<]*)<\/DigestValue>/)?.[1];
  const signatureValue = block[0].match(/<SignatureValue>([^<]*)<\/SignatureValue>/)?.[1];
  const certB64 = block[0].match(/<X509Certificate>([^<]*)<\/X509Certificate>/)?.[1];
  if (!digestValue || !signatureValue) {
    throw new Error("verifySignedInvoiceXml: firma incompleta (DigestValue/SignatureValue)");
  }

  const digestValid = sha256Base64(unsigned) === digestValue;

  let publicKey = publicKeyPem;
  if (!publicKey) {
    if (!certB64) {
      throw new Error("verifySignedInvoiceXml: sin publicKeyPem y sin X509Certificate embebido");
    }
    publicKey = createPublicKey(new X509Certificate(Buffer.from(certB64, "base64")).publicKey);
  }
  const signatureValid = cryptoVerify(
    "sha256",
    Buffer.from(canonicalSignedInfo(digestValue), "utf8"),
    publicKey,
    Buffer.from(signatureValue, "base64"),
  );
  return { digestValid, signatureValid, valid: digestValid && signatureValid };
}
