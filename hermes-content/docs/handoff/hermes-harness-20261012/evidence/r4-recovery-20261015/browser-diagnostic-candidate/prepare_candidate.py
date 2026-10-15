"""Local deterministic packaging only; default/--help never writes or approves."""
import argparse
import hashlib
import importlib.util
import json
from pathlib import Path

BASE=Path(__file__).resolve().parent


def wrappers():
    helper=hashlib.sha256((BASE/'admission.py').read_bytes()).hexdigest()
    head='''#!/usr/bin/env python3
"""Diagnostic wrapper: Root admission before frozen core behavior."""
import hashlib
from pathlib import Path
p=Path(__file__).resolve().parent/'admission.py'
raw=p.read_bytes()
if len(raw)>65536 or hashlib.sha256(raw).hexdigest()!='HELPER_SHA':
    raise SystemExit('BLOCKED_ADMISSION_SOURCE')
h={'__name__':'diagnostic_admission','__file__':str(p)}
exec(compile(raw,str(p),'exec'),h)
try:
    c=h['admission']()
except Exception:
    raise SystemExit('BLOCKED_DIAGNOSTIC_ADMISSION')
'''.replace('HELPER_SHA',helper)
    result={}
    for name,sha in [('browser_check.py','aac64bb8ebc82441141787838458767125b7cdb01b28d75c0bdf2b5f46201ebb'),
                     ('supervisor.py','7aa687a7c694923ed8f30f3e7172926e854f6031a809b8656dd1b17fb6940ee9')]:
        if hashlib.sha256((BASE/('core_'+name)).read_bytes()).hexdigest()!=sha:
            raise ValueError('frozen core mutation')
        text=head+f"source=h['historical_source']('{name}','{sha}')\n"
        if name=='browser_check.py':
            for old,new in [('c.get("operation_generation") != "R3"','c.get("operation_generation") != "PUBLIC_DIAGNOSTIC"'),
                            ('codex/orquestacion-subagentes-20261013','codex/hermes-controller-hardening-20261013'),
                            ('provider.get("saved_at_utc") != "2026-10-14T18:05:55.372Z"','provider.get("saved_at_utc") != DIAGNOSTIC_SAVED_AT')]:
                text+=f"source=h['replace_once'](source,{old!r},{new!r})\n"
        text+="n={'__name__':'diagnostic_core','__file__':__file__}\nexec(compile(source,__file__,'exec'),n)\n"
        if name=='browser_check.py':
            text+="n.update(AUTHORIZATION=c['authorization_reference'],CONFIG_RECEIPT_SHA=c['configuration_receipt_sha256'],DIAGNOSTIC_SAVED_AT=c['configuration_saved_at_utc'])\n"
        else:text+="n['CHILD_SHA']=c['child_source_sha256']\n"
        text+="return n['main']()\n"
        # Import and --help are inert; guard/core entry happens only in main().
        text=("#!/usr/bin/env python3\nimport argparse\nimport sys\n"
              "def main():\n"
              "    if '--help' in sys.argv[1:]:\n"
              "        argparse.ArgumentParser(description='Root-admitted public diagnostic').print_help()\n"
              "        return 0\n"
              + ''.join('    '+line+'\n' for line in text.splitlines())
              + "if __name__=='__main__':raise SystemExit(main())\n")
        result[name]=text.encode()
    return result


def install_wrapper(recipe, manifest):
    source=BASE.parent/'snapshot-recipe-candidate/build_setup_trial_wrapper.py'
    spec=importlib.util.spec_from_file_location('original_setup_builder',source)
    module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
    text=module.build_wrapper(recipe,manifest).replace(
        '9fc238a7-aa41-433c-8681-a9bf6ec6a340','857f90fa-12b7-4641-a326-e6bbad9f6745')
    old="printf '%s\\n' ONIA_SETUP_TRIAL_COMPLETED\nexit 42"
    if text.count(old)!=1:raise ValueError('unsupported reviewed wrapper layout')
    return text.replace(old,"printf '%s\\n' ONIA_BROWSER_SETUP_COMPLETED\nexit 0").encode()


def build():
    m=json.loads((BASE/'manifest-candidate.json').read_bytes())
    if m['state']!='PENDING_APPROVAL' or m['browser_approved'] is not False:
        raise ValueError('builder cannot change an approved manifest')
    for name,raw in wrappers().items():(BASE/name).write_bytes(raw)
    m['source_sha256']={name:hashlib.sha256((BASE/name).read_bytes()).hexdigest()
        for name in ('admission.py','bootstrap.py','browser_check.py','supervisor.py',
                     'core_browser_check.py','core_supervisor.py','setup_recipe.py')}
    (BASE/'manifest-candidate.json').write_bytes((json.dumps(m,indent=2,sort_keys=True)+'\n').encode())
    (BASE/'setup-install-candidate.sh').write_bytes(install_wrapper(
        (BASE/'setup_recipe.py').read_bytes(),(BASE/'install-manifest-candidate.json').read_bytes()))


def main():
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('--build',action='store_true')
    a=p.parse_args()
    if a.build:build()
    print(json.dumps({'state':'PACKAGED_PENDING' if a.build else 'DRY_RUN','executed':False}))


if __name__=='__main__':main()
