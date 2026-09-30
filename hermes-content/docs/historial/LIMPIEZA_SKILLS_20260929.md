# Limpieza de skills y agentes — 2026-09-29

> Foto de un día (historia, no fuente de verdad). Pedidos de Sergio Urcullo, en orden:
> *"borra lo que son skill que no usamos… mira el último mes"* · *"borralas las que no usemos,
> pero analiza con nuestros proyectos futuros si las usaremos"* · *"borra las que no usamos"*
> (globales) · *"revisa las skills de codex también"*.

## Cómo se midió
- **Ventana:** 30 días (2026-08-30 → 2026-09-29).
- **Evidencia real, no menciones:** invocar la skill, leer sus archivos o correr sus scripts,
  sacado de ~1.490 transcripts de Claude Code (con subagentes), **117 sesiones de Codex**
  (`~/.codex/sessions` **y** `~/.codex/archived_sessions`) y 88 sesiones + crons del bot Hermes.
- ⚠️ **Corrección de la misma sesión:** la primera pasada leyó solo `~/.codex/sessions` (23 de
  117). Con `archived_sessions` aparecieron usos de Codex que se habían pasado por alto; todo lo
  que Codex usó se restauró (abajo). **Para la próxima: las sesiones de Codex viven en DOS
  carpetas.**
- **Dependencias por código:** `git grep` de rutas `.claude/skills/…` / `.agents/skills/…` en
  scripts (así apareció `media-use`, librería de SFX de `editor-videos/scripts/sfx.mjs`).
- **Sesiones vivas consultadas:** *Marca personal* (avisó lo de `media-use`) y *Plataforma*
  (pidió actualizar el router en el mismo commit).
- **Mirada a futuro:** etapa vigente = Onia Platform + chatbot → 5 clientes; "congelar (no
  borrar)" lo demás (`ONIA_ESTRATEGIA_DE_EMPRESA.md` §7).

## 1. Repo onia-hermes — se borraron 52

| Qué | Por qué | Lo reemplaza |
|---|---|---|
| `.claude/skills/` (20): copias HyperFrames de julio (`hyperframes`, `-core`, `-cli`, `-animation`, `-creative`, `-keyframes`, `-registry`, `media-use`, `motion-graphics`, `talking-head-recut`, `embedded-captions`, `slideshow`, `remotion-to-hyperframes`, `general-video`) + plantillas sin uso (`changelog-video`, `faceless-explainer`, `figma`, `music-to-video`, `pr-to-video`, `product-launch-video`) | Duplicaban la copia global más nueva / 0 uso | Copia global (`~/.claude/skills`, `~/.codex/skills`); las plantillas se instalan con `npx hyperframes skills update <nombre>` |
| `.agents/skills/` (18): las mismas copias HyperFrames (salvo `media-use` y `embedded-captions`) + las 6 plantillas | Idem para Codex | `~/.codex/skills` (22 sep) |
| `hermes-content/skills/` (6): `actas-reuniones-onia`, `centro-comando-telegram`, `genera-propuesta`, `historias-onia`, `sistema-semanal-hermes`, `seguimiento-prospectos-onia` | 0 uso (local, Codex y bot) | `inteligencia-reuniones-onia` · Hermes Jarvis + `aprobaciones-onia` · `propuestas-comerciales-onia` + skill `onia-propuestas` · `historias-sergio` · `plan-semanal-onia` · barridos del chatbot + `crm-prospeccion-onia` |
| `.claude/agents/` (8): `_retirados/` (6), `onia-core-guardian`, `onia-creative-radar` | 0 uso; los retirados seguían apareciendo | Skills `onia-router`, `onia-propuestas`, `onia-web-factory`, `onia-core`, `diseno-contenido-onia`, `editor-videos` |

**Restauradas del historial git** (Codex las usó entre el 14 y el 28 de septiembre):
`.agents/skills/` `web-factory-design-research` · `web-factory-intake-assets` ·
`captions-overlay` · `motion-doctrine` · `cut-the-curve` · `oversized-cursor` · `seam-craft`;
`hermes-content/skills/` `videos-virales-higgsfield` · `orquestador-creativo-ia` ·
`crons-diarios-hermes` · `orquestacion-proyectos-onia`.

**Se quedaron sin uso reciente, a propósito:** `captions-overlay`/`cut-the-curve`/
`oversized-cursor`/`seam-craft` en `.claude` (las exige `motion-doctrine`) · `analiza-llamada`
(llamadas de venta tras la 1.0) · `audio-elevenlabs` (plan del canal ciencia-cuerpo, línea
congelada) · `consultoria-onia` (ingreso aceptado en la etapa 2) · `ugc-empresas-higgsfield`
(CLAUDE.md la cita) · agente `onia-crm-prospeccion` (la etapa vigente es vender).

## 2. Globales `~/.claude/skills` — 215 → 110
- Se sacaron 124 a una carpeta de archivadas, que **después se borró** (`Remove-Item`).
- La corrección de Codex mostró que 20 de esas 124 las usaba Codex. **15 se restauraron** desde
  copias locales: gstack (`browse`, `review`, `context-save`, `context-restore`,
  `devex-review`, `design-consultation`, `design-html`), ECC (`autonomous-loops`,
  `continuous-agent-loop`, `codebase-onboarding`, `architecture-decision-records`,
  `click-path-audit`) y el plugin caveman (`caveman-commit`, `caveman-help`, `caveman-review`).
  `mem-search`: Codex leyó la del plugin claude-mem, que sigue instalado.
- **Reinstaladas con OK de Sergio Urcullo** (no había copia local): `community-marketing` (24
  lecturas de Codex), `copy-editing`, `analytics`, `competitors`, con
  `npx skills add coreyhaines31/marketingskills -g -a claude-code -s <nombre> -y --copy` (de a una,
  como copia: `~/.agents/skills` ya es un enlace a `~/.claude/skills`).
- Se quedan 63 sin uso reciente: 14 HyperFrames (el repo depende de la copia global), 48 que
  nombran los stacks curados (router, `onia-chatbot`, `onia-web-factory`, CLAUDE.md de
  onia-platform) y `design-system` (`design` y `slides` corren sus scripts).
- `~/.agents/skills` es un enlace a `~/.claude/skills`: Claude y Codex ven la misma carpeta.
  `~/.agents/.skill-lock.json` quedó con 42 entradas (su respaldo estaba en la carpeta borrada).
- Fuera (105): `_gstack-command` · `ab-testing` · `ai-first-engineering` · `ai-seo` · `aso` · `autoplan` · `benchmark` · `blueprint` · `careful` · `churn-prevention` · `claude-devfleet` · `co-marketing` · `codex` · `cold-email` · `compress` · `configure-ecc` · `cro` · `cso` · `customer-research` · `data-scraper-agent` · `deploy-to-vercel` · `design-shotgun` · `directory-submissions` · `document-release` · `emails` · `enhance-prompt` · `find-skills` · `free-tools` · `freeze` · `full-output-enforcement` · `gpt-taste` · `gstack-upgrade` · `guard` · `image` · `imagegen-frontend-mobile` · `ios-clean` · `ios-design-review` · `ios-fix` · `ios-qa` · `ios-sync` · `launch` · `learn` · `learned` · `marketing-council` · `marketing-ideas` · `marketing-loops` · `marketing-plan` · `marketing-psychology` · `mcp-server-patterns` · `mem-search` · `n8n-code-python` · `offers` · `open-gstack-browser` · `pair-agent` · `paywalls` · `plan-ceo-review` · `plan-design-review` · `plan-devex-review` · `plan-eng-review` · `plan-tune` · `popups` · `product-marketing` · `programmatic-seo` · `prospecting` · `public-relations` · `qa-only` · `referrals` · `remotion` · `remotion-video-creation` · `retro` · `revops` · `rules-distill` · `sales-enablement` · `schema` · `scrape` · `seo-audit` · `setup-browser-cookies` · `setup-deploy` · `setup-gbrain` · `ship` · `signup` · `site-architecture` · `skill-comply` · `skill-stocktake` · `skillify` · `sms` · `stitch-code-to-design` · `stitch-design-taste` · `stitch-extract-design-md` · `stitch-extract-static-html` · `stitch-generate-design` · `stitch-loop` · `stitch-manage-design-system` · `stitch-upload-to-stitch` · `sync-gbrain` · `unfreeze` · `vercel-cli-with-tokens` · `vercel-composition-patterns` · `vercel-optimize` · `vercel-react-best-practices` · `vercel-react-native-skills` · `vercel-react-view-transitions` · `version-bump` · `video` · `web-design-guidelines`.

## 3. Codex `~/.codex/skills` — 61 → 38
- 24 usadas + 14 protegidas (HyperFrames y las que rutea `CODEX_SKILL_ROUTING.md`). `.system/`
  no se tocó.
- 23 movidas a `~/.codex/skills-archivadas-20260929/` (con `_ARCHIVADAS.txt`):
  - 4 **propias de ONIA**, que no existían en ningún repo: `web-factory-commerce-storefront`,
    `web-factory-design-director`, `web-factory-visual-intake`, `ecommerce-motion-retention`.
    Copia versionada en `historial/skills-codex-congeladas-20260929/` (línea web congelada, no borrada).
  - 19 de terceros: `code-simplification` · `composition-patterns` · `deploy-to-vercel` · `design-system` · `frontend-ui-engineering` · `git-workflow-and-versioning` · `incremental-implementation` · `next-best-practices` · `next-cache-components` · `next-upgrade` · `performance-optimization` · `planning-and-task-breakdown` · `react-best-practices` · `security-and-hardening` · `shipping-and-launch` · `source-driven-development` · `using-agent-skills` · `vercel-optimize` · `web-design-guidelines`.
- Se quitó el junction roto `find-skills` (apuntaba a una skill global ya borrada).

## 4. Revisión de lo global que no son skills — **se deja todo** (decisión de Sergio Urcullo)
Medido en 30 días (y agentes/comandos en todo el historial desde el 21-jul). Sin cambios.
- **Agentes `~/.claude/agents` (43):** se usan 2 (`code-reviewer` 6, `security-reviewer` 3); 4 se
  usaron en jul/ago (`doc-updater`, `e2e-runner`, `architect`, `database-reviewer`); 37 nunca. Los
  que se usan de verdad son los de fábrica (`general-purpose` 180, `Explore` 6).
- **Comandos `~/.claude/commands` (72):** 0 en 30 días; solo `code-review` alguna vez (5, 7-ago).
- **Reglas `~/.claude/rules`:** se cargan en cada sesión `common` (15 KB), `web` (14 KB),
  `token-eficiente` (4 KB, sus 4 perfiles a la vez), `zh` (17,6 KB, traducción de `common`) y
  `README.md` (4,7 KB). Por lenguaje solo se activaron `typescript` y `python`.
- **Plugins (9):** se usan `superpowers`, `caveman`, `ponytail` y `claude-mem` (memoria en 187
  arranques, 306 sin memoria, 1.547 sesiones en segundo plano, buscador caído); sin uso
  `understand-anything`, `gsap-skills`, `cloudflare`, `document-skills`, `frontend-design`.
- **MCP:** Claude usa navegador, Chrome, tareas programadas, n8n, Gmail, Higgsfield, Vercel, Meta
  Ads, computer-use, Calendar, Supabase, visualize y Notion; sin uso o caídos: Figma, Gamma, Drive,
  Claude Docs, Meta Developer Tools, stitch, cloudflare(-docs), image-gen, postiz. Codex usa
  node_repl y n8n; sin uso stitch, higgsfield, agentation, facebook.

## Cómo recuperar algo
```bash
git checkout 9622ae6a -- <ruta>                                   # cualquier archivo del repo
npx hyperframes skills update <nombre>                            # un flujo de HyperFrames
mkdir -p ~/.claude/skills/<nombre> && cp ~/.claude/skills/gstack/<nombre>/SKILL.md ~/.claude/skills/<nombre>/  # gstack
cp -r ~/.claude/skills/everything-claude-code/skills/<nombre> ~/.claude/skills/  # una de ECC
mv ~/.codex/skills-archivadas-20260929/<nombre> ~/.codex/skills/  # una de Codex
```

## Quedó pendiente
- No borrar `~/.codex/skills-archivadas-20260929/` antes de un par de semanas.
- El bot conserva en `/root/.hermes/skills/` sus copias de las docs borradas: **Sergio Urcullo
  decidió dejarlas**.
- `gstack-upgrade` puede recrear sus sub-skills borradas.
- `scripts/genera-propuesta.js` / `scripts/webhook-propuestas.js`: generador viejo de propuestas.
- Docs narrativos que citan agentes borrados (`ONIA_SYSTEM_TASKBOARD_2026.md`,
  `ONIA_CONTENT_FACTORY_ORCHESTRATION_2026.md`, `ONIA_WEB_COMO_SE_VENDE.md`,
  `VIDEO_FACTORY_DESIGN.md`). (La cita de `S3-GUIONES.md` ya la corrigió marca personal: `be05d3d4`.)
