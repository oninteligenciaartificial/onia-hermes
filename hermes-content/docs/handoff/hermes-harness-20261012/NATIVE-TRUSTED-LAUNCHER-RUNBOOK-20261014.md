# Native trusted launcher: wiring and activation preparation

Status: local code and offline fixtures only. The `/onia_native_*` caller is a
local Telegram-adapter integration seam, not a connected or live Telegram
endpoint. No Telegram endpoint, host entrypoint, service, provider, or
production process was changed or started.

## What is wired

`native_trusted_launcher.install_native_trusted_runtime_before_connect(...)`
accepts the already-open adapter, queue, native receipt bridge, transport,
request, reviewed plan, current claim, and existing `FileResultSink`. It rejects
an adapter whose `_app` is already populated, checks object identity through
`NativeTrustedRuntime.bind`, installs the `na:` callback wrapper, and returns the
runtime. It has no queue-path constructor and does not call `connect()`.

The local caller exposes four no-argument commands: `/onia_native_submit`,
`/onia_native_status`, `/onia_native_result`, and `/onia_native_qa`. It installs
before `connect()` and wraps only the adapter's existing command/callback
dispatchers; unrelated commands and callbacks continue through their original
handlers. Each command requires a running adapter, a private chat where actor
ID equals chat ID, the adapter's existing authorization gate, and an exact
configured user allowlist with no wildcard. The command reply is only a short
sanitized state acknowledgement; it does not send a result file or perform
operator delivery.

Submit requires the still-valid one-use request-bound approval. Status, result,
and QA commands bind to the durable native receipt and persisted actor/request
authority, then remain subject to the request's event caps. Restart does not
recreate approval or authority and cannot grant a new effect. The Telegram
caller has no setup/revalidation command and cannot invoke Root's setup
revalidation path. These guarantees are covered only by local integration
fixtures; no live Telegram connection or end-to-end command has been exercised.

The Telegram adapter snapshot registers
`CallbackQueryHandler(self._handle_callback_query)` while `connect()` builds its
application. The hook therefore belongs directly after the host constructs its
adapter and before it calls `connect()`. The host startup/consumer module is not
present in this checkout, so this insertion has not been made or represented as
an installed endpoint. The source snapshot reviewed for this finding is
`E:/onia-wt/hermes-telegram-source-20261014/adapter.py.source`.

Future host insertion, once the owning host code is available and reviewed:

```python
adapter = existing_adapter_factory(config)
native_runtime = install_native_trusted_runtime_before_connect(
    adapter,
    queue=existing_queue,
    bridge=existing_native_bridge,
    transport=existing_native_transport,
    request=reviewed_request,
    plan=reviewed_plan,
    claim=current_queue_claim,
    result_sink=existing_file_result_sink,
)
await adapter.connect()
# Only after connect has completed and the bot is ready:
prompt_result = await native_runtime.send_approval_prompt(
    actor_id=trusted_private_actor_id,
    private_chat_id=trusted_private_chat_id,
)
```

The actor/chat values above must come from trusted host configuration, never
from callback/event JSON. The caller must pass the original live queue objects;
constructing a queue or bridge here would create or migrate state and is outside
this hook's contract. `send_approval_prompt` verifies a private actor/chat pair,
uses the exact adapter bot, sends once, checks the returned private chat ID and
message ID, and binds the callback only after that check. A send timeout or
unverifiable response is ambiguous: the challenge remains unbound, the method
returns HOLD, and a repeated call for the same request is blocked before another
send. Restart loses in-memory approval state and fails closed.

The prompt displays only one explicitly marked `ONIA_PURPOSE: ...` line from the
reviewed public input. The plan prompt SHA must match, the purpose must be
nonempty and at most 500 characters, and credential-marker checks must pass;
missing, duplicate, oversized, or suspicious purpose lines hold before creating
a challenge. The prompt also displays the fixed one-task Codex Cloud action,
`contract_id`, request/input/plan digests, repo/ref/head, task and operation IDs,
exact result-path allowlist, and requested status/result event caps against their
hard ceilings. The human must review the purpose before consent; the launcher
does not invent a purpose or accept one from callback/event JSON. Plan/request
digest or repo/ref/head mismatch holds before an approval challenge is created.

Approval records a one-use grant only. It does not submit work. Submission still
requires the host to pass a separate explicit, request-bound event to
`native_runtime.handle_event(...)`; malformed or mismatched input holds before
dispatch. Callback authorization is checked by the adapter's existing callback
gate, then actor, private chat, and message bindings are checked against the
pending challenge.

## Delivery and recovery gaps

The repository contains no owning Telegram gateway startup/consumer source to
accept the pre-connect insertion. This patch is therefore a tested launcher
seam and insertion recipe, not live host integration. Local recovery is now
prepared: after the existing `result` event, the entrypoint stores the validated
bundle through `FileResultSink` and binds `{ref, sha256, bytes_written}` to that
event in `work_events_json`. A later `qa` event reloads only the exact bundle
named by the durable receipt and verifies its bytes and request identity before
calling the required external `qa_verifier`. This is not a new queue/schema or
Cloud collection. The Telegram host remains uninstalled; there is no file
delivery route or live activation, and this local recovery path establishes no
live QA PASS.

An ambiguous approval send is deliberately not retried. If the operator cannot
find the message, reconcile through the trusted host procedure and create a new
reviewed request only after the prior request's state is resolved. Do not reuse
the request, bypass its pending challenge, or fabricate a callback receipt.

## POSIX co-location and one-queue cutover proposal (not executed)

### Evidence and limits

- The captured installed-source snapshot is dated 2026-10-14 and reports
  `/usr/local/lib/hermes-agent`, Hermes module version `0.21.0`, and SHA-256
  `79a8704da45baf702e1e9590a1b55feac9439722685705a4eb1b3f545dc134d3` for
  `gateway/run.py` and
  `187b3324eeec09f15ff923fcf21e80c7b687c02194267791e0ed4d157401c08b` for
  `gateway/run_startup.py`; the full table is also recorded in
  [native-host-source-20261014.md](evidence/native-host-source-20261014.md).
  The snapshot proves the inspected source shape only. The current live package,
  running process, service unit, process owner, and hash equality were not checked
  for this proposal.
- The unique native harness queue is on the Windows PC at
  `E:/onia-wt/onia-harness-native-run-20261014/queue.sqlite3`. The captured
  gateway runs on Linux; `E:` is not a POSIX path. The host snapshot contains no
  native queue/bridge/transport or `FileResultSink` consumer. The target POSIX
  queue path, result-sink root, owner, retention, and secure transfer mechanism
  are **unknown**.
- As of 2026-10-15T03:47:03Z, the external R4 checkpoint
  (`E:/onia-wt/r4-final-checkpoint-20261015.json`, SHA-256
  `a066559fb5ee3e920ad027cffd6b49952fede055825f196593af4ccec9ff6b20`)
  records operation state `unknown`, task and effect
  `needs_reconcile`, with submit/status/result caps exhausted at 1/1, 2/2, and
  1/1. That Cloud attempt is not proof of Telegram gateway wiring or PC-off
  operation, and its grant/caps cannot be reused for a migration canary.

### Integration seam and required live objects

The source-grounded initial-startup seam is
`GatewayStartupMixin._start_prefilter_platforms`: after adapter creation and
`_wire_adapter_handlers(adapter)`, before the adapter enters
`_pending_connects` and before `_start_connect_pending` calls `connect()`.
In the captured source these are `gateway/run_startup.py:904–918`,
`921–936`, and `1258–1268`; `GatewayRunner` inherits the mixin from
`gateway/run.py`. The Telegram adapter snapshot registers
its callback handler during `connect()`, so installation after connect is too
late. This remains a captured-source finding, not a verified live-host seam.

The seam must receive the original live instances owned by one POSIX gateway
process: `SQLiteQueue`, its `NativeReceiptBridge`, the bridge-bound
`NativeCloudCLI`, the reviewed request and plan, the current claim, and a
`FileResultSink` rooted at an existing private POSIX directory. The adapter,
queue, bridge, transport, claim, and sink must be retained by the same runtime;
reopening the same database into another queue object or passing a Windows path
does not satisfy the object-identity contract. The captured gateway has no
verified owner for this bundle or a result-delivery route. Prompt sending must
remain an explicit post-connect action after adapter readiness; gateway startup
must not send or submit work automatically.

The production sink requires an existing private POSIX root and working
directory-fsync/publication support; its constructor probes publication, so its
exact path, owner, quota, and startup-write behavior must be approved and tested
before live gateway startup. If a concrete operation needs a result bundle or
QA verifier, its trusted caller must supply those objects too; the captured host
does not provide them.

### Candidate cutover sequence

1. **Confirm the live target and authority.** Read the currently installed
   source/version and service definition on the actual POSIX host; compare the
   reviewed hashes, identify the sole service/process owner, dedicated OS
   account, queue and sink paths, filesystem permissions, backup retention,
   and approved secure transfer route. None of these live details is established
   by the historical source capture.
2. **Keep one ledger and freeze its writer.** Do not map the Windows drive,
   serve SQLite over a network filesystem, initialize a second queue, or run a
   PC controller beside the VPS gateway. Before cutover, prevent new queue
   writes and stop the current writer through its approved procedure; verify
   there are no open write transactions. Preserve pending tasks, leases,
   fencing values, receipts, event counts, STOP state, bootstrap and authorization
   records exactly. The unresolved R4 stays `unknown`/`needs_reconcile` until
   reconciled from evidence; it is never reset, replayed, or used as the new
   canary.
3. **Make one consistent backup.** With the writer frozen, use SQLite's backup
   API (or an equivalently verified cold backup after all handles are closed),
   not a raw copy of a live database file. Preserve the original immutable
   backup and record its path, byte count, SHA-256, schema/user version,
   integrity-check result, foreign-key-check result, and a redacted logical
   inventory of queue counters and states. Keep database content out of Git.
4. **Restore and verify before cutover.** Restore that same snapshot to one
   dedicated private POSIX path with restrictive ownership and permissions.
   Compare schema and logical records for tasks, leases/fences, handoffs,
   results, native operations, request/authority/receipt digests, work-event
   counters, STOP state/epoch, bootstrap and authorization pins. Require
   `integrity_check` to return `ok` and no
   foreign-key violations. A hash of a new SQLite file alone is not proof that
   its logical state matches the source snapshot.
5. **Switch one owner only.** Point the single gateway process at the verified
   restored queue and sink, construct the live object bundle once, and wire the
   runtime at the pre-connect seam. Retain the prior PC copy as an inactive
   recovery snapshot; do not leave it writable or create a second active
   controller. Keep callback-to-result persistence and operator delivery
   explicit and auditable.
6. **Validate only after separate approval.** Offline checks may verify the
   restored database and tested wiring without connecting Telegram. A live
   service change/restart, Telegram prompt, or provider operation needs its own
   authority. Use a fresh, explicitly reviewed canary after all prior effects
   effects that could conflict with this queue owner/cutover are reconciled; do
   not reuse the spent R4 grant. The PC-off test has **not**
   been performed. It would require a separately approved end-to-end run while
   the PC is confirmed off, with the POSIX gateway active and the result
   durably captured by the POSIX sink.

### Rollback and missing permissions

Before any cutover, the owning human must authorize the host/service change,
the exact queue migration and secure transfer, creation or selection of the
dedicated POSIX owner and private sink directory, and the new canary's purpose,
actor/chat, request, budget, and result destination. This proposal grants none
of those permissions and performs no SSH, copy, service, package, credential,
Telegram, or provider action.

If validation fails before any new external effect, stop the sole writer,
preserve the POSIX copy, compare it with the verified backup, and return to one
writer only after the exact state is established. If any event or external
effect occurred after cutover, freeze the writer and preserve a new forward
snapshot; reconcile those effects before choosing a rollback. Never restore an
older backup over newer receipts, counters, STOP state, or remote effects. If
inclusion of any effect cannot be proven, retain `HOLD`/`needs_reconcile` and
do not resume work from the old copy.

## Prepared one-cycle checklist (not executed)

This candidate sequence is not an authorization to start a service or contact
Telegram. The separately authorized scope must define the operation and its
actual event limits. A 30-minute show-and-tell is only a time-sampled view of
what is working; it is neither the duration nor completion criterion for R4,
and it adds no authority or work budget.

1. Before the window, a human grants the exact operation, account, repo/ref/head,
   reviewed plan SHA, budget, actor/chat, and result path. Confirm the host
   adapter source/version and obtain its owning startup file. Confirm that the
   existing queue, bridge, current claim, transport, and result sink are the
   exact instances used by that host. Confirm STOP is clear using the approved
   read path; never initialize, reset, or replay the operational queue.
2. At minute 0, install the wrapper before `connect()`. If startup is already
   connected, stop at HOLD; do not reconnect or patch a live handler.
3. After the bot reports ready, send one approval prompt to the trusted private
   chat. Confirm its returned private-chat/message binding. If send outcome is
   ambiguous, keep HOLD and do not retry. Accept only the authenticated callback
   for that exact actor, chat, message, request, and expiry.
4. Approval alone must not submit. A separately reviewed explicit event may be
   dispatched once. Observe status only through the existing bounded path,
   without scheduler, retry, alternate queue, or second submit. If a
   30-minute demonstration is requested, capture the same evidence at the
   agreed sample points (for example, 0, 15, and 30 minutes); those samples
   show behavior at those times and do not set the task's duration, completion
   status, or stop condition. Respect the task's own reviewed limits and STOP.
5. Persist the result with the existing sink, then verify its reference and
   SHA after reopening it. Independent QA decides whether the result is accepted.
   Telegram delivery/capture is manual because no result route is implemented.

## Rollback and stop conditions

Before `connect()`, call `runtime.uninstall_before_connect()` only if the adapter
still holds this runtime's wrapper. If the wrapper changed or an app already
exists, fail closed and let the owning host operator handle the process; do not
mutate its live handler. After any explicit submit, do not claim cancellation or
remote quiescence. On STOP, ambiguous provider response, lost lease, unexpected
task identity, or result-integrity failure: stop issuing new events, use the
existing approved STOP and reconciliation procedure, preserve the queue and
receipt, and do not reset, replay, or retry. No automatic Telegram send retry
exists.

## Offline verification

`python -m unittest test_native_trusted_launcher -v` exercises the pre-connect
hook, exact live objects, late-install rejection, private-chat/message binding,
ambiguous-send HOLD/no-resend, identity mismatch, and pre-connect-only uninstall
with temporary fixtures. It does not install Telegram dependencies, access the
network, call a provider, or use the operational queue.

## Host-source evidence delta — 2026-10-14

A bounded read of installed public gateway source confirmed the initial pre-connect insertion seam in `GatewayStartupMixin._start_prefilter_platforms` and adapter lifecycle wiring. This is a 2026-10-14 source capture, not proof of the current live host package or process. The host has no verified native `FileResultSink` consumer, and its Linux gateway cannot share the current PC-local queue by object identity. Sanitized source findings, hashes, external report links, and topology limits are recorded in [native-host-source-20261014.md](evidence/native-host-source-20261014.md). No host patch or activation was applied; the candidate demonstration remains unexecuted and separately gated. The 30-minute sample window is not an R4 duration or completion rule.
