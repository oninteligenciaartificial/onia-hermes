"""Lanzador finito del revisor auxiliar visible en Orca, sin flags de bypass."""
import datetime
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent.parent
status_path = HERE / "review-native-status.json"
log_path = HERE / "review-native.jsonl"
mission_path = HERE / "review-mission.txt"
status = {"state": "starting", "started_utc": datetime.datetime.now(datetime.timezone.utc).isoformat(), "worktree": str(ROOT), "launcher_pid": os.getpid(), "log": str(log_path), "scope": "revision_local_qa_no_global_autonomy"}

def record():
    temp = status_path.with_suffix(".tmp")
    temp.write_text(json.dumps(status, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    temp.replace(status_path)

record()
try:
    hermes = shutil.which("hermes")
    if not hermes or not mission_path.is_file():
        raise RuntimeError("CLI existente o mision no disponible; no instalar")
    cmd = [hermes, "chat", "--oneshot", "--query-file", str(mission_path), "--in", str(ROOT), "--provider", "openai-codex", "--model", "gpt-6-luna", "--reasoning", "low", "--toolsets", "file,terminal", "--max-turns", "16", "--run-budget", "240", "--pass-session-id", "--format", "stream-json"]
    env = os.environ.copy()
    env["PYTHONUTF8"] = "1"
    scratch = "C:/Users/PC/AppData/Local/hermes/cache/scratch"
    if not Path(scratch).is_dir():
        raise RuntimeError("Scratch autorizado no disponible")
    for k in ("TEMP", "TMP", "TMPDIR"):
        env[k] = scratch
    with log_path.open("wb") as log:
        proc = subprocess.Popen(cmd, cwd=ROOT, stdout=log, stderr=subprocess.STDOUT, env=env)
        status.update({"state": "running", "worker_pid": proc.pid})
        record()
        code = proc.wait()
    status.update({"state": "exited", "exit_code": code, "ended_utc": datetime.datetime.now(datetime.timezone.utc).isoformat()})
    record()
    print(json.dumps(status, ensure_ascii=False))
    sys.exit(code)
except Exception as exc:
    status.update({"state": "failed", "error_type": type(exc).__name__, "error": str(exc)})
    record()
    print(json.dumps(status, ensure_ascii=False))
    sys.exit(1)
