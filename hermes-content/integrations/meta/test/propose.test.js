'use strict';
const assert = require('node:assert');
const { test, summary } = require('./_harness');
const { proposeCampaigns } = require('../src/propose');

const CREATIVES = [
  { objective: 'lead', cta: { type: 'dm' }, caption: { text: 'A' }, asset: { type: 'image', image_hash: 'h1' } },
  { objective: 'lead', cta: { type: 'whatsapp' }, caption: { text: 'B' }, asset: { type: 'video', video_id: 'v2' } },
];

test('proposes one PAUSED draft per creative', () => {
  const plans = proposeCampaigns({
    creatives: CREATIVES,
    page_id: 'P',
    destinationUrl: 'https://onia.com.bo/dentalgest',
    pixelId: '123',
    campaignName: 'ONIA · DentalGest · lead',
  });
  assert.strictEqual(plans.length, 2);
  assert.strictEqual(plans[0].campaign.status, 'PAUSED');
  assert.strictEqual(plans[1].campaign.status, 'PAUSED');
});

test('every proposal targets Bolivia by default', () => {
  const plans = proposeCampaigns({ creatives: CREATIVES, page_id: 'P', destinationUrl: 'https://onia.com.bo/x', pixelId: '1' });
  assert.deepStrictEqual(plans[0].adset.targeting.geo_locations.countries, ['BO']);
});

test('budget tier attaches a suggested daily budget to the draft', () => {
  const plans = proposeCampaigns({
    creatives: [CREATIVES[0]], page_id: 'P', destinationUrl: 'https://onia.com.bo/x', pixelId: '1',
    budgetTier: 'test', currency: 'BOB',
  });
  assert.strictEqual(plans[0].adset.daily_budget, 3500);
});

test('no budget tier -> draft carries no budget', () => {
  const plans = proposeCampaigns({ creatives: [CREATIVES[0]], page_id: 'P', destinationUrl: 'https://onia.com.bo/x', pixelId: '1' });
  assert.ok(!('daily_budget' in plans[0].adset));
});

test('throws on empty creatives', () => {
  assert.throws(() => proposeCampaigns({ creatives: [], page_id: 'P', destinationUrl: 'https://x.bo', pixelId: '1' }), /creative/i);
});

summary('propose');
