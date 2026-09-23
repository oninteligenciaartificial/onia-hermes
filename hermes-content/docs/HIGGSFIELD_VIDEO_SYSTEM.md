# Higgsfield Video System

Hermes uses Higgsfield as a replaceable video generation engine. Hermes keeps
strategy, approvals, publishing decisions and memory.

> **Estado vigente: 2026-09-22.** Este bloque reemplaza cualquier afirmación más
> abajo que declare MCP como ruta por defecto, fije una versión vieja de la CLI o
> trate costos/modelos/saldos históricos como actuales.

## Arquitectura vigente

| Superficie | Uso en ONIA | Decisión |
|---|---|---|
| **CLI + Skills oficiales** | Codex, Claude Code, jobs reproducibles, costo previo y metadatos | **Ruta principal** |
| **Web manual** | entrenar/revisar identidad, Elements, selección visual y QA | Manual; no fábrica headless |
| **MCP** | Claude web/desktop y otros agentes conversacionales | Secundario; no necesario para agentes de código |
| **API** | workers, colas, webhooks y volumen con presupuesto propio en USD | Fase posterior |
| **Playwright sobre la web** | inspección visual puntual | No usar para producción ni descargas automatizadas |

Higgsfield recomienda CLI + Skills para agentes de código porque reduce el
overhead de tokens y estructura el trabajo; MCP expone el esquema completo y se
orienta a agentes de chat. CLI y MCP usan los créditos del plan. La API es otro
producto, con saldo en USD y catálogo potencialmente distinto.

Skills instaladas en este repo para ambos agentes:

```text
.agents/skills/higgsfield-generate
.agents/skills/higgsfield-soul-id
.claude/skills/higgsfield-generate
.claude/skills/higgsfield-soul-id
```

La política ONIA manda sobre el default de terceros: aunque la Skill oficial no
pre-cotiza salvo que se lo pidan, ONIA **siempre** ejecuta `generate cost`, registra
la cotización y obtiene aprobación antes de generar cualquier imagen o video pago.

## Jerarquía de identidad de Lucía

```text
derechos/consentimiento resueltos
-> banco sintético coherente y aprobado
-> Soul ID candidato
-> A/B contra Elements vigentes
-> still aprobado
-> image-to-video / reference-to-video
-> QA de primer, medio y último frame
```

- Un prompt no es identidad.
- Una sola imagen de referencia puede servir para una toma, pero deriva al escalar.
- Soul ID produce stills reutilizables desde CLI/web. El Element vigente de Lucía funciona como
  ancla de alta fidelidad solo en la web y no es portable por la CLI actual.
- El video parte de un still aprobado. Text-to-video puro no es la ruta de Lucía.
- El Soul sintético v3 de seis imágenes es evidencia de un entrenamiento débil,
  no una prueba de que Soul ID sea inútil. La web actual recomienda 20 o más
  imágenes; la CLI instalada admite 5–20.
- No entrenar un nuevo Soul ni publicar a Lucía hasta cerrar el origen de derechos
  documentado en [`LUCIA.md`](../references/modelos/lucia/LUCIA.md).

Estado machine-readable:
`../references/modelos/lucia/LUCIA-HIGGSFIELD-IDENTITY.json`.

## Flujo de gasto obligatorio

```text
brief -> modelo/params resueltos en vivo -> cost preflight -> aprobación
-> una generación -> QA -> recién entonces variantes
```

Registrar por job: versión CLI, modelo técnico, parámetros, referencias, costo
previsto, costo real, request/job id, artefacto, decisión QA y responsable de
aprobación. Nunca imprimir `higgsfield auth token`.

## Fuentes actuales

Current public Higgsfield MCP endpoint:

```text
https://mcp.higgsfield.ai/mcp
```

Official notes from Higgsfield:

- CLI oficial para agentes de código: `npm i -g @higgsfield/cli`.
- Skills: `npx skills add higgsfield-ai/skills`.
- MCP alojado usa OAuth y no requiere API key.
- API usa credenciales y saldo separados del plan.
- Los jobs son asíncronos; CLI puede esperar o reanudar por job id.

Sources:

- https://higgsfield.ai/creator-hub/help-center/integrations/how-do-i-access-higgsfield-via-cli
- https://higgsfield.ai/creator-hub/help-center/ai-models/how-do-i-create-and-use-a-soul-id-character
- https://higgsfield.ai/creator-hub/help-center/integrations/what-is-the-higgsfield-api
- https://github.com/higgsfield-ai/cli
- https://github.com/higgsfield-ai/skills
- https://docs.higgsfield.ai/

## Hermes Rule

Higgsfield never publishes. Higgsfield only generates media.

Publishing belongs to:

```bash
ig-publish reel_publish --video-url <public_mp4_url> --caption "<caption>"
```

Only after explicit approval.

## Production Chain

```text
Telegram/Dashboard request
-> Hermes chooses lane and skill
-> Video Lab creates job
-> Sergio approves brief
-> Higgsfield generates video
-> Video Lab stores public MP4
-> Sergio reviews preview
-> Instagram publish after approval
```

## Generation Runbook

Higgsfield generation is a stage inside Video Lab, not a publisher.

States:

```text
waiting_approval -> approved_for_generation -> generating -> generated
-> approved_for_publish -> published
```

### Create job

```bash
video-lab telegram --message "Genera Reel ONIA: <tema> | <objetivo>"
```

### Approve generation

```bash
video-lab approve <job_id>
```

Telegram:

```text
Aprobar video <job_id>
```

### Generate in Higgsfield

Current mode:

- Hermes creates the approved brief.
- Codex/Claude Code uses the authenticated CLI; el navegador queda para Element/Marketing Studio
  y QA visual manual.
- Copy `higgsfield_prompt`, script and scenes from the job.
- Resolve live schema, run `higgsfield generate cost`, record approval and generate one first
  candidate. Variants only after QA justifies them.
- Export or obtain a public MP4 URL.

When Higgsfield MCP tools are available in a conversational agent, they may be used for discovery
or an explicitly approved operation. They do not replace CLI preflight, ledger or recovery rules.

### Sergio Soul ID runbook — historical snapshot 2026-06-04

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

### Store output

If the MP4 is local:

```powershell
$env:ASSET_FILE="C:\path\to\video.mp4"
npm run upload:asset
```

Then mark it:

```bash
video-lab mark_generated <job_id> --video-url <public_mp4_url>
```

Telegram:

```text
Video generado <job_id>: <public_mp4_url>
```

### Publish

Only after review:

```text
Publicar video <job_id>
```

## n8n Role

n8n is not required for the first videos.

Use Video Lab directly for manual creation:

```text
brief -> approve -> generate -> upload -> review -> publish
```

Use n8n when we want repeated orchestration:

- daily reminders for jobs waiting approval;
- Telegram approval buttons;
- polling async Higgsfield jobs;
- saving URLs, credits and statuses to Notion;
- updating the content calendar;
- sending review notifications;
- queueing approved publications.

n8n must never publish, contact prospects or deliver client videos without an
explicit approval event.

## Lanes

### Sergio

Use for:

- informal founder videos
- building in public
- behind the scenes
- work sessions
- lessons from Onia

Style:

- human
- imperfect
- direct
- phone-first
- founder-led

Do not use generated face or voice without approval.

### Onia

Use for:

- workflow demos
- automation explainers
- lead follow-up systems
- business before/after
- authority and conversion content

Style:

- educational
- visual
- clear
- premium but not fake

### Client

Use for:

- UGC-style ads
- offer videos
- product demos
- local business campaigns
- testimonial-style scripts

Every client job requires approval before delivery or publication.

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

> **Estructura del prompt en sí: [`ONIA_PLANTILLAS_PROMPT_VIDEO_20260818.md`](ONIA_PLANTILLAS_PROMPT_VIDEO_20260818.md)**
> (plantillas CINE y UGC). Lo de abajo es el sobre del job, no el texto del prompt.

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

## Success Metrics

For Sergio:

- watch time
- replies/DMs
- profile visits
- trust-building comments

For Onia:

- saves
- DMs
- lead inquiries
- demo requests

For clients:

- CTR
- cost per lead
- booking rate
- reply quality

## Commands

```text
Genera video Sergio: <idea>
Genera Reel ONIA: <tema> | <objetivo>
Crea video cliente: <negocio> | <oferta> | <estilo>
Estado Video Lab
Siguiente Video Lab
Aprobar video <job_id>
Rehacer video <job_id>: <cambio>
Video generado <job_id>: <url_video>
Publicar video <job_id>
```

## MCP Connection Behavior

When the Higgsfield MCP is available:

1. Analyze references before copying any style.
2. Extract structure, not assets.
3. Generate 2-3 prompt variants for important videos.
4. Prefer 9:16, 15-35 seconds, strong first 2 seconds.
5. Save all generated URLs and costs in the job JSON.
6. Send preview to Telegram/dashboard.
7. Publish only after `Publicar video <job_id>`.

## Safe Negative Prompt

Use this by default:

```text
No copyrighted logos unless provided by the brand. No third-party likeness. No
fake testimonials. No fake dashboards. No misleading financial claims. No
generated Sergio face unless explicitly approved. No placeholder text.
```
