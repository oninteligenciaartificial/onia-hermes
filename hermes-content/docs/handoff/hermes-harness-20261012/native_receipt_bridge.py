"""Local native execution ledger in the existing queue; no provider calls.

The mother may reserve an operation before an authorized native dispatch, then
import its observed receipt. Imported observations are evidence, not verified
provider authority or QA. No method dispatches, retries, cancels or closes tasks.
"""
from dataclasses import dataclass, asdict
import hashlib
import json
import re
import time
from typing import Protocol

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


def _exact_work_authority(row, request):
    """Return the hash-checked authority proof only for this exact durable request."""
    from dataclasses import asdict

    payload = row["work_authority_json"]
    if (type(payload) is not str or not payload
            or type(row["work_authority_sha"]) is not str
            or hashlib.sha256(payload.encode()).hexdigest() != row["work_authority_sha"]):
        return None
    try:
        proof = json.loads(payload)
        expected_request = json.loads(json.dumps(asdict(request), sort_keys=True,
                                                 separators=(",", ":")))
    except (UnicodeError, ValueError, TypeError, RecursionError):
        return None
    if (type(proof) is not dict
            or set(proof) not in ({"request", "authorization"},
                                  {"request", "authorization", "revalidation_history"})
            or proof.get("request") != expected_request
            or type(proof.get("authorization")) is not dict):
        return None
    authorization = proof["authorization"]
    if (authorization.get("verified") is not True
            or authorization.get("request_sha") != request.digest()
            or authorization.get("grant_nonce") != request.nonce
            or authorization.get("scope") != "native_work_closure"
            or type(authorization.get("actor")) is not str or not authorization["actor"]
            or type(authorization.get("authority_source")) is not str
            or not authorization["authority_source"]
            or type(authorization.get("evidence_ref")) is not str
            or authorization.get("evidence_ref") != row["authorization_ref"]
            or type(authorization.get("expires_at")) is not int):
        return None
    if "revalidation_history" in proof and (
            type(proof["revalidation_history"]) is not list
            or len(proof["revalidation_history"]) > 1):
        return None
    return proof


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


@dataclass(frozen=True)
class NativeWorkRequest:
    """Public finite-work contract; approval_claim_ref is ONLY a caller claim."""
    task_id: str
    worker_id: str
    contract_id: str
    repo: str
    ref: str
    head: str
    input_sha: str
    operation_id: str
    nonce: str
    plan_sha: str
    approval_claim_ref: str
    predecessor_task_id: str
    result_paths: tuple[str, ...]
    max_status_events: int
    max_result_events: int

    def __post_init__(self):
        # Required fields: historical requests are never grandfathered/reset.
        for name, ceiling in (("max_status_events", 2), ("max_result_events", 1)):
            value = getattr(self, name)
            if type(value) is not int or not 0 <= value <= ceiling:
                raise ValueError(f"{name} must be an integer from 0 to {ceiling}")

    def digest(self) -> str:
        return hashlib.sha256(json.dumps(asdict(self), sort_keys=True,
                                         separators=(",", ":")).encode()).hexdigest()


@dataclass(frozen=True)
class NativeWorkAuthorization:
    verified: bool
    request_sha: str
    grant_nonce: str
    actor: str
    authority_source: str
    evidence_ref: str
    expires_at: int
    scope: str = "native_work_closure"


class NativeWorkAuthority(Protocol):
    """External authority implementation must authenticate approval independently.

    A callback returning the request's caller claim as 'verified' violates this
    interface. This pilot implements no human/account authentication provider.
    """
    def verify(self, request: NativeWorkRequest, now: int) -> NativeWorkAuthorization: ...


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
                work_authority_json TEXT,
                work_authority_sha TEXT,
                work_events_json TEXT,
                UNIQUE(surface,remote_id)
            )""")

    @staticmethod
    def prepare_finite_work_schema(queue: SQLiteQueue, reviewed_change_ref: str) -> dict:
        """EXPLICIT local schema change, only after specific human approval/QA.

        reviewed_change_ref is an audit claim, NOT an approval authenticator.
        The authorized operator must preserve this receipt. Status/read and the
        constructor never upgrade an existing DB. No R2 row is reset or updated.
        """
        _text(reviewed_change_ref, "reviewed_change_ref")
        additions = ("work_authority_json", "work_authority_sha", "work_events_json")
        with queue._connection() as conn:
            conn.execute("BEGIN IMMEDIATE")
            columns = {row[1] for row in conn.execute("PRAGMA table_info(native_operations)")}
            if not columns or any(column in columns for column in additions):
                raise RuntimeError("explicit schema preparation requires unchanged legacy native schema")
            if conn.execute("SELECT 1 FROM native_operations WHERE state NOT IN ('completed','failed','cancelled') LIMIT 1").fetchone():
                raise RuntimeError("schema preparation requires all native closures terminal")
            if conn.execute("SELECT 1 FROM tasks WHERE status!='done' LIMIT 1").fetchone():
                raise RuntimeError("schema preparation requires reconciled queue and no queued work")
            for column in additions:
                conn.execute(f"ALTER TABLE native_operations ADD COLUMN {column} TEXT")
            conn.commit()
        return {"schema_change": "finite_work_columns_only", "reviewed_change_claim_ref": reviewed_change_ref,
                "database": queue.database_path, "added_columns": list(additions),
                "historical_rows_not_reset": True, "external_authority_implemented": False}

    def _require_work_schema(self) -> None:
        with self.queue._connection() as conn:
            columns = {row[1] for row in conn.execute("PRAGMA table_info(native_operations)")}
        if not {"work_authority_json", "work_authority_sha", "work_events_json"}.issubset(columns):
            raise RuntimeError("finite-work schema absent; explicit approved migration required, never auto-upgrade")

    def reserve(self, claim: Claim, operation_id: str, nonce: str,
                authorization_ref: str, now: int, expected_dispatch_contract_sha: str,
                *, _verified_work: tuple[NativeWorkRequest, NativeWorkAuthorization] | None = None) -> str:
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
            if _verified_work is not None and not bootstrap_exists:
                raise RuntimeError("finite work requires native bootstrap, never a fixture guard")
            if bootstrap_exists:
                bootstrap = conn.execute("SELECT * FROM native_guard_bootstrap WHERE singleton=1").fetchone()
                if (bootstrap is None
                        or hashlib.sha256(bootstrap["receipt_json"].encode("utf-8")).hexdigest() != bootstrap["receipt_sha"]):
                    raise RuntimeError("reservation differs from authorized bootstrap plan")
                receipt = json.loads(bootstrap["receipt_json"])
                if (receipt.get("reviewed_plan_sha") != bootstrap["reviewed_plan_sha"]
                        or receipt.get("scope") != "single_native_pilot"):
                    raise RuntimeError("bootstrap receipt/authority binding changed")
                if _verified_work is None and (bootstrap["reviewed_plan_sha"] != expected_dispatch_contract_sha
                                               or receipt.get("authority_ref") != authorization_ref):
                    raise RuntimeError("new plan requires separate verified finite-work authority")
            row = self.queue._assert_claim(conn, claim, now)
            if row["effect_state"] != "not_started":
                raise RuntimeError("effect already reserved; reconcile instead of replay")
            authority_payload = authority_sha = None
            if _verified_work is not None:
                request, authority = _verified_work
                if (request.operation_id != operation_id or request.nonce != nonce
                        or request.plan_sha != expected_dispatch_contract_sha
                        or authority.request_sha != request.digest() or authority.verified is not True
                        or authority.expires_at <= now or authority.grant_nonce != nonce
                        or authority.scope != "native_work_closure"):
                    raise ValueError("finite-work grant does not bind this exact reservation")
                expected = {"task_id": request.task_id, "worker_id": request.worker_id,
                            "contract_id": request.contract_id, "repo": request.repo,
                            "ref": request.ref, "sha": request.head, "input_sha": request.input_sha}
                if any(row[key] != value for key, value in expected.items()):
                    raise ValueError("finite-work request differs from leased TaskSpec")
                predecessor = conn.execute("SELECT t.status,t.effect_state,n.state FROM tasks t "
                    "JOIN native_operations n ON n.task_id=t.task_id WHERE t.task_id=?",
                    (request.predecessor_task_id,)).fetchone()
                if (request.predecessor_task_id == request.task_id or predecessor is None
                        or predecessor["status"] != "done" or predecessor["effect_state"] != "applied"
                        or predecessor["state"] not in _TERMINAL):
                    raise RuntimeError("prior finite closure not reconciled; no next work")
                authority_payload = json.dumps({"request": asdict(request), "authorization": asdict(authority)},
                                               sort_keys=True, separators=(",", ":"))
                authority_sha = hashlib.sha256(authority_payload.encode()).hexdigest()
            values = {"operation_id": operation_id, "task_id": row["task_id"], "input_sha": row["input_sha"],
                      "nonce": nonce, "authorization_ref": authorization_ref, "owner_id": claim.owner_id,
                      "fencing_token": claim.fencing_token, "stop_epoch": guard["epoch"], "reserved_at": now,
                      "dispatch_contract_sha": expected_dispatch_contract_sha, "state": "reserved"}
            if _verified_work is not None:
                values.update(work_authority_json=authority_payload, work_authority_sha=authority_sha)
            conn.execute("INSERT INTO native_operations(" + ",".join(values) + ") VALUES(" +
                         ",".join("?" for _ in values) + ")", tuple(values.values()))
            conn.execute("""UPDATE tasks SET status='needs_reconcile',
                effect_state='needs_reconcile',effect_name='native_execution',
                effect_key=?,last_evidence=?,ambiguous_owner_id=?,
                ambiguous_fencing_token=?,updated_at=? WHERE task_id=?""",
                (operation_id, "native_reserved:" + operation_id, claim.owner_id,
                 claim.fencing_token, now, claim.task_id))
            conn.execute("DELETE FROM worker_leases WHERE worker_id=?", (claim.worker_id,))
            conn.commit()
        return operation_id

    def authorize_and_reserve_work(self, claim: Claim, request: NativeWorkRequest,
                                   authority: NativeWorkAuthority | None, now: int) -> str:
        """Default HOLD; only an external verifier can admit the next finite plan.

        The original single-pilot bootstrap is immutable. Additional work carries
        its separate authority receipt in native_operations, never a guard reset.
        Local nonce uniqueness prevents repeated invocations on this single host;
        it is not provider idempotency or distributed exclusion.
        """
        _time(now)
        if type(request) is not NativeWorkRequest or authority is None:
            raise RuntimeError("external finite-work authority verifier required")
        self._require_work_schema()
        for field in (request.task_id, request.worker_id, request.contract_id, request.repo,
                      request.ref, request.approval_claim_ref, request.predecessor_task_id):
            _text(field, "work contract field")
        decision = authority.verify(request, now)
        if type(decision) is not NativeWorkAuthorization or decision.verified is not True:
            raise RuntimeError("finite-work authority unverified; caller reference is insufficient")
        for field in (decision.actor, decision.authority_source, decision.evidence_ref):
            _text(field, "external authority evidence")
        _time(decision.expires_at)
        return self.reserve(claim, request.operation_id, request.nonce, decision.evidence_ref,
                            now, request.plan_sha, _verified_work=(request, decision))

    def revalidate_reserved_work(self, request: NativeWorkRequest,
                                 authority: NativeWorkAuthority | None, now: int) -> dict:
        """Revalidate one still-reserved finite operation without re-reserving.

        This may refresh only the local authorization receipt. It cannot create
        another task/operation, recover a consumed dispatch, or alter request
        pins, event budgets, STOP epoch, or operation state. Callers must pass
        the trusted authority used for this exact work contract.
        """
        _time(now)
        if type(request) is not NativeWorkRequest or authority is None:
            raise RuntimeError("typed request and trusted work authority required")
        self._require_work_schema()
        serialized_request = json.loads(json.dumps(asdict(request), sort_keys=True,
                                                   separators=(",", ":")))
        with self.queue._connection() as conn:
            conn.execute("BEGIN IMMEDIATE")
            row = conn.execute("SELECT * FROM native_operations WHERE operation_id=?",
                               (request.operation_id,)).fetchone()
            guard = conn.execute(
                "SELECT stopped,epoch FROM controller_guard_state WHERE singleton=1"
            ).fetchone()
            if row is None or row["state"] != "reserved":
                raise RuntimeError("only the exact unconsumed reserved operation can be revalidated")
            if (row["task_id"] != request.task_id
                    or row["input_sha"] != request.input_sha
                    or row["nonce"] != request.nonce
                    or row["authorization_ref"] != request.approval_claim_ref
                    or row["dispatch_contract_sha"] != request.plan_sha):
                raise RuntimeError("reserved operation pins differ from Root request")
            if (row["surface"] is not None or row["remote_id"] is not None
                    or row["observation_json"] is not None
                    or row["observation_digest"] is not None or row["observed_at"] is not None):
                raise RuntimeError("operation already has dispatch or remote-observation evidence")
            if guard is None or guard["stopped"] or guard["epoch"] != row["stop_epoch"]:
                raise RuntimeError("STOP state/epoch changed since reservation")
            task = conn.execute("SELECT * FROM tasks WHERE task_id=?", (row["task_id"],)).fetchone()
            if (task is None or task["status"] != "needs_reconcile"
                    or task["effect_state"] != "needs_reconcile"
                    or task["effect_key"] != request.operation_id
                    or task["effect_name"] != "native_execution"
                    or task["last_evidence"] != "native_reserved:" + request.operation_id
                    or task["ambiguous_owner_id"] != row["owner_id"]
                    or task["ambiguous_fencing_token"] != row["fencing_token"]
                    or task["worker_id"] != request.worker_id
                    or task["repo"] != request.repo or task["ref"] != request.ref
                    or task["sha"] != request.head
                    or task["contract_id"] != request.contract_id
                    or task["input_sha"] != request.input_sha):
                raise RuntimeError("reserved task identity/effect state changed")
            events = json.loads(row["work_events_json"] or "{}")
            if type(events) is not dict or events:
                raise RuntimeError("status/result/QA event already consumed")
            payload = row["work_authority_json"]
            if (not payload or hashlib.sha256(payload.encode()).hexdigest() != row["work_authority_sha"]):
                raise RuntimeError("persisted authority receipt integrity failed")
            proof = json.loads(payload)
            if (set(proof) not in ({"request", "authorization"},
                                   {"request", "authorization", "revalidation_history"})
                    or proof.get("request") != serialized_request):
                raise RuntimeError("persisted request differs from exact Root-reviewed request")
            history = proof.get("revalidation_history", [])
            if type(history) is not list or history:
                raise RuntimeError("one revalidation already used; explicit recovery required")
            old_authorization = proof.get("authorization")
            if (type(old_authorization) is not dict
                    or type(old_authorization.get("expires_at")) is not int):
                raise RuntimeError("persisted authorization receipt malformed")
            if old_authorization["expires_at"] > now:
                raise RuntimeError("reserved authorization is still valid; revalidation not consumed")
            decision = authority.verify(request, now)
            if type(decision) is not NativeWorkAuthorization or decision.verified is not True:
                raise RuntimeError("Root authority did not revalidate this request")
            if (decision.request_sha != request.digest()
                    or decision.grant_nonce != request.nonce
                    or decision.evidence_ref != row["authorization_ref"]
                    or decision.scope != "native_work_closure"
                    or decision.expires_at != now + 900
                    or decision.expires_at <= old_authorization["expires_at"]):
                raise RuntimeError("revalidated authority differs from bounded reserved grant")
            expected_old = asdict(decision)
            expected_old["expires_at"] = old_authorization.get("expires_at")
            if old_authorization != expected_old:
                raise RuntimeError("stored grant/actor/source/request changed; renewal denied")

            updated = dict(proof)
            updated["authorization"] = asdict(decision)
            updated["revalidation_history"] = [{
                "prior_authorization": old_authorization,
                "revalidated_at": now,
                "revalidation_time_source": "root_controller_supplied_unix_epoch",
                "new_expires_at": decision.expires_at,
            }]
            updated_payload = json.dumps(updated, sort_keys=True, separators=(",", ":"))
            updated_sha = hashlib.sha256(updated_payload.encode()).hexdigest()
            cursor = conn.execute("""UPDATE native_operations
                SET work_authority_json=?,work_authority_sha=?
                WHERE operation_id=? AND state='reserved' AND work_authority_sha=?""",
                (updated_payload, updated_sha, request.operation_id, row["work_authority_sha"]))
            if cursor.rowcount != 1:
                raise RuntimeError("reserved authority changed during revalidation")
            conn.commit()
        return {"operation_id": request.operation_id, "state": "reserved",
                "request_sha": request.digest(), "authorization_expires_at": decision.expires_at,
                "work_authority_sha": updated_sha,
                "revalidated_at": now,
                "revalidation_time_source": "root_controller_supplied_unix_epoch",
                "revalidation_count": 1, "dispatch_count": 0}

    def admit_work_event_once(self, request: NativeWorkRequest, event: str,
                              event_id: str, now: int) -> bool:
        """Consume one event before read/QA; crash means no automatic re-execution.

        Records stay on the same native operation, with a cap of eight events
        and request-bound status/result budgets consumed before transport calls.
        This is single-host exclusion, not a scheduler or provider idempotency.
        """
        _text(event_id, "event_id")
        self._require_work_schema()
        _time(now)
        if event not in {"status", "result", "qa"}:
            raise ValueError("invalid native work event")
        with self.queue._connection() as conn:
            conn.execute("BEGIN IMMEDIATE")
            row = conn.execute("SELECT * FROM native_operations WHERE operation_id=?", (request.operation_id,)).fetchone()
            if (row is None or row["work_authority_json"] is None
                    or hashlib.sha256(row["work_authority_json"].encode()).hexdigest() != row["work_authority_sha"]
                    or json.loads(row["work_authority_json"])["authorization"]["request_sha"] != request.digest()):
                raise RuntimeError("event requires exact admitted finite work; historical operations remain immutable")
            events = json.loads(row["work_events_json"] or "{}")
            if event_id in events:
                conn.commit()
                return False
            limit = {"status": request.max_status_events,
                     "result": request.max_result_events}.get(event)
            if limit is not None and sum(item["event"] == event for item in events.values()) >= limit:
                raise RuntimeError(f"finite {event} event budget reached; explicit recovery required")
            if len(events) >= 8:
                raise RuntimeError("finite event cap reached; explicit recovery required")
            events[event_id] = {"event": event, "request_sha": request.digest(), "started_at": now,
                                "state": "consumed_outcome_requires_event_receipt"}
            conn.execute("UPDATE native_operations SET work_events_json=? WHERE operation_id=?",
                         (json.dumps(events, sort_keys=True, separators=(",", ":")), request.operation_id))
            conn.commit()
        return True

    def record_result_bundle_receipt(self, request: NativeWorkRequest, event_id: str,
                                     receipt: dict, now: int) -> dict:
        """Bind a persisted sink receipt to the already-consumed result event."""
        if type(request) is not NativeWorkRequest:
            raise TypeError("exact finite-work request required")
        _text(event_id, "event_id")
        _time(now)
        if (type(receipt) is not dict or set(receipt) != {"ref", "sha256", "bytes_written"}
                or type(receipt.get("ref")) is not str or not receipt["ref"]
                or len(receipt["ref"]) > 128 or ".." in receipt["ref"]
                or not re.fullmatch(r"[A-Za-z0-9][A-Za-z0-9._:-]{0,127}", receipt["ref"])
                or type(receipt.get("sha256")) is not str or not _HASH.fullmatch(receipt["sha256"])
                or type(receipt.get("bytes_written")) is not int
                or not 0 <= receipt["bytes_written"] <= 1024 * 1024):
            raise ValueError("invalid result sink receipt")
        exact_receipt = {"ref": receipt["ref"], "sha256": receipt["sha256"],
                         "bytes_written": receipt["bytes_written"]}
        exact_request = json.loads(json.dumps(asdict(request), sort_keys=True,
                                             separators=(",", ":")))
        with self.queue._connection() as conn:
            conn.execute("BEGIN IMMEDIATE")
            row = conn.execute("SELECT * FROM native_operations WHERE operation_id=?",
                               (request.operation_id,)).fetchone()
            proof = _exact_work_authority(row, request) if row is not None else None
            if (row is None or row["task_id"] != request.task_id
                    or row["input_sha"] != request.input_sha
                    or row["nonce"] != request.nonce
                    or row["dispatch_contract_sha"] != request.plan_sha
                    or proof is None):
                raise RuntimeError("result receipt lacks exact durable operation authority")
            if proof["request"] != exact_request:
                raise RuntimeError("result receipt request differs from durable operation")
            events = json.loads(row["work_events_json"] or "{}")
            entry = events.get(event_id) if type(events) is dict else None
            if (type(events) is not dict
                    or sum(type(item) is dict and item.get("event") == "result"
                           for item in events.values()) != 1
                    or type(entry) is not dict or entry.get("event") != "result"
                    or entry.get("request_sha") != request.digest()
                    or entry.get("state") not in {
                        "consumed_outcome_requires_event_receipt", "result_bundle_persisted",
                    }):
                raise RuntimeError("result receipt requires the consumed matching result event")
            existing = entry.get("result_bundle_receipt")
            if existing is not None and existing != exact_receipt:
                raise RuntimeError("result bundle receipt conflict; no overwrite")
            if existing is None:
                entry["result_bundle_receipt"] = exact_receipt
                entry["state"] = "result_bundle_persisted"
                conn.execute("UPDATE native_operations SET work_events_json=? WHERE operation_id=?",
                             (json.dumps(events, sort_keys=True, separators=(",", ":")),
                              request.operation_id))
            conn.commit()
        return exact_receipt

    def read_result_bundle_receipt(self, request: NativeWorkRequest) -> dict | None:
        """Return the unique durable result receipt for this exact request, if any."""
        if type(request) is not NativeWorkRequest:
            raise TypeError("exact finite-work request required")
        with self.queue._connection() as conn:
            row = conn.execute("SELECT * FROM native_operations WHERE operation_id=?",
                               (request.operation_id,)).fetchone()
        if (row is None or row["task_id"] != request.task_id
                or row["input_sha"] != request.input_sha
                or row["nonce"] != request.nonce
                or row["dispatch_contract_sha"] != request.plan_sha
                or _exact_work_authority(row, request) is None):
            return None
        try:
            events = json.loads(row["work_events_json"] or "{}")
            if type(events) is not dict:
                return None
            receipts = []
            result_event_count = 0
            for event_id, entry in events.items():
                if type(event_id) is str and type(entry) is dict and entry.get("event") == "result":
                    result_event_count += 1
                    if (entry.get("request_sha") != request.digest()
                            or entry.get("state") != "result_bundle_persisted"
                            or type(entry.get("result_bundle_receipt")) is not dict):
                        return None
                    receipts.append(entry["result_bundle_receipt"])
            if result_event_count != 1 or len(receipts) != 1:
                return None
            receipt = receipts[0]
            if (set(receipt) != {"ref", "sha256", "bytes_written"}
                    or type(receipt.get("ref")) is not str
                    or not re.fullmatch(r"[A-Za-z0-9][A-Za-z0-9._:-]{0,127}", receipt["ref"])
                    or ".." in receipt["ref"]
                    or type(receipt.get("sha256")) is not str
                    or not _HASH.fullmatch(receipt["sha256"])
                    or type(receipt.get("bytes_written")) is not int
                    or not 0 <= receipt["bytes_written"] <= 1024 * 1024):
                return None
            return dict(receipt)
        except (UnicodeError, ValueError, TypeError, RecursionError):
            return None

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
            # Recheck new work's persisted grant at actual dispatch time. Legacy
            # single-pilot rows without work authority preserve their semantics.
            if "work_authority_json" in row.keys() and row["work_authority_json"] is not None:
                payload = row["work_authority_json"]
                if hashlib.sha256(payload.encode()).hexdigest() != row["work_authority_sha"]:
                    raise RuntimeError("persisted work authority integrity failed")
                proof = json.loads(payload)
                authority = proof.get("authorization", {})
                request = proof.get("request", {})
                request_sha = hashlib.sha256(json.dumps(request, sort_keys=True, separators=(",", ":")).encode()).hexdigest()
                if (authority.get("verified") is not True or authority.get("scope") != "native_work_closure"
                        or authority.get("request_sha") != request_sha or authority.get("grant_nonce") != row["nonce"]
                        or type(authority.get("expires_at")) is not int or authority["expires_at"] <= int(time.time())
                        or request.get("operation_id") != operation_id
                        or request.get("plan_sha") != dispatch_contract_sha
                        or request.get("task_id") != row["task_id"] or request.get("input_sha") != row["input_sha"]):
                    raise RuntimeError("finite-work authority expired or no longer binds dispatch")
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
