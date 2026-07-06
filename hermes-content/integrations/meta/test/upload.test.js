'use strict';
const assert = require('node:assert');
const { test, summary } = require('./_harness');
const { buildVideoUploadRequest, buildImageUploadRequest } = require('../src/upload');
const { MarketingApiClient } = require('../src/client');

const CREDS = { adAccountId: 'act_1', apiVersion: 'v21.0', systemUserToken: 't' };
const throwingFetch = () => async () => { throw new Error('network in DRY mode'); };

test('buildVideoUploadRequest posts a hosted file_url to advideos', () => {
  const req = buildVideoUploadRequest({ adAccountId: 'act_1', fileUrl: 'https://onia.com.bo/v.mp4', name: 'v', apiVersion: 'v21.0' });
  assert.strictEqual(req.method, 'POST');
  assert.ok(req.url.includes('/act_1/advideos'));
  assert.strictEqual(req.body.file_url, 'https://onia.com.bo/v.mp4');
});

test('buildVideoUploadRequest requires a fileUrl', () => {
  assert.throws(() => buildVideoUploadRequest({ adAccountId: 'act_1' }), /fileUrl/i);
});

test('buildImageUploadRequest posts bytes to adimages', () => {
  const req = buildImageUploadRequest({ adAccountId: 'act_1', bytesBase64: 'AAAA' });
  assert.ok(req.url.includes('/act_1/adimages'));
  assert.strictEqual(req.body.bytes, 'AAAA');
});

(async () => {
  await test('client.createAdVideo is DRY by default (returns request, no fetch)', async () => {
    const client = new MarketingApiClient({ credentials: CREDS, fetchImpl: throwingFetch() });
    const res = await client.createAdVideo({ fileUrl: 'https://onia.com.bo/v.mp4' });
    assert.strictEqual(res.dryRun, true);
    assert.ok(res.request.url.includes('/act_1/advideos'));
    assert.strictEqual(JSON.parse(res.request.body).file_url, 'https://onia.com.bo/v.mp4');
  });

  await test('client.createAdImage is DRY by default', async () => {
    const client = new MarketingApiClient({ credentials: CREDS, fetchImpl: throwingFetch() });
    const res = await client.createAdImage({ bytesBase64: 'AAAA' });
    assert.strictEqual(res.dryRun, true);
    assert.ok(res.request.url.includes('/act_1/adimages'));
  });

  await test('client.createAdVideo live WITHOUT approval throws (write gate)', async () => {
    const client = new MarketingApiClient({ credentials: CREDS, dry: false, fetchImpl: throwingFetch() });
    await assert.rejects(() => client.createAdVideo({ fileUrl: 'https://onia.com.bo/v.mp4' }, { live: true }), /approv/i);
  });

  summary('upload');
})();
