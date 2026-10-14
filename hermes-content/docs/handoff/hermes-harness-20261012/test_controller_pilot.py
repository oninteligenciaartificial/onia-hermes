"""Synthetic controller and authorization-guard tests; no external IO."""
from concurrent.futures import ThreadPoolExecutor
from dataclasses import replace
from pathlib import Path
import tempfile
import threading
import unittest

from controller_pilot import (
    CONTRACT_VERSION, FIXTURE_ACTOR, FIXTURE_BOT, FIXTURE_CHANNEL, FIXTURE_CHAT,
    MARKER, ControllerPilot, FakeReadOnlyClient, FakeSessionFactory,
    FixtureAdmissionSnapshot, FixtureContext, Goal, SimulatedProcessCrash,
    demo, digest, make_fixture_grant, make_stop_grant,
)
from sqlite_pilot import LeaseLost, SQLiteQueue


class ControllerPilotTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.queue = SQLiteQueue(Path(self.temp.name) / "queue.sqlite3")
        self.sessions = FakeSessionFactory()
        self.admission = FixtureAdmissionSnapshot(
            "fixture-only", 100, "known", "known", "known", "known", 1)
        self.controller = ControllerPilot(self.queue, self.sessions, self.admission)
        self.goal = Goal("goal-1", "worker-1", "onia", "SYNTHETIC: public fixture",
                         "fixture-only", 1, "fixture/repo", "codex/fixture",
                         "a" * 40, "fixture-contract")
        self.controller.enqueue(self.goal, 100)
        self.claim = self.controller.claim(self.goal, "fixture-session-0", 101).claim
        self.client = FakeReadOnlyClient()
        self.sample_counter = 0
        self.nonce_counter = 0

    def tearDown(self):
        self.temp.cleanup()

    def context(self, now, used=10, window=100, claim=None, sample_id=None, **changes):
        claim = claim or self.claim
        self.sample_counter += 1
        context = FixtureContext(
            now, used, window,
            sample_id=(sample_id if sample_id is not None else f"sample-{self.sample_counter}"),
            owner_id=claim.owner_id, fencing_token=claim.fencing_token,
        )
        return replace(context, **changes) if changes else context

    def grant(self, action, now, goal=None, nonce=None, result_sha=None, **changes):
        goal = goal or self.goal
        self.nonce_counter += 1
        grant = make_fixture_grant(
            goal, action, now, nonce or f"nonce-{self.nonce_counter}", result_sha)
        return replace(grant, **changes) if changes else grant

    def step(self, now, context=None, approval=None, client=None, run_grant=None):
        client = client or self.client
        if run_grant is None:
            run_grant = self.grant("run", now)
        self.claim, state = self.controller.step(
            self.goal, self.claim, now, context, client,
            approval=approval, run_grant=run_grant)
        return state

    def start(self, now=102):
        self.assertEqual(self.step(now), "running")

    def run_once(self, now=103, used=10, client=None):
        context = self.context(now, used=used)
        return self.step(now, context, client=client)

    def to_approval(self):
        self.start(102)
        self.assertEqual(self.run_once(103), "qa")
        self.assertEqual(self.step(104), "approval")

    def completion(self, now=110, **changes):
        result_sha = changes.pop("result_sha", digest(MARKER))
        return self.grant("complete", now, result_sha=result_sha, **changes)

    def test_demo_completes_one_goal_with_rotation_and_no_replay(self):
        receipt = demo()
        self.assertEqual(receipt["status"], "done")
        self.assertEqual(receipt["model_calls"], 1)
        self.assertEqual(receipt["session_renewals"], 1)
        self.assertEqual(receipt["next_claim"], "no_work")
        self.assertEqual(receipt["external_dispatch"], "closed")

    def test_goal_and_client_scope_fail_before_call(self):
        self.start(102)
        with self.assertRaises(ValueError):
            self.controller.step(replace(self.goal, portfolio="lucia"),
                                 self.claim, 103, self.context(103), self.client,
                                 run_grant=self.grant("run", 103))
        self.assertEqual(self.client.calls, 0)
        with self.assertRaises(TypeError):
            self.controller.step(self.goal, self.claim, 103, self.context(103),
                                 object(), run_grant=self.grant("run", 103))
        self.assertEqual(self.client.calls, 0)

    def test_context_unknown_holds_without_fake_call(self):
        self.start(102)
        for bad in (
            self.context(103, observed_at=-300),
            self.context(103, used=None),
            self.context(103, window=None),
            self.context(103, observed_at=True),
            self.context(103, used=True),
            self.context(103, window=0),
            self.context(103, used=101),
            self.context(103, sample_id=""),
            self.context(103, owner_id="another-session"),
            self.context(103, fencing_token=True),
        ):
            self.assertEqual(self.step(103, bad), "held_context_unknown", repr(bad))
        self.assertEqual(self.client.calls, 0)
        self.assertEqual(self.run_once(104), "qa")

    def test_seventy_percent_threshold_includes_next_step_reserve(self):
        self.start(102)
        self.assertEqual(self.run_once(103, used=54), "rotated")
        self.assertEqual(self.sessions.calls, 1)
        self.assertEqual(self.client.calls, 0)

    def test_just_below_threshold_runs_without_rotation(self):
        self.start(102)
        self.client.observe_queue = self.queue
        self.client.observe_task_id = self.goal.task_id
        self.assertEqual(self.run_once(103, used=53), "qa")
        self.assertEqual(self.sessions.calls, 0)
        self.assertEqual(self.client.calls, 1)
        self.assertTrue(self.client.saw_reserved_attempt)
        with self.queue._connection() as conn:
            admission = conn.execute(
                "SELECT state FROM controller_admissions WHERE task_id=?",
                (self.goal.task_id,),
            ).fetchone()
            task = conn.execute(
                "SELECT effect_state FROM tasks WHERE task_id=?",
                (self.goal.task_id,),
            ).fetchone()
        self.assertEqual(admission["state"], "consumed")
        self.assertEqual(task["effect_state"], "applied")

    def test_expired_wrong_scope_and_duplicate_approval_denied(self):
        self.to_approval()
        self.assertEqual(self.step(
            105, approval=self.completion(105, expires_at=104)), "held_approval")
        self.assertEqual(self.step(
            106, approval=self.completion(106, portfolio="lucia")), "held_approval")
        self.assertEqual(self.step(
            107, approval=self.completion(107, actor="other")), "held_approval")
        self.assertEqual(self.step(
            107, approval=self.completion(107, result_sha=digest("wrong"))), "held_approval")
        self.assertEqual(self.step(
            107, approval=self.completion(107, expires_at=107)), "held_approval")
        state = self.step(108, approval=self.completion(108))
        self.assertTrue(state.startswith("done:"))
        self.assertEqual(self.client.calls, 1)
        self.assertEqual(self.controller.claim(self.goal, "another", 109).status, "no_work")
        with self.assertRaises(LeaseLost):
            self.controller.step(self.goal, self.claim, 110, None, self.client,
                                 self.completion(110))

    def test_interruption_resumes_checkpoint_without_second_fake_call(self):
        self.start(102)
        self.assertEqual(self.run_once(103), "qa")
        resumed = self.controller.claim(self.goal, "fixture-session-new", 162)
        self.assertEqual(resumed.status, "claimed")
        self.claim = resumed.claim
        self.assertEqual(self.step(163), "approval")
        self.assertTrue(self.step(164, approval=self.completion(164)).startswith("done:"))
        self.assertEqual(self.client.calls, 1)

    def test_ambiguous_fake_failure_halts_without_replay(self):
        self.client.fail = True
        self.start(102)
        self.assertEqual(self.run_once(103), "needs_reconcile")
        self.assertEqual(self.client.calls, 1)
        self.assertEqual(self.controller.claim(self.goal, "new", 164).status,
                         "needs_reconcile")
        self.assertEqual(self.client.calls, 1)

    def test_rotation_fences_previous_owner(self):
        self.start(102)
        old = self.claim
        self.assertEqual(self.run_once(103, used=95), "rotated")
        self.assertNotEqual(old.owner_id, self.claim.owner_id)
        with self.assertRaises(LeaseLost):
            self.controller.step(self.goal, old, 104, self.context(104, 10, claim=old),
                                 self.client, run_grant=self.grant("run", 104))
        self.assertEqual(self.run_once(104), "qa")
        self.assertEqual(self.client.calls, 1)
        with self.assertRaises(LeaseLost):
            self.controller.step(self.goal, old, 105, self.context(105, 95, claim=old),
                                 self.client, run_grant=self.grant("run", 105))
        self.assertEqual(self.sessions.calls, 1)
        self.assertEqual(self.client.calls, 1)

    def test_expired_owner_cannot_allocate_successor_or_run(self):
        self.start(102)
        with self.assertRaises(LeaseLost):
            self.controller.step(self.goal, self.claim, 162,
                                 self.context(162, 95), self.client,
                                 run_grant=self.grant("run", 162))
        self.assertEqual(self.sessions.calls, 0)
        self.assertEqual(self.client.calls, 0)

    def test_changed_source_identity_cannot_call_fake(self):
        self.start(102)
        with self.assertRaises(ValueError):
            self.controller.step(replace(self.goal, repo="changed/repo"), self.claim,
                                 103, self.context(103), self.client,
                                 run_grant=self.grant("run", 103))
        self.assertEqual(self.client.calls, 0)

    def test_stale_checkpoint_cannot_replay_fake_effect(self):
        self.start(102)
        stale = self.claim
        self.assertEqual(self.run_once(103), "qa")
        with self.assertRaisesRegex(ValueError, "stale"):
            self.controller.step(self.goal, stale, 104, self.context(104, claim=stale),
                                 self.client, run_grant=self.grant("run", 104))
        self.assertEqual(self.client.calls, 1)

    def test_forged_approval_stage_cannot_complete_durable_running_task(self):
        self.start(102)
        forged_cp = {
            "schema": 1, "repo": self.goal.repo, "ref": self.goal.ref,
            "sha": self.goal.sha, "contract_id": self.goal.contract_id,
            "input_sha": self.goal.input_sha(), "step": "approval",
            "status": "running",
            "evidence": {"result": MARKER, "result_sha": digest(MARKER), "qa": "pass"},
        }
        forged_claim = replace(self.claim, checkpoint=forged_cp)
        with self.assertRaisesRegex(ValueError, "forged"):
            self.controller.step(self.goal, forged_claim, 103, None, self.client,
                                 approval=self.completion(103))
        self.assertIsNone(self.queue.read_result(self.goal.task_id))
        self.assertEqual(self.client.calls, 0)

    def test_forged_wrong_result_approval_cannot_complete(self):
        self.to_approval()
        forged = self.completion(105, result_sha=digest("caller-invented-result"))
        self.assertEqual(self.step(105, approval=forged), "held_approval")
        self.assertIsNone(self.queue.read_result(self.goal.task_id))
        self.assertEqual(self.client.calls, 1)

    def test_crash_after_fake_before_checkpoint_requires_reconciliation(self):
        self.start(102)
        crash_client = FakeReadOnlyClient(crash_after_call=True)
        with self.assertRaises(SimulatedProcessCrash):
            self.step(103, self.context(103), client=crash_client)
        self.assertEqual(crash_client.calls, 1)
        with self.queue._connection() as conn:
            durable = conn.execute(
                "SELECT t.effect_state,a.state FROM tasks t "
                "JOIN controller_admissions a ON a.task_id=t.task_id WHERE t.task_id=?",
                (self.goal.task_id,),
            ).fetchone()
        self.assertEqual((durable["effect_state"], durable["state"]),
                         ("in_flight", "reserved"))
        resumed = self.controller.claim(self.goal, "new-owner", 162)
        self.assertEqual(resumed.status, "needs_reconcile")
        self.assertEqual(crash_client.calls, 1)

    def test_context_sample_is_owner_bound_and_consumed_once(self):
        self.start(102)
        high = self.context(103, used=95, sample_id="sample-once")
        old = self.claim
        self.assertEqual(self.step(103, high), "rotated")
        self.assertEqual(self.sessions.calls, 1)
        # Old owner's same sample is invalid for the successor.
        self.assertEqual(self.step(104, high), "held_context_unknown")
        replay = replace(high, observed_at=104, owner_id=self.claim.owner_id,
                         fencing_token=self.claim.fencing_token)
        self.assertEqual(self.step(104, replay), "held_context_replayed")
        self.assertEqual(self.sessions.calls, 1)
        self.assertEqual(self.client.calls, 0)
        self.assertNotEqual(old.owner_id, self.claim.owner_id)

    def test_rotation_limit_is_finite_even_with_fresh_high_samples(self):
        self.start(102)
        self.assertEqual(self.run_once(103, used=95), "rotated")
        self.assertEqual(self.run_once(104, used=95), "held_rotation_limit")
        self.assertEqual(self.sessions.calls, 1)
        self.assertEqual(self.client.calls, 0)

    def test_unknown_quota_cost_or_retry_capacity_holds_before_reservation(self):
        self.start(102)
        for field in ("quota_status", "cost_status", "retry_cap_status",
                      "tool_policy_status"):
            with self.subTest(field=field):
                self.controller.admission = replace(self.admission, **{field: "unknown"})
                self.assertEqual(self.step(103, self.context(103)), "held_admission_unknown")
        self.controller.admission = replace(self.admission, observed_at=-300)
        self.assertEqual(self.step(103, self.context(103)), "held_admission_unknown")
        with self.queue._connection() as conn:
            self.assertEqual(conn.execute(
                "SELECT COUNT(*) FROM controller_admissions").fetchone()[0], 0)
        self.assertEqual(self.client.calls, 0)

    def test_run_grant_binds_actor_chat_bot_channel_hash_version_and_ttl(self):
        self.start(102)
        base = self.grant("run", 103)
        invalid = (
            replace(base, actor="attacker"),
            replace(base, bot_id="wrong-bot"),
            replace(base, chat_id="wrong-chat"),
            replace(base, channel_id="wrong-channel"),
            replace(base, contract_version=CONTRACT_VERSION + 1),
            replace(base, transport_verified=False),
            replace(base, payload_sha=digest("wrong")),
            replace(base, expires_at=103),
            replace(base, issued_at=104, expires_at=105),
            replace(base, issued_at=103, expires_at=103 + 301),
        )
        for grant in invalid:
            with self.subTest(grant=grant):
                self.assertEqual(self.step(103, self.context(103), run_grant=grant),
                                 "held_authorization")
        self.assertEqual(self.client.calls, 0)

    def test_run_grant_nonce_cannot_be_replayed_across_goals(self):
        self.start(102)
        grant = self.grant("run", 103, nonce="shared-run-nonce")
        self.assertEqual(self.step(103, self.context(103), run_grant=grant), "qa")
        second = replace(self.goal, task_id="goal-2", worker_id="worker-2",
                         portfolio="marca")
        self.controller.enqueue(second, 104)
        second_claim = self.controller.claim(second, "fixture-second", 105).claim
        second_claim, init = self.controller.step(
            second, second_claim, 105, None, FakeReadOnlyClient())
        self.assertEqual(init, "running")
        self.assertEqual(self.controller.step(second, second_claim, 106,
                                              self.context(106, claim=second_claim),
                                              FakeReadOnlyClient(),
                                              run_grant=self.grant(
                                                  "run", 106, goal=second,
                                                  nonce="shared-run-nonce"))[1],
                         "held_authorization_replay")
        self.assertEqual(self.client.calls, 1)

    def test_consumed_nonce_cannot_authorize_high_context_rotation_for_other_goal(self):
        self.start(102)
        grant = self.grant("run", 103, nonce="shared-high-nonce")
        self.assertEqual(self.step(103, self.context(103, used=80),
                                   run_grant=grant), "rotated")
        sessions_before = self.sessions.calls
        result = self.controller.step(
            self.goal, self.claim, 104,
            self.context(104, used=80, sample_id="second-high-sample"),
            self.client, run_grant=grant,
        )
        self.assertEqual(result[1], "held_authorization_replay")
        self.assertEqual(self.sessions.calls, sessions_before)

    def test_aggregate_budget_blocks_high_context_rotation_before_session(self):
        self.start(102)
        self.assertEqual(self.run_once(103), "qa")
        second = replace(self.goal, task_id="goal-2", worker_id="worker-2",
                         portfolio="marca")
        self.controller.enqueue(second, 104)
        second_claim = self.controller.claim(second, "fixture-second", 105).claim
        second_claim, init = self.controller.step(
            second, second_claim, 105, None, FakeReadOnlyClient())
        self.assertEqual(init, "running")
        local_sessions = FakeSessionFactory()
        local = ControllerPilot(self.queue, local_sessions, self.admission)
        result = local.step(
            second, second_claim, 106,
            self.context(106, used=80, claim=second_claim),
            FakeReadOnlyClient(), run_grant=self.grant("run", 106, goal=second),
        )
        self.assertEqual(result[1], "held_aggregate_budget")
        self.assertEqual(local_sessions.calls, 0)

    def test_rotation_reserves_shared_budget_before_successor_allocation(self):
        self.start(102)
        self.assertEqual(self.run_once(103, used=80), "rotated")
        self.assertEqual(self.sessions.calls, 1)
        with self.queue._connection() as conn:
            reservation = conn.execute(
                "SELECT state,account_scope,sample_id FROM controller_rotations WHERE task_id=?",
                (self.goal.task_id,),
            ).fetchone()
        self.assertEqual(reservation["state"], "reserved")
        self.assertEqual(reservation["account_scope"], self.goal.account_scope)
        self.assertEqual(reservation["sample_id"], "sample-1")

    def test_global_rotation_budget_blocks_fanout_before_successor(self):
        first = self.goal
        second = replace(self.goal, task_id="goal-2", worker_id="worker-2",
                         portfolio="marca")
        self.start(102)
        self.controller.enqueue(second, 103)
        first_claim = self.claim
        second_claim = self.controller.claim(second, "fixture-second", 104).claim
        second_claim, init = self.controller.step(
            second, second_claim, 104, None, FakeReadOnlyClient())
        self.assertEqual(init, "running")
        self.assertEqual(self.controller.step(
            first, first_claim, 105, self.context(105, used=80), self.client,
            run_grant=self.grant("run", 105, nonce="rotation-budget-first"))[1],
            "rotated")
        second_context = self.context(106, used=80, claim=second_claim,
                                      sample_id="high-second")
        result = self.controller.step(
            second, second_claim, 106, second_context, FakeReadOnlyClient(),
            run_grant=self.grant("run", 106, goal=second,
                                 nonce="rotation-budget-second"))
        self.assertEqual(result[1], "held_rotation_budget")
        with self.queue._connection() as conn:
            count = conn.execute(
                "SELECT COUNT(*) FROM controller_rotations WHERE account_scope=?",
                (self.goal.account_scope,),
            ).fetchone()[0]
        self.assertEqual(count, 1)

    def test_claim_stop_race_does_not_return_claimed_result(self):
        pending = replace(self.goal, task_id="goal-pending", worker_id="worker-pending")
        self.controller.enqueue(pending, 102)
        original_claim = self.queue.claim

        def stop_after_core_claim(worker_id, owner_id, now, lease_seconds=60):
            result = original_claim(worker_id, owner_id, now, lease_seconds)
            self.assertEqual(result.status, "claimed")
            self.assertEqual(
                self.controller.stop(make_stop_grant(now, "claim-race-stop"), now),
                "stopped_fixture_admission",
            )
            return result

        self.queue.claim = stop_after_core_claim
        result = self.controller.claim(pending, "race-owner", 102)
        self.assertEqual(result.status, "blocked")
        with self.queue._connection() as conn:
            leases = conn.execute(
                "SELECT COUNT(*) FROM worker_leases WHERE worker_id=? AND owner_id=?",
                (pending.worker_id, "race-owner"),
            ).fetchone()[0]
            task_status = conn.execute(
                "SELECT status FROM tasks WHERE task_id=?", (pending.task_id,)
            ).fetchone()[0]
        self.assertEqual(leases, 0)
        self.assertEqual(task_status, "blocked")

    def test_stop_before_core_claim_does_not_leave_running_task_or_lease(self):
        pending = replace(self.goal, task_id="goal-pending", worker_id="worker-pending")
        self.controller.enqueue(pending, 102)
        original_claim = self.queue.claim

        def stop_before_core_claim(worker_id, owner_id, now, lease_seconds=60):
            self.assertEqual(
                self.controller.stop(make_stop_grant(now, "stop-before-claim"), now),
                "stopped_fixture_admission",
            )
            return original_claim(worker_id, owner_id, now, lease_seconds)

        self.queue.claim = stop_before_core_claim
        result = self.controller.claim(pending, "race-owner", 102)
        self.assertEqual(result.status, "blocked")
        with self.queue._connection() as conn:
            leases = conn.execute(
                "SELECT COUNT(*) FROM worker_leases WHERE worker_id=? AND owner_id=?",
                (pending.worker_id, "race-owner"),
            ).fetchone()[0]
            task_status = conn.execute(
                "SELECT status FROM tasks WHERE task_id=?", (pending.task_id,)
            ).fetchone()[0]
        self.assertEqual(leases, 0)
        self.assertEqual(task_status, "blocked")

    def test_aggregate_budget_caps_fanout_across_portfolios(self):
        self.start(102)
        self.assertEqual(self.run_once(103), "qa")
        second = replace(self.goal, task_id="goal-2", worker_id="worker-2",
                         portfolio="marca")
        self.controller.enqueue(second, 104)
        second_claim = self.controller.claim(second, "fixture-second", 105).claim
        second_claim, init = self.controller.step(
            second, second_claim, 105, None, FakeReadOnlyClient())
        self.assertEqual(init, "running")
        second_client = FakeReadOnlyClient()
        result = self.controller.step(second, second_claim, 106,
                                      self.context(106, claim=second_claim),
                                      second_client,
                                      run_grant=self.grant("run", 106, goal=second))
        self.assertEqual(result[1], "held_aggregate_budget")
        self.assertEqual(self.client.calls, 1)
        self.assertEqual(second_client.calls, 0)

    def test_concurrent_goals_share_one_atomic_budget_reservation(self):
        goals = [
            self.goal,
            replace(self.goal, task_id="goal-2", worker_id="worker-2",
                    portfolio="marca"),
        ]
        self.controller.enqueue(goals[1], 102)
        claims = [
            self.claim,
            self.controller.claim(goals[1], "fixture-second", 103).claim,
        ]
        clients = [FakeReadOnlyClient(), FakeReadOnlyClient()]
        barrier = threading.Barrier(2)

        def run(index):
            goal, claim, client = goals[index], claims[index], clients[index]
            local = ControllerPilot(self.queue, FakeSessionFactory(), self.admission)
            local_claim, initialized = local.step(goal, claim, 104, None, client)
            self.assertEqual(initialized, "running")
            context = self.context(105, claim=local_claim,
                                   sample_id=f"concurrent-{index}")
            grant = self.grant("run", 105, goal=goal, nonce=f"concurrent-nonce-{index}")
            barrier.wait(timeout=3)
            return local.step(goal, local_claim, 105, context, client,
                              run_grant=grant)[1]

        with ThreadPoolExecutor(max_workers=2) as pool:
            states = list(pool.map(run, range(2)))
        self.assertEqual(states.count("qa"), 1)
        self.assertIn("held_aggregate_budget", states)
        self.assertEqual(sum(client.calls for client in clients), 1)

    def test_stop_blocks_admission_and_does_not_claim_to_cancel_inflight(self):
        self.start(102)
        self.assertEqual(self.controller.stop(make_stop_grant(103, "stop-1"), 103),
                         "stopped_fixture_admission")
        self.assertEqual(self.step(104, self.context(104)), "stopped")
        self.assertEqual(self.controller.claim(self.goal, "new-owner", 105).status,
                         "blocked")
        with self.queue._connection() as conn:
            task = conn.execute(
                "SELECT status FROM tasks WHERE task_id=?", (self.goal.task_id,)
            ).fetchone()
            leases = conn.execute(
                "SELECT COUNT(*) FROM worker_leases WHERE task_id=?", (self.goal.task_id,)
            ).fetchone()[0]
        self.assertEqual(task["status"], "blocked")
        self.assertEqual(leases, 0)
        self.assertEqual(self.client.calls, 0)

    def test_stop_during_fake_effect_holds_ambiguous_outcome(self):
        self.start(102)
        self.client.stop_during_call = (
            self.controller, make_stop_grant(103, "stop-during-call"), 103)
        self.assertEqual(self.run_once(103), "needs_reconcile")
        self.assertEqual(self.client.calls, 1)
        self.assertEqual(self.controller.claim(self.goal, "new-owner", 162).status,
                         "blocked")
        with self.queue._connection() as conn:
            row = conn.execute("SELECT status,effect_state FROM tasks WHERE task_id=?",
                               (self.goal.task_id,)).fetchone()
        self.assertEqual((row["status"], row["effect_state"]),
                         ("needs_reconcile", "needs_reconcile"))

    def test_stop_nonce_is_single_use(self):
        grant = make_stop_grant(102, "stop-replay")
        self.assertEqual(self.controller.stop(grant, 102), "stopped_fixture_admission")
        self.assertEqual(self.controller.stop(grant, 103), "held_stop_replay")


if __name__ == "__main__":
    unittest.main()
