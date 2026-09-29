---
name: onia-router
description: Invocar al INICIO de cualquier trabajo en el monorepo onia-hermes. Enruta la tarea a su carril (A-L, onia-core, infra) y nombra el stack exacto de skills, el subagente y los docs fuente a usar. Es el índice maestro y el punto de entrada para "qué skill/agente uso para X" en ONIA/Hermes.
---

# ONIA Router — stack de skills por carril

Punto de entrada de toda sesión en `onia-hermes`. Antes de trabajar: identificá el
carril, cargá su stack, respetá las reglas duras. Fuente viva del mapa completo:
`hermes-content/docs/ONIA_SKILLS_STACK_Y_SUBAGENTES.md`.

> 📇 **Mapa problema → skill: [`STACK-POR-DOMINIO.md`](STACK-POR-DOMINIO.md).**
> Hay **196 skills globales + 9 plugins** instaladas. Esta tabla enruta por carril; ese
> archivo enruta por dominio (contenido/marketing · diseño/UI/UX · frontend · backend ·
> seguridad · research · proceso), que es como aparecen las tareas en la práctica.
> **Abrirlo antes de escribir la primera línea.**

> 🔴 **Los 6 subagentes de dominio fueron RETIRADOS el 2026-08-18** por duplicar lo que
> las skills ya dicen (`.claude/agents/_retirados/README.md`). **Pero siguen apareciendo
> como disponibles**, porque `_retirados/` quedó DENTRO de `.claude/agents/` y el harness
> descubre en forma recursiva. Si invocás a `web-factory-builder`, `onia-propuestas`,
> `dentalgest-migrations`, `hermes-automation`, `onia-integrations` u `onia-orchestrator`,
> vas a recibir una cápsula de estado congelado (uno dice "verificado 2026-07-03") y vas a
> reconstruir lo que la skill ya tenía. **No los uses.** Vivos: `onia-core-guardian`,
> `onia-crm-prospeccion`, `onia-creative-radar`.

## Cómo usar
1. **Identificá el carril** de la tarea (tabla abajo). Ante duda, ver
   `CLAUDE.md` §4 "Carriles (REGLA)" y `COORDINATION_MANIFEST.md`.
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
| **A** onia-center (panel Next.js) | `impeccable` `ui-ux-pro-max` `taste-design` `frontend-design:frontend-design` `frontend-patterns` `react-components` `shadcn-ui` `ui-styling` `nextjs-turbopack` `design-review` `emil-design-eng` | — *(retirado)* | `onia-web-factory` |
| **B** wf-landing (landings cliente) | `impeccable` `taste-design` `design`/`design-md` `image-to-code` `98669c11ca63:web-artifacts-builder` `landing-report` `land-and-deploy` `imagegen-frontend-web` `banner-design` `design-dna` (teardown de referencia → JSON de tokens/estilo/efectos; tipografía SIEMPRE verificada contra el CSS real, no a ojo) `gsap-*` (plugin oficial GreenSock, scrollytelling) | — *(retirado)* | `onia-web-factory` |
| **C** propuestas (comercial) | `article-writing` `make-pdf` `slides` `document-generate` `brand` | — *(retirado)* | `onia-propuestas` |
| **D** DentaGest · **E** GestiOS *(repos aparte)* | `database-migrations` `postgres-patterns` `backend-patterns` `api-design` `security-review` | `onia-core-guardian` | `onia-core` |
| **F** Bolivian Electric *(prospecto REAL desde 2026-08-24 — 10 puestos relevados, ver handoff)* | mismo stack backend | — | `onia-core` |
| **chatbot** (motor, guion, conocimiento, voz) | **cargar `onia-chatbot`** — ese archivo nombra el stack completo del carril | — *(retirados)* | `onia-chatbot` |
| **G** infra / n8n | `n8n-workflow-patterns` `n8n-mcp-tools-expert` `n8n-node-configuration` `n8n-code-javascript` `n8n-validation-expert` `docker-patterns` `deployment-patterns` | — *(retirados)* | — |
| **H** contenido · **J** video-remotion | **`diseno-contenido-onia` primero** (índice de imágenes, galería, packs y patrones) · `editor-videos` `ver-videos` `sacar-prompt` `hyperframes` `banner-design` `brand` + Higgsfield MCP | `onia-creative-radar` | — |
| **I** research/estrategia | `deep-research` `exa-search` `iterative-retrieval` `office-hours` | — | — |
| **K** yt-canal/meta-ads · **L** yt-ciencia-cuerpo | `article-writing` `deep-research` (L=salud/YMYL: fuentes obligatorias) + video stack | `onia-creative-radar` | — |
| **onia-core** | `database-migrations` `postgres-patterns` `api-design` `backend-patterns` `verification-loop` | `onia-core-guardian` | `onia-core` |
| **comercial/CRM** | `deep-research` (prospección con señal) | `onia-crm-prospeccion` | `onia-propuestas` |
| **fiscal / contable (propio + features ERP)** | `deep-research` (validar RND/DS vigentes) | — | `onia-contabilidad-bolivia` |
| **extracción web** (alta por URL · prospección) | **NO instalar scrapers nuevos** (ScrapeGraphAI evaluado y descartado). Crawl4AI del VPS + LiteLLM ya resuelven: `scripts/alta-por-extraccion.py`. Doc: `hermes-content/docs/platform/ONIA_EXTRACCION_WEB_DECISION.md` | `onia-crm-prospeccion` | — |

## Reglas duras que aplican SIEMPRE (de CLAUDE.md)
- 🎯 **Antes de elegir carril, leer `hermes-content/docs/ONIA_ESTRATEGIA_DE_EMPRESA.md`.**
  Dice cuál es la **etapa vigente** del negocio y su criterio de salida numérico. Una tarea que
  no sirve a esa etapa **se anota como pendiente y NO se hace** — por buena que sea. Ahí está
  también la respuesta medida a "¿necesitamos financiación / equipo de desarrollo?" (no: el
  break-even son 5 clientes), y por qué **abrir una línea de negocio nueva es la decisión más
  cara disponible** con una sola persona.
- **Objetivo único por sesión.** Definirlo al inicio; no descarrilar; terminarlo antes de cerrar.
- **Carriles = 1 sesión = 1 worktree = 1 rama.** Un subagente nunca edita archivos de otro carril.
  Verificar `git branch --show-current` y rutas del worktree antes de gatear/commitear.
- **`main` SIEMPRE compila.** Si el avance toca `web-factory/apps/site/**`, `tsc --noEmit` verde
  antes de FF de `main`. Nunca filtrar WIP parcial (import a archivo nuevo → van los dos o ninguno).
- **Auto-sync activado** (hook Stop `scripts/git-autosync.js`): commitear al terminar; respeta `.gitignore`.
- **Autonomía máxima:** MCP → CLI/API → skill → script → recién ahí preguntar.
- **Gasto de plataformas externas — imagen y video NO son el mismo permiso** (corregido 2026-08-23):
  **VIDEO generado** (Higgsfield, ElevenLabs, fal.ai) = permiso explícito caso por caso, cotizado
  con `get_cost:true` ANTES. **IMAGEN en lote chico** = gasto trivial ya validado (`text2image_soul_v2` a 2k son
  ~0,12 créditos); se genera y se registra el lote. Permiso sigue haciendo falta para volumen grande
  o para dar de alta una plataforma nueva.
- **Bolivia:** todo desarrollo acomodado a Bolivia con contaduría boliviana específica y vigente;
  validar con research (fuente citada) antes de codear temas de Bolivia.

## Skills ONIA propias (este repo, `.claude/skills/`)
- `onia-router` — este índice.
- `onia-chatbot` — stack del carril del chatbot (motor, conocimiento, canal, modelo, voz).
- `onia-propuestas` — propuestas comerciales (generador oficial, nunca HTML a mano).
- `onia-contabilidad-bolivia` — fiscalidad boliviana propia + features contables de los ERPs.
- `onia-core` — contrato del núcleo, adapters, adopción en productos.
- `onia-web-factory` — construir/rediseñar webs anti-template con gates.
