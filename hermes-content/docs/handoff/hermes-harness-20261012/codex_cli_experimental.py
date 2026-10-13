"""Bounded, local Codex CLI experiment beside the fail-closed offline core.

Nothing in this module changes SQLiteQueue.dispatch_external or starts Codex on import.
Only a newly created synthetic CLI session is eligible. The caller must supply an
isolated empty working directory, an isolated SQLite directory, and explicit approval
before invoking run_process. No existing Codex session is resumed here.
"""

from dataclasses import dataclass
import hashlib
import json
import os
from pathlib import Path
import queue as queue_module
import re
import signal
import subprocess
import threading
import time
from typing import Any, Iterable, Mapping

from sqlite_pilot import Claim, SQLiteQueue


SYNTHETIC_PROMPT = "Responde exactamente CANARIO_HERMES_CDX_OK_20261013. No uses herramientas ni red."
EXPECTED_ANSWER = "CANARIO_HERMES_CDX_OK_20261013"
_UUID = re.compile(r"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$")
_USAGE_KEYS = ("input_tokens", "cached_input_tokens", "cache_write_input_tokens", "output_tokens", "reasoning_output_tokens")


class ExperimentBlocked(RuntimeError):
    """A local safety gate or event contract stopped the experiment."""


@dataclass(frozen=True)
class Plan:
    cwd: Path
    sqlite_home: Path
    log_dir: Path
    model_requested: str = "gpt-6.1-sol"
    reasoning_effort: str = "low"
    timeout_seconds: int = 45

    def argv(self, executable: str = "codex") -> tuple[str, ...]:
        """Build a fresh-session argv; never accepts arbitrary prompt or session ID."""
        if self.model_requested != "gpt-6.1-sol" or self.reasoning_effort != "low":
            raise ExperimentBlocked("model or effort differs from reviewed synthetic canary")
        if not 1 <= self.timeout_seconds <= 45:
            raise ExperimentBlocked("watchdog must be between 1 and 45 seconds")
        for path in (self.cwd, self.sqlite_home, self.log_dir):
            if not path.is_absolute() or not path.is_dir():
                raise ExperimentBlocked("all isolated directories must already exist and be absolute")
        if any(self.cwd.iterdir()):
            raise ExperimentBlocked("synthetic working directory must be empty")
        if self.sqlite_home == self.log_dir or self.cwd in (self.sqlite_home, self.log_dir):
            raise ExperimentBlocked("working directory, SQLite and text logs must be separate")
        if any(self.sqlite_home.iterdir()) or any(self.log_dir.iterdir()):
            raise ExperimentBlocked("isolated state directories must be empty before launch")
        return (
            executable, "exec", "--ignore-user-config", "--skip-git-repo-check",
            "--sandbox", "read-only", "--json", "-m", self.model_requested,
            "-c", f"model_reasoning_effort={self.reasoning_effort}",
            "-c", f"sqlite_home={json.dumps(str(self.sqlite_home))}",
            "-c", f"log_dir={json.dumps(str(self.log_dir))}",
            "-C", str(self.cwd), SYNTHETIC_PROMPT,
        )


def parse_events(lines: Iterable[str], expected_thread_id: str | None = None) -> Mapping[str, object]:
    """Accept only the tiny canary event grammar; reject tool attempts immediately."""
    if expected_thread_id is not None and not _UUID.fullmatch(expected_thread_id):
        raise ExperimentBlocked("invalid expected thread ID")
    thread_id = None
    completed = False
    turn_started = False
    answer = None
    usage = None
    event_types = []
    for line in lines:
        if len(event_types) >= 16:
            raise ExperimentBlocked("too many events for bounded canary")
        if len(line) > 262144:
            raise ExperimentBlocked("oversize event")
        try:
            event = json.loads(line)
        except (TypeError, ValueError) as exc:
            raise ExperimentBlocked("invalid JSONL event") from exc
        if not isinstance(event, dict) or not isinstance(event.get("type"), str):
            raise ExperimentBlocked("invalid event shape")
        event_type = event["type"]
        event_types.append(event_type)
        if completed:
            raise ExperimentBlocked("event after terminal completion")
        if event_type == "thread.started":
            candidate = event.get("thread_id")
            if thread_id is not None or not isinstance(candidate, str) or not _UUID.fullmatch(candidate):
                raise ExperimentBlocked("missing or duplicate new session ID")
            if expected_thread_id is not None and candidate != expected_thread_id:
                raise ExperimentBlocked("resumed session ID mismatch")
            thread_id = candidate
        elif event_type == "turn.started":
            if thread_id is None or turn_started:
                raise ExperimentBlocked("turn started before thread ID or more than once")
            turn_started = True
        elif event_type in ("item.started", "item.updated", "item.completed"):
            if not turn_started:
                raise ExperimentBlocked("item before turn start")
            item = event.get("item")
            if not isinstance(item, dict) or item.get("type") != "agent_message":
                raise ExperimentBlocked("tool or unreviewed item event")
            if event_type == "item.completed":
                if answer is not None or not isinstance(item.get("text"), str):
                    raise ExperimentBlocked("missing or multiple assistant answers")
                answer = item["text"]
        elif event_type == "turn.completed":
            if not turn_started or thread_id is None or answer is None or not isinstance(event.get("usage"), dict):
                raise ExperimentBlocked("incomplete terminal receipt")
            if answer != EXPECTED_ANSWER:
                raise ExperimentBlocked("synthetic answer does not match marker")
            raw_usage = event["usage"]
            if any(type(raw_usage.get(key)) is not int or raw_usage[key] <= 0
                   for key in ("input_tokens", "output_tokens")):
                raise ExperimentBlocked("missing positive input/output usage receipt")
            if any(k in raw_usage and (type(raw_usage[k]) is not int or raw_usage[k] < 0) for k in _USAGE_KEYS):
                raise ExperimentBlocked("invalid usage counters")
            usage = {key: raw_usage.get(key, "UNKNOWN") for key in _USAGE_KEYS}
            completed = True
        elif event_type in ("turn.failed", "error"):
            raise ExperimentBlocked("CLI reported failure")
        else:
            raise ExperimentBlocked("unreviewed event type")
    if not completed or thread_id is None or answer is None:
        raise ExperimentBlocked("terminal receipt absent")
    return {
        "thread_id": thread_id,
        "turn_id": "UNKNOWN",
        "requested_model": "gpt-6.1-sol",
        "configured_model": "gpt-6.1-sol",
        "observed_served_model": "UNKNOWN",
        "usage_reported": usage,
        "usage_semantics": "possible_cumulative_thread_total_on_resume_not_active_context",
        "active_context_used": "UNKNOWN",
        "answer_sha256": hashlib.sha256(answer.encode("utf-8")).hexdigest(),
        "answer_exact_match": answer == EXPECTED_ANSWER,
        "event_types": event_types,
        "tool_events_observed": 0,
    }


def run_process(plan: Plan, approval_ref: str, executable: str) -> Mapping[str, object]:
    """Optional real canary; watchdog kills this child on timeout or event violation.

    Tests call it only with local fake Python children; import never starts Codex. Approval is a reviewed
    reference, not an environment variable or secret. CLI flags cannot enforce zero
    tools/network or a hard token limit, so those are not claimed by this runner.
    """
    if not approval_ref or not approval_ref.startswith("sergio:"):
        raise ExperimentBlocked("specific real-inference approval reference required")
    if not Path(executable).is_absolute() or not Path(executable).is_file():
        raise ExperimentBlocked("exact installed CLI binary path required")
    argv = plan.argv(executable)
    job = None
    if os.name == "nt":
        from windows_job import launch
        process, job = launch(argv, plan.cwd)
    else:
        process = subprocess.Popen(argv, cwd=plan.cwd, stdin=subprocess.DEVNULL,
                                   stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                                   text=True, encoding="utf-8", errors="replace",
                                   start_new_session=True)
    events: queue_module.Queue[str | None] = queue_module.Queue(maxsize=32)

    def read_stderr() -> None:
        assert process.stderr is not None
        try:
            while process.stderr.buffer.read1(4096):
                pass
        finally:
            process.stderr.close()

    stderr_thread = threading.Thread(target=read_stderr, daemon=True)
    stderr_thread.start()

    def read_stdout() -> None:
        assert process.stdout is not None
        try:
            while line := process.stdout.readline(262145):
                events.put(line)
        finally:
            process.stdout.close()
            events.put(None)

    stdout_thread = threading.Thread(target=read_stdout, daemon=True)
    stdout_thread.start()
    deadline = time.monotonic() + plan.timeout_seconds

    def bounded_lines() -> Iterable[str]:
        while True:
            remaining = deadline - time.monotonic()
            if remaining <= 0:
                raise ExperimentBlocked("watchdog timeout")
            try:
                line = events.get(timeout=min(remaining, 0.25))
            except queue_module.Empty:
                if process.poll() is not None:
                    # A descendant may have inherited stdout after the CLI exited.
                    # Do not wait indefinitely for that pipe to close.
                    raise ExperimentBlocked("CLI exited while stdout pipe remained open")
                continue
            if line is None:
                return
            yield line

    try:
        receipt = parse_events(bounded_lines())
        remaining = deadline - time.monotonic()
        if remaining <= 0 or process.wait(timeout=max(0.01, remaining)) != 0:
            raise ExperimentBlocked("CLI exit failed or watchdog fired")
        return receipt
    except Exception:
        if job is not None:
            job.close()
        _kill_process_tree(process)
        raise
    finally:
        if job is not None:
            job.close()
        stdout_thread.join(timeout=1)
        stderr_thread.join(timeout=2)
        # stderr is intentionally neither returned nor persisted; it can contain private data.


def _kill_process_tree(process: subprocess.Popen[str]) -> None:
    if process.poll() is not None:
        # PID may have been recycled. A surviving descendant is UNKNOWN here;
        # never direct taskkill at an exited root PID.
        return
    if os.name == "nt":
        # The Windows Job Object has already killed the tree; Popen holds this
        # exact root process handle, so this fallback never targets a reused PID.
        process.kill()
    else:
        try:
            os.killpg(process.pid, signal.SIGKILL)
        except ProcessLookupError:
            pass
    try:
        process.wait(timeout=2)
    except subprocess.TimeoutExpired:
        process.kill()


def record_experimental_attempt(queue: SQLiteQueue, claim: Claim, lines: Iterable[str], now: int) -> Mapping[str, object]:
    """Exercise core fencing with a fixture stream; always leave effect for review.

    Never calls dispatch_external or replays an ambiguous attempt. Even a matching
    synthetic answer leaves the core task in needs_reconcile, not operational_ready.
    """
    effect_key = queue.mark_effect_in_flight(claim, "codex_cli_synthetic", now)
    try:
        receipt = parse_events(lines)
        evidence = "cli_synthetic_receipt:" + hashlib.sha256(
            json.dumps(receipt, sort_keys=True).encode("utf-8")
        ).hexdigest()
    except ExperimentBlocked as exc:
        receipt = {"status": "blocked", "reason": str(exc), "thread_id": "UNKNOWN"}
        evidence = "cli_synthetic_blocked:" + type(exc).__name__
    queue.mark_needs_reconcile(claim, now + 1, evidence)
    return {"effect_key": effect_key, "core_status": "needs_reconcile", "receipt": receipt}


def run_claimed_process(
    queue: SQLiteQueue, claim: Claim, checkpoint: Mapping[str, Any], plan: Plan,
    approval_ref: str, now_epoch: int, executable: str,
) -> Mapping[str, object]:
    """Opt-in bridge for one newly created CLI session; no automatic retry.

    The checkpoint is durable before subprocess launch. A successful CLI receipt
    still leaves the core effect ambiguous for independent reconciliation. This
    function is not a replacement for the fail-closed dispatch_external gate.
    """
    if not approval_ref or not approval_ref.startswith("sergio:"):
        raise ExperimentBlocked("specific real-inference approval reference required")
    if abs(int(time.time()) - now_epoch) > 5:
        raise ExperimentBlocked("claim time must match current clock")
    if checkpoint.get("repo") != "public/synthetic" or checkpoint.get("evidence") != {"scope": "public synthetic"}:
        raise ExperimentBlocked("only the reviewed public synthetic checkpoint is eligible")
    if claim.expires_at - now_epoch <= plan.timeout_seconds + 5:
        raise ExperimentBlocked("claim lease cannot cover watchdog and reconciliation")
    if not Path(executable).is_absolute() or not Path(executable).is_file():
        raise ExperimentBlocked("exact installed CLI binary path required")
    plan.argv(executable)  # validate all local paths before reserving the effect
    checkpoint_digest = queue.save_checkpoint(claim, checkpoint, now_epoch)
    effect_key = queue.mark_effect_in_flight(claim, "codex_cli_synthetic", now_epoch + 1)
    try:
        receipt = run_process(plan, approval_ref, executable)
        evidence = "cli_synthetic_receipt:" + hashlib.sha256(
            json.dumps(receipt, sort_keys=True).encode("utf-8")
        ).hexdigest()
    except Exception as exc:
        receipt = {"status": "blocked", "reason_type": type(exc).__name__,
                   "thread_id": "UNKNOWN", "observed_served_model": "UNKNOWN"}
        evidence = "cli_synthetic_ambiguous:" + type(exc).__name__
    queue.mark_needs_reconcile(claim, int(time.time()), evidence)
    return {"effect_key": effect_key, "checkpoint_digest": checkpoint_digest,
            "core_status": "needs_reconcile", "receipt": receipt}
