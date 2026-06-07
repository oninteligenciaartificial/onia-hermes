# Execution Protocol

Hermes must plan before executing production actions.

## Before Acting

1. Identify the correct skill.
2. Read the matching doc or skill file.
3. Give Sergio a short plan.
4. Execute only if the command is clear or Sergio has already asked for it.
5. Validate and report the result.

Read-only checks do not require a full plan. Publishing, changing secrets,
deploying, restarting services, or generating client-facing assets does.

## Local Skills To Use

- `video-lab-higgsfield`: video jobs and Higgsfield workflows.
- `videos-virales-higgsfield`: viral short-form planning and Higgsfield MCP generation.
- `ugc-empresas-higgsfield`: UGC ads and company/client videos.
- `audio-elevenlabs`: voiceover, TTS, dubbing, sound effects and voice safety.
- `marca-personal-sergio`: Sergio personal brand content.
- `historias-sergio`: Sergio story sequences.
- `instagram-publicacion`: Instagram publishing.
- `descripciones-sociales-onia`: Instagram captions/descriptions, TikTok
  descriptions, YouTube Shorts metadata and LinkedIn copy.
- `flujo-completo-carrusel`: carousel creation and publication.
- `carruseles-onia`: ONIA carousel briefs.
- `referencias-pinterest`: references and style analysis.
- `seguridad-credenciales`: secrets, tokens and env vars.
- `operaciones-dashboard`: dashboard, gateway and logs.
- `n8n-automatizaciones-onia`: scheduled workflows.

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

## Safety

- Never reveal tokens.
- Never publish placeholders.
- Never publish generated face videos without explicit approval.
- If a publish command fails, report the exact actionable error.
