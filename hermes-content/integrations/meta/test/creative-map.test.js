'use strict';
const assert = require('node:assert');
const { test, summary } = require('./_harness');
const {
  mapBriefObjectiveToMeta,
  mapBriefCtaToMeta,
  normalizeCreative,
  mapCreativeToAdPlan,
} = require('../src/creative-map');

test('brief objective maps to Meta ODAX objective', () => {
  assert.strictEqual(mapBriefObjectiveToMeta('lead'), 'OUTCOME_LEADS');
  assert.strictEqual(mapBriefObjectiveToMeta('demo_request'), 'OUTCOME_LEADS');
  assert.strictEqual(mapBriefObjectiveToMeta('booking'), 'OUTCOME_LEADS');
  assert.strictEqual(mapBriefObjectiveToMeta('sale'), 'OUTCOME_SALES');
  assert.strictEqual(mapBriefObjectiveToMeta('awareness'), 'OUTCOME_AWARENESS');
  assert.strictEqual(mapBriefObjectiveToMeta('authority'), 'OUTCOME_AWARENESS');
  assert.strictEqual(mapBriefObjectiveToMeta('retention'), 'OUTCOME_ENGAGEMENT');
  assert.strictEqual(mapBriefObjectiveToMeta('whatever'), 'OUTCOME_TRAFFIC');
});

test('brief cta maps to a valid Meta CALL_TO_ACTION enum', () => {
  assert.strictEqual(mapBriefCtaToMeta('dm'), 'SEND_MESSAGE');
  assert.strictEqual(mapBriefCtaToMeta('whatsapp'), 'WHATSAPP_MESSAGE');
  assert.strictEqual(mapBriefCtaToMeta('audit_request'), 'GET_QUOTE');
  assert.strictEqual(mapBriefCtaToMeta('book_call'), 'CONTACT_US');
  assert.strictEqual(mapBriefCtaToMeta('comment_keyword'), 'LEARN_MORE');
  assert.strictEqual(mapBriefCtaToMeta(undefined), 'LEARN_MORE');
});

test('normalizeCreative reads a content-engine brief (video)', () => {
  const brief = {
    job_id: 'vl-1',
    objective: 'lead',
    cta: { type: 'dm', text: 'Escribinos' },
    caption: { text: 'Automatizá tu clínica' },
    asset: { type: 'video', video_id: 'v42', image_url: 'https://x.bo/thumb.jpg' },
  };
  const n = normalizeCreative(brief);
  assert.strictEqual(n.mediaType, 'video');
  assert.strictEqual(n.assetRef.video_id, 'v42');
  assert.strictEqual(n.assetRef.image_url, 'https://x.bo/thumb.jpg');
  assert.strictEqual(n.message, 'Automatizá tu clínica');
  assert.strictEqual(n.cta, 'SEND_MESSAGE');
  assert.strictEqual(n.objective, 'OUTCOME_LEADS');
});

test('normalizeCreative reads a simple image descriptor', () => {
  const n = normalizeCreative({ type: 'image', image_hash: 'h1', copy: 'Hola', cta_type: 'audit_request', objective: 'awareness' });
  assert.strictEqual(n.mediaType, 'image');
  assert.strictEqual(n.assetRef.image_hash, 'h1');
  assert.strictEqual(n.cta, 'GET_QUOTE');
  assert.strictEqual(n.objective, 'OUTCOME_AWARENESS');
});

test('normalizeCreative throws when no asset reference is present', () => {
  assert.throws(() => normalizeCreative({ caption: { text: 'x' }, objective: 'lead' }), /asset/i);
});

test('mapCreativeToAdPlan builds a full PAUSED draft plan to a landing', () => {
  const brief = { objective: 'lead', cta: { type: 'dm' }, caption: { text: 'X' }, asset: { type: 'image', image_hash: 'h' } };
  const plan = mapCreativeToAdPlan({
    creative: brief,
    page_id: 'PAGE',
    destinationUrl: 'https://onia.com.bo/nuvia',
    pixelId: '123',
    campaignName: 'ONIA · Nuvia · lead',
  });
  assert.strictEqual(plan.campaign.status, 'PAUSED');
  assert.strictEqual(plan.campaign.objective, 'OUTCOME_LEADS');
  assert.strictEqual(plan.adset.status, 'PAUSED');
  assert.strictEqual(plan.ad.status, 'PAUSED');
  assert.strictEqual(plan.creative.object_story_spec.link_data.call_to_action.type, 'SEND_MESSAGE');
  assert.ok(plan.creative.object_story_spec.link_data.link.startsWith('https://onia.com.bo/nuvia'));
  assert.strictEqual(plan.tracking.pixel_id, '123');
});

test('mapCreativeToAdPlan rejects a non-http destination (must be a real landing carrying the Pixel)', () => {
  assert.throws(() => mapCreativeToAdPlan({
    creative: { asset: { type: 'image', image_hash: 'h' } },
    page_id: 'P', destinationUrl: 'javascript:alert(1)', pixelId: '1',
  }), /destination/i);
});

test('mapCreativeToAdPlan appends utm params and preserves existing query', () => {
  const plan = mapCreativeToAdPlan({
    creative: { asset: { type: 'image', image_hash: 'h' } },
    page_id: 'P', destinationUrl: 'https://onia.com.bo/nuvia?x=1', pixelId: '1', campaignName: 'C',
  });
  const link = plan.creative.object_story_spec.link_data.link;
  assert.ok(link.includes('utm_source=meta'));
  assert.ok(link.includes('utm_medium=paid_social'));
  assert.ok(link.includes('x=1'));
});

summary('creative-map');
