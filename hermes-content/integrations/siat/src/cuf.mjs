/*
 * Generacion del CUF (Codigo Unico de Facturacion) del SIAT (Bolivia).
 *
 * Fuente OFICIAL (verificado 2026-07-22, siatinfo.impuestos.gob.bo):
 *  - .../algoritmos-utilizados/generacion-cuf
 *  - .../algoritmos-utilizados/algoritmo-modulo-11
 *
 * Resuelve la advertencia que arrastraba el core (onia-core/modules/
 * invoicing.logic.mjs): el numero de factura en el CUF es de 10 digitos (NO 8) y
 * el CUF final concatena el CODIGO DE CONTROL del CUFD del dia. El core tiene un
 * buildCuf de REFERENCIA (simplificado: 8 digitos, sin codigo de control); ESTE
 * es el verificado, para la emision real. No es asesoria fiscal.
 *
 * Pasos oficiales:
 *  1. Concatenar 53 digitos, cada campo rellenado con ceros a la IZQUIERDA:
 *     NIT(13) + fechaHora yyyyMMddHHmmssSSS(17) + sucursal(4) + modalidad(1) +
 *     tipoEmision(1) + tipoFactura(1) + tipoDocumentoSector(2) +
 *     numeroFactura(10) + puntoVenta(4).
 *  2. Digito verificador Modulo 11 (pesos 2..9 ciclicos de derecha a izquierda;
 *     digito = suma % 11; conversion oficial 10 -> 1, 11 -> 0) -> 54 digitos.
 *  3. Convertir el numero de 54 digitos a base 16 (hex, mayusculas).
 *  4. CUF = hex + codigoControl (del CUFD del dia; external_gate: viene del SIN).
 */

// Anchos oficiales de cada campo del payload del CUF (suman 53).
export const CUF_FIELD_WIDTHS = {
  nit: 13,
  fechaHora: 17,
  sucursal: 4,
  modalidad: 1,
  tipoEmision: 1,
  tipoFactura: 1,
  tipoDocumentoSector: 2,
  numeroFactura: 10,
  puntoVenta: 4,
};

export const CUF_PAYLOAD_WIDTH = 53;

function padLeftDigits(value, width, field) {
  const str = String(value ?? "").trim();
  if (!/^\d*$/.test(str)) {
    throw new Error(`campo ${field} del CUF debe ser numerico: "${str}"`);
  }
  if (str.length > width) {
    throw new Error(`campo ${field} del CUF excede el ancho ${width}: "${str}"`);
  }
  return str.padStart(width, "0");
}

/** Concatena los 53 digitos del CUF (sin el digito verificador). */
export function buildCufPayload(components = {}) {
  return Object.keys(CUF_FIELD_WIDTHS)
    .map((field) => padLeftDigits(components[field], CUF_FIELD_WIDTHS[field], field))
    .join("");
}

/**
 * Digito verificador Modulo 11 del SIAT. Pesos crecientes desde 2 hasta
 * `limiteMultiplicador` (ciclicos, reinician en 2), recorriendo la cadena de
 * DERECHA a IZQUIERDA. digito = suma % 11 (o ((suma*10)%11)%10 en modo x10).
 * Conversion oficial: 10 -> 1, 11 -> 0. Verificado con el ejemplo oficial del
 * SIAT: "12345" -> 6 (5*2+4*3+3*4+2*5+1*6 = 50; 50 % 11 = 6).
 */
export function mod11CheckDigit(cadena, { limiteMultiplicador = 9, multiplicaPor10 = false } = {}) {
  const digits = String(cadena);
  if (!/^\d+$/.test(digits)) {
    throw new Error(`cadena no numerica para Modulo 11: "${cadena}"`);
  }
  let multiplicador = 2;
  let suma = 0;
  for (let i = digits.length - 1; i >= 0; i -= 1) {
    suma += Number(digits[i]) * multiplicador;
    multiplicador = multiplicador >= limiteMultiplicador ? 2 : multiplicador + 1;
  }
  let digito = multiplicaPor10 ? ((suma * 10) % 11) % 10 : suma % 11;
  if (digito === 10) {
    digito = 1;
  } else if (digito === 11) {
    digito = 0;
  }
  return digito;
}

/** Convierte una cadena decimal grande a hexadecimal en mayusculas (BigInt). */
export function decimalStringToHex(decimalString) {
  return BigInt(decimalString).toString(16).toUpperCase();
}

/**
 * Nucleo del CUF (pasos 1-3): payload(53) + digito Modulo 11 -> 54 digitos ->
 * base 16. Deterministico y verificable sin depender del SIN. El CUF real
 * necesita ademas el codigo de control (buildCuf).
 */
export function buildCufCore(components = {}) {
  const payload = buildCufPayload(components);
  const digito = mod11CheckDigit(payload);
  return decimalStringToHex(`${payload}${digito}`);
}

/**
 * CUF completo (paso 4): nucleo hex + codigo de control del CUFD del dia. El
 * `codigoControl` viene del CUFD (external_gate: se obtiene del SIN al abrir el
 * dia por sucursal/punto de venta); sin el, el CUF esta incompleto y no se emite.
 */
export function buildCuf(components = {}, codigoControl) {
  if (codigoControl === undefined || codigoControl === null || String(codigoControl).trim() === "") {
    throw new Error("buildCuf requiere el codigoControl del CUFD para el CUF final");
  }
  return `${buildCufCore(components)}${codigoControl}`;
}
