'use strict';
// Pure builders for Meta Marketing API objects. They RETURN plain objects and
// NEVER call the network. Every builder forces status: 'PAUSED' — a campaign,
// ad set or ad born here can never be ACTIVE. Activation is a separate, gated
// step (see approval.js + client.js). This is the first layer of the spend brake.

/**
 * @param {{ name: string, objective: string, status?: string, special_ad_categories?: string[] }} spec
 */
function buildCampaign(spec) {
  return {
    name: spec.name,
    objective: spec.objective,
    status: 'PAUSED', // brake: builders never emit ACTIVE, even if asked
    special_ad_categories: spec.special_ad_categories || [],
  };
}

/**
 * daily_budget is expressed in MINOR units (cents of the account currency).
 * Omitted entirely when not provided, so a draft has no budget attached.
 * @param {{ name: string, campaign_id: string, daily_budget_cents?: number,
 *   optimization_goal?: string, billing_event?: string, targeting?: object }} spec
 */
function buildAdSet(spec) {
  const adset = {
    name: spec.name,
    campaign_id: spec.campaign_id,
    status: 'PAUSED',
    billing_event: spec.billing_event || 'IMPRESSIONS',
    optimization_goal: spec.optimization_goal || 'LINK_CLICKS',
  };
  if (spec.daily_budget_cents != null) adset.daily_budget = spec.daily_budget_cents;
  if (spec.targeting) adset.targeting = spec.targeting;
  return adset;
}

/**
 * @param {{ name: string, adset_id: string, creative_id: string }} spec
 */
function buildAd(spec) {
  return {
    name: spec.name,
    adset_id: spec.adset_id,
    status: 'PAUSED',
    creative: { creative_id: spec.creative_id },
  };
}

/**
 * Build an ad creative's object_story_spec. Supports a link (image) creative or
 * a video creative. The link ALWAYS points at the destination that carries the
 * Pixel (a Web Factory landing).
 * @param {{ page_id: string, message?: string, link: string, cta?: string,
 *   image_hash?: string, image_url?: string, video_id?: string,
 *   name?: string, description?: string, title?: string }} spec
 */
function buildCreative(spec) {
  const call_to_action = { type: spec.cta || 'LEARN_MORE', value: { link: spec.link } };
  let object_story_spec;
  if (spec.video_id) {
    const video_data = { video_id: spec.video_id, message: spec.message, call_to_action };
    if (spec.image_url) video_data.image_url = spec.image_url;
    if (spec.image_hash) video_data.image_hash = spec.image_hash;
    if (spec.title) video_data.title = spec.title;
    object_story_spec = { page_id: spec.page_id, video_data };
  } else {
    const link_data = { link: spec.link, message: spec.message, call_to_action };
    if (spec.image_hash) link_data.image_hash = spec.image_hash;
    if (spec.name) link_data.name = spec.name;
    if (spec.description) link_data.description = spec.description;
    object_story_spec = { page_id: spec.page_id, link_data };
  }
  const creative = { object_story_spec };
  if (spec.name) creative.name = spec.name;
  return creative;
}

module.exports = { buildCampaign, buildAdSet, buildAd, buildCreative };
