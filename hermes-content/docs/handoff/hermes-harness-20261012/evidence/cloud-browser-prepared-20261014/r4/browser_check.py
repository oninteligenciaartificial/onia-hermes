#!/usr/bin/env python3
"""R4 wrapper: fresh admission, unchanged hash-pinned R3 browser behavior."""
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
source = helper["historical_source"]("browser_check.py", "aac64bb8ebc82441141787838458767125b7cdb01b28d75c0bdf2b5f46201ebb")
source = helper["replace_once"](source, 'c.get("operation_generation") != "R3"', 'c.get("operation_generation") != "R4"')
source = helper["replace_once"](source, 'provider.get("saved_at_utc") != "2026-10-14T18:05:55.372Z"', 'provider.get("saved_at_utc") != R4_SAVED_AT')
namespace = {"__name__": "r4_browser_core", "__file__": __file__}
exec(compile(source, __file__, "exec"), namespace)
namespace.update(AUTHORIZATION=contract["authorization_reference"],
                 CONFIG_RECEIPT_SHA=contract["configuration_receipt_sha256"],
                 R4_SAVED_AT=contract["configuration_saved_at_utc"])
if hashlib.sha256(Path(__file__).read_bytes()).hexdigest() != contract["child_source_sha256"]:
    raise SystemExit("BLOCKED_R4_CHILD_SOURCE")
if __name__ == "__main__":
    raise SystemExit(namespace["main"]())
