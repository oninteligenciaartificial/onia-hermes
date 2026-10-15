"""Independent offline consent-boundary check for the native Telegram launcher."""
import asyncio
import unittest
from unittest.mock import patch

import test_native_trusted_launcher as fixture_module


class LauncherSenderQA(unittest.TestCase):
    def setUp(self):
        self.fixture = fixture_module.NativeTrustedLauncherTests(methodName="runTest")
        self.fixture.setUp()
        self.addCleanup(self.fixture.doCleanups)

    def test_stop_expired_lease_and_reviewed_purpose_before_send(self):
        fixture = self.fixture
        runtime = fixture.install()
        fixture.connect_fixture()
        with patch("native_trusted_runtime.importlib.import_module",
                   return_value=fixture.adapter_module):
            with fixture.queue._connection() as conn:
                conn.execute("UPDATE controller_guard_state SET stopped=1,epoch=epoch+1")
            stopped = asyncio.run(runtime.send_approval_prompt(
                actor_id="42", private_chat_id="42", now=200, ttl=30))
            self.assertEqual(stopped["code"], "approval_preflight_failed")
            self.assertEqual(fixture.adapter._bot.calls, [])
            with fixture.queue._connection() as conn:
                conn.execute("UPDATE controller_guard_state SET stopped=0,epoch=epoch+1")
            expired = asyncio.run(runtime.send_approval_prompt(
                actor_id="42", private_chat_id="42", now=500, ttl=30))
            self.assertEqual(expired["code"], "approval_preflight_failed")
            self.assertEqual(fixture.adapter._bot.calls, [])
            accepted = asyncio.run(runtime.send_approval_prompt(
                actor_id="42", private_chat_id="42", now=200, ttl=30))
        self.assertEqual(accepted["state"], "awaiting_telegram_approval")
        self.assertEqual(len(fixture.adapter._bot.calls), 1)
        text = fixture.adapter._bot.calls[0]["text"]
        self.assertIn("Offline reviewed prompt", text)
        self.assertIn("Propósito revisado", text)
        self.assertIn("1 envío", text)
        self.assertIn("2/2 eventos de estado", text)
        self.assertIn("1/1 evento de resultado", text)
        self.assertNotIn("fixture-claim", text)


if __name__ == "__main__":
    unittest.main()
