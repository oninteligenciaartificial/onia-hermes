'use strict';
const assert = require('node:assert');
const { test, summary } = require('./_harness');
const {
  boliviaCountryTargeting,
  suggestDailyBudgetCents,
  BUDGET_TIERS_BS,
  bsToCents,
  citySearchRequest,
  BOLIVIA_CITIES,
} = require('../src/bolivia');

test('country targeting uses the real ISO code BO', () => {
  const t = boliviaCountryTargeting();
  assert.deepStrictEqual(t.geo_locations.countries, ['BO']);
});

test('country targeting merges extra targeting', () => {
  const t = boliviaCountryTargeting({ age_min: 25 });
  assert.strictEqual(t.age_min, 25);
  assert.deepStrictEqual(t.geo_locations.countries, ['BO']);
});

test('budget tiers exist in Bs and convert to minor units', () => {
  assert.ok(BUDGET_TIERS_BS.test > 0);
  assert.strictEqual(bsToCents(35), 3500);
});

test('suggestDailyBudgetCents honors currency (BOB centavos vs USD cents)', () => {
  assert.strictEqual(suggestDailyBudgetCents('test', { currency: 'BOB' }), 3500);
  // USD: 35 Bs / 6.96 ~= 5.03 USD -> 503 cents
  assert.strictEqual(suggestDailyBudgetCents('test', { currency: 'USD', rate: 6.96 }), 503);
});

test('suggestDailyBudgetCents throws on unknown tier', () => {
  assert.throws(() => suggestDailyBudgetCents('mega'), /tier/i);
});

test('citySearchRequest builds a DRY GET to the Targeting Search API (no fabricated keys)', () => {
  const req = citySearchRequest('Santa Cruz de la Sierra', 'v21.0');
  assert.strictEqual(req.method, 'GET');
  assert.ok(req.url.includes('/v21.0/search?'));
  assert.ok(req.url.includes('adgeolocation'));
  assert.ok(/Santa\+Cruz|Santa%20Cruz/.test(req.url));
});

test('major Bolivian cities are listed', () => {
  assert.ok(BOLIVIA_CITIES.includes('La Paz'));
  assert.ok(BOLIVIA_CITIES.includes('Santa Cruz de la Sierra'));
  assert.ok(BOLIVIA_CITIES.includes('Cochabamba'));
});

summary('bolivia');
