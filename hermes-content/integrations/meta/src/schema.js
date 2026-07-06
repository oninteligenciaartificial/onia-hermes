'use strict';
// Input validation for Meta campaign specs. Dependency-free (hand-rolled, same
// style as scripts/onia-feed.js). Validate at the boundary, fail fast, never
// trust external data.

// ODAX / Outcome-Driven Ad Experiences objectives (Marketing API v17+).
const CAMPAIGN_OBJECTIVES = Object.freeze([
  'OUTCOME_TRAFFIC',
  'OUTCOME_LEADS',
  'OUTCOME_SALES',
  'OUTCOME_AWARENESS',
  'OUTCOME_ENGAGEMENT',
  'OUTCOME_APP_PROMOTION',
]);

/**
 * Validate and normalize a campaign spec. Returns a new object (no mutation).
 * @param {{ name?: string, objective?: string, [k: string]: unknown }} spec
 * @returns {{ name: string, objective: string, [k: string]: unknown }}
 */
function validateCampaignSpec(spec) {
  if (!spec || typeof spec !== 'object') {
    throw new Error('campaign spec must be an object');
  }
  const name = typeof spec.name === 'string' ? spec.name.trim() : '';
  if (!name) throw new Error('campaign spec: name is required');
  if (!CAMPAIGN_OBJECTIVES.includes(/** @type {string} */ (spec.objective))) {
    throw new Error(
      `campaign spec: objective must be one of ${CAMPAIGN_OBJECTIVES.join(', ')}`
    );
  }
  return { ...spec, name, objective: spec.objective };
}

module.exports = { validateCampaignSpec, CAMPAIGN_OBJECTIVES };
