#!/usr/bin/env python3
"""Preparation artifact: real method execution requires external human approval."""
import hashlib
import json
import os
from pathlib import Path
import signal
import subprocess
import sys
import time

V2 = Path('/workspace/work/browser-goal-preflight-20261014/active-goal-v4/v2/browser_check.py')
V2_SHA = '9a0f5783e13acae869839367dfea0cc793d45f7a250d2e3f8f2e1550695b89ee'
PYTHON = '/opt/codex/runtimes/codex-primary-runtime/dependencies/python/bin/python'
SESSION = '01a13170-1c7e-7224-83c1-c5f369052039'
ROOT = Path(__file__).resolve().parent


def own_child_group(child):
    # start_new_session=True makes the spawned PID its group/session leader.
    pgid = os.getpgid(child.pid)
    if child.pid <= 1 or child.pid == os.getpid() or pgid != child.pid or pgid == os.getpgrp():
        raise RuntimeError('Refused non-child or own process group')
    return pgid


def run_child(argv, deadline=75.0, grace=2.0):
    if not 0 < deadline <= 75 or not 0 < grace <= 5:
        raise ValueError('Unsupported deadline/grace')
    started = time.monotonic()
    # Environment inherited unchanged. Suppress all child output; no secrets/log dumps.
    child = subprocess.Popen(argv, start_new_session=True,
                             stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    result = {'status': 'FAIL', 'deadline_seconds': deadline, 'grace_seconds': grace,
              'external_cancellation': 'UNKNOWN', 'remote_helper_cleanup': 'UNKNOWN'}
    try:
        try:
            code = child.wait(timeout=max(0, deadline - (time.monotonic() - started)))
            result.update(status='PASS' if code == 0 else 'child_failed_needs_reconcile', exit_code=code)
        except subprocess.TimeoutExpired:
            result['status'] = 'timeout_needs_reconcile'
            pgid = own_child_group(child)
            # Kill only the verified group of this direct child, never by name/UID.
            try:
                os.killpg(pgid, signal.SIGKILL)
                result['own_group_kill_sent'] = True
            except ProcessLookupError:
                result['own_group_kill_sent'] = False
            try:
                result['exit_code'] = child.wait(timeout=grace)
                result['direct_child_reaped'] = True
            except subprocess.TimeoutExpired:
                result['direct_child_reaped'] = False
                result['reconciliation_required'] = True
    finally:
        result['elapsed_seconds'] = round(time.monotonic() - started, 6)
    return result


def main():
    if sys.argv[1:] != ['--method-approved']:
        print(json.dumps({'status': 'BLOCKED_method_approval_required'}))
        return 2
    actual = hashlib.sha256(V2.read_bytes()).hexdigest()
    if actual != V2_SHA:
        print(json.dumps({'status': 'BLOCKED_source_hash_mismatch', 'sourceSHA': actual}))
        return 2
    # Flag is only a guard. External approval must be established before invocation.
    result = run_child([PYTHON, str(V2), '--method-approved'])
    result.update(sourceSHA=actual, supervisorSHA=hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
                  session_id=SESSION, session_id_provenance='contract-provided',
                  execution_turn_id='UNKNOWN', agent_id='/root', served_model='UNKNOWN',
                  U='UNKNOWN', W='UNKNOWN', retries=0)
    (ROOT / 'supervisor-receipt.json').write_text(json.dumps(result, indent=2) + '\n')
    # Explicit whitelist; child stdout/stderr is never forwarded.
    keys = ('status','sourceSHA','supervisorSHA','session_id','session_id_provenance',
            'execution_turn_id','deadline_seconds','grace_seconds','elapsed_seconds','exit_code')
    print(json.dumps({k: result[k] for k in keys if k in result}))
    return 0 if result['status'] == 'PASS' else 1


if __name__ == '__main__':
    raise SystemExit(main())
