# Codex → Claude text task → Hermes MCP candidate

META: one bounded text review using the existing Claude subscription adapter and an explicit ONIA contract. PRUEBA DE HECHO: independent review, local CLI/MCP tests, one authorized subscription smoke with observed model and recoverable receipts. PARADA: reviewable activation package; no VPS changes, installation, login, deployment or API-paid Hermes call.

## What runs

`claude_task.py` is a caller for the sibling canonical `../claude-adapter-prep-20261015/claude_adapter.py`, not another scheduler or queue. It accepts UTF-8 JSON on stdin, defaults to dry-run, assembles caller-pinned Markdown policies/skills, verifies SHA-256 and size, and invokes the existing adapter once. CLI preflight accepts only the observed/tested Claude CLI version `2.1.288`; another version is blocked before dispatch and requires capability review. It does not auto-upgrade. The adapter fixes Sonnet `claude-sonnet-5-5` and checks observed model JSON, safe/restricted mode, no tools/MCP/subagents, one turn, no browser and no session persistence.

Contract schema:

```json
{
  "schema_version": 1,
  "task_id": "unique-task-id",
  "attempt_id": "unique-attempt-id",
  "operation": "review_text",
  "goal": "Review the supplied bounded text",
  "proof": "Return findings supported by the input",
  "stop": "One response; no tools or actions",
  "instructions": [{"path": ".claude/skills/onia-hermes-jarvis/SKILL.md", "sha256": "sha256-of-exact-file-bytes"}],
  "input": "Nonsecret source material to review"
}
```

Instructions are explicit: no inherited Codex/Claude session, hook or skill state. Allowed files are repo-root AGENTS.md/CODEX.md/CLAUDE.md or `.claude/skills/<name>/SKILL.md`. Root confinement, hashes, duplicate rejection and total assembled 32 KB bound apply. If full policies exceed the bound, reduce task scope/select the pertinent skill; do not silently truncate or claim all policies were loaded. Caller retains the other applicable policy duties. No secret/client-private input; provider text and receipt storage must remain outside Git unless reviewed/sanitized.

Use Python's `subprocess.run([python, script, "--repo", root, "--store", private_store, "--execute"], input=contract_utf8, ...)` from an existing caller. Prompt is never interpolated into shell arguments. Omitting `--execute` produces a dry-run without writing state or invoking Claude. `--status TASK_ID` only reads receipts.

## Continuity and failure

`<private-store>/<task_id>/dispatch.json` is exclusively created and fsynced before provider dispatch. A separate `result.json` is exclusively created afterward. Task ID, attempt ID, assembled input hash, exact instruction hashes, tool boundary and requested/observed model bind the result. The provider receipt retains usage/cache nullable fields and CLI cost estimate (not an invoice or measured subscription saving). Raw provider stderr is never emitted.

A consumed task cannot dispatch again, even with another attempt ID. Missing result, timeout, unknown process error or invalid response yields `needs_reconcile`; read existing status and reconcile rather than replay. Auth failure after dispatch blocks fallback. Missing/unverified CLI can return `fallback_eligible=true` before dispatch; that is only information for the existing coordinator, never automatic fallback or permission to spend. No provider sessions are transferred. Receipts preserve continuity by task/attempt, not by resuming another provider's chat.

## MCP facade

`claude_mcp.py --repo ROOT --store PRIVATE_STORE` exposes MCP stdio JSON-RPC with `review_text(contract)` and `status(task_id)`. It uses newline-delimited UTF-8, initialization, tools/list and tools/call, with no SDK download, HTTP port, generic shell or new service. Default launch remains dry-run; only an approved launch with `--execute` enables provider requests. `review_text` is **write-capable/open-world** because it consumes subscription quota and writes receipts (`readOnlyHint=false`). `status` is read-only and never loads/invokes the provider. These hints are descriptive, not an authorization boundary. The gateway's identity/allowlist/approval controls must enforce authorization before calling the tool. Cancellation does not authorize replay; provider duration is bounded at 45 seconds and a dropped caller must read status.

Transport/tool source: [MCP stdio](https://modelcontextprotocol.io/specification/2025-06-18/basic/transports), [MCP tools](https://modelcontextprotocol.io/specification/2025-06-18/server/tools). This is a narrow facade, not a claim of full MCP implementation/conformance.

## Current remote limits / activation gate

Read-only inspection on 2026-10-15 found Hermes gateway active with openai-api/gpt-5-mini, no fallback providers and no configured mcp_servers. Installed native Hermes sources support MCP stdio configuration. VPS Claude 2.1.197 reports `loggedIn:false`, lacks adapter flags, and its Node 20.20.2 is below the registry requirement for 2.1.288. Therefore this package must not dispatch on VPS now. Do not copy laptop OAuth sessions, silently update runtimes, call Hermes's paid API, or restart the gateway.

The first approved activation must separately cover the reviewed isolated native Claude executable, VPS-specific authentication, exact MCP allowlist/config merge and gateway restart/rollback. The native executable candidate is `/opt/onia/claude-cli/2.1.288/claude`, passed explicitly with `--claude`; it must not replace `/usr/bin/claude` or change Node 20. A local review smoke or passing transport test does not prove Hermes deployment, coding with tools/subagents, full multi-provider execution, PC-off autonomy, savings, browser readiness or Cloud readiness. Browser and historical pilotqueue migrations are not prerequisites for this text bridge.

Validation: `python -m unittest test_claude_task test_claude_mcp test_configure_mcp test_verify_signature -q` (29 tests: 22 contract/transport, 4 config/rollback, 3 signature verification), plus14adapter tests in the canonical sibling directory. The config tests use PyYAML already installed in the existing runtime; the bridge itself is stdlib-only. Mocked provider tests do not consume quota. The real stdio subprocess test initializes, lists tools and reads a nonexistent task without invoking any model. Isolated prep needs `--adapter` pointing to the existing canonical adapter; the integrated sibling layout resolves it by default. The adapter is SHA256-pinned before import.

Operational learning: validate response format separately from transport/model/policy provenance. The authorized single smoke passed transport/scope/model/hash checks but returned155words against requested<150; preserve that limitation instead of rerunning the provider to improve a demonstration. No automatic cross-provider router, session migration, model switching or subagents were implemented. The current Codex coordinator can separately reassign an authorized task before provider dispatch based on observed capability/usage; this wrapper only exposes preflight eligibility and blocks fallback after consumption.

Time cutoff: source order2026-10-15T18:12:14.805Z → package cutoff2026-10-15T19:18:57Z, elapsed1h06m42.195s. This is wall-clock across chat continuations and waits, not measured active work, API billing, model runtime or subscription saving. Provider smoke duration8344ms is separately measured by its receipt.

## Activation delta / human decisions, 2026-10-15

Sergio Urcullo approved the reviewed activation and one bounded remote subscription review. Native Claude2.1.288 was installed at the isolated path after official signature/SHA/size verification; existing Node20.20.2/globalClaude2.1.197 stayed unchanged. Seven reviewed runtime/helper/skill files were deployed; remote OAuth was completed by the human in his own visible terminal. In-memory local/remote metadata comparison returned same-account=true and both-Max=true without emitting email, account IDs or private hashes. The existing same-account extra-usage-off confirmation applies; no additional API spend is approved.

Billing hardening after QA: adapter child environment now retains only OS/runtime/home/locale essentials, excludes inherited API/provider/OAuth override/proxy variables, and sets `--setting-sources ''`. Before reserving a task the wrapper runs version and auth status with that exact child environment and requires Claude.ai/firstParty/Max. Adapter SHA changed to `759198db802272bc75950f52a7a549e6930a53498c56d521bd5f4b61a72ee1e6`; wrapper pin was updated. Focused verification: adapter14/14 + contract/MCP22/22 passed; independent QA GO. Remote real preflight passed, with no forbidden provider variables and no model request. Native `--max-turns` is a supported hidden option: its signed binary contains the parser declaration with `.argParser(fr).hideHelp()`; `--version` alone accepted an invalid control flag too and was not used as proof of flag support.

Config backup receipt: `/root/.hermes/onia-claude-text-backups/20261015T193949587548Z.receipt.json` (private, not copied to Git). Before SHA256 `b36ff08d9f25e2452e298e3b0598ede2b7b2994c72e940774f0e842e955b6ff2`; after `bf0f2ee8dc4fd4f9a8002b260df1100601d37805118e500080c9e2d8451bd5ae`. The one approved merge/restart completed and gateway was observed active. A separate invocation of installed Hermes's native discovery/registry registered both tool names; it is not an attestation of the running gateway process's in-memory registry. A noninteractive native `status` invocation unexpectedly received the write-capable approval gate despite the server's read-only hint; it failed closed without a provider call. Preserve this conservative UX discrepancy, do not claim status bypasses all native prompts.

The single remote review is launched by `remote_native_smoke.py` through installed Hermes registry/handler in a human-owned SSH TTY. Its genuine native approval prompt requires human `o` (once); no callback or approval response is manufactured. It does not invoke Hermes's paid model, does not claim Telegram origin, and is not executed inside the already-running gateway process. Final provider/result evidence must be read from its private write-once receipt, not inferred from launch or service-active.

Sergio's suggested implementation methods express desired outcomes; the agents choose a simpler effective architecture from evidence within his permissions, without treating each suggestion as a mandatory implementation. The rootSol6.1ultra request was superseded by his later order to use rootAstra for important work; the app accepted Astra medium. These are configuration events, not independently observed runtime-model attestation. Workers do not automatically inherit those changes. Use Sol and Claude/Sonnet for real implementation/review in opposite roles as the task warrants, not duplicated template replies; preserve explicit strong-model exceptions. Future coding agents/subagents and automatic task routing are not implemented by this text bridge.

Instruction precedence remains human order first, then applicable repository policy, then the explicit pertinent skill. Skills are bounded text with verified source hashes, not inherited tools/hooks/session identity. Provider switching does not resume another provider's session. Current receipts continue by task/attempt/input/policy hashes. This method is intentionally a small caller/MCP integration, not a new orchestration framework.

## Remote review result / closure evidence

Executed one remote Claude subscription review through the installed Hermes native registry/handler. The first native consent window expired after60253ms before dispatch; receipts prove `provider_started=false`, tasknotfound and no dispatch file, so no provider replay occurred. On explicit human authorization relayed by root, the same task/input was continued through the real native TTY consent gate with its existing timeout parameter set to300seconds in the test process only. The agent typed `o` on behalf of the human and the native terminal returned `Allowed once`; no approval callback/verdict was fabricated, trust stayeduntrusted, and no persistent/global approval configuration was changed. Metadata explicitly records `approved_by_authorized_agent_for_user`; this is not a claim that a human physically typed that key.

Task `onia-hermes-native-review-20261015`, attempt1, input11164B SHA256 `9c384df8a77d7524f724e490a2c8002a3f7e446d4efc4b77903e5546266cfb0b`, pinned continuity skill as above. Observed model `claude-sonnet-5-5`; provider8087ms, native dispatch18064ms (includes approval/preflight, not all provider runtime). Provider receipt digest `0e488c2e451c622200c95279704890aa8b4baaa04bb196e4561ff6826a5a040c`; native result SHA256 `9201a1af80d9218063bafc52b116a7a33fe275900fa2d2289161a8762e0b56e3`. Result matches persisted task status, SSH exit0. Gateway remained active and config SHA remained `bf0f2ee8dc4fd4f9a8002b260df1100601d37805118e500080c9e2d8451bd5ae`. Public sanitized evidence: `remote-native-review-result.json`; pre-effect failure: `remote-native-pre-effect-result.json`. No further provider call was made. The returned text is an untrusted model summary; authoritative approval provenance is the recorded native TTY action/metadata, not its phrasing of human consent.

This proves the installed Hermes CLI native registry→MCP→Claude subscription path on VPS, with authentic native trust gating. It does not prove a task originated by Telegram/the running gateway process, coding with tools/subagents, automatic cross-provider fallback, PC-off resilience or measured savings. Those remain distinct tasks, not assumed from the active service or this smoke.

Final operational cutoff2026-10-15T19:52:14Z: elapsed1h39m59.195s from the source order18:12:14.805Z, including conversations, human waits, continuations and separate work. It is not measured active compute or billing. Temporary prep cleanup remains blocked by the earlier automatic policy rejection; it was not retried through another route.
