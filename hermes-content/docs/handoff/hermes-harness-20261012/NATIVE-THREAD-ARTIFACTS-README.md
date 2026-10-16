# Native chat thread artifact recovery (bounded adapter)

QA-extension snapshot: `02a3835449f8fc59a8922997d2d45a90138cbd0c`, obtained through the
existing GitHub connector. This snapshot is not an updated Git checkout. The
implementation receipt records source blob IDs/SHA-256 and validation limits.

`NativeThreadArtifacts` recovers explicitly exported JSON file bytes for an
**already bound** `codex_app_chat` operation. It does not create work, threads,
queues, authorities, transports, schedulers or network clients. `NativeCloudCLI`
is unchanged and remains specific to `cloud_cli_task` / `task_e_…` identities.

## Trusted integration contract

The authorized in-process integration supplies:

- The existing bridge, exact `NativeWorkRequest` and reviewed runtime plan.
- `CloudThreadProvenance`: exact UUID, `surface=codex_app_chat`, `host_id=durable`,
  `cloud_execution_verified=True`, and an opaque reference to independently
  verified native Cloud execution evidence. UUID/host label alone is insufficient.
  This object is a trusted runtime binding, never a parsed user/agent assertion.
- An `AuthenticatedThreadArtifactReader.read_artifacts(provenance, request,
  max_bytes)` implementation authenticated to the original thread. It returns
  `AuthenticatedThreadArtifacts` with the same provenance, operation/input SHA,
  observed HEAD, opaque source reference and tuple of `ThreadArtifactBytes`.
  Each artifact has an exact allowlisted path, bytes and SHA-256. The reader must
  bound reception to `max_bytes` before allocating an unbounded response and
  must not retry, discover other threads, scrape narrative text or fall back.

No concrete authentication or live native thread transport is implemented here.
Constructing a dataclass with `True` does not authenticate its caller. A production
integration must establish and retain the independent evidence before binding it.

## Existing event path

Bind the result-only adapter as `NativeWorkRuntime.transport` and use the existing
`handle_native_event` result event. `step_native_work` consumes the durable event
and request-bound result budget **before** calling `collect_result`; do not call
that transport method as a public alternative to event admission. Local one-shot
protection is additional, not distributed provider idempotency. Failed, oversized,
ambiguous or interrupted reads remain consumed and require explicit reconciliation.
There is no submit or status method and no automatic retry.

The response must contain exactly the requested safe JSON paths (1–8), with no
duplicates, and at most 128 KiB total exported bytes. Each file must be UTF-8
canonical JSON (sorted keys, compact separators, non-ASCII retained, no NaN or
duplicate keys), with exact operation/input SHA and repository expected/observed
HEAD. The byte hash and length are checked before persistence and rechecked on
recovery. Agent prose, READY labels, metadata, wrong identities, local hosts,
missing provenance, traversal and partial file sets fail closed.

The existing sink stores the canonical result bundle and the existing bridge
records its receipt. Restart recovery uses only that exact receipt and revalidates
the trusted provenance and file identities; it never rereads a provider by path.
Raw artifacts and provenance are omitted from the sanitized event response.

## Independent QA closure (contract 08)

Artifact recovery returns `awaiting_independent_qa`; recovery alone never changes
the native operation to completed or resolves the queue. A QA event must first
reload the exact sink receipt/bytes and validate the persisted surface/ID and
trusted provenance. The existing controller admits the QA event before invoking
the independently authenticated `qa_verifier` supplied by the trusted caller.
There is no default verifier and no model/provider call in this module.

For chat, the verifier must return `verified=True`, `request_sha=request.digest()`,
`bundle_sha=controller_pilot.digest(bundle)`, exact `remote_id` (thread UUID),
`operation_id`, `surface=codex_app_chat`, `host_id=durable`, and
`provenance_sha256=controller_pilot.digest(asdict(trusted_provenance))`.
It must supply nonblank `reviewer_id`, `authority_source`, `evidence_ref`, and
`goal_outcome` of `completed` or `failed`. Reviewer identity must differ from the
worker, bound thread and operation owner. The injected verifier must establish
actual independent review and authentication; matching JSON fields alone do not.

The controller rechecks the bundle's canonical-byte hash/length against the
existing persisted receipt, plus artifact provenance/identity/hash, before QA.
Only a passing bound review records a terminal observation on the **persisted
surface** and resolves that finite closure. Missing/mismatched evidence stays
unclosed. READY, text or a worker self-review cannot close it. Consumed QA event
IDs do not rerun a verifier, including after a crash. Existing STOP semantics
allow reconciliation of submitted work while preserving STOP and withholding the
next candidate; they do not grant a new dispatch. No global goal is closed.

This supersedes contract 07's unconditional chat QA HOLD, solely for the validated
QA path above. No schema, migration, authority source, legacy, R4, delivery or
queue guards changed. Existing CLI QA response requirements remain unchanged.

## Offline validation

```sh
python -B -m unittest test_native_thread_qa test_native_thread_artifacts test_native_cloud_cli test_native_receipt_bridge test_native_work_entrypoint.NativeWorkEntrypointTests -q
```

These tests use offline reader/sink/reviewer fakes and temporary ledger fixtures.
They exercise admission ordering, result budgets, restart recovery, QA closure,
rejection, replay and CLI
regression; they do not prove authenticated live transport or filesystem sink
durability. Six existing `NativeResultRecoveryTests` require a private temporary
root outside any Git worktree. On this executor, Git markers at writable roots
prevent those fixtures from constructing `FileResultSink`; the guard was retained
and those failures are recorded, not counted as passes. The sink fixture uses
mode 0700 to meet the existing POSIX private-root requirement where runnable.

This patch does not prove multi-provider operation or complete PC-off continuity.
