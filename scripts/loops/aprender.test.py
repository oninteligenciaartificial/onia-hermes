"""La puerta de entrada de la memoria compartida: qué es un hecho y qué no.

Nace del 2026-09-26. MEMORY.md llegó a 65.449/65.536 bytes y se CONGELÓ: desde el
24-sep toda lección nueva se desvía a archivo-aprendizajes, que ningún prompt
inyecta. Al contar qué ocupaba el contexto activo aparecieron 9 bloques (2.709
bytes, 4% del archivo) que son la NOTA DE MÉTODO de un carril sobre sí mismo —
"[recorrido-cliente] ninguna nueva — el método de comparar BUILD_ID siguió
funcionando", "[chatbot-cola] dos vueltas seguidas midiendo lo mismo"—, y cinco de
esas nueve repetían, con otras palabras y minutos después, un hecho que el MISMO
carril ya había dejado completo (así esquivan el dedup por hash del consolidador).

Los prompts de loop ya lo prohibían por escrito —"Qué NO va: ... nada que sea solo
de tu carril"— y la plantilla de cierre de vuelta pide una línea `LECCIÓN:` en la
SALIDA. Lo que faltaba era que la puerta lo dijera: sin rechazo, la regla vive sólo
en el prompt y el que la desobedece no se entera.
"""
import os
from pathlib import Path
import subprocess
import tempfile
import unittest


SCRIPT = Path(__file__).with_name("aprender.sh")

HECHO = ("El contenedor onia-platform corre con TZ vacio: todo toLocaleDateString "
         "del lado servidor sale 4 h adelantado. Medido el 2026-09-26.")


class AprenderTest(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix="onia-aprender-test-")
        self.addCleanup(self.temp.cleanup)
        self.inbox = Path(self.temp.name) / "inbox"
        self.env = dict(os.environ, ONIA_MEMORIA_INBOX=str(self.inbox),
                        ONIA_LOOP_ID="prueba")

    def run_script(self, hecho):
        return subprocess.run(["bash", str(SCRIPT), hecho], env=self.env,
                              capture_output=True, text=True, timeout=20)

    def encolados(self):
        return sorted(p.read_text(encoding="utf-8") for p in self.inbox.glob("*.md"))

    def test_un_hecho_de_otro_carril_entra(self):
        result = self.run_script(HECHO)
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(len(self.encolados()), 1)
        self.assertIn("— aprendido por prueba,", self.encolados()[0])

    def test_la_nota_de_metodo_de_un_carril_se_rechaza(self):
        """Lo que empieza con [carril] es la LECCIÓN de su vuelta, no un hecho compartido."""
        nota = ("[recorrido-cliente] comparar BUILD_ID contra la entrada anterior ANTES "
                "de correr dental, no después — la vuelta anterior ya lo decía.")
        result = self.run_script(nota)
        self.assertEqual(result.returncode, 2, result.stdout)
        self.assertEqual(self.encolados(), [],
                         "la nota quedó encolada: el consolidador la va a meter igual")

    def test_el_rechazo_dice_donde_va_esa_linea(self):
        """Un rechazo que no enseña el camino correcto se reintenta igual."""
        result = self.run_script("[web-venta] cambié de método y esta vez sí midió algo real.")
        self.assertEqual(result.returncode, 2)
        mensaje = result.stdout + result.stderr
        self.assertIn("LECCIÓN", mensaje)
        self.assertIn("otro carril", mensaje)

    def test_una_nota_sin_corchetes_no_se_confunde_con_la_clase(self):
        """El rechazo es por la marca de carril al inicio, no por hablar de método."""
        result = self.run_script(
            "Cambiar de método sirvió: contar el embudo en la base encontró el estado en "
            "cero que re-correr el simulador no veía. Medido el 2026-09-24 en onia_center.")
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(len(self.encolados()), 1)

    def test_los_guardas_de_largo_siguen_en_pie(self):
        for hecho, motivo in (("una frase suelta", "corto"), ("x" * 1201, "largo")):
            with self.subTest(motivo=motivo):
                result = self.run_script(hecho)
                self.assertEqual(result.returncode, 2)
                self.assertIn(motivo, result.stderr)
        self.assertEqual(self.encolados(), [])


if __name__ == "__main__":
    unittest.main(verbosity=2)
