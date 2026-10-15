# Approved activation scope and rollback

Execution update2026-10-15: Sergio Urcullo approved this scope. Isolated installation, human OAuth, reviewed deployment, config merge/restart and one remote Sonnet review through installed Hermes native registry/TTY consent have completed. Independent QA GO; [current evidence and limits](README.md#remote-review-result--closure-evidence). The instructions below preserve the approved package and rollback, not an instruction to repeat installation/login/review. Runtime billing hardening was added before the remote call and reviewed separately: current adapter SHA256 `759198db802272bc75950f52a7a549e6930a53498c56d521bd5f4b61a72ee1e6`, explicit child-env allowlist and same-child-env Claude.ai/firstParty/Max auth preflight.

The authorized local implementation and subscription smoke are complete. Production activation is a separate approval: download/verify the official native Claude executable, deploy the reviewed bridge, configure the existing Hermes gateway and restart it after VPS-specific Claude login succeeds. This gate does not ask Sergio Urcullo to approve ordinary local reads already authorized in this chat.

## Explicit permission requested

Approve the native **Claude Code 2.1.288 linux-x64** executable from `downloads.claude.ai` (245734584 bytes), installed **only** at `/opt/onia/claude-cli/2.1.288/claude`. Verify the official detached GPG manifest signature against fingerprint `31DD DE24 DDFA B679 F42D 7BD2 BAA9 29FF 1A7E CACE` and binary SHA256 `0298068b686e7fdbaf9402a7a587bb7f49c0b0e084de09f69145a0719207640c`. The installer requires exactly one GPG `VALIDSIG` matching that signing fingerprint; another imported key cannot authorize the manifest. Existing Node 20.20.2 and global Claude 2.1.197 are unchanged. Installer `install-native-claude.sh` plus sibling `verify_signature.py` are deployed together; it is dry-run unless explicitly invoked with `--apply-approved`.

Approve copying exactly the reviewed runtime files `claude_task.py`, `claude_mcp.py`, the canonical `claude_adapter.py`, activation helpers `install-native-claude.sh`, `verify_signature.py`, `configure_mcp.py` and the pinned continuity skill to this dedicated release layout (test/smoke runners are not deployed):

```text
/opt/onia/claude-text/20261015/evidence/cli-integration-prep-20261015/{claude_task.py,claude_mcp.py}
/opt/onia/claude-text/20261015/evidence/claude-adapter-prep-20261015/claude_adapter.py
/opt/onia/claude-text/20261015/policy/.claude/skills/onia-continuidad/SKILL.md
/opt/onia/claude-text/20261015/{install-native-claude.sh,verify_signature.py,configure_mcp.py}
/var/lib/onia/claude-text/receipts/  (private, mode 0700; never Git)
```

The explicit policy root is `/opt/onia/claude-text/20261015/policy`, a small reviewed source snapshot, not a new clone or claim that the full repository is installed. Copy the exact canonical continuity skill (SHA256 `5c3f6a5ecd0ee32fe7423ce36631520338e3defd1952fec4f1fb8cd2062afc8e`) there preserving its relative path. `--repo` means the root for verified policy files; it does not imply Git metadata, full skill inheritance or permission to change a repo. Other task-specific skills require an explicit reviewed snapshot before use. The caller remains responsible for applicable human/CODEX orders.

If the official manifest is signed by a subkey whose `VALIDSIG` fingerprint differs from the reviewed pin, the strict installer stops. Inspect and review that key binding explicitly; never weaken fingerprint verification to get past the gate.

Approve VPS-local Claude authentication initiated through `/opt/onia/claude-cli/2.1.288/claude auth login`; Sergio Urcullo completes the provider's OAuth consent through the provider's trusted flow when required. Never copy laptop credentials/cookies/session, expose a login token, print secrets, enable paid API access or enable extra usage. Verify `auth status --json` without publishing identifiers/tokens; `loggedIn:false` stops activation. Subscription eligibility/extra usage settings on the actual remote login must be verified, not inherited from the laptop's snapshot.

Approve backup, merge and one controlled restart of **existing** `hermes-gateway.service`, only after native CLI version, auth, Python imports, adapter hash, repo policies and dry-run stdio all validate. Keep existing provider `openai-api/gpt-5-mini`, fallback configuration, bot, allowlists and unrelated MCP servers unchanged. No Hermes paid-model call is covered by this package; a remote model/E2E test requires a bounded task explicitly scoped to the subscription bridge.

This same approval includes **one** remote MCP text review through the existing Hermes native registration/handler and its own verified approval surface: a new task/attempt ID, the pinned continuity skill, nonsecret boundary-review input, no actions/tools/subagents, requested<150words and observed Sonnet via the authenticated Claude Max subscription with extra usage confirmed off. It does not call Hermes's paid model to manufacture dispatch. If the native handler requests Telegram approval, Sergio Urcullo completes that existing flow on his verified own surface; no third-party messages. Check the real registered tool/handler, per-call approval identity, dispatch/result receipts and status correspondence. Failure consumes that task and does not authorize replay. This bounded review is included here so successful installation/auth/config does not stop at service-active and is not followed by another generic subscription-permission request.

## MCP config merge (reviewed schema, not whole-config replacement)

Backup `/root/.hermes/config.yaml` into a private root-only backup with timestamp/hash before mutation. Abort if the destination MCP server name already exists; inspect rather than overwrite. Merge one top-level server entry using the installed Hermes YAML loader/runtime:

`configure_mcp.py` implements this single-entry merge, private backup, semantic round-trip validation and guarded exact rollback. It requires PyYAML **already installed in the chosen existing Hermes Python runtime**; absence stops activation, never triggers installation. Validate with `python3 -c 'import yaml'`; if absent, locate the existing Hermes runtime interpreter and pass that explicit executable instead. The script never prints YAML/secret values and never restarts a service. `--apply-approved` is required for mutations.

After deploying the reviewed script into `/opt/onia/claude-text/20261015/`, the exact action order is:

```sh
bash /opt/onia/claude-text/20261015/install-native-claude.sh --apply-approved
DISABLE_AUTOUPDATER=1 /opt/onia/claude-cli/2.1.288/claude --version
# Human completes OAuth through provider flow; do not capture login stdout into shared logs.
/opt/onia/claude-cli/2.1.288/claude auth login
/opt/onia/claude-cli/2.1.288/claude auth status --json
python3 /opt/onia/claude-text/20261015/configure_mcp.py
# Only after version/auth/import/policy/stdio checks pass:
python3 /opt/onia/claude-text/20261015/configure_mcp.py --apply-approved
systemctl restart hermes-gateway.service
systemctl is-active hermes-gateway.service
```

Keep the returned private receipt path. The rollback command is `python3 /opt/onia/claude-text/20261015/configure_mcp.py --rollback EXACT_PRIVATE_RECEIPT_PATH --apply-approved`, then `systemctl restart hermes-gateway.service` and `systemctl is-active hermes-gateway.service`. The receipt path is generated uniquely at activation; the placeholder must never be guessed. Rollback refuses if config has changed again since this merge, preserving another operator's changes.

```yaml
mcp_servers:
  onia_claude_text:
    command: python3
    args:
      - /opt/onia/claude-text/20261015/evidence/cli-integration-prep-20261015/claude_mcp.py
      - --repo
      - /opt/onia/claude-text/20261015/policy
      - --store
      - /var/lib/onia/claude-text/receipts
      - --claude
      - /opt/onia/claude-cli/2.1.288/claude
      - --execute
    enabled: true
    trust: untrusted
    tools:
      include: [review_text, status]
```

`review_text` is write-capable (`readOnlyHint:false`), so Hermes's existing untrusted-MCP handler must prompt the owning surface **before** invocation and fail closed if unavailable. `status` has `readOnlyHint:true` and does not invoke a provider. Global chat allowlists alone are not proof of per-tool approval. Verify the approver identity and Telegram surface before any remote review. Raw include names are `review_text`/`status`; registered tools are `mcp__onia_claude_text__review_text` and `mcp__onia_claude_text__status`. Do not change trust to full to avoid a prompt. Future unattended grants/trust are an explicit configuration decision, not authorized by local smoke.

Sources observed by independent QA: `hermes_cli/mcp_config.py:55-70,540-565`; `tools/mcp_tool_registration.py:28-55`; `tools/mcp_tool_handlers.py:39-55`; `gateway/authz_mixin.py:488-548`. Native manifest/signature URLs are `https://downloads.claude.ai/claude-code-releases/2.1.288/manifest.json` and `.sig`; key `https://downloads.claude.ai/keys/claude-code.asc`; [official setup](https://code.claude.com/docs/en/setup).

## Rollback and stop conditions

Before mutation record original config SHA256, gateway active state and service identity. On failed preflight: no config change or restart. On config validation/startup failure: restore the exact private config backup, verify its original SHA256, then `systemctl restart hermes-gateway.service` and check `systemctl is-active hermes-gateway.service` plus bounded sanitized startup logs. If rollback fails, stop and preserve backup/diagnostics. The isolated release/native executable can stay inert for inspection; no recursive deletion is needed for rollback. OAuth revocation is a separate account action if desired; no credentials are removed implicitly.

After success, read-only status checks prove service/config registration, not provider execution. An authorized bounded MCP review then proves remote Claude integration only if native approval surface/identity, observed model, task/attempt/hash receipts and result/status correspondence all pass. This does not prove full coding agents, subagents, PC-off autonomy, browser readiness or savings.

## Local smoke evidence

One real MCP stdio review on 2026-10-15: CLI2.1.288, observed `claude-sonnet-5-5`, provider8344ms, reply IDs1/2/3/4, stderr0, receipt/status identical. Input11288B SHA256 `5e39372bf90dd7ad1e0630afdaa767a7d368491044824da13cee6a2ba2fc9579`; explicit continuity skill SHA256 `5c3f6a5ecd0ee32fe7423ce36631520338e3defd1952fec4f1fb8cd2062afc8e`. Provider digest `177c6d2068414bf794450d25e5401366c52400b1ce53e0ecef20686e9f5a5ed0`. Model returned the three relevant points and referenced the supplied skill. Requested `<150` words was not met (155 words, independent QA); transport/scope PASS, output length FAIL. No retry, correction generation or savings claim.
