'use strict';
// Credentials & config. Reads ONLY from the environment (process.env or an
// injected env object). NEVER hardcodes a secret. On the VPS these come from
// /root/.hermes/.env; in n8n the token is a Header Auth credential. See the
// runbook: hermes-content/docs/ONIA_META_SETUP_Y_ADS_RUNBOOK.md §6.

const DEFAULT_API_VERSION = 'v21.0';

const ENV_KEYS = Object.freeze([
  'META_API_VERSION',
  'META_BUSINESS_ID',
  'META_AD_ACCOUNT_ID',
  'META_APP_ID',
  'META_APP_SECRET',
  'META_SYSTEM_USER_TOKEN',
  'META_PIXEL_ID',
  'META_CAPI_TOKEN',
]);

// Minimum needed before any LIVE write to the Marketing API.
const REQUIRED_FOR_LIVE = Object.freeze([
  'META_AD_ACCOUNT_ID',
  'META_APP_ID',
  'META_APP_SECRET',
  'META_SYSTEM_USER_TOKEN',
]);

/**
 * DRY unless META_LIVE is explicitly the string 'true'. Safe by default.
 * @param {Record<string, string | undefined>} [env]
 */
function isDryDefault(env = process.env) {
  return env.META_LIVE !== 'true';
}

/**
 * @param {Record<string, string | undefined>} [env]
 * @param {{ requireLive?: boolean }} [opts]
 */
function resolveCredentials(env = process.env, opts = {}) {
  if (opts.requireLive) {
    const missing = REQUIRED_FOR_LIVE.filter((k) => !env[k]);
    if (missing.length) {
      throw new Error(`missing required Meta env vars for live calls: ${missing.join(', ')}`);
    }
  }
  return {
    apiVersion: env.META_API_VERSION || DEFAULT_API_VERSION,
    businessId: env.META_BUSINESS_ID || null,
    adAccountId: env.META_AD_ACCOUNT_ID || null,
    appId: env.META_APP_ID || null,
    appSecret: env.META_APP_SECRET || null,
    systemUserToken: env.META_SYSTEM_USER_TOKEN || null,
    pixelId: env.META_PIXEL_ID || null,
    capiToken: env.META_CAPI_TOKEN || null,
  };
}

module.exports = { resolveCredentials, isDryDefault, ENV_KEYS, REQUIRED_FOR_LIVE, DEFAULT_API_VERSION };
