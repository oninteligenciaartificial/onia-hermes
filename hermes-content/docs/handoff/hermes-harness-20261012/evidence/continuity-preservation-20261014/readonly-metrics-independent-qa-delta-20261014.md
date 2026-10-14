# Independent focal QA delta — readonly_metrics.py — 2026-10-14

META: review Root-requested fixes against the final reported source hash without changing code.
PRUEBA: verify output alias guards, transaction-consistent reads, and renamed/UNKNOWN fields on temporary fixtures.
PARADA: no real queue, provider, SSH, full suite, code edits, or overwrite of the original QA report.

## Artifact

`E:/onia-wt/hermes-controller-pilot-20261013/hermes-content/docs/handoff/hermes-harness-20261012/readonly_metrics.py`
SHA-256: `45931969F759F2CAF32D90C8D07C73FDC297F449A670E4870A8A9629E99035E8`.

## Result

**PASS: 3/3 delta scenarios.**

1. Output aliases rejected for queue DB, `-wal`, `-shm`, `-journal`, and receipt file.
2. Cross-table consistency: in a temporary WAL fixture, a second connection committed task/operation changes after the reader established its transaction snapshot; the export returned the original task and operation states consistently.
3. Output fields: lifecycle span reported as 10 seconds on fixture; old task-age fields absent; phase durations remain UNKNOWN; configured implementation model is distinct from run/served model, both UNKNOWN.

Combined with original five-scenario QA in `readonly-metrics-independent-qa-20261014.md`, all original checks remain historical against source hash `E1D97C3B8E9FF50D5C2EB5DBBFBACD478F4D03246448F652042555FCB3338187`; they are not represented as having been rerun against this revised hash. The revised snapshot output currently has SHA-256 `EFE960B86E3E605EBA99BB4026BB55C23D742003E789240101C7A9E2A112B816` and remains the author's single export from the existing queue; this reviewer did not open the real queue or rerun export.

No code changes, suite runs, real queue writes, provider calls, SSH, or commit/push.
