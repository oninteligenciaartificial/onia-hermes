"""Acceptance simulations, stdlib only. No real dispatcher/API/worker calls."""
import copy
import tempfile
import unittest
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from gate import dispatch_key, evaluate, receipt_state, reserve_local, verify_checkpoint


def candidate():
    return dict(worker_id='fixture-worker', contract_id='fixture-contract',
                input_sha='fixture-input', step='review', work_status='pending',
                checkpoint_verified=True, snapshot_current=True,
                snapshot_evidence='fixture-live-read', worker_state='idle',
                active_turn_id=None, reservation_present=False, completed_keys=[],
                attempts=0, quota_current=True, quota_evidence='fixture-quota-read',
                within_authorized_quota=True, scope_authorized=True,
                approvals_verified=True, official_trigger_verified=True,
                trigger_evidence='fixture-only-NOT-real-trigger')


class GateAcceptance(unittest.TestCase):
    def check_change(self, expected, **changes):
        state = candidate()
        state.update(changes)
        self.assertEqual(evaluate(state), expected)

    def test_idle_blocked_is_not_new_work(self):
        self.check_change('blocked_work_requires_new_prerequisite_evidence',
                          work_status='blocked')

    def test_closed_work_is_not_reopened(self):
        self.check_change('no_work', work_status='closed')

    def test_pending_with_all_fixture_gates_is_one_candidate(self):
        self.assertEqual(evaluate(candidate()), 'eligible_for_one_attempt')

    def test_blocked_transition_requires_matching_new_prerequisite_evidence(self):
        self.check_change('unblock_evidence_missing', previous_work_status='blocked')
        self.check_change('eligible_for_one_attempt', previous_work_status='blocked',
                          unblock_verified=True, unblock_evidence='fixture-new-proof',
                          unblock_matches_recorded_blocker=True)

    def test_string_flags_and_missing_attempt_counter_do_not_authorize(self):
        for field in ('checkpoint_verified', 'snapshot_current', 'quota_current',
                      'within_authorized_quota', 'scope_authorized',
                      'approvals_verified', 'official_trigger_verified'):
            state = candidate()
            state[field] = 'false'
            self.assertNotEqual(evaluate(state), 'eligible_for_one_attempt')
        state = candidate()
        del state['attempts']
        self.assertNotEqual(evaluate(state), 'eligible_for_one_attempt')

    def test_idle_without_fresh_evidence_is_unknown(self):
        self.check_change('worker_state_unobserved', snapshot_current=False)

    def test_active_turn_excludes_another_contract(self):
        self.check_change('worker_busy_or_unknown', active_turn_id='fixture-turn')

    def test_unknown_outcome_retains_reservation_even_if_idle(self):
        self.check_change('duplicate_or_unresolved_reservation', reservation_present=True)

    def test_completed_key_blocks_duplicate(self):
        state = candidate()
        state['completed_keys'] = [dispatch_key(state)]
        self.assertEqual(evaluate(state), 'duplicate_or_unresolved_reservation')

    def test_not_found_is_terminal_for_unchanged_evidence(self):
        self.check_change('external_block_no_retry', last_error='CloudThreadNotFoundError')

    def test_second_attempt_requires_reconciliation(self):
        self.check_change('attempt_already_made_reconcile_before_retry', attempts=1)

    def test_quota_requires_fresh_sourced_measurement(self):
        self.check_change('quota_unmeasured', quota_evidence='')
        self.check_change('quota_limit', within_authorized_quota=False)

    def test_sensitive_scope_requires_approval(self):
        self.check_change('approval_missing', approvals_verified=False)

    def test_current_official_trigger_block_holds_candidates(self):
        self.check_change('official_trigger_unverified', official_trigger_verified=False)

    def test_checkpoint_restore_keeps_exact_revision_and_step(self):
        expected = dict(schema=1, repo='fixture-repo', ref='fixture-ref',
                        sha='fixture-sha', contract_id='fixture-contract',
                        input_sha='fixture-input', step='review')
        restored = copy.deepcopy(expected)
        self.assertTrue(verify_checkpoint(restored, expected))
        for field in ('sha', 'input_sha', 'step', 'contract_id', 'schema'):
            wrong = dict(restored, **{field: 'wrong'})
            self.assertFalse(verify_checkpoint(wrong, expected))

    def test_checkpoint_with_missing_identity_or_boolean_schema_is_rejected(self):
        empty = dict(schema=1, repo='', ref='', sha='', contract_id='', input_sha='', step='')
        self.assertFalse(verify_checkpoint(empty, empty))
        self.assertFalse(verify_checkpoint({'schema': True}, {'schema': True}))

    def test_concurrent_same_worker_different_contracts_only_one_local_reservation(self):
        first = candidate()
        second = dict(first, contract_id='different-fixture-contract')
        with tempfile.TemporaryDirectory() as directory:
            with ThreadPoolExecutor(max_workers=2) as pool:
                outcomes = list(pool.map(lambda state: reserve_local(directory, state),
                                         [first, second]))
            self.assertEqual(sum(outcomes), 1)
            self.assertEqual(len(list(Path(directory).glob('*.json'))), 1)
            self.assertFalse(reserve_local(directory, first))

    def test_tool_success_without_turn_and_canary_does_not_mean_started(self):
        self.assertEqual(receipt_state({'tool_success': True}),
                         'unconfirmed_reservation_retained')
        self.assertEqual(receipt_state({'turn_id': 'fixture-turn', 'canary_observed': True}),
                         'started_not_completed')
        self.assertEqual(receipt_state({'error': 'NOT_FOUND'}),
                         'external_block_reservation_retained')
        self.assertEqual(receipt_state({'turn_id': 'fixture-turn', 'canary_observed': 'false'}),
                         'unconfirmed_reservation_retained')


if __name__ == '__main__':
    unittest.main(verbosity=2)
