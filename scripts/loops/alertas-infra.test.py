"""Fallos de fuentes y entrega: nunca verde falso ni aviso perdido. Sin red."""
import os
from pathlib import Path
import subprocess
import tempfile
import time
import unittest


SCRIPTS = Path(__file__).parent


class AlertasTest(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix="onia-alertas-test-")
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.state = self.root / "estado"
        self.state.mkdir()
        self.logs = self.root / "logs"
        self.logs.mkdir()
        self.calls = self.root / "avisos"
        tg = self.root / "tg.sh"
        tg.write_text('#!/usr/bin/env bash\nprintf "%s|%s\\n" "${ONIA_TG_DIRECTO:-0}" "$1" >> "$AVISOS"\nexit "${FALLO_TG:-0}"\n')
        tg.chmod(0o700)
        self.lista = self.root / "loops.txt"
        self.env = dict(os.environ, ONIA_TG=str(tg), AVISOS=str(self.calls),
                        ONIA_LOOPS_REMOTOS=str(self.lista), ONIA_LOG_DIR=str(self.logs),
                        ONIA_VIGIA_ESTADO=str(self.state), ONIA_TG_DIRECTO="0")

    def run_script(self, name="vigia-loops-remotos.sh", **env):
        return subprocess.run(["bash", str(SCRIPTS / name)], env={**self.env, **env},
                              capture_output=True, text=True, timeout=10)

    def configure(self, ids):
        self.lista.write_text("".join(f"{i} 1\n" for i in ids))
        for loop_id in ids:
            (self.state / f"{loop_id}.alta").write_text(str(int(time.time()) - 3600))

    def alive(self, loop_id):
        stamp = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        (self.logs / f"onia-loop-{loop_id}.log").write_text(f"{stamp} ===== ARRANCA {loop_id} =====\n")

    def test_unavailable_board_never_reports_all_clear(self):
        result = self.run_script("parte-diario.sh", ONIA_TABLERO="/bin/false")
        self.assertNotEqual(result.returncode, 0)
        message = self.calls.read_text()
        self.assertNotIn("Todo en orden", message)
        self.assertIn("verificar", message)

    def test_outage_retries_until_delivery_then_deduplicates(self):
        self.configure(["uno", "dos"])
        for _ in range(2):
            self.assertNotEqual(self.run_script(FALLO_TG="1").returncode, 0)
            self.assertFalse((self.state / "_apagon").exists())
        self.assertEqual(self.run_script().returncode, 0)
        self.assertTrue((self.state / "_apagon").exists())
        sent = self.calls.read_text()
        self.assertEqual(sent.count("no da senales"), 3)
        self.assertTrue(sent.startswith("1|"))
        self.assertEqual(self.run_script().returncode, 0)
        self.assertEqual(sent, self.calls.read_text())

    def test_outage_recovery_is_not_acknowledged_when_delivery_fails(self):
        self.configure(["uno", "dos"])
        self.assertEqual(self.run_script().returncode, 0)
        self.alive("uno")
        self.assertNotEqual(self.run_script(FALLO_TG="1").returncode, 0)
        self.assertTrue((self.state / "_apagon").exists())
        self.assertTrue((self.state / "uno").exists())
        self.assertEqual(self.run_script().returncode, 0)
        self.assertFalse((self.state / "_apagon").exists())
        self.assertFalse((self.state / "uno").exists())

    def test_individual_incident_and_recovery_both_retry(self):
        self.configure(["uno", "dos"])
        self.alive("dos")
        self.assertNotEqual(self.run_script(FALLO_TG="1").returncode, 0)
        self.assertFalse((self.state / "uno").exists())
        self.assertEqual(self.run_script().returncode, 0)
        self.assertTrue((self.state / "uno").exists())
        self.alive("uno")
        self.assertNotEqual(self.run_script(FALLO_TG="1").returncode, 0)
        self.assertTrue((self.state / "uno").exists())
        self.assertEqual(self.run_script().returncode, 0)
        self.assertFalse((self.state / "uno").exists())


if __name__ == "__main__":
    unittest.main()
