"""Local development-job selector: pre-dispatch provider choice + durable receipts.

Not a scheduler. One call = at most one execute_provider invocation per task_id, ever.
"""
import hashlib
import json
import math
import os
import re
import shutil
import stat

ID_RE = re.compile(r"[A-Za-z0-9][A-Za-z0-9_-]{0,63}")  # used with fullmatch
SHA_RE = re.compile(r"[0-9a-f]{64}")
MAX_PROMPT = 100_000  # UTF-8 encoded bytes, not characters
_DEVICES = {"CON", "PRN", "AUX", "NUL"} | {f"COM{i}" for i in range(1, 10)} \
    | {f"LPT{i}" for i in range(1, 10)}


class JobError(ValueError):
    pass


def _valid_id(v):
    return isinstance(v, str) and ID_RE.fullmatch(v) is not None \
        and v.upper() not in _DEVICES


def _is_reparse(path):
    """True for symlinks and Windows reparse points (junctions etc.) via lstat."""
    st = os.lstat(path)
    return stat.S_ISLNK(st.st_mode) or bool(
        getattr(st, "st_file_attributes", 0) & getattr(stat, "FILE_ATTRIBUTE_REPARSE_POINT", 0x400))


def _plain_dir(path, what):
    """Reject the path or any existing ancestor being a symlink/reparse point.

    Runs before any mkdir, so nonexistent descendants of a redirected ancestor are
    refused too. Check-then-use races are not covered.
    """
    if not isinstance(path, (str, os.PathLike)) or not os.path.isabs(path):
        raise JobError(f"{what} must be an absolute path")
    path = os.path.abspath(path)
    cur = path
    while True:
        if os.path.lexists(cur) and _is_reparse(cur):
            raise JobError(f"{what} must not be or sit under a symlink or reparse path")
        parent = os.path.dirname(cur)
        if parent == cur:
            return path
        cur = parent


def _validate(request):
    if not isinstance(request, dict):
        raise JobError("request must be a dict")
    for key in ("task_id", "attempt_id"):
        v = request.get(key)
        if not _valid_id(v):
            raise JobError(f"invalid {key}")
    if request.get("operation") != "development":
        raise JobError("operation must be 'development'")
    prompt = request.get("prompt")
    try:
        size = len(prompt.encode("utf-8")) if isinstance(prompt, str) else 0
    except UnicodeEncodeError:
        raise JobError("prompt is not valid unicode")
    if not size or size > MAX_PROMPT:
        raise JobError("prompt missing or oversized")
    ws = _plain_dir(request.get("workspace"), "workspace")
    if not os.path.isdir(ws):
        raise JobError("workspace is not a directory")
    return ws


def _digest(request, ws):
    blob = json.dumps([request["task_id"], request["operation"], ws, request["prompt"]])
    return hashlib.sha256(blob.encode("utf-8")).hexdigest()


def _exists(path):
    return os.path.isfile(path) and shutil.which(os.fspath(path)) is not None


def _abs_exe(path):
    return isinstance(path, (str, os.PathLike)) and os.path.isabs(path)


def _write_new(path, data):
    """Write-once: raises FileExistsError if path exists."""
    fd = os.open(path, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
    with os.fdopen(fd, "w", encoding="utf-8") as f:
        json.dump(data, f, sort_keys=True, allow_nan=False)
        f.flush()
        os.fsync(f.fileno())


def _replace(path, data):
    tmp = path + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(data, f, sort_keys=True, allow_nan=False)
        f.flush()
        os.fsync(f.fileno())
    os.replace(tmp, path)


def _preflight_ok(preflight_provider, provider, exe, ws):
    """Return (ok, error_code). Anything but a strict ok+auth dict is a stop."""
    try:
        r = preflight_provider(provider, exe, ws)
    except Exception:
        return False, "preflight_exception"
    if not isinstance(r, dict) or not isinstance(r.get("ok"), bool) \
            or not isinstance(r.get("auth"), bool):
        return False, "preflight_malformed"
    if not r["ok"]:
        err = r.get("error")
        return False, err if isinstance(err, str) and ID_RE.fullmatch(err) else "preflight_failed"
    if not r["auth"]:
        return False, "auth_failed"
    return True, None


def _finite_number(v):
    if isinstance(v, bool):
        return False
    return isinstance(v, int) or (isinstance(v, float) and math.isfinite(v))


def _sanitize_result(res):
    """Keep only the contract fields; None if the callback result is not clearly successful."""
    if not isinstance(res, dict) or res.get("state") != "ok":
        return None
    sha, model, usage, tools = (res.get("response_sha256"), res.get("observed_model"),
                                res.get("usage"), res.get("tools"))
    if not isinstance(sha, str) or not SHA_RE.fullmatch(sha):
        return None
    if model is not None and not isinstance(model, str):
        return None
    if usage is not None and not (isinstance(usage, dict) and all(
            isinstance(k, str) and (v is None or _finite_number(v))
            for k, v in usage.items())):
        return None
    if not isinstance(tools, list) or not all(isinstance(t, str) for t in tools):
        return None
    # None means UNKNOWN: never inferred from configuration, never claimed verified.
    return {"state": "ok", "observed_model": model, "model_observed": model is not None,
            "response_sha256": sha, "usage": usage, "tools": tools}


def run_job(request, state_root, primary_path, fallback_path, execute_provider,
            preflight_provider, dry_run=False):
    ws = _validate(request)
    root = _plain_dir(state_root, "state_root")
    tid, aid = request["task_id"], request["attempt_id"]
    digest = _digest(request, ws)
    task_d = os.path.join(root, "tasks")
    att_d = os.path.join(root, "attempts", tid)  # nested per task: no id-joining collisions
    res_d = os.path.join(root, "results", tid)
    task_f = os.path.join(task_d, f"{tid}.json")
    att_f = os.path.join(att_d, f"{aid}.json")
    res_f = os.path.join(res_d, f"{aid}.json")

    if os.path.exists(task_f):  # consumed: never replay, even with a new attempt id
        return {"status": "consumed", "task_id": tid, "attempt_id": aid}

    # --- pre-effect selection: no filesystem writes until execute ---
    if not _abs_exe(primary_path):
        return {"status": "stopped", "error": "primary_path_invalid"}
    if not _abs_exe(fallback_path):
        return {"status": "stopped", "error": "fallback_path_invalid"}
    if _exists(primary_path):
        provider, exe = "primary", os.fspath(primary_path)
    elif os.path.lexists(primary_path):
        return {"status": "stopped", "error": "primary_not_executable"}  # present but unusable: ambiguous
    elif _exists(fallback_path):
        provider, exe = "fallback", os.fspath(fallback_path)
    else:
        return {"status": "stopped", "error": "no_executable"}
    ok, err = _preflight_ok(preflight_provider, provider, exe, ws)
    if not ok:
        return {"status": "stopped", "error": err, "provider": provider}
    if dry_run:
        return {"status": "dry_run", "provider": provider}

    # --- first writes happen here; each dir is re-checked after creation ---
    try:
        for d in (task_d, att_d, res_d):
            _plain_dir(d, "state dir")
            os.makedirs(d, exist_ok=True)
            _plain_dir(d, "state dir")
    except OSError:
        return {"status": "stopped", "error": "state_dir_failed", "provider": provider}

    # --- reservation (write-once) then markers, all before the callback ---
    base ={"task_id": tid, "attempt_id": aid, "provider": provider, "request_sha256": digest}
    try:
        _write_new(task_f, dict(base, state="reserved"))
    except FileExistsError:
        return {"status": "consumed", "task_id": tid, "attempt_id": aid}
    except OSError:  # outcome uncertain (partial file possible): never retry, never fall back
        return {"status": "needs_reconcile", "error": "reservation_write_failed",
                "provider": provider, "task_id": tid, "attempt_id": aid}
    try:
        _write_new(att_f, dict(base, state="dispatching"))
    except OSError:
        return {"status": "needs_reconcile", "error": "marker_write_failed", "provider": provider}

    # --- effect: any failure from here on is ambiguous; never fall back ---
    try:
        safe = _sanitize_result(execute_provider(provider, exe, dict(request, workspace=ws)))
        why = "callback_result_ambiguous"
    except Exception:  # includes timeouts raised by the callback
        safe, why = None, "callback_exception"
    recon = {"status": "needs_reconcile", "provider": provider, "attempt_id": aid}
    if safe is None:
        _finish(att_f, base, "needs_reconcile", why)
        return recon
    try:
        _write_new(res_f, dict(base, **safe))
    except (OSError, ValueError):  # ValueError: non-serializable (nonfinite) value
        _finish(att_f, base, "needs_reconcile", "result_write_failed")
        return recon
    if not _finish(att_f, base, "completed", None):
        # attempt still reads 'dispatching'; no fallback write, no replay
        return dict(recon, error="finalize_failed")
    return {"status": "completed", "provider": provider, "attempt_id": aid, "result": safe}


def _finish(att_f, base, state, error):
    """Persist the final attempt state; False if it could not be written."""
    try:
        _replace(att_f, dict(base, state=state, error=error))
        return True
    except (OSError, ValueError):
        return False  # reservation + 'dispatching' marker already force reconciliation
