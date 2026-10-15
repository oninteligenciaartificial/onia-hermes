# Post-setup read-only audit and next gate

META: establish whether the installed setup-only runtime can be reused and identify
the historical R4 reconciliation path. Proof: observed UI controls, official
documentation, and one operation queried with SQLite URI `mode=ro`. Stop rule:
no new task, installation, browser launch, configuration change, queue mutation,
lease/reset, or new admission implementation.

## Runtime closure

Runtime receipts and restoration were independently reviewed and published in
`a9dafe1382280490889e2c7c7380987f345bea95`; remote branch matched and working tree
was clean. Result remains `INSTALLED_METADATA_ONLY`. The one installation grant
has been consumed. Browser, E2E, PC-off, material cache persistence and readiness
are not demonstrated.

## Reuse observation

At 15:03-15:04 UTC on 2026-10-15, the same terminal setup-only task exposed its
error/log card and a local-chat-reference composer, without a resume/runtime
terminal control. Its `Abrir en la web` link opened the generic ChatGPT composer,
not a running task environment; that extra tab was closed without sending input.
The environment detail offered `Editar entorno` and `Acciones del entorno`.
The latter menu contained only `Restablecer caché` and `Eliminar entorno`;
neither was selected. The menu was dismissed. Configuration remained restored.

[Official legacy environment documentation](https://learn.chatgpt.com/docs/environments/cloud-environment)
describes cached container resumption with maintenance and automatic cache
invalidation when setup or maintenance changes. Restoration changed those fields;
neither the enabled cache toggle nor the installation receipt establishes that
the installed filesystem survived. Actual cache availability is UNKNOWN. The
[new environment experience](https://learn.chatgpt.com/docs/environments/cloud-environments)
describes saved task tools and published prepared filesystems, but that does not
establish a resume mechanism for this observed legacy failed-setup card. No
reusable runtime was found through the documented/visible controls inspected.

## Historical R4 queue, read only

Checked `2026-10-15T15:08:00.811103+00:00`, using the existing database
`E:/onia-wt/onia-harness-native-run-20261014/queue.sqlite3` with SQLite URI
`mode=ro`. No bridge constructor or provider CLI was invoked.

- operation_id: `f90f55bc-48d8-406f-a11e-05ddd2683014`
- native task: `native-r4-f90f55bc-48d8-406f-a11e-05ddd2683014`
- surface: `cloud_cli_task`; operation state: `unknown`
- remote task: `task_e_6ad045ab00c08327bb4ea958581c5c82`
- task status/effect_state: `needs_reconcile` / `needs_reconcile`
- effect_name: `native_execution`; effect_key: original operation UUID
- observation state: `unknown`; observed_at: `1792035223`
- task updated_at: `1792036023`; phase is not a separate stored field.

The stored observation references the prior directed status capture; its error
card did not establish a cause. The observed setup source-selector failure and
later setup-only success are separate evidence, not a replacement result for R4.

Existing API findings, without invoking any mutator:

- `native_cloud_cli.py:442`, `status()`, calls `bridge.ingest()` for the known
  error-card shape; it is not a pure DB read and preserves cause UNKNOWN.
- `native_receipt_bridge.py:809`, `ingest()`, can bind a fresh typed observation
  to the same operation/input/surface/remote identity. It rejects stale, rebound
  or conflicting terminal observations. `failed` is a supported terminal state.
  It updates observation/evidence, not the task's unresolved effect status.
- Consequently, a reviewed failed observation can be proposed through the
  existing API, but requires a separately authorized mutation and exact original
  binding. It would not itself finish queue reconciliation. No reset/re-dispatch
  of R4 is justified.

## Minimum proposed next local lot (not implemented)

1. Review the original setup-failure evidence for a terminal failed observation
   and the existing queue QA/terminalization contract. Preserve the R4 identity,
   consumed nonce and history; do not manufacture a successful R4 result from the
   separate installation trial. Do not mutate until that narrow action is approved.
2. Before another runtime task, obtain a specific execution gate: reuse is not
   demonstrated, and the consumed installation grant does not permit reinstall.
   Any presence check must fail closed if required installed bytes/receipt are
   missing; no implicit download or version/source fallback.
3. For a future browser operation, review a fixed independent Root grant and pins
   before implementation. Likely affected files are `native_cloud_lineage.py`,
   a narrowly scoped final-guard candidate under this evidence tree, and focal
   tests. Reuse `NativeWorkRequest`, the `NativeWorkAuthority.verify` contract,
   and existing bridge validation. The current `RootReviewedR4Authority` only
   authenticates historical R4 pins and cannot authorize a new UUID. Preserve
   historical behavior; never select recipe approval from task-produced receipt
   data or a caller-provided `verified=True`.
4. Bind a future browser operation separately to the actual setup trial UUID and
   exact installed receipt/recipe/approved-manifest digests; do not relabel its
   setup receipt as the browser operation. Root must review exact operation,
   request, source/guard hashes, scope and readback before any effect. No new
   registry, generic authority framework, consumer patch or real test is included
   in this audit. Mother coordinates the narrow architecture/QA decision.

## Point 1: exact reconciliation proposal (read-only preparation)

Preparation and inspection are authorized now. Permission to execute an effect
is separate from whether the existing API can represent it. No installation or
runtime permission is needed to review these local sources. This section was
prepared without invoking a constructor, `status()`, `ingest()`, or queue mutator.

### Original evidence and exact binding

`provider-setup-failure.json:3-19` records the original authenticated task UI,
phase `environment_setup`, exit1 and exact error
`BLOCKED: no supported existing official Ubuntu binary source; no new repository`.
Its file SHA256 is
`d0edb27b41c496408da9b1201aacdf22f2c0d2c7a085cf121897fa8af5ecb6bf`.
Its observation time `2026-10-15T12:18:05.7955486Z` is Unix second `1792066685`.
It supports failure of this setup attempt, before browser execution; it does not
prove that every possible filesystem effect was absent. The later snapshot
diagnostics explain the selector failure but are not substituted for this task.

A further restricted SQLite `mode=ro` read confirmed the exact original pins:

- operation: `f90f55bc-48d8-406f-a11e-05ddd2683014`
- task: `native-r4-f90f55bc-48d8-406f-a11e-05ddd2683014`
- remote: `task_e_6ad045ab00c08327bb4ea958581c5c82`
- surface: `cloud_cli_task`
- input_sha: `59036a6d0509eab8b8289b5023fed3fe7dd50bc3061a959b8136423628be77a1`
- nonce: `planned-browser-009625eb-36ea-47cc-830c-7957aa96a4d4`
- current state: `unknown`; last observed_at: `1792035223`.

### Existing observation API, proposed only

`native_receipt_bridge.py:76` defines `NativeObservation`;
`:20-21` accepts terminal `failed`. The proposed existing API call is:

```python
bridge.ingest(NativeObservation(
    operation_id="f90f55bc-48d8-406f-a11e-05ddd2683014",
    surface="cloud_cli_task",
    remote_id="task_e_6ad045ab00c08327bb4ea958581c5c82",
    input_sha="59036a6d0509eab8b8289b5023fed3fe7dd50bc3061a959b8136423628be77a1",
    state="failed",
    observed_at=1792066685,
    evidence_ref="provider-setup-failure.json#sha256=d0edb27b41c496408da9b1201aacdf22f2c0d2c7a085cf121897fa8af5ecb6bf",
    result_sha=None,
), now=reviewed_execution_time)
```

This is a review proposal, not a runnable new command or approval. Before any
authorized execution: independently QA the evidence/hash; recheck exact row and
task bindings/state; preserve the prior observation payload/digest and relevant
row snapshot as a bounded sanitized write-once artifact. `ingest()` overwrites
the latest observation slot (`:857-863`), so it does not itself preserve an
append-only observation history. Do not claim otherwise. Preserve nonce,
work-event counters, dispatch binding, STOP state, lease state and original
evidence unchanged. Do not use setup-only receipt data in this observation.

API checks at `:819-855` require supported state, timestamp not in the future,
same reserved input, task still `needs_reconcile` owning this effect key,
observation after reservation, same remote identity and strictly newer time.
A terminal conflict must stop for review; it cannot be overwritten. On success,
only native state becomes `failed` and evidence/time update; task/effect stay
`needs_reconcile`. Expected return is `needs_reconcile` (`:864`). No dispatch,
nonce reset, task claim or replay is part of this proposal.

### Exact terminalization gap

`sqlite_pilot.py:534-598`, `SQLiteQueue.resolve_reconciliation()`, supports only:

- `outcome="applied"`: inserts `applied_reconciled`, makes task `done` and
  effect `applied` (`:575-590`). That is not supported by the original setup
  failure evidence and must not be used to manufacture successful reconciliation.
- `outcome="not_applied"`: demands manually verified quiescence for the exact
  ambiguous owner/fencing token (`:552-574`), then makes the original task
  `pending` / effect `not_started` (`:592-597`). It reopens work; it is not a
  terminal failed closure and is outside the no-replay proposal. A setup error
  alone is not the required exact owner-quiescence proof.

`complete_with_result()` (`sqlite_pilot.py:777-808`) requires an active matching
claim and effect `not_started`; the unresolved R4 effect fails that contract.
`complete()` delegates to that path. There is no existing failure-only terminal
queue API in the inspected queue contract. Furthermore, successor finite work
requires predecessor task `done`, effect `applied`, and native terminal state
(`native_receipt_bridge.py:305-311`); recording `failed` alone does not satisfy it.

Recommended review outcome: permit, if specifically authorized after QA, only the
accurate native `unknown -> failed` observation with prior evidence preservation;
keep the queue unresolved. For a truly terminal failed queue closure, first review
a separate minimal contract change rather than invoking either misleading
`applied` or retry-enabling `not_applied`. This preparation stops at that concrete
contract absence. No new terminalization implementation, authority, DB schema,
admission path, task or installation was added, and none was executed.
