/*
 * Logica pura de tipo de cambio (Bolivia). Utilidad transversal usada por
 * commerce (repricing de listas USD/BOB), imports (landed cost) y accounting
 * (moneda extranjera). Sin estado, sin IO.
 *
 * Bolivia (regimen 2026): el dolar oficial YA NO es fijo — FLOTA con el TCO
 * diario del BCB (RM 245/2026 + RD BCB 88/2026; ~Bs 10.90 al 20-jul-2026). El
 * SIAT EXIGE ese TCO diario del BCB incluso para facturar en moneda extranjera
 * (RND 102600000026). El precio comercial usa la tasa efectiva (TCO + spread).
 * La cotizacion Binance es referencia, NUNCA base de precios. Repreciar siempre
 * con aprobacion (ApprovalRequest) — workflow del producto, no de esta logica.
 */

// Fallback historico (6.96). El oficial real FLOTA: pasar el TCO del dia a
// officialRate() (entra como external_gate, dato del producto/BCB). Se conserva
// como respaldo cuando aun no hay TCO inyectado, no como tasa vigente.
export const OFFICIAL_RATE_BOB_PER_USD = 6.96;

// Spread bancario tipico sobre el VRD (configurable por el producto).
export const DEFAULT_BANK_SPREAD = 0.1;

export function round2(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

/**
 * Tasa oficial del dia: usa el TCO diario del BCB (external_gate, dato del
 * producto) si es un numero valido y positivo; si no, cae al fallback historico.
 * Reemplaza al 6.96 fijo del regimen anterior (ahora el oficial flota).
 */
export function officialRate(dailyTco, fallback = OFFICIAL_RATE_BOB_PER_USD) {
  const tco = Number(dailyTco);
  return Number.isFinite(tco) && tco > 0 ? round2(tco) : fallback;
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
