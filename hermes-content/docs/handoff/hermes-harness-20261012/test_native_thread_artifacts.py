"""Offline fakes, real temporary ledger; NOT authenticated live transport proof."""
from dataclasses import asdict, replace
import hashlib
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

import test_native_work_entrypoint as fixtures
from native_receipt_bridge import NativeObservation, NativeReceiptBridge
from native_thread_artifacts import (
    AuthenticatedThreadArtifacts, CloudThreadProvenance, MAX_ARTIFACT_BYTES,
    NativeThreadArtifacts, ThreadArtifactBytes, canonical_bytes,
)
from native_work_entrypoint import NativeWorkRuntime, _recover_result_bundle, _safe_output, handle_native_event


THREAD = "01a142e2-e207-7248-8c43-4778c245000f"


class MemorySink:
    """Offline persistence fake only; makes no filesystem durability claim."""
    def store(self, operation_id, request_sha, raw):
        self.identity = operation_id, request_sha
        self.raw = raw
        return {"ref": "fixture-result", "sha256": hashlib.sha256(raw).hexdigest(),
                "bytes_written": len(raw)}

    def load(self, ref, operation_id, request_sha, digest):
        assert ref == "fixture-result" and self.identity == (operation_id, request_sha)
        assert hashlib.sha256(self.raw).hexdigest() == digest
        return self.raw


class FakeAuthenticatedReader:
    def __init__(self, observed, before=None):
        self.observed, self.before, self.calls = observed, before, 0

    def read_artifacts(self, provenance, request, max_bytes):
        self.calls += 1
        if self.before:
            self.before(request)
        assert max_bytes == MAX_ARTIFACT_BYTES
        if isinstance(self.observed, Exception):
            raise self.observed
        return self.observed


class ThreadArtifactTests(unittest.TestCase):
    def setUp(self):
        # Reuse the existing fixture's finite-work admission/authority setup,
        # changing only the current synthetic remote observation at construction.
        self.area = tempfile.TemporaryDirectory()
        self.addCleanup(self.area.cleanup)
        self.root = Path(self.area.name)
        self.db_path = self.root / "ledger.sqlite3"
        self.now = 2000000000
        self.request = fixtures.make_request()
        original = NativeReceiptBridge.ingest

        def ingest(bridge, observation, now):
            if observation.operation_id == self.request.operation_id:
                observation = replace(observation, surface="codex_app_chat", remote_id=THREAD)
            return original(bridge, observation, now)

        self.SyntheticAuthority = fixtures.NativeResultRecoveryTests.SyntheticAuthority
        with patch.object(NativeReceiptBridge, "ingest", ingest):
            self.queue, self.bridge = fixtures.NativeResultRecoveryTests._build_bridge(self)
        self.provenance = CloudThreadProvenance(THREAD, "durable", True, "fixture:cloud-execution")
        self.value = {"operation_id": self.request.operation_id, "input_sha": self.request.input_sha,
                      "repository": {"expected_head": self.request.head, "observed_head": self.request.head},
                      "result": "candidate"}
        self.raw = canonical_bytes(self.value)
        self.artifact = ThreadArtifactBytes("result.json", self.raw, hashlib.sha256(self.raw).hexdigest())
        self.observed = AuthenticatedThreadArtifacts(
            self.provenance, self.request.operation_id, self.request.input_sha,
            self.request.head, "fixture:authenticated-export", (self.artifact,))
        self.reader = FakeAuthenticatedReader(self.observed, self.assert_admitted)
        self.transport = NativeThreadArtifacts(self.bridge, self.request, self.provenance, self.reader)
        self.sink = MemorySink()
        self.plan = type("ExistingPlan", (), {
            "request": lambda _self: (None, None, fixtures.PLAN_SHA),
            "branch": self.request.ref, "expected_remote_head": self.request.head,
            "executable": None,
        })()
        self.runtime = NativeWorkRuntime(self.queue, self.bridge, self.transport,
                                         self.request, self.plan, result_sink=self.sink)

    def assert_admitted(self, request):
        with self.queue._connection() as conn:
            row = conn.execute("SELECT work_events_json FROM native_operations WHERE operation_id=?",
                               (request.operation_id,)).fetchone()
        events = json.loads(row[0])
        self.assertEqual(sum(e["event"] == "result" for e in events.values()), 1)
        self.assertTrue(all(e["request_sha"] == request.digest() for e in events.values()))

    def event(self, kind="result", event_id="result-1", runtime=None):
        return handle_native_event(fixtures.payload(kind, self.request, event_id=event_id),
                                   runtime or self.runtime, self.now + 20)

    def test_result_admitted_before_reader_persisted_and_recovered_without_reread(self):
        result = self.event()
        self.assertEqual(result["state"], "awaiting_independent_qa")
        self.assertEqual(result["remote_id"], THREAD)
        self.assertEqual(self.reader.calls, 1)
        self.assertNotIn("files", result)
        self.assertNotIn("native_thread_provenance", result)
        receipt = self.bridge.read_result_bundle_receipt(self.request)
        self.assertEqual(receipt["sha256"], result["result_bundle_sha256"])
        # New adapter process binding, exact trusted provenance, existing receipt.
        transport = NativeThreadArtifacts(self.bridge, self.request, self.provenance, self.reader)
        runtime = replace(self.runtime, transport=transport)
        bundle = _recover_result_bundle(runtime, self.request)
        self.assertEqual(bundle["files"]["result.json"]["sha256"], self.artifact.sha256)
        self.assertEqual(bundle["native_thread_provenance"], asdict(self.provenance))
        self.assertEqual(self.reader.calls, 1)
        self.assertEqual(self.bridge.read(self.request.operation_id)["state"], "submitted")
        self.assertIsNone(self.queue.read_result(self.request.task_id))

    def test_duplicate_or_new_result_event_cannot_repeat_read_after_recreation(self):
        self.event()
        self.assertEqual(self.event()["reason"], "event_already_consumed_no_reexecution")
        other = replace(self.runtime, transport=NativeThreadArtifacts(
            self.bridge, self.request, self.provenance, self.reader))
        self.assertEqual(self.event(event_id="result-2", runtime=other)["state"], "needs_reconcile")
        self.assertEqual(self.reader.calls, 1)

    def test_reader_failure_stays_consumed_and_does_not_leak_text(self):
        self.reader.observed = OSError("private-token-and-transcript")
        result = self.event()
        self.assertEqual(result["state"], "needs_reconcile")
        self.assertNotIn("private", json.dumps(result))
        self.event(event_id="result-2")
        self.assertEqual(self.reader.calls, 1)
        self.assertIsNone(self.bridge.read_result_bundle_receipt(self.request))

    def test_absent_or_local_or_unverified_cloud_provenance_rejected(self):
        for p in (None, replace(self.provenance, host_id=""), replace(self.provenance, host_id="local"),
                  replace(self.provenance, cloud_execution_verified=False),
                  replace(self.provenance, cloud_execution_verified=1),
                  replace(self.provenance, evidence_ref=""),
                  replace(self.provenance, surface="cloud_cli_task"),
                  replace(self.provenance, thread_id="task_e_" + "a" * 32)):
            with self.subTest(provenance=p), self.assertRaises(ValueError):
                NativeThreadArtifacts(self.bridge, self.request, p, self.reader)
        self.assertEqual(self.reader.calls, 0)

    def test_wrong_bound_surface_or_thread_never_reads(self):
        for row in (None, {**self.bridge.read(self.request.operation_id), "surface": "cloud_cli_task"},
                    {**self.bridge.read(self.request.operation_id), "remote_id": self.request.operation_id}):
            with patch.object(self.bridge, "read", return_value=row):
                result = self.event(event_id="bad-binding-" + str(row is None))
                self.assertIn(result["state"], ("hold", "needs_reconcile"))
        self.assertEqual(self.reader.calls, 0)

    def test_response_identity_and_provenance_conflicts_rejected(self):
        variants = [replace(self.observed, operation_id=THREAD),
                    replace(self.observed, input_sha="c" * 64),
                    replace(self.observed, observed_head="c" * 40),
                    replace(self.observed, provenance=replace(self.provenance, host_id="local")),
                    replace(self.observed, source_ref="../secret"),
                    {"status": "READY", "text": "agent says success"}]
        for observed in variants:
            with self.subTest(observed=type(observed).__name__):
                reader = FakeAuthenticatedReader(observed)
                adapter = NativeThreadArtifacts(self.bridge, self.request, self.provenance, reader)
                result = adapter.collect_result(self.request.operation_id, None, self.request.result_paths)
                self.assertEqual(result["state"], "needs_reconcile")
                self.assertEqual(reader.calls, 1)
                with self.assertRaises(RuntimeError):
                    adapter.collect_result(self.request.operation_id, None, self.request.result_paths)

    def test_path_traversal_missing_duplicate_and_hash_conflicts_rejected(self):
        variants = [replace(self.artifact, path="../result.json"),
                    replace(self.artifact, path="/result.json"),
                    replace(self.artifact, path="other.json"),
                    replace(self.artifact, sha256="0" * 64),
                    replace(self.artifact, content=self.raw.decode())]
        for a in variants:
            reader = FakeAuthenticatedReader(replace(self.observed, artifacts=(a,)))
            adapter = NativeThreadArtifacts(self.bridge, self.request, self.provenance, reader)
            self.assertEqual(adapter.collect_result(self.request.operation_id, None,
                                                   self.request.result_paths)["state"], "needs_reconcile")
        for aa in ((), (self.artifact, self.artifact)):
            adapter = NativeThreadArtifacts(self.bridge, self.request, self.provenance,
                         FakeAuthenticatedReader(replace(self.observed, artifacts=aa)))
            self.assertEqual(adapter.collect_result(self.request.operation_id, None,
                                                   self.request.result_paths)["state"], "needs_reconcile")

    def test_ambiguous_noncanonical_oversized_or_conflicting_json_rejected(self):
        bad_values = [b'{"same":1,"same":2}', b'{"value":NaN}', b'"agent narrative"', b'\xff',
                      json.dumps(self.value, indent=2).encode(),
                      canonical_bytes({**self.value, "operation_id": THREAD}),
                      canonical_bytes({**self.value, "repository": {"expected_head": self.request.head,
                                                                     "observed_head": "0" * 40}}),
                      b' ' * (MAX_ARTIFACT_BYTES + 1)]
        for raw in bad_values:
            a = replace(self.artifact, content=raw, sha256=hashlib.sha256(raw).hexdigest())
            adapter = NativeThreadArtifacts(self.bridge, self.request, self.provenance,
                        FakeAuthenticatedReader(replace(self.observed, artifacts=(a,))))
            self.assertEqual(adapter.collect_result(self.request.operation_id, None,
                                                   self.request.result_paths)["state"], "needs_reconcile")

    def test_qa_unverified_review_does_not_use_cli_terminal_authority(self):
        self.event()
        verifier = unittest.mock.Mock()
        result = self.event("qa", "qa-1", replace(self.runtime, qa_verifier=verifier))
        self.assertEqual(result["state"], "awaiting_independent_qa")
        self.assertEqual(result["reason"], "QA_identity_or_result_binding_unverified")
        verifier.verify.assert_called_once()
        self.assertEqual(self.bridge.read(self.request.operation_id)["state"], "submitted")
        self.assertIsNone(self.queue.read_result(self.request.task_id))

    def test_recovery_requires_same_trusted_provenance_not_bundle_claim(self):
        self.event()
        other = NativeThreadArtifacts(self.bridge, self.request,
                                     replace(self.provenance, evidence_ref="fixture:different-proof"), self.reader)
        with self.assertRaises(ValueError):
            _recover_result_bundle(replace(self.runtime, transport=other), self.request)

    def test_output_ids_match_persisted_surface_and_exact_remote(self):
        row = self.bridge.read(self.request.operation_id)
        for remote in (THREAD, "task_e_" + "1" * 32, self.request.operation_id):
            out = _safe_output({"state": "running", "remote_id": remote}, self.request.operation_id, row)
            self.assertEqual(out.get("remote_id"), THREAD if remote == THREAD else None)


if __name__ == "__main__":
    unittest.main()
