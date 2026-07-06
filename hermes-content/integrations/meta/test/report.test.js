'use strict';
const assert = require('node:assert');
const { test, summary } = require('./_harness');
const { summarizeInsights, formatReport, extractLeads } = require('../src/report');

const SAMPLE = {
  data: [
    { impressions: '1000', clicks: '50', spend: '10.00', actions: [{ action_type: 'lead', value: '5' }] },
    { impressions: '2000', clicks: '80', spend: '20.00', actions: [{ action_type: 'onsite_conversion.lead_grouped', value: '3' }] },
  ],
};

test('aggregates impressions, clicks, spend and leads across rows', () => {
  const s = summarizeInsights(SAMPLE);
  assert.strictEqual(s.impressions, 3000);
  assert.strictEqual(s.clicks, 130);
  assert.strictEqual(s.spend, 30);
  assert.strictEqual(s.leads, 8);
});

test('computes CTR, CPL, CPC', () => {
  const s = summarizeInsights(SAMPLE);
  assert.ok(Math.abs(s.ctr - 130 / 3000) < 1e-9);
  assert.ok(Math.abs(s.cpl - 30 / 8) < 1e-9);
  assert.ok(Math.abs(s.cpc - 30 / 130) < 1e-9);
});

test('empty data -> zeros, no division by zero (cpl/cpc null)', () => {
  const s = summarizeInsights({ data: [] });
  assert.strictEqual(s.impressions, 0);
  assert.strictEqual(s.ctr, 0);
  assert.strictEqual(s.cpl, null);
  assert.strictEqual(s.cpc, null);
});

test('handles a missing/undefined response gracefully', () => {
  const s = summarizeInsights(undefined);
  assert.strictEqual(s.rows, 0);
});

test('extractLeads sums only lead action types', () => {
  assert.strictEqual(extractLeads([{ action_type: 'lead', value: '2' }, { action_type: 'link_click', value: '9' }]), 2);
});

test('formatReport renders markdown with currency and percentages', () => {
  const md = formatReport(summarizeInsights(SAMPLE), { currency: 'Bs', title: 'Semana 1' });
  assert.ok(md.includes('Semana 1'));
  assert.ok(md.includes('Bs '));
  assert.ok(md.includes('%'));
});

summary('report');
