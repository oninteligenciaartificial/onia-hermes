# Higgsfield Video System

Hermes Video Lab uses Higgsfield as an external creative engine for viral
short-form videos, UGC-style ads, ONIA demos, Sergio personal brand videos and
client campaigns.

Hermes remains the brain:

- strategy
- brief
- hook
- script
- shot list
- approval
- caption
- publishing decision
- history

Higgsfield is the render/generation layer:

- image generation
- video generation
- UGC/ad presets
- video analysis
- virality scoring
- character consistency
- asset history

## Current Integration Position

As of 2026-06-01, Higgsfield advertises an MCP endpoint at:

```text
https://mcp.higgsfield.ai/mcp
```

The official Higgsfield MCP page says the hosted MCP flow uses OAuth through a
Higgsfield account instead of storing an API key in config. It also describes
tools such as video analyzer, marketing video generator, Soul character
training, cinematic image-to-video, viral clip generator and virality
prediction.

Sources:

- https://higgsfield.ai/mcp
- https://docs.higgsfield.ai/

## Current Local Auth State

On 2026-06-01, Higgsfield CLI authentication succeeded locally through:

```powershell
npx -y -p @higgsfield/cli higgsfield auth login --no-color
```

Validated read-only status:

- account: `oninteligenciaartificial@gmail.com`
- plan: `ultra`
- available credits at validation: `3000`

Use the CLI path for generation until Codex app exposes the Higgsfield MCP tools
directly in the active tool list.

Full capabilities and model decision map:

- `HIGGSFIELD_FULL_CAPABILITIES_MAP.md`

## Operating Rule

Do not connect Higgsfield directly to Instagram publishing.

The safe chain is:

```text
Telegram / Dashboard
-> Hermes strategy
-> Video Lab job
-> approval
-> Higgsfield generation
-> public MP4 URL
-> review
-> publish approval
-> ig-publish reel_publish
```

## Generation Runbook

Higgsfield generation starts only after a Video Lab job is approved for
generation.

Current states:

```text
waiting_approval -> approved_for_generation -> generating -> generated
-> approved_for_publish -> published
```

### 1. Create or choose the job

Example:

```bash
video-lab telegram --message "Genera Reel ONIA: DentalGest: por que una clinica dental pierde pacientes aunque tenga buen servicio | conseguir demos con clinicas dentales"
```

The job must contain:

- hook;
- script;
- scenes;
- Higgsfield prompt;
- caption;
- CTA;
- publish window;
- approval state.

### 2. Approve generation

```bash
video-lab approve <job_id>
```

Telegram equivalent:

```text
Aprobar video <job_id>
```

This does not publish. It only means the brief can be sent to Higgsfield.

### 3. Generate in Higgsfield

Until the Higgsfield MCP is exposed as a callable tool in Codex, generation is a
manual or semi-manual step:

1. Open Higgsfield or use the authenticated Higgsfield CLI.
2. Copy the job's `higgsfield_prompt`.
3. Add the approved script and scene list.
4. Use only approved assets, logos, screenshots or references.
5. Generate 1-3 variants.
6. Pick the strongest version by hook clarity, brand fit and CTA clarity.
7. Export or obtain a public MP4 URL.

If the MCP becomes available inside Codex, Hermes should call the Higgsfield
tool directly using the same job fields, then store returned URLs and cost data
inside the job JSON.

### Sergio Soul ID runbook

Validated on 2026-06-04:

- Higgsfield CLI version checked through npm: `@higgsfield/cli` `0.1.40`.
- Current Sergio Soul ID: `1238064e-1295-4cbf-9a41-861d4106e0e8`.
- Current Soul name: `Sergio ONIA 20260604 All Black`.
- Legacy Sergio Soul ID: `05cebe09-5672-4d50-90b2-d92c680957f7`.
- Status: `completed`.
- Do not use `soul_cast` through CLI for Sergio identity work right now.

Reason:

- The CLI schema exposes `soul_cast` with `prompt` as an object, but current CLI
  behavior can lose or ignore the expected character reference payload.
- A failed test produced an invented character instead of Sergio. The returned
  params had `character_params: {}` and invented `full_name` / `description`.
- Related public issue: https://github.com/higgsfield-ai/cli/issues/4

Safe current route for Sergio avatar work:

```text
Soul ID or approved real reference image
-> text2image_soul_v2 / soul_cinematic still, or reference-image outfit edit
-> manual identity review
-> Seedance 2.0 / Veo 3.1 Lite image-to-video
-> manual identity + video QA
-> mark_generated with Higgsfield provenance
-> publish approval
```

### Sergio ultrareal identity prompt recipe

Validated on 2026-06-04 after rejecting distorted avatar attempts:

- Prefer the 2026-06-04 Drive face pack for current identity work.
- Use `IMG_0331_preview.jpg`, `IMG_0329_preview.jpg`, and
  `IMG_0330_preview.jpg` as neutral/front identity references.
- Use the side/profile references only to train or check geometry, not as the
  direct still to animate.
- Prefer `nano_banana_2` for identity-preserving outfit/lighting edits from
  real photos before using Seedance.
- In the 2026-06-04 test, the best route was:
  `IMG_0331_preview.jpg -> nano_banana_2 outfit edit -> Seedance 2.0`.
- Generate stills first. Do not animate a still that Sergio would not approve
  as a portrait.
- Keep motion minimal: breathing, tiny head movement, one blink. Strong motion
  increases face drift.

Still prompt pattern:

```text
Ultra-realistic identity-preserving portrait edit of the same young man from
the reference images. Use the first image as the main identity lock and the
smiling image only as warmth reference. Preserve exact identity and facial
proportions: same forehead height, same eyes size/spacing, same eyebrows, same
nose, same lips, same jawline, same chin, same ears, same neck length, same
hairstyle and hairline. Create a natural medium-close vertical founder
portrait, chest and shoulders visible, plain black fitted crew neck t-shirt, no
logos, no text. Expression: calm, confident, slight closed-mouth friendly
expression, not wide smile. Natural phone-camera realism, soft daylight,
realistic skin pores, normal human asymmetry, clean indoor background.
```

Negative prompt pattern:

```text
Avoid all AI beauty changes: no elongated face, no stretched neck, no larger
eyes, no sharpened model jaw, no wax skin, no glamor retouch, no
over-smoothing, no doll/CGI look, no text, no watermark, no logos.
```

Animation prompt pattern:

```text
Animate this approved realistic portrait with extremely subtle natural motion
only. Keep the face identity locked and stable: no facial morphing, no changed
eyes, no changed jawline, no changed nose, no changed mouth, no changed
hairstyle, no elongated neck. Natural phone-camera talking-head feel: tiny
breathing, slight micro head movement, one small natural blink, very subtle
shoulder movement. Camera remains almost still, no zoom, no pan.
```

Still generation command pattern:

```powershell
npx -y -p @higgsfield/cli higgsfield generate create text2image_soul_v2 `
  --prompt "<realistic Sergio portrait prompt>" `
  --aspect_ratio 9:16 `
  --soul-id 1238064e-1295-4cbf-9a41-861d4106e0e8 `
  --quality 2k `
  --wait --json --no-color
```

Image-to-video command pattern:

```powershell
npx -y -p @higgsfield/cli higgsfield generate create seedance_2_0 `
  --image "<approved_still_path_or_upload>" `
  --prompt "<subtle natural movement prompt>" `
  --aspect_ratio 9:16 `
  --duration 5 `
  --resolution 720p `
  --mode std `
  --wait --json --no-color
```

CLI `0.1.40` does not accept `--generate_audio false` for `seedance_2_0`.
If Seedance returns audio, strip it locally before storing the reviewed asset:

```powershell
ffmpeg -y -i "<generated.mp4>" -an -c:v copy "<generated-noaudio.mp4>"
```

When saving a generated Sergio avatar video into Video Lab, include provenance:

```powershell
video-lab mark_generated <job_id> `
  --video-url "<public_mp4_url>" `
  --source higgsfield `
  --higgsfield-job-id "<higgsfield_job_id>" `
  --model "seedance_2_0" `
  --soul-id "1238064e-1295-4cbf-9a41-861d4106e0e8" `
  --credits-used <number> `
  --identity-ok `
  --review-note "Sergio approved identity match"
```

If the strongest route uses a real approved reference image instead of a direct
Soul ID render, use:

```powershell
video-lab mark_generated <job_id> `
  --video-url "<public_mp4_url>" `
  --source higgsfield `
  --higgsfield-job-id "<higgsfield_job_id>" `
  --model "seedance_2_0" `
  --identity-source reference_image `
  --reference-asset "hermes-content/references/sergio-approved-media/higgsfield-runs/20260604-black-avatar-test/nano-reference-edit.png" `
  --credits-used <number> `
  --review-note "Pending Sergio visual identity approval"
```

If identity is not clearly Sergio, do not pass `--identity-ok`. The job remains
in `avatar_review_pending` or `needs_revision` and cannot be published.

### Sergio Avatar Realism Lab

Canonical lab reference:

```text
hermes-content/references/sergio-approved-media/avatar-realism-lab-20260604.json
```

Use this lab file when Sergio asks for a hyperrealistic avatar, talking head,
Soul ID test, face consistency pass or Higgsfield avatar iteration. It contains:

- the current identity master description;
- approved internal-generation references from the 2026-06-04 face pack;
- current public Higgsfield model notes checked on 2026-06-04;
- 10 Spanish prompt variants for stills, UGC, talking head, documentary,
  cinematic, lifestyle and premium presenter tests;
- the required five-round test plan;
- observed results for the local 2026-06-04 stills and generated motion test;
- the final base prompt, global negative prompt and publication QA checklist.

Operating rule:

```text
reference image or Soul ID -> still batch -> manual identity QA
-> minimal-motion video -> manual motion QA -> mark_generated provenance
-> publish only after explicit approval
```

Do not animate a still that is not acceptable as a portrait. Do not set
`identity_ok` from an automated judgment. For Sergio avatar jobs, `identity_ok`
means Sergio or a delegated human reviewer confirmed that the result is clearly
him and safe to show.

### 4. Upload/store the MP4

If Higgsfield returns a downloadable MP4 instead of a stable public URL, upload
it to the Hermes asset server:

```powershell
$env:ASSET_FILE="C:\path\to\video.mp4"
npm run upload:asset
```

The command returns a public URL such as:

```text
http://187.77.16.63:8099/<file>.mp4
```

### 5. Mark generated

```bash
video-lab mark_generated <job_id> --video-url <public_mp4_url>
```

Telegram equivalent:

```text
Video generado <job_id>: <public_mp4_url>
```

The job moves to `generated` and waits for review.

### 6. Review and publish

Only after Sergio approves the final video:

```text
Publicar video <job_id>
```

This runs the Instagram publisher through `ig-publish reel_publish`.

## Do We Need n8n?

Not for the first few videos.

For the MVP, Codex/Hermes plus Video Lab is enough:

```text
brief -> approve -> generate in Higgsfield -> upload URL -> review -> publish
```

n8n becomes useful when the process becomes repetitive:

- daily reminders for videos waiting approval;
- Telegram approval buttons;
- polling Higgsfield jobs if the MCP/API supports async status;
- saving generated URLs, costs and statuses to Notion/CRM;
- notifying when a video is ready for review;
- scheduling follow-ups and content calendar tasks;
- routing approved videos to publishing queues.

Rule:

- Use Video Lab for one-off creation and state.
- Use n8n for recurring orchestration, reminders, approvals and logging.
- Never use n8n to bypass approval gates.

## Content Lanes

### Sergio

Goal: trust, founder energy, building in public.

Best formats:

- talking head
- phone camera
- screen walkthrough
- workspace clips
- honest lessons
- "I am building this" updates

Avoid:

- fake luxury
- overproduced guru style
- AI face without explicit approval
- pretending AI-generated clips are real footage

### ONIA

Goal: authority, demand generation and product proof.

Best formats:

- workflow demos
- before/after system videos
- AI automation explainers
- lead follow-up demos
- dashboard walkthroughs
- client-style case breakdowns only when true

Avoid:

- exaggerated claims
- fake revenue proof
- overcomplex technical language

### Clients

Goal: client-safe commercial assets.

Best formats:

- UGC testimonial style
- problem/solution ad
- local business offer ad
- product demonstration
- review-style video
- founder/operator pitch

Commercial playbook:

- `HIGGSFIELD_CLIENT_SALES_PLAYBOOK.md`

Every client job must store:

- business
- offer
- target audience
- proof available
- required disclaimer
- approval status
- delivery URL

## Viral Framework

Every viral video brief needs:

- Hook: a visual or verbal interruption in the first 1-2 seconds.
- Pain: the viewer recognizes the problem immediately.
- Proof: show the system, product, result, screen or process.
- Shift: a surprising angle or reframing.
- CTA: one simple next action.

Default structure for 20-35 seconds:

```text
0-2s: pattern interrupt
2-6s: problem
6-14s: mechanism or demo
14-24s: proof or transformation
24-35s: CTA
```

## UGC Ad Framework

Default UGC format:

```text
0-2s: "I did not expect this to work..."
2-5s: show problem
5-12s: show product/system in use
12-20s: explain benefit like a friend
20-28s: objection handling
28-35s: CTA
```

UGC should feel human, not like a studio commercial.

## Client Ad Framework

For companies, Hermes should choose one of these:

- Direct response UGC.
- Founder/operator pitch.
- Product demo.
- Local business offer.
- Explainer with motion graphics.
- Testimonial style, only if testimonial is real or clearly scripted.

## Prompt Package For Higgsfield

Every generation request should include:

```json
{
  "lane": "sergio | onia | client",
  "format": "ugc | demo | talking_head | product_ad | story | cinematic",
  "aspect_ratio": "9:16",
  "duration_seconds": 15,
  "hook": "",
  "script": [],
  "shot_list": [],
  "visual_style": "",
  "references": [],
  "brand_rules": [],
  "negative_prompt": "",
  "approval_required": true
}
```

## MCP Tool Use Once Connected

When the Higgsfield MCP appears in Codex/Hermes tools:

1. Use video analyzer for reference videos.
2. Use virality prediction before generation if available.
3. Use marketing video generator for client/ONIA ads.
4. Use UGC/preset generator for UGC-style ads.
5. Use image-to-video for product or dashboard visuals.
6. Store outputs in `/var/www/html/hermes-assets/videos`.
7. Save final public URL in the Video Lab job.

## Approval Gates

Generation approval:

```text
Aprobar video <job_id>
```

Generated video received:

```text
Video generado <job_id>: <url_video>
```

Publication approval:

```text
Publicar video <job_id>
```

Never publish automatically.

## Success Metrics

For Sergio:

- watch time
- replies/DMs
- profile visits
- trust-building comments

For ONIA:

- saves
- DMs
- lead inquiries
- demo requests

For clients:

- CTR
- cost per lead
- booking rate
- reply quality
