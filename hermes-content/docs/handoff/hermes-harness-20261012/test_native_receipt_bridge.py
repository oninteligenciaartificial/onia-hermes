"""Offline lifecycle/binding regressions; zero native or LLM calls."""
from dataclasses import replace
from pathlib import Path
import sqlite3
import tempfile
import unittest

from controller_pilot import ControllerPilot, FakeSessionFactory, Goal
from native_receipt_bridge import NativeObservation, NativeReceiptBridge
from sqlite_pilot import SQLiteQueue


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


if __name__ == "__main__":
    unittest.main(verbosity=2)
