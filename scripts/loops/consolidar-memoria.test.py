"""Integración Linux: memoria acotada, conservación y concurrencia sin VPS ni LLM."""
import os
from pathlib import Path
import subprocess
import tempfile
import unittest


SCRIPT = Path(__file__).with_name("consolidar-memoria.sh")


class MemoriaTest(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix="onia-memoria-test-")
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.mem = self.root / "MEMORY.md"
        self.inbox = self.root / "inbox"
        self.inbox.mkdir()
        self.archive = self.root / "archivo-aprendizajes"
        self.original = "# Reglas permanentes\nNunca exponer secretos ni cambiar precios sin aprobación.\n"
        self.mem.write_text(self.original, encoding="utf-8")
        self.env = dict(os.environ, ONIA_MEMORIA=str(self.mem),
                        ONIA_MEMORIA_INBOX=str(self.inbox),
                        ONIA_MEMORIA_ARCHIVO=str(self.archive),
                        ONIA_MEMORIA_LOCK=str(self.root / "memoria.lock"),
                        ONIA_MEMORIA_MAX_BYTES="1024",
                        ONIA_MEM_AVISO=str(self.root / "aviso"), ONIA_TG="/bin/false")

    def fact(self, name, text):
        body = text + "\n— aprendido por prueba, 2026-09-21 16:00 La Paz\n"
        path = self.inbox / (name + ".md")
        path.write_text(body, encoding="utf-8")
        return body

    def run_script(self, **overrides):
        return subprocess.run(["bash", str(SCRIPT)], env={**self.env, **overrides},
                              capture_output=True, text=True, timeout=20)

    def saved(self):
        return self.mem.read_text(encoding="utf-8") + "".join(
            p.read_text(encoding="utf-8") for p in self.archive.glob("*.md"))

    def recorder(self):
        """ONIA_TG de prueba que ANOTA el aviso, para poder afirmar sobre él.

        Hasta el 2026-09-26 todos los casos apuntaban ONIA_TG a /bin/false, así que
        ninguno podía ver si el aviso salía. El desvío por falta de lugar estaba
        cubierto de sobra; avisarlo no lo miraba nadie, y por ahí se colaron 278
        lecciones desviadas en silencio.
        """
        avisos = self.root / "avisos.txt"
        tg = self.root / "tg.sh"
        tg.write_text(
            '#!/usr/bin/env bash\nprintf "%s\\n" "$1" >> {}\n'.format(
                subprocess.list2cmdline([str(avisos)])),
            encoding="utf-8")
        tg.chmod(0o755)
        return str(tg), avisos

    def saturate(self, headroom=60, entries=2):
        """MEMORY.md casi llena con POCAS entradas: el estado real del VPS el 2026-09-26.

        Ahí eran 65.449 de 65.536 bytes (87 de headroom) con N=116 entradas. La
        saturación se mide en bytes y CONGELA la cuenta de entradas, así que el eje
        que hay que mirar es el desvío, no N.
        """
        cuerpo = self.original + "".join(
            f"§\nRegla vigente {i} medida con su causa.\n" for i in range(entries))
        relleno = 1024 - headroom - len(cuerpo.encode())
        self.assertGreater(relleno, 0, "el fixture no llegó a saturar")
        self.mem.write_bytes(cuerpo.encode() + b"x" * relleno)

    def test_saturada_avisa_aunque_la_cuenta_de_entradas_este_congelada(self):
        tg, avisos = self.recorder()
        self.saturate()
        self.fact("a", "Hallazgo medido con su causa y su evidencia, que ya no entra.")
        result = self.run_script(ONIA_TG=tg)
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(len(list(self.archive.glob("*.md"))), 1,
                         "la lección tenía que desviarse por falta de lugar")
        self.assertTrue(avisos.exists(),
                        "memoria saturada, lección desviada y NINGÚN aviso salió")

    def test_el_aviso_de_saturacion_sale_marcado_como_problema(self):
        """onia-tg.sh clasifica por la primera línea y sólo abre tarea si parece un problema.

        El aviso viejo empezaba con "🧠 <b>Memoria</b>:" y salió INFORMATIVO las dos
        veces que se disparó (log del 11-sep): ni cuando hablaba llegaba a nadie.
        """
        tg, avisos = self.recorder()
        self.saturate()
        self.fact("a", "Hallazgo medido con su causa y su evidencia, que ya no entra.")
        self.assertEqual(self.run_script(ONIA_TG=tg).returncode, 0)
        self.assertTrue(avisos.exists(), "no salió ningún aviso que clasificar")
        primera = avisos.read_text(encoding="utf-8").splitlines()[0]
        self.assertRegex(primera, "⚠️|🔴",
                         "sin marca de problema el enrutador lo archiva como INFORMATIVO")

    def test_el_aviso_no_se_repite_mientras_no_empeore(self):
        """Sergio Urcullo, 2026-09-05: "ordena telegram, me llenan de mensajes innecesarios"."""
        tg, avisos = self.recorder()
        self.saturate()
        self.fact("a", "Primer hallazgo medido con causa y evidencia, que ya no entra.")
        self.assertEqual(self.run_script(ONIA_TG=tg).returncode, 0)
        self.fact("b", "Segundo hallazgo medido con causa y evidencia, que tampoco entra.")
        self.assertEqual(self.run_script(ONIA_TG=tg).returncode, 0)
        self.assertEqual(len(list(self.archive.glob("*.md"))), 2)
        self.assertEqual(len(avisos.read_text(encoding="utf-8").strip().splitlines()), 1,
                         "una saturación estable avisa UNA vez, no en cada vuelta")

    def test_sin_saturacion_no_hay_aviso(self):
        """El recíproco: si la lección entra, el aviso no existe."""
        tg, avisos = self.recorder()
        self.fact("a", "Hallazgo medido con su causa y su evidencia, que entra de sobra.")
        self.assertEqual(self.run_script(ONIA_TG=tg).returncode, 0)
        self.assertEqual(self.saved().count("que entra de sobra"), 1)
        self.assertEqual(len(list(self.archive.glob("*.md"))), 0)
        self.assertFalse(avisos.exists(), "avisó sin que nada se haya desviado")

    def test_overflow_is_bounded_and_keeps_every_fact(self):
        facts = [self.fact(f"{i:02}", f"Lección {i}: " + "á🧠" * 90) for i in range(12)]
        result = self.run_script()
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertLessEqual(self.mem.stat().st_size, 1024)
        self.assertTrue(self.mem.read_text().startswith(self.original))
        self.assertIn("archivo-aprendizajes", self.mem.read_text())
        for fact in facts:
            self.assertEqual(self.saved().count(fact), 1)
        self.assertEqual(len(list(self.inbox.glob("*.md"))), 0)

    def test_archived_duplicate_stays_unique_across_runs(self):
        body = self.fact("a", "Hecho medido con su causa: " + "x" * 1150)
        self.assertEqual(self.run_script().returncode, 0)
        self.fact("b", "Hecho medido con su causa: " + "x" * 1150)
        self.assertEqual(self.run_script().returncode, 0)
        self.assertEqual(self.saved().count(body), 1)
        self.assertEqual(len(list(self.archive.glob("*.md"))), 1)

    def test_active_duplicate_and_decimal_correction(self):
        self.fact("a", "El proveedor cobra 1,5 créditos por cada recurso generado, medido hoy.")
        self.assertEqual(self.run_script().returncode, 0)
        self.fact("b", "El proveedor cobra 1,5 créditos por cada recurso generado, medido hoy.")
        self.fact("c", "El proveedor cobra 15 créditos por cada recurso generado, medido hoy.")
        self.assertEqual(self.run_script().returncode, 0)
        self.assertEqual(self.saved().count("cobra 1,5"), 1)
        self.assertEqual(self.saved().count("cobra 15"), 1)

    def test_existing_over_limit_is_preserved_and_new_facts_archived(self):
        before = (self.original + "REGLA que se conserva.\n" * 80).encode()
        self.mem.write_bytes(before)
        body = self.fact("a", "Nuevo aprendizaje con evidencia que no debe hacer crecer la memoria.")
        result = self.run_script()
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(self.mem.read_bytes(), before)
        self.assertIn("supera", result.stdout + result.stderr)
        self.assertEqual(self.saved().count(body), 1)

    def test_missing_final_newline_and_empty_memory(self):
        for initial in (self.original.rstrip(), ""):
            with self.subTest(initial=initial):
                self.mem.write_text(initial)
                self.fact("a", "Un hecho concreto con más de cuarenta caracteres y su causa medida.")
                self.assertEqual(self.run_script().returncode, 0)
                self.fact("b", "Un hecho concreto con más de cuarenta caracteres y su causa medida.")
                self.assertEqual(self.run_script().returncode, 0)
                self.assertEqual(self.mem.read_text().count("Un hecho concreto"), 1)

    def test_archive_failure_does_not_acknowledge_inbox(self):
        self.archive.write_text("esto no es un directorio")
        self.fact("a", "Aprendizaje que desborda: " + "x" * 1150)
        result = self.run_script()
        self.assertNotEqual(result.returncode, 0)
        self.assertTrue((self.inbox / "a.md").exists())
        self.assertTrue(self.mem.read_text().startswith(self.original))

    def test_invalid_limit_does_not_consume_inbox(self):
        self.fact("a", "Una regla con evidencia medida que debe conservarse en caso de error.")
        result = self.run_script(ONIA_MEMORIA_MAX_BYTES="sin-limite")
        self.assertNotEqual(result.returncode, 0)
        self.assertTrue((self.inbox / "a.md").exists())
        self.assertEqual(self.mem.read_text(), self.original)

    def test_two_consolidators_do_not_lose_or_duplicate_facts(self):
        facts = [self.fact(f"{i:02}", f"Hallazgo {i}: " + "dato medido " * 18) for i in range(20)]
        commands = [subprocess.Popen(["bash", str(SCRIPT)], env=self.env,
                                    stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
                    for _ in range(2)]
        for process in commands:
            out, err = process.communicate(timeout=30)
            self.assertEqual(process.returncode, 0, out + err)
        self.assertLessEqual(self.mem.stat().st_size, 1024)
        for fact in facts:
            self.assertEqual(self.saved().count(fact), 1)

    def test_default_limit_is_64_kib(self):
        self.mem.write_text(self.original + "x" * (65536 - len(self.original.encode()) - 100))
        body = self.fact("a", "Aprendizaje medido: " + "x" * 500)
        env = dict(self.env)
        env.pop("ONIA_MEMORIA_MAX_BYTES")
        result = subprocess.run(["bash", str(SCRIPT)], env=env, capture_output=True,
                                text=True, timeout=20)
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertLessEqual(self.mem.stat().st_size, 65536)
        self.assertEqual(self.saved().count(body), 1)

    def test_empty_legacy_blocks_do_not_block_new_facts(self):
        for empty in ("", "— aprendido por antiguo, fecha"):
            with self.subTest(empty=empty):
                self.mem.write_text(self.original + f"§\n{empty}\n§\nOtro bloque conservado\n")
                body = self.fact("a", "Hallazgo útil con causa y evidencia que debe superar bloques vacíos.")
                result = self.run_script()
                self.assertEqual(result.returncode, 0, result.stderr)
                self.assertEqual(self.saved().count(body), 1)

    def test_signature_only_inbox_is_preserved_as_error(self):
        bad = self.inbox / "a.md"
        bad.write_text("— aprendido por prueba, sin hecho\n")
        result = self.run_script()
        self.assertNotEqual(result.returncode, 0)
        self.assertTrue(bad.exists())
        self.assertIn("sin hecho", result.stderr)

    def test_archive_is_private_and_supports_spaces(self):
        archive = self.root / "archivo con espacios"
        body = self.fact("a", "Hecho medido con causa: " + "x" * 1150)
        result = self.run_script(ONIA_MEMORIA_ARCHIVO=str(archive))
        self.assertEqual(result.returncode, 0, result.stderr)
        files = list(archive.glob("*.md"))
        self.assertEqual(len(files), 1)
        self.assertEqual(files[0].read_text(), body)
        self.assertEqual(files[0].stat().st_mode & 0o777, 0o600)


if __name__ == "__main__":
    unittest.main()
