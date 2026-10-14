"""Local native execution ledger in the existing queue; no provider calls.

The mother may reserve an operation before an authorized native dispatch, then
import its observed receipt. Imported observations are evidence, not verified
provider authority or QA. No method dispatches, retries, cancels or closes tasks.
"""
from dataclasses import dataclass, asdict
import hashlib
import json
import re

from sqlite_pilot import Claim, SQLiteQueue


_HASH = re.compile(r"[0-9a-f]{64}")
_TASK = re.compile(r"task_e_[0-9a-f]{32}")
_UUID = re.compile(r"[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}")
_TERMINAL = frozenset(("completed", "failed", "cancelled"))
_STATES = frozenset(("submitted", "running", "unknown")) | _TERMINAL


def _text(value, name):
    if not isinstance(value, str) or not value.strip() or len(value) > 512:
        raise ValueError(f"invalid {name}")
    return value


def _time(value):
    if type(value) is not int or value < 0:
        raise ValueError("timestamp must be a nonnegative integer")


@dataclass(frozen=True)
class NativeObservation:
    operation_id: str
    surface: str  # cloud_cli_task or codex_app_chat: never interchangeable
    remote_id: str
    input_sha: str
    state: str
    observed_at: int
    evidence_ref: str
    result_sha: str | None = None
    model_observed: str = "UNKNOWN"
    usage_observed: str = "UNKNOWN"


class NativeReceiptBridge:
    @staticmethod
    def bootstrap_guard(queue: SQLiteQueue, authority_ref: str,
                        reviewed_plan_sha: str, now: int) -> dict:
        """First initialization of a NEW empty pilot DB, never a STOP reset.

        The authorized caller supplies the reviewed human authority reference.
        This records that assertion; it does not authenticate the caller. Call
        before constructing the bridge or enqueueing the pilot's real TaskSpec.
        No provider/fixture controller is involved and no dispatch occurs here.
        """
        _text(authority_ref, "authority_ref")
        _time(now)
        if not isinstance(reviewed_plan_sha, str) or not _HASH.fullmatch(reviewed_plan_sha):
            raise ValueError("bootstrap requires reviewed plan SHA-256")
        receipt = {"schema": 1, "authority_ref": authority_ref,
                   "reviewed_plan_sha": reviewed_plan_sha, "initialized_at": now,
                   "scope": "single_native_pilot", "initial_stop_epoch": 0}
        payload = json.dumps(receipt, sort_keys=True, separators=(",", ":"))
        digest = hashlib.sha256(payload.encode("utf-8")).hexdigest()
        with queue._connection() as conn:
            conn.execute("BEGIN IMMEDIATE")
            existing = {row[0] for row in conn.execute(
                "SELECT name FROM sqlite_master WHERE type='table'")}
            if existing & {"controller_guard_state", "native_operations", "native_guard_bootstrap"}:
                raise RuntimeError("guard/native pilot already initialized; no reinit or STOP reset")
            # A new queue has only its schema. Any prior task/result/fence/handoff
            # means this is not a pristine instance, even if tasks were removed.
            for table in ("tasks", "worker_fences", "worker_leases", "handoffs", "task_results"):
                if conn.execute(f"SELECT 1 FROM {table} LIMIT 1").fetchone() is not None:
                    raise RuntimeError("bootstrap requires a pristine empty queue")
            conn.execute("""CREATE TABLE controller_guard_state (
                singleton INTEGER PRIMARY KEY CHECK(singleton=1),
                stopped INTEGER NOT NULL CHECK(stopped IN (0,1)),
                epoch INTEGER NOT NULL, reason TEXT, updated_at INTEGER NOT NULL
            )""")
            conn.execute("""INSERT INTO controller_guard_state
                (singleton,stopped,epoch,reason,updated_at) VALUES(1,0,0,?,?)""",
                ("authorized single native pilot bootstrap", now))
            conn.execute("""CREATE TABLE native_guard_bootstrap (
                singleton INTEGER PRIMARY KEY CHECK(singleton=1),
                reviewed_plan_sha TEXT NOT NULL,
                receipt_json TEXT NOT NULL, receipt_sha TEXT NOT NULL
            )""")
            conn.execute("INSERT INTO native_guard_bootstrap VALUES(1,?,?,?)",
                         (reviewed_plan_sha, payload, digest))
            conn.commit()
        return {**receipt, "receipt_sha256": digest}

    def __init__(self, queue: SQLiteQueue):
        self.queue = queue
        with queue._connection() as conn:
            conn.execute("""CREATE TABLE IF NOT EXISTS native_operations (
                operation_id TEXT PRIMARY KEY,
                task_id TEXT NOT NULL UNIQUE REFERENCES tasks(task_id),
                input_sha TEXT NOT NULL,
                nonce TEXT NOT NULL UNIQUE,
                authorization_ref TEXT NOT NULL,
                owner_id TEXT NOT NULL,
                fencing_token INTEGER NOT NULL,
                stop_epoch INTEGER NOT NULL,
                reserved_at INTEGER NOT NULL,
                surface TEXT,
                remote_id TEXT,
                state TEXT NOT NULL,
                observation_json TEXT,
                observation_digest TEXT,
                observed_at INTEGER,
                dispatch_contract_sha TEXT,
                UNIQUE(surface,remote_id)
            )""")

    def reserve(self, claim: Claim, operation_id: str, nonce: str,
                authorization_ref: str, now: int, expected_dispatch_contract_sha: str) -> str:
        """One local intent; requires existing STOP guard and an active lease.

        authorization_ref points to reviewed authorization; it is NOT a grant
        verifier. Remote dispatch still belongs to the explicitly authorized caller.
        Reservation immediately blocks queue replay, even if dispatch never occurs.
        """
        _time(now)
        if not isinstance(operation_id, str) or not _UUID.fullmatch(operation_id):
            raise ValueError("operation_id must be a UUID")
        _text(nonce, "nonce")
        _text(authorization_ref, "authorization_ref")
        if not isinstance(expected_dispatch_contract_sha, str) or not _HASH.fullmatch(expected_dispatch_contract_sha):
            raise ValueError("reservation requires reviewed dispatch contract hash")
        with self.queue._connection() as conn:
            conn.execute("BEGIN IMMEDIATE")
            # A bridge cannot create/reset the controller's STOP authority.
            guard = conn.execute(
                "SELECT stopped,epoch FROM controller_guard_state WHERE singleton=1"
            ).fetchone()
            if guard is None or guard["stopped"]:
                raise RuntimeError("controller stopped or guard absent")
            # The live bootstrap authorizes only the single reviewed pilot plan.
            bootstrap_exists = conn.execute("SELECT 1 FROM sqlite_master WHERE type='table' AND name='native_guard_bootstrap'").fetchone()
            if bootstrap_exists:
                bootstrap = conn.execute("SELECT * FROM native_guard_bootstrap WHERE singleton=1").fetchone()
                if (bootstrap is None
                        or hashlib.sha256(bootstrap["receipt_json"].encode("utf-8")).hexdigest() != bootstrap["receipt_sha"]
                        or bootstrap["reviewed_plan_sha"] != expected_dispatch_contract_sha):
                    raise RuntimeError("reservation differs from authorized bootstrap plan")
                receipt = json.loads(bootstrap["receipt_json"])
                if (receipt.get("reviewed_plan_sha") != bootstrap["reviewed_plan_sha"]
                        or receipt.get("authority_ref") != authorization_ref
                        or receipt.get("scope") != "single_native_pilot"):
                    raise RuntimeError("bootstrap receipt/authority binding changed")
            row = self.queue._assert_claim(conn, claim, now)
            if row["effect_state"] != "not_started":
                raise RuntimeError("effect already reserved; reconcile instead of replay")
            conn.execute("""INSERT INTO native_operations
                (operation_id,task_id,input_sha,nonce,authorization_ref,owner_id,
                 fencing_token,stop_epoch,reserved_at,dispatch_contract_sha,state)
                VALUES(?,?,?,?,?,?,?,?,?,?,'reserved')""",
                (operation_id, row["task_id"], row["input_sha"], nonce,
                 authorization_ref, claim.owner_id, claim.fencing_token,
                 guard["epoch"], now, expected_dispatch_contract_sha))
            conn.execute("""UPDATE tasks SET status='needs_reconcile',
                effect_state='needs_reconcile',effect_name='native_execution',
                effect_key=?,last_evidence=?,ambiguous_owner_id=?,
                ambiguous_fencing_token=?,updated_at=? WHERE task_id=?""",
                (operation_id, "native_reserved:" + operation_id, claim.owner_id,
                 claim.fencing_token, now, claim.task_id))
            conn.execute("DELETE FROM worker_leases WHERE worker_id=?", (claim.worker_id,))
            conn.commit()
        return operation_id

    def begin_dispatch(self, operation_id: str, dispatch_contract_sha: str) -> dict:
        """Consume the single dispatch slot BEFORE transport; no automatic retry.

        A crash after this transaction is ambiguous even with no remote ID.
        STOP epoch changes invalidate an unlaunched reservation permanently.
        """
        if not isinstance(dispatch_contract_sha, str) or not _HASH.fullmatch(dispatch_contract_sha):
            raise ValueError("invalid dispatch contract hash")
        with self.queue._connection() as conn:
            conn.execute("BEGIN IMMEDIATE")
            row = conn.execute("SELECT * FROM native_operations WHERE operation_id=?",
                               (operation_id,)).fetchone()
            guard = conn.execute("SELECT stopped,epoch FROM controller_guard_state WHERE singleton=1").fetchone()
            if row is None or row["state"] != "reserved":
                raise RuntimeError("operation unreserved or dispatch slot already consumed")
            if row["dispatch_contract_sha"] != dispatch_contract_sha:
                raise RuntimeError("dispatch plan differs from immutable reviewed reservation")
            if guard is None or guard["stopped"] or guard["epoch"] != row["stop_epoch"]:
                raise RuntimeError("STOP invalidated dispatch reservation")
            task = conn.execute("SELECT * FROM tasks WHERE task_id=?", (row["task_id"],)).fetchone()
            if task["status"] != "needs_reconcile" or task["effect_key"] != operation_id:
                raise RuntimeError("operation no longer owns task")
            conn.execute("UPDATE native_operations SET state='dispatching' WHERE operation_id=?",
                         (operation_id,))
            conn.commit()
        return dict(row)

    def ingest(self, observation: NativeObservation, now: int) -> str:
        """Bind one remote identity, retain ambiguity/STOP and await separate QA.

        READY is deliberately not accepted as completed: native task readiness
        does not prove the result meets its contract or that any effect applied.
        """
        if type(observation) is not NativeObservation:
            raise TypeError("explicit native observation required")
        _time(now)
        _time(observation.observed_at)
        if observation.observed_at > now or observation.state not in _STATES:
            raise ValueError("future observation or unsupported lifecycle state")
        pattern = {"cloud_cli_task": _TASK, "codex_app_chat": _UUID}.get(observation.surface)
        if pattern is None or not isinstance(observation.remote_id, str) or not pattern.fullmatch(observation.remote_id):
            raise ValueError("remote ID does not belong to the declared native surface")
        if not isinstance(observation.input_sha, str) or not _HASH.fullmatch(observation.input_sha):
            raise ValueError("invalid input hash")
        _text(observation.evidence_ref, "evidence_ref")
        _text(observation.model_observed, "model_observed")
        _text(observation.usage_observed, "usage_observed")
        if observation.result_sha is not None and (
                not isinstance(observation.result_sha, str) or not _HASH.fullmatch(observation.result_sha)):
            raise ValueError("invalid result hash")
        if observation.state == "completed" and observation.result_sha is None:
            raise ValueError("completed observation requires result artifact hash")
        payload = json.dumps(asdict(observation), sort_keys=True, separators=(",", ":"))
        digest = hashlib.sha256(payload.encode()).hexdigest()
        with self.queue._connection() as conn:
            conn.execute("BEGIN IMMEDIATE")
            row = conn.execute("SELECT * FROM native_operations WHERE operation_id=?",
                               (observation.operation_id,)).fetchone()
            if row is None or row["input_sha"] != observation.input_sha:
                raise ValueError("unreserved operation or changed input")
            task = conn.execute("SELECT * FROM tasks WHERE task_id=?", (row["task_id"],)).fetchone()
            if task["status"] != "needs_reconcile" or task["effect_key"] != row["operation_id"]:
                raise RuntimeError("task no longer owns this native reconciliation")
            if observation.observed_at < row["reserved_at"]:
                raise ValueError("observation precedes reservation")
            if row["remote_id"] is not None and (row["surface"], row["remote_id"]) != (observation.surface, observation.remote_id):
                raise ValueError("remote identity cannot be rebound")
            if row["observation_digest"] == digest:
                return "duplicate"
            if row["state"] in _TERMINAL:
                raise RuntimeError("terminal observation immutable; conflict requires review")
            if row["observed_at"] is not None and observation.observed_at <= row["observed_at"]:
                raise ValueError("stale or conflicting observation")
            if row["state"] == "running" and observation.state == "submitted":
                raise ValueError("lifecycle cannot regress to submitted")
            conn.execute("""UPDATE native_operations SET surface=?,remote_id=?,state=?,
                observation_json=?,observation_digest=?,observed_at=? WHERE operation_id=?""",
                (observation.surface, observation.remote_id, observation.state, payload,
                 digest, observation.observed_at, observation.operation_id))
            conn.execute("UPDATE tasks SET last_evidence=?,updated_at=? WHERE task_id=?",
                         ("native_observation:" + digest, now, row["task_id"]))
            conn.commit()
        return "awaiting_qa" if observation.state == "completed" else "needs_reconcile"

    def read(self, operation_id: str) -> dict | None:
        with self.queue._connection() as conn:
            row = conn.execute("SELECT * FROM native_operations WHERE operation_id=?",
                               (operation_id,)).fetchone()
        if row is None:
            return None
        result = dict(row)
        payload = result.pop("observation_json")
        if payload is not None:
            if hashlib.sha256(payload.encode()).hexdigest() != result["observation_digest"]:
                raise RuntimeError("native observation integrity failed")
            result["observation"] = json.loads(payload)
        return result
