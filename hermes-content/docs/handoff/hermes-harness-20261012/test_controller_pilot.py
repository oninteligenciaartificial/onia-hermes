"""Meaningful synthetic controller flow tests; no provider, network or services."""
from dataclasses import replace
from pathlib import Path
import tempfile
import unittest

from controller_pilot import (
    MARKER, ControllerPilot, FakeReadOnlyClient, FakeSessionFactory,
    FixtureApproval, FixtureContext, Goal, approval_payload, demo, digest,
)
from sqlite_pilot import LeaseLost, SQLiteQueue


class ControllerPilotTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.queue = SQLiteQueue(Path(self.temp.name) / "queue.sqlite3")
        self.sessions = FakeSessionFactory()
        self.controller = ControllerPilot(self.queue, self.sessions)
        self.goal = Goal("goal-1", "worker-1", "onia", "SYNTHETIC: public fixture",
                         "fixture-only", 1, "fixture/repo", "codex/fixture",
                         "a" * 40, "fixture-contract")
        self.controller.enqueue(self.goal, 100)
        self.claim = self.controller.claim(self.goal, "fixture-session-0", 101).claim
        self.client = FakeReadOnlyClient()
        self.good_context = FixtureContext(103, 10, 100)

    def tearDown(self):
        self.temp.cleanup()

    def step(self, now, context=None, approval=None):
        self.claim, state = self.controller.step(
            self.goal, self.claim, now, context, self.client, approval)
        return state

    def to_approval(self):
        self.assertEqual(self.step(102), "running")
        self.assertEqual(self.step(103, self.good_context), "qa")
        self.assertEqual(self.step(104), "approval")

    def approval(self, expires=110, portfolio="onia", result=MARKER):
        return FixtureApproval("fixture-sergio", f"fixture_complete:{portfolio}",
                               approval_payload(self.goal, digest(result)), expires)

    def test_demo_completes_one_goal_with_rotation_and_no_replay(self):
        receipt = demo()
        self.assertEqual(receipt["status"], "done")
        self.assertEqual(receipt["model_calls"], 1)
        self.assertEqual(receipt["session_renewals"], 1)
        self.assertEqual(receipt["next_claim"], "no_work")
        self.assertEqual(receipt["external_dispatch"], "closed")

    def test_goal_and_client_scope_fail_before_call(self):
        with self.assertRaises(ValueError):
            self.controller.step(replace(self.goal, portfolio="lucia"),
                                 self.claim, 102, None, self.client)
        self.assertEqual(self.client.calls, 0)
        with self.assertRaises(TypeError):
            self.controller.step(self.goal, self.claim, 102, None, object())
        self.assertEqual(self.client.calls, 0)

    def test_context_unknown_holds_without_model_call(self):
        self.assertEqual(self.step(102), "running")
        self.assertEqual(self.step(103, FixtureContext(-300, 10, 100)), "held_context_unknown")
        self.assertEqual(self.step(103, FixtureContext(103, None, 100)), "held_context_unknown")
        self.assertEqual(self.step(103, FixtureContext(103, 10, None)), "held_context_unknown")
        self.assertEqual(self.step(103, FixtureContext(None, 10, 100)), "held_context_unknown")
        self.assertEqual(self.step(103, FixtureContext(True, 10, 100)), "held_context_unknown")
        self.assertEqual(self.client.calls, 0)
        self.assertEqual(self.step(104, FixtureContext(104, 10, 100)), "qa")

    def test_seventy_percent_threshold_includes_next_step_reserve(self):
        self.assertEqual(self.step(102), "running")
        self.assertEqual(self.step(103, FixtureContext(103, 54, 100)), "rotated")
        self.assertEqual(self.sessions.calls, 1)
        self.assertEqual(self.client.calls, 0)

    def test_just_below_threshold_runs_without_rotation(self):
        self.assertEqual(self.step(102), "running")
        self.assertEqual(self.step(103, FixtureContext(103, 53, 100)), "qa")
        self.assertEqual(self.sessions.calls, 0)
        self.assertEqual(self.client.calls, 1)

    def test_expired_wrong_scope_and_duplicate_approval_denied(self):
        self.to_approval()
        self.assertEqual(self.step(105, approval=self.approval(expires=104)), "held_approval")
        self.assertEqual(self.step(106, approval=self.approval(portfolio="lucia")), "held_approval")
        self.assertEqual(self.step(107, approval=replace(self.approval(), actor="other")), "held_approval")
        self.assertEqual(self.step(107, approval=self.approval(result="wrong")), "held_approval")
        self.assertEqual(self.step(107, approval=self.approval(expires=107)), "held_approval")
        self.assertEqual(self.step(107, approval=self.approval()).split(":")[0], "done")
        self.assertEqual(self.client.calls, 1)
        self.assertEqual(self.controller.claim(self.goal, "another", 108).status, "no_work")
        with self.assertRaises(LeaseLost):
            self.controller.step(self.goal, self.claim, 109, None, self.client, self.approval())

    def test_interruption_resumes_checkpoint_without_second_model_call(self):
        self.assertEqual(self.step(102), "running")
        self.assertEqual(self.step(103, self.good_context), "qa")
        resumed = self.controller.claim(self.goal, "fixture-session-new", 162)
        self.assertEqual(resumed.status, "claimed")
        self.claim = resumed.claim
        self.assertEqual(self.step(163), "approval")
        self.assertEqual(self.step(164, approval=self.approval(expires=170)).split(":")[0], "done")
        self.assertEqual(self.client.calls, 1)

    def test_ambiguous_fake_failure_halts_without_replay(self):
        self.client.fail = True
        self.assertEqual(self.step(102), "running")
        self.assertEqual(self.step(103, self.good_context), "needs_reconcile")
        self.assertEqual(self.client.calls, 1)
        self.assertEqual(self.controller.claim(self.goal, "new", 164).status, "needs_reconcile")
        self.assertEqual(self.client.calls, 1)

    def test_rotation_fences_previous_owner(self):
        self.assertEqual(self.step(102), "running")
        old = self.claim
        self.assertEqual(self.step(103, FixtureContext(103, 95, 100)), "rotated")
        self.assertNotEqual(old.owner_id, self.claim.owner_id)
        with self.assertRaises(LeaseLost):
            self.controller.step(self.goal, old, 104, self.good_context, self.client)
        self.assertEqual(self.step(104, FixtureContext(104, 10, 100)), "qa")
        self.assertEqual(self.client.calls, 1)
        with self.assertRaises(LeaseLost):
            self.controller.step(self.goal, old, 105, FixtureContext(105, 95, 100), self.client)
        self.assertEqual(self.sessions.calls, 1)
        self.assertEqual(self.client.calls, 1)

    def test_expired_owner_cannot_allocate_successor_or_run(self):
        self.assertEqual(self.step(102), "running")
        with self.assertRaises(LeaseLost):
            self.controller.step(self.goal, self.claim, 162,
                                 FixtureContext(162, 95, 100), self.client)
        self.assertEqual(self.sessions.calls, 0)
        self.assertEqual(self.client.calls, 0)

    def test_changed_source_identity_cannot_call_fake(self):
        self.assertEqual(self.step(102), "running")
        with self.assertRaises(ValueError):
            self.controller.step(replace(self.goal, repo="changed/repo"), self.claim,
                                 103, self.good_context, self.client)
        self.assertEqual(self.client.calls, 0)


if __name__ == "__main__":
    unittest.main()
