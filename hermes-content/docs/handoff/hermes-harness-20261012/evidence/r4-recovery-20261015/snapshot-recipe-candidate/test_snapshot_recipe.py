"""Matcher and fail-closed tests only; never run setup or APT."""
import contextlib
import importlib.util
import io
import json
from pathlib import Path
import sys
import types
import unittest
from unittest.mock import patch

BASE = Path(__file__).parent
spec = importlib.util.spec_from_file_location('snapshot_recipe', BASE / 'setup_recipe.py')
recipe = importlib.util.module_from_spec(spec)
# pwd is POSIX-only; import must remain testable on Windows with no user lookup.
with patch.dict(sys.modules, {'pwd': types.ModuleType('pwd')}):
    spec.loader.exec_module(recipe)


class SnapshotRecipeTests(unittest.TestCase):
    def test_accept_observed_and_valid_calendar_dates(self):
        for stamp in ('20260828T000000Z', '20240229T235959Z', '20260101T000000Z'):
            for trailing in ('', '/'):
                self.assertTrue(recipe.ubuntu_uri('https://snapshot.ubuntu.com/ubuntu/' + stamp + trailing))

    def test_reject_wrong_host_route_date_or_uri_options(self):
        urls = (
            'https://snapshot.ubuntu.com.evil.test/ubuntu/20260828T000000Z/',
            'https://evil.snapshot.ubuntu.com/ubuntu/20260828T000000Z/',
            'https://snapshot.ubuntu.com/ubuntu/',
            'https://snapshot.ubuntu.com/ubuntu/20260229T000000Z/',
            'https://snapshot.ubuntu.com/ubuntu/20261301T000000Z/',
            'https://snapshot.ubuntu.com/ubuntu/20260828T246000Z/',
            'https://snapshot.ubuntu.com/ubuntu/20260828T000000Z/extra',
            'https://snapshot.ubuntu.com/ubuntu/20260828T000000Z/../',
            'https://snapshot.ubuntu.com/ubuntu/20260828T000000Z/?token=x',
            'https://snapshot.ubuntu.com/ubuntu/20260828T000000Z/#x',
            'https://user:secret@snapshot.ubuntu.com/ubuntu/20260828T000000Z/',
            'https://@snapshot.ubuntu.com/ubuntu/20260828T000000Z/',
            'https://snapshot.ubuntu.com:444/ubuntu/20260828T000000Z/',
            'http://snapshot.ubuntu.com/ubuntu/20260828T000000Z/',
        )
        for url in urls:
            with self.subTest(url=url):
                self.assertFalse(recipe.ubuntu_uri(url))

    def test_regression_existing_official_sources(self):
        for host in ('archive.ubuntu.com', 'security.ubuntu.com', 'us.archive.ubuntu.com'):
            self.assertTrue(recipe.ubuntu_uri('https://' + host + '/ubuntu/'))
            self.assertTrue(recipe.ubuntu_uri('http://' + host + '/ubuntu'))
        self.assertFalse(recipe.ubuntu_uri('https://archive.ubuntu.com.evil/ubuntu/'))

    def selected(self, text):
        source = Path('/etc/apt/sources.list')
        parts = Path('/etc/apt/sources.list.d')
        with patch.object(recipe, 'protected_existing'), patch.object(Path, 'exists', lambda p: p != parts), patch.object(Path, 'is_symlink', return_value=False), patch.object(Path, 'stat', return_value=types.SimpleNamespace(st_size=len(text))), patch.object(Path, 'read_bytes', return_value=text.encode()):
            return recipe.existing_ubuntu_sources()

    def test_source_selection_preserves_uri_suite_components_keyring(self):
        uri = 'https://snapshot.ubuntu.com/ubuntu/20260828T000000Z/'
        text, evidence, suites = self.selected('deb [signed-by=' + recipe.APT_KEYRING + '] ' + uri + ' noble main restricted universe multiverse\n')
        self.assertIn('URIs: ' + uri + '\n', text)
        self.assertIn('Suites: noble\n', text)
        self.assertIn('Components: main restricted universe multiverse\n', text)
        self.assertIn('Signed-By: ' + recipe.APT_KEYRING, text)
        self.assertEqual({'noble'}, suites)
        self.assertEqual(1, evidence[0]['selected_binary_entries'])

    def test_trust_bypass_rejected(self):
        for options in ('trusted=yes', 'allow-insecure=yes', 'check-valid-until=no', 'signed-by=/tmp/evil.gpg'):
            with self.subTest(options=options), contextlib.redirect_stdout(io.StringIO()), self.assertRaises(SystemExit):
                self.selected('deb [' + options + '] https://snapshot.ubuntu.com/ubuntu/20260828T000000Z/ noble main')

    def test_pending_manifest_blocks_before_any_install_or_write(self):
        manifest = json.loads((BASE / 'reviewed-install-manifest-candidate.json').read_text())
        self.assertIs(False, manifest['downloads_and_install_approved'])
        self.assertEqual('PENDING_APPROVAL', manifest['state'])
        with patch.object(recipe, 'PYTHON', sys.executable), patch.object(recipe.os, 'name', 'posix'), patch.object(recipe.os, 'getuid', return_value=0, create=True), patch.object(recipe, 'command', side_effect=AssertionError('command')), patch.object(recipe, 'require_supported_ubuntu', side_effect=AssertionError('inspection')), patch('sys.argv', ['setup_recipe.py', '--apply-reviewed-manifest', str(BASE / 'reviewed-install-manifest-candidate.json')]), contextlib.redirect_stdout(io.StringIO()), self.assertRaises(SystemExit):
            recipe.main()

    def test_component_set_unchanged_and_no_inherited_approval(self):
        manifest = json.loads((BASE / 'reviewed-install-manifest-candidate.json').read_text())
        self.assertEqual(33, len(recipe.APT_NAMES))
        self.assertEqual(recipe.APT_NAMES, set(manifest['apt_package_names_approved']))
        self.assertEqual(set(recipe.PACKAGES), set(manifest['python_packages']))
        self.assertIsNone(manifest['human_approval_reference'])
        self.assertIsNone(manifest['operation_authorization_reference'])
        self.assertEqual('1248', manifest['browser']['revision'])
        self.assertEqual(recipe.SETUP_TRIAL_OPERATION, manifest['operation_id'])
        self.assertNotEqual(recipe.PARENT_R4_OPERATION, manifest['operation_id'])
        self.assertEqual(recipe.PARENT_R4_OPERATION, manifest['parent_operation_id'])

    def test_unresolved_packages_fail_closed_and_report_sanitized_names(self):
        output = io.StringIO()
        response = types.SimpleNamespace(returncode=0, stdout='xvfb:\n  Candidate: (none)\n')
        with patch.object(recipe.subprocess, 'run', return_value=response), patch.object(recipe, 'command', side_effect=AssertionError('install')), contextlib.redirect_stdout(output), self.assertRaises(SystemExit):
            recipe.resolve_apt_candidates([], {})
        diagnostic = json.loads(output.getvalue())
        self.assertEqual(sorted(recipe.APT_NAMES), diagnostic['unresolved_packages'])

    def test_resolved_snapshot_policy_preserves_version_pins(self):
        output = 'package:\n  Candidate: 1.2.3-1ubuntu1\n  Version table:\n     1.2.3-1ubuntu1 500\n        500 https://snapshot.ubuntu.com/ubuntu/20260828T000000Z noble/main amd64 Packages\n'
        response = types.SimpleNamespace(returncode=0, stdout=output)
        with patch.object(recipe.subprocess, 'run', return_value=response):
            resolved = recipe.resolve_apt_candidates([], {})
        self.assertEqual(set(recipe.APT_NAMES), set(resolved))
        self.assertEqual({'1.2.3-1ubuntu1'}, set(resolved.values()))


if __name__ == '__main__':
    unittest.main()
