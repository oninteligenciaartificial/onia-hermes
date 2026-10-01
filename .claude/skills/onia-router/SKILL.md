---
name: onia-router
description: Invocar al INICIO de cualquier trabajo en el monorepo onia-hermes. Enruta la tarea a su carril (A-L, onia-core, infra) y nombra el stack exacto de skills, el subagente y los docs fuente a usar. Es el índice maestro y el punto de entrada para "qué skill/agente uso para X" en ONIA/Hermes.
---

# ONIA Router — stack de skills por carril

Punto de entrada de toda sesión en `onia-hermes`. Antes de trabajar: identificá el
carril, cargá su stack, respetá las reglas duras. Fuente viva del mapa completo:
`hermes-content/docs/ONIA_SKILLS_STACK_Y_SUBAGENTES.md`.

> 📇 **Mapa problema → skill: [`STACK-POR-DOMINIO.md`](STACK-POR-DOMINIO.md).**
> Hay **110 skills globales + 9 plugins** instaladas (el 2026-09-29 se sacaron las que no
> usaban ni Claude ni Codex; ver el historial de la limpieza). Esta tabla enruta por carril; ese
> archivo enruta por dominio (contenido/marketing · diseño/UI/UX · frontend · backend ·
> seguridad · research · proceso), que es como aparecen las tareas en la práctica.
> **Abrirlo antes de escribir la primera línea.**

> 🧹 **Limpieza 2026-09-29:** se borraron 52 skills y agentes del repo sin uso en 30 días
> (`hermes-content/docs/historial/LIMPIEZA_SKILLS_20260929.md`: qué, por qué, qué lo
> reemplaza y cómo recuperarlo). **Único subagente ONIA propio: `onia-crm-prospeccion`.**
> Los otros 8 (los 6 retirados el 18-ago + `onia-core-guardian` + `onia-creative-radar`)
> ya no existen: su trabajo lo hacen las skills de la tabla. **HyperFrames** ya no vive en
> el repo: se usa la copia global (`~/.claude/skills`, `~/.codex/skills`) y cada flujo se
> instala cuando se pide con `npx hyperframes skills update <nombre>`.

## Cómo usar
1. **Identificá el carril** de la tarea (tabla abajo). Ante duda, ver
   `CLAUDE.md` §4 "Carriles (REGLA)" y `COORDINATION_MANIFEST.md`.
2. **Cargá el stack de proceso común** (siempre) + las skills del carril.
3. **Delegá en subagentes** (`general-purpose`/`Explore`; `onia-crm-prospeccion` para prospección)
   cuando la tarea tiene fan-out o varios ángulos.
4. **Respetá los gates** antes de mergear a `main`.

## Stack de proceso común (TODA sesión, cualquier carril)
`using-superpowers` · `brainstorming` (antes de construir) · `make-plan`/`writing-plans` ·
`test-driven-development` · `systematic-debugging`/`investigate` (bugs: no adivinar la causa) ·
`verification-before-completion` · `code-review` · `security-review` ·
`dispatching-parallel-agents` · `using-git-worktrees` · memoria vía `claude-mem`.

## Mapa carril → stack + subagente

| Carril / Proyecto | Skills núcleo | Subagente | Skill ONIA propia |
|---|---|---|---|
| **A** onia-center (panel Next.js) | `impeccable` `ui-ux-pro-max` `taste-design` `frontend-design:frontend-design` `frontend-patterns` `react-components` `shadcn-ui` `ui-styling` `nextjs-turbopack` `design-review` `emil-design-eng` | — | `onia-web-factory` |
| **B** wf-landing (landings cliente) | `impeccable` `taste-design` `design`/`design-md` `image-to-code` `98669c11ca63:web-artifacts-builder` `landing-report` `land-and-deploy` `imagegen-frontend-web` `banner-design` `design-dna` (teardown de referencia → JSON de tokens/estilo/efectos; tipografía SIEMPRE verificada contra el CSS real, no a ojo) `gsap-*` (plugin oficial GreenSock, scrollytelling) | — | `onia-web-factory` |
| **C** propuestas (comercial) | `article-writing` `make-pdf` `slides` `document-generate` `brand` | — | `onia-propuestas` |
| **D** DentaGest · **E** GestiOS *(repos aparte)* | `database-migrations` `postgres-patterns` `backend-patterns` `api-design` `security-review` | — | `onia-core` |
| **F** Bolivian Electric *(prospecto REAL desde 2026-08-24 — 10 puestos relevados, ver handoff)* | mismo stack backend | — | `onia-core` |
| **chatbot** (motor, guion, conocimiento, voz) | **cargar `onia-chatbot`** — ese archivo nombra el stack completo del carril | — | `onia-chatbot` |
| **G** infra / n8n | `n8n-workflow-patterns` `n8n-mcp-tools-expert` `n8n-node-configuration` `n8n-code-javascript` `n8n-validation-expert` `docker-patterns` `deployment-patterns` | — | — |
| **H** contenido · **J** video-remotion | **`diseno-contenido-onia` primero** (índice de imágenes, galería, packs y patrones) · `editor-videos` `ver-videos` `sacar-prompt` `hyperframes` `banner-design` `brand` + Higgsfield MCP | — | — |
| **I** research/estrategia | `deep-research` `exa-search` `iterative-retrieval` `office-hours` | — | — |
| **K** yt-canal/meta-ads · **L** yt-ciencia-cuerpo | `article-writing` `deep-research` (L=salud/YMYL: fuentes obligatorias) + video stack | — | — |
| **onia-core** | `database-migrations` `postgres-patterns` `api-design` `backend-patterns` `verification-loop` | — | `onia-core` |
| **Ventas y pauta** (prospectos con señal, leads, demo, objeciones, Meta Ads y piezas D1/D4) | **cargar `onia-ventas-pauta` primero** (método medido, trampas y fuentes) · `diseno-contenido-onia` para las piezas | `onia-crm-prospeccion` | `onia-ventas-pauta` |
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

## Skills del repo (19 en `.claude/skills/` + 12 en `.agents/skills/`, todas con uso en 30 días)
- **Índice y operación:** `onia-router` (este índice) · `onia-continuidad` (arranque y rumbo de
  sesión) · `onia-infra` (VPS, Docker, n8n por SSH).
- **Producto:** `onia-core` · `onia-chatbot` · `onia-contabilidad-bolivia`.
- **Venta:** `onia-propuestas` (generador oficial, nunca HTML a mano) · `onia-web-factory`.
- **Contenido y video:** `diseno-contenido-onia` (índice de diseño) · `editor-videos` ·
  `ver-videos` · `sacar-prompt` · `higgsfield-generate` · `higgsfield-soul-id` ·
  `motion-doctrine` con sus rutas `cut-the-curve` `oversized-cursor` `seam-craft`
  `captions-overlay` (upstream HeyGen que no está en la copia global).
- **Codex (`.agents/skills/`):** `impeccable` · `embedded-captions` (gate de ortografía que cita
  `editor-videos`) · `media-use` (librería de SFX por defecto de `editor-videos/scripts/sfx.mjs`:
  **no borrar**) · `higgsfield-generate` · `higgsfield-soul-id` · `motion-doctrine` con
  `cut-the-curve` `oversized-cursor` `seam-craft` `captions-overlay` · `web-factory-design-research`
  · `web-factory-intake-assets`.
