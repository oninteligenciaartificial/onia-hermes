"""Offline candidate gates; synthetic approval never authorizes a real trial."""
import copy
import hashlib
import json
from pathlib import Path
import unittest
import contextlib
import io
import sys
import runpy
from unittest.mock import patch

import admission


class AdmissionTests(unittest.TestCase):
    def setUp(self):
        self.manifest = json.loads(Path(__file__).with_name('manifest-candidate.json').read_bytes())

    def approved(self):
        m = copy.deepcopy(self.manifest)
        m.update(state='APPROVED_BROWSER_DIAGNOSTIC', browser_approved=True,
                 runtime_mode='PRESENCE_ONLY',downloads_and_install_approved=False,
                 setup_operation_id=admission.SETUP_OPERATION,
                 setup_recipe_sha256=admission.RECIPE_SHA,
                 setup_manifest_sha256=admission.SETUP_MANIFEST_SHA,
                 human_approval_reference='user:SYNTHETIC:offline-test',
                 expected_head='a' * 40,
                 configuration_readback_sha256='b' * 64,
                 provider_saved_configuration={
                     'surface':'codex-cloud-legacy-ui','saved_at_utc':'2026-10-15T17:00:00Z',
                     'evidence_reference':'SYNTHETIC:readback','preset':'None',
                     'network_access':'limited','cache_enabled':True,
                     'domains':['example.com','iana.org','www.iana.org'],
                     'methods':['GET','HEAD','OPTIONS']})
        return m

    def validate(self, m, pin=None):
        raw = json.dumps(m, sort_keys=True).encode()
        return admission.validate_manifest(raw, pin or hashlib.sha256(raw).hexdigest())

    def test_pending_rejected(self):
        with self.assertRaises(ValueError):
            self.validate(self.manifest)

    def test_synthetic_approved_coherent_passes(self):
        self.assertEqual(self.validate(self.approved())['operation_id'], admission.OPERATION)

    def test_independent_root_pin_required_and_exact(self):
        for pin in ('', '0' * 64):
            with self.assertRaises(ValueError):
                self.validate(self.approved(), pin=pin or 'invalid')

    def test_crossed_scope_operation_setup_source_policy_rejected(self):
        changes = [('operation_id',admission.SETUP_OPERATION),('browser_approved',False),
                   ('downloads_and_install_approved',True),('scope','QUEUE_E2E'),
                   ('setup_recipe_sha256','0'*64),('setup_manifest_sha256','0'*64),
                   ('browser_executable_sha256','0'*64),('human_approval_reference',None)]
        for key, value in changes:
            with self.subTest(key=key), self.assertRaises(ValueError):
                m=self.approved();m[key]=value;self.validate(m)
        for key in ('domains','methods'):
            m=self.approved();m['provider_saved_configuration'][key].append('unsafe')
            with self.assertRaises(ValueError):self.validate(m)

    def test_duplicate_fields_rejected(self):
        with self.assertRaises(ValueError):
            admission.validate_manifest(b'{"state":1,"state":2}', '0'*64)

    def test_explicit_install_mode_requires_both_separate_approvals_and_pins(self):
        m=self.approved()
        m.update(runtime_mode='INSTALL_PINNED',downloads_and_install_approved=True,
                 setup_operation_id=admission.INSTALL_OPERATION,
                 setup_recipe_sha256=admission.INSTALL_RECIPE_SHA,
                 setup_manifest_sha256='c'*64)
        self.validate(m)
        for key,value in [('downloads_and_install_approved',False),
                          ('setup_operation_id',admission.SETUP_OPERATION),
                          ('setup_recipe_sha256',admission.RECIPE_SHA)]:
            bad=copy.deepcopy(m);bad[key]=value
            with self.assertRaises(ValueError):self.validate(bad)

    def test_sources_and_builder_exact(self):
        import prepare_candidate
        for name,raw in prepare_candidate.wrappers().items():
            self.assertEqual(Path(__file__).with_name(name).read_bytes(),raw)
        for name,sha in self.manifest['source_sha256'].items():
            self.assertEqual(hashlib.sha256(Path(__file__).with_name(name).read_bytes()).hexdigest(),sha)

    def test_default_help_and_import_never_execute(self):
        import bootstrap
        with patch('subprocess.run') as run, patch.object(sys,'argv',['bootstrap.py']), \
             contextlib.redirect_stdout(io.StringIO()):
            self.assertEqual(bootstrap.main(),0);run.assert_not_called()
        with patch('subprocess.run') as run, patch.object(sys,'argv',['bootstrap.py','--help']), \
             contextlib.redirect_stdout(io.StringIO()), self.assertRaises(SystemExit) as stop:
            bootstrap.main()
        self.assertEqual(stop.exception.code,0);run.assert_not_called()
        for name in ('browser_check.py','supervisor.py'):
            with patch('subprocess.run') as run:
                ns=runpy.run_path(str(Path(__file__).with_name(name)),run_name='offline_import')
                with patch.object(sys,'argv',[name,'--help']), contextlib.redirect_stdout(io.StringIO()):
                    self.assertEqual(ns['main'](),0)
                run.assert_not_called()

    def test_pending_install_wrapper_exits_before_any_subprocess(self):
        import prepare_candidate
        text=Path(__file__).with_name('setup-install-candidate.sh').read_text()
        marker="<<'ONIA_SETUP_TRIAL_BOOTSTRAP'\n"
        code=text.split(marker,1)[1].split('\nONIA_SETUP_TRIAL_BOOTSTRAP\n',1)[0]
        with patch('subprocess.run') as run, contextlib.redirect_stdout(io.StringIO()), \
             self.assertRaises(SystemExit):
            exec(compile(code,'pending-wrapper','exec'),{'__name__':'offline_test'})
        run.assert_not_called()
        self.assertIn('set -e',text)
        self.assertTrue(text.endswith("ONIA_SETUP_TRIAL_BOOTSTRAP\nprintf '%s\\n' ONIA_BROWSER_SETUP_COMPLETED\nexit 0\n"))

    def test_missing_cache_never_runs_subprocess_or_install(self):
        with patch.object(admission, 'protected_bytes', side_effect=FileNotFoundError), \
             patch('subprocess.run') as run:
            with self.assertRaises(FileNotFoundError):admission.check_presence(self.approved())
            run.assert_not_called()

    def test_install_receipt_exact_binding(self):
        receipt=json.loads(Path(__file__).parent.parent.joinpath(
            'snapshot-setup-approved-20261015/setup-receipt-full.json').read_bytes())
        # Candidate presence path uses the actual prior setup, not a new browser UUID.
        admission.validate_setup(receipt)
        for key in ('operation_id','recipe_sha256','setup_manifest_sha256'):
            bad=copy.deepcopy(receipt);bad[key]='wrong'
            with self.assertRaises(ValueError):admission.validate_setup(bad)


if __name__ == '__main__':unittest.main()
