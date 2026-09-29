# Limpieza de skills y agentes — 2026-09-29

> Foto de un día (historia, no fuente de verdad). Pedido de Sergio Urcullo: *"borra lo que son
> skill que no usamos… mira el último mes"* y después *"borralas las que no usemos, pero analiza
> con nuestros proyectos futuros si las usaremos"*.

## Cómo se midió
- **Ventana:** 30 días (2026-08-30 → 2026-09-29).
- **Evidencia real, no menciones:** invocación de la skill (`Skill` tool), lectura de su archivo
  o ejecución de sus scripts, sacado de ~1.490 transcripts de Claude Code (con subagentes), 23
  sesiones de Codex y 88 sesiones + crons del bot Hermes en el VPS (`/root/.hermes/`).
- **Dependencias por código:** `git grep` de rutas `.claude/skills/…` y `.agents/skills/…` en
  scripts. Así apareció `media-use` (ver abajo), que ningún transcript mostraba.
- **Sesiones vivas consultadas:** *Marca personal* avisó que `editor-videos/scripts/sfx.mjs`
  usa `.agents/skills/media-use/audio/assets/sfx` como librería de SFX por defecto; *Plataforma*
  pidió actualizar el router en el mismo commit.
- **Mirada a futuro:** etapa vigente = Onia Platform + chatbot → 5 clientes, y "congelar (no
  borrar)" lo demás (`ONIA_ESTRATEGIA_DE_EMPRESA.md` §7). Se cruzó cada candidata con handoffs,
  `cola/` y planes de contenido.

## Borrado (63)

| Qué | Por qué | Lo reemplaza |
|---|---|---|
| `.claude/skills/`: `hyperframes`, `hyperframes-core`, `-cli`, `-animation`, `-creative`, `-keyframes`, `-registry`, `media-use`, `motion-graphics`, `talking-head-recut`, `embedded-captions`, `slideshow`, `remotion-to-hyperframes`, `general-video` (14) | Copias de julio; competían con la copia global | La copia global `~/.claude/skills` (refrescada 21-22 sep por `hyperframes init`) |
| `.agents/skills/`: las mismas 12 salvo `media-use` y `embedded-captions` | Idem, para Codex | `~/.codex/skills` (22 sep) |
| `changelog-video`, `faceless-explainer`, `figma`, `music-to-video`, `pr-to-video`, `product-launch-video` (en `.claude` y `.agents`) | 0 uso, ningún plan los nombra | Se instalan cuando se piden: `npx hyperframes skills update <nombre>` |
| `.agents/skills/`: `captions-overlay`, `motion-doctrine`, `cut-the-curve`, `oversized-cursor`, `seam-craft` | Codex nunca las abrió | La copia de `.claude/skills` (se queda) |
| `.agents/skills/web-factory-design-research`, `web-factory-intake-assets` | 0 uso desde junio; línea web congelada | `onia-web-factory` |
| `hermes-content/skills/genera-propuesta.md` | Flujo viejo; habla de "vendedor" | `propuestas-comerciales-onia` + skill `onia-propuestas` + generador oficial |
| `historias-onia.md` | 0 uso (bot incluido) | `historias-sergio` (cron del bot) |
| `videos-virales-higgsfield.md` | 0 uso | `video-lab-higgsfield` (17 sesiones del bot) |
| `orquestador-creativo-ia.md` | 0 uso | `radar-creativo-onia` + `diseno-contenido-onia` |
| `sistema-semanal-hermes.md` | 0 uso | `plan-semanal-onia` (cron activo) |
| `crons-diarios-hermes.md` | 0 uso | `brief-diario-onia` + `n8n-automatizaciones-onia` |
| `centro-comando-telegram.md` | 0 uso | Hermes Jarvis (`handoff/hermes-jarvis.md`) + `aprobaciones-onia` |
| `seguimiento-prospectos-onia.md` | 0 uso; el bot ni la tenía | Barridos de seguimiento del chatbot (n8n) + `crm-prospeccion-onia` |
| `orquestacion-proyectos-onia.md` | 0 uso; trata DentalGest/GestiOS como productos | Skill `onia-router` |
| `actas-reuniones-onia.md` | 0 uso | `inteligencia-reuniones-onia` + skill `docx` |
| `.claude/agents/_retirados/` (6 + README) | Retirados el 18-ago pero seguían apareciendo; `dentalgest-migrations` se invocó por error el 21-sep | Las skills (`onia-router`, `onia-propuestas`, `onia-web-factory`, skills de `onia-platform`) |
| `.claude/agents/onia-core-guardian.md` | Último uso 17-ago | Skill `onia-core` + `npm run validate:onia-core` |
| `.claude/agents/onia-creative-radar.md` | Último uso 22-ago | `diseno-contenido-onia` + `editor-videos` |

## Se quedaron sin uso reciente, a propósito
- `captions-overlay`, `cut-the-curve`, `oversized-cursor`, `seam-craft` (`.claude`): las exige
  `motion-doctrine`, que sí se usó (2-sep). Son upstream de HeyGen y no están en la copia global.
- `.agents/skills/media-use`: librería de SFX por defecto de `editor-videos/scripts/sfx.mjs`.
- `.agents/skills/embedded-captions`: tiene el gate de ortografía que cita `editor-videos`.
- `analiza-llamada`: su script existe (`scripts/analiza-transcripcion.js`) y las llamadas de
  venta arrancan después de publicar la 1.0 (etapa vigente).
- `audio-elevenlabs`: la usa el plan del canal ciencia-cuerpo (línea congelada, no borrada).
- `consultoria-onia`: la estrategia (etapa 2) la acepta como ingreso.
- `ugc-empresas-higgsfield`: CLAUDE.md la cita como detalle operativo.
- Agente `onia-crm-prospeccion`: la etapa vigente es vender; la auditoría de agentes lo conservó.

## Globales (`~/.claude/skills`, fuera del repo) — segunda pasada, mismo día
Sergio Urcullo: *"borra las que no usamos"*. De 215 globales, 28 tuvieron uso en 30 días.
De las 187 restantes:
- **Se quedan 63:** las 14 HyperFrames (el repo depende de la copia global desde esta
  limpieza), 48 que nombran los stacks curados (tabla de carriles del router, `onia-chatbot`,
  `onia-web-factory`, `ONIA_SKILLS_STACK_Y_SUBAGENTES.md`, CLAUDE.md de onia-platform y el
  global) y `design-system` (`design` y `slides` corren sus scripts).
- **Se archivaron 124** en `~/.claude/skills-archivadas-20260929/` (no se borraron: ahí están,
  fuera de lo que Claude y Codex cargan; `~/.agents/skills` es un enlace a la misma carpeta).
  `~/.agents/.skill-lock.json` bajó de 88 a 38 entradas (respaldo en `_skill-lock.backup.json`)
  para que `npx skills update` no las reinstale. `STACK-POR-DOMINIO.md` se podó igual.
- Archivadas: `_gstack-command` · `ab-testing` · `ai-first-engineering` · `ai-seo` · `analytics` · `architecture-decision-records` · `aso` · `autonomous-loops` · `autoplan` · `benchmark` · `blueprint` · `browse` · `careful` · `caveman-commit` · `caveman-help` · `caveman-review` · `churn-prevention` · `claude-devfleet` · `click-path-audit` · `co-marketing` · `codebase-onboarding` · `codex` · `cold-email` · `community-marketing` · `competitors` · `compress` · `configure-ecc` · `context-restore` · `context-save` · `continuous-agent-loop` · `copy-editing` · `cro` · `cso` · `customer-research` · `data-scraper-agent` · `deploy-to-vercel` · `design-consultation` · `design-html` · `design-shotgun` · `devex-review` · `directory-submissions` · `document-release` · `emails` · `enhance-prompt` · `find-skills` · `free-tools` · `freeze` · `full-output-enforcement` · `gpt-taste` · `gstack-upgrade` · `guard` · `image` · `imagegen-frontend-mobile` · `ios-clean` · `ios-design-review` · `ios-fix` · `ios-qa` · `ios-sync` · `launch` · `learn` · `learned` · `marketing-council` · `marketing-ideas` · `marketing-loops` · `marketing-plan` · `marketing-psychology` · `mcp-server-patterns` · `mem-search` · `n8n-code-python` · `offers` · `open-gstack-browser` · `pair-agent` · `paywalls` · `plan-ceo-review` · `plan-design-review` · `plan-devex-review` · `plan-eng-review` · `plan-tune` · `popups` · `product-marketing` · `programmatic-seo` · `prospecting` · `public-relations` · `qa-only` · `referrals` · `remotion` · `remotion-video-creation` · `retro` · `review` · `revops` · `rules-distill` · `sales-enablement` · `schema` · `scrape` · `seo-audit` · `setup-browser-cookies` · `setup-deploy` · `setup-gbrain` · `ship` · `signup` · `site-architecture` · `skill-comply` · `skill-stocktake` · `skillify` · `sms` · `stitch-code-to-design` · `stitch-design-taste` · `stitch-extract-design-md` · `stitch-extract-static-html` · `stitch-generate-design` · `stitch-loop` · `stitch-manage-design-system` · `stitch-upload-to-stitch` · `sync-gbrain` · `unfreeze` · `vercel-cli-with-tokens` · `vercel-composition-patterns` · `vercel-optimize` · `vercel-react-best-practices` · `vercel-react-native-skills` · `vercel-react-view-transitions` · `version-bump` · `video` · `web-design-guidelines`.

## Cómo recuperar algo
```bash
git checkout 9622ae6a -- <ruta>          # cualquier archivo borrado acá
npx hyperframes skills update <nombre>   # un flujo de HyperFrames
npx skills add heygen-com/hyperframes --skill <nombre>   # las internas de HeyGen
mv ~/.claude/skills-archivadas-20260929/<nombre> ~/.claude/skills/   # una global archivada
```

## Quedó pendiente (fuera de esta limpieza)
- Si gstack se actualiza (`gstack-upgrade`) puede volver a crear sus sub-skills archivadas.
- No se analizaron `~/.codex/skills` (62) ni los agentes globales de `~/.claude/agents/`.
- El bot conserva en `/root/.hermes/skills/` las 10 docs borradas del repo (el instalador del VPS
  solo agrega, no borra). **Sergio Urcullo decidió dejar esa copia.**
- `scripts/genera-propuesta.js` y `scripts/webhook-propuestas.js`: generador viejo de propuestas,
  paralelo al oficial.
- Docs narrativos que todavía citan agentes borrados (`ONIA_SYSTEM_TASKBOARD_2026.md`,
  `ONIA_CONTENT_FACTORY_ORCHESTRATION_2026.md`, `ONIA_WEB_COMO_SE_VENDE.md`,
  `VIDEO_FACTORY_DESIGN.md`) y `cola/plan-3-semanas/S3-GUIONES.md`, que cita
  `.agents/skills/hyperframes-cli/SKILL.md` (hoy en la copia global).
