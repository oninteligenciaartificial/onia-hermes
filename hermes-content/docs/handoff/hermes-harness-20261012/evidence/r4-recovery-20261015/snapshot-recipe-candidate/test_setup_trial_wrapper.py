"""Setup-only wrapper deltas. No real recipe, APT, browser or Cloud execution."""
import base64
import contextlib
import hashlib
import io
import json
import os
from pathlib import Path
import subprocess
import sys
import unittest
from unittest.mock import patch
from types import SimpleNamespace

from build_setup_trial_wrapper import build_wrapper

BASE = Path(__file__).parent


def fake_posix_os():
    values = {key: getattr(os, key) for key in dir(os)}
    values.update(name='posix', getuid=lambda: 0, O_NOFOLLOW=0)
    return SimpleNamespace(**values)


def bootstrap(wrapper):
    return wrapper.split("<<'ONIA_SETUP_TRIAL_BOOTSTRAP'\n", 1)[1].split('\nONIA_SETUP_TRIAL_BOOTSTRAP\n', 1)[0]


class SetupTrialWrapperTests(unittest.TestCase):
    def payload(self, approved=False):
        manifest = json.loads((BASE / 'reviewed-install-manifest-candidate.json').read_bytes())
        if approved:
            # Synthetic approval in memory is test input only; no artifact changed.
            manifest.update(state='APPROVED_FOR_SETUP_ONLY', downloads_and_install_approved=True,
                            human_approval_reference='user:synthetic-setup-only-test',
                            operation_authorization_reference='user:synthetic-setup-only-test')
        return bootstrap(build_wrapper((BASE / 'setup_recipe.py').read_bytes(), json.dumps(manifest).encode()))

    def test_pending_blocks_before_staging_or_subprocess(self):
        out = io.StringIO()
        with patch('tempfile.TemporaryDirectory', side_effect=AssertionError('write')), patch('subprocess.run', side_effect=AssertionError('execute')), contextlib.redirect_stdout(out), self.assertRaises(SystemExit) as stopped:
            exec(compile(self.payload(), 'wrapper-bootstrap', 'exec'), {})
        self.assertEqual(1, stopped.exception.code)
        self.assertEqual('approval', json.loads(out.getvalue())['phase'])

    def test_recipe_failure_has_no_completion_marker_and_preserves_error(self):
        source = self.payload(approved=True)
        out = io.StringIO()
        result = SimpleNamespace(returncode=7, stdout=b'{"state":"BLOCKED","phase":"apt_candidate_resolution","reason":"synthetic test only"}\n')
        with patch.dict(sys.modules, {'os': fake_posix_os()}), patch('subprocess.run', return_value=result) as fake, contextlib.redirect_stdout(out), self.assertRaises(SystemExit) as stopped:
            exec(compile(source, 'wrapper-bootstrap', 'exec'), {})
        self.assertEqual(7, stopped.exception.code)
        self.assertEqual('/usr/bin/python3', fake.call_args.args[0][0])
        self.assertNotIn('ONIA_SETUP_TRIAL_COMPLETED', out.getvalue())
        self.assertIn('apt_candidate_resolution', out.getvalue())

    def test_zero_exit_without_actual_receipt_is_not_success(self):
        source = self.payload(approved=True)
        out = io.StringIO()
        with patch.dict(sys.modules, {'os': fake_posix_os()}), patch('subprocess.run', return_value=SimpleNamespace(returncode=0, stdout=b'')), contextlib.redirect_stdout(out), self.assertRaises(SystemExit) as stopped:
            exec(compile(source, 'wrapper-bootstrap', 'exec'), {})
        self.assertEqual(1, stopped.exception.code)
        self.assertEqual('receipt', json.loads(out.getvalue())['phase'])

    def test_rendered_payload_exact_and_shell_syntax(self):
        wrapper = (BASE / 'setup-trial-wrapper.sh').read_text()
        self.assertIn('set -e\n', wrapper)
        scope = {}
        # Inspect exact literal payload without executing bootstrap.
        prefix = bootstrap(wrapper).split('manifest = json.loads(MANIFEST)', 1)[0]
        exec(compile(prefix, 'wrapper-payload-literals', 'exec'), scope)
        self.assertEqual((BASE / 'setup_recipe.py').read_bytes(), scope['RECIPE'])
        self.assertEqual((BASE / 'reviewed-install-manifest-candidate.json').read_bytes(), scope['MANIFEST'])
        self.assertEqual(hashlib.sha256(scope['RECIPE']).hexdigest(), scope['EXPECTED_RECIPE'])
        bash = Path('C:/Program Files/Git/bin/bash.exe')
        if bash.is_file():
            self.assertEqual(0, subprocess.run([str(bash), '-n', (BASE / 'setup-trial-wrapper.sh').as_posix()], capture_output=True, timeout=5).returncode)


if __name__ == '__main__':
    unittest.main()
