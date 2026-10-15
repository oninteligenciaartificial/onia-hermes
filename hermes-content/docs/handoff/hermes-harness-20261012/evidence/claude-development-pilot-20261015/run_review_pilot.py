#!/usr/bin/env python3
"""Operator CLI for the Claude-authored selector; local nonsecret text review only.

Trusted manual inputs only. This does not admit untrusted MCP jobs, enable remote
coding, or recreate the prior implementation/subagent job automatically.
"""
import argparse
import hashlib
import json
import os
import subprocess
import sys
from pathlib import Path

sys.dont_write_bytecode = True
FOLDER = Path(__file__).resolve().parent
sys.path.insert(0, str(FOLDER.parent / "claude-adapter-prep-20261015"))
sys.path.insert(0, str(FOLDER.parent / "cli-integration-prep-20261015"))
import claude_adapter as adapter
import claude_task
import development_job


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--workspace", type=Path, required=True)
    parser.add_argument("--state-root", type=Path, required=True)
    parser.add_argument("--prompt-file", type=Path, required=True, help="trusted, nonsecret review input")
    parser.add_argument("--task-id", required=True)
    parser.add_argument("--attempt-id", default="attempt-1")
    parser.add_argument("--primary", default=r"C:\Users\PC\AppData\Roaming\npm\node_modules\@anthropic-ai\claude-code\bin\claude.exe")
    parser.add_argument("--fallback", default=r"C:\Users\PC\AppData\Local\OpenAI\Codex\bin\2e5e00daee91c61d\codex.exe")
    parser.add_argument("--execute", action="store_true")
    args = parser.parse_args()
    env = adapter.subscription_environment()
    request = {"task_id": args.task_id, "attempt_id": args.attempt_id, "operation": "development",
               "workspace": str(args.workspace), "prompt": args.prompt_file.read_text(encoding="utf-8")}

    def preflight(provider, executable, workspace):
        if provider == "primary":
            check = claude_task.preflight(executable, child_env=env)
            return {"ok": check["ok"], "auth": check["ok"], "error": check.get("error")}
        proc = subprocess.run([executable, "login", "status"], capture_output=True, env=env, timeout=15)
        text = (proc.stdout + proc.stderr).decode("utf-8", "replace").lower()
        auth = proc.returncode == 0 and "chatgpt" in text and "api key" not in text and "api_key" not in text
        return {"ok": auth, "auth": auth, "error": None if auth else "auth_unverified"}

    def execute(provider, executable, bounded_request):
        # This callback preserves the reviewed operational supervisor path, not a
        # second scheduler. Receipt reservation in run_job already happened.
        private = args.state_root / "operator_packets" / args.task_id / args.attempt_id
        private.mkdir(parents=True, exist_ok=False)
        prompt = private / "prompt.txt"
        prompt.write_text(bounded_request["prompt"], encoding="utf-8")
        if provider == "primary":
            argv = adapter.command_for(executable)  # fixed Sonnet text-only safety profile
        else:
            argv = [executable, "exec", "--ignore-user-config", "--ephemeral", "--skip-git-repo-check", "--sandbox", "read-only",
                    "--model", "gpt-6-astra", "-c", 'model_reasoning_effort="medium"', "--json", "-C", str(args.workspace), "-"]
        packet = {"task_id": args.task_id, "argv": argv, "workspace": str(args.workspace), "prompt_file": str(prompt),
                  "stdout_file": str(private / "stream.jsonl"), "stderr_file": str(private / "stderr.txt")}
        packet_path = private / "packet.json"
        packet_path.write_text(json.dumps(packet), encoding="utf-8")
        receipt = private / "supervisor.json"
        proc = subprocess.run([sys.executable, "-B", str(FOLDER / "operator_supervisor.py"), "--packet", str(packet_path),
                               "--receipt", str(receipt), "--execute"], capture_output=True, timeout=190)
        final = json.loads(receipt.with_suffix(".result.json").read_text())
        if proc.returncode or final.get("provider_exit") != 0 or not final.get("windows_job_closed"):
            return {"state": "needs_reconcile"}
        raw = (private / "stream.jsonl").read_bytes()
        if provider == "primary":
            result = adapter.parse_result(raw, b"", 0, prompt.read_bytes(), final["elapsed_ms"])
            return {"state": result["state"], "observed_model": result["model"], "response_sha256": result["response_sha256"],
                    "usage": {k: v for k, v in result["usage"].items() if v is None or isinstance(v, (int, float))}, "tools": []}
        events = [json.loads(line) for line in raw.splitlines()]
        messages = [e["item"]["text"] for e in events if e.get("type") == "item.completed" and e.get("item", {}).get("type") == "agent_message"]
        completed = next((e for e in events if e.get("type") == "turn.completed"), None)
        if not completed or not messages:
            return {"state": "needs_reconcile"}
        observed_tools = {e.get("item", {}).get("type") for e in events
                          if isinstance(e.get("item"), dict) and e["item"].get("type")
                          and e["item"]["type"] not in {"agent_message", "reasoning"}}
        observed_tools.update(e["type"] for e in events if "tool" in str(e.get("type", ""))
                              or "command" in str(e.get("type", "")))
        return {"state": "ok", "observed_model": None, "response_sha256": hashlib.sha256(messages[-1].encode()).hexdigest(),
                "usage": completed.get("usage"), "tools": sorted(observed_tools)}  # no served-model ID in observed Codex events

    result = development_job.run_job(request, args.state_root, args.primary, args.fallback, execute, preflight, dry_run=not args.execute)
    print(json.dumps(result, sort_keys=True, allow_nan=False))


if __name__ == "__main__":
    main()
