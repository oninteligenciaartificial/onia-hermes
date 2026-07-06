'use strict';
// Bolivia targeting presets + budget helpers. Pure. Country targeting uses the
// real ISO code 'BO'. City-level keys are account/version-specific, so we NEVER
// fabricate them — citySearchRequest builds the Targeting Search call to resolve
// a city name to its Meta geo key at runtime.

const BOLIVIA_COUNTRY = 'BO';

// Major cities as search queries (resolve to Meta keys with citySearchRequest).
const BOLIVIA_CITIES = Object.freeze([
  'La Paz',
  'Santa Cruz de la Sierra',
  'Cochabamba',
  'El Alto',
  'Sucre',
  'Oruro',
  'Tarija',
  'Potosí',
]);

/**
 * Base Bolivia targeting. Merge extra targeting (age, gender, interests, etc).
 * @param {object} [extra]
 */
function boliviaCountryTargeting(extra = {}) {
  return { geo_locations: { countries: [BOLIVIA_COUNTRY] }, ...extra };
}

// Suggested daily budgets in Bolivianos (Bs). Adjust freely — these are starting
// points for a small local test, not a rule.
const BUDGET_TIERS_BS = Object.freeze({ test: 35, standard: 70, push: 140 });

// Bolivia's boliviano/USD rate has been effectively pegged for years.
const OFFICIAL_BOB_PER_USD = 6.96;

/** Bs -> minor units for a BOB-denominated ad account (centavos). */
function bsToCents(bs) {
  return Math.round(Number(bs) * 100);
}

/** Bs -> minor units for a USD-denominated ad account (cents). */
function bsToUsdCents(bs, rate = OFFICIAL_BOB_PER_USD) {
  return Math.round((Number(bs) / rate) * 100);
}

/**
 * Suggested daily budget in the account currency's MINOR units.
 * @param {'test'|'standard'|'push'} [tier]
 * @param {{ currency?: 'USD'|'BOB', rate?: number }} [opts]
 */
function suggestDailyBudgetCents(tier = 'test', opts = {}) {
  const bs = BUDGET_TIERS_BS[tier];
  if (bs == null) throw new Error(`unknown budget tier: ${tier} (use test|standard|push)`);
  const currency = opts.currency || 'USD';
  return currency === 'BOB' ? bsToCents(bs) : bsToUsdCents(bs, opts.rate);
}

/**
 * DRY GET request to resolve a city name to a Meta geo key (adgeolocation).
 * @param {string} query
 * @param {string} [apiVersion]
 */
function citySearchRequest(query, apiVersion = 'v21.0') {
  const q = new URLSearchParams({
    type: 'adgeolocation',
    location_types: '["city"]',
    q: String(query),
  });
  return { method: 'GET', url: `https://graph.facebook.com/${apiVersion}/search?${q.toString()}` };
}

module.exports = {
  BOLIVIA_COUNTRY,
  BOLIVIA_CITIES,
  boliviaCountryTargeting,
  BUDGET_TIERS_BS,
  OFFICIAL_BOB_PER_USD,
  bsToCents,
  bsToUsdCents,
  suggestDailyBudgetCents,
  citySearchRequest,
};
