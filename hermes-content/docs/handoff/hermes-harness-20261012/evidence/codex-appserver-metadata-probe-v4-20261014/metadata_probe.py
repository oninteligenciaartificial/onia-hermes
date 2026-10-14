#!/usr/bin/env python3
"""Prepared, opt-in SSH driver for a metadata-only Codex app-server probe.

This file has not been used to connect or start Codex. Keep it behind independent
QA and root review; it intentionally requires --execute.
"""
from __future__ import annotations

import argparse
import json
import os
import queue
import re
import shutil
import subprocess
import sys
import threading
import time
from datetime import datetime, timezone
from pathlib import Path


ARTIFACT_DIR = Path(__file__).resolve().parent
SSH_IDENTITY = Path(r"C:\Users\PC\.ssh\onia_hermes_vps_ed25519")
SSH_KNOWN_HOSTS = Path(r"C:\Users\PC\.ssh\known_hosts")
SSH_TARGET = "root@187.77.16.63"  # Canonical target in HERMES_AGENT.md.
REMOTE_CODEX = "/opt/onia-codex-cli/0.161.0/node_modules/.bin/codex"
REMOTE_HOME = "/root"
REMOTE_CODEX_HOME = "/opt/onia-codex-cli/0.161.0/auth-home"
MAX_LINE_BYTES = 256 * 1024
MAX_STDOUT_LINES = 64
MAX_STDOUT_BYTES = 2 * 1024 * 1024
SUPERVISOR_FRAME = b"__CODEX_PROBE_SUPERVISOR_DONE__:"
LOCAL_WATCHDOG_SECONDS = 49
ALLOWED_NOTIFICATIONS = {"account/updated", "configWarning"}
AUTH_KIND = {"chatgpt": "chatgpt", "apiKey": "api_key"}


class ProbeError(Exception):
    """Sanitized internal reason; never carries server payload text."""

    def __init__(self, reason: str, diagnostic: dict | None = None):
        super().__init__(reason)
        self.diagnostic = diagnostic


_SHAPE_KEYS = {"id", "method", "params", "result", "error", "jsonrpc", "trace", "emittedAtMs"}


def _json_type(value) -> str:
    if value is None: return "null"
    if type(value) is bool: return "boolean"
    if type(value) is int: return "integer"
    if type(value) is float: return "number"
    if type(value) is str: return "string"
    if type(value) is list: return "array"
    if type(value) is dict: return "object"
    return "other"


def safe_envelope_shape(message, expected_id: int, protocol_reason: str) -> dict:
    """Return bounded structural metadata only; never preserve payload values."""
    is_object = type(message) is dict
    obj = message if is_object else {}
    method = obj.get("method")
    method_class = ("not_present" if "method" not in obj else
                    "allowlisted" if type(method) is str and method in
                    {"initialize", "initialized", "account/read", *ALLOWED_NOTIFICATIONS} else
                    "unknown")
    ident = obj.get("id")
    version = obj.get("jsonrpc")
    version_ok = ("jsonrpc" not in obj or version == "2.0")
    user_agent = obj.get("result", {}).get("userAgent") if type(obj.get("result")) is dict else None
    sdk_version = None
    if expected_id == 1 and type(ident) is int and ident == 1 and type(user_agent) is str:
        match = re.fullmatch(r"codex-cli ([0-9]+\.[0-9]+\.[0-9]+)", user_agent)
        if match:
            sdk_version = match.group(1)
    return {
        "object_type": "object" if is_object else _json_type(message),
        "key_present": {key: key in obj for key in sorted(_SHAPE_KEYS)},
        "unknown_key_count": sum(1 for key in obj if key not in _SHAPE_KEYS),
        "value_types": {key: _json_type(obj[key]) if key in obj else "absent"
                         for key in ("id", "method", "params", "jsonrpc", "trace", "emittedAtMs")},
        "known_method": method_class,
        "expected_id_match": (type(ident) is int and ident == expected_id) if "id" in obj else None,
        "jsonrpc_version_ok": version_ok,
        "sdk_version": sdk_version,
        "protocol_reason": protocol_reason,
    }


def project_account_read(message: dict) -> dict:
    """Reduce account/read output to privacy-safe fields only."""
    if (type(message) is not dict or "id" not in message or "result" not in message or
            set(message) not in ({"id", "result"}, {"jsonrpc", "id", "result"})):
        raise ProbeError("invalid_account_response_shape")
    if "jsonrpc" in message and message["jsonrpc"] != "2.0":
        raise ProbeError("protocol_version_invalid")
    result = message.get("result")
    if type(result) is not dict:
        raise ProbeError("account_result_missing")
    account = result.get("account")
    if account is None:
        present, kind = False, "unknown"
    elif type(account) is dict:
        present = True
        kind = AUTH_KIND.get(account.get("type"), "unknown")
    else:
        raise ProbeError("account_shape_invalid")
    return {"account_present": present, "auth_kind": kind}


def validate_jsonrpc_line(raw: bytes, expected_id: int) -> tuple[str, dict | None]:
    """Return response/notification classification without exposing payloads."""
    if not raw or len(raw) > MAX_LINE_BYTES or not raw.endswith(b"\n"):
        raise ProbeError("protocol_line_invalid_or_oversized")
    try:
        message = json.loads(raw)
    except (UnicodeDecodeError, json.JSONDecodeError, RecursionError):
        raise ProbeError("protocol_json_invalid", safe_envelope_shape(None, expected_id, "protocol_json_invalid")) from None
    def reject(reason: str):
        raise ProbeError(reason, safe_envelope_shape(message, expected_id, reason))
    if type(message) is not dict:
        reject("protocol_envelope_invalid")
    if "jsonrpc" in message and message["jsonrpc"] != "2.0":
        reject("protocol_version_invalid")
    if "method" in message:
        if "id" in message:
            if set(message) - {"jsonrpc", "id", "method", "params", "trace"}:
                reject("protocol_request_shape_invalid")
            reject("unexpected_server_request")
        if set(message) - {"jsonrpc", "method", "params", "emittedAtMs"}:
            reject("protocol_notification_shape_invalid")
        if "emittedAtMs" in message:
            emitted_at = message["emittedAtMs"]
            if emitted_at is not None and (type(emitted_at) is not int or
                    not -(2**63) <= emitted_at <= (2**63 - 1)):
                reject("protocol_notification_timestamp_invalid")
        method = message.get("method")
        if type(method) is not str:
            reject("protocol_notification_shape_invalid")
        if method not in ALLOWED_NOTIFICATIONS:
            reject("unexpected_server_notification")
        return "notification", None
    response_id = message.get("id")
    if type(response_id) is not int or response_id != expected_id:
        reject("response_id_mismatch")
    if "error" in message:
        if set(message) not in ({"id", "error"}, {"jsonrpc", "id", "error"}):
            reject("protocol_error_shape_invalid")
        error = message.get("error")
        if type(error) is not dict or set(error) - {"code", "message", "data"}:
            reject("protocol_error_shape_invalid")
        if ("code" not in error or type(error["code"]) is not int or
                "message" not in error or type(error["message"]) is not str):
            reject("protocol_error_shape_invalid")
        reject("rpc_error")
    if set(message) not in ({"id", "result"}, {"jsonrpc", "id", "result"}):
        reject("protocol_response_shape_invalid")
    if "result" not in message:
        reject("rpc_result_missing")
    return "response", message


def validate_supervisor_frame(raw: bytes) -> dict:
    """Validate the bounded, non-RPC terminal frame emitted after child cleanup."""
    if not raw.endswith(b"\n") or len(raw) > MAX_LINE_BYTES:
        raise ProbeError("supervisor_frame_invalid")
    if not raw.startswith(SUPERVISOR_FRAME):
        raise ProbeError("supervisor_frame_missing")
    try:
        value = json.loads(raw[len(SUPERVISOR_FRAME):])
    except (UnicodeDecodeError, json.JSONDecodeError, RecursionError):
        raise ProbeError("supervisor_frame_invalid") from None
    if type(value) is not dict or set(value) != {
        "child_exit_code", "child_stopped", "scratch_cleaned", "group_quiescent"
    }:
        raise ProbeError("supervisor_frame_invalid")
    if (type(value["child_exit_code"]) is not int or
            type(value["child_stopped"]) is not bool or
            type(value["scratch_cleaned"]) is not bool or
            type(value["group_quiescent"]) is not bool):
        raise ProbeError("supervisor_frame_invalid")
    return value


def validate_shutdown_line(raw: bytes) -> str:
    """Allow only safe notifications while draining after account/read."""
    classification, _ = validate_jsonrpc_line(raw, -1)
    if classification == "response":
        raise ProbeError("unexpected_post_account_response")
    return classification


def validate_shutdown_stream(lines: list[bytes]) -> dict:
    """Fixture-testable stream contract: one terminal frame, then EOF."""
    frame = None
    for index, raw in enumerate(lines):
        if frame is not None:
            raise ProbeError("stdout_after_supervisor_frame")
        if raw.startswith(SUPERVISOR_FRAME):
            frame = validate_supervisor_frame(raw)
            if index != len(lines) - 1:
                raise ProbeError("stdout_after_supervisor_frame")
        else:
            validate_shutdown_line(raw)
    if frame is None:
        raise ProbeError("supervisor_frame_missing")
    if (not frame["child_stopped"] or not frame["scratch_cleaned"] or
            not frame["group_quiescent"]):
        raise ProbeError("cleanup_unconfirmed")
    if frame["child_exit_code"] != 0:
        raise ProbeError("child_exit_nonzero")
    return frame


def _remote_supervisor_source() -> str:
    """POSIX supervisor with a private unreaped keeper pinning its process group."""
    return r'''import json, os, pathlib, signal, shutil, subprocess, sys, tempfile, time

CODEX="/opt/onia-codex-cli/0.161.0/node_modules/.bin/codex"
CODEX_HOME="/opt/onia-codex-cli/0.161.0/auth-home"
BASE=pathlib.Path("/tmp")
scratch=None
keeper=None
child=None
child_code=122
child_stopped=False
group_quiescent=False
scratch_cleaned=False
group_close_result=False

def active_group_members(pgid, keeper_pid):
    proc_root=pathlib.Path("/proc")
    if not proc_root.is_dir():
        return None
    active=[]
    try:
        with os.scandir(proc_root) as entries:
            for index, entry in enumerate(entries):
                if index >= 8192:
                    return None
                if not entry.name.isdigit():
                    continue
                try:
                    raw=pathlib.Path(entry.path,"stat").read_text(encoding="ascii")
                except FileNotFoundError:
                    continue
                except OSError:
                    return None
                close=raw.rfind(")")
                if close < 0:
                    return None
                fields=raw[close+1:].split()
                if len(fields) < 3:
                    return None
                try:
                    state=fields[0]
                    process_group=int(fields[2])
                except (ValueError, IndexError):
                    return None
                if process_group == pgid and int(entry.name) != keeper_pid and state not in ("Z","X"):
                    active.append(int(entry.name))
    except OSError:
        return None
    return active

def cleanup_group():
    global child_stopped, group_quiescent, group_close_result
    if group_close_result:
        return True
    if keeper is None:
        child_stopped=(child is None or child.poll() is not None)
        group_quiescent=(child is None)
        group_close_result=(child is None)
        return group_close_result
    # Do not poll/reap the keeper until killpg; its unreaped PID pins this PGID.
    try:
        os.killpg(keeper.pid, signal.SIGTERM)
    except ProcessLookupError:
        child_stopped=(child is None or child.poll() is not None)
        return False
    deadline=time.monotonic()+1.25
    members=active_group_members(keeper.pid, keeper.pid)
    while members and time.monotonic() < deadline:
        time.sleep(0.05)
        members=active_group_members(keeper.pid, keeper.pid)
    try:
        # The group ID is still pinned by our unreaped keeper.
        os.killpg(keeper.pid, signal.SIGKILL)
    except ProcessLookupError:
        members=None
    verify_deadline=time.monotonic()+0.45
    while members is not None and members and time.monotonic() < verify_deadline:
        time.sleep(0.025)
        members=active_group_members(keeper.pid, keeper.pid)
    group_quiescent=(members == [])
    if child is not None:
        try: child.wait(timeout=0.1)
        except subprocess.TimeoutExpired: pass
        child_stopped=(child.poll() is not None)
    else:
        child_stopped=True
    try:
        keeper.wait(timeout=0.1)
    except subprocess.TimeoutExpired:
        group_quiescent=False
    group_close_result=(group_quiescent and child_stopped and keeper.returncode is not None)
    return group_close_result

def on_signal(signum, frame):
    # Let the single outer finally perform group cleanup exactly once.
    raise SystemExit(124)

signal.signal(signal.SIGTERM, on_signal)
signal.signal(signal.SIGHUP, on_signal)
try:
    base=BASE.resolve(strict=True)
    if base != pathlib.Path("/tmp") or not os.access(base, os.W_OK|os.X_OK):
        raise SystemExit(120)
    scratch=pathlib.Path(tempfile.mkdtemp(prefix="codex-meta-probe-", dir=str(base)))
    scratch=scratch.resolve(strict=True)
    st=scratch.lstat()
    if scratch.parent != base or not scratch.name.startswith("codex-meta-probe-") or not pathlib.Path(scratch).is_dir() or st.st_uid != os.getuid() or (st.st_mode & 0o777) != 0o700:
        raise SystemExit(120)
    state=scratch/"state"
    logs=scratch/"logs"
    state.mkdir(mode=0o700)
    logs.mkdir(mode=0o700)
    for directory in (state, logs):
        ds=directory.lstat()
        if ds.st_uid != os.getuid() or (ds.st_mode & 0o777) != 0o700 or directory.is_symlink():
            raise SystemExit(120)
    if not os.path.isfile(CODEX) or not os.access(CODEX, os.X_OK):
        raise SystemExit(121)
    env={"PATH":"/usr/local/bin:/usr/bin:/bin", "HOME":"/root", "CODEX_HOME":CODEX_HOME,
         "LANG":"C.UTF-8", "TZ":"UTC", "NO_COLOR":"1"}
    keeper=subprocess.Popen([sys.executable,"-c","import signal,time; signal.signal(signal.SIGTERM,signal.SIG_IGN); time.sleep(60)"],
        cwd=str(scratch),env=env,stdin=subprocess.DEVNULL,stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,process_group=0)
    if keeper.poll() is not None:
        # poll() reaped it; the numeric PID is no longer ours to signal.
        keeper=None
        raise SystemExit(122)
    if keeper.pid == os.getpid():
        raise SystemExit(122)
    # Codex inherits the keeper's group; app-server defaults to stdio:// in 0.161.
    argv=[CODEX,"-c","features.plugins=false","-c",f'sqlite_home="{state}"',"-c",f'log_dir="{logs}"',"app-server"]
    child=subprocess.Popen(argv,cwd=str(scratch),env=env,process_group=keeper.pid)
    try:
        child_code=child.wait(timeout=45)
    except subprocess.TimeoutExpired:
        child_code=124
    else:
        child_stopped=child.poll() is not None
    if not isinstance(child_code,int) or not 0 <= child_code <= 255:
        child_code=122
finally:
    if keeper is not None and not group_close_result:
        cleanup_group()
    if scratch is not None and group_close_result:
        try:
            final=scratch.resolve(strict=True)
            st=final.lstat()
            if final.parent == BASE.resolve(strict=True) and final.name.startswith("codex-meta-probe-") and st.st_uid == os.getuid() and not final.is_symlink():
                shutil.rmtree(final)
                scratch_cleaned=True
        except (OSError, RuntimeError):
            pass
    frame={"child_exit_code":child_code,"child_stopped":bool(child_stopped),"scratch_cleaned":bool(scratch_cleaned),"group_quiescent":bool(group_quiescent)}
    sys.stdout.write("__CODEX_PROBE_SUPERVISOR_DONE__:"+json.dumps(frame,separators=(",",":"))+"\n")
    sys.stdout.flush()
raise SystemExit(child_code if child_stopped and group_quiescent and scratch_cleaned else 123)
'''


def build_ssh_argv() -> list[str]:
    ssh = shutil.which("ssh")
    if not ssh:
        raise ProbeError("ssh_executable_unavailable")
    if not SSH_IDENTITY.is_file() or not SSH_KNOWN_HOSTS.is_file():
        raise ProbeError("approved_ssh_identity_or_pin_unavailable")
    import shlex

    remote = "python3 -c " + shlex.quote(_remote_supervisor_source())
    return [
        ssh,
        "-T",
        "-i", str(SSH_IDENTITY),
        "-o", "BatchMode=yes",
        "-o", "StrictHostKeyChecking=yes",
        "-o", "IdentitiesOnly=yes",
        "-o", "ClearAllForwardings=yes",
        "-o", f"UserKnownHostsFile={SSH_KNOWN_HOSTS}",
        "-o", "ConnectTimeout=8",
        SSH_TARGET,
        remote,
    ]


def _read_stdout_lines(stream, output_queue: queue.Queue, counters: dict, lock: threading.Lock) -> None:
    try:
        while True:
            line = stream.readline(MAX_LINE_BYTES + 1)
            if not line:
                output_queue.put(None)
                return
            with lock:
                counters["stdout_lines"] += 1
                counters["stdout_bytes"] += len(line)
                too_many = counters["stdout_lines"] > MAX_STDOUT_LINES
                too_large = counters["stdout_bytes"] > MAX_STDOUT_BYTES
            output_queue.put(line)
            if len(line) > MAX_LINE_BYTES or too_many or too_large:
                output_queue.put(ProbeError("stdout_budget_exceeded"))
                return
    except Exception:
        output_queue.put(ProbeError("stdout_reader_failed"))


def _drain_stderr(stream, counters: dict, lock: threading.Lock) -> None:
    try:
        while True:
            chunk = stream.read(8192)
            if not chunk:
                return
            with lock:
                counters["stderr_bytes"] += len(chunk)
    except Exception:
        with lock:
            counters["stderr_drain_error"] = True


def _next_response(proc, output_queue: queue.Queue, request_id: int, deadline: float) -> dict:
    while True:
        remaining = deadline - time.monotonic()
        if remaining <= 0:
            raise ProbeError("watchdog_timeout")
        try:
            raw = output_queue.get(timeout=remaining)
        except queue.Empty:
            raise ProbeError("watchdog_timeout") from None
        if isinstance(raw, ProbeError):
            raise raw
        if raw is None:
            raise ProbeError("app_server_closed_stdout")
        classification, message = validate_jsonrpc_line(raw, request_id)
        if classification == "notification":
            continue
        return message


def _drain_shutdown(output_queue: queue.Queue, deadline: float) -> dict:
    saw_frame = False
    frame = None
    while True:
        remaining = deadline - time.monotonic()
        if remaining <= 0:
            raise ProbeError("watchdog_timeout")
        try:
            raw = output_queue.get(timeout=remaining)
        except queue.Empty:
            raise ProbeError("watchdog_timeout") from None
        if isinstance(raw, ProbeError):
            raise raw
        if raw is None:
            if not saw_frame:
                raise ProbeError("supervisor_frame_missing")
            break
        if saw_frame:
            raise ProbeError("stdout_after_supervisor_frame")
        if raw.startswith(SUPERVISOR_FRAME):
            frame = validate_supervisor_frame(raw)
            saw_frame = True
        else:
            validate_shutdown_line(raw)
    if frame is None:
        raise ProbeError("supervisor_frame_missing")
    if not frame["child_stopped"] or not frame["scratch_cleaned"]:
        raise ProbeError("cleanup_unconfirmed")
    if frame["child_exit_code"] != 0:
        raise ProbeError("child_exit_nonzero")
    return frame


def _send_json(proc, payload: dict) -> None:
    wire = (json.dumps(payload, separators=(",", ":")) + "\n").encode("utf-8")
    if len(wire) > MAX_LINE_BYTES:
        raise ProbeError("outgoing_request_oversized")
    try:
        proc.stdin.write(wire)
        proc.stdin.flush()
    except (BrokenPipeError, OSError):
        raise ProbeError("app_server_stdin_closed") from None


def _send_tracked(proc, payload: dict, written_methods: list[str]) -> None:
    """Track a method only after local stdin write and flush both succeed."""
    _send_json(proc, payload)
    method=payload.get("method")
    if type(method) is str:
        written_methods.append(method)


def _new_receipt_path() -> Path:
    stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%S_%fZ")
    candidate = ARTIFACT_DIR / f"receipt-{stamp}.json"
    if candidate.exists():
        raise ProbeError("receipt_path_already_exists")
    return candidate


def run_probe() -> dict:
    argv = build_ssh_argv()
    started = time.monotonic()
    deadline = started + LOCAL_WATCHDOG_SECONDS
    counters = {"stderr_bytes": 0, "stdout_lines": 0, "stdout_bytes": 0}
    counter_lock = threading.Lock()
    proc = subprocess.Popen(
        argv,
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        creationflags=getattr(subprocess, "CREATE_NEW_PROCESS_GROUP", 0),
    )
    output_queue: queue.Queue = queue.Queue(maxsize=64)
    reader = threading.Thread(target=_read_stdout_lines, args=(proc.stdout, output_queue, counters, counter_lock), daemon=True)
    stderr_reader = threading.Thread(target=_drain_stderr, args=(proc.stderr, counters, counter_lock), daemon=True)
    reader.start()
    stderr_reader.start()
    failure = None
    account = {"account_present": False, "auth_kind": "unknown"}
    rpc_methods_sent: list[str] = []
    protocol_diagnostics: list[dict] = []
    try:
        _send_tracked(proc, {
            "id": 1, "method": "initialize",
            "params": {"clientInfo": {"name": "onia_metadata_probe", "version": "1"},
                       "capabilities": {"experimentalApi": False}},
        }, rpc_methods_sent)
        init_response = _next_response(proc, output_queue, 1, deadline)
        if type(init_response.get("result")) is not dict:
            raise ProbeError("initialize_result_invalid")
        _send_tracked(proc, {"method": "initialized"}, rpc_methods_sent)
        _send_tracked(proc, {"id": 2, "method": "account/read", "params": {}}, rpc_methods_sent)
        account_response = _next_response(proc, output_queue, 2, deadline)
        account = project_account_read(account_response)
        if proc.stdin and not proc.stdin.closed:
            proc.stdin.close()
        _drain_shutdown(output_queue, deadline)
    except ProbeError as exc:
        failure = str(exc)
        if exc.diagnostic is not None:
            protocol_diagnostics.append(exc.diagnostic)
    except Exception:
        failure = "probe_internal_error"
    finally:
        try:
            if proc.stdin and not proc.stdin.closed:
                proc.stdin.close()
        except OSError:
            pass
        if failure is not None and proc.poll() is None:
            # Drop only this driver's SSH child immediately; the remote Python
            # parent has its own TERM/HUP handler and 45+2 second child cap.
            proc.terminate()
            try:
                proc.wait(timeout=2)
            except subprocess.TimeoutExpired:
                proc.kill()
                proc.wait(timeout=2)
        else:
            remaining = max(0.0, deadline - time.monotonic())
            try:
                proc.wait(timeout=remaining)
            except subprocess.TimeoutExpired:
                failure = failure or "watchdog_timeout"
                proc.kill()
                proc.wait(timeout=2)
        for stream in (proc.stdout, proc.stderr):
            try:
                stream.close()
            except OSError:
                pass
    elapsed = round(time.monotonic() - started, 3)
    with counter_lock:
        stderr_bytes = counters["stderr_bytes"]
        stdout_lines = counters["stdout_lines"]
        stdout_bytes = counters["stdout_bytes"]
    if failure is None and proc.returncode != 0:
        failure = "process_exit_nonzero"
    return {
        "captured_at_utc": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "status": "metadata_read_complete" if failure is None and proc.returncode == 0 else "held_or_failed",
        "failure_class": failure,
        "account_present": account["account_present"] if failure is None else False,
        "auth_kind": account["auth_kind"] if failure is None else "unknown",
        "rpc_methods_sent": rpc_methods_sent,
        "rpc_delivery_status": "unknown",
        "protocol_diagnostics": protocol_diagnostics,
        "llm_calls": 0,
        "tool_calls": 0,
        "elapsed_seconds": elapsed,
        "exit_code": proc.returncode,
        "stderr_bytes_discarded": stderr_bytes,
        "stdout_lines_validated": stdout_lines,
        "stdout_bytes_validated": stdout_bytes,
        "retry_count": 0,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--execute", action="store_true", help="Start the reviewed metadata-only probe through the pinned SSH route")
    args = parser.parse_args()
    if not args.execute:
        print(json.dumps({"status": "prepared_only", "executed": False}, separators=(",", ":")))
        return 0
    path = None
    try:
        path = _new_receipt_path()
        with path.open("x", encoding="utf-8") as handle:
            try:
                receipt = run_probe()
            except ProbeError as exc:
                receipt = {"status": "blocked", "failure_class": str(exc), "llm_calls": 0,
                           "tool_calls": 0, "retry_count": 0}
            except Exception:
                receipt = {"status": "blocked", "failure_class": "probe_internal_error",
                           "llm_calls": 0, "tool_calls": 0, "retry_count": 0}
            json.dump(receipt, handle, separators=(",", ":"), sort_keys=True)
            handle.write("\n")
            handle.flush()
            os.fsync(handle.fileno())
        print(json.dumps({"status": receipt["status"], "receipt": path.name}, separators=(",", ":")))
        return 0 if receipt["status"] == "metadata_read_complete" else 2
    except ProbeError as exc:
        if path is not None:
            return 2
        print(json.dumps({"status": "blocked", "reason": str(exc)}, separators=(",", ":")))
        return 2
    except Exception:
        print(json.dumps({"status": "blocked", "reason": "probe_internal_error"}, separators=(",", ":")))
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
