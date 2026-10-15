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

Validation: `python -m unittest test_claude_task test_claude_mcp test_configure_mcp test_verify_signature -q` (27 tests: 20 contract/transport, 4 config/rollback, 3 signature verification). The config tests use PyYAML already installed in the existing runtime; the bridge itself is stdlib-only. Mocked provider tests do not consume quota. The real stdio subprocess test initializes, lists tools and reads a nonexistent task without invoking any model. Isolated prep needs `--adapter` pointing to the existing canonical adapter; the integrated sibling layout resolves it by default. The adapter is SHA256-pinned before import.

Operational learning: validate response format separately from transport/model/policy provenance. The authorized single smoke passed transport/scope/model/hash checks but returned155words against requested<150; preserve that limitation instead of rerunning the provider to improve a demonstration. No automatic cross-provider router, session migration, model switching or subagents were implemented. The current Codex coordinator can separately reassign an authorized task before provider dispatch based on observed capability/usage; this wrapper only exposes preflight eligibility and blocks fallback after consumption.

Time cutoff: source order2026-10-15T18:12:14.805Z → package cutoff2026-10-15T19:18:57Z, elapsed1h06m42.195s. This is wall-clock across chat continuations and waits, not measured active work, API billing, model runtime or subscription saving. Provider smoke duration8344ms is separately measured by its receipt.
