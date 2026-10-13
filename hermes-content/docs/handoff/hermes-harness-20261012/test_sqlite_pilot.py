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
    ExternalDispatchGate,
    HandoffSpec,
    LeaseLost,
    OfflineEffectFixture,
    QuiescenceEvidence,
    SQLiteQueue,
    TaskSpec,
    dispatch_effect_once,
    context_rotation_decision,
    official_codex_cloud_adapter,
)


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

    def test_concurrent_initializers_migrate_v1_schema_once(self):
        migration_db = Path(self.tmp.name) / "legacy-v1.sqlite3"
        with sqlite3.connect(migration_db) as conn:
            conn.execute(
                "CREATE TABLE tasks (task_id TEXT PRIMARY KEY, worker_id TEXT NOT NULL, "
                "status TEXT NOT NULL, created_at INTEGER NOT NULL)"
            )
            conn.execute("PRAGMA user_version=1")

        barrier = threading.Barrier(2)

        def initialize():
            barrier.wait()
            return SQLiteQueue(migration_db)

        with ThreadPoolExecutor(max_workers=2) as pool:
            queues = list(pool.map(lambda _: initialize(), range(2)))
        self.assertEqual(len(queues), 2)
        with sqlite3.connect(migration_db) as conn:
            self.assertEqual(conn.execute("PRAGMA user_version").fetchone()[0], 3)
            columns = {row[1] for row in conn.execute("PRAGMA table_info(tasks)")}
            handoff_table = conn.execute(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='handoffs'"
            ).fetchone()
        self.assertIn("ambiguous_owner_id", columns)
        self.assertIn("ambiguous_fencing_token", columns)
        self.assertIsNotNone(handoff_table)

    def test_intake_recovery_handoff_ack_and_evidenced_completion(self):
        first = self.queue.claim("hermes-worker", "owner-a", now=101, lease_seconds=3).claim
        checkpoint = self.checkpoint(step="review")
        self.queue.save_checkpoint(first, checkpoint, now=102)
        recovered = SQLiteQueue(self.db).claim(
            "hermes-worker", "owner-b", now=105, lease_seconds=20
        ).claim
        self.assertEqual(recovered.checkpoint, checkpoint)
        spec = HandoffSpec(
            successor_owner_id="owner-c",
            objective="finish bounded QA",
            gates=("no external dispatch",),
            evidence_refs=("repo:review-artifact",),
            next_action="record result",
            cursor="step:review",
            model_configured="gpt-6-sol medium",
            model_observed="UNKNOWN",
        )
        packet = self.queue.prepare_handoff(recovered, spec, now=106)
        self.assertEqual(packet.payload["context_state"], "UNKNOWN")
        self.assertEqual(packet.payload["sha"], self.spec.sha)
        self.assertEqual(SQLiteQueue(self.db).read_handoff(packet.handoff_id).digest, packet.digest)
        self.assertEqual(self.queue.claim("hermes-worker", "owner-c", 107, 10).status, "blocked")
        with self.assertRaises(LeaseLost):
            self.queue.save_checkpoint(recovered, checkpoint, now=107)
        with self.assertRaisesRegex(RuntimeError, "ACK is required"):
            self.queue.activate_handoff(packet.handoff_id, "owner-c", now=107, lease_seconds=10)
        with self.assertRaises(CheckpointInvalid):
            self.queue.acknowledge_handoff(
                packet.handoff_id, "owner-c", "0" * 64, self.spec.sha, "offline-ack", now=107
            )
        self.queue.acknowledge_handoff(
            packet.handoff_id, "owner-c", packet.digest, self.spec.sha, "offline-ack", now=107
        )
        successor = SQLiteQueue(self.db).activate_handoff(
            packet.handoff_id, "owner-c", now=108, lease_seconds=10
        )
        self.assertGreater(successor.fencing_token, recovered.fencing_token)
        self.assertEqual(successor.checkpoint, checkpoint)
        self.assertEqual(self.queue.read_handoff(packet.handoff_id).status, "archived")
        with self.assertRaises(LeaseLost):
            self.queue.complete_with_result(recovered, 109, "pass", "repo:review-artifact")
        self.queue.archive_previous(packet.handoff_id, successor, now=109)
        digest = self.queue.complete_with_result(
            successor, now=110, result="pass", evidence_ref="repo:review-artifact"
        )
        receipt = SQLiteQueue(self.db).read_result("task-1")
        self.assertEqual(receipt["digest"], digest)
        self.assertEqual(receipt["owner_id"], "owner-c")
        self.assertEqual(self.queue.claim("hermes-worker", "owner-d", 111, 10).status, "no_work")

    def test_successor_crash_after_activation_can_recover_and_complete(self):
        first = self.queue.claim("hermes-worker", "owner-a", now=101, lease_seconds=10).claim
        self.queue.save_checkpoint(first, self.checkpoint(step="review"), now=102)
        spec = HandoffSpec(
            successor_owner_id="owner-b", objective="finish QA", gates=("offline",),
            evidence_refs=("repo:qa",), next_action="record result", cursor="review",
            model_configured="gpt-6-sol medium", model_observed="UNKNOWN",
        )
        packet = self.queue.prepare_handoff(first, spec, now=103)
        self.queue.acknowledge_handoff(
            packet.handoff_id, "owner-b", packet.digest, self.spec.sha, "offline-ack", now=104
        )
        successor = self.queue.activate_handoff(
            packet.handoff_id, "owner-b", now=105, lease_seconds=2
        )
        self.assertEqual(self.queue.read_handoff(packet.handoff_id).status, "archived")
        recovered = SQLiteQueue(self.db).claim(
            "hermes-worker", "owner-c", now=108, lease_seconds=10
        ).claim
        self.assertGreater(recovered.fencing_token, successor.fencing_token)
        SQLiteQueue(self.db).complete_with_result(
            recovered, now=109, result="pass", evidence_ref="repo:qa"
        )
        self.assertEqual(self.queue.read_result("task-1")["owner_id"], "owner-c")

    def test_context_rotation_uses_only_measured_active_context(self):
        self.assertEqual(context_rotation_decision(None, 500000, 30000), "UNKNOWN")
        self.assertEqual(context_rotation_decision(350000, 400000, 30000), "continue")
        self.assertEqual(context_rotation_decision(375000, 400000, 30000), "alert_review")
        self.assertEqual(context_rotation_decision(465000, 600000, 30000), "continue")
        self.assertEqual(context_rotation_decision(470000, 600000, 30000), "alert_review")

    def test_external_dispatch_fails_closed_for_missing_gates_and_adapter(self):
        claim = self.queue.claim("hermes-worker", "owner-a", now=101, lease_seconds=20).claim
        base = {
            "credentials_ready": True,
            "permission_ref": "offline:approval",
            "cost_cap_ref": "offline:cost-cap",
            "adapter_verified": True,
            "runtime_approved": True,
        }
        for missing, expected in (
            ({"credentials_ready": False}, "credentials_unavailable"),
            ({"permission_ref": None}, "permission_missing"),
            ({"adapter_verified": False}, "adapter_unverified"),
            ({}, "adapter_not_implemented"),
        ):
            with self.subTest(missing=missing):
                gate = ExternalDispatchGate(**{**base, **missing})
                with self.assertRaisesRegex(CloudAdapterUnavailable, expected):
                    self.queue.dispatch_external(claim, gate, now=102)
        with sqlite3.connect(self.db) as conn:
            state = conn.execute(
                "SELECT status,effect_state FROM tasks WHERE task_id='task-1'"
            ).fetchone()
        self.assertEqual(state, ("running", "not_started"))

        class UnreviewedAdapter:
            offline_fixture = True

            def __init__(self):
                self.calls = 0

            def submit(self, effect_key, payload):
                self.calls += 1
                return {"status": "sent"}

        unreviewed = UnreviewedAdapter()
        with self.assertRaises(CloudAdapterUnavailable):
            dispatch_effect_once(
                self.queue, claim, unreviewed, "notify_owner", {"x": 1}, now=103
            )
        self.assertEqual(unreviewed.calls, 0)

    def test_ambiguous_effect_closes_only_after_reconciliation_receipt(self):
        claim = self.queue.claim("hermes-worker", "owner-a", now=101, lease_seconds=10).claim
        fake = OfflineEffectFixture()
        dispatch_effect_once(self.queue, claim, fake, "notify_owner", {"x": 1}, now=102)
        self.assertEqual(self.queue.claim("hermes-worker", "owner-b", 103, 10).status,
                         "needs_reconcile")
        self.assertIsNone(self.queue.read_result("task-1"))
        self.queue.resolve_reconciliation(
            "task-1", "applied", "offline:receipt-confirmed", now=104
        )
        self.assertEqual(self.queue.read_result("task-1")["result"], "applied_reconciled")
        self.assertEqual(fake.calls, 1)

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

    def test_checkpoint_rejects_empty_or_whitespace_step(self):
        claim = self.queue.claim("hermes-worker", "owner-a", now=101, lease_seconds=10).claim
        for step in ("", "   "):
            with self.subTest(step=repr(step)):
                with self.assertRaisesRegex(ValueError, "step text must be non-empty"):
                    self.queue.save_checkpoint(claim, self.checkpoint(step=step), now=102)

    def test_ambiguous_effect_waits_for_reconciliation_without_resend(self):
        claim = self.queue.claim("hermes-worker", "owner-a", now=101, lease_seconds=5).claim
        fake = OfflineEffectFixture()
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
        fake = OfflineEffectFixture()
        effect_key = self.queue.mark_effect_in_flight(claim, "notify_owner", now=102)
        fake.submit(effect_key, {"x": 1})  # Simulate process loss before receipt persistence.
        recovery = SQLiteQueue(self.db).claim("hermes-worker", "owner-b", now=105, lease_seconds=5)
        self.assertEqual(recovery.status, "needs_reconcile")
        self.assertEqual(recovery.reason, "ambiguous_external_effect")
        self.assertEqual(fake.calls, 1)

    def test_effect_key_is_stable_after_explicit_not_applied_reconciliation(self):
        first = self.queue.claim("hermes-worker", "owner-a", now=101, lease_seconds=5).claim
        fake = OfflineEffectFixture()
        first_result = dispatch_effect_once(self.queue, first, fake, "notify_owner", {"x": 1}, now=102)
        with self.assertRaisesRegex(RuntimeError, "requires manually verified quiescence"):
            self.queue.resolve_reconciliation(
                "task-1", "not_applied", "test operator evidence", now=103
            )
        blocked = self.queue.claim("hermes-worker", "owner-b", now=103, lease_seconds=5)
        self.assertEqual(blocked.status, "needs_reconcile")
        proof = QuiescenceEvidence(
            previous_owner_id=first.owner_id,
            previous_fencing_token=first.fencing_token,
            method="owner_terminated",
            evidence_ref="offline-test:process-exit-claim-1",
            manually_verified=True,
        )
        self.queue.resolve_reconciliation(
            "task-1", "not_applied", "test operator evidence", now=103, quiescence=proof
        )
        second = self.queue.claim("hermes-worker", "owner-b", now=104, lease_seconds=5).claim
        second_result = dispatch_effect_once(self.queue, second, fake, "notify_owner", {"x": 1}, now=105)
        self.assertNotEqual(first.fencing_token, second.fencing_token)
        self.assertEqual(first_result.effect_key, second_result.effect_key)

    def test_quiescence_evidence_must_match_ambiguous_owner_and_fence(self):
        first = self.queue.claim("hermes-worker", "owner-a", now=101, lease_seconds=5).claim
        fake = OfflineEffectFixture()
        dispatch_effect_once(self.queue, first, fake, "notify_owner", {"x": 1}, now=102)
        wrong_proof = QuiescenceEvidence(
            previous_owner_id="different-owner",
            previous_fencing_token=first.fencing_token,
            method="owner_terminated",
            evidence_ref="offline-test:some-process",
            manually_verified=True,
        )
        with self.assertRaisesRegex(RuntimeError, "exact previous owner and fencing token"):
            self.queue.resolve_reconciliation(
                "task-1", "not_applied", "operator says not applied", now=103,
                quiescence=wrong_proof,
            )
        blocked = self.queue.claim("hermes-worker", "owner-b", now=103, lease_seconds=5)
        self.assertEqual(blocked.status, "needs_reconcile")
        self.assertEqual(fake.calls, 1)

    def test_cloud_adapter_is_unavailable_without_verified_official_api(self):
        with self.assertRaises(CloudAdapterUnavailable):
            official_codex_cloud_adapter()


if __name__ == "__main__":
    unittest.main(verbosity=2)
