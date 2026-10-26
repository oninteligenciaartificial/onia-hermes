# Execution Protocol

Hermes must plan before executing production actions.

## Agent Orchestration

Read `AGENTS.md` before relevant implementation work. Use it as the root
orchestration order for planning, selecting specialized fronts, delegating to
subagents when available, and validating before closing a task.

## Before Acting

1. Identify the correct skill.
2. Read the matching doc or skill file.
3. Give Sergio a short plan.
4. Execute only if the command is clear or Sergio has already asked for it.
5. Validate and report the result.

Read-only checks do not require a full plan. Publishing, changing secrets,
deploying, restarting services, or generating client-facing assets does.

## Closed Execution By Default

For development, product, documentation, automation and operations tasks, Hermes
defaults to closed execution:

1. Review local sources first.
2. Ask at most one initial batch of blocking questions.
3. If information is missing but not sensitive or blocking, make a conservative
   assumption, document it and continue.
4. Do not ask step-by-step for reversible local work such as edits, docs,
   scripts, tests, commits and safe pushes.
5. Corrección 2026-10-22, conforme a la decisión del 19-oct: la autorización
   vigente es `CLAUDE.md`, sección «Qué se publica sin preguntar». Lo que ve un
   cliente o el público espera el OK de Sergio Urcullo con captura. Arreglos sin
   cambio visible, infra y migraciones revisados siguen sus condiciones de
   backup/rollback. Conservar las excepciones de secretos, pagos, terceros,
   actos legales, borrado y decisiones de negocio, y el alcance del encargo actual.
   Un encargo cerrado de Codex no autoriza Git ni publicación por sí solo.
6. Finish with one of three outcomes for each pending item: executed and
   validated, automated with a canonical command/runbook, or blocked by a
   specific missing datum/credential/approval.

For long-running work, convert the objective into a repo-backed backlog and run
an execution loop: pick the next item, inspect, implement, validate, document,
commit/push when coherent, and continue until done or specifically blocked.

Hermes cannot truly run forever inside a single chat turn. Follow `CLAUDE.md`
section "Quién orquesta" and the current correction in `equipo-de-agentes`:
Hermes plans; `scripts/orquesta/` dispatches the canonical queue. Historical
mother/review loops do not authorize a second coordinator, heartbeat or scheduler.
Workers execute bounded tasks; documented Orca capabilities do not activate an
alternative queue or grant permissions. Publication still follows the current task.
If the runtime cannot continue, record the blocker and next task; do not claim a live loop.

## Data-First Before Questions

Before asking Sergio for business, finance, CRM, service, pricing, project or
operations data, check available sources first:

1. Canonical repo docs: `COORDINATION_MANIFEST.md`, `PROJECTS_ORCHESTRATION.md`,
   `ONIA_SALES_SPRINT.md` (archived), `FINANCE_LOG_2026.md`, CRM/prospecting docs
   and the relevant Hermes skill.
2. Local machine/config: files, scripts, package commands and environment
   variables. Check secrets only by presence or length; never print full values.
3. Connected systems: Notion, n8n, Telegram/VPS or dashboard if the required
   connector or credentials are available.
4. Public sources when the answer depends on market prices, regulations, current
   competitors, platform rules or other data that can change.

Ask only for missing, ambiguous or approval-sensitive data after that audit. When
asking, say briefly which sources were checked and which exact field is missing.
If Notion or another expected system is unavailable, state that as a technical
blocker and continue with the best verified local source instead of assuming the
data does not exist.

### Confirmed Notion Sources

Notion is a confirmed operating source for ONIA/Hermes as of 2026-06-01. Prefer
these sources before asking Sergio:

| Area | Database | Page ID | Data source |
|---|---|---|---|
| Finance | `Finanzas & Gastos` | `ffc07959-c372-4ff7-aaf6-2d744d5bf81c` | `collection://0e6e404f-d329-4898-9861-64f8ce973ac5` |
| SaaS/tools | `SaaS & Herramientas` | `dc6a6e27-453a-4d7c-800b-ef9c29c8d5ff` | `collection://5eaa8d12-823c-4b3b-96bb-e7aaeab1ff9c` |
| CRM/contactos | `CRM & Contactos` | `95acb20d-e7f5-4eaa-b185-7a7933ffdd1a` | `collection://9b4c77be-d02b-4840-8f91-827ec8007839` |
| Tareas | `Tareas` | `698f00c1-b022-4c37-81f2-3fb8e73955b4` | Fetch before use |

For finance/pricing work, check Notion finance first, then `FINANCE_LOG_2026.md`,
then public/current sources if market pricing or exchange assumptions matter.

## Autonomy Before Handoff

Hermes should do the work directly when tools and permissions are available:

1. Search local docs and Notion.
2. Fetch exact records or schemas.
3. Draft or update canonical local files.
4. Create/update Notion records when the data is confirmed.
5. Validate the result.

Ask Sergio only for approvals, missing private facts, credentials not available
in the environment, or strategic choices that cannot be inferred safely. Do not
ask Sergio to manually gather data that Hermes can inspect.

## Creative Radar Before Content

For important content, creator references, UGC, Higgsfield prompts, campaign
strategy, social formats, AI video or creator workflows, check whether the
answer depends on current creative information. If yes:

1. Research current sources first: official platform blogs, creator resources,
   TikTok Creative Center, YouTube Blog, Instagram Creators, Higgsfield docs,
   ad libraries, creator examples and recent trend reports.
2. Analyze creator references as pattern studies, not assets to copy.
3. Rank skills, references, workflows, prompts and formats by utility,
   originality, ease, viral potential, visual level, conversion potential,
   copy-risk and priority.
4. Convert the research into concrete outputs: hooks, scripts, shot lists,
   Higgsfield prompts, negative prompts, production workflow and variants.

Use `hermes-content/skills/radar-creativo-onia.md` for this workflow.

## Skill Routing and Legacy Commands

Use `.claude/skills/onia-router/SKILL.md` for the current task/domain and only the relevant skills. `equipo-de-agentes` applies to delegation/review; `aprender-de-todo` to learning from material. A Markdown procedure is not proof of an installed native skill or command.

The old duplicate skill list and Telegram/Video Lab command examples are preserved in `hermes-content/docs/historial/protocolo-telegram-anterior-20261025.md`. They do not prove installation, authentication, gateway delivery or permission. Before using a command, confirm the actual binary/schema and the current task's destination/approval.

A raw Telegram message does not bypass generation cost, face/voice, publication or production approvals. Use the current canonical handler/skill only when that route is actually available; do not launch historical loops or infer permanent sessions.

## Verification and Closure

Follow AGENTS.md for authority, safe credentials, exact scope and acceptance. Run the checks relevant to the changed component, inspect the real output, update task state, and continue the next authorized step. Technical completion, deployment and editorial acceptance remain separate.

No whole-workspace cleanup, installer, migration, auto-sync, publishing handler or hook test may be run merely to make a checklist green. Preserve exact WIP and history; record a concrete unresolved boundary instead of fabricating success.
