"""Offline-only synthetic controller with durable admission guards.

This is a fixture harness, not a provider, service, Telegram or production entry point.
"""
from __future__ import annotations

from dataclasses import dataclass, replace
import hashlib
import json
import sqlite3
import time
from typing import Protocol
import uuid

from sqlite_pilot import (
    Claim, ClaimResult, ExternalDispatchGate, HandoffSpec, LeaseLost,
    SQLiteQueue, TaskSpec,
)


MARKER = "CANARIO_HERMES_CONTROLLER_OK"
PORTFOLIOS = frozenset(("onia", "marca", "comunidad", "lucia"))
FIXTURE_ACTOR = "fixture-sergio"
FIXTURE_BOT = "fixture-bot"
FIXTURE_CHAT = "fixture-chat"
FIXTURE_CHANNEL = "fixture-telegram"
CONTRACT_VERSION = 1
MAX_GRANT_TTL_SECONDS = 300
MAX_CONTEXT_AGE_SECONDS = 300
MAX_CONTEXT_ROTATIONS = 1
AGGREGATE_FIXTURE_BUDGET_UNITS = 1


def _canonical(value: object) -> str:
    return json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=True)


def digest(value: object) -> str:
    return hashlib.sha256(_canonical(value).encode("utf-8")).hexdigest()


@dataclass(frozen=True)
class Goal:
    task_id: str
    worker_id: str
    portfolio: str
    objective: str
    account_scope: str
    budget_units: int
    repo: str
    ref: str
    sha: str
    contract_id: str

    def input_sha(self) -> str:
        return digest((self.task_id, self.worker_id, self.portfolio, self.objective,
                       self.account_scope, self.budget_units, self.repo, self.ref,
                       self.sha, self.contract_id))


@dataclass(frozen=True)
class FixtureContext:
    observed_at: int
    used: int | None
    window: int | None
    model: str = "fixture-model"
    sample_id: str | None = None
    owner_id: str | None = None
    fencing_token: int | None = None


@dataclass(frozen=True)
class FixtureAdmissionSnapshot:
    account_scope: str
    observed_at: int
    quota_status: str
    cost_status: str
    retry_cap_status: str
    tool_policy_status: str
    available_units: int | None


@dataclass(frozen=True)
class FixtureGrant:
    actor: str
    scope: str
    payload_sha: str
    expires_at: int
    bot_id: str | None = None
    chat_id: str | None = None
    channel_id: str | None = None
    contract_version: int | None = None
    nonce: str | None = None
    issued_at: int | None = None
    transport_verified: bool = False
    action: str = "complete"
    task_id: str | None = None
    account_scope: str | None = None
    portfolio: str | None = None


# Backward-compatible public name for callers that grant synthetic completion.
FixtureApproval = FixtureGrant


class ReadOnlyClient(Protocol):
    def run(self, goal: Goal) -> str: ...


def step_native_work(queue, bridge, transport, event: str, request, plan, now: int,
                     *, claim=None, authority=None, result_bundle=None, qa_verifier=None,
                     event_id: str | None = None) -> dict:
    """One explicit finite-work event using the existing store and native transport.

    This function is separate from the unchanged fixture ControllerPilot. It has
    no scheduler, sleep, retry, session factory or default authority/QA verifier.
    Caller references are claims: externally authenticated authority and separate
    QA must verify the exact contract/result before the corresponding mutation.
    This does not enqueue work or choose a new task merely to stay active.
    """
    from native_receipt_bridge import NativeObservation, NativeWorkRequest
    from native_cloud_cli import _validate_artifact_paths
    if type(now) is not int or now < 0 or type(request) is not NativeWorkRequest:
        raise ValueError("explicit finite-work request and epoch required")
    if bridge.queue is not queue or transport.bridge is not bridge:
        raise ValueError("native step must reuse one existing queue and bridge")
    _, _, plan_sha = plan.request()
    _validate_artifact_paths(request.result_paths)
    if (request.plan_sha != plan_sha or request.input_sha != plan_sha
            or request.repo != "onia-hermes" or request.ref != plan.branch
            or request.head != plan.expected_remote_head):
        raise ValueError("finite-work request differs from exact reviewed plan")
    base = {"operation_id": request.operation_id, "cost": "UNKNOWN", "tokens": "UNKNOWN",
            "remote_execution_duration_seconds": "UNKNOWN", "active_context_used": "UNKNOWN",
            "effective_window": "UNKNOWN", "handoff_capability": "UNKNOWN"}
    with queue._connection() as conn:
        task = conn.execute("SELECT * FROM tasks WHERE task_id=?", (request.task_id,)).fetchone()
        guard = conn.execute("SELECT * FROM controller_guard_state WHERE singleton=1").fetchone()
    if task is None or guard is None:
        return {**base, "state": "hold", "reason": "existing_task_and_guard_required"}
    expected = {"worker_id": request.worker_id, "contract_id": request.contract_id,
                "repo": request.repo, "ref": request.ref, "sha": request.head, "input_sha": request.input_sha}
    if any(task[key] != value for key, value in expected.items()):
        raise ValueError("native task identity differs from durable queue")
    native = bridge.read(request.operation_id)
    if event == "submit":
        if guard["stopped"]:
            return {**base, "state": "hold_stop", "client_attempt_count": 0}
        if native is not None:
            return {**base, "state": "needs_reconcile", "reason": "operation_already_exists_no_replay",
                    "remote_id": native["remote_id"] or "UNKNOWN", "client_attempt_count": 0}
        if claim is None or authority is None:
            return {**base, "state": "hold", "reason": "lease_and_external_authority_required",
                    "approval_claim_ref_is_verified": False, "client_attempt_count": 0}
        bridge.authorize_and_reserve_work(claim, request, authority, now)
        # begin_dispatch repeats STOP/epoch checks immediately before the effect.
        return {**base, **transport.submit(request.operation_id, plan)}
    if native is None or native["task_id"] != request.task_id:
        return {**base, "state": "hold", "reason": "original_bound_operation_required"}
    if event not in {"status", "result", "qa"}:
        raise ValueError("native event must be submit, status, result or qa")
    if event_id is None:
        return {**base, "state": "hold", "reason": "unique_event_id_required", "provider_read_attempt_count": 0}
    if not bridge.admit_work_event_once(request, event, event_id, now):
        return {**base, "state": "needs_reconcile", "reason": "event_already_consumed_no_reexecution",
                "provider_read_attempt_count": 0}
    if event in ("status", "result"):
        # STOP prevents new effects; bounded reads of already submitted work are
        # still useful for reconciliation. Terminal evidence is never overwritten.
        if native["state"] in {"completed", "failed", "cancelled"}:
            return {**base, "state": "terminal_awaiting_resolution" if task["status"] != "done" else "closure_resolved",
                    "native_state": native["state"], "remote_id": native["remote_id"], "provider_read_attempt_count": 0}
        if event == "status":
            started_at, started = int(time.time()), time.monotonic()
            status = transport.status(request.operation_id, plan.executable)
            return {**base, **status, "provider_read_attempt_count": 1,
                    "read_started_at_epoch": started_at, "read_finished_at_epoch": int(time.time()),
                    "read_duration_seconds": round(time.monotonic() - started, 6)}
        return {**base, **transport.collect_result(request.operation_id, plan.executable, request.result_paths)}
    if qa_verifier is None or not isinstance(result_bundle, dict) or result_bundle.get("state") != "awaiting_independent_qa":
        return {**base, "state": "awaiting_independent_qa", "reason": "external_qa_and_recovered_bundle_required"}
    if (result_bundle.get("operation_id") != request.operation_id
            or result_bundle.get("remote_id") != native["remote_id"]
            or result_bundle.get("input_sha") != request.input_sha
            or set(result_bundle.get("files", {})) != set(request.result_paths)):
        raise ValueError("QA bundle differs from bound operation and artifact allowlist")
    for item in result_bundle["files"].values():
        artifact = item.get("json", {})
        if (artifact.get("operation_id") != request.operation_id or artifact.get("input_sha") != request.input_sha
                or artifact.get("repository", {}).get("expected_head") != request.head
                or artifact.get("repository", {}).get("observed_head") != request.head):
            raise ValueError("recovered artifact identity/checkout mismatch; no automatic QA")
    bundle_sha = digest(result_bundle)
    review = qa_verifier.verify(request, result_bundle, now)
    if (not isinstance(review, dict) or review.get("verified") is not True
            or review.get("request_sha") != request.digest() or review.get("bundle_sha") != bundle_sha
            or review.get("remote_id") != native["remote_id"]
            or review.get("reviewer_id") in (None, "", request.worker_id)
            or review.get("goal_outcome") not in {"completed", "failed"}
            or not isinstance(review.get("authority_source"), str) or not review["authority_source"]
            or not isinstance(review.get("evidence_ref"), str) or not review["evidence_ref"]):
        return {**base, "state": "awaiting_independent_qa", "reason": "QA_identity_or_result_binding_unverified"}
    # QA determines the business outcome. READY, subprocess exit 0, a JSON label
    # or local caller reference never substitutes for this independent review.
    result_sha = digest({path: item["sha256"] for path, item in result_bundle["files"].items()})
    if native["state"] in {"completed", "failed", "cancelled"}:
        if native.get("observation", {}).get("result_sha") != result_sha or native["state"] != review["goal_outcome"]:
            raise RuntimeError("terminal evidence conflicts; no rebind or overwrite")
    else:
        bridge.ingest(NativeObservation(request.operation_id, "cloud_cli_task", native["remote_id"],
                      request.input_sha, review["goal_outcome"], now, review["evidence_ref"], result_sha), now)
    if task["status"] == "needs_reconcile":
        queue.resolve_reconciliation(request.task_id, "applied",
            "finite_closure:task_submission_applied;goal_outcome=" + review["goal_outcome"] +
            ";independent_qa=" + review["evidence_ref"] + ";bundle_sha=" + bundle_sha + ";retry=forbidden", now)
    elif task["status"] != "done":
        raise RuntimeError("closure is not awaiting authorized resolution")
    with queue._connection() as conn:
        stopped = conn.execute("SELECT stopped FROM controller_guard_state WHERE singleton=1").fetchone()[0]
        unresolved = conn.execute("SELECT task_id FROM tasks WHERE worker_id=? AND status IN ('needs_reconcile','blocked') LIMIT 1",
                                  (request.worker_id,)).fetchone()
        next_row = None if stopped or unresolved else conn.execute(
            "SELECT task_id FROM tasks WHERE worker_id=? AND status='pending' ORDER BY created_at,task_id LIMIT 1",
            (request.worker_id,)).fetchone()
    return {**base, "state": "closure_resolved", "goal_outcome": review["goal_outcome"],
            "queue_done_semantics": "submission_and_terminal_worker_closure_reconciled_not_global_goal_success",
            "result_digest": queue.read_result(request.task_id)["digest"],
            "next_candidate_task_id": next_row[0] if next_row else None,
            "next_action": "hold_stop" if stopped else "require_external_authority_for_next_candidate",
            "independent_qa_ref": review["evidence_ref"], "global_goal_not_closed": True}


class SimulatedProcessCrash(BaseException):
    """Test-only abrupt exit after the fake effect starts."""


class FakeReadOnlyClient:
    def __init__(self, fail: bool = False, crash_after_call: bool = False):
        self.calls = 0
        self.fail = fail
        self.crash_after_call = crash_after_call
        self.stop_during_call = None
        self.observe_queue = None
        self.observe_task_id = None
        self.saw_reserved_attempt = False

    def run(self, goal: Goal) -> str:
        self.calls += 1
        if self.observe_queue is not None:
            with self.observe_queue._connection() as conn:
                row = conn.execute(
                    "SELECT t.effect_state,a.state FROM tasks t "
                    "JOIN controller_admissions a ON a.task_id=t.task_id "
                    "WHERE t.task_id=?",
                    (self.observe_task_id,),
                ).fetchone()
            self.saw_reserved_attempt = bool(
                row is not None
                and row["effect_state"] == "in_flight"
                and row["state"] == "reserved"
            )
        if self.stop_during_call is not None:
            controller, grant, now = self.stop_during_call
            controller.stop(grant, now)
        if self.crash_after_call:
            raise SimulatedProcessCrash("synthetic abrupt exit")
        if self.fail:
            raise RuntimeError("synthetic client failure")
        return MARKER


class FakeSessionFactory:
    def __init__(self):
        self.calls = 0

    def new_owner(self) -> str:
        self.calls += 1
        return f"fixture-session-{self.calls}"


def approval_payload(goal: Goal, result_sha: str) -> str:
    return digest((goal.task_id, goal.portfolio, goal.account_scope,
                   goal.input_sha(), result_sha))


def run_grant_payload(goal: Goal) -> str:
    return digest(("fixture-run", goal.task_id, goal.portfolio,
                   goal.account_scope, goal.input_sha(), CONTRACT_VERSION))


def stop_grant_payload(account_scope: str) -> str:
    return digest(("fixture-stop", account_scope, CONTRACT_VERSION))


def _validate(goal: Goal) -> None:
    if goal.portfolio not in PORTFOLIOS or goal.account_scope != "fixture-only":
        raise ValueError("portfolio or account scope outside synthetic pilot")
    if not goal.objective.startswith("SYNTHETIC:") or len(goal.objective) > 256:
        raise ValueError("only short public synthetic objectives are accepted")
    if type(goal.budget_units) is not int or goal.budget_units != 1:
        raise ValueError("exactly one synthetic budget unit required")


class ControllerPilot:
    """One synthetic action per task, guarded by the same SQLite database."""

    def __init__(self, queue: SQLiteQueue, sessions: FakeSessionFactory,
                 admission: FixtureAdmissionSnapshot | None = None):
        if type(sessions) is not FakeSessionFactory:
            raise TypeError("only fake session renewal is permitted")
        if admission is not None and type(admission) is not FixtureAdmissionSnapshot:
            raise TypeError("admission must be an explicit fixture snapshot")
        self.queue, self.sessions, self.admission = queue, sessions, admission
        self._initialize_guard_tables()

    def _initialize_guard_tables(self) -> None:
        # These guard records share the core queue database and transactions.
        with self.queue._connection() as conn:
            conn.execute("BEGIN IMMEDIATE")
            conn.execute(
                """CREATE TABLE IF NOT EXISTS controller_guard_state (
                    singleton INTEGER PRIMARY KEY CHECK(singleton=1),
                    stopped INTEGER NOT NULL CHECK(stopped IN (0,1)),
                    epoch INTEGER NOT NULL,
                    reason TEXT,
                    updated_at INTEGER NOT NULL
                )"""
            )
            conn.execute(
                """INSERT OR IGNORE INTO controller_guard_state
                   (singleton,stopped,epoch,reason,updated_at) VALUES(1,0,0,NULL,0)"""
            )
            conn.execute(
                """CREATE TABLE IF NOT EXISTS controller_admissions (
                    task_id TEXT PRIMARY KEY REFERENCES tasks(task_id),
                    account_scope TEXT NOT NULL,
                    portfolio TEXT NOT NULL,
                    budget_units INTEGER NOT NULL CHECK(budget_units > 0),
                    attempt_id TEXT NOT NULL UNIQUE,
                    state TEXT NOT NULL CHECK(state IN
                      ('reserved','consumed','needs_reconcile')),
                    stop_epoch INTEGER NOT NULL,
                    reserved_at INTEGER NOT NULL
                )"""
            )
            conn.execute(
                """CREATE TABLE IF NOT EXISTS controller_nonces (
                    nonce TEXT PRIMARY KEY,
                    task_id TEXT NOT NULL,
                    action TEXT NOT NULL,
                    actor TEXT NOT NULL,
                    consumed_at INTEGER NOT NULL
                )"""
            )
            conn.execute(
                """CREATE TABLE IF NOT EXISTS controller_context_samples (
                    sample_id TEXT PRIMARY KEY,
                    task_id TEXT NOT NULL,
                    owner_id TEXT NOT NULL,
                    fencing_token INTEGER NOT NULL,
                    observed_at INTEGER NOT NULL
                )"""
            )
            conn.execute(
                """CREATE TABLE IF NOT EXISTS controller_rotations (
                    task_id TEXT PRIMARY KEY REFERENCES tasks(task_id),
                    account_scope TEXT NOT NULL,
                    sample_id TEXT NOT NULL UNIQUE,
                    owner_id TEXT NOT NULL,
                    fencing_token INTEGER NOT NULL,
                    state TEXT NOT NULL CHECK(state IN ('reserved','consumed')),
                    reserved_at INTEGER NOT NULL
                )"""
            )
            conn.commit()

    def enqueue(self, goal: Goal, now: int) -> None:
        if type(now) is not int or now < 0:
            raise ValueError("now must be a non-negative integer epoch")
        _validate(goal)
        self.queue.enqueue(TaskSpec(goal.task_id, goal.worker_id, goal.repo, goal.ref,
                                    goal.sha, goal.contract_id, goal.input_sha()), now)

    def claim(self, goal: Goal, owner: str, now: int, lease_seconds: int = 60):
        if type(now) is not int or now < 0:
            raise ValueError("now must be a non-negative integer epoch")
        _validate(goal)
        with self.queue._connection() as conn:
            state = conn.execute(
                "SELECT stopped FROM controller_guard_state WHERE singleton=1"
            ).fetchone()
        if state is None or state["stopped"]:
            return ClaimResult("blocked", reason="controller_stopped")
        result = self.queue.claim(goal.worker_id, owner, now, lease_seconds)
        if result.status != "claimed" or result.claim is None:
            return result
        # Queue.claim and the STOP guard are separate core transactions. Recheck
        # under the guard DB lock before exposing a lease to this controller; if
        # STOP won the race, revoke only this exact newly-created lease.
        try:
            with self.queue._connection() as conn:
                conn.execute("BEGIN IMMEDIATE")
                state = conn.execute(
                    "SELECT stopped FROM controller_guard_state WHERE singleton=1"
                ).fetchone()
                if state is None or state["stopped"]:
                    conn.execute(
                        "UPDATE tasks SET status='blocked',last_evidence=? "
                        "WHERE task_id=? AND worker_id=? AND status='running' "
                        "AND effect_state='not_started' AND EXISTS ("
                        "SELECT 1 FROM worker_leases WHERE worker_id=? AND owner_id=? "
                        "AND fencing_token=? AND task_id=?)",
                        ("fixture STOP revoked claim before controller handoff",
                         result.claim.task_id, goal.worker_id, goal.worker_id,
                         result.claim.owner_id, result.claim.fencing_token,
                         result.claim.task_id),
                    )
                    conn.execute(
                        "DELETE FROM worker_leases WHERE worker_id=? AND owner_id=? "
                        "AND fencing_token=?",
                        (goal.worker_id, result.claim.owner_id,
                         result.claim.fencing_token),
                    )
                    conn.commit()
                    return ClaimResult("blocked", reason="controller_stopped")
                self.queue._assert_claim(conn, result.claim, now)
                conn.commit()
        except LeaseLost:
            return ClaimResult("blocked", reason="controller_stopped_or_lease_lost")
        return result

    def _checkpoint(self, goal: Goal, stage: str, evidence: dict) -> dict:
        return {"schema": 1, "repo": goal.repo, "ref": goal.ref, "sha": goal.sha,
                "contract_id": goal.contract_id, "input_sha": goal.input_sha(),
                "step": stage, "status": "running", "evidence": evidence}

    def _assert_goal_row(self, goal: Goal, row) -> None:
        expected = {
            "task_id": goal.task_id, "worker_id": goal.worker_id,
            "repo": goal.repo, "ref": goal.ref, "sha": goal.sha,
            "contract_id": goal.contract_id, "input_sha": goal.input_sha(),
        }
        if any(row[key] != value for key, value in expected.items()):
            raise ValueError("goal identity differs from durable task")

    def _read_owned(self, conn, goal: Goal, claim: Claim, now: int):
        row = self.queue._assert_claim(conn, claim, now)
        self._assert_goal_row(goal, row)
        durable = self.queue._read_checkpoint(row)
        passed = claim.checkpoint
        if (durable is None) != (passed is None):
            raise ValueError("caller checkpoint is stale")
        if durable is not None and digest(dict(durable)) != digest(dict(passed)):
            raise ValueError("caller checkpoint is stale or forged")
        if durable is not None:
            if not isinstance(durable, dict) or not isinstance(durable.get("evidence"), dict):
                raise ValueError("durable controller checkpoint has invalid shape")
            evidence = durable["evidence"]
            rotations = evidence.get("rotations")
            samples = evidence.get("context_samples")
            if (type(evidence.get("controller_version")) is not int
                    or evidence["controller_version"] != CONTRACT_VERSION
                    or evidence.get("portfolio") != goal.portfolio
                    or evidence.get("account_scope") != goal.account_scope
                    or type(evidence.get("budget_units")) is not int
                    or evidence["budget_units"] != goal.budget_units
                    or type(rotations) is not int
                    or rotations < 0 or rotations > MAX_CONTEXT_ROTATIONS
                    or not isinstance(samples, list)
                    or any(not isinstance(item, str) or not item for item in samples)
                    or len(samples) != len(set(samples))):
                raise ValueError("durable controller checkpoint failed version or field checks")
            if durable.get("step") not in {
                "running", "attempt_in_flight", "qa", "approval"
            }:
                raise ValueError("durable controller checkpoint has unknown stage")
        return row, dict(durable) if durable is not None else None

    def _save_checkpoint(self, conn, row, checkpoint: dict, now: int,
                         effect_state: str | None = None,
                         effect_name: str | None = None,
                         effect_key: str | None = None) -> str:
        self.queue._validate_checkpoint(checkpoint, row["task_id"], row)
        serialized = _canonical(checkpoint)
        checkpoint_digest = digest(checkpoint)
        if effect_state is None:
            conn.execute(
                "UPDATE tasks SET step=?,checkpoint_json=?,checkpoint_digest=?,updated_at=? "
                "WHERE task_id=?",
                (str(checkpoint["step"]), serialized, checkpoint_digest, now, row["task_id"]),
            )
        else:
            conn.execute(
                "UPDATE tasks SET step=?,checkpoint_json=?,checkpoint_digest=?,effect_state=?,"
                "effect_name=?,effect_key=?,updated_at=? WHERE task_id=?",
                (str(checkpoint["step"]), serialized, checkpoint_digest, effect_state,
                 effect_name, effect_key, now, row["task_id"]),
            )
        return checkpoint_digest

    def _snapshot_ready(self, goal: Goal, now: int) -> bool:
        snapshot = self.admission
        return bool(
            snapshot is not None
            and type(snapshot.observed_at) is int
            and snapshot.observed_at <= now
            and now - snapshot.observed_at <= MAX_CONTEXT_AGE_SECONDS
            and snapshot.account_scope == goal.account_scope
            and snapshot.quota_status == "known"
            and snapshot.cost_status == "known"
            and snapshot.retry_cap_status == "known"
            and snapshot.tool_policy_status == "known"
            and type(snapshot.available_units) is int
            and snapshot.available_units >= goal.budget_units
        )

    def _valid_context(self, context: FixtureContext | None, claim: Claim,
                       now: int) -> bool:
        return bool(
            type(context) is FixtureContext
            and type(context.observed_at) is int
            and context.observed_at <= now
            and now - context.observed_at <= MAX_CONTEXT_AGE_SECONDS
            and context.model == "fixture-model"
            and type(context.used) is int and type(context.window) is int
            and context.used >= 0 and context.window > 0
            and context.used <= context.window
            and isinstance(context.sample_id, str) and 0 < len(context.sample_id) <= 128
            and context.owner_id == claim.owner_id
            and type(context.fencing_token) is int
            and context.fencing_token == claim.fencing_token
        )

    def _valid_grant(self, grant: FixtureGrant | None, goal: Goal, action: str,
                     now: int, result_sha: str | None = None) -> bool:
        expected_scope = (
            f"fixture_run:{goal.portfolio}" if action == "run"
            else f"fixture_complete:{goal.portfolio}"
        )
        expected_payload = (
            run_grant_payload(goal) if action == "run"
            else approval_payload(goal, result_sha or "")
        )
        return bool(
            type(grant) is FixtureGrant
            and grant.actor == FIXTURE_ACTOR
            and grant.bot_id == FIXTURE_BOT
            and grant.chat_id == FIXTURE_CHAT
            and grant.channel_id == FIXTURE_CHANNEL
            and grant.transport_verified is True
            and type(grant.contract_version) is int
            and grant.contract_version == CONTRACT_VERSION
            and grant.action == action
            and grant.task_id == goal.task_id
            and grant.account_scope == goal.account_scope
            and grant.portfolio == goal.portfolio
            and grant.scope == expected_scope
            and isinstance(grant.nonce, str) and 0 < len(grant.nonce) <= 128
            and type(grant.issued_at) is int and grant.issued_at <= now
            and type(grant.expires_at) is int
            and grant.expires_at > now
            and grant.expires_at > grant.issued_at
            and grant.expires_at - grant.issued_at <= MAX_GRANT_TTL_SECONDS
            and grant.payload_sha == expected_payload
        )

    def _hold_for_stop(self, conn) -> bool:
        row = conn.execute(
            "SELECT stopped FROM controller_guard_state WHERE singleton=1"
        ).fetchone()
        return row is None or row["stopped"] == 1

    def _mark_ambiguous(self, claim: Claim, now: int, attempt_id: str) -> None:
        with self.queue._connection() as conn:
            conn.execute("BEGIN IMMEDIATE")
            row = self.queue._assert_claim(conn, claim, now)
            admission = conn.execute(
                "SELECT state,attempt_id FROM controller_admissions WHERE task_id=?",
                (claim.task_id,),
            ).fetchone()
            if admission is None or admission["attempt_id"] != attempt_id:
                conn.rollback()
                raise RuntimeError("durable attempt reservation changed")
            conn.execute(
                "UPDATE tasks SET status='needs_reconcile',effect_state='needs_reconcile',"
                "last_evidence='fixture effect outcome is ambiguous',ambiguous_owner_id=?,"
                "ambiguous_fencing_token=?,updated_at=? WHERE task_id=?",
                (claim.owner_id, claim.fencing_token, now, claim.task_id),
            )
            conn.execute(
                "UPDATE controller_admissions SET state='needs_reconcile' WHERE task_id=?",
                (claim.task_id,),
            )
            conn.execute("DELETE FROM worker_leases WHERE worker_id=?", (row["worker_id"],))
            conn.commit()

    def _consume_context(self, conn, goal: Goal, claim: Claim,
                         checkpoint: dict, context: FixtureContext, now: int) -> dict | None:
        try:
            conn.execute(
                "INSERT INTO controller_context_samples"
                "(sample_id,task_id,owner_id,fencing_token,observed_at) VALUES(?,?,?,?,?)",
                (context.sample_id, goal.task_id, claim.owner_id,
                 claim.fencing_token, context.observed_at),
            )
        except sqlite3.IntegrityError:
            return None
        evidence = dict(checkpoint["evidence"])
        sample_ids = list(evidence.get("context_samples", []))
        sample_ids.append(context.sample_id)
        evidence["context_samples"] = sample_ids
        evidence["last_context_owner"] = claim.owner_id
        evidence["last_context_fence"] = claim.fencing_token
        cp = self._checkpoint(goal, "running", evidence)
        return cp

    def step(self, goal: Goal, claim: Claim, now: int, context: FixtureContext | None,
             client: ReadOnlyClient, approval: FixtureGrant | None = None,
             run_grant: FixtureGrant | None = None):
        if type(now) is not int or now < 0:
            raise ValueError("now must be a non-negative integer epoch")
        _validate(goal)
        if type(client) is not FakeReadOnlyClient:
            raise TypeError("real model/provider clients remain blocked")
        with self.queue._connection() as conn:
            conn.execute("BEGIN IMMEDIATE")
            if self._hold_for_stop(conn):
                conn.rollback()
                return claim, "stopped"
            row, cp = self._read_owned(conn, goal, claim, now)
            if cp is None:
                if row["status"] != "running" or row["effect_state"] != "not_started":
                    conn.rollback()
                    return claim, "held_durable_state"
                initial = self._checkpoint(goal, "running", {
                    "portfolio": goal.portfolio, "account_scope": goal.account_scope,
                    "budget_units": goal.budget_units, "context_samples": [],
                    "rotations": 0, "controller_version": CONTRACT_VERSION,
                })
                self._save_checkpoint(conn, row, initial, now)
                conn.commit()
                return replace(claim, checkpoint=initial), "running"
            stage = cp.get("step")
            evidence = dict(cp.get("evidence", {}))
            if (stage == "attempt_in_flight"
                    or row["effect_state"] in ("in_flight", "needs_reconcile")):
                conn.rollback()
                return claim, "needs_reconcile"
            if stage == "running":
                if row["effect_state"] != "not_started":
                    conn.rollback()
                    return claim, "held_durable_state"
                if not self._snapshot_ready(goal, now):
                    conn.rollback()
                    return claim, "held_admission_unknown"
                if not self._valid_context(context, claim, now):
                    conn.rollback()
                    return claim, "held_context_unknown"
                if not self._valid_grant(run_grant, goal, "run", now):
                    conn.rollback()
                    return claim, "held_authorization"
                # Authorize and reserve the shared account budget before consuming
                # a context sample or creating a successor session. Rotation is an
                # admitted controller action too; it cannot bypass nonce/budget
                # checks merely because it makes no fake client call.
                if conn.execute(
                    "SELECT 1 FROM controller_nonces WHERE nonce=?", (run_grant.nonce,)
                ).fetchone():
                    conn.rollback()
                    return claim, "held_authorization_replay"
                aggregate = conn.execute(
                    "SELECT COALESCE(SUM(budget_units),0) FROM controller_admissions "
                    "WHERE account_scope=? AND state IN ('reserved','consumed','needs_reconcile')",
                    (goal.account_scope,),
                ).fetchone()[0]
                if aggregate + goal.budget_units > AGGREGATE_FIXTURE_BUDGET_UNITS:
                    conn.rollback()
                    return claim, "held_aggregate_budget"
                existing_admission = conn.execute(
                    "SELECT account_scope,portfolio,budget_units,state FROM controller_admissions "
                    "WHERE task_id=?", (goal.task_id,)
                ).fetchone()
                if existing_admission is not None:
                    conn.rollback()
                    return claim, "held_durable_state"
                if existing_admission is None:
                    active = conn.execute(
                        "SELECT 1 FROM controller_admissions WHERE state='reserved' LIMIT 1"
                    ).fetchone()
                    if active:
                        conn.rollback()
                        return claim, "held_concurrent_attempt"
                if conn.execute(
                    "SELECT 1 FROM controller_context_samples WHERE sample_id=?",
                    (context.sample_id,),
                ).fetchone():
                    conn.rollback()
                    return claim, "held_context_replayed"
                reserve = max(16, goal.budget_units)
                threshold = min(500_000, (7 * context.window + 9) // 10)
                rotations = evidence.get("rotations", 0)
                if context.used + reserve >= threshold and rotations >= MAX_CONTEXT_ROTATIONS:
                    conn.rollback()
                    return claim, "held_rotation_limit"
                consumed = self._consume_context(conn, goal, claim, cp, context, now)
                if consumed is None:
                    conn.rollback()
                    return claim, "held_context_replayed"
                if context.used + reserve >= threshold:
                    rotation_count = conn.execute(
                        "SELECT COUNT(*) FROM controller_rotations WHERE account_scope=? "
                        "AND state IN ('reserved','consumed')",
                        (goal.account_scope,),
                    ).fetchone()[0]
                    if rotation_count >= AGGREGATE_FIXTURE_BUDGET_UNITS:
                        conn.rollback()
                        return claim, "held_rotation_budget"
                    conn.execute(
                        "INSERT INTO controller_nonces(nonce,task_id,action,actor,consumed_at) "
                        "VALUES(?,?,?,?,?)",
                        (run_grant.nonce, goal.task_id, "run", run_grant.actor, now),
                    )
                    guard_state = conn.execute(
                        "SELECT epoch,stopped FROM controller_guard_state WHERE singleton=1"
                    ).fetchone()
                    if guard_state is None or guard_state["stopped"]:
                        conn.rollback()
                        return claim, "stopped"
                    conn.execute(
                        "INSERT INTO controller_rotations"
                        "(task_id,account_scope,sample_id,owner_id,fencing_token,state,reserved_at)"
                        " VALUES(?,?,?,?,?,'reserved',?)",
                        (goal.task_id, goal.account_scope, context.sample_id,
                         claim.owner_id, claim.fencing_token, now),
                    )
                    consumed["evidence"]["rotations"] = rotations + 1
                    self._save_checkpoint(conn, row, consumed, now)
                    conn.commit()
                    updated_claim = replace(claim, checkpoint=consumed)
                else:
                    attempt_id = uuid.uuid4().hex
                    consumed["step"] = "attempt_in_flight"
                    consumed["evidence"]["attempt_id"] = attempt_id
                    state = conn.execute(
                        "SELECT epoch,stopped FROM controller_guard_state WHERE singleton=1"
                    ).fetchone()
                    if state is None or state["stopped"]:
                        conn.rollback()
                        return claim, "stopped"
                    self._save_checkpoint(
                        conn, row, consumed, now, effect_state="in_flight",
                        effect_name="fixture_read_only_call", effect_key=attempt_id,
                    )
                    conn.execute(
                        "INSERT INTO controller_nonces(nonce,task_id,action,actor,consumed_at) "
                        "VALUES(?,?,?,?,?)",
                        (run_grant.nonce, goal.task_id, "run", run_grant.actor, now),
                    )
                    conn.execute(
                        "INSERT INTO controller_admissions"
                        "(task_id,account_scope,portfolio,budget_units,attempt_id,state,stop_epoch,reserved_at)"
                        " VALUES(?,?,?,?,?,'reserved',?,?)",
                        (goal.task_id, goal.account_scope, goal.portfolio,
                         goal.budget_units, attempt_id, state["epoch"], now),
                    )
                    conn.commit()
                    attempt_claim = replace(claim, checkpoint=consumed)
                    try:
                        result = client.run(goal)
                    except Exception:
                        self._mark_ambiguous(attempt_claim, now, attempt_id)
                        return attempt_claim, "needs_reconcile"
                    if result != MARKER:
                        self._mark_ambiguous(attempt_claim, now, attempt_id)
                        return attempt_claim, "needs_reconcile"
                    with self.queue._connection() as finish:
                        finish.execute("BEGIN IMMEDIATE")
                        current, durable_attempt = self._read_owned(
                            finish, goal, attempt_claim, now)
                        current_state = finish.execute(
                            "SELECT epoch,stopped FROM controller_guard_state WHERE singleton=1"
                        ).fetchone()
                        admission_row = finish.execute(
                            "SELECT state,attempt_id,stop_epoch FROM controller_admissions WHERE task_id=?",
                            (goal.task_id,),
                        ).fetchone()
                        if (current_state is None or current_state["stopped"]
                                or admission_row is None
                                or current_state["epoch"] != admission_row["stop_epoch"]
                                or admission_row["attempt_id"] != attempt_id
                                or admission_row["state"] != "reserved"):
                            finish.execute(
                                "UPDATE tasks SET status='needs_reconcile',effect_state='needs_reconcile',"
                                "last_evidence='STOP or admission change after fixture call',"
                                "ambiguous_owner_id=?,ambiguous_fencing_token=?,updated_at=? WHERE task_id=?",
                                (claim.owner_id, claim.fencing_token, now, goal.task_id),
                            )
                            finish.execute(
                                "UPDATE controller_admissions SET state='needs_reconcile' WHERE task_id=?",
                                (goal.task_id,),
                            )
                            finish.execute("DELETE FROM worker_leases WHERE worker_id=?",
                                           (goal.worker_id,))
                            finish.commit()
                            return attempt_claim, "needs_reconcile"
                        if (durable_attempt.get("step") != "attempt_in_flight"
                                or durable_attempt["evidence"].get("attempt_id") != attempt_id
                                or current["effect_state"] != "in_flight"):
                            finish.rollback()
                            raise ValueError("durable attempt changed during fake call")
                        qa_cp = self._checkpoint(goal, "qa", {
                            **durable_attempt["evidence"], "result": result,
                            "result_sha": digest(result),
                        })
                        self._save_checkpoint(
                            finish, current, qa_cp, now, effect_state="applied",
                            effect_name="fixture_read_only_call", effect_key=attempt_id,
                        )
                        finish.execute(
                            "UPDATE controller_admissions SET state='consumed' "
                            "WHERE task_id=? AND attempt_id=?",
                            (goal.task_id, attempt_id),
                        )
                        finish.commit()
                    return replace(attempt_claim, checkpoint=qa_cp), "qa"
                # A rotation sample is durably consumed before handoff/session creation.
                owner = self.sessions.new_owner()
                packet = self.queue.prepare_handoff(updated_claim, HandoffSpec(
                    successor_owner_id=owner, objective=goal.objective,
                    gates=("fixture-only",), evidence_refs=(goal.input_sha(),),
                    next_action="continue synthetic read-only step", cursor="running",
                    model_configured="fixture-model", model_observed="UNKNOWN"), now)
                self.queue.acknowledge_handoff(packet.handoff_id, owner, packet.digest,
                                               goal.sha, "fixture-ack", now)
                successor = self.queue.activate_handoff(packet.handoff_id, owner, now, 60)
                self.queue.archive_previous(packet.handoff_id, successor, now)
                return successor, "rotated"
            if stage == "qa":
                if (row["effect_state"] != "applied"
                        or evidence.get("result") != MARKER
                        or evidence.get("result_sha") != digest(MARKER)):
                    conn.rollback()
                    return claim, "held_qa"
                admission = conn.execute(
                    "SELECT state FROM controller_admissions WHERE task_id=?",
                    (goal.task_id,),
                ).fetchone()
                if admission is None or admission["state"] != "consumed":
                    conn.rollback()
                    return claim, "held_admission"
                approval_cp = self._checkpoint(goal, "approval",
                                               {**evidence, "qa": "pass"})
                self._save_checkpoint(conn, row, approval_cp, now)
                conn.commit()
                return replace(claim, checkpoint=approval_cp), "approval"
            if stage == "approval":
                if (row["effect_state"] != "applied"
                        or evidence.get("result") != MARKER
                        or evidence.get("result_sha") != digest(MARKER)
                        or evidence.get("qa") != "pass"):
                    conn.rollback()
                    return claim, "held_qa"
                if not self._valid_grant(approval, goal, "complete", now,
                                         evidence.get("result_sha")):
                    conn.rollback()
                    return claim, "held_approval"
                if conn.execute(
                    "SELECT 1 FROM controller_nonces WHERE nonce=?", (approval.nonce,)
                ).fetchone():
                    conn.rollback()
                    return claim, "held_approval_replay"
                state = conn.execute(
                    "SELECT stopped FROM controller_guard_state WHERE singleton=1"
                ).fetchone()
                if state is None or state["stopped"]:
                    conn.rollback()
                    return claim, "stopped"
                result_receipt = {"result": "synthetic_done",
                                  "evidence_ref": f"sha256:{approval.payload_sha}"}
                result_digest = digest(result_receipt)
                conn.execute(
                    "INSERT INTO controller_nonces(nonce,task_id,action,actor,consumed_at) "
                    "VALUES(?,?,?,?,?)",
                    (approval.nonce, goal.task_id, "complete", approval.actor, now),
                )
                conn.execute(
                    "INSERT INTO task_results(task_id,owner_id,fencing_token,evidence_json,"
                    "evidence_digest,closed_at) VALUES(?,?,?,?,?,?)",
                    (goal.task_id, claim.owner_id, claim.fencing_token,
                     _canonical(result_receipt), result_digest, now),
                )
                conn.execute(
                    "UPDATE tasks SET status='done',last_evidence=?,updated_at=? WHERE task_id=?",
                    ("result:" + result_digest, now, goal.task_id),
                )
                conn.execute("DELETE FROM worker_leases WHERE worker_id=?", (goal.worker_id,))
                conn.commit()
                return claim, f"done:{result_digest}"
            conn.rollback()
            return claim, "held_unknown_stage"

    def stop(self, grant: FixtureGrant, now: int) -> str:
        if type(now) is not int or now < 0:
            return "held_stop_authorization"
        if not self._valid_control_grant(grant, now, "stop"):
            return "held_stop_authorization"
        with self.queue._connection() as conn:
            conn.execute("BEGIN IMMEDIATE")
            if conn.execute(
                "SELECT 1 FROM controller_nonces WHERE nonce=?", (grant.nonce,)
            ).fetchone():
                conn.rollback()
                return "held_stop_replay"
            state = conn.execute(
                "SELECT epoch,stopped FROM controller_guard_state WHERE singleton=1"
            ).fetchone()
            if state is None:
                conn.rollback()
                return "held_guard_unavailable"
            conn.execute(
                "INSERT INTO controller_nonces(nonce,task_id,action,actor,consumed_at) "
                "VALUES(?,?,?,?,?)",
                (grant.nonce, "controller-stop", "stop", grant.actor, now),
            )
            conn.execute(
                "UPDATE controller_guard_state SET stopped=1,epoch=epoch+1,reason=?,updated_at=? "
                "WHERE singleton=1",
                ("fixture STOP", now),
            )
            # Fence future local steps. Keep only an already-in-flight lease so its
            # returning fake call can be recorded as ambiguous, never as completed.
            conn.execute(
                "UPDATE tasks SET status='blocked',last_evidence='fixture STOP revoked future step',"
                "updated_at=? WHERE status='running' AND effect_state!='in_flight'",
                (now,),
            )
            conn.execute(
                "DELETE FROM worker_leases WHERE task_id IN "
                "(SELECT task_id FROM tasks WHERE status='blocked' "
                "AND last_evidence='fixture STOP revoked future step')"
            )
            conn.commit()
        return "stopped_fixture_admission"

    def _valid_control_grant(self, grant: FixtureGrant | None, now: int,
                             action: str) -> bool:
        return bool(
            type(grant) is FixtureGrant
            and grant.actor == FIXTURE_ACTOR and grant.bot_id == FIXTURE_BOT
            and grant.chat_id == FIXTURE_CHAT and grant.channel_id == FIXTURE_CHANNEL
            and grant.transport_verified is True
            and type(grant.contract_version) is int
            and grant.contract_version == CONTRACT_VERSION
            and grant.action == action and grant.task_id == "controller-control"
            and grant.account_scope == "fixture-only" and grant.portfolio == "onia"
            and grant.scope == "fixture_control:onia"
            and grant.payload_sha == stop_grant_payload(grant.account_scope)
            and isinstance(grant.nonce, str) and 0 < len(grant.nonce) <= 128
            and type(grant.issued_at) is int and grant.issued_at <= now
            and type(grant.expires_at) is int and grant.expires_at > now
            and grant.expires_at > grant.issued_at
            and grant.expires_at - grant.issued_at <= MAX_GRANT_TTL_SECONDS
        )


def make_fixture_grant(goal: Goal, action: str, now: int, nonce: str,
                       result_sha: str | None = None) -> FixtureGrant:
    payload = (run_grant_payload(goal) if action == "run"
               else approval_payload(goal, result_sha or ""))
    return FixtureGrant(
        FIXTURE_ACTOR,
        f"fixture_run:{goal.portfolio}" if action == "run"
        else f"fixture_complete:{goal.portfolio}",
        payload, now + 60, FIXTURE_BOT, FIXTURE_CHAT, FIXTURE_CHANNEL,
        CONTRACT_VERSION, nonce, now, True, action, goal.task_id,
        goal.account_scope, goal.portfolio,
    )


def make_stop_grant(now: int, nonce: str) -> FixtureGrant:
    return FixtureGrant(
        FIXTURE_ACTOR, "fixture_control:onia", stop_grant_payload("fixture-only"),
        now + 60, FIXTURE_BOT, FIXTURE_CHAT, FIXTURE_CHANNEL, CONTRACT_VERSION,
        nonce, now, True, "stop", "controller-control", "fixture-only", "onia",
    )


def demo() -> dict:
    """End-to-end fixture with no IO outside a temporary SQLite database."""
    from pathlib import Path
    import tempfile

    with tempfile.TemporaryDirectory(prefix="onia-controller-fixture-") as area:
        queue = SQLiteQueue(Path(area) / "queue.sqlite3")
        admission = FixtureAdmissionSnapshot("fixture-only", 100, "known", "known",
                                              "known", "known", 1)
        controller = ControllerPilot(queue, FakeSessionFactory(), admission)
        goal = Goal("fixture-goal-1", "fixture-worker", "onia",
                    "SYNTHETIC: verify controller flow", "fixture-only", 1,
                    "fixture/repo", "codex/fixture", "a" * 40, "fixture-contract")
        controller.enqueue(goal, 100)
        claim = controller.claim(goal, "fixture-session-0", 101).claim
        client = FakeReadOnlyClient()
        stages = []
        claim, stage = controller.step(goal, claim, 102, None, client)
        stages.append(stage)
        high = FixtureContext(103, 95, 100, sample_id="sample-high",
                              owner_id=claim.owner_id, fencing_token=claim.fencing_token)
        run_grant = make_fixture_grant(goal, "run", 103, "run-nonce-1")
        claim, stage = controller.step(goal, claim, 103, high, client, run_grant=run_grant)
        stages.append(stage)
        low = FixtureContext(104, 10, 100, sample_id="sample-low",
                             owner_id=claim.owner_id, fencing_token=claim.fencing_token)
        run_grant = make_fixture_grant(goal, "run", 104, "run-nonce-2")
        claim, stage = controller.step(goal, claim, 104, low, client, run_grant=run_grant)
        stages.append(stage)
        claim, stage = controller.step(goal, claim, 105, None, client)
        stages.append(stage)
        claim, stage = controller.step(goal, claim, 106, None, client)
        stages.append(stage)
        approval = make_fixture_grant(goal, "complete", 107, "complete-nonce-1",
                                      digest(MARKER))
        claim, stage = controller.step(goal, claim, 107, None, client, approval=approval)
        stages.append(stage.split(":")[0])
        return {"status": stages[-1], "stages": stages, "model_calls": client.calls,
                "session_renewals": controller.sessions.calls,
                "result_digest": queue.read_result(goal.task_id)["digest"],
                "next_claim": controller.claim(goal, "fixture-session-final", 108).status,
                "external_dispatch": "closed"}


if __name__ == "__main__":
    print(json.dumps(demo(), sort_keys=True))
