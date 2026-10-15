import json
import unittest
import subprocess
import sys
from pathlib import Path
from unittest.mock import patch
import claude_mcp as mcp


class MCPTests(unittest.TestCase):
    def setUp(self):
        self.server = mcp.Server("unused", "unused")

    def request(self, method, params=None):
        return self.server.reply({"jsonrpc": "2.0", "id": 7, "method": method, "params": params or {}})

    def initialize(self):
        self.assertEqual(self.request("initialize")["result"]["protocolVersion"], mcp.PROTOCOL)
        self.assertIsNone(self.server.reply({"jsonrpc": "2.0", "method": "notifications/initialized"}))

    def test_initialization_required(self):
        self.assertIn("error", self.request("tools/list"))
        self.initialize()
        self.assertEqual(len(self.request("tools/list")["result"]["tools"]), 2)

    def test_write_review_and_read_status_hints(self):
        self.assertFalse(mcp.TOOLS[0]["annotations"]["readOnlyHint"])
        self.assertTrue(mcp.TOOLS[1]["annotations"]["readOnlyHint"])

    def test_status_never_loads_provider(self):
        self.initialize()
        with patch.object(mcp.task, "status", return_value={"state": "not_found"}) as status:
            with patch.object(mcp.task, "load_adapter") as adapter:
                self.assertFalse(self.request("tools/call", {"name": "status", "arguments": {"task_id": "a"}})["result"]["isError"])
                adapter.assert_not_called()
                status.assert_called_once()

    def test_unknown_tool_and_extra_args_rejected(self):
        self.initialize()
        self.assertIn("error", self.request("tools/call", {"name": "terminal", "arguments": {}}))
        self.assertIn("error", self.request("tools/call", {"name": "status", "arguments": {"task_id": "a", "execute": True}}))

    def test_review_cannot_enable_execution_via_arguments(self):
        self.initialize()
        with patch.object(mcp.task, "execute", return_value={"state": "dry_run"}) as execute:
            self.server.adapter = object()
            self.request("tools/call", {"name": "review_text", "arguments": {"contract": {}}})
            self.assertFalse(execute.call_args.kwargs["perform"])

    def test_tool_error_is_protocol_success_with_is_error(self):
        self.initialize()
        with patch.object(mcp.task, "status", side_effect=ValueError("sensitive path")):
            reply = self.request("tools/call", {"name": "status", "arguments": {"task_id": "a"}})
            self.assertTrue(reply["result"]["isError"])
            self.assertNotIn("sensitive path", json.dumps(reply))

    def test_real_stdio_handshake_status_and_no_stdout_noise(self):
        messages = [
            {"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {"protocolVersion": mcp.PROTOCOL}},
            {"jsonrpc": "2.0", "method": "notifications/initialized"},
            {"jsonrpc": "2.0", "id": 2, "method": "tools/list"},
            {"jsonrpc": "2.0", "id": 3, "method": "tools/call", "params": {"name": "status", "arguments": {"task_id": "nonexistent-test-task"}}},
        ]
        proc = subprocess.run([sys.executable, str(Path(mcp.__file__)), "--repo", ".", "--store", "nonexistent-test-store"],
                              input="".join(json.dumps(x) + "\n" for x in messages).encode(), capture_output=True, timeout=10)
        self.assertEqual(proc.returncode, 0)
        self.assertEqual(proc.stderr, b"")
        replies = [json.loads(line) for line in proc.stdout.splitlines()]
        self.assertEqual([x["id"] for x in replies], [1, 2, 3])
        self.assertEqual(json.loads(replies[-1]["result"]["content"][0]["text"])["state"], "not_found")


if __name__ == "__main__":
    unittest.main()
