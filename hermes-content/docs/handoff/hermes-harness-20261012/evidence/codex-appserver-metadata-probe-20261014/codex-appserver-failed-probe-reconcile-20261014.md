# Codex app-server metadata probe reconciliation

Captured 2026-10-14 08:19:38 UTC. Status: **held; no retry**.

The single authorized run at 08:14:08Z failed with `protocol_envelope_invalid` before `account/read`. The driver had locally written and flushed only `initialize`; remote delivery is unknown. Account/auth state was not observed. Receipt SHA-256: `1c3d9d548f5c829fd1c746a9505233ce7821cbd8db988bf9c86cb4f981341ded`. Driver SHA-256: `cc73af3091f2a5ba139fdfc8670497a439b108f1f3ebfb197f458e2f5a303e39`.

## Cause assessment

The pinned Codex 0.161.0 source file [`rpc.rs`](https://github.com/openai/codex/blob/rust-v0.161.0/codex-rs/app-server-protocol/src/rpc.rs) says the app-server protocol does not send or expect the JSON-RPC 2.0 `jsonrpc` field. Its response struct contains `id` and `result`; its error struct contains `id` and `error`. The driver currently requires `jsonrpc == "2.0"` before classifying a frame. This is a source-confirmed protocol mismatch consistent with the observed failure class. The raw 216-byte line was not retained, so its exact shape was not independently observed.

## Read-only remote check

One SSH metadata read completed with exit 0. The bounded `/proc` scan examined 368 process entries and found zero active root-owned processes whose start time and cwd matched the invocation window and `codex-meta-probe-*` scope. It found zero deleted-cwd matches and zero cwd scan errors. This is a current snapshot, not proof of cleanup at failure time.

The `/tmp` scan hit its 8,192-entry cap before it could establish completeness. It found no matching root-owned mode-0700 directory among entries examined, but scratch absence remains **unknown**. No processes were signaled and no files were removed.

## Follow-up plan

Preserve the existing probe and receipt unchanged. A future reviewed revision should accept the pinned versionless dialect while retaining strict integer IDs, response/error shape validation, method allowlists, terminal-frame validation, process-group cleanup, and output bounds. Run local fixtures before requesting another review or invocation.

No second SSH, CLI, app-server, or RPC call was made.
