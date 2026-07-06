'use strict';
// DRY-RUN demo — proves the engine builds a full campaign DRAFT without touching
// Meta and without spending. No credentials needed. Run:
//   node examples/dry-run-demo.js
const path = require('node:path');
const fs = require('node:fs');
const { mapCreativeToAdPlan } = require('../src/creative-map');
const { MarketingApiClient } = require('../src/client');
const { generatePixelBaseCode, newEventId, generateBrowserTrackCall } = require('../src/pixel');
const { proposeCampaigns } = require('../src/propose');
const { suggestDailyBudgetCents } = require('../src/bolivia');
const { summarizeInsights, formatReport } = require('../src/report');

const creative = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'creative-input.example.json'), 'utf8')
);

// Placeholders — the real ids come from the runbook (§0). Nothing here is live.
const plan = mapCreativeToAdPlan({
  creative,
  page_id: 'PAGE_ID_PLACEHOLDER',
  destinationUrl: 'https://onia.com.bo/dentalgest-demo',
  pixelId: '000000000000000',
  campaignName: 'ONIA · DentalGest demo · lead',
  // no dailyBudgetCents -> the draft carries NO budget
});

console.log('\n=== DRAFT PLAN (campaign + adset + creative + ad, all PAUSED) ===');
console.log(JSON.stringify(plan, null, 2));

// A DRY client shows the exact request it WOULD POST — but sends nothing.
const client = new MarketingApiClient({
  credentials: { adAccountId: 'act_PLACEHOLDER', apiVersion: 'v21.0' },
});

(async () => {
  const campaignReq = await client.createCampaign({
    name: plan.campaign.name,
    objective: plan.campaign.objective,
  });
  console.log('\n=== DRY request the client would POST (campaign) ===');
  console.log(JSON.stringify(campaignReq, null, 2));

  console.log('\n=== Pixel base code for the landing <head> ===');
  console.log(generatePixelBaseCode('123456789012345'));

  const evtId = newEventId();
  console.log('\n=== Dedup pair (same event_id in browser + CAPI) ===');
  console.log('browser:', generateBrowserTrackCall('Lead', evtId));
  console.log('server : POST /{pixel}/events with event_id =', evtId);

  // Propose 2 drafts (A/B) targeting Bolivia, with a suggested test budget.
  const proposals = proposeCampaigns({
    creatives: [creative, { ...creative, cta: { type: 'whatsapp' }, caption: { text: 'Turnos por WhatsApp, sin llamadas.' } }],
    page_id: 'PAGE_ID_PLACEHOLDER',
    destinationUrl: 'https://onia.com.bo/dentalgest-demo',
    pixelId: '000000000000000',
    campaignName: 'ONIA · DentalGest demo · lead',
    budgetTier: 'test',
    currency: 'BOB',
  });
  console.log(`\n=== PROPUESTA: ${proposals.length} borradores A/B (Bolivia, Bs.${suggestDailyBudgetCents('test', { currency: 'BOB' }) / 100}/día) ===`);
  proposals.forEach((p, i) => {
    console.log(`  v${i + 1}: ${p.campaign.status} · geo=${p.adset.targeting.geo_locations.countries.join(',')} · budget=${p.adset.daily_budget} · cta=${p.creative.object_story_spec.video_data?.call_to_action.type || p.creative.object_story_spec.link_data?.call_to_action.type}`);
  });

  // Sample metrics report (fake insights — shows the reporter shape).
  const sample = { data: [{ impressions: '3200', clicks: '96', spend: '70.00', actions: [{ action_type: 'lead', value: '8' }] }] };
  console.log('\n=== REPORTE (ejemplo, datos falsos) ===');
  console.log(formatReport(summarizeInsights(sample), { currency: 'Bs', title: 'Semana 1 (demo)' }));

  console.log('\n✔ Nothing was published. Zero spend. Activar = solo con aprobación de Sergio.');
})();
