'use strict';
const assert = require('node:assert');
const { test, summary } = require('./_harness');
const {
  generatePixelBaseCode,
  buildCapiEvent,
  newEventId,
  generateBrowserTrackCall,
  isValidPixelId,
} = require('../src/pixel');

test('base code embeds the pixel id and standard fbq init + PageView', () => {
  const code = generatePixelBaseCode('123456');
  assert.ok(code.includes("fbq('init', '123456')"));
  assert.ok(code.includes("fbq('track', 'PageView')"));
  assert.ok(code.includes('connect.facebook.net'));
  assert.ok(code.includes('<noscript>'));
});

test('base code rejects a non-numeric pixel id', () => {
  assert.throws(() => generatePixelBaseCode('abc'), /pixel/i);
});

test('isValidPixelId accepts digits only', () => {
  assert.strictEqual(isValidPixelId('123456789'), true);
  assert.strictEqual(isValidPixelId('12x'), false);
  assert.strictEqual(isValidPixelId(''), false);
});

test('newEventId returns distinct ids (dedup key)', () => {
  assert.notStrictEqual(newEventId(), newEventId());
});

test('browser track call carries the shared eventID for dedup', () => {
  const call = generateBrowserTrackCall('Lead', 'evt-1');
  assert.ok(call.includes("fbq('track', 'Lead'"));
  assert.ok(call.includes("eventID: 'evt-1'"));
});

test('capi event has the correct shape and shares event_id for dedup', () => {
  const evt = buildCapiEvent({
    eventName: 'Lead',
    eventId: 'evt-1',
    eventSourceUrl: 'https://onia.com.bo/nuvia',
    clientUserAgent: 'UA',
    clientIpAddress: '1.2.3.4',
  });
  assert.strictEqual(evt.event_name, 'Lead');
  assert.strictEqual(evt.event_id, 'evt-1');
  assert.strictEqual(evt.action_source, 'website');
  assert.strictEqual(evt.event_source_url, 'https://onia.com.bo/nuvia');
  assert.ok(evt.event_time > 0);
  assert.strictEqual(evt.user_data.client_user_agent, 'UA');
});

test('capi event hashes PII (email) with sha256, never plaintext', () => {
  const evt = buildCapiEvent({
    eventName: 'Lead', eventId: 'e', eventSourceUrl: 'https://x.bo',
    userData: { email: 'Test@Onia.com ' },
  });
  assert.ok(/^[a-f0-9]{64}$/.test(evt.user_data.em[0]));
  assert.ok(!JSON.stringify(evt).includes('Test@Onia.com'));
});

summary('pixel');
