#!/usr/bin/env python3
"""Small, opt-in Claude Code CLI adapter. Dry-run is the default."""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import shutil
import subprocess
import sys
import time
from pathlib import Path
from typing import Any, Callable


MODEL = "claude-sonnet-5-5"
MAX_INPUT_BYTES = 32_000
MAX_RESULT_BYTES = 64_000
DEFAULT_TIMEOUT_SECONDS = 45
ERROR_AUTH = re.compile(r"(?:oauth session expired|failed to authenticate|authentication failed)", re.I)


def subscription_environment() -> dict[str, str]:
    """Keep OS/runtime essentials, never inherit API/provider/OAuth overrides."""
    allowed = {"PATH", "HOME", "USER", "LOGNAME", "LANG", "LC_ALL", "LC_CTYPE", "TERM", "TZ", "TEMP", "TMP", "TMPDIR",
               "SYSTEMROOT", "WINDIR", "COMSPEC", "PATHEXT", "APPDATA", "LOCALAPPDATA", "USERPROFILE", "HOMEDRIVE", "HOMEPATH", "PROGRAMFILES", "PROGRAMFILES(X86)", "PROGRAMDATA"}
    env = {key: value for key, value in os.environ.items() if key.upper() in allowed}
    env["DISABLE_AUTOUPDATER"] = "1"
    return env


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def receipt(payload: dict[str, Any]) -> dict[str, Any]:
    """Attach a deterministic digest of the receipt fields before the digest."""
    body = json.dumps(payload, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return {**payload, "receipt_sha256": sha256(body)}


def reserve_receipt(receipt_path: str | None, prompt: bytes):
    if not receipt_path:
        return None
    target = Path(receipt_path)
    target.parent.mkdir(parents=True, exist_ok=True)
    handle = target.open("x+", encoding="utf-8", newline="\n")
    handle.write(json.dumps(receipt(base_receipt("reserved", None, prompt)), sort_keys=True) + "\n")
    handle.flush()
    return handle


def emit(payload: dict[str, Any], receipt_handle=None) -> None:
    final = receipt(payload)
    encoded = json.dumps(final, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
    if receipt_handle:
        # The path was reserved with exclusive-create before any provider call.
        receipt_handle.seek(0)
        receipt_handle.truncate()
        receipt_handle.write(encoded + "\n")
        receipt_handle.flush()
        receipt_handle.close()
    output = encoded + "\n"
    binary = getattr(sys.stdout, "buffer", None)
    if binary is not None:
        binary.write(output.encode("utf-8"))
        binary.flush()
    else:
        sys.stdout.write(output)


def base_receipt(state: str, error: str | None, prompt: bytes, *, model: str = MODEL) -> dict[str, Any]:
    return {
        "schema_version": 1,
        "state": state,
        "error": error,
        "model": model,
        "input_bytes": len(prompt),
        "input_sha256": sha256(prompt),
        "usage": {
            "input_tokens": None,
            "output_tokens": None,
            "cache_creation_input_tokens": None,
            "cache_read_input_tokens": None,
            "server_tool_use": None,
            "duration_ms": None,
        },
        "cost_estimate_usd": None,
        "response": None,
        "response_sha256": None,
    }


def command_for(executable: str) -> list[str]:
    """Build a fixed Windows launcher argv; prompt is never placed in it."""
    flags = [
        "-p", "--safe-mode", "--restricted", "--setting-sources", "", "--tools", "", "--strict-mcp-config",
        "--permission-prompts", "none", "--no-session-persistence", "--no-chrome",
        "--model", MODEL, "--effort", "low", "--max-turns", "1", "--output-format", "json",
    ]
    path = Path(executable)
    if os.name == "nt" and path.suffix.lower() in {".cmd", ".bat"}:
        # The command string contains only the resolved executable and fixed flags.
        # User input is passed on stdin, never interpolated into this shell string.
        if any(ch in executable for ch in "&|<>^%\r\n"):
            raise ValueError("unsafe_cli_path")
        fixed = subprocess.list2cmdline([executable, *flags])
        return [os.environ.get("COMSPEC", "cmd.exe"), "/d", "/s", "/c", fixed]
    return [executable, *flags]


def parse_result(stdout: bytes, stderr: bytes, exit_code: int, prompt: bytes, elapsed_ms: int) -> dict[str, Any]:
    base = base_receipt("error", "cli_error", prompt)
    base["usage"]["duration_ms"] = elapsed_ms
    if ERROR_AUTH.search((stdout + b"\n" + stderr).decode("utf-8", "replace")):
        base["error"] = "auth_expired"
        return base
    if len(stdout) > MAX_RESULT_BYTES:
        base["error"] = "output_too_large"
        return base
    try:
        obj = json.loads(stdout.decode("utf-8"))
    except (UnicodeDecodeError, json.JSONDecodeError):
        base["error"] = "invalid_json"
        return base
    if not isinstance(obj, dict) or not isinstance(obj.get("result"), str):
        base["error"] = "invalid_schema"
        return base
    if obj.get("type") != "result" or obj.get("subtype") != "success" or obj.get("is_error") is not False:
        base["error"] = "invalid_schema"
        return base
    usage = obj.get("usage")
    if not isinstance(usage, dict):
        usage = {}
    model_usage = obj.get("modelUsage")
    models = sorted(model_usage) if isinstance(model_usage, dict) else []
    actual_model = models[0] if len(models) == 1 else None
    if len(models) != 1 or actual_model != MODEL:
        base["model"] = ",".join(models) if models else None
        base["error"] = "model_mismatch"
        return base
    # Tool denials mean the model tried a tool. Never expose their raw names/details.
    denials = obj.get("permission_denials")
    if isinstance(denials, list) and denials:
        base["error"] = "tool_attempt_blocked"
        return base
    result = obj["result"]
    result_bytes = result.encode("utf-8")
    if len(result_bytes) > MAX_RESULT_BYTES:
        base["error"] = "output_too_large"
        return base
    base.update({
        "state": "ok" if exit_code == 0 and not obj.get("is_error", False) else "error",
        "error": None if exit_code == 0 and not obj.get("is_error", False) else "provider_error",
        "model": actual_model or MODEL,
        "usage": {
            "input_tokens": usage.get("input_tokens"),
            "output_tokens": usage.get("output_tokens"),
            "cache_creation_input_tokens": usage.get("cache_creation_input_tokens"),
            "cache_read_input_tokens": usage.get("cache_read_input_tokens"),
            "server_tool_use": usage.get("server_tool_use"),
            "duration_ms": elapsed_ms,
        },
        "cost_estimate_usd": obj.get("total_cost_usd"),
        "response": result,
        "response_sha256": sha256(result_bytes),
    })
    return base


def run_once(
    prompt: bytes,
    *,
    executable: str,
    timeout_seconds: int,
    popen: Callable[..., Any] = subprocess.Popen,
) -> dict[str, Any]:
    env = subscription_environment()
    started = time.monotonic()
    try:
        proc = popen(
            command_for(executable),
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            cwd=os.environ.get("TEMP") or os.environ.get("TMP") or str(Path.cwd()),
            env=env,
            shell=False,
        )
        stdout, stderr = proc.communicate(input=prompt, timeout=timeout_seconds)
        return parse_result(stdout, stderr, proc.returncode, prompt, int((time.monotonic() - started) * 1000))
    except subprocess.TimeoutExpired:
        try:
            proc.kill()
            proc.communicate()
        except Exception:
            pass
        result = base_receipt("error", "timeout", prompt)
        result["usage"]["duration_ms"] = int((time.monotonic() - started) * 1000)
        return result
    except FileNotFoundError:
        return base_receipt("error", "cli_not_found", prompt)
    except Exception:
        # Do not serialize OS exception text; it can include local paths.
        return base_receipt("error", "launch_error", prompt)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--execute", action="store_true", help="perform one Claude subscription request")
    parser.add_argument("--timeout", type=int, default=DEFAULT_TIMEOUT_SECONDS)
    parser.add_argument("--receipt", help="optional write-once JSON receipt path")
    args = parser.parse_args(argv)
    prompt = sys.stdin.buffer.read(MAX_INPUT_BYTES + 1)
    if args.execute and not args.receipt:
        emit(base_receipt("error", "receipt_required", prompt[:MAX_INPUT_BYTES]))
        return 2
    try:
        receipt_handle = reserve_receipt(args.receipt, prompt[:MAX_INPUT_BYTES])
    except FileExistsError:
        emit(base_receipt("error", "receipt_exists", prompt[:MAX_INPUT_BYTES]))
        return 2
    except Exception:
        emit(base_receipt("error", "receipt_unavailable", prompt[:MAX_INPUT_BYTES]))
        return 2
    if not prompt:
        emit(base_receipt("error", "empty_input", prompt), receipt_handle)
        return 2
    if len(prompt) > MAX_INPUT_BYTES:
        emit(base_receipt("error", "input_too_large", prompt[:MAX_INPUT_BYTES]), receipt_handle)
        return 2
    if not args.execute:
        result = base_receipt("dry_run", None, prompt)
        result["note"] = "no provider call made"
        emit(result, receipt_handle)
        return 0
    if not 1 <= args.timeout <= 300:
        emit(base_receipt("error", "invalid_timeout", prompt), receipt_handle)
        return 2
    executable = shutil.which("claude.cmd") or shutil.which("claude")
    if not executable:
        emit(base_receipt("error", "cli_not_found", prompt), receipt_handle)
        return 3
    result = run_once(prompt, executable=executable, timeout_seconds=args.timeout)
    emit(result, receipt_handle)
    return 0 if result["state"] == "ok" else 1


if __name__ == "__main__":
    raise SystemExit(main())
