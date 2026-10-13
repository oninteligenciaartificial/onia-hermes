"""Focused tests for the local SQLite prototype; no network or cloud worker calls."""
from concurrent.futures import ThreadPoolExecutor
import json
from pathlib import Path
import sqlite3
import tempfile
import threading
import unittest

from sqlite_pilot import (
    CheckpointInvalid,
    CloudAdapterUnavailable,
    LeaseLost,
    SQLiteQueue,
    TaskSpec,
    dispatch_effect_once,
    official_codex_cloud_adapter,
)


class FakeAdapter:
    def __init__(self):
        self.calls = 0

    def submit(self, effect_key, payload):
        self.calls += 1
        return {"status": "unknown", "fake": True}


class SQLitePilotTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.db = Path(self.tmp.name) / "pilot.sqlite3"
        self.queue = SQLiteQueue(self.db)
        self.spec = TaskSpec(
            task_id="task-1",
            worker_id="hermes-worker",
            repo="org/repo",
            ref="codex/isolation",
            sha="a" * 40,
            contract_id="qa-2026-10-13",
            input_sha="b" * 64,
        )
        self.queue.enqueue(self.spec, now=100)

    def tearDown(self):
        self.tmp.cleanup()

    def checkpoint(self, step=2):
        return {
            "schema": 1,
            "repo": self.spec.repo,
            "ref": self.spec.ref,
            "sha": self.spec.sha,
            "contract_id": self.spec.contract_id,
            "input_sha": self.spec.input_sha,
            "step": step,
            "status": "paused",
            "evidence": {"source": "offline-test", "verified": True},
        }

    def test_competing_claims_produce_one_owner(self):
        barrier = threading.Barrier(2)

        def claim(owner):
            barrier.wait()
            return SQLiteQueue(self.db).claim("hermes-worker", owner, now=101, lease_seconds=20)

        with ThreadPoolExecutor(max_workers=2) as pool:
            results = list(pool.map(claim, ("owner-a", "owner-b")))
        self.assertEqual(sorted(result.status for result in results), ["busy", "claimed"])
        active = next(result.claim for result in results if result.claim)
        self.assertIn(active.owner_id, ("owner-a", "owner-b"))

    def test_expired_lease_fences_old_owner(self):
        first = self.queue.claim("hermes-worker", "owner-a", now=101, lease_seconds=3).claim
        second_result = self.queue.claim("hermes-worker", "owner-b", now=105, lease_seconds=10)
        self.assertEqual(second_result.status, "claimed")
        second = second_result.claim
        self.assertGreater(second.fencing_token, first.fencing_token)
        with self.assertRaises(LeaseLost):
            self.queue.save_checkpoint(first, self.checkpoint(), now=105)
        self.queue.save_checkpoint(second, self.checkpoint(), now=105)

    def test_recovery_resumes_only_integral_checkpoint(self):
        first = self.queue.claim("hermes-worker", "owner-a", now=101, lease_seconds=3).claim
        checkpoint = self.checkpoint(step=4)
        self.queue.save_checkpoint(first, checkpoint, now=102)
        resumed = SQLiteQueue(self.db).claim("hermes-worker", "owner-b", now=105, lease_seconds=10)
        self.assertEqual(resumed.status, "claimed")
        self.assertEqual(resumed.claim.checkpoint, checkpoint)

        with sqlite3.connect(self.db) as conn:
            conn.execute("UPDATE tasks SET checkpoint_digest=? WHERE task_id=?", ("0" * 64, "task-1"))
        # Release the current owner by expiry, then integrity failure blocks recovery.
        blocked = SQLiteQueue(self.db).claim("hermes-worker", "owner-c", now=116, lease_seconds=10)
        self.assertEqual(blocked.status, "blocked")
        self.assertEqual(blocked.reason, "checkpoint_integrity_failed")

    def test_ambiguous_effect_waits_for_reconciliation_without_resend(self):
        claim = self.queue.claim("hermes-worker", "owner-a", now=101, lease_seconds=5).claim
        fake = FakeAdapter()
        result = dispatch_effect_once(self.queue, claim, fake, "notify_owner", {"x": 1}, now=102)
        self.assertEqual(result.status, "needs_reconcile")
        self.assertEqual(fake.calls, 1)
        recovery = SQLiteQueue(self.db).claim("hermes-worker", "owner-b", now=103, lease_seconds=5)
        self.assertEqual(recovery.status, "needs_reconcile")
        self.assertEqual(recovery.reason, "task-1")
        with self.assertRaises(LeaseLost):
            dispatch_effect_once(self.queue, claim, fake, "notify_owner", {"x": 1}, now=103)
        self.assertEqual(fake.calls, 1)

    def test_expired_in_flight_effect_is_reconciled_before_any_new_claim(self):
        claim = self.queue.claim("hermes-worker", "owner-a", now=101, lease_seconds=3).claim
        fake = FakeAdapter()
        effect_key = self.queue.mark_effect_in_flight(claim, "notify_owner", now=102)
        fake.submit(effect_key, {"x": 1})  # Simulate process loss before receipt persistence.
        recovery = SQLiteQueue(self.db).claim("hermes-worker", "owner-b", now=105, lease_seconds=5)
        self.assertEqual(recovery.status, "needs_reconcile")
        self.assertEqual(recovery.reason, "ambiguous_external_effect")
        self.assertEqual(fake.calls, 1)

    def test_effect_key_is_stable_after_explicit_not_applied_reconciliation(self):
        first = self.queue.claim("hermes-worker", "owner-a", now=101, lease_seconds=5).claim
        fake = FakeAdapter()
        first_result = dispatch_effect_once(self.queue, first, fake, "notify_owner", {"x": 1}, now=102)
        self.queue.resolve_reconciliation("task-1", "not_applied", "test operator evidence", now=103)
        second = self.queue.claim("hermes-worker", "owner-b", now=104, lease_seconds=5).claim
        second_result = dispatch_effect_once(self.queue, second, fake, "notify_owner", {"x": 1}, now=105)
        self.assertNotEqual(first.fencing_token, second.fencing_token)
        self.assertEqual(first_result.effect_key, second_result.effect_key)

    def test_cloud_adapter_is_unavailable_without_verified_official_api(self):
        with self.assertRaises(CloudAdapterUnavailable):
            official_codex_cloud_adapter()


if __name__ == "__main__":
    unittest.main(verbosity=2)
