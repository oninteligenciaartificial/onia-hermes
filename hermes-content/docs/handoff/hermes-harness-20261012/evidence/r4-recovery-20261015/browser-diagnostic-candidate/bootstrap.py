"""Root entry: explicit execution only; final guard repeats before UID1000 launch."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import subprocess
from types import SimpleNamespace


def load_admission():
    base=Path(__file__).resolve().parent
    # Only load helper bytes selected by the independently saved Root pin.
    raw=(base/'manifest-approved.json').read_bytes()
    if (len(raw)>65536 or hashlib.sha256(raw).hexdigest()!=os.environ.get(
            'ONIA_BROWSER_DIAGNOSTIC_ROOT_MANIFEST_SHA256')):
        raise ValueError('independent Root manifest pin missing')
    m=json.loads(raw)
    source=(base/'admission.py').read_bytes()
    if len(source)>65536 or hashlib.sha256(source).hexdigest()!=m['source_sha256']['admission.py']:
        raise ValueError('Root-pinned admission source mismatch')
    namespace={'__name__':'diagnostic_admission','__file__':str(base/'admission.py')}
    exec(compile(source,str(base/'admission.py'),'exec'),namespace)
    return SimpleNamespace(**namespace)


def execute(output, checkout):
    if os.name!='posix' or os.getuid()!=0:raise ValueError('root Ubuntu bootstrap required')
    admission=load_admission()
    m,setup_sha=admission.runtime_admission()
    result=subprocess.run(['/usr/bin/git','-C',str(checkout),'rev-parse','HEAD'],
        stdin=subprocess.DEVNULL,stdout=subprocess.PIPE,stderr=subprocess.DEVNULL,
        timeout=10,check=True)
    if result.stdout.decode('ascii').strip()!=m['expected_head']:
        raise ValueError('actual checkout HEAD differs from approved pin')
    output=Path(output)
    if (not output.is_absolute() or not str(output).startswith('/workspace/')
            or output.resolve()!=output):raise ValueError('private workspace path required')
    # No second invocation can reuse this directory or claim.
    output.mkdir(mode=0o700)
    os.chown(output,1000,1000)
    contract=admission.contract_for(m,setup_sha)
    raw=json.dumps(contract,sort_keys=True,separators=(',',':')).encode()
    target=output/'contract.json'
    fd=os.open(target,os.O_WRONLY|os.O_CREAT|os.O_EXCL|os.O_NOFOLLOW,0o444)
    with os.fdopen(fd,'wb') as stream:stream.write(raw);stream.flush();os.fsync(stream.fileno())
    # Root-owned file inside UID1000 directory: final guard rejects any changed bytes.
    args=['--contract',str(target),'--contract-sha256',hashlib.sha256(raw).hexdigest(),
          '--output-dir',str(output)]
    # No shell, no package/download command, pinned existing interpreter only.
    proc=subprocess.run(['/usr/sbin/runuser','-u','#1000','--',
        '/opt/onia-public-browser-1.64.0/venv/bin/python','-I','-B',
        str(Path(__file__).with_name('supervisor.py')),*args],
        stdin=subprocess.DEVNULL,timeout=100,check=False)
    return proc.returncode


def main():
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument('--execute',action='store_true')
    p.add_argument('--output-dir',type=Path)
    p.add_argument('--checkout',type=Path)
    a=p.parse_args()
    if not a.execute:
        print(json.dumps({'state':'DRY_RUN','browser_launched':False,
                          'approval':'PENDING','queue_e2e':False}));return 0
    try:
        if a.output_dir is None or a.checkout is None:raise ValueError('explicit paths required')
        return execute(a.output_dir,a.checkout)
    except Exception as error:
        print(json.dumps({'state':'BLOCKED','phase':'browser_bootstrap',
                          'error_type':type(error).__name__,'retry':'forbidden'}));return 2


if __name__=='__main__':raise SystemExit(main())
