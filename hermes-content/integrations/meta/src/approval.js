'use strict';
// Spend brake — approval queue. Same pattern as the Agente Vendedor:
// draft -> Sergio approves -> activates. Any action that could move money
// (publish, activate, set/raise budget) must carry an approval request that
// Sergio — and only Sergio — has approved. Immutable: state transitions return
// new objects.
const crypto = require('node:crypto');

const APPROVER = 'sergio';

// Actions that require an approved request before the client will touch Meta.
const SPEND_ACTIONS = Object.freeze(['publish', 'activate', 'set_budget', 'increase_budget']);

/**
 * @param {{ action: string, payload?: object, requestedBy?: string }} input
 */
function newApprovalRequest({ action, payload, requestedBy = 'meta-ads' } = {}) {
  return {
    id: crypto.randomUUID(),
    action,
    payload: payload || {},
    requestedBy,
    approver: APPROVER,
    state: 'pending_approval',
    createdAt: new Date().toISOString(),
  };
}

/**
 * @param {object} request
 * @param {string} approver
 */
function approve(request, approver) {
  if (approver !== APPROVER) throw new Error(`only ${APPROVER} can approve spend actions`);
  return { ...request, state: 'approved', approvedBy: approver, approvedAt: new Date().toISOString() };
}

/**
 * @param {object} request
 * @param {string} approver
 * @param {string} [reason]
 */
function reject(request, approver, reason) {
  if (approver !== APPROVER) throw new Error(`only ${APPROVER} can reject spend actions`);
  return {
    ...request,
    state: 'rejected',
    rejectedBy: approver,
    reason: reason || null,
    rejectedAt: new Date().toISOString(),
  };
}

/**
 * The guard the client calls before any live activation/publish. Throws unless
 * BOTH: live===true AND an approval request approved by Sergio is present.
 * @param {{ live?: boolean, approval?: { state?: string, approvedBy?: string } | null }} input
 * @returns {true}
 */
function assertActivationAllowed({ live, approval } = {}) {
  if (live !== true) {
    throw new Error('activation blocked: live flag is not true (dry-run by default)');
  }
  if (!approval || approval.state !== 'approved' || approval.approvedBy !== APPROVER) {
    throw new Error(`activation blocked: needs a request approved by ${APPROVER}`);
  }
  return true;
}

module.exports = { newApprovalRequest, approve, reject, assertActivationAllowed, SPEND_ACTIONS, APPROVER };
