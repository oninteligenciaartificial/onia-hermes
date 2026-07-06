'use strict';
// Metrics reporter. Turns a Meta insights JSON response into an aggregated
// summary + a readable markdown report. Pure. Guards against division by zero.

// Action types Meta uses for a "lead" depending on setup (pixel/CAPI/leadgen).
const LEAD_ACTION_TYPES = Object.freeze([
  'lead',
  'onsite_conversion.lead_grouped',
  'offsite_conversion.fb_pixel_lead',
  'leadgen_grouped',
]);

function num(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

/** @param {Array<{action_type: string, value: string|number}>} [actions] */
function extractLeads(actions) {
  if (!Array.isArray(actions)) return 0;
  return actions
    .filter((a) => LEAD_ACTION_TYPES.includes(a.action_type))
    .reduce((s, a) => s + num(a.value), 0);
}

/**
 * @param {{ data?: Array<object> } | undefined | null} response
 */
function summarizeInsights(response) {
  const rows = (response && response.data) || [];
  const agg = rows.reduce(
    (acc, r) => {
      acc.impressions += num(r.impressions);
      acc.clicks += num(r.clicks);
      acc.spend += num(r.spend);
      acc.leads += extractLeads(r.actions);
      acc.rows += 1;
      return acc;
    },
    { impressions: 0, clicks: 0, spend: 0, leads: 0, rows: 0 }
  );
  return {
    ...agg,
    ctr: agg.impressions > 0 ? agg.clicks / agg.impressions : 0,
    cpl: agg.leads > 0 ? agg.spend / agg.leads : null,
    cpc: agg.clicks > 0 ? agg.spend / agg.clicks : null,
  };
}

/**
 * @param {ReturnType<typeof summarizeInsights>} summary
 * @param {{ currency?: string, title?: string }} [opts]
 */
function formatReport(summary, opts = {}) {
  const currency = opts.currency || 'USD';
  const title = opts.title || 'Reporte Meta Ads';
  const pct = (x) => `${(x * 100).toFixed(2)}%`;
  const money = (x) => (x == null ? 'n/a' : `${currency} ${x.toFixed(2)}`);
  return [
    `## ${title}`,
    `- Impresiones: ${summary.impressions}`,
    `- Clicks: ${summary.clicks} (CTR ${pct(summary.ctr)})`,
    `- Gasto: ${money(summary.spend)}`,
    `- Leads: ${summary.leads}`,
    `- CPL: ${money(summary.cpl)}`,
    `- CPC: ${money(summary.cpc)}`,
  ].join('\n');
}

module.exports = { summarizeInsights, formatReport, extractLeads, LEAD_ACTION_TYPES };
