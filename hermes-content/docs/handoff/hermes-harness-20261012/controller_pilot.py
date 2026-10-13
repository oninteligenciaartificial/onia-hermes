"""Single-host synthetic controller. No model, network, Telegram or service entry point."""
from __future__ import annotations

from dataclasses import dataclass, replace
import hashlib
import json
from typing import Protocol

from sqlite_pilot import Claim, ExternalDispatchGate, HandoffSpec, SQLiteQueue, TaskSpec


MARKER = "CANARIO_HERMES_CONTROLLER_OK"
PORTFOLIOS = frozenset(("onia", "marca", "comunidad", "lucia"))


def digest(value: object) -> str:
    return hashlib.sha256(json.dumps(value, sort_keys=True, separators=(",", ":")).encode()).hexdigest()


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


@dataclass(frozen=True)
class FixtureApproval:
    actor: str
    scope: str
    payload_sha: str
    expires_at: int


class ReadOnlyClient(Protocol):
    def run(self, goal: Goal) -> str: ...


class FakeReadOnlyClient:
    def __init__(self, fail: bool = False):
        self.calls = 0
        self.fail = fail

    def run(self, goal: Goal) -> str:
        self.calls += 1
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
    return digest((goal.task_id, goal.portfolio, goal.account_scope, goal.input_sha(), result_sha))


def _validate(goal: Goal) -> None:
    if goal.portfolio not in PORTFOLIOS or goal.account_scope != "fixture-only":
        raise ValueError("portfolio or account scope outside synthetic pilot")
    if not goal.objective.startswith("SYNTHETIC:") or len(goal.objective) > 256:
        raise ValueError("only short public synthetic objectives are accepted")
    if type(goal.budget_units) is not int or goal.budget_units != 1:
        raise ValueError("exactly one synthetic budget unit required")


class ControllerPilot:
    """One finite step per call; the SQLite claim remains the source of ownership."""

    def __init__(self, queue: SQLiteQueue, sessions: FakeSessionFactory):
        if type(sessions) is not FakeSessionFactory:
            raise TypeError("only fake session renewal is permitted")
        self.queue, self.sessions = queue, sessions

    def enqueue(self, goal: Goal, now: int) -> None:
        _validate(goal)
        self.queue.enqueue(TaskSpec(goal.task_id, goal.worker_id, goal.repo, goal.ref,
                                    goal.sha, goal.contract_id, goal.input_sha()), now)

    def claim(self, goal: Goal, owner: str, now: int, lease_seconds: int = 60):
        _validate(goal)
        return self.queue.claim(goal.worker_id, owner, now, lease_seconds)

    def _checkpoint(self, goal: Goal, stage: str, evidence: dict) -> dict:
        return {"schema": 1, "repo": goal.repo, "ref": goal.ref, "sha": goal.sha,
                "contract_id": goal.contract_id, "input_sha": goal.input_sha(),
                "step": stage, "status": "running", "evidence": evidence}

    def step(self, goal: Goal, claim: Claim, now: int, context: FixtureContext | None,
             client: ReadOnlyClient, approval: FixtureApproval | None = None):
        _validate(goal)
        if type(client) is not FakeReadOnlyClient:
            raise TypeError("real model/provider clients remain blocked")
        if claim.task_id != goal.task_id or claim.worker_id != goal.worker_id:
            raise ValueError("claim does not match goal")
        cp = claim.checkpoint
        if cp is None:
            cp = self._checkpoint(goal, "running", {"portfolio": goal.portfolio,
                            "account_scope": goal.account_scope, "budget_units": 1})
            self.queue.save_checkpoint(claim, cp, now)
            return replace(claim, checkpoint=cp), "running"
        if cp["input_sha"] != goal.input_sha() or cp["evidence"].get("portfolio") != goal.portfolio:
            raise ValueError("goal differs from durable checkpoint")
        if cp["step"] == "running":
            if (context is None or context.model != "fixture-model"
                    or type(context.observed_at) is not int
                    or context.observed_at > now or now - context.observed_at > 300
                    or type(context.used) is not int or type(context.window) is not int
                    or context.used < 0 or context.window <= 0
                    or context.used > context.window):
                return claim, "held_context_unknown"
            # Validate ownership before even allocating a successor fake ID.
            blocker = self.queue.external_dispatch_blocker(
                claim, ExternalDispatchGate(False, None, None, False, False), now)
            if blocker != "credentials_unavailable":
                raise RuntimeError("external dispatch unexpectedly became available")
            reserve = max(16, goal.budget_units)  # includes the next synthetic step
            threshold = min(500_000, (7 * context.window + 9) // 10)
            if context.used + reserve >= threshold:
                owner = self.sessions.new_owner()
                packet = self.queue.prepare_handoff(claim, HandoffSpec(
                    successor_owner_id=owner, objective=goal.objective,
                    gates=("fixture-only",), evidence_refs=(goal.input_sha(),),
                    next_action="continue synthetic read-only step", cursor="running",
                    model_configured="fixture-model", model_observed="UNKNOWN"), now)
                self.queue.acknowledge_handoff(packet.handoff_id, owner, packet.digest,
                                               goal.sha, "fixture-ack", now)
                successor = self.queue.activate_handoff(packet.handoff_id, owner, now, 60)
                self.queue.archive_previous(packet.handoff_id, successor, now)
                return successor, "rotated"
            try:
                result = client.run(goal)
                if result != MARKER:
                    raise ValueError("unexpected synthetic result")
            except Exception:
                self.queue.mark_effect_in_flight(claim, "synthetic_result_unknown", now)
                self.queue.mark_needs_reconcile(claim, now, "fake call outcome unresolved")
                return claim, "needs_reconcile"
            cp = self._checkpoint(goal, "qa", {**cp["evidence"], "result": result,
                                                  "result_sha": digest(result)})
            self.queue.save_checkpoint(claim, cp, now)
            return replace(claim, checkpoint=cp), "qa"
        if cp["step"] == "qa":
            evidence = cp["evidence"]
            if evidence.get("result") != MARKER or evidence.get("result_sha") != digest(MARKER):
                raise ValueError("synthetic QA failed")
            cp = self._checkpoint(goal, "approval", {**evidence, "qa": "pass"})
            self.queue.save_checkpoint(claim, cp, now)
            return replace(claim, checkpoint=cp), "approval"
        if cp["step"] == "approval":
            expected = approval_payload(goal, cp["evidence"]["result_sha"])
            if (approval is None or approval.actor != "fixture-sergio"
                    or approval.scope != f"fixture_complete:{goal.portfolio}"
                    or approval.payload_sha != expected
                    or type(approval.expires_at) is not int or approval.expires_at <= now):
                return claim, "held_approval"
            receipt = self.queue.complete_with_result(
                claim, now, "synthetic_done", f"sha256:{expected}")
            return claim, f"done:{receipt}"
        raise ValueError("unknown checkpoint stage")


def demo() -> dict:
    """End-to-end owned temporary fixture; stdout contains only synthetic metadata."""
    from pathlib import Path
    import tempfile

    with tempfile.TemporaryDirectory(prefix="onia-controller-fixture-") as area:
        queue = SQLiteQueue(Path(area) / "queue.sqlite3")
        controller = ControllerPilot(queue, FakeSessionFactory())
        goal = Goal("fixture-goal-1", "fixture-worker", "onia",
                    "SYNTHETIC: verify controller flow", "fixture-only", 1,
                    "fixture/repo", "codex/fixture", "a" * 40, "fixture-contract")
        controller.enqueue(goal, 100)
        claim = controller.claim(goal, "fixture-session-0", 101).claim
        client = FakeReadOnlyClient()
        stages = []
        for now, context in ((102, None), (103, FixtureContext(103, 95, 100)),
                             (104, FixtureContext(104, 10, 100)), (105, None),
                             (106, None)):
            claim, stage = controller.step(goal, claim, now, context, client)
            stages.append(stage)
        approval = FixtureApproval("fixture-sergio", "fixture_complete:onia",
                                   approval_payload(goal, digest(MARKER)), 110)
        claim, stage = controller.step(goal, claim, 107, None, client, approval)
        stages.append(stage.split(":")[0])
        return {"status": stages[-1], "stages": stages, "model_calls": client.calls,
                "session_renewals": controller.sessions.calls,
                "result_digest": queue.read_result(goal.task_id)["digest"],
                "next_claim": controller.claim(goal, "fixture-session-2", 108).status,
                "external_dispatch": "closed"}


if __name__ == "__main__":
    print(json.dumps(demo(), sort_keys=True))
