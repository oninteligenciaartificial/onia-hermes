---
name: onia-router
description: Invocar al INICIO de cualquier trabajo en el monorepo onia-hermes. Enruta la tarea a su carril (A-L, onia-core, infra) y nombra el stack exacto de skills, el subagente y los docs fuente a usar. Es el índice maestro y el punto de entrada para "qué skill/agente uso para X" en ONIA/Hermes.
---

# ONIA Router — stack de skills por carril

Punto de entrada de toda sesión en `onia-hermes`. Antes de trabajar: identificá el
carril, cargá su stack, respetá las reglas duras. Fuente viva del mapa completo:
`hermes-content/docs/ONIA_SKILLS_STACK_Y_SUBAGENTES.md`.

## Cómo usar
1. **Identificá el carril** de la tarea (tabla abajo). Ante duda, ver
   `CLAUDE.md` §"Desarrollo en paralelo — carriles" y `COORDINATION_MANIFEST.md`.
2. **Cargá el stack de proceso común** (siempre) + las skills del carril.
3. **Delegá al subagente del dominio** cuando la tarea tiene fan-out o varios ángulos.
4. **Respetá los gates** antes de mergear a `main`.

## Stack de proceso común (TODA sesión, cualquier carril)
`using-superpowers` · `brainstorming` (antes de construir) · `make-plan`/`writing-plans` ·
`test-driven-development` · `systematic-debugging`/`investigate` (bugs: no adivinar la causa) ·
`verification-before-completion` · `code-review` · `security-review` ·
`dispatching-parallel-agents` · `using-git-worktrees` · memoria vía `claude-mem`.

## Mapa carril → stack + subagente

| Carril / Proyecto | Skills núcleo | Subagente | Skill ONIA propia |
|---|---|---|---|
| **A** onia-center (panel Next.js) | `impeccable` `ui-ux-pro-max` `taste-design` `frontend-design` `frontend-patterns` `react-components` `shadcn-ui` `ui-styling` `nextjs-turbopack` `design-review` `emil-design-eng` | `web-factory-builder` | `onia-web-factory` |
| **B** wf-landing (landings cliente) | `impeccable` `taste-design` `design`/`design-md` `image-to-code` `web-artifacts-builder` `landing-report` `land-and-deploy` `imagegen-frontend-web` `banner-design` `design-dna` (teardown de referencia → JSON de tokens/estilo/efectos; tipografía SIEMPRE verificada contra el CSS real, no a ojo) `gsap-*` (plugin oficial GreenSock, scrollytelling) | `web-factory-builder` | `onia-web-factory` |
| **C** propuestas (comercial) | `article-writing` `make-pdf` `slides` `document-generate` `brand` | `onia-propuestas` | `onia-propuestas` |
| **D** DentaGest · **E** GestiOS *(repos aparte)* | `database-migrations` `postgres-patterns` `backend-patterns` `api-design` `security-review` | `dentalgest-migrations` · `onia-core-guardian` | `onia-core` |
| **F** Bolivian Electric *(cliente, solo lectura)* | mismo stack backend | — | `onia-core` |
| **G** infra / n8n | `n8n-workflow-patterns` `n8n-mcp-tools-expert` `n8n-node-configuration` `n8n-code-javascript` `n8n-validation-expert` `docker-patterns` `deployment-patterns` | `hermes-automation` · `onia-integrations` | — |
| **H** contenido · **J** video-remotion | `remotion` `remotion-video-creation` `video-editing` `banner-design` `brand` + Higgsfield MCP | `onia-creative-radar` | — |
| **I** research/estrategia | `deep-research` `exa-search` `market-research` `iterative-retrieval` `office-hours` | — | — |
| **K** yt-canal/meta-ads · **L** yt-ciencia-cuerpo | `article-writing` `deep-research` (L=salud/YMYL: fuentes obligatorias) + video stack | `onia-creative-radar` · `onia-integrations` | — |
| **onia-core** | `database-migrations` `postgres-patterns` `api-design` `backend-patterns` `verification-loop` | `onia-core-guardian` | `onia-core` |
| **comercial/CRM** | `deep-research` (prospección con señal) | `onia-crm-prospeccion` | `onia-propuestas` |
| **fiscal / contable (propio + features ERP)** | `deep-research` (validar RND/DS vigentes) | — | `onia-contabilidad-bolivia` |
| **extracción web** (alta por URL · prospección) | **NO instalar scrapers nuevos** (ScrapeGraphAI evaluado y descartado). Crawl4AI del VPS + LiteLLM ya resuelven: `scripts/alta-por-extraccion.py`. Doc: `docs/platform/ONIA_EXTRACCION_WEB_DECISION.md` | `onia-crm-prospeccion` · `hermes-automation` | — |

## Reglas duras que aplican SIEMPRE (de CLAUDE.md)
- **Objetivo único por sesión.** Definirlo al inicio; no descarrilar; terminarlo antes de cerrar.
- **Carriles = 1 sesión = 1 worktree = 1 rama.** Un subagente nunca edita archivos de otro carril.
  Verificar `git branch --show-current` y rutas del worktree antes de gatear/commitear.
- **`main` SIEMPRE compila.** Si el avance toca `web-factory/apps/site/**`, `tsc --noEmit` verde
  antes de FF de `main`. Nunca filtrar WIP parcial (import a archivo nuevo → van los dos o ninguno).
- **Auto-sync activado** (hook Stop `scripts/git-autosync.js`): commitear al terminar; respeta `.gitignore`.
- **Autonomía máxima:** MCP → CLI/API → skill → script → recién ahí preguntar.
- **Gasto de plataformas externas** (Higgsfield, fal.ai, ElevenLabs, Meta): permiso explícito de
  Sergio caso por caso; por defecto modelos baratos; validar la idea antes de generar.
- **Bolivia:** todo desarrollo acomodado a Bolivia con contaduría boliviana específica y vigente;
  validar con research (fuente citada) antes de codear temas de Bolivia.

## Skills ONIA propias (este repo, `.claude/skills/`)
- `onia-router` — este índice.
- `onia-propuestas` — propuestas comerciales (generador oficial, nunca HTML a mano).
- `onia-contabilidad-bolivia` — fiscalidad boliviana propia + features contables de los ERPs.
- `onia-core` — contrato del núcleo, adapters, adopción en productos.
- `onia-web-factory` — construir/rediseñar webs anti-template con gates.
