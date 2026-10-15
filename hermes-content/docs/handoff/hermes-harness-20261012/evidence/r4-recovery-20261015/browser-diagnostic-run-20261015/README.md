# One approved browser diagnostic — terminal, restored, evidence limited

Source HEAD `f54b8920afc5e531f55f6000a8e914cc079c5389`. Human literal approval:
`Autorizar esta instalación y prueba de navegador`, conveyed by mother from chat
`01a13f7b-a156-7150-ba99-b4ff682163a1`. No invented message UUID. One task only:
`task_e_6ad1207987888327ac102a633061d9e7`, browser operation
`4d53a71b-80d9-4c53-83f1-df53f824ab7f`, installer operation
`857f90fa-12b7-4641-a326-e6bbad9f6745`. This approval is consumed, not a replay grant.

## Observed result and exact evidence limits

The final task UI reported bootstrap exit1, phase
`ACTUAL_BROWSER_BOOTSTRAP_START`, zero retries and no supervisor/browser receipt.
Its complete visible final message is preserved byte-exact in
`ui-final-agent-report.txt`, 1076 bytes SHA256
`1e0d4200179712b677f172cb20c10851d4fe88d97dacaaf3c4fa174f5b1248cd`.
That is an agent report, **not the runtime JSON files**. It names two remote paths
(`bootstrap-result.json`, `setup-receipt-full.json`) which were not recovered.
Neither file is reconstructed here from a summary or from the earlier installation.
No browser screenshot, sandbox PASS, queue E2E or PC-off result is demonstrated.
Actual new setup duration/component receipt remains UNKNOWN despite setup reaching
the agent stage. Actual failure cause remains UNKNOWN; there is no captured stderr
which establishes it. See `terminal-observation.json` for the precise provenance.

Read-only recovery: installed official CLI `cloud status` returned READY/no diff;
`cloud diff` and documented `--attempt 1` returned NO_DIFF_AVAILABLE, exit1,
stdout0 and identical bounded stderr digest (raw stderr not exported). Those reads
never invoked the local bridge or changed the queue. The web UI exposed the final
message but its file citation and noninteractive command label did not expose
file bytes. CLI help has no followup command. The task menu has only Pin/Copy deep
link/Archive; its composer explicitly creates a NEW local chat. None of those
actions was used to create work. No browser API/cookie/network bypass, new task,
execution retry or remote repair was attempted. The absence of diff does not
diagnose the effect or imply that the reported remote files never existed.

## Restoration and timings

Original setup, maintenance, prior public provider pin and policy were restored,
saved, reopened and compared as exact DOM strings at `19:05:25.032Z`:

- setup14832 bytes SHA57f1f52c4898c6aad6ba494d2e010e009959fd17296089fcf223b3f7a3817a62
- maintenance144 bytes SHA6a3ea5b3f45cc9a6066d94824ccfedb8c301dd572f5a36ee3bac398d9ad2a726
- prior provider pin286 bytes SHA22d95b16f7d2fcfca51a2df0226ac46f820a5c4795d991919678cc41f7e6359f

The new Root manifest pin was removed; cache toggle, domains and read-only methods
matched baseline. Private script/pin backups stayed outside Git. Material cache
retention is UNKNOWN. `config-restore-readback.json` records computed actual hashes
and raw string equality; they were not transcribed by joining hash fragments.

`timing-summary.json`: preparation started18:39:56UTC; single dispatch
18:50:28.245888→18:50:36.301369 (CLI7.531s); first agent phase observed19:01:33;
first terminal observed19:03:10.095. Acceptance→terminal observation753.793631s
(12m33.794s); terminal observation→restore134.937s (2m14.937s). These are wall
intervals, not exact provider phase duration, CPU/LLM time, cost or savings.

Transfer reused a previously byte-verified in-memory wrapper template, replaced
only the new recipe/manifest/operation bindings and checked the FULL final wrapper
hash against the independently built approved file before any UI fill. No large
unverified payload copy or extra installation submit was used. Root pin and public
configuration JSON were saved/read back before dispatch, after source freeze.

## What local QA did and did not cover

Pretrial18/18 focused tests covered approval/pin/source contracts, pending rejection,
inert imports/help/default, synthetic SQLite migration/rollback and idempotent
failed closure. Independent QA checked the full frozen claim/supervisor behavior;
Claude's20.016s review covered extracted source only. None of those checks ran the
Linux UID handoff or proved provider diff/file export. The live failure and missing
artifacts are therefore not contradicted by local PASS. Do not claim QA established
runtime readiness, complete observability or absence of all operational failures.

Local hypothesis only: browser bootstrap uses `runuser -u '#1000'`, whereas the
installer resolves the existing UID1000 account name via `pwd.getpwuid(1000)`.
Without actual command stderr, this is **not a diagnosed root cause**. No browser
patch or relaunch was made after the result. Original candidate/source/approved
artifacts remain exact; any later correction would require a newly reviewed source
and execution gate, not reuse of this consumed approval.

## Handoff scope

Sergio directed no more browser trials or queue migration as a generic prerequisite.
Next focus is Codex+Claude+Hermes CLI/MCP integration, skills, models and explicit
fallback boundaries. The v4 activation patch remains isolated preparation; no
canonical queue activation, real migration, TaskSpec, intent, lease, native consumer,
production/service or R4 mutation occurred. This directory preserves approval,
preflight, saved/readback bindings, single dispatch, bounded observations, failed
recovery metadata, exact restoration and the complete visible agent report.

## Product identification correction — 2026-10-15

Sergio's screenshot shows the ChatGPT UI at `/remote/task_e_6ad1207987888327ac102a633061d9e7`.
The dispatch binary was independently matched to bundled Codex CLI `0.162.0-alpha.17.2`, SHA256 `d13914ced6c7af174d8d638db938284231227312104b06a25e9608c632a7daec`; its `cloud exec --help` identifies Codex Cloud.
That establishes the launcher, not the served product/runtime, model or Legacy/new experience: those remain **UNKNOWN**, with no effective endpoint/product attestation preserved.
The error was communicating the current native experience and recoverable artifact export as demonstrated without verifying them; this is not evidence that every trial was regular ChatGPT chat or Work Cloud.
Official sources document [the CLI route](https://learn.chatgpt.com/docs/developer-commands?surface=cli), [Legacy transition](https://help.openai.com/en/articles/20001545-using-codex-cloud) and [separate Work/Codex experiences](https://help.openai.com/en/articles/20001275-chatgpt-work-and-codex); they do not classify this particular environment.
Future reporting must separate observed UI, verified launcher and attested runtime/product; UI branding alone proves neither backend identity nor failure cause. Historical JSON stays unchanged; no new trial was run for this audit.
The recorded preparation, acceptance-to-terminal and terminal-to-restore intervals remain 632.245888s, 753.793631s and 134.937s; no total cost or time attributable to a wrong product is established.
