#!/usr/bin/env python3
"""Calendar claims must fail closed until the router has a verified reader.

Run: python scripts/hermes_command_calendar.test.py
No providers, models or Telegram: events go to a temporary HERMES_HOME.
"""
import importlib.util
import json
import os
import pathlib
import sys
import tempfile
import unittest
import subprocess
from unittest.mock import patch

sys.dont_write_bytecode = True
_spec = importlib.util.spec_from_file_location(
    "hermes_command_center", pathlib.Path(__file__).with_name("hermes_command_center.py")
)
router = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(router)


class UnverifiedCalendarTest(unittest.TestCase):
    def setUp(self):
        self.home = tempfile.TemporaryDirectory(prefix="hermes-calendar-test-")
        self.addCleanup(self.home.cleanup)
        self.env = patch.dict(os.environ, {"HERMES_HOME": self.home.name})
        self.env.start()
        self.addCleanup(self.env.stop)
        self.network = patch(
            "socket.socket.connect", side_effect=AssertionError("No network in this test")
        )
        self.network.start()
        self.addCleanup(self.network.stop)

    def assert_unverified_availability(self, message):
        result = router.handle_telegram(message)
        self.assertTrue(result["ok"])
        self.assertEqual(result["action"], "sergio_availability")
        self.assertEqual(result["warning"], "calendar_unverified")
        self.assertIs(result["calendar_verified"], False)
        self.assertIn("Agenda no verificada", result["telegram_reply"])
        self.assertNotRegex(result["telegram_reply"], r"\bSI\b|hora libre|Dia libre")
        self.assertNotRegex(result["telegram_reply"], r"\d{1,2}:\d{2}")
        return result

    def test_1145_does_not_confirm_the_old_morning_window(self):
        self.assert_unverified_availability("Puedo reunirme martes 11:45?")

    def test_an_hour_cannot_establish_availability_on_unread_days(self):
        for day in ("lunes", "sabado", "domingo", "29/09", "hoy"):
            with self.subTest(day=day):
                self.assert_unverified_availability(f"Puedo reunirme {day} 15:45?")

    def test_missing_hour_does_not_offer_fixed_alternatives(self):
        self.assert_unverified_availability("Disponibilidad Sergio")

    def test_outside_old_windows_is_unknown_rather_than_a_calendar_result(self):
        self.assert_unverified_availability("Puedo reunirme jueves 18:00?")

    def test_plan_aliases_keep_priorities_without_a_timetable(self):
        for message in ("Plan Sergio hoy", "Agenda Sergio", "Calendario Sergio"):
            with self.subTest(message=message):
                result = router.handle_telegram(message)
                self.assertTrue(result["ok"])
                self.assertEqual(result["action"], "sergio_plan")
                self.assertIn("calendar_verified", result)
                self.assertIs(result["calendar_verified"], False)
                reply = result["telegram_reply"]
                self.assertIn("Agenda no verificada", reply)
                self.assertIn("Prioridades", reply)
                self.assertIn("Platform", reply)
                self.assertIn("Clientes", reply)
                self.assertIn("Marca personal", reply)
                self.assertIn("colegio", reply)
                self.assertIn("descanso", reply)
                self.assertNotRegex(reply, r"\d{1,2}:\d{2}|Reuniones permitidas|Dia libre")

    def test_a_configured_or_failed_create_endpoint_is_not_a_calendar_read(self):
        with patch.object(router, "AGENDAR_CREATE_URL", "https://calendar.invalid/create"):
            with patch.object(
                router.urllib.request, "urlopen", side_effect=TimeoutError("provider unavailable")
            ) as creation_request:
                self.assert_unverified_availability("Puedo reunirme martes 11:45?")
                plan = router.handle_telegram("Plan Sergio hoy")
                self.assertIn("Agenda no verificada", plan["telegram_reply"])
                self.assertNotIn("Dia libre", plan["telegram_reply"])
                creation_request.assert_not_called()

    def test_help_still_routes_without_calendar_configuration(self):
        result = router.handle_telegram("ayuda hermes")
        self.assertTrue(result["ok"])
        self.assertIn("Plan Sergio hoy", result["telegram_reply"])

    def test_personal_mode_is_preserved(self):
        result = router.handle_telegram("Modo gym")
        self.assertTrue(result["ok"])
        self.assertEqual(result["action"], "sergio_mode_gym")

    def test_real_cli_keeps_an_unverified_reply_renderable(self):
        process = subprocess.run(
            [sys.executable, "-B", str(pathlib.Path(router.__file__)),
             "telegram", "--message", "Puedo reunirme martes 11:45?"],
            capture_output=True, text=True, encoding="utf-8", timeout=10,
            env={**os.environ, "PYTHONIOENCODING": "utf-8"},
        )
        self.assertEqual(process.returncode, 0, process.stderr)
        result = json.loads(process.stdout)
        self.assertIs(result["calendar_verified"], False)
        self.assertIn("Agenda no verificada", result["telegram_reply"])


if __name__ == "__main__":
    unittest.main(verbosity=2)
