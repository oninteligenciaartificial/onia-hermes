'use strict';
const assert = require('node:assert');
const { test, summary } = require('./_harness');
const { resolveCredentials, isDryDefault, ENV_KEYS } = require('../src/config');

test('ENV_KEYS lists the meta variables', () => {
  assert.ok(ENV_KEYS.includes('META_SYSTEM_USER_TOKEN'));
  assert.ok(ENV_KEYS.includes('META_AD_ACCOUNT_ID'));
  assert.ok(ENV_KEYS.includes('META_CAPI_TOKEN'));
});

test('isDryDefault is true unless META_LIVE=true', () => {
  assert.strictEqual(isDryDefault({}), true);
  assert.strictEqual(isDryDefault({ META_LIVE: 'false' }), true);
  assert.strictEqual(isDryDefault({ META_LIVE: 'true' }), false);
});

test('resolveCredentials returns present values without requiring live', () => {
  const c = resolveCredentials({ META_API_VERSION: 'v21.0', META_AD_ACCOUNT_ID: 'act_1' });
  assert.strictEqual(c.apiVersion, 'v21.0');
  assert.strictEqual(c.adAccountId, 'act_1');
  assert.strictEqual(c.systemUserToken, null);
});

test('resolveCredentials defaults api version when absent', () => {
  assert.ok(/^v\d+\.\d+$/.test(resolveCredentials({}).apiVersion));
});

test('resolveCredentials requireLive throws listing the missing secrets', () => {
  assert.throws(() => resolveCredentials({}, { requireLive: true }), /missing/i);
});

test('resolveCredentials requireLive passes when all present', () => {
  const env = {
    META_API_VERSION: 'v21.0', META_BUSINESS_ID: 'b', META_AD_ACCOUNT_ID: 'act_1',
    META_APP_ID: 'a', META_APP_SECRET: 's', META_SYSTEM_USER_TOKEN: 't',
    META_PIXEL_ID: 'p', META_CAPI_TOKEN: 'c',
  };
  assert.strictEqual(resolveCredentials(env, { requireLive: true }).systemUserToken, 't');
});

summary('config');
