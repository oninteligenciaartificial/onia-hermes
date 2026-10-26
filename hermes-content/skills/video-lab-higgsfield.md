# Skill: Video Lab Higgsfield

Use this skill when Sergio asks Hermes to create, plan, generate, review, or
publish videos using Higgsfield or another AI video engine.

## Current Higgsfield Routing (2026-09-22)

- Codex and Claude Code: use the official CLI and the repo skills
  `.agents/skills/higgsfield-*` / `.claude/skills/higgsfield-*`.
- Browser: use manually for Elements, Marketing Studio, identity calibration
  and visual QA.
- MCP: optional for conversational agents and capability discovery; it is not
  the production backbone.
- n8n: approval, queue, polling, ledger and notifications only.
- Never automate paid web generation with Playwright on the VPS.
- On Windows run `higgsfield ...`; never use `hf`, which may resolve to the
  Hugging Face CLI.

For Lucia, read
`hermes-content/references/modelos/lucia/LUCIA-HIGGSFIELD-IDENTITY.json` and
enforce its rights and identity gates before any new training or generation.

## Commands

- `Genera video Sergio: <idea>`
- `Crea avatar Sergio: <objetivo> | <variante>`
- `Genera Reel ONIA: <tema> | <objetivo>`
- `Crea video cliente: <negocio> | <oferta> | <estilo>`
- `Estado Video Lab`
- `Aprobar video <job_id>`
- `Rehacer video <job_id>: <cambio>`
- `Publicar video <job_id>`

## Required Reading

Before answering, read:

- `/root/.hermes/docs/VIDEO_LAB.md`
- `/root/.hermes/docs/HIGGSFIELD_VIDEO_SYSTEM.md`
- `/root/.hermes/docs/VIRAL_VIDEO_PLAYBOOK.md`
- `/root/.hermes/docs/PERSONAL_BRAND_SERGIO.md`
- `/root/.hermes/docs/ONIA.md`

If the task is for stories, also read:

- `/root/.hermes/docs/STORY_REFERENCES.md`
- `/root/.hermes/references/story-references.json`

## Operating Mode

In phase 1, Hermes must create video briefs and request approval.

Do not publish automatically.

Before creating any video brief, complete the master video brief fields from:

- `hermes-content/references/video-brief-template.json`
- `hermes-content/references/higgsfield-content-use-cases.json` when the video
  is for a business, client, Sergio's brand, or a specific rubro.

At minimum include: account, personality, topic, objective, audience, offer,
format, duration, hook, script, CTA, scenes, visual style, audio style, caption,
publish window, approval state and reuse notes.

Also create a platform copy package (the old captions skill is historia:
`hermes-content/docs/historial/skills/descripciones-sociales-onia.md`):

- `instagram_caption`
- `tiktok_description`
- `youtube_title`
- `youtube_description`
- `youtube_tags`
- `linkedin_copy`

If the current script only exposes `caption`, set it to the same value as
`instagram_caption` until the job schema is expanded.

Resolve the live model schema before quoting. Run `higgsfield generate cost`
and store the quote before every paid image/video generation. The official
third-party skill may omit this preflight unless requested; ONIA policy always
requires it. Soul training has no CLI `cost` or dry-run, so obtain a current
price through an official surface or record an explicit approved cap first.

Analysis-only work does not authorize generation. Publishing always requires a
separate approval.

## Generation Flow

Use this order:

1. Create Video Lab job.
2. Wait for `Aprobar video <job_id>`.
3. Resolve the live schema and cost/cap; record approval and input hash.
4. Generate once in Higgsfield using `higgsfield_prompt`, script and scenes.
5. If create returns ambiguously, reconcile `generate list` before any retry.
6. Upload MP4 to Hermes asset server if needed.
7. Mark generated with `Video generado <job_id>: <url_video>`.
8. Wait for review.
9. Publish only with `Publicar video <job_id>`.

n8n is optional for first videos. Use it later for reminders, Telegram approval
buttons, polling Higgsfield jobs, storing URLs/costs in Notion and updating the
content calendar. n8n must not bypass approvals.

## Deterministic Command Router

For Telegram commands, prefer the deterministic router:

```bash
video-lab telegram --message "<raw Telegram message>"
```

Use this for:

- `Crea avatar Sergio: <objetivo> | <variante>`
- `Genera video Sergio: <idea>`
- `Genera Reel ONIA: <tema> | <objetivo>`
- `Crea video cliente: <negocio> | <oferta> | <estilo>`
- `Estado Video Lab [job_id]`
- `Siguiente Video Lab`
- `Aprobar video <job_id>`
- `Rehacer video <job_id>: <cambio>`
- `Video generado <job_id>: <url_video>`
- `Archivar video <job_id>`
- `Publicar video <job_id>`

Use the returned `telegram_reply` field as the base response to Sergio.
If the command returns an error, explain the exact error and the next safe
action.

For cleanup, `Archivar video <job_id>` hides old jobs from active status while
preserving the JSON in `/root/.hermes/video-lab/archive`.

## Response Format

Return:

- `job_id`
- `lane`: `sergio`, `onia`, or `client`
- `objective`
- `audience`
- `hook`
- `script`
- `shot_list`
- `visual_style`
- `higgsfield_prompt`
- `caption`
- `platform_copy`
- `approval_state`
- `next_action`
- `publish_window`
- `cta`
- `reuse_notes`

If the command was handled by `video-lab telegram`, keep the response short and
include the `job_id`, state, next action, hook and caption summary.

## Lane Rules

### Sergio

- Make it real, informal, founder-led.
- Prioritize face, voice, screen, workspace, and building-in-public.
- Do not over-polish.
- AI face or AI voice requires explicit approval before publishing.
- For avatar jobs, use `Crea avatar Sergio: <objetivo> | <variante>` and keep the job in approval-first mode.
- Supported avatar variants: `black_operator_basic`, `black_consultant`, `black_technical_demo`, `black_premium_meeting`.
- Avatar generation must use Sergio's private reference pack only as an internal reference until the specific job is approved.

### ONIA

- Make it educational and conversion-oriented.
- Prefer demos, workflows, dashboards, before/after, and system breakdowns.
- Use AI-generated concept video only when it helps the idea.

### Client

- Ask for or infer the business type, offer, target audience and style.
- Keep the result deliverable and client-safe.
- Always require approval before publishing or delivering.

## Safety

- Never show API keys or tokens.
- Never publish placeholder URLs.
- Never use copyrighted reference assets directly.
- Never claim a result or case study unless it is real.
- Never auto-publish AI-generated face videos.

## Next Action Labels

Use one:

- `approve_brief`
- `generate_video`
- `upload_preview`
- `request_revision`
- `approve_publish`
- `publish_reel`
