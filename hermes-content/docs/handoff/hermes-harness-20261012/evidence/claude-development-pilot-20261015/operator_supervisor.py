#!/usr/bin/env python3
"""Operator glue: execute one reviewed local CLI packet under the existing WindowsJob.

This is not the Claude-authored selector. Packets are trusted operator inputs, not
an API accepting arbitrary agent/user commands. Dry-run is the default.
"""
import argparse
import importlib.util
import json
import os
import subprocess
import sys
import time
from pathlib import Path


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--packet", type=Path, required=True)
    parser.add_argument("--receipt", type=Path, required=True)
    parser.add_argument("--execute", action="store_true")
    args = parser.parse_args()
    packet = json.loads(args.packet.read_text(encoding="utf-8"))
    folder = Path(__file__).resolve().parent
    harness = folder.parents[1]
    adapter_dir = folder.parent / "claude-adapter-prep-20261015"
    permitted = {
        r"C:\Users\PC\AppData\Roaming\npm\node_modules\@anthropic-ai\claude-code\bin\claude.exe": "claude",
        r"C:\Users\PC\AppData\Local\OpenAI\Codex\bin\2e5e00daee91c61d\codex.exe": "codex",
    }
    executable = str(Path(packet["argv"][0]))
    provider = permitted.get(executable)
    if not provider or any("dangerously" in arg for arg in packet["argv"]):
        raise ValueError("unreviewed executable or bypass flag")
    if not args.execute:
        print(json.dumps({"state": "dry_run", "provider": provider, "provider_started": False}))
        return
    # Durable exclusive reservation prevents this packet/receipt being replayed.
    with args.receipt.open("x", encoding="utf-8") as handle:
        json.dump({"state": "reserved", "provider": provider, "task_id": packet["task_id"]}, handle)
        handle.flush()
        os.fsync(handle.fileno())
    shim = r'''
import json,subprocess,sys,time
from pathlib import Path
p=json.loads(Path(sys.argv[1]).read_text());sys.path.insert(0,sys.argv[2])
import claude_adapter
env=claude_adapter.subscription_environment()
if sys.argv[3]=='claude':
    sys.path.insert(0,str(Path(sys.argv[2]).parent/'cli-integration-prep-20261015'))
    import claude_task
    check=claude_task.preflight(p['argv'][0],child_env=env)
    authenticated=check.get('ok') is True
else:
    auth=subprocess.run([p['argv'][0],'login','status'],capture_output=True,env=env,timeout=15)
    text=(auth.stdout+auth.stderr).decode('utf-8','replace').lower()
    authenticated=auth.returncode==0 and 'chatgpt' in text and 'api key' not in text and 'api_key' not in text
if not authenticated:
    print(json.dumps({'state':'preflight_blocked','provider_started':False}));sys.exit(2)
start=time.monotonic()
with open(p['stdout_file'],'xb') as out,open(p['stderr_file'],'xb') as err:
    process=subprocess.run(p['argv'],cwd=p['workspace'],env=env,input=Path(p['prompt_file']).read_bytes(),stdout=out,stderr=err,shell=False)
print(json.dumps({'state':'process_finished','provider_started':True,'provider_exit':process.returncode,'elapsed_ms':int((time.monotonic()-start)*1000)}))
'''
    spec = importlib.util.spec_from_file_location("windows_job", harness / "windows_job.py")
    module = importlib.util.module_from_spec(spec)
    started = time.monotonic()
    proc, job = None, None
    job_closed, parent_reaped = False, False
    try:
        spec.loader.exec_module(module)
        proc, job = module.launch((sys.executable, "-I", "-c", shim, str(args.packet), str(adapter_dir), provider), packet["workspace"])
        out, err = proc.communicate(timeout=180)
        result = json.loads(out)
        result.update({"supervisor_exit": proc.returncode, "supervisor_stderr_bytes": len(err)})
    except Exception:
        result = {"state": "needs_reconcile", "error": "launch_timeout_or_invalid_supervisor_result"}
    finally:
        if job is not None:
            try:
                job.close()
                job_closed = True
            except Exception:
                result = {"state": "needs_reconcile", "error": "job_close_failed"}
        if proc is not None:
            try:
                proc.wait(timeout=2)
                parent_reaped = True
            except Exception:
                result = {"state": "needs_reconcile", "error": "parent_reap_unconfirmed"}
            for stream in (proc.stdout, proc.stderr):
                if stream is not None:
                    stream.close()
    result.update({"windows_job_closed": job_closed, "parent_reaped": parent_reaped,
                   "outer_elapsed_ms": int((time.monotonic() - started) * 1000)})
    # Preserve reservation; final receipt is a separate immutable file.
    with args.receipt.with_suffix(".result.json").open("x", encoding="utf-8") as handle:
        json.dump(result, handle, sort_keys=True)
    print(json.dumps(result, sort_keys=True))


if __name__ == "__main__":
    main()
