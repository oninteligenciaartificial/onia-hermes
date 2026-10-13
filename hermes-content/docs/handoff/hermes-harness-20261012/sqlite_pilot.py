"""Offline-only durable queue/checkpoint prototype (Python stdlib, SQLite).

This is a single-host experiment. It is not connected to Codex Cloud, a scheduler,
workers, VPS services, or any real external effect. Do not treat it as a deployment
entry point. See SQLITE-PILOT-README.md before any future installation review.
"""
from __future__ import annotations

from dataclasses import dataclass
import hashlib
import json
from pathlib import Path
import re
import sqlite3
from contextlib import contextmanager
from typing import Any, Mapping, Protocol


class LeaseLost(RuntimeError):
    """The claim expired or was fenced by a newer owner."""


class CheckpointInvalid(RuntimeError):
    """Checkpoint content or task identity failed integrity validation."""


class CloudAdapterUnavailable(RuntimeError):
    """No supported official Codex Cloud adapter is implemented here."""


class OfficialCodexCloudAdapter(Protocol):
    """Future interface only; native IDs are metadata, not CLI/API credentials."""

    def read_worker(self, native_worker_id: str) -> Mapping[str, Any]: ...

    def follow_up_existing_worker(
        self, native_worker_id: str, contract_id: str, checkpoint: Mapping[str, Any]
    ) -> Mapping[str, Any]: ...


class EffectAdapter(Protocol):
    """Local-testable boundary for one external effect; no implementation here."""

    def submit(self, effect_key: str, payload: Mapping[str, Any]) -> Mapping[str, Any]: ...


def official_codex_cloud_adapter() -> OfficialCodexCloudAdapter:
    """Fail closed until an official supported operation and auth scope are verified."""
    raise CloudAdapterUnavailable(
        "No official Codex Cloud read/follow-up API was verified; native worker IDs "
        "do not establish --env compatibility or authorize chat dispatch."
    )


@dataclass(frozen=True)
class TaskSpec:
    task_id: str
    worker_id: str
    repo: str
    ref: str
    sha: str
    contract_id: str
    input_sha: str


@dataclass(frozen=True)
class Claim:
    task_id: str
    worker_id: str
    owner_id: str
    fencing_token: int
    expires_at: int
    checkpoint: Mapping[str, Any] | None


@dataclass(frozen=True)
class ClaimResult:
    status: str
    claim: Claim | None = None
    reason: str | None = None


@dataclass(frozen=True)
class QuiescenceEvidence:
    """Manually asserted local gate; this is not runtime or production authorization."""

    previous_owner_id: str
    previous_fencing_token: int
    method: str
    evidence_ref: str
    manually_verified: bool


def _canonical(value: Mapping[str, Any]) -> str:
    return json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=True)


def _digest(value: Mapping[str, Any]) -> str:
    return hashlib.sha256(_canonical(value).encode("utf-8")).hexdigest()


def _required_text(value: Any, field: str) -> str:
    if not isinstance(value, str) or not value.strip():
        raise ValueError(f"{field} must be non-empty text")
    return value.strip()


class SQLiteQueue:
    """A durable local queue with one active lease per worker and monotonic fencing."""

    SCHEMA_VERSION = 1
    DB_SCHEMA_VERSION = 2
    _SHA_RE = re.compile(r"^(?:[0-9a-f]{40}|[0-9a-f]{64})$")
    _INPUT_RE = re.compile(r"^[0-9a-f]{64}$")

    def __init__(self, database_path: str | Path):
        self.database_path = str(database_path)
        if self.database_path == ":memory:":
            raise ValueError("use a temporary SQLite file; per-call connections must share state")
        self._initialize()

    def _connect(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self.database_path, timeout=10, isolation_level=None)
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA foreign_keys=ON")
        conn.execute("PRAGMA busy_timeout=10000")
        conn.execute("PRAGMA synchronous=FULL")
        return conn

    @contextmanager
    def _connection(self):
        conn = self._connect()
        try:
            yield conn
        finally:
            conn.close()

    def _initialize(self) -> None:
        with self._connection() as conn:
            conn.execute("BEGIN IMMEDIATE")
            try:
                version = conn.execute("PRAGMA user_version").fetchone()[0]
                if version not in (0, 1, self.DB_SCHEMA_VERSION):
                    raise RuntimeError(f"unsupported schema version: {version}")
                statements = (
                    """CREATE TABLE IF NOT EXISTS tasks (
                    task_id TEXT PRIMARY KEY,
                    worker_id TEXT NOT NULL,
                    repo TEXT NOT NULL,
                    ref TEXT NOT NULL,
                    sha TEXT NOT NULL,
                    contract_id TEXT NOT NULL,
                    input_sha TEXT NOT NULL,
                    step TEXT NOT NULL DEFAULT 'start',
                    status TEXT NOT NULL CHECK(status IN
                      ('pending','running','needs_reconcile','blocked','done')),
                    effect_state TEXT NOT NULL CHECK(effect_state IN
                      ('not_started','in_flight','needs_reconcile','applied')),
                    checkpoint_json TEXT,
                    checkpoint_digest TEXT,
                    effect_name TEXT,
                    effect_key TEXT,
                    last_evidence TEXT,
                    ambiguous_owner_id TEXT,
                    ambiguous_fencing_token INTEGER,
                    created_at INTEGER NOT NULL,
                    updated_at INTEGER NOT NULL
                )""",
                    """CREATE INDEX IF NOT EXISTS tasks_worker_status
                  ON tasks(worker_id, status, created_at, task_id);
                """,
                    """CREATE TABLE IF NOT EXISTS worker_fences (
                    worker_id TEXT PRIMARY KEY,
                    last_token INTEGER NOT NULL CHECK(last_token >= 0)
                )""",
                    """CREATE TABLE IF NOT EXISTS worker_leases (
                    worker_id TEXT PRIMARY KEY,
                    task_id TEXT NOT NULL UNIQUE REFERENCES tasks(task_id),
                    owner_id TEXT NOT NULL,
                    fencing_token INTEGER NOT NULL,
                    expires_at INTEGER NOT NULL
                )""",
                )
                for statement in statements:
                    conn.execute(statement)
                task_columns = {row[1] for row in conn.execute("PRAGMA table_info(tasks)")}
                if "ambiguous_owner_id" not in task_columns:
                    conn.execute("ALTER TABLE tasks ADD COLUMN ambiguous_owner_id TEXT")
                if "ambiguous_fencing_token" not in task_columns:
                    conn.execute("ALTER TABLE tasks ADD COLUMN ambiguous_fencing_token INTEGER")
                conn.execute(f"PRAGMA user_version={self.DB_SCHEMA_VERSION}")
                conn.commit()
            except Exception:
                conn.rollback()
                raise

    def enqueue(self, spec: TaskSpec, now: int) -> None:
        for key in ("task_id", "worker_id", "repo", "ref", "contract_id"):
            _required_text(getattr(spec, key), key)
        if not self._SHA_RE.fullmatch(spec.sha):
            raise ValueError("sha must be a full 40- or 64-character lowercase git hash")
        if not self._INPUT_RE.fullmatch(spec.input_sha):
            raise ValueError("input_sha must be a 64-character lowercase SHA-256")
        with self._connection() as conn:
            conn.execute("BEGIN IMMEDIATE")
            conn.execute(
                """INSERT INTO tasks(task_id,worker_id,repo,ref,sha,contract_id,input_sha,
                   status,effect_state,created_at,updated_at)
                   VALUES(?,?,?,?,?,?,?,'pending','not_started',?,?)""",
                (spec.task_id, spec.worker_id, spec.repo, spec.ref, spec.sha,
                 spec.contract_id, spec.input_sha, now, now),
            )
            conn.commit()

    def claim(self, worker_id: str, owner_id: str, now: int, lease_seconds: int) -> ClaimResult:
        _required_text(worker_id, "worker_id")
        _required_text(owner_id, "owner_id")
        if type(now) is not int or type(lease_seconds) is not int or lease_seconds <= 0:
            raise ValueError("now and positive lease_seconds must be integer UTC epoch seconds")
        with self._connection() as conn:
            conn.execute("BEGIN IMMEDIATE")
            lease = conn.execute(
                "SELECT * FROM worker_leases WHERE worker_id=?", (worker_id,)
            ).fetchone()
            resume_row = None
            if lease and lease["expires_at"] > now:
                conn.commit()
                return ClaimResult("busy", reason="active_lease")

            if lease:
                expired_task = conn.execute(
                    "SELECT * FROM tasks WHERE task_id=?", (lease["task_id"],)
                ).fetchone()
                if expired_task and expired_task["effect_state"] in (
                    "in_flight", "needs_reconcile"
                ):
                    conn.execute(
                        "UPDATE tasks SET status='needs_reconcile',effect_state='needs_reconcile',"
                        "last_evidence='expired lease with external outcome unresolved',"
                        "ambiguous_owner_id=?,ambiguous_fencing_token=?,updated_at=? "
                        "WHERE task_id=?",
                        (lease["owner_id"], lease["fencing_token"], now, expired_task["task_id"]),
                    )
                    conn.execute("DELETE FROM worker_leases WHERE worker_id=?", (worker_id,))
                    conn.commit()
                    return ClaimResult("needs_reconcile", reason="ambiguous_external_effect")
                if expired_task and expired_task["status"] == "running":
                    try:
                        checkpoint = self._read_checkpoint(expired_task)
                    except CheckpointInvalid:
                        conn.execute(
                            "UPDATE tasks SET status='blocked',last_evidence=?,updated_at=? "
                            "WHERE task_id=?",
                            ("checkpoint_integrity_failed", now, expired_task["task_id"]),
                        )
                        conn.execute("DELETE FROM worker_leases WHERE worker_id=?", (worker_id,))
                        conn.commit()
                        return ClaimResult("blocked", reason="checkpoint_integrity_failed")
                    resume_row = expired_task
                    resume_row_checkpoint = checkpoint
                conn.execute("DELETE FROM worker_leases WHERE worker_id=?", (worker_id,))

            unresolved = conn.execute(
                "SELECT task_id,status FROM tasks WHERE worker_id=? AND status IN "
                "('needs_reconcile','blocked') ORDER BY created_at,task_id LIMIT 1",
                (worker_id,),
            ).fetchone()
            if unresolved:
                conn.commit()
                return ClaimResult(unresolved["status"], reason=unresolved["task_id"])

            task = resume_row or conn.execute(
                "SELECT * FROM tasks WHERE worker_id=? AND status='pending' "
                "ORDER BY created_at,task_id LIMIT 1",
                (worker_id,),
            ).fetchone()
            if task is None:
                conn.commit()
                return ClaimResult("no_work")

            fence = conn.execute(
                "SELECT last_token FROM worker_fences WHERE worker_id=?", (worker_id,)
            ).fetchone()
            token = (fence["last_token"] if fence else 0) + 1
            conn.execute(
                "INSERT INTO worker_fences(worker_id,last_token) VALUES(?,?) "
                "ON CONFLICT(worker_id) DO UPDATE SET last_token=excluded.last_token",
                (worker_id, token),
            )
            expires_at = now + lease_seconds
            conn.execute(
                "INSERT INTO worker_leases(worker_id,task_id,owner_id,fencing_token,expires_at) "
                "VALUES(?,?,?,?,?)",
                (worker_id, task["task_id"], owner_id, token, expires_at),
            )
            conn.execute(
                "UPDATE tasks SET status='running',updated_at=? WHERE task_id=?",
                (now, task["task_id"]),
            )
            checkpoint = resume_row_checkpoint if resume_row else self._read_checkpoint(task)
            conn.commit()
            return ClaimResult(
                "claimed",
                Claim(task["task_id"], worker_id, owner_id, token, expires_at, checkpoint),
            )

    def save_checkpoint(self, claim: Claim, checkpoint: Mapping[str, Any], now: int) -> str:
        payload = dict(checkpoint)
        self._validate_checkpoint(payload, claim.task_id)
        serialized = _canonical(payload)
        digest = _digest(payload)
        with self._connection() as conn:
            conn.execute("BEGIN IMMEDIATE")
            task = self._assert_claim(conn, claim, now)
            conn.execute(
                "UPDATE tasks SET step=?,checkpoint_json=?,checkpoint_digest=?,updated_at=? "
                "WHERE task_id=?",
                (str(payload["step"]), serialized, digest, now, task["task_id"]),
            )
            conn.commit()
        return digest

    def mark_effect_in_flight(self, claim: Claim, effect_name: str, now: int) -> str:
        effect_name = _required_text(effect_name, "effect_name")
        with self._connection() as conn:
            conn.execute("BEGIN IMMEDIATE")
            task = self._assert_claim(conn, claim, now)
            if task["effect_state"] != "not_started":
                conn.rollback()
                raise RuntimeError("effect is not in a dispatchable state")
            dispatch_key = hashlib.sha256(
                _canonical([task["worker_id"], task["contract_id"], task["input_sha"], task["step"]])
                .encode("utf-8")
            ).hexdigest()
            effect_key = hashlib.sha256(
                _canonical([dispatch_key, effect_name]).encode("utf-8")
            ).hexdigest()
            conn.execute(
                "UPDATE tasks SET effect_state='in_flight',effect_name=?,effect_key=?,updated_at=? "
                "WHERE task_id=?",
                (effect_name, effect_key, now, task["task_id"]),
            )
            conn.commit()
            return effect_key

    def mark_needs_reconcile(self, claim: Claim, now: int, evidence: str) -> None:
        evidence = _required_text(evidence, "evidence")
        with self._connection() as conn:
            conn.execute("BEGIN IMMEDIATE")
            task = self._assert_claim(conn, claim, now)
            conn.execute(
                "UPDATE tasks SET status='needs_reconcile',effect_state='needs_reconcile',"
                "last_evidence=?,ambiguous_owner_id=?,ambiguous_fencing_token=?,updated_at=? "
                "WHERE task_id=?",
                (evidence, claim.owner_id, claim.fencing_token, now, task["task_id"]),
            )
            conn.execute("DELETE FROM worker_leases WHERE worker_id=?", (claim.worker_id,))
            conn.commit()

    def resolve_reconciliation(
        self,
        task_id: str,
        outcome: str,
        evidence: str,
        now: int,
        quiescence: QuiescenceEvidence | None = None,
    ) -> None:
        """Explicit local/manual resolution; retry requires an exact prior-owner gate."""
        evidence = _required_text(evidence, "evidence")
        if outcome not in ("applied", "not_applied"):
            raise ValueError("outcome must be applied or not_applied")
        with self._connection() as conn:
            conn.execute("BEGIN IMMEDIATE")
            row = conn.execute("SELECT * FROM tasks WHERE task_id=?", (task_id,)).fetchone()
            if row is None or row["status"] != "needs_reconcile":
                conn.rollback()
                raise RuntimeError("task is not awaiting reconciliation")
            if outcome == "not_applied":
                allowed_methods = {
                    "owner_terminated",
                    "destination_fencing_verified",
                    "destination_idempotency_verified",
                }
                if (
                    quiescence is None
                    or quiescence.manually_verified is not True
                    or not isinstance(quiescence.method, str)
                    or quiescence.method not in allowed_methods
                    or not isinstance(quiescence.previous_owner_id, str)
                    or type(quiescence.previous_fencing_token) is not int
                    or not isinstance(quiescence.evidence_ref, str)
                    or not quiescence.evidence_ref.strip()
                    or quiescence.previous_owner_id != row["ambiguous_owner_id"]
                    or quiescence.previous_fencing_token != row["ambiguous_fencing_token"]
                ):
                    conn.rollback()
                    raise RuntimeError(
                        "not_applied retry requires manually verified quiescence evidence "
                        "for the exact previous owner and fencing token"
                    )
            if outcome == "applied":
                conn.execute(
                    "UPDATE tasks SET status='done',effect_state='applied',last_evidence=?,"
                    "ambiguous_owner_id=NULL,ambiguous_fencing_token=NULL,updated_at=? "
                    "WHERE task_id=?",
                    (evidence, now, task_id),
                )
            else:
                conn.execute(
                    "UPDATE tasks SET status='pending',effect_state='not_started',last_evidence=?,"
                    "ambiguous_owner_id=NULL,ambiguous_fencing_token=NULL,updated_at=? "
                    "WHERE task_id=?",
                    (evidence, now, task_id),
                )
            conn.commit()

    def complete(self, claim: Claim, now: int, evidence: str) -> None:
        evidence = _required_text(evidence, "evidence")
        with self._connection() as conn:
            conn.execute("BEGIN IMMEDIATE")
            task = self._assert_claim(conn, claim, now)
            if task["effect_state"] == "in_flight":
                conn.rollback()
                raise RuntimeError("ambiguous external effect must be reconciled before completion")
            conn.execute(
                "UPDATE tasks SET status='done',updated_at=?,last_evidence=? WHERE task_id=?",
                (now, evidence, task["task_id"]),
            )
            conn.execute("DELETE FROM worker_leases WHERE worker_id=?", (claim.worker_id,))
            conn.commit()

    def _assert_claim(self, conn: sqlite3.Connection, claim: Claim, now: int) -> sqlite3.Row:
        row = conn.execute(
            "SELECT l.*,t.* FROM worker_leases l JOIN tasks t ON t.task_id=l.task_id "
            "WHERE l.worker_id=?",
            (claim.worker_id,),
        ).fetchone()
        if (
            row is None
            or row["task_id"] != claim.task_id
            or row["owner_id"] != claim.owner_id
            or row["fencing_token"] != claim.fencing_token
            or row["expires_at"] <= now
        ):
            raise LeaseLost("claim expired or was superseded by a newer fencing token")
        fence = conn.execute(
            "SELECT last_token FROM worker_fences WHERE worker_id=?", (claim.worker_id,)
        ).fetchone()
        if fence is None or fence["last_token"] != claim.fencing_token:
            raise LeaseLost("claim fencing token is stale")
        return row

    def _read_checkpoint(self, task: sqlite3.Row) -> Mapping[str, Any] | None:
        if task["checkpoint_json"] is None:
            return None
        try:
            checkpoint = json.loads(task["checkpoint_json"])
        except (TypeError, json.JSONDecodeError) as exc:
            raise CheckpointInvalid("checkpoint is not valid JSON") from exc
        if not isinstance(checkpoint, dict) or _digest(checkpoint) != task["checkpoint_digest"]:
            raise CheckpointInvalid("checkpoint digest mismatch")
        try:
            self._validate_checkpoint(checkpoint, task["task_id"], task)
        except (ValueError, TypeError) as exc:
            raise CheckpointInvalid("checkpoint does not match task identity") from exc
        return checkpoint

    def _validate_checkpoint(
        self, checkpoint: Mapping[str, Any], task_id: str, task: sqlite3.Row | None = None
    ) -> None:
        required = ("schema", "repo", "ref", "sha", "contract_id", "input_sha", "step", "status", "evidence")
        if any(key not in checkpoint for key in required):
            raise ValueError("checkpoint is missing required fields")
        if type(checkpoint["schema"]) is not int or checkpoint["schema"] != self.SCHEMA_VERSION:
            raise ValueError("unsupported checkpoint schema")
        if not isinstance(checkpoint["step"], (int, str)) or isinstance(checkpoint["step"], bool):
            raise ValueError("checkpoint step must be an integer or text")
        if isinstance(checkpoint["step"], str) and not checkpoint["step"].strip():
            raise ValueError("checkpoint step text must be non-empty")
        _required_text(checkpoint["status"], "checkpoint.status")
        if not isinstance(checkpoint["evidence"], (dict, list)):
            raise ValueError("checkpoint evidence must be an object or list")
        if task is None:
            # The task is loaded under the same SQLite transaction by the caller.
            with self._connection() as conn:
                task = conn.execute("SELECT * FROM tasks WHERE task_id=?", (task_id,)).fetchone()
        if task is None:
            raise ValueError("checkpoint task does not exist")
        for key in ("repo", "ref", "sha", "contract_id", "input_sha"):
            if checkpoint[key] != task[key]:
                raise ValueError(f"checkpoint {key} does not match queued task")
        if checkpoint["status"] not in ("running", "paused", "completed"):
            raise ValueError("checkpoint status is not resumable")


@dataclass(frozen=True)
class EffectResult:
    status: str
    effect_key: str


def dispatch_effect_once(
    queue: SQLiteQueue,
    claim: Claim,
    adapter: EffectAdapter,
    effect_name: str,
    payload: Mapping[str, Any],
    now: int,
) -> EffectResult:
    """Record intent before adapter call; any non-definitive return requires reconciliation."""
    effect_name = _required_text(effect_name, "effect_name")
    effect_key = queue.mark_effect_in_flight(claim, effect_name, now)
    try:
        receipt = adapter.submit(effect_key, dict(payload))
        # A fake or future adapter receipt is deliberately not considered proof of success.
        evidence = "adapter_returned:" + _digest(dict(receipt))
    except Exception as exc:  # transport outcome may be unknown after a remote side effect
        evidence = "adapter_exception:" + type(exc).__name__
    queue.mark_needs_reconcile(claim, now, evidence)
    return EffectResult("needs_reconcile", effect_key)
