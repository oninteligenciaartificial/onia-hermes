# Auditoría del equipo de agentes · 10-oct-2026

> Salida cruda de los 5 auditores del workflow `wf_c1e648f2-5d2` (madre `202a717e`), pedido de Sergio Urcullo del 10-oct:
> equipo de agentes que no para, nube con la PC apagada, Codex a fondo, modelos por tarea. El plan sale de acá:
> `hermes-content/docs/historial/ONIA_EQUIPO_DE_AGENTES.md`. Esto es evidencia, no fuente de verdad.

## audit:infra

# ONIA agent infrastructure audit, 10-oct-2026 (read-only)

I read the files in the brief and the memory notes, then checked two things live. At audit time `ListAgents` showed all 5 cloud sessions `idle`. `origin/master` of onia-platform is still `c94b9daa`, dated 9-oct 09:53 -0400. I did not SSH to the VPS or nodo-casa, so their current state is not verified.

## 1. Component map (what exists today)

- **Madre (the only orchestrator).** Claude Code desktop on the laptop, worktree `onia-madre-v2-pr-review-2d85bb`.
  - Its jobs:
    - Messages cloud sessions with `SendMessage`.
    - Reads cloud sessions with `RemoteTrigger get_run_log`.
    - Runs the full vitest gate (about 9.9k tests).
    - Fetches bundles, pushes, opens PRs and merges.
    - Does all browser work through Chrome with Sergio's logins (`onia-sesion-madre/SKILL.md:12-23`).
  - Its loop is a `CronCreate` round every 20 minutes (`7,27,47 * * * *`). It lives only while the session is open and expires after 7 days (`SKILL.md:51-55`).
  - Each round launches one Haiku verifier, which reports queue progress, `ListAgents` idle state, new PRs, and new Codex tasks or bundles (`equipo-de-agentes/SKILL.md:60-68`).
- **5 cloud sessions, one queue each** (`docs/cola/loop/*.md`):
  - Plataforma, in env "Onia" with the VPS tunnel.
  - Marca personal and Lucía, in "onia-higgsfield".
  - Hermes-Jarvis, in "Onia".
  - Ventas y pauta, in "Default".
  - Each is told to `/loop` its queue and never end a turn with pending tasks (`loop/README.md:15-35`).
- **Heartbeats.** Four hourly `RemoteTrigger` crons inject a "work your queue" turn, at :17, :27, :47 and :57 (`equipo-de-agentes/SKILL.md:37-43`). Ventas has none, because its session id is not discoverable. It relies on its own `ScheduleWakeup`.
- **Codex local.** `scripts/codex-tarea.sh` has three modes: task, `resume`, and `revisar`.
  - Config: `windows.sandbox="unelevated"`, `workspace-write`, default model `gpt-6.1-sol` at medium effort (`codex-tarea.sh:27,57-61`).
  - Output goes to `~/.codex/madre-tareas/` (54 runs so far).
  - Codex has no `.git`, so it never commits (`codex-tarea.sh:17-18`).
  - `models_cache.json` lists these usable models: gpt-6.1-sol, gpt-6-astra, gpt-6-sol, gpt-6-luna, gpt-5.6-sol, gpt-5.6-terra, gpt-5.6-luna.
  - Both Codex app heartbeats (`madre-onia-continuidad`, `onia-1-0-revisi-n-y-aprobaciones`) are `status = "PAUSED"`.
- **Codex cloud.** Platform env `6abad6a0aae081919f0b315818becb21` handles long Platform code tasks. `codex cloud exec` does not let you pick the model (`onia-sesion-madre/SKILL.md:306-308`).
- **VPS** (187.77.16.63, Easypanel):
  - Production: onia-platform, Supabase, Chatwoot, n8n (Swarm) and the publishers.
  - `claude-guardia.sh` runs every 10 minutes. It restarts dead containers and runs `claude -p` (sonnet, read-only) on Sentry issues. It uses Sergio's subscription credential, not an API key (`memory/claude-guardia-vps.md`).
  - Hermes Agent (NousResearch, not our code) runs 12 jobs that report to Telegram, on gpt-5-mini through LiteLLM (`memory/hermes-agent-nousresearch.md`).
  - The VPS runs no `onia-loop.sh` loops (`docs/cola/loops.md:14-16`).
- **nodo-casa** (WSL on DESKTOP-0GGGNMF, a different machine from the laptop):
  - Four legacy cron loops: `web-venta`, `onia-cola` (the integrator), `chatbot-cola`, `recorrido-cliente`.
  - The VPS reaches it through a reverse tunnel on `:2222` with `casa.sh`. That is read-only, with no sudo.
  - Last measured 27-sep as alive. On 28-sep the tunnel returned `Connection refused` (`handoff/homelab-orquestacion-20260927.md:3-17`). There is no October measurement.
  - WSL has shut itself down twice (12-sep and 17-sep), and nothing restarts it while Windows is on (`memory/nodo-casa-via-de-vuelta.md`).
- **Model routing** (`AI_MODEL_ROUTING_2026.md:8-12`):
  - Astra is for ambiguous or high-risk work.
  - Sol is for daily code and judgment.
  - Luna is for mechanical work.
  - On the Claude side, Haiku counts, Sonnet writes, Opus decides (`equipo-de-agentes/SKILL.md:107-110`).

Flow: Sergio's message goes to the madre, which writes the queue and sends a message. The cloud session works the queue and leaves a bundle or PR. The madre fetches the bundle, runs the full gate on the laptop, pushes, merges, and then the VPS publishes. Codex sits beside the madre as a closed-contract executor, and the madre commits its work.

## 2. Failure modes observed

| # | Failure | Evidence |
|---|---|---|
| F1 | **Plataforma sat idle for 20 h with heartbeats firing.** Every hour it answered that it was waiting for Sergio's yes/no (F1 #143, #142, #140, "is the 9-oct rule yours?"). onia-platform master did not move from `c94b9daa`. | `handoff/madre-local.md:33-48`; `git log origin/master` |
| F2 | **The madre cannot lend its authority to a cloud session.** A madre message, a heartbeat, or a rule pushed into CLAUDE.md all count for nothing. Approval counts only if Sergio writes it in that session. | `equipo-de-agentes/SKILL.md:137-141` |
| F3 | **Cloud sessions go idle between messages.** On 8-9 oct, Plataforma, Marca and Ventas stopped with tasks pending while Lucía and Hermes kept going. The 20-minute round "no alcanza". | `equipo-de-agentes/SKILL.md:142`; `madre-local.md:83-85` |
| F4 | **Queues run out of unblocked work.** Hermes-Jarvis says "Cola sin tareas desbloqueadas". Lucía and Marca list "Bloqueado (solo Sergio)" for spend, recording and `aplicar`. Ventas has two tasks blocked on Plataforma's refreshed demo. | `loop/hermes-jarvis.md:22-30`; `lucia.md:7-8`; `marca-personal.md:9-10`; `ventas-pauta.md:3-11` |
| F5 | **The cloud cannot push new branches to onia-platform.** It leaves `.bundle` files and the madre pushes them. Every code PR therefore passes through the laptop. | `onia-sesion-madre/SKILL.md:254` |
| F6 | **Codex cannot verify its own work.** The sandbox gives `spawn EPERM`, no git, no tsc and no vitest. Codex's suite showed about 148 failures where the madre's showed 0. The madre must rerun everything. | `onia-sesion-madre/SKILL.md:238-241,255-258` |
| F7 | **The cloud-to-madre channel is broken.** `mcp__claude-code-remote__send_message` fails with `elevated_session_untrusted_device`. Cloud `SendMessage` is unsupported. | `onia-sesion-madre/SKILL.md:95` |
| F8 | **Laptop instability.** The paged pool was 17 GB on 9-oct (normal is under 1 GB) and a reboot fixed it. C: has about 8 GB free, while Codex fails below 1 GiB. Round and cron die with the session. | `equipo-de-agentes/SKILL.md:125-132`; CONTEXT |
| F9 | **The `--union` merge trap.** Merging a queue file with `--union` reopened 3 finished tasks (`hermes-jarvis.md`, merge `034533d4`). Queues are markdown checkboxes with no atomic claim. | `equipo-de-agentes/SKILL.md:117-120` |
| F10 | **Madre merge blocked by the permission classifier** ("Merge Without Review", PR #88). It passes only with a Codex review comment attached. | `onia-sesion-madre/SKILL.md:174-176,285-288` |
| F11 | **Quota is shared.** One Claude subscription feeds the madre, the cloud sessions and the VPS guard. In September, when control ran 5-8 agents, the loops lost turns ("vuelta PERDIDA por limite"). | `memory/claude-guardia-vps.md` |
| F12 | **Routine-spawned sessions are crippled.** A fresh session started by a routine has Sonnet, no VPS tunnel, OAuth connectors unauthorized, and is not shown in Sergio's sidebar. | `onia-sesion-madre/SKILL.md:138-143` |
| F13 | **Model-policy drift.** `codex-tarea.sh:19-20` says code uses astra. `equipo-de-agentes:90` says Sol by default and Astra for risk. The handoff table says astra for code. The Codex cloud request for Astra ran on gpt-5.6-sol. | the files cited |
| F14 | **Many PRs waiting for review.** 18 PRs, mostly draft, were waiting on 9-oct. The 9-oct publish rule did not release them, because of F2. | `madre-local.md:68-76` |

## 3. Hard platform constraints

- **Triggers.** The minimum cron interval is 1 hour (`*/20` returns HTTP 400). `job_config.ccr.environment_id` is required even for an existing session. A trigger injects one turn and nothing more.
- **Messaging.**
  - Madre to cloud: `SendMessage` works by name from `ListAgents`, but it gives no read receipt. A destination in another permission mode holds the message for approval.
  - Cloud to anything: no `SendMessage`. The cloud answers in its own transcript.
  - The madre reads that transcript with `RemoteTrigger get_run_log`. Madre subagents do not have that tool, so reading cloud sessions cannot be delegated.
- **Approvals.** The only valid approval is Sergio's own text in the session that will act. This covers spend, third-party contact, SIAT, legal acts, and Sergio's face or voice (`CLAUDE.md` §4). The 9-oct "publish what was reviewed" rule does not travel between sessions without a one-line yes in each.
- **Cloud capabilities.**
  - The cloud has no PC, no authenticated browser, and cannot open Instagram or Facebook.
  - It cannot push new onia-platform branches.
  - Only the "Onia" env holds the VPS key.
  - The madre cannot move to the cloud, because the cloud cannot message sessions or reach Chrome or Codex local.
- **Madre limits.** Chrome and WhatsApp must stay open. Browser use is serialized. The madre's own cron dies with its session.
- **Codex limits.**
  - Sandbox is `unelevated` with no git and no process spawning. It cannot render video or fetch Instagram.
  - It can run only pure-node tests via `node --test --test-isolation=none`.
  - Weekly cap on plan `prolite`: the last record (9-oct) shows 56% used, no credits, resetting 14-oct 03:57 UTC. The 80% no-new-launch rule is in `SKILL.md:293`.
  - The cloud model cannot be chosen.
- **Concurrency guidance.** Workflows are kept under 10 agents. A big 8-oct workflow cost about 60M tokens. Recommended Codex concurrency is 2 executors plus 1 verifier (`equipo-de-agentes:89`). That limit is policy, not a platform cap, and Sergio now wants many more agents.
- **Git rule.** `main` moves only by reviewed PR, except for the madre and the integrator (`CLAUDE.md` §4).

## 4. The 5 biggest gaps blocking "agents never stop and finish work"

1. **A human-approval bottleneck sits inside every cloud session.**
   - F1, F2 and F14 are one cause: authority cannot be inherited.
   - Fix: stop treating approvals as a per-PR queue.
     - Get one standing "publish what passes the gates" line from Sergio in each session, typed once.
     - Give each session an explicit list of what never needs a yes.
     - Route anything that still needs a yes into a single list for Sergio, not four stalled sessions.
2. **Everything that lands code funnels through one laptop.**
   - F5, F6, F8 and F10 mean cloud work stops when the laptop reboots, fills up, or the madre session closes.
   - Fix: move the gate to CI (the VPS runners already exist), and give cloud sessions a scoped way to push branches. That needs Sergio's approval, because it changes credentials.
   - Fix: make bundle intake automatic.
   - Fix: add a second always-on executor that holds the madre's duties. The VPS "Onia" env is the candidate, but it needs Sergio's OK because it is an account login.
3. **Heartbeats are alarms, not engines, and there is no dead-man's switch off the laptop.**
   - A heartbeat injects one prompt per hour (F3).
   - Ventas has none, and the madre round dies with the PC.
   - Nothing off the laptop watches for stalled queues; the existing VPS `claude-guardia.sh` and `hermes-vigia.sh` check only containers, Sentry and Hermes.
   - Fix: a watchdog that does not live in the madre session. Candidates are a VPS cron or a Hermes job that checks queue timestamps and `master`, and alerts through Telegram.
4. **The backlog is hand-fed and mostly human-gated, and it is thin on growth work.**
   - F4 and F9 show queues of 3-12 items, many blocked, in markdown with no atomic claim.
   - The queues cover the 1.0 (Plataforma), content (Marca, Lucía), and sales assets (Ventas), but marketing and Meta/WhatsApp strategy have no dedicated unblocked queue.
   - Fix: a task board with atomic claim and priority. Hermes' Kanban (SQLite, atomic claim) was flagged earlier and never tried.
   - Fix: pre-staged, unblocked "always-available" work per lane: research, drafts, audits, content batches.
   - Fix: an "Onia Platform vs Meta WhatsApp MCP" analysis lane. No file I read covers it, so I treat it as unowned.
5. **Quota and model routing are neither budgeted nor enforced across the fleet.**
   - F11 and F13: one subscription, Codex at 56% weekly, and three conflicting model policies.
   - Haiku and Luna are barely used for mechanical work.
   - Fix: write one routing table with a per-lane model, effort and cap, and one shared budget page the madre reads each round.
   - Fix: cheap tiers (Haiku 5.5, Luna) for counting, inventories and triage, so Opus and Astra are reserved for decisions.
   - Fix: use Codex's reset window deliberately, with a scheduled big batch right after 14-oct 03:57 UTC. The cap and the "three account resets" Sergio mentioned are not reconciled in any file, so I could not verify that claim.

**Unverified:** nodo-casa and VPS state in October, whether the 4 heartbeats are still firing now, and whether Ventas' env is reachable. All three need a live check by the madre. Subagents have no `RemoteTrigger`, and I did not SSH.

## audit:backlog

# ONIA consolidated backlog (10-oct-2026)

**Evidence base:** the handoffs, `cola/loop/*.md`, `ONIA_ESTRATEGIA_DE_EMPRESA.md`, `ONIA_PLAN_1.0_Y_CAJA.md`, `ONIA_ADQUISICION_Y_PAUTA.md`, `ONIA_ADDONS.md`, the `decision-addons-8-oct` memory, and `gh pr list` on both repos. The older handoffs (Aug and Sep) are stale. I flagged them only where they still carry a live clock.

## Summary
- **Stage:** Etapa 1, 0 to 5 clients, exit = Bs 3.750/month recurring (`ONIA_ESTRATEGIA_DE_EMPRESA.md:222-228`). There are 0 paying clients, and the plan treats ~5 as break-even.
- **Production has not moved.** `gh api` shows onia-platform `master` still at `c94b9daa` (9-oct 13:53Z). 18 platform PRs are open, and 6 hermes PRs are open (all drafts). `#143` (the F1 fonts fix), `#142`, `#140`, `#136` and `#110` all report CLEAN except `#110`, which reports UNKNOWN.
- **The Meta go/no-go (13-oct) has 9 rows, all ❌ or unmeasured** (`ONIA_ADQUISICION_Y_PAUTA.md:666-684`). The 16-oct campaign start depends on points 1-2 being closed and on contacting the 7 leads first. The 8-oct rule says "contact nobody until the promises are verified" (`ONIA_PROMESA_VS_PRODUCTO.md` §1), so that start is at risk.
- **The constraint is a decision chain, not a shortage of agents.** Hourly heartbeats ran all night, but Plataforma answered "waiting for Sergio's yes/no" and sat idle ~20 h (`madre-local.md:34-36`). Four yes/no answers gate about 10 tasks across 4 lanes: F1 → publish → demo refresh → promise table → VSL, A1 and A2 → go/no-go.
- **Counts:** the open platform PRs reduce to 14 distinct merges. `#131` and `#137` look superseded by `#140`, and `#127`, `#129` and `#135` are inside `#136` (my inference from PR titles and `cola/loop/plataforma.md`).

★ = directly serves Etapa 1. Items marked "stale" carry no live clock.

## Plataforma (deadline: points 1-4 on 16-oct, all 15 on 30-oct)
| Point | Type | Status | Blocked by | Next action |
|---|---|---|---|---|
| ★ F1 `#143` fonts from repo | publish | CLEAN; `#141` never shipped (Google Fonts build failure) | Sergio's yes in the Plataforma session | merge → `publicar.sh` → look at /login |
| ★ `#142` pago de usted (U2) | publish | CLEAN | same | after F1 |
| ★ `#136` inbox v3 (C16b, B1, C16d, T2, B3 in the title) plus `#130` PWA | publish | CLEAN | same | merge; test the PWA on a real iPhone |
| ★ `#140` widget W1-W1e plus infra (block Chatwoot `/public/api/`, `hmac_mandatory`) | publish/infra | CLEAN | same | merge, then the infra step |
| ★ Pt 3: `#139` private agenda channel plus B22 REVOKE SQL | publish/infra | migration `20261005140000` goes before the image | same | apply the migration, then check anon GET returns 401 |
| ★ Pt 15: `#114` invoice (migration `20261009110000` before swap), pt 14: `#124` terms, pt 13: `#113` grace | publish | open | same | merge in that order |
| ★ Pt 5: `#118` agenda, pt 6: `#119` odontogram, pt 8: `#110` cash box, `#132` K1 | publish | `#110` UNKNOWN and untouched since 8-oct | same | rebase `#110`, then run each migration before swap |
| ★ Pt 1: end-to-end charge with the QA account | browser/decision | 0 payments as of 3-oct, not re-measured | confirm the `+qapago` email, approve in /admin/payments | see Sergio list |
| ★ Pt 4: off-VPS backups plus a tested restore | infra | backups only on the VPS disk | R2 bucket (spend) | create the bucket, then rclone |
| ★ Demo refresh (`seed-demo.sql`) plus `module.agents` plus screenshots C1-C7 | dev/browser | not done | publish chain | unlocks Ventas tasks 1-2 and Lucía G1 |
| Look at the 8-oct release (#128) in prod | review | open in the queue | nothing | log in and look |
| Pt 7 (presupuesto por fases), pt 10, pt 11 feriados | review | no open PR found | nothing | check in prod whether they shipped |
| Meta cost fixes (`meta-cobra-el-servicio.ts`, `pricing.ts` utilityBob, /precios line) | dev | pending since 4-oct (`onia-1.0-nube.md` §7) | nothing | send to Codex |
| `/book` in "usted" (~35 strings) | dev | pending | nothing | send to Codex |
| Doctocliq copy items (`onia-1.0-nube.md` §6b) | dev | not stage-critical | nothing | defer |

## Ventas y pauta
| Point | Type | Status | Blocked by | Next action |
|---|---|---|---|---|
| ★ Promise-vs-works table (101 promises: 19 ✅, 13 ❌, 48 need an account) | analysis | blocked | demo account plus `ONIA_QA_EMAIL`/`ONIA_QA_PASSWORD` in the Ventas env | run `auditar-app.mjs` once creds exist |
| ★ VSL 60 s with captures C1-C7 | dev | `grabar-captura.mjs` and preview ready, real app untested | demo, Sergio's takes T9/T10/T12 | record the captures |
| ★ A1 selfie (A1-S) | publish | waits for Sergio's face | Sergio | schedule the take |
| ★ Go/no-go 13-oct, 9 rows | decision | all ❌ or unmeasured | rows 1-2 Plataforma; rows 3-7 and 9 Sergio | work Plataforma first |
| ★ Meta test: US$56, 14 days, cap Bs 750, from 16-oct | publish | no campaign created, $0 spent | all of the above, plus a card in ONIA Ads | create it paused only after the go/no-go |
| ★ 7 waiting leads plus 12 prospect messages plus templates A/B and follow-up D3/7/14/30 | publish | nobody contacted | the verified-product gate, then Sergio's OK | sequence after the table is green |
| ★ Free audit event in cal.com, bio link | browser | not created | Sergio picks A or B | madre creates it in Chrome |
| 3rd weekly competition batch (15-oct) | analysis | planned | nothing | skip (the 5-oct Codex note says it does not move the stage) |
| Copy 5 marketing skills into the repo | decision | pending | Sergio | defer |

## Marca personal
| Point | Type | Status | Blocked by | Next action |
|---|---|---|---|---|
| ★ Daily content: 13 pieces 10-16 oct (`GRABAR-10-16-OCT.md`) | publish | no raw footage in Drive as of 8-oct (latest handoff); today's state unverified | Sergio recording | check the Drive folder, edit each raw file with its mold |
| P1/P3 faceless pieces, P2 carousel Sat 17, 4 asesoría stories, mosaico mold | dev | queued | nothing | start now (fills days with no footage) |
| 18 carousels awaiting approval (5-oct) | review | unclear if still pending | maybe Sergio | check status |
| Bio link and "usted" for the audit | decision | pending | Sergio | with the cal.com item |
| YT channel setup (`yt-canal.md`) | dev | stale (Sep) | Sergio | defer |

## Lucía
| Point | Type | Status | Blocked by | Next action |
|---|---|---|---|---|
| G1 with the real Pendientes screenshot | dev | queued | demo refresh | wait on Plataforma |
| G2/G3 videos per plan v5 (`#144` draft) | dev | queued | paid video batches need Sergio's yes; L02 OK and D2-D6 | do the free parts |
| Publish what passes the identity check, connect IG | publish | none published yet | Sergio | after L02 OK |

## Hermes-Jarvis
| Point | Type | Status | Blocked by | Next action |
|---|---|---|---|---|
| `aplicar` and `diagnostico` on the VPS | publish | everything merged but inert; queue empty | Sergio's yes | madre runs it from the PC |
| "Hoy salió" reading the IG API | dev | pending | Sergio's OK (credential outside original scope) | defer |
| Protect `main` in GitHub | decision | pending | Sergio | one click |

## Madre-PC
| Point | Type | Status | Blocked by | Next action |
|---|---|---|---|---|
| Round cron every 20 min | ops | dies on reboot, expires in 7 days | nothing | recreate it, add the PoolPagedBytes check |
| Fetch cloud bundles and push (`docs/cola/ramas-locales/`) | ops | cloud cannot push new branches | nothing | each round |
| Codex tasks in `codex-tareas/` (C11a, C11b, K2, K3 and others) | dev | none running | nothing | launch two at a time, run the vitest gate here |
| Meta official MCP with WhatsApp: does it change Onia? | analysis/decision | no analysis in the repo | Sergio authorizing the `meta_developer_tools` connector | one-page analysis |
| Add-ons x6 (`decision-addons-8-oct`) | decision | analyzed only | by decision, after 1.0 (nothing opens before 30-oct) | do not open |
| Etapa-1 progress | analysis | no MRR metric reported | nothing | add it to the weekly report |

## Needs the PC browser (only the madre)
- Meta Ads Library and Pinterest captures with Sergio's session (7 ids in ADQ §2.6.1). Facebook does not open from the cloud.
- Create the cal.com audit event.
- Create WhatsApp Manager templates A/B and D3/D7/D14/D30. Sending to third parties needs Sergio's OK.
- Read the `+qapago` confirmation email via Gmail and open the link. Sergio's OK is needed because it activates a test account.
- Cloudflare R2 bucket and the Hostinger snapshot check, inside Sergio's logged-in session.
- Instagram bio link and "AI-generated profile" toggle.
- Run `aplicar` against the VPS and the local Codex runs plus the full vitest gate.
- Recapture C1-C7 and A1/A2 (can run in the cloud if the QA creds go in the Ventas env).

The SIAT portal is never opened by any session, including the madre. Only Sergio opens it.

## Needs Sergio Urcullo
1. **Four yes/no answers in the Plataforma session:** F1, `#142`, `#140` with its infra, and "the 9-oct rule is mine". Cloud sessions refuse a rule the madre pushed as Sergio's approval, so a one-line answer from him there ends the stall. Alternative: the madre merges and publishes from the PC (my inference, not verified).
2. **Money and accounts:**
   - Card in ONIA Ads, plus full control of that ad account.
   - Link the 75414930 number to the Onia page.
   - OK of "US$56 · 14 days · cap Bs 750".
   - Who answers within 24 h.
   - Exchange rate on the bank statement.
   - R2 bucket.
   - Is the VPS paid?
3. **Legal and SIAT (clock 4-nov):**
   - CAFC for the pilot.
   - Create Punto de Venta 1.
   - Call the SIN.
   - Request the extension.
   - QR holder name at the BCP.
   - Terms text.
   - Leslie's OK for the predictor and for the ad card.
4. **Faces and voice:** record the 13 pieces, the A1 selfie, VSL takes T9/T10/T12, and the OK on Lucía L02.
5. **Contact third parties:** the 12 prospect messages, the A/B templates, and the cal.com A/B choice.
6. **Credentials:** `ONIA_QA_EMAIL` and `ONIA_QA_PASSWORD` in the Ventas environment. This one change unblocks Ventas tasks 1-2, Lucía G1 and A1/A2.
7. **Decisions:** "usted" scope for owners and ads, a single web price list, the add-on order (`ONIA_ADDONS.md` §11), `aplicar` yes/no, and authorizing the Meta MCP.

## Does not serve Etapa 1 (freeze)
- Web-factory publishing and the web configurator holes (`web-creator.md` §7).
- Weekly competition batches.
- Hermes polish.
- The 6 add-ons (web, IA local, Meta with IA, app, influencer ads, consulting).
- The §14 ideas: Wallet, an Onia MCP, agents talking to agents, marketplace.

## Not verified
- Whether the 9-oct pieces were recorded or published.
- The current state of the QA account.
- Whether points 7, 10 and 11 already shipped.
- Whether `#110` still merges cleanly.

## research:meta-wa-mcp

# Meta WhatsApp Business Tools MCP: what it is and what Onia should do with it

## 1. Verdict

The MCP is real and official, but narrow. It is a **developer/admin setup tool for a WABA** (WhatsApp Business Account): account, phone numbers, templates, webhooks and test sends. It is **beta and rolling out gradually**. It has **no tool to read an inbox or conversation history** and no CRM, agenda or billing.

Onia Platform is not redundant. The MCP does threaten the "we set up your WhatsApp" part of the pitch, which is now commodity.

## 2. What it is (official facts first)

**Official, from Meta's docs and blog.** One caveat: WebFetch summarizes pages with a small model, so I did not read the raw page. Two separate extractions of the docs page agreed on endpoint and status. They disagreed on whether the page has a tools table; the second said it lists tools as bullets.

| Item | Fact | Source |
|---|---|---|
| Announced | 15-Sep-2026, by Meta developer blog (Zoë Lieberman) | [blog](https://developers.facebook.com/blog/post/2026/09/15/meta-business-messaging-mcp-ai-agent/) |
| Endpoint | `https://mcp.facebook.com/whatsapp_business_tools`, Streamable HTTP. Local clients can bridge with `mcp-remote`. | [docs](https://developers.facebook.com/documentation/mcp/whatsapp-business-tools-mcp) |
| Status | "Beta - interface and tool set may change". "Rolling out gradually and may not be available to everyone yet." | docs |
| Clients | Docs list as validated: Claude Desktop, Claude Code, ChatGPT web, Codex App/CLI, Cursor App/CLI. The blog says discoverable today on Claude, Codex and ChatGPT. | [MCP index](https://developers.facebook.com/documentation/mcp) |
| Auth | Meta OAuth (blog: Facebook Login for Business). Scopes: `business_management`, `whatsapp_business_management`, `whatsapp_business_messaging`. | docs |
| Guardrails | Reads run under the caller's viewer permissions and every call is logged. State changes need an authenticated person, not an app credential. You must re-authenticate after a client restart. | docs, blog |
| Prerequisites | MANAGE role on the business, admin of a WhatsApp-enabled app connected to it, and accepted Cloud API Terms of Service. | docs |
| Limits | Rate limited per user per tool, no numbers given. Blog: "development and testing, not production sending at scale". | docs, blog |

**Tools (all prefixed `whatsapp_biz_`):**
- **Discovery:** `businesses`, `accounts`, `phone_numbers`.
- **Phone onboarding:** `add_phone_number`, `send_verification_code`, `verify_phone_number`, `register_phone_number`. The OTP still comes by SMS or voice and a human supplies it.
- **Templates:** `list_templates`, `get_template`, `create_template`, `update_template`, `delete_template`.
- **Messaging:** `send_message`. It sends free text only inside the 24-hour window, or an approved template, from a registered number, and asks you to confirm the target first.
- **Webhooks:** `configure_webhooks` and `subscribe_webhook`.
- **Account setup:** `configure_payments`, `verify_business`, and `system_user_token`. The last one only returns a deep link to Business Settings.

**Not stated anywhere official:**
- Pricing of the MCP itself.
- Regional availability, including Bolivia.
- Numeric rate limits.
- Any inbox or conversation-read tool. The docs page does not mention reading incoming messages, and webhooks are separate from the MCP tools.

**Related Meta servers** ([index](https://developers.facebook.com/documentation/mcp/llms.txt)):
- Meta Ads MCP.
- Social Technologies MCP (devtools), at `mcp.facebook.com/devtools`, for App Review, webhooks, compliance and API health. Its [open-source skills repo](https://github.com/facebook/agentic-tools) has no WhatsApp content.

**Secondary sources.**
- [TechCrunch, 15-Sep](https://techcrunch.com/2026/09/15/meta-now-lets-ai-agents-handle-the-boring-parts-of-whatsapp-business-setup/) and [Social Media Today, 16-Sep](https://socialmediatoday.com/news/meta-adds-simplified-third-party-ai-support-to-whatsapp/830617/) only paraphrase the blog.
- [remio](https://www.remio.ai/post/meta-whatsapp-business-mcp-moves-setup-into-ai-agents-but-approval-still-matters) and [justbeingresourceful, 23-Sep](https://justbeingresourceful.com/2026/09/23/metas-whatsapp-business-tools-mcp-what-it-does-and-how-to-set-it-up/) give setup walkthroughs.
- [The New Stack](https://thenewstack.io/meta-mcp-whatsapp-business-claude/) came back truncated, so only its headline is usable: agents do not get their own identity.

**Discard:**
- emergent.sh's claim of an official GitHub repo for this MCP. The repo is devtools only.
- The "70% setup time" figure, which I could not corroborate.
- The "Meta One" prices ($7.99 and $14.99, inconsistent between articles), which are irrelevant.
- DragApp's July "no official MCP" statement, which predates the launch.

**Conflict to watch.** Meta frames it as test and setup, but `send_message` can send real template messages. Treat it as a low-volume admin tool. Production traffic stays on Cloud API through Chatwoot and n8n.

**Not verified:**
- I did not call the server.
- The `meta_developer_tools` connector in this session needs OAuth re-authorization (Sergio via claude.ai connector settings).
- No `whatsapp_biz_*` tool is loaded here.
- Whether Onia's Meta account already has access is unknown.

## 3. Does it make Onia Platform redundant? No

**Why not (repo evidence):**
- **What Onia sells.** `hermes-content/docs/ONIA_CATALOGO_DE_VENTA.md` §2 and §4 describe agenda, clinical record, treatments, billing, inventory, accounting, payroll, agents and `/inbox` (line 72, "sale"). None of that is a Meta-side function.
- **Who the MCP is for.** It needs a MANAGE role and app admin. That is the Tech Provider's role, which is Onia. Our clinics never touch it. The self-service path stays Embedded Signup (`onia-platform/lib/chatbot/embedded-signup.ts`, `canal-whatsapp.ts`; `handoff/chatbot.md:14-19` says Access Verification is done and the server side is on, with a real +591 popup test pending).
- **The bot.** It is script-based with no free LLM (catalog lines 110 and 129). The MCP changes neither what we can claim nor how the bot runs. Secondary reporting says Meta's January-2026 ban targets general-purpose AI assistants, not business customer-service bots.
- **The binding constraint.** The strategy doc says the constraint is customers, not tech (zero paying clients). The MCP does not move that.

**Where it threatens:**
1. **Setup as a differentiator is gone.** Anyone with Claude or Codex can now set up a WABA and templates. "We connect your WhatsApp" is table stakes.
2. **Competitors will add agent-driven ops.** Search results show Wati already ships an MCP connector with a team inbox (secondary source, not verified).
3. **Tripwire.** If Meta adds a conversation-read tool, a "Claude is the inbox" story appears. Today it does not exist.

**Moat:** per-vertical operating data (record, agenda, cobros), vocabulary and agents, plus Bolivian billing (SIAT). Defend that, not the WhatsApp plumbing.

## 4. How Onia should use it

Meta's own tool covers ops automation. It does not cover inbox (use Chatwoot or our own `/inbox`) or the bot (our engine).

Constraints that apply to every task:
- **Where it runs.** The OAuth consent is a human step by Sergio Urcullo, and only the madre can do it. Cloud sessions have no logged-in browser.
- **Who may consent.** Sergio is a minor, so Terms of Service, payment method and Business Verification go through Leslie Mercado Moreno.
- **What needs approval.** Adding the connector needs Sergio's OK (CLAUDE.md: approve before installing tools). Any `send_message` to a real third party needs it too.
- **What not to install.** Do not install `mcp-remote` unless approved. Claude Code supports remote HTTP MCP natively.

**T1. Connect and read-only audit** (lane: madre, PC)
- Add the `whatsapp_business_tools` connector with Read scope first. Run `businesses`, `accounts`, `phone_numbers`, `list_templates`.
- *Acceptance:* a table in `hermes-content/docs/handoff/chatbot.md` with Onia's WABA, the +591 75414930 status and the template list with approval states. Zero mutations. Confirms whether our account has access.

**T2. Webhook health runbook** (lane: Hermes-Jarvis for the doc, madre executes)
- Use `configure_webhooks` and `subscribe_webhook` plus the devtools `/debug-webhooks` skill. This targets the 25-Aug incident where a prospect got zero replies (`whatsapp-canal-funciona-prospectos-sin-contestar.md`).
- *Acceptance:* a runbook listing the callback URL and subscribed fields. A synthetic round trip (inbound, then bot reply, then Chatwoot) is logged. The result is compared with the watchdog output and any gap is documented.

**T3. Template pack per vertical** (lane: Plataforma 1.0 drafts, madre submits)
- Create Spanish templates in "usted" register (an Onia rule) for reminder, recall, collections and follow-up, matching the `agents` module (confirmador, cobrador, tratamiento a medias). Include `seguimiento_demo`.
- *Acceptance:* at least 8 templates (1 per agent type, 5 verticals covered) show "approved" in `list_templates`. Variables map 1:1 to agent fields in code. No template promises "IA agenda sola" (catalog §8). Sergio approves the submission.

**T4. Pilot onboarding runbook** (lane: Plataforma 1.0 plus madre)
- For 1 to 3 pilots under Onia's WABA (written client consent). Use `add_phone_number`, `send_verification_code`, `verify_phone_number`, `register_phone_number`, then connect to the inbox. Catalog §6 item 4 says the prepaid chip is the blocker.
- *Acceptance:* a chip number goes from added to registered in under 30 minutes, with Sergio relaying the OTP. First inbound and outbound messages persist as `Message` rows and appear in `/inbox`, verified rendered at 390 and 1440 px.

**T5. Tripwire on Meta's MCP docs** (lane: Hermes-Jarvis, cloud)
- Weekly `WebFetch` of the tools page (and `llms.txt`), diffing the tool list.
- *Acceptance:* a baseline in `hermes-content/docs/` listing the tool names. Any new tool (especially read-conversation) or a Bolivia/pricing statement is flagged in the session transcript for the madre. Silent otherwise. Cloud cannot SendMessage; the madre reads its transcript.

I started the T1 prerequisite checks only as far as the web research above. I changed no files and made no commits, messages or triggers.

Repo files cited:
- `C:/dev/proyectos/onia-hermes/.claude/worktrees/onia-madre-v2-pr-review-2d85bb/hermes-content/docs/ONIA_CATALOGO_DE_VENTA.md`
- `C:/dev/proyectos/onia-hermes/.claude/worktrees/onia-madre-v2-pr-review-2d85bb/hermes-content/docs/handoff/chatbot.md`
- `C:/dev/proyectos/onia-platform/lib/chatbot/embedded-signup.ts`
- Memory: `meta-whatsapp-clientes.md`, `plataforma-canales-decision.md`, `chatwoot-canal-chatbot.md`, `whatsapp-canal-funciona-prospectos-sin-contestar.md`

## research:harness

# ONIA always-on agent harness: options as of 10-Oct-2026

## Findings

1. **Capacity comes from separate quota pools, not from more agents.**
   - `claude-guardia-vps.md:54-66` records that loops lost laps whenever the madre ran 5-8 agents on the same subscription.
   - There are three independent pools:
     - **Claude subscription:** the madre and the cloud sessions.
     - **API credits (new, 7-Oct):** $100 for Max 5x, $200 for Max 20x. They cover the Agent SDK and Managed Agents. They do not cover Claude Code ([credits doc](https://platform.claude.com/docs/en/about-claude/api-credits-for-subscribers)). Claiming them needs a Console org link.
     - **Codex (ChatGPT prolite):** has its own weekly cap.
   - The harness should put each lane on a different pool.
2. **Cloud sessions refuse the madre's authority by design.**
   - `equipo-de-agentes/SKILL.md:137-141` shows Plataforma answering "waiting for Sergio" for 20 hours.
   - Anthropic's routines doc says a fired prompt "can't act as approval or consent" ([routines](https://code.claude.com/docs/en/routines)).
   - Standing authorization has to be text Sergio wrote himself. Candidates: the routine prompt he writes in the UI, or Project instructions (16k characters, [Projects](https://code.claude.com/docs/en/claude-projects)). I have not tested whether this clears the block.
3. **The 1-hour floor applies only to the schedule trigger.**
   - A routine also has an API `/fire` endpoint with a per-routine bearer token.
   - Limits are 30 fires per hour per routine and 100 per hour per account.
   - A VPS or n8n cron can therefore drive cloud lanes every 5-10 minutes. Each fire starts a new session, not an injected turn into an existing one.

## Options, ranked for ONIA

| # | Harness | Cadence | Pool / cost | Needs Sergio's OK | Risk |
|---|---|---|---|---|---|
| 1 | **Routines (cloud) + `/fire` from VPS cron or n8n.** Replaces the RemoteTrigger heartbeats. One routine per lane, prompt written by Sergio. | Schedule: 1 h (jitter up to ~30 min). `/fire`: down to ~2-5 min. | Subscription pool. No VM charge. | Create routines and generate tokens in the web UI; store tokens on the VPS. | Low ToS risk (first-party surface). Research preview. Green status does not mean the task succeeded. A GitHub connection lapse stops runs after 72 h. |
| 2 | **Agent SDK / Managed Agents scheduled deployments, on an API key from the credits org.** Best for analysis, marketing drafts, verifiers. | Cron to the minute. Jitter 15% of interval, 5 s to 9 min. Up to 1,000 deployments. | **Separate pool** ($100-200 per month, then stops unless you buy more). Tokens plus $0.08 per session-hour. A per-run `budget` cap exists. | Link a Console org and accept the credit terms. Install the SDK. Plan tier unknown, so the amount is unconfirmed. | Beta. Needs code. No logged-in browser. Outcomes, memory and multiagent are partly preview per the docs. |
| 3 | **Claude Projects.** Claude starts parallel cloud threads. Threads that hit the limit wait and resume on their own. | Continuous. Cap of 200 new threads per day. | Subscription pool, consumed faster. | Check the sidebar at claude.ai/code. Otherwise join the waitlist. | Public beta, gradual rollout. It acts as a second orchestrator and may collide with the "one madre" rule. Its "Work locally" threads run through Remote Control and only while the PC is awake. |
| 4 | **VPS headless runner.** Already exists (`onia-loop.sh:1-9`, guardian cron every 10 min). | 1-10 min. | Subscription pool, which is the exact contention measured on 3-4 Sep. | `claude setup-token` or an API key. The VPS runs on credentials copied from the PC (`claude-guardia-vps.md:28-35`). Check they still work: the note is 36 days old. | Medium ToS risk. Legal page: OAuth is for "ordinary use"; anything built as a service "should use API key" ([legal](https://code.claude.com/docs/en/legal-and-compliance)). `setup-token` is the documented route for CI. |
| 5 | **Codex.** Cloud tasks (env `6abad6a0…`) plus a GitHub Actions cron running `codex exec`. | GitHub cron is about 5 min and can be delayed. Cloud tasks are on demand. | ChatGPT allowance. Cloud tasks can burn more than local ones. | Install the action. Confirm whether it accepts a ChatGPT login or only an API key (unverified). | Local automations need the PC on ([Codex automations](https://learn.chatgpt.com/docs/automations?surface=app)). GPT-5.5 retires 14-Oct, so pin `gpt-6.1-sol` or `gpt-6-sol`. |
| 6 | **PC supervisor: `claude --bg` plus Task Scheduler.** For browser and PC lanes only. | 1 min. | Subscription pool. | Create the Windows task. | The PC is a single point of failure. Background sessions stop on reboot ([agent view](https://code.claude.com/docs/en/agent-view)). The madre's `CronCreate` ronda dies with the session and expires after 7 days. |

Items 1-2 and 4 are layers, not alternatives.

**Scale reference:**
- Agent teams are experimental, local only, and unavailable under `-p`. Use 3-5 teammates.
- Dynamic workflows default to 16 concurrent agents (configurable up to 256) and 1,000 agents per run, all running on the machine that launches them ([workflows](https://code.claude.com/docs/en/workflows)).
- Imbue's 100+ agent run used one agent per test, an integrator agent, and a single PR for humans to review ([Imbue](https://imbue.com/blog/mngr_part_2)).

## Pattern: one task per agent, verifier before merge, never lose a task

**Ledger.**
- One task is one record: a file per task, or a GitHub issue. Not one checklist file per lane.
- The 9-Oct `--union` merge reopened finished tasks (`equipo-de-agentes/SKILL.md:117-120`). One file per task cannot conflict that way.
- Record fields:
  - `lane`
  - `contract`
  - `proof-of-done`
  - `stop-rule`
  - `status`: ready, claimed, review or done
  - `lease_until`
  - `attempts`

**Claim.**
- The agent pushes a one-line claim commit with a 90-minute lease. A rejected push means another agent won the race.
- The agent works in its own worktree on a branch `claude/<lane>-<id>` or `codex/<id>`, never on main.

**Never lose a task.**
- A Haiku 5.5 sweeper runs from VPS cron every 10 minutes.
- It re-queues any claim whose lease has expired.
- After 3 attempts it dead-letters the task into Sergio's "Necesito" block.
- Agents write the result to the ledger before ending the turn.
- A cloud VM that is reclaimed keeps its history but loses background subagents ([cloud sessions](https://code.claude.com/docs/en/claude-code-on-the-web)). So every task must be safe to re-claim and re-run.

**Verifier before merge.**
1. **Executor:** Codex Sol for closed code, Sonnet 5.5 otherwise. Executors have no merge rights.
2. **Mechanical gate first:** tsc and the full vitest suite. Run it as required CI checks on the PR so it works with the PC off.
3. **Independent reviewer, different model family:** `codex exec review` for Claude's work, Claude for Codex's work.
   - It reads the diff, not the transcript.
   - It re-runs the commands the executor claimed.
   - Agent self-reports are unreliable.
4. **Serial merge:** one branch lands at a time, with a re-check of `origin/main` before each. This matches the "main se mueve debajo tuyo" rule in `CLAUDE.md`.
5. **Close the task** only when a Haiku verifier confirms the merged SHA and, for publishable work, that it was seen in prod.

**Model tiers.**

| Role | Model |
|---|---|
| Verifier / sweeper | Haiku 5.5 |
| Executor | Sonnet 5.5, or Codex Sol 6.1 for closed code |
| Madre and ambiguous or high-risk decisions | Opus 5.5 |
| Risk review | Codex Astra |

**Browser and PC work** is the madre's lane. Cloud lanes write browser requests as tasks (`lane: madre-pc`). The madre claims them, or Projects "Work locally" threads do.

## Suggested order, each step reversible

1. Pilot one lane (Plataforma) as a routine with a Sergio-written prompt. Add a 10-minute `/fire` from the VPS. Success is a merged PR with no "waiting for Sergio" reply.
2. Ask Sergio to claim the API credits, then move the verifier and sweeper to the Agent SDK on API credits.
3. Re-authenticate the VPS runner with `setup-token`.
4. Check whether Projects is on his account.
5. Wire Codex through GitHub Actions only after confirming the auth method.

## Not verified

- Whether onia-platform's push block for cloud sessions is a GitHub App scope problem.
- Sergio's exact Max tier, which sets the credit amount.
- Whether the VPS `claude -p` credentials are still valid.
- Whether the support page's claim that credits cover `claude -p` is right. The platform doc says Claude Code is not covered. Test with a tiny Agent SDK call first.
- The Codex action's auth method.
- The 66/70 bug-catch figure for dynamic workflows is Anthropic's own test.

## Sources
- [Routines](https://code.claude.com/docs/en/routines)
- [Scheduled tasks](https://code.claude.com/docs/en/scheduled-tasks)
- [Cloud sessions](https://code.claude.com/docs/en/claude-code-on-the-web)
- [Projects](https://code.claude.com/docs/en/claude-projects)
- [Agent teams](https://code.claude.com/docs/en/agent-teams)
- [Workflows](https://code.claude.com/docs/en/workflows)
- [Agent view](https://code.claude.com/docs/en/agent-view)
- [GitHub Actions](https://code.claude.com/docs/en/github-actions)
- [Legal and compliance](https://code.claude.com/docs/en/legal-and-compliance)
- [API credits for Max and Team](https://platform.claude.com/docs/en/about-claude/api-credits-for-subscribers)
- [Managed Agents overview](https://platform.claude.com/docs/en/managed-agents/overview)
- [Scheduled deployments](https://platform.claude.com/docs/en/managed-agents/scheduled-deployments)
- [Managed Agents reference](https://platform.claude.com/docs/en/managed-agents/reference)
- [Codex automations](https://learn.chatgpt.com/docs/automations?surface=app)
- [Imbue mngr](https://imbue.com/blog/mngr_part_2)

Repo files read:
- `C:/dev/proyectos/onia-hermes/.claude/worktrees/onia-madre-v2-pr-review-2d85bb/.claude/skills/equipo-de-agentes/SKILL.md`
- `C:/dev/proyectos/onia-hermes/.claude/worktrees/onia-madre-v2-pr-review-2d85bb/scripts/loops/onia-loop.sh`
- `C:/dev/proyectos/onia-hermes/.claude/worktrees/onia-madre-v2-pr-review-2d85bb/scripts/codex-tarea.sh`

Memory notes read:
- `claude-guardia-vps.md`
- `nodo-casa-via-de-vuelta.md`
- `hermes-agent-nousresearch.md`
- `codex-cuenta-y-reparto.md`

## audit:codex

# Codex audit, 10-oct-2026 (read-only)

## 1. What exists

- **CLI:** `codex-cli 0.161.0` (npm). `codex doctor` says 0.162.1 is available; installing it needs Sergio's OK. The app's bundled CLI is 0.162-alpha.
- **Login:** ChatGPT, plan `prolite`.
- **Useful subcommands:**
  - `exec` (flags `-m`, `-s`, `-C`, `--json`, `-o`, `--ephemeral`, `--output-schema`, `-p <profile>`), `exec resume`, `exec review`, `queue`.
  - `cloud exec --env --branch --attempts`, plus `cloud list/status/diff/apply`.
  - `features list` shows `multi_agent` stable and on, so a Codex run can spawn its own subagents.
- **Default config:** `~/.codex/config.toml:1-2` has `gpt-6.1-sol` with `medium`. The memory file `codex-cuenta-y-reparto.md` still says Luna/xhigh, which is stale.
- **Config risk:** lines 22 and 24 set `approval_policy="never"` and `sandbox_mode="danger-full-access"`. Line 190 sets `windows.sandbox="elevated"`, which `doctor` marks as failed. A bare `codex exec` outside the script would run unsandboxed. `scripts/codex-tarea.sh:27` overrides this with `workspace-write` plus `unelevated`.

## 2. Models (`codex debug models`) and intended use

| Model | Context | Efforts | Catalog note | Routing doc (`AI_MODEL_ROUTING_2026.md`) |
|---|---|---|---|---|
| gpt-6.1-sol | 373k | low to ultra | Latest workhorse | Default: daily code, bounded research, docs, QA |
| gpt-6-astra | 272k | low to ultra | Frontier | Ambiguous architecture, security, payments, final review |
| gpt-6-luna | 272k | low to max | Fast and cheap | Mechanical work: `rg`, inventories, JSON, polling |
| gpt-6-sol | 272k | low to ultra | Previous generation | Not used |
| gpt-5.6-sol / terra / luna | 272k | | Older generation | Not used |
| gpt-5.5 | 272k | | Legacy, hidden | Leaves Codex 14-oct per the madre skill; 2 probe sessions only |
| gpt-reserve, codex-auto-review | | | Hidden | n/a |

- **Luna has had 0 sessions on 8 and 9-oct.** The Luna tier of the routing doc is unused.
- The live usage API lists only `gpt-6-astra` under `model_usage`.

## 3. Sandbox limits (measured from 54 runs in `~/.codex/madre-tareas`)

- **Elevated sandbox:** always failed with "setup refresh had errors" (12 failed commands, all in the 8-oct probes). Only `windows.sandbox="unelevated"` works.
- **Works:**
  - Native `git branch --show-current` via PowerShell (probe runs 142925, 151009).
  - ESLint, `node --test --test-isolation=none`, and file edits.
  - A Vite workaround got the full suite to 9,560 pass / 148 fail in run W1b. The madre's own run of the same code gave 0 red.
- **Fails (`spawn EPERM`):**
  - Any Node child process: vitest workers (17 runs hit "Startup Error"), `spawnSync git` (33 hits), `chmod`, esbuild, HyperFrames render, yt-dlp.
  - MSYS tools (`head.exe`, `bash.exe`: CreateFileMapping error 5).
  - Render and video work, which stays with the madre.
- **Environment faults, not sandbox faults:**
  - 21 `tsc` errors on the shared Prisma client (`oniaWhatsappVerificacion`).
  - 3 missing `node_modules`.
  - 4 `ENOTCACHED` (npx offline).
- **Run stats:**

| Measure | Value |
|---|---|
| Runs | 54 (41 task, 6 resume, 7 revisar) |
| Runs with a `resultado.md` | 53 (the empty one is the 8-oct script-edit race) |
| Shell commands | 744, of which 185 failed (25%) |
| Duration (file mtime) | Median 4 min, p90 8, max 15 |
| Peak concurrency launched | 4 simultaneous runs (8-oct 15:22) |

- **Prompt bloat:** 42 of 54 runs log "Exceeded skills context budget" with about 500 skills dropped. Every run pays for that list.

## 4. Cloud

- `codex cloud list` shows only 2 tasks ever, both 8-oct:
  - Platform: "Add acceptance record for new accounts", READY, +164/-9 across 6 files.
  - Hermes: a git probe with no diff.
- Environment IDs and the model caveat come from `hermes-content/docs/historial/skills/onia-sesion-madre/SKILL.md:220-226,287`:
  - Platform `6abad6a0aae081919f0b315818becb21`, Hermes `6abad782eba0819196ca234dc3abc327`.
  - The cloud model is not selectable; Astra was requested and `gpt-5.6-sol` ran.
  - Hermes is about 6 GB and its task took about 20 min.
- Cloud tasks run on OpenAI's side after launch, so they continue with the PC off. Launching and applying still needs the PC's login.
- I did not read the cloud diff, so whether full vitest runs there is **unverified**. Linux should avoid the EPERM class.
- Giving a Claude cloud session the Codex token would be a credential move and is not recommended. ChatGPT mobile or a GitHub-triggered Codex could start tasks without the PC, but I did not verify either.

## 5. Quota (live `GET wham/usage`, no secrets printed)

- **Now:** 56% of the 7-day window used. It resets 2026-10-14T03:57:41Z (13-oct 23:57 in La Paz), 312,538 s from the reading.
- **Credits:** balance 0. **`rate_limit_reset_credits`: `available_count` 2, `applicable_available_count` 0.**
  - Sergio said 3 resets. The account shows 2 available and none usable right now.
  - I could not tell why none apply yet, nor what a reset restores.
- **Burn, 8 to 9-oct:** 3% to 56% in about 23 h. That is about 108M input tokens (about 99M cached) and 0.55M output across 104 sessions.
  - Astra took 85% of input (91.7M). Sol took 14%.
  - Codex's own subagent sessions (47) took about 42% of input (44.9M), so fan-out is a large hidden cost.
  - The blended rate is about 1.8 to 2.4M input tokens per quota point, which is about 1 to 2 points per task. Per-model cost was not measurable.
- **Window outlook:** at that rate the remaining 44 points last roughly 20 hours of the 8 to 9-oct load. "Plentiful quota" only holds if the reset credits become applicable.
- Rule in force: no new launches at 80% or above (madre skill, line 293).

## 6. Plan: Codex at full use

**Preconditions the madre checks before each dispatch:**
- Live `wham/usage` is below 80%.
- `df /c` shows at least 3 GB free. It is 8.4 GB now at 99% full, and `doctor` warns under 5 GB.
- RAM: 12.8 GB free of 23.6 GB. The Codex app already uses about 3.5 GB across 23 processes.

**Workers (steady state 3 executors plus 1 reviewer, burst 4):**

| Lane | Count | Model | Work | Isolation |
|---|---|---|---|---|
| A: Platform code | 2 | Sol medium | Closed-scope features, tests, refactors | One worktree each, exclusive file list |
| B: Hermes docs | 1 | Sol medium; Luna low for mechanical | Fichas, audits, inventories, syntheses | Sparse worktree |
| R: Review | 1 | Sol medium; Astra only for payments, auth, permissions | `codex-tarea.sh revisar <dir> origin/main` on every PR | Read-only |
| C: Cloud | 2 to 3 | Sol (not selectable) | Platform tasks that need no PC, launched before Sergio leaves | None |

- **Why not 100 workers:** the serial bottleneck is the madre's full vitest gate (about 9.9k tests, one at a time), plus quota and disk. The four-run peak already stretched the cap.
- **Feed (queue files):**
  - Extend `hermes-content/docs/handoff/codex-tareas/*.md` (existing prompt format: META · PRUEBA DE HECHO · REGLA DE PARADA). Add a header with `estado` (pendiente / en-curso / listo / bloqueado), `modelo`, `esfuerzo`, `worktree`, and exclusive `archivos`.
  - Cloud sessions append tasks to the same folder. This matches how they already write `cola/loop/<carril>.md`.
  - The madre's 20-min round launches the top pending tasks whose file sets don't overlap, up to the lane counts, and writes `session_id` and the out dir back into the task file.
- **Honest limit:** the local lanes run only while the PC is on. With the PC off, only already-launched cloud tasks finish.
- **Verify and merge (madre only):**
  1. Read `PARA LA MADRE:` and `git diff --stat`. Changed files must stay within the declared list.
  2. `git checkout -- '*.snap'`, regenerate the Prisma client, then the full `npx vitest run` and `tsc --noEmit` on the PC.
  3. For risky PRs, run `revisar` and paste the result as a PR comment.
  4. Commit with the gate numbers, then `&& push`.
  5. Red tests go back to Codex through `resume` with the failing list. Codex never runs git, pushes, or merges.

**Cost controls, each needing the madre's or Sergio's go-ahead:**
- Put "no subagents" in each contract, or add `--disable multi_agent` to the script.
- Send mechanical lists (inventories, JSON normalization) to Luna low.
- Create a lean `-p` profile with plugins off to stop the 500-skill budget error. This is a config change and needs approval.
- Have `codex-tarea.sh` write a `meta.json` per run (model, effort, tokens, duration). Today the script records none of these.
- Prisma regen and a fixed `node_modules` junction remove the 21 false `tsc` errors.

**Decisions for Sergio:**
- Whether to update the CLI to 0.162.1.
- Whether to run Codex unsandboxed in isolated worktrees. The permission layer blocks that today, and it would remove the EPERM class.
- Which condition makes his reset credits applicable, and whether he really has 3.

## Evidence files

- `C:/Users/PC/.codex/config.toml`
- `C:/Users/PC/.codex/madre-tareas/` (54 runs)
- `C:/Users/PC/.codex/sessions/2026/10/{08,09}/` (rate-limit and token records)
- `C:/dev/proyectos/onia-hermes/.claude/worktrees/onia-madre-v2-pr-review-2d85bb/scripts/codex-tarea.sh`
- `C:/dev/proyectos/onia-hermes/.claude/worktrees/onia-madre-v2-pr-review-2d85bb/hermes-content/docs/AI_MODEL_ROUTING_2026.md`
- `C:/dev/proyectos/onia-hermes/.claude/worktrees/onia-madre-v2-pr-review-2d85bb/hermes-content/docs/historial/skills/onia-sesion-madre/SKILL.md` (lines 215-310)
- `C:/dev/proyectos/onia-hermes/.claude/worktrees/onia-madre-v2-pr-review-2d85bb/.claude/skills/equipo-de-agentes/SKILL.md` (lines 70-92)

