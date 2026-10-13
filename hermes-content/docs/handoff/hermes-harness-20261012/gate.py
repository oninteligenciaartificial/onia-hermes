"""Offline proposed harness gates. No network, trigger, scheduler or worker writes."""
import hashlib
import json
import os
from pathlib import Path


def dispatch_key(state):
    fields = [state.get(k) for k in ('worker_id', 'contract_id', 'input_sha', 'step')]
    if not all(isinstance(x, str) and x.strip() for x in fields):
        raise ValueError('missing dispatch identity')
    return hashlib.sha256(json.dumps(fields, separators=(',', ':')).encode()).hexdigest()


def effect_idempotency_key(state, effect_name):
    """Stable downstream deduplication key, scoped separately from dispatch."""
    if not isinstance(effect_name, str) or not effect_name.strip():
        raise ValueError('missing effect name')
    payload = [dispatch_key(state), effect_name.strip()]
    return hashlib.sha256(json.dumps(payload, separators=(',', ':')).encode()).hexdigest()


def evaluate(state):
    """Validate a candidate; eligible never means sent, running or completed."""
    if state.get('work_status') == 'closed':
        return 'no_work'
    if state.get('work_status') == 'blocked':
        return 'blocked_work_requires_new_prerequisite_evidence'
    if state.get('work_status') != 'pending':
        return 'unknown_work'
    if state.get('previous_work_status') == 'blocked' and not (
        state.get('unblock_verified') is True and state.get('unblock_evidence')
        and state.get('unblock_matches_recorded_blocker') is True
    ):
        return 'unblock_evidence_missing'
    if state.get('checkpoint_verified') is not True:
        return 'checkpoint_unverified'
    try:
        key = dispatch_key(state)
    except ValueError:
        return 'identity_missing'
    if state.get('snapshot_current') is not True or not state.get('snapshot_evidence'):
        return 'worker_state_unobserved'
    if state.get('worker_state') != 'idle' or state.get('active_turn_id'):
        return 'worker_busy_or_unknown'
    if state.get('reservation_present') or key in state.get('completed_keys', []):
        return 'duplicate_or_unresolved_reservation'
    if state.get('last_error') in ('NOT_FOUND', 'CloudThreadNotFoundError', '401', '403'):
        return 'external_block_no_retry'
    if type(state.get('attempts')) is not int or state['attempts'] != 0:
        return 'attempt_already_made_reconcile_before_retry'
    if state.get('quota_current') is not True or not state.get('quota_evidence'):
        return 'quota_unmeasured'
    # This consumes a sourced measurement, not a hardcoded quota allowance.
    if state.get('within_authorized_quota') is not True:
        return 'quota_limit'
    if state.get('scope_authorized') is not True or state.get('approvals_verified') is not True:
        return 'approval_missing'
    if state.get('official_trigger_verified') is not True or not state.get('trigger_evidence'):
        return 'official_trigger_unverified'
    return 'eligible_for_one_attempt'


def verify_checkpoint(checkpoint, expected):
    required = ('schema', 'repo', 'ref', 'sha', 'contract_id', 'input_sha', 'step')
    if type(expected.get('schema')) is not int or expected['schema'] != 1:
        return False
    if type(checkpoint.get('schema')) is not int:
        return False
    if not all(isinstance(expected.get(k), str) and expected[k].strip()
               for k in required if k != 'schema'):
        return False
    return all(checkpoint.get(k) == expected.get(k) for k in required)


def reserve_local(directory, state):
    """Atomic per-worker simulation lock. NOT a remote/distributed exclusion service.

    A successful caller must durably reserve in an official remote store BEFORE
    any future send. This offline fixture does not implement that integration.
    Unknown outcomes must retain reservation, even when a worker looks idle.
    """
    if evaluate(state) != 'eligible_for_one_attempt':
        return False
    identity = hashlib.sha256(state['worker_id'].encode()).hexdigest()
    target = Path(directory) / (identity + '.json')
    try:
        fd = os.open(target, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
    except FileExistsError:
        return False
    with os.fdopen(fd, 'w') as out:
        json.dump({'dispatch_key': dispatch_key(state), 'status': 'reserved'}, out)
        out.flush()
        os.fsync(out.fileno())
    return True


def receipt_state(receipt):
    if receipt.get('error') in ('NOT_FOUND', 'CloudThreadNotFoundError', '401', '403'):
        return 'external_block_reservation_retained'
    if not isinstance(receipt.get('turn_id'), str) or not receipt['turn_id'].strip() or receipt.get('canary_observed') is not True:
        return 'unconfirmed_reservation_retained'
    return 'started_not_completed'
