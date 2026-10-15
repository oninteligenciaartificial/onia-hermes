# Native trusted launcher delta — 2026-10-14

## Outcome

Prepared an offline, pre-connect installation seam for the existing
`NativeTrustedRuntime`. It accepts the host's existing adapter, SQLite queue,
receipt bridge, transport, request, plan, claim, and `FileResultSink`; it creates
no queue, ledger, service, scheduler, or second orchestrator. The repository
still lacks the owning gateway startup/consumer code, so this is not an installed
Telegram endpoint.

The launcher rejects late installation. Prompt sending requires the connected
PTB app to be running and its bot object to be the same object exposed by the
adapter. It targets the configured actor's private chat, sends one request-bound
message, validates the returned private chat and message ID, and only then binds
the callback. Approval verifies through the adapter's existing callback gate
plus actor/chat/message/request bindings. Approval does not submit.

The prompt shows one fixed Codex Cloud task action, one unique
`ONIA_PURPOSE:` line from the public prompt whose SHA matches the reviewed plan,
contract/request/input/plan identity, the exact result allowlist, and requested
status/result caps against hard limits. Missing, duplicate, oversized, changed,
or credential-marker purpose text fails closed before issuing a challenge. A
delivery or keyboard-construction ambiguity leaves a challenge unbound; the same
request is blocked from sending again.

## Current verification

Offline fixtures only; no network, Telegram account, provider, service, or
operational queue was used.

- `python -m unittest test_native_trusted_launcher -v`: 7 passed.
- `python -m unittest test_native_work_entrypoint -q`: 18 passed.
- QA owns `qa_integration_native.py` and `qa_launcher_sender.py`; independent
  focal review passed 2/2 offline tests. The sanitized verdict is preserved in
  `qa-native-launcher-20261014.md` and `.json` in this directory.

Frozen files for QA review:

| File | SHA-256 |
|---|---|
| `native_trusted_runtime.py` | `FBD3015A859231D3B6661B6CD5AFEC3004CC2FC8BC1D6C940CAB206E79EB9AFF` |
| `native_trusted_launcher.py` | `6D88D29894A558248E90765F15C001213C899DF9463E6E6E92DB2C287D3A8CAC` |
| `test_native_trusted_launcher.py` | `9753CDC959A72ED43EDCF0657E8304AB5B130D250C929EFC1C8EFF06C9F1A3C8` |
| `NATIVE-TRUSTED-LAUNCHER-RUNBOOK-20261014.md` | `C4E1BD721CFC9D6D3E7F7E1607C3F947750473E406DF861A6FA579B6C169BA6A` |

## Remaining integration boundary

The adapter source snapshot shows handler registration during `connect()`, so
the host must install the launcher after constructing the adapter and before
calling `connect()`. Once `connect()` returns ready, it may call
`send_approval_prompt`. No host startup source is present in this checkout; use
the insertion recipe and 30-minute cycle in
`NATIVE-TRUSTED-LAUNCHER-RUNBOOK-20261014.md` only after separately approved
integration. The harness has no Telegram result-delivery or browser-capture
route. Existing sink persistence is available, but operator notification and
artifact capture remain manual.

The prepared cycle has not been executed. Do not install the endpoint, contact
Telegram, start a service, invoke a provider, or mutate/reset/replay the unique
operational queue as part of this delta. The offline review provides no live
activation evidence.
