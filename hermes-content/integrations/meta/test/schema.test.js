'use strict';
const assert = require('node:assert');
const { test, summary } = require('./_harness');
const { validateCampaignSpec, CAMPAIGN_OBJECTIVES } = require('../src/schema');

test('accepts a valid traffic campaign spec', () => {
  const spec = validateCampaignSpec({ name: 'ONIA test', objective: 'OUTCOME_TRAFFIC' });
  assert.strictEqual(spec.name, 'ONIA test');
  assert.strictEqual(spec.objective, 'OUTCOME_TRAFFIC');
});

test('rejects unknown objective', () => {
  assert.throws(() => validateCampaignSpec({ name: 'x', objective: 'MAKE_MONEY' }), /objective/i);
});

test('rejects missing name', () => {
  assert.throws(() => validateCampaignSpec({ objective: 'OUTCOME_LEADS' }), /name/i);
});

test('trims name and rejects empty', () => {
  assert.strictEqual(validateCampaignSpec({ name: '  Hi  ', objective: 'OUTCOME_LEADS' }).name, 'Hi');
  assert.throws(() => validateCampaignSpec({ name: '   ', objective: 'OUTCOME_LEADS' }), /name/i);
});

test('objectives list is the ODAX set', () => {
  assert.ok(CAMPAIGN_OBJECTIVES.includes('OUTCOME_LEADS'));
  assert.ok(CAMPAIGN_OBJECTIVES.includes('OUTCOME_SALES'));
  assert.ok(CAMPAIGN_OBJECTIVES.includes('OUTCOME_TRAFFIC'));
});

test('validateCampaignSpec does not mutate input', () => {
  const input = { name: ' x ', objective: 'OUTCOME_TRAFFIC' };
  validateCampaignSpec(input);
  assert.strictEqual(input.name, ' x ');
});

summary('schema');
