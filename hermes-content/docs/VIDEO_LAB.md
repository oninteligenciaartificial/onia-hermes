# Video Lab

Hermes Video Lab coordinates video creation for Sergio, ONIA, and clients.
Hermes is the brain. Higgsfield or any other generator is only the rendering
engine.

## Main Principle

Do not put video generation directly inside the Instagram publisher.

Keep these layers separate:

- Hermes: intent, strategy, script, approvals, captions, memory.
- Video Lab: video job creation, generation, polling, storage.
- Audio Lab / ElevenLabs: voiceover, dubbing, sound effects and transcripts.
- Asset server: public MP4 hosting.
- Instagram publisher: final Reel publishing.

## Lanes

### Sergio

Purpose: personal brand, trust, founder journey, informal proof.

Best formats:

- Talking-head clips.
- Screen recordings.
- Work-in-progress videos.
- Day-in-the-life clips.
- Lessons from building ONIA.

Do not over-polish Sergio content. It should feel real.

### ONIA

Purpose: authority, education, demand generation, product proof.

Best formats:

- Workflow demos.
- Before/after business systems.
- Explainer Reels.
- Case studies.
- AI-generated concept videos.

### Clients

Purpose: produce marketing videos for external businesses.

Every client video needs:

- business type
- offer
- audience
- style
- approval status
- final delivery link

## Telegram Commands

- `Genera video Sergio: <idea>`
- `Crea avatar Sergio: <objetivo> | <variante>`
- `Genera Reel ONIA: <tema> | <objetivo>`
- `Crea video cliente: <negocio> | <oferta> | <estilo>`
- `Estado Video Lab`
- `Siguiente Video Lab`
- `Aprobar video <job_id>`
- `Rehacer video <job_id>: <cambio>`
- `Archivar video <job_id>`
- `Publicar video <job_id>`

Hermes should execute these through the router:

```bash
video-lab telegram --message "<raw Telegram message>"
```

The router returns JSON. Use `telegram_reply` for the user-facing response.

General Hermes/ONIA Telegram commands should use:

```bash
hermes-command telegram --message "<raw Telegram message>"
```

That command delegates Video Lab requests to this router and also handles
projects, planning, automation status and content-factory commands.

The active n8n Telegram entrypoint is `ONIA - Telegram Command Center`
(`vuicWsvh0hwqKhYs`).

## Donde se usan los comandos

Formato humano en Telegram:

```text
Genera video Sergio: <idea>
Siguiente Video Lab
Aprobar video <job_id>
```

Formato tecnico en terminal/VPS:

```bash
video-lab telegram --message "Genera video Sergio: <idea>"
```

Automatizacion n8n:

- Workflow: `ONIA - Telegram Command Center`
- ID: `vuicWsvh0hwqKhYs`
- Entrada: mensaje de Telegram.
- Accion: ejecuta `hermes-command telegram --message "<mensaje>"` en el VPS
  por SSH.
- Salida: devuelve `telegram_reply` a Telegram.
- Para el Command Center general, usar `hermes-command telegram --message
  "<mensaje>"`.

El dashboard no sustituye a Telegram. El dashboard sirve para revisar estado,
logs, lotes y actividad; Telegram es la bandeja operativa principal.

## Guia simple para crear un video

Para operar sin confundirse, Sergio debe pensar en tres pasos:

1. Pedir el video.
2. Aprobar el brief.
3. Revisar el MP4 antes de publicar.

### Paso 1: pedir el video

En Telegram se escribe el mensaje normal, sin `video-lab telegram --message`.

Sergio personal:

```text
Genera video Sergio: Por que estoy construyendo ONIA como sistema real y no como agencia generica
```

Avatar Sergio:

```text
Crea avatar Sergio: Tengo 16 anos y estoy construyendo ONIA como sistema real | black_operator_basic
```

ONIA:

```text
Genera Reel ONIA: WhatsApp leads que se pierden por falta de seguimiento | generar leads para auditoria de automatizacion
```

Cliente:

```text
Crea video cliente: tienda ecommerce local | botella termica premium para oficina y gimnasio | UGC natural, demostracion de producto, venta directa
```

Si Sergio esta trabajando desde terminal o VPS, el mismo mensaje se envuelve asi:

```bash
video-lab telegram --message "Genera video Sergio: Por que estoy construyendo ONIA como sistema real y no como agencia generica"
```

Para avatar desde terminal o VPS:

```bash
video-lab telegram --message "Crea avatar Sergio: Tengo 16 anos y estoy construyendo ONIA como sistema real | black_operator_basic"
```

### Paso 2: aprobar o corregir el brief

Hermes responde con `job_id`, hook, guion, escenas, caption y siguiente accion.

Si el brief esta bien:

```text
Aprobar video <job_id>
```

Si hay que cambiar algo:

```text
Rehacer video <job_id>: cambia el hook, hazlo mas directo y usa escena de escritorio con ropa negra
```

### Paso 3: revisar el video generado

Cuando el MP4 este listo, se registra asi:

```text
Video generado <job_id>: <url_video>
```

Despues Sergio revisa el preview. Si quiere publicar:

```text
Publicar video <job_id>
```

Publicar es una accion separada. Aprobar el brief no significa publicar.

## Como subir referencias para un video

Las referencias se usan como inspiracion estructural, no para copiar cara, voz,
frases, musica, branding ni edicion reconocible.

Opciones para pasar referencias:

- Subir el archivo directo al chat de Codex.
- Pasar links de Google Drive con acceso visible.
- Guardar los archivos en la carpeta local de referencias.
- Mandar el link junto al comando de Telegram.

Formato recomendado en Telegram:

```text
Genera video Sergio: quiero explicar por que ONIA no es una agencia generica.
Referencias:
<link 1>
<link 2>
Usa solo ritmo, estructura de hook y tipo de escena. No copies frases ni estilo exacto.
```

Para clientes:

```text
Crea video cliente: tienda ecommerce local | botella termica premium | UGC natural.
Referencias:
<link 1>
<link 2>
Extrae estructura, ritmo y tipo de demostracion. No copiar identidad del creador.
```

Hermes debe extraer:

- tipo de hook;
- ritmo de cortes;
- profundidad del guion;
- estructura de demostracion;
- recursos visuales utiles;
- CTA;
- riesgos de copia;
- escenas originales equivalentes para Sergio, ONIA o cliente.

Operational commands:

```bash
video-lab next
video-lab archive <job_id>
```

Use `next` to show only actionable jobs. Use `archive` to hide old test jobs
without deleting their history.

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

## Job States

- `draft_brief`
- `waiting_approval`
- `approved_for_generation`
- `generating`
- `generated`
- `needs_revision`
- `approved_for_publish`
- `published`
- `failed`

## Approval Rules

- Never publish generated videos automatically in phase 1.
- Videos with Sergio's face always require explicit approval.
- Client videos always require explicit approval.
- Generic ONIA B-roll may become semi-automatic later.

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

## Higgsfield Integration Plan

Before using Higgsfield, also read:

- `/root/.hermes/docs/HIGGSFIELD_VIDEO_SYSTEM.md`
- `/root/.hermes/docs/VIRAL_VIDEO_PLAYBOOK.md`
- `/root/.hermes/docs/UGC_CLIENT_VIDEO_PLAYBOOK.md`
- `/root/.hermes/references/higgsfield-video-presets.json`

Before using ElevenLabs, also read:

- `/root/.hermes/docs/ELEVENLABS_AUDIO_SYSTEM.md`
- `/root/.hermes/references/elevenlabs-audio-presets.json`

Phase 1:

- Hermes creates briefs, scripts, shot lists, captions and prompts.
- Sergio manually generates or approves generation.
- Telegram commands are routed through `video-lab telegram`.
- Higgsfield generation happens after `Aprobar video <job_id>`.
- The generated MP4 URL is saved with `Video generado <job_id>: <url_video>`.

Phase 2:

- Connect Higgsfield CLI/MCP to Video Lab.
- Connect ElevenLabs MCP/API to Audio Lab for voice drafts, dubbing and sound.
- Store output MP4 in the asset server.
- Send preview to Telegram.
- Use Higgsfield MCP only as a generation/analyzer engine, never as publisher.

Phase 3:

- Add retry, cost logging, model selection and template presets.

Phase 4:

- Add semi-automatic publishing only for approved templates.

## n8n Orchestration

n8n is optional for the first videos. Video Lab can run the whole MVP with
manual approval.

Use n8n when the workflow repeats:

- reminder for pending approvals;
- Telegram buttons for approve/revise/archive;
- polling Higgsfield jobs;
- storing MP4 URLs, credits and status in Notion;
- calendar scheduling;
- review notifications.

n8n cannot publish or deliver videos unless Sergio explicitly approves the
exact job.

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

- `/root/.hermes/docs/CROSS_PLATFORM_PUBLISHING.md`

## Model Guidance

Use Codex for implementation and operations:

- scripts
- deploys
- VPS
- Telegram integration
- logs
- asset server
- Instagram publishing

Use Claude or another creative model optionally for:

- ideation
- storytelling
- alternate hooks
- reviewing emotional quality

The production workflow must be model-agnostic.

## Output Package

Every generated plan should include:

- `job_id`
- `lane`
- `topic`
- `objective`
- `audience`
- `hook`
- `script`
- `shot_list`
- `visual_style`
- `model_recommendation`
- `caption`
- `approval_state`
- `next_action`

## Ficha Maestra de Video

Antes de generar, editar o publicar cualquier video, Hermes debe completar una
ficha unica. La ficha evita que el guion, el hook, las escenas, la cuenta y la
hora de publicacion se decidan al final.

Campos obligatorios:

- `account`: `sergio`, `onia` o `client`.
- `personality`: tono y comportamiento de la cuenta.
- `topic`: tema unico del video.
- `objective`: resultado buscado: confianza, lead, reserva, demo, autoridad,
  recordacion o venta.
- `audience`: publico exacto.
- `offer`: producto, servicio, auditoria, recurso o siguiente paso.
- `format`: talking head, demo de pantalla, concepto AI, UGC, historia,
  carousel-to-reel, testimonio o caso.
- `duration_seconds`: duracion objetivo.
- `hook`: primera frase o imagen de 1-2 segundos.
- `script`: guion hablado.
- `cta`: una accion final.
- `scenes`: lista de escenas con tiempo, visual, voz, overlay, assets y
  transicion.
- `visual_style`: camara, luz, colores, subtitulos, ritmo y B-roll.
- `audio_style`: voz real, voz AI aprobada, musica, efectos o silencio.
- `caption`: copy de Instagram.
- `publish_window`: dia y hora recomendada en Bolivia.
- `approval`: estado requerido antes de generar, entregar o publicar.
- `reuse_notes`: como reciclarlo en stories, LinkedIn, carrusel o email.

Personalidad por cuenta:

- Sergio: fundador informal, practico, honesto, construyendo en publico, sin
  tono de guru y sin promesas infladas.
- ONIA: claro, estrategico, educativo, orientado a sistemas y conversion.
- Cliente: seguro para marca, simple, centrado en beneficio y aprobado por el
  negocio.

Horarios base, hora Bolivia:

- Sergio: 8:00-9:30, 12:00-13:30 o 19:00-21:00.
- ONIA: 9:00-11:00 o 15:00-17:30.
- Clientes: 11:00-13:00 o 18:00-20:30.

Reglas rapidas:

- El hook debe entenderse sin contexto.
- El CTA debe ser uno solo.
- Las escenas deben cambiar ritmo cada 3-5 segundos.
- No usar datos privados, capturas de clientes o claims no comprobados.
- No automatizar WhatsApp hasta tener verificacion de negocio.
- Cara o voz AI de Sergio siempre requiere aprobacion explicita antes de
  publicar.
- `Crea avatar Sergio` crea el prompt, escenas y pack de referencia para
  Higgsfield; no renderiza ni publica automaticamente.

Referencia canonica:

- `hermes-content/references/video-brief-template.json`
