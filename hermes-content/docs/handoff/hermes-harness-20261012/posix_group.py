"""Keep a private POSIX process group alive until the canary has been cleaned up.

The keeper holds the process-group ID while the CLI root may exit first.  Its
unreaped process handle prevents that ID from being reused before killpg.
"""

import os
from pathlib import Path
import signal
import subprocess
import sys


class PosixGroup:
    def __init__(self, keeper: subprocess.Popen[bytes], process: subprocess.Popen[str]):
        self.keeper = keeper
        self.process = process
        self.closed = False

    def close(self) -> None:
        if self.closed:
            return
        self.closed = True
        try:
            # Do not poll or reap the keeper first: its PID must stay reserved.
            os.killpg(self.keeper.pid, signal.SIGKILL)
        except ProcessLookupError:
            pass
        finally:
            try:
                self.process.wait(timeout=2)
            except subprocess.TimeoutExpired:
                self.process.kill()
                self.process.wait(timeout=2)
            self.keeper.wait(timeout=2)


def launch(argv: tuple[str, ...], cwd: Path) -> tuple[subprocess.Popen[str], PosixGroup]:
    if os.name == "nt":
        raise RuntimeError("POSIX launcher on Windows")
    keeper = subprocess.Popen(
        (sys.executable, "-c", "import time; time.sleep(120)"),
        stdin=subprocess.DEVNULL, stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL, process_group=0,
    )
    if keeper.poll() is not None:
        raise RuntimeError("POSIX group keeper exited before CLI launch")
    try:
        process = subprocess.Popen(
            argv, cwd=cwd, stdin=subprocess.DEVNULL,
            stdout=subprocess.PIPE, stderr=subprocess.PIPE,
            text=True, encoding="utf-8", errors="replace",
            process_group=keeper.pid,
        )
    except Exception:
        # The keeper is still unreaped, so its group ID cannot target a stranger.
        try:
            os.killpg(keeper.pid, signal.SIGKILL)
        except ProcessLookupError:
            pass
        keeper.wait(timeout=2)
        raise
    return process, PosixGroup(keeper, process)
