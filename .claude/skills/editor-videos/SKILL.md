---
name: editor-videos
description: >
  Use when editing, cutting, or producing a talking-head / vertical (TikTok, Reels, Shorts) or
  landscape video: removing long silences, filler words ("eh", "este", "o sea") and retakes;
  adding burned karaoke subtitles; graphic overlays / lower-thirds; SFX and music; b-roll,
  images or mockups; or turning raw footage into a finished clip. The ONIA "sin editores
  humanos" pipeline (método Santiago). Trigger: "editá este video", "cortá los silencios",
  "ponle subtítulos", "hacelo para TikTok".
---

# Editor de Videos ONIA — edición 100% con código, sin editores humanos

## Overview
ONIA edita video con código (método del tutorial de Santiago): grabás crudo → Claude lo deja
finalizado. Esta skill **orquesta**, no reinventa el motor:

1. **Cortar** silencios / muletillas / trabadas — **pieza propia de ONIA** (`scripts/cut-plan.mjs` + ffmpeg). HyperFrames NO corta (el clip "plays untouched").
2. **Subtítulos** karaoke → delega en `embedded-captions` (matte de la persona, word-level).
3. **Overlays / gráficos** (lower-thirds, callouts, mockups) → delega en `talking-head-recut`.
4. **SFX + música** → librería de HyperFrames (`heygen-com/hyperframes`, ~85 eventos: whoosh, typing, keypress, pop, swish-pop en el CTA).
5. **Complementos** (imágenes, mockups, b-roll) → `image-gen` MCP / modelo barato; Higgsfield solo con OK.

## ⭐ REGLA DE ORO (de Santiago) — nunca cortar a ciegas
**La tabla de cortes + un preview 360p SIEMPRE se muestran a Sergio ANTES de aplicar el corte.**
Formato de la tabla: `# | Me quedo con | Tiro | Por qué`. Se aplica el corte recién con su OK.
Operativamente: el pipeline **publica el corte como review PENDIENTE** en la cola de aprobación del
panel (`scripts/publish-cut-review.mjs` → `video_projects` status `cut_review` + `review_queue`
`video_cut`) y **se detiene ahí**. El ffmpeg del corte corre recién cuando Sergio **aprueba** en
ONIA Center → Estudio de Contenido (Fase 5).

## 💸 Regla de gasto
Generación paga (Higgsfield, AssemblyAI, ElevenLabs) = **permiso explícito de Sergio caso por
caso** ([[gasto-plataformas-validar-primero]]). Por defecto todo gratis: Speaches (transcripción),
HyperFrames (render + SFX), imagen barata. Validar la idea antes de generar.

## Pipeline
1. **Setup + probe.** `videos/<name>/` con `raw/ scripts/ renders/ final/`. `ffprobe` la fuente.
   Para el paso de subtítulos: rechazar clips multi-orador, con subtítulos ya quemados, o sin
   voz clara (ver decision-gate de `embedded-captions`).
2. **Transcribir con timestamps.** Usar `ver-videos` → `scripts/transcribe.sh <audio>` (Speaches,
   gratis, `verbose_json` → `segments[]` + `words[]`). **Forzar `faster-whisper-small`** (el distil
   del contenedor es English-only y traduce el español). Guardar como `scripts/segments.json`.
3. **Cut-list.** `node scripts/cut-plan.mjs scripts/segments.json > scripts/cutplan.json`
   → detecta silencios largos (gap > umbral), muletillas y repeticiones → imprime la **tabla**
   (`# | Me quedo con | Tiro | Por qué`) + `keep[]` (segmentos a conservar) + el filtro ffmpeg.
4. **Publicar la review a la cola de aprobación del panel.** (Regla de oro, materializada.)
   `node scripts/publish-cut-review.mjs --cutplan scripts/cutplan.json --title "…" --video-key <slug> [--lane sergio] [--format vertical] [--aspect 9:16] [--preview-url <url>]`
   → genera el SQL de UPSERT para `video_projects` (status **`cut_review`**) + `review_queue`
   (`source_type='video_cut'`, `status='pending'`, `reviewer_role_key='sergio'`, `sensitive=true`).
   Por defecto es **DRY-RUN** (imprime el SQL; `--out file.sql` lo guarda). El orquestador aplica
   ese SQL por SSH a `supabase-db` — la skill **nunca escribe a producción**. Con esto la pieza
   aparece en **ONIA Center → Estudio de Contenido** como corte PENDIENTE de tu OK, con la tabla
   keep/cut y el preview 360p. **El pipeline queda esperando acá: NO corta.**
5. **Aplicar el corte — SOLO tras aprobar Sergio en el panel (Fase 5).** Recién con el OK en la cola
   de aprobación, el **worker de render LOCAL** aplica el corte:
   `node scripts/render-approved.mjs --video raw/<crudo>.mp4 --cutplan scripts/cutplan.json --video-key <slug> [--out-dir renders]`
   → reconstruye el filtro ffmpeg EXACTO desde `keep[]` (select/aselect + setpts, igual que
   cut-plan.mjs) → `renders/cut.mp4`. Por DEFECTO es **DRY-RUN**: imprime el comando ffmpeg + el SQL
   de UPDATE (`video_projects` status→**`ready`** + `render_url`; `review_queue` del `video_cut`
   → `approved`). Con **`--apply`** corre el ffmpeg **LOCAL de verdad** (permitido: es local, nunca
   el VPS) y **aun así solo imprime el SQL** — la escritura a producción la aplica el orquestador por
   SSH a `supabase-db`. El render corre en la máquina de Sergio / la sesión Claude Code, **nunca en el
   VPS**. **Nunca cortar a ciegas ni antes del OK.**
6. **Subtítulos karaoke.** Delegar en `embedded-captions` sobre `renders/cut.mp4`
   (identidad `anchor`/rail por defecto; embed solo en el pico). Estilo Santiago: MAYÚSCULAS,
   Space Grotesk Bold, highlight naranja `#FF7A00`.
7. **Overlays / gráficos.** Delegar en `talking-head-recut` (intro, lower-thirds, mockups desaturados).
8. **SFX + música.** Eventos de la librería HyperFrames (`assets/sfx` del repo) sincronizados a los cortes/CTA. Bajarla con la skill `media-use` si no está.
9. **Complementos.** `image-gen` MCP o modelo barato (ej. Gemini Flash-Lite Image) para mascot/thumbnails; Higgsfield (créditos 2354, [[higgsfield-models-roster]]) solo con OK.
10. **Verificar + exportar.** Revisar frames en tiempos clave (sync, color, fades) → `renders/final.mp4`.

## Quick reference
| Necesito | Herramienta | Costo |
| --- | --- | --- |
| Transcript + timestamps | `ver-videos` → Speaches | gratis |
| Cut-list (tabla de cortes) | `scripts/cut-plan.mjs` | gratis |
| Publicar el corte al panel para tu OK | `scripts/publish-cut-review.mjs` (DRY-RUN → SQL) | gratis |
| Aplicar el corte (tras OK) | `scripts/render-approved.mjs` (worker LOCAL, DRY-RUN → ffmpeg + SQL) | gratis |
| Subtítulos karaoke | `embedded-captions` | gratis (local) |
| Overlays / lower-thirds / mockups | `talking-head-recut` | gratis (local) |
| SFX / música | librería HyperFrames | gratis |
| Imágenes / b-roll / mascot | `image-gen` MCP / modelo barato | ~gratis |
| Video generativo / avatar | Higgsfield | **pago → OK Sergio** |

## Common mistakes
- **Cortar sin publicar la review + mostrar la tabla + preview** (viola la regla de oro). Correr
  `publish-cut-review.mjs` y esperar el OK de Sergio en el panel; el ffmpeg del corte va DESPUÉS.
- **Aplicar el SQL a producción desde la skill.** La skill es DRY-RUN (imprime SQL); lo aplica el
  orquestador por SSH a `supabase-db`.
- **Subtitular todo como embed** — la mayoría va al rail; embed solo el pico (ver `embedded-captions`).
- **Gastar en Higgsfield/AssemblyAI sin OK.** Default gratis.
- Usar el modelo distil en Speaches para español (traduce a inglés) — forzar `faster-whisper-small`.
- HyperFrames no determinista (`Math.random`/`Date.now`) → render roto. Solo lógica determinista.

## Relacionadas
`ver-videos` · `embedded-captions` · `talking-head-recut` · `hyperframes-cli` · `media-use` · [[onia-video-hyperframes]] · [[content-engine-remotion]].
