"""Offline-only durable queue/checkpoint prototype (Python stdlib, SQLite).

This is a single-host experiment. It is not connected to Codex Cloud, a scheduler,
workers, VPS services, or any real external effect. Do not treat it as a deployment
entry point. See SQLITE-PILOT-README.md before any future installation review.
"""
from __future__ import annotations

from dataclasses import dataclass
import hashlib
import json
import os
from pathlib import Path
import re
import sqlite3
import stat
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
    """Future interface; this pilot cannot accept implementations of this protocol."""

    def submit(self, effect_key: str, payload: Mapping[str, Any]) -> Mapping[str, Any]: ...


class OfflineEffectFixture:
    """Only permitted effect simulator; never performs IO outside local memory."""

    def __init__(self) -> None:
        self.calls = 0

    def submit(self, effect_key: str, payload: Mapping[str, Any]) -> Mapping[str, Any]:
        self.calls += 1
        return {"status": "unknown", "fixture": True}


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


@dataclass(frozen=True)
class HandoffSpec:
    successor_owner_id: str
    objective: str
    gates: tuple[str, ...]
    evidence_refs: tuple[str, ...]
    next_action: str
    cursor: str
    model_configured: str
    model_observed: str
    context_snapshot: ContextSnapshot | None = None
    context_reserve: int | None = None


@dataclass(frozen=True)
class HandoffPacket:
    handoff_id: str
    digest: str
    payload: Mapping[str, Any]
    status: str


@dataclass(frozen=True)
class ExternalDispatchGate:
    credentials_ready: bool
    permission_ref: str | None
    cost_cap_ref: str | None
    adapter_verified: bool
    runtime_approved: bool


@dataclass(frozen=True)
class ContextSnapshot:
    """Provider active-context reading; cumulative tokens are recorded separately."""

    source: str
    observed_at_epoch: int
    model: str
    active_used: int
    effective_window: int
    cumulative_tokens: int | None = None


@dataclass(frozen=True)
class ClaudeResumePlan:
    """Offline metadata only; the argv is never executed by this module."""

    session_id: str
    transcript_path: str | None
    resume_argv: tuple[str, ...]


def prepare_claude_resume(
    session_id: str, transcript_path: str | Path | None = None,
    private_root: str | Path | None = None,
) -> ClaudeResumePlan:
    """Build a non-executing plan; retain transcript path only under a private root."""
    if not isinstance(session_id, str) or not re.fullmatch(r"[A-Za-z0-9_-]{1,128}", session_id):
        raise ValueError("invalid Claude session_id")
    safe_path = None
    if transcript_path is not None:
        if os.name == "nt":
            raise ValueError("transcript path privacy is unverified on Windows")
        if private_root is None:
            raise ValueError("private_root required for transcript path")
        root = Path(private_root).resolve(strict=True)
        path = Path(transcript_path).resolve(strict=True)
        if not root.is_dir() or not path.is_file() or not path.is_relative_to(root):
            raise ValueError("transcript path is outside private root")
        if (
            stat.S_IMODE(root.stat().st_mode) & 0o077
            or stat.S_IMODE(path.stat().st_mode) & 0o077
        ):
            raise ValueError("transcript path permissions are not private")
        safe_path = str(path)
    return ClaudeResumePlan(session_id, safe_path, ("claude", "--resume", session_id))


def _canonical(value: Mapping[str, Any]) -> str:
    return json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=True)


def _digest(value: Mapping[str, Any]) -> str:
    return hashlib.sha256(_canonical(value).encode("utf-8")).hexdigest()


def _required_text(value: Any, field: str) -> str:
    if not isinstance(value, str) or not value.strip():
        raise ValueError(f"{field} must be non-empty text")
    return value.strip()


def context_rotation_decision(
    used: int | None, window: int | None, reserve: int | None
) -> str:
    """Alert before the approximate 500k reference or effective window, with reserve.

    Inputs must be verified active occupancy and effective window, never cumulative
    usage or billing counts. The caller records their provenance; this fixture cannot
    observe a live provider. An alert asks for a decision, not automatic rotation.
    """
    if used is None or window is None or reserve is None:
        return "UNKNOWN"
    if any(type(value) is not int for value in (used, window, reserve)):
        raise ValueError("context measurements must be integers")
    if used < 0 or window <= 0 or reserve < 0 or used > window:
        raise ValueError("invalid active context measurements")
    target = min(500_000, window)
    return "alert_review" if used + reserve >= target else "continue"


def evaluate_context_snapshot(
    snapshot: ContextSnapshot | None, reserve: int | None, now: int,
    max_age_seconds: int, expected_model: str,
) -> str:
    """Require a fresh provider reading, named model and capacity before alerting."""
    if snapshot is None or reserve is None:
        return "UNKNOWN"
    if type(now) is not int or type(max_age_seconds) is not int or max_age_seconds < 0:
        raise ValueError("invalid context freshness policy")
    if (
        snapshot.source != "provider_usage"
        or not isinstance(snapshot.model, str) or not snapshot.model.strip()
        or snapshot.model.upper() == "UNKNOWN"
        or not isinstance(expected_model, str)
        or expected_model.upper() == "UNKNOWN"
        or snapshot.model != expected_model
        or type(snapshot.observed_at_epoch) is not int
        or snapshot.observed_at_epoch > now
        or now - snapshot.observed_at_epoch > max_age_seconds
    ):
        return "UNKNOWN"
    return context_rotation_decision(
        snapshot.active_used, snapshot.effective_window, reserve
    )


class SQLiteQueue:
    """A durable local queue with one active lease per worker and monotonic fencing."""

    SCHEMA_VERSION = 1
    DB_SCHEMA_VERSION = 3
    _SHA_RE = re.compile(r"^(?:[0-9a-f]{40}|[0-9a-f]{64})$")
    _INPUT_RE = re.compile(r"^[0-9a-f]{64}$")

    def __init__(self, database_path: str | Path):
        self.database_path = str(database_path)
        if self.database_path == ":memory:":
            raise ValueError("use a temporary SQLite file; per-call connections must share state")
        self._initialize()

    def _connect(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self.database_path, timeout=10, isolation_level=None)
        try:
            conn.row_factory = sqlite3.Row
            conn.execute("PRAGMA foreign_keys=ON")
            conn.execute("PRAGMA busy_timeout=10000")
            conn.execute("PRAGMA synchronous=FULL")
            return conn
        except Exception:
            conn.close()
            raise

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
                if version not in (0, 1, 2, self.DB_SCHEMA_VERSION):
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
                    """CREATE TABLE IF NOT EXISTS handoffs (
                    handoff_id TEXT PRIMARY KEY,
                    task_id TEXT NOT NULL REFERENCES tasks(task_id),
                    from_owner_id TEXT NOT NULL,
                    from_fencing_token INTEGER NOT NULL,
                    successor_owner_id TEXT NOT NULL,
                    checkpoint_digest TEXT NOT NULL,
                    payload_json TEXT NOT NULL,
                    payload_digest TEXT NOT NULL,
                    ack_ref TEXT,
                    status TEXT NOT NULL CHECK(status IN
                      ('prepared','acked','activated','archived')),
                    created_at INTEGER NOT NULL,
                    updated_at INTEGER NOT NULL,
                    UNIQUE(task_id, from_fencing_token)
                )""",
                    """CREATE INDEX IF NOT EXISTS handoffs_task_status
                  ON handoffs(task_id, status)""",
                    """CREATE TABLE IF NOT EXISTS task_results (
                    task_id TEXT PRIMARY KEY REFERENCES tasks(task_id),
                    owner_id TEXT NOT NULL,
                    fencing_token INTEGER NOT NULL,
                    evidence_json TEXT NOT NULL,
                    evidence_digest TEXT NOT NULL,
                    closed_at INTEGER NOT NULL
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
            handoff_pending = conn.execute(
                "SELECT handoff_id FROM handoffs h JOIN tasks t ON t.task_id=h.task_id "
                "WHERE t.worker_id=? AND h.status IN ('prepared','acked') LIMIT 1",
                (worker_id,),
            ).fetchone()
            if handoff_pending:
                conn.commit()
                return ClaimResult("blocked", reason="handoff_awaiting_ack_or_activation")
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
                receipt = {"result": "applied_reconciled", "evidence_ref": evidence}
                receipt_digest = _digest(receipt)
                conn.execute(
                    "INSERT INTO task_results(task_id,owner_id,fencing_token,evidence_json,"
                    "evidence_digest,closed_at) VALUES(?,?,?,?,?,?)",
                    (task_id, row["ambiguous_owner_id"] or "UNKNOWN",
                     row["ambiguous_fencing_token"] or 0,
                     _canonical(receipt), receipt_digest, now),
                )
                conn.execute(
                    "UPDATE tasks SET status='done',effect_state='applied',last_evidence=?,"
                    "ambiguous_owner_id=NULL,ambiguous_fencing_token=NULL,updated_at=? "
                    "WHERE task_id=?",
                    ("result:" + receipt_digest, now, task_id),
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
        self.complete_with_result(claim, now, "completed", evidence)

    def prepare_handoff(self, claim: Claim, spec: HandoffSpec, now: int) -> HandoffPacket:
        """Persist a compact packet and suspend the old claim before any session switch."""
        for field in (
            "successor_owner_id", "objective", "next_action", "cursor",
            "model_configured", "model_observed",
        ):
            value = _required_text(getattr(spec, field), field)
            if len(value) > 512:
                raise ValueError(f"{field} exceeds compact handoff limit")
        for field in ("gates", "evidence_refs"):
            values = getattr(spec, field)
            if not isinstance(values, tuple) or len(values) > 16:
                raise ValueError(f"{field} must be a compact tuple")
            for value in values:
                if len(_required_text(value, field)) > 512:
                    raise ValueError(f"{field} entry exceeds compact handoff limit")
        context_state = evaluate_context_snapshot(
            spec.context_snapshot, spec.context_reserve, now, max_age_seconds=300,
            expected_model=spec.model_observed,
        )
        with self._connection() as conn:
            conn.execute("BEGIN IMMEDIATE")
            task = self._assert_claim(conn, claim, now)
            checkpoint = self._read_checkpoint(task)
            if checkpoint is None or task["effect_state"] != "not_started":
                raise RuntimeError("handoff requires an integral checkpoint and no open effect")
            payload = {
                "schema": 1,
                "task_id": claim.task_id,
                "worker_id": claim.worker_id,
                "repo": task["repo"], "ref": task["ref"], "sha": task["sha"],
                "contract_id": task["contract_id"], "input_sha": task["input_sha"],
                "step": task["step"], "checkpoint": checkpoint,
                "checkpoint_digest": task["checkpoint_digest"],
                "from_owner_id": claim.owner_id,
                "from_fencing_token": claim.fencing_token,
                "successor_owner_id": spec.successor_owner_id,
                "objective": spec.objective, "gates": spec.gates,
                "evidence_refs": spec.evidence_refs, "next_action": spec.next_action,
                "cursor": spec.cursor, "model_configured": spec.model_configured,
                "model_observed": spec.model_observed,
                "context_state": context_state,
                "context_snapshot": (
                    {"source": spec.context_snapshot.source,
                     "observed_at_epoch": spec.context_snapshot.observed_at_epoch,
                     "model": spec.context_snapshot.model,
                     "active_used": spec.context_snapshot.active_used,
                     "effective_window": spec.context_snapshot.effective_window,
                     "cumulative_tokens": spec.context_snapshot.cumulative_tokens}
                    if spec.context_snapshot is not None else None
                ),
                "context_reserve": spec.context_reserve,
                "created_at_utc_epoch": now,
            }
            digest = _digest(payload)
            handoff_id = _digest([claim.task_id, claim.fencing_token, spec.successor_owner_id])
            conn.execute(
                "INSERT INTO handoffs(handoff_id,task_id,from_owner_id,from_fencing_token,"
                "successor_owner_id,checkpoint_digest,payload_json,payload_digest,status,"
                "created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,'prepared',?,?)",
                (handoff_id, claim.task_id, claim.owner_id, claim.fencing_token,
                 spec.successor_owner_id, task["checkpoint_digest"], _canonical(payload),
                 digest, now, now),
            )
            conn.commit()
        return HandoffPacket(handoff_id, digest, payload, "prepared")

    def read_handoff(self, handoff_id: str) -> HandoffPacket:
        with self._connection() as conn:
            row = conn.execute(
                "SELECT * FROM handoffs WHERE handoff_id=?", (handoff_id,)
            ).fetchone()
            if row is None:
                raise KeyError("handoff not found")
            payload = json.loads(row["payload_json"])
            if not isinstance(payload, dict) or _digest(payload) != row["payload_digest"]:
                raise CheckpointInvalid("handoff digest mismatch")
            return HandoffPacket(handoff_id, row["payload_digest"], payload, row["status"])

    def acknowledge_handoff(
        self, handoff_id: str, successor_owner_id: str, digest: str, sha: str,
        ack_ref: str, now: int,
    ) -> None:
        """Offline ACK fixture; caller identity is not authenticated by this prototype."""
        ack_ref = _required_text(ack_ref, "ack_ref")
        with self._connection() as conn:
            conn.execute("BEGIN IMMEDIATE")
            row = conn.execute(
                "SELECT * FROM handoffs WHERE handoff_id=?", (handoff_id,)
            ).fetchone()
            if row is None or row["status"] != "prepared":
                raise RuntimeError("handoff is not awaiting ACK")
            payload = json.loads(row["payload_json"])
            if (
                _digest(payload) != row["payload_digest"]
                or digest != row["payload_digest"]
                or sha != payload["sha"]
                or successor_owner_id != row["successor_owner_id"]
            ):
                raise CheckpointInvalid("ACK does not match handoff digest, SHA or successor")
            conn.execute(
                "UPDATE handoffs SET status='acked',ack_ref=?,updated_at=? WHERE handoff_id=?",
                (ack_ref, now, handoff_id),
            )
            conn.commit()

    def activate_handoff(
        self, handoff_id: str, successor_owner_id: str, now: int, lease_seconds: int
    ) -> Claim:
        """After ACK, atomically fence old claim, grant ownership and archive local state."""
        if type(lease_seconds) is not int or lease_seconds <= 0:
            raise ValueError("lease_seconds must be positive")
        with self._connection() as conn:
            conn.execute("BEGIN IMMEDIATE")
            handoff = conn.execute(
                "SELECT * FROM handoffs WHERE handoff_id=?", (handoff_id,)
            ).fetchone()
            if (
                handoff is None or handoff["status"] != "acked"
                or handoff["successor_owner_id"] != successor_owner_id
            ):
                raise RuntimeError("matching successor ACK is required")
            task = conn.execute(
                "SELECT * FROM tasks WHERE task_id=?", (handoff["task_id"],)
            ).fetchone()
            lease = conn.execute(
                "SELECT * FROM worker_leases WHERE task_id=?", (handoff["task_id"],)
            ).fetchone()
            if (
                task is None or lease is None or task["effect_state"] != "not_started"
                or task["checkpoint_digest"] != handoff["checkpoint_digest"]
                or lease["owner_id"] != handoff["from_owner_id"]
                or lease["fencing_token"] != handoff["from_fencing_token"]
            ):
                raise RuntimeError("handoff claim or checkpoint changed; reconcile manually")
            checkpoint = self._read_checkpoint(task)
            fence = conn.execute(
                "SELECT last_token FROM worker_fences WHERE worker_id=?", (task["worker_id"],)
            ).fetchone()
            token = fence["last_token"] + 1
            expires_at = now + lease_seconds
            conn.execute(
                "UPDATE worker_fences SET last_token=? WHERE worker_id=?",
                (token, task["worker_id"]),
            )
            conn.execute(
                "UPDATE worker_leases SET owner_id=?,fencing_token=?,expires_at=? WHERE task_id=?",
                (successor_owner_id, token, expires_at, task["task_id"]),
            )
            conn.execute(
                "UPDATE handoffs SET status='archived',updated_at=? WHERE handoff_id=?",
                (now, handoff_id),
            )
            conn.commit()
            return Claim(task["task_id"], task["worker_id"], successor_owner_id,
                         token, expires_at, checkpoint)

    def archive_previous(self, handoff_id: str, successor_claim: Claim, now: int) -> None:
        """Confirm the local archive already committed with successor ownership."""
        with self._connection() as conn:
            conn.execute("BEGIN IMMEDIATE")
            self._assert_claim(conn, successor_claim, now)
            row = conn.execute(
                "SELECT * FROM handoffs WHERE handoff_id=?", (handoff_id,)
            ).fetchone()
            if (
                row is None or row["status"] != "archived"
                or row["task_id"] != successor_claim.task_id
                or row["successor_owner_id"] != successor_claim.owner_id
                or not row["ack_ref"]
            ):
                raise RuntimeError("successor ownership and ACK required before archive")
            conn.commit()

    def complete_with_result(
        self, claim: Claim, now: int, result: str, evidence_ref: str
    ) -> str:
        """Store a minimal evidence receipt and close the task in one transaction."""
        result = _required_text(result, "result")
        evidence_ref = _required_text(evidence_ref, "evidence_ref")
        receipt = {"result": result, "evidence_ref": evidence_ref}
        digest = _digest(receipt)
        with self._connection() as conn:
            conn.execute("BEGIN IMMEDIATE")
            task = self._assert_claim(conn, claim, now)
            if task["effect_state"] != "not_started":
                raise RuntimeError("external effect must be reconciled before completion")
            active_handoff = conn.execute(
                "SELECT 1 FROM handoffs WHERE task_id=? AND status='activated' LIMIT 1",
                (claim.task_id,),
            ).fetchone()
            if active_handoff:
                raise RuntimeError("archive acknowledged predecessor before completion")
            conn.execute(
                "INSERT INTO task_results(task_id,owner_id,fencing_token,evidence_json,"
                "evidence_digest,closed_at) VALUES(?,?,?,?,?,?)",
                (claim.task_id, claim.owner_id, claim.fencing_token,
                 _canonical(receipt), digest, now),
            )
            conn.execute(
                "UPDATE tasks SET status='done',last_evidence=?,updated_at=? WHERE task_id=?",
                ("result:" + digest, now, claim.task_id),
            )
            conn.execute("DELETE FROM worker_leases WHERE worker_id=?", (claim.worker_id,))
            conn.commit()
        return digest

    def read_result(self, task_id: str) -> Mapping[str, Any] | None:
        with self._connection() as conn:
            row = conn.execute(
                "SELECT * FROM task_results WHERE task_id=?", (task_id,)
            ).fetchone()
            if row is None:
                return None
            receipt = json.loads(row["evidence_json"])
            if _digest(receipt) != row["evidence_digest"]:
                raise CheckpointInvalid("result evidence digest mismatch")
            return {**receipt, "owner_id": row["owner_id"],
                    "fencing_token": row["fencing_token"], "digest": row["evidence_digest"]}

    def external_dispatch_blocker(self, claim: Claim, gate: ExternalDispatchGate, now: int) -> str:
        """Readiness check only. No real adapter is installed or invoked."""
        with self._connection() as conn:
            self._assert_claim(conn, claim, now)
        if gate.credentials_ready is not True:
            return "credentials_unavailable"
        if not gate.permission_ref:
            return "permission_missing"
        if not gate.cost_cap_ref:
            return "cost_cap_missing"
        if gate.runtime_approved is not True:
            return "runtime_not_approved"
        if gate.adapter_verified is not True:
            return "adapter_unverified"
        return "adapter_not_implemented"

    def dispatch_external(self, claim: Claim, gate: ExternalDispatchGate, now: int) -> None:
        """Fail closed until an official new-session adapter is reviewed and installed."""
        raise CloudAdapterUnavailable(self.external_dispatch_blocker(claim, gate, now))

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
        handoff_pending = conn.execute(
            "SELECT 1 FROM handoffs WHERE task_id=? AND status IN ('prepared','acked') LIMIT 1",
            (claim.task_id,),
        ).fetchone()
        if handoff_pending:
            raise LeaseLost("claim suspended for handoff")
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
    """Offline fixture only; persist intent and reconcile every non-definitive return."""
    if type(adapter) is not OfflineEffectFixture:
        raise CloudAdapterUnavailable("effect adapter is not the built-in offline fixture")
    effect_name = _required_text(effect_name, "effect_name")
    effect_key = queue.mark_effect_in_flight(claim, effect_name, now)
    try:
        receipt = adapter.submit(effect_key, dict(payload))
        # A fixture receipt is deliberately not considered proof of success.
        evidence = "adapter_returned:" + _digest(dict(receipt))
    except Exception as exc:  # transport outcome may be unknown after a remote side effect
        evidence = "adapter_exception:" + type(exc).__name__
    queue.mark_needs_reconcile(claim, now, evidence)
    return EffectResult("needs_reconcile", effect_key)
