# Codex 0.161 app-server metadata probe — source-only preparation

Status: prepared, not executed. No CLI, app-server, RPC, login, network call, or VPS read was performed for this artifact.

## Plugin override finding

Pinned `rust-v0.161.0` source supports `-c features.plugins=false`: root CLI options flatten `CliConfigOverrides`; app-server dispatch passes root overrides to `run_main_with_transport_options`; that function parses them into `ConfigManager`. `Config::plugins_config_input()` maps `Feature::Plugins` directly to `plugins_enabled`, and the plugin-startup manager gates its work on that value. The app-server default starts the worker, so the override disables that plugin gate for this process. This does not prove the absence of unrelated startup effects or confirm the installed effective config.

Sources: `codex-rs/cli/src/main.rs`; `codex-rs/app-server/src/lib.rs`; `codex-rs/core/src/config/mod.rs`; `codex-rs/core-plugins/src/manager.rs`; `codex-rs/features/src/lib.rs` at pinned ref `rust-v0.161.0`.

## Protocol and prepared driver

`account/read` with `params: {}` means no requested token refresh (the false field is omitted by the protocol serializer). `model/list` has only `cursor`, `limit`, and `includeHidden`; it has no `refresh` parameter and can fetch catalog data, so it is excluded. Startup/account routing may still do account-related network work; do not call this probe network-free.

`metadata_probe.py` is an opt-in stdlib SSH driver. Without `--execute`, it prints only `prepared_only`. It uses the existing pinned SSH identity and known-hosts file, disables forwarding and agent-selected identities, starts a short-lived remote Python supervisor, and launches only the pinned Codex CLI on stdio. The child gets an explicit environment allowlist (`PATH`, `HOME`, `CODEX_HOME`, `LANG`, `TZ`, `NO_COLOR`), fresh mode-0700 scratch/state/log directories under `/tmp`, and `-c features.plugins=false`. It sends only `initialize`, `initialized`, and `account/read {}`. It never sends thread/turn/model/MCP/plugin/hook/skill requests. It projects account output to presence and coarse auth kind; stdout/stderr content and identifiers are not persisted or printed. JSON-RPC IDs require exact integer types. Stdout is capped cumulatively at 64 lines and 2 MiB, with a 256 KiB per-line cap.

After `account/read`, the local driver closes stdin and drains the entire stream. It accepts only allowlisted notifications until a supervisor terminal frame, then requires EOF and SSH exit 0. The remote supervisor creates an unreaped keeper as a private process-group leader and launches Codex into that same group. The keeper ignores TERM and pins the PGID even if the Codex leader exits first; cleanup signals the owned group before reaping the keeper, checks `/proc` for remaining active group members (up to 8,192 process entries per scan), and removes scratch only after the group is confirmed quiescent. If group enumeration, termination, or scratch cleanup is uncertain, the result is held and scratch is preserved. This guards descendants that remain in the owned process group; it does not contain a descendant that deliberately creates a new session/group.

The pinned 0.161.0 CLI source defines `app-server` with `stdio://` as the default listen transport; `--stdio` is also supported but the prepared argv omits it. Source: [Codex v0.161.0 CLI `AppServerCommand`](https://github.com/openai/codex/blob/rust-v0.161.0/codex-rs/cli/src/main.rs#L517-L539). The watchdog remains 45 seconds remote plus up to 2 seconds cleanup and 49 seconds local. These are driver-contract assertions, not evidence of live SSH/runtime behavior.

Receipt files are created outside remote scratch with exclusive creation. The script is not approved to run until root and independent QA review the exact hashes.

## Offline validation and limits

The prior revision's 12 local fixtures passed before the process-group correction. For this revision, the directly affected focal set passed 5 tests in 0.004 s: exited leader with an active owned descendant is not success, terminal nonzero exit is held, keeper/group wiring and supervisor syntax are checked, shutdown validation is checked, and the drain-to-EOF path is checked. No broad suite was rerun. The default script still returns `prepared_only`; no SSH process was started. These tests do not validate remote `/proc` behavior, actual Codex runtime behavior, SSH access, auth state, model availability, or network activity.
