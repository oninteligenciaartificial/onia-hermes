# Codex 0.161 app-server metadata probe — V2 source-only preparation

Status: prepared, not executed. V2 fixes the pinned protocol envelope mismatch found by the prior V1 attempt. No CLI, app-server, RPC, login, network call, or VPS read was performed for V2.

## V1 protocol failure and V2 correction

The preserved V1 attempt stopped after locally writing and flushing `initialize`; its receipt classified the response as `protocol_envelope_invalid`. This did not observe account/auth state. Pinned 0.161.0 `rpc.rs` explicitly says the implementation neither sends nor expects the JSON-RPC 2.0 `jsonrpc` field. Its response DTO is versionless (`id` plus `result`, or `id` plus `error`). Source: [pinned v0.161.0 `rpc.rs`](https://github.com/openai/codex/blob/rust-v0.161.0/codex-rs/app-server-protocol/src/rpc.rs).

V2 changes only the prepared wire envelope and its validation fixtures: outgoing `initialize`, `initialized`, and `account/read` omit `jsonrpc`; responses and notifications accept the versionless DTO, and accept an optional `jsonrpc` only when it is exactly `2.0`. Response/error/notification top-level keys and error fields are allowlisted, IDs remain strict integers (booleans/floats rejected), and failures carry fixed classifications without echoing server text. No V1 source or receipt was changed. This is a source-based correction; no live response was captured to validate it.

## Plugin override finding

Pinned `rust-v0.161.0` source supports `-c features.plugins=false`: root CLI options flatten `CliConfigOverrides`; app-server dispatch passes root overrides to `run_main_with_transport_options`; that function parses them into `ConfigManager`. `Config::plugins_config_input()` maps `Feature::Plugins` directly to `plugins_enabled`, and the plugin-startup manager gates its work on that value. The app-server default starts the worker, so the override disables that plugin gate for this process. This does not prove the absence of unrelated startup effects or confirm the installed effective config.

Sources: `codex-rs/cli/src/main.rs`; `codex-rs/app-server/src/lib.rs`; `codex-rs/core/src/config/mod.rs`; `codex-rs/core-plugins/src/manager.rs`; `codex-rs/features/src/lib.rs` at pinned ref `rust-v0.161.0`.

## Protocol and prepared driver

`account/read` with `params: {}` means no requested token refresh (the false field is omitted by the protocol serializer). `model/list` has only `cursor`, `limit`, and `includeHidden`; it has no `refresh` parameter and can fetch catalog data, so it is excluded. Startup/account routing may still do account-related network work; do not call this probe network-free.

`metadata_probe.py` is an opt-in stdlib SSH driver. Without `--execute`, it prints only `prepared_only`. It uses the existing pinned SSH identity and known-hosts file, disables forwarding and agent-selected identities, starts a short-lived remote Python supervisor, and launches only the pinned Codex CLI on stdio. The child gets an explicit environment allowlist (`PATH`, `HOME`, `CODEX_HOME`, `LANG`, `TZ`, `NO_COLOR`), fresh mode-0700 scratch/state/log directories under `/tmp`, and `-c features.plugins=false`. It sends only `initialize`, `initialized`, and `account/read {}`. It never sends thread/turn/model/MCP/plugin/hook/skill requests. It projects account output to presence and coarse auth kind; stdout/stderr content and identifiers are not persisted or printed. JSON-RPC IDs require exact integer types. Stdout is capped cumulatively at 64 lines and 2 MiB, with a 256 KiB per-line cap.

After `account/read`, the local driver closes stdin and drains the entire stream. It accepts only allowlisted notifications until a supervisor terminal frame, then requires EOF and SSH exit 0. The remote supervisor creates an unreaped keeper as a private process-group leader and launches Codex into that same group. The keeper ignores TERM and pins the PGID even if the Codex leader exits first; cleanup signals the owned group before reaping the keeper, checks `/proc` for remaining active group members (up to 8,192 process entries per scan), and removes scratch only after the group is confirmed quiescent. If group enumeration, termination, or scratch cleanup is uncertain, the result is held and scratch is preserved. This guards descendants that remain in the owned process group; it does not contain a descendant that deliberately creates a new session/group.

The pinned 0.161.0 CLI source defines `app-server` with `stdio://` as the default listen transport; `--stdio` is also supported but the prepared argv omits it. Source: [Codex v0.161.0 CLI `AppServerCommand`](https://github.com/openai/codex/blob/rust-v0.161.0/codex-rs/cli/src/main.rs#L517-L539). The watchdog remains 45 seconds remote plus up to 2 seconds cleanup and 49 seconds local. These are driver-contract assertions, not evidence of live SSH/runtime behavior.

Receipt files are created outside remote scratch with exclusive creation. The script is not approved to run until root and independent QA review the exact hashes.

## V2 offline validation and limits

V2's new focused envelope subset passed 5 tests in 0.002 s: versionless initialize/account replies, nullable account and optional exact version, malformed/versioned/extraneous response rejection, malformed errors/notifications and no echo, and outgoing versionless wire shapes. No prior 12/17/36-test suite was rerun. The default script still returns `prepared_only`; no SSH process was started. These tests do not validate remote `/proc` behavior, actual Codex runtime behavior, SSH access, auth state, model availability, or network activity.
