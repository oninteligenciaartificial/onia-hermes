"""Synthetic contract tests: zero network and zero model/provider calls."""

import socket
import unittest
from unittest.mock import patch

from hermes_api_preflight import Candidate, FakeOneAttemptGuard, PROMPT, RealCallBlocked, real_hermes_call


class HermesApiPreflightTests(unittest.TestCase):
    def test_candidate_is_public_and_has_no_tool_schemas(self):
        candidate = Candidate()
        payload = candidate.synthetic_payload()
        self.assertEqual(candidate.source_sha, "7166071fca")
        self.assertEqual(candidate.enabled_toolsets, ())
        self.assertEqual(payload["tools"], [])
        self.assertEqual(payload["prompt"], PROMPT)
        self.assertEqual(candidate.max_iterations, 1)
        self.assertEqual(candidate.run_budget_seconds, 45)

    def test_real_path_blocks_before_any_socket_attempt(self):
        with patch.object(socket, "create_connection", side_effect=AssertionError("network attempted")) as network:
            with self.assertRaisesRegex(RealCallBlocked, "upstream retries and fallbacks"):
                real_hermes_call(Candidate())
        network.assert_not_called()

    def test_fake_retry_is_stopped_at_second_local_attempt(self):
        calls = []

        def fake_send(payload):
            calls.append(payload)
            raise OSError("synthetic first-attempt error")

        guard = FakeOneAttemptGuard(fake_send)
        with self.assertRaises(OSError):
            guard.send(Candidate().synthetic_payload())
        with self.assertRaisesRegex(RealCallBlocked, "second synthetic"):
            guard.send(Candidate().synthetic_payload())
        self.assertEqual(guard.attempts, 1)
        self.assertEqual(len(calls), 1)

    def test_fake_guard_rejects_tool_payload_before_send(self):
        calls = []
        guard = FakeOneAttemptGuard(lambda payload: calls.append(payload) or {})
        payload = dict(Candidate().synthetic_payload())
        payload["tools"] = [{"type": "function"}]
        with self.assertRaisesRegex(RealCallBlocked, "unreviewed"):
            guard.send(payload)
        self.assertEqual(guard.attempts, 0)
        self.assertEqual(calls, [])


if __name__ == "__main__":
    unittest.main()
