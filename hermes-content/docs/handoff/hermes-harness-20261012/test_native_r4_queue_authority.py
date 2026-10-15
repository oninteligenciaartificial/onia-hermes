"""Offline tests for the pinned R4 caller over temporary SQLite queues."""
import hashlib
import json
from pathlib import Path
import tempfile
import time
import unittest
from dataclasses import replace

from native_receipt_bridge import (
    NativeObservation,
    NativeReceiptBridge,
    NativeWorkRequest,
)
from native_r4_queue_authority import (
    R4_HEAD,
    R4_OPERATION_GRANT,
    R4_OPERATION_ID,
    R4_OPERATION_NONCE,
    R4_PLAN_SHA256,
    R4_REF,
    R4_SETUP_GRANT,
    authorize_and_reserve_root_r4,
    revalidate_reserved_root_r4,
)
from sqlite_pilot import SQLiteQueue, TaskSpec


BOOTSTRAP_PLAN_SHA = "5b3981fec3df0dc1cce94e0c5d0de39b9ab854ae73ac994aa578296d10c0a410"
PRIOR_OPERATION = "00000000-0000-0000-0000-000000000011"
PRIOR_REMOTE = "task_e_" + "1" * 32


class RootR4QueueAuthorityTests(unittest.TestCase):
    def setUp(self):
        self._initialize_fixture()

    def _initialize_fixture(self):
        self.area = tempfile.TemporaryDirectory()
        self.addCleanup(self.area.cleanup)
        self.queue = SQLiteQueue(Path(self.area.name) / "queue.sqlite3")
        NativeReceiptBridge.bootstrap_guard(self.queue, "fixture:bootstrap", BOOTSTRAP_PLAN_SHA, 100)
        self.bridge = NativeReceiptBridge(self.queue)

        prior = TaskSpec("prior", "worker", "onia-hermes", "codex/test", "a" * 40,
                         "prior-contract", "c" * 64)
        self.queue.enqueue(prior, 101)
        prior_claim = self.queue.claim("worker", "owner-prior", 102, 60).claim
        self.bridge.reserve(prior_claim, PRIOR_OPERATION, "prior-nonce", "fixture:bootstrap",
                            103, BOOTSTRAP_PLAN_SHA)
        self.bridge.ingest(NativeObservation(PRIOR_OPERATION, "cloud_cli_task", PRIOR_REMOTE,
                              "c" * 64, "completed", 104, "fixture:prior-result", "e" * 64), 104)
        self.queue.resolve_reconciliation("prior", "applied", "fixture:prior-qa", 105)

        self.task = TaskSpec("r4-local-task", "r4-worker", "onia-hermes", R4_REF, R4_HEAD,
                             "r4-contract", "b" * 64)
        self.queue.enqueue(self.task, 106)
        self.claim = self.queue.claim("r4-worker", "root-controller", 107, 600).claim
        self.request = NativeWorkRequest(
            task_id=self.task.task_id,
            worker_id=self.task.worker_id,
            contract_id=self.task.contract_id,
            repo=self.task.repo,
            ref=self.task.ref,
            head=self.task.sha,
            input_sha=self.task.input_sha,
            operation_id=R4_OPERATION_ID,
            nonce=R4_OPERATION_NONCE,
            plan_sha=R4_PLAN_SHA256,
            approval_claim_ref=R4_OPERATION_GRANT,
            predecessor_task_id="prior",
            result_paths=("evidence/r4/result.json",),
            max_status_events=2,
            max_result_events=1,
        )

    def bootstrap_state(self):
        with self.queue._connection() as conn:
            row = conn.execute("SELECT reviewed_plan_sha,receipt_json,receipt_sha FROM native_guard_bootstrap").fetchone()
            return tuple(row)

    def reserve_r4(self):
        return authorize_and_reserve_root_r4(self.bridge, self.claim, self.request, 108)

    def queue_snapshot(self):
        operation = self.bridge.read(R4_OPERATION_ID)
        with self.queue._connection() as conn:
            task = dict(conn.execute("SELECT * FROM tasks WHERE task_id=?", (self.task.task_id,)).fetchone())
            guard = dict(conn.execute("SELECT * FROM controller_guard_state WHERE singleton=1").fetchone())
            lease = conn.execute("SELECT * FROM worker_leases WHERE task_id=?", (self.task.task_id,)).fetchone()
            bootstrap = tuple(conn.execute(
                "SELECT reviewed_plan_sha,receipt_json,receipt_sha FROM native_guard_bootstrap"
            ).fetchone())
        return operation, task, guard, dict(lease) if lease else None, bootstrap

    def assert_revalidation_denied_without_mutation(self, request=None):
        before = self.queue_snapshot()
        with self.assertRaises((RuntimeError, ValueError)):
            revalidate_reserved_root_r4(self.bridge, request or self.request, int(time.time()))
        self.assertEqual(self.queue_snapshot(), before)

    def test_root_grant_reserves_new_plan_without_bootstrap_rewrite(self):
        before = self.bootstrap_state()
        operation_id = authorize_and_reserve_root_r4(self.bridge, self.claim, self.request, 108)
        self.assertEqual(operation_id, R4_OPERATION_ID)
        self.assertEqual(self.bootstrap_state(), before)
        row = self.bridge.read(R4_OPERATION_ID)
        self.assertEqual(row["authorization_ref"], R4_OPERATION_GRANT)
        self.assertEqual(row["dispatch_contract_sha"], R4_PLAN_SHA256)
        self.assertEqual(hashlib.sha256(row["work_authority_json"].encode()).hexdigest(), row["work_authority_sha"])

    def test_crossed_grant_and_changed_pins_fail_before_reservation(self):
        for request in (
            replace(self.request, approval_claim_ref=R4_SETUP_GRANT),
            replace(self.request, nonce="other-nonce"),
            replace(self.request, plan_sha="e" * 64),
            replace(self.request, head="f" * 40),
            replace(self.request, max_status_events=1),
        ):
            with self.subTest(request=request), self.assertRaises(ValueError):
                authorize_and_reserve_root_r4(self.bridge, self.claim, request, 108)
            self.assertIsNone(self.bridge.read(R4_OPERATION_ID))

    def test_stopped_guard_fails_closed(self):
        with self.queue._connection() as conn:
            conn.execute("UPDATE controller_guard_state SET stopped=1,epoch=epoch+1")
        with self.assertRaisesRegex(RuntimeError, "stopped"):
            authorize_and_reserve_root_r4(self.bridge, self.claim, self.request, 108)
        self.assertIsNone(self.bridge.read(R4_OPERATION_ID))

    def test_request_from_other_claim_fails_before_bridge(self):
        other_claim = replace(self.claim, worker_id="other-worker")
        with self.assertRaisesRegex(ValueError, "does not match"):
            authorize_and_reserve_root_r4(self.bridge, other_claim, self.request, 108)
        self.assertIsNone(self.bridge.read(R4_OPERATION_ID))

    def test_revalidation_updates_only_expiry_and_allows_one_dispatch(self):
        self.reserve_r4()
        before = self.queue_snapshot()
        old_proof = json.loads(before[0]["work_authority_json"])
        now = int(time.time()) - 1
        receipt = revalidate_reserved_root_r4(self.bridge, self.request, now)
        after = self.queue_snapshot()
        new_proof = json.loads(after[0]["work_authority_json"])

        self.assertEqual(receipt["state"], "reserved")
        self.assertEqual(receipt["dispatch_count"], 0)
        self.assertEqual(receipt["authorization_expires_at"], now + 900)
        self.assertEqual(receipt["revalidated_at"], now)
        self.assertEqual(receipt["revalidation_time_source"], "root_controller_supplied_unix_epoch")
        self.assertEqual(after[0]["state"], "reserved")
        self.assertEqual(new_proof["request"], old_proof["request"])
        self.assertEqual(new_proof["revalidation_history"], [{
            "prior_authorization": old_proof["authorization"],
            "revalidated_at": now,
            "revalidation_time_source": "root_controller_supplied_unix_epoch",
            "new_expires_at": now + 900,
        }])
        prior_with_new_expiry = dict(old_proof["authorization"])
        prior_with_new_expiry["expires_at"] = new_proof["authorization"]["expires_at"]
        self.assertEqual(new_proof["authorization"], prior_with_new_expiry)
        self.assertEqual(after[0]["work_authority_sha"], hashlib.sha256(
            after[0]["work_authority_json"].encode()).hexdigest())
        self.assertEqual(after[0]["nonce"], before[0]["nonce"])
        self.assertEqual(after[0]["input_sha"], before[0]["input_sha"])
        self.assertEqual(after[0]["dispatch_contract_sha"], before[0]["dispatch_contract_sha"])
        self.assertEqual(after[0]["work_events_json"], before[0]["work_events_json"])
        self.assertEqual(after[1], before[1])
        self.assertEqual(after[2], before[2])
        self.assertEqual(after[3], before[3])
        self.assertEqual(after[4], before[4])

        self.bridge.begin_dispatch(R4_OPERATION_ID, R4_PLAN_SHA256)
        with self.assertRaisesRegex(RuntimeError, "unreserved or dispatch slot"):
            self.bridge.begin_dispatch(R4_OPERATION_ID, R4_PLAN_SHA256)

    def test_revalidation_does_not_consume_early_while_authorization_is_valid(self):
        self.reserve_r4()
        before = self.queue_snapshot()
        stored_expiry = json.loads(before[0]["work_authority_json"])["authorization"]["expires_at"]
        self.assertGreater(stored_expiry, 108)
        with self.assertRaisesRegex(RuntimeError, "still valid"):
            revalidate_reserved_root_r4(self.bridge, self.request, stored_expiry - 1)
        self.assertEqual(self.queue_snapshot(), before)

    def test_revalidation_rejects_changed_request_and_authority_without_mutation(self):
        self.reserve_r4()
        self.assert_revalidation_denied_without_mutation(replace(self.request, head="f" * 40))
        with self.queue._connection() as conn:
            row = conn.execute("SELECT work_authority_json FROM native_operations WHERE operation_id=?",
                               (R4_OPERATION_ID,)).fetchone()
            proof = json.loads(row[0])
            proof["authorization"]["evidence_ref"] = "different-grant"
            payload = json.dumps(proof, sort_keys=True, separators=(",", ":"))
            conn.execute("UPDATE native_operations SET work_authority_json=?,work_authority_sha=? WHERE operation_id=?",
                         (payload, hashlib.sha256(payload.encode()).hexdigest(), R4_OPERATION_ID))
        self.assert_revalidation_denied_without_mutation()

    def test_revalidation_rejects_dispatch_state_and_remote_binding_without_mutation(self):
        self.reserve_r4()
        with self.queue._connection() as conn:
            conn.execute("UPDATE native_operations SET state='dispatching' WHERE operation_id=?",
                         (R4_OPERATION_ID,))
        self.assert_revalidation_denied_without_mutation()

        self._initialize_fixture()
        self.reserve_r4()
        with self.queue._connection() as conn:
            conn.execute("UPDATE native_operations SET remote_id=?,surface='cloud_cli_task' WHERE operation_id=?",
                         ("task_e_" + "2" * 32, R4_OPERATION_ID))
        self.assert_revalidation_denied_without_mutation()

    def test_revalidation_rejects_consumed_events_and_stopped_epoch_without_mutation(self):
        self.reserve_r4()
        with self.queue._connection() as conn:
            conn.execute("UPDATE native_operations SET work_events_json=? WHERE operation_id=?",
                         (json.dumps({"status-once": {"event": "status"}}), R4_OPERATION_ID))
        self.assert_revalidation_denied_without_mutation()

        self._initialize_fixture()
        self.reserve_r4()
        with self.queue._connection() as conn:
            conn.execute("UPDATE controller_guard_state SET epoch=epoch+1 WHERE singleton=1")
        self.assert_revalidation_denied_without_mutation()

    def test_revalidation_rejects_changed_task_effect_and_repeat_without_mutation(self):
        self.reserve_r4()
        with self.queue._connection() as conn:
            conn.execute("UPDATE tasks SET effect_key='other-operation' WHERE task_id=?",
                         (self.task.task_id,))
        self.assert_revalidation_denied_without_mutation()

        self._initialize_fixture()
        self.reserve_r4()
        revalidate_reserved_root_r4(self.bridge, self.request, int(time.time()) - 1)
        self.assert_revalidation_denied_without_mutation()


if __name__ == "__main__":
    unittest.main()
