# Hermes Video Lab

Hermes Video Lab is the video-generation layer for Sergio, ONIA, and client
campaigns. Hermes remains the brain: it decides the idea, strategy, script,
approval state, caption, and publishing path. Higgsfield or any other video
tool is only a rendering engine.

## Decision

Build video as a separate module inside the Hermes ecosystem, not inside the
Instagram publisher.

Reason:

- Video tools change fast and can fail or produce weak outputs.
- Publishing must remain stable even when generation breaks.
- Sergio, ONIA, and client campaigns need different approval rules.
- Costs and credits must be tracked separately from normal posting.

## Architecture

```text
Telegram or Dashboard
  -> Hermes intent parser
  -> Video Lab brief
  -> ElevenLabs audio/voice layer when needed
  -> Higgsfield/other video engine
  -> VPS asset server
  -> Approval by Sergio
  -> ig-publish reel_publish
  -> Instagram
```

## Content Lanes

### Sergio Personal Brand

Goal: trust, presence, founder story, building in public.

Recommended mix:

- 70% informal videos: face, screen, workspace, lessons, decisions.
- 20% stories/photos: gym, cafe, dashboard, calls, notes, work mood.
- 10% carousels: distilled lessons and frameworks from building ONIA.

Default video style:

- Handheld or selfie feeling.
- Clear hook in first 2 seconds.
- Subtitles.
- Natural language.
- Founder-to-founder tone.
- No over-polished corporate voice.

### ONIA

Goal: authority, education, proof, conversion.

Recommended mix:

- Carousels explaining systems.
- Reels showing workflows, before/after, dashboards and demos.
- Case-study clips.
- AI-generated conceptual videos when the visual idea is stronger than a
  screen recording.

### Clients

Goal: create deliverable marketing videos for niches.

Examples:

- Dental clinics.
- Restaurants.
- Real estate.
- Ecommerce.
- Local service businesses.

Client videos must have a brief, approval state, and delivery/export record.

## Telegram Commands

Initial commands to support:

- `Genera video Sergio: <idea>`
- `Genera Reel ONIA: <tema> | <objetivo>`
- `Crea video cliente: <negocio> | <oferta> | <estilo>`
- `Estado Video Lab`
- `Siguiente Video Lab`
- `Aprobar video <job_id>`
- `Rehacer video <job_id>: <cambio>`
- `Archivar video <job_id>`
- `Publicar video <job_id>`

Implementation route:

```bash
video-lab telegram --message "<raw Telegram message>"
```

Hermes should use the JSON field `telegram_reply` as the user-facing summary.

General Telegram route:

```bash
hermes-command telegram --message "<raw Telegram message>"
```

Use `hermes-command` as the main n8n entrypoint. It delegates Video Lab
messages to `video-lab telegram`, and also handles project, weekly plan and
automation commands. The active n8n Telegram entrypoint is
`ONIA - Telegram Command Center` (`vuicWsvh0hwqKhYs`).

## Where Sergio Reviews and Responds

Hermes must make every video job reviewable in three places:

- Telegram: primary operating inbox. Hermes sends the short answer here using
  `telegram_reply`, including `job_id`, state, hook, caption summary and next
  command.
- Dashboard: review state, logs and activity through the Hermes dashboard:

```powershell
ssh -L 9119:localhost:9119 root@187.77.16.63
```

Then open:

```text
http://localhost:9119
```

- VPS files: canonical machine records live in:

```text
/root/.hermes/video-lab/jobs
/root/.hermes/video-lab/briefs
/root/.hermes/video-lab/outputs
```

Use these commands when Sergio wants to analyze or decide:

```text
Estado Video Lab
Siguiente Video Lab
Estado Video Lab <job_id>
Aprobar video <job_id>
Rehacer video <job_id>: <cambio>
Video generado <job_id>: <url_video>
Publicar video <job_id>
```

Hermes should write back in Telegram for normal decisions, and reserve the
dashboard for deeper review, logs and batches.

## Approval Policy

Never auto-publish generated videos in phase 1.

Flow:

1. Hermes generates a brief and script.
2. Sergio approves the brief.
3. Video Lab generates the video.
4. Hermes sends preview link.
5. Sergio approves or requests changes.
6. Hermes publishes only after explicit approval.

Auto-publishing can be considered later only for low-risk formats such as
generic B-roll, non-face content, or client-approved templates.

## Captions and Descriptions

Every video job must include a platform copy package:

- `instagram_caption`: the Instagram description. The Graph API and
  `ig-publish` call this field `caption`.
- `tiktok_description`: short, native TikTok description when TikTok is
  connected.
- `youtube_title`: Shorts title.
- `youtube_description`: YouTube description, including CTA and links when
  approved.
- `linkedin_copy`: more professional version for LinkedIn.

Instagram caption formula:

```text
[hook or belief shift]

[problem/context in 1-2 lines]

[mechanism/offer]

[single CTA]

[3-8 relevant hashtags]
```

Rules:

- The first line must work even if the user never reads the full caption.
- One CTA only.
- Do not use fake urgency, invented results, medical guarantees or client data.
- For Sergio, write in first person and keep it founder-led.
- For ONIA, write educational and conversion-oriented.
- For clients, use only approved offers and claims.

## Face and Avatar Policy

Using Sergio's face requires extra care.

Phase 1:

- Sergio records real informal videos.
- Hermes helps with hook, script, caption, title, cuts, and posting.

Phase 2:

- Sergio provides a small approved visual library: talking-head clips, B-roll,
  workspace, screen recordings, voice samples.
- AI can edit and remix these assets.

Phase 3:

- AI avatar or face-generation tests are allowed only with manual approval.
- No generated face video should publish automatically.

Risks:

- Uncanny facial motion.
- Incorrect mouth movement.
- Wrong claims in Sergio's voice.
- Trust damage if followers feel deceived.

Rule: when AI-generated face is used, Hermes should label internally and request
explicit approval before publishing.

## Higgsfield Recommendation

Use Higgsfield first as an external creative engine through CLI/MCP, not as the
core system of Hermes.

Current public direction indicates Higgsfield supports agent workflows through
CLI/MCP and can expose multiple image/video models. This fits a Video Lab
adapter architecture.

Detailed playbooks:

- `HIGGSFIELD_VIDEO_SYSTEM.md`
- `ELEVENLABS_AUDIO_SYSTEM.md`
- `/root/.hermes/docs/HIGGSFIELD_VIDEO_SYSTEM.md`
- `/root/.hermes/docs/ELEVENLABS_AUDIO_SYSTEM.md`
- `/root/.hermes/docs/VIRAL_VIDEO_PLAYBOOK.md`
- `/root/.hermes/docs/UGC_CLIENT_VIDEO_PLAYBOOK.md`
- `/root/.hermes/references/higgsfield-video-presets.json`
- `/root/.hermes/references/elevenlabs-audio-presets.json`

Preferred first integration:

- CLI/MCP for experimentation and manual OAuth.
- Later, API/token workflow only if it supports reliable non-interactive VPS
  operation.

When the MCP is connected, use it for analysis, virality scoring, UGC drafts,
marketing video generation, image-to-video and character consistency. Keep
publishing in `ig-publish`.

## Where n8n Fits

n8n is not required to create the first videos.

Manual MVP:

```text
Video Lab job
-> Sergio approves brief
-> Higgsfield generation
-> public MP4 URL
-> Video Lab marks generated
-> Sergio approves publish
-> ig-publish
```

n8n should be added when we need recurring orchestration:

- send Telegram reminders for `waiting_approval` jobs;
- collect approvals with buttons;
- poll Higgsfield async jobs when available;
- register costs, URLs and statuses in Notion;
- update content calendar;
- notify Sergio when a generated video is ready;
- queue approved publishing commands.

n8n must not skip approval gates.

## Cross-Platform Publishing

Current production publishing:

- Instagram: connected through `ig-publish` and Meta Graph API.

Planned publishing:

- TikTok: possible through TikTok Content Posting API after developer app,
  OAuth, required scopes, app review and account authorization.
- YouTube Shorts: possible through YouTube Data API `videos.insert` after
  Google OAuth and upload scope.
- LinkedIn: plan/copy first; publishing connector can be added later.

Until TikTok and YouTube are connected, Hermes should prepare platform-ready
copy and metadata but only publish to Instagram after explicit approval.

Reference:

- `CROSS_PLATFORM_PUBLISHING.md`
- `/root/.hermes/docs/CROSS_PLATFORM_PUBLISHING.md`

## ElevenLabs Recommendation

Use ElevenLabs as the Audio Lab layer for voiceover, dubbing, sound effects and
transcription.

Rules:

- Never publish Sergio AI voice without explicit approval.
- Never clone a voice without consent.
- Never use AI voice to invent testimonials or results.
- Keep audio generation separate from Instagram publishing.
- Store future audio outputs in `/var/www/html/hermes-assets/audio`.

## Codex vs Claude Recommendation

Use both, but give each a job.

Codex is better for:

- Building the VPS pipeline.
- Writing scripts.
- Creating deploy tools.
- Verifying files and services.
- Integrating Telegram, asset server, Instagram publishing, and logs.

Claude is better for:

- Creative direction.
- Video concepts.
- Tone exploration.
- Storytelling variations.
- Reviewing whether a video idea feels human.

Recommended operating model:

- Codex implements and maintains Video Lab.
- Claude can be used as an optional creative reviewer or idea partner.
- Hermes should not depend on Claude for core operations.
- The production pipeline should be model-agnostic so OpenAI, Claude, or other
  models can be swapped.

## MVP

The first version should not generate video automatically. It should produce a
job package:

- `job_id`
- lane: `sergio`, `onia`, or `client`
- objective
- audience
- hook
- script
- shot list
- visual style
- model recommendation
- caption
- approval state

Then the Higgsfield adapter can consume that package later.

## Master Video Brief

Every video for Sergio, ONIA, or a client must start from the same brief. This
keeps creative work, n8n automation, Higgsfield generation and Instagram
publishing aligned.

Required fields:

- `account`: `sergio`, `onia`, or `client`.
- `personality`: how the account should sound in the video.
- `topic`: one clear subject.
- `objective`: what the video should cause: trust, lead, booking, demo request,
  awareness, authority, retention, or sale.
- `audience`: who should feel the video is for them.
- `offer`: the product, service, audit, resource, or next step.
- `format`: talking head, screen demo, AI concept, UGC, story, carousel-to-reel,
  testimonial, or case study.
- `duration_seconds`: default 20-45 for Reels.
- `hook`: first 1-2 seconds. It must be specific, visual, and understandable
  without context.
- `script`: spoken script, written like Sergio or ONIA would actually say it.
- `cta`: one simple action at the end.
- `scenes`: shot-by-shot structure with timestamp, visual, spoken line, overlay,
  asset need and transition.
- `visual_style`: camera, lighting, color, subtitles, pacing and B-roll notes.
- `audio_style`: real voice, AI voice draft, music, sound effects, or silence.
- `caption`: Instagram caption with optional CTA and hashtags.
- `publish_window`: recommended day and time.
- `approval`: required approval state before generation, delivery or publishing.
- `reuse_notes`: what can become a carousel, story, LinkedIn post or email.

Default personalities:

- `sergio`: informal founder, practical, honest, building in public, no guru
  voice, no fake luxury, no exaggerated claims.
- `onia`: clear, useful, strategic, system-builder, educational and
  conversion-oriented.
- `client`: client-safe, benefit-led, simple, compliant with the business
  category and approved offer.

Default posting windows, Bolivia time:

- Sergio personal brand: 8:00-9:30, 12:00-13:30, or 19:00-21:00.
- ONIA education and SaaS: 9:00-11:00 or 15:00-17:30.
- Client lead-gen videos: 11:00-13:00 or 18:00-20:30.

Hook rules:

- Use one idea only.
- Name the audience or pain quickly.
- Show proof, motion, face or a dashboard in the first two seconds.
- Avoid generic openings like "Hola, soy Sergio" unless the visual tension is
  already strong.

CTA rules:

- One CTA per video.
- Prefer low-friction CTAs: "escribime sistema", "pedi la auditoria", "te
  muestro el flujo", "guarda esto", "mandame tu rubro".
- Do not ask for WhatsApp automation until business verification is ready.

Scene rules:

- Change visual rhythm every 3-5 seconds.
- Add an overlay only if it clarifies the idea.
- Do not create scenes that need unapproved client screenshots or private data.
- Videos with Sergio's face, AI voice, or client claims require manual review.

Canonical machine-readable template:

- `hermes-content/references/video-brief-template.json`

## Future Files

Suggested runtime paths on the VPS:

- `/root/.hermes/video-lab/jobs`
- `/root/.hermes/video-lab/outputs`
- `/root/.hermes/video-lab/briefs`
- `/root/.hermes/video-lab/config.json`

Suggested public output path:

- `/var/www/html/hermes-assets/videos`

## Sources Checked

- Higgsfield MCP page: `https://higgsfield.ai/mcp`
- Higgsfield API docs entry: `https://docs.higgsfield.ai/`
