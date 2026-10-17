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
5. Corrección 2026-10-17: la autorización vigente es `AGENTS.md` §4, «Quién
   decide». Lo técnico (infra, migraciones con backup/rollback, bot, docs,
   revisiones) se publica sin consultar a Sergio Urcullo si pasa los gates. Lo
   visual (pantalla o sección nueva, rediseño de una viva, marca, piezas de
   contenido, su cara o su voz) y lo serio (textos legales, precios,
   gasto, terceros, datos reales de producción, borrado sin copia, secretos,
   permisos, red y decisiones de negocio) van antes a él; si algo cae en
   técnico y en serio, manda serio. Codex solo revisa PRs: ningún encargo suyo autoriza Git ni publicación.
6. Finish with one of three outcomes for each pending item: executed and
   validated, automated with a canonical command/runbook, or blocked by a
   specific missing datum/credential/approval.

For long-running work, convert the objective into a repo-backed backlog and run
an execution loop: pick the next item, inspect, implement, validate, document,
commit/push when coherent, and continue until done or specifically blocked.

Hermes cannot truly run forever inside a single chat turn. Continuous work must
follow `equipo-de-agentes`: one queue per lane, coordinated by the jefa (the
mother only watches and does what the PC requires).
Correction 2026-10-09: Codex must not create a competing heartbeat/orchestrator.
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

## Skill Routing

Use these global Codex skills when applicable:

- `skill-creator`: creating or updating Codex skills or skill policy.
- `openai-docs`: OpenAI API/model/product questions.
- `security-best-practices`: explicit security hardening or review.
- `notion-*`: Notion research, specs, knowledge capture, or implementation.
- `playwright` or `browser`: browser testing or UI verification.
- `vercel-*`, `cloudflare-deploy`, `render-deploy`, `netlify-deploy`: deploys.

Use these Hermes local skills for project operations:

- `orquestador-creativo-ia`: visual content, AI models, image/video prompts,
  ads, reels, TikToks, Shorts, UGC, ecommerce, campaign production and
  identity-safe creative execution.
- `video-lab-higgsfield`: video jobs, Higgsfield, reels, approvals.
- `videos-virales-higgsfield`: viral short-form planning, virality checks and Higgsfield MCP usage.
- `ugc-empresas-higgsfield`: UGC ads and company/client video briefs.
- `audio-elevenlabs`: voiceover, TTS, dubbing, sound effects and voice safety.
- `marca-personal-sergio`: Sergio's personal brand content.
- `historias-sergio`: Sergio story sequences.
- `instagram-publicacion`: Instagram publishing through `ig-publish`.
- `descripciones-sociales-onia`: Instagram captions/descriptions, TikTok
  descriptions, YouTube Shorts metadata and LinkedIn copy.
- `flujo-completo-carrusel`: carousel generation and publication.
- `carruseles-onia`: Onia carousel briefs.
- `referencias-pinterest`: style/reference extraction.
- `seguridad-credenciales`: tokens, secrets, env vars.
- `operaciones-dashboard`: dashboard and gateway status.
- `centro-comando-telegram`: Telegram as the main Hermes/ONIA command center,
  general routing, n8n command center, project commands and approvals.
- `n8n-automatizaciones-onia`: scheduling and longer automations.
- `orquestacion-proyectos-onia`: route Onia work across DentalGest, Gestios,
  Web Onia, client websites, Higgsfield marketing, CRM and outreach.
- `radar-creativo-onia`: current creative research, creator references,
  workflows, prompts, trends and strategy before content production.
- `consultoria-onia`: consulting, audits, implementations, installations,
  Sergio-led advisory, operational setup and client process design.

## Video Lab Command Router

When a Telegram message matches a Video Lab command, execute:

```bash
video-lab telegram --message "<raw Telegram message>"
```

Weekly planning commands are deterministic and read-only:

```bash
hermes-week-status
hermes-week-plan
hermes-week-plan --day <dia-o-fecha>
```

Map Telegram intents:

- `Estado Semana` -> `hermes-week-status`
- `Plan Semana` -> `hermes-week-plan`
- `Plan Hoy` -> `hermes-week-plan --day <current day>`

Supported messages:

- `Genera video Sergio: <idea>`
- `Crea avatar Sergio: <objetivo> | <variante>`
- `Genera Reel ONIA: <tema> | <objetivo>`
- `Crea video cliente: <negocio> | <oferta> | <estilo>`
- `Estado Video Lab [job_id]`
- `Aprobar video <job_id>`
- `Rehacer video <job_id>: <cambio>`
- `Video generado <job_id>: <url_video>`
- `Publicar video <job_id>`

Use the `telegram_reply` field from the JSON result as the basis for the answer.

## Telegram Command Center

General Hermes/ONIA commands should map to:

```bash
hermes-command telegram --message "<raw Telegram message>"
```

Use this for status, planning, project orchestration, sales prep, automation
state and content-factory requests. The command delegates Video Lab messages to
`video-lab telegram` and weekly planning messages to `hermes-week-status` or
`hermes-week-plan`.

Supported general intents:

- `Plan Sergio hoy`
- `Puedo reunirme <dia> <hora>?`
- `Modo enfoque`
- `Estoy saturado`
- `Modo gym`
- `Modo novia`
- `Cierre Sergio`
- `Estado Semana`
- `Plan Semana`
- `Plan Hoy`
- `Automatizaciones ONIA`
- `Mapa proyectos ONIA`
- `Fabrica contenido ONIA`
- `Radar creativo ONIA`
- `Cola contenido diaria`
- `Seguimientos ONIA hoy`
- `Recordatorios Video Lab detalle`
- `Platform Copy Queue`
- `Watcher Higgsfield detalle`
- `Registro Hermes`
- `Orquesta ONIA: <empresa o rubro> | <objetivo>`
- `Prepara venta DentalGest: <clinica>`
- `Prepara venta Gestios: <empresa>`
- `Prepara venta Web ONIA: <negocio>`
- `Prepara consultoria ONIA: <negocio> | <dolor o proceso>`

## Approval Boundaries

- Brief generation is safe.
- Marking a video as generated is safe if the URL is public and user-provided.
- Publishing is not safe by default.
- `Publicar video <job_id>` is treated as explicit publish approval.
- AI face videos for Sergio still require manual review before publish.

## Safety

- Never reveal tokens.
- Never publish placeholders.
- Never publish generated face videos without explicit approval.
- If a publish command fails, report the exact actionable error.

## Validation

After implementation or deploy, validate:

```bash
video-lab status --limit 5
video-lab telegram --message "Estado Video Lab"
```

For publishing:

```bash
ig-publish healthcheck
```

Do not print full tokens or secrets.
