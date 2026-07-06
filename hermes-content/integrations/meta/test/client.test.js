'use strict';
const assert = require('node:assert');
const { test, summary } = require('./_harness');
const { MarketingApiClient } = require('../src/client');

const CREDS = { adAccountId: 'act_1', apiVersion: 'v21.0', systemUserToken: 't' };

function spyFetch() {
  const calls = [];
  const fn = async (url, opts) => {
    calls.push({ url, opts });
    return { ok: true, status: 200, json: async () => ({ id: 'stub' }) };
  };
  fn.calls = calls;
  return fn;
}
const throwingFetch = () => async () => { throw new Error('network was called in DRY mode!'); };

(async () => {
  await test('DRY by default: createCampaign returns a request and does NOT call fetch', async () => {
    const client = new MarketingApiClient({ credentials: CREDS, fetchImpl: throwingFetch() });
    const res = await client.createCampaign({ name: 'C', objective: 'OUTCOME_TRAFFIC' });
    assert.strictEqual(res.dryRun, true);
    assert.strictEqual(res.request.method, 'POST');
    assert.ok(res.request.url.includes('/v21.0/act_1/campaigns'));
    assert.strictEqual(JSON.parse(res.request.body).status, 'PAUSED');
  });

  await test('publishing live WITHOUT approval throws (spend brake)', async () => {
    const client = new MarketingApiClient({ credentials: CREDS, dry: false, fetchImpl: throwingFetch() });
    await assert.rejects(
      () => client.createCampaign({ name: 'C', objective: 'OUTCOME_TRAFFIC' }, { live: true }),
      /approv/i
    );
  });

  await test('publishing live WITH Sergio approval calls fetch with a PAUSED body + bearer token', async () => {
    const fetchImpl = spyFetch();
    const approval = { state: 'approved', approvedBy: 'sergio' };
    const client = new MarketingApiClient({ credentials: CREDS, dry: false, fetchImpl });
    const res = await client.createCampaign({ name: 'C', objective: 'OUTCOME_TRAFFIC' }, { live: true, approval });
    assert.strictEqual(fetchImpl.calls.length, 1);
    assert.strictEqual(res.id, 'stub');
    assert.strictEqual(JSON.parse(fetchImpl.calls[0].opts.body).status, 'PAUSED');
    assert.ok(fetchImpl.calls[0].opts.headers.Authorization.includes('t'));
  });

  await test('dry mode overrides live: live:true while dry stays DRY (never publishes by accident)', async () => {
    const client = new MarketingApiClient({ credentials: CREDS, dry: true, fetchImpl: throwingFetch() });
    const res = await client.createCampaign({ name: 'C', objective: 'OUTCOME_TRAFFIC' }, { live: true, approval: { state: 'approved', approvedBy: 'sergio' } });
    assert.strictEqual(res.dryRun, true);
  });

  await test('activate() is always gated — throws without approval even when dry:false', async () => {
    const client = new MarketingApiClient({ credentials: CREDS, dry: false, fetchImpl: throwingFetch() });
    await assert.rejects(() => client.activate('123', { live: true }), /approv/i);
  });

  await test('setBudget() is always gated — throws without approval', async () => {
    const client = new MarketingApiClient({ credentials: CREDS, dry: false, fetchImpl: throwingFetch() });
    await assert.rejects(() => client.setBudget('123', 500, { live: true }), /approv/i);
  });

  await test('createAdCreative is DRY by default (returns request, no fetch)', async () => {
    const client = new MarketingApiClient({ credentials: CREDS, fetchImpl: throwingFetch() });
    const res = await client.createAdCreative({ object_story_spec: { page_id: 'P' } });
    assert.strictEqual(res.dryRun, true);
    assert.ok(res.request.url.includes('/act_1/adcreatives'));
  });

  await test('getInsights is a READ — allowed (not spend), builds the insights URL', async () => {
    const fetchImpl = spyFetch();
    const client = new MarketingApiClient({ credentials: CREDS, fetchImpl });
    await client.getInsights({ level: 'campaign', fields: ['impressions', 'spend'] });
    assert.strictEqual(fetchImpl.calls.length, 1);
    assert.ok(fetchImpl.calls[0].url.includes('/act_1/insights'));
    assert.ok(fetchImpl.calls[0].url.includes('impressions'));
  });

  summary('client');
})();
