# Claude CLI adapter draft

This is the canonical bounded Claude adapter in the Hermes repository. Its original isolated review draft was integrated; the sibling `../cli-integration-prep-20261015/` now supplies the task/skill/receipt contract and MCP facade. It invokes an explicitly selected installed Claude Code CLI using the approved Claude.ai subscription session; it has no account-switch or cloud-agent path.

## Contract

- Dry-run is the default. It reads at most 32,000 input bytes from stdin, returns an input digest, and does not launch Claude.
- A provider request requires explicit `--execute`. Prompt bytes go to the child process stdin; they are never interpolated into a command line.
- Execution uses the fixed observed model `claude-sonnet-5-5`, low effort, one turn, JSON output, a 45-second default timeout, updater disabled for this child process, no session persistence, Chrome disabled, restricted/safe mode, an empty built-in tools list, and strict MCP configuration with no MCP config supplied.
- The wrapper makes one CLI invocation and never retries it. The Claude CLI may perform its own internal transport retries; the local help exposes no retry-disable option. Therefore this draft cannot claim exactly one provider request under transport failures.
- The parser exposes a bounded response string plus state, generic error code, model, input/output/cache token counts, server-tool counts, duration, cost estimate, and SHA-256 digests. The cost value is the CLI estimate, not billing evidence. It discards session IDs, UUIDs, raw stderr, local exception text, and tool-denial details. The response can repeat text from the prompt, so treat it as untrusted content and pass only non-secret context. Output over 64,000 bytes is rejected.
- `--receipt` is required with `--execute`. The adapter reserves the path with exclusive-create semantics before launching Claude, then fills in the final receipt. Existing paths fail closed before any provider call; a leftover `reserved` receipt also blocks replay after interruption.
- Account-level extra usage must be confirmed Disabled before any `--execute` run. This wrapper neither inspects nor changes account billing settings and cannot guarantee billing behavior.
- Billing isolation hardening2026-10-15: the child environment is an explicit OS/home/path/locale allowlist; inherited API/provider/OAuth overrides and proxies are excluded. `--setting-sources ''` disables user/project settings. The task wrapper verifies effective Claude.ai/firstParty/Max auth with the exact same child environment before reserving/dispatching. Its pinned adapter SHA256 was updated and independent QA passed14adapter +22contract/transport tests.

## Use

Dry-run (no model request):

```powershell
Get-Content -Raw .\prompt.txt | python .\claude_adapter.py
```

One explicit subscription request:

```powershell
Get-Content -Raw .\prompt.txt | python .\claude_adapter.py --execute --timeout 45 --receipt "$env:TEMP\claude-worker-receipt.json"
```

The adapter does not check Claude Usage or the Disabled setting. An operator must confirm extra usage is disabled before execution. Do not pass secrets unless separately authorized and needed.

## Scope limits

The command reproduces the reviewed local smoke-test flags. Claude documentation notes that managed settings can still apply in safe/restricted mode; this adapter does not inspect machine policy or claim to suppress organization-managed hooks. `--tools ""` disables built-in tools and safe mode omits normal MCP/customizations. It does not activate Claude Cloud or spawn remote/local subagents.

## Model, instructions, and session continuity

The installed CLI was `2.1.288`; the only live request observed `claude-sonnet-5-5` in JSON `modelUsage`. The adapter pins `--model` and `--effort low`, then validates the returned model instead of assuming the alias or requested model was honored. Changing model does not require a new login; it applies to the launched session. Model aliases and account availability can change over time.

This adapter is deliberately a stateless text worker: `-p` plus `--no-session-persistence` does not save a session for later resume, and it does not load Hermes skills, hooks, MCP, or subagents. The CLI also documents `--continue` (most recent session in the current directory), `--resume` (session ID or name), `--fork-session` (resume as a new session ID), and `--session-id`; these are not enabled here and require a separately reviewed persistent-session mode. Keep orchestration `task_id`/attempt/receipt IDs independent from any provider session ID. Continue work through a curated handoff artifact with source and skill hashes, not a copied full transcript. A future tool-enabled worker must receive the applicable human/repository/task instruction hierarchy and only explicitly selected skills; validate their hashes and tool allowlist. Do not resume across providers or automatically fall back after an ambiguous timeout without reconciling the original attempt.

Official references: [CLI reference](https://code.claude.com/docs/en/cli-reference), [model configuration](https://code.claude.com/docs/en/model-config), [headless mode](https://code.claude.com/docs/en/headless), [settings](https://code.claude.com/docs/en/settings), [subagents](https://code.claude.com/docs/en/sub-agents), and [agent teams](https://code.claude.com/docs/en/agent-teams). In particular, `--bare` is not a replacement for this subscription flow: it skips OAuth/subscription and still leaves shell/filesystem tools available. Subagents and agent teams require a different explicit tool/session configuration and are outside this draft.

## Tests

```powershell
python -m unittest -v test_claude_adapter.py
```

All adapter tests use simulated subprocesses; running them does not call Claude. `claude-live-smoke-20261015.json` is the sanitized record of the one separately authorized smoke request, not an adapter test.
