# development_job

Small local selector, not a scheduler. `run_job(request, state_root, primary_path, fallback_path, execute_provider, preflight_provider, dry_run=False)`.

Flow: validate input → (consumed task? stop) → pick provider → preflight → reserve task (write-once) → write `dispatching` attempt marker → call `execute_provider` → write result receipt.

- Primary and fallback paths must both be absolute. A relative or bare path (e.g. `claude`) is invalid (`primary_path_invalid` / `fallback_path_invalid`), is not evidence of a missing CLI, and never enables fallback.
- Fallback is chosen only when the absolute primary path does not exist at all (`os.path.isfile` + `shutil.which`). A present-but-unusable primary, a preflight error, or `auth: false` stops with no callback. The fallback needs its own executable check, `ok: true` and `auth: true`.
- Once reserved, a task never runs again, even with a new attempt id. Callback exceptions, timeouts, malformed results and a failed final persist give `needs_reconcile` (`error: finalize_failed` when the result receipt was written but the attempt could not leave `dispatching`; no replay, no fallback). Fallback never runs after dispatch. A non-`FileExistsError` OSError while writing the reservation gives `needs_reconcile` (`reservation_write_failed`, sanitized): a partial reservation may exist, so no callback, no fallback, and later attempts read as consumed. Usage numbers must be finite (NaN/±Infinity and bools rejected); receipts are written with `allow_nan=False`, and a persist failure stays fail-closed.
- IDs: `task_id`/`attempt_id` must fully match `[A-Za-z0-9][A-Za-z0-9_-]{0,63}` (no trailing newline) and not be a Windows device name (CON, PRN, AUX, NUL, COM1-9, LPT1-9, any case).
- `prompt` is limited to `MAX_PROMPT` = 100,000 UTF-8 encoded bytes (not characters).
- State layout: `tasks/<task>.json` (reservation), `attempts/<task>/<attempt>.json` (marker, then final state), `results/<task>/<attempt>.json` (`state`, `observed_model`, `model_observed`, `response_sha256`, `usage`, `tools`). Nested directories avoid id-joining collisions. No prompt text or credentials are stored; only a request digest.
- `observed_model: null` means UNKNOWN: it is never inferred from configuration, and `model_observed` is `false` then. Only a non-null callback observation sets it `true`.
- The callback owns WindowsJob launch, its deadline (`windows_job.launch` has no timeout) and `job.close()` on every exit path. The env, auth and model observations are the operator's.
- `dry_run=True` runs validation, selection and preflight only and performs zero filesystem writes (a nonexistent `state_root` stays absent). Preflight is a trusted, operator-supplied, read-only call. State directories are created only on execute.

Run tests: `python -m unittest test_development_job`

Risks: a crash between reservation and receipt leaves the task consumed (deliberate). The workspace, `state_root` and every existing ancestor are rejected if they are symlinks or Windows reparse points (`os.lstat` + `FILE_ATTRIBUTE_REPARSE_POINT`), checked before any mkdir and again after each directory is created; a race between check and use (TOCTOU) is not eliminated. This is not an OS sandbox. Tests: injected reparse detection plus a real symlink (skipped if unavailable); a real junction is not tested. Callbacks are never retried automatically. Tests have not been run.
