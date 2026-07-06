'use strict';
// Creative -> Ad mapping. Takes a creative from the content engine (a
// video-brief-template.json-shaped brief, or a simple { type, image_hash, ... }
// descriptor) + a destination landing (Web Factory, which carries the Pixel) and
// produces a full DRAFT plan (campaign + ad set + creative + ad), all PAUSED.
const { buildCampaign, buildAdSet, buildAd, buildCreative } = require('./build');

// Brief objective (video-brief-template.json vocabulary) -> Meta ODAX objective.
const OBJECTIVE_MAP = Object.freeze({
  lead: 'OUTCOME_LEADS',
  demo_request: 'OUTCOME_LEADS',
  booking: 'OUTCOME_LEADS',
  sale: 'OUTCOME_SALES',
  awareness: 'OUTCOME_AWARENESS',
  authority: 'OUTCOME_AWARENESS',
  trust: 'OUTCOME_AWARENESS',
  retention: 'OUTCOME_ENGAGEMENT',
});

/** @param {string} [objective] */
function mapBriefObjectiveToMeta(objective) {
  return OBJECTIVE_MAP[objective] || 'OUTCOME_TRAFFIC';
}

// Brief CTA type -> a VALID Meta CALL_TO_ACTION enum (never invent enums).
const CTA_MAP = Object.freeze({
  dm: 'SEND_MESSAGE',
  message: 'SEND_MESSAGE',
  whatsapp: 'WHATSAPP_MESSAGE',
  audit_request: 'GET_QUOTE',
  book_call: 'CONTACT_US',
  save: 'LEARN_MORE',
  share: 'LEARN_MORE',
  follow: 'LEARN_MORE',
  comment_keyword: 'LEARN_MORE',
});

/** @param {string} [ctaType] */
function mapBriefCtaToMeta(ctaType) {
  return CTA_MAP[ctaType] || 'LEARN_MORE';
}

/**
 * Normalize a content-engine creative into the fields the builders need.
 * Accepts either { asset: { type, video_id, image_hash, image_url }, caption:{text}, cta:{type}, objective }
 * or a flat { type, video_id, image_hash, image_url, copy, cta_type, objective }.
 * @param {object} creative
 */
function normalizeCreative(creative) {
  if (!creative || typeof creative !== 'object') throw new Error('creative must be an object');
  const asset = creative.asset || creative;
  const assetRef = {};
  if (asset.video_id) assetRef.video_id = asset.video_id;
  if (asset.image_hash) assetRef.image_hash = asset.image_hash;
  if (asset.image_url) assetRef.image_url = asset.image_url;
  if (!assetRef.video_id && !assetRef.image_hash && !assetRef.image_url) {
    throw new Error('creative: no asset reference (need video_id, image_hash or image_url)');
  }
  const mediaType = asset.type || (assetRef.video_id ? 'video' : 'image');
  const message = (creative.caption && creative.caption.text) || creative.copy || creative.message || '';
  const ctaType = (creative.cta && creative.cta.type) || creative.cta_type;
  return {
    mediaType,
    assetRef,
    message,
    cta: mapBriefCtaToMeta(ctaType),
    objective: mapBriefObjectiveToMeta(creative.objective),
  };
}

// Slug for utm_campaign (strip accents + non-alphanumerics).
function slug(s) {
  return String(s)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// The destination MUST be a real http(s) landing (the one with the Pixel).
function destinationWithUtm(destinationUrl, campaignName) {
  let url;
  try {
    url = new URL(destinationUrl);
  } catch (e) {
    throw new Error(`destination must be a valid URL, got: ${destinationUrl}`);
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    throw new Error(`destination must be an http(s) landing URL, got protocol: ${url.protocol}`);
  }
  url.searchParams.set('utm_source', 'meta');
  url.searchParams.set('utm_medium', 'paid_social');
  if (campaignName) url.searchParams.set('utm_campaign', slug(campaignName));
  return url.toString();
}

/**
 * Build a full DRAFT ad plan. IDs between objects are null placeholders — the
 * client wires real ids after creating campaign -> adset -> creative -> ad in
 * order. Nothing here is ever ACTIVE.
 * @param {{ creative: object, page_id: string, destinationUrl: string,
 *   pixelId?: string, campaignName?: string, dailyBudgetCents?: number, targeting?: object }} input
 */
function mapCreativeToAdPlan(input) {
  const { creative, page_id, destinationUrl, pixelId, campaignName, dailyBudgetCents, targeting } = input;
  const n = normalizeCreative(creative);
  const link = destinationWithUtm(destinationUrl, campaignName);
  const name = campaignName || `ONIA · ${n.objective}`;

  const campaign = buildCampaign({ name, objective: n.objective });
  const adset = buildAdSet({
    name: `${name} · adset`,
    campaign_id: null, // wired after campaign is created
    // Conservative, always-valid draft goal. Upgrading to OFFSITE_CONVERSIONS
    // (pixel-optimized) is a documented next step once the Pixel has events.
    optimization_goal: 'LINK_CLICKS',
    billing_event: 'IMPRESSIONS',
    daily_budget_cents: dailyBudgetCents,
    targeting,
  });
  const creativeObj = buildCreative({
    page_id,
    message: n.message,
    link,
    cta: n.cta,
    image_hash: n.assetRef.image_hash,
    image_url: n.assetRef.image_url,
    video_id: n.assetRef.video_id,
    name: campaignName,
  });
  const ad = buildAd({ name: `${name} · ad`, adset_id: null, creative_id: null });

  return {
    campaign,
    adset,
    creative: creativeObj,
    ad,
    tracking: { pixel_id: pixelId || null, destination: link, media_type: n.mediaType },
  };
}

module.exports = {
  mapBriefObjectiveToMeta,
  mapBriefCtaToMeta,
  normalizeCreative,
  mapCreativeToAdPlan,
};
