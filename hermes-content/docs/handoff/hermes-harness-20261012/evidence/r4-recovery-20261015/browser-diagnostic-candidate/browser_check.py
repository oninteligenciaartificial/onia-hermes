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
    source=h['historical_source']('browser_check.py','aac64bb8ebc82441141787838458767125b7cdb01b28d75c0bdf2b5f46201ebb')
    source=h['replace_once'](source,'c.get("operation_generation") != "R3"','c.get("operation_generation") != "PUBLIC_DIAGNOSTIC"')
    source=h['replace_once'](source,'codex/orquestacion-subagentes-20261013','codex/hermes-controller-hardening-20261013')
    source=h['replace_once'](source,'provider.get("saved_at_utc") != "2026-10-14T18:05:55.372Z"','provider.get("saved_at_utc") != DIAGNOSTIC_SAVED_AT')
    n={'__name__':'diagnostic_core','__file__':__file__}
    exec(compile(source,__file__,'exec'),n)
    n.update(AUTHORIZATION=c['authorization_reference'],CONFIG_RECEIPT_SHA=c['configuration_receipt_sha256'],DIAGNOSTIC_SAVED_AT=c['configuration_saved_at_utc'])
    return n['main']()
if __name__=='__main__':raise SystemExit(main())
