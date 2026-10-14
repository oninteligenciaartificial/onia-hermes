# Independent QA — native Telegram approval binding

Date: 2026-10-14

## Contract

- **META:** verify that one authenticated Telegram callback can authorize only the exact finite `NativeWorkRequest` (digest, operation, nonce, caps, expiry, expected actor, private chat, and bound message), while rejecting spoofing, cross-request use, expiry, denial, and replay.
- **PRUEBA DE HECHO:** six isolated stdlib fixtures against the frozen module; no Telegram SDK import, Telegram/service call, provider call, queue/DB, network, SSH, install, production action, or real human grant.
- **REGLA DE PARADA:** do not wire into runtime or imply a real human approval until a trusted factory/handler path binds the actual Telegram adapter, sends the approval message, and binds its returned message id. This QA does not establish that end-to-end integration.

## Frozen artifact and scope

- Worktree: `separate worktree path omitted`
- Ref: `codex/hermes-controller-hardening-20261013`
- Base HEAD: `0fb11294ba1018e55523f122d29cc667baddfdfb`
- Reviewed file: `hermes-content/docs/handoff/hermes-harness-20261012/native_telegram_authority.py`
- SHA-256: `d0d55908582b556ab05e823cc49565eeea00e78fc271b07f1a51b92c48549187`
- Existing harness boundary inspected: `NativeWorkRequest.digest()` binds the request fields; `NativeWorkAuthority.verify(request, now)` is the typed contract; the JSON event schema has no identity/approval fields; `NativeReceiptBridge` persists typed authorization and consumes nonce/operation at reservation/dispatch.
- Public Telegram source was read-only inspected at the specified callback dispatch/auth methods. No SDK dependency was imported or executed.

## Six focal fixtures

Offline fixture file: `offline fixture outside Git` (outside Git).

1. Exact actor, private chat and bound message grant; two `verify` calls return the same unexpired decision.
2. Authorized gate with wrong actor is denied.
3. Wrong private chat and group chat are denied.
4. Wrong message id and a false auth gate are denied.
5. Expired callback and replay after a successful callback cannot authorize.
6. Denial is sticky; changed nonce, operation id or caps do not match the grant digest; constructor rejects an object with no auth gate.

**Result:** all 6 fixtures passed (`Ran 6 tests`, 0.17s). This verifies the isolated module's logic using an adapter-shaped fixture; it does not prove Telegram authentication or runtime wiring.

## Findings

### HOLD — actual Telegram adapter provenance and runtime binding are unproven

`TelegramNativeWorkAuthority.__init__` accepts any object with callable `_callback_ctx` and `_callback_authorized` methods. The isolated fake adapter in the fixtures can return `True`, so it can mint a grant if a caller supplies it. The module documents that only a trusted runtime may bind the live adapter, but this artifact contains no factory, registration, message-send path, or code proving that only the actual Telegram adapter instance can reach this constructor. Consequently, the code and fixtures prove request-bound behavior after an auth-gate result; they do not prove that a real authenticated Telegram callback is the only source of that result.

Required before integration: provide a trusted factory/launcher boundary that obtains the already-configured real Telegram adapter, issues approval only for the new reviewed request, sends the callback message through the trusted route, and calls `bind_sent_message` with the returned Telegram message id. Keep the event JSON unable to supply identity or grant fields. Add an integration-level offline test around that factory with the source adapter API shape and no SDK/network calls.

### PASS — request/callback binding within the isolated authority

The module uses an opaque random challenge, hashes it for state lookup/evidence, binds the challenge to the request digest plus expected actor/chat, requires a private chat and the sent message id, rejects expired/missing state, consumes the challenge atomically under a lock, and returns a repeatable typed authorization only while it remains unexpired. Denial is sticky for the authority instance. It does not introduce `always` or an event-JSON authorization field.

## Final status

**HOLD for integration; PASS for the six isolated behavioral fixtures.** No source code was edited by QA. The only QA files are the report and fixture script outside the reviewed Git worktree. No commit or push was made.

## Report path correction

QA report saved at the requested independent path. The initial QA write mistakenly targeted the author's report path and overwrote its prior contents; the parent was notified immediately. No source code was modified. The overwritten author's original report has not been recovered; preserve it from any available history or backup if needed.


## Segundo pase focal de fábrica

Solicitado por el autor tras el hallazgo de procedencia. Archivo revisado nuevamente: mismo módulo, SHA-256 `6d1656c9f874ffe4126503a0301bc837b5458d98430e7934a0d016476f5b2d39`.

Fixture exterior al repo: `offline factory fixture outside Git`.

1. Un objeto duck con métodos de callback no pasa el constructor directo; tampoco pasa `_from_trusted_launcher` frente a una clase `TelegramAdapter` sintética instalada solo en `sys.modules` para el fixture. Resultado: PASS.
2. La importación del módulo de autoridad no importa el plugin Telegram. Cuando se invoca la fábrica con el plugin ausente simulado, intenta la ruta exacta y devuelve HOLD (`RuntimeError`), sin fallback. Resultado: PASS.

**Resultado:** 2/2 fixtures pasaron. El tipo sintético sirve solo para comprobar `type(...) is TelegramAdapter`; no se importó ni ejecutó el plugin/SDK real. La autenticación real, la fábrica llamada por el launcher, el envío/bind del mensaje y la ruta callback activada siguen sin probarse; mantener HOLD para integración/activación. Este pase no modifica ni sustituye el primer resultado de seis fixtures.
