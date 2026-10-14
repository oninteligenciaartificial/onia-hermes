"""Filesystem result-store tests; Windows directory fsync is fixture-simulated."""
import hashlib
import json
import os
from pathlib import Path
import stat
import tempfile
import unittest
from unittest.mock import patch

import controller_pilot
import native_result_store
from native_receipt_bridge import NativeWorkRequest
from native_result_store import (
    FileResultSink,
    ResultStoreConflictError,
    ResultStoreIntegrityError,
    ResultStoreNotFoundError,
    ResultStoreError,
    UnsupportedResultStoreError,
)
from native_work_entrypoint import NativeWorkRuntime, handle_native_event


OPERATION_ID = "12345678-1234-1234-1234-123456789abc"
REQUEST_SHA = "a" * 64


def make_request():
    return NativeWorkRequest(
        task_id="task_e_" + "1" * 32,
        worker_id="worker-test",
        contract_id="contract-test",
        repo="onia-hermes",
        ref="codex/hermes-controller-hardening-20261013",
        head="b" * 40,
        input_sha=REQUEST_SHA,
        operation_id=OPERATION_ID,
        nonce="nonce-test",
        plan_sha=REQUEST_SHA,
        approval_claim_ref="claim-test",
        predecessor_task_id="task_e_" + "2" * 32,
        result_paths=("result.json",),
        max_status_events=2,
        max_result_events=1,
    )


def make_bundle(request=None, body=None):
    request = request or make_request()
    content = body if body is not None else b'{"complete":true,"number":7}\n'
    return {
        "state": "awaiting_independent_qa",
        "operation_id": request.operation_id,
        "input_sha": request.input_sha,
        "remote_id": "task_e_" + "3" * 32,
        "files": {
            request.result_paths[0]: {
                "sha256": hashlib.sha256(content).hexdigest(),
                "bytes": len(content),
                "json": json.loads(content),
            },
        },
        "provider_read_attempt_count": 1,
    }


def input_payload(request):
    return json.dumps({
        "schema": 1,
        "event": "result",
        "event_id": "result-event-1",
        "operation_id": request.operation_id,
        "request_sha": request.digest(),
    }, separators=(",", ":")).encode("utf-8")


def make_sink(root, sync_calls=None):
    if os.name == "posix":
        return FileResultSink(root)

    # Fixture-only simulation of directory fsync. It does not establish POSIX
    # owner/mode or power-loss durability and must not be used by a connector.
    def simulated_directory_fsync(_root):
        if sync_calls is not None:
            sync_calls.append("simulated-directory-fsync")

    return FileResultSink(root, _fixture_dir_fsync=simulated_directory_fsync)


class NativeResultStoreTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name) / "private-results"
        self.root.mkdir(mode=0o700)
        if os.name == "posix":
            os.chmod(self.root, 0o700)

    def tearDown(self):
        self.temp.cleanup()

    def test_constructor_requires_absolute_existing_private_posix_root(self):
        with self.assertRaises(ValueError):
            FileResultSink("relative-results")
        with self.assertRaises(ResultStoreError):
            FileResultSink(self.root / "missing")
        if os.name == "posix":
            insecure = self.root / "insecure"
            insecure.mkdir(mode=0o700)
            os.chmod(insecure, 0o755)
            with self.assertRaises(ResultStoreIntegrityError):
                FileResultSink(insecure)
        else:
            with self.assertRaises(UnsupportedResultStoreError):
                FileResultSink(self.root)

    def test_fixture_only_windows_store_marks_simulated_directory_sync(self):
        if os.name == "posix":
            self.skipTest("POSIX uses real directory fsync in this test")
        calls = []
        sink = make_sink(self.root, calls)
        self.assertTrue(calls)
        self.assertEqual(calls[0], "simulated-directory-fsync")

    def test_directory_sync_preflight_failure_fails_closed_before_event_can_run(self):
        def unavailable(_root):
            raise OSError("simulated unsupported directory fsync")

        with self.assertRaises(UnsupportedResultStoreError):
            FileResultSink(self.root, _fixture_dir_fsync=unavailable)

    def test_store_load_after_new_instance_and_identical_store_is_idempotent(self):
        sink = make_sink(self.root)
        bundle_bytes = b'{"full":"bundle bytes"}\n'
        first = sink.store(OPERATION_ID, REQUEST_SHA, bundle_bytes)
        final_path = next(self.root.glob("bundle-*.json"))
        original_stat = final_path.stat()
        second = sink.store(OPERATION_ID, REQUEST_SHA, bundle_bytes)
        restored = make_sink(self.root).load(
            first["ref"], OPERATION_ID, REQUEST_SHA, first["sha256"])
        self.assertEqual(first, second)
        self.assertEqual(restored, bundle_bytes)
        self.assertEqual(final_path.stat().st_ino, original_stat.st_ino)
        self.assertEqual(len(list(self.root.glob("bundle-*.json"))), 1)
        self.assertFalse(list(self.root.glob("*.pending")))

    def test_request_or_content_change_conflicts_without_overwrite(self):
        sink = make_sink(self.root)
        original = b"original-result-bytes"
        receipt = sink.store(OPERATION_ID, REQUEST_SHA, original)
        final_path = next(self.root.glob("bundle-*.json"))
        original_envelope = final_path.read_bytes()
        with self.assertRaises(ResultStoreConflictError):
            sink.store(OPERATION_ID, "c" * 64, original)
        with self.assertRaises(ResultStoreConflictError):
            sink.store(OPERATION_ID, REQUEST_SHA, b"changed-result-bytes")
        self.assertEqual(final_path.read_bytes(), original_envelope)
        self.assertEqual(sink.load(receipt["ref"], OPERATION_ID, REQUEST_SHA,
                                   receipt["sha256"]), original)

    def test_load_rejects_corruption_bad_digest_and_wrong_reference(self):
        sink = make_sink(self.root)
        receipt = sink.store(OPERATION_ID, REQUEST_SHA, b"protected-bundle")
        with self.assertRaises(ResultStoreConflictError):
            sink.load(receipt["ref"], OPERATION_ID, REQUEST_SHA, "e" * 64)
        with self.assertRaises(ResultStoreIntegrityError):
            sink.load("../../outside", OPERATION_ID, REQUEST_SHA, receipt["sha256"])
        final_path = next(self.root.glob("bundle-*.json"))
        raw = bytearray(final_path.read_bytes())
        raw[-2] = ord("A") if raw[-2] != ord("A") else ord("B")
        final_path.write_bytes(raw)
        with self.assertRaises(ResultStoreIntegrityError):
            sink.load(receipt["ref"], OPERATION_ID, REQUEST_SHA, receipt["sha256"])

    def test_load_rejects_nonregular_final_entry(self):
        sink = make_sink(self.root)
        path = self.root / sink._filename(OPERATION_ID)
        path.mkdir()
        with self.assertRaises(ResultStoreIntegrityError):
            sink.load(sink._reference(OPERATION_ID), OPERATION_ID, REQUEST_SHA, "f" * 64)

    def test_load_rejects_final_symlink_when_platform_can_create_one(self):
        sink = make_sink(self.root)
        path = self.root / sink._filename(OPERATION_ID)
        outside = self.root / "outside"
        outside.write_bytes(b"do not follow")
        try:
            path.symlink_to(outside)
        except (OSError, NotImplementedError):
            self.skipTest("symlink creation is unavailable in this fixture environment")
        with self.assertRaises(ResultStoreIntegrityError):
            sink.load(sink._reference(OPERATION_ID), OPERATION_ID, REQUEST_SHA, "f" * 64)

    def test_store_refuses_final_symlink_without_overwriting_target(self):
        sink = make_sink(self.root)
        final = self.root / sink._filename(OPERATION_ID)
        outside = self.root / "external-target"
        outside_bytes = b"keep-this-target"
        outside.write_bytes(outside_bytes)
        try:
            final.symlink_to(outside)
        except (OSError, NotImplementedError):
            self.skipTest("symlink creation is unavailable in this fixture environment")
        with self.assertRaises(ResultStoreIntegrityError):
            sink.store(OPERATION_ID, REQUEST_SHA, b"must-not-follow")
        self.assertTrue(final.is_symlink())
        self.assertEqual(outside.read_bytes(), outside_bytes)

    def test_root_symlink_and_root_fingerprint_change_are_rejected(self):
        symlink = self.root.parent / "results-link"
        try:
            symlink.symlink_to(self.root, target_is_directory=True)
        except (OSError, NotImplementedError):
            symlink = None
        if symlink is not None:
            with self.assertRaises(ResultStoreIntegrityError):
                make_sink(symlink)
        if os.name == "posix":
            sink = make_sink(self.root)
            os.chmod(self.root, 0o700)
            (self.root / "fingerprint-change").write_bytes(b"change root mode metadata")
            os.chmod(self.root, 0o711)
            with self.assertRaises(ResultStoreIntegrityError):
                sink.store(OPERATION_ID, REQUEST_SHA, b"bytes")

    def test_crash_before_publication_leaves_stage_and_no_loadable_result(self):
        sink = make_sink(self.root)
        with patch.object(sink, "_link_noreplace", side_effect=OSError("simulated pre-publish crash")):
            with self.assertRaises(OSError):
                sink.store(OPERATION_ID, REQUEST_SHA, b"stage-before-publication")
        stages = list(self.root.glob("*.pending"))
        self.assertEqual(len(stages), 1)
        self.assertFalse(list(self.root.glob("bundle-*.json")))
        with self.assertRaises(ResultStoreNotFoundError):
            sink.load(sink._reference(OPERATION_ID), OPERATION_ID, REQUEST_SHA,
                      hashlib.sha256(b"stage-before-publication").hexdigest())
        receipt = make_sink(self.root).recover_pending(OPERATION_ID, REQUEST_SHA)
        self.assertEqual(receipt["sha256"], hashlib.sha256(b"stage-before-publication").hexdigest())
        self.assertEqual(make_sink(self.root).load(
            receipt["ref"], OPERATION_ID, REQUEST_SHA, receipt["sha256"]),
            b"stage-before-publication")

    def test_corrupt_or_wrong_identity_pending_candidate_fails_closed(self):
        sink = make_sink(self.root)
        pending = self.root / f".{sink._filename(OPERATION_ID)}.pending"
        pending.write_bytes(b'{"partial":')
        with self.assertRaises(ResultStoreIntegrityError):
            sink.recover_pending(OPERATION_ID, REQUEST_SHA)
        pending.unlink()
        with patch.object(sink, "_link_noreplace", side_effect=OSError("simulated pre-publish crash")):
            with self.assertRaises(OSError):
                sink.store(OPERATION_ID, REQUEST_SHA, b"bound-to-original-request")
        with self.assertRaises(ResultStoreConflictError):
            make_sink(self.root).recover_pending(OPERATION_ID, "c" * 64)

    def test_pending_different_requested_bytes_conflict_without_publication(self):
        sink = make_sink(self.root)
        candidate = b"candidate-A"
        with patch.object(sink, "_link_noreplace", side_effect=OSError("simulated pre-publish crash")):
            with self.assertRaises(OSError):
                sink.store(OPERATION_ID, REQUEST_SHA, candidate)
        pending = self.root / f".{sink._filename(OPERATION_ID)}.pending"
        candidate_envelope = pending.read_bytes()
        with self.assertRaises(ResultStoreConflictError):
            make_sink(self.root).store(OPERATION_ID, REQUEST_SHA, b"different-B")
        self.assertFalse((self.root / sink._filename(OPERATION_ID)).exists())
        self.assertEqual(pending.read_bytes(), candidate_envelope)
        receipt = make_sink(self.root).recover_pending(OPERATION_ID, REQUEST_SHA)
        self.assertEqual(make_sink(self.root).load(
            receipt["ref"], OPERATION_ID, REQUEST_SHA, receipt["sha256"]), candidate)

    def test_recovery_fsyncs_open_candidate_inode_and_fails_closed_on_sync_error(self):
        sink = make_sink(self.root)
        candidate = b"complete-but-not-known-flushed"

        def complete_stage_then_interrupt(stage_path, encoded):
            descriptor = os.open(stage_path, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
            try:
                os.write(descriptor, encoded)
            finally:
                os.close(descriptor)
            raise OSError("simulated crash before stage fsync")

        with patch.object(sink, "_write_stage", side_effect=complete_stage_then_interrupt):
            with self.assertRaises(OSError):
                sink.store(OPERATION_ID, REQUEST_SHA, candidate)
        pending = self.root / f".{sink._filename(OPERATION_ID)}.pending"
        self.assertTrue(pending.is_file())
        recovery_sink = make_sink(self.root)
        with patch.object(native_result_store.os, "fsync", side_effect=OSError("simulated recovery fsync failure")):
            with self.assertRaises(OSError):
                recovery_sink.recover_pending(OPERATION_ID, REQUEST_SHA)
        self.assertFalse((self.root / sink._filename(OPERATION_ID)).exists())
        receipt = recovery_sink.recover_pending(OPERATION_ID, REQUEST_SHA)
        self.assertEqual(make_sink(self.root).load(
            receipt["ref"], OPERATION_ID, REQUEST_SHA, receipt["sha256"]), candidate)

    def test_crash_after_publication_is_reconciled_without_rewrite(self):
        sink = make_sink(self.root)
        bundle_bytes = b"published-before-ack"
        with patch.object(sink, "_remove_stage", side_effect=OSError("simulated post-publish crash")):
            with self.assertRaises(OSError):
                sink.store(OPERATION_ID, REQUEST_SHA, bundle_bytes)
        final_path = self.root / sink._filename(OPERATION_ID)
        published_bytes = final_path.read_bytes()
        published_stat = final_path.stat()
        stage_paths = list(self.root.glob("*.pending"))
        self.assertTrue(final_path.is_file())
        self.assertEqual(len(stage_paths), 1)
        self.assertEqual(sink.load(sink._reference(OPERATION_ID), OPERATION_ID, REQUEST_SHA,
                                   hashlib.sha256(bundle_bytes).hexdigest()), bundle_bytes)
        receipt = sink.store(OPERATION_ID, REQUEST_SHA, bundle_bytes)
        self.assertEqual(receipt["sha256"], hashlib.sha256(bundle_bytes).hexdigest())
        self.assertEqual(final_path.read_bytes(), published_bytes)
        self.assertEqual(final_path.stat().st_ino, published_stat.st_ino)
        self.assertEqual(len(list(self.root.glob("*.pending"))), 1)

    def test_handle_event_to_store_to_restart_load_uses_step_mock_only(self):
        request = make_request()
        bundle = make_bundle(request)
        sink = make_sink(self.root)
        runtime = NativeWorkRuntime(
            queue=object(), bridge=object(), transport=object(), request=request,
            plan=object(), result_sink=sink,
        )
        with patch.object(controller_pilot, "step_native_work", return_value=bundle) as step:
            response = handle_native_event(input_payload(request), runtime, now=123)
        step.assert_called_once()
        self.assertEqual(response["state"], "awaiting_independent_qa")
        self.assertNotIn("files", response)
        loaded = make_sink(self.root).load(
            response["result_bundle_ref"], request.operation_id, request.digest(),
            response["result_bundle_sha256"],
        )
        expected = json.dumps(bundle, sort_keys=True, separators=(",", ":"),
                              ensure_ascii=False, allow_nan=False).encode("utf-8")
        self.assertEqual(loaded, expected)
        self.assertEqual(response["result_bundle_sha256"], hashlib.sha256(expected).hexdigest())

    def test_result_bundle_bounds_and_invalid_identity_fail_before_write(self):
        sink = make_sink(self.root)
        with self.assertRaises(ValueError):
            sink.store("../bad", REQUEST_SHA, b"bytes")
        with self.assertRaises(ValueError):
            sink.store(OPERATION_ID, "A" * 64, b"bytes")
        with self.assertRaises(ValueError):
            sink.store(OPERATION_ID, REQUEST_SHA, b"x" * (1024 * 1024 + 1))
        self.assertFalse(list(self.root.iterdir()))


if __name__ == "__main__":
    unittest.main()
