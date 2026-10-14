"""Single-attempt native Cloud task transport using the installed CLI.

Explicit callers alone invoke submit; importing/testing never calls a provider.
This creates task_e tasks, not Codex desktop UUID chats. A local timeout cannot
cancel a Cloud task. Missing response retains the consumed slot for reconciliation.
"""
from dataclasses import dataclass
import hashlib
import json
from pathlib import Path
import re
import subprocess
import time

from native_receipt_bridge import NativeObservation, NativeReceiptBridge


_ID = re.compile(r"(?<![A-Za-z0-9_])task_e_[0-9a-f]{32}(?![A-Za-z0-9_])")


@dataclass(frozen=True)
class CloudTaskPlan:
    executable: Path
    cwd: Path
    environment_id: str
    branch: str
    public_prompt_file: Path
    prompt_sha256: str
    executable_sha256: str
    expected_remote_head: str
    timeout_seconds: int = 45

    def request(self):
        if not self.executable.is_absolute() or not self.executable.is_file():
            raise ValueError("exact installed executable required")
        executable_path = self.executable.resolve()
        if executable_path.suffix.lower() in (".ps1", ".cmd", ".bat"):
            raise ValueError("native executable required; shell wrappers forbidden")
        if hashlib.sha256(executable_path.read_bytes()).hexdigest() != self.executable_sha256:
            raise ValueError("reviewed executable hash changed")
        if not self.cwd.is_absolute() or not (self.cwd / ".git").exists():
            raise ValueError("explicit repository checkout required")
        if not re.fullmatch(r"[0-9a-f]{32}", self.environment_id):
            raise ValueError("exact environment ID required")
        if not isinstance(self.expected_remote_head, str) or not re.fullmatch(r"[0-9a-f]{40}|[0-9a-f]{64}", self.expected_remote_head):
            raise ValueError("expected remote HEAD must be a full Git hash")
        if not re.fullmatch(r"codex/[A-Za-z0-9._/-]+", self.branch) or ".." in self.branch:
            raise ValueError("explicit codex branch required")
        if type(self.timeout_seconds) is not int or not 1 <= self.timeout_seconds <= 60:
            raise ValueError("bounded local transport timeout required")
        prompt_path = self.public_prompt_file.resolve()
        if not prompt_path.is_relative_to(self.cwd.resolve()) or prompt_path.stat().st_size > 16384:
            raise ValueError("small reviewed public prompt inside checkout required")
        raw = prompt_path.read_bytes()
        if hashlib.sha256(raw).hexdigest() != self.prompt_sha256:
            raise ValueError("reviewed prompt hash changed")
        prompt = raw.decode("utf-8")
        if not prompt.strip():
            raise ValueError("public prompt must not be empty")
        # Generate checkout expectations from the reviewed plan, not a commit
        # embedded in its own versioned prompt (which would create a hash cycle).
        checkout_contract = json.dumps({"expected_repo": "onia-hermes",
                                        "requested_ref": self.branch,
                                        "expected_head": self.expected_remote_head},
                                       sort_keys=True, separators=(",", ":"))
        prompt += ("\nONIA_CHECKOUT_CONTRACT\n" + checkout_contract + "\n"
                   "Verify repository identity and git HEAD before any task action; "
                   "stop and report mismatch. Include observed repo, branch and HEAD "
                   "in your receipt. The Cloud runtime may name its execution branch "
                   "work; report that name without treating it as proof of the requested ref.\n")
        argv = [str(executable_path), "cloud", "exec", "--env", self.environment_id,
                "--attempts", "1", "--branch", self.branch]
        contract = {"surface": "cloud_cli_task", "environment_id": self.environment_id,
                    "branch": self.branch, "prompt_sha256": self.prompt_sha256,
                    "prompt_file": str(prompt_path), "cwd": str(self.cwd.resolve()),
                    "executable": str(executable_path), "executable_sha256": self.executable_sha256,
                    "expected_remote_head": self.expected_remote_head,
                    "expected_repo": "onia-hermes", "wire_metadata_version": 1,
                    "request_wire_prompt_sha256": hashlib.sha256(prompt.encode("utf-8")).hexdigest(),
                    "attempts": 1, "timeout_seconds": self.timeout_seconds}
        digest = hashlib.sha256(json.dumps(contract, sort_keys=True).encode()).hexdigest()
        return argv, prompt, digest


class NativeCloudCLI:
    def __init__(self, bridge: NativeReceiptBridge):
        self.bridge = bridge

    def submit(self, operation_id: str, plan: CloudTaskPlan) -> dict:
        """Authorized caller only. Consume slot, invoke argv without shell once.

        No exception/timeout path invokes exec again. CLI supplies no native
        idempotency key, model selector or hard remote deadline in this contract.
        """
        argv, prompt, contract_sha = plan.request()
        row = self.bridge.begin_dispatch(operation_id, contract_sha)
        # The public request binds its returned task to the reserved local intent.
        prompt += (f"\nONIA operation_id={operation_id}; input_sha={row['input_sha']}. "
                   "Include these identifiers and observed HEAD in your receipt.\n")
        wire_prompt_sha256 = hashlib.sha256(prompt.encode("utf-8")).hexdigest()
        try:
            result = subprocess.run(argv, input=prompt, cwd=plan.cwd, shell=False,
                                    capture_output=True, text=True, encoding="utf-8",
                                    timeout=plan.timeout_seconds, check=False)
        except (subprocess.TimeoutExpired, OSError):
            return {"state": "needs_reconcile", "operation_id": operation_id,
                    "remote_id": "UNKNOWN", "reason": "transport_outcome_ambiguous",
                    "wire_prompt_sha256": wire_prompt_sha256,
                    "cost": "UNKNOWN", "retry": "forbidden"}
        stdout = result.stdout
        ids = set(_ID.findall(stdout)) if len(stdout) <= 262144 else set()
        if result.returncode != 0 or len(ids) != 1:
            return {"state": "needs_reconcile", "operation_id": operation_id,
                    "remote_id": "UNKNOWN", "reason": "nondefinitive_cli_response",
                    "wire_prompt_sha256": wire_prompt_sha256,
                    "cost": "UNKNOWN", "retry": "forbidden"}
        remote_id = ids.pop()
        now = int(time.time())
        evidence = "cloud_cli_stdout_sha256:" + hashlib.sha256(stdout.encode()).hexdigest()
        self.bridge.ingest(NativeObservation(operation_id, "cloud_cli_task", remote_id,
                           row["input_sha"], "submitted", now, evidence), now)
        return {"state": "submitted", "operation_id": operation_id,
                "remote_id": remote_id, "cost": "UNKNOWN", "retry": "forbidden",
                "wire_prompt_sha256": wire_prompt_sha256}

    def status(self, operation_id: str, executable: Path, timeout_seconds: int = 30) -> dict:
        """Read one bounded list page; absence/READY never closes the queue."""
        row = self.bridge.read(operation_id)
        if row is None or row["surface"] != "cloud_cli_task" or row["remote_id"] is None:
            raise RuntimeError("status requires bound native Cloud task; no blind resubmit")
        if not executable.is_absolute() or not executable.is_file():
            raise ValueError("exact installed executable required")
        if type(timeout_seconds) is not int or not 1 <= timeout_seconds <= 60:
            raise ValueError("bounded status timeout required")
        try:
            result = subprocess.run([str(executable), "cloud", "list", "--limit", "20", "--json"],
                                    shell=False, capture_output=True, text=True, encoding="utf-8",
                                    timeout=timeout_seconds, check=False)
            if result.returncode != 0 or len(result.stdout) > 262144:
                raise ValueError("nondefinitive status response")
            page = json.loads(result.stdout)
            tasks = page["tasks"]
            if not isinstance(tasks, list):
                raise ValueError("invalid task list")
            matches = [task for task in tasks if isinstance(task, dict) and task.get("id") == row["remote_id"]]
            if len(matches) != 1:
                raise ValueError("task absent or ambiguous in bounded list page")
            task = matches[0]
            # READY proves provider readiness only; independent artifact/QA later.
            raw_status = task.get("status")
            if not isinstance(raw_status, str):
                raise ValueError("native status must be a string")
            normalized_status = raw_status.lower()
            if normalized_status not in {"pending", "running", "ready", "failed", "cancelled", "unknown"}:
                raise ValueError("unsupported native lifecycle status")
            state = {"pending": "submitted", "running": "running", "ready": "unknown",
                     "failed": "failed", "cancelled": "cancelled", "unknown": "unknown"}[normalized_status]
            now = int(time.time())
            evidence = "cloud_cli_list_sha256:" + hashlib.sha256(result.stdout.encode()).hexdigest()
            self.bridge.ingest(NativeObservation(operation_id, "cloud_cli_task", row["remote_id"],
                               row["input_sha"], state, now, evidence), now)
            return {"remote_id": row["remote_id"], "provider_status": task.get("status", "UNKNOWN"),
                    "state": "needs_reconcile", "cost": "UNKNOWN", "retry": "forbidden"}
        except (subprocess.TimeoutExpired, OSError, ValueError, KeyError, TypeError):
            return {"state": "needs_reconcile", "remote_id": row["remote_id"],
                    "provider_status": "UNKNOWN", "retry": "forbidden"}
