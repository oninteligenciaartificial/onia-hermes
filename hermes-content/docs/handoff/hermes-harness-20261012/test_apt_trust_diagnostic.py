"""Focal offline tests; no live APT, network, or subprocess calls."""
import contextlib
import importlib.util
import io
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location('trust_probe', Path(__file__).with_name('apt_trust_diagnostic.py'))
probe = importlib.util.module_from_spec(spec)
spec.loader.exec_module(probe)


class TrustProbeTests(unittest.TestCase):
    def test_exact_original_packages(self):
        self.assertEqual(33, len(probe.PACKAGES))
        self.assertIn('fonts-noto-color-emoji', probe.PACKAGES)

    def test_uri_privacy_and_useful_identity(self):
        result = probe.public_uri('https://user:password@mirror.example.org/ubuntu-mirror?token=secret#private')
        self.assertEqual('mirror.example.org', result['hostname'])
        self.assertEqual('/ubuntu-mirror', result['path'])
        self.assertNotIn('password', json.dumps(result))
        self.assertNotIn('secret', json.dumps(result))

    def test_uri_path_bound(self):
        self.assertLess(len(probe.public_uri('https://example.org/' + 'a/' * 40000)['path']), 1025)

    def test_signed_by_public_path_and_fingerprint(self):
        result = probe.signed_by('/usr/share/keyrings/vendor-archive.gpg ABCDEF0123456789ABCDEF0123456789ABCDEF01!')
        self.assertEqual('/usr/share/keyrings/vendor-archive.gpg', result['values'][0])
        self.assertNotIn('private', json.dumps(probe.signed_by('/home/private/secret.gpg')))

    def test_reject_symlink_parent(self):
        with tempfile.TemporaryDirectory() as root:
            base = Path(root)
            (base / 'real').mkdir()
            (base / 'real' / 'file').write_text('test')
            try:
                (base / 'link').symlink_to(base / 'real', target_is_directory=True)
            except OSError:
                self.skipTest('Symlinks unavailable')
            with self.assertRaises((ValueError, OSError)):
                probe.bounded_read(base / 'link' / 'file')

    def test_dryrun_and_help_no_inspection(self):
        for args in (['probe'], ['probe', '--help']):
            with patch.object(probe, 'inspect', side_effect=AssertionError('effect')), patch('sys.argv', args), contextlib.redirect_stdout(io.StringIO()):
                try:
                    probe.main()
                except SystemExit as error:
                    self.assertEqual(0, error.code)

    def test_source_both_formats_and_trust_flags(self):
        one = list(probe.source_fields('deb [trusted=yes signed-by=/usr/share/keyrings/ubuntu-archive-keyring.gpg] https://mirror.example.org/ubuntu-mirror noble main universe', False))[0]
        deb = list(probe.source_fields('Types: deb\nURIs: https://mirror.example.org/ubuntu-mirror\nSuites: noble noble-updates\nComponents: main\nTrusted: no\nSigned-By: /usr/share/keyrings/ubuntu-archive-keyring.gpg', True))[0]
        self.assertEqual('yes', one['trusted'])
        self.assertEqual('no', deb['trusted'])
        self.assertEqual('noble noble-updates', deb['suites'])

    def test_policy_only_versions(self):
        check = {'status': 'EXECUTED', 'returncode': 0}
        with patch.object(probe, 'offline', return_value=(check, 'libnss3:\n Installed: 2:1.0\n Candidate: (none)\n Version table:\n https://user:secret@private.example/a\n')):
            result = probe.package_policy()
        package = next(row for row in result if row['package'] == 'libnss3')
        self.assertEqual('2:1.0', package['installed'])
        self.assertEqual('NONE', package['candidate'])
        self.assertNotIn('secret', json.dumps(result))

    def test_no_signature_without_protected_keyring(self):
        with patch.object(probe, 'offline', side_effect=AssertionError('effect')):
            self.assertEqual('UNKNOWN', probe.verify_release(Path('/fake'), {'root_protected': False})['state'])
            self.assertEqual('UNKNOWN', probe.verify_release(Path('/fake'), {'root_protected': True}, b'Origin: Ubuntu')['state'])

    def test_signature_success_and_failure(self):
        with patch.object(probe, 'offline', return_value=({'status': 'EXECUTED', 'returncode': 0}, '')):
            self.assertEqual('VERIFIED_WITH_EXISTING_UBUNTU_KEYRING', probe.verify_release(Path('/fake'), {'root_protected': True})['state'])
        with patch.object(probe, 'offline', return_value=({'status': 'EXECUTED', 'returncode': 2}, '')):
            self.assertEqual('FAILED', probe.verify_release(Path('/fake'), {'root_protected': True})['state'])
        with patch.object(probe, 'offline', return_value=({'status': 'TOOL_MISSING'}, '')):
            self.assertEqual('UNKNOWN', probe.verify_release(Path('/fake'), {'root_protected': True})['state'])

    def test_read_limits(self):
        with tempfile.TemporaryDirectory() as root:
            path = Path(root) / 'source.list'
            path.write_bytes(b'a' * 20)
            with self.assertRaises(ValueError):
                probe.bounded_read(path, 10)
            with self.assertRaises(ValueError):
                probe.bounded_directory(Path(root), 0)

    def test_offline_missing_and_unapproved_no_spawn(self):
        with patch.object(probe.subprocess, 'Popen', side_effect=AssertionError('spawn')):
            self.assertEqual('TOOL_NOT_ALLOWED', probe.offline(['/bin/sh', '-c', 'anything'])[0]['status'])
            with patch.object(probe, 'no_symlinks', side_effect=FileNotFoundError):
                self.assertEqual('TOOL_MISSING', probe.offline(['/usr/bin/gpgv'])[0]['status'])


if __name__ == '__main__':
    unittest.main()
