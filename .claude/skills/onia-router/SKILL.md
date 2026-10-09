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

> ♻️ **Restauración 2026-10-02 — la limpieza del 29-sep se revirtió en el repo.** Sergio
> Urcullo: con lo borrado, sus archivos dejaron de editarse como él quiere. Volvió todo lo que
> se borró de `.claude/skills/`, `.agents/skills/` y `hermes-content/skills/`, más los agentes
> `onia-core-guardian` y `onia-creative-radar` (copia: commit `9622ae6a`).
> **HyperFrames vuelve a vivir en el repo** (`hyperframes`, `-core`, `-cli`, `-animation`,
> `-creative`, `-keyframes`, `-registry`, `media-use`, `motion-graphics`, `talking-head-recut`,
> `embedded-captions`, `general-video`, `slideshow`, `remotion-to-hyperframes` y las plantillas
> de video) y **esa copia es la que manda**: en Claude Code una skill del proyecto gana sobre una
> global con el mismo nombre. **No** volvieron los 6 agentes de `_retirados/` (retirados el
> 18-ago). Detalle: `hermes-content/docs/historial/LIMPIEZA_SKILLS_20260929.md`.

## Cómo usar
1. **Identificá el carril** de la tarea (tabla abajo). Ante duda, ver
   `CLAUDE.md` §4 "Carriles (REGLA)" y `COORDINATION_MANIFEST.md`.
2. **Cargá el stack de proceso común** (siempre) + las skills del carril.
3. **Delegá en subagentes** (`general-purpose`/`Explore`; `onia-crm-prospeccion` para prospección)
   cuando la tarea tiene fan-out o varios ángulos.
4. **Respetá los gates** antes de mergear a `main`.

## Stack de proceso común (TODA sesión, cualquier carril)
**Corrección 2026-10-09:** cargar primero `equipo-de-agentes` (roles y loop) y
`aprender-de-todo` (referencias, 12 dimensiones y prueba de uso), también en Codex.
Las herramientas siguientes se aplican según la tarea; no iniciar orquestadores
ni ejecutar Git fuera del encargo de la madre.

`using-superpowers` · `brainstorming` (antes de construir) · `make-plan`/`writing-plans` ·
`test-driven-development` · `systematic-debugging`/`investigate` (bugs: no adivinar la causa) ·
`verification-before-completion` · `code-review` · `security-review` ·
`dispatching-parallel-agents` · `using-git-worktrees` · memoria vía `claude-mem`.

## Mapa carril → stack + subagente

| Carril / Proyecto | Skills núcleo | Subagente | Skill ONIA propia |
|---|---|---|---|
| **Referencia recibida** (link, reel, post, web, app, captura, audio o documento) | **`aprender-de-todo` primero**; link sin instrucción = aprender, no producir; después las skills por dimensión | Codex para ficha/síntesis con evidencia; revisión del carril | `aprender-de-todo` |
| **A** onia-center (panel Next.js) | `impeccable` `ui-ux-pro-max` `taste-design` `frontend-design:frontend-design` `frontend-patterns` `react-components` `shadcn-ui` `ui-styling` `nextjs-turbopack` `design-review` `emil-design-eng` | — | `onia-web-factory` |
| **B** wf-landing (landings cliente) | `impeccable` `taste-design` `design`/`design-md` `image-to-code` `98669c11ca63:web-artifacts-builder` `landing-report` `land-and-deploy` `imagegen-frontend-web` `banner-design` `design-dna` (teardown de referencia → JSON de tokens/estilo/efectos; tipografía SIEMPRE verificada contra el CSS real, no a ojo) `gsap-*` (plugin oficial GreenSock, scrollytelling) | — | `onia-web-factory` |
| **C** propuestas (comercial) | `article-writing` `make-pdf` `slides` `document-generate` `brand` | — | `onia-propuestas` |
| **D** DentaGest · **E** GestiOS *(repos aparte)* | `database-migrations` `postgres-patterns` `backend-patterns` `api-design` `security-review` | — | `onia-core` |
| **F** Bolivian Electric *(prospecto REAL desde 2026-08-24 — 10 puestos relevados, ver handoff)* | mismo stack backend | — | `onia-core` |
| **chatbot** (motor, guion, conocimiento, voz) | **cargar `onia-chatbot`** — ese archivo nombra el stack completo del carril | — | `onia-chatbot` |
| **hermes-jarvis** (Hermes, Telegram de Sergio Urcullo, su calendario, pedidos a Claude) | **cargar `onia-hermes-jarvis`** — método, trampas y pruebas del carril; estado en `handoff/hermes-jarvis.md` | — | `onia-hermes-jarvis` |
| **G** infra / n8n | `n8n-workflow-patterns` `n8n-mcp-tools-expert` `n8n-node-configuration` `n8n-code-javascript` `n8n-validation-expert` `docker-patterns` `deployment-patterns` | — | — |
| **H** contenido · **J** video-remotion | **`diseno-contenido-onia` primero** (índice de imágenes, galería, packs y patrones) · **`edicion-referentes` para todo video nuevo de Sergio Urcullo** (Santiago Muñoz / Erik Taveras por sus mecanismos medidos (sin copiar identidad ni guion), desde el 3-oct) · `editor-videos` `ver-videos` `sacar-prompt` `hyperframes` `banner-design` `brand` + Higgsfield MCP | — | — |
| **I** research/estrategia | `deep-research` `exa-search` `iterative-retrieval` `office-hours` | — | — |
| **K** yt-canal/meta-ads · **L** yt-ciencia-cuerpo | `article-writing` `deep-research` (L=salud/YMYL: fuentes obligatorias) + video stack | — | — |
| **onia-core** | `database-migrations` `postgres-patterns` `api-design` `backend-patterns` `verification-loop` | — | `onia-core` |
| **Ventas y pauta** (prospectos con señal, leads, demo, objeciones, Meta Ads, piezas A1/A2/G1-G5 y VSL) | **cargar `onia-ventas-pauta` primero** (método medido, trampas y fuentes; §9 = anuncio que vende y VSL de punta a punta) · `diseno-contenido-onia` para las piezas · `editor-videos` para las de persona | `onia-crm-prospeccion` | `onia-ventas-pauta` |
| **comercial/CRM** | `deep-research` (prospección con señal) | `onia-crm-prospeccion` | `onia-propuestas` |
| **fiscal / contable (propio + features ERP)** | `deep-research` (validar RND/DS vigentes) | — | `onia-contabilidad-bolivia` |
| **competencia por dentro** (cómo funcionan los programas rivales) | Leer primero `hermes-content/research/competencia/PRODUCTO_COMPETENCIA_RESUMEN.md` (1-oct: Dentalink, Doctocliq, TuDoc, AgendaPro, Citalo). Método que funcionó: centros de ayuda públicos + capturas Playwright; YouTube y Zendesk privado NO abren desde la nube (videos desde la PC); cuentas de prueba solo desde la PC (piden código al WhatsApp de Sergio Urcullo) | — | — |
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
  La madre verifica rama y ruta antes de integrar; en encargos Codex sin Git,
  el ejecutor comprueba solo la ruta y entrega para revisión (corrección 2026-10-09).
- **`main` SIEMPRE compila.** Si el avance toca `web-factory/apps/site/**`, `tsc --noEmit` verde
  antes de FF de `main`. Nunca filtrar WIP parcial (import a archivo nuevo → van los dos o ninguno).
- **Git según rol y encargo (corrección 2026-10-09):** Codex entrega a la madre;
  no ejecuta Git si el encargo lo prohíbe. No asumir autosync activo ni usarlo para
  publicar trabajo parcial. La madre integra lo revisado según `equipo-de-agentes`.
- **Auto-sync activado** (hook Stop `scripts/git-autosync.js`): commitear y pushear la rama al terminar;
  respeta `.gitignore`. **`main` solo por PR revisado** desde el 5-oct: el hook mueve `main` únicamente en la
  madre (`ONIA_AUTOSYNC_MAIN=1`) y el integrador (`ONIA_LOOP_ID=onia-cola`).
- **Autonomía máxima:** MCP → CLI/API → skill → script → recién ahí preguntar.
- **Gasto (actualizado 2026-10-09):** seguir `CLAUDE.md` §Higgsfield: pruebas pequeñas
  de imagen autorizadas el 8-oct, cotizadas y registradas, sin fraccionar lotes.
  Video, Soul, lotes grandes, cara/voz y plataformas nuevas conservan sus permisos.
  Los costos históricos no prueban precio ni saldo actual.
- **Bolivia:** todo desarrollo acomodado a Bolivia con contaduría boliviana específica y vigente;
  validar con research (fuente citada) antes de codear temas de Bolivia.

## Skills del repo (42 en `.claude/skills/` + 30 en `.agents/skills/`)
- **Aprendizaje transversal (2026-10-09):** `aprender-de-todo` — ficha por dimensión,
  destino canónico y prueba de aplicación.
- **Índice y operación:** `onia-router` (este índice) · `onia-continuidad` (arranque y rumbo de
  sesión) · `onia-infra` (VPS, Docker, n8n por SSH) · `onia-hermes-jarvis` (Hermes por Telegram:
  resumen, cierre, aduana, calendario, pedidos a Claude, y el workflow hermes-jarvis; 2026-10-01) ·
  `equipo-de-agentes` (EL MÉTODO desde el 9-oct: colas en loop por sesión, Codex, verificadores Haiku, solo lo publicado a Sergio Urcullo) ·
  `onia-sesion-madre` (la madre local ordena a las sesiones de la nube por mensaje: ids, canales
  medidos, formato).
- **Producto:** `onia-core` · `onia-chatbot` · `onia-contabilidad-bolivia`.
- **Venta:** `onia-propuestas` (generador oficial, nunca HTML a mano) · `onia-web-factory`.
- **Contenido y video:** `diseno-contenido-onia` (índice de diseño) · `edicion-referentes` (el molde de edición de los videos de Sergio Urcullo: recetas medidas de Santiago Muñoz y Erik Taveras + scripts) · `editor-videos` ·
  `ver-videos` · `sacar-prompt` · `higgsfield-generate` · `higgsfield-soul-id` ·
  `motion-doctrine` con sus rutas `cut-the-curve` `oversized-cursor` `seam-craft`
  `captions-overlay` (upstream HeyGen que no está en la copia global).
- **HyperFrames (restaurado 2026-10-02, gana sobre la copia global):** `hyperframes` (entrada
  obligatoria de todo video) · `hyperframes-core` · `-cli` · `-animation` · `-creative` ·
  `-keyframes` · `-registry` · `media-use` · `motion-graphics` · `talking-head-recut` ·
  `embedded-captions` · `general-video` · `slideshow` · `remotion-to-hyperframes` · plantillas
  `changelog-video` `faceless-explainer` `figma` `music-to-video` `pr-to-video`
  `product-launch-video`.
- **Codex (`.agents/skills/`):** `impeccable` · `embedded-captions` (gate de ortografía que cita
  `editor-videos`) · `media-use` (librería de SFX por defecto de `editor-videos/scripts/sfx.mjs`:
  **no borrar**) · `higgsfield-generate` · `higgsfield-soul-id` · `motion-doctrine` con
  `cut-the-curve` `oversized-cursor` `seam-craft` `captions-overlay` · `web-factory-design-research`
  · `web-factory-intake-assets` · y la misma copia de HyperFrames que `.claude/skills/`
  (restaurada 2026-10-02).
