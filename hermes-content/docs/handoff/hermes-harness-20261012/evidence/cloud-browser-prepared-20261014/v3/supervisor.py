#!/usr/bin/env python3
"""Preparation artifact: real method execution requires external human approval."""
import hashlib
import json
import os
from pathlib import Path
import signal
import subprocess
import sys
import tempfile
import time
from datetime import datetime, timezone

V2 = Path('/workspace/work/browser-goal-preflight-20261014/active-goal-v4/v2/browser_check.py')
V2_SHA = '1690c4c75b34cbfb184a2df1b47ee7e4647a5798c81d256d79a2c3a085c3b2c1'
PYTHON = '/opt/codex/runtimes/codex-primary-runtime/dependencies/python/bin/python'
CONTRACT_SESSION = '01a13170-1c7e-7224-83c1-c5f369052039'
AUTHORIZATION_REFERENCE = 'COORDINATION_MANIFEST.md: one-shot public example.com to IANA browser method'
# The handoff PARADA requires evidence of Chromium sandboxing and host-level
# egress isolation. Playwright request routing is defense in depth, not proof
# of either property. Keep dispatch closed until a reviewed preflight closes it.
PREFLIGHT_GATE = 'BLOCKED_runtime_egress_policy_denies_contract_hosts'
ROOT = Path(__file__).resolve().parent
CLAIM = ROOT / '.browser-cloud-attempt.claim'


def utc():
    return datetime.now(timezone.utc).isoformat()


CLAIM_STARTED_AT = utc()


def claim_payload(state, **details):
    value = {'version': 1, 'state': state, 'contract_session_id': CONTRACT_SESSION,
             'execution_turn_id': 'UNKNOWN', 'source_sha256': V2_SHA,
             'supervisor_sha256': hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
             'authorization_reference': AUTHORIZATION_REFERENCE,
             'authorization_scope': 'one public example.com to IANA navigation and JPEG capture',
             'claim_started_at_utc': CLAIM_STARTED_AT}
    value.update(details)
    return (json.dumps(value, sort_keys=True) + '\n').encode()


def reserve_claim():
    flags = os.O_WRONLY | os.O_CREAT | os.O_EXCL
    flags |= getattr(os, 'O_NOFOLLOW', 0)
    fd = os.open(CLAIM, flags, 0o600)
    try:
        write_all(fd, claim_payload('reserved'))
        os.fsync(fd)
        if os.name == 'posix':
            directory_fd = os.open(ROOT, os.O_RDONLY | getattr(os, 'O_DIRECTORY', 0))
            try:
                os.fsync(directory_fd)
            finally:
                os.close(directory_fd)
    except BaseException:
        # Preserve any reservation that may have reached storage; never release/replay.
        os.close(fd)
        raise
    return fd


def write_all(fd, data):
    view = memoryview(data)
    while view:
        written = os.write(fd, view)
        if written <= 0:
            raise OSError('short claim write')
        view = view[written:]


def update_claim(fd, state, **details):
    data = claim_payload(state, **details)
    os.lseek(fd, 0, os.SEEK_SET)
    os.ftruncate(fd, 0)
    write_all(fd, data)
    os.fsync(fd)


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
    result = {'status': 'FAIL', 'deadline_seconds': deadline, 'grace_seconds': grace,
              'external_cancellation': 'UNKNOWN', 'remote_helper_cleanup': 'UNKNOWN'}
    with tempfile.TemporaryFile() as child_out, tempfile.TemporaryFile() as child_err:
        child = subprocess.Popen(argv, start_new_session=True,
                                 stdout=child_out, stderr=child_err)
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
            for key, stream in (('child_stdout_excerpt', child_out), ('child_stderr_excerpt', child_err)):
                stream.seek(0)
                result[key] = stream.read(1024).decode('utf-8', errors='replace')
    return result


def main():
    if sys.argv[1:] != ['--method-approved']:
        print(json.dumps({'status': 'BLOCKED_method_approval_required'}))
        return 2
    if PREFLIGHT_GATE != 'PASS':
        print(json.dumps({'status': PREFLIGHT_GATE,
                          'claim_created': False, 'child_dispatched': False,
                          'required_evidence': ['Chromium sandbox proof',
                                               'host/container egress isolation proof']}))
        return 2
    actual = hashlib.sha256(V2.read_bytes()).hexdigest()
    if actual != V2_SHA:
        print(json.dumps({'status': 'BLOCKED_source_hash_mismatch', 'sourceSHA': actual}))
        return 2
    try:
        claim_fd = reserve_claim()
    except FileExistsError:
        print(json.dumps({'status': 'BLOCKED_attempt_already_reserved',
                          'claim_path': str(CLAIM)}))
        return 2
    except Exception as error:
        print(json.dumps({'status': 'BLOCKED_claim_reservation_failed',
                          'error_type': type(error).__name__}))
        return 2

    result = {'status': 'needs_reconcile', 'sourceSHA': actual,
              'supervisorSHA': hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
              'contract_session_id': CONTRACT_SESSION,
              'session_id': 'UNKNOWN', 'session_id_provenance': 'external_tool_correlation_required',
              'execution_turn_id': 'UNKNOWN', 'agent_id': '/root',
              'served_model': 'UNKNOWN', 'U': 'UNKNOWN', 'W': 'UNKNOWN', 'retries': 0}
    update_claim(claim_fd, 'running')
    try:
        result.update(run_child([PYTHON, str(V2), '--method-approved', '--claim', str(CLAIM)]))
        child_receipt_path = ROOT / 'execution-receipt.json'
        if child_receipt_path.exists():
            try:
                child_receipt = json.loads(child_receipt_path.read_text())
                result['child_status'] = child_receipt.get('status', 'UNKNOWN')
                result['child_error_type'] = child_receipt.get('error_type', 'UNKNOWN')
                result['child_error'] = str(child_receipt.get('error', ''))[:500]
                result['screenshot'] = child_receipt.get('screenshot', {})
                screenshot = result['screenshot']
                image_name = screenshot.get('filename') if isinstance(screenshot, dict) else None
                image_path = ROOT / image_name if image_name == 'iana-example-domains.jpg' else None
                if result.get('status') == 'PASS':
                    if result['child_status'] != 'PASS' or image_path is None or not image_path.is_file():
                        result['status'] = 'child_output_mismatch_needs_reconcile'
                    else:
                        jpeg = image_path.read_bytes()
                        image_sha = hashlib.sha256(jpeg).hexdigest()
                        if (screenshot.get('format') != 'JPEG'
                                or screenshot.get('bytes') != len(jpeg)
                                or screenshot.get('sha256') != image_sha
                                or not jpeg.startswith(b'\xff\xd8')
                                or not jpeg.endswith(b'\xff\xd9')):
                            result['status'] = 'child_output_mismatch_needs_reconcile'
                        else:
                            result['screenshot_sha256'] = image_sha
            except Exception as error:
                result['child_receipt_parse_error'] = type(error).__name__
                if result.get('status') == 'PASS':
                    result['status'] = 'child_output_mismatch_needs_reconcile'
        terminal = 'terminal' if result.get('status') == 'PASS' else 'needs_reconcile'
        result['claim_state'] = terminal
        update_claim(claim_fd, terminal, finished_at_utc=utc(), status=result['status'],
                     execution_turn_id='UNKNOWN', screenshot_sha256=result.get('screenshot_sha256', 'UNKNOWN'))
        (ROOT / 'supervisor-receipt.json').write_text(json.dumps(result, indent=2) + '\n')
        # Only bounded, non-secret receipt fields leave the supervisor.
        keys = ('status','claim_state','sourceSHA','supervisorSHA','contract_session_id',
                'session_id','session_id_provenance','execution_turn_id','deadline_seconds',
                'grace_seconds','elapsed_seconds','exit_code','child_status','child_error_type',
                'child_error','child_stdout_excerpt','child_stderr_excerpt','screenshot',
                'screenshot_sha256','retries')
        print(json.dumps({k: result[k] for k in keys if k in result}))
        return 0 if result['status'] == 'PASS' else 1
    except BaseException as error:
        result.update(status='needs_reconcile', claim_state='needs_reconcile',
                      supervisor_error_type=type(error).__name__)
        try:
            update_claim(claim_fd, 'needs_reconcile', finished_at_utc=utc(),
                         supervisor_error_type=type(error).__name__)
            (ROOT / 'supervisor-receipt.json').write_text(json.dumps(result, indent=2) + '\n')
        except Exception:
            pass
        raise
    finally:
        os.close(claim_fd)


if __name__ == '__main__':
    raise SystemExit(main())
