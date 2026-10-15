"""Offline-copy v4 migration and failed closure candidate; never auto-migrates.

Not connected to the real controller. Root review/authorization remains external.
No provider calls, dispatch, reset, nonce renewal or successful predecessor bypass.
"""
import argparse
import hashlib
import json
from pathlib import Path
import re
import sqlite3


def canonical(value):return json.dumps(value,sort_keys=True,separators=(',',':'))
def digest(raw):return hashlib.sha256(raw).hexdigest()


def offline_path(path):
    source=Path(path)
    if source.is_symlink():raise ValueError('symlink copy rejected')
    path=source.resolve()
    if not path.name.endswith('.offline.sqlite3') or not path.is_file() or path.stat().st_size>64*1024*1024:
        raise ValueError('existing explicit .offline.sqlite3 copy required')
    return path


def migrate_copy(path, before_commit=None):
    path=offline_path(path)
    backup=path.with_suffix('.pre-v4.sqlite3')
    if backup.exists():raise FileExistsError('write-once backup already exists')
    conn=sqlite3.connect(path,isolation_level=None)
    try:
        if conn.execute('PRAGMA user_version').fetchone()[0]!=3:
            raise ValueError('exact v3 input required')
        if conn.execute('PRAGMA foreign_key_check').fetchone():raise ValueError('preexisting FK failure')
        sql=conn.execute("SELECT sql FROM sqlite_master WHERE type='table' AND name='tasks'").fetchone()[0]
        changes={"('pending','running','needs_reconcile','blocked','done')":
                    "('pending','running','needs_reconcile','blocked','done','failed')",
                 "('not_started','in_flight','needs_reconcile','applied')":
                    "('not_started','in_flight','needs_reconcile','applied','failed')"}
        for old,new in changes.items():
            if sql.count(old)!=1:raise ValueError('unexpected v3 CHECK layout')
            sql=sql.replace(old,new,1)
        if not sql.startswith('CREATE TABLE tasks '):raise ValueError('unexpected tasks DDL')
        new_sql=sql.replace('CREATE TABLE tasks ','CREATE TABLE tasks_v4 ',1)
        indexes=[r[0] for r in conn.execute("SELECT sql FROM sqlite_master WHERE type='index' AND tbl_name='tasks' AND sql IS NOT NULL")]
        columns=[r[1] for r in conn.execute('PRAGMA table_info(tasks)')]
        if any(not re.fullmatch('[a-z_]+',c) for c in columns):raise ValueError('unexpected columns')
        # SQLite backup is a consistent snapshot; no raw DB is committed to Git.
        fd=__import__('os').open(backup,__import__('os').O_WRONLY|__import__('os').O_CREAT|__import__('os').O_EXCL,0o600)
        __import__('os').close(fd)
        target=sqlite3.connect(backup)
        try:conn.backup(target)
        finally:target.close()
        conn.execute('PRAGMA foreign_keys=OFF')
        conn.execute('BEGIN IMMEDIATE')
        try:
            conn.execute(new_sql)
            names=','.join('"'+c+'"' for c in columns)
            conn.execute(f'INSERT INTO tasks_v4({names}) SELECT {names} FROM tasks')
            conn.execute('DROP TABLE tasks')
            conn.execute('ALTER TABLE tasks_v4 RENAME TO tasks')
            for statement in indexes:conn.execute(statement)
            conn.execute('PRAGMA user_version=4')
            if conn.execute('PRAGMA foreign_key_check').fetchone():raise ValueError('migration FK failure')
            if before_commit:before_commit()
            conn.commit()
        except BaseException:
            conn.rollback();raise
        finally:conn.execute('PRAGMA foreign_keys=ON')
    finally:conn.close()
    return {'schema':1,'state':'OFFLINE_MIGRATED','version':4,
            'backup_sha256':digest(backup.read_bytes()),'migrated_sha256':digest(path.read_bytes())}


def rollback_copy(path, receipt):
    path=offline_path(path);backup=path.with_suffix('.pre-v4.sqlite3')
    if (digest(path.read_bytes())!=receipt['migrated_sha256']
            or digest(backup.read_bytes())!=receipt['backup_sha256']):
        raise ValueError('changed database/backup; no blind rollback')
    # Offline only; restore a verified snapshot, never discard intervening events.
    source=sqlite3.connect(backup);target=sqlite3.connect(path)
    try:source.backup(target)
    finally:target.close();source.close()


def open_offline_queue_v4(path):
    """Candidate adapter only. Existing SQLiteQueue keeps v3 behavior unchanged."""
    from sqlite_pilot import SQLiteQueue
    path=offline_path(path)
    class OfflineQueueV4(SQLiteQueue):
        DB_SCHEMA_VERSION=4
        def _initialize(self):
            with self._connection() as conn:
                if conn.execute('PRAGMA user_version').fetchone()[0]!=4:
                    raise ValueError('explicit offline migration required')
                if conn.execute('PRAGMA foreign_key_check').fetchone():
                    raise ValueError('invalid offline migrated database')
    return OfflineQueueV4(path)


def finalize_failed_copy(path, *, operation_id, input_sha, nonce, observation_sha,
                         evidence_ref, now):
    """Explicit fail-only transaction on a copy; review ref is not authentication.

    A real controller must authenticate Root's mutation approval separately. This
    offline candidate cannot create that authority from a string or boolean.
    """
    path=offline_path(path)
    if (not isinstance(evidence_ref,str) or not evidence_ref.startswith('root-reviewed:')
            or len(evidence_ref)>512 or type(now) is not int):
        raise ValueError('independently reviewed evidence/time required')
    conn=sqlite3.connect(path,isolation_level=None);conn.row_factory=sqlite3.Row
    try:
        conn.execute('PRAGMA foreign_keys=ON');conn.execute('BEGIN IMMEDIATE')
        if conn.execute('PRAGMA user_version').fetchone()[0]!=4:raise ValueError('explicit v4 migration required')
        n=conn.execute('SELECT * FROM native_operations WHERE operation_id=?',(operation_id,)).fetchone()
        if (n is None or n['state']!='failed' or n['input_sha']!=input_sha or n['nonce']!=nonce
                or n['observation_digest']!=observation_sha or n['observation_json'] is None
                or digest(n['observation_json'].encode())!=observation_sha):
            raise ValueError('exact failed native observation binding required')
        o=json.loads(n['observation_json'])
        if (o.get('state')!='failed' or o.get('operation_id')!=operation_id
                or o.get('input_sha')!=input_sha or o.get('remote_id')!=n['remote_id']
                or o.get('surface')!=n['surface'] or o.get('observed_at')!=n['observed_at']
                or now<n['observed_at']):
            raise ValueError('native observation contents/time mismatch')
        task=conn.execute('SELECT * FROM tasks WHERE task_id=?',(n['task_id'],)).fetchone()
        expected={'result':'failed_frozen','operation_id':operation_id,'input_sha':input_sha,
                  'nonce':nonce,'observation_sha256':observation_sha,'evidence_ref':evidence_ref,
                  'observation':o,'replay_allowed':False}
        raw=canonical(expected);sha=digest(raw.encode())
        previous=conn.execute('SELECT * FROM task_results WHERE task_id=?',(n['task_id'],)).fetchone()
        if previous:
            if (previous['evidence_json']==raw and previous['evidence_digest']==sha
                    and task['status']=='failed' and task['effect_state']=='failed'):
                conn.rollback();return sha
            raise ValueError('conflicting terminal receipt')
        if (task['status']!='needs_reconcile' or task['effect_state']!='needs_reconcile'
                or task['effect_key']!=operation_id or task['effect_name']!='native_execution'
                or task['input_sha']!=input_sha or task['ambiguous_owner_id']!=n['owner_id']
                or task['ambiguous_fencing_token']!=n['fencing_token']):
            raise ValueError('task/effect/owner binding mismatch')
        if conn.execute('SELECT 1 FROM worker_leases WHERE task_id=?',(n['task_id'],)).fetchone():
            raise ValueError('active or stale task lease requires separate review')
        conn.execute('INSERT INTO task_results(task_id,owner_id,fencing_token,evidence_json,evidence_digest,closed_at) VALUES(?,?,?,?,?,?)',
                     (n['task_id'],n['owner_id'],n['fencing_token'],raw,sha,now))
        conn.execute("UPDATE tasks SET status='failed',effect_state='failed',last_evidence=?,updated_at=? WHERE task_id=?",
                     ('failed_frozen:'+sha,now,n['task_id']))
        # Native row, nonce, dispatch, events, STOP, fences and lease tables untouched.
        conn.commit();return sha
    except BaseException:
        conn.rollback();raise
    finally:conn.close()


def main():
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument('--database-copy',type=Path);p.add_argument('--execute-migration',action='store_true')
    a=p.parse_args()
    if not a.execute_migration:print('{"state":"DRY_RUN","real_queue_changed":false}');return
    if a.database_copy is None:p.error('--database-copy required')
    print(json.dumps(migrate_copy(a.database_copy),sort_keys=True))


if __name__=='__main__':main()
