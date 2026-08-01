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

// Tasa del regimen ANTERIOR (6.96), fija hasta la flotacion del 26-jun-2026.
// NO es una tasa vigente y NO es el valor por defecto de officialRate(): sirve
// para leer registros historicos y para que un caller que sepa lo que hace la
// pase explicito como fallback. El oficial de hoy FLOTA con el TCO diario del
// BCB y entra por external_gate (dato del producto).
export const OFFICIAL_RATE_BOB_PER_USD = 6.96;

// Spread bancario tipico sobre el VRD (configurable por el producto).
export const DEFAULT_BANK_SPREAD = 0.1;

export function round2(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

/**
 * Tasa oficial del dia: el TCO diario del BCB (external_gate, dato del
 * producto). Si no llega un TCO valido, LANZA — no inventa una tasa.
 *
 * Por que lanza y no cae a un default: desde la flotacion (RM 245/2026) no
 * existe "la tasa oficial" como constante, y un default silencioso convierte un
 * dato faltante en una factura mal declarada. Hasta el 2026-07-30 esta funcion
 * caia a 6.96: con el oficial cerca de 11.89 eso declaraba ~41% de menos, sin
 * error ni aviso. En una ruta de plata falla fuerte y que el producto decida
 * (pedir el TCO, reintentar, bloquear la emision).
 *
 * `fallback` es opt-in: solo lo pasa quien se hace cargo (ej. recalcular un
 * documento historico con la tasa que regia ese dia).
 */
export function officialRate(dailyTco, fallback) {
  const tco = Number(dailyTco);
  if (Number.isFinite(tco) && tco > 0) {
    return round2(tco);
  }
  if (fallback === undefined) {
    throw new Error(
      `falta el TCO del dia del BCB (recibido: ${JSON.stringify(dailyTco)}). ` +
        "El oficial flota desde 2026-06-26: inyectar el TCO del dia o pasar un fallback explicito."
    );
  }
  const rate = Number(fallback);
  if (!Number.isFinite(rate) || rate <= 0) {
    throw new Error(`fallback de tipo de cambio invalido: ${JSON.stringify(fallback)}`);
  }
  return round2(rate);
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
