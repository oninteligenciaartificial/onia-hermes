'use strict';
// Marketing API client. TWO safety layers baked in:
//   1) DRY by default — every WRITE returns { dryRun, request } and touches no
//      network. This is the "borrador": the campaign object exists locally only.
//   2) Publishing/activating to Meta requires BOTH dry:false AND live:true AND a
//      Sergio-approved request (assertActivationAllowed). Reads (insights) are
//      never gated. No token is ever hardcoded — it comes from credentials.
const { buildCampaign, buildAdSet, buildAd } = require('./build');
const { validateCampaignSpec } = require('./schema');
const { assertActivationAllowed } = require('./approval');

const GRAPH_HOST = 'https://graph.facebook.com';

class MarketingApiClient {
  /**
   * @param {{ credentials?: object, apiVersion?: string, dry?: boolean,
   *   fetchImpl?: typeof fetch }} [options]
   */
  constructor(options = {}) {
    this.credentials = options.credentials || {};
    this.apiVersion = options.apiVersion || this.credentials.apiVersion || 'v21.0';
    this.dry = options.dry === undefined ? true : options.dry;
    this.fetchImpl = options.fetchImpl || globalThis.fetch;
  }

  graphUrl(path) {
    return `${GRAPH_HOST}/${this.apiVersion}/${path}`;
  }

  _adAccountPath(sub) {
    const acct = this.credentials.adAccountId;
    if (!acct) throw new Error('adAccountId is required (set META_AD_ACCOUNT_ID)');
    return `${acct}/${sub}`;
  }

  _dryRequest(method, path, body) {
    return {
      dryRun: true,
      request: { method, url: this.graphUrl(path), body: body ? JSON.stringify(body) : undefined },
    };
  }

  async _send(method, path, body) {
    const token = this.credentials.systemUserToken;
    if (!token) throw new Error('systemUserToken is required for live calls (set META_SYSTEM_USER_TOKEN)');
    const res = await this.fetchImpl(this.graphUrl(path), {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
      const detail = typeof res.text === 'function' ? await res.text().catch(() => '') : '';
      throw new Error(`Meta API ${res.status}: ${detail}`);
    }
    return res.json();
  }

  // A WRITE that publishes an object to Meta. DRY wins; going live needs approval.
  async _publish(path, body, opts = {}) {
    if (this.dry || opts.live !== true) {
      return this._dryRequest('POST', path, body);
    }
    assertActivationAllowed(opts); // throws unless live && approved by Sergio
    return this._send('POST', path, body);
  }

  /** @param {object} spec @param {{ live?: boolean, approval?: object }} [opts] */
  async createCampaign(spec, opts = {}) {
    const campaign = buildCampaign(validateCampaignSpec(spec));
    return this._publish(this._adAccountPath('campaigns'), campaign, opts);
  }

  async createAdSet(spec, opts = {}) {
    return this._publish(this._adAccountPath('adsets'), buildAdSet(spec), opts);
  }

  async createAd(spec, opts = {}) {
    return this._publish(this._adAccountPath('ads'), buildAd(spec), opts);
  }

  /** creative is a full object_story_spec-bearing object (see build.buildCreative). */
  async createAdCreative(creative, opts = {}) {
    return this._publish(this._adAccountPath('adcreatives'), creative, opts);
  }

  // --- ACTIVATION / BUDGET: always gated, never dry-bypassable ---

  /** Flip an entity to ACTIVE. @param {string} entityId */
  async activate(entityId, opts = {}) {
    assertActivationAllowed(opts);
    return this._send('POST', `${entityId}`, { status: 'ACTIVE' });
  }

  /** Set/raise a daily budget (minor units). @param {string} entityId */
  async setBudget(entityId, dailyBudgetCents, opts = {}) {
    assertActivationAllowed(opts);
    return this._send('POST', `${entityId}`, { daily_budget: dailyBudgetCents });
  }

  // --- READ: not spend, not gated ---

  insightsUrl(params = {}) {
    const acct = this.credentials.adAccountId;
    if (!acct) throw new Error('adAccountId is required (set META_AD_ACCOUNT_ID)');
    const q = new URLSearchParams();
    if (params.level) q.set('level', params.level);
    if (params.fields) q.set('fields', Array.isArray(params.fields) ? params.fields.join(',') : params.fields);
    if (params.date_preset) q.set('date_preset', params.date_preset);
    if (params.time_range) q.set('time_range', JSON.stringify(params.time_range));
    return `${this.graphUrl(`${acct}/insights`)}?${q.toString()}`;
  }

  async getInsights(params = {}) {
    const token = this.credentials.systemUserToken;
    const res = await this.fetchImpl(this.insightsUrl(params), {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) throw new Error(`Meta API ${res.status}`);
    return res.json();
  }
}

module.exports = { MarketingApiClient };
