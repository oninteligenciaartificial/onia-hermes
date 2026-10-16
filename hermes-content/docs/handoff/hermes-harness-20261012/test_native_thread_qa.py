"""Offline chat QA closure tests. Memory sink is NOT real durability proof."""
from dataclasses import asdict, replace
import hashlib
import json
import unittest
from unittest.mock import Mock, patch

from controller_pilot import digest, step_native_work
from native_receipt_bridge import NativeReceiptBridge
from native_thread_artifacts import NativeThreadArtifacts, canonical_bytes
from native_work_entrypoint import _recover_result_bundle
from sqlite_pilot import SQLiteQueue
import test_native_thread_artifacts as fixtures


class BoundOfflineReviewer:
    """Synthetic independent verifier; no live model/authentication is claimed."""
    def __init__(self, before=None, **changes):
        self.calls, self.before, self.changes = 0, before, changes

    def verify(self, request, bundle, now):
        self.calls += 1
        if self.before:
            self.before()
        return {"verified": True, "request_sha": request.digest(), "bundle_sha": digest(bundle),
                "remote_id": bundle["remote_id"], "operation_id": request.operation_id,
                "surface": "codex_app_chat", "host_id": "durable",
                "provenance_sha256": digest(bundle["native_thread_provenance"]),
                "reviewer_id": "fixture-independent-reviewer", "goal_outcome": "completed",
                "authority_source": "fixture:independent-authenticated-review",
                "evidence_ref": "fixture:bound-qa", **self.changes}


class NativeThreadQATests(unittest.TestCase):
    setUp = fixtures.ThreadArtifactTests.setUp
    assert_admitted = fixtures.ThreadArtifactTests.assert_admitted
    event = fixtures.ThreadArtifactTests.event

    def persist(self):
        result = self.event()
        self.assertEqual(result["state"], "awaiting_independent_qa")
        return result

    def assert_qa_admitted(self):
        with self.queue._connection() as conn:
            raw = conn.execute("SELECT work_events_json FROM native_operations WHERE operation_id=?",
                               (self.request.operation_id,)).fetchone()[0]
        events = json.loads(raw)
        self.assertTrue(any(e["event"] == "qa" and e["request_sha"] == self.request.digest()
                            for e in events.values()))

    def reopen(self, verifier):
        queue = SQLiteQueue(self.db_path)
        bridge = NativeReceiptBridge(queue)
        reader = Mock()
        reader.read_artifacts.side_effect = AssertionError("QA must not reread transport")
        transport = NativeThreadArtifacts(bridge, self.request, self.provenance, reader)
        # Reconstruct an OFFLINE sink fake from its saved byte value; no assertion
        # of real sink persistence/durability. The SQLite receipt really is reopened.
        sink = fixtures.MemorySink()
        sink.identity, sink.raw = self.sink.identity, bytes(self.sink.raw)
        return replace(self.runtime, queue=queue, bridge=bridge, transport=transport,
                       result_sink=sink, qa_verifier=verifier)

    def assert_unclosed(self):
        self.assertEqual(self.bridge.read(self.request.operation_id)["state"], "submitted")
        self.assertIsNone(self.queue.read_result(self.request.task_id))

    def test_reopen_exact_bundle_independent_qa_closes_chat_not_cli(self):
        self.persist()
        reviewer = BoundOfflineReviewer(self.assert_qa_admitted)
        reopened = self.reopen(reviewer)
        out = self.event("qa", "qa-1", reopened)
        self.assertEqual(out["state"], "closure_resolved")
        self.assertEqual(out["goal_outcome"], "completed")
        self.assertTrue(out["global_goal_not_closed"])
        native = reopened.bridge.read(self.request.operation_id)
        self.assertEqual(native["state"], "completed")
        self.assertEqual(native["surface"], "codex_app_chat")
        self.assertEqual(native["remote_id"], fixtures.THREAD)
        self.assertEqual(native["observation"]["surface"], "codex_app_chat")
        self.assertIsNotNone(reopened.queue.read_result(self.request.task_id))
        self.assertEqual(reviewer.calls, 1)
        reopened.transport.reader.read_artifacts.assert_not_called()

    def test_same_qa_event_replay_does_not_repeat_reviewer_or_mutate_result(self):
        self.persist()
        reviewer = BoundOfflineReviewer()
        rt = self.reopen(reviewer)
        self.assertEqual(self.event("qa", "qa-1", rt)["state"], "closure_resolved")
        before = rt.queue.read_result(self.request.task_id)
        self.assertEqual(self.event("qa", "qa-1", rt)["reason"], "event_already_consumed_no_reexecution")
        self.assertEqual(reviewer.calls, 1)
        self.assertEqual(rt.queue.read_result(self.request.task_id), before)

    def test_missing_verifier_or_receipt_does_not_close(self):
        self.assertEqual(self.event("qa", "qa-1")["code"], "qa_verifier_required")
        rt = replace(self.runtime, qa_verifier=BoundOfflineReviewer())
        self.assertEqual(self.event("qa", "qa-2", rt)["code"], "result_bundle_recovery_failed")
        self.assertEqual(rt.qa_verifier.calls, 0)
        self.assert_unclosed()

    def test_review_requires_all_identity_hash_and_independence_bindings(self):
        changes = [{"surface": "cloud_cli_task"}, {"host_id": "local"},
                   {"operation_id": fixtures.THREAD}, {"request_sha": "0" * 64},
                   {"bundle_sha": "0" * 64}, {"provenance_sha256": "0" * 64},
                   {"remote_id": "task_e_" + "1" * 32},
                   {"reviewer_id": self.request.worker_id}, {"reviewer_id": fixtures.THREAD},
                   {"reviewer_id": "current-owner"}, {"reviewer_id": None},
                   {"reviewer_id": " "}, {"authority_source": " "},
                   {"verified": False}, {"goal_outcome": "READY"}]
        for change in changes:
            with self.subTest(change=change):
                self.setUp()
                self.persist()
                reviewer = BoundOfflineReviewer(self.assert_qa_admitted, **change)
                rt = replace(self.runtime, qa_verifier=reviewer)
                result = self.event("qa", "qa-1", rt)
                self.assertEqual(result["state"], "awaiting_independent_qa")
                self.assertEqual(result["reason"], "QA_identity_or_result_binding_unverified")
                self.assertEqual(reviewer.calls, 1)
                self.assert_unclosed()

    def test_ready_text_and_raw_review_are_not_qa(self):
        for review in ("READY", {"state": "completed"}, {"verified": True}, "agent says success"):
            with self.subTest(review=review):
                self.setUp()
                self.persist()
                reviewer = Mock()
                reviewer.verify.return_value = review
                out = self.event("qa", "qa-1", replace(self.runtime, qa_verifier=reviewer))
                self.assertEqual(out["state"], "awaiting_independent_qa")
                self.assert_unclosed()

    def test_recovered_provenance_or_host_mismatch_holds_before_reviewer(self):
        self.persist()
        reviewer = BoundOfflineReviewer()
        for provenance in (replace(self.provenance, evidence_ref="fixture:other-proof"),
                           replace(self.provenance, thread_id=self.request.operation_id)):
            adapter = NativeThreadArtifacts(self.bridge, self.request, provenance, self.reader)
            rt = replace(self.runtime, transport=adapter, qa_verifier=reviewer)
            self.assertEqual(self.event("qa", "qa-1", rt)["code"], "result_bundle_recovery_failed")
        # Simulate a corrupted in-process binding after construction, not a
        # production API: recovery must still validate it before invoking QA.
        original = self.transport.provenance
        self.transport.provenance = replace(original, host_id="local")
        rt = replace(self.runtime, qa_verifier=reviewer)
        self.assertEqual(self.event("qa", "qa-1", rt)["code"], "result_bundle_recovery_failed")
        self.transport.provenance = original
        self.assertEqual(reviewer.calls, 0)
        self.assert_unclosed()

    def test_persisted_surface_or_remote_mismatch_holds_before_reviewer(self):
        self.persist()
        reviewer = BoundOfflineReviewer()
        for changes in ({"surface": "cloud_cli_task"}, {"surface": "unsupported"},
                        {"remote_id": "task_e_" + "1" * 32}):
            native = {**self.bridge.read(self.request.operation_id), **changes}
            with patch.object(self.bridge, "read", return_value=native):
                out = self.event("qa", "qa-1", replace(self.runtime, qa_verifier=reviewer))
            self.assertEqual(out["code"], "result_bundle_recovery_failed")
        self.assertEqual(reviewer.calls, 0)

    def test_controller_rejects_unpersisted_or_changed_bundle_before_qa(self):
        self.persist()
        bundle = _recover_result_bundle(self.runtime, self.request)
        reviewer = BoundOfflineReviewer()
        changed = {**bundle, "artifact_source_ref": "fixture:changed-export"}
        with self.assertRaises(ValueError):
            step_native_work(self.queue, self.bridge, self.transport, "qa", self.request,
                             self.plan, self.now + 20, result_bundle=changed,
                             qa_verifier=reviewer, event_id="qa-direct")
        self.assertEqual(reviewer.calls, 0)
        self.assert_unclosed()

    def test_verifier_crash_is_ambiguous_and_event_consumed_no_retry(self):
        self.persist()
        reviewer = Mock()
        reviewer.verify.side_effect = RuntimeError("private-error")
        rt = replace(self.runtime, qa_verifier=reviewer)
        out = self.event("qa", "qa-1", rt)
        self.assertEqual(out["code"], "dispatch_outcome_unknown")
        self.assertNotIn("private", json.dumps(out))
        self.assertEqual(self.event("qa", "qa-1", rt)["reason"], "event_already_consumed_no_reexecution")
        reviewer.verify.assert_called_once()
        self.assert_unclosed()

    def test_stop_retains_guard_and_does_not_offer_next_candidate(self):
        self.persist()
        with self.queue._connection() as conn:
            conn.execute("UPDATE controller_guard_state SET stopped=1,epoch=epoch+1")
        reviewer = BoundOfflineReviewer()
        rt = replace(self.runtime, qa_verifier=reviewer)
        out = self.event("qa", "qa-1", rt)
        # Existing semantics permit reconciliation of submitted work under STOP,
        # but never a new effect or next candidate. The STOP flag is not reset.
        self.assertEqual(out["state"], "closure_resolved")
        self.assertEqual(out["next_action"], "hold_stop")
        self.assertIsNone(out["next_candidate_task_id"])
        with self.queue._connection() as conn:
            self.assertEqual(conn.execute("SELECT stopped FROM controller_guard_state").fetchone()[0], 1)

    def test_qa_failed_business_outcome_keeps_native_chat_identity(self):
        self.persist()
        reviewer = BoundOfflineReviewer(goal_outcome="failed")
        rt = replace(self.runtime, qa_verifier=reviewer)
        out = self.event("qa", "qa-1", rt)
        self.assertEqual(out["state"], "closure_resolved")
        self.assertEqual(out["goal_outcome"], "failed")
        self.assertEqual(self.bridge.read(self.request.operation_id)["surface"], "codex_app_chat")

    def test_changed_artifact_or_missing_provenance_rejected_before_verifier(self):
        self.persist()
        reviewer = BoundOfflineReviewer()
        original = json.loads(self.sink.raw)
        variants = [{**original, "native_thread_provenance": {}},
                    {**original, "files": {"../result.json": original["files"]["result.json"]}},
                    {**original, "input_sha": "0" * 64}]
        for bundle in variants:
            with self.subTest(variant=list(bundle)):
                raw = canonical_bytes(bundle)
                receipt = {"ref": "fixture-result", "sha256": hashlib.sha256(raw).hexdigest(),
                           "bytes_written": len(raw)}
                self.sink.raw = raw
                # Simulate receipt+payload corruption to exercise validation
                # beyond outer hashes. No real store or production ledger edits.
                with patch.object(self.bridge, "read_result_bundle_receipt", return_value=receipt):
                    out = self.event("qa", "qa-1", replace(self.runtime, qa_verifier=reviewer))
                self.assertEqual(out["code"], "result_bundle_recovery_failed")
        self.assertEqual(reviewer.calls, 0)


if __name__ == "__main__":
    unittest.main()
