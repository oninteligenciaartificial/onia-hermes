"""Bootstrap on fresh temporary queues only; no fake controller or provider."""
from pathlib import Path
import tempfile
import unittest

from native_receipt_bridge import NativeReceiptBridge
from sqlite_pilot import SQLiteQueue, TaskSpec


PLAN_SHA = "a" * 64
OP = "00000000-0000-0000-0000-000000000001"


class NativeBootstrapTests(unittest.TestCase):
    def setUp(self):
        self.area = tempfile.TemporaryDirectory()
        self.addCleanup(self.area.cleanup)
        self.queue = SQLiteQueue(Path(self.area.name) / "queue.sqlite3")

    def spec(self):
        return TaskSpec("native-review-1", "hermes-native", "onia-hermes", "codex/review",
                        "a" * 40, "native-public-review-v1", PLAN_SHA)

    def bootstrap(self):
        return NativeReceiptBridge.bootstrap_guard(self.queue, "test:explicit-human-authority", PLAN_SHA, 100)

    def test_real_taskspec_flow_requires_no_fixture_controller(self):
        receipt = self.bootstrap()
        self.assertEqual(receipt["reviewed_plan_sha"], PLAN_SHA)
        self.queue.enqueue(self.spec(), 101)
        claim = self.queue.claim("hermes-native", "native-owner", 102, 60).claim
        bridge = NativeReceiptBridge(self.queue)
        bridge.reserve(claim, OP, "live-pilot-nonce", "test:explicit-human-authority", 103, PLAN_SHA)
        bridge.begin_dispatch(OP, PLAN_SHA)
        self.assertEqual(bridge.read(OP)["state"], "dispatching")
        self.assertEqual(self.queue.claim("hermes-native", "other-owner", 200, 60).status, "needs_reconcile")

    def test_reinit_cannot_clear_stop(self):
        self.bootstrap()
        with self.queue._connection() as conn:
            conn.execute("UPDATE controller_guard_state SET stopped=1,epoch=1")
        with self.assertRaises(RuntimeError):
            self.bootstrap()
        with self.queue._connection() as conn:
            row = conn.execute("SELECT stopped,epoch FROM controller_guard_state").fetchone()
            self.assertEqual(tuple(row), (1, 1))

    def test_existing_tasks_rejected_without_creating_guard(self):
        self.queue.enqueue(self.spec(), 99)
        with self.assertRaises(RuntimeError):
            self.bootstrap()
        with self.queue._connection() as conn:
            self.assertIsNone(conn.execute("SELECT name FROM sqlite_master WHERE name='controller_guard_state'").fetchone())

    def test_existing_native_ledger_rejected_even_empty(self):
        NativeReceiptBridge(self.queue)
        with self.assertRaises(RuntimeError):
            self.bootstrap()

    def test_missing_review_and_malformed_plan_rejected(self):
        for authority, plan in (("", PLAN_SHA), ("test:authority", "unreviewed")):
            with self.subTest(authority=authority), self.assertRaises(ValueError):
                NativeReceiptBridge.bootstrap_guard(self.queue, authority, plan, 100)

    def test_different_plan_reservation_rejected(self):
        self.bootstrap()
        self.queue.enqueue(self.spec(), 101)
        claim = self.queue.claim("hermes-native", "native-owner", 102, 60).claim
        bridge = NativeReceiptBridge(self.queue)
        with self.assertRaises(RuntimeError):
            bridge.reserve(claim, OP, "nonce", "test:explicit-human-authority", 103, "b" * 64)
        self.assertIsNone(bridge.read(OP))

    def test_bootstrap_receipt_tampering_rejected(self):
        self.bootstrap()
        self.queue.enqueue(self.spec(), 101)
        claim = self.queue.claim("hermes-native", "native-owner", 102, 60).claim
        bridge = NativeReceiptBridge(self.queue)
        with self.queue._connection() as conn:
            conn.execute("UPDATE native_guard_bootstrap SET receipt_json='{}'")
        with self.assertRaises(RuntimeError):
            bridge.reserve(claim, OP, "nonce", "test:explicit-human-authority", 103, PLAN_SHA)


if __name__ == "__main__":
    unittest.main(verbosity=2)
