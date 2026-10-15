#!/usr/bin/env python3
"""One authorized MCP text smoke; dry-run default, no retry loop."""
import argparse
import json
import subprocess
import sys
from pathlib import Path
import claude_task as task


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo", required=True)
    parser.add_argument("--store", required=True)
    parser.add_argument("--adapter", default=str(task.ADAPTER))
    parser.add_argument("--output", required=True)
    parser.add_argument("--execute", action="store_true")
    args = parser.parse_args()
    contract = json.loads(Path(__file__).with_name("smoke-contract.json").read_text(encoding="utf-8"))
    prompt, _ = task.build_prompt(contract, args.repo)
    if not args.execute:
        print(json.dumps({"state": "dry_run", "input_bytes": len(prompt), "input_sha256": task.digest(prompt)}))
        return
    # Reserve this evidence file too: rerunning this harness cannot repeat the smoke.
    output = Path(args.output)
    task.write_once(output, {"state": "reserved", "task_id": contract["task_id"]})
    messages = [
        {"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {"protocolVersion": "2025-06-18", "capabilities": {}, "clientInfo": {"name": "onia-authorized-smoke", "version": "1"}}},
        {"jsonrpc": "2.0", "method": "notifications/initialized"},
        {"jsonrpc": "2.0", "id": 2, "method": "tools/list"},
        {"jsonrpc": "2.0", "id": 3, "method": "tools/call", "params": {"name": "review_text", "arguments": {"contract": contract}}},
        {"jsonrpc": "2.0", "id": 4, "method": "tools/call", "params": {"name": "status", "arguments": {"task_id": contract["task_id"]}}},
    ]
    command = [sys.executable, str(Path(__file__).with_name("claude_mcp.py")), "--repo", args.repo, "--store", args.store,
               "--adapter", args.adapter, "--execute"]
    proc = subprocess.run(command, input="".join(json.dumps(x) + "\n" for x in messages).encode("utf-8"), capture_output=True, timeout=65)
    replies = [json.loads(line) for line in proc.stdout.splitlines()]
    review = json.loads(next(x for x in replies if x.get("id") == 3)["result"]["content"][0]["text"])
    status = json.loads(next(x for x in replies if x.get("id") == 4)["result"]["content"][0]["text"])
    evidence = {"state": "ok" if proc.returncode == 0 and review["state"] == "ok" and review == status else "blocked",
                "task_id": contract["task_id"], "input_bytes": len(prompt), "input_sha256": task.digest(prompt),
                "mcp_reply_ids": [x.get("id") for x in replies], "stdout_json_only": True,
                "stderr_bytes": len(proc.stderr), "review_receipt": review, "status_matches": review == status}
    # This is a separate immutable result, preserving the pre-smoke reservation.
    task.write_once(output.with_suffix(".result.json"), evidence)
    print(json.dumps({"state": evidence["state"], "task_id": contract["task_id"], "model": review.get("provider_receipt", {}).get("model"), "status_matches": review == status}))


if __name__ == "__main__":
    main()
