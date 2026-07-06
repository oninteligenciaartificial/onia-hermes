/*
 * Logica pura de numeracion de comprobantes (core). Formatea, parsea e
 * incrementa numeros correlativos (factura, asiento, cotizacion, pedido). El
 * producto persiste el ultimo numero por organizacion + tipo; esta logica solo
 * calcula el siguiente. Sin estado, sin IO.
 */

/** Numero formateado: prefijo + correlativo con ceros. Ej: formatDocNumber("FAC-", 123) -> "FAC-000123". */
export function formatDocNumber(prefix, seq, { padding = 6 } = {}) {
  return `${prefix ?? ""}${String(seq).padStart(padding, "0")}`;
}

/** Extrae el correlativo numerico de un numero formateado. null si no hay digitos. */
export function parseDocNumber(formatted, prefix = "") {
  if (typeof formatted !== "string") {
    return null;
  }
  const rest = formatted.startsWith(prefix) ? formatted.slice(prefix.length) : formatted;
  const digits = rest.replace(/\D/g, "");
  return digits === "" ? null : Number(digits);
}

/** Siguiente correlativo a partir del actual (0/undefined -> 1). */
export function nextSequence(currentSeq) {
  return Number(currentSeq ?? 0) + 1;
}

/** Siguiente numero formateado a partir del ultimo (null -> el primero). */
export function nextDocNumber(lastFormatted, { prefix = "", padding = 6 } = {}) {
  const lastSeq = lastFormatted ? parseDocNumber(lastFormatted, prefix) ?? 0 : 0;
  return formatDocNumber(prefix, lastSeq + 1, { padding });
}
