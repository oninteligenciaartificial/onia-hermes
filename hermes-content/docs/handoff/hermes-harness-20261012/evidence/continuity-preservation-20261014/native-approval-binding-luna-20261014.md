# Native Telegram approval binding — 2026-10-14

## META / DONE / HALT

- **META:** add a minimal request-bound approval authority for a new finite native operation using the Telegram adapter's existing trusted callback authorization method.
- **DONE:** reviewable standalone module `hermes-content/docs/handoff/hermes-harness-20261012/native_telegram_authority.py`; it is not registered, called by the entrypoint, or deployed.
- **HALT:** no production deploy, provider CLI, Cloud R4, Telegram API send, bot issuance, login, install, real secrets, real SQL changes, queue bootstrap, historical grants, or verified fixture used as a live grant. No commit/push before independent QA and Root ACK.

## Contract and implementation

- The harness defines `NativeWorkAuthority.verify(request, now)` in `native_receipt_bridge.py`. `step_native_work` calls it once during `submit`; durable reserve independently verifies exact request digest, `grant_nonce == request.nonce`, expiry, operation, plan, lease and predecessor, then persists the receipt before provider dispatch. `verify` is idempotent; existing core remains responsible for durable nonce consumption.
- The callback challenge is separate from the harness nonce. The module binds opaque callback data to request digest, expected actor, private chat, sent message ID and bounded expiry. It authenticates through the adapter's `_callback_ctx` and `_callback_authorized` methods, consumes approve/deny once, and returns typed authorization only for the exact request. It has no `always` choice, generic approval resolver, event JSON identity fields, network, message-send or handler registration.
- After independent QA found that a duck-typed adapter could be passed directly, constructor creation now requires an identity-only module capability. The private `_from_trusted_launcher` factory lazily imports `plugins.platforms.telegram.adapter.TelegramAdapter`, requires `type(adapter) is TelegramAdapter`, and fails closed on missing class, wrong type or missing callback methods. The module's initial import remains standard-library-only. This closes the duck-adapter constructor path; it does not claim protection against arbitrary code executing inside the same trusted Python process or a modified import system.
- Pending grants and approved decisions are in-memory. Restart loses them and fails closed. This module remains unintegrated: only a future trusted launcher can construct the authority and must bind a fresh request, send via the already authorized route, bind the returned message ID, and route callbacks. Real Telegram actor/authentication and runtime wiring remain unverified.

## Source evidence

- Existing harness contract files inspected in worktree `separate worktree path omitted`, branch `codex/hermes-controller-hardening-20261013`, base HEAD `0fb11294ba1018e55523f122d29cc667baddfdfb`.
- Read-only public adapter snapshot: `public adapter snapshot stored outside Git`, SHA-256 `a50b10a713b6b40d71531ef6e133cc99285c35a860b5bf2c947e81e3968c18a6`. Selected ranges showed `_handle_callback_query` routes `ea:` to legacy exec approval; `_callback_authorized` calls `_is_callback_user_authorized`. The new authority does not call the legacy `resolve_gateway_approval` path.
- Current module SHA-256 after factory fix: `6d1656c9f874ffe4126503a0301bc837b5458d98430e7934a0d016476f5b2d39`.

## QA status

- Independent reviewer ran six isolated standard-library behavior fixtures against initial SHA-256 `d0d55908582b556ab05e823cc49565eeea00e78fc271b07f1a51b92c48549187`: request binding and repeat verify, wrong actor/chat/group/message, false gate, expiry, replay, denial and changed digest fields passed (6 tests, 0.17 s). Those six were not rerun after the factory-only fix; QA found the duck-adapter constructor gap, which the current version closes with the lazy exact-class factory.
- Against final SHA-256 `6d1656c9f874ffe4126503a0301bc837b5458d98430e7934a0d016476f5b2d39`, the reviewer ran two offline factory fixtures: fake duck adapter rejected by constructor and factory; no eager plugin import; missing plugin fails closed on lazy factory invocation. Both passed. Synthetic class/sys.modules injection was isolated to those fixtures and is not evidence of real Telegram authentication. Full QA record: `independent QA report in this bundle`.
- AST parse and `git diff --check` passed after the fix. The author ran no behavior tests. The author reports publication of the single module in commit `c8e336c82bd90b534c2aa9fcca4fec89bb96663d`; this does not authorize integration or activation. Real Telegram authentication and callback wiring remain HOLD.

## Execution record

- Owner: native approval binding worker.
- Configured model: Luna medium. Served model: UNKNOWN.
- State: implementation QA complete with version distinction above; real Telegram grant NOT TESTED / NOT ACTIVE. The earlier author report was regenerated after QA accidentally overwrote its path; it was not recovered byte for byte.
