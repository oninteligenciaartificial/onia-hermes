'use strict';
// Campaign proposal generator. Turns a set of creatives (from the content
// engine) + a goal into N campaign DRAFTS, all PAUSED, targeting Bolivia by
// default. This is the "propone campañas" brain — it never publishes or spends.
const { mapCreativeToAdPlan } = require('./creative-map');
const { boliviaCountryTargeting, suggestDailyBudgetCents } = require('./bolivia');

/**
 * @param {{ creatives: object[], page_id: string, destinationUrl: string,
 *   pixelId?: string, campaignName?: string, budgetTier?: string,
 *   currency?: 'USD'|'BOB', dailyBudgetCents?: number, targeting?: object, geo?: object }} input
 * @returns {object[]} one draft plan per creative (all PAUSED)
 */
function proposeCampaigns(input) {
  const {
    creatives, page_id, destinationUrl, pixelId, campaignName,
    budgetTier, currency, dailyBudgetCents, targeting, geo,
  } = input;

  if (!Array.isArray(creatives) || creatives.length === 0) {
    throw new Error('propose: a non-empty creatives array is required');
  }

  const baseTargeting = targeting || boliviaCountryTargeting(geo || {});
  const budget = dailyBudgetCents != null
    ? dailyBudgetCents
    : (budgetTier ? suggestDailyBudgetCents(budgetTier, { currency }) : undefined);

  return creatives.map((creative, i) => {
    const name = campaignName ? `${campaignName} · v${i + 1}` : undefined;
    return mapCreativeToAdPlan({
      creative,
      page_id,
      destinationUrl,
      pixelId,
      campaignName: name,
      dailyBudgetCents: budget,
      targeting: baseTargeting,
    });
  });
}

module.exports = { proposeCampaigns };
