# Higgsfield Video System

Hermes uses Higgsfield as a replaceable video generation engine. Hermes keeps
strategy, approvals, publishing decisions and memory.

> **Estado vigente: 2026-09-22.** Este bloque reemplaza cualquier afirmación más
> abajo que declare MCP como ruta por defecto, fije una versión vieja de la CLI o
> trate costos/modelos/saldos históricos como actuales.

## Verificado en vivo 2026-09-29 — lo que cambió y lo que se aprendió

> Medido desde una sesión en la nube (Claude Code, entorno `Default`) con el MCP de Higgsfield
> conectado. Cada punto dice cómo se verificó. Si choca con algo de más abajo, gana esto.

**1. Identidad: se fija la cara ORIGINAL de Lucía; el resto se retira.** ⚠️ Corregido el mismo
día: primero se decidió «caras desde cero» sobre la premisa falsa de que Lucía venía de una
persona real. Sergio Urcullo la hizo 100% con IA y se conserva. Retirados de verdad: los que lista
el manifest en `deletion_scope_2026_09_29`. El inventario de lo que había, con qué era cada uno, está en
`historial/HIGGSFIELD_INVENTARIO_ANTES_DEL_BORRADO_20260929.md`.

**2. Borrar no existe fuera de la web.** El MCP rechaza `show_characters(action=delete)` con
*«Invalid action. Use one of: list, train, status»*; `show_reference_elements` solo acepta
`list/get/create`. El CLI oficial 1.1.26 (binario bajado de GitHub releases y verificado por
SHA256) tiene `soul-id create/get/list/wait` y **no conoce los Elements**. La API pública
(`docs.higgsfield.ai`) solo documenta generación. El borrado lo hace una persona logueada en la web.

**3. Términos (leídos en vivo, «Last updated: July 26, 2026»).**
- **5.2(iv)** prohíbe usar Outputs para entrenar cualquier modelo, *«except: (a) models that you
  create, train, or fine-tune using the Service with your own Inputs (not Outputs of Company's AI
  models); or (b) as expressly authorized in writing by Company»*.
- La ayuda oficial de *AI Influencer* dice hoy lo contrario en la práctica: *«generate a batch of
  its portraits and train a Soul ID on 20 or more of them»*.
- **Decisión de Sergio Urcullo (2026-09-29): «entrenamos con repos y guía».** La guía oficial se
  toma como la autorización escrita del 5.2(iv)(b) y se archiva su texto. Antes de **vender**
  modelos a clientes se pide confirmación escrita.
- **4.4:** las salidas son nuestras, se pueden sublicenciar a clientes y sobreviven a la baja de
  la cuenta. **5.2(i):** prohibido revender el servicio. **1.2:** MCP, CLI y API solo para uso
  propio o interno. Si mañana se venden modelos o publicidad, se venden las **salidas**, no el
  acceso a Higgsfield.
- **4.2(b) y 5.3:** para subir la cara de una persona real hace falta su consentimiento. ~~Por eso la
  cara anterior de Lucía no podía seguir~~ — **falso**: la cara de Lucía es 100% IA (corregido
  2026-09-29). La regla vale para caras de personas reales, como las fotos de Sergio Urcullo.
- **5.2(xi):** prohibido presentar una salida como hecha por humanos. **5.5:** declarar IA donde la
  ley lo pida. Coincide con la regla de Lucía: es IA y lo dice.

**4. Soul ID según la guía oficial (actualizada el 1-ago-2026).** Se entrena con **20 o más fotos
de una persona, hasta 80**. Funciona con Soul 2.0 y Soul Cinema. **Un Soul entrenado aparece solo
como Element**, y así se usa en video (Seedance, con @ Elements). El MCP entrena con 5 a 20
imágenes (`show_characters action=train`), así que el dataset v4 es de 20.

**5. Qué funciona desde una sesión en la nube.**
- **MCP: sí.** El tráfico de conectores no pasa por la red de la sesión.
- **CLI: no, por dos razones.** El entorno `Default` (red «Trusted») bloquea `higgsfield.ai`,
  `platform.higgsfield.ai` y los CDN de salida `d2ol7oe51mr4n9.cloudfront.net` y
  `d8j0ntlcm91z4.cloudfront.net`. Además, `higgsfield auth login` usa un callback de loopback, que
  sin navegador local no sirve. El CLI autenticado vive en el VPS.
- **Para que la sesión pueda MIRAR lo que genera**, el entorno necesita esos dominios en
  **Allowed domains** (red «Custom» más la lista por defecto). Sin eso, las imágenes solo se ven
  en el widget o en la web.

**6. Motores (costo cotizado con `get_cost` y confirmado en `transactions`).**

| Pedido | Nombre técnico del job | Tamaño real | Créditos |
|---|---|---|---|
| `soul_2`, quality 2k, 3:4 | `text2image_soul_v2` | 1536×2048 | 0,12 |
| `nano_banana_pro`, 2k, 3:4 | `nano_banana_2` | 1792×2400 | 2 |
| `nano_banana_pro`, 2k, 9:16 | `nano_banana_2` | 1536×2752 | 2 |
| `seedream_v4_5` basic, 9:16 | `seedream_v4_5` | 1440×2560 | 1 |
| `gpt_image_2_5` flare, high, 2k, 3:4 | `gpt_image_2_5` | 1744×2336 | 2,75 |
| `soul_cast` (budget 50) | `soul_cast` | 2048×1152 | 0,12 |

- `nano_banana_pro` figura como `nano_banana_2` en el job. Es el mismo pedido, no un cambio silencioso.
- `soul_cast` **ignora el prompt**: guarda `prompt: ""` e inventa un personaje con nombre e
  historia propios. No sirve para fijar rasgos.
- `gpt_image_2_5` dio **429 (rate limit)** al lanzar dos a la vez. Reintentado segundos después,
  pasó. No se cobra lo que no se envió.
- El «2k» de Soul 2.0 es 1536×2048, no 2048 en el lado corto.

**7. Superficies que expone el MCP (herramientas del conector, 2026-09-29).**
- Generación de imagen, video, audio y 3D, con lotes y `jobs_wait`.
- Entrenar Soul y crear Elements.
- Presets «viral» y Marketing Studio; Virality Predictor; análisis de video.
- Doblaje a 18 idiomas y clonación de voz.
- Upscale de imagen y video, reframe, quitar fondo, outpaint, motion control y Shorts Studio.
- Publicación en TikTok: la prepara el agente y la confirma la persona en el widget.
- Webs, apps y juegos en Cloudflare Workers, escenas 3D y un marketplace de apps.
- `sandbox_exec`: Linux con ffmpeg, ImageMagick, faster-whisper y Playwright. Ahí `hf` es
  **Hugging Face**, no Higgsfield.
- Workflows incluidos: `character-sheet`, `ad-multiplier`, `faceless-video`, `narrator`,
  `subtitles`, `thumbnail-generation`, `brand-asset-creation`, `website-builder-flow` y la
  familia `ugc-*` (saas, product, review, try-on, tutorial, unboxing, website).

**8. Cómo se consigue la misma cara desde una referencia (medido 2026-09-29).**
- **`<<<element_id>>>` en el prompt, por MCP, inyecta SOLO la primera foto del Element.** Se vio en
  los datos del job (`reference_elements` con 1 media aunque `lucia-skin-v1` tenga 7). Para que el
  modelo reciba todos los ángulos, se pasan las `media_ids` en `medias[]` con rol
  `image_references`. Así el job registra las 7.
- **Guía oficial de prompts** (skills de Higgsfield en `.agents/skills/higgsfield-generate/references/`):
  - menos de ~200 tokens, porque los prompts largos distorsionan;
  - con referencia, **describir lo que cambia** (escena, luz, ropa, gesto) y **no volver a
    describir la cara**;
  - frasear en positivo, porque casi ningún motor tiene negativo.
- **Motor según el catálogo oficial:**
  - cara metida en una escena compleja → **Seedream 4.5**;
  - personaje con referencias → **Nano Banana** (Pro en los casos difíciles);
  - Soul entrenado → **Soul 2.0** para fotos y **Soul Cinema** para cine.
- **Soul ID:** la guía del CLI dice 5–20 fotos (punto dulce 8–12); la web dice 20–80. Se usan
  **20**, variadas en ángulo, luz, expresión y distancia, de 1024 px o más, sin recortes de cara.

**9. Cómo se MIDE que es la misma cara, sin poder mirarla (2026-09-29, 0 créditos).**
- **Herramienta:** `scripts/face_identity_qa.py`. Usa ArcFace (insightface `buffalo_l`), la
  métrica con la que InstantID, PuLID y PhotoMaker reportan preservación de identidad. Corre en
  `sandbox_exec`, que tiene internet y llega al CDN aunque la sesión no: recibe URLs y devuelve
  solo números. Resultado completo: `references/modelos/lucia/v4/qa/identidad-metodos-20260929.json`.
- **Controles:**
  - la misma imagen espejada da 0,90–0,97;
  - caras de otras modelos IA (el casting) dan 0,22 o menos;
  - cada fuente original contra el centroide de las otras 7 da 0,70–0,82: ese es el piso de
    «es Lucía».
- **Resultado:** mismo prompt, coseno contra el centroide de las 8 fuentes.

  | Escena | Element + Nano Banana Pro | 7 fotos + Nano Banana Pro | 7 fotos + Seedream 4.5 |
  |---|---|---|---|
  | Café | 0,822 | 0,806 | **0,883** |
  | Calle, cara chica | 0,693 | 0,683 | **0,836** |

- **Lectura:**
  - **Seedream 4.5 con las 7 `media_ids` sostiene mejor la cara** (+0,06 en café, +0,14 en calle)
    y cuesta la mitad.
  - En Nano Banana Pro, dar 1 foto (Element) o 7 da lo mismo.
  - La muestra es chica (2 por motor). Se confirma puntuando cada foto del dataset.
- **Gate del dataset:** 0,70 o más contra el centroide de las fuentes; lo que quede debajo se
  regenera. La métrica **no ve belleza, piel ni realismo**: eso lo sigue mirando Sergio Urcullo.
- **Hallazgo:** la fuente `R2` (`1714a347`) tiene dos personas de fondo. No entra al entrenamiento
  del Soul, porque la guía pide «Single person per photo». Como referencia de generación sirve.
- **Los PNG que baja Higgsfield traen su job en el metadato `hf-job-id`** (medido el 30-sep). Un
  archivo del repo que salió de Higgsfield se vuelve a usar por job_id, para entrenar o medir, sin
  subirlo. Así apareció el photoshoot de 10 ángulos, que se daba por no subido.
- **El gate de 0,70 vale para caras frontales y de tres cuartos de 200 px o más.** Los perfiles bajan
  solos: la fuente casi perfil da 0,698 y el perfil del photoshoot, 0,689. Con la cara chica, por
  ejemplo en cuerpo entero, el número pierde confiabilidad: esos casos se miran.
- **Entornos:** el 30-sep Sergio Urcullo creó el entorno de nube `onia-higgsfield` para trabajar
  con Higgsfield. `Default` no cambió. El entorno se fija al crear la sesión: una sesión que ya
  estaba corriendo no lo toma.

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
v4 (2026-09-29, desde cero):
casting solo-texto (varios motores, procedencia registrada)
-> Sergio Urcullo aprueba UN master
-> photoshoot de rasgos marcados (turnaround, expresiones, primeros planos de marcas)
-> dataset de 20 fotos de la MISMA cara, con procedencia
-> Soul ID v4 (aparece solo como Element -> sirve para video)
-> Elements aparte para vestuario y lugares
-> still aprobado -> image-to-video -> QA de primer, medio y último frame
```

(Antes decía: derechos resueltos → banco sintético → Soul candidato → A/B contra los Elements
vigentes. El A/B quedó sin objeto: los Elements anteriores están retirados.)

- Un prompt no es identidad.
- Una sola imagen de referencia puede servir para una toma, pero deriva al escalar.
- Soul ID produce stills reutilizables desde CLI/web/MCP y, según la guía del 1-ago-2026,
  aparece solo como Element para video. (El Element de Lucía que acá se llamaba «vigente»,
  `58bbd635…`, está retirado desde el 2026-09-29.)
- El video parte de un still aprobado. Text-to-video puro no es la ruta de Lucía.
- El Soul sintético v3 de seis imágenes es evidencia de un entrenamiento débil,
  no una prueba de que Soul ID sea inútil. La web actual recomienda 20 o más
  imágenes; la CLI instalada admite 5–20.
- ~~No entrenar un nuevo Soul ni publicar a Lucía hasta cerrar el origen de derechos~~ —
  **resuelto el 2026-09-29 por reconstrucción**: la cara v4 nace solo de texto, sin linaje de la
  persona real. Entrenar sigue pidiendo OK específico de costo; publicar, aprobación explícita.

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
