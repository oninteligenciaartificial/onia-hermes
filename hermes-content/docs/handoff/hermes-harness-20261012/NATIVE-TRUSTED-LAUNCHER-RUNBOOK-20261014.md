# Native trusted launcher: wiring and activation preparation

Status: local code and offline fixtures only. No Telegram endpoint, host entrypoint,
service, provider, or production process was changed or started.

## What is wired

`native_trusted_launcher.install_native_trusted_runtime_before_connect(...)`
accepts the already-open adapter, queue, native receipt bridge, transport,
request, reviewed plan, current claim, and existing `FileResultSink`. It rejects
an adapter whose `_app` is already populated, checks object identity through
`NativeTrustedRuntime.bind`, installs the `na:` callback wrapper, and returns the
runtime. It has no queue-path constructor and does not call `connect()`.

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
seam and insertion recipe, not live host integration. The harness has no
Telegram result-delivery or browser-capture route. Results can be persisted
through the supplied `FileResultSink`, but notifying the operator and delivering
or capturing the resulting artifact remain manual host responsibilities. Do not
claim end-to-end Telegram result delivery or live recovery until that host path
exists and is independently reviewed.

An ambiguous approval send is deliberately not retried. If the operator cannot
find the message, reconcile through the trusted host procedure and create a new
reviewed request only after the prior request's state is resolved. Do not reuse
the request, bypass its pending challenge, or fabricate a callback receipt.

## Prepared one-cycle checklist (not executed)

The following is a future, separately authorized 30-minute exercise. It is not
an authorization to start a service or contact Telegram now.

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
   without scheduler, retry, alternate queue, or second submit. At roughly
   minutes 15 and 30, record the existing receipt/status evidence and sink
   reference; stop at the approved 30-minute boundary even if work remains.
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
