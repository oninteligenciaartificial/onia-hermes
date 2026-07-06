'use strict';
const assert = require('node:assert');
const { test, summary } = require('./_harness');
const { newApprovalRequest, approve, reject, assertActivationAllowed, SPEND_ACTIONS } = require('../src/approval');

test('new request starts pending and targets sergio', () => {
  const r = newApprovalRequest({ action: 'activate', payload: { campaign: 'C' }, requestedBy: 'meta-ads' });
  assert.strictEqual(r.state, 'pending_approval');
  assert.strictEqual(r.approver, 'sergio');
  assert.ok(r.id);
});

test('spend actions include the money-moving verbs', () => {
  assert.ok(SPEND_ACTIONS.includes('activate'));
  assert.ok(SPEND_ACTIONS.includes('set_budget'));
  assert.ok(SPEND_ACTIONS.includes('increase_budget'));
  assert.ok(SPEND_ACTIONS.includes('publish'));
});

test('approve only by sergio produces approved state', () => {
  const ok = approve(newApprovalRequest({ action: 'activate', payload: {} }), 'sergio');
  assert.strictEqual(ok.state, 'approved');
  assert.strictEqual(ok.approvedBy, 'sergio');
});

test('approve refuses non-sergio approver', () => {
  assert.throws(() => approve(newApprovalRequest({ action: 'activate', payload: {} }), 'someone-else'), /sergio/i);
});

test('reject sets rejected state with reason', () => {
  const r = reject(newApprovalRequest({ action: 'activate', payload: {} }), 'sergio', 'no budget yet');
  assert.strictEqual(r.state, 'rejected');
  assert.strictEqual(r.reason, 'no budget yet');
});

test('activation blocked unless live AND approved by sergio', () => {
  assert.throws(() => assertActivationAllowed({ live: true, approval: null }), /approv/i);
  assert.throws(() => assertActivationAllowed({ live: false, approval: { state: 'approved', approvedBy: 'sergio' } }), /live/i);
  assert.throws(() => assertActivationAllowed({ live: true, approval: { state: 'pending_approval' } }), /approv/i);
  assert.strictEqual(assertActivationAllowed({ live: true, approval: { state: 'approved', approvedBy: 'sergio' } }), true);
});

test('immutability: approve returns a new object, original unchanged', () => {
  const r = newApprovalRequest({ action: 'activate', payload: {} });
  approve(r, 'sergio');
  assert.strictEqual(r.state, 'pending_approval');
});

summary('approval');
