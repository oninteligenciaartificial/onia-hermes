"""Wrapper exit contract only. Fake Python; never execute the diagnostic."""
from pathlib import Path
import shutil
import subprocess
import unittest

BASE = Path(__file__).parent
WRAPPER = BASE / 'evidence/r4-recovery-20261015/trust-diagnostic-setup.sh'
GIT_BASH = Path('C:/Program Files/Git/bin/bash.exe')
BASH = str(GIT_BASH) if GIT_BASH.is_file() else shutil.which('bash')
MARKER = 'DIAGNOSTIC_EXPECTED_EXIT_42'


@unittest.skipUnless(BASH, 'Existing Bash unavailable; no installation attempted')
class WrapperTests(unittest.TestCase):
    def run_fake(self, body):
        # Function shadows python3 even if installed. No Python payload or APT runs.
        command = 'python3() { ' + body + '; }; . "$1"'
        return subprocess.run([BASH, '-c', command, 'wrapper-test', WRAPPER.as_posix()],
                              capture_output=True, text=True, timeout=5)

    def test_success_has_json_marker_and_expected_42(self):
        result = self.run_fake("printf '%s\\n' '{\"status\":\"FAKE_OK\"}'; return 0")
        self.assertEqual(42, result.returncode)
        self.assertEqual(['{"status":"FAKE_OK"}', MARKER], result.stdout.splitlines())

    def test_python_failure_preserves_exit_and_omits_marker(self):
        result = self.run_fake('return 7')
        self.assertEqual(7, result.returncode)
        self.assertEqual('', result.stdout)
        self.assertNotIn(MARKER, result.stdout)

    def test_shell_syntax_and_embedded_source(self):
        result = subprocess.run([BASH, '-n', WRAPPER.as_posix()], capture_output=True, timeout=5)
        self.assertEqual(0, result.returncode)
        embedded = WRAPPER.read_text(encoding='utf-8').split("<<'ONIA_TRUST_DIAGNOSTIC_PY'\n", 1)[1].split('\nONIA_TRUST_DIAGNOSTIC_PY\n', 1)[0]
        self.assertEqual((BASE / 'apt_trust_diagnostic.py').read_text(encoding='utf-8'), embedded)


if __name__ == '__main__':
    unittest.main()
