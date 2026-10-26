# Ruteo anterior de comandos y skills · snapshot 25-oct-2026

**HISTORIA.** No prueba instalación, sesión, vigencia ni permiso de generar/publicar. Confirmar herramienta, esquema, destino y aprobación antes de usar estos comandos.



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
