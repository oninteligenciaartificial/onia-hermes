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
import queue as queue_module
import threading
import time

from native_receipt_bridge import NativeObservation, NativeReceiptBridge


_ID = re.compile(r"(?<![A-Za-z0-9_])task_e_[0-9a-f]{32}(?![A-Za-z0-9_])")


def _decode_stdout(raw: bytes) -> str:
    if not isinstance(raw, bytes) or len(raw) > 262144:
        raise ValueError("nondefinitive bounded binary stdout")
    return raw.decode("utf-8", errors="strict")


def _bounded_provider_read(argv: list[str], timeout_seconds: int) -> bytes:
    """One child, <=256KiB stdout, no stderr logs; kill own child on ambiguity.

    A daemon drain prevents an inherited pipe from defeating the local deadline.
    This does not assert descendant/provider cancellation or remote quiescence.
    """
    child = subprocess.Popen(argv, stdin=subprocess.DEVNULL, stdout=subprocess.PIPE,
                             stderr=subprocess.DEVNULL, shell=False)
    outcome = queue_module.Queue(maxsize=1)
    deadline = time.monotonic() + timeout_seconds
    def drain():
        chunks, total = [], 0
        try:
            while chunk := child.stdout.read(65536):
                total += len(chunk)
                if total > 262144:
                    outcome.put(None)
                    return
                chunks.append(chunk)
            outcome.put(b"".join(chunks))
        except (OSError, ValueError):
            outcome.put(None)
    reader = threading.Thread(target=drain, daemon=True)
    reader.start()
    try:
        raw = outcome.get(timeout=max(0.001, deadline - time.monotonic()))
        if raw is None:
            raise ValueError("provider output exceeds cap or pipe failed")
        remaining = deadline - time.monotonic()
        if remaining <= 0 or child.wait(timeout=remaining) != 0:
            raise ValueError("provider read failed or exceeded deadline")
        return raw
    except queue_module.Empty as exc:
        raise subprocess.TimeoutExpired(argv, timeout_seconds) from exc
    finally:
        if child.poll() is None:
            child.kill()
            try:
                child.wait(timeout=2)
            except subprocess.TimeoutExpired:
                pass
        if not reader.is_alive() and child.stdout is not None:
            child.stdout.close()


def _validate_artifact_paths(allowed_paths: tuple[str, ...]) -> None:
    if (not isinstance(allowed_paths, tuple) or not 1 <= len(allowed_paths) <= 8
            or len(set(allowed_paths)) != len(allowed_paths)):
        raise ValueError("explicit unique JSON path allowlist required")
    for path in allowed_paths:
        if (not isinstance(path, str) or not re.fullmatch(r"[A-Za-z0-9._/-]+\.json", path)
                or path.startswith("/") or any(part in ("", ".", "..") for part in path.split("/"))):
            raise ValueError("unsafe artifact path")


def _parse_new_json_diff(raw: bytes, allowed_paths: tuple[str, ...]) -> dict:
    """Only new regular JSON files; bytes reconstructed from diff, not download."""
    _decode_stdout(raw)
    _validate_artifact_paths(allowed_paths)
    lines = raw.splitlines(keepends=True)
    files = {}
    i = 0
    while i < len(lines):
        header = re.fullmatch(rb"diff --git a/([^\r\n ]+) b/([^\r\n ]+)\r?\n", lines[i])
        if header is None or header[1] != header[2]:
            raise ValueError("unreviewed diff header or rename")
        path = header[1].decode("ascii", errors="strict")
        if path not in allowed_paths or path in files:
            raise ValueError("unexpected or duplicate artifact")
        i += 1
        if i >= len(lines) or lines[i].rstrip(b"\r\n") != b"new file mode 100644":
            raise ValueError("only new regular files can be recovered")
        i += 1
        if i < len(lines) and lines[i].startswith(b"index "):
            if not re.fullmatch(rb"index 0{7,64}\.\.[0-9a-f]{7,64}\r?\n", lines[i]):
                raise ValueError("invalid new-file index")
            i += 1
        if i + 2 >= len(lines) or lines[i].rstrip(b"\r\n") != b"--- /dev/null" or lines[i+1].rstrip(b"\r\n") != b"+++ b/" + header[1]:
            raise ValueError("invalid new-file headers")
        hunk = re.fullmatch(rb"@@ -0,0 \+1(?:,([0-9]+))? @@\r?\n", lines[i+2])
        if hunk is None:
            raise ValueError("only one complete new-file hunk accepted")
        expected_count = int(hunk[1]) if hunk[1] else 1
        i += 3
        payload = []
        while i < len(lines) and not lines[i].startswith(b"diff --git "):
            line = lines[i]
            if line.startswith(b"+"):
                payload.append(line[1:])
            elif line.rstrip(b"\r\n") == b"\\ No newline at end of file" and payload:
                payload[-1] = payload[-1].rstrip(b"\r\n")
            else:
                raise ValueError("unexpected hunk content; no partial reconstruction")
            i += 1
        if len(payload) != expected_count:
            raise ValueError("artifact hunk count mismatch")
        content = b"".join(payload)
        value = json.loads(content.decode("utf-8", errors="strict"))
        if not isinstance(value, dict):
            raise ValueError("artifact must be a JSON object")
        files[path] = {"sha256": hashlib.sha256(content).hexdigest(), "bytes": len(content), "json": value}
    if set(files) != set(allowed_paths):
        raise ValueError("missing required artifacts")
    return files


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
        wire_bytes = prompt.encode("utf-8")
        wire_prompt_sha256 = hashlib.sha256(wire_bytes).hexdigest()
        started_at = int(time.time())
        started = time.monotonic()
        def metrics():
            return {"client_started_at_epoch": started_at, "client_finished_at_epoch": int(time.time()),
                    "client_duration_seconds": round(time.monotonic() - started, 6), "client_attempt_count": 1,
                    "remote_execution_duration_seconds": "UNKNOWN", "tokens": "UNKNOWN", "cost": "UNKNOWN",
                    "active_context_used": "UNKNOWN", "effective_window": "UNKNOWN", "handoff_capability": "UNKNOWN"}
        try:
            result = subprocess.run(argv, input=wire_bytes, cwd=plan.cwd, shell=False,
                                    capture_output=True, text=False,
                                    timeout=plan.timeout_seconds, check=False)
        except (subprocess.TimeoutExpired, OSError):
            return {"state": "needs_reconcile", "operation_id": operation_id,
                    "remote_id": "UNKNOWN", "reason": "transport_outcome_ambiguous",
                    "wire_prompt_sha256": wire_prompt_sha256,
                    **metrics(),
                    "cost": "UNKNOWN", "retry": "forbidden"}
        try:
            stdout = _decode_stdout(result.stdout)
            ids = set(_ID.findall(stdout))
        except ValueError:
            ids = set()
        if result.returncode != 0 or len(ids) != 1:
            return {"state": "needs_reconcile", "operation_id": operation_id,
                    "remote_id": "UNKNOWN", "reason": "nondefinitive_cli_response",
                    "wire_prompt_sha256": wire_prompt_sha256,
                    **metrics(),
                    "cost": "UNKNOWN", "retry": "forbidden"}
        remote_id = ids.pop()
        now = int(time.time())
        evidence = "cloud_cli_stdout_sha256:" + hashlib.sha256(result.stdout).hexdigest()
        self.bridge.ingest(NativeObservation(operation_id, "cloud_cli_task", remote_id,
                           row["input_sha"], "submitted", now, evidence), now)
        return {"state": "submitted", "operation_id": operation_id,
                "remote_id": remote_id, "cost": "UNKNOWN", "retry": "forbidden",
                "wire_prompt_sha256": wire_prompt_sha256,
                "wire_prompt_sha_semantics": "exact_utf8_stdin_bytes", **metrics()}

    def collect_result(self, operation_id: str, executable: Path,
                       allowed_paths: tuple[str, ...], timeout_seconds: int = 30) -> dict:
        """One bounded provider read for an already-bound task; never git apply.

        Recovery is not QA or terminal completion. A malformed/oversize response
        keeps reconciliation open and never resubmits or retries the worker.
        """
        _validate_artifact_paths(allowed_paths)
        row = self.bridge.read(operation_id)
        if row is None or row["surface"] != "cloud_cli_task" or row["remote_id"] is None:
            raise RuntimeError("result requires original bound Cloud task")
        if not executable.is_absolute() or not executable.is_file() or type(timeout_seconds) is not int or not 1 <= timeout_seconds <= 60:
            raise ValueError("exact executable and bounded read timeout required")
        started_at, started = int(time.time()), time.monotonic()
        raw = None
        try:
            raw = _bounded_provider_read([str(executable), "cloud", "diff", row["remote_id"]], timeout_seconds)
            files = _parse_new_json_diff(raw, allowed_paths)
            return {"state": "awaiting_independent_qa", "operation_id": operation_id,
                    "remote_id": row["remote_id"], "input_sha": row["input_sha"], "files": files,
                    "stdout_sha256": hashlib.sha256(raw).hexdigest(),
                    "artifact_bytes_provenance": "reconstructed_from_captured_binary_diff_not_direct_file_capture",
                    "read_duration_seconds": round(time.monotonic() - started, 6),
                    "read_started_at_epoch": started_at, "read_finished_at_epoch": int(time.time()),
                    "provider_read_attempt_count": 1, "cost": "UNKNOWN", "tokens": "UNKNOWN"}
        except (subprocess.TimeoutExpired, OSError, ValueError, TypeError, UnicodeError):
            return {"state": "needs_reconcile", "operation_id": operation_id, "remote_id": row["remote_id"],
                    "reason": "artifact_read_or_parser_nondefinitive", "retry": "forbidden",
                    "provider_read_attempt_count": 1,
                    "stdout_sha256": hashlib.sha256(raw).hexdigest() if raw is not None else "UNKNOWN",
                    "read_duration_seconds": round(time.monotonic() - started, 6), "cost": "UNKNOWN", "tokens": "UNKNOWN"}

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
                                    shell=False, capture_output=True, text=False,
                                    timeout=timeout_seconds, check=False)
            if result.returncode != 0:
                raise ValueError("nondefinitive status response")
            page = json.loads(_decode_stdout(result.stdout))
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
                     "failed": "unknown", "cancelled": "unknown", "unknown": "unknown"}[normalized_status]
            now = int(time.time())
            evidence = "cloud_cli_list_sha256:" + hashlib.sha256(result.stdout).hexdigest()
            self.bridge.ingest(NativeObservation(operation_id, "cloud_cli_task", row["remote_id"],
                               row["input_sha"], state, now, evidence), now)
            return {"remote_id": row["remote_id"], "provider_status": task.get("status", "UNKNOWN"),
                    "state": "needs_reconcile", "cost": "UNKNOWN", "retry": "forbidden"}
        except (subprocess.TimeoutExpired, OSError, ValueError, KeyError, TypeError):
            return {"state": "needs_reconcile", "remote_id": row["remote_id"],
                    "provider_status": "UNKNOWN", "retry": "forbidden"}
