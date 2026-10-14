"""Offline lifecycle/binding regressions; zero native or LLM calls."""
from dataclasses import replace
import hashlib
import json
from pathlib import Path
import sqlite3
import tempfile
import unittest

from controller_pilot import ControllerPilot, FakeSessionFactory, Goal
from native_receipt_bridge import NativeObservation, NativeReceiptBridge, NativeWorkRequest, NativeWorkAuthorization
from sqlite_pilot import SQLiteQueue, TaskSpec


OP = "00000000-0000-0000-0000-000000000001"
REMOTE = "task_e_" + "a" * 32


class NativeReceiptTests(unittest.TestCase):
    def setUp(self):
        self.area = tempfile.TemporaryDirectory()
        self.addCleanup(self.area.cleanup)
        self.queue = SQLiteQueue(Path(self.area.name) / "queue.sqlite3")
        self.controller = ControllerPilot(self.queue, FakeSessionFactory())
        self.goal = Goal("task", "worker", "onia", "SYNTHETIC: native ledger",
                         "fixture-only", 1, "repo", "codex/test", "a" * 40, "contract")
        self.controller.enqueue(self.goal, 100)
        self.claim = self.controller.claim(self.goal, "owner", 101).claim
        self.bridge = NativeReceiptBridge(self.queue)

    def reserve(self):
        return self.bridge.reserve(self.claim, OP, "nonce-1", "test:authorization", 102, "c" * 64)

    def observation(self, state="running", at=103):
        return NativeObservation(OP, "cloud_cli_task", REMOTE, self.goal.input_sha(),
                                 state, at, "test:source", "b" * 64 if state == "completed" else None)

    def test_recovery_reservation_blocks_replay_and_survives_reopen(self):
        self.reserve()
        self.assertEqual(self.queue.claim("worker", "other", 200, 60).status, "needs_reconcile")
        reopened = NativeReceiptBridge(SQLiteQueue(Path(self.area.name) / "queue.sqlite3"))
        self.assertEqual(reopened.read(OP)["state"], "reserved")
        with self.assertRaises(RuntimeError):
            self.reserve()

    def test_receipt_terminal_is_deduplicated_but_never_completes_queue(self):
        self.reserve()
        receipt = self.observation("completed")
        self.assertEqual(self.bridge.ingest(receipt, 103), "awaiting_qa")
        self.assertEqual(self.bridge.ingest(receipt, 104), "duplicate")
        self.assertIsNone(self.queue.read_result("task"))
        self.assertEqual(self.queue.claim("worker", "other", 200, 60).status, "needs_reconcile")
        with self.assertRaises(RuntimeError):
            self.bridge.ingest(replace(receipt, state="failed", observed_at=104), 104)

    def test_stop_blocks_reservation_but_allows_receipts_to_reconcile(self):
        with self.queue._connection() as conn:
            conn.execute("UPDATE controller_guard_state SET stopped=1,epoch=1")
        with self.assertRaises(RuntimeError):
            self.reserve()
        self.assertIsNone(self.bridge.read(OP))
        with self.queue._connection() as conn:
            conn.execute("UPDATE controller_guard_state SET stopped=0")
        self.reserve()
        with self.queue._connection() as conn:
            conn.execute("UPDATE controller_guard_state SET stopped=1,epoch=2")
        self.assertEqual(self.bridge.ingest(self.observation(), 103), "needs_reconcile")

    def test_native_surfaces_and_input_are_strictly_bound(self):
        self.reserve()
        for receipt in (replace(self.observation(), surface="codex_app_chat"),
                        replace(self.observation(), input_sha="b" * 64),
                        replace(self.observation(), operation_id="unreserved"),
                        replace(self.observation(), state="READY")):
            with self.subTest(receipt=receipt), self.assertRaises(ValueError):
                self.bridge.ingest(receipt, 103)
        self.bridge.ingest(self.observation(), 103)
        with self.assertRaises(ValueError):
            self.bridge.ingest(replace(self.observation(at=104), remote_id="task_e_" + "c" * 32), 104)

    def test_stale_future_and_missing_result_receipts_rejected(self):
        self.reserve()
        for receipt in (self.observation(at=101), self.observation(at=105),
                        replace(self.observation("completed"), result_sha=None)):
            with self.subTest(receipt=receipt), self.assertRaises(ValueError):
                self.bridge.ingest(receipt, 104)
        self.bridge.ingest(self.observation(), 103)
        with self.assertRaises(ValueError):
            self.bridge.ingest(replace(self.observation(), evidence_ref="test:changed"), 104)
        with self.assertRaises(ValueError):
            self.bridge.ingest(self.observation("submitted", 104), 104)

    def test_app_uuid_does_not_become_cloud_cli_task(self):
        self.reserve()
        receipt = replace(self.observation(), surface="codex_app_chat", remote_id=OP)
        self.assertEqual(self.bridge.ingest(receipt, 103), "needs_reconcile")
        self.assertEqual(self.bridge.read(OP)["remote_id"], OP)

    def test_remote_id_collision_rolls_back_without_changing_second_task(self):
        self.reserve()
        self.bridge.ingest(self.observation(), 103)
        goal = replace(self.goal, task_id="second", worker_id="second-worker")
        self.controller.enqueue(goal, 104)
        claim = self.controller.claim(goal, "second-owner", 105).claim
        second = "00000000-0000-0000-0000-000000000002"
        with self.assertRaises(sqlite3.IntegrityError):
            self.bridge.reserve(claim, second, "nonce-1", "test:authorization", 106, "c" * 64)
        self.bridge.reserve(claim, second, "nonce-2", "test:authorization", 106, "c" * 64)
        with self.assertRaises(sqlite3.IntegrityError):
            self.bridge.ingest(replace(self.observation(at=107), operation_id=second,
                                       input_sha=goal.input_sha()), 107)
        self.assertEqual(self.bridge.read(second)["state"], "reserved")

    def test_tampered_observation_fails_integrity(self):
        self.reserve()
        self.bridge.ingest(self.observation(), 103)
        with self.queue._connection() as conn:
            conn.execute("UPDATE native_operations SET observation_json='{}'")
        with self.assertRaises(RuntimeError):
            self.bridge.read(OP)

    def test_dispatch_contract_hash_is_immutable_from_reservation(self):
        self.reserve()
        with self.assertRaises(RuntimeError):
            self.bridge.begin_dispatch(OP, "d" * 64)
        self.assertEqual(self.bridge.read(OP)["state"], "reserved")
        self.assertEqual(self.bridge.read(OP)["dispatch_contract_sha"], "c" * 64)
        self.bridge.begin_dispatch(OP, "c" * 64)
        self.assertEqual(self.bridge.read(OP)["state"], "dispatching")


class NativeEventBudgetTests(unittest.TestCase):
    """Temporary offline queues and synthetic authority; no native/LLM calls."""
    def setUp(self):
        self.area = tempfile.TemporaryDirectory()
        self.addCleanup(self.area.cleanup)
        self.queue = SQLiteQueue(Path(self.area.name) / "queue.sqlite3")
        NativeReceiptBridge.bootstrap_guard(self.queue, "test:authority", "c" * 64, 100)
        self.bridge = NativeReceiptBridge(self.queue)
        prior = TaskSpec("prior", "worker", "onia-hermes", "codex/test", "a" * 40, "contract", "c" * 64)
        self.queue.enqueue(prior, 101)
        claim = self.queue.claim("worker", "owner", 102, 60).claim
        self.bridge.reserve(claim, OP, "prior-nonce", "test:authority", 103, "c" * 64)
        self.bridge.ingest(NativeObservation(OP, "cloud_cli_task", REMOTE, "c" * 64,
                           "completed", 104, "test:prior-result", "b" * 64), 104)
        self.queue.resolve_reconciliation("prior", "applied", "test:prior-qa", 105)
        spec = replace(prior, task_id="next")
        self.queue.enqueue(spec, 106)
        self.claim = self.queue.claim("worker", "next-owner", 107, 60).claim
        self.request = NativeWorkRequest("next", "worker", "contract", "onia-hermes", "codex/test",
            "a" * 40, "c" * 64, "00000000-0000-0000-0000-000000000002", "next-nonce",
            "c" * 64, "test:caller-claim", "prior", ("evidence/result.json",), 2, 1)
        class SyntheticAuthority:
            def verify(self, request, now):
                return NativeWorkAuthorization(True, request.digest(), request.nonce,
                    "test:actor", "test:synthetic-offline-authority", "test:verified-fixture", 200)
        self.authority = SyntheticAuthority()
        self.bridge.authorize_and_reserve_work(self.claim, self.request, self.authority, 108)

    def admit(self, event, event_id):
        return self.bridge.admit_work_event_once(self.request, event, event_id, 109)

    def test_different_ids_cannot_exceed_status_or_result_budget(self):
        self.assertTrue(self.admit("status", "s1"))
        self.assertTrue(self.admit("result", "r1"))
        self.assertTrue(self.admit("status", "s2"))
        for kind in ("status", "result"):
            with self.subTest(kind=kind), self.assertRaisesRegex(RuntimeError, "budget reached"):
                self.admit(kind, "new-" + kind)

    def test_replayed_id_does_not_consume_another_slot(self):
        self.assertTrue(self.admit("status", "same"))
        self.assertFalse(self.admit("status", "same"))
        self.assertTrue(self.admit("status", "second"))
        self.assertFalse(self.admit("status", "same"))
        with self.assertRaisesRegex(RuntimeError, "budget reached"):
            self.admit("status", "third")

    def test_crash_after_admission_consumes_budget_after_reopen(self):
        self.assertTrue(self.admit("result", "before-crash"))
        self.bridge = NativeReceiptBridge(SQLiteQueue(Path(self.area.name) / "queue.sqlite3"))
        self.assertFalse(self.admit("result", "before-crash"))
        with self.assertRaisesRegex(RuntimeError, "budget reached"):
            self.admit("result", "replacement")

    def test_mixed_events_keep_global_cap(self):
        for kind, event_id in (("status", "s1"), ("result", "r1"), ("status", "s2")):
            self.assertTrue(self.admit(kind, event_id))
        for i in range(5):
            self.assertTrue(self.admit("qa", "q" + str(i)))
        with self.assertRaisesRegex(RuntimeError, "finite event cap"):
            self.admit("qa", "q6")

    def test_invalid_budgets_rejected_and_zero_is_valid(self):
        for field, ceiling in (("max_status_events", 2), ("max_result_events", 1)):
            for value in (True, False, -1, 1.0, "1", None, ceiling + 1):
                with self.subTest(field=field, value=value), self.assertRaises(ValueError):
                    replace(self.request, **{field: value})
            self.assertEqual(getattr(replace(self.request, **{field: 0}), field), 0)

    def test_budget_change_and_identity_change_fail_closed(self):
        before = self.bridge.read(self.request.operation_id)
        for altered in (replace(self.request, max_status_events=1), replace(self.request, worker_id="other")):
            with self.subTest(altered=altered), self.assertRaises(RuntimeError):
                self.bridge.admit_work_event_once(altered, "status", "attempt", 109)
        self.assertEqual(self.bridge.read(self.request.operation_id), before)

    def test_admitted_zero_budget_denies_both_provider_read_kinds(self):
        spec = TaskSpec("zero", "zero-worker", "onia-hermes", "codex/test", "a" * 40, "contract", "c" * 64)
        self.queue.enqueue(spec, 109)
        claim = self.queue.claim("zero-worker", "zero-owner", 110, 60).claim
        request = replace(self.request, task_id="zero", worker_id="zero-worker",
            operation_id="00000000-0000-0000-0000-000000000003", nonce="zero-nonce",
            max_status_events=0, max_result_events=0)
        self.bridge.authorize_and_reserve_work(claim, request, self.authority, 111)
        for kind in ("status", "result"):
            with self.subTest(kind=kind), self.assertRaisesRegex(RuntimeError, "budget reached"):
                self.bridge.admit_work_event_once(request, kind, "blocked-" + kind, 112)
        self.assertIsNone(self.bridge.read(request.operation_id)["work_events_json"])

    def test_consumed_lease_cannot_reserve_another_operation(self):
        altered = replace(self.request, operation_id="00000000-0000-0000-0000-000000000003", nonce="other")
        with self.assertRaises(RuntimeError):
            self.bridge.authorize_and_reserve_work(self.claim, altered, self.authority, 109)
        self.assertIsNone(self.bridge.read(altered.operation_id))

    def test_historical_request_digest_cannot_admit_new_budget(self):
        with self.queue._connection() as conn:
            row = conn.execute("SELECT work_authority_json FROM native_operations WHERE operation_id=?",
                               (self.request.operation_id,)).fetchone()
            old = json.loads(row[0])
            del old["request"]["max_status_events"]
            del old["request"]["max_result_events"]
            old["authorization"]["request_sha"] = hashlib.sha256(json.dumps(old["request"],
                sort_keys=True, separators=(",", ":")).encode()).hexdigest()
            payload = json.dumps(old, sort_keys=True, separators=(",", ":"))
            conn.execute("UPDATE native_operations SET work_authority_json=?,work_authority_sha=? WHERE operation_id=?",
                         (payload, hashlib.sha256(payload.encode()).hexdigest(), self.request.operation_id))
        before = self.bridge.read(self.request.operation_id)
        with self.assertRaisesRegex(RuntimeError, "exact admitted finite work"):
            self.admit("status", "new")
        self.assertEqual(self.bridge.read(self.request.operation_id), before)


if __name__ == "__main__":
    unittest.main(verbosity=2)
