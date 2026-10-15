"""Fresh synthetic SQLite only; no live queue or provider calls."""
from dataclasses import replace
from pathlib import Path
import sqlite3
import sys
import tempfile
import unittest

sys.path.insert(0,str(Path(__file__).resolve().parents[3]))
from controller_pilot import ControllerPilot, FakeSessionFactory, Goal
from native_receipt_bridge import NativeReceiptBridge, NativeObservation
from sqlite_pilot import SQLiteQueue
import queue_failure_candidate as candidate

OP='00000000-0000-0000-0000-000000000111'


class FailureCandidateTests(unittest.TestCase):
    def setUp(self):
        self.area=tempfile.TemporaryDirectory();self.addCleanup(self.area.cleanup)
        self.path=Path(self.area.name)/'test.offline.sqlite3'
        self.queue=SQLiteQueue(self.path)
        ctl=ControllerPilot(self.queue,FakeSessionFactory())
        self.goal=Goal('task','worker','onia','SYNTHETIC: failed closure','fixture-only',1,
                       'repo','codex/test','a'*40,'contract')
        ctl.enqueue(self.goal,100);claim=ctl.claim(self.goal,'owner',101).claim
        self.claim=claim
        self.bridge=NativeReceiptBridge(self.queue)
        self.bridge.reserve(claim,OP,'nonce-test','test:authorization',102,'c'*64)
        self.bridge.ingest(NativeObservation(OP,'cloud_cli_task','task_e_'+'a'*32,
            self.goal.input_sha(),'failed',103,'SYNTHETIC:observed-setup-failure'),103)
        self.args=dict(operation_id=OP,input_sha=self.goal.input_sha(),nonce='nonce-test',
            observation_sha=self.bridge.read(OP)['observation_digest'],
            evidence_ref='root-reviewed:SYNTHETIC:offline-only',now=104)

    def dump(self):
        c=sqlite3.connect(self.path)
        try:return tuple(c.iterdump())
        finally:c.close()

    def test_migration_preserves_rows_and_verified_rollback(self):
        before=self.dump();receipt=candidate.migrate_copy(self.path)
        self.assertEqual(self.bridge.read(OP)['state'],'failed')
        candidate.rollback_copy(self.path,receipt)
        self.assertEqual(self.dump(),before)

    def test_failure_mid_migration_rolls_back(self):
        before=self.dump()
        def fail():raise RuntimeError('SYNTHETIC injected transaction failure')
        with self.assertRaises(RuntimeError):candidate.migrate_copy(self.path,fail)
        self.assertEqual(self.dump(),before)

    def test_failed_closure_idempotent_without_reset_or_unrelated_mutation(self):
        native=self.bridge.read(OP);candidate.migrate_copy(self.path)
        sha=candidate.finalize_failed_copy(self.path,**self.args)
        snapshot=self.dump()
        self.assertEqual(candidate.finalize_failed_copy(self.path,**self.args),sha)
        self.assertEqual(self.dump(),snapshot)
        self.assertEqual(self.bridge.read(OP),native)
        self.assertEqual(self.queue.read_result('task')['result'],'failed_frozen')
        self.assertEqual(self.queue.claim('worker','other',105,30).status,'no_work')
        # Historical public reconciliation API cannot re-open a terminal failed task.
        with self.assertRaises(RuntimeError):
            self.queue.resolve_reconciliation('task','not_applied','SYNTHETIC',106)
        with self.assertRaises(RuntimeError):
            self.bridge.reserve(self.claim,OP,'new','test',106,'c'*64)

    def test_crossed_bindings_and_conflicting_repeat_roll_back(self):
        candidate.migrate_copy(self.path);before=self.dump()
        for key,value in [('operation_id','wrong'),('input_sha','0'*64),
                          ('nonce','other'),('observation_sha','0'*64),('now',102)]:
            with self.subTest(key=key), self.assertRaises(ValueError):
                args=dict(self.args);args[key]=value;candidate.finalize_failed_copy(self.path,**args)
            self.assertEqual(self.dump(),before)
        candidate.finalize_failed_copy(self.path,**self.args);before=self.dump()
        args=dict(self.args,evidence_ref='root-reviewed:SYNTHETIC:conflict')
        with self.assertRaises(ValueError):candidate.finalize_failed_copy(self.path,**args)
        self.assertEqual(self.dump(),before)

    def test_rollback_refuses_events_after_migration(self):
        receipt=candidate.migrate_copy(self.path)
        candidate.finalize_failed_copy(self.path,**self.args)
        with self.assertRaises(ValueError):candidate.rollback_copy(self.path,receipt)

    def test_one_queue_same_worker_independent_fixture_after_failed_closure(self):
        from sqlite_pilot import TaskSpec
        native=self.bridge.read(OP)
        self.queue.enqueue(TaskSpec('next','worker','repo','codex/test','a'*40,
                                    'independent-fixture','b'*64),104)
        self.assertEqual(self.queue.claim('worker','next-owner',105,20).status,'needs_reconcile')
        candidate.migrate_copy(self.path)
        candidate.finalize_failed_copy(self.path,**self.args)
        reopened=candidate.open_offline_queue_v4(self.path)
        claim=reopened.claim('worker','next-owner',106,20).claim
        self.assertEqual(claim.task_id,'next')
        reopened.complete(claim,107,'SYNTHETIC:no-provider-effect')
        self.assertEqual(reopened.read_result('next')['result'],'completed')
        self.assertEqual(self.bridge.read(OP),native)
        self.assertEqual(reopened.claim('worker','other',108,20).status,'no_work')

    def test_failure_during_closure_rolls_back_receipt_and_state(self):
        candidate.migrate_copy(self.path)
        c=sqlite3.connect(self.path)
        c.execute("CREATE TRIGGER injected_failure BEFORE UPDATE ON tasks BEGIN SELECT RAISE(ABORT,'SYNTHETIC'); END")
        c.commit();c.close();before=self.dump()
        with self.assertRaises(sqlite3.IntegrityError):
            candidate.finalize_failed_copy(self.path,**self.args)
        self.assertEqual(self.dump(),before)
        self.assertIsNone(self.queue.read_result('task'))


if __name__=='__main__':unittest.main()
