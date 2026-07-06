'use strict';
// DRY-RUN demo — proves the engine builds a full campaign DRAFT without touching
// Meta and without spending. No credentials needed. Run:
//   node examples/dry-run-demo.js
const path = require('node:path');
const fs = require('node:fs');
const { mapCreativeToAdPlan } = require('../src/creative-map');
const { MarketingApiClient } = require('../src/client');
const { generatePixelBaseCode, newEventId, generateBrowserTrackCall } = require('../src/pixel');

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

  console.log('\n✔ Nothing was published. Zero spend. Activar = solo con aprobación de Sergio.');
})();
