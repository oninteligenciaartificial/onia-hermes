# Equipo de agentes de Onia · plan (10-oct-2026)

> **Fuente de verdad del diseño del equipo.** Doc vivo, sin fecha en el nombre: se EDITA. Pedido de Sergio Urcullo del
> 10-oct: una sola madre (la PC), la nube que no pare con la PC apagada, muchos agentes (uno por punto y por rol), Codex a
> fondo y modelos asignados por tarea. Salió del workflow `wf_c1e648f2-5d2`: 5 auditorías → 2 diseños (autonomía y
> confiabilidad) → síntesis → crítica adversarial. Evidencia: `research/2026-10-10-auditoria-equipo-de-agentes.md`.
> El método operativo vive en la skill `equipo-de-agentes`; cuando una parte de este plan se aplica, se pasa a la skill.
> **Leer la §Crítica antes de ejecutar:** marca qué afirmaciones del plan están CONFIRMED, UNVERIFIED o FALSE.
> Texto de los agentes en inglés; se deja tal cual para no perder precisión.

## Plan

## Verified now (read-only, 10-oct)

- **The 20-hour stall has partly cleared.** `gh pr view` shows #143 and #142 merged at 13:15Z today. onia-platform `master` is now `c1c3c6ac` (it was `c94b9daa`), and CI is running on it. Production is not verified yet.
- **Branch protection is not available.** `gh api .../branches/master/protection` returns 403 "Upgrade to GitHub Pro" because the repo is PRIVATE. That makes A's steps §6.5/§7.6 impossible. B is right.
- **All 16 remaining platform PRs are drafts** (`isDraft:true`, from #110 to #140). Every merge needs `gh pr ready` first.
- **CI runs on GitHub's paid minutes.** `ci.yml:12` uses `runs-on: ubuntu-latest` and triggers on both `push:` and `pull_request:` (lines 4-6), so each change runs about 21 minutes twice. One self-hosted runner is `online` (`gh api .../actions/runners`).
- **The Codex model policy contradicts itself.** `codex-tarea.sh:19-20` says "code = astra", but the defaults at lines 45, 51 and 57 are `gpt-6.1-sol`.
- **Some pieces exist, some don't:**
  - `onia-loop.sh:78` has an `onia-cola` case, so the integrator code exists.
  - `cola/ENTRADA.md` does not exist yet.
  - `herramientas-del-cron.mjs` references only `vigia-ci.sh` and `vigia-disco.sh`. B's "about 20 vigias" is unverified.
- **The `meta_developer_tools` connector needs OAuth** (this session's MCP notice says so).

## Scores (1-5)

| Criterion | A (autonomy) | B (reliability) |
|---|---|---|
| Finishes work | 4 | 4 |
| Never loses a task | 4 (SQLite leases), but Marca, Lucía and Ventas can't reach the board without spreading the VPS key | 3 (ledger with one writer, reconciled only while the PC is on) |
| Works with PC off | 4 (VPS integrator) | 3 (lane merges itself; `gh` merge right unverified) |
| Low setup risk | 2 (merge token on VPS, key in more environments, impossible branch protection) | 4 |
| Uses Codex quota well | 4 | 4 |
| Cost | 4 | 4 |
| **Total** | **22** | **22** |

**The tie goes to B as the base.** It is correct about the 403, needs fewer credentials and has fewer moving parts. From A, I keep:
- the integrator script that uses no LLM;
- leases, attempt counts and dead-lettering;
- turning the idle Hermes-Jarvis lane into Review/QA;
- the Telegram `ok <id>` approvals, but only for actions run by the madre or the VPS. A Telegram reply does not count as Sergio Urcullo's approval inside a cloud session.

## 1) Final architecture in 10 lines

1. The madre (Opus 5.5 with Ultracode, on the PC) is the only orchestrator. It handles intake, dispatch, browser and PC work, migration and infra merges, and reads cloud run logs.
2. The madre's round runs every 20 minutes as one workflow led by Haiku. It covers queues, PRs and CI, Codex output, bundles, ledger reconciliation, and PC health (paged pool, disk).
3. 5 cloud lanes run on an hourly heartbeat plus `/loop`. Each lane spreads its work across 2-5 subagents, one per point. Hermes-Jarvis becomes the Review/QA lane.
4. A local Codex pool of 3 Sol executors and 1 reviewer takes tasks from `codex-tareas/*.md`. A Codex cloud batch goes out after the 14-oct 03:57Z reset.
5. The gate is: CI green, plus a review from the other model family posted as a PR comment, plus a Haiku check of the proof. The local 9.9k-test vitest run is retired.
6. Merges happen one at a time: `gh pr ready`, then a re-check of `origin/master`, then `gh pr merge`.
7. Routine (class-A) PRs are merged by the owning lane, or by the madre if the lane can't. Migrations and infra are merged by the madre only.
8. Anything needing Sergio Urcullo's yes (class B: spend, contacting third parties, SIAT, legal acts, his face or voice) goes on one "Necesito" list, and lanes never wait on it.
9. The ledger is `ENTRADA.md` (written only by the madre), plus lane files with one writer each, plus one file per Codex task with lease and attempts. `--union` is never used.
10. With the PC off, `vigia-carriles.sh` on the VPS (bash, Telegram) watches for stalls. Fan-out is scaled weekly from the quota page.

## 2) Model routing

| Task type | Model | Why | Where it runs |
|---|---|---|---|
| Intake, routing, ambiguous decisions | Opus 5.5 | Highest judgment, only one instance | Madre, PC |
| Offer, claims, campaign review | Opus 5.5 subagent | A wrong promise costs the most | Ventas lane, cloud |
| Default building, writing, browser worker | Sonnet 5.5 | Best cost and quality for the work | Cloud lanes; PC browser worker |
| Closed-scope code | Codex Sol 6.1, medium | Separate quota pool; 54 runs show it works | PC (`codex-tarea.sh`), Codex cloud |
| Payments, auth, migrations, security review | Codex Astra 6, high | It used 85% of input, so it is reserved for risk | PC, `revisar` |
| Reviewing Claude's code | Codex Sol `revisar` | Reviewer from the other model family | PC |
| Reviewing Codex's code | Sonnet 5.5 | Reviewer from the other model family | Review lane, or a madre subagent |
| Triage, counting, reconciling the ledger, transcript digests, post-deploy look | Haiku 5.5 | Cheap and mechanical | Madre round; Review lane |
| Inventories, JSON, `rg` lists | Codex Luna 6, low | No sessions used so far, so its capacity is unused | PC |
| Not used | gpt-6-sol, 5.6-*, gpt-5.5 (retires 14-oct) | | |

Every Codex task contract adds `--disable multi_agent`. Codex's own subagents took 42% of its input.

## 3) Agent roster

| Lane | Analysis | Development | Review | Verification / publish | Cadence |
|---|---|---|---|---|---|
| Plataforma (cloud) | Sonnet | 2-3 Sonnet + 2 Codex Sol (through the madre) | Codex `revisar`; Astra for risk | CI + Haiku capture at 390/1440 px | Hourly + `/loop` |
| Ventas y pauta (cloud) | Opus | 2 Sonnet | Opus against the catalog | Haiku against the promise table | Hourly via its own ScheduleWakeup |
| Marca personal (cloud) | Sonnet | 2 Sonnet + HyperFrames | Sonnet with the QC skill | Haiku render check; Buffer per the 8-oct rule | Hourly + `/loop` |
| Lucía (cloud) | Sonnet | 1 Sonnet (free parts only) | Sonnet identity check | Haiku | Hourly; never paused (Sergio Urcullo, 10-oct): slows down if quota is short |
| Review/QA (Hermes-Jarvis, cloud) | none | none | 2 Sonnet | 1 Haiku post-deploy check; Meta tripwire weekly | Hourly + `/loop` |
| Madre-PC | Opus | 1 Sonnet browser worker (one task at a time) + 3 Codex | 1 Codex `revisar` | Haiku round checker | Every 20 min |

The peak is about 30-35 agents at once. Raise the count weekly only while Claude `get_usage` and Codex `wham/usage` (below 80%) allow it.

## 4) Task lifecycle and the single ledger

**The ledger is `hermes-content/docs/cola/ENTRADA.md` on `main`.**
- Each line is: `id | request | lane | class A/B | state | lease_until | attempts | proof (sha/url) | updated`.
- Only the madre writes it.
- Each lane file `cola/loop/<lane>.md` has one writer: its own lane.
- Codex tasks live one per file in `codex-tareas/`, with a header of `estado`, `modelo`, `archivos`, `lease`.

**Steps:**
1. **Intake.** The madre writes the line and commits it before doing anything else.
2. **Triage.** Haiku splits the request into points and assigns lane, roles, model and class.
3. **Claim.** Each queue has exactly one consumer, which writes `en curso <who> <lease_until +90m>`. An expired lease goes back to the queue. After 3 attempts the task goes to Necesito.
4. **Execute.** One worktree and one branch per point.
5. **Gate.** CI green (`gh pr checks`), plus a review comment from the other model family, plus Haiku confirming the proof. For anything a client sees, the proof is a capture at 390/1440 px.
6. **Merge.** One at a time, with `gh pr ready` before `merge`. Migrations follow the madre's `onia-db` backup and rollback steps.
7. **Close.** The line becomes `hecho <sha/url>` only after the change has been seen in production.

## 5) Setup steps

**(a) The madre can do these now, without approval:**
1. Build ENTRADA.md from the 10-oct request and the audit backlog.
2. Write one routing table in `AI_MODEL_ROUTING_2026.md` and fix `codex-tarea.sh:19-20`.
3. Add `--disable multi_agent` and a `meta.json` file per run to `codex-tarea.sh`.
4. Add two rules to `cola/loop/README.md` and `equipo-de-agentes`: "never idle on approval" and "no `--union`; the lane wins".
5. Refill each queue to at least 5 unblocked items, and re-point Hermes-Jarvis to Review/QA.
6. Recreate the 20-minute round as one workflow.
7. Retire the local vitest gate.
8. Write `vigia-carriles.sh` and get it reviewed, then deploy it as infra under the 9-oct rule.
9. Test whether Plataforma's `gh` can merge by having it mark one draft as ready.

**(b) Needs Sergio Urcullo's yes:**
1. One standing line typed in each of the 5 cloud sessions, because only his own text counts there.
2. `ONIA_QA_EMAIL` and `ONIA_QA_PASSWORD` in the Ventas environment, because it is a credential (it unblocks the promise table, A1/A2 and G1).
3. OAuth for the Meta MCP, because it is an account login (the Terms go through Leslie Mercado Moreno).
4. A GitHub merge token on the VPS for the integrator, because it is a credential on a server (only needed if test (a)9 fails).
5. Codex CLI 0.162.1 and a lean profile, because that is an install and a config change.
6. Which reset credits apply, because the account shows 2 available and 0 applicable, not 3.
7. Moving CI to the self-hosted runner or buying GitHub Pro, because that means load on the VPS or spend.
8. An R2 bucket, because it is spend (point 4).

## 6) First 20 tasks

| # | Task | Lane / role | Model | Acceptance |
|---|---|---|---|---|
| 1 | Publish `c1c3c6ac` and look at /login | Madre / publish + verify | Sonnet + Haiku | Image SHA matches; capture with no icon-name text |
| 2 | #140 widget plus the Chatwoot `/public/api` block and `hmac_mandatory` | Plataforma / dev → review | Sonnet, Astra | Merged; anonymous `/public/api` returns 4xx |
| 3 | #136 + #130 inbox v3 and PWA | Plataforma / review | Codex `revisar` | /inbox rendered at 390/1440 |
| 4 | #139 + B22 REVOKE (point 3) | Madre / migration | Astra | Backup taken; anonymous GET returns 401 |
| 5 | Close the superseded PRs #131, #137, #127, #129, #135 | Review / verify | Haiku | Each closed with a comment naming the PR that contains it |
| 6 | Point 1: end-to-end charge on the QA account | Madre-PC / browser | Sonnet | 1 approved row in /admin/payments |
| 7 | Rebase #110 and #132 | Codex | Sol | CI green |
| 8 | #114 invoice (migration before swap), then #124, then #113 | Plataforma + madre | Astra on #114 | Merged in that order, then checked in prod |
| 9 | #118 agenda, #119 odontogram | Plataforma | Sonnet review | Rendered captures |
| 10 | Point 4: off-VPS backup with a restore test | Madre / infra | Sonnet | Restored row counts match (needs (b)8) |
| 11 | Meta cost fixes (`meta-cobra…`, `pricing.ts`, /precios) | Codex | Sol | Tests pass; /precios matches `pricing.ts` |
| 12 | /book in "usted" | Codex | Sol, low | No "vos" forms left; rendered |
| 13 | Demo refresh plus captures C1-C7 | Plataforma + madre | Sonnet | 7 production PNGs at 390/1440 |
| 14 | Check in prod whether points 7, 10 and 11 shipped | Review | Haiku | Each marked with a capture |
| 15 | Promise vs product table (`auditar-app.mjs`) | Ventas / analysis | Haiku run, Opus review | 101 rows measured (needs (b)2) |
| 16 | Re-measure the 13-oct go/no-go | Ventas | Opus | 9 rows, each with a measured value and source |
| 17 | Ads Library captures, 7 ids | Madre-PC / browser | Sonnet | Captures plus a profile in ADQ §2.6 |
| 18 | Faceless pieces P1/P3 and carousel P2 | Marca | Sonnet + QC | Pass QC; published by Buffer |
| 19 | Meta MCP read-only audit (T1) | Madre | Sonnet | Table in `handoff/chatbot.md`; no changes made |
| 20 | `vigia-carriles.sh` | Hermes / infra | Sonnet | Fires a Telegram alert on a test stall |

Lucía's free G2/G3 parts are filler, after these 20.

## 7) Meta WhatsApp MCP

**Verdict: Onia Platform is not redundant.**
- The MCP is a beta admin tool for setting up a WhatsApp Business Account: numbers, templates, webhooks and test sends.
- It has no inbox, agenda, clinical record or billing.
- What it does change: "we set up your WhatsApp" stops being something Onia can sell as a differentiator. The things worth defending are the per-business data, SIAT billing and the agents.

**Tasks:**
- T1: read-only audit (task #19).
- T2: webhook health runbook (Review lane documents it, the madre runs it).
- T3: 8 templates in "usted", drafted by Plataforma. Submitting them needs Sergio Urcullo's yes.
- T4: onboarding runbook for the first pilot client.
- T5: weekly check of Meta's tool list, done by the Review lane.

## 8) Risks and how each is detected

| Risk | Detection | Response |
|---|---|---|
| A lane idles waiting for approval | Haiku in the round finds "waiting" while unblocked items exist; `vigia-carriles` sees no commit for 3 h | Send the lane a message; tell Sergio Urcullo which session needs his line |
| A bad merge (no branch protection) | `vigia-ci.sh` turns red on `master` | Revert PR and re-run the gate |
| GitHub Actions minutes run out | Actions usage API in the round (two runs per change) | Move CI to the self-hosted runner after (b)7 |
| A task is lost | ENTRADA line not updated for 24 h, or an expired lease | Re-queue; after 3 attempts, Necesito |
| A draft PR fails to merge silently | `isDraft` check in the gate | Run `gh pr ready` |
| Codex quota | `wham/usage` at 80% or more | Stop launching; work goes to Sonnet |
| Claude quota contention | Lost turns in transcripts; `get_usage` | Pause Hermes; Lucía is never paused (10-oct), only slowed |
| PC instability | Paged pool over 4 GB; disk under 3 GB | Stop launching Codex; reboot |
| Meta changes the MCP | T5 finds a difference in the tool list | Re-assess the verdict |

**Not verified:** whether `c1c3c6ac` is deployed, whether Plataforma's `gh` can merge, how the reset credits apply, and the October state of the VPS board and nodo-casa.

## Crítica (adversarial, verificada contra la evidencia)

# Adversarial review of the 10-oct agent-harness plan (read-only)

**Bottom line:** the plan's core is sound: the madre is the only orchestrator, CI is the gate, merges are serial, and anything needing Sergio Urcullo's yes goes on one list. But four of its load-bearing claims are false or stale, and "works with PC off" is overstated. Task #1 as written would publish a migration-dependent image without its migration.

## 1. Feasibility claims

| Claim | Verdict | Evidence |
|---|---|---|
| A schedule-triggered routine can run every 10 or 20 min | **FALSE** | The minimum cron interval is 1 h, and `*/20` returns HTTP 400 (measured facts). |
| A routine `/fire` from the VPS can drive lanes every 5-10 min | **UNVERIFIED, and a weak fit** | The only source is the docs. Each fire starts a *new* session. Per `onia-sesion-madre/SKILL.md:138-143`, a routine-spawned session starts on Sonnet, gets no VPS tunnel, has its OAuth connectors unauthorized, and does not appear in the sidebar. It is "only for short one-turn tasks". |
| The madre can open full cloud sessions | **FALSE** | Same lines: "los relevos los abre Sergio Urcullo desde la web". |
| Cloud sessions can message the madre | **FALSE** | Cloud `SendMessage` is unsupported, and `send_message` fails with `elevated_session_untrusted_device` (F7). |
| Headless `claude -p` on the VPS uses the subscription | **UNVERIFIED in October** | True as of the memory note `claude-guardia-vps.md`, but those credentials are 36 days old and were not re-tested. ToS caveat: the legal page says anything built as a service should use an API key. |
| Codex cloud can run vitest | **UNVERIFIED** | Only 2 cloud tasks have ever run, and nobody read the diff. |
| Codex cloud runs Sol 6.1 (routing table) | **FALSE** | The cloud model cannot be chosen: Astra was requested and `gpt-5.6-sol` ran (`onia-sesion-madre/SKILL.md:287`). That contradicts the plan's own "Not used: 5.6-*" row. |
| Branch protection is unavailable | **CONFIRMED** | `gh api .../branches/master/protection` returns 403 "Upgrade to GitHub Pro or make this repository public". |
| master is `c1c3c6ac` | **STALE** | master is now `32c7e0e8`. `#139` merged at 13:35:49Z, and CI on master succeeded (13:35:51 to 13:56:57). |
| All 16 remaining PRs are drafts | **FALSE** | 16 are open: 15 drafts plus `#70` (docs, not a draft). `#139` has merged since. |
| CI takes about 21 min and runs twice per change | **CONFIRMED** | The `32c7e0e8` run took 21 min. `ci.yml:3-7` triggers on both push and pull_request. There is no `concurrency:` block, and both cancelled runs at 13:15 and 13:36 look like manual cancels. |
| CI can replace the local vitest gate | **CONFIRMED** | `ci.yml` runs lint, typecheck, `npm test` (= `vitest run`, `package.json:12`) and build. Caveat: CI only runs after the madre pushes. Cloud bundles (F5) and Codex output (no git) still pass through the PC. |
| One self-hosted runner is online | **CONFIRMED** | `onia-vps-platform` is online with labels `self-hosted,Linux,X64,onia-vps`, on the production VPS. |
| `--disable multi_agent` works | **CONFIRMED** | `codex exec --help` lists `--disable <FEATURE>`, and `features list` shows `multi_agent`. |
| `codex-tarea.sh` policy contradicts its defaults | **CONFIRMED** | The header comment says "código = gpt-6-astra", but every default is `${..:-gpt-6.1-sol}`. |
| `ENTRADA.md` does not exist | **CONFIRMED, but incomplete** | `cola/TABLERO.md` already exists and documents a SQLite board whose atomic claim was tested on 2-sep. The plan creates a second ledger without retiring that one, which breaks the "one source of truth" rule. |
| A Haiku round detects lanes stuck on "waiting" | **FALSE as designed** | Subagents do not have `RemoteTrigger get_run_log`; only the madre's main loop does (constraints, "Messaging"). |
| Telegram `ok <id>` counts as approval for madre actions | **FALSE for any LLM executor** | A Telegram reply that an agent reads through a tool is observed data, not Sergio's chat. It is valid only to trigger deterministic, non-LLM VPS scripts that Sergio himself runs. |
| Lanes "never wait on approval" | **UNVERIFIED** | F1: Plataforma answered "waiting" hourly for 20 h. This holds only after (b)1 is typed in each session. |
| A peak of 30-35 concurrent agents | **Contradicted by evidence** | F11: loops lost turns with 5-8 agents on one subscription. |
| Codex pool: 3 Sol plus 1 reviewer | **Feasible only if paced** | Codex has used 56% of its weekly window, and new launches stop at 80%, which leaves about 24 points until the 14-oct 03:57Z reset. At 1-2 points per task that is 12-24 tasks. Astra took 85% of the burn, and the plan still sends `#114` and migrations to Astra. |
| Plataforma's `gh` can merge | **UNVERIFIED** | Cloud sessions cannot push new branches (F5), which points to a narrow GitHub scope. `mergedBy` is `oninteligenciaartificial` on #143, #142 and #139, so the merger can't be identified from that. |
| Hermes-Jarvis can act as the Review lane and post PR comments | **UNVERIFIED** | It needs the same GitHub write scope as above. |
| B scores 3 for "works with PC off" | **Overstated** | With the PC off, all of these stop: Codex local, Codex `revisar` (the cross-family review for Claude's PRs), the bundle push, ENTRADA writes, lease reclaim, and the round. Nothing merges. Realistic score: 2. |

## 2. Missing pieces and fixes

1. **Prod hazard (blocking):** master `32c7e0e8` now contains `prisma/migrations/20261005140000_realtime_citas_privado`, and task #1 would publish it without that migration.
   - **Fix:** merge tasks #1 and #4 into one: backup, apply `20261005140000`, publish `32c7e0e8`, check that an anonymous GET returns 401, then look at `/login`.
   - **Fix:** make the publish step refuse to run if `prisma/migrations` has entries missing from prod `_prisma_migrations`.
2. **Every migration PR leaves master unpublishable until its migration is applied.**
   - **Fix:** a lane that merges a migration PR also owns applying it before any other merge. Migration PRs get a madre-only lease in ENTRADA. This follows "Infra = UN dueño a la vez". Plataforma, Hermes and the madre all hold the VPS key today, so this lease matters.
3. **Actions minutes are unmeasured.** The billing API needs the `user` scope (404). On 9-oct there were 34 runs, roughly 350 CI-minutes. GitHub Free gives a private repo 2,000 min/month, so the minutes could run out in about 6 days (inference).
   - **Fix now (reviewed CI config, no spend):** add `concurrency: {group: ci-${{ github.ref }}, cancel-in-progress: true}`.
   - **Then:** measure usage with `gh auth refresh -s user`. Moving CI onto the production VPS runner is a load risk and stays a (b) item.
4. **Cloud transcripts can't be read by subagents.**
   - **Fix:** in each round, the madre's main loop calls `get_run_log` for the 5 lanes and dumps the output to a scratch file. Haiku parses that file. Budget the Opus cost of this.
5. **Standing approval lines disappear when a session is replaced.**
   - **Fix:** put the standing line in the startup text that Sergio Urcullo pastes when he opens a replacement session. Since he sends it himself, it counts.
   - **Fix:** list per session exactly what the line covers: merge/publish under the 9-oct rule, plus Buffer publishing under the 8-oct rule for Marca.
6. **No reviewer from the other model family while the PC is off.**
   - **Fix:** test Codex's GitHub PR review (unverified). Otherwise, allow an interim Claude-only review with the Codex review owed later, and record that in the PR.
7. **Superseded-PR closing (task #5) rests on title inference.**
   - **Fix:** prove each one by content first: `git diff` containment against the PR that absorbs it (memory rule `ramas-no-merged-mienten-con-squash`). Not Haiku.
8. **Approvals the plan missed:**
   - Task #6 needs Sergio's OK. It activates a test account through the `+qapago` email and approves a payment row in prod `/admin/payments`, which is writing production data.
   - Task #19 depends on (b)3 (Meta OAuth).
   - Task #8 (`#114`, invoice): check whether it emits real SIAT invoices. If it does, it is a legal act and goes through Leslie Mercado Moreno.
9. **Two ledgers.**
   - **Fix:** mark `TABLERO.md` as superseded inside `ENTRADA.md`'s header. Keep one file per Codex task in `handoff/codex-tareas/`, which already holds 10+ tasks.
10. **Intake and lease reclaim stop when the PC is off.**
    - **Fix:** say so explicitly. `vigia-carriles.sh` only alerts.
    - It must watch `claude/*` branches and PR updates, not just main, because cloud commits never land on main directly.
    - It needs a GitHub read token on the VPS, which is a credential, so it belongs in (b).
    - Cap it at one Telegram digest a day. CLAUDE.md §4 bans adding merge noise to a channel that is already saturated.
11. **Agent count.**
    - **Fix:** start at 10 or fewer Claude agents at once. Raise the count only after a week with no lost turns, measured with `get_usage`.
    - Tell Sergio Urcullo plainly: the bottleneck is approvals and serial merges, not the number of agents.
12. **Codex pacing until 14-oct.**
    - **Fix:** about 6 Sol tasks a day, and Astra for `#114` only.
    - Check that `df /c` shows at least 3 GB free before each launch. Each extra onia-platform worktree adds `node_modules`, so use a shared junction.
13. **Single points of failure:**
    - The madre's `CronCreate` dies on reboot and expires after 7 days. **Fix:** recreating it becomes step 0 of the madre's startup text.
    - Only Sergio can reopen a dead lane. **Fix:** keep a current startup text per lane in `handoff/`.
14. **The Ads Library browser work (task #17) may not need the browser.** This session lists a Meta Ads MCP with `ads_library_search` (the tool is deferred and its auth is unverified). **Fix:** try it read-only before using Chrome.

**Verified live in this review:** the 403 on branch protection, the PR states, master `32c7e0e8` with the `#139` migration, the 21-min CI, the self-hosted runner, the CI steps, the `--disable` flag, and the `TABLERO.md` and `codex-tareas/` contents.

**Not verified:** Actions minutes, VPS and nodo-casa state, whether cloud `gh` can merge or comment, and Codex cloud vitest.

Files:
- `C:/dev/proyectos/onia-platform/.github/workflows/ci.yml`
- `C:/dev/proyectos/onia-hermes/.claude/worktrees/onia-madre-v2-pr-review-2d85bb/scripts/codex-tarea.sh`
- `C:/dev/proyectos/onia-hermes/.claude/worktrees/onia-madre-v2-pr-review-2d85bb/hermes-content/docs/cola/TABLERO.md`
- `C:/dev/proyectos/onia-hermes/.claude/worktrees/onia-madre-v2-pr-review-2d85bb/.claude/skills/onia-sesion-madre/SKILL.md`
- `C:/dev/proyectos/onia-hermes/.claude/worktrees/onia-madre-v2-pr-review-2d85bb/.claude/skills/equipo-de-agentes/SKILL.md`
