# VPS development pilot â€” prepared, not activated

META: one bounded public coding task by Claude Sonnet5.5 and one read-only subagent, reviewed by root Astra. PRUEBA: observed Agent/Read/Edit events, output diff, sandbox checks and offline tests inside the same constrained container profile. PARADA: one completed reviewed task or concrete preflight/auth/timeout failure. No replay after dispatch ambiguity. No gateway restart, new image, Codex installation, host execution of generated code or UI work.

## Observed baseline, 2026-10-15

- Existing native `/opt/onia/claude-cli/2.1.288/claude`; same subscription-safe environment auth status: loggedIn true, claude.ai, firstParty, Max; provider override names absent. No account identifiers retained.
- Gateway active; config SHA256 `bf0f2ee8dc4fd4f9a8002b260df1100601d37805118e500080c9e2d8451bd5ae` unchanged.
- Local Docker image `onia-gh-runner:2.337.0`, immutable image ID `sha256:e1f1d2b4dfcfe89d2eabdaa924621ea2ffd616e962220a790f897849aee98326`, Linux amd64, 634930001 bytes, default user runner. Image environment names PATH/DEBIAN_FRONTEND only. Entrypoint must be overridden; do not run its Actions entrypoint.
- VPS 4 CPU, MemAvailable6451496 KiB/total16376016 KiB; load averages2.45/2.19/2.33 at inspection. Proposed single job limits1CPU,1GiB RAM+no extra swap,128PIDs,300s. Recheck available RAM before activation.
- Only credential mount proposed: `/root/.claude/.credentials.json`, existing root-owned0600 file. No credential contents read by operator or sent in prompts/logs/Git. Root directory, `.claude.json`, `.hermes`, host home, Docker socket and production trees are NOT mounted.
- Codex CLI absent on VPS. Existing local Codex fallback/review remains a hybrid path and depends on the laptop. No automatic second remote provider or PC-off operation is claimed.

## Explicit permission scope requested

Approve preparation of one new nonsecret host workspace `/var/lib/onia-development/pilot-20261015`, staging only the reviewed native CLI mount, public inputs/config/prompt and this package; three containers at most sequentially (no-model probe, one Claude job, then offline tests), and cleanup of those exact containers. No new images/installations, network/service configuration or global CLI changes. Subscription usage is Max with the existing extra-usage-off confirmation; do not invoke the Hermes API model.

Container UID0 is intentional solely to read the existing0600 credential file through one read-only bind mount without chmod/chown/copying credentials. This is NOT a nonroot/rootless container. Drop all capabilities, prohibit gaining privileges, keep default Docker seccomp, root filesystem read-only, no host namespaces/devices/socket, explicit environment cleared by `/usr/bin/env -i`. Authentication necessarily remains readable to the CLI process; file-tool denies are an additional restriction, not proof a process cannot read its own authentication. No root host shell is offered to the model.

The credential file is mounted read-only, not copied to writable tmpfs. If refresh/write is required, stop and report auth failure; do not loosen mount permissions or retry with another route. Outbound network is available for Claude subscription transport; the model receives no web/network/shell tool. This does not claim a network destination firewall.

## Reviewed container recipe

Run only AFTER explicit approval. IMAGE must resolve to the exact inspected local ID; `--pull=never`. Reserved task identifier: `onia-vps-development-20261015-1`, container prefix `onia-dev-20261015-1`. Atomically reserve the task receipt directory BEFORE create/start; an existing reservation is a stop, never deletion/reuse. Record CID before start. Public input/output host paths are created in this new workspace only.

```sh
IMAGE=sha256:e1f1d2b4dfcfe89d2eabdaa924621ea2ffd616e962220a790f897849aee98326
BASE=/var/lib/onia-development/pilot-20261015
# Shared flags for the no-model probe and the ONE provider container:
# --pull=never --user 0:0 --read-only --cap-drop ALL
# --security-opt no-new-privileges:true --cpus 1 --memory 1g --memory-swap 1g --pids-limit 128
# --network bridge --ipc private --workdir /work --entrypoint /usr/bin/env
# --tmpfs /tmp:rw,nosuid,nodev,size=128m --tmpfs /home/onia:rw,nosuid,nodev,size=64m
# --mount type=bind,src=/opt/onia/claude-cli/2.1.288/claude,dst=/opt/claude,readonly
# --mount type=bind,src=/root/.claude/.credentials.json,dst=/home/onia/.claude/.credentials.json,readonly
# --mount type=bind,src=$BASE/input,dst=/input,readonly
# --mount type=bind,src=$BASE/output,dst=/work
# image arguments start with:
# -i HOME=/home/onia PATH=/usr/bin:/bin LANG=C.UTF-8 DISABLE_AUTOUPDATER=1
```

The credential mount destination under tmpfs must be supported without granting broader host paths. CLI executable compatibility, `/usr/bin/env` and probe Python availability are NOT yet observed inside this image. A failed container probe is evidence of an incompatibility, not permission to pull/install or alter mounts.

No-model probe uses the same flags/mounts and verifies effective UID, limits, rootfs/workspace permissions, absence of host production paths/socket and API override names. It may read credential existence/mode only, never print contents. Run the native CLI `--version` then `auth status --json`; capture/parse privately and publish only loggedIn/authMethod/apiProvider/subscriptionType. It must be2.1.288/claude.ai/firstParty/Max. Check credential file remains read-only. No model if a check fails. Remove only this stopped probe container after collecting ExitCode/OOMKilled/Error. A probe PASS is required; the present document is not a probe result.

## One actual coding job

Stage exact reviewed public `development_job.py` under `/input` and an explicit skill excerpt with source/excerpt SHA from the existing local contract. Do not mount the repository or user skill/plugin directories. Task: implement `/work/test_linux_compatibility.py`, using Python stdlib unittest, to exercise the existing selector on Linux: missing-primary pre-effect fallback once, auth failure blocks fallback, and reused task blocks a second callback. Tests use fake executable files/callbacks, never real providers. No unrelated product feature/framework. Parent MUST invoke one custom `onia-reader` subagent to Read `/input/development_job.py`, report relevant interfaces and stop; child cannot edit or spawn agents. Main writes only `/work/test_linux_compatibility.py` and a short `/work/result.md`.

Claude CLI profile: `--restricted --setting-sources '' --strict-mcp-config --mcp-config /input/vps-empty-mcp.json --disable-slash-commands --permission-mode dontAsk --permission-prompts none --no-session-persistence --model claude-sonnet-5-5 --effort low --max-turns 12 --output-format stream-json --verbose --forward-subagent-text`. Empty MCP and explicit settings disable hooks/plugins and exclude CLAUDE.md autoload. Use `--tools Read,Glob,Grep,Edit,Write,Agent`; allow only scoped Read/Edit paths plus `Agent(onia-reader)`, deny shell/web/MCP and Read of `/home/onia/**`. Custom onia-reader has explicit Sonnet model, Read/Grep/Glob only, maxTurns2; no Agent/edit permissions. Configuration will be saved as reviewed JSON before dispatch, not inferred from this prose. Skills/instructions are explicitly injected as data with precedence: human current task, applicable project orders, selected skill; no automatic inheritance claim.

Reserve dispatch marker before starting the provider container. Enforce the300s deadline from the operator. Killing a Docker client alone does NOT stop a container: on timeout or completion inspect recorded CID, `docker stop --time 5 CID`, if needed `docker kill CID`, then verify Running=false. Capture ExitCode/OOMKilled/Error and bounded sanitized errors before `docker rm CID`. If stop/inspect status is uncertain, mark needs_reconcile and do not rerun/fallback. Never use broad prune/delete or `--rm` before collecting metadata. Generated code is reviewed by Astra before executing it; any tests execute in another invocation of the same already-approved sandbox profile without model, not on the host. Reduce the test profile further: network none, omit credential and native CLI mounts, retain only public inputs/output and resource restrictions. Additional test-container use must be included in approval (maximum three sequential containers total: probe, provider, tests).

Public evidence: source/config/prompt hashes, imageID, CID/task/attempt binding, model observed or UNKNOWN, actual tool/subagent events, latency/usage/cache (cost only estimate), files/diff, sandbox/probe/test results and stopped-container status. Raw streams/auth responses remain private outside Git. No implicit permission for another model request on failure. Any fallback must be pre-effect with missing executable proof; auth failure/timeout is not eligibility. Subsequent Astra review can use the existing local path; no automatic laptop dispatch from the VPS is implemented here.

## Activation gate

This package is preparation only. Approval must name the exact auth read-only mount, UID0 isolated container profile, nonsecret workspace staging, three sequential containers (probe, one provider, offline tests), one Max task with one reader subagent, and CID-scoped cleanup. No deploy/restart of Hermes; no new cloud accounts, images or software. Before dispatch root Astra reviews the materialized command/config/prompt and source hashes. The existing text-bridge activation approval does not cover this change.

Materialized inputs: `vps-command.json` contains exact provider argv, fixed image/mount/resource profile and taskID; `vps-settings.json`, `vps-empty-mcp.json`, `vps-prompt.txt` bind explicit configuration/prompt. Docker create/start and probe have NOT run. Review these files before approval; no approval is inferred from their creation.

## Exact operator entrypoint (prepared only)

Stage reviewed files in the approved BASE/input, then `bash vps-run.sh probe`; after its sanitized result/root check, `bash vps-run.sh provider`; after Astra reviews generated files, `bash vps-run.sh tests --reviewed`. These are three sequential containers, never concurrent. Each phase exclusively reserves a receipt directory and never replays. Complete argv for all three phases are in `vps-command.json`; tests have no auth/native-CLI mount and network none. Raw streams remain private and are never supplied wholesale to a model. Script catches exit/timeout, stops/kills only recorded CID, verifies Running=false, retains State/ExitCode/OOMKilled before removing that stopped container. Failure/unknown is needs_reconcile, never fallback.

Permission provenance: existing local `contract.md` records previously verified Edit(path) covering Write; initial actual receipt observed successful Write/Edit with zero denials under scoped Edit grants. Keep scoped Edit grants for the two output files; no ineffective Write(path) rule is relied on. Exact skill excerpt, path, lines and source/excerpt hashes are in prompt and manifest; no implicit skill inheritance.

Approval justification: the current EXECUTION_PROTOCOL correction of9-Oct allows reviewed infrastructure work within its scope. The indispensable human approval here is specifically the NEW exposure of the existing0600 credential file read-only to a UID0 container, with this fixed container/job/cleanup scope. It is not a request for generic deployment permission, new login, credential copy or chmod/chown. No credentials were changed. No-model Docker probe is also withheld until that approval.

Preparation time was not measured continuously: UNKNOWN. Inspections, local JSON/hash assertions and shell syntax checks do not prove sandbox compatibility. No model/provider/container was started during this preparation; no savings estimate is claimed. Review corrections: unified MCP path, exact skill binding, permission provenance, explicit CID cleanup and test-profile reductions.

Final review guards: tests require both probe/PASS and provider/PASS plus explicit `--reviewed`. Test file must be regular/non-symlink; loaded unittest suite must contain at least3 tests and all must succeed. HostConfig evidence includes only memory/swap/CPU/PID limits, capDrop, securityOpt, readonlyRootfs and NetworkMode. These are container configuration observations once activated, not proof of every kernel enforcement property; currently configured_not_observed because no container ran.

## Executed attempt — bounded failure, no replay

Sergio approved package5d1a2bd6 and the explicit credential mount. Probe passed (version/auth/readonly checks), root Astra checked its sanitized evidence, then one provider ran. Both containers exited0, OOMfalse, stopped and were removed by exact CID. Task did NOT complete: native `--restricted` refused the reader path `/input/development_job.py` outside cwd `/work`. An actual Agent and child Read were observed; child Read failed. Parent stopped rather than guessing interfaces. No generated files, no tests, no retry/fallback. CLI success/exit0 are not coding completion. Exact sanitized receipts/usage/cause are in `vps-execution-receipt.json`.

Minimum correction proposed, NOT executed: mount the same nonsecret public input directory read-only at `/work/input`, update references in argv/prompt/probe/test PYTHONPATH, preserve restricted mode and private mounts. File rules alone cannot override restricted cwd. This failure is task packaging/runtime policy, not an auth, filesystem-mode or subagent-turn-budget failure. A new dispatch needs reviewed corrected bytes; the consumed task/phase cannot replay.

Neighbor observation was POST provider, not during: Platform running/healthy, restartCount0/OOMfalse; available RAM11333996KiB vs11339040 baseline. Our container stats during execution UNKNOWN because it was already removed when the monitoring order arrived. CPU/disk/network contention remains possible despite limits; no permanent placement or no-impact claim. No host service changed.

Current human order supersedes further VPS work: STOP VPS development/new packages and use the already validated Codex app + local Claude CLI path. The correction above is a diagnosis only, NOT a prepared/approved second attempt. No corrected candidate/task/container was created. Original approved command/config/prompt/script remain unchanged; no additional SSH, provider or test call follows this stop. VPS development/Orca/cloud expansion deferred. Measured execution-to-post-observation interval20:47:36–20:50:57UTC=201s includes staging/wait; not active model time or complete-project duration.
