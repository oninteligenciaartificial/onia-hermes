# Native Cloud control route review

Captured: 2026-10-14T07:23:52.2602259Z

This comparison uses already-reviewed official Codex 0.161.0 source and the one completed read-only `codex cloud list --json --limit 20` result. No new CLI, authenticated network request, inference, app-server, install, or session creation was performed.

| Route | PC can be off? | What it controls | Cost / constraint |
|---|---|---|---|
| Native Codex App session | Yes for cloud-hosted work | Codex-managed native session visible in App. No supported external VPS API mapping a process to that UUID was demonstrated. | Codex account allowance; current per-task cost/cap unknown. |
| `codex cloud` CLI | Yes | Separate Cloud Tasks interface with list/exec and its own task IDs. It is not shown to send into native App UUID sessions. `exec` creates a separate task. | Account allowance/cap unknown; not run here. |
| VPS app-server | Yes | Runs a VPS-local Codex process/session. This does not make it a native Cloud session. | Existing auth/allowance and isolated deployment support remain unverified. |

The list command returned zero tasks and no known task IDs. That result does not prove the native sessions are absent or belong to another account. Keep the two ID namespaces separate.

**Recommendation:** if native App sessions are the requirement, let Codex App own them and do not claim a VPS bridge. If VPS execution is the requirement, use an explicit VPS-local app-server/session and label it as VPS-local. Bridging VPS control into native session UUIDs requires a documented supported API contract; none was established in the reviewed sources.

Sources: [CLI dispatcher](https://raw.githubusercontent.com/openai/codex/rust-v0.161.0/codex-rs/cli/src/main.rs) (Subcommand::Cloud and dispatch); [Cloud CLI arguments](https://raw.githubusercontent.com/openai/codex/rust-v0.161.0/codex-rs/cloud-tasks/src/cli.rs); [Cloud task handlers](https://raw.githubusercontent.com/openai/codex/rust-v0.161.0/codex-rs/cloud-tasks/src/lib.rs); [Cloud task HTTP client](https://raw.githubusercontent.com/openai/codex/rust-v0.161.0/codex-rs/cloud-tasks-client/src/http.rs).

Read-only list receipt: `E:\\onia-wt\\codex-cloud-cli-native-list-probe-20261014.json`, SHA-256 `DF5F83BC66BF575B3FB75FFEDE7F2CBC385A9092E055674AD8619F7BF8644B`.
