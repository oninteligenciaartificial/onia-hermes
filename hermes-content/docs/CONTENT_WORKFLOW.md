# ONIA Content Workflow

## Purpose
Create original ONIA content for Instagram, LinkedIn, TikTok and future channels.

## Telegram Command Center

Use Telegram as the main inbox:

```bash
hermes-command telegram --message "<mensaje>"
```

Use this for content plans, Video Lab, project context, status and approvals.
Video-specific commands are delegated to `video-lab telegram`.

## Fabrica de contenido

Estados:

```text
idea -> brief -> aprobacion -> Higgsfield -> URL MP4 -> revision -> publicar
```

Lanes:

- Sergio: proceso real, fundador, confianza, aprendizaje.
- ONIA: demos, sistemas, educacion y conversion.
- Clientes: oferta aprobada, claims seguros, entrega revisada.

Loop diario recomendado:

- 07:30 radar creativo.
- 08:00 elegir 1 Sergio + 1 ONIA.
- 10:00 revisar aprobaciones.
- 15:00 captions y reutilizacion.
- 17:00 revisar MP4.
- 21:00 resumen y bloqueos.

## Carousel steps
1. Generate brief with `carousel-generator`.
2. Create original images from prompts.
3. Upload images to the public asset server.
4. Verify URLs return real image content.
5. Publish with `ig-publish carousel_publish`.
6. Report `published_id` to the user.

## Brief command

```bash
carousel-generator --topic "<tema>" --objective "<objetivo>" --audience "<audiencia>" --slides 6
```

This command has been validated on the VPS and returns structured JSON.

## Publishing command

```bash
ig-publish carousel_publish --image-urls "URL_1,URL_2,URL_3" --caption "<caption>"
```

## Pinterest references
Pinterest is inspiration only. Extract patterns and notes, never copy images, exact layout, text or claims.

Use:

```text
/root/.hermes/docs/STYLE_REFERENCES.md
```

Reference notes should capture hook type, narrative shape, slide rhythm, visual system, trust signals and CTA style.

## n8n
n8n is for scheduling and approval flows. Hermes keeps brand context and decides content structure.

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

## Acceptance criteria
- Every published asset is original or owned by ONIA.
- Every Instagram URL is public and direct.
- Hermes reports `published_id` after publishing.
- Failed publishes include the exact Graph API error and next action.
