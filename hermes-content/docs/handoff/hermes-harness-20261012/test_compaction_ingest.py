from __future__ import annotations

import json
import sqlite3
import tempfile
import time
import unittest
from concurrent.futures import ThreadPoolExecutor
from contextlib import contextmanager
from datetime import datetime, timedelta, timezone
from pathlib import Path
from types import MappingProxyType
from unittest.mock import patch

from desktop_context_meter import CompactionReceipt, _compaction_event_key
from sqlite_pilot import SQLiteQueue, TaskSpec
from compaction_ingest import PREAUTHORIZED_SOURCE_BINDINGS, SourceBinding, ingest_compaction_once


SESSION = "synthetic-session-only"
WORKER = "synthetic-worker"
TASK = "synthetic-task"
NOW = int(time.time())


@contextmanager
def db_connection(path):
    conn = sqlite3.connect(path)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()


def source_bytes(timestamp: datetime, *, session: str = SESSION) -> bytes:
    rows = [
        {"type": "session_meta", "payload": {"id": session}},
        {"type": "compacted", "timestamp": timestamp.astimezone(timezone.utc).isoformat().replace("+00:00", "Z")},
    ]
    return b"".join(json.dumps(row).encode("utf-8") + b"\n" for row in rows)


class CompactionIngestTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)
        self.database = self.root / "queue.sqlite3"
        self.source = self.root / "fixture.jsonl"
        self.queue = SQLiteQueue(self.database)
        self.queue.enqueue(TaskSpec(TASK, WORKER, "fixture/repo", "codex/fixture", "a" * 40,
                                    "fixture-contract", "b" * 64), NOW)
        self.claim = self.queue.claim(WORKER, "fixture-owner", NOW, 3600).claim
        self.assertIsNotNone(self.claim)
        self._create_guard(stopped=0)

    def tearDown(self):
        self.temp.cleanup()

    def _create_guard(self, *, stopped: int):
        with db_connection(self.database) as conn:
            conn.execute("""CREATE TABLE IF NOT EXISTS controller_guard_state (
                singleton INTEGER PRIMARY KEY CHECK(singleton=1),
                stopped INTEGER NOT NULL CHECK(stopped IN (0,1)),
                epoch INTEGER NOT NULL, reason TEXT, updated_at INTEGER NOT NULL)""")
            conn.execute("INSERT OR REPLACE INTO controller_guard_state VALUES(1,?,?,?,?)",
                         (stopped, int(stopped), "synthetic fixture", NOW))

    def _binding(self, *, acknowledged_event_key=None):
        return SourceBinding(
            binding_id="fixture-source", source_path=self.source,
            expected_session_id=SESSION, worker_id=WORKER, task_id=TASK,
            acknowledged_event_key=acknowledged_event_key,
        )

    def _authorized(self, binding=None):
        if not self.source.exists():
            self.source.write_bytes(source_bytes(datetime.now(timezone.utc) - timedelta(hours=1)))
        if binding is None:
            binding = self._binding()
        return patch(
            "compaction_ingest.PREAUTHORIZED_SOURCE_BINDINGS",
            MappingProxyType({binding.binding_id: binding}),
        )

    def _intent_count(self, database=None):
        database = database or self.database
        with db_connection(database) as conn:
            found = conn.execute("SELECT name FROM sqlite_master WHERE type='table' AND name=?",
                                 ("compaction_checkpoint_intents",)).fetchone()
            if found is None:
                return 0
            return conn.execute("SELECT COUNT(*) FROM compaction_checkpoint_intents").fetchone()[0]

    def test_two_concurrent_ingesters_create_one_intent_and_replay_after_reopen(self):
        with self._authorized():
            with ThreadPoolExecutor(max_workers=2) as pool:
                results = list(pool.map(
                    lambda _: ingest_compaction_once(self.queue, "fixture-source", self.claim),
                    range(2),
                ))
            self.assertEqual({result.status for result in results}, {"requested", "duplicate"})
            self.assertEqual(results[0].intent_id, results[1].intent_id)
            self.assertEqual(self._intent_count(), 1)
            with db_connection(self.database) as conn:
                row = conn.execute(
                    "SELECT * FROM compaction_checkpoint_intents WHERE intent_id=?",
                    (results[0].intent_id,),
                ).fetchone()
                values = " ".join(str(value) for value in row)
                self.assertNotIn(SESSION, values)
                self.assertNotIn(str(self.source), values)
                self.assertEqual(row["state"], "requested")
                self.assertEqual(row["task_id"], TASK)
            reopened = SQLiteQueue(self.database)
            replay = ingest_compaction_once(reopened, "fixture-source", self.claim)
        self.assertEqual(replay.status, "duplicate")
        self.assertEqual(replay.intent_id, results[0].intent_id)
        self.assertEqual(self._intent_count(), 1)

    def test_old_compaction_with_fresh_validated_observation_is_retained(self):
        old_timestamp = datetime.now(timezone.utc) - timedelta(days=2)
        self.source.write_bytes(source_bytes(old_timestamp))
        with self._authorized():
            result = ingest_compaction_once(self.queue, "fixture-source", self.claim)
        self.assertEqual(result.status, "requested")
        self.assertEqual(self._intent_count(), 1)

    def test_stale_local_observation_is_held_after_transaction_lock(self):
        now = datetime.now(timezone.utc)
        old_event = now - timedelta(days=2)
        old_receipt = CompactionReceipt(
            1, "fixture-source", _compaction_event_key(SESSION, old_event),
            old_event.isoformat().replace("+00:00", "Z"),
            now.isoformat().replace("+00:00", "Z"), "validated",
        )

        class AdvancingClock:
            @classmethod
            def now(cls, tz=None):
                return next(cls.readings)

        AdvancingClock.readings = iter((now, now, now + timedelta(seconds=301)))

        with self._authorized():
            with patch("compaction_ingest.read_compaction_receipt", return_value=old_receipt), \
                 patch("compaction_ingest.datetime", AdvancingClock):
                result = ingest_compaction_once(self.queue, "fixture-source", self.claim)
        self.assertEqual(result.status, "held_receipt_stale")
        self.assertEqual(self._intent_count(), 0)

    def test_missing_binding_and_caller_fabricated_receipt_are_rejected(self):
        self.assertEqual(dict(PREAUTHORIZED_SOURCE_BINDINGS), {})
        with self.assertRaises(TypeError):
            PREAUTHORIZED_SOURCE_BINDINGS["unauthorized"] = self._binding()
        result = ingest_compaction_once(self.queue, "not-configured", self.claim)
        self.assertEqual(result.status, "held_source_unbound")
        with self.assertRaises(TypeError):
            ingest_compaction_once(self.queue, "not-configured", self.claim,
                                   receipt={"event_key": "f" * 64})
        self.assertEqual(self._intent_count(), 0)

    def test_stale_fence_is_rejected_without_intent(self):
        newer = self.queue.claim(WORKER, "replacement-owner", NOW + 3601, 3600)
        self.assertEqual(newer.status, "claimed")
        with self._authorized():
            result = ingest_compaction_once(self.queue, "fixture-source", self.claim)
        self.assertEqual(result.status, "held_lease_lost")
        self.assertEqual(self._intent_count(), 0)

    def test_binding_mismatch_and_non_running_task_are_rejected(self):
        self.source.write_bytes(source_bytes(datetime.now(timezone.utc)))
        wrong_binding = SourceBinding("fixture-source", self.source, SESSION,
                                      WORKER, "different-task")
        with patch("compaction_ingest.PREAUTHORIZED_SOURCE_BINDINGS",
                   MappingProxyType({wrong_binding.binding_id: wrong_binding})):
            mismatch = ingest_compaction_once(self.queue, "fixture-source", self.claim)
        self.assertEqual(mismatch.status, "held_binding_mismatch")
        self.assertEqual(self._intent_count(), 0)

        with db_connection(self.database) as conn:
            conn.execute("UPDATE tasks SET status='blocked' WHERE task_id=?", (TASK,))
        with self._authorized():
            not_running = ingest_compaction_once(self.queue, "fixture-source", self.claim)
        self.assertEqual(not_running.status, "held_task_not_running")
        self.assertEqual(self._intent_count(), 0)

    def test_stop_and_unknown_stop_guard_fail_closed(self):
        with self._authorized():
            with db_connection(self.database) as conn:
                conn.execute("UPDATE controller_guard_state SET stopped=1,epoch=epoch+1 WHERE singleton=1")
            stopped = ingest_compaction_once(self.queue, "fixture-source", self.claim)
        self.assertEqual(stopped.status, "held_stopped")
        self.assertEqual(self._intent_count(), 0)

        db2 = self.root / "missing-guard.sqlite3"
        queue2 = SQLiteQueue(db2)
        queue2.enqueue(TaskSpec("task-no-guard", "worker-no-guard", "fixture/repo", "codex/fixture",
                                "c" * 40, "fixture-contract", "d" * 64), NOW)
        claim2 = queue2.claim("worker-no-guard", "owner-no-guard", NOW, 3600).claim
        binding2 = SourceBinding("no-guard-source", self.source, SESSION,
                                 "worker-no-guard", "task-no-guard")
        self.source.write_bytes(source_bytes(datetime.now(timezone.utc)))
        with patch("compaction_ingest.PREAUTHORIZED_SOURCE_BINDINGS",
                   MappingProxyType({binding2.binding_id: binding2})):
            unknown = ingest_compaction_once(queue2, "no-guard-source", claim2)
            self.assertEqual(unknown.status, "held_stop_unknown")
            self.assertEqual(self._intent_count(db2), 0)
            with db_connection(db2) as conn:
                conn.execute("""CREATE TABLE controller_guard_state (
                    singleton INTEGER PRIMARY KEY CHECK(singleton=1), stopped INTEGER NOT NULL,
                    epoch INTEGER NOT NULL, reason TEXT, updated_at INTEGER NOT NULL)""")
            no_row = ingest_compaction_once(queue2, "no-guard-source", claim2)
        self.assertEqual(no_row.status, "held_stop_unknown")
        self.assertEqual(self._intent_count(db2), 0)

    def test_inflight_effect_keeps_checkpoint_effect_and_lease_unchanged(self):
        initial = {"schema": 1, "repo": "fixture/repo", "ref": "codex/fixture",
                   "sha": "a" * 40, "contract_id": "fixture-contract", "input_sha": "b" * 64,
                   "step": "running", "status": "running", "evidence": {"marker": "keep"}}
        self.queue.save_checkpoint(self.claim, initial, NOW)
        self.queue.mark_effect_in_flight(self.claim, "synthetic-effect", NOW)
        with db_connection(self.database) as conn:
            before = conn.execute(
                "SELECT checkpoint_json,checkpoint_digest,effect_state,effect_key,status FROM tasks WHERE task_id=?",
                (TASK,),
            ).fetchone()
            lease_before = conn.execute("SELECT owner_id,fencing_token,expires_at FROM worker_leases WHERE worker_id=?",
                                        (WORKER,)).fetchone()
        with self._authorized():
            result = ingest_compaction_once(self.queue, "fixture-source", self.claim)
        with db_connection(self.database) as conn:
            after = conn.execute(
                "SELECT checkpoint_json,checkpoint_digest,effect_state,effect_key,status FROM tasks WHERE task_id=?",
                (TASK,),
            ).fetchone()
            lease_after = conn.execute("SELECT owner_id,fencing_token,expires_at FROM worker_leases WHERE worker_id=?",
                                       (WORKER,)).fetchone()
        self.assertEqual(result.status, "held_effect_ambiguous")
        self.assertEqual(before, after)
        self.assertEqual(lease_before, lease_after)
        self.assertEqual(self._intent_count(), 0)
        with db_connection(self.database) as conn:
            conn.execute("UPDATE tasks SET effect_state='needs_reconcile' WHERE task_id=?", (TASK,))
        with self._authorized():
            reconcile = ingest_compaction_once(self.queue, "fixture-source", self.claim)
        self.assertEqual(reconcile.status, "held_effect_ambiguous")
        self.assertEqual(self._intent_count(), 0)

    def test_baseline_event_key_only_dedupes_and_does_not_transfer_ownership(self):
        timestamp = datetime.now(timezone.utc)
        self.source.write_bytes(source_bytes(timestamp))
        from desktop_context_meter import _compaction_event_key
        event_key = _compaction_event_key(SESSION, timestamp)
        binding = self._binding(acknowledged_event_key=event_key)
        with self._authorized(binding):
            result = ingest_compaction_once(self.queue, "fixture-source", self.claim)
        self.assertEqual(result.status, "baseline_seen")
        self.assertIsNone(result.intent_id)
        self.assertEqual(self._intent_count(), 0)
        with db_connection(self.database) as conn:
            self.assertEqual(tuple(conn.execute(
                "SELECT owner_id,fencing_token FROM worker_leases WHERE worker_id=?",
                (WORKER,),
            ).fetchone()), (self.claim.owner_id, self.claim.fencing_token))
            self.assertEqual(conn.execute("SELECT COUNT(*) FROM handoffs").fetchone()[0], 0)

    def test_no_client_session_or_transport_dependency_is_accepted(self):
        import inspect
        self.assertEqual(set(inspect.signature(ingest_compaction_once).parameters),
                         {"queue", "binding_id", "claim"})


if __name__ == "__main__":
    unittest.main()
