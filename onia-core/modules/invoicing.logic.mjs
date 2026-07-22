/*
 * Logica pura del modulo invoicing (Bolivia - factura electronica). Modela el
 * documento fiscal (CUF, QR, importe en literal, anulacion, notas de
 * credito-debito) SIN llamar al SIN: la emision real (CUIS/CUFD, firma) es
 * external_gate del core. Referencia canonica para portar, no duplicar.
 *
 * ADVERTENCIA (verificado 2026-07-06, investigacion cruzada de 2 fuentes): el
 * ancho exacto de invoiceNumber en el CUF (8 vs 10 digitos, segun la fuente) y
 * el algoritmo EXACTO del digito verificador Modulo 11 no estan 100%
 * confirmados contra el Anexo Tecnico oficial del SIN (GENERACION-CUF.pdf). NO
 * usar buildCuf() para emitir un CUF real sin verificar antes contra ese
 * anexo. Los anchos son configurables (CUF_FIELD_WIDTHS) para que una
 * correccion futura sea un cambio de una linea, no una reescritura.
 */
import { computeQuoteTotal } from "./commerce.logic.mjs";
import { officialRate } from "../logic/fx.logic.mjs";

export function round2(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

// --- Totales (reutiliza commerce, no duplica la formula) --------------------

export const computeInvoiceTotal = computeQuoteTotal;

// --- Moneda extranjera: TCO del BCB (RND 102600000026) ----------------------

/**
 * Total de la factura convertido a BOB con el TCO oficial del BCB del dia de la
 * operacion. Desde el regimen cambiario flexible (RM 245/2026) el oficial FLOTA, y
 * el SIAT EXIGE emitir las facturas en moneda extranjera con ese TCO diario del BCB
 * (RND 102600000026, jul-2026): lo que se declara es el importe en Bs. `dailyTco` =
 * TCO del BCB del dia (external_gate); si falta, cae al fallback historico de
 * fx.officialRate. Para facturas en BOB el TCO es 1 y el total no cambia.
 */
export function invoiceTotalInBob(invoiceTotal, { currency = "BOB", dailyTco } = {}) {
  const total = Number(invoiceTotal ?? 0);
  const isBob = !currency || /^(bob|bs|boliviano)/i.test(String(currency));
  const tco = isBob ? 1 : officialRate(dailyTco);
  return {
    currency: isBob ? "BOB" : String(currency).toUpperCase(),
    tcoUsed: round2(tco),
    bobTotal: round2(total * tco),
  };
}

// --- Comprador y homologacion SIN por item (RND 102500000018) ---------------

/**
 * Tipo de documento de identidad del comprador (campo SIAT
 * codigoTipoDocumentoIdentidad). Es una PARAMETRICA de sincronizacion diaria del
 * SIAT (web service); la fuente autoritativa es el catalogo vivo, no este mapa.
 * El mapeo 1=CI..5=NIT es el estandar historico; verificar contra la
 * sincronizacion antes de emitir real.
 */
export const BUYER_DOC_TYPES = { CI: 1, CEX: 2, PAS: 3, OD: 4, NIT: 5 };

/**
 * Valida los datos minimos del comprador para una factura SIAT: razon social
 * (nombreRazonSocial), tipo de documento (codigoTipoDocumentoIdentidad, 1-5) y
 * numero (numeroDocumento). No emite: solo verifica estructura antes de preparar
 * el XML. Devuelve { valid, errors[] }.
 */
export function validateBuyer(buyer = {}, { validTypeCodes = [1, 2, 3, 4, 5] } = {}) {
  const errors = [];
  if (!buyer?.name || String(buyer.name).trim() === "") {
    errors.push("falta nombreRazonSocial del comprador");
  }
  const docType = Number(buyer?.docType);
  if (!validTypeCodes.includes(docType)) {
    errors.push(`codigoTipoDocumentoIdentidad invalido: ${buyer?.docType} (esperado ${validTypeCodes.join("/")})`);
  }
  if (buyer?.docNumber === undefined || buyer?.docNumber === null || String(buyer.docNumber).trim() === "") {
    errors.push("falta numeroDocumento del comprador");
  }
  return { valid: errors.length === 0, errors };
}

/** Como validateBuyer pero lanza (paso previo a preparar la emision). */
export function assertValidBuyer(buyer, options) {
  const { valid, errors } = validateBuyer(buyer, options);
  if (!valid) {
    throw new Error(`comprador invalido para factura SIAT: ${errors.join("; ")}`);
  }
  return true;
}

/**
 * Valida la homologacion SIN de una linea de factura: exige codigoProductoSin
 * (homologado al catalogo del SIN), actividadEconomica (CAEB por item, del
 * Padron Nacional) y unidadMedida (parametrica). Para servicios (unidad 58) la
 * cantidad debe ser 1 (regla oficial del SIAT). Devuelve { valid, errors[] }.
 */
export function validateInvoiceLineHomologation(line = {}, { serviceUnitCode = 58 } = {}) {
  const errors = [];
  if (line?.sinProductCode === undefined || line?.sinProductCode === null || String(line.sinProductCode).trim() === "") {
    errors.push("falta codigoProductoSin (homologacion al catalogo SIN)");
  }
  if (line?.economicActivityCode === undefined || line?.economicActivityCode === null || String(line.economicActivityCode).trim() === "") {
    errors.push("falta actividadEconomica (CAEB por item, del Padron Nacional)");
  }
  if (line?.unitMeasureCode === undefined || line?.unitMeasureCode === null || String(line.unitMeasureCode).trim() === "") {
    errors.push("falta unidadMedida (parametrica SIAT)");
  }
  if (Number(line?.unitMeasureCode) === serviceUnitCode && Number(line?.quantity) !== 1) {
    errors.push("para servicios (unidad 58) la cantidad debe ser 1");
  }
  return { valid: errors.length === 0, errors };
}

// --- Importe en literal (numero a letras, para el pie de factura) -----------

const UNITS = ["", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve"];
const TEENS = ["diez", "once", "doce", "trece", "catorce", "quince", "dieciseis", "diecisiete", "dieciocho", "diecinueve"];
const TWENTIES = ["veinte", "veintiuno", "veintidos", "veintitres", "veinticuatro", "veinticinco", "veintiseis", "veintisiete", "veintiocho", "veintinueve"];
const TENS = ["", "", "veinte", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa"];
const HUNDREDS = ["", "ciento", "doscientos", "trescientos", "cuatrocientos", "quinientos", "seiscientos", "setecientos", "ochocientos", "novecientos"];

function threeDigitsToWords(n) {
  if (n === 0) return "";
  if (n === 100) return "cien";

  const hundreds = Math.floor(n / 100);
  const rest = n % 100;
  let words = hundreds > 0 ? HUNDREDS[hundreds] : "";

  if (rest > 0) {
    words = words ? `${words} ` : "";
    if (rest < 10) {
      words += UNITS[rest];
    } else if (rest < 20) {
      words += TEENS[rest - 10];
    } else if (rest < 30) {
      words += TWENTIES[rest - 20];
    } else {
      const tens = Math.floor(rest / 10);
      const units = rest % 10;
      words += TENS[tens];
      if (units > 0) {
        words += ` y ${UNITS[units]}`;
      }
    }
  }
  return words.trim();
}

// "uno" se apocopa a "un" antes de un sustantivo (mil/millones): "treinta y un mil".
function apocopeUno(words) {
  return words.replace(/uno$/, "un");
}

/** Entero (0 a 999,999,999) a palabras en espanol, sin acentos ni mayusculas. */
export function integerToWords(value) {
  const num = Math.trunc(Number(value));
  if (Number.isNaN(num)) {
    throw new Error("numero invalido");
  }
  if (num < 0) {
    throw new Error("numero negativo no soportado");
  }
  if (num > 999_999_999) {
    throw new Error("numero fuera de rango (maximo 999,999,999)");
  }
  if (num === 0) {
    return "cero";
  }

  const millions = Math.floor(num / 1_000_000);
  const thousands = Math.floor((num % 1_000_000) / 1000);
  const rest = num % 1000;
  const parts = [];

  if (millions > 0) {
    parts.push(millions === 1 ? "un millon" : `${apocopeUno(threeDigitsToWords(millions))} millones`);
  }
  if (thousands > 0) {
    parts.push(thousands === 1 ? "mil" : `${apocopeUno(threeDigitsToWords(thousands))} mil`);
  }
  if (rest > 0) {
    parts.push(threeDigitsToWords(rest));
  }
  return parts.join(" ").trim();
}

/** Importe en literal para el pie de factura: "Ochocientos 00/100 Bolivianos". */
export function amountToWords(amount, currency = "Bolivianos") {
  const value = Number(amount ?? 0);
  if (value < 0) {
    throw new Error("importe negativo no soportado");
  }
  const integerPart = Math.trunc(value);
  const cents = Math.round((value - integerPart) * 100);
  const words = integerToWords(integerPart);
  const capitalized = words.charAt(0).toUpperCase() + words.slice(1);
  return `${capitalized} ${String(cents).padStart(2, "0")}/100 ${currency}`;
}

// --- CUF (estructura documentada; ver advertencia al inicio del archivo) ----

export const CUF_FIELD_WIDTHS = {
  nit: 13,
  dateTime: 17,
  branch: 4,
  modality: 1,
  emissionType: 1,
  invoiceType: 1,
  docSectorType: 2,
  invoiceNumber: 8,
  pointOfSale: 4,
};

function pad(value, width, fieldName) {
  const str = String(value ?? "");
  if (str.length > width) {
    throw new Error(`campo ${fieldName} excede el ancho ${width}: "${str}"`);
  }
  return str.padStart(width, "0");
}

/** Concatena los componentes del CUF con su ancho fijo (sin digito verificador). */
export function buildCufPayload(components, widths = CUF_FIELD_WIDTHS) {
  return Object.keys(widths)
    .map((key) => pad(components?.[key], widths[key], key))
    .join("");
}

/** Digito verificador Modulo 11 sobre una cadena numerica (pesos 2-9 ciclicos). */
export function mod11CheckDigit(digitsString) {
  const digits = String(digitsString).split("").map(Number);
  let weight = 2;
  let sum = 0;
  for (let i = digits.length - 1; i >= 0; i -= 1) {
    sum += digits[i] * weight;
    weight = weight === 9 ? 2 : weight + 1;
  }
  return sum % 11;
}

/** Convierte una cadena decimal grande a hexadecimal (mayusculas). */
export function decimalStringToHex(decimalString) {
  return BigInt(decimalString).toString(16).toUpperCase();
}

/**
 * Construye el CUF de referencia: payload + digito verificador -> hex.
 * NO usar para emitir un CUF real sin verificar el algoritmo contra el Anexo
 * Tecnico oficial (ver advertencia al inicio del archivo).
 */
export function buildCuf(components, widths = CUF_FIELD_WIDTHS) {
  const payload = buildCufPayload(components, widths);
  const checkDigit = mod11CheckDigit(payload);
  return decimalStringToHex(`${payload}${checkDigit}`);
}

// --- QR (estructura de URL confirmada por fuente oficial) -------------------

export const QR_SIZE_ROLL = 1;
export const QR_SIZE_HALF_SHEET = 2;

/** URL del QR de verificacion: nit, cuf, numero de factura y tamano. */
export function buildQrUrl({ host = "https://pilotosiat.impuestos.gob.bo", nit, cuf, invoiceNumber, size = QR_SIZE_ROLL } = {}) {
  if (!nit || !cuf || !invoiceNumber) {
    throw new Error("el QR requiere nit, cuf y numero de factura");
  }
  return `${host}/consulta/QR?nit=${nit}&cuf=${cuf}&numero=${invoiceNumber}&t=${size}`;
}

// --- Anulacion ---------------------------------------------------------------

/** Vencimiento de anulacion: dia 9 del mes siguiente a la fecha de emision. */
export function cancellationDeadline(issueDateIso) {
  const [year, month] = String(issueDateIso).slice(0, 7).split("-").map(Number);
  let nextMonth = month + 1;
  let nextYear = year;
  if (nextMonth > 12) {
    nextMonth = 1;
    nextYear += 1;
  }
  return `${nextYear}-${String(nextMonth).padStart(2, "0")}-09`;
}

export function isPastCancellationDeadline(issueDateIso, nowIso = new Date().toISOString()) {
  const deadline = cancellationDeadline(issueDateIso);
  return new Date(`${deadline}T23:59:59Z`).getTime() < new Date(nowIso).getTime();
}

/** Se puede anular si no esta ya anulada/revertida, no fue confirmada en RCV/declarada, y no vencio. */
export function canCancelInvoice(invoice, { now = new Date().toISOString(), confirmedInRcv = false, declared = false } = {}) {
  if (invoice?.status === "cancelled" || invoice?.status === "reversed") {
    return false;
  }
  if (confirmedInRcv || declared) {
    return false;
  }
  return !isPastCancellationDeadline(invoice?.issueDate, now);
}

// --- Nota de Credito-Debito --------------------------------------------------

/** Nota de Credito/Debito referenciando la factura original por su CUF. */
export function buildCreditDebitNote(originalInvoice, { noteType, reason, amount, number, date } = {}) {
  if (!originalInvoice?.cuf) {
    throw new Error("la nota de credito/debito requiere el CUF de la factura original");
  }
  if (noteType !== "credito" && noteType !== "debito") {
    throw new Error(`noteType invalido: ${noteType}`);
  }
  return {
    noteType,
    number,
    originalInvoiceCuf: originalInvoice.cuf,
    originalInvoiceId: originalInvoice.id ?? null,
    date,
    amount: round2(amount),
    reason: reason ?? null,
  };
}
