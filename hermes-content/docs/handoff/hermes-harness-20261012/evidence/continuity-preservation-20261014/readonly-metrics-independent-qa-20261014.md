# Independent focal QA — readonly_metrics.py — 2026-10-14

META: review the new aggregate metrics instrument only; do not modify code or the real queue.
PRUEBA: inspect source and run 3–5 bounded scenarios on isolated temporary SQLite/JSON files.
PARADA: no real queue writes, provider/SSH, full suite, repeated prior QA, or code edits.

## Scope and artifact identity

- Reviewed: `E:/onia-wt/hermes-controller-pilot-20261013/hermes-content/docs/handoff/hermes-harness-20261012/readonly_metrics.py`
- SHA-256: `E1D97C3B8E9FF50D5C2EB5DBBFBACD478F4D03246448F652042555FCB3338187`
- Existing output snapshot: `E:/onia-wt/work-metrics-snapshot-20261014.json`, SHA-256 `4DD92C79159FC99941232EBAC9ED9A644B7AAAE85782CDE7D8B75B42FA7BB76D`.
- Existing execution report: `E:/onia-wt/work-metrics-luna-20261014.md`, SHA-256 `57489646B840DE0E67501D004697EB9015D658D76F29CB238D6BD6E1B36C1FD2`.
- No source edits; code worktree still shows only the new instrument as untracked.

## Review result

**PASS with two interpretation caveats.** Code opens SQLite URI with `mode=ro`, enables `PRAGMA query_only=ON`, and issues SELECT/PRAGMA reads only. It selects task state/effect/timestamps and native operation states, does not select IDs/payload/evidence/session/auth columns, and emits only allowlisted receipt keys. Unknown provider model, token usage, USD cost, and active context remain `UNKNOWN`. Queue `done/applied` is explicitly disclaimed as business-goal completion.

Five isolated standard-library scenarios passed:

1. Missing DB: read rejected with `OperationalError`; no database file was created.
2. DELETE-mode fixture: aggregate read left DB size, mtime, and SHA-256 unchanged; no journal sidecar appeared.
3. Aggregate fixture: task age, native operation state, and false guard returned as expected; no row payload exposed.
4. Receipt fixture with secret sentinel in non-allowlisted fields: returned JSON contained only allowlisted `state` and `tests`; sentinel absent.
5. WAL fixture with pre-existing `-wal`/`-shm`: read succeeded and created no additional sidecar. This does not establish behavior for every SQLite/filesystem/WAL state.

## Caveats (not code changes)

- `observed_at_utc` is captured before queue and receipt reads, so interpret it as snapshot start time, not completion time.
- Reads use separate autocommit statements. A concurrent writer could change data between task/operation/guard queries, producing a mixed-time aggregate; no such writer was present in these fixture checks. Consider a read transaction if cross-table consistency becomes a requirement.
- `measurement_elapsed_seconds` describes this local read/export path at microsecond rounding; it is not task or model latency. The existing reported `0.0 s` is consistent with a short process, not evidence of zero work duration.
- No full suite was run, no real queue was opened, and no old green QA was repeated.

## Snapshot interpretation

Existing snapshot reports schema 3, 4 tasks done / 4 effects applied, 4 native operations failed, guard false, task age 745–1511 seconds; receipt says mock/non-real provider and queue. These are reported states only, not business completion or a full execution-time measurement. Model served, tokens, cost, and active context remain `UNKNOWN`.

QA artifact: `E:/onia-wt/readonly-metrics-independent-qa-20261014.md`.
