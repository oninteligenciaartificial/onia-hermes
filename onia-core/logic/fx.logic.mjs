/*
 * Logica pura de tipo de cambio (Bolivia). Utilidad transversal usada por
 * commerce (repricing de listas USD/BOB) y accounting (moneda extranjera).
 * Sin estado, sin IO.
 *
 * Bolivia (regimen 2026): el oficial 6.96 es FIJO y SOLO sirve para factura/SIAT.
 * El precio real usa el VRD del BCB (que flota diario) + un spread bancario. La
 * cotizacion Binance es referencia, NUNCA base de precios. Repreciar siempre con
 * aprobacion (ApprovalRequest) — eso es workflow del producto, no de esta logica.
 */

// Oficial fijo para emision fiscal (SIAT). No usar para precios comerciales.
export const OFFICIAL_RATE_BOB_PER_USD = 6.96;

// Spread bancario tipico sobre el VRD (configurable por el producto).
export const DEFAULT_BANK_SPREAD = 0.1;

export function round2(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

/** Tasa efectiva de compra/venta: VRD del BCB + spread bancario. */
export function effectiveRate(vrd, spread = DEFAULT_BANK_SPREAD) {
  return round2(Number(vrd ?? 0) + Number(spread ?? 0));
}

/** USD -> BOB a una tasa dada. */
export function usdToBob(amountUsd, rate) {
  return round2(Number(amountUsd ?? 0) * Number(rate ?? 0));
}

/** BOB -> USD a una tasa dada (lanza si la tasa es 0). */
export function bobToUsd(amountBob, rate) {
  const value = Number(rate ?? 0);
  if (value === 0) {
    throw new Error("tasa de cambio invalida (0)");
  }
  return round2(Number(amountBob ?? 0) / value);
}

/** USD -> BOB usando la tasa efectiva (VRD + spread) en un paso. */
export function convertUsdToBob(amountUsd, { vrd, spread = DEFAULT_BANK_SPREAD } = {}) {
  return usdToBob(amountUsd, effectiveRate(vrd, spread));
}

/** Reprecia una lista de precios USD a BOB con la tasa efectiva. */
export function repriceUsdToBob(pricesUsd = [], { vrd, spread = DEFAULT_BANK_SPREAD } = {}) {
  const rate = effectiveRate(vrd, spread);
  return pricesUsd.map((price) => usdToBob(price, rate));
}
