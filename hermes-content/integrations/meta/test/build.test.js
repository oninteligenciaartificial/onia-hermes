'use strict';
const assert = require('node:assert');
const { test, summary } = require('./_harness');
const { buildCampaign, buildAdSet, buildAd, buildCreative } = require('../src/build');

test('campaign is always PAUSED even if ACTIVE requested', () => {
  const c = buildCampaign({ name: 'C', objective: 'OUTCOME_TRAFFIC', status: 'ACTIVE' });
  assert.strictEqual(c.status, 'PAUSED');
});

test('campaign carries objective and empty special_ad_categories default', () => {
  const c = buildCampaign({ name: 'C', objective: 'OUTCOME_LEADS' });
  assert.strictEqual(c.objective, 'OUTCOME_LEADS');
  assert.deepStrictEqual(c.special_ad_categories, []);
});

test('adset is PAUSED and omits budget when not provided', () => {
  const a = buildAdSet({ name: 'A', campaign_id: '123', optimization_goal: 'LINK_CLICKS', billing_event: 'IMPRESSIONS' });
  assert.strictEqual(a.status, 'PAUSED');
  assert.ok(!('daily_budget' in a));
});

test('adset includes daily_budget in minor units when provided', () => {
  const a = buildAdSet({ name: 'A', campaign_id: '123', daily_budget_cents: 500, optimization_goal: 'LINK_CLICKS', billing_event: 'IMPRESSIONS' });
  assert.strictEqual(a.daily_budget, 500);
});

test('ad is PAUSED and references creative by id', () => {
  const ad = buildAd({ name: 'Ad', adset_id: '9', creative_id: '77' });
  assert.strictEqual(ad.status, 'PAUSED');
  assert.deepStrictEqual(ad.creative, { creative_id: '77' });
});

test('creative builds object_story_spec with link + CTA', () => {
  const cr = buildCreative({ page_id: 'PAGE', message: 'hola', link: 'https://onia.com.bo/nuvia', cta: 'LEARN_MORE', image_hash: 'abc' });
  assert.strictEqual(cr.object_story_spec.page_id, 'PAGE');
  assert.strictEqual(cr.object_story_spec.link_data.link, 'https://onia.com.bo/nuvia');
  assert.strictEqual(cr.object_story_spec.link_data.call_to_action.type, 'LEARN_MORE');
  assert.strictEqual(cr.object_story_spec.link_data.image_hash, 'abc');
});

test('creative with video uses video_data + image for thumbnail', () => {
  const cr = buildCreative({ page_id: 'P', message: 'm', link: 'https://x.bo', cta: 'SIGN_UP', video_id: 'v1', image_url: 'https://x.bo/thumb.jpg' });
  assert.strictEqual(cr.object_story_spec.video_data.video_id, 'v1');
  assert.strictEqual(cr.object_story_spec.video_data.call_to_action.value.link, 'https://x.bo');
});

summary('build');
