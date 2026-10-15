import json
import io
import tempfile
import subprocess
import unittest
from pathlib import Path
from unittest.mock import patch

import claude_adapter as adapter


def provider_json(*, result="ok", model=adapter.MODEL, **extra):
    obj = {
        "type": "result",
        "subtype": "success",
        "is_error": False,
        "result": result,
        "modelUsage": {model: {"inputTokens": 3, "outputTokens": 4}},
        "usage": {
            "input_tokens": 3,
            "output_tokens": 4,
            "cache_creation_input_tokens": 5,
            "cache_read_input_tokens": 6,
            "server_tool_use": {"web_search_requests": 0, "web_fetch_requests": 0},
        },
        "total_cost_usd": 0.0123,
    }
    obj.update(extra)
    return json.dumps(obj).encode()


class FakeProcess:
    def __init__(self, stdout=b"", stderr=b"", returncode=0):
        self.stdout = stdout
        self.stderr = stderr
        self.returncode = returncode
        self.command = None
        self.kwargs = None
        self.input = None

    def communicate(self, input=None, timeout=None):
        self.input = input
        return self.stdout, self.stderr

    def kill(self):
        pass


class AdapterTests(unittest.TestCase):
    def test_subscription_child_environment_excludes_provider_and_api_overrides(self):
        with patch.dict(adapter.os.environ, {"ANTHROPIC_API_KEY": "fake", "ANTHROPIC_BASE_URL": "fake", "CLAUDE_CODE_OAUTH_TOKEN": "fake", "CLAUDE_CODE_USE_BEDROCK": "1", "OPENAI_API_KEY": "fake", "HOME": "/safe-home"}, clear=False):
            env = adapter.subscription_environment()
        self.assertEqual(env["HOME"], "/safe-home")
        self.assertEqual(env["DISABLE_AUTOUPDATER"], "1")
        for key in ["ANTHROPIC_API_KEY", "ANTHROPIC_BASE_URL", "CLAUDE_CODE_OAUTH_TOKEN", "CLAUDE_CODE_USE_BEDROCK", "OPENAI_API_KEY"]:
            self.assertNotIn(key, env)

    def invoke(self, proc, prompt=b"review this input"):
        def popen(command, **kwargs):
            proc.command = command
            proc.kwargs = kwargs
            return proc

        with patch.object(adapter.os, "name", "nt"):
            return adapter.run_once(prompt, executable=r"C:\Users\test\npm\claude.cmd", timeout_seconds=45, popen=popen)

    def test_success_passes_prompt_only_on_stdin_and_fixed_safety_flags(self):
        proc = FakeProcess(provider_json(result="reviewed"))
        result = self.invoke(proc, b"review this input")
        self.assertEqual(result["state"], "ok")
        self.assertEqual(result["response"], "reviewed")
        self.assertEqual(result["model"], adapter.MODEL)
        self.assertEqual(result["usage"]["input_tokens"], 3)
        self.assertEqual(result["usage"]["cache_read_input_tokens"], 6)
        self.assertEqual(result["cost_estimate_usd"], 0.0123)
        self.assertEqual(proc.input, b"review this input")
        self.assertNotIn("review this input", " ".join(proc.command))
        self.assertFalse(proc.kwargs["shell"])
        self.assertIn("--safe-mode", proc.command[-1])
        self.assertIn("--restricted", proc.command[-1])
        self.assertIn("--strict-mcp-config", proc.command[-1])
        self.assertIn("--no-session-persistence", proc.command[-1])
        self.assertEqual(proc.kwargs["env"]["DISABLE_AUTOUPDATER"], "1")

    def test_auth_expired_is_sanitized(self):
        proc = FakeProcess(b'{"result":"Failed to authenticate: OAuth session expired"}', returncode=1)
        result = self.invoke(proc)
        self.assertEqual(result["error"], "auth_expired")
        self.assertIsNone(result["response"])

    def test_timeout_does_not_retry(self):
        proc = FakeProcess()

        def popen(*args, **kwargs):
            def timeout(*, input=None, timeout=None):
                raise subprocess.TimeoutExpired("claude", timeout)
            proc.communicate = timeout
            return proc

        result = adapter.run_once(b"x", executable="claude", timeout_seconds=1, popen=popen)
        self.assertEqual(result["error"], "timeout")
        self.assertIsNone(result["response"])

    def test_invalid_json_is_sanitized(self):
        result = self.invoke(FakeProcess(b"not json", b"private local diagnostic"))
        self.assertEqual(result["error"], "invalid_json")
        self.assertNotIn("private", json.dumps(result))

    def test_tool_attempt_is_denied_and_not_echoed(self):
        result = self.invoke(FakeProcess(provider_json(permission_denials=[{"tool_name": "Bash", "message": "sensitive"}])))
        self.assertEqual(result["error"], "tool_attempt_blocked")
        self.assertNotIn("Bash", json.dumps(result))
        self.assertNotIn("sensitive", json.dumps(result))

    def test_wrong_model_is_rejected(self):
        result = self.invoke(FakeProcess(provider_json(model="claude-opus-4-1")))
        self.assertEqual(result["error"], "model_mismatch")
        self.assertEqual(result["model"], "claude-opus-4-1")
        self.assertIsNone(result["response"])

    def test_missing_model_evidence_fails_closed(self):
        obj = json.loads(provider_json())
        del obj["modelUsage"]
        result = self.invoke(FakeProcess(json.dumps(obj).encode()))
        self.assertEqual(result["error"], "model_mismatch")
        self.assertIsNone(result["response"])

    def test_missing_cache_and_cost_fields_remain_unknown(self):
        obj = json.loads(provider_json())
        obj["usage"] = {"input_tokens": 3, "output_tokens": 4}
        del obj["total_cost_usd"]
        result = self.invoke(FakeProcess(json.dumps(obj).encode()))
        self.assertEqual(result["state"], "ok")
        self.assertIsNone(result["usage"]["cache_creation_input_tokens"])
        self.assertIsNone(result["usage"]["cache_read_input_tokens"])
        self.assertIsNone(result["usage"]["server_tool_use"])
        self.assertIsNone(result["cost_estimate_usd"])

    def test_non_success_semantics_fail_closed(self):
        obj = json.loads(provider_json())
        obj["subtype"] = "error_max_turns"
        result = self.invoke(FakeProcess(json.dumps(obj).encode()))
        self.assertEqual(result["error"], "invalid_schema")
        self.assertIsNone(result["response"])

    def test_invalid_schema_is_rejected(self):
        result = self.invoke(FakeProcess(b'{"result":42}'))
        self.assertEqual(result["error"], "invalid_schema")

    def test_receipt_hash_is_stable_for_payload(self):
        payload = adapter.base_receipt("dry_run", None, b"input")
        first = adapter.receipt(payload)
        second = adapter.receipt(payload)
        self.assertEqual(first["receipt_sha256"], second["receipt_sha256"])
        self.assertEqual(first["input_sha256"], adapter.sha256(b"input"))

    def test_emit_uses_utf8_buffer_even_when_text_encoding_is_cp1252(self):
        raw = io.BytesIO()
        stream = io.TextIOWrapper(raw, encoding="cp1252")
        with patch.object(adapter.sys, "stdout", stream):
            adapter.emit({"state": "ok", "response": "≤"})
        self.assertIn("≤", raw.getvalue().decode("utf-8"))

    def test_existing_receipt_prevents_provider_call(self):
        with tempfile.TemporaryDirectory() as folder:
            target = Path(folder) / "existing.json"
            target.write_text("owned by prior run", encoding="utf-8")

            class Input:
                buffer = io.BytesIO(b"prompt")

            with patch.object(adapter.sys, "stdin", Input()), patch.object(adapter.sys, "stdout", io.StringIO()), patch.object(adapter, "run_once") as run:
                code = adapter.main(["--execute", "--receipt", str(target)])
            self.assertEqual(code, 2)
            self.assertEqual(target.read_text(encoding="utf-8"), "owned by prior run")
            run.assert_not_called()


if __name__ == "__main__":
    unittest.main()
