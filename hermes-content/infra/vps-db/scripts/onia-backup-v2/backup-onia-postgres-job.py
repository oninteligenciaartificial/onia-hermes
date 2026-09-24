#!/usr/bin/env python3
"""Linux cron entrypoint: bounded local PostgreSQL export, never full recovery.

No pruning, scheduler changes or notifications. A retained job lock requires an
operator to establish that Docker's exec/dump has ended before removing it.
"""
import argparse
import hashlib
import json
import os
from pathlib import Path
import re
import signal
import stat
import subprocess
import sys
import tempfile
import time

try:
    import resource
except ImportError:  # The CLI must still fail safely on non-Linux hosts.
    resource = None

MIB = 1024 * 1024
LOCK_NAME = ".onia-postgres-job.lock"
STATUS_NAME = "postgres-export-job.status.json"
EXPORTER = Path(__file__).resolve().with_name("backup-onia-postgres.sh")
CHILD_ENV = {"PATH": "/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
             "LANG": "C", "LC_ALL": "C", "TZ": "UTC"}


class JobError(Exception):
    """Only fixed stage names, never subprocess output or filesystem errors."""


class SafeParser(argparse.ArgumentParser):
    def error(self, message):
        raise JobError("arguments")


def parse_args(argv):
    parser = SafeParser(description=__doc__, allow_abbrev=False)
    parser.add_argument("--execute", action="store_true")
    for name in ("container-name", "expected-image-id", "database", "username", "output-dir"):
        parser.add_argument("--" + name, required=True)
    parser.add_argument("--port", type=int, required=True)
    for name, default in (("max-bytes", 256 * MIB), ("storage-budget-bytes", 2048 * MIB),
                          ("min-free-bytes", 5120 * MIB), ("dump-timeout-seconds", 300)):
        parser.add_argument("--" + name, type=int, default=default)
    flags = [a.split("=", 1)[0] for a in argv if a.startswith("--")]
    if len(flags) != len(set(flags)):
        raise JobError("arguments")
    args = parser.parse_args(argv)
    if not args.execute:
        raise JobError("execute_required")
    if not re.fullmatch(r"[a-zA-Z0-9][a-zA-Z0-9_.-]{0,127}", args.container_name):
        raise JobError("arguments")
    if not re.fullmatch(r"sha256:[a-f0-9]{64}", args.expected_image_id):
        raise JobError("arguments")
    if any(not re.fullmatch(r"[a-zA-Z_][a-zA-Z0-9_]{0,62}", value)
           for value in (args.database, args.username)):
        raise JobError("arguments")
    if not 1 <= args.port <= 65535 or not 1 <= args.dump_timeout_seconds <= 3600:
        raise JobError("arguments")
    if any(not 1 <= value <= 9007199254740991 for value in
           (args.max_bytes, args.storage_budget_bytes, args.min_free_bytes)):
        raise JobError("arguments")
    path = Path(args.output_dir)
    if not path.is_absolute() or path == Path("/") or ".." in path.parts:
        raise JobError("arguments")
    return args


def private_output(path):
    # Do not silently canonicalize through a symlink to a different destination.
    for part in (path, *path.parents):
        if stat.S_ISLNK(part.lstat().st_mode):
            raise JobError("output_permissions")
    info = path.lstat()
    if (not stat.S_ISDIR(info.st_mode) or info.st_uid != os.geteuid()
            or stat.S_IMODE(info.st_mode) != 0o700):
        raise JobError("output_permissions")


def usage_bytes(path):
    """Count every file/partial; allocated blocks also count, including dirs."""
    total = 0
    for entry in path.iterdir():
        info = entry.lstat()
        if not (stat.S_ISREG(info.st_mode) or stat.S_ISDIR(info.st_mode)):
            raise JobError("storage_entry")
        total += max(info.st_size, info.st_blocks * 512)
        if stat.S_ISDIR(info.st_mode):
            total += usage_bytes(entry)
    return total


def inspect_container(args):
    # Only these four non-secret fields leave Docker. Never inspect Config.Env.
    result = subprocess.run(
        ["docker", "--host", "unix:///var/run/docker.sock", "inspect", "--type", "container",
         "--format", "{{.Id}} {{.State.Running}} {{.Image}} {{.Name}}", args.container_name],
        stdin=subprocess.DEVNULL, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL,
        timeout=15, env=CHILD_ENV, check=False)
    if result.returncode != 0 or len(result.stdout) > 512:
        raise JobError("container_identity")
    fields = result.stdout.decode("ascii").strip().split()
    if (len(fields) != 4 or not re.fullmatch(r"[a-f0-9]{64}", fields[0])
            or fields[1:] != ["true", args.expected_image_id, "/" + args.container_name]):
        raise JobError("container_identity")
    return fields[0]


def child_file_limit(max_bytes):
    # Inherited by bash/gzip/node: a real kernel limit on EACH regular file.
    # It does not constrain writes made by a process inside the Docker daemon.
    resource.setrlimit(resource.RLIMIT_FSIZE, (max_bytes, max_bytes))


def stop_local_group(child):
    # Never docker stop/kill. The in-container timeout owns remote dump cleanup.
    for sig in (signal.SIGTERM, signal.SIGKILL):
        try:
            os.killpg(child.pid, sig)
        except ProcessLookupError:
            pass
        try:
            child.wait(timeout=5)
        except subprocess.TimeoutExpired:
            continue
        return


def regular_file(path, limit):
    info = path.lstat()
    if (not stat.S_ISREG(info.st_mode) or info.st_nlink != 1
            or info.st_uid != os.geteuid() or stat.S_IMODE(info.st_mode) & 0o077
            or not 0 <= info.st_size <= limit):
        raise JobError("artifact_validation")
    return info


def read_json(path):
    regular_file(path, 16384)
    with path.open("r", encoding="utf-8") as stream:
        value = json.load(stream)
    if not isinstance(value, dict):
        raise JobError("artifact_validation")
    return value


def validate_export(output, before, args, cid, deadline):
    new = [p for p in output.iterdir() if p.name not in before
           and p.name.startswith("onia-postgres-")]
    if len(new) != 1:
        raise JobError("artifact_validation")
    folder = new[0]
    if not re.fullmatch(r"onia-postgres-" + re.escape(args.database) + r"-\d{8}T\d{6}Z", folder.name):
        raise JobError("artifact_validation")
    private_output(folder)
    marker = regular_file(folder / "EXPORT_COMPLETE", 0)
    if marker.st_size != 0:
        raise JobError("artifact_validation")
    manifest = read_json(folder / "manifest.json")
    if (manifest.get("sourceContainerId") != cid or manifest.get("database") != args.database
            or manifest.get("port") != args.port or manifest.get("restoreVerified") is not False
            or manifest.get("fullRecoveryVerified") is not False
            or manifest.get("createdAtUtc") != folder.name.rsplit("-", 1)[1]):
        raise JobError("artifact_validation")
    compressed = 0
    for prefix in ("database", "globals"):
        report = read_json(folder / (prefix + ".integrity.json"))
        data = folder / (prefix + ".sql.gz")
        info = regular_file(data, args.max_bytes)
        if (report.get("status") != "integrity_passed" or report.get("restoreVerified") is not False
                or type(report.get("decompressedBytes")) is not int
                or not 0 < report["decompressedBytes"] <= args.max_bytes
                or report.get("maxDecompressedBytes") != args.max_bytes
                or type(report.get("compressedBytes")) is not int
                or report["compressedBytes"] != info.st_size or info.st_size == 0):
            raise JobError("artifact_validation")
        digest = hashlib.sha256()
        with data.open("rb") as stream:
            while chunk := stream.read(1024 * 1024):
                if time.monotonic() > deadline:
                    raise JobError("total_timeout")
                digest.update(chunk)
        if digest.hexdigest() != report.get("compressedSha256"):
            raise JobError("artifact_validation")
        compressed += info.st_size
    return {"exportDirectory": folder.name, "compressedBytes": compressed}


def write_status(output, report):
    # Replace only this operational JSON, never SQL or an existing backup.
    fd, temporary = tempfile.mkstemp(prefix=".postgres-job-status-", dir=output)
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as stream:
            json.dump(report, stream, separators=(",", ":"))
            stream.write("\n")
            stream.flush()
            os.fsync(stream.fileno())
        os.replace(temporary, output / STATUS_NAME)
    finally:
        if os.path.exists(temporary):
            os.unlink(temporary)


def run_job(args):
    started = time.monotonic()
    output = Path(args.output_dir)
    lock = output / LOCK_NAME
    owned = False
    child_started = False
    child = None
    stage = "platform"
    report = {"status": "postgres_job_failed", "restoreVerified": False,
              "fullRecoveryVerified": False, "lockRetained": False}
    try:
        if not sys.platform.startswith("linux") or resource is None:
            raise JobError("platform")
        stage = "output_permissions"
        private_output(output)
        stage = "job_lock"
        lock.mkdir(mode=0o700)
        owned = True
        stage = "storage_budget"
        used = usage_bytes(output)
        reserve = 2 * args.max_bytes + MIB
        free = os.statvfs(output).f_bavail * os.statvfs(output).f_frsize
        if used + reserve > args.storage_budget_bytes:
            raise JobError("storage_budget")
        if free < args.min_free_bytes + reserve:
            raise JobError("free_space")
        stage = "container_identity"
        cid = inspect_container(args)
        stage = "exporter_file"
        if not EXPORTER.is_file() or EXPORTER.is_symlink():
            raise JobError("exporter_file")
        before = {p.name for p in output.iterdir()}
        argv = ["bash", str(EXPORTER), "--execute", "--container-id", cid,
                "--database", args.database, "--username", args.username,
                "--port", str(args.port), "--output-dir", str(output),
                "--max-bytes", str(args.max_bytes),
                "--dump-timeout-seconds", str(args.dump_timeout_seconds)]
        timeout = 2 * (args.dump_timeout_seconds + 5) + 120
        deadline = time.monotonic() + timeout
        stage = "exporter_spawn"
        # Conservative even if Popen itself is interrupted: never assume no exec ran.
        child_started = True
        child = subprocess.Popen(argv, stdin=subprocess.DEVNULL, stdout=subprocess.DEVNULL,
                                 stderr=subprocess.DEVNULL, env=CHILD_ENV,
                                 start_new_session=True,
                                 preexec_fn=lambda: child_file_limit(args.max_bytes))
        stage = "exporter_exit"
        if child.wait(timeout=timeout) != 0:
            raise JobError("exporter_exit")
        stage = "artifact_validation"
        evidence = validate_export(output, before, args, cid, deadline)
        report.update(evidence)
        # A completed child must also leave the exporter's own mutex released.
        if (output / ".onia-postgres-export.lock").exists():
            raise JobError("exporter_lock")
        if time.monotonic() > deadline:
            raise JobError("total_timeout")
        report.update(status="postgres_job_complete", stage="complete",
                      finishedAtUtc=time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                      elapsedSeconds=round(time.monotonic() - started, 3))
        stage = "status_write"
        write_status(output, report)
        stage = "lock_cleanup"
        lock.rmdir()
        owned = False
        return report, 0
    except subprocess.TimeoutExpired:
        stage = "total_timeout" if child_started else "container_identity_timeout"
    except (KeyboardInterrupt, InterruptedError):
        stage = "interrupted"
    except JobError as error:
        stage = str(error)
    except Exception:
        pass  # Raw errors can contain passwords, SQL or private paths.
    if child is not None and child.poll() is None:
        try:
            stop_local_group(child)
        except Exception:
            report["localCleanupFailed"] = True
    report.update(status="postgres_job_failed", stage=stage, lockRetained=owned and child_started,
                  finishedAtUtc=time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                  elapsedSeconds=round(time.monotonic() - started, 3))
    # Do not overwrite the state of another invocation that owns the mutex.
    if owned:
        try:
            write_status(output, report)
        except Exception:
            report["statusWriteFailed"] = True
    if owned and not child_started:
        try:
            lock.rmdir()
        except OSError:
            report.update(stage="lock_cleanup", lockRetained=True)
            try:
                write_status(output, report)
            except Exception:
                report["statusWriteFailed"] = True
    return report, 1


def main(argv=None):
    try:
        args = parse_args(sys.argv[1:] if argv is None else argv)
    except JobError as error:
        print(json.dumps({"status": "postgres_job_failed", "stage": str(error),
                          "restoreVerified": False, "fullRecoveryVerified": False,
                          "lockRetained": False}))
        return 1
    os.umask(0o077)
    def interrupt(_signum, _frame):
        raise InterruptedError()
    for signum in (signal.SIGHUP, signal.SIGINT, signal.SIGTERM):
        signal.signal(signum, interrupt)
    report, code = run_job(args)
    print(json.dumps(report, separators=(",", ":")))
    return code


if __name__ == "__main__":
    sys.exit(main())
