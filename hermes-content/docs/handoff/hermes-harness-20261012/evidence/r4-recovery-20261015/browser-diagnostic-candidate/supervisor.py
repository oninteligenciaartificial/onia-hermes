#!/usr/bin/env python3
import argparse
import sys
def main():
    if '--help' in sys.argv[1:]:
        argparse.ArgumentParser(description='Root-admitted public diagnostic').print_help()
        return 0
    #!/usr/bin/env python3
    """Diagnostic wrapper: Root admission before frozen core behavior."""
    import hashlib
    from pathlib import Path
    p=Path(__file__).resolve().parent/'admission.py'
    raw=p.read_bytes()
    if len(raw)>65536 or hashlib.sha256(raw).hexdigest()!='79c4b69ad7067716fe57526e5aa0a82e811638942329381e036268d61f3aad07':
        raise SystemExit('BLOCKED_ADMISSION_SOURCE')
    h={'__name__':'diagnostic_admission','__file__':str(p)}
    exec(compile(raw,str(p),'exec'),h)
    try:
        c=h['admission']()
    except Exception:
        raise SystemExit('BLOCKED_DIAGNOSTIC_ADMISSION')
    source=h['historical_source']('supervisor.py','7aa687a7c694923ed8f30f3e7172926e854f6031a809b8656dd1b17fb6940ee9')
    n={'__name__':'diagnostic_core','__file__':__file__}
    exec(compile(source,__file__,'exec'),n)
    n['CHILD_SHA']=c['child_source_sha256']
    return n['main']()
if __name__=='__main__':raise SystemExit(main())
