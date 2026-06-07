# Hermes Content Workflow

## Goal
Hermes should create original ONIA content, generate carousel briefs, prepare public assets, and publish to Instagram only from approved original media.

## Content rules
- Use ONIA context from `/root/.hermes/docs/ONIA.md`.
- Write in clear Spanish for Bolivian businesses.
- Prioritize practical business outcomes: leads, sales follow-up, customer service, automation, reporting, and less manual work.
- Use Pinterest as structural inspiration only.
- Do not copy images, layouts, exact text, brands, or third-party claims.

## Telegram Command Center

Telegram is the main operating inbox for content.

General route:

```bash
hermes-command telegram --message "<raw Telegram message>"
```

Dedicated Video Lab route:

```bash
video-lab telegram --message "<raw Telegram message>"
```

Use `hermes-command` for mixed requests such as project strategy, content plan,
automation status, Video Lab jobs and sales prep. It delegates video-specific
messages to `video-lab`.

## Content Factory

Every important piece should move through this state machine:

```text
idea
-> brief
-> waiting_approval
-> approved_for_generation
-> generated
-> approved_for_publish
-> published
```

Lanes:

- Sergio: founder-led, real process, trust, lessons and screen/workspace proof.
- ONIA: educational, systems, demos, automation, authority and conversion.
- Clients: approved offers, safe claims, no private data.

Daily content loop:

- 07:30: radar creative and opportunities.
- 08:00: choose one Sergio piece and one ONIA piece.
- 10:00: approval reminders.
- 15:00: platform copy and reuse package.
- 17:00: generated video review.
- 21:00: summary and blockers.

Hermes can automate planning, briefs, scripts, prompts, captions, reminders and
records. It cannot publish or contact without explicit approval.

## Carousel brief

Generate a brief:

```bash
carousel-generator --topic "IA para clinicas dentales" --objective "generar leads" --audience "clinicas dentales en Bolivia" --slides 6
```

Validated on VPS: the command returns structured JSON with `title`, `caption`, `hashtags`, `slides`, and `cta`.

The output includes:
- title
- caption
- hashtags
- slide headlines
- slide body copy
- visual prompts
- alt text
- CTA

## From brief to assets

Preferred flow:
1. Generate the carousel brief.
2. Create original images from the visual prompts.
3. Upload each image with `npm run upload:asset`.
4. Confirm each URL returns `image/png` or `image/jpeg`.
5. Publish with `ig-publish carousel_publish`.

Manual upload flow:

```powershell
$env:ASSET_FILE="C:\path\to\slide-1.png"
npm run upload:asset
```

Publish:

```bash
ig-publish carousel_publish --image-urls "URL_1,URL_2,URL_3" --caption "Caption"
```

## n8n role
n8n should orchestrate scheduling and approvals:
- weekly idea generation
- Telegram approval request
- publish after approval
- record `published_id`
- notify result

Hermes remains the brain:
- brand context
- content judgment
- prompt generation
- final command selection

## Where to Review and Respond

Sergio should normally respond in Telegram. Hermes should send compact
decisions there and use the Video Lab router response field `telegram_reply`.

For deeper review:

```powershell
ssh -L 9119:localhost:9119 root@187.77.16.63
```

Open:

```text
http://localhost:9119
```

Canonical records on the VPS:

```text
/root/.hermes/video-lab/jobs
/root/.hermes/video-lab/briefs
/root/.hermes/video-lab/outputs
```

Useful commands:

```text
Estado Video Lab
Siguiente Video Lab
Aprobar video <job_id>
Rehacer video <job_id>: <cambio>
Video generado <job_id>: <url_video>
Publicar video <job_id>
```

`Publicar video <job_id>` currently means Instagram only.

## Social Descriptions

Hermes must generate descriptions as platform copy, not as an afterthought.

Instagram uses the `caption` field. When Sergio says "descripcion de IG",
Hermes must map that to:

```text
instagram_caption -> ig-publish --caption
```

Caption formula:

```text
[hook or belief shift]

[problem/context]

[mechanism/offer]

[single CTA]

[3-8 hashtags]
```

TikTok and YouTube are planned channels. Until their APIs are connected, Hermes
prepares `tiktok_description`, `youtube_title`, `youtube_description` and
`youtube_tags`, but does not publish there.

## Pinterest references
Store references as notes in `/root/.hermes/references/pinterest.json`.

Recommended shape:

```json
{
  "url": "https://www.pinterest.com/pin/example",
  "tema": "automatizacion para ventas",
  "patron": "hook fuerte + errores comunes + CTA",
  "estilo": "limpio, alto contraste, corporativo",
  "notas": "usar ritmo y jerarquia, no copiar layout"
}
```

## Acceptance criteria
- Every published asset is original or owned by ONIA.
- Every Instagram URL is public and direct.
- Hermes reports `published_id` after publishing.
- Failed publishes include the exact Graph API error and next action.
