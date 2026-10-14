#!/usr/bin/env python3
"""R4 wrapper: fresh admission, unchanged hash-pinned R3 watchdog/claim behavior."""
import hashlib
from pathlib import Path
import stat

HELPER_SHA = "9921253f9d510883c598d83a485eeb3768a27e185dbb857f58455fdad8dc2fb3"
helper_path = Path(__file__).resolve().parent / "admission.py"
helper_meta = helper_path.lstat()
if not stat.S_ISREG(helper_meta.st_mode) or helper_meta.st_mode & 0o022 or helper_meta.st_size > 32768:
    raise SystemExit("BLOCKED_R4_ADMISSION_SOURCE")
helper_raw = helper_path.read_bytes()
if hashlib.sha256(helper_raw).hexdigest() != HELPER_SHA:
    raise SystemExit("BLOCKED_R4_ADMISSION_SOURCE")
helper = {"__name__": "r4_admission", "__file__": str(helper_path)}
exec(compile(helper_raw, str(helper_path), "exec"), helper)
try:
    contract = helper["admission"]()
except Exception:
    raise SystemExit("BLOCKED_R4_ADMISSION")
source = helper["historical_source"]("supervisor.py", "7aa687a7c694923ed8f30f3e7172926e854f6031a809b8656dd1b17fb6940ee9")
namespace = {"__name__": "r4_supervisor_core", "__file__": __file__}
exec(compile(source, __file__, "exec"), namespace)
namespace["CHILD_SHA"] = "bd87c4c34307ca6ada693bb11486d1c38fc5d3ab996665a8a2e633185ff20c14"
if hashlib.sha256(Path(__file__).read_bytes()).hexdigest() != contract["supervisor_source_sha256"]:
    raise SystemExit("BLOCKED_R4_SUPERVISOR_SOURCE")
if __name__ == "__main__":
    raise SystemExit(namespace["main"]())
