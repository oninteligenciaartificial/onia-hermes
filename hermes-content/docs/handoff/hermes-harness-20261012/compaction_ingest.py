"""One-shot local compaction-event inbox; no controller or transport calls."""
from __future__ import annotations

import hashlib
import json
import os
import re
import sqlite3
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from types import MappingProxyType
from typing import Mapping

from desktop_context_meter import (
    CompactionReceipt,
    MAX_FUTURE_SKEW_SECONDS,
    SCHEMA_VERSION,
    _compaction_event_key,
    _utc_datetime,
    read_compaction_receipt,
)
from sqlite_pilot import Claim, LeaseLost, SQLiteQueue


_HEX_256 = re.compile(r"^[0-9a-f]{64}$")
_BINDING_ID = re.compile(r"^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$")
_MAPPING_PROXY_TYPE = type(MappingProxyType({}))
MAX_LOCAL_RECEIPT_AGE_SECONDS = 300


@dataclass(frozen=True, slots=True)
class SourceBinding:
    """Preauthorized local source-to-task mapping, never a caller receipt."""

    binding_id: str
    source_path: str | os.PathLike[str]
    expected_session_id: str
    worker_id: str
    task_id: str
    acknowledged_event_key: str | None = None


@dataclass(frozen=True, slots=True)
class IngestResult:
    status: str
    intent_id: str | None = None
    event_key: str | None = None
    reason: str | None = None


# Explicit configuration only. Keeping this empty means all ingests fail closed.
# Values are frozen SourceBinding instances; do not populate from caller input.
PREAUTHORIZED_SOURCE_BINDINGS: Mapping[str, SourceBinding] = MappingProxyType({})


def _validated_binding(binding_id: str) -> SourceBinding | None:
    if not isinstance(binding_id, str) or not _BINDING_ID.fullmatch(binding_id):
        return None
    registry = PREAUTHORIZED_SOURCE_BINDINGS
    if type(registry) is not _MAPPING_PROXY_TYPE:
        return None
    binding = registry.get(binding_id)
    if type(binding) is not SourceBinding or binding.binding_id != binding_id:
        return None
    try:
        raw_path = os.fspath(binding.source_path)
        path = Path(raw_path)
    except (TypeError, ValueError, OSError):
        return None
    if (
        not isinstance(raw_path, str)
        or not raw_path
        or "\x00" in raw_path
        or not path.is_absolute()
        or ".." in path.parts
        or raw_path.startswith(("\\\\", "//"))
        or path.suffix.lower() != ".jsonl"
        or not isinstance(binding.expected_session_id, str)
        or not binding.expected_session_id.strip()
        or len(binding.expected_session_id) > 128
        or not isinstance(binding.worker_id, str)
        or not binding.worker_id.strip()
        or len(binding.worker_id) > 128
        or not isinstance(binding.task_id, str)
        or not binding.task_id.strip()
        or len(binding.task_id) > 128
        or (binding.acknowledged_event_key is not None
            and (not isinstance(binding.acknowledged_event_key, str)
                 or not _HEX_256.fullmatch(binding.acknowledged_event_key)))
    ):
        return None
    return binding


def _receipt_is_valid(receipt: CompactionReceipt, binding: SourceBinding) -> bool:
    if type(receipt) is not CompactionReceipt:
        return False
    if (
        type(receipt.schema_version) is not int
        or receipt.schema_version != SCHEMA_VERSION
        or receipt.binding_id != binding.binding_id
        or receipt.validation_status != "validated"
        or not isinstance(receipt.event_key, str)
        or not _HEX_256.fullmatch(receipt.event_key)
        or not isinstance(receipt.event_timestamp_utc, str)
        or not isinstance(receipt.observed_at_utc, str)
    ):
        return False
    event_at = _utc_datetime(receipt.event_timestamp_utc)
    observed_at = _utc_datetime(receipt.observed_at_utc)
    if event_at is None or observed_at is None:
        return False
    if receipt.event_timestamp_utc != event_at.isoformat().replace("+00:00", "Z"):
        return False
    if receipt.observed_at_utc != observed_at.isoformat().replace("+00:00", "Z"):
        return False
    return receipt.event_key == _compaction_event_key(binding.expected_session_id, event_at)


def _intent_id(binding_id: str, event_key: str) -> str:
    return hashlib.sha256(f"{binding_id}\n{event_key}".encode("utf-8")).hexdigest()


def _receipt_digest(receipt: CompactionReceipt) -> str:
    payload = {
        "schema_version": receipt.schema_version,
        "binding_id": receipt.binding_id,
        "event_key": receipt.event_key,
        "event_timestamp_utc": receipt.event_timestamp_utc,
        "observed_at_utc": receipt.observed_at_utc,
    }
    serialized = json.dumps(payload, sort_keys=True, separators=(",", ":"))
    return hashlib.sha256(serialized.encode("utf-8")).hexdigest()


def _held(status: str, reason: str) -> IngestResult:
    return IngestResult(status=status, reason=reason)


def ingest_compaction_once(
    queue: SQLiteQueue, binding_id: str, claim: Claim
) -> IngestResult:
    """Read an authorized source once and durably request a checkpoint in SQLite.

    The API accepts neither paths nor receipt mappings. The local source is read
    through the configured immutable binding. A returned request records event
    ingestion only; it does not alter task checkpoint, lease, ownership, or effect
    state, and does not create or contact a session or transport.
    """
    binding = _validated_binding(binding_id)
    if binding is None:
        return _held("held_source_unbound", "binding_missing_or_invalid")
    if type(queue) is not SQLiteQueue or type(claim) is not Claim:
        return _held("held_claim_invalid", "queue_or_claim_type_invalid")

    observed_at = datetime.now(timezone.utc)
    receipt = read_compaction_receipt(
        binding.source_path,
        expected_session_id=binding.expected_session_id,
        binding_id=binding.binding_id,
        now=observed_at,
    )
    if receipt is None or not _receipt_is_valid(receipt, binding):
        return _held("held_compaction_unavailable", "source_or_event_not_validated")

    event_at = _utc_datetime(receipt.event_timestamp_utc)
    receipt_at = _utc_datetime(receipt.observed_at_utc)
    if event_at is None or receipt_at is None:
        return _held("held_compaction_unavailable", "receipt_timestamp_invalid")

    # This TTL belongs to the fresh local validation receipt, not the event.
    # A valid unacknowledged event can survive an arbitrary restart delay.
    commit_at = datetime.now(timezone.utc)
    receipt_age = (commit_at - receipt_at).total_seconds()
    if receipt_age < -MAX_FUTURE_SKEW_SECONDS or receipt_age > MAX_LOCAL_RECEIPT_AGE_SECONDS:
        return _held("held_receipt_stale", "local_observation_outside_ttl")
    if (event_at - commit_at).total_seconds() > MAX_FUTURE_SKEW_SECONDS:
        return _held("held_compaction_unavailable", "event_timestamp_in_future")

    with queue._connection() as conn:
        conn.execute("BEGIN IMMEDIATE")
        # A competing writer can hold the SQLite lock after the initial read.
        # Recheck receipt TTL, event skew, and lease time only after this
        # transaction owns the write lock.
        transaction_at = datetime.now(timezone.utc)
        transaction_receipt_age = (transaction_at - receipt_at).total_seconds()
        if (transaction_receipt_age < -MAX_FUTURE_SKEW_SECONDS
                or transaction_receipt_age > MAX_LOCAL_RECEIPT_AGE_SECONDS):
            conn.rollback()
            return _held("held_receipt_stale", "local_observation_outside_ttl")
        if (event_at - transaction_at).total_seconds() > MAX_FUTURE_SKEW_SECONDS:
            conn.rollback()
            return _held("held_compaction_unavailable", "event_timestamp_in_future")
        now = int(transaction_at.timestamp())
        try:
            row = queue._assert_claim(conn, claim, now)
        except LeaseLost:
            conn.rollback()
            return _held("held_lease_lost", "claim_expired_or_fenced")

        if row["task_id"] != binding.task_id or row["worker_id"] != binding.worker_id:
            conn.rollback()
            return _held("held_binding_mismatch", "task_or_worker_differs")
        if row["status"] != "running":
            conn.rollback()
            return _held("held_task_not_running", "task_status_not_running")
        if row["effect_state"] in ("in_flight", "needs_reconcile"):
            conn.rollback()
            return _held("held_effect_ambiguous", "external_effect_requires_reconciliation")

        guard_exists = conn.execute(
            "SELECT 1 FROM sqlite_master WHERE type='table' AND name='controller_guard_state'"
        ).fetchone()
        if guard_exists is None:
            conn.rollback()
            return _held("held_stop_unknown", "guard_table_missing")
        try:
            guard_rows = conn.execute(
                "SELECT singleton,stopped,epoch FROM controller_guard_state"
            ).fetchall()
        except sqlite3.Error:
            conn.rollback()
            return _held("held_stop_unknown", "guard_state_unreadable")
        if (
            len(guard_rows) != 1
            or type(guard_rows[0]["singleton"]) is not int
            or guard_rows[0]["singleton"] != 1
            or type(guard_rows[0]["stopped"]) is not int
            or guard_rows[0]["stopped"] not in (0, 1)
            or type(guard_rows[0]["epoch"]) is not int
            or guard_rows[0]["epoch"] < 0
        ):
            conn.rollback()
            return _held("held_stop_unknown", "guard_state_invalid")
        guard = guard_rows[0]
        if guard["stopped"] != 0:
            conn.rollback()
            return _held("held_stopped", "stop_active")

        if binding.acknowledged_event_key == receipt.event_key:
            conn.rollback()
            return IngestResult("baseline_seen", event_key=receipt.event_key)

        conn.execute(
            """CREATE TABLE IF NOT EXISTS compaction_checkpoint_intents (
                intent_id TEXT PRIMARY KEY,
                binding_id TEXT NOT NULL,
                event_key TEXT NOT NULL CHECK(length(event_key)=64),
                task_id TEXT NOT NULL REFERENCES tasks(task_id),
                worker_id TEXT NOT NULL,
                repo TEXT NOT NULL,
                ref TEXT NOT NULL,
                sha TEXT NOT NULL,
                contract_id TEXT NOT NULL,
                input_sha TEXT NOT NULL,
                owner_id TEXT NOT NULL,
                fencing_token INTEGER NOT NULL,
                event_timestamp_utc TEXT NOT NULL,
                observed_at_utc TEXT NOT NULL,
                stop_epoch INTEGER NOT NULL,
                receipt_digest TEXT NOT NULL CHECK(length(receipt_digest)=64),
                state TEXT NOT NULL CHECK(state='requested'),
                created_at INTEGER NOT NULL,
                UNIQUE(binding_id,event_key)
            )"""
        )
        intent_id = _intent_id(binding.binding_id, receipt.event_key)
        existing = conn.execute(
            "SELECT intent_id,task_id,worker_id FROM compaction_checkpoint_intents "
            "WHERE binding_id=? AND event_key=?",
            (binding.binding_id, receipt.event_key),
        ).fetchone()
        if existing is not None:
            if existing["task_id"] != binding.task_id or existing["worker_id"] != binding.worker_id:
                conn.rollback()
                return _held("held_binding_conflict", "dedupe_key_bound_to_other_task")
            conn.commit()
            return IngestResult("duplicate", existing["intent_id"], receipt.event_key)

        conn.execute(
            """INSERT INTO compaction_checkpoint_intents(
                intent_id,binding_id,event_key,task_id,worker_id,repo,ref,sha,
                contract_id,input_sha,owner_id,fencing_token,event_timestamp_utc,
                observed_at_utc,stop_epoch,receipt_digest,state,created_at
            ) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?, 'requested',?)""",
            (
                intent_id, binding.binding_id, receipt.event_key, row["task_id"],
                row["worker_id"], row["repo"], row["ref"], row["sha"],
                row["contract_id"], row["input_sha"], claim.owner_id,
                claim.fencing_token, receipt.event_timestamp_utc,
                receipt.observed_at_utc, guard["epoch"], _receipt_digest(receipt), now,
            ),
        )
        conn.commit()
        return IngestResult("requested", intent_id, receipt.event_key)
