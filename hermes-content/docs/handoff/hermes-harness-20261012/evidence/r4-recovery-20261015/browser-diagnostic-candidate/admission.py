"""Pending public browser diagnostic; no import-time effects or installation.

The independent Root pin must already have been saved/read back outside the task.
Task JSON, receipts and a caller boolean cannot supply that authority.
"""
import argparse
import hashlib
import json
import os
from pathlib import Path
import re
import stat

OPERATION = '4d53a71b-80d9-4c53-83f1-df53f824ab7f'
SETUP_OPERATION = '9fc238a7-aa41-433c-8681-a9bf6ec6a340'
ENVIRONMENT = '6abad782eba0819196ca234dc3abc327'
RECIPE_SHA = '27609d8506e41dcdf4190a68991bbffcdf76499cf3aecd9a57e8c097431d4b15'
SETUP_MANIFEST_SHA = '30a21d596b5592c3db5af2f15a0a56be06edd2adb560e93b5318424d34d6a86c'
EXECUTABLE_SHA = '377a9fc07b495c3b8d0ab8ec1fdfd153641759f9756fea34d8dfce4de82f5025'
INSTALL_OPERATION = '857f90fa-12b7-4641-a326-e6bbad9f6745'
INSTALL_RECIPE_SHA = '0237492e3cb76032bc64e6d4d737bd9de079997ebdf1f282da5cc313af6c430d'
SETUP_PATH = Path('/opt/onia-public-browser-1.64.0/setup-receipt.json')
EXECUTABLE = Path('/opt/onia-public-browser-1.64.0/browsers/chromium-1248/chrome-linux64/chrome')
ROOT_PIN = 'ONIA_BROWSER_DIAGNOSTIC_ROOT_MANIFEST_SHA256'
HASH = re.compile(r'[0-9a-f]{64}\Z')
SOURCE_NAMES = ('admission.py','browser_check.py','supervisor.py',
                'core_browser_check.py','core_supervisor.py','bootstrap.py','setup_recipe.py')


def digest(raw):return hashlib.sha256(raw).hexdigest()


def strict_json(raw):
    def unique(pairs):
        result={}
        for key,value in pairs:
            if key in result:raise ValueError('duplicate JSON field')
            result[key]=value
        return result
    value=json.loads(raw,object_pairs_hook=unique)
    if type(value) is not dict:raise ValueError('JSON object required')
    return value


def protected_bytes(path, limit):
    """Same descriptor metadata/read; reject symlink components and writable data."""
    path=Path(path)
    if not path.is_absolute():raise ValueError('absolute protected path required')
    for parent in reversed((path, *path.parents)):
        meta=parent.lstat()
        if stat.S_ISLNK(meta.st_mode) or meta.st_uid != 0 or meta.st_mode & 0o022:
            raise ValueError('unprotected path component')
    fd=os.open(path,os.O_RDONLY|os.O_NOFOLLOW)
    with os.fdopen(fd,'rb') as stream:
        meta=os.fstat(stream.fileno())
        if (not stat.S_ISREG(meta.st_mode) or meta.st_uid != 0
                or meta.st_mode & 0o022 or meta.st_size > limit):
            raise ValueError('unprotected or oversized file')
        raw=stream.read(limit+1)
        if len(raw)>limit:raise ValueError('oversized file')
    return raw


def validate_manifest(raw, independent_pin):
    if not isinstance(independent_pin,str) or not HASH.fullmatch(independent_pin) or digest(raw)!=independent_pin:
        raise ValueError('independent Root manifest pin missing or mismatched')
    m=strict_json(raw)
    mode=m.get('runtime_mode')
    if mode not in ('PRESENCE_ONLY','INSTALL_PINNED'):
        raise ValueError('explicit runtime mode required')
    install=mode=='INSTALL_PINNED'
    expected={'schema':1,'state':'APPROVED_BROWSER_DIAGNOSTIC','scope':'PUBLIC_BROWSER_DIAGNOSTIC',
              'operation_id':OPERATION,'environment_id':ENVIRONMENT,'browser_approved':True,
              'downloads_and_install_approved':install,
              'setup_operation_id':INSTALL_OPERATION if install else SETUP_OPERATION,
              'setup_recipe_sha256':INSTALL_RECIPE_SHA if install else RECIPE_SHA,
              'browser_executable_sha256':EXECUTABLE_SHA,
              'requested_ref':'codex/hermes-controller-hardening-20261013',
              'operation_nonce':'browser-diagnostic-'+OPERATION,'max_browser_launches':1,
              'deadline_seconds':75,'grace_seconds':2,'queue_effects':False}
    if any(type(m.get(k)) is not type(v) or m[k]!=v for k,v in expected.items()):
        raise ValueError('pending approval or crossed diagnostic pins/scope')
    ref=m.get('human_approval_reference')
    if not isinstance(ref,str) or not ref.startswith('user:') or 'PENDING' in ref or len(ref)>256:
        raise ValueError('actual Root-reviewed human reference required')
    if not re.fullmatch(r'[0-9a-f]{40}',m.get('expected_head') or ''):
        raise ValueError('reviewed checkout commit required')
    if not install and m.get('setup_manifest_sha256')!=SETUP_MANIFEST_SHA:
        raise ValueError('historical setup manifest mismatch')
    for key in ('configuration_readback_sha256','input_sha','setup_manifest_sha256'):
        if not HASH.fullmatch(m.get(key) or ''):raise ValueError('exact pin required')
    hashes=m.get('source_sha256')
    if (type(hashes) is not dict or set(hashes)!=set(SOURCE_NAMES)
            or any(not HASH.fullmatch(v or '') for v in hashes.values())):
        raise ValueError('exact source pins required')
    p=m.get('provider_saved_configuration')
    if (type(p) is not dict or p.get('surface')!='codex-cloud-legacy-ui'
            or p.get('preset')!='None' or p.get('network_access')!='limited'
            or p.get('cache_enabled') is not True or not p.get('evidence_reference')
            or not re.fullmatch(r'\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z',p.get('saved_at_utc') or '')
            or sorted(p.get('domains',[]))!=['example.com','iana.org','www.iana.org']
            or sorted(p.get('methods',[]))!=['GET','HEAD','OPTIONS']):
        raise ValueError('exact provider configuration/readback required')
    return m


def validate_setup(s, m=None):
    op=m['setup_operation_id'] if m else SETUP_OPERATION
    recipe=m['setup_recipe_sha256'] if m else RECIPE_SHA
    manifest=m['setup_manifest_sha256'] if m else SETUP_MANIFEST_SHA
    if any(s.get(k)!=v for k,v in {
            'operation_id':op,'recipe_sha256':recipe,
            'setup_manifest_sha256':manifest,'state':'INSTALLED_METADATA_ONLY',
            'environment_id':ENVIRONMENT,'browser_launched':False,'browser_uid_required':1000,
            'receipt_provenance':'pinned_installer_actual_success_after_component_validation'}.items()):
        raise ValueError('actual setup lineage mismatch')
    if s.get('browser_executable_sha256')!={EXECUTABLE.as_posix():EXECUTABLE_SHA}:
        raise ValueError('actual installed executable pin mismatch')


def check_presence(m):
    raw=protected_bytes(SETUP_PATH,12288)
    validate_setup(strict_json(raw),m)
    executable=protected_bytes(EXECUTABLE,512*1024*1024)
    if digest(executable)!=m['browser_executable_sha256']:
        raise ValueError('actual executable bytes mismatch')
    return digest(raw)


def contract_for(m, setup_sha):
    return dict(m,operation_generation='PUBLIC_DIAGNOSTIC',repository='onia-hermes',
        authorization_reference=m['human_approval_reference'],
        configuration_receipt_sha256=m['configuration_readback_sha256'],
        configuration_saved_at_utc=m['provider_saved_configuration']['saved_at_utc'],
        checkout_head_observed_before_uid_switch=m['expected_head'],
        setup_receipt_sha256=setup_sha,legacy_provider_configuration_accepted=True,
        supported_runtime_policy_contradiction=False,
        submission_reference='root-browser-diagnostic:'+OPERATION,
        child_source_sha256=m['source_sha256']['browser_check.py'],
        supervisor_source_sha256=m['source_sha256']['supervisor.py'])


def runtime_admission():
    base=Path(__file__).resolve().parent
    raw=protected_bytes(base/'manifest-approved.json',65536)
    m=validate_manifest(raw,os.environ.get(ROOT_PIN))
    for name in SOURCE_NAMES:
        if digest(protected_bytes(base/name,65536))!=m['source_sha256'][name]:
            raise ValueError('actual source bytes changed')
    readback=protected_bytes(base/'configuration-readback.json',65536)
    if digest(readback)!=m['configuration_readback_sha256']:
        raise ValueError('configuration readback hash mismatch')
    rb=strict_json(readback)
    if rb.get('provider_saved_configuration')!=m['provider_saved_configuration']:
        raise ValueError('configuration readback contents mismatch')
    if strict_json(os.environ.get('ONIA_BROWSER_PROVIDER_SAVED_CONFIGURATION_JSON','null'))!=m['provider_saved_configuration']:
        raise ValueError('inherited provider pin mismatch')
    actual=check_presence(m)
    return m,actual


def admission():
    parser=argparse.ArgumentParser(add_help=False)
    parser.add_argument('--contract',required=True)
    parser.add_argument('--contract-sha256',required=True)
    args,_=parser.parse_known_args()
    m,actual=runtime_admission()
    fd=os.open(args.contract,os.O_RDONLY|os.O_NOFOLLOW)
    with os.fdopen(fd,'rb') as stream:
        meta=os.fstat(stream.fileno())
        if (not stat.S_ISREG(meta.st_mode) or meta.st_uid!=0
                or meta.st_mode & 0o022 or meta.st_size>65536):
            raise ValueError('root-owned bounded frozen contract required')
        contract_raw=stream.read(65537)
    if len(contract_raw)>65536 or digest(contract_raw)!=args.contract_sha256:
        raise ValueError('bounded contract digest mismatch')
    contract=strict_json(contract_raw)
    if contract!=contract_for(m,actual):raise ValueError('contract freeze mismatch')
    return contract


def historical_source(name, expected):
    raw=protected_bytes(Path(__file__).resolve().parent/('core_'+name),65536)
    if digest(raw)!=expected:raise ValueError('frozen core changed')
    return raw.decode('utf-8')


def replace_once(source,old,new):
    if source.count(old)!=1:raise ValueError('unsupported frozen layout')
    return source.replace(old,new,1)
