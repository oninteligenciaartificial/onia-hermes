#!/usr/bin/env python3
"""Minimal MCP stdio facade for claude_task. Execution is opt-in at server launch."""
import argparse
import json
import sys

import claude_task as task

PROTOCOL = "2025-06-18"
TOOLS = [
    {"name": "review_text", "description": "One bounded text review through Claude subscription; writes a consumed task receipt. No tools/subagents. Execution requires server launch authorization.",
     "inputSchema": {"type": "object", "properties": {"contract": {"type": "object"}}, "required": ["contract"], "additionalProperties": False},
     "annotations": {"readOnlyHint": False, "destructiveHint": False, "idempotentHint": False, "openWorldHint": True}},
    {"name": "status", "description": "Read a task receipt without any provider request.",
     "inputSchema": {"type": "object", "properties": {"task_id": {"type": "string", "pattern": "^[A-Za-z0-9][A-Za-z0-9_-]{0,79}$"}}, "required": ["task_id"], "additionalProperties": False},
     "annotations": {"readOnlyHint": True, "destructiveHint": False, "idempotentHint": True, "openWorldHint": False}},
]


class Server:
    def __init__(self, repo, store, *, perform=False, adapter=None, executable=None, adapter_path=task.ADAPTER):
        self.repo, self.store, self.perform, self.adapter = repo, store, perform, adapter
        self.executable = executable
        self.adapter_path = adapter_path
        self.initialized = False
        self.ready = False

    def reply(self, message):
        if not isinstance(message, dict) or message.get("jsonrpc") != "2.0":
            return {"jsonrpc": "2.0", "id": None, "error": {"code": -32600, "message": "Invalid Request"}}
        method, request_id = message.get("method"), message.get("id")
        if "id" not in message:
            if method == "notifications/initialized" and self.initialized:
                self.ready = True
            return None
        def result(value):
            return {"jsonrpc": "2.0", "id": request_id, "result": value}
        def error(code, text):
            return {"jsonrpc": "2.0", "id": request_id, "error": {"code": code, "message": text}}
        if method == "initialize":
            self.initialized = True
            return result({"protocolVersion": PROTOCOL, "capabilities": {"tools": {"listChanged": False}},
                           "serverInfo": {"name": "onia-claude-text", "version": "1.0.0"}})
        if method == "ping":
            return result({})
        if not self.ready:
            return error(-32002, "Initialize first")
        if method == "tools/list":
            return result({"tools": TOOLS})
        if method != "tools/call":
            return error(-32601, "Method not found")
        try:
            params = message.get("params", {})
            name, args = params.get("name"), params.get("arguments", {})
            if name == "status" and set(args) == {"task_id"}:
                output = task.status(self.store, args["task_id"])
            elif name == "review_text" and set(args) == {"contract"}:
                output = task.execute(args["contract"], self.repo, self.store,
                                      adapter=self.adapter or task.load_adapter(self.adapter_path), executable=self.executable, perform=self.perform)
            else:
                return error(-32602, "Unknown tool or invalid arguments")
            failed = output["state"] not in {"ok", "dry_run", "not_found"}
            return result({"content": [{"type": "text", "text": json.dumps(output, ensure_ascii=False)}], "isError": failed})
        except Exception:
            return result({"content": [{"type": "text", "text": "Contract, policy, or storage validation failed; inspect existing task status before any retry."}], "isError": True})


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo", required=True)
    parser.add_argument("--store", required=True)
    parser.add_argument("--execute", action="store_true", help="enable provider calls; deployment requires explicit approval")
    parser.add_argument("--claude", help="explicit reviewed executable path")
    parser.add_argument("--adapter", default=str(task.ADAPTER), help="existing reviewed adapter, SHA-256 pinned")
    args = parser.parse_args()
    server = Server(args.repo, args.store, perform=args.execute, executable=args.claude, adapter_path=args.adapter)
    while True:
        line = sys.stdin.buffer.readline(65537)
        if not line:
            return
        if len(line) > 65536:
            # Fail closed and exit; do not parse the remainder as another request.
            return
        try:
            message = json.loads(line.decode("utf-8"))
            output = server.reply(message)
        except (ValueError, UnicodeError):
            output = {"jsonrpc": "2.0", "id": None, "error": {"code": -32700, "message": "Parse error"}}
        if output is not None:
            sys.stdout.buffer.write((json.dumps(output, ensure_ascii=False) + "\n").encode("utf-8"))
            sys.stdout.buffer.flush()


if __name__ == "__main__":
    main()
